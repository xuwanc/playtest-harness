import type {
  AssembledPlot, Bounds, CoreConfig, DestructibleSpec, DoorwaySpec, GrassPlotSpec, ObstacleSpec,
  PlotAssembly, PlotDef, PlotDiagnostics, PlotLayout, PlotSpan, SceneConfig, SlabSpec, StationSpec,
  StepSpec,
} from './types';

/**
 * v9s.43 / v9s.49 · 确定性地块拼合器（Core 纯函数，无 IO / 无 DOM / 无随机）。
 *
 * ## 为什么存在
 * 多个 agent 各自「加一块测试地」时，旧做法是一起往 `config/game.json` 的
 * `scene.stations[]` 里追加一条、并手写一组绝对坐标。两边同时改同一个数组 → git 冲突；
 * 两边都想放「出生点旁边」→ 两块地叠在一起。
 *
 * ## 解法（v9s.49 起：整数格）
 * 每个地块一个独立文件 `config/plots/<id>.json`，**文件里不写世界坐标**，只写
 * 相对布局意图（占几格、传送落点偏移、标牌偏移、自带的地形 / 道具 / 假人）。本函数：
 *   1. 按 `id` 字典序排序 —— 拼合结果与文件加载顺序、agent 提交先后完全无关；
 *   2. `pin:'origin'` 的地块先占格 (0,0)（只能有一块，通常是 hub）；
 *   3. 其余地块按排序依次**行优先 first-fit** 扫描，放得下就占位；
 *   4. 每块地自带一块 `span` 格的承重地板（`SlabSpec`），齐边同高，走上去不掉；
 *   5. 整体平移，让 pin 板的中心落在世界原点（出生点就在 hub 板上）。
 *
 * **不重叠是构造性的**：占用表是整数格 `Set`，不存在浮点圆 / 矩形相交判断。
 * **加地不挪旧地**：新 id 若排在后面，只会在末尾找空格；只有排在前面才会让后面的顺延，
 * 所以 `id` 一旦发布就不要再改名。
 *
 * 全程只依赖输入数据，可在 Node / Unity / Godot 里等价重写，也便于逐字节单测。
 */

/**
 * 默认布局：1 格 5 m、6 列，行数按需增长。
 *
 * 9 块地（1 块 `[2,2]` 的 hub + 1 块 `[2,4]` 的跑道 + 7 块 `[2,2]`）占 6 列 × 8 行 = 30×40 m，
 * 第 10 块地落在下一行，只增不改旧板。
 */
export const DEFAULT_PLOT_LAYOUT: PlotLayout = {
  cellSize: 0.5,
  cellMeters: 5,
  columns: 6,
  maxRows: 32,
  spawnDz: 0,
  labelInset: 0.9,
  defaultRadius: 2.0,
  defaultShape: 'circle',
  defaultColor: '#7fd8c0',
  defaultSpan: [2, 2],
  slabThickness: 0.4,
  boundInset: 0.5,
};

/** 消除浮点尾差（如 -8.2 + 3 = -5.199999999999999），保证拼合结果逐字节可比。 */
function round6(v: number): number {
  return Math.round(v * 1e6) / 1e6;
}

function normSpan(span: PlotSpan | undefined, layout: PlotLayout): PlotSpan {
  const s = span ?? layout.defaultSpan;
  return [
    Math.max(1, Math.round(s[0])),
    Math.max(1, Math.round(s[1])),
  ];
}

type Placed = {
  def: PlotDef;
  /** 西南角格子（未平移） */
  c: number;
  r: number;
  span: PlotSpan;
  pin: boolean;
  slot: number;
};

