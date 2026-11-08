import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const mk = (voxel: AppConfig['view']['voxel'], colors = raw.view.colors) => createVoxelRig(
  voxel, colors, 4.5, raw.view.orientation, raw.view.gait, raw.view.weaponMount,
  raw.view.lean, raw.view.hurt, raw.view.animation,
  { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
);

describe('v9s.30 体型预设', () => {
  it('每个预设的总高 = 腿 + 躯干 + 头（与 Core 的 characterHeight 对齐）', () => {
    const types = raw.view.bodyTypes ?? {};
    expect(Object.keys(types).length).toBeGreaterThan(1);
    for (const [id, bt] of Object.entries(types)) {
      const v = bt.voxel ?? raw.view.voxel;
      const sum = v.legLength + v.bodyHeight + v.headSize;
      expect(sum, `${id} 总高`).toBeCloseTo(bt.height, 4);
    }
  });

  it('瘦高体型：骨架真的变高变瘦，且脚底仍在地面、头接在躯干上', () => {
    const types = raw.view.bodyTypes ?? {};
    const tall = types.tall;
    expect(tall, '缺少 tall 预设').toBeTruthy();
    const base = raw.view.voxel;
    const v = tall.voxel ?? base;
    expect(v.legLength).toBeGreaterThan(base.legLength);
    expect(v.bodyWidth).toBeLessThan(base.bodyWidth);
    expect(v.headSize).toBeLessThan(base.headSize);

    const rig = mk(v, { ...raw.view.colors, ...tall.colors });
    rig.group.updateMatrixWorld(true);
    // 不用包围盒：待机时剑尖 / 盾牌会伸到地面以下，量的是「武器最低点」而不是身高。
    // 直接查骨架：髋高 + 头枢轴 + 头块 = 三头身总高。
    const pelvis = rig.group.getObjectByName('pelvis');
    const head = rig.group.getObjectByName('headPivot');
    expect(pelvis && head).toBeTruthy();
    const py = pelvis!.getWorldPosition(new THREE.Vector3()).y;
    const hp = head!.getWorldPosition(new THREE.Vector3());
    expect(py).toBeCloseTo(v.legLength, 4);                       // 髋高 = 腿长 → 脚底在 0
    expect(hp.y).toBeCloseTo(v.legLength + v.bodyHeight, 4);      // 头接在躯干顶端
    expect(hp.y + v.headSize).toBeCloseTo(tall.height, 4);        // 头顶 = 预设身高
    rig.dispose();
  });
});
