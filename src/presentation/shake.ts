/**
 * v9s.x · 镜头震动：trauma 模型 + 按冲击类型分档。
 *
 * ## 为什么要换掉旧实现
 * 旧版是 `shakePhase += dt*52` 的三轴高频正弦叠加（≈11~19Hz）+ 线性幅度
 * `shake*0.055` + `exp(-9dt)` 快衰减，并且连击时 `addShake` **累加**。三个问题叠在一起，
 * 观感就是「震得太碎、像卡了掉帧」：
 *  - 高频正弦每帧换向，人眼读成画面撕裂 / 掉帧，而不是一次冲击；
 *  - 线性幅度 + 极快衰减，起始最猛、两三帧就没了，没有「砸下去再余震」的层次；
 *  - 一刀多帧 / 连击把能量越叠越高，变成持续蜂鸣。
 *
 * ## 成熟做法（GDC "Juice it or lose it" / UE CameraShake / 动作游戏震屏实践）
 *  1. **trauma 值**：一个 0..1 的能量，一次性注入、自己衰减到 0，绝不逐帧随机；
 *  2. **幅度 = amplitude × trauma^power（power≈2）**：尾部迅速收柔，不会戛然而止，
 *     也不会像线性那样「一起来就最猛」；
 *  3. **平滑噪声驱动，低频主导**：主振荡 2~6Hz 负责「沉」，中频细节层只占 20~38%
 *     权重负责「质感」；三轴用不同噪声种子错开相位，避免同步摆动那种机械感；
 *     绝不用 `Math.random()` 逐帧抖动（那正是「像静电/掉帧」的根因）；
 *  4. **按冲击类型分档**：轻击中高频小幅短促、重击低频大幅长余震、击地/技能/受击
 *     各有自己的频率与衰减；人眼对旋转震动敏感约 3 倍，本项目继续只做平移不改朝向；
 *  5. **同类短间隔只认一次 + 取最大不累加**：连击不会把震感叠成噪音。
 *
 * 全部是纯函数、确定性、不读 DOM / 外部时间，可单测，也便于逐字节移植到 C#。
 */
import type { World } from '../core/types';

export type ShakeKind =
  | 'light' | 'impact' | 'heavy' | 'slam' | 'skill' | 'hurt' | 'death';

export type ShakePreset = {
  /** trauma=1 时的位移幅度（米） */
  amplitude: number;
  /** trauma 线性衰减速率（1/s）；越小余震越长 */
  decay: number;
  /** 主振荡频率（Hz）；低频 = 沉重，高频 = 尖锐 */
  freq: number;
  /** 细节层频率倍数（相对主频） */
  detailMul: number;
  /** 细节层权重 0..1（只加质感，不主导节奏） */
  detailWeight: number;
  /** Y / Z 轴相对 X 的权重 */
  axisY: number;
  axisZ: number;
  /** 幅度整形指数：幅度 = amplitude × trauma^power */
  power: number;
};

/**
 * 分档表。数值是表现层常量（不进 Core / 快照），调试时可直接改这里对比手感。
 * 排布逻辑：越重的冲击 → 幅度越大、频率越低、衰减越慢、细节权重越高。
 */
