import * as THREE from 'three';
import type { AfterimageRtViewConfig } from '../../core/types';
import type { AfterimageEffect, AfterimageDebug, EffectContext } from './shared';

/**
 * 残影方案 B · RT 反馈（v9s.57 → v9s.60，纯表现层）。
 *
 * 与克隆 ghost 池不同，走「离屏 RenderTarget + 逐帧反馈」：把目标角色单独渲到一张 RT
 * （layer 隔离、背景透明），旧帧累积残影经衰减 / 扩散后叠加当前帧，再合成到屏幕。
 *
 * v9s.60 观感 + 性能修正（对应用户「越叠越亮像发光 / 不要模糊 / 掉帧严重」）：
 *  - **不再发光**：旧 accum 把当前帧 `p.rgb + cur.rgb` 每帧**累加**，decay≈0.9 时稳态
 *    约 10× 本体亮度 → 饱和发白；再叠 Additive 合成更像发光。改为 `max(prev*decay, cur)`
 *    有界累积（当前帧恒为本体亮度，历史帧只做衰减拖尾），并在 compose 里**减去当前帧
 *    本体**只画「过去」的部分 → 不重复画角色、不累加、不发光。
 *  - **去掉模糊**：5-tap 十字 box blur 每像素 5 次采样、观感糊且费填充；整段移除，
 *    accum 只剩 prev + cur 两次采样。
 *  - **降开销**：`resolutionScale` 默认 0.35（填充率 ∝ scale²）；新增 `updateStride`
 *    时间降采样（默认 2）——每 N 帧才跑一次「角色重渲 + accum」这两个贵的 pass，
 *    其余帧只做一次便宜的 compose。累积 buffer 关掉深度缓冲。静止衰减完仍整套停跑。
 *
 * 保留 v9s.59 的相机缩放解耦：扩散锚定角色屏幕投影 + 历史帧按 prevDist/curDist 重投影。
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

/** accum pass：prev 衰减 + 相机重投影，与当前帧取 max（不累加 → 不会越叠越亮 / 发光） */
const ACCUM_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform sampler2D uCur;
  uniform vec2 uAnchor;    // 角色屏幕投影 uv（扩散中心）
  uniform float uDecay;
  uniform float uScale;    // >1 艺术扩散
  uniform float uZoom;     // 相机重投影比例 prevDist/curDist
  void main() {
    // 围绕角色 anchor 做扩散 + 相机重投影：历史帧随相机一起缩放，不粘屏
    float s = max(1e-3, uScale * uZoom);
    vec2 uv = uAnchor + (vUv - uAnchor) / s;
    vec4 p = texture2D(uPrev, uv) * uDecay;
    vec4 cur = texture2D(uCur, vUv);
    // 取最大而非相加：当前帧恒为本体亮度，历史帧只做衰减拖尾 → 有界、不发光
    gl_FragColor = vec4(max(p.rgb, cur.rgb), max(p.a, cur.a));
  }
`;

/** compose：只画「历史」部分（减去当前帧本体），避免重复叠加把角色画亮 */
const COMPOSE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uAcc;
  uniform sampler2D uCur;
  uniform float uIntensity;
  uniform vec3 uTint;
  uniform int uTintMode;  // 0 keep, 1 tint, 2 mono
  uniform int uMode;      // 0 add, 1 normal
  void main() {
    vec4 c = texture2D(uAcc, vUv);
    vec4 cur = texture2D(uCur, vUv);
    vec3 col = max(c.rgb - cur.rgb, vec3(0.0));
    float a = clamp(max(c.a - cur.a, 0.0), 0.0, 1.0);
    if (uTintMode == 1) col = mix(col, uTint, 0.5);
    else if (uTintMode == 2) col = uTint * a;
    if (uMode == 0) gl_FragColor = vec4(col * uIntensity, 1.0);
    else gl_FragColor = vec4(col * uIntensity, a * uIntensity);
  }
`;

