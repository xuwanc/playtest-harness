import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import { solveGait } from '../src/presentation/gait';
import { CONFIG, intent, makeWorld, place, run } from './helpers';

/**
 * v9s.20 · 边界不再是「位置冻结、速度满格」
 *
 * 旧行为：世界边界只在 movement / dummies 末尾 clamp 位置，速度照常按输入 / AI 期望涨到满速。
 * 表现层用 speed 决定步态摆幅、用「实际位移」推进 gaitPhase —— 于是贴边时摆幅拉满、
 * 相位却不动，假人（尤其 keep-distance 被逼到边界）会满幅跨步定格；再被推一下就在
 * 「定格 / 迈步」之间逐帧切换，真机上就是「手脚都在抖」。
 *
 * 现在两层都改：贴边时把朝外的输入 / 期望方向投影掉，夹紧时清掉朝外的速度与击退。
 */

function speedOf(w: ReturnType<typeof makeWorld>, id: number): number {
  const s = w.dummies[id - 1];
  return Math.hypot(s.velocity.x, s.velocity.z);
}

describe('v9s.20 · 玩家贴边', () => {
  it('贴边按住朝外：速度收敛到 0，不再原地满速踏步', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    place(w, b.maxX, 0);
    // 朝界外推 60 帧
    run(w, 60, intent({ moveX: 1 }));
    expect(w.character.position.x).toBeCloseTo(b.maxX, 6);
    expect(Math.abs(w.character.velocity.x)).toBeLessThan(1e-6);
    // 收相后步态不残留摆幅
    const c = w.character;
    const gait = solveGait({
      phase: c.gaitPhase, speed: Math.hypot(c.velocity.x, c.velocity.z),
      moveSpeed: w.config.moveSpeed, localForward: 0, localRight: 0,
      legLength: 0.42, stride: c.stride, grounded: true,
    }, CONFIG.view.gait);
    expect(Math.abs(gait.legL.pitchX)).toBeLessThan(1e-6);
    expect(Math.abs(gait.armL)).toBeLessThan(1e-6);
  });

  it('贴边斜推：只保留沿墙分量，速度沿墙而不是归零', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    place(w, b.maxX, 0);
    run(w, 60, intent({ moveX: 1, moveZ: 1 }));
    expect(w.character.position.x).toBeCloseTo(b.maxX, 6);
    expect(w.character.velocity.x).toBeLessThanOrEqual(1e-9);
    expect(w.character.velocity.z).toBeGreaterThan(1);
    expect(w.character.position.z).toBeGreaterThan(1);
  });

  it('贴边速度没有方波：连续帧的速度差有界', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    place(w, b.maxX, 0);
    run(w, 30, intent({ moveX: 1 }));
    const speeds: number[] = [];
    for (let i = 0; i < 40; i++) {
      step(w, w.config.fixedDt, intent({ moveX: 1 }));
      speeds.push(Math.hypot(w.character.velocity.x, w.character.velocity.z));
    }
    const maxJump = Math.max(...speeds.map((s, i) => (i ? Math.abs(s - speeds[i - 1]) : 0)));
    expect(maxJump).toBeLessThan(0.2);
  });

  it('击退推到边界：不残留朝外速度，角色不会贴着边界抖动', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    place(w, b.maxX - 0.2, 0);
    w.playerHurt.knockX = 4;
    for (let i = 0; i < 40; i++) step(w, w.config.fixedDt, intent());
    expect(w.character.position.x).toBeLessThanOrEqual(b.maxX + 1e-9);
    expect(w.playerHurt.knockX).toBeLessThanOrEqual(1e-9);
    expect(w.character.velocity.x).toBeLessThanOrEqual(1e-9);
  });

  it('离开边界后输入立刻恢复，不会被投影永久锁死', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    place(w, b.maxX, 0);
    run(w, 30, intent({ moveX: 1 }));
    expect(Math.abs(w.character.velocity.x)).toBeLessThan(1e-6);
    // 往里走：投影解除，立刻能加速
    run(w, 20, intent({ moveX: -1 }));
    expect(w.character.velocity.x).toBeLessThan(-1);
    expect(w.character.position.x).toBeLessThan(b.maxX - 0.3);
  });
});

describe('v9s.20 · 假人贴边', () => {
  it('keep-distance 被逼到边界：速度归零，不空踩', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    const s = w.dummies[2];
    s.mode = 'keep-distance';
    s.position.x = b.maxX;
    s.position.z = 0;
    s.homeX = b.maxX;
    s.homeZ = 0;
    // 玩家站在假人内侧 1m：假人想后退到 keepDistance，只能朝界外
    place(w, b.maxX - 1, 0);
    run(w, 120, intent());
    expect(s.position.x).toBeCloseTo(b.maxX, 6);
    expect(speedOf(w, 3)).toBeLessThan(0.05);
  });

  it('贴边斜向走：速度只保留沿墙分量', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    const s = w.dummies[2];
    s.mode = 'keep-distance';
    s.position.x = b.maxX;
    s.position.z = 0;
    s.homeX = b.maxX;
    s.homeZ = 0;
    // 玩家在左后方：期望方向斜朝界外 + 沿墙
    place(w, b.maxX - 3, -3);
    run(w, 90, intent());
    expect(s.position.x).toBeLessThanOrEqual(b.maxX + 1e-9);
    expect(Math.abs(s.velocity.x)).toBeLessThan(1e-6);
  });

  it('击退贴着边界：位移不越界，击退速度被清掉', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    const s = w.dummies[0];
    s.position.x = b.maxX - 0.05;
    s.position.z = 0;
    s.hurt.knockX = 6;
    s.hurt.timer = 0.35;
    s.hurt.duration = 0.35;
    for (let i = 0; i < 30; i++) step(w, w.config.fixedDt, intent());
    expect(s.position.x).toBeLessThanOrEqual(b.maxX + 1e-9);
    expect(s.hurt.knockX).toBeLessThanOrEqual(1e-9);
  });

  it('玩家离开边界后，贴边假人恢复追击', () => {
    const w = makeWorld();
    const b = w.config.worldBounds;
    const s = w.dummies[1];
    s.mode = 'follow';
    s.position.x = b.maxX;
    s.position.z = 0;
    s.homeX = b.maxX;
    s.homeZ = 0;
    place(w, b.maxX - 1.0, 0);
    run(w, 60, intent());
    // 玩家贴着假人：追击方向朝界外，速度已收敛
    expect(speedOf(w, 2)).toBeLessThan(0.5);
    // 玩家退回场内 4m：假人应重新走出去
    place(w, b.maxX - 6, 0);
    run(w, 40, intent());
    expect(s.position.x).toBeLessThan(b.maxX - 0.3);
    expect(speedOf(w, 2)).toBeGreaterThan(0.5);
  });
});
