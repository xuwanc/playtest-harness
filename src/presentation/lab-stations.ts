import type { StationSpec } from '../core';

/**
 * v9s.15 · 工位查找（纯函数，无 DOM / 无 three，可直接单测）。
 *
 * 工位是「圆形作用域」：玩家落进哪个圆就显示哪个工位的说明，重叠时取最近的。
 * 方形工位（地形 / 标尺）用内切圆判定，边缘几厘米判不进去无妨 —— 传送落点都在圆内。
 */

export function stationAt(
  stations: readonly StationSpec[],
  x: number,
  z: number,
): StationSpec | null {
  let best: StationSpec | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const st of stations) {
    const d = Math.hypot(x - st.x, z - st.z);
    if (d <= st.radius && d < bestD) {
      best = st;
      bestD = d;
    }
  }
  return best;
}

export function stationById(
  stations: readonly StationSpec[],
  id: string,
): StationSpec | null {
  return stations.find((s) => s.id === id) ?? null;
}

export function stationByIndex(
  stations: readonly StationSpec[],
  index: number,
): StationSpec | null {
  return stations.find((s) => s.index === index) ?? null;
}

/** 按 index 顺序循环切换（dir = ±1），currentId 无效时从第一个开始 */
export function cycleStation(
  stations: readonly StationSpec[],
  currentId: string | null,
  dir: number,
): StationSpec | null {
  if (stations.length === 0) return null;
  const list = [...stations].sort((a, b) => a.index - b.index);
  const cur = list.findIndex((s) => s.id === currentId);
  const step = dir < 0 ? -1 : 1;
  const next = cur < 0 ? (step > 0 ? 0 : list.length - 1)
    : (cur + step + list.length) % list.length;
  return list[next] ?? null;
}
