import type { GroundBasis, InputFrame } from '../adapters/input';
import type { World } from '../core';
import { createDirDebug } from './dir-debug';
import type { DirDebug } from './dir-debug';

/**
 * v9q · 手感调试面板（纯观测层，只读 World / InputFrame，不进 Core / 快照）。
 *
 * 一个可折叠的小浮层，把两样东西收在一起，不再各自飘在屏幕中间：
 *   ① 速度曲线：上半区画「角色速度随时间的变化」，下半区画每帧「速度变化量 Δv」
 *      （正 = 加速用青、负 = 减速用橙），读数行给当前 / 峰值 / 最近 Δv / 帧数；
 *   ② 方向罗盘：v9k 那个 #dirdbg 以 embedded 模式挂进来，接口与读数完全不变。
 *
 * 默认收起，只留一个胶囊；点胶囊或按 V 展开。整块指针穿透（只有胶囊可点），
 * 不会抢摇杆起点 / 按钮。面板收起时也照常采样，保证 __harness.dirAngles() 始终有值。
 */

const WINDOW_S = 6;
const CAPACITY = 480;
const CSS_W = 240;
const CSS_H = 92;

/** 一帧速度采样。t 为墙钟秒；dv 带符号，accel = dv / dt。纯函数便于单测。 */
export type SpeedSample = {
  t: number;
  speed: number;
  dv: number;
  accel: number;
};

export function sampleSpeed(
  prevSpeed: number, curSpeed: number, dt: number, t: number,
): SpeedSample {
  const dv = curSpeed - prevSpeed;
  return { t, speed: curSpeed, dv, accel: dt > 1e-4 ? dv / dt : 0 };
}

export type SpeedStats = {
  speed: number;
  dv: number;
  accel: number;
  peak: number;
  samples: number;
  windowS: number;
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
};

export function createMotionDebug(opts: MotionDebugOptions = {}): MotionDebug {
  const windowS = Math.max(1, opts.windowS ?? WINDOW_S);
  const capacity = Math.max(60, opts.capacity ?? CAPACITY);

  const root = document.createElement('div');
  root.id = 'motiondbg';
  // data-ui-region：输入层忽略面板内的 pointerdown，点面板不会顺带起摇杆
  root.setAttribute('data-ui-region', '');
  root.innerHTML = [
    '<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',
    '<div id="motiondbg-body">',
    '  <div id="motiondbg-head"><span>速度 / 变化量</span><span id="motiondbg-window">6.0s</span></div>',
    '  <canvas id="motiondbg-graph" width="240" height="92"></canvas>',
    '  <div id="motiondbg-read">v - · 峰 - · Δv -</div>',
    '  <div id="motiondbg-dir"></div>',
    '</div>',
  ].join('');
  document.body.appendChild(root);

  const toggleEl = root.querySelector<HTMLButtonElement>('#motiondbg-toggle')!;
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
    toggleEl.textContent = on ? '手感 ⌄' : '手感 ▸';
    toggleEl.setAttribute('aria-expanded', String(on));
    toggleEl.setAttribute('aria-label', on ? '收起手感调试面板' : '展开手感调试面板');
  }
  setEnabled(false);   // 默认收起：只留胶囊，不挡画面

  toggleEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEnabled(!enabled);
  });
  // 沿用旧方向盘的 V 快捷键（嵌入后由面板统一接管）
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v' && !e.metaKey && !e.ctrlKey) setEnabled(!enabled);
  });

  const buf: SpeedSample[] = [];
  let prevSpeed = 0;
  let lastWall = -1;
  let stats: SpeedStats = { speed: 0, dv: 0, accel: 0, peak: 0, samples: 0, windowS };

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

    // 网格 + 上下区零线
    ctx.strokeStyle = 'rgba(150, 190, 220, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const y of [topY, topY + topH / 2, topY + topH]) {
      ctx.moveTo(padL, y); ctx.lineTo(w - padR, y);
    }
    ctx.moveTo(padL, botY + botH / 2); ctx.lineTo(w - padR, botY + botH / 2);
    ctx.stroke();

    const peak = Math.max(1, ...samples.map((s) => s.speed));
    const vMax = peak * 1.15;
    const yV = (v: number): number => topY + topH - (v / vMax) * topH;

    if (samples.length > 1) {
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
      const speed = Math.hypot(c.velocity.x, c.velocity.z);
      const s = sampleSpeed(prevSpeed, speed, dt, now);
      prevSpeed = speed;
      buf.push(s);
      if (buf.length > capacity) buf.shift();

      const vis = visible(now);
      let peak = 0;
      for (const p of vis) peak = Math.max(peak, p.speed);
      stats = { speed, dv: s.dv, accel: s.accel, peak, samples: vis.length, windowS };

      // 罗盘每帧都更新：面板收起时 __harness.dirAngles() 也能读到最新三个角
      dirDebug.update(world, input, basis);

      if (enabled) {
        draw(vis, now);
        const sign = s.dv >= 0 ? '+' : '';
        readEl.textContent = `v ${speed.toFixed(2)} · 峰 ${peak.toFixed(2)} · Δv ${sign}${s.dv.toFixed(3)} · ${vis.length} 帧`;
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
