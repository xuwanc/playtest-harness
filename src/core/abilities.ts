import { skillsUpdate } from './skills';
import type { AbilityState, Intents, World } from './types';

/**
 * v9s.19 · 技能运行时状态。
 *
 * 具体技能逻辑已拆到 `core/skills/`（channelVolley / groundRing），本文件只保留
 * **共享的施法运行时**与实体容器：
 *   - 引导状态（channeling / channelYaw / waveIndex / cooldown / needsRelease），
 *     由 channelVolley 这类「引导型」技能共用；
 *   - 投射物 / 待发弹 / 区域实体的数组（表现层直接按数组渲染）；
 *   - 复位与入口 `abilitiesUpdate`（转发给技能 dispatch）。
 *
 * 这样拆分的好处：加一个新技能只需要在 `skills/` 加模块 + 在配置 `core.skills` 加一条，
 * 不用再往这里塞字段、也不用改 combat / step 的调用点。
 */
export function initialAbilityState(): AbilityState {
  return {
    channeling: false,
    channelYaw: 0,
    fireTimer: 0,
    waveIndex: 0,
    cooldown: 0,
    needsRelease: false,
    channelId: 0,
    channelMoveScale: 1,
    volleyId: 0,
    pending: [],
    projectiles: [],
    rings: [],
    nextId: 0,
  };
}

export function resetAbilities(world: World): void {
  const a = world.abilities;
  a.channeling = false;
  a.channelYaw = 0;
  a.fireTimer = 0;
  a.waveIndex = 0;
  a.cooldown = 0;
  a.needsRelease = false;
  a.channelMoveScale = 1;
  // channelId / volleyId / nextId 持久递增不倒退：表现层用「id 变化」触发一次性特效，
  // 复位若清零会与残留特效冲突；飞弹 / 电环实体本身清空即可。
  a.pending.length = 0;
  a.projectiles.length = 0;
  a.rings.length = 0;
}

/**
 * 技能模块入口（由 step 在 decayHurt 之后、hits 之前调用）。
 * 只负责 dispatch：每个已启用的技能按 kind 找到实现并执行一帧。
 */
export function abilitiesUpdate(world: World, dt: number, intents: Intents): void {
  skillsUpdate(world, dt, intents);
}
