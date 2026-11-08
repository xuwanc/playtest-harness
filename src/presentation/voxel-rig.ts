import * as THREE from 'three';
import { wrapAngle } from '../core';
import type {
  CharacterState, ColorConfig, CombatState, GaitViewConfig, HurtState, HurtViewConfig,
  IKViewConfig, LeanViewConfig, LinkState, LinkViewConfig, OrientationViewConfig,
  ProgramAnimViewConfig, SwingPoseViewConfig, TurnInPlaceState, VoxelConfig, WeaponId,
  WeaponMountConfig,
  WeaponWristViewConfig,
} from '../core';
import {
  solveGait, solveStopGait, nextFeetTogetherPhase, strafeHipYaw, backStrafeKeep,
  backHipYawTarget,
  stopBlendGate, chestYawFromHip, solveStopInertia, bodyLocalDir,
  stopYawFade, solveTurnStep,
} from './gait';
import type { GaitInput } from './gait';
import {
  attackBlendStep, attackGaitDrive, attackStridePose, landingImpactScale,
  poseWeights, pulseValue, scaleGaitPose,
} from './program-anim';
import type { GaitDrive } from './program-anim';
import { emptyHurtPose, solveHurtPose } from './hurt-pose';
import type { HurtPose } from './hurt-pose';
import { solveInertiaPose } from './inertia';
import { applyFootIK, captureIKBase, EMPTY_IK_DIAGNOSTICS } from './rig-ik';
import { blendIKAngles, solveTwoBoneIK } from './ik';
import type { IKDiagnostics, IKLimb } from './rig-ik';
import {
  decayImpact, NEUTRAL_STRETCH, smoothStretch, solveStretch,
} from './limb-stretch';
import type { StretchConfig, StretchPose } from './limb-stretch';
import { autoSegBlend, blendSwingPose, segEase, solveSwingPose } from './swing-pose';
import type { SwingPose } from './swing-pose';

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
    /** v9s.29：刃面滚转（主/副）与刃身外撇（主/副），验收「刃口是否迎着挥击方向」 */
    bladeTwist: number;
    bladeTwistOff: number;
    bladeYaw: number;
    bladeYawOff: number;
    shoulderL: { x: number; y: number; z: number };
    shoulderR: { x: number; y: number; z: number };
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
  gaitDebug(): {
    stopT: number; hipYaw: number; chestYaw: number; speed: number; gaitSpeed: number;
    /** v9p：停步惯性脉冲的前脚前伸量（rad）/ 身体前移量（m）/ 骨盆下沉量（m），未接管时为 0 */
    stopStep: number; stopShift: number; stopDip: number;
    /** v9s：停步偏差淡出系数（1=未消化，0=已归零）/ 原地转身踏步脉冲强度 */
    stopYawFade: number; turnStep: number;
    legLPitch: number; legLRoll: number; legRPitch: number; legRRoll: number;
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
type Leg = Limb & { tip: THREE.Object3D };

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

function makeBox(w: number, h: number, d: number, color: string): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color }),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function group(): THREE.Group {
  return new THREE.Group();
}

/**
 * 体素剑：柄 + 护手 + 刃 + 刃口亮边 + 尖，沿局部 +Y 伸出。
 *
 * 刃面竖直：挂点会把局部 +Y 前倒 swordPitchDeg（约 68°）指向 +Z 前方，
 * 此时局部 +Z 被转到世界「近似竖直」，局部 +X 仍水平。
 * 因此刀身必须「薄在 X、宽在 Z」，宽面才落在竖直面内（法线水平朝侧面）；
 * 若宽面在 X（旧版）则法线朝上，俯视下就是一片「水平躺着的刀刃」。
 * 刃口亮边贴在 +Z 侧（前倒后朝前下方），明确刀锋方向，不朝肩膀。
 */
function makeSword(len: number, width: number, colors: ColorConfig): THREE.Group {
  const g = group();
  const grip = makeBox(width * 0.7, 0.12, width * 0.7, colors.wood);
  grip.position.y = 0.06;
  g.add(grip);
  // 护手沿世界水平 X 张开，与竖直刃面垂直
  const guard = makeBox(width * 2.4, 0.045, width * 0.8, colors.metal);
  guard.position.y = 0.13;
  g.add(guard);
  // 薄在 X、宽在 Z → 刃面竖直
  const blade = makeBox(width * 0.38, len, width, colors.blade);
  blade.position.y = 0.13 + len / 2;
  g.add(blade);
  const edge = makeBox(width * 0.42, len * 0.96, width * 0.2, colors.bladeEdge);
  edge.position.set(0, 0.13 + len / 2, width * 0.5);
  g.add(edge);
  const tip = makeBox(width * 0.3, 0.09, width * 0.45, colors.blade);
  tip.position.y = 0.13 + len + 0.045;
  g.add(tip);
  return g;
}

