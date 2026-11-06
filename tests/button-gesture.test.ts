import { describe, expect, it } from 'vitest';
import {
  createGestureTracker,
  withWorldDirection,
} from '../src/adapters/button-gesture';
import type { ButtonGesture } from '../src/adapters/button-gesture';

const CFG = { slopPx: 12, longPressMs: 450, doubleTapMs: 280 };

/** 相机基：屏幕右 = 世界 +X，屏幕上 = 世界 -Z（常见第三人称朝向） */
const BASIS = { rightX: 1, rightZ: 0, forwardX: 0, forwardZ: -1 };

function kinds(gs: Array<ButtonGesture | null>): string[] {
  return gs.filter((g): g is ButtonGesture => g !== null).map((g) => g.kind);
}

describe('v9d 按钮手势：点击 / 双击 / 长按 / 拖拽', () => {
  it('按下再原地抬起 = press + tap（taps 1）', () => {
    const t = createGestureTracker(CFG);
    const press = t.begin('attack', 1, 100, 100, 0);
    const end = t.end(1, 102, 101, 120);
    expect(press?.kind).toBe('press');
    expect(end?.kind).toBe('tap');
    expect(end?.taps).toBe(1);
    expect(end?.distance).toBeLessThan(CFG.slopPx);
  });

  it('拖拽超过阈值产生 drag，抬起给 release 且带最终位移与角度', () => {
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 100, 100, 0);
    expect(t.move(1, 104, 100, 10)).toBeNull();          // 未过阈值
    const drag = t.move(1, 100, 160, 40);                // 向下 60px
    expect(drag?.kind).toBe('drag');
    expect(drag?.angleDeg).toBeCloseTo(90, 3);
    const end = t.end(1, 100, 180, 200);
    expect(end?.kind).toBe('release');
    expect(end?.dy).toBeCloseTo(80, 6);
    expect(end?.taps).toBe(1);
  });

  it('按住超过阈值触发 longPress（只一次），抬起算 release 不算 tap', () => {
    const t = createGestureTracker(CFG);
    t.begin('skill2', 1, 50, 50, 0);
    expect(t.poll(200)).toBeNull();
    const lp = t.poll(460);
    expect(lp?.kind).toBe('longPress');
    expect(lp?.heldMs).toBe(460);
    expect(t.poll(700)).toBeNull();                       // 不重复触发
    const end = t.end(1, 50, 50, 800);
    expect(end?.kind).toBe('release');
    expect(end?.heldMs).toBe(800);
  });

  it('两次快速轻点 = 第二次 doubleTap（taps 2）', () => {
    const t = createGestureTracker(CFG);
    t.begin('sprint', 1, 10, 10, 0);
    expect(t.end(1, 10, 10, 100)?.kind).toBe('tap');
    t.begin('sprint', 2, 10, 10, 200);
    const second = t.end(2, 11, 10, 260);
    expect(second?.kind).toBe('doubleTap');
    expect(second?.taps).toBe(2);
  });

  it('间隔超过 doubleTapMs 视为两次独立 tap', () => {
    const t = createGestureTracker(CFG);
    t.begin('sprint', 1, 10, 10, 0);
    t.end(1, 10, 10, 100);
    t.begin('sprint', 2, 10, 10, 500);
    expect(t.end(2, 10, 10, 560)?.kind).toBe('tap');
  });

  it('第二次点在不同位置不算双击', () => {
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 0, 0, 0);
    t.end(1, 0, 0, 100);
    t.begin('attack', 2, 200, 200, 180);
    expect(t.end(2, 200, 200, 220)?.kind).toBe('tap');
  });

  it('多指：两个按钮可同时按住，各自结束互不影响', () => {
    const t = createGestureTracker(CFG);
    expect(t.begin('attack', 1, 10, 10, 0)?.kind).toBe('press');
    expect(t.begin('sprint', 2, 90, 90, 0)?.kind).toBe('press');
    expect(t.isHeld('attack')).toBe(true);
    expect(t.isHeld('sprint')).toBe(true);
    expect(t.end(1, 10, 10, 120)?.button).toBe('attack');
    expect(t.isHeld('attack')).toBe(false);
    expect(t.isHeld('sprint')).toBe(true);
    expect(t.end(2, 90, 95, 150)?.kind).toBe('tap');
  });

  it('同一指针重复 begin 被拒绝；同一按钮第二根手指被拒绝', () => {
    const t = createGestureTracker(CFG);
    expect(t.begin('attack', 1, 0, 0, 0)).not.toBeNull();
    expect(t.begin('attack', 1, 5, 5, 10)).toBeNull();
    expect(t.begin('attack', 2, 5, 5, 10)).toBeNull();
  });

  it('系统打断 = cancel，之后可按同一个手指重新开始', () => {
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 10, 10, 0);
    expect(t.cancel(1, 80)?.kind).toBe('cancel');
    expect(t.isHeld('attack')).toBe(false);
    expect(t.begin('attack', 1, 10, 10, 100)?.kind).toBe('press');
  });

  it('reset 清空所有按住态', () => {
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 0, 0, 0);
    t.begin('jump', 2, 0, 0, 0);
    t.reset();
    expect(t.isHeld('attack')).toBe(false);
    expect(t.end(1, 0, 0, 10)).toBeNull();
  });

  it('长按与拖拽互斥：拖拽中不触发 longPress', () => {
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 0, 0, 0);
    t.move(1, 40, 0, 20);
    expect(t.poll(900)).toBeNull();
  });
});

describe('v9d 手势世界方向', () => {
  it('屏幕上拖 = 世界前方（-Z）', () => {
    const t = createGestureTracker(CFG);
    t.begin('skill2', 1, 100, 100, 0);
    const drag = t.move(1, 100, 40, 20)!;                // dy = -60
    const g = withWorldDirection(drag, BASIS, CFG.slopPx);
    expect(g.worldX).toBeCloseTo(0, 6);
    expect(g.worldZ).toBeCloseTo(-1, 6);
  });

  it('屏幕右拖 = 世界右方（+X）', () => {
    const t = createGestureTracker(CFG);
    t.begin('skill2', 1, 100, 100, 0);
    const drag = t.move(1, 180, 100, 20)!;
    const g = withWorldDirection(drag, BASIS, CFG.slopPx);
    expect(g.worldX).toBeCloseTo(1, 6);
    expect(g.worldZ).toBeCloseTo(0, 6);
  });

  it('轻点（位移不足 slop）不给世界方向', () => {
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 100, 100, 0);
    const tap = t.end(1, 104, 103, 90)!;
    const g = withWorldDirection(tap, BASIS, CFG.slopPx);
    expect(g.worldX).toBe(0);
    expect(g.worldZ).toBe(0);
  });

  it('基向量退化时不会产生 NaN', () => {
    const zero = { rightX: 0, rightZ: 0, forwardX: 0, forwardZ: 0 };
    const t = createGestureTracker(CFG);
    t.begin('attack', 1, 0, 0, 0);
    const drag = t.move(1, 50, 0, 10)!;
    const g = withWorldDirection(drag, zero, CFG.slopPx);
    expect(Number.isFinite(g.worldX)).toBe(true);
    expect(Number.isFinite(g.worldZ)).toBe(true);
    expect(g.worldX).toBe(0);
    expect(g.worldZ).toBe(0);
  });
});
