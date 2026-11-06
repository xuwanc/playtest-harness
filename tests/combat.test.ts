import { describe, expect, it } from 'vitest';
import { runSteps, snapshot, step } from '../src/core';
import { intent, makeWorld, run } from './helpers';

describe('武器切换', () => {
  it('默认武器为剑与盾，战斗状态为空闲', () => {
    const w = makeWorld();
    expect(w.combat.weapon).toBe('sword-shield');
    expect(w.combat.phase).toBe('idle');
    expect(w.combat.comboIndex).toBe(0);
    expect(w.modules.combat).toBe(true);
  });

  it('槽位 1..5 可切换武器并发出 weapon-change', () => {
    const w = makeWorld();
    const expected = ['sword-shield', 'dual-swords', 'greatsword', 'staff', 'bow'];
    for (let slot = 1; slot <= 5; slot++) {
      const events = run(w, 1, intent({ weaponSlot: slot }));
      expect(w.combat.weapon).toBe(expected[slot - 1]);
      if (slot > 1) expect(events.some((e) => e.type === 'weapon-change' && e.value === slot)).toBe(true);
    }
    // 切到同一把武器不重复发事件
    expect(run(w, 1, intent({ weaponSlot: 5 })).some((e) => e.type === 'weapon-change')).toBe(false);
  });

  it('换武器会中断当前攻击', () => {
    const w = makeWorld();
    run(w, 1, intent({ attackPressed: true }));
    expect(w.combat.phase).not.toBe('idle');
    run(w, 1, intent({ weaponSlot: 4 }));
    expect(w.combat.phase).toBe('idle');
    expect(w.combat.comboIndex).toBe(0);
  });
});

describe('剑类三连击', () => {
  it('按 1 → 2 → 3 顺序播放，第 4 次回到第 1 段', () => {
    const w = makeWorld();
    const starts: number[] = [];
    let pressNext = true;
    for (let i = 0; i < 240 && starts.length < 4; i++) {
      step(w, w.config.fixedDt, intent({ attackPressed: pressNext }));
      pressNext = false;
      for (const e of w.events) {
        if (e.type === 'attack-start') starts.push(e.value);
        if (e.type === 'attack-end') pressNext = true;
      }
    }
    expect(starts.slice(0, 3)).toEqual([1, 2, 3]);
    expect(starts[3]).toBe(1);
  });

  it('超过连击窗口后从第 1 段重新开始', () => {
    const w = makeWorld();
    const all = [
      ...run(w, 1, intent({ attackPressed: true })),
      ...run(w, 80, intent()),
    ];
    expect(all.some((e) => e.type === 'combo-reset')).toBe(true);
    expect(all.some((e) => e.type === 'attack-end')).toBe(true);
    const again = run(w, 1, intent({ attackPressed: true }));
    expect(again.some((e) => e.type === 'attack-start' && e.value === 1)).toBe(true);
  });

  it('攻击中按键会缓冲，结束后自动接下一段', () => {
    const w = makeWorld();
    const all = [
      ...run(w, 1, intent({ attackPressed: true })),
      ...run(w, 2, intent({ attackPressed: true })),
      ...run(w, 60, intent()),
    ];
    const starts = all.filter((e) => e.type === 'attack-start').map((e) => e.value);
    expect(starts).toEqual([1, 2]);
  });

  it('三连击带适当前向位移（不按移动键也会前冲）', () => {
    const w = makeWorld();
    const z0 = w.character.position.z;
    run(w, 1, intent({ attackPressed: true })); // facing = 0 → 朝 +Z
    run(w, 60, intent());
    expect(w.character.position.z).toBeGreaterThan(z0 + 0.25);
    expect(w.character.grounded).toBe(true);
  });

  it('大剑单段前冲距离大于剑盾', () => {
    const a = makeWorld();
    const b = makeWorld();
    run(a, 1, intent({ attackPressed: true, weaponSlot: 1 }));
    run(a, 60, intent());
    run(b, 1, intent({ attackPressed: true, weaponSlot: 3 }));
    run(b, 60, intent());
    expect(b.character.position.z).toBeGreaterThan(a.character.position.z + 0.15);
  });
});

