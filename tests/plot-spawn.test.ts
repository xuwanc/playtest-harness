import { describe, expect, it } from 'vitest';
import { clearPlotTestUnits, plotTestUnitCount, snapshot, spawnPlotTestUnits } from '../src/core';
import { makeLabWorld, PLOT_ASSEMBLY } from './helpers';

const demo = PLOT_ASSEMBLY.plots.find((p) => p.testSpawn);
if (!demo) throw new Error('config/plots 中应至少有一个带 testSpawn 的示范地块');

const N = (demo.testSpawn?.dummies ?? 0) + (demo.testSpawn?.fighters ?? 0);

describe('v9s.43 · 地块测试按钮生成单位', () => {
  it('数量 / spawnedByPlot 标记 / id 连续 / 落在地块中心附近', () => {
    const w = makeLabWorld();
    const base = w.dummies.length;
    const n = spawnPlotTestUnits(w, demo);
    expect(n).toBe(N);
    expect(w.dummies).toHaveLength(base + N);
    expect(plotTestUnitCount(w)).toBe(N);

    const spawned = w.dummies.slice(base);
    for (const d of spawned) {
      expect(d.spawnedByPlot).toBe(demo.id);
      expect(Math.hypot(d.position.x - demo.centerX, d.position.z - demo.centerZ))
        .toBeLessThanOrEqual(2);
      expect(Math.hypot(d.homeX - demo.centerX, d.homeZ - demo.centerZ))
        .toBeLessThanOrEqual(2);
    }
    // 基线单位（配置里的 6 假人 + 3 陪练）永远不带标记
    for (const d of w.dummies.slice(0, base)) expect(d.spawnedByPlot).toBeUndefined();
    // id 与数组下标 +1 严格一致（点击轮转 / 表现层按 id 索引都依赖这个）
    for (let i = 0; i < w.dummies.length; i++) expect(w.dummies[i].id).toBe(i + 1);
  });

  it('普通假人无武器，陪练带武器且模式为 spar', () => {
    const w = makeLabWorld();
    const base = w.dummies.length;
    spawnPlotTestUnits(w, demo);
    const spawned = w.dummies.slice(base);
    const plain = spawned.slice(0, demo.testSpawn?.dummies ?? 0);
    const fighters = spawned.slice(demo.testSpawn?.dummies ?? 0);
    for (const d of plain) {
      expect(d.weapon).toBeNull();
      expect(d.mode).not.toBe('spar');
    }
    for (const d of fighters) {
      expect(d.weapon).not.toBeNull();
      expect(d.mode).toBe('spar');
    }
  });

  it('确定性：重复点击先清后建，结果逐字段一致（不用随机源）', () => {
    const a = makeLabWorld();
    spawnPlotTestUnits(a, demo);
    const b = makeLabWorld();
    spawnPlotTestUnits(b, demo);
    spawnPlotTestUnits(b, demo); // 再点一次，应先清旧再建
    const shape = (w: typeof a) => w.dummies.map((d) => [
      d.id, d.mode, d.weapon, d.position.x, d.position.z, d.homeX, d.homeZ,
      d.attackCooldown, d.spawnedByPlot ?? null,
    ]);
    expect(shape(b)).toEqual(shape(a));
    expect(b.dummies).toHaveLength(a.dummies.length);
  });

  it('清除：回到基线、id 重排、基线单位一个不少', () => {
    const w = makeLabWorld();
    const base = w.dummies.length;
    const beforeIds = w.dummies.map((d) => d.id);
    spawnPlotTestUnits(w, demo);
    const removed = clearPlotTestUnits(w);
    expect(removed).toBe(N);
    expect(w.dummies).toHaveLength(base);
    expect(plotTestUnitCount(w)).toBe(0);
    expect(w.dummies.map((d) => d.id)).toEqual(beforeIds);
  });

  it('只清指定地块时，别的地块生成的单位保留', () => {
    const w = makeLabWorld();
    const base = w.dummies.length;
    spawnPlotTestUnits(w, demo);
    // 伪造另一块地的单位（只加标记，不改结构）
    for (const d of w.dummies.slice(base)) d.spawnedByPlot = 'other-plot';
    spawnPlotTestUnits(w, demo); // 会新建 demo 的单位，other 的仍在
    const kept = w.dummies.filter((d) => d.spawnedByPlot === 'other-plot');
    expect(kept).toHaveLength(N);
    expect(w.dummies.filter((d) => d.spawnedByPlot === demo.id)).toHaveLength(N);
  });

  it('生成 / 清除是运行时调试操作：回到基线后 World 快照逐字节不变', () => {
    const w = makeLabWorld();
    const before = snapshot(w);
    spawnPlotTestUnits(w, demo);
    clearPlotTestUnits(w);
    expect(snapshot(w)).toBe(before);
  });
});
