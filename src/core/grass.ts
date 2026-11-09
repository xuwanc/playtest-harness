/**
 * v9s.39 · 体素草块（Core 侧）。
 *
 * 需求：2×2 格占地、参次不齐、1~2 格高、用 box 做的草；角色走过去自然压开，
 * 攻击可以割断。
 *
 * 设计纪律（对照 ADR-002 / check-boundary）：
 *  - 纯函数式状态转移，只读参数、只写 world；无 DOM / 无渲染对象 / 无外部时间源。
 *  - 全部状态在 `world.grass`，plain number / 数组 / Record，可 JSON 序列化与快照回放。
 *  - 生成用**独立种子**的 mulberry32，绝不推进 `world.rngState`：草是静态布景，
 *    若复用全局随机源会连带改变假人游走等既有行为（破坏确定性基线）。
 *  - 只依赖同目录模块（向下单向依赖），形状判定复用 `hits.ts`。
 *  - 网格桶把「谁被压到 / 谁被割到」限制在角色周围几个桶内，复杂度与草总数无关。
 */

import { groundHeightAt } from './collision';
import { currentMeleeShape, inMeleeShape, inSlamShape } from './hits';
import type {
  Box, CoreConfig, GrassBlade, GrassPatch, GrassSceneSpec, GrassState,
  GrassWindConfig, GridMeta, SceneConfig, WindState, World,
} from './types';

const EPS = 1e-6;
const TWO_PI = Math.PI * 2;

/** 未配置风场时的中性值：enabled=false → 表现层把摆幅与色带都置零。 */
export const DEFAULT_GRASS_WIND: GrassWindConfig = {
  enabled: false,
  dirDeg: 0,
  speed: 0,
  amplitude: 0,
  wavelength: 4,
  secondWave: { wavelength: 2, amplitude: 0, speedScale: 1 },
  gust: { periodSec: 8, depth: 0 },
  jitter: 0,
  shadeAmount: 0,
};

/** 取风场配置；缺省返回中性值，冻结夹具 / 旧配置行为完全不变。 */
export function windConfig(core: CoreConfig): GrassWindConfig {
  return core?.grass?.wind ?? DEFAULT_GRASS_WIND;
}

function initialWind(cfg: GrassWindConfig): WindState {
  const depth = Math.min(1, Math.max(0, cfg.gust.depth));
  return { time: 0, gust: 1 - depth };
}

/** 固定步长推进风场：时间单调、阵风系数由时间确定性派生（无随机、无外部时钟）。 */
export function windAdvance(wind: WindState, cfg: GrassWindConfig, dt: number): void {
  if (!cfg.enabled) return;
  wind.time += Math.max(0, dt);
  const period = Math.max(0.1, cfg.gust.periodSec);
  const depth = Math.min(1, Math.max(0, cfg.gust.depth));
  wind.gust = 1 - depth + depth * (0.5 + 0.5 * Math.sin(TWO_PI * wind.time / period - Math.PI / 2));
}

/**
 * 某一点的**静态**波相位（不含时间项）。p = 位置在风向上的投影，
 * 因此沿风向的草依次错相 → 波一浪一浪推过去；垂直风向的草同相 → 形成整齐的浪带。
 * 返回的相位直接作为 InstancedBufferAttribute 一次性上传，之后不再改动。
 */
export function windPhase(cfg: GrassWindConfig, x: number, z: number, jitterPhase: number): [number, number] {
  const rad = cfg.dirDeg * Math.PI / 180;
  const p = x * Math.cos(rad) + z * Math.sin(rad);
  const k1 = TWO_PI / Math.max(0.1, cfg.wavelength);
  const k2 = TWO_PI / Math.max(0.1, cfg.secondWave.wavelength);
  return [k1 * p + jitterPhase, k2 * p + jitterPhase * 1.7];
}

