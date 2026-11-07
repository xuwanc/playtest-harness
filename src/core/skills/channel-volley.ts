import { resolveFacingYaw } from '../aim';
import { dealHit } from '../hits';
import { wrapAngle } from '../orientation';
import type {
  AbilityConfig, EventType, Intents, PendingShot, ProjectileState, World,
} from '../types';
import type { SkillContext, SkillModule } from './types';

const EPS = 1e-6;
const DEG = Math.PI / 180;

type Params = AbilityConfig['arcane'];

function emit(
  world: World, type: EventType, value: number, at: { x: number; y: number; z: number },
): void {
  world.events.push({ type, tick: world.tick, x: at.x, y: at.y, z: at.z, value });
}

/**
 * 候选目标：引导锥形内、homingRange 内，按距离升序（同距离按索引）。
 *
 * 「各自索敌」的第一步：同一波的三枚飞弹轮流取第 0/1/2 近的目标，
 * 场上多个敌人时能立刻看出它们各追各的（只有一个敌人时自然全部指向它）。
 */
function candidates(world: World, yaw: number, cfg: Params): number[] {
  const p = world.character.position;
  const cone = Math.max(0, cfg.homingConeDeg) * DEG;
  const range = Math.max(0, cfg.homingRange);
  const list: Array<{ i: number; d: number }> = [];
  for (let i = 0; i < world.dummies.length; i++) {
    const s = world.dummies[i];
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-3 || d > range) continue;
    if (Math.abs(wrapAngle(Math.atan2(dx, dz) - yaw)) > cone) continue;
    list.push({ i, d });
  }
  list.sort((a, b) => a.d - b.d || a.i - b.i);
  return list.map((o) => o.i);
}

/**
 * 纯函数伪随机（0..1）：只由波次 / 序号决定，不读写 world.rngState。
 * 用它做速度浮动 —— 齐射「错落」必须是可复现的，且不能偷走假人游走的随机序列。
 */
