import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { beardAvoidAt } from '../src/presentation/beard';
import { makeWorld } from './helpers';
import type { AppConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const elderVoxel = raw.view.bodyTypes!.elder!.voxel!;

function makeRig(voxel = elderVoxel): VoxelRig {
  return createVoxelRig(
    voxel, raw.view.colors, raw.core.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik,
  );
}

function step(rig: VoxelRig, w: ReturnType<typeof makeWorld>, n = 1): void {
  for (let i = 0; i < n; i++) rig.update(w.character, w.combat, w.playerHurt, 1 / 60, false);
}

describe('v9s.54 胡子横向：转身 / 侧移 / 避让', () => {
  it('静止不漂：站定 30 帧后前后与左右角都回到 0', () => {
    const rig = makeRig();
    const w = makeWorld();
    const p0 = rig.group.getObjectByName('beard0')!;
    step(rig, w, 30);
    expect(Math.abs(p0.rotation.x as number)).toBeLessThan(1e-6);
    expect(Math.abs(p0.rotation.z as number)).toBeLessThan(1e-6);
  });

  it('原地转身：胡子横向甩出去（旧版这一通道恒为 0）', () => {
    const rig = makeRig();
    const w = makeWorld();
    const p0 = rig.group.getObjectByName('beard0')!;
    step(rig, w, 6);
    // 每帧转 0.09 rad ≈ 5.4 rad/s 的急转（约 310°/s）
    for (let i = 0; i < 10; i++) {
      (w.character as unknown as { bodyYaw: number }).bodyYaw += 0.09;
      step(rig, w, 1);
    }
    expect(Math.abs(p0.rotation.z as number)).toBeGreaterThan(0.05);
    // 左转（yaw 增大）时胡子留在原处 → 相对角色偏右 → rotation.z 为正
    expect(p0.rotation.z as number).toBeGreaterThan(0);
  });

  it('向右起步：胡子因惯性往左拖（符号与加速度相反）', () => {
    const rig = makeRig();
    const w = makeWorld();
    const p0 = rig.group.getObjectByName('beard0')!;
    step(rig, w, 6);
    for (let i = 0; i < 6; i++) {
      w.character.velocity.x = 2.6;   // 持续向右加速
      step(rig, w, 1);
    }
    expect(p0.rotation.z as number).toBeLessThan(-0.004);
  });

  it('手臂避让：手伸到脸前才算威胁，自然垂在手侧不算', () => {
    const face = beardAvoidAt(0.10, -0.20, 0.24);      // 手抬到面前
    expect(face.push).toBeGreaterThan(0.3);
    expect(face.side).toBeLessThan(0);                 // 右手 → 往左推
    const left = beardAvoidAt(-0.10, -0.20, 0.24);
    expect(left.side).toBeGreaterThan(0);              // 左手 → 往右推
    // 自然下垂的手（世界 y≈0.29，头局部 y≈−0.66）：早低于胡子末端，不该触发
    expect(beardAvoidAt(0.28, -0.66, -0.10).push).toBe(0);
    // 手在身后也不算
    expect(beardAvoidAt(0.05, -0.2, -0.3).push).toBe(0);
  });
});

describe('v9s.54 静止呼吸', () => {
  it('站定时躯干厚度在 ±2% 内起伏，跑起来就停', () => {
    const rig = makeRig();
    const w = makeWorld();
    const torso = rig.group.getObjectByName('torsoLower')!;
    step(rig, w, 4);
    const samples: number[] = [];
    for (let i = 0; i < 300; i++) { step(rig, w, 1); samples.push(torso.scale.z); }
    expect(Math.max(...samples) - Math.min(...samples)).toBeGreaterThan(0.02);   // 真的在动
    expect(Math.max(...samples)).toBeLessThanOrEqual(1.0201);
    expect(Math.min(...samples)).toBeGreaterThanOrEqual(0.9799);
    // 跑起来：呼吸权重归零，厚度回到 1
    w.character.velocity.z = 3.0;
    step(rig, w, 6);
    expect(torso.scale.z).toBeCloseTo(1, 3);
  });

  it('默认体型不呼吸（无 style 时 scale 恒为 1）', () => {
    const rig = makeRig(raw.view.voxel);
    const w = makeWorld();
    const torso = rig.group.getObjectByName('torsoLower')!;
    step(rig, w, 60);
    expect(torso.scale.z).toBe(1);
  });
});
