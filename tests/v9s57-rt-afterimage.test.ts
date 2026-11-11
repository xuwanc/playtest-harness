import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createRtAfterimage } from '../src/presentation/rt-afterimage';
import { RT_SHADERS } from '../src/presentation/effects/rt-afterimage';
import type { AfterimageRtViewConfig } from '../src/core/types';
import type { EffectContext } from '../src/presentation/effects/shared';

/**
 * v9s.57 / v9s.59：RT 反馈残影（机器人对照测试）回归测试。
 * 用桩 renderer 验证：作用角色判定、layer 隔离、合并后的 3-pass 管线、
 * 降采样、静止停跑、相机缩放解耦、状态 save/restore。
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
  resolutionScale: 0.5,
  updateStride: 1,          // 测试用：每帧完整反馈，便于断言 3-pass
  worldScale: true,
  refDistance: 0,
};

function makeMock() {
  const renderCalls: Array<[unknown, unknown]> = [];
  const setRT: unknown[] = [];
  const renderer: any = {
    getDrawingBufferSize: (v?: THREE.Vector2) => {
      if (v) { v.set(64, 64); return v; }
      return new THREE.Vector2(64, 64);
    },
    setRenderTarget: (t: unknown) => { setRT.push(t); },
    getRenderTarget: () => null,
    setClearColor: () => {},
    getClearColor: (target?: THREE.Color) => target ?? new THREE.Color(),
    getClearAlpha: () => 1,
    clear: () => {},
    render: (s: unknown, c: unknown) => { renderCalls.push([s, c]); },
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

function makeCtx(renderer: any): EffectContext {
  return { renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() };
}

/** 在相机与角色之间摆一堵墙（不透明 mesh），用于遮挡门控测试 */
function makeWall(centerY: number, height: number): THREE.Mesh {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(8, height, 0.4),
    new THREE.MeshBasicMaterial(),
  );
  wall.position.set(0, centerY, 2);
  wall.updateMatrixWorld(true);
  return wall;
}

function occlusionCtx(renderer: any, occluders: THREE.Object3D[]): EffectContext {
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.2, 6);
  camera.updateMatrixWorld(true);
  return { renderer, scene: new THREE.Scene(), camera, occluders };
}

describe('v9s.57 RT 反馈残影：机器人对照测试', () => {
  it('仅对 bodyTypes 内的角色执行反馈 pass（sentinel 才跑），且是合并后的 3-pass', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), baseCfg);
    const target = makeTarget();
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    // 角色渲到 rtCur(1) + accum(1) + compose(1) = 3 次 render（原 decay+add 已合并成一个 accum）
    expect(renderCalls.length).toBe(3);
    // 作用角色被隔离到 RT_LAYER（mask 含 bit1 = 2）
    const mesh = target.children[0] as THREE.Mesh;
    expect(mesh.layers.mask & 2).not.toBe(0);
  });

  it('非 sentinel 角色不执行反馈 pass（无 render 调用）', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), baseCfg);
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'elder');
    expect(renderCalls.length).toBe(0);
  });

  it('enabled=false 时不执行反馈 pass', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), { ...baseCfg, enabled: false });
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'sentinel');
    expect(renderCalls.length).toBe(0);
  });

  it('空 bodyTypes 表示所有角色都生效', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), { ...baseCfg, bodyTypes: [] });
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'anyone');
    expect(renderCalls.length).toBe(3);
  });

  it('resolutionScale 降采样：RT 像素数按 scale² 下降', () => {
    const { renderer } = makeMock();
    const full = createRtAfterimage(makeCtx(renderer), { ...baseCfg, resolutionScale: 1 });
    full.update(0.05, makeTarget(), new THREE.Group(), true, 'sentinel');
    const half = createRtAfterimage(makeCtx(renderer), { ...baseCfg, resolutionScale: 0.5 });
    half.update(0.05, makeTarget(), new THREE.Group(), true, 'sentinel');
    // 全分辨率 64×64×3，半分辨率 32×32×3 → 恰好 1/4
    expect(half.debug().pixels).toBe(full.debug().pixels! / 4);
  });

  it('静止且残影衰减完毕后整套管线停跑（passes 归零）', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), baseCfg);
    const target = makeTarget();
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel'); // 先动一帧注入能量
    const before = renderCalls.length;
    // 连续静止：energy 逐帧 ×decay(0.86)，降到阈值后停跑
    for (let i = 0; i < 40; i++) ai.update(0.05, target, new THREE.Group(), false, 'sentinel');
    const afterIdle = renderCalls.length;
    ai.update(0.05, target, new THREE.Group(), false, 'sentinel');
    expect(renderCalls.length).toBe(afterIdle); // 停跑后不再产生任何 render
    expect(afterIdle).toBeGreaterThan(before);
    expect(ai.debug().passes).toBe(0);
    expect(ai.debug().active).toBe(0);
  });

  it('相机缩放解耦：相机移动后 zoomRatio 偏离 1（历史帧重投影）', () => {
    const { renderer } = makeMock();
    const ctx = makeCtx(renderer);
    const ai = createRtAfterimage(ctx, { ...baseCfg, refDistance: 10 });
    const target = makeTarget();
    ctx.camera.position.set(0, 0, 10);
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    ctx.camera.position.set(0, 0, 5); // 相机拉近 → 重投影比例应变化
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    expect(ai.debug().zoomRatio).not.toBe(1);
  });

  it('updateStride 时间降采样：非反馈帧只做 1 次便宜合成（移动时开销近似减半）', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), { ...baseCfg, updateStride: 2 });
    const target = makeTarget();
    const root = new THREE.Group();
    ai.update(0.05, target, root, true, 'sentinel'); // frame1：强制首次反馈 → 3 render
    expect(renderCalls.length).toBe(3);
    renderCalls.length = 0;
    ai.update(0.05, target, root, true, 'sentinel'); // frame2：2%2=0 → 3 render
    expect(renderCalls.length).toBe(3);
    renderCalls.length = 0;
    ai.update(0.05, target, root, true, 'sentinel'); // frame3：3%2=1 → 只 1 次 compose
    expect(renderCalls.length).toBe(1);
    expect(ai.debug().passes).toBe(1);
    ai.dispose();
  });
});

