import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import type { AppConfig } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import {
  MAX_SPINE_SEGMENTS, normalizeSegments, spineWeights, spineYawCurve,
} from '../src/presentation/spine-chain';
import { makeQuietWorld, intent, run } from './helpers';
import { spineChain, torsoPitchOf, torsoYawOf } from './rig-nodes';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

/* -------------------------------------------------------------------------- *
 * 纯函数：分配数学
 * -------------------------------------------------------------------------- */
describe('v9s.72 脊柱链分配（纯函数）', () => {
  it('段数夹到 [2, MAX]，非法值退回 2', () => {
    expect(normalizeSegments(undefined)).toBe(2);
    expect(normalizeSegments(0)).toBe(2);
    expect(normalizeSegments(1)).toBe(2);
    expect(normalizeSegments(3)).toBe(3);
    expect(normalizeSegments(9)).toBe(MAX_SPINE_SEGMENTS);
    expect(normalizeSegments(Number.NaN)).toBe(2);
  });

  it('两段权重与旧版逐位相同（waist / (waist + chest)）', () => {
    const w = spineWeights(2, 0.58, 0.42);
    expect(w).toHaveLength(2);
    expect(w[0]).toBeCloseTo(0.58 / 1.0, 12);
    expect(w[1]).toBeCloseTo(0.42 / 1.0, 12);
  });

  it('权重和恒为 1，沿链单调递减（腰比胸吃得多），三段也是同一条直线', () => {
    for (const n of [2, 3, 4]) {
      const w = spineWeights(n, 0.58, 0.42);
      expect(w.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
      for (let i = 1; i < n; i++) expect(w[i]).toBeLessThan(w[i - 1]);
    }
    expect(spineWeights(3, 0.58, 0.42)[1]).toBeCloseTo(0.5 / 1.5, 12);
  });

  it('权重全 0 时不僵住：退回均分', () => {
    const w = spineWeights(3, 0, 0);
    expect(w).toEqual([1 / 3, 1 / 3, 1 / 3]);
  });

  it('偏航曲线：末项恒为 1，中间项单调递增，两段时第 0 项 = chainBlend', () => {
    for (const n of [2, 3, 4]) {
      const c = spineYawCurve(n, 0.58);
      expect(c).toHaveLength(n);
      expect(c[n - 1]).toBe(1);
      for (let i = 1; i < n; i++) expect(c[i]).toBeGreaterThan(c[i - 1]);
    }
    expect(spineYawCurve(2, 0.58)[0]).toBeCloseTo(0.58, 12);
    // 三段：腰 0.42 / 下胸 0.72，每级增量 0.42 → 0.30 → 0.28（递减）
    const c3 = spineYawCurve(3, 0.58);
    expect(c3[0]).toBeCloseTo(Math.pow(1 / 3, Math.log(0.58) / Math.log(0.5)), 12);
    expect(c3[1]).toBeCloseTo(Math.pow(2 / 3, Math.log(0.58) / Math.log(0.5)), 12);
  });

  it('chainBlend 被夹到 [0.1, 0.9]，极端值不会让曲线塌掉', () => {
    const lo = spineYawCurve(3, 0);
    const hi = spineYawCurve(3, 5);
    for (const c of [lo, hi]) {
      expect(c[2]).toBe(1);
      expect(c[0]).toBeGreaterThan(0);
      expect(c[0]).toBeLessThan(1);
      expect(c[1]).toBeGreaterThan(c[0]);
    }
  });
});

/* -------------------------------------------------------------------------- *
 * 骨架集成：真的长出 N 个关节，几何也跟着切
 * -------------------------------------------------------------------------- */
type Rig = ReturnType<typeof createVoxelRig>;

function mkRig(segments: number | undefined): { rig: Rig; w: ReturnType<typeof makeQuietWorld> } {
  const w = makeQuietWorld();
  w.modules.targeting = false;
  const anim = JSON.parse(JSON.stringify(raw.view.animation)) as AppConfig['view']['animation'];
  anim.spine = { ...anim.spine!, enabled: true, segments };
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim, { ...raw.view.ik, enabled: false },
  );
  return { rig, w };
}

const aim = intent({ moveX: 0.7, moveZ: 1, aimActive: true, aimX: 1, aimZ: 0 });

