import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInput } from '../src/adapters/input';
import type { InputOptions } from '../src/adapters/input';
import { CONFIG } from './helpers';

/**
 * v9m：摇杆坐标源的浏览器兼容性。
 *
 * 真机现场：鸿蒙自带浏览器把摇杆推左下 45°，按技能时方向正常，**松手一瞬间方向被改变**，
 * 再按一次又回到 45°；测下来像是「垂直方向凭空加/减了一个摇杆半径的向量」。
 * 换成微信内置浏览器（XWeb）就正常 —— 说明算法没坏，是那套 client 坐标在漂。
 *
 * 结论：这类漂移量级恰好等于一个摇杆半径（工具栏高度 ≈ 56px），而且是**平滑动画**
 * （每帧几像素），任何「跳变阈值」都抓不到。修法是方向改用物理屏幕坐标（screenX/Y），
 * 它对页面重排天然免疫。下面把这两种现场都变成可重复的断言。
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
}

function setup(): { win: FakeWindow; input: ReturnType<typeof createInput> } {
  const win = new FakeWindow();
  vi.stubGlobal('window', win);
  vi.stubGlobal('document', {
    getElementById: () => null,
    querySelectorAll: () => [],
    hidden: false,
    addEventListener: (): void => { /* noop */ },
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

const blank = {};
const prevent = (): void => { /* noop */ };

/** client 与 screen 分开给：模拟「client 漂了、物理屏幕没动」这种浏览器行为 */
const down = (w: FakeWindow, id: number, cx: number, cy: number, sx: number, sy: number): void =>
  w.emit('pointerdown', { pointerId: id, clientX: cx, clientY: cy, screenX: sx, screenY: sy, target: blank, preventDefault: prevent });
const move = (w: FakeWindow, id: number, cx: number, cy: number, sx: number, sy: number): void =>
  w.emit('pointermove', { pointerId: id, clientX: cx, clientY: cy, screenX: sx, screenY: sy, target: blank, preventDefault: prevent });

/** 左下 45°（屏幕坐标系：x 向右为正、y 向下为正）→ 世界向量 (-0.707, +0.707) */
const LEFT_DOWN = { x: -Math.SQRT1_2, z: Math.SQRT1_2 };

describe('v9m 摇杆坐标源：屏幕坐标免疫工具栏漂移', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('推左下 45°，随后 client 坐标平滑漂移一个半径（鸿蒙工具栏动画）→ 方向纹丝不动', () => {
    const { win, input } = setup();
    down(win, 1, 120, 600, 120, 600);
    move(win, 1, 60, 660, 60, 660);
    const before = input.sample();
    expect(before.intents.moveX).toBeCloseTo(LEFT_DOWN.x, 2);
    expect(before.intents.moveZ).toBeCloseTo(LEFT_DOWN.z, 2);

    // 手指物理上没动，clientY 每帧 +6（工具栏平滑收起），共漂 60px ≈ 一个摇杆半径
    for (let i = 1; i <= 10; i++) {
      move(win, 1, 60, 660 + 6 * i, 60, 660);
      input.sample();
    }
    const after = input.sample();
    expect(after.stickScreenOk).toBe(true);
    expect(after.intents.moveX).toBeCloseTo(LEFT_DOWN.x, 2);
    expect(after.intents.moveZ).toBeCloseTo(LEFT_DOWN.z, 2);
  });

  it('漂移是「减」半径时同样不跳（方向上下各试一遍）', () => {
    const { win, input } = setup();
    down(win, 1, 120, 660, 120, 660);
    move(win, 1, 60, 600, 60, 600); // 左上 45°
    input.sample();
    for (let i = 1; i <= 10; i++) {
      move(win, 1, 60, 600 - 6 * i, 60, 600); // clientY 往上漂
      input.sample();
    }
    const f = input.sample();
    expect(f.intents.moveX).toBeCloseTo(-Math.SQRT1_2, 2);
    expect(f.intents.moveZ).toBeCloseTo(-Math.SQRT1_2, 2);
  });

  it('屏幕坐标与 client 同步移动时正常跟随（不能被误吸收）', () => {
    const { win, input } = setup();
    down(win, 1, 120, 600, 120, 600);
    move(win, 1, 60, 660, 60, 660);
    input.sample();
    move(win, 1, 60, 600, 60, 600); // 真的把手指移到正左方
    const f = input.sample();
    expect(f.intents.moveX).toBeLessThan(-0.9);
    expect(Math.abs(f.intents.moveZ)).toBeLessThan(0.2);
  });

  it('screen 坐标恒为 0（不支持的浏览器）→ 回落 client，摇杆照常可用', () => {
    const { win, input } = setup();
    down(win, 1, 120, 600, 0, 0);
    move(win, 1, 60, 660, 0, 0);
    const f = input.sample();
    expect(f.stickScreenOk).toBe(false);
    expect(f.intents.moveX).toBeCloseTo(LEFT_DOWN.x, 2);
    expect(f.intents.moveZ).toBeCloseTo(LEFT_DOWN.z, 2);
  });

  it('client 一直在动而 screen 纹丝不动（screen 是假数据）→ 两帧内回退，摇杆不被冻死', () => {
    const { win, input } = setup();
    down(win, 1, 120, 600, 120, 600);
    move(win, 1, 200, 600, 120, 600);
    input.sample();
    move(win, 1, 280, 600, 120, 600);
    const f = input.sample();
    expect(f.stickScreenOk).toBe(false);
    expect(f.intents.moveX).toBeGreaterThan(0.9);
  });

  it('screen 用物理像素（DPR 2）时尺度自适应，方向仍然正确', () => {
    const { win, input } = setup();
    down(win, 1, 120, 600, 240, 1200);
    for (let i = 1; i <= 6; i++) {
      move(win, 1, 120 - 6 * i, 600 + 6 * i, 240 - 12 * i, 1200 + 12 * i);
      input.sample();
    }
    const f = input.sample();
    expect(f.stickScale).toBeGreaterThan(1.6);
    expect(f.intents.moveX).toBeCloseTo(LEFT_DOWN.x, 1);
    expect(f.intents.moveZ).toBeCloseTo(LEFT_DOWN.z, 1);
  });

  it('松手后状态全部归零，不影响下一次按下（「再按一次又回到 45°」的成因）', () => {
    const { win, input } = setup();
    down(win, 1, 120, 600, 120, 600);
    move(win, 1, 60, 660, 60, 660);
    input.sample();
    win.emit('pointerup', { pointerId: 1, clientX: 60, clientY: 660, target: blank, preventDefault: prevent });
    const released = input.sample();
    expect(released.stickHeld).toBe(false);
    expect(released.intents.moveX).toBe(0);
    expect(released.intents.moveZ).toBe(0);

    down(win, 2, 120, 600, 120, 600);
    move(win, 2, 60, 660, 60, 660);
    const again = input.sample();
    expect(again.intents.moveX).toBeCloseTo(LEFT_DOWN.x, 2);
    expect(again.intents.moveZ).toBeCloseTo(LEFT_DOWN.z, 2);
  });
});
