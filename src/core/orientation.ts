import { resolveFacingYaw } from './aim';
import type { Intents, World } from './types';

const EPS = 1e-6;

/**
 * 角度归一化到 (-π, π]，保证旋转走最短弧。
 * 纯数学，确定性，对应 C# 里的 Math.Atan2(Math.Sin(a), Math.Cos(a))。
 */
export function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/** 帧率无关的指数趋近（走最短弧），rate 越大越快。 */
function approach(current: number, target: number, rate: number, dt: number): number {
  const delta = wrapAngle(target - current);
  return current + delta * (1 - Math.exp(-Math.max(rate, EPS) * dt));
}

/**
 * 程序化朝向模块：把「面朝向 / 身体朝向 / 移动方向」拆成四条独立状态。
 *
 *  - facing   面朝向（目标方向）：攻击中锁定 attackFacing；平时取摇杆意图方向；无输入保持。
 *  - moveYaw  移动方向：由实际速度得出。角色可以侧移 / 后退，与身体朝向不同。
 *  - bodyYaw  身体朝向：慢速平滑追随 facing（转身有惯性，不是瞬移）。
 *  - headYaw  头部朝向：更快速率追随 facing（头先转到位），再相对身体限幅，避免扭头过度。
 *
 * 表现层据此做「头 → 身体 → 腿」三段分离的程序动画：
 *   root = bodyYaw，头部 pivot = headYaw - bodyYaw，下半身 pivot = moveYaw - bodyYaw。
 *
 * 与 movement / combat 解耦：只读 velocity / combat 状态与 intents，只写 character 的四个角度。
 * 对应 C# 形态：static void OrientationUpdate(World w, float dt, in Intents i)
 */
export function orientationUpdate(world: World, dt: number, intents: Intents): void {
  const c = world.character;
  const o = world.config.orientation;
  const cb = world.combat;

  // 1) 面朝向 = 目标方向
  const inputLen = Math.hypot(intents.moveX, intents.moveZ);
  const dragging = intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > EPS;
  const channeling = world.abilities.channeling;
  const bowAim = cb.charging && cb.weapon === 'bow'
    && world.config.targeting.targetAssist && world.modules.targeting && world.targeting.hasTarget;
  if (cb.phase !== 'idle') {
    c.facing = cb.attackFacing;
  } else if (dragging || channeling) {
    // 拖拽辅助朝向 / 法杖引导（v7c #11 #12）：用统一解析（拖拽 > 锁定目标 > 移动 > 面朝向），
    // 与 abilities.channelYaw 同一套优先级，保证身体朝向与飞弹发射方向一致；
    // 手动拖拽覆盖自动锁定，移动方向仍由 moveYaw 独立表现（朝向分离）。
    c.facing = resolveFacingYaw(world, intents);
  } else if (bowAim) {
    // 按住弓蓄力时持续面向锁定目标（覆盖摇杆方向），松手/换武器即恢复
    c.facing = world.targeting.targetYaw;
  } else if (inputLen > EPS) {
    c.facing = Math.atan2(intents.moveX, intents.moveZ);
  }
  // 无输入且非攻击：保持上一帧面朝向

  // 2) 移动方向 = 实际速度方向（速度过小则保持，避免抖动）
  const v = c.velocity;
  if (Math.hypot(v.x, v.z) > 0.15) c.moveYaw = Math.atan2(v.x, v.z);

  // 3) 身体平滑追随（慢）
  c.bodyYaw = approach(c.bodyYaw, c.facing, o.bodyTurnRate, dt);

  // 4) 头部快速追随（快）→ 头先于身体到位；再相对身体限幅
  let head = approach(c.headYaw, c.facing, o.headTurnRate, dt);
  const maxTurn = (o.maxHeadTurnDeg * Math.PI) / 180;
  const rel = wrapAngle(head - c.bodyYaw);
  if (rel > maxTurn) head = c.bodyYaw + maxTurn;
  else if (rel < -maxTurn) head = c.bodyYaw - maxTurn;
  c.headYaw = head;
}
