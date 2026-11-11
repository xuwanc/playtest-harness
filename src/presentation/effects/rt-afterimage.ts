import * as THREE from 'three';
import type { AfterimageRtViewConfig } from '../../core/types';
import type { AfterimageEffect, AfterimageDebug, EffectContext } from './shared';

/**
 * 残影方案 B · RT 反馈（v9s.57 → v9s.59，纯表现层）。
 *
 * 与克隆 ghost 池不同，走「离屏 RenderTarget + 逐帧反馈」：把目标角色单独渲到一张 RT
 * （layer 隔离、背景透明），旧帧累积残影经衰减 / 扩散 / 模糊后叠加当前帧，再合成到屏幕。
 *
 * v9s.59 改进（对应用户 2/3/4 三条）：
 *  - **降采样** `resolutionScale`：三张 RT 按 drawingBuffer×scale 建，填充率降到 scale²，
 *    compose 时线性放大 → 顺带得到一次「免费」模糊。这是 RT 最有效的性能旋钮。
 *  - **低成本模糊** `blur`：在唯一的 accum pass 里做 5-tap 十字 box blur（不新增 pass），
 *    让拖尾随时间糊开、更像雾化残影。
 *  - **相机缩放解耦** `worldScale`：
 *      ① 扩散中心从写死的屏幕中心 (0.5,0.5) 改成**角色屏幕投影 anchor**（拖尾绕角色糊开，
 *         不再是「朝屏幕中心发散」）；
 *      ② 反馈采样按 `zoomRatio = prevDist/curDist` 做**重投影**——相机拉近/拉远时历史帧
 *         跟着一起缩放，不会像屏幕贴片一样粘住不动，视觉上「大小不随相机缩放」；
 *      ③ 扩散量与模糊半径按相机距离归一，保持世界尺度一致。
 *  - **性能优化**：把原 decay + add 两个全屏 quad 合并成 1 个 accum pass（4 render → 3）；
 *    静止且残影衰减到阈值后**整条管线停跑**；`clearAcc` 只在作用状态切换时做；
 *    复用 Vector2/Color/Vector3，稳态 0 分配。
 *
 * 纯表现，不碰 Core、不引入命中；只在 `cfg.bodyTypes` 上生效，进出作用角色清空缓冲。
 * 对主渲染的侵入只在 `update` 内完成 renderer / camera / scene 状态的 save/restore。
 */

const RT_LAYER = 1;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** accum pass：prev 衰减 + 5-tap 模糊 + 相机重投影，再叠加当前帧 cur（一次完成，省一个 quad） */
const ACCUM_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform sampler2D uCur;
  uniform vec2 uAnchor;    // 角色屏幕投影 uv（扩散中心）
  uniform vec2 uTexel;     // 1/RT尺寸，供模糊偏移
  uniform float uDecay;
  uniform float uScale;    // >1 艺术扩散
  uniform float uZoom;     // 相机重投影比例 prevDist/curDist
  uniform float uBlur;     // 模糊半径（RT 像素），0 = 关
  void main() {
    // 围绕角色 anchor 做扩散 + 相机重投影：历史帧随相机一起缩放，不粘屏
    float s = max(1e-3, uScale * uZoom);
    vec2 uv = uAnchor + (vUv - uAnchor) / s;
    vec4 p;
    if (uBlur > 0.0) {
      vec2 o = uTexel * uBlur;
      p = (texture2D(uPrev, uv) * 2.0
         + texture2D(uPrev, uv + vec2(o.x, 0.0))
         + texture2D(uPrev, uv - vec2(o.x, 0.0))
         + texture2D(uPrev, uv + vec2(0.0, o.y))
         + texture2D(uPrev, uv - vec2(0.0, o.y))) / 6.0;
    } else {
      p = texture2D(uPrev, uv);
    }
    p *= uDecay;
    vec4 cur = texture2D(uCur, vUv);
    gl_FragColor = vec4(p.rgb + cur.rgb, clamp(p.a + cur.a, 0.0, 1.0));
  }
`;

const COMPOSE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uAcc;
  uniform float uIntensity;
  uniform vec3 uTint;
  uniform int uTintMode;  // 0 keep, 1 tint, 2 mono
  uniform int uMode;      // 0 add, 1 normal
  void main() {
    vec4 c = texture2D(uAcc, vUv);
    vec3 col = c.rgb;
    float a = c.a;
    if (uTintMode == 1) col = mix(col, uTint, 0.5);
    else if (uTintMode == 2) col = uTint;
    if (uMode == 0) gl_FragColor = vec4(col * uIntensity, 1.0);
    else gl_FragColor = vec4(col * uIntensity, a * uIntensity);
  }
`;

