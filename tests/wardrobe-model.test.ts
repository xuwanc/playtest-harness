import { describe, expect, it } from 'vitest';
import {
  CRAFT_CELLS, WARDROBE_LOOK, WARDROBE_MATERIALS, WARDROBE_RECIPES, WARDROBE_SECTIONS,
  WARDROBE_WEAPONS, blendTowards, consumeForRecipe, countMaterials, dragYaw, idleSway,
  matchRecipe, resolveLook, wrapPi,
} from '../src/presentation/wardrobe-model';
import type { MaterialId } from '../src/presentation/wardrobe-model';
import type { ColorConfig } from '../src/core';

const DEG = Math.PI / 180;
const BASE: ColorConfig = {
  ground: '#111', step: '#222', wall: '#333', lintel: '#444', obstacle: '#555',
  body: '#4ea1de', head: '#f2c98a', limb: '#2f6fa8', shoe: '#1d2733',
  blade: '#d8e6f2', bladeEdge: '#fff', metal: '#8fa6bb', wood: '#8b5e3c', glow: '#7fe3ff',
};

describe('Wardrobe 视线映射（点击/悬停 → 看向鼠标）', () => {
  it('中心 (0,0) 视线归零', () => {
    const l = resolveLook(0, 0);
    expect(l.headYaw).toBe(0);
    expect(l.headPitch).toBe(0);
    expect(l.bodyPitch).toBe(0);
  });

  it('鼠标在右 → 头向右偏；在上 → 抬头（headPitch 为正）', () => {
    const right = resolveLook(1, 0);
    expect(right.headYaw).toBeCloseTo(WARDROBE_LOOK.maxYawDeg * DEG, 6);
    expect(right.headPitch).toBe(0);
    const up = resolveLook(0, -1);       // 屏幕上方 ny 为负
    expect(up.headPitch).toBeCloseTo(WARDROBE_LOOK.maxPitchDeg * DEG, 6);
    expect(up.headYaw).toBe(0);
  });

  it('左右 / 上下严格反向，且 bodyPitch 是 headPitch 的固定比例', () => {
    const a = resolveLook(0.5, -0.5);
    const b = resolveLook(-0.5, 0.5);
    expect(a.headYaw).toBeCloseTo(-b.headYaw, 6);
    expect(a.headPitch).toBeCloseTo(-b.headPitch, 6);
    expect(a.bodyPitch).toBeCloseTo(a.headPitch * WARDROBE_LOOK.bodyPitchScale, 6);
  });

  it('越界 / NaN 输入先夹到 [-1,1]，不会把脖子甩到 180°', () => {
    const far = resolveLook(9, -9);
    expect(far.headYaw).toBeCloseTo(WARDROBE_LOOK.maxYawDeg * DEG, 6);
    expect(far.headPitch).toBeCloseTo(WARDROBE_LOOK.maxPitchDeg * DEG, 6);
    const nan = resolveLook(NaN, NaN);
    expect(nan.headYaw).toBe(0);
    expect(nan.headPitch).toBe(0);
    expect(Number.isFinite(nan.bodyPitch)).toBe(true);
  });

  it('俯仰幅度不超过 rig 的颈部限幅 0.7 rad', () => {
    expect(Math.abs(resolveLook(0, -1).headPitch)).toBeLessThan(0.7);
    expect(Math.abs(resolveLook(0, -1).bodyPitch)).toBeLessThan(0.4);
  });
});

describe('Wardrobe 拖动旋转（左右拖动 → 绕 Y 轴）', () => {
  it('右拖正向、左拖反向，位移线性映射到角度', () => {
    expect(dragYaw(0, 100)).toBeCloseTo(100 * WARDROBE_LOOK.dragRadPerPx, 6);
    expect(dragYaw(0, -100)).toBeCloseTo(-100 * WARDROBE_LOOK.dragRadPerPx, 6);
  });

  it('连续多圈累加后角度仍规范在 (-π, π]，不溢出', () => {
    let a = 0;
    for (let i = 0; i < 200; i++) a = dragYaw(a, 100);   // 累计 20 rad > 3 圈
    expect(a).toBeLessThanOrEqual(Math.PI + 1e-9);
    expect(a).toBeGreaterThan(-Math.PI - 1e-9);
    expect(Number.isFinite(a)).toBe(true);
  });

  it('wrapPi 边界有界', () => {
    expect(wrapPi(0)).toBeCloseTo(0, 9);
    expect(Math.abs(wrapPi(Math.PI * 2))).toBeLessThan(1e-9);
    expect(wrapPi(Math.PI * 3)).toBeLessThanOrEqual(Math.PI + 1e-9);
  });

  it('NaN 位移不改变角度', () => {
    expect(dragYaw(0.4, NaN)).toBeCloseTo(0.4, 6);
  });
});

