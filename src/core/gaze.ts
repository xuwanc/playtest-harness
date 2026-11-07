import type { GazeState, Intents, World } from './types';

const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** 角度归一化到 (-π, π]（与 orientation.wrapAngle 同口径，避免模块环依赖）。 */
function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/**
 * v9s.3 · 注视 / 威胁评估（Core 侧，确定性、可快照）。
 *
 * 两级行为（由 orientation / turn-in-place 据此驱动头部与身体朝向）：
 *  1. 普通注视：仅头部看向目标（锁定 / 拖拽 / 最近假人），不改身体朝向；头部偏转超
 *     过 headLookLimitDeg 时平滑转回看移动方向（见 orientation.ts）。
 *  2. 威胁注视：范围内存在威胁时进入（瞄准 / 被攻击 / 敌对单位主动接近三种进入源）——
 *     身体趋向「主威胁 + 最近 N-1 个高权威胁」的加权中心（centroidYaw），头部看向主威胁
 *     （mainYaw）。威胁全部超出 recoveryDist 后交还身体控制（带滞回，避免门口反复横跳）。
 *
 * 威胁加权口径与相机（camera.ts）一致：proximity × modeWeight（+ 挥砍 active 帧
 * attackBoost），保证「包围圈构图」与「威胁注视」同源；归一化强度 = sum / (sum + saturation)。
 * v9s.6 在此基础上再加两层「接敌权重整形」（只作用于加权中心，不改变主威胁是谁）：
 *   · 离主威胁方向越远 → 权重按 (夹角/π)² 衰减（spreadFalloff）
 *   · 角色背后的威胁 → 额外乘 behindFalloff（主威胁豁免：被背后偷袭仍要转身）
 *   · 未瞄准、未被攻击时，敌对模式单位进入 threatRange 即主动进入接敌（reactToApproach）
 *
 * 纯几何评估、无时间累积、不写其它状态、不发事件 → 完全确定性、可快照、可跨语言对照。
 * 对应 C# 形态：static void GazeUpdate(World w, float dt, in Intents i)
 */
