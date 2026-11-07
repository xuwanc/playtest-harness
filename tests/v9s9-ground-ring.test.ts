import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { dummyThreatLevel, isHostileDummy } from '../src/core';
import { buildGroundRingGeometry, createGroundRing } from '../src/presentation/ground-ring';
import { makeWorld } from './helpers';

type W = ReturnType<typeof makeWorld>;

/** 把默认 4 个假人推到远处，再按与玩家的相对距离摆一个回来（玩家初始 z = 8）。 */
function isolate(w: W, dist: number, mode: W['dummies'][number]['mode']): W['dummies'][number] {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = 100;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  const d = w.dummies[0];
  d.position.x = w.character.position.x;
  d.position.z = w.character.position.z - dist;
  d.mode = mode;
  d.attackPhase = 'idle';
  return d;
}

describe('v9s.9 脚下半环：威胁读数', () => {
  it('中立单位不算敌对，威胁读数很低', () => {
    const w = makeWorld();
    const d = isolate(w, 1.5, 'idle');
    expect(isHostileDummy(w, d)).toBe(false);
    expect(dummyThreatLevel(w, d)).toBeLessThan(0.2);
  });

  it('敌对单位随距离拉近变红（读数单调升高）', () => {
    const w = makeWorld();
    isolate(w, 6.5, 'follow');
    const far = dummyThreatLevel(w, w.dummies[0]);
    isolate(w, 2, 'follow');
    const near = dummyThreatLevel(w, w.dummies[0]);
    expect(isHostileDummy(w, w.dummies[0])).toBe(true);
    expect(near).toBeGreaterThan(far);
    expect(near).toBeGreaterThan(0.4);
  });

  it('挥砍 active 帧读数最高（近距攻击 = 满威胁）', () => {
    const w = makeWorld();
    const d = isolate(w, 2, 'attack');
    const idleLevel = dummyThreatLevel(w, d);
    d.attackPhase = 'active';
    expect(dummyThreatLevel(w, d)).toBe(1);
    expect(dummyThreatLevel(w, d)).toBeGreaterThan(idleLevel);
  });

  it('超出 threatRange 或关闭注视模块时读数为 0', () => {
    const w = makeWorld();
    isolate(w, 9, 'attack');
    expect(dummyThreatLevel(w, w.dummies[0])).toBe(0);
    isolate(w, 2, 'attack');
    w.modules.gaze = false;
    expect(dummyThreatLevel(w, w.dummies[0])).toBe(0);
  });
});

describe('v9s.9 脚下半环：几何与材质', () => {
  const alphaAt = (geo: THREE.BufferGeometry, i: number, r: number): number => {
    const colors = geo.getAttribute('color');
    const rows = 4;
    return colors.getW(i * rows + r);
  };

  it('两端顶点 alpha 归零、中段满值 —— 两头渐变', () => {
    const seg = 16;
    const geo = buildGroundRingGeometry(0.6, 0.08, Math.PI, 0.2, seg);
    expect(alphaAt(geo, 0, 1)).toBeCloseTo(0, 5);
    expect(alphaAt(geo, seg, 1)).toBeCloseTo(0, 5);
    expect(alphaAt(geo, seg / 2, 1)).toBeCloseTo(1, 5);
  });

  it('径向内外缘 alpha 归零，中间两圈满值（软边环带）', () => {
    const geo = buildGroundRingGeometry(0.6, 0.08, Math.PI, 0.2, 8);
    expect(alphaAt(geo, 4, 0)).toBeCloseTo(0, 5);
    expect(alphaAt(geo, 4, 1)).toBeCloseTo(1, 5);
    expect(alphaAt(geo, 4, 2)).toBeCloseTo(1, 5);
    expect(alphaAt(geo, 4, 3)).toBeCloseTo(0, 5);
  });

  it('半环铺在相机侧：角度 0 指向 +Z，端点落在 ±X', () => {
    const geo = buildGroundRingGeometry(0.6, 0.08, Math.PI, 0.2, 8);
    const pos = geo.getAttribute('position');
    // i = 4 为中点（+Z 方向），行 1 半径 = 0.56 + 0.08 * 0.24
    expect(pos.getX(4 * 4 + 1)).toBeCloseTo(0, 5);
    expect(pos.getZ(4 * 4 + 1)).toBeCloseTo(0.5792, 4);
    // i = 0 为 -90° 端点，指向 -X
    expect(pos.getX(1)).toBeLessThan(-0.5);
    expect(Math.abs(pos.getZ(1))).toBeLessThan(1e-5);
  });

  it('3/4 环比半环多覆盖后方：端点转到 ±135°', () => {
    const half = buildGroundRingGeometry(0.6, 0.08, Math.PI, 0.2, 8);
    const three4 = buildGroundRingGeometry(0.6, 0.08, Math.PI * 1.5, 0.2, 8);
    const halfZ = half.getAttribute('position').getZ(1);
    const threeZ = three4.getAttribute('position').getZ(1);
    expect(Math.abs(halfZ)).toBeLessThan(1e-5);
    expect(threeZ).toBeLessThan(-0.3);
  });

  it('选中态写入：透明度降低、放大、弧长重建成 3/4 环', () => {
    const ring = createGroundRing({
      radius: 0.6, thickness: 0.08, arcRad: Math.PI, edgeFade: 0.2,
      color: '#7fb8d8', opacity: 0.46, y: 0.022,
    });
    const mat = ring.mesh.material as THREE.MeshBasicMaterial;
    expect(mat.opacity).toBeCloseTo(0.46, 5);
    expect(ring.arcRad()).toBeCloseTo(Math.PI, 5);

    ring.update(Math.PI * 1.5, 0.3, 1.12, new THREE.Color('#ff3b30'), 0);
    expect(ring.arcRad()).toBeCloseTo(Math.PI * 1.5, 5);
    expect(mat.opacity).toBeCloseTo(0.3, 5);
    expect(ring.mesh.scale.x).toBeCloseTo(1.12, 5);
    expect(mat.color.getHexString()).toBe('ff3b30');
    // 几何确实重建为更大的弧：端点落到 -Z 半侧
    const pos = ring.mesh.geometry.getAttribute('position');
    expect(pos.getZ(1)).toBeLessThan(-0.3);
    ring.dispose();
  });
});
