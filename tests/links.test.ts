import { describe, expect, it } from 'vitest';
import {
  EMPTY_INTENTS, applyHit, hitsUpdate, openLinkWindow, resetWorld, scanLinkHits,
  snapshot, step, restoreWorld,
} from '../src/core';
import type { Intents, World } from '../src/core';
import { intent, makeWorld, place } from './helpers';

const ATK = intent({ attackPressed: true });
const ROLL = intent({ sprintPressed: true });

function tick(w: World, i: Intents = EMPTY_INTENTS): void {
  step(w, w.config.fixedDt, i);
}

/** Vec3 是 plain object（没有 .set），统一用这个辅助放置。 */
function put(
  e: { position: { x: number; y: number; z: number } }, x: number, z: number,
): void {
  e.position.x = x;
  e.position.y = 0;
  e.position.z = z;
}

/** 只保留地面盒，避免台阶 / 墙体干扰位移收敛断言。 */
function clearObstacles(w: World): void {
  w.boxes = w.boxes.filter((b) => b.kind === 'ground');
}

/** 把假人冻结成待机并清速度，避免 AI 移动干扰位移 / 命中断言。 */
function freezeDummies(w: World): void {
  for (const s of w.dummies) {
    s.mode = 'idle';
    s.velocity.x = 0;
    s.velocity.z = 0;
    s.hurt.timer = 0;
    s.hurt.knockX = 0;
    s.hurt.knockZ = 0;
  }
}

/** 真实跑一次翻滚并等到「窗口已开启」那一帧。 */
function finishRoll(w: World): void {
  tick(w, ROLL);
  for (let i = 0; i < 50; i++) {
    if (w.dash.phase === 'idle' && w.playerLink.linkWindow > 0) return;
    tick(w);
  }
  throw new Error('翻滚窗口未开启');
}

function moveCfg(w: World) {
  return w.config.links.moves['sword-shield']!;
}

describe('v9a 派生招 · 窗口与输入仲裁', () => {
  it('翻滚结束后窗口内按攻击 → 起手盾击，普通连击不抢输入', () => {
    const w = makeWorld();
    place(w, 0, 0);
    clearObstacles(w);
    freezeDummies(w);
    finishRoll(w);
    expect(w.dash.phase).toBe('idle');
    expect(w.playerLink.linkWindow).toBeGreaterThan(0);
    expect(w.playerLink.source).toBe('roll');

    tick(w, ATK);
    expect(w.playerLink.phase).toBe('windup');
    expect(w.playerLink.kind).toBe('shield-charge');
    expect(w.playerLink.weapon).toBe('sword-shield');
    expect(w.playerLink.consumedAttack).toBe(true);
    expect(w.combat.phase).toBe('idle'); // 同帧没有起普通连击
    expect(w.events.some((e) => e.type === 'link-start')).toBe(true);
  });

  it('窗口过期后按攻击 → 退回普通连击，派生招完全不触发', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    finishRoll(w);
    for (let i = 0; i < 40; i++) tick(w);
    expect(w.playerLink.linkWindow).toBe(0);
    tick(w, ATK);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.playerLink.id).toBe(0);
    expect(w.combat.phase).not.toBe('idle');
  });

  it('长跑与闪现的窗口比翻滚更长（操作余量）', () => {
    const w = makeWorld();
    const cfg = w.config.links.windows;
    expect(cfg.sprint).toBeGreaterThan(cfg.roll);
    expect(cfg.blink).toBeGreaterThan(cfg.roll);

    // 闪现：法杖 + 冲刺按下沿 → 单帧瞬移且窗口以 blink 时长开启
    tick(w, intent({ weaponSlot: 4 }));
    tick(w, ROLL);
    expect(w.dash.kind).toBe('blink');
    expect(w.playerLink.source).toBe('blink');
    expect(w.playerLink.linkWindow).toBeGreaterThan(cfg.roll);
  });

  it('长跑松开后另开窗口（不会被翻滚覆盖成短窗口）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    const go = intent({ sprintHeld: true, moveZ: 1 });
    for (let i = 0; i < 12; i++) tick(w, go);
    expect(w.character.sprinting).toBe(true);
    tick(w); // movement 写 sprinting=false
    tick(w); // links 下一帧检测到 true→false 沿
    expect(w.playerLink.linkWindow).toBeGreaterThan(0);
    expect(w.playerLink.source).toBe('sprint');
    expect(w.playerLink.linkWindow).toBeGreaterThan(w.config.links.windows.roll - 0.05);
  });

  it('长跑途中可直接触发（triggerWhileSprinting）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    const go = intent({ sprintHeld: true, moveZ: 1 });
    for (let i = 0; i < 12; i++) tick(w, go);
    tick(w, ATK);
    expect(w.playerLink.phase).toBe('windup');
    expect(w.playerLink.kind).toBe('shield-charge');
  });

  it('无窗口时按攻击仍是普通连击', () => {
    const w = makeWorld();
    freezeDummies(w);
    tick(w, ATK);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.combat.phase).not.toBe('idle');
  });

  it('未配置派生招的武器不抢输入：法杖窗口内按住仍可引导', () => {
    const w = makeWorld();
    tick(w, intent({ weaponSlot: 4 })); // 法杖（Phase 1 冰环 enabled=false）
    openLinkWindow(w, 'blink');
    tick(w, intent({ attackPressed: true, attackHeld: true }));
    expect(w.playerLink.phase).toBe('idle');
    expect(w.playerLink.consumedAttack).toBe(false);
    expect(w.abilities.channeling).toBe(true);
  });
});

