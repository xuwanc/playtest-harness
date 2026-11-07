import { resolveFacingYaw } from './aim';
import { wrapAngle } from './orientation';
import type {
  EventType, Intents, LinkMoveConfig, LinkSource, LinkState, WeaponId, World,
} from './types';

const EPS = 1e-6;
const DEG = Math.PI / 180;

function emit(world: World, type: EventType, value: number): void {
  const p = world.character.position;
  world.events.push({ type, tick: world.tick, x: p.x, y: p.y, z: p.z, value });
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** 派生招运行时初始状态（玩家与每个假人共用同一个构造函数 → 机制同构）。 */
export function initialLinkState(): LinkState {
  return {
    phase: 'idle',
    source: 'none',
    linkWindow: 0,
    windowId: 0,
    usedWindowId: -1,
    cooldown: 0,
    kind: '',
    weapon: '',
    id: 0,
    timer: 0,
    progress: 0,
    facing: 0,
    targetId: 0,
    targetDist: 0,
    travel: 0,
    travelled: 0,
    fromX: 0,
    fromZ: 0,
    pulseTimer: 0,
    hitIds: [],
    consumedAttack: false,
    prevSprinting: false,
  };
}

function resetOne(l: LinkState): void {
  // id / windowId 持久递增不倒退：表现层用「id 变化」触发一次性特效，复位清零会与残留特效冲突。
  const id = l.id;
  const windowId = l.windowId;
  Object.assign(l, initialLinkState());
  l.id = id;
  l.windowId = windowId;
}

/** 复位单个实体的派生招状态（供假人复位复用，保证与玩家同构）。 */
export function resetLinkEntity(l: LinkState): void {
  resetOne(l);
}

/** 复位：玩家与所有假人的派生招状态一次性回到初始（世界级操作）。 */
export function resetLink(world: World): void {
  resetOne(world.playerLink);
  for (const s of world.dummies) resetOne(s.link);
}

/**
 * 窗口 / 冷却衰减。与 decayHurt 同语义：独立于模块开关运行，保证关掉 links 时
 * 残留窗口仍会自然过期，不会把「可接招」状态永久卡住。玩家与假人走同一份逻辑。
 */
export function decayLinks(world: World, dt: number): void {
  const states: LinkState[] = [world.playerLink];
  for (const s of world.dummies) states.push(s.link);
  for (const l of states) {
    l.linkWindow = Math.max(0, l.linkWindow - dt);
    l.cooldown = Math.max(0, l.cooldown - dt);
    if (l.linkWindow === 0 && l.phase === 'idle' && l.source !== 'none') {
      l.source = 'none';
      l.usedWindowId = -1;
    }
  }
}

/**
 * 开启一次「可接招窗口」。由 dash 在翻滚 / 闪现结束时调用，或由 linksUpdate
 * 在长跑松手沿调用。窗口 id 每次递增，配合 usedWindowId 实现「一个窗口最多触发一次」。
 * 长跑 / 闪现的配置窗口更长，给操作留余量。
 */
export function openLinkWindow(world: World, source: LinkSource): void {
  const cfg = world.config.links;
  const l = world.playerLink;
  if (!cfg.enabled || l.phase !== 'idle') return;
  const dur = source === 'roll' ? cfg.windows.roll
    : source === 'blink' ? cfg.windows.blink
      : source === 'sprint' ? cfg.windows.sprint : 0;
  if (dur <= 0) return;
  l.linkWindow = Math.max(l.linkWindow, dur);
  l.source = source;
  l.windowId += 1;
  l.usedWindowId = -1;
  // 翻滚 / 闪现期间 movement 会强制 sprinting=false；清掉长跑沿，避免下一帧
  // 误把「翻滚导致的松手」又识别成一次长跑结束、把 roll 窗口覆盖成更长的 sprint 窗口。
  l.prevSprinting = false;
}

/** 静默取消当前派生招（武器切换 / 复位用），不发 link-end 以免与一次性特效冲突。 */
export function cancelLink(world: World): void {
  const l = world.playerLink;
  if (l.phase === 'idle') return;
  const id = l.id;
  const windowId = l.windowId;
  Object.assign(l, initialLinkState());
  l.id = id;
  l.windowId = windowId;
  l.fromX = world.character.position.x;
  l.fromZ = world.character.position.z;
}

/**
 * 索敌：只取「参考朝向前方扇区」内最近的假人，不做背后索敌。
 * 参考朝向沿用 resolveFacingYaw（拖拽 > 锁定 > 移动 > 面朝向），因此背后敌人不会被强行锁定。
 */
function searchTarget(
  world: World, refYaw: number,
): { id: number; yaw: number; dist: number } {
  const cfg = world.config.links.search;
  const p = world.character.position;
  const maxAngle = clamp(cfg.maxAngleDeg, 0, 180) * DEG;
  let bestId = 0;
  let bestYaw = refYaw;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const s of world.dummies) {
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < EPS || dist > cfg.range) continue;
    const yaw = Math.atan2(dx, dz);
    if (Math.abs(wrapAngle(yaw - refYaw)) > maxAngle) continue;
    if (dist < bestDist) {
      bestDist = dist;
      bestId = s.id;
      bestYaw = yaw;
    }
  }
  return { id: bestId, yaw: bestYaw, dist: bestId > 0 ? bestDist : 0 };
}

