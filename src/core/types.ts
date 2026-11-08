/**
 * Core 公共数据契约 —— 纯类型定义，零运行时依赖。
 *
 * 可移植纪律（同时面向 Web 复用与 Unity / Godot 对照重写）：
 *  1. 只允许 number / string / boolean / 数组 / plain object，不用 class、enum、Symbol、Proxy、装饰器。
 *  2. World 必须可 JSON 序列化，不得存放函数、类实例、闭包或渲染对象。
 *  3. 所有状态集中在 World，状态转移是确定性的 step(world, dt, intents)。
 *  4. 不出现 window / document / Math.random / Date.now / performance。
 */

import type { PoseClip } from './pose-clip';
import type { NotifyDef } from './notify';

export type Vec3 = { x: number; y: number; z: number };
export type Vec2XZ = { x: number; z: number };

export type BoxKind = 'ground' | 'step' | 'wall' | 'lintel' | 'obstacle';

/** 轴对齐碰撞白盒。min/max 为世界坐标，闭区间。 */
export type Box = {
  id: string;
  kind: BoxKind;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

export type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };

export type StepSpec = {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
};

export type DoorwaySpec = {
  id: string;
  x: number;
  z: number;
  openingWidth: number;
  openingHeight: number;
  wallThickness: number;
  wallSpan: number;
  wallHeight: number;
};

export type ObstacleSpec = {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
};

