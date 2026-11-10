import { currentMeleeShape } from './hits';
import { nextRandom } from './random';
import type {
  Box, BreakHit, CactusArm, DestructibleSpec, DestructibleState, Fragment, Intents, World,
} from './types';
import { stepRigid, type RigidBody } from './fragments';

/**
 * v9s.x · 可破坏物件（旗杆 / 坛子 / 仙人掌 / 触发按钮）的确定性断面数学与状态机。
 *
 * 四种物件都按**方盒**渲染（radius = 横截面半边长），但破坏方式不同：
 *  - 旗杆 `pole`：按命中点横向砍断，断下的段成为一块掉落刚体；可**多次砍断**
 *    （每一次都把当前站立段的顶端再砍下一截），剩余站立段递减，断面始终斜切朝攻击方向。
 *  - 坛子 `jar`：命中即**碎裂成多块**方碎块（确定性随机铺放，不用 Math.random），
 *    不再做斜切两段 —— 罐子本就是敞口薄壁，切成两半既不对也不好看。
 *  - 仙人掌 `cactus`：复用旗杆的多段砍物理，但用固定手工调好的萨瓜罗侧臂造型；
 *    砍下的断块是「带侧臂的方盒刚体」飞出（侧臂作为 `Fragment.parts` 挂在主盒上，
 *    随碎片四元数一起翻滚，物理仍只算主盒，保证可序列化 / 确定性）。
 *  - 按钮 `button`：自身不被破坏，被刀砍中后触发 `targetId` 指向的物件
 *    （未断 → 整体砍断掉落，已断 → 复位），作工位上的演示/开关。
 *
 * 掉落的段 / 碎块统一是 `Fragment`（= `RigidBody`）：每帧由 `stepRigid` 按固定步长做
 * 重力 + 地面 / 刚体间碰撞推进。全部状态 plain number，随 World 一起 JSON 快照回放，
 * 因此暂停 / 慢放 / 倒带对掉落碎块天然成立。
 */

const EPS = 1e-6;
const DEG = Math.PI / 180;

/** 站立段保留的最小相对高度：低于此不再砍，留一小截底座。 */
export const MIN_STAND = 0.08;
/**
 * 仙人掌的**视觉半径比例**：碰撞与判定轴按 `radius`，造型按 `radius × 此值`。
 * 柱身画得和碰撞一样粗，远看就读成「一根绿柱子」而不是仙人掌。
 */
export const CACTUS_VIS_RATIO = 0.82;
/** 旧版单段翻倒角常量保留导出，单测仍引用；新物理已不依赖它。 */
export const BREAK_FALL_TARGET = 1.47;

/** 掉落片段的材质 / 初速（确定性，全部可调）。 */
const DENSITY = 12;        // 质量 = 体积 × DENSITY
const INV_I_GAIN = 0.6;    // 标量转动惯量增益
const POLE_KNOCK = 2.4;    // 杆段被砍下时的水平击飞速度（m/s）
const POLE_LIFT = 1.6;     // 杆段上抛速度
const POLE_SPIN = 5.0;     // 杆段初角速度（绕翻倒轴，rad/s）
const JAR_KNOCK = 2.0;     // 碎块径向飞散速度
const JAR_LIFT = 2.2;      // 碎块上抛速度
const REST = 0.28;         // 恢复系数
const FRIC = 0.7;          // 摩擦系数

export type CutOptions = {
  tiltDeg: number;
  bands?: readonly number[];
  pitchGain?: number;
  maxTiltDeg?: number;
  minU?: number;
  maxU?: number;
};

export type CutPlane = {
  u: number;
  theta: number;
  nx: number; ny: number; nz: number;
  ax: number; ay: number; az: number;
};

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 由「命中点 + 攻击方向」求切面。纯函数。
 *  - 断面高度只由命中点 P.y 决定（砍到哪断哪）；
 *  - 法线只由攻击水平投影决定（n = normalize(up + dH·tanθ)），水平挥击不会把杆纵向劈开；
 *  - 从上往下劈时 θ 更大，切口更斜、朝攻击来向。
 */
