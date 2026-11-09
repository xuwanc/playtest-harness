/**
 * v9s.44 · 缓慢生长 + 枢轴顶点动画的 Core 契约。
 *
 * 这两件事的表现都在 GPU / 表现层，但「公式唯一真源」在 Core：
 *  - grassGrowth：把 cut 派生为连续生长进度（smoothstep + 逐根错峰）；
 *  - windPivotRotate / windPivotAngles：每节 box 绕枢轴做刚体旋转的可移植参考实现。
 * 单测锁住公式，保证 GPU shader 与 CPU 参考实现不漂移、且旧「瞬间弹满」不再出现。
 */
import { describe, expect, it } from 'vitest';
import {
  grassGrowth, GRASS_GROWTH_STAGGER, GRASS_PIVOT_LOW, GRASS_PIVOT_UP,
  windPivotAngles, windPivotEffLength, windPivotRotate,
} from '../src/core';

const R = 8; // 与线上 core.grass.regrowSec 一致

type V3 = [number, number, number];

describe('v9s.44 缓慢生长（割断后连续长回，不再瞬间弹满）', () => {
  it('端点：完好=1、永久断茬 / 未启用再生=0、刚割断=0', () => {
    expect(grassGrowth(0, R, 0)).toBe(1);
    expect(grassGrowth(-1, R, 0)).toBe(0);
    expect(grassGrowth(3, 0, 0)).toBe(0);
    expect(grassGrowth(R, R, 0)).toBe(0);
    expect(grassGrowth(R * 1.5, R, 0)).toBe(0); // cut 超出时长也 clamp 在断茬
  });

  it('随 cut 递减单调不减，从 0 平滑长到 1', () => {
    let prev = -1;
    for (let k = 0; k <= 80; k += 1) {
      const cut = R * (1 - k / 80);
      const g = grassGrowth(cut, R, 0);
      expect(g).toBeGreaterThanOrEqual(prev - 1e-12);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
      prev = g;
    }
    expect(prev).toBeCloseTo(1, 6);
  });

  it('smoothstep 慢启动：前半段比线性慢、中点=0.5、后半段更快', () => {
    expect(grassGrowth(0.75 * R, R, 0)).toBeLessThan(0.25);     // p=0.25 → 0.156
    expect(grassGrowth(0.5 * R, R, 0)).toBeCloseTo(0.5, 6);
    expect(grassGrowth(0.25 * R, R, 0)).toBeGreaterThan(0.75);  // p=0.75 → 0.844
  });

  it('逐根错峰：相位大的草更晚开始长，早期仍保持断茬', () => {
    const early = 0.1; // p = 0.1
    const g0 = grassGrowth((1 - early) * R, R, 0);
    const g1 = grassGrowth((1 - early) * R, R, 1);
    expect(g0).toBeGreaterThan(g1);
    expect(g1).toBe(0); // 最大错峰 0.18 > 0.1，这一根还没开始长
    const mid0 = grassGrowth(0.5 * R, R, 0);
    const mid1 = grassGrowth(0.5 * R, R, 1);
    expect(mid0).toBeGreaterThan(mid1);
    expect(GRASS_GROWTH_STAGGER).toBeGreaterThan(0);
    expect(GRASS_GROWTH_STAGGER).toBeLessThan(0.5);
  });

  it('端点连续：cut 归零前早已长到 ≈1，到点不再跳变（解决「太突然」）', () => {
    const nearEnd = grassGrowth(1e-6, R, 0);
    expect(1 - nearEnd).toBeLessThan(1e-3);
    expect(grassGrowth(0, R, 0) - nearEnd).toBeLessThan(1e-3);
    // 到 90% 时长时已长到 0.97 以上，而不是最后一帧才从断茬弹满
    expect(grassGrowth(0.1 * R, R, 0)).toBeGreaterThan(0.97);
  });

  it('纯函数 / 确定性：不依赖帧时间，相同输入逐字节一致', () => {
    const ps = [0.1, 0.35, 0.6, 0.9];
    const a = ps.map((p) => grassGrowth((1 - p) * R, R, 0.37));
    const b = ps.map((p) => grassGrowth((1 - p) * R, R, 0.37));
    expect(a).toEqual(b);
  });
});

