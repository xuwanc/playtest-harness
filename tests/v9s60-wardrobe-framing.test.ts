import { describe, it, expect } from 'vitest';
import { wardrobeFraming } from '../src/presentation/wardrobe-model';

/**
 * v9s.61：装备展示转台「正常大小、居中」取景（纯函数）。
 *
 * 用户澄清：「让角色出现在上半区」指**主场景相机**下移（底部抽屉别挡住场景里的角色），
 * 不是这个转台相机；转台角色应恢复接近 v9s.69 的正常大小、居中显示，不再被
 * v9s.60 的「整体下移 + 拉远」缩成一团。
 */

const FOV = 34;
const STAGE_ASPECT = 240 / 256; // 实测舞台尺寸

describe('v9s.61 装备展示转台：正常大小、居中', () => {
  it('角色居中：lookY 取角色中心，相机只留轻微俯视，不人为压到下半区', () => {
    const h = 1.8;
    const f = wardrobeFraming(h, 1.2, STAGE_ASPECT, FOV);
    expect(f.lookY).toBeCloseTo(h * 0.5, 6);
    expect(f.cameraY).toBeGreaterThan(f.lookY);   // 轻微俯视
    expect(f.lookY).toBeGreaterThan(0.45);        // 不再像旧版压到 0.15·h
  });

  it('正常大小：垂直可视高度只留 1.5× 身高（角色约占舞台 2/3），不再拉远缩小', () => {
    const h = 1.8;
    const f = wardrobeFraming(h, 1.2, STAGE_ASPECT, FOV);
    expect(f.visibleHeight).toBeCloseTo(h * 1.5, 6);
    expect(f.visibleHeight).toBeLessThan(h * 1.8); // 比 v9s.60 的 1.8× 更近
    // 头脚都完整入画，且大致对称居中
    const top = f.lookY + f.visibleHeight / 2;
    const bottom = f.lookY - f.visibleHeight / 2;
    expect(0).toBeGreaterThan(bottom);
    expect(h).toBeLessThanOrEqual(top);
    const footFrac = (0 - bottom) / f.visibleHeight;
    const headFrac = (top - h) / f.visibleHeight;
    expect(footFrac).toBeGreaterThan(0.1);
    expect(Math.abs(footFrac - headFrac)).toBeLessThan(0.05); // 上下留白对称 = 居中
  });

  it('不同体型自适应：越高越拉远，且两种体型都完整入画、都居中', () => {
    const small = wardrobeFraming(1.3, 1.0, STAGE_ASPECT, FOV);
    const tall = wardrobeFraming(2.4, 1.4, STAGE_ASPECT, FOV);
    expect(tall.distance).toBeGreaterThan(small.distance);
    expect(tall.lookY).toBeGreaterThan(small.lookY);
    for (const [h, f] of [[1.3, small], [2.4, tall]] as const) {
      expect(0).toBeGreaterThan(f.lookY - f.visibleHeight / 2);
      expect(h).toBeLessThanOrEqual(f.lookY + f.visibleHeight / 2);
      expect(f.lookY).toBeCloseTo(h * 0.5, 6);
    }
  });

  it('窄舞台 aspect 补偿：更窄的舞台不裁左右（距离不小于宽舞台）', () => {
    const wide = wardrobeFraming(1.8, 1.6, 1.2, FOV);
    const narrow = wardrobeFraming(1.8, 1.6, 0.45, FOV);
    expect(narrow.distance).toBeGreaterThanOrEqual(wide.distance);
  });

  it('退化输入（极小体型 / 0 aspect）不产生 NaN 或负距离', () => {
    const f = wardrobeFraming(0.1, 0.1, 0, FOV);
    for (const v of [f.distance, f.lookY, f.cameraY, f.visibleHeight]) {
      expect(Number.isFinite(v)).toBe(true);
    }
    expect(f.distance).toBeGreaterThan(0);
  });
});
