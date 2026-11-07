import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { crowdResistance, crowdResistanceUpdate, snapshot } from '../src/core';
import { solveGait, solveStopInertia } from '../src/presentation/gait';
import { attackGaitDrive } from '../src/presentation/program-anim';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeQuietWorld, makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import { MECH_GAIT } from './mech-gait';
import type { AppConfig, GaitViewConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

// 最小 DOM stub：createDummyRig 用 CanvasTexture 画标签，getContext 为 null 时直接跳过
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const crowd = raw.core.separation.crowd;
const pr = raw.core.characterRadius;
const dr = raw.core.dummies.radius;
const minD = pr + dr;

function dummiesAt(...xs: [number, number][]): { position: { x: number; y: number; z: number } }[] {
  return xs.map(([x, z]) => ({ position: { x, y: 0, z } }));
}
/** 玩家在 (0,0)、速度沿 +X，把假人放在指定位置，求速度保留系数。 */
function resist(vx: number, vz: number, pos: [number, number][], cfg = crowd): number {
  return crowdResistance(0, 0, vx, vz, pr, dummiesAt(...pos), dr, cfg);
}

function makeRig(opts: { gait?: GaitViewConfig; strideScale?: number } = {}): VoxelRig {
  const gait = opts.gait ?? MECH_GAIT;
  const anim = opts.strideScale === undefined
    ? raw.view.animation
    : {
      ...raw.view.animation,
      stride: { ...raw.view.animation.stride, strideScale: opts.strideScale },
    };
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, raw.core.moveSpeed,
    raw.view.orientation, gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt, anim,
  );
}

const legMag = (d: ReturnType<VoxelRig['gaitDebug']>): number =>
  Math.abs(d.legLPitch) + Math.abs(d.legLRoll)
  + Math.abs(d.legRPitch) + Math.abs(d.legRRoll);

/* -------------------------------------------------------------------------- *
 * 1) 碰撞阻力：只惩罚「主动朝对方推进」的一方
 * -------------------------------------------------------------------------- */
describe('v9p 挤压阻力纯函数：方向 / 距离 / 关闭', () => {
  it('正面顶住（速度指向假人、刚好贴边）：系数降到配置下限', () => {
    expect(resist(4, 0, [[minD, 0]])).toBeCloseTo(crowd.minScale, 6);
  });

  it('背对远离：完全不减速', () => {
    expect(resist(-4, 0, [[minD, 0]])).toBe(1);
    expect(resist(0, -4, [[0, minD]])).toBe(1);
  });

  it('侧向擦过：完全不减速（保留贴身绕行手感）', () => {
    expect(resist(0, 4, [[minD, 0]])).toBe(1);
  });

  it('斜向（45°）介于下限与 1 之间，且越正对系数越小（阻力越强）', () => {
    const r45 = resist(4, 4, [[minD, 0]]);
    const r22 = resist(4, 1.6, [[minD, 0]]);
    expect(r45).toBeGreaterThan(crowd.minScale);
    expect(r45).toBeLessThan(1);
    expect(r22).toBeLessThan(r45);
  });

  it('距离超出接触缓冲带：无阻力；带内连续过渡', () => {
    expect(resist(4, 0, [[minD + crowd.contactBand + 0.01, 0]])).toBe(1);
    const near = resist(4, 0, [[minD + 0.05, 0]]);
    const far = resist(4, 0, [[minD + 0.3, 0]]);
    expect(near).toBeLessThan(far);
    expect(far).toBeLessThanOrEqual(1);
  });

  it('完全重合（方向不可判定）：按最强正面挤压处理', () => {
    expect(resist(4, 0, [[0, 0]])).toBeCloseTo(crowd.minScale, 6);
  });

  it('速度为 0 → 无阻力（不动的人不该被判成在挤）', () => {
    expect(resist(0, 0, [[minD, 0]])).toBe(1);
  });

  it('minScale=1 / contactBand=0 都能精确关闭（回到旧行为）', () => {
    expect(resist(4, 0, [[minD, 0]], { ...crowd, minScale: 1 })).toBe(1);
    expect(resist(4, 0, [[minD, 0]], { ...crowd, contactBand: 0 })).toBe(1);
  });

  it('多个假人同时贴住取最强的一个，不连乘（不会被围住时速度清零）', () => {
    const one = resist(4, 0, [[minD, 0]]);
    const many = resist(4, 0, [[minD, 0], [minD + 0.1, 0.05], [minD + 0.2, -0.05]]);
    expect(many).toBeCloseTo(one, 6);
  });

  it('系数恒在 [minScale, 1]（批量采样，无越界 / NaN）', () => {
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const r = resist(Math.cos(a) * 4, Math.sin(a) * 4, [[minD * Math.cos(a), minD * Math.sin(a)]]);
      expect(Number.isFinite(r)).toBe(true);
      expect(r).toBeGreaterThanOrEqual(crowd.minScale - 1e-9);
      expect(r).toBeLessThanOrEqual(1 + 1e-9);
    }
  });
});

