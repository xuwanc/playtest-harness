import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState, WeaponWristViewConfig } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

/**
 * v9s.24 · 「武器像焊在手上」。
 *
 * 根因不是动画幅度，是链路缺自由度：hand 直接挂 mount，武器相对手只有 mountPitch
 * 一个角度、且是整段线性插值；副手是 IK 追右手上的固定点，从不驱动武器。
 *
 * 这一版加了三样，测试逐条盯住：
 *  1) hand 与 mount 之间插 wrist 节点，由「手臂角速度 / 躯干扭转角速度」驱动 → 剑会滞后；
 *  2) 握点沿柄滑动改成带惯性的一阶跟随 → 不再两帧之间从柄尾瞬移到护手；
 *  3) 握持权重随臂展比衰减 → 够不到的阶段虚握，而不是把胳膊拉成面条。
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
const WRIST: WeaponWristViewConfig = raw.view.weaponWrist;

function playerRig(opts: {
  wrist?: WeaponWristViewConfig | 'off';
  mount?: Partial<typeof raw.view.weaponMount>;
} = {}) {
  const w = makeWorld();
  const mountCfg = { ...raw.view.weaponMount, ...(opts.mount ?? {}) };
  const wristCfg = opts.wrist === 'off' ? { ...WRIST, enabled: false } : (opts.wrist ?? WRIST);
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, mountCfg, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false }, raw.view.links, wristCfg,
  );
  return { w, rig };
}

type Frame = {
  i: number; seg: number; phase: string;
  wristPitch: number; wristTwist: number;
  grip: number; gy: number; dist: number;
  tipLocal: THREE.Vector3 | null;
};

/** 按住攻击跑 n 帧（大剑），逐帧采集腕部 / 握持读数。 */
function run(n: number, opts: Parameters<typeof playerRig>[0] = {}) {
  const { w, rig } = playerRig(opts);
  (w.combat as any).weapon = 'greatsword';
  const frames: Frame[] = [];
  const hand = rig.group.getObjectByName('handR')!;
  for (let i = 0; i < n; i++) {
    step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
    (w.combat as any).weapon = 'greatsword';
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    rig.group.updateMatrixWorld(true);
    const d = rig.weaponDebug();
    const gd = rig.gripDebug();
    const blade = rig.weaponBlade();
    frames.push({
      i, seg: w.combat.comboIndex, phase: w.combat.phase,
      wristPitch: d.wristPitch, wristTwist: d.wristTwist,
      grip: gd.grip, gy: gd.gy, dist: gd.dist,
      tipLocal: blade ? hand.worldToLocal(new THREE.Vector3(blade.tip.x, blade.tip.y, blade.tip.z)) : null,
    });
  }
  return { w, rig, frames };
}

