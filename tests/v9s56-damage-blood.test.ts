import { describe, expect, it } from 'vitest';
import { applyHit, HIT_MARK_CAP, resetWorld, REVIVE_GUARD, step } from '../src/core';
import type { HurtType, World } from '../src/core';
import { intent, makeLabWorld, makeWorld, place } from './helpers';

/**
 * v9s.56 · 伤害 / 血量 / 死亡 / 重生 / 命中记录。
 *
 * 两个入口分清楚：
 *  - `makeWorld()` 是冻结夹具（4 个普通假人，`health: 0` = 打不死的测试桩）；
 *  - `makeLabWorld()` 是线上配置（3 个陪练，`fighters.health: 120`）。
 *
 * 大部分用例用前者 + 手动给血量：位置固定、没有 AI 走位干扰，断言才稳定。
 */

/** 给某个假人开血量（模拟「这个单位是可被击杀的对手」）。 */
function arm(w: World, index: number, hp: number): void {
  const h = w.dummies[index].health;
  h.maxHp = hp;
  h.hp = hp;
  h.dead = false;
  h.deadT = 0;
  h.respawn = 0;
  h.revive = 0;
}

function hit(w: World, index: number, type: HurtType = 'light'): void {
  applyHit(w, { kind: 'dummy', index }, {
    type, duration: 0.2, dirX: 0, dirZ: 1, knockback: 0,
  });
}

function kill(w: World, index: number): void {
  for (let i = 0; i < 200 && !w.dummies[index].health.dead; i++) hit(w, index, 'knock');
}