function startLink(world: World, intents: Intents, move: LinkMoveConfig, weapon: WeaponId): void {
  const cfg = world.config.links;
  const l = world.playerLink;
  const p = world.character.position;
  const refYaw = resolveFacingYaw(world, intents);
  const tg = searchTarget(world, refYaw);

  // 起手即快照：朝向 / 目标 / 冲刺距离全程固定，挥击中不再重选目标 → 不会漂移、不会无限追击。
  const facing = tg.id > 0 ? tg.yaw : refYaw;
  const travel = tg.id > 0
    ? clamp(tg.dist - cfg.search.stopDistance, 0, move.distance)
    : (cfg.noTargetFallback ? move.distance : 0);

  l.phase = 'windup';
  l.linkWindow = 0;
  l.source = 'none';
  l.usedWindowId = l.windowId;      // 本窗口已消费 → 不可连发
  l.cooldown = cfg.sharedCooldown;
  l.kind = move.kind;
  l.weapon = weapon;
  l.id += 1;
  l.timer = 0;
  l.progress = 0;
  l.facing = facing;
  l.targetId = tg.id;
  l.targetDist = tg.dist;
  l.travel = travel;
  l.travelled = 0;
  l.fromX = p.x;
  l.fromZ = p.z;
  l.pulseTimer = 0;
  l.hitIds = [];
  l.consumedAttack = true;

  // 共享 CD：派生招与冲刺共用 dash.cooldown 冷却槽，触发后短时间内两者都不能再起。
  world.dash.cooldown = Math.max(world.dash.cooldown, cfg.sharedCooldown);
  emit(world, 'link-start', l.id);
}

/** 状态机推进：windup → active → recovery → idle；只在 active 写 impulse（位移/剩余时间收敛）。 */
function advanceLink(world: World, dt: number): void {
  const l = world.playerLink;
  if (l.phase === 'idle') return;
  const move = l.weapon === '' ? undefined : world.config.links.moves[l.weapon];
  if (!move) { cancelLink(world); return; }

  // 中途换武器 → 取消派生招（与普通连击的 resetCombat 语义一致）
  if (l.weapon !== world.combat.weapon) { cancelLink(world); return; }

  l.timer += dt;
  const durOf = (phase: string): number => (
    phase === 'windup' ? move.windup : phase === 'active' ? move.active : move.recovery
  );
  let guard = 0;
  while (l.phase !== 'idle' && guard++ < 8) {
    const dur = durOf(l.phase);
    if (l.timer < dur) break;
    l.timer -= dur;
    if (l.phase === 'windup') {
      l.phase = 'active';
      l.pulseTimer = 0;
      emit(world, 'link-active', l.id);
    } else if (l.phase === 'active') {
      l.phase = 'recovery';
    } else {
      l.phase = 'idle';
      l.timer = 0;
      emit(world, 'link-end', l.id);
    }
  }

  const total = move.windup + move.active + move.recovery;
  let elapsed = 0;
  if (l.phase === 'windup') elapsed = l.timer;
  else if (l.phase === 'active') elapsed = move.windup + l.timer;
  else if (l.phase === 'recovery') elapsed = move.windup + move.active + l.timer;
  else elapsed = total;
  l.progress = total > 0 ? clamp(elapsed / total, 0, 1) : 1;

  if (l.phase === 'active' && move.active > EPS) {
    // 剩余位移 / 剩余 active 时间 → 总位移精确收敛到 travel，dt 抖动也不会过冲。
    const remain = Math.max(0, l.travel - l.travelled);
    const activeLeft = Math.max(EPS, move.active - l.timer);
    const speed = remain / activeLeft;
    world.impulse.x = Math.sin(l.facing) * speed;
    world.impulse.z = Math.cos(l.facing) * speed;
  }
}

