import type { ColorConfig, VoxelConfig } from '../core';

/**
 * 装备 / 外观展示界面（Wardrobe）的**纯数据层**。
 *
 * 与 `wardrobe.ts`（DOM + WebGL）分开，是为了让「视线映射 / 拖动旋转 / 合成配方」
 * 这些规则能被单测直接覆盖，且单测不需要 DOM 或 WebGL。这里没有 THREE、没有
 * document、没有时间源 —— 所有输入显式传入，输出是 plain data。
 *
 * 用户约定的三条交互，规则全部落在这里：
 *  1. 点开 = 角色恒待机动态站立（渲染循环在 wardrobe.ts，本文件只给 idle 摆动公式）；
 *  2. 点击 / 悬停 = 角色看向鼠标（resolveLook 把归一化指针坐标转成头 / 身朝向）；
 *  3. 左右拖动 = 角色绕上下轴（Y 轴）旋转（dragYaw 累加水平位移）。
 *
 * v9s.69 起新增「合成台」：侧栏一个 3×4 魔方（12 格）放入材料，按配方合成装备。
 * 合成的全部规则（材料计数 / 配方匹配 / 消耗）都是纯函数，落在本文件，便于单测。
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

/** 界面分区定义（数据驱动，渲染分支在 wardrobe.ts）。kind：
 *  - weapon：真实可点，切换展示武器（走 CombatState.weapon，rig 每帧 setWeapon）；
 *  - craft：3×4 合成魔方，放材料 → 按配方合成装备（纯数据，见下方配方表）。 */
export type WardrobeSection = {
  id: string;
  label: string;
  hint: string;
  kind: 'weapon' | 'craft';
};

export const WARDROBE_SECTIONS: readonly WardrobeSection[] = [
  { id: 'weapon', label: '武器', hint: '点选即换装', kind: 'weapon' },
  { id: 'craft', label: '合成台', hint: '3×4 魔方 · 放材料合成装备', kind: 'craft' },
] as const;

/** 界面里可选武器（与 WEAPON_ORDER 同序，标签用中文短名）。 */
export const WARDROBE_WEAPONS = [
  { id: 'sword-shield', label: '剑盾' },
  { id: 'dual-swords', label: '双剑' },
  { id: 'greatsword', label: '大剑' },
  { id: 'staff', label: '法杖' },
  { id: 'bow', label: '弓' },
] as const;

// =====================================================================
//  v9s.69：合成台（3×4 魔方）
// =====================================================================

/** 可合成的装备槽位（也是合成产物的落点；每件装备以 3D 形式出现在视窗内）。 */
export type EquipmentSlot = 'helmet' | 'chest' | 'legs' | 'trinket' | 'bag';

/** 合成可用材料（与配方、色卡一一对应，仅用于 UI 展示 + 计数）。 */
export type MaterialId = 'iron' | 'wood' | 'leather' | 'crystal' | 'cloth';

/** 合成魔方的格子数：3 列 × 4 行 = 12 格（用户要求的「3*4 魔方」）。 */
export const CRAFT_CELLS = 12;

export const WARDROBE_MATERIALS: readonly { id: MaterialId; label: string; swatch: string }[] = [
  { id: 'iron', label: '铁', swatch: '#b8c0c8' },
  { id: 'wood', label: '木', swatch: '#8b5e3c' },
  { id: 'leather', label: '皮', swatch: '#9c6b3f' },
  { id: 'crystal', label: '晶', swatch: '#7fe3ff' },
  { id: 'cloth', label: '布', swatch: '#cdd9e8' },
] as const;

/** 配方：需求是「材料计数」的多重集，与放入的格子位置无关。 */
export type WardrobeRecipe = {
  id: string;
  /** 合成产物落点（对应 3D 视窗里的装备部位） */
  slot: EquipmentSlot;
  label: string;
  need: Partial<Record<MaterialId, number>>;
};

export const WARDROBE_RECIPES: readonly WardrobeRecipe[] = [
  { id: 'helmet', slot: 'helmet', label: '头盔', need: { iron: 3 } },
  { id: 'chest', slot: 'chest', label: '胸甲', need: { leather: 3 } },
  { id: 'legs', slot: 'legs', label: '护腿', need: { iron: 2, leather: 1 } },
  { id: 'trinket', slot: 'trinket', label: '饰品', need: { crystal: 1 } },
  { id: 'bag', slot: 'bag', label: '背包', need: { wood: 2, cloth: 1 } },
] as const;

