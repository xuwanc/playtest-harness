import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { backHipYawTarget, backStrafeKeep } from '../src/presentation/gait';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeQuietWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const DEG = Math.PI / 180;
const R2D = 180 / Math.PI;

/** 把「轴角度差」折到 [-90, 90]：下盘前后轴是无向的，差 180° 等于对齐。 */
function foldAxis(deg: number): number {
  const d = ((deg % 180) + 180) % 180;
  return d > 90 ? d - 180 : d;
}

describe('v9s.14 · 侧后方下盘修正方向翻转', () => {
  it('侧后方 135°：下盘转到 −45°（移动方向 − 180°），与侧移偏转反号', () => {
    const strafe = 0.5;
    const h = backHipYawTarget(Math.cos(135 * DEG), Math.sin(135 * DEG), strafe, 0);
    expect(h * R2D).toBeCloseTo(-45, 3);
    expect(Math.sign(h)).toBe(-1);            // 朝移动方向的反侧
  });

  it('左右对称：−135° 时翻到 +45°', () => {
    const h = backHipYawTarget(Math.cos(-135 * DEG), Math.sin(-135 * DEG), -0.5, 0);
    expect(h * R2D).toBeCloseTo(45, 3);
  });

  it('正后方 180°：翻转为 0（本来就正对，无需偏转）', () => {
    expect(backHipYawTarget(-1, 0, 0, 0)).toBeCloseTo(0, 6);
  });

  it('侧移尚未越界（|θ| ≤ 90°）时原样返回侧移偏转，保证连续', () => {
    const strafe = 0.42;
    expect(backHipYawTarget(1, 0, strafe, 0)).toBeCloseTo(strafe, 9);
    expect(backHipYawTarget(0, 1, strafe, 0)).toBeCloseTo(strafe, 9);
  });

  it('backKeep=1 时精确等于侧移偏转（v9s.13 之前的观感逐帧不变）', () => {
    const strafe = -0.33;
    expect(backHipYawTarget(Math.cos(135 * DEG), Math.sin(135 * DEG), strafe, 1))
      .toBeCloseTo(strafe, 9);
  });

  it('90° → 180° 扫过去，轴对齐残差在 132° 之后趋零', () => {
    // 取配置门限：100° 起步、132° 完全翻完
    const residual = (deg: number): number => {
      const th = deg * DEG;
      const f = Math.cos(th);
      const r = Math.sin(th);
      const keep = backStrafeKeep(f, 100, 132);
      const strafe = 0.32 * Math.sign(r);      // 侧移偏转的同号近似
      const h = backHipYawTarget(f, r, strafe, keep);
      return Math.abs(foldAxis(deg - h * R2D));
    };
    // 已经翻完的后退段：轴与移动方向几乎平行（残差 ≤ 6°，纯 FK 的残余滑移）
    expect(residual(132)).toBeLessThan(6);
    expect(residual(150)).toBeLessThan(6);
    expect(residual(180)).toBeLessThan(1);
    // monotone 改善：越接近正后方越准
    expect(residual(150)).toBeLessThanOrEqual(residual(132) + 1e-6);
  });

  it('零速度 / 参数退化不产生 NaN', () => {
    const h = backHipYawTarget(0, 0, 0.2, 0.5);
    expect(Number.isFinite(h)).toBe(true);
    expect(h).toBeCloseTo(0.2, 6);
  });
});

/** 用真实骨架跑「身体朝 +Z、向 moveX/moveZ 方向移动」，返回步态诊断峰值。 */
function runRig(moveX: number, moveZ: number) {
  const w = makeQuietWorld();
  w.modules.dummies = false;
  w.modules.targeting = false;
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation,
  );
  const aim = intent({ moveX, moveZ, aimActive: true, aimX: 0, aimZ: 1 });
  run(w, 40, aim);
  let hipAbs = 0;
  let hipSigned = 0;
  let legRoll = 0;
  let legPitch = 0;
  for (let i = 0; i < 40; i++) {
    run(w, 1, aim);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
    const d = rig.gaitDebug();
    const a = Math.abs(d.hipYaw);
    if (a > hipAbs) {
      hipAbs = a;
      hipSigned = d.hipYaw;
    }
    legRoll = Math.max(legRoll, Math.abs(d.legLRoll), Math.abs(d.legRRoll));
    legPitch = Math.max(legPitch, Math.abs(d.legLPitch), Math.abs(d.legRPitch));
  }
  const theta = (Math.atan2(moveX, moveZ) * R2D + 360) % 360;
  return {
    hipAbs, hipSigned, legRoll, legPitch, theta,
    residual: Math.abs(foldAxis(theta - hipSigned * R2D)),
    rig, hipL: rigNodes(rig).hipL,
  };
}

describe('v9s.14 · 真实骨架：下盘轴对齐移动方向', () => {
  it('侧后方 135°：下盘 −45°，轴残差 < 8°（不再横向滑 45%）', () => {
    const r = runRig(0.7071, -0.7071);
    expect(r.theta).toBeCloseTo(135, 0);
    expect(r.hipSigned * R2D).toBeCloseTo(-45, 0);
    expect(r.residual).toBeLessThan(8);
    expect(r.legRoll).toBeLessThan(0.02);      // 仍是纯前后摆，不斜拉
    expect(r.legPitch).toBeGreaterThan(0.2);
  });

  it('侧前方 45° 仍是侧移偏转（正号），轴残差保持旧观感', () => {
    const r = runRig(0.7071, 0.7071);
    expect(r.hipSigned).toBeGreaterThan(0);
    expect(r.legRoll).toBeGreaterThan(0.02);   // 侧移 + 交叉步照旧
  });

  it('纯侧移 90° 对照：下盘带转与侧向迈步都不变', () => {
    const r = runRig(1, 0);
    expect(r.hipSigned).toBeGreaterThan(0.25);
    expect(r.legRoll).toBeGreaterThan(0.05);
  });
});
