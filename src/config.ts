import raw from '../config/game.json';
import { assemblePlots, DEFAULT_PLOT_LAYOUT } from './core';
import type {
  AppConfig, AssembledPlot, CoreConfig, PlotAssembly, PlotDef,
  PlotLayout, SceneConfig, ViewConfig,
} from './core';

/**
 * 唯一的配置文件入口。Core 不 import 本文件 —— 配置由组装层注入，
 * 因此把 Core 搬进 Unity / Godot / Node 时不需要携带任何 Web 配置。
 * 深拷贝是为了让调试面板可以在运行时安全地改写数值。
 *
 * v9s.43 · 动态地块拼合：
 * - 每个地块是 `config/plots/<id>.json` 一个独立文件，**文件里不写世界坐标**；
 *   多个 agent 各自新建自己的文件，永不改同一个数组，从根上消除 git 冲突。
 * - `assemblePlots()` 按 id 字典序排序后分配不重叠槽位，把「地块中心 + 相对偏移」
 *   解算成 `StationSpec` / `GrassPlotSpec` 的绝对坐标，再注入 `SCENE_CONFIG`。
 * - 工位传送（`lab-panel.ts` 的 `goto`）读的就是注入后的 `spawnX/spawnZ`，
 *   因此天然「跟着地块实际拼合位置走」。
 */
function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const source = raw as unknown as AppConfig;

/**
 * 构建期把 `config/plots/*.json` 全部打进包（`eager: true`）。
 * 加载顺序无关：`assemblePlots()` 按 id 字典序重排，结果与提交先后完全无关。
 */
const plotModules = import.meta.glob<PlotDef>('../config/plots/*.json', {
  eager: true,
  import: 'default',
});
const PLOT_DEFS: PlotDef[] = Object.values(plotModules).filter(
  (d) => d && typeof d.id === 'string' && d.id.length > 0,
);

/** 自动槽位布局。当前用 Core 默认值；要改布局只需覆盖这一处。 */
export const PLOT_LAYOUT: PlotLayout = DEFAULT_PLOT_LAYOUT;

/** 拼合结果（含 diagnostics：重复 id / 顺延 / 无可用槽位）。 */
export const PLOT_ASSEMBLY: PlotAssembly = assemblePlots(PLOT_DEFS, PLOT_LAYOUT);

/** 拼合后的地块列表，供工位面板生成「测试按钮」用。 */
export const PLOTS: AssembledPlot[] = PLOT_ASSEMBLY.plots;

export const CORE_CONFIG: CoreConfig = copy(source.core);
export const SCENE_CONFIG: SceneConfig = copy(source.scene);
export const VIEW_CONFIG: ViewConfig = copy(source.view);

// 注入拼合结果。config/game.json 里已不再有 scene.stations / scene.grass.plots，
// 这两处是运行时唯一来源；测试夹具（tests/helpers.ts）用同一套拼合器保持一致。
SCENE_CONFIG.stations = PLOT_ASSEMBLY.stations;
if (SCENE_CONFIG.grass) SCENE_CONFIG.grass.plots = PLOT_ASSEMBLY.grassPlots;
