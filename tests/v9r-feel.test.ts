import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import { solveStopInertia } from '../src/presentation/gait';
import {
  displacementSpeed, motionBusy, sampleSpeed,
} from '../src/presentation/motion-debug';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import { MECH_GAIT, RAW_CONFIG, DEFAULT_GAIT_EXPECT } from './mech-gait';
import type { GaitViewConfig, IKViewConfig } from '../src/core';

// 最小 DOM stub：createDummyRig 用 CanvasTexture 画标签，getContext 为 null 时直接跳过
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

function makeRig(gait: GaitViewConfig = MECH_GAIT, ikCfg?: IKViewConfig): VoxelRig {
  return createVoxelRig(
    RAW_CONFIG.view.voxel, RAW_CONFIG.view.colors, RAW_CONFIG.core.moveSpeed,
    RAW_CONFIG.view.orientation, gait, RAW_CONFIG.view.weaponMount,
    RAW_CONFIG.view.lean, RAW_CONFIG.view.hurt, RAW_CONFIG.view.animation, ikCfg,
  );
}

function dummyRig(w: ReturnType<typeof makeWorld>, gait: GaitViewConfig = MECH_GAIT) {
  const s = w.dummies[0];
  return createDummyRig(
    RAW_CONFIG.view.voxel, RAW_CONFIG.view.colors, '#88aa88', s.id,
    RAW_CONFIG.view.dummies, w.config.dummies.moveSpeed, gait,
    RAW_CONFIG.view.hurt, RAW_CONFIG.view.lean,
  );
}

const pelvisY = (rig: { group: THREE.Object3D }): number =>
  rig.group.getObjectByName('pelvis')!.getWorldPosition(new THREE.Vector3()).y;
const footY = (rig: { group: THREE.Object3D }, side: 'L' | 'R'): number => {
  const hip = rig.group.getObjectByName(side === 'L' ? 'hipL' : 'hipR')!;
  return hip.getObjectByName('footTip')!.getWorldPosition(new THREE.Vector3()).y;
};

/* -------------------------------------------------------------------------- *
 * 1) 默认参数：新增 stopBodyDip
 * -------------------------------------------------------------------------- */
describe('v9r 默认参数', () => {
  it('用户敲定的 11 项 + 新增骨盆下沉量逐项一致', () => {
    const gait = RAW_CONFIG.view.gait;
    for (const [k, v] of Object.entries(DEFAULT_GAIT_EXPECT)) {
      expect((gait as unknown as Record<string, number>)[k], k).toBeCloseTo(v, 9);
    }
    expect(gait.stopBodyDip).toBe(0.03);
    expect(gait.knockGaitScale).toBe(1);
  });

  it('机制回归配置里下沉量为显式非零值，不随线上调优漂移', () => {
    expect(MECH_GAIT.stopBodyDip).toBeGreaterThan(0);
    expect(MECH_GAIT.stopBodyDip).not.toBe(RAW_CONFIG.view.gait.stopBodyDip);
  });
});

/* -------------------------------------------------------------------------- *
 * 2) 停步惯性纯函数：骨盆下沉是两端归零的脉冲
 * -------------------------------------------------------------------------- */
describe('v9r solveStopInertia 骨盆下沉', () => {
  it('bodyDip 与 env 成比例，端点精确为 0', () => {
    const peak = MECH_GAIT.stopPeakRatio;
    const top = solveStopInertia(peak, 0.7, 1, 0, MECH_GAIT);
    expect(top.bodyDip).toBeCloseTo(MECH_GAIT.stopBodyDip, 9);
    expect(solveStopInertia(0, 0.7, 1, 0, MECH_GAIT).bodyDip).toBe(0);
    expect(solveStopInertia(1, 0.7, 1, 0, MECH_GAIT).bodyDip).toBe(0);
    const mid = solveStopInertia(0.24, 0.7, 1, 0, MECH_GAIT);
    expect(mid.bodyDip / top.bodyDip).toBeCloseTo(mid.env / top.env, 6);
  });

  it('拉 0 精确关闭下沉，其它脉冲项不受影响（可单独 A/B）', () => {
    const off = solveStopInertia(MECH_GAIT.stopPeakRatio, 0.7, 1, 0,
      { ...MECH_GAIT, stopBodyDip: 0 });
    expect(off.bodyDip).toBe(0);
    expect(off.bodyShift).toBeGreaterThan(0);
    expect(off.chestPitch).toBeGreaterThan(0);
  });

  it('负值被夹到 0（配置误填不会把骨盆抬起来）', () => {
    expect(solveStopInertia(MECH_GAIT.stopPeakRatio, 0.7, 1, 0,
      { ...MECH_GAIT, stopBodyDip: -1 }).bodyDip).toBe(0);
  });
});

