import { describe, expect, it } from 'vitest';
import { applyHit, decideSever, step } from '../src/core';
import type { HurtType, SeverPart, World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.60 · 断肢判定。
 *
 * 判定是**纯函数**（`decideSever`），所以大部分用例不世界、直接查表：
 * 「这个受击类型 + 这个高度 → 断哪」必须能一眼读出来，不能靠跑一遍动画才知道。
 * 最后两条走 `applyHit`，确认判定真的接到了唯一的伤害出口上。
 */

function arm(w: World, index: number, hp: number): void {
  const h = w.dummies[index].health;
  h.maxHp = hp;
  h.hp = hp;
  h.dead = false;
  h.deadT = 0;
  h.respawn = 0;
  h.revive = 0;
}

function hit(
  w: World, index: number, type: HurtType, hitU?: number, dirX = 0, dirZ = 1,
): void {
  applyHit(w, { kind: 'dummy', index }, {
    type, duration: 0.2, dirX, dirZ, knockback: 0, hitU: hitU ?? undefined,
  });
}

describe('v9s.60 · 断肢规则表（纯函数）', () => {
  it('轻击只削手臂：够到臂高才断，低处留全尸', () => {
    // 剑盾轻击的部位是 0.60 → 必断
    expect(decideSever('light', 0.60, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('armR');
    // 低处（扫到小腿）只造成伤害，不肢解
    expect(decideSever('light', 0.30, 0, 1, 0, 'sword-shield')).toBeNull();
  });

  it('重击：高位劈头、胸肩断臂、再低腰斩', () => {
    expect(decideSever('heavy', 0.84, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('head');
    expect(decideSever('heavy', 0.60, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('armR');
    expect(decideSever('heavy', 0.40, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('waist');
  });

  it('击飞：高位断头、中位腰斩、贴地断腿（击地 hitU 0.26 走这条）', () => {
    expect(decideSever('knock', 0.80, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('head');
    expect(decideSever('knock', 0.46, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('waist');
    expect(decideSever('knock', 0.26, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('legR');
  });

  it('大剑刃更长：同一高度比剑盾更容易够到高位（0.78 的重击只有大剑能劈头）', () => {
    expect(decideSever('heavy', 0.78, 0, 1, 0, 'sword-shield')).toBe<SeverPart>('armR');
    expect(decideSever('heavy', 0.78, 0, 1, 0, 'greatsword')).toBe<SeverPart>('head');
  });

  it('左右由攻击方向相对身体的右向分量决定（同一刀从另一侧来断另一条腿）', () => {
    // bodyYaw = 0（面向 +Z）时，右向 = +X：从 +X 侧砍 → 右肢
    expect(decideSever('knock', 0.20, 1, 0, 0, 'sword-shield')).toBe<SeverPart>('legR');
    expect(decideSever('knock', 0.20, -1, 0, 0, 'sword-shield')).toBe<SeverPart>('legL');
    // 身体转 90°（面向 +X）后右向变成 -Z：同样从 +X 来的一击落在正前方（side=0 → 右肢），
    // 而从 +Z 来的一击落在身体右侧 = 视觉上的 -Z 侧 → 左肢
    expect(decideSever('knock', 0.20, 1, 0, Math.PI / 2, 'sword-shield')).toBe<SeverPart>('legR');
    expect(decideSever('knock', 0.20, 0, 1, Math.PI / 2, 'sword-shield')).toBe<SeverPart>('legL');
  });

  it('判定确定：同输入 200 次完全一致（没有随机肢解）', () => {
    const first = decideSever('heavy', 0.61, 0.3, 0.95, 1.1, 'greatsword');
    for (let i = 0; i < 200; i++) {
      expect(decideSever('heavy', 0.61, 0.3, 0.95, 1.1, 'greatsword')).toBe(first);
    }
  });

  it('未命中类型一律不断（none 不会把尸体切成两半）', () => {
    expect(decideSever('none', 0.9, 0, 1, 0, 'greatsword')).toBeNull();
  });
});

describe('v9s.60 · 断肢接到伤害出口', () => {
  it('致命一击写入 sever（含部位 / 断口高度 / 击打方向 / 力度），非致命不写', () => {
    const w = makeWorld();
    arm(w, 0, 100);
    // 第一刀不致命：sever 必须还是 null
    hit(w, 0, 'light', 0.60);
    expect(w.dummies[0].health.dead).toBe(false);
    expect(w.dummies[0].health.sever).toBeNull();

    // 一直打到死：最后一刀是 knock（击飞），部位 0.46 → 腰斩
    for (let i = 0; i < 40 && !w.dummies[0].health.dead; i++) hit(w, 0, 'knock', 0.46);
    const sev = w.dummies[0].health.sever;
    expect(sev).not.toBeNull();
    expect(sev!.part).toBe<SeverPart>('waist');
    // 断口高度就是这一击的命中部位（显式给了 0.46，不是配置表的默认值）
    expect(sev!.u).toBeCloseTo(0.46, 6);
    expect(sev!.power).toBeGreaterThan(0.3);
  });

  it('复活清空断肢：从地里升起来的是完整的人', () => {
    const w = makeWorld();
    arm(w, 0, 30);
    for (let i = 0; i < 40 && !w.dummies[0].health.dead; i++) hit(w, 0, 'knock', 0.46);
    expect(w.dummies[0].health.sever).not.toBeNull();
    // 重生延迟由 Core 计时：用 step 推进（applyHit 只结算命中，不推进时间）
    expect(w.dummies[0].health.respawn).toBeGreaterThan(0);
    for (let i = 0; i < 1200 && w.dummies[0].health.dead; i++) step(w, 1 / 60, intent());
    expect(w.dummies[0].health.dead).toBe(false);
    expect(w.dummies[0].health.sever).toBeNull();
  });
});
