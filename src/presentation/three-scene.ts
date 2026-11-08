import * as THREE from 'three';
import type { GroundBasis } from '../adapters/input';
import type { BodyTypeConfig, Box, StationSpec, ViewConfig, World } from '../core';
import { createCameraRig } from './camera-rig';
import { createDummyRig } from './dummy-rig';
import { createLabLayer } from './lab-scene';
import {
  areaOpen, createArcMeter, createAreaRing, createGroundRing, dummyWindupWarning, fadeTowards,
  ringGroundHeight,
  groundRingRadius, linkLandingPreview, playerMeterSource, playerRingVisual, threatRingColor,
} from './ground-ring';
import { dummyThreatLevel, isHostileDummy } from '../core';
import { slashAxisLocal, slashTiltX, rotateAxisY } from './fx-axis';
import { createVoxelRig } from './voxel-rig';
import { createYawSmoother } from './yaw-smooth';
import { createWeaponTrail } from './weapon-trail';
import type { HurtPose } from './hurt-pose';

export type SceneView = {
  render(world: World, frameDt: number): void;
  resize(): void;
  getGroundBasis(): GroundBasis;
  setCollidersVisible(v: boolean): void;
  setGridVisible(v: boolean): void;
  /** v8e：设置用户缩放目标倍率（1 = 基础距离），由组装层每帧喂入 */
  setZoom(next: number): void;
  /**
   * v9s.30：切换体型预设（`view.bodyTypes` 的 id）。返回切换后的 id（未知 id 原样返回）。
   * 只重建骨架尺寸，不动 Core 状态 —— 用来观察同一套动画在长腿 / 长臂下的适配。
   */
  setBodyType(id: string): string;
  /** v9s.30：当前体型 id 与可选列表（HUD / 自动化用） */
  bodyTypes(): { id: string; ids: string[] };
  /** 屏幕坐标 → 被点中的假人 id（0 = 没点中）。表现层做射线拾取，Core 只收 id。 */
  pickDummy(clientX: number, clientY: number): number;
  /** 世界坐标 → 屏幕像素坐标，供自动化验收精确定位假人。 */
  projectToScreen(x: number, y: number, z: number): { x: number; y: number };
  /** v9s.37：击地尘环读数（spawns = 累计生成次数，live = 当前活跃环） */
  slamDebug(): {
    spawns: number;
    lastId: number;
    live: Array<{ life: number; scale: number; opacity: number; visible: boolean }>;
  };
  /** v9s.35：朝向平滑读数（target = 插值后的 bodyYaw，shown = 实际渲染的根节点 yaw） */
  yawDebug(): { target: number; shown: number; tauMs: number };
  /** v9n：停步收相 / 侧移偏转 / 双腿姿态的实时读数（纯观测）；v9o 追加胸偏转与速度，
   *  v9p 追加停步惯性的前脚前伸量与身体前移量，v9q 追加含击退冲量的步态速度，
   *  v9r 追加骨盆惯性下沉量。 */
  /** v9s.33：动态平衡读数（COM / 捕获点 / 支撑余量） */
  balanceDebug(): import('./balance').BalanceResult | null;
  /** v9s.33：脊柱分段读数（腰 / 胸 / 颈） */
  spineDebug(): { enabled: boolean; waistYaw: number; chestYaw: number; totalYaw: number; neckPitch: number } | null;
  gaitDebug(): {
    stopT: number; hipYaw: number; chestYaw: number; speed: number; gaitSpeed: number;
    stopStep: number; stopShift: number; stopDip: number;
    legLPitch: number; legLRoll: number; legRPitch: number; legRRoll: number;
  };
  /** 表现层诊断读数：惯性倾斜、斩击弧世界法线、弓/箭世界前向、冲刺视觉、下盘偏航、智能相机，纯观测用。 */
  diagnostics(): {
    lean: { forward: number; side: number };
    slashNormal: { x: number; y: number; z: number };
    arrowForward: { x: number; y: number; z: number };
    /** v8b：下盘连续偏航 hipYaw 与 gait 投影基准 gaitYaw（= bodyYaw + hipYaw，自洽） */
    gait: { hipYaw: number; gaitYaw: number };
    /** v8c：攻击姿态混合系数（0 = 下盘完全由步态 / 静止基准接管） */
    attackBlend: number;
    /** v8d：两个下半身权重与本帧步态等效驱动，供验收「权重是否真的生效」 */
    attackWeights: {
      gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
    };
    /** v8c：跳跃 / 落地蓄力缓冲脉冲读数（纯表现，不进 Core） */
    landing: {
      pulse: number; remaining: number; kind: 'none' | 'land' | 'jump'; impactVy: number;
    };
    /** v8f：分层受击姿态读数（部位 / 力度 / 重心 / 后坐 / 屈膝…），不进 Core */
    hurt: HurtPose;
    /** v8g：足部 IK 锚定诊断（是否生效 / 权重 / 钳制数 / 钉地残差） */
    ik: { active: boolean; weight: number; clamped: number; maxError: number };
    /** v9a：派生招状态读数（纯观测，Core 状态直接可读） */
    link: {
      phase: string; kind: string; window: number; cooldown: number;
      progress: number; hits: number; id: number;
    };
    dash: { rollAngle: number; activeRings: number; lastKind: string };
    camera: {
      threat: number;
      threatCount: number;
      distanceScale: number;
      offsetX: number;
      offsetZ: number;
      pitchDelta: number;
      /** v8e：平滑后的用户缩放倍率（>1 拉远、<1 拉近） */
      zoom: number;
      /** v9s.31：镜头震动能量 0..1（关键帧事件 / 命中共用），用于验收 notify 是否真的被消费 */
      shake: number;
      /** v9s.33：方向性微推能量 0..1（命中方向） */
      kick: number;
    };
  };
  /** v9s.15：整层测试工位标识（地面盘 + 标牌）显隐，纯表现开关 */
  setLabVisible(v: boolean): void;
  /** v9s.15：只关浮动标牌，保留地面盘 */
  setLabLabelsVisible(v: boolean): void;
  /** v9s.22：挥击拖尾读数（采样点数 / 是否可见），供验收与调试面板 */
  trailDebug(): { count: number; visible: boolean; pulse?: number };
  /** v9s.22：角色本帧四肢形变读数（1 = 原长） */
  stretchDebug(): { arm: number; leg: number; torso: number; impact: number };
  /** v9s.24：腕部滞后读数（武器相对手的自由度），验收「剑不再焊在手上」 */
  weaponDebug(): { wristPitch: number; wristTwist: number };
  /** v9s.24：副手握持读数（握持权重 / 实际握点 / 到肩距离） */
  gripDebug(): { active: boolean; dist: number; gy: number; pitch: number; joint: number; grip: number };
  /** v9s.23：本帧挥击姿态（段号 / 段类型 / 躯干三轴 / 整体转体 / 两肩位置），供验收与真机诊断 */
  swingDebug(): {
    seg: number; kind: string; lead: 'R' | 'L'; yaw: number; pitch: number; roll: number; strike: number;
    rootYaw: number; spinYaw: number; rootTurn: number;
    shoulderL: { x: number; y: number; z: number };
    shoulderR: { x: number; y: number; z: number };
  };
  /** v9s.32：当前武器的持械待机姿态读数（权重 / 双臂偏移 / 躯干扭转 / 刀身仰角） */
  stanceDebug(): {
    weapon: string;
    weight: number;
    armL: { pitch: number; yaw: number; roll: number; elbow: number };
    armR: { pitch: number; yaw: number; roll: number; elbow: number };
    torsoYaw: number;
    torsoPitch: number;
    bladePitchDeg: number;
    bladePitchOffDeg: number;
    armSwing: number;
  };
  /** v9s.26：刃身两端的世界坐标 —— 斜俯视截图会把「水平指向远方」看成「竖直」，
   *  验收横扫幅度 / 仰角必须读世界坐标，不能只看截图。纯观测。 */
  bladeWorld(): { base: { x: number; y: number; z: number }; tip: { x: number; y: number; z: number } } | null;
  /** clip 工具：左右手刃身同时给出（双持看两只手，避免「另一把去哪了」）。 */
  bladesWorld(): {
    right: { base: { x: number; y: number; z: number }; tip: { x: number; y: number; z: number } } | null;
    left: { base: { x: number; y: number; z: number }; tip: { x: number; y: number; z: number } } | null;
  };
  /**
   * v9s.34：**渲染位姿**（不是 Core 状态）。
   * 定步长插值下两者会差最多一个模拟步，验收「画面是否连续」必须读这个而不是 `world.character`。
   */
  renderPose(): { x: number; y: number; z: number; bodyYaw: number };
  /** clip 工具：世界坐标 → 页面像素。截图标注刃身 / 扫角用，纯只读。 */
  projectPoint(x: number, y: number, z: number): { x: number; y: number };
  /** v9s.28：clip 工具专用，把剪辑时间轴钉到 t（null = 恢复 progress→swingCurve 映射）。 */
  setClipT(t: number | null): void;
  /** v9s.15：传送后把相机跟随目标瞬移过去，避免跨场地滑行 */
  snapCamera(x: number, y: number, z: number): void;
  dispose(): void;
};

