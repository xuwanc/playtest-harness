import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, Intents, World } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

/** 构造 rig：与 voxel-rig.test.ts 一致，直接用真实 view 配置。 */
function makeRig(moveSpeed: number): VoxelRig {
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation,
  );
}

/** v8f 骨架：root → pelvis → [lower, upper]；下盘偏航写在 lower.rotation.y（绕髋）。 */
function lowerYaw(rig: VoxelRig): number {
  return rigNodes(rig).lower.rotation.y as number;
}
function hipL(rig: VoxelRig): { rotation: { x: number; z: number } } {
  return rigNodes(rig).hipL;
}

const TAU = Math.PI * 2;
/** 最短弧差值，单位 rad，∈(-π, π] */
function angleDelta(a: number, b: number): number {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

describe('v8b 下盘偏航：引导 / 后退时跨朝向不跳变', () => {
  /**
   * 问题 #1：旧实现 lower.rotation.y = wrapAngle(moveYaw - bodyYaw) * legYawScale。
   * 「瞄准」把 bodyYaw 指向飞弹方向，「移动」把 moveYaw 指向摇杆方向；当两者接近
   * 反向（引导时后退 / 侧后移动）时，moveYaw - bodyYaw 逼近 ±π，wrapAngle 会把
   * +π 突然翻成 -π，下盘瞬间翻转约 2 × legYawScale × π ≈ 2.2 rad，观感即「跳变」。
   *
   * 修复后下盘偏航由连续侧向速度占比驱动 + 指数平滑，全程无 atan2/wrapAngle，
   * 逐帧变化必须很小（限幅 × 平滑速率决定单帧上限），且恒在 ±hipMax 内。
   */
  it('法杖引导 + 拖拽瞄准 + 后退：下盘偏航逐帧连续、有界，不跨 ±π 翻转', () => {
    const w = makeWorld();
    w.modules.targeting = false; // 关锁定，保证 facing 完全由拖拽决定
    // v9s.17：引导改成「有限波次 + 冷却」，这里要测的是**引导期间**的下盘姿态，
    // 把波数拉大让引导持续覆盖整个 150 帧观察窗口（与真实节奏无关）。
    w.config.abilities.arcane.waves = 999;
    const rig = makeRig(w.config.moveSpeed);

    // 切到法杖（槽 4），按住攻击键进入引导；拖拽瞄准 +Z，摇杆往 -Z 后退。
    // 这样 bodyYaw 追随 facing(≈0，朝 +Z)，moveYaw 是速度方向(≈π，朝 -Z)，差值 ≈ ±π —— 旧版的跳变点。
    run(w, 1, intent({ weaponSlot: 4 }));
    const hold: Intents = intent({
      attackHeld: true,
      aimActive: true, aimX: 0, aimZ: 1,  // 瞄准 +Z（身体朝 +Z）
      moveX: 0, moveZ: -1,                // 摇杆往 -Z（后退移动）
    });

    let prev: number | null = null;
    let maxJump = 0;
    let maxAbs = 0;
    let sawReverse = false;
    for (let i = 0; i < 150; i++) {
      run(w, 1, hold);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, w.abilities.channeling);
      const yaw = lowerYaw(rig);
      if (prev !== null) maxJump = Math.max(maxJump, Math.abs(yaw - prev));
      prev = yaw;
      maxAbs = Math.max(maxAbs, Math.abs(yaw));
      // 确实出现了「朝向与移动接近反向」的构图（差值逼近 ±π）
      if (Math.abs(angleDelta(w.character.moveYaw, w.character.bodyYaw)) > 2.4) sawReverse = true;
      // 自洽不变量：投影基准必须等于下盘实际朝向（bodyYaw + hipYaw）
      expect(Math.abs(angleDelta(rig.gaitYaw(), w.character.bodyYaw + rig.hipYaw()))).toBeLessThan(1e-9);
    }

    expect(w.abilities.channeling).toBe(true);       // 确实在引导飞弹
    expect(sawReverse).toBe(true);                  // 确实覆盖了逼近 ±π 的场景
    expect(maxJump).toBeLessThan(0.12);             // 逐帧连续：无 ±π 瞬翻（旧版这里 ≈2.2）
    const hipMax = (raw.view.orientation.hipYawMaxDeg * Math.PI) / 180;
    expect(maxAbs).toBeLessThanOrEqual(hipMax + 1e-6); // 恒在限幅内
  });

  /**
   * 用一条人为扫过全周的轨迹，精确覆盖 bodyYaw 从 0 扫到 2π（差值反复穿越 ±π），
   * 保证不依赖 AI / 加速的偶然时序。旧版 wrapAngle 公式在这一圈里必然翻两次。
   */
  it('朝向差扫过整圈（含 ±π 边界）时下盘偏航始终连续、有界', () => {
    const w = makeWorld();
    const rig = makeRig(w.config.moveSpeed);
    w.character.grounded = true;
    const spd = w.config.moveSpeed;

    let prev: number | null = null;
    let maxJump = 0;
    for (let i = 0; i < 360; i++) {
      const bodyYaw = (i / 360) * TAU;      // 身体朝向匀速转一整圈
      const moveYaw = bodyYaw + Math.PI - 0.02 * Math.sin(i * 0.3); // 移动方向始终与身体接近反向 ±π 抖动
      w.character.bodyYaw = bodyYaw;
      w.character.facing = bodyYaw;
      w.character.moveYaw = moveYaw;
      w.character.velocity.x = Math.sin(moveYaw) * spd;
      w.character.velocity.z = Math.cos(moveYaw) * spd;
      w.character.gaitPhase = (i * 0.11) % TAU;
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const yaw = lowerYaw(rig);
      if (prev !== null) maxJump = Math.max(maxJump, Math.abs(yaw - prev));
      prev = yaw;
      expect(Math.abs(yaw)).toBeLessThanOrEqual((raw.view.orientation.hipYawMaxDeg * Math.PI) / 180 + 1e-6);
    }
    expect(maxJump).toBeLessThan(0.12);
  });
});

