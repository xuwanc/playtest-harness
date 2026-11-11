import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import {
  AXIS_X, AXIS_Y, AXIS_Z, lockModelRotation, pitchInModelSpace, quatInModel, quatParentInModel,
  rotateInModelSpace,
} from '../src/presentation/rig-space';
import { applyFootIK, captureIKBase } from '../src/presentation/rig-ik';
import type { IKLimb } from '../src/presentation/rig-ik';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { spineChain } from './rig-nodes';
import { spineYawCurve } from '../src/presentation/spine-chain';
import { makeWorld, intent, run } from './helpers';
import type { AppConfig, IKViewConfig } from '../src/core';

/**
 * v9s.66 验收：三件事，都是「用户看完画面说的同一个意思 —— 补偿写在了错的坐标系里」。
 *
 *  1. 模型空间旋转：局部 X 不等于角色左右（父节点偏航之后）。
 *  2. 脚锁：IK 反解髋 / 膝会把脚掌拧掉，脚掌朝向必须保持 IK 之前。
 *  3. 偏航分账：胸随下盘带转的那一份要真的落在胸段，不能被 42/58 摊掉。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const IK_ON: IKViewConfig = { ...raw.view.ik, enabled: true, weight: 1 };

function playerRig(ik: IKViewConfig = IK_ON) {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, ik,
  );
  return { rig, w };
}

/** 四元数相等 = 夹角为 0（q 与 -q 是同一个旋转，不能逐分量比） */
const qClose = (a: THREE.Quaternion, b: THREE.Quaternion): void => {
  expect(a.angleTo(b)).toBeLessThan(1e-7);
};

describe('v9s.66 模型空间旋转', () => {
  it('父节点没转时，与局部欧拉角完全等价（既有调校不变的前提）', () => {
    const root = new THREE.Group();
    const parent = new THREE.Group();
    root.add(parent);
    const a = new THREE.Group();
    const b = new THREE.Group();
    parent.add(a, b);

    pitchInModelSpace(a, root, -0.3);
    b.rotation.x -= 0.3;
    expect(a.rotation.x).toBeCloseTo(b.rotation.x, 10);
    expect(a.rotation.z).toBeCloseTo(0, 10);
  });

  it('父节点偏航 40° 之后，绕的仍是角色左右轴 —— 局部写法会歪到侧面', () => {
    const root = new THREE.Group();
    const parent = new THREE.Group();
    parent.rotation.y = (40 * Math.PI) / 180;
    root.add(parent);
    const model = new THREE.Group();
    const local = new THREE.Group();
    parent.add(model, local);

    pitchInModelSpace(model, root, -0.5);
    local.rotation.x -= 0.5;   // 旧写法

    // 模型空间：q' = R · q_旧（左乘），父级那 40° 偏航原样保留。
    // 注意顺序 —— q_旧 = 父级朝向，R 左乘进来后轴仍在模型空间。
    const expectQ = new THREE.Quaternion().setFromAxisAngle(AXIS_X, -0.5)
      .multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_Y, (40 * Math.PI) / 180));
    qClose(quatInModel(model, root), expectQ);
    // 旧写法在模型空间里变成「绕一根被偏航 40° 的轴」—— 直观读数是头朝侧面歪
    expect(quatInModel(local, root).angleTo(expectQ)).toBeGreaterThan(0.2);
  });

  it('偏航轴也一样：绕模型 Y 转，不随父节点侧倾', () => {
    const root = new THREE.Group();
    const parent = new THREE.Group();
    // 父级带着 25° 侧倾（骨盆 roll），局部 Y 已经不再竖直
    parent.rotation.z = 0.436;
    root.add(parent);
    const node = new THREE.Group();
    parent.add(node);

    rotateInModelSpace(node, root, AXIS_Y, 0.4);
    // 父级的侧倾仍在，模型空间的偏航左乘在上面 —— 关键是「轴仍是竖直的」
    const expectQ = new THREE.Quaternion().setFromAxisAngle(AXIS_Y, 0.4)
      .multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_Z, 0.436));
    qClose(quatInModel(node, root), expectQ);
  });

  it('lockModelRotation 按权重混入，权重 1 精确落在目标朝向', () => {
    const root = new THREE.Group();
    const parent = new THREE.Group();
    parent.rotation.x = 0.7;
    root.add(parent);
    const node = new THREE.Group();
    parent.add(node);

    const target = new THREE.Quaternion().setFromAxisAngle(AXIS_Y, 0.25);
    lockModelRotation(node, root, target, 1);
    qClose(quatInModel(node, root), target);
    // 父级朝向的读数不该被脚锁影响
    qClose(quatParentInModel(node, root), new THREE.Quaternion().setFromAxisAngle(AXIS_X, 0.7));
  });
});

