import type { GroundBasis, InputFrame } from '../adapters/input';
import type { World } from '../core';
import { createDirDebug } from './dir-debug';
import type { DirDebug } from './dir-debug';

/**
 * v9r · 手感调试面板（纯观测层，只读 World / InputFrame，不进 Core / 快照）。
 *
 * 一个可折叠的小浮层，把两样东西收在一起，不再各自飘在屏幕中间：
 *   ① 速度曲线：上半区画「角色**实际位移速度**随时间的变化」，下半区画每帧 Δv
 *      （正 = 加速用青、负 = 减速用橙），读数行给当前 / 峰值 / Δv / 帧数；
 *   ② 方向罗盘：v9k 那个 #dirdbg 以 embedded 模式挂进来，接口与读数完全不变。
 *
 * v9r 关键改动：旧版曲线取 `hypot(character.velocity)`，但 Core 在攻击 / 技能段
 * 把 `attackMoveScale` 锁成 0（v.x=v.z=0），实际位移由 combat 的 lunge 直接写
 * position，于是技能期间曲线是一条 0 的空洞、看不出前后衔接。现在主值改成
 * **相邻两帧 position 差分 / 墙钟 dt**：lunge / 技能 / 击退 / 冲刺 / 闪现全部抓到；
 * 同时把 Core velocity 作为灰虚线「驱动速度」叠在同一坐标系，两条线的分叉与汇合
 * 就是衔接本身。攻击 / 技能 / 冲刺 / 击退帧用淡橙背景标出来，一眼定位。
 *
 * v9r：胶囊与容器可由外部（#panel-row / #panel-stack）注入，显隐归统一胶囊行管；
 * 不注入时退回自建浮层，保持旧用法可用。面板收起时也照常采样，
 * 保证 __harness.dirAngles() / speedSamples() 始终有值。
 *
 * v9s.42：底部加一条**步态相位曲线**（第三区）。读的是「本帧真正喂给 solveGait 的相位」
 * （`view.gaitDebug().phase`），不是 Core 的 `gaitPhase` —— 攻击时 Core 锁移速、相位冻住，
 * 而这一段腿由 `attackGaitDrive` 的等效驱动在走。曲线画成 sin(φ)：一个周期 = 一整步，
 * 正半周 = 左脚在支撑相（踩地）、负半周 = 右脚踩地。**踩地段按左右腿分色**
 * （琥珀 = 左 / 紫 = 右 / 灰 = 双支撑 / 青 = 腾空），一眼看出「现在哪只脚在地上」。
 */

const WINDOW_S = 6;
const CAPACITY = 480;
const CSS_W = 240;
/** 三区总高：速度 9..53 / Δv 58..78 / 相位 84..122（余 6px 留白） */
const CSS_H = 128;
/** 位移速度软上限：闪现 / 复位这类瞬移会算出几百 m/s，截断以免把整条曲线压平 */
const DEFAULT_SPEED_CAP = 18;
/** 低于这个速度视为站立（Core 静止时相位冻结，不能拿它判左右脚） */
const IDLE_SPEED = 0.05;
/** |sin φ| 小于这个带宽算「换脚的双支撑瞬间」 */
const DUAL_BAND = 0.16;
/**
 * v9s.42：一帧里相位推进超过这个量才算「在迈步」。
 * 不能用速度判 —— 攻击时 Core 锁移速（speed / velocity 都是 0），腿却由等效跨步在走；
 * 反过来站着不动时 Core 根本不推进相位。**相位自己走没走**才是唯一可靠判据。
 */
const PHASE_MOVING_EPS = 0.02;

/**
 * 相位 → 哪只脚踩地。纯函数，便于单测（v9s.42）。
 *
 * `solveGait` 里左腿取相位 φ、右腿取 φ+π，抬脚权重 `lift = (1 − sin φ) / 2`：
 *   sin φ > 0  → 左脚 lift 低（支撑相，踩地）/ 右脚抬起；
 *   sin φ < 0  → 反过来；
 *   |sin φ| ≈ 0 → 两脚都在低位，是换脚的瞬间（双支撑）。
 * 站着不动时 Core 相位冻结在一个任意值上，但两只脚都着地，单独判；
 * 离地（跳跃 / 击退腾空）则整段都不算踩地。
 */
