import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import {
  capturePoseQuat, composePoseQuat, createPoseQuat, deltaPoseQuat, poseDeltaAngle,
  setPoseNodeEuler, setPoseNodeIdentity, writePoseQuat,
} from '../src/presentation/pose-quat';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

/**
 * v9s.73 · 攻击层从「欧拉逐轴覆盖」改成「四元数增量」。
 *
 * 用户原话：「个性 Pose +（攻击 Pose − 攻击基础 Pose）+ lean 这样？或有什么成熟方案」。
 * 落地的是 ozz / UE additive 那条公式：
 *
 * ```text
 * delta = 基准⁻¹ ⊗ 攻击        final = 基础 ⊗ slerp(I, delta, w)
 * ```
 *
 * 三条不变量（前两条是「老调校不重调」的保证）：
 *  1. `w = 0` 时一个字节都不写（骨骼就是基础姿势）；
 *  2. `w = 1` 且基础 == 基准时精确回到「攻击绝对姿态」（旧语义）；
 *  3. 中间帧走**最短弧**，且权重单调时转角单调（欧拉 lerp 不满足）。
 *
 * 另有一条边界：**手臂不走这条路径**。`armR.root.rotation.order = YXZ`，抬臂到
 * −109° 时四元数→欧拉会翻到等价解（`x=−1.24, y=2.86, z=−3.01`），
 * 而下游都按 `rotation.x` 读抬臂角 —— 实测会让举顶仰角从 89° 掉到 78°。
 * 见 `POSE_NODES` 注释与 `v9s30-mount-pitch.test.ts`。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0,
  dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

const angleOf = (q: THREE.Quaternion): number => 2 * Math.acos(Math.min(1, Math.abs(q.w)));

// ---------------------------------------------------------------- 纯数学

describe('v9s.73 pose-quat：增量的三条不变量', () => {
  const rig = (): THREE.Object3D[] => {
    const a = new THREE.Object3D();
    const b = new THREE.Object3D();
    b.rotation.order = 'YXZ';
    return [a, b];
  };

  it('w=0：一个字节都不写（骨骼保持基础姿势）', () => {
    const nodes = rig();
    const base = capturePoseQuat(nodes);
    const ref = createPoseQuat(nodes);
    const attack = createPoseQuat(nodes);
    setPoseNodeEuler(ref, 0, 0.1, 0.2, 0.05);
    setPoseNodeEuler(attack, 0, -0.9, 0.5, 0.2);
    composePoseQuat(base, deltaPoseQuat(ref, attack), 0);
    expect(nodes[0].quaternion.x).toBeCloseTo(0, 12);
    expect(nodes[0].quaternion.w).toBeCloseTo(1, 12);
  });

  it('w=1 且基础 == 基准：精确回到攻击绝对姿态', () => {
    const nodes = rig();
    const ref = createPoseQuat(nodes);
    const attack = createPoseQuat(nodes);
    setPoseNodeEuler(ref, 0, 0.1, 0.2, 0.05);
    setPoseNodeEuler(attack, 0, -0.9, 0.5, 0.2);
    // 基础 = 基准，模拟「静止待机」这一帧
    writePoseQuat(ref);
    const base = capturePoseQuat(nodes);
    composePoseQuat(base, deltaPoseQuat(ref, attack), 1);
    const expected = new THREE.Quaternion(
      attack.q[0], attack.q[1], attack.q[2], attack.q[3],
    );
    expect(Math.abs(nodes[0].quaternion.dot(expected))).toBeGreaterThan(0.999999);
  });

  it('基准分离：基础多出来的体态被保留，不被攻击层抹掉', () => {
    const nodes = rig();
    const stance = createPoseQuat(nodes);   // 基准 = 站姿 0.1 rad 前倾
    const attack = createPoseQuat(nodes);   // 攻击 = 0.6 rad 前倾
    const base = createPoseQuat(nodes);     // 基础 = 站姿 + 体态 0.35
    setPoseNodeEuler(stance, 0, 0.1, 0, 0);
    setPoseNodeEuler(attack, 0, 0.6, 0, 0);
    setPoseNodeEuler(base, 0, 0.45, 0, 0);
    composePoseQuat(base, deltaPoseQuat(stance, attack), 1);
    // 结果 = 0.45 + (0.6 − 0.1) = 0.95 —— 体态 0.35 完整保留
    expect(nodes[0].rotation.x).toBeCloseTo(0.95, 6);
  });

  it('中间帧走最短弧：权重单调 → 转角单调、不回头', () => {
    const nodes = rig();
    const ref = createPoseQuat(nodes);
    const attack = createPoseQuat(nodes);
    setPoseNodeEuler(attack, 0, 0, 2.4, 0);      // 137°，欧拉 lerp 会绕远路
    const base = capturePoseQuat(nodes);
    const d = deltaPoseQuat(ref, attack);
    let prev = -1;
    for (let i = 0; i <= 20; i++) {
      composePoseQuat(base, d, i / 20);
      const a = angleOf(nodes[0].quaternion);
      expect(a).toBeGreaterThanOrEqual(prev - 1e-6);
      prev = a;
    }
    expect(prev).toBeCloseTo(2.4, 5);
  });

  it('单位四元数：无论权重多少，写回的都是归一化结果', () => {
    const nodes = rig();
    const ref = createPoseQuat(nodes);
    const attack = createPoseQuat(nodes);
    setPoseNodeEuler(attack, 0, -1.2, 0.7, 0.3);
    setPoseNodeEuler(attack, 1, -0.9, 0.1, -0.2);
    const base = capturePoseQuat(nodes);
    const d = deltaPoseQuat(ref, attack);
    for (const w of [0.1, 0.35, 0.7, 0.99]) {
      composePoseQuat(base, d, w);
      for (const n of nodes) expect(n.quaternion.length()).toBeCloseTo(1, 6);
    }
  });

  it('poseDeltaAngle：读的是最大单节点转角', () => {
    const nodes = rig();
    const ref = createPoseQuat(nodes);
    setPoseNodeIdentity(ref, 0);
    setPoseNodeIdentity(ref, 1);
    const pose = createPoseQuat(nodes);
    setPoseNodeEuler(pose, 0, 0, 0.3, 0);
    setPoseNodeEuler(pose, 1, 0, 1.1, 0);
    expect(poseDeltaAngle(deltaPoseQuat(ref, pose))).toBeCloseTo(1.1, 4);
  });
});

// ---------------------------------------------------------------- 骨架级

function makeRig() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
    { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
  );
  return { w, rig };
}

describe('v9s.73 攻击层：躯干走增量，手臂仍走覆盖', () => {
  it('满权重静止挥击：躯干总偏航 = 剪辑给的偏航（站姿在基准里被消掉）', () => {
    const { w, rig } = makeRig();
    (w.combat as { weapon: string }).weapon = 'sword-shield';
    let checked = 0;
    for (let i = 0; i < 40; i++) {
      step(w, w.config.fixedDt, i === 4 ? intent({ attackPressed: true }) : intent({}));
      (w.combat as { weapon: string }).weapon = 'sword-shield';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const d = rig.swingDebug();
      if (d.poseW < 0.999) continue;
      // 站定挥击：下盘不带转（hipYaw = 0），躯干总角就是剪辑的 bodyYaw
      if (Math.abs(rig.hipYaw()) > 0.02) continue;
      expect(rig.torsoTotal().yaw).toBeCloseTo(d.yaw, 2);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(3);
    rig.dispose();
  });

  it('满权重时上臂仍精确落在剪辑角度上（不走四元数→欧拉的重分解）', () => {
    const { w, rig } = makeRig();
    (w.combat as { weapon: string }).weapon = 'greatsword';
    let peak = Infinity;
    for (let i = 0; i < 90; i++) {
      step(w, w.config.fixedDt, intent({ attackPressed: i % 22 === 0, attackHeld: true }));
      (w.combat as { weapon: string }).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const d = rig.swingDebug();
      if (d.seg !== 3 || d.poseW < 0.999) continue;
      const armR = rig.group.getObjectByName('shoulderR')!;
      peak = Math.min(peak, armR.rotation.x);
    }
    // 举顶首帧 armPitch = −1.9：若走四元数重分解会翻到 −1.24
    expect(peak).toBeLessThan(-1.85);
    rig.dispose();
  });

  it('收招时躯干平滑回到待机：回收段单帧不跳', () => {
    const { w, rig } = makeRig();
    (w.combat as { weapon: string }).weapon = 'sword-shield';
    let maxStep = 0;
    let prev = rig.torsoTotal().yaw;
    for (let i = 0; i < 70; i++) {
      step(w, w.config.fixedDt, i === 4 ? intent({ attackPressed: true }) : intent({}));
      (w.combat as { weapon: string }).weapon = 'sword-shield';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const t = rig.torsoTotal().yaw;
      if (w.combat.phase === 'recovery' || w.combat.phase === 'settle' || w.combat.phase === 'idle') {
        maxStep = Math.max(maxStep, Math.abs(t - prev));
      }
      prev = t;
    }
    expect(maxStep).toBeLessThan(0.3);   // 回收段单帧 < 17°
    rig.dispose();
  });
});
