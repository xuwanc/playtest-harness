import { describe, expect, it } from 'vitest';
import { wrapAngle, gazeUpdate, step } from '../src/core';
import { makeWorld, intent } from './helpers';

const DT = 1 / 60;
const DEG = Math.PI / 180;

type Phase = 'idle' | 'windup' | 'active' | 'recovery';

/** 清空默认假人（推到威胁范围外），再按坐标摆回指定假人。 */
function placeOnly(
  w: ReturnType<typeof makeWorld>,
  specs: Array<[i: number, x: number, z: number, phase?: Phase, mode?: 'idle' | 'wander' | 'follow' | 'keep-distance' | 'attack']>,
): void {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = -5;   // 玩家 (0,0,8) → dist 13 > recoveryDist
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  for (const [i, x, z, phase = 'idle', mode = 'attack'] of specs) {
    const d = w.dummies[i];
    d.position.x = x;
    d.position.z = z;
    d.mode = mode;
    d.attackPhase = phase;
  }
}

describe('v9s.5 被攻击触发威胁注视（无需主动瞄准）', () => {
  it('敌人在起手(windup) → 无瞄准也进入威胁注视，身体转向威胁', () => {
    const w = makeWorld();
    w.modules.dummies = false;          // 冻结 AI，attackPhase 由测试控制
    placeOnly(w, [[0, -6, 8, 'windup']]); // 正左方，dist 6
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);
    expect(Math.abs(wrapAngle(w.gaze.mainYaw + Math.PI / 2))).toBeLessThan(2 * DEG);
    expect(w.gaze.threatCount).toBe(1);
  });

  it('挥砍中(active) → 进入；敌对模式只是站着(attack+idle)也主动接敌；非敌对 idle → 不进入', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, -6, 8, 'active']]);
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    // v9s.6：敌对模式（attack）进入 approachDist(2.5m) 即主动接敌，哪怕还没出手
    const w2 = makeWorld();
    w2.modules.dummies = false;
    placeOnly(w2, [[0, 0, 6, 'idle']]); // dist 2 < approachDist 2.5
    gazeUpdate(w2, DT, intent({}));
    expect(w2.gaze.active).toBe(true);

    // 非敌对模式（idle 0.2 < hostileModeWeight 0.6）→ 不进入，避免站在假人旁边就转身
    const w3 = makeWorld();
    w3.modules.dummies = false;
    placeOnly(w3, [[0, 0, 6, 'idle', 'idle']]); // dist 2 逼近，但 mode=idle 非敌对
    gazeUpdate(w3, DT, intent({}));
    expect(w3.gaze.active).toBe(false);
  });

  it('reactToAttack / reactToApproach 全关 → 回到「必须瞄准」旧口径（A/B 开关）', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, -6, 8, 'windup']]);
    w.config.gaze.reactToAttack = false;
    w.config.gaze.reactToApproach = false;
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
    gazeUpdate(w, DT, intent({ aimActive: true, aimX: 0, aimZ: 1 }));
    expect(w.gaze.active).toBe(true);
  });

  it('攻击间隙保持：进入后敌人回到 idle，只要仍在 recoveryDist(3.5m) 内就继续盯住', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, 0, 5, 'windup']]); // dist 3 < recoveryDist 3.5
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    w.dummies[0].attackPhase = 'idle';   // 一刀打完，站住
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);    // 距离未变 → hold

    w.dummies[0].position.z = -5;        // dist 13 > recoveryDist 3.5 → 交还
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('集成：无瞄准被攻击时，完整 step 也会让身体 / 头部转向威胁', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, -6, 8, 'active']]);
    for (let i = 0; i < 150; i++) step(w, DT, intent({}));

    expect(w.gaze.active).toBe(true);
    expect(Math.abs(wrapAngle(w.character.bodyYaw - w.gaze.centroidYaw))).toBeLessThan(12 * DEG);
    expect(Math.abs(wrapAngle(w.character.headYaw - w.gaze.mainYaw))).toBeLessThan(12 * DEG);
    // 朝左（-90°），不是继续朝初始 +Z
    expect(Math.abs(w.character.bodyYaw + Math.PI / 2)).toBeLessThan(12 * DEG);
  });
});
