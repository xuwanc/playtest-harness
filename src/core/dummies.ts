import { overlapsAny, resolveHorizontal, supportHeight } from './collision';
import { initialHurt } from './hits';
import { initialLinkState, resetLinkEntity } from './links';
import { nextRandom } from './random';
import { DUMMY_MODES } from './types';
import type {
  DummyConfig,
  DummyMode,
  DummyState,
  EventType,
  Intents,
  World,
} from './types';

const EPS = 1e-6;
const TAU = Math.PI * 2;

/** 怪物转身速率（1/s）：身体慢、头快，与主角 orientation 同思路（v7b#9）。 */
const DUMMY_BODY_TURN = 7;
const DUMMY_HEAD_TURN = 18;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** 角度归一化到 (-π, π]，走最短弧。 */
function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/** 帧率无关的指数趋近（走最短弧），rate 越大越快。 */
function approach(current: number, target: number, rate: number, dt: number): number {
  return current + wrapAngle(target - current) * (1 - Math.exp(-Math.max(rate, EPS) * dt));
}

function emitDummy(world: World, type: EventType, s: DummyState): void {
  world.events.push({
    type,
    tick: world.tick,
    x: s.position.x,
    y: s.position.y,
    z: s.position.z,
    value: s.id,
  });
}

/** 按配置创建假人。初始朝向 0（+Z），即面向相机，便于肉眼验收。 */
export function createDummies(cfg: DummyConfig): DummyState[] {
  const list: DummyState[] = [];
  for (let i = 0; i < cfg.count; i++) {
    const home = cfg.spawn[i] ?? { x: 0, z: 0 };
    const mode = cfg.initialModes[i] ?? 'idle';
    list.push({
      id: i + 1,
      mode,
      initialMode: mode,
      homeX: home.x,
      homeZ: home.z,
      position: { x: home.x, y: 0, z: home.z },
      velocity: { x: 0, y: 0, z: 0 },
      facing: 0,
      bodyYaw: 0,
      headYaw: 0,
      gaitPhase: 0,
      distance: 0,
      targetX: home.x,
      targetZ: home.z,
      wanderTimer: 0,
      attackCooldown: 0,
      attackPhase: 'idle',
      attackPhaseTimer: 0,
      attackProgress: 0,
      attackId: 0,
      hurt: initialHurt(),
      link: initialLinkState(), // v9a：与主角完全同构的派生招状态
    });
  }
  return list;
}

/** 点击一次往后轮转一种行为：游走 → 跟随 → 保持距离 → 攻击 → 待机 → 游走。 */
export function cycleDummyMode(mode: DummyMode): DummyMode {
  const i = DUMMY_MODES.indexOf(mode);
  return DUMMY_MODES[(i + 1) % DUMMY_MODES.length];
}

/**
 * 复位到配置里的初始位置与初始模式。
 * attackId 故意不归零：保持单调递增，表现层才不会把复位误判成一次新起手。
 */
export function resetDummies(world: World): void {
  const cfg = world.config.dummies;
  for (let i = 0; i < world.dummies.length; i++) {
    const s = world.dummies[i];
    const home = cfg.spawn[i] ?? { x: s.homeX, z: s.homeZ };
    const mode = cfg.initialModes[i] ?? s.initialMode;
    s.mode = mode;
    s.initialMode = mode;
    s.homeX = home.x;
    s.homeZ = home.z;
    s.position.x = home.x;
    s.position.y = 0;
    s.position.z = home.z;
    s.velocity.x = 0;
    s.velocity.y = 0;
    s.velocity.z = 0;
    s.facing = 0;
    s.bodyYaw = 0;
    s.headYaw = 0;
    s.gaitPhase = 0;
    s.distance = 0;
    s.targetX = home.x;
    s.targetZ = home.z;
    s.wanderTimer = 0;
    s.attackCooldown = 0;
    s.attackPhase = 'idle';
    s.attackPhaseTimer = 0;
    s.attackProgress = 0;
    const h = s.hurt;
    h.type = 'none';
    h.timer = 0;
    h.duration = 0;
    h.dirX = 0;
    h.dirZ = 0;
    h.knockX = 0;
    h.knockZ = 0;
    resetLinkEntity(s.link);
  }
  world.dummyAttackCount = 0;
}

/** 在 home 半径内取一个随机游走目标；随机源是 world 的种子随机，保证可复现。 */
function pickWanderTarget(world: World, s: DummyState, cfg: DummyConfig): void {
  const angle = nextRandom(world) * TAU;
  const radius = Math.sqrt(nextRandom(world)) * cfg.wanderRadius;
  s.targetX = s.homeX + Math.cos(angle) * radius;
  s.targetZ = s.homeZ + Math.sin(angle) * radius;
  s.wanderTimer = cfg.wanderInterval * (0.6 + nextRandom(world) * 0.8);
}

