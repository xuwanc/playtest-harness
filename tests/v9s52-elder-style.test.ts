import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { spineChain, torsoPitchOf } from './rig-nodes';
import { makeWorld } from './helpers';
import type { AppConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const elderVoxel = raw.view.bodyTypes!.elder!.voxel!;

function makeRig(voxel = raw.view.voxel): VoxelRig {
  return createVoxelRig(
    voxel, raw.view.colors, raw.core.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik,
  );
}

/** 统计一只骨架里的 mesh 数（造型复杂度 / 盒子预算的直接指标）。 */
function meshCount(rig: VoxelRig): number {
  let n = 0;
  rig.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) n += 1; });
  return n;
}

function step(rig: VoxelRig, w: ReturnType<typeof makeWorld>, n = 1, dt = 1 / 60): void {
  for (let i = 0; i < n; i++) rig.update(w.character, w.combat, w.playerHurt, dt, false);
}

describe('v9s.52 造型特征：默认不改变骨架', () => {
  it('不传 style 时没有胡子 / 发片节点，头部仍只有「头 + 两只眼」', () => {
    const rig = makeRig();
    expect(rig.group.getObjectByName('beard0')).toBeUndefined();
    const headPivot = rig.group.getObjectByName('headPivot')!;
    expect(headPivot.children.length).toBe(3);
  });

  it('elder 造型只多出 3 节胡子 + 1 顶发 + 2 道眉 + 1 个脖子 + 2 块肩甲', () => {
    const rig = makeRig(elderVoxel);
    expect(rig.group.getObjectByName('beard0')).toBeTruthy();
    expect(rig.group.getObjectByName('beard1')).toBeTruthy();
    expect(rig.group.getObjectByName('beard2')).toBeTruthy();
    const extra = meshCount(rig) - meshCount(makeRig());
    expect(extra).toBe(9);
  });
});

describe('v9s.52 造型特征：体态', () => {
  it('驼背：静止时躯干总前倾 ≈ hunch（拆成腰 / 胸两段后总和不变）', () => {
    const rig = makeRig(elderVoxel);
    const w = makeWorld();
    step(rig, w, 30);
    // v9s.72：躯干总俯仰 = 整条脊柱链之和（3 段时不能只加两块）
    const total = torsoPitchOf(rig);
    expect(total).toBeGreaterThan(elderVoxel.style!.hunch! * 0.8);
    expect(total).toBeLessThan(elderVoxel.style!.hunch! * 1.4);
    // 驼背必须由多段分担，而不是整根斜：最上面一段也确实在转
    const chain = spineChain(rig);
    expect(chain[chain.length - 1].rotation.x as number).toBeGreaterThan(0.02);
  });

  it('屈膝：骨盆比髋高基准低 kneeSink（IK 把脚钉回地面 → 膝盖自然前屈）', () => {
    const rig = makeRig(elderVoxel);
    const w = makeWorld();
    step(rig, w, 20);
    const pelvis = rig.group.getObjectByName('pelvis')!;
    const expectY = elderVoxel.legLength - elderVoxel.style!.kneeSink!;
    expect(pelvis.position.y).toBeLessThan(expectY + 0.01);
    expect(pelvis.position.y).toBeGreaterThan(expectY - 0.02);
  });

  it('小头：头盒边长 = headSize × headScale', () => {
    const rig = makeRig(elderVoxel);
    const headPivot = rig.group.getObjectByName('headPivot')!;
    const head = headPivot.children.find(
      (o) => (o as THREE.Mesh).isMesh && Math.abs(o.position.y - elderVoxel.headSize * elderVoxel.style!.headScale! / 2) < 1e-6,
    ) as THREE.Mesh | undefined;
    expect(head).toBeTruthy();
    const size = new THREE.Box3().setFromObject(head!).getSize(new THREE.Vector3());
    expect(size.x).toBeCloseTo(elderVoxel.headSize * elderVoxel.style!.headScale!, 5);
  });
});

describe('v9s.52 胡子物理：二阶弹簧', () => {
  it('加速时向后甩，站住后回正', () => {
    const rig = makeRig(elderVoxel);
    const w = makeWorld();
    const p0 = rig.group.getObjectByName('beard0')!;
    step(rig, w, 10);
    expect(Math.abs(p0.rotation.x as number)).toBeLessThan(1e-6);   // 静止无摆动

    // 模拟「起步」：0.15s 内从 0 匀加速到 3.6 m/s（≈24 m/s²，接近真实起步）
    for (let i = 1; i <= 9; i++) {
      // 角色朝 +Z，前进就是 velocity.z（v9s.54 起胡子按局部前后 / 左右分解，
      // 写 x 会被正确识别成「侧移」而不再驱动 pitch 通道）
      w.character.velocity.z = 3.6 * (i / 9);
      step(rig, w, 1);
    }
    const kicked = p0.rotation.x as number;
    expect(Math.abs(kicked)).toBeGreaterThan(0.03);                 // 甩起来了

    // 速度保持恒定 → 驱动归零 → 弹簧回正
    step(rig, w, 90);
    expect(Math.abs(p0.rotation.x as number)).toBeLessThan(Math.abs(kicked) * 0.2);
  });

  it('三节是链式跟随：末端滞后于根节', () => {
    const rig = makeRig(elderVoxel);
    const w = makeWorld();
    step(rig, w, 10);
    w.character.velocity.z = 3.6;
    step(rig, w, 3);
    const a0 = Math.abs(rig.group.getObjectByName('beard0')!.rotation.x as number);
    const a2 = Math.abs(rig.group.getObjectByName('beard2')!.rotation.x as number);
    expect(a2).toBeGreaterThan(0);      // 末端确实动了
    expect(a2).toBeLessThanOrEqual(a0 + 1e-9);  // 但不会超过根节（follow < 1）
  });
});