export function cutPlane(
  hitY: number, baseY: number, height: number, radius: number,
  dx: number, dy: number, dz: number,
  opt: CutOptions,
): CutPlane {
  const h = Math.max(EPS, height);
  const minU = clamp(opt.minU ?? MIN_STAND, 0, 1);
  const maxU = clamp(opt.maxU ?? 0.92, 0, 1);
  let u = clamp((hitY - baseY) / h, minU, maxU);

  const bands = opt.bands;
  if (bands && bands.length > 0) {
    let best = bands[0];
    let bestD = Math.abs(best - u);
    for (let i = 1; i < bands.length; i++) {
      const d = Math.abs(bands[i] - u);
      if (d < bestD) { best = bands[i]; bestD = d; }
    }
    u = clamp(best, minU, maxU);
  }

  const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const ux = dl > EPS ? dx / dl : 0;
  const uy = dl > EPS ? dy / dl : 0;
  const uz = dl > EPS ? dz / dl : 1;
  const hl = Math.sqrt(ux * ux + uz * uz);
  const hx = hl > EPS ? ux / hl : 0;
  const hz = hl > EPS ? uz / hl : 1;

  const pitchGain = opt.pitchGain ?? 0.85;
  const maxTilt = clamp(opt.maxTiltDeg ?? 62, 0, 89) * DEG;
  const pitch = Math.max(0, -uy);
  let theta = Math.min(maxTilt, clamp(opt.tiltDeg, 0, 89) * DEG + pitch * pitchGain);

  const cutH = u * h;
  const room = Math.min(cutH, h - cutH);
  const geoMax = Math.atan(Math.max(0, room * 0.9) / Math.max(EPS, radius));
  theta = Math.min(theta, geoMax);

  const t = Math.tan(theta);
  const invN = 1 / Math.sqrt(1 + t * t);
  return {
    u,
    theta,
    nx: hx * t * invN,
    ny: invN,
    nz: hz * t * invN,
    ax: hz,
    ay: 0,
    az: -hx,
  };
}

/**
 * 方盒四角的截断高度（供表现层重建斜切顶面）。
 *
 * 四角顺序（xz 平面，与几何绕序一致）：BL(-r,-r)、BR(r,-r)、TR(r,r)、TL(-r,r)。
 * 角点 Q = (ox, t, oz) 落在切面 `dot(n, Q - C) = 0` 上，C 的轴心高度 = cutU·height：
 *     t = cutU·height - (nx·ox + nz·oz) / ny
 * 完好态（cutU=1, n=up）所有 t = height，顶面即水平。
 */
export function cutBoxHeights(
  half: number, cutU: number, height: number,
  nx: number, ny: number, nz: number,
): [number, number, number, number] {
  const cutH = cutU * height;
  const invNy = 1 / Math.max(EPS, ny);
  const h = (ox: number, oz: number): number =>
    clamp(cutH - (nx * ox + nz * oz) * invNy, 0, height);
  return [
    h(-half, -half),
    h(half, -half),
    h(half, half),
    h(-half, half),
  ];
}

