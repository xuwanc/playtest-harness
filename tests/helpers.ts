import { readFileSync } from 'node:fs';
import { EMPTY_INTENTS, createWorld, step } from '../src/core';
import type { AppConfig, GameEvent, Intents, World } from '../src/core';

/** 用 fs 直接读配置，证明 Core 不依赖 Vite 的 JSON 插件或任何构建工具。 */
const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

export const CONFIG: AppConfig = raw;

export function makeWorld(): World {
  return createWorld(
    JSON.parse(JSON.stringify(raw.core)) as AppConfig['core'],
    JSON.parse(JSON.stringify(raw.scene)) as AppConfig['scene'],
  );
}

/** 构造完整 Intents：新增字段时只需改 EMPTY_INTENTS，测试不用逐个补。 */
export function intent(p: Partial<Intents> = {}): Intents {
  return { ...EMPTY_INTENTS, ...p };
}

/** 推进若干步并收集所有事件（step 每步会清空 world.events）。 */
export function run(world: World, count: number, intents: Intents): GameEvent[] {
  const events: GameEvent[] = [];
  for (let i = 0; i < count; i++) {
    step(world, world.config.fixedDt, intents);
    events.push(...world.events);
  }
  return events;
}

export function place(world: World, x: number, z: number): void {
  world.character.position.x = x;
  world.character.position.y = 0;
  world.character.position.z = z;
  world.character.velocity.x = 0;
  world.character.velocity.y = 0;
  world.character.velocity.z = 0;
  world.character.grounded = true;
}