describe('法杖技能（引导奥术飞弹 / 原地电环，v7c #12）', () => {
  it('按住攻击键进入引导、按间隔发射飞弹、松开结束，且引导中可移动', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 4 }));
    const z0 = w.character.position.z;
    const events = run(w, 40, intent({ attackHeld: true, moveZ: -1 }));
    expect(events.some((e) => e.type === 'channel-start')).toBe(true);
    expect(events.filter((e) => e.type === 'projectile-fire').length).toBeGreaterThan(2);
    expect(w.abilities.channeling).toBe(true);
    expect(w.combat.phase).toBe('idle'); // 引导不进近战状态机，所以移动不被锁速
    expect(w.character.position.z).toBeLessThan(z0 - 0.5);
    const end = run(w, 1, intent());
    expect(end.some((e) => e.type === 'channel-end')).toBe(true);
    expect(w.abilities.channeling).toBe(false);
  });

  it('技2 原地放电环：世界坐标固定、按间隔脉冲、到期清空', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 4 }));
    const px = w.character.position.x;
    const pz = w.character.position.z;
    const place = run(w, 1, intent({ skill2Pressed: true }));
    expect(place.some((e) => e.type === 'ring-place')).toBe(true);
    expect(w.abilities.rings.length).toBe(1);
    const ring = w.abilities.rings[0];
    expect(ring.x).toBeCloseTo(px, 3);
    expect(ring.z).toBeCloseTo(pz, 3);
    const pulses = run(w, 40, intent({ moveZ: -1 }));
    expect(pulses.filter((e) => e.type === 'ring-pulse').length).toBeGreaterThan(0);
    expect(w.abilities.rings[0].x).toBeCloseTo(px, 3); // 玩家走开，电环仍在原地
    run(w, 60, intent());
    expect(w.abilities.rings.length).toBe(0);
  });
});

describe('弓箭蓄力攻击', () => {
  it('按住蓄力、松开释放，蓄力值进入事件', () => {
    const w = makeWorld();
    const all = [
      ...run(w, 1, intent({ weaponSlot: 5 })),
      ...run(w, 1, intent({ attackPressed: true, attackHeld: true })),
      ...run(w, 60, intent({ attackHeld: true })),
    ];
    expect(w.combat.charging).toBe(true);
    expect(w.combat.charge).toBeGreaterThan(0.5);
    all.push(...run(w, 1, intent({ attackReleased: true })));

    const rel = all.filter((e) => e.type === 'charge-release');
    expect(rel).toHaveLength(1);
    expect(rel[0].value).toBeGreaterThan(0.5);
    expect(w.combat.charging).toBe(false);
    expect(w.combat.charge).toBe(0);
    expect(w.combat.lastCharge).toBeGreaterThan(0.5);
    expect(all.some((e) => e.type === 'attack-start')).toBe(true);
  });

  it('蓄力不足时松开取消发射', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 5 }));
    const all = [
      ...run(w, 1, intent({ attackPressed: true, attackHeld: true })),
      ...run(w, 1, intent({ attackReleased: true })),
    ];
    const rel = all.filter((e) => e.type === 'charge-release');
    expect(rel).toHaveLength(1);
    expect(rel[0].value).toBe(0);
    expect(w.combat.phase).toBe('idle');
  });

  it('蓄力时移动速度下降', () => {
    const a = makeWorld();
    const b = makeWorld();
    run(a, 1, intent({ weaponSlot: 5 }));
    run(b, 1, intent({ weaponSlot: 5 }));
    run(b, 1, intent({ attackPressed: true, attackHeld: true }));
    run(a, 60, intent({ moveX: 1 }));
    run(b, 60, intent({ moveX: 1, attackHeld: true }));
    expect(b.character.position.x).toBeLessThan(a.character.position.x * 0.75);
  });
});

