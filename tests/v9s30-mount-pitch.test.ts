import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

// 表现层用的 rig 在 Node 下不需要真 canvas，补一个最小 document 即可
const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

function makeRig() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
    { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
  );
  return { w, rig };
}

/** 刃身长轴在世界空间的仰角（rad，+ = 抬起）。用 atan2 保留象限。 */
function bladePitch(rig: ReturnType<typeof createVoxelRig>): number {
  const b = rig.weaponBlade();
  if (!b) return NaN;
  const dy = b.tip.y - b.base.y;
  const hz = Math.hypot(b.tip.x - b.base.x, b.tip.z - b.base.z);
  return Math.atan2(dy, hz);
}

describe('v9s.30 举顶仰角（挂点不再被静态外张卡上限）', () => {
  it('大剑第三击起手：剑身能接近竖直（旧版被 16° 外张卡在 78°）', () => {
    const { w, rig } = makeRig();
    (w.combat as { weapon: string }).weapon = 'greatsword';
    let peak = 0;
    for (let i = 0; i < 90; i++) {
      step(w, w.config.fixedDt, intent({ attackPressed: i % 22 === 0, attackHeld: true }));
      (w.combat as { weapon: string }).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      rig.group.updateMatrixWorld(true);
      if (rig.swingDebug().seg !== 3) continue;
      peak = Math.max(peak, bladePitch(rig));
    }
    rig.dispose();
    // 数据首帧 bladePitch = 1.62 rad（92.8°）。旧版实测只有 1.36 rad（78°）。
    expect(peak * 180 / Math.PI).toBeGreaterThan(85);
  });

  it('外张按仰角收缩：横扫段仍然保持静态外张（刀尖偏向体侧）', () => {
    const { w, rig } = makeRig();
    (w.combat as { weapon: string }).weapon = 'dual-swords';
    let maxSweep = 0;
    for (let i = 0; i < 60; i++) {
      step(w, w.config.fixedDt, intent({ attackPressed: i === 0, attackHeld: true }));
      (w.combat as { weapon: string }).weapon = 'dual-swords';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      rig.group.updateMatrixWorld(true);
      const dbg = rig.swingDebug();
      // 只取挥出的中段：段首段末有 0.1s 段间过渡，姿态本来就在两端之间扫过，
      // 那些帧的仰角没有判据意义（v9s26 的统计口径也是这么切的）。
      if (dbg.seg !== 1 || dbg.strike < 0.38 || dbg.strike > 0.72) continue;
      maxSweep = Math.max(maxSweep, Math.abs(bladePitch(rig)));
    }
    rig.dispose();
    // 横扫段仰角不能被外张收缩逻辑带偏（旧行为：≤ 30°）
    expect(maxSweep * 180 / Math.PI).toBeLessThan(30);
  });
});
