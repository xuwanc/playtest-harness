import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState, PoseClip } from '../src/core';
import { clipHasChannel, step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

/**
 * v9s.29 · 「刃口迎着挥击方向」（不是拿刀身侧面拍）。
 *
 * 用户原话：「现在刀都是以刀侧面在扫」。模型约定刀身「薄在 X、宽在 Z」，
 * 挂点把刀身放平之后宽面法线正好指向挥击方向 —— 几何上就是拿侧面拍。
 *
 * 判据不看角度、看**物理关系**：刃尖速度方向与宽面法线的夹角。
 *   法线 ⟂ 速度 → 刃口正对运动方向 = 在切（点积 ≈ 0）；
 *   法线 ∥ 速度 → 宽面正对运动方向 = 在拍（点积 ≈ ±1）。
 * 这样即使以后改了动作数据，只要「拍」回来，用例就会红。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}
const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};
const SWING = raw.view.animation.swing!;
const CLIPS = SWING.clips! as Record<string, PoseClip>;

function rigWith(anim: AppConfig['view']['animation'] = raw.view.animation) {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim, { ...raw.view.ik, enabled: false },
    raw.view.links, raw.view.weaponWrist,
  );
  return { w, rig };
}

/** 逐帧采主手刃尖速度与宽面法线的点积（只取挥得动的帧）。 */
function edgeSamples(
  weapon: string, anim: AppConfig['view']['animation'] = raw.view.animation,
): number[] {
  const { w, rig } = rigWith(anim);
  (w.combat as any).weapon = weapon;
  const out: number[] = [];
  let prev: { x: number; y: number; z: number } | null = null;
  for (let i = 0; i < 120; i++) {
    step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
    (w.combat as any).weapon = weapon;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    rig.group.updateMatrixWorld(true);
    const s = rig.swingDebug();
    const pair = rig.bladesWorld();
    const b = s.lead === 'L' && pair.left ? pair.left : pair.right;
    if (!b) continue;
    const tip = b.tip;
    // 只看命中帧（Core 的 active 阶段 = 判定真的在结算的那几帧）：
    // 蓄势 / 换手时刀也在高速移动，但那是「把刀挪过去」，不是做切削。
    if (prev && w.combat.phase === 'active') {
      const vx = (tip.x - prev.x) / w.config.fixedDt;
      const vy = (tip.y - prev.y) / w.config.fixedDt;
      const vz = (tip.z - prev.z) / w.config.fixedDt;
      const sp = Math.hypot(vx, vy, vz);
      if (sp > 20) {
        const dot = (vx * b.normal.x + vy * b.normal.y + vz * b.normal.z) / sp;
        out.push(Math.abs(dot));
      }
    }
    prev = { ...tip };
  }
  rig.dispose();
  return out;
}

function median(xs: number[]): number {
  const a = [...xs].sort((p, q) => p - q);
  return a[Math.floor(a.length / 2)] ?? 1;
}

describe('v9s.29 刃口朝向（横扫不是拿刀身拍）', () => {
  it('数据层：横扫剪辑都给了刃面滚转，且方向与扫击方向一致', () => {
    for (const id of ['ds.right-left', 'ds.left-right', 'gs.right-left', 'gs.left-right']) {
      const clip = CLIPS[id];
      expect(clipHasChannel(clip, 'bladeTwist'), `${id} 缺 bladeTwist`).toBe(true);
    }
    // 右→左扫取负、左→右扫取正（滚转把刃口转到运动方向）
    const key = (id: string) => CLIPS[id].keys[0].pose.bladeTwist!;
    expect(key('ds.right-left')).toBeLessThan(-0.8);
    expect(key('ds.left-right')).toBeGreaterThan(0.8);
    expect(key('gs.right-left')).toBeLessThan(-0.8);
    expect(key('gs.left-right')).toBeGreaterThan(0.8);
    // 双持原地转：两把刀镜像立刃
    const spin = CLIPS['ds.spin'].keys[0].pose;
    expect(Math.abs(spin.bladeTwist ?? 0)).toBeGreaterThan(0.8);
    expect(Math.sign(spin.bladeTwist!)).toBe(-Math.sign(spin.bladeTwistOff!));
  });

  it('双持：挥击帧的宽面法线基本垂直于刃尖速度（刃口在切）', () => {
    for (const weapon of ['dual-swords', 'greatsword', 'sword-shield']) {
      const dots = edgeSamples(weapon);
      expect(dots.length, `${weapon} 没采到挥击帧`).toBeGreaterThan(5);
      // 中位数代表「典型挥击帧」，最大值代表最差的那几帧。
      // 0.5 ≈ 法线偏离垂直 60°，读起来已经是「刃口斜着切」而不是「平拍」。
      expect(median(dots), `${weapon} 中位 |cos|`).toBeLessThan(0.45);
      // 单帧尖峰（起转 / 换手加速那一帧）允许到 0.85：那一帧刀是被身体「拖着走」，
      // 不构成刀光主体；真正要守的是中位数。
      expect(Math.max(...dots), `${weapon} 最差帧 |cos|`).toBeLessThan(0.85);
    }
  });

  it('反向对照：把 bladeTwist 清零，法线就转回指向挥击方向（= 旧版的「拍」）', () => {
    const stripped: AppConfig['view']['animation'] = JSON.parse(JSON.stringify(raw.view.animation));
    for (const clip of Object.values(stripped.swing?.clips ?? {})) {
      for (const k of clip.keys) {
        delete k.pose.bladeTwist;
        delete k.pose.bladeTwistOff;
      }
    }
    const withTwist = median(edgeSamples('dual-swords'));
    const without = median(edgeSamples('dual-swords', stripped));
    // 清零后 |cos| 明显变大 = 宽面正对运动方向，证明这个通道真的在起作用
    expect(without).toBeGreaterThan(withTwist + 0.25);
  });
});
