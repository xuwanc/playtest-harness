import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { solveGait } from '../src/presentation/gait';
import type { GaitInput } from '../src/presentation/gait';
import type { AppConfig, GaitViewConfig } from '../src/core';

// 用真实配置，证明默认值本身是自洽的；个别用例临时覆盖参数做对照。
const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const cfg: GaitViewConfig = raw.view.gait;

const TAU = Math.PI * 2;

/** 默认 = 以参考速度正前方前进（u = 1） */
function input(over: Partial<GaitInput> = {}): GaitInput {
  return {
    phase: 0,
    speed: 4,
    moveSpeed: 4,
    localForward: 4,
    localRight: 0,
    legLength: 0.4,
    grounded: true,
    ...over,
  };
}

function strafeSample(localRight: number): { maxR: number; maxL: number; maxPitch: number } {
  let maxR = 0;
  let maxL = 0;
  let maxPitch = 0;
  for (let i = 0; i < 240; i++) {
    const p = solveGait(input({ phase: (i / 240) * TAU, localForward: 0, localRight }), cfg);
    maxR = Math.max(maxR, Math.abs(p.legR.rollZ));
    maxL = Math.max(maxL, Math.abs(p.legL.rollZ));
    maxPitch = Math.max(maxPitch, Math.abs(p.legL.pitchX));
  }
  return { maxR, maxL, maxPitch };
}

describe('v8 程序化步态解算器（Overgrowth 式）', () => {
  it('纯前进：两腿俯仰严格反相、无侧摆、strafe/backward 归零', () => {
    const p = solveGait(input({ phase: 1.1 }), cfg);
    expect(p.strafe).toBeLessThan(1e-6);
    expect(p.backward).toBe(0);
    expect(p.legL.pitchX).toBeCloseTo(-p.legR.pitchX, 10);
    expect(p.legL.rollZ).toBeCloseTo(0, 10);
    expect(p.legR.rollZ).toBeCloseTo(0, 10);
    expect(p.sideLean).toBeCloseTo(0, 10);
  });

  it('纯右移：俯仰归零、侧摆显著、右腿为领先腿且跨步更大、身体侧倾', () => {
    const { maxR, maxL, maxPitch } = strafeSample(4);
    expect(maxPitch).toBeCloseTo(0, 10);          // 侧移时不再前后乱摆
    expect(maxR).toBeGreaterThan(0.15);           // 确实在侧向摆腿
    expect(maxR).toBeGreaterThan(maxL * 1.1);     // 领先腿跨过中线，幅度更大（交叉步）
    const s = solveGait(input({ phase: 0.7, localForward: 0, localRight: 4 }), cfg);
    expect(s.strafe).toBeGreaterThan(0.99);
    expect(Math.abs(s.sideLean)).toBeGreaterThan(0.01);
    expect(Math.abs(s.pelvisX)).toBeGreaterThan(0);
  });

  it('左移与右移：侧摆与身体侧倾符号相反', () => {
    const r = solveGait(input({ phase: 0.4, localForward: 0, localRight: 4 }), cfg);
    const l = solveGait(input({ phase: 0.4, localForward: 0, localRight: -4 }), cfg);
    expect(r.legR.rollZ * l.legR.rollZ).toBeLessThan(0);
    expect(r.sideLean * l.sideLean).toBeLessThan(0);
  });

  it('后退：backward≈1，腿摆与手臂方向整体反转', () => {
    const f = solveGait(input({ phase: 1.1 }), cfg);
    const b = solveGait(input({ phase: 1.1, localForward: -4 }), cfg);
    expect(b.backward).toBeGreaterThan(0.99);
    expect(b.legL.pitchX).toBeCloseTo(-f.legL.pitchX, 10);
    expect(b.armL).toBeCloseTo(-f.armL, 10);
  });

  it('斜向移动：前后轴与左右轴按速度分量混合，两轴都有输出', () => {
    const p = solveGait(input({ phase: 1.0, localForward: 3, localRight: 3 }), cfg);
    expect(p.strafe).toBeCloseTo(0.5, 6);
    expect(Math.abs(p.legL.pitchX)).toBeGreaterThan(0.01);
    expect(Math.abs(p.legL.rollZ)).toBeGreaterThan(0.01);
  });

  it('静止 / 空中：返回完全站直的 idle 姿态', () => {
    const poses = [
      solveGait(input({ speed: 0, localForward: 0, localRight: 0 }), cfg),
      solveGait(input({ grounded: false }), cfg),
    ];
    for (const p of poses) {
      for (const leg of [p.legL, p.legR]) {
        expect(leg.pitchX).toBe(0);
        expect(leg.rollZ).toBe(0);
        expect(leg.kneeX).toBe(0);
      }
      expect(p.pelvisX).toBe(0);
      expect(p.pelvisY).toBe(0);
      expect(p.sideLean).toBe(0);
      expect(p.armL).toBe(0);
      expect(p.strafe).toBe(0);
    }
  });

  it('相位连续：跨两个周期（含 stance→swing 与 2π→0 回绕）无任何跳变', () => {
    let prev = solveGait(input({ phase: 0 }), cfg);
    let maxJump = 0;
    for (let i = 1; i <= 800; i++) {
      const p = solveGait(input({ phase: (i / 400) * TAU }), cfg);
      maxJump = Math.max(
        maxJump,
        Math.abs(p.legL.pitchX - prev.legL.pitchX),
        Math.abs(p.legL.rollZ - prev.legL.rollZ),
        Math.abs(p.legL.kneeX - prev.legL.kneeX),
        Math.abs(p.pelvisY - prev.pelvisY),
        Math.abs(p.armL - prev.armL),
      );
      prev = p;
    }
    // Δphase ≈ 0.0157 rad，正弦曲线的单帧变化应远小于此阈值；
    // 若出现 max/clamp 折点或相位重缩放，这里会立刻爆掉（v7c 抽动回归的教训）。
    expect(maxJump).toBeLessThan(0.04);
  });

  it('脚落地锁定：plantLock 在支撑相中段把脚往身后压（抵消髋部前移）', () => {
    const loose = solveGait(input({ phase: Math.PI / 2 }), { ...cfg, plantLock: 0 });
    const locked = solveGait(input({ phase: Math.PI / 2 }), cfg);
    expect(locked.legL.pitchX).toBeGreaterThan(loose.legL.pitchX + 0.05);
  });

  it('摆幅随速度增大但受 maxAmp 限幅', () => {
    const slow = solveGait(input({ speed: 1, localForward: 1, phase: 0 }), cfg);
    const fast = solveGait(input({ speed: 8, localForward: 8, phase: 0 }), cfg);
    expect(Math.abs(fast.legL.pitchX)).toBeGreaterThan(Math.abs(slow.legL.pitchX) * 2);
    const capped = solveGait(input({ speed: 100, localForward: 100, phase: 0 }), cfg);
    expect(Math.abs(capped.legL.pitchX)).toBeLessThanOrEqual(cfg.maxAmp + 1e-6);
  });
});
