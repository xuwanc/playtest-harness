import { describe, expect, it } from 'vitest';
import { applyHit, gazeUpdate, step } from '../src/core';
import { makeWorld, intent } from './helpers';

const DT = 1 / 60;

type Phase = 'idle' | 'windup' | 'active' | 'recovery';

/**
 * 清空默认假人（推到远处），再按「相对玩家 +Z 方向的距离」摆回一个假人。
 * 玩家初始在 (0, 0, 8)，所以 z = 8 - dist。
 */
function placeOne(
  w: ReturnType<typeof makeWorld>,
  dist: number,
  phase: Phase = 'idle',
): void {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = 100;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  const d = w.dummies[0];
  d.position.x = w.character.position.x;
  d.position.z = w.character.position.z - dist;
  d.mode = 'attack';
  d.attackPhase = phase;
}

/** 让玩家挨一下（走真实命中入口，验证 lastAt 接线）。 */
function hurtPlayer(w: ReturnType<typeof makeWorld>): void {
  applyHit(w, { kind: 'player' }, {
    type: 'light', duration: 0.2, dirX: 0, dirZ: 1, knockback: 1,
  });
}

describe('v9s.7 接敌退出：受击后 2s 内不放下戒备', () => {
  it('进入后敌人拉到 3.5m 外：刚被打过 → 保持接敌；满 2s → 退出', () => {
    const w = makeWorld();
    w.modules.dummies = false;

    // 6m 起手 → 进入接敌
    placeOne(w, 6, 'windup');
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    // 敌人退到 4m（> recoveryDist 3.5）且收手，玩家刚被打过 → hurtHoldSec 内不退出
    placeOne(w, 4, 'idle');
    hurtPlayer(w);
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    // 1.9s 时仍在守卫窗口内
    w.time += 1.9;
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    // 越过 2s：敌人仍在 4m 外 → 交还身体控制
    w.time += 0.2;
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('同样距离但未受击 → 立即退出（受击守卫不改变原有滞回语义）', () => {
    const w = makeWorld();
    w.modules.dummies = false;

    placeOne(w, 6, 'windup');
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(true);

    placeOne(w, 4, 'idle');
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('受击守卫不会凭空进入：未激活时挨打但敌人在 3.5m 外 → 不进入', () => {
    const w = makeWorld();
    w.modules.dummies = false;

    placeOne(w, 4, 'idle');
    hurtPlayer(w);
    gazeUpdate(w, DT, intent({}));
    expect(w.gaze.active).toBe(false);
  });

  it('完整 step：受击后敌人跑远，身体朝向不立刻卸下（保持到守卫结束）', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    w.modules.turnInPlace = false; // 隔离原地转身，只看 gaze 是否保持

    placeOne(w, 2, 'active');       // 2m 挥砍中：被攻击 + 主动接近双源进入
    step(w, w.config.fixedDt, intent({}));
    expect(w.gaze.active).toBe(true);
    const held = w.gaze.centroidYaw;

    // 敌人瞬间拉开到 6m 且收手（模拟被打退 / 敌人后撤）
    placeOne(w, 6, 'idle');
    hurtPlayer(w);
    step(w, w.config.fixedDt, intent({}));
    expect(w.gaze.active).toBe(true);
    expect(w.gaze.centroidYaw).toBeCloseTo(held, 6);

    // 守卫结束后自然退出
    w.time += 2.1;
    step(w, w.config.fixedDt, intent({}));
    expect(w.gaze.active).toBe(false);
  });
});