function colorFor(kind: Box['kind'], view: ViewConfig): string {
  switch (kind) {
    case 'ground': return view.colors.ground;
    case 'step': return view.colors.step;
    case 'wall': return view.colors.wall;
    case 'lintel': return view.colors.lintel;
    case 'obstacle': return view.colors.obstacle;
    default: return '#ffffff';
  }
}

/**
 * Three.js 薄实现。渲染层只消费 World 数据，不反向写入 Core。
 * 换 Babylon / Unity 时，整体替换本文件即可，Core 与输入层零改动。
 */
export function createSceneView(
  container: HTMLElement,
  world: World,
  view: ViewConfig,
  stations?: StationSpec[],
): SceneView {
  const w0 = Math.max(1, container.clientWidth);
  const h0 = Math.max(1, container.clientHeight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(w0, h0, false);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#12161d');

  scene.add(new THREE.HemisphereLight(0xa8c8ee, 0x2a2f38, 1.15));
  const sun = new THREE.DirectionalLight(0xfff2dc, 1.5);
  sun.position.set(9, 18, 11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -20; sc.right = 20; sc.top = 20; sc.bottom = -20;
  sc.near = 1; sc.far = 60;
  scene.add(sun);

  // ---- 碰撞白盒 ----
  const materials: THREE.MeshLambertMaterial[] = [];
  const boxGroup = new THREE.Group();
  for (const b of world.boxes) {
    const width = b.maxX - b.minX;
    const height = b.maxY - b.minY;
    const depth = b.maxZ - b.minZ;
    let color = colorFor(b.kind, view);
    if (b.kind === 'step') {
      color = new THREE.Color(color).offsetHSL(0, 0, b.maxY * 0.09).getStyle();
    }
    const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 1 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
    mesh.position.set((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
    mesh.castShadow = b.kind !== 'ground';
    mesh.receiveShadow = true;
    mesh.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x9fb6cc, transparent: true, opacity: 0.32 }),
    ));
    boxGroup.add(mesh);
    materials.push(mat);
  }
  scene.add(boxGroup);

  // ---- 地面网格 ----
  const gridSize = world.gridMeta.maxX - world.gridMeta.minX;
  const grid = new THREE.GridHelper(gridSize, gridSize, 0x4a5c70, 0x33404d);
  grid.position.y = 0.002;
  grid.visible = view.showGrid;
  scene.add(grid);

  // ---- v9s.15 测试工位标识（纯表现：地面盘 / 标牌 / 量具） ----
  const lab = createLabLayer(stations, view);
  scene.add(lab.group);

  // ---- 体素角色 ----
  // playerRoot 承担「位置 + 身体平滑朝向」；rig 自身只承担翻滚旋转。
  // 这样绕 rig 局部 X 轴前滚时，滚动方向会随身体朝向一起转（不会锁死在世界 X 轴）。
  // v9s.30：体型可切换 —— 只换骨架尺寸，动画数据与逻辑完全不变。
  // rig 是纯表现层对象（自带 geometry / material），重建时先 dispose 再挂新的，
  // 不会有泄漏；Core 状态、拖尾、假人都不受影响。
  const buildRig = (bt?: BodyTypeConfig) => createVoxelRig(
    bt?.voxel ?? view.voxel,
    bt?.colors ? { ...view.colors, ...bt.colors } : view.colors,
    world.config.moveSpeed, view.orientation, view.gait,
    view.weaponMount, view.lean, view.hurt, view.animation, view.ik, view.links,
    view.weaponWrist, view.balance,
  );
  let bodyTypeId = 'standard';
  let voxel = buildRig(view.bodyTypes?.[bodyTypeId]);
  // v9s.22：挥击拖尾挂在场景根节点（世界坐标采样，不随角色层级变换）
  const playerTrail = createWeaponTrail(view.weaponTrail);
  scene.add(playerTrail.object);
  const playerRoot = new THREE.Group();
  // 翻滚枢轴放在身体中心高度：若直接绕脚底原点旋转，前滚到 90° 以后头部会插进地面。
  // rollPivot 上抬 ROLL_PIVOT_Y，rig 内部反向偏移同样高度，净位置不变，
  // 旋转中心则落在躯干中部，翻滚全程身体都留在地面之上。
  const ROLL_PIVOT_Y = 0.9;
  const rollPivot = new THREE.Group();
  rollPivot.position.y = ROLL_PIVOT_Y;
  voxel.group.position.y = -ROLL_PIVOT_Y;
  rollPivot.add(voxel.group);
  playerRoot.add(rollPivot);
  scene.add(playerRoot);

  // v9s.35：渲染侧朝向低通。插值只让位置一阶连续，朝向的**角速度**仍是阶梯；
  // 手 / 肩 / 武器挂在 0.4~0.8m 半径上，速度突跳被放大成「一顿一顿」。
  // 这里只平滑「给眼睛看」的根节点 yaw，Core 的 facing / 判定 / 相机目标全部不受影响。
  const yawSmoother = createYawSmoother();
  let yawTarget = 0;

  // ---- 测试假人 ----
  const dummyRigs = world.dummies.map((s, i) => {
    const palette = view.dummies.colors;
    const tint = palette[i % palette.length] ?? '#cccccc';
    const rig = createDummyRig(
      view.voxel, view.colors, tint, s.id, view.dummies, world.config.dummies.moveSpeed,
      view.gait, view.hurt, view.lean, view.ik,
    );
    // 所有子节点都带上 id，射线命中身体、标签或攻击弧都能识别
    rig.group.traverse((obj) => { obj.userData.dummyId = s.id; });
    scene.add(rig.group);
    return rig;
  });
  const dummyGroups = dummyRigs.map((r) => r.group);
  const raycaster = new THREE.Raycaster();

  // ---- v9s.9 / v9s.10 脚下指示半环（世界坐标，不随角色旋转） ----
  // 尺寸随身体体型推导（bodyWidth × 半身宽 × 系数），不再写死米数；
  // 玩家环：平时中性半环，接敌时弧长扩展 + 提亮 + 朝向主威胁叠一块「危险扇区」；
  // 假人环：半环 → 选中 3/4 环 + 加厚 + 提亮 + 外发光，颜色读 Core 威胁等级。
  const ringCfg = view.groundRing;
  const bodyW = view.voxel.bodyWidth;
  const playerRadius = groundRingRadius(bodyW, ringCfg.playerRadiusFactor);
  const dummyRadius = groundRingRadius(bodyW, ringCfg.dummyRadiusFactor);
  const ringThickness = bodyW * ringCfg.thicknessFactor;
  const baseArc = (ringCfg.arcDeg * Math.PI) / 180;

  // 环的贴地高度：只在落地帧刷新，跳跃时留在最后落脚的地面
  let ringGroundY = 0;
  const playerRing = createGroundRing({
    radius: playerRadius,
    thickness: ringThickness,
    arcRad: baseArc,
    edgeFade: ringCfg.edgeFade,
    color: ringCfg.playerColor,
    opacity: ringCfg.playerOpacity,
    y: 0.028,
    renderOrder: 6,
  });
  playerRing.mesh.name = 'player-ground-ring';
  scene.add(playerRing.mesh);

  const dummyRings = world.dummies.map((s) => {
    const ring = createGroundRing({
      radius: dummyRadius,
      thickness: ringThickness,
      arcRad: baseArc,
      edgeFade: ringCfg.edgeFade,
      color: ringCfg.neutralColor,
      opacity: ringCfg.opacity,
      y: 0.022,
      renderOrder: 5,
    });
    ring.mesh.name = `dummy-ground-ring-${s.id}`;
    scene.add(ring.mesh);
    return ring;
  });
  // 选中外发光：更宽更淡的一圈，和主环同色，只负责把「选中」从背景里拔出来。
  // v9s.11：径向剖面换成高斯（`profile: 'glow'`），配合下面每帧的淡入 / 淡出缓动，
  // 才是「光渗出来 / 收回去」而不是一盏灯被拧开拧灭。
  const dummyHalos = world.dummies.map((s) => {
    const halo = createGroundRing({
      radius: dummyRadius * ringCfg.haloRadiusFactor,
      thickness: ringThickness * ringCfg.haloThicknessFactor,
      arcRad: baseArc,
      edgeFade: ringCfg.edgeFade,
      color: ringCfg.neutralColor,
      opacity: 0,
      profile: 'glow',
      y: 0.019,
      renderOrder: 4,
    });
    halo.mesh.name = `dummy-ground-halo-${s.id}`;
    scene.add(halo.mesh);
    return halo;
  });
  // 选中混合量：主环形态（弧长 / 厚度 / 提亮）与外侧光晕各自一条缓动曲线
  const selMix = world.dummies.map(() => 0);
  const haloMix = world.dummies.map(() => 0);

  // ---- v9s.11 环上的信息层 ----
  // 玩家进度弧：主环外侧一圈，蓄力 / 引导 / 冲刺冷却沿弧填充
  const playerMeter = createArcMeter({
    radius: playerRadius * ringCfg.meterRadiusFactor,
    thickness: ringThickness * ringCfg.meterThicknessFactor,
    arcRad: baseArc,
    edgeFade: 0.06,
    color: ringCfg.meterColorCharge,
    y: 0.03,
    renderOrder: 8,
  });
  playerMeter.mesh.name = 'player-ground-meter';
  scene.add(playerMeter.mesh);

  // 假人起手预警弧：和假人环同半径、更厚，windup 期间从左往右填满，满格即命中
  const dummyWarns = world.dummies.map((s) => {
    const m = createArcMeter({
      radius: dummyRadius * ringCfg.warnRadiusFactor,
      thickness: ringThickness * ringCfg.warnThicknessFactor,
      arcRad: baseArc,
      edgeFade: 0.02,
      color: ringCfg.warnColor,
      y: 0.031,
      renderOrder: 9,
    });
    m.mesh.name = `dummy-ground-warn-${s.id}`;
    scene.add(m.mesh);
    return m;
  });
  // 冲锋落点预览（玩家派生招 windup 阶段）
  // 落点圈用玩家色系：红色会被读成「敌人的危险范围」，而这是「我自己要冲到这里」
  const landingPreview = createAreaRing({
    color: ringCfg.playerColor, y: 0.042, renderOrder: 3,
  });
  landingPreview.group.name = 'player-landing-preview';
  scene.add(landingPreview.group);

  const ringColor = new THREE.Color();
  const playerRingColor = new THREE.Color(ringCfg.playerColor);
  const neutralRingColor = new THREE.Color(ringCfg.neutralColor);
  const lowThreatRingColor = new THREE.Color(ringCfg.lowThreatColor);
  const highThreatRingColor = new THREE.Color(ringCfg.highThreatColor);
  const chargeMeterColor = new THREE.Color(ringCfg.meterColorCharge);
  const channelMeterColor = new THREE.Color(ringCfg.meterColorChannel);
  const cooldownMeterColor = new THREE.Color(ringCfg.meterColorCooldown);
  const warnRingColor = new THREE.Color(ringCfg.warnColor);


  // ---- 战斗特效 ----
  const fxAnchor = new THREE.Group();
  scene.add(fxAnchor);

  const pfx = view.projectiles;

  /** v9s.16：径向柔光贴图（白心 → 透明）。Sprite 恒面向镜头，是「任何角度都看得见」的兜底。 */
  function makeGlowTexture(): THREE.Texture {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const c = canvas.getContext('2d');
    if (c) {
      const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.28, 'rgba(255,255,255,0.72)');
      g.addColorStop(0.62, 'rgba(255,255,255,0.22)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * 拖尾渐变：圆柱 UV 的 v=0 在近弹端、v=1 在尾端（CanvasTexture 默认 flipY，
   * 故贴图自上而下画成「透明 → 亮」）。
   */
  function makeTrailTexture(): THREE.Texture {
    const w = 2;
    const h = 64;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const c = canvas.getContext('2d');
    if (c) {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.55, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0.95)');
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const glowTex = makeGlowTexture();
  const trailTex = makeTrailTexture();

  // ---- 斩击弧：管径加粗 + 一层加色光晕，俯视下不再是一条 1px 的细线 ----
  const slashMat = new THREE.MeshBasicMaterial({
    color: 0xbfe8ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
  });
  const slashGlowMat = new THREE.MeshBasicMaterial({
    color: 0xd8f2ff, transparent: true, opacity: 0, side: THREE.DoubleSide,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  // 斩击弧：Torus 盘面法线（特效中心轴）恒为角色局部 +Z（水平、正前方）。
  // v7c #10：撤销 v6a 为「配合 2.5D 俯视」加的 -pitchDeg 绕 X 倾斜 —— 那个补偿把轴
  // 拧成了斜前上方，导致特效不再朝向角色正前方。倾斜量改由纯函数 slashTiltX 决定
  // （轴为纯 +Z 时恒为 0），tests/fx-axis.test.ts 直接断言轴方向，防止再次回归。
  // pivot 只管位置（放在角色身前偏上），tilt 只管朝向，避免位置被一起旋走。
  const slashPivot = new THREE.Group();
  slashPivot.position.set(0, 0.95, 0.72);
  fxAnchor.add(slashPivot);
  const slashTilt = new THREE.Group();
  slashTilt.rotation.x = slashTiltX(view.camera.pitchDeg);
  slashPivot.add(slashTilt);
  const slashGeo = new THREE.TorusGeometry(0.78, pfx.slashThickness, 6, 28, Math.PI * 1.15);
  const slashGroup = new THREE.Group();
  const slash = new THREE.Mesh(slashGeo, slashMat);
  const slashGlow = new THREE.Mesh(slashGeo, slashGlowMat);
  slashGlow.scale.setScalar(1.09);
  slashGlow.renderOrder = 4;
  slashGroup.add(slash, slashGlow);
  slashTilt.add(slashGroup);

  // ---- v9s.17 箭矢：Core 实体（重力弹道），表现层只按 world.arrows 渲染 ----
  // 池化多支：飞行中的箭与插在目标 / 地面上的箭会同时存在（驻留 4s），单支 group 不够用。
  // 几何共享；材质每支独立，插住淡出各自算。
  const arrowShaftGeo = new THREE.BoxGeometry(pfx.arrowWidth, pfx.arrowWidth, pfx.arrowLength);
  const arrowTipGeo = new THREE.ConeGeometry(pfx.arrowHeadSize * 0.42, pfx.arrowHeadSize, 4);
  arrowTipGeo.rotateX(Math.PI / 2); // 圆锥默认指向 +Y，转到 +Z（飞行方向）
  const arrowFinGeo = new THREE.BoxGeometry(pfx.arrowWidth * 2.6, pfx.arrowWidth * 0.4, 0.1);
  // 锥形拖尾：轴 → -Z，向尾部收细；贴图 UV 让亮度向尾端淡出
  const arrowTrailGeo = new THREE.CylinderGeometry(
    pfx.arrowWidth * 0.45, pfx.arrowWidth * 1.3, pfx.trailLength, 6, 1, true,
  );
  arrowTrailGeo.rotateX(-Math.PI / 2);
  arrowTrailGeo.translate(0, 0, -pfx.trailLength / 2);

  type ArrowVisual = {
    group: THREE.Group;
    shaftMat: THREE.MeshBasicMaterial;
    tipMat: THREE.MeshBasicMaterial;
    glowMat: THREE.SpriteMaterial;
    trailMat: THREE.MeshBasicMaterial;
    glow: THREE.Sprite;
    trail: THREE.Mesh;
    /** v9s.18：当前渲染的是哪一支箭（0 = 空）；插住时挂到骨骼下，靠它判断要不要重挂 */
    arrowId: number;
    /** v9s.18：插在假人身上时被挂到的骨骼节点（null = 世界坐标直挂 scene） */
    bone: THREE.Object3D | null;
  };
  const arrowVisuals: ArrowVisual[] = Array.from({ length: 10 }, () => {
    const group = new THREE.Group();
    const shaftMat = new THREE.MeshBasicMaterial({ color: pfx.arrowColor, transparent: true });
    const tipMat = new THREE.MeshBasicMaterial({ color: pfx.arrowHeadColor, transparent: true });
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex, color: pfx.arrowColor, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const trailMat = new THREE.MeshBasicMaterial({
      color: pfx.arrowTrailColor, map: trailTex, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const shaft = new THREE.Mesh(arrowShaftGeo, shaftMat);
    const tip = new THREE.Mesh(arrowTipGeo, tipMat);
    tip.position.z = pfx.arrowLength / 2 + pfx.arrowHeadSize * 0.42;
    // 尾羽：一对交叉薄片，侧看能立刻认出「这是箭」
    // 尾羽用亮色：插住后光晕很淡，靠这一截亮尾羽仍能认出「一支箭」
    const finA = new THREE.Mesh(arrowFinGeo, tipMat);
    const finB = new THREE.Mesh(arrowFinGeo, tipMat);
    finA.position.z = -pfx.arrowLength / 2 + 0.08;
    finB.position.z = finA.position.z;
    finB.rotation.z = Math.PI / 2;
    const glow = new THREE.Sprite(glowMat);
    glow.scale.setScalar(pfx.arrowGlowSize);
    glow.renderOrder = 6;
    const trail = new THREE.Mesh(arrowTrailGeo, trailMat);
    trail.renderOrder = 5;
    group.add(shaft, tip, finA, finB, glow, trail);
    group.visible = false;
    scene.add(group);
    return { group, shaftMat, tipMat, glowMat, trailMat, glow, trail, arrowId: 0, bone: null };
  });

  // ---- 法杖技能实体（v7c #12）：奥术飞弹沿世界方向自由飞行、电环贴地脉冲 ----
  // 直接读 world.abilities 的实体状态（自带半径 / 剩余寿命），池化 mesh 按数量显隐，
  // 不引入表现层计时状态 → 暂停 / 时间缩放下与 Core 完全同步。世界坐标，不随 fxAnchor 旋转。
  // v9s.17：菱形飞弹 —— 八面体沿飞行方向拉长成梭形（横向窄、纵向长）。
  // 单位半径建模，整组按 pr.radius 缩放：视觉尺寸只由 Core 命中半径 + boltShape* 决定。
  const boltGeo = new THREE.OctahedronGeometry(1, 0);
  const boltShape = new THREE.Vector3(pfx.boltShapeX, pfx.boltShapeY, pfx.boltShapeZ);
  const boltMat = new THREE.MeshBasicMaterial({
    color: pfx.boltColor, transparent: true, opacity: 0.98, depthWrite: false,
  });
  const boltGlowMat = new THREE.SpriteMaterial({
    map: glowTex, color: pfx.boltGlowColor, transparent: true, opacity: 0.45,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const boltTrailMat = new THREE.MeshBasicMaterial({
    color: pfx.boltGlowColor, map: trailTex, transparent: true, opacity: pfx.trailOpacity,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  // 单位尺寸建模、整组按 pr.radius 缩放：几何与比例只写一次
  // 拖尾：靠核心端粗 0.5、尾端收到 0.03 —— 细长渐隐才不会盖住菱形本体
  const boltTrailGeo = new THREE.CylinderGeometry(0.5, 0.03, pfx.boltTrailScale, 6, 1, true);
  boltTrailGeo.rotateX(-Math.PI / 2);
  boltTrailGeo.translate(0, 0, -pfx.boltTrailScale / 2);
  // 池子 24：一波 3 发 × 5 波 = 15 发，寿命 1.2s 内最坏情况约 18 发同时在场
  const bolts = Array.from({ length: 24 }, () => {
    const group = new THREE.Group();
    const core = new THREE.Mesh(boltGeo, boltMat);
    core.scale.copy(boltShape);
    const glow = new THREE.Sprite(boltGlowMat);
    glow.scale.setScalar(pfx.boltGlowScale);
    glow.renderOrder = 6;
    const trail = new THREE.Mesh(boltTrailGeo, boltTrailMat);
    trail.renderOrder = 5;
    group.add(core, glow, trail);
    group.visible = false;
    scene.add(group);
    return { group, core };
  });
  // RingGeometry 内外半径按 1 归一化，实例用 scale 套用状态里的真实半径
  // 电环范围：v9s.11 从「一条细环」升级为「内部柔光 + 边界呼吸」的范围圈，
  // 玩家一眼能读出「这块地危险、还有多久」，而不是只看到一个光圈。
  const shockRings = Array.from({ length: 6 }, () => {
    const area = createAreaRing({
      color: '#9ad0ff', edgeWidthRatio: 0.038, y: 0.045, renderOrder: 2,
    });
    area.group.visible = false;
    scene.add(area.group);
    return area;
  });

  // ---- 冲刺 / 闪避一次性光环（世界坐标、池化复用，不随角色旋转） ----
  // 用 dash.id 变化触发（而非 events）：step 每帧开头会清空事件队列，低帧率一帧多步时
  // 只有最后一步的事件会留下；id 是持久状态，保证一次触发必定被表现层看到一次。
  const dashFx = view.dash;
  const dashRingGeo = new THREE.RingGeometry(dashFx.ringRadius - 0.06, dashFx.ringRadius, 28);
  const dashRings = Array.from({ length: 6 }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(dashRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, life: 0, base: 1 };
  });
  function spawnDashRing(x: number, z: number, y: number, color: string, scale: number): void {
    const r = dashRings.find((e) => e.life <= 0) ?? dashRings[0];
    r.mat.color.set(color);
    r.mesh.position.set(x, y + 0.04, z);
    r.base = scale;
    r.mesh.scale.setScalar(scale * 0.6);
    r.mesh.visible = true;
    r.mat.opacity = 0.9;
    r.life = dashFx.fxDuration;
  }
  // ---- v9a 派生招一次性光环（起手 / 命中各一圈，按持久 id 变化触发） ----
  // 与 dash 特效同理：step 每帧开头清空事件队列，低帧率一帧多步时只有最后一步的事件
  // 会留下，故用 world.playerLink.id / hitIds.length 这类持久状态，保证不漏触发。
  const linkFx = view.links;
  const linkRingGeo = new THREE.RingGeometry(linkFx.ringRadius - 0.07, linkFx.ringRadius, 28);
  const linkRings = Array.from({ length: 5 }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: linkFx.chargeColor, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(linkRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, life: 0, base: 1 };
  });
  function spawnLinkRing(x: number, z: number, y: number, scale: number): void {
    const r = linkRings.find((e) => e.life <= 0) ?? linkRings[0];
    r.mesh.position.set(x, y + 0.05, z);
    r.base = scale;
    r.mesh.scale.setScalar(scale * 0.55);
    r.mesh.visible = true;
    r.mat.opacity = 0.85;
    r.life = linkFx.fxDuration;
  }
  // ---- v9s.37 击地冲击（大剑第三击）：贴地扩散的尘环 ----
  // 触发读 Core 的持久字段 `combat.slamAttackId`（不是事件队列）：
  // 低帧率下一帧可能跑多步、事件只剩最后一步的，只有持久 id 能保证不漏。
  const slamFx = view.groundSlam;
  // 环带做厚（22% 半径宽）+ 加色混合：贴地环如果太细，会和角色脚下那圈「八向指示环」
  // 叠在一起分不出来 —— 玩家要能一眼看出「这是砸出来的，不是 UI」。
  const slamRingGeo = new THREE.RingGeometry(0.78, 1, 56);
  const slamRings = Array.from({ length: 4 }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: slamFx.color, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(slamRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, life: 0, base: 1, delay: 0 };
  });
  function spawnSlamRing(x: number, z: number, y: number, radius: number, delay: number): void {
    const r = slamRings.find((e) => e.life <= 0) ?? slamRings[0];
    r.mat.color.set(slamFx.color);
    r.mesh.position.set(x, y + 0.035, z);
    r.base = radius;
    r.mesh.scale.setScalar(radius * 0.35);
    r.mesh.visible = true;
    r.mat.opacity = 0;
    r.life = slamFx.duration;
    r.delay = delay;
  }
  let lastSlamId = world.combat.slamAttackId;
  let slamSpawns = 0;

  let lastLinkId = world.playerLink.id;
  let lastLinkHits = world.playerLink.hitIds.length;

  let lastDashId = world.dash.id;
  let lastDashKind = 'none';


  // ---- 2.5D 相机（叠加 Core 的智能构图意图） ----
  const cam = createCameraRig(view.camera, view.smartCamera, view.zoom, w0 / h0);
  const p0 = world.character.position;
  cam.update(p0.x, p0.y, p0.z, 1, world.camera);

  function pickDummy(clientX: number, clientY: number): number {
    if (dummyGroups.length === 0) return 0;
    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, cam.camera);
    const hits = raycaster.intersectObjects(dummyGroups, true);
    for (const hit of hits) {
      const id = hit.object.userData.dummyId as number | undefined;
      if (id && id > 0) return id;
    }
    return 0;
  }

  function projectToScreen(x: number, y: number, z: number): { x: number; y: number } {
    const rect = renderer.domElement.getBoundingClientRect();
    const p = new THREE.Vector3(x, y, z).project(cam.camera);
    return {
      x: rect.left + (p.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-p.y * 0.5 + 0.5) * rect.height,
    };
  }

  // v9s.22 命中定格（hitstop）→ v9s.29 改由 Core 驱动。
  // Core 的 `combat.hitstop` 会冻结攻击时间轴（进度 / 前冲 / 连击窗口），
  // 表现层这边只做两件事：冻结骨架刷新 + 命中那一刻的镜头震动。
  // 旧版自己数 hitCount 并冻结 70ms，Core 却继续走 —— 冻结结束会补一帧滑动；
  // 现在两边同一份计时，停就是真停。
  let wasHitstop = false;

  return {
    balanceDebug() {
      return voxel.balanceDebug();
    },
    spineDebug() {
      return voxel.spineDebug();
    },
    gaitDebug() {
      return voxel.gaitDebug();
    },
    trailDebug() {
      return playerTrail.debug();
    },
    stretchDebug() {
      const s = voxel.stretch();
      return { arm: s.arm, leg: s.leg, torso: s.torso, impact: s.impact };
    },
    swingDebug() {
      return voxel.swingDebug();
    },
    stanceDebug() {
      return voxel.stanceDebug();
    },
    bladeWorld() {
      return voxel.weaponBlade();
    },
    bladesWorld() {
      return voxel.bladesWorld();
    },
    slamDebug() {
      return {
        spawns: slamSpawns,
        lastId: lastSlamId,
        live: slamRings.filter((r) => r.life > 0).map((r) => ({
          life: r.life, scale: r.mesh.scale.x, opacity: r.mat.opacity, visible: r.mesh.visible,
        })),
      };
    },
    yawDebug() {
      return { target: yawTarget, shown: yawSmoother.value, tauMs: view.renderInterp?.yawSmoothMs ?? 0 };
    },
    renderPose() {
      return {
        x: playerRoot.position.x,
        y: playerRoot.position.y,
        z: playerRoot.position.z,
        bodyYaw: playerRoot.rotation.y,
      };
    },
    projectPoint(x, y, z) {
      return projectToScreen(x, y, z);
    },
    setClipT(t) {
      voxel.setClipT(t);
    },
    weaponDebug() {
      return voxel.weaponDebug();
    },
    gripDebug() {
      return voxel.gripDebug();
    },
    render(w, frameDt): void {
      const c = w.character;
      const cb = w.combat;

      // 卡肉完全由 Core 计时：这里只读状态，不再自建冻结时长（两边计时不一致会互相打架）。
      const stopping = view.hitstop.enabled && w.combat.hitstop > 0;
      // v9s.37：卡肉不再是「冻住」，而是把动画时间轴压慢（Core 的 combat.warp）。
      // 表现层跟着同一个速率走 —— 否则 Core 在 5% 慢放、画面却完全静止，两边会错开。
      // 旧行为（warp.enabled=false）下 Core 的 warp 恒为 0，这里等价于原来的 frozen。
      const animDt = frameDt * Math.max(0, Math.min(4, cb.warp ?? 1));
      if (stopping && !wasHitstop) {
        // 上升沿：震动 + 方向性微推。
        // v9s.33 分层：卡肉时长本身已按「受击类型 × 武器」分档（Core），
        // 这里直接用时长反推震感 —— 停得越久，震得越重，两个通道天然同步。
        const dur = Math.max(0, w.combat.hitstop);
        const tier = Math.max(0, Math.min(1, dur / 0.1));   // 45ms ≈ 0.45、100ms = 1
        cam.addShake(0.34 + tier * 0.48);
        // 方向性微推：从玩家指向受击者。取本帧第一条 hit 事件（同一帧多目标时取首个）。
        let hit: { x: number; z: number } | null = null;
        for (let i = 0; i < w.events.length; i++) {
          const e = w.events[i];
          if (e.type === 'hit') { hit = e; break; }
        }
        if (hit) {
          cam.addKick(hit.x - c.position.x, hit.z - c.position.z, 0.03 + tier * 0.05);
        }
      }
      wasHitstop = stopping;

      // v9s.31：关键帧事件 → 表现层一次性效果。
      // Core 保证「每条通知恰好一次」，这里只做映射，不再自己按进度猜时机。
      // v9s.32：**空挥不再震屏**。镜头震动是「打实了」的反馈，只能由 Core 的
      // hitstop 触发；blade-air 改成让刀光闪一下 —— 有挥击反馈，但不会让玩家
      // 误以为命中了。foot-step 同理，只保留事件供后续音效 / 尘土使用。
      for (let i = 0; i < w.events.length; i++) {
        const e = w.events[i];
        if (e.type !== 'notify') continue;
        const v = Number.isFinite(e.value) ? e.value : 0;
        if (e.name === 'blade-air') {
          const k = Math.max(0, Math.min(1, v));
          playerTrail.pulse((cb.weapon === 'greatsword' ? 0.9 : 0.55) * (0.4 + 0.6 * k));
        }
      }

      playerRoot.position.set(c.position.x, c.position.y, c.position.z);
      // 身体用平滑朝向（bodyYaw），头 / 腿由 rig 内部按各自角度分离驱动
      // v9s.35：在插值结果之上再走一次朝向低通（默认 35ms，≈半帧）；0 即关闭，A/B 用。
      yawTarget = c.bodyYaw;
      playerRoot.rotation.y = yawSmoother.update(
        yawTarget, frameDt, view.renderInterp?.yawSmoothMs ?? 0,
      );
      // 翻滚：绕身体局部 X 轴前滚一整圈，同时按正弦压低重心贴地。
      // 进度直接取 Core 的 dash.timer / duration，不引入表现层自己的计时状态。
      const rolling = w.dash.phase === 'active' && w.dash.kind === 'roll';
      const rollT = rolling && w.dash.duration > 0
        ? Math.min(1, 1 - w.dash.timer / w.dash.duration)
        : 0;
      rollPivot.rotation.x = rolling ? rollT * Math.PI * 2 : 0;
      rollPivot.position.y = ROLL_PIVOT_Y - (rolling ? 0.2 * Math.sin(Math.PI * rollT) : 0);
      // coreTime 传 Core 的 world.time：落地缓冲脉冲因此与暂停 / 时间缩放 / 单步同步
      if (animDt > 0) {
        voxel.update(c, cb, w.playerHurt, animDt, w.abilities.channeling, w.time, w.playerLink, w.turnInPlace);
      }

      // v9s.22：挥击拖尾 —— 取本帧武器的刃根/刃尖世界坐标，只在攻击/冲刺期间记录。
      // 拖尾是「轨迹」而不是「姿势」，是打击感最直接的来源（对应 2D 的 smear frame）。
      playerTrail.update(
        animDt,
        animDt > 0 ? voxel.weaponBlade() : null,
        animDt > 0 && (
          // v9s.23：只在实际挥出的 active 段采样。旧版把 windup 也算进来，
          // 举剑起手那 0.2s 的慢速位移会先拉出一条长带，接上 active 的横扫后
          // 变成一整个半圆「白色拱门」，把角色整个人挡住。
          cb.phase === 'active'
          || w.playerLink.phase === 'active'
          || (rolling && w.dash.duration > 0)
        ),
      );

      if (animDt > 0) {
        for (let i = 0; i < dummyRigs.length; i++) {
          if (w.dummies[i]) dummyRigs[i].update(w.dummies[i], animDt);
        }
      }

      // v9s.9 / v9s.10：脚下半环 —— 弧心朝相机侧（屏幕下方），假人颜色读 Core 威胁等级
      const camPos = cam.camera.position;
      const ringYaw = Math.atan2(camPos.x - c.position.x, camPos.z - c.position.z);
      // 受击守卫剩余比例：刚被打过的 2s 内玩家环额外闪烁（对应 Core 的 hurtHoldSec）
      const holdSec = w.config.gaze.hurtHoldSec;
      const sinceHurt = w.time - w.playerHurt.lastAt;
      const guardRatio = holdSec > 0 && sinceHurt >= 0 && sinceHurt < holdSec
        ? 1 - sinceHurt / holdSec
        : 0;
      const pv = playerRingVisual(w.gaze.active, w.gaze.threat, guardRatio, w.time, ringCfg);
      threatRingColor(ringColor, playerRingColor, lowThreatRingColor, highThreatRingColor, pv.level);
      // v9s.12：环贴地不随跳跃升高 —— 只在落地时记录脚下高度（跟台阶），空中保持最后一次落地高度
      ringGroundY = ringGroundHeight(c.grounded, c.position.y, ringGroundY);
      playerRing.mesh.position.set(c.position.x, ringGroundY + 0.028, c.position.z);
      playerRing.update(pv.arcRad, pv.opacity, pv.scale, ringColor, ringYaw);

      // 进度弧：蓄力 > 引导 > 冲刺冷却，沿主环外侧从左往右填充（close → 满 = 可用）
      const arcaneCfg = w.config.abilities.arcane;
      const waves = Math.max(1, Math.floor(arcaneCfg.waves));
      const waveIv = Math.max(1e-4, arcaneCfg.waveInterval);
      const meter = playerMeterSource({
        charging: cb.charging,
        charge: cb.charge,
        channeling: w.abilities.channeling,
        fireTimer: w.abilities.fireTimer,
        fireInterval: waveIv,
        // 整轮进度：已放完的波数 + 当前波内已经过去的时间
        channelProgress: w.abilities.channeling
          ? (w.abilities.waveIndex + (1 - Math.min(1, Math.max(0, w.abilities.fireTimer / waveIv)))) / waves
          : 0,
        arcaneCooldown: w.abilities.cooldown,
        arcaneCooldownMax: arcaneCfg.cooldown,
        dashCooldown: w.dash.cooldown,
        dashCooldownMax: w.dash.kind === 'blink'
          ? w.config.dash.blinkCooldown
          : w.config.dash.rollCooldown,
      });
      playerMeter.mesh.position.set(c.position.x, c.position.y + 0.03, c.position.z);
      playerMeter.set(
        meter.ratio,
        meter.source === 'none' ? 0 : ringCfg.meterOpacity,
        meter.source === 'charge' ? chargeMeterColor
          : meter.source === 'channel' ? channelMeterColor : cooldownMeterColor,
        ringYaw,
      );

      // 冲锋落点预览：起手阶段就在落点画范围圈，冲锋不再是「盲跳」
      const lp = w.playerLink;
      const landMove = lp.weapon ? w.config.links.moves[lp.weapon] : undefined;
      const landing = linkLandingPreview(
        lp.phase, c.position.x, c.position.z, lp.facing, lp.travel,
        landMove?.hit.radius ?? 0.9,
      );
      landingPreview.set(
        landing.x, landing.z, 0.042, landing.radius,
        landing.active ? ringCfg.landingOpacity : 0, w.time,
      );

      for (let i = 0; i < dummyRings.length; i++) {
        const d = w.dummies[i];
        const ring = dummyRings[i];
        const halo = dummyHalos[i];
        const warnArc = dummyWarns[i];
        if (!d) {
          ring.mesh.visible = false;
          halo.mesh.visible = false;
          warnArc.mesh.visible = false;
          continue;
        }
        const selected = w.targeting.hasTarget && w.targeting.targetId === d.id;
        if (isHostileDummy(w, d)) {
          const level = dummyThreatLevel(w, d);
          ringColor.copy(lowThreatRingColor).lerp(highThreatRingColor, level);
        } else {
          ringColor.copy(neutralRingColor);
        }
        // 起手预警：windup 阶段把主环压向警示红，同时让预警弧从左往右「读秒」
        const warn = dummyWindupWarning(
          d.attackPhase, d.attackPhaseTimer, w.config.dummies.attackWindup,
        );
        if (warn.active) {
          ringColor.lerp(warnRingColor, 0.5 * warn.urgency);
          warnArc.mesh.position.set(d.position.x, d.position.y + 0.031, d.position.z);
          warnArc.set(
            warn.ratio,
            ringCfg.warnOpacity * (0.65 + 0.35 * warn.urgency),
            warnRingColor,
            ringYaw,
          );
        } else {
          warnArc.set(0, 0, warnRingColor, ringYaw);
        }
        // 选中混合量：弧长 / 厚度 / 提亮 / 外发光全部走同一条缓动曲线，
        // 淡入 0.14s、淡出 0.36s —— 切换目标时是「环长出来 / 光收回去」，不是瞬间换一张贴图。
        const mixTarget = selected ? 1 : 0;
        const tau = mixTarget > selMix[i] ? ringCfg.haloFadeInSec : ringCfg.haloFadeOutSec;
        selMix[i] = fadeTowards(selMix[i], mixTarget, frameDt, tau);
        const sm = selMix[i];
        // 呼吸只在选中时出现，且随混合量淡入，避免刚取消时还在跳
        const breath = 1 + 0.02 * sm * Math.sin(w.time * 2.2 + d.id);
        const arcDeg = ringCfg.arcDeg + (ringCfg.selectedArcDeg - ringCfg.arcDeg) * sm;
        ring.mesh.position.set(d.position.x, d.position.y + 0.022, d.position.z);
        ring.update(
          (arcDeg * Math.PI) / 180,
          ringCfg.opacity + (ringCfg.selectedOpacity - ringCfg.opacity) * sm,
          1 + (ringCfg.selectedScale - 1) * sm * breath,
          ringColor,
          ringYaw,
          1 + (ringCfg.selectedThicknessScale - 1) * sm,
        );
        // 外发光跟随同一条混合量，但淡出更慢：光晕在环已经收回半环之后才彻底散掉，
        // 半径从 1.0 收到 0.94，读起来是「光慢慢缩回去」而不是硬切黑。
        haloMix[i] = fadeTowards(
          haloMix[i], mixTarget, frameDt,
          mixTarget > haloMix[i] ? ringCfg.haloFadeInSec : ringCfg.haloFadeOutSec,
        );
        const mix = haloMix[i];
        halo.mesh.position.set(d.position.x, d.position.y + 0.019, d.position.z);
        halo.update(
          (arcDeg * Math.PI) / 180,
          ringCfg.haloOpacity * mix * (0.88 + 0.12 * Math.sin(w.time * 2.2 + d.id)),
          ringCfg.selectedScale * (0.94 + 0.06 * mix) * breath,
          ringColor,
          ringYaw,
        );
      }

      fxAnchor.position.set(c.position.x, c.position.y, c.position.z);
      fxAnchor.rotation.y = cb.phase !== 'idle' ? cb.attackFacing : c.bodyYaw;

      // 冲刺 / 闪避：翻滚在起点放一圈尘环；闪现在起点 + 落点各放一圈（落点更大更亮）
      if (w.dash.id !== lastDashId) {
        lastDashId = w.dash.id;
        const d = w.dash;
        lastDashKind = d.kind;
        if (d.kind === 'blink') {
          spawnDashRing(d.fromX, d.fromZ, c.position.y, dashFx.blinkColor, 0.9);
          spawnDashRing(d.toX, d.toZ, c.position.y, dashFx.blinkColor, 1.35);
        } else {
          spawnDashRing(d.fromX, d.fromZ, c.position.y, dashFx.rollColor, 1.1);
        }
      }
      for (const r of dashRings) {
        if (r.life <= 0) continue;
        r.life -= frameDt;
        const t = Math.max(0, r.life / dashFx.fxDuration);
        r.mat.opacity = 0.9 * t;
        r.mesh.scale.setScalar(r.base * (0.6 + (1 - t) * 1.2));
        if (r.life <= 0) r.mesh.visible = false;
      }

      // v9s.37：大剑第三击落地 —— 尘环 + 一次比普通命中更重的镜头下压。
      // 半径取 Core 的判定半径：尘环边缘就是真实判定边界，玩家能「看着圈躲」。
      if (w.combat.slamAttackId !== lastSlamId) {
        lastSlamId = w.combat.slamAttackId;
        slamSpawns += 1;
        if (slamFx.enabled) {
          const gs = w.config.combat.weapons[cb.weapon]?.groundSlam;
          const rad = Math.max(0.6, gs?.radius ?? 2.2);
          spawnSlamRing(c.position.x, c.position.z, c.position.y, rad, 0);
          spawnSlamRing(c.position.x, c.position.z, c.position.y, rad * slamFx.outerScale, slamFx.delay);
          cam.addShake(slamFx.shake);
        }
      }
      for (const r of slamRings) {
        if (r.life <= 0) continue;
        if (r.delay > 0) {
          r.delay -= frameDt;
          continue;
        }
        r.life -= frameDt;
        const t = Math.max(0, r.life / Math.max(slamFx.duration, 1e-6));
        // 先快后慢：前 30% 冲出大半半径，之后缓下来收尾，读作「冲击」而不是「匀速放大」
        const grow = 1 - Math.pow(t, 1.8);
        r.mesh.scale.setScalar(r.base * (0.35 + 0.65 * grow));
        r.mat.opacity = 0.85 * Math.pow(t, 1.3);
        if (r.life <= 0) r.mesh.visible = false;
      }

      // v9a：盾击起手 / 命中各放一圈光环（纯观感，读 Core 持久状态）
      const lk = w.playerLink;
      if (lk.id !== lastLinkId) {
        lastLinkId = lk.id;
        lastLinkHits = lk.hitIds.length;
        spawnLinkRing(c.position.x, c.position.z, c.position.y, 1.0);
      }
      if (lk.hitIds.length > lastLinkHits) {
        lastLinkHits = lk.hitIds.length;
        spawnLinkRing(c.position.x, c.position.z, c.position.y, 1.35);
      } else if (lk.hitIds.length < lastLinkHits) {
        lastLinkHits = lk.hitIds.length;
      }
      for (const r of linkRings) {
        if (r.life <= 0) continue;
        r.life -= frameDt;
        const t = Math.max(0, r.life / Math.max(linkFx.fxDuration, 1e-6));
        r.mat.opacity = 0.85 * t;
        r.mesh.scale.setScalar(r.base * (0.55 + (1 - t) * 1.1));
        if (r.life <= 0) r.mesh.visible = false;
      }

      // v9s.22：轻击不再画「斩击弧」—— 那是一个固定在身前的白色环，和真实刀轨
      // 没关系，反而会盖住贴刀身的拖尾。只有 comboIndex >= 3 的重击保留弧光，
      // 作为「这一下特别重」的额外信号。
      const showSlash = pfx.slashEnabled && cb.phase === 'active' && cb.comboIndex >= 3;
      slashMat.opacity = showSlash ? 0.7 : 0;
      slashGlowMat.opacity = showSlash ? pfx.slashGlowOpacity : 0;
      if (showSlash) {
        slashGroup.rotation.z = -1.2 + cb.attackProgress * 3.2;
        slashGroup.scale.setScalar(0.9 + cb.comboIndex * 0.13);
      }

      // 奥术飞弹：按实体同步位置 / 半径 / 朝向（组朝飞行方向，本体不再自转）
      // v9s.18：去掉核心绕 Y 的自转 —— 菱形梭的尖头必须稳定指向速度方向，
      // 自转会让「指向哪」读不出来（看起来只是一团在翻滚的碎片）。
      for (let i = 0; i < bolts.length; i++) {
        const pr = w.abilities.projectiles[i];
        const e = bolts[i];
        e.group.visible = !!pr;
        if (pr) {
          e.group.position.set(pr.x, pr.y, pr.z);
          e.group.scale.setScalar(pr.radius);
          e.group.rotation.set(0, Math.atan2(pr.dirX, pr.dirZ), 0);
        }
      }
      // 电环：范围圈（内部柔光 + 边界呼吸），边界越接近消失越暗 —— 剩余时间可直接读
      for (let i = 0; i < shockRings.length; i++) {
        const ring = w.abilities.rings[i];
        const e = shockRings[i];
        if (!ring) {
          e.group.visible = false;
          continue;
        }
        const t = Math.max(0, Math.min(1, ring.life / Math.max(ring.duration, 1e-6)));
        // 从放置点（角色中心）向外展开：easeOutCubic，同时淡入，不是凭空出现一个满半径大圈
        const open = areaOpen(Math.max(0, ring.duration - ring.life), ringCfg.areaExpandSec);
        e.set(
          ring.x, ring.z, 0.045,
          ring.radius * open.scale,
          ringCfg.areaOpacity * (0.35 + 0.65 * t) * open.alpha,
          w.time,
        );
      }

      // ---- 箭矢：直接读 Core 实体（位置 / 俯仰 / 插住状态全部由 Core 算） ----
      // 飞行中保留光晕与拖尾（任意角度都看得见、读得出速度方向）；
      // 插住后关掉拖尾、压暗光晕，只在末尾 0.6s 淡出 —— 读起来就是「钉在那儿」。
      // v9s.18：命中假人的箭会**挂到被打中的那根骨骼节点下**（dummy-rig.boneAtWorld），
      // 于是假人转身、抬手、迈步时箭跟着一起动，而不是浮在世界坐标里。
      for (let i = 0; i < arrowVisuals.length; i++) {
        const ar = w.arrows[i];
        const e = arrowVisuals[i];
        if (!ar) {
          e.group.visible = false;
          if (e.bone) {
            // 挂回 scene 再隐藏：否则池子复用时它还是某根骨骼的子节点
            scene.attach(e.group);
            e.bone = null;
          }
          e.arrowId = 0;
          continue;
        }
        const onDummy = ar.stuck && ar.stuckDummy >= 0;
        // 换了一支箭（或第一次出现）：先归位到世界坐标，再决定要不要挂骨骼
        if (e.arrowId !== ar.id) {
          if (e.bone) {
            scene.attach(e.group);
            e.bone = null;
          }
          e.arrowId = ar.id;
          e.group.position.set(ar.x, ar.y, ar.z);
          e.group.rotation.set(ar.pitch, ar.yaw, 0, 'YXZ');
          if (onDummy) {
            const rig = dummyRigs[ar.stuckDummy];
            const hit = rig ? rig.boneAtWorld(ar.x, ar.y, ar.z) : null;
            if (hit) {
              // attach 保留世界变换：箭在视觉上不跳，之后由骨骼带着走
              hit.node.attach(e.group);
              e.bone = hit.node;
            }
          }
        } else if (!e.bone) {
          // 飞行中 / 插在地上：每帧按 Core 状态摆放
          e.group.position.set(ar.x, ar.y, ar.z);
          // 先水平朝向、再俯仰：YXZ 的矩阵是 Ry·Rx，正好对应「箭尖朝飞行方向」
          e.group.rotation.set(ar.pitch, ar.yaw, 0, 'YXZ');
        }
        e.group.visible = true;
        const fade = ar.stuck
          ? Math.min(1, ar.rest / 0.6)
          : 1;
        e.shaftMat.opacity = fade;
        e.tipMat.opacity = fade;
        e.glowMat.opacity = (ar.stuck ? 0.28 : 0.85) * fade;
        e.trailMat.opacity = ar.stuck ? 0 : pfx.trailOpacity * fade;
        e.trail.visible = !ar.stuck;
      }

      cam.update(c.position.x, c.position.y, c.position.z, frameDt, w.camera);
      renderer.render(scene, cam.camera);
    },
    resize(): void {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h, false);
      cam.resize(w / h);
    },
    getGroundBasis(): GroundBasis {
      return cam.getGroundBasis();
    },
    setCollidersVisible(v): void {
      for (const m of materials) {
        m.opacity = v ? 0.3 : 1;
        m.wireframe = v;
        m.needsUpdate = true;
      }
    },
    setGridVisible(v): void {
      grid.visible = v;
    },
    setLabVisible(v): void {
      lab.setVisible(v);
    },
    setLabLabelsVisible(v): void {
      lab.setLabelsVisible(v);
    },
    snapCamera(x, y, z): void {
      cam.snap(x, y, z);
    },
    setZoom(next): void {
      cam.setZoom(next);
    },
    setBodyType(id: string): string {
      const bt = view.bodyTypes?.[id];
      if (!bt || id === bodyTypeId) return bodyTypeId;
      // 先摘再销毁：销毁会 dispose 几何体，若还在场景图里，当帧渲染会拿到空几何。
      rollPivot.remove(voxel.group);
      voxel.dispose();
      voxel = buildRig(bt);
      voxel.group.position.y = -ROLL_PIVOT_Y;
      rollPivot.add(voxel.group);
      // 旧骨架的刀光采样还挂在上一副身体的刃尖坐标上：不清理会残留最多 life(0.11s)
      // 一条「悬空划痕」，且新骨架第一帧的刃身位置差得很远，连起来像瞬移。
      playerTrail.reset();
      bodyTypeId = id;
      // 身高 / 半径同步进 Core 配置：否则碰撞、眼睛高度、相机注视点还是旧体型的值。
      world.config.characterHeight = bt.height;
      if (bt.radius !== undefined) world.config.characterRadius = bt.radius;
      return bodyTypeId;
    },
    bodyTypes() {
      return { id: bodyTypeId, ids: Object.keys(view.bodyTypes ?? {}) };
    },
    pickDummy,
    projectToScreen,
    diagnostics(): {
      lean: { forward: number; side: number };
      slashNormal: { x: number; y: number; z: number };
      arrowForward: { x: number; y: number; z: number };
      gait: { hipYaw: number; gaitYaw: number };
      attackBlend: number;
      attackWeights: {
        gaitScale: number; attackLegWeight: number; driveSpeed: number; stridePhase: number;
      };
      landing: {
        pulse: number; remaining: number; kind: 'none' | 'land' | 'jump'; impactVy: number;
      };
      hurt: HurtPose;
      /** v8g：足部 IK 锚定诊断（active / weight / clamped / maxError） */
      ik: { active: boolean; weight: number; clamped: number; maxError: number };
      link: {
        phase: string; kind: string; window: number; cooldown: number;
        progress: number; hits: number; id: number;
      };
      dash: { rollAngle: number; activeRings: number; lastKind: string };
      camera: {
        threat: number;
        threatCount: number;
        distanceScale: number;
        offsetX: number;
        offsetZ: number;
        pitchDelta: number;
        /** v8e：平滑后的用户缩放倍率（>1 拉远、<1 拉近） */
        zoom: number;
        /** v9s.31：镜头震动能量 0..1（关键帧事件 / 命中共用） */
        shake: number;
        /** v9s.33：方向性微推能量 0..1（命中方向） */
        kick: number;
        /** v9s.33：累计触发的微推次数（确认命中上升沿确实调到了 addKick） */
        kickCount: number;
      };
    } {
      // v7c #10：斩击弧中心轴（盘面法线）恒为角色正前方（局部 +Z），再绕身体朝向
      // 旋转到世界空间。用纯函数 fx-axis 计算，与 tests/fx-axis.test.ts 共用同一份定义，
      // 便于把「特效轴朝哪」直接读出 / 断言；撤销了 v6a 的 -pitchDeg 倾斜，故 y 恒为 0
      // （水平朝前），不再是斜前上方。
      const axisLocal = slashAxisLocal(view.camera.pitchDeg);
      const axisWorld = rotateAxisY(axisLocal, fxAnchor.rotation.y);
      return {
        lean: voxel.lean(),
        slashNormal: axisWorld,
        arrowForward: voxel.arrowDirection(),
        gait: { hipYaw: voxel.hipYaw(), gaitYaw: voxel.gaitYaw() },
        attackBlend: voxel.attackBlend(),
        attackWeights: voxel.attackWeights(),
        landing: voxel.landing(),
        hurt: voxel.hurt(),
        ik: voxel.ik(),
        link: {
          phase: world.playerLink.phase,
          kind: world.playerLink.kind,
          window: world.playerLink.linkWindow,
          cooldown: world.playerLink.cooldown,
          progress: world.playerLink.progress,
          hits: world.playerLink.hitIds.length,
          id: world.playerLink.id,
        },
        dash: {
          rollAngle: rollPivot.rotation.x,
          activeRings: dashRings.filter((r) => r.life > 0).length,
          lastKind: lastDashKind,
        },
        camera: {
          threat: world.camera.threat,
          threatCount: world.camera.threatCount,
          ...cam.smart(),
          shake: cam.shakeLevel(),
          kick: cam.kickLevel(),
          kickCount: cam.kickCount(),
        },
      };
    },
    dispose(): void {
      voxel.dispose();
      lab.dispose();
      for (const rig of dummyRigs) rig.dispose();
      playerRing.dispose();
      for (const ring of dummyRings) ring.dispose();
      for (const halo of dummyHalos) halo.dispose();
      playerMeter.dispose();
      playerTrail.dispose();
      for (const m of dummyWarns) m.dispose();
      landingPreview.dispose();
      slashGeo.dispose();
      slashMat.dispose();
      slashGlowMat.dispose();
      boltGeo.dispose();
      boltMat.dispose();
      boltGlowMat.dispose();
      boltTrailMat.dispose();
      boltTrailGeo.dispose();
      for (const e of shockRings) e.dispose();
      arrowShaftGeo.dispose();
      arrowTipGeo.dispose();
      arrowFinGeo.dispose();
      arrowTrailGeo.dispose();
      for (const a of arrowVisuals) {
        a.shaftMat.dispose();
        a.tipMat.dispose();
        a.glowMat.dispose();
        a.trailMat.dispose();
      }
      glowTex.dispose();
      trailTex.dispose();
      for (const r of dashRings) r.mat.dispose();
      for (const r of slamRings) r.mat.dispose();
      dashRingGeo.dispose();
      for (const r of linkRings) r.mat.dispose();
      linkRingGeo.dispose();
      boxGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
