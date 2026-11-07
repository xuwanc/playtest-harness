import { resolveFacingYaw } from './aim';
import { turnShouldDrive } from './turn-in-place';
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
 * 单帧转角上限（v9h）：与目标夹角 <= snapRad 直接对齐，超过则最多转 maxStep。
 * 纯数学、无状态，保证确定性。
 */
export function limitTurn(current: number, target: number, maxStep: number, snapRad: number): number {
  const delta = wrapAngle(target - current);
  const abs = Math.abs(delta);
  if (abs <= snapRad || abs <= maxStep) return target;
  return wrapAngle(current + Math.sign(delta) * Math.max(maxStep, 0));
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
  } else if (inputLen > Math.max(o.facingDeadZone, EPS)) {
    const target = Math.atan2(intents.moveX, intents.moveZ);
    // v9g：小幅推杆（< 35%）时方向对像素极敏感，7px 半径上转一圈就能让 atan2 扫 360°，
    // 直接跟随会让角色原地来回抽（真机 10 次 dirJump 里大半是这种）。
    // 两道闸：① 与当前朝向夹角小于 deadband 就不动（拇指微颤不转身）；
    //        ② 超过则按 facingSmoothRate 指数趋近（≈70ms 到位），不是瞬移。
    // 大幅推杆（>= 35%）仍瞬时跟随，转身手感不变。
    // 大角限速（v9h）：真机日志里剩下的朝向跳变全是大角单帧翻转 ——
    // 攻击锁定解除（141°）、摇杆从静止突然指到反方向（126°）。目标方向一变就整块抹过去，
    // 头部会在 3 帧内甩到限幅边界，看着像抽帧。这里统一给面朝向一个 1800°/s 的转速上限：
    // 141° 约 78ms、90° 约 50ms 转完，攻击起手前早就到位，手感不变；小于 30° 仍瞬时对齐。
    const maxStep = ((o.facingTurnRate * Math.PI) / 180) * dt;
    const snapRad = (o.facingSnapDeg * Math.PI) / 180;
    if (inputLen >= 0.35) {
      c.facing = limitTurn(c.facing, target, maxStep, snapRad);
    } else if (inputLen >= o.facingMinMagnitude) {
      const diff = Math.abs(wrapAngle(target - c.facing));
      if (diff > (o.facingDeadbandDeg * Math.PI) / 180) {
        const eased = approach(c.facing, target, o.facingSmoothRate, dt);
        // 指数趋近在 180° 反向时首帧就能走 38°，同样要过限速
        c.facing = limitTurn(c.facing, eased, maxStep, 0);
      }
    }
  }
  // 无输入且非攻击：保持上一帧面朝向

  // 2) 移动方向 = 实际速度方向（速度过小则保持，避免抖动）
  const v = c.velocity;
  if (Math.hypot(v.x, v.z) > 0.15) c.moveYaw = Math.atan2(v.x, v.z);

  // 3) 身体平滑追随（慢）
  //    v9s：原地转身 active 期间跳过 —— bodyYaw 由 turn-in-place 模块按固定进度驱动，
  //    这里若照常 approach 会把「固定节奏的转身」拖成两套插值叠加，转身起止发飘。
  //    headYaw 仍按本帧的 bodyYaw（上一帧转身写入值）限幅，头先于身体到位的关系不变。
  //    v9s 续：转身「即将触发」（夹角已超阈值、闸门开放）时也跳过常规 approach ——
  //    否则激活瞬间 bodyYaw 会从「approach 的快速逼近(~19°/帧)」陡降到「ease 的慢速起步
  //    (~1.4°/帧)」，观感就是「转身的时候整体会卡一下」。提前停掉 approach，转身从
  //    静止匀速起步；激活帧 bodyYaw≈旧值，无突变。
  const turning = world.turnInPlace.phase === 'active' || turnShouldDrive(world, intents);
  if (!turning) {
    c.bodyYaw = approach(c.bodyYaw, c.facing, o.bodyTurnRate, dt);
  }

  // 4) 头部快速追随（快）→ 头先于身体到位；再相对身体限幅
  let head = approach(c.headYaw, c.facing, o.headTurnRate, dt);
  const maxTurn = (o.maxHeadTurnDeg * Math.PI) / 180;
  const rel = wrapAngle(head - c.bodyYaw);
  if (rel > maxTurn) head = c.bodyYaw + maxTurn;
  else if (rel < -maxTurn) head = c.bodyYaw - maxTurn;
  c.headYaw = head;
}