/**
 * 大剑：与体素剑同构，但更长更宽，并额外加一段向下的「下段握柄」，
 * 让左手也能双手持握（右手握上段护手、左手握下段柄）。
 */
function makeGreatsword(colors: ColorConfig): THREE.Group {
  const g = makeSword(0.72, 0.15, colors);
  const lower = makeBox(0.12, 0.46, 0.12, colors.wood);
  lower.position.y = -0.3;
  g.add(lower);
  return g;
}

function makeShield(colors: ColorConfig): THREE.Group {
  const g = group();
  const plate = makeBox(0.32, 0.38, 0.06, colors.metal);
  plate.position.set(0, 0.02, 0.1);
  g.add(plate);
  const boss = makeBox(0.11, 0.11, 0.045, colors.blade);
  boss.position.set(0, 0.02, 0.145);
  g.add(boss);
  return g;
}

function makeStaff(colors: ColorConfig): { g: THREE.Group; orb: THREE.Mesh } {
  const g = group();
  const rod = makeBox(0.055, 0.88, 0.055, colors.wood);
  rod.position.y = 0.42;
  g.add(rod);
  const orb = makeBox(0.15, 0.15, 0.15, colors.glow);
  orb.position.y = 0.92;
  const mat = orb.material as THREE.MeshLambertMaterial;
  mat.emissive = new THREE.Color(colors.glow);
  mat.emissiveIntensity = 0.85;
  g.add(orb);
  return { g, orb };
}

/**
 * 体素弓：弓臂在 XY 平面弯曲（正面可见），等价于把旧版 YZ 平面的弓「向前旋转 90°」。
 * 旧版从 2.5D 俯视相机看只是一条竖边；现在能看到完整弓形。
 * 弓弦保持在 -Z（弓后），拉弦动画沿 -Z 后拉，语义不变。
 */
function makeBow(colors: ColorConfig): { g: THREE.Group; drawString: THREE.Mesh } {
  const g = group();
  for (let i = 0; i < 5; i++) {
    const y = (i - 2) * 0.15;
    const seg = makeBox(0.055, 0.16, 0.05, colors.wood);
    // 弓臂中段前凸、两端回收，弯曲幅度足够大才能在俯视下看出完整弓形
    seg.position.set(0.16 - Math.abs(y) * 0.46, y, 0);
    g.add(seg);
  }
  const drawString = makeBox(0.014, 0.66, 0.014, colors.blade);
  drawString.position.z = -0.06;
  g.add(drawString);
  return { g, drawString };
}

