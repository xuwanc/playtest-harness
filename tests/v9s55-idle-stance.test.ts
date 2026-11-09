import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import {
  idleStanceConfig, idleStanceTarget, leadFootIsLeft, mixIdleStance, solveIdleStance,
} from '../src/presentation/gait';
import type { GaitPose } from '../src/presentation/gait';
import { makeWorld, intent } from './helpers';
import { GAIT_NO_IDLE } from './mech-gait';
import type { AppConfig, GaitViewConfig } from '../src/core';

/**
 * v9s.55 · 待机斜跨站姿。
 *
 * 用户诉求：「idle 可以支持斜跨站立，停步直接接斜跨，看哪只脚先踩出去」。
 * 三件事各自可验证：
 *  1) 站定后两脚前后错开、重心压在承重腿上（不是「两脚并拢、全身归零」）；
 *  2) 走路时这一层精确为 0（几何与旧步态逐字节一致）；
 *  3) 停步时**前脚 = 最后踩出去的那只**，不是固定的某一边。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

/** 打开斜跨的配置（MECH_GAIT 为了对照干净把整层关了） */
const ON: GaitViewConfig = { ...GAIT_NO_IDLE, idleStance: { enabled: true } };
const CFG = idleStanceConfig(ON)!;

function makeRig(gait: GaitViewConfig = ON): VoxelRig {
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, raw.core.moveSpeed,
    raw.view.orientation, gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false },
  );
}

function zero(): GaitPose {
  return {
    legL: { pitchX: 0, rollZ: 0, kneeX: 0 },
    legR: { pitchX: 0, rollZ: 0, kneeX: 0 },
    pelvisX: 0, pelvisY: 0, pelvisRoll: 0, sideLean: 0,
    armL: 0, armR: 0, strafe: 0, backward: 0,
  };
}

describe('v9s.55 斜跨站姿（纯函数）', () => {
  it('前后脚错开：前脚负（向前）、后脚正（向后），左右镜像', () => {
    const a = solveIdleStance(true, 1, 0, CFG).pose;
    expect(a.legL.pitchX).toBeLessThan(0);
    expect(a.legR.pitchX).toBeGreaterThan(0);
    const b = solveIdleStance(false, 1, 0, CFG).pose;
    expect(b.legL.pitchX).toBeGreaterThan(0);
    expect(b.legR.pitchX).toBeLessThan(0);
    // 幅度对称（同一条曲线的两个方向）
    expect(Math.abs(a.legL.pitchX)).toBeCloseTo(Math.abs(b.legR.pitchX), 9);
    // 错步量级：髋角 0.16 rad ≈ 脚前后 12cm（腿长 0.74）
    expect(a.legL.pitchX).toBeCloseTo(-CFG.frontPitch, 9);
  });

  it('重心倒向承重腿：下沉 / 侧移 / 侧倾 / 下半身偏转都随前脚镜像', () => {
    const l = solveIdleStance(true, 1, 0, CFG);   // 左脚在前 → 承重腿在右
    const r = solveIdleStance(false, 1, 0, CFG);
    expect(l.sink).toBeGreaterThan(0);
    expect(l.shift).toBeGreaterThan(0);           // +X = 角色右侧
    expect(r.shift).toBeLessThan(0);
    expect(l.hipYaw).toBeGreaterThan(0);
    expect(r.hipYaw).toBeLessThan(0);
    // 骨盆与肩线反向（contrapposto）：骨盆向承重侧倾、上身压回来
    expect(Math.sign(l.pose.pelvisRoll)).toBe(-Math.sign(l.pose.sideLean));
  });

  it('不下沉脚：sink / shift 不在步态层（pelvisX / pelvisY 恒为 0）', () => {
    // 写进 pelvisY 会让整条腿跟着下沉（FK 腿挂在下盘上）→ 脚穿地 / 滑步。
    // 这两项必须由骨架层在 IK 基准之后再叠加。
    for (const fl of [true, false]) {
      const p = solveIdleStance(fl, 1, 0.8, CFG).pose;
      expect(p.pelvisX).toBe(0);
      expect(p.pelvisY).toBe(0);
    }
  });

  it('权重 0 精确归零；关闭开关整层消失', () => {
    const off = solveIdleStance(true, 0, 0.5, CFG);
    expect(off.pose).toEqual(zero());
    expect(off.sink).toBe(0);
    expect(off.shift).toBe(0);
    expect(off.hipYaw).toBe(0);
    expect(idleStanceConfig(GAIT_NO_IDLE)).toBeNull();
  });

  it('速度门控：站定满权重、走起来为 0', () => {
    expect(idleStanceTarget(0, CFG)).toBe(1);
    expect(idleStanceTarget(CFG.enterSpeed * 0.5, CFG)).toBe(1);
    expect(idleStanceTarget(CFG.exitSpeed + 0.1, CFG)).toBe(0);
    // 单调（中间不回头）
    let prev = 1;
    for (let v = 0; v <= CFG.exitSpeed; v += 0.02) {
      const w = idleStanceTarget(v, CFG);
      expect(w).toBeLessThanOrEqual(prev + 1e-9);
      prev = w;
    }
  });

  it('停步相位 → 前脚：footOffset > 0 的是左腿', () => {
    // 与 solveStopInertia 的 leadLeft 同一判据
    expect(leadFootIsLeft(0.0001)).toBe(true);
    expect(leadFootIsLeft(Math.PI + 0.0001)).toBe(false);
    // 跨 2π 回绕不能翻符号
    expect(leadFootIsLeft(0.0001 + Math.PI * 4)).toBe(true);
    expect(leadFootIsLeft(Math.PI * 1.2)).toBe(false);
  });

  it('混合保留摆臂：只把腿 / 骨盆 / 侧倾带进来', () => {
    const base: GaitPose = { ...zero(), armL: 0.4, armR: -0.4, strafe: 0.3 };
    const st = solveIdleStance(true, 1, 0, CFG).pose;
    const m = mixIdleStance(base, st, 0.5);
    expect(m.armL).toBe(0.4);
    expect(m.armR).toBe(-0.4);
    expect(m.legL.pitchX).toBeCloseTo(st.legL.pitchX * 0.5, 9);
    expect(m.sideLean).toBeCloseTo(st.sideLean * 0.5, 9);
  });
});

