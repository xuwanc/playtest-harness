import { overlapsAny, resolveHorizontal, supportHeight } from './collision';
import { initialCombatState } from './combat';
import { initialHealth, updateHealth } from './health';
import { initialHurt } from './hits';
import { initialLinkState, resetLinkEntity } from './links';
import { nextRandom } from './random';
import { DUMMY_MODES, FIGHTER_MODES, WEAPON_ORDER } from './types';
import type {
  CombatState,
  DummyConfig,
  DummyMode,
  DummyState,
  EventType,
  Intents,
  WeaponId,
  World,
} from './types';

const EPS = 1e-6;
const TAU = Math.PI * 2;

/** 怪物转身速率（1/s）：身体慢、头快，与主角 orientation 同思路（v7b#9）。 */
const DUMMY_BODY_TURN = 7;
const DUMMY_HEAD_TURN = 18;

/**
 * v9s.39 · 连击接续的距离放宽系数。
 *
 * 第一击命中会把玩家推开（大剑 0.45m），收招那一瞬距离就超出 reach 了。
 * 严格按 reach 判定的话，连击第二段在「打中过的对局」里永远接不上 ——
 * 正好是最需要连击感的时候。放宽 30% 只用于「要不要接下一段」，
 * 真正结算命中仍然走 `hits.reach`（打空就是打空）。
 */
const COMBO_CHASE = 1.3;

/** 一轮打完后至少歇这么久（秒，× fighters.attackInterval）：防止把它调到很小时变成无限连。 */
const ROUND_GAP_SCALE = 0.4;

/**
 * v9s.40 · 陪练在对峙距离上「踱步」的横移幅度（× 自身移速）。
 *
 * 旧值 0.55 是为了「看得出在走位」随便取的，结果是 1.1 m/s 的碎步：步幅小、步频高，
 * 玩家站着不动时陪练却一刻不停地在绕圈 —— 真机上就是「疯狂磨脚」。
 * 现在只在门开时走，走就走得像样（0.9 ≈ 1.9 m/s，接近它自己的上限 2.1）。
 */
const SPAR_STRAFE = 0.9;

/** 径向纠偏的饱和比例：|err| 达到 band 时给 full，中间线性 —— 开关式 ±1 会在阈值上来回抽。 */
const RADIAL_GAIN = 0.9;

/**
 * v9s.40 · 死区踱步的时间门（0..1，C¹）。
 *
 * 对峙的真实节奏是「走两步、站住看一眼」，而不是匀速绕圈。用确定性时间门把横移切成
 * 脉冲：按 id 错开相位（无随机、可快照），两端用 smoothstep 过渡，关门后方向给 0，
 * 速度指数衰减到 0，表现层自然走「停步收相」站定。
 *
 * @param time   world.time（秒）
 * @param id     假人 id（错开相位用，避免所有单位同拍起步）
 * @param period 一个「走 + 停」周期（秒）
 * @param duty   一个周期里横移占的比例
 */
function strafeGate(time: number, id: number, period: number, duty: number): number {
  const p = Math.max(period, 0.1);
  const t = (((time + id * 2.37) % p) + p) % p;
  const on = Math.min(Math.max(duty, 0), 1) * p;
  if (on <= EPS || t >= on) return 0;
  const edge = Math.min(Math.max(p * 0.12, 0.15), on * 0.5);
  const k = Math.min(1, Math.min(t / edge, (on - t) / edge));
  return k * k * (3 - 2 * k);
}

