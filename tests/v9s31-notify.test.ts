import { describe, expect, it } from 'vitest';
import {
  collectNotifies, phaseScalar, step, validateNotifies,
} from '../src/core';
import type { GameEvent, NotifyDef, World } from '../src/core';
import { CONFIG, intent, makeWorld } from './helpers';

/**
 * v9s.31 · 关键帧事件（AnimNotify）。
 *
 * 验收要点：
 *  1. 纯函数的区间语义（左开右闭、cursor<0 含 0 时刻、跨阶段连续、排序）；
 *  2. 集成：一段真实攻击里每条通知恰好一次，且**不随 dt 变化**（帧率无关）；
 *  3. 卡肉冻结期间不推进游标（否则恢复瞬间会补发一串）。
 */

const SS: NotifyDef[] = [
  { at: 'windup', u: 0.5, name: 'a' },
  { at: 'active', u: 0, name: 'b' },
  { at: 'recovery', u: 1, name: 'c' },
];

describe('v9s.31 collectNotifies 区间语义', () => {
  it('cursor<0 表示攻击刚开始：0 时刻的通知会发出', () => {
    const atZero: NotifyDef[] = [{ at: 'windup', u: 0, name: 'start' }];
    expect(collectNotifies(atZero, -1, 0).map((n) => n.name)).toEqual(['start']);
  });

  it('左开右闭：同一区间重复扫描不会重发', () => {
    const first = collectNotifies(SS, -1, 2.4);
    expect(first.map((n) => n.name)).toEqual(['a', 'b']);
    // 游标已经走到 2.4，再扫同一段是空的
    expect(collectNotifies(SS, 2.4, 2.4)).toEqual([]);
  });

  it('跨阶段一帧扫完，按时间顺序返回', () => {
    const got = collectNotifies(SS, -1, 3);
    expect(got.map((n) => n.name)).toEqual(['a', 'b', 'c']);
    expect(got.map((n) => n.at)).toEqual(['windup', 'active', 'recovery']);
  });

  it('阶段标量首尾相接：windup u=1 与 active u=0 落在同一刻度', () => {
    expect(phaseScalar('windup', 1)).toBe(1);
    expect(phaseScalar('active', 0)).toBe(1);
    expect(phaseScalar('recovery', 1)).toBe(3);
  });

  it('非法数据被校验拦住', () => {
    expect(validateNotifies(SS)).toEqual([]);
    expect(validateNotifies([{ at: 'idle' as any, u: 0, name: 'x' }])).not.toEqual([]);
    expect(validateNotifies([{ at: 'active', u: 1.4, name: 'x' }])).not.toEqual([]);
    expect(validateNotifies([{ at: 'active', name: '' }])).not.toEqual([]);
  });
});

/** 打完整一段攻击（到 settle 结束），收集全部 notify 事件。 */
function swingOnce(dt: number): { world: World; notes: GameEvent[] } {
  const w = makeWorld();
  w.modules.targeting = false;
  w.config.combat.weapons['sword-shield'].lunge = [0, 0, 0];
  // 假人移开，避免命中卡肉干扰时间轴
  w.dummies.forEach((d, i) => {
    d.mode = 'idle';
    d.position.x = 20 + i;
    d.position.z = 20;
  });
  const notes: GameEvent[] = [];
  step(w, dt, intent({ attackPressed: true }));
  notes.push(...w.events.filter((e) => e.type === 'notify'));
  const maxFrames = Math.ceil(2 / dt);
  for (let i = 0; i < maxFrames; i++) {
    step(w, dt, intent());
    notes.push(...w.events.filter((e) => e.type === 'notify'));
    if (w.combat.phase === 'idle' && w.combat.comboWindow > 0 && i > 2) break;
  }
  return { world: w, notes };
}

describe('v9s.31 关键帧事件（集成）', () => {
  it('一段剑盾攻击里每条通知恰好一次，顺序正确', () => {
    const { notes } = swingOnce(1 / 60);
    const names = notes.map((n) => n.name);
    expect(names).toEqual(['blade-air', 'blade-air', 'foot-step']);
    // 第一条是 windup 的风声（value 0.5），第二条才是挥出的（1.0）
    expect(notes[0].value).toBeCloseTo(0.5, 6);
    expect(notes[1].value).toBeCloseTo(1, 6);
  });

  it('换成 30Hz 步长，事件序列完全一致（帧率无关）', () => {
    const a = swingOnce(1 / 60).notes.map((n) => `${n.name}:${n.value}`);
    const b = swingOnce(1 / 30).notes.map((n) => `${n.name}:${n.value}`);
    expect(b).toEqual(a);
  });

  it('配置里的每条 notifies 都合法（portable 级校验）', () => {
    for (const [id, p] of Object.entries(CONFIG.core.combat.weapons)) {
      expect(validateNotifies(p.notifies), `武器 ${id}`).toEqual([]);
    }
  });

  it('命中窗口在 0..1 内且 start ≤ end', () => {
    for (const [id, p] of Object.entries(CONFIG.core.combat.weapons)) {
      const w = p.hitWindow;
      if (!w) continue;
      expect(w.start, `武器 ${id}`).toBeGreaterThanOrEqual(0);
      expect(w.end, `武器 ${id}`).toBeLessThanOrEqual(1);
      expect(w.start, `武器 ${id}`).toBeLessThanOrEqual(w.end);
    }
  });

  it('卡肉冻结期间不推进游标：恢复后不会补发', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    w.config.combat.weapons['sword-shield'].lunge = [0, 0, 0];
    // 把假人放在面前，保证 active 第一帧命中
    const s = w.dummies[0];
    s.mode = 'idle';
    s.position.x = 0;
    s.position.z = w.character.position.z - 1.2;
    for (let i = 1; i < w.dummies.length; i++) {
      w.dummies[i].mode = 'idle';
      w.dummies[i].position.x = 20 + i;
      w.dummies[i].position.z = 20;
    }
    step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
    let hits = 0;
    const notes: string[] = [];
    for (let i = 0; i < 90; i++) {
      step(w, w.config.fixedDt, intent());
      hits += w.events.filter((e) => e.type === 'hit').length;
      for (const e of w.events) if (e.type === 'notify') notes.push(e.name as string);
    }
    expect(hits).toBe(1);
    // 挥出那一帧被冻住，但不能因此重复发 blade-air
    expect(notes.filter((n) => n === 'blade-air').length).toBe(2);
  });
});