/** shader 所需的常量参数（与 windSample 同源，避免 CPU/GPU 公式漂移）。 */
export function windShaderParams(cfg: GrassWindConfig): {
  dirX: number; dirZ: number;
  omega1: number; omega2: number;
  amp1: number; amp2: number;
  shadeAmount: number;
} {
  const rad = cfg.dirDeg * Math.PI / 180;
  const k1 = TWO_PI / Math.max(0.1, cfg.wavelength);
  const k2 = TWO_PI / Math.max(0.1, cfg.secondWave.wavelength);
  return {
    dirX: Math.cos(rad), dirZ: Math.sin(rad),
    omega1: k1 * cfg.speed,
    omega2: k2 * cfg.speed * cfg.secondWave.speedScale,
    amp1: cfg.amplitude,
    amp2: cfg.secondWave.amplitude,
    shadeAmount: cfg.shadeAmount,
  };
}

/**
 * 给定静态相位与当前风状态，返回该点的摆幅（米，沿风向）与明暗系数。
 * 这是**可移植参考实现**：Unity / Godot / 无 WebGL 降级路径照此复算即可。
 * GPU 端在 vertex shader 里执行同一公式（sin(p - omega*time) 两波叠加）。
 */
export function windSample(
  wind: WindState, cfg: GrassWindConfig, phase1: number, phase2: number,
): { sway: number; shade: number } {
  const q = windShaderParams(cfg);
  const s1 = Math.sin(phase1 - q.omega1 * wind.time);
  const s2 = Math.sin(phase2 - q.omega2 * wind.time);
  return {
    sway: wind.gust * (q.amp1 * s1 + q.amp2 * s2),
    shade: 1 - q.shadeAmount * (0.5 + 0.5 * s1),
  };
}

/* ---------------- v9s.44 · 缓慢生长 + 枢轴顶点动画（可移植参考实现） ----------------
 * 这两组公式都是 GPU shader 的「唯一真源」：表现层 / Unity / Godot / 无 WebGL 降级
 * 路径照此复算即可，避免 CPU 与 GPU 两套公式漂移。全部是纯函数、plain number、
 * 不写 world、不累积外部时间 → 暂停 / 慢放 / 快照回放都成立，且**不新增 World 字段**
 * （golden 快照与既有 938 例零回归）。
 */

/** 逐根错峰的最大比例：相位最大的那根晚 18% 时长才开始长（降低「一片齐刷刷冒出来」的存在感）。 */
export const GRASS_GROWTH_STAGGER = 0.18;
/** 下段 / 上段的枢轴倾角分配：下段转 40%，上段再叠加 60% → 两节之间形成折线。 */
export const GRASS_PIVOT_LOW = 0.4;
export const GRASS_PIVOT_UP = 0.6;

/**
 * 割断后的**连续生长进度** 0..1（供表现层插值当前高度 / 颜色）。
 *
 * 旧行为：`cut` 从 `regrowSec` 线性递减到 0，到点瞬间从断茬弹回满高 —— 太突然。
 * 新行为：`p = 1 - cut/regrowSec` 是线性时间轴，经
 *  ① 逐根错峰（phase∈[0,1] 由 blade.yaw 派生，不新增 rnd()，确定性不变）
 *  ② smoothstep `p²(3-2p)`（慢启动、平缓到位）
 * 得到 grow：割断瞬间 0（断茬），到时恰好 1（全长好），两端都与静止态**连续无跳变**。
 *
 * 只读 `cut` / `regrowSec` / `phase`，不依赖帧时间：暂停时 cut 冻结 → 生长定格；
 * 快照恢复 cut → 生长位置确定。
 */
export function grassGrowth(cut: number, regrowSec: number, phase: number): number {
  if (cut < 0) return 0;                    // -1 = 永久断茬（永远停在断茬高度）
  if (cut === 0) return 1;                  // 完好 / regrow 已到时
  if (regrowSec <= 0) return 0;             // 异常配置：有 cut 却无再生时长
  const p = Math.min(1, Math.max(0, 1 - cut / regrowSec));
  const d = Math.min(1, Math.max(0, phase)) * GRASS_GROWTH_STAGGER;
  const pe = Math.min(1, Math.max(0, (p - d) / (1 - d)));
  return pe * pe * (3 - 2 * pe);            // smoothstep
}