export type Stance = 'L' | 'R' | 'both' | 'air';

export function stanceOf(phase: number, speed: number, grounded: boolean): Stance {
  if (!grounded) return 'air';
  if (speed < IDLE_SPEED) return 'both';
  const s = Math.sin(phase);
  if (s > DUAL_BAND) return 'L';
  if (s < -DUAL_BAND) return 'R';
  return 'both';
}

/** 相位归一到 [0, TAU)，只用于绘图 / 读数；stance 判定直接用 sin，不需要归一。 */
export function wrapPhase(phase: number): number {
  const TAU = Math.PI * 2;
  return ((phase % TAU) + TAU) % TAU;
}

/**
 * v9s.42：把 `cur` 展开到离 `prev` 最近的等价角（差一圈的整数倍）。
 * 相邻两帧相位差必然远小于 π（一帧最多走几分之一周期），所以最短弧就是真实增量。
 * 低帧率下（软件渲染 10fps）相位曲线只有几十个点，靠它做像素级插值补点。
 */
export function unwrapNear(prev: number, cur: number): number {
  const TAU = Math.PI * 2;
  let d = cur - prev;
  d -= Math.round(d / TAU) * TAU;
  return prev + d;
}

/** 相位区线色：琥珀 = 左脚踩地 / 紫 = 右脚踩地 / 灰 = 双支撑 / 青 = 腾空 */
const STANCE_LINE: Record<Stance, string> = {
  L: '#fbbf24', R: '#a78bfa', both: 'rgba(148, 163, 184, 0.85)', air: '#38bdf8',
};
const STANCE_BAND: Record<Stance, string> = {
  L: 'rgba(251, 191, 36, 0.13)',
  R: 'rgba(167, 139, 250, 0.13)',
  both: 'rgba(148, 163, 184, 0.09)',
  air: 'rgba(56, 189, 248, 0.07)',
};
const STANCE_LABEL: Record<Stance, string> = {
  L: '左踩', R: '右踩', both: '双踩', air: '腾空',
};

/** 一帧速度采样。t 为墙钟秒；dv 带符号，accel = dv / dt。纯函数便于单测。 */
export type SpeedSample = {
  t: number;
  /** 实际位移速度（m/s），软限幅后的绘图 / 统计值 */
  speed: number;
  /** Core velocity 大小（驱动速度），灰虚线对照 */
  drive: number;
  /** 未限幅的实际位移速度（诊断用） */
  raw: number;
  dv: number;
  accel: number;
  /** 本帧是否处于攻击 / 技能 / 冲刺 / 击退等非自主移动段 */
  busy: boolean;
  /** v9s.42：喂给 solveGait 的相位（rad，未归一化） */
  phase: number;
  /** v9s.42：本帧哪只脚踩地 */
  stance: Stance;
  /** v9s.42：本帧双脚是否着地（插值补点时要用它重判 stance） */
  grounded: boolean;
  /** v9s.42：本帧相位是否在推进（= 真的在迈步，插值补点时重判 stance 用） */
  moving: boolean;
};

export function sampleSpeed(
  prevSpeed: number, curSpeed: number, dt: number, t: number,
): SpeedSample {
  const dv = curSpeed - prevSpeed;
  return {
    t, speed: curSpeed, drive: curSpeed, raw: curSpeed, dv,
    accel: dt > 1e-4 ? dv / dt : 0, busy: false, phase: 0, stance: 'both', grounded: true,
    moving: false,
  };
}

/**
 * v9r：由相邻两帧的世界坐标算「实际位移速度」。
 * Core 的 lunge / 击退冲量 / 闪现都直接改 position、不进 velocity，只有位置差分能抓全。
 * cap 只截断绘图值，raw 保留原值供诊断。
 */
