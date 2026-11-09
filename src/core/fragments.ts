/**
 * v9s.x · 确定式刚体求解器（掉落片段专用）。
 *
 * 需求：旗杆被砍下的段、罐子碎裂的碎块，要像真实刚体一样——
 * 受重力下坠、翻滚、落地后带轻微弹跳与摩擦、彼此之间以及与站立段发生碰撞。
 *
 * 设计纪律（与本项目快照 / 回放一致）：
 *  - **零随机**：全程不调用 Math.random，只用 sqrt / atan2 / 三角函数等确定式运算，
 *    因此同输入同帧数 → 同结果，暂停 / 慢放 / 倒带对掉落碎块天然成立。
 *  - **纯数据**：`RigidBody` 全是 plain number，可被 JSON 序列化、随 World 一起快照。
 *  - **固定步长**：由 step 用 `world.config.fixedDt` 驱动，不读帧时间之外的状态。
 *
 * 算法：顺序冲量法（sequential impulse）的轻量版——
 *  1) 积分动态体（重力 + 欧拉位移 + 四元数刚体旋转）；
 *  2) 收集接触：每个动态体对地面（最低角点）做接触，再对所有刚体两两 OBB-SAT；
 *  3) 每个接触沿最小穿透轴施加法向冲量（带恢复系数）+ 切向摩擦冲量 + 位置修正；
 *  4) 低速持续一小段时间后休眠，碰撞显著时唤醒。
 *
 * 转动惯量用标量近似（invInertia），对一堆方盒碎块的观感足够、且数值稳定。
 */

/** 刚体（动态片段与瞬时静止碰撞体共用同一结构）。 */
export type RigidBody = {
  /** 世界中心 */
  x: number; y: number; z: number;
  /** 半长（box 半边长，米） */
  hx: number; hy: number; hz: number;
  /** 朝向四元数 */
  qw: number; qx: number; qy: number; qz: number;
  /** 线速度 */
  vx: number; vy: number; vz: number;
  /** 角速度（世界轴 × 速率，弧度/秒） */
  wx: number; wy: number; wz: number;
  /** 逆质量（0 = 静止，不参与积分）；逆转动惯量（标量近似） */
  invMass: number; invInertia: number;
  /** 恢复系数 / 摩擦系数 */
  restitution: number; friction: number;
  /** 1 = 已休眠（速度归零、只当碰撞体）；0 = 动态 */
  rest: number;
  /** 连续低速时长（秒） */
  restT: number;
};

const SLEEP_VEL = 0.55;     // 线速度 + 角速度（按尺寸缩放）低于此值才开始计时休眠
const SLEEP_SEC = 0.5;      // 连续低速超过此秒数才真正休眠
const WAKE_MOTION = 0.8;    // 接触且速度低于此值视为「贴地慢速」，额外阻尼帮助落定
const WAKE_IMPULSE = 0.25;  // 法向冲量大于此值唤醒休眠体
const SLOP = 0.004;         // 允许的残余穿透，避免抖动
const CORRECT = 0.6;        // 位置修正比例（Baumgarte 风格）
const ITER = 6;             // 每帧顺序冲量迭代次数（多迭代让贴地接触更稳）
const LIN_DAMP = 0.8;       // 线速度阻尼（1/s），让残余滑动一定收敛
const ANG_DAMP = 1.6;       // 角速度阻尼（1/s），让残余翻滚一定收敛
const CONTACT_DAMP = 0.82;  // 贴地慢速时的额外阻尼（每帧），消灭落定前的微抖 / 晃动
const BOUNCE_VMIN = 0.6;    // 法向接近速度低于此值不再弹跳（只滑 / 停），消除落地抖动

type Vec3 = { x: number; y: number; z: number };

