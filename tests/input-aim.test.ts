import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInput } from '../src/adapters/input';
import type { InputOptions } from '../src/adapters/input';
import { CONFIG } from './helpers';

/**
 * v9i 输入层：按钮「点按」与「拖拽瞄准」的分界。
 *
 * 真机日志（v0.9.9）：按住摇杆向左下移动时点按技能2，拇指自然位移 13px，
 * 旧阈值 12px 把这次点按当成拖拽瞄准，朝向被改到抖动方向（屏幕 -78° = 左上），
 * 松手 140ms 余辉结束才回到摇杆方向。
 *
 * 这里用最小 DOM stub 走真实的 pointerdown/move/up 序列，断言：
 * 点按不产生 aim、不打断移动；只有明确拖出去才改朝向。
 */

class FakeElement {
  constructor(private readonly ui: boolean) {}
  closest(): unknown { return this.ui ? {} : null; }
}

type Handler = (e: unknown) => void;

class FakeButton extends FakeElement {
  private readonly handlers = new Map<string, Handler[]>();
  readonly classList = { add: (): void => {}, remove: (): void => {}, contains: (): boolean => false };
  constructor() { super(true); }
  addEventListener(type: string, h: Handler): void {
    const arr = this.handlers.get(type) ?? [];
    arr.push(h);
    this.handlers.set(type, arr);
  }
  removeEventListener(type: string, h: Handler): void {
    this.handlers.set(type, (this.handlers.get(type) ?? []).filter((x) => x !== h));
  }
  setPointerCapture(): void { /* stub */ }
  emit(type: string, e: unknown): void {
    for (const h of this.handlers.get(type) ?? []) h(e);
  }
}

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

type Rig = {
  win: FakeWindow;
  input: ReturnType<typeof createInput>;
  buttons: Record<string, FakeButton>;
};

function setup(): Rig {
  const win = new FakeWindow();
  const buttons: Record<string, FakeButton> = {};
  for (const k of ['jump', 'sprint', 'reset', 'attack', 'skill2']) buttons[k] = new FakeButton();

  vi.stubGlobal('window', win);
  vi.stubGlobal('document', {
    getElementById: (id: string) => {
      const m = /^btn-(.+)$/.exec(id);
      return m ? buttons[m[1]] ?? null : null;
    },
    querySelectorAll: () => [],
    hidden: false,
    addEventListener: (): void => { /* visibilitychange 不参与本测试 */ },
    removeEventListener: (): void => { /* noop */ },
  });
  vi.stubGlobal('Element', FakeElement);

  const opts: InputOptions = {
    maxRadiusPx: () => 56,
    deadZone: 0.08,
    getBasis: () => ({ rightX: 1, rightZ: 0, forwardX: 0, forwardZ: -1 }),
    zoom: () => ({ ...CONFIG.view.zoom }),
  };
  return { win, input: createInput(opts), buttons };
}

const blank = {};
const prevent = (): void => { /* noop */ };

type Ev = {
  pointerId: number; pointerType: string; clientX: number; clientY: number;
  buttons: number; target: unknown; preventDefault: () => void;
};

const ev = (id: number, x: number, y: number, target: unknown = blank): Ev => ({
  pointerId: id, pointerType: 'touch', clientX: x, clientY: y, buttons: 1, target, preventDefault: prevent,
});

const stickDown = (win: FakeWindow, id: number, x: number, y: number): void =>
  win.emit('pointerdown', ev(id, x, y));
const stickMove = (win: FakeWindow, id: number, x: number, y: number): void =>
  win.emit('pointermove', ev(id, x, y));

/** 按钮按下：先走按钮自身监听器，再冒泡到 window（与浏览器一致） */
function btnDown(r: Rig, k: string, id: number, x: number, y: number): void {
  const el = r.buttons[k];
  const e = ev(id, x, y, el);
  el.emit('pointerdown', e);
  r.win.emit('pointerdown', e);
}
function btnMove(r: Rig, id: number, x: number, y: number): void {
  r.win.emit('pointermove', ev(id, x, y, r.buttons.skill2));
}
function btnUp(r: Rig, k: string, id: number, x: number, y: number): void {
  const el = r.buttons[k];
  const e = ev(id, x, y, el);
  el.emit('pointerup', e);
  r.win.emit('pointerup', e);
}

