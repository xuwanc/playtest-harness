import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createAfterimage } from '../src/presentation/elder-afterimage';
import type { AfterimageViewConfig } from '../src/core/types';

/**
 * v9s.56：老头移动残影（纯表现）回归测试。
 * 不依赖渲染 / 不读 World，只验证对象池与半透明淡出的逻辑正确性。
 */

const baseCfg: AfterimageViewConfig = {
  enabled: true,
  maxGhosts: 6,
  spawnInterval: 0.045,
  spacing: 0,
  life: 0.28,
  minMove: 0.012,
  baseOpacity: 0.34,
  fadeExp: 1.8,
  tint: 'keep',
  color: '#9fdcff',
  bodyTypes: ['elder'],
  fragment: 0,
  fragmentExp: 1,
  fragmentStart: 0,
  fragmentSpin: 0,
};

function makeTarget() {
  // root -> pivot -> target，模拟 playerRoot -> rollPivot -> rig.group 的层级
  const root = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.rotation.x = 0.3;
  root.add(pivot);
  const target = new THREE.Group();
  pivot.add(target);
  const shared = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const m1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shared);
  const m2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shared);
  const m3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
  target.add(m1, m2, m3);
  return { root, pivot, target, shared };
}

/** 模拟一帧移动：root 平移 dx，标记 moving，推进残影 */
function step(
  ai: ReturnType<typeof createAfterimage>,
  target: THREE.Object3D,
  root: THREE.Object3D,
  dx: number,
  bodyId = 'elder',
): void {
  root.position.x += dx;
  ai.update(0.05, target, root, true, bodyId);
}

function firstSnapMat(ai: ReturnType<typeof createAfterimage>): THREE.MeshBasicMaterial | null {
  for (const holder of ai.container.children) {
    const snap = holder.children[0];
    if (!snap) continue;
    let found: THREE.MeshBasicMaterial | null = null;
    snap.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && !found) found = mesh.material as THREE.MeshBasicMaterial;
    });
    if (found) return found;
  }
  return null;
}