describe('v8b 腿摆动方向：投影基准与下盘朝向自洽', () => {
  /**
   * 问题 #2：腿挂在 lower 下（lower.rotation.y = hipYaw），腿的局部坐标系朝向是
   * bodyYaw + hipYaw；若 gait 仍按 bodyYaw 投影速度，两者差一个 hipYaw，非正前方
   * 时腿摆动方向被歪掉。修复后 gait 用 bodyYaw + hipYaw 投影，gaitYaw() 必须恒等于
   * bodyYaw + hipYaw()，且这个基准随 hipYaw 平滑变化（不是固定 bodyYaw）。
   */
  it('侧移时 gaitYaw 随 hipYaw 带转，且始终等于下盘实际朝向', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    // 身体朝 +Z 瞄准，摇杆推向 +X 侧移 → hipYaw 朝右带转
    const aim: Intents = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 45, aim);

    let sawNonZeroHip = false;
    for (let i = 0; i < 90; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const hip = rig.hipYaw();
      const gaitYaw = rig.gaitYaw();
      // 核心不变量：投影基准 = bodyYaw + hipYaw = 下盘实际朝向
      expect(Math.abs(angleDelta(gaitYaw, w.character.bodyYaw + hip))).toBeLessThan(1e-9);
      expect(Math.abs(angleDelta(lowerYaw(rig), hip))).toBeLessThan(1e-9);
      if (Math.abs(hip) > 0.02) {
        sawNonZeroHip = true;
        // 一旦下盘带转，投影基准就不能还固定在 bodyYaw
        expect(Math.abs(angleDelta(gaitYaw, w.character.bodyYaw))).toBeGreaterThan(0.01);
      }
    }
    expect(sawNonZeroHip).toBe(true); // 确实发生了下盘带转（否则等于没测到方向变化）
  });

  it('纯侧移时下盘带转，腿既有侧摆也有前后迈步（v9n 不再双腿平行）', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const aim: Intents = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 45, aim);

    let maxRoll = 0;
    let maxPitch = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      maxRoll = Math.max(maxRoll, Math.abs(hipL(rig).rotation.z));
      maxPitch = Math.max(maxPitch, Math.abs(hipL(rig).rotation.x));
    }
    expect(maxRoll).toBeGreaterThan(0.05);
    // v9n：侧向摆仍在，但下盘带转让前后迈步也出现了 —— 这正是「避开双腿平行区间」的目的
    expect(maxPitch).toBeGreaterThan(0.05);
  });
});
