import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { WeaponId, World } from '../src/core';
import { CONFIG, intent, makeWorld } from './helpers';

/**
 * v9s.31 · 连击窗口数据化（`WeaponProfile.comboWindow`）。
 *
 * 全局 0.65s 对双剑太长（按住连打会「等」），对大剑又偏短（收势还没完就断了）。
 * 现在每把武器可以覆写，缺省继承全局值。
 */

function windowAfterSwing(weapon: WeaponId): number {
  const w: World = makeWorld();
  w.modules.targeting = false;
  w.combat.weapon = weapon;
  const p = w.config.combat.weapons[weapon];
  p.lunge = [0, 0, 0];
  w.dummies.forEach((d, i) => {
    d.mode = 'idle';
    d.position.x = 20 + i;
    d.position.z = 20;
  });
  step(w, w.config.fixedDt, intent({ attackPressed: true }));
  for (let i = 0; i < 180; i++) {
    step(w, w.config.fixedDt, intent());
    if (w.combat.phase === 'idle' && w.combat.comboWindow > 0) return w.combat.comboWindow;
  }
  return -1;
}

describe('v9s.31 连击窗口', () => {
  it('双剑的窗口比全局短，大剑比全局长', () => {
    const global = CONFIG.core.combat.comboWindow;
    const ds = windowAfterSwing('dual-swords');
    const gs = windowAfterSwing('greatsword');
    expect(ds).toBeGreaterThan(0);
    expect(gs).toBeGreaterThan(0);
    expect(ds).toBeLessThan(global);
    expect(gs).toBeGreaterThan(global);
    // 刚进 idle 时只扣了一帧
    expect(ds).toBeCloseTo(CONFIG.core.combat.weapons['dual-swords'].comboWindow!, 1);
    expect(gs).toBeCloseTo(CONFIG.core.combat.weapons.greatsword.comboWindow!, 1);
  });

  it('未配置覆写的武器仍是全局值', () => {
    const p = CONFIG.core.combat.weapons['sword-shield'];
    expect(p.comboWindow).toBeDefined();
  });
});
