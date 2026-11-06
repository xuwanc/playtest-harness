import type { AttackStrideViewConfig, LandingViewConfig } from '../core';
import type { GaitPose } from './gait';

/**
 * 程序动画的纯函数层（v8c）：攻击姿态分层权重 + 跳跃 / 落地缓冲曲线。
 * 无 THREE、无本地时间、无随机、无外部状态；进度由调用方传入的 Core 时间决定，
 * 因此暂停 / 时间缩放 / 单步推进都与逻辑同步，可直接写单测、可跨语言对照重写。
 *
 * 对应 C# 形态：static class ProgramAnimMath { ... }
 */

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

const TAU = Math.PI * 2;

/** 与 GaitPose 同构的全零姿态，作为跨步叠加的基线。 */
function zeroPose(): GaitPose {
  return {
    legL: { pitchX: 0, rollZ: 0, kneeX: 0 },
    legR: { pitchX: 0, rollZ: 0, kneeX: 0 },
    pelvisX: 0, pelvisY: 0, pelvisRoll: 0, sideLean: 0,
    armL: 0, armR: 0, strafe: 0, backward: 0,
  };
}

/** 步态解算器中会被攻击等效驱动替换的四个量（与 GaitInput 同名同义）。 */
export type GaitDrive = {
  speed: number;
  phase: number;
  localForward: number;
  localRight: number;
};

/**
 * 攻击期间的步态等效驱动（v8d，核心修复）。
 *
 * 根因：Core 在攻击阶段锁自主移速（attackMoveScale=0 → v.x=v.z=0），
 * 而 solveGait 首行 `if (speed < EPS) return idle()`，且非 active 阶段
 * 连 gaitPhase 都因无位移而冻结 —— 于是「攻击时保留移动步态」这一路
 * 无论权重拉到多少都恒为全零姿态，表现上就是下半身完全不动。
 *
 * 这里不碰 Core，只在表现层把 gaitInput 的四个量按 attackBlend 平滑替换成
 * 由 attackProgress 派生的「攻击跨步」驱动：
 *  - phase: 真实相位 + progress × TAU × cycles（cycles 取整数 → progress=0/1
 *    两端与真实相位同相，进出攻击不跨相位跳变；progress 推进保证整段攻击腿持续摆动）。
 *  - speed: 等效步速 strideSpeed，让 solveGait 输出可见摆幅。
 *  - 方向: 前冲为主（forwardBias）+ 连击左右交替侧跨（comboIndex 奇偶）。
 * 四个量都按 blend 与真实输入线性插值，进出攻击连续；全部由 Core 量派生，
 * 无本地时间、无随机，暂停 / 时间缩放下仍同步且确定。
 */
export function attackGaitDrive(
  real: GaitDrive,
  progress: number,
  comboIndex: number,
  blend: number,
  cfg: AttackStrideViewConfig,
): GaitDrive {
  const b = clamp01(blend);
  if (b <= 0) return real;
  const p = clamp01(progress);
  const cycles = Math.max(1, Math.round(cfg.cycles));
  const speed = Math.max(0, cfg.strideSpeed);
  const lead = comboIndex % 2 === 0 ? 1 : -1;
  const fb = clamp01(cfg.forwardBias);
  const drive: GaitDrive = {
    speed,
    phase: real.phase + p * TAU * cycles,
    localForward: speed * fb,
    localRight: speed * (1 - fb) * lead,
  };
  return {
    speed: real.speed + (drive.speed - real.speed) * b,
    phase: real.phase + (drive.phase - real.phase) * b,
    localForward: real.localForward + (drive.localForward - real.localForward) * b,
    localRight: real.localRight + (drive.localRight - real.localRight) * b,
  };
}

/**
 * 攻击挥击跨步姿态（v8d）：每段攻击一次「蓄势后蹬 → 前踏跨出 → 收势回正」，
 * 连击段奇偶决定左右脚交替领先。包络 sin²(πp) 在两端值与导数均为 0，
 * 叠加结束后不残留；纯 Core 量派生，无本地时间。
 *
 * 与 attackGaitDrive 的区别：那边是「连续走路式」步态（解算器输出、相位连续），
 * 这边是「单次跨步脉冲」（幅度更大、左右交替更硬朗）。两者分别由
 * gaitWeight / lowerBodyWeight 控制，可单独或叠加对比。
 * 返回 GaitPose 同构体，便于按权重线性叠加到腿与骨盆。
 */
export function attackStridePose(
  progress: number,
  comboIndex: number,
  cfg: AttackStrideViewConfig,
): GaitPose {
  const pose = zeroPose();
  const p = clamp01(progress);
  const env = Math.sin(Math.PI * p) ** 2;
  if (env <= 1e-12) return pose;
  // legL 在 -1 侧、legR 在 +1 侧；偶数段右腿领先、奇数段左腿领先（沿用 applyStep 的交替语义）
  const lead = comboIndex % 2 === 0 ? 1 : -1;
  const lLead = lead < 0;
  const rLead = lead > 0;
  const pitch = cfg.stepPitch * env;
  const knee = cfg.stepKnee * env;
  const side = cfg.stepSide * env;
  pose.legL.pitchX = lLead ? -pitch : pitch * 0.55;
  pose.legR.pitchX = rLead ? -pitch : pitch * 0.55;
  pose.legL.kneeX = lLead ? knee : knee * 0.4;
  pose.legR.kneeX = rLead ? knee : knee * 0.4;
  pose.legL.rollZ = -side * lead;
  pose.legR.rollZ = side * lead;
  pose.pelvisX = cfg.stepSway * env * lead;
  pose.pelvisY = -cfg.stepDip * env; // 负值 = 重心下沉
  pose.pelvisRoll = side * 0.25 * lead;
  return pose;
}

