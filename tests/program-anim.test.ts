import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { solveGait } from '../src/presentation/gait';
import {
  attackBlendStep, attackGaitDrive, attackStridePose, clamp01, landingImpactScale,
  landingPulse, poseWeights, pulseValue, scaleGaitPose,
} from '../src/presentation/program-anim';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const landCfg = raw.view.animation.landing;

// v9e：stride=0 = 回退到「摆幅随速度」路径（攻击等效驱动走这条），本篇断言的都是该路径
const pose = solveGait({
  phase: 0.7, speed: 3, moveSpeed: raw.core.moveSpeed,
  localForward: 3, localRight: 0, legLength: raw.view.voxel.legLength, stride: 0, grounded: true,
}, raw.view.gait);

describe('v8c 落地缓冲曲线：两端归零、峰值可控、C¹ 连续', () => {
  it('p=0 / p=1 恒为 0，压缩比处取峰值 1', () => {
    const r = landCfg.compressRatio;
    expect(landingPulse(0, r)).toBe(0);
    expect(landingPulse(1, r)).toBe(0);
    expect(landingPulse(-0.2, r)).toBe(0);
    expect(landingPulse(1.2, r)).toBe(0);
    expect(landingPulse(r, r)).toBeCloseTo(1, 12);
  });

  it('下压段单调上升、回弹段单调下降，整段不出现折点跳变', () => {
    const r = landCfg.compressRatio;
    let prev = 0;
    let maxJump = 0;
    for (let i = 0; i <= 200; i++) {
      const p = i / 200;
      const v = landingPulse(p, r);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1 + 1e-12);
      maxJump = Math.max(maxJump, Math.abs(v - prev));
      prev = v;
      if (p > 0 && p < r) expect(v).toBeGreaterThan(landingPulse(p - 0.005, r));
      if (p > r && p < 1) expect(v).toBeLessThan(landingPulse(p - 0.005, r));
    }
    expect(maxJump).toBeLessThan(0.06); // 每 0.5% 进度变化 < 0.06，无突变
  });

  it('压缩比被限幅在 [0.05, 0.9]，极端配置不会除零', () => {
    expect(landingPulse(0.5, 0)).toBeGreaterThan(0);
    expect(landingPulse(0.5, 1)).toBeGreaterThan(0);
    expect(Number.isFinite(landingPulse(0.5, -3))).toBe(true);
  });

  it('pulseValue：未触发 / 时间倒退 / 超时的取值都是 0，不残留', () => {
    expect(pulseValue(0.2, 0, 0, 1, 0.2)).toBe(0);       // duration=0
    expect(pulseValue(0.2, 0, 0.34, 0, 0.2)).toBe(0);    // strength=0
    expect(pulseValue(-0.1, 0, 0.34, 1, 0.2)).toBe(0);    // 复位后时间倒退
    expect(pulseValue(0.34, 0, 0.34, 1, 0.2)).toBe(0);    // 刚好结束
    expect(pulseValue(0.061, 0, 0.34, 1, 0.18)).toBeGreaterThan(0.9); // 峰值附近
  });
});