describe('v9p 挤压阻力 Core 集成：只改速度、不改位置、可关闭、确定性', () => {
  it('crowdResistanceUpdate 只衰减 velocity，position 一个字节都不动', () => {
    const w = makeWorld();
    w.character.velocity.x = 3;
    w.character.velocity.z = 0;
    w.dummies[0].position.x = 1;
    w.dummies[0].position.z = 8;
    const px = w.character.position.x;
    const pz = w.character.position.z;
    crowdResistanceUpdate(w);
    expect(w.character.position.x).toBe(px);
    expect(w.character.position.z).toBe(pz);
    expect(w.character.velocity.x).toBeLessThan(3);
    expect(w.character.velocity.x).toBeGreaterThan(0);
  });

  function pushRun(minScale: number) {
    const w = makeWorld();
    w.modules.targeting = false;
    for (const s of w.dummies) { s.mode = 'idle'; s.velocity.x = 0; s.velocity.z = 0; }
    // 假人 0 放在玩家 (0,8) 正前方 1m；其余挪到远处，避免互相干扰
    w.dummies[0].position.x = 0; w.dummies[0].position.z = 7;
    w.dummies[1].position.x = -12; w.dummies[1].position.z = -12;
    w.dummies[2].position.x = 12; w.dummies[2].position.z = -12;
    w.dummies[3].position.x = -12; w.dummies[3].position.z = 12;
    w.config.separation.crowd.minScale = minScale;
    run(w, 40, intent({ moveX: 0, moveZ: -1 }));
    return w;
  }

  it('主动顶着假人走：开启阻力后推进明显更少、速度更低（推着走不再畅通）', () => {
    const on = pushRun(0.32);
    const off = pushRun(1);
    expect(on.character.position.z).toBeGreaterThan(off.character.position.z + 0.1);
    expect(Math.abs(on.character.velocity.z)).toBeLessThan(Math.abs(off.character.velocity.z));
  });

  it('分离仍生效：不论阻力开关，假人都被推到不小于最小间距', () => {
    for (const scale of [0.32, 1]) {
      const w = pushRun(scale);
      const d = Math.hypot(
        w.dummies[0].position.x - w.character.position.x,
        w.dummies[0].position.z - w.character.position.z,
      );
      expect(d).toBeGreaterThanOrEqual(minD - 1e-6);
    }
  });

  it('关闭 separation 模块时完全无阻力（与 minScale=1 等价）', () => {
    const w = pushRun(0.32);
    const w2 = makeWorld();
    w2.modules.separation = false;
    w2.modules.targeting = false;
    w2.config.separation.crowd.minScale = 0;
    for (const s of w2.dummies) { s.mode = 'idle'; s.velocity.x = 0; s.velocity.z = 0; }
    w2.dummies[0].position.x = 0; w2.dummies[0].position.z = 7;
    run(w2, 40, intent({ moveX: 0, moveZ: -1 }));
    // separation 关掉后玩家不会被假人挡住（可以重叠），推进应远快于开阻力时
    expect(w2.character.position.z).toBeLessThan(w.character.position.z);
  });

  it('含挤压的长序列仍逐字节确定性', () => {
    const a = pushRun(0.32);
    const b = pushRun(0.32);
    expect(snapshot(a)).toBe(snapshot(b));
  });

  it('侧向绕行不减速：速度与关闭阻力时一致', () => {
    // 玩家在 (0,8) 沿 +X 走，假人在正前方 (0,7) → 侧向，不该被判成主动挤
    const w = makeWorld();
    w.character.velocity.x = 3; w.character.velocity.z = 0;
    w.dummies[0].position.x = 0; w.dummies[0].position.z = 7;
    const before = w.character.velocity.x;
    crowdResistanceUpdate(w);
    expect(w.character.velocity.x).toBe(before);
  });
});