describe('v9i 按钮点按 vs 拖拽瞄准', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('摇杆推向左下 + 点按技能2（抖动 13px）：朝向输入不被 aim 接管', () => {
    const r = setup();
    stickDown(r.win, 1, 200, 600);
    stickMove(r.win, 1, 140, 640);            // 左下（屏幕坐标 y 向下）
    const moving = r.input.sample();
    expect(moving.intents.moveX).toBeLessThan(-0.4);
    expect(moving.intents.moveZ).toBeGreaterThan(0.4);
    expect(moving.intents.aimActive).toBe(false);

    btnDown(r, 'skill2', 2, 330, 700);
    btnMove(r, 2, 343, 700);                  // 真机日志里的 13px 抖动
    const during = r.input.sample();
    expect(during.intents.aimActive).toBe(false);
    // 摇杆输入原样保留，没有被抖动方向覆盖
    expect(during.intents.moveX).toBeCloseTo(moving.intents.moveX, 6);
    expect(during.intents.moveZ).toBeCloseTo(moving.intents.moveZ, 6);

    btnUp(r, 'skill2', 2, 343, 700);
    const after = r.input.sample();
    // 未确认拖拽的抬起不留余辉
    expect(after.intents.aimActive).toBe(false);
    expect(r.input.peekAim().active).toBe(false);
    expect(after.intents.moveX).toBeCloseTo(moving.intents.moveX, 6);
  });

  it('拖出确认阈值（40px）才进入 aim，方向按相机地面基换算', () => {
    const r = setup();
    stickDown(r.win, 1, 200, 600);
    stickMove(r.win, 1, 140, 640);
    r.input.sample();

    btnDown(r, 'skill2', 2, 330, 700);
    btnMove(r, 2, 370, 700);                  // 向右拖 40px
    const f = r.input.sample();
    expect(f.intents.aimActive).toBe(true);
    expect(f.intents.aimX).toBeCloseTo(1, 5);  // rightX=1
    expect(f.intents.aimZ).toBeCloseTo(0, 5);
    expect(r.input.peekAim().active).toBe(true);
  });

  it('拖出去再缩回 10px：撤销瞄准（迟滞），朝向回到移动输入', () => {
    const r = setup();
    btnDown(r, 'skill2', 2, 330, 700);
    btnMove(r, 2, 380, 700);                  // 50px，确认
    expect(r.input.sample().intents.aimActive).toBe(true);
    btnMove(r, 2, 340, 700);                  // 缩回 10px（< 16 退出阈值）
    const f = r.input.sample();
    expect(f.intents.aimActive).toBe(false);
    expect(r.input.peekAim().active).toBe(false);
  });

  it('确认拖拽后松手：余辉内仍保留瞄准方向（v9d 弓 / 法杖回归）', () => {
    const r = setup();
    btnDown(r, 'attack', 2, 330, 700);
    btnMove(r, 2, 360, 640);                  // 右上，距离约 67px
    const held = r.input.sample();
    expect(held.intents.aimActive).toBe(true);

    btnUp(r, 'attack', 2, 360, 640);
    const glow = r.input.sample();
    expect(glow.intents.aimActive).toBe(true);
    expect(glow.intents.aimX).toBeCloseTo(held.intents.aimX, 6);
    expect(glow.intents.aimZ).toBeCloseTo(held.intents.aimZ, 6);
  });

  it('两个按钮各自 13px 抖动都不产生 aim（攻击 / 技能2 一视同仁）', () => {
    const r = setup();
    for (const k of ['attack', 'skill2']) {
      btnDown(r, k, 3, 330, 700);
      btnMove(r, 3, 330, 713);
      expect(r.input.sample().intents.aimActive).toBe(false);
      btnUp(r, k, 3, 330, 713);
      expect(r.input.sample().intents.aimActive).toBe(false);
    }
  });
});
