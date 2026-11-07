import { describe, expect, it } from 'vitest';
import { wrapAngle, gazeUpdate, step } from '../src/core';
import { makeWorld, intent } from './helpers';

const DT = 1 / 60;
const DEG = Math.PI / 180;

type Mode = 'idle' | 'wander' | 'follow' | 'keep-distance' | 'attack';
type Phase = 'idle' | 'windup' | 'active' | 'recovery';

/** 把全部假人推到远处（出 recoveryDist），再按需摆回。 */
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

/** 以玩家为原点按「方位角（度，0 = +Z / 身体正前）+ 距离」摆一个假人。 */
function atPolar(
  w: ReturnType<typeof makeWorld>,
  i: number,
  deg: number,
  dist: number,
  mode: Mode = 'attack',
  phase: Phase = 'idle',
): void {
  const p = w.character.position;
  const a = deg * DEG;
  const d = w.dummies[i];
  d.position.x = p.x + Math.sin(a) * dist;
  d.position.z = p.z + Math.cos(a) * dist;
  d.mode = mode;
  d.attackPhase = phase;
}

const AIM = intent({ aimActive: true, aimX: 0, aimZ: 1 });

describe('v9s.6 威胁加权整形：离主威胁越远越低、背后降低', () => {
  it('离主威胁越远权重越低：关掉 spreadFalloff 后，中心被侧翼拉得更偏', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, []);
    atPolar(w, 0, 0, 2);   // 主威胁：正前 2m
    atPolar(w, 1, 80, 4);  // 次威胁：右前 80°、4m（同模式同距离，只差角度）

    gazeUpdate(w, DT, AIM);
    expect(w.gaze.mainId).toBe(w.dummies[0].id);
    const withFalloff = Math.abs(wrapAngle(w.gaze.centroidYaw)); // 主威胁 yaw = 0
    expect(withFalloff).toBeGreaterThan(0);                      // 仍被次威胁拉了一点

    w.config.gaze.spreadFalloff = 0; // 关掉角度衰减
    gazeUpdate(w, DT, AIM);
    const withoutFalloff = Math.abs(wrapAngle(w.gaze.centroidYaw));

    expect(withFalloff).toBeLessThan(withoutFalloff);
  });

  it('角色背后的威胁权重降低：中心偏向前方主威胁（同几何对照 behindFalloff）', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, []);
    atPolar(w, 0, 45, 3);   // 主威胁：右前 45°、3m（更近 → 主威胁）
    atPolar(w, 1, 135, 5);  // 次威胁：右后 135°、5m（> behindAngleDeg 100° → 背后）

    gazeUpdate(w, DT, AIM);
    expect(w.gaze.threatCount).toBe(2);
    expect(w.gaze.mainYaw).toBeCloseTo(45 * DEG, 6);
    const on = Math.abs(wrapAngle(w.gaze.centroidYaw - 45 * DEG));

    w.config.gaze.behindFalloff = 1; // 关掉背后惩罚
    gazeUpdate(w, DT, AIM);
    const off = Math.abs(wrapAngle(w.gaze.centroidYaw - 45 * DEG));

    expect(on).toBeLessThan(off);
    expect(on).toBeLessThan(25 * DEG);
  });

  it('主威胁在背后（单威胁）→ 豁免背后惩罚，center 仍指它，身体整身转过去', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, []);
    atPolar(w, 0, 180, 2); // 正后方 2m，mode=attack（未出手，靠 reactToApproach 进入）

    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);
    expect(Math.abs(wrapAngle(w.gaze.mainYaw - Math.PI))).toBeLessThan(1e-6);
    expect(Math.abs(wrapAngle(w.gaze.centroidYaw - Math.PI))).toBeLessThan(1e-6);

    for (let i = 0; i < 180; i++) step(w, DT, intent({}));
    expect(Math.abs(wrapAngle(w.character.bodyYaw - Math.PI))).toBeLessThan(12 * DEG);
  });
});

describe('v9s.6 主动接敌：威胁接近即进入，远离一定距离退出', () => {
  it('未瞄准、未出手：follow 单位逼近 → 主动进入接敌；还远时不进入', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, []);
    atPolar(w, 0, 20, 3.2, 'follow'); // 3.2m > approachDist 2.5：还不到主动接敌距离
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);

    atPolar(w, 0, 20, 2, 'follow'); // 2m < 2.5：进入接敌
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);
    expect(w.gaze.threatCount).toBe(1);
  });

  it('非敌对模式（idle / wander）靠近 → 不被当成威胁惊动', () => {
    for (const mode of ['idle', 'wander'] as const) {
      const w = makeWorld();
      w.modules.dummies = false;
      placeOnly(w, []);
      atPolar(w, 0, 0, 2, mode);
      gazeUpdate(w, DT, intent({}));
      expect(w.gaze.active).toBe(false);
    }
  });

  it('远离威胁：threatRange 外保持滞回，超出 recoveryDist 退出', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, []);
    atPolar(w, 0, 0, 6, 'attack', 'windup');
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    atPolar(w, 0, 0, 3, 'attack', 'idle'); // < 3.5：滞回保持
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    atPolar(w, 0, 0, 4, 'attack', 'idle'); // > 3.5：交还身体控制
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('集成：无瞄准、无攻击，仅 follow 逼近 → 身体 / 头部主动转向并保持', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, []);
    atPolar(w, 0, -90, 2, 'follow'); // 正左方 2m

    for (let i = 0; i < 180; i++) step(w, DT, intent({}));

    expect(w.gaze.active).toBe(true);
    expect(Math.abs(wrapAngle(w.character.bodyYaw - w.gaze.centroidYaw))).toBeLessThan(12 * DEG);
    expect(Math.abs(wrapAngle(w.character.headYaw - w.gaze.mainYaw))).toBeLessThan(12 * DEG);
    expect(Math.abs(wrapAngle(w.character.bodyYaw + Math.PI / 2))).toBeLessThan(12 * DEG); // 朝 -X
  });
});
