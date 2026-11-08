import type {
  PoseClip, PoseSample, SwingClipRef, SwingPoseViewConfig, WeaponId,
} from '../core';
import { clipHasChannel, samplePoseClip, sampleSpin } from '../core';

/**
 * v9s.25 · 近战挥击的「身体 / 手臂 / 剑身」姿态 —— 从硬编码曲线改成**数据采样**。
 *
 * 演进过程：
 *  - v9s.22 及以前：只剩手臂俯仰，身体不动；
 *  - v9s.23：三段关键帧写死在代码里（`GREATSWORD` 常量），方向对了，但每加一个技能
 *    都要改 TS、重新构建，几十种技能不现实；
 *  - v9s.25：关键帧搬到 `game.json` 的 `view.animation.swing.clips`，本文件只做
 *    「选剪辑 → 采样 → 乘幅度 → 分给两只手」。新技能 = 新数据 + 一条 combo 引用。
 *
 * 另一处关键变化是**挂点语义**：数据里给的是 `bladePitch`（剑身相对水平面的仰角），
 * 不是「挂点相对前臂的角度」。旧语义下手臂抬到 −80° 时 58° 挂点会把剑翻成近乎竖直
 * 朝上（用户看到的「剑尖都在头顶」），而作者很难凭空算出该给多少度。现在只写
 * 「这一段剑是平的（0）/ 朝上（+）/ 朝下（−）」，rig 用实际手臂链反解挂点角。
 */

export type SwingArm = {
  /** 绕 X：负 = 抬到身前 / 头顶 */
  pitch: number;
  /** 绕 Y：手臂前举后才有横向效果，正 = 向角色右侧 */
  yaw: number;
  /** 绕 Z：正 = 手末端向角色右侧外张 */
  roll: number;
  /** 肘：负 = 向前折（与骨架「手臂沿 -Y 伸出」的约定一致） */
  elbow: number;
};

export type SwingPose = {
  /** 上身相对骨盆的扭转（+ = 转向角色右侧，即 +X 侧）；只拧腰椎，不含整体转体 */
  yaw: number;
  /**
   * v9s.26 · 整体带转（rad，写进 rig root.rotation.y，与 yaw 叠加）。
   * 由 `rootYaw` 通道按挥击曲线采样，随 `body` 幅度缩放 —— 大幅横扫的幅度主力。
   */
  rootYaw: number;
  /**
   * v9s.26 · 整圈旋转（rad，同样写进 root.rotation.y）。
   * 由剪辑级 `spin` 按 **attackProgress** 单调推进，与挥击曲线无关；
   * 进度 1 时 = turns·2π ≡ 0，收招归零不甩头。段间过渡不插值这一项（见 blendSwingPose）。
   */
  spinYaw: number;
  /** 上身前后倾（+ = 前压） */
  pitch: number;
  /** 上身侧倾（+ = 向角色左侧倒，与 THREE rotation.z 正方向一致） */
  roll: number;
  /** 骨盆前后（+ = 前） */
  pelvisZ: number;
  /** 骨盆左右（+ = 右） */
  pelvisX: number;
  /** 右臂姿态；null = 不接管（交还步态摆臂） */
  armR: SwingArm | null;
  /** 左臂姿态；null = 不接管 */
  armL: SwingArm | null;
  /**
   * 剑身仰角（rad，0 = 水平，正 = 剑尖朝上）；null = 用武器默认挂点。
   *
   * rig 侧按「实际手臂链的累计俯仰」反解挂点角：
   * `mount.x = π/2 − bladePitch − (躯干 + 肩 + 肘 + 腕)`。
   * 这样无论手臂怎么抬，剑身都停在作者指定的仰角上。
   */
  bladePitch: number | null;
  /** v9s.26：副手武器挂点仰角；null = 沿用默认挂点。双持展开 / 盾猛顶时显式给。 */
  bladePitchOff: number | null;
  /**
   * v9s.29：主手刃面滚转（rad，绕刀身长轴；0 = 宽面朝侧面，±1.2 ≈ 刃口朝挥击方向）。
   * 横扫时用来让「刃口迎着运动方向」，而不是拿刀身侧面拍过去。
   */
  bladeTwist: number;
  /** v9s.29：副手刃面滚转。 */
  bladeTwistOff: number;
  /** v9s.29：主手刃身相对小臂的水平外撇（rad，+ = 刀尖偏向角色右侧）。 */
  bladeYaw: number;
  /** v9s.29：副手刃身水平外撇。 */
  bladeYawOff: number;
  /** 本段主挥手（决定哪只手的剑要按 bladePitch 反解） */
  lead: 'R' | 'L';
  /** 本段类型，供调试 / 验收读 */
  kind: string;
  /** 归一化挥出量 0..1（0 = 蓄势满，1 = 挥出满），供拖尾 / 形变层复用 */
  strike: number;
  /**
   * v9s.31：本段声明的段间混合时长（秒）；null / 缺省 = 按姿态差自动算。
   * 只有「必须精确对齐某一帧」的特殊段才需要写死。
   */
  blend?: number | null;
};

