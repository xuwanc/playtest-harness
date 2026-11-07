import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { areaOpen, ringGroundHeight, createAreaRing } from '../src/presentation/ground-ring';
import { CONFIG } from './helpers';

const CFG = CONFIG.view.groundRing;

describe('v9s.12 电圈从角色中心展开', () => {
  it('刚放下时半径接近 0、透明度 0（不是凭空出现满半径大圈）', () => {
    const o = areaOpen(0, CFG.areaExpandSec);
    expect(o.scale).toBeLessThan(0.1);
    expect(o.alpha).toBe(0);
  });

  it('展开时长走完后回到满半径、满透明度', () => {
    const o = areaOpen(CFG.areaExpandSec, CFG.areaExpandSec);
    expect(o.scale).toBeCloseTo(1, 6);
    expect(o.alpha).toBeCloseTo(1, 6);
    const over = areaOpen(99, CFG.areaExpandSec);
    expect(over.scale).toBe(1);
    expect(over.alpha).toBe(1);
  });

  it('半径与透明度都单调递增（不会中途回缩）', () => {
    let prevScale = -1;
    let prevAlpha = -1;
    for (let i = 0; i <= 12; i++) {
      const o = areaOpen((i / 12) * CFG.areaExpandSec, CFG.areaExpandSec);
      expect(o.scale).toBeGreaterThanOrEqual(prevScale);
      expect(o.alpha).toBeGreaterThanOrEqual(prevAlpha);
      prevScale = o.scale;
      prevAlpha = o.alpha;
    }
  });

  it('展开时长配成 0 也不产生除零', () => {
    const o = areaOpen(0, 0);
    expect(Number.isFinite(o.scale)).toBe(true);
    expect(o.scale).toBeGreaterThan(0);
    expect(o.scale).toBeLessThanOrEqual(1);
  });

  it('展开只改 mesh 缩放，范围圈的半径参数本身不受影响', () => {
    const ring = createAreaRing({ color: '#9ad0ff', y: 0.045 });
    const edge = ring.group.children[1];
    const open = areaOpen(CFG.areaExpandSec * 0.3, CFG.areaExpandSec);
    ring.set(0, 0, 0.045, 2.4 * open.scale, 0.5 * open.alpha, 0);
    expect(edge.scale.x).toBeCloseTo(2.4 * open.scale, 6);
    ring.dispose();
  });
});

describe('v9s.12 环贴地不随跳跃升高', () => {
  it('落地时跟随脚下高度（跟台阶）', () => {
    expect(ringGroundHeight(true, 0.6, 0)).toBe(0.6);
  });

  it('空中保持最后一次落地高度（跳起来环留在地面）', () => {
    expect(ringGroundHeight(false, 1.4, 0.6)).toBe(0.6);
  });
});

describe('v9s.12 选中亮起 / 未选中压淡', () => {
  it('淡入明显快于淡出（快速亮起、慢慢降下去）', () => {
    expect(CFG.haloFadeInSec).toBeLessThan(CFG.haloFadeOutSec);
    expect(CFG.haloFadeInSec).toBeLessThanOrEqual(0.08);
    expect(CFG.haloFadeOutSec).toBeGreaterThanOrEqual(0.25);
  });

  it('未选中环比上一版更淡，选中仍是明显高亮', () => {
    expect(CFG.opacity).toBeLessThan(0.25);
    expect(CFG.selectedOpacity).toBeGreaterThan(CFG.opacity * 2);
  });

  it('选中态靠厚度与亮度而不是靠放大（缩放倍率克制）', () => {
    expect(CFG.selectedThicknessScale).toBeGreaterThan(1.3);
    expect(CFG.selectedScale).toBeLessThan(1.15);
  });
});

describe('v9s.12 引导时移速降低', () => {
  it('法杖引导移速倍率明显低于 1（可移动但拖慢）', () => {
    const ms = CONFIG.core.abilities.arcane.moveScale;
    expect(ms).toBeGreaterThan(0.2);
    expect(ms).toBeLessThanOrEqual(0.7);
  });

  it('引导移速低于正常移动，且不像攻击那样完全锁死', () => {
    const ms = CONFIG.core.abilities.arcane.moveScale;
    expect(ms).toBeLessThan(1);
    expect(ms).toBeGreaterThan(CONFIG.core.combat.attackMoveScale);
  });
});

/** 三色插值在极值处不应产生 NaN / 越界（避免 theme 改动后静默变黑）。 */
describe('v9s.12 颜色边界', () => {
  it('范围圈颜色是合法十六进制', () => {
    expect(() => new THREE.Color(CFG.playerColor)).not.toThrow();
    expect(() => new THREE.Color(CFG.warnColor)).not.toThrow();
  });
});