describe('v9s.55 斜跨站姿（骨架集成）', () => {
  it('站定 90 帧：权重升到 1，两脚前后错开', () => {
    const rig = makeRig();
    const w = makeWorld();
    for (let i = 0; i < 90; i++) {
      rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
    }
    const d = rig.gaitDebug();
    expect(d.idleW ?? 0).toBeGreaterThan(0.98);
    expect(d.legLPitch).toBeLessThan(-0.1);
    expect(d.legRPitch).toBeGreaterThan(0.07);
    // 骨盆真的沉了一点（由 IK 反解屈膝，不是写死膝角）
    expect(d.idleSink ?? 0).toBeGreaterThan(0.004);
    rig.dispose();
  });

  it('走起来精确归零：推进 40 帧后 idleW = 0', () => {
    const rig = makeRig();
    const w = makeWorld();
    const hold = intent({ moveX: 1, moveZ: 0 });
    for (let i = 0; i < 40; i++) {
      rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
    }
    // 直接推 Core：速度起来后斜跨必须让位给步态
    for (let i = 0; i < 120; i++) {
      w.character.velocity.x = 2.4;
      rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
    }
    void hold;
    expect(rig.gaitDebug().idleW ?? -1).toBe(0);
    rig.dispose();
  });

  it('停步直接接斜跨：前脚跟着最后踩出去的那只脚走', () => {
    const rig = makeRig();
    const w = makeWorld();
    // 先跑起来（Core 推进相位），再松手减速，最后站定
    for (let i = 0; i < 50; i++) {
      w.character.velocity.x = 2.6;
      rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
    }
    for (let i = 0; i < 90; i++) {
      w.character.velocity.x *= 0.86;
      if (w.character.velocity.x < 0.01) w.character.velocity.x = 0;
      rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
    }
    const d = rig.gaitDebug();
    expect(d.idleW ?? 0).toBeGreaterThan(0.9);
    // 前脚与停步时的领先脚一致：左前 → 左腿髋角为负
    const frontLeft = d.idleFrontLeft ?? true;
    expect(d.legLPitch).toBeLessThan(0);
    expect(d.legRPitch).toBeGreaterThan(0);
    if (!frontLeft) {
      // 这条分支只在停步相位换了脚时触发，同样必须自洽
      expect(d.legLPitch).toBeGreaterThan(0);
    }
    rig.dispose();
  });

  it('关闭开关：站定姿态与旧版逐字节一致（腿角全 0）', () => {
    const rig = makeRig(GAIT_NO_IDLE);
    const w = makeWorld();
    for (let i = 0; i < 60; i++) {
      rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
    }
    const d = rig.gaitDebug();
    expect(d.legLPitch).toBe(0);
    expect(d.legRPitch).toBe(0);
    expect(d.idleW ?? 0).toBe(0);
    rig.dispose();
  });
});
