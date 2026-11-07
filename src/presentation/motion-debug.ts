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
 */

const WINDOW_S = 6;
const CAPACITY = 480;
const CSS_W = 240;
const CSS_H = 92;
/** 位移速度软上限：闪现 / 复位这类瞬移会算出几百 m/s，截断以免把整条曲线压平 */
const DEFAULT_SPEED_CAP = 18;

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
};

export function sampleSpeed(
  prevSpeed: number, curSpeed: number, dt: number, t: number,
): SpeedSample {
  const dv = curSpeed - prevSpeed;
  return {
    t, speed: curSpeed, drive: curSpeed, raw: curSpeed, dv,
    accel: dt > 1e-4 ? dv / dt : 0, busy: false,
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
    '<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>',
    '<canvas id="motiondbg-graph" width="240" height="92"></canvas>',
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
  let lastWall = -1;
  let stats: SpeedStats = {
    speed: 0, drive: 0, raw: 0, dv: 0, accel: 0, peak: 0, samples: 0, windowS, busy: false,
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
    const topH = 46;       // 上区：速度折线
    const botY = 62;
    const botH = 22;       // 下区：Δv 柱
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

    // 网格 + 上下区零线
    ctx.strokeStyle = 'rgba(150, 190, 220, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const y of [topY, topY + topH / 2, topY + topH]) {
      ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
    }
    ctx.moveTo(padL, botY + botH / 2); ctx.lineTo(w - padR, botY + botH / 2);
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

    ctx.font = '9px ui-monospace, monospace';
    ctx.fillStyle = 'rgba(190, 214, 234, 0.55)';
    ctx.textAlign = 'left';
    ctx.fillText(vMax.toFixed(1), padL + 2, topY + 8);
    ctx.fillText('v', padL + 2, topY + topH - 2);
    ctx.fillText('Δv', padL + 2, botY + 9);
    ctx.textAlign = 'right';
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
      };

      // 罗盘每帧都更新：面板收起时 __harness.dirAngles() 也能读到最新三个角
      dirDebug.update(world, input, basis);

      if (enabled) {
        draw(vis, now);
        const sign = s.dv >= 0 ? '+' : '';
        readEl.textContent = `v ${speed.toFixed(2)} · 驱 ${drive.toFixed(2)} · 峰 ${peak.toFixed(2)} · Δv ${sign}${s.dv.toFixed(3)} · ${vis.length} 帧`;
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
