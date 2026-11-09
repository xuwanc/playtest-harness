import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { slewHipTarget, turnSpinGate, SPIN_RATE_START, SPIN_RATE_FULL } from '../src/presentation/gait';
import { makeWorld, intent, run } from './helpers';
import type { AppConfig, World } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const DT = 1 / 60;
const DEG = 180 / Math.PI;
const rad = (d: number): number => (d * Math.PI) / 180;

/** 速度方向固定（一直往 −Z 跑），把 bodyYaw 在 sec 秒内扫过 sweepRad */
function sweepTrace(rateDeg: number, sweepRad: number, sec: number, frames = 76) {
  const w: World = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, { ...raw.view.gait, hipYawTrackRateDeg: rateDeg },
    raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
  );
  // 预热：速度沿身体正前方跑起来，同时把 bodyYaw 钉在 0（否则扫描起点会有一次
  // 「bodyYaw 从注视朝向瞬移到 0」的伪跳变，量到的不是我们要测的东西）
  for (let i = 0; i < 40; i++) {
    run(w, 1, intent({ moveZ: -1 }));
    w.character.bodyYaw = 0;
    rig.update(w.character, w.combat, w.playerHurt, DT, false, w.time);
  }
  const t0 = w.time;
  const hip: number[] = [];
  for (let i = 0; i < frames; i++) {
    run(w, 1, intent({ moveZ: -1 }));
    const p = Math.min(1, (w.time - t0) / sec);
    w.character.bodyYaw = sweepRad * (p * p * (3 - 2 * p));
    rig.update(w.character, w.combat, w.playerHurt, DT, false, w.time);
    hip.push(rig.gaitDebug().hipYaw);
  }
  return hip;
}

function span(a: number[]): number {
  return Math.max(...a) - Math.min(...a);
}

function maxStep(a: number[]): number {
  let m = 0;
  for (let i = 1; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - a[i - 1]));
  return m;
}

describe('v9s.44 · 朝向切换时下盘不整体晃一下', () => {
  /**
   * 现象：一边跑一边让身体转向（锁定目标切换 / 攻击锁朝向 / 拖拽瞄准）时，下盘整体
   * 晃一下 —— 腿先朝一侧拧过去再拧回来。
   *
   * 根因：下盘偏转目标有两个「族」——侧移族（+50°）与后退族（θ−180°，θ=132° 时
   * −48°），身体转动时 θ 连续扫过 90°→132°，目标只能跳族：实测单帧跳 52.7°、
   * 整体跨度 104°，hipYaw 平滑跟不上 → 单帧 13°（775°/s）、整体摆幅 54°~78°。
   */
  it('限速门控：不转身按 maxRate 推进，纯转身冻结（v9s.45 起不再「不限速」）', () => {
    const maxRate = rad(200);
    // 没在转身：按 maxRate 推进（v9s.45 去掉了 free·3400°/s 的逃生口 ——
    // 「半开」时几乎不限速，正是慢放抖一下的来源）
    expect(slewHipTarget(0, 1, maxRate, DT, 0)).toBeCloseTo(maxRate * DT, 9);
    expect(slewHipTarget(0, 1, maxRate, DT, turnSpinGate(rad(10))))
      .toBeCloseTo(maxRate * DT, 9);
    // 只有把限速关掉（maxRate = 0）才一步到位
    expect(slewHipTarget(0, 1, 0, DT, 0)).toBe(1);
    // 纯转身：目标冻住（下盘随身体刚性转，一点都不自己拧）
    expect(slewHipTarget(0, 1, maxRate, DT, 1)).toBe(0);
    // 中间角速度：目标还能动，但明显慢于「不转身」
    const mid = slewHipTarget(0, 1, maxRate, DT, 0.5);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
    // 闸门本身：< START 为 0，> FULL 为 1
    expect(turnSpinGate(SPIN_RATE_START * 0.99)).toBe(0);
    expect(turnSpinGate(SPIN_RATE_FULL * 1.01)).toBe(1);
    // 关掉 / dt = 0
    expect(slewHipTarget(0, 1, 0, DT, 1)).toBe(1);
    expect(slewHipTarget(0, 1, maxRate, 0, 1)).toBe(0);
  });

  it('被限速的目标不会过冲，也不会在到位后抖动', () => {
    let v = 0;
    const target = 0.9;
    for (let i = 0; i < 120; i++) {
      const next = slewHipTarget(v, target, rad(200), DT, 0.5);
      expect(next).toBeGreaterThanOrEqual(v);
      expect(next).toBeLessThanOrEqual(target + 1e-12);
      v = next;
    }
    expect(v).toBeCloseTo(target, 12);
  });

  it('0.5s 转 180°：单帧 ≤ 5°、整体跨度 ≤ 40°、不再反向拧（旧 13° / 54° / −29°）', () => {
    const legacy = sweepTrace(0, Math.PI, 0.5);
    const fixed = sweepTrace(200, Math.PI, 0.5);

    // 旧路径确实会「甩」：单帧 13° 级别、反向拧到 −25° 以下
    expect(maxStep(legacy) * DEG).toBeGreaterThan(10);
    expect(Math.min(...legacy) * DEG).toBeLessThan(-20);
    expect(span(legacy) * DEG).toBeGreaterThan(45);

    // 限速后：速度上限 ≈ maxRate × dt（200°/s × 1/60 = 3.3°），整体不再反向
    expect(maxStep(fixed) * DEG).toBeLessThan(5);
    expect(span(fixed) * DEG).toBeLessThan(40);
    expect(Math.min(...fixed) * DEG).toBeGreaterThan(-6);
    // 转完要归零，不能留偏转
    expect(Math.abs(fixed[fixed.length - 1]) * DEG).toBeLessThan(1.5);
  });

  it('1s 慢转：允许跟着扫（这是真转身），但单帧仍然是「平滑」量级', () => {
    const fixed = sweepTrace(200, Math.PI, 1.0);
    expect(maxStep(fixed) * DEG).toBeLessThan(5);
    expect(Math.abs(fixed[fixed.length - 1]) * DEG).toBeLessThan(2);
  });

  it('把限速拉到 0 精确回到旧行为（A/B 开关有效）', () => {
    const a = sweepTrace(0, Math.PI, 0.5);
    const b = sweepTrace(0, Math.PI, 0.5);
    expect(a).toEqual(b);
    expect(maxStep(a) * DEG).toBeGreaterThan(10);
  });
});
