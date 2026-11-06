import { describe, expect, it } from 'vitest';
import { runSteps, snapshot, wrapAngle } from '../src/core';
import { intent, makeWorld, run } from './helpers';

const HALF_PI = Math.PI / 2;

describe('程序化朝向：面朝向 / 身体朝向 / 移动方向分离', () => {
  it('初始四个朝向角均为 0', () => {
    const w = makeWorld();
    expect(w.character.facing).toBe(0);
    expect(w.character.moveYaw).toBe(0);
    expect(w.character.bodyYaw).toBe(0);
    expect(w.character.headYaw).toBe(0);
    expect(w.modules.orientation).toBe(true);
  });

  it('转向瞬间：身体平滑不瞬移，头部比身体更接近目标（头先到位）', () => {
    const w = makeWorld();
    run(w, 1, intent({ moveX: 1, moveZ: 0 }));
    const target = w.character.facing;
    expect(Math.abs(wrapAngle(target - HALF_PI))).toBeLessThan(1e-6);
    expect(w.character.bodyYaw).toBeGreaterThan(0);
    expect(w.character.bodyYaw).toBeLessThan(target * 0.5);
    const headErr = Math.abs(wrapAngle(target - w.character.headYaw));
    const bodyErr = Math.abs(wrapAngle(target - w.character.bodyYaw));
    expect(headErr).toBeLessThan(bodyErr);
  });

  it('持续朝一个方向移动后，身体与头部都收敛到面朝向', () => {
    const w = makeWorld();
    run(w, 150, intent({ moveX: 1, moveZ: 0 }));
    expect(Math.abs(wrapAngle(w.character.bodyYaw - w.character.facing))).toBeLessThan(0.02);
    expect(Math.abs(wrapAngle(w.character.headYaw - w.character.facing))).toBeLessThan(0.02);
  });

  it('反复掉头时头部相对身体的偏转不超过配置限幅', () => {
    const w = makeWorld();
    const limit = (w.config.orientation.maxHeadTurnDeg * Math.PI) / 180 + 1e-6;
    for (let i = 0; i < 40; i++) {
      run(w, 2, intent({ moveX: i % 2 === 0 ? 1 : -1 }));
      expect(Math.abs(wrapAngle(w.character.headYaw - w.character.bodyYaw))).toBeLessThanOrEqual(limit);
    }
  });

  it('攻击时面朝向锁定起手方向，不随后续摇杆改变', () => {
    const w = makeWorld();
    run(w, 1, intent({ moveX: 1, attackPressed: true }));
    const locked = w.combat.attackFacing;
    expect(Math.abs(wrapAngle(w.character.facing - locked))).toBeLessThan(1e-6);
    run(w, 3, intent({ moveX: -1 }));
    expect(w.combat.phase).not.toBe('idle');
    expect(Math.abs(wrapAngle(w.character.facing - locked))).toBeLessThan(1e-6);
  });

  it('攻击中四个角彼此分离：面朝向锁定、身体滞后、头部领先、移动方向保持', () => {
    const w = makeWorld();
    run(w, 60, intent({ moveX: 1, moveZ: 0 })); // 稳定朝 +X
    const moveDir = w.character.moveYaw;
    expect(Math.abs(wrapAngle(moveDir - HALF_PI))).toBeLessThan(0.1);
    // 起手时摇杆改指 +Z，攻击朝向锁定 +Z，但自主移动被锁定
    run(w, 1, intent({ moveX: 0, moveZ: 1, attackPressed: true }));
    run(w, 2, intent({ moveX: 0, moveZ: 1 }));
    expect(Math.abs(wrapAngle(w.character.facing - 0))).toBeLessThan(1e-6);
    // 身体还在从 +X 平滑转向 +Z（未瞬移）
    expect(w.character.bodyYaw).toBeGreaterThan(0.15);
    // 头比身体更靠近目标 0
    expect(Math.abs(wrapAngle(w.character.headYaw)))
      .toBeLessThan(Math.abs(wrapAngle(w.character.bodyYaw)));
    // 移动方向保持攻击前的 +X，与身体朝向不同
    expect(Math.abs(wrapAngle(w.character.moveYaw - w.character.bodyYaw))).toBeGreaterThan(0.2);
  });

  it('掉头瞬间面朝向立即改变，身体明显滞后', () => {
    const w = makeWorld();
    run(w, 60, intent({ moveX: 1 }));
    run(w, 1, intent({ moveX: -1 }));
    expect(Math.abs(wrapAngle(w.character.facing + HALF_PI))).toBeLessThan(1e-6);
    expect(Math.abs(wrapAngle(w.character.bodyYaw - w.character.facing))).toBeGreaterThan(1);
  });

  it('调大 bodyTurnRate 会显著加快身体跟随（配置热生效）', () => {
    const slow = makeWorld();
    const fast = makeWorld();
    fast.config.orientation.bodyTurnRate = 40;
    run(slow, 3, intent({ moveX: 1 }));
    run(fast, 3, intent({ moveX: 1 }));
    expect(fast.character.bodyYaw).toBeGreaterThan(slow.character.bodyYaw * 1.5);
  });

  it('关闭 orientation 模块后四个角度保持不变', () => {
    const w = makeWorld();
    w.modules.orientation = false;
    run(w, 30, intent({ moveX: 1 }));
    expect(w.character.facing).toBe(0);
    expect(w.character.moveYaw).toBe(0);
    expect(w.character.bodyYaw).toBe(0);
    expect(w.character.headYaw).toBe(0);
  });

  it('复位把四个朝向角归零', () => {
    const w = makeWorld();
    run(w, 30, intent({ moveX: 1 }));
    expect(w.character.bodyYaw).toBeGreaterThan(0);
    run(w, 1, intent({ resetPressed: true }));
    expect(w.character.facing).toBe(0);
    expect(w.character.moveYaw).toBe(0);
    expect(w.character.bodyYaw).toBe(0);
    expect(w.character.headYaw).toBe(0);
  });

  it('wrapAngle 走最短弧，跨 ±π 正确', () => {
    expect(wrapAngle(Math.PI * 1.9)).toBeCloseTo(-Math.PI * 0.1, 6);
    expect(wrapAngle(-Math.PI * 1.9)).toBeCloseTo(Math.PI * 0.1, 6);
    expect(wrapAngle(Math.PI * 3)).toBeCloseTo(Math.PI, 6);
  });

  it('含朝向变化的输入序列结果逐字节一致', () => {
    const script = (t: number) => intent({
      moveX: Math.sin(t / 17),
      moveZ: Math.cos(t / 23) * 0.7,
      attackPressed: t % 41 === 0,
      weaponSlot: t === 100 ? 3 : 0,
    });
    const a = makeWorld();
    const b = makeWorld();
    runSteps(a, 300, script);
    runSteps(b, 300, script);
    expect(snapshot(a)).toBe(snapshot(b));
  });
});
