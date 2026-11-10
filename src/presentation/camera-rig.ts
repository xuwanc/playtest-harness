import * as THREE from 'three';
import type { GroundBasis } from '../adapters/input';
import type { CameraConfig, CameraIntent, CameraZoomViewConfig, SmartCameraViewConfig } from '../core';
import { SHAKE_PRESETS, shakeOffset } from './shake';
import type { ShakeKind, ShakePreset } from './shake';

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
  /**
   * v9s.x：注入一次震动。`kind` 决定波形 / 衰减 / 频段，`amount` 是 0..1 的 trauma。
   * 兼容旧调用（不传 kind 时按普通命中处理）。
   *
   * 卡肉负责「停」，震动负责「砸」。旧版三轴高频正弦 + 累加能量会读成掉帧，
   * 现在改成 trauma² 整形 + 平滑噪声 + 低频主导 + 按冲击类型分档，见 shake.ts。
   */
  addShake(amount: number, kind?: ShakeKind): void;
  /** 当前震动能量 0..1（纯观测，供 diagnostics / 自动化验收） */
  shakeLevel(): number;
  /** 当前生效的震动档位 / 参数（验收「按击中类型分档」直接读这里） */
  shakeKind(): ShakeKind;
  shakePreset(): ShakePreset;
  /**
   * v9s.33：方向性微推。命中瞬间把相机沿「玩家 → 受击者」方向推几厘米，
   * 和全向震动分开：震动表达「多沉」，微推表达「从哪边打过来的」。
   */
  addKick(dirX: number, dirZ: number, amount: number): void;
  /** 微推能量 0..1（观测用） */
  kickLevel(): number;
  /** 累计触发的微推次数（自验用：确认命中上升沿确实调到了 addKick） */
  kickCount(): number;
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
  /** v9s.x 命中震动：trauma 0..1 + 当前档位 + 连续时间（纯表现，不进 Core / 快照） */
  let trauma = 0;
  let preset: ShakePreset = SHAKE_PRESETS.impact;
  let activeKind: ShakeKind = 'impact';
  let shakeClock = 0;
  let lastTriggerAt = -1e9;
  /** v9s.33 方向性微推：单位方向 × 幅度（米），能量指数衰减 */
  let kickX = 0;
  let kickZ = 0;
  let kickE = 0;
  let kickCount = 0;

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

      // v9s.x 命中震动：trauma 驱动 + 平滑噪声（低频主导）+ 线性衰减。
      // 仍是纯平移、不改朝向：背景不旋转，只有「砸一下再余震」的错位感；
      // 人眼对旋转震动敏感约 3 倍，这里刻意不加 roll，避免眩晕。
      shakeClock += dt;
      if (trauma > 1e-3) {
        const o = shakeOffset(trauma, preset, shakeClock);
        camera.position.x += o.x;
        camera.position.y += o.y;
        camera.position.z += o.z;
        trauma = Math.max(0, trauma - preset.decay * dt);
      } else {
        trauma = 0;
      }
      if (kickE > 1e-3) {
        camera.position.x += kickX * kickE;
        camera.position.z += kickZ * kickE;
        kickE *= Math.exp(-13 * dt);
      } else {
        kickE = 0;
      }
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
    addShake(amount, kind = 'impact'): void {
      if (!Number.isFinite(amount) || amount <= 0) return;
      const p = SHAKE_PRESETS[kind] ?? SHAKE_PRESETS.impact;
      // 一次挥砍可能跨多帧命中 / 同帧多目标：同类 60ms 内只认一次，
      // 且 trauma 取最大而非累加 —— 连击不再叠成持续蜂鸣（旧版「越砍越碎」的根因）。
      // 例外：这次冲击更强时仍允许覆盖，保证重击不会被前面的轻击吃掉。
      if (activeKind === kind && shakeClock - lastTriggerAt < 0.06
        && trauma >= Math.min(1, amount)) return;
      activeKind = kind;
      lastTriggerAt = shakeClock;
      preset = p;
      trauma = Math.max(trauma, Math.min(1, amount));
    },
    shakeLevel(): number {
      return trauma;
    },
    shakeKind(): ShakeKind {
      return activeKind;
    },
    shakePreset(): ShakePreset {
      return { ...preset };
    },
    addKick(dirX, dirZ, amount) {
      if (!Number.isFinite(dirX) || !Number.isFinite(dirZ) || !(amount > 0)) return;
      const len = Math.hypot(dirX, dirZ);
      if (len < 1e-4) return;
      kickX = (dirX / len) * amount;
      kickZ = (dirZ / len) * amount;
      kickE = 1;
      kickCount++;
    },
    kickLevel(): number {
      return kickE;
    },
    kickCount(): number {
      return kickCount;
    },
    setZoom(next): void {
      zoomTarget = Number.isFinite(next) && next > 0 ? next : 1;
    },
    smart(): SmartCameraState {
      return { ...smart };
    },
  };
}
