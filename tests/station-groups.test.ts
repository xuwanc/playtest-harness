import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  STATION_GROUPS, classifyStation, groupStations,
} from '../src/presentation/station-groups';
import type { StationGroupId } from '../src/presentation/station-groups';

/** 直接读真实地块配置：新增地块若没归类会在这里立刻暴露，而不是等界面上找不到。 */
const plotDir = new URL('../config/plots/', import.meta.url);
const plots: { id: string; name: string }[] = readdirSync(plotDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => {
    const d = JSON.parse(readFileSync(new URL(f, plotDir), 'utf8')) as {
      id: string; name: string;
    };
    return { id: d.id, name: d.name };
  });

/** 全部线上地块的目标分组。改名字 / 加地块时这张表就是「划分口径」。 */
const EXPECTED: Record<string, StationGroupId> = {
  hub: 'movement',
  gait: 'movement',
  dash: 'movement',
  terrain: 'movement',
  windup: 'combat',
  rings: 'combat',
  'sparring-demo': 'combat',
  meter: 'combat',
  'y-murloc': 'combat',
  'x-destructibles': 'scene',
};

describe('工位功能分组', () => {
  it('分组表结构：id 唯一、other 垫底、非兜底组都有关键词', () => {
    const ids = STATION_GROUPS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[ids.length - 1]).toBe('other');
    for (const g of STATION_GROUPS) {
      if (g.id !== 'other') expect(g.keywords.length).toBeGreaterThan(0);
      expect(g.label.length).toBeGreaterThan(0);
    }
  });

  it('全部真实地块都归到预期组，没有漏进 other', () => {
    // 不写死地块数量（多 agent 会增删地块）：与下方名单表保持同步即可
    expect(plots.length).toBe(Object.keys(EXPECTED).length);
    const bad: string[] = [];
    for (const p of plots) {
      const want = EXPECTED[p.id];
      const got = classifyStation(p.id, p.name);
      if (want === undefined || got !== want) bad.push(`${p.id}: want=${want} got=${got}`);
    }
    expect(bad).toEqual([]);
  });

  it('名单与配置同步：没有已删除的预期项，也没有漏写的新地块', () => {
    const ids = plots.map((p) => p.id).sort();
    expect(Object.keys(EXPECTED).sort()).toEqual(ids);
  });

  it('未知工位兜底到 other（新地块永远不会从面板消失）', () => {
    expect(classifyStation('zzz-new-plot', '完全没见过的名字')).toBe('other');
    expect(classifyStation('', '')).toBe('other');
  });

  it('大小写不敏感，id 与 name 任一命中即可', () => {
    expect(classifyStation('MY-DASH-PLOT', '随便')).toBe('movement');
    expect(classifyStation('some-plot', '测试冲刺标尺')).toBe('movement');
  });

  it('groupStations 覆盖全部输入、无重复，组内保持传入顺序', () => {
    const items = [
      { id: 'b-terrain', name: '地形', index: 9 },
      { id: 'a-hub', name: '中央 8 向', index: 1 },
      { id: 'c-windup', name: '起手预警', index: 5 },
      { id: 'd-x-destructibles', name: '可破坏物件', index: 3 },
      { id: 'e-unknown', name: '没见过', index: 7 },
    ];
    const buckets = groupStations(items);
    const flat = buckets.flatMap((b) => b.items).map((x) => x.id);
    expect(new Set(flat).size).toBe(items.length);
    expect(flat.slice().sort()).toEqual(items.map((x) => x.id).slice().sort());
    const movement = buckets.find((b) => b.group.id === 'movement')!;
    // 组内保持传入顺序（调用方按 index 排好序后传进来）
    expect(movement.items.map((x) => x.id)).toEqual(['b-terrain', 'a-hub']);
    expect(buckets.find((b) => b.group.id === 'other')!.items[0].id).toBe('e-unknown');
  });

  it('空组不返回，且不修改传入数组', () => {
    const items = [{ id: 'hub', name: '中央 8 向' }];
    const before = items.slice();
    const buckets = groupStations(items);
    expect(buckets.map((b) => b.group.id)).toEqual(['movement']);
    expect(buckets[0].items).toHaveLength(1);
    expect(items).toEqual(before);
  });
});
