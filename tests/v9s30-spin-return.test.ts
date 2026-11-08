import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

const wrap = (a: number): number => {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
};

describe('v9s.30 双持第三击：转满一圈后收招不倒转', () => {
  it('整段只转一圈，收招阶段不出现反向整圈（防止整圈角被线性插值）', () => {
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
      { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
    );
    (w.combat as { weapon: string }).weapon = 'dual-swords';

    let prev = 0;
    let unwrapped = 0;
    let seg3Seen = false;
    let worstBackstep = 0;
    for (let i = 0; i < 180; i++) {
      // 前 46 帧连点三次把连击推到第三段，之后收手 → settle → idle
      const press = i === 0 || i === 20 || i === 40;
      step(w, w.config.fixedDt, intent({ attackPressed: press, attackHeld: i < 46 }));
      (w.combat as { weapon: string }).weapon = 'dual-swords';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      rig.group.updateMatrixWorld(true);
      const s = rig.swingDebug();
      if (s.seg === 3) seg3Seen = true;
      const d = wrap(s.rootTurn - prev);
      prev = s.rootTurn;
      unwrapped += d;
      // 只统计段 3 之后的收招 / 待机阶段：这里不该出现任何反向的大步
      if (seg3Seen && s.seg !== 3 && d < 0) worstBackstep += d;
    }
    rig.dispose();

    expect(seg3Seen).toBe(true);
    // 整段只该转一圈（+ 收招时的朝向微调）。旧版会在这里额外倒转 −2π。
    expect(unwrapped).toBeGreaterThan(Math.PI * 2 - 0.4);
    expect(unwrapped).toBeLessThan(Math.PI * 2 + 0.8);
    // 段 3 之后的累积反向：正常只有收势的十几度；旧版是整整 −2π（−6.28）
    expect(worstBackstep).toBeGreaterThan(-1.0);
  });
});
