import type {
  PoseClip, PoseSample, SwingClipRef, SwingPoseViewConfig, WeaponId,
} from '../core';
import { clipHasChannel, samplePoseClip } from '../core';

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
  /** 上身相对骨盆的扭转（+ = 转向角色右侧，即 +X 侧） */
  yaw: number;
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
  /** 本段主挥手（决定哪只手的剑要按 bladePitch 反解） */
  lead: 'R' | 'L';
  /** 本段类型，供调试 / 验收读 */
  kind: string;
  /** 归一化挥出量 0..1（0 = 蓄势满，1 = 挥出满），供拖尾 / 形变层复用 */
  strike: number;
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
 */
export function solveSwingPose(
  weapon: WeaponId,
  comboIndex: number,
  swing: number,
  cfg: SwingPoseViewConfig,
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

  const pose: SwingPose = {
    yaw: sample.bodyYaw * body,
    pitch: sample.bodyPitch * body,
    roll: sample.bodyRoll * body,
    pelvisZ: sample.pelvisZ * body,
    pelvisX: sample.pelvisX * body,
    armR: null,
    armL: null,
    // 剑身仰角是世界语义，不吃幅度倍率：乘 0.62 会让短剑的剑身莫名上翘。
    bladePitch: sample.bladePitch,
    lead,
    kind,
    strike: u,
  };

  const arm: SwingArm = {
    pitch: sample.armPitch * amplitude,
    yaw: sample.armYaw * amplitude,
    roll: sample.armRoll * amplitude,
    elbow: sample.elbow * amplitude,
  };
  // 副手：剪辑里显式给了就用数据；否则按主手镜像一个合理初值交给副手握持 IK
  const hasLeft = clip
    ? (clipHasChannel(clip, 'armLPitch') || clipHasChannel(clip, 'armLYaw')
      || clipHasChannel(clip, 'armLRoll') || clipHasChannel(clip, 'elbowL'))
    : false;
  const left: SwingArm = hasLeft
    ? {
      pitch: sample.armLPitch * amplitude,
      yaw: sample.armLYaw * amplitude,
      roll: sample.armLRoll * amplitude,
      elbow: sample.elbowL * amplitude,
    }
    : {
      pitch: arm.pitch + (weapon === 'greatsword' ? 0.08 : 0),
      yaw: arm.yaw * 0.8,
      roll: weapon === 'greatsword' ? 0.40 : -arm.roll * 0.6,
      elbow: arm.elbow,
    };

  if (lead === 'L') {
    pose.armL = arm;
    // 主挥换到左手：右手给一个反向收势姿态（双剑段 2 的观感）
    pose.armR = weapon === 'greatsword' ? null : { ...left, pitch: arm.pitch + 0.1 };
  } else {
    pose.armR = arm;
    // 剑盾：左臂持盾，不接管；其余武器给副手初值
    if (weapon === 'greatsword' || weapon === 'dual-swords') pose.armL = left;
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
    pitch: lerp(a.pitch, b.pitch, k),
    roll: lerp(a.roll, b.roll, k),
    pelvisZ: lerp(a.pelvisZ, b.pelvisZ, k),
    pelvisX: lerp(a.pelvisX, b.pelvisX, k),
    armR: arm(a.armR, b.armR),
    armL: arm(a.armL, b.armL),
    bladePitch: a.bladePitch === null || b.bladePitch === null
      ? (k < 0.5 ? a.bladePitch : b.bladePitch)
      : lerp(a.bladePitch, b.bladePitch, k),
    lead: b.lead,
    // 段号在换段瞬间就更新了，kind 也跟目标段保持一致（否则诊断读到「段 1 / overhead」）
    kind: b.kind,
    strike: lerp(a.strike, b.strike, k),
  };
}

/** 段间过渡的缓动（smoothstep），两端导数为 0，接缝不抽。 */
export function segEase(t: number): number {
  const k = clamp(t, 0, 1);
  return k * k * (3 - 2 * k);
}
