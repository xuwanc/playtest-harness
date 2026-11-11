import * as THREE from 'three';
import type { AfterimageRtViewConfig } from '../../core/types';
import type { AfterimageEffect, AfterimageDebug, EffectContext } from './shared';

/**
 * 残影方案 B · RT 反馈（v9s.57 → v9s.61，纯表现层）。
 *
 * 与克隆 ghost 池不同，走「离屏 RenderTarget + 逐帧反馈」：把目标角色单独渲到一张 RT
 * （layer 隔离、背景透明），旧帧累积残影经衰减 / 扩散后叠加当前帧，再合成到屏幕。
 *
 * 历史修订：
 *  - v9s.60 去发光 / 去模糊 / 降开销：`max(prev*decay, cur)` 有界累积、compose 减当前帧；
 *    移除 5-tap blur；`resolutionScale` 0.35 + `updateStride` 时间降采样；静止停跑。
 *  - v9s.61 修「全黑」：v9s.60 的 accum **同时衰减 rgb 与 alpha**，compose 又
 *    `c.rgb - cur.rgb` 把历史颜色再削一次 —— 双重衰减后历史残影几乎为 0，肉眼就是全黑。
 *    现在 accum **只衰减 alpha（覆盖度 / 寿命），rgb 恒保留角色本色**；
 *    compose 直接用这份本色 + 历史覆盖度，不再减去当前帧颜色 → 拖影是角色自身的颜色，不黑。
 *  - v9s.61 修「墙后透视」：全屏 compose 天然无视深度，角色躲到墙后时残影会穿墙显示。
 *    用 `ctx.occluders` 做「相机 → 角色」射线可见度门控：完全被挡 → 清空累积缓冲并整套
 *    停跑（不透视、顺带省掉 3 个 pass）；部分遮挡 → 按可见比例调低合成强度。
 *    纯表现、零额外 render pass；不传 occluders 则不做遮挡，行为与之前一致。
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

/**
 * accum pass：prev 衰减 + 相机重投影，与当前帧取 max（不累加 → 不会越叠越亮 / 发光）。
 *
 * v9s.61：衰减只作用于 **alpha**（覆盖度 / 寿命），rgb 恒保留角色本色。
 *  - `p.rgb` 是上一帧该像素保留的角色颜色，不随寿命变暗；
 *  - 当前帧有角色的像素用 `cur.rgb` 刷新颜色，其余像素沿用历史颜色；
 *  - `a = max(life, cur.a)`：当前帧覆盖度为 1，历史像素按 decay 递减 → 拖尾自然淡出。
 */
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
    vec4 p = texture2D(uPrev, uv);
    vec4 cur = texture2D(uCur, vUv);
    float life = p.a * uDecay;                       // 只衰减覆盖度，不衰减颜色
    vec3 rgb = cur.a > 0.001 ? cur.rgb : p.rgb;     // 当前帧刷新颜色，其余保留本色
    float a = max(life, cur.a);                     // 当前帧本身就是最亮覆盖
    gl_FragColor = vec4(rgb, a);
  }
`;

/**
 * compose：只画「历史」部分（减去当前帧覆盖度），避免重复画角色。
 *
 * v9s.61：直接用累积缓冲里保留的 **角色本色**，不再 `c.rgb - cur.rgb`（那会把历史
 * 颜色削成黑）。`a` 同时承载历史覆盖度 × intensity × 遮挡可见度，add / normal 两种
 * 混合都走同一个 `vec4(col, a)` 输出，由 Three 的混合方程负责淡出。
 */
const COMPOSE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uAcc;
  uniform sampler2D uCur;
  uniform float uIntensity;
  uniform float uOcclusion;   // v9s.61：目标角色可见度 0..1（1=完全可见，0=被墙挡住）
  uniform vec3 uTint;
  uniform int uTintMode;  // 0 keep, 1 tint, 2 mono

  // RT 里存的是线性色（离屏 target 不做 sRGB 编码）。自定义 ShaderMaterial 不会自动走
  // Three 的 colorspace_fragment，直接输出到 sRGB 画布会把线性值当 sRGB 显示 → 明显发黑。
  // 这里手动转一次，拖影才是角色本体的真实亮度（用户反馈「全黑」的另一半原因）。
  vec3 linearToSRGB(vec3 c) {
    c = max(c, vec3(0.0));
    return mix(1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, 12.92 * c, step(c, vec3(0.0031308)));
  }
  void main() {
    vec4 c = texture2D(uAcc, vUv);
    vec4 cur = texture2D(uCur, vUv);
    vec3 col = c.rgb;                                  // 角色本色，不再被减去 / 双重衰减
    float a = clamp(max(c.a - cur.a, 0.0), 0.0, 1.0) * uIntensity * uOcclusion;
    if (uTintMode == 1) col = mix(col, uTint, 0.5);
    else if (uTintMode == 2) col = uTint;
    gl_FragColor = vec4(linearToSRGB(col), a);
  }
`;