function jitterAt(wave: number, index: number): number {
  const x = Math.sin((wave + 1) * 12.9898 + (index + 1) * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 发射一波：perWave 枚菱形飞弹，围绕 channelYaw 均匀散布。
 *
 * 每枚按 spawnDelay 错开出膛（第 i 枚延迟 i × spawnDelay）；出生点带侧向偏移 + 各自朝向，
 * 出膛后先按发射角直飞 spreadTime 秒（散开），之后才各自索敌转向 ——
 * 观感是「炸开后收拢」，而不是「一出膛就并成一条线」。
 */
function fireWave(world: World, cfg: Params): void {
  const a = world.abilities;
  const p = world.character.position;
  const n = Math.max(1, Math.floor(cfg.perWave));
  const spread = cfg.spreadDeg * DEG;
  const step = Math.max(0, cfg.spawnSideStep);
  const jitter = Math.max(0, Math.min(1, cfg.speedJitter));
  const targets = candidates(world, a.channelYaw, cfg);
  for (let i = 0; i < n; i++) {
    const offset = (i - (n - 1) * 0.5) * spread;
    const yaw = a.channelYaw + offset;
    const side = (i - (n - 1) * 0.5) * step;
    const dx = Math.sin(yaw);
    const dz = Math.cos(yaw);
    a.pending.push({
      delay: i * Math.max(0, cfg.spawnDelay),
      x: p.x + dx * 0.5 + Math.cos(yaw) * side,
      y: p.y + 1.0,
      z: p.z + dz * 0.5 - Math.sin(yaw) * side,
      yaw,
      speed: cfg.speed * (1 + (jitterAt(a.waveIndex, i) * 2 - 1) * jitter),
      targetIndex: targets.length > 0 ? targets[i % targets.length] : -1,
      wave: a.waveIndex,
    });
  }
  emit(world, 'arcane-wave', a.waveIndex, { x: p.x, y: p.y + 1.0, z: p.z });
}

/** 待出膛倒计时：到点的转成真正的飞弹实体（确定性时间轴，不受帧率影响）。 */
function spawnPending(world: World, dt: number, cfg: Params): void {
  const a = world.abilities;
  if (a.pending.length === 0) return;
  const next: PendingShot[] = [];
  for (const s of a.pending) {
    s.delay -= dt;
    if (s.delay > 0) {
      next.push(s);
      continue;
    }
    const pr: ProjectileState = {
      id: ++a.nextId,
      x: s.x,
      y: s.y,
      z: s.z,
      dirX: Math.sin(s.yaw),
      dirZ: Math.cos(s.yaw),
      speed: s.speed,
      life: cfg.life,
      radius: cfg.radius,
      targetIndex: s.targetIndex,
      turnRate: Math.max(0, cfg.turnRateDeg) * DEG,
      homing: Math.max(0, cfg.homingTime),
      spread: Math.max(0, cfg.spreadTime),
      retarget: 0,
      wave: s.wave,
    };
    a.projectiles.push(pr);
    a.volleyId += 1;
    emit(world, 'projectile-fire', a.volleyId, pr);
  }
  a.pending = next;
}

/** 结束引导：立即进入冷却，并要求先松开按键才能重新开始。 */
function endChannel(world: World, cfg: Params): void {
  const a = world.abilities;
  if (!a.channeling) return;
  a.channeling = false;
  a.fireTimer = 0;
  a.cooldown = Math.max(0, cfg.cooldown);
  a.channelMoveScale = 1;
  // 5 波放完 / 被打断都置位：按住不放不会在冷却结束后自动重开，
  // 否则「一次引导 5 波」会退化成无限连发。
  a.needsRelease = true;
  emit(world, 'channel-end', 0, world.character.position);
}

/**
 * 引导状态（channel）：法杖 + 按住攻击键 → 按波次齐射。
 *
 * 一次引导固定 `waves` 波（默认 5）、每波 `perWave` 枚（默认 3），
 * 波与波之间 waveInterval（默认 0.22s），放完即结束并进入 cooldown（默认 1s）。
 * 冷却期间 / 未松手时不接受新的引导；提前松手、冲刺、切武器都会「打断」并进冷却。
 *
 * 依然刻意不改变 combat.phase（保持 idle），因此移动模块不锁速 ——「按住可以移动引导」。
 */
function updateChannel(
  world: World, dt: number, intents: Intents, cfg: Params, onWeapon: boolean, slot: string,
): void {
  const a = world.abilities;
  const dashing = world.dash.phase === 'active';
  const link = world.playerLink;
  // 槽位决定读哪个键：引导型技能通常绑 attack（按住），也允许绑 skill2（按住技2）
  const pressed = slot === 'skill2' ? intents.skill2Pressed : intents.attackHeld;
  const held = onWeapon && pressed && !dashing
    && link.phase === 'idle' && !link.consumedAttack;

  // 冷却独立衰减：即使不引导也在走，读进度弧 / 面板都能直接看到
  if (a.cooldown > 0) a.cooldown = Math.max(0, a.cooldown - dt);
  if (a.needsRelease && !held) a.needsRelease = false;

  if (!a.channeling) {
    const canStart = held && !a.needsRelease && a.cooldown <= 0;
    if (!canStart) return;
    a.channeling = true;
    a.channelId += 1;
    a.waveIndex = 0;
    a.fireTimer = 0; // 第一波立即发射（不拖到下一帧）
    a.channelMoveScale = Math.max(0, Math.min(1, cfg.moveScale));
    emit(world, 'channel-start', a.channelId, world.character.position);
  } else if (!held) {
    // 已进入引导但被打断（松手 / 冲刺 / 派生招抢占 / 换武器）
    endChannel(world, cfg);
    return;
  }

  a.channelYaw = resolveFacingYaw(world, intents);
  a.fireTimer -= dt;
  let guard = 0;
  while (a.fireTimer <= 0 && guard++ < 8) {
    a.fireTimer += Math.max(cfg.waveInterval, EPS);
    fireWave(world, cfg);
    a.waveIndex += 1;
    if (a.waveIndex >= Math.max(1, Math.floor(cfg.waves))) {
      endChannel(world, cfg);
      break;
    }
  }
}

/**
 * 飞行中重新索敌：以**飞弹自己**为原点，在 homingRange 内、当前航向
 * homingConeDeg 锥形内取最近假人。返回 -1 表示没有可追的目标（保持直飞）。
 */
function acquireTarget(world: World, pr: ProjectileState, cfg: Params): number {
  const cone = Math.max(0, cfg.homingConeDeg) * DEG;
  const range = Math.max(0, cfg.homingRange);
  const heading = Math.atan2(pr.dirX, pr.dirZ);
  let best = -1;
  let bestD = range + EPS;
  for (let i = 0; i < world.dummies.length; i++) {
    const s = world.dummies[i];
    const dx = s.position.x - pr.x;
    const dz = s.position.z - pr.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-3 || d > bestD) continue;
    if (Math.abs(wrapAngle(Math.atan2(dx, dz) - heading)) > cone) continue;
    best = i;
    bestD = d;
  }
  return best;
}

/**
 * 飞弹推进 + 各自索敌 + 限速制导 + 命中。
 *
 *  1. spread > 0：出膛后先按自己的发射角直飞（把齐射「散开」出来），不制导；
 *  2. 散开结束 → 每 retargetInterval 重新选一次最近的敌人（各自索敌，
 *     目标倒下 / 走开也能改追别人）；
 *  3. 转向仍是「限速」而不是「直接朝目标飞」：每帧最多转 turnRate×dt，
 *     近距几乎必中、远距横移目标会擦过 —— 这就是「一点转向修正」的手感来源。
 */
function updateProjectiles(world: World, dt: number, cfg: Params): void {
  const a = world.abilities;
  const dummyR = world.config.dummies.radius;
  // 命中结算遵守既有模块开关：关闭 hits 或 dummies 时飞弹仍飞行但不写受击 / 计数 / 事件
  const canHit = world.modules.hits && world.modules.dummies;
  const next: ProjectileState[] = [];
  for (const pr of a.projectiles) {
    if (pr.spread > 0) {
      // 散开阶段：保持发射角直飞，把队形拉开
      pr.spread = Math.max(0, pr.spread - dt);
    } else {
      if (pr.homing > 0) pr.homing = Math.max(0, pr.homing - dt);
      // 各自索敌：到点就重新挑一个最近的（锥形内，避免掉头）
      pr.retarget -= dt;
      if (pr.retarget <= 0) {
        pr.retarget = Math.max(0.05, cfg.retargetInterval);
        pr.targetIndex = acquireTarget(world, pr, cfg);
      }
      if (pr.targetIndex >= 0 && pr.turnRate > 0 && pr.homing > 0) {
        const s = world.dummies[pr.targetIndex];
        if (!s) {
          pr.targetIndex = -1;
        } else {
          const want = Math.atan2(s.position.x - pr.x, s.position.z - pr.z);
          const cur = Math.atan2(pr.dirX, pr.dirZ);
          const delta = wrapAngle(want - cur);
          const max = pr.turnRate * dt;
          const turn = Math.max(-max, Math.min(max, delta));
          const yaw = cur + turn;
          pr.dirX = Math.sin(yaw);
          pr.dirZ = Math.cos(yaw);
        }
      }
    }
    pr.x += pr.dirX * pr.speed * dt;
    pr.z += pr.dirZ * pr.speed * dt;
    pr.life -= dt;
    if (pr.life <= 0) continue;
    let hit = false;
    if (canHit) {
      for (let i = 0; i < world.dummies.length; i++) {
        const s = world.dummies[i];
        const dx = s.position.x - pr.x;
        const dz = s.position.z - pr.z;
        const rr = pr.radius + dummyR;
        if (dx * dx + dz * dz > rr * rr) continue;
        // 命中方向沿飞弹飞行方向：把敌人往前推
        dealHit(world, i, {
          type: cfg.hurtType,
          duration: cfg.hurtDuration,
          dirX: pr.dirX,
          dirZ: pr.dirZ,
          knockback: cfg.knockback,
        });
        hit = true;
        break;
      }
    }
    if (!hit) next.push(pr);
  }
  a.projectiles = next;
}

export const channelVolley: SkillModule = {
  kind: 'channelVolley',
  update({ world, dt, intents, skill, onWeapon }: SkillContext): void {
    const cfg = skill.params as Params;
    updateChannel(world, dt, intents, cfg, onWeapon, skill.cfg.slot);
    spawnPending(world, dt, cfg);
    updateProjectiles(world, dt, cfg);
  },
};
