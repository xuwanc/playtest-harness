import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { createWeaponTrail } from '../src/presentation/weapon-trail';
import {
  decayImpact, NEUTRAL_STRETCH, smoothStretch, solveStretch,
} from '../src/presentation/limb-stretch';
import type { StretchConfig } from '../src/presentation/limb-stretch';
import { makeWorld, intent } from './helpers';

/**
 * v9s.22 · 「动作不够夸张」的形变通道 + 大剑副手握持。
 *
 * 覆盖三件事：
 *  1) squash & stretch 纯函数：幅度、互斥通道、体积补偿、关闭时恒等；
 *  2) 副手 IK：大剑挥击时左手真的够到柄上（世界距离），且肘不反关节；
 *  3) 拖尾采样：按位移采样、按年龄过期、reset 清空。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

const CFG: StretchConfig = {
  enabled: true, swingArm: 1.4, chargeArm: 0.9, runLeg: 1.1, torsoGain: 0.5,
  impactSquash: 0.2, impactDecay: 11, volumeExp: 0.5, smoothing: 30,
};

const input = (o: Partial<{ swing: number; charge: number; impact: number; speedRatio: number; grounded: boolean }>) => ({
  swing: 0, charge: 0, impact: 0, speedRatio: 0, grounded: true, ...o,
});

function playerRig(anim?: typeof raw.view.animation) {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim ?? raw.view.animation, { ...raw.view.ik, enabled: false },
  );
  return { w, rig };
}

describe('v9s.22 squash & stretch', () => {
  it('中立帧：所有缩放恒为 1', () => {
    const s = solveStretch(input({}), CFG);
    expect(s.arm).toBe(1);
    expect(s.leg).toBe(1);
    expect(s.torso).toBe(1);
    expect(s.girthArm).toBe(1);
  });

  it('挥出时手臂沿骨长拉长，峰值取 swingArm', () => {
    const mid = solveStretch(input({ swing: 0.5 }), CFG);
    const peak = solveStretch(input({ swing: 1 }), CFG);
    expect(mid.arm).toBeGreaterThan(1);
    expect(peak.arm).toBeCloseTo(1.4, 5);
    // easeOut：过半时已经吃掉大部分幅度，但不是全部
    expect(mid.arm).toBeGreaterThan(1.25);
    expect(mid.arm).toBeLessThan(1.4);
  });

  it('蓄力 / 拉弓走压缩通道（<1，变短变粗）', () => {
    const back = solveStretch(input({ swing: -1 }), CFG);
    const bow = solveStretch(input({ charge: 1 }), CFG);
    expect(back.arm).toBeCloseTo(0.9, 5);
    expect(bow.arm).toBeCloseTo(0.9, 5);
    expect(back.girthArm).toBeGreaterThan(1);
  });

  it('三条通道互斥：挥出优先于蓄势，不会被平均成 1', () => {
    const both = solveStretch(input({ swing: 1, charge: 1 }), CFG);
    expect(both.arm).toBeCloseTo(1.4, 5);
  });

  it('命中挤压把手臂同时压短压粗', () => {
    // 不挥只挨一下：arm = 1 × (1 - 0.2) = 0.8，压短就必然变粗
    const squashOnly = solveStretch(input({ impact: 1 }), CFG);
    expect(squashOnly.arm).toBeCloseTo(0.8, 5);
    expect(squashOnly.girthArm).toBeGreaterThan(1);
    // 挥出中途挨一下：比不挨时更短、也更粗
    const hit = solveStretch(input({ swing: 1, impact: 1 }), CFG);
    const plain = solveStretch(input({ swing: 1 }), CFG);
    expect(hit.arm).toBeCloseTo(1.4 * 0.8, 5);
    expect(hit.girthArm).toBeGreaterThan(plain.girthArm);
  });

  it('体积补偿指数 0 = 完全不改粗细', () => {
    const s = solveStretch(input({ swing: 1 }), { ...CFG, volumeExp: 0 });
    expect(s.arm).toBeCloseTo(1.4, 5);
    expect(s.girthArm).toBeCloseTo(1, 5);
  });

  it('躯干只吃 swing 的一部分（torsoGain）', () => {
    const full = solveStretch(input({ swing: 1 }), { ...CFG, torsoGain: 1 });
    const half = solveStretch(input({ swing: 1 }), { ...CFG, torsoGain: 0.5 });
    expect(full.torso).toBeCloseTo(1.4, 5);
    expect(half.torso).toBeCloseTo(1.2, 5);
  });

  it('关闭时恒等，指数平滑不会把值留在旧的形变上', () => {
    const off = { ...CFG, enabled: false };
    expect(solveStretch(input({ swing: 1, impact: 1 }), off)).toEqual(NEUTRAL_STRETCH);
  });

  it('平滑会收敛到目标且不会过冲', () => {
    let cur = { ...NEUTRAL_STRETCH };
    const target = solveStretch(input({ swing: 1 }), CFG);
    let prev = 1;
    for (let i = 0; i < 30; i++) {
      cur = smoothStretch(cur, target, 1 / 60, 30);
      expect(cur.arm).toBeGreaterThanOrEqual(prev - 1e-9);
      expect(cur.arm).toBeLessThanOrEqual(target.arm + 1e-9);
      prev = cur.arm;
    }
    expect(cur.arm).toBeCloseTo(target.arm, 3);
  });

  it('命中脉冲指数衰减到 0', () => {
    let v = 1;
    for (let i = 0; i < 120; i++) v = decayImpact(v, 1 / 60, 11);
    expect(v).toBe(0);
  });
});

describe('v9s.22 骨架形变落地', () => {
  it('关闭 stretch 时骨骼 scale 恒为 1（精确回到旧姿态）', () => {
    const anim = { ...raw.view.animation, stretch: { ...raw.view.animation.stretch, enabled: false } };
    const { w, rig } = playerRig(anim);
    w.combat.weapon = 'sword-shield';
    rig.update(w.character, w.combat, NONE, 1 / 60, false, w.time);
    expect(rig.stretch().arm).toBe(1);
    const hand = rig.group.getObjectByName('handR')!;
    expect(hand.position.y).toBeCloseTo(-raw.view.voxel.armLength / 2, 6);
  });

  it('骨长放大时手的位置同步下移（链式关节位置跟着 scale 走）', () => {
    const { w, rig } = playerRig();
    w.combat.weapon = 'sword-shield';
    let best = 1;
    let bestHandY = 0;
    for (let i = 0; i < 34; i++) {
      step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent());
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const s = rig.stretch();
      if (s.arm > best) {
        best = s.arm;
        bestHandY = rig.group.getObjectByName('handR')!.position.y;
      }
    }
    expect(best).toBeGreaterThan(1.1);
    // hand 是 elbow 的子节点，y 只含前臂那一段：-（armLen/2）× s
    expect(bestHandY).toBeCloseTo(-(raw.view.voxel.armLength / 2) * best, 4);
    rig.dispose();
  });
});

describe('v9s.22 大剑副手握持', () => {
  it('挥击期间左手贴在剑柄上（到柄轴距离 < 一掌），且肘不反关节', () => {
    const { w, rig } = playerRig();
    w.combat.weapon = 'greatsword';
    let worst = 0;
    let checked = 0;
    const mR = rig.group.getObjectByName('mountR')!;
    for (let i = 0; i < 34; i++) {
      step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent());
      (w.combat as any).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      rig.group.updateWorldMatrix(true, true);
      if (w.combat.phase === 'idle') continue;

      // 柄轴：mountR 原点朝局部 -Y 延伸 0.55（大剑下段柄）
      const a = mR.getWorldPosition(new THREE.Vector3());
      const b = mR.localToWorld(new THREE.Vector3(0, -0.55, 0));
      const handL = rig.group.getObjectByName('handL')!.getWorldPosition(new THREE.Vector3());
      const ab = b.clone().sub(a);
      const tSeg = Math.max(0, Math.min(1, handL.clone().sub(a).dot(ab) / ab.lengthSq()));
      const closest = a.clone().addScaledVector(ab, tSeg);
      worst = Math.max(worst, handL.distanceTo(closest));
      checked += 1;

      const elbows: any[] = [];
      rig.group.traverse((o) => { if (o.name === 'elbow') elbows.push(o); });
      expect(elbows[0].rotation.x).toBeLessThan(0);
    }
    expect(checked).toBeGreaterThan(10);
    // 手掌本身 0.15 宽：到柄轴 0.16 以内，视觉上就是握住了。
    // 残差最大的时刻是挥出后段（主手被甩到身体另一侧、超出副手臂展），
    // 这时握点会沿柄滑动，手仍贴在柄上，只是不在最初设定的位置。
    expect(worst).toBeLessThan(0.16);
    rig.dispose();
  });
});

describe('v9s.22 挥击拖尾', () => {
  const trailCfg = {
    enabled: true, maxSamples: 8, minStep: 0.05, life: 0.2,
    minSpeed: 1, color: '#a8d8ff', intensity: 1, tipBoost: 0.2,
  };

  it('按位移采样，静止时不堆点', () => {
    const t = createWeaponTrail(trailCfg);
    const p = { x: 0, y: 1, z: 0 };
    for (let i = 0; i < 10; i++) {
      t.update(1 / 60, { base: p, tip: p }, true);
    }
    expect(t.debug().count).toBe(1);
    expect(t.debug().visible).toBe(false); // 少于 2 个点不画
    t.dispose();
  });

  it('移动时形成轨迹，且按年龄过期', () => {
    const t = createWeaponTrail(trailCfg);
    for (let i = 0; i < 5; i++) {
      const z = i * 0.2;
      t.update(1 / 60, { base: { x: 0, y: 1, z }, tip: { x: 0, y: 1, z: z + 0.1 } }, true);
    }
    expect(t.debug().count).toBeGreaterThanOrEqual(4);
    expect(t.debug().visible).toBe(true);
    // 停手后寿命耗尽 → 轨迹消失
    for (let i = 0; i < 20; i++) t.update(0.05, null, false);
    expect(t.debug().count).toBe(0);
    expect(t.debug().visible).toBe(false);
    t.dispose();
  });

  it('active=false 时不采样（站着不动不会常亮）', () => {
    const t = createWeaponTrail(trailCfg);
    for (let i = 0; i < 5; i++) {
      const z = i * 0.2;
      t.update(1 / 60, { base: { x: 0, y: 1, z }, tip: { x: 0, y: 1, z: z + 0.1 } }, false);
    }
    expect(t.debug().count).toBe(0);
    t.dispose();
  });

  it('reset 清空采样与可见性', () => {
    const t = createWeaponTrail(trailCfg);
    for (let i = 0; i < 5; i++) {
      const z = i * 0.2;
      t.update(1 / 60, { base: { x: 0, y: 1, z }, tip: { x: 0, y: 1, z: z + 0.1 } }, true);
    }
    t.reset();
    expect(t.debug().count).toBe(0);
    expect(t.debug().visible).toBe(false);
    t.dispose();
  });
});
