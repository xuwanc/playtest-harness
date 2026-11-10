import { damageDummy, decideSever, pushHitMark } from './health';
import type { EventType, HitTarget, HurtState, HurtType, MeleeShape, Vec3, World } from './types';

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
  /** v9s.37：本次命中的卡肉倍数（击地冲击这类「一次性爆发」给得更重）；缺省 1 */
  holdMul?: number;
  /**
   * v9s.56：本次命中的伤害点。缺省按 `hits.damage[type] × hits.damageMul[当前武器]` 算。
   * 显式给值只用于「同一把武器不同招式伤害不同」的场合（目前没有），保留接口。
   */
  damage?: number;
  /**
   * v9s.57：本次命中的**部位**（0 = 脚底，1 = 头顶）。缺省按 `hits.hitHeight[type]` 查表。
   * 显式给值用于「同一受击类型、不同招式打在不同高度」（击地 / 斜劈 / 突刺）。
   */
  hitU?: number;
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
  // v9s.56：尸体不再结算命中 —— 否则「打尸体」也会命中计数 / 卡肉 / 喷血，
  // 而且连击会一直挂在已经倒下的人身上。
  if (s.health.dead) return;
  applyHurt(s.hurt, spec.type, duration, spec.dirX, spec.dirZ);
  if (spec.knockback > EPS) {
    // 击退沿用 v7a 的连续速度冲量：v0 = knockback × decay，总后退距离 ≈ knockback
    const v0 = spec.knockback * world.config.hits.knockbackDecay;
    s.hurt.knockX = spec.dirX * v0;
    s.hurt.knockZ = spec.dirZ * v0;
  }
  world.hitCount += 1;
  emit(world, 'hit', s.id, s.position);

  // v9s.56：伤害 / 死亡 / 命中记录。
  // 伤害点按「受击类型查表 × 当前武器倍率」，四条命中链路（近战 / 击地 / 派生招 / 远程）
  // 共用同一处，不会出现「箭能射死、刀不能」。
  const dmg = hitDamage(world, spec);
  // v9s.57：部位按「显式指定 → 受击类型表 → 旧默认」三级取，再夹到 [0.05, 0.98]。
  // 夹紧是因为表现层要拿它乘骨架身高再吸骨骼，u = 0 会落到脚底、u = 1 会出头顶。
  const hh = world.config.hits.hitHeight;
  const tableU = hh && spec.type !== 'none' ? hh[spec.type] : undefined;
  const u = clamp(
    spec.hitU ?? tableU ?? (spec.type === 'knock' ? 0.42 : 0.56),
    0.05, 0.98,
  );
  const power = clamp(0.3 + dmg / 30, 0.3, 1.5);
  // v9s.60：断肢判定只看「这一击是怎么打的」。非致命时 decideSever 的结果不会被用到
  // （killDummy 才写 sever），所以这里不必先判断是否致命。
  const severPart = decideSever(spec.type, u, spec.dirX, spec.dirZ, s.bodyYaw, world.combat.weapon);
  const fatal = damageDummy(world, s, dmg, severPart
    ? { part: severPart, u, dx: spec.dirX, dz: spec.dirZ, power }
    : null);
  // v9s.56：只有「有血可流」的单位才记命中（maxHp = 0 的测试桩是被砍的木桩，
  // 喷血反而读错）。卡肉 / 命中计数 / 受击动画仍照旧 —— 所以不能在这里提前 return。
  if (s.health.maxHp > EPS) {
    pushHitMark(world, {
      x: s.position.x,
      y: s.position.y + world.config.dummies.height * u,
      z: s.position.z,
      u,
      dx: spec.dirX,
      dz: spec.dirZ,
      power: clamp(power + (fatal ? 0.35 : 0), 0.3, 1.5),
      id: s.id,
      fatal,
    });
  }

  // v9s.29 卡肉：命中瞬间按住攻击方的时间轴（见 CombatState.hitstop）。
  // 取「最大值」而不是累加：同一帧多目标命中 / 连段多段命中不会把冻结叠成慢动作。
  const table = world.config.hits.hitstop;
  // v9s.33：分武器档位 —— 同一记「重击」，大剑停得更久（乘性系数，缺省 1）
  let scale = world.config.hits.hitstopByWeapon?.[world.combat.weapon] ?? 1;
  // v9s.37：连段衰减。每击都卡只有在单次很短时才成立，三连收招必须越往后越轻。
  const falloff = world.config.hits.hitstopComboFalloff;
  if (falloff && falloff.length > 0) {
    const i = Math.max(0, Math.min(falloff.length - 1, world.combat.comboIndex - 1));
    scale *= Math.max(0, falloff[i]);
  }
  scale *= Math.max(0, spec.holdMul ?? 1);
  const stop = table && spec.type !== 'none'
    ? (table[spec.type] ?? 0) * Math.max(0, scale)
    : 0;
  if (stop > 0 && world.combat.hitstop < stop) {
    world.combat.hitstop = stop;
    // v9s.37：进入保持期。`animRate` 只跟 `hitstop` 计时，这里写 phase / warp
    // 是为了让表现层与诊断在同帧就能读到「现在在卡肉」。
    world.combat.warpPhase = 1;
    world.combat.warp = world.config.hits.hitstopWarp?.enabled
      ? Math.max(0, Math.min(1, world.config.hits.hitstopWarp.holdRate))
      : 0;
    emit(world, 'hitstop', stop, s.position);
  }
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

