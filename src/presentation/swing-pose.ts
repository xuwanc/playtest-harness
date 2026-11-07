import type { SwingPoseViewConfig, WeaponId } from '../core';

/**
 * v9s.23 · 近战挥击的「身体 / 手臂」姿态曲线（纯函数）。
 *
 * 起因是三条真机反馈：
 *  1. 「技能动作不够夸张」——旧版近战只写手臂俯仰 + 一点点 upper.rotation.y，
 *     躯干、骨盆、重心几乎不动，看起来是「胳膊在原地比划」；
 *  2. 「大剑三段应该 1. 从右往左 2. 接左边 pose 往右 3. 举过头顶往下」——
 *     旧版三段共用同一条 `both = -1.6*back + 1.25*forth` 曲线，三段一模一样；
 *  3. 「肩膀骨骼应该让上臂位置动起来」——旧版 shoulder.position 是常量，
 *     手臂再抬，肩点也钉在躯干侧面，读起来像「胳膊装在支架上」。
 *
 * 这里把「一段挥击」抽象成一条从起手到命中的**关键帧对**，输出：
 *  - 躯干（绕腰）的扭转 / 前后倾 / 侧倾  → 上半身带出去
 *  - 骨盆的前后 / 左右重心              → 全身重心跟着走（跨步之外再加一层）
 *  - 主手三轴角度 + 肘                      → 手臂轨迹
 *  - 肩部（上臂根部）抬升 / 前送 / 内收     → 「肩在动」的来源
 *
 * 三段的差异全部落在关键帧数据里，voxel-rig 只负责把数值写进骨骼。
 * 纯数值、无 THREE、无时间、无随机 —— 可直接单测「段 1 从右到左」「段 3 从举顶到下劈」。
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
   * 武器挂点相对手臂的俯仰（rad）；null = 用武器默认值（剑相对前臂垂直）。
   *
   * 只有「举过头顶下劈」需要覆盖：手臂绕 X 转到 −169° 时，默认的 58° 挂点会把剑
   * 翻成「剑尖朝后下方」，插进自己腰侧、下段柄从头顶穿出来。真实持剑时手腕会跟着
   * 转，让剑与手臂大致同向（举顶时都朝上、劈下时都朝下），所以这一段直接给一个
   * 与手臂几乎同向的挂点角。
   */
  mountPitch: number | null;
  /** 本段类型，供调试 / 验收读 */
  kind: 'right-left' | 'left-right' | 'overhead';
  /** 归一化挥出量 0..1（0 = 蓄势满，1 = 挥出满），供拖尾 / 形变层复用 */
  strike: number;
};

type Frame = {
  yaw: number; pitch: number; roll: number;
  pz: number; px: number;
  ap: number; ay: number; ar: number; el: number;
};

/**
 * 大剑三段的关键帧（起手 / 命中）。
 *
 * 方向定义（角色朝 +Z、右手在 +X）：
 *  - 段 1：躯干 +0.85（右转 49°）→ −0.95（左转 54°），跨度 103°，剑从右后扫到左前；
 *  - 段 2：躯干 −0.75（左转 43°）→ +0.92（右转 53°），承接段 1 左侧收势再扫回来；
 *  - 段 3：手臂 −2.40（举过头顶）→ +0.05（劈到身前下方），躯干后仰 −0.32 → 前压 +0.55。
 *
 * 手臂 yaw 刻意**不**参与横扫（大剑是双手握持，两手相对身体的距离要稳定）：
 * 横扫由躯干扭转完成，手臂只在 −0.4 ~ −0.65 之间微调内收，保证副手握点始终够得到。
 */
const GREATSWORD: { wind: Frame; hit: Frame; kind: SwingPose['kind'] }[] = [
  {
    kind: 'right-left',
    wind: { yaw: 0.85, pitch: -0.12, roll: -0.14, pz: -0.06, px: 0.045, ap: -1.20, ay: -0.42, ar: 0.16, el: -0.48 },
    hit: { yaw: -0.95, pitch: 0.14, roll: 0.17, pz: 0.10, px: -0.05, ap: -1.46, ay: -0.60, ar: -0.10, el: -0.14 },
  },
  {
    kind: 'left-right',
    wind: { yaw: -0.75, pitch: -0.08, roll: 0.14, pz: -0.04, px: -0.04, ap: -1.28, ay: -0.58, ar: -0.12, el: -0.50 },
    hit: { yaw: 0.92, pitch: 0.15, roll: -0.18, pz: 0.10, px: 0.05, ap: -1.48, ay: -0.40, ar: 0.12, el: -0.13 },
  },
  {
    kind: 'overhead',
    wind: { yaw: 0.12, pitch: -0.32, roll: -0.05, pz: -0.07, px: 0.0, ap: -1.90, ay: -0.30, ar: 0.16, el: -0.55 },
    hit: { yaw: 0.0, pitch: 0.55, roll: 0.02, pz: 0.13, px: 0.0, ap: 0.05, ay: -0.20, ar: 0.0, el: -0.10 },
  },
];

