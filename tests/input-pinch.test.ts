import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInput } from '../src/adapters/input';
import type { InputOptions } from '../src/adapters/input';
import { CONFIG } from './helpers';

/**
 * v8e 输入层集成：在纯 Node 里用最小 DOM stub 派发假 PointerEvent，
 * 验证「捏合真的产出 InputFrame.zoomScale」「摇杆 / tap / UI 隔离没被误伤」。
 * 不引入 jsdom 等依赖，stub 只覆盖 input.ts 实际用到的几个 API。
 */

class FakeElement {
  constructor(private readonly ui: boolean) {}
  closest(): unknown { return this.ui ? {} : null; }
}

type Handler = (e: unknown) => void;

class FakeWindow {
  private readonly handlers = new Map<string, Handler[]>();
  addEventListener(type: string, h: Handler): void {
    const arr = this.handlers.get(type) ?? [];
    arr.push(h);
    this.handlers.set(type, arr);
  }
  removeEventListener(type: string, h: Handler): void {
    this.handlers.set(type, (this.handlers.get(type) ?? []).filter((x) => x !== h));
  }
  emit(type: string, e: unknown): void {
    for (const h of this.handlers.get(type) ?? []) h(e);
  }
  count(type: string): number { return (this.handlers.get(type) ?? []).length; }
}

function setup(): { win: FakeWindow; input: ReturnType<typeof createInput> } {
  const win = new FakeWindow();
  vi.stubGlobal('window', win);
  vi.stubGlobal('document', {
    getElementById: () => null,
    querySelectorAll: () => [],
  });
  vi.stubGlobal('Element', FakeElement);
  const opts: InputOptions = {
    maxRadiusPx: () => 56,
    deadZone: 0.08,
    getBasis: () => ({ rightX: 1, rightZ: 0, forwardX: 0, forwardZ: -1 }),
    zoom: () => ({ ...CONFIG.view.zoom }),
  };
  return { win, input: createInput(opts) };
}

const blank = {};                       // 非 FakeElement 实例 → isUiTarget=false（空白区）
const ui = new FakeElement(true);        // closest 命中 → isUiTarget=true
const prevent = (): void => { /* noop */ };

const down = (win: FakeWindow, id: number, x: number, y: number, target: unknown = blank): void =>
  win.emit('pointerdown', { pointerId: id, clientX: x, clientY: y, target, preventDefault: prevent });
const move = (win: FakeWindow, id: number, x: number, y: number, target: unknown = blank): void =>
  win.emit('pointermove', { pointerId: id, clientX: x, clientY: y, target, preventDefault: prevent });
const up = (win: FakeWindow, id: number, x: number, y: number, target: unknown = blank): void =>
  win.emit('pointerup', { pointerId: id, clientX: x, clientY: y, target, preventDefault: prevent });
const wheel = (win: FakeWindow, dy: number, target: unknown = blank): void =>
  win.emit('wheel', { deltaY: dy, deltaMode: 0, target, preventDefault: prevent });
const key = (win: FakeWindow, k: string): void =>
  win.emit('keydown', { key: k, preventDefault: prevent });

describe('v8e 输入层集成：捏合 → zoomScale，摇杆 / tap / UI 隔离不回归', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('单指摇杆照常工作，且不产生缩放 / tap', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    move(win, 1, 140, 100);
    const f = input.sample();
    expect(f.intents.moveX).toBeGreaterThan(0.5);
    expect(f.zoomScale).toBe(1);
    up(win, 1, 140, 100);
    input.dispose();
  });

  it('两指张开 → zoomScale>1、捏合 → <1；期间摇杆冻结、无 tap；抬一指后摇杆无缝接续', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    down(win, 2, 200, 100);       // 进入双指，基准距离 100
    move(win, 2, 260, 100);      // 张开
    let f = input.sample();
    expect(f.zoomScale).toBeGreaterThan(1);
    expect(f.intents.moveX).toBe(0);
    expect(f.intents.moveZ).toBe(0);
    expect(f.tap).toBeNull();

    move(win, 2, 220, 100);      // 捏合
    f = input.sample();
    expect(f.zoomScale).toBeLessThan(1);

    up(win, 2, 220, 100);        // 退出双指，剩余单指接续为摇杆
    f = input.sample();
    expect(f.zoomScale).toBe(1);  // 无残留跳变
    expect(f.tap).toBeNull();

    move(win, 1, 160, 100);      // 接续后的摇杆从新原点算方向
    f = input.sample();
    expect(f.intents.moveX).toBeGreaterThan(0);
    up(win, 1, 160, 100);
    input.dispose();
  });

  it('三指（摇杆 + 双指捏合）只取最后两根：摇杆那根移动不改缩放', () => {
    const { win, input } = setup();
    down(win, 1, 0, 0);
    down(win, 2, 0, 0);
    down(win, 3, 100, 0);        // pair = (2, 3)，距离 100
    move(win, 1, 50, 80);        // 只动第一根
    expect(input.sample().zoomScale).toBe(1);
    move(win, 3, 160, 0);        // 动最后一根 → 距离变 160
    expect(input.sample().zoomScale).toBeGreaterThan(1);
    up(win, 3, 160, 0);
    up(win, 2, 0, 0);
    up(win, 1, 50, 80);
    input.dispose();
  });

  it('UI 区域按下的指针不参与捏合（按技能按钮不会改镜头）', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    down(win, 9, 200, 100, ui);
    move(win, 9, 300, 100, ui);
    expect(input.sample().zoomScale).toBe(1);
    up(win, 9, 300, 100, ui);
    up(win, 1, 100, 100);
    input.dispose();
  });

  it('滚轮 / = - 键等价缩放，UI 区域滚轮不拦截也不缩放', () => {
    const { win, input } = setup();
    wheel(win, 100);                       // 向下滚 → 拉远
    expect(input.sample().zoomScale).toBeGreaterThan(1);
    wheel(win, -100);                      // 向上滚 → 拉近
    expect(input.sample().zoomScale).toBeLessThan(1);
    wheel(win, 100, ui);                   // UI 区域：面板自己滚，镜头不动
    expect(input.sample().zoomScale).toBe(1);
    key(win, '=');
    expect(input.sample().zoomScale).toBeGreaterThan(1);
    key(win, '-');
    expect(input.sample().zoomScale).toBeLessThan(1);
    input.dispose();
  });

  it('dispose 清理全部监听 + iOS gesturestart 兜底（空白区阻止、UI 放行）', () => {
    const { win, input } = setup();
    expect(win.count('pointerdown')).toBe(1);
    expect(win.count('wheel')).toBe(1);
    expect(win.count('gesturestart')).toBe(1);
    let blocked = 0;
    win.emit('gesturestart', { target: blank, preventDefault: () => { blocked += 1; } });
    win.emit('gesturestart', { target: ui, preventDefault: () => { blocked += 1; } });
    expect(blocked).toBe(1);
    input.dispose();
    expect(win.count('pointerdown')).toBe(0);
    expect(win.count('wheel')).toBe(0);
    expect(win.count('gesturestart')).toBe(0);
  });
});