/**
 * v9s.56 · 一次命中的伤害点。
 *
 * `damage` 表缺省时返回 0（旧配置：无伤害、打不死），所以加这个模块不需要改任何旧配置。
 */
function hitDamage(world: World, spec: HitSpec): number {
  if (typeof spec.damage === 'number') return Math.max(0, spec.damage);
  const table = world.config.hits.damage;
  if (!table) return 0;
  if (spec.type === 'none') return 0;
  const base = table[spec.type] ?? 0;
  const mul = world.config.hits.damageMul?.[world.combat.weapon] ?? 1;
  return Math.max(0, base) * Math.max(0, mul);
}

/** 线性插值 `[u, angDeg]` 关键点表；u 越界时取端点值。 */
function angleAtPts(pts: Array<[number, number]>, u: number): number {
  if (pts.length === 0) return 0;
  if (u <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [u1, a1] = pts[i];
    if (u <= u1) {
      const [u0, a0] = pts[i - 1];
      const k = u1 > u0 ? (u - u0) / (u1 - u0) : 1;
      return a0 + (a1 - a0) * k;
    }
  }
  return pts[pts.length - 1][1];
}

/** 角度归一到 (-180, 180]。 */
function wrapDeg(a: number): number {
  let x = a;
  while (x > 180) x -= 360;
  while (x < -180) x += 360;
  return x;
}

/**
 * v9s.39 · 本帧近战刀风的水平形状（纯查询，不写 World）。
 *
 * 草块割断、尘土、音效这类「周边系统」不该各自再算一遍扇形：口径漂移后会出现
 * 「打得到人却割不到草」或反之。这里把 playerHits 用的那组量（命中窗口 u、
 * 武器 reach、扇区半角、刃身扫掠门、击地圆）一次性算成 plain data 对外暴露，
 * 计算式逐条与 playerHits / playerGroundSlam 保持一致，并由 tests/grass.test.ts
 * 的一致性用例守护。
 *
 * 刻意**不改** playerHits 主体：876 例里有大量卡肉时机 / 扫掠门的精确断言，
 * 周边功能不应该动主干命中链路。
 */
export function currentMeleeShape(world: World): MeleeShape {
  const cb = world.combat;
  const p = world.character.position;
  const shape: MeleeShape = {
    active: false,
    x: p.x, z: p.z,
    facing: cb.attackFacing,
    fx: Math.sin(cb.attackFacing),
    fz: Math.cos(cb.attackFacing),
    reach: 0,
    cosArc: 1,
    sweepActive: false,
    sweepLo: 0,
    sweepHi: 0,
    slamRadius: 0,
    slamX: p.x,
    slamZ: p.z,
  };
  // 与 hitsUpdate 的闸门一致：只有 active 段才存在刀风；弓的「攻击」只是放箭。
  if (cb.phase !== 'active' || cb.weapon === 'bow') return shape;

  const cfg = world.config.hits;
  const profile = world.config.combat.weapons[cb.weapon];
  const win = profile?.hitWindow;
  const start = win ? Math.min(1, Math.max(0, win.start)) : 0;
  const end = win ? Math.min(1, Math.max(start, win.end)) : 1;
  const activeDur = cb.timings.active;
  const u = activeDur > EPS ? Math.min(1, Math.max(0, cb.phaseTimer / activeDur)) : 1;
  if (u < start - EPS || u > end + EPS) return shape;

  shape.active = true;
  shape.reach = cfg.reach[cb.weapon] ?? 0;
  shape.cosArc = Math.cos(Math.min(90, Math.max(0, cfg.arcDeg)) * DEG);

  // 刃身扫掠门：与 playerHits 同一组关键点 / 容差，突刺段未到位时整段无刀风。
  const sweep = profile?.hitSweep;
  const seg = sweep?.byCombo?.[String(cb.comboIndex)] ?? sweep?.byCombo?.['1'];
  const sweepTol = sweep?.tolDeg ?? 10;
  if (seg) {
    if (typeof seg.stabU === 'number') {
      if (u < seg.stabU) { shape.active = false; return shape; }
    } else if (seg.pts && seg.pts.length >= 2) {
      const a0 = angleAtPts(seg.pts, 0);
      const a1 = angleAtPts(seg.pts, u);
      shape.sweepActive = true;
      shape.sweepLo = Math.min(a0, a1) - sweepTol;
      shape.sweepHi = Math.max(a0, a1) + sweepTol;
    }
  }

  // 击地圆：以 playerGroundSlam 实际触发的那一帧为准（slamAttackId 对齐 attackId）。
  const slam = profile?.groundSlam;
  if (slam && u >= slam.slamU - EPS && cb.slamAttackId === cb.attackId) {
    shape.slamRadius = Math.max(0, slam.radius);
    shape.slamX = p.x + shape.fx * Math.min(shape.slamRadius * 0.25, 0.5);
    shape.slamZ = p.z + shape.fz * Math.min(shape.slamRadius * 0.25, 0.5);
  }
  return shape;
}

