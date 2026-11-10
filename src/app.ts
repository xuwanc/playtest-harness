import { createClock } from './adapters/clock';
import { applyPose, blendPose, canInterpolate, capturePose } from './adapters/pose-interp';
import type { PoseSnapshot } from './adapters/pose-interp';
import { createInput } from './adapters/input';
import type { InputFrame } from './adapters/input';
import { clampZoom } from './adapters/pinch';
import { createRecorder } from './adapters/telemetry';
import {
  EMPTY_INTENTS, WEAPON_ORDER, applyHit, clearPlotTestUnits, createWorld,
  destructiblesReset, forceBreak, plotTestUnitCount, spawnPlotTestUnits,
} from './core';
import type { HurtType, Intents, WeaponId } from './core';
import { CORE_CONFIG, SCENE_CONFIG, VIEW_CONFIG, PLOTS, PLOT_ASSEMBLY } from './config';
import { createDebugPanel } from './presentation/debug-panel';
import type { DebugState } from './presentation/debug-panel';
import { createLabPanel } from './presentation/lab-panel';
import { createMotionDebug } from './presentation/motion-debug';
import { createHud, hudDebug } from './presentation/hud';
import { createButtonStatusView } from './presentation/button-status';
import { createPerfMeter } from './presentation/perf-meter';
import { SHAKE_PRESETS } from './presentation/shake';
import { describeSkillIndicators } from './presentation/skill-indicator';
import { createPanelRow } from './presentation/overlay-fold';
import { createSceneView } from './presentation/three-scene';
import { createTelemetryPanel } from './presentation/telemetry-panel';
import { createWardrobeView } from './presentation/wardrobe';

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
  const perfEl = document.getElementById('perf-meter');
  if (!container || !hudEl || !perfEl) throw new Error('缺少 #app / #hud / #perf-meter 容器');

  // 组装层是唯一同时认识 Core 与 Web 的地方；换平台时只重写这一层。
  const world = createWorld(CORE_CONFIG, SCENE_CONFIG);
  const view = createSceneView(
    container, world, VIEW_CONFIG, SCENE_CONFIG.stations, SCENE_CONFIG.slabs,
  );
  const clock = createClock(world);
  const hud = createHud(hudEl);
  // v9s.x：常驻性能条（帧率 / 帧时间 / 慢帧 / sparkline）。独立于 HUD 折叠，
  // 任何面板收起时都能看到是否掉帧；纯观测，不进 Core / 快照。
  const perfMeter = createPerfMeter(perfEl);
  // v9s.x：操作按钮状态层（冷却 / 蓄力 / 引导 / 冲刺 / 空中）。只读 World，
  // 每帧按需写 DOM，不碰 Core 确定性。
  const buttonStatus = createButtonStatusView();
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

  // v9s.x：装备 / 外观展示界面。纯表现层、惰性创建独立 WebGL 转台，
  // 不写 World、不进主循环 / 确定性快照；入口胶囊挂在顶部 #panel-row。
  // v9s.69：getCharacterConfig 实时读当前体型，让展示界面匹配主场景所选角色。
  const wardrobe = createWardrobeView({
    view: VIEW_CONFIG,
    moveSpeed: world.config.moveSpeed,
    toggleButton: document.getElementById('wardrobe-toggle'),
    getCharacterConfig: () => {
      const id = view.bodyTypes().id;
      const bt = VIEW_CONFIG.bodyTypes?.[id];
      if (!bt) return { id, name: id, voxel: VIEW_CONFIG.voxel, colors: VIEW_CONFIG.colors };
      return {
        id,
        name: bt.name ?? id,
        voxel: bt.voxel ?? VIEW_CONFIG.voxel,
        colors: bt.colors ? { ...VIEW_CONFIG.colors, ...bt.colors } : VIEW_CONFIG.colors,
      };
    },
  });

  // v9r：手感调试面板 = 实际位移速度曲线 + 方向罗盘；胶囊与容器由统一胶囊行提供，
  // 纯观测层只读 World / InputFrame；默认收起，点「手感」胶囊或按 V 展开。
  const motionDebug = createMotionDebug({
    deadZone: () => VIEW_CONFIG.joystick.deadZone,
    container: document.getElementById('motiondbg') ?? undefined,
    toggle: document.getElementById('motiondbg-toggle') ?? undefined,
    // v9s.42：相位取「真正喂给 solveGait 的那个」，攻击段由等效跨步驱动在走，
    // Core 的 gaitPhase 在这段时间是冻住的，拿它画曲线会是一条平线。
    phaseSource: () => view.gaitDebug().phase,
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
    // v9s.38：把三个持械陪练一次切到同一行为（调试混战强度时不用逐个点）
    setFighterMode: (mode) => {
      for (const d of world.dummies) {
        if (!d.weapon) continue;
        d.mode = mode;
        d.attackPhase = 'idle';
        d.attackPhaseTimer = 0;
        d.attackProgress = 0;
        d.attackCooldown = 0;
        if (d.combat) {
          d.combat.phase = 'idle';
          d.combat.attackProgress = 0;
          d.combat.comboIndex = 0;
        }
      }
    },
  });

  // v9s.15：测试工位 —— 点名字直接传送到该工位的落点，相机瞬移不滑行；
  // 桌面端 [ / ] 循环、\ 召回假人。传送只清玩家侧瞬时状态，不重开一局。
  // v9s.43：工位 / 地块来自 assemblePlots() 的动态拼合结果；带 testSpawn 的地块
  // 额外有一枚测试按钮，点了先传送到拼合后的落点、再就地生成假人 / 陪练。
  const lab = createLabPanel({
    stations: PLOT_ASSEMBLY.stations,
    plots: PLOTS,
    world,
    view,
    onResetZoom: resetZoom,
    // 先清掉全部测试单位（保证 id / 渲染对象数组前缀稳定），再在当前地块生成。
    // 这是运行时调试操作，不进 Intents / step，因此不影响确定性回放 / golden。
    onPlotTest: (plot) => {
      clearPlotTestUnits(world);
      const n = spawnPlotTestUnits(world, plot);
      showToast(`已在「${plot.name}」生成 ${n} 人 · 点「清除测试单位」回基线`);
      return n;
    },
    onClearTestUnits: () => {
      const n = clearPlotTestUnits(world);
      showToast(n > 0 ? `已清除 ${n} 个测试单位` : '当前没有测试单位');
      return n;
    },
  });

  // v9r：把两个后创建的面板控制钩子交给胶囊行，显隐 / 文案只有这一份状态源
  fold.register({ motion: motionDebug, debug: panel.gui });

  window.addEventListener('resize', () => view.resize());

  // 玩法实验台的调试钩子：浏览器控制台 / 自动化验收可直接读状态、投影坐标，
  // 以及热改表现层配置（相机、特效时长等），无需重编译
  // v9s.30：体型切换。放在 window 上而不是 InputFrame 里 —— 体型是纯表现层
  // 选项，不该进 Core 的 intents / 快照；切换时只重建骨架，角色位置与状态都不动。
  // v9s.32：补上 UI 入口（顶部「体型」胶囊），不再只靠 B 键；点击与快捷键共用
  // 同一个循环函数，且每次都从 view 的真实 id 取下一项，控制台改过也不会错位。
  const bodyIds = view.bodyTypes().ids;
  const bodyBtn = document.getElementById('body-toggle');
  const bodyName = (id: string): string => VIEW_CONFIG.bodyTypes?.[id]?.name ?? id;
  const syncBodyLabel = (): void => {
    if (!bodyBtn) return;
    const id = view.bodyTypes().id;
    bodyBtn.textContent = `体型 ${bodyName(id)}`;
    bodyBtn.setAttribute('aria-label', `切换体型（当前：${bodyName(id)}，快捷键 B）`);
  };
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
  const cycleBody = (): void => {
    if (bodyIds.length < 2) {
      showToast('只有一个体型预设');
      return;
    }
    const cur = view.bodyTypes().id;
    const i = Math.max(0, bodyIds.indexOf(cur));
    const next = view.setBodyType(bodyIds[(i + 1) % bodyIds.length]);
    syncBodyLabel();
    showToast(`体型：${bodyName(next)}（B / 顶部胶囊切换）`);
  };
  syncBodyLabel();
  bodyBtn?.addEventListener('click', cycleBody);

  // v9s.42：风吹麦浪开关，默认开。此前只有独立演示页有按钮，主场景真机测试时
  // 用户「找不到开启按钮」——这里补一枚顶部胶囊 + W 键，与体型切换同一套交互。
  // 风开关是表现层参数：直接改 world.config.grass.wind.enabled，grass-layer 每帧
  // 从同一处读 uWindOn uniform，切换即时生效；不进 Core 的 intents / 快照，
  // 因此确定性回放不受影响（关闭时 windAdvance 也不再推进时间，重开会接着走）。
  const windBtn = document.getElementById('wind-toggle');
  const windCfg = () => world.config.grass?.wind;
  const syncWindLabel = (): void => {
    if (!windBtn) return;
    const on = !!windCfg()?.enabled;
    windBtn.textContent = `风：${on ? '开' : '关'}`;
    windBtn.classList.toggle('is-off', !on);
    windBtn.setAttribute('aria-label', `${on ? '关闭' : '开启'}风吹麦浪（当前${on ? '开启' : '关闭'}，快捷键 G）`);
  };
  const toggleWind = (): void => {
    const wc = windCfg();
    if (!wc) { showToast('本场景未启用草块'); return; }
    wc.enabled = !wc.enabled;
    syncWindLabel();
    showToast(`风吹麦浪：${wc.enabled ? '开' : '关'}（G 切换）`);
  };
  syncWindLabel();
  windBtn?.addEventListener('click', toggleWind);
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.code === 'KeyB') cycleBody();
    // W/A/S/D 是移动键，V 是手感面板，B 是体型；风开关只能用没被占用的 G。
    else if (e.code === 'KeyG') toggleWind();
  });

  (window as unknown as { __harness?: unknown }).__harness = {
    world, view, clock, input, viewConfig: VIEW_CONFIG, debug,
    /**
     * v9s.55：手动步进一帧（配合 `debug.paused = true`）。
     * 验收「起手 / 收招每一帧」时，截图在软件渲染下要 3s 一张，实时抓帧必然错过；
     * 暂停 + 逐帧推进才能精确停在某一帧。intents 只写差异字段，其余取空输入。
     */
    stepOnce: (patch: Record<string, unknown> = {}) => clock.singleStep(
      { ...EMPTY_INTENTS, ...patch } as Intents,
    ),
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
    /** v9s.50：蜘蛛骨架步态读数（人形返回 null）；验收「8 腿是否够得到」直接读这个 */
    spiderDebug: () => view.spiderDebug(),
    /** v9s.40：持械陪练的步态读数（只对 voxel-rig 的陪练有效，简化假人返回 null）。 */
    dummyRigDebug: (id: number) => view.dummyRigDebug(id),
    // v9s.23：挥击姿态（段号 / 方向 / 躯干三轴 / 肩部位移）
    swingDebug: () => view.swingDebug(),
    // v9s.32：持械待机姿态（权重 / 双臂偏移 / 躯干扭转 / 刀身仰角）
    stanceDebug: () => view.stanceDebug(),
    // v9s.33：动态平衡读数（COM / 捕获点 / 支撑余量 / 综合分）
    balanceDebug: () => view.balanceDebug(),
    // v9s.33：脊柱分段读数（腰 / 胸 / 颈）
    spineDebug: () => view.spineDebug(),
    // v9s.34：渲染插值读数（alpha = 累加器剩余 / fixedDt；applied = 本帧真的插值了）
    interpDebug: () => ({ alpha: interpAlpha, applied: interpApplied, enabled: renderInterp, skip: interpSkip }),
    /** v9s.34：渲染位姿（插值后的画面位置），验收「画面是否连续」读这个 */
    renderPose: () => view.renderPose(),
    /** v9s.35：朝向平滑读数（target = 插值后 bodyYaw，shown = 真正画出来的根节点 yaw） */
    yawDebug: () => view.yawDebug(),
    /** v9s.37：击地尘环读数（有没有真的生成 / 当前几圈 / 缩放与透明度） */
    slamDebug: () => view.slamDebug(),
    /** v9s.38：特效层级读数（地块是否不透明 / 关键层的 renderOrder） */
    fxDebug: () => view.fxDebug(),
    /** v9s.39：草块渲染读数（实例数 / draw call / dirty / 压弯 / 割断 / 碎片） */
    grassDebug: () => view.grassDebug(),
    /** v9s.56：飙血读数（喷发次数 / 活跃血珠 / 活跃血迹 / 已播到的 seq） */
    bloodDebug: () => view.bloodDebug(),
    /** v9s.56：某个假人的死亡渲染读数（倒地角 / 下沉量 / 升起量） */
    deathDebug: (id: number) => view.deathDebug(id),
    /** v9s.57：头顶血条读数（总条数 / 当前可见条数） */
    healthBarDebug: () => view.healthBarDebug(),
    /** v9s.56：假人血量快照（血量 / 是否死亡 / 距重生 / 击杀数），验收直接读 */
    dummyHealth: () => world.dummies.map((d) => ({
      id: d.id,
      weapon: d.weapon,
      hp: d.health.hp,
      maxHp: d.health.maxHp,
      dead: d.health.dead,
      respawn: d.health.respawn,
      revive: d.health.revive,
      kills: d.health.kills,
    })),
    /** v9s.x：装备展示界面读数（开合 / 转台角 / 视线 / 换装 / 换色 / 分区与占位槽），
     *  验收「动态站立 / 视线跟随 / 拖动旋转」与数据驱动分区直接读这里。
     *  wardrobe / wardrobeCtl 同时开放给自动化驱动 open/close/setLook/dragBy，避免只能靠真实指针。 */
    wardrobe: () => wardrobe.debug(),
    wardrobeCtl: wardrobe,
    /** v9s.x：操作按钮状态读数（冷却 / 蓄力 / 引导 / 冲刺 / 空中），验收按钮状态层直接读这里。 */
    buttonStatus: () => buttonStatus.update(world),
    /** v9s.x：常驻性能条读数（窗口 FPS / 帧时 / 慢帧 / 尖峰 / 固定步数），验收掉帧判定直接读这里。 */
    perfDebug: () => perfMeter.snapshot(),
    /** v9s.x：状态面板累计 DOM 写入数，验收「静止帧不写 DOM / 分区不掉帧」。 */
    hudDebug: () => hudDebug(),
    /** v9s.x：技能指示器读数（范围 / 形状 / 瞄准方向），验收数据驱动自动适配直接读这里。 */
    skillIndicatorDebug: () => view.skillIndicatorDebug(),
    /** v9s.x：指示器进出过渡系数（淡入 / 淡出），验收显示过渡直接读这里。 */
    skillIndicatorFade: () => view.skillIndicatorFade(),
    /** v9s.x：即时派生技能指示器描述（不依赖渲染帧），验收数据驱动自动适配。 */
    skillIndicatorDescribe: (aimX?: number, aimZ?: number) =>
      describeSkillIndicators(
        world,
        aimX !== undefined && aimZ !== undefined ? { x: aimX, z: aimZ } : undefined,
      ),
    /** v9s.x：震屏档位 / 预设表读数，验收「按击中类型分档 + 低频主导」直接读这里。 */
    shakeDebug: () => {
      const cam = view.diagnostics().camera;
      return {
        shake: cam.shake, kind: cam.shakeKind, preset: cam.shakePreset,
        presets: SHAKE_PRESETS,
      };
    },
    /**
     * v9s.x：可破坏物件读数。cuts 给每个已断物件的断面高度 / 倾角 / 法线 / 翻倒角，
     * 验收「高处打从高处断、切口朝攻击方向」直接读这里。
     */
    breakDebug: () => ({
      version: __APP_VERSION__,
      count: world.destructibles.length,
      broken: world.destructibles.filter((s) => s.broken !== 0).length,
      cuts: world.destructibles.map((s) => ({
        id: s.id, kind: s.kind, broken: s.broken, cutU: s.cutU, theta: s.theta,
        nx: s.nx, ny: s.ny, nz: s.nz, standU: s.standU,
        fragments: s.fragments.length, height: s.height,
      })),
      rendered: view.destructibleDebug(),
    }),
    /**
     * v9s.60：以指定受击类型 / 部位结算一次命中（走真机同一个 `applyHit`）。
     * 断肢与倒地物理都按「最后一击」判定，验收必须能精确控制这一刀是什么 —— 靠真人挥砍
     * 打到指定高度是碰运气，脚本要能直接给。
     */
    hitTest: (id: number, type: HurtType = 'heavy', hitU = 0.6, dirX = 0, dirZ = 1) => {
      const i = world.dummies.findIndex((d) => d.id === id);
      if (i < 0) return false;
      applyHit(world, { kind: 'dummy', index: i }, {
        type, duration: 0.24, dirX, dirZ, knockback: 0.35, hitU,
      });
      return true;
    },
    /** 自动化 / 演示：以给定命中点打断指定物件，走与真机同一个 cutPlane。 */
    breakTest: (id: string, y: number, dx = 1, dy = 0, dz = 0) =>
      forceBreak(world, id, y, dx, dy, dz),
    /** 复位所有物件到完好直立（不动玩家 / 战斗）。 */
    resetBreaks: () => { destructiblesReset(world); return world.destructibles.length; },
    /** 本帧刀刃相交候选（表现层 → Intents 的那一层）。 */
    breakHits: () => view.breakHits(),
    /**
     * v9s.42：风场读数 / 热切换（验收「默认开 + 按钮可关」）。
     * configured = 配置里的开关（点按钮立即变）；rendered = 草层上一帧实际写进
     * uniform 的值（会滞后一帧，两者分开报，避免把渲染节拍误读成开关没生效）。
     */
    windDebug: () => {
      const w = view.grassDebug().wind;
      return { configured: !!windCfg()?.enabled, rendered: w.enabled, time: w.time, gust: w.gust };
    },
    setWind: (on: boolean) => {
      const wc = windCfg();
      if (!wc) return false;
      wc.enabled = !!on;
      syncWindLabel();
      return wc.enabled;
    },
    /** v9s.34：A/B 开关（验收「插值开 / 关」的画面差别，不用改 config 重启） */
    setRenderInterp: (on: boolean) => {
      renderInterp = !!on;
      return renderInterp;
    },
    /** v9s.35：主循环是否被 clip 工具台锁住（锁住时 view.render 完全不跑，画面定格） */
    renderHold: () => clipHold,
    /**
     * v9s.56：手动锁画面（配合 `paused` + `stepOnce` + `view.render`）。
     * 飙血 / 倒地这种「几百毫秒就过去了」的表现，实时抓帧必然错过；锁住主循环之后
     * 由脚本逐帧推进，才能精确停在「血在空中」「尸体躺下」「从地里升起」那几帧。
     */
    holdRender: (on: boolean) => { clipHold = !!on; return clipHold; },
    // v9s.32：挥空时刀光增亮的读数（证明「不震屏也有反馈」）
    trailDebug: () => view.trailDebug(),
    // v9s.26：刃身两端世界坐标（验收横扫仰角，避免被斜俯视截图误导）
    bladeWorld: () => view.bladeWorld(),
    projectPoint: (x: number, y: number, z: number) => view.projectPoint(x, y, z),
    // v9s.30：体型切换（B 键 / 顶部胶囊同一入口），验收可直接看长腿 / 长臂下的姿态
    setBodyType: (id: string) => {
      const next = view.setBodyType(id);
      syncBodyLabel();
      return next;
    },
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
    // v9s.62：GPU / 场景资源读数（诊断移动端周期性卡顿，看资源是否只增不减）
    gpuDebug: () => view.gpuDebug(),
    weaponDebug: () => view.weaponDebug(),
    gripDebug: () => view.gripDebug(),
    /**
     * v9s.43：动态地块拼合读数 —— 每个地块的 id / 位置来源 / 槽位 / 拼合后中心，
     * 以及当前测试单位数。验收「工位传送跟着实际拼合位置走」直接读这个。
     */
    plotDebug: () => ({
      version: __APP_VERSION__,
      count: PLOT_ASSEMBLY.plots.length,
      diagnostics: PLOT_ASSEMBLY.diagnostics,
      testUnits: plotTestUnitCount(world),
      dummies: world.dummies.length,
      // 表现层已建好的渲染对象数：应与 dummies 严格相等，否则「生成了但没画出来」。
      rendered: view.dummyRenderCount(),
      // v9s.49：地板读数 —— 验收「每块地都有地板、地板铺满包围盒、没有洞」直接读这两个。
      bounds: PLOT_ASSEMBLY.bounds,
      worldBounds: world.config.worldBounds,
      slabs: PLOT_ASSEMBLY.slabs.map((s) => ({
        plotId: s.plotId,
        cell: s.cell,
        span: s.span,
        rect: [s.minX, s.maxX, s.minZ, s.maxZ],
        top: s.top,
      })),
      plots: PLOT_ASSEMBLY.plots.map((p) => ({
        id: p.id,
        index: p.index,
        placement: p.placement,
        slot: p.slot,
        cell: p.cell,
        span: p.span,
        centerX: p.centerX,
        centerZ: p.centerZ,
        spawnX: p.station.spawnX,
        spawnZ: p.station.spawnZ,
        slab: [p.slab.minX, p.slab.maxX, p.slab.minZ, p.slab.maxZ],
        hasTest: !!p.testSpawn,
      })),
    }),
    /** v9s.43：在指定地块就地生成测试单位（先传送到拼合落点），返回生成数量。 */
    spawnAt: (id: string | number) => lab.spawnAt(id),
    /** v9s.43：清除所有由测试按钮生成的单位，返回移除数量。 */
    clearSpawned: () => lab.clearSpawned(),
    // v9s.15：测试工位 —— 自动化验收可直接 goto 逐个工位截图 / 取状态
    lab: {
      stations: PLOT_ASSEMBLY.stations,
      plots: PLOTS,
      goto: (id: string | number) => lab.goto(id),
      current: () => lab.current(),
      recall: () => lab.recall(),
      spawnAt: (id: string | number) => lab.spawnAt(id),
      clearSpawned: () => lab.clearSpawned(),
    },
  };

  let last = performance.now();
  let fps = 60;
  let lastDiagTick = 0;
  // v9s.34：定步长渲染插值 —— 只保存「驱动骨架的连续量」，不含 World 本体
  // v9s.34：渲染插值总闸（config.view.renderInterp.enabled，可热关做 A/B）
  let renderInterp = VIEW_CONFIG.renderInterp?.enabled ?? true;
  let poseCur: PoseSnapshot = capturePose(world);
  let posePrev: PoseSnapshot | null = null;
  let interpAlpha = 1;
  let interpApplied = false;
  /** v9s.35：本帧没能插值的原因（''=插值了；'off' 关闭；'noprev' 首帧；'key' 离散键变了；'alpha' 已到 1） */
  let interpSkip: string = '';

  // ---- v9s.62：`?diag=1` 现场读数 ----
  // 移动端「隔一段时间卡几秒」在桌面上复现不出来，只能让真机自己报数：
  // fps / 近 5s 最坏帧 / 丢上下文次数 / 几何数与对象数 / 当前质量档。
  // 默认不建节点（不改正式画面），加 ?diag=1 才出现，方便对着微信截图定位。
  const diagOn = /(?:^|[?&])diag=1(?:&|$)/.test(location.search);
  const diagEl: HTMLDivElement | null = diagOn ? document.createElement('div') : null;
  const diagFrames: number[] = [];
  let diagAt = 0;
  if (diagEl) {
    diagEl.id = 'diag-badge';
    diagEl.setAttribute('aria-hidden', 'true');
    diagEl.style.cssText = [
      'position:fixed', 'top:6px', 'right:6px', 'z-index:99',
      'font:11px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace',
      'color:#d6e2f2', 'background:rgba(12,16,22,.72)', 'padding:4px 7px',
      'border-radius:6px', 'pointer-events:none', 'white-space:pre',
    ].join(';');
    document.body.appendChild(diagEl);
  }

  /**
   * v9s.34：给渲染层挑一个「世界」——插值开且两个快照可插值时，返回套了插值姿态的替身；
   * 否则原样返回（暂停 / 换武器 / 跨段 / 离散事件都是 snap）。
   */
  function pickRenderWorld(frameSeconds: number): typeof world {
    const on = renderInterp && !debug.paused && debug.timeScale > 0;
    interpApplied = false;
    interpSkip = '';
    if (!on) {
      interpSkip = 'off';
      interpAlpha = 1;
      return world;
    }
    if (!posePrev) {
      interpSkip = 'noprev';
      interpAlpha = 1;
      return world;
    }
    if (!canInterpolate(posePrev, poseCur)) {
      interpSkip = 'key';
      interpAlpha = 1;
      return world;
    }
    const a = clock.alpha;
    interpAlpha = a;
    // alpha ≈ 1 时插值结果与当前步几乎相同，省掉一次对象分配
    if (a >= 0.999) { interpSkip = 'alpha'; return world; }
    interpApplied = true;
    void frameSeconds;
    return applyPose(world, blendPose(posePrev, poseCur, a));
  }

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
      intents: {
        ...sampled.intents,
        dummyClickId: pendingDummyClick,
        // v9s.x：表现层算出的 3D 刀刃相交候选，Core 消费并按本帧刀风裁决。
        breakHits: view.breakHits(),
      } as Intents,
    };
    // v9f：逐步收集事件（掉帧补算多步时只有最后一步的留在 world.events 里）
    const steps = clock.frame(dt, lastFrame.intents, debug.timeScale, debug.paused, () => {
      const list = world.events;
      for (let i = 0; i < list.length; i++) recorder.event(list[i], world.time);
      // v9s.34：每个固定步结束后滚一次姿态快照，掉帧补算多步时 prev 才是「上一步」
      posePrev = poseCur;
      poseCur = capturePose(world);
    });
    if (steps > 0) pendingDummyClick = 0;
    recorder.sample(world, lastFrame, dt * 1000, steps);
    perfMeter.update(dt * 1000, steps);
    for (const g of lastFrame.gestures) recorder.gesture(g);
    if (now - lastDiagTick > 250) {
      lastDiagTick = now;
      diagPanel.tick();
    }

    syncWeaponButtons(world.combat.weapon);
    buttonStatus.update(world);
    // v9s.x：拖拽瞄准方向喂给技能指示器（纯表现，不进 Intents 的确定性路径之外）
    const aimDir = lastFrame.intents.aimActive
      ? { x: lastFrame.intents.aimX, z: lastFrame.intents.aimZ }
      : undefined;
    if (!clipHold) view.render(pickRenderWorld(dt), dt, aimDir);
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

    // v9s.62：诊断角标每 500ms 刷一次（读取 renderer.info 有成本，不做每帧）
    if (diagEl) {
      diagFrames.push(dt * 1000);
      if (diagFrames.length > 300) diagFrames.shift();
      if (now - diagAt > 500) {
        diagAt = now;
        const g = view.gpuDebug();
        let worst = 0;
        for (const v of diagFrames) if (v > worst) worst = v;
        diagEl.textContent =
          `fps ${fps.toFixed(0)}  最坏 ${worst.toFixed(0)}ms\n`
          + `lost ${g.lostCount}${g.contextLost ? ' (丢中)' : ''}  tier ${g.tier}\n`
          + `geo ${g.geometries}  obj ${g.objects}  calls ${g.calls}\n`
          + `tri ${(g.triangles / 1000).toFixed(1)}k  heap ${g.heapMB ?? '-'}MB`;
      }
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
