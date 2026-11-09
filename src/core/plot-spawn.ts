import { createDummyState } from './dummies';
import type {
  AssembledPlot, DummyMode, DummyState, PlotTestSpawn, WeaponId, World,
} from './types';

/**
 * v9s.43 · 地块测试按钮的 Core 侧：就地生成 / 清除假人与陪练。
 *
 * 设计要点：
 * - 这是**运行时调试操作**（与 `warpTo` / `resetDummies` 同级），不进 Intents、
 *   不进 step，因此不影响确定性回放 / golden snapshot；
 * - 生成的单位带 `spawnedByPlot` 标记，基线单位（配置里的 6 假人 + 3 陪练）没有，
 *   所以 World 的初始序列化逐字节不变；
 * - 环形排布用固定角度公式，不用随机源，结果与点击次数 / 顺序无关（每次先清后建）；
 * - 表现层按 `world.dummies.length` 自动扩容渲染对象，本文件不认识 three / DOM。
 */

const DEFAULT_MODES: DummyMode[] = ['idle', 'attack', 'keep-distance'];
const DEFAULT_WEAPONS: WeaponId[] = ['sword-shield', 'dual-swords', 'greatsword'];

/**
 * 清掉测试按钮生成的单位；返回移除数量。
 * - 传 `plotId`：只移除该地块生成的，别的地块保留（方便多块地同时摆测试对象）。
 * - 不传：移除全部测试单位，回到配置里的基线假人 / 陪练。
 */
export function clearPlotTestUnits(world: World, plotId?: string): number {
  const before = world.dummies.length;
  // 基线单位（配置里的假人 / 陪练）没有标记，永远保留；
  // 测试单位里，指定 plotId 时只删那一块地生成的，其余保留。
  const keep = world.dummies.filter((d) => {
    if (!d.spawnedByPlot) return true;
    return plotId !== undefined && d.spawnedByPlot !== plotId;
  });
  world.dummies = keep;
  // 重新压实 id，保证 id 与数组下标 +1 严格一致（点击轮转 / 表现层按 id 索引）
  for (let i = 0; i < world.dummies.length; i++) world.dummies[i].id = i + 1;
  return before - world.dummies.length;
}

/**
 * 在指定地块就地生成测试单位。先清掉该地块上次生成的，再按配方环形排布。
 * 返回本次生成的数量。
 */
export function spawnPlotTestUnits(world: World, plot: AssembledPlot): number {
  const recipe: PlotTestSpawn = plot.testSpawn ?? {};
  const dummies = Math.max(0, Math.floor(recipe.dummies ?? 0));
  const fighters = Math.max(0, Math.floor(recipe.fighters ?? 0));
  clearPlotTestUnits(world, plot.id);
  const total = dummies + fighters;
  if (total === 0) return 0;

  const radius = Math.max(0.4, recipe.ringRadius ?? 1.6);
  const startDeg = recipe.startDeg ?? -90;
  const modes = recipe.modes ?? DEFAULT_MODES;
  const weapons = recipe.weapons ?? world.config.dummies.fighters?.weapons ?? DEFAULT_WEAPONS;
  const fighterInterval = world.config.dummies.fighters?.attackInterval ?? 3.4;
  // v9s.56：测试按钮生成的单位也吃同一份血量配置 —— 否则「一键摆一排陪练」全是打不死的桩，
  // 而配置里的三个陪练能被打死，两处手感对不上。
  const baseHp = Math.max(0, world.config.dummies.health ?? 0);
  const fighterHp = Math.max(0, world.config.dummies.fighters?.health ?? baseHp);

  const created: DummyState[] = [];
  for (let k = 0; k < total; k++) {
    const a = ((startDeg + (360 * k) / total) * Math.PI) / 180;
    const x = plot.centerX + Math.cos(a) * radius;
    const z = plot.centerZ + Math.sin(a) * radius;
    const isFighter = k >= dummies;
    const fi = k - dummies;
    const mode: DummyMode = isFighter ? 'spar' : modes[k % modes.length];
    const weapon: WeaponId | null = isFighter ? weapons[fi % weapons.length] : null;
    const cd = isFighter ? fighterInterval * (0.25 + 0.22 * fi) : 0;
    const s = createDummyState(
      world.dummies.length + created.length + 1, mode, x, z, weapon, cd,
      isFighter ? fighterHp : baseHp,
    );
    s.spawnedByPlot = plot.id;
    created.push(s);
  }
  world.dummies.push(...created);
  return created.length;
}

/** 当前由测试按钮生成的单位数（供 harness / 面板读数）。 */
export function plotTestUnitCount(world: World): number {
  let n = 0;
  for (const d of world.dummies) if (d.spawnedByPlot) n++;
  return n;
}
