/**
 * v9s.35 · 渲染侧朝向平滑（yaw 低通）。
 *
 * 为什么还需要它 —— 定长步进的插值（v9s.34）只保证「位置」在两个模拟步之间线性连续，
 * 但朝向的**角速度**仍是一条阶梯：慢放 0.25× 时模拟只跑 15Hz，插值把每一步的转角
 * 摊成 4 个线性小段，速度在每段边界上突跳一次。位置这种「一阶」量看不出来，
 * 朝向是「角度 × 半径」—— 手、肩、武器在 0.4~0.8m 半径上，速度突跳会被放大成
 * 肉眼可见的「一顿一顿」。用户的原话是「晚半帧关系不大」，那就用一次指数低通换平顺。
 *
 * 设计取舍：
 *  - **只作用于渲染用的根节点 yaw**，不回写 Core。判定 / 命中 / 相机目标全都读 Core 原始值。
 *  - `tau` 直接给毫秒：默认 35ms ≈ 半帧多一点。0 = 关闭（A/B 用）。
 *  - 单帧目标跳变超过 `snapRad`（默认 60°）视为**瞬移**（传送 / 复位 / 换体型），
 *    直接对齐，不做平滑 —— 否则角色会从地图这头「游」到那头。
 *  - 首帧直接对齐，避免开局从 0 度转出来。
 */

export type YawSmoother = {
  /**
   * 推进一帧，返回本帧该显示的 yaw。
   * @param target 目标 yaw（rad，来自插值后的 `bodyYaw`）
   * @param dt 本帧真实时长（秒）；<= 0 时原样返回上次的值
   * @param tauMs 时间常数（毫秒）；<= 0 表示不平滑
   * @param snapRad 单帧跳变超过它就直接对齐（rad）
   */
  update(target: number, dt: number, tauMs: number, snapRad?: number): number;
  /** 强制对齐到某个角度（复位 / 传送后调用） */
  reset(to: number): void;
  /** 当前显示值（未初始化时为 0） */
  readonly value: number;
  /** 是否已经初始化过（首帧） */
  readonly ready: boolean;
};

/** 默认瞬移阈值：60°。转身最快也就 ~19°/帧（60Hz 下 1140°/s），不会误判。 */
export const YAW_SNAP_RAD = Math.PI / 3;

function wrapAngle(a: number): number {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

export function createYawSmoother(): YawSmoother {
  let shown = 0;
  let init = false;
  return {
    update(target, dt, tauMs, snapRad = YAW_SNAP_RAD) {
      if (!Number.isFinite(target)) return shown;
      if (!init) {
        init = true;
        shown = target;
        return shown;
      }
      if (!(tauMs > 0) || !(dt > 0)) {
        shown = target;
        return shown;
      }
      const d = wrapAngle(target - shown);
      // 瞬移：距离太远，平滑会变成「横着飘过去」
      if (Math.abs(d) >= snapRad) {
        shown = target;
        return shown;
      }
      // 指数趋近：k = 1 - e^(-dt/tau)，与帧率无关（120Hz 与 60Hz 的收敛曲线一致）
      const k = 1 - Math.exp(-dt / (tauMs / 1000));
      shown = wrapAngle(shown + d * k);
      return shown;
    },
    reset(to) {
      init = true;
      shown = to;
    },
    get value() {
      return shown;
    },
    get ready() {
      return init;
    },
  };
}
