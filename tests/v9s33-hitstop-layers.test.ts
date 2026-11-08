import { describe, expect, it } from 'vitest';
import { applyHit } from '../src/core/hits';
import type { WeaponId } from '../src/core';
import { CONFIG, makeQuietWorld } from './helpers';

const TYPE = 'heavy' as const;

function freezeFor(weapon: WeaponId): { stop: number; event: number } {
  const w = makeQuietWorld();
  w.modules.targeting = false;
  w.combat.weapon = weapon;
  w.combat.hitstop = 0;
  w.events.length = 0;
  applyHit(w, { kind: 'dummy', index: 0 }, {
    type: TYPE, duration: 0.32, dirX: 0, dirZ: 1, knockback: 0,
  });
  const ev = w.events.find((e) => e.type === 'hitstop');
  return { stop: w.combat.hitstop, event: ev?.value ?? 0 };
}

describe('v9s.33 卡肉分层', () => {
  it('同一记重击，不同武器冻结时长不同（大剑 > 剑盾 > 双剑）', () => {
    const gs = freezeFor('greatsword').stop;
    const ss = freezeFor('sword-shield').stop;
    const ds = freezeFor('dual-swords').stop;
    expect(gs).toBeGreaterThan(ss);
    expect(ss).toBeGreaterThan(ds);
    expect(ds).toBeGreaterThan(0);
  });

  it('时长 = 全局档位 × 武器系数，误差在浮点内', () => {
    const base = CONFIG.core.hits.hitstop.heavy;
    for (const [weapon, scale] of Object.entries(CONFIG.core.hits.hitstopByWeapon ?? {})) {
      const got = freezeFor(weapon as WeaponId).stop;
      expect(got, weapon).toBeCloseTo(base * (scale as number), 6);
    }
  });

  it('hitstop 事件里的数值与 combat.hitstop 一致（表现层据此分档震动）', () => {
    for (const w of ['greatsword', 'dual-swords', 'staff'] as const) {
      const r = freezeFor(w);
      expect(r.event).toBeCloseTo(r.stop, 6);
    }
  });

  it('轻 / 重 / 击飞三档仍按类型递增', () => {
    const w = makeQuietWorld();
    w.modules.targeting = false;
    w.combat.weapon = 'sword-shield';
    const val = (type: 'light' | 'heavy' | 'knock'): number => {
      w.combat.hitstop = 0;
      w.events.length = 0;
      applyHit(w, { kind: 'dummy', index: 0 }, { type, duration: 0.3, dirX: 0, dirZ: 1, knockback: 0 });
      return w.combat.hitstop;
    };
    const light = val('light');
    const heavy = val('heavy');
    const knock = val('knock');
    expect(light).toBeLessThan(heavy);
    expect(heavy).toBeLessThan(knock);
  });
});
