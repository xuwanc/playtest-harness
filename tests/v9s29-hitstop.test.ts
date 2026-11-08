import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld, run } from './helpers';

/**
 * v9s.29 · 命中卡肉（hitstop）。
 *
 * 参考成熟做法（鬼泣 / 怪物猎人 / 只狼）：命中瞬间把攻击方的时间轴按住几十毫秒，
 * 挥到接触点那一帧被「钉住」，打感从「划过去」变成「砍进去」。
 *
 * 关键设计：**卡肉在 Core 里**，不是表现层冻结画面。
 * 只有这样位移（前冲）、进度、连击窗口才会一起停 —— 否则冻结结束会补滑一帧，
 * 而且同输入同帧数的复现性会被破坏。
 */

function soloDummy(dist: number, weapon: 'sword-shield' | 'greatsword' = 'sword-shield'): World {
  const w = makeWorld();
  w.modules.targeting = false;
  w.config.combat.weapons[weapon].lunge = [0, 0, 0];
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].position.x = 12;
    w.dummies[i].position.z = 12;
    w.dummies[i].mode = 'idle';
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.position.x = 0;
  s.position.z = 8 - dist;
  s.velocity.x = 0;
  s.velocity.z = 0;
  (w.combat as any).weapon = weapon;
  // v9s.37：这一组验的是「硬冻结」契约（进度 / 位置逐帧不动）。
  // 瓦片化之后保持期仍有 5% 推进，所以这里显式关掉 —— 同时也就证明了
  // `hitstopWarp.enabled = false` 能精确回到旧行为。
  if (w.config.hits.hitstopWarp) w.config.hits.hitstopWarp.enabled = false;
  return w;
}

/** 起手 → 推进到命中那一帧；返回是否命中。 */
function hitOnce(w: World): boolean {
  run(w, 1, intent({ moveZ: -1, attackPressed: true }));
  for (let i = 0; i < 40; i++) {
    step(w, w.config.fixedDt, intent());
    if (w.events.some((e) => e.type === 'hit')) return true;
  }
  return false;
}

describe('v9s.29 命中卡肉', () => {
  it('命中后进入卡肉：hitstop 计时 > 0，并发出 hitstop 事件', () => {
    const w = soloDummy(1.4);
    expect(hitOnce(w)).toBe(true);
    // 命中在 hitsUpdate 里结算，卡肉从下一帧开始扣
    expect(w.combat.hitstop).toBeGreaterThan(0);
    const cfg = w.config.hits.hitstop;
    expect(w.combat.hitstop).toBeCloseTo(cfg.light, 6);
    expect(w.events.some((e) => e.type === 'hitstop')).toBe(true);
  });

  it('卡肉期间攻击进度与位置都冻结，结束后从原处继续', () => {
    const w = soloDummy(1.4);
    expect(hitOnce(w)).toBe(true);
    const p0 = { x: w.character.position.x, z: w.character.position.z };
    const prog0 = w.combat.attackProgress;

    // 冻结中：每帧只扣计时，进度 / 位置都不动
    let frozenFrames = 0;
    while (w.combat.hitstop > 0) {
      step(w, w.config.fixedDt, intent());
      frozenFrames += 1;
      expect(w.combat.attackProgress).toBeCloseTo(prog0, 9);
      expect(w.character.position.x).toBeCloseTo(p0.x, 9);
      expect(w.character.position.z).toBeCloseTo(p0.z, 9);
      expect(frozenFrames).toBeLessThan(60);
    }
    expect(frozenFrames).toBeGreaterThanOrEqual(2);   // 60fps 下 45ms ≈ 3 帧

    // 冻结结束：进度重新推进
    step(w, w.config.fixedDt, intent());
    expect(w.combat.attackProgress).toBeGreaterThan(prog0);
  });

  it('卡肉时长按受击档位分档：击退 > 重击 > 轻击', () => {
    const cfg = makeWorld().config.hits.hitstop;
    expect(cfg.knock).toBeGreaterThan(cfg.heavy);
    expect(cfg.heavy).toBeGreaterThan(cfg.light);
    expect(cfg.light).toBeGreaterThan(0);
    // 上限守一下：超过 0.2s 会把连击节奏拖断
    expect(cfg.knock).toBeLessThan(0.2);

    // v9s.33：卡肉加了「分武器档位」系数，断言要乘上当前武器的系数
    const gs = soloDummy(1.6, 'greatsword');
    expect(hitOnce(gs)).toBe(true);
    const scale = gs.config.hits.hitstopByWeapon?.greatsword ?? 1;
    expect(gs.combat.hitstop).toBeCloseTo(cfg.knock * scale, 6);
  });

  it('同帧多目标不叠加：取最大值，不会变成慢动作', () => {
    const w = soloDummy(1.4);
    w.dummies[1].mode = 'idle';
    w.dummies[1].position.x = 0.35;
    w.dummies[1].position.z = 8 - 1.35;
    w.dummies[1].velocity.x = 0;
    w.dummies[1].velocity.z = 0;
    expect(hitOnce(w)).toBe(true);
    expect(w.hitCount).toBeGreaterThan(1);
    expect(w.combat.hitstop).toBeCloseTo(w.config.hits.hitstop.light, 6);
  });
});