describe('v9s.56 伤害与血量', () => {
  it('配置契约：普通假人 0 血（打不死），陪练有血量与重生时间', () => {
    const w = makeLabWorld();
    expect(w.config.dummies.health).toBe(0);
    expect(w.config.dummies.fighters?.health).toBe(120);
    expect(w.config.dummies.fighters?.respawnSec).toBeGreaterThan(0);

    const fighters = w.dummies.filter((d) => d.weapon);
    expect(fighters.length).toBe(3);
    for (const f of fighters) {
      expect(f.health.maxHp).toBe(120);
      expect(f.health.hp).toBe(120);
      expect(f.health.dead).toBe(false);
      expect(f.health.kills).toBe(0);
    }
    // 普通假人**默认**血量 0 —— 它们是测试桩，被打死会让「测距离 / 测 AI」的工位失效。
    // v9s.63 起单只可以自带血量（鱼人有血条，否则看不到断头），所以按配置逐只核对：
    // 「没声明 health 的才必须是 0」。
    for (let i = 0; i < w.dummies.length; i++) {
      const d = w.dummies[i];
      if (d.weapon) continue;
      const own = w.config.dummies.spawn[i]?.health;
      if (own !== undefined) {
        expect(d.health.maxHp).toBe(own);
        continue;
      }
      expect(d.health.maxHp).toBe(0);
    }
  });

  it('木桩（maxHp 0）砍多少下都不死，也不喷血', () => {
    const w = makeWorld();
    const d = w.dummies[0];
    for (let i = 0; i < 40; i++) hit(w, 0, 'knock');
    expect(d.health.dead).toBe(false);
    expect(d.health.hp).toBe(0);
    expect(w.hitCount).toBe(40);
    // 关键：卡肉 / 命中计数照旧，但「木桩出血」会读错 —— 命中记录不该有它
    expect(w.hitMarks.length).toBe(0);
  });

  it('陪练按受击类型扣血（剑盾 light = 12）', () => {
    const w = makeLabWorld();
    const i = w.dummies.findIndex((d) => d.weapon === 'sword-shield');
    const f = w.dummies[i];
    w.combat.weapon = 'sword-shield';
    hit(w, i, 'light');
    expect(f.health.hp).toBe(108);
    hit(w, i, 'heavy');
    expect(f.health.hp).toBe(90);
  });

  it('分武器伤害倍率：同一记 knock，大剑比剑盾重得多', () => {
    const w = makeLabWorld();
    const i = w.dummies.findIndex((d) => d.weapon === 'sword-shield');
    const f = w.dummies[i];
    // 剑盾 knock：26 × 1.0
    w.combat.weapon = 'sword-shield';
    hit(w, i, 'knock');
    expect(f.health.hp).toBeCloseTo(120 - 26, 5);
    // 大剑 knock：26 × 1.4 = 36.4
    arm(w, i, 120);
    w.combat.weapon = 'greatsword';
    hit(w, i, 'knock');
    expect(f.health.hp).toBeCloseTo(120 - 36.4, 5);
  });

  it('血量归零 → 死亡：发事件、清空连击、记击杀数', () => {
    const w = makeWorld();
    arm(w, 0, 30);
    const d = w.dummies[0];
    d.attackPhase = 'active';
    d.attackComboLeft = 2;
    d.comboGap = 0.12;

    hit(w, 0, 'light');   // 12 → 剩 18
    expect(d.health.dead).toBe(false);
    hit(w, 0, 'light');   // 6
    hit(w, 0, 'light');   // 0 → 死
    expect(d.health.dead).toBe(true);
    expect(d.health.hp).toBe(0);
    expect(d.health.kills).toBe(1);
    expect(d.attackPhase).toBe('idle');
    expect(d.attackComboLeft).toBe(0);
    expect(w.events.some((e) => e.type === 'dummy-death' && e.value === d.id)).toBe(true);
  });

  it('死后不再结算命中：不涨 hitCount、不出血、不卡肉', () => {
    const w = makeWorld();
    arm(w, 0, 12);
    hit(w, 0, 'light');
    expect(w.dummies[0].health.dead).toBe(true);
    const hits = w.hitCount;
    const marks = w.hitMarks.length;
    w.combat.hitstop = 0;
    hit(w, 0, 'knock');
    expect(w.hitCount).toBe(hits);
    expect(w.hitMarks.length).toBe(marks);
    expect(w.combat.hitstop).toBe(0);
  });

  it('死后 AI 冻结：60 帧原地不动、不出手', () => {
    const w = makeWorld();
    arm(w, 0, 12);
    kill(w, 0);
    const d = w.dummies[0];
    const x = d.position.x;
    const z = d.position.z;
    const attacks = w.dummyAttackCount;
    for (let i = 0; i < 60; i++) step(w, w.config.fixedDt, intent({}));
    expect(d.position.x).toBe(x);
    expect(d.position.z).toBe(z);
    expect(w.dummyAttackCount).toBe(attacks);
    expect(d.attackPhase).toBe('idle');
  });

  it('索敌与分离都跳过尸体', () => {
    const w = makeWorld();
    arm(w, 0, 12);
    kill(w, 0);
    const d = w.dummies[0];
    // 把玩家直接放到尸体身上：如果分离还推它，位置会变
    place(w, d.position.x, d.position.z);
    const x = d.position.x;
    const z = d.position.z;
    step(w, w.config.fixedDt, intent({}));
    expect(d.position.x).toBeCloseTo(x, 6);
    expect(d.position.z).toBeCloseTo(z, 6);
    // 另外 3 个假人还在 7m 内，可能被锁上 —— 关键是**别锁尸体**
    expect(w.targeting.targetId).not.toBe(d.id);
  });

  it('到点满血重生，并留一记复活事件', () => {
    const w = makeWorld();
    arm(w, 0, 12);
    kill(w, 0);
    const d = w.dummies[0];
    const sec = w.config.dummies.respawnSec ?? 3;
    expect(d.health.respawn).toBeCloseTo(sec, 5);
    const frames = Math.ceil(sec / w.config.fixedDt) + 2;
    let revived = false;
    for (let i = 0; i < frames; i++) {
      step(w, w.config.fixedDt, intent({}));
      if (!d.health.dead && !revived) {
        revived = true;
        expect(w.events.some((e) => e.type === 'dummy-revive' && e.value === d.id)).toBe(true);
      }
    }
    expect(revived).toBe(true);
    expect(d.health.hp).toBe(d.health.maxHp);
    expect(d.health.dead).toBe(false);
    expect(d.health.deadT).toBe(0);
    expect(d.health.revive).toBeGreaterThan(0);
  });

  it('复活保护：刷出来那一瞬间砍不动，保护走完才吃伤害', () => {
    const w = makeWorld();
    arm(w, 0, 12);
    kill(w, 0);
    const d = w.dummies[0];
    d.health.dead = false;
    d.health.hp = d.health.maxHp;
    d.health.respawn = 0;
    d.health.revive = REVIVE_GUARD;
    hit(w, 0, 'knock');
    expect(d.health.hp).toBe(d.health.maxHp);
    // 保护期走完（用 step 推进真实计时，而不是手改字段）
    for (let i = 0; i < Math.ceil(REVIVE_GUARD / w.config.fixedDt) + 1; i++) {
      step(w, w.config.fixedDt, intent({}));
    }
    expect(d.health.revive).toBe(0);
    hit(w, 0, 'knock');
    expect(d.health.hp).toBeLessThan(d.health.maxHp);
  });

  it('复位：血量 / 死亡 / 击杀数全部还原', () => {
    const w = makeWorld();
    arm(w, 0, 12);
    kill(w, 0);
    expect(w.dummies[0].health.kills).toBe(1);
    resetWorld(w);
    const h = w.dummies[0].health;
    expect(h.dead).toBe(false);
    expect(h.hp).toBe(h.maxHp);
    expect(h.deadT).toBe(0);
    expect(h.respawn).toBe(0);
    expect(h.kills).toBe(0);
  });
});

