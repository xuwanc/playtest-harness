import { describe, expect, it } from 'vitest';
import {
  makePathRequest,
  nextRandom,
  nullPathfinder,
  restoreWorld,
  runSteps,
  snapshot,
} from '../src/core';
import { intent, makeWorld } from './helpers';

function assertPlain(value: unknown): void {
  if (value === null) return;
  if (typeof value === 'function') throw new Error('World 中出现函数，破坏可序列化性');
  if (typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) assertPlain(item);
    return;
  }
  for (const v of Object.values(value)) assertPlain(v);
}

describe('Core 可移植性（P3 无头验证）', () => {
  it('在纯 Node（无 DOM、无 WebGL）环境完整跑 600 步', () => {
    expect(typeof (globalThis as { window?: unknown }).window).toBe('undefined');
    const w = makeWorld();
    runSteps(w, 600, (t) => intent({
      moveX: Math.sin(t / 30),
      moveZ: -0.5,
      jumpPressed: t % 80 === 0,
      sprintHeld: t % 150 < 50,
      attackPressed: t % 55 === 0,
      weaponSlot: t === 200 ? 4 : t === 400 ? 5 : 0,
    }));
    expect(w.tick).toBe(600);
    expect(Number.isFinite(w.character.position.x)).toBe(true);
    expect(Number.isFinite(w.character.position.y)).toBe(true);
  });

  it('World 是纯 plain 数据，JSON 往返完全无损', () => {
    const w = makeWorld();
    runSteps(w, 90, () => intent({ moveX: 0.3, moveZ: -1 }));
    assertPlain(w);
    expect(restoreWorld(snapshot(w))).toEqual(w);
  });

  it('种子随机可复现，且不使用 Math.random', () => {
    const a = makeWorld();
    const b = makeWorld();
    const sa = Array.from({ length: 32 }, () => nextRandom(a));
    const sb = Array.from({ length: 32 }, () => nextRandom(b));
    expect(sa).toEqual(sb);
    expect(sa.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(new Set(sa).size).toBeGreaterThan(20);
  });

  it('寻路契约已定义并可用（本期为占位实现）', () => {
    const w = makeWorld();
    const req = makePathRequest(
      0, 8, -3, -6,
      w.config.characterRadius, w.config.characterHeight, w.config.stepHeight,
    );
    const res = nullPathfinder(req, w.boxes, w.gridMeta);
    expect(res.found).toBe(false);
    expect(res.nodes).toEqual([]);
    expect(w.gridMeta.cellSize).toBeGreaterThan(0);
  });

  it('场景白盒含 5 级台阶与 2 个门洞，且碰撞数据完整', () => {
    const w = makeWorld();
    const stepHeights = w.boxes.filter((b) => b.kind === 'step').map((b) => b.maxY).sort((x, y) => x - y);
    expect(stepHeights).toEqual([0.25, 0.4, 0.6, 0.9, 1.2]);
    expect(w.boxes.filter((b) => b.kind === 'lintel')).toHaveLength(2);
    expect(w.boxes.every((b) => b.maxX > b.minX && b.maxY > b.minY && b.maxZ > b.minZ)).toBe(true);
  });
});
