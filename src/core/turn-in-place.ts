import { wrapAngle } from './orientation';
import type { Intents, TurnInPlaceConfig, TurnInPlaceState, World } from './types';

/**
 * v9s · 原地转身（turn-in-place）状态机 —— 纯状态转移、确定性、可快照。
 *
 * 解决的问题：静止「盯视」时，若目标（技2 拖拽方向 / 锁定目标 / 假人）绕到背后，
 * 旧逻辑只有 `bodyYaw = approach(bodyYaw, facing, 7, dt)` 一条纯数值插值，停步收相
 * 结束后 solveGait 已返回 idle、没有任何步态参与 —— 整个人被「抹」过去，观感就是
 * 「下半身平滑滑过去」。这里在夹角超过阈值时触发一次明确的、有脚步配合的原地转身。
 *
 * 职责边界（与表现层分工）：
 *  - 本模块只决定「要不要触发 / 锁定哪个角 / 转到哪 / 何时被中止」，并把结果写进
 *    World；它会改写 bodyYaw 与 facing，因此属于 Core（后续 attackFacing、命中判定
 *    都读这些量），必须随快照回放、确定性。
 *  - 「转身时脚怎么挪、骨盆怎么沉」由表现层的 solveTurnStep + IK 负责，不进 Core。
 *  - 停步遗留的 hipYaw 偏转是表现层平滑量，不在这里处理（见 gait.ts / voxel-rig.ts）。
 *
 * 不影响起步 / 攻击：闸门要求静止、落地、无移动输入、无攻击 / 引导 / 蓄力 / 冲刺 /
 * 派生招 / 受击；任一条件失效立即清状态，把 bodyYaw 交还 orientation 的常规 approach。
 *
 * 对应 C# 形态：static void TurnInPlaceUpdate(World w, float dt, in Intents i)
 */
const DEG = Math.PI / 180;
const EPS = 1e-6;

export function initialTurnInPlaceState(): TurnInPlaceState {
  return {
    phase: 'idle', fromYaw: 0, targetYaw: 0, dir: 1, progress: 0, armTime: 0,
  };
}

export function resetTurnInPlace(world: World): void {
  const t = world.turnInPlace;
  t.phase = 'idle';
  t.fromYaw = 0;
  t.targetYaw = 0;
  t.dir = 1;
  t.progress = 0;
  t.armTime = 0;
}

/**
 * 解析「目视方向」：技2 拖拽 > 智能锁定目标 > 范围内最近的假人。
 *
 * 最后一级是关键：targeting 只在当前面朝向 ±maxAngleDeg 扇区内锁定，目标绕到背后
 * 会丢锁（hasTarget=false、targetYaw 停在旧值）。盯视是纯朝向行为，不该被战斗索敌的
 * 扇区限制挡住，所以单独取最近假人、不受 maxAngleDeg 约束；攻击索敌逻辑完全不变。
 * 返回 null 表示「没有可盯的目标」，不触发转身。
 */
export function resolveLookYaw(world: World, intents: Intents, lookRange: number): number | null {
  if (intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > EPS) {
    return Math.atan2(intents.aimX, intents.aimZ);
  }
  const tg = world.config.targeting;
  if (tg.targetAssist && world.modules.targeting && world.targeting.hasTarget) {
    return world.targeting.targetYaw;
  }
  // 假人数组在 modules.dummies=false 时依然保留（只是 AI 冻结），盯视仍可读取其位置
  const p = world.character.position;
  const range = lookRange > EPS ? lookRange : tg.range;
  let best = Number.POSITIVE_INFINITY;
  let yaw = 0;
  let found = false;
  for (const d of world.dummies) {
    const dx = d.position.x - p.x;
    const dz = d.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < EPS || dist > range) continue;
    if (dist < best) {
      best = dist;
      yaw = Math.atan2(dx, dz);
      found = true;
    }
  }
  return found ? yaw : null;
}

/** 是否处于「允许原地转身」的静止、非动作态。 */
function gatesOpen(world: World, intents: Intents, cfg: TurnInPlaceConfig): boolean {
  const c = world.character;
  const speed = Math.hypot(c.velocity.x, c.velocity.z);
  const moveInput = Math.hypot(intents.moveX, intents.moveZ);
  const busy = world.combat.phase !== 'idle'
    || world.combat.charging
    || world.abilities.channeling
    || world.dash.phase !== 'idle'
    || world.playerLink.phase !== 'idle'
    || world.playerHurt.type !== 'none'
    || intents.attackPressed || intents.attackHeld
    || intents.skill2Pressed
    || intents.sprintPressed || intents.jumpPressed;
  return c.grounded
    && speed <= Math.max(0, cfg.idleSpeedRatio) * Math.max(world.config.moveSpeed, EPS)
    && moveInput <= Math.max(0, cfg.inputDeadZone)
    && !busy;
}

