import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { Intents, World } from '../src/core';
import { intent, makeWorld } from './helpers';

const TAU = Math.PI * 2;

/** 把「可能取模回绕」的相位差还原成连续增量：跨 0 加一圈，倒退则保持为负。 */
function unwrapDelta(prev: number, cur: number): number {
  let d = cur - prev;
  if (d < -Math.PI) d += TAU;
  return d;
}

/** 逐帧采样 gaitPhase。 */
function sample(w: World, frames: number, i: Intents): number[] {
  const out: number[] = [];
  for (let k = 0; k < frames; k++) {
    step(w, w.config.fixedDt, i);
    out.push(w.character.gaitPhase);
  }
  return out;
}

describe('步态相位（v7c 修复「步频抽动」）', () => {
  /**
   * 旧实现用「累积总里程 / 当前帧动态步幅」重算相位：速度一变，分母就变，
   * 整段历史相位被重新缩放甚至倒退 → 腿/手臂抽动，低速时最明显。
   * 新实现为增量累加，相位必须连续、单调不回退、每帧增量有界。
   */
  it('起步 / 加速 / 冲刺 / 刹停 / 反向时相位连续且不回退', () => {
    const w = makeWorld();
    let phases: number[] = [w.character.gaitPhase];
    const push = (n: number, i: Intents): void => {
      phases = phases.concat(sample(w, n, i));
    };
    push(10, intent());                                  // 静止
    push(60, intent({ moveZ: -1 }));                       // 常速前进（加速段，朝 -Z 远离边界）
    push(60, intent({ moveZ: -1, sprintHeld: true }));     // 冲刺（速度突变）
    push(60, intent());                                    // 松手刹停
    push(60, intent({ moveZ: 1 }));                        // 反向起步

    for (let k = 1; k < phases.length; k++) {
      const d = unwrapDelta(phases[k - 1], phases[k]);
      expect(d, `帧 ${k} 相位倒退/跳变`).toBeGreaterThanOrEqual(-1e-9);
      expect(d, `帧 ${k} 单帧推进量异常`).toBeLessThan(TAU * 0.25);
    }
    // 相位取模，始终落在 [0, TAU)
    for (const p of phases) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(TAU);
    }
  });

  it('相位每帧推进量随速度平滑变化，无相邻帧突变', () => {
    const w = makeWorld();
    const phases = sample(w, 120, intent({ moveZ: -1, sprintHeld: true }));
    const ds: number[] = [];
    for (let k = 1; k < phases.length; k++) ds.push(unwrapDelta(phases[k - 1], phases[k]));
    // 加速段每帧增量逐步变大；跳过初始静止的 0 增量后，相邻比值应有界（不抽动）
    for (let k = 1; k < ds.length; k++) {
      const a = ds[k - 1];
      const b = ds[k];
      if (a < 1e-4) continue;
      expect(b / a).toBeLessThan(1.6);
    }
  });

  it('高速步频不被过度压低，也不随速度线性飙升', () => {
    // 稳态步频：预热到速度稳定后，测单位时间的相位推进量（rad/s，正比于步频）
    const measure = (i: Intents): number => {
      const w = makeWorld();
      // 预热到速度稳态即可（指数加速 rate=16，30 帧残余 <0.1%），
      // 窗口务必短，避免冲刺跑到世界边界后位移被 clamp 成 0
      for (let k = 0; k < 30; k++) step(w, w.config.fixedDt, i);
      let prev = w.character.gaitPhase;
      let acc = 0;
      const frames = 40;
      for (let k = 0; k < frames; k++) {
        step(w, w.config.fixedDt, i);
        acc += unwrapDelta(prev, w.character.gaitPhase);
        prev = w.character.gaitPhase;
      }
      return acc / (frames * w.config.fixedDt);
    };
    const low = measure(intent({ moveZ: -1 }));
    const high = measure(intent({ moveZ: -1, sprintHeld: true }));
    const ratio = high / low;
    // 冲刺更快（没被压到持平或更慢）
    expect(ratio).toBeGreaterThan(1.05);
    // 但比「固定步幅 → 步频线性跟随速度」要慢（步幅确实变大了）
    expect(ratio).toBeLessThan(makeWorld().config.sprintMultiplier * 0.95);
  });

  it('v9e 步幅写入状态，且一个步态周期的里程正好等于 stride（相位与步幅严格配套）', () => {
    const w = makeWorld();
    const i = intent({ moveZ: -1 });
    for (let k = 0; k < 40; k++) step(w, w.config.fixedDt, i);  // 预热到速度稳态
    const stride = w.character.stride;
    const cfg = w.config;
    const u = Math.min(cfg.strideSpeedCap, Math.hypot(w.character.velocity.x, w.character.velocity.z) / cfg.moveSpeed);
    expect(stride).toBeCloseTo(cfg.strideLength * (1 + u * cfg.strideSpeedGain), 6);

    const z0 = w.character.position.z;
    let acc = 0;
    let prev = w.character.gaitPhase;
    let frames = 0;
    while (acc < Math.PI * 2 - 0.25 && frames < 600) {
      step(w, w.config.fixedDt, i);
      acc += unwrapDelta(prev, w.character.gaitPhase);
      prev = w.character.gaitPhase;
      frames += 1;
    }
    const dist = Math.abs(w.character.position.z - z0);
    // 走了 acc 个周期 → 里程应为 acc/TAU × stride
    expect(dist / (acc / (Math.PI * 2))).toBeCloseTo(stride, 1);
  });

  it('步幅增益参数生效：gain=0 时高速步频按速度比线性增长', () => {
    const measureWithGain = (gain: number, i: Intents): number => {
      const w = makeWorld();
      w.config.strideSpeedGain = gain;
      for (let k = 0; k < 30; k++) step(w, w.config.fixedDt, i);
      let prev = w.character.gaitPhase;
      let acc = 0;
      const frames = 40;
      for (let k = 0; k < frames; k++) {
        step(w, w.config.fixedDt, i);
        acc += unwrapDelta(prev, w.character.gaitPhase);
        prev = w.character.gaitPhase;
      }
      return acc / (frames * w.config.fixedDt);
    };
    const low = measureWithGain(0, intent({ moveZ: -1 }));
    const high = measureWithGain(0, intent({ moveZ: -1, sprintHeld: true }));
    // gain=0 就是固定步幅，步频严格正比于速度
    expect(high / low).toBeCloseTo(makeWorld().config.sprintMultiplier, 1);
  });
});