export function createDestructibleStates(
  specs: readonly DestructibleSpec[] | undefined,
): DestructibleState[] {
  if (!specs || specs.length === 0) return [];
  return specs.map((s) => {
    const seed = s.seed ?? hashStr(s.id);
    const arms = s.kind === 'cactus' ? makeCactusArms(s.height, s.radius, seed) : [];
    const color = s.color ?? (
      s.kind === 'cactus' ? '#3f8f4f'
      : s.kind === 'button' ? '#8a8a8a'
      : '#8a6b4a'
    );
    const cutColor = s.cutColor ?? (
      s.kind === 'cactus' ? '#bfe8b0'
      : s.kind === 'button' ? '#ff5a5a'
      : '#e8c9a0'
    );
    return {
      id: s.id,
      kind: s.kind,
      x: s.x, y: s.y, z: s.z,
      height: s.height,
      radius: s.radius,
      tiltDeg: s.tiltDeg ?? 18,
      pitchGain: s.pitchGain ?? 0.85,
      maxTiltDeg: s.maxTiltDeg ?? 62,
      fallSec: s.fallSec ?? 0.9,
      bands: s.bands ? [...s.bands] : [],
      color,
      cutColor,
      broken: 0,
      standU: 1,
      snx: 0, sny: 1, snz: 0,
      cutU: 1,
      theta: 0,
      nx: 0, ny: 1, nz: 0,
      ax: 0, ay: 0, az: -1,
      brokenAt: 0,
      fragments: [],
      seed,
      arms,
      targetId: s.targetId,
      hitArmed: false,
    };
  });
}

/** 由片段尺寸推导确定性刚体材质（逆质量 / 逆转动惯量）。 */
function material(hx: number, hy: number, hz: number): { invMass: number; invInertia: number } {
  const vol = (2 * hx) * (2 * hy) * (2 * hz);
  const mass = Math.max(1e-4, vol * DENSITY);
  const invMass = 1 / mass;
  const r2 = hx * hx + hy * hy + hz * hz;
  const invInertia = (invMass * INV_I_GAIN) / Math.max(1e-4, r2);
  return { invMass, invInertia };
}

