import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import type { AppConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const elder = raw.view.bodyTypes!.elder!;
const elderVoxel = elder.voxel!;
const HS = elderVoxel.headSize * (elderVoxel.style!.headScale ?? 1);

function makeRig(voxel = raw.view.voxel): VoxelRig {
  return createVoxelRig(
    voxel, raw.view.colors, raw.core.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik,
  );
}

const size = (o: THREE.Object3D): { w: number; h: number; d: number } => {
  const p = ((o as THREE.Mesh).geometry as unknown as { parameters: Record<string, number> }).parameters;
  return { w: p.width, h: p.height, d: p.depth };
};

describe('v9s.53 造型加量：发帽一体 / 肩甲 / 躯干跟随宽度', () => {
  it('体型三项尺寸与 height 自洽（腿 + 躯干 + 头 = 身高）', () => {
    const sum = elderVoxel.legLength + elderVoxel.bodyHeight + elderVoxel.headSize;
    expect(sum).toBeCloseTo(elder.height, 6);
  });

  it('头发是一整块盒子，左右 / 后面都溢出头部（一个 box 穿三面）', () => {
    const rig = makeRig(elderVoxel);
    const cap = rig.group.getObjectByName('hairCap')!;
    expect(cap).toBeTruthy();
    const { w, d } = size(cap);
    // 左右各露一圈 → 正面两条白发边
    expect(w).toBeGreaterThan(HS * 1.1);
    // 后表面必须真的超出头的背面，否则后脑整片被头挡住（旧版 4 片踩过这个坑）
    const headBack = -HS / 2;   // 头的实际几何边长是 HS（= headSize × headScale）
    expect(cap.position.z - d / 2).toBeLessThan(headBack - 0.002);
    // 头顶留白 → 地中海
    expect(cap.position.y + size(cap).h / 2).toBeLessThan(HS * 0.95);
  });

  it('肩甲两块、左右镜像，且比手臂粗一圈', () => {
    const rig = makeRig(elderVoxel);
    const l = rig.group.getObjectByName('spaulderL')!;
    const r = rig.group.getObjectByName('spaulderR')!;
    expect(l).toBeTruthy();
    expect(r).toBeTruthy();
    expect(l.position.x).toBeCloseTo(-r.position.x, 6);
    expect(size(l).w).toBeGreaterThan(elderVoxel.limbThickness);
    // 不挂在肩关节上：挂关节会跟着抬臂翻起来
    expect(l.parent!.name).toBe(r.parent!.name);
    expect(l.parent!.name).not.toBe('shoulderL');
  });

  it('躯干深度跟随宽度：elder 比默认厚，默认仍是 0.28', () => {
    const dElder = size(makeRig(elderVoxel).group.getObjectByName('torsoLower')!).d;
    const dDefault = size(makeRig().group.getObjectByName('torsoLower')!).d;
    expect(dDefault).toBeCloseTo(0.28, 6);
    expect(dElder).toBeGreaterThan(0.30);
  });

  it('默认体型不产生发帽 / 肩甲节点', () => {
    const rig = makeRig();
    expect(rig.group.getObjectByName('hairCap')).toBeUndefined();
    expect(rig.group.getObjectByName('spaulderL')).toBeUndefined();
  });
});
