/**
 * 输入适配：DOM 事件（指针 / 键盘 / 滚轮 / 手势）→ `Intents`。
 *
 * 900 行里没有第二个职责 —— 全是「把某类设备翻译成同一套意图」。
 * 按设备分段（摇杆 / 捏合 / 动作按钮 / 武器按钮 / 键盘 / 滚轮）是内部组织，
 * 不是独立职责；拆成多个文件只会让共享的 `keys` / `edge` / `zoomScaleAccum` 到处传。
 *
 * 真正的算法已经抽走：`button-gesture.ts`（手势判定）、`pinch.ts`（捏合解算）。
 */
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

/** 当前视口原点（诊断用：iOS 地址栏收放会让 offsetTop 整体移动） */
function currentViewportOrigin(): { left: number; top: number } | null {
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  if (vv) return { left: vv.offsetLeft, top: vv.offsetTop };
  return typeof window !== 'undefined' ? { left: 0, top: 0 } : null;
}

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
  /**
   * v9l：摇杆的「身份 + 原点 + 手指当前位置」（都是 CSS px）。
   * 真机上出现过「手指没动、输入方向却变了」——只有把这三个量同时记下来，
   * 才能分辨到底是手指真的动了（硬件 / 系统手势），还是原点被挪了（代码）。
   */
  stickId: number | null;
  stickOriginX: number;
  stickOriginY: number;
  stickPxX: number;
  stickPxY: number;
  /** v9l：累计被拦截的可疑指针事件数（幻影 (0,0) / 单帧坐标跳变） */
  stickBad: number;
  /**
   * v9m：摇杆实际使用的坐标源。
   * - `stickScreenOk` 为 true 时，方向由**物理屏幕坐标**（screenX/Y）算出，
   *   免疫浏览器工具栏收放造成的 client 坐标漂移；
   * - 否则回落到 client 坐标（并用「坐标系平移吸收」兜底）。
   * 诊断时这四个值是判断「到底哪套坐标在漂」的唯一依据。
   */
  stickScreenOk: boolean;
  stickOriginSX: number;
  stickOriginSY: number;
  stickScreenX: number;
  stickScreenY: number;
  /** screen ↔ client 的尺度比（部分浏览器 screen 是物理像素），自适应估计 */
  stickScale: number;
  /** v9l：本帧起「视口刚变化过」的毫秒数（-1 = 从未变化），诊断用 */
  stickVpAge: number;
  /** v9l：本帧 visualViewport.offsetTop（地址栏收放会让它整体移动，诊断用） */
  stickVpTop: number;
  /**
   * v9j：辅助瞄准的原始屏幕向量（相对按钮按下点，单位 CSS px）。
   * 诊断用：日志里能直接看出「这个方向是从哪个基准量出来的」——
   * 若长度像几百 px，说明基准被污染（如 pointerdown 给 (0,0)），而不是玩家真拖了那么远。
   */
  aimDX: number;
  aimDY: number;
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
  /** v9l：只读摇杆的「身份 / 原点 / 手指位置 / 被丢弃的可疑事件数」，诊断用 */
  peekStick(): {
    id: number | null; held: boolean; originX: number; originY: number;
    x: number; y: number; dx: number; dy: number; radius: number; badMoves: number;
    /** v9m：方向是否由物理屏幕坐标计算，以及屏幕坐标那一套的原始值 */
    screenOk: boolean; originSX: number; originSY: number;
    screenX: number; screenY: number; scale: number;
  };
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
 * v9s.8 真机反馈「技能按钮的死区有点大」：26px 需要拖出半个按钮才定向，改回 16px
 * （仍大于 13px 的自然抖动，且配合 10px 的迟滞退出不会在阈值附近闪）。
 */
const AIM_SLOP_PX = 16;
/** 已确认拖拽后，缩回到该值以内才撤销瞄准（迟滞，避免在阈值附近来回闪） */
const AIM_EXIT_SLOP_PX = 10;
/** 按钮手势判定的拖拽门槛；略低于瞄准，但仍高于点按抖动，避免点按被记成 drag */
const GESTURE_SLOP_PX = 14;
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
 * UI 区域（按钮本体 + 按钮容器间隙 + 顶部武器条 / 胶囊行 / 面板栈）
 * 一律不启动隐形摇杆，也不产生 tap。
 * 认容器而不只认按钮本体，是为了避免按在按钮之间的缝隙时把那根手指当成摇杆原点。
 */
