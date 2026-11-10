import { describe, expect, it } from 'vitest';
import { currentMeleeShape, meleeCoverage, runSteps, snapshot, step } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld, run } from './helpers';

/** 单假人场景：目标放在玩家正前方（-Z）dist 米；关闭目标辅助，用摇杆方向锁定攻击朝向。 */
function soloDummy(dist: number, lungeZero = false): World {
  const w = makeWorld();
  w.modules.targeting = false;
  if (lungeZero) w.config.combat.weapons['sword-shield'].lunge = [0, 0, 0];
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].position.x = 12;
    w.dummies[i].position.z = 12;
    w.dummies[i].mode = 'idle';
    w.dummies[i].velocity.x = 0;
    w.dummies[i].velocity.z = 0;
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.position.x = 0;
  s.position.z = 8 - dist;
  s.velocity.x = 0;
  s.velocity.z = 0;
  return w;
}

/** 起手朝 -Z，然后逐帧推进直到命中事件出现（上限 40 帧）。 */
function playUntilHit(w: World): boolean {
  run(w, 1, intent({ moveZ: -1, attackPressed: true }));
  for (let i = 0; i < 40; i++) {
    step(w, w.config.fixedDt, intent());
    if (w.events.some((e) => e.type === 'hit')) return true;
  }
  return false;
}

describe('玩家攻击命中', () => {
  it('命中前方假人：hit 事件、hitCount 累加、假人进入 light 受击', () => {
    const w = soloDummy(1.4, true);
    expect(playUntilHit(w)).toBe(true);
    expect(w.hitCount).toBeGreaterThan(0);
    expect(w.dummies[0].hurt.type).toBe('light');
    expect(w.dummies[0].hurt.timer).toBeGreaterThan(0);
  });

  it('命中扇区外的假人不被命中（放在攻击朝向的正后方）', () => {
    const w = soloDummy(1.4, true);
    w.dummies[0].position.z = 9.4; // 玩家 +Z 侧，与 attackFacing(-Z) 相反
    expect(playUntilHit(w)).toBe(false);
    expect(w.hitCount).toBe(0);
  });

  it('超出武器有效距离不命中', () => {
    const w = soloDummy(4.5, true);
    expect(playUntilHit(w)).toBe(false);
    expect(w.hitCount).toBe(0);
  });

  it('法杖电环命中：僵直(heavy) + 轻微击退（v7c #12）', () => {
    const w = soloDummy(1.6);
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 1, intent({ skill2Pressed: true }));
    run(w, 3, intent());
    expect(w.dummies[0].hurt.type).toBe('heavy');
    expect(w.dummies[0].hurt.timer).toBeGreaterThan(0.3); // 僵直时长明显长于普通受击
    expect(Math.hypot(w.dummies[0].hurt.knockX, w.dummies[0].hurt.knockZ)).toBeGreaterThan(0);
    expect(w.hitCount).toBeGreaterThan(0);
  });

  it('奥术飞弹命中：light 受击（引导可移动，飞弹沿引导方向飞行）', () => {
    const w = soloDummy(3.0);
    run(w, 1, intent({ weaponSlot: 4 }));
    // 关闭目标辅助时用摇杆方向锁定引导朝向：moveZ:-1 → 朝 -Z，飞弹飞向假人
    run(w, 30, intent({ attackHeld: true, moveZ: -1 }));
    expect(w.hitCount).toBeGreaterThan(0);
    expect(w.dummies[0].hurt.type).toBe('light');
  });

  it('剑盾第 3 段收招命中为 heavy 受击（三连击差异）', () => {
    const w = soloDummy(1.4, true);
    const seen: Array<{ combo: number; type: string }> = [];
    let pressNext = true;
    for (let i = 0; i < 260; i++) {
      step(w, w.config.fixedDt, pressNext ? intent({ moveZ: -1, attackPressed: true }) : intent());
      pressNext = false;
      for (const e of w.events) {
        if (e.type === 'attack-end') pressNext = true;
        if (e.type === 'hit') seen.push({ combo: w.combat.comboIndex, type: w.dummies[0].hurt.type });
      }
      if (seen.some((s) => s.combo === 3)) break;
    }
    expect(seen.some((s) => s.combo === 1 && s.type === 'light')).toBe(true);
    expect(seen.some((s) => s.combo === 3 && s.type === 'heavy')).toBe(true);
  });
});

