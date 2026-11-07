import { resolveFacingYaw } from './aim';
import { fireArrow } from './arrows';
import { cancelLink } from './links';
import { WEAPON_ORDER } from './types';
import type { AttackTimings, EventType, Intents, World } from './types';

const EPS = 1e-6;

function emit(world: World, type: EventType, value: number): void {
  const p = world.character.position;
  world.events.push({ type, tick: world.tick, x: p.x, y: p.y, z: p.z, value });
}

function zeroTimings(): AttackTimings {
  return { windup: 0, active: 0, recovery: 0, settle: 0, lunge: 0 };
}

/** 清空攻击状态（保留当前武器与 attackId 计数）。 */
export function resetCombat(world: World): void {
  const c = world.combat;
  c.phase = 'idle';
  c.comboIndex = 0;
  c.phaseTimer = 0;
  c.comboWindow = 0;
  c.queued = false;
  c.bowQueued = false;
  c.charging = false;
  c.charge = 0;
  c.attackProgress = 0;
  c.attackFacing = 0;
  c.lastCharge = 0;
  c.timings = zeroTimings();
}

export function initialCombatState(weaponSlot: number) {
  return {
    weapon: WEAPON_ORDER[Math.max(0, weaponSlot - 1)] ?? WEAPON_ORDER[0],
    phase: 'idle' as const,
    comboIndex: 0,
    phaseTimer: 0,
    comboWindow: 0,
    queued: false,
    bowQueued: false,
    charging: false,
    charge: 0,
    attackProgress: 0,
    attackFacing: 0,
    attackId: 0,
    lastCharge: 0,
    timings: zeroTimings(),
  };
}

/**
 * 攻击朝向：委托给统一的 resolveFacingYaw（拖拽辅助朝向 > 锁定目标 > 移动 > 面朝向）。
 * 起手时锁定到 attackFacing，挥击过程中不再变。
 */
function facingFor(world: World, intents: Intents): number {
  return resolveFacingYaw(world, intents);
}

/**
 * 有目标时的动态前冲：让「每击结束」停在 idealRange 附近，而不是一头怼到敌人身上。
 * 目标还远 → 最多冲 基础lunge × maxLungeScale；目标已在理想距离内 → 仍保留一个最小前冲
 * （minLungeScale × 基础lunge），让攻击始终有明显的跨步，而不是被距离修正完全修没。
 * 无目标时保持武器原始 lunge（基础连击行为不变）。
 */
function lungeFor(world: World, base: number): number {
  const tg = world.config.targeting;
  if (!tg.targetAssist || !world.modules.targeting || !world.targeting.hasTarget) return base;
  const gap = world.targeting.targetDist - tg.idealRange;
  const max = Math.max(0, base * tg.maxLungeScale);
  const min = base * world.config.combat.minLungeScale;
  return Math.min(Math.max(gap, 0) + min, max);
}

function beginAttack(
  world: World,
  intents: Intents,
  timings: AttackTimings,
  comboIndex: number,
): void {
  const c = world.combat;
  c.phase = 'windup';
  c.phaseTimer = 0;
  c.comboIndex = comboIndex;
  c.queued = false;
  c.charging = false;
  c.charge = 0;
  c.attackFacing = facingFor(world, intents);
  c.attackProgress = 0;
  c.timings = timings;
  c.attackId += 1;
  emit(world, 'attack-start', comboIndex);
}

function settleTime(world: World): number {
  return Math.max(0, world.config.combat.settle);
}

function startSwordCombo(world: World, intents: Intents, index: number): void {
  const p = world.config.combat.weapons[world.combat.weapon];
  beginAttack(
    world,
    intents,
    {
      windup: p.windup,
      active: p.active,
      recovery: p.recovery,
      settle: settleTime(world),
      lunge: lungeFor(world, p.lunge[index - 1] ?? 0),
    },
    index,
  );
}

function startBowRelease(world: World, intents: Intents, charge: number): void {
  const r = world.config.combat.bow.release;
  world.combat.lastCharge = charge;
  beginAttack(
    world,
    intents,
    {
      windup: r.windup,
      active: r.active,
      recovery: r.recovery,
      settle: settleTime(world),
      lunge: r.lunge,
    },
    0,
  );
  // v9s.17：箭是 Core 实体（重力弹道 + 命中插住），在释放瞬间从弓口生成。
  // 表现层不再用 attackId 自己「放一支动画箭」，只按 world.arrows 渲染。
  fireArrow(world, charge, world.combat.attackFacing);
  emit(world, 'charge-release', charge);
}

