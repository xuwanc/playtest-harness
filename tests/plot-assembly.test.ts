import { describe, expect, it } from 'vitest';
import { assemblePlots, DEFAULT_PLOT_LAYOUT } from '../src/core';
import type { PlotDef, PlotLayout } from '../src/core';
import { CONFIG, PLOT_ASSEMBLY } from './helpers';

/** 与生产布局隔离的小网格：槽位 (0,0)/(10,0)/(0,10)/(10,10)…，断言一眼能看懂。 */
const L: PlotLayout = {
  cellSize: 0.5,
  originX: 0,
  originZ: 0,
  stepX: 10,
  stepZ: 10,
  columns: 2,
  gap: 0,
  spawnDz: 2,
  labelDz: -2,
  defaultRadius: 2,
  defaultShape: 'circle',
  defaultColor: '#ffffff',
  bounds: { minX: -50, maxX: 50, minZ: -50, maxZ: 50 },
};

const def = (id: string, extra: Partial<PlotDef> = {}): PlotDef => ({
  id, name: id, hint: `hint-${id}`, ...extra,
});

describe('v9s.43 · assemblePlots 确定性', () => {
  it('结果与输入顺序、agent 提交先后无关（按 id 字典序）', () => {
    const defs = [def('c'), def('a'), def('b')];
    const x = assemblePlots(defs, L);
    const y = assemblePlots([...defs].reverse(), L);
    expect(x).toEqual(y);
    expect(x.plots.map((p) => p.id)).toEqual(['a', 'b', 'c']);
    expect(x.plots.map((p) => p.index)).toEqual([1, 2, 3]);
  });

  it('auto 地块中心两两不重叠（距离 >= r1+r2+gap）', () => {
    const r = assemblePlots([def('a'), def('b'), def('c'), def('d')], L);
    for (let i = 0; i < r.plots.length; i++) {
      for (let j = i + 1; j < r.plots.length; j++) {
        const a = r.plots[i];
        const b = r.plots[j];
        const d = Math.hypot(a.centerX - b.centerX, a.centerZ - b.centerZ);
        expect(d).toBeGreaterThanOrEqual(a.radius + b.radius + L.gap);
      }
    }
    expect(r.diagnostics.unplaced).toEqual([]);
  });

  it('pinned 固定在 anchor；auto 自动避开它顺延到下一个槽位', () => {
    const pinned = def('p', { anchor: { x: 0, z: 0 } });
    const auto = def('a');
    const r = assemblePlots([auto, pinned], L);
    const p = r.plots.find((q) => q.id === 'p')!;
    const a = r.plots.find((q) => q.id === 'a')!;
    expect([p.centerX, p.centerZ]).toEqual([0, 0]);
    expect(p.placement).toBe('pinned');
    expect([a.centerX, a.centerZ]).toEqual([10, 0]);
    expect(a.placement).toBe('auto');
    expect(r.diagnostics.relocated).toContain('a');
  });

  it('重复 id 报 diagnostics.duplicates 且只保留一个', () => {
    const r = assemblePlots([def('a'), def('a', { name: 'second' })], L);
    expect(r.diagnostics.duplicates).toEqual(['a']);
    expect(r.plots).toHaveLength(1);
    expect(r.plots[0].name).toBe('a');
  });

  it('bounds 之外没有合法槽位时报 unplaced，不把地块塞到地图外', () => {
    const tight: PlotLayout = { ...L, bounds: { minX: -1, maxX: 1, minZ: -1, maxZ: 1 } };
    const r = assemblePlots([def('a'), def('b')], tight);
    expect(r.plots).toHaveLength(1);
    expect(r.diagnostics.unplaced).toEqual(['b']);
  });

  it('工位坐标 = 拼合后中心 + 相对偏移；传送落点由拼合结果决定', () => {
    const r = assemblePlots([def('a', { spawn: { dx: 1, dz: 3 }, label: { dx: -2, dz: -4 } })], L);
    const s = r.stations[0];
    expect([s.x, s.z]).toEqual([0, 0]);
    expect([s.spawnX, s.spawnZ]).toEqual([1, 3]);
    expect([s.labelX, s.labelZ]).toEqual([-2, -4]);
  });
});

describe('v9s.43 · 草块格坐标换算', () => {
  it('absolute 历史草块跳过中心偏移，逐字节保持', () => {
    const r = assemblePlots([def('g', {
      anchor: { x: 5, z: 3 },
      grass: {
        minCellX: -4, maxCellX: 4, minCellZ: 0, maxCellZ: 6,
        density: 1, clearMarginCells: 2, absolute: true,
      },
    })], L);
    expect(r.grassPlots).toEqual([{
      minCellX: -4, maxCellX: 4, minCellZ: 0, maxCellZ: 6,
      density: 1, clearMarginCells: 2,
    }]);
  });

  it('相对草块按地块中心换算格偏移（cellSize=0.5）', () => {
    const r = assemblePlots([def('g', {
      anchor: { x: 5, z: 3 },
      grass: { minCellX: -4, maxCellX: 4, minCellZ: 0, maxCellZ: 6 },
    })], L);
    expect(r.grassPlots[0]).toEqual({
      minCellX: 6, maxCellX: 14, minCellZ: 6, maxCellZ: 12,
    });
  });
});

describe('v9s.43 · 真实配置拼合结果', () => {
  it('与组装层 / 测试夹具注入的 stations 完全一致，无重复、无未放置', () => {
    expect(PLOT_ASSEMBLY.stations).toEqual(CONFIG.scene.stations);
    expect(PLOT_ASSEMBLY.diagnostics.duplicates).toEqual([]);
    expect(PLOT_ASSEMBLY.diagnostics.unplaced).toEqual([]);
    expect(PLOT_ASSEMBLY.grassPlots).toEqual(CONFIG.scene.grass?.plots);
  });

  it('历史 7 个 pinned 工位的绝对坐标零回归', () => {
    const hist: Record<string, [number, number, number, number]> = {
      hub: [0, 0, 0, 0],
      rings: [-9.5, -8.2, -9.5, -5.2],
      windup: [0, -10, 0, -7],
      terrain: [8.9, -7.4, 8.9, -2.8],
      meter: [-9.5, 8.6, -9.5, 11.4],
      dash: [9.8, 8.2, 9.8, 12.8],
      gait: [-9.5, 0, -9.5, 2.6],
    };
    for (const [id, [x, z, sx, sz]] of Object.entries(hist)) {
      const s = PLOT_ASSEMBLY.stations.find((q) => q.id === id);
      expect(s, id).toBeDefined();
      expect([s!.x, s!.z, s!.spawnX, s!.spawnZ], id).toEqual([x, z, sx, sz]);
    }
  });

  it('所有工位的传送落点都在各自作用域内（面板传送读的就是它）', () => {
    for (const s of PLOT_ASSEMBLY.stations) {
      expect(Math.hypot(s.spawnX - s.x, s.spawnZ - s.z)).toBeLessThanOrEqual(s.radius);
    }
  });

  it('默认布局能容纳多个 auto 地块（两边同时加同一位置也不叠放）', () => {
    const autos = Array.from({ length: 4 }, (_, i) => def(`auto-${i}`));
    const r = assemblePlots(autos, DEFAULT_PLOT_LAYOUT);
    expect(r.plots).toHaveLength(4);
    expect(r.diagnostics.unplaced).toEqual([]);
    const centers = new Set(r.plots.map((p) => `${p.centerX},${p.centerZ}`));
    expect(centers.size).toBe(4);
  });
});