export function createRtAfterimage(ctx: EffectContext, cfg: AfterimageRtViewConfig): AfterimageEffect {
  const { renderer, scene, camera } = ctx;
  const container = new THREE.Group();
  container.name = 'afterimage-rt';

  const resolutionScale = clamp(cfg.resolutionScale ?? 0.5, 0.2, 1);
  const blur = Math.max(0, cfg.blur ?? 0.8);
  const worldScale = cfg.worldScale !== false; // 默认开：相机缩放解耦
  const refDistance = cfg.refDistance ?? 0;    // 0 = 首帧自学习

  const rtOpts: THREE.RenderTargetOptions = {
    depthBuffer: true, stencilBuffer: false,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
  };
  const _size = new THREE.Vector2();
  const _clearColor = new THREE.Color();
  const _worldPos = new THREE.Vector3();
  const _ndc = new THREE.Vector3();

  function targetSize(out: THREE.Vector2): void {
    renderer.getDrawingBufferSize(out);
    out.set(Math.max(1, Math.floor(out.x * resolutionScale)), Math.max(1, Math.floor(out.y * resolutionScale)));
  }
  targetSize(_size);
  const rtCur = new THREE.WebGLRenderTarget(_size.x, _size.y, rtOpts);
  const accA = new THREE.WebGLRenderTarget(_size.x, _size.y, rtOpts);
  const accB = new THREE.WebGLRenderTarget(_size.x, _size.y, rtOpts);
  let prev = accA;
  let next = accB;

  const quadScene = new THREE.Scene();
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  const tintColor = new THREE.Color(cfg.color);

  const matAccum = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: ACCUM_FRAG,
    uniforms: {
      uPrev: { value: prev.texture },
      uCur: { value: rtCur.texture },
      uAnchor: { value: new THREE.Vector2(0.5, 0.5) },
      uTexel: { value: new THREE.Vector2(1 / _size.x, 1 / _size.y) },
      uDecay: { value: cfg.decay },
      uScale: { value: cfg.scale },
      uZoom: { value: 1 },
      uBlur: { value: blur },
    },
    depthTest: false, depthWrite: false,
  });
  const matCompose = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: COMPOSE_FRAG,
    uniforms: {
      uAcc: { value: next.texture },
      uIntensity: { value: cfg.intensity },
      uTint: { value: new THREE.Vector3(tintColor.r, tintColor.g, tintColor.b) },
      uTintMode: { value: cfg.tint === 'keep' ? 0 : cfg.tint === 'tint' ? 1 : 2 },
      uMode: { value: cfg.mode === 'add' ? 0 : 1 },
    },
    transparent: true,
    blending: cfg.mode === 'add' ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthTest: false, depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matCompose);
  quad.frustumCulled = false;
  quadScene.add(quad);

  // 灯光也要能进 layer 1，否则 RT 里角色全黑、叠加后不可见（主渲染仍用 layer 0）
  const lights: THREE.Light[] = [];
  scene.traverse((o) => {
    const l = o as THREE.Light;
    if ((l as unknown as { isLight?: boolean }).isLight) { l.layers.enable(RT_LAYER); lights.push(l); }
  });

  let active = false;
  let halted = false;               // 静止衰减完毕：整条管线停跑
  let energy = 0;                   // 残影能量估计，驱动停跑
  let lastState = '';               // 作用状态签名，用于「切换时才 clearAcc」
  let learnedRef = refDistance;     // 相机参考距离
  let prevDist = 0;                 // 上一帧相机到角色距离
  let lastPasses = 0;
  let lastPixels = 0;
  let lastZoom = 1;

  function ensureSize(): void {
    targetSize(_size);
    const w = _size.x, h = _size.y;
    if (rtCur.width !== w || rtCur.height !== h) {
      rtCur.setSize(w, h); accA.setSize(w, h); accB.setSize(w, h);
      (matAccum.uniforms.uTexel.value as THREE.Vector2).set(1 / w, 1 / h);
    }
  }

  function clearAcc(): void {
    const prevTarget = renderer.getRenderTarget();
    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(prev); renderer.clear(true, true, true);
    renderer.setRenderTarget(next); renderer.clear(true, true, true);
    renderer.setRenderTarget(prevTarget);
  }

  function drawQuad(mat: THREE.ShaderMaterial): void {
    quad.material = mat;
    renderer.render(quadScene, quadCam);
  }

  /** 角色世界坐标 → 屏幕 uv（扩散 anchor）。矩阵失效时退回屏幕中心。 */
  function anchorUv(target: THREE.Object3D, out: THREE.Vector2): void {
    if (!worldScale) { out.set(0.5, 0.5); return; }
    target.getWorldPosition(_worldPos);
    _ndc.copy(_worldPos).project(camera);
    if (Number.isFinite(_ndc.x) && Number.isFinite(_ndc.y)) out.set(_ndc.x * 0.5 + 0.5, _ndc.y * 0.5 + 0.5);
    else out.set(0.5, 0.5);
  }

  function run(target: THREE.Object3D): void {
    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    renderer.getClearColor(_clearColor);
    const prevClearA = renderer.getClearAlpha();
    const prevLayerMask = camera.layers.mask;
    const prevBg = scene.background;

    renderer.autoClear = false;

    // 相机到角色距离 → 世界尺度归一 + 历史帧重投影比例
    let zoom = 1, distK = 1;
    if (worldScale) {
      target.getWorldPosition(_worldPos);
      const curDist = camera.position.distanceTo(_worldPos);
      if (learnedRef <= 0 && curDist > 1e-3) learnedRef = curDist; // 首帧自学习参考距离
      const ref = learnedRef > 1e-3 ? learnedRef : (curDist > 1e-3 ? curDist : 1);
      distK = clamp(ref / Math.max(1e-3, curDist), 0.5, 2);
      zoom = prevDist > 1e-3 ? clamp(prevDist / Math.max(1e-3, curDist), 0.5, 2) : 1;
      prevDist = curDist;
    }
    lastZoom = zoom;
    // 扩散量 / 模糊半径按相机距离归一：相机拉远则屏幕上糊得更少，保持世界尺度恒定
    matAccum.uniforms.uScale.value = 1 + (cfg.scale - 1) * distK;
    matAccum.uniforms.uBlur.value = blur * distK;
    matAccum.uniforms.uZoom.value = zoom;
    anchorUv(target, matAccum.uniforms.uAnchor.value as THREE.Vector2);

    // 1) 角色单独渲到 rtCur（layer 1；灯光已 enable → 正常受光）
    target.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) m.layers.enable(RT_LAYER); });
    scene.background = null;
    camera.layers.set(RT_LAYER);
    renderer.setRenderTarget(rtCur);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    camera.layers.mask = prevLayerMask;
    scene.background = prevBg;

    // 2) accum：prev 衰减+模糊+重投影 + 当前帧叠加（合并原 decay / add，一个 pass）
    matAccum.uniforms.uPrev.value = prev.texture;
    renderer.setRenderTarget(next);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    drawQuad(matAccum);
    renderer.setRenderTarget(null);

    // 3) compose：next 合成到屏幕（在已渲染的主画面上叠加，不清除）
    matCompose.uniforms.uAcc.value = next.texture;
    drawQuad(matCompose);

    const tmp = prev; prev = next; next = tmp;

    renderer.setRenderTarget(prevTarget);
    renderer.setClearColor(_clearColor, prevClearA);
    renderer.autoClear = prevAutoClear;

    lastPasses = 3;
    lastPixels = rtCur.width * rtCur.height * 3;
  }

  function setState(key: string): void {
    if (key === lastState) return;
    clearAcc();
    lastState = key;
    halted = false;
    energy = 0;
    prevDist = 0;
    active = false;
  }

  return {
    container,
    update(_dt, target, _root, moving, bodyId) {
      const matched = cfg.enabled && (cfg.bodyTypes.length === 0 || cfg.bodyTypes.includes(bodyId));
      // 状态切换才清空累积缓冲，避免每帧 2 次 setRenderTarget + clear 的浪费
      if (!matched) { setState('off'); lastPasses = 0; lastPixels = 0; return; }
      setState('on');
      ensureSize();

      // 能量模型：移动时充满，静止逐帧衰减；衰减到阈值即整套管线停跑
      if (moving) { energy = 1; halted = false; }
      else energy *= cfg.decay;
      if (energy < 0.02) {
        if (!halted) { clearAcc(); halted = true; }
        active = false;
        lastPasses = 0; lastPixels = 0;
        return;
      }
      active = true;
      run(target);
    },
    reset() {
      clearAcc();
      active = false; halted = false; energy = 0; prevDist = 0; lastState = '';
      lastPasses = 0; lastPixels = 0;
    },
    debug(): AfterimageDebug {
      return {
        count: 3, active: active ? 1 : 0, spawning: false,
        passes: lastPasses, pixels: lastPixels, drawCalls: lastPasses, zoomRatio: lastZoom,
      };
    },
    dispose() {
      rtCur.dispose(); accA.dispose(); accB.dispose();
      quad.geometry.dispose();
      matAccum.dispose(); matCompose.dispose();
      for (const l of lights) l.layers.disable(RT_LAYER);
      container.clear();
    },
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
