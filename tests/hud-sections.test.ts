import { describe, expect, it } from 'vitest';
import type { InputFrame } from '../src/adapters/input';
import type { DebugState } from '../src/presentation/debug-panel';
import { buildHudSections } from '../src/presentation/hud';
import type { World } from '../src/core';
import { intent, makeWorld } from './helpers';

const DEBUG: DebugState = {
  timeScale: 1, paused: false, showColliders: false, showGrid: false,
  showLab: true, showLabLabels: true,
};

function frame(p: Partial<InputFrame> = {}): InputFrame {
  return {
    intents: intent(),
    stickX: 0, stickY: 0, stickRawX: 0, stickRawY: 0, stickHeld: false,
    stickId: null, stickOriginX: 0, stickOriginY: 0, stickPxX: 0, stickPxY: 0, stickBad: 0,
    stickScreenOk: false, stickOriginSX: 0, stickOriginSY: 0,
    stickScreenX: 0, stickScreenY: 0, stickScale: 1, stickVpTop: 0, stickVpAge: -1,
    aimDX: 0, aimDY: 0,
    source: 'idle', tap: null, zoomScale: 1, gestures: [], lastGesture: null,
    ...p,
  };
}

function sections(w: World, opts: { compact?: boolean; portrait?: boolean } = {}) {
  return buildHudSections(w, 60, 1, frame(), DEBUG, undefined, {
    compact: opts.compact ?? false, portrait: opts.portrait ?? false,
  });
}
const flat = (w: World, opts = {}): string =>
  sections(w, opts).flatMap((s) => s.lines).join('\n');

describe('状态读数按语义分区', () => {
  it('横屏分 6 区，标题顺序固定、每区都有行', () => {
    const secs = sections(makeWorld());
    expect(secs.map((s) => s.title)).toEqual([
      '运行 / 角色', '朝向 / 动作', '战斗 / 连招', '镜头 / 目标', '环境 / 假人', '调试 / 事件',
    ]);
    expect(secs.every((s) => s.lines.length > 0)).toBe(true);
    expect(secs.reduce((n, s) => n + s.lines.length, 0)).toBe(15);
  });

  it('竖屏分 5 区，短版 7 行（不压武器条）', () => {
    const secs = sections(makeWorld(), { portrait: true });
    expect(secs.map((s) => s.title)).toEqual([
      '运行 / 角色', '朝向 / 动作', '战斗 / 连招', '环境 / 假人', '调试 / 事件',
    ]);
    expect(secs.reduce((n, s) => n + s.lines.length, 0)).toBe(7);
  });

  it('收起态只一行摘要、无标题，且保留关键状态', () => {
    const secs = sections(makeWorld(), { compact: true });
    expect(secs).toHaveLength(1);
    expect(secs[0].title).toBe('');
    expect(secs[0].lines).toHaveLength(1);
    expect(secs[0].lines[0]).toContain('fps');
    expect(secs[0].lines[0]).toContain('hit');
  });

  it('整理只加分区，不丢字段：横屏原有 15 行字段全在', () => {
    const text = flat(makeWorld());
    for (const key of [
      'tick', 'pos', 'vel', 'grounded', 'hurt', 'ik', 'orient face', 'move (',
      'weapon', 'dash  kind', 'link ', 'camera ', 'target ', 'dummies ', 'event ',
    ]) {
      expect(text).toContain(key);
    }
  });

  it('竖屏短版字段同样不丢', () => {
    const text = flat(makeWorld(), { portrait: true });
    for (const key of ['tick', 'pos', 'face ', 'weapon ', 'aim ', 'dummies ', 'event ']) {
      expect(text).toContain(key);
    }
  });

  it('行顺序保持原样（分区只在段间插标题，不重排）', () => {
    const text = flat(makeWorld());
    const order = ['tick ', 'pos  ', 'vel  ', 'grounded', 'ik ', 'orient face',
      'move (', 'weapon ', 'dash  kind', 'link ', 'camera ', 'target ',
      'dummies ', 'event '];
    let cursor = -1;
    for (const key of order) {
      const at = text.indexOf(key);
      expect(at).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it('纯函数：同输入结果一致、不修改传入的 World / InputFrame', () => {
    const w = makeWorld();
    const inp = frame();
    const before = JSON.stringify(w);
    const a = buildHudSections(w, 60, 1, inp, DEBUG, undefined,
      { compact: false, portrait: false });
    const b = buildHudSections(w, 60, 1, inp, DEBUG, undefined,
      { compact: false, portrait: false });
    expect(a).toEqual(b);
    expect(JSON.stringify(w)).toBe(before);
    expect(JSON.stringify(inp)).toBe(JSON.stringify(frame()));
  });

  it('World 状态变化实时反映到所在分区', () => {
    const w = makeWorld();
    const before = sections(w).find((s) => s.title === '战斗 / 连招')!.lines[0];
    w.combat.comboIndex = 2;
    w.combat.attackProgress = 0.5;
    w.dash.cooldown = 1.25;
    const after = sections(w).find((s) => s.title === '战斗 / 连招')!.lines;
    expect(after[0]).not.toBe(before);
    expect(after[0]).toContain('combo 2/3');
    expect(after[1]).toContain('cd 1.25s');
  });

  it('慢放 / 暂停标记跟着 debug 走', () => {
    const w = makeWorld();
    const paused = buildHudSections(w, 60, 1, frame(),
      { ...DEBUG, paused: true, timeScale: 0.25 }, undefined,
      { compact: false, portrait: false });
    const eventLine = paused.find((s) => s.title === '调试 / 事件')!.lines[0];
    expect(eventLine).toContain('0.25');
    expect(eventLine).toContain('[PAUSED]');
  });
});
