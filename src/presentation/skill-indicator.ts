/**
 * v9s.x · 技能脚底指示器：攻击范围 + 瞄准方向，**数据驱动、通用适配**。
 *
 * ## 通用性怎么保证
 * 形状和数值**全部来自技能数据 / Core 配置**，没有为任何单个技能写死的半径或角度：
 *  - `world.skills[].params`：优先读显式 `shape / radius / arcDeg / width`；
 *    没有显式字段时按 `kind` 给一组「键名提示」（例如引导读 `homingRange`、
 *    电环读 `radius`），并从 `perWave × spreadDeg` 推出扇面张角；
 *  - `config.hits.reach[weapon]` + `hits.arcDeg`：普通攻击 / 弓蓄力的范围；
 *  - `config.links.moves[weapon].hit.shape/radius/arcDeg/width`：派生招的范围；
 *  - `abilities.rings[]`：已放置电环的运行态半径与位置。
 * 新增一个技能只要在数据里声明范围字段，指示器自动出现，**不用改表现层代码**。
 * 唯一按 kind 登记的是「这个技能什么时候算正在用」——不同技能的状态字段本来就不同。
 *
 * ## v9s.x 细化
 *  - **弓释放不再闪扇形**：与 Core `hits.ts playerHits()` 的 `if (weapon === 'bow') return`
 *    对齐 —— 弹道武器的伤害完全由箭矢实体结算，没有「近战扇形」这回事。表现层以前
 *    漏了这个特判，弓松开 / 蓄满自动放箭的瞬间 `charging=false, phase=active` 会画出
 *    一个 9m 扇形闪一下。
 *  - **扇角严格来自真实判定数据**：去掉 `perWave×spread+24` 的拍脑袋余量；普通挥击读
 *    `hits.arcDeg`、派生招读 `links.moves[].hit.arcDeg`、齐射读 params 的
 *    `perWave × spreadDeg`。热改配置，指示器立刻跟着变。
 *  - **内圈裁剪（扇环 / 半弧形）**：角色碰撞半径 `core.characterRadius` 内的填充挖掉，
 *    不再把扇形糊在角色脚底；圆心在放置点的电环不裁剪。
 *  - **进出过渡**：每个指示器有 0..1 的 alpha，淡入 ~90ms / 淡出 ~160ms（真实 frameDt
 *    驱动），不再「啪」地出现 / 消失；alpha 归零后回收几何。
 *  - **降低存在感**：填充 / 轮廓 / 箭头的基础不透明度整体下调（见 INDICATOR_STYLE）。
 *
 * ## v9s.x 口径统一（大剑「实际范围比显示范围大得多」）
 * 旧版自己按 `hits.reach` + `hits.arcDeg` 画一个对称扇形，和 Core 的真实判定差了四层：
 *  1. `hits.arcDeg` 是**半角**（`cosArc = cos(65°)`，判定夹角 ≤ 65°），旧版当成扇面全角画 → 显示 65°、实际 130°；
 *  2. 判定距离是 `reach + dummies.radius`，旧版只画 `reach`；
 *  3. 剑类有 `hitSweep` 横扫（刃身扫过 ±150°），旧版是静态前方扇形；
 *  4. 大剑有 `groundSlam` 击地圆（2.4m 全周），旧版完全没画。
 * 修法**不是改逻辑区域**（那会动 876 例手感断言），而是让指示器只读
 * Core 新增的 `meleeCoverage(world)` —— 与 `playerHits` / `playerGroundSlam` 同源的
 * 攻击覆盖描述。扇区画 `[-半角, +半角] ∩ 扫掠区间`（可非对称），并额外画击地圆。
 * 新增 `startDeg / endDeg` 让扇区能表达横扫的中心偏移与张角。
 *
 * ## 边界
 * `describeSkillIndicators()` 是只读 World 的纯函数（无 DOM / Three / 外部时间），
 * 可单测、可移植；`createSkillIndicatorView()` 只负责把描述画成贴地几何并做过渡。
 * 不写 World、不进快照、不影响 Core 确定性。
 *
 * ## 朝向
 * 局部 0 角 = +Z（与 `facing = atan2(x, z)` 同构），group 绕 Y 转 yaw 后即指向瞄准方向。
 * 优先用拖拽瞄准 → 引导朝向 → 派生招锁定朝向 → 攻击锁定朝向 → 身体朝向。
 */
