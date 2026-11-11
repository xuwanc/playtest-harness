import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import {
  bodyLocalDir, chestYawFromHip, solveStopInertia,
} from '../src/presentation/gait';
import { sampleSpeed } from '../src/presentation/motion-debug';
import { makeQuietWorld, makeWorld, intent, run } from './helpers';
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

const legMag = (d: ReturnType<VoxelRig['gaitDebug']>): number =>
  Math.abs(d.legLPitch) + Math.abs(d.legLRoll)
  + Math.abs(d.legRPitch) + Math.abs(d.legRRoll);

function footWorld(rig: { group: THREE.Object3D }, side: 'L' | 'R'): THREE.Vector3 {
  const hip = rig.group.getObjectByName(side === 'L' ? 'hipL' : 'hipR')!;
  const tip = hip.getObjectByName('footTip' + side)!;
  return tip.getWorldPosition(new THREE.Vector3());
}

function pelvisWorld(rig: { group: THREE.Object3D }): THREE.Vector3 {
  return rig.group.getObjectByName('pelvis')!.getWorldPosition(new THREE.Vector3());
}

/* -------------------------------------------------------------------------- *
 * 1) 默认参数：用户敲定的 11 项 + 新增开关
 * -------------------------------------------------------------------------- */
describe('v9q 默认参数', () => {
  it('11 项手感参数与用户指定值逐一一致', () => {
    const gait = RAW_CONFIG.view.gait;
    for (const [k, v] of Object.entries(DEFAULT_GAIT_EXPECT)) {
      expect((gait as unknown as Record<string, number>)[k], k).toBeCloseTo(v, 9);
    }
  });

  it('v9s：胸偏转默认已启用（比例 0.6 / 上限 40°），上限 0 仍能彻底关闭', () => {
    const gait = RAW_CONFIG.view.gait;
    expect(gait.chestYawScale).toBe(0.6);
    expect(gait.chestYawMaxDeg).toBe(40);
    // 0.6 rad 下盘偏转 × 0.6 = 0.36 rad，被 40°(0.698 rad) 限幅后仍为 0.36
    expect(chestYawFromHip(0.6, gait.chestYawScale, gait.chestYawMaxDeg))
      .toBeCloseTo(0.36, 6);
    // 大角度下盘偏转时上限生效
    expect(chestYawFromHip(2, gait.chestYawScale, gait.chestYawMaxDeg))
      .toBeCloseTo((40 * Math.PI) / 180, 6);
    // maxDeg=0 是「彻底关闭」语义（v9q 的默认，保留回归）
    expect(chestYawFromHip(0.6, gait.chestYawScale, 0)).toBe(0);
    // 机制本身不随默认调优漂移（回归用 MECH_GAIT）
    expect(chestYawFromHip(0.6, MECH_GAIT.chestYawScale, MECH_GAIT.chestYawMaxDeg))
      .toBeCloseTo(0.27, 6);
  });

  it('前脚踩出 / 跟随腿后蹬默认 0，只保留抬膝 + 前移 + 前倾', () => {
    const gait = RAW_CONFIG.view.gait;
    expect(gait.stopStepPitch).toBe(0);
    expect(gait.stopTrailPitch).toBe(0);
    expect(gait.stopStepKnee).toBeGreaterThan(0);
    expect(gait.stopBodyShift).toBeGreaterThan(0);
    expect(gait.stopChestPitch).toBeGreaterThan(0);
  });

  it('击退步态驱动默认开启 (knockGaitScale=1)', () => {
    expect(RAW_CONFIG.view.gait.knockGaitScale).toBe(1);
  });
});

/* -------------------------------------------------------------------------- *
 * 2) 惯性方向基准：骨盆(bodyYaw) 局部，而不是 gait(bodyYaw+hipYaw) 局部
 * -------------------------------------------------------------------------- */
