/**
 * 双指捏合缩放解算（v8e，v9e 加入「有意手势」阈值）。纯函数、零 DOM / THREE / 外部时间，
 * 输入是「上一帧状态 + 当前活动指针坐标列表」，输出本帧缩放比例；
 * 状态机显式传入 / 返回，便于在纯 Node 环境单测完整手势序列。
 *
 * 方向约定：两指间距变大 → 倍率变大 → 相机拉远；间距变小 → 拉近。
 * 取「最后按下的两根」指针参与捏合：单指摇杆 + 双指捏合（三指）时，
 * 摇杆是最早按下的那根，不会被误算进捏合距离。UI 区域指针由输入层剔除，
 * 不进入这里的 points。
 *
 * v9e 为什么需要 arm 阈值：
 *   手机上「左手摇杆 + 右手按技能」时，右手掌根 / 拇指侧缘经常蹭到屏幕，
 *   形成第二根非 UI 指针。旧实现只要出现两根手指就立刻进入捏合，
 *   输入层随之清掉摇杆 → 玩家感受到的是「按按钮方向就失灵」。
 *   现在两根手指必须相对移动超过 armPx 才算「有意捏合」，
 *   蹭一下不会缩放、也不会影响摇杆；真捏合只是多花 18px 的行程。
 */

export type PinchPoint = { id: number; x: number; y: number };

/** 捏合状态：上一帧两指距离 + 判定为「有意手势」的基准距离 + 是否已确认。 */
export type PinchState = { active: boolean; lastDist: number; armDist: number; armed: boolean };

export type PinchStep = {
  state: PinchState;
  /** 本帧倍率比例：>1 拉远、<1 拉近、=1 无变化 */
  scale: number;
  /** 恰好进入双指 / 退出双指 */
  started: boolean;
  ended: boolean;
  /** 恰好越过「有意手势」阈值这一帧（此后才开始真正缩放） */
  armedNow: boolean;
  /** 当前是否处于「已确认的双指手势」（未确认时不会缩放，也不会影响摇杆） */
  pinching: boolean;
};

/** 两指距离小于该值时视为重合，不产生缩放（避免除零与爆冲）。 */
const MIN_DIST = 1e-3;
/** 默认「有意手势」阈值（像素）：两指相对移动超过它才开始缩放 */
export const DEFAULT_ARM_PX = 18;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function initialPinchState(): PinchState {
  return { active: false, lastDist: 0, armDist: 0, armed: false };
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
  armPx: number = DEFAULT_ARM_PX,
): PinchStep {
  const pair = pinchPair(points);
  if (!pair) {
    return {
      state: initialPinchState(),
      scale: 1,
      started: false,
      ended: prev.active,
      armedNow: false,
      pinching: false,
    };
  }

  const dist = Math.hypot(pair[1].x - pair[0].x, pair[1].y - pair[0].y);
  const arm = armPx;
  const step = Math.max(1.0001, Number.isFinite(maxStep) ? maxStep : 1.25);
  const lo = 1 / step;
  const hi = step;

  // 两指重合：保持双指状态但不产生比例，并清空距离基准（避免除零 / NaN）。
  // 恢复有效距离时会重新取基准：倍率保持不变、不补算重合期间丢失的移动，
  // 因此「捏到最紧再张开」不会突然蹦一下。
  if (!Number.isFinite(dist) || dist < MIN_DIST) {
    return {
      state: { active: true, lastDist: 0, armDist: 0, armed: prev.armed },
      scale: 1,
      started: !prev.active,
      ended: false,
      armedNow: false,
      pinching: prev.armed,
    };
  }

  // 刚进入双指：只记基准，本帧不缩放；是否「有意」要等两指相对移动。
  // armPx <= 0 = 关闭阈值（老行为，供单测 / 特殊场景直接等比例缩放）。
  if (!prev.active) {
    const armed = arm <= 0;
    return {
      state: { active: true, lastDist: dist, armDist: dist, armed },
      scale: 1,
      started: true,
      ended: false,
      armedNow: false,
      pinching: armed,
    };
  }

  // 尚未确认：两指相对基准移动超过阈值才算真捏合（此时重取基准，阈值内的行程不缩放）
  if (!prev.armed) {
    // 基准无效（上一帧两指重合 / 刚换了一对指针）：只重取基准，不做阈值比较，
    // 否则 0 → 任意距离的巨大跳变会被误判成「有意捏合」。
    if (prev.armDist < MIN_DIST) {
      return {
        state: { active: true, lastDist: dist, armDist: dist, armed: false },
        scale: 1,
        started: false,
        ended: false,
        armedNow: false,
        pinching: false,
      };
    }
    if (Math.abs(dist - prev.armDist) < arm) {
      return {
        state: { active: true, lastDist: dist, armDist: prev.armDist, armed: false },
        scale: 1,
        started: false,
        ended: false,
        armedNow: false,
        pinching: false,
      };
    }
    return {
      state: { active: true, lastDist: dist, armDist: prev.armDist, armed: true },
      scale: 1,
      started: false,
      ended: false,
      armedNow: true,
      pinching: true,
    };
  }

  // 已确认：重合恢复后重新取基准，否则按两帧距离比缩放
  if (prev.lastDist < MIN_DIST) {
    return {
      state: { active: true, lastDist: dist, armDist: prev.armDist, armed: true },
      scale: 1,
      started: false,
      ended: false,
      armedNow: false,
      pinching: true,
    };
  }

  const raw = dist / prev.lastDist;
  const g = Math.max(0, Number.isFinite(gain) ? gain : 1);
  const scaled = Number.isFinite(raw) && raw > 0 ? Math.pow(raw, g) : 1;
  return {
    state: { active: true, lastDist: dist, armDist: prev.armDist, armed: true },
    scale: clamp(Number.isFinite(scaled) ? scaled : 1, lo, hi),
    started: false,
    ended: false,
    armedNow: false,
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
