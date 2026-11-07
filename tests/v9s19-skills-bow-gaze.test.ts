import { describe, expect, it } from 'vitest';
import { createWorld } from '../src/core';
import type { AppConfig } from '../src/core';
import { CONFIG, intent, makeWorld, run } from './helpers';

const DEG = Math.PI / 180;
const DT = 1 / 60;

/** 把假人全部推到范围外（world.dummies 仍在，但不会被注视 / 索敌读到）。 */
function clearDummies(w: ReturnType<typeof makeWorld>): void {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = 100;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
}

describe('v9s.19 头部回正：身体局部空间 + 慢速', () => {
  it('没有注视目标时，头相对身体的偏角按 headReturnRate 衰减（不是一帧弹回）', () => {
    const w = makeWorld();
    w.modules.gaze = false;
    w.modules.targeting = false;
    clearDummies(w);
    w.character.bodyYaw = 0;
    w.character.facing = 0;
    w.character.headYaw = 0.5; // 头偏了 28.6°

    const cap = (w.config.gaze.headReturnSpeedDeg * DEG) * DT;
    let prev = w.character.headYaw;
    let maxStep = 0;
    for (let i = 0; i < 30; i++) {
      run(w, 1, intent({}));
      const step = Math.abs(w.character.headYaw - prev);
      maxStep = Math.max(maxStep, step);
      prev = w.character.headYaw;
    }
    // 慢速：单帧只走约 5.7%（3.5/s 指数），远小于角速度上限
    expect(maxStep).toBeLessThan(cap + 1e-9);
    expect(w.character.headYaw).toBeGreaterThan(0.05);
    expect(w.character.headYaw).toBeLessThan(0.3);

    for (let i = 0; i < 90; i++) run(w, 1, intent({}));
    expect(Math.abs(w.character.headYaw)).toBeLessThan(0.01);
  });

  it('回正在 body 空间进行：身体转，头跟着转，只让「相对偏角」自己收敛', () => {
    const w = makeWorld();
    w.modules.gaze = false;
    w.modules.targeting = false;
    clearDummies(w);
    w.character.bodyYaw = 0;
    w.character.headYaw = 0.5;
    // 让身体目标（facing）指向 +60°：body 会平滑转过去，head 必须被身体「带着走」
    w.character.facing = 60 * DEG;

    const offset0 = w.character.headYaw - w.character.bodyYaw;
    const body0 = w.character.bodyYaw;
    for (let i = 0; i < 30; i++) run(w, 1, intent({}));
    const offset1 = w.character.headYaw - w.character.bodyYaw;

    // 身体确实转了
    expect(w.character.bodyYaw - body0).toBeGreaterThan(0.4);
    // 相对偏角单调收敛（而不是被世界坐标拉向 facing）
    expect(Math.abs(offset1)).toBeLessThan(Math.abs(offset0));
    // 头 = 身体 + 偏角：不会出现「头比身体还慢半拍」的滞后
    expect(w.character.headYaw).toBeCloseTo(w.character.bodyYaw + offset1, 10);
  });

  it('有注视目标时仍是高速跟随（回正逻辑不拖慢接敌）', () => {
    const w = makeWorld();
    clearDummies(w);
    w.modules.turnInPlace = false;
    w.character.bodyYaw = 0;
    w.character.headYaw = 0;
    w.dummies[0].position.x = -6;
    w.dummies[0].position.z = 8;
    w.dummies[0].mode = 'attack';

    for (let i = 0; i < 40; i++) run(w, 1, intent({ aimActive: true, aimX: 0, aimZ: 1 }));
    expect(w.gaze.active).toBe(true);
    // 头已经压到 -90° 附近（高速接敌），不是慢速回正的速度
    expect(w.character.headYaw).toBeLessThan(-70 * DEG);
  });
});

