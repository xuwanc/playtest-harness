import { currentMeleeShape } from './hits';
import type { BreakHit, DestructibleSpec, DestructibleState, Intents, World } from './types';

/**
 * v9s.x · 可破坏物件（瓶罐 / 旗杆）的确定性断面数学与状态机。
 *
 * ## 三个正交量（不要混为一谈）
 *  - 断面高度 h：只由**命中点 P.y** 决定 → `u = (P.y - baseY) / height`。
 *    「站高处打从高处断」是它的自然结果，不需要任何高度分支。
 *  - 切面法线 n：只由**攻击方向 d** 决定。刻意不让 n = d —— 水平挥击时 d 是水平的，
 *    那样会得到竖直切面，把杆「纵向劈开」而不是「横向砍断」。
 *    这里 n 恒以竖直为主，只把 d 的水平投影当作倾斜倾向：
 *        n = normalize(up + dH·tanθ)
 *    从上往下劈时 d 的向下分量让 θ 变大，切口自然更斜、朝向攻击来向。
 *  - 断后运动：上半截是独立刚体，绕 `cross(up, dH)` 轴朝攻击去向翻倒。
 *
 * 全部状态是 plain number / 数组，随 World 一起 JSON 序列化、快照、回放；
 * 表现层只读，符合 ADR-002 与 check-boundary 的可移植契约。
 */

const EPS = 1e-6;
const DEG = Math.PI / 180;

/** 上半截最终翻倒角（弧度，≈84°），不到 90° 以免完全贴地穿模。 */
export const BREAK_FALL_TARGET = 1.47;

/** 切面参数（全部可选，缺省值让「只给一个 tiltDeg」就能用）。 */
export type CutOptions = {
  /** 水平挥击时的基础切面倾角（度），0 = 纯水平断面 */
  tiltDeg: number;
  /** 预设断裂带（相对高度 0..1）；非空时命中高度吸附到最近带，瓶罐用 */
  bands?: readonly number[];
  /** 攻击向下分量对倾角的放大系数（弧度 / 单位 dy），默认 0.85 */
  pitchGain?: number;
  /** 倾角上限（度），默认 62 */
  maxTiltDeg?: number;
  /** 断面相对高度下限，默认 0.08（不切在底座） */
  minU?: number;
  /** 断面相对高度上限，默认 0.92（不切在顶端） */
  maxU?: number;
};

/** 一次切割的完整解析解。全部为 plain number，可直接进快照 / 跨语言重写。 */
export type CutPlane = {
  /** 断面相对高度 0..1（= h / height） */
  u: number;
  /** 切面倾角（弧度） */
  theta: number;
  /** 切面法线（世界单位向量，ny 恒 > 0） */
  nx: number; ny: number; nz: number;
  /** 上半截翻倒轴（世界单位向量 = cross(up, dH)） */
  ax: number; ay: number; az: number;
};

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 由「命中点 + 攻击方向」求切面。纯函数：不读 World、不写状态、不依赖帧时间。
 *
 * `radius/height` 用来给 θ 加一道几何上限：切面倾角过大时会切到柱体端面，
 * cap 就不再是完整椭圆。约束 `radius·tanθ ≤ min(cutH, height-cutH)` 保证
 * 每一根母线的截断高度都落在 [0, height] 内。
 */
export function cutPlane(
  hitY: number, baseY: number, height: number, radius: number,
  dx: number, dy: number, dz: number,
  opt: CutOptions,
): CutPlane {
  const h = Math.max(EPS, height);
  const minU = clamp(opt.minU ?? 0.08, 0, 1);
  const maxU = clamp(opt.maxU ?? 0.92, 0, 1);
  let u = clamp((hitY - baseY) / h, minU, maxU);

  // 瓶罐 / 预设断裂带：命中高度吸附到最近的一条带。
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

  // 攻击方向归一化；退化（垂直下劈 / 零向量）时给一个稳定的水平基准。
  const dl = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const ux = dl > EPS ? dx / dl : 0;
  const uy = dl > EPS ? dy / dl : 0;
  const uz = dl > EPS ? dz / dl : 1;
  const hl = Math.sqrt(ux * ux + uz * uz);
  const hx = hl > EPS ? ux / hl : 0;
  const hz = hl > EPS ? uz / hl : 1;

  const pitchGain = opt.pitchGain ?? 0.85;
  const maxTilt = clamp(opt.maxTiltDeg ?? 62, 0, 89) * DEG;
  // dy < 0 = 从高处往下打 → 俯仰项为正 → 切口更斜。
  const pitch = Math.max(0, -uy);
  let theta = Math.min(maxTilt, clamp(opt.tiltDeg, 0, 89) * DEG + pitch * pitchGain);

  // 几何上限：切面不能削到柱体端面，否则 cap 不是完整椭圆。
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
    // cross(up, dH) = (dH.z, 0, -dH.x)；正角度让上半截朝攻击去向倒。
    ax: hz,
    ay: 0,
    az: -hx,
  };
}

/**
 * 每根母线的截断高度（供表现层重建上下两段闭合网格 + 斜切 cap）。
 *
 * 母线 i 上一点 Q(t) = (r·cosφ, t, r·sinφ)，切面 `dot(n, Q - C) = 0`，
 * C 的轴心高度 = cutU·height。解出 t：
 *     t = cutH - (nx·r·cosφ + nz·r·sinφ) / ny
 * 得到的是一个**倾斜的环**，不是水平环 —— 这就是「切口朝攻击方向」的几何本体。
 * 完好态（cutU=1, n=up）时所有 t 恰好等于 height，下半截即完整柱体。
 */
