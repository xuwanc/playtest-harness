import { describe, expect, it } from 'vitest';
import { warpTo } from '../src/core';
import { shotFade, shotOrigin, shotPoint } from '../src/presentation/fx-shot';
import { intent, makeWorld, run } from './helpers';

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

describe('弓箭：冷却 / 后摇期间的按键缓冲（v9s.16）', () => {
  it('后摇期间按下并按住 → 回到 idle 的同一帧开始蓄力', () => {
    const w = fireFullCharge();
    expect(w.combat.phase).not.toBe('idle');

    // 后摇里再按一下：旧版这一下会被 `phase === 'idle'` 直接过滤掉
    run(w, 1, intent({ attackPressed: true, attackHeld: true }));
    expect(w.combat.charging).toBe(false);
    expect(w.combat.bowQueued).toBe(true);

    holdUntilIdle(w);
    expect(w.combat.phase).toBe('idle');
    expect(w.combat.charging).toBe(true);
    expect(w.combat.bowQueued).toBe(false);
  });

  it('缓冲兑现后蓄力会正常增长，并能再次射出', () => {
    const w = fireFullCharge();
    run(w, 1, intent({ attackPressed: true, attackHeld: true }));
    holdUntilIdle(w);
    const before = w.combat.charge;
    run(w, 30, intent({ attackHeld: true }));
    expect(w.combat.charge).toBeGreaterThan(before);
    const id = w.combat.attackId;
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));
    expect(w.combat.attackId).toBe(id + 1);
  });

  it('后摇期间按下但提前松手 → 回到 idle 不蓄力', () => {
    const w = fireFullCharge();
    run(w, 1, intent({ attackPressed: true, attackHeld: true }));
    expect(w.combat.bowQueued).toBe(true);
    run(w, 1, intent({ attackHeld: false })); // 冷却没结束就松手
    expect(w.combat.bowQueued).toBe(false);
    holdUntilIdle(w);
    expect(w.combat.phase).toBe('idle');
    expect(w.combat.charging).toBe(false);
  });

  it('只有按住、没有新的按下沿 → 不会自己开始蓄力（不会自动连发）', () => {
    const w = fireFullCharge();
    holdUntilIdle(w);
    expect(w.combat.phase).toBe('idle');
    // 没有 attackPressed，只是 attackHeld 为真
    run(w, 5, intent({ attackHeld: true }));
    expect(w.combat.charging).toBe(false);
    expect(w.combat.charge).toBe(0);
  });

  it('换武器 / 传送会清掉未兑现的缓冲', () => {
    const a = fireFullCharge();
    run(a, 1, intent({ attackPressed: true, attackHeld: true }));
    expect(a.combat.bowQueued).toBe(true);
    run(a, 1, intent({ weaponSlot: 1 }));
    expect(a.combat.bowQueued).toBe(false);

    const b = fireFullCharge();
    run(b, 1, intent({ attackPressed: true, attackHeld: true }));
    expect(b.combat.bowQueued).toBe(true);
    warpTo(b, 0, 0);
    expect(b.combat.bowQueued).toBe(false);
    expect(b.combat.charging).toBe(false);
  });

  it('满蓄力释放：lastCharge 接近 1，攻击计数递增', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 5 }));
    const id = w.combat.attackId;
    run(w, 1, intent({ attackPressed: true, attackHeld: true }));
    run(w, 90, intent({ attackHeld: true }));
    expect(w.combat.charge).toBeCloseTo(1, 5);
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));
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