/**
 * 短剑沿用同一套方向，但幅度收敛：剑更短、单手，躯干拧 100° 会显得「人在甩自己」。
 * 段 3 也不举那么高（−2.40 → 乘 0.72 ≈ −1.73，约肩上方 10°）。
 */
const SWORD_SCALE = 0.72;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * 解出本帧的挥击姿态。
 *
 * @param weapon    当前武器（决定幅度倍率与「哪只手主挥」）
 * @param comboIndex 连击段号 1..3（0 / 越界按 1 处理）
 * @param swing     挥击曲线 −1..1（−1 = 蓄势满，+1 = 挥出满，0 = 中立 / 收势）
 */
export function solveSwingPose(
  weapon: WeaponId,
  comboIndex: number,
  swing: number,
  cfg: SwingPoseViewConfig,
): SwingPose {
  const seg = (((Math.round(comboIndex) || 1) - 1) % 3 + 3) % 3;
  const key = GREATSWORD[seg];
  const wScale = clamp(cfg.weaponScale?.[weapon] ?? 1, 0, 2);
  const s = wScale * (Number.isFinite(cfg.bodyScale) ? Math.max(0, cfg.bodyScale) : 1);
  const u = clamp((swing + 1) / 2, 0, 1);
  const w = key.wind;
  const h = key.hit;

  const pose: SwingPose = {
    yaw: lerp(w.yaw, h.yaw, u) * s,
    pitch: lerp(w.pitch, h.pitch, u) * s,
    roll: lerp(w.roll, h.roll, u) * s,
    pelvisZ: lerp(w.pz, h.pz, u) * s,
    pelvisX: lerp(w.px, h.px, u) * s,
    armR: null,
    armL: null,
    // 举顶下劈：挂点从「剑朝前上方」扫到「剑朝前下方」（1.90 → 0.85 rad），
    // 其余段沿用武器默认 58°。手臂本身在 −169° → 0° 之间摆，两者相加才是剑的世界朝向。
    mountPitch: key.kind === 'overhead' ? lerp(2.45, 1.50, u) : null,
    kind: key.kind,
    strike: u,
  };

  if (weapon === 'greatsword') {
    // 双手武器：右臂是主手，左臂只给 IK 一个合理初值（之后被副手握持层接管）。
    // 左臂 roll 取正 = 末端向角色右侧，即「向身体中线收」；不先内收的话 IK 会从
    // 垂在体侧的角度起解，前 2~3 帧副手是「从身侧甩过来」的。
    pose.armR = {
      pitch: lerp(w.ap, h.ap, u),
      yaw: lerp(w.ay, h.ay, u),
      roll: lerp(w.ar, h.ar, u),
      elbow: lerp(w.el, h.el, u),
    };
    pose.armL = { ...pose.armR, yaw: pose.armR.yaw * 0.8, roll: 0.40, pitch: pose.armR.pitch + 0.08 };
    return pose;
  }

  // 短剑：幅度乘 SWORD_SCALE；双剑段 2 换左手主挥（保持左右交替的读感）
  const arm: SwingArm = {
    pitch: lerp(w.ap, h.ap, u) * SWORD_SCALE,
    yaw: lerp(w.ay, h.ay, u) * SWORD_SCALE,
    roll: lerp(w.ar, h.ar, u) * SWORD_SCALE,
    elbow: lerp(w.el, h.el, u) * SWORD_SCALE,
  };
  if (weapon === 'dual-swords' && seg === 1) {
    pose.armL = { ...arm, roll: -arm.roll };
  } else {
    pose.armR = arm;
    if (weapon === 'dual-swords') pose.armL = { ...arm, yaw: -arm.yaw * 0.6, roll: -arm.roll };
  }
  // 剑盾：左臂持盾，保持步态 / 受击层的姿态，不由本层接管
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
    mountPitch: a.mountPitch === null || b.mountPitch === null
      ? (k < 0.5 ? a.mountPitch : b.mountPitch)
      : lerp(a.mountPitch, b.mountPitch, k),
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