function isUiTarget(t: EventTarget | null): boolean {
  return t instanceof Element
    && t.closest('[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar') !== null;
}

/**
 * v9l：按坐标再确认一次「这一点是不是 UI」。
 * 少数 WebView / 指针捕获场景里 `e.target` 会被重定向成 canvas，
 * 于是按在按钮上的手指会被当成摇杆起点（接着整只手都在漂，方向就跟着乱）。
 * 命中 UI 就以 UI 为准 —— 按钮只可能更「UI」，不存在误判成不 UI 的风险。
 */
function isUiPoint(x: number, y: number): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  // 单测里的极简 DOM 没有 elementFromPoint：退化为「按 target 判定」即可
  if (typeof document.elementFromPoint !== 'function') return false;
  const el = document.elementFromPoint(x, y);
  return el instanceof Element && isUiTarget(el);
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
  /** 最近一次「被接受」的手指坐标（用于识别幻影事件 / 瞬移） */
  let stickPxX = 0;
  let stickPxY = 0;
  let lastMoveAt = 0;
  /** v9l：最近一次视口变化（地址栏收放 / 转屏 / 键盘）的时刻 */
  let vpChangedAt = -1;
  /** v9l：被丢弃的可疑指针事件数（幻影 (0,0) / 物理上不可能的瞬移），进诊断摘要 */
  let badMoves = 0;
  /** v9n：最近一次摇杆释放的 id / 时刻（松手瞬间的幽灵事件防御） */
  let releasedId: number | null = null;
  let releasedAt = -1;

  // ---- v9m 摇杆坐标源 ----
  /** 按下瞬间的物理屏幕坐标（与 client 原点各存一套） */
  let originSX = 0;
  let originSY = 0;
  /** 上一次被接受的物理屏幕坐标 */
  let stickPosSX = 0;
  let stickPosSY = 0;
  /**
   * 本根手指是否用屏幕坐标算方向。
   * 鸿蒙自带浏览器在工具栏收放（平滑动画，每帧只动几像素）时会把 clientY 整体平移
   * 几十像素，正好等于一个摇杆半径；任何「跳变阈值」都抓不到，但 screenX/Y 相对
   * 物理屏幕，页面重排完全不影响 —— 用它算方向，这类漂移在物理上不可能发生。
   */
  let screenOk = false;
  /** 连续「client 在动、screen 不动」的次数：达到阈值说明该浏览器 screen 不更新，回退 */
  let screenStale = 0;
  /** screen 与 client 的尺度比（部分浏览器 screen 用物理像素），用同向移动自适应校准 */
  let screenScale = 1;
  let scaleSamples = 0;

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
  /**
   * v9j：按下点是否是可用的基准。
   * 部分 WebView / 合成事件会在 pointerdown 给出 (0,0)；按钮不可能在屏幕左上角，
   * 此时若照用，aim 向量就变成「屏幕左上角 → 手指」的几百 px 向量，
   * 看起来像「摇杆向量和按钮位置被合并了」。标记为无效，等第一个真实 move 再取基准。
   */
  let aimStartValid = true;
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
        stickPxX = p.x;
        stickPxY = p.y;
        // 接手时只有 client 坐标可用，屏幕基准未知 → 本根手指先走 client 路径
        screenOk = false;
        screenStale = 0;
        screenScale = 1;
        scaleSamples = 0;
        lastMoveAt = performance.now();
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
    stickPxX = 0;
    stickPxY = 0;
    screenOk = false;
    screenStale = 0;
    screenScale = 1;
    scaleSamples = 0;
    originSX = 0;
    originSY = 0;
    stickPosSX = 0;
    stickPosSY = 0;
    releasedId = null;
    releasedAt = -1;
    tapId = null;
    tapMoved = false;
    pendingTap = null;
    aimPointerId = null;
    aimReleaseAt = -1;
    aimDX = 0;
    aimDY = 0;
    aimArmed = false;
    aimStartValid = true;
  }
  const onVisibility = (): void => {
    if (document.hidden) releaseAllInputs();
  };

  const onPointerDown = (e: PointerEvent): void => {
    // v9n：部分 WebView 在松手 / 切手势时补发坐标为 (0,0) 的 pointerdown。
    // 拿它当摇杆原点会立刻造出「屏幕左上角 → 手指」的巨大向量，方向必然跳。
    if (e.clientX === 0 && e.clientY === 0) { badMoves++; return; }
    // UI 区域：只登记 id，绝不启动摇杆、不设 tap、不参与捏合
    if (isUiTarget(e.target) || isUiPoint(e.clientX, e.clientY)) {
      uiPointers.add(e.pointerId);
      return;
    }
    // 非 UI 区按下：顺手清掉可能残留的同 id（窗口失焦漏收 pointerup 时可自愈）
    uiPointers.delete(e.pointerId);
    activePointers.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
    // 双指捏合期间不启动摇杆：第二根以后的手指只参与缩放
    if (stickId === null && !pinchActive) {
      // 这是一次真正的新按下，解除上一次松手的幽灵事件窗口
      releasedId = null;
      releasedAt = -1;
      stickId = e.pointerId;
      originX = e.clientX;
      originY = e.clientY;
      rawDX = 0;
      rawDY = 0;
      stickPxX = e.clientX;
      stickPxY = e.clientY;
      lastMoveAt = performance.now();
      // v9m：这一刻起同时维护「物理屏幕坐标」基准。screen 全零 / 非数值视为该浏览器不支持。
      const hasScreen = Number.isFinite(e.screenX) && Number.isFinite(e.screenY)
        && ((e.screenX as number) !== 0 || (e.screenY as number) !== 0);
      screenOk = hasScreen;
      screenStale = 0;
      screenScale = 1;
      scaleSamples = 0;
      originSX = hasScreen ? (e.screenX as number) : 0;
      originSY = hasScreen ? (e.screenY as number) : 0;
      stickPosSX = originSX;
      stickPosSY = originSY;
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
        if (!aimStartValid) {
          // 基准不可用：把这个点当作起点，本帧位移记 0（不产生假方向）
          aimStartX = e.clientX;
          aimStartY = e.clientY;
          aimStartValid = true;
          aimDX = 0;
          aimDY = 0;
        } else {
          aimDX = e.clientX - aimStartX;
          aimDY = e.clientY - aimStartY;
        }
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
    const nowMove = performance.now();
    // v9n：松手后 150ms 内同 id 的补发 move 一律不采信（部分 WebView 会在 up 之后
    // 补一条带旧坐标的合成事件，正好落在「松手一瞬间」）。新按下会解除这个窗口。
    if (releasedId === e.pointerId && nowMove - releasedAt < 150) { badMoves++; return; }
    const ptX = e.clientX;
    const ptY = e.clientY;
    // v9l：两类「物理上不可能」的坐标一律不进 raw：
    //  ① 幻影 (0,0)：部分 WebView / 合成事件在松手、切手势时补发坐标为 0 的 move。
    //     摇杆原点不可能在屏幕左上角，直接判假（v9j 已对瞄准做过同样的防御）。
    //  ② 单帧跳变：手指在一帧里「跑」出按 4px/ms 上限都到不了的距离。
    //     真机上的成因是坐标系整体平移（iOS 地址栏收起/展开时，同一根手指的 clientY
    //     会整体平移几十像素 ≈ 一个摇杆半径），表现就是「手指没动、方向凭空多了半个向量，
    //     再按一次又好了」。这里不丢这一帧，而是把它当成坐标系平移：**原点跟着平移同样的量**，
    //     于是 d = 手指 - 原点 保持原值 —— 方向一点都不跳；后续事件回到同一坐标系后照常工作。
    const phantom = ptX === 0 && ptY === 0 && (originX !== 0 || originY !== 0);
    if (phantom) {
      badMoves++;
      return;
    }
    const cpx = ptX - stickPxX;
    const cpy = ptY - stickPxY;
    const hasScreen = Number.isFinite(e.screenX) && Number.isFinite(e.screenY);
    const sX = hasScreen ? (e.screenX as number) : 0;
    const sY = hasScreen ? (e.screenY as number) : 0;
    // 全零的 screen 是「不支持」而不是「在屏幕左上角」：不能拿它当「物理屏幕没动」的证据，
    // 否则回退路径会把正常的 client 移动误判成坐标系平移（摇杆直接失效）。
    const screenValid = hasScreen && (sX !== 0 || sY !== 0);
    const spx = sX - stickPosSX;
    const spy = sY - stickPosSY;

    // v9m：先确认「这个浏览器的 screen 坐标到底跟不跟手指」。
    // 真实移动时 sLen 必然 > 0；若 client 一直在动而 screen 纹丝不动，说明该浏览器
    // 只是把 client 抄进 screen（或恒为 0），必须回退，否则摇杆会被冻死。
    if (screenOk && screenValid) {
      const sLen = Math.hypot(spx, spy);
      const cLen = Math.hypot(cpx, cpy);
      if (sLen > 3) {
        screenStale = 0;
        // 尺度校准只取「两套坐标同向」的样本，避免被 client 漂移污染
        if (scaleSamples < 30 && cLen > 6 && spx * cpx + spy * cpy > 0.7 * sLen * cLen) {
          const ratio = sLen / cLen;
          if (ratio > 0.2 && ratio < 5) {
            screenScale += (ratio - screenScale) * 0.3;
            scaleSamples++;
          }
        }
      } else if (cLen > 12) {
        screenStale++;
        if (screenStale >= 2) screenOk = false;
      }
    }

    const jumpLen = Math.hypot(cpx, cpy);
    if (!screenOk) {
      // 回退路径（v9l）：抓「坐标系平移」——视口刚变过，或物理屏幕没动而 client 跑了几十像素。
      // 命中就把原点平移同样的量，d = 手指 − 原点 保持原值。
      const sinceVp = vpChangedAt < 0 ? Number.POSITIVE_INFINITY : nowMove - vpChangedAt;
      const screenMoved = screenValid ? Math.hypot(spx, spy) : Infinity;
      if (jumpLen > 28 && (sinceVp < 200 || screenMoved < jumpLen * 0.4)) {
        originX += cpx;
        originY += cpy;
        badMoves++;
      }
    }

    lastMoveAt = nowMove;
    stickPxX = ptX;
    stickPxY = ptY;
    stickPosSX = sX;
    stickPosSY = sY;
    if (e.pointerId === tapId && Math.hypot(e.clientX - tapStartX, e.clientY - tapStartY) > TAP_SLOP_PX) {
      tapMoved = true;
    }

    // v9m：方向优先取屏幕坐标（相对物理屏幕，工具栏收放 / 页面重排都不影响它）。
    // 除以自适应尺度比，把「物理像素」还原成与 client 同量纲的 CSS px，摇杆半径阈值才能通用。
    let dx: number;
    let dy: number;
    if (screenOk && screenValid) {
      dx = (sX - originSX) / screenScale;
      dy = (sY - originSY) / screenScale;
    } else {
      dx = ptX - originX;
      dy = ptY - originY;
    }
    const len = Math.hypot(dx, dy);
    const r = radius();
    if (len > r) {
      dx *= r / len;
      dy *= r / len;
    }
    // v9n 最后一次防御：方向突变必须由真实手指位移支撑。
    // 遥测是 30Hz 抽样，松手那一两帧的尖峰可能整个漏采（真机摘要「异常 0」却仍看到跳变）；
    // 这里在事件层逐帧守门，不依赖坐标源是否可信：手指几乎没动却要大幅转向 → 保持上一帧。
    const prevLen = Math.hypot(rawDX, rawDY);
    const nextLen = Math.hypot(dx, dy);
    if (prevLen > 10 && nextLen > 10) {
      const dAng = Math.abs(Math.atan2(rawDX * dy - rawDY * dx, rawDX * dx + rawDY * dy));
      const arc = Math.max(prevLen, nextLen) * dAng;
      const moved = Math.max(
        Math.hypot(cpx, cpy),
        Math.hypot(spx, spy) / Math.max(0.2, screenScale),
      );
      if (dAng > 0.6 && moved < Math.max(6, arc * 0.5)) {
        badMoves++;
        return; // 坐标状态已更新，只是不改写方向
      }
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

  /** v9n：把摇杆状态清干净（id 匹配或所有非 UI 指都已抬起时都要执行） */
  function releaseStick(): void {
    if (stickId === null) return;
    releasedId = stickId;
    releasedAt = performance.now();
    stickId = null;
    rawDX = 0;
    rawDY = 0;
    stickPxX = 0;
    stickPxY = 0;
    screenOk = false;
    screenStale = 0;
    screenScale = 1;
    scaleSamples = 0;
    originSX = 0;
    originSY = 0;
    stickPosSX = 0;
    stickPosSY = 0;
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

    // v9n：某些 WebView（鸿蒙自带浏览器）给 pointerup 的 pointerId 与 pointerdown 不一致，
    // 旧逻辑只按 id 匹配清摇杆 → 松手后 stickId 残留、方向一直挂在旧向量上，
    // 直到下一次按下才被重建（真机「松手一瞬间方向变了、再按又回到 45°」）。
    // 三种情况都释放：① id 匹配；② 所有非 UI 指都抬起了；③ 收到一条「身份不明的
    // 非 UI 抬起」，而此时只剩摇杆这一根在册 —— 基本就是它的 up 被换了 id。
    const mismatchedRelease = !wasActivePointer && !wasUi
      && activePointers.size <= 1 && stickId !== null;
    if (e.pointerId === stickId || activePointers.size === 0 || mismatchedRelease) releaseStick();

    // UI 指针到此为止：不影响摇杆原点 / 方向，也不产生 tap
    if (wasUi) return;

    if (e.pointerId === tapId) {
      if (!tapMoved && !isUiTarget(e.target)) pendingTap = { x: e.clientX, y: e.clientY };
      tapId = null;
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
        aimStartValid = !(e.clientX === 0 && e.clientY === 0);
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

  // v9l：地址栏收放 / 转屏 / 键盘弹出都会先发视口变化事件，摇杆据此识别坐标系平移
  const markVpChange = (): void => { vpChangedAt = performance.now(); };
  window.addEventListener('resize', markVpChange);
  window.addEventListener('orientationchange', markVpChange);
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  if (vv) {
    vv.addEventListener('resize', markVpChange);
    vv.addEventListener('scroll', markVpChange);
  }

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
    peekStick() {
      return {
        id: stickId,
        held: stickId !== null,
        originX, originY,
        x: stickPxX, y: stickPxY,
        dx: stickPxX - originX, dy: stickPxY - originY,
        radius: radius(),
        badMoves,
        screenOk,
        originSX, originSY,
        screenX: stickPosSX, screenY: stickPosSY,
        scale: screenScale,
      };
    },

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
      // 迟滞两档：拖到 16px 才算「确认拖拽」，缩回 10px 以内才撤销。
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
        stickId, stickOriginX: originX, stickOriginY: originY, stickPxX, stickPxY,
        stickBad: badMoves,
        stickScreenOk: screenOk,
        stickOriginSX: originSX, stickOriginSY: originSY,
        stickScreenX: stickPosSX, stickScreenY: stickPosSY,
        stickScale: screenScale,
        stickVpTop: currentViewportOrigin()?.top ?? 0,
        stickVpAge: vpChangedAt < 0 ? -1 : Math.round(performance.now() - vpChangedAt),
        aimDX, aimDY,
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
      window.removeEventListener('resize', markVpChange);
      window.removeEventListener('orientationchange', markVpChange);
      if (vv) {
        vv.removeEventListener('resize', markVpChange);
        vv.removeEventListener('scroll', markVpChange);
      }
      window.removeEventListener('gesturestart', onGestureStart);
      gestureTracker.reset();
      for (const fn of cleanups) fn();
    },
  };
}