/** 合方向向量按长度 1 归一（径向 + 切向叠加可能超过满速）。 */
function clampDir(x: number, z: number): { x: number; z: number } {
  const len = Math.hypot(x, z);
  if (len <= 1) return { x, z };
  return { x: x / len, z: z / len };
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
  // v9s.56：普通假人血量缺省 0 = 打不死的测试桩（旧行为）；陪练另有自己的血量。
  const baseHp = Math.max(0, cfg.health ?? 0);
  for (let i = 0; i < cfg.count; i++) {
    const home = cfg.spawn[i] ?? { x: 0, z: 0 };
    const mode = cfg.initialModes[i] ?? 'idle';
    list.push(createDummyState(i + 1, mode, home.x, home.z, null, 0, baseHp));
  }
  // v9s.38：持械陪练追加在后面（id 连续）。它们不是另一套实体 —— 就是带武器的假人，
  // 所以点击轮转 / 威胁环 / 受击 / 击退 / 插值全部沿用同一份机制。
  const f = cfg.fighters;
  if (f) {
    const fighterHp = Math.max(0, f.health ?? baseHp);
    for (let i = 0; i < f.weapons.length; i++) {
      const home = f.spawn[i] ?? { x: 0, z: 0 };
      const mode = f.initialModes?.[i] ?? 'spar';
      // 错开首次出手：三个陪练同时挥刀会读成「被集火」，也遮住了各自的动作
      const cd = f.attackInterval * (0.25 + 0.22 * i);
      list.push(createDummyState(list.length + 1, mode, home.x, home.z, f.weapons[i], cd, fighterHp));
    }
  }
  return list;
}

export function createDummyState(
  id: number, mode: DummyMode, x: number, z: number, weapon: WeaponId | null,
  attackCooldown = 0,
  maxHp = 0,
): DummyState {
  return {
    id,
    mode,
    initialMode: mode,
    homeX: x,
    homeZ: z,
    position: { x, y: 0, z },
    velocity: { x: 0, y: 0, z: 0 },
    facing: 0,
    bodyYaw: 0,
    headYaw: 0,
    gaitPhase: 0,
    stride: 1,
    distance: 0,
    targetX: x,
    targetZ: z,
    wanderTimer: 0,
    attackCooldown,
    attackPhase: 'idle',
    attackPhaseTimer: 0,
    attackProgress: 0,
    attackId: 0,
    attackComboIndex: 0,
    attackComboLeft: 0,
    comboGap: 0,
    hurt: initialHurt(),
    link: initialLinkState(), // v9a：与主角完全同构的派生招状态
    weapon,
    // 武器槽只用于初始化 weapon 字段，真正驱动挥击的是下面每帧同步的 phase / progress
    combat: weapon ? { ...initialCombatState(WEAPON_ORDER.indexOf(weapon) + 1), weapon } : null,
    health: initialHealth(maxHp),
  };
}

/** 点击一次往后轮转一种行为：普通假人 游走→跟随→保持→攻击→待机→游走；
 *  v9s.38 持械陪练额外把 `spar`（陪练）接在待机之后，循环起点就是 spar。 */
