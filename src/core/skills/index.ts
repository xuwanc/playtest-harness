import type { CoreConfig, Intents, SkillKind, SkillRuntime, World } from '../types';
import { channelVolley } from './channel-volley';
import { groundRing } from './ground-ring';
import type { SkillModule } from './types';

/**
 * v9s.19 · 技能注册表。
 *
 * `kind` → 实现是一张**穷举表**（不是运行时可变注册）：新增一种行为时，
 * TS 会强制在这里补一行，避免 JSON 里写了个不存在的 kind 却静默不生效。
 */
const MODULES: Record<SkillKind, SkillModule> = {
  channelVolley,
  groundRing,
};

export function skillModule(kind: SkillKind): SkillModule {
  return MODULES[kind];
}

/**
 * 把配置里的技能声明表解析成运行时实例。
 *
 * `paramsRef` 保留对 `core.abilities.<name>` 的**对象引用** —— 调试面板改数值、
 * 测试里 `w.config.abilities.arcane.x = ...` 都会立刻作用到技能上；
 * 新技能可以完全不碰 abilities，直接在 `params` 里内联。
 */
export function normalizeSkills(core: CoreConfig): SkillRuntime[] {
  const defs = Array.isArray(core.skills) ? core.skills : [];
  const bag = core.abilities as unknown as Record<string, unknown>;
  return defs.map((cfg) => {
    if (cfg.params) {
      return { cfg, params: cfg.params as unknown as SkillRuntime['params'] };
    }
    const key = cfg.paramsRef;
    const params = key ? bag[key] : undefined;
    if (!params || typeof params !== 'object') {
      throw new Error(
        `[skills] ${cfg.id}: paramsRef "${key ?? ''}" 在 core.abilities 中不存在`,
      );
    }
    return { cfg, params: params as SkillRuntime['params'] };
  });
}

/**
 * 技能 dispatch：只做「要不要调用」，不做任何具体技能逻辑。
 *
 * 与武器 / 输入相关的门控分成两层：
 *  - 这里只判断 enabled 与武器是否匹配（onWeapon 传下去，让模块能优雅收尾，
 *    例如引导中切武器要触发打断冷却，而不是把 channeling 卡住）；
 *  - 按哪个键 / 是否按住，由各模块自己判断（slot 只是声明，方便 UI 与后续重绑定）。
 */
export function skillsUpdate(world: World, dt: number, intents: Intents): void {
  for (const rt of world.skills) {
    if (rt.cfg.enabled === false) continue;
    const mod = MODULES[rt.cfg.kind];
    if (!mod) continue; // 配置里出现未知 kind：忽略（portable 用例会校验 kind 合法）
    const onWeapon = !rt.cfg.weapon || world.combat.weapon === rt.cfg.weapon;
    mod.update({ world, dt, intents, skill: rt, onWeapon });
  }
}
