import type { EventType, HitTarget, HurtState, HurtType, Vec3, World } from './types';

/** 一次命中结算的完整描述（近战与法杖技能共用）。 */
export type HitSpec = {
  type: HurtType;
  /** 受击时长（秒）；<= 0 时按类型取默认 hurtDuration */
  duration: number;
  /** 受击方向 / 击退方向（单位向量，世界 XZ） */
  dirX: number;
  dirZ: number;
  /** 击退距离（米），换算成速度冲量；0 = 不击退 */
  knockback: number;
  /** 攻击者 id（仅用于 player-hurt 事件的 value；0 = 未知 / 环境） */
  sourceId?: number;
};

const EPS = 1e-6;
const DEG = Math.PI / 180;

/** 「从未受击」哨兵：用大负数而非 -Infinity，保证 JSON 快照往返不丢失。 */
export const NEVER_HURT_AT = -1e9;

export function initialHurt(): HurtState {
  return {
    type: 'none', lastAt: NEVER_HURT_AT, timer: 0, duration: 0,
    dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
  };
}

function emit(world: World, type: EventType, value: number, at: Vec3): void {
  world.events.push({ type, tick: world.tick, x: at.x, y: at.y, z: at.z, value });
}

function applyHurt(h: HurtState, type: HurtType, duration: number, dirX: number, dirZ: number): void {
  h.type = type;
  h.duration = duration;
  h.timer = duration;
  h.dirX = dirX;
  h.dirZ = dirZ;
  // 新一次受击先清空上一轮残留的击退速度，下面按需重新写入
  h.knockX = 0;
  h.knockZ = 0;
}

/**
 * 命中结算的唯一出口（v9a 对称机制）：玩家与假人走同一套规则。
 *  - kind='dummy'：写假人受击 + 连续击退冲量 + hitCount + hit 事件；
 *  - kind='player'：写玩家受击动画；noDamageToPlayer=true（测试开关）时不施加击退 / 伤害，
 *    关闭后按与假人完全相同的公式施加击退（v0 = knockback × decay）。
 *
 * 「假人不能击退玩家、不造成伤害」只是 hits.noDamageToPlayer 这个配置开关，
 * 不是写死在代码里的机制差异 —— 假人与主角同构，开关关掉后完全对称。
 * 近战 playerHits / dummyHits、法杖技能（飞弹 / 电环）、派生招全部调用它。
 */
export function applyHit(world: World, target: HitTarget, spec: HitSpec): void {
  const duration = spec.duration > 0 ? spec.duration : hurtDuration(world, spec.type);

  if (target.kind === 'player') {
    const h = world.playerHurt;
    applyHurt(h, spec.type, duration, spec.dirX, spec.dirZ);
    h.lastAt = world.time;   // v9s.7：接敌准备用「最近一次受击时刻」做维持判定
    if (!world.config.hits.noDamageToPlayer && spec.knockback > EPS) {
      const v0 = spec.knockback * world.config.hits.knockbackDecay;
      h.knockX = spec.dirX * v0;
      h.knockZ = spec.dirZ * v0;
    }
    emit(world, 'player-hurt', spec.sourceId ?? 0, world.character.position);
    return;
  }

  const s = world.dummies[target.index];
  if (!s) return;
  applyHurt(s.hurt, spec.type, duration, spec.dirX, spec.dirZ);
  if (spec.knockback > EPS) {
    // 击退沿用 v7a 的连续速度冲量：v0 = knockback × decay，总后退距离 ≈ knockback
    const v0 = spec.knockback * world.config.hits.knockbackDecay;
    s.hurt.knockX = spec.dirX * v0;
    s.hurt.knockZ = spec.dirZ * v0;
  }
  world.hitCount += 1;
  emit(world, 'hit', s.id, s.position);
}

/** 兼容既有调用：作用于指定序号的假人（abilities / playerHits）。 */
export function dealHit(world: World, index: number, spec: HitSpec): void {
  applyHit(world, { kind: 'dummy', index }, spec);
}

/**
 * 所有受击计时统一衰减。timer 归零时把 type 复位为 none，其余字段保持不变，
 * 因此初始全零的受击状态在纯衰减下逐字节不变（模块关闭时的冻结语义）。
 * 独立于命中判定，保证关掉 hits 模块时受击动画仍能自然结束。
 */
