import type { GaitViewConfig } from '../core';

/**
 * 程序化步态解算器（Overgrowth 式思路），纯函数：无 THREE、无本地时间、无随机。
 *
 * 参考 Overgrowth 的三点，但用「解析摆腿 + 重心」而非骨骼 IK，保持零依赖、可快照、帧率无关：
 *   1) 方向自适应：把速度投到身体局部，前进/后退走「前后轴」、侧移走「左右轴」，
 *      两轴按 |速度分量| 权重混合 —— 于是「边瞄准边侧移」时脚步沿真实移动方向摆，
 *      而不是先把整个下半身转向移动方向再原地前后比划。
 *   2) 脚落地锁定（foot plant）：支撑相把脚的偏移往身后压（sin³ 项），抵消髋部前移，
 *      观感是脚踩在地上不滑；摆动相快速回摆并抬膝。
 *   3) 侧向交叉步 + 重心转移：侧移时移动方向那条腿是「领先腿」，摆动相额外跨过中线、
 *      步幅更大；跟随腿小幅收回。骨盆朝支撑脚侧移、随步相起伏与侧倾，上半身对侧摆臂。
 *
 * 抗抽动约束（v7c 步频回归的教训）：整条曲线只由 sin/cos 构成，C∞ 连续，
 * 没有 max/clamp 折点、没有相位重缩放；相位直接取 Core 累加的 gaitPhase。
 *
 * 对应 C# 形态：static GaitPose SolveGait(in GaitInput i, in GaitConfig c)
 */
const TAU = Math.PI * 2;
const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export type GaitInput = {
  /** Core 累加的步态相位（连续单调，跨 2π 循环） */
  phase: number;
  /** 水平速度大小（m/s） */
  speed: number;
  /** 参考移动速度（m/s） */
  moveSpeed: number;
  /** 速度在身体前方（局部 +Z）的投影，带符号，m/s */
  localForward: number;
  /** 速度在身体右方（局部 +X）的投影，带符号，m/s */
  localRight: number;
  /** 腿长（m），用于把「脚偏移」换算成髋部弧度 */
  legLength: number;
  /**
   * v9e：当前步幅（米 / 周期），由 Core 写入。
   * 脚前伸距离 = stride × reachRatio，与相位推进速度严格配套 → 支撑脚世界位移为 0。
   * 传 0 表示拿不到物理步幅（如攻击等效驱动），退回按速度估算摆幅的旧路径。
   */
  stride: number;
  /** v9s.43：前向驱动符号 −1..1（由 `slewDirSign` 逐帧推进），省略 = 按 localForward 的正负取 ±1。
   *  见 `dirDrive`：|dirF| < 1 表示「正在换向」，前后摆幅按该值淡出，腿不会一帧镜像过去。 */
  dirF?: number;
  /** v9s.43：右向驱动符号 −1..1，同上（侧摆 / 交叉步 / 侧倾共用） */
  dirR?: number;
  grounded: boolean;
};

export type LegPose = {
  /** 髋绕 X（正 = 脚向后） */
  pitchX: number;
  /** 髋绕 Z（正 = 脚向右） */
  rollZ: number;
  /** 膝弯曲（>= 0） */
  kneeX: number;
};

export type GaitPose = {
  legL: LegPose;
  legR: LegPose;
  /** 骨盆侧移（米，身体局部 +X） */
  pelvisX: number;
  /** 骨盆起伏（米，>= 0 抬起） */
  pelvisY: number;
  /** 骨盆侧倾（rad） */
  pelvisRoll: number;
  /** 上半身侧倾（rad，叠加到 bob.rotation.z） */
  sideLean: number;
  /** 左 / 右臂前后摆（rad） */
  armL: number;
  armR: number;
  /** 诊断：侧移权重 0..1 */
  strafe: number;
  /** 诊断：后退权重 0..1 */
  backward: number;
};

function idle(): GaitPose {
  return {
    legL: { pitchX: 0, rollZ: 0, kneeX: 0 },
    legR: { pitchX: 0, rollZ: 0, kneeX: 0 },
    pelvisX: 0, pelvisY: 0, pelvisRoll: 0, sideLean: 0,
    armL: 0, armR: 0, strafe: 0, backward: 0,
  };
}

/**
 * 支撑相 / 摆动相的归一化脚偏移曲线（返回 −1..+1，1 = 脚在最前）。
 *
 *   p ∈ [0, π]   支撑相：脚从 +1 **线性**移到 −1，斜率恒为 −2/π。
 *                线性是关键 —— 只要求解器把相位按 v / stride 推进、脚前伸距离取 stride/4，
 *                脚相对身体的后退速度就恒等于身体前进速度，世界坐标下完全静止（零滑步）。
 *                旧实现用 cos + sin³，中段最快、两端最慢，身体匀速前进时中段必然往前蹭。
 *   p ∈ (π, 2π] 摆动相：三次 Hermite 从 −1 回到 +1，两端斜率都是 −2（对 p 是 −2/π），
 *                与支撑相首尾斜率完全一致 → 全曲线 C¹ 连续，没有折角，不会抽动。
 *
 * 摆动相初段会有约 0.08 的「向后过冲」（脚趾离地后的跟随），这是保持 C¹ 的代价，
 * 且发生在腾空阶段，不影响落地观感。
 */
function plantOffset(p: number): number {
  if (p <= Math.PI) return 1 - (2 * p) / Math.PI;
  const t = (p - Math.PI) / Math.PI;
  return -8 * t * t * t + 12 * t * t - 2 * t - 1;
}

