import type { HurtState, HurtViewConfig, HurtPoseProfile } from '../core';
import { clamp01, landingPulse } from './program-anim';

/**
 * 分层受击姿态的纯函数层（v8f）。
 *
 * 旧版问题：受击只写 `bob.rotation.x/z`，而 bob 原点在「脚底」，于是整个人绕脚底
 * 刚性倾倒、腿完全不动 —— 观感就是「脚底锚定身体倾斜」。v8f 把骨架改成
 * 共享骨盆 → upper（绕腰）/ lower（绕髋）后，这里输出的是「各层各自的反应」：
 *
 *   - 上半身（upper）：绕腰倾斜 / 侧倾 / 扭转 + 相对骨盆朝受击方向偏移 → 幅度大
 *   - 骨盆（pelvis）：屁股向后 + 整体下沉 + 沿受击方向的小幅重心偏离 → 幅度小
 *   - 下盘（lower）：两腿屈膝 + 髋前倾吸收冲击，脚大体留原地 → 不再「腿钉死」
 *
 * 「整体重心根据受击力度偏离幅度小于身体反应」由 comShift << profile.shift 保证，
 * 且两者都随 intensity 线性增长，可量化断言。
 *
 * 命中部位（打肩 / 打腹）与力度（light / heavy / knock）正交：力度取 lean(type)，
 * 部位由 hitHeight 在 abdomen / shoulder 两套 profile 间插值。全部由 Core 的
 * hurt.timer / duration / dir 派生，零 THREE、零本地时间、零随机，暂停 / 时间缩放 /
 * 单步推进都与逻辑同步，可直接单测、可跨语言对照重写。
 *
 * 对应 C# 形态：static class HurtPoseMath { ... }
 */

/** solveHurtPose 的输出：一层一个量，调用方按语义写到对应骨骼节点。 */
export type HurtPose = {
  /** 是否处于有效受击（type != none 且进度在 (0,1) 内） */
  active: boolean;
  /** 是否走旧版对照路径（cfg.enabled = false） */
  legacy: boolean;
  /** 力度 = lean(type) */
  intensity: number;
  /** 冲击脉冲 0..1（两端为 0、C¹ 连续） */
  pulse: number;
  /** 实际采用的命中部位 0 = 腹 / 1 = 肩 */
  hitHeight: number;
  /** 命中方向在身体局部的前 / 右分量（诊断 + 方向性） */
  localFwd: number;
  localRight: number;
  /** 上半身（绕腰） */
  upperPitch: number;
  upperRoll: number;
  upperYaw: number;
  upperShiftX: number;
  upperShiftZ: number;
  /** 上半身相对骨盆的位移幅度（诊断） */
  upperShift: number;
  /** 整体重心（骨盆）沿受击方向 */
  comX: number;
  comZ: number;
  /** 整体重心偏移幅度（诊断，恒 < upperShift） */
  comShift: number;
  /** 屁股向后（局部 -Z） */
  pelvisBack: number;
  /** 整体下沉 */
  drop: number;
  /** 屈膝 / 髋前倾 / 手臂 */
  knee: number;
  hip: number;
  arm: number;
  /** 受击闪色强度 */
  flash: number;
};

/** 供表现层初始化诊断读数用（未受击时的常量姿态）。 */
export function emptyHurtPose(): HurtPose {
  return zeroPose();
}

function zeroPose(): HurtPose {
  return {
    active: false, legacy: false, intensity: 0, pulse: 0, hitHeight: 0,
    localFwd: 0, localRight: 0,
    upperPitch: 0, upperRoll: 0, upperYaw: 0, upperShiftX: 0, upperShiftZ: 0, upperShift: 0,
    comX: 0, comZ: 0, comShift: 0,
    pelvisBack: 0, drop: 0, knee: 0, hip: 0, arm: 0, flash: 0,
  };
}

/** 力度直接复用三档 lean：light < heavy < knock，none = 0。 */
export function hurtIntensity(h: HurtState, cfg: HurtViewConfig): number {
  if (h.type === 'light') return Math.max(0, cfg.leanLight);
  if (h.type === 'heavy') return Math.max(0, cfg.leanHeavy);
  if (h.type === 'knock') return Math.max(0, cfg.leanKnock);
  return 0;
}

/**
 * 命中部位：forceHitHeight >= 0 时强制（调试面板对比用），否则按受击类型查表。
 * 永远夹在 0..1，非法 / NaN 一律回落到 0（腹部），不污染姿态。
 */
export function hurtHitHeight(h: HurtState, cfg: HurtViewConfig): number {
  if (Number.isFinite(cfg.forceHitHeight) && cfg.forceHitHeight >= 0) {
    return clamp01(cfg.forceHitHeight);
  }
  if (h.type === 'light') return clamp01(cfg.hitHeight.light);
  if (h.type === 'heavy') return clamp01(cfg.hitHeight.heavy);
  if (h.type === 'knock') return clamp01(cfg.hitHeight.knock);
  return 0;
}