describe('v9s.72 三段脊柱链（骨架）', () => {
  it('段数决定关节数量与名字：2 段无 spine1，3 段有', () => {
    const two = mkRig(2);
    expect(spineChain(two.rig).map((n) => n.name)).toEqual(['upper', 'chest']);
    two.rig.dispose();

    const three = mkRig(3);
    expect(spineChain(three.rig).map((n) => n.name)).toEqual(['upper', 'spine1', 'chest']);
    three.rig.dispose();
  });

  it('关节高度按 pivots 摆：躯干顶 = 0.72 × 身高', () => {
    const { rig } = mkRig(3);
    rig.group.updateWorldMatrix(true, true);
    const chest = rig.group.getObjectByName('chest')!;
    const spine1 = rig.group.getObjectByName('spine1')!;
    const pelvis = rig.group.getObjectByName('pelvis')!;
    const p = pelvis.getWorldPosition(new THREE.Vector3());
    const c = chest.getWorldPosition(new THREE.Vector3());
    const m = spine1.getWorldPosition(new THREE.Vector3());
    const H = raw.view.voxel.bodyHeight;
    expect(c.y - p.y).toBeCloseTo(0.72 * H, 6);
    expect(m.y - p.y).toBeCloseTo(0.42 * H, 6);
    rig.dispose();
  });

  it('几何按段切开且总高不变（不留缝、不叠罗汉）', () => {
    const { rig } = mkRig(3);
    const meshes = (['torsoLower', 'torsoMid1', 'torsoUpper']
      .map((n) => rig.group.getObjectByName(n))
      .filter(Boolean)) as THREE.Mesh[];
    expect(meshes).toHaveLength(3);
    // 人体默认体型不加补块（补块只在鱼人身上开），三段高度之和 = 躯干高
    const total = meshes.reduce((a, m) => a + (m.geometry as THREE.BoxGeometry).parameters.height, 0);
    expect(total).toBeCloseTo(raw.view.voxel.bodyHeight, 6);
    rig.dispose();
  });

  it('俯仰按权重摊到每一级，总和 = 拆分前的总角', () => {
    const { rig, w } = mkRig(3);
    // 前冲最能把惯性前倾压出来（纯瞄准给的俯仰只有几毫弧度，验不出分配）
    const fwd = intent({ moveZ: 1 });
    run(w, 50, fwd);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
    for (let i = 0; i < 10; i++) {
      run(w, 1, fwd);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
    }
    const chain = spineChain(rig);
    const total = torsoPitchOf(rig);
    const want = spineWeights(3, raw.view.animation.spine!.waist, raw.view.animation.spine!.chest);
    expect(Math.abs(total)).toBeGreaterThan(0.005);      // 确实在弯，否则空转
    for (let i = 0; i < chain.length; i++) {
      expect(chain[i].rotation.x).toBeCloseTo(total * want[i], 6);
    }
    rig.dispose();
  });

  it('偏航总和与两段骨架一致（段数只改「谁吃」，不改「吃多少」）', () => {
    const two = mkRig(2);
    const three = mkRig(3);
    run(two.w, 60, aim);
    run(three.w, 60, aim);
    let worst = 0;
    for (let i = 0; i < 20; i++) {
      run(two.w, 1, aim);
      run(three.w, 1, aim);
      two.rig.update(two.w.character, two.w.combat, two.w.playerHurt, two.w.config.fixedDt, false);
      three.rig.update(three.w.character, three.w.combat, three.w.playerHurt, three.w.config.fixedDt, false);
      worst = Math.max(worst, Math.abs(torsoYawOf(two.rig) - torsoYawOf(three.rig)));
    }
    expect(worst).toBeLessThan(2e-2);   // 闭环反馈会带来极小差异，但不该是量级差别
    two.rig.dispose(); three.rig.dispose();
  });

  it('帧尾守卫：三段下 leak 仍恒为 0', () => {
    const { rig, w } = mkRig(3);
    const phases = [intent(), intent({ moveZ: 1 }), intent({ moveX: 1 }), intent({ attackHeld: true })];
    for (const it of phases) {
      for (let i = 0; i < 20; i++) {
        run(w, 1, it);
        rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
        expect(Math.abs(rig.spineDebug()!.leak)).toBeLessThan(1e-9);
      }
    }
    expect(rig.spineDebug()!.segments).toBe(3);
    expect(rig.spineDebug()!.totalYaw).toBeCloseTo(
      rig.spineDebug()!.waistYaw + rig.spineDebug()!.midYaw + rig.spineDebug()!.chestYaw, 12,
    );
    rig.dispose();
  });

  it('四段也能跑（上限之内不崩、总角仍然守恒）', () => {
    const { rig, w } = mkRig(4);
    run(w, 40, aim);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
    const chain = spineChain(rig);
    expect(chain).toHaveLength(4);
    for (let i = 0; i < chain.length; i++) {
      expect(chain[i].rotation.x).toBeCloseTo(torsoPitchOf(rig) * spineWeights(4, 0.58, 0.42)[i], 6);
    }
    rig.dispose();
  });
});
