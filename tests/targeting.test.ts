import { describe, expect, it } from 'vitest';
import { runSteps, snapshot, step, wrapAngle } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld, run } from './helpers';

/**
 * 造一个「只有一个静止假人」的场景：其余假人挪到范围外并置为 idle，
 * 避免抢目标、避免 AI 移动干扰前冲距离断言。
 * target 放在玩家正前方（-Z）dist 米处。
 */
function soloTarget(dist: number): World {
  const w = makeWorld();
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

describe('智能目标选择', () => {
  it('初始状态：敌人在背后、前方扇区内无候选 → 不锁定目标', () => {
    const w = makeWorld();
    run(w, 1, intent());
    expect(w.targeting.hasTarget).toBe(false);
    expect(w.targeting.targetId).toBe(0);
  });

  it('朝敌群方向移动时锁定最近的正面目标，评分偏向更正面的敌人', () => {
    const w = makeWorld();
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 5;
    run(w, 1, intent({ moveZ: -1 }));
    expect(w.targeting.hasTarget).toBe(true);
    expect(w.targeting.targetId).toBe(1); // 正前方 3m，优于两侧 3.6m
    expect(Math.abs(wrapAngle(w.targeting.targetYaw - Math.PI))).toBeLessThan(0.05);
    expect(w.targeting.targetDist).toBeCloseTo(3, 1);
  });

  it('背对敌人时攻击保持原朝向（不会强行扭头）', () => {
    const w = makeWorld();
    run(w, 1, intent());
    expect(w.targeting.hasTarget).toBe(false);
    run(w, 1, intent({ attackPressed: true }));
    expect(Math.abs(wrapAngle(w.combat.attackFacing - 0))).toBeLessThan(1e-6);
  });

  it('有目标时攻击朝向锁定到目标方向', () => {
    const w = soloTarget(3);
    run(w, 1, intent({ moveZ: -1, attackPressed: true }));
    expect(w.targeting.hasTarget).toBe(true);
    expect(Math.abs(wrapAngle(w.combat.attackFacing - w.targeting.targetYaw))).toBeLessThan(1e-6);
  });

  it('关闭 targeting 模块 / targetAssist 后退回「无目标」基础行为', () => {
    const off = soloTarget(3);
    off.modules.targeting = false;
    run(off, 1, intent({ moveZ: -1, attackPressed: true }));
    expect(off.targeting.hasTarget).toBe(false);
    expect(off.combat.timings.lunge).toBeCloseTo(0.45, 6);

    const noAssist = soloTarget(3);
    noAssist.config.targeting.targetAssist = false;
    run(noAssist, 1, intent({ moveZ: -1, attackPressed: true }));
    expect(noAssist.combat.timings.lunge).toBeCloseTo(0.45, 6);
    expect(Math.abs(wrapAngle(noAssist.combat.attackFacing - Math.PI))).toBeLessThan(1e-6);
  });
});

describe('有目标时的动态前冲（每击结束保持适当距离）', () => {
  it('目标远 → 放大前冲；目标已在理想距离内 → 不再前冲，避免怼脸', () => {
    const far = soloTarget(4.5);
    const near = soloTarget(1.0);
    run(far, 1, intent({ moveZ: -1, attackPressed: true }));
    run(near, 1, intent({ moveZ: -1, attackPressed: true }));
    expect(far.combat.timings.lunge).toBeGreaterThan(0.5);
    expect(far.combat.timings.lunge).toBeLessThanOrEqual(0.45 * far.config.targeting.maxLungeScale + 1e-6);
    // 目标已在理想距离内：仍有「最小前冲」（minLungeScale × 基础 lunge），不会完全修没，攻击始终有明显的跨步
    const minLunge = 0.45 * near.config.combat.minLungeScale;
    expect(near.combat.timings.lunge).toBeGreaterThanOrEqual(minLunge - 1e-6);
    expect(near.combat.timings.lunge).toBeLessThanOrEqual(minLunge + 0.02);
  });

  it('近身目标：整段攻击跑完后玩家仍与目标保持间距，不重叠', () => {
    const w = soloTarget(1.1);
    run(w, 1, intent({ moveZ: -1, attackPressed: true }));
    let guard = 0;
    while (w.combat.phase !== 'idle' && guard++ < 120) run(w, 1, intent());
    const s = w.dummies[0];
    const d = Math.hypot(w.character.position.x - s.position.x, w.character.position.z - s.position.z);
    expect(d).toBeGreaterThan(w.config.characterRadius + w.config.dummies.radius - 1e-6);
    expect(d).toBeGreaterThan(w.config.targeting.idealRange * 0.6);
  });

  it('调大 idealRange 会减小前冲（配置热生效）', () => {
    // 用 2m 目标：两者都不会撞到 maxLungeScale 上限，才能看出理想距离的影响
    const a = soloTarget(2.0);
    const b = soloTarget(2.0);
    b.config.targeting.idealRange = 3.5;
    run(a, 1, intent({ moveZ: -1, attackPressed: true }));
    run(b, 1, intent({ moveZ: -1, attackPressed: true }));
    expect(a.combat.timings.lunge).toBeGreaterThan(0.3);
    // 调大 idealRange 后 gap 为负，前冲被压到只剩「最小前冲」（base × minLungeScale），明显小于 a
    const minLunge = 0.45 * b.config.combat.minLungeScale;
    expect(b.combat.timings.lunge).toBeGreaterThanOrEqual(minLunge - 1e-6);
    expect(b.combat.timings.lunge).toBeLessThanOrEqual(minLunge + 0.02);
    expect(b.combat.timings.lunge).toBeLessThan(a.combat.timings.lunge);
  });
});

describe('弓蓄力面向目标', () => {
  it('按住弓蓄力时面朝向锁定目标，覆盖摇杆方向', () => {
    const w = makeWorld();
    for (let i = 1; i < w.dummies.length; i++) {
      w.dummies[i].position.x = 12;
      w.dummies[i].position.z = 12;
      w.dummies[i].mode = 'idle';
    }
    const s = w.dummies[0];
    s.mode = 'idle';
    s.position.x = 2;
    s.position.z = 5; // 斜前方，yaw ≈ 146°
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 1, intent({ moveZ: -1 }));
    expect(w.targeting.hasTarget).toBe(true);
    const aim = w.targeting.targetYaw;
    run(w, 1, intent({ moveX: 1, attackPressed: true, attackHeld: true }));
    expect(w.combat.charging).toBe(true);
    expect(w.targeting.hasTarget).toBe(true);
    // 摇杆指 +X(90°)，但面朝向应贴合目标(≈146°)
    expect(Math.abs(wrapAngle(w.character.facing - w.targeting.targetYaw))).toBeLessThan(0.05);
    expect(Math.abs(wrapAngle(w.character.facing - Math.PI / 2))).toBeGreaterThan(0.5);
    expect(Math.abs(wrapAngle(aim - w.targeting.targetYaw))).toBeLessThan(0.05);
  });
});

