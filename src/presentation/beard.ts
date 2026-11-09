/**
 * v9s.52 · 胡子摆动：3 节链的二阶弹簧解算（纯函数，零依赖）。
 *
 * 为什么是二阶而不是 lerp：胡子是**挂在脸上的绳子**，它的滞后来自惯性，不是延迟。
 * 一阶 lerp 只会「慢半拍」，加速时看不出「往后甩、再荡回来」；二阶有速度项，
 * 起步 / 急停时会多摆一下，这正是要的「带一点物理」。
 *
 * 三节各有独立角度，节 i 的目标是「跟上节 i−1 摆到哪 × follow」，再叠加自身重力
 * 恢复（目标 0 = 垂直下垂）。根节（i=0）额外吃 `drive`：角色前向加速度越大，
 * 胡子越往后飘。整条链只有 3 个自由度 × 2 个状态量，比一根头发丝还便宜。
 */

export type BeardState = {
  /** 各节当前角（rad，正 = 向后摆） */
  ang: [number, number, number];
  /** 各节角速度（rad/s） */
  vel: [number, number, number];
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

const DEFAULT: Required<BeardTuning> = { omega: 11, follow: 0.82, maxAngle: 0.85 };

export function createBeardState(): BeardState {
  return { ang: [0, 0, 0], vel: [0, 0, 0], ready: false };
}

/**
 * 推进一帧。
 *
 * @param drive 根节角加速度项（rad/s²）：角色**前向**加速度 × 系数，正 = 向后飘。
 * @returns 三节角度（rad），可直接写进 three 的 `rotation.x`。
 */
export function solveBeard(
  st: BeardState, dt: number, drive: number, tuning?: BeardTuning,
): [number, number, number] {
  const cfg = { ...DEFAULT, ...(tuning ?? {}) };
  if (!(dt > 0)) return st.ang;
  // 首帧 / 长时间暂停后：直接落到静止位，不做弹入。
  if (!st.ready) {
    st.ang = [0, 0, 0];
    st.vel = [0, 0, 0];
    st.ready = true;
    return st.ang;
  }
  // 大 dt（切后台回来）会让显式积分发散；按 ≤1/90 拆步，最多 4 步。
  const steps = Math.min(4, Math.max(1, Math.ceil(dt / (1 / 90))));
  const h = dt / steps;
  const w = cfg.omega;
  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < 3; i++) {
      // 目标：根节回正；下游跟随上一节（乘 follow 让末端更「软」）。
      const target = i === 0 ? 0 : st.ang[i - 1] * cfg.follow;
      const a = w * w * (target - st.ang[i]) - 2 * w * st.vel[i] + (i === 0 ? drive : 0);
      st.vel[i] += a * h;
      st.ang[i] += st.vel[i] * h;
      if (st.ang[i] > cfg.maxAngle) { st.ang[i] = cfg.maxAngle; st.vel[i] = 0; }
      if (st.ang[i] < -cfg.maxAngle) { st.ang[i] = -cfg.maxAngle; st.vel[i] = 0; }
    }
  }
  return st.ang;
}