describe('v8c/v8d 攻击姿态分层权重：连续、可热调、两条路径各自可驱动下盘', () => {
  it('attackBlendStep 指数趋近，单帧变化有界（进出攻击不跳变）', () => {
    let b = 0;
    let maxStep = 0;
    for (let i = 0; i < 40; i++) {
      const next = attackBlendStep(b, true, 1 / 60, raw.view.animation.attack.blendRate);
      maxStep = Math.max(maxStep, Math.abs(next - b));
      b = next;
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(1);
    }
    expect(b).toBeGreaterThan(0.99);
    expect(maxStep).toBeLessThan(0.25);
    // 退出攻击回到 0，dt=0 时保持不变
    expect(attackBlendStep(b, true, 0, 14)).toBe(b);
    let out = b;
    for (let i = 0; i < 60; i++) out = attackBlendStep(out, false, 1 / 60, 14);
    expect(out).toBeLessThan(0.001);
  });

  it('poseWeights：默认配置在攻击稳定态下 gaitScale/attackLegWeight 都归零', () => {
    const a = raw.view.animation.attack;
    const idleMix = poseWeights(0, a.gaitWeight, a.lowerBodyWeight);
    expect(idleMix.gaitScale).toBe(1);        // 非攻击时步态完整生效
    expect(idleMix.attackLegWeight).toBe(0);

    const atkMix = poseWeights(1, a.gaitWeight, a.lowerBodyWeight);
    expect(atkMix.gaitScale).toBe(1);         // v8d 默认 gw=1：攻击期间步态接管下盘
    expect(atkMix.attackLegWeight).toBe(0);  // 挥击跨步写腿仍被过滤（默认 lw=0）

    // 两个权重都关 = 完全过滤的静止基准；都开 = 两条路径叠加，可即时对比
    const off = poseWeights(1, 0, 0);
    expect(off.gaitScale).toBe(0);
    expect(off.attackLegWeight).toBe(0);
    const legacy = poseWeights(1, 1, 1);
    expect(legacy.gaitScale).toBe(1);
    expect(legacy.attackLegWeight).toBe(1);
    expect(poseWeights(0.5, 0, 0.5).attackLegWeight).toBeCloseTo(0.25, 12);
    expect(clamp01(2)).toBe(1);
  });

  it('scaleGaitPose 线性缩放姿态量、保留诊断权重、不修改入参', () => {
    expect(pose.legL.pitchX).not.toBe(0); // 确保测的是实打实的步态姿态
    const zero = scaleGaitPose(pose, 0);
    expect(zero.legL.pitchX).toBeCloseTo(0, 12);
    expect(zero.legR.kneeX).toBeCloseTo(0, 12);
    expect(zero.pelvisY).toBeCloseTo(0, 12);
    expect(zero.armL).toBeCloseTo(0, 12);
    expect(zero.sideLean).toBeCloseTo(0, 12);
    expect(zero.strafe).toBe(pose.strafe);       // 诊断权重不缩放
    expect(zero.backward).toBe(pose.backward);
    expect(scaleGaitPose(pose, 1)).toBe(pose);    // s=1 直接复用，零拷贝
    const half = scaleGaitPose(pose, 0.5);
    expect(half.legL.pitchX).toBeCloseTo(pose.legL.pitchX * 0.5, 12);
    expect(pose.legL.pitchX).not.toBe(0);         // 入参未被改动
  });

  it('landingImpactScale：小跳保留最小缓冲，高速下落饱和到 1', () => {
    expect(landingImpactScale(0, landCfg)).toBeCloseTo(landCfg.minScale, 12);
    expect(landingImpactScale(-landCfg.impactSpeed, landCfg)).toBeCloseTo(1, 12);
    expect(landingImpactScale(-landCfg.impactSpeed * 3, landCfg)).toBeCloseTo(1, 12);
    const low = landingImpactScale(-1, landCfg);
    const high = landingImpactScale(-6, landCfg);
    expect(high).toBeGreaterThan(low);
    expect(low).toBeGreaterThanOrEqual(landCfg.minScale);
  });
});

const stCfg = raw.view.animation.stride;
/** 攻击时 Core 锁速后的真实输入：speed=0、相位冻结、方向分量 0。 */
const locked = { speed: 0, phase: 1.2, localForward: 0, localRight: 0 };

function gaitFrom(d: { speed: number; phase: number; localForward: number; localRight: number }) {
  return solveGait({
    phase: d.phase, speed: d.speed, moveSpeed: raw.core.moveSpeed,
    localForward: d.localForward, localRight: d.localRight,
    legLength: raw.view.voxel.legLength, stride: 0, grounded: true,
  }, raw.view.gait);
}

