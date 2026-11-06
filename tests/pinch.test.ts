import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import type { CameraZoomViewConfig } from '../src/core';
import {
  clampZoom, initialPinchState, pinchPair, solvePinch, wheelZoomScale,
} from '../src/adapters/pinch';
import type { PinchPoint, PinchState, PinchStep } from '../src/adapters/pinch';
import { createCameraRig } from '../src/presentation/camera-rig';
import { CONFIG } from './helpers';

const cfg: CameraZoomViewConfig = CONFIG.view.zoom;
const p = (id: number, x: number, y: number): PinchPoint => ({ id, x, y });

/** 把一串指针帧依次喂给解算器，累积总缩放比例并保留每一步读数。 */
function gesture(frames: PinchPoint[][], gain = 1, maxStep = 10): {
  total: number; steps: PinchStep[]; state: PinchState;
} {
  let state = initialPinchState();
  let total = 1;
  const steps: PinchStep[] = [];
  for (const points of frames) {
    const step = solvePinch(state, points, gain, maxStep);
    state = step.state;
    total *= step.scale;
    steps.push(step);
  }
  return { total, steps, state };
}

describe('v8e 双指捏合缩放：纯解算（零 DOM / 零外部时间）', () => {
  it('pinchPair 取最后按下的两根，不足两根或同 id 返回 null', () => {
    expect(pinchPair([])).toBeNull();
    expect(pinchPair([p(1, 0, 0)])).toBeNull();
    expect(pinchPair([p(1, 0, 0), p(1, 10, 0)])).toBeNull();
    const pair = pinchPair([p(1, 0, 0), p(2, 100, 0), p(3, 300, 0)]);
    expect(pair?.[0].id).toBe(2);
    expect(pair?.[1].id).toBe(3);
  });

  it('两指张开拉远(scale>1)、捏合拉近(scale<1)，逐帧往返精确回到原倍率', () => {
    const g = gesture([
      [p(1, 0, 0), p(2, 100, 0)],  // 进入双指，记基准 100
      [p(1, 0, 0), p(2, 150, 0)],  // 1.5
      [p(1, 0, 0), p(2, 225, 0)],  // 1.5 → 累计 2.25
      [p(1, 0, 0), p(2, 150, 0)],  // 捏回
      [p(1, 0, 0), p(2, 100, 0)],  // 捏回
    ]);
    expect(g.steps[0].started).toBe(true);
    expect(g.steps[0].scale).toBe(1);
    expect(g.steps[1].scale).toBeCloseTo(1.5, 10);
    expect(g.steps[1].scale).toBeGreaterThan(1);
    expect(g.steps[3].scale).toBeLessThan(1);
    expect(g.total).toBeCloseTo(1, 10);
    expect(g.steps.every((s) => Number.isFinite(s.scale))).toBe(true);
  });

  it('进入 / 退出双指连续：首尾帧不缩放，重新捏合不带上一次残留', () => {
    const g = gesture([
      [p(1, 0, 0)],                   // 单指，不缩放
      [p(1, 0, 0), p(2, 100, 0)],      // started
      [p(1, 0, 0), p(2, 120, 0)],      // 1.2
      [p(1, 0, 0)],                   // ended
      [p(1, 0, 0), p(2, 100, 0)],      // 新一轮 started（新基准）
    ]);
    expect(g.steps[0].pinching).toBe(false);
    expect(g.steps[1].started).toBe(true);
    expect(g.steps[1].scale).toBe(1);
    expect(g.steps[2].scale).toBeCloseTo(1.2, 10);
    expect(g.steps[3].ended).toBe(true);
    expect(g.steps[3].pinching).toBe(false);
    expect(g.steps[3].scale).toBe(1);
    expect(g.steps[4].started).toBe(true);
    expect(g.steps[4].scale).toBe(1);
    expect(g.state.active).toBe(true);
  });

  it('三指时只取最后两根：摇杆那根移动完全不影响捏合距离', () => {
    const base = [p(1, 0, 0), p(2, 0, 0), p(3, 100, 0)];
    const movedFirst = gesture([base, [p(1, 50, 80), p(2, 0, 0), p(3, 100, 0)]]);
    expect(movedFirst.steps[1].scale).toBe(1);
    const movedLast = gesture([base, [p(1, 0, 0), p(2, 0, 0), p(3, 200, 0)]]);
    expect(movedLast.steps[1].scale).toBeCloseTo(2, 10);
  });

  it('两指重合 / 距离为 0：不除零、不产生 NaN，恢复时从新基准起算', () => {
    const g = gesture([
      [p(1, 50, 50), p(2, 50, 50)],
      [p(1, 50, 50), p(2, 150, 50)],
      [p(1, 50, 50), p(2, 50, 50)],
      [p(1, 50, 50), p(2, 250, 50)],
    ]);
    expect(g.steps.every((s) => Number.isFinite(s.scale))).toBe(true);
    expect(g.total).toBe(1);
    expect(g.steps[1].scale).toBe(1);
    expect(g.steps[3].scale).toBe(1);
  });

  it('单帧巨大距离变化被限幅，且不留下欠账（lastDist 始终用真实距离）', () => {
    const g = gesture([
      [p(1, 0, 0), p(2, 100, 0)],
      [p(1, 0, 0), p(2, 1000, 0)],  // raw=10 → clamp 到 1.25
      [p(1, 0, 0), p(2, 1000, 0)],  // 距离没再变 → 不再补涨
    ], 1, 1.25);
    expect(g.steps[1].scale).toBeCloseTo(1.25, 10);
    expect(g.steps[2].scale).toBe(1);
    expect(g.total).toBeCloseTo(1.25, 10);
  });

  it('pinchGain：0 = 禁用捏合缩放，1 = 等比例，2 = 平方放大', () => {
    const frames = [
      [p(1, 0, 0), p(2, 100, 0)],
      [p(1, 0, 0), p(2, 110, 0)],  // raw = 1.1
    ];
    expect(gesture(frames, 0).steps[1].scale).toBe(1);
    expect(gesture(frames, 1).steps[1].scale).toBeCloseTo(1.1, 10);
    expect(gesture(frames, 2).steps[1].scale).toBeCloseTo(1.21, 10);
  });

  it('clampZoom：累乘比例并严格限幅，非法 / 非有限比例不污染当前值', () => {
    expect(clampZoom(1, 1.5, 0.45, 2.4)).toBeCloseTo(1.5, 12);
    expect(clampZoom(2, 1.5, 0.45, 2.4)).toBe(2.4);
    expect(clampZoom(1, 0.2, 0.45, 2.4)).toBe(0.45);
    expect(clampZoom(1, NaN, 0.45, 2.4)).toBe(1);
    expect(clampZoom(1, 0, 0.45, 2.4)).toBe(1);
    expect(clampZoom(1, -3, 0.45, 2.4)).toBe(1);
    expect(clampZoom(1, Infinity, 0.45, 2.4)).toBe(1);
    expect(clampZoom(1, 1, 0.45, 2.4)).toBe(1);
    // 边界反转也能自洽
    expect(clampZoom(1, 1, 2.4, 0.45)).toBe(1);
  });

  it('滚轮：向下滚拉远(>1)、向上滚拉近(<1)、往返抵消，deltaY=0 不变', () => {
    const down = wheelZoomScale(100, cfg.wheelStep);
    const up = wheelZoomScale(-100, cfg.wheelStep);
    expect(down).toBeGreaterThan(1);
    expect(up).toBeLessThan(1);
    expect(down * up).toBeCloseTo(1, 12);
    expect(wheelZoomScale(0, cfg.wheelStep)).toBe(1);
    expect(wheelZoomScale(200, cfg.wheelStep)).toBeCloseTo(down * down, 12);
    expect(wheelZoomScale(100, 0)).toBe(1);           // 非法配置兜底
    expect(wheelZoomScale(NaN, cfg.wheelStep)).toBe(1); // 非法 delta 兜底
  });

  it('端到端：张开再捏回倍率归 1，极端手势被 view.zoom 上下限夹住', () => {
    let zoom = 1;
    const open = gesture([
      [p(1, 0, 0), p(2, 100, 0)],
      [p(1, 0, 0), p(2, 150, 0)],
      [p(1, 0, 0), p(2, 225, 0)],
    ], cfg.pinchGain);
    for (const s of open.steps) zoom = clampZoom(zoom, s.scale, cfg.min, cfg.max);
    expect(zoom).toBeGreaterThan(1);
    expect(zoom).toBeCloseTo(2.25, 6);

    const close = gesture([
      [p(1, 0, 0), p(2, 225, 0)],
      [p(1, 0, 0), p(2, 150, 0)],
      [p(1, 0, 0), p(2, 100, 0)],
    ], cfg.pinchGain);
    for (const s of close.steps) zoom = clampZoom(zoom, s.scale, cfg.min, cfg.max);
    expect(zoom).toBeCloseTo(1, 6);

    expect(clampZoom(1, 100, cfg.min, cfg.max)).toBe(cfg.max);
    expect(clampZoom(1, 0.001, cfg.min, cfg.max)).toBe(cfg.min);
  });

  it('view.zoom 配置自洽：下限 < 1 < 上限，各步长 > 1', () => {
    expect(cfg.min).toBeLessThan(1);
    expect(cfg.max).toBeGreaterThan(1);
    expect(cfg.smoothing).toBeGreaterThan(0);
    expect(cfg.pinchGain).toBeGreaterThan(0);
    expect(cfg.maxStepRatio).toBeGreaterThan(1);
    expect(cfg.wheelStep).toBeGreaterThan(1);
    expect(cfg.keyStep).toBeGreaterThan(1);
  });
});

