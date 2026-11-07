import type { Intents, SkillKind, SkillRuntime, World } from '../types';

/**
 * v9s.19 · 技能模块契约。
 *
 * 技能被拆成两层：
 *   - **数据**：`SkillConfig`（kind / slot / weapon / params），全部来自 game.json；
 *   - **行为**：`SkillModule`（kind 唯一对应一个实现），只认「我这一帧该做什么」。
 *
 * 模块不直接读 `config.abilities.*`，参数由 dispatch 注入（`skill.params`），
 * 因此同一个 kind 可以挂多份不同参数的实例（例如两种不同飞弹），
 * 也可以只改 JSON 就调数值 —— 这就是「以后数据驱动」的地基。
 */
export type SkillContext = {
  world: World;
  dt: number;
  intents: Intents;
  /** 本次声明的运行时实例（含参数对象，热改立即生效） */
  skill: SkillRuntime;
  /** 声明的武器是否正被持有（未声明 weapon = 恒为 true） */
  onWeapon: boolean;
};

export type SkillModule = {
  kind: SkillKind;
  /** 每帧调用一次：模块自行判断武器 / 输入 / 冷却，返回值无意义 */
  update(ctx: SkillContext): void;
};
