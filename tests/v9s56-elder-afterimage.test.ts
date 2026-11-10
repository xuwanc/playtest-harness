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
  life: 0.28,
  minMove: 0.012,
  baseOpacity: 0.34,
  fadeExp: 1.8,
  tint: 'keep',
  color: '#9fdcff',
  bodyType: 'elder',
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
});
