import { describe, expect, it } from 'vitest';
import { applyHit, separationUpdate, step } from '../src/core';
import type { HurtType, World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.57 · 死亡体感三件事：血跟骨骼 / 尸体挡路 / 头顶血条的数据源。
 *
 * 血条本身是 DOM 覆盖层，单测环境没有布局，靠 smoke + 截图验收；
 * 这里只测 Core 契约：命中部位 `u` 与尸体碰撞权重。
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

function hit(w: World, index: number, type: HurtType = 'light'): void {
  applyHit(w, { kind: 'dummy', index }, {
    type, duration: 0.2, dirX: 0, dirZ: 1, knockback: 0,
  });
}

function lastMark(w: World) {
  return w.hitMarks[w.hitMarks.length - 1];
}

describe('v9s.57 命中部位（血跟骨骼）', () => {
  it('配置表按受击类型给部位：轻击最高、击飞最低', () => {
    const w = makeWorld();
    const hh = w.config.hits.hitHeight;
    expect(hh).toBeTruthy();
    expect(hh!.light).toBeGreaterThan(hh!.heavy);
    expect(hh!.heavy).toBeGreaterThan(hh!.knock);
  });

  it('命中记录带归一化部位 u，且与配置一致', () => {
    const w = makeWorld();
    arm(w, 0, 100);
    hit(w, 0, 'light');
    expect(lastMark(w).u).toBeCloseTo(w.config.hits.hitHeight!.light, 6);
    hit(w, 0, 'heavy');
    expect(lastMark(w).u).toBeCloseTo(w.config.hits.hitHeight!.heavy, 6);
    hit(w, 0, 'knock');
    expect(lastMark(w).u).toBeCloseTo(w.config.hits.hitHeight!.knock, 6);
  });

  it('显式 hitU 优先于配置表（击地这类招式打得更低）', () => {
    const w = makeWorld();
    arm(w, 0, 100);
    applyHit(w, { kind: 'dummy', index: 0 }, {
      type: 'knock', duration: 0.2, dirX: 0, dirZ: 1, knockback: 0, hitU: 0.26,
    });
    expect(lastMark(w).u).toBeCloseTo(0.26, 6);
  });

  it('u 会被夹在 0.05..0.98：不会落到脚底、也不会飞出头顶', () => {
    const w = makeWorld();
    arm(w, 0, 100);
    applyHit(w, { kind: 'dummy', index: 0 }, {
      type: 'light', duration: 0.2, dirX: 0, dirZ: 1, knockback: 0, hitU: -3,
    });
    expect(lastMark(w).u).toBeGreaterThanOrEqual(0.05);
    applyHit(w, { kind: 'dummy', index: 0 }, {
      type: 'light', duration: 0.2, dirX: 0, dirZ: 1, knockback: 0, hitU: 9,
    });
    expect(lastMark(w).u).toBeLessThanOrEqual(0.98);
  });

  it('木桩仍然不喷血：没有 hitMark，但卡肉 / 命中计数照旧', () => {
    const w = makeWorld();
    const before = w.hitMarks.length;
    hit(w, 1, 'light');
    expect(w.hitMarks.length).toBe(before);
    expect(w.hitCount).toBe(1);
  });
});

describe('v9s.57 尸体是障碍', () => {
  /** 把 0 号假人打死，并把玩家放到它的尸体碰撞圆里。 */
  function corpseWorld(): { w: World; s: World['dummies'][number] } {
    const w = makeWorld();
    const s = w.dummies[0];
    arm(w, 0, 10);
    hit(w, 0, 'knock');
    // 伤害 26 → 10 血一刀致死
    expect(s.health.dead).toBe(true);
    return { w, s };
  }

  it('玩家被尸体推开，尸体自己不动', () => {
    const { w, s } = corpseWorld();
    const cfg = w.config.dummies.corpse!;
    const off = cfg.offset ?? 0.55;
    const cr = cfg.radius ?? 0.62;
    const bx = s.position.x - Math.sin(s.facing) * off;
    const bz = s.position.z - Math.cos(s.facing) * off;

    const corpseBefore = { x: s.position.x, z: s.position.z };
    // 玩家站在尸体圆心旁边（重叠 0.1m）
    w.character.position.x = bx + 0.1;
    w.character.position.z = bz;
    separationUpdate(w);

    const d = Math.hypot(
      w.character.position.x - bx,
      w.character.position.z - bz,
    );
    expect(d).toBeGreaterThanOrEqual(w.config.characterRadius + cr - 0.05);
    // 尸体一个字节都不该被推走
    expect(s.position.x).toBeCloseTo(corpseBefore.x, 9);
    expect(s.position.z).toBeCloseTo(corpseBefore.z, 9);
  });

  it('corpse.enabled = false 精确回到「能穿过尸体」', () => {
    const { w, s } = corpseWorld();
    w.config.dummies.corpse!.enabled = false;
    const off = w.config.dummies.corpse!.offset ?? 0.55;
    const bx = s.position.x - Math.sin(s.facing) * off;
    const bz = s.position.z - Math.cos(s.facing) * off;
    w.character.position.x = bx + 0.1;
    w.character.position.z = bz;
    const px = w.character.position.x;
    const pz = w.character.position.z;
    separationUpdate(w);
    expect(w.character.position.x).toBeCloseTo(px, 9);
    expect(w.character.position.z).toBeCloseTo(pz, 9);
  });

  it('活人仍然由自己让开玩家（尸体规则不污染普通分离）', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const before = { x: s.position.x, z: s.position.z };
    w.character.position.x = s.position.x + 0.05;
    w.character.position.z = s.position.z;
    const px = w.character.position.x;
    const pz = w.character.position.z;
    separationUpdate(w);
    // 玩家不动，假人被推开
    expect(w.character.position.x).toBeCloseTo(px, 9);
    expect(w.character.position.z).toBeCloseTo(pz, 9);
    expect(Math.hypot(s.position.x - before.x, s.position.z - before.z)).toBeGreaterThan(0.1);
  });

  it('一路朝尸体走 3 秒也不会穿模（只能贴边滑开）', () => {
    const { w, s } = corpseWorld();
    const cfg = w.config.dummies.corpse!;
    const off = cfg.offset ?? 0.55;
    const cr = cfg.radius ?? 0.62;
    const center = () => ({
      x: s.position.x - Math.sin(s.facing) * off,
      z: s.position.z - Math.cos(s.facing) * off,
    });
    const c0 = center();
    // 站在尸体正前方 2.4m，每帧朝它推进
    w.character.position.x = c0.x;
    w.character.position.z = c0.z + 2.4;
    let minD = Infinity;
    for (let i = 0; i < 180; i++) {
      step(w, 1 / 60, intent({ moveZ: -1 }));
      const c = center();
      minD = Math.min(minD, Math.hypot(w.character.position.x - c.x, w.character.position.z - c.z));
    }
    // 贴边滑开是允许的，穿进去（距离明显小于半径和）不允许
    expect(minD).toBeGreaterThan(w.config.characterRadius + cr - 0.08);
  });
});