describe('v9s.19 弓箭：自动蓄力循环 + 轻度追踪', () => {
  /** 让弓箭手朝 +Z，假人在正前方 8m（受击冻结，避免 AI 走动）。 */
  function setup(w: ReturnType<typeof makeWorld>): void {
    clearDummies(w);
    w.modules.targeting = false;
    // 场地 z 上限 13.5：把弓手放在 -11、目标放在 -3，正好 8m 且都在场内
    w.character.position.x = 0;
    w.character.position.y = 0;
    w.character.position.z = -11;
    w.character.facing = 0;
    w.character.bodyYaw = 0;
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = -3;
    w.dummies[0].hurt.type = 'light';
    w.dummies[0].hurt.timer = 999;
    run(w, 1, intent({ weaponSlot: 5 }));
  }

  it('目标略偏 18° 也能命中（锥形内吸附 + 飞行修正）', () => {
    const w = makeWorld();
    setup(w);
    // 目标偏到 +19°（8m 处偏 2.7m）
    w.dummies[0].position.x = 2.7;
    w.dummies[0].position.z = -3.4;
    run(w, 1, intent({ attackHeld: true }));
    let hitAt = -1;
    for (let i = 0; i < 90 && hitAt < 0; i++) {
      run(w, 1, intent({ attackHeld: true }));
      if (w.hitCount > 0) hitAt = i;
    }
    expect(hitAt).toBeGreaterThan(0);
    const stuck = w.arrows.find((a) => a.stuck && a.stuckDummy === 0);
    expect(stuck).toBeTruthy();
  });

  it('目标横向移动仍能追到（追踪限速，不是瞬间转向）', () => {
    const w = makeWorld();
    setup(w);
    w.dummies[0].position.x = 1.2;
    w.dummies[0].position.z = -3;
    run(w, 1, intent({ attackHeld: true }));
    // 出箭后目标继续横移
    for (let i = 0; i < 90 && w.hitCount === 0; i++) {
      w.dummies[0].position.x += 0.045;
      run(w, 1, intent({ attackHeld: true }));
    }
    expect(w.hitCount).toBeGreaterThan(0);
  });

  it('按住自动循环：2s 内至少两箭，且第二箭不需要重新按下', () => {
    const w = makeWorld();
    setup(w);
    w.dummies[0].position.z = 13.5; // 24m 外，移出索敌范围；箭射向空处
    w.dummies[0].hurt.timer = 999;
    let shots = 0;
    for (let i = 0; i < 130; i++) {
      const before = w.combat.attackId;
      run(w, 1, intent({ attackHeld: true }));
      if (w.combat.attackId > before) shots += 1;
    }
    expect(shots).toBeGreaterThanOrEqual(2);
  });

  it('出弓自动抬弓：8m 外的目标，箭的竖直初速按距离解出（不是固定 3.5°）', () => {
    const w = makeWorld();
    setup(w);
    w.config.combat.bow.autoFire = false;
    run(w, 40, intent({ attackHeld: true }));
    run(w, 1, intent({ attackHeld: false, attackReleased: true }));
    const a = w.arrows[0];
    expect(a).toBeTruthy();
    expect(a.targetId).toBe(w.dummies[0].id);
    const flat = 16 * Math.sin(3.5 * DEG); // 旧版固定仰角的 vy
    expect(a.vy).not.toBeCloseTo(flat, 3);
  });
});

describe('v9s.19 技能模块化 / 数据驱动', () => {
  it('配置里的 skills 被解析成运行时实例，参数与 abilities 同源（热改立即生效）', () => {
    const w = makeWorld();
    expect(w.skills.map((s) => s.cfg.id)).toEqual(['arcane', 'ring']);
    expect(w.skills[0].params).toBe(w.config.abilities.arcane);
    expect(w.skills[1].params).toBe(w.config.abilities.ring);

    w.config.abilities.arcane.waves = 999;
    expect((w.skills[0].params as typeof w.config.abilities.arcane).waves).toBe(999);
  });

  it('禁用某条技能声明 → 对应技能完全不出手（其它技能不受影响）', () => {
    const w = makeWorld();
    const arcane = w.skills.find((s) => s.cfg.id === 'arcane')!;
    arcane.cfg.enabled = false;

    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 30, intent({ attackHeld: true }));
    expect(w.abilities.channeling).toBe(false);
    expect(w.abilities.projectiles.length).toBe(0);

    // 电环仍可放
    run(w, 1, intent({ skill2Pressed: true }));
    expect(w.abilities.rings.length).toBe(1);
  });

  it('武器不匹配的技能不会触发（弓不放环）', () => {
    const w = makeWorld();
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 1, intent({ skill2Pressed: true, attackHeld: true }));
    expect(w.abilities.rings.length).toBe(0);
    expect(w.abilities.channeling).toBe(false);
  });

  it('新增一条内联参数的技能声明即可生效（不改任何 dispatch 代码）', () => {
    const core = JSON.parse(JSON.stringify(CONFIG.core)) as AppConfig['core'];
    core.skills.push({
      id: 'big-ring',
      kind: 'groundRing',
      slot: 'skill2',
      weapon: 'staff',
      params: {
        radius: 5.5,
        duration: 2,
        pulseInterval: 0.3,
        stun: 0.5,
        knockback: 0.4,
      },
    });
    const w = createWorld(core, CONFIG.scene);
    expect(w.skills.length).toBe(3);

    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 1, intent({ skill2Pressed: true }));
    // 两条 groundRing 各放一个：半径分别来自各自 params
    const radii = w.abilities.rings.map((r) => r.radius).sort();
    expect(radii).toEqual([2.4, 5.5]);
  });

  it('未知 kind 被忽略而不是崩溃（配置容错）', () => {
    const core = JSON.parse(JSON.stringify(CONFIG.core)) as AppConfig['core'];
    core.skills.push({
      id: 'future-skill',
      kind: 'notImplemented' as unknown as AppConfig['core']['skills'][number]['kind'],
      slot: 'attack',
      params: {},
    });
    const w = createWorld(core, CONFIG.scene);
    expect(() => run(w, 3, intent({ attackHeld: true }))).not.toThrow();
  });
});
