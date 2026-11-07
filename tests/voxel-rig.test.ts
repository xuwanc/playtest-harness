import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig } from '../src/core';

// 直接读 game.json 的 view 配置，证明表现层可脱离 Vite 单独实例化（不需要 WebGL 上下文）。
const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

/**
 * 回归测试：v7a 的「攻击跨步」曾用 += 往上半身组 position 累加，但每帧没有把它归零，
 * 导致攻击持续期间上半身（躯干+手臂+头）逐帧飞出去。
 * 修复：update() 每帧开头先归零；v8f 骨架重构后统一归零共享骨盆 pelvis.position.x/z，
 * applyStep 的 += 等价于从 0 重新叠加。
 * 这个测试连续驱动一段攻击，断言骨盆水平位移始终有界（不会随时间累积）。
 */
describe('voxel-rig 攻击时上半身不会飞出去', () => {
  it('连续攻击多帧后骨盆水平位移保持有界（不累积）', () => {
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel,
      raw.view.colors,
      w.config.moveSpeed,
      raw.view.orientation,
      raw.view.gait,
      raw.view.weaponMount,
      raw.view.lean,
      raw.view.hurt,
      raw.view.animation,
    );

    // v8f：跨步 / 下沉 / 重心都写在共享骨盆 pelvis 上（root → pelvis → [lower, upper]）
    const { pelvis } = rigNodes(rig);
    expect(pelvis).toBeDefined();

    // 起手攻击
    run(w, 1, intent({ attackPressed: true }));

    let maxAbsX = 0;
    let maxAbsZ = 0;
    let sawActive = false;

    // 连续推进 60 帧（覆盖 windup→active→recovery→settle 多个循环），每帧喂给 rig
    for (let i = 0; i < 60; i++) {
      run(w, 1, intent());
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt);
      if (w.combat.phase !== 'idle') sawActive = true;
      maxAbsX = Math.max(maxAbsX, Math.abs(pelvis.position.x));
      maxAbsZ = Math.max(maxAbsZ, Math.abs(pelvis.position.z));
      // 逐帧硬断言：任何一帧的水平位移都不应超过单帧跨步上限（约 0.17/0.14 量级）
      expect(Math.abs(pelvis.position.x)).toBeLessThan(0.3);
      expect(Math.abs(pelvis.position.z)).toBeLessThan(0.3);
    }

    expect(sawActive).toBe(true); // 确保测试确实跑进了攻击姿态（applyStep 被执行）
    expect(maxAbsX).toBeLessThan(0.25);
    expect(maxAbsZ).toBeLessThan(0.25);
  });

  it('受击按命中方向程序化后仰：正面命中朝后倒、背后命中朝前倒', () => {
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed,
      raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation,
    );
    const { upper } = rigNodes(rig);
    w.character.bodyYaw = 0; // 身体前方 = +Z

    // 正面命中：攻击者在前方，hit.dir 从攻击者指向角色 = 指向 -Z；角色应朝后倒（rotation.x < 0）
    w.playerHurt = { lastAt: 0, type: 'heavy', timer: 0.2, duration: 0.4, dirX: 0, dirZ: -1, knockX: 0, knockZ: 0 };
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt);
    const frontLean = upper.rotation.x;

    // 背后命中：攻击者正后方，hit.dir 指向 +Z（角色前方）；角色应朝前倒（rotation.x > 0）
    w.playerHurt = { lastAt: 0, type: 'heavy', timer: 0.2, duration: 0.4, dirX: 0, dirZ: 1, knockX: 0, knockZ: 0 };
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt);
    const backLean = upper.rotation.x;

    expect(frontLean).toBeLessThan(0);
    expect(backLean).toBeGreaterThan(0);
  });

  it('边瞄准边侧移：脚步沿侧移方向摆（rollZ 连续变化）、不前后乱摆、不累积', () => {
    const w = makeWorld();
    w.modules.targeting = false; // 关掉自动锁定，保证面向由拖拽决定
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed,
      raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation,
    );
    // v8f：按命名节点取左髋，不依赖 children 下标
    const hipL = rigNodes(rig).hipL;

    // 面向 +Z（瞄准），摇杆推向 +X（移动）→ 朝向分离，正是 v7c #11 的场景
    const aim = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 45, aim); // 让速度 / bodyYaw 稳定下来

    let maxRoll = 0;
    let maxPitch = 0;
    let changed = 0;
    let prevRoll: number | null = null;
    for (let i = 0; i < 90; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt);
      const roll = hipL.rotation.z as number;
      maxRoll = Math.max(maxRoll, Math.abs(roll));
      maxPitch = Math.max(maxPitch, Math.abs(hipL.rotation.x as number));
      if (prevRoll !== null && Math.abs(roll - prevRoll) > 1e-4) changed += 1;
      prevRoll = roll;
      expect(Math.abs(roll)).toBeLessThan(2); // 每帧重新赋值，不会逐帧累积
    }
    expect(maxRoll).toBeGreaterThan(0.05);   // 确实在侧向摆腿（解算器已接线）
    // v9n：下盘朝侧移方向带转后，速度在腿局部有了前向分量 ——
    // 纯侧移不再只有左右摆（双腿平行拖行），而是出现明显的前后迈步。
    expect(maxPitch).toBeGreaterThan(0.05);
    expect(changed).toBeGreaterThan(60);   // 随步态相位连续变化，不是定值
    expect(Math.abs(w.character.bodyYaw - w.character.moveYaw)).toBeGreaterThan(0.3); // 确实朝向分离
  });
});
