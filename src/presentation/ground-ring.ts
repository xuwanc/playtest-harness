import * as THREE from 'three';
import type { GroundRingViewConfig } from '../core';

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
   * 绕 Y 的朝向（弧心指向），以及可选的环带加厚倍率（选中态）。
   */
  update(
    arcRad: number,
    opacity: number,
    scale: number,
    color: THREE.Color,
    yawRad: number,
    thicknessScale?: number,
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
  const mat = new THREE.MeshBasicMaterial({
    color: opt.color,
    transparent: true,
    opacity: opt.opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexColors: true,
    toneMapped: false,
  });
  // 预生成默认弧 + 3/4 环两套几何：选中切换只换指针，零运行时缓冲上传
  // （v9s.5 的教训：切换假人状态时同步上传纹理 / 几何会在鸿蒙上卡 1~2 帧）。
  const geoCache = new Map<string, THREE.BufferGeometry>();
  const build = (arcRad: number, thicknessScale: number): THREE.BufferGeometry => {
    const key = `${Math.round(arcRad * 1000)}|${Math.round(thicknessScale * 100)}`;
    const hit = geoCache.get(key);
    if (hit) return hit;
    const geo = buildGroundRingGeometry(
      opt.radius, opt.thickness * thicknessScale, arcRad, opt.edgeFade,
    );
    geoCache.set(key, geo);
    return geo;
  };
  const mesh = new THREE.Mesh(build(opt.arcRad, 1), mat);
  mesh.position.y = opt.y;
  mesh.renderOrder = opt.renderOrder ?? 4;

  let arc = opt.arcRad;
  let thicknessScale = 1;

  return {
    mesh,
    update(arcRad, opacity, scale, color, yawRad, nextThicknessScale = 1): void {
      const th = Math.max(0.05, nextThicknessScale);
      if (Math.abs(arcRad - arc) > 0.01 || Math.abs(th - thicknessScale) > 0.01) {
        mesh.geometry = build(arcRad, th);
        arc = arcRad;
        thicknessScale = th;
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
      for (const geo of geoCache.values()) geo.dispose();
      geoCache.clear();
      mat.dispose();
    },
  };
}

/**
 * 环半径与角色体型绑定：`bodyWidth` 的半个身宽 × 系数。
 * 换角色 / 改体型时环自动跟着缩放，不再写死米数（v9s.10）。
 */
export function groundRingRadius(bodyWidth: number, factor: number): number {
  return Math.max(0.05, (bodyWidth * 0.5) * Math.max(0.1, factor));
}

export type PlayerRingVisual = {
  arcRad: number;
  opacity: number;
  scale: number;
  /** 0..1 威胁强度，供颜色从青白 → 黄 → 红插值 */
  level: number;
};

/**
 * v9s.10 · 玩家环的接敌表达（纯数值，便于单测）。
 *
 *  - 平时：稳定半环，中性青白，只是「我在哪」的定位参照；
 *  - 接敌（`gaze.active`）：弧长随威胁向 3/4 环扩展、透明度提高到明显高于未选中假人环、
 *    呼吸加快，颜色交给调用方按 `level` 从青白 → 黄 → 红；
 *  - 受击守卫期（刚被打过 `hurtHoldSec` 内）：额外闪烁，表达「仍在警戒、还没放下」。
 */
export function playerRingVisual(
  active: boolean,
  threat: number,
  guardRatio: number,
  time: number,
  cfg: GroundRingViewConfig,
): PlayerRingVisual {
  const baseArc = (cfg.arcDeg * Math.PI) / 180;
  const baseOpacity = cfg.playerOpacity;
  if (!active) {
    return { arcRad: baseArc, opacity: baseOpacity, scale: 1, level: 0 };
  }
  const level = Math.min(1, Math.max(0, threat));
  const guard = Math.min(1, Math.max(0, guardRatio));
  const wideArc = (cfg.selectedArcDeg * Math.PI) / 180;
  const arcRad = baseArc + (wideArc - baseArc) * (0.35 + 0.65 * level);
  const rate = 4 + 4 * level + 6 * guard;
  const pulse = 0.5 + 0.5 * Math.sin(time * rate);
  const opacity = Math.min(0.95, baseOpacity + (0.2 + 0.1 * guard) * level + 0.04 * pulse);
  const scale = 1 + 0.02 * level + 0.012 * pulse * level;
  return { arcRad, opacity, scale, level };
}

/** 颜色分级：0 → 中性玩家色，0.5 → 低威胁黄，1 → 高威胁红（两段线性插值）。 */
export function threatRingColor(
  out: THREE.Color,
  base: THREE.Color,
  low: THREE.Color,
  high: THREE.Color,
  level: number,
): THREE.Color {
  const lv = Math.min(1, Math.max(0, level));
  if (lv <= 0.001) return out.copy(base);
  if (lv < 0.5) return out.copy(base).lerp(low, lv * 2);
  return out.copy(low).lerp(high, (lv - 0.5) * 2);
}
