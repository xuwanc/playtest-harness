import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import type { AppConfig } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { mixLowerGait } from '../src/presentation/program-anim';
import type { GaitPose } from '../src/presentation/gait';
import { makeQuietWorld, intent } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

/** 站着打一刀、第 8 帧开始按住前进：采集 settle 阶段的抬脚高度与腿部接管比例。 */
function run(opts: { takeover: boolean }): { lift: number; minLift: number; take: number; footZ: number } {
  const w = makeQuietWorld();
  w.modules.targeting = false;
  const anim = JSON.parse(JSON.stringify(raw.view.animation)) as AppConfig['view']['animation'];
  if (!opts.takeover && anim.attack.moveTakeover) {
    anim.attack.moveTakeover = { ...anim.attack.moveTakeover, windup: 0, recovery: 0, settle: 0 };
  }
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim, raw.view.ik, raw.view.links, raw.view.weaponWrist, raw.view.balance,
  );
  rig.group.updateWorldMatrix(true, true);
  const feet = ['footTip', 'footTip'].map((n, i) => {
    const all: THREE.Object3D[] = [];
    rig.group.traverse((o) => { if (o.name === n) all.push(o); });
    return all[i];
  });

  let maxLift = 0;
  let minLift = Infinity;
  let take = 0;
  const footZMin = [Infinity, Infinity];
  const footZMax = [-Infinity, -Infinity];
  let lastPhase = '';
  for (let i = 0; i < 40; i++) {
    const ints = i === 0
      ? intent({ attackPressed: true })
      : intent({ moveZ: i >= 8 ? 1 : 0 });
    step(w, w.config.fixedDt, ints);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    rig.group.updateWorldMatrix(true, true);
    // 只看 settle 本体：进入 idle 之后步态本来就接管了，会把 A/B 差异抹平。
    const inSettle = w.combat.phase === 'settle';
    lastPhase = w.combat.phase;
    if (!inSettle) continue;
    take = Math.max(take, rig.gaitDebug().legTakeover);
    feet.forEach((f, k) => {
      const p = f.getWorldPosition(new THREE.Vector3());
      maxLift = Math.max(maxLift, p.y);
      minLift = Math.min(minLift, p.y);
      footZMin[k] = Math.min(footZMin[k], p.z);
      footZMax[k] = Math.max(footZMax[k], p.z);
    });
  }
  rig.dispose();
  const travel = Math.max(footZMax[0] - footZMin[0], footZMax[1] - footZMin[1]);
  return { lift: maxLift, minLift, take, footZ: travel };
}

describe('v9s.33 攻击结束移动时的下盘滑步', () => {
  it('收势阶段腿部交给真实步态：一只脚落地支撑、另一只迈步', () => {
    const r = run({ takeover: true });
    expect(r.take).toBeGreaterThan(0.6);
    // 有一只脚踩在地上（旧版是两只脚一起悬空平移）
    expect(r.minLift).toBeLessThan(0.08);
    // 前脚会真的向前迈，而不是保持固定姿势被身体拖着走
    expect(r.footZ).toBeGreaterThan(0.1);
  });

  it('A/B：关掉接管时复现旧版「两只脚悬空、身体平移」', () => {
    const withTake = run({ takeover: true });
    const without = run({ takeover: false });
    expect(without.take).toBeLessThan(0.05);
    expect(without.minLift).toBeGreaterThan(0.09);   // 没有脚落地
    expect(without.footZ).toBeLessThan(0.04);        // 脚相对身体不动
    expect(withTake.footZ).toBeGreaterThan(without.footZ + 0.06);
  });

  it('mixLowerGait 只混合下盘，不动摆臂 / 侧倾 / 诊断量', () => {
    const mk = (k: number): GaitPose => ({
      legL: { pitchX: k, rollZ: k * 2, kneeX: k * 3 },
      legR: { pitchX: -k, rollZ: -k * 2, kneeX: -k * 3 },
      pelvisX: k, pelvisY: k, pelvisRoll: k,
      sideLean: 7, armL: 8, armR: 9, strafe: 10, backward: 11,
    });
    const a = mk(0);
    const b = mk(1);
    const m = mixLowerGait(a, b, 0.5);
    expect(m.legL.pitchX).toBeCloseTo(0.5, 6);
    expect(m.pelvisY).toBeCloseTo(0.5, 6);
    expect(m.armL).toBe(8);
    expect(m.sideLean).toBe(7);
    expect(m.strafe).toBe(10);
    expect(mixLowerGait(a, b, 0).legL.pitchX).toBe(0);
    expect(mixLowerGait(a, b, 1).legL.pitchX).toBe(1);
  });
});