describe('v8d 攻击等效步态驱动：绕过 Core 锁速、两端同相、方向左右交替', () => {
  it('blend=1 时喂进 solveGait 的 speed>0，解算器不再返回 idle（旧 bug 根因）', () => {
    const d = attackGaitDrive(locked, 0.4, 1, 1, stCfg);
    expect(d.speed).toBeCloseTo(stCfg.strideSpeed, 12);
    const pose = gaitFrom(d);
    expect(pose.legL.pitchX).not.toBe(0);
    expect(pose.legR.kneeX).toBeGreaterThan(0);
    // 对照：不补等效驱动（旧 bug）时解算器恒为静止
    const oldPose = gaitFrom(locked);
    expect(oldPose.legL.pitchX).toBe(0);
    expect(oldPose.legR.kneeX).toBe(0);
  });

  // v9s.41：一段攻击 = 迈一步。相位单向推进 π×cycles 后**不回零**，终点是「另一条腿
  // 在前」；下一段由调用方从这个终点接着走，连段才会左右换腿（旧版往返归零，
  // 每段都从同一姿态出发，连着打两刀腿完全重合）。
  it('v9s.41：相位单向推进 π×cycles，终点 = 另一条腿在前（不再往返归零）', () => {
    const base = 0.4;
    const r = { ...locked, phase: base };
    const half = Math.PI * Math.round(stCfg.cycles);
    const a = attackGaitDrive(r, 0, 1, 1, stCfg, base);
    const b = attackGaitDrive(r, 1, 1, 1, stCfg, base);
    const mid = attackGaitDrive(r, 0.5, 1, 1, stCfg, base);
    // 返回的 phase 折过最短弧，只能比姿态（cos/sin），不能比原始角
    expect(a.phase).toBeCloseTo(base, 12);
    expect(Math.cos(b.phase)).toBeCloseTo(Math.cos(base + half), 8);
    expect(Math.sin(b.phase)).toBeCloseTo(Math.sin(base + half), 8);
    expect(Math.cos(mid.phase)).toBeCloseTo(Math.cos(base + half / 2), 8);
    // 两端速度为 0：起手 / 收尾各 2% 进度只走掉很小一截
    expect(Math.abs(attackGaitDrive(r, 0.02, 1, 1, stCfg, base).phase - base)).toBeLessThan(0.01);
    expect(Math.abs(attackGaitDrive(r, 0.98, 1, 1, stCfg, base).phase - (base + half))).toBeLessThan(0.01);
  });

  it('blend=0 原样返回真实输入；中间值四个量都有限且单调插值', () => {
    expect(attackGaitDrive(locked, 0.6, 2, 0, stCfg)).toBe(locked);
    let prev = -Infinity;
    for (let i = 0; i <= 20; i++) {
      const d = attackGaitDrive(locked, 0.37, 3, i / 20, stCfg);
      for (const v of Object.values(d)) expect(Number.isFinite(v)).toBe(true);
      expect(d.speed).toBeGreaterThanOrEqual(prev);
      prev = d.speed;
    }
  });

  it('连击段奇偶：侧跨方向左右交替，前冲分量始终为正', () => {
    const even = attackGaitDrive(locked, 0.5, 2, 1, stCfg);
    const odd = attackGaitDrive(locked, 0.5, 1, 1, stCfg);
    expect(even.localRight).toBeGreaterThan(0);
    expect(odd.localRight).toBeLessThan(0);
    expect(even.localForward).toBeGreaterThan(0);
    expect(even.localForward).toBeCloseTo(odd.localForward, 12);
  });

  it('cycles 非整数被四舍五入为 >=1 的整数，strideSpeed 负值夹到 0', () => {
    const d = attackGaitDrive(locked, 1, 1, 1, { ...stCfg, cycles: 0.2, strideSpeed: -5 });
    // cycles 0.2 → 1，所以整段仍然迈满一步（半圈）
    expect(Math.cos(d.phase)).toBeCloseTo(Math.cos(locked.phase + Math.PI), 8);
    expect(d.speed).toBe(0);
    const mid = attackGaitDrive(locked, 0.5, 1, 1, { ...stCfg, cycles: 0.2 });
    expect(Math.cos(mid.phase)).toBeCloseTo(Math.cos(locked.phase + Math.PI / 2), 8);
  });
});

describe('v8d 挥击跨步姿态：两端归零、左右交替、连续无跳变', () => {
  it('progress=0/1 恒为全零，中间幅度明显且不残留', () => {
    expect(attackStridePose(0, 1, stCfg).legL.pitchX).toBe(0);
    expect(attackStridePose(1, 1, stCfg).legL.pitchX).toBe(0);
    expect(attackStridePose(-0.3, 1, stCfg).legL.pitchX).toBe(0);
    expect(attackStridePose(1.4, 1, stCfg).legL.pitchX).toBe(0);
    const mid = attackStridePose(0.5, 1, stCfg);
    expect(Math.abs(mid.legL.pitchX)).toBeCloseTo(stCfg.stepPitch, 12);
    expect(mid.legL.kneeX).toBeGreaterThan(0);
    expect(mid.pelvisY).toBeLessThan(0); // 重心下沉
    expect(mid.sideLean).toBe(0);       // 不干扰上半身
  });

  it('连击奇偶：领先腿左右互换（呼应「连击左右交替跨步」）', () => {
    const even = attackStridePose(0.5, 2, stCfg); // 偶数段右腿领先
    const odd = attackStridePose(0.5, 1, stCfg);  // 奇数段左腿领先
    expect(even.legR.pitchX).toBeLessThan(0);    // 右腿向前踏
    expect(even.legL.pitchX).toBeGreaterThan(0); // 左腿蹬地
    expect(odd.legL.pitchX).toBeLessThan(0);
    expect(even.pelvisX).toBeCloseTo(-odd.pelvisX, 12);
  });

  it('整段曲线逐帧变化有界，不出现单帧跳变', () => {
    let prev = attackStridePose(0, 1, stCfg).legL.pitchX;
    let maxStep = 0;
    for (let i = 1; i <= 200; i++) {
      const v = attackStridePose(i / 200, 1, stCfg).legL.pitchX;
      maxStep = Math.max(maxStep, Math.abs(v - prev));
      prev = v;
    }
    expect(maxStep).toBeLessThan(0.02);
  });
});