describe('v9s.56 老头移动残影：对象池与半透明淡出', () => {
  it('移动时生成残影，且 holder 可见、快照已挂载', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    for (let i = 0; i < 3; i++) step(ai, target, root, 0.1);
    expect(ai.debug().active).toBeGreaterThanOrEqual(1);
    const visibleHolder = ai.container.children.find((h) => h.visible);
    expect(visibleHolder).toBeTruthy();
    expect(visibleHolder!.children[0]).toBeTruthy(); // snap 已挂上
  });

  it('静止（moving=false）不生成残影', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    for (let i = 0; i < 3; i++) ai.update(0.05, target, root, false, 'elder');
    expect(ai.debug().active).toBe(0);
  });

  it('位移不足 minMove 时不生成', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    root.position.x += 0.005; // < minMove 0.012，但仍标记 moving=true
    ai.update(0.05, target, root, true, 'elder');
    expect(ai.debug().active).toBe(0);
  });

  it('非 elder 角色不生成残影', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    for (let i = 0; i < 3; i++) step(ai, target, root, 0.1, 'standard');
    expect(ai.debug().active).toBe(0);
  });

  it('残影按年龄淡出并在 life 后回收（holder 隐藏）', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    step(ai, target, root, 0.1);
    expect(ai.debug().active).toBe(1);
    // 不再移动，只推进时间，累计超过 life(0.28)
    for (let i = 0; i < 10; i++) ai.update(0.05, target, root, false, 'elder');
    expect(ai.debug().active).toBe(0);
  });

  it('opacity 随年龄单调下降且不超过 baseOpacity', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    step(ai, target, root, 0.1);
    const m0 = firstSnapMat(ai)!;
    expect(m0.opacity).toBeCloseTo(baseCfg.baseOpacity, 1);
    ai.update(0.1, target, root, false, 'elder'); // 推进 0.1s
    const m1 = firstSnapMat(ai)!;
    expect(m1.opacity).toBeLessThan(baseCfg.baseOpacity);
  });

  it('共享同一原材质的部件只生成一份半透明材质', () => {
    const { root, target, shared } = makeTarget();
    const ai = createAfterimage(baseCfg);
    step(ai, target, root, 0.1);
    const holder = ai.container.children.find((h) => h.visible)!;
    const snap = holder.children[0]!;
    const mats: THREE.Material[] = [];
    let redCount = 0;
    snap.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (!mats.includes(mat)) mats.push(mat);
      if ((mat.color as THREE.Color).r > 0.5) redCount++;
    });
    // 红(共享) + 绿(独立) = 2 份去重材质；其中红色部件有 2 个但共用 1 份
    expect(mats.length).toBe(2);
    expect(redCount).toBe(2);
  });

  it('关闭（enabled=false）时清空已有残影', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage({ ...baseCfg, enabled: false });
    for (let i = 0; i < 3; i++) step(ai, target, root, 0.1);
    expect(ai.debug().active).toBe(0);
    expect(ai.container.children.every((h) => !h.visible)).toBe(true);
  });

  it('reset 清空所有残影', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    for (let i = 0; i < 3; i++) step(ai, target, root, 0.1);
    ai.reset();
    expect(ai.debug().active).toBe(0);
  });

  it('spacing：距离没拉开（< spacing）时不生成残影，避免过密', () => {
    const cfg = { ...baseCfg, spacing: 0.5 };
    const { root, target } = makeTarget();
    const ai = createAfterimage(cfg);
    root.position.x += 0.3; // 单帧位移 0.3m < spacing 0.5，即便时间已够也不生成
    ai.update(0.2, target, root, true, 'elder');
    expect(ai.debug().active).toBe(0);
  });

  it('spacing：位移拉开到 ≥ spacing 才生成残影', () => {
    const cfg = { ...baseCfg, spacing: 0.1 };
    const { root, target } = makeTarget();
    const ai = createAfterimage(cfg);
    root.position.x += 0.15; // ≥ spacing 0.1 且时间够
    ai.update(0.2, target, root, true, 'elder');
    expect(ai.debug().active).toBe(1);
  });

  it('碎裂无序化：残影随年龄沿固定方向散开 + 自转，生成瞬间不散', () => {
    const cfg = {
      ...baseCfg, spacing: 0, fragment: 0.2, fragmentExp: 1, fragmentStart: 0.3, fragmentSpin: 0.8,
    };
    const { root, target } = makeTarget();
    const ai = createAfterimage(cfg);
    step(ai, target, root, 0.1); // 生成一张，t=0：不应散开
    const holder = ai.container.children.find((h) => h.visible)!;
    const snap = holder.children[0]!;
    const mesh = snap.children[0] as THREE.Mesh;
    // 生成瞬间：clone 子部件位置 == 基准（= 活动角色该部件位置），尚未散开
    const basePos = (mesh.position as THREE.Vector3).clone();
    const baseQuat = (mesh.quaternion as THREE.Quaternion).clone();
    expect((mesh.position as THREE.Vector3).distanceTo(basePos)).toBeCloseTo(0, 5);

    // 推进到 age > life*fragmentStart（0.28*0.3≈0.084s）：应沿固定方向散开 + 自转
    ai.update(0.2, target, root, false, 'elder');
    expect((mesh.position as THREE.Vector3).distanceTo(basePos)).toBeGreaterThan(0.001);
    expect((mesh.quaternion as THREE.Quaternion).angleTo(baseQuat)).toBeGreaterThan(0.001);
  });

  it('性能：同一 rig 连续生成不重复深克隆（稳态零分配）', () => {
    const { root, target } = makeTarget();
    const ai = createAfterimage(baseCfg);
    // 连续多次生成，应复用首次克隆的树，不产生多份 snap
    for (let i = 0; i < 8; i++) {
      root.position.x += 0.5;
      ai.update(0.2, target, root, true, 'elder');
    }
    // 对象池容量 maxGhosts=6，活跃槽位不超过 6 个；每个槽位只有 1 棵克隆树
    const totalSnaps = ai.container.children.reduce(
      (n, h) => n + (h.children.length > 0 ? 1 : 0), 0,
    );
    expect(totalSnaps).toBeLessThanOrEqual(baseCfg.maxGhosts);
  });
});

