import { createClock } from './adapters/clock';
import { createInput } from './adapters/input';
import type { InputFrame } from './adapters/input';
import { clampZoom } from './adapters/pinch';
import { createRecorder } from './adapters/telemetry';
import { EMPTY_INTENTS, WEAPON_ORDER, createWorld } from './core';
import type { Intents, WeaponId } from './core';
import { CORE_CONFIG, SCENE_CONFIG, VIEW_CONFIG } from './config';
import { createDebugPanel } from './presentation/debug-panel';
import type { DebugState } from './presentation/debug-panel';
import { createDirDebug } from './presentation/dir-debug';
import { createHud } from './presentation/hud';
import { createOverlayFold } from './presentation/overlay-fold';
import { createSceneView } from './presentation/three-scene';
import { createTelemetryPanel } from './presentation/telemetry-panel';

const EMPTY_FRAME: InputFrame = {
  intents: { ...EMPTY_INTENTS },
  stickX: 0,
  stickY: 0,
  stickRawX: 0,
  stickRawY: 0,
  stickHeld: false,
  stickId: null,
  stickOriginX: 0,
  stickOriginY: 0,
  stickPxX: 0,
  stickPxY: 0,
  stickBad: 0,
  stickScreenOk: false,
  stickOriginSX: 0,
  stickOriginSY: 0,
  stickScreenX: 0,
  stickScreenY: 0,
  stickScale: 1,
  stickVpTop: 0, stickVpAge: -1,
  aimDX: 0,
  aimDY: 0,
  source: 'idle',
  tap: null,
  zoomScale: 1,
  gestures: [],
  lastGesture: null,
};

