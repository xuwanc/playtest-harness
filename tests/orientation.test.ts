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

  it('转向：大角走限速但 4 帧到位，身体明显滞后、头更接近目标（头先到位）', () => {
    const w = makeWorld();
    run(w, 1, intent({ moveX: 1, moveZ: 0 }));
    // v9h：90° 属于大角，单帧最多 30°，不会一帧整块翻过去
    expect(Math.abs(wrapAngle(w.character.facing - HALF_PI))).toBeGreaterThan(0.2);
    run(w, 3, intent({ moveX: 1, moveZ: 0 }));
    expect(Math.abs(wrapAngle(w.character.facing - HALF_PI))).toBeLessThan(1e-9);
    expect(w.character.bodyYaw).toBeGreaterThan(0);
    expect(w.character.bodyYaw).toBeLessThan(w.character.facing * 0.7);
    const headErr = Math.abs(wrapAngle(w.character.facing - w.character.headYaw));
    const bodyErr = Math.abs(wrapAngle(w.character.facing - w.character.bodyYaw));
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
    w.modules.gaze = false;       // 隔离注视：本测试验证朝向四角分离基础，头部应跟随 facing
    w.modules.targeting = false;  // 排除锁定目标对头部的牵引
    w.config.gaze.headLookLimitDeg = 180; // 隔离 v9s.3 头限制角特性（已在 v9s3-gaze 单独覆盖）
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

  it('掉头 180°：面朝向不整块翻转，但 100ms 内转完，身体明显滞后', () => {
    const w = makeWorld();
    w.modules.gaze = false;   // v9s.5：隔离被攻击自动注视，本用例只验证面朝向基础
    run(w, 60, intent({ moveX: 1 }));
    run(w, 1, intent({ moveX: -1 }));
    // 单帧只转 30°，180° 需要 6 帧——这一步正是真机日志里 141° 整块跳的修法
    expect(Math.abs(wrapAngle(w.character.facing - HALF_PI))).toBeGreaterThan(0.3);
    run(w, 7, intent({ moveX: -1 }));
    expect(Math.abs(wrapAngle(w.character.facing + HALF_PI))).toBeLessThan(1e-9);
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

describe('v9g：小幅推杆的朝向抗抖', () => {
  it('推杆 < 35% 时方向突变不会一帧跳完（逐帧平滑），收敛到死区内', () => {
    const w = makeWorld();
    w.character.facing = 0;
    run(w, 1, intent({ moveX: 0.25, moveZ: -0.001 }));
    const first = w.character.facing;
    // 目标约 +90°，一帧只走一小段（14/s、1/60s ≈ 21%）
    expect(first).toBeGreaterThan(0.05);
    expect(first).toBeLessThan(HALF_PI * 0.5);
    run(w, 30, intent({ moveX: 0.25, moveZ: -0.001 }));
    // 死区 22° 内停止（轻推不追求精确对齐，避免微颤把朝向摇来摇去）
    const band = (w.config.orientation.facingDeadbandDeg * Math.PI) / 180 + 1e-3;
    expect(Math.abs(wrapAngle(w.character.facing - HALF_PI))).toBeLessThan(band + 0.02);
  });

  it('幅度低于 facingMinMagnitude 的微颤完全不改朝向', () => {
    const w = makeWorld();
    run(w, 8, intent({ moveX: 1, moveZ: 0 }));
    const held = w.character.facing;
    for (let i = 0; i < 30; i++) {
      run(w, 1, intent({ moveX: i % 2 === 0 ? 0.15 : -0.15, moveZ: 0.02 }));
    }
    expect(Math.abs(wrapAngle(w.character.facing - held))).toBeLessThan(1e-9);
  });

  it('推杆 >= 35%：90° 在 4 帧内到位，单帧不超过限速（不吃死区、不拖到 0.2s）', () => {
    const w = makeWorld();
    w.character.facing = 0;
    run(w, 1, intent({ moveX: 0.8, moveZ: 0 }));
    const after1 = Math.abs(wrapAngle(w.character.facing));
    const maxStep = ((w.config.orientation.facingTurnRate * Math.PI) / 180) * w.config.fixedDt;
    expect(after1).toBeGreaterThan(0);
    expect(after1).toBeLessThanOrEqual(maxStep + 1e-9);
    run(w, 3, intent({ moveX: 0.8, moveZ: 0 }));
    expect(Math.abs(wrapAngle(w.character.facing - HALF_PI))).toBeLessThan(1e-9);
  });

  it('攻击锁定解除：朝向跨帧回到输入方向，不整块翻转（真机 141° 那条的回归）', () => {
    const w = makeWorld();
    run(w, 30, intent({ moveX: 1 }));                     // 面向 +X
    w.combat.phase = 'windup';
    w.combat.attackFacing = HALF_PI;
    run(w, 3, intent({ moveX: -1 }));                     // 锁定期间保持 +X
    const locked = w.character.facing;
    w.combat.phase = 'idle';
    run(w, 1, intent({ moveX: -1 }));
    const maxStep = ((w.config.orientation.facingTurnRate * Math.PI) / 180) * w.config.fixedDt;
    const moved = Math.abs(wrapAngle(w.character.facing - locked));
    expect(moved).toBeGreaterThan(0.1);
    expect(moved).toBeLessThanOrEqual(maxStep + 1e-9);
    run(w, 7, intent({ moveX: -1 }));
    expect(Math.abs(wrapAngle(w.character.facing + HALF_PI))).toBeLessThan(1e-9);
  });

  it('小角（<= facingSnapDeg）调整仍瞬时对齐，不引入任何延迟', () => {
    const w = makeWorld();
    w.character.facing = 0;
    const ang = ((w.config.orientation.facingSnapDeg - 5) * Math.PI) / 180;
    run(w, 1, intent({ moveX: Math.sin(ang), moveZ: Math.cos(ang) }));
    expect(Math.abs(wrapAngle(w.character.facing - ang))).toBeLessThan(1e-9);
  });

  it('低于 facingDeadZone 的微抖不改变面朝向', () => {
    const w = makeWorld();
    run(w, 6, intent({ moveX: 0.7, moveZ: 0 }));      // 先朝 +X
    const held = w.character.facing;
    for (let i = 0; i < 10; i++) {
      run(w, 1, intent({ moveX: i % 2 === 0 ? 0.1 : -0.1, moveZ: 0 }));
    }
    expect(Math.abs(wrapAngle(w.character.facing - held))).toBeLessThan(1e-9);
  });

  it('小幅推杆反复反向：面朝向每秒转角被限速，不出现逐帧 180° 跳变', () => {
    const w = makeWorld();
    let maxStep = 0;
    for (let i = 0; i < 30; i++) {
      const before = w.character.facing;
      run(w, 1, intent({ moveX: i % 2 === 0 ? 0.25 : -0.25 }));
      maxStep = Math.max(maxStep, Math.abs(wrapAngle(w.character.facing - before)));
    }
    // 14/s 指数趋近：180° 反向时单帧最多 21% ≈ 38°，5 帧内转完，且不再瞬移
    expect(maxStep).toBeLessThan(0.7);
  });
});