describe('按住攻击键自动连击', () => {
  it('attackHeld 持续为真时无需再次按下即可连续起手（1→2→3→1…）', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const starts: number[] = [];
    for (let i = 0; i < 300; i++) {
      step(w, w.config.fixedDt, intent({ attackHeld: true }));
      for (const e of w.events) if (e.type === 'attack-start') starts.push(e.value);
    }
    expect(starts.length).toBeGreaterThanOrEqual(4);
    expect(starts.slice(0, 4)).toEqual([1, 2, 3, 1]);
  });

  it('关闭 autoCombo 后按住不再起手；松开后当前段结束即停', () => {
    const off = makeWorld();
    off.modules.targeting = false;
    off.config.combat.autoCombo = false;
    const offEvents = run(off, 300, intent({ attackHeld: true }));
    expect(offEvents.some((e) => e.type === 'attack-start')).toBe(false);

    const held = makeWorld();
    held.modules.targeting = false;
    run(held, 45, intent({ attackHeld: true }));
    let guard = 0;
    while (held.combat.phase !== 'idle' && guard++ < 120) run(held, 1, intent());
    const after = run(held, 60, intent());
    expect(after.some((e) => e.type === 'attack-start')).toBe(false);
  });

  it('含目标辅助 / 自动连击 / 命中的长序列结果逐字节一致', () => {
    const script = (t: number) => intent({
      moveX: Math.sin(t / 21) * 0.7,
      moveZ: -Math.cos(t / 33) * 0.6,
      attackPressed: t % 29 === 0,
      attackHeld: t % 140 < 60,
      attackReleased: t % 140 === 60,
      weaponSlot: t === 120 ? 3 : t === 300 ? 5 : 0,
      dummyClickId: t % 89 === 0 ? ((t / 89) % 4) + 1 : 0,
    });
    const a = makeWorld();
    const b = makeWorld();
    runSteps(a, 400, script);
    runSteps(b, 400, script);
    expect(snapshot(a)).toBe(snapshot(b));
  });
});
