import { describe, expect, it } from 'vitest';
import { EMPTY_INTENTS, step } from '../src/core';
import type { Intents } from '../src/core';
import { makeWorld, place, run } from './helpers';

const FWD: Intents = { ...EMPTY_INTENTS, moveZ: -1 };
const RIGHT: Intents = { ...EMPTY_INTENTS, moveX: 1 };

describe('场景与移动手感', () => {
  it('静止时角色稳定站在地面，不下陷也不漂移', () => {
    const w = makeWorld();
    run(w, 60, EMPTY_INTENTS);
    expect(w.character.position.x).toBeCloseTo(0, 3);
    expect(w.character.position.y).toBeCloseTo(0, 3);
    expect(w.character.position.z).toBeCloseTo(8, 3);
    expect(w.character.grounded).toBe(true);
  });

  it('摇杆前进：角色向 -Z 移动且保持落地', () => {
    const w = makeWorld();
    const events = run(w, 60, FWD);
    expect(w.character.position.z).toBeLessThan(5.5);
    expect(w.character.grounded).toBe(true);
    expect(events.some((e) => e.type === 'blocked')).toBe(false);
  });

  it('0.25 矮台阶：无需跳跃自动登顶', () => {
    const w = makeWorld();
    place(w, -7.5, 4);
    const events = run(w, 45, FWD);
    expect(events.some((e) => e.type === 'stepUp' && Math.abs(e.value - 0.25) < 0.01)).toBe(true);
    expect(w.character.position.y).toBeGreaterThan(0.24);
  });

  it('0.40 台阶（阈值内）：同样可自动爬升', () => {
    const w = makeWorld();
    place(w, -4.5, 4);
    const events = run(w, 45, FWD);
    expect(events.some((e) => e.type === 'stepUp' && Math.abs(e.value - 0.4) < 0.01)).toBe(true);
    expect(w.character.position.y).toBeGreaterThan(0.39);
  });

  it('0.60 高台阶（超阈值）：直接走会被挡住', () => {
    const w = makeWorld();
    place(w, -1.5, 4);
    const events = run(w, 60, FWD);
    expect(w.character.position.z).toBeGreaterThan(3.3);
    expect(w.character.position.y).toBeLessThan(0.05);
    expect(events.some((e) => e.type === 'blocked')).toBe(true);
  });

  it('跳跃：离地、落回、事件完整', () => {
    const w = makeWorld();
    let maxY = 0;
    const events = [];
    for (let i = 0; i < 120; i++) {
      step(w, w.config.fixedDt, i === 0 ? { ...EMPTY_INTENTS, jumpPressed: true } : EMPTY_INTENTS);
      maxY = Math.max(maxY, w.character.position.y);
      events.push(...w.events);
    }
    expect(maxY).toBeGreaterThan(0.8);
    expect(events.some((e) => e.type === 'jumped')).toBe(true);
    expect(events.some((e) => e.type === 'landed')).toBe(true);
    expect(w.character.position.y).toBeCloseTo(0, 2);
    expect(w.character.grounded).toBe(true);
  });

  it('跳跃 + 前进可越过 0.60 台阶的高度', () => {
    const w = makeWorld();
    place(w, -1.5, 4);
    let maxY = 0;
    for (let i = 0; i < 120; i++) {
      step(w, w.config.fixedDt, i < 3 ? { ...FWD, jumpPressed: i === 0 } : FWD);
      maxY = Math.max(maxY, w.character.position.y);
    }
    expect(maxY).toBeGreaterThan(0.6);
    expect(w.character.grounded).toBe(true);
  });

  it('宽门洞（2.4m > 角色直径）：可顺畅穿过', () => {
    const w = makeWorld();
    place(w, -3, -1);
    const events = run(w, 60, FWD);
    expect(w.character.position.z).toBeLessThan(-3.6);
    expect(events.some((e) => e.type === 'blocked')).toBe(false);
  });

  it('窄门洞（0.5m < 角色直径 0.6m）：必须被挡住', () => {
    const w = makeWorld();
    place(w, 4, -1);
    const events = run(w, 60, FWD);
    expect(w.character.position.z).toBeGreaterThan(-2.8);
    expect(events.some((e) => e.type === 'blocked')).toBe(true);
  });

  it('冲刺：相同时间内位移显著大于普通移动', () => {
    const normal = makeWorld();
    const sprint = makeWorld();
    run(normal, 60, RIGHT);
    run(sprint, 60, { ...RIGHT, sprintHeld: true });
    const dn = normal.character.position.x;
    const ds = sprint.character.position.x;
    expect(ds).toBeGreaterThan(dn * 1.3);
    expect(sprint.character.sprinting).toBe(true);
  });

  it('复位：回到出生点并发出 reset 事件', () => {
    const w = makeWorld();
    run(w, 40, RIGHT);
    expect(w.character.position.x).toBeGreaterThan(1);
    const events = run(w, 1, { ...EMPTY_INTENTS, resetPressed: true });
    expect(w.character.position.x).toBeCloseTo(0, 3);
    expect(w.character.position.z).toBeCloseTo(8, 3);
    expect(events.some((e) => e.type === 'reset')).toBe(true);
  });

  it('世界边界：长时间移动不会越界或产生 NaN', () => {
    const w = makeWorld();
    run(w, 400, RIGHT);
    expect(w.character.position.x).toBeLessThanOrEqual(w.config.worldBounds.maxX + 1e-6);
    expect(Number.isFinite(w.character.position.x)).toBe(true);
    expect(Number.isFinite(w.character.position.y)).toBe(true);
  });
});
