import { describe, expect, it } from 'vitest';
import { wrapAngle, step } from '../src/core';
import { makeWorld, intent } from './helpers';

const DT = 1 / 60;
const DEG = Math.PI / 180;

type Mode = 'idle' | 'wander' | 'follow' | 'keep-distance' | 'attack';

/** 清空默认假人（推到威胁范围外），再按坐标摆回指定假人。 */
function placeOnly(
  w: ReturnType<typeof makeWorld>,
  specs: Array<[i: number, x: number, z: number, mode?: Mode]>,
): void {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = 100;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  for (const [i, x, z, mode = 'attack'] of specs) {
    const d = w.dummies[i];
    d.position.x = x;
    d.position.z = z;
    d.mode = mode;
    d.attackPhase = 'idle';
  }
}

const AIM = intent({ aimActive: true, aimX: 0, aimZ: 1 });

describe('v9s.4 威胁注视：头部不受「超角改看移动方向」限制', () => {
  it('主威胁偏离身体 > headLookLimitDeg 时，头仍朝目标（停在身体 ±maxHeadTurnDeg），不被踢向 moveYaw', () => {
    const w = makeWorld();
    // 玩家 (0,0,8)；主威胁放正左方 → mainYaw = -90°，远离 moveYaw(0)
    placeOnly(w, [[0, -6, 8]]);
    w.modules.dummies = false;                 // 冻结 AI，位置由测试控制（gaze 仍读位置）
    w.modules.turnInPlace = false;             // 隔离原地转身，让 body 保持在 0，只看头部限幅
    w.config.orientation.bodyTurnRate = 1e-4;  // body 基本不动，隔离「身体转过去带偏头」
    w.config.orientation.maxHeadTurnDeg = 55;
    w.config.gaze.headLookLimitDeg = 55;
    w.config.gaze.headTurnRate = 30;

    for (let i = 0; i < 40; i++) step(w, DT, AIM);

    expect(w.gaze.active).toBe(true);
    expect(Math.abs(wrapAngle(w.gaze.mainYaw + Math.PI / 2))).toBeLessThan(2 * DEG);
    // 头留在「身体 - 55°」的物理极限上，而不是被 headLookLimitDeg 改看移动方向(0°)。
    // 旧逻辑这里 headYaw≈0；新逻辑必须明显偏向主威胁。
    expect(w.character.headYaw).toBeLessThan(-40 * DEG);
    expect(Math.abs(w.character.headYaw + 55 * DEG)).toBeLessThan(3 * DEG);
  });

  it('威胁注视时头先于身体到位（headTurnRate > bodyTurnRate）', () => {
    const w = makeWorld();
    // 主威胁在 +45°（不触发相对身体限幅），可直观比较头/身追赶进度
    placeOnly(w, [[0, 4, 12]]);
    w.modules.dummies = false;
    for (let i = 0; i < 8; i++) step(w, DT, AIM);

    expect(w.gaze.active).toBe(true);
    const main = w.gaze.mainYaw;
    const headErr = Math.abs(wrapAngle(main - w.character.headYaw));
    const bodyErr = Math.abs(wrapAngle(main - w.character.bodyYaw));
    expect(headErr).toBeLessThan(bodyErr - 8 * DEG);
  });
});

describe('v9s.4 接敌准备：移动保持朝向，技能可打断', () => {
  it('瞄准 + 移动时，身体/面朝向仍压向威胁中心，不跟着摇杆转向移动方向', () => {
    const w = makeWorld();
    placeOnly(w, [[0, 0, 2], [1, 2, 2]]); // 威胁在玩家前方（-Z 侧），centroid≈π
    w.modules.dummies = false;
    const moveAim = intent({ aimActive: true, aimX: 0, aimZ: 1, moveX: 1, moveZ: 0 });

    for (let i = 0; i < 24; i++) step(w, DT, moveAim);

    expect(w.gaze.active).toBe(true);
    const body = w.character.bodyYaw;
    // 朝威胁中心（会随位移略偏），而不是朝 +X 移动方向（π/2）
    expect(Math.abs(wrapAngle(body - w.gaze.centroidYaw))).toBeLessThan(20 * DEG);
    expect(Math.abs(wrapAngle(body - Math.PI / 2))).toBeGreaterThan(60 * DEG);
    // 面朝向同样保持威胁方向（不读移动输入）
    expect(Math.abs(wrapAngle(w.character.facing - w.gaze.centroidYaw))).toBeLessThan(20 * DEG);
  });

  it('攻击（combat.phase != idle）打断接敌准备：身体回到攻击朝向', () => {
    const w = makeWorld();
    placeOnly(w, [[0, 0, 2]]); // 威胁在 -Z → centroid≈π
    w.modules.dummies = false;
    w.modules.combat = false;        // 冻结战斗状态机，保持 windup
    w.combat.phase = 'windup';
    w.combat.attackFacing = 0.4;

    for (let i = 0; i < 30; i++) step(w, DT, AIM);

    expect(w.gaze.active).toBe(true);
    expect(Math.abs(wrapAngle(w.character.bodyYaw - 0.4))).toBeLessThan(8 * DEG);
    expect(Math.abs(wrapAngle(w.character.bodyYaw - Math.PI))).toBeGreaterThan(90 * DEG);
  });
});

describe('v9s.4 普通注视：静止时附近假人不拽身体', () => {
  it('无瞄准、无锁定，旁边有假人 → 不触发原地转身，身体保持', () => {
    const w = makeWorld();
    placeOnly(w, [[0, -2, 6, 'idle']]); // 左前方近旁假人
    w.modules.dummies = false;
    w.modules.targeting = false;

    for (let i = 0; i < 30; i++) step(w, DT, intent());

    expect(w.gaze.active).toBe(false);
    expect(w.turnInPlace.phase).toBe('idle');
    expect(Math.abs(wrapAngle(w.character.bodyYaw))).toBeLessThan(2 * DEG);
  });
});