describe('大剑击退与受击僵直', () => {
  it('大剑命中近身敌人：knock 受击 + 被连续击退推到理想距离，玩家位置不变', () => {
    const w = soloDummy(0.7, true);
    w.config.combat.weapons.greatsword.lunge = [0, 0, 0];
    run(w, 1, intent({ weaponSlot: 3 }));
    // 击退只作用于敌人；玩家位置一个字节都不动（朝向会因起手输入改变，不在此断言内）
    const playerBefore = JSON.stringify(w.character.position);
    expect(playUntilHit(w)).toBe(true);
    const s = w.dummies[0];
    expect(s.hurt.type).toBe('knock');
    // 击退是连续速度冲量，跑若干帧让假人后退到位（总后退距离 ≈ push，自然收敛到理想距离附近）
    run(w, 50, intent());
    const d = Math.hypot(w.character.position.x - s.position.x, w.character.position.z - s.position.z);
    expect(d).toBeGreaterThanOrEqual(w.config.targeting.idealRange - 0.15);
    // v9s.21：攻击期间保留三成移速，起手那一帧的摇杆会让玩家前移几毫米；
    // 这里要验证的是「击退只作用于敌人」——玩家绝不会被推向后方。
    expect(w.character.position.z).toBeLessThanOrEqual(JSON.parse(playerBefore).z + 1e-6);
    expect(w.character.position.z).toBeGreaterThan(JSON.parse(playerBefore).z - 0.02);
  });

  it('受击僵直：假人在 hurt 期间不再产生主动移动（清掉命中前惯性 + 击退速度后位置不变）', () => {
    const w = soloDummy(1.4, true);
    w.dummies[0].mode = 'follow';
    expect(playUntilHit(w)).toBe(true);
    const s = w.dummies[0];
    // 命中前 follow 攒下的惯性清零；本用例验证「僵直不再写入新的主动移动」，
    // 因此同时清掉击退冲量（击退在其它用例单独验证），只隔离 AI 惯性。
    s.velocity.x = 0;
    s.velocity.z = 0;
    s.hurt.knockX = 0;
    s.hurt.knockZ = 0;
    const x0 = s.position.x;
    const z0 = s.position.z;
    run(w, 5, intent());
    expect(Math.hypot(s.position.x - x0, s.position.z - z0)).toBeLessThan(0.002);
  });

  it('受击计时自然衰减，结束后回到 none', () => {
    const w = soloDummy(1.4, true);
    expect(playUntilHit(w)).toBe(true);
    run(w, 30, intent());
    expect(w.dummies[0].hurt.type).toBe('none');
    expect(w.dummies[0].hurt.timer).toBe(0);
  });
});

describe('假人攻击玩家（无伤害）', () => {
  it('命中帧写 world.playerHurt，但 character 逐字节不变', () => {
    const w = makeWorld();
    for (let i = 0; i < 3; i++) {
      w.dummies[i].position.x = 12;
      w.dummies[i].position.z = 12;
      w.dummies[i].mode = 'idle';
    }
    const s = w.dummies[3];
    s.position.x = 0;
    s.position.z = 9; // 距离玩家 1m，attack 模式会立即起手
    const playerBefore = JSON.stringify(w.character);
    let hurtSeen = false;
    for (let i = 0; i < 200 && !hurtSeen; i++) {
      step(w, w.config.fixedDt, intent());
      if (w.events.some((e) => e.type === 'player-hurt')) hurtSeen = true;
    }
    expect(hurtSeen).toBe(true);
    expect(w.playerHurt.type).toBe('light');
    expect(w.playerHurt.timer).toBeGreaterThan(0);
    // v9s.18：俯仰注视（headPitch / bodyPitch）是姿态而非伤害，单独排除；
    // 位置 / 速度 / 面朝向 / 身体朝向仍必须逐字节不变。
    const phys = (c: typeof w.character) => {
      const { headPitch, bodyPitch, ...rest } = c;
      return JSON.stringify(rest);
    };
    expect(phys(w.character)).toBe(phys(JSON.parse(playerBefore)));
  });
});

