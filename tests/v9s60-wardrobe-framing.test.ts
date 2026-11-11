import { describe, it, expect } from 'vitest';
import { wardrobeFraming } from '../src/presentation/wardrobe-model';

/**
 * v9s.60：装备展示相机「整体下移 + 拉远」自适应取景。
 * 纯函数，不依赖 DOM / WebGL；验证角色完整落在舞台上半区、不同体型自适应、窄舞台补偿。
 */

const FOV = 34;
const STAGE_ASPECT = 240 / 256; // 实测舞台尺寸

describe('v9s.60 装备展示相机自适应取景', () => {
  it('相机整体下移 + 拉远（相对旧写死 z=3.0 / lookAt 0.45 / camY 0.72）', () => {
    const f = wardrobeFraming(1.8, 1.2, STAGE_ASPECT, FOV);
    expect(f.cameraY).toBeLessThan(0.72);   // 相机自身 y 下移
    expect(f.lookY).toBeLessThan(0.45);     // 看向点下移
    expect(f.distance).toBeGreaterThan(3);  // 拉远以容纳全身
  });

  it('角色完整且位于舞台上半区：头不越上边界、下方留白 > 1/3', () => {
    const h = 1.8;
    const f = wardrobeFraming(h, 1.2, STAGE_ASPECT, FOV, 0);
    const top = f.lookY + f.visibleHeight / 2;
    const bottom = f.lookY - f.visibleHeight / 2;
    expect(0).toBeGreaterThan(bottom);            // 脚不出下边界
    expect(h).toBeLessThanOrEqual(top);           // 头不出上边界
    const footFrac = (0 - bottom) / f.visibleHeight; // 从下往上量，脚所在比例
    expect(footFrac).toBeGreaterThan(0.33);      // 下方留白 > 1/3
    expect(footFrac).toBeLessThan(0.5);           // 角色偏上而非居中
  });

  it('不同体型自适应：越高越拉远，且两种体型都完整入画', () => {
    const small = wardrobeFraming(1.3, 1.0, STAGE_ASPECT, FOV);
    const tall = wardrobeFraming(2.4, 1.4, STAGE_ASPECT, FOV);
    expect(tall.distance).toBeGreaterThan(small.distance);
    expect(tall.lookY).toBeGreaterThan(small.lookY);
    for (const [h, f] of [[1.3, small], [2.4, tall]] as const) {
      expect(0).toBeGreaterThan(f.lookY - f.visibleHeight / 2);
      expect(h).toBeLessThanOrEqual(f.lookY + f.visibleHeight / 2);
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
