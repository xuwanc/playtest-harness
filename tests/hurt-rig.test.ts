import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, HurtState, HurtViewConfig, ProgramAnimViewConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

function hurtCfg(over: Partial<HurtViewConfig> = {}): HurtViewConfig {
  const c = JSON.parse(JSON.stringify(raw.view.hurt)) as HurtViewConfig;
  return Object.assign(c, over);
}

function makeRig(hurt: HurtViewConfig = hurtCfg()): VoxelRig {
  const w = makeWorld();
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, hurt,
    raw.view.animation as ProgramAnimViewConfig,
  );
}

/** p = 0.5，落在脉冲回弹段；正面命中 dir=(0,-1)。 */
function hit(over: Partial<HurtState> = {}): HurtState {
  return {
    lastAt: 0, type: 'heavy', timer: 0.16, duration: 0.32,
    dirX: 0, dirZ: -1, knockX: 0, knockZ: 0,
    ...over,
  };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0, // -1e9 = 从未受击
};

/** 用静止、落地的 Core 状态驱动一帧（步态 idle，腿姿态基线为 0，便于隔离受击叠加量）。 */
function pose(h: HurtState, hurt: HurtViewConfig = hurtCfg()): {
  rig: VoxelRig; n: ReturnType<typeof rigNodes>; w: ReturnType<typeof makeWorld>;
} {
  const w = makeWorld();
  const rig = makeRig(hurt);
  w.character.grounded = true;
  w.character.bodyYaw = 0;
  rig.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
  return { rig, n: rigNodes(rig), w };
}

// 最小 DOM stub：createDummyRig 用 CanvasTexture 画头顶标签；getContext 返回 null 时
// drawLabel 直接跳过，纹理构造也不需要真实 canvas 像素（不进 renderer 就不上传）。
const g = globalThis as any;
if (!g.document) {
  g.document = {
    createElement: () => ({ width: 0, height: 0, getContext: () => null }),
  };
}

describe('v8f 骨架层级：共享骨盆 + 上下半身分离', () => {
  it('root 只有 pelvis 一个子节点；pelvis 在髋部；lower / upper 挂在它下面', () => {
    const w = makeWorld();
    const rig = makeRig();
    const n = rigNodes(rig);
    expect(rig.group.children.length).toBe(1);
    expect(rig.group.children[0]).toBe(n.pelvis);
    expect(n.pelvis.position.y).toBeCloseTo(raw.view.voxel.legLength, 12);
    expect(n.lower.parent).toBe(n.pelvis);
    expect(n.upper.parent).toBe(n.pelvis);
    expect(n.hipL.parent).toBe(n.lower);
    expect(n.hipR.parent).toBe(n.lower);
    expect(n.kneeL.parent).toBe(n.hipL);
    expect(n.kneeR.parent).toBe(n.hipR);
  });

  it('净视觉位置不变：躯干世界高度仍是 legLen + bodyH/2（重构只是改枢轴，不是挪模型）', () => {
    const rig = makeRig();
    const n = rigNodes(rig);
    rig.group.updateMatrixWorld(true);
    const torso = n.upper.children[0] as THREE.Object3D;
    const wp = new THREE.Vector3();
    torso.getWorldPosition(wp);
    expect(wp.y).toBeCloseTo(
      raw.view.voxel.legLength + raw.view.voxel.bodyHeight / 2, 9,
    );
  });

  it('上半身倾斜绕腰而不是绕脚底：upper.rotation.x≠0 但 upper.position.y 恒 0', () => {
    const { n } = pose(hit());
    expect(Math.abs(n.upper.rotation.x)).toBeGreaterThan(0.05);
    expect(n.upper.position.y).toBe(0);              // 上半身不单独下沉 / 不飞出去
    expect(n.pelvis.position.y).toBeLessThan(raw.view.voxel.legLength); // 下沉在骨盆
  });

  it('骨盆下沉时上半身同步下沉（上下半身共享重心，不会脱节）', () => {
    const w = makeWorld();
    const rig = makeRig();
    const n = rigNodes(rig);
    // 度量上半身枢轴本身（原点在腰）；绕自身旋转不改变原点位置，
    // 因此差值就是骨盆下沉量，不会被「倾斜让躯干中心二阶下降」干扰。
    const worldY = (): number => {
      rig.group.updateMatrixWorld(true);
      const v = new THREE.Vector3();
      (n.upper as THREE.Object3D).getWorldPosition(v);
      return v.y;
    };
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    const yIdle = worldY();
    rig.update(w.character, w.combat, hit(), w.config.fixedDt, false, w.time);
    const yHit = worldY();
    // 关键：上半身必须跟着骨盆一起沉，否则旧骨架「上半身挂 root」会在这里露馅
    expect(yHit).toBeLessThan(yIdle - 0.01);
    expect(yIdle - yHit).toBeCloseTo(raw.view.voxel.legLength - n.pelvis.position.y, 9);
  });
});