describe('v8e 缩放倍率真的乘进相机距离（camera-rig 集成）', () => {
  const focus = new THREE.Vector3(0, 0.6, 0);
  function settle(rig: ReturnType<typeof createCameraRig>, target: number): number {
    rig.setZoom(target);
    for (let i = 0; i < 240; i++) rig.update(0, 0, 0, 1 / 60);
    return rig.camera.position.distanceTo(focus);
  }

  it('setZoom(2) 让相机到焦点距离精确翻倍，smart().zoom 同步收敛', () => {
    const rig = createCameraRig(
      CONFIG.view.camera, CONFIG.view.smartCamera, CONFIG.view.zoom, 16 / 9,
    );
    const base = settle(rig, 1);
    const far = settle(rig, 2);
    expect(far / base).toBeCloseTo(2, 4);
    expect(rig.smart().zoom).toBeCloseTo(2, 3);
    const near = settle(rig, 0.5);
    expect(near / base).toBeCloseTo(0.5, 4);
  });

  it('setZoom 非法值兜底为 1，且缩放不改变智能构图意图读数', () => {
    const rig = createCameraRig(
      CONFIG.view.camera, CONFIG.view.smartCamera, CONFIG.view.zoom, 16 / 9,
    );
    settle(rig, 1);
    const s0 = rig.smart();
    rig.setZoom(NaN);
    for (let i = 0; i < 240; i++) rig.update(0, 0, 0, 1 / 60);
    const s1 = rig.smart();
    expect(s1.zoom).toBeCloseTo(1, 3);
    expect(s1.distanceScale).toBeCloseTo(s0.distanceScale, 6);
    expect(s1.offsetX).toBeCloseTo(s0.offsetX, 6);
    expect(s1.pitchDelta).toBeCloseTo(s0.pitchDelta, 6);
  });

  it('缩放是指数平滑而非瞬跳：第一帧只走一部分，随后单调收敛', () => {
    const rig = createCameraRig(
      CONFIG.view.camera, CONFIG.view.smartCamera, CONFIG.view.zoom, 16 / 9,
    );
    for (let i = 0; i < 240; i++) rig.update(0, 0, 0, 1 / 60);
    const d0 = rig.camera.position.distanceTo(focus);
    rig.setZoom(2);
    rig.update(0, 0, 0, 1 / 60);
    const d1 = rig.camera.position.distanceTo(focus);
    expect(d1).toBeGreaterThan(d0);
    expect(d1).toBeLessThan(d0 * 2);
    let prev = d1;
    for (let i = 0; i < 5; i++) {
      rig.update(0, 0, 0, 1 / 60);
      const d = rig.camera.position.distanceTo(focus);
      expect(d).toBeGreaterThan(prev);
      prev = d;
    }
  });
});
