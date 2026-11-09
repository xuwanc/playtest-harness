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
  it('每个人形预设的总高 = 腿 + 躯干 + 头（与 Core 的 characterHeight 对齐）', () => {
    const types = raw.view.bodyTypes ?? {};
    expect(Object.keys(types).length).toBeGreaterThan(1);
    let human = 0;
    for (const [id, bt] of Object.entries(types)) {
      // v9s.50：`rig: 'spider'` 是另一套骨架（8 腿 + 两节身体），不存在「三头身」关系，
      // 身高单独断言，见下一条用例。
      if (bt.rig === 'spider') continue;
      human++;
      const v = bt.voxel ?? raw.view.voxel;
      const sum = v.legLength + v.bodyHeight + v.headSize;
      expect(sum, `${id} 总高`).toBeCloseTo(bt.height, 4);
    }
    expect(human, '至少要有一个人形预设').toBeGreaterThan(1);
  });

  it('蜘蛛预设：声明自己的骨架种类，且身高落在「爬行体」量级', () => {
    const spider = raw.view.bodyTypes?.spider;
    expect(spider, '缺少 spider 预设').toBeTruthy();
    expect(spider!.rig).toBe('spider');
    // 不覆盖 voxel：体型写在 spider-rig 里（腿长 / 髋点 / 腹部层数是一个整体）
    expect(spider!.voxel).toBeUndefined();
    // 视觉总高 ≈ 体高 0.32 + 背甲 ~0.19；characterHeight 取 0.5 用于碰撞与眼睛高度
    expect(spider!.height).toBeGreaterThan(0.3);
    expect(spider!.height).toBeLessThan(0.75);
    // 跨距 0.96m → 半径不该比人形更胖
    expect(spider!.radius ?? raw.core.characterRadius).toBeLessThanOrEqual(0.45);
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
