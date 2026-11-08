import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { solveBalance } from '../src/presentation/balance';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeQuietWorld, intent, run } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const SUPPORT = { minX: -0.2, maxX: 0.2, minZ: -0.15, maxZ: 0.15 };

describe('v9s.33 动态平衡量化（纯函数）', () => {
  it('质心在正中 → 满分；偏移越大分越低', () => {
    const pts = [{ x: 0, y: 0.9, z: 0, mass: 1 }];
    const a = solveBalance(pts, SUPPORT, 0, 0);
    expect(a.score).toBeCloseTo(1, 6);
    expect(a.marginX).toBeCloseTo(1, 6);

    const b = solveBalance([{ x: 0.12, y: 0.9, z: 0, mass: 1 }], SUPPORT, 0, 0);
    expect(b.score).toBeLessThan(0.75);
    expect(b.score).toBeGreaterThan(0.3);

    const c = solveBalance([{ x: 0.3, y: 0.9, z: 0, mass: 1 }], SUPPORT, 0, 0);
    expect(c.score).toBe(0);
    expect(c.overX).toBeGreaterThan(0.09);
  });

  it('质量加权：重的那一侧决定质心', () => {
    const r = solveBalance(
      [{ x: -0.2, y: 0.9, z: 0, mass: 3 }, { x: 0.2, y: 0.9, z: 0, mass: 1 }],
      SUPPORT, 0, 0,
    );
    expect(r.comX).toBeCloseTo(-0.1, 6);
  });

  it('速度把 COM 外推成捕获点（同向、随速度增大）', () => {
    const pts = [{ x: 0, y: 0.9, z: 0, mass: 1 }];
    const still = solveBalance(pts, SUPPORT, 0, 0);
    const walk = solveBalance(pts, SUPPORT, 2, 0);
    const run_ = solveBalance(pts, SUPPORT, 5, 0);
    expect(walk.xcomX).toBeGreaterThan(still.xcomX);
    expect(run_.xcomX).toBeGreaterThan(walk.xcomX);
    expect(walk.score).toBeLessThan(still.score);
  });

  it('空中没有支撑面：grounded=false、不参与评分', () => {
    const r = solveBalance([{ x: 0, y: 1, z: 0, mass: 1 }], { minX: 0, maxX: 0, minZ: 0, maxZ: 0 }, 4, 0);
    expect(r.grounded).toBe(false);
    expect(r.score).toBe(1);
  });
});

function runCase(weapon: 'sword-shield' | 'dual-swords', auto: boolean): { lat: number; score: number } {
  const w = makeQuietWorld();
  w.modules.targeting = false;
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik, raw.view.links, raw.view.weaponWrist,
    { ...raw.view.balance!, autoCounter: auto },
  );
  const lat: number[] = [];
  const score: number[] = [];
  for (let i = 0; i < 30; i++) {
    run(w, 1, intent());
    (w.combat as any).weapon = weapon;
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
  }
  for (let i = 0; i < 150; i++) {
    run(w, 1, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
    (w.combat as any).weapon = weapon;
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    if (w.combat.phase !== 'windup' && w.combat.phase !== 'recovery') continue;
    const b = rig.balanceDebug();
    if (!b) continue;
    const rightX = Math.cos(w.character.bodyYaw);
    const rightZ = -Math.sin(w.character.bodyYaw);
    lat.push(Math.abs((b.xcomX - b.centerX) * rightX + (b.xcomZ - b.centerZ) * rightZ));
    score.push(b.score);
  }
  rig.dispose();
  return {
    lat: lat.reduce((a, b) => a + b, 0) / Math.max(1, lat.length),
    score: score.reduce((a, b) => a + b, 0) / Math.max(1, score.length),
  };
}

describe('v9s.33 动态平衡量化（骨架）', () => {
  it('配置合法', () => {
    const b = raw.view.balance!;
    expect(b.enabled).toBe(true);
    expect(b.reactionTime).toBeGreaterThan(0);
    expect(b.maxShift).toBeGreaterThan(0);
    expect(b.maxShift).toBeLessThan(0.1);
  });

  it('待机有读数，分数在 0..1 且不是恒 1', () => {
    const w = makeQuietWorld();
    w.modules.targeting = false;
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation, raw.view.ik, raw.view.links, raw.view.weaponWrist, raw.view.balance,
    );
    for (let i = 0; i < 40; i++) {
      run(w, 1, intent());
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    }
    const b = rig.balanceDebug()!;
    expect(b).toBeTruthy();
    expect(b.grounded).toBe(true);
    expect(b.score).toBeGreaterThan(0);
    expect(b.score).toBeLessThanOrEqual(1);
    expect(b.halfX).toBeGreaterThan(0.05);
    expect(Number.isFinite(b.comY)).toBe(true);
    rig.dispose();
  });

  it('自动重心修正把侧向偏移压小（A/B 对照）', () => {
    for (const wp of ['sword-shield', 'dual-swords'] as const) {
      const on = runCase(wp, true);
      const off = runCase(wp, false);
      // 手臂配重只有 2mm 量级；骨盆平移能到 4~5mm（上限 4.5cm × 0.6 质量比）
      expect(on.lat, `${wp} 侧向偏移`).toBeLessThan(off.lat - 0.001);
    }
  });
});
