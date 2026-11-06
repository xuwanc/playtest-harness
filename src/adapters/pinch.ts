/**
 * 双指捏合缩放解算（v8e）。纯函数、零 DOM / THREE / 外部时间，
 * 输入是「上一帧状态 + 当前活动指针坐标列表」，输出本帧缩放比例；
 * 状态机显式传入 / 返回，便于在纯 Node 环境单测完整手势序列。
 *
 * 方向约定：两指间距变大 → 倍率变大 → 相机拉远；间距变小 → 拉近。
 * 取「最后按下的两根」指针参与捏合：单指摇杆 + 双指捏合（三指）时，
 * 摇杆是最早按下的那根，不会被误算进捏合距离。UI 区域指针由输入层剔除，
 * 不进入这里的 points。
 */

export type PinchPoint = { id: number; x: number; y: number };

/** 捏合状态：只需记住上一帧两指距离；active = 当前是否处于双指。 */
export type PinchState = { active: boolean; lastDist: number };

export type PinchStep = {
  state: PinchState;
  /** 本帧倍率比例：>1 拉远、<1 拉近、=1 无变化 */
  scale: number;
  /** 恰好进入双指 / 退出双指 */
  started: boolean;
  ended: boolean;
  /** 当前是否处于双指（活动指针数 >= 2） */
  pinching: boolean;
};

/** 两指距离小于该值时视为重合，不产生缩放（避免除零与爆冲）。 */
const MIN_DIST = 1e-3;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function initialPinchState(): PinchState {
  return { active: false, lastDist: 0 };
}

/** 取最后按下的两根指针；不足两根或 id 重复时返回 null。 */
export function pinchPair(points: readonly PinchPoint[]): [PinchPoint, PinchPoint] | null {
  const n = points.length;
  if (n < 2) return null;
  const a = points[n - 2];
  const b = points[n - 1];
  if (a.id === b.id) return null;
  return [a, b];
}

/**
 * 由「上一帧状态 + 当前指针列表」求本帧缩放比例。
 * 单帧比例被 clamp 到 [1/maxStep, maxStep]，但 lastDist 始终更新为真实距离，
 * 因此限幅不会留下欠账（下一帧从新基准继续），手势往返能精确回到原倍率。
 */
export function solvePinch(
  prev: PinchState,
  points: readonly PinchPoint[],
  gain: number,
  maxStep: number,
): PinchStep {
  const pair = pinchPair(points);
  if (!pair) {
    return {
      state: initialPinchState(),
      scale: 1,
      started: false,
      ended: prev.active,
      pinching: false,
    };
  }

  const dist = Math.hypot(pair[1].x - pair[0].x, pair[1].y - pair[0].y);
  const step = Math.max(1.0001, Number.isFinite(maxStep) ? maxStep : 1.25);
  const lo = 1 / step;
  const hi = step;

  // 两指重合：保持双指状态但不产生比例，并清空距离基准（避免除零 / NaN）。
  // 恢复有效距离时会走下面的「新基准」分支：倍率保持不变、不补算重合期间丢失的移动，
  // 因此「捏到最紧再张开」不会突然蹦一下。
  if (!Number.isFinite(dist) || dist < MIN_DIST) {
    return {
      state: { active: true, lastDist: 0 },
      scale: 1,
      started: !prev.active,
      ended: false,
      pinching: true,
    };
  }

  // 进入双指（或从重合恢复有效距离）：只记基准，本帧不缩放
  if (!prev.active || prev.lastDist < MIN_DIST) {
    return {
      state: { active: true, lastDist: dist },
      scale: 1,
      started: !prev.active,
      ended: false,
      pinching: true,
    };
  }

  const raw = dist / prev.lastDist;
  const g = Math.max(0, Number.isFinite(gain) ? gain : 1);
  const scaled = Number.isFinite(raw) && raw > 0 ? Math.pow(raw, g) : 1;
  return {
    state: { active: true, lastDist: dist },
    scale: clamp(Number.isFinite(scaled) ? scaled : 1, lo, hi),
    started: false,
    ended: false,
    pinching: true,
  };
}

/** 把本帧比例累乘到当前倍率并限幅；非法比例（NaN / 0 / 负）不污染当前值。 */
export function clampZoom(current: number, scale: number, min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const s = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const v = current * s;
  if (!Number.isFinite(v)) return clamp(current, lo, hi);
  return clamp(v, lo, hi);
}

/** 滚轮：向下滚（deltaY>0）拉远、向上滚拉近；deltaY=0 → 1。 */
export function wheelZoomScale(deltaY: number, wheelStep: number): number {
  const base = Number.isFinite(wheelStep) && wheelStep > 0 ? wheelStep : 1;
  const dy = Number.isFinite(deltaY) ? deltaY : 0;
  return Math.pow(base, dy / 100);
}