import * as THREE from 'three';
import { meleeCoverage } from '../core/hits';
import type { HitShapeKind, SkillConfig, World } from '../core/types';
import { FX_ORDER } from './fx-layer';

export type IndicatorShape = 'sector' | 'circle' | 'capsule' | 'line';

export type AimHint = { x: number; z: number };

export type SkillIndicatorSpec = {
  /** 稳定 key，用于复用 / 隐藏渲染对象 */
  id: string;
  shape: IndicatorShape;
  /** 扇 / 圆半径，或 capsule / line 的沿朝向长度（米） */
  radius: number;
  /** 扇面张角（度）；circle 恒 360，capsule / line 忽略 */
  arcDeg: number;
  /** 扇区起止角（度，相对 yaw 的局部角，0 = +Z）。非对称横扫需要；对称时 = ±arcDeg/2 */
  startDeg: number;
  endDeg: number;
  /** capsule / line 的横向宽度（米） */
  width: number;
  /** 内圈裁剪半径（米）：角色碰撞半径内挖空成扇环；0 = 不裁剪（圆心在放置点） */
  innerRadius: number;
  /** 朝向（弧度） */
  yaw: number;
  x: number;
  y: number;
  z: number;
  label: string;
  /** 0..1：不透明度（蓄力 / 引导 / 环存活进度） */
  intensity: number;
  color: string;
};

/**
 * 基础不透明度。v9s.x 按「降低范围显示存在感」整体下调：
 * 旧版 fill 0.22 / outline 0.9 / arrow 0.95 太实，配合扇环裁剪与淡入淡出后更轻。
 * 导出是为了让单测守住「别不知不觉又调回去」。
 */
export const INDICATOR_STYLE = {
  fill: 0.17,     // 旧版 0.22 实心扇形 → 扇环挖空后更淡
  outline: 0.78,  // 旧版 0.9
  arrow: 0.72,    // 旧版 0.95
  /** 外弧亮边：有面积的窄带，是「半弧形」最该被看到的部分；比 1px 线可靠得多 */
  rim: 0.42,
  /**
   * 轮廓窄带宽度（米）。按射程自适应，小范围不会细成 1px。
   * 上一版 0.14 / 0.36 / 0.075 整体降一半 → 0.07 / 0.18 / 0.0375，近战（2.3m）
   * 取 0.086 已经合适；但弓 9m / 法杖 8m 都会撞 bandMax 上限取 0.18，仍是近战的
   * 两倍粗 —— 视觉上「近战好了，法杖和弓还是宽的」。这里把上限压到 0.09，
   * 与近战近乎同宽：近战取值不变，大射程各降一半且不再更抢眼。
   */
  bandMin: 0.07,      // 上一版 0.14
  bandMax: 0.09,      // 0.36 → 0.18 → 0.09（本次收敛大射程上限）
  bandRatio: 0.0375,  // 上一版 0.075
  /** 细轮廓 = 外弧亮边的这个比例，形成「粗亮外弧 + 细内轮廓」的层次，不是一刀切 */
  outlineBandRatio: 0.55,
} as const;

/**
 * 窄带宽度按范围自适应（小范围由 ratio 决定，大范围由 bandMax 封顶）。
 * 导出供单测守住「别不知不觉又调回 1px」，以及「大射程不要比近战更粗」。
 */
export function indicatorBand(radius: number): number {
  return Math.max(
    INDICATOR_STYLE.bandMin,
    Math.min(INDICATOR_STYLE.bandMax, radius * INDICATOR_STYLE.bandRatio),
  );
}

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

function pick(params: Record<string, unknown>, keys: readonly string[]): number | null {
  for (const k of keys) {
    const v = num(params[k]);
    if (v !== null) return v;
  }
  return null;
}

/** 不同 kind 的参数里「射程」字段名不同；新 kind 走默认键序即可，无需改代码。 */
const RANGE_KEYS: Record<string, readonly string[]> = {
  // 引导齐射的 `radius` 是飞弹碰撞半径（0.3m），射程得读 homingRange
  channelVolley: ['homingRange', 'range', 'reach', 'radius'],
  groundRing: ['radius', 'range', 'reach'],
};

/**
 * 「哪些武器没有近战扇形」不再在表现层另立一张表：直接由 Core 的
 * `meleeCoverage().melee` 给出（与 `playerHits()` 的 `if (weapon === 'bow') return`
 * 同句）。少一份重复登记，就少一处口径漂移。
 */
