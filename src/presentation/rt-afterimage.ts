import * as THREE from 'three';
import type { AfterimageRtViewConfig } from '../core/types';

/**
 * 角色移动残影 · RT 反馈方案（v9s.57，纯表现层，机器人对照测试）。
 *
 * 与克隆 ghost 池不同，这里走「离屏 RenderTarget + 逐帧反馈」：
 *  1. 把目标角色单独渲到 `rtCur`（用 layer 1 隔离，背景透明）；
 *  2. 上一帧累积残影 `accPrev` 乘衰减、轻微放大后写进 `accNext`（旧残影向外扩散、渐隐）；
 *  3. 当前角色 `rtCur` 用正常混合叠到 `accNext` 之上；
 *  4. 把 `accNext` 合成到屏幕（在 `renderer.render(scene, cam)` 之后叠加）；
 *  5. 交换 acc 双缓冲。
 * 角色移动时旧帧不断被复用 → 自然拉出跟随的拖尾 / 雾化残影，且随衰减「随时间消散」。
 *
 * 纯表现：不碰 Core、不引入命中；只在 `cfg.bodyTypes`（默认机器人 `sentinel`）上生效。
 * 进入 / 退出作用角色时会清空累积缓冲，避免把上一个角色的残影带到下一个身上。
 *
 * 对主渲染循环的侵入只发生在 `update` 内部（且在本模块内完整 save/restore 渲染器与
 * 相机状态），three-scene 只需在 `renderer.render(scene, cam)` 之后调一次 `update`。
 */

/** 隔离角色用的专用 layer（角色 mesh 会额外 enable 这一层，自身 layer 0 保留） */
const RT_LAYER = 1;

export type Afterimage = {
  /** 占位空 Group（本方案直接合成到屏幕，不需要挂进场景） */
  container: THREE.Group;
  update(dt: number, target: THREE.Object3D, root: THREE.Object3D, moving: boolean, bodyId: string): void;
  reset(): void;
  debug(): { count: number; active: number; spawning: boolean };
  dispose(): void;
};

type RtCtx = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
};

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const DECAY_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform float uDecay;
  uniform float uScale;   // >1：采样时缩小 uv → 旧残影放大、向外扩散
  void main() {
    vec2 uv = (vUv - 0.5) / uScale + 0.5;
    gl_FragColor = texture2D(uPrev, uv) * uDecay;
  }
`;

const ADD_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uCur;
  uniform float uIntensity;
  void main() {
    gl_FragColor = texture2D(uCur, vUv) * uIntensity;
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
    if (uMode == 0) {
      gl_FragColor = vec4(col * uIntensity, 1.0);
    } else {
      gl_FragColor = vec4(col * uIntensity, a * uIntensity);
    }
  }
`;

export function createRtAfterimage(ctx: RtCtx, cfg: AfterimageRtViewConfig): Afterimage {
  const { renderer, scene, camera } = ctx;
  const container = new THREE.Group();
  container.name = 'afterimage-rt';

  const rtOpts: THREE.RenderTargetOptions = {
    depthBuffer: true,
    stencilBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  };
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const rtCur = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), rtOpts);
  const accA = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), rtOpts);
  const accB = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), rtOpts);
  // 双缓冲角色：prev = 上一帧累积残影，next = 本帧写入目标（每帧交换）
  let prev = accA;
  let next = accB;

  const quadScene = new THREE.Scene();
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const tintColor = new THREE.Color(cfg.color);

  const matDecay = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: DECAY_FRAG,
    uniforms: {
      uPrev: { value: prev.texture },
      uDecay: { value: cfg.decay },
      uScale: { value: cfg.scale },
    },
    depthTest: false,
    depthWrite: false,
  });
  const matAdd = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: ADD_FRAG,
    uniforms: {
      uCur: { value: rtCur.texture },
      uIntensity: { value: 1.0 }, // 当前帧始终实色，不半透明
    },
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    depthWrite: false,
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
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matCompose);
  quad.frustumCulled = false;
  quadScene.add(quad);

  let active = false;

  function ensureSize(): void {
    const s = renderer.getDrawingBufferSize(new THREE.Vector2());
    const w = Math.max(1, s.x);
    const h = Math.max(1, s.y);
    if (rtCur.width !== w || rtCur.height !== h) {
      rtCur.setSize(w, h);
      accA.setSize(w, h);
      accB.setSize(w, h);
    }
  }

  function clearAcc(): void {
    const prevTarget = renderer.getRenderTarget();
    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(prev);
    renderer.clear(true, true, true);
    renderer.setRenderTarget(next);
    renderer.clear(true, true, true);
    renderer.setRenderTarget(prevTarget);
  }

  function drawQuad(mat: THREE.ShaderMaterial): void {
    quad.material = mat;
    renderer.render(quadScene, quadCam);
  }

  function run(target: THREE.Object3D): void {
    // —— save 渲染器 / 相机状态，结束时完整还原 ——
    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    const prevClear = renderer.getClearColor(new THREE.Color());
    const prevClearA = renderer.getClearAlpha();
    const prevLayerMask = camera.layers.mask;

    // 全程关闭 autoClear：所有清屏都手动做，避免 quad 叠加时把已累积的残影擦掉
    renderer.autoClear = false;

    // 1) 角色单独渲到 rtCur（只渲 layer 1 的对象）
    target.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.layers.enable(RT_LAYER);
    });
    camera.layers.set(RT_LAYER);
    renderer.setRenderTarget(rtCur);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    camera.layers.mask = prevLayerMask; // 还原，下一帧主渲染正常

    // 2) 旧残影（prev）衰减 + 放大 → next（先手动清，再画，不擦后续）
    matDecay.uniforms.uPrev.value = prev.texture;
    renderer.setRenderTarget(next);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    drawQuad(matDecay);

    // 3) 当前角色叠到 next 之上（正常混合：当前帧实、旧帧淡）
    matAdd.uniforms.uCur.value = rtCur.texture;
    drawQuad(matAdd);
    renderer.setRenderTarget(null);

    // 4) 合成 next 到屏幕（在已渲染的主画面上叠加，不清除）
    matCompose.uniforms.uAcc.value = next.texture;
    drawQuad(matCompose);

    // 5) 交换双缓冲：本帧写好的 next 成为下一帧的 prev
    const tmp = prev;
    prev = next;
    next = tmp;

    // —— restore ——
    renderer.setRenderTarget(prevTarget);
    renderer.setClearColor(prevClear, prevClearA);
    renderer.autoClear = prevAutoClear;
  }

  return {
    container,
    update(_dt, target, _root, _moving, bodyId) {
      if (!cfg.enabled) {
        clearAcc();
        active = false;
        return;
      }
      const matched = cfg.bodyTypes.length === 0 || cfg.bodyTypes.includes(bodyId);
      if (!matched) {
        clearAcc();
        active = false;
        return;
      }
      ensureSize();
      active = true;
      run(target);
    },
    reset() {
      clearAcc();
      active = false;
    },
    debug() {
      return { count: 2, active: active ? 1 : 0, spawning: false };
    },
    dispose() {
      rtCur.dispose();
      accA.dispose();
      accB.dispose();
      quad.geometry.dispose();
      matDecay.dispose();
      matAdd.dispose();
      matCompose.dispose();
      container.clear();
    },
  };
}
