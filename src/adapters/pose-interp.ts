import type { CharacterState, CombatState, DummyState, HurtState, World } from '../core';

/**
 * v9s.34 · 定步长渲染插值（fixed-step + interpolation）。
 *
 * 问题：Core 固定 60Hz 步进，渲染按屏幕刷新率跑。
 *  - 120Hz / 144Hz 屏幕上，两个渲染帧之间只有一半 / 三分之一的时间有新状态，
 *    观感是「动作在 60Hz 抖动」；
 *  - 慢放（`debug.timeScale < 1`）时更明显：0.25× 下累加器每 4 帧才跨过一次 `fixedDt`，
 *    模拟只跑 15Hz，而画面仍按 60Hz 刷新 —— 看到的是 4 帧一停的「幻灯片」。
 *
 * 解法：把「上一个模拟步」和「当前模拟步」的姿态输入存下来，渲染时按
 * `alpha = 累加器剩余 / fixedDt` 插值。这是 Gaffer《Fix Your Timestep》的标准做法，
 * 代价是画面滞后约半帧（8ms），换来任意刷新率下都连续。
 *
 * 只插值**连续量**（位置 / 朝向角 / 步相 / 攻击进度 / 受击计时）。
 * 离散量（武器、阶段、连击段、攻击 id、假人模式）一旦变化就整体 snap ——
 * 否则跨段瞬间会被插值抹成两段之间的怪姿势。
 */

/** 一个模拟步结束时的「姿态输入」快照：只留驱动骨架的连续量 + 用于判定 snap 的离散键。 */
export type PoseSnapshot = {
  time: number;
  /** 离散键：任一不同就不插值（避免跨段 / 换武器 / 换目标时被抹平） */
  key: string;
  ch: {
    x: number; y: number; z: number;
    facing: number; moveYaw: number; bodyYaw: number; headYaw: number;
    headPitch: number; bodyPitch: number;
    gaitPhase: number; stride: number;
  };
  cb: {
    attackProgress: number;
    phaseTimer: number;
    charge: number;
    hitstop: number;
  };
  hurt: { timer: number; duration: number; knockX: number; knockZ: number };
  dm: Array<{
    x: number; y: number; z: number;
    facing: number; bodyYaw: number; headYaw: number;
    gaitPhase: number; stride: number;
    attackProgress: number;
  }>;
};

export type PoseOverrides = {
  time: number;
  character: Partial<CharacterState>;
  combat: Partial<CombatState>;
  playerHurt: Partial<HurtState>;
  /** 长度与当前 `world.dummies` 一致；对应假人不存在时为 null（调用方保留原值） */
  dummies: Array<Partial<DummyState> | null>;
};

