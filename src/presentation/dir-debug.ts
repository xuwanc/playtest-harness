import type { GroundBasis, InputFrame } from '../adapters/input';
import type { World } from '../core';

/**
 * v9k 临时方向调试盘（可整块删掉）。
 *
 * 只回答三个问题，一眼对齐：
 *   ① 摇杆输入方向（intents.moveX/Z，死区后）
 *   ② 角色实际移动方向（velocity，速度过小则不出箭头）
 *   ③ 目标方向（= 面朝向 facing，Core 里「面朝向 = 目标方向」）
 * 附带两条参考：死区前的原始摇杆（虚青）、拖拽瞄准（橙）、锁定目标（虚红）。
 *
 * 全部换算到「屏幕方向」：正上 = 相机前方，顺时针为正 —— 所以青色箭头
 * 应当与手指在屏幕上的方向完全一致；若黄色（移动）偏离青色，就是输入到位移这段出了问题。
 *
 * 纯观测：只读 World / InputFrame，不改任何状态，不进 Core、不进快照。
 */

const TAU = Math.PI * 2;

const COLORS = {
  input: '#38bdf8',
  raw: '#7dd3fc',
  move: '#fbbf24',
  face: '#f472b6',
  aim: '#fb923c',
  lock: '#f87171',
  ring: 'rgba(150, 190, 220, 0.34)',
  grid: 'rgba(150, 190, 220, 0.14)',
  dead: 'rgba(190, 214, 234, 0.28)',
};

/** 移动箭头若与输入夹角超过该值、且真的在跑，就认为「输入与位移不一致」。 */
const MISMATCH_DEG = 45;
/** 面朝向与输入夹角超过该值、且没在瞄准 / 攻击时，提示「面朝向被别的东西改写了」。 */
const FACE_GAP_DEG = 50;

export type ScreenVec = { x: number; y: number };

/**
 * 世界 XZ 方向 → 屏幕像素方向（+x 右、+y 下）。
 * 正交相机基向量下 |v| = |d|，因此可直接当单位方向用。
 */
export function toScreenDir(dx: number, dz: number, basis: GroundBasis): ScreenVec {
  return {
    x: basis.rightX * dx + basis.rightZ * dz,
    y: -(basis.forwardX * dx + basis.forwardZ * dz),
  };
}

/** 屏幕角：0° = 正上（相机前方），90° = 右，180° = 下，-90° = 左。 */
export function screenDeg(dx: number, dz: number, basis: GroundBasis): number {
  const v = toScreenDir(dx, dz, basis);
  return (Math.atan2(v.x, -v.y) * 180) / Math.PI;
}

/**
 * 摇杆屏幕向量（右 +、下 +）→ 屏幕角。
 * 摇杆本来就长在屏幕坐标系里，不必绕相机基向量；与 screenDeg(intents) 结果一致。
 */
export function stickDeg(sx: number, sy: number): number {
  return (Math.atan2(sx, -sy) * 180) / Math.PI;
}

/** 两个角度的最小夹角（0..180），任意输入都能吃掉 360° 环绕。 */
export function angleGapDeg(a: number, b: number): number {
  return Math.abs(((((a - b) % 360) + 540) % 360) - 180);
}

/** 0..360 显示用（-90 → 270）。 */
export function normDeg(a: number): number {
  return ((a % 360) + 360) % 360;
}

export type DirSample = {
  /** 输入方向（度，null = 没有输入） */
  inDeg: number | null;
  inLen: number;
  rawDeg: number | null;
  rawLen: number;
  stickHeld: boolean;
  /** 实际移动方向与速度 */
  moveDeg: number | null;
  speed: number;
  /** 面朝向 = 目标方向 */
  faceDeg: number;
  /** 锁定目标方向（无目标则 null） */
  lockDeg: number | null;
  lockId: number;
  lockDist: number;
  /** 拖拽瞄准方向（未拖拽则 null） */
  aimDeg: number | null;
  /** 与输入方向的夹角：位移 / 面朝向 */
  gapMove: number | null;
  gapFace: number | null;
  /** 输入与位移明显不一致 */
  warnMove: boolean;
};

const EMPTY_SAMPLE: DirSample = {
  inDeg: null, inLen: 0, rawDeg: null, rawLen: 0, stickHeld: false,
  moveDeg: null, speed: 0, faceDeg: 0, lockDeg: null, lockId: 0, lockDist: 0,
  aimDeg: null, gapMove: null, gapFace: null, warnMove: false,
};

