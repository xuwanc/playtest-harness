import type { GaitViewConfig } from '../core';

/**
 * 程序化步态解算器（Overgrowth 式思路），纯函数：无 THREE、无本地时间、无随机。
 *
 * 参考 Overgrowth 的三点，但用「解析摆腿 + 重心」而非骨骼 IK，保持零依赖、可快照、帧率无关：
 *   1) 方向自适应：把速度投到身体局部，前进/后退走「前后轴」、侧移走「左右轴」，
 *      两轴按 |速度分量| 权重混合 —— 于是「边瞄准边侧移」时脚步沿真实移动方向摆，
 *      而不是先把整个下半身转向移动方向再原地前后比划。
 *   2) 脚落地锁定（foot plant）：支撑相把脚的偏移往身后压（sin³ 项），抵消髋部前移，
 *      观感是脚踩在地上不滑；摆动相快速回摆并抬膝。
 *   3) 侧向交叉步 + 重心转移：侧移时移动方向那条腿是「领先腿」，摆动相额外跨过中线、
 *      步幅更大；跟随腿小幅收回。骨盆朝支撑脚侧移、随步相起伏与侧倾，上半身对侧摆臂。
 *
 * 抗抽动约束（v7c 步频回归的教训）：整条曲线只由 sin/cos 构成，C∞ 连续，
 * 没有 max/clamp 折点、没有相位重缩放；相位直接取 Core 累加的 gaitPhase。
 *
 * 对应 C# 形态：static GaitPose SolveGait(in GaitInput i, in GaitConfig c)
 */
const TAU = Math.PI * 2;
const EPS = 1e-6;

export type GaitInput = {
  /** Core 累加的步态相位（连续单调，跨 2π 循环） */
  phase: number;
  /** 水平速度大小（m/s） */
  speed: number;
  /** 参考移动速度（m/s） */
  moveSpeed: number;
  /** 速度在身体前方（局部 +Z）的投影，带符号，m/s */
  localForward: number;
  /** 速度在身体右方（局部 +X）的投影，带符号，m/s */
  localRight: number;
  /** 腿长（m），用于把「脚偏移」换算成髋部弧度 */
  legLength: number;
  grounded: boolean;
};

export type LegPose = {
  /** 髋绕 X（正 = 脚向后） */
  pitchX: number;
  /** 髋绕 Z（正 = 脚向右） */
  rollZ: number;
  /** 膝弯曲（>= 0） */
  kneeX: number;
};

export type GaitPose = {
  legL: LegPose;
  legR: LegPose;
  /** 骨盆侧移（米，身体局部 +X） */
  pelvisX: number;
  /** 骨盆起伏（米，>= 0 抬起） */
  pelvisY: number;
  /** 骨盆侧倾（rad） */
  pelvisRoll: number;
  /** 上半身侧倾（rad，叠加到 bob.rotation.z） */
  sideLean: number;
  /** 左 / 右臂前后摆（rad） */
  armL: number;
  armR: number;
  /** 诊断：侧移权重 0..1 */
  strafe: number;
  /** 诊断：后退权重 0..1 */
  backward: number;
};

function idle(): GaitPose {
  return {
    legL: { pitchX: 0, rollZ: 0, kneeX: 0 },
    legR: { pitchX: 0, rollZ: 0, kneeX: 0 },
    pelvisX: 0, pelvisY: 0, pelvisRoll: 0, sideLean: 0,
    armL: 0, armR: 0, strafe: 0, backward: 0,
  };
}

/**
 * 单腿在一个步相周期内「脚相对髋」的偏移曲线（单位：米，返回归一化到 ±1）。
 * 全 C∞：cos(p) 为主摆，sin³(p) 为「支撑相脚锁定」修正，端点处 sin=0 不影响边界值，
 * 因此 stance→swing 过渡一阶/二阶都连续，不会出现抽动。
 *
 *   p = 0      脚在最前（+1），支撑相开始
 *   p ∈ (0, π)  支撑相：sin>0 → sin³>0，把脚往身后压，抵消髋部前移 = 脚锁定
 *   p ∈ (π,2π) 摆动相：sin<0 → sin³<0，脚更快回摆到前方
 */