export function startApp(): void {
  const container = document.getElementById('app');
  const hudEl = document.getElementById('hud');
  if (!container || !hudEl) throw new Error('缺少 #app / #hud 容器');

  // 组装层是唯一同时认识 Core 与 Web 的地方；换平台时只重写这一层。
  const world = createWorld(CORE_CONFIG, SCENE_CONFIG);
  const view = createSceneView(container, world, VIEW_CONFIG);
  const clock = createClock(world);
  const hud = createHud(hudEl);
  // v9c：状态读数 / 操作说明默认收起，开始操作自动收回
  const fold = createOverlayFold(hudEl, document.getElementById('hint'));
  // v9e：左下角版本徽标（构建期注入，重新构建才会变）—— 一眼确认线上跑的是哪一版
  const badge = document.getElementById('version-badge');
  if (badge) badge.textContent = `${__APP_VERSION__} · ${__BUILD_TIME__} · 诊断`;

  // v9f：发布端飞行记录仪。真机出问题时点徽标 →「复制摘要」，不必开控制台。
  // 只读 World、纯内存环形缓冲、默认不上传；详见 adapters/telemetry.ts。
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const opened = new Date();
  const recorder = createRecorder({
    meta: {
      version: __APP_VERSION__,
      buildTime: __BUILD_TIME__,
      startedAt: `${pad2(opened.getMonth() + 1)}-${pad2(opened.getDate())} ${pad2(opened.getHours())}:${pad2(opened.getMinutes())}`,
      ua: navigator.userAgent.slice(0, 90),
      screen: `${window.innerWidth}×${window.innerHeight}`,
      dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      cores: navigator.hardwareConcurrency || 0,
    },
  });
  const diagPanel = createTelemetryPanel(recorder, badge);

  // v9k：临时方向调试盘（输入 / 移动 / 面朝向三个角度同屏对照）。
  // 纯观测层，只读 World 与 InputFrame；删掉 createDirDebug 与本段即可完全移除。
  const dirDebug = createDirDebug({ deadZone: () => VIEW_CONFIG.joystick.deadZone });
  // 切后台回来时不要把它当成「单帧 300ms」的掉帧异常
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) recorder.suspend(800);
  });

  const debug: DebugState = {
    timeScale: 1,
    paused: false,
    showColliders: VIEW_CONFIG.showColliders,
    showGrid: VIEW_CONFIG.showGrid,
  };

  // v8e：用户缩放倍率（纯表现层状态，不进 Core / 快照）；游戏复位时归 1
  let userZoom = 1;

  const input = createInput({
    maxRadiusPx: () => VIEW_CONFIG.joystick.maxRadiusPx,
    deadZone: VIEW_CONFIG.joystick.deadZone,
    getBasis: () => view.getGroundBasis(),
    zoom: () => VIEW_CONFIG.zoom,
  });

  // 武器按钮高亮以 Core 状态为准（键盘、屏幕按钮、调试面板三种入口都能同步）
  const weaponButtons = Array.from(document.querySelectorAll<HTMLElement>('.wp[data-weapon]'));
  let lastWeapon: WeaponId = world.combat.weapon;
  function syncWeaponButtons(weapon: WeaponId): void {
    if (weapon === lastWeapon) return;
    lastWeapon = weapon;
    const slot = WEAPON_ORDER.indexOf(weapon) + 1;
    for (const el of weaponButtons) {
      el.classList.toggle('is-active', Number(el.dataset.weapon) === slot);
    }
    panel.refreshWeapon();
  }

  let lastFrame: InputFrame = EMPTY_FRAME;
  // 点击沿事件必须喂进一个 step 才算消费；暂停 / 低帧率时暂存到下一帧，避免丢输入
  let pendingDummyClick = 0;

  const panel = createDebugPanel(world, VIEW_CONFIG, debug, {
    singleStep: () => clock.singleStep(lastFrame.intents),
    reset: () => {
      userZoom = 1;
      clock.singleStep({ ...EMPTY_INTENTS, resetPressed: true });
    },
    resetZoom: () => {
      userZoom = 1;
      view.setZoom(1);
    },
    onToggleColliders: (v) => view.setCollidersVisible(v),
    onToggleGrid: (v) => view.setGridVisible(v),
  });

  window.addEventListener('resize', () => view.resize());

  // 玩法实验台的调试钩子：浏览器控制台 / 自动化验收可直接读状态、投影坐标，
  // 以及热改表现层配置（相机、特效时长等），无需重编译
  (window as unknown as { __harness?: unknown }).__harness = {
    world, view, clock, input, viewConfig: VIEW_CONFIG,
    getUserZoom: () => userZoom,
    // v9d：手势接口读数，技能层 / 自动化验收可直接订阅最近一次手势
    getGestures: () => lastFrame.gestures,
    getLastGesture: () => lastFrame.lastGesture,
    // v9f：诊断记录（控制台 / 自动化验收都能直接取摘要或完整 dump）
    telemetry: recorder,
    telemetrySummary: () => recorder.summary(),
    // v9k：方向调试盘（控制台 / 自动化可读当前三个角，或直接开关）
    dirDebug,
    dirAngles: () => dirDebug.last(),
  };

  let last = performance.now();
  let fps = 60;
  let lastDiagTick = 0;

  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (dt > 0) fps = fps * 0.9 + (1 / dt) * 0.1;

    const sampled = input.sample();
    // v8e：把本帧捏合 / 滚轮 / 快捷键比例累乘到用户倍率并限幅；复位归 1。
    // 缩放是纯表现层状态，不喂进 Intents，也不影响 Core 的确定性 / 快照。
    if (sampled.intents.resetPressed) userZoom = 1;
    userZoom = clampZoom(userZoom, sampled.zoomScale, VIEW_CONFIG.zoom.min, VIEW_CONFIG.zoom.max);
    view.setZoom(userZoom);

    let clickId = sampled.intents.dummyClickId;
    if (sampled.tap) {
      const picked = view.pickDummy(sampled.tap.x, sampled.tap.y);
      if (picked > 0) clickId = picked;
    }
    if (clickId > 0) pendingDummyClick = clickId;

    lastFrame = {
      ...sampled,
      intents: { ...sampled.intents, dummyClickId: pendingDummyClick } as Intents,
    };
    // v9f：逐步收集事件（掉帧补算多步时只有最后一步的留在 world.events 里）
    const steps = clock.frame(dt, lastFrame.intents, debug.timeScale, debug.paused, () => {
      const list = world.events;
      for (let i = 0; i < list.length; i++) recorder.event(list[i], world.time);
    });
    if (steps > 0) pendingDummyClick = 0;
    recorder.sample(world, lastFrame, dt * 1000, steps);
    for (const g of lastFrame.gestures) recorder.gesture(g);
    if (now - lastDiagTick > 250) {
      lastDiagTick = now;
      diagPanel.tick();
    }

    syncWeaponButtons(world.combat.weapon);
    view.render(world, dt);
    dirDebug.update(world, lastFrame, view.getGroundBasis());
    const diag = view.diagnostics();
    hud.update(world, fps, steps, lastFrame, debug, {
      attackBlend: diag.attackBlend,
      attackWeights: diag.attackWeights,
      landing: diag.landing,
      hurt: diag.hurt,
      ik: diag.ik,
      zoom: diag.camera.zoom,
    }, fold.hudCompact());
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
