import { createClock } from './adapters/clock';
import { createInput } from './adapters/input';
import type { InputFrame } from './adapters/input';
import { clampZoom } from './adapters/pinch';
import { EMPTY_INTENTS, WEAPON_ORDER, createWorld } from './core';
import type { Intents, WeaponId } from './core';
import { CORE_CONFIG, SCENE_CONFIG, VIEW_CONFIG } from './config';
import { createDebugPanel } from './presentation/debug-panel';
import type { DebugState } from './presentation/debug-panel';
import { createHud } from './presentation/hud';
import { createOverlayFold } from './presentation/overlay-fold';
import { createSceneView } from './presentation/three-scene';

const EMPTY_FRAME: InputFrame = {
  intents: { ...EMPTY_INTENTS },
  stickX: 0,
  stickY: 0,
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
  if (badge) badge.textContent = `${__APP_VERSION__} · ${__BUILD_TIME__}`;

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
  };

  let last = performance.now();
  let fps = 60;

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
    const steps = clock.frame(dt, lastFrame.intents, debug.timeScale, debug.paused);
    if (steps > 0) pendingDummyClick = 0;

    syncWeaponButtons(world.combat.weapon);
    view.render(world, dt);
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
