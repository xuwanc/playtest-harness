import { describe, expect, it } from 'vitest';
import {
  WARDROBE_LOOK, WARDROBE_PALETTES, WARDROBE_SECTIONS, WARDROBE_WEAPONS,
  blendTowards, dragYaw, idleSway, mergePalette, resolveLook, wrapPi,
} from '../src/presentation/wardrobe-model';
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

describe('Wardrobe 数据驱动分区 / 染色', () => {
  it('分区表：武器与染色是真交互，防具与背包是显式占位；槽位齐全', () => {
    const ids = WARDROBE_SECTIONS.map((s) => s.id);
    expect(ids).toEqual(['weapon', 'armor', 'dye', 'bag']);
    expect(new Set(ids).size).toBe(ids.length);
    const weapon = WARDROBE_SECTIONS.find((s) => s.id === 'weapon')!;
    const dye = WARDROBE_SECTIONS.find((s) => s.id === 'dye')!;
    const armor = WARDROBE_SECTIONS.find((s) => s.id === 'armor')!;
    const bag = WARDROBE_SECTIONS.find((s) => s.id === 'bag')!;
    expect(weapon.kind).toBe('weapon');
    expect(dye.kind).toBe('dye');
    expect(armor.kind).toBe('placeholder');
    expect(bag.kind).toBe('placeholder');
    expect((armor.slots?.length ?? 0) + (bag.slots?.length ?? 0)).toBeGreaterThanOrEqual(10);
  });

  it('武器表与配色表 id 唯一，染色第一套是「原色」（不改配置）', () => {
    expect(new Set(WARDROBE_WEAPONS.map((w) => w.id)).size).toBe(WARDROBE_WEAPONS.length);
    expect(new Set(WARDROBE_PALETTES.map((p) => p.id)).size).toBe(WARDROBE_PALETTES.length);
    expect(WARDROBE_PALETTES[0].id).toBe('default');
    expect(Object.keys(WARDROBE_PALETTES[0].colors)).toHaveLength(0);
  });

  it('mergePalette 返回新对象、不污染 base、未知 id 回落原色', () => {
    const before = { ...BASE };
    const ember = mergePalette(BASE, 'ember');
    expect(ember).not.toBe(BASE);
    expect(ember.body).not.toBe(BASE.body);
    expect(ember.head).toBe(BASE.head);          // 只覆盖外观键，头色沿用
    expect(ember.ground).toBe(BASE.ground);      // 场景色不参与染色
    expect(BASE).toEqual(before);                // base 未被改写
    expect(mergePalette(BASE, 'nope')).toEqual(BASE);
  });

  it('每套染色都带合法色卡与可解析 hex', () => {
    for (const p of WARDROBE_PALETTES) {
      expect(p.swatch).toMatch(/^#[0-9a-fA-F]{6}$/);
      for (const v of Object.values(p.colors)) {
        expect(v).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });
});