/**
 * 单腿在一个步相周期内「脚相对髋」的偏移（归一化到 ±1）。
 * plantLock 在「旧余弦曲线」与「零滑步曲线」之间线性插值，方便调试面板 A/B 对照。
 * 两条曲线都是 C¹，凸组合仍 C¹，所以插值不会引入抽动。
 */
function footOffset(p: number, plantLock: number): number {
  const cos = Math.cos(p);
  const k = plantLock <= 0 ? 0 : plantLock >= 1 ? 1 : plantLock;
  if (k === 0) return cos;
  const plant = plantOffset(p);
  return k === 1 ? plant : cos + (plant - cos) * k;
}

/** 抬膝权重：支撑相中 ≈0、摆动相中 ≈1，C∞（由 sin 直接映射，无折点）。 */
function liftWeight(p: number): number {
  return (1 - Math.sin(p)) / 2;
}

/**
 * v9s.13 · 侧向权重保留系数（0 = 完全按后退处理，1 = 保留侧移交错步）。
 *
 * `forwardRatio` = 速度在身体前向的投影 / 速度大小 ∈ [-1, 1]：
 *   +1 = 正前方，0 = 正侧方，-1 = 正后方。
 * 角度从 `startDeg` 到 `fullDeg` 之间用 smoothstep 把侧向权重压到 0 ——
 * 两端导数为 0，玩家摇杆在侧后方缓慢划动时不会出现步态突跳。
 */
export function backStrafeKeep(
  forwardRatio: number,
  startDeg: number,
  fullDeg: number,
): number {
  const DEG = Math.PI / 180;
  // 配置缺失 / 写坏时退回默认 100° / 132°，绝不让 NaN 漏进步态（腿会整帧归零）
  const a = clamp(Number.isFinite(startDeg) ? startDeg : 100, 0, 180);
  const b = clamp(Number.isFinite(fullDeg) ? fullDeg : 132, 0, 180);
  if (b <= a) return forwardRatio >= Math.cos(a * DEG) ? 1 : 0;
  const start = Math.cos(a * DEG);   // 100° → -0.17
  const full = Math.cos(b * DEG);    // 132° → -0.67
  if (forwardRatio >= start) return 1;
  const t = clamp((start - forwardRatio) / (start - full), 0, 1);
  return 1 - t * t * (3 - 2 * t);
}

/* -------------------------------------------------------------------------- *
 * v9s.43 · 换向融合：前后摆的「符号」不能一帧翻过去
 * -------------------------------------------------------------------------- *
 * 现象：前进时把摇杆一拉到后，腿会抽一下（线上 ~0.65s 内转 180°，实测单帧腿角跳
 * 1.20 rad ≈ 69°，而正常跨步单帧只有 0.5 rad）。
 *
 * 根因：前后轴摆幅 = `dirF × wF × stride/4 × off(p)`，其中 dirF 是**硬符号**
 * `localForward >= 0 ? +1 : -1`。速度穿过 0 时 dirF 瞬间取反，等于把整条腿位
 * 镜像过去 —— 而这一帧 `wF` 并不小（纯前后移动时 wF ≈ 1），摆幅又是按**步幅**
 * 而不是按速度定的（stride/4 恒为 0.25m），所以换向那一帧脚直接瞬移 ~0.5m 的
 * 等效摆角。侧轴（dirR）同理：左右一换，侧摆 / 交叉步 / 侧倾整套镜像。
 *
 * 修法不是改摆幅曲线（solveGait 本来 C¹），而是让**符号本身连续**：
 * 每个方向各存一个 −1..1 的驱动量，按 `dirFlipSec` 的速率线性推进到目标符号，
 * 再用 smoothstep 形状（两端速度为 0）映射成系数乘上去。换向时分帧经过 0，
 * 摆幅跟着收成 0 再长回来 —— 等价于「两个方向的姿态交叉淡入」，观感是转身时
 * 腿先并一下再迈出去，而不是瞬移。
 *
 * 为什么不按速度淡出：摆幅按步幅定，与速度无关，换向时速度可能只有 0.4 m/s
 * 却仍是满摆幅；按速度淡出会把「慢走」也削成碎步。只有「符号确实翻了」时才需要淡。
 */

/** 每帧朝目标符号（±1）推进 step，返回 −1..1 的**线性**值。state 存这个原始值。 */
export function slewDirSign(
  current: number,
  target: number,
  dt: number,
  sec: number,
): number {
  const t = target >= 0 ? 1 : -1;
  const s = Math.max(EPS, sec);
  const step = (2 / s) * Math.max(0, dt);   // −1 → +1 恰好花 sec 秒
  const cur = clamp(current, -1, 1);
  const d = t - cur;
  if (Math.abs(d) <= step) return t;
  return cur + Math.sign(d) * step;
}

/** 线性 −1..1 → 两端速度为 0 的驱动系数（0 → 0，±1 → ±1）。 */
export function dirDrive(x: number): number {
  const v = clamp(Number.isFinite(x) ? x : 1, -1, 1);
  const a = Math.abs(v);
  return Math.sign(v) * a * a * (3 - 2 * a);
}

