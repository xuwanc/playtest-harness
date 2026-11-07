import { describe, expect, it } from 'vitest';
import { WEAPON_ORDER, step } from '../src/core';
import { intent, makeWorld, place, run } from './helpers';

const PRESS = intent({ sprintPressed: true });
const IDLE = intent();

/** 用槽位切武器：先跑一步让 weapon-change 生效。 */
function equip(w: ReturnType<typeof makeWorld>, slot: number): void {
  step(w, w.config.fixedDt, intent({ weaponSlot: slot }));
}

describe('冲刺 / 闪避：物理武器翻滚、法杖闪现', () => {
  it('物理武器（剑盾）按下冲刺 → 触发翻滚，产生 roll 事件与 active 阶段', () => {
    const w = makeWorld();
    equip(w, 1);
    const events = run(w, 1, PRESS);
    expect(events.some((e) => e.type === 'roll')).toBe(true);
    expect(w.dash.kind).toBe('roll');
    expect(w.dash.phase).toBe('active');
    expect(w.dash.id).toBe(1);
    expect(w.dash.cooldown).toBeGreaterThan(0);
  });

  it('翻滚沿输入方向位移，结束后总位移收敛到 rollDistance', () => {
    const w = makeWorld();
    equip(w, 1);
    const from = { x: w.character.position.x, z: w.character.position.z };
    // 朝 -Z 翻滚
    run(w, 1, intent({ sprintPressed: true, moveZ: -1 }));
    const frames = Math.ceil(w.config.dash.rollDuration / w.config.fixedDt) + 4;
    run(w, frames, IDLE);
    expect(w.dash.phase).toBe('idle');
    const dz = from.z - w.character.position.z;
    expect(dz).toBeGreaterThan(w.config.dash.rollDistance * 0.82);
    expect(dz).toBeLessThan(w.config.dash.rollDistance * 1.1);
    expect(Math.abs(w.character.position.x - from.x)).toBeLessThan(0.15);
  });

  it('翻滚期间方向键不叠加位移：位移严格由 impulse 决定', () => {
    const withDir = makeWorld();
    const noDir = makeWorld();
    equip(withDir, 1);
    equip(noDir, 1);
    // 触发帧两者输入一致，保证起点完全相同
    run(withDir, 1, intent({ sprintPressed: true, moveZ: -1 }));
    run(noDir, 1, intent({ sprintPressed: true, moveZ: -1 }));

    // 逐帧推进：只有「翻滚 active 且仍会写 impulse」的帧才制造输入差异，
    // 其余帧两者输入完全一致 —— 避免把翻滚结束后的普通移动算进断言。
    const maxFrames = Math.ceil(withDir.config.dash.rollDuration / withDir.config.fixedDt) + 6;
    let rollFrames = 0;
    for (let i = 0; i < maxFrames; i++) {
      const rolling = withDir.dash.phase === 'active' && withDir.dash.timer > 0;
      if (rolling) rollFrames += 1;
      run(withDir, 1, intent({ moveZ: -1 }));
      run(noDir, 1, rolling ? IDLE : intent({ moveZ: -1 }));
    }
    expect(rollFrames).toBeGreaterThan(3);
    expect(withDir.dash.phase).toBe('idle');
    expect(withDir.character.position.z).toBeCloseTo(noDir.character.position.z, 2);
    expect(withDir.character.position.x).toBeCloseTo(noDir.character.position.x, 2);
  });

  it('法杖按下冲刺 → 瞬移闪现，产生 blink 事件且单帧完成', () => {
    const w = makeWorld();
    equip(w, 4); // staff
    const from = { x: w.character.position.x, z: w.character.position.z };
    const events = run(w, 1, intent({ sprintPressed: true, moveZ: -1 }));
    expect(events.some((e) => e.type === 'blink')).toBe(true);
    expect(w.dash.kind).toBe('blink');
    expect(w.dash.phase).toBe('idle'); // 瞬时，不进入 active
    const moved = from.z - w.character.position.z;
    expect(moved).toBeGreaterThan(1);
    expect(w.dash.toZ).toBeCloseTo(w.character.position.z, 3);
    expect(w.character.velocity.x).toBe(0);
    expect(w.character.velocity.z).toBe(0);
  });

  it('闪现不会穿墙：朝障碍墙闪现会停在墙前', () => {
    const w = makeWorld();
    equip(w, 4);
    // wall-a 位于 x=7.5, z=1, 宽 3.5 深 0.6；从 (7.5, 3) 朝 -Z 冲向它
    place(w, 7.5, 3);
    run(w, 1, intent({ sprintPressed: true, moveZ: -1 }));
    // 落点不应越过墙的近侧（z 约 1.3 + 半径）
    expect(w.character.position.z).toBeGreaterThan(1.0);
    expect(w.character.position.z).toBeLessThan(3);
  });

  it('闪现受世界边界约束，不会越界', () => {
    const w = makeWorld();
    equip(w, 4);
    place(w, 12.8, 0);
    run(w, 1, intent({ sprintPressed: true, moveX: 1 }));
    expect(w.character.position.x).toBeLessThanOrEqual(w.config.worldBounds.maxX + 1e-6);
  });

  it('冷却期间无法再次触发，冷却结束后发 dash-ready 并可再次触发', () => {
    const w = makeWorld();
    equip(w, 1);
    run(w, 1, PRESS);
    const id1 = w.dash.id;
    // 冷却中反复按
    run(w, 5, PRESS);
    expect(w.dash.id).toBe(id1);

    const cdFrames = Math.ceil(w.config.dash.rollCooldown / w.config.fixedDt) + 4;
    const events = run(w, cdFrames, IDLE);
    expect(events.some((e) => e.type === 'dash-ready')).toBe(true);
    run(w, 1, PRESS);
    expect(w.dash.id).toBe(id1 + 1);
  });

  it('翻滚进行中禁止攻击起手，避免两套动画打架', () => {
    const w = makeWorld();
    equip(w, 1);
    run(w, 1, PRESS);
    const events = run(w, 1, intent({ attackPressed: true }));
    expect(w.combat.phase).toBe('idle');
    expect(events.some((e) => e.type === 'attack-start')).toBe(false);
  });

  it('攻击进行中禁止翻滚起手（combat 非 idle）', () => {
    const w = makeWorld();
    equip(w, 1);
    run(w, 1, intent({ attackPressed: true }));
    expect(w.combat.phase).not.toBe('idle');
    run(w, 1, PRESS);
    expect(w.dash.id).toBe(0);
  });

  it('弓蓄力中翻滚会打断蓄力（v9s.19：自动连射不再锁死冲刺）', () => {
    const w = makeWorld();
    equip(w, 5); // bow
    run(w, 1, intent({ attackPressed: true, attackHeld: true }));
    expect(w.combat.charging).toBe(true);
    // 按住攻击的同时按冲刺：翻滚优先，这一箭作废（不发射）
    run(w, 1, intent({ sprintPressed: true, attackHeld: true }));
    expect(w.dash.id).toBe(1);
    expect(w.combat.charging).toBe(false);
    expect(w.combat.charge).toBe(0);
    expect(w.arrows.length).toBe(0);
  });

  it('无方向输入时朝面朝向翻滚', () => {
    const w = makeWorld();
    equip(w, 1);
    w.character.facing = Math.PI / 2; // +X
    const x0 = w.character.position.x;
    run(w, 1, PRESS);
    expect(w.dash.dirX).toBeCloseTo(1, 3);
    expect(w.dash.dirZ).toBeCloseTo(0, 3);
    const frames = Math.ceil(w.config.dash.rollDuration / w.config.fixedDt) + 2;
    run(w, frames, IDLE);
    expect(w.character.position.x - x0).toBeGreaterThan(1);
  });

  it('关闭 dash 模块后冲刺沿完全不触发', () => {
    const w = makeWorld();
    w.modules.dash = false;
    equip(w, 1);
    const events = run(w, 30, PRESS);
    expect(events.some((e) => e.type === 'roll' || e.type === 'blink')).toBe(false);
    expect(w.dash.id).toBe(0);
  });

  it('复位清空冲刺状态（含冷却与 active）', () => {
    const w = makeWorld();
    equip(w, 1);
    run(w, 1, PRESS);
    expect(w.dash.phase).toBe('active');
    run(w, 1, intent({ resetPressed: true }));
    expect(w.dash.phase).toBe('idle');
    expect(w.dash.cooldown).toBe(0);
    expect(w.dash.dirX).toBe(0);
  });

  it('五种武器除法杖外全部走翻滚', () => {
    for (let slot = 1; slot <= WEAPON_ORDER.length; slot++) {
      const w = makeWorld();
      equip(w, slot);
      run(w, 1, PRESS);
      const expected = w.combat.weapon === 'staff' ? 'blink' : 'roll';
      expect(w.dash.kind).toBe(expected);
    }
  });

  it('确定性：同输入序列逐字节一致', () => {
    const script = (w: ReturnType<typeof makeWorld>) => {
      equip(w, 2);
      run(w, 1, intent({ sprintPressed: true, moveX: 1 }));
      run(w, 40, IDLE);
      equip(w, 4);
      run(w, 1, intent({ sprintPressed: true, moveZ: -1 }));
      run(w, 40, intent({ moveZ: -1 }));
    };
    const a = makeWorld();
    const b = makeWorld();
    script(a);
    script(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
