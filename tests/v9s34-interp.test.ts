import { describe, expect, it } from 'vitest';
import { createClock } from '../src/adapters/clock';
import { applyPose, blendPose, canInterpolate, capturePose, lerpAngle } from '../src/adapters/pose-interp';
import type { PoseSnapshot } from '../src/adapters/pose-interp';
import { makeQuietWorld, intent } from './helpers';

/**
 * v9s.34 · 定步长渲染插值。
 *
 * 用户现象：「慢放时动画更新似乎小于渲染帧率」。根因是 Core 固定 60Hz、渲染跟刷新率，
 * 慢放 0.25× 时累加器每 4 个渲染帧才跨过一次 fixedDt —— 模拟只跑 15Hz，画面 60Hz，
 * 于是每 4 帧里有 3 帧是同一姿态。这些用例把「抖动」量化成可断言的数字。
 */

const MOVE = intent({ moveX: 0, moveZ: 1 });

/** 用真实 clock + 真实 World 跑一段，返回渲染侧本该看到的 x 序列。 */
function simulate(opts: {
  frames: number;
  frameHz: number;
  timeScale: number;
  interp: boolean;
}): { xs: number[]; steps: number; alphas: number[] } {
  const world = makeQuietWorld();
  const clock = createClock(world);
  let poseCur: PoseSnapshot = capturePose(world);
  let posePrev: PoseSnapshot | null = null;

  const xs: number[] = [];
  const alphas: number[] = [];
  let steps = 0;

  // 预热：Core 起步时速度从 0 加速，前几帧位置本来就不变（不是抖动），
  // 先跑 40 帧再开始采样，避免把「站着加速」误判成「重复帧」。
  for (let f = 0; f < 40; f++) {
    clock.frame(1 / 60, MOVE, 1, false, () => {
      posePrev = poseCur;
      poseCur = capturePose(world);
    });
  }
  posePrev = poseCur;

  for (let f = 0; f < opts.frames; f++) {
    const n = clock.frame(1 / opts.frameHz, MOVE, opts.timeScale, false, () => {
      posePrev = poseCur;
      poseCur = capturePose(world);
    });
    steps += n;
    const a = clock.alpha;
    alphas.push(a);
    let rendered = world;
    if (opts.interp && posePrev && canInterpolate(posePrev, poseCur) && a < 0.999) {
      rendered = applyPose(world, blendPose(posePrev, poseCur, a));
    }
    xs.push(rendered.character.position.z);
  }
  return { xs, steps, alphas };
}

function plateaus(xs: number[], eps = 1e-9): number {
  let n = 0;
  for (let i = 1; i < xs.length; i++) if (Math.abs(xs[i] - xs[i - 1]) <= eps) n++;
  return n;
}

