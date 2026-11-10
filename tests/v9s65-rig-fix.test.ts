import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { buildMurlocTail, MURLOC_HEAD_SPIN, MURLOC_POSTURE } from '../src/presentation/murloc-parts';
import {
  buildSentinelFoot, buildSentinelHand, buildSentinelHead,
} from '../src/presentation/sentinel-parts';
import { applyFootIK, captureIKBase } from '../src/presentation/rig-ik';
import type { IKLimb } from '../src/presentation/rig-ik';
import type { ColorConfig } from '../src/core';

/**
 * v9s.65 造型修正的验收：都是「用户看到画面后报回来的问题」，所以每条都写清楚
 * *看到的* 现象与 *代码里* 的错因 —— 下次改回旧值会直接挂在这里。
 */

const COLORS: ColorConfig = {
  body: '#4f9c78', head: '#5fb692', limb: '#3d7f61', shoe: '#2b5d49',
} as ColorConfig;

const box = (o: THREE.Object3D) => {
  o.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(o);
};

describe('v9s.65 鱼人', () => {
  it('尾巴两段有重叠，不能「中间少一节」', () => {
    const parent = new THREE.Group();
    const HS = 0.46;
    const torsoD = 0.28;
    buildMurlocTail(parent, HS, torsoD);

    const [base, fin] = parent.children as THREE.Mesh[];
    const b = box(base);
    const f = box(fin);
    // -Z 是屁股方向。尾鳍的**前缘**（max.z，更靠近身体）必须伸进基座内部才不露缝。
    const overlap = f.max.z - b.min.z;
    expect(overlap, `基座后缘 ${b.min.z.toFixed(3)} / 尾鳍前缘 ${f.max.z.toFixed(3)}`)
      .toBeGreaterThan(0.02);
  });

  it('旋转中心在颅骨中心：headSize 的一半左右，不是 0', () => {
    // 0.46 是「颅骨中心」在 `buildMurlocHead` 局部坐标里的高度（见该模块头部零件表）
    expect(MURLOC_HEAD_SPIN).toBeGreaterThan(0.35);
    expect(MURLOC_HEAD_SPIN).toBeLessThan(0.55);
  });

  it('屈膝 + 后坐 + 手臂回正都在体态里（改回 0 会让脚离地 / 手垂到脚边）', () => {
    expect(MURLOC_POSTURE.pelvisDrop).toBeGreaterThan(0.03);
    expect(MURLOC_POSTURE.pelvisBack).toBeGreaterThan(0.04);
    expect(MURLOC_POSTURE.armDrop).toBeGreaterThan(0.3);
    // 给到 1 会把上臂转进胸腔
    expect(MURLOC_POSTURE.armDrop).toBeLessThan(0.9);
  });
});

describe('v9s.65 哨兵机', () => {
  it('脚掌挂在踝高（米），不被 headSize 缩放', () => {
    const parent = new THREE.Group();
    const ankleY = -0.31;
    buildSentinelFoot(parent, 0.40, COLORS, ankleY);
    const sole = parent.children[0] as THREE.Mesh;
    // 曾经这里被乘了 HS（0.40）：-0.31 → -0.124，脚掌正好落在小腿中段
    expect(sole.position.y).toBeCloseTo(ankleY + 0.005, 5);
  });

  it('夹钳左右张开（X 轴），不是前后（Z 轴）', () => {
    const parent = new THREE.Group();
    buildSentinelHand(parent, 0.22, COLORS, 1);
    const jaws = parent.children.slice(1) as THREE.Mesh[];
    expect(jaws.length).toBe(2);
    for (const j of jaws) {
      expect(Math.abs(j.position.z)).toBeLessThan(1e-6);   // 不再沿 Z 排布
      expect(Math.abs(j.position.x)).toBeGreaterThan(0.01); // 沿 X 分到两侧
      expect(Math.abs(j.rotation.z)).toBeGreaterThan(0.1);  // 绕 Z 张开
    }
  });

  it('天线够粗（缩到游戏尺寸仍看得见）', () => {
    const parent = new THREE.Group();
    buildSentinelHead(parent, 0.40, COLORS);
    // 天线是「又细又高」的那件：宽 ≈ 0.055 × 0.40 = 0.022m，高 ≈ 0.46 × 0.40 = 0.184m。
    // 旧版 0.032 → 0.013m，缩到游戏尺寸只剩 1px。
    const tall = parent.children
      .map((c) => box(c))
      .filter((b) => b.max.y - b.min.y > 0.1)
      .map((b) => Math.min(b.max.x - b.min.x, b.max.z - b.min.z));
    expect(tall.length).toBeGreaterThan(0);
    expect(Math.max(...tall)).toBeGreaterThan(0.018);
  });
});

describe('v9s.65 足 IK 地板兜底', () => {
  type Rig = { root: THREE.Group; pelvis: THREE.Group; lower: THREE.Group; limbs: IKLimb[] };

  /** 髋高 1.2、两段腿各 0.5 的最小骨架：脚在 y=0.2（伸直时够不到地面）。 */
  function makeRig(): Rig {
    const root = new THREE.Group();
    const pelvis = new THREE.Group();
    pelvis.position.y = 1.2;
    root.add(pelvis);
    const lower = new THREE.Group();
    pelvis.add(lower);
    const limbs: IKLimb[] = [];
    for (const sx of [-1, 1]) {
      const root2 = new THREE.Group();
      root2.rotation.order = 'ZYX';
      root2.position.set(sx * 0.1, 0, 0);
      lower.add(root2);
      const joint = new THREE.Group();
      joint.position.y = -0.5;
      root2.add(joint);
      const tip = new THREE.Object3D();
      tip.position.y = -0.5;
      joint.add(tip);
      limbs.push({ root: root2, joint, tip, upperLen: 0.5, lowerLen: 0.5, bend: 1 });
    }
    return { root, pelvis, lower, limbs };
  }

  const CFG = { enabled: true, weight: 1, attackScale: 1, maxCorrectionDeg: 80 } as never;

  it('锚点高于地面时不动（正常帧语义不变）', () => {
    const r = makeRig();
    const base = captureIKBase(r.pelvis, r.lower);
    const d = applyFootIK({
      root: r.root, pelvis: r.pelvis, lower: r.lower, limbs: r.limbs, base,
      cfg: CFG, grounded: true, attacking: false, groundY: 0,
    });
    expect(d.active).toBe(true);
    // 脚在 y=0.2，地面在 0 —— 没有钳制发生，残差应当很小
    expect(d.maxError).toBeLessThan(1e-3);
    for (const l of r.limbs) {
      expect(l.tip.getWorldPosition(new THREE.Vector3()).y).toBeCloseTo(0.2, 2);
    }
  });

  it('锚点低于地面时被顶到地面（脚不再穿地）', () => {
    const r = makeRig();
    const base = captureIKBase(r.pelvis, r.lower);
    // 骨盆被程序动画压低 0.4 → FK 的脚落到 y=-0.2，地面在 0
    r.pelvis.position.y = 0.8;
    const d = applyFootIK({
      root: r.root, pelvis: r.pelvis, lower: r.lower, limbs: r.limbs, base,
      cfg: CFG, grounded: true, attacking: false, groundY: 0,
    });
    expect(d.clamped).toBe(0);          // 不是「够不着」，是「够得着但不该往下钉」
    for (const l of r.limbs) {
      const y = l.tip.getWorldPosition(new THREE.Vector3()).y;
      expect(y, '脚被钉在地面以下').toBeGreaterThan(-0.02);
    }
  });
});