/* -------------------------------------------------------------------------- *
 * 2) 停步惯性：前脚踩出 + 身体微前移，两端归零
 * -------------------------------------------------------------------------- */
describe('v9p 停步惯性纯函数：脉冲包络 / 领先腿 / 方向投影', () => {
  const cfg = MECH_GAIT;
  const peak = cfg.stopPeakRatio;

  it('t=0 与 t=1 全部幅度精确为 0（与待机无缝衔接）', () => {
    for (const t of [0, 1]) {
      const s = solveStopInertia(t, 0.7, 1, 0, cfg);
      expect(s.env).toBe(0);
      expect(s.leadPitch).toBe(0);
      expect(s.trailPitch).toBe(0);
      expect(s.leadKnee).toBe(0);
      expect(s.bodyShift).toBe(0);
      expect(s.chestPitch).toBe(0);
    }
  });

  it('t=peak 时幅度精确等于配置值、env=1', () => {
    const s = solveStopInertia(peak, 0.7, 1, 0, cfg);
    expect(s.env).toBeCloseTo(1, 9);
    expect(s.leadPitch).toBeCloseTo(cfg.stopStepPitch, 9);
    expect(s.trailPitch).toBeCloseTo(cfg.stopTrailPitch, 9);
    expect(s.leadKnee).toBeCloseTo(cfg.stopStepKnee, 9);
    expect(s.bodyShift).toBeCloseTo(cfg.stopBodyShift, 9);
    expect(s.chestPitch).toBeCloseTo(cfg.stopChestPitch, 9);
  });

  it('包络在峰值两侧分别单调，且两端导数为 0（端点附近变化极小）', () => {
    let prev = -1;
    for (let i = 0; i <= 20; i++) {
      const e = solveStopInertia((i / 20) * peak, 0.7, 1, 0, cfg).env;
      expect(e).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = e;
    }
    prev = 2;
    for (let i = 0; i <= 20; i++) {
      const e = solveStopInertia(peak + (i / 20) * (1 - peak), 0.7, 1, 0, cfg).env;
      expect(e).toBeLessThanOrEqual(prev + 1e-9);
      prev = e;
    }
    // 两端导数 0：离端点 0.01 时包络仍几乎为 0
    expect(solveStopInertia(0.01, 0.7, 1, 0, cfg).env).toBeLessThan(0.01);
    expect(solveStopInertia(0.99, 0.7, 1, 0, cfg).env).toBeLessThan(0.01);
  });

  it('领先腿按停步相位判定：phase=0 左腿在前、phase=π 右腿在前', () => {
    expect(solveStopInertia(peak, 0, 1, 0, cfg).leadLeft).toBe(true);
    expect(solveStopInertia(peak, Math.PI, 1, 0, cfg).leadLeft).toBe(false);
  });

  it('移动方向单位化：纯前 / 纯右 / 后退 / 侧后都一样正确', () => {
    expect(solveStopInertia(peak, 0.7, 2, 0, cfg).fwdN).toBeCloseTo(1, 9);
    expect(solveStopInertia(peak, 0.7, 0, 3, cfg).rightN).toBeCloseTo(1, 9);
    expect(solveStopInertia(peak, 0.7, -2, 0, cfg).fwdN).toBeCloseTo(-1, 9);
    const diag = solveStopInertia(peak, 0.7, 3, 4, cfg);
    expect(diag.fwdN).toBeCloseTo(0.6, 9);
    expect(diag.rightN).toBeCloseTo(0.8, 9);
  });

  it('几乎静止时默认朝身体前方（不产生 NaN）', () => {
    const s = solveStopInertia(peak, 0.7, 0, 0, cfg);
    expect(s.fwdN).toBeCloseTo(1, 9);
    expect(s.rightN).toBe(0);
  });

  it('所有幅度拉 0 = 精确回到 v9o 行为（调试面板可对照）', () => {
    const off: GaitViewConfig = {
      ...cfg, stopStepPitch: 0, stopTrailPitch: 0, stopStepKnee: 0,
      stopBodyShift: 0, stopChestPitch: 0,
    };
    const s = solveStopInertia(peak, 0.7, 1, 0, off);
    expect(s.leadPitch + s.trailPitch + s.leadKnee + s.bodyShift + s.chestPitch).toBe(0);
  });
});

