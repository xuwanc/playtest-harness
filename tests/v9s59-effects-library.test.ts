import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  createAfterimageEffect, createGhostAfterimage, createRtAfterimage,
  AFTERIMAGE_EFFECTS, AFTERIMAGE_KINDS,
} from '../src/presentation/effects';
import type { AfterimageEffect } from '../src/presentation/effects';
import type { AfterimageViewConfig, AfterimageRtViewConfig } from '../src/core/types';

/**
 * v9s.59：可复用残影特效库回归测试。
 * 验证统一工厂 / 注册表 / 统一接口，以及 ghost 的 alphaHash「画在背后」与性能读数。
 */

const ghostCfg: AfterimageViewConfig = {
  enabled: true,
  maxGhosts: 4,
  spawnInterval: 0.045,
  spacing: 0,
  life: 0.28,
  minMove: 0.01,
  baseOpacity: 0.34,
  fadeExp: 1.8,
  tint: 'keep',
  color: '#9fdcff',
  bodyTypes: ['elder'],
  fragment: 0,
  fragmentExp: 1,
  fragmentStart: 0,
  fragmentSpin: 0,
  depthMode: 'hash',
  behindBias: 0.06,
};

const rtCfg: AfterimageRtViewConfig = {
  enabled: true,
  bodyTypes: ['sentinel'],
  decay: 0.86,
  scale: 1.012,
  intensity: 0.9,
  mode: 'add',
  tint: 'keep',
  color: '#9fdcff',
  resolutionScale: 0.5,
  blur: 0.8,
  worldScale: true,
  refDistance: 0,
};

function makeRig(): { root: THREE.Group; target: THREE.Group } {
  const root = new THREE.Group();
  const target = new THREE.Group();
  root.add(target);
  const shared = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  target.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shared));
  target.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shared));
  return { root, target };
}

function makeMock() {
  const renderer: any = {
    getDrawingBufferSize: (v?: THREE.Vector2) => (v ? v.set(64, 64) : new THREE.Vector2(64, 64)),
    setRenderTarget: () => {},
    getRenderTarget: () => null,
    setClearColor: () => {},
    getClearColor: (t?: THREE.Color) => t ?? new THREE.Color(),
    getClearAlpha: () => 1,
    clear: () => {},
    render: () => {},
    autoClear: true,
  };
  return { renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() };
}

/** 统一接口的鸭子类型检查 */
function assertEffectContract(fx: AfterimageEffect): void {
  expect(fx.container).toBeTruthy();
  expect(typeof fx.update).toBe('function');
  expect(typeof fx.reset).toBe('function');
  expect(typeof fx.debug).toBe('function');
  expect(typeof fx.dispose).toBe('function');
  const d = fx.debug();
  expect(typeof d.count).toBe('number');
  expect(typeof d.active).toBe('number');
  expect(typeof d.spawning).toBe('boolean');
}

describe('v9s.59 可复用残影特效库', () => {
  it('注册表枚举两种方案，工厂可分别创建且都满足统一接口', () => {
    expect(AFTERIMAGE_KINDS).toEqual(['ghost', 'rt']);
    expect(typeof AFTERIMAGE_EFFECTS.ghost).toBe('function');
    expect(typeof AFTERIMAGE_EFFECTS.rt).toBe('function');

    const ghost = createAfterimageEffect('ghost', ghostCfg);
    const rt = createAfterimageEffect('rt', makeMock(), rtCfg);
    assertEffectContract(ghost);
    assertEffectContract(rt);
    ghost.dispose();
    rt.dispose();
  });

  it('具体工厂可单独使用，转发 shim 与库返回的是同一实现', () => {
    const a = createGhostAfterimage(ghostCfg);
    const b = createAfterimageEffect('ghost', ghostCfg);
    expect(a.debug().count).toBe(b.debug().count);
    a.dispose(); b.dispose();
    const rt = createRtAfterimage(makeMock(), rtCfg);
    assertEffectContract(rt);
    rt.dispose();
  });

  it('ghost·alphaHash：材质进不透明队列、写深度、正面剔除（根治交叉面干涉）', () => {
    const fx = createGhostAfterimage(ghostCfg);
    const { root, target } = makeRig();
    root.position.x += 0.2;
    fx.update(0.05, target, root, true, 'elder');
    const holder = fx.container.children.find((h) => h.visible)!;
    const snap = holder.children[0]!;
    let mat: THREE.MeshBasicMaterial | null = null;
    snap.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !mat) mat = m.material as THREE.MeshBasicMaterial;
    });
    expect(mat).toBeTruthy();
    const m = mat as unknown as THREE.MeshBasicMaterial;
    expect(m.alphaHash).toBe(true);
    expect(m.transparent).toBe(false);
    expect(m.depthWrite).toBe(true);
    expect(m.depthTest).toBe(true);
    expect(m.side).toBe(THREE.FrontSide);
    fx.dispose();
  });

  it('ghost·behindBias：残影整体沿运动反方向后推（不与角色共面 → 画在背后）', () => {
    const fx = createGhostAfterimage(ghostCfg);
    const { root, target } = makeRig();
    root.position.x = 0;
    fx.update(0.05, target, root, true, 'elder'); // 建立 prevRoot
    root.position.x = 0.3;
    fx.update(0.05, target, root, true, 'elder');
    const holder = fx.container.children.find((h) => h.visible)!;
    const snap = holder.children[0]! as THREE.Object3D & { matrix: THREE.Matrix4 };
    // 角色当前世界 x=0.3，残影应被沿 -x 后推，其 matrix 平移 < 0.3
    expect(snap.matrix.elements[12]).toBeLessThan(0.3);
    expect(snap.matrix.elements[12]).toBeGreaterThan(0.3 - 0.2); // 后推量约 behindBias
    fx.dispose();
  });

  it('ghost·blend 回退：切回旧半透明混合', () => {
    const fx = createGhostAfterimage({ ...ghostCfg, depthMode: 'blend' });
    const { root, target } = makeRig();
    root.position.x += 0.2;
    fx.update(0.05, target, root, true, 'elder');
    const holder = fx.container.children.find((h) => h.visible)!;
    let m: THREE.MeshBasicMaterial | null = null;
    holder.children[0]!.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && !m) m = mesh.material as THREE.MeshBasicMaterial;
    });
    expect(m).toBeTruthy();
    const mat = m as unknown as THREE.MeshBasicMaterial;
    expect(mat.transparent).toBe(true);
    expect(mat.alphaHash).toBe(false);
    expect(mat.side).toBe(THREE.DoubleSide);
    fx.dispose();
  });

  it('ghost 稳态零分配：连续生成不重复深克隆（过期只隐藏、保留克隆树）', () => {
    const fx = createGhostAfterimage(ghostCfg);
    const { root, target } = makeRig();
    for (let i = 0; i < 12; i++) {
      root.position.x += 0.3;
      fx.update(0.2, target, root, true, 'elder');
    }
    const snaps = fx.container.children.reduce((n, h) => n + (h.children.length > 0 ? 1 : 0), 0);
    expect(snaps).toBeLessThanOrEqual(ghostCfg.maxGhosts);
    // debug 带性能读数
    expect(typeof fx.debug().drawCalls).toBe('number');
    expect(fx.debug().passes).toBe(0); // ghost 只挂场景对象，不额外起 render pass
    fx.dispose();
  });
});
