import * as THREE from 'three';

/**
 * v9s.9 · 脚下指示半环（纯表现层，不进 Core / 快照）。
 *
 * 形态：贴地环带，默认半环（180°），弧心朝相机侧（屏幕下方），两端用顶点 alpha
 * 渐隐到 0，形成「两头渐变」的柔和眉形；内 / 外缘同样渐隐，避免硬边。
 *
 * 为什么自建顶点色几何而不是贴图 / shader：
 *  · 弧长要在半环 ↔ 3/4 环之间切换，纹理得按弧长重画，shader 又要多一份 GLSL；
 *  · 顶点色 RGBA（three 支持 itemSize=4 的顶点 alpha）让「角向两端渐变 + 径向软边」
 *    一次烘进几何，切弧长只是重建一次很小的 BufferGeometry；
 *  · 颜色随威胁变化只需改 material.color，透明度改 material.opacity，零额外开销。
 */

export type GroundRing = {
  mesh: THREE.Mesh;
  /**
   * 每帧写入：弧长（弧度）、透明度、缩放、颜色（复用 THREE.Color 实例）、
   * 以及绕 Y 的朝向（弧心指向）。
   */
  update(
    arcRad: number,
    opacity: number,
    scale: number,
    color: THREE.Color,
    yawRad: number,
  ): void;
  /** 当前弧长（弧度），供验收读数。 */
  arcRad(): number;
  dispose(): void;
};

const SEGMENTS = 64;
/** 径向 4 圈：内外缘 alpha=0，中间两圈满值 → 柔和的环带剖面。 */
const RADIAL_PROFILE = [0, 0.24, 0.76, 1];
const RADIAL_ALPHA = [0, 1, 1, 0];

function smooth01(x: number, width: number): number {
  if (width <= 1e-6) return 1;
  const t = Math.min(1, Math.max(0, x / width));
  return t * t * (3 - 2 * t);
}

/**
 * 生成贴地环带几何：角度 0 指向 +Z（本地），弧对称铺在 [-arc/2, +arc/2]。
 * 两端各按 edgeFade 比例（0..0.5）淡出到全透明，径向按 RADIAL_PROFILE 软边。
 */
export function buildGroundRingGeometry(
  radius: number,
  thickness: number,
  arcRad: number,
  edgeFade: number,
  segments = SEGMENTS,
): THREE.BufferGeometry {
  const inner = Math.max(0.001, radius - thickness * 0.5);
  const outer = Math.max(inner + 0.001, radius + thickness * 0.5);
  const rows = RADIAL_PROFILE.length;
  const cols = segments + 1;
  const positions = new Float32Array(cols * rows * 3);
  const colors = new Float32Array(cols * rows * 4);
  const indices: number[] = [];

  for (let i = 0; i < cols; i++) {
    const u = i / segments;
    const theta = (u - 0.5) * arcRad;
    // 两端渐变：靠近两端时整体 alpha 降到 0
    const edge = smooth01(u, edgeFade) * smooth01(1 - u, edgeFade);
    const sx = Math.sin(theta);
    const sz = Math.cos(theta);
    for (let r = 0; r < rows; r++) {
      const rad = inner + (outer - inner) * RADIAL_PROFILE[r];
      const vi = i * rows + r;
      positions[vi * 3] = sx * rad;
      positions[vi * 3 + 1] = 0;
      positions[vi * 3 + 2] = sz * rad;
      const a = edge * RADIAL_ALPHA[r];
      colors[vi * 4] = 1;
      colors[vi * 4 + 1] = 1;
      colors[vi * 4 + 2] = 1;
      colors[vi * 4 + 3] = a;
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let r = 0; r < rows - 1; r++) {
      const a = i * rows + r;
      const b = a + rows;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 4));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

export type GroundRingOptions = {
  radius: number;
  thickness: number;
  arcRad: number;
  edgeFade: number;
  color: string;
  opacity: number;
  /** 贴地高度（米），用来给玩家 / 假人环分先后，避免共面闪烁 */
  y: number;
  /** 渲染顺序：大的后画（半透明不写深度，靠顺序叠） */
  renderOrder?: number;
};

export function createGroundRing(opt: GroundRingOptions): GroundRing {
  const geo = buildGroundRingGeometry(opt.radius, opt.thickness, opt.arcRad, opt.edgeFade);
  const mat = new THREE.MeshBasicMaterial({
    color: opt.color,
    transparent: true,
    opacity: opt.opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexColors: true,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = opt.y;
  mesh.renderOrder = opt.renderOrder ?? 4;

  let current = geo;
  let arc = opt.arcRad;

  return {
    mesh,
    update(arcRad, opacity, scale, color, yawRad): void {
      // 弧长变化才重建：选中切换是低频事件（几次 / 分钟），几何只有 ~1KB
      if (Math.abs(arcRad - arc) > 0.01) {
        current.dispose();
        current = buildGroundRingGeometry(opt.radius, opt.thickness, arcRad, opt.edgeFade);
        mesh.geometry = current;
        arc = arcRad;
      }
      mat.opacity = opacity;
      mat.color.copy(color);
      mesh.scale.set(scale, 1, scale);
      mesh.rotation.y = yawRad;
      mesh.visible = opacity > 0.002;
    },
    arcRad(): number {
      return arc;
    },
    dispose(): void {
      current.dispose();
      mat.dispose();
    },
  };
}