/** 某个世界 XZ 点是否落在本帧刀身扇区内（extra = 目标半径放宽量）。 */
export function inMeleeShape(shape: MeleeShape, x: number, z: number, extra: number): boolean {
  if (!shape.active) return false;
  const dx = x - shape.x;
  const dz = z - shape.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  if (dist > shape.reach + extra) return false;
  if (dist > EPS && (dx * shape.fx + dz * shape.fz) / dist < shape.cosArc) return false;
  if (shape.sweepActive) {
    const theta = wrapDeg(Math.atan2(dx, dz) / DEG - shape.facing / DEG);
    if (theta < shape.sweepLo || theta > shape.sweepHi) return false;
  }
  return true;
}

/** 某个世界 XZ 点是否落在本帧击地圆内。 */
export function inSlamShape(shape: MeleeShape, x: number, z: number, extra: number): boolean {
  if (shape.slamRadius <= 0) return false;
  const dx = x - shape.slamX;
  const dz = z - shape.slamZ;
  return dx * dx + dz * dz <= (shape.slamRadius + extra) * (shape.slamRadius + extra);
}

/** 玩家攻击在命中窗口内的扫描：扇区 + 武器距离 + 受击类型 + 击退。 */
function playerHits(world: World): void {
  const cb = world.combat;
  const cfg = world.config.hits;
  const p = world.character.position;
  // v9s.18：弓箭的「攻击」只是放箭动作，伤害完全由 Core 的箭矢实体（arrows.ts）结算。
  // 旧版这里会对 reach.bow = 9m、arc 65° 做一次近战扇形扫描 —— 箭还没飞到、甚至射空，
  // 前方一片假人就全部受击 / 计数（用户反馈的「没打到人却多人受击」）。
  if (cb.weapon === 'bow') return;

  // v9s.31：命中窗口。旧版只在 `attack-active` 那一帧扫一次，挥到一半才走进刀风的
  // 敌人吃不到伤害；现在整个窗口内每帧都扫，靠 hitIds 保证「同一目标本次攻击只结算一次」。
  const profile = world.config.combat.weapons[cb.weapon];
  const win = profile?.hitWindow;
  const start = win ? Math.min(1, Math.max(0, win.start)) : 0;
  const end = win ? Math.min(1, Math.max(start, win.end)) : 1;
  const activeDur = cb.timings.active;
  const u = activeDur > EPS ? Math.min(1, Math.max(0, cb.phaseTimer / activeDur)) : 1;
  if (u < start - EPS || u > end + EPS) return;

  const reach = cfg.reach[cb.weapon] ?? 0;
  const cosArc = Math.cos(Math.min(90, Math.max(0, cfg.arcDeg)) * DEG);
  const fx = Math.sin(cb.attackFacing);
  const fz = Math.cos(cb.attackFacing);
  const extra = world.config.dummies.radius;
  const ideal = world.config.targeting.idealRange;

  // v9s.36：刃身扫掠门。
  // 旧版从 active 第 0 帧就判定，此刻 `swingCurve` 仍是 -1（刃身在身后蓄势），
  // 但扇形 + reach 已经满足 —— 于是「刀还没挥出去」就命中并卡肉，画面定格在起手姿态。
  // 现在要求「本帧刃身扫过的角度区间」覆盖目标方位角才结算：
  //   · pts 段：区间 = [ang(0), ang(u)] 按 tolDeg 放宽；
  //   · 突刺段（刃尖角几乎不变）：u < stabU 一律不结算，到点位再判。
  const sweep = profile?.hitSweep;
  const seg = sweep?.byCombo?.[String(cb.comboIndex)] ?? sweep?.byCombo?.['1'];
  const sweepTol = sweep?.tolDeg ?? 10;
  let sweepLo = 0;
  let sweepHi = 0;
  let sweepActive = false;
  if (seg) {
    if (typeof seg.stabU === 'number') {
      // 突刺：刃身还没伸出去，整段先不判
      if (u < seg.stabU) return;
    } else if (seg.pts && seg.pts.length >= 2) {
      const a0 = angleAtPts(seg.pts, 0);
      const a1 = angleAtPts(seg.pts, u);
      sweepLo = Math.min(a0, a1) - sweepTol;
      sweepHi = Math.max(a0, a1) + sweepTol;
      sweepActive = true;
    }
  }

  for (const s of world.dummies) {
    // v9s.31：本次攻击已经结算过的目标跳过 —— 窗口内每帧都会扫，
    // 没有这张表就会把一击掉成十几击。
    if (cb.hitIds.indexOf(s.id) >= 0) continue;
    // v9s.56：尸体不结算（也就不会把 hitIds 花在它身上，旁边活着的人还能被打到）
    if (s.health.dead) continue;
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist > reach + extra) continue;
    const nx = dist > EPS ? dx / dist : fx;
    const nz = dist > EPS ? dz / dist : fz;
    if (dist > EPS && (dx * fx + dz * fz) / dist < cosArc) continue;
    // 目标方位角（相对身体朝向）必须落在本帧的扫掠区间内 —— 否则刀还没到
    if (sweepActive) {
      const theta = wrapDeg(Math.atan2(dx, dz) / DEG - cb.attackFacing / DEG);
      if (theta < sweepLo || theta > sweepHi) continue;
    }

    // 受击类型：大剑 = 击退重击，弓 / 三段收招 = 重击，其余 = 轻击
    let type: HurtType = 'light';
    if (cb.weapon === 'greatsword') type = 'knock';
    else if (cb.comboIndex >= 3) type = 'heavy';

    const kb = cfg.knockback[cb.weapon] ?? 0;
    let targetDist = dist;
    if (kb > 0) targetDist = Math.max(dist + kb, ideal);
    const push = Math.max(0, targetDist - dist);

    // v9s.57：血位按招式档位再压一档 —— 三连收招是下劈、大剑本来就砍腰腹，
    // 不能和第一段平挥喷在同一个高度。
    const baseU = cfg.hitHeight?.[type] ?? (type === 'knock' ? 0.42 : 0.56);
    const hitU = clamp(
      baseU - (cb.comboIndex >= 3 ? 0.14 : 0) - (cb.weapon === 'greatsword' ? 0.05 : 0),
      0.18, 0.92,
    );

    dealHit(world, world.dummies.indexOf(s), {
      type,
      duration: hurtDuration(world, type),
      dirX: nx,
      dirZ: nz,
      knockback: push,
      hitU,
    });
    cb.hitIds.push(s.id);
  }
}

