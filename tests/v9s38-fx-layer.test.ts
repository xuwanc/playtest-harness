import { describe, expect, it } from 'vitest';
import { groundHeightAt } from '../src/core';
import { FX_ORDER } from '../src/presentation/fx-layer';
import { makeWorld } from './helpers';

/**
 * v9s.38 · 特效层级与贴地高度。
 *
 * 用户反馈「特效的渲染层级有问题，某些地块上看不见」，拆成两个可测的根因：
 *  1. 贴地特效的 y 写死 → 站上台阶 / 高台后整个世界埋在地块里；
 *  2. 地块是透明材质 + 特效 renderOrder 各写各的 → 绘制顺序取决于到相机的距离。
 * 这里把 ①的可测部分（地面高度查询）和 ②的顺序表（纯常量）钉住。
 */
describe('v9s.38 贴地高度查询（groundHeightAt）', () => {
  it('站在台阶上取台阶顶面，站在旁边取地面', () => {
    const w = makeWorld();
    // 夹具里的台阶：(-7.5, 2) 2.4×2.4 高 0.25
    expect(groundHeightAt(w.boxes, -7.5, 2, 0.3)).toBeCloseTo(0.25, 6);
    expect(groundHeightAt(w.boxes, -7.5, 2, 0.0)).toBeCloseTo(0, 6);   // 参考面在地面 → 台阶算「高处」
    expect(groundHeightAt(w.boxes, 0, -5, 0.3)).toBeCloseTo(0, 6);     // 空地
  });

  it('更高处的地块优先（高台压过台阶），墙 / 过梁不算地面', () => {
    const w = makeWorld();
    // 1.2m 台阶：(4.5, 2)
    expect(groundHeightAt(w.boxes, 4.5, 2, 1.5)).toBeCloseTo(1.2, 6);
    // 墙在 (7.5,1) 高 2：从地面看它比参考面高，必须被忽略
    expect(groundHeightAt(w.boxes, 7.5, 1, 0.1)).toBeCloseTo(0, 6);
  });

  it('没有命中任何盒子时返回 fallback（空中 / 场地外）', () => {
    const w = makeWorld();
    expect(groundHeightAt(w.boxes, 0, 0, 0.1, -5)).toBeCloseTo(0, 6);
    expect(groundHeightAt([], 0, 0, 0.1, -5)).toBeCloseTo(-5, 6);
  });
});

describe('v9s.38 特效层顺序表（FX_ORDER）', () => {
  it('贴地层全部低于身体层，且层层之间留出间隙（不靠距离排序碰运气）', () => {
    const ground = [
      FX_ORDER.labPlate, FX_ORDER.groundArea, FX_ORDER.groundAreaEdge,
      FX_ORDER.ringHalo, FX_ORDER.ring, FX_ORDER.ringMeter, FX_ORDER.ringWarn,
      FX_ORDER.groundFx,
    ];
    const body = [FX_ORDER.trail, FX_ORDER.slash, FX_ORDER.projectileTrail, FX_ORDER.projectile, FX_ORDER.projectileGlow];
    expect(Math.max(...ground)).toBeLessThan(Math.min(...body));
    for (let i = 1; i < ground.length; i++) expect(ground[i]).toBeGreaterThan(ground[i - 1]);
    for (let i = 1; i < body.length; i++) expect(body[i]).toBeGreaterThan(body[i - 1]);
  });

  it('顺序符合可读性约定：地面盘 < 范围圈 < 环 < 冲击 < 刀光 < 斩击弧 < 弹道', () => {
    expect(FX_ORDER.labPlate).toBeLessThan(FX_ORDER.groundArea);
    expect(FX_ORDER.ringHalo).toBeLessThan(FX_ORDER.ring);
    expect(FX_ORDER.ring).toBeLessThan(FX_ORDER.ringWarn);
    expect(FX_ORDER.groundFx).toBeLessThan(FX_ORDER.trail);
    expect(FX_ORDER.trail).toBeLessThan(FX_ORDER.slash);
    expect(FX_ORDER.slash).toBeLessThan(FX_ORDER.projectileGlow);
  });
});
