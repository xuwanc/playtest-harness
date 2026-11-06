/**
 * 两骨反向动力学（Two-Bone IK）纯函数层（v8g）。
 *
 * 在此之前实验台**没有 IK**：gait.ts 的「脚落地锁定」只是解析 sin³ 曲线，
 * 所有关节都是直接写角度的 FK（正向动力学），骨盆一旦被受击 / 落地 / 攻击层推走，
 * 脚只能跟着飘，程序动画之间无法共享「末端钉住」的约束。
 * 这里补上一层可复用的 IK 基础设施：给「根节点 → 目标点」反解两根骨头的角度，
 * 后续脚踩台阶、手够目标、受击撑地等程序动画都可以直接调用。
 *
 * 约定（与 voxel-rig / dummy-rig 骨架一致）：
 *   - 根关节局部：骨头沿 -Y 伸出，上骨长 upperLen、下骨长 lowerLen；
 *   - 根关节 rotation.order = 'ZYX'（重要！否则 roll 与 pitch 组合后两骨不共面，
 *     余弦定理无解析解）；变换 R = Rz(rootRoll) · Rx(rootPitch)；
 *   - 中间关节只有 rotation.x（jointPitch），在根关节局部坐标系里与上骨共面；
 *   - 末端位置 t 相对根关节原点，通常 t.y < 0（脚/手在下方）。
 *
 * bend = +1：膝向后（-Z）折（jointPitch > 0）；
 * bend = -1：肘向前（+Z）折（jointPitch < 0）。
 *
 * 零 THREE、零 DOM、零本地时间、零随机；输入纯数值、输出纯数值，
 * 可直接写单测、可跨语言对照重写（C# 形态：static class TwoBoneIKMath）。
 */

export type Vec3 = { x: number; y: number; z: number };

export type TwoBoneSolution = {
  /** 根关节绕 X（正 = 骨末端往 -Z 后） */
  rootPitch: number;
  /** 根关节绕 Z（正 = 骨末端往 +X 右） */
  rootRoll: number;
  /** 中间关节绕 X（bend=+1 时 >0 膝后折；bend=-1 时 <0 肘前折） */
  jointPitch: number;
  /** 目标超出可达范围（被夹到最大/最小臂展） */
  clamped: boolean;
  /** 目标距离 / 最大臂展，>1 表示够不到 */
  reach: number;
};

const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 正向动力学：由两骨角度算末端相对根关节的位置。
 * 与「hip.rotation.order='ZYX' → knee.rotation.x」的真实骨架变换逐项对应，
 * tests/ik.test.ts 会用 THREE 实际矩阵验证两者一致。
 */
export function forwardKinematics(
  rootPitch: number,
  rootRoll: number,
  jointPitch: number,
  upperLen: number,
  lowerLen: number,
): Vec3 {
  const a1 = rootPitch;
  const a2 = rootPitch + jointPitch;
  // 旋转前（Rz 之前）平面内的「向下分量」与「向后分量」
  const down = upperLen * Math.cos(a1) + lowerLen * Math.cos(a2);
  const back = upperLen * Math.sin(a1) + lowerLen * Math.sin(a2);
  return {
    x: Math.sin(rootRoll) * down,
    y: -Math.cos(rootRoll) * down,
    z: -back,
  };
}

/**
 * 两骨 IK：给定目标点（相对根关节原点）反解 rootPitch / rootRoll / jointPitch。
 *
 * 步骤：
 *   1) rootRoll = atan2(t.x, -t.y)：把整条链摆到包含目标的竖直平面；
 *   2) 平面内目标 (f=t.z, d=hypot(t.x,t.y))，目标方向相对「竖直向下」的角
 *      ψ = atan2(-f, d)（f>0 向前 → ψ<0，与 rotation.x 正=往后的约定一致）；
 *   3) 臂展 D=hypot(f,d) 夹到 [|L1-L2|+eps, L1+L2-eps]，超出即 clamped；
 *   4) 余弦定理求上骨偏角 α 与下骨偏角 β，两骨对称分布在目标方向两侧：
 *      上骨角 = ψ - bend·α，下骨角 = ψ + bend·β，故 jointPitch = bend·(α+β)。
 *      直臂 D=L1+L2 时 α=β=0 → jointPitch=0；完全折叠时 → ±π。
 *
 * 退化输入（长度非正、非有限目标）返回零姿态且 clamped=true，绝不产生 NaN。
 */
export function solveTwoBoneIK(
  target: Vec3,
  upperLen: number,
  lowerLen: number,
  bend: 1 | -1 = 1,
): TwoBoneSolution {
  const l1 = upperLen;
  const l2 = lowerLen;
  const bad = !Number.isFinite(l1) || !Number.isFinite(l2) || l1 <= EPS || l2 <= EPS
    || !Number.isFinite(target.x) || !Number.isFinite(target.y) || !Number.isFinite(target.z);
  if (bad) {
    return { rootPitch: 0, rootRoll: 0, jointPitch: 0, clamped: true, reach: 0 };
  }

  const maxReach = l1 + l2;
  const minReach = Math.abs(l1 - l2) + EPS;
  const D = Math.hypot(target.x, target.y, target.z);
  // 目标落在根关节原点：退化，保持伸直朝下
  if (D <= EPS) {
    return { rootPitch: 0, rootRoll: 0, jointPitch: 0, clamped: true, reach: 0 };
  }

  const rootRoll = Math.atan2(target.x, -target.y);
  const d = Math.hypot(target.x, target.y);   // 平面内的「向下」距离（恒 >= 0）
  const f = target.z;                         // 平面内的「前后」距离
  const planar = Math.hypot(f, d);
  // 只有严格超出可达范围才夹取；正常姿态保持原值，FK→IK 往返才能精确还原角度。
  const Dc = clamp(planar, minReach, maxReach);
  const clamped = planar > maxReach + EPS || planar < minReach - EPS;

  // 目标方向角（缩放后方向不变，故仍用原 f/d）
  const psi = Math.atan2(-f, Math.max(d, EPS));

  const cosA = clamp((l1 * l1 + Dc * Dc - l2 * l2) / (2 * l1 * Dc), -1, 1);
  const cosB = clamp((l2 * l2 + Dc * Dc - l1 * l1) / (2 * l2 * Dc), -1, 1);
  const alpha = Math.acos(cosA);
  const beta = Math.acos(cosB);
  const sign = bend >= 0 ? 1 : -1;

  return {
    rootPitch: psi - sign * alpha,
    rootRoll,
    jointPitch: sign * (alpha + beta),
    clamped,
    reach: D / maxReach,
  };
}

/**
 * 把 IK 解与当前 FK 角度按权重混合，并限制单帧最大修正量。
 * 纯函数：rig 层把「原角度 → 解」的插值与限幅统一走这里，保证玩家 / 假人一致。
 */
export function blendIKAngles(
  current: { rootPitch: number; rootRoll: number; jointPitch: number },
  solution: TwoBoneSolution,
  weight: number,
  maxCorrection: number,
): { rootPitch: number; rootRoll: number; jointPitch: number } {
  const w = clamp(weight, 0, 1);
  const lim = Math.max(0, maxCorrection);
  const mix = (from: number, to: number): number => {
    const delta = clamp((to - from) * w, -lim, lim);
    return from + delta;
  };
  return {
    rootPitch: mix(current.rootPitch, solution.rootPitch),
    rootRoll: mix(current.rootRoll, solution.rootRoll),
    jointPitch: mix(current.jointPitch, solution.jointPitch),
  };
}