function footOffset(p: number, plantLock: number): number {
  const sp = Math.sin(p);
  return Math.cos(p) - plantLock * 0.28 * sp * sp * sp;
}

/** 抬膝权重：支撑相中 ≈0、摆动相中 ≈1，C∞（由 sin 直接映射，无折点）。 */
function liftWeight(p: number): number {
  return (1 - Math.sin(p)) / 2;
}

export function solveGait(input: GaitInput, cfg: GaitViewConfig): GaitPose {
  if (!input.grounded || input.speed < EPS) return idle();

  const u = input.speed / Math.max(input.moveSpeed, EPS);
  const amp = Math.min(cfg.maxAmp, u * cfg.strideGain);

  // 方向权重：用分量绝对值，符号单独交给 dirF / dirR 处理
  const af = Math.abs(input.localForward);
  const ar = Math.abs(input.localRight);
  const sum = af + ar + EPS;
  const wF = af / sum;
  const wS = ar / sum;
  const dirF = input.localForward >= 0 ? 1 : -1; // 前进 +1 / 后退 -1
  const dirR = input.localRight >= 0 ? 1 : -1;   // 右移 +1 / 左移 -1

  const legLen = Math.max(input.legLength, EPS);
  const halfStride = amp * legLen;

  /** side: -1 左腿 / +1 右腿；两腿相位差 π。 */
  function solveLeg(p: number, side: number): LegPose {
    const off = footOffset(p, cfg.plantLock);
    const lift = liftWeight(p);

    // 前后轴：脚偏移 → 髋俯仰（rotation.x 正使脚向后，故取负号）
    const footZ = dirF * wF * halfStride * off;
    const pitchX = -footZ / legLen;

    // 左右轴：领先腿 = 移动方向那一侧；摆动相额外跨过中线（交叉步）
    const lead = side * dirR > 0 ? 1 : -1;
    const sideScale = 1 + lead * cfg.crossStep * 0.45;
    const crossOut = dirR * lead * cfg.crossStep * halfStride * 0.4 * lift;
    const footX = dirR * wS * halfStride * cfg.sideWeight * sideScale * off + crossOut * wS;
    const rollZ = footX / legLen;

    // 膝：摆动相抬起；侧移的领先腿多弯一点（跨步更明显）
    const kneeX = cfg.kneeLift * lift * amp * (0.55 + 0.25 * wF + (lead > 0 ? 0.2 * wS : 0));
    return { pitchX, rollZ, kneeX };
  }

  const p = ((input.phase % TAU) + TAU) % TAU;
  const legL = solveLeg(p, -1);
  const legR = solveLeg((p + Math.PI) % TAU, 1);

  // 重心：朝支撑脚侧移（cos p）、摆动相抬起（lift）、侧移时朝反方向压（离心）
  const cosP = Math.cos(p);
  const lift = liftWeight(p);
  const pelvisX = -cfg.comSway * amp * cosP * (0.6 * wF + 0.8 * wS)
    - dirR * cfg.comSway * amp * wS * 0.45;
  const pelvisY = cfg.comBob * lift * amp;
  const pelvisRoll = dirR * cfg.hipLean * amp * wS * cosP * 0.6;
  const sideLean = dirR * cfg.hipLean * amp * wS * (0.45 + 0.25 * cosP);

  // 手臂：与腿对侧摆，前进/后退随 dirF 反号，侧移保留小幅摆臂
  const armSw = cfg.armSwing * amp * cosP * (wF * dirF + 0.3 * wS);
  const armL = armSw;
  const armR = -armSw;

  return {
    legL, legR, pelvisX, pelvisY, pelvisRoll, sideLean, armL, armR,
    strafe: wS,
    backward: dirF < 0 ? wF : 0,
  };
}
