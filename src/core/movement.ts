import { overlapsAny, resolveHorizontal, supportHeight } from './collision';
import { resetCombat } from './combat';
import { resetAbilities } from './abilities';
import { clearArrows } from './arrows';
import { resetDash } from './dash';
import { resetLink } from './links';
import { resetTurnInPlace } from './turn-in-place';
import { NEVER_HURT_AT } from './hits';
import type { EventType, Intents, World } from './types';

const EPS = 1e-6;
const TAU = Math.PI * 2;

function lengthXZ(x: number, z: number): number {
  return Math.sqrt(x * x + z * z);
}

function emit(world: World, type: EventType, value: number): void {
  const p = world.character.position;
  world.events.push({ type, tick: world.tick, x: p.x, y: p.y, z: p.z, value });
}

export function resetCharacter(world: World): void {
  const c = world.character;
  const s = world.config.spawn;
  c.position.x = s.x;
  c.position.y = s.y;
  c.position.z = s.z;
  c.velocity.x = 0;
  c.velocity.y = 0;
  c.velocity.z = 0;
  c.facing = 0;
  c.moveYaw = 0;
  c.bodyYaw = 0;
  c.headYaw = 0;
  c.headPitch = 0;
  c.bodyPitch = 0;
  c.grounded = true;
  c.sprinting = false;
  c.gaitPhase = 0;
  c.stride = world.config.strideLength;
  c.distance = 0;
  c.coyoteTime = world.config.coyoteTime;
  c.jumpBuffer = 0;
  resetCombat(world);
}

/**
 * v9s.15 · 传送到任意坐标（测试工位用）。
 *
 * 与 resetCharacter 同口径地清掉「跨场地会残留」的玩家侧状态：速度、步态相位、
 * 攻击 / 连击、派生招窗口、冲刺与闪烁、引导飞弹 / 电环、受击、锁定目标、原地转身。
 * 假人与世界时间不动 —— 传送只换位置，不重开一局。
 *
 * 只写 World，不读时间 / 输入 → 纯状态转移，可快照、可确定性回放。
 */
export function warpTo(world: World, x: number, z: number): void {
  const c = world.character;
  const cfg = world.config;
  const sup = supportHeight(
    world.boxes, x, z, cfg.characterHeight, cfg.characterRadius, cfg.stepHeight,
    Number.POSITIVE_INFINITY,
  );
  c.position.x = x;
  c.position.y = sup > Number.NEGATIVE_INFINITY ? sup : 0;
  c.position.z = z;
  c.velocity.x = 0;
  c.velocity.y = 0;
  c.velocity.z = 0;
  c.facing = 0;
  c.moveYaw = 0;
  c.bodyYaw = 0;
  c.headYaw = 0;
  c.headPitch = 0;
  c.bodyPitch = 0;
  c.grounded = true;
  c.sprinting = false;
  c.gaitPhase = 0;
  c.stride = cfg.strideLength;
  c.distance = 0;
  c.coyoteTime = cfg.coyoteTime;
  c.jumpBuffer = 0;
  resetCombat(world);
  resetLink(world);
  resetDash(world);
  resetAbilities(world);
  clearArrows(world);
  resetTurnInPlace(world);
  const t = world.targeting;
  t.targetId = 0;
  t.targetYaw = 0;
  t.targetDist = 0;
  t.hasTarget = false;
  const h = world.playerHurt;
  h.type = 'none';
  h.lastAt = NEVER_HURT_AT;
  h.timer = 0;
  h.duration = 0;
  h.dirX = 0;
  h.dirZ = 0;
  h.knockX = 0;
  h.knockZ = 0;
  world.events.length = 0;
}

/**
 * 移动模块：唯一的 Core 玩法模块。
 * 纯状态转移 —— 只读 world / dt / intents，只写 world，不读任何外部状态。
 * 对应 C# 形态：static void MovementUpdate(World w, float dt, in Intents i)
 *
 * 朝向（facing / moveYaw / bodyYaw / headYaw）由独立的 orientation 模块负责，
 * 本模块只写位置、速度、落地与步态，保持单一职责。
 */
