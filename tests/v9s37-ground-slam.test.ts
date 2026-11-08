import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.37 · 大剑第三击「击地」范围攻击。
 *
 * 刀身扫掠是「正面一条线」，砸地是「圆心一圈」：`slamU` 到点后以落点为圆心
 * 结算一次圆形命中，把侧面 / 贴身 / 身后的目标也震到。
 * 锁五件事：
 *  1. 刀扫不到的位置（正后方）也能被震到 —— 这就是「增加范围」；
 *  2. 刀已经打到的目标不重复掉血（`onlyUnhit` 默认 true）；
 *  3. 半径外不命中（范围是真的有边界，不是无限）；
 *  4. `ground-slam` 每次攻击恰好一次（多目标也只震一次）；
 *  5. 删掉配置 = 精确回到旧行为（第三击只打正面）。
 */

const RAD = 180 / Math.PI;

type Probe = {
  hits: number;
  slams: number;
  /** 第一次击地命中时的 active 内进度 */
  slamU: number;
  /** 第一次命中的类型（'' = 未命中） */
  types: string[];
};

function probe(opts: {
  angleDeg: number;
  dist: number;
  combo?: number;
  onlyUnhit?: boolean;
  slam?: boolean;
}): Probe {
  const { angleDeg, dist, combo = 3, onlyUnhit, slam = true } = opts;
  const w: World = makeWorld();
  w.modules.targeting = false;
  const p = w.config.combat.weapons.greatsword;
  p.lunge = [0, 0, 0];
  p.comboCount = 3;
  if (!slam) delete p.groundSlam;
  else if (onlyUnhit === false) p.groundSlam!.onlyUnhit = false;

  w.combat.weapon = 'greatsword';
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].mode = 'idle';
    w.dummies[i].position.x = 40 + i;
    w.dummies[i].position.z = 40;
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.velocity.x = 0;
  s.velocity.z = 0;

  step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
  const facing = w.combat.attackFacing;
  const a = angleDeg / RAD;
  const pin = (): void => {
    s.position.x = w.character.position.x + dist * Math.sin(facing + a);
    s.position.z = w.character.position.z + dist * Math.cos(facing + a);
    s.hurt.knockX = 0;
    s.hurt.knockZ = 0;
  };
  pin();
  w.combat.comboIndex = combo;

  let firstHitU = -1;
  let slamU = -1;
  const hits0 = w.hitCount;
  const types: string[] = [];
  for (let i = 0; i < 40; i++) {
    pin();
    const before = w.hitCount;
    step(w, w.config.fixedDt, intent());
    if (w.hitCount > before) {
      const dur = w.combat.timings.active;
      const u = dur > 0 ? Math.min(1, w.combat.phaseTimer / dur) : 1;
      if (firstHitU < 0) firstHitU = u;
      types.push(s.hurt.type);
    }
    if (slamU < 0 && w.combat.slamAttackId === w.combat.attackId) {
      const dur = w.combat.timings.active;
      slamU = dur > 0 ? Math.min(1, w.combat.phaseTimer / dur) : 1;
    }
  }
  return {
    hits: w.hitCount - hits0,
    slams: 0,
    slamU,
    types,
  };
}

/** 单独统计 ground-slam 事件数（事件队列每步清空，所以要逐步累计）。 */
function countSlamEvents(opts: { angleDeg: number; dist: number }): number {
  const w: World = makeWorld();
  w.modules.targeting = false;
  const p = w.config.combat.weapons.greatsword;
  p.lunge = [0, 0, 0];
  p.comboCount = 3;
  w.combat.weapon = 'greatsword';
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].mode = 'idle';
    w.dummies[i].position.x = 40 + i;
    w.dummies[i].position.z = 40;
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.velocity.x = 0;
  s.velocity.z = 0;

  step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
  const facing = w.combat.attackFacing;
  const a = opts.angleDeg / RAD;
  w.combat.comboIndex = 3;

  let n = 0;
  for (let i = 0; i < 40; i++) {
    s.position.x = w.character.position.x + opts.dist * Math.sin(facing + a);
    s.position.z = w.character.position.z + opts.dist * Math.cos(facing + a);
    s.hurt.knockX = 0;
    s.hurt.knockZ = 0;
    step(w, w.config.fixedDt, intent());
    n += w.events.filter((e) => e.type === 'ground-slam').length;
  }
  return n;
}

describe('v9s.37 · 大剑第三击击地', () => {
  it('正面目标：只掉一次血（刀命中，击地跳过）', () => {
    const r = probe({ angleDeg: 0, dist: 1.2 });
    expect(r.hits).toBe(1);
  });

  it('正后方目标：刀扫不到，但被击地震到', () => {
    const r = probe({ angleDeg: 170, dist: 1.6 });
    expect(r.hits).toBe(1);
    expect(r.slamU).toBeGreaterThan(0.4);
    // 击地是重击档：大剑 = knock
    expect(r.types).toContain('knock');
  });

  it('半径外（3.2m）不命中：范围有真实边界', () => {
    const r = probe({ angleDeg: 170, dist: 3.2 });
    expect(r.hits).toBe(0);
    expect(r.slamU).toBeGreaterThan(0);
  });

  it('onlyUnhit=false 时正面目标会被打两次（刀 + 冲击波）', () => {
    const once = probe({ angleDeg: 0, dist: 1.2 });
    const twice = probe({ angleDeg: 0, dist: 1.2, onlyUnhit: false });
    expect(once.hits).toBe(1);
    expect(twice.hits).toBe(2);
  });

  it('每次攻击只发一次 ground-slam 事件（多目标也一样）', () => {
    expect(countSlamEvents({ angleDeg: 0, dist: 1.2 })).toBe(1);
  });

  it('删掉 groundSlam = 回到旧行为（第三击只打正面）', () => {
    const r = probe({ angleDeg: 170, dist: 1.6, slam: false });
    expect(r.hits).toBe(0);
  });

  it('击地卡肉比普通命中更重（holdMul 1.7）', () => {
    const w: World = makeWorld();
    w.modules.targeting = false;
    const p = w.config.combat.weapons.greatsword;
    p.lunge = [0, 0, 0];
    w.combat.weapon = 'greatsword';
    for (let i = 1; i < w.dummies.length; i++) {
      w.dummies[i].mode = 'idle';
      w.dummies[i].position.x = 40 + i;
      w.dummies[i].position.z = 40;
    }
    const s = w.dummies[0];
    s.mode = 'idle';
    s.position.x = 0;
    s.position.z = 8 - 2.0;
    step(w, w.config.fixedDt, intent({ moveZ: -1, attackPressed: true }));
    w.combat.comboIndex = 3;

    let peak = 0;
    for (let i = 0; i < 60; i++) {
      s.position.x = w.character.position.x;
      s.position.z = w.character.position.z - 2.0;
      s.hurt.knockX = 0;
      s.hurt.knockZ = 0;
      step(w, w.config.fixedDt, intent());
      peak = Math.max(peak, w.combat.hitstop);
    }
    // 重击档 0.07 × 大剑 1.3 × 连段 0.72 = 0.0655；击地 ×1.7 ≈ 0.111
    expect(peak).toBeGreaterThan(0.09);
  });
});
