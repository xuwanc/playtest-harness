import { describe, expect, it } from 'vitest';
import { warpTo } from '../src/core';
import { shotFade, shotOrigin, shotPoint } from '../src/presentation/fx-shot';
import { CONFIG, intent, makeWorld, run } from './helpers';

/** 把弓箭蓄满并射出去，返回「刚进后摇」的世界。 */
function fireFullCharge(w = makeWorld()) {
  run(w, 1, intent({ weaponSlot: 5 }));
  run(w, 1, intent({ attackPressed: true, attackHeld: true }));
  run(w, 90, intent({ attackHeld: true }));
  run(w, 1, intent({ attackHeld: false, attackReleased: true }));
  return w;
}

/** 按住不放直到回到 idle（最多 3s），返回用掉的步数。 */
function holdUntilIdle(w: ReturnType<typeof makeWorld>): number {
  let n = 0;
  while (w.combat.phase !== 'idle' && n < 180) {
    run(w, 1, intent({ attackHeld: true }));
    n += 1;
  }
  return n;
}

describe('弓箭：按住循环蓄力（v9s.19 取消冷却 + 蓄满自动放箭）', () => {
  const chargeFrames = Math.ceil(CONFIG.core.combat.bow.maxChargeTime * 60);

  it('按住即蓄力，不需要新的按下沿', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 1, intent({ attackHeld: true })); // 没有 attackPressed
    expect(w.combat.charging).toBe(true);
    run(w, 10, intent({ attackHeld: true }));
    expect(w.combat.charge).toBeGreaterThan(0);
  });

  it('蓄满自动放箭，放完仍按住 → 立刻重新蓄力（没有「每箭冷却」）', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    const hold = intent({ attackHeld: true });
    let frames = 0;
    while (w.arrows.length === 0 && frames < chargeFrames + 10) {
      run(w, 1, hold);
      frames += 1;
    }
    // 放箭时刻由蓄力时间决定（0.85s），不额外加后摇
    expect(w.arrows.length).toBe(1);
    expect(frames).toBeLessThanOrEqual(chargeFrames + 2);

    // 下一帧就重新蓄力 —— 旧版要等 windup+active+recovery+settle（≈0.58s）
    run(w, 1, hold);
    expect(w.combat.charging).toBe(true);
    expect(w.combat.charge).toBeGreaterThan(0);
  });

  it('按住 2s 至少射出 2 支，节奏由蓄力时间决定而不是蓄力 + 后摇', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 130, intent({ attackHeld: true }));
    expect(w.arrows.length).toBeGreaterThanOrEqual(2);
  });

  it('松手提前射出；蓄力不足则取消', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 20, intent({ attackHeld: true }));
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));
    expect(w.arrows.length).toBe(1);

    const cancel = makeWorld();
    cancel.modules.dummies = false;
    run(cancel, 1, intent({ weaponSlot: 5 }));
    run(cancel, 1, intent({ attackHeld: true }));
    run(cancel, 1, intent({ attackHeld: false, attackReleased: true }));
    expect(cancel.arrows.length).toBe(0);
    expect(cancel.combat.phase).toBe('idle');
  });

  it('换武器 / 传送会清掉蓄力', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 10, intent({ attackHeld: true }));
    expect(w.combat.charging).toBe(true);
    run(w, 1, intent({ weaponSlot: 1 }));
    expect(w.combat.charging).toBe(false);
    expect(w.combat.charge).toBe(0);

    const b = makeWorld();
    run(b, 1, intent({ weaponSlot: 5 }));
    run(b, 10, intent({ attackHeld: true }));
    warpTo(b, 0, 0);
    expect(b.combat.charging).toBe(false);
    expect(b.combat.charge).toBe(0);
  });

  it('满蓄自动放箭：lastCharge 接近 1，攻击计数递增', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    const id = w.combat.attackId;
    run(w, chargeFrames + 2, intent({ attackHeld: true }));
    expect(w.combat.attackId).toBe(id + 1);
    expect(w.combat.lastCharge).toBeCloseTo(1, 5);
  });
});

describe('箭矢飞行的纯函数（v9s.16）', () => {
  it('发射点沿锁定朝向前置，不依赖身体朝向', () => {
    expect(shotOrigin(0, 0, 0, 0, 0.6, 0.95)).toEqual({ x: 0, y: 0.95, z: 0.6 });
    const east = shotOrigin(0, 0, 0, Math.PI / 2, 0.6, 0.95);
    expect(east.x).toBeCloseTo(0.6, 6);
    expect(east.z).toBeCloseTo(0, 6);
    const south = shotOrigin(1, 0.2, 2, Math.PI, 0.6, 0.95);
    expect(south.x).toBeCloseTo(1, 6);
    expect(south.z).toBeCloseTo(1.4, 6);
    expect(south.y).toBeCloseTo(1.15, 6);
  });

  it('飞行点沿同一朝向等距推进，y 不变', () => {
    const o = shotOrigin(0, 0, 0, 0, 0.6, 0.95);
    expect(shotPoint(o, 0, 3)).toEqual({ x: 0, y: 0.95, z: 3.6 });
    const p1 = shotPoint(o, 0, 1);
    const p2 = shotPoint(o, 0, 2);
    expect(p2.z - p1.z).toBeCloseTo(1, 6);
    const east = shotPoint(o, Math.PI / 2, 2);
    expect(east.x).toBeCloseTo(2, 6);
    expect(east.z).toBeCloseTo(0.6, 6);
  });

  it('末端淡出：射程内保持 1，末端线性收到 0', () => {
    expect(shotFade(0, 9, 1.4)).toBe(1);
    expect(shotFade(7.6, 9, 1.4)).toBe(1);
    expect(shotFade(8.3, 9, 1.4)).toBeCloseTo(0.5, 6);
    expect(shotFade(9, 9, 1.4)).toBe(0);
    expect(shotFade(12, 9, 1.4)).toBe(0);
    expect(shotFade(-1, 9, 1.4)).toBe(1);
  });
});
