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

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

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
  /**
   * v9e：当前步幅（米 / 周期），由 Core 写入。
   * 脚前伸距离 = stride × reachRatio，与相位推进速度严格配套 → 支撑脚世界位移为 0。
   * 传 0 表示拿不到物理步幅（如攻击等效驱动），退回按速度估算摆幅的旧路径。
   */
  stride: number;
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
 * 支撑相 / 摆动相的归一化脚偏移曲线（返回 −1..+1，1 = 脚在最前）。
 *
 *   p ∈ [0, π]   支撑相：脚从 +1 **线性**移到 −1，斜率恒为 −2/π。
 *                线性是关键 —— 只要求解器把相位按 v / stride 推进、脚前伸距离取 stride/4，
 *                脚相对身体的后退速度就恒等于身体前进速度，世界坐标下完全静止（零滑步）。
 *                旧实现用 cos + sin³，中段最快、两端最慢，身体匀速前进时中段必然往前蹭。
 *   p ∈ (π, 2π] 摆动相：三次 Hermite 从 −1 回到 +1，两端斜率都是 −2（对 p 是 −2/π），
 *                与支撑相首尾斜率完全一致 → 全曲线 C¹ 连续，没有折角，不会抽动。
 *
 * 摆动相初段会有约 0.08 的「向后过冲」（脚趾离地后的跟随），这是保持 C¹ 的代价，
 * 且发生在腾空阶段，不影响落地观感。
 */
function plantOffset(p: number): number {
  if (p <= Math.PI) return 1 - (2 * p) / Math.PI;
  const t = (p - Math.PI) / Math.PI;
  return -8 * t * t * t + 12 * t * t - 2 * t - 1;
}

/**
 * 单腿在一个步相周期内「脚相对髋」的偏移（归一化到 ±1）。
 * plantLock 在「旧余弦曲线」与「零滑步曲线」之间线性插值，方便调试面板 A/B 对照。
 * 两条曲线都是 C¹，凸组合仍 C¹，所以插值不会引入抽动。
 */
function footOffset(p: number, plantLock: number): number {
  const cos = Math.cos(p);
  const k = plantLock <= 0 ? 0 : plantLock >= 1 ? 1 : plantLock;
  if (k === 0) return cos;
  const plant = plantOffset(p);
  return k === 1 ? plant : cos + (plant - cos) * k;
}

/** 抬膝权重：支撑相中 ≈0、摆动相中 ≈1，C∞（由 sin 直接映射，无折点）。 */
function liftWeight(p: number): number {
  return (1 - Math.sin(p)) / 2;
}

export function solveGait(input: GaitInput, cfg: GaitViewConfig): GaitPose {
  if (!input.grounded || input.speed < EPS) return idle();

  const u = input.speed / Math.max(input.moveSpeed, EPS);
  const legLen = Math.max(input.legLength, EPS);

  // v9e：脚前伸距离（米）。有物理步幅时取 stride × reachRatio（0.25 = 零滑步），
  // 拿不到步幅（攻击等效驱动）才退回「摆幅随速度」的旧估算，保证 v8d 的攻击下盘观感不变。
  const reach = input.stride > EPS
    ? input.stride * cfg.reachRatio
    : Math.min(cfg.maxAmp, u * cfg.strideGain) * legLen;
  /** 摆幅（rad 等效），只用于抬膝 / 重心 / 摆臂等次级动作 */
  const amp = Math.min(cfg.maxAmp, reach / legLen);
  /**
   * 脚可达半径（米）：髋转角的几何上限。超出即钳制（钳制段必然有滑步，只在冲刺时发生）。
   * 1.25 rad（72°）是两骨 IK 仍能完全复现 FK 脚位的上限 —— 再大时摆动末期
   * 脚位会逼近 IK 的奇异区，实测钉地残差从 0 跳到 3cm（脚会「弹」一下）。
   */
  const maxFoot = legLen * Math.sin(Math.min(cfg.maxAmp, 1.25));

  // 方向权重：用分量绝对值，符号单独交给 dirF / dirR 处理
  const af = Math.abs(input.localForward);
  const ar = Math.abs(input.localRight);
  const sum = af + ar + EPS;
  const wF = af / sum;
  const wS = ar / sum;
  const dirF = input.localForward >= 0 ? 1 : -1; // 前进 +1 / 后退 -1
  const dirR = input.localRight >= 0 ? 1 : -1;   // 右移 +1 / 左移 -1

  const halfStride = reach;

  /** 脚偏移 → 髋关节角：用 asin 反解，保证「渲染出来的脚」水平位移真的等于设计值。
   *  线性近似（footLen / legLen）在 50° 以上会少算约 15%，那部分就是残余滑步。 */
  const legAngle = (foot: number): number => Math.asin(clamp(foot, -maxFoot, maxFoot) / legLen);

  /** side: -1 左腿 / +1 右腿；两腿相位差 π。 */
  function solveLeg(p: number, side: number): LegPose {
    const off = footOffset(p, cfg.plantLock);
    const lift = liftWeight(p);

    // 前后轴：脚偏移 → 髋俯仰（rotation.x 正使脚向后，故取负号）
    const footZ = dirF * wF * halfStride * off;
    const pitchX = -legAngle(footZ);

    // 左右轴：领先腿 = 移动方向那一侧；摆动相额外跨过中线（交叉步）
    const lead = side * dirR > 0 ? 1 : -1;
    const sideScale = 1 + lead * cfg.crossStep * 0.45;
    const crossOut = dirR * lead * cfg.crossStep * halfStride * 0.4 * lift;
    const footX = dirR * wS * halfStride * cfg.sideWeight * sideScale * off + crossOut * wS;
    const rollZ = legAngle(footX);

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