export type InferredRange = {
  shape: IndicatorShape;
  radius: number;
  arcDeg: number;
  width: number;
};

/**
 * 从任意技能参数对象推断范围描述。纯函数，是「通用适配」的核心。
 * 显式字段优先（新技能自带 shape/radius/arcDeg/width 时完全不需要 kind 提示）。
 */
export function inferSkillRange(
  params: Record<string, unknown>,
  kind: string,
  fallback: { radius: number; arcDeg: number; width: number },
): InferredRange {
  const explicit = typeof params.shape === 'string' ? params.shape : '';
  const cone = explicit === 'sector' || explicit === 'cone' || kind === 'channelVolley';
  const circle = explicit === 'circle' || kind === 'groundRing';
  const capsule = explicit === 'capsule' || explicit === 'rect' || explicit === 'line';
  const shape: IndicatorShape = capsule ? 'capsule' : circle ? 'circle' : cone ? 'sector' : 'sector';

  const keys = RANGE_KEYS[kind] ?? ['radius', 'range', 'reach', 'homingRange', 'distance'];
  const radius = pick(params, keys) ?? fallback.radius;

  let arcDeg = pick(params, ['arcDeg', 'maxAngleDeg', 'angleDeg']);
  if (arcDeg === null) {
    const perWave = pick(params, ['perWave']);
    const spread = pick(params, ['spreadDeg']);
    // 齐射覆盖扇面 = 波内飞弹的实际张角（纯数据）。旧版 +24° 是拍脑袋余量，
    // 会让 8m 射程顶着一个过宽的扇子，既不真实也太抢眼。
    arcDeg = perWave !== null && spread !== null
      ? (perWave - 1) * spread
      : pick(params, ['spreadDeg']) ?? fallback.arcDeg;
  }

  const width = pick(params, ['width', 'spawnSideStep']) ?? fallback.width;
  return {
    shape,
    radius: Math.max(0.2, radius),
    arcDeg: Math.max(5, Math.min(360, arcDeg)),
    width: Math.max(0.1, width),
  };
}

/** 技能「正在使用」的判定。数值 / 形状全来自数据，这里只登记状态字段的对应关系。 */
function skillActive(
  cfg: SkillConfig, world: World, hasEvent: (t: string) => boolean,
): boolean {
  if (cfg.enabled === false) return false;
  if (cfg.weapon && world.combat.weapon !== cfg.weapon) return false;
  if (cfg.kind === 'channelVolley') return world.abilities.channeling;
  if (cfg.kind === 'groundRing') {
    return world.abilities.rings.length > 0 || hasEvent('ring-place');
  }
  // 新增 kind 的通用兜底：按槽位看通用状态
  if (cfg.slot === 'attack') {
    return world.abilities.channeling || world.combat.charging
      || world.combat.phase === 'windup' || world.combat.phase === 'active';
  }
  return world.abilities.rings.length > 0 || hasEvent('ring-place');
}

/** Core 的 HitShapeKind → 指示器形状（circle 圆心在脚下，capsule 沿朝向拉长）。 */
export function mapHitShape(s: HitShapeKind): IndicatorShape {
  if (s === 'circle') return 'circle';
  if (s === 'capsule') return 'capsule';
  return 'sector'; // sector / cone 都画成扇形
}

function resolveAimYaw(world: World, aim?: AimHint): number {
  if (aim && Math.hypot(aim.x, aim.z) > 1e-4) return Math.atan2(aim.x, aim.z);
  if (world.abilities.channeling) return world.abilities.channelYaw;
  if (world.playerLink.phase !== 'idle') return world.playerLink.facing || world.character.facing;
  if (world.combat.phase !== 'idle') return world.combat.attackFacing;
  return world.character.facing;
}

/**
 * 派生当前帧所有该显示的技能指示器。纯函数、只读 World，可单测。
 * @param aim 可选的拖拽瞄准方向（世界 XZ），优先于所有锁定朝向
 */
