import { dealHit } from '../hits';
import type { AbilityConfig, EventType, Intents, ShockRingState, World } from '../types';
import type { SkillContext, SkillModule } from './types';

const EPS = 1e-6;

type Params = AbilityConfig['ring'];

function emit(
  world: World, type: EventType, value: number, at: { x: number; y: number; z: number },
): void {
  world.events.push({ type, tick: world.tick, x: at.x, y: at.y, z: at.z, value });
}

/** 放置一个电环（世界坐标固定，不随玩家移动）。 */
function placeRing(world: World, cfg: Params): void {
  const p = world.character.position;
  const ring: ShockRingState = {
    id: ++world.abilities.nextId,
    x: p.x,
    z: p.z,
    radius: cfg.radius,
    life: cfg.duration,
    duration: cfg.duration,
    pulseTimer: 0, // 放置瞬间立即结算一次命中
  };
  world.abilities.rings.push(ring);
  emit(world, 'ring-place', ring.id, p);
}

/** 电环推进 + 脉冲命中：存活期内每 pulseInterval 对范围内所有假人结算一次「僵直 + 轻微击退」。 */
function updateRings(world: World, dt: number, cfg: Params): void {
  const a = world.abilities;
  const dummyR = world.config.dummies.radius;
  const canHit = world.modules.hits && world.modules.dummies;
  const next: ShockRingState[] = [];
  for (const r of a.rings) {
    r.life -= dt;
    r.pulseTimer -= dt;
    let guard = 0;
    while (r.pulseTimer <= 0 && guard++ < 8) {
      r.pulseTimer += Math.max(cfg.pulseInterval, EPS);
      if (canHit) {
        for (let i = 0; i < world.dummies.length; i++) {
          const s = world.dummies[i];
          const dx = s.position.x - r.x;
          const dz = s.position.z - r.z;
          const rr = r.radius + dummyR;
          if (dx * dx + dz * dz > rr * rr) continue;
          const len = Math.hypot(dx, dz);
          const nx = len > EPS ? dx / len : 0;
          const nz = len > EPS ? dz / len : 1;
          // 僵直 = 较长的 heavy 受击时长（hurt.timer > 0 时假人 AI 停住）；
          // 从环心向外做轻微击退。
          dealHit(world, i, {
            type: 'heavy',
            duration: cfg.stun,
            dirX: nx,
            dirZ: nz,
            knockback: cfg.knockback,
          });
        }
      }
      emit(world, 'ring-pulse', r.id, { x: r.x, y: 0, z: r.z });
    }
    if (r.life > 0) next.push(r);
  }
  a.rings = next;
}

/**
 * 技2 · 原地电环：按下瞬间在脚下放一个区域，持续脉冲。
 * 输入门（槽位 / 武器 / 冲刺 / 派生招）由 dispatch 统一判断，这里只管「放了之后怎么走」。
 */
export const groundRing: SkillModule = {
  kind: 'groundRing',
  update({ world, dt, intents, skill, onWeapon }: SkillContext): void {
    const cfg = skill.params as Params;
    // 未持对应武器 / 翻滚 / 派生招抢占时不能放置，但已经放下的环继续走
    const pressed = skill.cfg.slot === 'attack' ? intents.attackPressed : intents.skill2Pressed;
    if (onWeapon && pressed && world.dash.phase !== 'active'
      && world.playerLink.phase === 'idle') {
      placeRing(world, cfg);
    }
    updateRings(world, dt, cfg);
  },
};
