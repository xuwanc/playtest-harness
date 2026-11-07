import { readFileSync } from 'node:fs';
import { EMPTY_INTENTS, createWorld, step } from '../src/core';
import type { AppConfig, GameEvent, Intents, World } from '../src/core';

/** 用 fs 直接读配置，证明 Core 不依赖 Vite 的 JSON 插件或任何构建工具。 */
const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

export const CONFIG: AppConfig = raw;

/**
 * v9s.15 · 固定测试夹具。
 *
 * 线上场景已改成「7 个测试工位」的布局（出生点在中心、假人分布到场边）。手感 / 朝向 /
 * 战斗 / 注视这些用例大量依赖「出生点 = (0,8)、4 个假人在 z=5 一排、台阶在 x=-7.5..4.5」
 * 这套坐标，如果直接吃线上配置，任何关卡调整都会连带 50 个用例失败。
 *
 * 所以单元测试改用这份**冻结**的场景 + Core 覆盖：坐标假设与线上关卡解耦，改布局只影响
 * `makeLabWorld()` 的专项用例。线上配置本身仍由 portable 用例校验完整性。
 */
const FIXTURE_SCENE = {
  ground: { size: 28, thickness: 0.4 },
  steps: [
    { id: 'step-025', x: -7.5, z: 2, width: 2.4, depth: 2.4, height: 0.25 },
    { id: 'step-040', x: -4.5, z: 2, width: 2.4, depth: 2.4, height: 0.4 },
    { id: 'step-060', x: -1.5, z: 2, width: 2.4, depth: 2.4, height: 0.6 },
    { id: 'step-090', x: 1.5, z: 2, width: 2.4, depth: 2.4, height: 0.9 },
    { id: 'step-120', x: 4.5, z: 2, width: 2.4, depth: 2.4, height: 1.2 },
  ],
  doorways: [
    {
      id: 'door-wide', x: -3, z: -3, openingWidth: 2.4, openingHeight: 1.7,
      wallThickness: 0.6, wallSpan: 3.2, wallHeight: 2.4,
    },
    {
      id: 'door-narrow', x: 4, z: -3, openingWidth: 0.5, openingHeight: 1.7,
      wallThickness: 0.6, wallSpan: 2.4, wallHeight: 2.4,
    },
  ],
  obstacles: [
    { id: 'wall-a', x: 7.5, z: 1, width: 3.5, depth: 0.6, height: 2 },
    { id: 'pillar-a', x: -8, z: -7, width: 1.2, depth: 1.2, height: 2.2 },
  ],
  grid: { cellSize: 0.5, minX: -14, maxX: 14, minZ: -14, maxZ: 14 },
} as AppConfig['scene'];

const FIXTURE_CORE_PATCH = {
  spawn: { x: 0, y: 0, z: 8 },
  worldBounds: { minX: -13.5, maxX: 13.5, minZ: -13.5, maxZ: 13.5 },
  dummies: {
    count: 4,
    spawn: [{ x: -6, z: 5 }, { x: -2, z: 5 }, { x: 2, z: 5 }, { x: 6, z: 5 }],
    initialModes: ['wander', 'follow', 'keep-distance', 'attack'] as AppConfig['core']['dummies']['initialModes'],
    leashRadius: 0,
  },
};

function core(): AppConfig['core'] {
  const c = JSON.parse(JSON.stringify(raw.core)) as AppConfig['core'];
  c.spawn = { ...FIXTURE_CORE_PATCH.spawn };
  c.worldBounds = { ...FIXTURE_CORE_PATCH.worldBounds };
  c.dummies = { ...c.dummies, ...FIXTURE_CORE_PATCH.dummies };
  return c;
}

function scene(): AppConfig['scene'] {
  return JSON.parse(JSON.stringify(FIXTURE_SCENE)) as AppConfig['scene'];
}

/** 冻结坐标的测试世界（绝大多数单元 / 手感用例用这个）。 */
export function makeWorld(): World {
  return createWorld(core(), scene());
}

/** 线上测试场（工位布局）的世界：只给工位 / 关卡专项用例用。 */
export function makeLabWorld(): World {
  return createWorld(
    JSON.parse(JSON.stringify(raw.core)) as AppConfig['core'],
    JSON.parse(JSON.stringify(raw.scene)) as AppConfig['scene'],
  );
}

/**
 * 关闭注视模块的世界：等价于 v9s.2 的朝向基线（默认场景 4 个假人就在 8m 内且多为敌对模式，
 * 会主动进入接敌并改写 bodyYaw）。纯朝向 / 步态 / 索敌测试用这个，注视本身另有专项测试。
 */
export function makeQuietWorld(): World {
  const w = makeWorld();
  w.modules.gaze = false;
  return w;
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