/** 最短弧插值：处理 ±π 与 2π 步相回绕，避免从 179° 插到 −179° 时倒转一整圈。 */
export function lerpAngle(a: number, b: number, t: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * 离散键：这几项一变就说明发生了「事件性切换」，插值会把切换抹成渐变。
 * 只放真正离散的量；`hitstop` 虽然是数值，但它表示冻结开始 / 结束，也按事件处理。
 */
function discreteKey(w: World): string {
  const c = w.combat;
  const dm = w.dummies;
  let s = `${c.weapon}|${c.phase}|${c.comboIndex}|${c.attackId}|${w.character.grounded ? 1 : 0}|${w.character.sprinting ? 1 : 0}|${w.playerHurt.type}|${c.hitstop > 0 ? 1 : 0}`;
  for (let i = 0; i < dm.length; i++) {
    const d = dm[i];
    s += `|${d.id}:${d.mode}:${d.attackPhase}:${d.attackId}:${d.hurt.type}`;
  }
  return s;
}

export function capturePose(w: World): PoseSnapshot {
  const c = w.character;
  const cb = w.combat;
  const hurt = w.playerHurt;
  return {
    time: w.time,
    key: discreteKey(w),
    ch: {
      x: c.position.x, y: c.position.y, z: c.position.z,
      facing: c.facing, moveYaw: c.moveYaw, bodyYaw: c.bodyYaw, headYaw: c.headYaw,
      headPitch: c.headPitch, bodyPitch: c.bodyPitch,
      gaitPhase: c.gaitPhase, stride: c.stride,
    },
    cb: {
      attackProgress: cb.attackProgress,
      phaseTimer: cb.phaseTimer,
      charge: cb.charge,
      hitstop: cb.hitstop,
    },
    hurt: { timer: hurt.timer, duration: hurt.duration, knockX: hurt.knockX, knockZ: hurt.knockZ },
    dm: w.dummies.map((d) => ({
      x: d.position.x, y: d.position.y, z: d.position.z,
      facing: d.facing, bodyYaw: d.bodyYaw, headYaw: d.headYaw,
      gaitPhase: d.gaitPhase, stride: d.stride,
      attackProgress: d.attackProgress,
    })),
  };
}

/** 两个快照之间能否安全插值：离散键不同、或假人数量变了，都必须 snap。 */
export function canInterpolate(a: PoseSnapshot, b: PoseSnapshot): boolean {
  return a.key === b.key && a.dm.length === b.dm.length;
}

/**
 * 按 `t ∈ [0,1]` 在 `a`（上一步）与 `b`（当前步）之间插值。
 * `t = 0` 精确等于 `a`、`t = 1` 精确等于 `b`（调用方可用它做「插值开 / 关」A/B）。
 */
export function blendPose(a: PoseSnapshot, b: PoseSnapshot, t: number): PoseOverrides {
  const k = Math.max(0, Math.min(1, t));
  const ch: Partial<CharacterState> = {
    position: { x: lerp(a.ch.x, b.ch.x, k), y: lerp(a.ch.y, b.ch.y, k), z: lerp(a.ch.z, b.ch.z, k) },
    facing: lerpAngle(a.ch.facing, b.ch.facing, k),
    moveYaw: lerpAngle(a.ch.moveYaw, b.ch.moveYaw, k),
    bodyYaw: lerpAngle(a.ch.bodyYaw, b.ch.bodyYaw, k),
    headYaw: lerpAngle(a.ch.headYaw, b.ch.headYaw, k),
    headPitch: lerp(a.ch.headPitch, b.ch.headPitch, k),
    bodyPitch: lerp(a.ch.bodyPitch, b.ch.bodyPitch, k),
    // 步相是 0..2π 的相位，必须走最短弧，否则过 2π 时会倒退一整圈
    gaitPhase: lerpAngle(a.ch.gaitPhase, b.ch.gaitPhase, k),
    stride: lerp(a.ch.stride, b.ch.stride, k),
  };
  const combat: Partial<CombatState> = {
    attackProgress: lerp(a.cb.attackProgress, b.cb.attackProgress, k),
    phaseTimer: lerp(a.cb.phaseTimer, b.cb.phaseTimer, k),
    charge: lerp(a.cb.charge, b.cb.charge, k),
    hitstop: k < 1 ? Math.max(0, lerp(a.cb.hitstop, b.cb.hitstop, k)) : b.cb.hitstop,
  };
  const playerHurt: Partial<HurtState> = {
    timer: lerp(a.hurt.timer, b.hurt.timer, k),
    knockX: lerp(a.hurt.knockX, b.hurt.knockX, k),
    knockZ: lerp(a.hurt.knockZ, b.hurt.knockZ, k),
  };
  const dummies = b.dm.map((bd, i) => {
    const ad = a.dm[i];
    if (!ad) return null;
    return {
      position: { x: lerp(ad.x, bd.x, k), y: lerp(ad.y, bd.y, k), z: lerp(ad.z, bd.z, k) },
      facing: lerpAngle(ad.facing, bd.facing, k),
      bodyYaw: lerpAngle(ad.bodyYaw, bd.bodyYaw, k),
      headYaw: lerpAngle(ad.headYaw, bd.headYaw, k),
      gaitPhase: lerpAngle(ad.gaitPhase, bd.gaitPhase, k),
      stride: lerp(ad.stride, bd.stride, k),
      attackProgress: lerp(ad.attackProgress, bd.attackProgress, k),
    } satisfies Partial<DummyState>;
  });
  return { time: lerp(a.time, b.time, k), character: ch, combat, playerHurt, dummies };
}

/**
 * 把插值结果套到真实 `World` 上，得到「只给渲染看」的替身。
 * 除姿态输入外的一切（config / events / targeting / abilities …）都沿用原对象，
 * 所以渲染层不需要知道插值的存在。
 */
export function applyPose(w: World, o: PoseOverrides): World {
  const dummies = w.dummies.map((d, i) => {
    const ov = o.dummies[i];
    return ov ? { ...d, ...ov } : d;
  });
  return {
    ...w,
    time: o.time,
    character: { ...w.character, ...o.character },
    combat: { ...w.combat, ...o.combat },
    playerHurt: { ...w.playerHurt, ...o.playerHurt },
    dummies,
  };
}