function attackDuration(s: DummyState, cfg: DummyConfig): number {
  if (s.attackPhase === 'windup') return cfg.attackWindup;
  if (s.attackPhase === 'active') return cfg.attackActive;
  if (s.attackPhase === 'recovery') return cfg.attackRecovery;
  return 0;
}

/** 假人挥砍三段状态机；无伤害，只驱动表现层与事件。active 进入时发 dummy-hit 供命中模块消费。 */
function advanceAttack(world: World, s: DummyState, dt: number, cfg: DummyConfig): void {
  if (s.attackPhase === 'idle') {
    s.attackProgress = 0;
    return;
  }
  s.attackPhaseTimer += dt;
  let guard = 0;
  while (s.attackPhase !== 'idle' && guard++ < 4) {
    const dur = Math.max(attackDuration(s, cfg), EPS);
    if (s.attackPhaseTimer < dur) break;
    s.attackPhaseTimer -= dur;
    if (s.attackPhase === 'windup') {
      s.attackPhase = 'active';
      emitDummy(world, 'dummy-hit', s);
    } else if (s.attackPhase === 'active') s.attackPhase = 'recovery';
    else {
      s.attackPhase = 'idle';
      s.attackPhaseTimer = 0;
    }
  }
  const total = cfg.attackWindup + cfg.attackActive + cfg.attackRecovery;
  let elapsed = 0;
  if (s.attackPhase === 'windup') elapsed = s.attackPhaseTimer;
  else if (s.attackPhase === 'active') elapsed = cfg.attackWindup + s.attackPhaseTimer;
  else if (s.attackPhase === 'recovery') {
    elapsed = cfg.attackWindup + cfg.attackActive + s.attackPhaseTimer;
  }
  s.attackProgress = s.attackPhase === 'idle' || total <= 0 ? 0 : Math.min(1, elapsed / total);
}

/** 计算本帧期望 movement 方向与朝向（全部是相对玩家 / home 的纯数值）。 */
function desiredDirection(
  world: World,
  s: DummyState,
  cfg: DummyConfig,
): { x: number; z: number; facing: number } {
  // 受击僵直：短暂停止主动移动，让后仰 / 击退看得出来（不影响已开始的挥砍）
  if (s.hurt.timer > 0) return { x: 0, z: 0, facing: s.facing };
  const p = world.character.position;
  const dx = p.x - s.position.x;
  const dz = p.z - s.position.z;
  const dist = Math.hypot(dx, dz);
  const nx = dist > EPS ? dx / dist : 0;
  const nz = dist > EPS ? dz / dist : 0;
  let x = 0;
  let z = 0;

  if (s.mode === 'wander') {
    const tdx = s.targetX - s.position.x;
    const tdz = s.targetZ - s.position.z;
    const td = Math.hypot(tdx, tdz);
    if (s.wanderTimer <= 0 || td < 0.3) pickWanderTarget(world, s, cfg);
    const ndx = s.targetX - s.position.x;
    const ndz = s.targetZ - s.position.z;
    const nd = Math.hypot(ndx, ndz);
    if (nd > EPS) {
      x = ndx / nd;
      z = ndz / nd;
    }
  } else if (s.mode === 'follow') {
    if (dist > cfg.followStopDistance) {
      x = nx;
      z = nz;
    }
  } else if (s.mode === 'keep-distance') {
    const err = dist - cfg.keepDistance;
    if (err > cfg.keepDeadZone) {
      x = nx;
      z = nz;
    } else if (err < -cfg.keepDeadZone) {
      x = -nx;
      z = -nz;
    } else {
      // 距离已进入死区：绕着玩家侧移，让「保持一定距离」看得出来而不是僵住
      x = -nz * cfg.keepStrafe;
      z = nx * cfg.keepStrafe;
    }
  } else if (s.mode === 'attack') {
    // 挥砍过程中站定，不追击
    if (dist > cfg.attackRange && s.attackPhase === 'idle') {
      x = nx;
      z = nz;
    }
  }

  let facing = s.facing;
  if (s.mode === 'wander') {
    if (Math.hypot(x, z) > EPS) facing = Math.atan2(x, z);
  } else if (dist > EPS) {
    facing = Math.atan2(nx, nz);
  }
  return { x, z, facing };
}

