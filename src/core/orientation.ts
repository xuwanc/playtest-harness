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
  //    v9s.4 接敌准备：威胁注视激活（且未被技能/攻击打断）时，面朝向压向威胁加权中心，
  //    **移动输入不再改写它** —— 边走位边保持面朝威胁，侧移 / 后退由 moveYaw 独立表现。
  //    攻击、引导、蓄力、冲刺属于主动动作，可打断接敌准备（朝向交还战斗逻辑）。
  const gazeActive = world.modules.gaze && world.gaze.active;
  const channeling = world.abilities.channeling;
  const busy = cb.phase !== 'idle' || cb.charging || channeling || world.dash.phase !== 'idle';
  const gazeHold = gazeActive && !busy;
  const inputLen = Math.hypot(intents.moveX, intents.moveZ);
  const dragging = intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > EPS;
  const bowAim = cb.charging && cb.weapon === 'bow'
    && world.config.targeting.targetAssist && world.modules.targeting && world.targeting.hasTarget;
  if (cb.phase !== 'idle') {
    c.facing = cb.attackFacing;
  } else if (channeling) {
    // 法杖引导（v7c #11 #12）：技能可打断接敌准备，朝向交还统一解析
    c.facing = resolveFacingYaw(world, intents);
  } else if (gazeHold) {
    // 接敌准备：与身体同速压向威胁中心（沉稳），头部用更高速率先锁主威胁；
    // 此处刻意不读移动输入 —— 移动时朝向保持，不跟着摇杆跑。
    c.facing = approach(c.facing, world.gaze.centroidYaw, o.bodyTurnRate, dt);
  } else if (dragging) {
    // 拖拽辅助朝向：统一解析（拖拽 > 锁定目标 > 移动 > 面朝向），
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
  //    v9s.3：威胁注视激活时，身体趋向「主威胁 + 最近高权威胁」的加权中心（centroidYaw），
  //    而非面朝向 —— 即使边瞄准边走位，身体也始终压向包围中心；普通模式仍追随 facing。
  //    v9s.4：busy（攻击 / 引导 / 蓄力 / 冲刺）打断接敌准备，body 回到跟随 facing。
  const bodyTargetYaw = gazeHold ? world.gaze.centroidYaw : c.facing;
  //    v9s：原地转身 active 期间跳过 —— bodyYaw 由 turn-in-place 模块按固定进度驱动，
  //    这里若照常 approach 会把「固定节奏的转身」拖成两套插值叠加，转身起止发飘。
  //    headYaw 仍按本帧的 bodyYaw（上一帧转身写入值）限幅，头先于身体到位的关系不变。
  //    v9s 续：转身「即将触发」（夹角已超阈值、闸门开放）时也跳过常规 approach ——
  //    否则激活瞬间 bodyYaw 会从「approach 的快速逼近(~19°/帧)」陡降到「ease 的慢速起步
  //    (~1.4°/帧)」，观感就是「转身的时候整体会卡一下」。提前停掉 approach，转身从
  //    静止匀速起步；激活帧 bodyYaw≈旧值，无突变。
  const turning = world.turnInPlace.phase === 'active' || turnShouldDrive(world, intents);
  if (!turning) {
    c.bodyYaw = approach(c.bodyYaw, bodyTargetYaw, o.bodyTurnRate, dt);
  }

  // 4) 头部：v9s.3 注视逻辑（快追随 → 头先于身体到位 → 相对身体限幅）
  //    威胁注视 → 头看主威胁(mainYaw)，**不受 headLookLimitDeg 的「改看移动方向」约束**
  //    （v9s.4：尽可能看向目标），只受相对身体的 maxHeadTurnDeg 物理限幅；
  //    普通注视 → 头看可注视目标（拖拽 > 锁定目标），无目标则跟随 facing，
  //    相对身体超过 headLookLimitDeg 时平滑转回看移动方向。
  //    注意：头部**不**做「最近假人」兜底 —— 那是 turn-in-place（身体）的机制，头部只跟
  //    明确的拖拽 / 锁定意图，未锁定时自然看向移动方向。
  let headTarget = c.facing;
  if (gazeActive) {
    // 技能 / 攻击打断期间随战斗朝向，其余时间盯住主威胁
    headTarget = gazeHold ? world.gaze.mainYaw : c.facing;
  } else if (dragging) {
    headTarget = Math.atan2(intents.aimX, intents.aimZ);
  } else if (
    world.config.targeting.targetAssist
    && world.modules.targeting
    && world.targeting.hasTarget
  ) {
    headTarget = world.targeting.targetYaw;
  }
  if (!gazeActive) {
    const headLimit = (world.config.gaze.headLookLimitDeg * Math.PI) / 180;
    if (Math.abs(wrapAngle(headTarget - c.bodyYaw)) > headLimit) {
      headTarget = c.moveYaw; // 普通注视：超过头限制角 → 头看向移动方向
    }
  }
  // 威胁注视用更高速率（gaze.headTurnRate > bodyTurnRate）→ 头先于身体锁住主威胁
  const headRate = gazeHold ? world.config.gaze.headTurnRate : o.headTurnRate;
  let head = approach(c.headYaw, headTarget, headRate, dt);
  const maxTurn = (o.maxHeadTurnDeg * Math.PI) / 180;
  const rel = wrapAngle(head - c.bodyYaw);
  if (rel > maxTurn) head = c.bodyYaw + maxTurn;
  else if (rel < -maxTurn) head = c.bodyYaw - maxTurn;
  c.headYaw = head;
}
