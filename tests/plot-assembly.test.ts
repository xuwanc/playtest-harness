import { describe, expect, it } from 'vitest';
import { assemblePlots, DEFAULT_PLOT_LAYOUT } from '../src/core';
import type { PlotDef, PlotLayout, PlotSpan } from '../src/core';
import { CONFIG, PLOT_ASSEMBLY } from './helpers';

/**
 * 与生产布局隔离的小网格：1 格 10 m、2 列、默认 1 格，
 * 槽位 (0,0)/(1,0)/(0,1)/(1,1)…，断言一眼能看懂。
 */
const L: PlotLayout = {
  cellSize: 0.5,
  cellMeters: 10,
  columns: 2,
  maxRows: 8,
  spawnDz: 2,
  labelInset: 0.9,
  defaultRadius: 2,
  defaultShape: 'circle',
  defaultColor: '#ffffff',
  defaultSpan: [1, 1],
  slabThickness: 0.4,
  boundInset: 0.5,
};

const def = (id: string, extra: Partial<PlotDef> = {}): PlotDef => ({
  id, name: id, hint: `hint-${id}`, ...extra,
});

const spanArea = (span: PlotSpan, layout: PlotLayout): number =>
  span[0] * span[1] * layout.cellMeters * layout.cellMeters;

describe('v9s.49 · assemblePlots 确定性', () => {
  it('结果与输入顺序、agent 提交先后无关（按 id 字典序）', () => {
    const defs = [def('c'), def('a'), def('b')];
    const x = assemblePlots(defs, L);
    const y = assemblePlots([...defs].reverse(), L);
    expect(x).toEqual(y);
    expect(x.plots.map((p) => p.id)).toEqual(['a', 'b', 'c']);
    expect(x.plots.map((p) => p.index)).toEqual([1, 2, 3]);
  });

  it('同一组输入跑两次，输出逐字节一致（可 JSON 比对）', () => {
    const defs = [def('a', { span: [2, 1] }), def('b'), def('h', { pin: 'origin' })];
    const x = JSON.stringify(assemblePlots(defs, L));
    const y = JSON.stringify(assemblePlots(defs, L));
    expect(x).toBe(y);
  });

  it('槽位是整数格，不重叠是构造性的（矩形两两不相交）', () => {
    const r = assemblePlots([
      def('h', { pin: 'origin' }), def('a'), def('b', { span: [2, 1] }), def('c'),
    ], L);
    expect(r.diagnostics.unplaced).toEqual([]);
    for (let i = 0; i < r.slabs.length; i++) {
      for (let j = i + 1; j < r.slabs.length; j++) {
        const a = r.slabs[i];
        const b = r.slabs[j];
        const overlapX = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
        const overlapZ = Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ);
        expect(overlapX <= 1e-9 || overlapZ <= 1e-9, `${a.plotId || 'fill'} vs ${b.plotId || 'fill'}`).toBe(true);
      }
    }
  });

  it('pin 板中心对齐世界原点（出生点就在 hub 板上）', () => {
    const r = assemblePlots([def('h', { pin: 'origin', span: [2, 2] }), def('a')], L);
    const h = r.plots.find((p) => p.id === 'h')!;
    expect([h.centerX, h.centerZ]).toEqual([0, 0]);
    expect(h.placement).toBe('pinned');
    expect([h.slab.minX, h.slab.maxX, h.slab.minZ, h.slab.maxZ]).toEqual([-10, 10, -10, 10]);
  });

  it('加一块新地不挪旧地（id 排在后面时只往边缘长）', () => {
    const base = [def('h', { pin: 'origin' }), def('m'), def('n')];
    const before = assemblePlots(base, L);
    const after = assemblePlots([...base, def('z')], L);
    expect(after.plots).toHaveLength(4);
    for (const p of before.plots) {
      const q = after.plots.find((x) => x.id === p.id)!;
      expect([q.cell.c, q.cell.r, q.centerX, q.centerZ], p.id)
        .toEqual([p.cell.c, p.cell.r, p.centerX, p.centerZ]);
    }
  });

  it('包围盒内的空格自动补填充地板，地面连续无洞', () => {
    const r = assemblePlots([def('h', { pin: 'origin' }), def('a', { span: [2, 1] })], L);
    // h 占 (0,0)，a 的 [2,1] 放不进只剩 1 列的 r0，顺延到 (0,1) → 包围盒 2 列 × 2 行
    const w = 2 * L.cellMeters;
    const h = 2 * L.cellMeters;
    const area = r.slabs.reduce(
      (s, q) => s + (q.maxX - q.minX) * (q.maxZ - q.minZ), 0,
    );
    expect(area).toBe(w * h);
    expect(r.slabs.some((s) => s.plotId === '')).toBe(true);
  });

  it('重复 id 报 diagnostics.duplicates 且只保留一个', () => {
    const r = assemblePlots([def('a'), def('a', { name: 'second' })], L);
    expect(r.diagnostics.duplicates).toEqual(['a']);
    expect(r.plots).toHaveLength(1);
    expect(r.plots[0].name).toBe('a');
  });

  it('网格排满时报 unplaced，不把地块塞到地图外', () => {
    // 2 列 × 1 行，只能放两块 1 格
    const tiny: PlotLayout = { ...L, maxRows: 1 };
    const r = assemblePlots([def('a'), def('b'), def('c')], tiny);
    expect(r.plots).toHaveLength(2);
    expect(r.diagnostics.unplaced).toEqual(['c']);
  });

  it('工位坐标 = 板中心 + 相对偏移；传送落点由拼合结果决定', () => {
    const r = assemblePlots([def('a', {
      pin: 'origin', spawn: { dx: 1, dz: 3 }, label: { dx: -2, dz: -4 },
    })], L);
    const s = r.stations[0];
    expect([s.x, s.z]).toEqual([0, 0]);
    expect([s.spawnX, s.spawnZ]).toEqual([1, 3]);
    expect([s.labelX, s.labelZ]).toEqual([-2, -4]);
  });

  it('地板面积 = 占格数 × 格面积（没有多铺也没有少铺）', () => {
    const r = assemblePlots([
      def('h', { pin: 'origin', span: [2, 2] }),
      def('a', { span: [2, 1] }),
    ], L);
    const plotArea = r.slabs
      .filter((s) => s.plotId !== '')
      .reduce((sum, s) => sum + (s.maxX - s.minX) * (s.maxZ - s.minZ), 0);
    const expected = spanArea([2, 2], L) + spanArea([2, 1], L);
    expect(plotArea).toBeCloseTo(expected, 6);
  });
});

