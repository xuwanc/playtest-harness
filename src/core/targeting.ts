import { wrapAngle } from './orientation';
import type { Intents, TargetState, World } from './types';

const EPS = 1e-6;
const DEG = Math.PI / 180;

export function initialTargetState(): TargetState {
  return { targetId: 0, targetYaw: 0, targetDist: 0, hasTarget: false };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 智能目标选择：只在「当前面朝向的前方扇区」内挑选，优先正面 + 更近的假人。
 *
 *  - 参考朝向：右手拖拽（技能瞄准）> 移动输入 > 上一帧 facing。
 *    v9s.25 之前只有「移动输入 > facing」，于是玩家用右手拖向左/右瞄准放技能时，
 *    索敌仍按左摇杆方向找目标，选出的人跟玩家实际指的方向不一致。
 *    拖拽是玩家显式表达的攻击方向，必须优先；没有拖拽时行为与旧版逐字节一致。
 *  - 评分 score = dist - frontBias * cos(夹角)，越小越优先。
 *  - 背后的敌人不会被强行锁定（|夹角| > maxAngleDeg 直接跳过），
 *    这样玩家背对敌群时仍然朝自己想打的方向挥砍，符合动作游戏软锁定习惯。
 *
 * 只写 world.targeting，不改任何实体状态；不发事件（避免干扰模块开关测试）。
 * 对应 C# 形态：static void TargetingUpdate(World w, float dt, in Intents i)
 */
export function targetingUpdate(world: World, dt: number, intents: Intents): void {
  // dt 仅用于保持模块签名一致（本模块是纯几何选择，不随时间演化）
  void dt;
  const cfg = world.config.targeting;
  const t = world.targeting;
  const p = world.character.position;

  let refYaw = world.character.facing;
  const aimLen = Math.hypot(intents.aimX, intents.aimZ);
  if (intents.aimActive && aimLen > EPS) {
    refYaw = Math.atan2(intents.aimX, intents.aimZ);
  } else {
    const inputLen = Math.hypot(intents.moveX, intents.moveZ);
    if (inputLen > EPS) refYaw = Math.atan2(intents.moveX, intents.moveZ);
  }

  const maxAngle = clamp(cfg.maxAngleDeg, 0, 180) * DEG;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestId = 0;
  let bestYaw = 0;
  let bestDist = 0;

  for (const s of world.dummies) {
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < EPS || dist > cfg.range) continue;
    const yaw = Math.atan2(dx, dz);
    const diff = Math.abs(wrapAngle(yaw - refYaw));
    if (diff > maxAngle) continue;
    const score = dist - cfg.frontBias * Math.cos(diff);
    if (score < bestScore) {
      bestScore = score;
      bestId = s.id;
      bestYaw = yaw;
      bestDist = dist;
    }
  }

  t.targetId = bestId;
  t.targetYaw = bestYaw;
  t.targetDist = bestDist;
  t.hasTarget = bestId > 0;
}
