import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, HurtState, IKViewConfig } from '../src/core';

/**
 * v8g #1 验收：「测试假人是否加上了 IK」—— 之前没有，现在玩家 / 假人同构接入。
 *
 * 锚点定义：把骨盆 / 下盘临时恢复到步态基准（静止 idle 时就是髋部基准），
 * 保持本帧最终 FK 关节角，此时脚的位置就是 IK 该钉住的落点。
 * 因为 IK 求解前的 FK 角度 == 关闭 IK 时的角度，用「IK 关闭的 rig」算出的锚点
 * 正是「IK 开启的 rig」内部采用的锚点，两者可直接比较。
 */
const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

// 直接以线上配置为基准，避免测试里的硬编码与 game.json 漂移
const IK_ON: IKViewConfig = { ...raw.view.ik, enabled: true, weight: 1 };
const IK_OFF: IKViewConfig = { ...IK_ON, enabled: false };

// 最小 DOM stub：createDummyRig 用 CanvasTexture 画标签，getContext 为 null 时直接跳过
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

function hit(over: Partial<HurtState> = {}): HurtState {
  return {
    type: 'knock', timer: 0.21, duration: 0.42,
    dirX: 0, dirZ: -1, knockX: 0, knockZ: 0,
    ...over,
  };
}
const NONE: HurtState = {
  type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

function footTip(rig: { group: any }, side: 'L' | 'R'): THREE.Object3D {
  const hip = rig.group.getObjectByName(side === 'L' ? 'hipL' : 'hipR');
  const tip = hip.getObjectByName('footTip');
  if (!tip) throw new Error('骨架缺少 footTip 末端锚点（IK 未接线）');
  return tip;
}

function footWorld(rig: { group: any }, side: 'L' | 'R' = 'L'): THREE.Vector3 {
  rig.group.updateMatrixWorld(true);
  return footTip(rig, side).getWorldPosition(new THREE.Vector3());
}

/** 把骨盆 / 下盘恢复到「步态基准」，用当前 FK 角度算脚锚点；随后原样恢复。 */
function anchorFromFK(rig: { group: any }, legLen: number): THREE.Vector3 {
  const pelvis = rig.group.getObjectByName('pelvis');
  const lower = rig.group.getObjectByName('lower');
  const tip = footTip(rig, 'L');
  const save = {
    pp: pelvis.position.clone(), pr: pelvis.rotation.clone(),
    lp: lower.position.clone(), lr: lower.rotation.clone(),
  };
  pelvis.position.set(0, legLen, 0);
  pelvis.rotation.set(0, 0, 0);
  lower.position.set(0, 0, 0);
  lower.rotation.z = 0;
  rig.group.updateMatrixWorld(true);
  const anchor = tip.getWorldPosition(new THREE.Vector3());
  pelvis.position.copy(save.pp);
  pelvis.rotation.copy(save.pr);
  lower.position.copy(save.lp);
  lower.rotation.copy(save.lr);
  rig.group.updateMatrixWorld(true);
  return anchor;
}

function playerRig(ik?: IKViewConfig): VoxelRig {
  const w = makeWorld();
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, ik,
  );
}

function dummyRig(w: ReturnType<typeof makeWorld>, ik?: IKViewConfig) {
  const s = w.dummies[0];
  return createDummyRig(
    raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
    w.config.dummies.moveSpeed, raw.view.gait, raw.view.hurt, raw.view.lean, ik,
  );
}

