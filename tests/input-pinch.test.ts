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
    hidden: false,
    addEventListener: (): void => { /* v9d：blur / visibilitychange 兜底不需要在 stub 里跑 */ },
    removeEventListener: (): void => { /* noop */ },
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

  it('两指张开 → zoomScale>1、捏合 → <1；v9e 摇杆不被冻结；抬一指后仍可继续走', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    down(win, 2, 200, 100);      // 进入双指，基准距离 100
    move(win, 2, 260, 100);      // +60px ≥ 18 → 确认手势（重置基准 260）
    expect(input.sample().zoomScale).toBe(1);
    move(win, 2, 320, 100);      // 张开
    let f = input.sample();
    expect(f.zoomScale).toBeGreaterThan(1);
    expect(f.tap).toBeNull();

    // v9e：捏合期间摇杆照常工作（旧版会清 stickId → 按按钮/蹭屏幕时移动失灵）
    move(win, 1, 160, 100);
    f = input.sample();
    expect(f.intents.moveX).toBeGreaterThan(0);

    move(win, 2, 260, 100);      // 捏合
    expect(input.sample().zoomScale).toBeLessThan(1);

    up(win, 2, 260, 100);        // 退出双指：摇杆那根仍在，方向不被重置
    f = input.sample();
    expect(f.zoomScale).toBe(1);  // 无残留跳变
    expect(f.tap).toBeNull();
    expect(f.intents.moveX).toBeGreaterThan(0);   // 没有「抬手瞬间方向归零」

    up(win, 1, 160, 100);
    input.dispose();
  });

  it('三指（摇杆 + 双指捏合）只取最后两根：摇杆那根移动不改缩放', () => {
    const { win, input } = setup();
    // v9n：模拟坐标整体平移 20px，避开 (0,0) 幻影起点防御（真机上 (0,0) 会被丢弃）
    down(win, 1, 20, 20);
    down(win, 2, 20, 20);
    down(win, 3, 120, 20);       // pair = (2, 3)，距离仍为 100
    move(win, 1, 70, 100);       // 只动第一根
    expect(input.sample().zoomScale).toBe(1);
    move(win, 3, 180, 20);       // +60px 越过阈值 → 确认手势，本帧不缩放
    expect(input.sample().zoomScale).toBe(1);
    move(win, 3, 220, 20);       // 继续张开 → 缩放
    expect(input.sample().zoomScale).toBeGreaterThan(1);
    up(win, 3, 220, 20);
    up(win, 2, 20, 20);
    up(win, 1, 70, 100);
    input.dispose();
  });

  it('v9n：pointerup 换了 pointerId（WebView 行为）也要释放摇杆', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    move(win, 1, 150, 120);
    expect(Math.abs(input.sample().intents.moveX)).toBeGreaterThan(0.3);
    // 抬起事件的 id 与按下时不一致：旧逻辑会残留 stickId，方向一直挂在旧向量上
    up(win, 99, 150, 120);
    const f = input.sample();
    expect(f.stickHeld).toBe(false);
    expect(f.intents.moveX).toBe(0);
    expect(f.intents.moveZ).toBe(0);
  });

  it('v9n：(0,0) 假 pointerdown 不建摇杆原点', () => {
    const { win, input } = setup();
    down(win, 1, 0, 0);
    move(win, 1, 100, 100);
    const f = input.sample();
    expect(f.stickHeld).toBe(false);
    expect(f.intents.moveX).toBe(0);
  });

  it('v9n：UI 指抬起不会误释放仍在按住的摇杆', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    move(win, 1, 150, 120);
    down(win, 2, 300, 400, ui);       // 技能按钮指
    up(win, 2, 300, 400, ui);
    const f = input.sample();
    expect(f.stickHeld).toBe(true);
    expect(Math.abs(f.intents.moveX)).toBeGreaterThan(0.3);
  });

  it('v9e 第二指轻触（<18px）不缩放、不影响摇杆：按按钮时手掌蹭屏不再搅动镜头', () => {
    const { win, input } = setup();
    down(win, 1, 100, 100);
    move(win, 1, 150, 100);
    expect(input.sample().intents.moveX).toBeGreaterThan(0);
    down(win, 2, 300, 400);      // 蹭到屏幕第二点
    move(win, 2, 310, 404);      // 只动了 10px
    const f = input.sample();
    expect(f.zoomScale).toBe(1);
    expect(f.intents.moveX).toBeGreaterThan(0);
    up(win, 2, 310, 404);
    up(win, 1, 150, 100);
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

  it('dispose 清理全部监听 + iOS gesturestart 一律阻止（含 UI 区域）', () => {
    const { win, input } = setup();
    expect(win.count('pointerdown')).toBe(1);
    expect(win.count('wheel')).toBe(1);
    expect(win.count('gesturestart')).toBe(1);
    let blocked = 0;
    // v9e：UI 区域也拦。手指同时落在「摇杆 + 按钮」时系统捏合会被接管，
    // 进而给已按下的手指补 pointercancel，表现就是移动方向被掐断。
    win.emit('gesturestart', { target: blank, preventDefault: () => { blocked += 1; } });
    win.emit('gesturestart', { target: ui, preventDefault: () => { blocked += 1; } });
    expect(blocked).toBe(2);
    input.dispose();
    expect(win.count('pointerdown')).toBe(0);
    expect(win.count('wheel')).toBe(0);
    expect(win.count('gesturestart')).toBe(0);
  });
});