/**
 * v9s.61：用户反馈「机器人 rt 拖影全黑」+「被墙壁挡住仍然能透视拖影」。
 *  - 全黑根因：accum 同时衰减 rgb/alpha，compose 又 `c.rgb - cur.rgb` 双重削弱历史颜色。
 *  - 透视根因：全屏 compose 无视深度 → 墙后残影照画。现在用 occluders 射线门控。
 */
describe('v9s.61 RT 拖影：正确显示模式 + 遮挡不透视', () => {
  it('shader 只衰减 alpha、compose 保留角色本色（不再把历史颜色削成黑）', () => {
    expect(RT_SHADERS.accum).toContain('p.a * uDecay');
    // 旧写法：整个 vec4（含 rgb）乘 decay → 历史颜色逐帧变暗
    expect(RT_SHADERS.accum).not.toContain('texture2D(uPrev, uv) * uDecay');
    expect(RT_SHADERS.accum).toContain('cur.a > 0.001 ? cur.rgb : p.rgb');
    // 旧写法：减去当前帧颜色 → 历史残影接近 0（全黑）
    expect(RT_SHADERS.compose).not.toContain('c.rgb - cur.rgb');
    expect(RT_SHADERS.compose).toContain('vec3 col = c.rgb');
    expect(RT_SHADERS.compose).toContain('uOcclusion');
  });

  it('未传 occluders 时可见度恒为 1，行为与之前一致（仍跑 3-pass）', () => {
    const { renderer, renderCalls } = makeMock();
    const ai = createRtAfterimage(makeCtx(renderer), baseCfg);
    ai.update(0.05, makeTarget(), new THREE.Group(), true, 'sentinel');
    expect(ai.debug().occlusion).toBe(1);
    expect(renderCalls.length).toBe(3);
    ai.dispose();
  });

  it('角色被墙完全挡住：visibility=0、清空累积并整套停跑（不画透视拖影）', () => {
    const { renderer, renderCalls } = makeMock();
    const ctx = occlusionCtx(renderer, [makeWall(0.9, 4)]);
    const ai = createRtAfterimage(ctx, baseCfg);
    const target = makeTarget();
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    expect(ai.debug().occlusion).toBe(0);
    expect(ai.debug().active).toBe(0);
    expect(ai.debug().passes).toBe(0);
    expect(renderCalls.length).toBe(0);   // 一个 render pass 都不跑
    ai.dispose();
  });

  it('部分遮挡：visibility 介于 0~1，拖影按可见比例变淡但仍渲染', () => {
    const { renderer, renderCalls } = makeMock();
    // 只挡住中间那条射线（相机 (0,1.2,6) → 角色 y=0 的射线在 z=2 处 y≈0.4）
    const ctx = occlusionCtx(renderer, [makeWall(0.4, 0.12)]);
    const ai = createRtAfterimage(ctx, baseCfg);
    const target = makeTarget();
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    const occ = ai.debug().occlusion!;
    expect(occ).toBeGreaterThan(0);
    expect(occ).toBeLessThan(1);
    expect(renderCalls.length).toBe(3);
    ai.dispose();
  });

  it('遮挡解除后自动恢复：forceFeedback 重新起反馈、拖影重新出现', () => {
    const { renderer, renderCalls } = makeMock();
    const wall = makeWall(0.9, 4);
    const ctx = occlusionCtx(renderer, [wall]);
    const ai = createRtAfterimage(ctx, baseCfg);
    const target = makeTarget();
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    expect(renderCalls.length).toBe(0);
    wall.position.set(0, 0.9, 20);          // 把墙挪到角色后面 → 不再遮挡
    wall.updateMatrixWorld(true);
    ai.update(0.05, target, new THREE.Group(), true, 'sentinel');
    expect(ai.debug().occlusion).toBe(1);
    expect(ai.debug().passes).toBe(3);
    expect(renderCalls.length).toBe(3);
    ai.dispose();
  });
});
