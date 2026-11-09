/**
 * v9s.54 · 胡子摆动：3 节链 × 2 个自由度的二阶弹簧解算（纯函数，零依赖）。
 *
 * 为什么是二阶而不是 lerp：胡子是**挂在脸上的绳子**，它的滞后来自惯性，不是延迟。
 * 一阶 lerp 只会「慢半拍」，加速时看不出「往后甩、再荡回来」；二阶有速度项，
 * 起步 / 急停时会多摆一下，这正是要的「带一点物理」。
 *
 * 两个通道各是一串三节：
 *   pitch（绕 X）= 前后。吃角色**纵向**加速度阶跃：起步往后甩、急停往前栽。
 *   roll （绕 Z）= 左右。吃**横向**加速度 + 转身角速度：侧移 / 转身时整条胡子向外甩。
 *
 * v9s.52 只有 pitch 一个通道，结果是「只会前后晃，转身时像一根焊死的板」。
 * 拆成两通道后，横向那一维不需要额外的状态量以外的代价 —— 每帧多 3 个弹簧。
 *
 * 节 i 的目标是「跟上节 i−1 摆到哪 × follow」，再叠加自身重力恢复（目标 0 = 垂直下垂）。
 * 根节额外吃 drive。整条链 6 个自由度 × 2 个状态量，比一根头发丝还便宜。
 */

export type BeardState = {
  /** 各节前后角（rad，正 = 向后摆） */
  ang: [number, number, number];
  /** 各节前后角速度（rad/s） */
  vel: [number, number, number];
  /** 各节左右角（rad，正 = 向角色的右侧摆） */
  side: [number, number, number];
  /** 各节左右角速度（rad/s） */
  svel: [number, number, number];
  /** 是否已初始化（首帧直接吸附到静止位，避免从 0 猛弹一下） */
  ready: boolean;
};

export type BeardTuning = {
  /** 根节固有频率（rad/s）。越大越硬，胡子越「挺」。 */
  omega?: number;
  /** 下游节的跟随比例（0..1）。越小越软、末端越拖。 */
  follow?: number;
  /** 单节最大摆角（rad） */
  maxAngle?: number;
};

export type BeardAngles = {
  /** 三节前后角，写进 `rotation.x` */
  pitch: [number, number, number];
  /** 三节左右角，写进 `rotation.z` */
  roll: [number, number, number];
};

const DEFAULT: Required<BeardTuning> = { omega: 11, follow: 0.82, maxAngle: 0.85 };

export function createBeardState(): BeardState {
  return {
    ang: [0, 0, 0], vel: [0, 0, 0],
    side: [0, 0, 0], svel: [0, 0, 0],
    ready: false,
  };
}

/**
 * 推进一帧。
 *
 * @param drivePitch 根节前后角加速度项（rad/s²）：角色**纵向**加速度 × 系数，正 = 向后飘。
 * @param driveRoll  根节左右角加速度项（rad/s²）：**横向**加速度 + 转身切向，正 = 向右侧甩。
 */
export function solveBeard(
  st: BeardState, dt: number, drivePitch: number, driveRoll = 0, tuning?: BeardTuning,
): BeardAngles {
  const cfg = { ...DEFAULT, ...(tuning ?? {}) };
  if (!(dt > 0)) return { pitch: st.ang, roll: st.side };
  // 首帧 / 长时间暂停后：直接落到静止位，不做弹入。
  if (!st.ready) {
    st.ang = [0, 0, 0]; st.vel = [0, 0, 0];
    st.side = [0, 0, 0]; st.svel = [0, 0, 0];
    st.ready = true;
    return { pitch: st.ang, roll: st.side };
  }
  // 大 dt（切后台回来）会让显式积分发散；按 ≤1/90 拆步，最多 4 步。
  const steps = Math.min(4, Math.max(1, Math.ceil(dt / (1 / 90))));
  const h = dt / steps;
  const w = cfg.omega;
  const lim = cfg.maxAngle;
  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < 3; i++) {
      // 目标：根节回正；下游跟随上一节（乘 follow 让末端更「软」）。
      const tP = i === 0 ? 0 : st.ang[i - 1] * cfg.follow;
      const aP = w * w * (tP - st.ang[i]) - 2 * w * st.vel[i] + (i === 0 ? drivePitch : 0);
      st.vel[i] += aP * h;
      st.ang[i] += st.vel[i] * h;
      if (st.ang[i] > lim) { st.ang[i] = lim; st.vel[i] = 0; }
      if (st.ang[i] < -lim) { st.ang[i] = -lim; st.vel[i] = 0; }

      const tR = i === 0 ? 0 : st.side[i - 1] * cfg.follow;
      const aR = w * w * (tR - st.side[i]) - 2 * w * st.svel[i] + (i === 0 ? driveRoll : 0);
      st.svel[i] += aR * h;
      st.side[i] += st.svel[i] * h;
      if (st.side[i] > lim) { st.side[i] = lim; st.svel[i] = 0; }
      if (st.side[i] < -lim) { st.side[i] = -lim; st.svel[i] = 0; }
    }
  }
  return { pitch: st.ang, roll: st.side };
}

/**
 * v9s.54 · 手臂避让的**强度函数**（纯函数，单独抽出来才测得了）。
 *
 * 输入是手在头部局部坐标里的位置，输出「推多远 / 往哪边推」：
 *   push  0..1，手离胡子越近越大（用来把胡子往后压）
 *   side −1..1，把手推向**反侧**（人在右侧挥，胡子往左躲）
 *
 * 三个窗口都必须命中：伸到脸前（z）、横向够近（x）、落在胡子高度带（y）。
 * y 一定要做成**带**而不是单侧阈值 —— 写成「越低越算威胁」会把自然垂在身侧的
 * 手（y ≈ −0.66，早低于胡子末端）也算成威胁，静止时胡子会无端往一侧漂。
 */
export function beardAvoidAt(x: number, y: number, z: number): { push: number; side: number } {
  const front = clamp01((z - 0.05) / 0.20);
  const near = clamp01((0.30 - Math.abs(x)) / 0.30);
  const low = clamp01(1 - Math.abs(y + 0.23) / 0.30);
  const t = front * near * low;
  return { push: t, side: (x >= 0 ? -1 : 1) * t };
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