export function decayHurt(world: World, dt: number): void {
  const states: HurtState[] = [world.playerHurt];
  for (const s of world.dummies) states.push(s.hurt);
  const decay = Math.exp(-world.config.hits.knockbackDecay * dt);
  for (const h of states) {
    if (h.timer > 0) {
      h.timer = Math.max(0, h.timer - dt);
      if (h.timer === 0) {
        h.type = 'none';
        h.knockX = 0;
        h.knockZ = 0;
      }
    }
    // 击退速度独立衰减：无论是否还在受击僵直，速度都平滑归零，形成连续后退
    if (h.knockX !== 0 || h.knockZ !== 0) {
      h.knockX *= decay;
      h.knockZ *= decay;
      if (Math.abs(h.knockX) < 1e-4) h.knockX = 0;
      if (Math.abs(h.knockZ) < 1e-4) h.knockZ = 0;
    }
  }
}

function hurtDuration(world: World, type: HurtType): number {
  const c = world.config.hits;
  if (type === 'knock') return c.hurtKnock;
  if (type === 'heavy') return c.hurtHeavy;
  return c.hurtLight;
}

/** 玩家攻击在 active 帧的命中扫描：扇区 + 武器距离 + 受击类型 + 击退。 */
function playerHits(world: World): void {
  const cb = world.combat;
  const cfg = world.config.hits;
  const p = world.character.position;
  const reach = cfg.reach[cb.weapon] ?? 0;
  const cosArc = Math.cos(Math.min(90, Math.max(0, cfg.arcDeg)) * DEG);
  const fx = Math.sin(cb.attackFacing);
  const fz = Math.cos(cb.attackFacing);
  const extra = world.config.dummies.radius;
  const ideal = world.config.targeting.idealRange;

  for (const s of world.dummies) {
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist > reach + extra) continue;
    const nx = dist > EPS ? dx / dist : fx;
    const nz = dist > EPS ? dz / dist : fz;
    if (dist > EPS && (dx * fx + dz * fz) / dist < cosArc) continue;

    // 受击类型：大剑 = 击退重击，弓 / 三段收招 = 重击，其余 = 轻击
    let type: HurtType = 'light';
    if (cb.weapon === 'greatsword') type = 'knock';
    else if (cb.weapon === 'bow' || cb.comboIndex >= 3) type = 'heavy';

    const kb = cfg.knockback[cb.weapon] ?? 0;
    let targetDist = dist;
    if (kb > 0) targetDist = Math.max(dist + kb, ideal);
    const push = Math.max(0, targetDist - dist);

    dealHit(world, world.dummies.indexOf(s), {
      type,
      duration: hurtDuration(world, type),
      dirX: nx,
      dirZ: nz,
      knockback: push,
    });
  }
}

/**
 * v9a：派生招在 active 阶段沿「本帧位移线段」做扫掠命中。
 *  - 线段是 links 记录的 fromX/fromZ（movement 之前）→ 当前位置（movement 之后），
 *    因此一帧冲锋几米也不会穿过目标（capsule 判定）；
 *  - hitIds 保证每个目标在一次招式里只结算一次；
 *  - 形状可配置：capsule / sector / cone / circle，命中效果统一走 applyHit；
 *  - 不做背后命中（与「不做背后索敌」一致）：用起点→目标方向与锁定朝向的夹角过滤；
 *  - 遵守 hits / dummies 模块开关，关闭时不写受击。
 */
