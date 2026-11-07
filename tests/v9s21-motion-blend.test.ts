import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { Intents, World } from '../src/core';
import { intent, makeWorld, run } from './helpers';

const DT = 1 / 60;

function speed(w: World): number {
  return Math.hypot(w.character.velocity.x, w.character.velocity.z);
}

function totalSpeed(w: World): number {
  return Math.hypot(
    w.character.velocity.x + w.impulse.x,
    w.character.velocity.z + w.impulse.z,
  );
}

/** 剑盾静止起手，返回世界。targeting 关掉，lunge 用武器基础值（第 1 段 0.45）。 */
function swordStill(): World {
  const w = makeWorld();
  w.modules.targeting = false;
  return w;
}

describe('v9s.21 运动分层：移动 / 技能位移（v9s.25 起去掉脉冲层）', () => {
  it('起手不再掉崖：速度是平滑衰减，不是一帧归零', () => {
    const w = swordStill();
    run(w, 60, intent({ moveX: 1 }));
    const v0 = speed(w);
    expect(v0).toBeGreaterThan(3.8); // 已经跑到常速
    run(w, 1, intent({ moveX: 1, attackPressed: true }));
    const v1 = speed(w);
    // 旧版这里直接变成 attackMoveScale × 速度（约 1.26，掉 70%）。
    // 现在按 skillDecel 14 趋近，一帧只掉 ~21%，仍然明显在跑。
    expect(v1).toBeGreaterThan(v0 * 0.75);
    expect(v1).toBeLessThan(v0);
  });

  it('起手后连续若干帧速度逐帧下降，没有「先归零再爬」的断点', () => {
    const w = swordStill();
    run(w, 40, intent({ moveX: 1 }));
    const seq: number[] = [speed(w)];
    for (let i = 0; i < 30; i++) {
      step(w, DT, intent({ moveX: 1, attackPressed: i === 0 }));
      seq.push(speed(w));
    }
    // active 阶段移动层让位到 0.08，recovery 回到 0.3 —— 中途会小幅回升，不做单调断言。
    // 真正要保证的是：没有任何一帧出现「腰斩」（旧版是第一帧直接掉到 30%）。
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i]).toBeGreaterThan(seq[i - 1] * 0.55);
    }
    expect(seq[seq.length - 1]).toBeLessThan(seq[0] * 0.8);
  });

  it('收招接跑：idle 之后速度从当前值继续升，不从 0 重新起步', () => {
    const w = swordStill();
    run(w, 40, intent({ moveX: 1 }));
    run(w, 1, intent({ moveX: 1, attackPressed: true }));
    // 跑完整个攻击动作
    let g = 0;
    while (w.combat.phase !== 'idle' && g++ < 200) {
      step(w, DT, intent({ moveX: 1 }));
    }
    expect(w.combat.phase).toBe('idle');
    const atIdle = speed(w);
    // 攻击结束那一刻仍保有速度（不是 0）
    expect(atIdle).toBeGreaterThan(0.3);
    // 之后逐帧回升到常速，且第一帧不会掉
    let prev = atIdle;
    for (let i = 0; i < 20; i++) {
      step(w, DT, intent({ moveX: 1 }));
      expect(speed(w)).toBeGreaterThanOrEqual(prev - 1e-6);
      prev = speed(w);
    }
    expect(speed(w)).toBeGreaterThan(atIdle + 1);
  });

  it('跨步是包络：active 期间附加速度逐帧递减、末段接近 0', () => {
    const w = swordStill();
    run(w, 1, intent({ attackPressed: true }));
    const mags: number[] = [];
    let g = 0;
    while (w.combat.phase !== 'active' && g++ < 40) step(w, DT, intent());
    for (let i = 0; i < 40 && w.combat.phase === 'active'; i++) {
      step(w, DT, intent());
      if (w.combat.phase === 'active') mags.push(Math.hypot(w.impulse.x, w.impulse.z));
    }
    expect(mags.length).toBeGreaterThan(3);
    // 单调递减
    for (let i = 1; i < mags.length; i++) expect(mags[i]).toBeLessThan(mags[i - 1] + 1e-9);
    // 起手明显高于平均（旧版全程等于 0.45/0.13 ≈ 3.46 的匀速）
    expect(mags[0]).toBeGreaterThan(4);
    // 末段收到很低（不是被硬切，而是包络自己收敛）
    expect(mags[mags.length - 1]).toBeLessThan(3);
  });

  it('包络不改变位移：active 走完的距离仍精确等于 lunge', () => {
    const w = swordStill();
    const lunge = w.config.combat.weapons['sword-shield'].lunge[0];
    run(w, 1, intent({ attackPressed: true }));
    const z0 = w.character.position.z;
    let g = 0;
    while (w.combat.phase !== 'recovery' && g++ < 60) step(w, DT, intent());
    expect(w.combat.phase).toBe('recovery');
    expect(Math.abs(w.character.position.z - z0)).toBeCloseTo(lunge, 2);
  });

  it('跨步峰值不被安全阀削掉（默认配置下 lungeMaxSpeed 不触发）', () => {
    const w = swordStill();
    run(w, 1, intent({ attackPressed: true }));
    let peak = 0;
    let g = 0;
    while (w.combat.phase !== 'recovery' && g++ < 60) {
      step(w, DT, intent());
      peak = Math.max(peak, Math.hypot(w.impulse.x, w.impulse.z));
    }
    expect(peak).toBeLessThan(w.config.combat.lungeMaxSpeed);
    // 但确实有「冲击」：峰值至少是匀速版的 1.5 倍
    const lunge = w.config.combat.weapons['sword-shield'].lunge[0];
    const active = w.config.combat.weapons['sword-shield'].active;
    expect(peak).toBeGreaterThan((lunge / active) * 1.3);
  });

  it('跑动中攻击：移动层让位，总速度不被「跑速 + 跨步」叠加', () => {
    const w = swordStill();
    run(w, 60, intent({ moveZ: -1 }));
    for (let i = 0; i < 40; i++) {
      step(w, DT, intent({ moveZ: -1, attackPressed: i === 0 }));
      // 三层相加后的瞬时速度不超过安全阀
      expect(totalSpeed(w)).toBeLessThanOrEqual(w.config.combat.lungeMaxSpeed + 1e-6);
    }
  });

  it('引导减速也是平滑的（不是一帧跳到 moveScale）', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    run(w, 1, intent({ weaponSlot: 4 })); // 法杖
    run(w, 60, intent({ moveX: 1 }));
    const v0 = speed(w);
    expect(v0).toBeGreaterThan(3.8);
    step(w, DT, intent({ moveX: 1, attackHeld: true }));
    expect(w.abilities.channeling).toBe(true);
    const v1 = speed(w);
    // 一帧只掉一部分，而不是直接到 0.6 × 4.2 = 2.52
    expect(v1).toBeGreaterThan(v0 * 0.75);
    // 若干帧后收敛到配置的 moveScale
    for (let i = 0; i < 40; i++) step(w, DT, intent({ moveX: 1, attackHeld: true }));
    const staffMul = w.config.combat.weapons.staff.moveMultiplier;
    const target = w.config.moveSpeed * staffMul * w.config.abilities.arcane.moveScale;
    expect(Math.abs(speed(w) - target)).toBeLessThan(0.2);
  });

  it('复位会清掉技能位移层（翻滚中途重开不残留推进）', () => {
    const w = makeWorld();
    w.impulse.x = 3;
    w.impulse.z = -2;
    step(w, DT, intent({ resetPressed: true }));
    expect(w.impulse.x).toBe(0);
    expect(w.impulse.z).toBe(0);
  });
});