describe('v9a 派生招 · 共享 CD 与不可连发', () => {
  it('一个窗口最多触发一次，连按攻击不会连发派生招', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    finishRoll(w);
    tick(w, ATK);
    const id = w.playerLink.id;
    for (let i = 0; i < 5; i++) tick(w, ATK);
    expect(w.playerLink.id).toBe(id);
    expect(w.playerLink.usedWindowId).toBe(w.playerLink.windowId);
  });

  it('触发派生招会抬升 dash.cooldown（共享冷却），CD 内不能再翻滚', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    finishRoll(w);
    const before = w.dash.cooldown;
    tick(w, ATK);
    // 同帧 dashUpdate 会正常衰减一次 cooldown，因此触发后读到的值 = sharedCooldown - dt
    expect(w.dash.cooldown)
      .toBeGreaterThanOrEqual(w.config.links.sharedCooldown - w.config.fixedDt - 1e-6);
    expect(w.dash.cooldown).toBeGreaterThan(before);
    expect(w.playerLink.cooldown).toBeGreaterThan(0);
    tick(w, ROLL);
    expect(w.dash.phase).not.toBe('active');
  });

  it('CD 未结束时新窗口也不能连发', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    finishRoll(w);
    tick(w, ATK);
    const id = w.playerLink.id;
    openLinkWindow(w, 'sprint'); // 强制再开窗口
    tick(w, ATK);
    expect(w.playerLink.id).toBe(id);
  });

  it('派生招进行中禁止翻滚', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    finishRoll(w);
    tick(w, ATK);
    tick(w, ROLL);
    expect(w.dash.phase).not.toBe('active');
  });
});

