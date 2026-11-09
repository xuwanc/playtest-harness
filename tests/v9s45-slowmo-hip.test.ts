import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import {
  slewGate, slewHipTarget, hipTrackRate, hipFlipWeight, turnSpinGate,
  SPIN_RISE_SEC, SPIN_FALL_SEC,
} from '../src/presentation/gait';
import { makeQuietWorld, intent, run } from './helpers';
import type { AppConfig, World } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const DT = 1 / 60;
const DEG = 180 / Math.PI;
const rad = (d: number): number => (d * Math.PI) / 180;

describe('v9s.45 · 慢放 / 低帧下下盘不许再抖一下', () => {
  /**
   * 现象：v9s.44 之后常速已经干净，但**慢放**（timeScale 0.25×）回看时下盘还会抽一下。
   *
   * 根因不是公式，是**时间基准**：闸门用「渲染帧 dt」算身体角速度，慢放时身体转过
   * 同样角度要多花 4 倍真实时间 → 角速度只有常速的 1/4 → 闸门从「全关」变成「半开」；
   * 而 v9s.44 的限速率是 `free·(maxRate + free·3400°/s)`，free=0.5 时还有 ~950°/s，
   * 于是半开的那几帧目标一帧能蹿 18~24°，肉眼就是「抖一下」。
   */
  it('闸门是一阶状态：上升 / 下降都按固定斜率，不会一帧跳变', () => {
    // 上升：0 → 1 需要 SPIN_RISE_SEC
    let v = 0;
    const riseSteps = Math.ceil(SPIN_RISE_SEC / DT);
    for (let i = 0; i < riseSteps; i++) v = slewGate(v, 1, DT);
    expect(v).toBeCloseTo(1, 6);
    // 一步只走 1/N，不是直接到位
    expect(slewGate(0, 1, DT)).toBeCloseTo(DT / SPIN_RISE_SEC, 6);

    // 下降更慢：0.22s 才放完
    let d = 1;
    for (let i = 0; i < Math.ceil(SPIN_FALL_SEC / DT); i++) d = slewGate(d, 0, DT);
    expect(d).toBeCloseTo(0, 6);
    expect(slewGate(1, 0, DT)).toBeGreaterThan(0.9);
  });

  it('限速率与「放行程度」线性挂钩（不再有 free·3400°/s 的逃生口）', () => {
    const maxRate = rad(240);
    // 半开：一步最多 maxRate × 0.5 × dt
    const half = slewHipTarget(0, 1, maxRate, DT, 0.5);
    expect(half).toBeCloseTo(maxRate * 0.5 * DT, 6);
    expect(half * DEG).toBeLessThan(2.1);          // 旧版这里是 ~8°（950°/s × 1/60）
    // 全开：正好 maxRate
    expect(slewHipTarget(0, 1, maxRate, DT, 0)).toBeCloseTo(maxRate * DT, 6);
    // 冻结
    expect(slewHipTarget(0.3, 1, maxRate, DT, 1)).toBe(0.3);
  });

  it('前 / 后相位各一档限速', () => {
    expect(hipTrackRate(rad(240), rad(150), 1)).toBeCloseTo(rad(240), 9);
    expect(hipTrackRate(rad(240), rad(150), 0)).toBeCloseTo(rad(150), 9);
    expect(hipTrackRate(rad(240), rad(150), 0.5)).toBeCloseTo(rad(195), 9);
    // 任一为 0 = 关掉限速（A/B 开关）
    expect(hipTrackRate(0, rad(150), 0.5)).toBe(0);
    // 相位权重：backKeep 幂等 + 转身闸门把权重压回侧移族
    expect(hipFlipWeight(1)).toBeCloseTo(1, 9);
    expect(hipFlipWeight(0)).toBeCloseTo(0, 9);
    expect(hipFlipWeight(0, 1)).toBeCloseTo(1, 9);
    expect(hipFlipWeight(0.5)).toBeCloseTo(0.25, 9);
  });

  /**
   * 关键回归：**同一段游戏时间、不同播放倍率**，下盘轨迹必须一致。
   *
   * 「慢放」在这里的等价物 = 一次渲染跨多个固定步（软件渲染 13fps 就是这个情形，
   * timeScale<1 时更极端）。旧实现用渲染 dt 算角速度，跨 4 步时角速度读数只有 1/4，
   * 闸门半开、目标被放行 —— 轨迹与常速完全对不上。
   */
  it('慢放（一帧跨 4 步）与常速的下盘轨迹逐帧一致', () => {
    const fast = sweepTrace(1);
    const slow = sweepTrace(4);
    expect(fast.length).toBe(76);
    expect(slow.length).toBe(19);
    let worst = 0;
    for (let i = 0; i < slow.length; i++) {
      worst = Math.max(worst, Math.abs(slow[i] - fast[i * 4]));
    }
    expect(worst * DEG).toBeLessThan(1.0);
  });
});

/** 速度一直往 −Z 跑，把 bodyYaw 在 0.5s 内 smoothstep 扫过 180°。
 *  `stepsPerFrame` = 一次渲染跨多少个固定步（= 1 / timeScale 的低帧等价物）。 */
function sweepTrace(stepsPerFrame: number): number[] {
  const w: World = makeQuietWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait,
    raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
  );
  const intentZ = intent({ moveZ: -1 });
  for (let i = 0; i < 40; i++) {
    run(w, stepsPerFrame, intentZ);
    w.character.bodyYaw = 0;
    rig.update(w.character, w.combat, w.playerHurt, DT * stepsPerFrame, false, w.time);
  }
  const t0 = w.time;
  const hip: number[] = [];
  const frames = Math.round(76 / stepsPerFrame);
  for (let i = 0; i < frames; i++) {
    run(w, stepsPerFrame, intentZ);
    const p = Math.min(1, (w.time - t0) / 0.5);
    w.character.bodyYaw = Math.PI * (p * p * (3 - 2 * p));
    rig.update(w.character, w.combat, w.playerHurt, DT * stepsPerFrame, false, w.time);
    hip.push(rig.gaitDebug().hipYaw);
  }
  return hip;
}

describe('v9s.45 · 真实骨架：慢放不抖', () => {
  it('慢放轨迹里没有单帧跳变，也没有「先拧出去再拧回来」', () => {
    const slow = sweepTrace(4);
    let step = 0;
    for (let i = 1; i < slow.length; i++) step = Math.max(step, Math.abs(slow[i] - slow[i - 1]));
    // 一帧 = 4 个固定步，按 240°/s 上限也就是 16°；实测应远小于此
    expect(step * DEG).toBeLessThan(6);
    // 反向段（负角）不超过 −6°：转身途中不该再把胯拖到后退族的 −48°
    expect(Math.min(...slow) * DEG).toBeGreaterThan(-6);
    // 转完回到 0
    expect(Math.abs(slow[slow.length - 1]) * DEG).toBeLessThan(1.5);
  });

  it('纯侧移稳态仍会带转下盘（限速不能把正常偏转削平）', () => {
    const w = makeQuietWorld();
    w.modules.dummies = false;
    w.modules.targeting = false;
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed,
      raw.view.orientation, raw.view.gait,
      raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
    );
    const a = intent({ moveX: 1, aimActive: true, aimX: 0, aimZ: 1 });
    for (let i = 0; i < 60; i++) {
      run(w, 1, a);
      rig.update(w.character, w.combat, w.playerHurt, DT, false, w.time);
    }
    expect(rig.gaitDebug().hipYaw * DEG).toBeGreaterThan(20);
  });
});
