import type { LeanViewConfig } from '../core';

/**
 * 惯性倾斜的分层解算（v8g），纯函数：零 THREE、零本地时间、零随机。
 *
 * 旧版只把 leanForward / leanSide 写到 upper（上半身绕腰倾斜），盆骨完全不动，
 * 于是加速时像「上身自己往前折」，而且移动时身体没有任何下沉。这里把同一份惯性
 * 拆成「盆骨小幅跟随 + 重心平移 + 稳态下沉」：
 *   - 盆骨倾角 = 上身倾角 × pelvisTiltGain（明显小于 1，腿只带一点点）；
 *   - 盆骨沿倾斜方向小幅平移，让重心跟着走；
 *   - 移动时按平滑后的速度比例略微下沉（压低重心，跑动更稳），脚由 IK 钉在地面。
 *
 * 输入都是表现层已平滑好的量，函数本身无状态；可直接单测、可跨语言对照重写。
 * 对应 C# 形态：static InertiaPose SolveInertiaPose(in InertiaInput i, in LeanConfig c)
 */
export type InertiaPose = {
  /** 盆骨绕 X（与上身前后倾斜同向） */
  pelvisPitch: number;
  /** 盆骨绕 Z（与上身侧倾同向） */
  pelvisRoll: number;
  /** 盆骨沿侧向的小幅重心平移（m） */
  pelvisX: number;
  /** 盆骨沿前后的小幅重心平移（m） */
  pelvisZ: number;
  /** 移动下沉深度（m，>= 0，调用方减到 pelvis.position.y） */
  crouch: number;
};

export type InertiaInput = {
  /** 已平滑的前后惯性倾角（rad） */
  leanForward: number;
  /** 已平滑的侧向惯性倾角（rad） */
  leanSide: number;
  /** 已平滑的 speed / moveSpeed（0..~2） */
  speedRatio: number;
};

export function solveInertiaPose(input: InertiaInput, cfg: LeanViewConfig): InertiaPose {
  const gain = Math.max(0, cfg.pelvisTiltGain);
  const shift = Math.max(0, cfg.pelvisShift);
  const f = Number.isFinite(input.leanForward) ? input.leanForward : 0;
  const s = Number.isFinite(input.leanSide) ? input.leanSide : 0;
  const u = Number.isFinite(input.speedRatio) ? Math.max(0, Math.min(1, input.speedRatio)) : 0;
  return {
    pelvisPitch: f * gain,
    // upper.rotation.z 正 = 躯干往 -X 倾，故盆骨平移取同向（负号）
    pelvisRoll: s * gain,
    pelvisX: -s * shift,
    pelvisZ: f * shift,
    crouch: Math.max(0, cfg.moveCrouch) * u,
  };
}