export function describeSkillIndicators(world: World, aim?: AimHint): SkillIndicatorSpec[] {
  const out: SkillIndicatorSpec[] = [];
  const c = world.character;
  const cb = world.combat;
  const cfg = world.config;
  const yaw = resolveAimYaw(world, aim);
  const y = c.position.y + 0.05;
  const reach = cfg.hits.reach[cb.weapon] ?? 1.6;
  // arcDeg 只在配置缺失时兜底，恒取 Core 的实际判定角（debug 面板标注：命中扇区半角）
  const fallback = { radius: reach, arcDeg: cfg.hits.arcDeg ?? 65, width: 0.6 };
  // 角色碰撞半径内不画填充：扇形糊在脚底既挡角色、又让「存在感」过重。
  // 与 Core 同一个 core.characterRadius，热改配置自动跟随。
  const inner = Math.max(0, cfg.characterRadius + 0.02);
  const events = new Set<string>(world.events.map((e) => e.type));
  const hasEvent = (t: string): boolean => events.has(t);

  // 1) 声明的技能：形状 / 半径 / 张角全部从 params 推断，新增技能自动适配
  for (const rt of world.skills) {
    if (!skillActive(rt.cfg, world, hasEvent)) continue;
    const params = rt.params as unknown as Record<string, unknown>;
    const r = inferSkillRange(params, rt.cfg.kind, fallback);
    const isVolley = rt.cfg.kind === 'channelVolley';
    const waves = num(params.waves) ?? 5;
    const intensity = isVolley && world.abilities.channeling
      ? 0.55 + 0.45 * clamp01(world.abilities.waveIndex / Math.max(1, waves))
      : 0.8;
    out.push({
      id: `skill:${rt.cfg.id}`,
      shape: r.shape, radius: r.radius, arcDeg: r.arcDeg, width: r.width,
      startDeg: -r.arcDeg / 2, endDeg: r.arcDeg / 2,
      innerRadius: inner,
      yaw,
      x: c.position.x, y, z: c.position.z,
      label: rt.cfg.id, intensity: clamp01(intensity),
      color: isVolley ? '#7fb8d8' : '#b48cff',
    });
  }

  // 2) 已放置的电环：圆心固定在放置点，不该按角色碰撞半径挖空
  for (const ring of world.abilities.rings) {
    out.push({
      id: `ring:${ring.id}`,
      shape: 'circle', radius: ring.radius, arcDeg: 360, width: 0.1,
      startDeg: -180, endDeg: 180,
      innerRadius: 0,
      yaw, x: ring.x, y: 0.05, z: ring.z,
      label: '电环',
      intensity: clamp01(ring.life / Math.max(ring.duration, 1e-6)),
      color: '#b48cff',
    });
  }

  // 3) 弓蓄力 / 近战挥击：范围全部来自 Core meleeCoverage（与 playerHits 同源）。
  //    fan 半径 / 扇角 / 扫掠 / 击地圆都不在这里另算，热改配置立刻跟着变。
  if (cb.charging) {
    out.push({
      id: 'bow-charge', shape: 'line', radius: reach, arcDeg: 0,
      startDeg: -fallback.arcDeg / 2, endDeg: fallback.arcDeg / 2,
      width: 0.35 + cb.charge * 0.45,
      innerRadius: inner,
      yaw, x: c.position.x, y, z: c.position.z,
      label: '弓蓄力', intensity: 0.4 + cb.charge * 0.6, color: '#ffd166',
    });
  } else if (cb.phase === 'windup' || cb.phase === 'active') {
    const cov = meleeCoverage(world);
    // 弹道武器 cov.melee=false：放箭瞬间不再闪一个 9m 扇形出来
    if (cov.melee) {
      // 实际命中区 = 前半球 [-半角, +半角] ∩ 本段刃身扫掠区间。
      // playerHits 里两个条件是 AND，所以这里取交集；扫掠可偏一侧 → 扇区非对称。
      let lo = -cov.halfArcDeg;
      let hi = cov.halfArcDeg;
      if (cov.sweep) {
        lo = Math.max(lo, cov.sweep.lo);
        hi = Math.min(hi, cov.sweep.hi);
      }
      if (hi - lo > 1) {
        out.push({
          id: 'melee', shape: 'sector', radius: cov.radius,
          arcDeg: hi - lo, startDeg: lo, endDeg: hi, width: 0.1,
          innerRadius: inner,
          yaw, x: c.position.x, y, z: c.position.z,
          label: '近战范围', intensity: 0.45 + cb.attackProgress * 0.5, color: '#7fb8d8',
        });
      }
      // 击地圆：与 playerGroundSlam 同半径 / 同落点前移。圆心在落点，
      // 不该按角色碰撞半径挖空（同电环）；intensity 更淡，避免盖过刀身扇区。
      if (cov.slam) {
        out.push({
          id: 'slam', shape: 'circle', radius: cov.slam.radius,
          arcDeg: 360, startDeg: -180, endDeg: 180, width: 0.1,
          innerRadius: 0,
          yaw,
          x: c.position.x + Math.sin(yaw) * cov.slam.ahead,
          y, z: c.position.z + Math.cos(yaw) * cov.slam.ahead,
          label: '击地范围', intensity: 0.3, color: '#7fb8d8',
        });
      }
      // cov.lunge 是 active 段前冲位移：指示器 group 每帧跟随角色位置，
      // 前冲天然体现在扇区中心的移动上，不再额外把它折成一个打不到的假半径。
    }
  }

  // 4) 派生招：直接吃 links.moves[weapon].hit 的 shape / radius / arcDeg / width
  const linkMove = cfg.links.moves[cb.weapon];
  if (world.playerLink.phase !== 'idle' && linkMove) {
    const h = linkMove.hit;
    out.push({
      id: 'link', shape: mapHitShape(h.shape),
      radius: Math.max(h.radius, linkMove.distance), arcDeg: h.arcDeg,
      startDeg: -h.arcDeg / 2, endDeg: h.arcDeg / 2,
      width: Math.max(h.width, 0.2),
      innerRadius: inner,
      yaw,
      x: c.position.x, y, z: c.position.z,
      label: linkMove.kind, intensity: 0.85, color: '#6fe0a0',
    });
  }

  return out;
}