export function gazeUpdate(world: World, _dt: number, intents: Intents): void {
  const cfg = world.config.gaze;
  const g = world.gaze;
  // 模块 / 配置关闭：清零并退出（便于 A/B 对照；不破坏其它模块）
  if (!cfg.enabled || !world.modules.gaze) {
    g.active = false;
    g.mainId = 0;
    g.mainYaw = 0;
    g.centroidYaw = 0;
    g.threatCount = 0;
    g.threat = 0;
    return;
  }

  const p = world.character.position;

  // 单假人基础权重：proximity（按给定半径归一）× 行为模式倍率（+ 挥砍 active 帧额外加权）。
  // radius 不同用于「进入(threatRange)」与「解除滞回(recoveryDist)」两档判定。
  const baseWeightOf = (d: World['dummies'][number], radius: number): number => {
    const dx = d.position.x - p.x;
    const dz = d.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < EPS || dist > radius) return 0;
    const prox = clamp((radius - dist) / Math.max(EPS, radius - cfg.nearDistance), 0, 1);
    let w = prox * (cfg.modeWeight[d.mode] ?? 0.5);
    if (d.attackPhase === 'active') w += cfg.attackBoost * prox;
    return w;
  };

  type T = { id: number; x: number; z: number; dx: number; dz: number; yaw: number; w: number };
  const threats: T[] = [];
  let sumW = 0;
  let inRecovery = false;
  // v9s.5：是否有敌人「正在 / 即将攻击自己」——起手(windup)与挥砍(active)都算。
  // v9s.6：是否有敌对模式单位进入 approachDist（主动接敌的进入距离，米）。
  let incoming = false;
  let approaching = false;
  for (const d of world.dummies) {
    const w = baseWeightOf(d, cfg.threatRange);
    const dx = d.position.x - p.x;
    const dz = d.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (w > 0) {
      threats.push({
        id: d.id, x: d.position.x, z: d.position.z,
        dx, dz, yaw: Math.atan2(dx, dz), w,
      });
      sumW += w;
      // 敌对模式（follow / keep-distance / attack）才算「接近」，idle / wander 不惊动
      if (dist <= cfg.approachDist
        && (cfg.modeWeight[d.mode] ?? 0.5) >= cfg.hostileModeWeight) {
        approaching = true;
      }
    }
    // 退出判定用显式距离（米）：任一敌人仍在 recoveryDist 内就继续保持接敌
    if (dist > EPS && dist <= cfg.recoveryDist) inRecovery = true;
    if (d.attackPhase === 'windup' || d.attackPhase === 'active') {
      if (dist <= cfg.threatRange) incoming = true;
    }
  }

  const threat = sumW <= 0 ? 0 : clamp(sumW / (sumW + Math.max(EPS, cfg.saturation)), 0, 1);
  const inThreat = threats.length > 0;
  const prevActive = g.active;

  // 进入（v9s.6 三源）：
  //   a) 主动瞄准 + 范围内有威胁（过 enterThreshold）
  //   b) 有敌人正在 / 即将攻击自己（windup / active）
  //   c) 敌对模式单位进入 approachDist（默认 3m）—— 没瞄准、没挨打，也先转身戒备
  const desired = inThreat && (
    (intents.aimActive && threat >= cfg.enterThreshold)
    || (cfg.reactToAttack && incoming && threat >= cfg.enterThreshold)
    || (cfg.reactToApproach && approaching)
  );
  // 保持：只要还有敌人留在 recoveryDist（默认 3.5m）内就继续接敌（滞回）；
  //       v9s.7 追加「受击守卫」——距上次被攻击不足 hurtHoldSec（默认 2s）时不退出，
  //       即使敌人已拉开距离也先保持戒备，避免刚被打完就立刻卸下姿态。
  const hurtGuard = cfg.hurtHoldSec > EPS
    && world.time - world.playerHurt.lastAt < cfg.hurtHoldSec;
  const hold = prevActive && (inRecovery || hurtGuard);
  g.active = desired || hold;

  if (!g.active) {
    g.mainId = 0;
    g.mainYaw = 0;
    g.centroidYaw = 0;
    g.threatCount = 0;
    g.threat = 0;
    return;
  }

  // 纯滞回保持：威胁已移出 threatRange 但仍在 recoveryDist 内（hold 触发、threats 为空）。
  // 此时无有效威胁点可重算，保留上一帧主威胁 / 中心朝向，避免身体抖动、也不触碰空表。
  if (threats.length === 0) return;

  // 按权重降序：主威胁 = 基础权重最高（最近 + 最主动）者，不参与下面的角度整形
  threats.sort((a, b) => b.w - a.w);
  const topK = threats.slice(0, Math.max(1, cfg.maxThreats));
  const main = threats[0];
  const mainYaw = Math.atan2(main.dx, main.dz);

  // v9s.6 · 接敌权重整形（只影响「身体朝哪」的加权中心，不改变主威胁是谁）：
  //  ① 离主威胁越远 → 权重按 (夹角/π)² 衰减：侧翼 / 后方零散敌人不把中心拉平；
  //  ② 角色背后（相对身体朝向超过 behindAngleDeg）的威胁再乘 behindFalloff：背后不抢身体朝向；
  //  ③ 主威胁豁免「背后」惩罚 —— 被背后偷袭时仍要整身转过去。
  const behindLimit = (cfg.behindAngleDeg * Math.PI) / 180;
  const bodyYaw = world.character.bodyYaw;
  let sx = 0;
  let sz = 0;
  let sw = 0;
  for (const t of topK) {
    const spread = Math.abs(wrapAngle(t.yaw - mainYaw)) / Math.PI;
    let eff = t.w / (1 + Math.max(cfg.spreadFalloff, 0) * spread * spread);
    if (t !== main && cfg.behindFalloff < 1
      && Math.abs(wrapAngle(t.yaw - bodyYaw)) > behindLimit) {
      eff *= Math.max(cfg.behindFalloff, 0);
    }
    sx += t.x * eff;
    sz += t.z * eff;
    sw += eff;
  }
  g.mainId = main.id;
  g.mainYaw = mainYaw;
  g.centroidYaw = sw > EPS ? Math.atan2(sx / sw - p.x, sz / sw - p.z) : mainYaw;
  g.threatCount = threats.length;
  g.threat = threat;
}

/** 供 orientation / turn-in-place 直接消费：威胁注视激活时返回加权中心朝向。 */
export function gazeCentroidYaw(world: World): number {
  return world.gaze.centroidYaw;
}