/**
 * 蓄力缓冲脉冲：p=0 落地瞬间 → 快速下压到峰值 → 缓慢回弹 → p=1 归零。
 *   p ∈ [0, r)      下压段：sin(π/2 · p/r)，0 → 1
 *   p ∈ [r, 1)      回弹段：cos(π/2 · (p-r)/(1-r))，1 → 0
 * 两段在 r 处取值都是 1、导数都是 0（C¹ 连续），收尾导数也是 0，不会出现回正抽动；
 * 两端值均为 0，脉冲结束后姿态完全由步态 / 攻击层接管，不残留。
 */
export function landingPulse(p: number, compressRatio: number): number {
  if (p <= 0 || p >= 1) return 0;
  const r = Math.min(0.9, Math.max(0.05, compressRatio));
  if (p < r) return Math.sin((Math.PI / 2) * (p / r));
  return Math.cos((Math.PI / 2) * ((p - r) / (1 - r)));
}

/** 脉冲在当前 Core 时间的取值；时间倒退（复位）或未触发时返回 0。 */
export function pulseValue(
  now: number,
  start: number,
  duration: number,
  strength: number,
  compressRatio: number,
): number {
  if (duration <= 0 || strength <= 0) return 0;
  const p = (now - start) / duration;
  if (p < 0 || p >= 1) return 0;
  return strength * landingPulse(p, compressRatio);
}

/**
 * 攻击姿态混合系数：指数平滑进出攻击，帧率无关。
 * blend=0 完全由步态 / 静止基准接管，blend=1 攻击层完全生效；
 * 中间值让起手与收势不会在单帧里切换整套下盘姿态（避免跳变）。
 */
export function attackBlendStep(prev: number, attacking: boolean, dt: number, rate: number): number {
  const target = attacking ? 1 : 0;
  const k = 1 - Math.exp(-Math.max(0, rate) * Math.max(0, dt));
  const next = prev + (target - prev) * k;
  // 端点吸附：指数趋近永远留一条尾巴，会让 gaitScale=1-b / attackLegWeight=lw×b
  // 在「攻击稳定态」残留约 0.005 的比例，两个权重都关时下盘就静不干净。
  // 吸附到精确 0/1 后权重可真正归零，且吸附量 <0.001 不会造成可见跳变。
  if (attacking && next > 0.999) return 1;
  if (!attacking && next < 0.001) return 0;
  return next;
}

/**
 * 权重合成：把「攻击下半身过滤」显式拆成两个可热调的量。
 *  - gaitScale      步态对下盘的贡献：gaitWeight=1 攻击期间保留步态接管，0 = 淡出到静止基准
 *  - attackLegWeight 挥击跨步写腿的权重：默认 lowerBodyWeight=0 → 完全过滤
 * 两个权重都乘 blend，保证进出攻击连续。v8d 起两条路径各自都能让下盘产生可见动作。
 */
export function poseWeights(
  blend: number,
  gaitWeight: number,
  lowerBodyWeight: number,
): { gaitScale: number; attackLegWeight: number } {
  const b = clamp01(blend);
  return {
    gaitScale: 1 - b * (1 - clamp01(gaitWeight)),
    attackLegWeight: clamp01(lowerBodyWeight) * b,
  };
}

/**
 * 按 gaitScale 缩放整套步态姿态（腿、骨盆、摆臂、侧倾）。
 * strafe / backward 是诊断权重而非姿态量，保持原值供 HUD / 验收读取。
 */
export function scaleGaitPose(pose: GaitPose, gaitScale: number): GaitPose {
  const k = clamp01(gaitScale);
  if (k === 1) return pose;
  return {
    legL: {
      pitchX: pose.legL.pitchX * k,
      rollZ: pose.legL.rollZ * k,
      kneeX: pose.legL.kneeX * k,
    },
    legR: {
      pitchX: pose.legR.pitchX * k,
      rollZ: pose.legR.rollZ * k,
      kneeX: pose.legR.kneeX * k,
    },
    pelvisX: pose.pelvisX * k,
    pelvisY: pose.pelvisY * k,
    pelvisRoll: pose.pelvisRoll * k,
    sideLean: pose.sideLean * k,
    armL: pose.armL * k,
    armR: pose.armR * k,
    strafe: pose.strafe,
    backward: pose.backward,
  };
}

/**
 * 落地冲击强度：用落地前一帧的垂直速度（Core 落地当帧已把 vy 置 0）做归一化，
 * 从高处落下压得更深，小跳 / 走下台阶也保留 minScale 的可见缓冲。
 */
export function landingImpactScale(prevVy: number, cfg: LandingViewConfig): number {
  const impact = Math.min(1, Math.abs(prevVy) / Math.max(cfg.impactSpeed, 1e-6));
  return clamp01(cfg.minScale + (1 - cfg.minScale) * impact);
}