type Frame = {
  yaw: number; pitch: number; roll: number;
  pz: number; px: number;
  ap: number; ay: number; ar: number; el: number;
  blade: number;
};

/** 三段兜底关键帧（起手 / 命中），只有配置里完全没有剪辑时才会用到。 */
const FALLBACK: Frame[] = [
  { yaw: 0.85, pitch: -0.12, roll: -0.14, pz: -0.06, px: 0.045, ap: -1.20, ay: -0.42, ar: 0.16, el: -0.48, blade: 0.30 },
  { yaw: -0.95, pitch: 0.14, roll: 0.17, pz: 0.10, px: -0.05, ap: -1.46, ay: -0.60, ar: -0.10, el: -0.14, blade: -0.05 },
  { yaw: -0.75, pitch: -0.08, roll: 0.14, pz: -0.04, px: -0.04, ap: -1.28, ay: -0.58, ar: -0.12, el: -0.50, blade: 0.30 },
  { yaw: 0.92, pitch: 0.15, roll: -0.18, pz: 0.10, px: 0.05, ap: -1.48, ay: -0.40, ar: 0.12, el: -0.13, blade: -0.05 },
  { yaw: 0.12, pitch: -0.32, roll: -0.05, pz: -0.07, px: 0.0, ap: -1.90, ay: -0.30, ar: 0.16, el: -0.55, blade: 1.30 },
  { yaw: 0.0, pitch: 0.55, roll: 0.02, pz: 0.13, px: 0.0, ap: 0.05, ay: -0.20, ar: 0.0, el: -0.10, blade: -0.55 },
];

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 一条 combo 引用可以是裸字符串（= 默认手 / 默认幅度）。 */
function normalizeRef(ref: SwingClipRef | string | undefined): SwingClipRef | null {
  if (!ref) return null;
  return typeof ref === 'string' ? { clip: ref } : ref;
}

function emptySample(): PoseSample {
  return {
    bodyYaw: 0, bodyPitch: 0, bodyRoll: 0, pelvisX: 0, pelvisZ: 0,
    armPitch: 0, armYaw: 0, armRoll: 0, elbow: 0, bladePitch: 0,
    armLPitch: 0, armLYaw: 0, armLRoll: 0, elbowL: 0,
    rootYaw: 0, bladePitchOff: 0,
    bladeTwist: 0, bladeTwistOff: 0, bladeYaw: 0, bladeYawOff: 0,
  };
}

/** 兜底：起手帧 → 命中帧线性插值（与 v9s.23 完全同一条曲线）。 */
function sampleFallback(seg: number, u: number): PoseSample {
  const i = (seg % 3) * 2;
  const a = FALLBACK[i];
  const b = FALLBACK[i + 1];
  return {
    ...emptySample(),
    bodyYaw: lerp(a.yaw, b.yaw, u),
    bodyPitch: lerp(a.pitch, b.pitch, u),
    bodyRoll: lerp(a.roll, b.roll, u),
    pelvisX: lerp(a.px, b.px, u),
    pelvisZ: lerp(a.pz, b.pz, u),
    armPitch: lerp(a.ap, b.ap, u),
    armYaw: lerp(a.ay, b.ay, u),
    armRoll: lerp(a.ar, b.ar, u),
    elbow: lerp(a.el, b.el, u),
    bladePitch: lerp(a.blade, b.blade, u),
  };
}

/**
 * 解出本帧的挥击姿态。
 *
 * @param weapon    当前武器（决定用哪套剪辑、幅度倍率、主挥手）
 * @param comboIndex 连击段号 1..N（0 / 越界按 1 处理）
 * @param swing     挥击曲线 −1..1（−1 = 蓄势满，+1 = 挥出满，0 = 中立 / 收势）
 * @param cfg       挥击层配置（含剪辑库）
 * @param progress  攻击进度 0..1（单调），仅用于剪辑级 `spin` 整圈旋转；缺省 0 = 不转
 */
