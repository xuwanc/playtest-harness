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

  it('无瞄准、非敌对模式(idle)且未出手 → 不进入（旧口径保护）', () => {
    const w = makeWorld();
    placeOnly(w, [[0, 0, 2, 'idle']]);
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('加权中心 = 主威胁 + 高权威胁；中心偏向主威胁一侧', () => {
    const w = makeWorld();
    placeOnly(w, [
      [0, 2, 2], // dist≈6.32
      [1, -2, 4], // dist≈4.47（更高权 → 主威胁）
    ]);
    gazeUpdate(w, DT, AIM);
    expect(w.gaze.threatCount).toBe(2);
    const p = w.character.position;
    const d2Yaw = Math.atan2(-2 - p.x, 4 - p.z);
    const d1Yaw = Math.atan2(2 - p.x, 2 - p.z);
    expect(Math.abs(wrapAngle(w.gaze.mainYaw - d2Yaw))).toBeLessThan(1e-9);
    // v9s.6 角度整形后：中心必须在两者短弧之间，且离主威胁更近（近 + 角度衰减双重加权）
    const dMain = Math.abs(wrapAngle(w.gaze.centroidYaw - d2Yaw));
    const dOther = Math.abs(wrapAngle(w.gaze.centroidYaw - d1Yaw));
    expect(dMain).toBeLessThan(dOther);
    expect(dMain).toBeLessThan(20 * DEG);
    const span = Math.abs(wrapAngle(d1Yaw - d2Yaw));
    expect(dMain + dOther).toBeLessThan(span + 1e-6);
  });

  it('解除滞回：进入后仍在 recoveryDist(3.5m) 内保持 → 超出即交还', () => {
    const w = makeWorld();
    // 用「起手」进入而非瞄准：瞄准中会一直是 desired，测不到退出
    placeOnly(w, [[0, 0, 2, 'attack', 'windup']]); // dist 6 < threatRange 8 → 进入
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);
    placeOnly(w, [[0, 0, 5]]); // dist 3 < recoveryDist 3.5 → 滞回保持
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);
    placeOnly(w, [[0, 0, 4]]); // dist 4 > recoveryDist 3.5 → 交还
    gazeUpdate(w, DT, intent({}));
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
