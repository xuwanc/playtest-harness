import * as THREE from 'three';

/**
 * 角色残影特效库 · 共享层（v9s.59）。
 *
 * 把「克隆 ghost 池」与「RT 反馈」两种拖影收敛成同一套接口，供任意角色 / 任意方案
 * 复用。库本身不认识 `World` / `Core`，也不绑定任何 bodyType —— 作用对象与开关全由
 * 配置 + 每帧 `update` 的 `bodyId` 决定。
 *
 * 统一契约：
 *  - 都由工厂 `createAfterimage(kind, cfg, ctx)` 创建；
 *  - 都返回 `AfterimageEffect`（container / update / reset / debug / dispose）；
 *  - `update` 签名一致，调用方无需区分方案；
 *  - `debug()` 额外给出性能读数（pass / pixels / drawCalls），便于验收与降档评估。
 */

/** 运行期上下文：RT 方案必需，ghost 方案可选（用于诊断，当前不依赖相机） */
export type EffectContext = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  /**
   * v9s.61：场景遮挡物（墙 / 障碍的不透明 mesh）。RT 反馈是全屏合成，天然无视深度，
   * 角色躲到墙后时残影会「透视」显示。这里用射线对这些遮挡物做可见性门控，
   * 被挡住时拖影整体淡出 → 不透视。纯表现、零额外 render pass；不传则不做遮挡。
   */
  occluders?: THREE.Object3D[];
};

/** 支持的残影方案 */
export type AfterimageKind = 'ghost' | 'rt';

export type AfterimageDebug = {
  /** 对象池容量 / RT 缓冲数 */
  count: number;
  /** 当前活动残影数 / RT 是否激活 */
  active: number;
  /** 本帧是否生成了新残影 */
  spawning: boolean;
  /** 本帧 render pass 数（性能读数；ghost 为 0，因为它只往场景里挂对象） */
  passes?: number;
  /** 本帧 RT 写入像素数（性能读数；降采样后按实际 RT 尺寸算） */
  pixels?: number;
  /** 估算的本帧 draw call 数（性能读数） */
  drawCalls?: number;
  /** RT 方案的相机重投影比例（性能/诊断读数，1 = 相机未缩放） */
  zoomRatio?: number;
  /** v9s.61：目标角色可见度 0..1（1=完全可见，0=被遮挡物挡住）。遮挡门控读数 */
  occlusion?: number;
};

/**
 * 统一的残影特效接口。两种方案都实现它，three-scene 只依赖这个抽象。
 */
export type AfterimageEffect = {
  /** 需要挂进场景的对象（ghost = 残影容器；rt = 占位空 Group，实际直接合成到屏幕） */
  container: THREE.Object3D;
  /**
   * 每帧调用。
   * @param dt     真实帧时长（秒）
   * @param target 角色顶层 group（含本帧姿态）
   * @param root   承载世界位移的祖先（playerRoot）
   * @param moving 本帧是否「移动够了」
   * @param bodyId 当前 bodyType id，用于按配置筛选作用角色
   */
  update(dt: number, target: THREE.Object3D, root: THREE.Object3D, moving: boolean, bodyId: string): void;
  reset(): void;
  debug(): AfterimageDebug;
  dispose(): void;
};

/** mulberry32：小体积确定性 PRNG，避免依赖 Math.random 的不可复现 */
export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randUnitVec(rnd: () => number, out: THREE.Vector3): THREE.Vector3 {
  const u = rnd() * 2 - 1;
  const theta = rnd() * Math.PI * 2;
  const s = Math.sqrt(Math.max(0, 1 - u * u));
  return out.set(s * Math.cos(theta), u, s * Math.sin(theta));
}