describe('v8g #1 假人/主角都接上了两骨 IK 足部锚定', () => {
  it('骨架有 footTip 末端节点，且腿根 rotation.order=ZYX（两骨共面才有解析 IK）', () => {
    const w = makeWorld();
    const rig = dummyRig(w, IK_ON);
    const n = rigNodes(rig);
    expect(n.hipL.rotation.order).toBe('ZYX');
    expect(n.hipR.rotation.order).toBe('ZYX');
    expect(footTip(rig, 'L')).toBeDefined();
    expect(footTip(rig, 'R')).toBeDefined();
    const player = playerRig(IK_ON);
    expect(rigNodes(player).hipL.rotation.order).toBe('ZYX');
    expect(footTip(player, 'R')).toBeDefined();
    rig.dispose();
  });

  it('假人受击后坐/下沉：IK 开启时脚钉在锚点，关闭时脚明显被骨盆拖走', () => {
    const w = makeWorld();
    const on = dummyRig(w, IK_ON);
    const off = dummyRig(w, IK_OFF);
    const s = w.dummies[0];
    s.bodyYaw = 0;
    s.hurt = hit({ type: 'heavy' }); // heavy → abdomen 下沉 / 后坐明显
    // 同一份 Core 状态分别驱动两个 rig（互不写 Core）
    on.update(s, w.config.fixedDt);
    off.update(s, w.config.fixedDt);

    const anchor = anchorFromFK(off, raw.view.voxel.legLength);
    const errOn = footWorld(on).distanceTo(anchor);
    const errOff = footWorld(off).distanceTo(anchor);
    expect(on.ik().active).toBe(true);
    expect(off.ik().active).toBe(false);
    expect(errOff).toBeGreaterThan(0.02);          // 旧 FK：脚被后坐 / 下沉拖走
    expect(errOn).toBeLessThan(errOff * 0.35);     // IK：绝大部分偏差被吸收进髋 / 膝
    expect(on.ik().maxError).toBeLessThan(0.02);  // 诊断读数与实测一致
    // IK 真的改写了关节角，而不是只改诊断读数
    expect(Math.abs(rigNodes(on).kneeL.rotation.x - rigNodes(off).kneeL.rotation.x))
      .toBeGreaterThan(0.02);
    on.dispose();
    off.dispose();
  });

  it('主角受击：同样由 IK 把脚钉住', () => {
    const w = makeWorld();
    const on = playerRig(IK_ON);
    const off = playerRig(IK_OFF);
    w.character.grounded = true;
    w.character.bodyYaw = 0;
    const h = hit({ type: 'heavy' });
    on.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
    off.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
    const anchor = anchorFromFK(off, raw.view.voxel.legLength);
    expect(footWorld(on).distanceTo(anchor))
      .toBeLessThan(footWorld(off).distanceTo(anchor) * 0.35);
    expect(on.ik().clamped).toBe(0); // 正常受击幅度不会超出臂展
  });

  it('IK 总开关关闭 = 精确回到旧 FK 姿态（A/B 干净）', () => {
    const w = makeWorld();
    const implicitOff = playerRig();                 // 不传配置 → 默认关闭
    const explicitOff = playerRig(IK_OFF);
    const h = hit();
    implicitOff.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
    explicitOff.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
    for (const key of ['hipL', 'hipR', 'kneeL', 'kneeR'] as const) {
      const a = rigNodes(implicitOff)[key].rotation;
      const b = rigNodes(explicitOff)[key].rotation;
      expect(a.x).toBeCloseTo(b.x, 12);
      expect(a.z).toBeCloseTo(b.z, 12);
    }
    expect(implicitOff.ik().active).toBe(false);
  });

  it('空中（grounded=false）不钉脚，让腿随身体收起', () => {
    const w = makeWorld();
    const rig = playerRig(IK_ON);
    w.character.grounded = false;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    expect(rig.ik().active).toBe(false);
    w.character.grounded = true;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    expect(rig.ik().active).toBe(true);
  });

  it('移动时 IK 不冻结步态：髋角随相位持续变化，钉地残差始终很小', () => {
    const w = makeWorld();
    const rig = playerRig(IK_ON);
    const go = intent({ moveX: 0, moveZ: 1 });
    run(w, 40, go);
    let changed = 0;
    let prev: number | null = null;
    let maxErr = 0;
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 90; i++) {
      run(w, 1, go);
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const x = rigNodes(rig).hipL.rotation.x as number;
      if (prev !== null && Math.abs(x - prev) > 1e-4) changed += 1;
      prev = x;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      maxErr = Math.max(maxErr, rig.ik().maxError);
    }
    // 髋角仍有完整一个步态周期的摆幅，不是被 IK 钉成定值
    expect(maxX - minX).toBeGreaterThan(0.05);
    expect(changed).toBeGreaterThan(30);
    expect(maxErr).toBeLessThan(0.02);
  });

  it('IK 不明显压扁步态幅度：开 / 关的髋角摆幅同量级', () => {
    const sample = (ik: IKViewConfig): number => {
      const w = makeWorld();
      const rig = playerRig(ik);
      const go = intent({ moveX: 0, moveZ: 1 });
      run(w, 40, go);
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < 90; i++) {
        run(w, 1, go);
        rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
        const x = rigNodes(rig).hipL.rotation.x as number;
        lo = Math.min(lo, x);
        hi = Math.max(hi, x);
      }
      return hi - lo;
    };
    const off = sample(IK_OFF);
    const on = sample(IK_ON);
    expect(off).toBeGreaterThan(0.05);
    expect(on).toBeGreaterThan(off * 0.6);
  });

  it('IK 全程不回写 Core：character / dummies 逐字节一致（长期无伤害契约）', () => {
    const w = makeWorld();
    const before = JSON.parse(JSON.stringify(w.character));
    const dummyBefore = JSON.parse(JSON.stringify(w.dummies[0]));
    const rig = playerRig(IK_ON);
    const d = dummyRig(w, IK_ON);
    rig.update(w.character, w.combat, hit(), w.config.fixedDt, false, w.time);
    d.update(w.dummies[0], w.config.fixedDt);
    expect(w.character).toEqual(before);
    expect(w.dummies[0]).toEqual(dummyBefore);
    d.dispose();
  });
});
