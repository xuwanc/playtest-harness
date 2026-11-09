import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

/**
 * v9s.29 · 待机 ↔ 攻击的交叉淡入淡出。
 *
 * 用户原话：「连击开始和结束都没和待机对齐，且没有融合直接跳帧的」。
 * 旧版上半身是硬切：起手那一帧整体换成起手姿态、收招那一帧直接跳回待机。
 *
 * 判据不看代码、看**逐帧跳变**：起手 / 收招各取一小段窗口，量「单帧姿态变化量」，
 * 和 `poseIn/poseOut = 0`（等价旧版硬切）做 A/B。平滑版必须显著更小。
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

function run(swingPatch: Partial<AppConfig['view']['animation']['swing']>) {
  const anim: AppConfig['view']['animation'] = JSON.parse(JSON.stringify(raw.view.animation));
  Object.assign(anim.swing!, swingPatch);
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim, { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
  );
  (w.combat as any).weapon = 'dual-swords';
  // 上臂俯仰 + 刃身水平朝向，两个量一起代表「上半身姿态」
  const frames: { arm: number; yaw: number; phase: string }[] = [];
  for (let i = 0; i < 140; i++) {
    // 前 3 帧先站定（给「待机 → 起手」一个明确的上一帧），第 4 帧按一次攻击；
    // 之后不再按，让连击自然播完、收招回到待机。
    step(w, w.config.fixedDt, i === 3 ? intent({ attackPressed: true }) : intent({}));
    (w.combat as any).weapon = 'dual-swords';
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    rig.group.updateMatrixWorld(true);
    const b = rig.weaponBlade();
    const yaw = b
      ? Math.atan2(b.tip.x - b.base.x, b.tip.z - b.base.z)
      : 0;
    frames.push({
      arm: rig.group.getObjectByName('shoulderR')?.rotation.x ?? 0,
      yaw, phase: w.combat.phase,
    });
  }
  rig.dispose();

  const wrap = (d: number) => {
    let x = d;
    while (x > Math.PI) x -= Math.PI * 2;
    while (x < -Math.PI) x += Math.PI * 2;
    return Math.abs(x);
  };
  // 只看**过渡那一帧**：上臂俯仰从上一帧跨到这一帧的变化量。
  // 不能用「窗口内最大值」—— 起手之后本来就会快速把剑抡起来，那是动作，不是跳变。
  const enter = Math.max(1, frames.findIndex((f) => f.phase !== 'idle'));
  const exit = frames.findIndex((f, i) => i > enter && f.phase === 'idle');
  const at = (i: number) => {
    if (i <= 0 || i >= frames.length) return 0;
    const arm = Math.abs(frames[i].arm - frames[i - 1].arm);
    const yaw = wrap(frames[i].yaw - frames[i - 1].yaw) * 0.3;
    return Math.max(arm, yaw);
  };
  return { enterDelta: at(enter), exitDelta: at(exit) };
}

describe('v9s.29 起手 / 收招的姿态融合', () => {
  it('起手不再单帧跳：与硬切（poseIn=0）相比，单帧刃身跳变显著更小', () => {
    const smooth = run({});
    const hard = run({ poseIn: 0, poseOut: 0 });
    // 硬切那一帧实测 50°+；淡入后应压到 1/2 以下
    expect(hard.enterDelta).toBeGreaterThan(0.5);
    expect(smooth.enterDelta).toBeLessThan(hard.enterDelta * 0.55);
  });

  it('收招同样平滑：最后一帧不是「啪」地回待机', () => {
    // v9s.55 之后不再有「A/B 硬切」这个前提：权重一旦归零就交还待机，即使
    // poseOut=0 也不会留下「权重 0 但仍在写满挥出姿态」的硬切帧。所以直接量
    // 单帧跳变上限 —— 旧版的实测值是 1.4 rad（约 80°），肉眼就是一帧闪回。
    const smooth = run({});
    const hard = run({ poseIn: 0, poseOut: 0 });
    expect(smooth.exitDelta).toBeLessThan(0.25);
    expect(hard.exitDelta).toBeLessThan(0.25);
  });

  it('融合只是过渡：淡出结束后确实回到待机（不会停在半途）', () => {
    const anim: AppConfig['view']['animation'] = JSON.parse(JSON.stringify(raw.view.animation));
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      anim, { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
    );
    (w.combat as any).weapon = 'dual-swords';
    for (let i = 0; i < 140; i++) {
      step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({}));
      (w.combat as any).weapon = 'dual-swords';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    const d = rig.swingDebug();
    // 待机时挥击层已经放手：kind 回到默认、root 不再带转
    expect(Math.abs(d.rootTurn)).toBeLessThan(1e-6);
    rig.dispose();
  });
});
