import { initialAbilityState, resetAbilities } from './abilities';
import { initialCameraIntent, resetCameraIntent } from './camera';
import { initialCombatState } from './combat';
import { initialDashState, resetDash } from './dash';
import { createDummies, resetDummies } from './dummies';
import { createGrassState, grassReset } from './grass';
import { createDestructibleStates, destructiblesReset } from './destructibles';
import { initialHurt, NEVER_HURT_AT } from './hits';
import { initialLinkState, resetLink } from './links';
import { resetCharacter } from './movement';
import { initialTargetState } from './targeting';
import { initialTurnInPlaceState, resetTurnInPlace } from './turn-in-place';
import type { GazeState } from './types';

/** v9s.3：注视 / 威胁初始状态（无威胁、未激活）。 */
export function initialGazeState(): GazeState {
  return {
    active: false,
    mainId: 0,
    mainYaw: 0,
    mainPitch: 0,
    centroidYaw: 0,
    threatCount: 0,
    threat: 0,
  };
}
import { clearArrows } from './arrows';
import { buildBoxes } from './scene';
import { normalizeSkills } from './skills';
import type { CoreConfig, SceneConfig, World } from './types';

/** 创建初始世界。配置由外部注入，Core 自身不 import 任何配置文件。 */
export function createWorld(core: CoreConfig, scene: SceneConfig): World {
  const boxes = buildBoxes(scene);
  return {
    tick: 0,
    time: 0,
    rngState: 0x9e3779b9,
    config: core,
    boxes,
    gridMeta: scene.grid,
    character: {
      position: { x: core.spawn.x, y: core.spawn.y, z: core.spawn.z },
      velocity: { x: 0, y: 0, z: 0 },
      facing: 0,
      moveYaw: 0,
      bodyYaw: 0,
      headYaw: 0,
      headPitch: 0,
      bodyPitch: 0,
      grounded: true,
      sprinting: false,
      gaitPhase: 0,
      stride: core.strideLength,
      distance: 0,
      coyoteTime: core.coyoteTime,
      jumpBuffer: 0,
    },
    combat: initialCombatState(1),
    playerLink: initialLinkState(),
    arrows: [],
    arrowSeq: 0,
    abilities: initialAbilityState(),
    skills: normalizeSkills(core),
    impulse: { x: 0, z: 0 },
    targeting: initialTargetState(),
    turnInPlace: initialTurnInPlaceState(),
    playerHurt: initialHurt(),
    hitCount: 0,
    dash: {
      ...initialDashState(),
      fromX: core.spawn.x,
      fromZ: core.spawn.z,
      toX: core.spawn.x,
      toZ: core.spawn.z,
    },
    camera: {
      ...initialCameraIntent(),
      centroidX: core.spawn.x,
      centroidZ: core.spawn.z,
    },
    gaze: initialGazeState(),
    dummies: createDummies(core.dummies),
    dummyAttackCount: 0,
    // v9s.56：命中记录（飙血数据源）。空数组序列化稳定，不影响既有快照结构之外的部分。
    hitMarks: [],
    hitMarkSeq: 0,
    // v9s.39：草场只在这里生成一次；冻结夹具没有 scene.grass → 空草场，行为零影响。
    grass: createGrassState(core, scene, boxes, scene.grid),
    // v9s.x：不配置可破坏物件时是空数组，既有世界行为逐字节不变。
    destructibles: createDestructibleStates(scene.destructibles),
    events: [],
    modules: {
      movement: true,
      pathfinding: false,
      combat: true,
      links: true,
      abilities: true,
      orientation: true,
      turnInPlace: true,
      targeting: true,
      hits: true,
      separation: true,
      dash: true,
      camera: true,
      gaze: true,
      dummies: true,
      grass: true,
      destructibles: true,
    },
  };
}

export function snapshot(world: World): string {
  return JSON.stringify(world);
}

export function restoreWorld(json: string): World {
  return JSON.parse(json) as World;
}

export function cloneWorld(world: World): World {
  return restoreWorld(snapshot(world));
}

/** 复位是世界级操作：玩家、战斗、目标、受击、命中计数、冲刺、相机意图、假人一次性回到初始状态。 */
export function resetWorld(world: World): void {
  resetCharacter(world);
  resetDummies(world);
  resetLink(world); // v9a：玩家 + 假人的派生招状态一并复位
  const t = world.targeting;
  t.targetId = 0;
  t.targetYaw = 0;
  t.targetDist = 0;
  t.hasTarget = false;
  const h = world.playerHurt;
  h.type = 'none';
  h.lastAt = NEVER_HURT_AT; // 复位 = 重新开始，不残留「刚被打过」的接敌保持
  h.timer = 0;
  h.duration = 0;
  h.dirX = 0;
  h.dirZ = 0;
  world.hitCount = 0;
  // v9s.56：命中记录清空，但 seq 保留 —— 表现层靠「上次播到哪」去重，
  // 归零会让复位后的第一下血花被当成「已经播过」而丢掉。
  world.hitMarks.length = 0;
  resetAbilities(world);
  clearArrows(world);
  resetDash(world);
  resetCameraIntent(world);
  resetTurnInPlace(world);
  const g = world.gaze;
  g.active = false;
  g.mainId = 0;
  g.mainYaw = 0;
  g.mainPitch = 0;
  g.centroidYaw = 0;
  g.threatCount = 0;
  g.threat = 0;
  grassReset(world);
  destructiblesReset(world);
  world.events.length = 0;
}