function updateOne(world: World, dt: number, s: DummyState, cfg: DummyConfig): void {
  s.wanderTimer -= dt;
  s.attackCooldown = Math.max(0, s.attackCooldown - dt);

  // 攻击起手：只在攻击模式、冷却结束、未处于受击僵直、玩家进入范围时触发，且不写玩家任何状态
  if (s.mode === 'attack' && s.attackPhase === 'idle' && s.attackCooldown <= 0 && s.hurt.timer <= 0) {
    const p = world.character.position;
    const dist = Math.hypot(p.x - s.position.x, p.z - s.position.z);
    if (dist <= cfg.attackRange + EPS) {
      s.attackPhase = 'windup';
      s.attackPhaseTimer = 0;
      s.attackId += 1;
      s.attackCooldown = cfg.attackInterval;
      world.dummyAttackCount += 1;
      emitDummy(world, 'dummy-attack', s);
    }
  }
  advanceAttack(world, s, dt, cfg);

  const d = desiredDirection(world, s, cfg);
  const k = 1 - Math.exp(-Math.max(cfg.acceleration, EPS) * dt);
  s.velocity.x += (d.x * cfg.moveSpeed - s.velocity.x) * k;
  s.velocity.z += (d.z * cfg.moveSpeed - s.velocity.z) * k;
  s.facing = d.facing;

  // 身体 / 头部平滑转身：身体慢、头快，头先于身体到位（v7b#9）。朝向只影响观感，不进碰撞 / 命中。
  s.bodyYaw = approach(s.bodyYaw, s.facing, DUMMY_BODY_TURN, dt);
  s.headYaw = approach(s.headYaw, s.facing, DUMMY_HEAD_TURN, dt);

  const prevX = s.position.x;
  const prevZ = s.position.z;
  s.position.x += s.velocity.x * dt;
  s.position.z += s.velocity.z * dt;
  // 受击击退速度：被玩家命中后连续后退，而非一帧闪现；衰减在 decayHurt 里统一处理
  s.position.x += s.hurt.knockX * dt;
  s.position.z += s.hurt.knockZ * dt;

  // 与玩家共用同一套 AABB 碰撞解算：假人不会穿墙、穿窄门洞
  const stepH = world.config.stepHeight;
  const blocked = resolveHorizontal(world.boxes, s.position, cfg.radius, cfg.height, stepH);
  if (blocked && overlapsAny(world.boxes, s.position, cfg.radius, cfg.height, stepH)) {
    s.position.x = prevX;
    s.position.z = prevZ;
    s.velocity.x = 0;
    s.velocity.z = 0;
  }

  const b = world.config.worldBounds;
  s.position.x = clamp(s.position.x, b.minX, b.maxX);
  s.position.z = clamp(s.position.z, b.minZ, b.maxZ);

  // 假人不跳，直接贴合支撑面；矮台阶同样自动爬升
  const sup = supportHeight(
    world.boxes, s.position.x, s.position.z, s.position.y,
    cfg.radius, stepH, Number.POSITIVE_INFINITY,
  );
  if (sup > Number.NEGATIVE_INFINITY && sup <= s.position.y + stepH + EPS) {
    s.position.y = sup;
  }

  // 步态相位：与玩家一致的「增量累加」（v7c 修复抽动），速度变化不重缩放历史相位
  const frameDist = Math.hypot(s.position.x - prevX, s.position.z - prevZ);
  s.distance += frameDist;
  const dummyStepSpeed = Math.hypot(s.velocity.x, s.velocity.z);
  const u = Math.min(world.config.strideSpeedCap, dummyStepSpeed / Math.max(world.config.moveSpeed, EPS));
  const stride = Math.max(world.config.strideLength * (1 + u * world.config.strideSpeedGain), EPS);
  s.gaitPhase = (s.gaitPhase + (frameDist / stride) * TAU) % TAU;
}

/**
 * 假人模块：四种测试行为 + 点击轮转。
 * 与 movement / combat 解耦：只读玩家新位置，只写 world.dummies / dummyAttackCount / events。
 * 对应 C# 形态：static void DummiesUpdate(World w, float dt, in Intents i)
 */
export function dummiesUpdate(world: World, dt: number, intents: Intents): void {
  const cfg = world.config.dummies;

  // 1) 点击轮转当前假人的行为；同时清掉该假人的行为临时状态
  if (intents.dummyClickId >= 1 && intents.dummyClickId <= world.dummies.length) {
    const s = world.dummies[intents.dummyClickId - 1];
    s.mode = cycleDummyMode(s.mode);
    s.targetX = s.position.x;
    s.targetZ = s.position.z;
    s.wanderTimer = 0;
    s.attackCooldown = 0;
    s.attackPhase = 'idle';
    s.attackPhaseTimer = 0;
    s.attackProgress = 0;
    emitDummy(world, 'dummy-mode', s);
  }

  // 2) 按 id 顺序逐个推进（顺序固定 → 种子随机消耗顺序确定）
  for (const s of world.dummies) updateOne(world, dt, s, cfg);
}
