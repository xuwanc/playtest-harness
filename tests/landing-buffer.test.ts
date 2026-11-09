import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { GAIT_NO_IDLE } from './mech-gait';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, ProgramAnimViewConfig, World } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

function animCfg(overrides: Partial<ProgramAnimViewConfig['landing']> = {}): ProgramAnimViewConfig {
  const cfg = JSON.parse(JSON.stringify(raw.view.animation)) as ProgramAnimViewConfig;
  Object.assign(cfg.landing, overrides);
  return cfg;
}

function makeRig(anim: ProgramAnimViewConfig = animCfg()): VoxelRig {
  const w = makeWorld();
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, GAIT_NO_IDLE, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim,
  );
}

const DT = 1 / 60;

function frame(rig: VoxelRig, w: World, t: number): void {
  rig.update(w.character, w.combat, w.playerHurt, DT, false, t);
}
/** v8f：下沉写在共享骨盆上，基准是髋部高度 legLen，故取「相对基准的偏移」。 */
function bobY(rig: VoxelRig): number {
  return (rigNodes(rig).pelvis.position.y as number) - raw.view.voxel.legLength;
}
function kneeX(rig: VoxelRig): number {
  return rigNodes(rig).kneeL.rotation.x as number;
}

/** 手工构造一次「空中 → 落地」边沿，并推进若干 Core 时间，收集缓冲读数。 */
function landingSequence(fallVy: number, cfg = animCfg()) {
  const w = makeWorld();
  const rig = makeRig(cfg);
  const samples: { pulse: number; bobY: number; knee: number; kind: string }[] = [];

  w.character.grounded = false;
  w.character.velocity.y = fallVy;
  frame(rig, w, 0);                       // 建立 prevGrounded=false / prevVy=fallVy

  w.character.grounded = true;             // 落地当帧 Core 已把 vy 置 0
  w.character.velocity.y = 0;
  for (let i = 1; i <= 40; i++) {
    frame(rig, w, i * DT);
    samples.push({
      pulse: rig.landing().pulse,
      bobY: bobY(rig),
      knee: kneeX(rig),
      kind: rig.landing().kind,
    });
  }
  return { w, rig, samples };
}

describe('v8c 跳跃 / 落地蓄力缓冲：纯程序动画叠加，不改跳跃驱动', () => {
  it('真实 Core 跳跃落地：有无 rig 两条世界轨迹逐字节一致', () => {
    const wA = makeWorld();
    const wB = makeWorld();
    const rig = makeRig();
    const types: string[] = [];
    types.push(...run(wA, 1, intent({ jumpPressed: true })).map((e) => e.type));
    run(wB, 1, intent({ jumpPressed: true }));
    for (let i = 0; i < 90; i++) {
      types.push(...run(wA, 1, intent()).map((e) => e.type));
      frame(rig, wA, wA.time);
      run(wB, 1, intent());
    }
    expect(types).toContain('jumped');
    expect(types).toContain('landed');
    expect(wA.tick).toBe(wB.tick);
    expect(wA.time).toBe(wB.time);
    expect(wA.character).toEqual(wB.character);   // rig 完全不回写 Core
    expect(wA.character.position.y).toBe(0);      // 落地高度仍由 Core 决定
    expect(wA.character.velocity.y).toBe(0);
  });

  it('落地触发下蹲缓冲：重心下沉 + 屈膝，脉冲按 Core 时间衰减到 0 且无残留', () => {
    const { rig, samples } = landingSequence(-8);
    const maxPulse = Math.max(...samples.map((s) => s.pulse));
    const minBob = Math.min(...samples.map((s) => s.bobY));
    const maxKnee = Math.max(...samples.map((s) => s.knee));

    expect(maxPulse).toBeGreaterThan(0.3);
    expect(minBob).toBeLessThan(-0.03);            // 重心确实沉下去（蓄力吸收）
    expect(maxKnee).toBeGreaterThan(0.2);          // 屈膝确实发生
    expect(samples.some((s) => s.kind === 'land')).toBe(true);
    expect(rig.landing().impactVy).toBe(-8);

    const tail = samples.slice(-3);
    for (const s of tail) {
      expect(s.pulse).toBe(0);
      expect(Math.abs(s.bobY)).toBeLessThan(1e-9);  // 完全交还给步态基准
      expect(Math.abs(s.knee)).toBeLessThan(1e-9);
      expect(s.kind).toBe('none');
    }
  });

  it('冲击越强压得越深：高处落下明显强于小跳，但小跳也有可见缓冲', () => {
    const weak = landingSequence(-1);
    const strong = landingSequence(-8);
    const weakPeak = Math.max(...weak.samples.map((s) => s.pulse));
    const strongPeak = Math.max(...strong.samples.map((s) => s.pulse));
    expect(weakPeak).toBeGreaterThan(0.2);
    expect(strongPeak).toBeGreaterThan(weakPeak * 1.4);
    expect(Math.min(...strong.samples.map((s) => s.bobY)))
      .toBeLessThan(Math.min(...weak.samples.map((s) => s.bobY)));
  });

  it('起跳瞬间有短促预备下蹲，随后落地缓冲独立触发', () => {
    const w = makeWorld();
    const rig = makeRig();
    frame(rig, w, 0);                                   // grounded = true
    w.character.grounded = false;
    w.character.velocity.y = w.config.jumpSpeed;
    let jumpPulse = 0;
    let sawJump = false;
    for (let i = 1; i <= 8; i++) {
      frame(rig, w, i * DT);
      jumpPulse = Math.max(jumpPulse, rig.landing().pulse);
      if (rig.landing().kind === 'jump') sawJump = true;
    }
    expect(sawJump).toBe(true);
    expect(jumpPulse).toBeGreaterThan(0.1);
    // 关掉起跳预备后，同样的起跳边沿不产生脉冲
    const quiet = makeRig(animCfg({ jumpAnticipation: 0 }));
    const w2 = makeWorld();
    frame(quiet, w2, 0);
    w2.character.grounded = false;
    w2.character.velocity.y = w2.config.jumpSpeed;
    let quietPulse = 0;
    for (let i = 1; i <= 8; i++) {
      frame(quiet, w2, i * DT);
      quietPulse = Math.max(quietPulse, quiet.landing().pulse);
    }
    expect(quietPulse).toBe(0);
  });

  it('enabled=false 完全不叠加缓冲；脉冲用 Core 时间计时，暂停时冻结', () => {
    const off = landingSequence(-8, animCfg({ enabled: false }));
    expect(Math.max(...off.samples.map((s) => s.pulse))).toBe(0);
    expect(Math.min(...off.samples.map((s) => s.bobY))).toBe(0);

    const w = makeWorld();
    const rig = makeRig();
    w.character.grounded = false;
    w.character.velocity.y = -8;
    frame(rig, w, 0);
    w.character.grounded = true;
    w.character.velocity.y = 0;
    frame(rig, w, 3 * DT);                       // 落地触发（此刻 p=0）
    frame(rig, w, 3 * DT + 4 * DT);               // 推进到下压峰值附近
    const frozen = rig.landing().pulse;
    expect(frozen).toBeGreaterThan(0);
    // 同一个 Core 时间重复渲染（暂停 / 单步未推进）：脉冲不变，不随真实帧时间衰减
    frame(rig, w, 3 * DT + 4 * DT);
    frame(rig, w, 3 * DT + 4 * DT);
    expect(rig.landing().pulse).toBe(frozen);
    // 时间推进超过总时长后归零
    frame(rig, w, 3 * DT + raw.view.animation.landing.duration + DT);
    expect(rig.landing().pulse).toBe(0);
  });
});