/**
 * 阶段推进：windup → active → recovery → settle → idle。
 * settle 是「每段前移后的停顿」：动作本体在 recovery 结束时发 attack-end，
 * 随后进入零位移停顿，停顿结束才开启连击窗口 / 消费缓冲输入。
 */
function advancePhase(world: World, dt: number, intents: Intents): void {
  const c = world.combat;
  if (c.phase === 'idle') return;

  const t = c.timings;
  c.phaseTimer += dt;

  // 单帧可能跨过多个阶段（低帧率 / 时间缩放），用有限循环补齐
  let guard = 0;
  while (c.phase !== 'idle' && guard++ < 8) {
    const dur = c.phase === 'windup' ? t.windup
      : c.phase === 'active' ? t.active
        : c.phase === 'recovery' ? t.recovery
          : t.settle;
    if (c.phaseTimer < dur) break;
    c.phaseTimer -= dur;

    if (c.phase === 'windup') {
      c.phase = 'active';
      emit(world, 'attack-active', c.comboIndex);
    } else if (c.phase === 'active') {
      c.phase = 'recovery';
    } else if (c.phase === 'recovery') {
      c.phase = 'settle';
      emit(world, 'attack-end', c.comboIndex);
    } else {
      // settle → idle：整段彻底结束，允许接下一段
      c.phase = 'idle';
      c.phaseTimer = 0;
      c.comboWindow = world.config.combat.comboWindow;

      // 攻击中缓冲的按键：停顿结束后自动接下一段
      if (c.queued) {
        c.queued = false;
        const p = world.config.combat.weapons[c.weapon];
        if (p.comboCount > 0) {
          startSwordCombo(world, intents, c.comboIndex < p.comboCount ? c.comboIndex + 1 : 1);
        }
      }
    }
  }

  // 取消窗口：recovery 阶段过 cancelWindow 比例后即可提前接下一段，
  // 不必硬等 recovery + settle 全部结束，连击节奏更连贯（避免「每段都要播完才接下一击」）。
  if (c.queued && c.phase === 'recovery') {
    const rec = c.timings.recovery;
    if (rec > EPS && c.phaseTimer >= rec * world.config.combat.cancelWindow) {
      c.queued = false;
      const p = world.config.combat.weapons[c.weapon];
      if (p.comboCount > 0) {
        startSwordCombo(world, intents, c.comboIndex < p.comboCount ? c.comboIndex + 1 : 1);
      }
    }
  }

  // 进度只覆盖动作本体（不含 settle）；settle 期间定格在 1，表现层保持收势姿态
  const total = t.windup + t.active + t.recovery;
  let elapsed = 0;
  if (c.phase === 'windup') elapsed = c.phaseTimer;
  else if (c.phase === 'active') elapsed = t.windup + c.phaseTimer;
  else if (c.phase === 'recovery') elapsed = t.windup + t.active + c.phaseTimer;
  else if (c.phase === 'settle') elapsed = total;
  if (c.phase !== 'idle') c.attackProgress = total > 0 ? Math.min(1, elapsed / total) : 1;
}

/**
 * 战斗模块：武器切换、剑类三连击（含段间停顿）、弓箭蓄力释放。
 * 法杖技能（引导飞弹 / 电环）已抽离到 abilities 模块，本模块不再处理法杖输入（v7c #12）。
 * 与 movement 解耦：只写 world.combat 与 world.impulse，不直接改位置。
 * 对应 C# 形态：static void CombatUpdate(World w, float dt, in Intents i)
 */