/* ---------------- Three 表现层 ---------------- */

type Entry = {
  group: THREE.Group;
  fill: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  outline: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  arrow: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  /** 外弧亮边（有面积的窄带） */
  rim: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  key: string;
  /** 0..1 进出过渡系数，opacity = base × intensity × alpha */
  alpha: number;
  /** 淡出中的对象沿用最后一次 intensity，避免亮度跳变 */
  intensity: number;
};

/** 淡入 / 淡出时间常数（毫秒）；淡出略长，读起来是「收回去」而不是「啪地没了」 */
const FADE_IN_MS = 90;
const FADE_OUT_MS = 160;

function approach(cur: number, target: number, dt: number, tauMs: number): number {
  if (dt <= 0) return cur;
  return cur + (target - cur) * (1 - Math.exp(-dt / (tauMs / 1000)));
}

const DEG = Math.PI / 180;

function geometryKey(s: SkillIndicatorSpec): string {
  return `${s.shape}:${s.radius.toFixed(2)}:${s.arcDeg.toFixed(1)}`
    + `:${s.startDeg.toFixed(1)}:${s.endDeg.toFixed(1)}`
    + `:${s.width.toFixed(2)}:${s.innerRadius.toFixed(2)}`;
}

/**
 * 扇 / 圆：局部 0 角 = +Z。按 `startDeg..endDeg` 采样，因此支持**非对称扇区**
 * （大剑横扫与「扫掠门 ∩ 前半球」取交集后会偏向一侧）；full 时忽略角度画整圆。
 */
function arcPoints(
  radius: number, startDeg: number, endDeg: number, full: boolean,
): THREE.Vector3[] {
  const a0 = full ? 0 : startDeg * DEG;
  const a1 = full ? Math.PI * 2 : endDeg * DEG;
  const span = Math.abs(a1 - a0);
  const segs = Math.max(6, Math.ceil(48 * (span / (Math.PI * 2))));
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segs; i++) {
    const a = a0 + ((a1 - a0) * i) / segs;
    pts.push(new THREE.Vector3(Math.sin(a) * radius, 0, Math.cos(a) * radius));
  }
  return pts;
}

/** 内圈半径的安全上限：留一点外圈厚度，避免退化成零面积。 */
function innerOf(inner: number, radius: number): number {
  return Math.min(Math.max(0, inner), radius * 0.9);
}

/**
 * 填充：inner>0 时挖掉角色碰撞半径内的部分 → 扇环 / 圆环（用户说的「半弧形」）；
 * inner=0 时是实心扇形 / 整圆。
 */