describe('v9a 派生招 · 索敌与位移收敛', () => {
  it('正前方目标：起手快照 id / 距离 / 朝向，冲锋距离 = 目标距离 - 停住距离', () => {
    const w = makeWorld();
    place(w, 0, 0);
    clearObstacles(w);
    freezeDummies(w);
    for (let i = 1; i < w.dummies.length; i++) put(w.dummies[i], 12, -12);
    put(w.dummies[0], 0, 3);
    openLinkWindow(w, 'roll');
    tick(w, ATK);
    expect(w.playerLink.targetId).toBe(1);
    expect(w.playerLink.targetDist).toBeCloseTo(3, 1);
    expect(w.playerLink.facing).toBeCloseTo(0, 2);
    expect(w.playerLink.travel).toBeCloseTo(3 - w.config.links.search.stopDistance, 1);
  });

  it('不做背后索敌：背后目标不锁定，回退面朝向并冲到极限距离', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    for (const s of w.dummies) put(s, 0, -3);
    openLinkWindow(w, 'roll');
    tick(w, ATK);
    expect(w.playerLink.targetId).toBe(0);
    expect(w.playerLink.facing).toBeCloseTo(0, 2);
    expect(w.playerLink.travel).toBeCloseTo(moveCfg(w).distance, 5);
  });

  it('目标超范围 / 无目标：只冲到配置极限距离即中断，不无限追击', () => {
    const w = makeWorld();
    place(w, 0, 0);
    clearObstacles(w);
    freezeDummies(w);
    for (const s of w.dummies) put(s, 0, 12); // 超出 search.range
    openLinkWindow(w, 'roll');
    const startZ = w.character.position.z;
    tick(w, ATK);
    expect(w.playerLink.targetId).toBe(0);
    expect(w.playerLink.travel).toBeCloseTo(moveCfg(w).distance, 5);
    for (let i = 0; i < 50; i++) tick(w);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.character.position.z - startZ).toBeLessThanOrEqual(moveCfg(w).distance + 0.12);
  });

  it('起手后目标瞬移，锁定朝向 / 冲刺距离不漂移', () => {
    const w = makeWorld();
    place(w, 0, 0);
    clearObstacles(w);
    freezeDummies(w);
    for (let i = 1; i < w.dummies.length; i++) put(w.dummies[i], 12, -12);
    put(w.dummies[0], 0, 3);
    openLinkWindow(w, 'roll');
    tick(w, ATK);
    const f = w.playerLink.facing;
    const travel = w.playerLink.travel;
    put(w.dummies[0], 8, -8);
    for (let i = 0; i < 6; i++) tick(w);
    expect(w.playerLink.facing).toBe(f);
    expect(w.playerLink.travel).toBe(travel);
    expect(w.playerLink.targetId).toBe(1); // 快照仍是原目标
  });

  it('active 位移收敛到 travel，且不越世界边界', () => {
    const w = makeWorld();
    place(w, 0, 0);
    clearObstacles(w);
    freezeDummies(w);
    for (let i = 1; i < w.dummies.length; i++) put(w.dummies[i], 12, -12);
    put(w.dummies[0], 0, 3);
    openLinkWindow(w, 'roll');
    const startZ = w.character.position.z;
    tick(w, ATK);
    const travel = w.playerLink.travel;
    // v9s.29：命中会触发卡肉（Core 冻结攻击时间轴），派生招的 active 计时也一起暂停，
    // 因此收招帧数比原先多几帧（60fps 下 45ms ≈ 3 帧）。位移总量不变。
    for (let i = 0; i < 70; i++) tick(w);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.character.position.z - startZ).toBeCloseTo(travel, 1);
    expect(w.character.position.z).toBeLessThanOrEqual(w.config.worldBounds.maxZ + 1e-6);
  });

  it('中途换武器静默取消派生招', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    openLinkWindow(w, 'roll');
    tick(w, ATK);
    expect(w.playerLink.phase).not.toBe('idle');
    tick(w, intent({ weaponSlot: 3 }));
    expect(w.playerLink.phase).toBe('idle');
    expect(w.playerLink.kind).toBe('');
  });
});

