import { resolveFacingYaw } from './aim';
import { fireArrow } from './arrows';
import { cancelLink } from './links';
import { collectNotifies, phaseScalar } from './notify';
import { WEAPON_ORDER } from './types';
import type { AttackTimings, EventType, Intents, World } from './types';

const EPS = 1e-6;

function emit(world: World, type: EventType, value: number): void {
  const p = world.character.position;
  world.events.push({ type, tick: world.tick, x: p.x, y: p.y, z: p.z, value });
}

/** v9s.31：关键帧事件走同一条事件队列，额外带上 name。 */
function emitNotify(world: World, name: string, value: number): void {
  const p = world.character.position;
  world.events.push({ type: 'notify', tick: world.tick, x: p.x, y: p.y, z: p.z, value, name });
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
  c.charging = false;
  c.charge = 0;
  c.attackProgress = 0;
  c.attackFacing = 0;
  c.lastCharge = 0;
  c.hitstop = 0;
  c.notifyCursor = -1;
  c.hitIds.length = 0;
  c.warp = 1;
  c.warpDebt = 0;
  c.warpPhase = 0;
  c.warpTimer = 0;
  c.slamAttackId = 0;
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
    charging: false,
    charge: 0,
    attackProgress: 0,
    attackFacing: 0,
    attackId: 0,
    lastCharge: 0,
    hitstop: 0,
    notifyCursor: -1,
    hitIds: [] as number[],
    warp: 1,
    warpDebt: 0,
    warpPhase: 0,
    warpTimer: 0,
    slamAttackId: 0,
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
  // v9s.37：新一段起手不代表上一段的债务作废 —— 但若上一段已经结束，
  // 残留债务会让新一段莫名加速，所以起手时清零（连段内的偿还只发生在段内）。
  c.warpDebt = 0;
  c.warpPhase = 0;
  c.warpTimer = 0;
  c.warp = 1;
  // v9s.31：新一段 = 新时间轴。游标回到 -1（下次扫描包含 0 时刻），命中表清空。
  c.notifyCursor = -1;
  c.hitIds.length = 0;
  emit(world, 'attack-start', comboIndex);
}

function settleTime(world: World): number {
  return Math.max(0, world.config.combat.settle);
}

