import type { CameraZoomViewConfig, Intents } from '../core';
import { createGestureTracker, withWorldDirection } from './button-gesture';
import type { ButtonGesture, GestureButton } from './button-gesture';
import { initialPinchState, solvePinch, wheelZoomScale } from './pinch';
import type { PinchPoint, PinchState } from './pinch';

/** 相机地面基向量：把屏幕方向翻译成世界 XZ 方向。表现层计算，输入层消费。 */
export type GroundBasis = {
  rightX: number;
  rightZ: number;
  forwardX: number;
  forwardZ: number;
};

export type Tap = { x: number; y: number };

export type InputOptions = {
  /** 用 getter 而不是数值快照：调试面板改「满推行程」时无需重建输入适配器即可热生效 */
  maxRadiusPx: () => number;
  deadZone: number;
  getBasis: () => GroundBasis;
  /** v8e：缩放参数 getter，调试面板热改即时生效（不重建适配器） */
  zoom: () => CameraZoomViewConfig;
};

export type InputFrame = {
  intents: Intents;
  /** 归一化后的摇杆屏幕向量，仅供 HUD 观察（不绘制摇杆 UI） */
  stickX: number;
  stickY: number;
  /**
   * v9f：deadZone 之前的原始读数 + 摇杆指针是否按住。
   * 诊断用：区分「手指根本没动」与「动了但被死区 / 冻结逻辑吃掉」，
   * 也用来抓「第二指按下后摇杆读数被清零」这类回归。
   */
  stickRawX: number;
  stickRawY: number;
  stickHeld: boolean;
  source: string;
  /** 一次「轻点」（按下到抬起位移 < 8px），由组装层拿去做假人射线拾取 */
  tap: Tap | null;
  /** v8e：本帧相机缩放比例（>1 拉远、<1 拉近、1 = 无变化），由组装层累乘到用户倍率 */
  zoomScale: number;
  /** v9d：本帧产生的按钮手势（press / drag / longPress / tap / doubleTap / release / cancel） */
  gestures: ButtonGesture[];
  /** v9d：最近一次手势（跨帧保留，方便 HUD / 技能层读取） */
  lastGesture: ButtonGesture | null;
};

export type InputAdapter = {
  sample(): InputFrame;
  /** v9d：只读当前辅助瞄准状态（不消费边沿），供调试面板 / 自动化验收 / 技能层查询 */
  peekAim(): { active: boolean; holding: boolean; x: number; z: number; dx: number; dy: number };
  dispose(): void;
};

type BtnKey = GestureButton;
const BTN_KEYS: BtnKey[] = ['jump', 'sprint', 'reset', 'attack', 'skill2'];
const TAP_SLOP_PX = 8;
/**
 * 辅助瞄准的「确认拖拽」门槛（px）。
 * v9.9 真机日志：点按技能2 时拇指自然位移 13px，旧阈值 12px 把它当成了拖拽瞄准，
 * 于是移动方向被改成手指抖动的方向（屏幕上 -78° = 左上），松手 140ms 后才回到摇杆方向。
 * 26px 大于「点按」的正常抖动区间，又小于按钮半径的两倍，有意拖出去仍能触发。
 */
const AIM_SLOP_PX = 26;
/** 已确认拖拽后，缩回到该值以内才撤销瞄准（迟滞，避免在阈值附近来回闪） */
const AIM_EXIT_SLOP_PX = 16;
/** 按钮手势判定的拖拽门槛；略低于瞄准，但仍高于点按抖动，避免点按被记成 drag */
const GESTURE_SLOP_PX = 20;
/**
 * v9d：松手后仍保留最后拖拽方向的时长（ms）。
 * 旧版只保留 1 帧，真机上 pointerup 与下一帧之间可能插入合成 move 或系统事件，
 * 导致弓释放 / 法杖收招那一帧读到 aimActive=false，朝向退回锁定目标或 0（看起来像「面朝正下方」）。
 */