describe('Wardrobe 平滑与待机微摆', () => {
  it('blendTowards 单调趋近目标、dt=0 不动、帧率无关收敛', () => {
    expect(blendTowards(0, 1, 0)).toBe(0);
    const a = blendTowards(0, 1, 1 / 60);
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThan(1);
    // 一步 1/30 与两步 1/60 收敛结果一致（指数平滑的帧率无关性）
    const one = blendTowards(0, 1, 1 / 30);
    const two = blendTowards(blendTowards(0, 1, 1 / 60), 1, 1 / 60);
    expect(two).toBeCloseTo(one, 9);
    expect(blendTowards(0, 1, 10)).toBeCloseTo(1, 3);
  });

  it('idleSway 有界、周期一致、纯函数（同 t 同结果）', () => {
    const p = WARDROBE_LOOK.idleSwayPeriod;
    expect(Math.abs(idleSway(0.7))).toBeLessThanOrEqual(WARDROBE_LOOK.idleSwayRad + 1e-9);
    expect(idleSway(0)).toBeCloseTo(0, 9);
    expect(idleSway(p)).toBeCloseTo(idleSway(0), 9);  // 一周期后回到同相位
    expect(idleSway(1.23)).toBe(idleSway(1.23));
  });
});

describe('Wardrobe 数据驱动分区（武器 + 合成台，已去染色）', () => {
  it('分区表：武器与合成台两段，无 dye 段', () => {
    const ids = WARDROBE_SECTIONS.map((s) => s.id);
    expect(ids).toEqual(['weapon', 'craft']);
    expect(new Set(ids).size).toBe(ids.length);
    expect(WARDROBE_SECTIONS.find((s) => s.id === 'weapon')!.kind).toBe('weapon');
    expect(WARDROBE_SECTIONS.find((s) => s.id === 'craft')!.kind).toBe('craft');
  });

  it('武器表 id 唯一', () => {
    expect(new Set(WARDROBE_WEAPONS.map((w) => w.id)).size).toBe(WARDROBE_WEAPONS.length);
  });

  it('合成魔方固定 12 格（3×4），材料表 id 唯一且带合法色卡', () => {
    expect(CRAFT_CELLS).toBe(12);
    expect(new Set(WARDROBE_MATERIALS.map((m) => m.id)).size).toBe(WARDROBE_MATERIALS.length);
    for (const m of WARDROBE_MATERIALS) {
      expect(m.swatch).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('配方表：5 件装备、需求为材料计数、slot 唯一', () => {
    expect(WARDROBE_RECIPES).toHaveLength(5);
    expect(new Set(WARDROBE_RECIPES.map((r) => r.slot)).size).toBe(5);
    expect(new Set(WARDROBE_RECIPES.map((r) => r.id)).size).toBe(5);
    for (const r of WARDROBE_RECIPES) {
      const total = Object.values(r.need).reduce((a, b) => a + (b ?? 0), 0);
      expect(total).toBeGreaterThan(0);
      expect(total).toBeLessThanOrEqual(CRAFT_CELLS);
    }
  });
});

describe('Wardrobe 合成（材料计数 / 配方匹配 / 消耗）', () => {
  const fill = (...mats: (MaterialId | null)[]): (MaterialId | null)[] => {
    const cells = new Array(CRAFT_CELLS).fill(null) as (MaterialId | null)[];
    mats.forEach((m, i) => { cells[i] = m; });
    return cells;
  };

  it('countMaterials 只统计非空格', () => {
    const c = countMaterials(fill('iron', 'iron', 'iron', null, 'leather', 'cloth'));
    expect(c.iron).toBe(3);
    expect(c.leather).toBe(1);
    expect(c.cloth).toBe(1);
    expect(c.wood).toBe(0);
    expect(c.crystal).toBe(0);
  });

  it('matchRecipe 按计数匹配、与格子位置无关、多余材料不影响', () => {
    expect(matchRecipe(fill('iron', 'iron', 'iron'))?.recipe.id).toBe('helmet');
    expect(matchRecipe(fill('iron', 'iron', 'leather'))?.recipe.id).toBe('legs');
    expect(matchRecipe(fill('crystal'))?.recipe.id).toBe('trinket');
    expect(matchRecipe(fill('wood', 'wood', 'cloth'))?.recipe.id).toBe('bag');
    expect(matchRecipe(fill('leather', 'leather', 'leather'))?.recipe.id).toBe('chest');
    // 多余材料不参与判定，仍能匹配首个可满足配方
    expect(matchRecipe(fill('iron', 'iron', 'iron', 'crystal', 'wood'))?.recipe.id).toBe('helmet');
    // 完全不匹配
    expect(matchRecipe(fill('wood', 'cloth'))).toBeNull();
    expect(matchRecipe(fill())).toBeNull();
  });

  it('matchRecipe 材料不够时不匹配（如只 2 铁，不够头盔的 3 铁）', () => {
    expect(matchRecipe(fill('iron', 'iron'))).toBeNull();
  });

  it('consumeForRecipe 只移除满足配方所需的材料，其余保留、不改动入参', () => {
    const before = fill('iron', 'iron', 'iron', 'crystal');
    const after = consumeForRecipe(before, WARDROBE_RECIPES.find((r) => r.id === 'helmet')!);
    expect(after.slice(0, 3)).toEqual([null, null, null]);  // 3 铁被消耗
    expect(after[3]).toBe('crystal');                       // 多余晶保留
    expect(before).toEqual(fill('iron', 'iron', 'iron', 'crystal')); // 入参不变
  });

  it('consumeForRecipe 多材料配方按序消耗（护腿 = 铁×2 + 皮×1）', () => {
    const before = fill('iron', 'leather', 'iron', 'wood');
    const after = consumeForRecipe(before, WARDROBE_RECIPES.find((r) => r.id === 'legs')!);
    const c = countMaterials(after);
    expect(c.iron).toBe(0);
    expect(c.leather).toBe(0);
    expect(after[3]).toBe('wood');
  });
});