describe('v9s.44 枢轴顶点动画（每节 box 保持刚体、节间无缝）', () => {
  const rad = 28 * Math.PI / 180;
  const axis: V3 = [Math.sin(rad), 0, -Math.cos(rad)]; // (dirZ, 0, -dirX)：世界风向的水平转轴
  const rot = (v: V3, p: V3, c: number, s: number): V3 =>
    windPivotRotate(v[0], v[1], v[2], p[0], p[1], p[2], axis[0], axis[1], axis[2], c, s);
  const dist = (a: V3, b: V3): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  it('windPivotAngles：总角 low+up=theta，符号随 sway，有效力臂 = LOW·hBase+hTip', () => {
    const hBase = 0.5, hTip = 0.42;
    const eff = windPivotEffLength(hBase, hTip);
    expect(eff).toBeCloseTo(GRASS_PIVOT_LOW * hBase + hTip, 9);
    const a = windPivotAngles(0.19, eff);
    expect(a.theta).toBeCloseTo(Math.atan2(0.19, eff), 9);
    expect(a.low + a.up).toBeCloseTo(a.theta, 9);
    expect(a.low).toBeCloseTo(a.theta * GRASS_PIVOT_LOW, 9);
    expect(a.up).toBeCloseTo(a.theta * GRASS_PIVOT_UP, 9);
    expect(windPivotAngles(-0.19, eff).theta).toBeLessThan(0);
    expect(windPivotAngles(0, eff).theta).toBe(0);
    expect(GRASS_PIVOT_LOW + GRASS_PIVOT_UP).toBeCloseTo(1, 9);
  });

  it('枢轴旋转是刚体：单位 box 8 顶点两两距离不变（每节 box 不被 shear 拉歪）', () => {
    const pivot: V3 = [0, -0.5, 0]; // box 底部中心 = 该节枢轴
    const theta = 0.37, c = Math.cos(theta), s = Math.sin(theta);
    const verts: V3[] = [];
    for (const x of [-0.5, 0.5]) {
      for (const y of [-0.5, 0.5]) {
        for (const z of [-0.5, 0.5]) verts.push([x, y, z]);
      }
    }
    const moved = verts.map((v) => rot(v, pivot, c, s));
    for (let i = 0; i < 8; i += 1) {
      expect(dist(moved[i], pivot)).toBeCloseTo(dist(verts[i], pivot), 9); // 到枢轴距离不变
      for (let j = i + 1; j < 8; j += 1) {
        expect(dist(moved[i], moved[j])).toBeCloseTo(dist(verts[i], verts[j]), 9); // 边长 / 对角线不变
      }
    }
    // 且确实转了（不是恒等变换）
    expect(dist(moved[4], verts[4])).toBeGreaterThan(1e-3);
  });

  it('两级枢轴节间无缝：上段底 == 下段顶（旋转后）', () => {
    const hBase = 0.5, hTip = 0.42;
    const P0: V3 = [0, 0, 0];
    const P1: V3 = [0, hBase, 0]; // 下段顶 = 上段底
    const { low, up } = windPivotAngles(0.19, windPivotEffLength(hBase, hTip));
    const cL = Math.cos(low), sL = Math.sin(low), cU = Math.cos(up), sU = Math.sin(up);
    const P1p = rot(P1, P0, cL, sL);                        // 下段顶（绕草根转 low）
    const inherited = rot(P1, P0, cL, sL);                  // 上段底先继承下段
    const upperBottom = rot(inherited, P1p, cU, sU);        // 再绕 P1p 转 up（rel=0）
    expect(upperBottom[0]).toBeCloseTo(P1p[0], 9);
    expect(upperBottom[1]).toBeCloseTo(P1p[1], 9);
    expect(upperBottom[2]).toBeCloseTo(P1p[2], 9);
  });

  it('顶端朝风向弯折、位移与 sway 同量级（保持旧 amplitude 手感）', () => {
    const hBase = 0.5, hTip = 0.42, L = hBase + hTip;
    const P0: V3 = [0, 0, 0];
    const P1: V3 = [0, hBase, 0];
    const Ptop: V3 = [0, L, 0];
    const sway = 0.19;
    const { low, up } = windPivotAngles(sway, windPivotEffLength(hBase, hTip));
    const cL = Math.cos(low), sL = Math.sin(low), cU = Math.cos(up), sU = Math.sin(up);
    const P1p = rot(P1, P0, cL, sL);
    const a = rot(Ptop, P0, cL, sL);
    const b = rot(a, P1p, cU, sU);
    const horiz = Math.hypot(b[0], b[2]);
    expect(horiz).toBeGreaterThan(0.01);          // 真的弯了
    expect(horiz / sway).toBeGreaterThan(0.7);    // 与 amplitude 同量级
    expect(horiz / sway).toBeLessThan(1.35);
    const dirX = Math.cos(rad), dirZ = Math.sin(rad);
    expect(b[0] / horiz).toBeCloseTo(dirX, 2);   // 水平位移沿风向
    expect(b[2] / horiz).toBeCloseTo(dirZ, 2);
  });
});
