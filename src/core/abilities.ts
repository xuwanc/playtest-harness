import { resolveFacingYaw } from './aim';
import { dealHit } from './hits';
import type { AbilityState, EventType, Intents, ProjectileState, ShockRingState, World } from './types';

const EPS = 1e-6;

function emit(world: World, type: EventType, value: number, at: { x: number; y: number; z: number }): void {
  world.events.push({ type, tick: world.tick, x: at.x, y: at.y, z: at.z, value });
}

export function initialAbilityState(): AbilityState {
  return {
    channeling: false,
    channelYaw: 0,
    fireTimer: 0,
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
  // volleyId / nextId 持久递增不倒退：表现层用「id 变化」触发一次性特效，
  // 复位若清零会与残留特效冲突；飞弹 / 电环实体本身清空即可。
  a.projectiles.length = 0;
  a.rings.length = 0;
}

/** 生成一枚奥术飞弹：从角色身前一点沿引导朝向飞出。 */
function fireProjectile(world: World): void {
  const a = world.abilities;
  const cfg = world.config.abilities.arcane;
  const p = world.character.position;
  const dx = Math.sin(a.channelYaw);
  const dz = Math.cos(a.channelYaw);
  const spawn = 0.55; // 从身前一点生成，避免与角色体素重叠
  const pr: ProjectileState = {
    id: ++a.nextId,
    x: p.x + dx * spawn,
    y: p.y + 1.0,
    z: p.z + dz * spawn,
    dirX: dx,
    dirZ: dz,
    speed: cfg.speed,
    life: cfg.life,
    radius: cfg.radius,
  };
  a.projectiles.push(pr);
  a.volleyId += 1;
  emit(world, 'projectile-fire', a.volleyId, pr);
}

/**
 * 引导状态（channel）：法杖 + 按住攻击键 → 持续引导。
 * 刻意不改变 combat.phase（保持 idle），因此移动模块不锁速 —— 「按住可以移动引导」。
 * 每次进入引导立即发第一枚，之后按 fireInterval 定间隔发射；朝向每帧用 resolveFacingYaw
 * 刷新，因此攻击按钮拖拽可以实时调整飞弹方向（v7c #11）。
 */
function updateChannel(world: World, dt: number, intents: Intents): void {
  const a = world.abilities;
  const cfg = world.config.abilities.arcane;
  const dashing = world.dash.phase === 'active';
  // v9a「屏蔽引导」：窗口内 attackPressed 优先给派生通道（Phase 2 法杖冰环启用后即为冰环），
  // 派生招进行中也不叠加引导。Phase 1 法杖招式 enabled=false，按住仍可正常引导。
  const link = world.playerLink;
  const want = world.combat.weapon === 'staff' && intents.attackHeld && !dashing
    && link.phase === 'idle' && !link.consumedAttack;

  if (want) {
    if (!a.channeling) {
      a.channeling = true;
      a.fireTimer = 0; // 立即第一发
      emit(world, 'channel-start', 0, world.character.position);
    }
    a.channelYaw = resolveFacingYaw(world, intents);
    a.fireTimer -= dt;
    let guard = 0;
    while (a.fireTimer <= 0 && guard++ < 8) {
      a.fireTimer += Math.max(cfg.fireInterval, EPS);
      fireProjectile(world);
    }
  } else if (a.channeling) {
    a.channeling = false;
    emit(world, 'channel-end', 0, world.character.position);
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

/** 飞弹推进 + 命中：命中即结算并销毁，超时飞弹移除。 */
function updateProjectiles(world: World, dt: number): void {
  const a = world.abilities;
  const cfg = world.config.abilities.arcane;
  const dummyR = world.config.dummies.radius;
  // 命中结算遵守既有模块开关：关闭 hits 或 dummies 时飞弹仍飞行但不写受击 / 计数 / 事件
  const canHit = world.modules.hits && world.modules.dummies;
  const next: ProjectileState[] = [];
  for (const pr of a.projectiles) {
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
 * 法杖技能模块：引导奥术飞弹（攻击键按住、可移动）+ 原地电环（技2）。
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
