import * as THREE from 'three';
import {
  initialCombatState, initialHurt, initialLinkState, initialTurnInPlaceState,
} from '../core';
import type {
  CharacterState, ColorConfig, CombatState, ViewConfig, WeaponId,
} from '../core';
import { createVoxelRig } from './voxel-rig';
import type { VoxelRig } from './voxel-rig';
import {
  WARDROBE_LOOK, WARDROBE_PALETTES, WARDROBE_SECTIONS, WARDROBE_WEAPONS,
  blendTowards, dragYaw, idleSway, mergePalette, resolveLook,
} from './wardrobe-model';
import type { LookTarget } from './wardrobe-model';

/**
 * 装备 / 外观展示界面（Wardrobe）。
 *
 * ## 边界（务必先读）
 * 这是**纯表现层**：不写 World、不进确定性与快照、不参与主循环。它自己持有一个
 * 独立的 THREE.Scene / Camera / WebGLRenderer，复用 `createVoxelRig` 造一个和主场景
 * 逐字节同构造的角色，喂一份**恒待机的伪状态**驱动（呼吸 / 斜跨站姿 / 持械待机），
 * 所以角色始终「动态站立」，与主场景当前在跑什么完全无关。
 *
 * ## 为什么不复用主 renderer
 * 主场景相机跟着角色满场跑、还有草 / 可破坏物 / 特效；展示界面要的是干净转台。
 * 第二个上下文**懒创建**（第一次点开才建），关闭即停渲染循环，并带
 * webglcontextlost/restored 防护 —— 微信 X5 / iOS WKWebView 会周期性丢上下文，
 * 这是主场景踩过的坑（见 three-scene.ts）。
 *
 * ## 三条交互
 *  - 点开：角色恒待机动态站立（呼吸 + 缓慢重心微摆，见 idleSway / voxel-rig 的 breath）。
 *  - 点击 / 悬停：视线朝鼠标（resolveLook → headYaw / headPitch / bodyPitch，指数平滑）。
 *  - 左右拖动：整个角色绕 Y 轴（上下轴）旋转（dragYaw 累加到转台角）。
 *
 * 视线是**相对身体**的偏转，转台是**相对世界**的旋转，两者刻意解耦：转台用来
 * 360° 看装备正背面，视线是叠加其上的小幅注视，不会因为转到背面而算出反方向。
 */

export type WardrobeDebug = {
  open: boolean;
  /** 是否已懒创建 WebGL 上下文 */
  rendered: boolean;
  /** 已渲染帧数 —— >0 且在增长，证明「动态站立」的渲染循环真的在跑 */
  frames: number;
  /** 转台 Y 轴旋转（弧度，规范到 (-π, π]） */
  turntableYaw: number;
  /** 当前待机微摆量（弧度） */
  sway: number;
  /** 平滑后的当前视线角 */
  headYaw: number;
  headPitch: number;
  lookTarget: LookTarget;
  dragging: boolean;
  weapon: WeaponId;
  palette: string;
  sections: number;
  /** 占位槽总数（防具 + 背包） */
  slots: number;
  contextLost: boolean;
};

export type WardrobeView = {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
  /** 自动化 / smoke 直接驱动，不必真的操作指针 */
  setLook(nx: number, ny: number): void;
  dragBy(dxPx: number): void;
  setDragging(on: boolean): void;
  setWeapon(w: WeaponId): void;
  setPalette(id: string): void;
  debug(): WardrobeDebug;
  dispose(): void;
};

export type WardrobeOptions = {
  view: ViewConfig;
  moveSpeed: number;
  /** 入口按钮（点开 / 收起） */
  toggleButton: HTMLElement | null;
};

const NEUTRAL: LookTarget = { headYaw: 0, headPitch: 0, bodyPitch: 0 };

