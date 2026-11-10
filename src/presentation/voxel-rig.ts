/**
 * 主角骨架：装配（层级 + 武器挂点）与逐帧姿态解算。
 *
 * 2700 行是**结构决定的**，不是堆出来的：`createVoxelRig` 内部是一条固定的逐帧流水线
 * （读 Core 状态 → 步态 → 攻击混合 → 受击分层 → IK → 平衡配重 → 写回骨骼），
 * 相邻阶段共享 40+ 个跨帧状态量（停步窗口、惯性脉冲、段间过渡起点……）。
 * 把阶段拆成独立函数要把这些状态整体穿成 context 对象：收益是文件变短，
 * 代价是每帧多一层间接、每个状态都要去 context 里找定义 —— 不划算，故不硬拆。
 *
 * 已经拆出去的部分（这是它现在仍然可读的原因）：
 *   rig-parts.ts     武器 / 身体零件的几何构建（无状态）
 *   gait.ts          步态数学（纯函数）
 *   program-anim.ts  程序动画权重与混合
 *   hurt-pose / balance / inertia / rig-ik   各层解算器
 *
 * 往里加东西前先问「这是数学还是编排」：数学进上面的模块，别在这里长分支。
 */
import * as THREE from 'three';
import { wrapAngle } from '../core';
import type {
  CharacterState, ColorConfig, CombatState, GaitViewConfig, HurtState, HurtViewConfig,
  IKViewConfig, LeanViewConfig, LinkState, LinkViewConfig, OrientationViewConfig,
  BalanceViewConfig,
  ProgramAnimViewConfig, StanceViewConfig, SwingPoseViewConfig, TurnInPlaceState, VoxelConfig, WeaponId,
  WeaponMountConfig,
  WeaponWristViewConfig,
} from '../core';
import {
  solveGait, solveStopGait, nextFeetTogetherPhase, strafeHipYaw, backStrafeKeep,
  backHipYawTarget,
  stopBlendGate, chestYawFromHip, solveStopInertia, bodyLocalDir,
  stopYawFade, solveTurnStep, slewDirSign, slewHipTarget, turnSpinGate,
  hipFlipWeight, hipTrackRate, slewGate,
  idleStanceConfig, idleStanceTarget, leadFootIsLeft, mixIdleStance, solveIdleStance,
} from './gait';
import type { GaitInput } from './gait';
import {
  attackBlendStep, attackGaitDrive, attackStridePose, landingImpactScale,
  mixLowerGait, poseWeights, pulseValue, scaleGaitPose,
} from './program-anim';
import type { GaitDrive } from './program-anim';
import { emptyHurtPose, solveHurtPose } from './hurt-pose';
import { counterRateFor, feedForwardLateral, solveBalance } from './balance';
import type { BalancePoint, BalanceResult } from './balance';
import type { HurtPose } from './hurt-pose';
import { solveInertiaPose } from './inertia';
import { applyFootIK, captureIKBase, EMPTY_IK_DIAGNOSTICS } from './rig-ik';
import { blendIKAngles, solveTwoBoneIK } from './ik';
import type { IKDiagnostics, IKLimb } from './rig-ik';
import { pitchInModelSpace } from './rig-space';
import {
  decayImpact, NEUTRAL_STRETCH, smoothStretch, solveStretch,
} from './limb-stretch';
import type { StretchConfig, StretchPose } from './limb-stretch';
import { autoSegBlend, blendSwingPose, segEase, solveSwingPose } from './swing-pose';
import type { SwingPose } from './swing-pose';
import { beardAvoidAt, createBeardState, solveBeard } from './beard';
import type { BeardState } from './beard';
import {
  buildMurlocBelly, buildMurlocDorsalFin, buildMurlocFoot, buildMurlocHand, buildMurlocHead,
  buildMurlocShoulderFin, buildMurlocTail, MURLOC_HEAD_SPIN, MURLOC_POSTURE,
} from './murloc-parts';
import {
  buildSentinelFoot, buildSentinelHand, buildSentinelHead, buildSentinelTorso,
} from './sentinel-parts';

export type VoxelRig = {
  group: THREE.Group;
  /** 步态、握持、朝向与受击完全由 Core 状态驱动；frameDt 仅用于表现层惯性倾斜的平滑。
   *  channeling = 法杖是否正在引导奥术飞弹（v7c #12），用于叠加举杖 / 法球发光姿态。
   *  coreTime = Core 的 world.time（可选）：落地缓冲脉冲用它计时，暂停 / 时间缩放 / 单步
   *  都与逻辑同步；不传时（单测）退化为按 frameDt 累加的本地时间。 */
  update(
    c: CharacterState, combat: CombatState, hurt: HurtState, frameDt: number,
    channeling?: boolean, coreTime?: number, link?: LinkState,
    turn?: TurnInPlaceState,
  ): void;
  /** 表现层诊断读数（弧度），供实验台观测，不进入 Core / 快照。 */
  lean(): { forward: number; side: number };
  /** v8c：跳跃 / 落地缓冲脉冲的实时读数（纯表现，不进 Core）。 */
  landing(): {
    /** 当前脉冲强度 0..1（0 = 无缓冲） */
    pulse: number;
    /** 剩余时长（秒） */
    remaining: number;
    kind: 'none' | 'land' | 'jump';
    /** 触发落地时读到的落地前垂直速度（m/s，负 = 下落） */
    impactVy: number;
  };
  /** v9s.55：本帧待机斜跨站姿读数（权重 / 前脚 / 下沉 / 侧移）。 */
  idleStance(): { weight: number; frontLeft: boolean; sink: number; shift: number };
  /** v8c：攻击姿态混合系数 0..1（0 = 完全由步态 / 静止基准接管）。 */
  attackBlend(): number;
  /** v8d：两个下半身权重与本帧攻击等效驱动读数，供验收「权重是否真的生效」。 */
  attackWeights(): {
    gaitScale: number;
    attackLegWeight: number;
    /** 本帧喂给 solveGait 的等效速度（>0 才会解算出姿态，Core 锁速时为 0 是旧 bug） */
    driveSpeed: number;
    /** 本帧喂给 solveGait 的相位 */
    stridePhase: number;
    /** v9s.41：本段跨步的起始相位（连段时接上一段停下的相位）/ 单调步序（奇偶决定哪条腿领先） */
    strideBase: number;
    stepIndex: number;
  };
  /** v8f：本帧分层受击姿态的诊断读数（不进 Core / 快照）。 */
  hurt(): HurtPose;
  /** v8g：本帧足部 IK 锚定读数（是否生效 / 权重 / 钳制数 / 钉地残差）。 */
  ik(): IKDiagnostics;
  /** v9s.22：本帧四肢 squash & stretch 读数（1 = 原长），含命中脉冲强度。 */
  stretch(): StretchPose & { impact: number };
  /** v9s.22：副手握持读数（目标距离 / 实际采用的握点位置 / 解出的角度），调试用。 */
  gripDebug(): {
    active: boolean; dist: number; gy: number; pitch: number; joint: number;
    /** v9s.24：本帧实际生效的握持权重（1 = 握死，<1 = 够不到而虚握） */
    grip: number;
  };
  /**
   * v9s.24：武器相对手的自由度读数（腕部滞后角）。
   * 验收「剑不再焊在前臂延长线上」：快速挥击时 wristPitch 应明显非零并在收势时反向。
   */
  weaponDebug(): { wristPitch: number; wristTwist: number };
  /**
   * v9s.23：本帧挥击姿态读数（段号 / 段类型 / 躯干三轴 / 两肩位置）。
   * 供验收「段 1 从右到左、段 2 从左到右、段 3 举顶下劈」与「肩真的在动」。
   */
  swingDebug(): {
    seg: number;
    kind: string;
    /** v9s.28：本段的主挥手（双持段 2 是左手）。验收扫角必须按这只手取刃身。 */
    lead: 'R' | 'L';
    yaw: number;
    /** v9s.26：整体带转 / 整圈旋转 / 两者之和（= root.rotation.y） */
    rootYaw: number;
    spinYaw: number;
    rootTurn: number;
    pitch: number;
    roll: number;
    strike: number;
    /**
     * v9s.55：战斗姿态权重 0..1。剑身三通道（仰角 / 外撇 / 滚转）与整体带转都按它
     * 缩放，所以「过渡帧」量出来的刃身角度是混合值 —— 测稳态幅度要先按它筛帧。
     */
    poseW: number;
    /** v9s.29：刃面滚转（主/副）与刃身外撇（主/副），验收「刃口是否迎着挥击方向」 */
    bladeTwist: number;
    bladeTwistOff: number;
    bladeYaw: number;
    bladeYawOff: number;
    shoulderL: { x: number; y: number; z: number };
    shoulderR: { x: number; y: number; z: number };
  };
  /**
   * v9s.32：当前武器的持械待机姿态读数（权重 / 双臂偏移 / 躯干扭转 / 刀身仰角）。
   * 供 clip-lab 与自动化验收确认「换武器后上半身真的换了」。
   */
  stanceDebug(): {
    weapon: WeaponId;
    weight: number;
    armL: { pitch: number; yaw: number; roll: number; elbow: number };
    armR: { pitch: number; yaw: number; roll: number; elbow: number };
    torsoYaw: number;
    torsoPitch: number;
    bladePitchDeg: number;
    bladePitchOffDeg: number;
    armSwing: number;
  };
  /**
   * v9s.28：clip-lab 专用 —— 把剪辑时间轴固定到 t（0..1），绕过 `swingCurve(progress)`。
   * 传 null 恢复正常映射。正常游玩不会被调用。
   */
  setClipT(t: number | null): void;
  /** 下盘相对身体的连续偏航（v8b），供验收「引导/后退时跨朝向不跳变」。 */
  hipYaw(): number;  /** v9n：停步收相进度（-1 = 未接管）与本帧双腿姿态，供浏览器验收过渡是否平滑。
   *  v9o 追加 chestYaw / speed；v9q 追加 gaitSpeed（= velocity + 击退冲量，步态实际驱动）；
   *  v9r 追加 stopDip（骨盆惯性下沉量，验收「骨盆跟着沉、脚不跟着沉」）。 */
  /** v9s.33：动态平衡读数（COM / 捕获点 / 支撑余量 / 综合分）；未开启时为 null */
  balanceDebug(): (BalanceResult & { shift?: number; latDeficit?: number; lateralFf?: number }) | null;
  /** v9s.33：脊柱分段读数（腰 / 胸 / 颈）；未开启时为 null */
  spineDebug(): {
    enabled: boolean; waistYaw: number; chestYaw: number; totalYaw: number;
    totalPitch: number; totalLean: number; neckPitch: number; leak: number;
  } | null;
  /**
   * v9s.64：基础体态读数（root 局部坐标，单位 m）。
   *
   * 用来回答「这个姿势还站得住吗」——`reach` 是髋→脚的距离除以腿长，
   * 两骨 IK 的可达上限就是 1.0；超过 1 说明腿已经被拉直，脚必然离地。
   * `headY < hipY` 才是真的「头比屁股低」；`headY` 只是低了但 `headZ` 没变大，
   * 读起来会是「缩脖子」而不是「探头」。
   */
  postureDebug(): {
    enabled: boolean; pitch: number; waist: number;
    hipY: number; headY: number; headZ: number; footY: number;
    reachL: number; reachR: number; headLowY: number;
  } | null;
  /**
   * v9s.34：躯干**总角**（腰 + 胸）。
   * 脊柱分段后 `upper.rotation` 只剩腰段（42% 在 `chest`），需要总角一律走这里。
   */
  torsoTotal(): { yaw: number; pitch: number; lean: number };
  gaitDebug(): {
    stopT: number; hipYaw: number; chestYaw: number; speed: number; gaitSpeed: number;
    /** v9p：停步惯性脉冲的前脚前伸量（rad）/ 身体前移量（m）/ 骨盆下沉量（m），未接管时为 0 */
    stopStep: number; stopShift: number; stopDip: number;
    /** v9s：停步偏差淡出系数（1=未消化，0=已归零）/ 原地转身踏步脉冲强度 */
    stopYawFade: number; turnStep: number;
    legLPitch: number; legLRoll: number; legRPitch: number; legRRoll: number;
    /** v9s.33：腿部被真实步态接管的比例（0 = 攻击姿态，1 = 完全真实步态） */
    legTakeover: number;
    /**
     * v9s.42：本帧真正喂给 solveGait 的相位（rad，未归一化，可能超出 0..TAU）。
     * 手感面板用它画 sin 曲线 —— 读 Core 的 `gaitPhase` 不行：攻击时 Core 锁移速、
     * 相位冻住，而这一段腿其实由 `attackGaitDrive` 的等效驱动在走。
     */
    phase: number;
    /** v9s.43：本帧的换向驱动符号（−1..1）。稳态恒为 ±1；换向途中经过 0，
     *  前后摆幅按 |该值| 淡出（0.16s 走完）。验收「换向不抽腿」直接读它。 */
    dirF: number; dirR: number;
    /** v9s.44：本帧下盘偏转目标（rad，相对身体）。hipYaw 是它的指数平滑结果。 */
    hipYawTarget: number;
    /** v9s.45：转身闸门状态 0..1（1 = 身体在转、下盘目标冻结）。验收「慢放不抖」读它。 */
    spin: number;
    /** v9s.55：待机斜跨（权重 / 前脚是否左 / 下沉 / 重心侧移 / 下半身偏转） */
    idleW: number; idleFrontLeft: boolean; idleSink: number; idleShift: number;
    idleHipYaw: number;
  };
  /** 本帧 gait 速度投影用的世界朝向（= bodyYaw + hipYaw，即下盘实际朝向），
   *  供验收「腿摆动方向」：投影基准必须与腿所在坐标系一致，否则非正前方时方向被歪。 */
  gaitYaw(): number;
  /** 箭（局部 +Z）在世界空间的单位方向，用于验收「弓箭朝正前方」。 */
  arrowDirection(): { x: number; y: number; z: number };
  /**
   * v9s.22：当前武器「刃根 / 刃尖」的世界坐标，供挥击拖尾取样。
   * 无刃武器（弓）或未装备时返回 null。
   */
  weaponBlade(): {
    base: { x: number; y: number; z: number };
    tip: { x: number; y: number; z: number };
    /**
     * v9s.29：刀身**宽面法线**（世界方向，= 刀身局部 X，因为模型「薄在 X」）。
     *
     * 用来量化「刃口在切、还是拿刀身侧面拍」：横扫时刃尖速度方向与这条法线
     * 越接近垂直（点积≈0），说明刃口正对着运动方向。
     */
    normal: { x: number; y: number; z: number };
  } | null;
  /** 双持 / 剑盾：同时给出两只手的刃身（无刃或没模型的一侧为 null），供 clip 工具标注。 */
  bladesWorld(): {
    right: BladeGeom | null;
    left: BladeGeom | null;
  };
  dispose(): void;
};

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

const EPS = 1e-6;

type Limb = {
  root: THREE.Group;
  joint: THREE.Group;
  hand: THREE.Group;
  /**
   * v9s.24：腕关节（hand 与武器挂点之间的一层）。
   *
   * 之前 hand 直接挂 mount，武器相对手只有 mount 俯仰一个量 → 「剑 = 前臂延长线」。
   * 插这一层之后，肩 / 肘 / 腕三个串联自由度齐了，武器可以**滞后**于手。
   * 腿没有腕，直接复用 hand（永远 identity，零开销）。
   */
  wrist: THREE.Group;
  /** v9s.22：两段骨头的 mesh，供 squash & stretch 缩放 */
  upperMesh: THREE.Mesh;
  lowerMesh: THREE.Mesh;
  /** 单段骨长（m），缩放后 root/joint 的 position 由它推导 */
  segLen: number;
};
/** 腿额外带一个末端标记，供 IK 取世界锚点（小腿末端，不含鞋的视觉偏移）。 */
type Leg = Limb & { tip: THREE.Object3D; ankle: THREE.Group };

/** v9s.29：一条刃身的几何读数（供拖尾 / clip 工具 / 验收）。 */
export type BladeGeom = {
  base: { x: number; y: number; z: number };
  tip: { x: number; y: number; z: number };
  /** 宽面法线（世界） */
  normal: { x: number; y: number; z: number };
};

type WeaponParts = {
  right: THREE.Object3D;
  left: THREE.Object3D;
  orb?: THREE.Mesh;
  arrow?: THREE.Group;
  drawString?: THREE.Mesh;
};

import {
  makeArrow, makeBow, makeBox, makeGreatsword, makeShield, makeStaff, makeSword, group,
} from './rig-parts';


/**
 * 3 头身体素角色，纯层级方块（无蒙皮、无骨骼动画资源）。
 * 总高 = 3 × headSize = legLength + bodyHeight + headSize，与 Core 的 characterHeight 对齐。
 * 关节：hip → knee（膝）、shoulder → elbow（肘）；武器挂在 hand 下的 weaponMount 上。
 *
 * 朝向三段分离（程序动画）：
 *   root.rotation.y = bodyYaw      （由 three-scene 设置，身体平滑朝向）
 *   pelvis.position  = 髋部高度 + 重心 / 后坐 / 下沉 / 步态起伏（上下半身共享）
 *   lower.rotation.y = hipYaw      （下盘绕髋连续带转，可侧移 / 后退）
 *   upper            = 绕腰倾斜 / 侧倾 / 扭转 + 攻击旋身
 *   headPivot        = headYaw - bodyYaw - 旋身  （头先于身体转向目标）
 */