function v(x: number, y: number, z: number): Vec3 { return { x, y, z }; }
function cross(a: Vec3, b: Vec3): Vec3 {
  return v(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}
function dot(a: Vec3, b: Vec3): number { return a.x * b.x + a.y * b.y + a.z * b.z; }

/** 用四元数旋转一个向量（v 视为纯四元数；q 单位四元数）。 */
export function qRotate(
  qw: number, qx: number, qy: number, qz: number,
  vx: number, vy: number, vz: number,
): Vec3 {
  // t = 2 * cross(q.xyz, v)
  const tx = 2 * (qy * vz - qz * vy);
  const ty = 2 * (qz * vx - qx * vz);
  const tz = 2 * (qx * vy - qy * vx);
  // v + qw*t + cross(q.xyz, t)
  return v(
    vx + qw * tx + (qy * tz - qz * ty),
    vy + qw * ty + (qz * tx - qx * tz),
    vz + qw * tz + (qx * ty - qy * tx),
  );
}

/** 四元数乘法 a*b（假设均为单位四元数）。 */
function qMul(
  aw: number, ax: number, ay: number, az: number,
  bw: number, bx: number, by: number, bz: number,
): [number, number, number, number] {
  return [
    aw * bw - ax * bx - ay * by - az * bz,
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
  ];
}

/** 轴角 → 四元数（axis 需为单位向量）。 */
function qFromAxisAngle(ax: number, ay: number, az: number, angle: number): [number, number, number, number] {
  const h = angle * 0.5;
  const s = Math.sin(h);
  return [Math.cos(h), ax * s, ay * s, az * s];
}

/** OBB 的 8 个世界角点。导出供测试断言「片段未穿地」使用。 */
export function obbCorners(b: RigidBody): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < 8; i++) {
    const sx = (i & 1) ? b.hx : -b.hx;
    const sy = (i & 2) ? b.hy : -b.hy;
    const sz = (i & 4) ? b.hz : -b.hz;
    const r = qRotate(b.qw, b.qx, b.qy, b.qz, sx, sy, sz);
    out.push(v(b.x + r.x, b.y + r.y, b.z + r.z));
  }
  return out;
}

/** OBB 沿世界方向 dir 的支撑点（最远点）。 */
function obbSupport(b: RigidBody, dir: Vec3): Vec3 {
  // 把方向转到物体局部
  const inv = qRotate(b.qw, -b.qx, -b.qy, -b.qz, dir.x, dir.y, dir.z);
  const lx = inv.x >= 0 ? b.hx : -b.hx;
  const ly = inv.y >= 0 ? b.hy : -b.hy;
  const lz = inv.z >= 0 ? b.hz : -b.hz;
  const r = qRotate(b.qw, b.qx, b.qy, b.qz, lx, ly, lz);
  return v(b.x + r.x, b.y + r.y, b.z + r.z);
}

/** 把方向投影到 OBB（用其 3 条局部轴在世界上表示）求投影半径。 */
function obbRadius(b: RigidBody, axis: Vec3): number {
  const ax = qRotate(b.qw, b.qx, b.qy, b.qz, 1, 0, 0);
  const ay = qRotate(b.qw, b.qx, b.qy, b.qz, 0, 1, 0);
  const az = qRotate(b.qw, b.qx, b.qy, b.qz, 0, 0, 1);
  return (
    b.hx * Math.abs(dot(axis, ax)) +
    b.hy * Math.abs(dot(axis, ay)) +
    b.hz * Math.abs(dot(axis, az))
  );
}

type Contact = {
  a: RigidBody;
  b: RigidBody | null; // null = 地面（无限质量）
  n: Vec3;             // 由 a 指向 b（地面时指向上方）
  p: Vec3;             // 接触点（用于产生力矩）
  depth: number;
};

