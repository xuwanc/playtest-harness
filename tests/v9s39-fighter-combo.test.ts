import { describe, expect, it } from 'vitest';
import { EMPTY_INTENTS, dummiesUpdate, hitsUpdate, step } from '../src/core';
import { makeLabWorld, place } from './helpers';

/**
 * v9s.39 · 持械陪练的连击。
 *
 * 机制一句话：**一次冷却好 = 打一整轮**（段数取武器的 `comboCount`，剑盾 / 双刀 / 大剑都是 3），
 * 段与段之间嵌一段 `settle` 停顿，整轮打完才重新计冷却。
 *
 * 这样拆分是为了守住上一轮的约束「攻击欲望放低」：
 * `attackInterval` 管「多久来一轮」（不变，3.4s），`comboCount` 管「一轮几刀」。
 * 如果让连击也消耗冷却，起手频率会变成 3 倍，站位数秒才压上来的观感就没了。
 */

const LAB = () => makeLabWorld();
const DT = (w: ReturnType<typeof LAB>) => w.config.fixedDt;

/** 把除 keep 之外的单位挪到场地外：不改数组长度（dummy-hit 按 id 找下标）。 */
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

/** 让某个陪练站到玩家面前并立刻具备起手条件（不改 mode 以外的任何 AI 配置）。 */
function arm(w: ReturnType<typeof LAB>, index: number, dist = 1.1) {
  isolate(w, index);
  const s = w.dummies[index];
  place(w, 0, 0);
  s.position.x = 0;
  s.position.z = dist;
  s.homeX = 0;
  s.homeZ = dist;
  s.mode = 'attack';
  s.attackCooldown = 0;
  return s;
}

/** 推进 n 帧并统计本假人的 dummy-attack / dummy-hit 事件（events 每帧清空）。 */
function run(
  w: ReturnType<typeof LAB>,
  id: number,
  frames: number,
  onFrame?: (i: number) => void,
): { attacks: number; hits: number } {
  let attacks = 0;
  let hits = 0;
  for (let i = 0; i < frames; i++) {
    step(w, DT(w), EMPTY_INTENTS);
    for (const e of w.events) {
      if (e.value !== id) continue;
      if (e.type === 'dummy-attack') attacks += 1;
      else if (e.type === 'dummy-hit') hits += 1;
    }
    onFrame?.(i);
  }
  return { attacks, hits };
}

describe('v9s.39 陪练连击：一轮 = 武器的 comboCount 段', () => {
  it('起手一次就把整轮排好：剑盾 3 段，起手时已排剩余 2 段', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    dummiesUpdate(w, DT(w), EMPTY_INTENTS);
    expect(s.attackPhase).toBe('windup');
    expect(s.attackComboIndex).toBe(1);
    expect(s.attackComboLeft).toBe(2);
    // 冷却在**整轮起手时**就记满：连击不额外吃冷却，起手频率与单发时一致
    expect(s.attackCooldown).toBeCloseTo(w.config.dummies.fighters!.attackInterval, 6);
  });

  it('三段真的打出来：段号 1 → 2 → 3，共 3 次出招 / 3 次命中段', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    // 不让玩家被推走，否则距离变化会干扰「能否接下一段」的判定（击退另有专项）
    w.config.hits.noDamageToPlayer = true;
    const segs: number[] = [];
    const { attacks, hits } = run(w, s.id, 190, () => {
      const last = w.events.find((e) => e.type === 'dummy-attack' && e.value === s.id);
      if (last) segs.push(s.attackComboIndex);
    });
    // 190 帧 ≈ 3.17s：一轮（约 1.7s）打完但还没到下一轮（3.4s）
    expect(attacks).toBe(3);
    expect(hits).toBe(3);
    expect(segs).toEqual([1, 2, 3]);
    expect(s.attackComboLeft).toBe(0);
    expect(w.dummyAttackCount).toBe(3);
  });

  it('段与段之间有 settle 缝隙：读作「一刀收住再一刀」，不是无停顿连划', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    w.config.hits.noDamageToPlayer = true;
    let sawGap = false;
    let gapPhase = '';
    let gapProgress = -1;
    const startFrames: number[] = [];
    run(w, s.id, 190, (i) => {
      if (w.events.some((e) => e.type === 'dummy-attack' && e.value === s.id)) startFrames.push(i);
      if (!sawGap && s.attackPhase === 'idle' && s.comboGap > 0) {
        sawGap = true;
        gapPhase = s.combat!.phase;
        gapProgress = s.combat!.attackProgress;
      }
    });
    expect(sawGap).toBe(true);
    // 缝隙期间表现层收到的是 settle + progress 1 → rig 保持收势，不会把手放下再抬起
    expect(gapPhase).toBe('settle');
    expect(gapProgress).toBe(1);
    // 段间隔 = 一段动作（0.46s）+ 缝隙（0.16s）≈ 37 帧；比单段明显长，说明停顿真的存在
    expect(startFrames).toHaveLength(3);
    const gapFrames = startFrames[1] - startFrames[0];
    expect(gapFrames).toBeGreaterThanOrEqual(30);
    expect(gapFrames).toBeLessThanOrEqual(48);
  });

  it('comboCount = 1 退回单发（与 v9s.38 行为一致）', () => {
    const w = LAB();
    w.config.dummies.fighters!.comboCount = 1;
    const s = arm(w, w.config.dummies.count);
    w.config.hits.noDamageToPlayer = true;
    let firstLeft = -1;
    const { attacks } = run(w, s.id, 60, () => {
      if (firstLeft < 0 && s.attackPhase !== 'idle') firstLeft = s.attackComboLeft;
    });
    expect(firstLeft).toBe(0);
    expect(attacks).toBe(1);
  });

  it('大剑同样是 3 段，但每一段都用自己的时序（0.16/0.18/0.36）', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count + 2, 1.7);
    dummiesUpdate(w, DT(w), EMPTY_INTENTS);
    expect(s.attackComboLeft).toBe(2);
    expect(s.combat!.timings.windup).toBeCloseTo(0.16, 6);
    expect(s.combat!.timings.active).toBeCloseTo(0.18, 6);
    expect(s.combat!.timings.recovery).toBeCloseTo(0.36, 6);
  });
});