/**
 * 把「草顶摆幅（米）」换算成两级枢轴倾角。
 *
 * 折线的顶端位移 ≈ hBase·sin(low) + hTip·sin(low+up)，小角下 ≈ theta·(LOW·hBase + hTip)，
 * 因此用**有效力臂** effLength = LOW·hBase + hTip 求 theta = atan2(sway, effLength)，
 * 顶端实际位移才 ≈ sway（与旧 shear 方案的 amplitude 手感一致）。
 * 下段绕草根转 low、上段绕下段顶端再转 up，顶端总角 = theta。
 * shader 端用同一 effLength 公式（LOW 由 Core 插值注入），不漂移。
 */
export function windPivotAngles(sway: number, effLength: number): { theta: number; low: number; up: number } {
  const theta = Math.atan2(sway, Math.max(1e-3, effLength));
  return { theta, low: theta * GRASS_PIVOT_LOW, up: theta * GRASS_PIVOT_UP };
}

/** 有效力臂：下段按 LOW 权重、上段按全权重（与 windPivotAngles 配套）。 */
export function windPivotEffLength(hBase: number, hTip: number): number {
  return GRASS_PIVOT_LOW * hBase + hTip;
}

/**
 * Rodrigues 刚体旋转：点 v 绕「过 pivot、沿单位轴 a」的轴旋转角 θ（c=cosθ, s=sinθ）。
 * 对一段 box 的全部 8 个顶点施加**同一个**旋转 → 边长 / 夹角不变，box 保持完整立方体，
 * 这正是「枢轴顶点动画」与旧「逐顶点 shear」的根本区别（shear 会把 box 拉成斜平行四边形）。
 * 返回 [x,y,z]；GLSL 端 rotAxis() 用完全相同的公式。
 */
export function windPivotRotate(
  vx: number, vy: number, vz: number,
  px: number, py: number, pz: number,
  ax: number, ay: number, az: number,
  c: number, s: number,
): [number, number, number] {
  const rx = vx - px, ry = vy - py, rz = vz - pz;
  const cx = ay * rz - az * ry;
  const cy = az * rx - ax * rz;
  const cz = ax * ry - ay * rx;
  const d = ax * rx + ay * ry + az * rz;
  const t = (1 - c) * d;
  return [
    px + rx * c + cx * s + ax * t,
    py + ry * c + cy * s + ay * t,
    pz + rz * c + cz * s + az * t,
  ];
}

/** 独立种子的 mulberry32；与 random.ts 同算法但状态局部，不碰 world.rngState。 */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bucketKey(bx: number, bz: number): string {
  return bx + ',' + bz;
}

function emptyState(cfg: CoreConfig['grass'], grid: GridMeta, spec?: GrassSceneSpec): GrassState {
  return {
    spec: spec ?? {
      minCellX: 0, maxCellX: 0, minCellZ: 0, maxCellZ: 0,
      density: 0, bladesPerPatch: [0, 0], avoidMargin: 0, seed: 0,
    },
    cellSize: grid.cellSize > 0 ? grid.cellSize : 0.5,
    bucketCells: cfg?.bucketCells ?? 4,
    blades: [], patches: [], buckets: {}, cutCount: 0, lastCutAt: 0,
    wind: initialWind(cfg?.wind ?? DEFAULT_GRASS_WIND),
  };
}

/**
 * 生成草场。只在 createWorld 里调用一次；冻结夹具 / 未配置 scene.grass 时返回空草场，
 * 因此既有 876 例的行为完全不变（只多一个空的可序列化字段）。
 */
