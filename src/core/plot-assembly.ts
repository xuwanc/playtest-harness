import type {
  AssembledPlot, DestructibleSpec, GrassPlotSpec, PlotAssembly, PlotDef,
  PlotDiagnostics, PlotLayout, StationSpec,
} from './types';

/**
 * v9s.43 · 确定性地块拼合器（Core 纯函数，无 IO / 无 DOM / 无随机）。
 *
 * ## 为什么存在
 * 多个 agent 各自「加一块测试地」时，旧做法是一起往 `config/game.json` 的
 * `scene.stations[]` 里追加一条、并手写一组绝对坐标。两边同时改同一个数组 → git 冲突；
 * 两边都想放「出生点旁边」→ 两块地叠在一起。
 *
 * ## 解法
 * 每个地块一个独立文件 `config/plots/<id>.json`，**文件里不写世界坐标**，只写
 * 相对布局意图（传送落点偏移、标牌偏移、测试配方）。本函数：
 *   1. 按 `id` 字典序排序 —— 拼合结果与文件加载顺序、agent 提交先后完全无关；
 *   2. 带 `anchor` 的历史工位直接固定（保证既有布局逐字节不变）；
 *   3. 其余地块按排序依次从网格里挑**第一个不与任何已占用圆重叠**的槽位，
 *      冲突就自动顺延 —— 两个 agent 同时要「同一个位置」也各得其所，永不叠放；
 *   4. 把「拼合后的地块中心 + 相对偏移」解算成 `StationSpec` 的绝对坐标。
 *      工位传送读的就是这个值，因此天然「跟着地块实际拼合位置走」。
 *
 * 全程只依赖输入数据，可在 Node / Unity / Godot 里等价重写，也便于逐字节单测。
 */

/**
 * v9s.43 · 自动地块的默认槽位网格。
 *
 * 从北侧干净空带 (0,14) 起，向西 / 向南铺开：`stepX/stepZ` 为负，
 * 于是**第一块**自动地块落在正北 `(0,14)`（草场之外、地面之上、离出生点近），
 * 后续地块依次顺延，不会与 7 个历史固定工位（半径 3.2~5.2）抢位置。
 * `bounds` 把槽位限制在地面范围内，网格走到边界就自然停下并报 `unplaced`，
 * 不会把新地块塞到地图外。
 *
 * 参数经 `config/game.json` 的 worldBounds / 碰撞盒 / 草场范围校验：
 * 前 5 块自动地块的传送落点都在边界内、不嵌碰撞盒、不抢 (2,6) 空处。
 */
export const DEFAULT_PLOT_LAYOUT: PlotLayout = {
  cellSize: 0.5,
  originX: 0,
  originZ: 14,
  stepX: -4.5,
  stepZ: -4.5,
  columns: 4,
  gap: 0.3,
  spawnDz: 0,
  labelDz: -2.8,
  defaultRadius: 2.0,
  defaultShape: 'circle',
  defaultColor: '#7fd8c0',
  bounds: { minX: -13, maxX: 13, minZ: -13, maxZ: 14 },
};