/** smoothstep：两端值与导数均为 0，避免转身起止抽动。 */
function ease(t: number): number {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * (3 - 2 * x);
}

/**
 * v9s：预判本帧是否「应该由 turnInPlace 驱动 bodyYaw」。
 * 与 turnInPlaceUpdate 的激活前判据一致（闸门开放 + 有目视目标 + 夹角 > 触发角），
 * 但不等待 armSec 防抖。供 orientation 在转身「临近触发」时提前停掉常规 approach，
 * 避免激活瞬间从「approach 的快速逼近」陡降到「ease 的慢速起步」造成的卡顿
 * （用户反馈「转身的时候整体会卡一下」）。触发角 / 防抖仍由配置热改。
 */
export function turnShouldDrive(world: World, intents: Intents): boolean {
  const cfg = world.config.turnInPlace;
  if (!cfg.enabled || !world.modules.turnInPlace) return false;
  if (!gatesOpen(world, intents, cfg)) return false;
  const look = resolveLookYaw(world, intents, cfg.lookRange);
  if (look === null) return false;
  const delta = wrapAngle(look - world.character.bodyYaw);
  return Math.abs(delta) > Math.max(0, cfg.triggerDeg) * DEG;
}

/**
 * 单帧状态转移。必须在 orientationUpdate **之后**调用：
 *  - orientation 在 active 期间跳过 bodyYaw 的常规 approach（由本模块按固定进度驱动）；
 *  - 本模块随后写 bodyYaw，并在「非拖拽」场景同步写 facing，避免转身结束后
 *    approach 把身体拉回旧的面朝向。
 */
export function turnInPlaceUpdate(world: World, dt: number, intents: Intents): void {
  const t = world.turnInPlace;
  const cfg = world.config.turnInPlace;

  if (!cfg.enabled || !world.modules.turnInPlace || !gatesOpen(world, intents, cfg)) {
    // 任一闸门失效：立即中止、清状态，bodyYaw 交还常规 approach（起步 / 攻击零延迟）
    resetTurnInPlace(world);
    return;
  }

  const look = resolveLookYaw(world, intents, cfg.lookRange);
  if (look === null) {
    resetTurnInPlace(world);
    return;
  }

  const c = world.character;
  const delta = wrapAngle(look - c.bodyYaw);
  const abs = Math.abs(delta);
  const trigger = Math.max(0, cfg.triggerDeg) * DEG;
  const dragging = intents.aimActive && Math.hypot(intents.aimX, intents.aimZ) > EPS;

  if (t.phase === 'idle') {
    t.armTime = abs >= trigger ? t.armTime + dt : 0;
    if (abs > trigger && t.armTime >= Math.max(0, cfg.armSec)) {
      t.phase = 'active';
      t.fromYaw = c.bodyYaw;
      t.dir = delta >= 0 ? 1 : -1;
      // 留余角：不必硬转满，快照目标角后全程不追着目标抖动
      const settle = Math.min(abs, Math.max(0, cfg.settleDeg) * DEG);
      t.targetYaw = wrapAngle(c.bodyYaw + t.dir * (abs - settle));
      t.progress = 0;
    }
  }

  if (t.phase === 'active') {
    const dur = Math.max(cfg.durationSec, world.config.fixedDt);
    t.progress = Math.min(1, t.progress + dt / dur);
    c.bodyYaw = wrapAngle(t.fromYaw + (t.targetYaw - t.fromYaw) * ease(t.progress));
    // 非拖拽时让面朝向跟随身体一起旋转：否则完成帧回到 idle 后，orientation 的
    // approach 会以旧 facing 为目标把身体慢慢拉回去，转身等于白做。
    // v9s 修正：原先写死 c.facing = t.targetYaw，激活当帧就把 facing 从旧值瞬间
    // 跳到目标角（单帧 170°+），既触发遥测 dirJump、又让头部抽搐。改跟随 bodyYaw
    // 平滑旋转 —— 激活帧 facing≈bodyYaw≈旧值、零跳变；完成帧二者都等于 targetYaw，
    // 同样不再回拉。拖拽时 facing 本就由 orientation 每帧重设为实时拖拽方向，不动。
    if (!dragging) c.facing = c.bodyYaw;
    if (t.progress >= 1) {
      // 完成当帧已把 bodyYaw 精确写到 targetYaw；下一帧夹角只剩余角，不会再触发。
      t.phase = 'idle';
      t.progress = 0;
      t.armTime = 0;
    }
  }
}