export function movementUpdate(world: World, dt: number, intents: Intents): void {
  const cfg = world.config;
  const c = world.character;
  const p = c.position;
  const v = c.velocity;

  // 复位由 step 层统一处理（世界级操作，包含假人），本模块不再单独截获。

  // 1) 输入归一化（世界空间，长度截断到 1）
  //    v9s.20：非法输入直接按 0 处理。输入层由相机基向量换算，一旦表现层给出 NaN
  //    （坏的 snap / 退化矩阵），NaN 会顺着 velocity → position 污染整个 World，
  //    再经 separation 传染给所有假人，整帧姿态直接崩掉。这一层是最后一道闸。
  let ix = Number.isFinite(intents.moveX) ? intents.moveX : 0;
  let iz = Number.isFinite(intents.moveZ) ? intents.moveZ : 0;
  const ilen = lengthXZ(ix, iz);
  if (ilen > 1) {
    ix /= ilen;
    iz /= ilen;
  }

  // 1.5) 世界边界：贴边时把朝外的输入分量投影掉。
  //      旧版只靠第 6 步 clamp 位置，速度仍会涨到满速 → 表现层「摆幅满、相位不推进」，
  //      角色在边界上原地跨步定格（真机读作「手脚在抖」）。
  const b = cfg.worldBounds;
  if ((ix > 0 && p.x >= b.maxX - EPS) || (ix < 0 && p.x <= b.minX + EPS)) ix = 0;
  if ((iz > 0 && p.z >= b.maxZ - EPS) || (iz < 0 && p.z <= b.minZ + EPS)) iz = 0;

  // 2) 目标速度：把各状态的「让位比例」乘进武器倍率。
  //    v9s.21 起这里只算目标速度，不再直接写 v —— 真正的减速由第 3 步统一做。
  const inAttack = world.combat.phase !== 'idle';
  // v9a：派生招期间位移严格由 links 写入的 impulse 决定，不被方向键叠加。
  const linking = world.playerLink.phase !== 'idle';
  // 翻滚期间同样：位移严格由 dash 写入的 impulse 决定。
  const dashActive = world.dash.phase === 'active';
  const inAction = inAttack || dashActive || linking;
  c.sprinting = !inAction && intents.sprintHeld && ilen > EPS;
  const profile = cfg.combat.weapons[world.combat.weapon];
  let weaponMul = profile ? profile.moveMultiplier : 1;
  if (dashActive || linking) {
    // 位移完全交给各自模块的 impulse；方向键不参与（也避免翻滚跑超 rollDistance）
    weaponMul = 0;
  } else if (inAttack) {
    // 攻击可以边走边打（attackMoveScale），但真正把身体推出去的那段（active）
    // 要让位给跨步层 —— 否则「跑速 + 跨步」在总速度上叠加，到点那一下特别冲。
    weaponMul *= world.combat.phase === 'active'
      ? cfg.combat.lungeMoveScale
      : world.combat.phase === 'settle' ? cfg.combat.settleMoveScale : cfg.combat.attackMoveScale;
  } else if (world.combat.charging) {
    // 弓蓄力减速
    weaponMul *= cfg.combat.bow.chargeMoveMultiplier;
  } else if (world.abilities.channeling) {
    // 法杖引导奥术飞弹：不进入近战状态机，因此「可移动引导」；按配置轻微减速
    // v9s.19：引导减速由技能自己写入（不再硬编码 abilities.arcane）
    weaponMul *= Math.max(0, Math.min(1, world.abilities.channelMoveScale));
  }
  const speed = cfg.moveSpeed * (c.sprinting ? cfg.sprintMultiplier : 1) * weaponMul;

  // 3) 统一趋近：只改目标速度与速率，永远不做赋值。
  //    v9s.21：旧版在 inAction 时写 `v = ix * speed`，attackMoveScale = 0 就等于
  //    「一帧从 4.2 掉到 0」；技能结束时 v 也是 0，只能从零重新加速 ——
  //    用户说的「放技能速度立马掉」「放完像重新起步」都是这一句造成的。
  //    现在 v 始终连续：进技能按 skillDecel 衰减，出技能直接接回 acceleration。
  {
    const rate = inAction ? cfg.skillDecel : (ilen > EPS ? cfg.acceleration : cfg.friction);
    const k = 1 - Math.exp(-rate * dt);
    v.x += (ix * speed - v.x) * k;
    v.z += (iz * speed - v.z) * k;
  }

  // 3) 跳跃缓冲 + 土狼时间
  if (intents.jumpPressed) c.jumpBuffer = cfg.jumpBufferTime;
  else c.jumpBuffer = Math.max(0, c.jumpBuffer - dt);
  c.coyoteTime = c.grounded ? cfg.coyoteTime : Math.max(0, c.coyoteTime - dt);

  if (c.jumpBuffer > 0 && c.coyoteTime > 0) {
    v.y = cfg.jumpSpeed;
    c.grounded = false;
    c.coyoteTime = 0;
    c.jumpBuffer = 0;
    emit(world, 'jumped', cfg.jumpSpeed);
  }

  // 3.5) 本帧发生闪现：位置已由 dash 模块直接瞬移到安全落点。
  //      跳过本帧常规水平积分，避免「刚闪现到落点又被输入方向拖走」，
  //      保证 dash.toX / toZ 与最终位置严格一致；重力、落地、步态仍照常处理。
  //      复用显式事件队列做模块间通信（step 每帧开头清空，tick 精确匹配本帧），
  //      不新增 World 字段，跨语言对照更直接。
  const blinkedThisFrame = world.events.some(
    (e) => e.type === 'blink' && e.tick === world.tick,
  );
  if (blinkedThisFrame) {
    v.x = 0;
    v.z = 0;
    world.impulse.x = 0;
    world.impulse.z = 0;
  }

  // 4) 水平积分：两层相加
  //    v（移动层）+ impulse（技能位移层）+ 受击击退。
  //    v9s.25 删掉了 v9s.21 的 kick 脉冲层（当时只为弓的后坐力服务）：
  //    射击时的反向冲量 + 放箭动作的 0.12m 前冲叠在一起，观感是「每射一箭整个人往前顶一下」，
  //    已经不符合现在的射击手感；要真是后坐力，也该由表现层做相机 / 肩部抖动，而不是推角色。
  const prevX = p.x;
  const prevZ = p.z;
  p.x += (v.x + world.impulse.x + world.playerHurt.knockX) * dt;
  p.z += (v.z + world.impulse.z + world.playerHurt.knockZ) * dt;

  // 5) 水平碰撞（矮台阶会被跳过，交给第 7 步抬升）
  const wasBlocked = resolveHorizontal(world.boxes, p, cfg.characterRadius, cfg.characterHeight, cfg.stepHeight);
  if (wasBlocked) {
    if (overlapsAny(world.boxes, p, cfg.characterRadius, cfg.characterHeight, cfg.stepHeight)) {
      // 两侧夹住：推出互相抵消，直接回退本帧水平位移
      p.x = prevX;
      p.z = prevZ;
      v.x = 0;
      v.z = 0;
    } else {
      const actualX = p.x - prevX;
      const actualZ = p.z - prevZ;
      if (Math.abs(actualX) < Math.abs(v.x * dt) * 0.5) v.x = 0;
      if (Math.abs(actualZ) < Math.abs(v.z * dt) * 0.5) v.z = 0;
    }
    emit(world, 'blocked', 1);
  }

  // 6) 世界边界：夹紧的同时清掉朝界外的速度 / 击退，
  //    避免「位置被冻住、速度仍是满格」——那会让步态摆幅拉满而相位不动。
  if (p.x < b.minX) {
    p.x = b.minX;
    if (v.x < 0) v.x = 0;
    if (world.playerHurt.knockX < 0) world.playerHurt.knockX = 0;
  } else if (p.x > b.maxX) {
    p.x = b.maxX;
    if (v.x > 0) v.x = 0;
    if (world.playerHurt.knockX > 0) world.playerHurt.knockX = 0;
  }
  if (p.z < b.minZ) {
    p.z = b.minZ;
    if (v.z < 0) v.z = 0;
    if (world.playerHurt.knockZ < 0) world.playerHurt.knockZ = 0;
  } else if (p.z > b.maxZ) {
    p.z = b.maxZ;
    if (v.z > 0) v.z = 0;
    if (world.playerHurt.knockZ > 0) world.playerHurt.knockZ = 0;
  }

  // 7) 自动爬台阶：落地状态下，前方支撑面高度差 <= stepHeight 时直接抬升
  const nearSupport = supportHeight(
    world.boxes, p.x, p.z, p.y, cfg.characterRadius, cfg.stepHeight, cfg.fallTolerance,
  );
  if (c.grounded && nearSupport > p.y + EPS && nearSupport - p.y <= cfg.stepHeight + EPS) {
    p.y = nearSupport;
    v.y = 0;
    emit(world, 'stepUp', nearSupport);
  }

  // 8) 重力 + 垂直积分（refY 取积分前高度，保证下落时仍能找到下方支撑面）
  const refY = p.y;
  v.y -= cfg.gravity * dt;
  p.y += v.y * dt;

  // 9) 落地
  const support = supportHeight(
    world.boxes, p.x, p.z, refY, cfg.characterRadius, cfg.stepHeight, Number.POSITIVE_INFINITY,
  );
  if (support > Number.NEGATIVE_INFINITY && p.y <= support && v.y <= 0) {
    p.y = support;
    v.y = 0;
    if (!c.grounded) emit(world, 'landed', support);
    c.grounded = true;
  } else {
    c.grounded = false;
  }

  // 10) 步态相位（表现层只读，用于程序化驱动关节）
  //     ★ 增量累加（v7c 修复「步频抽动」）：每帧只用「当帧位移 / 当帧步幅」推进相位，
  //       绝不用「累积总里程 / 当前步幅」重算。后者在速度变化（起步加速、松手、转向、
  //       冲刺切换）时会把整段历史相位按新分母重新缩放甚至倒退，表现层腿/手臂就会抽动，
  //       低速时步幅相对变化最大、最明显。增量式让相位永远连续、单调不回退。
  //     步幅随速度温和增大（strideSpeedGain，默认 0.45），抑制高速步频线性飙升，
  //     但不过度压低频率（旧 0.9 系数把高速步频压得太狠，用户反馈「降得有点多」）。
  const frameDist = lengthXZ(p.x - prevX, p.z - prevZ);
  c.distance += frameDist; // 累计里程保留（诊断/统计用），不再参与相位计算
  // v9s.21：步幅改为按「实际位移速度」算，而不是只看 `v`。
  // 攻击 / 翻滚期间位移来自 impulse，`v` 很小（0.3× 甚至 0），
  // 若仍用 `v` 反推步幅，stride 会被压到最小值而 frameDist 却很大 ——
  // 相位一帧推进一两弧度，腿看着在疯转。用实际位移速度，跨步时 stride 同步放大。
  const stepSpeed = frameDist / Math.max(dt, EPS);
  const u = Math.min(cfg.strideSpeedCap, stepSpeed / Math.max(cfg.moveSpeed, EPS));
  const stride = Math.max(cfg.strideLength * (1 + u * cfg.strideSpeedGain), EPS);
  // v9e：把步幅写进状态，表现层据此反推脚前伸距离（stride × reachRatio）→ 支撑脚零滑步。
  // 相位推进与步幅严格配套：一帧推进 frameDist / stride 个周期，脚正好后退同样的距离。
  c.stride = stride;
  // 取模防止长时间运行浮点精度下降；sin/cos 周期连续，跨 TAU→0 不产生视觉跳变
  c.gaitPhase = (c.gaitPhase + (frameDist / stride) * TAU) % TAU;
}

