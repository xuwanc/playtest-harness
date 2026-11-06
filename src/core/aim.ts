import type { Intents, World } from './types';

const EPS = 1e-6;

/**
 * 统一的「动作朝向」解析 —— 所有需要选一个方向的动作共用这一套优先级，
 * 避免 combat / dash / abilities / orientation 各写一份、优先级不一致：
 *
 *   拖拽辅助朝向 > 智能锁定目标 > 移动输入 > 当前面朝向
 *
 * 拖拽辅助朝向（v7c #11）来自攻击 / 技2 按钮的拖拽方向，是玩家手动表达，优先级最高，
 * 因此能覆盖自动锁定；未拖拽（aimActive=false）时行为与旧版逐字节一致，键盘 / 纯点击不受影响。
 * 全部为纯数值、无外部状态，确定性、可快照、可跨语言对照。
 */
export function resolveFacingYaw(world: World, intents: Intents): number {
  if (intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > EPS) {
    return Math.atan2(intents.aimX, intents.aimZ);
  }
  const tg = world.config.targeting;
  if (tg.targetAssist && world.modules.targeting && world.targeting.hasTarget) {
    return world.targeting.targetYaw;
  }
  const len = Math.hypot(intents.moveX, intents.moveZ);
  if (len > EPS) return Math.atan2(intents.moveX, intents.moveZ);
  return world.character.facing;
}

/**
 * 冲刺方向（翻滚 / 闪现）：拖拽辅助朝向 > 移动输入 > 当前面朝向。
 * 冲刺刻意不强制锁定目标，保留「想往哪滚就往哪滚」的自由度；只有拖拽能显式指定方向。
 */
export function resolveDashDir(world: World, intents: Intents): { x: number; z: number } {
  if (intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > EPS) {
    const l = Math.hypot(intents.aimX, intents.aimZ);
    return { x: intents.aimX / l, z: intents.aimZ / l };
  }
  const len = Math.hypot(intents.moveX, intents.moveZ);
  if (len > EPS) return { x: intents.moveX / len, z: intents.moveZ / len };
  const f = world.character.facing;
  return { x: Math.sin(f), z: Math.cos(f) };
}
