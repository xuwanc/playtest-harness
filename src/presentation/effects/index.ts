import type { AfterimageViewConfig, AfterimageRtViewConfig } from '../../core/types';
import { createGhostAfterimage } from './ghost-afterimage';
import { createRtAfterimage } from './rt-afterimage';
import type { AfterimageEffect, AfterimageKind, EffectContext } from './shared';

/**
 * 角色残影特效库 · 统一入口（v9s.59）。
 *
 * 目标：把「克隆 ghost 池」和「RT 反馈」两种拖影收敛成一处，任意角色、任意方案都可复用：
 *  - 统一的 `AfterimageEffect` 接口（container / update / reset / debug / dispose）；
 *  - 统一工厂 `createAfterimageEffect`，由注册表 `AFTERIMAGE_EFFECTS` 分发；
 *  - 新增方案只需往注册表里加一项，调用方（three-scene）不用改；
 *  - 具体工厂也可单独 import，便于按需 tree-shaking / 单测。
 *
 * 库不认识 World / Core、不绑定任何 bodyType —— 作用对象由每帧 `update(bodyId)` + 配置决定。
 * ghost 方案纯场景内对象、无需 ctx；RT 方案需要 renderer/scene/camera 的 `EffectContext`。
 */

export type { AfterimageEffect, AfterimageDebug, AfterimageKind, EffectContext } from './shared';
export { createGhostAfterimage, createRtAfterimage };

/**
 * 方案注册表。key = `AfterimageKind`，value = 工厂。
 * 加新残影方案时只需在此登记，工厂与 three-scene 无需改动。
 */
export const AFTERIMAGE_EFFECTS: {
  ghost: (cfg: AfterimageViewConfig) => AfterimageEffect;
  rt: (ctx: EffectContext, cfg: AfterimageRtViewConfig) => AfterimageEffect;
} = {
  ghost: (cfg) => createGhostAfterimage(cfg),
  rt: (ctx, cfg) => createRtAfterimage(ctx, cfg),
};

/** 支持的方案列表（供调试面板 / 文档枚举） */
export const AFTERIMAGE_KINDS: readonly AfterimageKind[] = ['ghost', 'rt'];

export function createAfterimageEffect(kind: 'ghost', cfg: AfterimageViewConfig): AfterimageEffect;
export function createAfterimageEffect(kind: 'rt', ctx: EffectContext, cfg: AfterimageRtViewConfig): AfterimageEffect;
export function createAfterimageEffect(
  kind: AfterimageKind,
  a: AfterimageViewConfig | EffectContext,
  b?: AfterimageRtViewConfig,
): AfterimageEffect {
  if (kind === 'ghost') return AFTERIMAGE_EFFECTS.ghost(a as AfterimageViewConfig);
  if (kind === 'rt') return AFTERIMAGE_EFFECTS.rt(a as EffectContext, b as AfterimageRtViewConfig);
  throw new Error(`[effects] unknown afterimage kind: ${kind}`);
}
