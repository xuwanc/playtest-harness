import GUI from 'lil-gui';
import { FIGHTER_MODES, WEAPON_ORDER } from '../core';
import type { DummyMode, ViewConfig, World } from '../core';

export type DebugState = {
  timeScale: number;
  paused: boolean;
  showColliders: boolean;
  showGrid: boolean;
  /** v9s.15：测试工位地面盘 / 浮动标牌 */
  showLab: boolean;
  showLabLabels: boolean;
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
  onToggleLab(v: boolean): void;
  onToggleLabLabels(v: boolean): void;
  /** v9s.38：把全部持械陪练切到同一个行为（调试混战强度时不用一个个点） */
  setFighterMode(mode: DummyMode): void;
};

/**
 * 所有可调参数直接绑定 world.config / view 对象，热改即时生效，无需重编译。
 *
 * 分组口径（v9s.38 重排）：按「你要调的是什么」分 7 个一级大类 —— 模拟 / 显示、
 * 移动 / 输入、动作 / 步态、战斗 / 命中、表现 / 特效、假人 / 混战、相机。
 * 每条控件都放在它真正影响的那一类里，跨类的重复项只留一份。
 *
 * 本轮清掉的废弃项：
 *  - 「旧斩击弧 开（已被刀光替代）」`projectiles.slashEnabled` —— v9s.22 起刀光（weapon-trail）
 *    才是主要打击反馈，这个开关只剩 A/B 考古价值，留着只会让人误以为它影响手感；
 *  - 标题里的版本号（v9s.18 / v9s.22 / v9s）—— 版本号写在 `package.json` / README 顶部，面板标题只写功能；
 *  - 「测试限制: 玩家不被击退」的**反向**命名 —— 玩家受击击退已默认打开（v9s.38），
 *    面板改成正向开关「玩家受击击退」，内部仍映射到 `hits.noDamageToPlayer`。
 *
 * 一级与子分组默认全收起：胶囊展开后只看到 7 行，点开才铺开参数。
 */
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

  const cfg = world.config;
  const subs: GUI[] = [];
  const tops: GUI[] = [];
  const top = (name: string): GUI => { const f = gui.addFolder(name); tops.push(f); return f; };
  const sub = (parent: GUI, name: string): GUI => { const f = parent.addFolder(name); subs.push(f); return f; };

  /* ---------------------------------------------------------------- *
   * 1) 模拟 / 显示：时间控制、线框网格、模块总闸
   * ---------------------------------------------------------------- */
  const sim = top('模拟 / 显示');
  sim.add(state, 'timeScale', 0, 3, 0.05).name('时间缩放');
  sim.add(state, 'paused').name('暂停');
  sim.add({ step: actions.singleStep }, 'step').name('单步 (1 tick)');
  sim.add({ reset: actions.reset }, 'reset').name('复位全部');
  sim.add(state, 'showColliders').name('碰撞盒线框').onChange(actions.onToggleColliders);
  sim.add(state, 'showGrid').name('地面网格').onChange(actions.onToggleGrid);
  sim.add(state, 'showLab').name('工位地面盘').onChange(actions.onToggleLab);
  sim.add(state, 'showLabLabels').name('工位标牌').onChange(actions.onToggleLabLabels);
  const mods = sub(sim, '模块开关');
  mods.add(world.modules, 'movement').name('movement');
  mods.add(world.modules, 'combat').name('combat');
  mods.add(world.modules, 'links').name('links');
  mods.add(world.modules, 'orientation').name('orientation');
  mods.add(world.modules, 'turnInPlace').name('turnInPlace');
  mods.add(world.modules, 'targeting').name('targeting');
  mods.add(world.modules, 'hits').name('hits');
  mods.add(world.modules, 'separation').name('separation');
  mods.add(world.modules, 'dash').name('dash');
  mods.add(world.modules, 'camera').name('camera');
  mods.add(world.modules, 'dummies').name('dummies');
  mods.add(world.modules, 'abilities').name('abilities');

  /* ---------------------------------------------------------------- *
   * 2) 移动 / 输入
   * ---------------------------------------------------------------- */
  const moveRoot = top('移动 / 输入');
  const mv = sub(moveRoot, '基础移动参数');
  mv.add(cfg, 'moveSpeed', 1, 10, 0.1).name('移动速度');
  mv.add(cfg, 'sprintMultiplier', 1, 3, 0.05).name('冲刺倍率');
  mv.add(cfg, 'acceleration', 1, 40, 0.5).name('加速度');
  mv.add(cfg, 'friction', 1, 40, 0.5).name('摩擦');
  mv.add(cfg, 'skillDecel', 2, 40, 0.5).name('进入技能时的减速速率');
  mv.add(cfg, 'gravity', 5, 60, 0.5).name('重力');
  mv.add(cfg, 'jumpSpeed', 2, 16, 0.2).name('起跳速度');
  mv.add(cfg, 'stepHeight', 0, 1.2, 0.01).name('自动爬台阶阈值');
  mv.add(cfg, 'characterRadius', 0.1, 0.8, 0.01).name('角色半径');
  mv.add(cfg, 'characterHeight', 0.6, 2.2, 0.05).name('角色身高');
  mv.add(cfg, 'strideLength', 0.3, 3, 0.05).name('基础步幅');
  mv.add(cfg, 'strideSpeedGain', 0, 1.5, 0.05).name('步幅随速度增益');
  mv.add(cfg, 'strideSpeedCap', 0.5, 4, 0.1).name('步幅增速上限');

  const input = sub(moveRoot, '摇杆 / 输入');
  input.add(view.joystick, 'maxRadiusPx', 24, 140, 2).name('摇杆满推行程 (px)');
  input.add(view.joystick, 'deadZone', 0, 0.3, 0.01).name('摇杆死区');

  const ds = cfg.dash;
  const dash = sub(moveRoot, '冲刺 / 闪避');
  dash.add(ds, 'rollDistance', 0.5, 8, 0.1).name('翻滚距离 (m)');
  dash.add(ds, 'rollDuration', 0.1, 1.2, 0.02).name('翻滚时长 (s)');
  dash.add(ds, 'rollCooldown', 0.1, 3, 0.05).name('翻滚冷却 (s)');
  dash.add(ds, 'blinkDistance', 1, 12, 0.25).name('闪现距离 (m)');
  dash.add(ds, 'blinkStep', 0.05, 1, 0.02).name('闪现采样步长 (m)');
  dash.add(ds, 'blinkCooldown', 0.1, 4, 0.05).name('闪现冷却 (s)');
  dash.add(ds, 'blinkClearVelocity').name('闪现清空速度');
  dash.add(view.dash, 'fxDuration', 0.1, 1.5, 0.05).name('特效时长 (s)');
  dash.add(view.dash, 'ringRadius', 0.3, 1.5, 0.05).name('光环半径 (m)');

  const sp = cfg.separation;
  const sep = sub(moveRoot, '角色间分离 / 挤压阻力');
  sep.add(sp, 'iterations', 1, 8, 1).name('迭代次数');
  sep.add(sp, 'slop', 0, 0.05, 0.002).name('额外分离量 (m)');
  // minScale 拉到 1 = 关闭，回到「推着走畅通无阻」的旧行为
  sep.add(sp.crowd, 'contactBand', 0, 1.5, 0.05).name('挤压接触带 (m)');
  sep.add(sp.crowd, 'minScale', 0, 1, 0.02).name('正面顶住时速度保留');
  sep.add(sp.crowd, 'approachDot', 0, 0.9, 0.05).name('主动挤判定方向阈值');

  /* ---------------------------------------------------------------- *
   * 3) 动作 / 步态：程序化步态、收相、惯性、IK、朝向、注视、转身
   * ---------------------------------------------------------------- */
  const gaitRoot = top('动作 / 步态');
  const gaitF = sub(gaitRoot, '程序化步态');
  // 脚前伸 = 步幅 × 该比例；0.25 = 支撑脚世界静止（零滑步）。调大 = 步子更大、会往后蹭。
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
  gaitF.add(view.gait, 'strafeHipBoost', 0, 2, 0.05).name('侧移下盘偏转增益');
  gaitF.add(view.gait, 'strafeHipScale', 0, 1, 0.05).name('假人下盘偏转基准');
  gaitF.add(view.gait, 'strafeHipMaxDeg', 0, 120, 1).name('假人下盘偏转上限 (°)');
  // 侧后方改走后退步：角度越大越晚并入（越大 = 保留更多侧移、滑步更少但腿更斜）
  gaitF.add(view.gait, 'backStrafeStartDeg', 20, 170, 1).name('侧后方起步角 (°)');
  gaitF.add(view.gait, 'backStrafeFullDeg', 40, 180, 1).name('完全后退角 (°)');
  gaitF.add(view.gait, 'knockGaitScale', 0, 1.5, 0.05).name('击退步态驱动 (0=旧)');

  // 停步收相 + 停步惯性放在同一组：调「停下来那一下」时两块要一起看
  const stopF = sub(gaitRoot, '停步 / 收相 / 惯性');
  stopF.add(view.gait, 'stopBlendSec', 0, 0.8, 0.02).name('停步收相时长 (s)');
  stopF.add(view.gait, 'stopEnterRatio', 0.01, 0.4, 0.01).name('进入收相速度比');
  stopF.add(view.gait, 'stopExitRatio', 0.05, 0.8, 0.01).name('退出收相速度比');
  stopF.add(view.gait, 'stopStepPitch', 0, 0.8, 0.02).name('前脚踩出 (rad)');
  stopF.add(view.gait, 'stopTrailPitch', 0, 0.5, 0.02).name('跟随腿后蹬 (rad)');
  stopF.add(view.gait, 'stopStepKnee', 0, 0.5, 0.02).name('前脚抬膝 (rad)');
  stopF.add(view.gait, 'stopBodyShift', 0, 0.25, 0.005).name('身体惯性前移 (m)');
  stopF.add(view.gait, 'stopChestPitch', 0, 0.4, 0.01).name('上身惯性前倾 (rad)');
  stopF.add(view.gait, 'stopBodyDip', 0, 0.2, 0.005).name('骨盆跟随下沉 (m)');
  stopF.add(view.gait, 'stopPeakRatio', 0.05, 0.95, 0.02).name('惯性峰值位置');
  stopF.add(view.gait, 'chestYawScale', 0, 1.5, 0.05).name('胸随下盘偏转比例');
  stopF.add(view.gait, 'chestYawMaxDeg', 0, 90, 1).name('胸偏转上限 (度)');

  const ikF = sub(gaitRoot, '足部 IK');
  const ik = view.ik;
  ikF.add(ik, 'enabled').name('启用 IK 足部锚定 (关=旧 FK)');
  ikF.add(ik, 'weight', 0, 1, 0.01).name('钉地权重');
  ikF.add(ik, 'attackScale', 0, 1, 0.01).name('攻击时权重倍率');
  ikF.add(ik, 'maxCorrectionDeg', 5, 120, 1).name('单帧最大修正 (°)');

  const leanF = sub(gaitRoot, '惯性倾斜 / 盆骨');
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

  // 朝向 / 注视 / 原地转身：三者都在改「身体和头看哪」，合成一组
  const or = cfg.orientation;
  const faceF = sub(gaitRoot, '朝向 / 接敌注视 / 原地转身');
  faceF.add(or, 'bodyTurnRate', 0.5, 30, 0.5).name('身体平滑速率');
  faceF.add(or, 'headTurnRate', 0.5, 40, 0.5).name('头部转向速率');
  faceF.add(or, 'maxHeadTurnDeg', 0, 90, 1).name('头部相对身体限幅');
  faceF.add(view.orientation, 'legYawScale', 0, 1, 0.01).name('下盘跟随移动强度');
  faceF.add(view.orientation, 'hipYawMaxDeg', 0, 120, 1).name('下盘带转上限 (°)');
  faceF.add(view.orientation, 'hipYawSmoothing', 1, 40, 1).name('下盘带转平滑速率');
  const gz = cfg.gaze;
  faceF.add(gz, 'headReturnRate', 0.5, 12, 0.1).name('无目标回正速率 (1/s)');
  faceF.add(gz, 'headReturnSpeedDeg', 20, 400, 10).name('回正角速度上限 (°/s)');
  faceF.add(gz, 'bodyTurnRate', 0.2, 12, 0.1).name('接敌身体转向速率');
  faceF.add(gz, 'headTurnRate', 0.5, 30, 0.5).name('接敌头部转向速率');
  faceF.add(gz, 'maxHeadSpeedDeg', 30, 900, 10).name('头部最大角速度 (°/s)');
  faceF.add(gz, 'maxBodySpeedDeg', 20, 600, 10).name('身体最大角速度 (°/s)');
  faceF.add(gz, 'aimHeightRatio', 0.2, 1, 0.05).name('注视点高度（身高比例）');
  faceF.add(gz, 'headPitchRate', 0.5, 20, 0.5).name('头部俯仰速率');
  faceF.add(gz, 'maxHeadPitchDeg', 0, 60, 1).name('头部俯仰限幅 (°)');
  faceF.add(gz, 'bodyPitchScale', 0, 1, 0.05).name('身体俯仰比例');
  faceF.add(gz, 'bodyPitchRate', 0.5, 20, 0.5).name('身体俯仰速率');
  const tip = cfg.turnInPlace;
  faceF.add(tip, 'enabled').name('启用原地转身 (关=纯插值)');
  faceF.add(tip, 'triggerDeg', 20, 180, 5).name('触发夹角 (°)');
  faceF.add(tip, 'gazeTriggerDeg', 20, 180, 5).name('接敌时触发夹角 (°)');
  faceF.add(tip, 'settleDeg', 0, 60, 1).name('转身保留余角 (°)');
  faceF.add(tip, 'durationSec', 0.1, 1.5, 0.02).name('转身时长 (s)');
  faceF.add(tip, 'idleSpeedRatio', 0, 0.3, 0.01).name('静止速度比上限');
  faceF.add(tip, 'inputDeadZone', 0, 0.5, 0.01).name('起步输入死区');
  faceF.add(tip, 'armSec', 0, 0.5, 0.01).name('触发防抖 (s)');
  // inStop = 偏差随收相同步消化；afterStop = 保持到收相结束再独立消化，可 A/B
  faceF.add(view.gait, 'stopYawBlendMode', ['inStop', 'afterStop']).name('停步偏差消化窗口');
  faceF.add(view.gait, 'stopYawAfterSec', 0.05, 1, 0.02).name('收相后消化时长 (s)');
  faceF.add(view.gait, 'turnStepEnabled').name('转身踏步 (关=滑过去)');
  faceF.add(view.gait, 'turnStepPitch', 0, 1.2, 0.02).name('踏步前迈 (rad)');
  faceF.add(view.gait, 'turnStepKnee', 0, 1, 0.02).name('踏步抬膝 (rad)');
  faceF.add(view.gait, 'turnStepDip', 0, 0.1, 0.002).name('踏步重心下沉 (m)');

  /* ---------------------------------------------------------------- *
   * 4) 战斗 / 命中：连击、卡肉、命中、受击、派生招、目标
   * ---------------------------------------------------------------- */
  const fightRoot = top('战斗 / 命中');
  const cb = cfg.combat;
  const fight = sub(fightRoot, '连击 / 武器时序');
  const weaponCtrl = fight.add(world.combat, 'weapon', WEAPON_ORDER).name('当前武器');
  fight.add(cb, 'comboWindow', 0.1, 2, 0.05).name('连击窗口 (s)');
  fight.add(cb, 'settle', 0, 0.8, 0.01).name('段间停顿 (s)');
  fight.add(cb, 'attackMoveScale', 0, 1, 0.01).name('攻击时移动比例');
  fight.add(cb, 'lungeMoveScale', 0, 0.4, 0.01).name('跨步时移动比例');
  fight.add(cb, 'lungeCurve', 0.2, 4, 0.1).name('跨步曲线指数 (大=更冲)');
  fight.add(cb, 'lungeMaxSpeed', 4, 30, 0.5).name('跨步速度上限 (m/s)');
  fight.add(cb, 'settleMoveScale', 0, 1, 0.01).name('段间停顿移动比例');
  fight.add(cb, 'cancelWindow', 0, 1, 0.01).name('取消窗口 (s)');
  fight.add(cb, 'minLungeScale', 0, 2, 0.05).name('有目标前冲最小比例');
  fight.add(cb, 'autoCombo').name('按住自动连击');
  fight.add(cb.weapons.greatsword, 'windup', 0.02, 0.6, 0.01).name('大剑前摇');
  fight.add(cb.weapons.greatsword, 'active', 0.02, 0.6, 0.01).name('大剑命中帧');
  fight.add(cb.weapons.greatsword, 'recovery', 0.05, 1, 0.01).name('大剑后摇');
  fight.add(cb.weapons.greatsword, 'moveMultiplier', 0.3, 1.5, 0.05).name('大剑移速倍率');
  fight.add(cb.bow, 'maxChargeTime', 0.2, 2, 0.05).name('满蓄力时间 (s)');
  fight.add(cb.bow, 'minChargeToFire', 0, 1, 0.02).name('最小可发射蓄力');
  fight.add(cb.bow, 'autoFire').name('蓄满自动放箭 (按住连射)');
  fight.add(cb.bow.trajectory, 'gravity', 0, 24, 0.5).name('箭矢重力 (m/s²)');
  fight.add(cb.bow.trajectory, 'speedMax', 8, 32, 0.5).name('满蓄初速 (m/s)');
  fight.add(cb.bow.trajectory, 'homingRange', 0, 30, 1).name('自动瞄准距离 (m)');
  fight.add(cb.bow.trajectory, 'turnRateDeg', 0, 240, 5).name('箭追踪转向 (°/s)');
  fight.add(cb.bow.trajectory, 'homingTime', 0, 2, 0.05).name('追踪时长 (s)');
  fight.add(cb.bow.trajectory, 'aimHeightRatio', 0, 1, 0.05).name('瞄准点高度');
  const ab = cfg.abilities;
  fight.add(ab.arcane, 'perWave', 1, 8, 1).name('每波飞弹数');
  fight.add(ab.arcane, 'waves', 1, 12, 1).name('每次引导波数');
  fight.add(ab.arcane, 'waveInterval', 0.05, 0.8, 0.01).name('波间隔 (s)');
  fight.add(ab.arcane, 'spreadDeg', 0, 20, 0.5).name('波内散布 (度)');
  fight.add(ab.arcane, 'spreadTime', 0, 0.6, 0.01).name('出膛散开时长 (s)');
  fight.add(ab.arcane, 'spawnDelay', 0, 0.2, 0.005).name('波内出膛错落 (s)');
  fight.add(ab.arcane, 'speedJitter', 0, 0.5, 0.02).name('速度浮动比例');
  fight.add(ab.arcane, 'turnRateDeg', 0, 420, 10).name('制导转向 (度/秒)');
  fight.add(ab.arcane, 'retargetInterval', 0.05, 1, 0.05).name('重新索敌间隔 (s)');
  fight.add(ab.arcane, 'cooldown', 0, 3, 0.05).name('引导结束冷却 (s)');
  fight.add(ab.arcane, 'speed', 3, 24, 0.5).name('飞弹速度');
  fight.add(ab.arcane, 'moveScale', 0.2, 1, 0.02).name('引导时移速倍率');
  fight.add(ab.ring, 'radius', 0.5, 5, 0.1).name('电环半径');
  fight.add(ab.ring, 'stun', 0.1, 1.5, 0.05).name('电环僵直 (s)');
  fight.add(ab.ring, 'pulseInterval', 0.1, 1, 0.02).name('电环脉冲间隔');

  // v9s.37：卡肉的节奏参数——真机 A/B 时最该动的就是这几个
  const warp = cfg.hits.hitstopWarp;
  if (warp) {
    const wf = sub(fightRoot, '卡肉节奏（接触瓦片）');
    wf.add(warp, 'enabled').name('瓦片开（关=硬冻结）');
    wf.add(warp, 'holdRate', 0, 0.4, 0.01).name('保持期速率');
    wf.add(warp, 'release', 0.005, 0.2, 0.005).name('释放时长 (s)');
    wf.add(warp, 'payback', 1, 2.5, 0.05).name('偿还倍率');
    wf.add(cfg.hits.hitstop, 'light', 0, 0.2, 0.005).name('轻击保持 (s)');
    wf.add(cfg.hits.hitstop, 'heavy', 0, 0.25, 0.005).name('重击保持 (s)');
    wf.add(cfg.hits.hitstop, 'knock', 0, 0.3, 0.005).name('击飞保持 (s)');
  }

  const ht = cfg.hits;
  const hits = sub(fightRoot, '命中 / 受击 / 击退');
  hits.add(ht, 'arcDeg', 10, 120, 5).name('命中扇区半角 (°)');
  hits.add(ht, 'hurtLight', 0.05, 1, 0.01).name('轻受击时长 (s)');
  hits.add(ht, 'hurtHeavy', 0.05, 1, 0.01).name('重受击时长 (s)');
  hits.add(ht, 'hurtKnock', 0.05, 1, 0.01).name('击退受击时长 (s)');
  hits.add(ht.knockback, 'greatsword', 0, 2, 0.05).name('大剑击退 (m)');
  hits.add(ht.reach, 'greatsword', 0.5, 4, 0.1).name('大剑攻击距离 (m)');
  hits.add(ht, 'dummyReach', 0.5, 4, 0.1).name('假人命中距离 (m)');
  hits.add(ht, 'knockbackDecay', 0, 10, 0.1).name('击退衰减 (初速系数)');
  // v9s.38：击退已默认打开；面板给的是正向语义（勾上 = 玩家会被击退），
  // 内部仍映射 `noDamageToPlayer` 的反向字段。
  const playerKnock = {
    get enabled(): boolean { return !ht.noDamageToPlayer; },
    set enabled(v: boolean) { ht.noDamageToPlayer = !v; },
  };
  hits.add(playerKnock, 'enabled').name('玩家受击击退');

  // 「启用分层受击」关 = 回到旧版整体刚性倾斜用于 A/B 对照；
  // 「强制部位」可在同一次受击里直接对比打腹(0) / 打肩(1) 的反应差异。
  const hurtF = sub(fightRoot, '受击分层');
  const hu = view.hurt;
  hurtF.add(hu, 'enabled').name('启用分层受击 (关=旧版对照)');
  hurtF.add(hu, 'forceHitHeight', -1, 1, 0.01).name('强制部位 -1自动 / 0腹 / 1肩');
  hurtF.add(hu, 'pulseRatio', 0.05, 0.6, 0.01).name('冲击→回弹分段');
  hurtF.add(hu, 'comShift', 0, 0.4, 0.005).name('整体重心偏离 (应 < 上身位移)');
  hurtF.add(hu, 'lowerScale', 0, 1, 0.01).name('下盘跟随骨盆比例');
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
  for (const { name, p } of [
    { name: '打腹 (abdomen)', p: hu.abdomen },
    { name: '打肩 (shoulder)', p: hu.shoulder },
  ]) {
    const f = sub(hurtF, name);
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
  }

  // 派生招（剑盾冲锋盾击）—— 全部数值热调，enabled 可精确 A/B 对照
  const lkF = sub(fightRoot, '派生招');
  const lc = cfg.links;
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

  const tg = cfg.targeting;
  const targeting = sub(fightRoot, '目标辅助');
  targeting.add(tg, 'targetAssist').name('启用目标辅助');
  targeting.add(tg, 'range', 1, 14, 0.5).name('锁定范围 (m)');
  targeting.add(tg, 'maxAngleDeg', 10, 180, 5).name('前方扇区半角 (°)');
  targeting.add(tg, 'frontBias', 0, 4, 0.1).name('朝向加权');
  targeting.add(tg, 'idealRange', 0.6, 4, 0.05).name('理想攻击距离 (m)');
  targeting.add(tg, 'maxLungeScale', 1, 3, 0.1).name('前冲最大放大');

  /* ---------------------------------------------------------------- *
   * 5) 表现 / 特效：挥击幅度、夸张化、刀光、腕部、握持
   * ---------------------------------------------------------------- */
  const lookRoot = top('表现 / 特效');
  const exagg = sub(lookRoot, '挥击幅度 / 刀光');
  const sw = view.animation.swing!;
  exagg.add(sw, 'enabled').name('挥击身体幅度 开');
  exagg.add(sw, 'bodyScale', 0, 1.6, 0.05).name('躯干 / 骨盆幅度倍率');
  exagg.add(sw, 'shoulderLift', 0, 0.12, 0.005).name('肩部抬升上限 (m)');
  exagg.add(sw, 'shoulderPush', 0, 0.1, 0.005).name('肩部前送上限 (m)');
  exagg.add(sw, 'shoulderIn', 0, 0.1, 0.005).name('双手武器肩内收 (m)');
  exagg.add(sw, 'segBlend', 0, 0.35, 0.01).name('段间过渡兜底 (s)');
  // v9s.31：段间混合按姿态差自动算，这两个决定「最快 / 多差算一次大换段」
  exagg.add(sw, 'segBlendMin', 0.008, 0.12, 0.004).name('段间过渡下限 (s)');
  exagg.add(sw, 'segBlendRef', 2, 16, 0.5).name('段间过渡参考距离 (rad)');
  exagg.add(sw.weaponScale, 'greatsword', 0, 1.6, 0.05).name('大剑幅度倍率');
  const tr = view.weaponTrail;
  exagg.add(tr, 'enabled').name('挥击刀光 开');
  exagg.add(tr, 'life', 0.04, 0.4, 0.01).name('刀光残留 (s)');
  exagg.add(tr, 'intensity', 0, 1.5, 0.05).name('刀光亮度');
  exagg.add(tr, 'minStep', 0.005, 0.1, 0.005).name('采样最小位移 (m)');
  exagg.add(view.hitstop, 'enabled').name('命中卡肉 / 震屏');

  const body = sub(lookRoot, '夸张化 / 四肢伸缩');
  const sq = view.animation.stretch;
  body.add(sq, 'enabled').name('四肢伸缩 开');
  body.add(sq, 'swingArm', 1, 1.8, 0.01).name('挥出时手臂拉伸');
  body.add(sq, 'chargeArm', 0.7, 1, 0.01).name('蓄力时手臂压缩');
  body.add(sq, 'impactSquash', 0, 0.5, 0.01).name('命中挤压量');
  body.add(sq, 'impactDecay', 2, 30, 0.5).name('挤压回弹速率 (1/s)');
  body.add(sq, 'torsoGain', 0, 1, 0.05).name('躯干跟随比例');
  body.add(sq, 'volumeExp', 0, 1.5, 0.05).name('体积补偿指数');

  // v9s.24：武器相对手的自由度 + 副手握持
  const grip = sub(lookRoot, '武器握持 / 腕部');
  const ww = view.weaponWrist;
  grip.add(ww, 'enabled').name('腕部滞后 开（关掉=武器焊在手上）');
  grip.add(ww, 'lag', 0, 0.08, 0.002).name('臂速 → 腕滞后');
  grip.add(ww, 'maxAngle', 0, 1.2, 0.02).name('腕滞后上限 (rad)');
  grip.add(ww, 'rate', 4, 50, 1).name('腕部跟随速率 (1/s)');
  grip.add(ww, 'twistLag', 0, 0.06, 0.002).name('躯干扭转 → 剑横甩');
  grip.add(ww, 'maxTwist', 0, 0.9, 0.02).name('横甩上限 (rad)');
  const wm = view.weaponMount;
  grip.add(wm, 'twoHandInsetX', 0, 0.3, 0.01).name('双手武器内收 (m)');
  grip.add(wm, 'twoHandGripY', -0.5, 0, 0.01).name('副握点在柄上的位置');
  grip.add(wm, 'twoHandMaxStretch', 1, 1.8, 0.01).name('副手臂长拉伸上限');
  grip.add(wm, 'twoHandMinGrip', 0, 1, 0.02).name('最低握持权重（1=永不松手）');
  grip.add(wm, 'twoHandGripStart', 1, 1.4, 0.01).name('开始松手的臂展比');
  grip.add(wm, 'twoHandSlideRate', 0, 30, 1).name('握点滑柄跟随速率 (1/s)');
  grip.add(wm, 'swordPitchDeg', 0, 90, 1).name('剑前倾角');
  grip.add(wm, 'swordYawDeg', 0, 45, 1).name('剑外张角');
  grip.add(wm, 'greatswordPitchDeg', 0, 90, 1).name('大剑前倾角');
  grip.add(wm, 'staffPitchDeg', 0, 60, 1).name('法杖前倾角');

  /* ---------------------------------------------------------------- *
   * 6) 假人 / 混战：普通假人 AI、持械陪练、攻击节奏
   * ---------------------------------------------------------------- */
  const crowdRoot = top('假人 / 混战');
  const dm = cfg.dummies;
  const dummies = sub(crowdRoot, '普通假人 AI');
  dummies.add(dm, 'moveSpeed', 0.5, 8, 0.1).name('移动速度');
  dummies.add(dm, 'wanderRadius', 0.5, 8, 0.1).name('游走半径');
  dummies.add(dm, 'wanderInterval', 0.3, 8, 0.1).name('换目标间隔 (s)');
  dummies.add(dm, 'followStopDistance', 0.3, 5, 0.1).name('跟随停距');
  dummies.add(dm, 'keepDistance', 1, 10, 0.1).name('保持距离');
  dummies.add(dm, 'keepDeadZone', 0.1, 2, 0.05).name('保持死区');
  dummies.add(dm, 'attackRange', 0.5, 5, 0.1).name('攻击距离');
  dummies.add(dm, 'attackInterval', 0.3, 5, 0.1).name('攻击间隔 (s)');
  // 0 = 旧行为（会追着玩家跑遍全场）；>0 = 离 home 超过该半径就逐渐走回工位
  dummies.add(dm, 'leashRadius', 0, 8, 0.1).name('牵引半径 (0=不限)');

  const fg = dm.fighters;
  if (fg) {
    const fr = sub(crowdRoot, '持械陪练（剑盾 / 双刀 / 大剑）');
    fr.add(fg, 'moveSpeed', 0.5, 6, 0.1).name('移动速度');
    fr.add(fg, 'attackInterval', 0.5, 8, 0.1).name('攻击间隔 (s)');
    fr.add(fg, 'attackRangeScale', 0.5, 1.2, 0.02).name('起手距离 / 武器 reach');
    fr.add(fg, 'knockbackScale', 0, 2, 0.05).name('击退比例');
    fr.add(fg, 'leashRadius', 0, 14, 0.5).name('牵引半径 (m)');
    // 混战调试：下拉一次把三个陪练切到同一个行为，不必逐个点。
    // 读的是「第一个陪练当前的行为」，所以点单个陪练之后这里也会跟着变。
    const firstFighter = () => world.dummies.find((d) => d.weapon !== null);
    const modeProxy = {
      get mode(): DummyMode { return firstFighter()?.mode ?? 'spar'; },
      set mode(v: DummyMode) { actions.setFighterMode(v); },
    };
    fr.add(modeProxy, 'mode', FIGHTER_MODES).name('陪练行为（全部）');
  }

  /* ---------------------------------------------------------------- *
   * 7) 相机
   * ---------------------------------------------------------------- */
  const camRoot = top('相机');
  const cam = sub(camRoot, '基础');
  cam.add(view.camera, 'pitchDeg', 20, 80, 1).name('俯角');
  cam.add(view.camera, 'yawDeg', -180, 180, 1).name('方位角');
  cam.add(view.camera, 'distance', 6, 35, 0.5).name('距离');
  cam.add(view.camera, 'smoothing', 0.5, 20, 0.5).name('跟随平滑');
  cam.add(view.camera, 'fov', 25, 90, 1).name('FOV');
  const cc = cfg.camera;
  const camSmart = sub(camRoot, '智能构图');
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
  camSmart.add(cc.modeWeight, 'spar', 0, 3, 0.05).name('陪练模式威胁倍率');
  camSmart.add(view.smartCamera, 'smoothing', 0.2, 12, 0.2).name('构图平滑速率');
  const zc = sub(camRoot, '缩放');
  zc.add(view.zoom, 'min', 0.2, 1, 0.01).name('最小倍率 (拉近下限)');
  zc.add(view.zoom, 'max', 1, 4, 0.05).name('最大拉远上限');
  zc.add(view.zoom, 'smoothing', 1, 40, 1).name('缩放平滑速率');
  zc.add(view.zoom, 'pinchGain', 0, 3, 0.05).name('捏合灵敏度');
  zc.add(view.zoom, 'maxStepRatio', 1, 2, 0.05).name('单帧缩放限幅');
  zc.add(view.zoom, 'wheelStep', 1, 1.5, 0.01).name('滚轮步长');
  zc.add(view.zoom, 'keyStep', 1, 1.5, 0.01).name('按键步长');
  zc.add({ reset: actions.resetZoom }, 'reset').name('缩放归 1');

  // 一级大类与子分组全部默认收起：胶囊展开后只看到 7 行，点开才铺开参数
  subs.forEach((f) => f.close());
  tops.forEach((f) => f.close());
  gui.close();

  return { gui, refreshWeapon: () => weaponCtrl.updateDisplay() };
}
