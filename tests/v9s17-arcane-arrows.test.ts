import { describe, expect, it } from 'vitest';
import { wrapAngle } from '../src/core';
import { CONFIG, intent, makeWorld, run } from './helpers';

/**
 * v9s.17 · 奥术波次齐射 + 弓箭重力弹道。
 *
 * 这一版把两个技能从「表现层自己演」推进到「Core 拥有实体」：
 *  - 奥术飞弹：一次引导固定 5 波 × 每波 3 枚，带限速制导，结束进 1s 冷却；
 *  - 弓箭：Core 积分抛物线，命中插在目标身上 / 落地插在地上。
 * 下面只断言 Core 的状态转移，视觉由截图验收。
 */

const ARC = CONFIG.core.abilities.arcane;

describe('奥术：波次齐射', () => {
  it('默认配置是 5 波 × 3 枚，结束进 1s 冷却', () => {
    const w = makeWorld();
    w.modules.dummies = false; // 冻结假人：飞弹继续飞，但不结算命中（便于计数）
    run(w, 1, intent({ weaponSlot: 4 }));
    // 0.2s 一波，5 波在 0.8s 内打完；跑 1.5s 留出冷却衰减的观察窗口
    run(w, 90, intent({ attackHeld: true }));

    expect(w.abilities.volleyId).toBe(ARC.waves * ARC.perWave);
    expect(w.abilities.channeling).toBe(false);
    expect(w.abilities.waveIndex).toBe(ARC.waves);
    // 1.5s - 0.8s ≈ 0.7s 已衰减，剩余约 0.3s
    expect(w.abilities.cooldown).toBeGreaterThan(0.15);
    expect(w.abilities.cooldown).toBeLessThan(0.5);
  });

  it('放完之后按住不放不会自动重开，必须松手', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 90, intent({ attackHeld: true }));
    expect(w.abilities.volleyId).toBe(ARC.waves * ARC.perWave);

    // 继续按住 3s：冷却早就走完了，但没有松手 → 不重开
    run(w, 180, intent({ attackHeld: true }));
    expect(w.abilities.volleyId).toBe(ARC.waves * ARC.perWave);
    expect(w.abilities.channeling).toBe(false);
  });

  it('松手 + 冷却结束后可以重新引导', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 90, intent({ attackHeld: true }));
    run(w, 1, intent({})); // 松手：清除 needsRelease
    run(w, 80, intent({})); // 冷却走完
    expect(w.abilities.cooldown).toBe(0);

    run(w, 1, intent({ attackHeld: true }));
    expect(w.abilities.channeling).toBe(true);
    // v9s.18：同一波内按 spawnDelay 错落出膛 → 再推几帧让三发都出来
    run(w, 6, intent({ attackHeld: true }));
    expect(w.abilities.volleyId).toBe(ARC.waves * ARC.perWave + ARC.perWave);
  });

  it('同一波内三枚飞弹按 spreadDeg 均匀散开', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 1, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));
    // v9s.18：出膛错落（每发 delay = i × spawnDelay）→ 等到三发都在场
    run(w, 6, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));

    const shots = w.abilities.projectiles.slice(0, ARC.perWave);
    expect(shots.length).toBe(ARC.perWave);
    const angles = shots.map((p) => Math.atan2(p.dirX, p.dirZ));
    // 相邻两发的夹角 ≈ spreadDeg
    const step = (ARC.spreadDeg * Math.PI) / 180;
    for (let i = 1; i < angles.length; i++) {
      expect(Math.abs(wrapAngle(angles[i] - angles[i - 1]) - step)).toBeLessThan(1e-6);
    }
  });

  it('制导只做「限速转向」：偏角 20° 开火能修正到目标，关掉 turnRate 则保持原方向', () => {
    const shoot = (turnRateDeg: number) => {
      const w = makeWorld();
      w.modules.dummies = false; // 冻结假人位置，专测转向逻辑
      w.modules.targeting = false;
      w.config.abilities.arcane.turnRateDeg = turnRateDeg;
      // v9s.18：出膛后先散开 spreadTime 秒才制导。本用例只验转向逻辑，把散开阶段去掉
      w.config.abilities.arcane.spreadTime = 0;
      w.dummies[0].position.x = 0;
      w.dummies[0].position.z = 3; // 玩家在 (0,8)，正前方 5m
      for (let i = 1; i < w.dummies.length; i++) w.dummies[i].position.z = -12;
      run(w, 1, intent({ weaponSlot: 4 }));
      // 朝 -Z 偏 20°
      const yaw = 0.349;
      run(w, 1, intent({
        attackHeld: true, aimActive: true, aimX: Math.sin(yaw), aimZ: -Math.cos(yaw),
      }));
      return w;
    };

    const w = shoot(ARC.turnRateDeg);
    const p0 = w.abilities.projectiles[0];
    const before = Math.abs(wrapAngle(
      Math.atan2(0 - p0.x, 3 - p0.z) - Math.atan2(p0.dirX, p0.dirZ),
    ));
    expect(before).toBeGreaterThan(0.2); // 起手确实偏了

    run(w, 12, intent({ attackHeld: true, aimActive: true, aimX: Math.sin(0.349), aimZ: -Math.cos(0.349) }));
    const p1 = w.abilities.projectiles[0];
    const after = Math.abs(wrapAngle(
      Math.atan2(0 - p1.x, 3 - p1.z) - Math.atan2(p1.dirX, p1.dirZ),
    ));
    expect(after).toBeLessThan(0.06); // 0.2s 内修正到几乎没有误差

    const fixed = shoot(0);
    const q0 = fixed.abilities.projectiles[0];
    const dir0 = Math.atan2(q0.dirX, q0.dirZ);
    run(fixed, 12, intent({ attackHeld: true, aimActive: true, aimX: Math.sin(0.349), aimZ: -Math.cos(0.349) }));
    const q1 = fixed.abilities.projectiles[0];
    expect(Math.abs(wrapAngle(Math.atan2(q1.dirX, q1.dirZ) - dir0))).toBeLessThan(1e-9);
  });
});

