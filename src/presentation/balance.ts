import type { BalanceViewConfig } from '../core';

/**
 * v9s.33 · 动态平衡量化（纯函数）。
 *
 * 以前「挥左手时右手往反方向收」只是经验规则，没有人知道重心到底有没有出支撑面。
 * 这里把角色当成一组质点：
 *
 *   COM  = Σ mᵢ·pᵢ / Σ mᵢ
 *   XCoM = COM + v · √(h/g)        （捕获点 / capture point，走路与急停都用它判平衡）
 *
 * 再把 XCoM 投影到两脚围成的支撑矩形（脚掌尺寸扩展）上，得到
 * `score = 1 − max(|dx|/halfX, |dz|/halfZ)`：1 = 正好压在中间，0 = 已到边缘。
 *
 * 为什么用 XCoM 而不是 COM：静止时两者相同；一旦身体在移动 / 前冲（lunge），
 * 即使 COM 还在脚下，动量也会把身体带出去。用 COM 判会漏掉「冲出去收不住」。
 *
 * 纯函数、无 THREE、无时间，方便单测与跨语言重写。
 */

export type BalancePoint = {
  x: number;
  y: number;
  z: number;
  /** 相对总质量的质量（不用归一化，函数内部会除） */
  mass: number;
};

export type BalanceSupport = {
  /** 支撑矩形（世界 XZ），通常由着地脚的脚掌包围盒并集得到 */
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type BalanceResult = {
  comX: number;
  comY: number;
  comZ: number;
  /** 捕获点：COM + v·√(h/g) */
  xcomX: number;
  xcomZ: number;
  centerX: number;
  centerZ: number;
  halfX: number;
  halfZ: number;
  /** 归一化余量：1 = 正中，0 = 贴边，<0 = 已经出界 */
  marginX: number;
  marginZ: number;
  /** 综合平衡分 0..1（出界钳到 0） */
  score: number;
  /** XCoM 相对支撑中心的方向（弧度，atan2(x,z)），用于决定往哪边配重 */
  leanDeg: number;
  /** 需要配重的方向：+1 = 局部右，−1 = 局部左（相对支撑中心） */
  side: -1 | 0 | 1;
  /** 出界量（米，0 = 还在支撑面内） */
  overX: number;
  overZ: number;
  /** 是否有有效支撑（双脚都离地时为 false，评分不参与验收） */
  grounded: boolean;
};

const DEFAULT_G = 9.81;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * @param points  质点（世界坐标 + 相对质量）
 * @param support 支撑矩形
 * @param vx/vz   身体水平速度（m/s）；用于把 COM 外推成捕获点
 * @param cfg     视图配置（reactionTime / gravity）
 */
export function solveBalance(
  points: BalancePoint[],
  support: BalanceSupport,
  vx: number,
  vz: number,
  cfg?: Partial<Pick<BalanceViewConfig, 'reactionTime' | 'gravity'>>,
): BalanceResult {
  const g = cfg?.gravity && cfg.gravity > 0 ? cfg.gravity : DEFAULT_G;
  const empty: BalanceResult = {
    comX: 0, comY: 0, comZ: 0, xcomX: 0, xcomZ: 0,
    centerX: 0, centerZ: 0, halfX: 0, halfZ: 0,
    marginX: 1, marginZ: 1, score: 1, leanDeg: 0, side: 0,
    overX: 0, overZ: 0, grounded: false,
  };
  let m = 0;
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const p of points) {
    const w = Number.isFinite(p.mass) && p.mass > 0 ? p.mass : 0;
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) continue;
    m += w;
    cx += p.x * w;
    cy += p.y * w;
    cz += p.z * w;
  }
  if (m <= 1e-6) return empty;
  cx /= m;
  cy /= m;
  cz /= m;

  const halfX = Math.max(0.02, (support.maxX - support.minX) / 2);
  const halfZ = Math.max(0.02, (support.maxZ - support.minZ) / 2);
  const centerX = (support.minX + support.maxX) / 2;
  const centerZ = (support.minZ + support.maxZ) / 2;
  const grounded = support.maxX - support.minX > 0.03 && support.maxZ - support.minZ > 0.03;
  if (!grounded) return { ...empty, comX: cx, comY: cy, comZ: cz, centerX, centerZ, halfX, halfZ };

  // 捕获点：越矮、反应时间越长，越容易被自己的动量带出去
  const tau = clamp(cfg?.reactionTime ?? 0.18, 0.02, 1);
  const k = Math.sqrt(Math.max(0.05, cy) / g) * tau * 4;
  const xcomX = cx + (Number.isFinite(vx) ? vx : 0) * k;
  const xcomZ = cz + (Number.isFinite(vz) ? vz : 0) * k;

  const nx = Math.abs(xcomX - centerX) / halfX;
  const nz = Math.abs(xcomZ - centerZ) / halfZ;
  const score = clamp(1 - Math.max(nx, nz), 0, 1);
  const overX = Math.max(0, Math.abs(xcomX - centerX) - halfX);
  const overZ = Math.max(0, Math.abs(xcomZ - centerZ) - halfZ);

  return {
    comX: cx, comY: cy, comZ: cz,
    xcomX, xcomZ,
    centerX, centerZ, halfX, halfZ,
    marginX: clamp(1 - nx, -1, 1),
    marginZ: clamp(1 - nz, -1, 1),
    score,
    leanDeg: (Math.atan2(xcomX - centerX, xcomZ - centerZ) * 180) / Math.PI,
    side: nx > 0.98 ? (xcomX > centerX ? 1 : -1) : 0,
    overX, overZ, grounded: true,
  };
}

