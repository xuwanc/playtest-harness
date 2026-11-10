/**
 * v9s.x · 常驻性能条：帧率 / 帧时间 / 掉帧判定。
 *
 * ## 为什么单独做，而不是塞进 HUD
 * HUD 默认是「收起态一行摘要」，而且会被「状态」胶囊切走；调试时真正想知道的是
 * 「这一帧是不是掉了、掉了多少」，必须**永远在屏、不随面板折叠消失**。
 * 所以这里是一块独立 DOM，纯观测、不进 Core、不进快照、不参与确定性。
 *
 * ## 怎么判「掉帧」
 * 单看瞬时 FPS 会被尖峰平均掉，因此同时给四个互补读数：
 *  - **窗口真实 FPS**：最近约 1s 的帧数 / 实际耗时（不是 `1/dt` 的单帧外推）；
 *  - **慢帧数 /s**：窗口内 > 33.3ms（低于 30fps）的帧数，这是「肉眼可见的卡」；
 *  - **峰值帧时**：窗口内最长的一帧，以及一条 96 帧的 sparkline 看分布；
 *  - **固定步数 steps**：Core 一帧补算了几步，> 1 就是这一帧确实掉过。
 * 颜色三档（ok / warn / bad）让掉帧在余光里也能被发现，不用盯数字。
 *
 * 统计部分 `createPerfTracker()` 是无 DOM 的纯函数式状态机，可单测；
 * `createPerfMeter()` 只负责把读数画进 DOM，文本 / 图形按 100ms 节流，静止时不折腾布局。
 */

/** 低于此帧率算「慢帧」（30fps） */
export const SLOW_MS = 1000 / 30;
/** 超过此帧时算一次尖峰（与 telemetry 的 frameSpike 阈值一致） */
export const SPIKE_MS = 50;
/** sparkline 保留的帧数 */
export const HISTORY_FRAMES = 96;
/** 首帧着色器编译 / 布局不算异常，跳过这段时间 */
const WARMUP_MS = 600;

export type PerfLevel = 'ok' | 'warn' | 'bad';

export type PerfSnapshot = {
  /** 最近约 1s 窗口的真实 FPS */
  fps: number;
  /** 平滑后的当前帧时间（ms） */
  dtMs: number;
  /** 窗口内最长帧（ms） */
  maxMs: number;
  /** 窗口内慢帧数量（> SLOW_MS） */
  slowFrames: number;
  /** 累计尖峰帧数（> SPIKE_MS，跳过 warmup） */
  spikes: number;
  /** 本帧 Core 补算的固定步数；> 1 即掉帧 */
  steps: number;
  /** 启动以来最长的一帧（ms） */
  worstMs: number;
  level: PerfLevel;
  /** 最近 HISTORY_FRAMES 帧的帧时（ms），供 sparkline / 验收 */
  history: number[];
};

export type PerfTracker = {
  push(dtMs: number, steps: number): PerfSnapshot;
  snapshot(): PerfSnapshot;
};

/** 无 DOM 的统计核心。只读入参、确定性，可在 Node 里单测。 */
export function createPerfTracker(): PerfTracker {
  /** 最近约 1s 的帧时（ms），用于算窗口 FPS / 慢帧 / 峰值 */
  let window: number[] = [];
  let windowSum = 0;
  let history: number[] = [];
  let smoothDt = 16.7;
  let totalMs = 0;
  let spikes = 0;
  let worstMs = 0;
  let steps = 0;

  function snapshot(): PerfSnapshot {
    let slowFrames = 0;
    let maxMs = 0;
    for (const d of window) {
      if (d > SLOW_MS) slowFrames++;
      if (d > maxMs) maxMs = d;
    }
    const fps = windowSum > 0 ? (window.length * 1000) / windowSum : 0;
    // 还没采到样本（首帧之前）不算掉帧，否则 fps=0 会一上来就标红
    const level: PerfLevel = window.length === 0
      ? 'ok'
      : fps < 45 || slowFrames >= 3
        ? 'bad'
        : fps < 55 || slowFrames >= 1 || steps > 1
          ? 'warn'
          : 'ok';
    return {
      fps, dtMs: smoothDt, maxMs, slowFrames, spikes, steps, worstMs,
      level, history: history.slice(),
    };
  }

  return {
    push(dtMs, steps_): PerfSnapshot {
      const d = Number.isFinite(dtMs) && dtMs > 0 ? dtMs : 0;
      steps = Number.isFinite(steps_) ? steps_ : 0;
      totalMs += d;
      smoothDt = smoothDt * 0.8 + d * 0.2;
      if (d > worstMs) worstMs = d;
      // 首 0.6s 是着色器编译 / 首帧布局，固定会有大尖峰，计了只是噪音
      if (totalMs > WARMUP_MS && d > SPIKE_MS) spikes++;

      window.push(d);
      windowSum += d;
      while (windowSum > 1000 && window.length > 1) {
        windowSum -= window.shift() as number;
      }
      history.push(d);
      if (history.length > HISTORY_FRAMES) history.shift();
      return snapshot();
    },
    snapshot,
  };
}

export type PerfMeter = {
  /** 每帧调用；返回本帧读数（便于 diagnostics / 自动化验收） */
  update(dtMs: number, steps: number): PerfSnapshot;
  snapshot(): PerfSnapshot;
};

/** 把读数渲染成常驻 DOM：两行文字 + 96 帧 sparkline，文本按 100ms 节流。 */
export function createPerfMeter(el: HTMLElement): PerfMeter {
  const doc = el.ownerDocument;
  const canvas = doc.createElement('canvas');
  canvas.className = 'perf-spark';
  canvas.width = 240;
  canvas.height = 48;
  const text = doc.createElement('div');
  text.className = 'perf-text';
  el.appendChild(canvas);
  el.appendChild(text);
  const ctx = canvas.getContext('2d');
  const tracker = createPerfTracker();
  let sinceDraw = 1e9; // 首帧立即画

  function draw(history: number[]): void {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    // 16.7ms（60fps）基准线：满量程 60ms
    const y60 = h - (16.7 / 60) * h;
    ctx.strokeStyle = 'rgba(160, 190, 220, 0.30)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y60);
    ctx.lineTo(w, y60);
    ctx.stroke();
    if (history.length === 0) return;
    const slot = w / HISTORY_FRAMES;
    const barW = Math.max(1, slot - 0.5);
    const start = HISTORY_FRAMES - history.length;
    for (let i = 0; i < history.length; i++) {
      const d = history[i];
      const bh = Math.min(1, d / 60) * h;
      ctx.fillStyle = d > SPIKE_MS ? '#ff6b6b'
        : d > SLOW_MS ? '#ffd166' : '#6fe0a0';
      ctx.fillRect((start + i) * slot, h - bh, barW, bh);
    }
  }

  function render(s: PerfSnapshot): void {
    el.dataset.level = s.level;
    el.dataset.slow = String(s.slowFrames);
    el.dataset.steps = String(s.steps);
    text.textContent =
      `${s.fps.toFixed(0)} fps  ${s.dtMs.toFixed(1)}ms\n`
      + `慢帧 ${s.slowFrames}/s  峰 ${s.maxMs.toFixed(0)}ms  步 ${s.steps}`;
    draw(s.history);
  }

  return {
    update(dtMs, steps): PerfSnapshot {
      const s = tracker.push(dtMs, steps);
      sinceDraw += dtMs;
      if (sinceDraw >= 100) {
        sinceDraw = 0;
        render(s);
      }
      return s;
    },
    snapshot(): PerfSnapshot {
      return tracker.snapshot();
    },
  };
}