function idleCharacter(): CharacterState {
  return {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    facing: 0, moveYaw: 0, bodyYaw: 0,
    headYaw: 0, headPitch: 0, bodyPitch: 0,
    grounded: true, sprinting: false,
    gaitPhase: 0, stride: 0, distance: 0,
    coyoteTime: 0.1, jumpBuffer: 0,
  };
}

export function createWardrobeView(opts: WardrobeOptions): WardrobeView {
  const { view, moveSpeed } = opts;

  // ---- 纯状态（不依赖 DOM / WebGL，随时可读） ----
  let isOpen = false;
  let rendered = false;
  let frames = 0;
  let turntableYaw = 0;
  let sway = 0;
  let headYaw = 0;
  let headPitch = 0;
  let bodyPitch = 0;
  let lookTarget: LookTarget = { ...NEUTRAL };
  let dragging = false;
  let weapon: WeaponId = 'sword-shield';
  let paletteId = 'default';
  let contextLost = false;
  let elapsed = 0;

  // ---- 恒待机伪状态：每帧只改视线三角，其余恒为站立 ----
  const char = idleCharacter();
  const combat: CombatState = initialCombatState(1) as CombatState;
  const hurt = initialHurt();
  const link = initialLinkState();
  const turn = initialTurnInPlaceState();

  // ---- DOM：浮层由模块自建，挂到 body；带 data-ui-region 让主摇杆不吃拖动 ----
  const root = document.createElement('div');
  root.id = 'wardrobe';
  root.className = 'wardrobe is-off';
  root.setAttribute('data-ui-region', '');
  root.setAttribute('aria-label', '装备展示界面');
  root.innerHTML = `
    <div class="wardrobe-card" role="dialog" aria-modal="true" aria-label="装备展示">
      <header class="wardrobe-head">
        <div>
          <div class="wardrobe-title">装备展示 <span class="wardrobe-sub">/ 外观试衣间</span></div>
          <div class="wardrobe-tip">悬停或点击 → 看向鼠标 · 左右拖动 → 旋转角色</div>
        </div>
        <button type="button" class="wardrobe-close" data-ui-button aria-label="关闭装备展示">✕</button>
      </header>
      <div class="wardrobe-body">
        <div class="wardrobe-stage" id="wardrobe-stage">
          <div class="wardrobe-yaw" aria-hidden="true"></div>
        </div>
        <div class="wardrobe-side" id="wardrobe-side"></div>
      </div>
    </div>`;
  document.body.appendChild(root);
  const stage = root.querySelector<HTMLElement>('#wardrobe-stage')!;
  const side = root.querySelector<HTMLElement>('#wardrobe-side')!;
  const yawLabel = root.querySelector<HTMLElement>('.wardrobe-yaw')!;

  // 侧栏：完全由 WARDROBE_SECTIONS 生成，后续接背包只改数据表
  const slotCount = WARDROBE_SECTIONS.reduce(
    (n, s) => n + (s.slots?.length ?? 0), 0,
  );
  side.innerHTML = WARDROBE_SECTIONS.map((s) => {
    let items: string;
    if (s.kind === 'weapon') {
      items = WARDROBE_WEAPONS.map(
        (w) => `<button type="button" class="wardrobe-chip" data-ui-button data-wp="${w.id}" aria-label="展示${w.label}">${w.label}</button>`,
      ).join('');
    } else if (s.kind === 'dye') {
      items = WARDROBE_PALETTES.map(
        (p) => `<button type="button" class="wardrobe-chip wardrobe-dye" data-ui-button data-dye="${p.id}" aria-label="配色${p.label}"><i style="background:${p.swatch}"></i>${p.label}</button>`,
      ).join('');
    } else {
      items = (s.slots ?? []).map(
        (label) => `<span class="wardrobe-slot" data-slot="${label}" title="预留槽位">${label}</span>`,
      ).join('');
    }
    return `<section class="wardrobe-sec" data-sec="${s.id}">
      <div class="wardrobe-sec-head"><b>${s.label}</b><span>${s.hint}</span></div>
      <div class="wardrobe-items">${items}</div>
    </section>`;
  }).join('');

  function syncChips(): void {
    side.querySelectorAll<HTMLElement>('[data-wp]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.wp === weapon);
    });
    side.querySelectorAll<HTMLElement>('[data-dye]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.dye === paletteId);
    });
  }
  syncChips();

  // ---- WebGL（懒创建） ----
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let pivot: THREE.Group | null = null;
  let rig: VoxelRig | null = null;
  let rafId = 0;
  let lastTs = 0;

  /** 造一份只给展示用的 voxel 配置：打开静止呼吸，其余逐字节沿用主场景。 */
  function showcaseVoxel() {
    const base = view.voxel;
    return { ...base, style: { ...(base.style ?? {}), breath: true } };
  }

  function buildRig(colors: ColorConfig): VoxelRig {
    return createVoxelRig(
      showcaseVoxel(), colors, moveSpeed,
      view.orientation, view.gait, view.weaponMount, view.lean, view.hurt,
      view.animation, view.ik, view.links, view.weaponWrist, view.balance,
    );
  }

  function disposeRig(): void {
    if (!rig) return;
    rig.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) mat.dispose();
    });
    pivot?.remove(rig.group);
    rig = null;
  }

  function ensure3D(): void {
    if (renderer) return;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.className = 'wardrobe-canvas';
    renderer.domElement.setAttribute('data-ui-region', '');
    stage.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();           // 必须，否则浏览器不派发 restored
      contextLost = true;
    }, false);
    renderer.domElement.addEventListener('webglcontextrestored', () => {
      contextLost = false;
      resize();
    }, false);

    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xa8c8ee, 0x2a2f38, 1.25));
    const sun = new THREE.DirectionalLight(0xfff2dc, 1.6);
    sun.position.set(3, 6, 5);
    scene.add(sun);

    // 展示台：薄圆盘 + 一圈发光环，角色「站得住」，也暗示可绕着转
    const dais = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.82, 0.06, 48),
      new THREE.MeshLambertMaterial({ color: '#222c39' }),
    );
    dais.position.y = -0.03;
    scene.add(dais);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.80, 0.845, 64),
      new THREE.MeshBasicMaterial({ color: '#6fd3ff', transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    pivot = new THREE.Group();
    scene.add(pivot);
    rig = buildRig(mergePalette(view.colors, paletteId));
    pivot.add(rig.group);

    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 1.02, 2.75);
    camera.lookAt(0, 0.58, 0);
    resize();
    rendered = true;
  }

  function resize(): void {
    if (!renderer || !camera) return;
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const onResize = (): void => { if (isOpen) resize(); };
  window.addEventListener('resize', onResize);

  // ---- 渲染循环：只在打开时跑；不读墙钟，dt 由 rAF 时间戳推进 ----
  function tick(ts: number): void {
    rafId = requestAnimationFrame(tick);
    if (!isOpen || !renderer || !scene || !camera || !rig || !pivot || contextLost) return;
    const dt = lastTs ? Math.min(0.05, Math.max(0, (ts - lastTs) / 1000)) : 1 / 60;
    lastTs = ts;
    elapsed += dt;

    headYaw = blendTowards(headYaw, lookTarget.headYaw, dt);
    headPitch = blendTowards(headPitch, lookTarget.headPitch, dt);
    bodyPitch = blendTowards(bodyPitch, lookTarget.bodyPitch, dt);
    sway = dragging ? 0 : idleSway(elapsed);

    char.headYaw = headYaw;
    char.headPitch = headPitch;
    char.bodyPitch = bodyPitch;
    combat.weapon = weapon;
    rig.update(char, combat, hurt, dt, false, elapsed, link, turn);
    pivot.rotation.y = turntableYaw + sway;

    renderer.render(scene, camera);
    frames += 1;
    yawLabel.textContent = `旋转 ${Math.round(((turntableYaw * 180) / Math.PI))}°`;
  }

  function startLoop(): void {
    if (rafId) return;
    lastTs = 0;
    rafId = requestAnimationFrame(tick);
  }
  function stopLoop(): void {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // ---- 交互：归一化指针坐标 → 视线；水平位移 → 转台角 ----
  function pointerLook(e: PointerEvent): void {
    const r = stage.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    lookTarget = resolveLook(nx, ny);
  }
  let lastDragX = 0;
  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    dragging = true;
    lastDragX = e.clientX;
    pointerLook(e);
    try { stage.setPointerCapture(e.pointerId); } catch { /* 部分 WebView 不支持 */ }
  });
  stage.addEventListener('pointermove', (e) => {
    pointerLook(e);                       // 悬停也看向鼠标
    if (dragging) {
      turntableYaw = dragYaw(turntableYaw, e.clientX - lastDragX);
      lastDragX = e.clientX;
    }
  });
  const endDrag = (): void => { dragging = false; };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', () => {
    endDrag();
    lookTarget = { ...NEUTRAL };          // 移出预览区，视线缓缓回正
  });

  // 侧栏按钮
  side.addEventListener('pointerdown', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-wp], [data-dye]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    if (el.dataset.wp) setWeapon(el.dataset.wp as WeaponId);
    if (el.dataset.dye) setPalette(el.dataset.dye);
  });

  // 关闭：按钮 / 点击遮罩 / Esc
  root.querySelector('.wardrobe-close')?.addEventListener('pointerdown', (e) => {
    e.preventDefault(); e.stopPropagation(); close();
  });
  root.addEventListener('pointerdown', (e) => {
    if (e.target === root) close();       // 只认点在遮罩空白处
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
  opts.toggleButton?.addEventListener('pointerdown', (e) => {
    e.preventDefault(); e.stopPropagation(); toggle();
  });

  // ---- 公共 API ----
  function open(): void {
    if (isOpen) return;
    isOpen = true;
    root.classList.remove('is-off');
    root.classList.add('is-open');
    ensure3D();
    resize();
    startLoop();
    opts.toggleButton?.setAttribute('aria-expanded', 'true');
  }
  function close(): void {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    root.classList.add('is-off');
    stopLoop();                            // 关闭即停渲染，省 GPU / 移动端上下文压力
    dragging = false;
    lookTarget = { ...NEUTRAL };
    opts.toggleButton?.setAttribute('aria-expanded', 'false');
  }
  function toggle(): void { if (isOpen) close(); else open(); }

  function setLook(nx: number, ny: number): void { lookTarget = resolveLook(nx, ny); }
  function dragBy(dxPx: number): void { turntableYaw = dragYaw(turntableYaw, dxPx); }
  function setDragging(on: boolean): void { dragging = !!on; }
  function setWeapon(w: WeaponId): void { weapon = w; syncChips(); }
  function setPalette(id: string): void {
    if (!WARDROBE_PALETTES.some((p) => p.id === id)) return;
    paletteId = id;
    syncChips();
    if (pivot && rig) {                    // 换色要重建 rig（材质颜色在造几何时写死）
      disposeRig();
      rig = buildRig(mergePalette(view.colors, paletteId));
      pivot.add(rig.group);
    }
  }
  function debug(): WardrobeDebug {
    return {
      open: isOpen, rendered, frames, turntableYaw, sway,
      headYaw, headPitch, lookTarget: { ...lookTarget }, dragging,
      weapon, palette: paletteId, sections: WARDROBE_SECTIONS.length,
      slots: slotCount, contextLost,
    };
  }
  function dispose(): void {
    stopLoop();
    window.removeEventListener('resize', onResize);
    disposeRig();
    renderer?.dispose();
    renderer?.domElement.remove();
    root.remove();
  }

  return {
    open, close, toggle, isOpen: () => isOpen,
    setLook, dragBy, setDragging, setWeapon, setPalette, debug, dispose,
  };
}
