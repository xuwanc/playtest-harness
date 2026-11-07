import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  createGroundRing, groundRingRadius, playerRingVisual, threatRingColor,
} from '../src/presentation/ground-ring';
import { CONFIG } from './helpers';

const CFG = CONFIG.view.groundRing;
const DEG = Math.PI / 180;

describe('v9s.10 环尺寸随角色体型', () => {
  it('半径 = 半身宽 × 系数，与 bodyWidth 线性关联', () => {
    expect(groundRingRadius(0.46, 2)).toBeCloseTo(0.46, 6);
    expect(groundRingRadius(0.92, 2)).toBeCloseTo(0.92, 6);
    expect(groundRingRadius(0.46, 2)).toBeCloseTo(groundRingRadius(0.92, 1), 6);
  });

  it('玩家 / 假人环都落在「略大于脚掌」的范围，不再比人还宽', () => {
    const bodyW = CONFIG.view.voxel.bodyWidth;
    const player = groundRingRadius(bodyW, CFG.playerRadiusFactor);
    const dummy = groundRingRadius(bodyW, CFG.dummyRadiusFactor);
    expect(player).toBeGreaterThan(bodyW * 0.5);
    expect(player).toBeLessThan(bodyW * 2);
    expect(dummy).toBeLessThan(player);
  });
});

describe('v9s.10 玩家环接敌状态', () => {
  it('未接敌：稳定半环、基础透明度、不染色', () => {
    const v = playerRingVisual(false, 0, 0, 0, CFG);
    expect(v.arcRad).toBeCloseTo(CFG.arcDeg * DEG, 6);
    expect(v.opacity).toBeCloseTo(CFG.playerOpacity, 6);
    expect(v.scale).toBe(1);
    expect(v.level).toBe(0);
  });

  it('接敌：弧长向 3/4 环扩展、提亮、略微放大', () => {
    const v = playerRingVisual(true, 0.6, 0, 0.7, CFG);
    expect(v.arcRad).toBeGreaterThan(CFG.arcDeg * DEG);
    expect(v.arcRad).toBeLessThanOrEqual(CFG.selectedArcDeg * DEG + 1e-9);
    expect(v.opacity).toBeGreaterThan(CFG.playerOpacity);
    expect(v.scale).toBeGreaterThan(1);
    expect(v.level).toBeCloseTo(0.6, 6);
  });

  it('威胁越高弧越长、越亮', () => {
    const low = playerRingVisual(true, 0.2, 0, 0.7, CFG);
    const high = playerRingVisual(true, 0.95, 0, 0.7, CFG);
    expect(high.arcRad).toBeGreaterThan(low.arcRad);
    expect(high.opacity).toBeGreaterThanOrEqual(low.opacity);
  });

  it('受击守卫期呼吸更明显（同一时刻的透明度不同）', () => {
    const calm = playerRingVisual(true, 0.7, 0, 0.31, CFG);
    const guard = playerRingVisual(true, 0.7, 1, 0.31, CFG);
    expect(guard.opacity).toBeGreaterThan(calm.opacity);
  });

  it('威胁读数夹在 0..1，不会把颜色 / 透明度推出范围', () => {
    const over = playerRingVisual(true, 3, 0, 0.2, CFG);
    expect(over.level).toBe(1);
    expect(over.opacity).toBeLessThanOrEqual(0.95);
    expect(over.opacity).toBeGreaterThan(CFG.playerOpacity);
  });
});

describe('v9s.10 威胁取色', () => {
  const base = new THREE.Color('#8fe7ff');
  const low = new THREE.Color('#ffc85a');
  const high = new THREE.Color('#ff3b30');
  const out = new THREE.Color();

  it('0 = 中性色 / 0.5 = 低威胁黄 / 1 = 高威胁红', () => {
    expect(threatRingColor(out, base, low, high, 0).getHexString()).toBe('8fe7ff');
    expect(threatRingColor(out, base, low, high, 0.5).getHexString()).toBe('ffc85a');
    expect(threatRingColor(out, base, low, high, 1).getHexString()).toBe('ff3b30');
  });

  it('超界值夹到两端，颜色不会溢出', () => {
    expect(threatRingColor(out, base, low, high, -1).getHexString()).toBe('8fe7ff');
    expect(threatRingColor(out, base, low, high, 2).getHexString()).toBe('ff3b30');
  });
});

describe('v9s.10 选中加厚环', () => {
  it('thicknessScale 改变环带外径，且同参数回到缓存几何', () => {
    const ring = createGroundRing({
      radius: 0.6, thickness: 0.08, arcRad: Math.PI, edgeFade: 0.2,
      color: '#7fb8d8', opacity: 0.3, y: 0.02,
    });
    const color = new THREE.Color('#ffffff');
    const outerRadius = (): number => {
      const pos = ring.mesh.geometry.getAttribute('position');
      const rows = 4;
      const cols = pos.count / rows;
      const i = (cols - 1) / 2;  // 弧中点（+Z 方向），取最外一圈
      return Math.hypot(pos.getX(i * rows + 3), pos.getZ(i * rows + 3));
    };
    const before = outerRadius();
    const geoBefore = ring.mesh.geometry;

    ring.update(Math.PI * 1.5, 0.62, 1.06, color, 0, 1.6);
    const thick = outerRadius();
    expect(thick).toBeGreaterThan(before);
    expect(thick).toBeCloseTo(0.6 + 0.08 * 1.6 * 0.5, 3);

    ring.update(Math.PI, 0.3, 1, color, 0, 1);
    expect(ring.mesh.geometry).toBe(geoBefore);
    expect(outerRadius()).toBeCloseTo(before, 6);
    ring.dispose();
  });
});