export function createRtAfterimage(ctx: EffectContext, cfg: AfterimageRtViewConfig): AfterimageEffect {
  const { renderer, scene, camera } = ctx;
  const container = new THREE.Group();
  container.name = 'afterimage-rt';

  const resolutionScale = clamp(cfg.resolutionScale ?? 0.35, 0.2, 1);
  const worldScale = cfg.worldScale !== false; // 默认开：相机缩放解耦
  const refDistance = cfg.refDistance ?? 0;    // 0 = 首帧自学习
  const stride = clamp(Math.round(cfg.updateStride ?? 2), 1, 4);

  const rtOpts: THREE.RenderTargetOptions = {
    depthBuffer: true, stencilBuffer: false,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
  };
  const accOpts: THREE.RenderTargetOptions = {
    depthBuffer: false, stencilBuffer: false, // 累积缓冲不需要深度，省带宽 / 显存
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
  const accA = new THREE.WebGLRenderTarget(_size.x, _size.y, accOpts);
  const accB = new THREE.WebGLRenderTarget(_size.x, _size.y, accOpts);
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
      // 隔帧反馈时按 stride 补偿衰减，保持拖尾时长与帧率无关
      uDecay: { value: Math.pow(cfg.decay, stride) },
      uScale: { value: cfg.scale },
      uZoom: { value: 1 },
    },
    depthTest: false, depthWrite: false,
  });
  const matCompose = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: COMPOSE_FRAG,
    uniforms: {
      uAcc: { value: prev.texture },
      uCur: { value: rtCur.texture },
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
  let frameNo = 0;
  let forceFeedback = true;         // 首帧 / 状态切换 / 恢复时必须跑一次反馈

  function ensureSize(): void {
    targetSize(_size);
    const w = _size.x, h = _size.y;
    if (rtCur.width !== w || rtCur.height !== h) {
      rtCur.setSize(w, h); accA.setSize(w, h); accB.setSize(w, h);
      forceFeedback = true;         // 尺寸变了，旧累积缓冲无效
    }
  }

  function clearAcc(): void {
    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    renderer.getClearColor(_clearColor);
    const prevClearA = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(prev); renderer.clear(true, true, true);
    renderer.setRenderTarget(next); renderer.clear(true, true, true);
    renderer.setRenderTarget(prevTarget);
    renderer.setClearColor(_clearColor, prevClearA);
    renderer.autoClear = prevAutoClear;
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

  /** 一次完整反馈：角色重渲到 rtCur + accum 累积（2 个 render），并交换双缓冲 */
  function feedback(target: THREE.Object3D): void {
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
    matAccum.uniforms.uScale.value = 1 + (cfg.scale - 1) * distK;
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

    // 2) accum：prev 衰减 + 重投影，与当前帧取 max（合并原 decay / add，一个 pass）
    matAccum.uniforms.uPrev.value = prev.texture;
    renderer.setRenderTarget(next);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    drawQuad(matAccum);
    renderer.setRenderTarget(null);

    // 交换：prev 现在是本帧写好的最新累积，compose 直接用它
    const tmp = prev; prev = next; next = tmp;
  }

  function setState(key: string): void {
    if (key === lastState) return;
    clearAcc();
    lastState = key;
    halted = false;
    energy = 0;
    prevDist = 0;
    active = false;
    forceFeedback = true;
    frameNo = 0;
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
        if (!halted) { clearAcc(); halted = true; forceFeedback = true; }
        active = false;
        lastPasses = 0; lastPixels = 0;
        return;
      }
      active = true;
      frameNo++;
      const needFeedback = forceFeedback || frameNo % stride === 0;
      forceFeedback = false;

      // —— save 渲染器 / 相机 / 场景状态，结束时完整还原 ——
      const prevTarget = renderer.getRenderTarget();
      const prevAutoClear = renderer.autoClear;
      renderer.getClearColor(_clearColor);
      const prevClearA = renderer.getClearAlpha();
      const prevLayerMask = camera.layers.mask;
      const prevBg = scene.background;
      renderer.autoClear = false;

      if (needFeedback) feedback(target);

      // compose：只画历史残影，在已渲染的主画面上叠加、不清除（每帧都要，便宜）
      matCompose.uniforms.uAcc.value = prev.texture;
      renderer.setRenderTarget(null);
      drawQuad(matCompose);

      renderer.setRenderTarget(prevTarget);
      renderer.setClearColor(_clearColor, prevClearA);
      renderer.autoClear = prevAutoClear;
      camera.layers.mask = prevLayerMask;
      scene.background = prevBg;

      lastPasses = needFeedback ? 3 : 1;
      lastPixels = needFeedback
        ? rtCur.width * rtCur.height * 3
        : rtCur.width * rtCur.height;
    },
    reset() {
      clearAcc();
      active = false; halted = false; energy = 0; prevDist = 0; lastState = '';
      forceFeedback = true; frameNo = 0;
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