describe('v9q 惯性前移方向基准 bodyLocalDir', () => {
  const dirs: [number, number][] = [[1, 0], [0, 1], [-1, 0], [3, 4], [-2, 5], [0.6, -0.8]];
  const yaws = [0, 0.3, 1.1, -0.8, Math.PI, 2.7];

  it('任意 bodyYaw / 任意世界方向：局部 → 反算回世界，方向逐点一致', () => {
    for (const yaw of yaws) {
      for (const [wx, wz] of dirs) {
        const len = Math.hypot(wx, wz);
        const ux = wx / len, uz = wz / len;
        const { forward, right } = bodyLocalDir(yaw, ux, uz);
        // world = forward * 前轴 + right * 右轴
        const backX = forward * Math.sin(yaw) + right * Math.cos(yaw);
        const backZ = forward * Math.cos(yaw) - right * Math.sin(yaw);
        expect(backX).toBeCloseTo(ux, 9);
        expect(backZ).toBeCloseTo(uz, 9);
        expect(Math.hypot(forward, right)).toBeCloseTo(1, 9);
      }
    }
  });

  it('与 gait 局部确实差一个 hipYaw —— 这就是旧版「方向不一致」的量化', () => {
    const yaw = 0.4, hip = 0.65;   // 侧移时下盘约 37°
    const bd = bodyLocalDir(yaw, 1, 0);
    const gaitYaw = yaw + hip;
    const gaitF = Math.sin(gaitYaw), gaitR = Math.cos(gaitYaw);
    const angB = Math.atan2(bd.right, bd.forward);
    const angG = Math.atan2(gaitR, gaitF);
    expect(Math.abs(angB - angG)).toBeCloseTo(hip, 6);
    expect(Math.abs(angB - angG)).toBeGreaterThan(0.5);
  });

  it('solveStopInertia 输出的 fwdN/rightN 反算回真实世界移动方向', () => {
    const peak = MECH_GAIT.stopPeakRatio;
    for (const yaw of yaws) {
      const bd = bodyLocalDir(yaw, 3, 4);
      const si = solveStopInertia(peak, 0.7, bd.forward, bd.right, MECH_GAIT);
      const backX = si.fwdN * Math.sin(yaw) + si.rightN * Math.cos(yaw);
      const backZ = si.fwdN * Math.cos(yaw) - si.rightN * Math.sin(yaw);
      expect(backX).toBeCloseTo(0.6, 9);
      expect(backZ).toBeCloseTo(0.8, 9);
    }
  });
});

/* -------------------------------------------------------------------------- *
 * 3) 速度曲线采样纯函数
 * -------------------------------------------------------------------------- */
describe('v9q 速度采样 sampleSpeed', () => {
  it('dv / accel 带符号且按 dt 归一', () => {
    const a = sampleSpeed(1, 1.5, 0.02, 10);
    expect(a.speed).toBe(1.5);
    expect(a.dv).toBeCloseTo(0.5, 9);
    expect(a.accel).toBeCloseTo(25, 9);
    expect(a.t).toBe(10);
    const b = sampleSpeed(2, 1.2, 0.01, 11);
    expect(b.dv).toBeCloseTo(-0.8, 9);
    expect(b.accel).toBeCloseTo(-80, 9);
  });

  it('dt 过小 / 为 0 不产生 NaN 或爆量', () => {
    expect(sampleSpeed(1, 1, 0, 12).accel).toBe(0);
    expect(Number.isFinite(sampleSpeed(1, 2, 1e-9, 12).accel)).toBe(true);
    expect(sampleSpeed(1, 2, 1e-9, 12).accel).toBe(0);
  });
});

/* -------------------------------------------------------------------------- *
 * 4) 停步惯性：骨盆前移但脚钉地（位移放在 IK 基准之后）
 * -------------------------------------------------------------------------- */