/** 两 OBB 的最小穿透轴（SAT，15 轴）。无碰撞返回 null。axis 指向 a→b。 */
function obbSat(a: RigidBody, b: RigidBody): { axis: Vec3; depth: number } | null {
  const axes: Vec3[] = [];
  for (let i = 0; i < 3; i++) {
    axes.push(qRotate(a.qw, a.qx, a.qy, a.qz, i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0));
    axes.push(qRotate(b.qw, b.qx, b.qy, b.qz, i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0));
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const ca = qRotate(a.qw, a.qx, a.qy, a.qz, i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0);
      const cb = qRotate(b.qw, b.qx, b.qy, b.qz, j === 0 ? 1 : 0, j === 1 ? 1 : 0, j === 2 ? 1 : 0);
      const c = cross(ca, cb);
      if (c.x === 0 && c.y === 0 && c.z === 0) continue;
      const len = Math.hypot(c.x, c.y, c.z);
      axes.push(v(c.x / len, c.y / len, c.z / len));
    }
  }
  const d = v(b.x - a.x, b.y - a.y, b.z - a.z);
  let bestAxis: Vec3 | null = null;
  let bestDepth = -Infinity;
  for (const axis of axes) {
    const ra = obbRadius(a, axis);
    const rb = obbRadius(b, axis);
    const dist = dot(d, axis);
    const overlap = ra + rb - Math.abs(dist);
    if (overlap <= 0) return null;
    if (overlap > bestDepth) {
      bestDepth = overlap;
      bestAxis = dist < 0 ? v(-axis.x, -axis.y, -axis.z) : v(axis.x, axis.y, axis.z);
    }
  }
  return bestAxis ? { axis: bestAxis, depth: bestDepth } : null;
}

/**
 * 沿法向 n（世界）、接触点 p 施加一次速度冲量（带恢复 + 摩擦）。
 * 注意：**位置修正不在这里做**——位置修正在每帧只施加一次（见 stepRigid 的
 * 独立流程），避免被顺序冲量的 ITER 次迭代重复叠加导致过修正、物体被反复弹起。
 */
function resolveVelocity(c: Contact, restitution: number): void {
  const a = c.a;
  const b = c.b;
  const bInvMass = b ? b.invMass : 0;
  const bInvInertia = b ? b.invInertia : 0;
  const invSum = a.invMass + bInvMass;
  if (invSum === 0) return;

  const ra = v(c.p.x - a.x, c.p.y - a.y, c.p.z - a.z);
  const rb = b ? v(c.p.x - b.x, c.p.y - b.y, c.p.z - b.z) : v(0, 0, 0);

  // 接触点相对速度（A 相对 B）；n 指向 B→A，接近时 vn<0
  const va = v(a.vx + (a.wy * ra.z - a.wz * ra.y), a.vy + (a.wz * ra.x - a.wx * ra.z), a.vz + (a.wx * ra.y - a.wy * ra.x));
  const vb = b
    ? v(b.vx + (b.wy * rb.z - b.wz * rb.y), b.vy + (b.wz * rb.x - b.wx * rb.z), b.vz + (b.wx * rb.y - b.wy * rb.x))
    : v(0, 0, 0);
  const rv = v(va.x - vb.x, va.y - vb.y, va.z - vb.z);
  const vn = dot(rv, c.n);

  // 角向项：invInertia * |r × n|²
  const ca = cross(ra, c.n);
  const cb = b ? cross(rb, c.n) : v(0, 0, 0);
  const angTerm = a.invInertia * (ca.x * ca.x + ca.y * ca.y + ca.z * ca.z)
    + bInvInertia * (cb.x * cb.x + cb.y * cb.y + cb.z * cb.z);
  const denom = invSum + angTerm;
  if (denom <= 0) return;

  let jn = 0;
  if (vn < 0) {
    // 慢速接触不弹跳（只滑 / 停），消除落地后的无限微抖；快速撞击才恢复
    const e = -vn > BOUNCE_VMIN ? restitution : 0;
    jn = -(1 + e) * vn / denom;
    applyImpulse(a, b, c.n, ra, rb, jn);
  }

  // 摩擦（用更新后的相对速度）
  const va2 = v(a.vx + (a.wy * ra.z - a.wz * ra.y), a.vy + (a.wz * ra.x - a.wx * ra.z), a.vz + (a.wx * ra.y - a.wy * ra.x));
  const vb2 = b
    ? v(b.vx + (b.wy * rb.z - b.wz * rb.y), b.vy + (b.wz * rb.x - b.wx * rb.z), b.vz + (b.wx * rb.y - b.wy * rb.x))
    : v(0, 0, 0);
  const rv2 = v(va2.x - vb2.x, va2.y - vb2.y, va2.z - vb2.z);
  const vt = v(rv2.x - c.n.x * dot(rv2, c.n), rv2.y - c.n.y * dot(rv2, c.n), rv2.z - c.n.z * dot(rv2, c.n));
  const vtLen = Math.hypot(vt.x, vt.y, vt.z);
  if (vtLen > 1e-5) {
    const tx = vt.x / vtLen, ty = vt.y / vtLen, t2 = v(tx, ty, vt.z / vtLen);
    const caT = cross(ra, t2);
    const cbT = b ? cross(rb, t2) : v(0, 0, 0);
    const angT = a.invInertia * (caT.x * caT.x + caT.y * caT.y + caT.z * caT.z)
      + bInvInertia * (cbT.x * cbT.x + cbT.y * cbT.y + cbT.z * cbT.z);
    const denomT = invSum + angT;
    if (denomT > 0) {
      let jt = -vtLen / denomT;
      const maxF = (a.friction + (b ? b.friction : a.friction)) * 0.5 * Math.max(0, jn);
      if (jt > maxF) jt = maxF;
      if (jt < -maxF) jt = -maxF;
      applyImpulse(a, b, t2, ra, rb, jt);
    }
  }

  // 显著法向冲量唤醒休眠体（位置修正不唤醒，避免静摩擦下的误唤醒）
  if (jn > WAKE_IMPULSE) {
    if (a.rest) { a.rest = 0; a.restT = 0; }
    if (b && b.rest) { b.rest = 0; b.restT = 0; }
  }
}

