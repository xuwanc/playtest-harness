import { describe, expect, it } from 'vitest';
import { overlapsAny, runSteps, snapshot } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld, run } from './helpers';

function freezeDummies(w: World): void {
  for (const s of w.dummies) {
    s.mode = 'idle';
    s.velocity.x = 0;
    s.velocity.z = 0;
  }
}

function pairDist(w: World, i: number, j: number): number {
  const a = w.dummies[i].position;
  const b = w.dummies[j].position;
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function distToPlayer(w: World, i: number): number {
  const s = w.dummies[i].position;
  const p = w.character.position;
  return Math.hypot(p.x - s.x, p.z - s.z);
}

describe('角色间分离：不重叠', () => {
  it('玩家与假人完全重合时，假人被推开且玩家逐字节不变', () => {
    const w = makeWorld();
    freezeDummies(w);
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 8;
    const before = JSON.stringify(w.character);
    run(w, 1, intent());
    const minD = w.config.characterRadius + w.config.dummies.radius;
    expect(distToPlayer(w, 0)).toBeGreaterThanOrEqual(minD - 1e-6);
    expect(JSON.stringify(w.character)).toBe(before);
  });

  it('两个假人重合时互相分开（各承担一半）', () => {
    const w = makeWorld();
    freezeDummies(w);
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 5;
    w.dummies[1].position.x = 0.1;
    w.dummies[1].position.z = 5;
    const minD = w.config.dummies.radius * 2;
    run(w, 1, intent());
    expect(pairDist(w, 0, 1)).toBeGreaterThanOrEqual(minD - 1e-6);
  });

  it('多个假人同时完全重合也不会被弹到边界，且两两分开（回归：单位向量放大 bug）', () => {
    const w = makeWorld();
    freezeDummies(w);
    const p = w.character.position;
    for (const s of w.dummies) {
      s.position.x = p.x;
      s.position.z = p.z;
    }
    run(w, 1, intent());
    const minD = w.config.characterRadius + w.config.dummies.radius;
    for (const s of w.dummies) {
      expect(Math.abs(s.position.x - p.x)).toBeLessThan(3);
      expect(Math.abs(s.position.z - p.z)).toBeLessThan(3);
      expect(Math.hypot(s.position.x - p.x, s.position.z - p.z)).toBeGreaterThanOrEqual(minD - 1e-6);
    }
    let minPair = Number.POSITIVE_INFINITY;
    for (let i = 0; i < w.dummies.length; i++) {
      for (let j = i + 1; j < w.dummies.length; j++) minPair = Math.min(minPair, pairDist(w, i, j));
    }
    expect(minPair).toBeGreaterThan(w.config.dummies.radius * 2 - 0.06);
  });

  it('关闭 separation 模块后允许重叠（模块可插拔）', () => {
    const w = makeWorld();
    freezeDummies(w);
    w.modules.separation = false;
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 8;
    run(w, 1, intent());
    expect(distToPlayer(w, 0)).toBeLessThan(0.01);
  });

  it('分离后假人不会被推进白盒', () => {
    const w = makeWorld();
    freezeDummies(w);
    // wall-a 位于 x≈5.75..9.25、z≈0.7..1.3；把玩家与假人挤在墙边
    w.character.position.x = 7.5;
    w.character.position.z = 2.1;
    w.dummies[0].position.x = 7.5;
    w.dummies[0].position.z = 1.9;
    run(w, 1, intent());
    const s = w.dummies[0].position;
    const overlapped = overlapsAny(
      w.boxes, s, w.config.dummies.radius, w.config.dummies.height, w.config.stepHeight,
    );
    expect(overlapped).toBe(false);
  });

  it('长时间运行：所有实体两两保持间距、不越界、坐标有限', () => {
    const w = makeWorld();
    run(w, 600, intent());
    const minD = w.config.characterRadius + w.config.dummies.radius;
    for (const s of w.dummies) {
      expect(Number.isFinite(s.position.x)).toBe(true);
      expect(Number.isFinite(s.position.z)).toBe(true);
      expect(s.position.x).toBeGreaterThanOrEqual(w.config.worldBounds.minX - 1e-6);
      expect(s.position.x).toBeLessThanOrEqual(w.config.worldBounds.maxX + 1e-6);
    }
    // 开阔地 separation 应完全消除重叠；墙角极端挤压留少量容差
    let minPair = Number.POSITIVE_INFINITY;
    for (let i = 0; i < w.dummies.length; i++) {
      minPair = Math.min(minPair, distToPlayer(w, i));
      for (let j = i + 1; j < w.dummies.length; j++) minPair = Math.min(minPair, pairDist(w, i, j));
    }
    expect(minPair).toBeGreaterThan(minD - 0.05);
  });

  it('含重叠初始态的长序列结果逐字节一致', () => {
    const script = (t: number) => intent({
      moveX: Math.sin(t / 18) * 0.8,
      moveZ: -Math.cos(t / 26) * 0.7,
      attackPressed: t % 31 === 0,
      dummyClickId: t % 83 === 0 ? ((t / 83) % 4) + 1 : 0,
    });
    const a = makeWorld();
    const b = makeWorld();
    for (const w of [a, b]) {
      w.dummies[0].position.x = 0;
      w.dummies[0].position.z = 8;
      w.dummies[1].position.x = 0.05;
      w.dummies[1].position.z = 8.05;
    }
    runSteps(a, 400, script);
    runSteps(b, 400, script);
    expect(snapshot(a)).toBe(snapshot(b));
  });
});