export function solveSwingPose(
  weapon: WeaponId,
  comboIndex: number,
  swing: number,
  cfg: SwingPoseViewConfig,
  progress = 0,
): SwingPose {
  const list = cfg.combo?.[weapon] ?? [];
  const count = Math.max(1, list.length);
  const seg = (((Math.round(comboIndex) || 1) - 1) % count + count) % count;
  const ref = normalizeRef(list[seg]);
  const clip: PoseClip | null = ref ? (cfg.clips?.[ref.clip] ?? null) : null;

  const wScale = clamp(cfg.weaponScale?.[weapon] ?? 1, 0, 2);
  const bodyScale = Number.isFinite(cfg.bodyScale) ? Math.max(0, cfg.bodyScale) : 1;
  // 段级倍率（数据里可选）作用于全身；bodyScale 只作用于躯干 / 骨盆 ——
  // 「身体不动、只有胳膊在挥」的 A/B 对照必须还能成立。
  const amplitude = ref && Number.isFinite(ref.scale) ? (ref.scale as number) : wScale;
  const body = amplitude * bodyScale;
  const u = clamp((swing + 1) / 2, 0, 1);

  const sample = clip && clip.keys.length > 0 ? samplePoseClip(clip, u) : sampleFallback(seg, u);
  const lead: 'R' | 'L' = (ref?.lead ?? clip?.lead ?? 'R') === 'L' ? 'L' : 'R';
  const kind = clip?.kind
    ?? ['right-left', 'left-right', 'overhead'][seg]
    ?? 'custom';

  // v9s.29：刃面滚转 / 刃身外撇。数据没显式给副手值时按「双持同向（两把刀一起迎着
  // 挥击方向立刃）、其余镜像外撇」推导 —— 只写主手通道也能让双刀同时立刃。
  const dual = weapon === 'dual-swords';
  const twistOff = clip && clipHasChannel(clip, 'bladeTwistOff')
    ? sample.bladeTwistOff
    : (dual ? sample.bladeTwist : 0);
  const yawOff = clip && clipHasChannel(clip, 'bladeYawOff')
    ? sample.bladeYawOff
    : -sample.bladeYaw;

  const pose: SwingPose = {
    yaw: sample.bodyYaw * body,
    // 整体带转跟躯干扭转一样吃 body 幅度：bodyScale=0 的 A/B 对照要把「身体」
    // 整个停住（含脚掌碾地），否则「只有手臂在挥」的对照不成立。
    rootYaw: sample.rootYaw * body,
    // 整圈旋转是剪辑级语义，按攻击进度单调推进，不吃任何幅度倍率
    //（缩放会转不满一圈，收招时朝向回不去）。
    spinYaw: sampleSpin(clip, clamp(progress, 0, 1)),
    pitch: sample.bodyPitch * body,
    roll: sample.bodyRoll * body,
    pelvisZ: sample.pelvisZ * body,
    pelvisX: sample.pelvisX * body,
    armR: null,
    armL: null,
    // 剑身仰角是世界语义，不吃幅度倍率：乘 0.62 会让短剑的剑身莫名上翘。
    bladePitch: sample.bladePitch,
    // 副手挂点仰角只有数据显式给了才接管：缺省 null = 沿用武器默认挂点，
    // 否则双持待机时左手会被莫名翻成水平。
    bladePitchOff: clip && clipHasChannel(clip, 'bladePitchOff') ? sample.bladePitchOff : null,
    // 刃身外撇 / 刃面滚转都是相对量，不吃幅度倍率（乘了会变成「刀歪了」而不是「刀立起来了」）
    bladeTwist: sample.bladeTwist,
    bladeTwistOff: twistOff,
    bladeYaw: sample.bladeYaw,
    bladeYawOff: yawOff,
    lead,
    kind,
    strike: u,
    blend: ref && Number.isFinite(ref.blend) ? (ref.blend as number) : null,
  };

  const arm: SwingArm = {
    pitch: sample.armPitch * amplitude,
    yaw: sample.armYaw * amplitude,
    roll: sample.armRoll * amplitude,
    elbow: sample.elbow * amplitude,
  };
  // v9s.26：`armL*` 统一表示**副手**（主挥手之外的那只手），与 lead 无关。
  // lead=L 时它指向右手 —— 双持段 2「左手挥、右手往右后方收」就是写这组通道。
  // 没写时按主手镜像一个合理初值交给副手握持 IK。
  const hasOff = clip
    ? (clipHasChannel(clip, 'armLPitch') || clipHasChannel(clip, 'armLYaw')
      || clipHasChannel(clip, 'armLRoll') || clipHasChannel(clip, 'elbowL'))
    : false;
  const off: SwingArm = hasOff
    ? {
      pitch: sample.armLPitch * amplitude,
      yaw: sample.armLYaw * amplitude,
      roll: sample.armLRoll * amplitude,
      elbow: sample.elbowL * amplitude,
    }
    : {
      pitch: arm.pitch + (weapon === 'greatsword' ? 0.08 : 0.1),
      yaw: arm.yaw * 0.8,
      roll: weapon === 'greatsword' ? 0.40 : -arm.roll * 0.6,
      elbow: arm.elbow,
    };

  if (lead === 'L') {
    pose.armL = arm;
    // 主挥换到左手：右手给副手姿态（双剑段 2 的「右后方收」由 armL* 通道给出）
    pose.armR = weapon === 'greatsword' ? null : off;
  } else {
    pose.armR = arm;
    // 剑盾平时左臂持盾、不接管（交还步态摆臂）；但剪辑**显式**给了副手通道时
    // 必须放行 —— 盾猛顶就是靠数据驱动盾臂前顶的。复用大剑横扫剪辑的段位
    // 没写 armL* 通道，所以旧行为逐帧不变。
    if (weapon === 'greatsword' || weapon === 'dual-swords' || hasOff) pose.armL = off;
  }
  return pose;
}