export function cycleDummyMode(mode: DummyMode, armed = false): DummyMode {
  const list = armed ? FIGHTER_MODES : DUMMY_MODES;
  const i = list.indexOf(mode);
  return list[(i + 1) % list.length];
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
    s.stride = 1;
    s.distance = 0;
    s.targetX = home.x;
    s.targetZ = home.z;
    s.wanderTimer = 0;
    s.attackCooldown = 0;
    s.attackPhase = 'idle';
    s.attackPhaseTimer = 0;
    s.attackProgress = 0;
    s.attackComboIndex = 0;
    s.attackComboLeft = 0;
    s.comboGap = 0;
    const h = s.hurt;
    h.type = 'none';
    h.timer = 0;
    h.duration = 0;
    h.dirX = 0;
    h.dirZ = 0;
    h.knockX = 0;
    h.knockZ = 0;
    resetLinkEntity(s.link);
    // v9s.56：复位 = 满血复活。maxHp 跟随配置（读一次，避免复位时配置被改过而失同步）
    const hp = s.health.maxHp;
    s.health.hp = hp;
    s.health.dead = false;
    s.health.deadT = 0;
    s.health.respawn = 0;
    s.health.revive = 0;
    s.health.kills = 0;
    // v9s.38：持械陪练复位时把挥击时间轴一并归零，否则会带着「挥到一半」的姿态回工位
    if (s.combat) {
      const c = s.combat;
      c.phase = 'idle';
      c.comboIndex = 0;
      c.phaseTimer = 0;
      c.attackProgress = 0;
      c.attackFacing = 0;
      c.charging = false;
      c.charge = 0;
      c.hitstop = 0;
      c.warp = 1;
      c.warpPhase = 0;
      c.warpDebt = 0;
      c.warpTimer = 0;
      c.hitIds.length = 0;
      c.timings = { windup: 0, active: 0, recovery: 0, settle: 0, lunge: 0 };
    }
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

/**
 * v9s.38：本假人的挥砍时序。
 * 普通假人用 `dummies.attackWindup/Active/Recovery`；持械陪练直接用**它手里那把武器**
 * 的时序（`combat.weapons[weapon]`）—— 这样 AI 的出招收招节奏与主角同名武器一致，
 * 混战时「看起来是同一套动作」。表现层的挥击剪辑也吃同一份 `timings`。
 */
function attackTiming(
  world: World, s: DummyState, cfg: DummyConfig,
): { windup: number; active: number; recovery: number } {
  if (s.weapon) {
    const p = world.config.combat.weapons[s.weapon];
    if (p) return { windup: p.windup, active: p.active, recovery: p.recovery };
  }
  return { windup: cfg.attackWindup, active: cfg.attackActive, recovery: cfg.attackRecovery };
}

/** 持械陪练的攻击距离 = 武器 reach × attackRangeScale；普通假人用固定值。 */
function attackRangeFor(world: World, s: DummyState, cfg: DummyConfig): number {
  if (!s.weapon) return cfg.attackRange;
  const reach = world.config.hits.reach[s.weapon] ?? cfg.attackRange;
  const scale = cfg.fighters?.attackRangeScale ?? 0.9;
  return Math.max(0.4, reach * scale);
}

/** 攻击间隔：持械陪练更懒（默认 3.4s vs 普通假人 1.6s）。 */
function attackIntervalFor(s: DummyState, cfg: DummyConfig): number {
  return s.weapon && cfg.fighters ? cfg.fighters.attackInterval : cfg.attackInterval;
}

/** 牵引半径：陪练允许离 home 更远一点，否则玩家一跑开就测不到混战。 */
function leashFor(s: DummyState, cfg: DummyConfig): number {
  if (s.weapon && cfg.fighters) return Math.max(cfg.leashRadius, cfg.fighters.leashRadius);
  return cfg.leashRadius;
}

function attackDuration(s: DummyState, cfg: DummyConfig, w: World): number {
  const t = attackTiming(w, s, cfg);
  if (s.attackPhase === 'windup') return t.windup;
  if (s.attackPhase === 'active') return t.active;
  if (s.attackPhase === 'recovery') return t.recovery;
  return 0;
}

/**
 * v9s.39 · 一轮连击的段数。
 *
 * 普通假人恒为 1（它们只有单次挥砍的简化 rig，没有连击段的概念）。
 * 持械陪练默认跟随武器的 `comboCount`（3 段）—— 与主角同名武器同一套段数，
 * 挥击剪辑才会按 1/2/3 段出不同的刀路。`fighters.comboCount > 0` 时覆盖它。
 */
function comboTotalFor(world: World, s: DummyState, cfg: DummyConfig): number {
  if (!s.weapon) return 1;
  const forced = cfg.fighters?.comboCount ?? 0;
  if (forced > 0) return Math.max(1, Math.round(forced));
  const p = world.config.combat.weapons[s.weapon];
  return Math.max(1, Math.round(p?.comboCount ?? 1));
}

/** 段间缝隙：0 = 用全局 settle（主角收招停顿同源），让连击有节奏而不是无停顿连划。 */
function comboGapFor(world: World, cfg: DummyConfig): number {
  const forced = cfg.fighters?.comboGap ?? 0;
  return forced > 0 ? forced : Math.max(0, world.config.combat.settle);
}

/**
 * v9s.39 · 连击是否还在进行（本轮到段间缝隙为止都算）。
 * 站位逻辑用它区分「打完一轮在歇」与「一轮中间」——前者该退回 standoff，后者该压住。
 */
function inComboRound(s: DummyState): boolean {
  return s.attackPhase !== 'idle' || s.attackComboLeft > 0;
}

/** 假人挥砍三段状态机；无伤害，只驱动表现层与事件。active 进入时发 dummy-hit 供命中模块消费。 */
function advanceAttack(world: World, s: DummyState, dt: number, cfg: DummyConfig): void {
  if (s.attackPhase === 'idle') {
    s.attackProgress = 0;
    syncFighterCombat(world, s, cfg);
    return;
  }
  s.attackPhaseTimer += dt;
  let guard = 0;
  while (s.attackPhase !== 'idle' && guard++ < 4) {
    const dur = Math.max(attackDuration(s, cfg, world), EPS);
    if (s.attackPhaseTimer < dur) break;
    s.attackPhaseTimer -= dur;
    if (s.attackPhase === 'windup') {
      s.attackPhase = 'active';
      emitDummy(world, 'dummy-hit', s);
    } else if (s.attackPhase === 'active') s.attackPhase = 'recovery';
    else {
      s.attackPhase = 'idle';
      s.attackPhaseTimer = 0;
      if (s.attackComboLeft > 0) {
        // v9s.39：还有段没打 —— 进「收势停顿」，缝隙走完由 updateOne 接下一段。
        // 段号**保留**：缝隙期表现层要继续用这一段的收势姿势，归零会让 rig 闪到别的段。
        s.comboGap = comboGapFor(world, cfg);
      } else {
        // 本轮真的结束（打完 / 断连 / 受击打断）→ 段号归零
        s.attackComboIndex = 0;
        // 兜底只对持械陪练生效：普通假人只有 1 段，不存在「无限连」，
        // 保持它们「播完即受 attackInterval 支配」的旧行为逐帧不变。
        if (s.weapon && s.attackCooldown <= 0) {
          // 一轮打完但冷却已归零（attackInterval 被调得比一轮还短）：
          // 补一个最小停顿，否则读起来是「永不收手的连击机器」
          s.attackCooldown = attackIntervalFor(s, cfg) * ROUND_GAP_SCALE;
        }
      }
    }
  }
  const t = attackTiming(world, s, cfg);
  const total = t.windup + t.active + t.recovery;
  let elapsed = 0;
  if (s.attackPhase === 'windup') elapsed = s.attackPhaseTimer;
  else if (s.attackPhase === 'active') elapsed = t.windup + s.attackPhaseTimer;
  else if (s.attackPhase === 'recovery') {
    elapsed = t.windup + t.active + s.attackPhaseTimer;
  }
  s.attackProgress = s.attackPhase === 'idle' || total <= 0 ? 0 : Math.min(1, elapsed / total);
  syncFighterCombat(world, s, cfg);
}

/**
 * v9s.38：把假人的挥砍状态抄进它自己的 `CombatState`（持械陪练专属）。
 * `voxel-rig` 只认 `CombatState`（phase / attackProgress / timings / weapon），
 * 这一层胶水让「AI 的三段状态机」与「主角的战斗状态」共用同一个动画入口，
 * 不需要在表现层再写一套挥击姿势。
 */
function syncFighterCombat(world: World, s: DummyState, cfg: DummyConfig): void {
  const c = s.combat;
  if (!c) return;
  const t = attackTiming(world, s, cfg);
  // v9s.39：段间缝隙在表现层写成 settle（收势定格，attackProgress = 1），不是 idle。
  // 写成 idle 的话，0.16s 里 rig 会把手放下再抬起 —— 读成「两刀之间发了个呆」，
  // 而 settle 与主角收招走的是同一条路径（`attacking = phase !== 'idle'`），自然保持姿势。
  const gap = s.attackPhase === 'idle' && s.attackComboLeft > 0 && s.comboGap > 0;
  c.weapon = s.weapon ?? c.weapon;
  c.phase = gap ? 'settle' : s.attackPhase;
  c.comboIndex = s.attackComboIndex;
  c.phaseTimer = s.attackPhaseTimer;
  c.attackProgress = gap ? 1 : s.attackProgress;
  c.attackFacing = s.facing;
  c.timings = { windup: t.windup, active: t.active, recovery: t.recovery, settle: 0, lunge: 0 };
  // AI 不参与卡肉 / 连击缓冲：这些字段保持中性，避免表现层读到上一帧的残留
  c.hitstop = 0;
  c.warp = 1;
  c.warpPhase = 0;
  c.charging = false;
  c.charge = 0;
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
    // v9s.40：径向改**比例**控制 + 死区里横移走时间门。
    // 旧版是「err 超死区就整速前进 / 后退」的开关，玩家在死区边缘微动时方向逐帧反转；
    // 死区内又不是站定而是恒速绕圈 → 表现层读作原地碎步磨脚。
    const err = dist - cfg.keepDistance;
    const band = Math.max(cfg.keepDeadZone, 0.2);
    const radial = Math.max(-1, Math.min(1, err / band)) * RADIAL_GAIN;
    const tangent = strafeGate(world.time, s.id, cfg.strafePeriod, cfg.strafeDuty) * cfg.keepStrafe;
    x = nx * radial - nz * tangent;
    z = nz * radial + nx * tangent;
  } else if (s.mode === 'attack') {
    // 挥砍过程中站定，不追击
    if (dist > attackRangeFor(world, s, cfg) && s.attackPhase === 'idle') {
      x = nx;
      z = nz;
    }
  } else if (s.mode === 'spar') {
    // v9s.38 陪练：**站在「刀砍不到」的地方**踱步，冷却好了才压上砍一刀，砍完退回。
    //  - standoff = 起手距离 × 1.7：剑盾约 2.4m、大剑约 3.0m，读起来是「保持距离」；
    //  - 冷却期间只在死区外做径向修正，死区内沿切线游走（时间正弦，不存状态）；
    //  - 冷却结束且还没进范围 → 主动压上，进入范围就出手，出手后 cooldown 重置又退回。
    // 三条叠起来才是「攻击欲望低」：大部分时间在走位，而不是贴着人连打。
    //
    // v9s.39：**一轮连击中间不退**。上面那套「打完就退回 standoff」说的是两轮之间；
    // 一刀与下一刀之间退开会把连击拆散（玩家被第一击推开 → 陪练自己再退 → 必然打空）。
    // 连击里只做两件事：够不着就压上，贴太近就稍微让开一点。
    const range = attackRangeFor(world, s, cfg);
    const standoff = range * 1.7;
    if (inComboRound(s)) {
      if (dist > range * COMBO_CHASE) {
        x = nx;
        z = nz;
      } else if (dist < range * 0.55) {
        x = -nx * 0.6;
        z = -nz * 0.6;
      }
    } else if (s.attackPhase === 'idle' && s.attackCooldown <= 0 && dist > range) {
      x = nx;
      z = nz;
    } else {
      // v9s.40：对峙期的径向纠偏改成**连续比例**，横移交给时间门。
      //  - 旧的 ±0.35 / −0.45 是开关式：玩家在阈值附近微动就逐帧反转方向，
      //    速度只能在 0 附近来回拉，腿却一直在迈 —— 表现层看起来就是原地磨脚；
      //  - 旧的横移是每帧恒速的 sin 绕圈：玩家站着不动，陪练永远在走（实测 0.6~1.1 m/s
      //    不停，5 秒走 3 米）。现在只有门开的那一小段才走，关门就站定收脚。
      const band = 0.5;
      const radial = Math.max(-1, Math.min(1, (dist - standoff) / band)) * RADIAL_GAIN;
      const tangent = strafeGate(world.time, s.id, cfg.strafePeriod, cfg.strafeDuty) * SPAR_STRAFE;
      x = nx * radial - nz * tangent;
      z = nz * radial + nx * tangent;
    }
  }

  // 径向（≤0.9）+ 切向（≤0.9）叠加会超过单位长度 → 归一，避免「斜着走比直着走快」
  ({ x, z } = clampDir(x, z));

  let facing = s.facing;
  if (s.mode === 'wander') {
    if (Math.hypot(x, z) > EPS) facing = Math.atan2(x, z);
  } else if (dist > EPS) {
    facing = Math.atan2(nx, nz);
  }

  // v9s.15 · 牵引半径：追击型假人离 home 超过 leashRadius 时，方向按超出量平滑改回 home。
  // 边界处按 over 线性混合（over=1 时完全回家），不会在「追 / 回」之间来回抖；
  // leashRadius = 0 精确回到旧行为（可自由追遍全场）。
  if (cfg.leashRadius > EPS && s.mode !== 'wander' && s.mode !== 'idle') {
    const leash = leashFor(s, cfg);
    const hx = s.position.x - s.homeX;
    const hz = s.position.z - s.homeZ;
    const hd = Math.hypot(hx, hz);
    if (hd > leash) {
      const over = Math.min(1, (hd - leash) / Math.max(leash * 0.5, 0.5));
      const bx = -hx / hd;
      const bz = -hz / hd;
      x = x * (1 - over) + bx * over;
      z = z * (1 - over) + bz * over;
      const len = Math.hypot(x, z);
      if (len > EPS) {
        x /= len;
        z /= len;
      }
    }
  }
  return { x, z, facing };
}