describe('v9q 停步惯性不再带着脚一起滑', () => {
  /** IK 关闭（单测默认）与开启（线上 view.ik）两条路径都要保证脚钉地 */
  function footGap(ikCfg?: IKViewConfig) {
    const w = makeWorld();
    w.modules.targeting = false;
    const on = makeRig(MECH_GAIT, ikCfg);
    const off = makeRig({ ...MECH_GAIT, stopBodyShift: 0 }, ikCfg);
    run(w, 45, intent({ moveX: 0, moveZ: 1 }));

    let maxPelvisGap = 0;
    let maxFootGap = 0;
    let sawStop = false;
    for (let i = 0; i < 90; i++) {
      run(w, 1, intent({}));
      const c = w.character;
      on.group.rotation.y = c.bodyYaw;
      off.group.rotation.y = c.bodyYaw;
      on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      off.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = on.gaitDebug();
      if (d.stopT > 0.15 && d.stopT < 0.9) {
        sawStop = true;
        const pa = pelvisWorld(on), pb = pelvisWorld(off);
        maxPelvisGap = Math.max(maxPelvisGap, Math.hypot(pa.x - pb.x, pa.z - pb.z));
        for (const side of ['L', 'R'] as const) {
          const a = footWorld(on, side), b = footWorld(off, side);
          maxFootGap = Math.max(maxFootGap, Math.hypot(a.x - b.x, a.z - b.z));
        }
      }
    }
    return { sawStop, maxPelvisGap, maxFootGap };
  }

  it('IK 关闭：开/关 bodyShift 骨盆分开，但两脚世界位置几乎不动', () => {
    const r = footGap();
    expect(r.sawStop).toBe(true);
    expect(r.maxPelvisGap).toBeGreaterThan(MECH_GAIT.stopBodyShift * 0.4);
    expect(r.maxFootGap).toBeLessThan(MECH_GAIT.stopBodyShift * 0.35);
  });

  it('IK 开启（线上配置）：同样钉地，下盘补偿不干扰 IK 解', () => {
    const r = footGap(RAW_CONFIG.view.ik);
    expect(r.sawStop).toBe(true);
    expect(r.maxPelvisGap).toBeGreaterThan(MECH_GAIT.stopBodyShift * 0.4);
    expect(r.maxFootGap).toBeLessThan(MECH_GAIT.stopBodyShift * 0.35);
  });

  it('纯侧移停步：惯性前移方向与停步瞬间速度方向同向（不再歪一个 hipYaw）', () => {
    // v9s.13：纯侧移的前提是身体朝向不被注视拉走（侧后方已改走后退步、hipYaw 归零）
    const w = makeQuietWorld();
    w.modules.targeting = false;
    const on = makeRig();
    const off = makeRig({ ...MECH_GAIT, stopBodyShift: 0 });
    // 身体朝 +Z、移动 +X → 纯侧移，下盘 hipYaw 明显不为 0
    const aim = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 90, aim);

    let locked: { x: number; z: number } | null = null;
    let sawHip = false;
    let worstDot = 1;
    let sawShift = false;
    for (let i = 0; i < 90; i++) {
      run(w, 1, intent({}));
      const c = w.character;
      on.group.rotation.y = c.bodyYaw;
      off.group.rotation.y = c.bodyYaw;
      on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      off.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = on.gaitDebug();
      if (Math.abs(d.hipYaw) > 0.1) sawHip = true;
      if (!locked && d.stopT > 0 && d.stopT < 0.2) {
        const vl = Math.hypot(c.velocity.x, c.velocity.z);
        if (vl > 1e-3) locked = { x: c.velocity.x / vl, z: c.velocity.z / vl };
      }
      if (locked && d.stopT > 0.2 && d.stopT < 0.85) {
        const pa = pelvisWorld(on), pb = pelvisWorld(off);
        const dx = pa.x - pb.x, dz = pa.z - pb.z;
        const dl = Math.hypot(dx, dz);
        if (dl > 1e-4) {
          sawShift = true;
          worstDot = Math.min(worstDot, (dx / dl) * locked.x + (dz / dl) * locked.z);
        }
      }
    }
    expect(sawHip).toBe(true);          // 确实处在「gait 局部 ≠ 骨盆局部」的场景
    expect(locked).not.toBeNull();
    expect(sawShift).toBe(true);
    expect(worstDot).toBeGreaterThan(0.95);   // 与真实速度方向夹角 < ~18°
  });
});

