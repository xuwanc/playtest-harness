import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { step } from '../src/core';
import { makeWorld, intent } from './helpers';

/**
 * v9s.75 · 三连节奏逐段差异化。
 *
 * 旧版三把武器、九段共用一组 `windup/active/recovery`，实测配比全是
 * 20~23 / 24~29 / 51~54 —— 读起来就是「同一个动作点三下」，玩家感受不到连段。
 *
 * 目标（`docs/systems/animation.md` §3.1）：
 *
 * | 段 | 前摇 | 挥击 | 收势 | 意图 |
 * |---|---|---|---|---|
 * | 1 | 25% | 25% | 50% | 建立节奏 |
 * | 2 | 18% | 25% | 57% | 承接动量：起手砍短、收势更长 |
 * | 3 | 35% | 20% | 45% | 终结技：蓄力更长、收势不拖 |
 *
 * 两条硬约束：`active` ≥ 5 帧（83ms，刀光才来得及成形）、`windup` ≤ 38%
 * （再长的话 `swingCurve` 已经在挥、判定还停在蓄势，`hitSweep` 的刃尖门会把命中推到后半段）。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const MELEE = ['sword-shield', 'dual-swords', 'greatsword'] as const;
const FRAME = 1 / 60;

function pct(t: { windup: number; active: number; recovery: number }) {
  const total = t.windup + t.active + t.recovery;
  return {
    windup: t.windup / total,
    active: t.active / total,
    recovery: t.recovery / total,
    total,
  };
}

describe('v9s.75 三连节奏：数据层', () => {
  it('三把近战都配了逐段时长，段数与 comboCount 一致', () => {
    for (const id of MELEE) {
      const p = raw.core.combat.weapons[id];
      expect(p.comboTimings, `${id} 缺 comboTimings`).toBeTruthy();
      expect(p.comboTimings!.length).toBe(p.comboCount);
    }
  });

  it('配比落到目标档（±3%），且三段不完全相同', () => {
    const want = [
      { windup: 0.25, active: 0.25, recovery: 0.50 },
      { windup: 0.18, active: 0.25, recovery: 0.57 },
      { windup: 0.35, active: 0.20, recovery: 0.45 },
    ];
    for (const id of MELEE) {
      const segs = raw.core.combat.weapons[id].comboTimings!;
      segs.forEach((seg, i) => {
        const r = pct(seg);
        expect(Math.abs(r.windup - want[i].windup), `${id} 段${i + 1} 前摇`).toBeLessThan(0.03);
        expect(Math.abs(r.active - want[i].active), `${id} 段${i + 1} 挥击`).toBeLessThan(0.03);
        expect(Math.abs(r.recovery - want[i].recovery), `${id} 段${i + 1} 收势`).toBeLessThan(0.03);
      });
      // 同质化回归守卫：三段配比必须不同，否则等于退回旧行为
      expect(pct(segs[0]).windup).not.toBeCloseTo(pct(segs[2]).windup, 3);
      expect(pct(segs[1]).windup).toBeLessThan(pct(segs[0]).windup);
    }
  });

  it('active 不短于 5 帧、windup 不超过 38%', () => {
    for (const id of MELEE) {
      const segs = raw.core.combat.weapons[id].comboTimings!;
      for (const seg of segs) {
        expect(seg.active, `${id} active ${seg.active}s 太短（刀光来不及成形）`)
          .toBeGreaterThanOrEqual(5 * FRAME - 1e-9);
        expect(pct(seg).windup, `${id} 前摇占比过大`).toBeLessThanOrEqual(0.38 + 1e-9);
      }
    }
  });

  it('终结技（第 3 段）不短于第 1 段', () => {
    for (const id of MELEE) {
      const segs = raw.core.combat.weapons[id].comboTimings!;
      expect(pct(segs[2]).total).toBeGreaterThanOrEqual(pct(segs[0]).total - 1e-9);
    }
  });
});

describe('v9s.75 三连节奏：状态机取到了逐段值', () => {
  it('连打三段，每段的 timings 与配置逐项相等', () => {
    const w = makeWorld();
    const seen: number[] = [];
    for (let i = 0; i < 120 && seen.length < 3; i++) {
      const pressed = i === 0 || (i % 8 === 0);
      step(w, w.config.fixedDt, intent({ attackPressed: pressed }));
      const c = w.combat;
      if (c.phase === 'windup' && !seen.includes(c.comboIndex)) {
        seen.push(c.comboIndex);
        const cfg = w.config.combat.weapons[c.weapon].comboTimings![c.comboIndex - 1];
        expect(c.timings.windup).toBeCloseTo(cfg.windup, 6);
        expect(c.timings.active).toBeCloseTo(cfg.active, 6);
        expect(c.timings.recovery).toBeCloseTo(cfg.recovery, 6);
      }
    }
    expect(seen.sort()).toEqual([1, 2, 3]);
  });

  it('没有 comboTimings 时回落到统一值（老配置 / 回滚路径）', () => {
    const w = makeWorld();
    const p = w.config.combat.weapons['sword-shield'] as { comboTimings?: unknown };
    const backup = p.comboTimings;
    delete p.comboTimings;
    try {
      step(w, w.config.fixedDt, intent({ attackPressed: true }));
      step(w, w.config.fixedDt, intent({}));
      expect(w.combat.phase).toBe('windup');
      expect(w.combat.timings.windup).toBeCloseTo(0.11, 6);
      expect(w.combat.timings.active).toBeCloseTo(0.12, 6);
      expect(w.combat.timings.recovery).toBeCloseTo(0.27, 6);
    } finally {
      p.comboTimings = backup;
    }
  });
});