export function assemblePlots(
  defs: readonly PlotDef[],
  layout: PlotLayout = DEFAULT_PLOT_LAYOUT,
): PlotAssembly {
  const diagnostics: PlotDiagnostics = { duplicates: [], unplaced: [] };
  const cellMeters = layout.cellMeters;

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

  // 2) 整数占用表：key = "c,r"，value = plotId
  const occupied = new Map<string, string>();
  const fits = (c: number, r: number, span: PlotSpan): boolean => {
    if (c < 0 || r < 0) return false;
    if (c + span[0] > layout.columns || r + span[1] > layout.maxRows) return false;
    for (let i = 0; i < span[0]; i++) {
      for (let j = 0; j < span[1]; j++) {
        if (occupied.has(`${c + i},${r + j}`)) return false;
      }
    }
    return true;
  };
  const claim = (id: string, c: number, r: number, span: PlotSpan): void => {
    for (let i = 0; i < span[0]; i++) {
      for (let j = 0; j < span[1]; j++) occupied.set(`${c + i},${r + j}`, id);
    }
  };

  const placed: Placed[] = [];

  // 3) pin 先占原点（同一份配置里只认第一块，其余顺延成 auto）
  for (const def of sorted) {
    if (def.pin !== 'origin') continue;
    const span = normSpan(def.span, layout);
    if (!fits(0, 0, span)) continue;
    claim(def.id, 0, 0, span);
    placed.push({ def, c: 0, r: 0, span, pin: true, slot: 0 });
  }

  // 4) 其余按 id 序 first-fit：行优先、从 (0,0) 起逐格扫
  const totalCells = layout.columns * layout.maxRows;
  for (const def of sorted) {
    if (placed.some((p) => p.def.id === def.id)) continue;
    const span = normSpan(def.span, layout);
    let slot = -1;
    for (let s = 0; s < totalCells; s++) {
      const c = s % layout.columns;
      const r = Math.floor(s / layout.columns);
      if (!fits(c, r, span)) continue;
      slot = s;
      break;
    }
    if (slot < 0) {
      diagnostics.unplaced.push(def.id);
      continue;
    }
    const c = slot % layout.columns;
    const r = Math.floor(slot / layout.columns);
    claim(def.id, c, r, span);
    placed.push({ def, c, r, span, pin: false, slot });
  }

  // 5) 未平移的格子矩形 → 求整体平移量：pin 板中心 / 包围盒中心 对齐世界原点
  const raw = placed.map((p) => ({
    ...p,
    minX0: p.c * cellMeters,
    maxX0: (p.c + p.span[0]) * cellMeters,
    minZ0: p.r * cellMeters,
    maxZ0: (p.r + p.span[1]) * cellMeters,
  }));
  if (raw.length === 0) {
    const empty: Bounds = { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
    return {
      plots: [], stations: [], grassPlots: [], destructibles: [],
      slabs: [], bounds: empty, steps: [], doorways: [], obstacles: [], dummySpawns: [],
      diagnostics,
    };
  }
  const gridMinX = Math.min(...raw.map((p) => p.minX0));
  const gridMaxX = Math.max(...raw.map((p) => p.maxX0));
  const gridMinZ = Math.min(...raw.map((p) => p.minZ0));
  const gridMaxZ = Math.max(...raw.map((p) => p.maxZ0));
  const pinRaw = raw.find((p) => p.pin);
  const anchorX = pinRaw ? (pinRaw.minX0 + pinRaw.maxX0) / 2 : (gridMinX + gridMaxX) / 2;
  const anchorZ = pinRaw ? (pinRaw.minZ0 + pinRaw.maxZ0) / 2 : (gridMinZ + gridMaxZ) / 2;
  const offsetX = -anchorX;
  const offsetZ = -anchorZ;

  // 6) 工位序号：显式写了的保留，其余按放置顺序顺延（确定性）
  const explicitMax = sorted.reduce(
    (m, d) => (typeof d.index === 'number' ? Math.max(m, d.index) : m), 0,
  );
  let nextIndex = explicitMax;
  const indexOf = new Map<string, number>();
  for (const p of raw) {
    indexOf.set(p.def.id, typeof p.def.index === 'number' ? p.def.index : ++nextIndex);
  }

  // 7) 物件 id 全局唯一：不冲突就原样保留（既有配置逐字节不变），冲突才加地块前缀
  const usedObjIds = new Set<string>();
  const uniqObjId = (plotId: string, id: string): string => {
    if (!usedObjIds.has(id)) {
      usedObjIds.add(id);
      return id;
    }
    let cand = `${plotId}/${id}`;
    let n = 2;
    while (usedObjIds.has(cand)) cand = `${plotId}/${id}#${n++}`;
    usedObjIds.add(cand);
    return cand;
  };

  const plots: AssembledPlot[] = [];
  const slabs: SlabSpec[] = [];
  const steps: StepSpec[] = [];
  const doorways: DoorwaySpec[] = [];
  const obstacles: ObstacleSpec[] = [];
  const dummySpawns: PlotAssembly['dummySpawns'] = [];

  for (const p of raw) {
    const def = p.def;
    const id = def.id;
    const index = indexOf.get(id) ?? 0;
    const centerX = round6((p.minX0 + p.maxX0) / 2 + offsetX);
    const centerZ = round6((p.minZ0 + p.maxZ0) / 2 + offsetZ);

    const slab: SlabSpec = {
      plotId: id,
      cell: { c: p.c, r: p.r },
      span: p.span,
      minX: round6(p.minX0 + offsetX),
      maxX: round6(p.maxX0 + offsetX),
      minZ: round6(p.minZ0 + offsetZ),
      maxZ: round6(p.maxZ0 + offsetZ),
      top: 0,
      thickness: layout.slabThickness,
    };
    slabs.push(slab);

    const radius = def.radius ?? layout.defaultRadius;
    const shape = def.shape ?? layout.defaultShape;
    const color = def.color ?? layout.defaultColor;
    const sp = { dx: def.spawn?.dx ?? 0, dz: def.spawn?.dz ?? layout.spawnDz };
    const defaultLabelDz = -(p.span[1] * cellMeters) / 2 + layout.labelInset;
    const lb = { dx: def.label?.dx ?? 0, dz: def.label?.dz ?? defaultLabelDz };

    const station: StationSpec = {
      id,
      index,
      name: def.name,
      hint: def.hint,
      shape,
      x: centerX,
      z: centerZ,
      radius,
      spawnX: round6(centerX + sp.dx),
      spawnZ: round6(centerZ + sp.dz),
      labelX: round6(centerX + lb.dx),
      labelZ: round6(centerZ + lb.dz),
      color,
    };

    // 草块：格坐标相对地块中心；absolute 标记的块直接沿用绝对格坐标（不随地块走）
    const grassPlots: GrassPlotSpec[] = [];
    if (def.grass) {
      const g = def.grass;
      const offX = g.absolute ? 0 : Math.round(centerX / layout.cellSize);
      const offZ = g.absolute ? 0 : Math.round(centerZ / layout.cellSize);
      const gp: GrassPlotSpec = {
        minCellX: g.minCellX + offX,
        maxCellX: g.maxCellX + offX,
        minCellZ: g.minCellZ + offZ,
        maxCellZ: g.maxCellZ + offZ,
      };
      if (g.density !== undefined) gp.density = g.density;
      if (g.clearMarginCells !== undefined) gp.clearMarginCells = g.clearMarginCells;
      grassPlots.push(gp);
    }

    // 可破坏物件：同样只写相对偏移，绝对坐标在这里一次性解算
    const destructibles: DestructibleSpec[] = [];
    if (def.destructibles) {
      for (const d of def.destructibles) {
        destructibles.push({
          id: uniqObjId(id, d.id),
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
        });
      }
    }

    // v9s.49：地块自带的地形 / 门洞 / 障碍 / 初始单位，全部按中心 + 相对偏移解算
    for (const s of def.steps ?? []) {
      steps.push({
        id: uniqObjId(id, s.id),
        x: round6(centerX + s.dx),
        z: round6(centerZ + s.dz),
        width: s.width,
        depth: s.depth,
        height: s.height,
      });
    }
    for (const d of def.doorways ?? []) {
      doorways.push({
        id: uniqObjId(id, d.id),
        x: round6(centerX + d.dx),
        z: round6(centerZ + d.dz),
        openingWidth: d.openingWidth,
        openingHeight: d.openingHeight,
        wallThickness: d.wallThickness,
        wallSpan: d.wallSpan,
        wallHeight: d.wallHeight,
      });
    }
    for (const o of def.obstacles ?? []) {
      obstacles.push({
        id: uniqObjId(id, o.id),
        x: round6(centerX + o.dx),
        z: round6(centerZ + o.dz),
        width: o.width,
        depth: o.depth,
        height: o.height,
      });
    }
    for (const d of def.dummies ?? []) {
      const spawn: PlotAssembly['dummySpawns'][number] = {
        plotId: id,
        x: round6(centerX + d.dx),
        z: round6(centerZ + d.dz),
      };
      if (d.mode !== undefined) spawn.mode = d.mode;
      if (d.fighter) spawn.fighter = true;
      if (d.weapon !== undefined) spawn.weapon = d.weapon;
      dummySpawns.push(spawn);
    }

    plots.push({
      id, index, name: def.name, hint: def.hint,
      owner: def.owner ?? '',
      centerX, centerZ,
      placement: p.pin ? 'pinned' : 'auto',
      slot: p.pin ? -1 : p.slot,
      cell: { c: p.c, r: p.r },
      span: p.span,
      slab,
      shape, radius, color, station, grassPlots, destructibles,
      testSpawn: def.testSpawn,
    });
  }

  // 8) 包围盒内的空格补「填充地板」：不管地块怎么摆，脚下永远是连续的。
  //    逐行把连续空格合并成一条板（不逐格铺，避免 48 块 5×5 的碎片板缝）。
  const usedCols = Math.max(...raw.map((p) => p.c + p.span[0]));
  const usedRows = Math.max(...raw.map((p) => p.r + p.span[1]));
  for (let r = 0; r < usedRows; r++) {
    let c = 0;
    while (c < usedCols) {
      if (occupied.has(`${c},${r}`)) { c++; continue; }
      const start = c;
      while (c < usedCols && !occupied.has(`${c},${r}`)) c++;
      slabs.push({
        plotId: '',
        cell: { c: start, r },
        span: [c - start, 1],
        minX: round6(start * cellMeters + offsetX),
        maxX: round6(c * cellMeters + offsetX),
        minZ: round6(r * cellMeters + offsetZ),
        maxZ: round6((r + 1) * cellMeters + offsetZ),
        top: 0,
        thickness: layout.slabThickness,
      });
    }
  }

  // 9) 面板 / 循环切换按 index 排序（与数组内顺序解耦）
  plots.sort((a, b) => a.index - b.index);
  slabs.sort((a, b) => {
    const ai = indexOf.get(a.plotId) ?? Number.MAX_SAFE_INTEGER;
    const bi = indexOf.get(b.plotId) ?? Number.MAX_SAFE_INTEGER;
    return ai - bi || a.cell.r - b.cell.r || a.cell.c - b.cell.c;
  });

  // 10) 返回：工位按 index；物件按地块 id 字典序（与插入顺序 / 提交先后无关）
  const byId = [...plots].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const bounds: Bounds = {
    minX: round6(Math.min(...slabs.map((s) => s.minX)) + layout.boundInset),
    maxX: round6(Math.max(...slabs.map((s) => s.maxX)) - layout.boundInset),
    minZ: round6(Math.min(...slabs.map((s) => s.minZ)) + layout.boundInset),
    maxZ: round6(Math.max(...slabs.map((s) => s.maxZ)) - layout.boundInset),
  };

  return {
    plots,
    stations: plots.map((p) => p.station),
    grassPlots: plots.flatMap((p) => p.grassPlots),
    destructibles: byId.flatMap((p) => p.destructibles),
    slabs,
    bounds,
    steps,
    doorways,
    obstacles,
    dummySpawns,
    diagnostics,
  };
}

/**
 * v9s.49 · 把拼合结果灌进「配置对象」的唯一入口。
 *
 * 组装层（`src/config.ts`，走 Vite glob）与测试夹具（`tests/helpers.ts`，走 Node fs）
 * 必须走同一条注入路径，否则测试看到的地块坐标会和线上不一致 —— 所以这段逻辑只写一次。
 * 纯数据改写：不读文件、不碰 DOM，可以直接在 Node 里跑。
 */
export function applyPlotAssembly(
  core: CoreConfig,
  scene: SceneConfig,
  assembly: PlotAssembly,
  layout: PlotLayout = DEFAULT_PLOT_LAYOUT,
): void {
  scene.stations = assembly.stations;
  scene.slabs = assembly.slabs;
  scene.steps = assembly.steps;
  scene.doorways = assembly.doorways;
  scene.obstacles = assembly.obstacles;
  scene.destructibles = assembly.destructibles;
  if (scene.grass) scene.grass.plots = assembly.grassPlots;

  // 老的单块底板字段保留一个和拼合结果等价的尺寸：有 slabs 时 buildBoxes 不读它，
  // 但截图脚本 / 手工调试仍可能读，别留下 32 这种过期值。
  scene.ground = {
    size: Math.max(
      assembly.bounds.maxX - assembly.bounds.minX,
      assembly.bounds.maxZ - assembly.bounds.minZ,
    ),
    thickness: layout.slabThickness,
  };

  // 可行走边界与寻路格网都从拼合包围盒推导，不再手写 ±15.5。
  core.worldBounds = { ...assembly.bounds };
  const cell = scene.grid.cellSize;
  scene.grid = {
    cellSize: cell,
    minX: Math.floor(assembly.bounds.minX / cell) * cell,
    maxX: Math.ceil(assembly.bounds.maxX / cell) * cell,
    minZ: Math.floor(assembly.bounds.minZ / cell) * cell,
    maxZ: Math.ceil(assembly.bounds.maxZ / cell) * cell,
  };

  // 初始假人 / 陪练的位置也由地块声明解算（谁的地块谁负责摆谁）。
  const plain = assembly.dummySpawns.filter((d) => !d.fighter);
  const fighters = assembly.dummySpawns.filter((d) => d.fighter);
  const fallbackModes = core.dummies.initialModes;
  core.dummies.count = plain.length;
  core.dummies.spawn = plain.map((d) => ({ x: d.x, z: d.z }));
  core.dummies.initialModes = plain.map(
    (d, i) => (d.mode as typeof fallbackModes[number] | undefined) ?? fallbackModes[i] ?? 'idle',
  );
  if (core.dummies.fighters) {
    const f = core.dummies.fighters;
    const weapons = f.weapons;
    f.spawn = fighters.map((d) => ({ x: d.x, z: d.z }));
    f.weapons = fighters.map((d, i) => d.weapon ?? weapons[i % weapons.length]);
    if (f.initialModes) {
      const modes = f.initialModes;
      f.initialModes = fighters.map((_, i) => modes[i % modes.length]);
    }
  }
}