/* -------------------------------------------------------------------------- *
 * v9s.44 · 下盘偏转目标限速：「朝向切换」时下盘不能整体甩一下
 * -------------------------------------------------------------------------- *
 * 现象：一边跑一边让身体转向（锁定目标 / 拖拽瞄准 / 攻击锁朝向）时，下盘会整体
 * 晃一下 —— 腿先朝一侧拧过去，再拧回来。
 *
 * 根因不是角度不连续，而是**目标在几十毫秒里扫过一大段**：下盘偏转目标
 * `backHipYawTarget` 有两个「族」——
 *   · 侧移族：`strafeHipYaw` 让下盘朝移动方向带转（纯侧移 θ=90° 时 +50°）；
 *   · 后退族：θ 落进 100°..180° 时改用 `θ − 180°`（θ=132° → −48°），让下盘前后轴
 *     精确对准移动轴（v9s.14 的踩地前提）。
 * 身体转动时 θ 会连续扫过 90° → 132°，两个族在同一 θ 上相差 ~100°，目标只能
 * 「跳族」：实测 θ=99° 目标 +49°，θ=112° 已经 −24°，θ=133° −47°，再回到 0。
 * 于是整条目标曲线是一个 **+50 → −48 → 0** 的大 S，hipYaw 平滑跟不上 → 单帧
 * 12.9°（775°/s），整体摆幅 54°~75°。
 *
 * 修法：给**目标**加最大转速（不是给输出加，输出那层指数平滑是手感的「缓起」）。
 * 目标被限速后，短促的扫掠（身体转身 0.3~0.5s）来不及爬到峰值就被拉回 0 →
 * 负向那一段根本不出现；而真正持续的方向改变（横移换向、长期倒退走）只是慢一点
 * 到位，稳态完全一致。物理上也说得通：胯是被上身带过去的，不可能比身体转得还快。
 *
 * 与 `slewDirSign` 的区别：那个是「符号」在固定时长内匀速走完（±1），这个是任意
 * 角度按固定**角速度**推进。rate<=0 时不限速，精确回到旧行为（A/B 用）。
 */
export function slewAngle(
  current: number,
  target: number,
  maxRate: number,
  dt: number,
): number {
  if (!(maxRate > 0)) return target;
  const step = maxRate * Math.max(0, dt);
  const d = target - current;
  if (Math.abs(d) <= step) return target;
  return current + Math.sign(d) * step;
}

/** 身体角速度低于此值视为「没在转身」（rad/s，≈30°/s） */
export const SPIN_RATE_START = (30 * Math.PI) / 180;
/** 超过此值视为「纯转身」（rad/s，≈100°/s） */
export const SPIN_RATE_FULL = (100 * Math.PI) / 180;
/** v9s.45：闸门上升 / 下降时间（秒）。上升快（转身一起来就接管），
 *  下降慢（转身结束后下盘逐步交还控制权，不会一帧放开）。 */
export const SPIN_RISE_SEC = 0.06;
export const SPIN_FALL_SEC = 0.22;

/**
 * v9s.44 · 「身体自己在转」的程度：0 = 没转（速度换向），1 = 纯转身（rad/s 进，0..1 出）。
 *
 * 为什么需要这个闸门（而不是一刀切限速）：速度方向本身反转时（摇杆前推 → 后拉、
 * 身体朝敌人不动），θ 会在一瞬间翻 180°，此时下盘必须跟着全速拧过去，否则腿的
 * 摆动轴与世界速度方向错开 = 踩不住地（v9s.43 用例实测腿角跳 0.55 → 0.63 rad）。
 * 而「朝向切换」（锁定目标变了 / 攻击锁朝向 / 拖拽瞄准）时是**身体在转**、世界速度
 * 方向没变，胯是被上身带过去的，不该比身体本身转得还快 —— 这一种才该锁住。
 *
 * ⚠️ v9s.45：`turnRate` 必须是**游戏时间**里的角速度（ΔbodyYaw / Δworld.time）。
 * 用渲染帧 dt 算的话，慢放 0.25× 时身体转过同样角度要多花 4 倍真实时间，
 * 角速度只有常速的 1/4 —— 闸门从「全关」变成「半开」，下盘在转身中途被放行，
 * 单帧能蹿 18~24°，肉眼就是「慢放还是会抖一下」。
 */
export function turnSpinGate(turnRate: number): number {
  return clamp(
    (Math.abs(turnRate) - SPIN_RATE_START) / (SPIN_RATE_FULL - SPIN_RATE_START),
    0, 1,
  );
}

/**
 * v9s.45 · 闸门的「状态化」：目标值不变时，spin 也只能按固定斜率爬升 / 回落。
 *
 * 为什么不能直接拿瞬时角速度当权重：`turnSpinGate` 是连续的，但它的**输入**在
 * 转身末尾衰减得很快（指数趋近），闸门会在几帧里从 1 滑到 0；而限速率又和 spin
 * 强相关（见 `slewHipTarget`），于是「半开」的那几帧足以让目标蹿出去十几度。
 * 这里把 spin 变成一阶状态：上升 0.06s、下降 0.22s，两端都不可能出现一帧巨变。
 */
export function slewGate(
  current: number,
  target: number,
  dt: number,
  riseSec = SPIN_RISE_SEC,
  fallSec = SPIN_FALL_SEC,
): number {
  const cur = clamp(current, 0, 1);
  const t = clamp(target, 0, 1);
  const sec = t > cur ? Math.max(EPS, riseSec) : Math.max(EPS, fallSec);
  const step = (dt / sec) * 1;
  const d = t - cur;
  if (Math.abs(d) <= step) return t;
  return cur + Math.sign(d) * step;
}

