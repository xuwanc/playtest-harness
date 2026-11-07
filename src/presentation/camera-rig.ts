import * as THREE from 'three';
import type { GroundBasis } from '../adapters/input';
import type { CameraConfig, CameraIntent, CameraZoomViewConfig, SmartCameraViewConfig } from '../core';

export type SmartCameraState = {
  distanceScale: number;
  offsetX: number;
  offsetZ: number;
  pitchDelta: number;
  /** v8e：用户主动缩放倍率（>1 拉远、<1 拉近），由双指捏合 / 滚轮 / 快捷键驱动 */
  zoom: number;
};

export type CameraRig = {
  camera: THREE.PerspectiveCamera;
  /** 2.5D 斜俯视：固定 pitch/yaw，只平移跟随，不随角色旋转；叠加智能构图意图与用户缩放。 */
  update(x: number, y: number, z: number, dt: number, intent?: CameraIntent): void;
  /** v9s.15：把跟随目标瞬移到指定点（测试工位传送用），不做跨场地平滑滑行 */
  snap(x: number, y: number, z: number): void;
  resize(aspect: number): void;
  getGroundBasis(): GroundBasis;
  /** 设置用户缩放目标倍率（1 = 基础距离）；实际倍率按 zoomCfg.smoothing 指数平滑跟随 */
  setZoom(next: number): void;
  /** 表现层实际采用的平滑后构图值，供 diagnostics / 验收读数。 */
  smart(): SmartCameraState;
};

const NEUTRAL: CameraIntent = {
  distanceScale: 1,
  offsetX: 0,
  offsetZ: 0,
  pitchDelta: 0,
  threat: 0,
  threatCount: 0,
  centroidX: 0,
  centroidZ: 0,
};

export function createCameraRig(
  cfg: CameraConfig,
  smartCfg: SmartCameraViewConfig,
  zoomCfg: CameraZoomViewConfig,
  aspect: number,
): CameraRig {
  const camera = new THREE.PerspectiveCamera(cfg.fov, aspect, 0.1, 200);
  const target = new THREE.Vector3();
  const focus = new THREE.Vector3();
  const offset = new THREE.Vector3();
  let initialized = false;
  let lastFov = cfg.fov;
  const smart: SmartCameraState = {
    distanceScale: 1, offsetX: 0, offsetZ: 0, pitchDelta: 0, zoom: 1,
  };
  /** 用户缩放目标（由组装层喂入），smart.zoom 平滑跟随，不进 Core / 快照 */
  let zoomTarget = 1;

  function computeOffset(): void {
    const pitch = ((cfg.pitchDeg + smart.pitchDelta) * Math.PI) / 180;
    const yaw = (cfg.yawDeg * Math.PI) / 180;
    offset
      .set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch))
      .multiplyScalar(cfg.distance * smart.distanceScale * smart.zoom);
  }
  computeOffset();

  return {
    camera,
    update(x, y, z, dt, intent = NEUTRAL): void {
      const ty = y + 0.6;
      if (!initialized) {
        target.set(x, ty, z);
        initialized = true;
      } else {
        // 指数平滑：帧率无关，可用调试面板实时改 smoothing
        const k = 1 - Math.exp(-Math.max(cfg.smoothing, 0.001) * dt);
        target.x += (x - target.x) * k;
        target.y += (ty - target.y) * k;
        target.z += (z - target.z) * k;
      }

      // 智能构图：Core 意图 → 表现层指数平滑，避免威胁人数变化时镜头突变
      const ks = 1 - Math.exp(-Math.max(smartCfg.smoothing, 0.001) * dt);
      smart.distanceScale += (intent.distanceScale - smart.distanceScale) * ks;
      smart.offsetX += (intent.offsetX - smart.offsetX) * ks;
      smart.offsetZ += (intent.offsetZ - smart.offsetZ) * ks;
      smart.pitchDelta += (intent.pitchDelta - smart.pitchDelta) * ks;

      // v8e：用户缩放目标 → 指数平滑，捏合 / 滚轮跟手又不抖；帧率无关
      const kz = 1 - Math.exp(-Math.max(zoomCfg.smoothing, 0.001) * dt);
      smart.zoom += (zoomTarget - smart.zoom) * kz;

      computeOffset(); // 让俯角 / 距离 / 缩放的热改动立即生效
      if (camera.fov !== lastFov || camera.fov !== cfg.fov) {
        camera.fov = cfg.fov;
        lastFov = cfg.fov;
        camera.updateProjectionMatrix();
      }
      // 焦点朝威胁质心平移：相机整体平移（视线方向不变），让玩家与敌群都落在画面内
      focus.set(target.x + smart.offsetX, target.y, target.z + smart.offsetZ);
      camera.position.copy(focus).add(offset);
      camera.lookAt(focus);
      camera.updateMatrixWorld();
    },
    snap(x, y, z): void {
      target.set(x, y + 0.6, z);
      initialized = true;
      focus.set(target.x + smart.offsetX, target.y, target.z + smart.offsetZ);
      computeOffset();
      camera.position.copy(focus).add(offset);
      camera.lookAt(focus);
      camera.updateMatrixWorld();
    },
    resize(a): void {
      camera.aspect = a;
      camera.updateProjectionMatrix();
    },
    getGroundBasis(): GroundBasis {
      // matrixWorld 第 0 列 = 相机右；第 2 列取反 = 相机朝向（屏幕「上」在地面的投影）
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const fwd = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 2).negate();
      const rl = Math.hypot(right.x, right.z) || 1;
      const fl = Math.hypot(fwd.x, fwd.z) || 1;
      return {
        rightX: right.x / rl,
        rightZ: right.z / rl,
        forwardX: fwd.x / fl,
        forwardZ: fwd.z / fl,
      };
    },
    setZoom(next): void {
      zoomTarget = Number.isFinite(next) && next > 0 ? next : 1;
    },
    smart(): SmartCameraState {
      return { ...smart };
    },
  };
}
