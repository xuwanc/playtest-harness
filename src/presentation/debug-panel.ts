import GUI from 'lil-gui';
import { WEAPON_ORDER } from '../core';
import type { ViewConfig, World } from '../core';

export type DebugState = {
  timeScale: number;
  paused: boolean;
  showColliders: boolean;
  showGrid: boolean;
};

export type DebugPanel = {
  gui: GUI;
  /** 武器被按钮 / 键盘切换后，刷新下拉框显示（lil-gui 不会自动同步外部赋值） */
  refreshWeapon(): void;
};

export type DebugActions = {
  singleStep(): void;
  reset(): void;
  /** v8e：把用户缩放倍率归 1（恢复基础镜头距离） */
  resetZoom(): void;
  onToggleColliders(v: boolean): void;
  onToggleGrid(v: boolean): void;
};

/** 所有可调参数直接绑定 world.config / view 对象，热改即时生效，无需重编译。 */
export function createDebugPanel(
  world: World,
  view: ViewConfig,
  state: DebugState,
  actions: DebugActions,
): DebugPanel {
  const container = document.getElementById('debug-panel');
  const gui = container
    ? new GUI({ title: '实验台 · 调试面板', autoPlace: false, container })
    : new GUI({ title: '实验台 · 调试面板' });

  const sim = gui.addFolder('模拟');
  sim.add(state, 'timeScale', 0, 3, 0.05).name('时间缩放');
  sim.add(state, 'paused').name('暂停');
  sim.add({ step: actions.singleStep }, 'step').name('单步 (1 tick)');
  sim.add({ reset: actions.reset }, 'reset').name('复位全部');

  const mods = gui.addFolder('模块');
  mods.add(world.modules, 'movement').name('movement');
  mods.add(world.modules, 'combat').name('combat');
  mods.add(world.modules, 'links').name('links');
  mods.add(world.modules, 'orientation').name('orientation');
  mods.add(world.modules, 'targeting').name('targeting');
  mods.add(world.modules, 'hits').name('hits');
  mods.add(world.modules, 'separation').name('separation');
  mods.add(world.modules, 'dash').name('dash');
  mods.add(world.modules, 'camera').name('camera');
  mods.add(world.modules, 'dummies').name('dummies');
  mods.add(world.modules, 'abilities').name('abilities');
  // pathfinding 本期只定义契约，开关留到接入算法时接线

  const cfg = world.config;
  const mv = gui.addFolder('移动参数');
  mv.add(cfg, 'moveSpeed', 1, 10, 0.1).name('移动速度');
  mv.add(cfg, 'sprintMultiplier', 1, 3, 0.05).name('冲刺倍率');
  mv.add(cfg, 'acceleration', 1, 40, 0.5).name('加速度');
  mv.add(cfg, 'friction', 1, 40, 0.5).name('摩擦');
  mv.add(cfg, 'gravity', 5, 60, 0.5).name('重力');
  mv.add(cfg, 'jumpSpeed', 2, 16, 0.2).name('起跳速度');
  mv.add(cfg, 'stepHeight', 0, 1.2, 0.01).name('自动爬台阶阈值');
  mv.add(cfg, 'characterRadius', 0.1, 0.8, 0.01).name('角色半径');
  mv.add(cfg, 'characterHeight', 0.6, 2.2, 0.05).name('角色身高');
  mv.add(cfg, 'strideLength', 0.3, 3, 0.05).name('基础步幅');
  mv.add(cfg, 'strideSpeedGain', 0, 1.5, 0.05).name('步幅随速度增益');
  mv.add(cfg, 'strideSpeedCap', 0.5, 4, 0.1).name('步幅增速上限');

  // 程序化步态（v8）：全部热改即时生效，侧移 / 后退手感可直接在这里调
  const gaitF = gui.addFolder('程序化步态 (v8)');
  // v9e：脚前伸 = 步幅 × 该比例；0.25 = 支撑脚世界静止（零滑步）。调大 = 步子更大、会往后蹭。
  gaitF.add(view.gait, 'reachRatio', 0.05, 0.6, 0.01).name('脚前伸 / 步幅比');
  gaitF.add(view.gait, 'maxAmp', 0.2, 2.5, 0.05).name('摆幅上限 (rad)');
  gaitF.add(view.gait, 'sideWeight', 0, 2, 0.05).name('侧向步幅比例');
  gaitF.add(view.gait, 'crossStep', 0, 1.5, 0.05).name('交叉步强度');
  gaitF.add(view.gait, 'kneeLift', 0, 2, 0.05).name('抬膝幅度');
  // 0 = 旧余弦曲线（中段滑步）、1 = 线性支撑相（零滑步），拖到 0 可直接对照
  gaitF.add(view.gait, 'plantLock', 0, 1, 0.05).name('零滑步支撑相 0..1');
  gaitF.add(view.gait, 'strideGain', 0.1, 2, 0.05).name('摆幅回退增益(攻击用)');
  gaitF.add(view.gait, 'comSway', 0, 0.2, 0.005).name('重心侧移 (m)');
  gaitF.add(view.gait, 'comBob', 0, 0.2, 0.005).name('重心起伏 (m)');
  gaitF.add(view.gait, 'hipLean', 0, 0.6, 0.01).name('侧移侧倾 (rad)');
  gaitF.add(view.gait, 'armSwing', 0, 2, 0.05).name('手臂对侧摆');

  // v9o：低速滑行修复 + 胸朝向带转，参数可直接热调 / 拉 0 对照旧行为
  const v9oF = gui.addFolder('停步 / 胸朝向 (v9o)');
  v9oF.add(view.gait, 'stopBlendSec', 0, 0.8, 0.02).name('停步收相时长 (s)');
  v9oF.add(view.gait, 'stopEnterRatio', 0.01, 0.4, 0.01).name('进入收相速度比');
  v9oF.add(view.gait, 'stopExitRatio', 0.05, 0.8, 0.01).name('退出收相速度比');
  v9oF.add(view.gait, 'chestYawScale', 0, 1.5, 0.05).name('胸随下盘偏转比例');
  v9oF.add(view.gait, 'chestYawMaxDeg', 0, 90, 1).name('胸偏转上限 (度)');

  // v9p：停步惯性 —— 最后一步踩出去 + 身体跟着惯性微前移，再收回待机；全部拉 0 = v9o 行为
  const v9pF = gui.addFolder('停步惯性 (v9p)');
  v9pF.add(view.gait, 'stopStepPitch', 0, 0.8, 0.02).name('前脚踩出 (rad)');
  v9pF.add(view.gait, 'stopTrailPitch', 0, 0.5, 0.02).name('跟随腿后蹬 (rad)');
  v9pF.add(view.gait, 'stopStepKnee', 0, 0.5, 0.02).name('前脚抬膝 (rad)');
  v9pF.add(view.gait, 'stopBodyShift', 0, 0.25, 0.005).name('身体惯性前移 (m)');
  v9pF.add(view.gait, 'stopChestPitch', 0, 0.4, 0.01).name('上身惯性前倾 (rad)');
  v9pF.add(view.gait, 'stopPeakRatio', 0.05, 0.95, 0.02).name('惯性峰值位置');

  // v9q：被击退时把击退冲量并入步态驱动，下盘跟着迈出后撤步（0 = 旧「身体平移、腿不动」）
  const v9qF = gui.addFolder('击退步态 (v9q)');
  v9qF.add(view.gait, 'knockGaitScale', 0, 1.5, 0.05).name('击退步态驱动 (0=旧)');

  // v8c/v8d：攻击下半身两条路径 + 跳跃 / 落地蓄力缓冲，热改即时生效，方便 0↔1 直接对比效果
  //   gw=1 / lw=0（默认）：过滤掉挥击跨步，下盘由「攻击等效步态」接管并持续摆动
  //   gw=0 / lw=1：只叠加单次挥击跨步，连击左右脚交替
  //   gw=0 / lw=0：完全过滤的静止基准（对照组）
  const pa = gui.addFolder('程序动画 (v8c/v8d)');
  pa.add(view.animation.attack, 'gaitWeight', 0, 1, 0.01).name('攻击时步态权重 gw');
  pa.add(view.animation.attack, 'lowerBodyWeight', 0, 1, 0.01).name('挥击跨步权重 lw');
  pa.add(view.animation.attack, 'blendRate', 1, 40, 1).name('进出攻击平滑速率');
  const st = view.animation.stride;
  pa.add(st, 'strideSpeed', 0, 8, 0.1).name('攻击等效步速 (m/s)');
  // v9p：攻击跨步改走物理步幅路径，0 = 旧「摆幅随速度」回退路径，1.3 ≈ 默认放大
  pa.add(st, 'strideScale', 0, 2.5, 0.05).name('攻击步幅系数 (0=旧)');
  pa.add(st, 'forwardBias', 0, 1, 0.01).name('前冲 / 侧跨占比');
  pa.add(st, 'cycles', 1, 3, 1).name('每段跨步周期数');
  pa.add(st, 'stepPitch', 0, 1.5, 0.02).name('跨步腿前后摆 (rad)');
  pa.add(st, 'stepKnee', 0, 1.5, 0.02).name('跨步抬膝 (rad)');
  pa.add(st, 'stepSide', 0, 1, 0.02).name('跨步侧摆 (rad)');
  pa.add(st, 'stepDip', 0, 0.3, 0.005).name('跨步重心下沉 (m)');
  pa.add(st, 'stepSway', 0, 0.2, 0.005).name('跨步骨盆侧移 (m)');
  // v8g：applyStep 骨盆位移幅度与大剑重击收敛，热调即可对比「身体离开腿」的程度
  pa.add(st, 'stepReach', 0, 0.3, 0.005).name('跨步骨盆前移 (m)');
  pa.add(st, 'stepSideReach', 0, 0.25, 0.005).name('跨步骨盆侧移 (m)');
  pa.add(st, 'stepDipReach', 0, 0.15, 0.005).name('跨步骨盆下沉 (m)');
  pa.add(st, 'heavyScale', 0, 1, 0.01).name('大剑重击收敛系数');
  pa.add(view.animation.landing, 'enabled').name('启用跳跃/落地缓冲');
  pa.add(view.animation.landing, 'duration', 0.05, 1, 0.01).name('落地缓冲时长 (s)');
  pa.add(view.animation.landing, 'compressRatio', 0.05, 0.9, 0.01).name('下压段占比');
  pa.add(view.animation.landing, 'crouchDepth', 0, 0.4, 0.005).name('重心下沉 (m)');
  pa.add(view.animation.landing, 'kneeBend', 0, 1.5, 0.02).name('屈膝 (rad)');
  pa.add(view.animation.landing, 'hipPitch', 0, 1, 0.02).name('髋前倾补偿 (rad)');
  pa.add(view.animation.landing, 'upperPitch', 0, 0.6, 0.01).name('上半身前倾 (rad)');
  pa.add(view.animation.landing, 'armTuck', 0, 0.8, 0.02).name('手臂收拢 (rad)');
  pa.add(view.animation.landing, 'impactSpeed', 1, 20, 0.5).name('冲击速度饱和 (m/s)');
  pa.add(view.animation.landing, 'minScale', 0, 1, 0.01).name('最小缓冲强度');
  pa.add(view.animation.landing, 'jumpAnticipation', 0, 1, 0.01).name('起跳预备下蹲');
  pa.add(view.animation.landing, 'anticipationDuration', 0.03, 0.5, 0.01).name('起跳预备时长 (s)');

  const cb = cfg.combat;
  const fight = gui.addFolder('战斗参数');
  const weaponCtrl = fight.add(world.combat, 'weapon', WEAPON_ORDER).name('当前武器');
  fight.add(cb, 'comboWindow', 0.1, 2, 0.05).name('连击窗口 (s)');
  fight.add(cb, 'settle', 0, 0.8, 0.01).name('段间停顿 (s)');
  fight.add(cb, 'attackMoveScale', 0, 1, 0.01).name('攻击时移动比例');
  fight.add(cb, 'autoCombo').name('按住自动连击');
  fight.add(cb.bow, 'maxChargeTime', 0.3, 3, 0.1).name('满蓄力时间 (s)');
  fight.add(cb.bow, 'minChargeToFire', 0, 1, 0.02).name('最小可发射蓄力');
  fight.add(cb.weapons.greatsword, 'windup', 0.02, 0.6, 0.01).name('大剑前摇');
  fight.add(cb.weapons.greatsword, 'active', 0.02, 0.6, 0.01).name('大剑命中帧');
  fight.add(cb.weapons.greatsword, 'recovery', 0.05, 1, 0.01).name('大剑后摇');
  fight.add(cb.weapons.greatsword, 'moveMultiplier', 0.3, 1.5, 0.05).name('大剑移速倍率');
  const ab = cfg.abilities;
  fight.add(ab.arcane, 'fireInterval', 0.05, 1, 0.01).name('奥术飞弹间隔 (s)');
  fight.add(ab.arcane, 'speed', 3, 24, 0.5).name('飞弹速度');
  fight.add(ab.arcane, 'moveScale', 0.2, 1, 0.02).name('引导时移速倍率');
  fight.add(ab.ring, 'radius', 0.5, 5, 0.1).name('电环半径');
  fight.add(ab.ring, 'stun', 0.1, 1.5, 0.05).name('电环僵直 (s)');
  fight.add(ab.ring, 'pulseInterval', 0.1, 1, 0.02).name('电环脉冲间隔');

  const or = cfg.orientation;
  const orient = gui.addFolder('朝向参数');
  orient.add(or, 'bodyTurnRate', 0.5, 30, 0.5).name('身体平滑速率');
  orient.add(or, 'headTurnRate', 0.5, 40, 0.5).name('头部转向速率');
  orient.add(or, 'maxHeadTurnDeg', 0, 90, 1).name('头部相对身体限幅');
  // 下盘偏航（v8b）：连续、限幅、平滑，替代会跨 ±π 跳变的 wrapAngle 整体转向
  orient.add(view.orientation, 'legYawScale', 0, 1, 0.01).name('下盘跟随移动强度');
  orient.add(view.orientation, 'hipYawMaxDeg', 0, 120, 1).name('下盘带转上限 (°)');
  orient.add(view.orientation, 'hipYawSmoothing', 1, 40, 1).name('下盘带转平滑速率');

  // v8g：惯性身体倾斜不再只写上半身 —— 盆骨带一点倾角 / 重心平移，移动时略微下沉
  const leanF = gui.addFolder('惯性倾斜 / 盆骨 (v8g)');
  const ln = view.lean;
  leanF.add(ln, 'accelGain', 0, 0.1, 0.002).name('前后加速度增益');
  leanF.add(ln, 'turnGain', 0, 0.2, 0.005).name('绕圈侧倾增益');
  leanF.add(ln, 'maxForwardDeg', 0, 30, 1).name('前后最大倾角 (°)');
  leanF.add(ln, 'maxSideDeg', 0, 30, 1).name('侧向最大倾角 (°)');
  leanF.add(ln, 'smoothing', 1, 30, 1).name('倾斜平滑速率');
  leanF.add(ln, 'pelvisTiltGain', 0, 1, 0.01).name('盆骨倾角比例');
  leanF.add(ln, 'pelvisShift', 0, 0.1, 0.002).name('盆骨重心平移 (m/rad)');
  leanF.add(ln, 'moveCrouch', 0, 0.15, 0.002).name('移动下沉 (m)');
  leanF.add(ln, 'crouchSmoothing', 1, 30, 1).name('下沉平滑速率');

  // v8g：两骨 IK 足部锚定（玩家 / 假人共用），关掉即可精确回到旧 FK 姿态做 A/B
  const ikF = gui.addFolder('足部 IK (v8g)');
  const ik = view.ik;
  ikF.add(ik, 'enabled').name('启用 IK 足部锚定 (关=旧 FK)');
  ikF.add(ik, 'weight', 0, 1, 0.01).name('钉地权重');
  ikF.add(ik, 'attackScale', 0, 1, 0.01).name('攻击时权重倍率');
  ikF.add(ik, 'maxCorrectionDeg', 5, 120, 1).name('单帧最大修正 (°)');

  const anim = gui.addFolder('程序动画 / 武器握持');
  anim.add(view.weaponMount, 'swordPitchDeg', 0, 90, 1).name('剑前倾角');
  anim.add(view.weaponMount, 'swordYawDeg', 0, 45, 1).name('剑外张角');
  anim.add(view.weaponMount, 'greatswordPitchDeg', 0, 90, 1).name('大剑前倾角');
  anim.add(view.weaponMount, 'staffPitchDeg', 0, 60, 1).name('法杖前倾角');
  // 受击参数统一移到「受击分层 (v8f)」分组，避免同属性在两处重复挂控制器

  const tg = cfg.targeting;
  const targeting = gui.addFolder('目标辅助');
  targeting.add(tg, 'targetAssist').name('启用目标辅助');
  targeting.add(tg, 'range', 1, 14, 0.5).name('锁定范围 (m)');
  targeting.add(tg, 'maxAngleDeg', 10, 180, 5).name('前方扇区半角 (°)');
  targeting.add(tg, 'frontBias', 0, 4, 0.1).name('朝向加权');
  targeting.add(tg, 'idealRange', 0.6, 4, 0.05).name('理想攻击距离 (m)');
  targeting.add(tg, 'maxLungeScale', 1, 3, 0.1).name('前冲最大放大');

  const ht = cfg.hits;
  const hits = gui.addFolder('命中 / 受击 / 击退');
  hits.add(ht, 'arcDeg', 10, 120, 5).name('命中扇区半角 (°)');
  hits.add(ht, 'hurtLight', 0.05, 1, 0.01).name('轻受击时长 (s)');
  hits.add(ht, 'hurtHeavy', 0.05, 1, 0.01).name('重受击时长 (s)');
  hits.add(ht, 'hurtKnock', 0.05, 1, 0.01).name('击退受击时长 (s)');
  hits.add(ht.knockback, 'greatsword', 0, 2, 0.05).name('大剑击退 (m)');
  hits.add(ht.reach, 'greatsword', 0.5, 4, 0.1).name('大剑攻击距离 (m)');
  hits.add(ht, 'dummyReach', 0.5, 4, 0.1).name('假人命中距离 (m)');

  const sp = cfg.separation;
  const sep = gui.addFolder('角色间分离');
  sep.add(sp, 'iterations', 1, 8, 1).name('迭代次数');
  sep.add(sp, 'slop', 0, 0.05, 0.002).name('额外分离量 (m)');
  // v9p：主动挤人的阻力。minScale 拉到 1 = 关闭，回到「推着走畅通无阻」的旧行为
  sep.add(sp.crowd, 'contactBand', 0, 1.5, 0.05).name('挤压接触带 (m)');
  sep.add(sp.crowd, 'minScale', 0, 1, 0.02).name('正面顶住时速度保留');
  sep.add(sp.crowd, 'approachDot', 0, 0.9, 0.05).name('主动挤判定方向阈值');

  const ds = cfg.dash;
  const dash = gui.addFolder('冲刺 / 闪避');
  dash.add(ds, 'rollDistance', 0.5, 8, 0.1).name('翻滚距离 (m)');
  dash.add(ds, 'rollDuration', 0.1, 1.2, 0.02).name('翻滚时长 (s)');
  dash.add(ds, 'rollCooldown', 0.1, 3, 0.05).name('翻滚冷却 (s)');
  dash.add(ds, 'blinkDistance', 1, 12, 0.25).name('闪现距离 (m)');
  dash.add(ds, 'blinkStep', 0.05, 1, 0.02).name('闪现采样步长 (m)');
  dash.add(ds, 'blinkCooldown', 0.1, 4, 0.05).name('闪现冷却 (s)');
  dash.add(ds, 'blinkClearVelocity').name('闪现清空速度');
  dash.add(view.dash, 'fxDuration', 0.1, 1.5, 0.05).name('特效时长 (s)');
  dash.add(view.dash, 'ringRadius', 0.3, 1.5, 0.05).name('光环半径 (m)');

  const cc = cfg.camera;
  const camSmart = gui.addFolder('智能相机');
  camSmart.add(cc, 'radius', 2, 18, 0.5).name('威胁评估半径 (m)');
  camSmart.add(cc, 'nearDistance', 0.2, 6, 0.1).name('权重饱和距离 (m)');
  camSmart.add(cc, 'saturation', 0.5, 8, 0.1).name('威胁归一化饱和');
  camSmart.add(cc, 'pushIn', 0, 0.5, 0.01).name('无威胁推进比例');
  camSmart.add(cc, 'maxPullback', 0, 1, 0.02).name('最大拉远比例');
  camSmart.add(cc, 'maxOffset', 0, 6, 0.1).name('最大构图平移 (m)');
  camSmart.add(cc, 'maxPitchDelta', 0, 20, 0.5).name('最大俯角增量 (°)');
  camSmart.add(cc, 'framingBias', 0, 1, 0.05).name('威胁质心平移系数');
  camSmart.add(cc, 'attackBoost', 0, 2, 0.05).name('挥砍中额外加权');
  camSmart.add(cc.modeWeight, 'attack', 0, 3, 0.05).name('攻击模式威胁倍率');
  camSmart.add(view.smartCamera, 'smoothing', 0.2, 12, 0.2).name('构图平滑速率');

  const input = gui.addFolder('输入');
  input.add(view.joystick, 'maxRadiusPx', 24, 140, 2).name('摇杆满推行程 (px)');
  input.add(view.joystick, 'deadZone', 0, 0.3, 0.01).name('摇杆死区');

  const dm = cfg.dummies;
  const dummies = gui.addFolder('假人参数');
  dummies.add(dm, 'moveSpeed', 0.5, 8, 0.1).name('移动速度');
  dummies.add(dm, 'wanderRadius', 0.5, 8, 0.1).name('游走半径');
  dummies.add(dm, 'wanderInterval', 0.3, 8, 0.1).name('换目标间隔 (s)');
  dummies.add(dm, 'followStopDistance', 0.3, 5, 0.1).name('跟随停距');
  dummies.add(dm, 'keepDistance', 1, 10, 0.1).name('保持距离');
  dummies.add(dm, 'keepDeadZone', 0.1, 2, 0.05).name('保持死区');
  dummies.add(dm, 'attackRange', 0.5, 5, 0.1).name('攻击距离');
  dummies.add(dm, 'attackInterval', 0.3, 5, 0.1).name('攻击间隔 (s)');

  const cam = gui.addFolder('相机');
  cam.add(view.camera, 'pitchDeg', 20, 80, 1).name('俯角');
  cam.add(view.camera, 'yawDeg', -180, 180, 1).name('方位角');
  cam.add(view.camera, 'distance', 6, 35, 0.5).name('距离');
  cam.add(view.camera, 'smoothing', 0.5, 20, 0.5).name('跟随平滑');
  cam.add(view.camera, 'fov', 25, 90, 1).name('FOV');

  // v8e：双指捏合 / 滚轮缩放，热改即时生效；「缩放归 1」恢复基础镜头
  const zc = gui.addFolder('相机缩放 (v8e)');
  zc.add(view.zoom, 'min', 0.2, 1, 0.01).name('最小倍率 (拉近下限)');
  zc.add(view.zoom, 'max', 1, 4, 0.05).name('最大倍率 (拉远上限)');
  zc.add(view.zoom, 'smoothing', 1, 40, 1).name('缩放平滑速率');
  zc.add(view.zoom, 'pinchGain', 0, 3, 0.05).name('捏合灵敏度');
  zc.add(view.zoom, 'maxStepRatio', 1, 2, 0.05).name('单帧缩放限幅');
  zc.add(view.zoom, 'wheelStep', 1, 1.5, 0.01).name('滚轮步长');
  zc.add(view.zoom, 'keyStep', 1, 1.5, 0.01).name('按键步长');
  zc.add({ reset: actions.resetZoom }, 'reset').name('缩放归 1');

  // v8f：分层受击姿态，热改即时生效。
  // 「启用分层受击」关 = 回到旧版「脚底锚定、整体刚性倾斜」用于 A/B 对照；
  // 「强制部位」可在同一次受击里直接对比打腹(0) / 打肩(1) 的反应差异。
  const hurtF = gui.addFolder('受击分层 (v8f)');
  const hu = view.hurt;
  hurtF.add(hu, 'enabled').name('启用分层受击 (关=旧版对照)');
  hurtF.add(hu, 'forceHitHeight', -1, 1, 0.01).name('强制部位 -1自动 / 0腹 / 1肩');
  hurtF.add(hu, 'pulseRatio', 0.05, 0.6, 0.01).name('冲击→回弹分段');
  hurtF.add(hu, 'comShift', 0, 0.4, 0.005).name('整体重心偏离 (应 < 上身位移)');
  hurtF.add(hu, 'lowerScale', 0, 1, 0.01).name('下盘跟随骨盆比例');
  // v8g：上半身相对骨盆的位移限幅，专治「大剑重击时身体离开腿」
  hurtF.add(hu, 'upperShiftScale', 0, 1, 0.01).name('上身位移缩放');
  hurtF.add(hu, 'maxUpperShift', 0, 0.4, 0.005).name('上身位移上限 (m)');
  hurtF.add(hu.hitHeight, 'light', 0, 1, 0.01).name('轻击命中部位');
  hurtF.add(hu.hitHeight, 'heavy', 0, 1, 0.01).name('重击命中部位');
  hurtF.add(hu.hitHeight, 'knock', 0, 1, 0.01).name('击退命中部位');
  hurtF.add(hu, 'leanLight', 0, 1.5, 0.01).name('轻击力度');
  hurtF.add(hu, 'leanHeavy', 0, 1.5, 0.01).name('重击力度');
  hurtF.add(hu, 'leanKnock', 0, 1.5, 0.01).name('击退力度');
  hurtF.add(hu, 'flashStrength', 0, 2, 0.05).name('受击闪光强度');

  // 两套部位姿态逐项热调：打腹含胸蜷缩 / 屈膝多，打肩侧倾扭转 / 手臂被甩开
  const profFolders = [
    { name: '打腹 (abdomen)', p: hu.abdomen },
    { name: '打肩 (shoulder)', p: hu.shoulder },
  ].map(({ name, p }) => {
    const f = hurtF.addFolder(name);
    f.add(p, 'upperPitch', 0, 2, 0.01).name('上身前后倾斜');
    f.add(p, 'upperRoll', 0, 2, 0.01).name('上身侧倾');
    f.add(p, 'upperYaw', 0, 1.5, 0.01).name('肩部扭转');
    f.add(p, 'fold', -1, 1, 0.01).name('躯干前屈 (蜷缩)');
    f.add(p, 'shift', 0, 0.8, 0.01).name('身体反应位移');
    f.add(p, 'drop', 0, 0.4, 0.01).name('整体下沉');
    f.add(p, 'back', 0, 0.4, 0.01).name('屁股向后');
    f.add(p, 'knee', 0, 1.6, 0.01).name('屈膝');
    f.add(p, 'hip', 0, 1, 0.01).name('髋前倾');
    f.add(p, 'arm', -1, 1, 0.01).name('手臂 (正收拢 / 负甩开)');
    return f;
  });

  // v9a：派生招（Phase 1 剑盾冲锋盾击）—— 全部数值热调，enabled 可精确 A/B 对照
  const lkF = gui.addFolder('派生招 (v9a)');
  const lc = world.config.links;
  lkF.add(lc, 'enabled').name('总开关 (false=旧连击)');
  lkF.add(lc.windows, 'roll', 0, 1.2, 0.01).name('翻滚后窗口 (s)');
  lkF.add(lc.windows, 'blink', 0, 1.2, 0.01).name('闪现后窗口 (s)');
  lkF.add(lc.windows, 'sprint', 0, 1.2, 0.01).name('长跑后窗口 (s)');
  lkF.add(lc, 'sharedCooldown', 0, 3, 0.05).name('共享 CD (s)');
  lkF.add(lc, 'triggerWhileSprinting').name('长跑中可直接触发');
  lkF.add(lc.search, 'range', 1, 14, 0.1).name('索敌距离 (m)');
  lkF.add(lc.search, 'maxAngleDeg', 0, 180, 1).name('索敌扇区半角 (°)');
  lkF.add(lc.search, 'stopDistance', 0, 3, 0.05).name('停住距离 (m)');
  const sc = lc.moves['sword-shield'];
  if (sc) {
    lkF.add(sc, 'enabled').name('剑盾盾击');
    lkF.add(sc, 'distance', 0, 8, 0.1).name('冲锋极限 (m)');
    lkF.add(sc, 'windup', 0, 0.5, 0.01).name('前摇 (s)');
    lkF.add(sc, 'active', 0, 0.8, 0.01).name('冲锋 / 命中 (s)');
    lkF.add(sc, 'recovery', 0, 0.8, 0.01).name('收势 (s)');
    lkF.add(sc.hit, 'radius', 0, 4, 0.05).name('命中半径 (m)');
    lkF.add(sc.hit, 'width', 0, 2, 0.05).name('扫掠半径 (m)');
    lkF.add(sc.hit, 'knockback', 0, 2, 0.05).name('盾撞击退 (m)');
    lkF.add(sc.hit, 'duration', 0, 1.5, 0.01).name('僵直 (s)');
  }
  lkF.add(world.config.hits, 'noDamageToPlayer').name('测试限制: 玩家不被击退');

  const disp = gui.addFolder('显示');
  disp.add(state, 'showColliders').name('碰撞盒线框').onChange(actions.onToggleColliders);
  disp.add(state, 'showGrid').name('地面网格').onChange(actions.onToggleGrid);

  // 次要分组默认收起，避免展开后过高
  mv.close();
  pa.close();
  fight.close();
  orient.close();
  anim.close();
  leanF.close();
  ikF.close();
  targeting.close();
  hits.close();
  sep.close();
  dash.close();
  camSmart.close();
  input.close();
  mods.close();
  dummies.close();
  cam.close();
  zc.close();
  hurtF.close();
  v9qF.close();
  lkF.close();
  profFolders.forEach((f) => f.close());
  disp.close();

  // 整个调试面板默认收起：只留标题栏，点标题展开；彻底不占用右上角与操作区
  gui.close();

  return { gui, refreshWeapon: () => weaponCtrl.updateDisplay() };
}