const AIM_HOLD_MS = 140;
/**
 * v9e：双指捏合的「有意手势」阈值（像素）。
 * 两指相对移动不足该值视为误触（手掌 / 拇指侧缘蹭屏），既不缩放也不影响摇杆。
 */
const PINCH_ARM_PX = 18;
/** 滚轮 deltaMode=1（行）/ 2（页）换算成像素，保证不同设备缩放速度一致 */
const WHEEL_LINE_PX = 16;
const WHEEL_PAGE_PX = 400;
/** 键盘单次缩放比例的兜底下限，防止配置写成 0 时出现除零 */
const MIN_KEY_STEP = 1.0001;

/**
 * UI 区域（按钮本体 + 按钮容器间隙 + 顶部武器条 / HUD / 提示 / 调试面板）
 * 一律不启动隐形摇杆，也不产生 tap。
 * 认容器而不只认按钮本体，是为了避免按在按钮之间的缝隙时把那根手指当成摇杆原点。
 */
function isUiTarget(t: EventTarget | null): boolean {
  return t instanceof Element
    && t.closest('[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint') !== null;
}

/**
 * 输入适配层：全屏隐形摇杆 + 按钮区 + 桌面键盘便利键 + 轻点拾取 + 双指捏合缩放。
 * 输出只有世界空间 Intents、一个屏幕 tap 坐标与本帧缩放比例；Core 不知道屏幕、按键、相机的存在。
 *
 * 多点隔离：任何在 UI 区域按下的 pointerId 会被记进 uiPointers，
 * 它的 down / move / up 全程不参与摇杆、tap 与捏合，因此按技能按钮绝不会改变移动方向或镜头。
 */
