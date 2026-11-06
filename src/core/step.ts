import { abilitiesUpdate } from './abilities';
import { cameraUpdate, resetCameraIntent } from './camera';
import { combatUpdate } from './combat';
import { dashUpdate } from './dash';
import { decayHurt, hitsUpdate } from './hits';
import { decayLinks, linksUpdate } from './links';
import { dummiesUpdate } from './dummies';
import { movementUpdate } from './movement';
import { orientationUpdate } from './orientation';
import { separationUpdate } from './separation';
import { targetingUpdate } from './targeting';
import { EMPTY_INTENTS } from './types';
import type { Intents, World } from './types';
import { resetWorld } from './world';

/**
 * 单个固定步长的确定性状态转移。
 * 契约：只读参数、只写 world、不读任何外部状态（等价于 C# 的 static void Step）。
 *
 * 顺序（全部单向数据流，模块之间只靠 world 状态与显式事件队列通信）：
 *   1 targeting    选目标（读玩家/假人上一帧位置，写 world.targeting）
 *   2 links        派生招（v9a）：窗口 / 索敌快照 / 状态机，写 impulse、仲裁 attackPressed；
 *                  必须在 combat 之前（输入优先）与 dash / movement 之前（impulse 当帧消费）
 *   3 combat       起手锁定朝向 + 动态前冲，写 impulse、发 attack-active（法杖技能不在此处理）
 *   4 dash         翻滚 / 闪现：翻滚把剩余位移换算成附加速度写入 impulse（覆盖攻击值），
 *                  闪现直接改位置；结束时写 linkWindow 供 links 下一帧读取
 *   5 movement     消费 impulse，更新玩家位置 / 速度 / 落地（引导时按 moveScale 轻微减速）
 *   6 orientation  读新速度写四角朝向（弓蓄力 / 法杖引导时面向目标或拖拽辅助朝向）
 *   7 dummies      读玩家新位置，假人 AI + 点击轮转，发 dummy-hit
 *   8 decayHurt / decayLinks  受击计时与派生招窗口 / 冷却衰减（独立于模块开关）
 *   9 abilities    法杖技能：引导飞弹 / 电环推进 + 命中结算（读本帧假人新位置）
 *  10 hits         消费 attack-active / dummy-hit + 派生招扫掠命中，写受击状态与击退
 *  11 separation   角色间分离，只推假人，保证不重叠
 *  12 camera       威胁权重 → 构图意图（纯数据，表现层做指数平滑后消费）
 *
 * 与假人相关的模块统一以 modules.dummies 为总闸：关闭后假人（含受击/分离）完全冻结。
 * 复位提升到 step 层，保证关闭任何模块时都能完整回到初始状态。
 */
export function step(world: World, dt: number, intents: Intents): World {
  world.events.length = 0;
  world.tick += 1;
  world.time += dt;
  world.impulse.x = 0;
  world.impulse.z = 0;

  if (intents.resetPressed) {
    resetWorld(world);
    const s = world.config.spawn;
    world.events.push({ type: 'reset', tick: world.tick, x: s.x, y: s.y, z: s.z, value: 0 });
    return world;
  }

  if (world.modules.dummies && world.modules.targeting) targetingUpdate(world, dt, intents);
  else {
    world.targeting.targetId = 0;
    world.targeting.targetYaw = 0;
    world.targeting.targetDist = 0;
    world.targeting.hasTarget = false;
  }
  // v9a：总是调用（内部处理模块开关并清理残留状态），保证关闭时不会把「动作进行中」卡住
  linksUpdate(world, dt, intents);
  if (world.modules.combat) combatUpdate(world, dt, intents);
  if (world.modules.dash) dashUpdate(world, dt, intents);
  if (world.modules.movement) movementUpdate(world, dt, intents);
  if (world.modules.orientation) orientationUpdate(world, dt, intents);
  if (world.modules.dummies) dummiesUpdate(world, dt, intents);

  decayHurt(world, dt);
  decayLinks(world, dt);
  // 法杖技能独立于 dummies 开关运行（引导是玩家能力）；其命中结算内部遵守 hits/dummies 开关
  if (world.modules.abilities) abilitiesUpdate(world, dt, intents);
  if (world.modules.dummies) {
    hitsUpdate(world, dt);
    if (world.modules.separation) separationUpdate(world);
  }

  // 相机意图放最后：读的是本帧所有模块结束后的最终玩家 / 假人位置。
  // 关闭模块时输出中性意图，让表现层平滑回到基础 2.5D 构图。
  if (world.modules.camera) cameraUpdate(world);
  else resetCameraIntent(world);
  return world;
}

/** 批量推进，供测试 / 回放 / 无头验证使用。 */
export function runSteps(
  world: World,
  count: number,
  intentAt?: (tick: number) => Intents,
  dt?: number,
): World {
  const fixed = dt ?? world.config.fixedDt;
  for (let i = 0; i < count; i++) {
    step(world, fixed, intentAt ? intentAt(i) : EMPTY_INTENTS);
  }
  return world;
}