export function slewHipTarget(
  current: number,
  target: number,
  maxRate: number,
  dt: number,
  spin: number,
): number {
  if (!(maxRate > 0)) return target;
  const free = 1 - clamp(spin, 0, 1);
  // v9s.45：rate 与 free **线性**挂钩（旧版 free·(maxRate + free·3400°/s) 在 free=0.5
  // 时还有 ~950°/s，等于「半开 = 几乎不限速」，正是慢放下那一下抖的来源）。
  // 现在 spin=1 精确冻结、spin=0 就是 maxRate 本身 —— 中间任何位置都不再有「放行」的捷径。
  if (free <= 1e-9) return current;
  return slewAngle(current, target, free * maxRate, dt);
}

export function solveGait(input: GaitInput, cfg: GaitViewConfig): GaitPose {
  if (!input.grounded || input.speed < EPS) return idle();

  const u = input.speed / Math.max(input.moveSpeed, EPS);
  const legLen = Math.max(input.legLength, EPS);

  // v9e：脚前伸距离（米）。有物理步幅时取 stride × reachRatio（0.25 = 零滑步），
  // 拿不到步幅（攻击等效驱动）才退回「摆幅随速度」的旧估算，保证 v8d 的攻击下盘观感不变。
  const reach = input.stride > EPS
    ? input.stride * cfg.reachRatio
    : Math.min(cfg.maxAmp, u * cfg.strideGain) * legLen;
  /** 摆幅（rad 等效），只用于抬膝 / 重心 / 摆臂等次级动作 */
  const amp = Math.min(cfg.maxAmp, reach / legLen);
  /**
   * 脚可达半径（米）：髋转角的几何上限。超出即钳制（钳制段必然有滑步，只在冲刺时发生）。
   * 1.25 rad（72°）是两骨 IK 仍能完全复现 FK 脚位的上限 —— 再大时摆动末期
   * 脚位会逼近 IK 的奇异区，实测钉地残差从 0 跳到 3cm（脚会「弹」一下）。
   */
  const maxFoot = legLen * Math.sin(Math.min(cfg.maxAmp, 1.25));

  // 方向权重：用分量绝对值，符号单独交给 dirF / dirR 处理
  const af = Math.abs(input.localForward);
  const ar = Math.abs(input.localRight);
  const sum = af + ar + EPS;
  /**
   * v9s.13：侧后方不再两轴混合。
   *
   * 侧后方（前向分量 < 0 且侧向分量不小）时，旧实现把速度同时摊给前后轴与左右轴：
   * 脚走对角线、膝盖却只能绕 X 弯，两腿像被斜着拽开（真机上「假人绕后、玩家倒走」最明显）。
   * 现在按「后退占比」把侧向权重整体并入前后轴，配合 dirF = -1 就是纯后退摆腿：
   * 膝盖平面始终正对身体前向，读作正常倒着走。
   */
  const backKeep = backStrafeKeep(
    input.localForward / Math.max(input.speed, EPS),
    cfg.backStrafeStartDeg,
    cfg.backStrafeFullDeg,
  );
  const wS = (ar / sum) * backKeep;
  const wF = (af / sum) + (ar / sum) * (1 - backKeep);
  // v9s.43：符号用驱动量（可由骨架层按 slewDirSign 平滑），省略时退回硬符号。
  // `dirDrive` 只是形状映射：|x|=1 时与旧的 ±1 逐位相同，只有换向途中才衰减摆幅。
  const dirF = dirDrive(input.dirF ?? (input.localForward >= 0 ? 1 : -1)); // 前进 +1 / 后退 -1
  const dirR = dirDrive(input.dirR ?? (input.localRight >= 0 ? 1 : -1));   // 右移 +1 / 左移 -1

  const halfStride = reach;

  /** 脚偏移 → 髋关节角：用 asin 反解，保证「渲染出来的脚」水平位移真的等于设计值。
   *  线性近似（footLen / legLen）在 50° 以上会少算约 15%，那部分就是残余滑步。 */
  const legAngle = (foot: number): number => Math.asin(clamp(foot, -maxFoot, maxFoot) / legLen);

  /** side: -1 左腿 / +1 右腿；两腿相位差 π。 */
  function solveLeg(p: number, side: number): LegPose {
    const off = footOffset(p, cfg.plantLock);
    const lift = liftWeight(p);

    // 前后轴：脚偏移 → 髋俯仰（rotation.x 正使脚向后，故取负号）
    const footZ = dirF * wF * halfStride * off;
    const pitchX = -legAngle(footZ);

    // 左右轴：领先腿 = 移动方向那一侧；摆动相额外跨过中线（交叉步）
    const lead = side * dirR > 0 ? 1 : -1;
    const sideScale = 1 + lead * cfg.crossStep * 0.45;
    const crossOut = dirR * lead * cfg.crossStep * halfStride * 0.4 * lift;
    const footX = dirR * wS * halfStride * cfg.sideWeight * sideScale * off + crossOut * wS;
    const rollZ = legAngle(footX);

    // 膝：摆动相抬起；侧移的领先腿多弯一点（跨步更明显）
    // v9s.43：领先量改成 `0.1 × (1 + side·dirR)` —— |dirR|=1 时与旧写法（领先 0.2/跟随 0）
    // 逐位相同，但换向途中连续穿过 0.1，抬膝不会随 lead 的符号在一帧里跳一格。
    const kneeX = cfg.kneeLift * lift * amp * (0.55 + 0.25 * wF + 0.1 * wS * (1 + side * dirR));
    return { pitchX, rollZ, kneeX };
  }

  const p = ((input.phase % TAU) + TAU) % TAU;
  const legL = solveLeg(p, -1);
  const legR = solveLeg((p + Math.PI) % TAU, 1);

  // 重心：朝支撑脚侧移（cos p）、摆动相抬起（lift）、侧移时朝反方向压（离心）
  const cosP = Math.cos(p);
  const lift = liftWeight(p);
  const pelvisX = -cfg.comSway * amp * cosP * (0.6 * wF + 0.8 * wS)
    - dirR * cfg.comSway * amp * wS * 0.45;
  const pelvisY = cfg.comBob * lift * amp;
  const pelvisRoll = dirR * cfg.hipLean * amp * wS * cosP * 0.6;
  const sideLean = dirR * cfg.hipLean * amp * wS * (0.45 + 0.25 * cosP);

  // 手臂：与腿对侧摆，前进/后退随 dirF 反号，侧移保留小幅摆臂
  const armSw = cfg.armSwing * amp * cosP * (wF * dirF + 0.3 * wS);
  const armL = armSw;
  const armR = -armSw;

  return {
    legL, legR, pelvisX, pelvisY, pelvisRoll, sideLean, armL, armR,
    strafe: wS,
    backward: dirF < 0 ? wF : 0,
  };
}

