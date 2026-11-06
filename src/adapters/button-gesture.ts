/**
 * v9d：按钮手势识别器（纯逻辑，无 DOM、无 three，可单测）。
 *
 * 之前每个按钮各自处理 pointerdown / up，只能表达「按下 / 按住 / 抬起」，
 * 双击、长按、拖拽方向都要调用方自己拼，且松手瞬间的坐标容易被合成事件污染。
 * 这里统一成一台状态机，输出结构化手势：
 *
 *   press     按下（带起点）
 *   drag      位移首次超过 slop（带方向）
 *   longPress 按住超过阈值（只触发一次）
 *   tap       轻点抬起（位移 < slop，未触发长按）
 *   doubleTap 与上一次 tap 同按钮且间隔够短
 *   release   拖拽 / 长按后的抬起（带最终位移与方向）
 *   cancel    被系统打断
 *
 * 每条手势都带 dx/dy/distance/angleDeg/heldMs/taps，世界方向由输入层用相机基向量补。
 * 技能层只需要订阅这一个事件流，不必关心指针细节。
 */

export type GestureButton = 'attack' | 'skill2' | 'sprint' | 'jump' | 'reset';

export type GestureKind =
  | 'press' | 'drag' | 'longPress' | 'tap' | 'doubleTap' | 'release' | 'cancel';

export type ButtonGesture = {
  button: GestureButton;
  kind: GestureKind;
  /** 相对按下点的位移（屏幕像素） */
  dx: number;
  dy: number;
  distance: number;
  /** 屏幕平面方向：0° = 右，90° = 下；distance < slop 时为 0 */
  angleDeg: number;
  /** 本次按住时长（ms） */
  heldMs: number;
  /** 连续点击次数：1 = 单击，2 = 双击 */
  taps: number;
  /** 世界方向（由输入层填），零向量 = 无方向 */
  worldX: number;
  worldZ: number;
};

export type GestureConfig = {
  /** 超过该位移才算拖拽（同时取消 tap 判定） */
  slopPx: number;
  /** 按住多久触发 longPress */
  longPressMs: number;
  /** 两次 tap 间隔小于该值算双击 */
  doubleTapMs: number;
};

export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  slopPx: 12,
  longPressMs: 450,
  doubleTapMs: 280,
};

/** 相机地面基向量：把屏幕方向翻译成世界 XZ 方向 */
export type GroundDir = {
  rightX: number;
  rightZ: number;
  forwardX: number;
  forwardZ: number;
};

/**
 * 给手势补上世界方向：屏幕拖拽用与摇杆同一套基向量换算，
 * 向上拖 = 世界前方、向右拖 = 世界右方，技能层可以直接拿去当朝向 / 位移方向。
 */
export function withWorldDirection(
  g: ButtonGesture,
  b: GroundDir,
  slopPx: number = DEFAULT_GESTURE_CONFIG.slopPx,
): ButtonGesture {
  if (g.distance < slopPx) return { ...g, worldX: 0, worldZ: 0 };
  const ux = g.dx / g.distance;
  const uy = g.dy / g.distance;
  const ax = b.rightX * ux + b.forwardX * -uy;
  const az = b.rightZ * ux + b.forwardZ * -uy;
  const al = Math.hypot(ax, az);
  if (al < 1e-6) return { ...g, worldX: 0, worldZ: 0 };
  return { ...g, worldX: ax / al, worldZ: az / al };
}

type Slot = {
  button: GestureButton;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  startedAt: number;
  dragging: boolean;
  longFired: boolean;
};

export type GestureTracker = {
  begin(button: GestureButton, pointerId: number, x: number, y: number, now: number): ButtonGesture | null;
  move(pointerId: number, x: number, y: number, now: number): ButtonGesture | null;
  end(pointerId: number, x: number, y: number, now: number): ButtonGesture | null;
  cancel(pointerId: number, now: number): ButtonGesture | null;
  /** 每帧调用，负责长按超时判定 */
  poll(now: number): ButtonGesture | null;
  isHeld(button: GestureButton): boolean;
  reset(): void;
};

function gesture(
  button: GestureButton,
  kind: GestureKind,
  dx: number,
  dy: number,
  heldMs: number,
  taps: number,
): ButtonGesture {
  const distance = Math.hypot(dx, dy);
  return {
    button,
    kind,
    dx,
    dy,
    distance,
    angleDeg: distance > 1e-3 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0,
    heldMs,
    taps,
    worldX: 0,
    worldZ: 0,
  };
}

export function createGestureTracker(cfg: GestureConfig = DEFAULT_GESTURE_CONFIG): GestureTracker {
  const slots = new Map<number, Slot>();
  /** 每个按钮上一次 tap 的时间与位置，用于双击判定 */
  const lastTap = new Map<GestureButton, { at: number; x: number; y: number }>();

  const findSlot = (pointerId: number): Slot | undefined => slots.get(pointerId);

  return {
    begin(button, pointerId, x, y, now) {
      if (slots.has(pointerId)) return null;
      for (const s of slots.values()) if (s.button === button) return null;
      slots.set(pointerId, {
        button, pointerId, startX: x, startY: y, x, y,
        startedAt: now, dragging: false, longFired: false,
      });
      return gesture(button, 'press', 0, 0, 0, 1);
    },

    move(pointerId, x, y, now) {
      const s = findSlot(pointerId);
      if (!s) return null;
      s.x = x;
      s.y = y;
      const dx = x - s.startX;
      const dy = y - s.startY;
      if (!s.dragging && Math.hypot(dx, dy) >= cfg.slopPx) {
        s.dragging = true;
        return gesture(s.button, 'drag', dx, dy, now - s.startedAt, 1);
      }
      return null;
    },

    end(pointerId, x, y, now) {
      const s = findSlot(pointerId);
      if (!s) return null;
      slots.delete(pointerId);
      s.x = x;
      s.y = y;
      const dx = x - s.startX;
      const dy = y - s.startY;
      const heldMs = now - s.startedAt;
      const dist = Math.hypot(dx, dy);

      // 拖拽 / 长按之后的抬起：给最终位移，不再当 tap
      if (s.dragging || s.longFired || dist >= cfg.slopPx) {
        return gesture(s.button, 'release', dx, dy, heldMs, 1);
      }

      const prev = lastTap.get(s.button);
      const isDouble = prev !== undefined
        && now - prev.at <= cfg.doubleTapMs
        && Math.hypot(x - prev.x, y - prev.y) <= cfg.slopPx * 2;

      if (isDouble) {
        lastTap.delete(s.button);
        return gesture(s.button, 'doubleTap', dx, dy, heldMs, 2);
      }

      lastTap.set(s.button, { at: now, x, y });
      return gesture(s.button, 'tap', dx, dy, heldMs, 1);
    },

    cancel(pointerId, now) {
      const s = findSlot(pointerId);
      if (!s) return null;
      slots.delete(pointerId);
      return gesture(s.button, 'cancel', s.x - s.startX, s.y - s.startY, now - s.startedAt, 1);
    },

    poll(now) {
      for (const s of slots.values()) {
        if (s.longFired || s.dragging) continue;
        if (now - s.startedAt >= cfg.longPressMs) {
          s.longFired = true;
          return gesture(s.button, 'longPress', s.x - s.startX, s.y - s.startY, now - s.startedAt, 1);
        }
      }
      return null;
    },

    isHeld(button) {
      for (const s of slots.values()) if (s.button === button) return true;
      return false;
    },

    reset() {
      slots.clear();
      lastTap.clear();
    },
  };
}