describe('v9s.66 脚锁：IK 只改腿，不拧脚', () => {
  type Chain = {
    root: THREE.Group; pelvis: THREE.Group; lower: THREE.Group;
    limb: IKLimb; tip: THREE.Object3D; ankle: THREE.Group;
  };
  const makeChain = (withAnkle: boolean): Chain => {
    const root = new THREE.Group();
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.4;
    root.add(pelvis);
    const lower = new THREE.Group();
    pelvis.add(lower);
    const hip = new THREE.Group();
    hip.rotation.order = 'ZYX';
    hip.position.set(-0.05, 0, 0);
    lower.add(hip);
    const knee = new THREE.Group();
    knee.position.y = -0.2;
    hip.add(knee);
    const ankle = new THREE.Group();
    ankle.position.y = -0.2;
    knee.add(ankle);
    const tip = new THREE.Object3D();
    ankle.add(tip);
    // 脚掌：一块朝前伸的板，最容易看出「被拧」
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.26));
    sole.position.z = 0.09;
    ankle.add(sole);
    root.updateMatrixWorld(true);
    return {
      root, pelvis, lower, ankle, tip,
      limb: {
        root: hip, joint: knee, tip,
        ...(withAnkle ? { ankle } : {}),
        upperLen: 0.2, lowerLen: 0.2, bend: 1,
      },
    };
  };

  const run = (withAnkle: boolean) => {
    const c = makeChain(withAnkle);
    const base = captureIKBase(c.pelvis, c.lower);
    const before = quatInModel(c.ankle, c.root);
    // 骨盆下沉 6cm：锚点仍取基准位，IK 会把腿反解成屈膝
    c.pelvis.position.y = base.pelvisPos.y - 0.06;
    const diag = applyFootIK({
      root: c.root, pelvis: c.pelvis, lower: c.lower,
      limbs: [c.limb], base, cfg: IK_ON, grounded: true, attacking: false,
    });
    return { c, before, diag, after: quatInModel(c.ankle, c.root) };
  };

  it('接上踝节点：髋 / 膝被反解，脚掌的模型空间朝向不变', () => {
    const { c, before, diag, after } = run(true);
    expect(diag.active).toBe(true);
    expect(Math.abs(c.limb.joint.rotation.x)).toBeGreaterThan(0.05);  // 腿真的动了
    expect(diag.maxError).toBeLessThan(1e-6);
    qClose(after, before);            // 脚掌没被拧
  });

  it('没有踝节点（老骨架）时脚掌会跟着小腿转 —— 脚锁确实在做事', () => {
    const { before, after } = run(false);
    expect(after.angleTo(before)).toBeGreaterThan(0.05);
  });
});