/**
 * 采样一帧方向（纯函数，便于测试 / 自动化断言）。
 * maxSpeed 只用来把速度映射成箭头长度，不参与判定。
 */
export function readDirs(world: World, input: InputFrame, basis: GroundBasis, maxSpeed = 8): DirSample {
  const c = world.character;
  const intents = input.intents;
  const inLen = Math.hypot(intents.moveX, intents.moveZ);
  const rawLen = Math.hypot(input.stickRawX, input.stickRawY);
  const v = c.velocity;
  const speed = Math.hypot(v.x, v.z);

  const inDeg = inLen > 1e-3 ? screenDeg(intents.moveX, intents.moveZ, basis) : null;
  const moveDeg = speed > 0.15 ? screenDeg(v.x, v.z, basis) : null;
  const faceDeg = screenDeg(Math.sin(c.facing), Math.cos(c.facing), basis);
  const aimDeg = intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > 1e-6
    ? screenDeg(intents.aimX, intents.aimZ, basis)
    : null;
  const t = world.targeting;
  const lockDeg = t.hasTarget ? screenDeg(Math.sin(t.targetYaw), Math.cos(t.targetYaw), basis) : null;

  const gapMove = inDeg !== null && moveDeg !== null ? angleGapDeg(inDeg, moveDeg) : null;
  const gapFace = inDeg !== null ? angleGapDeg(inDeg, faceDeg) : null;
  const warnMove = gapMove !== null && gapMove > MISMATCH_DEG && inLen >= 0.35 && speed >= 0.4;

  return {
    inDeg,
    inLen: Math.min(1, inLen),
    rawDeg: rawLen > 0.02 ? stickDeg(input.stickRawX, input.stickRawY) : null,
    rawLen: Math.min(1, rawLen),
    stickHeld: input.stickHeld,
    moveDeg,
    speed,
    faceDeg,
    lockDeg,
    lockId: t.targetId,
    lockDist: t.targetDist,
    aimDeg,
    gapMove,
    gapFace,
    warnMove,
  };
}

/** 是否应当提示「面朝向被改写了」（瞄准 / 攻击期间本来就该偏离，不提示）。 */
export function faceDrift(sample: DirSample, attacking: boolean): boolean {
  return !attacking && sample.aimDeg === null && sample.gapFace !== null
    && sample.gapFace > FACE_GAP_DEG && (sample.inLen >= 0.35 || sample.speed >= 0.4);
}

export type DirDebug = {
  update(world: World, input: InputFrame, basis: GroundBasis): void;
  setEnabled(on: boolean): void;
  toggle(): boolean;
  enabled(): boolean;
  last(): DirSample;
};

export type DirDebugOptions = {
  /** 输入摇杆的死区（用于画内圈），getter 以便调试面板热改即时生效 */
  deadZone?: () => number;
  /** v9q：把罗盘挂进外部面板容器（缺省挂 document.body，保持旧行为） */
  container?: HTMLElement;
  /** v9q：嵌入模式 —— 不自建开关胶囊 / 不绑 V 键 / 不持久化，开关交给外层面板。
   *  readDirs / data-* / update / last / setEnabled 等接口全部保持不变。 */
  embedded?: boolean;
};

const STORAGE_KEY = 'harness.dirDebug';

/**
 * 创建调试盘（DOM + canvas），并返回每帧喂数据的 update()。
 * 指针穿透，只有标题胶囊可点；键盘 V 也可切换显示。
 */