describe('命中模块开关与确定性', () => {
  it('关闭 hits 后不产生 hit 事件、不写受击状态', () => {
    const w = soloDummy(1.4, true);
    w.modules.hits = false;
    expect(playUntilHit(w)).toBe(false);
    expect(w.hitCount).toBe(0);
    expect(w.dummies[0].hurt.type).toBe('none');
  });

  it('含命中 / 受击 / 击退的长序列结果逐字节一致', () => {
    const script = (t: number) => intent({
      moveX: Math.sin(t / 19) * 0.6,
      moveZ: -Math.cos(t / 27) * 0.7,
      attackPressed: t % 23 === 0,
      attackHeld: t % 110 < 40,
      weaponSlot: t === 90 ? 3 : t === 220 ? 4 : 0,
      dummyClickId: t % 71 === 0 ? 4 : 0,
    });
    const a = makeWorld();
    const b = makeWorld();
    runSteps(a, 360, script);
    runSteps(b, 360, script);
    expect(snapshot(a)).toBe(snapshot(b));
  });
});

/* ---------------- v9s.x：攻击覆盖范围与判定口径一致性 ---------------- */

describe('meleeCoverage：脚底指示器范围与 playerHits / playerGroundSlam 同源', () => {
  /** 把 combat 摆到 active 命中窗口内，让 currentMeleeShape 的时间闸门打开。 */
  function activeWindow(w: World): void {
    w.combat.phase = 'active';
    w.combat.timings.active = 0.2;
    w.combat.phaseTimer = 0.1; // u = 0.5，落在 hitWindow 内
  }

  it('半径 = currentMeleeShape.reach + dummies.radius，半角 = acos(cosArc)', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    activeWindow(w);
    const shape = currentMeleeShape(w);
    const cov = meleeCoverage(w);
    expect(shape.active).toBe(true);
    expect(cov.radius).toBeCloseTo(shape.reach + w.config.dummies.radius, 6);
    expect(Math.cos((cov.halfArcDeg * Math.PI) / 180)).toBeCloseTo(shape.cosArc, 6);
  });

  it('整段扫掠值域包含 currentMeleeShape 任一时刻的瞬时区间', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.timings.active = 0.2;
    const cov = meleeCoverage(w);
    expect(cov.sweep).not.toBeNull();
    for (let i = 0; i <= 8; i++) {
      w.combat.phase = 'active';
      w.combat.phaseTimer = 0.2 * (i / 10);
      const shape = currentMeleeShape(w);
      if (!shape.active || !shape.sweepActive) continue;
      expect(shape.sweepLo).toBeGreaterThanOrEqual(cov.sweep!.lo - 1e-6);
      expect(shape.sweepHi).toBeLessThanOrEqual(cov.sweep!.hi + 1e-6);
    }
  });

  it('击地圆半径 / 落点前移与 currentMeleeShape 的 slam 一致', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.timings.active = 0.2;
    w.combat.phase = 'active';
    w.combat.attackFacing = 0;
    w.combat.phaseTimer = 0.2 * 0.7; // u >= slamU(0.6)
    const shape = currentMeleeShape(w);
    const cov = meleeCoverage(w);
    expect(shape.slamRadius).toBeGreaterThan(0);
    expect(cov.slam!.radius).toBeCloseTo(shape.slamRadius + w.config.dummies.radius, 6);
    expect(cov.slam!.ahead).toBeCloseTo(shape.slamZ - w.character.position.z, 6);
  });

  it('bow 没有近战覆盖（与 playerHits 首行同句）', () => {
    const w = makeWorld();
    w.combat.weapon = 'bow';
    const cov = meleeCoverage(w);
    expect(cov.melee).toBe(false);
    expect(cov.radius).toBe(0);
    expect(cov.slam).toBeNull();
  });

  it('lunge 按 comboIndex 取当前段的前冲距离', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.comboIndex = 3;
    expect(meleeCoverage(w).lunge).toBe(w.config.combat.weapons.greatsword.lunge[2]);
  });

  it('纯查询：反复调用不写 World（快照逐字节一致）', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    activeWindow(w);
    const before = snapshot(w);
    for (let i = 0; i < 5; i++) meleeCoverage(w);
    expect(snapshot(w)).toBe(before);
  });
});
