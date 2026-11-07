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
  const wF = af / sum;
  const wS = ar / sum;
  const dirF = input.localForward >= 0 ? 1 : -1; // 前进 +1 / 后退 -1
  const dirR = input.localRight >= 0 ? 1 : -1;   // 右移 +1 / 左移 -1

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
    const kneeX = cfg.kneeLift * lift * amp * (0.55 + 0.25 * wF + (lead > 0 ? 0.2 * wS : 0));
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
