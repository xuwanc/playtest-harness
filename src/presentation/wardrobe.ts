import * as THREE from 'three';
import {
  initialCombatState, initialHurt, initialLinkState, initialTurnInPlaceState,
} from '../core';
import type {
  CharacterState, ColorConfig, CombatState, ViewConfig, VoxelConfig, WeaponId,
} from '../core';
import { createVoxelRig } from './voxel-rig';
import type { VoxelRig } from './voxel-rig';
import {
  CRAFT_CELLS, WARDROBE_LOOK, WARDROBE_MATERIALS, WARDROBE_RECIPES, WARDROBE_SECTIONS,
  WARDROBE_WEAPONS, blendTowards, consumeForRecipe, countMaterials, dragYaw, idleSway,
  matchRecipe, resolveLook,
} from './wardrobe-model';
import type {
  CharacterConfig, EquipmentSlot, LookTarget, MaterialId, WardrobeRecipe,
} from './wardrobe-model';

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
 *
 * ## v9s.69 改动
 *  - **匹配当前选的角色**：展示用的 voxel / 配色来自 `getCharacterConfig()`（实时读取主场景
 *    当前体型），切体型（B 键 / 体型胶囊）后打开或已在看时自动重建 rig，不再永远钉死标准体型。
 *  - **装备放进 3D 视窗**：武器原本就由角色持握；防具 / 背包 / 饰品现在以 3D 网格挂在
 *    `rig.group` 上（头盔 / 胸甲 / 护腿 / 饰品 / 背包），随角色一起转，不再是一排占位虚线格。
 *  - **去掉染色**：配色切换（dye）整段移除。
 *  - **3×4 合成魔方**：侧栏一个 12 格（3 列 ×4 行）材料盘，按配方合成装备 → 直接落进视窗。
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
  /** 当前展示匹配的体型 id（来自 getCharacterConfig） */
  characterId: string;
  /** 当前已装备的槽位（3D 视窗里能看到对应网格） */
  equipped: EquipmentSlot[];
  /** 合成魔方 12 格当前材料（MaterialId 或 null） */
  craftCells: (MaterialId | null)[];
  /** 当前格子可合成的配方 id（预览），无则 null */
  matchedRecipe: string | null;
  /** 侧栏分区数（武器 + 合成台） */
  sections: number;
  /** 合成魔方格子总数（= CRAFT_CELLS） */
  slots: number;
  contextLost: boolean;
};

export type CraftResult = {
  ok: boolean;
  slot?: EquipmentSlot;
  recipe?: string;
  reason?: string;
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
  /** 直接设置第 i 格材料（自动化用），越界忽略 */
  setCraftCell(i: number, mat: MaterialId | null): void;
  /** 点击第 i 格：在 空 → 各材料 → 空 之间循环 */
  cycleCraftCell(i: number): void;
  /** 合成：若当前格子满足某配方，装备并消耗材料，返回结果 */
  craftSynthesize(): CraftResult;
  /** 清空合成魔方 */
  craftClear(): void;
  debug(): WardrobeDebug;
  dispose(): void;
};