describe('弓箭：重力弹道', () => {
  it('蓄力时间被缩短（0.3s 按住即可发射）', () => {
    expect(CONFIG.core.combat.bow.maxChargeTime).toBeLessThanOrEqual(0.9);
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 20, intent({ attackPressed: true, attackHeld: true })); // 0.33s
    expect(w.combat.charging).toBe(true);
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));
    expect(w.arrows.length).toBe(1);
  });

  it('出弓有仰角、飞行中 y 速度被重力持续减小', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 60, intent({ attackPressed: true, attackHeld: true })); // 满蓄
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));

    const a = w.arrows[0];
    expect(a.stuck).toBe(false);
    expect(a.vy).toBeGreaterThan(0); // 仰角上抬
    const vy0 = a.vy;
    const y0 = a.y;
    run(w, 6, intent({}));
    const b = w.arrows[0];
    expect(b.vy).toBeLessThan(vy0);
    expect(b.y).toBeLessThan(y0 + vy0 * 0.1 + 0.01); // 已明显低于「无重力直线」
  });

  it('命中假人后插在身上，并跟随假人平移', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 3;
    for (let i = 1; i < w.dummies.length; i++) {
      w.dummies[i].position.x = 12;
      w.dummies[i].position.z = -12;
    }
    // 受击僵直让假人 AI 停住，落点可控
    for (const d of w.dummies) {
      d.hurt.type = 'light';
      d.hurt.timer = 99;
    }
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 60, intent({ attackPressed: true, attackHeld: true, aimActive: true, aimX: 0, aimZ: -1 }));
    run(w, 1, intent({ attackHeld: false, attackReleased: true, aimActive: true, aimX: 0, aimZ: -1 }));
    run(w, 40, intent({}));

    const stuck = w.arrows.find((a) => a.stuck && a.stuckDummy === 0);
    expect(stuck).toBeTruthy();
    expect(stuck!.hit).toBe(true);
    expect(stuck!.y).toBeGreaterThan(0.2);
    expect(stuck!.y).toBeLessThan(1.25);

    // 假人平移 2m，箭跟着走（但不随假人转身）。
    // 关掉 dummies 模块避免 AI 把假人推回原位 —— 箭的跟随逻辑不依赖它。
    const beforeX = stuck!.x;
    w.modules.dummies = false;
    w.dummies[0].position.x += 2;
    run(w, 1, intent({}));
    expect(w.arrows.find((a) => a.stuck && a.stuckDummy === 0)!.x).toBeCloseTo(beforeX + 2, 5);
  });

  it('没打到目标就插在地上，驻留几秒后移除', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 60, intent({ attackPressed: true, attackHeld: true }));
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));

    run(w, 150, intent({}));
    const ground = w.arrows.find((a) => a.stuck && a.stuckDummy === -1);
    expect(ground).toBeTruthy();
    // 箭中点离地 ≈ groundStickLift（箭头入土、箭杆整根露出），不是把中点埋进地面
    expect(ground!.y).toBeGreaterThan(0.1);
    expect(ground!.y).toBeLessThan(0.5);
    expect(ground!.hit).toBe(false);

    const stickSec = CONFIG.core.combat.bow.trajectory.stickSec;
    run(w, Math.ceil(stickSec * 60) + 10, intent({}));
    expect(w.arrows.some((a) => a.stuck)).toBe(false); // 驻留结束自动清理
  });

  it('蓄力越满初速越快（同一仰角下射得更远）', () => {
    const shoot = (frames: number) => {
      const w = makeWorld();
      w.modules.dummies = false;
      run(w, 1, intent({ weaponSlot: 5 }));
      run(w, frames, intent({ attackPressed: true, attackHeld: true }));
      run(w, 1, intent({ attackHeld: false, attackReleased: true }));
      return w.arrows[0];
    };
    const weak = shoot(9); // 0.15s，刚过最小蓄力
    const full = shoot(60);
    expect(full.vx * full.vx + full.vz * full.vz).toBeGreaterThan(
      weak.vx * weak.vx + weak.vz * weak.vz,
    );
  });
});