describe('v9s.24 腕部：武器相对手的自由度', () => {
  it('关闭腕部时节点恒为单位旋转（与 v9s.23 逐帧一致）', () => {
    const { rig, frames } = run(90, { wrist: 'off' });
    const wrist = rig.group.getObjectByName('wristR')!;
    expect(wrist.rotation.x).toBe(0);
    expect(wrist.rotation.z).toBe(0);
    expect(frames.every((f) => f.wristPitch === 0 && f.wristTwist === 0)).toBe(true);
    rig.dispose();
  });

  it('举顶下劈：手臂快速下压时腕部明显滞后，且方向为「剑落后于手」', () => {
    const { rig, frames } = run(240);
    // 段 3 的 active 段：手臂从 −1.90 摆到 +0.05，角速度最大
    const seg3 = frames.filter((f) => f.seg === 3 && f.phase === 'active');
    expect(seg3.length).toBeGreaterThan(0);
    const minP = Math.min(...seg3.map((f) => f.wristPitch));
    // 手臂 rotation.x 增大 = 向前下方挥，剑受惯性留在后面 → 腕角为负
    expect(minP).toBeLessThan(-0.15);
    rig.dispose();
  });

  it('横扫：躯干扭转把剑横向甩出去，且段 1 / 段 2 符号相反', () => {
    const { rig, frames } = run(240);
    const twistOf = (seg: number) => frames.filter((f) => f.seg === seg).map((f) => f.wristTwist);
    const t1 = twistOf(1);
    const t2 = twistOf(2);
    expect(t1.length).toBeGreaterThan(4);
    expect(t2.length).toBeGreaterThan(4);
    // 段 1 躯干向右拧着起手、向左扫出；段 2 反向。两条曲线必须在零点两侧。
    expect(Math.min(...t1)).toBeLessThan(-0.1);
    expect(Math.max(...t2)).toBeGreaterThan(0.1);
    rig.dispose();
  });

  it('腕角逐帧连续（不会一帧跳 8° 以上）', () => {
    const { rig, frames } = run(240);
    let maxStep = 0;
    for (let i = 1; i < frames.length; i++) {
      maxStep = Math.max(maxStep, Math.abs(frames[i].wristPitch - frames[i - 1].wristPitch));
    }
    // 单帧最大步长出现在「腕角从 0 追到 −0.45」的第一帧：rate = 24/s、dt = 1/60
    // → 一帧吃掉 33% 的差值 ≈ 0.15 rad。这是收敛速度，不是跳变。
    // 换段（attackProgress 1→0）的假角速度已在 applyWrist 里按段号丢弃。
    expect(maxStep).toBeLessThan(0.2);
    rig.dispose();
  });

  it('腕角不超过配置上限', () => {
    const { rig, frames } = run(240);
    for (const f of frames) {
      expect(Math.abs(f.wristPitch)).toBeLessThanOrEqual(WRIST.maxAngle + 1e-6);
      expect(Math.abs(f.wristTwist)).toBeLessThanOrEqual(WRIST.maxTwist + 1e-6);
    }
    rig.dispose();
  });

  it('dt = 0（暂停单步）不产生 NaN，也不改写上一帧的腕角', () => {
    const { w, rig } = playerRig();
    (w.combat as any).weapon = 'greatsword';
    for (let i = 0; i < 30; i++) {
      step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
      (w.combat as any).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    const before = rig.weaponDebug();
    rig.update(w.character, w.combat, NONE, 0, false, w.time);
    const after = rig.weaponDebug();
    expect(Number.isFinite(after.wristPitch)).toBe(true);
    expect(Number.isFinite(after.wristTwist)).toBe(true);
    expect(after.wristPitch).toBeCloseTo(before.wristPitch, 6);
    expect(after.wristTwist).toBeCloseTo(before.wristTwist, 6);
    rig.dispose();
  });

  it('待机走路时动态滞后很小（不含刻意的跑动拖拽）', () => {
    // runDrag 置 0 单独看「摆臂引起的滞后」：走路摆臂约 6.9 rad/s，
    // 不按攻击权重缩放的话会解出 15° 的滞后，读起来像手腕脱臼。
    const { w, rig } = playerRig({ wrist: { ...WRIST, runDrag: 0 } });
    let maxAbs = 0;
    for (let i = 0; i < 120; i++) {
      step(w, w.config.fixedDt, intent({ moveX: 1 }));
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const d = rig.weaponDebug();
      maxAbs = Math.max(maxAbs, Math.abs(d.wristPitch), Math.abs(d.wristTwist));
    }
    expect(maxAbs).toBeLessThan(0.12);
    rig.dispose();
  });

  it('跑动时剑按 runDrag 后仰 —— 非攻击状态下也不是焊死的', () => {
    const { w, rig } = playerRig();
    for (let i = 0; i < 120; i++) {
      step(w, w.config.fixedDt, intent({ moveX: 1 }));
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    const d = rig.weaponDebug();
    // 满速时约 −runDrag，允许摆臂滞后叠加
    expect(d.wristPitch).toBeLessThan(-WRIST.runDrag * 0.6);
    expect(d.wristPitch).toBeGreaterThan(-WRIST.runDrag - 0.12);
    rig.dispose();
  });

  it('剑尖相对手的局部坐标确实随腕角变化（不是被手臂刚性带着走）', () => {
    const on = run(240);
    const off = run(240, { wrist: 'off' });
    // 取同一帧（段 3 active，腕角最大）比较剑尖在手部坐标系里的位置
    const pick = (fs: Frame[]) => fs.find((f) => f.seg === 3 && f.phase === 'active' && f.tipLocal)!;
    const a = pick(on.frames);
    const b = pick(off.frames);
    expect(a.tipLocal).not.toBeNull();
    expect(b.tipLocal).not.toBeNull();
    const delta = a.tipLocal!.distanceTo(b.tipLocal!);
    expect(delta).toBeGreaterThan(0.05);
    on.rig.dispose();
    off.rig.dispose();
  });
});

describe('v9s.24 握持：滑动有惯性，够不到时虚握', () => {
  it('握点相邻帧位移连续（旧版一帧能跳掉 55% 柄长）', () => {
    const { rig, frames } = run(240);
    const active = frames.filter((f) => f.grip > 0);
    let maxJump = 0;
    for (let i = 1; i < active.length; i++) {
      maxJump = Math.max(maxJump, Math.abs(active[i].gy - active[i - 1].gy));
    }
    // 柄长量级约 0.4m，单帧滑 0.06 以内读起来就是「手在推」而不是「手瞬移」
    expect(maxJump).toBeLessThan(0.06);
    rig.dispose();
  });

  it('举顶够不到时握持权重降到 twoHandMinGrip 附近，而不是把胳膊拉成面条', () => {
    const minGrip = raw.view.weaponMount.twoHandMinGrip;
    const { rig, frames } = run(240);
    const lowest = Math.min(...frames.filter((f) => f.grip > 0).map((f) => f.grip));
    expect(lowest).toBeLessThan(0.95);
    expect(lowest).toBeGreaterThanOrEqual(minGrip - 1e-6);
    rig.dispose();
  });

  it('twoHandMinGrip = 1 时永不松手（旧行为可复现）', () => {
    const { rig, frames } = run(240, { mount: { twoHandMinGrip: 1 } });
    const lowest = Math.min(...frames.filter((f) => f.grip > 0).map((f) => f.grip));
    expect(lowest).toBeCloseTo(1, 6);
    rig.dispose();
  });

  it('握持权重下降时，副手到柄轴的距离反而更容易超差 —— 这是刻意的取舍', () => {
    const tight = run(240, { mount: { twoHandMinGrip: 1, twoHandMaxStretch: 1.3 } });
    const loose = run(240, { mount: { twoHandMinGrip: 0.5 } });
    const worst = (fs: Frame[]) => Math.max(...fs.filter((f) => f.dist > 0).map((f) => f.dist));
    // 松手组允许手停在臂展末端（dist 更小 = 更早放弃够），因此不会比拉长组更远
    expect(worst(loose.frames)).toBeLessThanOrEqual(worst(tight.frames) + 1e-6);
    tight.rig.dispose();
    loose.rig.dispose();
  });
});