function startSwordCombo(world: World, intents: Intents, index: number): void {
  const p = world.config.combat.weapons[world.combat.weapon];
  // v9s.75：逐段时长（缺项回落统一值）。三段共用一组时长时读起来是
  // 「同一个动作点三下」——第 2 段该更快起手、第 3 段该更长的蓄力。
  const seg = p.comboTimings?.[index - 1];
  beginAttack(
    world,
    intents,
    {
      windup: seg?.windup ?? p.windup,
      active: seg?.active ?? p.active,
      recovery: seg?.recovery ?? p.recovery,
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
 * v9s.37 · 卡肉节奏：本帧动画时间轴速率（同时推进瓦片状态机）。
 *
 * 硬冻结（速率 0）读起来是「游戏卡了一下」；改成「接触瓦片」后：
 *   保持（holdRate 5%）→ 释放（ease 回 1）→ 偿还（1.5× 补回欠下的时间）。
 * 欠的时间逐帧累加而不是在触发时一次算出 —— 释放段也在欠，这部分同样要还。
 * 返回 0 时与 v9s.36 的 `hitstop > 0` 行为逐帧等价（`warp.enabled = false`）。
 */
function animRate(world: World, dt: number): number {
  const c = world.combat;
  const cfg = world.config.hits.hitstopWarp;
  if (!cfg || !cfg.enabled) {
    c.warp = c.hitstop > 0 ? 0 : 1;
    return c.warp;
  }

  const hold = Math.max(0, Math.min(1, cfg.holdRate));

  // 1) 保持：hits 写入 hitstop 时已把 warpPhase 置 1，这里只跟随计时
  if (c.hitstop > 0) {
    c.warpPhase = 1;
    c.warpTimer = c.hitstop;
    c.warp = hold;
    c.warpDebt += dt * (1 - hold);
    return c.warp;
  }

  // 2) 保持结束 → 释放
  if (c.warpPhase === 1) {
    c.warpPhase = 2;
    c.warpTimer = 0;
  }
  if (c.warpPhase === 2) {
    const rel = Math.max(1e-3, cfg.release);
    c.warpTimer += dt;
    const k = Math.min(1, c.warpTimer / rel);
    // ease-out（1-(1-k)²）：离开 0 附近要快，尾段才慢下来，否则前半段像没动
    const e = 1 - (1 - k) * (1 - k);
    const r = hold + (1 - hold) * e;
    c.warp = r;
    c.warpDebt += dt * (1 - r);
    if (k >= 1) {
      c.warpPhase = 3;
      c.warpTimer = 0;
      // 偿还预算：只允许吃掉 recovery 的一部分，超出的债务作废（否则收招抽一下）
      const cap = Math.max(0, c.timings.recovery)
        * Math.max(0, cfg.payback - 1)
        * Math.max(0, Math.min(1, cfg.paybackBudget));
      c.warpDebt = Math.min(c.warpDebt, cap);
    }
    return c.warp;
  }

  // 3) 偿还：把欠下的时间用 >1 的速率补回去，总时长守恒
  if (c.warpPhase === 3 && c.warpDebt > 1e-6) {
    const extra = Math.min(Math.max(0, cfg.payback - 1), c.warpDebt / Math.max(dt, 1e-5));
    c.warp = 1 + extra;
    c.warpDebt = Math.max(0, c.warpDebt - dt * extra);
    if (c.warpDebt <= 1e-6) {
      c.warpPhase = 0;
      c.warp = 1;
    }
    return c.warp;
  }

  c.warpPhase = 0;
  c.warp = 1;
  return 1;
}

/**
 * 阶段推进：windup → active → recovery → settle → idle。
 * settle 是「每段前移后的停顿」：动作本体在 recovery 结束时发 attack-end，
 * 随后进入零位移停顿，停顿结束才开启连击窗口 / 消费缓冲输入。
 */
function advancePhase(world: World, dt: number, intents: Intents): void {
  const c = world.combat;
  if (c.phase === 'idle') {
    // 一段彻底结束后不留债务：否则下一段起手会莫名加速
    c.warp = 1;
    c.warpPhase = 0;
    c.warpTimer = 0;
    c.warpDebt = 0;
    return;
  }

  const t = c.timings;

  // v9s.29 命中卡肉 → v9s.37 接触瓦片。
  // 旧版这里是 `if (c.hitstop > 0) return;`（硬冻结）；现在按 `animRate` 给的速率推进，
  // 保持期只有 5% 速度，所以画面仍是一帧一帧极缓慢地动 —— 读作「黏住」而不是「卡死」。
  // `warp.enabled = false` 时 animRate 返回 0，与旧行为逐帧等价。
  const rate = animRate(world, dt);
  const adv = dt * rate;
  c.phaseTimer += adv;

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
      // 收招开始就不再偿还：剩下的债务作废，避免 settle 期间出现「抽搐式加速」
      c.warpPhase = 0;
      c.warpDebt = 0;
      c.warpTimer = 0;
      c.warp = 1;
      emit(world, 'attack-end', c.comboIndex);
    } else {
      // settle → idle：整段彻底结束，允许接下一段
      c.phase = 'idle';
      c.phaseTimer = 0;
      // v9s.31：连击窗口可按武器覆写（双剑的缝隙比大剑短得多）
      c.comboWindow = world.config.combat.weapons[c.weapon].comboWindow
        ?? world.config.combat.comboWindow;

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

  // v9s.31：关键帧事件。把本帧走过的区间 (cursor, after] 扫一遍。
  //  - settle / idle 时标量按 3 计：进入 settle 的那一帧会把 recovery 末尾的
  //    `u: 1` 通知补齐（否则「收招」类事件永远发不出来）；
  //  - 卡肉在上面的 `return` 处已经挡住，冻结期间不会推进游标；
  //  - 单帧跨阶段 / 掉帧补算都只是一个更大的区间，天然不会漏。
  emitPhaseNotifies(world);
}

/**
 * 扫描本帧的关键帧事件并写入事件队列。
 * 单独拆出来是为了让「阶段推进」与「事件分发」的边界清楚：前者只改状态，
 * 后者只读状态 + 写队列。
 */
function emitPhaseNotifies(world: World): void {
  const c = world.combat;
  if (c.phase === 'idle') return;
  const t = c.timings;
  const dur = c.phase === 'windup' ? t.windup
    : c.phase === 'active' ? t.active
      : c.phase === 'recovery' ? t.recovery : 0;
  const u = dur > EPS ? Math.min(1, Math.max(0, c.phaseTimer / dur)) : 1;
  // settle 不属于三段之一：按 recovery 末尾（标量 3）结算
  const after = c.phase === 'settle' ? 3 : phaseScalar(c.phase, u);
  if (after <= c.notifyCursor + EPS) return;
  const defs = world.config.combat.weapons[c.weapon].notifies;
  for (const n of collectNotifies(defs, c.notifyCursor, after)) {
    emitNotify(world, n.name, n.value);
  }
  c.notifyCursor = after;
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

  // 2.5) v9s.29 卡肉期间把攻击方彻底按住：前冲冲量与水平速度一起归零。
  // 只冻 phaseTimer 还不够 —— movement 仍会按残余速度积分，冻结结束那一刻
  // 身体会补滑几毫米（实测 0.85mm/帧），画面读起来是「定格时脚在飘」。
  if (c.hitstop > 0) {
    world.impulse.x = 0;
    world.impulse.z = 0;
    world.character.velocity.x = 0;
    world.character.velocity.z = 0;
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
    // 弓箭（v9s.19）：按住即蓄力，蓄满自动放箭，放完立刻重新蓄力 —— 没有「每箭之间的冷却」。
    //
    // 旧版要等 phase 回到 idle 才允许下一次蓄力（windup+active+recovery+settle ≈ 0.58s），
    // 于是按住不放只是「射一箭 → 卡半秒 → 再蓄力」，节奏是断的。现在蓄力与放箭动作解耦：
    // 释放只负责播 0.42s 的放箭动画，蓄力从下一帧就能开始，满蓄时动作早就播完了。
    // 松手仍可提前射出（蓄力 ≥ minChargeToFire），不强制等满。
    if (!dashing && !world.playerLink.consumedAttack) {
      if (intents.attackHeld) {
        if (!c.charging) {
          c.charging = true;
          c.charge = 0;
          emit(world, 'charge-start', 0);
        }
        c.charge = Math.min(1, c.charge + dt / Math.max(cfg.bow.maxChargeTime, EPS));
        if (cfg.bow.autoFire && c.charge >= 1) {
          c.charging = false;
          const charge = c.charge;
          c.charge = 0;
          startBowRelease(world, intents, charge);
        }
      } else if (c.charging) {
        // 松手：按当前蓄力释放；不足最小蓄力则视为取消
        c.charging = false;
        const charge = c.charge;
        c.charge = 0;
        if (charge >= cfg.bow.minChargeToFire) {
          startBowRelease(world, intents, charge);
        } else {
          emit(world, 'charge-release', 0);
        }
      }
    }
  }

  // 5) 跨步位移：只在 active 阶段，速度按包络从峰值收到 0。
  //    v9s.21：旧版是 `lunge / active` 的匀速段，末帧一帧归零 —— 速度是方波，
  //    「到目标位置速度最高、然后硬停」。现在换成 ease-out 包络：
  //      v(u) = V0 · (1-u)^p，积分到 D  ⇒  V0 = D·(p+1)/T
  //    起手最快、到点自然收 0，位移仍然精确等于 lunge（面积不变）。
  //    v9a：派生招 active 时 impulse 已由 links 写好（本帧唯一的位移源），这里既不清零也不覆盖。
  const linkingActive = world.playerLink.phase === 'active';
  if (!linkingActive) {
    world.impulse.x = 0;
    world.impulse.z = 0;
    if (c.phase === 'active' && c.hitstop <= 0 && c.timings.active > EPS) {
      const T = c.timings.active;
      const D = Math.max(0, c.timings.lunge);
      const p = Math.max(0.2, cfg.lungeCurve);
      // 用「本帧应走的位移增量 / dt」当速度，而不是直接采样曲线高度：
      // 这样离散积分的总位移严格等于 D，不会因为帧率 / 采样端点产生几个百分点的漂移。
      const s = (t: number) => D * (1 - Math.pow(1 - Math.min(1, Math.max(0, t / T)), p + 1));
      // v9s.37：本帧推进了 adv（= dt × warp），偿还期 adv > dt、保持期 adv ≪ dt，
      // 前冲位移只跟 phaseTimer 走，所以除法必须用 adv，否则保持期会被算成「速度≈0」以外的怪值。
      const advNow = dt * c.warp;
      const t1 = Math.min(T, Math.max(0, c.phaseTimer));
      const t0 = Math.min(T, Math.max(0, c.phaseTimer - advNow));
      let mag = Math.max(0, s(t1) - s(t0)) / Math.max(advNow, 1e-4);
      // 安全阀：只挡异常配置，正常包络峰值不会触顶
      mag = Math.min(mag, Math.max(0, cfg.lungeMaxSpeed));
      world.impulse.x = Math.sin(c.attackFacing) * mag;
      world.impulse.z = Math.cos(c.attackFacing) * mag;
    }
  }

  // 6) v9s.29 卡肉计时最后才扣：本帧所有模块都读到「还在冻结」，扣完才算进入下一帧。
  // 反过来（先扣再推进）会让冻结少一帧，最后那帧进度偷偷前进 3.6%。
  if (c.hitstop > 0) c.hitstop = Math.max(0, c.hitstop - dt);
}