/** 段间插值：两端姿态逐字段线性混合（null 视为「不接管」，由目标侧决定）。 */
export function blendSwingPose(a: SwingPose, b: SwingPose, t: number): SwingPose {
  const k = clamp(t, 0, 1);
  const arm = (x: SwingArm | null, y: SwingArm | null): SwingArm | null => {
    if (!x) return y;
    if (!y) return null;
    return {
      pitch: lerp(x.pitch, y.pitch, k),
      yaw: lerp(x.yaw, y.yaw, k),
      roll: lerp(x.roll, y.roll, k),
      elbow: lerp(x.elbow, y.elbow, k),
    };
  };
  return {
    yaw: lerp(a.yaw, b.yaw, k),
    rootYaw: lerp(a.rootYaw, b.rootYaw, k),
    // 整圈旋转不参与段间插值：它是「本段按 attackProgress 单调推进」的时间轴语义，
    // 换段瞬间 progress 归零，spinYaw 就该直接回到 0。若在这里线性插值，
    // 段 3 末的 2π 会被插值回 0（中途经过 π），观感是收招时整个角色倒转半圈。
    // 2π ≡ 0，直接取目标值在旋转上没有任何视觉跳变。
    spinYaw: b.spinYaw,
    pitch: lerp(a.pitch, b.pitch, k),
    roll: lerp(a.roll, b.roll, k),
    pelvisZ: lerp(a.pelvisZ, b.pelvisZ, k),
    pelvisX: lerp(a.pelvisX, b.pelvisX, k),
    armR: arm(a.armR, b.armR),
    armL: arm(a.armL, b.armL),
    bladePitch: a.bladePitch === null || b.bladePitch === null
      ? (k < 0.5 ? a.bladePitch : b.bladePitch)
      : lerp(a.bladePitch, b.bladePitch, k),
    bladePitchOff: a.bladePitchOff === null || b.bladePitchOff === null
      ? (k < 0.5 ? a.bladePitchOff : b.bladePitchOff)
      : lerp(a.bladePitchOff, b.bladePitchOff, k),
    // v9s.29：刃面 / 外撇都是相对量，直接线性混合（角度都在 ±π/2 内，不会绕圈）
    bladeTwist: lerp(a.bladeTwist, b.bladeTwist, k),
    bladeTwistOff: lerp(a.bladeTwistOff, b.bladeTwistOff, k),
    bladeYaw: lerp(a.bladeYaw, b.bladeYaw, k),
    bladeYawOff: lerp(a.bladeYawOff, b.bladeYawOff, k),
    lead: b.lead,
    // 段号在换段瞬间就更新了，kind 也跟目标段保持一致（否则诊断读到「段 1 / overhead」）
    kind: b.kind,
    strike: lerp(a.strike, b.strike, k),
    blend: b.blend ?? null,
  };
}

