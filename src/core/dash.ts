import { resolveDashDir } from './aim';
import { overlapsAny } from './collision';
import { resetCombat } from './combat';
import { openLinkWindow } from './links';
import type { EventType, Intents, World } from './types';

const EPS = 1e-6;

function emit(world: World, type: EventType, value: number): void {
  const p = world.character.position;
  world.events.push({ type, tick: world.tick, x: p.x, y: p.y, z: p.z, value });
}

export function initialDashState() {
  return {
    kind: 'none' as const,
    phase: 'idle' as const,
    timer: 0,
    duration: 0,
    cooldown: 0,
    dirX: 0,
    dirZ: 0,
    fromX: 0,
    fromZ: 0,
    toX: 0,
    toZ: 0,
    id: 0,
  };
}

export function resetDash(world: World): void {
  const d = world.dash;
  d.kind = 'none';
  d.phase = 'idle';
  d.timer = 0;
  d.duration = 0;
  d.cooldown = 0;
  d.dirX = 0;
  d.dirZ = 0;
  d.fromX = world.character.position.x;
  d.fromZ = world.character.position.z;
  d.toX = d.fromX;
  d.toZ = d.fromZ;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 闪现落点：沿方向以 blinkStep 为步长逐段推进，遇到阻挡盒或世界边界就停在最后安全点。
 * 这样不会「一帧穿墙」，同时保持纯数据、确定性（无随机、无外部状态）。
 */
function blinkTarget(world: World, dirX: number, dirZ: number): { x: number; z: number } {
  const cfg = world.config.dash;
  const c = world.character;
  const p = c.position;
  const b = world.config.worldBounds;
  const step = Math.max(0.05, cfg.blinkStep);
  const total = Math.max(0, cfg.blinkDistance);
  let travelled = 0;
  let safeX = p.x;
  let safeZ = p.z;

  // 逐段推进：最后一步用 Math.min 正好落在 total，无需「收尾补跳」。
  // 一旦某段被阻挡盒或世界边界截断就立即停止，绝不能再用更远的终点覆盖
  // 安全点 —— 否则会出现「被墙挡住却闪到墙后」的穿墙 bug。
  while (travelled < total - EPS) {
    const nd = Math.min(total, travelled + step);
    const rawX = p.x + dirX * nd;
    const rawZ = p.z + dirZ * nd;
    const nx = clamp(rawX, b.minX, b.maxX);
    const nz = clamp(rawZ, b.minZ, b.maxZ);
    const probe = { x: nx, y: p.y, z: nz };
    if (overlapsAny(world.boxes, probe, world.config.characterRadius, world.config.characterHeight, world.config.stepHeight)) {
      break;
    }
    safeX = nx;
    safeZ = nz;
    travelled = nd;
    if (nx !== rawX || nz !== rawZ) break; // 撞到世界边界，后续段无意义
  }
  return { x: safeX, z: safeZ };
}

/**
 * 冲刺 / 闪避模块。
 * - 物理武器（剑盾 / 双剑 / 大剑 / 弓）：翻滚 —— active 期间把「位移/时长」换算成
 *   附加速度写入 impulse，由 movement 正常消费（因此台阶、碰撞、边界全部复用既有规则）。
 * - 法杖：闪现 —— 单帧直接把位置移到沿途采样得到的安全落点，清空水平速度，写 from/to。
 *
 * 触发条件：sprintPressed 按下沿 + 冷却结束 + 当前不在攻击 / 蓄力 / 上一次翻滚未结束。
 * 方向取移动输入，无输入时取面朝向。纯状态转移，确定性、可快照、可跨语言对照。
 *
 * 时序要点：active 计时递减放在写 impulse 之后，且 phase 只在「下一帧开头」才转 idle。
 * 这样翻滚的每一帧（含收尾帧）都会写 impulse，movement 本帧读到的 phase 仍是 active、
 * 方向键全程被接管；总位移精确收敛到 rollDistance，不会出现「最后一帧漏冲」。
 */
export function dashUpdate(world: World, dt: number, intents: Intents): void {
  const d = world.dash;
  const cfg = world.config.dash;

  // 1) 上一帧翻滚已跑满时长 → 本帧开头收尾。
  //    刻意不在上一帧末尾就置 idle：否则那一帧 movement 会读到 idle 并放行方向键。
  if (d.phase === 'active' && d.timer <= 0) {
    d.phase = 'idle';
    d.timer = 0;
    // v9a：翻滚结束开启「可接招窗口」（links 下一帧读到，时序与 impulse 不冲突）
    openLinkWindow(world, 'roll');
  }

  // 2) 冷却衰减（独立于模块内部阶段，关闭模块时由 step 跳过整个调用）
  if (d.cooldown > 0) {
    const was = d.cooldown;
    d.cooldown = Math.max(0, d.cooldown - dt);
    if (was > 0 && d.cooldown === 0) emit(world, 'dash-ready', 0);
  }

  // 3) 触发
  const c = world.combat;
  // v9s.19：弓箭的蓄力 / 放箭动作允许被翻滚打断。
  // 「按住自动连射」之后几乎全程处于蓄力或放箭动作里，若沿用旧的 `!charging && phase idle`
  // 会长时间锁死冲刺 —— 现在按冲刺就放弃这一箭（不再发射），翻滚优先。
  const bowBusy = c.weapon === 'bow' && (c.charging || c.phase !== 'idle');
  const canStart = intents.sprintPressed
    && d.cooldown <= 0
    && d.phase === 'idle'
    && (c.phase === 'idle' || bowBusy)
    && world.playerLink.phase === 'idle'; // v9a：派生招进行中不能翻滚 / 闪现

  if (canStart) {
    if (bowBusy) {
      // 放弃当前这一箭：清掉蓄力与放箭动作（箭已经射出的那部分不受影响）
      c.charging = false;
      c.charge = 0;
      if (c.phase !== 'idle') resetCombat(world);
    }
    // 方向统一由 aim 解析（拖拽辅助朝向 > 移动输入 > 面朝向），翻滚 / 闪现共用同一套（v7c #11）
    const dir = resolveDashDir(world, intents);
    const dx = dir.x;
    const dz = dir.z;
    const isStaff = world.combat.weapon === 'staff';
    d.kind = isStaff ? 'blink' : 'roll';
    d.dirX = dx;
    d.dirZ = dz;
    d.fromX = world.character.position.x;
    d.fromZ = world.character.position.z;
    d.id += 1;
    d.cooldown = isStaff ? cfg.blinkCooldown : cfg.rollCooldown;

    if (isStaff) {
      // 闪现：瞬时位移 + 落点保护，不写 impulse
      const target = blinkTarget(world, dx, dz);
      world.character.position.x = target.x;
      world.character.position.z = target.z;
      d.toX = target.x;
      d.toZ = target.z;
      d.duration = 0;
      d.timer = 0;
      d.phase = 'idle';
      if (cfg.blinkClearVelocity) {
        world.character.velocity.x = 0;
        world.character.velocity.z = 0;
      }
      // v9a：闪现是单帧瞬移，同样开启窗口（配置里比翻滚更长，给操作留余量）
      openLinkWindow(world, 'blink');
      emit(world, 'blink', d.id);
    } else {
      // 翻滚：active 持续期，位移交给 impulse（速度量纲）
      d.phase = 'active';
      d.duration = Math.max(EPS, cfg.rollDuration);
      d.timer = d.duration;
      d.toX = d.fromX + dx * cfg.rollDistance;
      d.toZ = d.fromZ + dz * cfg.rollDistance;
      emit(world, 'roll', d.id);
    }
  }

  // 4) 翻滚期间把「剩余位移」按剩余时间换算成附加速度写入 impulse。
  //    用剩余量 / 剩余时间而非固定速度，保证 dt 抖动下总位移仍收敛到 rollDistance。
  if (d.phase === 'active' && d.kind === 'roll') {
    const remainTime = Math.max(EPS, d.timer);
    const px = world.character.position.x;
    const pz = world.character.position.z;
    world.impulse.x = (d.toX - px) / remainTime;
    world.impulse.z = (d.toZ - pz) / remainTime;
  }

  // 5) active 计时递减（放在最后）：本帧 movement 仍读到 active，方向键被接管。
  //    timer 归零后不在此处转 idle，交给下一帧第 1 步处理。
  if (d.phase === 'active') {
    d.timer = Math.max(0, d.timer - dt);
  }
}