export function createGrassState(
  core: CoreConfig,
  scene: SceneConfig,
  boxes: Box[],
  grid: GridMeta,
): GrassState {
  const spec = scene.grass;
  const cfg = core.grass;
  if (!spec || !cfg || !cfg.enabled) return emptyState(cfg, grid, spec);

  const cell = grid.cellSize > 0 ? grid.cellSize : 0.5;
  const rnd = seeded(spec.seed);
  const footprint = Math.max(1, Math.floor(cfg.footprintCells));
  const bucketSpan = Math.max(1, cfg.bucketCells) * cell;
  const minH = Math.max(cell, cfg.minHeightCells * cell);
  const maxH = Math.max(minH, cfg.maxHeightCells * cell);
  const [bMin, bMax] = spec.bladesPerPatch;
  const perMin = Math.max(0, Math.floor(bMin));
  const perMax = Math.max(perMin, Math.floor(bMax));

  // 避让白盒：台阶 / 墙 / 过梁 / 障碍外扩 avoidMargin，草不生成在这些体块上。
  // ground 不参与（它就是地面本身）。
  const avoid = boxes
    .filter((b) => b.kind !== 'ground')
    .map((b) => ({
      minX: b.minX - spec.avoidMargin,
      maxX: b.maxX + spec.avoidMargin,
      minZ: b.minZ - spec.avoidMargin,
      maxZ: b.maxZ + spec.avoidMargin,
    }));

  const blades: GrassBlade[] = [];
  const patches: GrassPatch[] = [];
  const buckets: Record<string, number[]> = {};
  const plots = spec.plots ?? [];

  /** patch 格中心是否落在任一 plot（含四周留空圈）内 —— 常规草场在这里挖空。 */
  const coveredByPlot = (cx: number, cz: number): boolean => {
    const ccx = cx + footprint / 2;
    const ccz = cz + footprint / 2;
    for (let i = 0; i < plots.length; i++) {
      const p = plots[i];
      const m = Math.max(0, p.clearMarginCells ?? 0);
      if (ccx >= p.minCellX - m && ccx <= p.maxCellX + m
        && ccz >= p.minCellZ - m && ccz <= p.maxCellZ + m) return true;
    }
    return false;
  };

  /** 生成一个 patch 的全部草根（避让白盒 + 逐根查地面高，与常规草场完全一致）。 */
  const emitPatch = (cx: number, cz: number, count: number): void => {
    const from = blades.length;
    for (let k = 0; k < count; k++) {
      const wx = (cx + rnd() * footprint) * cell;
      const wz = (cz + rnd() * footprint) * cell;

      let blocked = false;
      for (let a = 0; a < avoid.length; a++) {
        const box = avoid[a];
        if (wx >= box.minX && wx <= box.maxX && wz >= box.minZ && wz <= box.maxZ) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      // 按**每根草中心**查地面高度：跨台阶边缘时不会一半埋进地里（ADR-005 / risk-review）。
      const y = groundHeightAt(boxes, wx, wz, 3, 0, 0.05);
      const height = minH + (maxH - minH) * rnd();
      const hRatio = (height - minH) / Math.max(EPS, maxH - minH);
      const tone = Math.min(1, Math.max(0, rnd() * 0.68 + hRatio * 0.32));

      const id = blades.length;
      blades.push({
        id,
        x: wx, y, z: wz,
        yaw: rnd() * TWO_PI,
        height,
        width: cell * 0.26,
        tone,
        lean: (rnd() - 0.5) * 0.24,
        bend: 0,
        bendX: 0, bendZ: 0,
        targetBend: 0,
        recover: 0,
        cut: 0,
        cutAt: 0,
      });

      const key = bucketKey(Math.floor(wx / bucketSpan), Math.floor(wz / bucketSpan));
      const list = buckets[key];
      if (list) list.push(id);
      else buckets[key] = [id];
    }
    if (blades.length > from) {
      patches.push({ id: patches.length, cellX: cx, cellZ: cz, bladeFrom: from, bladeTo: blades.length });
    }
  };

  const rollCount = (): number => perMin + Math.floor(rnd() * (perMax - perMin + 1));

  // 1) 常规草场：先消耗一次 rnd 以完全保持既有随机序列，再跳过 plot 覆盖区（挖出一圈空地）。
  for (let cz = spec.minCellZ; cz + footprint <= spec.maxCellZ; cz += footprint) {
    for (let cx = spec.minCellX; cx + footprint <= spec.maxCellX; cx += footprint) {
      const roll = rnd();
      if (coveredByPlot(cx, cz)) continue;
      if (roll > spec.density) continue;
      emitPatch(cx, cz, rollCount());
    }
  }

  // 2) 空地上的独立草块：强制铺满（不受全局 density 影响），四周留空使其成为明确的一块。
  for (let i = 0; i < plots.length; i++) {
    const p = plots[i];
    const pDensity = Math.min(1, Math.max(0, p.density ?? 1));
    for (let cz = p.minCellZ; cz + footprint <= p.maxCellZ; cz += footprint) {
      for (let cx = p.minCellX; cx + footprint <= p.maxCellX; cx += footprint) {
        if (rnd() > pDensity) continue;
        emitPatch(cx, cz, rollCount());
      }
    }
  }

  return {
    spec, cellSize: cell, bucketCells: cfg.bucketCells,
    blades, patches, buckets, cutCount: 0, lastCutAt: 0,
    wind: initialWind(cfg.wind ?? DEFAULT_GRASS_WIND),
  };
}

/** 取某个圆形邻域覆盖到的所有桶里的 blade 索引（局部查询，不遍历全草场）。 */
function candidatesNear(g: GrassState, x: number, z: number, radius: number): number[] {
  const span = Math.max(1, g.bucketCells) * g.cellSize;
  const bx0 = Math.floor((x - radius) / span);
  const bx1 = Math.floor((x + radius) / span);
  const bz0 = Math.floor((z - radius) / span);
  const bz1 = Math.floor((z + radius) / span);
  const out: number[] = [];
  for (let bx = bx0; bx <= bx1; bx++) {
    for (let bz = bz0; bz <= bz1; bz++) {
      const list = g.buckets[bucketKey(bx, bz)];
      if (!list) continue;
      for (let i = 0; i < list.length; i++) out.push(list[i]);
    }
  }
  return out;
}

/**
 * 本帧刀风割草。复用 hits.currentMeleeShape 的扇形 / 扫掠门 / 击地圆，
 * 因此「砍得到人」与「割得到草」天然同源，不会出现两套判定打架。
 * 返回本次割断根数；>0 时发一条 `grass-cut` 事件（一次性，供表现层生成碎片）。
 */
export function grassCut(world: World): number {
  const g = world.grass;
  const cfg = world.config.grass;
  if (!g || !cfg || !cfg.enabled || !world.modules.grass) return 0;
  const shape = currentMeleeShape(world);
  if (!shape.active && shape.slamRadius <= 0) return 0;

  const extra = 0.02;
  const reach = Math.max(shape.reach, shape.slamRadius) + 1;
  let count = 0;
  const ids = candidatesNear(g, shape.x, shape.z, reach);
  for (let i = 0; i < ids.length; i++) {
    const b = g.blades[ids[i]];
    if (b.cut !== 0) continue;
    if (!inMeleeShape(shape, b.x, b.z, extra) && !inSlamShape(shape, b.x, b.z, extra)) continue;
    b.cut = cfg.regrow ? Math.max(EPS, cfg.regrowSec) : -1;
    b.cutAt = world.time;
    // 断茬朝刀风外沿倒一点，割断瞬间就有「被削开」的读感。
    const dx = b.x - shape.x;
    const dz = b.z - shape.z;
    const d = Math.sqrt(dx * dx + dz * dz);
    b.bendX = d > EPS ? dx / d : shape.fx;
    b.bendZ = d > EPS ? dz / d : shape.fz;
    b.bend = Math.min(cfg.maxBendRad, 0.55);
    b.targetBend = 0;
    count += 1;
  }
  if (count > 0) {
    g.cutCount += count;
    g.lastCutAt = world.time;
    world.events.push({
      type: 'grass-cut',
      tick: world.tick,
      x: shape.x,
      y: world.character.position.y,
      z: shape.z,
      value: count,
    });
  }
  return count;
}

/**
 * 每帧草块更新：压弯 → 弹性恢复 / 再生 → 割断。
 * 放在 step 的 hits 之后：读的是本帧最终的角色位置与战斗时间轴。
 */
export function grassUpdate(world: World, dt: number): void {
  const g = world.grass;
  const cfg = world.config.grass;
  if (!g || g.blades.length === 0) return;
  if (!cfg || !cfg.enabled || !world.modules.grass) return;

  // v9s.41：风场时间与阵风系数按固定步长推进（暂停 / 慢放 / 快照回放都成立）。
  // 风只在 GPU 顶点着色器里消费，Core 不逐帧写每根草，因此这里仍是 O(1)。
  const windCfg = windConfig(world.config);
  if (!g.wind) g.wind = initialWind(windCfg);
  windAdvance(g.wind, windCfg, dt);

  const blades = g.blades;
  const n = blades.length;
  const touched = new Array<number>(n).fill(0);
  const radius = Math.max(0, cfg.bendRadius) + world.config.characterRadius;

  // 每帧先清空目标压弯：角色走远时草要能连续回弹，而不是等完全离开才恢复。
  for (let i = 0; i < n; i++) blades[i].targetBend = 0;

  // 1) 角色（玩家 + 假人 / 陪练）周围的桶 → 计算压弯方向与强度
  const px = world.character.position.x;
  const pz = world.character.position.z;
  const pressActor = (ax: number, az: number): void => {
    const ids = candidatesNear(g, ax, az, radius);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const b = blades[id];
      if (b.cut !== 0) continue;
      const dx = b.x - ax;
      const dz = b.z - az;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > radius) continue;
      const w = 1 - dist / radius;
      const target = cfg.maxBendRad * w * w;
      if (target > b.targetBend) {
        b.targetBend = target;
        const inv = dist > EPS ? 1 / dist : 0;
        b.bendX = dist > EPS ? dx * inv : 0;
        b.bendZ = dist > EPS ? dz * inv : 1;
        b.recover = 0;
      }
      touched[id] = 1;
    }
  };
  pressActor(px, pz);
  if (world.modules.dummies) {
    for (let d = 0; d < world.dummies.length; d++) {
      pressActor(world.dummies[d].position.x, world.dummies[d].position.z);
    }
  }

  // 2) 固定步长积分：压倒快、回弹慢，全确定性（指数逼近，帧率无关）。
  const kUp = 1 - Math.exp(-Math.max(0, cfg.bendRate) * dt);
  const kDown = 1 - Math.exp(-Math.max(0, cfg.recoverRate) * dt);
  for (let i = 0; i < n; i++) {
    const b = blades[i];
    b.bend += (b.targetBend - b.bend) * (b.targetBend > b.bend ? kUp : kDown);
    if (b.bend < 1e-4) b.bend = 0;
    if (!touched[i] && b.bend === 0) b.recover += dt;
    if (b.cut > 0) {
      b.cut -= dt;
      if (b.cut <= 0) b.cut = 0;
    }
  }

  // 3) 割断（与 hits 同帧，共用刀风形状）
  grassCut(world);
}

/** 复位：所有草回到完好直立状态（不重新随机，保证确定性）。 */
export function grassReset(world: World): void {
  const g = world.grass;
  if (!g) return;
  for (let i = 0; i < g.blades.length; i++) {
    const b = g.blades[i];
    b.bend = 0;
    b.targetBend = 0;
    b.bendX = 0;
    b.bendZ = 0;
    b.recover = 0;
    b.cut = 0;
    b.cutAt = 0;
  }
  g.cutCount = 0;
  g.lastCutAt = 0;
  // 复位也要把风归零，否则「重播」时浪会从上次的时间点接着走，破坏确定性。
  const w0 = initialWind(windConfig(world.config));
  g.wind.time = w0.time;
  g.wind.gust = w0.gust;
}
