import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createCameraRig } from '../src/presentation/camera-rig';
import { CONFIG } from './helpers';

/**
 * v9s.61：装备展示（底部抽屉）打开时下移**主场景相机**，让主场景角色上移到
 * 不被抽屉遮挡的上半区。用户明确纠正这指的是场景相机，不是装备面板的转台相机。
 * 这里验证：纯平移（视线方向不变）、世界点投影上移、关闭后回位。
 */
function makeRig() {
  return createCameraRig(
    CONFIG.view.camera, CONFIG.view.smartCamera, CONFIG.view.zoom, 16 / 9,
  );
}

function settle(rig: ReturnType<typeof makeRig>, frames = 40): void {
  for (let i = 0; i < frames; i++) rig.update(0, 0, 0, 1 / 60);
}

describe('v9s.61 主场景相机 lift（装备抽屉开合）', () => {
  it('setLift(true) 后相机沿屏幕下方平移、视线方向保持不变', () => {
    const rig = makeRig();
    settle(rig);
    const posBefore = rig.camera.position.clone();
    const quatBefore = rig.camera.quaternion.clone();

    rig.setLift(true);
    settle(rig);
    expect(rig.liftLevel()).toBeGreaterThan(0.95);
    // 视线方向不变（纯平移，不旋转 / 不重新 lookAt）
    expect(rig.camera.quaternion.angleTo(quatBefore)).toBeLessThan(1e-6);
    // 相机位置确实变了（沿屏幕下方）
    expect(rig.camera.position.distanceTo(posBefore)).toBeGreaterThan(0.1);
  });

  it('世界里的角色在屏幕上向上移动（进入上半区），关闭后回到原处', () => {
    const rig = makeRig();
    settle(rig);
    const hero = new THREE.Vector3(0, 0.6, 0);
    const yBefore = hero.clone().project(rig.camera).y;
    expect(Math.abs(yBefore)).toBeLessThan(0.35);   // 原本大致居中

    rig.setLift(true);
    settle(rig);
    const yOpen = hero.clone().project(rig.camera).y;
    expect(yOpen).toBeGreaterThan(yBefore + 0.1);    // 明显上移
    expect(yOpen).toBeLessThan(1);                   // 没被推出画面

    rig.setLift(false);
    settle(rig, 120);
    expect(rig.liftLevel()).toBeLessThan(0.001);
    expect(hero.clone().project(rig.camera).y).toBeCloseTo(yBefore, 3);
  });

  it('lift 是平滑过渡而非瞬跳，且 snap 时直接套用目标值', () => {
    const rig = makeRig();
    settle(rig);
    rig.setLift(true);
    rig.update(0, 0, 0, 1 / 60);
    const first = rig.liftLevel();
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(0.5);
    rig.snap(0, 0, 0);
    expect(rig.liftLevel()).toBeCloseTo(1, 6);
  });
});