/** 把 12 格数组计成各材料的数量（纯函数）。 */
export function countMaterials(cells: readonly (MaterialId | null)[]): Record<MaterialId, number> {
  const out: Record<MaterialId, number> = { iron: 0, wood: 0, leather: 0, crystal: 0, cloth: 0 };
  for (const c of cells) if (c) out[c] += 1;
  return out;
}

/**
 * 在「当前格子」里找第一个能被满足的配方（需求是计数的子集即可，不看位置）。
 * 返回 { recipe, slot }，找不到返回 null。多配方命中时按 WARDROBE_RECIPES 顺序取第一个，
 * 保证结果确定、可单测。
 */
export function matchRecipe(cells: readonly (MaterialId | null)[]): { recipe: WardrobeRecipe; slot: EquipmentSlot } | null {
  const have = countMaterials(cells);
  for (const recipe of WARDROBE_RECIPES) {
    let ok = true;
    for (const k of Object.keys(recipe.need) as MaterialId[]) {
      if ((have[k] ?? 0) < (recipe.need[k] ?? 0)) { ok = false; break; }
    }
    if (ok) return { recipe, slot: recipe.slot };
  }
  return null;
}

/**
 * 合成消耗：从格子里移除「满足配方所需」的材料（按出现顺序取前 N 个），返回新的格子数组。
 * 不改动入参，纯函数 + 不可变。若材料不够（理论上不应调用），原样返回副本。
 */
export function consumeForRecipe(
  cells: readonly (MaterialId | null)[],
  recipe: WardrobeRecipe,
): (MaterialId | null)[] {
  const out = cells.slice() as (MaterialId | null)[];
  for (const k of Object.keys(recipe.need) as MaterialId[]) {
    let need = recipe.need[k] ?? 0;
    for (let i = 0; i < out.length && need > 0; i++) {
      if (out[i] === k) { out[i] = null; need -= 1; }
    }
  }
  return out;
}

/** 当前角色展示配置：id（体型键）+ 展示名 + voxel 尺寸 + 配色，由 app.ts 实时提供。 */
export type CharacterConfig = {
  id: string;
  name: string;
  voxel: VoxelConfig;
  colors: ColorConfig;
};

/**
 * v9s.61：装备面板**自己的 3D 转台**取景（纯函数，可单测）—— 角色按「正常大小、居中」显示。
 *
 * 用户澄清：之前说的「相机下移让角色出现在上半区」指的是**主场景相机**（底部抽屉别挡住
 * 场景里的角色），不是这个转台相机；转台角色应恢复正常大小，不再被「整体下移 + 拉远」
 * 缩成一团。所以这里回到接近 v9s.69 的基准：垂直视野留 1.5× 身高（角色约占舞台 2/3）、
 * 看向点取角色中心、相机只留一点俯视。
 *
 * 仍然保留体型自适应：不同体型（standard / elder / sentinel）高度不同 → 传实测包围盒
 * 自动适配，并补偿窄舞台的左右裁切，高体型不会把头裁出画面。
 */
export type WardrobeFraming = {
  /** 相机到角色的水平距离 */
  distance: number;
  /** 看向点的 y（角色中心 → 角色居中显示） */
  lookY: number;
  /** 相机自身的 y（略高于 lookY，保持轻微俯视） */
  cameraY: number;
  /** 该距离下的垂直可见高度（诊断 / 验收用） */
  visibleHeight: number;
};

export function wardrobeFraming(
  height: number,
  width: number,
  aspect: number,
  fovDeg: number,
  footY = 0,
): WardrobeFraming {
  const h = Math.max(0.9, height);
  const w = Math.max(0.6, width);
  const a = Math.max(0.35, aspect || 1);
  const tanHalf = Math.tan((fovDeg * Math.PI) / 360);
  // 垂直：留 1.5× 身高 → 角色约占舞台 2/3，接近旧写死 z=3.0 的「正常大小」
  const visibleHeight = h * 1.5;
  let distance = visibleHeight / (2 * tanHalf);
  // 水平：窄舞台时按可见宽度补距离，保证转台旋转时左右不裁
  const needWidth = w * 1.35;
  const distForWidth = needWidth / (2 * tanHalf * a);
  distance = Math.max(distance, distForWidth);
  const lookY = footY + h * 0.5;   // 居中，不再为了「上半区」人为压低
  const cameraY = lookY + h * 0.1;
  return { distance, lookY, cameraY, visibleHeight };
}