describe('v9s.49 · 地块自带的物件跟着地块走', () => {
  it('台阶 / 门洞 / 障碍 / 假人都解算成「板中心 + 相对偏移」', () => {
    const r = assemblePlots([def('h', {
      pin: 'origin',
      steps: [{ id: 's1', dx: -1, dz: 2, width: 2, depth: 1, height: 0.2 }],
      doorways: [{
        id: 'd1', dx: 1, dz: 2, openingWidth: 2, openingHeight: 1.8,
        wallThickness: 0.5, wallSpan: 1, wallHeight: 2,
      }],
      obstacles: [{ id: 'o1', dx: 0, dz: -3, width: 1, depth: 1, height: 0.8 }],
      dummies: [{ dx: 0, dz: 1, mode: 'attack' }],
    })], L);
    expect([r.steps[0].x, r.steps[0].z]).toEqual([-1, 2]);
    expect([r.doorways[0].x, r.doorways[0].z]).toEqual([1, 2]);
    expect([r.obstacles[0].x, r.obstacles[0].z]).toEqual([0, -3]);
    expect([r.dummySpawns[0].x, r.dummySpawns[0].z]).toEqual([0, 1]);
    expect(r.dummySpawns[0].mode).toBe('attack');
  });

  it('物件 id 互不冲突时原样保留，冲突时加地块前缀（不静默覆盖）', () => {
    const r = assemblePlots([
      def('h', { pin: 'origin', steps: [{ id: 's', dx: 0, dz: 0, width: 1, depth: 1, height: 0.2 }] }),
      def('a', { steps: [{ id: 's', dx: 0, dz: 0, width: 1, depth: 1, height: 0.2 }] }),
    ], L);
    expect(r.steps.map((s) => s.id)).toEqual(['s', 'a/s']);
  });

  it('持械陪练带 fighter 标记与武器，普通假人不带', () => {
    const r = assemblePlots([def('h', {
      pin: 'origin',
      dummies: [{ dx: 0, dz: 0 }, { dx: 1, dz: 1, fighter: true, weapon: 'greatsword' }],
    })], L);
    expect(r.dummySpawns.map((d) => !!d.fighter)).toEqual([false, true]);
    expect(r.dummySpawns[1].weapon).toBe('greatsword');
  });
});

describe('v9s.49 · 草块格坐标换算', () => {
  it('相对草块按地块中心换算格偏移（cellSize=0.5）', () => {
    const r = assemblePlots([def('g', {
      pin: 'origin', span: [2, 2],
      grass: { minCellX: -4, maxCellX: 4, minCellZ: 0, maxCellZ: 6 },
    })], L);
    // 板中心就是原点 → 格偏移 0
    expect(r.grassPlots[0]).toEqual({
      minCellX: -4, maxCellX: 4, minCellZ: 0, maxCellZ: 6,
    });
  });

  it('absolute 草块跳过中心偏移（用于不随地块走的装饰草）', () => {
    const r = assemblePlots([def('h', { pin: 'origin' }), def('g', {
      grass: { minCellX: -4, maxCellX: 4, minCellZ: 0, maxCellZ: 6, absolute: true },
    })], L);
    const g = r.grassPlots[0];
    expect([g.minCellX, g.maxCellX, g.minCellZ, g.maxCellZ]).toEqual([-4, 4, 0, 6]);
  });
});