export function scanLinkHits(world: World, dt: number): void {
  const cfg = world.config.links;
  const l = world.playerLink;
  if (!cfg.enabled || l.phase !== 'active') return;
  const move = l.weapon === '' ? undefined : cfg.moves[l.weapon];
  if (!move || !move.enabled) return;
  if (!world.modules.hits || !world.modules.dummies) return;
  const hit = move.hit;

  l.pulseTimer -= dt;
  if (l.pulseTimer > 0) return;
  l.pulseTimer = Math.max(hit.pulseInterval, 0);

  const p = world.character.position;
  const x0 = l.fromX;
  const z0 = l.fromZ;
  const x1 = p.x;
  const z1 = p.z;
  const segX = x1 - x0;
  const segZ = z1 - z0;
  const seg2 = segX * segX + segZ * segZ;
  const fx = Math.sin(l.facing);
  const fz = Math.cos(l.facing);
  const cosArc = Math.cos(clamp(hit.arcDeg, 0, 180) * DEG);
  const dummyR = world.config.dummies.radius;

  for (let i = 0; i < world.dummies.length; i++) {
    const s = world.dummies[i];
    if (l.hitIds.indexOf(s.id) >= 0) continue;

    const t = seg2 > EPS
      ? clamp(((s.position.x - x0) * segX + (s.position.z - z0) * segZ) / seg2, 0, 1)
      : 0;
    const cx = x0 + segX * t;
    const cz = z0 + segZ * t;
    const segDist = Math.hypot(s.position.x - cx, s.position.z - cz);

    let inShape = false;
    if (hit.shape === 'circle') {
      inShape = segDist <= hit.radius + dummyR;
    } else if (hit.shape === 'capsule') {
      inShape = segDist <= Math.max(hit.radius, hit.width) + dummyR;
    } else {
      // sector / cone：终点扇形 + 路径扫掠并集（高速冲锋时也能命中路径上的敌人）
      const ddx = s.position.x - x1;
      const ddz = s.position.z - z1;
      const d = Math.hypot(ddx, ddz);
      const front = d > EPS ? (ddx * fx + ddz * fz) / d >= cosArc : true;
      inShape = (d <= hit.radius + dummyR && front) || segDist <= hit.width + dummyR;
    }
    if (!inShape) continue;

    // 不做背后命中：从冲锋起点指向目标的方向必须落在锁定朝向的前半球内
    const vx = s.position.x - x0;
    const vz = s.position.z - z0;
    const vl = Math.hypot(vx, vz);
    if (vl > EPS && (vx * fx + vz * fz) / vl < Math.cos(Math.max(hit.arcDeg, 90) * DEG)) continue;

    const nx = vl > EPS ? vx / vl : fx;
    const nz = vl > EPS ? vz / vl : fz;
    applyHit(world, { kind: 'dummy', index: i }, {
      type: hit.type,
      duration: hit.duration,
      dirX: nx,
      dirZ: nz,
      knockback: hit.knockback,
    });
    l.hitIds.push(s.id);
    emit(world, 'link-hit', s.id, s.position);
  }
}

/** 假人挥砍在 active 帧命中玩家：走同一个 applyHit（对称），受测试开关约束。 */
function dummyHits(world: World): void {
  const cfg = world.config.hits;
  const p = world.character.position;
  for (const e of world.events) {
    if (e.type !== 'dummy-hit') continue;
    const s = world.dummies[e.value - 1];
    if (!s) continue;
    const dx = p.x - s.position.x;
    const dz = p.z - s.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > cfg.dummyReach) continue;
    const nx = dist > EPS ? dx / dist : 0;
    const nz = dist > EPS ? dz / dist : 1;
    // 长期「无伤害契约」默认由 noDamageToPlayer 保证：只写受击动画，不推玩家位置 / 速度。
    // 关掉开关后按与假人完全相同的公式施加击退（dummyKnockback），机制本身是对称的。
    applyHit(world, { kind: 'player' }, {
      type: 'light',
      duration: hurtDuration(world, 'light'),
      dirX: nx,
      dirZ: nz,
      knockback: cfg.dummyKnockback,
      sourceId: s.id,
    });
  }
}

/**
 * 命中 / 受击 / 击退模块：消费本帧的 attack-active / dummy-hit 事件与派生招扫掠。
 * 与 combat / dummies 解耦：只靠显式事件队列与 world 状态通信，不互相调用。
 * 对应 C# 形态：static void HitsUpdate(World w, float dt)
 */
export function hitsUpdate(world: World, dt: number): void {
  if (!world.modules.hits) return;
  const active = world.events.some((e) => e.type === 'attack-active');
  if (active) playerHits(world);
  scanLinkHits(world, dt);
  dummyHits(world);
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