/** 消除浮点尾差（如 -8.2 + 3 = -5.199999999999999），保证历史工位坐标逐字节还原。 */
function round6(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

type Placed = { x: number; z: number; r: number };

function overlaps(a: Placed, b: Placed, gap: number): boolean {
  return Math.hypot(a.x - b.x, a.z - b.z) < a.r + b.r + gap;
}

/** 网格槽位上限：columns × rows × 若干轮，防止无解时死循环。 */
const MAX_SLOTS = 400;

export function assemblePlots(
  defs: readonly PlotDef[],
  layout: PlotLayout = DEFAULT_PLOT_LAYOUT,
): PlotAssembly {
  const diagnostics: PlotDiagnostics = {
    duplicates: [], relocated: [], unplaced: [],
  };

  // 1) 去重 + 按 id 字典序排序：与文件加载顺序、提交先后完全无关
  const seen = new Set<string>();
  const unique: PlotDef[] = [];
  for (const d of defs) {
    if (!d || typeof d.id !== 'string' || d.id.length === 0) continue;
    if (seen.has(d.id)) {
      diagnostics.duplicates.push(d.id);
      continue;
    }
    seen.add(d.id);
    unique.push(d);
  }
  const sorted = [...unique].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  // 2) pinned（历史固定工位）先占位；它们的中心就是拼合结果本身
  const occupied: Placed[] = [];
  const pinned: { def: PlotDef; centerX: number; centerZ: number }[] = [];
  for (const def of sorted) {
    if (!def.anchor) continue;
    const x = round6(def.anchor.x);
    const z = round6(def.anchor.z);
    pinned.push({ def, centerX: x, centerZ: z });
    occupied.push({ x, z, r: def.radius ?? layout.defaultRadius });
  }

  // auto 地块的编号从历史工位最大 index 之后接着排
  let maxIndex = 0;
  for (const def of sorted) if (typeof def.index === 'number') maxIndex = Math.max(maxIndex, def.index);

  const result: AssembledPlot[] = [];
  let autoSlotCursor = 0;

  const build = (def: PlotDef, centerX: number, centerZ: number,
                 placement: 'pinned' | 'auto', slot: number, index: number): AssembledPlot => {
    const radius = def.radius ?? layout.defaultRadius;
    const shape = def.shape ?? layout.defaultShape;
    const color = def.color ?? layout.defaultColor;
    const sp = def.spawn ?? { dx: 0, dz: layout.spawnDz };
    const lb = def.label ?? { dx: 0, dz: layout.labelDz };
    const station: StationSpec = {
      id: def.id,
      index,
      name: def.name,
      hint: def.hint,
      shape,
      x: round6(centerX),
      z: round6(centerZ),
      radius,
      spawnX: round6(centerX + sp.dx),
      spawnZ: round6(centerZ + sp.dz),
      labelX: round6(centerX + lb.dx),
      labelZ: round6(centerZ + lb.dz),
      color,
    };
    // 草块：格坐标相对地块中心；absolute 标记的历史草块直接沿用绝对格坐标
    const grassPlots: GrassPlotSpec[] = [];
    if (def.grass) {
      const g = def.grass;
      const offX = g.absolute ? 0 : Math.round(centerX / layout.cellSize);
      const offZ = g.absolute ? 0 : Math.round(centerZ / layout.cellSize);
      const p: GrassPlotSpec = {
        minCellX: g.minCellX + offX,
        maxCellX: g.maxCellX + offX,
        minCellZ: g.minCellZ + offZ,
        maxCellZ: g.maxCellZ + offZ,
      };
      if (g.density !== undefined) p.density = g.density;
      if (g.clearMarginCells !== undefined) p.clearMarginCells = g.clearMarginCells;
      grassPlots.push(p);
    }
    // v9s.x：可破坏物件同样只写相对偏移，绝对坐标在这里一次性解算。
    const destructibles: DestructibleSpec[] = [];
    if (def.destructibles) {
      for (const d of def.destructibles) {
        destructibles.push({
          id: d.id,
          kind: d.kind,
          x: round6(centerX + d.dx),
          y: d.y ?? 0,
          z: round6(centerZ + d.dz),
          height: d.height,
          radius: d.radius,
          tiltDeg: d.tiltDeg,
          pitchGain: d.pitchGain,
          maxTiltDeg: d.maxTiltDeg,
          fallSec: d.fallSec,
          bands: d.bands ? [...d.bands] : undefined,
          color: d.color,
          cutColor: d.cutColor,
          seed: d.seed,
          targetId: d.targetId,
        });
      }
    }
    return {
      id: def.id, index, name: def.name, hint: def.hint,
      owner: def.owner ?? '', centerX: station.x, centerZ: station.z,
      placement, slot, shape, radius, color, station, grassPlots, destructibles,
      testSpawn: def.testSpawn,
    };
  };

  for (const p of pinned) {
    result.push(build(p.def, p.centerX, p.centerZ, 'pinned', -1,
      p.def.index ?? ++maxIndex));
  }

  // 3) auto 地块按 id 顺序依次挑第一个不冲突的槽位
  for (const def of sorted) {
    if (def.anchor) continue;
    const radius = def.radius ?? layout.defaultRadius;
    let chosen = -1;
    let cx = 0;
    let cz = 0;
    let tried = 0;
    for (let slot = autoSlotCursor; slot < MAX_SLOTS; slot++) {
      const col = slot % layout.columns;
      const row = Math.floor(slot / layout.columns);
      const x = round6(layout.originX + col * layout.stepX);
      const z = round6(layout.originZ + row * layout.stepZ);
      // 越界槽位直接跳过：宁可报 unplaced，也不把地块分到地图外。
      const bd = layout.bounds;
      if (bd && (x < bd.minX || x > bd.maxX || z < bd.minZ || z > bd.maxZ)) {
        tried++;
        continue;
      }
      const cand: Placed = { x, z, r: radius };
      if (occupied.some((o) => overlaps(cand, o, layout.gap))) {
        tried++;
        continue;
      }
      chosen = slot;
      cx = x;
      cz = z;
      break;
    }
    if (chosen < 0) {
      diagnostics.unplaced.push(def.id);
      continue;
    }
    if (tried > 0) diagnostics.relocated.push(def.id);
    occupied.push({ x: cx, z: cz, r: radius });
    autoSlotCursor = chosen + 1;
    result.push(build(def, cx, cz, 'auto', chosen, def.index ?? ++maxIndex));
  }

  // 4) 面板 / 循环切换按 index 排序（与数组内顺序解耦）
  result.sort((a, b) => a.index - b.index);
  // 物件按地块 id 字典序展平，与插入顺序 / 提交先后无关。
  const byId = [...result].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return {
    plots: result,
    stations: result.map((p) => p.station),
    grassPlots: result.flatMap((p) => p.grassPlots),
    destructibles: byId.flatMap((p) => p.destructibles),
    diagnostics,
  };
}