describe('v9s.49 · 真实配置拼合结果', () => {
  it('与组装层 / 测试夹具注入的结果完全一致，无重复、无未放置', () => {
    expect(PLOT_ASSEMBLY.stations).toEqual(CONFIG.scene.stations);
    expect(PLOT_ASSEMBLY.slabs).toEqual(CONFIG.scene.slabs);
    expect(PLOT_ASSEMBLY.steps).toEqual(CONFIG.scene.steps);
    expect(PLOT_ASSEMBLY.doorways).toEqual(CONFIG.scene.doorways);
    expect(PLOT_ASSEMBLY.obstacles).toEqual(CONFIG.scene.obstacles);
    expect(PLOT_ASSEMBLY.diagnostics.duplicates).toEqual([]);
    expect(PLOT_ASSEMBLY.diagnostics.unplaced).toEqual([]);
    expect(PLOT_ASSEMBLY.grassPlots).toEqual(CONFIG.scene.grass?.plots);
  });

  it('9 块地各占一格区，hub 钉在原点，其余按 id 序 first-fit', () => {
    const cells = new Set<string>();
    for (const p of PLOT_ASSEMBLY.plots) {
      for (let i = 0; i < p.span[0]; i++) {
        for (let j = 0; j < p.span[1]; j++) {
          const key = `${p.cell.c + i},${p.cell.r + j}`;
          expect(cells.has(key), `${p.id} 与前面的地块抢了格 ${key}`).toBe(false);
          cells.add(key);
        }
      }
    }
    const hub = PLOT_ASSEMBLY.plots.find((p) => p.id === 'hub')!;
    expect(hub.placement).toBe('pinned');
    expect([hub.centerX, hub.centerZ]).toEqual([0, 0]);
    // 出生点就在 origin 板上
    expect(CONFIG.core.spawn.x).toBeGreaterThanOrEqual(hub.slab.minX);
    expect(CONFIG.core.spawn.x).toBeLessThanOrEqual(hub.slab.maxX);
    expect(CONFIG.core.spawn.z).toBeGreaterThanOrEqual(hub.slab.minZ);
    expect(CONFIG.core.spawn.z).toBeLessThanOrEqual(hub.slab.maxZ);
  });

  it('地板铺满包围盒（含填充板），面积正好等于 格子数 × 格面积', () => {
    const area = PLOT_ASSEMBLY.slabs.reduce(
      (s, q) => s + (q.maxX - q.minX) * (q.maxZ - q.minZ), 0,
    );
    const b = PLOT_ASSEMBLY.bounds;
    const merged = (b.maxX + 0.5 - (b.minX - 0.5)) * (b.maxZ + 0.5 - (b.minZ - 0.5));
    expect(area).toBeCloseTo(merged, 6);
    expect(PLOT_ASSEMBLY.slabs.every((s) => s.top === 0 && s.thickness > 0)).toBe(true);
  });

  it('每块地的自带物件都落在自己的地板范围内（不会悬空）', () => {
    const slabOf = new Map(PLOT_ASSEMBLY.plots.map((p) => [p.id, p.slab]));
    const inside = (id: string, x: number, z: number): boolean => {
      const s = slabOf.get(id);
      if (!s) return false;
      return x >= s.minX - 1e-6 && x <= s.maxX + 1e-6 && z >= s.minZ - 1e-6 && z <= s.maxZ + 1e-6;
    };
    const owner = (x: number, z: number): string | undefined =>
      PLOT_ASSEMBLY.plots.find((p) => inside(p.id, x, z))?.id;
    for (const d of PLOT_ASSEMBLY.destructibles) {
      expect(owner(d.x, d.z), `可破坏物件 ${d.id} 悬空`).toBeDefined();
    }
    for (const d of PLOT_ASSEMBLY.dummySpawns) {
      expect(inside(d.plotId, d.x, d.z), `假人在 ${d.plotId} 板外`).toBe(true);
    }
    for (const s of PLOT_ASSEMBLY.steps) {
      expect(owner(s.x, s.z), `台阶 ${s.id} 悬空`).toBeDefined();
    }
    for (const o of PLOT_ASSEMBLY.obstacles) {
      expect(owner(o.x, o.z), `障碍 ${o.id} 悬空`).toBeDefined();
    }
  });

  it('所有传送落点都在可行走边界内、且在工位作用域内', () => {
    const b = CONFIG.core.worldBounds;
    for (const s of PLOT_ASSEMBLY.stations) {
      expect(s.spawnX).toBeGreaterThan(b.minX);
      expect(s.spawnX).toBeLessThan(b.maxX);
      expect(s.spawnZ).toBeGreaterThan(b.minZ);
      expect(s.spawnZ).toBeLessThan(b.maxZ);
      expect(Math.hypot(s.spawnX - s.x, s.spawnZ - s.z)).toBeLessThanOrEqual(s.radius);
    }
  });

  it('默认布局还能再放 6 块标准地块（加地不用改共享文件）', () => {
    const more = Array.from({ length: 6 }, (_, i) => def(`zz-${i}`));
    const r = assemblePlots([...PLOT_ASSEMBLY.plots.map((p) => ({
      id: p.id, name: p.name, hint: p.hint, span: p.span,
      ...(p.placement === 'pinned' ? { pin: 'origin' as const } : {}),
    })), ...more], DEFAULT_PLOT_LAYOUT);
    expect(r.diagnostics.unplaced).toEqual([]);
  });
});
