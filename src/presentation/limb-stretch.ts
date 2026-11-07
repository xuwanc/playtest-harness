/**
 * 四肢 squash & stretch 纯函数层（v9s.22）。
 *
 * 目的：把「动作不够夸张」从调姿态角度变成可量化的形变通道。
 * 体素角色的手臂很短（0.36 m < 肩宽 0.6 m），单靠加大 rotation 会立刻穿模 / 脱臼；
 * 动画行业的标准做法是在**挥出的那几帧**把肢体沿骨长方向拉长、命中瞬间压扁，
 * 靠「形变」而不是「角度」制造力量感（Disney 十二原则之 squash & stretch）。
 *
 * 三条约束让形变不廉价：
 *   1) **幅度小、时间短**：峰值 1.1~1.2，只在 swing 峰值附近出现，其余时间恒为 1；
 *   2) **体积补偿**：拉长时垂直方向按 `along^-volumeExp` 收细（泊松效应），
 *      压扁时自动变粗 —— 视觉上是「橡皮」而不是「面条」；
 *   3) **限速**：输出经指数平滑，姿态跳变时不会让手臂「啪」地弹一下。
 *
 * 零 THREE / 零 DOM / 零时间 / 零随机：输入纯数值、输出纯数值，可直接单测。
 */

export type StretchConfig = {
  enabled: boolean;
  swingArm: number;
  chargeArm: number;
  runLeg: number;
  torsoGain: number;
  impactSquash: number;
  impactDecay: number;
  volumeExp: number;
  smoothing: number;
};

export type StretchInput = {
  /** 挥击曲线：-1 = 蓄势到底，+1 = 挥出到底，0 = 中立 */
  swing: number;
  /** 蓄力进度 0..1（弓）；0 = 未蓄力 */
  charge: number;
  /** 命中 / 砍到底的冲击脉冲 0..1（由 rig 按 swing 拐点触发并自行衰减） */
  impact: number;
  /** 速度比 0..1（跑动时腿部轻微拉长） */
  speedRatio: number;
  /** 落地时腿不做拉伸（空中腿是收起的，拉长会像踩高跷） */
  grounded: boolean;
};

/** 每段骨骼的沿骨长缩放（1 = 原长）与垂直方向补偿。 */
export type StretchPose = {
  arm: number;
  leg: number;
  torso: number;
  /** 手臂 / 腿 / 躯干的「粗细」缩放（沿垂直方向） */
  girthArm: number;
  girthLeg: number;
  girthTorso: number;
};

export const NEUTRAL_STRETCH: StretchPose = {
  arm: 1, leg: 1, torso: 1, girthArm: 1, girthLeg: 1, girthTorso: 1,
};

const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** 体积补偿：沿骨长 s 倍时，垂直方向取 s^-exp。exp=0.5 近似体积守恒。 */
function girth(along: number, exp: number): number {
  const s = Math.max(0.2, along);
  return clamp(Math.pow(s, -exp), 0.5, 2);
}

/**
 * 解算本帧的形变目标。
 *
 * 时序（以剑类一段攻击为例）：
 *   windup  swing=-1  → 手臂压到 chargeArm（0.94，变短变粗，像屈臂蓄力）
 *   active  上升     → 按 easeOut 拉向 swingArm（1.16），峰值落在挥出末段
 *   active  拐点     → impact 脉冲把整体压一下（impactSquash），随即回弹
 *   recovery swing→0 → 回到 1
 *
 * `impact` 用「先压后弹」的两段式：命中帧直接乘 (1 - squash)，回弹交给 smoothing，
 * 因此不需要额外的弹簧状态，参数也只有两个。
 */
export function solveStretch(input: StretchInput, cfg: StretchConfig): StretchPose {
  if (!cfg.enabled) return { ...NEUTRAL_STRETCH };

  const swing = clamp(input.swing, -1, 1);
  const charge = clamp(input.charge, 0, 1);
  const impact = clamp(input.impact, 0, 1);
  const speedRatio = clamp(input.speedRatio, 0, 1);

  // 挥出：easeOut，幅度在末段才拉满（起手不能已经很长，否则没有「甩出去」的对比）
  const forth = Math.max(0, swing);
  const forthEase = 1 - (1 - forth) * (1 - forth);
  const swingTarget = 1 + (Math.max(1, cfg.swingArm) - 1) * forthEase;

  // 蓄势 / 收势：压缩（变短变粗）
  const back = Math.max(0, -swing);
  const chargeComp = clamp(cfg.chargeArm, 0.6, 1);
  const chargeTarget = 1 - (1 - chargeComp) * back;
  const bowTarget = 1 - (1 - chargeComp) * charge;

  // 三条通道互斥：挥出 / 蓄势 / 拉弓，同一帧只会有一条非零。
  let arm = 1;
  if (forth > 0) arm = swingTarget;
  else if (back > 0) arm = chargeTarget;
  else if (charge > 0) arm = bowTarget;

  // 命中挤压：直接乘在沿骨长上（squash 时手臂同时变短变粗）
  const squash = 1 - clamp(cfg.impactSquash, 0, 0.6) * impact;
  arm *= squash;

  // 腿：跑动时轻微拉长（步幅感），空中不动；命中时同样被压一下
  const runLeg = Math.max(1, cfg.runLeg);
  const legBase = input.grounded ? 1 + (runLeg - 1) * speedRatio : 1;
  const leg = legBase * (1 - clamp(cfg.impactSquash, 0, 0.6) * impact * 0.6);

  // 躯干：只吃挥出的一小部分，避免整个人变形成柱子
  const torsoGain = clamp(cfg.torsoGain, 0, 1);
  const torso = 1 + (arm - 1) * torsoGain;

  arm = clamp(arm, 0.6, 1.6);
  return {
    arm,
    leg: clamp(leg, 0.6, 1.4),
    torso: clamp(torso, 0.7, 1.4),
    girthArm: girth(arm, cfg.volumeExp),
    girthLeg: girth(leg, cfg.volumeExp),
    girthTorso: girth(torso, cfg.volumeExp),
  };
}

/** 指数平滑；`rate` 越大跟得越紧。帧率无关。 */
export function smoothStretch(
  current: StretchPose,
  target: StretchPose,
  dt: number,
  rate: number,
): StretchPose {
  const k = 1 - Math.exp(-Math.max(0, rate) * Math.max(0, dt));
  const mix = (a: number, b: number) => a + (b - a) * k;
  return {
    arm: mix(current.arm, target.arm),
    leg: mix(current.leg, target.leg),
    torso: mix(current.torso, target.torso),
    girthArm: mix(current.girthArm, target.girthArm),
    girthLeg: mix(current.girthLeg, target.girthLeg),
    girthTorso: mix(current.girthTorso, target.girthTorso),
  };
}

/**
 * 命中脉冲衰减：impact 从 1 指数衰减到 0。
 * 单独抽出来，是为了让「衰减速率」和「形变量」两个参数互不耦合。
 */
export function decayImpact(impact: number, dt: number, decay: number): number {
  const v = impact * Math.exp(-Math.max(EPS, decay) * Math.max(0, dt));
  return v < 1e-3 ? 0 : clamp(v, 0, 1);
}
