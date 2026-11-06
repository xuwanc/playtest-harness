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

const legLen = 0.4;

/** 与 movement.ts 完全一致的步幅公式（strideLength × (1 + min(cap, u) × gain)） */
function strideFor(speed: number, moveSpeed = 4): number {
  const core = raw.core;
  const u = Math.min(core.strideSpeedCap, speed / Math.max(moveSpeed, 1e-6));
  return core.strideLength * (1 + u * core.strideSpeedGain);
}

/** 默认 = 以参考速度正前方前进（u = 1），步幅按 Core 公式给出 */
function input(over: Partial<GaitInput> = {}): GaitInput {
  const speed = over.speed ?? 4;
  const moveSpeed = over.moveSpeed ?? 4;
  return {
    phase: 0,
    speed,
    moveSpeed,
    localForward: speed,
    localRight: 0,
    legLength: legLen,
    stride: strideFor(speed, moveSpeed),
    grounded: true,
    ...over,
  };
}

/**
 * 支撑相内「脚在世界坐标的前后位移」逐帧最大值（米 / 帧）。
 * 世界坐标下的支撑脚应当静止 —— 这就是「不滑步」的量化定义。
 */
function stanceSlip(speed: number, plantLock: number): number {
  const c = { ...cfg, plantLock };
  const dt = 1 / 60;
  const stride = strideFor(speed);
  const dp = (TAU * speed * dt) / stride; // 一帧推进的相位
  const bodyStep = speed * dt;            // 一帧身体前进的距离
  let prev = Number.NaN;
  let max = 0;
  let body = 0;
  for (let p = dp; p < Math.PI; p += dp) {
    const pose = solveGait(input({ phase: p, speed, localForward: speed, stride }), c);
    // 脚相对髋的前后偏移 = -legLen·sin(髋俯仰)，与骨架实际渲染一致
    const foot = body - legLen * Math.sin(pose.legL.pitchX);
    if (Number.isFinite(prev)) max = Math.max(max, Math.abs(foot - prev));
    prev = foot;
    body += bodyStep;
  }
  return max;
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
  it('纯前进：两腿交替（一前脚一后脚）、无侧摆、strafe/backward 归零', () => {
    const p = solveGait(input({ phase: 1.1 }), cfg);
    expect(p.strafe).toBeLessThan(1e-6);
    expect(p.backward).toBe(0);
    // v9e：支撑相改成线性后，两腿不再严格镜像（摆动腿离地后有跟随过冲），
    // 但必须保持「一前脚一后脚」交替；幅度差控制在 1 倍以内，不会出现双腿同向。
    expect(p.legL.pitchX * p.legR.pitchX).toBeLessThan(0);
    const ratio = Math.abs(p.legL.pitchX) / Math.abs(p.legR.pitchX);
    expect(ratio).toBeGreaterThan(0.4);
    expect(ratio).toBeLessThan(2.5);
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

  it('v9e 零滑步：plantLock=1 时支撑脚的世界位移恒为 0（低速 / 常速 / 高速）', () => {
    // 走路 / 慢走 / 小跑都必须严格零滑步（用户反馈的就是低速滑步）
    for (const speed of [0.6, 1.2, 2, 4, 4.8]) {
      const slip = stanceSlip(speed, 1);
      expect(slip, `${speed} m/s 支撑脚仍在滑：${(slip * 1000).toFixed(4)} mm/帧`).toBeLessThan(1e-6);
    }
  });

  it('v9e 冲刺（腿已到可达极限）才允许拖步，且量级有界', () => {
    // 7.35 m/s 时解析需要 0.4525m 前伸 > 腿长 0.4m，几何上不可能零滑步；
    // 这里只要求滑动明显小于旧的余弦曲线，且不外推到失控。
    const sprint = stanceSlip(7.35, 1);
    const oldSprint = stanceSlip(7.35, 0);
    // 已知限制：冲刺段前伸被几何上限钳制 → 存在约 20% 体速的蹬地拖步（<< 旧曲线的滑移量）
    expect(sprint).toBeLessThan(oldSprint);
    expect(sprint).toBeLessThan(0.03);
  });

  it('v9e 对照：旧的余弦曲线（plantLock=0）低速明显滑步，滑动量随速度增大', () => {
    const slow = stanceSlip(0.6, 0);
    const walk = stanceSlip(4, 0);
    expect(slow).toBeGreaterThan(0.002);   // 0.6 m/s 每帧仍滑 >2mm
    expect(walk).toBeGreaterThan(slow);    // 速度越快滑动越大
  });

  it('v9e 脚前伸距离 = 步幅 / 4（支撑相脚与身体等速后退的解析条件）', () => {
    // 相位 0 时脚在最前，前伸量应正好等于 stride × reachRatio
    for (const speed of [0.6, 1, 4]) {
      const stride = strideFor(speed);
      const pose = solveGait(input({ phase: 0, speed, localForward: speed, stride }), cfg);
      const reach = -legLen * Math.sin(pose.legL.pitchX);
      expect(reach).toBeCloseTo(stride * cfg.reachRatio, 6);
    }
    expect(cfg.reachRatio).toBeCloseTo(0.25, 6);
  });

  it('v9e 冲刺段：腿已到可达极限，前伸被 maxAmp 钳制（此时才允许少量拖步）', () => {
    const speed = 7.35;
    const stride = strideFor(speed);
    const pose = solveGait(input({ phase: 0, speed, localForward: speed, stride }), cfg);
    const reach = -legLen * Math.sin(pose.legL.pitchX);
    const maxFoot = legLen * Math.sin(Math.min(cfg.maxAmp, 1.25));
    // 解析需要的 0.4525m 超过腿长可达，钳到 0.390m：渲染上是「蹬地拖步」而不是腿穿模
    expect(reach).toBeLessThan(stride * cfg.reachRatio);
    expect(reach).toBeCloseTo(maxFoot, 6);
  });

  it('摆幅随速度增大（步幅变大 → 脚前伸更远）', () => {
    const slow = solveGait(input({ speed: 1, localForward: 1, phase: 0 }), cfg);
    const fast = solveGait(input({ speed: 8, localForward: 8, phase: 0 }), cfg);
    expect(Math.abs(fast.legL.pitchX)).toBeGreaterThan(Math.abs(slow.legL.pitchX) * 1.3);
  });

  it('拿不到步幅的回退路径（攻击等效驱动）仍受 maxAmp 限幅', () => {
    const capped = solveGait(input({ speed: 100, localForward: 100, stride: 0, phase: 0 }), cfg);
    expect(Math.abs(capped.legL.pitchX)).toBeLessThanOrEqual(cfg.maxAmp + 1e-6);
    const normal = solveGait(input({ speed: 100, localForward: 100, phase: 0 }), cfg);
    expect(Math.abs(normal.legL.pitchX)).toBeLessThanOrEqual(cfg.maxAmp + 1e-6);
  });
});