export function createVoxelRig(
  v: VoxelConfig,
  colors: ColorConfig,
  moveSpeed: number,
  ori: OrientationViewConfig,
  gaitCfg: GaitViewConfig,
  mountCfg: WeaponMountConfig,
  leanCfg: LeanViewConfig,
  hurtCfg: HurtViewConfig,
  animCfg: ProgramAnimViewConfig,
  /** v8g：足部 IK 配置。省略时默认关闭（旧 FK 姿态，供单测 A/B 对照），
   *  线上由 three-scene 传入 view.ik 开启。 */
  ikCfg?: IKViewConfig,
  /** v9a：派生招举盾前撞姿态参数。省略时用内置缺省值（单测不传也安全）。 */
  linkCfg?: LinkViewConfig,
  /** v9s.24：腕部滞后。省略时整层关闭 = 与 v9s.23 逐帧一致（单测 / A/B 用）。 */
  wristCfg?: WeaponWristViewConfig,
  /** v9s.33：动态平衡量化 / 自动配重。省略 = 关闭，读数恒为空（单测 A/B 用）。 */
  balanceCfg?: BalanceViewConfig,
): VoxelRig {
  const ikConfig: IKViewConfig = ikCfg ?? {
    enabled: false, weight: 0, attackScale: 1, maxCorrectionDeg: 70,
  };
  const wristView: WeaponWristViewConfig = wristCfg ?? {
    enabled: false, lag: 0.022, maxAngle: 0.62, rate: 26,
    twistLag: 0.018, maxTwist: 0.45, runDrag: 0,
  };
  const linkView: LinkViewConfig = linkCfg ?? {
    chargeColor: '#7fd4ff', ringRadius: 1.25, fxDuration: 0.42,
    leanDeg: 16, shieldPitchDeg: 42, pelvisReach: 0.12,
  };
  // v9s.22：老调用方（单测里手工构造的 config）可能没有 stretch 段，缺省为关闭，
  // 保证「不传 = 旧姿态逐字节一致」。
  const stretchCfg: StretchConfig = animCfg.stretch ?? {
    enabled: false, swingArm: 1, chargeArm: 1, runLeg: 1, torsoGain: 0,
    impactSquash: 0, impactDecay: 12, volumeExp: 0.5, smoothing: 26,
  };
  // v9s.23：老调用方（单测里手工构造的 config）没有 swing 段时整层关闭，
  // 精确回到 v9s.22 的「手臂在动、身体不动」姿态，便于 A/B 对照。
  const swingCfg: SwingPoseViewConfig = animCfg.swing ?? {
    enabled: false, bodyScale: 1, shoulderLift: 0.045, shoulderPush: 0.035,
    shoulderIn: 0.03, segBlend: 0.1,
    weaponScale: { greatsword: 1, 'sword-shield': 0.62, 'dual-swords': 0.55 },
  };
  // ---- v8f 合理骨架层级：共享骨盆 → 上 / 下半身分离 ----
  // 旧结构里 lower 与上半身组都直接挂在 root（原点 = 脚底），于是上半身 rotation.x 是
  // 「整个人绕脚底刚性倾倒」，腿完全不动 —— 用户反馈的「脚底锚定身体倾斜」。
  // 新结构把 pelvis 放在髋部高度（legLen），上下半身都是它的子节点：
  //   upper.rotation 绕腰（腰椎）→ 受击 / 前倾只动上半身，不再掀翻整个人
  //   lower.rotation  绕髋       → 下盘带转不把脚从地面甩出去
  //   pelvis.position            → 屁股后坐 / 重心偏离 / 下沉 / 步态起伏，上下半身自动联动
  // 所有子节点的 y 坐标都改成「相对骨盆」，因此净视觉位置与旧版完全一致，
  // three-scene 的翻滚枢轴（rollPivot）也不需要改。节点命名供测试按名查找，
  // 不再依赖脆弱的 children[0]/children[1] 下标。
  const root = group();
  const pelvis = group();
  pelvis.name = 'pelvis';
  pelvis.position.y = v.legLength;
  root.add(pelvis);
  const lower = group();   // 下半身：两腿
  lower.name = 'lower';
  const upper = group();  // 上半身：躯干 + 头 + 手臂（绕腰）
  upper.name = 'upper';
  pelvis.add(lower);
  pelvis.add(upper);

  const H = v.headSize;
  // v9s.52：造型特征（可选）。所有相关改动都乘一个「默认 1」的比例或走 `if (style)` 分支，
  // 保证不传 style 时几何 / 逐帧姿态与旧版逐字节一致（全部既有快照测试因此不用改）。
  const style = v.style;
  const headScale = style?.headScale && style.headScale > 0 ? style.headScale : 1;
  const HS = H * headScale;            // 视觉头边长（headScale = 1 时数值与 H 相同）
  const beardLen = Math.max(0, style?.beard ?? 0);
  const hunch = Math.max(0, style?.hunch ?? 0);
  /**
   * v9s.64 · 基础体态（可选）。与 hunch 同属「静态基准」，但可组合：
   * pitch（躯干总前倾）/ waist（拆分后再折腰）/ headLift / headReach / neckDrop /
   * pelvisLift / pelvisDrop / pelvisBack。叠加顺序见 `CharacterPosture` 注释。
   *
   * 鱼人不带 `style.posture` —— 它的体态来自 `MURLOC_POSTURE`（造型自带，
   * 因为和头 / 鳍 / 腿长是配套的），这样码头那三只杂兵也是同样的爬姿。
   */
  const posture = style?.posture ?? (style?.murloc ? MURLOC_POSTURE : undefined);
  const posturePitch = (posture?.pitch ?? 0);
  /** 腰部额外折角（拆分之后只加在腰段）—— 用来做「屁股高、背塌」的弧线。 */
  const postureWaist = (posture?.waist ?? 0);
  /**
   * 体态前倾的总预算（弧度）。超过它，头就会插进地面、手臂够不到身前的目标 ——
   * 实测 1.05（60°）时鱼人的吻部离地还有 4cm，再往上一步就穿地。
   */
  const POSTURE_MAX_TOTAL = posture?.maxTotal ?? 1.05;
  /** 本帧真正吃进躯干的体态角（预算夹过之后）；拆分后的腰折也按这个比例走。 */
  let postureAppliedPitch = 0;
  let postureAppliedWaist = 0;
  const kneeSink = Math.max(0, style?.kneeSink ?? 0);
  const breathOn = !!style?.breath;
  /**
   * v9s.63 · 鱼人造型。
   *
   * 只换「头 / 手 / 脚 / 背鳍 / 尾」五处几何，骨架层级、IK、步态、挥击、断肢、
   * 倒地物理**一行不改** —— 鱼人因此天生拥有全套动作与死亡表现。
   * 为 false 时所有分支都不进，几何与逐帧姿态与旧版逐字节一致（既有快照不用改）。
   */
  const murloc = !!style?.murloc;
  /** v9s.64 · 哨兵机：同样只换几何，骨架 / 动作 / 断肢全部复用。 */
  const sentinel = !!style?.sentinel;
  const legLen = v.legLength;
  const armLen = v.armLength;
  const t = v.limbThickness;
  const bodyH = v.bodyHeight;
  const bodyW = v.bodyWidth;
  // 躯干深度跟随宽度：默认 0.46 宽 → 系数 1（与旧版逐字节一致，不传 style 的体型几何不变）；
  // 更宽的体型同比例加厚，否则正面宽了、侧面还是一块薄板，反而更显扁。
  const torsoD = 0.28 * clamp(bodyW / 0.46, 1, 1.4);

  // ---- v9s.33 脊柱分段 ----
  // 开启时：upper 只承担「腰段」，新增 chest 节点承担「胸段」，肩 / 头挂在 chest 下。
  // 同一份躯干总角按权重拆到两段（见 update() 末尾的 splitSpine），世界朝向不变，
  // 但弯折点从腰移到胸腔 → 大幅挥击不再是「一根棍整体转」。
  // 关闭时 chest 保持单位变换、躯干仍是单块，逐帧与旧版一致。
  const spineCfg = animCfg.spine;
  const spineOn = !!spineCfg?.enabled;
  const chestPivotY = spineOn
    ? clamp(spineCfg!.chestPivot ?? 0.42, 0.15, 0.85) * bodyH
    : 0;
  const chest = group();
  chest.name = 'chest';
  chest.position.y = chestPivotY;
  upper.add(chest);
  const torsoRoot = spineOn ? chest : upper;

  let torso: THREE.Mesh;
  let chestMesh: THREE.Mesh | null = null;
  let abdomenH = bodyH;
  let chestH = 0;
  if (spineOn) {
    abdomenH = Math.max(0.05, chestPivotY);
    chestH = Math.max(0.05, bodyH - chestPivotY);
    torso = makeBox(bodyW, abdomenH, torsoD, colors.body);
    torso.name = 'torsoLower';
    torso.position.y = abdomenH / 2;
    upper.add(torso);
    // 胸块略宽 8mm：两块的侧面不共面，避免 z-fighting；读起来也像胸甲。
    chestMesh = makeBox(bodyW + 0.008, chestH, torsoD + 0.008, colors.body);
    chestMesh.name = 'torsoUpper';
    chestMesh.position.y = chestH / 2;
    chest.add(chestMesh);
  } else {
    torso = makeBox(bodyW, bodyH, torsoD, colors.body);
    torso.name = 'torso';
    torso.position.y = bodyH / 2;                 // 相对骨盆
    upper.add(torso);
  }

  // 头部独立枢轴：绕脖子旋转，实现「头先于身体转向目标方向」
  const headPivot = group();
  headPivot.name = 'headPivot';                    // 供测试按名查找（不依赖 children 下标）
  // v9s.18：先转头（yaw）再点头（pitch）—— 顺序反了的话，头转到侧面时
  // 俯仰会绕世界 X 轴，看起来像在歪头。
  headPivot.rotation.order = 'YXZ';
  // 头部枢轴 = 躯干高度（配置值按标准体型写的 0.4）。瘦高体型躯干只有 0.24，
  // 直接沿用会让头飘在躯干上方 16cm，所以按 bodyHeight 夹一下。
  //
  // v9s.65：鱼人的枢轴要再往上抬到**颅骨中心**。鱼人的头比身体还横，绕脖子转时
  // 整颗头像锤子一样甩出去 —— 待机盯人时读作「疯狂转头」。抬高的同时
  // `buildMurlocHead` 会把几何下移同样的量，净效果是「位置不变、旋转中心变了」。
  headPivot.position.y = Math.min(ori.headPivotHeight, bodyH) - chestPivotY;
  /** 颈根基准高度：posture.neckDrop 从这里往下压（每帧按绝对值写，不累加）。 */
  const headPivotBaseY = headPivot.position.y;
  torsoRoot.add(headPivot);

  /**
   * v9s.65 · 鱼人的 **yaw 节点**：转头绕颅骨中心，俯仰仍绕脖子。
   *
   * 为什么分两层：鱼人的头比身体还横，绕脖子做 yaw 时整颗头像锤子一样甩出去 ——
   * 待机盯人读作「疯狂转头」。但**俯仰不能一起搬家**：抬到颅中心后，同样的抬头角
   * 不再带来「头向后仰」的位移，脸会直接扎到地上（实测头低了 25cm、前伸 25cm）。
   *
   * 所以：外层 `headPivot` 继续管 pitch（绕脖子，位移语义不变），
   * 内层 `headYawNode` 管 yaw（绕颅中心，只有朝向变化、头不位移）。
   * 几何在 `buildMurlocHead` 里下移 `MURLOC_HEAD_SPIN`，与节点抬高抵消。
   */
  const headYawNode = murloc ? group() : null;
  const headYawTarget: THREE.Object3D = headYawNode ?? headPivot;
  if (headYawNode) {
    headYawNode.name = 'headYaw';
    headYawNode.position.y = MURLOC_HEAD_SPIN * HS;
    headPivot.add(headYawNode);
  }

  if (murloc) {
    // 鱼头：一整块方颅 + 两颗凸眼 + 横裂嘴 + 头冠鳍 + 鳃（`murloc-parts` 里全是比例值）
    buildMurlocHead(headYawTarget, HS, colors);
  } else if (sentinel) {
    // 机器头：方颅 + 护檐 + 单只灯眼 + 天线 + 后脑外露导线
    buildSentinelHead(headPivot, HS, colors);
  } else {
    const head = makeBox(HS, HS, HS, colors.head);
    head.position.y = HS / 2;
    headPivot.add(head);

    // 眼睛：贴在 +Z 面，跟随头部枢轴，用于验收「面朝向」是否正确
    const eyeMat = new THREE.MeshLambertMaterial({ color: '#1b2733' });
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(
        new THREE.BoxGeometry(0.06 * headScale, 0.07 * headScale, 0.02 * headScale), eyeMat,
      );
      eye.position.set(
        sx * 0.09 * headScale, (H / 2 + 0.03) * headScale, (H / 2 + 0.011) * headScale,
      );
      headPivot.add(eye);
    }
  }

  // ---- v9s.52 造型特征：地中海发型 / 长白胡子（盒数刻意压到 6 个） ----
  // 「抓特征」而不是「堆细节」：头顶一圈留白 + 两侧一片鬓角 = 一眼读出地中海；
  // 胡子只用 3 节锥形盒，靠物理摆动而不是分节数量传达「长」。
  const beardPivots: THREE.Object3D[] = [];
  let beardState: BeardState | null = null;
  /** v9s.54：避让计算复用的临时向量（每帧 2 次，不在热路径里 new） */
  const beardTmp = new THREE.Vector3();
  if (style?.balding) {
    const hairColor = style.hairColor ?? '#e8e8e8';
    // 头发面全是背光面（后脑 / 侧后），纯 Lambert 在暗场景里会读成「灰帽子」而不是白发，
    // 给一点自发光把明度托住 —— 白发在阴影里也是白的。
    const hairMat = new THREE.MeshLambertMaterial({
      color: hairColor, emissive: hairColor, emissiveIntensity: 0.55,
    });
    const addHair = (w: number, h: number, d: number, x: number, y: number, z: number): void => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), hairMat);
      m.position.set(x, y, z);
      headPivot.add(m);
    };
    // v9s.53：一个盒子「穿三面」替代原来的 4 片（两鬓 / 后脑 / 顶后半圈）。
    // 盒体比头略宽（左右各露 ~1cm）、后侧露 ~1cm、前面收在头内 —— 左、右、后三个面
    // 都有头发、正面和头顶留白 = 地中海；连成一体后拼接缝消失，还少 3 个 mesh。
    // 盒体比头略宽（左右各露 pad）、后侧也露 pad、前面收在头内 —— 左、右、后三个面
    // 都有头发、正面和头顶留白 = 地中海；连成一体后拼接缝消失，还少 3 个 mesh。
    // 深度/中心必须让后表面真的超出头的背面（旧版 4 片用 -(HS/2 + 0.004) 就是这原因），
    // 否则后脑整片被头挡住，只剩正面两条白边 —— 实测背面看是纯肤色。
    const pad = HS * 0.075;
    const hairCap = new THREE.Mesh(
      new THREE.BoxGeometry(HS + pad * 2, HS * 0.66, HS * 0.84 + pad), hairMat,
    );
    hairCap.name = 'hairCap';
    hairCap.position.set(0, HS * 0.47, -HS * 0.08 - pad / 2);
    headPivot.add(hairCap);
    // 白眉：两个薄片，比眼睛高一点、宽一点 —— 方块脸靠这一笔才有「老」
    for (const sx of [-1, 1]) {
      addHair(HS * 0.28, HS * 0.05, HS * 0.03, sx * HS * 0.20, HS * 0.655, HS / 2 + 0.006);
    }
  }
  // 驼背时头会前伸、抬头补偿，头底和肩线之间会裂一道缝 —— 补一小块「脖子」。
  // 只在 hunch > 0 时创建，默认体型盒子数不变。
  if (hunch > 0) {
    const neck = makeBox(HS * 0.46, HS * 0.30, HS * 0.46, colors.head);
    neck.position.set(0, -HS * 0.12, -HS * 0.04);
    headPivot.add(neck);
  }
  if (beardLen > 0) {
    const beardColor = style?.beardColor ?? '#f2f2f2';
    const beardMat = new THREE.MeshLambertMaterial({
      color: beardColor, emissive: beardColor, emissiveIntensity: 0.42,
    });
    const segLen = beardLen / 3;
    let parent: THREE.Object3D = headPivot;
    for (let i = 0; i < 3; i++) {
      const pivot = group();
      pivot.name = `beard${i}`;
      // 第 1 节挂在下巴（头底前缘）；后面每节挂在上一节末端。
      // z 不能只贴着脸：躯干半深 0.14，胡子若挂在 0.10 会整条埋进胸腔里（实测就是「看不见」）。
      pivot.position.set(0, i === 0 ? HS * 0.02 : -segLen, i === 0 ? Math.max(HS * 0.5, torsoD / 2 + 0.025) : 0);
      parent.add(pivot);
      const w = HS * [0.52, 0.42, 0.28][i];
      const seg = new THREE.Mesh(
        new THREE.BoxGeometry(w, segLen * 1.06, HS * (0.20 - i * 0.04)), beardMat,
      );
      seg.position.y = -segLen / 2;
      pivot.add(seg);
      beardPivots.push(pivot);
      parent = pivot;
    }
    beardState = createBeardState();
  }

  const makeLeg = (sx: number): Leg => {
    const hip = group();
    hip.name = sx < 0 ? 'hipL' : 'hipR';
    // v8g：IK 要求「先绕 Z 侧摆、再绕 X 俯仰」共面（R = Rz(roll)·Rx(pitch)）。
    // THREE 默认 XYZ 是 Rx·Rz，roll≠0 时两骨不共面、余弦定理无解析解；
    // 改成 ZYX 后 forwardKinematics / solveTwoBoneIK 与真实骨架逐项对应。
    hip.rotation.order = 'ZYX';
    hip.position.set(sx * (bodyW / 2 - t / 2), 0, 0); // 相对骨盆：髋骨在腰下原点
    lower.add(hip);

    const thigh = makeBox(t, legLen / 2, t, colors.limb);
    thigh.position.y = -legLen / 4;
    hip.add(thigh);

    const knee = group();
    knee.name = 'knee';
    knee.position.y = -legLen / 2;
    hip.add(knee);

    const shin = makeBox(t, legLen / 2, t, colors.limb);
    shin.position.y = -legLen / 4;
    knee.add(shin);

    // v9s.66：踝关节。脚掌几何挂在它下面，于是足部 IK 反解完髋 / 膝之后，
    // 可以把踝的朝向拧回 IK 之前（`lockModelRotation`）—— 否则脚掌跟着小腿转，
    // 读作「脚在地上打滑 / 脚腕被掰」。默认 identity，脚锁不介入时与旧版逐帧一致。
    const ankle = group();
    ankle.name = sx < 0 ? 'ankleL' : 'ankleR';
    ankle.position.y = -legLen / 2;
    knee.add(ankle);

    if (murloc) {
      // 蹼足：脚掌前后拉到 0.26m（人形是 t×1.7≈0.18），压在同一踝高上
      buildMurlocFoot(ankle, t, 0, colors);
    } else if (sentinel) {
      // 机械脚：扁底板 + 两片前爪（比人脚宽，读作「站不稳但站得住」）
      buildSentinelFoot(ankle, t * 3.4, colors, 0);
    } else {
      const shoe = makeBox(t * 1.15, 0.07, t * 1.7, colors.shoe);
      shoe.position.set(0, 0.035, 0.045); // 脚尖朝 +Z（相对踝点）
      ankle.add(shoe);
    }

    // IK 末端锚点：踝点本身（不含鞋的视觉偏移），FK / IK 才能精确互为逆运算。
    const tip = new THREE.Object3D();
    tip.name = 'footTip';
    ankle.add(tip);

    return {
      root: hip, joint: knee, hand: ankle, wrist: ankle, tip, ankle,
      upperMesh: thigh, lowerMesh: shin, segLen: legLen / 2,
    };
  };

  const makeArm = (sx: number): Limb => {
    const shoulder = group();
    shoulder.name = sx < 0 ? 'shoulderL' : 'shoulderR';
    // v9s.22 起用 ZYX（R = Rx·Ry·Rz）满足两骨 IK 的「roll 与 pitch 共面」假设。
    //
    // v9s.28 改成 YXZ（R = Ry·Rx·Rz）：**yaw = 0 时两者数学上完全等价**（都退化成
    // Rx·Rz），pitch / roll 的既有调校逐帧不变；区别只在 yaw ≠ 0 时——
    //   ZYX 先绕竖直轴转一根竖直向下的手臂 = 绕自身长轴自转（视觉上等于 roll），
    //   所以 armYaw 一直是个「假通道」，实测 −1.4 → 0 只让刃身水平朝向变 25°。
    //   YXZ 则是「自转 → 抬臂 → 最后水平摆」，yaw 才真正是肩的水平内收 / 外展。
    // 这是双持两把剑「向两侧展开」的必要条件。
    // 副作用：双手 IK 的目标点必须先把 yaw 逆旋转掉，见 applySecondaryGrip 的 probeAt。
    shoulder.rotation.order = 'YXZ';
    // 相对父节点：不开启脊柱分段时父节点就是 upper（y 相对骨盆）；
    // 开启后父节点是 chest（枢轴在 chestPivotY），要减掉这段高度。
    shoulder.position.set(sx * (bodyW / 2 + t / 2), bodyH - 0.04 - chestPivotY, 0);
    torsoRoot.add(shoulder);

    const upperArm = makeBox(t, armLen / 2, t, colors.limb);
    upperArm.position.y = -armLen / 4;
    shoulder.add(upperArm);

    const elbow = group();
    elbow.name = 'elbow';
    elbow.position.y = -armLen / 2;
    shoulder.add(elbow);

    const fore = makeBox(t, armLen / 2, t, colors.limb);
    fore.position.y = -armLen / 4;
    elbow.add(fore);

    const hand = group();
    hand.name = sx < 0 ? 'handL' : 'handR';
    hand.position.y = -armLen / 2;
    elbow.add(hand);

    if (murloc) {
      // 蹼掌：宽掌 + 三指 + 指间薄蹼；挂点与 palm 相同，握持 IK 的靶点不变
      buildMurlocHand(hand, t, colors);
    } else if (sentinel) {
      // 夹钳：两片斜板 + 腕块，开口朝体外侧
      buildSentinelHand(hand, t * 4.2, colors, sx < 0 ? -1 : 1);
    } else {
      const palm = makeBox(t * 1.1, 0.09, t * 1.1, colors.head);
      palm.position.y = 0.045;
      hand.add(palm);
    }

    // v9s.24：腕关节。默认 identity，所以「不给它写值」= 与旧版逐帧一致；
    // 只有 applyWrist 会在攻击 / 快速摆臂时给它一个滞后角。
    const wrist = group();
    wrist.name = sx < 0 ? 'wristL' : 'wristR';
    hand.add(wrist);

    return {
      root: shoulder, joint: elbow, hand, wrist,
      upperMesh: upperArm, lowerMesh: fore, segLen: armLen / 2,
    };
  };

  const legL = makeLeg(-1);
  const legR = makeLeg(1);
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // ---- v9s.53 肩甲：一块方块把「肩宽 + 细臂」的接头补实 ----
  // 体素风格里手臂是一根细棍插在山墙上，肩线单薄；加一块略大于臂的方块，轮廓立刻变厚。
  // 挂在胸段而不是 shoulder 关节上：挂关节会跟着抬臂翻起来，反而暴露「肩块是手臂的一部分」。
  if (style?.spaulder) {
    for (const sx of [-1, 1]) {
      const sp = makeBox(t * 1.2, t * 1.1, bodyW * 0.40, colors.body);
      sp.name = sx < 0 ? 'spaulderL' : 'spaulderR';
      sp.position.set(sx * (bodyW / 2 + t * 0.4), bodyH - 0.05 - chestPivotY, 0);
      torsoRoot.add(sp);
    }
  }

  // ---- v9s.63 鱼人的「非人类」两件：背鳍 + 短尾 ----
  if (sentinel) {
    // 胸甲板 + 警示条 + 背包排气管 + 腰侧液压杆，全部挂在胸段（与背鳍同一套 baseY）
    buildSentinelTorso(torsoRoot, bodyW, bodyH, torsoD, bodyH - chestPivotY);
  }
  if (murloc) {
    // 背鳍挂 `torsoRoot`（开脊柱分段时就是 chest）并与肩共用 baseY：
    // 挂 `upper` 的话大幅挥击时背鳍不跟着胸段弯折，会在背上浮起来。
    buildMurlocDorsalFin(torsoRoot, bodyH, torsoD, bodyH - chestPivotY);
    buildMurlocShoulderFin(torsoRoot, bodyW, bodyH, bodyH - chestPivotY);
    buildMurlocBelly(torsoRoot, bodyW, torsoD, bodyH, bodyH - chestPivotY);
    // 短尾挂 `pelvis`：跟着屁股走。挂 `lower` 会被腿的转体甩到一侧。
    buildMurlocTail(pelvis, HS, torsoD);
  }

  // v8g：两骨 IK 的腿描述（大腿 / 小腿各 legLen/2，膝向后折）。
  // footTip 是本帧 FK 末端；rig-ik 直接用它取世界锚点，玩家与假人共用同一套解算。
  const ikLimbs: IKLimb[] = [legL, legR].map((leg) => ({
    root: leg.root,
    joint: leg.joint,
    tip: leg.tip,
    ankle: leg.ankle,
    upperLen: legLen / 2,
    lowerLen: legLen / 2,
    bend: 1 as const,
  }));

  // 握持挂点：给武器一个基础姿态，让它从前臂「斜向前伸出」而不是贴着手臂竖直朝上
  const mountR = group();
  const mountL = group();
  mountR.name = 'mountR';
  mountL.name = 'mountL';
  // v9s.29：刃面滚转节点（夹在挂点与武器之间，绕刀身长轴）。
  // 放在挂点**下面**是关键：挂点只负责俯仰 / 外撇，滚转不参与刀尖指向，
  // 于是「刃口朝哪」和「刀尖指哪」彻底解耦，数据可以分别调。
  const gripR = group();
  const gripL = group();
  gripR.name = 'gripR';
  gripL.name = 'gripL';
  armR.wrist.add(mountR);
  armL.wrist.add(mountL);
  mountR.add(gripR);
  mountL.add(gripL);

  // ---- 五套体素武器，全部挂在握持挂点上 ----
  const staffModel = makeStaff(colors);
  const bowModel = makeBow(colors);
  const arrowModel = makeArrow(colors);

  const parts: Record<WeaponId, WeaponParts> = {
    'sword-shield': { right: makeSword(0.42, 0.075, colors), left: makeShield(colors) },
    'dual-swords': { right: makeSword(0.42, 0.075, colors), left: makeSword(0.42, 0.075, colors) },
    greatsword: { right: makeGreatsword(colors), left: makeBox(0.12, 0.2, 0.12, colors.wood) },
    staff: { right: staffModel.g, left: group(), orb: staffModel.orb },
    bow: { right: arrowModel, left: bowModel.g, arrow: arrowModel, drawString: bowModel.drawString },
  };

  for (const id of Object.keys(parts) as WeaponId[]) {
    gripR.add(parts[id].right);
    gripL.add(parts[id].left);
    parts[id].right.visible = false;
    parts[id].left.visible = false;
  }

  /**
   * v9s.22：在武器上打两个「刃根 / 刃尖」标记，供表现层的挥击拖尾取样。
   *
   * 为什么不用固定长度常量去算：武器内部有护手、柄、球头等分段，
   * 各武器长度差 2 倍以上；把标记挂在武器 Group 上，取世界坐标时自动带上
   * 手部姿态、mount 俯仰、攻击旋身和 v9s.22 的手臂形变，零额外推导。
   */
  function markBlade(g: THREE.Object3D, baseY: number, tipY: number): void {
    const b = new THREE.Object3D();
    b.name = 'bladeBase';
    b.position.y = baseY;
    g.add(b);
    const t = new THREE.Object3D();
    t.name = 'bladeTip';
    t.position.y = tipY;
    g.add(t);
  }
  // 刃根只取「靠近刀尖的一小段」：整条刀身都参与的话，拖尾会变成一根
  // 和刀一样长的白棍（实测 0.69 m 宽），读不出「划过的轨迹」。
  markBlade(parts['sword-shield'].right, 0.44, 0.55);
  markBlade(parts['dual-swords'].right, 0.44, 0.55);
  markBlade(parts['dual-swords'].left, 0.44, 0.55);
  markBlade(parts.greatsword.right, 0.74, 0.88);
  markBlade(parts.staff.right, 0.78, 0.92);

  let currentWeapon: WeaponId | null = null;

  // v9s.32：持械待机姿态。换武器时从 0 淡入，避免手臂瞬间跳到新基准；
  // 其余时间恒为 1。姿态永远只叠加在「非攻击」基准上，攻击由挥击剪辑整体覆盖。
  let stanceWeapon: WeaponId | null = null;
  let stanceWeight = 1;
  let stancePitch = 0;
  let stancePitchOff = 0;
  let stanceCfgNow: StanceViewConfig | null = null;

  // 移动惯性倾斜：纯表现层本地状态，不进入 Core / 快照。
  // 由速度差分得到加速度在身体前方的投影（启动前倾 / 刹车后仰），
  // 由朝向角速度 × 速度得到绕圈离心侧倾，二者都做指数平滑，帧率无关。
  let prevVx = 0;
  let prevVz = 0;
  let prevBodyYaw = 0;
  let leanForward = 0;
  let leanSide = 0;
  /** 大剑移动拖地：剑尖贴近地面的额外俯角，平滑趋近目标（纯表现，不进 Core） */
  let dragAngle = 0;
  /** v8f：本帧分层受击姿态（诊断读数，不进 Core / 快照） */
  let lastHurtPose: HurtPose = emptyHurtPose();
  /** v8g：本帧足部 IK 诊断（不进 Core / 快照） */
  let lastIK: IKDiagnostics = { ...EMPTY_IK_DIAGNOSTICS };
  /** v8g：移动下沉量的平滑状态（纯表现，帧率无关） */
  let crouchSmooth = 0;
  /**
   * 下盘（骨盆）朝移动方向的连续偏航（v8b）：由身体局部侧向速度驱动、指数平滑。
   * 刻意不用 wrapAngle(moveYaw - bodyYaw) —— 那个角度差在 ±π 处会从 +π 翻到 -π，
   * 引导飞弹（身体朝瞄准、移动方向任意）时就会造成下盘「跨朝向跳变」。
   */
  let hipYaw = 0;
  /** 本帧 gait 投影基准（诊断用，等于 bodyYaw + hipYaw），随 update 刷新 */
  let lastGaitYaw = 0;
  /** v9s.44：本帧下盘偏转的**目标值**（诊断用）。hipYaw 是它的指数平滑结果，
   *  目标本身若在几十毫秒内扫过上百毫秒，观感就是「下盘整体晃一下」。 */
  let lastHipYawTarget = 0;
  /** v9s.45：转身闸门的一阶状态（0..1）。不再直接拿瞬时角速度当权重 ——
   *  那个量在转身尾部掉得很快，「半开」的几帧足以让目标蹿出去十几度。 */
  let spinBlend = 0;
  /** v9s.45：上一帧的 Core 时间，用来把身体角速度换算到**游戏时间**。
   *  慢放 0.25× 时用渲染帧 dt 算，角速度只有常速的 1/4，闸门会半开（抖动根因）。 */
  let prevCoreTime = -1;

  // ---- v9n 停步收相状态（纯表现层，不进 Core / 快照）----
  /** <0 = 未接管；0..1 = 收相进度；=1 后保持输出待机，直到重新起跑 */
  let stopT = -1;
  let stopPhase0 = 0;
  let stopPhaseEnd = 0;
  let stopSpeed0 = 0;
  let stopStride0 = 0;
  let stopFwd = 0;
  let stopRight = 0;
  /** v9q：停步瞬间锁定的**世界**移动方向（单位向量），供惯性按骨盆局部轴投影。
   *  不能用 gait 的 localForward/Right —— 那是 lower(bodyYaw+hipYaw) 局部，写进
   *  pelvis 会差一个 hipYaw；也不能每帧重取 velocity（收相尾段速度趋零、方向会漂）。 */
  let stopDirWX = 0;
  let stopDirWZ = 1;
  /** v9o：上一帧速度，用于区分「减速停步」与「低速巡航」（后者不该收相） */
  let prevSpeed = 0;
  /** v9o：本帧胸 / 上半身相对身体的偏航（诊断读数，不进 Core / 快照） */
  let chestYaw = 0;

  // ---- v9p：停步惯性 / 攻击相位基准（全部纯表现，不进 Core / 快照）----
  /** 本段攻击跨步的起始相位（v9s.41：连段时接上一段停下的相位，不再每段重置） */
  let attackPhaseBase = 0;
  /** 上一帧实际输出的攻击相位：换段 / 换次攻击时用它接续，保证腿不跳 */
  let attackPhasePrev = 0;
  /** 是否已经有过一次攻击（第一刀没有「上一段」可接，对齐真实步态相位） */
  let attackPhaseSeen = false;
  /** 单调步序：每次起手 / 每段连击 +1。奇偶决定这一刀哪条腿领先。
   *  不能用 comboIndex —— 3 连击后它回到 1，第 3 段与下一轮第 1 段同奇偶。 */
  let attackStepIndex = 0;
  /** 已处理的 Core attackId，用于识别「新的一段」（连击取消窗口提前接续也算新段） */
  let lastAttackId = -1;
  /** v9s.41：跨步偏移量的平滑值（前 / 侧 / 下沉）。段间靠它连续，段内包络不变。 */
  let stepZ = 0;
  let stepX = 0;
  let stepDip = 0;
  let wasAttacking = false;
  /** 本帧停步惯性脉冲：前脚额外前伸量 / 身体前移量 / 骨盆下沉量（诊断用） */
  let lastStopStep = 0;
  let lastStopShift = 0;
  let lastStopDip = 0;
  /** v9q：本帧步态实际驱动速度（velocity + 击退冲量），供验收「被击退时下盘是否跟着动」 */
  let lastGaitSpeed = 0;

  // ---- v9s：停步下盘偏差消化窗口（全部纯表现层状态，不进 Core / 快照）----
  //  'none'    正常移动，偏转目标系数 = 1
  //  'blend'   进入过收相，正在把系数平滑压到 0
  //  'settled' 已归零；保持 0 直到重新加速，防止 latRatio（方向比值）把偏转拉回来
  let stopYawPhase: 'none' | 'blend' | 'settled' = 'none';
  let stopYawDrain = 0;           // afterStop 模式：收相结束后的消化进度
  let lastStopYawFade = 1;        // 本帧实际采用的系数（诊断用）
  // 停步门控在本段之后才算完，淡出用上一帧的缓存状态（一帧延迟，指数平滑下无可见差）
  let lastInStop = false;
  let lastStopT = -1;
  let lastGateResume = false;
  let lastSpeed = 0;
  let lastPrevSpeed = 0;
  /**
   * v9s.54：胡子驱动用的上一帧读数（仅带胡子造型时有意义）。
   * 存的是**角色局部**的前 / 右速度分量和朝向角 —— 世界速度投影到局部，
   * 转身时纵向分量不会因为「人转了个方向」凭空产生一次假加速。
   */
  let lastBeardF = 0;
  let lastBeardR = 0;
  let lastBeardYaw = 0;
  /** v9s.54：呼吸相位（秒），只累加 dt，不读墙钟 —— 确定性快照才稳。 */
  let breathT = 0;
  /** v9s：本帧原地转身踏步脉冲强度（诊断用） */
  let lastTurnStep = 0;

  // ---- v9s.55 · 待机斜跨站姿（纯表现层状态，不进 Core / 快照）----
  /** 斜跨参数（配置缺省 = null，整层关闭，几何逐字节回到旧待机） */
  const idleCfg = idleStanceConfig(gaitCfg);
  /** 前脚是不是左腿：停步那帧按「最后踩出去的那只脚」锁定，之后保持不变 */
  let idleFrontLeft = true;
  /** 本帧斜跨权重 0..1（按速度平滑） */
  let idleStanceW = 0;
  /** 斜跨的独立计时器（秒）：驱动站立微摆，暂停时随 dt 冻结 */
  let idleT = 0;
  /** 本帧斜跨带来的骨盆下沉 / 重心侧移（在 IK 基准之后叠加，脚不跟着动） */
  let idleSink = 0;
  let idleShift = 0;
  /** 本帧斜跨的下半身偏转（rad，叠在 hipYaw 上；站定时才非零） */
  let idleHipYaw = 0;

  // ---- v9s.22 squash & stretch 状态（纯表现，不进 Core / 快照）----
  /** 本帧输出的形变量（诊断用） */
  let lastStretch: StretchPose = { ...NEUTRAL_STRETCH };
  /** 命中 / 砍到底的冲击脉冲 0..1，指数衰减 */
  let impactPulse = 0;
  /** 上一帧挥击曲线值，用于检测「从高位回落」这个拐点 */
  let prevSwingVal = 0;
  /** v9s.22：副手握持诊断读数 */
  let lastGrip = {
    active: false, dist: 0, gy: 0, pitch: 0, joint: 0, grip: 1,
  };
  /** v9s.24：副握点沿柄的当前位置（NaN = 未初始化，下次握持从默认点起步） */
  let gripSlide = NaN;
  /**
   * v9s.24：腕部滞后状态。
   *
   * 为什么用「角速度差分 + 一阶平滑」而不是弹簧：弹簧是二阶系统，固定步长才稳定，
   * 而这里 dt 会被暂停单步、时间缩放、掉帧改来改去。一阶指数平滑对任意 dt 都收敛，
   * 且「滞后量」本身就是一阶低通的物理直觉（腕部阻尼大、跟手慢）。
   */
  let wristPitch = 0;
  let wristTwist = 0;
  /** 本帧速度比（速度 / 移动速度上限），供腕部跑动拖拽用 */
  let wristSpeedRatio = 0;
  let prevArmPitch = NaN;
  let prevTorsoYaw = NaN;
  /** 上一帧的连击段号（变化即代表「换姿势」而不是「挥击」） */
  let prevSeg = -1;

  // ---- v9s.23 挥击身体 / 肩部状态（纯表现，不进 Core / 快照）----
  /** 上一帧解出的挥击姿态：段切换时作为插值起点，消掉「上段收势 → 下段起手」的单帧跳变 */
  let swingPose: SwingPose | null = null;
  /** 段切换瞬间冻结的起点姿态 */
  let swingFrom: SwingPose | null = null;
  let swingSeg = 0;
  /** 段间过渡进度 0..1 */
  let swingFade = 1;
  /** v9s.31：本次换段冻结的混合时长（秒）—— 按两段姿态差自动算，不逐帧重算 */
  let swingSpan = 0.1;
  /**
   * v9s.28：clip-lab 专用的「直接指定剪辑时间轴 0..1」覆盖。
   *
   * 正常游戏里剪辑 t 由 `swingCurve(attackProgress)` 映射（蓄势 → 挥出 → 保持 → 收势），
   * 工具若也把 attackProgress 当 t 用，就会在 t=0.5 时实际采样到 t=1 那一帧 —— 改关键帧
   * 看着没反应。设置本值后 solveSwingFor 直接用它当 t，工具调动作才和真实链路同一语义。
   * 只由 `__harness.clipLab` 写入，正常游玩恒为 null。
   */
  let clipLabT: number | null = null;
  /** 本帧实际采用的肩部位移（诊断用） */
  let lastShoulder = { lx: 0, ly: 0, lz: 0, rx: 0, ry: 0, rz: 0 };
  /** 本帧挥击层要求的剑身仰角（null = 用武器默认挂点） */
  let swingBladePitch: number | null = null;
  /** v9s.26：本帧副手武器挂点仰角（null = 用副手默认挂点） */
  let swingBladePitchOff: number | null = null;
  /** v9s.29：本帧刃面滚转 / 刃身外撇（主手与副手各一份；null = 回默认，刃面朝侧面、不外撇） */
  let swingBladeTwist: number | null = null;
  let swingBladeTwistOff: number | null = null;
  let swingBladeYaw: number | null = null;
  let swingBladeYawOff: number | null = null;
  /** 本帧主挥手：决定按哪条手臂链反解挂点 */
  let swingLead: 'R' | 'L' = 'R';
  /** 本帧整体转体（rootYaw + spinYaw），供 swingDebug 读 */
  let lastRootTurn = 0;

  // ---- v8c 程序动画分层状态（全部纯表现，不进入 Core / 快照）----
  /** 攻击姿态混合系数 0..1：指数平滑进出攻击，避免下盘姿态单帧跳变 */
  let attackBlend = 0;
  /**
   * v9s.29 · 战斗姿态进出权重 0..1（交叉淡入淡出）。
   *
   * attackBlend 只驱动「下盘 / 跨步」的淡入淡出；上半身与手臂一直是硬切 ——
   * 待机 → 起手、收招 → 待机都是单帧换姿势（用户反馈的「直接跳帧」）。
   * 这里另起一个权重，作用在**上半身骨架**上：每帧先把「不打这一击会是什么姿态」
   * 记下来（= 步态算出来的待机姿态），写完战斗姿态后按权重混合回去。
   */
  let combatPoseW = 0;
  /** 本帧「挥击跨步写腿」的权重 = lowerBodyWeight × attackBlend；默认 0 = 完全过滤 */
  let attackLegWeight = 0;
  /** 本帧步态对下盘的权重（诊断用） */
  let lastGaitScale = 1;
  /**
   * v9s.33：本帧「真实步态接管腿部」的平滑权重 0..1。
   * 攻击期间玩家仍能移动（30% 移速），但腿停在攻击跨步姿态 → 脚被 IK 钉住、
   * 身体平移，读作下盘滑行。按速度淡入真实步态即可，见 update() 里的说明。
   */
  let legTakeoverSm = 0;
  /** v9s.33：本帧平衡读数（null = 未开启 / 无骨架） */
  let lastBalance: BalanceResult | null = null;
  /**
   * v9s.33：自动重心偏移（米，身体局部 X）。一帧延迟的反馈回路：
   * 本帧末尾量出质心偏向哪边，下一帧把骨盆往回收一点。
   *
   * 为什么不是「加大另一侧手臂配重」：实测手臂外展 40° 只能把质心拉回 ~2mm
   * （臂 5kg / 体重 70kg，力臂 0.42m），几乎量不出来；而骨盆带着整个上半身
   * 平移 1cm 就是实打实的 1cm 质心位移。真人被推时也是先「撤胯 / 压重心」，
   * 手臂只是跟着甩 —— 这里按物理上真正有效的那一层来做。
   */
  let balanceShift = 0;
  let lastLatDeficit = 0;
  let balanceBodyX = NaN;
  let balanceBodyZ = NaN;
  /** 本帧喂给 solveGait 的四个等效驱动量（诊断用） */
  let lastDrive: GaitDrive = { speed: 0, phase: 0, localForward: 0, localRight: 0 };
  /**
   * v9s.43：前后 / 左右摆腿的**驱动符号**（−1..1，线性，未做形状映射）。
   * 硬符号在速度穿过 0 时会一帧取反 = 整条腿位镜像（实测单帧腿角跳 1.2 rad）；
   * 这里按 `gaitCfg.dirFlipSec` 逐帧推进，交给 `solveGait` 用 smoothstep 收放摆幅。
   * 初值取 +1：出生时站在待机姿态，第一帧即使方向相反也只是多淡 0.16s，无跳变。
   */
  let dirDriveF = 1;
  let dirDriveR = 1;
  /** v9n：本帧实际写入双腿的姿态（诊断用） */
  let lastLegs = { lp: 0, lr: 0, rp: 0, rr: 0 };
  /** 不传 coreTime 时（单测）使用的本地时间累加器 */
  let localTime = 0;
  /** 本帧使用的 Core 时间（诊断 remaining 用） */
  let lastNow = 0;
  let prevGrounded = true;
  let prevVy = 0;
  let pulseKind: 'none' | 'land' | 'jump' = 'none';
  let pulseStart = 0;
  let pulseDuration = 0;
  let pulseStrength = 0;
  let pulseCompress = 0.3;
  let lastImpactVy = 0;

  /**
   * 按武器设置握持挂点的 pitch（剑从 +Y 转向 +Z 前方）。
   *
   * v9s.30：**不再在挂点上写 yaw**。欧拉 XYZ 序下 rz 先把长轴从 Y 轴偏出去，
   * 仰角变成 `asin(cos(z)·cos(θ))` —— 上限只有 90° − z，大剑举顶要 92.8° 时
   * 永远差一截（实测 78°）。外张改由 grip 的 `swordCantDeg` 承担（那是刀身自己的
   * 坐标系，只把刀尖推向体侧，不参与仰角），于是 `mount.rotation.x` 单轴即可
   * 覆盖 −90°~+90° 以外的全部角度。
   */
  function applyMountPose(w: WeaponId): void {
    const d = Math.PI / 180;
    const m = mountCfg;
    let rp = 0;
    let rz = 0;
    let lp = 0;
    let lz = 0;
    if (w === 'sword-shield') {
      rp = m.swordPitchDeg * d;
      lp = m.shieldPitchDeg * d;
    } else if (w === 'dual-swords') {
      rp = m.swordPitchDeg * d;
      lp = m.swordPitchDeg * d;
    } else if (w === 'greatsword') {
      rp = m.greatswordPitchDeg * d;
      // 左手握柄沿剑身方向（与右手同 pitch），双手持握时左手套在下段柄上
      lp = m.greatswordPitchDeg * d;
    } else if (w === 'staff') {
      rp = m.staffPitchDeg * d;
    } else {
      lp = m.bowPitchDeg * d;
    }
    mountR.rotation.set(rp, 0, rz);
    mountL.rotation.set(lp, 0, lz);
    // v9s.22：双手武器把武器本体往身体中线挪一点。
    // 方块人肩距 0.6、单臂只有 0.42，武器挂在体外侧时副手永远够不到；
    // 内收 9cm 后副手 IK 才可能真正握到柄上（而不是停在臂展处指着刀柄）。
    mountR.position.x = w === 'greatsword'
      ? -Math.max(0, mountCfg.twoHandInsetX ?? 0)
      : 0;
  }

  function setWeapon(w: WeaponId): void {
    if (w === currentWeapon) return;
    currentWeapon = w;
    for (const id of Object.keys(parts) as WeaponId[]) {
      parts[id].right.visible = id === w;
      parts[id].left.visible = id === w;
    }
    applyMountPose(w);
    // 换武器时复位所有一次性姿态
    bowModel.drawString.position.z = -0.06;
    arrowModel.position.z = 0;
    staffModel.orb.scale.setScalar(1);
    upper.rotation.y = 0;
  }
  setWeapon('sword-shield');

  // 受击闪色：一次性收集全部 Lambert 材质引用，避免每帧遍历场景图
  const flashMats: THREE.MeshLambertMaterial[] = [];
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshLambertMaterial) {
      flashMats.push(obj.material);
    }
  });
  const hurtColor = new THREE.Color(hurtCfg.flashColor);

  /**
   * v8f 分层受击：把 solveHurtPose 解出的「一层一个量」写到对应骨骼节点。
   *
   *  - 上半身（upper）：绕腰倾斜 / 侧倾 / 肩部扭转 + 相对骨盆朝受击方向偏移 → 幅度最大
   *  - 骨盆（pelvis）：屁股向后（局部 -Z）+ 整体下沉 + 沿受击方向的小幅重心偏离
   *  - 下盘（lower）：相对骨盆反向补偿，让脚大体留原地；两腿屈膝 + 髋前倾吸收冲击
   *  - 手臂：打腹收拢护住 / 打肩被甩开
   *
   * 「整体重心偏离幅度小于身体反应」由 pose.comShift << pose.upperShift 保证，
   * 两者都随受击力度线性增长。进度全部由 Core 的 hurt.timer / duration 派生，
   * 无本地时间累积，暂停 / 时间缩放下也与逻辑同步。
   */
  function applyHurt(h: HurtState, bodyYaw: number): void {
    const pose = solveHurtPose(h, bodyYaw, hurtCfg);
    lastHurtPose = pose;

    // 上半身：绕腰倾斜（骨架重构后天然绕腰，不再绕脚底掀翻整个人）
    upper.rotation.x += pose.upperPitch;
    upper.rotation.z += pose.upperRoll;
    upper.rotation.y += pose.upperYaw;
    // v8g：旧版 shift=0.26/0.34 在 knock（大剑重击）时把整个上半身平移约 0.28m，
    // 躯干下沿直接离开骨盆 —— 用户反馈「大剑重击时身体会离开腿」。
    // 诊断量 pose.upperShift 保持原值（比例语义不变），只在写节点时缩放 + 单轴限幅，
    // 让身体反应仍以「绕腰倾斜」为主、位移为辅，躯干始终连在骨盆上。
    const s = clamp(Number.isFinite(hurtCfg.upperShiftScale) ? hurtCfg.upperShiftScale : 1, 0, 1);
    const m = Number.isFinite(hurtCfg.maxUpperShift)
      ? Math.max(0, hurtCfg.maxUpperShift) : Number.POSITIVE_INFINITY;
    upper.position.x += clamp(pose.upperShiftX * s, -m, m);
    upper.position.z += clamp(pose.upperShiftZ * s, -m, m);

    // 骨盆：整体重心小幅偏离 + 屁股向后 + 下沉（上下半身由层级自动联动）
    pelvis.position.x += pose.comX;
    pelvis.position.z += pose.comZ - pose.pelvisBack;
    pelvis.position.y -= pose.drop;

    // 下盘反向补偿：屁股后坐 / 下沉时脚少跟一点，避免被拖着走。
    // legacy 对照路径下 lowerScale 视为 0 → 脚完全不动，精确复现旧版「腿钉死」。
    const ls = pose.legacy ? 0 : clamp(hurtCfg.lowerScale, 0, 1);
    lower.position.z += pose.pelvisBack * (1 - ls);
    lower.position.y += pose.drop * (1 - ls);

    // 腿屈膝 + 髋前倾吸收冲击；legacy 时这些量恒 0
    legL.joint.rotation.x += pose.knee;
    legR.joint.rotation.x += pose.knee;
    legL.root.rotation.x -= pose.hip;
    legR.root.rotation.x -= pose.hip;
    armL.root.rotation.x += pose.arm;
    armR.root.rotation.x += pose.arm * 0.8;

    for (const m of flashMats) m.emissive.copy(hurtColor).multiplyScalar(pose.flash);
  }

  /**
   * 挥击曲线：蓄势(-1) → 挥出(+1) → 收势(0)。
   *
   * v9s.23：断点从 0.3 / 0.62 提前到 0.22 / 0.50，让「挥出」对齐 Core 的 active 段。
   * 旧断点下 active 结束时（大剑 progress ≈ 0.49）swing 才走到 0.16 —— 判定已经结算、
   * 剑还在半路，真正挥到位发生在 recovery（既无位移也无判定），读起来就是「挥了个寂寞」。
   * 现在 active 末 swing ≈ 0.9，命中那一帧手臂、躯干、刀光基本同时到位。
   */
  /**
   * v9s.55 · 本帧的「剪辑时间轴」0..1（0 = 蓄势满，1 = 挥出满）。
   *
   * 用阶段与阶段内进度决定，而不是从 attackProgress 反推：`attackProgress` 把
   * windup / active / recovery 三段按**时长**压成 0..1，而剪辑的关键帧是**动作弧线**
   * 上的位置，两者不是一条线性关系（剑盾 windup 只有 0.09s，占整段 20%，却要独享
   * 蓄势帧）。按阶段取才能让「蓄势 → 挥出 → 保持」与 Core 的判定节奏严格对齐。
   */
  function posePhaseU(combat: CombatState): number {
    const t = combat.timings;
    const total = t.windup + t.active + t.recovery;
    // 夹具 / clip-lab 只写 phase + attackProgress（timings 全 0）时退回旧的刻度曲线，
    // 否则「progress 0.45 = 已挥出满」这类基于绝对刻度的读数会全部失准。
    if (!(total > 1e-4)) return clamp((swingCurve(combat.attackProgress) + 1) / 2, 0, 1);
    // 直接由 attackProgress 换算成「动作本体已走过的时间」，再按阶段切分。
    // 不用 phaseTimer 是因为它只在 Core 的推进里同步，夹具 / clip-lab 只写
    // attackProgress 时两者会脱节 —— 姿态采样必须只依赖一个真实来源。
    const elapsed = clamp(combat.attackProgress, 0, 1) * total;
    if (elapsed <= t.windup) return 0;                       // 蓄势帧
    const inActive = elapsed - t.windup;
    // 挥出在 active 的前 70% 完成、后 30% 保持满幅：`cancelWindow`（默认 progress 0.45）
    // 允许玩家在最晚这一刻接下一段，此时剑必须已经挥到位，否则换段就是「抡到一半改道」。
    // 这也是旧 `swingCurve` 的观感（0.42 走满），只是现在由阶段时间表达、不再靠魔数刻度。
    if (inActive < t.active) return clamp(inActive / Math.max(t.active * 0.7, 1e-4), 0, 1);
    return 1;                                                 // recovery / settle：保持挥出满
  }

  function swingCurve(t: number): number {
    if (t < 0.22) return -1;
    // v9s.28：挥出从 0.22~0.50 提前到 0.22~0.42。
    // 原因是 `cancelWindow`（默认 0.45）早于旧的挥出完成点 0.50 —— 玩家连打时
    // 剑才走到 64% 就被切到下一段，衔接处实测跳 85~117°。提前 8% 之后，
    // 「最早可取消那一刻」动作已经到位，换段靠 0.08s 的 segBlend 就能平顺过去；
    // 同时挥出占比从 28% 压到 20%，打击更短促（符合「慢-快-慢」里的快）。
    if (t < 0.42) return -1 + ((t - 0.22) / 0.2) * 2;
    if (t < 0.5) return 1;
    return Math.max(0, 1 - (t - 0.5) / 0.5);
  }

  /**
   * v9s.22：把 squash & stretch 姿态写进骨骼。
   *
   * 关键点不是 scale 本身，而是**子关节的 position 必须同步放大** ——
   * 只缩放 mesh 会让前臂 / 手掌留在原来的位置上，手臂从肘部断开。
   * 这里统一按 `segLen × along` 重算 joint / hand / footTip 的局部 y，
   * 于是「骨长变化」在整条链上自洽，武器挂点也跟着手自然前移。
   */
  function applyStretchPose(s: StretchPose): void {
    for (const arm of [armL, armR]) {
      arm.upperMesh.scale.set(s.girthArm, s.arm, s.girthArm);
      arm.upperMesh.position.y = (-arm.segLen / 2) * s.arm;
      arm.joint.position.y = -arm.segLen * s.arm;
      arm.lowerMesh.scale.set(s.girthArm, s.arm, s.girthArm);
      arm.lowerMesh.position.y = (-arm.segLen / 2) * s.arm;
      arm.hand.position.y = -arm.segLen * s.arm;
    }
    for (const leg of [legL, legR]) {
      leg.upperMesh.scale.set(s.girthLeg, s.leg, s.girthLeg);
      leg.upperMesh.position.y = (-leg.segLen / 2) * s.leg;
      leg.joint.position.y = -leg.segLen * s.leg;
      leg.lowerMesh.scale.set(s.girthLeg, s.leg, s.girthLeg);
      leg.lowerMesh.position.y = (-leg.segLen / 2) * s.leg;
      // v9s.66：脚踝（= IK 的 footTip 所在处）跟着骨长走；tip 本身固定挂在踝原点上，
      // 再动它就会与脚锁打架（实测误差正好等于腿长一半）。
      leg.ankle.position.y = -leg.segLen * s.leg;
    }
    // v9s.33：躯干可能是「腰块 + 胸块」两块，各自按自己的基准高度缩放，
    // 叠放顺序不能错（胸块要跟着腰块一起抬）。
    torso.scale.set(s.girthTorso, s.torso, s.girthTorso);
    torso.position.y = (abdomenH / 2) * s.torso;
    if (chestMesh) {
      chestMesh.scale.set(s.girthTorso, s.torso, s.girthTorso);
      chestMesh.position.y = (chestH / 2) * s.torso;
      chest.position.y = abdomenH * s.torso;
    }
  }

  /**
   * v9s.22：副手握持 —— 左臂两骨 IK 到武器柄上的副握点。
   *
   * 旧版大剑的「双手持握」只是给左臂写死两个角度（`rotation.x = both + 0.06`、
   * `rotation.z = 0.38`），左手和剑柄之间没有任何几何关系，所以永远握不住：
   * 实测左肩到柄上副握点 0.7 m，而单臂只有 0.42 m —— 差了一倍还多。
   *
   * 现在反过来解：先取柄上副握点的**世界坐标**，转进上半身局部空间，
   * 再用两骨 IK 反解左肩 / 左肘角度。够不到时按 `twoHandMaxStretch` 把骨长
   * 按需拉长（体积守恒收细），而不是硬钳制 —— 手会真的贴在柄上。
   *
   * `root` 需要先刷新世界矩阵（调用方负责），否则读到的是上一帧的柄位置。
   */
  function applySecondaryGrip(weight: number, dt: number): void {
    const gripY = mountCfg.twoHandGripY ?? -0.16;
    const maxStretch = Math.max(1, mountCfg.twoHandMaxStretch ?? 1.25);
    const maxReach = armLen * maxStretch * 0.99;
    const sx = armL.root.position.x;
    const sy = armL.root.position.y;
    const sz = armL.root.position.z;

    /**
     * 「握点滑动」：副握点在柄上是可滑动的。
     *
     * 举剑过顶（windup）时主手离身体很远，固定副握点会超出副手臂展 ——
     * 手就悬在空气里。这里沿柄轴把目标按 0.45 的比例一步步向主手收，
     * 收到可达为止：左手虽然握得偏上，但**始终在柄上**。
     * 这是「双手够不到」和「拉面条」之间的折中，也是真实动画里常用的做法。
     */
    /**
     * 取柄上 gy 处的点，换算成「相对左肩」的向量与距离（局部空间）。
     *
     * v9s.28：shoulder 改成 YXZ 后，`armL.root.rotation.y` 是**最后**应用的水平摆，
     * 而 solveTwoBoneIK 只解 pitch / roll、并假设方位角从「正前方」起算。目标向量
     * 必须先绕 Y 逆旋转 −yaw 转到「未摆臂」的坐标系里，解出的角度再经 yaw 转回去，
     * 手才真的落在柄上。yaw = 0 时逆旋转是恒等变换，旧数据零影响。
     */
    const yawComp = armL.root.rotation.y;
    const cy = Math.cos(yawComp);
    const sy2 = Math.sin(yawComp);
    const probeAt = (gy: number): { t: { x: number; y: number; z: number }; dist: number } => {
      const world = mountR.localToWorld(new THREE.Vector3(0, gy, 0));
      // v9s.33：肩挂在 chest 下（脊柱分段）时，目标向量必须换算到 chest 局部空间；
      // 用 upper 会把胸段的额外旋转算错，导致副手离柄 0.39m。
      const local = (spineOn ? chest : upper).worldToLocal(world);
      const dx = local.x - sx;
      const dy = local.y - sy;
      const dz = local.z - sz;
      // 绕 Y 转 −yaw：(x, z) → (x·cos − z·sin, x·sin + z·cos)
      const t = { x: dx * cy - dz * sy2, y: dy, z: dx * sy2 + dz * cy };
      return { t, dist: Math.hypot(t.x, t.y, t.z) };
    };

    // 1) 求「需要滑到哪」：从默认副握点沿柄往主手方向滑，直到可达。
    //    v9s.24：每步乘 0.78（旧版 0.45）—— 旧版一次就跳掉 55% 的柄长，握点会在两帧
    //    之间从刀镡直接跳到柄尾，肉眼可见「左手瞬移」。
    let gy = gripY;
    let probe = probeAt(gy);
    if (!Number.isFinite(probe.dist) || probe.dist <= EPS) return;
    for (let k = 0; k < 18 && probe.dist > maxReach; k++) {
      gy *= 0.78;
      probe = probeAt(gy);
      if (!Number.isFinite(probe.dist) || probe.dist <= EPS) return;
    }

    // 2) 握点是实体：沿柄滑动有惯性，不能一帧从柄尾瞬移到护手。
    //    平滑之后若仍明显够不到（说明目标本身在移动，追不上），直接跟到位 ——
    //    否则手会永远悬在半路，那比瞬移更难看。
    if (!Number.isFinite(gripSlide)) gripSlide = gy;
    const slideRate = Math.max(0, mountCfg.twoHandSlideRate ?? 9);
    gripSlide += (gy - gripSlide) * (1 - Math.exp(-slideRate * dt));
    // 不做「追不上就直接跳到位」的兜底：平滑值滞后于目标时，手确实会短暂够不到，
    // 但那正是「虚握」—— solveTwoBoneIK 会把手臂解成伸直指向柄，手停在臂展末端。
    // 兜底反而会在手臂到达最高点的那一帧把握点从柄中段瞬移到柄顶，比虚握难看得多。
    const resolved = probeAt(gripSlide);
    const t = resolved.t;
    const dist = resolved.dist;
    const reach = dist / Math.max(EPS, armLen);
    const stretch = clamp(reach, 1, maxStretch);
    /**
     * v9s.24：握持权重随臂展比衰减 —— 「够不到就虚握」。
     *
     * 旧版要么把胳膊拉到 maxStretch 倍（细面条），要么手悬在空中（没握住），二选一。
     * 真实动作里副手在过顶那一瞬本来就松，只是手还搭在柄附近。这里用臂展比做
     * 一段平滑过渡：1.0 倍以内握死，到 maxStretch 时松到 twoHandMinGrip。
     * 松手不改变 IK 目标点，只是降低「把手臂拽过去」的权重 —— 于是手停在
     * 手臂自然姿态指向柄的位置，读起来是「虚握」，而不是「脱手」。
     */
    const gripStart = Math.max(1, mountCfg.twoHandGripStart ?? 1.02);
    const gripEnd = Math.max(gripStart + 1e-3, maxStretch);
    const minGrip = clamp(mountCfg.twoHandMinGrip ?? 1, 0, 1);
    const soft = clamp((reach - gripStart) / (gripEnd - gripStart), 0, 1);
    const gripW = 1 - soft * soft * (3 - 2 * soft) * (1 - minGrip);
    const seg = (armLen / 2) * stretch;
    // 肘向前折（bend = -1）：与手臂沿 -Y 伸出的骨架约定一致。
    const sol = solveTwoBoneIK(t, seg, seg, -1);
    const angles = blendIKAngles(
      {
        rootPitch: armL.root.rotation.x,
        rootRoll: armL.root.rotation.z,
        jointPitch: armL.joint.rotation.x,
      },
      sol,
      clamp(weight * gripW, 0, 1),
      // v9s.23：旧版给 0.55 rad 的「单次修正上限」，本意是防止 IK 突然把手臂拽走；
      // 但举剑过顶（段 3 起手）时左臂初值在头顶、目标在柄下段，差角远超 31°，
      // 被截断后手就停在离柄轴 0.49m 的空中 —— 实测「举顶时副手没握住」。
      // IK 目标本身是连续的（柄随右手平滑移动），不需要这层限幅，改成不截断。
      Math.PI,
    );
    armL.root.rotation.x = angles.rootPitch;
    armL.root.rotation.z = angles.rootRoll;
    // 留一点肘弯：IK 在可达范围内会把手肘解到「完全伸直」（jointPitch ≈ 0），
    // 视觉上像把胳膊锁死；夹到 -0.06 rad（约 3.4°）读起来仍是「握住」。
    armL.joint.rotation.x = Math.min(angles.jointPitch, -0.06);
    // 骨长按 IK 需要拉伸；覆盖 stretch 层对本臂的写入（本臂此刻由 IK 独占）
    const g = 1 / Math.sqrt(stretch);
    armL.upperMesh.scale.set(g, stretch, g);
    armL.upperMesh.position.y = (-seg) / 2;
    armL.joint.position.y = -seg;
    armL.lowerMesh.scale.set(g, stretch, g);
    armL.lowerMesh.position.y = (-seg) / 2;
    armL.hand.position.y = -seg;
    lastGrip = {
      active: true, dist, gy: gripSlide, pitch: angles.rootPitch, joint: armL.joint.rotation.x, grip: gripW,
    };
  }

  /**
   * v9s.24 · 腕部滞后：把「武器相对手」的自由度解出来，写在 hand 与 mount 之间的
   * wrist 节点上。这一层是「武器像焊在手上」的直接解药 —— 之前武器只有 mountPitch
   * 一个角度、且是整段线性插值，手臂怎么动剑就怎么动，没有惯性可言。
   *
   * 两个输入都来自本帧已经写好的姿态，只做差分，不引入新的时间源：
   *  - 手臂俯仰角速度 → 绕 X 的滞后（挥出时剑落后，收势时甩回来）
   *  - 躯干扭转角速度 → 绕 Z 的横向甩动（腰胯带剑时剑尖「跟不上」的那一下）
   *
   * 符号说明：手臂 rotation.x 增大 = 向下 / 向前挥，此时剑受惯性留在后面，
   * 所以腕角取**负**。躯干向右拧（upper.rotation.y 增大）时剑甩向左侧，取正。
   */
  function applyWrist(dt: number, seg: number): void {
    if (!wristView.enabled) {
      wristPitch = 0;
      wristTwist = 0;
      armR.wrist.rotation.set(0, 0, 0);
      prevArmPitch = armR.root.rotation.x;
      prevTorsoYaw = torsoYaw();
      return;
    }
    const pitch = armR.root.rotation.x;
    const yaw = torsoYaw();
    /**
     * 换段那一帧必须重新对齐基准：`attackProgress` 从 1 跳回 0，手臂角度是**瞬变**的，
     * 拿它差分会得到几十 rad/s 的假角速度，腕部会「啪」地甩一下（实测单帧 10°）。
     * 那不是挥击，是换姿势 —— 直接丢掉这一帧的差分，腕角保持不变。
     */
    if (seg !== prevSeg) {
      prevSeg = seg;
      prevArmPitch = pitch;
      prevTorsoYaw = yaw;
      armR.wrist.rotation.set(wristPitch, 0, wristTwist);
      return;
    }
    // 首帧 / 暂停（dt=0）只做基准对齐：没有时间差就没有角速度，
    // 强行除会得到 Infinity 并把手腕拧成 NaN。
    if (!Number.isFinite(prevArmPitch) || dt <= 1e-5) {
      prevArmPitch = pitch;
      prevTorsoYaw = yaw;
      armR.wrist.rotation.set(wristPitch, 0, wristTwist);
      return;
    }
    const pitchVel = (pitch - prevArmPitch) / dt;
    const yawVel = wrapAngle(yaw - prevTorsoYaw) / dt;
    prevArmPitch = pitch;
    prevTorsoYaw = yaw;

    const limA = Math.max(0, wristView.maxAngle);
    const limT = Math.max(0, wristView.maxTwist);
    /**
     * 权重随攻击混合系数缩放 —— 这是物理上正确的，不是偷懒。
     *
     * 人拿着重物走路时手腕是**主动锁定**的（握力 + 前臂肌群），几乎不甩；
     * 只有快速挥击、且手臂在主动发力时才会有明显的「剑落后于手」。
     * 不缩放的话，走路摆臂 6.9 rad/s 会解出 15° 的滞后，读起来像「手腕脱臼」。
     *
     * 留 0.15 的底：跑步时剑仍有一点跟随感，不至于完全刚性地钉在手上。
     */
    const gate = 0.15 + 0.85 * clamp(attackBlend, 0, 1);
    // v9s.24：跑动拖拽不参与 gate —— 它专治「非攻击时剑焊死」：拿重物跑，剑会自然落后。
    const spd = clamp(wristSpeedRatio, 0, 1.4);
    const dragRun = -spd * Math.max(0, wristView.runDrag);
    const wantPitch = clamp(-pitchVel * wristView.lag * gate + dragRun, -limA, limA);
    const wantTwist = clamp(yawVel * wristView.twistLag * gate, -limT, limT);
    const k = 1 - Math.exp(-Math.max(0, wristView.rate) * dt);
    wristPitch += (wantPitch - wristPitch) * k;
    wristTwist += (wantTwist - wristTwist) * k;
    armR.wrist.rotation.set(wristPitch, 0, wristTwist);
  }

  /** 主手默认挂点俯仰（与 applyMountPose 的 rp 保持一致）。 */
  function mountBasePitch(w: WeaponId): number {    const d = Math.PI / 180;
    if (w === 'greatsword') return mountCfg.greatswordPitchDeg * d;
    if (w === 'staff') return mountCfg.staffPitchDeg * d;
    if (w === 'bow') return mountCfg.bowPitchDeg * d;
    return mountCfg.swordPitchDeg * d;
  }

  /** 副手默认挂点俯仰（与 applyMountPose 的 lp 保持一致）：盾是 8°，双剑 68°，大剑 58°。 */
  function mountOffBasePitch(w: WeaponId): number {
    const d = Math.PI / 180;
    if (w === 'sword-shield') return mountCfg.shieldPitchDeg * d;
    if (w === 'greatsword') return mountCfg.greatswordPitchDeg * d;
    if (w === 'bow') return mountCfg.bowPitchDeg * d;
    return mountCfg.swordPitchDeg * d;
  }

  /**
   * v9s.29 · 握刀外撇角（rad，+ = 刀尖偏向角色右侧）。
   *
   * 「刀和小臂完全平行」是纯几何：刀身俯仰被反解到世界水平，而挥击时手臂也几乎水平，
   * 两者共线 → 读起来像手臂加长了一截。真实握刀手腕会外撇 10~20°，刀与小臂成夹角，
   * 既更像「握着」也更容易读出刀身朝向。这里给一个**常量外撇**（各武器可调），
   * 与数据里的 `bladeYaw`（随动作变化的部分）相加。
   */
  function mountCant(w: WeaponId): number {
    const d = Math.PI / 180;
    if (w === 'sword-shield') return (mountCfg.swordCantDeg ?? 0) * d;
    if (w === 'dual-swords') return (mountCfg.swordCantDeg ?? 0) * d;
    if (w === 'greatsword') return (mountCfg.greatswordCantDeg ?? 0) * d;
    return 0;
  }

  /**
   * v9s.25 · 剑身仰角 → 挂点角。
   *
   * 这是「剑尖朝上」这个 bug 的正解：作者在数据里写的是**世界仰角**（0 = 水平），
   * 而骨架看到的是「挂点相对前臂转了多少」。两者差着整条手臂链的俯仰：
   *
   * ```text
   * 仰角 = π/2 − (躯干 + 肩 + 肘 + 腕 + 挂点)
   * ⇒ 挂点 = π/2 − 仰角 − (躯干 + 肩 + 肘 + 腕)
   * ```
   *
   * 旧的 58° 常量只在「手臂自然下垂」时读起来正常；手臂抬到 −80° 时，
   * 剑身只剩 12° 的倾斜，实际几乎竖直 —— 前两段横扫看起来像举着剑站着。
   *
   * 必须放在腕部之后：腕部的滞后角也在这条链上，早一步算会把滞后吃掉一半。
   * 躯干俯仰用 2.1 记下的快照（姿态层刚写完、惯性 / 受击还没叠），
   * 这样受击后仰、跑动前倾仍然会让剑自然跟着身体走。
   */
  function applyBladeTarget(combat: CombatState, torsoPitch: number): void {
    const w = combat.weapon;
    if (w === 'staff' || w === 'bow') return;
    const leadR = swingLead === 'R';
    const arm = leadR ? armR : armL;
    const mount = leadR ? mountR : mountL;
    const offArm = leadR ? armL : armR;
    const offMount = leadR ? mountL : mountR;
    const drag = w === 'greatsword' && leadR ? dragAngle : 0;
    // 默认外张（与 applyMountPose 的 rotation.z 同号：右手 −、左手 +）
    const yawDeg = w === 'greatsword' ? mountCfg.greatswordYawDeg : mountCfg.swordYawDeg;
    const dDeg = Math.PI / 180;
    const baseYawR = -yawDeg * dDeg;
    const baseYawL = yawDeg * dDeg;

    // 外张角度的上限：XYZ 序下 rz 先把长轴从 Y 轴偏出去，仰角变成
    // `asin(cos(z)·cos(θ))` —— 上限只有 90° − |z|。大剑举顶要 92.8°，带 16° 外张
    // 就永远差一截（实测 78°）。这里按当前仰角**收缩**外张：横扫（e≈0）时用满，
    // 越接近竖直收得越小，举顶时正好归零，于是单轴俯仰就能覆盖全程。
    // 收缩只影响「刀尖偏体侧多少」，不影响挥击平面，横扫段逐帧不变。
    const zClamp = (zBase: number, e: number): number => {
      const cap = Math.max(0, Math.PI / 2 - Math.abs(e));
      return Math.sign(zBase) * Math.min(Math.abs(zBase), cap);
    };

    // ---- v9s.55：剑身三通道也要跟着 combatPoseW 淡 ----
    // 手臂 / 躯干 / 骨盆由 blendCombatPose 按权重混合，剑身这几条却是直接写绝对值：
    // 收招时权重已经掉到 0.05，剑还停在剪辑末帧的仰角上，等 w 归零那一帧一步跳回
    // 待机基准 —— 实测剑盾单帧剑身跳 62°、整体带转 20°。这是「结束 Pose 接不上待机」
    // 的最后一处，也是唯一不在姿态交叉淡出覆盖范围内的一处。
    const wBlend = clamp(combatPoseW, 0, 1);

    // ---- 主手 ----
    // v9s.32：非攻击帧叠加该武器的持械仰角（例如大剑待机时剑尖压得更低），
    // 攻击帧仍以挥击剪辑的 bladePitch 为准，偏移自然让位。
    const baseE = mountBasePitch(w) + stancePitch + drag;
    const e = swingBladePitch === null
      ? baseE
      : baseE + (swingBladePitch + drag - baseE) * wBlend;
    // 刻意**不**把腕角算进补偿链：腕滞后是「剑比手慢半拍」的那一层，
    // 抵消掉它就等于把 v9s24 的白做了（实测剑尖相对手只差 1cm）。这里只抵消
    // 躯干 + 肩 + 肘，让剑停在目标仰角附近，再叠加腕部的甩动。
    const chain = torsoPitch + arm.root.rotation.x + arm.joint.rotation.x;
    mount.rotation.set(Math.PI / 2 - e - chain, 0, zClamp(leadR ? baseYawR : baseYawL, e));

    // ---- 副手（v9s.26）----
    // 每帧都写：镜头没给 bladePitchOff 时写回默认挂点，收招后不会残留上一击的翻腕。
    // 反解基准按武器几何区分：剑是「长轴 +Y」→ 基准 π/2（0 = 剑水平）；
    // 盾是「法线 +Z」的平板 → 基准 = 默认挂点角（0 = 盾面正对前方），
    // 于是盾猛顶时数据只要写 0，盾面就始终保持朝前，不管左臂前顶到哪个角度。
    const eoRaw = swingBladePitchOff;
    const eoBase = mountOffBasePitch(w) + (w === 'sword-shield' ? 0 : stancePitchOff);
    const eo = eoRaw === null ? null : eoBase + (eoRaw - eoBase) * wBlend;
    const offChain = torsoPitch + offArm.root.rotation.x + offArm.joint.rotation.x;
    if (w === 'sword-shield') {
      // 盾没有「世界仰角」语义：没数据时就让盾跟着小臂走（不补偿手臂链），
      // 有数据时反解成「盾面朝前」。两条路径的输出端做混合，w=0 与旧行为逐字节相同。
      const outBase = mountOffBasePitch(w);
      offMount.rotation.x = eoRaw === null
        ? outBase
        : outBase - (eoRaw + offChain) * wBlend;
    } else {
      offMount.rotation.set(
        Math.PI / 2 - (eo ?? 0) - offChain, 0,
        zClamp(leadR ? baseYawL : baseYawR, eo ?? 0),
      );
    }

    // ---- v9s.29：刃身外撇 + 刃面滚转 ----
    // 两个量都写在 grip（挂点的子节点 = 刀身自己的坐标系）上，而不是挂点：
    //   grip.z = 外撇：刀尖在「手的前方平面」里向体侧张开 → 与小臂形成夹角；
    //   grip.y = 滚转：绕刀身长轴把刃口转到挥击方向。
    // 挂点的 Y 轴是**小臂方向**（手臂前平举时它不朝上），在挂点上写 yaw 会变成
    // 绕小臂转，刀尖在锥面上打转（实测让横扫段仰角多塌 4°）；放在 grip 上才是
    // 「相对手的固定夹角」，不随手臂姿态漂移。
    const cant = mountCant(w);
    // 基准是 0（待机不撇不滚），所以按权重直接缩放即可；w=1 时与旧值完全相同。
    const yawMain = (swingBladeYaw ?? 0) * wBlend;
    const yawOff = (swingBladeYawOff ?? 0) * wBlend;
    const twMain = (swingBladeTwist ?? 0) * wBlend;
    const twOff = (swingBladeTwistOff ?? 0) * wBlend;
    // 符号：grip 的 +Z 旋转把刀尖推向 −X（角色左侧），所以右手（+X 侧）外撇取负，
    // 左手取正。写反的话两把刀会向中线内收，双持反而更「合」。
    if (leadR) {
      gripR.rotation.z = -cant + yawMain;
      gripR.rotation.y = twMain;
      gripL.rotation.z = cant + yawOff;
      gripL.rotation.y = twOff;
    } else {
      gripL.rotation.z = cant + yawMain;
      gripL.rotation.y = twMain;
      gripR.rotation.z = -cant + yawOff;
      gripR.rotation.y = twOff;
    }
  }

  /**
   * v9s.23：把解出的挥击姿态写进骨骼。
   *
   * 只写「绝对量」的节点（手臂三轴 + 肘）与「叠加量」的节点（躯干 / 骨盆），
   * 因为 update() 已在开头把 upper.rotation.x/z、pelvis.position 归零，
   * 而 2.6 / 2.8 的惯性、落地缓冲、跨步层都在本函数之后才 +=，可以安全叠上去。
   */
  function writeSwingPose(p: SwingPose): void {
    swingBladePitch = p.bladePitch;
    swingBladePitchOff = p.bladePitchOff;
    swingBladeTwist = p.bladeTwist;
    swingBladeTwistOff = p.bladeTwistOff;
    swingBladeYaw = p.bladeYaw;
    swingBladeYawOff = p.bladeYawOff;
    swingLead = p.lead;
    // v9s.26 整体转体：写在 rig 的 root.rotation.y 上（three-scene 设的是外层
    // playerRoot，两者叠加，不冲突）。rootYaw 是随挥击曲线摆的带转，spinYaw 是
    // 按攻击进度单调推的整圈；两者直接相加，收招时 spinYaw=2π≡0、rootYaw=0，
    // root 自动回正，不需要额外的归零过渡。
    //
    // v9s.55：带转同样按 combatPoseW 缩放。update() 每帧把 root.rotation.y 归零，
    // 收招淡出期间权重已经很低、带转却还是满值，w 归零那帧直接抹掉 0.35 rad（20°）
    // —— 与剑身仰角是同一个毛病。spin 不缩放：它是整圈，末帧 2π≡0，缩放反而会让
    // 角色「倒着转回来」。
    lastRootTurn = p.rootYaw * clamp(combatPoseW, 0, 1) + p.spinYaw;
    root.rotation.y = lastRootTurn;
    upper.rotation.y += p.yaw;
    upper.rotation.x += p.pitch;
    upper.rotation.z += p.roll;
    pelvis.position.z += p.pelvisZ;
    pelvis.position.x += p.pelvisX;
    if (p.armR) {
      armR.root.rotation.x = p.armR.pitch;
      armR.root.rotation.y = p.armR.yaw;
      armR.root.rotation.z = p.armR.roll;
      armR.joint.rotation.x = p.armR.elbow;
    }
    if (p.armL) {
      armL.root.rotation.x = p.armL.pitch;
      armL.root.rotation.y = p.armL.yaw;
      armL.root.rotation.z = p.armL.roll;
      armL.joint.rotation.x = p.armL.elbow;
    }
  }

  /**
   * v9s.23：解出本帧姿态，并在**段切换**处做一次短过渡。
   *
   * 连击换段时 `attackProgress` 从 1 直接跳回 0，上一段的收势姿态与本段起手
   * （尤其段 2 起手在左侧、段 3 起手举顶）差得很远，不插值就是「啪」地换姿势。
   * 这里只在 comboIndex 变化的那一帧冻结起点，用 `segBlend` 秒数平滑过去；
   * 段内的挥出速度完全不受影响（不引入逐帧平滑，否则会吃掉冲击力）。
   */
  function solveSwingFor(combat: CombatState, dt: number): SwingPose {
    // v9s.55：姿态采样改成「按阶段推进的剪辑时间轴」，不再走 `swingCurve`。
    //
    // 旧链路是 swing ∈ [−1, 1] 过 `(swing+1)/2` 映射到剪辑 t，于是：
    //   · 起手 t<0.22 恒为 −1（u=0，蓄势）—— 正确，但只有 0.1s 的 poseIn 去接；
    //   · **收势** swing 从 +1 掉到 0 ⇒ u 从 1 回到 **0.5**，停在「挥到中途」那一帧
    //     （手臂还举着、身体已转回正前），再淡出到待机 —— 这是「结束 Pose 接不上」
    //     的直接原因；settle 阶段还把这个半挥姿态定格了整整 0.16s。
    // 现在按阶段取 u：蓄势段恒 0、挥出段随 active 进度 0→1、收招段恒 1。收势
    // 交给 `combatPoseW` 的交叉淡出（待机 ↔ 挥出满），时长跟 recovery 走。
    // clip-lab 的 `setClipT` 语义同步修正为「剪辑时间轴 0..1」（见 app.ts clipLab.preview）。
    const u = clipLabT !== null ? clamp(clipLabT, 0, 1) : posePhaseU(combat);
    const target = solveSwingPose(
      combat.weapon, combat.comboIndex, u * 2 - 1, swingCfg,
      combat.attackProgress,
    );
    if (combat.comboIndex !== swingSeg) {
      swingFrom = swingPose;
      swingFade = 0;
      swingSeg = combat.comboIndex;
      // v9s.31：混合时长按「两段姿态差 / 目标角速度」算一次并冻结 ——
      // 快刀（差小）更短不发黏，重击（差大）更长不硬切；段级 blend 可覆写。
      // 上限用「本段总时长 × 22%」而不是固定值：双剑整段只有 0.35s，
      // 混合拖到 0.14s 就把挥击本身吃掉了。
      const segDur = combat.timings.windup + combat.timings.active + combat.timings.recovery;
      const budget = Math.max(swingCfg.segBlendMin ?? 0.03, segDur * 0.22);
      swingSpan = autoSegBlend(swingFrom, target, swingCfg, target.blend ?? null, budget);
    }
    const span = Math.max(0.008, swingSpan);
    swingFade = Math.min(1, swingFade + dt / span);
    const pose = swingFrom && swingFade < 1
      ? blendSwingPose(swingFrom, target, segEase(swingFade))
      : target;
    swingPose = pose;
    return pose;
  }

  /**
   * v9s.23：肩部（上臂根部）位移 —— 「肩膀在动」的来源。
   *
   * 旧版 shoulder.position 是常量，手臂抬到头顶时肩点仍钉在躯干侧面上沿，
   * 读起来像「胳膊装在支架上」。真实人体抬手时肩胛会耸起、前送，挥击时
   * 同侧肩还会跟着躯干拧出去。这里用**手臂当前的俯仰角**反推三件事：
   *   - 抬得越高 → 肩越往上（lift，最大 shoulderLift）
   *   - 抬到身前 → 肩越往前（push，最大 shoulderPush）
   *   - 双手武器挥击 → 两肩一起向中线内收（让副手够得到柄）
   *
   * 位移始终在 2~4cm 量级：体素方块人的躯干只有 0.4m 高，再大就穿帮。
   * 每帧无条件写（关闭时写回基准），不依赖是否攻击 —— 走路摆臂也会带一点。
   */
  function applyShoulderPose(attacking: boolean, weapon: WeaponId): void {
    const baseX = bodyW / 2 + t / 2;
    // 肩点相对**父节点**：脊柱分段后父节点是 chest（枢轴在 chestPivotY），要减掉这段。
    const baseY = bodyH - 0.04 - chestPivotY;
    if (!swingCfg.enabled) {
      armL.root.position.set(-baseX, baseY, 0);
      armR.root.position.set(baseX, baseY, 0);
      lastShoulder = { lx: -baseX, ly: baseY, lz: 0, rx: baseX, ry: baseY, rz: 0 };
      return;
    }
    const liftMax = Math.max(0, swingCfg.shoulderLift);
    const pushMax = Math.max(0, swingCfg.shoulderPush);
    const inw = attacking && weapon === 'greatsword' ? Math.max(0, swingCfg.shoulderIn) : 0;
    const lift = (pitch: number) => liftMax * clamp((-pitch - 0.5) / 1.45, 0, 1);
    const push = (pitch: number) => pushMax * clamp((-pitch - 0.2) / 1.9, 0, 1);
    const lx = -baseX + inw;
    const ly = baseY + lift(armL.root.rotation.x);
    const lz = push(armL.root.rotation.x);
    const rx = baseX - inw;
    const ry = baseY + lift(armR.root.rotation.x);
    const rz = push(armR.root.rotation.x);
    armL.root.position.set(lx, ly, lz);
    armR.root.position.set(rx, ry, rz);
    lastShoulder = { lx, ly, lz, rx, ry, rz };
  }

  /** 攻击跨步：每段攻击在挥出时向前跨一步，连击左右腿交替（单调步序的奇偶决定方向），
   * 同时重心下沉，让「每一次前移动画都表现出一个跨步」，且连击节奏连贯而非原地比划。 */
  function applyStep(combat: CombatState, stepDir: number, dt: number): void {
    if (combat.phase === 'idle' || combat.charging) {
      stepZ = 0; stepX = 0; stepDip = 0;
      return;
    }
    const p = combat.attackProgress;
    const swing = swingCurve(p);
    const forth = Math.max(0, swing);
    // v9s.41：方向由 attackStepIndex 的奇偶给（每段 +1），不再用 comboIndex ——
    // 后者 3 连击后会回到 1，第 3 段与下一轮第 1 段同向跨步，看着像「同一个方向连跨两次」。
    // v8g：幅度外置 + 收敛（旧版硬编码 0.17 / 0.14 / 0.05 在重击时推得过远）。
    // 大剑额外乘 heavyScale：双手大抡配小跨步，脚由 IK 钉地、身体只小幅前移，
    // 不会再出现「身体离开腿」。数值缺省时回落到旧值，兼容外部构造的配置对象。
    const cfg = animCfg.stride;
    const reach = Number.isFinite(cfg.stepReach) ? cfg.stepReach : 0.17;
    const side = Number.isFinite(cfg.stepSideReach) ? cfg.stepSideReach : 0.14;
    const dip = Number.isFinite(cfg.stepDipReach) ? cfg.stepDipReach : 0.05;
    const heavy = combat.weapon === 'greatsword'
      ? clamp(Number.isFinite(cfg.heavyScale) ? cfg.heavyScale : 1, 0, 1) : 1;
    // v9s.41：段间连续。连击在 recovery 中途接续时 progress 归零，`swingCurve` 从
    // 0.6 直接掉到 0（|swing|≤1 的蓄势段）—— 骨盆一帧内退回 8.7cm、下沉 4cm、
    // 侧跨方向直接翻号，读起来是「人被打回原地重新起步」。
    // 段内包络不动，只把三个偏移量做指数趋近（τ≈85ms），换段变成 0.2 秒的体重转移。
    const k = 1 - Math.exp(-12 * Math.max(0, dt));
    stepZ += (reach * forth * heavy - stepZ) * k;
    stepX += (stepDir * side * forth * heavy - stepX) * k;
    stepDip += (dip * Math.sin(Math.PI * p) * heavy - stepDip) * k;
    pelvis.position.z += stepZ;                                    // 向前跨步（+Z = 前）
    pelvis.position.x += stepX;                                    // 左右交替跨步
    pelvis.position.y -= stepDip;                                  // 重心下沉
  }

  // v8d：攻击姿态对腿的写入不再零散塞在各武器分支里（旧版只有大剑 / 三连击第 3 段
  // 会写 legX.root.rotation.x，默认剑盾前两段、双剑、弓、法杖完全不碰腿，
  // 且幅度只有 ±0.24 rad、仅挥出瞬间非零 —— 这是「拉满权重下半身还是不动」的第二个原因）。
  // 现在统一由 update() 的「挥击跨步层」按 attackLegWeight 叠加 attackStridePose，
  // applyCombatPose 只负责上半身与武器姿态，职责单一。

  /**
   * v9s.29 · 「不打这一击时」的骨架快照（待机 / 步态姿态）。
   *
   * 只记战斗姿态会覆盖的节点：躯干、骨盆、双臂、整体转体。
   * 腿不动 —— 腿的进出由 `attackBlend` 单独负责（它要跟跨步相位对齐）。
   */
  type BaseSnap = {
    upperX: number; upperY: number; upperZ: number; upperPX: number; upperPZ: number;
    pelvisX: number; pelvisY: number; pelvisZ: number; pelvisRX: number; pelvisRZ: number;
    lrx: number; lry: number; lrz: number; lj: number;
    rrx: number; rry: number; rrz: number; rj: number;
    rootY: number;
  };
  let baseSnap: BaseSnap | null = null;

  function captureBasePose(): void {
    baseSnap = {
      upperX: upper.rotation.x, upperY: upper.rotation.y, upperZ: upper.rotation.z,
      upperPX: upper.position.x, upperPZ: upper.position.z,
      pelvisX: pelvis.position.x, pelvisY: pelvis.position.y, pelvisZ: pelvis.position.z,
      pelvisRX: pelvis.rotation.x, pelvisRZ: pelvis.rotation.z,
      lrx: armL.root.rotation.x, lry: armL.root.rotation.y, lrz: armL.root.rotation.z,
      lj: armL.joint.rotation.x,
      rrx: armR.root.rotation.x, rry: armR.root.rotation.y, rrz: armR.root.rotation.z,
      rj: armR.joint.rotation.x,
      rootY: root.rotation.y,
    };
  }

  /**
   * v9s.29 · 把「战斗姿态」按权重混合回待机姿态。
   *
   * w=1 → 完全是战斗姿态（攻击主体，逐帧不变）；w=0 → 完全待机。
   * 进出各一段时长（`poseIn` / `poseOut`），两端用 smoothstep，导数连续 = 不抽。
   */
  function blendCombatPose(w: number): void {
    const b = baseSnap;
    if (!b) return;
    const k = segEase(clamp(w, 0, 1));
    if (k >= 1) return;
    const mix = (from: number, to: number): number => from + (to - from) * k;
    upper.rotation.x = mix(b.upperX, upper.rotation.x);
    upper.rotation.y = mix(b.upperY, upper.rotation.y);
    upper.rotation.z = mix(b.upperZ, upper.rotation.z);
    upper.position.x = mix(b.upperPX, upper.position.x);
    upper.position.z = mix(b.upperPZ, upper.position.z);
    pelvis.position.x = mix(b.pelvisX, pelvis.position.x);
    pelvis.position.y = mix(b.pelvisY, pelvis.position.y);
    pelvis.position.z = mix(b.pelvisZ, pelvis.position.z);
    pelvis.rotation.x = mix(b.pelvisRX, pelvis.rotation.x);
    pelvis.rotation.z = mix(b.pelvisRZ, pelvis.rotation.z);
    armL.root.rotation.x = mix(b.lrx, armL.root.rotation.x);
    armL.root.rotation.y = mix(b.lry, armL.root.rotation.y);
    armL.root.rotation.z = mix(b.lrz, armL.root.rotation.z);
    armL.joint.rotation.x = mix(b.lj, armL.joint.rotation.x);
    armR.root.rotation.x = mix(b.rrx, armR.root.rotation.x);
    armR.root.rotation.y = mix(b.rry, armR.root.rotation.y);
    armR.root.rotation.z = mix(b.rrz, armR.root.rotation.z);
    armR.joint.rotation.x = mix(b.rj, armR.joint.rotation.x);
    // v9s.30：整体转体是**整圈角**，必须走最短弧。
    // 双持第三击原地转一圈（spinYaw 推到 2π），收招淡出时「待机姿态」的 rootY 是 0，
    // 直接线性插值会从 6.28 一路减到 0 —— 画面上就是转过一圈后又倒着转回去一圈。
    // 走最短弧时 2π 与 0 差 0，淡出对朝向零影响；半圈被打断才真的回正。
    root.rotation.y = b.rootY + wrapAngle(root.rotation.y - b.rootY) * k;
    lastRootTurn = root.rotation.y;
  }

  /**
   * v9s.33 · 把「躯干总角」拆到腰 / 胸两段。
   *
   * 所有姿态层（步态、攻击、受击、惯性、持械偏移、朝向补偿）都只写 `upper`，
   * 这里在**最后一刻**按权重拆开：世界朝向不变（绕同一竖直轴的旋转可加），
   * 但弯折点从腰移到了胸腔。因此不需要改任何一条动画数据 —— 这正是
   * 「现有动画数据能适配有腰胸颈骨骼的模型」的原因：数据描述的是总角，不是某根骨。
   *
   * 颈段只吃俯仰：头相对躯干反向转 `neck × 总俯仰`，身体压下去时视线仍然平。
   * 扭转留给 gaze（headYaw），两套来源不打架。
   */
  /** 拆分前的躯干总角：帧尾校验用（null = 本帧没拆分 / 未启用脊柱分段） */
  let intendedTorso: { x: number; y: number; z: number } | null = null;
  /** 帧尾校验的残差：> 0 说明有代码在 splitSpine 之后又把 upper 当总角写 */
  let spineLeak = 0;
  /** v9s.34：前馈后的侧向偏移（与纯反馈的差值就是前馈贡献） */
  let lastLateralFf = 0;

  function splitSpine(): void {
    if (!spineOn) return;
    const cfg = spineCfg!;
    const w = Math.max(0, cfg.waist ?? 1);
    const c = Math.max(0, cfg.chest ?? 0);
    const sum = w + c;
    const kw = sum > 1e-6 ? w / sum : 1;
    const kc = sum > 1e-6 ? c / sum : 0;
    const tx = upper.rotation.x;
    const ty = upper.rotation.y;
    const tz = upper.rotation.z;
    upper.rotation.set(tx * kw, ty * kw, tz * kw);
    chest.rotation.set(tx * kc, ty * kc, tz * kc);
    const neck = clamp(cfg.neck ?? 0, 0, 1);
    if (neck > 0) headPivot.rotation.x -= tx * neck;
    // 记下拆分前的总角，帧尾用它校验「有没有人在 split 之后又把 upper 当总角写」
    intendedTorso = { x: tx, y: ty, z: tz };
  }

  /**
   * v9s.34：本帧躯干「总」角（腰 + 胸）。
   *
   * **所有需要总角的代码都必须走这里，不要直接读 `upper.rotation`** ——
   * `splitSpine()` 之后 `upper` 只剩腰段（42% 被拆到 `chest`），
   * 直接读会静默偏小且不报错（v9s.33 实际踩了 5 处）。
   */
  function torsoTotal(): { yaw: number; pitch: number; lean: number } {
    return {
      yaw: upper.rotation.y + (spineOn ? chest.rotation.y : 0),
      pitch: upper.rotation.x + (spineOn ? chest.rotation.x : 0),
      lean: upper.rotation.z + (spineOn ? chest.rotation.z : 0),
    };
  }

  /** 本帧躯干「总」偏航：脊柱拆分后 upper 只剩腰段，读总角必须把胸段加回来。 */
  function torsoYaw(): number {
    return torsoTotal().yaw;
  }

  /**
   * v9s.33 · 平衡读数 + 自动配重（每帧末尾，所有姿态层与 IK 都写完之后）。
   *
   * 质点模型（质量按体素比例分配，总量不需要归一化）：
   *   头 0.08 / 胸 0.24 / 腹 0.14 / 骨盆 0.12 / 每臂 0.05 / 每腿 0.15 / 武器 0.04~0.09
   *
   * 支撑面取「着地脚」的脚掌包围盒并集；双脚离地时标记 grounded=false，
   * 分数不参与验收（空中没有支撑面，谈平衡没有意义）。
   *
   * 自动修正只处理**侧向**：把骨盆带着上半身往质心偏的方向挪回几毫米。
   * 前后方向不修正 —— 那要靠跨步（Core 的 lunge / 步态），挪胯拉不回来。
   */
  function updateBalance(c: CharacterState, dt: number): void {
    if (!balanceCfg?.enabled) {
      lastBalance = null;
      balanceShift = 0;
      return;
    }
    root.updateWorldMatrix(true, true);
    const tmp = new THREE.Vector3();
    const points: BalancePoint[] = [];
    const add = (obj: THREE.Object3D, mass: number, dy = 0): void => {
      obj.getWorldPosition(tmp);
      points.push({ x: tmp.x, y: tmp.y + dy, z: tmp.z, mass });
    };
    const H = v.headSize;
    add(headPivot, 0.08, H / 2);
    add(torso, 0.14);
    add(chestMesh ?? chest, spineOn ? 0.24 : 0.24);
    add(pelvis, 0.12);
    add(armL.hand, 0.05);
    add(armR.hand, 0.05);
    add(legL.joint, 0.15);
    add(legR.joint, 0.15);
    const blade = currentWeapon ? readBlade(parts[currentWeapon].right) : null;
    if (blade) {
      points.push({
        x: (blade.base.x + blade.tip.x) / 2,
        y: (blade.base.y + blade.tip.y) / 2,
        z: (blade.base.z + blade.tip.z) / 2,
        mass: currentWeapon === 'greatsword' ? 0.09 : 0.04,
      });
    }

    // 支撑面：只算着地脚；脚掌按当前体型尺寸扩展
    const footHalfX = Math.max(0.05, (v.limbThickness * 1.15) / 2 + 0.015);
    const footHalfZ = Math.max(0.06, (v.limbThickness * 1.7) / 2 + 0.02);
    let minX = Infinity; let maxX = -Infinity;
    let minZ = Infinity; let maxZ = -Infinity;
    let groundedFeet = 0;
    for (const leg of [legL, legR]) {
      leg.tip.getWorldPosition(tmp);
      // 支撑面始终取**双脚**（含抬起的脚的地面投影）：
      // 走路本来就是单脚支撑 + 另一只脚马上落地，若只算着地脚，支撑框会在一帧内
      // 从两脚宽缩成一只脚，余量读数在 -1 和 +1 之间乱跳，配重会跟着抽。
      // 平衡关心的是「质心会不会掉出两脚之间」，这正是人走路时的约束。
      if (tmp.y <= 0.13) groundedFeet += 1;
      minX = Math.min(minX, tmp.x - footHalfX);
      maxX = Math.max(maxX, tmp.x + footHalfX);
      minZ = Math.min(minZ, tmp.z - footHalfZ);
      maxZ = Math.max(maxZ, tmp.z + footHalfZ);
    }
    if (!Number.isFinite(minX) || groundedFeet === 0) {
      minX = maxX = minZ = maxZ = 0; // 双脚离地：退化支撑面 → grounded=false
    }

    // 用位置差分取实际速度（含 lunge / 击退 / 闪现），velocity 不含 impulse
    let vx = 0; let vz = 0;
    if (Number.isFinite(balanceBodyX) && dt > 1e-5) {
      vx = clamp((c.position.x - balanceBodyX) / dt, -20, 20);
      vz = clamp((c.position.z - balanceBodyZ) / dt, -20, 20);
    }
    balanceBodyX = c.position.x;
    balanceBodyZ = c.position.z;

    const res = solveBalance(points, { minX, maxX, minZ, maxZ }, vx, vz, balanceCfg);
    lastBalance = res;

    // ---- 自动配重（只处理侧向）----
    if (!balanceCfg.autoCounter) { balanceShift = 0; return; }
    const rightX = Math.cos(c.bodyYaw);
    const rightZ = -Math.sin(c.bodyYaw);
    const dx = res.xcomX - res.centerX;
    const dz = res.xcomZ - res.centerZ;
    const lateral = dx * rightX + dz * rightZ;       // + = 质心偏向身体右侧
    // v9s.34：闭环有相位滞后（读脚位 → 挪骨盆 → 下帧脚位再变），
    // 用侧向速度前馈把「lead 秒后的偏移」提前算进来；lead = 0 精确回到纯反馈。
    const latSpeed = vx * rightX + vz * rightZ;
    // 双脚离地时支撑面退化（xcom / center 都是 0），此时的外推没有意义，直接归零
    const lateralFf = res.grounded
      ? feedForwardLateral(lateral, latSpeed, balanceCfg.predLead ?? 0)
      : 0;
    lastLateralFf = lateralFf;
    // 从 45% 半宽就开始轻微配重（不是等到真的踩到边缘才动）：
    // 手臂能贡献的质心位移只有几毫米，早一点、小一点，才不会在边缘突然一抽。
    const latDeficit = Math.abs(lateralFf) - 0.45 * res.halfX;
    lastLatDeficit = latDeficit;
    let target = 0;
    if (latDeficit > 0.002 && res.grounded) {
      // 上半身约占体重 60%，平移骨盆 x 米 ≈ 质心移动 0.6x 米；
      // 再乘 0.7 留一点余量，避免「修正过头」反向震荡。
      const gain = 0.7 / 0.6;
      target = -Math.sign(lateralFf) * Math.min(Math.max(0.005, balanceCfg.maxShift ?? 0.045), (latDeficit + 0.002) * gain);
    }
    // 负载加权：偏得越多越急，避免「慢慢挪」追不上快速横移
    const load = Math.abs(lateralFf) / Math.max(1e-4, res.halfX);
    const rate = Math.max(0.1, counterRateFor(balanceCfg.counterRate, load, balanceCfg.counterBoost ?? 0));
    balanceShift += (target - balanceShift) * (1 - Math.exp(-rate * dt));
  }

  function applyCombatPose(combat: CombatState, dt: number): void {
    // 每帧复位可变的武器部件，避免姿态残留
    bowModel.drawString.position.z = -0.06;
    arrowModel.position.z = 0;
    staffModel.orb.scale.setScalar(1);
    upper.rotation.y = 0;

    if (combat.charging && combat.weapon === 'bow') {
      // 蓄力：左手持弓前伸，右手拉弦后移，箭随蓄力后拉
      // v8g：肘关节弯曲方向修正 —— 骨架里手臂沿 -Y 伸出，rotation.x 为正会把前臂
      // 折向 -Z（身后）变成「反关节」；人体屈肘应朝 +Z（身前），故所有肘角取负。
      const q = combat.charge;
      armL.root.rotation.x = -1.25;
      armL.joint.rotation.x = -0.15;
      armR.root.rotation.x = 0.35 + q * 0.3;
      armR.joint.rotation.x = -1.15;
      bowModel.drawString.position.z = -0.06 - q * 0.22;
      arrowModel.position.z = -q * 0.3;
      upper.rotation.y = -0.22;
      return;
    }

    // v9s.29：收招淡出期间（combatPoseW > 0）继续写战斗姿态，让交叉淡出有「来源」；
    // 权重归零后才清状态。否则最后一帧直接跳回待机，淡出就白做了。
    // v9s.55：权重归零就交还待机 —— 不再要求 phase 先回 idle。
    // 旧条件会在 `settle` 期间「权重已是 0、却仍写满挥出姿态」：混合函数在 w=0 时
    // 不再被调用，骨骼就停在挥出帧上，直到 settle 结束那一帧被 update 开头整体归零
    // —— 收招最后一帧硬切（实测单帧 1.4 rad，比硬切 A/B 还差）。
    if (combatPoseW <= 0.001) {
      // 收招：清空段间过渡状态，下次起手从本段起手帧开始（不继承上一轮收势）
      swingFrom = null;
      swingPose = null;
      swingSeg = 0;
      swingFade = 1;
      swingSpan = Math.max(0.008, swingCfg.segBlend);
      swingBladePitch = null;
      swingBladePitchOff = null;
      swingBladeTwist = null;
      swingBladeTwistOff = null;
      swingBladeYaw = null;
      swingBladeYawOff = null;
      // 收招：握点回到默认位置（否则下一轮起手会从上一轮滑到的地方开始）
      gripSlide = NaN;
      // 内收量也归位（否则最后一段停在举顶时会带着 0 内收进待机）
      if (combat.weapon === 'greatsword') {
        mountR.position.x = -Math.max(0, mountCfg.twoHandInsetX ?? 0);
      }
      return;
    }

    // settle 停顿阶段：attackProgress 定格为 1，姿态保持收势末态，形成「前移 → 定住」的节奏
    const swing = swingCurve(combat.attackProgress);
    const back = Math.max(0, -swing);
    const forth = Math.max(0, swing);

    // 法杖技能（引导飞弹 / 电环）已抽离到 abilities 模块，法杖不再进入近战 AttackPhase，
    // 因此这里没有法杖施法姿态；引导姿态由 update() 的 applyChannelPose() 单独覆盖（v7c #12）。
    if (combat.weapon === 'bow') {
      armL.root.rotation.x = -1.2;
      armL.joint.rotation.x = -0.15;
      armR.root.rotation.x = 0.9 - forth * 0.8;
      armR.joint.rotation.x = -0.3;
    } else if (combat.weapon === 'greatsword') {
      if (swingCfg.enabled) {
        // v9s.23：三段各自一条关键帧曲线（右→左 / 左→右 / 举顶下劈），
        // 躯干扭转 + 前后倾 + 骨盆重心一起给出，手臂只做小幅内收让副手够得到柄。
        writeSwingPose(solveSwingFor(combat, dt));
      } else {
        // v9s.22 姿态：双手前伸、三段共用同一条曲线（保留作 A/B 对照）
        const both = -1.6 * back + 1.25 * forth;
        const heavy = clamp(
          Number.isFinite(animCfg.stride.heavyScale) ? animCfg.stride.heavyScale : 1, 0, 1,
        );
        armR.root.rotation.x = both;
        armR.joint.rotation.x = -(0.25 + back * 0.4);
        armL.root.rotation.x = both + 0.06;
        armL.joint.rotation.x = -(0.32 + back * 0.4);
        armL.root.rotation.z = 0.42;
        armR.root.rotation.z = 0;
        const armFwd = -Math.sin(armR.root.rotation.x);
        armR.root.rotation.y = -0.72 * Math.tanh(armFwd * 4);
        upper.rotation.y = -0.2 * swing * heavy;
      }
    } else {
      if (swingCfg.enabled) {
        writeSwingPose(solveSwingFor(combat, dt));
      } else {
        // 剑类三连击（v9s.22 旧姿态）：段1 右上劈、段2 左横斩、段3 双手大力下劈
        const seg = combat.comboIndex;
        if (seg === 1) {
          armR.root.rotation.x = -1.7 * back + 1.1 * forth;
          armR.joint.rotation.x = -(0.2 + back * 0.5);
          armL.root.rotation.x = 0.1;
          upper.rotation.y = -0.18 * swing;
        } else if (seg === 2) {
          armL.root.rotation.x = -1.5 * back + 1.0 * forth;
          armL.joint.rotation.x = -(0.2 + back * 0.5);
          armR.root.rotation.x = 0.2;
          upper.rotation.y = 0.45 * -swing;
        } else {
          const both = -1.9 * back + 1.2 * forth;
          armL.root.rotation.x = both;
          armR.root.rotation.x = both;
          armL.joint.rotation.x = -(0.15 + back * 0.4);
          armR.joint.rotation.x = -(0.15 + back * 0.4);
          upper.rotation.y = -0.3 * swing;
        }
      }
    }

    // v9s.23：双手武器的内收量随手臂抬高衰减。
    // `twoHandInsetX` 是为了让副手够得到柄（肩距 0.6、单臂 0.42），但它把剑柄
    // 从 x=0.30（头右侧外）拉到 x=0.15 —— 一旦举过头顶，那截 0.46m 的下段柄
    // 正好从头顶穿出来（实测段 3 起手剑柄插在头里）。举高时取消内收，剑回到
    // 头侧；副手靠握点滑动 + 臂长拉伸去够，够不到时允许短暂半松。
    if (combat.weapon === 'greatsword') {
      const raise = clamp((-armR.root.rotation.x - 1.3) / 1.2, 0, 1);
      mountR.position.x = -Math.max(0, mountCfg.twoHandInsetX ?? 0) * (1 - raise);
    }

    // 各武器统一的跨步覆盖（在武器姿态之上再叠加前向 / 左右步幅）
    applyStep(combat, attackStepIndex % 2 === 0 ? 1 : -1, dt);
  }

  /**
   * 法杖引导姿态（v7c #12）：按住攻击键时举杖前指、法球放大并轻微脉动。
   * 只覆盖上半身手臂与法球，保留下半身步态 —— 「按住可移动引导」才成立。
   * 脉动用 Core 的 gaitPhase 驱动，不引入表现层本地时间，暂停 / 时间缩放下仍同步。
   */
  function applyChannelPose(channeling: boolean, gaitPhase: number): void {
    if (!channeling) return;
    armR.root.rotation.x = -1.05;
    armR.joint.rotation.x = -0.35;
    armL.root.rotation.x = -0.45;
    armL.joint.rotation.x = -0.2;
    upper.rotation.y = -0.12;
    staffModel.orb.scale.setScalar(1.25 + 0.12 * Math.sin(gaitPhase * 2));
  }

  /**
   * v9a：剑盾「冲锋盾击」姿态（纯表现）。派生招刻意不进 combat.phase（保持 idle，
   * 才能与引导 / 普通连击正交），所以 applyCombatPose 会直接 return，这里单独叠加：
   * 蓄力收盾 → 前撞举盾 → 收势回正，两端自动归零，不残留、不与步态 / IK 打架。
   */
  function applyLinkPose(link?: LinkState): void {
    if (!link || link.phase === 'idle') return;
    const t = link.progress;
    const q = t < 0.3 ? -0.35 + (t / 0.3) * 1.35
      : t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.3);
    const DEG = Math.PI / 180;
    upper.rotation.x += linkView.leanDeg * DEG * q;
    armL.root.rotation.x -= linkView.shieldPitchDeg * DEG * q; // 持盾臂前伸（负 = 朝身前 +Z）
    armL.joint.rotation.x -= 0.22 * q;
    armR.root.rotation.x -= 0.3 * q;
    pelvis.position.z += linkView.pelvisReach * Math.max(0, q);
  }

  /**
   * v9s.29：读一条刃身的世界几何（刃根 / 刃尖 / 宽面法线）。
   *
   * 法线取武器节点的世界矩阵第一列（局部 X）——模型约定「薄在 X、宽在 Z」，
   * 所以局部 X 就是宽面法线。刃面滚转（`bladeTwist`）转的正是这条法线，
   * 于是「刃口是否迎着挥击方向」可以直接量化，不用靠肉眼猜。
   */
  function readBlade(g: THREE.Object3D | undefined): BladeGeom | null {
    if (!g) return null;
    const b = g.getObjectByName('bladeBase');
    const t = g.getObjectByName('bladeTip');
    if (!b || !t) return null;
    g.updateWorldMatrix(true, false);
    const bp = b.getWorldPosition(new THREE.Vector3());
    const tp = t.getWorldPosition(new THREE.Vector3());
    const ax = new THREE.Vector3().setFromMatrixColumn(g.matrixWorld, 0).normalize();
    return {
      base: { x: bp.x, y: bp.y, z: bp.z },
      tip: { x: tp.x, y: tp.y, z: tp.z },
      normal: { x: ax.x, y: ax.y, z: ax.z },
    };
  }

  /** v9s.54：驱动量死区 —— 小于 0.6 rad/s² 的输入推不动一根胡子，留着只会慢慢漂。 */
  const deadzone = (v: number): number => (Math.abs(v) < 0.6 ? 0 : v);

  /**
   * v9s.54：手臂避让 —— 手挥到脸前时把胡子推向另一侧，否则剑会从胡子中间穿过去。
   *
   * 判据是手在**头部局部坐标**里的位置：在前方（z > 0）、横向够近（|x| < 0.3）、
   * 低于下巴（y < 0.06），三者同时成立才算威胁。不做真正的碰撞求解 ——
   * 方块风格里「看起来躲开了」就够了，代价只有每帧 2 次 getWorldPosition。
   */
  function beardAvoid(): { pitch: number; roll: number } {
    if (!beardPivots.length) return { pitch: 0, roll: 0 };
    headPivot.updateWorldMatrix(true, false);
    let push = 0;
    let side = 0;
    for (const limb of [armL, armR]) {
      limb.hand.getWorldPosition(beardTmp);
      headPivot.worldToLocal(beardTmp);
      const a = beardAvoidAt(beardTmp.x, beardTmp.y, beardTmp.z);
      if (a.push > 0) {
        push = Math.max(push, a.push);
        side += a.side;
      }
    }
    return { pitch: push * 5, roll: clamp(side, -1, 1) * 8 };
  }

  return {
    group: root,
    update(
      c: CharacterState, combat: CombatState, hurt: HurtState, frameDt: number,
      channeling = false, coreTime?: number, link?: LinkState,
      turn?: TurnInPlaceState,
    ): void {
      setWeapon(combat.weapon);
      // v9s.45：**游戏时间**步长。慢放 / 暂停 / 单步都走 Core 的 world.time，
      // 与 frameDt 的关系是 gameDt = frameDt × timeScale（常速下两者逐位相同）。
      // 只有转身闸门需要它：判定「身体在不在自己转」必须与时间缩放无关，
      // 否则 0.25× 慢放会把角速度除以 4，闸门半开 → 下盘在转身中途被放行。
      const gameDt = coreTime === undefined || prevCoreTime < 0
        ? frameDt
        : clamp(coreTime - prevCoreTime, 0, 0.1);
      if (coreTime !== undefined) prevCoreTime = coreTime;
      // v9s.26：整体转体每帧归零，只有 writeSwingPose 会写它。
      // 不能靠 idle 分支单独清 —— 换武器 / 受击 / 引导等早退分支都会跳过挥击层，
      // 残留的 root.rotation.y 会让角色「斜着站」。
      root.rotation.y = 0;
      lastRootTurn = 0;
      upper.rotation.x = 0;
      upper.rotation.z = 0;
      // 每帧把骨盆复位到髋部基准：applyStep / applyHurt / 落地缓冲 / 挥击跨步
      // 都用 += / -= 叠加，若不归零会逐帧累积，导致攻击时上半身飞出去（v7a 回归 bug）。
      // v8f 骨架重构后，跨步 / 下沉 / 后坐 / 重心全部落在共享骨盆上，一次归零即可
      // 保证上下半身同步，不再需要分别对两个并列组手动对齐。
      pelvis.position.x = 0;
      pelvis.position.y = legLen;
      pelvis.position.z = 0;
      pelvis.rotation.z = 0;
      // v8g：盆骨前后倾角由惯性层写入，每帧先归零，否则会逐帧累积
      pelvis.rotation.x = 0;
      // upper / lower 相对骨盆的局部偏移每帧归零，之后由受击分层 / 落地 / 跨步重新写入
      upper.position.x = 0;
      upper.position.y = 0;
      upper.position.z = 0;
      // v9s.33：胸段同样每帧复位（splitSpine 用 += 写会逐帧累积）
      chest.rotation.set(0, 0, 0);
      lower.position.x = 0;
      lower.position.y = 0;
      lower.position.z = 0;
      lower.rotation.z = 0;

      // ---- 移动惯性倾斜（纯表现，帧率无关）----
      // 身体前方单位向量 = (sin(bodyYaw), cos(bodyYaw))；加速度投影 >0 为加速、<0 为刹车。
      const dt = Math.max(1 / 240, Math.min(frameDt, 0.1));

      // ---- v9s.32 持械待机姿态：按武器取基准偏移，换武器时淡入 ----
      // 只改「非攻击」基准（步态摆臂 + 躯干朝向）；攻击时 applyCombatPose 会整体
      // 覆盖手臂 / 躯干，交叉淡出仍以这里写好的姿态为起点，所以起手不再从
      // 「统一徒手站姿」开始，而是从「这把武器的持械站姿」开始。
      stanceCfgNow = animCfg.stance?.[combat.weapon] ?? null;
      if (stanceWeapon !== combat.weapon) {
        stanceWeapon = combat.weapon;
        stanceWeight = stanceCfgNow ? 0 : 1;
      }
      const stanceDur = Math.max(0.01, stanceCfgNow?.blend ?? 0.22);
      stanceWeight = Math.min(1, stanceWeight + dt / stanceDur);
      const stanceK = stanceCfgNow ? stanceWeight : 0;
      stancePitch = ((stanceCfgNow?.bladePitchDeg ?? 0) * Math.PI) / 180 * stanceK;
      stancePitchOff = ((stanceCfgNow?.bladePitchOffDeg ?? 0) * Math.PI) / 180 * stanceK;

      // ---- v8c 时间源：优先取 Core 的 world.time ----
      // 暂停 / 时间缩放 / 单步推进时，落地缓冲与逻辑同步；不传时（单测）按 frameDt 累加。
      const now = coreTime === undefined ? (localTime += frameDt) : coreTime;
      lastNow = now;
      const landCfg = animCfg.landing;

      // ---- v8c 跳跃 / 落地蓄力缓冲：只检测 grounded 边沿，不改任何 Core 状态 ----
      // 落地那一帧 Core 已把 velocity.y 置 0，故冲击强度取上一帧记录的 prevVy。
      if (!landCfg.enabled) {
        pulseKind = 'none';
        pulseStrength = 0;
      } else if (prevGrounded && !c.grounded) {
        // 起跳瞬间的预备下蹲（「蓄力」），强度可热调到 0 只保留落地缓冲
        pulseKind = 'jump';
        pulseStart = now;
        pulseDuration = landCfg.anticipationDuration;
        pulseStrength = Math.max(0, landCfg.jumpAnticipation);
        pulseCompress = 0.32;
      } else if (!prevGrounded && c.grounded) {
        pulseKind = 'land';
        pulseStart = now;
        pulseDuration = landCfg.duration;
        pulseStrength = landingImpactScale(prevVy, landCfg);
        pulseCompress = landCfg.compressRatio;
        lastImpactVy = prevVy;
      }
      // 复位会把 world.time 归零：时间倒退时作废当前脉冲，避免负进度
      if (now < pulseStart) {
        pulseKind = 'none';
        pulseStrength = 0;
      }
      prevGrounded = c.grounded;
      prevVy = c.velocity.y;
      const landPulse = pulseValue(now, pulseStart, pulseDuration, pulseStrength, pulseCompress);

      // ---- v8c/v8d 攻击下半身权重过滤 ----
      // charging（弓蓄力）时 combat.phase 必为 idle（combat.ts 只在 idle 起蓄力），
      // 法杖引导也不进近战状态机 —— 两者都保持「可移动」的真实步态，不受攻击分层影响。
      const attacking = combat.phase !== 'idle';
      /** v9s：Core 的原地转身状态机是否正在驱动一次转身（静止盯视目标绕到背后） */
      const turnActive = turn?.phase === 'active';
      attackBlend = attackBlendStep(attackBlend, attacking, dt, animCfg.attack.blendRate);
      const weights = poseWeights(
        attackBlend, animCfg.attack.gaitWeight, animCfg.attack.lowerBodyWeight,
      );
      attackLegWeight = weights.attackLegWeight;
      lastGaitScale = weights.gaitScale;

      const fx = Math.sin(c.bodyYaw);
      const fz = Math.cos(c.bodyYaw);
      const rawAx = (c.velocity.x - prevVx) / dt;
      const rawAz = (c.velocity.z - prevVz) / dt;
      // 限幅：复位 / 传送 / 受击击退带来的速度突变不应造成抽搐
      const ax = clamp(rawAx, -60, 60);
      const az = clamp(rawAz, -60, 60);
      const along = ax * fx + az * fz;
      const turnRate = wrapAngle(c.bodyYaw - prevBodyYaw) / dt;
      /** v9s.45：同一段转角按**游戏时间**再算一次 —— 只给转身闸门用。
       *  常速下 gameDt ≡ frameDt，两者逐位相同；慢放时闸门才不会半开。 */
      const turnRateGame = gameDt > 1e-6
        ? wrapAngle(c.bodyYaw - prevBodyYaw) / gameDt
        : 0;
      const leanSpeed = Math.hypot(c.velocity.x, c.velocity.z);
      const maxF = (leanCfg.maxForwardDeg * Math.PI) / 180;
      const maxS = (leanCfg.maxSideDeg * Math.PI) / 180;
      // 加速前倾（+），刹车后仰（-）；绕圈时向转弯内侧压（turnRate×speed 决定强度）
      const targetF = clamp(along * leanCfg.accelGain, -maxF, maxF);
      const targetS = clamp(-turnRate * leanSpeed * leanCfg.turnGain, -maxS, maxS);
      const k = 1 - Math.exp(-leanCfg.smoothing * dt);
      leanForward += (targetF - leanForward) * k;
      leanSide += (targetS - leanSide) * k;
      prevVx = c.velocity.x;
      prevVz = c.velocity.z;
      prevBodyYaw = c.bodyYaw;

      // ---- 下盘偏航（v8b）：连续、限幅、指数平滑，绝不 angle-wrap ----
      // 旧版 whole-lower 转向用 wrapAngle(moveYaw - bodyYaw)：这个角度差在 ±π 处
      // 从 +π 翻到 -π，引导飞弹（身体朝瞄准方向、移动方向任意，尤其后退 / 瞄准与移动
      // 反向）时下盘会瞬间翻转约 2×幅度，观感就是「跨朝向跳变」。
      // 改用「速度在身体局部的侧向占比」驱动：latRatio ∈[-1,1] 连续，前进/后退≈0
      // （倒着走下盘不翻转）、纯侧移±1；再乘 legYawScale 限幅到 hipYawMaxDeg，
      // 最后指数平滑。全链路没有 atan2 / wrapAngle，任何朝向都不可能跳变。
      const speed = Math.hypot(c.velocity.x, c.velocity.z);
      // v9q：击退冲量由 Core 直接加到 position、不进 velocity（movement.ts 第 4 步），
      // 所以只看 velocity 的步态会「身体被推走、腿却不动」= 整体平移滑步。按配置比例
      // 把击退速度并入**步态驱动**，让下盘沿击退方向迈出后撤步；hipYaw / 惯性倾斜 /
      // 停步门控仍只用原 velocity，击退不会误触发侧移偏转或收相。纯表现层，不进快照。
      const knockScale = clamp(gaitCfg.knockGaitScale ?? 0, 0, 1);
      const knockX = hurt.knockX * knockScale;
      const knockZ = hurt.knockZ * knockScale;
      // 拉 0 时连「击退期间不收相」也一并关掉，精确回到旧行为
      const knockActive = knockScale > 0 && Math.hypot(hurt.knockX, hurt.knockZ) > 1e-3;
      const gaitVX = c.velocity.x + knockX;
      const gaitVZ = c.velocity.z + knockZ;
      const gaitSpeed = Math.hypot(gaitVX, gaitVZ);
      lastGaitSpeed = gaitSpeed;
      const bRightX = Math.cos(c.bodyYaw);
      const bRightZ = -Math.sin(c.bodyYaw);
      const bodyLocalRight = c.velocity.x * bRightX + c.velocity.z * bRightZ;
      const latRatio = speed > EPS ? clamp(bodyLocalRight / speed, -1, 1) : 0;
      // v9s.14：侧后方走后退步时，下盘不是回正、而是朝**移动方向的反侧**转
      // （h = θ − 180°）—— 腿在后退摆，脚往移动方向蹬、膝盖朝反侧，下盘前后轴
      // 才与真实位移平行，脚掌才能钉住地面。v9s.13 的「归零」让轴停在身体正前方，
      // 与斜向移动差 45°，那部分横向位移没有脚补偿 = 滑步。
      const bodyFwdRatio = speed > EPS
        ? clamp((c.velocity.x * fx + c.velocity.z * fz) / speed, -1, 1)
        : 1;
      const backKeep = backStrafeKeep(
        bodyFwdRatio, gaitCfg.backStrafeStartDeg, gaitCfg.backStrafeFullDeg,
      );
      // v9n：纯侧移（|latRatio|→1）时多带转一点下盘，把一部分侧移分量变成前后迈步，
      // 避免两腿只有左右摆、看起来「双脚平行拖着走」。前进/后退 lat≈0 时增益为 0，完全不变。
      // ---- v9s · 停步下盘偏差消化 ----
      // 缩的是「偏转目标」而不是 hipYaw 本身：latRatio 是方向比值，减速时目标仍保持
      // 停步前的偏转，若直接覆盖 hipYaw，下一帧就会被常规平滑拉回去，尾巴照样抽一下。
      // 淡出用上一帧缓存的收相状态（门控在下方才算完），一帧延迟在指数平滑下无可见差。
      if (stopYawPhase === 'settled' && lastGateResume
          && lastSpeed > lastPrevSpeed * 1.02 + 1e-4) {
        // 重新加速 = 玩家起步，交还常规平滑（低速巡航不走收相，不会误伤）
        stopYawPhase = 'none';
      }
      let yawFade = 1;
      if (stopYawPhase === 'blend') {
        const prog = lastInStop ? lastStopT : stopYawDrain;
        yawFade = stopYawFade(prog, gaitCfg.stopYawBlendMode, lastInStop);
        if (!lastInStop) {
          // 收相结束：afterStop 模式按独立计时继续消化（不依赖 turnInPlace 触发），
          // inStop 模式已消化完，或收相被 resume 中止 → 直接归零并进入 settled。
          stopYawDrain = Math.min(1, stopYawDrain + dt / Math.max(0.01, gaitCfg.stopYawAfterSec));
          const done = stopYawDrain >= 1
            || gaitCfg.stopYawBlendMode === 'inStop'
            || lastGateResume;
          if (done) {
            stopYawPhase = 'settled';
            yawFade = 0;
          }
        }
      } else if (stopYawPhase === 'settled') {
        // 已消化完：静止时精确归零；但用「速度 / 进入收相阈值」给偏转留回弹通道 ——
        // 重新加速时自然恢复侧移偏转，不必依赖隐晦的「连续两帧增速」判据。
        // 同时避免「进入下一次收相的第一帧」仍沿用 settled 的 0、下一帧又跳回 1 的抖动。
        yawFade = clamp(speed / Math.max(EPS, gaitCfg.stopEnterRatio * moveSpeed), 0, 1);
      }
      lastStopYawFade = yawFade;
      const strafeYaw = strafeHipYaw(
        latRatio, ori.legYawScale, ori.hipYawMaxDeg, gaitCfg.strafeHipBoost,
      );
      // v9s.44：身体自己在转的时候（朝向切换），① 不让「后退族」把胯拧向移动方向的反侧，
      // ② 目标推进限速 —— 两者合起来，转身只是一个干净的单向带转，不再「拧出去再拧回来」。
      // 一个开关管住整套对策：拉到 0 = 精确回到旧行为（A/B 用）
      const hipRate = (gaitCfg.hipYawTrackRateDeg ?? 0) * Math.PI / 180;
      const hipBackRate = (gaitCfg.hipYawBackRateDeg ?? 0) * Math.PI / 180;
      // v9s.45：闸门改成**一阶状态**（上升 0.06s / 下降 0.22s），并用游戏时间角速度判定。
      // 旧的瞬时值会在转身尾部几帧里从 1 掉到 0，「半开」时目标一帧能蹿 18~24°。
      /** 表现层「游戏时间」步长：常速下等于 frameDt，慢放时按时间缩放缩短。
       *  所有跟手感有关的积分（闸门、目标限速、下盘平滑）都用它 —— 慢放才是纯放大，
       *  不会把时间常数摊薄成「跟不上」。 */
      const dtw = gameDt > 1e-6 ? gameDt : frameDt;
      spinBlend = hipRate > 0
        ? slewGate(spinBlend, turnSpinGate(turnRateGame), dtw)
        : 0;
      // v9s.45：前 / 后相位共用一个权重（目标与限速必须一致，否则互相打架）
      const flip = hipFlipWeight(backKeep, spinBlend);
      // v9s.45：`latRatio` / `bodyFwdRatio` 都是**方向比值**，速度趋零时方向全是噪声
      // （贴着墙被夹住时 v 只剩 1e-5，方向能一夜之间翻 90°）。按速度大小淡出偏转目标：
      // 正常走起来（>0.5 m/s）逐位不变，停下 / 被挡住时下盘回到正中，不再被噪声带着拧。
      const hipSpeedFade = clamp(speed / 0.5, 0, 1);
      const rawTargetHipYaw = backHipYawTarget(
        bodyFwdRatio, latRatio, strafeYaw, flip,
      ) * yawFade * hipSpeedFade;
      // v9s.44/v9s.45：目标限速（度/秒 → rad/s）。短促的方向扫掠会被它削平：身体转身时
      // 下盘不再「先朝一侧拧过去、再拧回来」；后退相位单独一档更慢的上限。
      const targetHipYaw = slewHipTarget(
        lastHipYawTarget, rawTargetHipYaw,
        hipTrackRate(hipRate, hipBackRate, flip), dtw, spinBlend,
      );
      lastHipYawTarget = targetHipYaw;
      // v9s.45：平滑也用游戏时间 —— 慢放时下盘的跟随速度与常速逐位一致，
      // 否则 0.25× 会把 83ms 的时间常数摊成 330ms，看起来「跟不上、追得慢」。
      hipYaw += (targetHipYaw - hipYaw) * (1 - Math.exp(-ori.hipYawSmoothing * dtw));

      // ---- 程序化步态（v8 / v8b）----
      // 关键：腿挂在 lower 下（lower.rotation.y = hipYaw），所以腿的局部坐标系朝向是
      // bodyYaw + hipYaw，不是 bodyYaw。gait 必须用「下盘实际朝向」投影速度，否则
      // 解算器认定的移动方向与腿坐标系差一个 hipYaw，非正前方时腿摆动方向被歪掉
      // （用户反馈 #2）。统一到同一基准后，下盘转向与腿摆动是协同而非重复叠加：
      // 下盘朝移动方向带转一点，腿再沿该局部方向迈步，世界方向始终等于真实速度方向。
      const gaitYaw = c.bodyYaw + hipYaw;
      lastGaitYaw = gaitYaw;
      const fwdX = Math.sin(gaitYaw);
      const fwdZ = Math.cos(gaitYaw);
      const rightX = Math.cos(gaitYaw);
      const rightZ = -Math.sin(gaitYaw);
      // v8d 核心修复：攻击时把 gaitInput 的四个驱动量按 blend 平滑替换成「攻击跨步等效驱动」。
      // Core 锁速 → real.speed = 0 → solveGait 首行直接返回 idle，且非 active 段因无位移
      // gaitPhase 也冻结；不补足这一步，gaitWeight 拉到 1 也拿不到任何姿态（旧 bug 根因）。
      const realDrive: GaitDrive = {
        // v9q：步态看的是「velocity + 击退冲量」，被推开时下盘才会跟着迈步；
        // 关掉 knockGaitScale 时精确回到旧 realDrive（只 velocity）。
        speed: gaitSpeed,
        phase: c.gaitPhase,
        localForward: gaitVX * fwdX + gaitVZ * fwdZ,
        localRight: gaitVX * rightX + gaitVZ * rightZ,
        stride: c.stride,
      };
      // v9s.41：每段攻击 = 迈一步，腿要左右交替。
      // 旧版只在「刚进入攻击」那一帧锁相位、连段沿用同一基准，于是每段都从同一姿态
      // 摆出去再摆回来 —— 连段时第二刀与第一刀的腿完全重合（「没有换腿跨步」）。
      // 现在：
      //   · 每识别到一个新段（Core attackId 变了）就把步序 +1（决定哪条腿领先）；
      //   · 起点相位接「上一帧实际输出的相位」→ 段间零跳变（哪怕在 recovery 中途取消）；
      //   · 只有全新一次攻击、且玩家在移动时，才对真实 gaitPhase —— 否则接着上一刀的
      //     收尾相位走，站着连点也能交替（站着不动时 Core 的 gaitPhase 是冻住的，
      //     用它当基准等于永远同一条腿）。
      if (attacking && combat.attackId !== lastAttackId) {
        const freshAttack = !wasAttacking;
        lastAttackId = combat.attackId;
        attackStepIndex += 1;
        // 走动中起手 / 第一次起手 → 对齐真实步态相位；站着连点 → 接上一刀的收尾相位
        const alignReal = freshAttack && (!attackPhaseSeen || realDrive.speed > 0.05);
        attackPhaseBase = alignReal ? realDrive.phase : attackPhasePrev;
        attackPhaseSeen = true;
      }
      wasAttacking = attacking;
      // v9p：淡出期（attacking=false 但 attackBlend>0）也继续走等效驱动，让相位 /
      // 摆幅按 blend 平滑回落到真实步态；旧版在收势那一帧直接切回 realDrive
      // （speed=0 → idle），步幅放大后这个单帧弹回会非常明显。
      const drive = attackBlend > 0
        ? attackGaitDrive(
          realDrive, combat.attackProgress, attackStepIndex, attackBlend,
          animCfg.stride, attackPhaseBase,
        )
        : realDrive;
      lastDrive = drive;
      // 只在攻击进行中记录「本段实际相位」，淡出期不记（那时 drive.phase 正在往
      // real.phase 上靠，记进去会把下一段的起点拽回去）。
      if (attacking) attackPhasePrev = drive.phase;

      // ---- v9s.43 · 换向融合 ----
      // 用**最终 drive**（含攻击等效驱动）的符号推进：`solveGait` 的前后摆幅 = dirF × wF ×
      // 步幅/4，dirF 硬翻会让整条腿在一帧里镜像过去。这里让符号在 dirFlipSec 内走过 0，
      // 摆幅随之收放（等价于两个方向的姿态交叉淡入），换向时腿先并一下再迈出去。
      const flipSec = Math.max(0, gaitCfg.dirFlipSec ?? 0);
      if (flipSec > 0) {
        dirDriveF = slewDirSign(dirDriveF, drive.localForward >= 0 ? 1 : -1, dt, flipSec);
        dirDriveR = slewDirSign(dirDriveR, drive.localRight >= 0 ? 1 : -1, dt, flipSec);
      } else {
        dirDriveF = drive.localForward >= 0 ? 1 : -1;
        dirDriveR = drive.localRight >= 0 ? 1 : -1;
      }

      // ---- v9n 停步收相 ----
      // Core 的 gaitPhase 只在有位移时推进；松手后位移趋零 → 相位冻结，而 solveGait
      // 只要 speed>=EPS 就仍按该相位输出，角色于是「卡在最后一个跨步 pose」一小段时间。
      // 这里在减速尾段接管：把相位推进到最近的双脚并拢点、摆幅同步淡到 0。
      const stopSec = Math.max(0, gaitCfg.stopBlendSec || 0);
      // 击退期间身体还在被推着走，不能收相（否则刚迈出的后撤步会被抽回待机）
      const stopOn = stopSec > 0 && !attacking && !knockActive && c.grounded;
      // v9o：v9n 只看「速度 < 50% 移速」，轻推摇杆做低速巡航时速度稳定在该区间，
      // 收相照样走完并输出 idle —— 身体匀速平移、腿完全静止，就是用户反馈的「低速滑行」。
      // 现在只把「已降到很低且仍在减速」当停步；重新加速或速度回升立即交还正常步态。
      const gate = stopBlendGate(
        speed, prevSpeed, moveSpeed,
        gaitCfg.stopEnterRatio, gaitCfg.stopExitRatio,
      );
      if (!stopOn || gate.resume) {
        stopT = -1;
      } else if (stopT < 0 && gate.enter) {
        stopT = 0;
        stopPhase0 = c.gaitPhase;
        stopPhaseEnd = nextFeetTogetherPhase(c.gaitPhase);
        // v9s.55：斜跨的前脚 = 停步相位里更靠前的那只（= 最后踩出去的那只）。
        // 与 solveStopInertia 的 leadLeft 同一判据 —— 惯性把左脚踩出去、斜跨却把
        // 右脚留在前面，会读成收相结束时脚自己换了一次。
        idleFrontLeft = leadFootIsLeft(c.gaitPhase, gaitCfg.plantLock);
        stopSpeed0 = speed;
        stopStride0 = Math.max(c.stride, EPS);
        stopFwd = realDrive.localForward;   // gait 局部，给 solveStopGait 用
        stopRight = realDrive.localRight;
        // v9q：惯性方向存**世界**单位向量并锁定，收相期间速度衰减到 0 也不漂移
        const inv = 1 / Math.max(EPS, speed);
        stopDirWX = c.velocity.x * inv;
        stopDirWZ = c.velocity.z * inv;
      }
      const oldPrevSpeed = prevSpeed;
      prevSpeed = speed;
      const inStop = stopOn && stopT >= 0;
      if (inStop) stopT = Math.min(1, stopT + dt / stopSec);

      // v9s：记录停步偏差消化窗口的驱动状态，供下一帧 hipYaw 淡出计算使用。
      // 进入收相即启动（从 settled 也能重新进入下一次停步）；缓存一份避免重排整段
      // 步态数据流（realDrive → 门控 → gaitInput 都依赖 gaitYaw/hipYaw）。
      if (inStop && stopYawPhase !== 'blend') {
        stopYawPhase = 'blend';
        stopYawDrain = 0;
      }
      // 收相「进行中」才淡入偏差；stopT 到 1 即视为收相结束（afterStop 模式从此处
      // 开始独立消化）。注意 inStop 变量本身在收相结束后仍为 true（继续输出待机），
      // 所以不能用它判定收相是否走完。
      lastInStop = inStop && stopT < 1;
      lastStopT = stopT;
      lastGateResume = gate.resume;
      lastSpeed = speed;
      lastPrevSpeed = oldPrevSpeed;

      const gaitInput: GaitInput = inStop ? {
        phase: stopPhase0,
        speed: stopSpeed0,
        moveSpeed,
        localForward: stopFwd,
        localRight: stopRight,
        // v9s.43：收相是「停步那一刻方向的快照」，驱动符与冻住的 stopFwd 同向
        dirF: dirDriveF,
        dirR: dirDriveR,
        legLength: v.legLength,
        stride: stopStride0,
        grounded: true,
      } : {
        phase: drive.phase,
        speed: drive.speed,
        moveSpeed,
        localForward: drive.localForward,
        localRight: drive.localRight,
        dirF: dirDriveF,
        dirR: dirDriveR,
        legLength: v.legLength,
        // v9p：攻击时喂「放大的等效步幅」（strideScale），走物理步幅路径让跨步更大；
        // 拉 0 时 drive.stride=0，精确回到 v8d 的「摆幅随速度」回退路径。
        stride: drive.stride ?? 0,
        grounded: c.grounded,
      };
      // 攻击期间按 gaitScale 平滑淡出步态（gaitWeight=0 时淡出到静止基准）；腿、骨盆、摆臂
      // 共用同一系数，保证上下半身同步，不会只淡出一半而出现错位。
      let gaitPose = inStop
        ? solveStopGait(gaitInput, gaitCfg, {
            progress: stopT, phase0: stopPhase0, phaseEnd: stopPhaseEnd,
          })
        : solveGait(gaitInput, gaitCfg);

      // ---- v9s.33 移动接管：收招期间腿要真的迈步 ----
      // Core 在攻击全程保留 30% 自主移速，但攻击等效驱动在 progress≈1 时相位是冻结的，
      // 腿停在收势姿态上；足部 IK 又把两只脚钉在地面 → 身体以 1.2 m/s 平移、脚不动，
      // 玩家读到的就是「攻击结束后下盘滑一段」。
      // 这里按**实际速度**把腿部姿态淡回真实步态（相位、步幅都来自 Core 的真实位移，
      // 与身体位移严格配套）。active 阶段不接管 —— 那一段的位移由 lunge 决定，
      // 交给合成跨步更自然；windup 只允许部分接管，保留蓄势的跨步姿态。
      const takeover = animCfg.attack.moveTakeover;
      if (takeover && !inStop) {
        const cap = combat.phase === 'windup' ? takeover.windup
          : combat.phase === 'recovery' ? takeover.recovery
            : combat.phase === 'settle' ? takeover.settle
              : 0; // active / idle：不接管
        const span = Math.max(0.05, takeover.full - takeover.speed);
        const ramp = clamp((realDrive.speed - takeover.speed) / span, 0, 1);
        const target = clamp(cap, 0, 1) * ramp;
        const rate = target > legTakeoverSm ? 10 : 6;
        legTakeoverSm = clamp(legTakeoverSm + (target - legTakeoverSm) * (1 - Math.exp(-rate * dt)), 0, 1);
      } else if (inStop) {
        legTakeoverSm = 0;
      } else {
        legTakeoverSm = clamp(legTakeoverSm * Math.exp(-8 * dt), 0, 1);
      }
      if (legTakeoverSm > 0.001 && !inStop) {
        const realPose = solveGait({
          phase: realDrive.phase,
          speed: realDrive.speed,
          moveSpeed,
          localForward: realDrive.localForward,
          localRight: realDrive.localRight,
          // v9s.43：与主步态共用同一组驱动符，接管混合时不会因符号不同而互相对冲
          dirF: dirDriveF,
          dirR: dirDriveR,
          legLength: v.legLength,
          stride: realDrive.stride ?? 0,
          grounded: c.grounded,
        }, gaitCfg);
        gaitPose = mixLowerGait(gaitPose, realPose, legTakeoverSm);
      }

      // ---- v9s.55 · 待机斜跨站姿 ----
      // 站定时把「两脚并拢、全身归零」换成「一脚前一脚后、重心压在承重腿」。
      // 权重按速度平滑：走路时精确为 0（几何与旧版逐字节相同），停步 / 收招 / 站桩时升到 1。
      // 与攻击 / 转身互斥 —— 那两种状态本来就要动腿，叠一个站姿只会互相抵消。
      idleT += dt;
      idleSink = 0;
      idleShift = 0;
      idleHipYaw = 0;
      if (idleCfg) {
        const idleAllowed = c.grounded && !attacking && !knockActive && !turnActive;
        const targetIdle = idleAllowed ? idleStanceTarget(speed, idleCfg) : 0;
        // 进入略慢（重心沉下去）、退出略快（起步先把腿交给步态），两端都不会突跳
        const rate = targetIdle > idleStanceW ? idleCfg.smoothing : idleCfg.smoothing * 0.85;
        idleStanceW += (targetIdle - idleStanceW) * (1 - Math.exp(-rate * Math.max(0, dt)));
        if (idleStanceW < 1e-4) idleStanceW = 0;
        if (idleStanceW > 0) {
          const st = solveIdleStance(
            idleFrontLeft, idleStanceW, Math.sin(idleT * 1.15), idleCfg,
          );
          gaitPose = mixIdleStance(gaitPose, st.pose, idleStanceW);
          idleSink = st.sink * idleStanceW;
          idleShift = st.shift * idleStanceW;
          idleHipYaw = st.hipYaw * idleStanceW;
        }
      }

      const gait = scaleGaitPose(gaitPose, weights.gaitScale);

      // ---- v9s · 原地转身踏步 ----
      // turnInPlace.active 时速度≈0，solveGait 直接返回 idle；若不补一层，身体转向时
      // 两腿完全不动，就是「平滑差值下半身完全滑过去」。按转身进度叠加一次交替的
      // 抬膝 / 前迈 / 侧摆（轴脚小、摆动脚大），两端包络归零，进出不抽动。
      // 同时上面把 IK 权重临时置 0，让脚真的挪起来而不是被钉在原地。
      lastTurnStep = 0;
      if (turnActive && turn) {
        const ts = solveTurnStep(turn.progress, turn.dir, gaitCfg);
        const w = weights.gaitScale;
        gait.legL.pitchX += ts.legL.pitchX * w;
        gait.legL.rollZ += ts.legL.rollZ * w;
        gait.legL.kneeX += ts.legL.kneeX * w;
        gait.legR.pitchX += ts.legR.pitchX * w;
        gait.legR.rollZ += ts.legR.rollZ * w;
        gait.legR.kneeX += ts.legR.kneeX * w;
        gait.pelvisY += ts.pelvisY * w;
        lastTurnStep = ts.env;
      }

      // ---- v9p 停步惯性：最后一步踩出去 + 身体跟着惯性微前移，再收回待机 ----
      // 腿角增量落在步态层；**骨盆位移必须放到 IK 基准之后**（见下方 1.1），
      // 否则锚点会把「被惯性推走的骨盆」当成落点，脚跟着一起往前滑。
      // t→1 脉冲归零，与 solveStopGait 的淡出一起平滑接回 idle，不残留姿态。
      let stopBodyX = 0;
      let stopBodyZ = 0;
      let stopBodyDip = 0;
      let stopChest = 0;
      if (inStop) {
        // v9q：方向按骨盆(bodyYaw)局部轴投影，而不是 gait(bodyYaw+hipYaw) 局部 ——
        // 后者会让侧移停步时的身体前移歪掉一个 hipYaw（用户反馈方向不一致）。
        const bd = bodyLocalDir(c.bodyYaw, stopDirWX, stopDirWZ);
        const si = solveStopInertia(stopT, stopPhase0, bd.forward, bd.right, gaitCfg);
        if (si.leadLeft) {
          gait.legL.pitchX -= si.leadPitch;   // 负 = 脚向前踩出
          gait.legL.kneeX += si.leadKnee;
          gait.legR.pitchX += si.trailPitch;  // 跟随腿轻微后蹬
        } else {
          gait.legR.pitchX -= si.leadPitch;
          gait.legR.kneeX += si.leadKnee;
          gait.legL.pitchX += si.trailPitch;
        }
        stopBodyZ = si.bodyShift * si.fwdN;
        stopBodyX = si.bodyShift * si.rightN;
        stopBodyDip = si.bodyDip;
        stopChest = si.chestPitch;
        lastStopStep = si.leadPitch;
        lastStopShift = si.bodyShift;
        lastStopDip = si.bodyDip;
      } else {
        lastStopStep = 0;
        lastStopShift = 0;
        lastStopDip = 0;
      }
      lastLegs = {
        lp: gait.legL.pitchX, lr: gait.legL.rollZ,
        rp: gait.legR.pitchX, rr: gait.legR.rollZ,
      };

      // 1) 基础步态：两腿各自俯仰 / 侧摆 / 抬膝，骨盆重心转移与起伏
      if (!c.grounded) {
        legL.root.rotation.x = -0.55;
        legR.root.rotation.x = -0.25;
        legL.joint.rotation.x = 0.75;
        legR.joint.rotation.x = 0.55;
        armL.root.rotation.x = -0.9;
        armR.root.rotation.x = -0.7;
        armL.joint.rotation.x = -0.6;
        armR.joint.rotation.x = -0.6;
        legL.root.rotation.z = 0;
        legR.root.rotation.z = 0;
        // 空中：骨盆保持髋部基准（update 开头已归零），不做起伏 / 侧倾
      } else {
        legL.root.rotation.x = gait.legL.pitchX;
        legR.root.rotation.x = gait.legR.pitchX;
        legL.root.rotation.z = gait.legL.rollZ;
        legR.root.rotation.z = gait.legR.rollZ;
        legL.joint.rotation.x = gait.legL.kneeX;
        legR.joint.rotation.x = gait.legR.kneeX;
        // v9s.32：持械姿态 = 步态摆臂 × 该武器的摆臂倍率 + 基础偏移。
        // 偏移是「相对」的，所以走路时依然保留步伐摆动（只是重武器摆得更少），
        // 站住时则停在武器自己的持械角度上。
        const sk = stanceCfgNow ? stanceWeight : 0;
        const swingScale = 1 + (((stanceCfgNow?.armSwing ?? 1) - 1) * sk);
        const offR = stanceCfgNow?.armR;
        const offL = stanceCfgNow?.armL;
        const armLx = gait.armL * swingScale + (offL?.pitch ?? 0) * sk;
        const armRx = gait.armR * swingScale + (offR?.pitch ?? 0) * sk;
        armL.root.rotation.x = armLx;
        armR.root.rotation.x = armRx;
        // v8g：肘朝身前折（负号）；顺手修旧版 armR 误用 gait.armL 的取值
        armL.joint.rotation.x = -(0.18 + armLx * 0.2) + (offL?.elbow ?? 0) * sk;
        armR.joint.rotation.x = -(0.18 + armRx * 0.2) + (offR?.elbow ?? 0) * sk;
        // 手臂 roll / yaw 每帧归零：applyCombatPose 的大剑双手分支会写这两项
        armL.root.rotation.z = (offL?.roll ?? 0) * sk;
        armR.root.rotation.z = (offR?.roll ?? 0) * sk;
        armL.root.rotation.y = (offL?.yaw ?? 0) * sk;
        armR.root.rotation.y = (offR?.yaw ?? 0) * sk;
        // 骨盆起伏 / 左右重心转移 / 侧倾统一写在共享 pelvis 上：
        // 上下半身由层级自动联动，不必再分别给两个并列组手动对齐同一份位移。
        pelvis.position.x = gait.pelvisX;
        pelvis.position.y = legLen + gait.pelvisY;
        // v9q：惯性位移不写在这里（IK 基准之前），改到下方 captureIKBase 之后叠加
        pelvis.position.z = 0;
        pelvis.rotation.z = gait.pelvisRoll;
      }

      // ---- v8g IK 基准：步态层刚写完、还没被上层程序动画推走的骨盆 / 下盘 ----
      // 受击后坐 / 落地缓冲 / 攻击跨步 / 惯性下沉都会改写这些值，末尾的 IK 层
      // 会把差值吸收进髋 / 膝角，让脚仍踩在步态决定的落点上。
      const ikBase = captureIKBase(pelvis, lower);
      // v9s：本帧实际采用的 IK 配置。
      //  - 停步惯性期间强制 weight=1：默认 0.9 会留下约 10% 的水平钉地残差，
      //    满权重才能让 applyFootIK 把脚精确拉回「未位移」的锚点；
      //  - 原地转身期间 weight=0：转身本来就是脚在挪，钉死反而看不到踏步；
      //  - 其余帧沿用全局配置（enabled=false 时整层降级，见下）。
      const ikCfg = turnActive
        ? { ...ikConfig, weight: 0 }
        : inStop && ikConfig.enabled
          ? { ...ikConfig, weight: 1 }
          : ikConfig;
      const ikW = ikCfg.enabled && c.grounded && ikCfg.weight > 0
        ? clamp(ikCfg.weight, 0, 1) * (attacking ? clamp(ikCfg.attackScale, 0, 1) : 1)
        : 0;

      // 1.1) v9s：停步惯性 —— 身体（骨盆 + 下半身）一起被惯性带走，脚由 IK 拉回原位。
      // 旧版给 lower 等量反向补偿（脚净位移 0），结果下半身完全不动、只有骨盆 / 上身
      // 前移，观感就是「上身和下半身分离」。现在水平方向 lower 不再补偿：它是 pelvis
      // 的子节点，会随骨盆一起走，上下半身同步；脚的世界位置多出 (dx, dz)，由
      // applyFootIK（base 捕获的是未位移的脚位）反解髋膝角精确拉回。
      //
      // 垂直下沉必须单独补偿，不能只靠 IK：骨盆下沉后 hip 也变低，原脚位锚点相对 hip
      // 超出了腿的臂展（l1+l2），IK 解被 clamped，脚仍会陷进地面 —— 这正是用户反馈的
      // 「下沉导致脚步穿地」。给 lower 等量抬回，相当于一根「不跟随下沉的 IK 辅助基准」，
      // 无需真的增加辅助骨骼。IK 全局关闭时水平位移也降级为反向补偿，保证脚不滑。
      pelvis.position.x += stopBodyX;
      pelvis.position.z += stopBodyZ;
      pelvis.position.y -= stopBodyDip;
      lower.position.y += stopBodyDip;
      if (ikW <= 0) {
        lower.position.x -= stopBodyX;
        lower.position.z -= stopBodyZ;
      }
      // v9s.55：斜跨的下沉 / 重心侧移同样写在 IK 基准之后 —— 锚点取的是「还没沉、
      // 还没偏」的脚位，所以脚被钉在原地，IK 把差值反解成承重腿的屈膝与髋侧摆。
      // 写进步态层（pelvisY / pelvisX）会连脚一起搬走，等于把走歪的落点当成正确落点。
      if (idleSink > 0 || idleShift !== 0) {
        pelvis.position.y -= idleSink;
        lower.position.y += idleSink * (1 - clamp(ikW, 0, 1));
        pelvis.position.x += idleShift;
        if (ikW <= 0) lower.position.x -= idleShift;
      }

      // 1.5) v8g 惯性分层：盆骨带一点倾斜 + 小幅重心平移 + 移动时略微下沉。
      // 旧版只把惯性倾到 upper，盆骨完全不动，像「上身自己往前折」。现在同一份惯性
      // 在盆骨上取小比例（腿只带一点点），并让跑动时重心压低；脚由 IK 钉地。
      const speedRatio = speed / Math.max(moveSpeed, EPS);
      wristSpeedRatio = speedRatio;
      const crouchRate = Number.isFinite(leanCfg.crouchSmoothing) ? leanCfg.crouchSmoothing : 8;
      const kc = 1 - Math.exp(-Math.max(0, crouchRate) * dt);
      crouchSmooth += (clamp(speedRatio, 0, 1) - crouchSmooth) * kc;
      const inertia = solveInertiaPose(
        { leanForward, leanSide, speedRatio: crouchSmooth }, leanCfg,
      );
      pelvis.rotation.x += inertia.pelvisPitch;
      pelvis.rotation.z += inertia.pelvisRoll;
      pelvis.position.x += inertia.pelvisX;
      pelvis.position.z += inertia.pelvisZ;
      pelvis.position.y -= inertia.crouch;
      // IK 关闭时把下沉量补偿回下盘，脚不穿地；IK 开启时由锚定层吸收（腿自然屈膝）。
      lower.position.y += inertia.crouch * (1 - clamp(ikW, 0, 1));
      // v9s.52：驼背体型的**常驻屈膝**。和 crouch 同一套机制 —— 骨盆整体下沉，
      // 足部 IK 把脚钉回地面，膝盖就被「压」出一个固定前屈角。
      // 不用额外写膝角：IK 已经知道脚该在哪，写死角度反而会跟步态 / 受击打架。
      if (kneeSink > 0) {
        pelvis.position.y -= kneeSink;
        lower.position.y += kneeSink * (1 - clamp(ikW, 0, 1));
      }

      // 1.7) v9s.64 基础体态 · 骨盆升降 / 后坐。
      //   为什么在惯性层之后、战斗姿态之前：它是一个**静止基准**，不能被攻击姿态的
      //   混合权重稀释成「打起来就消失」；同时步态已经写完 pelvis，叠加不会互相覆盖。
      //   为什么抬得动：足 IK 在 4) 才跑，骨盆抬 / 沉都会反解成屈膝，脚仍钉在地面。
      //   ⚠ 硬边界：两骨 IK 的可达上限 = legLength，而默认站姿已经用满（腿是直的），
      //   所以 pelvisLift 单独用会让脚离地；必须配 pelvisDrop 先屈膝换行程。
      if (posture && ((posture.pelvisLift ?? 0) !== 0 || (posture.pelvisDrop ?? 0) !== 0
        || (posture.pelvisBack ?? 0) !== 0)) {
        const lift = (posture.pelvisLift ?? 0) - (posture.pelvisDrop ?? 0);
        pelvis.position.y += lift;
        pelvis.position.z -= posture.pelvisBack ?? 0;   // 正 = 后坐（-Z 是屁股方向）
        // IK 关闭时把升降补回下盘，脚不跟着飞（与 crouch / kneeSink 同一处理）
        lower.position.y -= lift * (1 - clamp(ikW, 0, 1));
      }

      // 2) 战斗姿态覆盖（只在攻击 / 蓄力 / 停顿期间生效）
      //    v9s.29：进出战斗各有一段交叉淡入淡出 —— 先记下「不打这一击时的待机姿态」，
      //    写完战斗姿态后按权重混合，待机 ↔ 起手 / 收招不再单帧换姿势。
      const combatActive = combat.phase !== 'idle'
        || (combat.charging && combat.weapon === 'bow');
      // v9s.55：战斗姿态的进出改成「跟阶段等长」。
      //
      // 旧版淡入固定 0.1s、淡出固定 0.16s，与动作本身的节奏无关：剑盾 windup 只有
      // 0.09s，0.1s 淡入等于整个起手都在混合里（永远走不到蓄势帧）；大剑 windup 0.16s
      // 却只给 0.1s，从垂手到高举 1.5 rad 被压进 6 帧 —— 读起来是「啪一下抬手」。
      // 现在起手跨满 windup、收招跨满 recovery（+ 半个 settle），交叉淡出就是动作本身。
      const fadeTarget = (combatActive
        && combat.phase !== 'recovery' && combat.phase !== 'settle') ? 1 : 0;
      const poseIn = Number.isFinite(swingCfg.poseIn) ? (swingCfg.poseIn as number) : 0.1;
      const poseOut = Number.isFinite(swingCfg.poseOut) ? (swingCfg.poseOut as number) : 0.16;
      const windupDur = Math.max(0.02, combat.timings.windup);
      const recoverDur = Math.max(0.02, combat.timings.recovery + combat.timings.settle * 0.5);
      // 显式配 0 = 关掉过渡（A/B 对照用，等价于硬切）；否则与阶段等长
      // 起手只占 windup 的前 75%：剩下 1/4 留在蓄势帧上，「抬手 → 定住 → 挥出」
      // 才有节奏。淡入铺满整个 windup 的话，蓄势姿态刚到位就开始挥，等于没有蓄势。
      const fadeDur = fadeTarget > combatPoseW
        ? (poseIn <= 0 ? 1e-3 : clamp(Math.max(poseIn, windupDur * 0.75), 0.05, 0.30))
        : (poseOut <= 0 ? 1e-3 : clamp(Math.max(poseOut, recoverDur * 0.85), 0.08, 0.42));
      if (combatPoseW !== fadeTarget) {
        const step = dt / fadeDur;
        combatPoseW = clamp(
          combatPoseW + (fadeTarget > combatPoseW ? step : -step), 0, 1,
        );
      }
      if (combatPoseW > 0 || combatActive) captureBasePose();
      applyCombatPose(combat, dt);
      // 只在「过渡中」混合：w=1 是恒等，w=0 时上面已经写完待机姿态，
      // 再拿上一帧的快照混一次会把旧姿态糊回来（快照只在非零权重时刷新）。
      if (combatPoseW > 0 && combatPoseW < 1) blendCombatPose(combatPoseW);
      // v9s.32：躯干朝向的持械偏移。攻击权重越高，这部分越让位给挥击姿态，
      // 收招时再随 combatPoseW 淡回 —— 不额外引入一条淡入淡出时间轴。
      if (stanceCfgNow) {
        const w = (1 - combatPoseW) * stanceWeight;
        upper.rotation.y += (stanceCfgNow.torsoYaw ?? 0) * w;
        upper.rotation.x += (stanceCfgNow.torsoPitch ?? 0) * w;
      }
      // 2.05) 法杖引导姿态：不进近战状态机，在基础步态之上单独叠加（v7c #12）
      applyChannelPose(channeling, c.gaitPhase);
      // 2.06) v9a 派生招姿态（举盾前撞）：与 combat.phase 正交，按 link.progress 独立驱动
      applyLinkPose(link);

      // 2.1) 大剑移动拖地：非攻击且正在移动时，把剑身额外俯放，剑尖贴近地面。
      //      攻击时 dragAngle 平滑归零，剑回到双手持握基准姿态。
      //      挂点角本身在 3.6（腕部之后）统一写，那里才能拿到完整的手臂链。
      const greatOn = combat.weapon === 'greatsword';
      const sp = Math.hypot(c.velocity.x, c.velocity.z);
      const wantDrag = greatOn && combat.phase === 'idle' && sp > 0.5;
      const dragTarget = wantDrag ? Math.min(1.15, sp / Math.max(moveSpeed, 0.001) * 0.9) : 0;
      dragAngle += (dragTarget - dragAngle) * (1 - Math.exp(-6 * dt));
      // 记下「姿态层刚写完、惯性 / 受击还没叠」的躯干俯仰：
      // 剑身仰角要抵消的是它，而不是把后续的受击后仰也一起抵消掉。
      const torsoPitchForBlade = upper.rotation.x;

      // 2.2) 弓 / 箭「向前 90°」补偿：持弓左臂前伸、拉弦右臂抬肘累计约 90° 俯仰，
      //      会把弓面和搭在弦上的箭转成朝天 / 朝地。这里抵消手臂的 X 旋转，
      //      让弓面正对前方、箭沿身体 +Z 指向正前方（后拉仍沿局部 -Z，语义不变）。
      if (combat.weapon === 'bow') {
        bowModel.g.rotation.x = -(armL.root.rotation.x + armL.joint.rotation.x);
        arrowModel.rotation.x = -(armR.root.rotation.x + armR.joint.rotation.x);
      }

      // 2.5) 受击分层覆盖（v8f）。先记下攻击旋身角：头部补偿只抵消「主动旋身」，
      //      受击带来的肩部扭转应让头跟着一起偏，不该被 headPivot 反向抵消。
      const combatSpin = upper.rotation.y;
      applyHurt(hurt, c.bodyYaw);

      // 2.6) 移动惯性倾斜叠加：启动前倾 / 刹车后仰 / 绕圈侧倾。
      //      受击时减半，避免与受击后仰打架；攻击时速度差分很小，倾斜自然趋零。
      const leanScale = hurt.type === 'none' ? 1 : 0.4;
      // v9p：停步惯性让上身跟着微微前倾，随脉冲两端归零
      upper.rotation.x += leanForward * leanScale + stopChest;
      // 侧移时的程序化身体侧倾（v8）与惯性侧倾叠加；受击时同样减半
      upper.rotation.z += (leanSide + gait.sideLean) * leanScale;

      // 2.7) v8c 跳跃 / 落地蓄力缓冲：纯姿态「叠加」，绝不写 Core 的 position / velocity。
      //  屈膝 + 髋前倾让脚大致留在原地，重心下沉 + 上半身前倾形成「蓄力吸收冲击」，
      //  脉冲由 Core 时间归一化，结束后自动归零、完全交还给步态 / 攻击层。
      if (landPulse > 0) {
        legL.root.rotation.x -= landCfg.hipPitch * landPulse;
        legR.root.rotation.x -= landCfg.hipPitch * landPulse;
        legL.joint.rotation.x += landCfg.kneeBend * landPulse;
        legR.joint.rotation.x += landCfg.kneeBend * landPulse;
        // v8f：下沉写在共享骨盆；下盘相对骨盆反向补偿，脚只跟着下沉 lowerScale 的比例
        pelvis.position.y -= landCfg.crouchDepth * landPulse;
        lower.position.y += landCfg.crouchDepth * (1 - landCfg.lowerScale) * landPulse;
        upper.rotation.x += landCfg.upperPitch * landPulse;
        armL.root.rotation.x -= landCfg.armTuck * landPulse;
        armR.root.rotation.x -= landCfg.armTuck * landPulse;
      }

      // 2.8) v8d 挥击跨步层（受 lowerBodyWeight 控制）：所有武器 / 所有攻击段统一叠加。
      //  由 attackProgress 派生、连击左右脚交替领先，两端自动归零不残留；
      //  只写腿与骨盆（下盘），上半身跨步仍由 applyStep 负责，避免重心重复下沉。
      if (attackLegWeight > 0 && c.grounded) {
        const stride = attackStridePose(combat.attackProgress, attackStepIndex, animCfg.stride);
        const s = attackLegWeight;
        legL.root.rotation.x += stride.legL.pitchX * s;
        legR.root.rotation.x += stride.legR.pitchX * s;
        legL.root.rotation.z += stride.legL.rollZ * s;
        legR.root.rotation.z += stride.legR.rollZ * s;
        legL.joint.rotation.x += stride.legL.kneeX * s;
        legR.joint.rotation.x += stride.legR.kneeX * s;
        pelvis.position.x += stride.pelvisX * s;
        pelvis.position.y += stride.pelvisY * s;   // 负值 = 重心下沉
        pelvis.rotation.z += stride.pelvisRoll * s;
      }

      // 2.85) v9s.23 肩部（上臂根部）位移：必须在手臂角度全部写完之后，
      //   否则读到的是上一帧的俯仰，耸肩会慢一帧；又必须在副手 IK 之前，
      //   否则 IK 会用旧肩点解算，握点差一个肩位移。
      applyShoulderPose(attacking, combat.weapon);

      // 2.88) v9s.33 自动重心修正：把骨盆（带着整个上半身）往质心偏的那一侧挪回几毫米。
      //   只处理侧向（前后要靠跨步）；幅度上限 4.5cm，且随 `autoCounter` 关闭。
      if (balanceCfg?.enabled && balanceCfg.autoCounter && Math.abs(balanceShift) > 1e-4) {
        pelvis.position.x += balanceShift;
      }

      // 2.9) v9s.22 四肢 squash & stretch：放在所有姿态层之后、朝向与 IK 之前。
      //  形变只影响骨骼长度与粗细，不写 position / rotation，所以不会和受击、跨步、
      //  落地缓冲打架；足部 IK 在下一步读 footTip 世界坐标，读到的是形变后的脚位。
      if (stretchCfg.enabled) {
        const swinging = combat.phase !== 'idle' && !combat.charging;
        const sw = swinging ? swingCurve(combat.attackProgress) : 0;
        // 「砍到底」的拐点：swing 从高位掉头向下 —— 与 Core 的 active 末段一致。
        // 用它当命中脉冲，不需要从 Core 借事件通道，也不会漏掉空挥（空挥也该有回弹）。
        if (swinging && prevSwingVal > 0.55 && sw < prevSwingVal - 1e-4) impactPulse = 1;
        prevSwingVal = sw;
        impactPulse = decayImpact(impactPulse, dt, stretchCfg.impactDecay);
        const target = solveStretch(
          {
            swing: sw,
            charge: combat.charging ? combat.charge : 0,
            impact: impactPulse,
            speedRatio,
            grounded: c.grounded,
          },
          stretchCfg,
        );
        lastStretch = smoothStretch(lastStretch, target, dt, stretchCfg.smoothing);
      } else {
        lastStretch = { ...NEUTRAL_STRETCH };
      }
      applyStretchPose(lastStretch);

      // 3) 朝向三段分离：root 已由 three-scene 设为 bodyYaw
      //    下盘 = 上面算出的连续 hipYaw（v8b：跟随移动方向带转，但绝不跨 ±π 跳变）；
      //    头部先于身体转向目标（补偿攻击旋身，仍用 wrapAngle 走最短弧，但其限幅很小、
      //    受 headTurnRate 平滑，不会造成可见跳变）。
      // v9s.55：站定时下半身斜对前方一点（斜跨），走路时 idleHipYaw 精确为 0
      lower.rotation.y = hipYaw + idleHipYaw;
      // v9o：胸随下盘按配置比例带转（下盘转得多、胸转得少），避免「只有腿在偏、
      // 上身还正对前方」的拧巴感。hipYaw 已平滑，线性缩放不会引入跳变。
      chestYaw = chestYawFromHip(hipYaw, gaitCfg.chestYawScale, gaitCfg.chestYawMaxDeg);
      // v9s.66：这里**不再直接写 upper**，改到 splitSpine 之后按腰 / 胸分账（见 3.01）。
      //   原因：写进 upper 会被 splitSpine 按腰 / 胸（58/42）摊掉，胸段实际只吃到
      //   `chestYaw × 0.42`（40° 下盘 → 胸只转 10°），看起来「胸的朝向根本没变」，
      //   而腿根却跟着下盘转满 40°。分账之后总角不变，胸段吃大头。
      // 只补偿主动攻击旋身，不含受击扭转（见 2.5 说明）；v9o 再补偿胸偏转，
      // 让头仍朝 Core 给的 headYaw（目标方向）而不是跟着胸一起偏走。
      const spin = combatSpin;
      headYawTarget.rotation.y = wrapAngle(c.headYaw - c.bodyYaw - spin - chestYaw);
      // v9s.18：俯仰注视。Core 给的 headPitch 以「+ = 抬头」为正，three 的 rotation.x
      // 正值是低头（+Z 转向 -Y），所以取反。身体只吃其中一小部分（bodyPitch），
      // 叠加在上面的惯性前倾之上 —— 「整个人抬眼看」，而不是头单独在脖子上折。
      headPivot.rotation.x = -clamp(c.headPitch ?? 0, -0.7, 0.7);
      upper.rotation.x += -clamp(c.bodyPitch ?? 0, -0.4, 0.4);
      // v9s.52：驼背是**体态的基准**，不是动作 —— 叠加在所有动态层之后、脊柱拆分之前，
      // 于是它会被 splitSpine 按腰 / 胸权重拆成两段弯折（看起来是「弓着」而不是「整根斜」）。
      // 头再反向抬起来一点：驼背 18° 时脸会朝地，老人是「弓着腰但抬眼看人」。
      if (hunch > 0) {
        upper.rotation.x += hunch;
        headPivot.rotation.x -= hunch * 0.55;
        // 头前伸：驼背的人脖子会往前探，不是原地低头（下面归零区每帧复位）
        headPivot.position.z = hunch * 0.10;
      }

      // 2.96) v9s.64 基础体态 · 躯干俯仰 / 弓腰 / 头。与 hunch 同一个插入点
      //   （动态层全部写完、splitSpine 之前），所以两者可以叠加而不是互相覆盖。
      //   pitch 进 splitSpine 摊成腰 + 胸的弧；waist 在拆分之后单独折腰段（见下方 3.0）。
      if (posture) {
        // 姿态预算（v9s.64）：动态层已经吃掉多少前倾，体态只能用剩下的空间。
        // 不做这件事的后果是实测到的：挥砍自带 ~30° 前压，叠在 65° 体态上 = 95°，
        // 画面读作「整个人扑倒在地」，而且头会插进地面。
        // 攻击期间只保留一半体态（`keep`），再被 `maxTotal` 夹一次 —— 夹完的头要
        // 用**实际吃进去的角度**反算抬头量，否则体态被夹掉多少，脸就朝上多少。
        const keep = 1 - clamp(attackBlend, 0, 1) * 0.5;
        const room = Math.max(0, POSTURE_MAX_TOTAL - upper.rotation.x);
        const applied = posturePitch > 0
          ? Math.min(posturePitch * keep, room)
          : posturePitch * keep;
        upper.rotation.x += applied;
        postureAppliedPitch = applied;
        // 腰折同样受 keep 影响；具体角度在 splitSpine 之后写（那里才是腰段）。
        postureAppliedWaist = postureWaist * keep;
        // 头反向抬：pitch 60° 时脸会直接朝地，headLift=1 才把视线拉回水平。
        headPivot.rotation.x -= (applied + postureAppliedWaist) * (posture.headLift ?? 0);
        // 前倾的颈椎会把头送到胸口前方；reach 让脖子真的伸出去，而不是头留在原地转。
        headPivot.position.z = (posture.headReach ?? 0) * keep;
        headPivot.position.y = headPivotBaseY - (posture.neckDrop ?? 0);
      }

      // v9s.33：躯干总角在此刻已经写完（步态 / 受击 / 惯性 / 持械 / 朝向）。
      // 拆分必须早于腕部与剑身反解 —— 它们读的是「躯干实际朝到哪」。
      splitSpine();

      // 3.01) v9s.66 胸随下盘带转 · 分账。
      //   总角必须与旧版完全一致（`torsoYaw()` 的读数、帧尾泄漏守卫、既有测试都按总角验收），
      //   变的只是「腰吃多少、胸吃多少」：默认 0.7 给胸段 —— 人转体主要发生在胸椎，
      //   腰跟着扭反而是崴腰。之前写进 upper 再拆分，实际是腰 58% / 胸 42%。
      //   为什么在 splitSpine 之后写：拆分之前写进去就会被 58/42 摊掉，这正是问题本身。
      if (chestYaw !== 0) {
        if (spineOn) {
          const yawChest = clamp(spineCfg!.yawChest ?? 0.7, 0, 1);
          upper.rotation.y += chestYaw * (1 - yawChest);
          chest.rotation.y += chestYaw * yawChest;
          if (intendedTorso) intendedTorso.y += chestYaw;
        } else {
          upper.rotation.y += chestYaw;
        }
      }

      // 3.0) v9s.64 弓腰：拆分之后再把 waist 折在腰段（`upper` 就是腰段的节点）。
      //   为什么不在拆分前加：那会被 42/58 摊到胸段，读起来是「整根斜」而不是「腰塌了」。
      //   为什么必须回写 intendedTorso：帧尾的泄漏守卫拿它比对总角，
      //   少记这一笔就会被当成「有人在 split 之后把 upper 当总角写」。
      if (postureWaist !== 0 && postureAppliedWaist !== 0) {
        upper.rotation.x += postureAppliedWaist;
        if (intendedTorso) intendedTorso.x += postureAppliedWaist;
      }

      // 3.1) v9s.65 手臂回正。躯干压平之后上臂跟着**胸段**一起倒向地面，
      //   手垂到脚边、武器戳进土里（实测：肩到手几乎贴在小腿上）。
      //   这里让上臂反向转回来，保持「肩 → 手」接近竖直。
      //
      //   为什么读 `chest.rotation.x` 而不是体态总角：肩挂在胸段上，手臂实际吃到的
      //   就是这一段的角度（腰段 42% 已经由 `upper` 吃掉，不影响肩）。用总角会过补偿，
      //   高前倾时手会反过来举到头顶。
      //   为什么系数不给 1：完全抵消会把胳膊转进胸腔里。0.55 是「手落在身前」。
      //
      //   为什么放在 splitSpine 之后：拆分之前还读不到胸段角。
      const armDrop = posture?.armDrop ?? 0;
      if (armDrop > 0 && chest.rotation.x > 1e-4) {
        const back = chest.rotation.x * armDrop;
        // v9s.66：在模型空间里往回压。局部 X 只在「胸段没偏航」时才指向角色左右；
        // 走路带转 / 攻击旋身之后局部 X 已经歪了，`rotation.x -= back` 会变成斜着掰手臂 ——
        // 鱼人这种扁宽躯干上尤其明显（手会朝侧前方支出去）。
        pitchInModelSpace(armL.root, root, -back);
        pitchInModelSpace(armR.root, root, -back);
      }

      // 3.4) v9s.24 腕部滞后：放在朝向 / 胸偏转之后 —— 它读的就是「躯干已经转到哪」，
      //      早一步读会漏掉 chestYaw，横向甩动就只在攻击时才有、走路时没有。
      //      又在副手握持之前 —— 握持 IK 取的是柄的世界坐标，腕部一摆，柄就动了。
      // 传 frameDt 而不是 clamp 过的 dt：暂停 / 命中定格时 frameDt 为 0，
      // 腕部必须真正冻结（clamp 后的 dt 下限是 1/240，会漏出微小抖动）。
      applyWrist(frameDt, combat.comboIndex);

      // 3.55) v9s.25 剑身仰角反解：数据给的是「剑离水平面多少度」，
      //       这里按实际手臂链换算成挂点角。必须在腕部之后、副手握持之前 ——
      //       腕滞后是链上的一环，副手 IK 又取柄的世界坐标。
      // 体态是 3.0 之后才写进躯干的，这里把它加回「剑要抵消多少俯仰」——
      // 只加**实际吃进去**的量（预算夹过的），否则高前倾时剑会反过来指向天空。
      applyBladeTarget(combat, torsoPitchForBlade + postureAppliedPitch + postureAppliedWaist);

      // 3.5) v9s.22 副手握持：必须在朝向 / 胸偏转都写完之后解算 ——
      //  上半身一转动，柄的世界位置就变了，早一步解会「握在空气里」。
      //  只在双手武器挥击期间接管，其余时间（走路 / 收刀）保持步态摆臂。
      const gripPhase = combat.weapon === 'greatsword' && !combat.charging
        && (combat.phase !== 'idle' || combatPoseW > 0);
      if (gripPhase) {
        root.updateWorldMatrix(true, true);
        // v9s.23：起手就给 0.65 的 IK 权重，避免「剑还没握住就挥了」。
        // v9s.29：进入战斗姿态改成 0.1s 交叉淡入后，0.65 的权重会让左手在淡入期间
        // 停在离柄轴 0.23m 的空中（旧版是硬切，第一帧姿态已经到位，所以看不出来）。
        // 双手武器从起手到收招本来就该是握死的：攻击期间权重给满，只在收招淡出时
        // 随 combatPoseW 松开 —— 松开的过程本身就是「手离开剑柄」。
        const gripW = combat.phase === 'idle'
          ? Math.max(combatPoseW, attackBlend)
          : 1;
        applySecondaryGrip(clamp(gripW, 0, 1), dt);
      }

      // 4) v8g 足部 IK 锚定：放在所有姿态层之后，把「骨盆被额外推走」的差值
      //    反解进髋 / 膝角。空中不钉脚（让腿随身体收起）；enabled=false 时整层跳过，
      //    精确回到旧 FK 姿态，调试面板可直接 A/B 对照。
      lastIK = applyFootIK({
        root, pelvis, lower,
        limbs: ikLimbs,
        base: ikBase,
        cfg: ikCfg,
        grounded: c.grounded,
        attacking,
        // 地板兜底：锚点低于角色脚下地面时顶回去（否则 IK 会把脚钉在地里）
        groundY: c.position?.y,
      });

      // 5) v9s.33：平衡读数放在最后 —— 质点位置要读 IK 之后的真实脚位 / 手位。
      updateBalance(c, dt);

      // 5.5) v9s.54：胡子摆动。两个通道，都是**本帧差分**，与步态 / 攻击解耦：
      //      pitch（rotation.x）= 前后：起步往后甩、急停往前栽；
      //      roll （rotation.z）= 左右：侧移 / 转身的切向 / 手臂避让。
      //      速度先投影到角色局部，否则「原地转身」会被当成一次纵向加速。
      if (beardState && beardPivots.length === 3) {
        const yaw = c.bodyYaw ?? 0;
        const sy = Math.sin(yaw);
        const cy = Math.cos(yaw);
        const vx = c.velocity?.x ?? 0;
        const vz = c.velocity?.z ?? 0;
        const vF = vx * sy + vz * cy;     // 纵向分量（正 = 朝前）
        const vR = vx * cy - vz * sy;     // 横向分量（正 = 朝角色右侧）
        const h = Math.max(dt, 1e-4);
        const aF = (vF - lastBeardF) / h;
        const aR = (vR - lastBeardR) / h;
        // yaw 差分必须回绕：±π 处直接相减会冒出几千 rad/s 的假转身
        const dYaw = Math.atan2(Math.sin(yaw - lastBeardYaw), Math.cos(yaw - lastBeardYaw));
        const yawRate = clamp(dYaw / h, -14, 14);
        lastBeardF = vF;
        lastBeardR = vR;
        lastBeardYaw = yaw;
        // 转身的切向加速度 ≈ ω × r；r 取胡子质心到颈轴的水平距离（约 0.18m）。
        // 系数 30 是「让人真能看出来」的观测量：6 rad/s 的急转 → 稳态约 14°。
        const spinA = yawRate * 0.18 * 30;
        const avoid = beardAvoid();
        // 死区：站定时 Core 仍会有毫米级的速度 / 朝向收敛，不让它们把胡子慢慢推歪
        const ang = solveBeard(
          beardState, dt,
          deadzone(clamp(aF * 0.3 - avoid.pitch, -9, 9)),
          // 横向通道的上限单列：前后摆受步态影响大，横向（尤其转身）需要更大的行程
          // aR 取负：向右加速时胡子因惯性往**左**拖（rotation.z 正 = 下端向角色右侧）
          deadzone(clamp(-aR * 0.5 + spinA + avoid.roll, -26, 26)),
        );
        for (let i = 0; i < 3; i++) {
          beardPivots[i].rotation.x = ang.pitch[i];
          beardPivots[i].rotation.z = ang.roll[i];
        }
      }

      // 5.6) v9s.54：静止呼吸。只在几乎站定时叠加，幅度 2% 躯干厚度 ——
      //      再大就成「喘」。写 scale 不写旋转：不会与脊柱拆分 / 足部 IK 抢同一根骨头。
      if (breathOn) {
        breathT += dt;
        const idleW = clamp(1 - speed / 0.6, 0, 1);
        torso.scale.z = 1 + Math.sin(breathT * 1.4) * 0.02 * idleW;
      }

      // 6) v9s.34：脊柱拆分一致性守卫。
      //    splitSpine() 之后任何一层再把 `upper` 当总角写（少 42%）都会被这里抓到：
      //    残差写进 spineDebug().leak，测试里断言为 0，线上调试面板也能看到。
      if (spineOn && intendedTorso) {
        const t = torsoTotal();
        spineLeak = Math.max(
          Math.abs(t.pitch - intendedTorso.x),
          Math.abs(t.yaw - intendedTorso.y),
          Math.abs(t.lean - intendedTorso.z),
        );
      } else {
        spineLeak = 0;
      }
    },
    lean(): { forward: number; side: number } {
      return { forward: leanForward, side: leanSide };
    },
    landing(): {
      pulse: number; remaining: number; kind: 'none' | 'land' | 'jump'; impactVy: number;
    } {
      const pulse = pulseValue(lastNow, pulseStart, pulseDuration, pulseStrength, pulseCompress);
      const remaining = pulseDuration > 0
        ? Math.max(0, pulseDuration - Math.max(0, lastNow - pulseStart))
        : 0;
      return {
        pulse,
        remaining,
        kind: pulse > 0 ? pulseKind : 'none',
        impactVy: lastImpactVy,
      };
    },
    hurt(): HurtPose {
      return lastHurtPose;
    },
    ik(): IKDiagnostics {
      return lastIK;
    },
    stretch(): StretchPose & { impact: number } {
      return { ...lastStretch, impact: impactPulse };
    },
    gripDebug() {
      return { ...lastGrip };
    },
    weaponDebug() {
      return { wristPitch, wristTwist };
    },
    setClipT(t: number | null) {
      clipLabT = t === null || !Number.isFinite(t) ? null : Math.max(0, Math.min(1, t));
    },
    stanceDebug() {
      const offR = stanceCfgNow?.armR;
      const offL = stanceCfgNow?.armL;
      const k = stanceCfgNow ? stanceWeight : 0;
      return {
        weapon: (currentWeapon ?? 'sword-shield') as WeaponId,
        weight: k,
        armL: {
          pitch: (offL?.pitch ?? 0) * k,
          yaw: (offL?.yaw ?? 0) * k,
          roll: (offL?.roll ?? 0) * k,
          elbow: (offL?.elbow ?? 0) * k,
        },
        armR: {
          pitch: (offR?.pitch ?? 0) * k,
          yaw: (offR?.yaw ?? 0) * k,
          roll: (offR?.roll ?? 0) * k,
          elbow: (offR?.elbow ?? 0) * k,
        },
        torsoYaw: (stanceCfgNow?.torsoYaw ?? 0) * k,
        torsoPitch: (stanceCfgNow?.torsoPitch ?? 0) * k,
        bladePitchDeg: (stancePitch * 180) / Math.PI,
        bladePitchOffDeg: (stancePitchOff * 180) / Math.PI,
        armSwing: stanceCfgNow?.armSwing ?? 1,
      };
    },
    swingDebug() {
      const p = swingPose;
      return {
        seg: swingSeg,
        kind: p?.kind ?? 'right-left',
        lead: p?.lead ?? 'R',
        yaw: p?.yaw ?? 0,
        rootYaw: p?.rootYaw ?? 0,
        spinYaw: p?.spinYaw ?? 0,
        rootTurn: lastRootTurn,
        pitch: p?.pitch ?? 0,
        roll: p?.roll ?? 0,
        strike: p?.strike ?? 0,
        poseW: combatPoseW,
        bladeTwist: p?.bladeTwist ?? 0,
        bladeTwistOff: p?.bladeTwistOff ?? 0,
        bladeYaw: p?.bladeYaw ?? 0,
        bladeYawOff: p?.bladeYawOff ?? 0,
        shoulderL: { x: lastShoulder.lx, y: lastShoulder.ly, z: lastShoulder.lz },
        shoulderR: { x: lastShoulder.rx, y: lastShoulder.ry, z: lastShoulder.rz },
      };
    },
    idleStance(): { weight: number; frontLeft: boolean; sink: number; shift: number } {
      return {
        weight: idleStanceW, frontLeft: idleFrontLeft,
        sink: idleSink, shift: idleShift,
      };
    },
    attackBlend(): number {
      return attackBlend;
    },
    attackWeights(): {
      gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
      /** v9s.41：本段跨步的起始相位 / 单调步序（验收「连段换腿」用） */
      strideBase: number; stepIndex: number;
    } {
      return {
        gaitScale: lastGaitScale,
        attackLegWeight,
        driveSpeed: lastDrive.speed,
        stridePhase: lastDrive.phase,
        strideBase: attackPhaseBase,
        stepIndex: attackStepIndex,
      };
    },
    hipYaw(): number {
      return hipYaw;
    },
    torsoTotal() {
      return torsoTotal();
    },
    postureDebug() {
      if (!posture) return null;
      root.updateWorldMatrix(true, true);
      const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
      const hip = new THREE.Vector3();
      const head = new THREE.Vector3();
      const fl = new THREE.Vector3();
      const fr = new THREE.Vector3();
      const dl = new THREE.Vector3();
      const dr = new THREE.Vector3();
      pelvis.getWorldPosition(hip).applyMatrix4(inv);
      headPivot.getWorldPosition(head).applyMatrix4(inv);
      head.y += HS / 2;   // 枢轴在颈根，加半个头才是「头的中心」
      legL.tip.getWorldPosition(fl).applyMatrix4(inv);
      legR.tip.getWorldPosition(fr).applyMatrix4(inv);
      dl.copy(fl).sub(hip);
      dr.copy(fr).sub(hip);
      // 头部子树的最低点：判断「前倾到头什么时候啃地」只看这一个数。
      // 不能量全骨架 —— 剑 / 盾在待机时就垂到地面以下 15cm，混进来判据立刻失效。
      let headLowY = Number.POSITIVE_INFINITY;
      const box = new THREE.Box3();
      headPivot.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        box.copy(o.geometry.boundingBox!).applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        if (box.min.y < headLowY) headLowY = box.min.y;
      });
      return {
        enabled: true,
        pitch: postureAppliedPitch,
        waist: postureAppliedWaist,
        hipY: hip.y,
        headY: head.y,
        headZ: head.z,
        footY: Math.min(fl.y, fr.y),
        // 两骨 IK 的可达上限 = legLength：>1 即脚被拉离地面
        reachL: dl.length() / Math.max(1e-6, legLen),
        reachR: dr.length() / Math.max(1e-6, legLen),
        headLowY,
      };
    },
    spineDebug() {
      if (!spineOn) return null;
      const t = torsoTotal();
      return {
        enabled: true,
        waistYaw: upper.rotation.y,
        chestYaw: chest.rotation.y,
        totalYaw: t.yaw,
        totalPitch: t.pitch,
        totalLean: t.lean,
        neckPitch: headPivot.rotation.x,
        /** v9s.34：帧尾一致性残差（应恒为 0；非 0 = 有人在 split 之后把 upper 当总角写） */
        leak: spineLeak,
      };
    },
    balanceDebug() {
      return lastBalance
        ? { ...lastBalance, shift: balanceShift, latDeficit: lastLatDeficit, lateralFf: lastLateralFf }
        : null;
    },
    gaitDebug() {
      return {
        stopT, hipYaw, chestYaw,
        speed: prevSpeed,   // update 末尾已刷新为本帧速度，供线上验收低速巡航
        gaitSpeed: lastGaitSpeed,
        stopStep: lastStopStep, stopShift: lastStopShift, stopDip: lastStopDip,
        /** v9s：停步偏差淡出系数（1=未消化，0=已归零）/ 原地转身踏步脉冲 */
        stopYawFade: lastStopYawFade, turnStep: lastTurnStep,
        /** v9s.33：腿部被真实步态接管的比例（0 = 攻击姿态，1 = 完全真实步态） */
        legTakeover: legTakeoverSm,
        legLPitch: lastLegs.lp, legLRoll: lastLegs.lr,
        legRPitch: lastLegs.rp, legRRoll: lastLegs.rr,
        phase: lastDrive.phase,
        dirF: dirDriveF, dirR: dirDriveR,
        hipYawTarget: lastHipYawTarget, spin: spinBlend,
        /** v9s.55：待机斜跨站姿（权重 / 前脚是否左 / 下沉 / 重心侧移） */
        idleW: idleStanceW, idleFrontLeft, idleSink, idleShift, idleHipYaw,
      };
    },
    gaitYaw(): number {
      return lastGaitYaw;
    },
    arrowDirection(): { x: number; y: number; z: number } {
      arrowModel.updateWorldMatrix(true, false);
      const e = arrowModel.matrixWorld.elements;
      // 第 3 列 = 变换后的局部 +Z；归一化去掉上游缩放影响
      const x = e[8];
      const y = e[9];
      const z = e[10];
      const len = Math.hypot(x, y, z) || 1;
      return { x: x / len, y: y / len, z: z / len };
    },
    weaponBlade() {
      if (!currentWeapon) return null;
      return readBlade(parts[currentWeapon].right);
    },
    bladesWorld() {
      if (!currentWeapon) return { right: null, left: null };
      return {
        right: readBlade(parts[currentWeapon].right),
        left: readBlade(parts[currentWeapon].left),
      };
    },
    dispose(): void {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
    },
  };
}