function updateOne(world: World, dt: number, s: DummyState, cfg: DummyConfig): void {
  // v9s.56：尸体不做任何事 —— 不出手、不移动、不吃击退。
  // 位置 / 朝向保持死亡那一刻（表现层据此做倒地），重生由 updateHealth 统一处理。
  if (s.health.dead) {
    s.velocity.x = 0;
    s.velocity.z = 0;
    s.velocity.y = 0;
    return;
  }
  s.wanderTimer -= dt;
  s.attackCooldown = Math.max(0, s.attackCooldown - dt);
  s.comboGap = Math.max(0, s.comboGap - dt);
  // v9s.39：受击打断连击 —— 已经挥出去的那一刀照常播完（既有契约），
  // 但不再接下一段。玩家因此有「打中就能拆掉一套连招」的反馈。
  if (s.hurt.timer > 0) {
    s.attackComboLeft = 0;
    s.comboGap = 0;
  }

  // 攻击起手：只在攻击 / 陪练模式、未处于受击僵直、玩家在范围内时触发，且不写玩家任何状态。
  // v9s.39：一次冷却好 = 打**一整轮连击**（段数由武器 comboCount 决定），
  // 冷却在整轮起手时就记满，所以连击只改变「一轮里的密度」，不提高起手频率。
  if ((s.mode === 'attack' || s.mode === 'spar') && s.attackPhase === 'idle' && s.hurt.timer <= 0) {
    const p = world.character.position;
    const dist = Math.hypot(p.x - s.position.x, p.z - s.position.z);
    const range = attackRangeFor(world, s, cfg);
    if (s.attackComboLeft > 0) {
      // 接下一段：缝隙走完 + 目标没被推得太远（放宽 COMBO_CHASE，见常量注释）
      if (s.comboGap <= 0) {
        if (dist <= range * COMBO_CHASE + EPS) {
          s.attackComboIndex += 1;
          s.attackComboLeft -= 1;
          s.attackPhase = 'windup';
          s.attackPhaseTimer = 0;
          s.attackId += 1;
          world.dummyAttackCount += 1;
          emitDummy(world, 'dummy-attack', s);
        } else {
          // 追不上就断连：剩余段作废，并把冷却补回来 ——
          // 否则「一套打空」接「立刻重开」会比连续命中的压迫感还强。
          s.attackComboLeft = 0;
          s.attackComboIndex = 0;
          s.attackCooldown = Math.max(s.attackCooldown, attackIntervalFor(s, cfg) * ROUND_GAP_SCALE);
        }
      }
    } else if (s.attackCooldown <= 0 && dist <= range + EPS) {
      const total = comboTotalFor(world, s, cfg);
      s.attackComboIndex = 1;
      s.attackComboLeft = Math.max(0, total - 1);
      s.comboGap = 0;
      s.attackPhase = 'windup';
      s.attackPhaseTimer = 0;
      s.attackId += 1;
      s.attackCooldown = attackIntervalFor(s, cfg);
      world.dummyAttackCount += 1;
      emitDummy(world, 'dummy-attack', s);
    }
  }
  advanceAttack(world, s, dt, cfg);

  const d = desiredDirection(world, s, cfg);
  // v9s.20 · 贴边时不再朝界外加速。
  // 假人（尤其是 keep-distance 后退）被逼到边界后会一直「想往外走」：位置被 clamp 冻结，
  // 但 velocity 仍涨到满速 → 表现层拿 speed 当摆幅、gaitPhase 却因位移为 0 不再推进，
  // 结果就是「站在边界上满幅跨步定格 / 沿边一被推动就抽搐」。
  // 和撞墙同一套语义：把期望方向投影到边界切向，速度只会保留沿墙分量。
  const bounds = world.config.worldBounds;
  if ((d.x > 0 && s.position.x >= bounds.maxX - EPS) || (d.x < 0 && s.position.x <= bounds.minX + EPS)) d.x = 0;
  if ((d.z > 0 && s.position.z >= bounds.maxZ - EPS) || (d.z < 0 && s.position.z <= bounds.minZ + EPS)) d.z = 0;
  const k = 1 - Math.exp(-Math.max(cfg.acceleration, EPS) * dt);
  // v9s.38：陪练稍微慢一点（默认 2.1 vs 假人 2.6）—— 追不上玩家，混战才有喘息
  const moveSpeed = s.weapon && cfg.fighters ? cfg.fighters.moveSpeed : cfg.moveSpeed;
  s.velocity.x += (d.x * moveSpeed - s.velocity.x) * k;
  s.velocity.z += (d.z * moveSpeed - s.velocity.z) * k;
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
  if (blocked) {
    if (overlapsAny(world.boxes, s.position, cfg.radius, cfg.height, stepH)) {
      // 两侧夹住：推出互相抵消，直接回退本帧水平位移
      s.position.x = prevX;
      s.position.z = prevZ;
      s.velocity.x = 0;
      s.velocity.z = 0;
    } else {
      // 只清「被挡住的轴」：贴着墙斜向走时保留切向速度，不会每帧清零再重新加速而抽搐
      const ax = s.position.x - prevX;
      const az = s.position.z - prevZ;
      if (Math.abs(ax) < Math.abs(s.velocity.x * dt) * 0.5) s.velocity.x = 0;
      if (Math.abs(az) < Math.abs(s.velocity.z * dt) * 0.5) s.velocity.z = 0;
    }
  }

  // 世界边界：夹紧的同时清掉朝界外的速度 / 击退，避免「位置冻结但速度满格」的空踩
  const b = world.config.worldBounds;
  if (s.position.x < b.minX) {
    s.position.x = b.minX;
    if (s.velocity.x < 0) s.velocity.x = 0;
    if (s.hurt.knockX < 0) s.hurt.knockX = 0;
  } else if (s.position.x > b.maxX) {
    s.position.x = b.maxX;
    if (s.velocity.x > 0) s.velocity.x = 0;
    if (s.hurt.knockX > 0) s.hurt.knockX = 0;
  }
  if (s.position.z < b.minZ) {
    s.position.z = b.minZ;
    if (s.velocity.z < 0) s.velocity.z = 0;
    if (s.hurt.knockZ < 0) s.hurt.knockZ = 0;
  } else if (s.position.z > b.maxZ) {
    s.position.z = b.maxZ;
    if (s.velocity.z > 0) s.velocity.z = 0;
    if (s.hurt.knockZ > 0) s.hurt.knockZ = 0;
  }

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
  // v9e：与主角同构 —— 步幅写进状态，表现层据此让支撑脚钉在地上不打滑
  s.stride = stride;
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
    s.mode = cycleDummyMode(s.mode, !!s.weapon);
    s.targetX = s.position.x;
    s.targetZ = s.position.z;
    s.wanderTimer = 0;
    s.attackCooldown = 0;
    s.attackPhase = 'idle';
    s.attackPhaseTimer = 0;
    s.attackProgress = 0;
    s.attackComboIndex = 0;
    s.attackComboLeft = 0;
    s.comboGap = 0;
    if (s.combat) {
      s.combat.phase = 'idle';
      s.combat.attackProgress = 0;
      s.combat.comboIndex = 0;
    }
    emitDummy(world, 'dummy-mode', s);
  }

  // 2) 按 id 顺序逐个推进（顺序固定 → 种子随机消耗顺序确定）
  // v9s.56：生命计时先于 AI —— 这一帧刚复活的人要能立刻被 AI 接管，而不是等下一帧。
  updateHealth(world, dt);
  for (const s of world.dummies) updateOne(world, dt, s, cfg);
}