export function displacementSpeed(
  prev: { x: number; z: number },
  cur: { x: number; z: number },
  dt: number,
  cap: number,
): { speed: number; raw: number } {
  const d = Math.hypot(cur.x - prev.x, cur.z - prev.z);
  const raw = d / Math.max(dt, 1e-4);
  return { raw, speed: Math.min(raw, Math.max(1, cap)) };
}

/** 攻击 / 技能 / 冲刺 / 击退等非自主移动段标记，用于曲线背景带。 */
export function motionBusy(world: World): boolean {
  return world.combat.phase !== 'idle'
    || world.dash.phase === 'active'
    || world.abilities.channeling
    || Math.hypot(world.playerHurt.knockX, world.playerHurt.knockZ) > 1e-3;
}

export type SpeedStats = {
  speed: number;
  drive: number;
  raw: number;
  dv: number;
  accel: number;
  peak: number;
  samples: number;
  windowS: number;
  busy: boolean;
  /** v9s.42：当前相位（归一化 0..TAU）与踩地侧 */
  phase: number;
  stance: Stance;
};

export type MotionDebug = {
  update(world: World, input: InputFrame, basis: GroundBasis): void;
  /** 内嵌的方向罗盘：与旧 __harness.dirDebug 完全同接口（update/last/setEnabled/...） */
  dirDebug: DirDebug;
  setEnabled(on: boolean): void;
  toggle(): boolean;
  enabled(): boolean;
  /** 最近一次采样 + 窗口统计，供线上验收直接读数值（不必截图） */
  last(): SpeedStats;
  /** 当前窗口内的速度样本（拷贝），供自动化断言曲线形状 */
  samples(): SpeedSample[];
};

export type MotionDebugOptions = {
  /** 方向罗盘死区圈（getter，调试面板热改即时生效） */
  deadZone?: () => number;
  /** 曲线保留窗口（秒） */
  windowS?: number;
  /** 环形缓冲容量 */
  capacity?: number;
  /** 位移速度软上限（m/s） */
  speedCap?: number;
  /** v9r：外部面板容器（#motiondbg）；注入后不自建浮层 */
  container?: HTMLElement;
  /** v9r：外部开关胶囊（#motiondbg-toggle）；注入后显隐/文案归统一胶囊行管 */
  toggle?: HTMLElement;
  /**
   * v9s.42：相位来源（一般是 `view.gaitDebug().phase`，即真正喂给 solveGait 的那个）。
   * 不注入时退回 `world.character.gaitPhase`（攻击期间会冻住，只算降级可用）。
   */
  phaseSource?: () => number | null;
};