function fanFill(
  radius: number, startDeg: number, endDeg: number, full: boolean, inner: number,
): THREE.BufferGeometry {
  const outer = arcPoints(radius, startDeg, endDeg, full);
  const r0 = innerOf(inner, radius);
  const pos: number[] = [];
  const idx: number[] = [];
  if (r0 <= 0) {
    const verts = [new THREE.Vector3(0, 0, 0), ...outer];
    for (const p of verts) pos.push(p.x, p.y, p.z);
    for (let i = 1; i < verts.length - 1; i++) idx.push(0, i, i + 1);
  } else {
    const innerPts = arcPoints(r0, startDeg, endDeg, full);
    for (const p of [...outer, ...innerPts]) pos.push(p.x, p.y, p.z);
    const n = outer.length;
    for (let i = 0; i < n - 1; i++) {
      idx.push(i, i + 1, n + 1 + i);
      idx.push(i + 1, n + 2 + i, n + 1 + i);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * 轮廓折线：外弧 + 内弧 + 两条径向边（非整圆时）。返回**折线数组**而不是
 * 成对线段，交给 `polylineBand()` 扩成有面积的窄带；整圆带内圈时也不会
 * 出现「从外圈跳到内圈」的假连线。
 */
function fanOutlinePaths(
  radius: number, startDeg: number, endDeg: number, full: boolean, inner: number,
): THREE.Vector3[][] {
  const outer = arcPoints(radius, startDeg, endDeg, full);
  const r0 = innerOf(inner, radius);
  const paths: THREE.Vector3[][] = [outer];
  if (r0 > 0) {
    const innerPts = arcPoints(r0, startDeg, endDeg, full);
    paths.push(innerPts);
    if (!full) {
      paths.push([outer[0], innerPts[0]]);
      paths.push([outer[outer.length - 1], innerPts[innerPts.length - 1]]);
    }
  } else if (!full) {
    const o = new THREE.Vector3(0, 0, 0);
    paths.push([o, outer[0]]);
    paths.push([outer[outer.length - 1], o]);
  }
  return paths;
}

/**
 * 把若干折线的每一段扩成**有面积的窄带**。
 * `LineBasicMaterial` 的线宽在 WebGL 里恒为 1px，怎么调都加不粗；描边要加宽只能靠
 * 几何。轮廓（外弧 / 内弧 / 径向边）统一走这里，宽度由 `indicatorBand()` 数据驱动。
 */
function polylineBand(paths: THREE.Vector3[][], width: number): THREE.BufferGeometry {
  const half = width / 2;
  const pos: number[] = [];
  const push = (v: THREE.Vector3): void => { pos.push(v.x, v.y, v.z); };
  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      if (len < 1e-6) continue;
      const nx = (-dz / len) * half;
      const nz = (dx / len) * half;
      const p0 = new THREE.Vector3(a.x + nx, 0, a.z + nz);
      const p1 = new THREE.Vector3(a.x - nx, 0, a.z - nz);
      const p2 = new THREE.Vector3(b.x + nx, 0, b.z + nz);
      const p3 = new THREE.Vector3(b.x - nx, 0, b.z - nz);
      push(p0); push(p1); push(p2);
      push(p2); push(p1); push(p3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/**
 * 外弧亮边：一条**有面积**的窄带。1px 线在斜俯视 + 深色地面 + 不透明草层遮挡下
 * 几乎看不见，「半弧形」就读不出来了；窄带一眼可辨。
 */
function arcBand(
  radius: number, startDeg: number, endDeg: number, full: boolean, band: number,
): THREE.BufferGeometry {
  const outer = arcPoints(radius, startDeg, endDeg, full);
  const innerPts = arcPoints(Math.max(0.01, radius - band), startDeg, endDeg, full);
  const pos: number[] = [];
  const idx: number[] = [];
  for (const v of [...outer, ...innerPts]) pos.push(v.x, v.y, v.z);
  const n = outer.length;
  for (let i = 0; i < n - 1; i++) {
    idx.push(i, i + 1, n + 1 + i);
    idx.push(i + 1, n + 2 + i, n + 1 + i);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** capsule / line 的「射程末端横带」，与扇形外弧同一视觉语汇。 */
function rectBand(radius: number, width: number, band: number): THREE.BufferGeometry {
  const hw = width / 2;
  const z0 = Math.max(0, radius - band);
  const pos = [
    -hw, 0, z0, hw, 0, z0, -hw, 0, radius,
    hw, 0, z0, hw, 0, radius, -hw, 0, radius,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** capsule / line：沿 +Z 拉长的矩形，从内圈边缘起画（最多截掉 60%，留够长度）。 */
function rectZ0(radius: number, inner: number): number {
  return Math.min(Math.max(0, inner), radius * 0.6);
}

function rectFill(radius: number, width: number, inner: number): THREE.BufferGeometry {
  const hw = width / 2;
  const z0 = rectZ0(radius, inner);
  const pos = [
    -hw, 0, z0, hw, 0, z0, -hw, 0, radius,
    hw, 0, z0, hw, 0, radius, -hw, 0, radius,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** capsule / line 的四条轮廓边，交给 polylineBand 加宽。 */
function rectOutlinePaths(radius: number, width: number, inner: number): THREE.Vector3[][] {
  const hw = width / 2;
  const z0 = rectZ0(radius, inner);
  const a = new THREE.Vector3(-hw, 0, z0);
  const b = new THREE.Vector3(hw, 0, z0);
  const c = new THREE.Vector3(hw, 0, radius);
  const d = new THREE.Vector3(-hw, 0, radius);
  return [[a, b], [b, c], [c, d], [d, a]];
}

/**
 * 瞄准箭头：**有面积的网格**（轴线矩形 + 三角箭头），从内圈边缘起画。
 * LineBasicMaterial 的线宽在 WebGL 里恒为 1px，斜俯视 + 深色地面上几乎看不见，
 * 方向就读不出来了。长度按范围自适应，所有形状都画，保证「瞄准方向」永远可见。
 */
function arrowGeometry(radius: number, inner: number): THREE.BufferGeometry {
  const z0 = Math.min(innerOf(inner, radius), radius * 0.3);
  const len = Math.max(0.6, radius * 0.82 - z0);
  const halfW = Math.min(0.07, len * 0.02);
  const headLen = Math.min(0.5, len * 0.18);
  const headW = Math.min(0.26, len * 0.09);
  const shaftEnd = z0 + len - headLen;
  const tip = z0 + len;
  const pos = [
    // 轴线矩形（两个三角形）
    -halfW, 0, z0, halfW, 0, z0, -halfW, 0, shaftEnd,
    halfW, 0, z0, halfW, 0, shaftEnd, -halfW, 0, shaftEnd,
    // 箭头三角
    0, 0, tip, -headW, 0, shaftEnd, headW, 0, shaftEnd,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

function makeEntry(s: SkillIndicatorSpec): Entry {
  const group = new THREE.Group();
  const full = s.shape === 'circle';
  const rect = s.shape === 'capsule' || s.shape === 'line';
  const band = indicatorBand(s.radius);
  const fillGeo = rect
    ? rectFill(s.radius, s.width, s.innerRadius)
    : fanFill(s.radius, s.startDeg, s.endDeg, full, s.innerRadius);
  // 轮廓不再用 1px LineSegments：折线扩成有面积的窄带，宽度与外弧亮边同源、
  // 按 outlineBandRatio 收一档，形成「粗亮外弧 + 细内轮廓」的层次。
  const lineGeo = polylineBand(
    rect
      ? rectOutlinePaths(s.radius, s.width, s.innerRadius)
      : fanOutlinePaths(s.radius, s.startDeg, s.endDeg, full, s.innerRadius),
    band * INDICATOR_STYLE.outlineBandRatio,
  );
  const fillMat = new THREE.MeshBasicMaterial({
    color: s.color, transparent: true, opacity: INDICATOR_STYLE.fill,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const lineMat = new THREE.MeshBasicMaterial({
    color: s.color, transparent: true, opacity: INDICATOR_STYLE.outline,
    side: THREE.DoubleSide, depthWrite: false,
  });
  // 箭头与外弧用淡亮白、关掉深度测试：草层是不透明写深度的实体，
  // 贴地透明层若不这么做会被草整片吞掉（截图验证过），方向 / 半弧形就读不出来。
  const arrowMat = new THREE.MeshBasicMaterial({
    color: '#eaf3fb', transparent: true, opacity: INDICATOR_STYLE.arrow,
    side: THREE.DoubleSide, depthWrite: false, depthTest: false,
  });
  const rimMat = new THREE.MeshBasicMaterial({
    color: '#eaf3fb', transparent: true, opacity: INDICATOR_STYLE.rim,
    side: THREE.DoubleSide, depthWrite: false, depthTest: false,
  });
  const rimGeo = rect
    ? rectBand(s.radius, s.width, band)
    : arcBand(s.radius, s.startDeg, s.endDeg, full, band);
  const fill = new THREE.Mesh(fillGeo, fillMat);
  const outline = new THREE.Mesh(lineGeo, lineMat);
  const rim = new THREE.Mesh(rimGeo, rimMat);
  const arrow = new THREE.Mesh(arrowGeometry(s.radius, s.innerRadius), arrowMat);
  // 非对称扇区（横扫偏一侧）时箭头指向扇面中心角，而不是固定 +Z
  arrow.rotation.y = ((s.startDeg + s.endDeg) / 2) * DEG;
  fill.renderOrder = FX_ORDER.groundArea;
  outline.renderOrder = FX_ORDER.groundAreaEdge;
  rim.renderOrder = FX_ORDER.groundAreaEdge + 1;
  arrow.renderOrder = FX_ORDER.groundAreaEdge + 2;
  group.add(fill, outline, rim, arrow);
  return { group, fill, outline, arrow, rim, key: geometryKey(s), alpha: 0, intensity: 1 };
}

function disposeEntry(e: Entry, scene: THREE.Scene): void {
  scene.remove(e.group);
  e.fill.geometry.dispose();
  e.outline.geometry.dispose();
  e.arrow.geometry.dispose();
  e.rim.geometry.dispose();
  e.fill.material.dispose();
  e.outline.material.dispose();
  e.arrow.material.dispose();
  e.rim.material.dispose();
}

export type SkillIndicatorView = {
  /** 每帧调用：派生描述、按需更新几何、推进进出过渡；dt 传真实 frameDt（秒） */
  update(world: World, aim?: AimHint, dt?: number): SkillIndicatorSpec[];
  /** 最近一帧的描述（自动化验收直接读这里） */
  debug(): SkillIndicatorSpec[];
  /** 各指示器当前过渡系数，验收「淡入 / 淡出」直接读这里 */
  fadeDebug(): { id: string; alpha: number }[];
  dispose(): void;
};

export function createSkillIndicatorView(scene: THREE.Scene): SkillIndicatorView {
  const entries = new Map<string, Entry>();
  let last: SkillIndicatorSpec[] = [];

  return {
    update(world, aim, dt = 1 / 60): SkillIndicatorSpec[] {
      const specs = describeSkillIndicators(world, aim);
      const seen = new Set<string>();
      const step = Math.max(0, Math.min(0.25, dt)); // 切后台回来别一帧跳完

      for (const s of specs) {
        seen.add(s.id);
        const key = geometryKey(s);
        let e = entries.get(s.id);
        if (!e || e.key !== key) {
          const prevAlpha = e?.alpha ?? 0;
          if (e) disposeEntry(e, scene);
          e = makeEntry(s);
          // 调试热改配置导致几何重建时别重新淡入，否则改一次半径就闪一下
          e.alpha = prevAlpha;
          entries.set(s.id, e);
          scene.add(e.group);
        }
        e.group.position.set(s.x, s.y, s.z);
        e.group.rotation.y = s.yaw;
        e.fill.material.color.set(s.color);
        e.outline.material.color.set(s.color);
      }

      // 统一推进 alpha：出现的淡入、消失的淡出；归零后回收几何，避免无限积累
      for (const [id, e] of [...entries]) {
        const target = seen.has(id) ? 1 : 0;
        const tau = target > e.alpha ? FADE_IN_MS : FADE_OUT_MS;
        e.alpha = approach(e.alpha, target, step, tau);
        if (target === 1 && e.alpha > 0.999) e.alpha = 1;
        if (target === 0 && e.alpha < 0.002) {
          disposeEntry(e, scene);
          entries.delete(id);
          continue;
        }
        const spec = specs.find((x) => x.id === id);
        if (spec) e.intensity = spec.intensity;
        e.fill.material.opacity = INDICATOR_STYLE.fill * e.intensity * e.alpha;
        e.outline.material.opacity = INDICATOR_STYLE.outline * e.intensity * e.alpha;
        e.arrow.material.opacity = INDICATOR_STYLE.arrow * e.intensity * e.alpha;
        e.rim.material.opacity = INDICATOR_STYLE.rim * e.intensity * e.alpha;
        e.group.visible = e.alpha > 0.002;
      }

      last = specs;
      return specs;
    },
    debug(): SkillIndicatorSpec[] {
      return last;
    },
    fadeDebug(): { id: string; alpha: number }[] {
      return [...entries].map(([id, e]) => ({ id, alpha: Math.round(e.alpha * 1000) / 1000 }));
    },
    dispose(): void {
      for (const e of entries.values()) disposeEntry(e, scene);
      entries.clear();
      last = [];
    },
  };
}
