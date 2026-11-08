import { describe, expect, it } from 'vitest';
import type { SwingPoseViewConfig, WeaponId } from '../src/core';
import { autoSegBlend, solveSwingPose, swingPoseDistance } from '../src/presentation/swing-pose';
import type { SwingPose } from '../src/presentation/swing-pose';
import { CONFIG } from './helpers';

/**
 * v9s.31 · 段间混合时长自适应。
 *
 * 固定 `segBlend` 的两个毛病：双剑快攻 0.1s 占整段近一半（发黏），
 * 大剑换段姿态差 200° 时 0.1s 内跨完（硬切）。现在按「姿态差 / 角速度」算，
 * 段级 `blend` 仍可覆写。
 */

const SWING = CONFIG.view.animation.swing as SwingPoseViewConfig;

function pose(weapon: WeaponId, seg: number, t: number): SwingPose {
  // solveSwingPose 的 swing 参数 −1..1 映射到剪辑 t 0..1
  return solveSwingPose(weapon, seg, t * 2 - 1, SWING, 0.5);
}

describe('v9s.31 swingPoseDistance', () => {
  it('同一姿态距离为 0', () => {
    const a = pose('greatsword', 1, 0.3);
    expect(swingPoseDistance(a, a)).toBe(0);
  });

  it('姿态差越大，距离单调变大', () => {
    const a = pose('greatsword', 1, 0);
    const mid = pose('greatsword', 1, 0.5);
    const far = pose('greatsword', 1, 1);
    expect(swingPoseDistance(a, mid)).toBeGreaterThan(0);
    expect(swingPoseDistance(a, far)).toBeGreaterThan(swingPoseDistance(a, mid));
  });

  it('换段时长受本段预算约束：快刀不会被过渡吃掉', () => {
    const dsBudget = 0.35 * 0.22; // 双剑 windup+active+recovery ≈ 0.35s
    const ds = autoSegBlend(pose('dual-swords', 1, 1), pose('dual-swords', 2, 0), SWING, null, dsBudget);
    expect(ds).toBeLessThanOrEqual(dsBudget + 1e-9);
    expect(ds).toBeGreaterThan(0);
  });
});

describe('v9s.31 autoSegBlend', () => {
  it('第一段没有来源时用兜底 segBlend', () => {
    expect(autoSegBlend(null, pose('greatsword', 1, 0), SWING)).toBeCloseTo(SWING.segBlend, 6);
  });

  it('姿态差小的快刀混合明显短于大换段', () => {
    const a = pose('dual-swords', 1, 0.98);
    const b = pose('dual-swords', 1, 1);
    const small = autoSegBlend(a, b, SWING, null, 0.077);
    const big = autoSegBlend(pose('dual-swords', 1, 1), pose('dual-swords', 2, 0), SWING, null, 0.077);
    expect(small).toBeLessThan(big);
    expect(small).toBeGreaterThanOrEqual(SWING.segBlendMin!);
  });

  it('姿态差越大混合越长（同一武器内单调）', () => {
    const base = pose('greatsword', 1, 0.5);
    const near: SwingPose = { ...base, yaw: base.yaw + 0.15 };
    const far: SwingPose = { ...base, yaw: base.yaw + 1.1 };
    const a = autoSegBlend(base, near, SWING);
    const b = autoSegBlend(base, far, SWING);
    expect(b).toBeGreaterThan(a);
  });

  it('段级 blend 覆写优先于自动计算', () => {
    const a = pose('greatsword', 1, 1);
    const b = pose('greatsword', 2, 0);
    expect(autoSegBlend(a, b, SWING, 0.07)).toBeCloseTo(0.07, 6);
    expect(autoSegBlend(a, b, SWING, 0)).toBeCloseTo(0.008, 6);
  });
});