describe('武器对移动与模块开关的影响', () => {
  it('大剑移速倍率低于双持剑', () => {
    const gs = makeWorld();
    const dual = makeWorld();
    run(gs, 1, intent({ weaponSlot: 3 }));
    run(dual, 1, intent({ weaponSlot: 2 }));
    run(gs, 60, intent({ moveX: 1 }));
    run(dual, 60, intent({ moveX: 1 }));
    expect(dual.character.position.x).toBeGreaterThan(gs.character.position.x * 1.15);
  });

  it('关闭 combat 模块后不产生任何攻击与切换事件', () => {
    const w = makeWorld();
    w.modules.combat = false;
    const events = run(w, 30, intent({ attackPressed: true, weaponSlot: 4, skill2Pressed: true }));
    expect(events.some((e) => e.type.startsWith('attack') || e.type === 'weapon-change'
      || e.type === 'channel-start' || e.type === 'projectile-fire' || e.type === 'ring-place')).toBe(false);
    expect(w.combat.weapon).toBe('sword-shield');
  });

  it('复位会清空连击与蓄力状态', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 5, attackPressed: true, attackHeld: true }));
    run(w, 20, intent({ attackHeld: true }));
    expect(w.combat.charging).toBe(true);
    const ev = run(w, 1, intent({ resetPressed: true }));
    expect(ev.some((e) => e.type === 'reset')).toBe(true);
    expect(w.combat.charging).toBe(false);
    expect(w.combat.charge).toBe(0);
    expect(w.combat.phase).toBe('idle');
  });
});

describe('战斗确定性', () => {
  it('含连击 / 施法 / 蓄力 / 换武器的输入序列结果逐字节一致', () => {
    const script = (t: number) => intent({
      moveX: Math.sin(t / 20),
      moveZ: -0.3,
      attackPressed: t % 37 === 0,
      attackHeld: t % 120 < 25,
      attackReleased: t % 120 === 25,
      skill2Pressed: t % 53 === 0,
      weaponSlot: t === 80 ? 4 : t === 170 ? 5 : 0,
    });
    const a = makeWorld();
    const b = makeWorld();
    runSteps(a, 300, script);
    runSteps(b, 300, script);
    expect(snapshot(a)).toBe(snapshot(b));
  });
});

