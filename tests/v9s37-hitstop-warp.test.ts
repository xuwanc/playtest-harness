import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.37 · 卡肉节奏（接触瓦片 + 偿还）。
 *
 * 旧版硬冻结（速率 0）读起来是「游戏卡了一下」，而且把这一刀的总时长拉长 ——
 * 每击都卡的战神式节奏只有在单次很短时才成立。这里锁四件事：
 *  1. 保持期不再是 0 速率，而是 `holdRate`（5%）：画面仍在极慢地动；
 *  2. 释放后进入偿还，速率 > 1，把欠下的时间补回来；
 *  3. 整段动作的总帧数基本守恒（±2 帧），说明偿还真的在还；
 *  4. `warp.enabled = false` 精确回到硬冻结（逐帧等价，A/B 与回滚）。
 */

function soloDummy(weapon: 'sword-shield' | 'greatsword' = 'sword-shield'): World {
  const w = makeWorld();
  w.modules.targeting = false;
  const p = w.config.combat.weapons[weapon];
  p.lunge = [0, 0, 0];
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].mode = 'idle';
    w.dummies[i].position.x = 40 + i;
    w.dummies[i].position.z = 40;
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.position.x = 0;
  s.position.z = 8 - 1.0;
  s.velocity.x = 0;
  s.velocity.z = 0;
  w.combat.weapon = weapon;
  return w;
}

/** 起手 → 跑到 idle；同时记录速率峰值与「完全不动」的帧数。 */
function fullAttack(warp: boolean | 'none'): {
  frames: number;
  maxWarp: number;
  frozenFrames: number;
  hitFrames: number;
  totalProgressFrames: number;
} {
  const w = soloDummy();
  if (warp === 'none') {
    // 基准：完全没有卡肉。用来判断「瓦片 + 偿还」有没有把时长还回去
    w.config.hits.hitstop = { light: 0, heavy: 0, knock: 0 };
  } else if (!warp) {
    w.config.hits.hitstopWarp!.enabled = false;
  }
  const dt = w.config.fixedDt;

  step(w, dt, intent({ moveZ: -1, attackPressed: true }));
  let frames = 0;
  let maxWarp = 0;
  let frozenFrames = 0;
  let hitFrames = 0;
  let totalProgressFrames = 0;
  let prevProgress = w.combat.attackProgress;

  while (w.combat.phase !== 'idle' && frames < 400) {
    const before = w.combat.attackProgress;
    step(w, dt, intent());
    frames += 1;
    maxWarp = Math.max(maxWarp, w.combat.warp);
    if (w.combat.warp < 1e-6) frozenFrames += 1;
    if (Math.abs(w.combat.attackProgress - before) < 1e-9) totalProgressFrames += 1;
    if (w.events.some((e) => e.type === 'hit')) hitFrames += 1;
    prevProgress = before;
  }
  void prevProgress;
  return { frames, maxWarp, frozenFrames, hitFrames, totalProgressFrames };
}

describe('v9s.37 · 卡肉瓦片', () => {
  it('保持期速率 = holdRate，不再有「零速率帧」', () => {
    const r = fullAttack(true);
    expect(r.hitFrames).toBeGreaterThan(0);
    expect(r.frozenFrames).toBe(0);          // 旧版这一项是 2~3 帧
    expect(r.maxWarp).toBeGreaterThan(1.1);  // 出现过偿还（>1）
  });

  it('整段动作总帧数基本守恒（偿还真的把时间补回来了）', () => {
    const on = fullAttack(true);
    const legacy = fullAttack(false);
    const base = fullAttack('none');
    // 旧版硬冻结 3 帧 + 没有偿还 → 比「完全不卡」长 3 帧左右
    expect(legacy.frozenFrames).toBeGreaterThan(0);
    expect(legacy.frames - base.frames).toBeGreaterThanOrEqual(2);
    // 瓦片版把时间还回去了：与「完全不卡」的差 ≤ 1 帧
    expect(Math.abs(on.frames - base.frames)).toBeLessThanOrEqual(1);
    expect(on.frames).toBeLessThan(legacy.frames);
  });

  it('保持期进度按 holdRate 推进（不是完全不动）', () => {
    const w = soloDummy();
    const dt = w.config.fixedDt;
    step(w, dt, intent({ moveZ: -1, attackPressed: true }));
    // 推进到命中
    for (let i = 0; i < 60 && w.combat.hitstop <= 0; i++) step(w, dt, intent());
    expect(w.combat.hitstop).toBeGreaterThan(0);

    const holdRate = w.config.hits.hitstopWarp!.holdRate;
    const total = w.combat.timings.windup + w.combat.timings.active + w.combat.timings.recovery;
    const p0 = w.combat.attackProgress;
    let frames = 0;

    while (w.combat.hitstop > 0 && frames < 20) {
      step(w, dt, intent());
      frames += 1;
      // 每帧推进量应当 ≈ dt × holdRate / total
      expect(w.combat.attackProgress - p0).toBeLessThan((dt * holdRate * frames) / total + 1e-6);
    }
    // 但确实在动（旧版这里恒等于 p0）
    expect(w.combat.attackProgress).toBeGreaterThan(p0);
    expect(frames).toBeGreaterThan(1);
  });

  it('关闭 warp = 精确回到硬冻结（速率 0、进度不动）', () => {
    const w = soloDummy();
    w.config.hits.hitstopWarp!.enabled = false;
    const dt = w.config.fixedDt;
    step(w, dt, intent({ moveZ: -1, attackPressed: true }));
    for (let i = 0; i < 60 && w.combat.hitstop <= 0; i++) step(w, dt, intent());
    expect(w.combat.hitstop).toBeGreaterThan(0);

    const p0 = w.combat.attackProgress;
    let n = 0;
    while (w.combat.hitstop > 0 && n < 20) {
      step(w, dt, intent());
      n += 1;
      expect(w.combat.warp).toBe(0);
      expect(w.combat.attackProgress).toBeCloseTo(p0, 9);
    }
  });

  it('连段衰减：同一受击档位下，后段停得更短', () => {
    const base = (combo: number, falloff: boolean): number => {
      const w = soloDummy();
      if (!falloff) w.config.hits.hitstopComboFalloff = [1, 1, 1];
      const dt = w.config.fixedDt;
      step(w, dt, intent({ moveZ: -1, attackPressed: true }));
      w.combat.comboIndex = combo;
      for (let i = 0; i < 60 && w.combat.hitstop <= 0; i++) step(w, dt, intent());
      return w.combat.hitstop;
    };
    // 第 2 段仍是轻击档：1 vs 0.85
    expect(base(2, false)).toBeGreaterThan(0);
    expect(base(2, true)).toBeLessThan(base(2, false) * 0.95);
    // 第 3 段是重击档（0.07），所以不能跟第 1 段直接比绝对值；
    // 只验「同一段开不开衰减」的差
    expect(base(3, true)).toBeLessThan(base(3, false) * 0.9);
  });
});
