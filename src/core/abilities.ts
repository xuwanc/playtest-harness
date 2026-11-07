import { resolveFacingYaw } from './aim';
import { dealHit } from './hits';
import { wrapAngle } from './orientation';
import type { AbilityState, EventType, Intents, ProjectileState, ShockRingState, World } from './types';

const EPS = 1e-6;
const DEG = Math.PI / 180;

function emit(world: World, type: EventType, value: number, at: { x: number; y: number; z: number }): void {
  world.events.push({ type, tick: world.tick, x: at.x, y: at.y, z: at.z, value });
}

export function initialAbilityState(): AbilityState {
  return {
    channeling: false,
    channelYaw: 0,
    fireTimer: 0,
    waveIndex: 0,
    cooldown: 0,
    needsRelease: false,
    channelId: 0,
    volleyId: 0,
    projectiles: [],
    rings: [],
    nextId: 0,
  };
}

export function resetAbilities(world: World): void {
  const a = world.abilities;
  a.channeling = false;
  a.channelYaw = 0;
  a.fireTimer = 0;
  a.waveIndex = 0;
  a.cooldown = 0;
  a.needsRelease = false;
  // channelId / volleyId / nextId 持久递增不倒退：表现层用「id 变化」触发一次性特效，
  // 复位若清零会与残留特效冲突；飞弹 / 电环实体本身清空即可。
  a.projectiles.length = 0;
  a.rings.length = 0;
}

/**
 * 选制导目标：引导朝向锥形内、homingRange 内**最近**的假人。
 * 只做一次快照（发射时），飞行中不再重新选目标 —— 否则一波三发会各自
 * 追不同的人，看起来像「散射追踪」，而不是「齐射压向一个点」。
 */
function pickHomingTarget(world: World, yaw: number): number {
  const cfg = world.config.abilities.arcane;
  const p = world.character.position;
  const cone = Math.max(0, cfg.homingConeDeg) * DEG;
  let best = -1;
  let bestDist = Math.max(0, cfg.homingRange);
  for (let i = 0; i < world.dummies.length; i++) {
    const s = world.dummies[i];
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-3 || d > bestDist) continue;
    if (Math.abs(wrapAngle(Math.atan2(dx, dz) - yaw)) > cone) continue;
    best = i;
    bestDist = d;
  }
  return best;
}

/**
 * 发射一波：perWave 枚菱形飞弹，围绕 channelYaw 均匀散布。
 * 侧向出生偏移让三发在起点就分开（而不是重叠成一个亮点再散开），
 * 视觉上能立刻读出「齐射」而不是「一发变粗」。
 */
function fireWave(world: World): void {
  const a = world.abilities;
  const cfg = world.config.abilities.arcane;
  const p = world.character.position;
  const n = Math.max(1, Math.floor(cfg.perWave));
  const spread = cfg.spreadDeg * DEG;
  const target = pickHomingTarget(world, a.channelYaw);
  const sideStep = 0.16;
  for (let i = 0; i < n; i++) {
    const offset = (i - (n - 1) * 0.5) * spread;
    const yaw = a.channelYaw + offset;
    const side = (i - (n - 1) * 0.5) * sideStep;
    const dx = Math.sin(yaw);
    const dz = Math.cos(yaw);
    const pr: ProjectileState = {
      id: ++a.nextId,
      x: p.x + dx * 0.5 + Math.cos(yaw) * side,
      y: p.y + 1.0,
      z: p.z + dz * 0.5 - Math.sin(yaw) * side,
      dirX: dx,
      dirZ: dz,
      speed: cfg.speed,
      life: cfg.life,
      radius: cfg.radius,
      targetIndex: target,
      turnRate: Math.max(0, cfg.turnRateDeg) * DEG,
      homing: Math.max(0, cfg.homingTime),
      wave: a.waveIndex,
    };
    a.projectiles.push(pr);
    a.volleyId += 1;
    emit(world, 'projectile-fire', a.volleyId, pr);
  }
  emit(world, 'arcane-wave', a.waveIndex, { x: p.x, y: p.y + 1.0, z: p.z });
}

/** 结束引导：立即进入冷却，并要求先松开按键才能重新开始。 */
function endChannel(world: World): void {
  const a = world.abilities;
  if (!a.channeling) return;
  const cfg = world.config.abilities.arcane;
  a.channeling = false;
  a.fireTimer = 0;
  a.cooldown = Math.max(0, cfg.cooldown);
  // 5 波放完 / 被打断都置位：按住不放不会在冷却结束后自动重开，
  // 否则「一次引导 5 波」会退化成无限连发。
  a.needsRelease = true;
  emit(world, 'channel-end', 0, world.character.position);
}

/**
 * 引导状态（channel）：法杖 + 按住攻击键 → 按波次齐射。
 *
 * 与旧版的差别：
 *  - 旧版按 fireInterval **单发**，只要按住就能无限射；
 *  - 新版一次引导固定 `waves` 波（默认 5）、每波 `perWave` 枚（默认 3），
 *    波与波之间 waveInterval（默认 0.22s），放完即结束并进入 cooldown（默认 1s）。
 *  - 冷却期间 / 未松手时不接受新的引导；提前松手、冲刺、切武器都会「打断」并进冷却。
 *
 * 依然刻意不改变 combat.phase（保持 idle），因此移动模块不锁速 ——「按住可以移动引导」。
 */