describe('攻击节奏与位移解耦', () => {
  it('一段攻击依次经历 windup → active → recovery → settle → idle', () => {
    const w = makeWorld();
    const phases: string[] = [];
    run(w, 1, intent({ attackPressed: true }));
    phases.push(w.combat.phase);
    for (let i = 0; i < 60; i++) {
      run(w, 1, intent());
      if (phases[phases.length - 1] !== w.combat.phase) phases.push(w.combat.phase);
    }
    expect(phases).toEqual(['windup', 'active', 'recovery', 'settle', 'idle']);
  });

  it('settle 停顿期间 impulse 为 0、水平位移不再增加', () => {
    const w = makeWorld();
    run(w, 1, intent({ attackPressed: true }));
    let guard = 0;
    while (w.combat.phase !== 'settle' && guard++ < 100) run(w, 1, intent());
    expect(w.combat.phase).toBe('settle');
    const z0 = w.character.position.z;
    run(w, 3, intent());
    expect(w.impulse.x).toBe(0);
    expect(w.impulse.z).toBe(0);
    expect(Math.abs(w.character.position.z - z0)).toBeLessThan(1e-6);
  });

  it('三连击相邻两段的间隔 > 动作本体时长（中间确有停顿）', () => {
    const w = makeWorld();
    const ticks: number[] = [];
    let press = true;
    for (let i = 0; i < 260 && ticks.length < 3; i++) {
      step(w, w.config.fixedDt, intent({ attackPressed: press }));
      press = false;
      for (const e of w.events) {
        if (e.type === 'attack-start') ticks.push(e.tick);
        if (e.type === 'attack-end') press = true;
      }
    }
    expect(ticks).toHaveLength(3);
    const p = w.config.combat.weapons['sword-shield'];
    const bodySteps = (p.windup + p.active + p.recovery) / w.config.fixedDt;
    for (let i = 1; i < ticks.length; i++) {
      expect(ticks[i] - ticks[i - 1]).toBeGreaterThan(bodySteps + 1);
    }
  });

  it('移动中攻击的位移与静止攻击一致（不再叠加常速移动）', () => {
    const still = makeWorld();
    const moving = makeWorld();
    // 本用例验证「lunge 与常速移动解耦」，需隔离目标辅助：
    // 否则 moving 跑向敌群会锁定目标、启用动态前冲，比较的就不是同一条基线了。
    still.modules.targeting = false;
    moving.modules.targeting = false;

    run(still, 1, intent({ attackPressed: true }));
    run(moving, 40, intent({ moveZ: -1 })); // 先跑起来
    const stillZ0 = still.character.position.z;
    const movingZ0 = moving.character.position.z;
    run(moving, 1, intent({ moveZ: -1, attackPressed: true }));

    // active 阶段：位移严格相等，都只等于 lunge（attackMoveScale=0 锁死，移动键不叠加）。
    // 循环停在「进入 recovery 的下一帧前」：settle 保留余速（v7a#3 新行为）只在该阶段产生，
    // 不能算进 active 比较；settle 余速由下方独立用例验证。
    let g = 0;
    while (still.combat.phase !== 'recovery' && g++ < 100) {
      run(still, 1, intent());
      run(moving, 1, intent({ moveZ: -1 })); // 攻击期间持续按着移动键
    }
    expect(moving.combat.phase).toBe('recovery');
    const dStillActive = Math.abs(still.character.position.z - stillZ0);
    const dMovingActive = Math.abs(moving.character.position.z - movingZ0);
    expect(Math.abs(dMovingActive - dStillActive)).toBeLessThan(1e-6);

    // settle 停顿：保留一点余速（新行为 v7a#3），移动方向仍有少量推进，但远小于常速叠加。
    // 同步推进到 settle 阶段再测量（两者始终同帧），避免把 recovery（仍锁死）的帧算进去、
    // 也避免单独推进 moving 造成两者相位错位。
    let gs = 0;
    while (still.combat.phase !== 'settle' && gs++ < 50) {
      run(still, 1, intent());
      run(moving, 1, intent({ moveZ: -1 }));
    }
    expect(moving.combat.phase).toBe('settle');
    const settleZ0 = moving.character.position.z;
    run(still, 6, intent());
    run(moving, 6, intent({ moveZ: -1 }));
    const settleDrift = Math.abs(moving.character.position.z - settleZ0);
    expect(settleDrift).toBeGreaterThan(1e-4); // 确实保留了速度
    expect(settleDrift).toBeLessThan(0.4);      // 但只是少量，不是常速移动整段

    // 整段结束回到 idle：最终位移差距收敛（仅 settle 保留的少量余速）
    let g2 = 0;
    while (still.combat.phase !== 'idle' && g2++ < 100) {
      run(still, 1, intent());
      run(moving, 1, intent({ moveZ: -1 }));
    }
    const dStill = Math.abs(still.character.position.z - stillZ0);
    const dMoving = Math.abs(moving.character.position.z - movingZ0);
    expect(dMoving - dStill).toBeGreaterThan(0);
    expect(dMoving - dStill).toBeLessThan(0.5);
  });

  it('调高 attackMoveScale 后攻击期间可继续移动（配置生效）', () => {
    const locked = makeWorld();
    const loose = makeWorld();
    loose.config.combat.attackMoveScale = 0.5;
    run(locked, 1, intent({ moveX: 1, attackPressed: true }));
    run(loose, 1, intent({ moveX: 1, attackPressed: true }));
    let g = 0;
    while (loose.combat.phase !== 'idle' && g++ < 100) {
      run(locked, 1, intent({ moveX: 1 }));
      run(loose, 1, intent({ moveX: 1 }));
    }
    expect(loose.character.position.x).toBeGreaterThan(locked.character.position.x + 0.3);
  });
});
