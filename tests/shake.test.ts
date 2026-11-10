import { describe, expect, it } from 'vitest';
import { createCameraRig } from '../src/presentation/camera-rig';
import {
  SHAKE_PRESETS, classifyImpact, impactTrauma, shakeOffset, smoothNoise1D,
} from '../src/presentation/shake';
import { CONFIG, makeWorld } from './helpers';

function rig() {
  return createCameraRig(
    CONFIG.view.camera, CONFIG.view.smartCamera, CONFIG.view.zoom, 16 / 9,
  );
}

describe('v9s.x 镜头震动：trauma 模型 + 按冲击类型分档', () => {
  it('平滑噪声确定性、有界且帧间连续（不逐帧随机 → 不像掉帧）', () => {
    expect(smoothNoise1D(3.27, 2)).toBe(smoothNoise1D(3.27, 2));
    for (let i = 0; i < 200; i++) {
      const v = smoothNoise1D(i * 0.031, 1);
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
    // 相邻 1/60s 采样不会跳变（value noise + smoothstep 的本质）
    for (let i = 0; i < 100; i++) {
      const a = smoothNoise1D(i / 60, 0);
      const b = smoothNoise1D((i + 1) / 60, 0);
      expect(Math.abs(b - a)).toBeLessThan(0.5);
    }
  });

  it('幅度按 trauma² 整形：trauma 减半，幅度降到 1/4', () => {
    const p = SHAKE_PRESETS.impact;
    const full = shakeOffset(0.8, p, 0.37);
    const half = shakeOffset(0.4, p, 0.37);
    expect(half.x).toBeCloseTo(full.x / 4, 8);
    expect(half.y).toBeCloseTo(full.y / 4, 8);
    expect(half.z).toBeCloseTo(full.z / 4, 8);
    const zero = shakeOffset(0, p, 3.1);
    expect(zero.x).toBeCloseTo(0, 10);
    expect(zero.y).toBeCloseTo(0, 10);
    expect(zero.z).toBeCloseTo(0, 10);
  });

  it('三轴相位错开，不会同步来回摆（机械感的来源）', () => {
    const o = shakeOffset(1, SHAKE_PRESETS.heavy, 0.41);
    expect(Math.abs(o.x - o.y)).toBeGreaterThan(1e-6);
    expect(Math.abs(o.y - o.z)).toBeGreaterThan(1e-6);
  });

  it('波形帧间连续：60fps 下相邻帧位移差远小于峰值幅度', () => {
    const p = SHAKE_PRESETS.heavy;
    let prev = shakeOffset(0.8, p, 0);
    let maxJump = 0;
    for (let i = 1; i <= 60; i++) {
      const cur = shakeOffset(0.8, p, i / 60);
      maxJump = Math.max(maxJump, Math.hypot(cur.x - prev.x, cur.y - prev.y, cur.z - prev.z));
      prev = cur;
    }
    // 旧版 ~11~19Hz 正弦每帧都会大幅换向；新实现低频主导，相邻帧几乎不动
    expect(maxJump).toBeLessThan(p.amplitude * 0.5);
  });

  it('分档单调：越重的冲击幅度更大、频率更低、余震更长', () => {
    expect(SHAKE_PRESETS.heavy.amplitude).toBeGreaterThan(SHAKE_PRESETS.light.amplitude);
    expect(SHAKE_PRESETS.slam.freq).toBeLessThan(SHAKE_PRESETS.heavy.freq);
    expect(SHAKE_PRESETS.heavy.freq).toBeLessThan(SHAKE_PRESETS.light.freq);
    expect(SHAKE_PRESETS.slam.decay).toBeLessThan(SHAKE_PRESETS.light.decay);
    expect(SHAKE_PRESETS.slam.detailWeight).toBeGreaterThan(SHAKE_PRESETS.light.detailWeight);
    // 所有档位都用 trauma² 整形，且都有确定衰减
    for (const p of Object.values(SHAKE_PRESETS)) {
      expect(p.power).toBe(2);
      expect(p.decay).toBeGreaterThan(0);
    }
  });

  it('classifyImpact：玩家受击 / 轻击 / 重击 / 击飞各有不同档位', () => {
    const w = makeWorld();
    w.combat.weapon = 'sword-shield';
    expect(classifyImpact(w, 0.45)).toBe('light');
    expect(classifyImpact(w, 0.55)).toBe('impact');
    expect(classifyImpact(w, 0.65)).toBe('heavy');
    expect(classifyImpact(w, 0.9)).toBe('slam');
    w.playerHurt.type = 'heavy';
    expect(classifyImpact(w, 0.9)).toBe('hurt'); // 自己挨打优先
    w.playerHurt.type = 'none';
    w.combat.weapon = 'dual-swords';
    expect(classifyImpact(w, 0.55)).toBe('light');
    w.combat.weapon = 'greatsword';
    expect(classifyImpact(w, 0.55)).toBe('heavy');
  });

  it('impactTrauma 保持旧版 0.34..0.82 区间（读数与既有验收一致）', () => {
    expect(impactTrauma(0)).toBeCloseTo(0.34, 6);
    expect(impactTrauma(1)).toBeCloseTo(0.82, 6);
    expect(impactTrauma(2)).toBeCloseTo(0.82, 6); // 超界 clamp
  });

  it('addShake：同类连续命中取最大不累加，更强冲击仍可覆盖', () => {
    const c = rig();
    expect(c.shakeLevel()).toBe(0);
    c.addShake(0.4, 'light');
    expect(c.shakeLevel()).toBeCloseTo(0.4, 6);
    c.addShake(0.4, 'light'); // 60ms 内、不更强 → 忽略（一刀多帧不叠成蜂鸣）
    expect(c.shakeLevel()).toBeCloseTo(0.4, 6);
    c.addShake(0.9, 'light'); // 更强 → 覆盖
    expect(c.shakeLevel()).toBeCloseTo(0.9, 6);
  });

  it('addShake：按档位切换波形参数，重击余震更长', () => {
    const c = rig();
    c.addShake(0.5, 'light');
    expect(c.shakeKind()).toBe('light');
    expect(c.shakePreset().freq).toBe(SHAKE_PRESETS.light.freq);
    c.addShake(0.5, 'slam'); // 不同类型不受 60ms 闸门限制
    expect(c.shakeKind()).toBe('slam');
    expect(c.shakePreset().freq).toBe(SHAKE_PRESETS.slam.freq);
    expect(c.shakePreset().decay).toBeLessThan(SHAKE_PRESETS.light.decay);
  });

  it('trauma 线性衰减到 0，自己收尾不残留', () => {
    const c = rig();
    c.addShake(0.4, 'light');
    const decay = c.shakePreset().decay;
    c.update(0, 0, 0, 1 / 60);
    expect(c.shakeLevel()).toBeCloseTo(0.4 - decay / 60, 5);
    for (let i = 0; i < 120; i++) c.update(0, 0, 0, 1 / 60);
    expect(c.shakeLevel()).toBe(0);
  });
});
