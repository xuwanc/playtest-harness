import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { blendIKAngles, forwardKinematics, solveTwoBoneIK } from '../src/presentation/ik';

/**
 * v8g 新增的两骨 IK 纯函数层验收。
 * 之前实验台只有 FK + 解析摆腿，没有 IK；这里验证：
 *  1) FK 与真实 THREE 骨架（hip.rotation.order='ZYX'）逐项一致；
 *  2) FK → IK 往返能精确还原角度（膝后折 / 肘前折两种弯曲方向）；
 *  3) 不可达 / 过近 / 退化输入都稳定，不产生 NaN；
 *  4) 权重混合与单帧限幅。
 */
const L1 = 0.2;
const L2 = 0.2;

function threeFK(pitch: number, roll: number, joint: number): THREE.Vector3 {
  const hip = new THREE.Group();
  hip.rotation.order = 'ZYX';
  hip.rotation.set(pitch, 0, roll);
  const knee = new THREE.Group();
  knee.position.y = -L1;
  knee.rotation.x = joint;
  hip.add(knee);
  const tip = new THREE.Object3D();
  tip.position.y = -L2;
  knee.add(tip);
  hip.updateMatrixWorld(true);
  return tip.getWorldPosition(new THREE.Vector3());
}

describe('两骨 IK：FK 与真实骨架一致', () => {
  it('forwardKinematics 与 hip(ZYX)→knee 骨架末端世界坐标逐项相等', () => {
    const cases = [
      [0, 0, 0], [0.3, 0.1, 0.6], [-0.45, -0.22, 0.9], [0.2, 0.3, -0.5],
    ];
    for (const [pitch, roll, joint] of cases) {
      const fk = forwardKinematics(pitch, roll, joint, L1, L2);
      const p = threeFK(pitch, roll, joint);
      expect(fk.x).toBeCloseTo(p.x, 9);
      expect(fk.y).toBeCloseTo(p.y, 9);
      expect(fk.z).toBeCloseTo(p.z, 9);
    }
  });

  it('roll 不为 0 时仍精确（ZYX 保证两骨共面）', () => {
    const fk = forwardKinematics(0.35, 0.4, 0.7, L1, L2);
    const sol = solveTwoBoneIK(fk, L1, L2, 1);
    expect(sol.rootRoll).toBeCloseTo(0.4, 6);
    expect(sol.rootPitch).toBeCloseTo(0.35, 6);
    expect(sol.jointPitch).toBeCloseTo(0.7, 6);
  });
});

describe('两骨 IK：FK → IK 往返恒等', () => {
  it('膝向后折（bend=+1）：jointPitch > 0 的整片姿态都能还原', () => {
    for (const pitch of [-0.6, -0.2, 0, 0.25, 0.6]) {
      for (const roll of [-0.3, 0, 0.25]) {
        for (const joint of [0.05, 0.4, 0.9, 1.4]) {
          const fk = forwardKinematics(pitch, roll, joint, L1, L2);
          const sol = solveTwoBoneIK(fk, L1, L2, 1);
          expect(sol.clamped).toBe(false);
          expect(sol.rootPitch).toBeCloseTo(pitch, 5);
          expect(sol.rootRoll).toBeCloseTo(roll, 5);
          expect(sol.jointPitch).toBeCloseTo(joint, 5);
          expect(sol.jointPitch).toBeGreaterThan(0);
        }
      }
    }
  });

  it('肘向前折（bend=-1）：jointPitch < 0 的姿态也能还原', () => {
    for (const joint of [-0.15, -0.5, -1.0, -1.4]) {
      const fk = forwardKinematics(0.1, 0.05, joint, L1, L2);
      const sol = solveTwoBoneIK(fk, L1, L2, -1);
      expect(sol.rootPitch).toBeCloseTo(0.1, 5);
      expect(sol.rootRoll).toBeCloseTo(0.05, 5);
      expect(sol.jointPitch).toBeCloseTo(joint, 5);
      expect(sol.jointPitch).toBeLessThan(0);
    }
  });
});