describe('v9a 派生招 · 扫掠命中与对称机制', () => {
  it('一帧大位移不会漏掉路径中点的敌人（线段扫掠）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    for (let i = 1; i < w.dummies.length; i++) put(w.dummies[i], 12, -12);
    put(w.dummies[0], 0, 1.5); // 路径中点
    const l = w.playerLink;
    l.phase = 'active';
    l.weapon = 'sword-shield';
    l.facing = 0;
    l.fromX = 0;
    l.fromZ = 0;
    l.hitIds = [];
    l.pulseTimer = 0;
    w.character.position.z = 3; // 一帧冲 3m，终点扇形已够不到 1.5m 处的敌人
    scanLinkHits(w, w.config.fixedDt);
    expect(l.hitIds).toContain(1);
    expect(w.events.some((e) => e.type === 'link-hit')).toBe(true);
    expect(w.hitCount).toBe(1);
  });

  it('每个目标在一次招式里只结算一次（hitIds 去重）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    for (let i = 1; i < w.dummies.length; i++) put(w.dummies[i], 12, -12);
    put(w.dummies[0], 0, 1.5);
    const l = w.playerLink;
    l.phase = 'active';
    l.weapon = 'sword-shield';
    l.facing = 0;
    l.fromX = 0;
    l.fromZ = 0;
    l.hitIds = [];
    l.pulseTimer = 0;
    w.character.position.z = 1.5;
    for (let i = 0; i < 10; i++) scanLinkHits(w, w.config.fixedDt);
    expect(w.hitCount).toBe(1);
    expect(l.hitIds.length).toBe(1);
  });

  it('不做背后命中：冲锋起点后方的敌人不受击', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    for (const s of w.dummies) put(s, 0, -2);
    const l = w.playerLink;
    l.phase = 'active';
    l.weapon = 'sword-shield';
    l.facing = 0;
    l.fromX = 0;
    l.fromZ = 0;
    l.hitIds = [];
    l.pulseTimer = 0;
    w.character.position.z = 3;
    scanLinkHits(w, w.config.fixedDt);
    expect(w.hitCount).toBe(0);
  });

  it('默认测试限制：假人打玩家只写受击动画，不推玩家', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    put(w.dummies[0], 0, 0.5);
    w.events.push({ type: 'dummy-hit', tick: w.tick, x: 0, y: 0, z: 0.5, value: 1 });
    hitsUpdate(w, w.config.fixedDt);
    expect(w.config.hits.noDamageToPlayer).toBe(true);
    expect(w.playerHurt.type).toBe('light');
    expect(w.playerHurt.knockX).toBe(0);
    expect(w.playerHurt.knockZ).toBe(0);
  });

  it('关闭测试开关后玩家也会被同一套公式击退（机制对称）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    w.config.hits.noDamageToPlayer = false;
    applyHit(w, { kind: 'player' }, {
      type: 'light', duration: 0.2, dirX: 0, dirZ: -1, knockback: 0.5, sourceId: 1,
    });
    expect(w.playerHurt.type).toBe('light');
    expect(w.playerHurt.knockZ).toBeLessThan(0);
    expect(Math.abs(w.playerHurt.knockZ))
      .toBeCloseTo(0.5 * w.config.hits.knockbackDecay, 5);
  });

  it('假人持有与主角同构的 link 状态，且 World 可 JSON 往返', () => {
    const w = makeWorld();
    expect(w.playerLink).toBeDefined();
    for (const s of w.dummies) {
      expect(s.link).toBeDefined();
      expect(s.link.phase).toBe('idle');
      expect(s.link.hitIds).toEqual([]);
    }
    expect(restoreWorld(snapshot(w))).toEqual(w);
  });

  it('复位清空派生招状态（id / windowId 保持单调不倒退）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    freezeDummies(w);
    openLinkWindow(w, 'roll');
    tick(w, ATK);
    const id = w.playerLink.id;
    resetWorld(w);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.playerLink.kind).toBe('');
    expect(w.playerLink.linkWindow).toBe(0);
    expect(w.playerLink.id).toBe(id);
  });
});

describe('v9a 派生招 · A/B 与确定性', () => {
  it('enabled=false 时窗口内攻击精确退回旧连击', () => {
    const w = makeWorld();
    freezeDummies(w);
    w.config.links.enabled = false;
    openLinkWindow(w, 'roll');
    expect(w.playerLink.linkWindow).toBe(0);
    tick(w, ATK);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.combat.phase).not.toBe('idle');
  });

  it('modules.links=false 时不产生派生招，且不会把动作状态卡住', () => {
    const w = makeWorld();
    freezeDummies(w);
    w.modules.links = false;
    openLinkWindow(w, 'roll');
    tick(w, ATK);
    expect(w.playerLink.phase).toBe('idle');
    expect(w.combat.phase).not.toBe('idle');
  });

  it('含派生招的输入序列跑两遍，最终状态逐字节一致', () => {
    function play(): World {
      const w = makeWorld();
      place(w, 0, 0);
      clearObstacles(w);
      freezeDummies(w);
      for (let i = 1; i < w.dummies.length; i++) put(w.dummies[i], 12, -12);
      put(w.dummies[0], 0, 3);
      const script: Intents[] = [
        ROLL, ...Array(24).fill(EMPTY_INTENTS), ATK,
        ...Array(40).fill(EMPTY_INTENTS),
        ...Array(13).fill(intent({ sprintHeld: true, moveZ: 1 })),
        ...Array(4).fill(EMPTY_INTENTS), ATK,
        ...Array(40).fill(EMPTY_INTENTS),
      ];
      for (const i of script) tick(w, i);
      return w;
    }
    expect(snapshot(play())).toBe(snapshot(play()));
  });

  it('落地招 Phase 1 未启用：空中按攻击不产生派生招', () => {
    const w = makeWorld();
    freezeDummies(w);
    expect(w.config.links.landing.enabled).toBe(false);
    tick(w, intent({ jumpPressed: true, attackPressed: true }));
    expect(w.character.grounded).toBe(false);
    expect(w.playerLink.phase).toBe('idle');
  });
});