export function combatUpdate(world: World, dt: number, intents: Intents): void {
  const c = world.combat;
  const cfg = world.config.combat;

  // 1) 武器切换（槽位 1..5）
  if (intents.weaponSlot >= 1 && intents.weaponSlot <= WEAPON_ORDER.length) {
    const id = WEAPON_ORDER[intents.weaponSlot - 1];
    if (id !== c.weapon) {
      c.weapon = id;
      resetCombat(world);
      cancelLink(world); // v9a：换武器同时取消进行中的派生招，与普通连击语义一致
      emit(world, 'weapon-change', intents.weaponSlot);
    }
  }

  // 2) 连击窗口：只在空闲时衰减，攻击 / 停顿过程中倒计时暂停
  if (c.phase === 'idle' && c.comboWindow > 0) {
    c.comboWindow = Math.max(0, c.comboWindow - dt);
    if (c.comboWindow === 0 && c.comboIndex > 0) {
      c.comboIndex = 0;
      emit(world, 'combo-reset', 0);
    }
  }

  // 3) 阶段推进
  advancePhase(world, dt, intents);

  // 4) 按武器处理输入
  //    翻滚进行中（dash.phase === 'active'）禁止新起手 / 蓄力，避免攻击与翻滚动画打架。
  //    dash 在 combat 之后运行，本帧读到的是上一帧写入的翻滚状态。
  const profile = cfg.weapons[c.weapon];
  const dashing = world.dash.phase === 'active';

  if (profile.comboCount > 0) {
    // 剑 / 双剑 / 大剑：三连击。
    // attackPressed = 显式按下沿；attackHeld + autoCombo = 按住自动连击。
    // 攻击尚未结束（非 idle）时把输入进缓冲队列，recovery 过取消窗口即提前接续，
    // 因此「连击动画不用完全播完才能播下一个」，节奏更连贯。
    // v9a：窗口内的 attackPressed 已被 links 仲裁给派生招，且派生招进行中不叠加普通连击
    const linking = world.playerLink.phase !== 'idle' || world.playerLink.consumedAttack;
    const buffered = !dashing && !linking
      && (intents.attackPressed || (cfg.autoCombo && intents.attackHeld));
    if (buffered) {
      if (c.phase === 'idle') {
        const next = c.comboWindow > 0 && c.comboIndex < profile.comboCount ? c.comboIndex + 1 : 1;
        startSwordCombo(world, intents, next);
      } else {
        c.queued = true;
      }
    }
  } else if (c.weapon === 'staff') {
    // 法杖技能由 abilities 模块驱动（引导飞弹 / 电环），本模块不消费其攻击 / 技2 输入。
    // 刻意留空分支：法杖 comboCount = 0、不蓄力、不进近战状态机，combat.phase 保持 idle，
    // 才能让「按住引导」时移动模块完全不锁速（v7c #12）。
  } else if (c.weapon === 'bow') {
    // 弓箭：按住蓄力，松开释放；蓄力不足则取消。
    // v9s.16：后摇 / 冷却期间的按下不再被丢掉 —— 记进 bowQueued（按下沿是瞬时的，
    // 而 phase 要等 windup + active + recovery + settle 走完才回 idle，旧版正好把这段的
    // 按键全过滤掉），回到 idle 且仍按住时立刻兑现为蓄力。松手则放弃缓冲。
    if (!dashing && !world.playerLink.consumedAttack) {
      if (intents.attackPressed && c.phase !== 'idle') c.bowQueued = true;
      if (!intents.attackHeld && !c.charging) c.bowQueued = false;
      const wantDraw = c.phase === 'idle' && !c.charging && intents.attackHeld
        && (intents.attackPressed || c.bowQueued);
      if (wantDraw) {
        c.bowQueued = false;
        c.charging = true;
        c.charge = 0;
        emit(world, 'charge-start', 0);
      }
    }
    if (c.charging && intents.attackHeld) {
      c.charge = Math.min(1, c.charge + dt / Math.max(cfg.bow.maxChargeTime, EPS));
    }
    // 释放判定改用「失去按住」(attackHeld 转 false) 为主、attackReleased 沿为辅：
    // 只要按钮 / 手指抬起，attackHeld 即变 false，蓄力必定结束，避免「抬按钮却卡在蓄力」。
    if (c.charging && !dashing && (intents.attackReleased || !intents.attackHeld)) {
      c.charging = false;
      const charge = c.charge;
      c.charge = 0;
      if (charge >= cfg.bow.minChargeToFire && c.phase === 'idle') {
        startBowRelease(world, intents, charge);
      } else {
        emit(world, 'charge-release', 0);
      }
    }
  }

  // 5) 前向位移：只在 active 阶段，按 位移/时长 换算成附加速度
  //    settle / recovery / windup 均为 0，保证「前移 → 停顿」的节奏感
  //    v9a：派生招 active 时 impulse 已由 links 写好（本帧唯一的位移源），这里既不清零也不覆盖。
  const linkingActive = world.playerLink.phase === 'active';
  if (!linkingActive) {
    world.impulse.x = 0;
    world.impulse.z = 0;
    if (c.phase === 'active' && c.timings.active > EPS) {
      const speed = c.timings.lunge / c.timings.active;
      world.impulse.x = Math.sin(c.attackFacing) * speed;
      world.impulse.z = Math.cos(c.attackFacing) * speed;
    }
  }
}
