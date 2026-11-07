import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { backStrafeKeep, solveGait, strafeHipYaw } from '../src/presentation/gait';
import type { GaitInput } from '../src/presentation/gait';
import type { AppConfig, GaitViewConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const cfg: GaitViewConfig = raw.view.gait;

const DEG = Math.PI / 180;
const legLen = 0.4;
const speed = 4;

/** 按「相对身体前向的角度」构造步态输入（0 = 正前，90 = 正侧，180 = 正后）。 */
function inputAt(deg: number, over: Partial<GaitInput> = {}): GaitInput {
  const th = deg * DEG;
  return {
    phase: 0,
    speed,
    moveSpeed: 4,
    localForward: speed * Math.cos(th),
    localRight: speed * Math.sin(th),
    legLength: legLen,
    stride: 0.9,
    grounded: true,
    ...over,
  };
}

/** 两腿在一个步相周期内的前后 / 侧向摆幅（峰值，弧度）。 */
function amplitudes(i: GaitInput): { pitch: number; roll: number } {
  let pitch = 0;
  let roll = 0;
  for (let k = 0; k < 24; k++) {
    const pose = solveGait({ ...i, phase: (k / 24) * Math.PI * 2 }, cfg);
    pitch = Math.max(pitch, Math.abs(pose.legL.pitchX), Math.abs(pose.legR.pitchX));
    roll = Math.max(roll, Math.abs(pose.legL.rollZ), Math.abs(pose.legR.rollZ));
  }
  return { pitch, roll };
}

describe('v9s.13 · 侧后方改用后退步态', () => {
  it('角度门限：前 / 正侧保持侧移，越往后越收，正后方完全并入前后轴', () => {
    expect(backStrafeKeep(1, 100, 132)).toBeCloseTo(1, 6);
    expect(backStrafeKeep(0, 100, 132)).toBeCloseTo(1, 6);        // 正侧方仍在门限之前
    expect(backStrafeKeep(Math.cos(150 * DEG), 100, 132)).toBeCloseTo(0, 6);
    expect(backStrafeKeep(-1, 100, 132)).toBeCloseTo(0, 6);
  });

  it('系数随角度单调不增，且过渡区两端连续（无突跳）', () => {
    let prev = 1;
    for (let d = 0; d <= 180; d += 1) {
      const k = backStrafeKeep(Math.cos(d * DEG), 100, 132);
      expect(k).toBeLessThanOrEqual(prev + 1e-9);
      expect(Math.abs(k - prev)).toBeLessThan(0.06);   // 1° 步进下的最大变化量
      prev = k;
    }
  });

  it('参数异常（full ≤ start）时退化为硬门限，不产生 NaN', () => {
    const k1 = backStrafeKeep(Math.cos(90 * DEG), 132, 100);
    const k2 = backStrafeKeep(-1, 132, 100);
    expect(Number.isFinite(k1)).toBe(true);
    expect(Number.isFinite(k2)).toBe(true);
    expect(k1).toBe(1);
    expect(k2).toBe(0);
  });

  it('侧后方 135°：后退权重满值、侧移权重归零', () => {
    const p = solveGait(inputAt(135), cfg);
    expect(p.backward).toBeCloseTo(1, 3);
    expect(p.strafe).toBeLessThan(0.02);
  });

  it('侧后方 135°：腿只做前后摆，不再斜向拉开', () => {
    const a = amplitudes(inputAt(135));
    // 前后摆幅应该是主角，侧向几乎为 0（旧实现两者接近 1:0.85，脚走对角线）
    expect(a.pitch).toBeGreaterThan(0.15);
    expect(a.roll).toBeLessThan(a.pitch * 0.12);
  });

  it('侧前方 45° 仍保留侧移与交叉步（本次只改后半球）', () => {
    const a = amplitudes(inputAt(45));
    const p = solveGait(inputAt(45), cfg);
    expect(p.strafe).toBeGreaterThan(0.3);
    expect(a.roll).toBeGreaterThan(a.pitch * 0.3);
  });

  it('纯侧移 90° 完全不受影响', () => {
    const p = solveGait(inputAt(90), cfg);
    expect(p.strafe).toBeCloseTo(1, 3);
    expect(p.backward).toBe(0);
  });

  it('正后方与旧行为一致（本来就是纯后退）', () => {
    const p = solveGait(inputAt(180), cfg);
    expect(p.backward).toBeCloseTo(1, 3);
    expect(p.strafe).toBeLessThan(1e-3);
  });

});