/** FNV-1a 字符串散列 → 32 位无符号整数（确定性，用于从 id 派生种子）。 */
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32：确定性伪随机序列（不依赖 Math.random）。 */
function mulberry32(a: number): () => number {
  let s = a >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 仙人掌侧臂：**固定、手工调好的萨瓜罗造型**（不再随机程序化生成，避免「一堆叉叉」）。
 * 一律 2 条对侧粗短手臂位于上三分之一，手腕明显比主干细但够敦实。尺寸只由主干半径决定
 * （确定性、可被快照 / 回放）。同一个工位上的仙人掌只差大小、不差造型，干净统一。
 */
function makeCactusArms(height: number, radius: number, _seed: number): CactusArm[] {
  void _seed;
  // v9s.61：手腕更细、伸出更短、上扬更长 —— 上一版手臂粗到和主干差不多（0.9 倍直径），
  // 远看是一根柱子上挂着两个钩子；萨瓜罗的识别点是「细腕、短出、明显上折」。
  const armRad = radius * 0.34;
  const outLen = radius * 1.15;   // 水平伸出（刚出主干就上折）
  const upLen = radius * 2.1;     // 末端向上弯
  const arms: CactusArm[] = [
    { atU: 0.52, dx: 1, dz: 0, outLen, upLen, rad: armRad },
    { atU: 0.68, dx: -1, dz: 0, outLen, upLen, rad: armRad },
  ];
  arms.sort((a, b) => a.atU - b.atU);
  void height;
  return arms;
}

/**
 * 侧臂的一段盒子：`cx/cy/cz` 相对「主干轴心 + 分支基点高度」，`h*` 是半长。
 * 上升高度落在 `cy` 上，竖直裁剪只改 `cy` 与 `hy`。
 */
export type CactusArmBox = {
  cx: number; cy: number; cz: number;
  hx: number; hy: number; hz: number;
};

/**
 * 侧臂的盒子分解：**伸出段 → 上扬段 → 方头**。
 *
 * v9s.62：站立造型与断块 `Fragment.parts` **共用这一份**。以前两边各写一套尺寸：
 * 站立按 `full = outLen`，断块按 `half = outLen`（也就是画出来是站立的两倍大），
 * 于是「砍下来的叉比长在上面的叉大一号」，玩家一眼就读出「掉下来的形状变了」。
 * 顺带把「视觉半径 0.82R」也收进来，避免两边各减一次。
 */
export function cactusArmBoxes(a: CactusArm, radius: number): CactusArmBox[] {
  const vr = radius * CACTUS_VIS_RATIO;
  const alongX = Math.abs(a.dx) > 0.5;
  const thick = a.rad * 1.55;   // 伸出段厚度（full）
  const upT = a.rad * 1.3;      // 上扬段厚度（full）
  const tipT = a.rad * 1.15;    // 方头边长（full）
  const cxOut = a.dx * (vr + a.outLen / 2);
  const czOut = a.dz * (vr + a.outLen / 2);
  const cxUp = a.dx * (vr + a.outLen * 0.9);
  const czUp = a.dz * (vr + a.outLen * 0.9);
  return [
    {
      cx: cxOut, cy: 0, cz: czOut,
      hx: (alongX ? a.outLen : thick) / 2, hy: thick / 2,
      hz: (alongX ? thick : a.outLen) / 2,
    },
    { cx: cxUp, cy: a.upLen * 0.5, cz: czUp, hx: upT / 2, hy: a.upLen / 2, hz: upT / 2 },
    { cx: cxUp, cy: a.upLen, cz: czUp, hx: tipT / 2, hy: tipT / 2, hz: tipT / 2 },
  ];
}

/**
 * 把侧臂盒按**世界高度区间** `[loY, hiY]` 竖直裁剪；完全落在区间外返回 null。
 *
 * 断口把一条侧臂切成两半：下半留在桩上（`[0, cutY]`），上半随断块飞走
 * （`[cutY, 上次站立顶]`）。两边用同一个函数、同一套盒子，接缝才对得上。
 */
export function clipArmBox(
  b: CactusArmBox, baseY: number, loY: number, hiY: number,
): CactusArmBox | null {
  const lo = Math.max(baseY + b.cy - b.hy, loY);
  const hi = Math.min(baseY + b.cy + b.hy, hiY);
  if (hi - lo <= 1e-4) return null;
  return {
    cx: b.cx, cy: (lo + hi) / 2 - baseY, cz: b.cz,
    hx: b.hx, hy: (hi - lo) / 2, hz: b.hz,
  };
}

/**
 * 把「本次被切走那一段」里的侧臂转成断块的视觉子盒（`Fragment.parts`）。
 *
 * 判据是 **`cutU < atU ≤ prevStandU`**，不是旧的 `atU > cutU`：
 * 旧判据在第二次砍更低位置时，会把**上一次已经随断块飞走**的侧臂再打包一次 ——
 * 现场就是「砍下来的根再砍一刀，又掉出来一个叉」。
 */
function armParts(
  st: DestructibleState, arms: CactusArm[], cutY: number, prevStandU: number, cy: number,
): Fragment['parts'] {
  const prevTopY = st.y + prevStandU * st.height;
  const out: NonNullable<Fragment['parts']> = [];
  for (const a of arms) {
    const baseY = st.y + a.atU * st.height;
    for (const box of cactusArmBoxes(a, st.radius)) {
      const clipped = clipArmBox(box, baseY, cutY, prevTopY);
      if (!clipped) continue;
      out.push({
        x: clipped.cx,
        y: baseY + clipped.cy - cy,
        z: clipped.cz,
        hx: clipped.hx, hy: clipped.hy, hz: clipped.hz,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}

/** 把一次砍断写入状态并发一条一次性 break 事件。 */
function emitBreak(world: World, st: DestructibleState, idx: number, y: number): void {
  world.events.push({ type: 'break', tick: world.tick, x: st.x, y, z: st.z, value: idx });
}

/**
 * 竖向砍断（旗杆 / 仙人掌共用）：把 [命中点, 当前站立顶] 之间的段切下，成为一块掉落刚体；
 * 剩余站立段顶端更新为新的斜切面。可重复调用 → 多段砍断。
 * 仙人掌会把高于断口的侧臂打包进 `Fragment.parts`，随断块一起翻滚飞出。
 */
function severVertical(
  world: World, st: DestructibleState, idx: number,
  hitY: number, dx: number, dy: number, dz: number,
): void {
  const standTopY = st.y + st.standU * st.height;
  const cutY = clamp(hitY, st.y + MIN_STAND * st.height, standTopY);
  const cutU = (cutY - st.y) / st.height;

  // 命中点已高于当前站立顶（该段此前已被砍掉）→ 无可砍段，直接返回。
  // 否则单次挥砍跨多帧在同一高度会重复生成「零高碎片」：表现为断枝浮空立起、越砍越多。
  if (cutU >= st.standU - 1e-3) return;

  const p = cutPlane(
    cutY, st.y, st.height, st.radius, dx, dy, dz,
    { tiltDeg: st.tiltDeg, bands: st.bands, pitchGain: st.pitchGain, maxTiltDeg: st.maxTiltDeg, minU: MIN_STAND, maxU: st.standU },
  );

  const segLo = cutU;
  const segHi = st.standU;
  const segH = (segHi - segLo) * st.height;
  const cy = st.y + (segLo + segHi) * 0.5 * st.height;
  const mat = material(st.radius, segH * 0.5, st.radius);

  // 水平攻击方向（用于击飞与翻倒轴）
  const hl = Math.hypot(dx, dz);
  const dirx = hl > EPS ? dx / hl : 1;
  const dirz = hl > EPS ? dz / hl : 0;

  const parts = st.kind === 'cactus'
    ? armParts(st, st.arms, cutY, st.standU, cy)
    : undefined;

  const frag: Fragment = {
    x: st.x, y: cy, z: st.z,
    hx: st.radius, hy: segH * 0.5, hz: st.radius,
    qw: 1, qx: 0, qy: 0, qz: 0,
    vx: dirx * POLE_KNOCK, vy: POLE_LIFT, vz: dirz * POLE_KNOCK,
    wx: p.ax * POLE_SPIN, wy: p.ay * POLE_SPIN, wz: p.az * POLE_SPIN,
    invMass: mat.invMass, invInertia: mat.invInertia,
    restitution: REST, friction: FRIC,
    rest: 0, restT: 0,
    parts,
  };
  st.fragments.push(frag);

  st.standU = cutU;
  st.snx = p.nx; st.sny = p.ny; st.snz = p.nz;
  st.broken += 1;
  st.cutU = cutU; st.theta = p.theta;
  st.nx = p.nx; st.ny = p.ny; st.nz = p.nz;
  st.ax = p.ax; st.ay = p.ay; st.az = p.az;
  st.brokenAt = world.time;
  emitBreak(world, st, idx, cutY);
}

/**
 * 坛子碎裂：把整只罐子切成 N 块方碎块（确定性随机铺放），全部成为掉落刚体。
 * 用 world.rngState 推进，因此同输入同结果、可被快照回放。
 */
function shatterJar(
  world: World, st: DestructibleState, idx: number,
  hitY: number, dx: number, dy: number, dz: number,
): void {
  // 由尺寸估算碎块数（小罐少、大罐多），确定性、范围夹紧。
  const approx = Math.round(st.height * st.radius * 30);
  const n = clamp(approx, 6, 12);

  // 立方铺放网格（接近 n 的立方根）
  let g = 2;
  while (g * g * g < n) g++;
  const cells = g * g * g;
  const cellW = (2 * st.radius) / g;
  const cellH = st.height / g;
  const r2 = st.radius;

  // 爆裂中心：命中点
  const burstX = st.x;
  const burstY = clamp(hitY, st.y + 0.05, st.y + st.height - 0.05);
  const burstZ = st.z;

  const frags: Fragment[] = [];
  let made = 0;
  for (let ix = 0; ix < g && made < cells; ix++) {
    for (let iy = 0; iy < g && made < cells; iy++) {
      for (let iz = 0; iz < g && made < cells; iz++) {
        // 跳过离爆裂点太远的格子，让碎块更集中、数量更贴近 n
        const cx = st.x - r2 + (ix + 0.5) * cellW;
        const cy = st.y + (iy + 0.5) * cellH;
        const cz = st.z - r2 + (iz + 0.5) * cellW;
        const jx = (nextRandom(world) - 0.5) * cellW * 0.4;
        const jy = (nextRandom(world) - 0.5) * cellH * 0.4;
        const jz = (nextRandom(world) - 0.5) * cellW * 0.4;
        const ox = cx + jx, oy = cy + jy, oz = cz + jz;

        const hxf = (cellW * 0.5) * (0.72 + nextRandom(world) * 0.22);
        const hyf = (cellH * 0.5) * (0.72 + nextRandom(world) * 0.22);
        const hzf = (cellW * 0.5) * (0.72 + nextRandom(world) * 0.22);
        const mat = material(hxf, hyf, hzf);

        // 飞散方向：从爆裂中心指向碎块，外加一点上抛
        let rx = ox - burstX, ry = oy - burstY, rz = oz - burstZ;
        const rl = Math.hypot(rx, ry, rz) || 1;
        rx /= rl; ry /= rl; rz /= rl;
        if (rl < 1e-3) { rx = dirRand(world); ry = 0; rz = dirRand(world); }
        const spin = 4 + nextRandom(world) * 5;

        frags.push({
          x: ox, y: oy, z: oz,
          hx: hxf, hy: hyf, hz: hzf,
          qw: 1, qx: 0, qy: 0, qz: 0,
          vx: rx * JAR_KNOCK, vy: JAR_LIFT + nextRandom(world) * 1.2, vz: rz * JAR_KNOCK,
          wx: (nextRandom(world) - 0.5) * spin,
          wy: (nextRandom(world) - 0.5) * spin,
          wz: (nextRandom(world) - 0.5) * spin,
          invMass: mat.invMass, invInertia: mat.invInertia,
          restitution: REST, friction: FRIC,
          rest: 0, restT: 0,
        });
        made++;
      }
    }
  }
  st.fragments = frags;
  st.broken = 1;
  st.standU = 0;
  st.cutU = 0; st.theta = 0;
  st.nx = 0; st.ny = 1; st.nz = 0;
  st.ax = 0; st.ay = 0; st.az = -1;
  st.brokenAt = world.time;
  emitBreak(world, st, idx, burstY);
  void dx; void dy; void dz;
}

/** 确定性水平随机方向分量（[-1,1)）。 */
function dirRand(world: World): number {
  return nextRandom(world) * 2 - 1;
}

/** 按钮触发：被砍中后作用于 targetId 指向的物件。未断→整体砍断掉落，已断→复位。 */
function triggerTarget(world: World, btn: DestructibleState, _idx: number): void {
  const list = world.destructibles;
  if (!list || !btn.targetId) return;
  const t = list.find((s) => s.id === btn.targetId);
  if (!t) return;
  if (t.kind === 'pole' || t.kind === 'cactus') {
    if (t.standU > MIN_STAND + 1e-3) {
      const tIdx = list.indexOf(t);
      // 整体砍断：从接近底座处把整段（含其上所有侧臂）作为一块断块掉出
      severVertical(world, t, tIdx, t.y + (MIN_STAND + 0.001) * t.height, 1, 0, 0);
    } else {
      resetDestructible(world, t.id);
    }
    return;
  }
  // jar 等其它类型：直接复位
  resetDestructible(world, t.id);
}

/** 复位单个物件到完好直立、清空片段（按钮触发 / 复位演示用）。 */
export function resetDestructible(world: World, id: string): void {
  const st = world.destructibles?.find((s) => s.id === id);
  if (!st) return;
  st.broken = 0;
  st.standU = 1;
  st.snx = 0; st.sny = 1; st.snz = 0;
  st.cutU = 1; st.theta = 0;
  st.nx = 0; st.ny = 1; st.nz = 0;
  st.ax = 0; st.ay = 0; st.az = -1;
  st.brokenAt = 0;
  st.fragments = [];
  st.hitArmed = false;
}

/** v9s.60 · 站立段的碰撞盒 id 前缀（`world.boxes` 里用它反查）。 */
export const DEST_BOX_PREFIX = 'dest-';

/**
 * v9s.60 · 可破坏物件的碰撞盒。
 *
 * 之前这些东西**没有任何碰撞**：玩家能直接从仙人掌 / 旗杆中间穿过去，
 * 砍断之后也没有「东西没了、路通了」的反馈 —— 读起来像贴在场景上的贴纸。
 *
 * 用 `kind: 'obstacle'` 复用既有白盒：`resolveHorizontal` 只看 AABB，
 * 不需要为可破坏物新增一套碰撞路径；断到只剩底座时把 `maxY` 压到地面，
 * AABB 高度退化为 0，玩家自然就穿得过去了。
 */
export function destructibleColliders(
  states: readonly DestructibleState[],
): Box[] {
  const out: Box[] = [];
  for (const s of states) {
    out.push({
      id: `${DEST_BOX_PREFIX}${s.id}`,
      kind: 'obstacle',
      minX: s.x - s.radius,
      maxX: s.x + s.radius,
      minY: s.y,
      maxY: s.y + s.height * (s.standU > 0 ? s.standU : 1),
      minZ: s.z - s.radius,
      maxZ: s.z + s.radius,
    });
  }
  return out;
}

/**
 * 每帧把碰撞盒顶面同步到当前站立段高度。
 *
 * 不重建 boxes：数组会被移动 / 相机 / 贴地特效用同一个引用读，
 * 替换数组会让它们读到上一帧的旧引用。原地改 `maxY` 是零分配且安全的。
 */
export function syncDestructibleBoxes(world: World): void {
  const list = world.destructibles;
  if (!list || list.length === 0 || world.boxes.length === 0) return;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    const id = `${DEST_BOX_PREFIX}${st.id}`;
    let box: Box | undefined;
    for (let j = 0; j < world.boxes.length; j++) {
      if (world.boxes[j].id === id) { box = world.boxes[j]; break; }
    }
    if (!box) continue;
    // 断到只剩底座 / 坛子碎了 → 顶面压回地面：AABB 高度为 0，碰撞自动失效
    const gone = st.standU <= MIN_STAND || (st.kind === 'jar' && st.broken !== 0);
    box.maxY = gone ? box.minY : st.y + st.standU * st.height;
  }
}

export function forceBreak(
  world: World, id: string, hitY: number,
  dx: number, dy: number, dz: number,
): boolean {
  const list = world.destructibles;
  if (!list) return false;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    if (st.id !== id) continue;
    if (st.kind === 'pole' || st.kind === 'cactus') {
      if (st.standU <= MIN_STAND) return false;
      severVertical(world, st, i, hitY, dx, dy, dz);
      return true;
    }
    if (st.kind === 'jar') {
      if (st.broken !== 0) return false;
      shatterJar(world, st, i, hitY, dx, dy, dz);
      return true;
    }
    if (st.kind === 'button') {
      triggerTarget(world, st, i);
      return true;
    }
  }
  return false;
}

/**
 * 每帧更新：先消费本帧 3D 命中（用 currentMeleeShape 作时间闸门），再推进所有掉落刚体。
 * 多段砍断 / 碎裂后的物理由 `stepRigid` 确定性积分，暂停 / 慢放 / 快照回放都成立。
 */
export function destructiblesUpdate(world: World, dt: number, intents: Intents): void {
  const list = world.destructibles;
  if (!list || list.length === 0 || !world.modules.destructibles) return;

  const hits: readonly BreakHit[] = intents.breakHits ?? [];
  const shape = hits.length > 0 ? currentMeleeShape(world) : null;
  const shapeOn = !!shape && (shape.active || shape.slamRadius > 0);
  // v9s.60：命中候选是**上一帧**渲染时采样、这一帧才进 Core 的。如果挥砍正好在
  // 这一步结束，`shape` 已经关闭，这批候选会被整条丢掉 —— 表现就是「明明砍到了却没断」。
  // 允许「上一帧还在刀风窗口内」再收一批，只放一个 tick，靠 hitArmed 去重。
  const gate = shapeOn || (hits.length > 0 && world.meleeGatePrev);

  // 本帧被刀刃命中的物件 id 集合（用于挥砍闸门：一次连续挥砍只破坏一次）
  const hitIds = gate ? new Set<string>() : null;

  if (gate && shape) {
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i];
      let idx = -1;
      for (let j = 0; j < list.length; j++) if (list[j].id === hit.id) { idx = j; break; }
      if (idx < 0) continue;
      const st = list[idx];
      hitIds!.add(st.id);
      // 本段挥砍已对该物件触发过破坏 → 跳过，直到刀刃离开再重新武装。
      // 否则一刀扫下会在多帧各砍一刀，把物件切成一堆互相重叠、初始零速的薄片：
      // 视觉上就是「断枝浮空立起来 / 越砍越多 / 互相穿透」。
      if (st.hitArmed) continue;
      st.hitArmed = true;
      if (st.kind === 'pole' || st.kind === 'cactus') {
        if (st.standU <= MIN_STAND) continue;
        severVertical(world, st, idx, hit.y, hit.dx, hit.dy, hit.dz);
      } else if (st.kind === 'jar') {
        if (st.broken !== 0) continue;
        shatterJar(world, st, idx, hit.y, hit.dx, hit.dy, hit.dz);
      } else if (st.kind === 'button') {
        triggerTarget(world, st, idx);
      }
    }
  }

  world.meleeGatePrev = shapeOn;

  // 挥砍闸门清除：刀刃本帧未命中的物件，解除武装以便下次挥砍重新触发。
  // 不在命中窗口内时也全部解除（意味刀刃已离开）。
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    if (hitIds && hitIds.has(st.id)) continue;
    st.hitArmed = false;
  }

  // v9s.60：碰撞盒跟着站立段走（断一段，路就矮一段 / 断完就通了）
  syncDestructibleBoxes(world);

  // 物理推进：每个有片段的物件，把站立段当静止碰撞体并入求解。
  const gravity = world.config.gravity;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    if (!st.fragments || st.fragments.length === 0) continue;
    const bodies: RigidBody[] = st.fragments.slice();
    if ((st.kind === 'pole' || st.kind === 'cactus') && st.standU > 0.02) {
      const halfH = st.standU * st.height * 0.5;
      bodies.push({
        x: st.x, y: st.y + halfH, z: st.z,
        hx: st.radius, hy: halfH, hz: st.radius,
        qw: 1, qx: 0, qy: 0, qz: 0,
        vx: 0, vy: 0, vz: 0, wx: 0, wy: 0, wz: 0,
        invMass: 0, invInertia: 0, restitution: 0, friction: 0, rest: 0, restT: 0,
      });
    }
    stepRigid(bodies, dt, st.y, gravity);
  }
}

/** 复位：回到完好直立、清空片段。 */
export function destructiblesReset(world: World): void {
  const list = world.destructibles;
  if (!list) return;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    st.broken = 0;
    st.standU = 1;
    st.snx = 0; st.sny = 1; st.snz = 0;
    st.cutU = 1;
    st.theta = 0;
    st.nx = 0; st.ny = 1; st.nz = 0;
    st.ax = 0; st.ay = 0; st.az = -1;
    st.brokenAt = 0;
    st.fragments = [];
    st.hitArmed = false;
  }
}