/* -------------------------------------------------------------------------- *
 * v9n · 停步收相：让最后一个步相自然走到「双脚并拢」再淡入待机
 * -------------------------------------------------------------------------- *
 * Core 的 gaitPhase 只在有位移时推进（frameDist / stride）。松手后速度指数衰减，
 * 位移趋近 0 → 相位冻结；但 solveGait 只要 speed >= EPS 就仍按这个冻结相位输出姿态，
 * 于是角色会「卡在最后一个跨步 pose」一小段时间，然后突然弹回待机。
 *
 * 修法不是立刻归零（更突兀），也不是继续用 Core 相位（不会动）：
 * 接管一小段时间，把相位从冻结值推进到**下一个双脚并拢点**，同时把步幅 / 速度
 * 一起淡到 0 —— 两脚会各走完最后半步、自然收拢，抬膝与重心同步消退。
 *
 * 并拢点：footOffset(p)=0 出现在 p=π/2 与 p=3π/2；两腿相位差 π，
 * 所以其中任意一个点都让左右脚**同时**回到髋正下方，正好是待机姿态。
 */

export type StopBlend = {
  /** 0 = 刚停步，1 = 已完全收拢到待机 */
  progress: number;
  /** 停步瞬间被冻结的步相 */
  phase0: number;
  /** 收拢目标相位（双脚同时并拢） */
  phaseEnd: number;
};

/** 求「phase 之后的第一个双脚并拢相位」；若已经并拢也走完半步，避免相位瞬切。 */
export function nextFeetTogetherPhase(phase: number): number {
  const p = ((phase % TAU) + TAU) % TAU;
  // 严格取 p 之后的第一个并拢点（floor+1），最多走半步（π）。
  // 若停步时脚本来就快并拢了，直接淡出即可 —— 不必为了「走满半步」再跨一大步。
  const k = Math.floor((p - Math.PI / 2) / Math.PI + 1e-9) + 1;
  return Math.PI / 2 + k * Math.PI;
}

/**
 * 停步过渡姿态：纯函数，输入仍是 GaitInput + 显式过渡状态，不引入本地时间 / 随机。
 * 相位用 smoothstep 推进（两端速度为 0，与待机无缝衔接）；
 * speed 与 stride 同系数淡出 → reach / amp / 抬膝 / 重心全部同步收拢。
 */
export function solveStopGait(input: GaitInput, cfg: GaitViewConfig, stop: StopBlend): GaitPose {
  const t = clamp(stop.progress, 0, 1);
  if (t >= 1 || input.speed < EPS) return idle();
  const e = t * t * (3 - 2 * t);
  const fade = 1 - e;
  return solveGait({
    ...input,
    phase: stop.phase0 + (stop.phaseEnd - stop.phase0) * e,
    speed: input.speed * fade,
    stride: input.stride * fade,
  }, cfg);
}

/**
 * v9n · 侧移下盘偏转：把「纯侧移」的一部分转成斜向前进，避免双腿平行滑行。
 *
 * 纯侧移时 wS≈1、wF≈0 → 两腿 pitchX≈0，只有左右摆，看起来像两脚平行拖着走
 * （真机上「假人和角色保持距离横移」最明显）。把下半身朝移动方向多带转一点，
 * 速度在腿局部坐标系里就有了前向分量，步态自然变成斜向迈步。
 *
 * 用连续侧向占比的平方做增益，前进/后退（lat≈0）完全不受影响，
 * 没有 atan2 / wrapAngle，任何朝向都不会跳变。返回值是弧度（带符号）。
 */
export function strafeHipYaw(latRatio: number, baseScale: number, maxDeg: number, boost: number): number {
  const lat = clamp(latRatio, -1, 1);
  const a = Math.abs(lat);
  const scale = Math.min(1, baseScale * (1 + Math.max(0, boost) * a * a));
  return clamp(scale * lat, -1, 1) * ((maxDeg * Math.PI) / 180);
}

/**
 * v9s.45 · 下盘偏转的「相位权重」：1 = 侧移 / 前进族，0 = 后退族。
 *
 * 旧版把 `k²` 和 `spinGate` 直接写在 `backHipYawTarget` 里；现在抽出来，是因为它
 * 还要单独喂给**限速率**（前 / 后相位各一套上限，见 `hipTrackRate`）——
 * 目标与限速必须用同一个权重，否则两者会互相打架。
 *
 * 用平方让翻转快于侧摆收缩：`backStrafeKeep` 是 smoothstep，中段（110° 附近）
 * 侧摆已经退了一半、下盘却只转了一小部分 —— 那是最难看的「半翻」状态。
 */
