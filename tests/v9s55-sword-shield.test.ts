import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { solveSwingPose } from '../src/presentation/swing-pose';
import { clipHasChannel } from '../src/core';
import { makeWorld, intent } from './helpers';
import type { AppConfig, HurtState, PoseClip } from '../src/core';

/**
 * v9s.55 · 剑盾攻击「舒展开」。
 *
 * 旧版剑盾前两段**复用大剑剪辑 × 0.78 幅度**：双手武器的手臂角度按大剑胳膊设计，
 * 缩到单手剑上就变成「小臂在身前比划」，加上左臂交还步态摆臂 —— 盾在挥击时乱甩。
 * 实测扫角只有 130° / 121°（大剑 169° / 158°），命中判定却按 226° 给。
 *
 * 现在两段各有独立剪辑：身体只让 35°、整体带转 20°，弧线靠「肩打开 + 手臂横过身体」
 * 出（单手剑的真实打法），盾臂全程由数据接管（护胸 → 前送）。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const SWING = raw.view.animation.swing!;

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0,
  dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

describe('v9s.55 剑盾：独立剪辑', () => {
  it('三段引用自己的剪辑，不再复用 gs.*', () => {
    const list = (SWING.combo ?? {})['sword-shield'] ?? [];
    const ids = list.map((r) => (typeof r === 'string' ? r : r.clip));
    expect(ids).toEqual(['ss.right-left', 'ss.left-right', 'ss.shield-bash']);
    for (const id of ids) expect(SWING.clips?.[id]).toBeTruthy();
  });

  it('幅度倍率回到 1.0：不再靠「大剑 × 0.78」硬缩', () => {
    expect(SWING.weaponScale?.['sword-shield']).toBeCloseTo(1, 6);
  });

  it('两段横扫都有盾臂通道（盾不再交还步态摆臂）', () => {
    for (const id of ['ss.right-left', 'ss.left-right']) {
      const clip = SWING.clips![id] as PoseClip;
      expect(clipHasChannel(clip, 'armLPitch')).toBe(true);
      expect(clipHasChannel(clip, 'elbowL')).toBe(true);
    }
  });

  it('挥出末段手臂伸开：肘从深屈到几乎伸直，肩外展过半', () => {
    for (const seg of [1, 2]) {
      const windup = solveSwingPose('sword-shield', seg, -1, SWING);
      const full = solveSwingPose('sword-shield', seg, 1, SWING);
      expect(windup.armR).not.toBeNull();
      expect(full.armR).not.toBeNull();
      // 蓄势：肘深屈（把剑收到肩侧）；挥出：肘伸直（手臂展开）
      expect(windup.armR!.elbow).toBeLessThan(-0.8);
      expect(full.armR!.elbow).toBeGreaterThan(-0.15);
      // 肩从外展（roll 同侧）横过身体（roll 反向）
      expect(Math.sign(windup.armR!.roll)).toBe(-Math.sign(full.armR!.roll));
      expect(Math.abs(windup.armR!.roll)).toBeGreaterThan(0.25);
      expect(Math.abs(full.armR!.roll)).toBeGreaterThan(0.2);
    }
  });

  it('躯干只让 35°、整体带转 20°：弧线靠肩臂出，不把人抡转过去', () => {
    for (const seg of [1, 2]) {
      const a = solveSwingPose('sword-shield', seg, -1, SWING);
      const b = solveSwingPose('sword-shield', seg, 1, SWING);
      const twist = Math.abs(a.yaw - b.yaw);
      const root = Math.abs(a.rootYaw - b.rootYaw);
      expect(twist).toBeGreaterThan(0.9);   // ≥ 51° 腰椎总转
      expect(twist).toBeLessThan(1.5);      // 但不到 90°（那是大剑）
      expect(root).toBeGreaterThan(0.5);    // ≥ 29° 整体带转
      expect(root).toBeLessThan(0.9);
    }
  });
});

describe('v9s.55 剑盾：真实挥击的扫角', () => {
  /** 跑一次单段攻击，取刃身水平朝向的跨度（unwrap 后）。 */
  function sweepOf(seg: number): number {
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed,
      raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation, { ...raw.view.ik, enabled: false },
    );
    (w.combat as unknown as { weapon: string }).weapon = 'sword-shield';
    const ys: number[] = [];
    for (let i = 0; i < 120; i++) {
      step(w, w.config.fixedDt,
        i === 4 || (seg === 2 && i === 60) ? intent({ attackPressed: true }) : intent({}));
      (w.combat as unknown as { weapon: string }).weapon = 'sword-shield';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      rig.group.updateMatrixWorld(true);
      if (w.combat.comboIndex !== seg) continue;
      const b = rig.weaponBlade();
      if (!b) continue;
      ys.push((Math.atan2(b.tip.x - b.base.x, b.tip.z - b.base.z) * 180) / Math.PI);
    }
    rig.dispose();
    if (ys.length === 0) return 0;
    let acc = ys[0];
    let lo = acc;
    let hi = acc;
    for (let i = 1; i < ys.length; i++) {
      let d = ys[i] - ys[i - 1];
      while (d > 180) d -= 360;
      while (d < -180) d += 360;
      acc += d;
      lo = Math.min(lo, acc);
      hi = Math.max(hi, acc);
    }
    return hi - lo;
  }

  it('段 1 扫角 ≥ 170°（旧版 131°）', () => {
    expect(sweepOf(1)).toBeGreaterThan(170);
  });

  it('段 2 扫角 ≥ 170°（旧版 121°）', () => {
    expect(sweepOf(2)).toBeGreaterThan(170);
  });
});