/** 位置修正（Baumgarte 风格），每帧只调用一次。按逆质量分配，静止体不动。 */
function correctPosition(c: Contact): void {
  const a = c.a;
  const b = c.b;
  const bInvMass = b ? b.invMass : 0;
  const invSum = a.invMass + bInvMass;
  if (invSum === 0) return;
  const corr = Math.max(c.depth - SLOP, 0) * CORRECT;
  if (corr <= 0) return;
  const aShare = a.invMass / invSum;
  const bShare = bInvMass / invSum;
  a.x += c.n.x * corr * aShare;
  a.y += c.n.y * corr * aShare;
  a.z += c.n.z * corr * aShare;
  if (b) {
    b.x -= c.n.x * corr * bShare;
    b.y -= c.n.y * corr * bShare;
    b.z -= c.n.z * corr * bShare;
  }
}

function applyImpulse(
  a: RigidBody, b: RigidBody | null, n: Vec3, ra: Vec3, rb: Vec3, j: number,
): void {
  // 标准顺序冲量：A 受 +j·n，B 受 -j·n（n 由 A 指向 B，故 A 被推离 B）
  a.vx += n.x * j * a.invMass;
  a.vy += n.y * j * a.invMass;
  a.vz += n.z * j * a.invMass;
  const wa = cross(ra, n);
  a.wx += a.invInertia * (wa.x * j);
  a.wy += a.invInertia * (wa.y * j);
  a.wz += a.invInertia * (wa.z * j);
  if (b) {
    b.vx -= n.x * j * b.invMass;
    b.vy -= n.y * j * b.invMass;
    b.vz -= n.z * j * b.invMass;
    const wb = cross(rb, n);
    b.wx -= b.invInertia * (wb.x * j);
    b.wy -= b.invInertia * (wb.y * j);
    b.wz -= b.invInertia * (wb.z * j);
  }
}

/**
 * 推进一组刚体一帧（固定步长 dt）。
 *
 * `groundY` 为地面世界高度（一般是物件底面 y）。站立段由调用方以 invMass=0 的
 * 瞬时刚体并入 `bodies`，从而让掉落片段与它发生碰撞。
 */
