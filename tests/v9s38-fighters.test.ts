import { describe, expect, it } from 'vitest';
import {
  EMPTY_INTENTS, cycleDummyMode, dummiesUpdate, hitsUpdate, snapshot, step,
} from '../src/core';
import { makeLabWorld, makeWorld, place } from './helpers';

/**
 * v9s.38 · 三个持械陪练角色（剑盾 / 双刀 / 大剑）。
 *
 * 它们不是新实体：就是「带武器的假人」，追加在普通假人之后（id 连续）。
 * 因此这里只需要验证三件事：
 *  1. 配置装配正确（武器 / id / combat 时间轴 / 默认 spar）；
 *  2. AI 用**武器自己的时序**出招，且攻击欲望比普通假人低；
 *  3. 双向命中都成立 —— 玩家打得到它们、它们打得到玩家（默认击退）。
 */

const LAB = () => makeLabWorld();

/** 把除 keep 之外的单位挪到场地外：不改变数组长度（dummy-hit 按 id 找下标）。 */
function isolate(w: ReturnType<typeof LAB>, keep: number): void {
  for (let i = 0; i < w.dummies.length; i++) {
    if (i === keep) continue;
    const s = w.dummies[i];
    s.position.x = 40 + i;
    s.position.z = 40 + i;
    s.velocity.x = 0;
    s.velocity.z = 0;
    s.mode = 'idle';
  }
}

describe('v9s.38 持械陪练：装配', () => {
  it('普通假人 + 3 个陪练，id 连续，武器与配置一一对应', () => {
    const w = LAB();
    const f = w.config.dummies.fighters!;
    expect(w.dummies).toHaveLength(w.config.dummies.count + f.weapons.length);
    const fighters = w.dummies.slice(w.config.dummies.count);
    // 不写死 7/8/9：工位数量会随场景增减（v9s.63 加了鱼人滩），
    // 这里要断言的是「紧跟普通假人之后、连续」，不是某个具体数字。
    const base = w.config.dummies.count;
    expect(fighters.map((s) => s.id)).toEqual([base + 1, base + 2, base + 3]);
    expect(fighters.map((s) => s.weapon)).toEqual(['sword-shield', 'dual-swords', 'greatsword']);
    expect(fighters.map((s) => s.mode)).toEqual(['spar', 'spar', 'spar']);
    // combat 时间轴已装配好，且武器与 weapon 字段一致
    for (const s of fighters) {
      expect(s.combat).not.toBeNull();
      expect(s.combat!.weapon).toBe(s.weapon);
      expect(s.combat!.phase).toBe('idle');
    }
    // 普通假人没有武器 / 没有战斗时间轴（仍走 dummy-rig 的简化挥砍）
    for (const s of w.dummies.slice(0, w.config.dummies.count)) {
      expect(s.weapon).toBeNull();
      expect(s.combat).toBeNull();
    }
  });

  it('点击循环：陪练以 spar（陪练）为起点，普通假人维持原顺序', () => {
    expect(cycleDummyMode('spar', true)).toBe('wander');
    expect(cycleDummyMode('idle', true)).toBe('spar');
    expect(cycleDummyMode('wander', false)).toBe('follow');
    expect(cycleDummyMode('idle', false)).toBe('wander');

    const w = LAB();
    const id = w.config.dummies.count + 1;
    step(w, w.config.fixedDt, { ...EMPTY_INTENTS, dummyClickId: id });
    expect(w.dummies[id - 1].mode).toBe('wander');
  });
});

describe('v9s.38 持械陪练：AI 用武器时序、攻击欲望更低', () => {
  it('挥砍时长取武器配置（剑盾），不是假人的 0.34/0.18/0.4', () => {
    const w = LAB();
    const s = w.dummies[w.config.dummies.count];
    // 站远一点，避免真实命中触发额外状态；mode=idle 只推进挥砍状态机
    s.mode = 'idle';
    s.attackPhase = 'windup';
    s.attackPhaseTimer = 0;
    dummiesUpdate(w, w.config.fixedDt, EMPTY_INTENTS);
    // 直接读配置：v9s.55 把剑盾时序从 0.09/0.13/0.24 调成 0.11/0.12/0.27，
    // 起手多给两帧让「举剑蓄势」看得见；这里钉的是「取的是武器配置」，
    // 具体数值由数据自己维护（硬编码会在每次调手感时失效）。
    const ws = w.config.combat.weapons['sword-shield'];
    expect(s.combat!.timings.windup).toBeCloseTo(ws.windup, 6);
    expect(s.combat!.timings.active).toBeCloseTo(ws.active, 6);
    expect(s.combat!.timings.recovery).toBeCloseTo(ws.recovery, 6);
    expect(s.combat!.phase).toBe('windup');

    // 已推进 1 帧；继续推到刚好越过 windup 那一帧，再确认进入 active
    const frames = Math.max(1, Math.floor(ws.windup / w.config.fixedDt));
    for (let i = 1; i < frames; i++) dummiesUpdate(w, w.config.fixedDt, EMPTY_INTENTS);
    expect(s.attackPhase).toBe('windup');
    dummiesUpdate(w, w.config.fixedDt, EMPTY_INTENTS);
    expect(s.attackPhase).toBe('active');
    expect(s.combat!.phase).toBe('active');
    expect(s.combat!.attackProgress).toBeCloseTo(s.attackProgress, 9);
  });

  it('攻击间隔取 fighters.attackInterval（3.4s），普通假人仍是 1.6s', () => {
    const w = LAB();
    const idx = w.config.dummies.count;
    const s = w.dummies[idx];
    place(w, s.position.x, s.position.z + 1.0);
    s.mode = 'attack';
    s.attackCooldown = 0;
    dummiesUpdate(w, w.config.fixedDt, EMPTY_INTENTS);
    expect(s.attackPhase).toBe('windup');
    expect(s.attackCooldown).toBeCloseTo(w.config.dummies.fighters!.attackInterval, 6);
    expect(w.config.dummies.fighters!.attackInterval).toBeGreaterThan(w.config.dummies.attackInterval);
  });

  it('spar 会自己走到「刀砍得到」的距离内，而不是原地站桩', () => {
    const w = LAB();
    const s = w.dummies[w.config.dummies.count + 2]; // 大剑（reach 2.0）
    const f = w.config.dummies.fighters!;
    s.position.x = 0;
    s.position.z = 8;
    s.homeX = 0;
    s.homeZ = 8;
    place(w, 0, 0);
    const d0 = Math.hypot(s.position.x, s.position.z);
    for (let i = 0; i < 240; i++) step(w, w.config.fixedDt, EMPTY_INTENTS);
    const d1 = Math.hypot(s.position.x - w.character.position.x, s.position.z - w.character.position.z);
    const band = w.config.hits.reach['greatsword'] * f.attackRangeScale;
    expect(d1).toBeLessThan(d0 - 2);          // 真的压上来了
    expect(d1).toBeGreaterThan(band * 0.35);   // 但没有贴脸
  });
});

