import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld } from './helpers';

/**
 * v9s.28 · 「修掉 armYaw 假通道 + 让双持两把剑真正展开」。
 *
 * 背景：`shoulder.rotation.order` 一直是 `'ZYX'`（R = Rx·Ry·Rz）。手臂初始竖直向下，
 * 这时 `Ry` 发生在抬臂**之前**，等于绕手臂长轴自转 —— `armYaw` 是个假通道，
 * 实测 −1.4 → 0 只让刃身水平朝向变 25°，做不出「两把剑向两侧展开」。
 *
 * 改成 `'YXZ'`（R = Ry·Rx·Rz）后，yaw = 0 时两者数学等价（都退化成 Rx·Rz），
 * pitch / roll 的既有调校逐帧不变；yaw ≠ 0 时才真正变成肩的水平内收 / 外展。
 *
 * 这里钉住两件事：
 *  1. 双持第三击的两把剑**真的分开**（<120° 就说明又退回自转了）；
 *  2. 连击在 cancelWindow（progress 0.45）那一刻，动作已经走完挥出，
 *     所以「最早可取消」这条最爽的连打路径不会看到剑停在半路。
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

type Blade = { base: { x: number; y: number; z: number }; tip: { x: number; y: number; z: number } };

function playerRig() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false },
    raw.view.links, raw.view.weaponWrist,
  );
  return { w, rig };
}

function angle(b: Blade | null) {
  if (!b) return null;
  const dx = b.tip.x - b.base.x;
  const dy = b.tip.y - b.base.y;
  const dz = b.tip.z - b.base.z;
  const len = Math.hypot(dx, dy, dz) || 1e-6;
  return {
    yaw: (Math.atan2(dx, dz) * 180) / Math.PI,
    pitch: (Math.asin(dy / len) * 180) / Math.PI,
  };
}

/**
 * 把一个指定姿态渲染到稳态。
 *
 * `clipT` 给了就绕过 `swingCurve(progress)` 直接钉剪辑时间轴 —— 这条入口是
 * v9s.28 给 clip-lab 加的，工具和测试必须和真实链路用同一套语义。
 */
function poseAt(weapon: string, comboIndex: number, progress: number, clipT?: number) {
  const { w, rig } = playerRig();
  const cb = w.combat as any;
  cb.weapon = weapon;
  cb.phase = 'active';
  cb.comboIndex = comboIndex;
  cb.attackFacing = w.character.bodyYaw;
  rig.setClipT(clipT === undefined ? null : clipT);
  for (let i = 0; i < 50; i++) {
    cb.attackProgress = progress;
    rig.update(w.character, cb, NONE, 1 / 60, false, 0);
  }
  rig.group.updateMatrixWorld(true);
  const pair = rig.bladesWorld();
  const out = {
    right: angle(pair.right),
    left: angle(pair.left),
    single: angle(rig.weaponBlade()),
    grip: rig.gripDebug(),
    debug: rig.swingDebug(),
  };
  rig.dispose();
  return out;
}

function sepDeg(weapon: string, seg: number, progress: number, clipT: number): number {
  const p = poseAt(weapon, seg, progress, clipT);
  if (!p.right || !p.left) throw new Error('双持应有两把剑');
  let d = p.right.yaw - p.left.yaw;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return Math.abs(d);
}

describe('v9s.28 肩部 yaw 从「自转」变「水平摆」', () => {
  it('双持第三击：两把剑向两侧展开，刃身夹角 ≥120°', () => {
    // 中段是双臂最张开的时刻（armYaw 2.1 / armLYaw 0.3，肘接近伸直）。
    // YXZ 之前同一条数据只能扫出 49°（两把剑叠在一起）。
    expect(sepDeg('dual-swords', 3, 0.5, 0.5)).toBeGreaterThan(120);
  });

  it('双持横扫段：主手挥出时副手仍与主手分开 ≥45°', () => {
    expect(sepDeg('dual-swords', 1, 0.5, 0.5)).toBeGreaterThan(45);
    expect(sepDeg('dual-swords', 2, 0.5, 0.5)).toBeGreaterThan(45);
  });

  it('展开时两把剑都保持接近水平（不是举着剑转圈）', () => {
    const p = poseAt('dual-swords', 3, 0.5, 0.5);
    expect(Math.abs(p.right!.pitch)).toBeLessThan(25);
    expect(Math.abs(p.left!.pitch)).toBeLessThan(25);
  });
});

describe('v9s.28 连击窗口与挥出对齐', () => {
  it('cancelWindow（progress 0.45）时动作已经走到挥出满，不是半路', () => {
    const atCancel = poseAt('greatsword', 1, 0.45);
    const atFull = poseAt('greatsword', 1, 0.5, 1);
    let d = atCancel.single!.yaw - atFull.single!.yaw;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    // 挥出曲线在 0.42 就走满；0.45 时应当已经停在剪辑末段（误差来自腕部滞后）。
    expect(Math.abs(d)).toBeLessThan(12);
  });
});