/* -------------------------------------------------------------------------- *
 * 5) 被击退也开启下半身位移（knock 冲量并入步态驱动）
 * -------------------------------------------------------------------------- */
describe('v9q 被击退时下盘跟着迈出后撤步', () => {
  it('玩家 velocity=0 但被击退：开=腿在摆、关=旧 idle，gaitSpeed 读数等于击退速度', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const on = makeRig();
    const off = makeRig({ ...MECH_GAIT, knockGaitScale: 0 });
    const c = w.character;
    c.velocity.x = 0; c.velocity.z = 0;
    c.grounded = true;
    w.playerHurt.type = 'none';
    w.playerHurt.knockX = 0; w.playerHurt.knockZ = 3;

    let maxOn = 0, maxOff = 0;
    for (let i = 0; i < 24; i++) {
      c.gaitPhase = 0.7 + i * 0.16;
      c.stride = 1;
      on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      off.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      maxOn = Math.max(maxOn, legMag(on.gaitDebug()));
      maxOff = Math.max(maxOff, legMag(off.gaitDebug()));
    }
    expect(maxOn).toBeGreaterThan(0.08);
    expect(maxOff).toBeLessThan(1e-6);
    expect(on.gaitDebug().gaitSpeed).toBeCloseTo(3, 6);
    expect(off.gaitDebug().gaitSpeed).toBe(0);
    expect(on.gaitDebug().stopT).toBe(-1);   // 击退期间不收相
  });

  it('假人同构：击退时腿摆起来，拉 0 精确回到旧「身体平移、腿不动」', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const on = dummyRig(w);
    const off = dummyRig(w, { ...MECH_GAIT, knockGaitScale: 0 });
    s.velocity.x = 0; s.velocity.z = 0;
    s.bodyYaw = 0; s.headYaw = 0;
    s.stride = 1;
    s.hurt.type = 'none'; s.hurt.timer = 0; s.hurt.duration = 0;
    s.hurt.knockX = 0; s.hurt.knockZ = 3;

    let maxOn = 0, maxOff = 0;
    for (let i = 0; i < 24; i++) {
      s.gaitPhase = 0.7 + i * 0.16;
      on.update(s, w.config.fixedDt);
      off.update(s, w.config.fixedDt);
      const n1 = rigNodes(on), n2 = rigNodes(off);
      maxOn = Math.max(maxOn,
        Math.abs(n1.hipL.rotation.x as number) + Math.abs(n1.hipR.rotation.x as number));
      maxOff = Math.max(maxOff,
        Math.abs(n2.hipL.rotation.x as number) + Math.abs(n2.hipR.rotation.x as number));
    }
    expect(maxOn).toBeGreaterThan(0.08);
    expect(maxOff).toBeLessThan(1e-6);
  });

  it('击退步态驱动与正常移动叠加，不会互相覆盖', () => {
    const w = makeWorld();
    const on = makeRig();
    const c = w.character;
    c.grounded = true;
    c.velocity.x = 1.2; c.velocity.z = 0;
    w.playerHurt.type = 'none';
    w.playerHurt.knockX = 0; w.playerHurt.knockZ = 0;
    c.gaitPhase = 0.7; c.stride = 1;
    on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
    const plain = on.gaitDebug().gaitSpeed;
    w.playerHurt.knockZ = 2;
    c.gaitPhase = 0.7;
    on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
    expect(plain).toBeCloseTo(1.2, 6);
    expect(on.gaitDebug().gaitSpeed).toBeCloseTo(Math.hypot(1.2, 2), 6);
  });
});