/** 相机 → 角色的射线采样点（沿角色竖直包围盒的比例），3 条射线够判定「是否穿墙」 */
const OCCLUSION_SAMPLES = [0.2, 0.5, 0.8] as const;

/**
 * 导出 shader 源码供单测锁定契约：accum 只能衰减 alpha、compose 不能减去当前帧颜色。
 * 这两条是 v9s.61「拖影全黑」的根因，锁住避免后续改回去。
 */
export const RT_SHADERS = { accum: ACCUM_FRAG, compose: COMPOSE_FRAG } as const;

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
      uOcclusion: { value: 1 },
      uTint: { value: new THREE.Vector3(tintColor.r, tintColor.g, tintColor.b) },
      uTintMode: { value: cfg.tint === 'keep' ? 0 : cfg.tint === 'tint' ? 1 : 2 },
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

  // v9s.61：遮挡物只收不透明 mesh（墙 / 障碍），且展平一次，避免每帧 traverse 与
  // 误命中挂在盒子上的 LineSegments（线框的 raycast threshold 默认 1 米，会假遮挡）。
  const occluderMeshes: THREE.Mesh[] = [];
  for (const o of ctx.occluders ?? []) {
    o.traverse((c) => { if ((c as THREE.Mesh).isMesh) occluderMeshes.push(c as THREE.Mesh); });
  }
  const raycaster = new THREE.Raycaster();
  const _box = new THREE.Box3();
  const _sample = new THREE.Vector3();
  const _rayDir = new THREE.Vector3();

  /**
   * 「相机 → 角色」射线可见度 0..1。三条射线分别打在角色竖向下 / 中 / 上部：
   * 全被遮挡物挡住 = 0（整体不画残影 → 不透视）；部分露出 = 可见比例（拖影整体变淡）。
   * 不传 occluders 时恒为 1，零成本。
   */
  function computeOcclusion(target: THREE.Object3D): number {
    if (occluderMeshes.length === 0) return 1;
    target.getWorldPosition(_worldPos);
    _box.setFromObject(target);
    let minY = _worldPos.y, maxY = _worldPos.y + 1.2;
    if (!_box.isEmpty()) { minY = _box.min.y; maxY = _box.max.y; }
    const h = Math.max(0.3, maxY - minY);
    let visible = 0;
    for (const frac of OCCLUSION_SAMPLES) {
      _sample.set(_worldPos.x, minY + h * frac, _worldPos.z);
      _rayDir.copy(_sample).sub(camera.position);
      const dist = _rayDir.length();
      if (dist <= 0.05) { visible++; continue; }
      _rayDir.divideScalar(dist);
      raycaster.set(camera.position, _rayDir);
      raycaster.near = 0;
      raycaster.far = dist - 0.02;   // 只看「相机与角色之间」的遮挡，角色自身不算
      if (raycaster.intersectObjects(occluderMeshes, false).length === 0) visible++;
    }
    return visible / OCCLUSION_SAMPLES.length;
  }

  let active = false;
  let halted = false;               // 静止衰减完毕：整条管线停跑
  let blocked = false;              // v9s.61：完全被遮挡：清空累积并停跑（不透视）
  let energy = 0;                   // 残影能量估计，驱动停跑
  let lastState = '';               // 作用状态签名，用于「切换时才 clearAcc」
  let learnedRef = refDistance;     // 相机参考距离
  let prevDist = 0;                 // 上一帧相机到角色距离
  let lastPasses = 0;
  let lastPixels = 0;
  let lastZoom = 1;
  let lastOcclusion = 1;
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

    // 2) accum：prev 只衰减覆盖度（rgb 保本色）+ 重投影，与当前帧取 max（合并原 decay / add）
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
    blocked = false;
    energy = 0;
    prevDist = 0;
    active = false;
    forceFeedback = true;
    frameNo = 0;
    lastOcclusion = 1;
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

      // v9s.61：遮挡门控。角色躲到墙后 → 不画透视拖影，并清空历史、整套停跑省开销。
      const occ = computeOcclusion(target);
      lastOcclusion = occ;
      if (occ <= 0.001) {
        if (!blocked) { clearAcc(); blocked = true; forceFeedback = true; }
        halted = true; energy = 0; active = false;
        lastPasses = 0; lastPixels = 0;
        return;
      }
      blocked = false;
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
      matCompose.uniforms.uOcclusion.value = occ; // 部分遮挡时整体变淡，不穿墙
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
      active = false; halted = false; blocked = false; energy = 0; prevDist = 0; lastState = '';
      forceFeedback = true; frameNo = 0; lastOcclusion = 1;
      lastPasses = 0; lastPixels = 0;
    },
    debug(): AfterimageDebug {
      return {
        count: 3, active: active ? 1 : 0, spawning: false,
        passes: lastPasses, pixels: lastPixels, drawCalls: lastPasses, zoomRatio: lastZoom,
        occlusion: lastOcclusion,
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