describe('v9p 主角集成：停步时前脚踩出、身体微前移、再收回待机', () => {
  it('松手停步：stopStep / stopShift 出现峰值，收相跑完后归零', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig();
    run(w, 90, intent({ moveX: 0, moveZ: 1 }));
    let maxStep = 0;
    let maxShift = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, intent({}));
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = rig.gaitDebug();
      maxStep = Math.max(maxStep, d.stopStep);
      maxShift = Math.max(maxShift, d.stopShift);
    }
    // 收相按 dt/stopSec 离散推进，峰值不一定精确落在 peak，留 5% 采样误差
    expect(maxStep).toBeGreaterThan(MECH_GAIT.stopStepPitch * 0.95);
    expect(maxStep).toBeLessThanOrEqual(MECH_GAIT.stopStepPitch + 1e-9);
    expect(maxShift).toBeGreaterThan(MECH_GAIT.stopBodyShift * 0.95);
    expect(maxShift).toBeLessThanOrEqual(MECH_GAIT.stopBodyShift + 1e-9);
    const end = rig.gaitDebug();
    expect(end.stopT).toBeGreaterThan(0.9);
    expect(end.stopStep).toBe(0);
    expect(end.stopShift).toBe(0);
    expect(legMag(end)).toBe(0);
  });

  it('惯性确实让前脚多踩出去：峰值帧双腿俯仰大于关闭惯性时', () => {
    const wOn = makeQuietWorld(); wOn.modules.targeting = false;
    const wOff = makeQuietWorld(); wOff.modules.targeting = false;
    const offCfg: GaitViewConfig = {
      ...MECH_GAIT, stopStepPitch: 0, stopTrailPitch: 0, stopStepKnee: 0,
      stopBodyShift: 0, stopChestPitch: 0,
    };
    const on = makeRig();
    const off = makeRig({ gait: offCfg });
    run(wOn, 90, intent({ moveX: 0, moveZ: 1 }));
    run(wOff, 90, intent({ moveX: 0, moveZ: 1 }));
    let onMax = 0;
    let offMax = 0;
    for (let i = 0; i < 60; i++) {
      run(wOn, 1, intent({})); run(wOff, 1, intent({}));
      on.update(wOn.character, wOn.combat, wOn.playerHurt, wOn.config.fixedDt, false);
      off.update(wOff.character, wOff.combat, wOff.playerHurt, wOff.config.fixedDt, false);
      const a = on.gaitDebug();
      const b = off.gaitDebug();
      if (a.stopT >= 0 && a.stopT <= 1) {
        onMax = Math.max(onMax, Math.abs(a.legLPitch) + Math.abs(a.legRPitch));
        offMax = Math.max(offMax, Math.abs(b.legLPitch) + Math.abs(b.legRPitch));
      }
    }
    expect(onMax).toBeGreaterThan(offMax + 0.05);
  });

  it('配置全 0 时诊断读数恒为 0（精确对照 v9o）', () => {
    const w = makeWorld(); w.modules.targeting = false;
    const offCfg: GaitViewConfig = {
      ...MECH_GAIT, stopStepPitch: 0, stopTrailPitch: 0, stopStepKnee: 0,
      stopBodyShift: 0, stopChestPitch: 0,
    };
    const rig = makeRig({ gait: offCfg });
    run(w, 90, intent({ moveX: 0, moveZ: 1 }));
    for (let i = 0; i < 60; i++) {
      run(w, 1, intent({}));
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      expect(rig.gaitDebug().stopStep).toBe(0);
      expect(rig.gaitDebug().stopShift).toBe(0);
    }
  });

  it('假人同构：减速停步时骨盆沿移动方向微前移，配置全 0 则不动', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const make = (gait: GaitViewConfig) => createDummyRig(
      raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
      w.config.dummies.moveSpeed, gait, raw.view.hurt, raw.view.lean,
    );
    const offCfg: GaitViewConfig = { ...MECH_GAIT, stopBodyShift: 0, stopStepPitch: 0 };
    const on = make(MECH_GAIT);
    const off = make(offCfg);
    const state = () => ({
      ...s,
      bodyYaw: 0, headYaw: 0, stride: 1,
    });
    // 假人惯性层本身也会写 pelvis.position.z，故比较「开 / 关惯性」两组同帧差值，
    // 差值就是停步惯性独占的那一份身体前移。
    let maxDiff = 0;
    // 先高速稳定，再逐帧指数减速，触发与主角同构的 stopBlendGate
    for (let i = 0; i < 20; i++) {
      s.velocity.x = 0; s.velocity.z = 2.0;
      s.gaitPhase = (i * 0.12) % (Math.PI * 2);
      const st = state();
      on.update(st, w.config.fixedDt); off.update(st, w.config.fixedDt);
    }
    for (let i = 0; i < 40; i++) {
      s.velocity.x = 0; s.velocity.z = 2.0 * Math.pow(0.78, i);
      s.gaitPhase = ((20 + i) * 0.12) % (Math.PI * 2);
      const st = state();
      on.update(st, w.config.fixedDt); off.update(st, w.config.fixedDt);
      const onZ = rigNodes(on).pelvis.position.z as number;
      const offZ = rigNodes(off).pelvis.position.z as number;
      maxDiff = Math.max(maxDiff, Math.abs(onZ - offZ));
    }
    expect(maxDiff).toBeGreaterThan(0.01);
  });
});

