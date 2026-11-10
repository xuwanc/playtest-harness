import type { ColorConfig } from '../core';

/**
 * 装备 / 外观展示界面（Wardrobe）的**纯数据层**。
 *
 * 与 `wardrobe.ts`（DOM + WebGL）分开，是为了让「视线映射 / 拖动旋转 / 配色合并」
 * 这些规则能被单测直接覆盖，且单测不需要 DOM 或 WebGL。这里没有 THREE、没有
 * document、没有时间源 —— 所有输入显式传入，输出是 plain data。
 *
 * 用户约定的三条交互，规则全部落在这里：
 *  1. 点开 = 角色恒待机动态站立（渲染循环在 wardrobe.ts，本文件只给 idle 摆动公式）；
 *  2. 点击 / 悬停 = 角色看向鼠标（resolveLook 把归一化指针坐标转成头 / 身朝向）；
 *  3. 左右拖动 = 角色绕上下轴（Y 轴）旋转（dragYaw 累加水平位移）。
 */

/** 视线 / 拖动的可调参数（角度用度写，读起来直观，运行时再转弧度）。 */
export const WARDROBE_LOOK = {
  /** 头部水平最大偏转（度）：鼠标到预览区最左 / 最右时。太大脖子会拧断。 */
  maxYawDeg: 34,
  /** 头部俯仰最大偏转（度）：鼠标到预览区最上 / 最下时。 */
  maxPitchDeg: 20,
  /** 上半身跟随头部俯仰的比例 —— 「整个人抬眼看」而不是头单独在脖子上折。 */
  bodyPitchScale: 0.35,
  /** 每像素拖动对应的旋转弧度。120px 约转 69°，够转半圈看背面。 */
  dragRadPerPx: 0.01,
  /** 视线 / 旋转的指数平滑速率（1/s），越大越跟手，越小越黏。 */
  smoothRate: 14,
  /** 待机缓慢左右摇动的幅度（弧度）与周期（秒），让「动态站立」不只是呼吸。 */
  idleSwayRad: 0.015,
  idleSwayPeriod: 4.5,
} as const;

export type LookTarget = {
  /** 头部水平朝向（弧度，相对身体；+ = 看向角色自身右侧） */
  headYaw: number;
  /** 头部俯仰（弧度，+ = 抬头） */
  headPitch: number;
  /** 上半身俯仰（弧度，恒为 headPitch 的一小部分） */
  bodyPitch: number;
};

const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
const DEG = Math.PI / 180;

/**
 * 把预览区内的归一化指针坐标（nx / ny ∈ [-1, 1]，屏幕上方 ny 为负）转成视线角。
 * 越界输入先夹到 [-1, 1]，避免指针捕获期跑出画布时把脖子甩到 180°。
 */
export function resolveLook(nx: number, ny: number): LookTarget {
  const x = clamp(Number.isFinite(nx) ? nx : 0, -1, 1);
  const y = clamp(Number.isFinite(ny) ? ny : 0, -1, 1);
  // `|| 0` 把 -0 归一成 +0（negate 0 会得到 -0），下游读数和断言都不用再容差。
  const headYaw = (x * WARDROBE_LOOK.maxYawDeg * DEG) || 0;
  // 屏幕 y 向下为正、抬头为正，所以取反
  const headPitch = (-y * WARDROBE_LOOK.maxPitchDeg * DEG) || 0;
  const bodyPitch = (headPitch * WARDROBE_LOOK.bodyPitchScale) || 0;
  return { headYaw, headPitch, bodyPitch };
}

/** 把角度规范到 (-π, π]，保证 debug 读数有界、连续拖多圈也不溢出。 */
export function wrapPi(a: number): number {
  const twoPi = Math.PI * 2;
  let v = (a + Math.PI) % twoPi;
  if (v < 0) v += twoPi;
  return v - Math.PI;
}

/** 累加一次水平拖动（像素）到当前 Y 轴旋转角，返回规范后的新角。 */
export function dragYaw(current: number, dxPx: number): number {
  const dx = Number.isFinite(dxPx) ? dxPx : 0;
  return wrapPi(current + dx * WARDROBE_LOOK.dragRadPerPx);
}