export function stepRigid(bodies: RigidBody[], dt: number, groundY: number, gravity: number): void {
  // 1) 积分动态体
  for (const b of bodies) {
    if (b.invMass === 0 || b.rest) continue;
    b.vy -= gravity * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.z += b.vz * dt;
    // 轻微线性 / 角速度阻尼：保证残余滑动与翻滚最终收敛到休眠，而非无限微抖
    const ld = 1 / (1 + LIN_DAMP * dt);
    const ad = 1 / (1 + ANG_DAMP * dt);
    b.vx *= ld; b.vy *= ld; b.vz *= ld;
    b.wx *= ad; b.wy *= ad; b.wz *= ad;
    const wlen = Math.hypot(b.wx, b.wy, b.wz);
    if (wlen > 1e-9) {
      const [dqw, dqx, dqy, dqz] = qFromAxisAngle(b.wx / wlen, b.wy / wlen, b.wz / wlen, wlen * dt);
      const [nw, nx, ny, nz] = qMul(dqw, dqx, dqy, dqz, b.qw, b.qx, b.qy, b.qz);
      const il = 1 / Math.hypot(nw, nx, ny, nz);
      b.qw = nw * il; b.qx = nx * il; b.qy = ny * il; b.qz = nz * il;
    }
  }

  // 2) 收集接触
  const contacts: Contact[] = [];
  const contacted = new Array<boolean>(bodies.length).fill(false);
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];
    if (a.invMass === 0) continue;
    // 地面：对每个低于地面的角点各生成一个向上接触（n 向上）。
    // 多于一个角点时，倾斜 / 翻倒的盒子会自然「坐」在棱或面上，而非单角悬停，
    // 从而真正落定；配合每帧仅一次的位置修正，避免反复弹起。
    const corners = obbCorners(a);
    for (const c of corners) {
      const pen = groundY - c.y;
      if (pen > 0) {
        contacted[i] = true;
        contacts.push({ a, b: null, n: v(0, 1, 0), p: c, depth: pen });
      }
    }
    // 两两 OBB
    for (let j = i + 1; j < bodies.length; j++) {
      const o = obbSat(a, bodies[j]);
      if (!o) continue;
      const pa = obbSupport(a, o.axis);
      const pb = obbSupport(bodies[j], v(-o.axis.x, -o.axis.y, -o.axis.z));
      const p = v((pa.x + pb.x) * 0.5, (pa.y + pb.y) * 0.5, (pa.z + pb.z) * 0.5);
      // n 统一为「由 B 指向 A」的推出方向，与冲量 / 位置修正共用同一约定
      contacted[i] = true;
      contacted[j] = true;
      contacts.push({ a, b: bodies[j], n: v(-o.axis.x, -o.axis.y, -o.axis.z), p, depth: o.depth });
    }
  }

  // 3) 顺序冲量求解（只改速度，ITER 次迭代收敛）
  for (let it = 0; it < ITER; it++) {
    for (const c of contacts) {
      resolveVelocity(c, Math.min(c.a.restitution, c.b ? c.b.restitution : c.a.restitution));
    }
  }

  // 4) 位置修正（每帧只做一次，消除累积穿透且不过度弹起）
  for (const c of contacts) correctPosition(c);

  // 4) 休眠判定
  for (let bi = 0; bi < bodies.length; bi++) {
    const b = bodies[bi];
    if (b.invMass === 0) continue;
    const size = b.hx + b.hy + b.hz;
    const motion = Math.hypot(b.vx, b.vy, b.vz) + size * Math.hypot(b.wx, b.wy, b.wz);
    // 贴地 / 贴体且慢速：额外阻尼，消灭落定前的微抖与晃动（避免永不休眠）
    if (contacted[bi] && motion < WAKE_MOTION) {
      b.vx *= CONTACT_DAMP; b.vy *= CONTACT_DAMP; b.vz *= CONTACT_DAMP;
      b.wx *= CONTACT_DAMP; b.wy *= CONTACT_DAMP; b.wz *= CONTACT_DAMP;
    }
    if (motion < SLEEP_VEL) {
      b.restT += dt;
      if (b.restT >= SLEEP_SEC && !b.rest) {
        b.rest = 1; b.vx = b.vy = b.vz = 0; b.wx = b.wy = b.wz = 0;
      }
    } else {
      b.restT = 0;
    }
  }
}