/**
 * v9s.61：残影必须跟随**当前帧**动画 / 武器姿态。
 * 旧实现只同步 mesh 叶子节点，中间 pivot Group 与 visible 永远停在首次克隆 →
 * 用户反馈「拖影动画还是上一次持武器的动作」。以下用单槽位对象池把
 * 「每次生成都回写全树」的行为锁住。
 */
function makeAnimatedTarget() {
  const root = new THREE.Group();
  const target = new THREE.Group();
  root.add(target);
  const arm = new THREE.Group();              // 中间 pivot：动画靠它旋转
  target.add(arm);
  target.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial()));
  const sword = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial());
  const bow = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial());
  arm.add(sword, bow);
  sword.visible = true;
  bow.visible = false;
  return { root, target, arm, sword, bow };
}

function singleSlotCfg(): AfterimageViewConfig {
  return {
    ...baseCfg, maxGhosts: 1, spawnInterval: 0.02, spacing: 0,
    life: 10, fragment: 0, fragmentSpin: 0,
  };
}

describe('v9s.61 老头残影：跟随当前动画 / 武器姿态', () => {
  it('中间 pivot Group 旋转改变后，下一次生成的残影同步当前姿态（不再冻结旧动作）', () => {
    const { root, target, arm } = makeAnimatedTarget();
    const ai = createAfterimage(singleSlotCfg());
    const snap = () => ai.container.children[0].children[0]!.children[0] as THREE.Group;
    root.position.x += 0.2;
    ai.update(0.05, target, root, true, 'elder');
    expect(snap().quaternion.angleTo(arm.quaternion)).toBeLessThan(1e-6);

    arm.rotation.z = 0.9;                    // 挥武器 / 换动作
    root.position.x += 0.2;
    ai.update(0.05, target, root, true, 'elder');
    // 残影的 pivot 应等于「当前帧」的 pivot，而不是首次克隆那一刻
    expect(snap().quaternion.angleTo(arm.quaternion)).toBeLessThan(1e-6);
    expect(snap().quaternion.angleTo(new THREE.Quaternion())).toBeGreaterThan(0.8);
    ai.dispose();
  });

  it('setWeapon 式 visible 切换后，残影同步当前武器可见性', () => {
    const { root, target, arm, sword, bow } = makeAnimatedTarget();
    const ai = createAfterimage(singleSlotCfg());
    const armSnap = () => ai.container.children[0].children[0]!.children[0] as THREE.Group;
    root.position.x += 0.2;
    ai.update(0.05, target, root, true, 'elder');
    expect(armSnap().children[0].visible).toBe(true);   // 剑
    expect(armSnap().children[1].visible).toBe(false);  // 弓

    sword.visible = false;                 // 切武器
    bow.visible = true;
    root.position.x += 0.2;
    ai.update(0.05, target, root, true, 'elder');
    expect(armSnap().children[0].visible).toBe(false);
    expect(armSnap().children[1].visible).toBe(true);
    expect(armSnap().children.length).toBe(arm.children.length);
    ai.dispose();
  });

  it('rig 结构变化（增删节点）触发重建，克隆树与新结构对齐且不串位', () => {
    const { root, target, arm } = makeAnimatedTarget();
    const ai = createAfterimage(singleSlotCfg());
    root.position.x += 0.2;
    ai.update(0.05, target, root, true, 'elder');
    const extra = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial());
    arm.add(extra);                        // 结构签名变化
    root.position.x += 0.2;
    ai.update(0.05, target, root, true, 'elder');
    const cloneRoot = ai.container.children[0].children[0]!;
    expect(cloneRoot.children.length).toBe(target.children.length);
    expect((cloneRoot.children[0] as THREE.Group).children.length).toBe(arm.children.length);
    ai.dispose();
  });
});