describe('v8f 分层受击：腿屈膝 / 屁股后坐 / 重心小幅偏离 / 上半身反应', () => {
  it('受击时腿真的动：两腿屈膝 + 髋前倾，不再是「脚底锚定、腿钉死」', () => {
    const { n } = pose(hit());
    expect(n.kneeL.rotation.x).toBeGreaterThan(0.15);
    expect(n.kneeR.rotation.x).toBeGreaterThan(0.15);
    expect(n.hipL.rotation.x).toBeLessThan(0);
    expect(n.hipR.rotation.x).toBeLessThan(0);
    const idle = pose(NONE).n;
    expect(idle.kneeL.rotation.x).toBe(0);   // 无受击时腿回到步态基线
  });

  it('屁股向后：骨盆 z<0，且下盘相对骨盆反向补偿让脚少后坐', () => {
    const { n } = pose(hit());
    expect(n.pelvis.position.z).toBeLessThan(-0.02);
    expect(n.lower.position.z).toBeGreaterThan(n.pelvis.position.z);
    expect(n.lower.position.y).toBeGreaterThan(0);  // 下沉同样反向补偿
  });

  it('整体重心偏离幅度小于身体反应（核心诉求），且随力度线性增长', () => {
    const c = hurtCfg();
    for (const type of ['light', 'heavy', 'knock'] as const) {
      const { rig, n } = pose(hit({ type }), c);
      const p = rig.hurt();
      expect(p.comShift).toBeGreaterThan(0);
      expect(p.comShift).toBeLessThan(p.upperShift);
      expect(p.comShift / p.upperShift).toBeLessThan(0.5);
      // 上半身相对骨盆的位移 > 整体重心位移
      const upperMag = Math.hypot(n.upper.position.x, n.upper.position.z);
      const comMag = Math.hypot(p.comX, p.comZ);
      expect(upperMag).toBeGreaterThan(comMag);
    }
    const seq = (['light', 'heavy', 'knock'] as const).map((t) => pose(hit({ type: t }), c).rig.hurt());
    expect(seq[0].comShift).toBeLessThan(seq[1].comShift);
    expect(seq[1].comShift).toBeLessThan(seq[2].comShift);
  });

  it('方向性保留：正面命中后仰、背后前倾、右侧命中侧倾', () => {
    const front = pose(hit({ dirX: 0, dirZ: -1 })).n.upper.rotation.x;
    const back = pose(hit({ dirX: 0, dirZ: 1 })).n.upper.rotation.x;
    const right = pose(hit({ dirX: 1, dirZ: 0 })).n.upper.rotation.z;
    expect(front).toBeLessThan(0);
    expect(back).toBeGreaterThan(0);
    expect(right).toBeLessThan(0);
  });

  it('打肩 vs 打腹（forceHitHeight 0↔1）：屈膝 / 扭转 / 后坐各有差异', () => {
    const hitSide = hit({ dirX: 0.6, dirZ: -0.8 });
    const belly = pose(hitSide, hurtCfg({ forceHitHeight: 0 }));
    const shoulder = pose(hitSide, hurtCfg({ forceHitHeight: 1 }));
    expect(belly.rig.hurt().hitHeight).toBe(0);
    expect(shoulder.rig.hurt().hitHeight).toBe(1);
    expect(belly.n.kneeL.rotation.x).toBeGreaterThan(shoulder.n.kneeL.rotation.x);
    expect(Math.abs(shoulder.n.upper.rotation.y)).toBeGreaterThan(Math.abs(belly.n.upper.rotation.y));
    expect(belly.n.pelvis.position.z).toBeLessThan(shoulder.n.pelvis.position.z);
  });

  it('受击力度越大，屈膝 / 后坐 / 上身位移都越大', () => {
    const seq = (['light', 'heavy', 'knock'] as const).map((t) => pose(hit({ type: t })).n);
    expect(seq[0].kneeL.rotation.x).toBeLessThan(seq[1].kneeL.rotation.x);
    expect(seq[1].kneeL.rotation.x).toBeLessThan(seq[2].kneeL.rotation.x);
    expect(seq[0].pelvis.position.z).toBeGreaterThan(seq[2].pelvis.position.z); // knock 后坐更深（更负）
    expect(seq[0].upper.position.z).toBeGreaterThan(seq[2].upper.position.z);
  });

  it('enabled=false 旧版对照：腿 / 骨盆 / 重心全 0，只剩整体倾斜 + 下沉', () => {
    const { rig, n } = pose(hit(), hurtCfg({ enabled: false }));
    expect(rig.hurt().legacy).toBe(true);
    expect(n.kneeL.rotation.x).toBe(0);
    expect(n.lower.position.z).toBe(0);
    expect(n.upper.position.x).toBe(0);
    expect(n.upper.position.z).toBe(0);
    expect(n.pelvis.position.z).toBe(0);
    expect(Math.abs(n.upper.rotation.x)).toBeGreaterThan(0); // 旧版仍会整体倾斜
    expect(n.pelvis.position.y).toBeLessThan(raw.view.voxel.legLength);
  });

  it('无受击时姿态完全归零，不残留；闪色也清零', () => {
    const { n } = pose(NONE);
    expect(n.pelvis.position.x).toBe(0);
    expect(n.pelvis.position.z).toBe(0);
    expect(n.pelvis.position.y).toBeCloseTo(raw.view.voxel.legLength, 12);
    expect(n.upper.position.x).toBe(0);
    expect(n.upper.position.z).toBe(0);
    expect(n.upper.rotation.x).toBe(0);
    expect(n.kneeL.rotation.x).toBe(0);
    expect(n.lower.position.z).toBe(0);
    const mesh = n.upper.children[0] as THREE.Mesh;
    expect((mesh.material as THREE.MeshLambertMaterial).emissive.r).toBe(0);
  });

  it('受击全程不回写 Core：character 逐字节一致（长期无伤害契约）', () => {
    const w = makeWorld();
    const before = JSON.parse(JSON.stringify(w.character));
    const rig = makeRig();
    rig.update(w.character, w.combat, hit(), w.config.fixedDt, false, w.time);
    expect(w.character).toEqual(before);
    expect(w.playerHurt).toEqual(NONE); // 也不改 Core 的受击状态
  });

  it('暂停 / 时间缩放同步：同一 Core 时间重复渲染姿态逐字节不变', () => {
    const w = makeWorld();
    const rig = makeRig();
    const h = hit();
    rig.update(w.character, w.combat, h, w.config.fixedDt, false, 1.234);
    const a = {
      upper: { ...rigNodes(rig).upper.position, rx: rigNodes(rig).upper.rotation.x },
      pelvis: { ...rigNodes(rig).pelvis.position },
      knee: rigNodes(rig).kneeL.rotation.x,
      hurt: rig.hurt(),
    };
    rig.update(w.character, w.combat, h, w.config.fixedDt, false, 1.234);
    const b = {
      upper: { ...rigNodes(rig).upper.position, rx: rigNodes(rig).upper.rotation.x },
      pelvis: { ...rigNodes(rig).pelvis.position },
      knee: rigNodes(rig).kneeL.rotation.x,
      hurt: rig.hurt(),
    };
    expect(a).toEqual(b);
  });
});

describe('v8f 假人与主角同构：受击也分层（#9 一致性）', () => {
  it('假人受击时腿屈膝、骨盆后坐、上半身绕腰倾斜', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const rig = createDummyRig(
      raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
      w.config.dummies.moveSpeed, raw.view.gait, hurtCfg(),
    );
    s.hurt = hit();
    s.bodyYaw = 0;
    rig.update(s, w.config.fixedDt);
    const n = rigNodes(rig);
    // 受击时骨盆已下沉，故不是恒等于髋部基准，而是「低于基准且有界」
    expect(n.pelvis.position.y).toBeLessThan(raw.view.voxel.legLength);
    expect(n.pelvis.position.y).toBeGreaterThan(raw.view.voxel.legLength - 0.2);
    expect(n.hipL.parent).toBe(n.lower);            // 腿不再挂在上半身下
    expect(n.kneeL.rotation.x).toBeGreaterThan(0.15);
    expect(n.pelvis.position.z).toBeLessThan(-0.02);
    expect(Math.abs(n.upper.rotation.x)).toBeGreaterThan(0.05);
    expect(n.upper.position.y).toBe(0);
    rig.dispose();
  });
});
