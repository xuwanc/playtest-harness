import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { AppConfig, CharacterPosture, CharacterStyle } from '../src/core';
import { makeWorld } from './helpers';

/**
 * v9s.64 · 基础体态层（posture）+ 哨兵机造型。
 *
 * 体态没法用断言「看」出来，所以这里测三件**必须成立**的事：
 *   1) 鱼人的爬姿真的把头压到髋以下、伸出去了，但**脚还在地上、头还没啃地**；
 *   2) 前倾有总预算 —— 往上加 pitch 不会无限变深（否则挥砍一叠就扑倒）；
 *   3) 抬胯只能靠**抬骨盆**这件事本身是假的：默认站姿腿已用满，再抬脚就离地。
 * 哨兵机这条线测的是「换几何不换骨架」是否依然成立（骨骼名 = 断肢映射的契约）。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const NONE = {
  lastAt: -1e9, type: 'none' as const, timer: 0, duration: 0,
  dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

function rigWith(posture: CharacterPosture | undefined, style: CharacterStyle = {}) {
  const w = makeWorld();
  const voxel = {
    ...raw.view.voxel,
    style: { ...raw.view.voxel.style, ...style, ...(posture ? { posture } : {}) },
  };
  const rig = createVoxelRig(
    voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik,
  );
  for (let i = 0; i < 40; i++) {
    rig.update(w.character, w.combat, NONE as never, w.config.fixedDt);
  }
  return { w, rig, d: rig.postureDebug()! };
}

describe('v9s.64 体态层', () => {
  it('鱼人：躯干压到接近水平、头前伸到髋前，脚仍踩地、头不啃地', () => {
    const w = makeWorld();
    const bt = raw.view.bodyTypes!['murloc']!;
    const rig = createVoxelRig(
      bt.voxel!, { ...raw.view.colors, ...bt.colors! }, w.config.moveSpeed,
      raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation, raw.view.ik,
    );
    for (let i = 0; i < 40; i++) rig.update(w.character, w.combat, NONE as never, w.config.fixedDt);
    const d = rig.postureDebug()!;

    expect(d.enabled).toBe(true);
    // 体态真的吃进去了（不是被预算夹成 0）
    expect(d.pitch).toBeGreaterThan(0.5);
    expect(d.pitch + d.waist).toBeLessThanOrEqual(1.05 + 1e-6);
    // 头前伸：枢轴被推到身体前方 12cm 以上
    expect(d.headZ).toBeGreaterThan(0.12);
    // 头没有啃地（头部子树最低点还有 20cm 余量）
    expect(d.headLowY).toBeGreaterThan(0.2);
    // 脚几乎没离地也没陷地（±2cm 之内）
    expect(Math.abs(d.footY)).toBeLessThan(0.02);
  });

  it('前倾总预算：pitch 从 0.72 加到 2.0，实际吃进去的角度不变', () => {
    const a = rigWith({ pitch: 0.72 }, { murloc: true }).d;
    const b = rigWith({ pitch: 2.0 }, { murloc: true }).d;
    expect(b.pitch).toBeLessThanOrEqual(1.05 + 1e-6);
    // 加得再多也只会吃满预算，不会「越加越深」
    expect(b.pitch).toBeGreaterThanOrEqual(a.pitch - 1e-6);
  });

  it('抬胯的边界：单抬 5cm，脚就被拉离地面（腿已用满，没有行程）', () => {
    const flat = rigWith({ pitch: 0 });
    const lifted = rigWith({ pitch: 0, pelvisLift: 0.05 });
    expect(Math.abs(flat.d.footY)).toBeLessThan(0.01);
    expect(lifted.d.hipY - flat.d.hipY).toBeCloseTo(0.05, 5);
    expect(lifted.d.footY).toBeGreaterThan(0.01);
  });
});

describe('v9s.64 哨兵机', () => {
  it('体型自洽，且开的是 sentinel 造型（不是鱼人）', () => {
    const bt = raw.view.bodyTypes!['sentinel']!;
    const v = bt.voxel!;
    expect(v.legLength + v.bodyHeight + v.headSize).toBeCloseTo(bt.height, 6);
    expect(v.style?.sentinel).toBe(true);
    expect(v.style?.murloc).toBeUndefined();
  });

  it('骨骼名与人类一致（断肢 / 插箭全靠名字查找），头部零件明显更多', () => {
    const { rig } = rigWith({ pitch: 0.14 }, { sentinel: true });
    const g = rig.group;
    for (const name of ['pelvis', 'lower', 'upper', 'chest', 'headPivot', 'hipL', 'hipR']) {
      expect(g.getObjectByName(name), name).toBeDefined();
    }
    const arm = g.getObjectByName('shoulderR') ?? g.getObjectByName('shoulderL');
    expect(arm).toBeDefined();
    const head = g.getObjectByName('headPivot')!;
    const meshes = head.children.filter((c) => (c as { isMesh?: boolean }).isMesh);
    // 素人头 = 1 块 + 2 只眼；机器头 = 颅 / 面罩 / 灯条 / 眉檐 / 下颌 / 侧栅 / 天线 / 接线盒 …
    expect(meshes.length).toBeGreaterThan(10);
  });

  it('灯眼不参与受击闪光（userData.glow），否则机器被打会「红眼」', () => {
    const { rig } = rigWith({ pitch: 0.14 }, { sentinel: true });
    const head = rig.group.getObjectByName('headPivot')!;
    const glow = head.children.filter((c) => {
      const m = (c as { material?: { userData?: { glow?: boolean } } }).material;
      return m?.userData?.glow === true;
    });
    expect(glow.length).toBe(1);
  });
});