/** 箭沿局部 +Z 指向正前方；挂点会抵消手臂俯仰，避免蓄力时被抬到朝天 / 朝地。 */
function makeArrow(colors: ColorConfig): THREE.Group {
  const g = group();
  const shaft = makeBox(0.025, 0.025, 0.46, colors.wood);
  shaft.position.z = 0.23;
  g.add(shaft);
  const head = makeBox(0.055, 0.055, 0.09, colors.blade);
  head.position.z = 0.5;
  g.add(head);
  return g;
}

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
  const legLen = v.legLength;
  const armLen = v.armLength;
  const t = v.limbThickness;
  const bodyH = v.bodyHeight;
  const bodyW = v.bodyWidth;

  const torso = makeBox(bodyW, bodyH, 0.28, colors.body);
  torso.position.y = bodyH / 2;                 // 相对骨盆
  upper.add(torso);

  // 头部独立枢轴：绕脖子旋转，实现「头先于身体转向目标方向」
  const headPivot = group();
  headPivot.name = 'headPivot';                    // 供测试按名查找（不依赖 children 下标）
  // v9s.18：先转头（yaw）再点头（pitch）—— 顺序反了的话，头转到侧面时
  // 俯仰会绕世界 X 轴，看起来像在歪头。
  headPivot.rotation.order = 'YXZ';
  // 头部枢轴 = 躯干高度（配置值按标准体型写的 0.4）。瘦高体型躯干只有 0.24，
  // 直接沿用会让头飘在躯干上方 16cm，所以按 bodyHeight 夹一下。
  headPivot.position.y = Math.min(ori.headPivotHeight, bodyH);
  upper.add(headPivot);

  const head = makeBox(H, H, H, colors.head);
  head.position.y = H / 2;
  headPivot.add(head);

  // 眼睛：贴在 +Z 面，跟随头部枢轴，用于验收「面朝向」是否正确
  const eyeMat = new THREE.MeshLambertMaterial({ color: '#1b2733' });
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.02), eyeMat);
    eye.position.set(sx * 0.09, H / 2 + 0.03, H / 2 + 0.011);
    headPivot.add(eye);
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

    const shoe = makeBox(t * 1.15, 0.07, t * 1.7, colors.shoe);
    shoe.position.set(0, -legLen / 2 + 0.035, 0.045); // 脚尖朝 +Z
    knee.add(shoe);

    // IK 末端锚点：小腿末端（脚踝）。不含鞋的视觉偏移，FK / IK 才能精确互为逆运算。
    const tip = new THREE.Object3D();
    tip.name = 'footTip';
    tip.position.y = -legLen / 2;
    knee.add(tip);

    const ankle = group();
    return {
      root: hip, joint: knee, hand: ankle, wrist: ankle, tip,
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
    shoulder.position.set(sx * (bodyW / 2 + t / 2), bodyH - 0.04, 0); // 相对骨盆
    upper.add(shoulder);

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

    const palm = makeBox(t * 1.1, 0.09, t * 1.1, colors.head);
    palm.position.y = 0.045;
    hand.add(palm);

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

  // v8g：两骨 IK 的腿描述（大腿 / 小腿各 legLen/2，膝向后折）。
  // footTip 是本帧 FK 末端；rig-ik 直接用它取世界锚点，玩家与假人共用同一套解算。
  const ikLimbs: IKLimb[] = [legL, legR].map((leg) => ({
    root: leg.root,
    joint: leg.joint,
    tip: leg.tip,
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
  /** 进入攻击那一帧锁定的 Core gaitPhase，避免 lunge 位移造成双重相位推进 */
  let attackPhaseBase = 0;
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
  /** v9s：本帧原地转身踏步脉冲强度（诊断用） */
  let lastTurnStep = 0;

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
  /** 本帧喂给 solveGait 的四个等效驱动量（诊断用） */
  let lastDrive: GaitDrive = { speed: 0, phase: 0, localForward: 0, localRight: 0 };
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
      leg.tip.position.y = -leg.segLen * s.leg;
    }
    torso.scale.set(s.girthTorso, s.torso, s.girthTorso);
    torso.position.y = (bodyH / 2) * s.torso;
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
      const local = upper.worldToLocal(world);
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
      prevTorsoYaw = upper.rotation.y;
      return;
    }
    const pitch = armR.root.rotation.x;
    const yaw = upper.rotation.y;
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

    // ---- 主手 ----
    const e = (swingBladePitch ?? mountBasePitch(w)) + drag;
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
    const eo = swingBladePitchOff ?? (w === 'sword-shield' ? null : mountOffBasePitch(w));
    const offChain = torsoPitch + offArm.root.rotation.x + offArm.joint.rotation.x;
    if (w === 'sword-shield') {
      offMount.rotation.x = eo === null
        ? mountOffBasePitch(w)
        : mountOffBasePitch(w) - eo - offChain;
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
    const yawMain = swingBladeYaw ?? 0;
    const yawOff = swingBladeYawOff ?? 0;
    const twMain = swingBladeTwist ?? 0;
    const twOff = swingBladeTwistOff ?? 0;
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
    lastRootTurn = p.rootYaw + p.spinYaw;
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
    const swingT = clipLabT ?? swingCurve(combat.attackProgress);
    const target = solveSwingPose(
      combat.weapon, combat.comboIndex, swingT, swingCfg,
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
    const baseY = bodyH - 0.04;
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

  /** 攻击跨步：每段攻击在挥出时向前跨一步，连击左右腿交替（combo 段奇偶决定方向），
   * 同时重心下沉，让「每一次前移动画都表现出一个跨步」，且连击节奏连贯而非原地比划。 */
  function applyStep(combat: CombatState): void {
    if (combat.phase === 'idle' || combat.charging) return;
    const p = combat.attackProgress;
    const swing = swingCurve(p);
    const forth = Math.max(0, swing);
    const stepDir = combat.comboIndex % 2 === 0 ? 1 : -1; // 偶数段向右跨、奇数段向左跨
    // v8g：幅度外置 + 收敛（旧版硬编码 0.17 / 0.14 / 0.05 在重击时推得过远）。
    // 大剑额外乘 heavyScale：双手大抡配小跨步，脚由 IK 钉地、身体只小幅前移，
    // 不会再出现「身体离开腿」。数值缺省时回落到旧值，兼容外部构造的配置对象。
    const cfg = animCfg.stride;
    const reach = Number.isFinite(cfg.stepReach) ? cfg.stepReach : 0.17;
    const side = Number.isFinite(cfg.stepSideReach) ? cfg.stepSideReach : 0.14;
    const dip = Number.isFinite(cfg.stepDipReach) ? cfg.stepDipReach : 0.05;
    const heavy = combat.weapon === 'greatsword'
      ? clamp(Number.isFinite(cfg.heavyScale) ? cfg.heavyScale : 1, 0, 1) : 1;
    pelvis.position.z += reach * forth * heavy;                    // 向前跨步（+Z = 前）
    pelvis.position.x += stepDir * side * forth * heavy;           // 左右交替跨步
    pelvis.position.y -= dip * Math.sin(Math.PI * p) * heavy;      // 重心下沉
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
    if (combat.phase === 'idle' && combatPoseW <= 0.001) {
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
    applyStep(combat);
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

  return {
    group: root,
    update(
      c: CharacterState, combat: CombatState, hurt: HurtState, frameDt: number,
      channeling = false, coreTime?: number, link?: LinkState,
      turn?: TurnInPlaceState,
    ): void {
      setWeapon(combat.weapon);
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
      lower.position.x = 0;
      lower.position.y = 0;
      lower.position.z = 0;
      lower.rotation.z = 0;

      // ---- 移动惯性倾斜（纯表现，帧率无关）----
      // 身体前方单位向量 = (sin(bodyYaw), cos(bodyYaw))；加速度投影 >0 为加速、<0 为刹车。
      const dt = Math.max(1 / 240, Math.min(frameDt, 0.1));

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
      const targetHipYaw = backHipYawTarget(
        bodyFwdRatio, latRatio, strafeYaw, backKeep,
      ) * yawFade;
      hipYaw += (targetHipYaw - hipYaw) * (1 - Math.exp(-ori.hipYawSmoothing * dt));

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
      // v9p：相位基准只在「刚进入攻击」那一帧锁定，攻击主体（含连击段切换、
      // 淡出期）始终保持不变 —— 若退出时把它改成实时 c.gaitPhase，基准本身会
      // 瞬跳（起手 0 → 结束 2.9 rad），腿就跟着跳一下。相位差改由 attackGaitDrive
      // 内部的最短弧插值吸收，基准无需再对齐。
      if (attacking && !wasAttacking) attackPhaseBase = c.gaitPhase;
      wasAttacking = attacking;
      // v9p：淡出期（attacking=false 但 attackBlend>0）也继续走等效驱动，让相位 /
      // 摆幅按 blend 平滑回落到真实步态；旧版在收势那一帧直接切回 realDrive
      // （speed=0 → idle），步幅放大后这个单帧弹回会非常明显。
      const drive = attackBlend > 0
        ? attackGaitDrive(
          realDrive, combat.attackProgress, combat.comboIndex, attackBlend,
          animCfg.stride, attackPhaseBase,
        )
        : realDrive;
      lastDrive = drive;

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
        legLength: v.legLength,
        stride: stopStride0,
        grounded: true,
      } : {
        phase: drive.phase,
        speed: drive.speed,
        moveSpeed,
        localForward: drive.localForward,
        localRight: drive.localRight,
        legLength: v.legLength,
        // v9p：攻击时喂「放大的等效步幅」（strideScale），走物理步幅路径让跨步更大；
        // 拉 0 时 drive.stride=0，精确回到 v8d 的「摆幅随速度」回退路径。
        stride: drive.stride ?? 0,
        grounded: c.grounded,
      };
      // 攻击期间按 gaitScale 平滑淡出步态（gaitWeight=0 时淡出到静止基准）；腿、骨盆、摆臂
      // 共用同一系数，保证上下半身同步，不会只淡出一半而出现错位。
      const gaitPose = inStop
        ? solveStopGait(gaitInput, gaitCfg, {
            progress: stopT, phase0: stopPhase0, phaseEnd: stopPhaseEnd,
          })
        : solveGait(gaitInput, gaitCfg);
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
        armL.root.rotation.x = gait.armL;
        armR.root.rotation.x = gait.armR;
        // v8g：肘朝身前折（负号）；顺手修旧版 armR 误用 gait.armL 的取值
        armL.joint.rotation.x = -(0.18 + gait.armL * 0.2);
        armR.joint.rotation.x = -(0.18 + gait.armR * 0.2);
        // 手臂 roll / yaw 每帧归零：applyCombatPose 的大剑双手分支会写这两项
        armL.root.rotation.z = 0;
        armR.root.rotation.z = 0;
        armL.root.rotation.y = 0;
        armR.root.rotation.y = 0;
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

      // 2) 战斗姿态覆盖（只在攻击 / 蓄力 / 停顿期间生效）
      //    v9s.29：进出战斗各有一段交叉淡入淡出 —— 先记下「不打这一击时的待机姿态」，
      //    写完战斗姿态后按权重混合，待机 ↔ 起手 / 收招不再单帧换姿势。
      const combatActive = combat.phase !== 'idle'
        || (combat.charging && combat.weapon === 'bow');
      const fadeTarget = combatActive ? 1 : 0;
      const fadeDur = Math.max(1e-3,
        fadeTarget > combatPoseW
          ? (swingCfg.poseIn ?? 0.1)
          : (swingCfg.poseOut ?? 0.16));
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
        const stride = attackStridePose(combat.attackProgress, combat.comboIndex, animCfg.stride);
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
      lower.rotation.y = hipYaw;
      // v9o：胸随下盘按配置比例带转（下盘转得多、胸转得少），避免「只有腿在偏、
      // 上身还正对前方」的拧巴感。hipYaw 已平滑，线性缩放不会引入跳变。
      chestYaw = chestYawFromHip(hipYaw, gaitCfg.chestYawScale, gaitCfg.chestYawMaxDeg);
      upper.rotation.y += chestYaw;
      // 只补偿主动攻击旋身，不含受击扭转（见 2.5 说明）；v9o 再补偿胸偏转，
      // 让头仍朝 Core 给的 headYaw（目标方向）而不是跟着胸一起偏走。
      const spin = combatSpin;
      headPivot.rotation.y = wrapAngle(c.headYaw - c.bodyYaw - spin - chestYaw);
      // v9s.18：俯仰注视。Core 给的 headPitch 以「+ = 抬头」为正，three 的 rotation.x
      // 正值是低头（+Z 转向 -Y），所以取反。身体只吃其中一小部分（bodyPitch），
      // 叠加在上面的惯性前倾之上 —— 「整个人抬眼看」，而不是头单独在脖子上折。
      headPivot.rotation.x = -clamp(c.headPitch ?? 0, -0.7, 0.7);
      upper.rotation.x += -clamp(c.bodyPitch ?? 0, -0.4, 0.4);

      // 3.4) v9s.24 腕部滞后：放在朝向 / 胸偏转之后 —— 它读的就是「躯干已经转到哪」，
      //      早一步读会漏掉 chestYaw，横向甩动就只在攻击时才有、走路时没有。
      //      又在副手握持之前 —— 握持 IK 取的是柄的世界坐标，腕部一摆，柄就动了。
      // 传 frameDt 而不是 clamp 过的 dt：暂停 / 命中定格时 frameDt 为 0，
      // 腕部必须真正冻结（clamp 后的 dt 下限是 1/240，会漏出微小抖动）。
      applyWrist(frameDt, combat.comboIndex);

      // 3.55) v9s.25 剑身仰角反解：数据给的是「剑离水平面多少度」，
      //       这里按实际手臂链换算成挂点角。必须在腕部之后、副手握持之前 ——
      //       腕滞后是链上的一环，副手 IK 又取柄的世界坐标。
      applyBladeTarget(combat, torsoPitchForBlade);

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
      });
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
        bladeTwist: p?.bladeTwist ?? 0,
        bladeTwistOff: p?.bladeTwistOff ?? 0,
        bladeYaw: p?.bladeYaw ?? 0,
        bladeYawOff: p?.bladeYawOff ?? 0,
        shoulderL: { x: lastShoulder.lx, y: lastShoulder.ly, z: lastShoulder.lz },
        shoulderR: { x: lastShoulder.rx, y: lastShoulder.ry, z: lastShoulder.rz },
      };
    },
    attackBlend(): number {
      return attackBlend;
    },
    attackWeights(): {
      gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
    } {
      return {
        gaitScale: lastGaitScale,
        attackLegWeight,
        driveSpeed: lastDrive.speed,
        stridePhase: lastDrive.phase,
      };
    },
    hipYaw(): number {
      return hipYaw;
    },
    gaitDebug() {
      return {
        stopT, hipYaw, chestYaw,
        speed: prevSpeed,   // update 末尾已刷新为本帧速度，供线上验收低速巡航
        gaitSpeed: lastGaitSpeed,
        stopStep: lastStopStep, stopShift: lastStopShift, stopDip: lastStopDip,
        /** v9s：停步偏差淡出系数（1=未消化，0=已归零）/ 原地转身踏步脉冲 */
        stopYawFade: lastStopYawFade, turnStep: lastTurnStep,
        legLPitch: lastLegs.lp, legLRoll: lastLegs.lr,
        legRPitch: lastLegs.rp, legRRoll: lastLegs.rr,
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