describe('v9s.66 偏航分账：胸真的会跟着下盘转', () => {
  it('偏航沿链单调过渡：髋 → 腰 → 胸，腰段锚在髋上', () => {
    const { rig, w } = playerRig();
    const go = intent({ moveX: 1, moveZ: 0.2 });   // 侧移最容易把 hipYaw 拉起来
    run(w, 60, go);
    const b = raw.view.animation.spine!.chainBlend ?? 0.58;
    let maxChest = 0;
    let maxHip = 0;
    for (let i = 0; i < 30; i++) {
      run(w, 1, go);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = rig.gaitDebug();
      const chain = spineChain(rig);
      const lower = rig.group.getObjectByName('lower')!;
      const total = chain.reduce((a, n) => a + n.rotation.y, 0);
      const hipYaw = lower.rotation.y;
      // 每一级的累计角 = 髋 +（总角 − 髋）× 曲线（v9s.72：段数可配，曲线末项 = 1）
      const curve = spineYawCurve(chain.length, b);
      let prev = 0;
      for (let k = 0; k < chain.length; k++) {
        const cum = prev + chain[k].rotation.y;
        expect(cum).toBeCloseTo(hipYaw + (total - hipYaw) * curve[k], 6);
        // 单调：每一级的世界角都夹在「髋」与「胸」之间（v9s.66 那版会跑出区间）
        const lo = Math.min(hipYaw, total) - 1e-9;
        const hi = Math.max(hipYaw, total) + 1e-9;
        expect(cum).toBeGreaterThanOrEqual(lo);
        expect(cum).toBeLessThanOrEqual(hi);
        prev = cum;
      }
      expect(prev).toBeCloseTo(total, 6);
      maxChest = Math.max(maxChest, Math.abs(chain[chain.length - 1].rotation.y));
      maxHip = Math.max(maxHip, Math.abs(hipYaw));
    }
    expect(maxHip).toBeGreaterThan(0.02);      // 下盘真的转了，否则这条测试是空转
    expect(maxChest).toBeGreaterThan(0.02);    // 不只是 0.1 度级别的抖动
    rig.dispose();
  });

  it('头部仍朝 Core 的 headYaw：胸段多转不吃掉视线', () => {
    const { rig, w } = playerRig();
    const go = intent({ moveX: 1, moveZ: 0.2, aimActive: true, aimX: 1, aimZ: 0 });
    run(w, 60, go);
    for (let i = 0; i < 20; i++) {
      run(w, 1, go);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const chain = spineChain(rig);
      const head = rig.group.getObjectByName('headPivot')!;
      const torso = chain.reduce((a, n) => a + n.rotation.y, 0);
      const world = w.character.bodyYaw + torso + head.rotation.y;
      let d = world - w.character.headYaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      expect(Math.abs(d)).toBeLessThan(1e-6);
    }
    rig.dispose();
  });
});

describe('v9s.66 脚踝节点', () => {
  it('脚掌挂在 knee 之下的踝节点上，footTip 与踝点重合', () => {
    const { rig } = playerRig();
    for (const side of ['L', 'R'] as const) {
      const hip = rig.group.getObjectByName(`hip${side}`)!;
      const knee = hip.getObjectByName(`knee${side}`)!;
      const ankle = hip.getObjectByName(`ankle${side}`);
      expect(ankle, `缺少踝节点 ankle${side}`).toBeTruthy();
      expect(ankle!.parent).toBe(knee);
      const tip = hip.getObjectByName(`footTip${side}`)!;
      expect(tip.parent).toBe(ankle);
      expect(tip.position.length()).toBeCloseTo(0, 9);
    }
    rig.dispose();
  });

  it('squash & stretch 拉长小腿时，踝点跟着走、tip 不再二次偏移', () => {
    const { rig } = playerRig();
    const hip = rig.group.getObjectByName('hipL')!;
    const ankle = hip.getObjectByName('ankleL')!;
    const tip = hip.getObjectByName('footTipL')!;
    // 中性伸展：踝点在 -legLen/2
    expect(ankle.position.y).toBeCloseTo(-raw.view.voxel.legLength / 2, 6);
    expect(tip.position.y).toBe(0);
    rig.dispose();
  });
});