/* -------------------------------------------------------------------------- *
 * 3) 攻击步幅：物理步幅路径 + 单次往返相位（不再碎步 / 不再收势抽动）
 * -------------------------------------------------------------------------- */
describe('v9p 攻击步幅与相位纯函数', () => {
  const st = raw.view.animation.stride;
  const locked = { speed: 0, phase: 0, localForward: 0, localRight: 0, stride: 1 };

  it('strideScale 把 Core 步幅放大后喂给解算器；=0 精确回到旧回退路径', () => {
    const d = attackGaitDrive(locked, 0.5, 1, 1, st, 0);
    expect(d.stride).toBeCloseTo(st.strideScale, 9);
    const off = attackGaitDrive(locked, 0.5, 1, 1, { ...st, strideScale: 0 }, 0);
    expect(off.stride).toBe(0);
  });

  it('等效步幅按 b² 从 0 淡入：过渡帧拿不到满步幅', () => {
    const half = attackGaitDrive(locked, 0.5, 1, 0.5, st, 0);
    expect(half.stride).toBeCloseTo(st.strideScale * 0.25, 9);
  });

  it('v9s.8 移动时步幅淡出回到「真实步幅」，不再掉到 0（修攻击结束后脚滑）', () => {
    // 玩家攻击结束立刻移动：real.speed > 0，等效步幅必须收敛到 c.stride，
    // 才能与 Core「按物理 stride 推进 gaitPhase」严格配套（支撑脚零滑步）。
    const moving = { ...locked, speed: 1.6, localForward: 1.6, stride: 1.15 };
    const d = attackGaitDrive(moving, 0.5, 1, 0.35, st, 0);
    const target = st.strideScale * 1.15;
    expect(d.stride).toBeCloseTo(1.15 + (target - 1.15) * 0.35 * 0.35, 9);
    // 静止时仍走旧回退路径（stride → 0），保证起手第一帧不把腿一下撑开
    expect(attackGaitDrive(locked, 0.5, 1, 0.35, st, 0).stride)
      .toBeCloseTo(st.strideScale * 0.35 * 0.35, 9);
  });

  it('blend=0 原样返回真实输入', () => {
    expect(attackGaitDrive(locked, 0.5, 1, 0, st, 0)).toBe(locked);
  });

  it('相位做单次往返：p=0/1 回到基准，p=0.5 走出去 π×cycles', () => {
    const base = 1.2;
    const r = { ...locked, phase: base };
    expect(attackGaitDrive(r, 0, 1, 1, st, base).phase).toBeCloseTo(base, 9);
    expect(attackGaitDrive(r, 1, 1, 1, st, base).phase).toBeCloseTo(base, 9);
    const mid = attackGaitDrive(r, 0.5, 1, 1, st, base);
    expect(Math.abs(mid.phase - base)).toBeCloseTo(Math.PI * Math.round(st.cycles), 9);
  });

  it('最短弧插值：b=1 时姿态与 drive.phase 等价（差整数个 TAU）', () => {
    const r = { ...locked, phase: 2.9 };
    const d = attackGaitDrive(r, 0.5, 1, 1, st, 0);
    expect(Math.cos(d.phase)).toBeCloseTo(Math.cos(Math.PI), 8);
    expect(Math.sin(d.phase)).toBeCloseTo(Math.sin(Math.PI), 8);
  });

  it('淡出端点平滑：b 从 1 降到 0.98 相位几乎不动', () => {
    const r = { ...locked, phase: 2.9 };
    const a = attackGaitDrive(r, 1, 1, 1, st, 0);
    const b = attackGaitDrive(r, 1, 1, 0.98, st, 0);
    expect(Math.abs(a.phase - b.phase)).toBeLessThan(0.02);
  });

  it('放大步幅确实让攻击摆腿更大（脚前伸更远）', () => {
    const peakPitch = (scale: number): number => {
      const cfg = { ...st, strideScale: scale };
      let m = 0;
      for (let k = 0; k < 48; k++) {
        const d = attackGaitDrive(locked, k / 48, 1, 1, cfg, 0);
        const pose = solveGait({
          phase: d.phase, speed: d.speed, moveSpeed: raw.core.moveSpeed,
          localForward: d.localForward, localRight: d.localRight,
          legLength: raw.view.voxel.legLength, stride: d.stride ?? 0, grounded: true,
        }, MECH_GAIT);
        m = Math.max(m, Math.abs(pose.legL.pitchX), Math.abs(pose.legR.pitchX));
      }
      return m;
    };
    expect(peakPitch(st.strideScale)).toBeGreaterThan(peakPitch(0) * 1.4);
  });
});