export type WardrobeOptions = {
  view: ViewConfig;
  moveSpeed: number;
  /** 入口按钮（点开 / 收起） */
  toggleButton: HTMLElement | null;
  /**
   * v9s.69：实时提供「当前展示角色」的配置（体型 id + 名 + voxel + 配色）。
   * 不传则退化为始终用 view.voxel / view.colors（标准体型）。
   */
  getCharacterConfig?: () => CharacterConfig | null;
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

const MATERIAL_ORDER: MaterialId[] = WARDROBE_MATERIALS.map((m) => m.id);

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
  let contextLost = false;
  let elapsed = 0;

  // v9s.69：当前展示角色（实时从 getCharacterConfig 取）
  let charId = '';
  let charName = '';
  let charVoxel: VoxelConfig = view.voxel;
  let charColors: ColorConfig = view.colors;

  // 合成魔方 12 格
  let cells: (MaterialId | null)[] = new Array(CRAFT_CELLS).fill(null);
  const equipped = new Set<EquipmentSlot>();

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
          <div class="wardrobe-title">装备展示 <span class="wardrobe-sub">/ 试衣间 + 合成台</span></div>
          <div class="wardrobe-tip">悬停或点击 → 看向鼠标 · 左右拖动 → 旋转角色</div>
          <div class="wardrobe-char" id="wardrobe-char">当前角色：—</div>
        </div>
        <button type="button" class="wardrobe-close" data-ui-button aria-label="关闭装备展示">✕</button>
      </header>
      <div class="wardrobe-body">
        <div class="wardrobe-stage" id="wardrobe-stage">
          <div class="wardrobe-yaw" aria-hidden="true"></div>
        </div>
        <div class="wardrobe-side" id="wardrobe-side"></div>
      </div>
      <div class="wardrobe-toast" id="wardrobe-toast" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(root);
  const stage = root.querySelector<HTMLElement>('#wardrobe-stage')!;
  const side = root.querySelector<HTMLElement>('#wardrobe-side')!;
  const yawLabel = root.querySelector<HTMLElement>('.wardrobe-yaw')!;
  const charLabel = root.querySelector<HTMLElement>('#wardrobe-char')!;
  const toastEl = root.querySelector<HTMLElement>('#wardrobe-toast')!;

  // 侧栏：武器段（chips）+ 合成台段（3×4 魔方 + 按钮 + 预览）
  side.innerHTML = WARDROBE_SECTIONS.map((s) => {
    if (s.kind === 'weapon') {
      const items = WARDROBE_WEAPONS.map(
        (w) => `<button type="button" class="wardrobe-chip" data-ui-button data-wp="${w.id}" aria-label="展示${w.label}">${w.label}</button>`,
      ).join('');
      return `<section class="wardrobe-sec" data-sec="${s.id}">
        <div class="wardrobe-sec-head"><b>${s.label}</b><span>${s.hint}</span></div>
        <div class="wardrobe-items">${items}</div>
      </section>`;
    }
    // craft：12 格魔方 + 合成/清空 + 预览 + 已装备
    const grid = Array.from({ length: CRAFT_CELLS }, (_, i) => `<button type="button" class="wardrobe-cell" data-ui-button data-cell="${i}" aria-label="合成格${i + 1}"></button>`).join('');
    return `<section class="wardrobe-sec" data-sec="${s.id}">
      <div class="wardrobe-sec-head"><b>${s.label}</b><span>${s.hint}</span></div>
      <div class="wardrobe-grid" id="wardrobe-grid">${grid}</div>
      <div class="wardrobe-craft-bar">
        <button type="button" class="wardrobe-craft-btn" data-ui-button data-craft>合成装备</button>
        <button type="button" class="wardrobe-craft-btn ghost" data-ui-button data-clear>清空</button>
      </div>
      <div class="wardrobe-craft-hint" id="wardrobe-craft-hint">可合成：—</div>
      <div class="wardrobe-craft-equipped" id="wardrobe-equipped">已装备：—</div>
    </section>`;
  }).join('');

  const gridEl = side.querySelector<HTMLElement>('#wardrobe-grid')!;
  const hintEl = side.querySelector<HTMLElement>('#wardrobe-craft-hint')!;
  const equippedEl = side.querySelector<HTMLElement>('#wardrobe-equipped')!;

  function syncChips(): void {
    side.querySelectorAll<HTMLElement>('[data-wp]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.wp === weapon);
    });
  }

  /** 把格子 / 预览 / 已装备三处 DOM 刷新到当前状态。 */
  function renderCraft(): void {
    const cellEls = gridEl.querySelectorAll<HTMLElement>('.wardrobe-cell');
    cellEls.forEach((el, i) => {
      const mat = cells[i];
      const info = mat ? WARDROBE_MATERIALS.find((m) => m.id === mat) : null;
      el.classList.toggle('is-filled', !!info);
      el.dataset.mat = mat ?? '';
      el.innerHTML = info
        ? `<i style="background:${info.swatch}"></i><span>${info.label}</span>`
        : '';
      el.setAttribute('aria-label', info ? `材料：${info.label}` : '空格');
    });
    const match = matchRecipe(cells);
    hintEl.textContent = match
      ? `可合成：${match.recipe.label}（${formatNeed(match.recipe)}）`
      : '可合成：—';
    if (equipped.size === 0) {
      equippedEl.textContent = '已装备：—';
    } else {
      const labels = [...equipped].map((s) => WARDROBE_RECIPES.find((r) => r.slot === s)?.label ?? s);
      equippedEl.textContent = `已装备：${labels.join(' · ')}`;
    }
  }

  function formatNeed(recipe: WardrobeRecipe): string {
    return Object.entries(recipe.need)
      .map(([k, n]) => `${WARDROBE_MATERIALS.find((m) => m.id === k)?.label ?? k}×${n}`)
      .join('+');
  }

  function showToast(text: string): void {
    toastEl.textContent = text;
    toastEl.classList.add('is-show');
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t?: number })._t = window.setTimeout(
      () => toastEl.classList.remove('is-show'), 1400,
    );
  }

  syncChips();
  renderCraft();

  // ---- WebGL（懒创建） ----
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let pivot: THREE.Group | null = null;
  let rig: VoxelRig | null = null;
  // v9s.69：装备网格挂在 rig.group 上，随角色一起转；重建 rig 时整体复用
  let equipmentGroup = new THREE.Group();
  let rafId = 0;
  let lastTs = 0;

  /** 造一份只给展示用的 voxel 配置：打开静止呼吸，其余逐字节沿用主场景。 */
  function showcaseVoxel(voxel: VoxelConfig): VoxelConfig {
    return { ...voxel, style: { ...(voxel.style ?? {}), breath: true } };
  }

  function buildRig(voxel: VoxelConfig, colors: ColorConfig): VoxelRig {
    return createVoxelRig(
      showcaseVoxel(voxel), colors, moveSpeed,
      view.orientation, view.gait, view.weaponMount, view.lean, view.hurt,
      view.animation, view.ik, view.links, view.weaponWrist, view.balance,
    );
  }

  function disposeObject(o: THREE.Object3D): void {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else if (mat) mat.dispose();
  }

  function disposeRig(): void {
    if (!rig) return;
    rig.group.remove(equipmentGroup);
    rig.group.traverse((o) => disposeObject(o));
    pivot?.remove(rig.group);
    rig = null;
  }

  /** 装备网格：按当前已装备槽位重建（位置随体型 voxel 走，所以换体型自动重适配）。 */
  function syncEquipment(): void {
    for (let i = equipmentGroup.children.length - 1; i >= 0; i--) {
      const o = equipmentGroup.children[i];
      equipmentGroup.remove(o);
      disposeObject(o);
    }
    for (const slot of equipped) {
      const mesh = buildEquipmentMesh(slot, charColors, charVoxel);
      if (mesh) equipmentGroup.add(mesh);
    }
  }

  /** v9s.69：按体型 voxel 比例在角色身上挂一件装备网格（局部坐标，脚底 y=0）。 */
  function buildEquipmentMesh(slot: EquipmentSlot, colors: ColorConfig, voxel: VoxelConfig): THREE.Object3D | null {
    const { headSize, bodyWidth, bodyHeight, legLength } = voxel;
    const hip = legLength;
    const torsoCenter = legLength + bodyHeight * 0.5;
    const shoulderTop = legLength + bodyHeight;
    const headCenter = legLength + bodyHeight + headSize * 0.5;
    const metal = colors.metal ?? '#9fb0c0';
    const wood = colors.wood ?? '#8b5e3c';
    const limb = colors.limb ?? '#2f6fa8';
    const glow = colors.glow ?? '#7fe3ff';
    const g = new THREE.Group();
    const mat = (c: string, emissive = false): THREE.Material =>
      emissive
        ? new THREE.MeshBasicMaterial({ color: c })
        : new THREE.MeshLambertMaterial({ color: c });

    if (slot === 'helmet') {
      const h = new THREE.Mesh(new THREE.BoxGeometry(headSize * 1.18, headSize * 0.72, headSize * 1.18), mat(metal));
      h.position.set(0, headCenter + headSize * 0.12, 0);
      const crest = new THREE.Mesh(new THREE.BoxGeometry(headSize * 0.18, headSize * 0.4, headSize * 0.18), mat(glow, true));
      crest.position.set(0, headCenter + headSize * 0.55, 0);
      g.add(h, crest);
    } else if (slot === 'chest') {
      const c = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth * 1.16, bodyHeight * 0.55, bodyWidth * 0.72), mat(limb));
      c.position.set(0, torsoCenter + bodyHeight * 0.06, 0);
      const collar = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth * 0.5, bodyHeight * 0.12, bodyWidth * 0.5), mat(metal));
      collar.position.set(0, shoulderTop - headSize * 0.15, 0);
      g.add(c, collar);
    } else if (slot === 'legs') {
      for (const sx of [-1, 1]) {
        const lg = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth * 0.42, legLength * 0.5, bodyWidth * 0.46), mat(metal));
        lg.position.set(sx * bodyWidth * 0.42, hip - legLength * 0.05, 0);
        g.add(lg);
      }
    } else if (slot === 'trinket') {
      const t = new THREE.Mesh(new THREE.TorusGeometry(headSize * 0.22, headSize * 0.06, 8, 16), mat(glow, true));
      t.position.set(0, shoulderTop - headSize * 0.25, bodyWidth * 0.32);
      g.add(t);
    } else if (slot === 'bag') {
      const b = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth * 0.7, bodyHeight * 0.6, bodyWidth * 0.42), mat(wood));
      b.position.set(0, torsoCenter, -bodyWidth * 0.62);
      g.add(b);
    } else {
      return null;
    }
    return g;
  }

  /** 实时取当前展示角色配置（无回调则用标准体型）。 */
  function currentConfig(): CharacterConfig {
    const cfg = opts.getCharacterConfig ? opts.getCharacterConfig() : null;
    return cfg ?? { id: 'standard', name: '标准', voxel: view.voxel, colors: view.colors };
  }

  /** 若当前角色体型变了，重建 rig + 重新挂装备 + 更新标签。 */
  function syncCharacter(): void {
    if (!rig || !pivot) return;
    const cfg = currentConfig();
    if (cfg.id === charId) return;
    charId = cfg.id;
    charName = cfg.name;
    charVoxel = cfg.voxel;
    charColors = cfg.colors;
    disposeRig();
    rig = buildRig(charVoxel, charColors);
    pivot.add(rig.group);
    rig.group.add(equipmentGroup);
    syncEquipment();
    if (charLabel) charLabel.textContent = `当前角色：${charName}`;
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
    const cfg = currentConfig();
    charId = cfg.id;
    charName = cfg.name;
    charVoxel = cfg.voxel;
    charColors = cfg.colors;
    rig = buildRig(charVoxel, charColors);
    pivot.add(rig.group);
    rig.group.add(equipmentGroup);
    syncEquipment();
    if (charLabel) charLabel.textContent = `当前角色：${charName}`;

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

    syncCharacter();                 // 体型切换即时反映到展示

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

  // 侧栏按钮（武器 / 合成魔方）
  side.addEventListener('pointerdown', (e) => {
    const t = e.target as Element;
    const wp = t.closest<HTMLElement>('[data-wp]');
    if (wp) {
      e.preventDefault(); e.stopPropagation();
      setWeapon(wp.dataset.wp as WeaponId);
      return;
    }
    const cell = t.closest<HTMLElement>('[data-cell]');
    if (cell) {
      e.preventDefault(); e.stopPropagation();
      cycleCraftCell(Number(cell.dataset.cell));
      return;
    }
    if (t.closest('[data-craft]')) { e.preventDefault(); e.stopPropagation(); craftSynthesize(); return; }
    if (t.closest('[data-clear]')) { e.preventDefault(); e.stopPropagation(); craftClear(); return; }
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
    syncCharacter();                      // 打开时若体型已变，立即重建
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

  function setCraftCell(i: number, mat: MaterialId | null): void {
    if (i < 0 || i >= CRAFT_CELLS) return;
    cells[i] = mat;
    renderCraft();
  }
  function cycleCraftCell(i: number): void {
    if (i < 0 || i >= CRAFT_CELLS) return;
    const cur = cells[i];
    const idx = cur ? MATERIAL_ORDER.indexOf(cur) : -1;
    const next = idx < 0 ? MATERIAL_ORDER[0] : (idx + 1 < MATERIAL_ORDER.length ? MATERIAL_ORDER[idx + 1] : null);
    cells[i] = next;
    renderCraft();
  }
  function craftSynthesize(): CraftResult {
    const m = matchRecipe(cells);
    if (!m) {
      showToast('无匹配配方');
      return { ok: false, reason: 'no-recipe' };
    }
    equipped.add(m.slot);
    cells = consumeForRecipe(cells, m.recipe);
    syncEquipment();
    renderCraft();
    showToast(`合成成功：${m.recipe.label}`);
    return { ok: true, slot: m.slot, recipe: m.recipe.id };
  }
  function craftClear(): void {
    cells = new Array(CRAFT_CELLS).fill(null);
    renderCraft();
  }

  function debug(): WardrobeDebug {
    const match = matchRecipe(cells);
    return {
      open: isOpen, rendered, frames, turntableYaw, sway,
      headYaw, headPitch, lookTarget: { ...lookTarget }, dragging,
      weapon, characterId: charId, equipped: [...equipped],
      craftCells: cells.slice(), matchedRecipe: match ? match.recipe.id : null,
      sections: WARDROBE_SECTIONS.length, slots: CRAFT_CELLS, contextLost,
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
    setLook, dragBy, setDragging, setWeapon,
    setCraftCell, cycleCraftCell, craftSynthesize, craftClear,
    debug, dispose,
  };
}
