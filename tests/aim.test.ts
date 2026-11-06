import { describe, expect, it } from 'vitest';
import { resolveDashDir, resolveFacingYaw, step } from '../src/core';
import { intent, makeWorld, place, run } from './helpers';

/** 用槽位切武器：先跑一步让 weapon-change 生效。 */
function equip(w: ReturnType<typeof makeWorld>, slot: number): void {
  step(w, w.config.fixedDt, intent({ weaponSlot: slot }));
}

/**
 * v7c #11：攻击 / 技2 按钮拖拽辅助朝向。
 * 校验统一朝向解析的优先级（拖拽 > 锁定目标 > 移动 > 面朝向），以及
 * 「未拖拽时行为与旧版一致」这一兼容性契约，和翻滚 / 闪现方向确实吃到拖拽。
 */
describe('拖拽辅助朝向', () => {
  it('resolveFacingYaw：拖拽优先于智能锁定目标与移动输入', () => {
    const w = makeWorld();
    // 造一个明确的目标（前方 +Z），让软锁定有值
    place(w, 0, 0);
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 3;
    w.targeting.hasTarget = true;
    w.targeting.targetYaw = 0; // 目标在 +Z（yaw=0）
    w.targeting.targetDist = 3;

    // 无拖拽、有目标 → 锁定目标 yaw=0
    expect(resolveFacingYaw(w, intent({ moveX: 1, moveZ: 0 }))).toBeCloseTo(0, 6);
    // 拖拽指向 +X → 覆盖目标与移动，yaw=π/2
    const yaw = resolveFacingYaw(w, intent({ moveX: 0, moveZ: 1, aimX: 1, aimZ: 0, aimActive: true }));
    expect(yaw).toBeCloseTo(Math.PI / 2, 6);
  });

  it('resolveFacingYaw：未拖拽时退回旧逻辑（移动方向 / 面朝向）', () => {
    const w = makeWorld();
    place(w, 0, 0);
    w.targeting.hasTarget = false;
    w.character.facing = 0.7;
    expect(resolveFacingYaw(w, intent({ moveX: 1, moveZ: 0 }))).toBeCloseTo(Math.PI / 2, 6);
    expect(resolveFacingYaw(w, intent())).toBeCloseTo(0.7, 6);
  });

  it('攻击起手锁定拖拽朝向：attackFacing 采用拖拽方向而非锁定目标', () => {
    const w = makeWorld();
    equip(w, 1);
    place(w, 0, 0);
    w.dummies[0].position.x = 0;
    w.dummies[0].position.z = 3;
    // 拖拽指向 +X 起手
    run(w, 1, intent({ attackPressed: true, attackHeld: true, aimX: 1, aimZ: 0, aimActive: true }));
    expect(w.combat.phase).not.toBe('idle');
    expect(w.combat.attackFacing).toBeCloseTo(Math.PI / 2, 6);
  });

  it('翻滚方向吃到拖拽辅助朝向（aim 优先于 moveX/moveZ）', () => {
    const w = makeWorld();
    equip(w, 1); // 剑 → 翻滚
    place(w, 0, 0);
    // 拖拽指向 -X，同时移动输入指向 +Z，应以拖拽为准
    const dir = resolveDashDir(w, intent({ moveX: 0, moveZ: 1, aimX: -1, aimZ: 0, aimActive: true }));
    expect(dir.x).toBeCloseTo(-1, 6);
    expect(dir.z).toBeCloseTo(0, 6);
    run(w, 1, intent({ sprintPressed: true, moveX: 0, moveZ: 1, aimX: -1, aimZ: 0, aimActive: true }));
    expect(w.dash.kind).toBe('roll');
    expect(w.dash.dirX).toBeCloseTo(-1, 6);
    expect(w.dash.dirZ).toBeCloseTo(0, 6);
  });

  it('法杖闪现方向吃到拖拽辅助朝向', () => {
    const w = makeWorld();
    equip(w, 4); // staff → 闪现
    place(w, 0, 0);
    run(w, 1, intent({ sprintPressed: true, aimX: 0, aimZ: -1, aimActive: true }));
    expect(w.dash.kind).toBe('blink');
    expect(w.dash.dirX).toBeCloseTo(0, 6);
    expect(w.dash.dirZ).toBeCloseTo(-1, 6);
  });

  it('未拖拽时冲刺方向仍取移动输入（兼容旧行为）', () => {
    const w = makeWorld();
    equip(w, 1);
    place(w, 0, 0);
    run(w, 1, intent({ sprintPressed: true, moveX: 1, moveZ: 0 }));
    expect(w.dash.dirX).toBeCloseTo(1, 6);
    expect(w.dash.dirZ).toBeCloseTo(0, 6);
  });
});