export function createDirDebug(opts: DirDebugOptions = {}): DirDebug {
  const embedded = !!opts.embedded;
  const root = document.createElement('div');
  root.id = 'dirdbg';
  if (embedded) root.classList.add('is-embedded');
  const panelParts = [
    '<canvas id="dirdbg-canvas" width="118" height="118"></canvas>',
    '<div id="dirdbg-read">',
    '  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>',
    '  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',
    '</div>',
  ];
  root.innerHTML = embedded
    ? panelParts.join('')
    : ['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>', ...panelParts].join('');
  (opts.container ?? document.body).appendChild(root);

  const canvas = root.querySelector<HTMLCanvasElement>('#dirdbg-canvas')!;
  const toggleEl = root.querySelector<HTMLButtonElement>('#dirdbg-toggle');
  const els = {
    in: root.querySelector<HTMLElement>('[data-k="in"]')!,
    mv: root.querySelector<HTMLElement>('[data-k="mv"]')!,
    fc: root.querySelector<HTMLElement>('[data-k="fc"]')!,
    gap: root.querySelector<HTMLElement>('[data-k="gap"]')!,
  };
  const ctx = canvas.getContext('2d');

  // 嵌入模式恒开：外层面板负责显隐，避免旧 localStorage 里的 '0' 让罗盘整块消失
  let enabled = true;
  if (!embedded) {
    try {
      enabled = window.localStorage.getItem(STORAGE_KEY) !== '0';
    } catch { /* 隐私模式 / 无 storage：默认开 */ }
  }

  function applyEnabled(): void {
    root.classList.toggle('is-off', !enabled);
    if (toggleEl) {
      toggleEl.textContent = enabled ? '方向 ⌄' : '方向 ▸';
      toggleEl.setAttribute('aria-expanded', String(enabled));
    }
  }
  applyEnabled();

  function setEnabled(on: boolean): void {
    enabled = on;
    if (!embedded) {
      try { window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch { /* 忽略 */ }
    }
    applyEnabled();
  }

  toggleEl?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEnabled(!enabled);
  });
  // 键盘 V：真机不好点小胶囊时的兜底；嵌入模式由外层面板统一接管这个快捷键
  if (!embedded) {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'v' && !e.metaKey && !e.ctrlKey) setEnabled(!enabled);
    });
  }

  // DPR：canvas 位图放大，CSS 尺寸不变，保证细线不发虚
  const dpr = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  const CSS_SIZE = 118;
  canvas.width = Math.round(CSS_SIZE * dpr);
  canvas.height = Math.round(CSS_SIZE * dpr);

  let last: DirSample = EMPTY_SAMPLE;
  let lastText = 0;
  let lastKey = '';
  /** 箭头长度归一用的速度上限（跑速 × 冲刺倍率），每帧从 CoreConfig 取 */
  let maxSpeed = 8;

  function draw(s: DirSample): void {
    if (!ctx) return;
    const w = CSS_SIZE;
    const h = CSS_SIZE;
    const cx = w / 2;
    const cy = h / 2;
    // 留出外圈刻度与「面朝向」边缘标记的空间
    const R = Math.min(w, h) / 2 - 13;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // 底盘
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.fillStyle = 'rgba(8, 12, 17, 0.5)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = s.warnMove ? 'rgba(251, 191, 36, 0.85)' : COLORS.ring;
    ctx.stroke();

    // 十字 + 45° 刻度：正上 = 相机前方
    ctx.strokeStyle = COLORS.grid;
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const x1 = cx + Math.sin(a) * (R - 3);
      const y1 = cy - Math.cos(a) * (R - 3);
      const x2 = cx + Math.sin(a) * R;
      const y2 = cy - Math.cos(a) * R;
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 死区圈：原始摇杆落在这个圈里 → 会被清零（表现上就是「推了但没动」）
    const dz = opts.deadZone ? Math.min(0.9, Math.max(0, opts.deadZone())) : 0;
    if (dz > 0) {
      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = COLORS.dead;
      ctx.beginPath();
      ctx.arc(cx, cy, R * dz, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    const arrow = (
      deg: number, len: number, color: string, width: number, dashed = false, alpha = 1,
    ): void => {
      const rad = (deg * Math.PI) / 180;
      const ux = Math.sin(rad);
      const uy = -Math.cos(rad);
      const L = R * Math.max(0.14, Math.min(1, len));
      const x1 = cx + ux * R * 0.14;
      const y1 = cy + uy * R * 0.14;
      const x2 = cx + ux * L;
      const y2 = cy + uy * L;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      if (dashed) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (!dashed && L > R * 0.3) {
        const ax = -uy;
        const ay = ux;
        const head = 5.2;
        ctx.beginPath();
        ctx.moveTo(x2 + ux * 1.5, y2 + uy * 1.5);
        ctx.lineTo(x2 - ux * head + ax * head * 0.72, y2 - uy * head + ay * head * 0.72);
        ctx.lineTo(x2 - ux * head - ax * head * 0.72, y2 - uy * head - ay * head * 0.72);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    /**
     * 面朝向（目标方向）画成「外圈三角 + 细虚线」：
     * 它是方向而不是幅度，且经常与输入同向；画成实心箭头会被青/黄两支盖住，
     * 摆在圈外就不会互相遮挡，三个角一致时一眼能看出「三点钟方向三条线重合」。
     */
    const rimMark = (deg: number, color: string): void => {
      const rad = (deg * Math.PI) / 180;
      const ux = Math.sin(rad);
      const uy = -Math.cos(rad);
      const ax = -uy;
      const ay = ux;
      const r = R + 1.5;
      const tip = r + 6.5;
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + ux * tip, cy + uy * tip);
      ctx.lineTo(cx + ux * r + ax * 4, cy + uy * r + ay * 4);
      ctx.lineTo(cx + ux * r - ax * 4, cy + uy * r - ay * 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 参考线先画（细/虚），主箭头后画（粗/亮）
    if (s.lockDeg !== null) arrow(s.lockDeg, 1, COLORS.lock, 1, true, 0.7);
    if (s.rawDeg !== null && s.stickHeld) arrow(s.rawDeg, s.rawLen, COLORS.raw, 1, true, 0.9);
    if (s.aimDeg !== null) arrow(s.aimDeg, 1, COLORS.aim, 1.6, true, 0.95);
    // 面朝向：淡虚线 + 圈外标记（不抢青/黄的画面）
    arrow(s.faceDeg, 1, COLORS.face, 1.1, true, 0.55);
    if (s.moveDeg !== null) arrow(s.moveDeg, s.speed / Math.max(1, maxSpeed), COLORS.move, 5.5, false, 0.8);
    if (s.inDeg !== null) arrow(s.inDeg, s.inLen, COLORS.input, 2.2);
    rimMark(s.faceDeg, COLORS.face);

    // 圆心
    ctx.beginPath();
    ctx.arc(cx, cy, 2.2, 0, TAU);
    ctx.fillStyle = 'rgba(220, 235, 248, 0.85)';
    ctx.fill();
  }

  function renderText(s: DirSample, attacking: boolean): void {
    const d = (n: number | null) => (n === null ? '-' : String(Math.round(normDeg(n))));
    els.in.textContent = `入 ${d(s.inDeg)}`;
    els.mv.textContent = `移 ${d(s.moveDeg)}`;
    els.fc.textContent = `面 ${d(s.faceDeg)}`;
    const g = (n: number | null) => (n === null ? '-' : `${Math.round(n)}°`);
    const parts = [`Δ入→移 ${g(s.gapMove)}`, `Δ入→面 ${g(s.gapFace)}`];
    if (s.speed > 0.05) parts.push(`v${s.speed.toFixed(1)}`);
    if (s.lockDeg !== null) parts.push(`锁#${s.lockId} ${s.lockDist.toFixed(1)}m`);
    if (s.aimDeg !== null) parts.push('拖拽瞄准');
    els.gap.textContent = parts.join('  ');
    root.classList.toggle('is-warn', s.warnMove || faceDrift(s, attacking));
  }

  return {
    update(world, input, basis): void {
      if (!enabled) return;
      maxSpeed = Math.max(1, world.config.moveSpeed * Math.max(1, world.config.sprintMultiplier));
      const s = readDirs(world, input, basis, maxSpeed);
      last = s;
      const attacking = world.combat.phase !== 'idle';
      draw(s);

      const now = performance.now();
      const key = `${s.inDeg}|${s.moveDeg}|${s.faceDeg}|${s.lockId}|${s.aimDeg}|${s.warnMove}|${s.speed.toFixed(1)}`;
      if (now - lastText > 90 || key !== lastKey) {
        lastText = now;
        lastKey = key;
        renderText(s, attacking);
        // 自动化断言用：一眼读走三个角，不必截图
        root.dataset.in = s.inDeg === null ? '' : normDeg(s.inDeg).toFixed(1);
        root.dataset.mv = s.moveDeg === null ? '' : normDeg(s.moveDeg).toFixed(1);
        root.dataset.fc = normDeg(s.faceDeg).toFixed(1);
        root.dataset.warn = s.warnMove || faceDrift(s, attacking) ? '1' : '0';
      }
    },
    setEnabled,
    toggle(): boolean {
      setEnabled(!enabled);
      return enabled;
    },
    enabled: () => enabled,
    last: () => last,
  };
}
