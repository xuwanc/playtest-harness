import type { DummyHealth, DummyState, HitMark, World } from './types';

const EPS = 1e-6;

/**
 * v9s.56 · 生命值 / 死亡 / 重生。
 *
 * 与 `hits.ts`（结算）、`dummies.ts`（AI）分开放：两者都要读写这份状态，
 * 谁 import 谁都成环。这里只依赖类型，方向单一。
 *
 * 三条设计约束：
 *
 * 1. **`maxHp = 0` 表示不参与死亡**。普通假人是测试桩（量距离 / 测 AI 行为），
 *    被打死会让工位失效；陪练才是对手。夹具（`fighters: undefined` + `health: 0`）
 *    因此逐字节保持旧行为。
 * 2. **原地重生**，不瞬移回 home。训练场的陪练死在哪儿就在哪儿满血站起来 ——
 *    回 home 会让「刚打死的那个」瞬移到远处，玩家读作「换了一个人」。
 * 3. **复活有短暂保护**（`REVIVE_GUARD`），期间不结算命中。否则站在尸体上连打，
 *    重生那一帧就被下一刀秒掉，等于没刷新。
 */

/** 命中记录环形容量：只留最近这些条，够低帧率下补播，也不会让快照无限变长。 */
export const HIT_MARK_CAP = 24;

/** 复活保护（秒）：与表现层的「从地里升起」同长，起身过程不挨打。 */
export const REVIVE_GUARD = 0.45;

/** 缺省重生延迟（秒）：配置缺失时的兜底。 */
export const DEFAULT_RESPAWN_SEC = 3;

export function initialHealth(maxHp: number): DummyHealth {
  const hp = Math.max(0, maxHp);
  return { hp, maxHp: hp, dead: false, deadT: 0, respawn: 0, revive: 0, kills: 0 };
}

/** 该假人的重生延迟：陪练自己的配置优先，其次全局，最后兜底。 */
export function respawnSecFor(world: World, s: DummyState): number {
  const f = world.config.dummies.fighters;
  const own = s.weapon && f ? f.respawnSec : undefined;
  const sec = own ?? world.config.dummies.respawnSec ?? DEFAULT_RESPAWN_SEC;
  return Number.isFinite(sec) ? Math.max(0.2, sec) : DEFAULT_RESPAWN_SEC;
}

function emit(world: World, type: 'dummy-death' | 'dummy-revive', s: DummyState): void {
  world.events.push({
    type,
    tick: world.tick,
    x: s.position.x,
    y: s.position.y,
    z: s.position.z,
    value: s.id,
  });
}

/**
 * 扣血；返回是否「这一下打死了」。
 *
 * 死亡判定放在这里而不是调用方：弓箭 / 飞弹 / 电环 / 近战四条链路都要扣血，
 * 各自判一次必然漂移（最典型的是「箭能把人射死、近战不能」）。
 */
export function damageDummy(world: World, s: DummyState, amount: number): boolean {
  const h = s.health;
  if (h.maxHp <= EPS || h.dead || h.revive > 0) return false;
  if (!(amount > 0)) return false;
  h.hp = Math.max(0, h.hp - amount);
  if (h.hp > EPS) return false;
  killDummy(world, s);
  return true;
}

/** 死亡：冻结 AI、清掉连击与受击残留、开始重生倒计时。 */
export function killDummy(world: World, s: DummyState): void {
  const h = s.health;
  if (h.dead) return;
  h.hp = 0;
  h.dead = true;
  h.deadT = 0;
  h.respawn = respawnSecFor(world, s);
  h.revive = 0;
  h.kills += 1;

  // 挥到一半的刀不能留：尸体不该继续出手，也不该在读条里「复活后半段」
  s.attackPhase = 'idle';
  s.attackPhaseTimer = 0;
  s.attackProgress = 0;
  s.attackComboIndex = 0;
  s.attackComboLeft = 0;
  s.comboGap = 0;
  s.attackCooldown = 0;
  s.wanderTimer = 0;
  s.velocity.x = 0;
  s.velocity.z = 0;
  s.velocity.y = 0;
  const hurt = s.hurt;
  hurt.timer = 0;
  hurt.type = 'none';
  hurt.knockX = 0;
  hurt.knockZ = 0;
  if (s.combat) {
    s.combat.phase = 'idle';
    s.combat.attackProgress = 0;
    s.combat.comboIndex = 0;
  }
  emit(world, 'dummy-death', s);
}

/** 重生：满血、回到「刚刷出来」的短窗口（期间不结算命中）。 */
export function reviveDummy(world: World, s: DummyState): void {
  const h = s.health;
  if (!h.dead) return;
  h.hp = h.maxHp;
  h.dead = false;
  h.deadT = 0;
  h.respawn = 0;
  h.revive = REVIVE_GUARD;
  s.velocity.x = 0;
  s.velocity.z = 0;
  s.velocity.y = 0;
  const hurt = s.hurt;
  hurt.timer = 0;
  hurt.type = 'none';
  hurt.dirX = 0;
  hurt.dirZ = 0;
  hurt.knockX = 0;
  hurt.knockZ = 0;
  emit(world, 'dummy-revive', s);
}

/**
 * 逐帧推进生命计时。只在 `dummiesUpdate` 里调用 —— 关掉假人模块时生命也冻结，
 * 与「模块关闭 = 整个世界冻结」的既有语义一致。
 */
export function updateHealth(world: World, dt: number): void {
  for (const s of world.dummies) {
    const h = s.health;
    if (h.maxHp <= EPS) continue;
    if (h.dead) {
      h.deadT += dt;
      h.respawn = Math.max(0, h.respawn - dt);
      if (h.respawn <= EPS) reviveDummy(world, s);
    } else if (h.revive > 0) {
      h.revive = Math.max(0, h.revive - dt);
    }
  }
}

/**
 * 记一条命中（飙血 / 火花的唯一数据源）。
 *
 * `seq` 由 World 自增且**复位不归零**：表现层靠「上次播到哪」去重，
 * 归零会让复位后的第一下血花被当成「已经播过」。
 */
export function pushHitMark(
  world: World,
  mark: Omit<HitMark, 'seq'>,
): void {
  world.hitMarkSeq += 1;
  world.hitMarks.push({ seq: world.hitMarkSeq, ...mark });
  const over = world.hitMarks.length - HIT_MARK_CAP;
  if (over > 0) world.hitMarks.splice(0, over);
}