describe('v9s.56 命中记录（飙血数据源）', () => {
  it('位置抬到胸腹高度、方向与力度随伤害走、致命标记', () => {
    const w = makeWorld();
    arm(w, 0, 200);
    const d = w.dummies[0];
    applyHit(w, { kind: 'dummy', index: 0 }, {
      type: 'knock', duration: 0.2, dirX: 0.6, dirZ: 0.8, knockback: 0,
    });
    expect(w.hitMarks.length).toBe(1);
    const m = w.hitMarks[0];
    expect(m.id).toBe(d.id);
    // v9s.57 起部位由 `hits.hitHeight[type]` 决定，y = 身高 × u（不再是写死的 0.46）
    expect(m.u).toBeCloseTo(w.config.hits.hitHeight!.knock, 6);
    expect(m.y).toBeCloseTo(d.position.y + w.config.dummies.height * m.u, 5);
    expect(m.dx).toBeCloseTo(0.6, 5);
    expect(m.dz).toBeCloseTo(0.8, 5);
    expect(m.power).toBeGreaterThan(0.3);
    expect(m.fatal).toBe(false);

    // 打死那一下要标 fatal（表现层据此喷得更凶）
    arm(w, 0, 12);
    applyHit(w, { kind: 'dummy', index: 0 }, {
      type: 'knock', duration: 0.2, dirX: 0, dirZ: 1, knockback: 0,
    });
    expect(w.hitMarks[w.hitMarks.length - 1].fatal).toBe(true);
  });

  it('seq 单调递增，环形只留最近 HIT_MARK_CAP 条', () => {
    const w = makeWorld();
    arm(w, 0, 100000);
    for (let i = 0; i < HIT_MARK_CAP + 12; i++) hit(w, 0, 'light');
    expect(w.hitMarks.length).toBe(HIT_MARK_CAP);
    const seqs = w.hitMarks.map((m) => m.seq);
    expect(seqs).toEqual([...seqs].sort((a, b) => a - b));
    expect(new Set(seqs).size).toBe(seqs.length);
    expect(w.hitMarkSeq).toBe(HIT_MARK_CAP + 12);
  });

  it('复位清空记录但保留 seq（表现层靠它去重，归零会吞掉复位后的第一下）', () => {
    const w = makeWorld();
    arm(w, 0, 100);
    for (let i = 0; i < 5; i++) hit(w, 0, 'light');
    const seq = w.hitMarkSeq;
    expect(seq).toBe(5);
    resetWorld(w);
    expect(w.hitMarks.length).toBe(0);
    expect(w.hitMarkSeq).toBe(seq);
  });
});

describe('v9s.56 端到端：贴脸连砍 → 倒地 → 自动刷回来', () => {
  it('线上陪练真的会被打死，也真的会自己站起来', () => {
    const w = makeLabWorld();
    const i = w.dummies.findIndex((d) => d.weapon === 'sword-shield');
    const f = w.dummies[i];
    f.mode = 'idle';
    const dt = w.config.fixedDt;

    let dead = false;
    for (let tick = 0; tick < 900 && !dead; tick++) {
      // 每帧贴住正前方 1.1m（陪练会走位、玩家攻击有前冲，不贴住就打空）
      place(w, f.position.x, f.position.z - 1.1);
      w.character.facing = 0;
      step(w, dt, intent({ attackPressed: tick % 26 === 0 }));
      dead = f.health.dead;
    }
    expect(dead).toBe(true);
    expect(f.health.kills).toBe(1);
    // 这一路砍下来必须有血：命中记录里至少有一记致命
    expect(w.hitMarks.some((m) => m.fatal)).toBe(true);

    // 等它刷回来（多给 1s 余量）
    const sec = w.config.dummies.fighters?.respawnSec ?? 3.5;
    for (let t = 0; t < Math.ceil((sec + 1) / dt); t++) step(w, dt, intent({}));
    expect(f.health.dead).toBe(false);
    expect(f.health.hp).toBe(f.health.maxHp);
    expect(f.health.kills).toBe(1);
  });
});
