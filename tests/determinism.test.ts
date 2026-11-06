import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { cloneWorld, restoreWorld, runSteps, snapshot } from '../src/core';
import type { Intents } from '../src/core';
import { makeWorld, intent } from './helpers';

/** 一段可复现的输入脚本：包含方向变化、跳跃、冲刺、连击、施法、蓄力、武器切换与复位。 */
function scripted(tick: number): Intents {
  const phase = ((tick % 180) / 180) * Math.PI * 2;
  return intent({
    moveX: Math.sin(phase) * 0.8,
    moveZ: -Math.cos(phase) * 0.6,
    jumpPressed: tick % 97 === 0,
    sprintHeld: tick % 120 < 40,
    resetPressed: tick === 300,
    attackPressed: tick % 43 === 0,
    attackHeld: tick % 200 < 30,
    attackReleased: tick % 200 === 30,
    skill2Pressed: tick % 71 === 0,
    weaponSlot: tick === 150 ? 4 : tick === 320 ? 5 : tick === 450 ? 3 : 0,
  });
}

describe('确定性与契约快照', () => {
  it('同一输入序列跑两遍，最终状态逐字节一致', () => {
    const a = makeWorld();
    const b = makeWorld();
    runSteps(a, 600, scripted);
    runSteps(b, 600, scripted);
    expect(snapshot(a)).toBe(snapshot(b));
  });

  it('golden snapshot：固定输入序列的状态哈希不漂移', () => {
    const w = makeWorld();
    runSteps(w, 600, scripted);
    const hash = createHash('sha256').update(snapshot(w)).digest('hex');
    expect(hash).toMatchSnapshot();
  });

  it('快照 / 恢复无损：恢复后继续推进与未中断的结果一致', () => {
    const w = makeWorld();
    runSteps(w, 120, scripted);

    const restored = restoreWorld(snapshot(w));
    const twin = cloneWorld(w);
    runSteps(restored, 120, (t) => scripted(t + 120));
    runSteps(twin, 120, (t) => scripted(t + 120));

    expect(snapshot(restored)).toBe(snapshot(twin));
    expect(restored.tick).toBe(240);
  });

  it('固定步长：tick / time 严格累加，事件队列每步清空且带正确 tick', () => {
    const w = makeWorld();
    const dt = w.config.fixedDt;
    for (let i = 1; i <= 30; i++) {
      runSteps(w, 1, (t) => scripted(t + i * 100));
      expect(w.tick).toBe(i);
      expect(w.time).toBeCloseTo(i * dt, 6);
      expect(w.events.every((e) => e.tick === i)).toBe(true);
    }
  });
});