/** 最短角差（用于姿态距离，避免 ±π 附近把「几乎相同」算成大差）。 */
function wrapPi(a: number): number {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

function armDistance(a: SwingArm | null, b: SwingArm | null): number {
  // 一侧接管、另一侧不接管：混合过程本来就是「淡入淡出」，给一个中等距离即可
  if (!a || !b) return a || b ? 0.6 : 0;
  return Math.abs(a.pitch - b.pitch) * 1.0
    + Math.abs(a.yaw - b.yaw) * 0.8
    + Math.abs(a.roll - b.roll) * 0.6
    + Math.abs(a.elbow - b.elbow) * 0.8;
}

/**
 * v9s.31 · 两段挥击姿态的「角度距离」（rad 加权和）。
 *
 * 用途不是精确度量，而是给自动混合时长一个**单调且可比**的尺度：
 * 姿态差越大 → 混合越久。权重按「观众最先注意到哪个通道变化」排：
 * 躯干扭转 / 手臂俯仰 / 剑身仰角权重最高，刃面滚转这类细节最低。
 * `spinYaw` 不参与（它是时间轴语义，不插值）；骨盆位移按 2 rad/m 折算。
 */
export function swingPoseDistance(a: SwingPose, b: SwingPose): number {
  const ang = (x: number, y: number) => Math.abs(wrapPi(x - y));
  let d = 0;
  d += ang(a.yaw, b.yaw) * 1.0;
  d += ang(a.rootYaw, b.rootYaw) * 0.7;
  d += ang(a.pitch, b.pitch) * 0.9;
  d += ang(a.roll, b.roll) * 0.9;
  d += Math.abs(a.pelvisX - b.pelvisX) * 2;
  d += Math.abs(a.pelvisZ - b.pelvisZ) * 2;
  d += armDistance(a.armR, b.armR);
  d += armDistance(a.armL, b.armL) * 0.8;
  d += ang(a.bladePitch ?? 0, b.bladePitch ?? 0) * 1.1;
  d += ang(a.bladePitchOff ?? 0, b.bladePitchOff ?? 0) * 0.7;
  d += ang(a.bladeTwist, b.bladeTwist) * 0.5;
  d += ang(a.bladeYaw, b.bladeYaw) * 0.5;
  return d;
}

/**
 * v9s.31 · 按「姿态差 / 目标角速度」算段间混合时长（秒）。
 *
 * 旧的固定 `segBlend` 有两个毛病：双剑快攻里 0.1s 占整段近一半（发黏），
 * 大剑换段姿态差 200° 时 0.1s 内跨完（硬切）。现在改成：
 *   span = clamp(distance / rate, min, max)
 * 姿态差小的快刀自然更短，重击自然更长，同时被上下限兜住。
 *
 * @param override 段级显式覆写（`SwingClipRef.blend`），给了就直用。
 * @param from     上一段末帧姿态；null = 本段是第一段（没有来源，用兜底 segBlend）。
 * @param maxSpan  本段可用预算（通常是「新段总时长 × 0.22」）。快刀整段只有 0.35s，
 *                 混合再长就会吃掉挥击本身 —— 预算比固定上限更贴近节奏。
 */
export function autoSegBlend(
  from: SwingPose | null,
  to: SwingPose,
  cfg: SwingPoseViewConfig,
  override?: number | null,
  maxSpan?: number,
): number {
  if (override !== null && override !== undefined && Number.isFinite(override) && override >= 0) {
    return Math.max(0.008, override);
  }
  const fallback = Math.max(0.008, cfg.segBlend ?? 0.1);
  if (!from) return fallback;
  const min = Math.max(0.008, cfg.segBlendMin ?? 0.03);
  const cap = Math.max(min, Number.isFinite(maxSpan) ? (maxSpan as number) : (cfg.segBlendMax ?? 0.14));
  // 姿态距离的绝对值跨度不大（不同武器 1~9 rad），直接除角速度会大量撞上下限；
  // 先按「一次完整换段」的参考距离归一到 0..1，再映射进本段预算，单调且尺度稳定。
  const ref = Math.max(0.1, cfg.segBlendRef ?? 6);
  const k = clamp(swingPoseDistance(from, to) / ref, 0, 1);
  return min + (cap - min) * k;
}

/** 段间过渡的缓动（smoothstep），两端导数为 0，接缝不抽。 */
export function segEase(t: number): number {
  const k = clamp(t, 0, 1);
  return k * k * (3 - 2 * k);
}