describe('两骨 IK：边界与退化输入', () => {
  it('目标超出臂展：clamped=true、解接近伸直、reach>1', () => {
    const sol = solveTwoBoneIK({ x: 0, y: -1.2, z: 0 }, L1, L2, 1);
    expect(sol.clamped).toBe(true);
    expect(sol.reach).toBeGreaterThan(1);
    expect(Math.abs(sol.jointPitch)).toBeLessThan(0.05); // 伸直
    expect(Math.abs(sol.rootPitch)).toBeLessThan(0.05);
    expect(Number.isFinite(sol.rootRoll)).toBe(true);
  });

  it('目标贴到根关节（过近）：解折叠到接近 ±π，数值有限', () => {
    // 等长骨头的最小可达距离是 0，所以「很近」仍可达，不算 clamped；
    // 但两骨必须几乎完全折回，不能出现翻折 / NaN。
    const sol = solveTwoBoneIK({ x: 0.001, y: -0.001, z: 0 }, L1, L2, 1);
    expect(Math.abs(sol.jointPitch)).toBeGreaterThan(Math.PI - 0.2);
    expect(Number.isFinite(sol.rootPitch)).toBe(true);
    expect(Number.isFinite(sol.rootRoll)).toBe(true);
  });

  it('不等长骨头且目标短于 |L1-L2|：clamped=true 且被夹到最小臂展', () => {
    const sol = solveTwoBoneIK({ x: 0, y: -0.01, z: 0 }, 0.3, 0.1, 1);
    expect(sol.clamped).toBe(true);
    expect(Number.isFinite(sol.jointPitch)).toBe(true);
    expect(Math.abs(sol.jointPitch)).toBeGreaterThan(Math.PI - 0.3);
  });

  it('目标恰在根关节原点 / 非法长度 / NaN 都不产生 NaN', () => {
    const cases: Array<[Parameters<typeof solveTwoBoneIK>[0], number, number]> = [
      [{ x: 0, y: 0, z: 0 }, L1, L2],
      [{ x: 0, y: -0.3, z: 0 }, 0, L2],
      [{ x: 0, y: -0.3, z: 0 }, -1, L2],
      [{ x: Number.NaN, y: -0.3, z: 0 }, L1, L2],
      [{ x: 0, y: -0.3, z: Number.POSITIVE_INFINITY }, L1, L2],
    ];
    for (const [t, a, b] of cases) {
      const sol = solveTwoBoneIK(t, a, b, 1);
      expect(Number.isFinite(sol.rootPitch)).toBe(true);
      expect(Number.isFinite(sol.rootRoll)).toBe(true);
      expect(Number.isFinite(sol.jointPitch)).toBe(true);
      expect(sol.clamped).toBe(true);
    }
  });

  it('FK 末端距离永远不超过 L1+L2', () => {
    for (const joint of [0, 0.3, 1.2, 2.5]) {
      const fk = forwardKinematics(0.2, 0.1, joint, L1, L2);
      expect(Math.hypot(fk.x, fk.y, fk.z)).toBeLessThanOrEqual(L1 + L2 + 1e-9);
    }
  });
});

describe('两骨 IK：权重混合与单帧限幅', () => {
  const sol = solveTwoBoneIK({ x: 0, y: -0.3, z: 0.05 }, L1, L2, 1);

  it('weight=0 完全保持当前角度，weight=1 完全采用 IK 解', () => {
    const cur = { rootPitch: 0.5, rootRoll: -0.3, jointPitch: 0.2 };
    const zero = blendIKAngles(cur, sol, 0, Math.PI);
    expect(zero).toEqual(cur);
    const full = blendIKAngles(cur, sol, 1, Math.PI);
    expect(full.rootPitch).toBeCloseTo(sol.rootPitch, 9);
    expect(full.rootRoll).toBeCloseTo(sol.rootRoll, 9);
    expect(full.jointPitch).toBeCloseTo(sol.jointPitch, 9);
  });

  it('单帧修正被 maxCorrection 夹住，不出现角度突跳', () => {
    const cur = { rootPitch: 2, rootRoll: 0, jointPitch: 0 };
    const out = blendIKAngles(cur, sol, 1, 0.1);
    expect(Math.abs(out.rootPitch - cur.rootPitch)).toBeLessThanOrEqual(0.1 + 1e-9);
    expect(Math.abs(out.jointPitch - cur.jointPitch)).toBeLessThanOrEqual(0.1 + 1e-9);
  });
});