describe('v9s.39 陪练连击：打断与节奏', () => {
  it('玩家跑出连击追距 → 断连：剩余段作废，并补回一个冷却', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    w.config.hits.noDamageToPlayer = true;
    step(w, DT(w), EMPTY_INTENTS);
    expect(s.attackPhase).toBe('windup');
    // 第一段还在起手时把玩家瞬移到 12m 外
    place(w, 0, 12);
    const { attacks } = run(w, s.id, 60);
    expect(attacks).toBe(0);                       // 没有接出第二段
    expect(s.attackComboLeft).toBe(0);
    expect(s.attackComboIndex).toBe(0);
    expect(s.attackCooldown).toBeGreaterThan(0);   // 补回的冷却，不是「打空立刻重开」
    expect(s.attackPhase).toBe('idle');
  });

  it('受击打断连击：已经挥出去的那一刀照常播完，但不再接下一段', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    w.config.hits.noDamageToPlayer = true;
    step(w, DT(w), EMPTY_INTENTS);
    expect(s.attackComboLeft).toBe(2);
    s.hurt.timer = 0.3;
    s.hurt.duration = 0.3;
    const { attacks } = run(w, s.id, 150);
    expect(attacks).toBe(0);
    expect(s.attackComboLeft).toBe(0);
    expect(s.attackComboIndex).toBe(0);
  });

  it('起手频率不因连击提高：12s 内仍是 3~4 轮，而不是 3 倍', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    w.config.hits.noDamageToPlayer = true;
    let rounds = 0;
    let segments = 0;
    run(w, s.id, 720, () => {
      for (const e of w.events) {
        if (e.type !== 'dummy-attack' || e.value !== s.id) continue;
        segments += 1;
        if (s.attackComboIndex === 1) rounds += 1;
      }
    });
    // 12s / 3.4s ≈ 3.5 → 4 轮上限；单发时是 3~4 次出手
    expect(rounds).toBeGreaterThanOrEqual(3);
    expect(rounds).toBeLessThanOrEqual(4);
    // 但总段数是轮数的 3 倍 —— 密度提高在「一轮之内」
    expect(segments).toBeGreaterThanOrEqual(rounds * 2);
  });

  it('reset 与点击轮转都会清掉连击状态', () => {
    const w = LAB();
    const s = arm(w, w.config.dummies.count);
    dummiesUpdate(w, DT(w), EMPTY_INTENTS);
    expect(s.attackComboIndex).toBe(1);
    // 点击轮转（同一帧）→ 段号 / 剩余段 / 缝隙全清
    dummiesUpdate(w, DT(w), { ...EMPTY_INTENTS, dummyClickId: s.id });
    expect(s.attackComboIndex).toBe(0);
    expect(s.attackComboLeft).toBe(0);
    expect(s.comboGap).toBe(0);
  });
});

describe('v9s.39 陪练连击：命中档位按段', () => {
  it('大剑只有最后一段是 knock，前两段是 light', () => {
    const w = LAB();
    const s = w.dummies[w.config.dummies.count + 2];
    isolate(w, w.config.dummies.count + 2);
    place(w, 0, 0);
    s.position.x = 0;
    s.position.z = 1.5;
    w.config.hits.noDamageToPlayer = false;

    s.attackComboLeft = 1;   // 本轮还有一段没打 → 当前不是最后一段
    w.events.push({ type: 'dummy-hit', tick: w.tick, x: 0, y: 0, z: 1.5, value: s.id });
    hitsUpdate(w, DT(w));
    expect(w.playerHurt.type).toBe('light');

    s.attackComboLeft = 0;   // 最后一段
    w.events.push({ type: 'dummy-hit', tick: w.tick, x: 0, y: 0, z: 1.5, value: s.id });
    hitsUpdate(w, DT(w));
    expect(w.playerHurt.type).toBe('knock');
    expect(w.playerHurt.duration).toBeCloseTo(w.config.hits.hurtKnock, 6);
  });

  it('剑盾 / 双刀 不因为连击变成重击（一直是 light）', () => {
    const w = LAB();
    const s = w.dummies[w.config.dummies.count];
    isolate(w, w.config.dummies.count);
    place(w, 0, 0);
    s.position.x = 0;
    s.position.z = 1.2;
    s.attackComboLeft = 0;   // 就算是最后一段
    w.events.push({ type: 'dummy-hit', tick: w.tick, x: 0, y: 0, z: 1.2, value: s.id });
    hitsUpdate(w, DT(w));
    expect(w.playerHurt.type).toBe('light');
  });
});