export function hipFlipWeight(backKeep: number, spinGate = 0): number {
  const k = clamp(backKeep, 0, 1);
  return k * k + (1 - k * k) * clamp(spinGate, 0, 1);
}

/**
 * v9s.45 · 前 / 后相位各自的下盘目标转速上限（rad/s）。
 *
 * 侧移族要跟得上（横移一推，胯就得跟着带转），保留较高的上限；
 * 后退族的 −48° 是「把摆动轴对齐到行走轴」的**稳态**解，只有真的在倒退走时才该
 * 长出来 —— 上限压低，快速扫过 θ∈100°..132° 时就来不及把胯拖出去再拖回来。
 *
 * 任一侧 <= 0 视为「关掉限速」（`hipYawTrackRateDeg = 0` 的 A/B 开关），
 * 返回 0 让 `slewAngle` 走透传。
 */
export function hipTrackRate(forwardRate: number, backRate: number, flip: number): number {
  if (!(forwardRate > 0) || !(backRate > 0)) return 0;
  const f = clamp(flip, 0, 1);
  return backRate + (forwardRate - backRate) * f;
}

/**
 * v9s.14 · 侧后方下盘该朝哪边转（修正方向翻转）。
 *
 * 支撑相要「脚掌钉地」，要求脚相对身体的位移速度正好抵消身体速度。腿只能绕 X
 * 做前后摆，所以**脚相对身体的摆动轴 = 下盘前后轴**；要让这个轴与真实移动方向
 * 平行，下盘前后轴就必须落在移动方向上。
 *
 * 侧移段（|θ| ≤ 90°）靠 `strafeHipYaw` 带转一部分、再由 footX 侧摆补掉剩下的角度，
 * 所以只转 0.35 倍就够（腿不必正对移动方向）。后退段不一样：`wS` 被 `backStrafeKeep`
 * 收到 0，全部改由前后摆承担，下盘就必须**精确**对准移动轴 —— 而它落在移动方向的
 * 反侧：
 *
 *   h_back = θ − sign(θ)·180°      // 135° 右后 → −45°（下盘朝左前）
 *
 * 这一点是「翻过来」的本质：腿在后退摆，脚往 θ 方向蹬出去，膝盖却朝 θ+180°，
 * 所以下盘角度的符号与侧移偏转相反。v9s.13 把偏转直接归零，轴就停在身体正前方，
 * 与斜向移动差 45° —— 那 45° 的横向分量没有脚补偿，正是滑步。
 *
 * 两族怎么混合交给 `flip`（见 `hipFlipWeight`）：1 = 侧移族，0 = 后退族。
 */
export function backHipYawTarget(
  localForward: number,
  localRight: number,
  strafeYaw: number,
  /** 相位权重，见 `hipFlipWeight`：1 = 停在侧移族（含「正在转身」），0 = 完全翻到后退族 */
  flip: number,
): number {
  const speed = Math.hypot(localForward, localRight);
  if (!(speed > 1e-6)) return strafeYaw;
  const deg = (Math.atan2(localRight, localForward) * 180) / Math.PI;
  const abs = Math.abs(deg);
  // 侧移 / 前进段：完全交给既有的 strafeHipYaw（0.35 限幅 + 侧摆补偿）
  if (abs <= 90) return strafeYaw;
  const backYaw = ((deg - Math.sign(deg) * 180) * Math.PI) / 180;
  const f = clamp(flip, 0, 1);
  return strafeYaw * f + backYaw * (1 - f);
}

/* -------------------------------------------------------------------------- *
 * v9o · 低速滑行修复：停步收相只在「确实在停下来」时接管
 * -------------------------------------------------------------------------- *
 * v9n 把「速度低于 50% 参考移速」直接当成停步尾段并启动 0.3s 收相。但玩家轻推
 * 摇杆做**低速巡航**（或假人 KEEP DIST 横移）时速度会稳定停在这个区间：收相照样
 * 走完并输出 idle —— 身体仍以每秒一米多匀速平移，腿却完全静止，观感就是「滑行」。
 * 这不是支撑相钉地没做好，而是整条步态被误关掉了。
 *
 * 门控只用 CharacterState 里已有的速度（表现层只读状态，不依赖输入层），靠**趋势**
 * 区分两者，而且不只是「进入时判一次」，而是**每帧都要继续成立**：
 *   - enter：速度已降到 enterRatio 以下、且相对上一帧明显衰减 → 启动收相。
 *            松手后摩擦是指数衰减（每帧约 -20%），稳定巡航几乎不变。
 *   - resume：一旦不再满足「正在往零收敛」就立即退出收相。这一步是关键 ——
 *            从高速切到轻推摇杆时，中途那段减速也会短暂满足 enter 并启动收相；
 *            若只在进入时判定，收相走完后速度稳定在低速就再也没人把它复位，
 *            腿会一直停在 idle（线上实测到的第二次滑行）。
 *    「往零收敛」= 仍在明显减速，或已小到几乎不动（settled，避免浮点末端误判）；
 *    稳定在任意非零低速、或重新加速，都算「玩家还在走」→ 交还正常步态。
 * 两个比例按各自参考移速缩放，留出滞回区间，玩家与假人共用同一套语义。
 */
