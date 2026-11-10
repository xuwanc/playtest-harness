import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createRtAfterimage } from '../src/presentation/rt-afterimage';
import type { AfterimageRtViewConfig } from '../src/core/types';

/**
 * v9s.57：RT 反馈残影（机器人对照测试）回归测试。
 * 用桩 renderer 验证：作用角色判定、layer 隔离、反馈 pass 的执行与状态 save/restore。
 */

const baseCfg: AfterimageRtViewConfig = {
  enabled: true,
  bodyTypes: ['sentinel'],
  decay: 0.86,
  scale: 1.012,
  intensity: 0.9,
  mode: 'add',
  tint: 'keep',
  color: '#9fdcff',
};

function makeMock() {
  const renderCalls: Array<[unknown, unknown]> = [];
  const setRT: unknown[] = [];
  const renderer: any = {
    getDrawingBufferSize: () => ({ x: 64, y: 64 }),
    setRenderTarget: (t: unknown) => {
      setRT.push(t);
    },
    getRenderTarget: () => null,
    setClearColor: () => {},
    getClearColor: () => new THREE.Color(),
    getClearAlpha: () => 1,
    clear: () => {},
    render: (s: unknown, c: unknown) => {
      renderCalls.push([s, c]);
    },
    autoClear: true,
  };
  return { renderer, renderCalls, setRT };
}

function makeTarget(): THREE.Group {
  const target = new THREE.Group();
  target.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()));
  target.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial()));
  return target;
}

describe('v9s.57 RT 反馈残影：机器人对照测试', () => {
  it('仅对 bodyTypes 内的角色执行反馈 pass（sentinel 才跑）', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(
      { renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() },
      baseCfg,
    );
    const target = makeTarget();
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    // 机器人单独渲 1 次 + 3 个 quad（decay / add / compose）= 4 次 render
    expect(renderCalls.length).toBe(4);
    // 作用角色被隔离到 RT_LAYER（mask 含 bit1 = 2）
    const mesh = target.children[0] as THREE.Mesh;
    expect(mesh.layers.mask & 2).not.toBe(0);
  });

  it('非 sentinel 角色不执行反馈 pass（无 render 调用）', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(
      { renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() },
      baseCfg,
    );
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'elder');
    expect(renderCalls.length).toBe(0);
  });

  it('enabled=false 时不执行反馈 pass', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(
      { renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() },
      { ...baseCfg, enabled: false },
    );
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'sentinel');
    expect(renderCalls.length).toBe(0);
  });

  it('空 bodyTypes 表示所有角色都生效', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(
      { renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() },
      { ...baseCfg, bodyTypes: [] },
    );
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'anyone');
    expect(renderCalls.length).toBe(4);
  });
});