/**
 * v9s.37 · 击地范围攻击（大剑第三击）。
 *
 * 刀身扫掠是「正面一条线」，砸地是「圆心一圈」：到达 `slamU` 时以落点为圆心结算
 * 一次圆形命中，把侧面 / 贴身的目标也震到。与刀身共用 `hitIds`：
 * `onlyUnhit` 默认 true 时不重复掉血，只扩大覆盖。
 *
 * 放在 `playerHits` 之后跑：同一帧里正面先按刀结算，击地只补「刀没碰到的人」。
 */
function playerGroundSlam(world: World): void {
  const cb = world.combat;
  const profile = world.config.combat.weapons[cb.weapon];
  const slam = profile?.groundSlam;
  if (!slam) return;
  if (cb.slamAttackId === cb.attackId) return;   // 本次攻击已经震过

  const activeDur = cb.timings.active;
  const u = activeDur > EPS ? Math.min(1, Math.max(0, cb.phaseTimer / activeDur)) : 1;
  if (u < slam.slamU - EPS) return;

  cb.slamAttackId = cb.attackId;

  const cfg = world.config.hits;
  const p = world.character.position;
  const fx = Math.sin(cb.attackFacing);
  const fz = Math.cos(cb.attackFacing);
  const extra = world.config.dummies.radius;
  const radius = Math.max(0, slam.radius);
  const onlyUnhit = slam.onlyUnhit !== false;
  const type: HurtType = slam.type
    ?? (cb.weapon === 'greatsword' ? 'knock' : 'heavy');
  const kb = slam.knockback ?? (cfg.knockback[cb.weapon] ?? 0);
  const ideal = world.config.targeting.idealRange;
  const holdMul = slam.holdMul ?? 1.6;

  for (let i = 0; i < world.dummies.length; i++) {
    const s = world.dummies[i];
    if (onlyUnhit && cb.hitIds.indexOf(s.id) >= 0) continue;
    if (s.health.dead) continue;
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist > radius + extra) continue;

    // 击退方向：从落点径向向外；贴身（dist≈0）时退回正前，避免方向随机
    const nx = dist > EPS ? dx / dist : fx;
    const nz = dist > EPS ? dz / dist : fz;
    const targetDist = kb > 0 ? Math.max(dist + kb, ideal) : dist;
    const push = Math.max(0, targetDist - dist);

    dealHit(world, i, {
      type,
      duration: hurtDuration(world, type),
      dirX: nx,
      dirZ: nz,
      knockback: push,
      holdMul,
      // v9s.57：贴地砸出来的血在脚踝 / 小腿，不是胸口
      hitU: 0.26,
    });
    cb.hitIds.push(s.id);
  }

  // 无论有没有打到人，落地本身都要有表现（尘环 / 震动）—— 空砸也要「砸到地上」
  emit(world, 'ground-slam', radius, {
    x: p.x + fx * Math.min(radius * 0.25, 0.5),
    y: p.y,
    z: p.z + fz * Math.min(radius * 0.25, 0.5),
  });
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
    if (s.health.dead) continue;

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
  const fighters = world.config.dummies.fighters;
  const p = world.character.position;
  for (const e of world.events) {
    if (e.type !== 'dummy-hit') continue;
    const s = world.dummies[e.value - 1];
    if (!s) continue;
    // v9s.56：死人不砍人（事件是死前发的话，这一帧已经死了就别结算）
    if (s.health.dead) continue;
    // v9s.38：持械陪练用「它手里那把武器」的 reach / 击退，普通假人仍用 dummyReach。
    // 这样大剑陪练隔着 2m 也能砍到、双刀必须贴身，混战的距离判断才是真的。
    const reach = s.weapon ? (cfg.reach[s.weapon] ?? cfg.dummyReach) : cfg.dummyReach;
    const dx = p.x - s.position.x;
    const dz = p.z - s.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > reach) continue;
    const nx = dist > EPS ? dx / dist : 0;
    const nz = dist > EPS ? dz / dist : 1;
    const kbBase = s.weapon
      ? Math.max(cfg.knockback[s.weapon] ?? 0, cfg.dummyKnockback)
      : cfg.dummyKnockback;
    const kb = kbBase * (s.weapon ? (fighters?.knockbackScale ?? 1) : 1);
    // v9s.39：大剑的 `knock` 档只给**一轮连击的最后一段** —— 与主角第三击才是重击同构。
    // 三段全按 knock 的话，0.42s 受击 × 3 会把玩家打得一拖一拖，读起来不是连击是「卡住」。
    const heavy = s.weapon === 'greatsword' && s.attackComboLeft <= 0;
    const type = heavy ? 'knock' : 'light';
    // 长期「无伤害契约」默认由 noDamageToPlayer 保证：只写受击动画，不推玩家位置 / 速度。
    // 关掉开关后按与假人完全相同的公式施加击退（dummyKnockback），机制本身是对称的。
    applyHit(world, { kind: 'player' }, {
      type,
      duration: hurtDuration(world, type),
      dirX: nx,
      dirZ: nz,
      knockback: kb,
      sourceId: s.id,
    });
  }
}

/**
 * 命中 / 受击 / 击退模块：近战按命中窗口扫描 + 派生招扫掠 + 假人挥砍结算。
 * 与 combat / dummies 解耦：只靠显式事件队列与 world 状态通信，不互相调用。
 * 对应 C# 形态：static void HitsUpdate(World w, float dt)
 */
export function hitsUpdate(world: World, dt: number): void {
  if (!world.modules.hits) return;
  // v9s.31：从「attack-active 那一帧」改为「active 段内每帧」，窗口与去重都在 playerHits 里。
  if (world.combat.phase === 'active') {
    playerHits(world);
    // v9s.37：先刀身后击地 —— 正面目标按刀结算，击地只补侧面 / 贴身
    playerGroundSlam(world);
  }
  scanLinkHits(world, dt);
  dummyHits(world);
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
