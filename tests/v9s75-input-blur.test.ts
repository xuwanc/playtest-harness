import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInput } from '../src/adapters/input';
import type { InputOptions } from '../src/adapters/input';
import { CONFIG } from './helpers';

/**
 * v9s.75 输入层：窗口失焦必须把键盘状态也清干净。
 *
 * 真实故障：切走窗口时按住的 w / j 收不到 keyup，`keys` 集合里残留键位。
 * 后果有两层 ——
 *   ① 角色一直朝旧方向走（发布自检里实测 0.6s 漂 0.44m，越走离目标越远）；
 *   ② `onKeyDown` 开头有 `keys.has(k)` 去重，残留的 `j` 会把之后每一次
 *      keydown 吞掉，表现为「切回窗口后攻击键彻底失灵」。
 * 旧版 releaseAllInputs 只清 pointer / 摇杆 / 按钮，键盘是漏的。
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

function setup(): { win: FakeWindow; input: ReturnType<typeof createInput> } {
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
  return { win, input: createInput(opts) };
}

/** 键盘事件：只有 key / preventDefault 被输入层用到 */
const key = (k: string): { key: string; preventDefault: () => void } => ({
  key: k, preventDefault: (): void => { /* noop */ },
});

describe('v9s.75 失焦清空键盘状态', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('按住 w 后失焦：移动输入归零（不会一直往前走）', () => {
    const { win, input } = setup();
    const idle = input.sample();
    expect(idle.intents.moveX).toBe(0);
    expect(idle.intents.moveZ).toBe(0);

    win.emit('keydown', key('w'));
    const held = input.sample();
    expect(Math.hypot(held.intents.moveX, held.intents.moveZ)).toBeGreaterThan(0.5);

    // keyup 丢失，直接失焦
    win.emit('blur', {});
    const after = input.sample();
    expect(after.intents.moveX).toBe(0);
    expect(after.intents.moveZ).toBe(0);
    expect(after.source).toBe('idle');
  });

  it('按住 j 后失焦：再按 j 仍然能触发攻击（不被 keys 去重吞掉）', () => {
    const { win, input } = setup();
    win.emit('keydown', key('j'));
    expect(input.sample().intents.attackPressed).toBe(true);
    // 第一帧消费完边沿；此时 attackHeld 仍为 true（键还没松）
    expect(input.sample().intents.attackHeld).toBe(true);

    // keyup 丢失（软件渲染 / 切窗口时真实发生）
    win.emit('blur', {});
    const cleared = input.sample();
    expect(cleared.intents.attackHeld).toBe(false);

    // 关键回归：没有清 keys 时，这里会 return，attackPressed 永远是 false
    win.emit('keydown', key('j'));
    expect(input.sample().intents.attackPressed).toBe(true);
  });

  it('失焦不会凭空造出边沿（不会自动攻出一刀）', () => {
    const { win, input } = setup();
    win.emit('keydown', key('w'));
    input.sample();
    win.emit('blur', {});
    const after = input.sample();
    expect(after.intents.attackPressed).toBe(false);
    expect(after.intents.jumpPressed).toBe(false);
    expect(after.intents.resetPressed).toBe(false);
    expect(after.intents.skill2Pressed).toBe(false);
  });
});