/** 按命中部位在「腹部 / 肩部」两套姿态间逐字段线性插值。 */
export function lerpProfile(
  abdomen: HurtPoseProfile,
  shoulder: HurtPoseProfile,
  t: number,
): HurtPoseProfile {
  const k = clamp01(t);
  const mix = (a: number, b: number): number => a + (b - a) * k;
  return {
    upperPitch: mix(abdomen.upperPitch, shoulder.upperPitch),
    upperRoll: mix(abdomen.upperRoll, shoulder.upperRoll),
    upperYaw: mix(abdomen.upperYaw, shoulder.upperYaw),
    fold: mix(abdomen.fold, shoulder.fold),
    shift: mix(abdomen.shift, shoulder.shift),
    drop: mix(abdomen.drop, shoulder.drop),
    back: mix(abdomen.back, shoulder.back),
    knee: mix(abdomen.knee, shoulder.knee),
    hip: mix(abdomen.hip, shoulder.hip),
    arm: mix(abdomen.arm, shoulder.arm),
  };
}

/**
 * 解算一帧的分层受击姿态。
 *
 * 进度 p = 1 - timer/duration，脉冲复用落地缓冲的分段曲线（前 pulseRatio 快速到位、
 * 之后缓慢回正，两端值与导数均为 0），因此命中不会单帧从 0 跳到峰值，收尾也不抽动。
 *
 * 方向性沿用 v7b#1：把命中方向（攻击者 → 受击者，世界 XZ）转到身体局部，
 * 身体朝「被推方向」倾倒 —— 正面命中朝后倒、背后命中朝前倒、侧面命中朝侧面倒。
 */
export function solveHurtPose(h: HurtState, bodyYaw: number, cfg: HurtViewConfig): HurtPose {
  const pose = zeroPose();
  const intensity = hurtIntensity(h, cfg);
  pose.intensity = intensity;
  if (intensity <= 0 || h.duration <= 0 || !Number.isFinite(h.timer)) return pose;

  const p = clamp01(1 - h.timer / h.duration);
  const pulse = landingPulse(p, cfg.pulseRatio);
  pose.pulse = pulse;
  pose.active = pulse > 0;
  pose.hitHeight = hurtHitHeight(h, cfg);

  const fwdX = Math.sin(bodyYaw);
  const fwdZ = Math.cos(bodyYaw);
  const rightX = Math.cos(bodyYaw);
  const rightZ = -Math.sin(bodyYaw);
  const localFwd = h.dirX * fwdX + h.dirZ * fwdZ;
  const localRight = h.dirX * rightX + h.dirZ * rightZ;
  pose.localFwd = localFwd;
  pose.localRight = localRight;

  // 旧版对照：只有整体刚性倾斜 + 一点下沉 + 闪色，腿 / 骨盆 / 重心全 0。
  // 骨架重构后倾斜天然绕腰（不再是绕脚底），但「腿完全不参与」的旧缺陷保留，
  // 便于调试面板 A/B 对比与测试精确抓回归。
  if (!cfg.enabled) {
    pose.legacy = true;
    const k = Math.sin(Math.PI * p);
    pose.upperPitch = intensity * k * localFwd;
    pose.upperRoll = -intensity * k * localRight * 0.7;
    pose.drop = (intensity > 0.5 ? 0.09 : 0.04) * k;
    pose.flash = cfg.flashStrength * k;
    pose.active = k > 0;
    return pose;
  }

  const amp = intensity * pulse;
  const prof = lerpProfile(cfg.abdomen, cfg.shoulder, pose.hitHeight);

  // 上半身：绕腰倾斜（方向性 + 腹部含胸蜷缩）、侧倾、肩部扭转，幅度最大。
  pose.upperPitch = amp * (prof.upperPitch * localFwd + prof.fold);
  pose.upperRoll = -amp * prof.upperRoll * localRight;
  pose.upperYaw = amp * prof.upperYaw * localRight;

  // 上半身相对骨盆朝受击方向偏移（身体反应主幅度）
  pose.upperShift = amp * prof.shift;
  pose.upperShiftX = pose.upperShift * localRight;
  pose.upperShiftZ = pose.upperShift * localFwd;

  // 整体重心：沿受击方向偏离，但幅度明显小于上半身反应，且随力度线性增长
  pose.comShift = amp * cfg.comShift;
  pose.comX = pose.comShift * localRight;
  pose.comZ = pose.comShift * localFwd;

  // 骨盆后坐 + 整体下沉；屈膝 / 髋前倾 / 手臂反应（不随方向）
  pose.pelvisBack = amp * prof.back;
  pose.drop = amp * prof.drop;
  pose.knee = amp * prof.knee;
  pose.hip = amp * prof.hip;
  pose.arm = amp * prof.arm;
  pose.flash = cfg.flashStrength * pulse;
  return pose;
}
