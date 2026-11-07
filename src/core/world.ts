import { initialAbilityState, resetAbilities } from './abilities';
import { initialCameraIntent, resetCameraIntent } from './camera';
import { initialCombatState } from './combat';
import { initialDashState, resetDash } from './dash';
import { createDummies, resetDummies } from './dummies';
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
    centroidYaw: 0,
    threatCount: 0,
    threat: 0,
  };
}
import { clearArrows } from './arrows';
import { buildBoxes } from './scene';
import type { CoreConfig, SceneConfig, World } from './types';

/** 创建初始世界。配置由外部注入，Core 自身不 import 任何配置文件。 */
export function createWorld(core: CoreConfig, scene: SceneConfig): World {
  return {
    tick: 0,
    time: 0,
    rngState: 0x9e3779b9,
    config: core,
    boxes: buildBoxes(scene),
    gridMeta: scene.grid,
    character: {
      position: { x: core.spawn.x, y: core.spawn.y, z: core.spawn.z },
      velocity: { x: 0, y: 0, z: 0 },
      facing: 0,
      moveYaw: 0,
      bodyYaw: 0,
      headYaw: 0,
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
  resetAbilities(world);
  clearArrows(world);
  resetDash(world);
  resetCameraIntent(world);
  resetTurnInPlace(world);
  const g = world.gaze;
  g.active = false;
  g.mainId = 0;
  g.mainYaw = 0;
  g.centroidYaw = 0;
  g.threatCount = 0;
  g.threat = 0;
  world.events.length = 0;
}