describe('v9s.34 渲染插值（纯函数）', () => {
  it('最短弧插值跨 ±π 不倒转', () => {
    const a = 3.0;
    const b = -3.0;
    const m = lerpAngle(a, b, 0.5);
    // 直线插值会得到 0（绕远路一整圈）；最短弧应该落在 ±π 附近
    expect(Math.abs(Math.abs(m) - Math.PI)).toBeLessThan(0.2);
    expect(lerpAngle(a, b, 0)).toBeCloseTo(a, 12);
    // 角度等价：结果可以落在 ±π 之外，只要与 b 同余
    const wrap = (x: number): number => Math.atan2(Math.sin(x), Math.cos(x));
    expect(wrap(lerpAngle(a, b, 1) - b)).toBeCloseTo(0, 12);
  });

  it('t=0 / t=1 精确落在两端（插值开关不改变端点）', () => {
    const world = makeQuietWorld();
    const a = capturePose(world);
    for (let i = 0; i < 6; i++) world.character.position.z += 0; // 占位，保持快照语义
    const b = { ...capturePose(world), ch: { ...a.ch, x: a.ch.x + 1, gaitPhase: 1.2 } };
    const o0 = blendPose(a, b, 0);
    const o1 = blendPose(a, b, 1);
    expect(o0.character.position!.x).toBeCloseTo(a.ch.x, 12);
    expect(o1.character.position!.x).toBeCloseTo(b.ch.x, 12);
    expect(o1.character.gaitPhase).toBeCloseTo(1.2, 12);
  });

  it('离散量变化（换阶段 / 换武器 / 卡肉开始）时拒绝插值', () => {
    const world = makeQuietWorld();
    const a = capturePose(world);
    // 同一状态下可以插值
    expect(canInterpolate(a, capturePose(world))).toBe(true);

    world.combat.phase = 'windup';
    expect(canInterpolate(a, capturePose(world))).toBe(false);
    world.combat.phase = 'idle';

    world.combat.weapon = world.combat.weapon === 'greatsword' ? 'staff' : 'greatsword';
    expect(canInterpolate(a, capturePose(world))).toBe(false);
    world.combat.weapon = 'greatsword';

    // 卡肉开始 / 结束也按事件处理：冻结帧不能被插值抹成半速
    world.combat.hitstop = 0.07;
    expect(canInterpolate(a, capturePose(world))).toBe(false);
  });

  it('慢放 0.25× 时：不插值每 4 帧才动一次，插值后每帧都在动', () => {
    const off = simulate({ frames: 60, frameHz: 60, timeScale: 0.25, interp: false });
    const on = simulate({ frames: 60, frameHz: 60, timeScale: 0.25, interp: true });

    // 两种口径的模拟步数必须完全一致（插值只是渲染，不改 Core）
    expect(on.steps).toBe(off.steps);
    // 60 帧 × (1/60)s × 0.25 ≈ 0.25s → 约 15 步（浮点累加落在 14~15）
    expect(off.steps).toBeGreaterThanOrEqual(14);
    expect(off.steps).toBeLessThanOrEqual(15);

    const offStill = plateaus(off.xs, 1e-9);
    const onStill = plateaus(on.xs, 1e-9);
    // 旧行为：约 3/4 的帧是重复画面
    expect(offStill).toBeGreaterThan(35);
    // 插值后：几乎每帧都有位移
    expect(onStill).toBeLessThan(3);

    // 插值不能造假位移：总位移与不插值时一致（差值不超过「一步」的量，一个模拟步的滞后是设计代价）
    let stepMove = 0;
    for (let i = 1; i < off.xs.length; i++) stepMove = Math.max(stepMove, Math.abs(off.xs[i] - off.xs[i - 1]));
    const dOff = off.xs[off.xs.length - 1] - off.xs[0];
    const dOn = on.xs[on.xs.length - 1] - on.xs[0];
    expect(stepMove).toBeGreaterThan(0);
    expect(Math.abs(dOn - dOff)).toBeLessThan(stepMove * 1.2);
  });

  it('高刷（120Hz）下：60Hz 步进不再出现「连续两帧一模一样」', () => {
    const off = simulate({ frames: 80, frameHz: 120, timeScale: 1, interp: false });
    const on = simulate({ frames: 80, frameHz: 120, timeScale: 1, interp: true });
    expect(plateaus(off.xs)).toBeGreaterThan(30);
    expect(plateaus(on.xs)).toBeLessThan(3);
  });

  it('单帧位移有界：插值不产生「跳跃」（相邻帧位移 <= 一步的位移）', () => {
    const on = simulate({ frames: 90, frameHz: 60, timeScale: 1, interp: true });
    let maxD = 0;
    for (let i = 1; i < on.xs.length; i++) maxD = Math.max(maxD, Math.abs(on.xs[i] - on.xs[i - 1]));
    const perFrame = 4.2 / 60; // 满速移动 4.2 m/s，一步最多 0.07m
    expect(maxD).toBeLessThan(perFrame * 1.35);
  });

  it('applyPose 不改原 World（渲染替身是纯拷贝）', () => {
    const world = makeQuietWorld();
    const a = capturePose(world);
    world.character.position.z += 1;
    world.dummies[0].position.x += 1;
    const b = capturePose(world);
    const snapshot = JSON.stringify(world);

    const fake = applyPose(world, blendPose(a, b, 0.5));
    expect(fake.character.position.z).toBeCloseTo((a.ch.z + b.ch.z) / 2, 6);
    expect(fake.dummies[0].position.x).toBeCloseTo((a.dm[0].x + b.dm[0].x) / 2, 6);
    // 原 World 一个字段都不许变
    expect(JSON.stringify(world)).toBe(snapshot);
  });
});