export function createMotionDebug(opts: MotionDebugOptions = {}): MotionDebug {
  const windowS = Math.max(1, opts.windowS ?? WINDOW_S);
  const capacity = Math.max(60, opts.capacity ?? CAPACITY);
  const speedCap = Math.max(1, opts.speedCap ?? DEFAULT_SPEED_CAP);
  const external = !!(opts.container && opts.toggle);

  const root = opts.container ?? document.createElement('div');
  root.id = 'motiondbg';
  if (!opts.container) {
    root.setAttribute('data-ui-region', '');
    document.body.appendChild(root);
  }
  const bodyParts = [
    '<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>',
    '<canvas id="motiondbg-graph" width="240" height="128"></canvas>',
    '<div id="motiondbg-read">v - · 峰 - · Δv -</div>',
    '<div id="motiondbg-dir"></div>',
  ].join('');
  root.innerHTML = external
    ? `<div id="motiondbg-body">${bodyParts}</div>`
    : [
      '<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',
      `<div id="motiondbg-body">${bodyParts}</div>`,
    ].join('');

  const toggleEl = opts.toggle ?? root.querySelector<HTMLButtonElement>('#motiondbg-toggle');
  const canvas = root.querySelector<HTMLCanvasElement>('#motiondbg-graph')!;
  const readEl = root.querySelector<HTMLElement>('#motiondbg-read')!;
  const winEl = root.querySelector<HTMLElement>('#motiondbg-window')!;
  const dirContainer = root.querySelector<HTMLElement>('#motiondbg-dir')!;
  winEl.textContent = `${windowS.toFixed(1)}s`;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = Math.round(CSS_W * dpr);
  canvas.height = Math.round(CSS_H * dpr);

  // v9q：方向罗盘收进面板，不再自己 fixed 到屏幕中间
  const dirDebug = createDirDebug({
    deadZone: opts.deadZone, container: dirContainer, embedded: true,
  });

  let enabled = false;
  function setEnabled(on: boolean): void {
    enabled = on;
    root.classList.toggle('is-off', !on);
    // 外置胶囊由 #panel-row 统一改文案 / aria，这里不碰，避免两处抢同一份状态
    if (!external && toggleEl) {
      toggleEl.textContent = on ? '手感 ⌄' : '手感 ▸';
      toggleEl.setAttribute('aria-expanded', String(on));
      toggleEl.setAttribute('aria-label', on ? '收起手感调试面板' : '展开手感调试面板');
    }
  }
  setEnabled(false);   // 默认收起：只留胶囊，不挡画面

  if (!external) {
    toggleEl?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setEnabled(!enabled);
    });
    // 自建浮层才自己接管 V 键；外置时由统一胶囊行接管
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'v' && !e.metaKey && !e.ctrlKey) setEnabled(!enabled);
    });
  }

  const buf: SpeedSample[] = [];
  let prevSpeed = 0;
  let prevPos: { x: number; z: number } | null = null;
  let prevPhase = 0;
  let hasPhase = false;
  let lastWall = -1;
  let stats: SpeedStats = {
    speed: 0, drive: 0, raw: 0, dv: 0, accel: 0, peak: 0, samples: 0, windowS, busy: false,
    phase: 0, stance: 'both',
  };

  function visible(now: number): SpeedSample[] {
    const from = now - windowS;
    let i = 0;
    while (i < buf.length && buf[i].t < from) i++;
    return buf.slice(i);
  }

  function draw(samples: SpeedSample[], now: number): void {
    if (!ctx) return;
    const w = CSS_W;
    const h = CSS_H;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(8, 12, 17, 0.55)';
    ctx.fillRect(0, 0, w, h);

    const padL = 4;
    const padR = 4;
    const innerW = w - padL - padR;
    const topY = 9;
    const topH = 44;       // 上区：速度折线
    const botY = 58;
    const botH = 20;       // 中区：Δv 柱
    const phY = 84;
    const phH = 38;        // 下区：步态相位 sin(φ)
    const x0 = now - windowS;
    const px = (t: number): number =>
      padL + Math.max(0, Math.min(1, (t - x0) / windowS)) * innerW;

    // v9r：攻击 / 技能 / 冲刺 / 击退段的淡橙背景带，用来看「自主移动 → 技能位移」衔接
    for (let i = 0; i < samples.length; i++) {
      if (!samples[i].busy) continue;
      const xa = px(samples[i].t);
      const xb = i + 1 < samples.length ? px(samples[i + 1].t) : xa + 2;
      ctx.fillStyle = 'rgba(251, 146, 60, 0.13)';
      ctx.fillRect(xa, topY, Math.max(2, xb - xa), topH);
    }

    // 网格 + 各分区零线 / 边界
    ctx.strokeStyle = 'rgba(150, 190, 220, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const y of [topY, topY + topH / 2, topY + topH]) {
      ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
    }
    ctx.moveTo(padL, botY + botH / 2); ctx.lineTo(w - padR, botY + botH / 2);
    // 相位区：上下边（±1）+ 中线（0）
    for (const y of [phY, phY + phH / 2, phY + phH]) {
      ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
    }
    ctx.stroke();

    const peak = Math.max(1, ...samples.map((s) => s.speed), ...samples.map((s) => s.drive));
    const vMax = peak * 1.15;
    const yV = (v: number): number => topY + topH - (v / vMax) * topH;

    if (samples.length > 1) {
      // 主曲线：实际位移速度（青实线 + 填充）
      ctx.beginPath();
      ctx.moveTo(px(samples[0].t), yV(samples[0].speed));
      for (let i = 1; i < samples.length; i++) {
        ctx.lineTo(px(samples[i].t), yV(samples[i].speed));
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.lineTo(px(samples[samples.length - 1].t), topY + topH);
      ctx.lineTo(px(samples[0].t), topY + topH);
      ctx.closePath();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.fill();

      // v9r：Core velocity（驱动速度）灰虚线对照 —— 技能段两条线的分叉就是 lunge
      ctx.beginPath();
      ctx.moveTo(px(samples[0].t), yV(samples[0].drive));
      for (let i = 1; i < samples.length; i++) {
        ctx.lineTo(px(samples[i].t), yV(samples[i].drive));
      }
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(190, 205, 220, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 每帧速度变化量：正(加速) 青 / 负(减速) 橙，围绕零线上下对称
    let dvMax = 0.02;
    for (const s of samples) dvMax = Math.max(dvMax, Math.abs(s.dv));
    dvMax *= 1.1;
    const mid = botY + botH / 2;
    const half = botH / 2;
    for (const s of samples) {
      const bh = Math.min(half, (Math.abs(s.dv) / dvMax) * half);
      ctx.fillStyle = s.dv >= 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(251, 146, 60, 0.85)';
      ctx.fillRect(px(s.t) - 0.7, s.dv >= 0 ? mid - bh : mid, 1.4, Math.max(0.5, bh));
    }

    // ---- v9s.42：步态相位区（sin φ）----
    // 一条正弦 = 相位随时间走；正半周 = 左腿支撑相（踩地），负半周 = 右腿踩地。
    // 线按「哪只脚在地上」分色，底色同色但更淡，于是踩地段就是一段彩色波峰/波谷。
    const yPh = (v: number): number => phY + phH / 2 - v * (phH / 2 - 1);
    for (let i = 0; i < samples.length; i++) {
      const st = samples[i].stance;
      if (st === 'air') continue;
      const xa = px(samples[i].t);
      const xb = i + 1 < samples.length ? px(samples[i + 1].t) : xa + 2;
      ctx.fillStyle = STANCE_BAND[st];
      ctx.fillRect(xa, phY, Math.max(1, xb - xa), phH);
    }
    if (samples.length > 1) {
      // 逐段描线：段色跟着「这只脚是否踩地」走，换脚处就是一次颜色切换。
      // 低帧率时两点相距很远，直接连折线会把正弦画成锯齿 —— 相位在帧间连续单调推进，
      // 按像素密度在中间补点（每 ~2px 一个），曲线才是真形状，颜色切换点也更准。
      let prevX = px(samples[0].t);
      let prevY = yPh(Math.sin(samples[0].phase));
      for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1];
        const b = samples[i];
        const xa = px(a.t);
        const xb = px(b.t);
        const pb = unwrapNear(a.phase, b.phase);
        const steps = Math.max(1, Math.min(16, Math.round((xb - xa) / 2)));
        for (let k = 1; k <= steps; k++) {
          const f = k / steps;
          const ph = a.phase + (pb - a.phase) * f;
          const x = xa + (xb - xa) * f;
          const y = yPh(Math.sin(ph));
          const st = k === steps ? b.stance : stanceOf(ph, a.moving ? 1 : 0, a.grounded);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = STANCE_LINE[st];
          ctx.lineWidth = 1.7;
          ctx.lineJoin = 'round';
          ctx.stroke();
          prevX = x; prevY = y;
        }
      }
      // 当前相位：右侧一个小圆点，读数行同步给数值与踩地侧
      const last = samples[samples.length - 1];
      ctx.beginPath();
      ctx.arc(px(last.t) - 1.5, yPh(Math.sin(last.phase)), 2.1, 0, Math.PI * 2);
      ctx.fillStyle = STANCE_LINE[last.stance];
      ctx.fill();
    }

    ctx.font = '9px ui-monospace, monospace';
    ctx.fillStyle = 'rgba(190, 214, 234, 0.55)';
    ctx.textAlign = 'left';
    ctx.fillText(vMax.toFixed(1), padL + 2, topY + 8);
    ctx.fillText('v', padL + 2, topY + topH - 2);
    ctx.fillText('Δv', padL + 2, botY + 9);
    // 相位区左右两角的语义标注：上 = 左脚踩地，下 = 右脚踩地
    ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
    ctx.fillText('L', padL + 2, phY + 8);
    ctx.fillStyle = 'rgba(167, 139, 250, 0.75)';
    ctx.fillText('R', padL + 2, phY + phH - 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(190, 214, 234, 0.55)';
    ctx.fillText('0', w - padR - 2, topY + topH - 2);
    ctx.textAlign = 'left';
  }

  return {
    dirDebug,
    update(world, input, basis): void {
      const now = performance.now() / 1000;
      // 墙钟 dt：Core 暂停时曲线继续走（速度恒 0），不会除零
      const dt = lastWall < 0 ? 1 / 60 : Math.max(1e-4, Math.min(0.25, now - lastWall));
      lastWall = now;
      const c = world.character;
      const pos = { x: c.position.x, z: c.position.z };
      const drive = Math.hypot(c.velocity.x, c.velocity.z);
      // v9r：主值取实际位移，才抓得到 lunge / 技能 / 击退 / 冲刺 / 闪现
      const { speed, raw } = prevPos
        ? displacementSpeed(prevPos, pos, dt, speedCap)
        : { speed: 0, raw: 0 };
      const s = sampleSpeed(prevSpeed, speed, dt, now);
      s.drive = drive;
      s.raw = raw;
      s.busy = motionBusy(world);
      // v9s.42：相位优先取「真正喂给 solveGait 的那个」（攻击段由等效驱动在走），
      // 拿不到才退回 Core 的 gaitPhase（攻击期间会冻住）。
      const rawPhase = opts.phaseSource?.() ?? c.gaitPhase;
      s.phase = rawPhase;
      s.grounded = c.grounded;
      s.moving = hasPhase && Math.abs(unwrapNear(prevPhase, rawPhase) - prevPhase) > PHASE_MOVING_EPS;
      prevPhase = rawPhase;
      hasPhase = true;
      s.stance = stanceOf(rawPhase, s.moving ? 1 : 0, c.grounded);
      prevPos = pos;
      prevSpeed = speed;
      buf.push(s);
      if (buf.length > capacity) buf.shift();

      const vis = visible(now);
      let peak = 0;
      for (const p of vis) peak = Math.max(peak, p.speed);
      stats = {
        speed, drive, raw, dv: s.dv, accel: s.accel, peak,
        samples: vis.length, windowS, busy: s.busy,
        phase: wrapPhase(rawPhase), stance: s.stance,
      };

      // 罗盘每帧都更新：面板收起时 __harness.dirAngles() 也能读到最新三个角
      dirDebug.update(world, input, basis);

      if (enabled) {
        draw(vis, now);
        const sign = s.dv >= 0 ? '+' : '';
        readEl.textContent = `v ${speed.toFixed(2)} · 驱 ${drive.toFixed(2)} · 峰 ${peak.toFixed(2)} · Δv ${sign}${s.dv.toFixed(3)} · ${vis.length} 帧`
          + `\nφ ${wrapPhase(rawPhase).toFixed(2)} · ${STANCE_LABEL[s.stance]}`;
      }
    },
    setEnabled,
    toggle(): boolean {
      setEnabled(!enabled);
      return enabled;
    },
    enabled: () => enabled,
    last: () => ({ ...stats }),
    samples: () => visible(performance.now() / 1000).map((p) => ({ ...p })),
  };
}
