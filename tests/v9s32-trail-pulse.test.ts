import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { createWeaponTrail } from '../src/presentation/weapon-trail';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const cfg = raw.view.weaponTrail;

describe('v9s.32 挥空反馈：刀光脉冲', () => {
  it('pulse 后读数上升，随时间衰减到 0', () => {
    const trail = createWeaponTrail({ ...cfg, enabled: true });
    expect(trail.debug().pulse).toBe(0);
    trail.pulse(0.8);
    expect(trail.debug().pulse).toBeCloseTo(0.8, 5);

    // 60fps 下过 0.3s，应基本熄灭（decay 14 → e^-4.2 ≈ 0.015）
    for (let i = 0; i < 18; i++) trail.update(1 / 60, null, false);
    expect(trail.debug().pulse).toBeLessThan(0.05);
    for (let i = 0; i < 30; i++) trail.update(1 / 60, null, false);
    expect(trail.debug().pulse).toBe(0);
    trail.dispose();
  });

  it('多次 pulse 有上限，不会叠出离谱的亮度', () => {
    const trail = createWeaponTrail({ ...cfg, enabled: true });
    for (let i = 0; i < 10; i++) trail.pulse(0.9);
    expect(trail.debug().pulse).toBeLessThanOrEqual(1.5);
    trail.dispose();
  });

  it('reset 会清掉脉冲（换武器 / 复位后不残留）', () => {
    const trail = createWeaponTrail({ ...cfg, enabled: true });
    trail.pulse(1.2);
    trail.reset();
    expect(trail.debug().pulse).toBe(0);
    trail.dispose();
  });
});