export function cutColumnHeights(
  radius: number, sides: number, cutU: number, height: number,
  nx: number, ny: number, nz: number,
): number[] {
  const cutH = cutU * height;
  const invNy = 1 / Math.max(EPS, ny);
  const n = Math.max(1, Math.floor(sides));
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const phi = (i / n) * Math.PI * 2;
    const ox = Math.cos(phi) * radius;
    const oz = Math.sin(phi) * radius;
    out.push(clamp(cutH - (nx * ox + nz * oz) * invNy, 0, height));
  }
  return out;
}

/** 由场景元数据创建初始状态（不配置时返回空数组，既有世界逐字节不变）。 */
export function createDestructibleStates(
  specs: readonly DestructibleSpec[] | undefined,
): DestructibleState[] {
  if (!specs || specs.length === 0) return [];
  return specs.map((s) => ({
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
    color: s.color ?? '#8a6b4a',
    cutColor: s.cutColor ?? '#e8c9a0',
    broken: 0,
    cutU: 1,
    theta: 0,
    nx: 0, ny: 1, nz: 0,
    ax: 0, ay: 0, az: -1,
    fall: 0,
    brokenAt: 0,
  }));
}

/** 把一次切割写进状态 + 发一条一次性事件（真机与调试入口共用）。 */
function applyCut(
  world: World, st: DestructibleState, idx: number,
  hitY: number, dx: number, dy: number, dz: number,
): void {
  const p = cutPlane(
    hitY, st.y, st.height, st.radius, dx, dy, dz,
    {
      tiltDeg: st.tiltDeg,
      bands: st.bands,
      pitchGain: st.pitchGain,
      maxTiltDeg: st.maxTiltDeg,
    },
  );
  st.broken = 1;
  st.cutU = p.u;
  st.theta = p.theta;
  st.nx = p.nx; st.ny = p.ny; st.nz = p.nz;
  st.ax = p.ax; st.ay = p.ay; st.az = p.az;
  st.fall = 0;
  st.brokenAt = world.time;

  world.events.push({
    type: 'break',
    tick: world.tick,
    x: st.x,
    y: st.y + p.u * st.height,
    z: st.z,
    value: idx,
  });
}

/**
 * 调试 / 自动化入口：直接以给定命中点打断指定物件，不改 Intents、不进 step。
 * 与 `plot-spawn` 的 `spawnPlotTestUnits` 同一类运行时调试操作；
 * 走的是**同一个** `cutPlane`，所以读数与真机链路逐字节一致，可用来精确
 * 验收「高处断 / 低处断 / 切口朝向」而不用靠运气挥刀。
 */
export function forceBreak(
  world: World, id: string, hitY: number,
  dx: number, dy: number, dz: number,
): boolean {
  const list = world.destructibles;
  if (!list) return false;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    if (st.id !== id || st.broken !== 0) continue;
    applyCut(world, st, i, hitY, dx, dy, dz);
    return true;
  }
  return false;
}

/**
 * 每帧更新：先消费本帧 3D 命中，再推进上半截翻倒。
 *
 * 放在 step 的 hits 之后 —— 与草块同一节拍，并用 `currentMeleeShape` 作**时间闸门**：
 * 只有本帧确实有刀风（active 段 / 击地圆）才接受命中，静止或陈旧刀刃位置不会误断。
 *
 * 刻意**不再**用 `inMeleeShape` 的 2D 扇形二次否决：刀刃线段与物件轴的 3D 相交
 * 是比扇形更精确的判定（横扫能砍到侧面的瓶罐），让近似口径去否决精确结果是倒退。
 * 扇形继续服务假人命中，两者只共享「这一帧有没有挥刀」这一个事实。
 */
export function destructiblesUpdate(world: World, dt: number, intents: Intents): void {
  const list = world.destructibles;
  if (!list || list.length === 0 || !world.modules.destructibles) return;

  const hits: readonly BreakHit[] = intents.breakHits ?? [];
  const shape = hits.length > 0 ? currentMeleeShape(world) : null;
  const gate = !!shape && (shape.active || shape.slamRadius > 0);

  if (gate && shape) {
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i];
      let idx = -1;
      for (let j = 0; j < list.length; j++) {
        if (list[j].id === hit.id) { idx = j; break; }
      }
      if (idx < 0) continue;
      const st = list[idx];
      if (st.broken !== 0) continue;
      applyCut(world, st, idx, hit.y, hit.dx, hit.dy, hit.dz);
    }
  }

  // 固定步长的确定性指数逼近：暂停 / 慢放 / 快照回放都成立，不读帧时间之外的状态。
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    if (st.broken === 0) continue;
    const k = 1 - Math.exp(-dt * 3 / Math.max(0.1, st.fallSec));
    st.fall += (BREAK_FALL_TARGET - st.fall) * k;
  }
}

/** 复位：所有物件回到完好直立（不重新随机，保证重播一致）。 */
export function destructiblesReset(world: World): void {
  const list = world.destructibles;
  if (!list) return;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    st.broken = 0;
    st.cutU = 1;
    st.theta = 0;
    st.nx = 0; st.ny = 1; st.nz = 0;
    st.ax = 0; st.ay = 0; st.az = -1;
    st.fall = 0;
    st.brokenAt = 0;
  }
}