describe('v9p 主角集成：攻击相位不再忽快忽慢、步幅可见加大', () => {
  function sample(strideScale: number) {
    const w = makeWorld();
    const rig = makeRig({ strideScale });
    run(w, 1, intent({ weaponSlot: 1 }));
    run(w, 1, intent({ attackPressed: true }));
    let prevPhase = rig.attackWeights().stridePhase;
    let maxDPhase = 0;
    let maxLeg = 0;
    for (let i = 0; i < 60; i++) {
      run(w, 1, intent());
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
      const aw = rig.attackWeights();
      if (w.combat.phase !== 'idle') {
        maxDPhase = Math.max(maxDPhase, Math.abs(aw.stridePhase - prevPhase));
        maxLeg = Math.max(maxLeg, Math.abs(rigNodes(rig).hipL.rotation.x as number));
      }
      prevPhase = aw.stridePhase;
    }
    return { maxDPhase, maxLeg };
  }

  it('攻击期间相位逐帧推进有界（旧版 active 段双重推进可达 0.62 rad/帧）', () => {
    expect(sample(stScale()).maxDPhase).toBeLessThan(0.45);
  });

  it('开启步幅放大后攻击摆腿峰值明显大于关闭时', () => {
    expect(sample(stScale()).maxLeg).toBeGreaterThan(sample(0).maxLeg * 1.25);
  });
});

function stScale(): number { return raw.view.animation.stride.strideScale; }
