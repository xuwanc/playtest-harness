/**
 * v9s.x · 测试工位的功能分组（纯函数，无 DOM / 无 Core / 无 three，可直接单测）。
 *
 * 工位面板此前把全部工位按 index 平铺成一长列。地块从 7 个涨到 10 个以后，
 * 「找个测冲刺的工位」要在十行里逐行扫名字。这里按项目既有的「调试面板按功能分
 * 大类」语汇（见 docs/INDEX.md §3.4）把工位归成几组，组内仍按 index 排序。
 *
 * 设计取舍：
 *  - 分类规则放在**表现层**、按 id / name 关键词匹配，不改 `StationSpec` 契约、
 *    不动 `config/plots/*.json`、不影响 `assemblePlots()` 的槽位与确定性快照。
 *  - 未命中的工位一律进 `other`，**新增地块永远不会从面板上消失**；要归到已有组
 *    只需在 `STATION_GROUPS` 里加一个关键词，不用改渲染代码。
 *  - 分组只改变 DOM 的包裹层级：`data-station` / `lab-row` / `is-active` 全部保持，
 *    因此工位传送、`[` `]` 循环、smoke 的 `stationRows == plot.count` 断言都不受影响。
 */

export type StationGroupId = 'movement' | 'combat' | 'scene' | 'other';

export type StationGroup = {
  id: StationGroupId;
  /** 组标题，沿用「A / B」的命名风格，不带版本号 */
  label: string;
  /** 组标题右侧的小字，一句话说明这组测什么 */
  hint: string;
  /** 色条与当前组高亮色 */
  color: string;
  /** 命中即归入本组；对 `id + name` 的小写串做包含匹配，按顺序优先 */
  keywords: readonly string[];
};

/** 顺序即面板里的组顺序；`other` 必须是最后一个兜底组。 */
export const STATION_GROUPS: readonly StationGroup[] = [
  {
    id: 'movement',
    label: '移动 / 走位',
    hint: '推杆、步态、冲刺、地形',
    color: '#7fb8d8',
    keywords: ['hub', 'gait', 'dash', 'terrain', '8 向', '步态', '冲刺', '地形', '门洞', '走位'],
  },
  {
    id: 'combat',
    label: '战斗 / 技能',
    hint: '起手、连招、状态、进度',
    color: '#ffd166',
    keywords: [
      'windup', 'rings', 'sparring', 'meter', 'windup-demo', 'murloc',
      '起手', '预警', '环状态', '色阶', '陪练', '进度弧', '蓄力', '冷却', '鱼人',
    ],
  },
  {
    id: 'scene',
    label: '场景 / 可破坏',
    hint: '物件、地形结构、刚体',
    color: '#6fe0a0',
    keywords: ['destruct', 'cactus', 'jar', 'break', '可破坏', '仙人掌', '旗杆', '罐', '瓶', '物件'],
  },
  {
    id: 'other',
    label: '其他',
    hint: '新增地块自动落这里',
    color: '#9aa8b6',
    keywords: [],
  },
];

/** 单个工位归到哪组。大小写不敏感，未知 id / name 一律兜底到 `other`。 */
export function classifyStation(id: string, name: string): StationGroupId {
  const text = `${id} ${name}`.toLowerCase();
  for (const g of STATION_GROUPS) {
    if (g.keywords.length === 0) continue;   // other 由下面的兜底负责
    if (g.keywords.some((k) => text.includes(k.toLowerCase()))) return g.id;
  }
  return 'other';
}

export type StationGroupBucket<T> = {
  group: StationGroup;
  items: T[];
};

/**
 * 把工位列表分桶。**组内保持传入顺序**（调用方通常已按 index 排好），
 * 空组不返回（`other` 为空时面板不会出现「其他」这一节）。
 */
export function groupStations<T extends { id: string; name: string }>(
  items: readonly T[],
): StationGroupBucket<T>[] {
  const buckets = new Map<StationGroupId, T[]>();
  for (const g of STATION_GROUPS) buckets.set(g.id, []);
  for (const item of items) buckets.get(classifyStation(item.id, item.name))!.push(item);
  return STATION_GROUPS
    .filter((g) => buckets.get(g.id)!.length > 0)
    .map((g) => ({ group: g, items: buckets.get(g.id)! }));
}
