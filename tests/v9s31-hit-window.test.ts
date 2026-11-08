import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.31 · 命中窗口（`WeaponProfile.hitWindow`）。
 *
 * 旧版只在 active 的第一帧扫一次扇形：敌人如果在挥出去之后才走进刀风，
 * 或者从侧面绕进来，就完全吃不到伤害。现在整个窗口内每帧都扫，
 * 靠 `CombatState.hitIds` 保证「同一目标本次攻击只结算一次」。
 *
 * 这组用例用「第 3 个 active 帧才把敌人挪进范围」来区分新旧行为。
 */

type Window = { start: number; end: number };

function setup(window: Window): World {
  const w = makeWorld();
  w.modules.targeting = false;
  const p = w.config.combat.weapons['sword-shield'];
  p.lunge = [0, 0, 0];
  p.hitWindow = window;
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].mode = 'idle';
    w.dummies[i].position.x = 20 + i;
    w.dummies[i].position.z = 20;
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.position.x = 0;
  s.position.z = w.character.position.z - 4; // 一开始在攻击距离外
  s.velocity.x = 0;
  s.velocity.z = 0;
  return w;
}

/** 起手，然后在 active 的第 3 帧把敌人挪到正前方 1.2m；返回命中次数。 */
function lateTargetHits(window: Window): number {
  const w = setup(window);
  step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
  const s = w.dummies[0];
  let activeFrames = 0;
  let hits = 0;
  for (let i = 0; i < 60; i++) {
    step(w, w.config.fixedDt, intent());
    if (w.combat.phase === 'active') {
      activeFrames += 1;
      if (activeFrames === 3) {
        s.position.x = 0;
        s.position.z = w.character.position.z - 1.2;
        s.hurt.knockX = 0;
        s.hurt.knockZ = 0;
      }
    }
    hits += w.events.filter((e) => e.type === 'hit').length;
  }
  return hits;
}

describe('v9s.31 命中窗口', () => {
  it('窗口覆盖整段 active：中途进入刀风的敌人也能被打到', () => {
    expect(lateTargetHits({ start: 0, end: 1 })).toBe(1);
  });

  it('窗口只留第一帧（旧行为）：同样的敌人会漏', () => {
    expect(lateTargetHits({ start: 0, end: 0 })).toBe(0);
  });

  it('窗口提前结束：第 3 帧才进入的敌人赶不上', () => {
    expect(lateTargetHits({ start: 0, end: 0.15 })).toBe(0);
  });

  it('窗口内每帧都扫，但同一目标只结算一次', () => {
    const w = setup({ start: 0, end: 1 });
    const s = w.dummies[0];
    s.position.z = w.character.position.z - 1.2; // 一开始就在范围内
    step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
    let hits = 0;
    let frames = 0;
    for (let i = 0; i < 60; i++) {
      step(w, w.config.fixedDt, intent());
      if (w.combat.phase === 'active') frames += 1;
      hits += w.events.filter((e) => e.type === 'hit').length;
    }
    expect(frames).toBeGreaterThan(3); // 窗口里确实扫了好几帧
    expect(hits).toBe(1);
  });

  it('同一次攻击可以命中多个目标（各结算一次）', () => {
    const w = setup({ start: 0, end: 1 });
    const a = w.dummies[0];
    const b = w.dummies[1];
    a.mode = 'idle';
    b.mode = 'idle';
    a.position.x = -0.35;
    a.position.z = w.character.position.z - 1.1;
    b.position.x = 0.35;
    b.position.z = w.character.position.z - 1.1;
    for (let i = 2; i < w.dummies.length; i++) w.dummies[i].position.x = 20 + i;
    step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
    let hits = 0;
    for (let i = 0; i < 60; i++) {
      step(w, w.config.fixedDt, intent());
      hits += w.events.filter((e) => e.type === 'hit').length;
    }
    expect(hits).toBe(2);
  });

  it('下一段攻击清空命中表：同一目标能再次受击', () => {
    const w = setup({ start: 0, end: 1 });
    const s = w.dummies[0];
    s.position.z = w.character.position.z - 1.2;
    step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
    let hits = 0;
    for (let i = 0; i < 60; i++) {
      // 按住不放：自动连击，第二段应当再次命中同一目标
      step(w, w.config.fixedDt, intent({ attackHeld: true }));
      hits += w.events.filter((e) => e.type === 'hit').length;
      if (hits >= 2) break;
    }
    expect(hits).toBe(2);
  });
});