export type StopGate = { enter: boolean; resume: boolean };

export function stopBlendGate(
  speed: number,
  prevSpeed: number,
  moveSpeed: number,
  enterRatio: number,
  exitRatio: number,
): StopGate {
  const ref = Math.max(moveSpeed, EPS);
  const enterAt = Math.max(0, enterRatio) * ref;
  const exitAt = Math.max(0, exitRatio) * ref;
  const decelRatio = prevSpeed > EPS ? (prevSpeed - speed) / prevSpeed : 0;
  const decelerating = decelRatio > 0.02;
  const accelerating = decelRatio < -0.015;
  // 已减速到几乎不动：即使浮点上不再下降，也要保持收相完成的待机态
  const settled = speed <= enterAt * 0.15;
  const hold = !accelerating && speed < exitAt && (decelerating || settled);
  return {
    // speed > EPS：速度精确归零时 solveGait 本就返回待机，无需收相
    enter: speed > EPS && speed <= enterAt && decelerating,
    resume: !hold,
  };
}

/**
 * v9o · 胸朝向随下盘带转：移动时只有腿（lower）朝移动方向偏，胸 / 上半身仍死死
 * 正对前方，上下身像被拧开。取 hipYaw 的一个比例（默认 0.45）再限幅，符号与下盘
 * 一致。hipYaw 本身已经按 hipYawSmoothing 指数平滑，线性缩放不会引入任何跳变，
 * 因此不需要再存一份平滑状态。
 */
export function chestYawFromHip(hipYaw: number, scale: number, maxDeg: number): number {
  const max = Math.max(0, maxDeg) * (Math.PI / 180);
  return clamp(hipYaw * clamp(scale, 0, 2), -max, max);
}

/* -------------------------------------------------------------------------- *
 * v9p · 停步惯性：最后一步踩出去 + 身体跟着惯性微前移，再收回待机
 * -------------------------------------------------------------------------- *
 * v9n/v9o 的收相只是把相位推到「双脚并拢」并淡出摆幅 —— 两脚纯往回收，
 * 看着像「站定前先把腿抽回去」，没有急停时「再撑一步、上身被惯性带一下」的感觉。
 *
 * 这里叠加一个两端值 / 导数都为 0 的脉冲（0 → 1 → 0，C¹）：
 *   - 领先腿（停步相位里更靠前的那条）额外前伸并抬膝，跟随腿轻微后蹬；
 *   - 身体沿停步瞬间的移动方向微前移，上身同步前倾，骨盆跟着一起轻微下沉
 *     （v9r：急停时重心压低，不再只有上半身自己往下折）；
 *   - t→1 时脉冲归零，与 solveStopGait 的淡出一起平滑接回 idle，不残留姿态。
 * 全部是表现层增量，不改 Core 的 position / velocity，也不进快照。
 * 所有幅度由 GaitViewConfig 外置，拉 0 即精确回到 v9o 行为。
 */

export type StopInertia = {
  /** 领先腿额外前伸（rad，正值；骨架里按「脚向前」取负号叠加） */
  leadPitch: number;
  /** 跟随腿轻微后蹬（rad，正值） */
  trailPitch: number;
  /** 领先腿抬膝（rad，正值） */
  leadKnee: number;
  /** 身体沿停步方向微前移（m） */
  bodyShift: number;
  /** v9r：骨盆跟随上半身一起轻微下沉（m）。骨架里写在 IK 基准之后 —— 锚点取的是
   *  「骨盆还没沉下去」时的脚位，等于自带一根不跟随下沉的 IK 辅助基准，
   *  无需额外辅助骨骼；IK 开启时反解屈膝吸收，关闭时给下盘等量反向补偿。 */
  bodyDip: number;
  /** 上身随惯性前倾（rad） */
  chestPitch: number;
  /** 停步相位里更靠前的是不是左腿 */
  leadLeft: boolean;
  /** 移动方向单位向量的前 / 右分量（**骨盆 = bodyYaw 局部轴**，见 bodyLocalDir）。
   *  fwdN → pelvis.position.z、rightN → pelvis.position.x；用错基准（gaitYaw 局部）
   *  会让侧移停步时的身体前移方向歪掉一个 hipYaw。 */
  fwdN: number;
  rightN: number;
  /** 诊断：当前脉冲强度 0..1 */
  env: number;
};

/**
 * v9q：把「世界水平方向」投影到**骨盆局部轴**（root 只转 bodyYaw）。
 *
 * pelvis 直接挂在 root 下，其局部 +Z / +X 分别是 bodyYaw 的前 / 右；而步态解算器
 * 的 localForward / localRight 用的是 lower（bodyYaw + hipYaw）局部轴。两者差一个
 * hipYaw（纯侧移时可达 30°+），把 gait 局部方向直接写进 pelvis.position 就会让
 * 「身体惯性前移」与真实速度方向不一致。所有写 pelvis 局部位移的地方都先过这里。
 */
export function bodyLocalDir(
  bodyYaw: number, worldX: number, worldZ: number,
): { forward: number; right: number } {
  const fx = Math.sin(bodyYaw), fz = Math.cos(bodyYaw);
  const rx = Math.cos(bodyYaw), rz = -Math.sin(bodyYaw);
  return {
    forward: worldX * fx + worldZ * fz,
    right: worldX * rx + worldZ * rz,
  };
}