export const SHAKE_PRESETS: Record<ShakeKind, ShakePreset> = {
  // 轻击：短促、小幅、中高频，几乎不留余震
  light: {
    amplitude: 0.050, decay: 4.2, freq: 6.0, detailMul: 2.3, detailWeight: 0.18,
    axisY: 0.55, axisZ: 0.42, power: 2,
  },
  // 普通命中：中频、中等幅度
  impact: {
    amplitude: 0.062, decay: 3.4, freq: 4.2, detailMul: 2.1, detailWeight: 0.24,
    axisY: 0.65, axisZ: 0.48, power: 2,
  },
  // 重击：低频大幅、余震明显
  heavy: {
    amplitude: 0.070, decay: 2.2, freq: 2.6, detailMul: 2.0, detailWeight: 0.32,
    axisY: 0.75, axisZ: 0.55, power: 2,
  },
  // 击地 / 冲击波：最沉，低频主导 + 最长余震
  slam: {
    amplitude: 0.065, decay: 1.9, freq: 2.0, detailMul: 2.2, detailWeight: 0.38,
    axisY: 0.85, axisZ: 0.60, power: 2,
  },
  // 技能（电环 / 齐射）：偏「法术嗡鸣」，中频、幅度克制
  skill: {
    amplitude: 0.045, decay: 3.6, freq: 5.2, detailMul: 2.0, detailWeight: 0.20,
    axisY: 0.55, axisZ: 0.40, power: 2,
  },
  // 玩家受击：和「打中别人」不同，中低频、稍长，带被推开的重量
  hurt: {
    amplitude: 0.060, decay: 2.8, freq: 3.2, detailMul: 2.1, detailWeight: 0.28,
    axisY: 0.70, axisZ: 0.50, power: 2,
  },
  // 敌人倒地：轻、短、偏钝
  death: {
    amplitude: 0.042, decay: 2.6, freq: 2.8, detailMul: 2.0, detailWeight: 0.22,
    axisY: 0.60, axisZ: 0.45, power: 2,
  },
};

/** 确定性整数哈希 → 0..1。不用 Math.random，回放 / 快照看到的波形一致。 */
function hash1(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

/**
 * 一维平滑噪声（value noise + smoothstep 插值），输出 -1..1。
 * 连续、无周期、帧间平滑 —— 这是「不像掉帧」的关键：相邻帧的偏移是连续变化的，
 * 而不是每帧重新抽一个随机数。
 */
export function smoothNoise1D(t: number, seed = 0): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  const s = seed * 57.3;
  const a = hash1(i + s);
  const b = hash1(i + 1 + s);
  return (a + (b - a) * u) * 2 - 1;
}

export type ShakeOffset = { x: number; y: number; z: number };

/** 给定 trauma / 预设 / 时间，算出这一帧的相机平移偏移（米）。纯函数，可单测。 */
export function shakeOffset(trauma: number, preset: ShakePreset, time: number): ShakeOffset {
  const clamped = trauma < 0 ? 0 : trauma > 1 ? 1 : trauma;
  const amp = preset.amplitude * Math.pow(clamped, preset.power);
  const t = time * preset.freq;
  // 三轴各用不同种子 → 相位天然错开，不会出现「所有轴同步来回摆」的机械感
  const layer = (seed: number): number =>
    smoothNoise1D(t, seed)
    + preset.detailWeight * smoothNoise1D(t * preset.detailMul + 13.7, seed + 5.1);
  return {
    x: layer(0) * amp,
    y: layer(7.3) * amp * preset.axisY,
    z: layer(19.1) * amp * preset.axisZ,
  };
}

/**
 * 从 World 派生这次命中该用哪一档震感。
 *
 * 强度 `tier` 来自 Core 的 hitstop 时长（已按受击类型 × 武器 × 连击衰减分档），
 * 表现层不再另立一张档位表 —— 两个通道天然同步，停得越久震得越沉。
 * 这里只补上「类型」维度：玩家自己挨打、大剑 / 击飞、双剑轻击各有不同波形。
 */
export function classifyImpact(world: World, tier: number): ShakeKind {
  // 玩家受击优先：同一帧既打中别人又被打时，读成「被推了一下」更合理
  if (world.playerHurt.type !== 'none') return 'hurt';
  const cb = world.combat;
  if (tier >= 0.8) return 'slam';                       // 击飞 / 第三段重击 / 落地冲击
  if (tier >= 0.58 || cb.weapon === 'greatsword') return 'heavy';
  if (tier <= 0.5 || cb.weapon === 'dual-swords' || cb.weapon === 'bow') return 'light';
  return 'impact';
}

/** 命中强度 → trauma 注入量。沿用旧版的 0.34..0.82 区间，保证读数与既有验收一致。 */
export function impactTrauma(tier: number): number {
  const t = tier < 0 ? 0 : tier > 1 ? 1 : tier;
  return 0.34 + t * 0.48;
}