export function createInput(opts: InputOptions): InputAdapter {
  const { maxRadiusPx, deadZone, getBasis, zoom } = opts;
  const radius = (): number => Math.max(8, maxRadiusPx());

  let stickId: number | null = null;
  let originX = 0;
  let originY = 0;
  let rawDX = 0;
  let rawDY = 0;

  // tap 判定：非 UI 区域按下后几乎不移动地抬起，视为一次点击
  let tapId: number | null = null;
  let tapStartX = 0;
  let tapStartY = 0;
  let tapMoved = false;
  let pendingTap: Tap | null = null;

  // 攻击 / 技2 按钮拖拽 → 世界空间辅助瞄准方向（v7c #11）。
  // 拖拽指针用 setPointerCapture 捕获，手指移出按钮也不中断；松手后按时间保留余辉
  // （v9d：1 帧 → AIM_HOLD_MS），让「抬手释放弓 / 法杖收招」那几帧仍能读到最后拖拽方向。
  let aimPointerId: number | null = null;
  let aimStartX = 0;
  let aimStartY = 0;
  let aimDX = 0;
  let aimDY = 0;
  /** 本次按下期间是否已拖出确认阈值 —— 没确认过就是点按，抖动向量一律不生效 */
  let aimArmed = false;
  /** 最近一次松手时间（performance.now）；< 0 表示从未松手 */
  let aimReleaseAt = -1;

  /** v9d：所有按钮共用一台手势状态机（点击 / 双击 / 长按 / 拖拽方向） */
  const gestureTracker = createGestureTracker({ slopPx: GESTURE_SLOP_PX, longPressMs: 450, doubleTapMs: 350 });
  let gestureQueue: ButtonGesture[] = [];
  let lastGesture: ButtonGesture | null = null;

  /** 所有在 UI 区域按下的指针，与摇杆 / tap / 捏合完全隔离。 */
  const uiPointers = new Set<number>();

  /** 手势队列只存屏幕数据，出帧时统一用当帧相机基向量换算成世界方向 */
  function pushGesture(g: ButtonGesture | null): void {
    if (g) gestureQueue.push(g);
  }

  // ---- v8e 双指捏合缩放 ----
  /** 所有「非 UI 区域」按下的指针（Map 插入顺序 = 按下顺序），供捏合解算消费 */
  const activePointers = new Map<number, PinchPoint>();
  let pinchState: PinchState = initialPinchState();
  /** 当前是否处于双指：为 true 时新按下的指针不再被误设成摇杆 */
  let pinchActive = false;
  /** 本帧累积的缩放比例，sample() 消费后归 1 */
  let zoomScaleAccum = 1;

  /**
   * 把当前非 UI 指针集合喂给捏合解算器，累加本帧缩放比例。
   * 双指期间冻结移动摇杆（避免捏合时角色乱跑 / 方向耦合），
   * 退出双指时把剩下的单指接续为摇杆并重置原点，保证无跳变、无需抬手重按。
   */
  function syncPinch(): void {
    const points: PinchPoint[] = Array.from(activePointers.values());
    const zc = zoom();
    const step = solvePinch(pinchState, points, zc.pinchGain, zc.maxStepRatio, PINCH_ARM_PX);
    pinchState = step.state;
    pinchActive = step.pinching;
    if (step.scale !== 1) zoomScaleAccum *= step.scale;

    if (step.started || step.armedNow) {
      // 确认双指手势：只清 tap（避免松手误拾取假人）。
      // v9e：绝不在这里动摇杆 —— 旧版一进入捏合就清 stickId / 重置原点，
      // 于是「按右边按钮时手掌蹭到屏幕」会表现为移动方向突然失灵或偏移。
      // 移动输入只由「摇杆那根手指自己的 down / up」决定。
      tapId = null;
      tapMoved = true;
      pendingTap = null;
    } else if (step.ended) {
      // 双指结束：只剩一根手指时把它接续为摇杆；摇杆本来就按住时保持原样，
      // 不重新取原点（否则方向会在松手瞬间跳变）。
      if (stickId === null && points.length === 1) {
        const p = points[0];
        stickId = p.id;
        originX = p.x;
        originY = p.y;
        rawDX = 0;
        rawDY = 0;
        tapId = null;
        tapMoved = true;
        pendingTap = null;
      }
    }
  }

  const pointerHeld: Record<BtnKey, boolean> = {
    jump: false, sprint: false, reset: false, attack: false, skill2: false,
  };
  const edge = {
    jump: false,
    reset: false,
    sprintPressed: false,
    attackPressed: false,
    attackReleased: false,
    skill2: false,
  };
  let weaponSlotEdge = 0;
  let dummyClickEdge = 0;
  const btnPointer: Partial<Record<BtnKey, number>> = {};
  const keys = new Set<string>();
  const cleanups: Array<() => void> = [];

  /**
   * v9d：一次性释放所有输入状态。
   * 移动端切后台 / 来电 / 系统手势打断时常常收不到 pointerup，
   * 会导致按钮一直 held（弓卡在蓄力、冲刺停不下来）或摇杆原点残留。
   */
  function releaseAllInputs(): void {
    for (const k of BTN_KEYS) {
      if (btnPointer[k] !== undefined) btnPointer[k] = undefined;
      releaseButton(k);
    }
    gestureTracker.reset();
    uiPointers.clear();
    activePointers.clear();
    pinchState = initialPinchState();
    pinchActive = false;
    stickId = null;
    rawDX = 0;
    rawDY = 0;
    tapId = null;
    tapMoved = false;
    pendingTap = null;
    aimPointerId = null;
    aimReleaseAt = -1;
    aimDX = 0;
    aimDY = 0;
    aimArmed = false;
  }
  const onVisibility = (): void => {
    if (document.hidden) releaseAllInputs();
  };

  const onPointerDown = (e: PointerEvent): void => {
    // UI 区域：只登记 id，绝不启动摇杆、不设 tap、不参与捏合
    if (isUiTarget(e.target)) {
      uiPointers.add(e.pointerId);
      return;
    }
    // 非 UI 区按下：顺手清掉可能残留的同 id（窗口失焦漏收 pointerup 时可自愈）
    uiPointers.delete(e.pointerId);
    activePointers.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
    // 双指捏合期间不启动摇杆：第二根以后的手指只参与缩放
    if (stickId === null && !pinchActive) {
      stickId = e.pointerId;
      originX = e.clientX;
      originY = e.clientY;
      rawDX = 0;
      rawDY = 0;
      tapId = e.pointerId;
      tapStartX = e.clientX;
      tapStartY = e.clientY;
      tapMoved = false;
    }
    syncPinch();
  };

  const onPointerMove = (e: PointerEvent): void => {
    // 瞄准拖拽向量：即使该指针属于 UI 区域（按钮），也要先记录（UI 指针不参与摇杆 / tap）
    if (e.pointerId === aimPointerId) {
      // v9d：松手后浏览器可能补发 buttons=0 的合成 move；部分环境还会给出 (0,0)。
      // 这类数据一旦写进 aim，松手瞬间方向就会跳（弓 / 法杖最明显），必须过滤。
      // 注意触摸 pointermove 的 buttons 并不总是 1，不能一律用 buttons=0 判定，
      // 否则会把按住期间的正常拖动也丢掉（弓会释放到默认朝向）。
      const phantom = (e.pointerType === 'mouse' && e.buttons === 0)
        || (e.clientX === 0 && e.clientY === 0 && (aimStartX !== 0 || aimStartY !== 0));
      if (!phantom) {
        aimDX = e.clientX - aimStartX;
        aimDY = e.clientY - aimStartY;
      }
    }

    // v9d：按钮手势位移（capture 后事件仍会派发到按钮 / window，这里统一喂状态机）
    pushGesture(gestureTracker.move(e.pointerId, e.clientX, e.clientY, performance.now()));

    // v8e：非 UI 指针坐标更新并解算捏合（UI 指针不在集合内，跳过）
    if (!uiPointers.has(e.pointerId) && activePointers.has(e.pointerId)) {
      activePointers.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
      syncPinch();
    }
    if (uiPointers.has(e.pointerId)) return;
    if (e.pointerId !== stickId) return;
    if (e.pointerId === tapId && Math.hypot(e.clientX - tapStartX, e.clientY - tapStartY) > TAP_SLOP_PX) {
      tapMoved = true;
    }
    let dx = e.clientX - originX;
    let dy = e.clientY - originY;
    const len = Math.hypot(dx, dy);
    const r = radius();
    if (len > r) {
      dx *= r / len;
      dy *= r / len;
    }
    rawDX = dx;
    rawDY = dy;
  };

  function releaseButton(k: BtnKey): void {
    if (!pointerHeld[k]) return;
    pointerHeld[k] = false;
    if (k === 'attack') edge.attackReleased = true;
    const el = document.getElementById(`btn-${k}`);
    el?.classList.remove('is-down');
  }

  const onPointerUp = (e: PointerEvent): void => {
    const wasActivePointer = activePointers.delete(e.pointerId);
    const wasUi = uiPointers.delete(e.pointerId);
    // v8e：先解算捏合结束（可能把剩余单指接续为摇杆），再做下面的 tap / 摇杆清理
    if (wasActivePointer) syncPinch();

    // 瞄准拖拽结束：只有「确认拖过」的才留余辉。
    // 没确认过的是一次点按，抖动产生的向量直接清掉 —— 否则松手后 140ms 内
    // 朝向仍被锁在抖动方向（真机上表现为「松开一会儿才回到摇杆方向」）。
    if (e.pointerId === aimPointerId) {
      aimPointerId = null;
      if (aimArmed) {
        aimReleaseAt = performance.now();
      } else {
        aimDX = 0;
        aimDY = 0;
        aimReleaseAt = -1;
      }
    }

    // v9d：兜底结束手势（按钮自身已处理时返回 null）
    pushGesture(gestureTracker.end(e.pointerId, e.clientX, e.clientY, performance.now()));

    // 按钮松开：无论是否命中 UI 判定都要清掉按住态（弓蓄力靠这个释放）
    for (const k of BTN_KEYS) {
      if (btnPointer[k] === e.pointerId) {
        btnPointer[k] = undefined;
        releaseButton(k);
      }
    }

    // UI 指针到此为止：不影响摇杆原点 / 方向，也不产生 tap
    if (wasUi) return;

    if (e.pointerId === tapId) {
      if (!tapMoved && !isUiTarget(e.target)) pendingTap = { x: e.clientX, y: e.clientY };
      tapId = null;
    }
    if (e.pointerId === stickId) {
      stickId = null;
      rawDX = 0;
      rawDY = 0;
    }
  };

  // ---- 动作按钮 ----
  for (const k of BTN_KEYS) {
    const el = document.getElementById(`btn-${k}`);
    if (!el) continue;

    const aimable = k === 'attack' || k === 'skill2';
    const down = (e: PointerEvent): void => {
      e.preventDefault();
      // 同一按钮已有手指按住：忽略第二根手指，避免状态被覆盖后 up 收不到
      if (btnPointer[k] !== undefined) return;
      btnPointer[k] = e.pointerId;
      pointerHeld[k] = true;
      if (k === 'jump') edge.jump = true;
      if (k === 'reset') edge.reset = true;
      if (k === 'sprint') edge.sprintPressed = true;
      if (k === 'attack') edge.attackPressed = true;
      if (k === 'skill2') edge.skill2 = true;
      el.classList.add('is-down');
      pushGesture(gestureTracker.begin(k, e.pointerId, e.clientX, e.clientY, performance.now()));

      // v9d：所有按钮都捕获指针。旧版只有可瞄准按钮捕获，其余按钮滑出圆外会收到
      // pointerleave 被当成松手（冲刺按到一半就停），也让抬手位置不可靠。
      try { el.setPointerCapture(e.pointerId); } catch { /* 不支持时退化为按钮内拖拽 */ }

      if (aimable) {
        aimPointerId = e.pointerId;
        aimStartX = e.clientX;
        aimStartY = e.clientY;
        aimDX = 0;
        aimDY = 0;
        aimArmed = false;
        aimReleaseAt = -1;
      }
    };
    const up = (e: PointerEvent): void => {
      if (btnPointer[k] !== e.pointerId) return;
      btnPointer[k] = undefined;
      releaseButton(k);
      pushGesture(gestureTracker.end(e.pointerId, e.clientX, e.clientY, performance.now()));
    };
    const cancel = (e: PointerEvent): void => {
      if (btnPointer[k] !== e.pointerId) return;
      btnPointer[k] = undefined;
      releaseButton(k);
      pushGesture(gestureTracker.cancel(e.pointerId, performance.now()));
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', cancel);
    cleanups.push(() => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', cancel);
    });
  }

  // ---- 武器选择按钮（1..5） ----
  const weaponButtons = Array.from(document.querySelectorAll<HTMLElement>('.wp[data-weapon]'));
  for (const el of weaponButtons) {
    const down = (e: PointerEvent): void => {
      e.preventDefault();
      weaponSlotEdge = Number(el.dataset.weapon) || 0;
    };
    el.addEventListener('pointerdown', down);
    cleanups.push(() => el.removeEventListener('pointerdown', down));
  }

  // ---- 键盘 ----
  const onKeyDown = (e: KeyboardEvent): void => {
    const k = e.key.toLowerCase();
    if (k === ' ' || k.startsWith('arrow')) e.preventDefault();
    if (keys.has(k)) return;
    keys.add(k);
    if (k === ' ') edge.jump = true;
    if (k === 'r') edge.reset = true;
    if (k === 'shift') edge.sprintPressed = true;
    if (k === 'j') edge.attackPressed = true;
    if (k === 'k') edge.skill2 = true;
    if (k >= '1' && k <= '5') weaponSlotEdge = Number(k);
    if (k >= '6' && k <= '9') dummyClickEdge = Number(k) - 5;
    // v8e：桌面等价缩放（= / + 拉远，- / _ 拉近）；keys 去重，长按不重复触发
    const ks = Math.max(MIN_KEY_STEP, zoom().keyStep || 1.12);
    if (k === '=' || k === '+') zoomScaleAccum *= ks;
    if (k === '-' || k === '_') zoomScaleAccum /= ks;
  };
  const onKeyUp = (e: KeyboardEvent): void => {
    const k = e.key.toLowerCase();
    if (!keys.has(k)) return;
    keys.delete(k);
    if (k === 'j') edge.attackReleased = true;
  };

  // ---- v8e 滚轮缩放（桌面等价输入） ----
  const onWheel = (e: WheelEvent): void => {
    // 调试面板等 UI 区域要能正常滚动，不拦截也不缩放
    if (isUiTarget(e.target)) return;
    e.preventDefault();
    const dy = e.deltaMode === 1
      ? e.deltaY * WHEEL_LINE_PX
      : e.deltaMode === 2 ? e.deltaY * WHEEL_PAGE_PX : e.deltaY;
    zoomScaleAccum *= wheelZoomScale(dy, zoom().wheelStep);
  };

  // iOS Safari 专有的双指手势事件：即便页面已设 touch-action:none / user-scalable=no，
  // 系统辅助缩放仍可能接管 pinch。这里兜底阻止默认手势，保证两指 pointer 事件完整
  // 派发到自定义解算器；UI 区域放行，调试面板等仍可正常用系统手势。
  const onGestureStart = (e: Event): void => {
    // v9e：不再放过 UI 区域。手指同时落在「摇杆 + 按钮」上时，iOS 的系统捏合
    // 会接管页面并给已经按下的手指补 pointercancel，表现就是移动方向被掐断。
    e.preventDefault();
  };

  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('blur', releaseAllInputs);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('gesturestart', onGestureStart);

  return {
    peekAim() {
      const now = performance.now();
      const len = Math.hypot(aimDX, aimDY);
      const holding = aimPointerId !== null
        || (aimReleaseAt >= 0 && now - aimReleaseAt < AIM_HOLD_MS);
      const active = holding && aimArmed && len >= AIM_EXIT_SLOP_PX;
      if (!active) return { active: false, holding, x: 0, z: 0, dx: aimDX, dy: aimDY };
      const b = getBasis();
      const ux = aimDX / len;
      const uy = aimDY / len;
      const ax = b.rightX * ux + b.forwardX * -uy;
      const az = b.rightZ * ux + b.forwardZ * -uy;
      const al = Math.hypot(ax, az) || 1;
      return { active: true, holding, x: ax / al, z: az / al, dx: aimDX, dy: aimDY };
    },

    sample(): InputFrame {
      const r = radius();
      let sx = stickId !== null ? Math.max(-1, Math.min(1, rawDX / r)) : 0;
      let sy = stickId !== null ? Math.max(-1, Math.min(1, rawDY / r)) : 0;

      let kx = 0;
      let ky = 0;
      if (keys.has('a') || keys.has('arrowleft')) kx -= 1;
      if (keys.has('d') || keys.has('arrowright')) kx += 1;
      if (keys.has('w') || keys.has('arrowup')) ky -= 1;
      if (keys.has('s') || keys.has('arrowdown')) ky += 1;
      sx += kx;
      sy += ky;

      let len = Math.hypot(sx, sy);
      if (len > 1) {
        sx /= len;
        sy /= len;
        len = 1;
      }
      // v9f：死区前的读数留一份给诊断记录（死区会把它清零，事后无法区分「没动」和「被吃掉」）
      const rawSx = sx;
      const rawSy = sy;
      if (len < deadZone) {
        sx = 0;
        sy = 0;
      }

      const b = getBasis();
      let mx = b.rightX * sx + b.forwardX * -sy;
      let mz = b.rightZ * sx + b.forwardZ * -sy;
      const ml = Math.hypot(mx, mz);
      if (ml > 1) {
        mx /= ml;
        mz /= ml;
      }

      // v9d：长按判定（每帧一次，按住超过阈值只触发一次）
      const now = performance.now();
      pushGesture(gestureTracker.poll(now));

      // 拖拽辅助瞄准（v7c #11）：屏幕拖拽 (dx,dy) 用同一套相机地面基向量换算成世界 XZ 单位向量，
      // 与摇杆语义一致（向上拖 = 世界前方、向右拖 = 世界右方）。
      const aimLen = Math.hypot(aimDX, aimDY);
      // 迟滞两档：拖到 26px 才算「确认拖拽」，缩回 16px 以内才撤销。
      // 点按按钮时 10~15px 的自然位移永远够不到，因此不会改动朝向。
      if (aimPointerId !== null) {
        if (aimLen >= AIM_SLOP_PX) aimArmed = true;
        else if (aimLen < AIM_EXIT_SLOP_PX) aimArmed = false;
      }
      const aimHolding = aimPointerId !== null
        || (aimReleaseAt >= 0 && now - aimReleaseAt < AIM_HOLD_MS);
      const aiming = aimHolding && aimArmed && aimLen >= AIM_EXIT_SLOP_PX;
      let aimX = 0;
      let aimZ = 0;
      if (aiming) {
        const ux = aimDX / aimLen;
        const uy = aimDY / aimLen;
        const ax = b.rightX * ux + b.forwardX * -uy;
        const az = b.rightZ * ux + b.forwardZ * -uy;
        const al = Math.hypot(ax, az) || 1;
        aimX = ax / al;
        aimZ = az / al;
      }
      // 余辉结束后清空拖拽向量，避免朝向被旧方向长期锁住
      if (!aimHolding && aimPointerId === null) {
        aimDX = 0;
        aimDY = 0;
        aimReleaseAt = -1;
        aimArmed = false;
      }

      const tap = pendingTap;
      pendingTap = null;
      const zoomScale = zoomScaleAccum;
      zoomScaleAccum = 1;

      const intents: Intents = {
        moveX: mx,
        moveZ: mz,
        jumpPressed: edge.jump,
        sprintHeld: pointerHeld.sprint || keys.has('shift'),
        sprintPressed: edge.sprintPressed,
        resetPressed: edge.reset,
        attackPressed: edge.attackPressed,
        attackHeld: pointerHeld.attack || keys.has('j'),
        attackReleased: edge.attackReleased,
        skill2Pressed: edge.skill2,
        weaponSlot: weaponSlotEdge,
        dummyClickId: dummyClickEdge,
        aimX,
        aimZ,
        aimActive: aiming,
      };

      edge.jump = false;
      edge.reset = false;
      edge.sprintPressed = false;
      edge.attackPressed = false;
      edge.attackReleased = false;
      edge.skill2 = false;
      weaponSlotEdge = 0;
      dummyClickEdge = 0;

      // v9d：出帧时补世界方向（技能层可直接当朝向 / 位移方向用）
      const gestures = gestureQueue.map((g) => withWorldDirection(g, b, GESTURE_SLOP_PX));
      gestureQueue = [];
      if (gestures.length > 0) lastGesture = gestures[gestures.length - 1];

      const source = stickId !== null ? 'pointer' : keys.size > 0 ? 'keyboard' : 'idle';
      return {
        intents, stickX: sx, stickY: sy,
        stickRawX: rawSx, stickRawY: rawSy, stickHeld: stickId !== null,
        source, tap, zoomScale, gestures, lastGesture,
      };
    },

    dispose(): void {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', releaseAllInputs);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('gesturestart', onGestureStart);
      gestureTracker.reset();
      for (const fn of cleanups) fn();
    },
  };
}