/** 供后续寻路模块消费的网格元数据（本期只生成，不实现寻路）。 */
export type GridMeta = {
  cellSize: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

/**
 * v9s.15 · 测试工位（纯场景元数据，不参与碰撞）。
 *
 * 一块场地 = 一个可复现的测试工位：地面盘 + 浮动工位牌 + 一键传送落点。
 * 只在 `scene.stations` 里描述，由表现层绘制标识、由组装层执行传送；
 * Core 的碰撞白盒仍只由 steps / doorways / obstacles 生成 —— 工位是「怎么看」，
 * 不是「怎么撞」，两者分开后改布局不会牵动物理。
 */
export type StationShape = 'circle' | 'square';

export type StationSpec = {
  id: string;
  /** 面板序号（1 起）与 [ / ] 循环顺序 */
  index: number;
  name: string;
  /** 一句话说明「来这里测什么」，显示在地面标牌上 */
  hint: string;
  shape: StationShape;
  /** 工位中心（地面盘 / 标牌定位） */
  x: number;
  z: number;
  /** 识别半径：玩家进入即视为站在该工位 */
  radius: number;
  /** 传送落点（一般放在工位南侧，落地面向工位） */
  spawnX: number;
  spawnZ: number;
  /** 浮动工位牌的锚点（默认放在工位北侧，不挡视线） */
  labelX: number;
  labelZ: number;
  /** 地面盘主色 */
  color: string;
};

export type SceneConfig = {
  ground: { size: number; thickness: number };
  steps: StepSpec[];
  doorways: DoorwaySpec[];
  obstacles: ObstacleSpec[];
  grid: GridMeta;
  /** v9s.15：测试工位（表现层标识 + 传送），Core 不消费 */
  stations?: StationSpec[];
};

/* ---------------- 武器 / 战斗契约 ---------------- */

export type WeaponId = 'sword-shield' | 'dual-swords' | 'greatsword' | 'staff' | 'bow';

/** 槽位 1..5 与 WeaponId 的固定映射，输入层与 UI 共用，避免各写一份。 */
export const WEAPON_ORDER: WeaponId[] = [
  'sword-shield',
  'dual-swords',
  'greatsword',
  'staff',
  'bow',
];

export type WeaponProfile = {
  moveMultiplier: number;
  windup: number;
  active: number;
  recovery: number;
  /** 三连击各段的前向位移（米），active 阶段线性推进 */
  lunge: [number, number, number];
  /** 剑类为 3，法杖 / 弓为 0 */
  comboCount: number;
  /**
   * v9s.31 · 关键帧事件（见 `core/notify.ts`）。
   *
   * Core 按攻击时间轴逐帧扫描并写入 `world.events`（type='notify'，带 name），
   * 表现层据此触发刀光 / 音效 / 镜头震动；判定窗口也可由它表达，
   * 但常规近战请优先用下面的 `hitWindow`（更省事、自带去重）。
   */
  notifies?: NotifyDef[];
  /**
   * v9s.31 · 命中窗口：active 段内的归一化区间（0..1）。
   *
   * 旧版只在 active 的第一帧扫一次扇形 —— 挥到一半才走进刀风的敌人吃不到伤害。
   * 现在整个窗口内每帧都扫，且**每个目标每次攻击只结算一次**（`CombatState.hitIds`），
   * 所以既不会重复掉血，又能命中中途进入的目标。缺省 `{ start: 0, end: 1 }`。
   */
  hitWindow?: { start: number; end: number };
  /**
   * v9s.36 · 刃身扫掠门（命中时机对齐「刀真的到人」）。
   *
   * 旧版判定从 active 第 0 帧就开始：那时 `swingCurve` 还是 -1（刃身在身后蓄势），
   * 但扇形 + reach 已经满足 → 命中并触发卡肉，画面定格在**刀还没挥出去**的姿态。
   * 这里给「每段连击的刃尖相对角随 u 的变化」，Core 只在这一帧的扫掠区间
   * 覆盖目标方位角时才结算命中（区间两端各放宽 `tolDeg`）。
   *
   * 数据来源：`tools/clip-lab` 逐进度采样 `bladeWorld()` 的刃尖相对角（真实剪辑曲线，
   * 不是另算一套）。缺省不配 = 旧行为（A/B 与回滚用）。
   */
  hitSweep?: {
    /** 角度容差（度），扫掠区间两端各放宽；缺省 10 */
    tolDeg?: number;
    /** 按连击段（'1'..'3'）；缺该段 = 该段不设门（旧行为） */
    byCombo?: Record<string, HitSweepSegment>;
  };
  /**
   * v9s.31 · 本武器连击窗口覆写（秒）。缺省用 `combat.comboWindow`。
   *
   * 双剑的段间空隙应该比大剑短得多：同一个 0.45s 窗口下，双剑按早了接不上、
   * 按晚了要等，节奏发黏。分武器配才是手感。
   */
  comboWindow?: number;
  /**
   * v9s.37 · 击地范围攻击（大剑第三击：砸地后向四周掀起冲击）。
   *
   * 刀身扫掠是「正面一条线」，砸地是「圆心一圈」：`u` 跨过 `slamU` 时以落点为圆心
   * 结算一次圆形命中，把原本吃不到刀风的侧面 / 近距离目标也震到。
   * 与刀身共用 `hitIds`（`onlyUnhit` 默认 true）—— 不重复掉血，只扩大覆盖。
   */
  groundSlam?: GroundSlamProfile;
};

export type GroundSlamProfile = {
  /** active 内进度 u：刃身落地时刻（由 clip-lab 采样确定，别手写） */
  slamU: number;
  /** 冲击半径（米，不含假人半径） */
  radius: number;
  /** 击退距离（米）；缺省用 `hits.knockback[weapon]` */
  knockback?: number;
  /** 受击类型；缺省按武器默认（大剑 = knock） */
  type?: HurtType;
  /** 只打「刀身这一击还没命中」的目标（默认 true）：扩大覆盖，不叠伤害 */
  onlyUnhit?: boolean;
  /** 本次击地的卡肉倍数（乘在触发它的那次命中的 stop 上）；缺省 1.6 */
  holdMul?: number;
};

export type HitSweepSegment = {
  /** 关键点 `[u, angDeg]`，u 为 active 内进度（0..1），angDeg 为刃尖相对身体朝向的水平角 */
  pts?: Array<[number, number]>;
  /** 突刺 / 下劈这类刃尖角几乎不变的段：`u >= stabU` 即视为「刃身已到位」 */
  stabU?: number;
};

export type CastProfile = {
  windup: number;
  active: number;
  recovery: number;
  lunge: number;
};

export type CombatConfig = {
  /** 攻击结束后仍可接下一段的窗口（秒） */
  comboWindow: number;
  /** 每段攻击动作结束后的收势停顿（秒）：位移结束 → 停顿 → 才能接下一段，形成三连击节奏 */
  settle: number;
  /** 攻击期间（windup/active/recovery）保留的自主移动速度比例（0 = 完全锁定，位移只由 lunge 决定；1 = 正常速度） */
  attackMoveScale: number;
  /**
   * v9s.21：跨步（active）期间再压一层的移动比例。
   * 攻击可以边走边打（attackMoveScale），但真正把身体推出去的那 0.1s 里，
   * 自主移动要让位给跨步层 —— 否则「跑动速度 + 跨步速度」会在总速度上叠加，
   * 到目标位置那一下特别冲。默认 0.08，只留一点方向修正的余量。
   */
  lungeMoveScale: number;
  /**
   * v9s.21：跨步速度包络的指数。位移 D = V0·T/(curve+1)，反解 V0。
   * 1 = 二次位移曲线（速度线性收到 0）；越大越「起手猛、收得急」。
   */
  lungeCurve: number;
  /**
   * v9s.21：跨步层速度硬上限（米/秒），只作为「参数调崩」的保险阀。
   * 正常情况下包络峰值不超过它（剑盾三连第 3 段峰值约 14.6），
   * 真正的「不叠加」靠 lungeMoveScale 让移动层让位 + 末段收到 0。
   */
  lungeMaxSpeed: number;
  /** 收势停顿（settle）期间保留的自主移动速度比例：让「攻击后停顿」不再完全锁死，保留一点惯性余速 */
  settleMoveScale: number;
  /** 攻击尚未彻底结束时（recovery 阶段）可提前取消、接下一段的进度比例（0.45 = recovery 过 45% 即可衔接），让连击节奏更连贯 */
  cancelWindow: number;
  /** 有目标做动态前冲时，最小前冲比例（相对武器基础 lunge）：即使贴脸也保留一点跨步，不会完全修没 */
  minLungeScale: number;
  /** 按住攻击键时，剑类在每段停顿结束后自动接续下一段（无限循环连击） */
  autoCombo: boolean;
  weapons: Record<WeaponId, WeaponProfile>;
  /** 法杖的两个技能已抽离到独立 abilities 模块（引导飞弹 / 电环），不再复用近战状态机（v7c #12） */
  bow: {
    maxChargeTime: number;
    minChargeToFire: number;
    chargeMoveMultiplier: number;
    /**
     * v9s.19：按住不放时蓄满自动放箭，放完立刻重新蓄力（取消「每箭之间的冷却」）。
     * 手放松手仍可随时提前放出（蓄力 ≥ minChargeToFire 时）。
     */
    autoFire: boolean;
    release: CastProfile;
    /**
     * v9s.17：弹道参数。箭由 Core 自己积分（不依赖表现层计时），
     * 因此暂停 / 时间缩放 / 快照回放下的落点完全一致。
     */
    trajectory: BowTrajectoryConfig;
  };
};

/** 弓箭弹道：蓄力只影响初速，仰角固定；重力让「远射要抬一点」这件事真的存在。 */
export type BowTrajectoryConfig = {
  /** 最小 / 满蓄初速（米/秒） */
  speedMin: number;
  speedMax: number;
  /** 出弓仰角（度）：轻微上抬，让弹道是一条看得出的弧线 */
  launchPitchDeg: number;
  /** 重力（米/秒²）：比现实 9.8 略小，保证 9m 内落点可控 */
  gravity: number;
  /** 飞行寿命（秒），超时移除（防止飞出场地后长期存在） */
  maxLife: number;
  /** 命中半径（米），与假人半径叠加 */
  radius: number;
  /** 插住后的驻留时长（秒） */
  stickSec: number;
  /**
   * 插地时的最小仰角（度）。
   * 平射落地时入射角很小，箭会「躺」在地上、读不出是插进去的；
   * 给一个下限（默认 42°）让箭尾明显翘起，视觉上才成立。
   */
  stickMinPitchDeg: number;
  /**
   * 插地时箭中点离地高度（米）。
   * 箭的长度是表现层参数（0.72m），Core 只存中点；若直接把中点贴到 y=0，
   * 斜插时箭头会埋进地面 0.3m、只露出半截。这里抬一个箭半长的经验值，
   * 让箭头刚好入土、箭杆完整露出来。
   */
  groundStickLift: number;
  /**
   * v9s.19 · 轻度自动追踪（箭的「一点点」自动瞄准）。
   *
   * 只做两件小事，不改变「要瞄」的核心手感：
   *  1. 出弓时按目标距离解一次抛物线竖直初速（把「抬弓补偿」自动化）；
   *  2. 飞行前 homingTime 秒内按 turnRateDeg 限速转向目标，歪一点也能擦到。
   * 目标是「蓄力快、节奏顺」的前提 —— 否则按住连发只是更快地打空。
   */
  /** 索敌距离（米）：0 = 关闭自动瞄准，退回纯固定仰角弹道 */
  homingRange: number;
  /** 出弓时允许偏航多少度内仍然吸附（度） */
  homingConeDeg: number;
  /** 飞行中的最大水平转向角速度（度/秒）：小一点才像「修正」而不是「导弹」 */
  turnRateDeg: number;
  /** 允许修正的时长（秒）；之后锁定弹道 */
  homingTime: number;
  /** 瞄准点高度（占假人身高的比例）：0.7 落在胸口，箭才会扎在身上而不是脚下 */
  aimHeightRatio: number;
  /** 竖直方向的修正加速度上限（米/秒²）：只拉回下坠，不做垂直追踪 */
  verticalTurnRate: number;
};

/** idle → windup → active → recovery → settle → idle；settle 是「每段前移后的停顿」。 */
export type AttackPhase = 'idle' | 'windup' | 'active' | 'recovery' | 'settle';

/** 本次攻击的时长缓存，开始时算一次，表现层与状态机直接读取。 */
export type AttackTimings = {
  windup: number;
  active: number;
  recovery: number;
  /** 收势停顿时长；此阶段零位移、零 impulse，attackProgress 固定为 1 */
  settle: number;
  lunge: number;
};

export type CombatState = {
  weapon: WeaponId;
  phase: AttackPhase;
  /** 0 = 未在连击中；1..3 = 当前连击段 */
  comboIndex: number;
  phaseTimer: number;
  comboWindow: number;
  queued: boolean;
  charging: boolean;
  /** 0..1 */
  charge: number;
  /** 0..1，当前攻击整体进度（不含 settle），表现层用于插值动画 */
  attackProgress: number;
  /** 攻击开始时锁定的朝向，挥击过程中不受转向影响 */
  attackFacing: number;
  /** 每次起手递增，表现层据此触发一次性特效（箭矢等） */
  attackId: number;
  /** 最近一次弓箭释放的蓄力值 0..1，供表现层决定箭速 */
  lastCharge: number;
  /**
   * v9s.29 · 命中卡肉（hitstop）剩余时间（秒），0 = 正常。
   *
   * 命中瞬间把**攻击方的时间轴**按住一会儿：phaseTimer 不推进、前冲 impulse 归零，
   * 于是挥到接触点的那一帧被「钉住」，打感从「划过去」变成「砍进去」。
   *
   * 放在 Core 而不是表现层：表现层冻结只能停画面，Core 的位移 / 计时还在走，
   * 冻结结束会补一帧滑动；而进 Core 后位置、进度、连击窗口全部一起停，
   * 且完全确定性（同输入同帧数 → 同结果），可被单测覆盖。
   */
  hitstop: number;
  /**
   * v9s.31 · 关键帧事件游标（阶段连续标量 0..3，-1 = 本段尚未开始）。
   *
   * 每帧扫描 `(notifyCursor, 当前标量]` 后前移，保证掉帧 / 跨阶段 / 卡肉冻结下
   * 事件不漏发也不重发。放在 Core 是为了确定性：同输入同帧数 → 同事件序列。
   */
  notifyCursor: number;
  /**
   * v9s.31 · 本次攻击已结算过的目标 id（配合 `WeaponProfile.hitWindow`）。
   *
   * 命中窗口内每帧都会扫扇形，没有这张表就会一帧掉一次血。每次起手清空，
   * 因此「同一段攻击对同一目标只结算一次」，多段伤害需要显式写多段判定。
   */
  hitIds: number[];
  timings: AttackTimings;
  /**
   * v9s.37 · 动画时间轴速率（1 = 正常，→0 = 近乎冻结）。
   *
   * 卡肉从「硬冻结」升级成「接触瓦片」：命中瞬间把 `phaseTimer` 的推进速度压到
   * `hitstopWarp.holdRate`（5%），释放段再缓回 1，偿还段以 >1 补回欠下的时间。
   * 读这个值的只有表现层（诊断 / 拖尾 / 特效），逻辑仍走 `phaseTimer`。
   */
  warp: number;
  /** v9s.37 · 偿还期剩余「欠下的动画时间」（秒）；归零即退出偿还 */
  warpDebt: number;
  /** v9s.37 · 卡肉瓦片阶段：0 = 无，1 = 保持，2 = 释放，3 = 偿还 */
  warpPhase: number;
  /** v9s.37 · 释放 / 偿还子计时（秒） */
  warpTimer: number;
  /** v9s.37 · 已触发过击地冲击的攻击 id（0 = 尚未触发） */
  slamAttackId: number;
};

/* ---------------- 派生招 / 动作链接契约（v9a Phase 1） ---------------- */

/**
 * 「冲刺 / 翻滚 / 闪现 / 长跑后接攻击」与「空中起手、落地命中」共用的一套数据驱动招式表。
 * 设计约束：
 *  - 假人与主角同构：命中统一走 hits.applyHit(HitTarget)，"不能击退 / 不伤害"只是
 *    hits.noDamageToPlayer 这个测试开关，不是写死在代码里的机制差异。
 *  - 不背后索敌；起手把目标 id / 朝向 / 距离快照进 LinkState，挥击中不再重选目标。
 *  - 目标丢失 / 超范围时只冲到配置极限距离后中断，绝不无限追击。
 *  - 派生招与冲刺共用 dash.cooldown 冷却槽，且每个窗口只触发一次（不可连发）。
 * 全部纯数值 / plain data，可 JSON 序列化，确定性。
 */

export type LinkSource = 'none' | 'roll' | 'blink' | 'sprint';
export type LinkPhase = 'idle' | 'windup' | 'active' | 'recovery';
/** 命中形状：Phase 1 用 sector / capsule（扫掠），后续 circle(旋风/冰环) / cone(落地冲击面)。 */
export type HitShapeKind = 'sector' | 'capsule' | 'circle' | 'cone';

export type LinkHitConfig = {
  shape: HitShapeKind;
  /** 判定半径（米）：扇区 / 圆 / 锥形有效 */
  radius: number;
  /** 扇区 / 锥形半角（度） */
  arcDeg: number;
  /** 扫掠线段半径（米）：capsule 有效，防止一帧大位移穿过目标 */
  width: number;
  /** 受击类型 */
  type: HurtType;
  /** 僵直时长（秒），0 = 按类型取默认 */
  duration: number;
  /** 击退距离（米），0 = 不击退 */
  knockback: number;
  /** 命中脉冲间隔（秒），0 = 每个 active 帧判定；旋风斩等可用多脉冲 */
  pulseInterval: number;
  /** Phase 3 预留：浮空目标高度（米），0 = 不浮空；上限 = characterHeight（不超过一个身高）。
   *  实现时按 v0 = sqrt(2·gravity·liftHeight) 反算初速，滞空时长自然符合物理。 */
  liftHeight: number;
  /** Phase 2/3 预留：冰冻时长（秒），0 = 不冰冻 */
  freeze: number;
};

export type LinkMoveConfig = {
  enabled: boolean;
  /** 招式标识，表现层据此选动画 / 特效 */
  kind: string;
  /** 最大冲锋距离（米）：索敌时取 min(目标距离 - stopDistance, distance) */
  distance: number;
  windup: number;
  active: number;
  recovery: number;
  hit: LinkHitConfig;
};

export type LinkConfig = {
  /** 总开关：false = 完全不产生派生招，窗口内攻击退回普通连击（精确 A/B） */
  enabled: boolean;
  /** 各来源结束后的可接招窗口（秒）。长跑 / 闪现刻意更长，避免操作不过来 */
  windows: { roll: number; blink: number; sprint: number };
  /** 派生招与冲刺共享的冷却（秒）：触发后把 dash.cooldown 至少提升到该值 */
  sharedCooldown: number;
  /** 长跑途中是否允许直接触发（松手后仍会另开窗口） */
  triggerWhileSprinting: boolean;
  /** 索敌：不做背后索敌，只取前方扇区内最近目标 */
  search: {
    range: number;
    maxAngleDeg: number;
    /** 冲到距目标多近停住 */
    stopDistance: number;
  };
  /** 无目标时是否回退到「面朝向 + 冲到极限距离」 */
  noTargetFallback: boolean;
  /** 武器 → 冲刺后招式表。未配置 / enabled=false 的武器不消费攻击输入（弓、法杖占位） */
  moves: Partial<Record<WeaponId, LinkMoveConfig>>;
  /** 落地招（Phase 3 实现）：空中按攻击立即起手、落地命中。配置先就位，enabled=false */
  landing: {
    enabled: boolean;
    /** 起手后等待落地的最大时长（秒），超时取消 */
    maxAirTime: number;
    moves: Partial<Record<WeaponId, LinkMoveConfig>>;
  };
};

/** 派生招运行时状态：玩家与每个假人各一份，结构完全一致（对称机制）。 */
export type LinkState = {
  phase: LinkPhase;
  source: LinkSource;
  /** 剩余可接招窗口（秒）。刻意不叫 window：Core 契约禁止出现浏览器全局同名标识符 */
  linkWindow: number;
  /** 窗口 id 单调自增；usedWindowId 相等表示该窗口已触发过（不可连发） */
  windowId: number;
  usedWindowId: number;
  /** 派生招自身冷却（触发时 = sharedCooldown），与 dash.cooldown 共享语义 */
  cooldown: number;
  /** 当前招式 kind（'' = 无） */
  kind: string;
  /** 起手时的武器，中途换武器即取消 */
  weapon: WeaponId | '';
  /** 每次起手递增，表现层据此触发一次性特效 */
  id: number;
  /** 阶段计时（秒） */
  timer: number;
  /** 动作进度 0..1（windup+active+recovery 归一化） */
  progress: number;
  /** 起手锁定的朝向 */
  facing: number;
  /** 起手锁定的目标 id（0 = 无目标 / 回退面朝向） */
  targetId: number;
  /** 起手锁定的目标距离 */
  targetDist: number;
  /** 本次冲锋目标距离（米，收敛用，全程不变 → 超范围只冲到极限即中断） */
  travel: number;
  /** 已行进距离（米） */
  travelled: number;
  /** 本帧位移线段起点（扫掠命中用，movement 之前记录） */
  fromX: number;
  fromZ: number;
  /** 命中脉冲计时 */
  pulseTimer: number;
  /** 本次招式已命中的目标 id（去重，保证每个目标只结算一次） */
  hitIds: number[];
  /** 本帧 attackPressed 是否已被派生通道消费（供 combat / abilities 仲裁） */
  consumedAttack: boolean;
  /** 长跑状态沿检测（true → false 时开窗口） */
  prevSprinting: boolean;
};

/* ---------------- 目标选择契约 ---------------- */

export type TargetingConfig = {
  /** 候选目标的最大水平距离（米） */
  range: number;
  /** 相对当前面朝向允许的最大夹角（度，半角）；背后的敌人不会被强行锁定 */
  maxAngleDeg: number;
  /** 朝向加权：score = dist - frontBias * cos(夹角)，越正面越优先 */
  frontBias: number;
  /** 每击结束希望与敌人保持的距离（米）：动态前冲与击退都趋向它 */
  idealRange: number;
  /** 有目标时，前冲距离相对武器基础 lunge 的最大放大倍数 */
  maxLungeScale: number;
  /** 总开关：关闭后攻击朝向与动态前冲退回「无目标」行为 */
  targetAssist: boolean;
};

export type TargetState = {
  /** 0 = 无目标；1..N = 锁定的假人 id */
  targetId: number;
  /** 由玩家指向目标的角度（弧度） */
  targetYaw: number;
  /** 玩家到目标的水平距离（米） */
  targetDist: number;
  hasTarget: boolean;
};

/* ---------------- 命中 / 受击 / 击退契约 ---------------- */

/** 命中目标：玩家或某个假人。玩家与假人共用一套 applyHit 规则（v9a 对称机制）。 */
export type HitTarget = { kind: 'player' } | { kind: 'dummy'; index: number };

/** 三种受击动画 + 无受击。字符串联合，跨语言映射无歧义。 */
export type HurtType = 'none' | 'light' | 'heavy' | 'knock';

/** 受击状态：Core 计时，表现层用 1 - timer/duration 归一化进度驱动后仰与闪色。 */
export type HurtState = {
  type: HurtType;
  /**
   * 最近一次受击的世界时间（秒，world.time）；从未受击为 0。
   * v9s.7：接敌准备据此实现「受击后 N 秒内不退出」——刚被打过不立刻放下戒备。
   */
  lastAt: number;
  /** 剩余时长（秒） */
  timer: number;
  /** 本次受击总时长（秒），0 = 未受击 */
  duration: number;
  /** 受击方向（攻击者 → 受击者）的单位向量，用于后仰朝向 */
  dirX: number;
  dirZ: number;
  /** 击退速度冲量（m/s，世界 XZ）：命中时写入，每帧由 movement / dummies 消费，decayHurt 指数衰减，
   *  形成「被击中后连续后退」而非一帧闪现。伤害系统接入后可改成受质量影响。 */
  knockX: number;
  knockZ: number;
};

export type HitsConfig = {
  /** 命中扇区半角（度），以 attackFacing 为中心 */
  arcDeg: number;
  /** 各武器有效攻击距离（米） */
  reach: Record<WeaponId, number>;
  /** 三种受击动画时长（秒） */
  hurtLight: number;
  hurtHeavy: number;
  hurtKnock: number;
  /** 各武器命中后的击退距离（米），0 = 不击退；大剑最大 */
  knockback: Record<WeaponId, number>;
  /** 击退速度衰减率（1/s，指数）：v(t) = v0·e^(-decay·t)。初速 v0 = push·decay，
   *  因此总后退距离 ≈ push，既保留「击退把敌人推开」的手感，又不会一帧闪现到终点。 */
  knockbackDecay: number;
  /** 假人挥砍命中玩家的有效距离（米） */
  dummyReach: number;
  /**
   * 测试限制开关：true = 假人攻击玩家只写受击动画，不施加击退 / 伤害 / 浮空 / 冰冻。
   * 假人与主角机制同构（同一 applyHit 出口），这个开关只是测试场景的数值限制，
   * 关闭后玩家也会按同一套规则被击退 —— 不是写死在代码里的不对称。
   */
  noDamageToPlayer: boolean;
  /** 假人挥砍对玩家的击退距离（米），仅在 noDamageToPlayer=false 时生效 */
  dummyKnockback: number;
  /**
   * v9s.29 · 卡肉时长（秒），按受击类型分档（0 = 关闭该档）。
   *
   * 参考成熟做法（鬼泣 / 怪物猎人 / 只狼）：轻击 2~4 帧、重击 5~7 帧、击飞 7~9 帧
   * （60fps 下 ≈ 33~150ms）。太短读不出「打实了」，太长会把连击节奏拖断。
   * 同类连击里连续命中不会叠加，取最大值。
   */
  hitstop: {
    light: number;
    heavy: number;
    knock: number;
  };
  /**
   * v9s.33 · 卡肉分武器档位（乘在 hitstop 表上）。
   * 同一记「重击」，双手大剑读起来比双剑沉得多：大剑 1.3 / 剑盾 1.0 / 法杖 1.1 /
   * 双剑 0.85 / 弓 0.9。缺省 1 = 使用全局表（旧配置零影响）。
   */
  hitstopByWeapon?: Partial<Record<WeaponId, number>>;
  /**
   * v9s.37 · 卡肉节奏（接触瓦片 + 偿还）。
   *
   * 硬冻结的代价是「这一刀变长了」，连击时会觉得发黏；实际动作游戏更常用的是
   * **时间瓦片**：接触后把动画速率压到接近 0 保持几十毫秒（读作「砍进去了」），
   * 再用一小段缓动回到 1，最后把欠下的时间在 recovery 里以 >1 的速率补回 ——
   * 打感不变，但整段动作的总时长基本守恒，连击节奏不会被拖断。
   * `enabled: false` 精确回到 v9s.36 的硬冻结（A/B 用）。
   */
  hitstopWarp?: HitstopWarpConfig;
  /**
   * v9s.37 · 连段衰减：第 1/2/3 段分别乘这里的系数。
   *
   * 战神那种「每一击都有卡肉」只有在单次很短时才成立；连段越往后越短，
   * 三连收招才不会变成三段慢动作。缺省全 1（旧行为）。
   */
  hitstopComboFalloff?: number[];
};

export type HitstopWarpConfig = {
  enabled: boolean;
  /** 保持期的动画速率（0.05 ≈ 每帧只走 5% 的进度，画面仍在极缓慢移动） */
  holdRate: number;
  /** 释放段时长（秒）：从 holdRate 缓回 1 */
  release: number;
  /** 偿还段最大速率（1.5 = 用 1.5 倍速把欠的时间补回） */
  payback: number;
  /** 偿还只允许占用 recovery 的这个比例（0.6 = 六成），剩下的债务作废，避免收招抽搐 */
  paybackBudget: number;
};

/* ---------------- 技能契约（法杖：引导飞弹 / 电环，v7c #12） ---------------- */

/**
 * 把法杖技能从「复用近战 AttackPhase + castIndex 硬编码」里剥离成一套独立抽象：
 *  - 引导类（channel）：按住攻击键可移动，按间隔发射投射物，命中即结算；
 *  - 放置类（zone）：原地生成一个短暂存在的区域，按脉冲对范围内敌人结算命中。
 * 命中结算统一走 hits.dealHit（与近战共用受击 / 击退 / 计数 / 事件出口），保持可维护性。
 * 全部为 plain data、可 JSON 序列化；不读外部状态，确定性。
 */

/** 投射物（奥术飞弹）：引导期间按 fireInterval 发射，沿世界 XZ 匀速飞行，命中或超时销毁。 */
export type ProjectileState = {
  id: number;
  x: number;
  y: number;
  z: number;
  /** 单位飞行方向（世界 XZ）；制导每帧按 turnRate 限幅转向后更新 */
  dirX: number;
  dirZ: number;
  speed: number;
  /** 剩余存活（秒） */
  life: number;
  /** 命中半径（米），叠加假人半径判定 */
  radius: number;
  /**
   * v9s.17：制导目标（假人**索引**，-1 = 无目标直飞）。
   * 发射时在引导朝向的锥形范围内选最近目标快照下来，飞行中只做「轻微转向修正」，
   * 不做全向追踪 —— 目标横移过快时仍会打偏，保留弹道手感。
   */
  targetIndex: number;
  /** v9s.17：最大转向角速度（弧度/秒），0 = 完全不制导 */
  turnRate: number;
  /**
   * v9s.17：剩余制导时间（秒）。只在出膛后的前 homingTime 内允许转向，
   * 之后锁定直飞 —— 否则「限速转向」会变成绕目标画圈（转弯半径 = 速度 / 角速度）。
   */
  homing: number;
  /**
   * v9s.18：剩余「散开」时间（秒）。> 0 时不制导，沿自己的发射角直飞；
   * 归零后才开始各自索敌 / 转向。
   */
  spread: number;
  /** v9s.18：距下次重新索敌的剩余时间（秒） */
  retarget: number;
  /** v9s.17：所属引导波次（0 起），表现层可用它做齐射的错帧效果 */
  wave: number;
};

/**
 * v9s.18 · 待出膛飞弹：同一波不再同帧齐发，而是按 spawnDelay 错落出膛。
 *
 * 存的是「出生参数」而不是实体：出膛时才创建 ProjectileState。
 * 让「散开 / 错落」变成 Core 里的确定性时间轴，暂停 / 时间缩放 / 快照回放全都一致。
 */
export type PendingShot = {
  /** 剩余延迟（秒），<= 0 时出膛 */
  delay: number;
  x: number;
  y: number;
  z: number;
  /** 出膛朝向（已含散布角） */
  yaw: number;
  speed: number;
  /** 出膛时快照的目标（-1 = 无目标，直飞） */
  targetIndex: number;
  wave: number;
};

/**
 * v9s.17 · 弓箭实体：Core 自己算抛物线，命中 / 落地后「插住」并驻留。
 *
 * 设计取舍：箭不是与假人无关的纯表现特效 —— 它要能插在**移动中的目标身上**，
 * 落地位置还要尊重台阶高度。所以位置 / 速度 / 插住状态都放进 Core（确定性、可快照），
 * 表现层只按状态渲染。插在假人身上时存相对偏移（不随假人转身，只跟随平移），
 * 避免假人原地转身把箭「甩」出去。
 */
export type ArrowState = {
  id: number;
  x: number;
  y: number;
  z: number;
  /** 速度（米/秒），y 分量每帧受重力衰减 */
  vx: number;
  vy: number;
  vz: number;
  /** 飞行剩余寿命（秒）：超时直接移除，不插住 */
  life: number;
  /** true = 已插住（目标 / 地面），不再推进 */
  stuck: boolean;
  /** 插在哪个假人上（-1 = 插在地面） */
  stuckDummy: number;
  /** 插在假人身上时相对其世界位置的偏移 */
  offX: number;
  offY: number;
  offZ: number;
  /** 插住后的朝向：yaw 为水平朝向，pitch 为插角（负 = 箭尾朝上） */
  yaw: number;
  /**
   * v9s.18：插在假人身上时的**局部朝向**（相对假人身体朝向）。
   * 假人转身时箭跟着一起转，所以世界 yaw = bodyYaw + localYaw；
   * 插在地上时无意义（0）。
   */
  localYaw: number;
  pitch: number;
  /** 插住后剩余驻留时间（秒），归零移除 */
  rest: number;
  /** 是否命中过假人（插在地上为 false） */
  hit: boolean;
  /**
   * v9s.19：自动瞄准锁定的目标（假人 id，0 = 无）。出弓时快照，飞行中不换目标；
   * 目标中途倒下则放弃修正、按当前弹道继续飞。
   */
  targetId: number;
  /** v9s.19：剩余自动修正时间（秒），0 = 锁定弹道 */
  homing: number;
  /** v9s.19：最大水平转向角速度（弧度/秒），0 = 不修正 */
  turnRate: number;
};

/** 电环：原地放置，存活期内按脉冲对范围内假人结算「僵直 + 轻微击退」。世界坐标，不随玩家移动。 */
export type ShockRingState = {
  id: number;
  x: number;
  z: number;
  radius: number;
  /** 剩余存活（秒） */
  life: number;
  /** 总存活（秒），表现层据此归一化缩放 / 淡出 */
  duration: number;
  /** 距下一次命中脉冲的剩余时间（秒） */
  pulseTimer: number;
};

/**
 * 法杖技能运行时：引导与放置区域统一成一份纯数据状态，与近战 AttackPhase 状态机解耦。
 * 引导刻意不进入 combat.phase（保持 idle），因此移动模块不锁速 —— 「按住可以移动引导」。
 */
export type AbilityState = {
  /** 是否正在引导（法杖 + 按住攻击键） */
  channeling: boolean;
  /** 引导朝向（每帧用 resolveFacingYaw 刷新，支持拖拽辅助朝向） */
  channelYaw: number;
  /** 距下一波飞弹的剩余时间（秒） */
  fireTimer: number;
  /** v9s.17：本次引导已发射的波数（0..waves） */
  waveIndex: number;
  /** v9s.17：引导 / 齐射结束后的剩余冷却（秒）；>0 时无法开始新的引导 */
  cooldown: number;
  /**
   * v9s.17：必须松开攻击键才能重新开始引导。
   * 5 波放完或进入冷却后置位 —— 否则按住不放会在冷却结束的下一帧自动重开，
   * 「一次引导 5 波」就变成了挂机连发。
   */
  needsRelease: boolean;
  /** v9s.17：每次引导递增，表现层据此触发一次起手效果 */
  channelId: number;
  /**
   * v9s.19：引导期间的移动速度比例，由技能在开始引导时写入、结束 / 打断时归 1。
   * 移动模块只读这个值，不再硬编码「法杖 = 0.6」—— 换一个引导型技能也能自洽。
   */
  channelMoveScale: number;
  /** 累计发射数，表现层 / 事件据此触发一次性效果，持久递增不倒退 */
  volleyId: number;
  /** v9s.18：已定好出生参数、等待错落出膛的飞弹（按 spawnDelay 倒计时） */
  pending: PendingShot[];
  projectiles: ProjectileState[];
  rings: ShockRingState[];
  /** 全局技能实例 id 自增（飞弹 / 电环共用，保证唯一） */
  nextId: number;
};

/** 技能配置：全部数值外置，调试面板可热改。 */
export type AbilityConfig = {
  /** 奥术飞弹引导（攻击键按住，可移动） */
  arcane: {
    /**
     * v9s.17：改为「波次齐射」。
     * 一次引导按 waveInterval 发 waves 波，每波 perWave 枚、带 spreadDeg 散布；
     * 放完 / 松手 / 被打断都进入 cooldown，冷却结束且松手后才能再按。
     */
    perWave: number;
    waves: number;
    /** 波间隔（秒）；第一波在按下瞬间立即发射 */
    waveInterval: number;
    /** 同一波内相邻飞弹的角度差（度），总散布 = (perWave-1) × 该值 */
    spreadDeg: number;
    /**
     * v9s.18：出膛后的「散开」时长（秒）。
     * 这段时间内飞弹保持自己的发射角直飞（不制导），先在场面上散开一小段，
     * 之后再各自拐向目标 —— 观感是「炸开后收拢」，而不是「一出膛就并成一条线」。
     */
    spreadTime: number;
    /** v9s.18：同一波内相邻飞弹的出膛间隔（秒），让齐射错落而不是同一帧齐发 */
    spawnDelay: number;
    /** v9s.18：每发速度的随机浮动比例（0..1，确定性随机源），错落感主要来自它 */
    speedJitter: number;
    /** v9s.18：同一波内飞弹的横向出生偏移（米），让三发在出膛那一刻就不重叠 */
    spawnSideStep: number;
    /** v9s.18：飞行中重新索敌的间隔（秒），0 = 只在发射时选一次 */
    retargetInterval: number;
    /** 制导：发射时在引导朝向 homingConeDeg 锥形内、homingRange 米内选最近目标 */
    homingRange: number;
    homingConeDeg: number;
    /** 制导最大转向角速度（度/秒）：越小越「轻微」，0 = 直飞 */
    turnRateDeg: number;
    /** 出膛后允许转向的时长（秒）：之后锁定直飞，避免长距离绕圈 */
    homingTime: number;
    /** 引导结束 / 打断后的冷却（秒） */
    cooldown: number;
    /** 飞弹速度（米/秒） */
    speed: number;
    /** 飞弹存活时长（秒） */
    life: number;
    /** 命中半径（米） */
    radius: number;
    /** 命中受击类型 */
    hurtType: HurtType;
    /** 命中受击时长（秒） */
    hurtDuration: number;
    /** 命中击退距离（米，0 = 不击退） */
    knockback: number;
    /** 引导时移动速度比例（1 = 不减速，体现「可移动引导」） */
    moveScale: number;
  };
  /** 原地电环（技2 放置） */
  ring: {
    /** 作用半径（米） */
    radius: number;
    /** 存活时长（秒） */
    duration: number;
    /** 命中脉冲间隔（秒） */
    pulseInterval: number;
    /** 命中造成的僵直时长（秒，写入 hurt.timer，让假人 AI 停住） */
    stun: number;
    /** 命中轻微击退（米） */
    knockback: number;
  };
};

/* ---------------- v9s.19 技能模块化 / 数据驱动 ---------------- */

/** 技能绑定到哪个输入槽。 */
export type SkillSlot = 'attack' | 'skill2';

/**
 * 技能行为模块 id。配置里的 `kind` 直接映射到一个实现：
 *  - `channelVolley`：按住引导，按波次齐射投射物（奥术飞弹）
 *  - `groundRing`：原地放置一个周期性脉冲的区域（电环）
 * 新增技能 = 新写一个模块 + 在配置里加一条，不需要改 abilities / combat。
 */
export type SkillKind = 'channelVolley' | 'groundRing';

/**
 * 一条技能声明（纯数据，可来自 game.json，也可运行时追加）。
 *
 * `paramsRef` 与 `params` 二选一：
 *  - `paramsRef`：指向 `core.abilities.<name>`，用于保留旧配置布局与调试面板热改；
 *  - `params`：内联参数对象，完全数据驱动的新技能走这条。
 */
export type SkillConfig = {
  id: string;
  kind: SkillKind;
  slot: SkillSlot;
  /** 限定武器；省略 / null = 任意武器都能放 */
  weapon?: WeaponId | null;
  enabled?: boolean;
  paramsRef?: string;
  params?: Record<string, unknown>;
};

/** 运行时实例：声明 + 已解析的参数对象（引用同一份配置，热改立即生效）。 */
export type SkillRuntime = {
  cfg: SkillConfig;
  params: AbilityConfig['arcane'] | AbilityConfig['ring'];
};

/* ---------------- 角色间分离契约 ---------------- */

export type SeparationConfig = {
  /** 每帧迭代次数，越多越不容易残留重叠 */
  iterations: number;
  /** 额外分离量（米），避免两实体恰好贴边时抖动 */
  slop: number;
  /** v9p：主动挤人的一方受到的阻力（只衰减施压方的速度，绝不修改其位置） */
  crowd: CrowdResistanceConfig;
};

/**
 * v9p · 挤压阻力配置：旧版「玩家 ↔ 假人」分离把玩家当不可推动的锚点（权重 0），
 * 假人全量让开，于是玩家顶着假人能一路畅通地推着走。现在给**主动朝对方推进**的
 * 一方按「贴近程度 × 正对程度」衰减水平速度，推得越正、贴得越紧越费劲；
 * 背对远离或侧向擦过完全不受影响。纯数值、Core 消费、确定性。
 * minScale = 1 等价于关闭（回到旧行为），调试面板可热调对照。
 */
export type CrowdResistanceConfig = {
  /** 接触缓冲带（米）：距「两圆最小间距」多远开始产生阻力，越大越早开始减速 */
  contactBand: number;
  /** 正面顶住时的最小速度保留系数 0..1（越小阻力越大；0.3 ≈ 明显推不动） */
  minScale: number;
  /** 判定「主动挤」的方向点积阈值 0..1：速度方向 · 指向对方的单位向量 大于此值才算 */
  approachDot: number;
};

/* ---------------- 冲刺 / 闪避契约 ---------------- */

/** 冲刺动作类型：翻滚（物理武器）/ 闪现（法杖）/ 无。 */
export type DashKind = 'none' | 'roll' | 'blink';

export type DashConfig = {
  /** 翻滚：位移（米）、持续时间（秒）、冷却（秒） */
  rollDistance: number;
  rollDuration: number;
  rollCooldown: number;
  /** 闪现：最大距离（米）、沿途采样步长（米，越小越不易穿墙）、冷却（秒） */
  blinkDistance: number;
  blinkStep: number;
  blinkCooldown: number;
  /** 闪现后立即清空水平速度，避免惯性把角色拉回 */
  blinkClearVelocity: boolean;
};

/**
 * 冲刺状态，plain data，可随 World 一起 JSON 序列化。
 * roll 有 active 持续期（写 impulse 让 movement 消费）；blink 是单帧瞬移，
 * from/to 记录起终点供表现层画残影与落点光效。id 每次触发递增，驱动一次性特效。
 */
export type DashState = {
  kind: DashKind;
  phase: 'idle' | 'active';
  /** active 剩余时间（秒） */
  timer: number;
  /** 本次 active 总时长（秒），表现层归一化进度 */
  duration: number;
  /** 剩余冷却（秒） */
  cooldown: number;
  /** 动作方向（单位向量） */
  dirX: number;
  dirZ: number;
  fromX: number;
  fromZ: number;
  toX: number;
  toZ: number;
  /** 每次触发递增 */
  id: number;
};

/* ---------------- 智能相机契约 ---------------- */

/**
 * 威胁评估 → 构图意图。参考战神5 的情境相机：周围威胁越多、越近，
 * 相机越拉远并把画面中心向威胁质心平移，必要时略微抬高俯角看清包围圈；
 * 无人时则轻微推进，让画面更贴近玩家。
 * 全部是纯数值，Core 计算、可快照、可跨语言对照；时间平滑由表现层负责。
 */
export type CameraThreatConfig = {
  /** 威胁评估半径（米），超出不计入 */
  radius: number;
  /** 权重饱和距离（米）：<= 此距离时近度权重为 1 */
  nearDistance: number;
  /** 各假人行为模式的基础威胁倍率 */
  modeWeight: Record<DummyMode, number>;
  /** 假人正处于挥砍 active 帧时的额外加权 */
  attackBoost: number;
  /** 威胁归一化饱和常数：threat = sum / (sum + saturation) */
  saturation: number;
  /** 无威胁时的推进比例（0.12 = 距离 × 0.88） */
  pushIn: number;
  /** 满威胁时的最大拉远比例 */
  maxPullback: number;
  /** 画面中心相对玩家的最大平移（米） */
  maxOffset: number;
  /** 满威胁时的最大俯角增量（度） */
  maxPitchDelta: number;
  /** 威胁质心方向平移系数 */
  framingBias: number;
};

/**
 * v9s.3 · 注视 / 威胁评估配置（Core 侧，确定性）。
 * 威胁加权口径与相机（CameraThreatConfig）完全一致：近度 × 行为模式倍率
 * （+ 挥砍 active 帧 attackBoost），便于「包围圈」与「威胁注视」同源。
 * 普通注视只动头（不改身体）；威胁注视在「主动瞄准 + 范围内有威胁」时让
 * 身体趋向威胁加权中心、头看主威胁，威胁全超出 recoveryDist 交还身体控制。
 */
export type GazeConfig = {
  enabled: boolean;
  /** 普通注视：头相对身体最大偏转（度），超过则头平滑转回看移动方向 */
  headLookLimitDeg: number;
  /** 普通注视感知半径（米）：范围内有可注视目标（锁定/最近假人）才转头看 */
  headGazeRange: number;
  /** 威胁感知半径（米）：瞄准 / 被攻击 / 加权中心统计的候选范围（不等于接敌进入距离） */
  threatRange: number;
  /** 退出接敌的距离（米）：全部敌人拉出此距离才交还身体控制（滞回，默认 5） */
  recoveryDist: number;
  /** 参与加权中心的高权威胁数量（主威胁 + 最近 N-1） */
  maxThreats: number;
  /** 身体朝威胁中心转向速率（1/s） */
  bodyTurnRate: number;
  /**
   * v9s.4 威胁注视时头部追随主威胁的速率（1/s），应明显大于 bodyTurnRate。
   * 接敌准备：身体沉稳步步压向威胁中心，头更快锁住主威胁 → 头先于身体到位。
   */
  headTurnRate: number;
  /**
   * v9s.18：头部 / 身体的**角速度上限**（度/秒）。
   * 指数趋近在大角差时首帧就能吃掉 10%+ 的差距（左右切换目标 = 单帧 20°+），
   * 观感就是「甩头」。限速后原地左右环视变成匀速扫视，不再一帧到位。
   */
  maxHeadSpeedDeg: number;
  maxBodySpeedDeg: number;
  /**
   * v9s.19：**没有注视目标时**头部回正的速率（1/s）。
   *
   * 回正在身体局部空间进行：头相对身体的偏角自己衰减，身体怎么转头就跟着转。
   * 旧版用世界坐标把 headYaw 拉向 facing，身体转身时头是按「世界角度」追的，
   * 偏角大时反而比身体转得慢 —— 看起来头被落在后面。回正刻意比跟随慢
   * （默认 3.5 vs 8），收势时才不会「啪」一下弹回正中。
   */
  headReturnRate: number;
  /** v9s.19：无目标回正的角速度上限（度/秒），避免大偏角时还是一帧甩回去 */
  headReturnSpeedDeg: number;
  /**
   * v9s.18：注视目标高度的取点（占假人身高的比例，0..1）。
   * 0.75 落在胸口偏上 —— 眼睛看胸口而不是脚下，才有「在看他」的感觉。
   */
  aimHeightRatio: number;
  /** 玩家眼睛高度（占 characterHeight 的比例），用于算俯仰角 */
  eyeHeightRatio: number;
  /** 头部俯仰追随速率（1/s） */
  headPitchRate: number;
  /** 头部俯仰限幅（度）：目标很近 / 站在台阶下时不至于仰到脖子断 */
  maxHeadPitchDeg: number;
  /** 身体俯仰比例（0..1）：头部俯仰的一小部分，几乎察觉不到，但「整个人在看他」 */
  bodyPitchScale: number;
  /** 身体俯仰追随速率（1/s）：比头慢一点 → 身体略滞后于视线 */
  bodyPitchRate: number;
  /** 进入威胁注视的最小归一化威胁阈值（0..1），低于不进入 */
  enterThreshold: number;
  /**
   * v9s.5：范围内有敌人正在 / 即将攻击自己（attackPhase = windup / active）时，
   * 即使没有主动瞄准也进入威胁注视（接敌准备）。关掉则回到「必须瞄准」的旧口径。
   */
  reactToAttack: boolean;
  /**
   * v9s.6：未瞄准、也未被攻击，但「敌对模式」单位主动接近到 approachDist 内时，
   * 主动进入接敌准备（先转身戒备）。关掉则只保留 瞄准 / 被攻击 两种进入源。
   */
  reactToApproach: boolean;
  /** v9s.6：主动接敌的进入距离（米，默认 2.5）：敌对模式单位进入此距离即转身戒备 */
  approachDist: number;
  /**
   * v9s.7：受击后强制保持接敌的时长（秒，默认 2）。
   * 即使敌人已拉开到 recoveryDist 之外，只要距上次被攻击不足此时长就继续接敌（不放下戒备）。
   */
  hurtHoldSec: number;
  /** v9s.6：modeWeight >= 此值才算「敌对」（idle 0.2 / wander 0.45 不算，follow 0.8 起算） */
  hostileModeWeight: number;
  /**
   * v9s.6：离主威胁方向越远的加权衰减强度（0 = 不衰减）。
   * factor = 1 / (1 + spreadFalloff × (夹角差/π)²)，让加权中心贴近主威胁，
   * 不被侧翼 / 后方零散敌人把身体拉平。
   */
  spreadFalloff: number;
  /** v9s.6：角色背后的威胁额外权重倍率（0..1，越小越不管背后；1 = 不惩罚） */
  behindFalloff: number;
  /** v9s.6：判定「背后」的角度（度，相对身体朝向超过此角算背后），默认 100 */
  behindAngleDeg: number;
  /** 各假人行为模式基础威胁倍率（复用相机口径） */
  modeWeight: Record<DummyMode, number>;
  /** 假人挥砍 active 帧额外加权 */
  attackBoost: number;
  /** 近度归一化近距（米）：<= 此距离近度权重为 1 */
  nearDistance: number;
  /** 威胁归一化饱和常数：threat = sum / (sum + saturation) */
  saturation: number;
};

export type CameraIntent = {
  /** 距离倍率：<1 推进、>1 拉远 */
  distanceScale: number;
  /** 画面中心相对玩家的平移（世界 XZ，米） */
  offsetX: number;
  offsetZ: number;
  /** 俯角增量（度） */
  pitchDelta: number;
  /** 归一化威胁强度 0..1 */
  threat: number;
  /** 参与评估的威胁数量 */
  threatCount: number;
  /** 威胁加权质心（世界 XZ），供调试可视化 */
  centroidX: number;
  centroidZ: number;
};

/** v9s.3 · 注视 / 威胁运行时状态（plain data，随快照回放）。 */
export type GazeState = {
  /** 是否处于威胁注视（主动瞄准 + 范围内有威胁） */
  active: boolean;
  /** 主威胁假人 id（0 = 无） */
  mainId: number;
  /** 主威胁朝向（弧度，玩家指向主威胁）；头看向此处 */
  mainYaw: number;
  /**
   * v9s.18：主威胁的**仰角**（弧度，+ = 目标更高、需要抬头）。
   * 取假人身高 aimHeightRatio 处为注视点，与玩家眼睛高度作差后 atan2。
   */
  mainPitch: number;
  /** 加权中心朝向（弧度，主威胁 + 最近 N-1 高权威胁）；身体趋向此处 */
  centroidYaw: number;
  /** 参与评估的威胁数（威胁范围内、加权 > 0） */
  threatCount: number;
  /** 归一化威胁强度 0..1（sum / (sum + saturation)） */
  threat: number;
};

/* ---------------- 测试假人契约 ---------------- */

/**
 * 测试行为 + 待机（点击循环里的「关闭」态）+ 陪练（v9s.38）。
 *
 * `spar` = 持械陪练角色的默认行为：保持「刚好在刀能砍到」的距离左右游走，
 * 攻击间隔比普通假人长（攻击欲望低），用来在混战里观察被围攻时的判读与手感。
 */
export type DummyMode = 'idle' | 'wander' | 'follow' | 'keep-distance' | 'attack' | 'spar';

/** 点击普通假人的循环顺序：四种行为依次轮转，idle 作为暂停态放在末尾。 */
export const DUMMY_MODES: DummyMode[] = ['wander', 'follow', 'keep-distance', 'attack', 'idle'];

/** v9s.38：点击持械陪练的循环顺序 —— 从 spar 开始，其余与普通假人一致（末尾回到 spar）。 */
export const FIGHTER_MODES: DummyMode[] = [
  'spar', 'wander', 'follow', 'keep-distance', 'attack', 'idle',
];

export type DummySpawn = { x: number; z: number };

/**
 * v9s.38 · 持械陪练角色配置（混战调试用）。
 *
 * 三个「和主角一样」的 AI：同一副骨架、同一套武器与挥击剪辑，只是不含玩家的输入 /
 * 冲刺 / 技能。它们被追加在普通假人之后（id 连续），因此点击轮转、脚下威胁环、
 * 受击 / 击退、渲染插值全部复用假人那套机制，不需要第二份实现。
 *
 * 攻击欲望由 `attackInterval` 控制：普通假人 1.6s 一击，陪练 3.4s 一击，
 * 且起手距离按「武器 reach × attackRangeScale」收窄 —— 挥不到不出手。
 */
export type DummyFighterConfig = {
  /** 每个角色一件武器（剑盾 / 双刀 / 大剑），与 `spawn` 一一对应 */
  weapons: WeaponId[];
  spawn: DummySpawn[];
  /** 初始行为，缺省 `spar` */
  initialModes?: DummyMode[];
  moveSpeed: number;
  /** 攻击间隔（秒）：越大越懒 */
  attackInterval: number;
  /** 起手距离 = `hits.reach[weapon] × 本值` */
  attackRangeScale: number;
  /** 打到玩家时的击退比例（0 = 完全不推人，保留 `hits.dummyKnockback` 的基准） */
  knockbackScale: number;
  /** 牵引半径（米）：陪练要比普通假人跟得远一点，才测得到「被追着打」 */
  leashRadius: number;
};

export type DummyConfig = {
  count: number;
  spawn: DummySpawn[];
  /** 与 spawn 一一对应，reset 时按此恢复 */
  initialModes: DummyMode[];
  radius: number;
  height: number;
  moveSpeed: number;
  acceleration: number;
  /** 游走：以 home 为圆心的半径 / 换目标间隔（秒） */
  wanderRadius: number;
  wanderInterval: number;
  /** 跟随：小于此距离停止靠近，避免贴脸 */
  followStopDistance: number;
  /** 保持距离：趋向距离 / 死区 / 死区内绕行强度 */
  keepDistance: number;
  keepDeadZone: number;
  keepStrafe: number;
  /** 攻击：进入范围才挥砍（无伤害）/ 冷却 / 三段时长 */
  attackRange: number;
  attackInterval: number;
  attackWindup: number;
  attackActive: number;
  attackRecovery: number;
  /**
   * v9s.15：牵引半径（米，0 = 关闭 = 旧行为）。
   * 追击 / 保持距离的假人离开 home 超过该半径时，移动方向按超出量逐渐改回 home，
   * 让每个测试工位只留自己的假人，不会追着玩家跑遍全场。
   */
  leashRadius: number;
  /** v9s.38：持械陪练角色（追加在 `count` 之后，id 连续；缺省 = 没有陪练） */
  fighters?: DummyFighterConfig;
};

export type DummyAttackPhase = 'idle' | 'windup' | 'active' | 'recovery';

/** 单个假人的全部状态，plain 数据，可随 World 一起 JSON 序列化。 */
export type DummyState = {
  id: number;
  mode: DummyMode;
  initialMode: DummyMode;
  homeX: number;
  homeZ: number;
  position: Vec3;
  velocity: Vec3;
  facing: number;
  /** 身体朝向：指数平滑追随 facing（转身有惯性，不像 root.rotation 那样瞬转），怪物动画与主角一致（v7b#9） */
  bodyYaw: number;
  /** 头部朝向：更快追随 facing，头先于身体转向目标，再相对身体限幅（v7b#9） */
  headYaw: number;
  gaitPhase: number;
  /** v9e：与主角同构的步幅（米 / 周期），表现层据此做零滑步的脚落地 */
  stride: number;
  distance: number;
  targetX: number;
  targetZ: number;
  wanderTimer: number;
  attackCooldown: number;
  attackPhase: DummyAttackPhase;
  attackPhaseTimer: number;
  /** 0..1，表现层用于挥砍插值 */
  attackProgress: number;
  /** 每次起手递增，表现层据此触发一次性特效 */
  attackId: number;
  /** 受击僵直：timer > 0 期间假人不主动移动、不发起新攻击 */
  hurt: HurtState;
  /** v9a：与主角完全同构的派生招运行时状态（对称机制，当前 AI 不主动起手） */
  link: LinkState;
  /**
   * v9s.38：持械陪练的武器（与主角同一套挂点 / 剪辑）；null = 普通假人。
   * 一旦有值，表现层就用主角的体素骨架渲染，并读 `combat` 驱动挥击。
   */
  weapon: WeaponId | null;
  /**
   * v9s.38：持械陪练的战斗时间轴（阶段 / 进度 / 武器时序），供 `voxel-rig` 直接驱动。
   * 普通假人为 null —— 它们仍走 `dummy-rig` 的简化挥砍。
   */
  combat: CombatState | null;
};

export type DummyViewConfig = {
  /** 按 id 顺序取色，数量不足时回绕 */
  colors: string[];
  /** 挥砍攻击弧颜色 */
  attackArcColor: string;
  /**
   * v9s.38：持械陪练的身体配色（与主角同骨架，只换 body / limb / head 三色，
   * 便于一眼区分「哪个是玩家、哪个是 AI」）。缺省沿用主角配色。
   */
  fighterColors?: Array<{ body: string; limb: string; head: string }>;
};

/**
 * 程序化朝向参数：面朝向 / 身体朝向 / 移动方向分离。
 * 全部是速率与角度，纯数值，Unity/Godot 可直接映射。
 */
export type OrientationConfig = {
  /** 身体朝向追随目标朝向的指数平滑速率（1/s），越小转得越慢 */
  bodyTurnRate: number;
  /** 头部朝向追随目标朝向的速率（1/s），应明显大于身体 → 头先转到位 */
  headTurnRate: number;
  /** 头部相对身体的最大偏转角（度），防止扭头过度 */
  maxHeadTurnDeg: number;
  /**
   * v9g：小幅推杆时的面朝向平滑速率（1/s）。
   * 摇杆推到 35% 以下时，几像素的抖动就能让 atan2 偏 60°+，直接跟随会让角色来回抽；
   * 这个速率约等于 70ms 到位，大幅推杆（≥35%）仍瞬时跟随，不影响转身手感。
   */
  facingSmoothRate: number;
  /** 低于该幅值不更新面朝向（摇杆回中 / 死区边缘的微抖） */
  facingDeadZone: number;
  /**
   * v9g：小幅推杆时的朝向死区（度）。输入方向与当前面朝向夹角小于它就不转身，
   * 让「拇指在原点附近微颤」不会把角色摇得来回转；超过则按 facingSmoothRate 平滑跟上。
   */
  facingDeadbandDeg: number;
  /** 低于该幅度视为「拇指微颤」，完全不改面朝向（0.18 ≈ 半径 56px 上的 10px） */
  facingMinMagnitude: number;
  /**
   * v9h：面朝向最大转速（度/秒）。锁定期（攻击）解除、摇杆从静止突然指到反方向时，
   * 目标与当前朝向差 120°+ 会在一帧内整块翻转（真机日志里的 141°/126° 跳变），
   * 视觉上是头瞬间甩过去。限速只削「大角」，小角照样瞬时对齐。
   */
  facingTurnRate: number;
  /** 与当前朝向夹角小于该值时直接对齐，不受 facingTurnRate 限制（度） */
  facingSnapDeg: number;
};

/**
 * v9s · 原地转身（turn-in-place）配置：静止盯视目标、目标绕到背后时触发一次
 * 明确的原地转身，而不是靠 bodyYaw 指数插值「下半身滑过去」。
 *
 * 纯数值、无外部状态，随 CoreConfig 一起快照，可跨语言对照。
 */
export type TurnInPlaceConfig = {
  /** 总开关（关闭后状态机冻结、不产生新触发，且立即清理残留状态） */
  enabled: boolean;
  /** 触发夹角阈值（度）：|目视方向 − bodyYaw| 超过该值才触发 */
  triggerDeg: number;
  /** 转身结束时保留的余角（度）：不必硬转满 180°，留一点更自然 */
  settleDeg: number;
  /** 一次转身的时长（秒），固定节奏、与夹角大小无关 */
  durationSec: number;
  /** 静止判据：水平速度占 moveSpeed 的比例上限 */
  idleSpeedRatio: number;
  /** 移动输入死区：超过即视为起步，立即中止转身（保证起步 / 攻击不被拖住） */
  inputDeadZone: number;
  /** 盯视目标的最远距离（米）；0 = 沿用 targeting.range */
  lookRange: number;
  /** 触发前需连续满足闸门的时长（秒），防拖拽抖动误触 */
  armSec: number;
  /**
   * v9s.18：威胁注视激活时的触发角（度）。默认远大于普通 triggerDeg
   * （例如 120°）—— 接敌时「左前方 → 右前方」这种前方环视交给 orientation 的
   * 限速插值平滑扫过去，只有真的绕到身后才播一次完整的原地转身。
   */
  gazeTriggerDeg: number;
};

/**
 * v9s · 原地转身运行时状态（plain data，随 World 一起快照 / 回放）。
 *
 * 只记录「决策」：触发/中止/进度；bodyYaw 的最终写入在 orientation 与
 * turn-in-place 两处协作完成（见 turn-in-place.ts 注释）。
 */
export type TurnInPlaceState = {
  phase: 'idle' | 'active';
  /** 触发瞬间的 bodyYaw */
  fromYaw: number;
  /** 快照的目标角（已扣 settleDeg 余角），转身过程中不再追随目标抖动 */
  targetYaw: number;
  /** 转身方向 +1 / -1 */
  dir: number;
  /** 0..1，固定时长推进，两端用 smoothstep 缓动 */
  progress: number;
  /** 连续满足闸门的累计时长（防抖） */
  armTime: number;
};

export type CoreConfig = {
  fixedDt: number;
  maxStepsPerFrame: number;
  moveSpeed: number;
  sprintMultiplier: number;
  acceleration: number;
  friction: number;
  /**
   * v9s.21：进入「技能接管」时的减速速率（1/s）。
   * 旧版在攻击 / 引导开始时把 `v` 直接赋值成 `输入 × 减速后的速度`，
   * 一帧内从 4.2 掉到 0；现在所有状态都只改「目标速度」，
   * 用这个速率指数趋近 —— 时间常数 1/14 ≈ 0.07s，读起来是「压了一下」而不是「被截断」。
   */
  skillDecel: number;
  gravity: number;
  jumpSpeed: number;
  stepHeight: number;
  characterRadius: number;
  characterHeight: number;
  coyoteTime: number;
  jumpBufferTime: number;
  strideLength: number;
  /**
   * 步幅随速度增长的强度。0 = 固定步幅（步频随速度线性飙升，高速过快）；
   * 越大则高速步幅越大、步频越平缓。默认 0.45，兼顾「步幅明显变大」与「步频不过度压低」。
   */
  strideSpeedGain: number;
  /** 步幅增长的速度比上限（相对 moveSpeed），防止冲刺等高速态把步幅拉得过大 */
  strideSpeedCap: number;
  fallTolerance: number;
  spawn: Vec3;
  worldBounds: Bounds;
  orientation: OrientationConfig;
  /** v9s：静止盯视触发的原地转身 */
  turnInPlace: TurnInPlaceConfig;
  combat: CombatConfig;
  /** v9a：冲刺 / 翻滚 / 闪现 / 长跑后的数据驱动派生招表 */
  links: LinkConfig;
  /** 法杖技能（引导飞弹 / 电环），独立于近战状态机（v7c #12） */
  abilities: AbilityConfig;
  /** v9s.19：技能声明表（数据驱动入口）。空数组 = 没有任何技能 */
  skills: SkillConfig[];
  targeting: TargetingConfig;
  hits: HitsConfig;
  separation: SeparationConfig;
  dash: DashConfig;
  camera: CameraThreatConfig;
  /** v9s.3：注视 / 威胁评估（普通注视只动头、威胁注视身体朝威胁中心） */
  gaze: GazeConfig;
  dummies: DummyConfig;
};

export type CameraConfig = {
  pitchDeg: number;
  yawDeg: number;
  distance: number;
  smoothing: number;
  fov: number;
};

export type JoystickConfig = { maxRadiusPx: number; deadZone: number };

/** 智能相机表现参数：Core 只输出构图意图，时间平滑属于观感，留在表现层。 */
export type SmartCameraViewConfig = {
  /** 构图意图的指数平滑速率（1/s），越大跟随越紧 */
  smoothing: number;
};

/**
 * 用户主动缩放（v8e）：双指捏合 / 滚轮 / 快捷键改变相机距离倍率。
 * 纯观感参数，只被输入适配层与相机表现层消费；不进入 Core 状态、不影响快照与确定性。
 * 语义：倍率 >1 = 相机拉远（看得更广），<1 = 拉近（看得更近）；
 *      最终距离 = camera.distance × 智能构图 distanceScale × 用户倍率。
 */
export type CameraZoomViewConfig = {
  /** 用户倍率下限（相对基础距离），防止镜头穿进角色 */
  min: number;
  /** 用户倍率上限，防止拉到场景外 */
  max: number;
  /** 倍率目标的指数平滑速率（1/s），越大越跟手 */
  smoothing: number;
  /** 捏合灵敏度：两指距离比例 → 倍率比例的指数（1 = 等比例，>1 更灵敏） */
  pinchGain: number;
  /** 单帧倍率比例限幅（>1），防止一帧内手指瞬移造成镜头爆冲 */
  maxStepRatio: number;
  /** 滚轮向下滚动 100px 对应的倍率比例（>1 = 拉远），向上取倒数 */
  wheelStep: number;
  /** 键盘单次缩放的倍率比例（>1 = 拉远） */
  keyStep: number;
};

/** 冲刺特效表现参数（纯观感）。 */
export type DashViewConfig = {
  /** 翻滚落地尘环 / 闪现首尾光环颜色 */
  rollColor: string;
  blinkColor: string;
  /** 一次性特效存活时长（秒） */
  fxDuration: number;
  /** 光环半径（米） */
  ringRadius: number;
};

/** v9a：派生招表现参数（纯观感，不进 Core 状态）。 */
export type LinkViewConfig = {
  /** 冲锋 / 盾击一次性光环颜色 */
  chargeColor: string;
  /** 光环半径（米） */
  ringRadius: number;
  /** 光环存活时长（秒） */
  fxDuration: number;
  /** 举盾前撞：上半身前倾最大角（度） */
  leanDeg: number;
  /** 举盾前撞：持盾臂前伸最大角（度） */
  shieldPitchDeg: number;
  /** 举盾前撞：骨盆前移最大量（米） */
  pelvisReach: number;
};

export type VoxelConfig = {
  headSize: number;
  bodyWidth: number;
  bodyHeight: number;
  limbThickness: number;
  legLength: number;
  armLength: number;
};

/**
 * v9s.30 · 可切换的体型预设。
 *
 * 体型不是「换个模型」而是「换一套骨架尺寸」：腿长决定髋高与跨步、臂长决定握持
 * 与 IK 臂展、躯干宽决定肩距。同一套动画数据在不同尺寸下会暴露不同的适配问题
 *（握持够不到、跨步踩空、挂点角度偏），所以把它做成可切换的观测手段。
 *
 * `height` 必须等于 `legLength + bodyHeight + headSize`（三头身），切换时同步写进
 * Core 的 `characterHeight`，否则碰撞 / 眼睛高度会和视觉对不上。
 */
export type BodyTypeConfig = {
  /** 显示名（HUD / 切换提示用） */
  name: string;
  /** 总身高（米）= legLength + bodyHeight + headSize */
  height: number;
  /** 碰撞半径（米），缺省沿用 core.characterRadius */
  radius?: number;
  /** 骨架尺寸；缺省沿用 view.voxel */
  voxel?: VoxelConfig;
  /** 配色覆盖（缺省沿用 view.colors），用来一眼区分体型 */
  colors?: Partial<ColorConfig>;
};

/** 表现层程序化朝向参数：只影响观感，不进入 Core 状态。 */
/**
 * 程序化步态（v8）：把「移动方向 → 腿部姿态」的解算参数外置，供调试面板热调。
 * 纯数值、零依赖，表现层 gait.ts 消费；不进入 Core 快照。
 */
export type GaitViewConfig = {
  /**
   * v9e：脚前伸距离 = 步幅 × reachRatio（米 / 米）。
   * 支撑相脚随身体等速后退（世界坐标静止）的条件是 reach = stride / 4，
   * 即 reachRatio = 0.25 —— 此时低速也不会滑步。改大 = 步子更大、脚会往后蹭。
   */
  reachRatio: number;
  /** 摆幅随速度增益：仅在拿不到 stride（攻击等效驱动等回退路径）时使用 */
  strideGain: number;
  /** 摆幅上限（rad），防止冲刺时腿甩过头（超出即钳制，钳制段会有轻微滑步） */
  maxAmp: number;
  /** 侧向步幅相对前后步幅的比例 */
  sideWeight: number;
  /** 交叉步强度 0..1：侧移时领先腿跨过中线、步幅更大 */
  crossStep: number;
  /** 摆动相抬膝幅度 */
  kneeLift: number;
  /**
   * 支撑相曲线形状 0..1：
   *   0 = 纯余弦（脚在中段最快，必然滑步）；
   *   1 = 线性后移 + C¹ 摆动回摆（支撑相脚的世界速度恒等于 0，理论零滑步）。
   */
  plantLock: number;
  /** 骨盆左右重心转移（米） */
  comSway: number;
  /** 骨盆上下起伏（米） */
  comBob: number;
  /** 侧移时骨盆 / 上半身侧倾（rad） */
  hipLean: number;
  /** 手臂对侧摆幅度 */
  armSwing: number;
  /** v9n：停步收相时长（秒）。0 = 关闭（旧行为：卡在最后一个步相直到速度归零） */
  stopBlendSec: number;
  /** v9n：纯侧移时下盘偏航的额外增益（0 = 关闭；1.1 ≈ 侧移时多带转一倍） */
  strafeHipBoost: number;
  /** v9n：假人下盘偏转的基准比例（玩家沿用 orientation.legYawScale） */
  strafeHipScale: number;
  /** v9n：假人下盘偏航上限（度；玩家沿用 orientation.hipYawMaxDeg） */
  strafeHipMaxDeg: number;
  /** v9o：进入停步收相的速度上限（占参考移速的比例）。只在「已降到该速度且仍在减速」时进入，
   *  避免把低速巡航误判成停步（误判会让腿静止、身体继续平移 → 滑行）。 */
  stopEnterRatio: number;
  /** v9o：退出停步收相的速度阈值（占参考移速的比例）。速度回到该值以上或任一帧重新加速，
   *  立即交还正常步态。应明显大于 stopEnterRatio 形成滞回。 */
  stopExitRatio: number;
  /** v9o：胸 / 上半身跟随下盘偏航的比例（0 = 不跟随，1 = 与下盘同角度）。
   *  移动时只有腿偏转、胸不动会显得上下身拧巴，取约 0.4~0.5 更自然。 */
  chestYawScale: number;
  /** v9o：胸偏航上限（度），防止下盘大角度带转时上半身被拧过头。 */
  chestYawMaxDeg: number;
  /* ---- v9p · 停步惯性：最后一步踩出去 + 身体跟着惯性微前移，再收回待机 ----
   * 全部为 0 时精确回到 v9o 的「只收拢相位」行为，调试面板可逐项拉 0 对照。 */
  /** 前脚（停步相位里更靠前那条腿）额外前伸（rad，正值） */
  stopStepPitch: number;
  /** 跟随腿轻微后蹬（rad，正值） */
  stopTrailPitch: number;
  /** 前脚抬膝（rad，正值） */
  stopStepKnee: number;
  /** 身体沿停步瞬间的移动方向微前移（m） */
  stopBodyShift: number;
  /** v9r：停步时骨盆跟随上半身一起轻微下沉（m）。写在 IK 基准之后，
   *  脚锚点取「未下沉」时的落点，故脚不跟着沉；IK 反解屈膝吸收，0 = 关闭。 */
  stopBodyDip: number;
  /** 上身随惯性前倾（rad） */
  stopChestPitch: number;
  /** 惯性脉冲峰值位置 0.05..0.95（两端值与导数均为 0，与收相淡出无缝衔接） */
  stopPeakRatio: number;
  /** v9q：把受击击退速度（hurt.knockX/knockZ，Core 只加到 position 不进 velocity）
   *  纳入步态驱动的比例：1 = 被推开时下盘跟着迈出后撤步（默认），0 = 旧「身体平移、腿不动」。
   *  只影响表现层的步态解算，不写 Core / 不进快照；玩家与假人共用。 */
  knockGaitScale: number;
  /* ---- v9s · 停步下盘偏差消化 ----
   * 根因：latRatio = 速度侧向分量 / 速度大小 是「方向比值」，松手减速时它保持不变，
   * 于是 hipYaw 一直维持停步前的偏转，直到速度 < 1e-6（收相结束后约 0.4s）才骤然
   * 归零 —— 观感就是「停步完成后一次明显插值到目标方向」。
   * 这里给下盘偏转目标乘一个淡出系数，把偏差消化进停步过程（或紧接收相之后）。 */
  /** 消化窗口：'inStop' = 随收相 stopT 同步过渡（默认）；'afterStop' = 保持到收相结束，
   *  之后按独立计时器消化（不依赖 turnInPlace 是否触发，避免小夹角时残留歪姿）。 */
  stopYawBlendMode: 'inStop' | 'afterStop';
  /** afterStop 模式的消化时长（秒） */
  stopYawAfterSec: number;
  /* ---- v9s · 原地转身踏步（表现层）---- */
  /** 关掉即精确回到「纯插值转身」，用于 A/B 对照 */
  turnStepEnabled: boolean;
  /** 转身踏步的领先腿前迈幅度（rad） */
  turnStepPitch: number;
  /** 转身踏步的抬膝幅度（rad） */
  turnStepKnee: number;
  /** 转身踏步时骨盆微幅下沉（m） */
  turnStepDip: number;
  /* ---- v9s.13 · 侧后方改用后退步态 ----
   * 侧后方（相对身体前向 >90°）本来按「前后轴 + 左右轴」两轴混合：脚走对角线、
   * 膝盖却只能绕 X 弯，观感是两腿被斜着拽开。这里按「后退占比」把侧向权重并入
   * 前后轴，腿只做前后交替（膝盖平面始终正对前进方向），读作正常的后退走。
   * 两个角度构成过渡区：该角之前保持侧移，之后完全按后退。 */
  /** 开始并入后退步态的角度（度，相对身体前向，90 = 正侧方） */
  backStrafeStartDeg: number;
  /** 完全变成后退步态的角度（度，180 = 正后方） */
  backStrafeFullDeg: number;
};

/* ---------------- 程序动画分层 / 落地缓冲（v8c，纯表现层） ---------------- */

/**
 * 攻击动画的「下半身权重」：把攻击姿态对腿的写入做成可调层，而不是直接覆盖步态。
 *   lowerBodyWeight = 0 → 攻击动画完全不碰下半身（用户本轮要看的效果：下盘稳住不动）；
 *   lowerBodyWeight = 1 → 恢复旧行为（大剑 / 三连击第 3 段直接写腿）。
 *   gaitWeight      = 0 → 攻击期间步态对下盘的贡献平滑淡出到静止基准（下盘完全不动）；
 *   gaitWeight      = 1 → 攻击期间步态继续驱动下盘（用于对比「边走边打」）。
 * blendRate 只控制进出攻击的指数平滑速率，避免权重切换瞬间产生姿态跳变。
 * 三层都不进入 Core / 快照，只影响观感。
 */
export type AttackPoseViewConfig = {
  /** 攻击「挥击跨步」姿态对下半身（腿/骨盆）的写入权重 0..1，默认 0 = 完全过滤。
   *  1 = 每段攻击按 attackProgress 前踏跨步、连击左右脚交替领先（v8d）。 */
  lowerBodyWeight: number;
  /** 攻击期间「程序化步态」对下半身的权重 0..1，默认 1 = 保留步态接管。
   *  v8d 起攻击阶段会喂给步态解算器一套由 attackProgress 派生的等效驱动
   *  （Core 锁速时 solveGait 才会输出姿态），0 = 淡出到静止基准。 */
  gaitWeight: number;
  /** 进出攻击姿态的指数平滑速率（1/s），帧率无关 */
  blendRate: number;
  /**
   * v9s.33 · 攻击期间「移动中」把下半身交还真实步态。
   *
   * 背景：Core 在攻击全程允许 30% 移速（`attackMoveScale` / `settleMoveScale`），
   * 但下半身仍停在攻击跨步姿态上 —— 脚被足部 IK 钉住、身体以 1 m/s 平移，
   * 读起来就是「收招后下盘在冰面上滑一段」。
   *
   * 这里按「实际速度」把腿部姿态淡回真实步态：`speed` 以下不接管、`full` 以上满接管，
   * 各阶段再乘一个上限（active 阶段不接管，让位给 lunge 的跨步）。
   */
  moveTakeover?: {
    /** 速度低于该值视为原地攻击，不接管 */
    speed: number;
    /** 速度达到该值视为正常移动，接管比例到 1 */
    full: number;
    /** windup 阶段接管上限（蓄势仍要保留跨步姿态，别全交出去） */
    windup: number;
    /** recovery 阶段接管上限 */
    recovery: number;
    /** settle 阶段接管上限 */
    settle: number;
  };
};

/**
 * 攻击跨步的程序动画参数（v8d）：两条下半身驱动路径共用的幅度 / 方向配置。
 * 纯表现层，只被 program-anim.ts 读取；Core 不感知。
 *
 * 背景：Core 在攻击阶段把自主移速锁为 0（attackMoveScale=0，v.x=v.z=0），
 * 而步态解算器在 speed<EPS 时直接返回静止姿态 —— 若不补足等效驱动，
 * 「攻击时保留移动步态」这一路无论权重拉到多少都恒为 0，看起来就是下半身完全不动。
 */
export type AttackStrideViewConfig = {
  /** v9p：跨步幅度倍率（整数，>=1）。相位在起手锁定的基准上做 0→π×cycles→0 的
   *  单次往返脉冲（迈出→撑住→收回），两端值与导数都为 0，进出攻击不跳变；
   *  1 = 半周期一次完整跨步，拉高会重新变碎。 */
  cycles: number;
  /** 攻击期间的等效步速（m/s）：让 solveGait 在 Core 锁速时仍有可见摆幅 */
  strideSpeed: number;
  /**
   * v9p：攻击等效步幅系数（相对 Core 当前步幅）。攻击时 Core 锁自主移速 → c.stride
   * 恒为基准步幅，乘该系数后喂给 solveGait 走「物理步幅」路径（脚前伸 = stride × reachRatio），
   * 比旧版「stride=0 → 摆幅随速度回退」大得多，步子不再碎。1 = 关闭（旧行为）。
   */
  strideScale: number;
  /** 攻击跨步方向中「前冲」占比 0..1，其余给左右交替侧跨 */
  forwardBias: number;
  /** 挥击跨步：腿前后摆幅度（rad，领先腿向前、跟随腿蹬地） */
  stepPitch: number;
  /** 挥击跨步：领先腿抬膝幅度（rad） */
  stepKnee: number;
  /** 挥击跨步：左右侧摆幅度（rad） */
  stepSide: number;
  /** 挥击跨步：重心下沉（m，正值表示下沉） */
  stepDip: number;
  /** 挥击跨步：骨盆朝领先侧侧移（m） */
  stepSway: number;
  /* ---- v8g：applyStep 的「骨盆前移 / 侧跨 / 下沉」幅度外置 ----
   * 旧版硬编码 0.17 / 0.14 / 0.05，重击时骨盆推得过远，配合受击的上半身位移
   * 会出现「身体离开腿」。收敛后由 IK 把脚钉在地面，跨步变成「脚落地 + 身体前移」。 */
  /** 挥击跨步骨盆前移（m） */
  stepReach: number;
  /** 挥击跨步骨盆左右交替侧移（m） */
  stepSideReach: number;
  /** 挥击跨步重心下沉（m） */
  stepDipReach: number;
  /** 大剑重击额外收敛系数 0..1（含旋身角），避免大幅抡剑时身体脱节 */
  heavyScale: number;
};

/**
 * 跳跃 / 落地的程序化蓄力缓冲（squash & absorb）：
 * 只叠加关节与重心姿态，绝不写 character.position / velocity（跳跃驱动完全不变）。
 * 触发由表现层检测 grounded 上升/下降沿，进度用 Core 的 world.time 计时，
 * 因此暂停、时间缩放、单步推进都与逻辑同步，也不会引入本地时间累积。
 */
export type LandingViewConfig = {
  /** 总开关，关闭后完全不叠加缓冲 */
  enabled: boolean;
  /** 落地缓冲总时长（秒）：快速下压 → 缓慢回弹 → 归零 */
  duration: number;
  /** 下压段占总时长的比例 0.05..0.9（越小越「脆」，越大越「软」） */
  compressRatio: number;
  /** 重心下沉深度（米，上半身） */
  crouchDepth: number;
  /** 屈膝角（rad） */
  kneeBend: number;
  /** 髋前倾补偿（rad），让脚大致留在原地而不是被屈膝抬走 */
  hipPitch: number;
  /** 上半身前倾（rad） */
  upperPitch: number;
  /** 手臂收拢（rad） */
  armTuck: number;
  /** 下盘重心下沉相对上半身的比例 0..1 */
  lowerScale: number;
  /** 冲击速度饱和值（m/s）：|落地前 vy| 达到该值时缓冲强度为 1 */
  impactSpeed: number;
  /** 最小缓冲强度 0..1：小跳 / 走下台阶也有一点可见的蓄力 */
  minScale: number;
  /** 起跳预备下蹲强度倍率 0..1（0 = 关闭，只做落地缓冲） */
  jumpAnticipation: number;
  /** 起跳预备时长（秒） */
  anticipationDuration: number;
};

/**
 * v9s.33 · 脊柱分段（腰 / 胸 / 颈）。
 *
 * 旧骨架只有一整段 `upper`（绕腰旋转），大幅挥击时所有扭转都堆在腰上，
 * 瘦高体型读起来像一根棍在转。开启后把同一份「躯干总角」按权重分配到两段：
 * 腰段（upper）与胸段（新增 chest 节点，肩 / 头挂在它下面），世界朝向不变。
 *
 * 颈段只做**俯仰稳定**：上半身前倾 / 后仰时，颈部反向吃掉一小部分，
 * 让头保持更直立。扭转不交给颈段 —— 那属于 gaze（headYaw）的职责。
 */
export type SpineViewConfig = {
  enabled: boolean;
  /** 腰段占比 0..1（与 chest 归一化后使用） */
  waist: number;
  /** 胸段占比 0..1 */
  chest: number;
  /** 颈段俯仰补偿 0..1：头相对躯干反向旋转的比例 */
  neck: number;
  /** 胸段枢轴高度（相对躯干高度 0..1）；越大，弯折点越靠上 */
  chestPivot: number;
};

export type ProgramAnimViewConfig = {
  attack: AttackPoseViewConfig;
  /** v8d：攻击跨步的等效驱动与姿态幅度（两条下半身路径共用） */
  stride: AttackStrideViewConfig;
  landing: LandingViewConfig;
  /** v9s.22：四肢 squash & stretch（纯表现，可整体关闭） */
  stretch: StretchViewConfig;
  /** v9s.22：挥击拖尾（纯表现，可整体关闭） */
  trail: TrailViewConfig;
  /** v9s.23：近战挥击的身体 / 肩部幅度（纯表现，可整体关闭） */
  swing?: SwingPoseViewConfig;
  /** v9s.32：各武器的待机 / 移动上半身姿态（纯表现，可整体关闭） */
  stance?: Record<string, StanceViewConfig>;
  /** v9s.33：脊柱分段（缺省 / enabled=false 时保持单段 upper，逐帧与旧版一致） */
  spine?: SpineViewConfig;
};

/**
 * v9s.32 · 一把武器的「持械待机 / 移动」上半身姿态。
 *
 * 旧版所有武器在 idle / 行走时都套用同一条程序化摆臂：剑盾、双剑、大剑、法杖、弓
 * 的手臂角度完全一样，只换手里的模型。真实的持械待机至少有三件事不同：
 *
 * 1. **持械臂的基准角**：举盾时左臂前架、双刀时两臂外张、大剑时双手收在身前；
 * 2. **摆臂幅度**：双手重武器几乎不摆臂，短剑会跟着步伐自然摆动；
 * 3. **躯干朝向**：剑盾侧身站、双刀正面对敌，躯干扭转不同。
 *
 * 这些量都写成「相对步态基准的偏移」，在攻击时由挥击剪辑整体覆盖（交叉淡入淡出），
 * 因此不会与连击姿态打架。角度单位 rad，刀刃仰角用度（与挥击数据同一口径）。
 */
export type StanceViewConfig = {
  /** 摆臂倍率（1 = 与徒手一致；双手重武器 0.4~0.6 读起来更稳） */
  armSwing?: number;
  /** 主手（右手）偏移；pitch 负 = 抬到身前，roll 负 = 向体侧外张（右手） */
  armR?: StanceArmOffset;
  /** 副手（左手）偏移；roll 正 = 向体侧外张（左手） */
  armL?: StanceArmOffset;
  /** 躯干扭转（rad，+ = 转向角色右侧 / 持剑侧） */
  torsoYaw?: number;
  /** 躯干前倾（rad，+ = 低头压肩） */
  torsoPitch?: number;
  /** 主手刀身世界仰角偏移（度，+ = 刀尖抬高；只影响非攻击帧） */
  bladePitchDeg?: number;
  /** 副手刀身世界仰角偏移（度） */
  bladePitchOffDeg?: number;
  /** 切换到该姿态的过渡时长（s，缺省 0.22） */
  blend?: number;
};

export type StanceArmOffset = {
  pitch?: number;
  yaw?: number;
  roll?: number;
  /** 肘部俯仰偏移（负 = 向前屈肘） */
  elbow?: number;
};

/**
 * v9s.23 · 近战挥击的「身体 / 肩部」幅度。
 *
 * 旧版近战只写手臂俯仰 + 一点 upper.rotation.y，躯干 / 骨盆 / 重心几乎不动，
 * 观感是「胳膊在原地比划」；而且 shoulder.position 是常量，手臂抬到头顶时
 * 肩点还钉在躯干侧面，像装在支架上。
 *
 * 这一层把「一段挥击」的关键帧（起手 / 命中）解成躯干扭转、前后倾、侧倾、
 * 骨盆重心偏移与肩部（上臂根部）位移，手臂轨迹由同一份数据给出。
 * 三段方向（右→左 / 左→右 / 举顶下劈）也在这里定义，见 `presentation/swing-pose.ts`。
 */
/**
 * v9s.25 · 一条连击段引用：指向一条剪辑，可覆写主挥的手与幅度。
 *
 * 用对象而不是裸字符串，是为了让「双剑第二段换成左手挥」这种差异只写在数据里，
 * 不必复制一整条剪辑。
 */
export type SwingClipRef = {
  /** 剪辑 id（`clips` 里的键） */
  clip: string;
  /** 覆写主挥手（缺省用剪辑自己的 lead / R） */
  lead?: 'R' | 'L';
  /** 覆写本段幅度倍率（缺省用 weaponScale） */
  scale?: number;
  /**
   * v9s.31 · 覆写本段的段间混合时长（秒）。
   *
   * 缺省由「两段姿态差 / 目标角速度」自动算（见 `autoSegBlend`）：姿态差小的快刀
   * 混合更短（不黏），姿态差大的重击混合更长（不硬切）。只有特殊段才需要手写。
   */
  blend?: number;
};

export type SwingPoseViewConfig = {
  enabled: boolean;
  /** 躯干 / 骨盆幅度总倍率（拉 0 可 A/B 对照「只有手臂在动」） */
  bodyScale: number;
  /** 肩部抬升上限（m） */
  shoulderLift: number;
  /** 肩部前送上限（m） */
  shoulderPush: number;
  /** 双手武器攻击时两肩向中线内收（m） */
  shoulderIn: number;
  /** 段间姿态过渡时长（s）：上段收势 → 下段起手不再是单帧跳变 */
  segBlend: number;
  /**
   * v9s.31 · 段间混合的自动时长（按「两段姿态差」映射到本段预算）。
   *
   * 固定 0.1s 的问题：双剑快攻里 0.1s 占整段近一半，连击发黏；
   * 大剑重击姿态差很大，0.1s 内要跨 200°，读起来是硬切。
   * 现在 `segBlend` 退化为「第一段没有来源时的兜底」，实际时长按：
   *   k = clamp(distance / segBlendRef, 0, 1)
   *   span = segBlendMin + (段预算 − segBlendMin) · k
   * 姿态差小的快刀落在下限附近，差大的接近段预算，中间连续过渡。
   */
  segBlendRef?: number;
  /** 自动混合时长下限（s，缺省 0.03）：再快也要有 2 帧，否则就是硬切 */
  segBlendMin?: number;
  /** 自动混合时长上限（s，缺省 0.14）：再大的姿态差也不能拖过 next 的前摇 */
  segBlendMax?: number;
  /**
   * v9s.29 · 进入战斗姿态的淡入时长（s，缺省 0.1）。
   *
   * 待机 → 起手原本是同一帧整体换姿势（「啪」地跳帧）。这里用交叉淡入淡出：
   * 每帧记录「若不打这一击会是什么姿态」，再把战斗姿态按权重混合上去，
   * 起手 0.1s 淡入、收招 0.16s 淡出，两端都不会有单帧跳变。
   */
  poseIn?: number;
  /** v9s.29 · 退出战斗姿态的淡出时长（s，缺省 0.16）。 */
  poseOut?: number;
  /** 各武器幅度倍率（大剑最夸张，短剑收敛） */
  weaponScale: Record<string, number>;
  /**
   * v9s.25：技能动作数据 —— 每把武器的三段（或 N 段）剪辑 id。
   *
   * 新增技能 / 加段 / 换动作全部只改这里 + `clips`：代码只负责采样与写骨骼。
   * 段数不要求是 3，数组多长就循环多长（comboIndex 由 Core 的 comboCount 决定）。
   */
  combo?: Record<string, Array<SwingClipRef | string>>;
  /** v9s.25：剪辑库（id → 语义通道关键帧），见 `core/pose-clip.ts` */
  clips?: Record<string, PoseClip>;
};


/**
 * v9s.22 · 挥击拖尾（刀光）参数。
 *
 * 打击感来自**轨迹**而不是姿势：同一套攻击关键帧，有刀光和没刀光判若两作。
 * 拖尾按「刃尖速度超过阈值」才记录，静止时不会常亮；采样点按年龄淡出，
 * 所以挥得越快轨迹越长、越亮。
 */
/**
 * v9s.22 · 命中定格（hitstop）。
 *
 * 格斗游戏里最便宜、最有效的一招：命中瞬间把角色动画冻 50~90ms，Core 照常推进。
 * 冻结期间画面静止一瞬，玩家会把它读成「打实了」，冲击力成倍放大，
 * 而且完全不用改物理、判定或任何 Core 逻辑。
 */
export type HitstopViewConfig = {
  enabled: boolean;
  /** 冻结时长（秒），60fps 下 3~5 帧最自然 */
  duration: number;
};

/**
 * v9s.37 · 击地冲击的表现层配置（纯观感，不改判定）。
 *
 * 判定在 Core（`WeaponProfile.groundSlam`），这里只管「砸下去地上要有反应」：
 * 一圈贴地扩散的尘环 + 一次比普通命中更重的镜头下压。
 */
export type GroundSlamViewConfig = {
  enabled: boolean;
  /** 尘环颜色 */
  color: string;
  /** 单圈寿命（秒） */
  duration: number;
  /** 第二圈延迟（秒），错开一点才有「扩散」而不是「一起亮」 */
  delay: number;
  /** 外圈相对判定半径的倍数 */
  outerScale: number;
  /** 镜头震动强度（0~1.5） */
  shake: number;
};

export type TrailViewConfig = {
  enabled: boolean;
  /** 最多采样点数（≈ 帧数），越大轨迹越长 */
  maxSamples: number;
  /** 相邻采样点的最小世界距离（m），避免静止时堆点 */
  minStep: number;
  /** 单个采样点存活时长（秒） */
  life: number;
  /** 触发拖尾的最低刃尖速度（m/s） */
  minSpeed: number;
  /** 颜色（十六进制） */
  color: string;
  /** 亮度倍率（加色混合） */
  intensity: number;
  /** 刃尖额外提亮 0..1 */
  tipBoost: number;
};

/**
 * v9s.22 · 四肢伸缩 / 挤压（squash & stretch）。
 *
 * 现状的痛点是「动作幅度不够夸张」：方块人手臂只有 0.36 m（比肩宽 0.6 还短），
 * 挥击看上去就是在原地比划。业界 2D 动画靠「拉长、压扁」把力量感做出来
 * （Disney 十二原则里的 squash & stretch），3D 里就是给骨骼段做非均匀缩放。
 *
 * 这里刻意**不做**无限伸缩：骨骼变长会把体素拉成面条，且手的位置会和碰撞盒脱节。
 * 只允许「短促、峰值小、带体积补偿」的形变 —— 拉伸时自动收细、压扁时自动变粗，
 * 模拟橡皮的泊松效应，观感才不会廉价。
 */
export type StretchViewConfig = {
  /** 总开关：false = 所有 scale 恒为 1（精确回到旧姿态） */
  enabled: boolean;
  /** 挥出瞬间手臂沿骨长的峰值（1 = 不拉长；1.15 = 峰值拉长 15%） */
  swingArm: number;
  /** 蓄势 / 收招时手臂的压缩（<1 变短变粗，例如 0.94） */
  chargeArm: number;
  /** 跑动时腿部沿骨长的峰值（1 = 不拉长） */
  runLeg: number;
  /** 躯干随挥击的拉伸幅度，相对手臂的增益（0 = 躯干不参与） */
  torsoGain: number;
  /** 命中瞬间的整体挤压量（0..1，0 = 不做命中 squash） */
  impactSquash: number;
  /** 撞击脉冲的衰减速率（1/s），约 1/decay 秒回到原状 */
  impactDecay: number;
  /**
   * 体积补偿指数：along^-this 作为垂直方向缩放。
   * 0.5 ≈ 体积守恒（拉长就变细）；0 = 完全不变粗细（真正的「拉长条」）；
   * 1.5 = 反向夸张（拉长还变粗，卡通感更强）。
   */
  volumeExp: number;
  /** scale 的指数平滑速率（1/s），避免姿态跳变时手臂「啪」地弹一下 */
  smoothing: number;
};

export type OrientationViewConfig = {
  /** 下盘朝「移动方向」带转的比例（0 = 完全跟身体，1 = 完全跟移动方向）。
   *  v8b 起只是幅度系数，配合 hipYawMaxDeg 限幅，由连续侧向占比驱动、指数平滑，
   *  不再用 wrapAngle(moveYaw - bodyYaw)（±π 会翻转，引导/后退时下盘跳变）。 */
  legYawScale: number;
  /** 下盘偏航的最大角度（度），限幅避免大角度转身带来的朝向突兀 */
  hipYawMaxDeg: number;
  /** 下盘偏航的指数平滑速率（1/s，越大越快），帧率无关 */
  hipYawSmoothing: number;
  /** 头部枢轴相对身体顶部的高度 */
  headPivotHeight: number;
};

/**
 * 移动惯性带来的身体倾斜（纯表现）：启动前倾、刹车后仰、绕圈侧倾。
 * 由表现层按速度/朝向的帧差派生，不进入 Core 状态，不影响确定性与快照。
 */
export type LeanViewConfig = {
  /** 前后倾斜：加速度在身体前方投影的增益（弧度 per m/s²） */
  accelGain: number;
  /** 侧倾：转向角速度 × 速度 的增益（弧度 per (rad/s · m/s)） */
  turnGain: number;
  /** 前后 / 侧向最大倾角（度） */
  maxForwardDeg: number;
  maxSideDeg: number;
  /** 指数平滑速率（1/s），越大跟随越紧 */
  smoothing: number;
  /* ---- v8g：惯性倾斜不再只写上半身 ---- */
  /** 盆骨随惯性倾斜的比例 0..1（相对上半身，明显小于 1，避免整个人被掀翻） */
  pelvisTiltGain: number;
  /** 盆骨沿倾斜方向的小幅重心平移（m / rad） */
  pelvisShift: number;
  /** 移动时身体略微下沉的最大深度（m），按平滑后的速度比例线性取用 */
  moveCrouch: number;
  /** 下沉量的指数平滑速率（1/s） */
  crouchSmoothing: number;
};

/**
 * 两骨 IK 足部锚定（v8g，纯表现层）。
 * 在此之前实验台只有 FK 与解析摆腿，没有 IK；程序动画推走骨盆时脚只能跟着飘。
 * 这里把「脚的落点」作为世界锚点，用两骨 IK 反解髋/膝角，把额外骨盆位移吸收进腿里。
 * 所有参数纯数值、Core 零改动，enabled=false 可精确回到旧 FK 姿态做 A/B 对照。
 */
export type IKViewConfig = {
  /** 总开关：false = 完全不跑 IK（旧行为） */
  enabled: boolean;
  /** 足部锚定权重 0..1：1 = 脚完全钉在步态落点，0 = 完全交给 FK */
  weight: number;
  /** 攻击期间权重倍率 0..1：留一点跨步自由度，避免挥击时脚被钉死 */
  attackScale: number;
  /** 单帧最大角度修正（度），防止目标突变造成抽搐 */
  maxCorrectionDeg: number;
};

/** 武器挂点握持姿态（度）：让剑从「贴手臂竖直向上」改成「斜向前伸出、刀锋朝外」。 */
export type WeaponMountConfig = {
  swordPitchDeg: number;
  swordYawDeg: number;
  greatswordPitchDeg: number;
  greatswordYawDeg: number;
  staffPitchDeg: number;
  shieldPitchDeg: number;
  bowPitchDeg: number;
  /**
   * v9s.29 · 握刀外撇角（度，+ = 刀尖偏向角色右侧）。
   *
   * 只有俯仰时刀身与小臂共线（「手臂加长了一截」）；给 10~18° 外撇后刀与小臂成夹角，
   * 既更像握着刀，也更容易读出刀身朝向。只影响刀尖水平指向，不改刃面。
   */
  swordCantDeg?: number;
  /** v9s.29 · 大剑外撇角（度）。大剑更重、握距更宽，略小于单手剑。 */
  greatswordCantDeg?: number;

  /* ---- v9s.22：双手握持（副手 IK） ---- */
  /**
   * 主手武器向身体中线内收的距离（m）。只对双手武器生效。
   * 方块人的肩距 0.6 而单臂只有 0.42，武器挂在体外侧时副手永远够不到，
   * 所以双手武器必须整体往中线挪一点 —— 这是「双手拿不到」的物理前提。
   */
  twoHandInsetX: number;
  /**
   * 副握点在武器局部 Y 轴上的位置（负 = 柄下段，向手后方）。
   * 越小（越负）离主手越远，越考验副手臂展。
   */
  twoHandGripY: number;
  /**
   * 副手够不到时允许的臂长拉伸上限（倍）。1 = 不拉伸（手会停在臂展处指向刀柄）。
   * 超过 1.35 会明显「拉面条」，建议 1.15~1.3。
   */
  twoHandMaxStretch: number;
  /**
   * v9s.24：够不到时副手允许松到的最低握持权重（1 = 永不松手）。
   *
   * 「全程握死」是靠把臂长拉长 1.3 倍换来的，代价是举顶时那一下胳膊明显变细变长。
   * 允许在够不到的阶段松到 0.45~0.6，左手会停在柄附近「虚握」而不是被拉成面条 ——
   * 真实挥大剑时副手本来就会在过顶那一下松开一点再握回去。
   */
  twoHandMinGrip: number;
  /** 开始松手的臂展比（dist / 单臂长）。1.0 = 一伸直就松，1.3 = 拉到极限才松。 */
  twoHandGripStart: number;
  /**
   * v9s.24：副握点沿柄滑动的跟随速率（1/s）。
   *
   * 够不到时握点会往主手方向滑。旧版是帧内一次性迭代到目标值，于是手臂姿态一动，
   * 握点就在两帧之间从柄尾瞬移到护手（「左手跳了一下」）。给一个一阶跟随，
   * 读起来才是「手沿柄推下去」。0 = 瞬移（旧行为）。
   */
  twoHandSlideRate: number;
};

/**
 * v9s.24 · 腕部滞后（「武器不再焊在手上」）。
 *
 * 旧结构是 hand 直接挂 mount，武器相对手只有 mountPitch 一个角度，且是整段线性插值 ——
 * 手臂怎么动剑就怎么动，读起来像「剑长在前臂延长线上」。真实握剑时肩、肘、腕是
 * 三个串联的自由度，腕部会因为惯性**滞后**于手臂：挥出时剑落后，收势时再甩回来。
 * 这一层把那个滞后量解出来，写在 hand 与 mount 之间新插的 wrist 节点上。
 *
 * 纯表现层：只读本帧已写好的手臂 / 躯干角度做差分，不参与 Core，不进快照。
 */
export type WeaponWristViewConfig = {
  enabled: boolean;
  /** 臂部俯仰角速度 → 腕部滞后角（rad per rad/s）。0.022 ≈ 20 rad/s 时滞后 25° */
  lag: number;
  /** 腕部滞后角上限（rad），防止极快挥击时手腕折断 */
  maxAngle: number;
  /** 滞后角的一阶平滑速率（1/s）：越小越「软」，越大越跟手 */
  rate: number;
  /** 躯干扭转角速度 → 腕部横向甩动（rad per rad/s） */
  twistLag: number;
  /** 横向甩动上限（rad） */
  maxTwist: number;
  /**
   * 跑动时剑的后仰角（rad，满速时）。
   *
   * 这一项**不受攻击权重缩放** —— 它要解决的正是「非攻击状态下剑像焊在手上」：
   * 拿着重物跑动时，剑会因为惯性落在手后面一点，角度随速度增大。
   * 0.10 rad ≈ 5.7°，够读出「有重量」，又不至于看起来像手没握住。
   */
  runDrag: number;
};

/** 受击动画表现参数（弧度 / 强度），只影响观感。 */
/**
 * 一套命中部位的受击姿态参数（v8f）。
 * 全部是「每单位力度」的系数，实际幅度 = lean(type) × pulse × 该系数，
 * 因此力度与部位正交：同一拳打在腹 / 肩可以分别热调而不互相牵连。
 * 纯数值，Unity / Godot 可直接映射到骨骼关节目标值。
 */
export type HurtPoseProfile = {
  /** 上半身朝受击方向的前后倾斜倍率（绕腰） */
  upperPitch: number;
  /** 上半身侧倾倍率（绕腰，随命中侧向分量） */
  upperRoll: number;
  /** 肩部扭转倍率（绕腰 Y 轴，打肩时明显） */
  upperYaw: number;
  /** 躯干前屈（不随方向的附加量，正 = 含胸蜷缩，打腹时明显） */
  fold: number;
  /** 上半身相对骨盆朝受击方向的位移（身体反应主幅度，应明显大于 comShift） */
  shift: number;
  /** 整体下沉（骨盆下移） */
  drop: number;
  /** 屁股向后（局部 -Z，固定方向，不与受击方向挂钩） */
  back: number;
  /** 屈膝量（两腿相同，不随方向） */
  knee: number;
  /** 髋前倾（让脚大体留在原地） */
  hip: number;
  /** 手臂叠加：正 = 前抬收拢护住，负 = 被甩开向后 / 外扬 */
  arm: number;
};

export type HurtViewConfig = {
  flashColor: string;
  flashStrength: number;
  /** 三种受击的力度（弧度，同时作为旧版最大后仰角与分层姿态的总幅度） */
  leanLight: number;
  leanHeavy: number;
  leanKnock: number;
  /** v8f 分层受击总开关：false = 回到「脚底锚定、整体刚性倾斜」的旧姿态，用于 A/B 对照 */
  enabled: boolean;
  /** 命中部位映射：0 = 腹部 / 低，1 = 肩部 / 高；按受击类型查表 */
  hitHeight: { light: number; heavy: number; knock: number };
  /** 强制部位（0..1）：-1 = 按类型自动。调试面板可直接对比「打肩 vs 打腹」 */
  forceHitHeight: number;
  /** 冲击→回弹分段比例：前段快速到位、后段缓慢回正，两端值与导数均为 0 */
  pulseRatio: number;
  /** 整体重心沿受击方向的偏移系数（必须明显小于 profile.shift） */
  comShift: number;
  /** 下盘跟随骨盆后坐 / 下沉的比例（1 = 完全跟随，0 = 脚完全留原地） */
  lowerScale: number;
  /* ---- v8g：上半身相对骨盆的位移限幅 ----
   * 旧版 shift=0.26/0.34 在 knock（大剑重击）时把整个上半身平移约 0.28m，
   * 躯干下沿直接离开骨盆，观感就是「身体离开腿」。诊断量 pose.upperShift 不变，
   * 只在写节点时缩放 + 限幅，保证 comShift / upperShift 的比例语义仍可断言。 */
  /** 上半身相对骨盆位移的缩放 0..1 */
  upperShiftScale: number;
  /** 上半身相对骨盆位移的单轴上限（m） */
  maxUpperShift: number;
  /** 腹部（低部位）姿态：含胸蜷缩、下沉与屈膝多、手臂收拢 */
  abdomen: HurtPoseProfile;
  /** 肩部（高部位）姿态：侧倾与扭转多、下沉屈膝少、手臂被甩开 */
  shoulder: HurtPoseProfile;
};

/**
 * v9s.9 · 脚下指示半环（玩家 / 假人同构，纯观感）。
 *
 * 环贴地、半透明、两端渐隐；弧心朝屏幕下方（相机侧）。假人默认半环，
 * 被锁定（选中）时弧长涨到 3/4 环、环带加厚、提亮并叠一层外发光；
 * 颜色由 Core 的威胁读数决定：中立单位冷色，敌对单位低威胁黄 → 高威胁红。
 *
 * v9s.10：尺寸不再写死米数，而是按角色体型（`view.voxel.bodyWidth`）比例推导，
 * 换体型 / 换角色时环自动跟着缩放，不会出现「环比人还宽」。
 */
export type GroundRingViewConfig = {
  /** 玩家环半径 = `bodyWidth × 0.5 × 该系数`（2.3 → 约 2.3 个半身宽） */
  playerRadiusFactor: number;
  /** 假人环半径 = `bodyWidth × 0.5 × 该系数` */
  dummyRadiusFactor: number;
  /** 环带宽度 = `bodyWidth × 该系数`（0.16 → 约 3.5cm） */
  thicknessFactor: number;
  /** 默认弧长（度），180 = 半环 */
  arcDeg: number;
  /** 选中弧长（度），270 = 3/4 环 */
  selectedArcDeg: number;
  /** 未选中透明度（低，降低常驻噪音） */
  opacity: number;
  /** 玩家环基础透明度（应高于未选中假人环：自己是稳定参照） */
  playerOpacity: number;
  /** 选中透明度（提高，靠亮度拉开差距） */
  selectedOpacity: number;
  /** 选中放大倍率（略微，主要靠加厚 / 外发光区分） */
  selectedScale: number;
  /** 选中时环带加厚倍率 */
  selectedThicknessScale: number;
  /** 两端渐变占整段弧的比例（0..0.5） */
  edgeFade: number;
  /** 玩家环颜色（中性，不随威胁变化） */
  playerColor: string;
  /** 中立单位（idle / wander）环颜色 */
  neutralColor: string;
  /** 敌对单位低威胁色 */
  lowThreatColor: string;
  /** 敌对单位高威胁色 */
  highThreatColor: string;
  /** 选中外发光半径倍率（相对假人环） */
  haloRadiusFactor: number;
  /** 选中外发光环带宽度倍率（相对基础厚度） */
  haloThicknessFactor: number;
  /** 选中外发光透明度 */
  haloOpacity: number;
  /** 外发光淡入时间常数（秒）：越小起得越快 */
  haloFadeInSec: number;
  /** 外发光淡出时间常数（秒）：刻意比淡入慢，光「收回去」才自然 */
  haloFadeOutSec: number;

  /* ---- v9s.11：环上的信息层 ---- */

  /** 进度弧半径倍率（相对玩家环，1.24 → 落在主环外侧一圈） */
  meterRadiusFactor: number;
  /** 进度弧环带厚度倍率（相对基础厚度） */
  meterThicknessFactor: number;
  /** 进度弧透明度 */
  meterOpacity: number;
  /** 蓄力（剑 / 弓）进度色 */
  meterColorCharge: string;
  /** 法杖引导进度色 */
  meterColorChannel: string;
  /** 冲刺 / 闪现冷却恢复色 */
  meterColorCooldown: string;
  /** 假人起手预警弧半径倍率（相对假人环） */
  warnRadiusFactor: number;
  /** 假人起手预警弧厚度倍率 */
  warnThicknessFactor: number;
  /** 假人起手预警弧透明度 */
  warnOpacity: number;
  /** 假人起手预警色 */
  warnColor: string;
  /** AoE 范围圈透明度（内部填充自动取 26%） */
  areaOpacity: number;
  /** AoE 范围圈从中心展开到满半径的时长（秒） */
  areaExpandSec: number;
  /** 冲锋落点圈透明度 */
  landingOpacity: number;
};

export type ColorConfig = {
  ground: string;
  step: string;
  wall: string;
  lintel: string;
  obstacle: string;
  body: string;
  head: string;
  limb: string;
  shoe: string;
  blade: string;
  bladeEdge: string;
  metal: string;
  wood: string;
  glow: string;
};

export type ViewConfig = {
  camera: CameraConfig;
  smartCamera: SmartCameraViewConfig;
  /** v8e：双指捏合 / 滚轮 / 快捷键缩放相机（纯表现层） */
  zoom: CameraZoomViewConfig;
  joystick: JoystickConfig;
  showGrid: boolean;
  showColliders: boolean;
  voxel: VoxelConfig;
  /** v9s.30：可切换的体型预设（键 = id，顺序即切换顺序）；缺省只用 voxel */
  bodyTypes?: Record<string, BodyTypeConfig>;
  orientation: OrientationViewConfig;
  gait: GaitViewConfig;
  /** v8c：攻击动画下半身权重过滤 + 跳跃 / 落地程序化蓄力缓冲 */
  animation: ProgramAnimViewConfig;
  weaponMount: WeaponMountConfig;
  /** v9s.24：腕部滞后（武器相对手的自由度） */
  weaponWrist: WeaponWristViewConfig;
  lean: LeanViewConfig;
  /** v8g：两骨 IK 足部锚定（玩家 / 假人同构） */
  ik: IKViewConfig;
  /** v9a：派生招特效与举盾前撞姿态参数 */
  links: LinkViewConfig;
  dash: DashViewConfig;
  hurt: HurtViewConfig;
  /** v9s.9：脚下指示半环（玩家 / 假人） */
  groundRing: GroundRingViewConfig;
  /** v9s.15：测试工位地面标识 / 浮动标牌（纯表现层，可整体关闭看画面） */
  lab: LabViewConfig;
  /** v9s.16：箭矢 / 奥术飞弹 / 斩击弧的实体尺寸与发光参数（纯观感） */
  projectiles: ProjectileViewConfig;
  /** v9s.22：挥击拖尾（刀光） */
  weaponTrail: TrailViewConfig;
  /** v9s.22：命中定格（纯表现，只冻角色姿态，不冻 Core） */
  hitstop: HitstopViewConfig;
  /** v9s.37 · 击地冲击（大剑第三击）的尘环 / 震动 */
  groundSlam: GroundSlamViewConfig;
  /** v9s.33：动态平衡量化 / 自动配重（纯表现，只读骨架，不写 Core） */
  balance?: BalanceViewConfig;
  /**
   * v9s.34：定步长渲染插值（纯表现层驱动策略）。
   *
   * Core 固定 60Hz 步进、渲染按刷新率跑，120Hz 屏幕与慢放下会出现「同一姿态连续渲染多帧」的抖动；
   * 开启后在两个模拟步之间按 `alpha` 插值姿态输入。关掉即精确回到旧行为（A/B 用）。
   *
   * v9s.35：`yawSmoothMs` = 渲染根节点朝向的指数低通时间常数（毫秒，0 = 关闭）。
   * 插值只让位置一阶连续，朝向的角速度仍是阶梯 —— 慢放时肩 / 手 / 武器在 0.4~0.8m
   * 半径上会把速度突跳放大成「一顿一顿」。默认 35ms ≈ 半帧，代价是朝向晚约半帧到位。
   */
  renderInterp?: { enabled: boolean; yawSmoothMs?: number };
  colors: ColorConfig;
  dummies: DummyViewConfig;
};

/**
 * v9s.33 · 动态平衡量化。
 *
 * 把角色当质点组算 COM / 捕获点（XCoM），再投影到两脚支撑矩形上打分。
 * `autoCounter` 打开时，出界方向那一侧的手臂会按闭式解外展「配重」，
 * 幅度受 `maxCounterDeg` 限制 —— 只是补几度，不改动画数据。
 */
export type BalanceViewConfig = {
  enabled: boolean;
  /** 反应时间（秒）：越大，XCoM 把身体动量外推得越远（越保守） */
  reactionTime: number;
  /** 重力加速度，默认 9.81 */
  gravity: number;
  /** 质心偏出时是否自动修正（挪骨盆 / 重心） */
  autoCounter: boolean;
  /** 重心修正上限（米，身体局部 X）；越小越保守 */
  maxShift: number;
  /** 修正的平滑速率（1/s） */
  counterRate: number;
  /**
   * v9s.34：前馈预测时长（秒）。用「侧向速度 × 该时长」把偏移外推，
   * 抵消闭环（读脚位 → 挪骨盆 → 下帧脚位变）的相位滞后。
   * 0 = 精确回到 v9s.33 的纯反馈行为（A/B 用）。
   */
  predLead?: number;
  /** v9s.34：负载加权的速率倍率上限 —— 偏得越多、修正越急，避免「慢慢挪」追不上 */
  counterBoost?: number;
};

/**
 * v9s.16：投射物与斩击特效的表现参数。
 *
 * 反馈是「箭 / 飞弹经常看不见，只在某条地上的线上看到一点光过去」——根因是原来的箭
 * 只有 3.5cm 粗的一根盒子，正对镜头飞行时投影成 1px 的线；飞弹则是一个没有光晕的
 * 二十面体，远看只是一个点。这里把「实体尺寸」与「镜头朝向光晕 / 拖尾」都外置成参数，
 * 观感靠 `glowSize`（Sprite 恒面向镜头）保证任意角度都有可见面积，靠拖尾读出速度方向。
 * 全部纯表现层：不进 Core，不影响命中判定（命中仍是 `abilities.projectiles` 的圆形相交）。
 */
export type ProjectileViewConfig = {
  /** 箭杆颜色 / 箭头与尾羽颜色 / 拖尾颜色 */
  arrowColor: string;
  arrowHeadColor: string;
  arrowTrailColor: string;
  /** 箭杆长度与粗细（米）。长度 0.72 ≈ 一个身位，远看能读出「一支箭」而不是一个点 */
  arrowLength: number;
  arrowWidth: number;
  /** 箭头长度（米） */
  arrowHeadSize: number;
  /** 恒面向镜头的柔光直径（米）：这是「任何角度都看得见」的兜底 */
  arrowGlowSize: number;
  /** 拖尾长度（米）与不透明度 */
  trailLength: number;
  trailOpacity: number;
  /** 飞弹颜色 / 光晕颜色 */
  boltColor: string;
  boltGlowColor: string;
  /** 菱形飞弹的三轴比例（沿飞行方向为 Z）：横向要窄、纵向要长，才读得出「梭形」 */
  boltShapeX: number;
  boltShapeY: number;
  boltShapeZ: number;
  /** 飞弹光晕直径 = 光晕倍数 × 飞弹半径 */
  boltGlowScale: number;
  /** 飞弹拖尾长度 = 倍数 × 飞弹半径 */
  boltTrailScale: number;
  /**
   * v9s.23：旧斩击弧是否显示。
   *
   * v6a 时它是唯一能表达「挥了一刀」的特效；v9s.22 加了真实的刃尖拖尾之后，
   * 两者叠在一起就是「凭空出现一个固定朝向的半圆 + 一条跟剑走的划痕」，
   * 而且半圆半径 1.3m、不透明度 0.7，在近距镜头下直接把角色挡住。
   * 默认关闭，保留开关做 A/B。
   */
  slashEnabled: boolean;
  /** 斩击弧管径（米）：原 0.045 在俯视下只有 1~2px */
  slashThickness: number;
  /** 斩击弧外层加色光晕的不透明度（0 = 关闭） */
  slashGlowOpacity: number;
};

export type LabViewConfig = {
  enabled: boolean;
  showLabels: boolean;
  padOpacity: number;
  /** 地面工位铭牌的字高（米） */
  labelTextHeight: number;
};

export type AppConfig = { core: CoreConfig; scene: SceneConfig; view: ViewConfig };

/** 输入意图：已经是世界空间方向，Core 不知道屏幕、相机、按键的存在。 */
export type Intents = {
  moveX: number;
  moveZ: number;
  jumpPressed: boolean;
  /** 冲刺按住：持续加速跑（基础手感，保留） */
  sprintHeld: boolean;
  /** 冲刺按下沿：触发一次翻滚 / 闪现（按当前武器分化） */
  sprintPressed: boolean;
  resetPressed: boolean;
  /** 攻击键按下沿：剑触发连击 / 法杖施法1 / 弓开始蓄力 */
  attackPressed: boolean;
  /** 攻击键按住：弓持续蓄力；剑类开启自动连击（每段停顿结束后自动接续） */
  attackHeld: boolean;
  /** 攻击键松开沿：弓释放 */
  attackReleased: boolean;
  /** 副技能按下沿：法杖施法2 */
  skill2Pressed: boolean;
  /** 0 = 不切换；1..5 对应 WEAPON_ORDER */
  weaponSlot: number;
  /** 0 = 无；1..N = 被点击的假人 id（由表现层射线拾取后填入） */
  dummyClickId: number;
  /** 攻击 / 技2 按钮拖拽产生的辅助瞄准方向（世界 XZ 单位向量，由输入层用相机地面基向量换算）。
   *  aimActive=false 表示无拖拽，动作朝向退回「锁定目标 > 移动 > 面朝向」。 */
  aimX: number;
  aimZ: number;
  aimActive: boolean;
};

export const EMPTY_INTENTS: Intents = {
  moveX: 0,
  moveZ: 0,
  jumpPressed: false,
  sprintHeld: false,
  sprintPressed: false,
  resetPressed: false,
  attackPressed: false,
  attackHeld: false,
  attackReleased: false,
  skill2Pressed: false,
  weaponSlot: 0,
  dummyClickId: 0,
  aimX: 0,
  aimZ: 0,
  aimActive: false,
};

export type EventType =
  | 'landed'
  | 'jumped'
  | 'stepUp'
  | 'blocked'
  | 'reset'
  | 'weapon-change'
  | 'attack-start'
  | 'attack-active'
  | 'attack-end'
  | 'combo-reset'
  | 'charge-start'
  | 'charge-release'
  /** 法杖引导奥术飞弹起手 / 结束 */
  | 'channel-start'
  | 'channel-end'
  /** 每发射一枚奥术飞弹，value = volleyId */
  | 'projectile-fire'
  /** v9s.17：一波齐射开始，value = 波次索引（0 起） */
  | 'arcane-wave'
  /** v9s.17：弓箭射出，value = 蓄力值 0..1 */
  | 'arrow-shot'
  /** v9s.17：箭命中假人（value = 假人 id）/ 落地（value = -1） */
  | 'arrow-land'
  /** 原地放置电环，value = ring id */
  | 'ring-place'
  /** 电环一次命中脉冲，value = ring id */
  | 'ring-pulse'
  | 'dummy-mode'
  | 'dummy-attack'
  /** 假人挥砍进入 active 帧（命中判定用），value = 假人 id */
  | 'dummy-hit'
  /** 玩家攻击命中假人，value = 假人 id */
  | 'hit'
  /** 假人挥砍命中玩家（无伤害，只驱动受击动画），value = 假人 id */
  | 'player-hurt'
  /** 冲刺：翻滚起手，value = dash.id */
  | 'roll'
  /** 冲刺：法杖闪现，value = dash.id */
  | 'blink'
  /** 冲刺冷却结束（可用于 HUD / 音效），value = 0 */
  | 'dash-ready'
  /** v9a：派生招起手，value = link.id */
  | 'link-start'
  /** v9a：派生招进入 active（命中帧开始），value = link.id */
  | 'link-active'
  /** v9a：派生招收势结束，value = link.id */
  | 'link-end'
  /** v9a：派生招命中一个目标，value = 目标假人 id */
  | 'link-hit'
  /** v9s.29：命中卡肉开始，value = 冻结时长（秒）。表现层据此触发镜头震动 / 音效 */
  | 'hitstop'
  /**
   * v9s.37：击地冲击，`value` = 冲击半径（米）。
   * 表现层据此生成地面尘环 / 强震；与 `hitstop` 一样是「一次性」事件。
   */
  | 'ground-slam'
  /**
   * v9s.31：关键帧事件（AnimNotify）。`name` 是事件名，`value` 是附带数值。
   *
   * 与上面「每个事件一个 type」不同：这里的 type 只有一种，语义全部在 name 里，
   * 因为通知是**数据驱动**的（加一个事件不该改 Core 的联合类型）。
   */
  | 'notify';

/** 显式事件队列（数组），对应 C# 的 List<GameEvent>，可跨语言比对。 */
export type GameEvent = {
  type: EventType;
  tick: number;
  x: number;
  y: number;
  z: number;
  /** 语义随事件类型而定：连击段 / 施法序号 / 蓄力值 / 武器槽位 / 假人 id */
  value: number;
  /** v9s.31：仅 `type='notify'` 时存在，关键帧事件名（`blade-air` / `foot-step` …） */
  name?: string;
};

export type CharacterState = {
  /** 脚底中心点 */
  position: Vec3;
  velocity: Vec3;
  /** 面朝向 / 目标朝向（弧度，atan2(x, z)）：攻击时锁定 attackFacing，平时跟随移动输入 */
  facing: number;
  /** 移动方向（atan2(vx, vz)），与身体朝向分离：可侧移 / 后退 */
  moveYaw: number;
  /** 身体朝向：指数平滑追随 facing，帧率无关，表现层用它转整个身体 */
  bodyYaw: number;
  /** 头部朝向：更快追随 facing 且相对身体限幅，表现「头先于身体转向目标」 */
  headYaw: number;
  /**
   * v9s.18：头部俯仰（弧度，+ = 抬头看高处目标）。
   * 接敌时看向目标的胸口高度，站在台阶下 / 打高台上的敌人时头会抬起来；
   * 表现层只负责把它转成 headPivot.rotation.x（取反）。
   */
  headPitch: number;
  /**
   * v9s.18：上半身俯仰（弧度，+ = 后仰 / 抬头）。
   * 恒为 headPitch 的一小部分（gaze.bodyPitchScale），且比头略滞后 ——
   * 让人是「整个人抬眼看」，而不是头单独在脖子上折。
   */
  bodyPitch: number;
  grounded: boolean;
  sprinting: boolean;
  gaitPhase: number;
  /**
   * v9e：当前步幅（米 / 一个完整步态周期），由 movement 每帧写入。
   * 表现层据此反推「脚应该前伸多远」= stride × reachRatio，使支撑相脚的
   * 世界位移恒为零（不打滑）。Core 不知道腿长，所以只给物理步幅，几何换算留给表现层。
   */
  stride: number;
  distance: number;
  coyoteTime: number;
  jumpBuffer: number;
};

export type ModuleFlags = {
  movement: boolean;
  pathfinding: boolean;
  combat: boolean;
  /** v9a：派生招模块独立开关，关闭后完全不产生派生招（窗口内攻击退回普通连击） */
  links: boolean;
  /** 法杖技能（引导 / 飞弹 / 电环）独立开关，关闭后完全冻结 */
  abilities: boolean;
  orientation: boolean;
  /** v9s：原地转身状态机独立开关，关闭后完全冻结（便于 A/B 对照纯插值转身） */
  turnInPlace: boolean;
  targeting: boolean;
  hits: boolean;
  separation: boolean;
  dash: boolean;
  camera: boolean;
  /** v9s.3：注视 / 威胁评估模块独立开关，关闭后完全冻结（便于 A/B 对照） */
  gaze: boolean;
  dummies: boolean;
};

export type World = {
  tick: number;
  time: number;
  rngState: number;
  config: CoreConfig;
  boxes: Box[];
  gridMeta: GridMeta;
  character: CharacterState;
  combat: CombatState;
  /** 法杖技能运行时（引导飞弹 / 电环），与近战状态机解耦（v7c #12） */
  abilities: AbilityState;
  /**
   * v9s.19：技能实例表（由 config.skills 归一化而来）。
   * 每个实例带 kind + 自己那份参数；dispatch 只看这张表，不再硬编码「法杖 = 奥术」。
   */
  skills: SkillRuntime[];
  /** 本帧外部附加速度（m/s），由战斗模块写入、移动模块消费。v9s.21 起语义收窄为「技能位移层」 */
  impulse: { x: number; z: number };
  /** 当前智能锁定的目标（每帧重算，攻击起手时读取） */
  targeting: TargetState;
  /** v9s：静止盯视触发的原地转身状态（plain data，随快照回放） */
  turnInPlace: TurnInPlaceState;
  /** 玩家受击状态（放在 World 而非 character，保持「假人不改 character」契约） */
  playerHurt: HurtState;
  /** 玩家累计命中假人的次数（无伤害，仅用于验收观察） */
  hitCount: number;
  /** 冲刺 / 闪避状态（翻滚或闪现），纯状态数据 */
  dash: DashState;
  /** 智能相机构图意图（Core 算出的确定性目标值），表现层做指数平滑后消费 */
  camera: CameraIntent;
  /** v9s.3：注视 / 威胁评估状态（plain data，随快照回放） */
  gaze: GazeState;
  /** v9a：玩家派生招运行时状态（与每个假人的 link 同构） */
  playerLink: LinkState;
  /**
   * v9s.17：弓箭实体（飞行 + 插住驻留）。
   * 放在 World 而不是 combat 里：它是**世界坐标的实体**，与玩家状态机解耦，
   * 也方便表现层按数组直读、复位时统一清空。
   */
  arrows: ArrowState[];
  /** 箭矢实例 id 自增（持久不倒退，复位也不清零） */
  arrowSeq: number;
  /** 测试假人，四种 AI 行为，纯状态数据 */
  dummies: DummyState[];
  /** 假人累计发起的攻击次数（无伤害，仅用于验收观察） */
  dummyAttackCount: number;
  events: GameEvent[];
  modules: ModuleFlags;
};

/* ---------------- 寻路契约（本期只定义，不实现） ---------------- */

export type PathNode = { x: number; z: number };

export type PathRequest = {
  start: PathNode;
  goal: PathNode;
  radius: number;
  height: number;
  stepHeight: number;
};

export type PathResult = { found: boolean; nodes: PathNode[]; cost: number };

/** 纯函数式寻路端口；未来实现 A* / NavMesh 时替换这个函数即可。 */
export type Pathfinder = (request: PathRequest, boxes: Box[], grid: GridMeta) => PathResult;
