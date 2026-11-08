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
import { createLabPanel } from './presentation/lab-panel';
import { createMotionDebug } from './presentation/motion-debug';
import { createHud } from './presentation/hud';
import { createPanelRow } from './presentation/overlay-fold';
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
  const view = createSceneView(container, world, VIEW_CONFIG, SCENE_CONFIG.stations);
  const clock = createClock(world);
  const hud = createHud(hudEl);
  // v9r：状态 / 手感 / 调试收成一排胶囊，默认全部收起；v9s：点画布不再自动收起，
  //      展开后持续显示，方便边移动边看读数 / 速度曲线
  const fold = createPanelRow(hudEl);
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

  // v9r：手感调试面板 = 实际位移速度曲线 + 方向罗盘；胶囊与容器由统一胶囊行提供，
  // 纯观测层只读 World / InputFrame；默认收起，点「手感」胶囊或按 V 展开。
  const motionDebug = createMotionDebug({
    deadZone: () => VIEW_CONFIG.joystick.deadZone,
    container: document.getElementById('motiondbg') ?? undefined,
    toggle: document.getElementById('motiondbg-toggle') ?? undefined,
  });
  // 切后台回来时不要把它当成「单帧 300ms」的掉帧异常
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) recorder.suspend(800);
  });

  const debug: DebugState = {
    timeScale: 1,
    paused: false,
    showColliders: VIEW_CONFIG.showColliders,
    showGrid: VIEW_CONFIG.showGrid,
    showLab: VIEW_CONFIG.lab.enabled,
    showLabLabels: VIEW_CONFIG.lab.showLabels,
  };

  // v8e：用户缩放倍率（纯表现层状态，不进 Core / 快照）；游戏复位时归 1
  let userZoom = 1;
  /** v9s.27 clip 工具台：锁住画面，主循环不再刷姿态（否则截图抓到的是下一帧待机）。 */
  let clipHold = false;

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

  /** v8e：用户缩放归 1（恢复基础镜头距离），调试面板与工位面板共用同一份实现 */
  const resetZoom = (): void => {
    userZoom = 1;
    view.setZoom(1);
  };

  const panel = createDebugPanel(world, VIEW_CONFIG, debug, {
    singleStep: () => clock.singleStep(lastFrame.intents),
    reset: () => {
      userZoom = 1;
      clock.singleStep({ ...EMPTY_INTENTS, resetPressed: true });
    },
    resetZoom,
    onToggleColliders: (v) => view.setCollidersVisible(v),
    onToggleGrid: (v) => view.setGridVisible(v),
    onToggleLab: (v) => view.setLabVisible(v),
    onToggleLabLabels: (v) => view.setLabLabelsVisible(v),
  });

  // v9s.15：测试工位 —— 点名字直接传送到该工位的落点，相机瞬移不滑行；
  // 桌面端 [ / ] 循环、\ 召回假人。传送只清玩家侧瞬时状态，不重开一局。
  const lab = createLabPanel({
    stations: SCENE_CONFIG.stations ?? [],
    world,
    view,
    onResetZoom: resetZoom,
  });

  // v9r：把两个后创建的面板控制钩子交给胶囊行，显隐 / 文案只有这一份状态源
  fold.register({ motion: motionDebug, debug: panel.gui });

  window.addEventListener('resize', () => view.resize());

  // 玩法实验台的调试钩子：浏览器控制台 / 自动化验收可直接读状态、投影坐标，
  // 以及热改表现层配置（相机、特效时长等），无需重编译
  // v9s.30：体型切换（B 键）。放在 window 上而不是 InputFrame 里 —— 体型是纯表现层
  // 选项，不该进 Core 的 intents / 快照；切换时只重建骨架，角色位置与状态都不动。
  const bodyIds = view.bodyTypes().ids;
  let bodyIdx = 0;
  const toast = document.createElement('div');
  toast.style.cssText = [
    'position:fixed', 'left:50%', 'top:14px', 'transform:translateX(-50%)',
    'padding:6px 14px', 'border-radius:999px', 'font:600 13px/1.4 system-ui,sans-serif',
    'color:#0b1620', 'background:#8fd0ff', 'box-shadow:0 4px 16px rgba(0,0,0,.35)',
    'opacity:0', 'transition:opacity .18s', 'pointer-events:none', 'z-index:99',
  ].join(';');
  document.body.appendChild(toast);
  let toastTimer = 0;
  const showToast = (text: string): void => {
    toast.textContent = text;
    toast.style.opacity = '1';
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.style.opacity = '0'; }, 1600);
  };
  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.code !== 'KeyB' || bodyIds.length < 2) return;
    bodyIdx = (bodyIdx + 1) % bodyIds.length;
    const next = view.setBodyType(bodyIds[bodyIdx]);
    const cfg = VIEW_CONFIG.bodyTypes?.[next];
    showToast(`体型：${cfg?.name ?? next}（B 切换）`);
  });

  (window as unknown as { __harness?: unknown }).__harness = {
    world, view, clock, input, viewConfig: VIEW_CONFIG, debug,
    getUserZoom: () => userZoom,
    // v9d：手势接口读数，技能层 / 自动化验收可直接订阅最近一次手势
    getGestures: () => lastFrame.gestures,
    getLastGesture: () => lastFrame.lastGesture,
    // v9f：诊断记录（控制台 / 自动化验收都能直接取摘要或完整 dump）
    telemetry: recorder,
    telemetrySummary: () => recorder.summary(),
    // v9k：方向罗盘（现已嵌入手感面板；接口保持不变）
    dirDebug: motionDebug.dirDebug,
    dirAngles: () => motionDebug.dirDebug.last(),
    // v9q：速度曲线读数 / 窗口样本 / 面板开关，供线上验收直接取数值
    motionDebug,
    speedDebug: () => motionDebug.last(),
    speedSamples: () => motionDebug.samples(),
    // v9n：停步收相 / 侧移偏转 / 双腿姿态读数（验收用手感诊断）
    gaitDebug: () => view.gaitDebug(),
    // v9s.23：挥击姿态（段号 / 方向 / 躯干三轴 / 肩部位移）
    swingDebug: () => view.swingDebug(),
    // v9s.26：刃身两端世界坐标（验收横扫仰角，避免被斜俯视截图误导）
    bladeWorld: () => view.bladeWorld(),
    projectPoint: (x: number, y: number, z: number) => view.projectPoint(x, y, z),
    // v9s.30：体型切换（B 键同一入口），验收可直接看长腿 / 长臂下的姿态
    setBodyType: (id: string) => view.setBodyType(id),
    bodyTypes: () => view.bodyTypes(),
    bladesWorld: () => view.bladesWorld(),
    /**
     * v9s.27 clip 工具台：把表现层定格到「某武器 · 某连击段 · 某进度」。
     * 只改 combat 的表现入参并跑真实 render()，不推进 Core、不触发判定 ——
     * 因此读到的手臂链 / 挂点反解 / 刀光全都是真机链路，不是另算一套。
     */
    clipLab: {
      clips: () => Object.keys(VIEW_CONFIG.animation.swing?.clips ?? {}),
      preview: (opts: {
        weapon: WeaponId; comboIndex: number; progress: number; warm?: number;
        /** v9s.28：直接指定剪辑时间轴 0..1（不给则用 progress 过 swingCurve 的真实映射） */
        t?: number;
      }) => {
        const cb = world.combat;
        const saved = { ...cb };
        cb.weapon = opts.weapon;
        cb.phase = 'active';
        cb.comboIndex = Math.max(1, Math.min(3, Math.floor(opts.comboIndex)));
        cb.attackProgress = Math.max(0, Math.min(1, opts.progress));
        cb.attackFacing = world.character.bodyYaw;
        // v9s.28：指定 t 时绕过 swingCurve。否则 progress=0.5 实际采样的是剪辑 t=1，
        // 工具改中段关键帧会「看着没反应」。
        view.setClipT(typeof opts.t === 'number' ? opts.t : null);
        // 多渲染几帧让腕部滞后 / 副手握持 IK 收敛到稳态，避免读到过渡帧
        const warm = Math.max(1, Math.min(30, Math.floor(opts.warm ?? 12)));
        clipHold = true; // 先锁画面，再逐帧渲染到目标姿态
        for (let i = 0; i < warm; i++) view.render(world, 1 / 60);
        view.setClipT(null);
        Object.assign(cb, saved);
        return { ...view.swingDebug(), blade: view.bladeWorld(), blades: view.bladesWorld() };
      },
      /** 固定朝向，保证不同进度截图可比（不写 Core，只写表现层读的那个值） */
      face: (yaw: number) => { world.character.bodyYaw = yaw; },
      /** 推近 / 拉远（纯表现层，等价于滚轮缩放） */
      zoom: (z: number) => {
        userZoom = clampZoom(z, 1, VIEW_CONFIG.zoom.min, VIEW_CONFIG.zoom.max);
        view.setZoom(userZoom);
      },
      /** 解锁画面，交还主循环 */
      release: () => { clipHold = false; },
    },
    // v9s.24：腕部滞后读数（武器相对手的自由度）
    weaponDebug: () => view.weaponDebug(),
    gripDebug: () => view.gripDebug(),
    // v9s.15：测试工位 —— 自动化验收可直接 goto 逐个工位截图 / 取状态
    lab: {
      stations: SCENE_CONFIG.stations ?? [],
      goto: (id: string | number) => lab.goto(id),
      current: () => lab.current(),
      recall: () => lab.recall(),
    },
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
    if (!clipHold) view.render(world, dt);
    lab.tick();
    motionDebug.update(world, lastFrame, view.getGroundBasis());
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