/* -------------------------------------------------------------------------- *
 * 3) 速度曲线：抓「实际位移」而不是只看 velocity（技能期间不再为 0）
 * -------------------------------------------------------------------------- */
describe('v9r 速度采样位移口径', () => {
  it('velocity=0 但 position 被 lunge 推动：位移速度仍抓得到', () => {
    // 0.05m / 1/60s = 3 m/s，正是攻击 lunge 这类「只写 position」的位移
    const r = displacementSpeed({ x: 0, z: 0 }, { x: 0, z: 0.05 }, 1 / 60, 18);
    expect(r.raw).toBeCloseTo(3, 9);
    expect(r.speed).toBeCloseTo(3, 9);
    // 旧口径 hypot(velocity) 恒为 0，这是「技能期间速度为 0」的根因
    expect(Math.hypot(0, 0)).toBe(0);
  });

  it('斜向位移按模长算，不是分量相加', () => {
    const r = displacementSpeed({ x: 0, z: 0 }, { x: 0.03, z: 0.04 }, 1 / 60, 18);
    expect(r.raw).toBeCloseTo(3, 9);
  });

  it('闪现 / 复位这类瞬移被软限幅，raw 保留原值供诊断', () => {
    const r = displacementSpeed({ x: 0, z: 0 }, { x: 0, z: 8 }, 1 / 60, 18);
    expect(r.raw).toBeCloseTo(480, 6);
    expect(r.speed).toBe(18);
  });

  it('dt 为 0 / cap 为 0 不产生 NaN 或爆量', () => {
    expect(Number.isFinite(displacementSpeed({ x: 0, z: 0 }, { x: 1, z: 0 }, 0, 18).raw)).toBe(true);
    expect(displacementSpeed({ x: 0, z: 0 }, { x: 0, z: 0 }, 1 / 60, 0).speed).toBe(0);
  });

  it('sampleSpeed 保持旧签名语义，新增对照字段有安全默认值', () => {
    const s = sampleSpeed(1, 1.5, 0.02, 10);
    expect(s.speed).toBe(1.5);
    expect(s.dv).toBeCloseTo(0.5, 9);
    expect(s.accel).toBeCloseTo(25, 9);
    expect(s.drive).toBe(1.5);
    expect(s.raw).toBe(1.5);
    expect(s.busy).toBe(false);
  });

  it('motionBusy：攻击 / 技能 / 冲刺 / 击退段都标记，全空闲为 false', () => {
    const w = makeWorld();
    w.combat.phase = 'idle';
    w.dash.phase = 'idle';
    w.abilities.channeling = false;
    w.playerHurt.knockX = 0; w.playerHurt.knockZ = 0;
    expect(motionBusy(w)).toBe(false);

    w.combat.phase = 'active';
    expect(motionBusy(w)).toBe(true);
    w.combat.phase = 'idle';
    w.abilities.channeling = true;
    expect(motionBusy(w)).toBe(true);
    w.abilities.channeling = false;
    w.dash.phase = 'active';
    expect(motionBusy(w)).toBe(true);
    w.dash.phase = 'idle';
    w.playerHurt.knockZ = 3;
    expect(motionBusy(w)).toBe(true);
  });
});

/* -------------------------------------------------------------------------- *
 * 4) 骨架：骨盆跟着沉，但脚 IK 锚点不跟着（IK 开 / 关两条路径）
 * -------------------------------------------------------------------------- */
