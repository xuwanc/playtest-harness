import { describe, expect, it } from 'vitest';
import {
  createDestructibleStates, DEST_BOX_PREFIX, destructibleColliders, forceBreak,
  MIN_STAND, step, syncDestructibleBoxes,
} from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.60 · 可破坏物件的碰撞。
 *
 * 之前这些东西**完全没有碰撞**：玩家能从仙人掌 / 旗杆中间走过去，砍完也没有
 * 「路通了」的反馈。现在站立段是 `kind: 'obstacle'` 的 AABB，断到只剩底座
 * 就把顶面压回地面、AABB 退化，玩家自然穿得过去。
 */

/** 在玩家正前方（-Z）放一株仙人掌，并把碰撞盒接进世界。 */
function worldWithCactus(): World {
  const w = makeWorld();
  w.destructibles = createDestructibleStates([
    { id: 'cac-t', kind: 'cactus', x: 0, y: 0, z: -2, height: 2, radius: 0.3 },
  ]);
  for (const b of destructibleColliders(w.destructibles)) w.boxes.push(b);
  w.character.position.x = 0;
  w.character.position.z = 0;
  w.character.position.y = 0;
  return w;
}

function walk(w: World, frames: number): void {
  for (let i = 0; i < frames; i++) step(w, 1 / 60, intent({ moveZ: -1 }));
}

describe('v9s.60 · 可破坏物件是实体', () => {
  it('每件都有碰撞盒，尺寸 = 半径 × 站立高度', () => {
    const w = worldWithCactus();
    const box = w.boxes.find((b) => b.id === `${DEST_BOX_PREFIX}cac-t`);
    expect(box).toBeDefined();
    expect(box!.kind).toBe('obstacle');
    expect(box!.maxX - box!.minX).toBeCloseTo(0.6, 6);
    expect(box!.maxY).toBeCloseTo(2, 6);
  });

  it('走向仙人掌会被挡住，不会穿过去', () => {
    const w = worldWithCactus();
    walk(w, 150);   // 2.5s，足够走 4m 以上
    // 玩家半径 0.3 + 物件半径 0.3 = 0.6 → 停在 z ≈ -1.4，绝不越过 z = -2
    expect(w.character.position.z).toBeGreaterThan(-1.5);
    expect(Math.hypot(w.character.position.x, w.character.position.z + 2)).toBeGreaterThan(0.55);
  });

  it('砍断后碰撞盒跟着变矮（不会「东西断了还挡路」）', () => {
    const w = worldWithCactus();
    forceBreak(w, 'cac-t', 1.0, 0, 0, 1);
    syncDestructibleBoxes(w);
    const box = w.boxes.find((b) => b.id === `${DEST_BOX_PREFIX}cac-t`)!;
    expect(w.destructibles[0].standU).toBeLessThan(0.6);
    expect(box.maxY).toBeCloseTo(w.destructibles[0].standU * 2, 6);
  });

  it('断到只剩底座：碰撞退化，玩家可以走过去', () => {
    const w = worldWithCactus();
    // 贴地砍：cutY 会被 clamp 到「保留的最小站立高度」，几次之后只剩底座
    for (let i = 0; i < 6; i++) {
      forceBreak(w, 'cac-t', 0, 0, 0, 1);
      syncDestructibleBoxes(w);
    }
    const st = w.destructibles[0];
    expect(st.standU).toBeLessThanOrEqual(MIN_STAND + 1e-6);
    const box = w.boxes.find((b) => b.id === `${DEST_BOX_PREFIX}cac-t`)!;
    expect(box.maxY).toBe(box.minY);
    walk(w, 220);
    // 越过物件原点（-2）就算通过 —— 有碰撞时这里会停在 -1.4 附近
    expect(w.character.position.z).toBeLessThan(-2.2);
  });

  it('复位后碰撞盒恢复原高（复位不该留下「隐形的洞」）', () => {
    const w = worldWithCactus();
    forceBreak(w, 'cac-t', 0.8, 0, 0, 1);
    syncDestructibleBoxes(w);
    const mid = w.boxes.find((b) => b.id === `${DEST_BOX_PREFIX}cac-t`)!.maxY;
    expect(mid).toBeLessThan(2);
    w.destructibles[0].standU = 1;
    syncDestructibleBoxes(w);
    expect(w.boxes.find((b) => b.id === `${DEST_BOX_PREFIX}cac-t`)!.maxY).toBeCloseTo(2, 6);
  });
});
