import { describe, expect, it } from 'vitest';
import { EMPTY_INTENTS, step } from '../src/core';
import type { World } from '../src/core';
import { makeLabWorld } from './helpers';

/**
 * v9s.40 · 陪练「保持距离」时的踱步节奏。
 *
 * 旧行为在 standoff 死区内**每帧**都给切线方向：玩家站着不动，陪练也 100% 时间在绕圈，
 * 速度只有 1.1 m/s（碎步）—— 真机上读作「疯狂磨脚」。现在横移走时间门
 * （`dummies.strafePeriod / strafeDuty`），关门后方向归零、速度衰减、停步收相站定。
 *
 * 这里锁四条契约：
 *  1. 对峙时相当一部分时间是**站定**的（移动帧 ≤ 60%）；
 *  2. 真要走就是**大步**（移动帧均速 ≥ 1.2 m/s），不是原地碎步；
 *  3. 站定帧几乎没有位移（不是「速度 0 但位置在滑」）；
 *  4. 门是参数化的：duty = 0 时一步不迈，duty = 1 时恢复「一直在走」的旧行为。
 */

/** 只留剑盾陪练，摆到玩家正前方；先跑 90 步让 AI 自己收敛到 standoff。 */
function setup(duty?: number): { w: World; s: World['dummies'][number]; px: number; pz: number } {
  const w = makeLabWorld();
  const s = w.dummies[w.config.dummies.count];
  for (const d of w.dummies) {
    if (d.id === s.id) continue;
    d.mode = 'idle';
    d.position.x = 40;
    d.position.z = 40;
    d.velocity.x = 0;
    d.velocity.z = 0;
  }
  const c = w.character.position;
  const px = c.x;
  const pz = c.z;
  s.mode = 'spar';
  s.attackCooldown = 9999; // 对峙期：不出手，只测走位
  s.position.x = px;
  s.position.z = pz + 2.4;
  s.homeX = s.position.x;
  s.homeZ = s.position.z;
  s.velocity.x = 0;
  s.velocity.z = 0;
  if (duty !== undefined) w.config.dummies.strafeDuty = duty;
  // 收敛：让径向纠偏先把它放到 standoff 上，采样阶段才只剩踱步
  for (let i = 0; i < 120; i++) {
    c.x = px;
    c.z = pz;
    w.character.velocity.x = 0;
    w.character.velocity.z = 0;
    step(w, 1 / 60, EMPTY_INTENTS);
  }
  return { w, s, px, pz };
}

type Stats = { frames: number; moving: number; moveRatio: number; avgMoveSpeed: number; stillDrift: number };

function measure(w: World, s: World['dummies'][number], px: number, pz: number, seconds: number): Stats {
  const c = w.character.position;
  let frames = 0;
  let moving = 0;
  let sumSpeed = 0;
  let stillDrift = 0;
  let stillFrames = 0;
  for (let i = 0; i < Math.round(seconds * 60); i++) {
    c.x = px;
    c.z = pz;
    w.character.velocity.x = 0;
    w.character.velocity.z = 0;
    const bx = s.position.x;
    const bz = s.position.z;
    step(w, 1 / 60, EMPTY_INTENTS);
    const sp = Math.hypot(s.velocity.x, s.velocity.z);
    const dist = Math.hypot(s.position.x - bx, s.position.z - bz);
    frames += 1;
    if (sp > 0.15) {
      moving += 1;
      sumSpeed += sp;
    } else if (i > 30) {
      stillFrames += 1;
      stillDrift += dist;
    }
  }
  return {
    frames,
    moving,
    moveRatio: moving / frames,
    avgMoveSpeed: sumSpeed / Math.max(1, moving),
    stillDrift: stillDrift / Math.max(1, stillFrames),
  };
}

describe('v9s.40 陪练对峙：走走停停而不是一直磨脚', () => {
  it('移动帧 ≤ 60%（有真正站定的时间）', () => {
    const { w, s, px, pz } = setup();
    const st = measure(w, s, px, pz, 4);
    expect(st.moveRatio).toBeLessThanOrEqual(0.6);
    // 也不能干脆不动 —— 对峙该有踱步
    expect(st.moveRatio).toBeGreaterThan(0.05);
  });

  it('要走就是大步（移动帧均速 ≥ 1.2 m/s）', () => {
    const { w, s, px, pz } = setup();
    const st = measure(w, s, px, pz, 4);
    expect(st.avgMoveSpeed).toBeGreaterThanOrEqual(1.2);
  });

  it('站定帧位置几乎不滑（帧均位移 < 3mm）', () => {
    const { w, s, px, pz } = setup();
    const st = measure(w, s, px, pz, 4);
    expect(st.stillDrift).toBeLessThan(0.003);
  });

  it('duty = 0：对峙期一步不迈（门是唯一驱动）', () => {
    const { w, s, px, pz } = setup(0);
    const st = measure(w, s, px, pz, 3);
    expect(st.moving).toBe(0);
    // 位置变化只允许「收敛残差」，量级远小于一步
    expect(Math.hypot(s.position.x - px, s.position.z - pz)).toBeLessThan(3);
  });

  it('duty = 1：恢复旧行为（一直有横移）', () => {
    const { w, s, px, pz } = setup(1);
    const st = measure(w, s, px, pz, 3);
    expect(st.moveRatio).toBeGreaterThan(0.9);
  });

  it('普通假人的 keep-distance 也走同一个门', () => {
    const w = makeLabWorld();
    const s = w.dummies[0];
    // 其他单位会通过分离力把它推来推去（径向误差一变就有合法纠偏），先清场
    for (const d of w.dummies) {
      if (d.id === s.id) continue;
      d.mode = 'idle';
      d.position.x = 40;
      d.position.z = 40;
      d.velocity.x = 0;
      d.velocity.z = 0;
    }
    s.mode = 'keep-distance';
    s.position.x = 0;
    s.position.z = 0;
    s.homeX = 0;
    s.homeZ = 0;
    const c = w.character.position;
    const px = c.x;
    const pz = c.z;
    // 玩家摆在 keepDistance 上：径向误差 0，只剩踱步
    s.position.x = px;
    s.position.z = pz + w.config.dummies.keepDistance;
    s.homeX = s.position.x;
    s.homeZ = s.position.z;
    w.config.dummies.strafeDuty = 0;
    let moving = 0;
    for (let i = 0; i < 120; i++) {
      c.x = px;
      c.z = pz;
      w.character.velocity.x = 0;
      w.character.velocity.z = 0;
      step(w, 1 / 60, EMPTY_INTENTS);
      if (Math.hypot(s.velocity.x, s.velocity.z) > 0.15) moving += 1;
    }
    expect(moving).toBe(0);
  });
});
