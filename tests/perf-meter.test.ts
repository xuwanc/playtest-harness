import { describe, expect, it } from 'vitest';
import {
  HISTORY_FRAMES, SLOW_MS, SPIKE_MS, createPerfTracker,
} from '../src/presentation/perf-meter';

describe('v9s.x 常驻性能条：掉帧判定', () => {
  it('初始读数干净', () => {
    const s = createPerfTracker().snapshot();
    expect(s.fps).toBe(0);
    expect(s.slowFrames).toBe(0);
    expect(s.level).toBe('ok');
    expect(s.history).toEqual([]);
  });

  it('稳定 60fps：窗口 FPS≈60、无慢帧、level ok、history 定长', () => {
    const t = createPerfTracker();
    for (let i = 0; i < 120; i++) t.push(1000 / 60, 1);
    const s = t.snapshot();
    expect(s.fps).toBeGreaterThan(58);
    expect(s.fps).toBeLessThan(62);
    expect(s.slowFrames).toBe(0);
    expect(s.level).toBe('ok');
    expect(s.history.length).toBe(HISTORY_FRAMES);
  });

  it('单帧 50ms：记一次慢帧 + 峰值，level 升 warn', () => {
    const t = createPerfTracker();
    for (let i = 0; i < 60; i++) t.push(16.7, 1);
    const s = t.push(50, 1);
    expect(s.slowFrames).toBe(1);
    expect(s.maxMs).toBeGreaterThanOrEqual(50);
    expect(s.level).toBe('warn');
  });

  it('连续慢帧 / 低 FPS → level bad', () => {
    const t = createPerfTracker();
    for (let i = 0; i < 20; i++) t.push(45, 2);
    const s = t.snapshot();
    expect(s.slowFrames).toBeGreaterThanOrEqual(3);
    expect(s.level).toBe('bad');
    expect(s.steps).toBe(2);
  });

  it('steps>1 即使帧时正常也提示 warn（Core 补算 = 确实掉过帧）', () => {
    const t = createPerfTracker();
    for (let i = 0; i < 60; i++) t.push(16.7, 1);
    const s = t.push(16.7, 2);
    expect(s.level).toBe('warn');
    expect(s.steps).toBe(2);
  });

  it('尖峰计数跳过首 0.6s warmup（着色器编译不算掉帧）', () => {
    const t = createPerfTracker();
    for (let i = 0; i < 10; i++) t.push(80, 1); // 累计 800ms
    const s = t.snapshot();
    expect(s.spikes).toBeGreaterThan(0);
    expect(s.spikes).toBeLessThan(10);
    expect(s.worstMs).toBe(80);
  });

  it('窗口只保留约 1s：FPS 是最近窗口真实值，不被早期低帧率拖住', () => {
    const t = createPerfTracker();
    for (let i = 0; i < 60; i++) t.push(100, 1);       // 6s 的 10fps
    for (let i = 0; i < 60; i++) t.push(1000 / 60, 1); // 1s 的 60fps
    const s = t.snapshot();
    expect(s.fps).toBeGreaterThan(50);
    expect(s.slowFrames).toBe(0);
    expect(s.level).toBe('ok');
  });

  it('阈值：慢帧 = 30fps、尖峰 = 50ms（与 telemetry 一致）', () => {
    expect(SLOW_MS).toBeCloseTo(1000 / 30, 6);
    expect(SPIKE_MS).toBe(50);
  });
});
