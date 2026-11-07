import { describe, expect, it } from 'vitest';
import { wrapAngle, gazeUpdate, orientationUpdate, step } from '../src/core';
import { makeWorld, intent } from './helpers';

const DT = 1 / 60;
const DEG = Math.PI / 180;

type Mode = 'idle' | 'wander' | 'follow' | 'keep-distance' | 'attack';
type Phase = 'idle' | 'windup' | 'active' | 'recovery';

/**
 * 把全部假人推到远处（出威胁范围），再按 specs 摆回指定假人。
 * 默认 4 个假人初始都在威胁范围内，不清除会污染隔离测试。
 */
function placeOnly(
  w: ReturnType<typeof makeWorld>,
  specs: Array<[i: number, x: number, z: number, mode?: Mode, phase?: Phase]>,
): void {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = 100;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  for (const [i, x, z, mode = 'attack', phase = 'idle'] of specs) {
    const d = w.dummies[i];
    d.position.x = x;
    d.position.z = z;
    d.mode = mode;
    d.attackPhase = phase;
  }
}

const AIM = intent({ aimActive: true, aimX: 0, aimZ: 1 });

/**
 * 与 gaze.ts 的 weightOf（threatRange 口径）完全一致的本地镜像：用真实 config 计算期望权重，
 * 避免手写近似（0.389/0.815）与 gaze.ts 实际值（0.3866/0.8141）的偏差污染断言。
 */
function gazeWeight(
  w: ReturnType<typeof makeWorld>,
  x: number, z: number,
  mode: Mode = 'attack', phase: Phase = 'idle',
): number {
  const cfg = w.config.gaze;
  const p = w.character.position;
  const dx = x - p.x;
  const dz = z - p.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 1e-6 || dist > cfg.threatRange) return 0;
  const prox = Math.min(1, Math.max(0, (cfg.threatRange - dist) / Math.max(1e-6, cfg.threatRange - cfg.nearDistance)));
  let wt = prox * (cfg.modeWeight[mode] ?? 0.5);
  if (phase === 'active') wt += cfg.attackBoost * prox;
  return wt;
}

describe('v9s.3 威胁注视：进入 / 加权中心 / 解除滞回', () => {
  it('瞄准中 + 范围内有攻击态假人 → 进入威胁注视，主威胁 / 中心朝向正确', () => {
    const w = makeWorld();
    placeOnly(w, [[0, 0, 2]]); // 玩家 (0,0,8)，假人 -z 6 单位，dist=6 < threatRange=8
    gazeUpdate(w, DT, AIM);
    expect(w.gaze.active).toBe(true);
    expect(w.gaze.threatCount).toBe(1);
    expect(w.gaze.threat).toBeGreaterThan(0.05);
    expect(Math.abs(wrapAngle(w.gaze.mainYaw - Math.PI))).toBeLessThan(1e-6);
    expect(Math.abs(wrapAngle(w.gaze.centroidYaw - Math.PI))).toBeLessThan(1e-6);
  });

  it('无瞄准 → 不进入（威胁注视只在主动瞄准时生效）', () => {
    const w = makeWorld();
    placeOnly(w, [[0, 0, 2]]);
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('加权中心 = 主威胁 + 最近高权威胁；高权假人把中心拉向自己', () => {
    const w = makeWorld();
    placeOnly(w, [
      [0, 2, 2], // dist≈6.32
      [1, -2, 4], // dist≈4.47（更高权 → 主威胁）
    ]);
    gazeUpdate(w, DT, AIM);
    expect(w.gaze.threatCount).toBe(2);
    const p = w.character.position;
    const d2Yaw = Math.atan2(-2 - p.x, 4 - p.z);
    expect(Math.abs(wrapAngle(w.gaze.mainYaw - d2Yaw))).toBeLessThan(1e-9);
    // 用真实 gaze 口径（threatRange/nearDistance/modeWeight）重算期望质心，与实现同源
    const w0 = gazeWeight(w, 2, 2, 'attack', 'idle');
    const w1 = gazeWeight(w, -2, 4, 'attack', 'idle');
    const cx = (2 * w0 + -2 * w1) / (w0 + w1);
    const cz = (2 * w0 + 4 * w1) / (w0 + w1);
    const expCentroid = Math.atan2(cx - p.x, cz - p.z);
    expect(Math.abs(wrapAngle(w.gaze.centroidYaw - expCentroid))).toBeLessThan(1e-9);
  });

  it('解除滞回：进范围激活 → 移到 (threatRange, recoveryDist) 仍保持 → 超出 recoveryDist 交还', () => {
    const w = makeWorld();
    placeOnly(w, [[0, 0, 2]]); // dist 6 < threatRange 8 → 进入
    gazeUpdate(w, DT, AIM);
    expect(w.gaze.active).toBe(true);
    placeOnly(w, [[0, 0, -2]]); // dist 10：>threatRange 8，<recoveryDist 12 → 滞回保持
    gazeUpdate(w, DT, AIM);
    expect(w.gaze.active).toBe(true);
    placeOnly(w, [[0, 0, -8]]); // dist 16：>recoveryDist 12 → 交还
    gazeUpdate(w, DT, AIM);
    expect(w.gaze.active).toBe(false);
  });
});

describe('v9s.3 集成（完整 step，冻结假人）：威胁注视驱动头/身朝向', () => {
  it('威胁激活时：身体趋向加权中心、头部看向主威胁', () => {
    const w = makeWorld();
    w.modules.dummies = false; // 冻结假人 AI，位置由测试控制
    placeOnly(w, [
      [0, 2, 2],
      [1, -2, 4],
    ]);
    gazeUpdate(w, DT, AIM); // 预激活，拿到目标
    const targetBody = w.gaze.centroidYaw;
    const targetHead = w.gaze.mainYaw;
    for (let i = 0; i < 180; i++) step(w, DT, AIM);
    expect(Math.abs(wrapAngle(w.character.bodyYaw - targetBody))).toBeLessThan(12 * DEG);
    expect(Math.abs(wrapAngle(w.character.headYaw - targetHead))).toBeLessThan(12 * DEG);
  });
});

describe('v9s.3 普通注视：仅头部看目标，身体不动；越界转回移动方向', () => {
  it('目标在头限制角内 → 头看向目标、身体保持', () => {
    const w = makeWorld();
    const target = 40 * DEG;
    w.targeting.hasTarget = true;
    w.targeting.targetYaw = target;
    for (let i = 0; i < 60; i++) orientationUpdate(w, DT, intent({}));
    expect(Math.abs(wrapAngle(w.character.headYaw - target))).toBeLessThan(4 * DEG);
    expect(Math.abs(wrapAngle(w.character.bodyYaw))).toBeLessThan(2 * DEG);
  });

  it('目标超过头限制角 → 头平滑转回看移动方向（此处移动方向=0）', () => {
    const w = makeWorld();
    w.targeting.hasTarget = true;
    w.targeting.targetYaw = 40 * DEG;
    for (let i = 0; i < 30; i++) orientationUpdate(w, DT, intent({}));
    w.targeting.targetYaw = 120 * DEG; // 超 headLookLimitDeg=55°
    for (let i = 0; i < 60; i++) orientationUpdate(w, DT, intent({}));
    expect(Math.abs(wrapAngle(w.character.headYaw))).toBeLessThan(10 * DEG);
  });
});