/**
 * v9s.34 · 前馈外推：把「当前侧向偏移」按侧向速度外推 `lead` 秒。
 *
 * 为什么要它：自动修正是个闭环 —— 读 IK 后的脚位 → 算偏移 → 挪骨盆 → 下一帧脚位又变。
 * `counterRate = 8`（τ≈125ms）是按「不抖」调的，所以快速横移 / 被击退时，
 * 修正永远慢半拍，读数会滞后 1~2 帧。
 *
 * 前馈不是「更用力」，而是「更早」：用速度估计 `lead` 秒后的偏移量，
 * 与当前偏移取**绝对值更大**的那个作为控制目标。静止时两者相同，
 * 纯反馈行为完全不变 —— `lead = 0` 时精确退化。
 */
export function feedForwardLateral(lateral: number, lateralSpeed: number, lead: number): number {
  if (!Number.isFinite(lateral)) return 0;
  if (!Number.isFinite(lateralSpeed) || !(lead > 0)) return lateral;
  const pred = lateral + lateralSpeed * lead;
  // 预测会穿过中心（符号翻转）：说明人正在往回收，外推值没有意义 ——
  // 直接给 0（不再往外压），而不是反号去推另一侧，否则骨盆会在中心两侧来回抽。
  if (lateral !== 0 && Math.sign(pred) !== Math.sign(lateral)) return 0;
  // 只放大「正在往外出」的情况：往里倒（速度指向中心）时提前收力会显得抽搐
  return Math.abs(pred) > Math.abs(lateral) ? pred : lateral;
}

/**
 * v9s.34 · 负载加权修正速率。
 *
 * `load` = 偏移量 / 支撑半宽（1 = 正好踩在边缘）。
 * 偏得越多，允许的修正越快 —— 慢挪几毫米够用，真要摔了就得一步到位。
 * `boost = 0` 时精确回到常数速率（v9s.33 行为）。
 */
export function counterRateFor(base: number, load: number, boost: number): number {
  const b = Math.max(0, base);
  if (!(boost > 0)) return b;
  const l = clamp(Number.isFinite(load) ? load : 0, 0, 2);
  return b * (1 + boost * l);
}
