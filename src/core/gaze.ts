import type { GazeState, Intents, World } from './types';

const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * v9s.3 · 注视 / 威胁评估（Core 侧，确定性、可快照）。
 *
 * 两级行为（由 orientation / turn-in-place 据此驱动头部与身体朝向）：
 *  1. 普通注视：仅头部看向目标（锁定 / 拖拽 / 最近假人），不改身体朝向；头部偏转超
 *     过 headLookLimitDeg 时平滑转回看移动方向（见 orientation.ts）。
 *  2. 威胁注视：仅当「主动瞄准（aimActive）且范围内存在加权威胁」时进入 —— 身体趋向
 *     「主威胁 + 最近 N-1 个高权威胁」的加权中心（centroidYaw），头部看向主威胁（mainYaw）。
 *     威胁全部超出 recoveryDist 后交还身体控制（带滞回，避免门口反复横跳）。
 *
 * 威胁加权口径与相机（camera.ts）完全一致：proximity × modeWeight（+ 挥砍 active 帧
 * attackBoost），保证「包围圈构图」与「威胁注视」同源；归一化强度 = sum / (sum + saturation)。
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

  // 单假人权重：proximity（按给定半径归一）× 行为模式倍率（+ 挥砍 active 帧额外加权）。
  // radius 不同用于「进入(threatRange)」与「解除滞回(recoveryDist)」两档判定。
  const weightOf = (d: World['dummies'][number], radius: number): number => {
    const dx = d.position.x - p.x;
    const dz = d.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist < EPS || dist > radius) return 0;
    const prox = clamp((radius - dist) / Math.max(EPS, radius - cfg.nearDistance), 0, 1);
    let w = prox * (cfg.modeWeight[d.mode] ?? 0.5);
    if (d.attackPhase === 'active') w += cfg.attackBoost * prox;
    return w;
  };

  type T = { id: number; x: number; z: number; dx: number; dz: number; w: number };
  const threats: T[] = [];
  let sumW = 0;
  let inRecovery = false;
  for (const d of world.dummies) {
    const w = weightOf(d, cfg.threatRange);
    if (w > 0) {
      threats.push({
        id: d.id, x: d.position.x, z: d.position.z,
        dx: d.position.x - p.x, dz: d.position.z - p.z, w,
      });
      sumW += w;
    }
    if (weightOf(d, cfg.recoveryDist) > 0) inRecovery = true;
  }

  const threat = sumW <= 0 ? 0 : clamp(sumW / (sumW + Math.max(EPS, cfg.saturation)), 0, 1);
  const inThreat = threats.length > 0;
  const prevActive = g.active;

  // 进入：主动瞄准 + 范围内有威胁 + 强度过阈值；保持：仍瞄准且威胁仍在 recoveryDist 内
  const desired = intents.aimActive && inThreat && threat >= cfg.enterThreshold;
  const hold = intents.aimActive && prevActive && inRecovery;
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

  // 按权重降序：主威胁 = 最高权；加权中心 = 主威胁 + 最近 maxThreats-1 个高权威胁
  threats.sort((a, b) => b.w - a.w);
  const topK = threats.slice(0, Math.max(1, cfg.maxThreats));
  let sx = 0;
  let sz = 0;
  let sw = 0;
  for (const t of topK) {
    sx += t.x * t.w;
    sz += t.z * t.w;
    sw += t.w;
  }
  const main = threats[0];
  g.mainId = main.id;
  g.mainYaw = Math.atan2(main.dx, main.dz);
  g.centroidYaw = sw > EPS ? Math.atan2(sx / sw - p.x, sz / sw - p.z) : g.mainYaw;
  g.threatCount = threats.length;
  g.threat = threat;
}

/** 供 orientation / turn-in-place 直接消费：威胁注视激活时返回加权中心朝向。 */
export function gazeCentroidYaw(world: World): number {
  return world.gaze.centroidYaw;
}