describe('v9s.38 持械陪练：双向命中', () => {
  it('玩家打得到陪练：命中写受击 + 击退，且计入 hitCount', () => {
    const w = LAB();
    const idx = w.config.dummies.count;
    const s = w.dummies[idx];
    // 其它单位挪到场地外，避免同一刀打中多个目标（不改数组长度：dummy-hit 用 id 找下标）
    isolate(w, idx);
    s.mode = 'idle';
    s.position.x = 0;
    s.position.z = -1.0;
    s.homeX = 0;
    s.homeZ = -1;
    place(w, 0, 0);
    w.character.facing = 0;
    w.character.bodyYaw = 0;
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    w.combat.comboIndex = 1;
    w.combat.attackFacing = Math.PI;      // 面向 -Z（陪练所在方向）
    w.combat.phaseTimer = 0.05;
    w.combat.timings = { windup: 0.3, active: 0.35, recovery: 0.5, settle: 0, lunge: 0 };
    // 本用例只验「命中归属」，刃身扫掠门由 v9s.36 专项覆盖
    delete w.config.combat.weapons.greatsword.hitSweep;
    const before = w.hitCount;
    hitsUpdate(w, w.config.fixedDt);
    expect(w.hitCount).toBe(before + 1);
    expect(s.hurt.type).toBe('knock');
    expect(Math.hypot(s.hurt.knockX, s.hurt.knockZ)).toBeGreaterThan(0);
  });

  it('陪练打得到玩家：默认（noDamageToPlayer=false）玩家被推走', () => {
    const w = LAB();
    const idx = w.config.dummies.count;
    const s = w.dummies[idx];
    isolate(w, idx);
    s.mode = 'attack';
    s.attackCooldown = 0;
    s.position.x = 0;
    s.position.z = 1.2;
    s.homeX = 0;
    s.homeZ = 1.2;
    place(w, 0, 0);
    w.config.hits.noDamageToPlayer = false;
    const z0 = w.character.position.z;
    let hurt = 0;
    for (let i = 0; i < 40; i++) {
      step(w, w.config.fixedDt, EMPTY_INTENTS);
      if (w.playerHurt.type === 'light') hurt += 1;
    }
    expect(hurt).toBeGreaterThan(0);
    // 从 +Z 打过来 → 玩家朝 -Z 退
    expect(w.character.position.z).toBeLessThan(z0 - 0.02);
  });

  it('大剑陪练按 knock 档命中（受击时长取 hurtKnock）', () => {
    const w = LAB();
    const s = w.dummies[w.config.dummies.count + 2];
    isolate(w, w.config.dummies.count + 2);
    s.position.x = 0;
    s.position.z = 1.6;
    place(w, 0, 0);
    w.config.hits.noDamageToPlayer = false;
    // 直接发一条命中事件：验证 dummyHits 的档位映射，不依赖 AI 起手
    w.events.push({ type: 'dummy-hit', tick: w.tick, x: 0, y: 0, z: 1.6, value: s.id });
    hitsUpdate(w, w.config.fixedDt);
    expect(w.playerHurt.type).toBe('knock');
    expect(w.playerHurt.duration).toBeCloseTo(w.config.hits.hurtKnock, 6);
  });
});

describe('v9s.38 确定性', () => {
  it('陪练加入后，快照仍可无损往返（combat 是 plain data）', () => {
    const w = LAB();
    for (let i = 0; i < 90; i++) step(w, w.config.fixedDt, EMPTY_INTENTS);
    const a = snapshot(w);
    expect(JSON.parse(a).dummies.length).toBe(w.dummies.length);
    const fighterJson = JSON.parse(a).dummies[w.config.dummies.count];
    expect(fighterJson.weapon).toBe('sword-shield');
    expect(typeof fighterJson.combat.attackProgress).toBe('number');
  });
});