describe('v9r 停步骨盆下沉但脚钉地', () => {
  /** 开 / 关 stopBodyDip 各跑一遍，取收相中段骨盆与两脚世界 Y 的最大差 */
  function gap(ikCfg?: IKViewConfig) {
    const w = makeWorld();
    w.modules.targeting = false;
    const on = makeRig(MECH_GAIT, ikCfg);
    const off = makeRig({ ...MECH_GAIT, stopBodyDip: 0 }, ikCfg);
    run(w, 90, intent({ moveX: 0, moveZ: 1 }));

    let maxPelvisDrop = 0;
    let maxFootGap = 0;
    let sawStop = false;
    for (let i = 0; i < 90; i++) {
      run(w, 1, intent({}));
      const c = w.character;
      on.group.rotation.y = c.bodyYaw;
      off.group.rotation.y = c.bodyYaw;
      on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      off.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      if (on.gaitDebug().stopT > 0.15 && on.gaitDebug().stopT < 0.9) {
        sawStop = true;
        maxPelvisDrop = Math.max(maxPelvisDrop, pelvisY(off) - pelvisY(on));
        for (const side of ['L', 'R'] as const) {
          maxFootGap = Math.max(maxFootGap, Math.abs(footY(on, side) - footY(off, side)));
        }
      }
    }
    return { sawStop, maxPelvisDrop, maxFootGap, dip: on.gaitDebug().stopDip };
  }

  it('IK 关闭：骨盆确实下沉，两脚世界 Y 几乎不动', () => {
    const r = gap();
    expect(r.sawStop).toBe(true);
    expect(r.maxPelvisDrop).toBeGreaterThan(MECH_GAIT.stopBodyDip * 0.6);
    expect(r.maxFootGap).toBeLessThan(MECH_GAIT.stopBodyDip * 0.2);
  });

  it('IK 开启（线上配置）：锚点取未下沉的脚位，由屈膝吸收，脚同样不跟着沉', () => {
    const r = gap(RAW_CONFIG.view.ik);
    expect(r.sawStop).toBe(true);
    expect(r.maxPelvisDrop).toBeGreaterThan(MECH_GAIT.stopBodyDip * 0.6);
    expect(r.maxFootGap).toBeLessThan(MECH_GAIT.stopBodyDip * 0.35);
  });

  it('gaitDebug().stopDip 在收相期间出现、结束后归零', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig();
    run(w, 90, intent({ moveX: 0, moveZ: 1 }));
    let peak = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, intent({}));
      const c = w.character;
      rig.group.rotation.y = c.bodyYaw;
      rig.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      peak = Math.max(peak, rig.gaitDebug().stopDip);
    }
    expect(peak).toBeGreaterThan(0.01);
    expect(rig.gaitDebug().stopDip).toBe(0);
  });

  it('假人同构：骨盆下沉且两脚世界 Y 不动', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    w.modules.targeting = false;
    const on = dummyRig(w);
    const off = dummyRig(w, { ...MECH_GAIT, stopBodyDip: 0 });
    // 高速稳定 → 指数减速触发与主角同构的 stopBlendGate
    const tick = (v: number, phase: number) => {
      s.velocity.x = 0; s.velocity.z = v;
      s.gaitPhase = phase;
      s.bodyYaw = 0; s.headYaw = 0;
      s.stride = 1;
      s.hurt.type = 'none'; s.hurt.timer = 0; s.hurt.duration = 0;
      s.hurt.knockX = 0; s.hurt.knockZ = 0;
      on.update(s, w.config.fixedDt);
      off.update(s, w.config.fixedDt);
    };
    for (let i = 0; i < 20; i++) tick(2.0, (i * 0.12) % (Math.PI * 2));
    let maxDrop = 0;
    let maxFootGap = 0;
    for (let i = 0; i < 60; i++) {
      tick(2.0 * Math.pow(0.78, i), ((20 + i) * 0.12) % (Math.PI * 2));
      maxDrop = Math.max(maxDrop, pelvisY(off) - pelvisY(on));
      for (const side of ['L', 'R'] as const) {
        maxFootGap = Math.max(maxFootGap, Math.abs(footY(on, side) - footY(off, side)));
      }
    }
    expect(maxDrop).toBeGreaterThan(MECH_GAIT.stopBodyDip * 0.4);
    expect(maxFootGap).toBeLessThan(MECH_GAIT.stopBodyDip * 0.25);
  });

  it('假人骨架节点可读（rig-nodes helper 正常）', () => {
    const w = makeWorld();
    const rig = dummyRig(w);
    expect(rigNodes(rig).pelvis).toBeTruthy();
  });
});