/** 指数平滑趋近目标，帧率无关（dt 秒）。 */
export function blendTowards(current: number, target: number, dt: number, rate = WARDROBE_LOOK.smoothRate): number {
  const d = Math.max(0, Number.isFinite(dt) ? dt : 0);
  const k = 1 - Math.exp(-rate * d);
  return current + (target - current) * k;
}

/** 待机缓慢摆动：只依赖累计时间，不读墙钟，纯函数可重复。 */
export function idleSway(t: number): number {
  const p = WARDROBE_LOOK.idleSwayPeriod;
  return Math.sin((t / p) * Math.PI * 2) * WARDROBE_LOOK.idleSwayRad;
}

/** 染色预设：只覆盖角色外观相关的颜色键，地面 / 墙等场景色不参与。 */
export type WardrobePalette = {
  id: string;
  label: string;
  /** 色卡上的代表色，仅用于 UI 展示 */
  swatch: string;
  colors: Partial<ColorConfig>;
};

/** 第一套是「原色」（colors 为空 = 完全沿用主场景配色），便于 A/B 对照。 */
export const WARDROBE_PALETTES: readonly WardrobePalette[] = [
  { id: 'default', label: '原色', swatch: '#4ea1de', colors: {} },
  {
    id: 'ember', label: '赤铜', swatch: '#d9603f',
    colors: { body: '#d9603f', limb: '#9c3f2c', metal: '#e0a060', shoe: '#3a241d' },
  },
  {
    id: 'tide', label: '苍青', swatch: '#3fb8a8',
    colors: { body: '#3fb8a8', limb: '#217a72', metal: '#9fd8cf', shoe: '#163b3a' },
  },
  {
    id: 'dusk', label: '夜紫', swatch: '#8b6fd0',
    colors: { body: '#8b6fd0', limb: '#5b4596', metal: '#c3b0e8', shoe: '#241c3a' },
  },
  {
    id: 'frost', label: '霜白', swatch: '#cdd9e8',
    colors: { body: '#cdd9e8', limb: '#8798ad', metal: '#e8f0fa', shoe: '#2b3440' },
  },
] as const;

/** 合并配色：返回新对象，绝不改写 base（主场景的 VIEW_CONFIG.colors 不能被污染）。 */
export function mergePalette(base: ColorConfig, paletteId: string): ColorConfig {
  const p = WARDROBE_PALETTES.find((x) => x.id === paletteId);
  return p ? { ...base, ...p.colors } : { ...base };
}

/**
 * 界面分区定义（数据驱动，后续接背包只需改这张表 + 在 wardrobe.ts 里加渲染分支）。
 * kind:
 *  - weapon：真实可点，切换展示武器（走 CombatState.weapon，rig 每帧 setWeapon）
 *  - dye：真实可点，切换染色（重建 rig，见 wardrobe.ts）
 *  - placeholder：占位槽，明确标注「预留 / 后续扩展」，不假装能装备
 */
export type WardrobeSection = {
  id: string;
  label: string;
  hint: string;
  kind: 'weapon' | 'dye' | 'placeholder';
  /** placeholder 的占位格子标签；weapon / dye 由选项表生成，不用填 */
  slots?: readonly string[];
};

export const WARDROBE_SECTIONS: readonly WardrobeSection[] = [
  { id: 'weapon', label: '武器', hint: '点选即换装', kind: 'weapon' },
  { id: 'armor', label: '防具', hint: '预留 · 后续接装备', kind: 'placeholder', slots: ['头', '胸', '腿', '饰品'] },
  { id: 'dye', label: '染色', hint: '切换外观配色', kind: 'dye' },
  { id: 'bag', label: '背包', hint: '后续扩展', kind: 'placeholder', slots: ['1', '2', '3', '4', '5', '6'] },
] as const;

/** 界面里可选武器（与 WEAPON_ORDER 同序，标签用中文短名）。 */
export const WARDROBE_WEAPONS = [
  { id: 'sword-shield', label: '剑盾' },
  { id: 'dual-swords', label: '双剑' },
  { id: 'greatsword', label: '大剑' },
  { id: 'staff', label: '法杖' },
  { id: 'bow', label: '弓' },
] as const;