/**
 * 派生招模块（v9a Phase 1）：
 *  - 窗口来源：翻滚 / 闪现结束（由 dash 写状态）、长跑松开沿、长跑途中（triggerWhileSprinting）；
 *  - 输入仲裁：窗口内 attackPressed 优先给派生通道，combat 不再起普通连击、abilities 不再起引导；
 *  - 时序：本模块在 step 中位于 combat 之前、movement 之前，因此 impulse 当帧即被消费；
 *    落地触发不依赖事件队列（step 每帧开头清空），而是读状态沿 —— 为 Phase 3 留出接口。
 *
 * 纯状态转移、确定性、可快照，零外部时间 / 零 DOM / 零 three。
 * 对应 C# 形态：static void LinksUpdate(World w, float dt, in Intents i)
 */
export function linksUpdate(world: World, dt: number, intents: Intents): void {
  const cfg = world.config.links;
  const l = world.playerLink;
  const p = world.character.position;

  // 每帧先清仲裁标志（只在本帧内对 combat / abilities 生效）
  l.consumedAttack = false;

  // v9s.29 卡肉：派生招的时间轴跟着一起停。
  // 只冻结攻击方的话，link 的 active 计时仍在走、位移却被卡住 ——
  // 结果是「冲撞打中后少冲一段」（实测 1.75m 只剩 1.48m）。冻结计时则暂停后自然补完。
  if (world.combat.hitstop > 0) return;

  // 累计上一帧 active 的实际位移（movement 已跑完），并记下本帧扫掠起点。
  // hits 阶段用 fromX/fromZ → 当前位置做线段扫掠，防止一帧大位移漏判。
  if (l.phase === 'active') {
    l.travelled += Math.hypot(p.x - l.fromX, p.z - l.fromZ);
  }
  l.fromX = p.x;
  l.fromZ = p.z;

  if (!cfg.enabled || !world.modules.links) {
    // 关闭模块时不能把「动作进行中」的状态留在那里，否则 movement 会一直锁自主移动。
    if (l.phase !== 'idle') cancelLink(world);
    return;
  }

  const c = world.combat;
  const sprinting = world.character.sprinting;

  // 长跑途中：保持一个持续窗口，让玩家不必精确等松手那帧（操作不过来）。
  if (sprinting && cfg.triggerWhileSprinting && l.phase === 'idle'
    && l.usedWindowId !== l.windowId && cfg.windows.sprint > 0) {
    l.linkWindow = Math.max(l.linkWindow, cfg.windows.sprint);
    l.source = 'sprint';
  }
  // 长跑松手沿：另开一个完整窗口（比翻滚更长）。
  if (l.phase === 'idle' && l.prevSprinting && !sprinting) openLinkWindow(world, 'sprint');
  l.prevSprinting = sprinting;

  // 先推进已存在的招式，再判定新起手（起手帧不消耗 dt）。
  advanceLink(world, dt);

  const move = cfg.moves[c.weapon];
  const canTrigger = intents.attackPressed
    && l.phase === 'idle'
    && l.linkWindow > 0
    && l.usedWindowId !== l.windowId
    && l.cooldown <= 0
    && c.phase === 'idle'
    && !c.charging
    && world.dash.phase === 'idle'
    && !!move && move.enabled;

  if (canTrigger) startLink(world, intents, move as LinkMoveConfig, c.weapon);
}