/* -------------------------------------------------------------------------- *
 * v9s · 停步下盘偏差消化系数
 * -------------------------------------------------------------------------- *
 * 根因：latRatio = 速度侧向分量 / 速度大小 是「方向比值」，松手减速时它并不趋零，
 * 所以 targetHipYaw 一直维持停步前的偏转，直到速度 < 1e-6（按 friction=14 约在
 * 收相结束后 0.4s）才骤然归零 —— 就是「停步完成后一次明显插值到目标方向」。
 *
 * 这里不覆盖 hipYaw 的绝对值（会被常规指数平滑拉回去），而是给「偏转目标」乘一个
 * 淡出系数，让下盘在停步过程中就与身体朝向重新对齐：
 *   - inStop    : 系数随收相进度 stopT 平滑压到 0，停步结束即精确归零；
 *   - afterStop : 收相期间保持 1（保留急停侧身的顿感），收相结束后按独立计时进度
 *                 消化到 0（进度由骨架层推进，不依赖 turnInPlace 是否触发）。
 * 消化完成后骨架层把系数保持在 0，直到重新加速才交还常规平滑，避免被拉回偏转值。
 */
export type StopYawMode = 'inStop' | 'afterStop';

/** progress：inStop 模式传收相进度 stopT，afterStop 模式传收相结束后的消化进度。 */
export function stopYawFade(progress: number, mode: StopYawMode, inStop: boolean): number {
  const t = clamp(progress, 0, 1);
  const e = t * t * (3 - 2 * t);
  if (inStop) return mode === 'inStop' ? 1 - e : 1;
  return mode === 'afterStop' ? 1 - e : 0;
}

/* -------------------------------------------------------------------------- *
 * v9s · 原地转身踏步姿态
 * -------------------------------------------------------------------------- *
 * Core 的 turnInPlace.active 期间速度≈0，solveGait 直接返回 idle —— 若不补一层，
 * 身体转向时两腿完全不动，就是用户说的「平滑差值下半身完全滑过去」。
 * 这里按转身进度给两腿一次交替的抬膝 / 前迈 / 侧摆（轴脚幅度小、摆动脚幅度大），
 * 包络 sin²(πt) 两端值与导数均为 0，起止不抽动；配合骨架层临时放松足部 IK，
 * 让脚真的「挪」起来而不是被钉在原地。全部幅度由 GaitViewConfig 外置，
 * turnStepEnabled=false 精确回到纯插值转身，便于 A/B 对照。
 */
export type TurnStepPose = {
  legL: LegPose;
  legR: LegPose;
  /** 骨盆微幅下沉（m，负值） */
  pelvisY: number;
  /** 诊断：当前脉冲强度 0..1 */
  env: number;
};

export function solveTurnStep(
  progress: number, dir: number, cfg: GaitViewConfig,
): TurnStepPose {
  const zero = (): TurnStepPose => ({
    legL: { pitchX: 0, rollZ: 0, kneeX: 0 },
    legR: { pitchX: 0, rollZ: 0, kneeX: 0 },
    pelvisY: 0, env: 0,
  });
  if (!cfg.turnStepEnabled) return zero();
  const t = clamp(progress, 0, 1);
  const sin = Math.sin(Math.PI * t);
  const env = sin * sin;
  if (env <= 1e-9) return zero();
  // dir=+1 右转：右腿为轴（小幅）、左腿向外踏一步（大幅）；左转反之。
  const rightTurn = dir >= 0;
  const lAmp = rightTurn ? 1 : 0.35;
  const rAmp = rightTurn ? 0.35 : 1;
  const pitch = Math.max(0, cfg.turnStepPitch) * env;
  const knee = Math.max(0, cfg.turnStepKnee) * env;
  const side = Math.max(0, cfg.turnStepPitch) * 0.35 * env;
  const s = rightTurn ? 1 : -1;
  return {
    legL: { pitchX: -pitch * lAmp, rollZ: s * side * lAmp, kneeX: knee * lAmp },
    legR: { pitchX: -pitch * rAmp, rollZ: -s * side * rAmp, kneeX: knee * rAmp },
    pelvisY: -Math.max(0, cfg.turnStepDip) * env,
    env,
  };
}

export function solveStopInertia(
  progress: number,
  phase0: number,
  fwd: number,
  right: number,
  cfg: GaitViewConfig,
): StopInertia {
  const t = clamp(progress, 0, 1);
  const peak = clamp(cfg.stopPeakRatio, 0.05, 0.95);
  // 两段 smoothstep：t=0 / peak / 1 处值与导数都连续，端点精确为 0
  const q = t <= peak ? t / peak : (t - peak) / (1 - peak);
  const s = q * q * (3 - 2 * q);
  const env = t <= peak ? s : 1 - s;

  const dirLen = Math.hypot(fwd, right);
  const fwdN = dirLen > EPS ? fwd / dirLen : 1;   // 几乎静止时默认朝身体前方
  const rightN = dirLen > EPS ? right / dirLen : 0;
  // solveGait 里 legL 用 p、legR 用 p+π；footOffset(p)>0 表示 legL 的脚在最前
  const leadLeft = footOffset(phase0, 1) > 0;

  return {
    leadPitch: Math.max(0, cfg.stopStepPitch) * env,
    trailPitch: Math.max(0, cfg.stopTrailPitch) * env,
    leadKnee: Math.max(0, cfg.stopStepKnee) * env,
    bodyShift: Math.max(0, cfg.stopBodyShift) * env,
    bodyDip: Math.max(0, cfg.stopBodyDip) * env,
    chestPitch: Math.max(0, cfg.stopChestPitch) * env,
    leadLeft, fwdN, rightN, env,
  };
}
