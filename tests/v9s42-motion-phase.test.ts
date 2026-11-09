import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { stanceOf, wrapPhase } from '../src/presentation/motion-debug';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { AppConfig } from '../src/core';
import { intent, makeWorld, run } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

function makeRig(w = makeWorld()) {
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
  );
  return { w, rig };
}

/** 展开到连续值，用来断言「相位单调推进」而不被 %TAU 骗 */
function unwrap(prev: number, cur: number): number {
  let d = cur - prev;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

describe('v9s.42 手感面板相位曲线', () => {
  it('stanceOf：正半周左脚踩地、负半周右脚踩地', () => {
    expect(stanceOf(Math.PI / 2, 2, true)).toBe('L');
    expect(stanceOf(-Math.PI / 2, 2, true)).toBe('R');
    // 同一个相位在不同「腿」上是对称的：3π/2 等价于 -π/2
    expect(stanceOf((Math.PI * 3) / 2, 2, true)).toBe('R');
    expect(stanceOf((Math.PI * 5) / 2, 2, true)).toBe('L');   // 多绕一圈仍然左
  });

  it('stanceOf：过零是双支撑，站立是双踩，离地是腾空', () => {
    expect(stanceOf(0, 2, true)).toBe('both');
    expect(stanceOf(0.1, 2, true)).toBe('both');    // |sin| < 0.16 带宽内
    expect(stanceOf(Math.PI, 2, true)).toBe('both');
    // 站着不动：Core 相位冻在任意值上，但两只脚都着地
    expect(stanceOf(Math.PI / 2, 0, true)).toBe('both');
    expect(stanceOf(Math.PI / 2, 2, false)).toBe('air');
    // 离地优先级最高（跳跃中不管相位在哪都不算踩地）
    expect(stanceOf(Math.PI / 2, 0, false)).toBe('air');
  });

  it('wrapPhase：负数与超一圈都归一到 [0, 2π)', () => {
    expect(wrapPhase(0)).toBeCloseTo(0, 12);
    expect(wrapPhase(-0.5)).toBeCloseTo(Math.PI * 2 - 0.5, 12);
    expect(wrapPhase(Math.PI * 3)).toBeCloseTo(Math.PI, 12);
    expect(wrapPhase(Math.PI * 2)).toBeCloseTo(0, 12);
    for (const v of [-13.7, 0.3, 7.9, 100.2]) {
      const r = wrapPhase(v);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(Math.PI * 2);
    }
  });

  it('直线跑：相位每帧递增，且正负半周都出现过（曲线不是平的）', () => {
    const { w, rig } = makeRig();
    run(w, 1, intent({ moveZ: 1 }));
    let prev = rig.gaitDebug().phase;
    let signed = 0;
    let sawL = false;
    let sawR = false;
    for (let i = 0; i < 60; i++) {
      run(w, 1, intent({ moveZ: 1 }));
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
      const cur = rig.gaitDebug().phase;
      signed += unwrap(prev, cur);
      prev = cur;
      if (Math.sin(cur) > 0.5) sawL = true;
      if (Math.sin(cur) < -0.5) sawR = true;
    }
    expect(sawL && sawR, '1 秒内应走完一个完整步相').toBe(true);
    expect(signed).toBeGreaterThan(Math.PI * 1.2);   // 至少迈过一走
  });

  it('攻击跨步也推进相位（面板不能读 Core 的冻结值）', () => {
    const { w, rig } = makeRig();
    run(w, 1, intent({ weaponSlot: 1 }));
    run(w, 1, intent({ attackPressed: true }));
    const coreBefore = w.character.gaitPhase;
    const rigBefore = rig.gaitDebug().phase;
    let coreMoved = 0;
    let rigMoved = 0;
    let prevCore = coreBefore;
    let prevRig = rigBefore;
    for (let i = 0; i < 20; i++) {
      run(w, 1, intent({}));
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
      const c = w.character.gaitPhase;
      const r = rig.gaitDebug().phase;
      coreMoved += Math.abs(unwrap(prevCore, c));
      rigMoved += Math.abs(unwrap(prevRig, r));
      prevCore = c;
      prevRig = r;
    }
    // 站定出刀时 Core 只是被 lunge 拖着走一点点，等效跨步驱动才是主要相位来源
    expect(rigMoved).toBeGreaterThan(0.35);
    expect(rigMoved).toBeGreaterThan(coreMoved);
  });
});