function updateChannel(world: World, dt: number, intents: Intents): void {
  const a = world.abilities;
  const cfg = world.config.abilities.arcane;
  const dashing = world.dash.phase === 'active';
  const link = world.playerLink;
  const held = world.combat.weapon === 'staff' && intents.attackHeld && !dashing
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
    emit(world, 'channel-start', a.channelId, world.character.position);
  } else if (!held) {
    // 已进入引导但被打断（松手 / 冲刺 / 派生招抢占 / 换武器）
    endChannel(world);
    return;
  }

  a.channelYaw = resolveFacingYaw(world, intents);
  a.fireTimer -= dt;
  let guard = 0;
  while (a.fireTimer <= 0 && guard++ < 8) {
    a.fireTimer += Math.max(cfg.waveInterval, EPS);
    fireWave(world);
    a.waveIndex += 1;
    if (a.waveIndex >= Math.max(1, Math.floor(cfg.waves))) {
      endChannel(world);
      break;
    }
  }
}

/** 技2：原地放置一个电环（世界坐标固定，不随玩家移动）。 */
function placeRing(world: World, intents: Intents): void {
  const cfg = world.config.abilities.ring;
  const dashing = world.dash.phase === 'active';
  if (world.combat.weapon !== 'staff' || !intents.skill2Pressed || dashing) return;
  const p = world.character.position;
  const ring: ShockRingState = {
    id: ++world.abilities.nextId,
    x: p.x,
    z: p.z,
    radius: cfg.radius,
    life: cfg.duration,
    duration: cfg.duration,
    pulseTimer: 0, // 放置瞬间立即结算一次命中
  };
  world.abilities.rings.push(ring);
  emit(world, 'ring-place', ring.id, p);
}

/**
 * 飞弹推进 + 制导 + 命中。
 *
 * 制导是「限速转向」而不是「直接朝目标飞」：每帧最多转 turnRate×dt，
 * 于是近距几乎必中、远距横移目标会擦过 —— 这就是「一点转向修正」的手感来源。
 * 转向只改方向不改速度，弹道长度不受影响。
 */
function updateProjectiles(world: World, dt: number): void {
  const a = world.abilities;
  const cfg = world.config.abilities.arcane;
  const dummyR = world.config.dummies.radius;
  // 命中结算遵守既有模块开关：关闭 hits 或 dummies 时飞弹仍飞行但不写受击 / 计数 / 事件
  const canHit = world.modules.hits && world.modules.dummies;
  const next: ProjectileState[] = [];
  for (const pr of a.projectiles) {
    if (pr.homing > 0) pr.homing = Math.max(0, pr.homing - dt);
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

/** 电环推进 + 脉冲命中：存活期内每 pulseInterval 对范围内所有假人结算一次「僵直 + 轻微击退」。 */
function updateRings(world: World, dt: number): void {
  const a = world.abilities;
  const cfg = world.config.abilities.ring;
  const dummyR = world.config.dummies.radius;
  const canHit = world.modules.hits && world.modules.dummies;
  const next: ShockRingState[] = [];
  for (const r of a.rings) {
    r.life -= dt;
    r.pulseTimer -= dt;
    let guard = 0;
    while (r.pulseTimer <= 0 && guard++ < 8) {
      r.pulseTimer += Math.max(cfg.pulseInterval, EPS);
      if (canHit) {
        for (let i = 0; i < world.dummies.length; i++) {
          const s = world.dummies[i];
          const dx = s.position.x - r.x;
          const dz = s.position.z - r.z;
          const rr = r.radius + dummyR;
          if (dx * dx + dz * dz > rr * rr) continue;
          const len = Math.hypot(dx, dz);
          const nx = len > EPS ? dx / len : 0;
          const nz = len > EPS ? dz / len : 1;
          // 僵直 = 较长的 heavy 受击时长（hurt.timer > 0 时假人 AI 停住）；
          // 从环心向外做轻微击退。
          dealHit(world, i, {
            type: 'heavy',
            duration: cfg.stun,
            dirX: nx,
            dirZ: nz,
            knockback: cfg.knockback,
          });
        }
      }
      emit(world, 'ring-pulse', r.id, { x: r.x, y: 0, z: r.z });
    }
    if (r.life > 0) next.push(r);
  }
  a.rings = next;
}

/**
 * 法杖技能模块：波次齐射奥术飞弹（攻击键按住、可移动）+ 原地电环（技2）。
 * 只读写 world.abilities / dummies[].hurt / hitCount 与事件队列，纯状态转移、确定性。
 * 由 step 在 decayHurt 之后、hits 之前调用：命中读本帧 dummies 更新后的最新假人位置，
 * 且新写入的 hurt 不会在写入当帧被 decayHurt 又衰减一次（与近战命中语义一致）。
 * 对应 C# 形态：static void AbilitiesUpdate(World w, float dt, in Intents i)
 */
export function abilitiesUpdate(world: World, dt: number, intents: Intents): void {
  updateChannel(world, dt, intents);
  placeRing(world, intents);
  updateProjectiles(world, dt);
  updateRings(world, dt);
}
