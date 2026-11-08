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
 *
 * 拆分说明：本文件 15 个小函数（几何构建 / 环实例 / 配色 / 淡入淡出）同属一个视觉族，
 * 单职责、强内聚，**不按行数拆**；拆开只会让「改一次配色要同时打开三个文件」。
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

/**
 * v9s.11 · 光晕剖面：径向 7 圈按高斯衰减（中间最亮、内外都长尾收敛）。
 * 旧版 halo 直接复用环带剖面，等于「一条更宽更淡的硬带」，选中切换时像一盏灯被拧开 / 关掉；
 * 换成高斯后边缘没有硬边，配合透明度缓动才读得出「光慢慢渗出来 / 收回去」。
 */
const GLOW_PROFILE = [0, 0.12, 0.28, 0.5, 0.72, 0.88, 1];
const GLOW_ALPHA = [0, 0.16, 0.5, 1, 0.5, 0.16, 0];

/** 径向剖面预设：`band` = 环带，`glow` = 外发光。 */
export type RingProfile = 'band' | 'glow';

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
  profile: RingProfile = 'band',
): THREE.BufferGeometry {
  const inner = Math.max(0.001, radius - thickness * 0.5);
  const outer = Math.max(inner + 0.001, radius + thickness * 0.5);
  const radialProfile = profile === 'glow' ? GLOW_PROFILE : RADIAL_PROFILE;
  const radialAlpha = profile === 'glow' ? GLOW_ALPHA : RADIAL_ALPHA;
  const rows = radialProfile.length;
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
      const rad = inner + (outer - inner) * radialProfile[r];
      const vi = i * rows + r;
      positions[vi * 3] = sx * rad;
      positions[vi * 3 + 1] = 0;
      positions[vi * 3 + 2] = sz * rad;
      const a = edge * radialAlpha[r];
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
  /** 径向剖面：环带（默认）/ 外发光渐变，见 `RingProfile` */
  profile?: RingProfile;
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
  // 预生成几何并按「量化档位」缓存：选中切换只换指针，零运行时缓冲上传
  // （v9s.5 的教训：切换假人状态时同步上传纹理 / 几何会在鸿蒙上卡 1~2 帧）。
  // v9s.11：弧长 / 厚度现在会随选中混合量连续过渡，因此把档位量化到
  // 1.8°（1/32 弧度）与 0.05 厚度 —— 相邻两档肉眼无差，缓存条目收敛在几十个以内。
  const geoCache = new Map<string, THREE.BufferGeometry>();
  let currentGeo: THREE.BufferGeometry | null = null;
  const build = (arcRad: number, thicknessScale: number): THREE.BufferGeometry => {
    const qArc = Math.round(arcRad * 32) / 32;
    const qTh = Math.max(0.05, Math.round(thicknessScale * 20) / 20);
    const key = `${Math.round(qArc * 32)}|${Math.round(qTh * 20)}`;
    const hit = geoCache.get(key);
    if (hit) return hit;
    const geo = buildGroundRingGeometry(
      opt.radius, opt.thickness * qTh, qArc, opt.edgeFade,
      SEGMENTS, opt.profile ?? 'band',
    );
    geoCache.set(key, geo);
    // 上限保护：连续过渡期间档位不会无限增长，超过就释放一个「当前没在用」的最旧档位
    if (geoCache.size > 64) {
      for (const [k, g] of geoCache) {
        if (k !== key && g !== currentGeo) {
          g.dispose();
          geoCache.delete(k);
          break;
        }
      }
    }
    return geo;
  };
  currentGeo = build(opt.arcRad, 1);
  const mesh = new THREE.Mesh(currentGeo, mat);
  mesh.position.y = opt.y;
  mesh.renderOrder = opt.renderOrder ?? 4;

  let arc = opt.arcRad;
  let thicknessScale = 1;

  return {
    mesh,
    update(arcRad, opacity, scale, color, yawRad, nextThicknessScale = 1): void {
      const th = Math.max(0.05, nextThicknessScale);
      if (Math.abs(arcRad - arc) > 0.01 || Math.abs(th - thicknessScale) > 0.01) {
        currentGeo = build(arcRad, th);
        mesh.geometry = currentGeo;
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

/* ===================================================================================
 * v9s.11 · 从「一个装饰环」升级为「环上的信息层」
 *
 * 设计原则：一个环只承载一层语义，多层信息用同心环叠，而不是往同一个 mesh 上堆颜色。
 *   · 主环（内）：身份 / 接敌状态 —— 已有，`createGroundRing`
 *   · 进度弧（外）：蓄力 / 引导 / 冷却 CD —— `createArcMeter`，沿弧长填充
 *   · 预警弧（假人）：起手 windup 倒计时 —— 同一个 `createArcMeter`，满格即命中
 *   · 范围圈（地面）：电环 / 冲锋落点 —— `createAreaRing`，填充 + 边界
 * 全部零运行时几何上传：进度用 `setDrawRange`，范围圈用 scale 套归一化几何。
 * =================================================================================== */

/**
 * 实心圆盘几何（中心 → 边缘 alpha 衰减），用于 AoE 范围填充。
 * 半径为 1，调用方用 scale 套真实半径 —— 换半径零重建。
 */
export function buildGroundDiscGeometry(
  segments = 64,
  innerRatio = 0.06,
  rings = 5,
): THREE.BufferGeometry {
  const cols = segments + 1;
  const rows = rings + 1;
  const positions = new Float32Array(cols * rows * 3);
  const colors = new Float32Array(cols * rows * 4);
  const indices: number[] = [];

  for (let i = 0; i < cols; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const sx = Math.sin(theta);
    const sz = Math.cos(theta);
    for (let r = 0; r < rows; r++) {
      const t = r / rings;
      const rad = innerRatio + (1 - innerRatio) * t;
      const vi = i * rows + r;
      positions[vi * 3] = sx * rad;
      positions[vi * 3 + 1] = 0;
      positions[vi * 3 + 2] = sz * rad;
      // 中心略实、向外平滑收零：读作「这块地」而不是「一个圈」
      const a = Math.pow(1 - t, 1.8) * 0.9 + (r === 0 ? 0.1 : 0);
      colors[vi * 4] = 1;
      colors[vi * 4 + 1] = 1;
      colors[vi * 4 + 2] = 1;
      colors[vi * 4 + 3] = Math.min(1, a);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let r = 0; r < rings; r++) {
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

export type ArcMeterOptions = {
  radius: number;
  thickness: number;
  arcRad: number;
  edgeFade: number;
  color: string;
  y: number;
  renderOrder?: number;
  segments?: number;
  profile?: RingProfile;
};

export type ArcMeter = {
  mesh: THREE.Mesh;
  /** ratio 0..1：从左端向右端填充；opacity=0 时整体隐藏 */
  set(ratio: number, opacity: number, color: THREE.Color, yawRad: number, scale?: number): void;
  ratio(): number;
  /** 当前显示的段数（供验收：确认填充真的在增长） */
  filledSegments(): number;
  dispose(): void;
};

/**
 * 进度弧：一次生成「满弧」几何，靠 `setDrawRange` 露出前 N 段。
 * 之所以不按弧长重建几何：蓄力 / 引导 / CD 每帧都在变，重建会持续上传顶点缓冲
 * （v9s.5 的卡顿教训）；drawRange 只是改一个整数，零上传、零 GC。
 */
export function createArcMeter(opt: ArcMeterOptions): ArcMeter {
  const segments = opt.segments ?? SEGMENTS;
  const profile = opt.profile ?? 'band';
  const rows = profile === 'glow' ? GLOW_PROFILE.length : RADIAL_PROFILE.length;
  const idxPerSeg = (rows - 1) * 6;
  const geo = buildGroundRingGeometry(
    opt.radius, opt.thickness, opt.arcRad, opt.edgeFade, segments, profile,
  );
  const mat = new THREE.MeshBasicMaterial({
    color: opt.color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexColors: true,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = opt.y;
  mesh.renderOrder = opt.renderOrder ?? 7;
  mesh.visible = false;
  geo.setDrawRange(0, 0);

  let filled = 0;

  return {
    mesh,
    set(ratio, opacity, color, yawRad, scale = 1): void {
      const r = Math.min(1, Math.max(0, ratio));
      const segs = Math.round(r * segments);
      // 至少露 1 段：ratio 刚起步时也给一个可见的「起点像素」
      const count = r > 0.001 ? Math.max(1, segs) * idxPerSeg : 0;
      if (count !== geo.drawRange.count) geo.setDrawRange(0, count);
      filled = segs;
      mat.opacity = opacity;
      mat.color.copy(color);
      mesh.scale.set(scale, 1, scale);
      mesh.rotation.y = yawRad;
      mesh.visible = opacity > 0.002 && r > 0.001;
    },
    ratio(): number {
      return segments > 0 ? filled / segments : 0;
    },
    filledSegments(): number {
      return filled;
    },
    dispose(): void {
      geo.dispose();
      mat.dispose();
    },
  };
}

export type AreaRingOptions = {
  color: string;
  /** 边界环带宽度占半径的比例（0.04 ≈ 半径 2.4m 时约 0.1m） */
  edgeWidthRatio?: number;
  y: number;
  renderOrder?: number;
};

export type AreaRing = {
  group: THREE.Group;
  /** 位置、真实半径（米）、整体透明度 0..1、时间（用于边界呼吸） */
  set(x: number, z: number, y: number, radius: number, opacity: number, time: number): void;
  dispose(): void;
};

/**
 * AoE 范围圈：内部柔光填充 + 外圈边界，几何按半径 1 归一化，靠 scale 套真实半径。
 * 电环、冲锋落点共用一套 —— 范围类信息全部长这样，玩家不用学第二种视觉语言。
 */
export function createAreaRing(opt: AreaRingOptions): AreaRing {
  const group = new THREE.Group();
  const fillGeo = buildGroundDiscGeometry(48);
  const fillMat = new THREE.MeshBasicMaterial({
    color: opt.color, transparent: true, opacity: 0, depthWrite: false,
    side: THREE.DoubleSide, vertexColors: true, toneMapped: false,
  });
  const fill = new THREE.Mesh(fillGeo, fillMat);
  fill.renderOrder = opt.renderOrder ?? 2;
  group.add(fill);

  const ew = Math.max(0.01, opt.edgeWidthRatio ?? 0.045);
  const edgeGeo = buildGroundRingGeometry(1 - ew * 0.5, ew, Math.PI * 2, 0, 64, 'band');
  const edgeMat = new THREE.MeshBasicMaterial({
    color: opt.color, transparent: true, opacity: 0, depthWrite: false,
    side: THREE.DoubleSide, vertexColors: true, toneMapped: false,
  });
  const edge = new THREE.Mesh(edgeGeo, edgeMat);
  edge.renderOrder = (opt.renderOrder ?? 2) + 1;
  group.add(edge);

  group.position.y = opt.y;

  return {
    group,
    set(x, z, y, radius, opacity, time): void {
      const o = Math.min(1, Math.max(0, opacity));
      group.position.set(x, y, z);
      fill.scale.set(radius, 1, radius);
      edge.scale.set(radius, 1, radius);
      // 内部填充永远比边界淡：先把「范围」铺出来，再让边界去抓眼睛
      fillMat.opacity = o * 0.26;
      edgeMat.opacity = o * (0.72 + 0.18 * Math.sin(time * 7));
      group.visible = o > 0.004;
    },
    dispose(): void {
      fillGeo.dispose();
      fillMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
    },
  };
}

/* ---------------- 纯数值：信号解算（不碰 three，可单测） ---------------- */

/** 指数趋近；`tauSec` 为时间常数（越小越快）。dt<=0 或 tau 极小时直接取目标。 */
export function fadeTowards(current: number, target: number, dt: number, tauSec: number): number {
  if (tauSec <= 1e-4 || dt <= 0) return target;
  const k = 1 - Math.exp(-dt / tauSec);
  return current + (target - current) * k;
}

export type WindupWarning = {
  active: boolean;
  /** 0..1 起手进度：填满瞬间就是命中帧 */
  ratio: number;
  /** 0..1 紧迫度：越接近出手越高，用于呼吸加快 / 亮度 */
  urgency: number;
};

/**
 * 假人起手预警（v9s.11）。
 * `elapsed` 传 `DummyState.attackPhaseTimer`（windup 阶段是已流逝时间）。
 * 只在 windup 阶段亮，active / recovery 立刻熄灭 —— 预警必须「有敌意才亮」，
 * 否则和受击闪红混在一起，玩家就读不出「下一步要挨打」。
 */
export function dummyWindupWarning(
  phase: string,
  elapsed: number,
  windupSec: number,
): WindupWarning {
  if (phase !== 'windup') return { active: false, ratio: 0, urgency: 0 };
  const total = Math.max(1e-4, windupSec);
  const ratio = Math.min(1, Math.max(0, elapsed / total));
  return { active: true, ratio, urgency: 0.35 + 0.65 * ratio };
}

export type RingMeterSource = 'none' | 'charge' | 'channel' | 'cooldown';

export type PlayerMeter = {
  source: RingMeterSource;
  ratio: number;
};

export type PlayerMeterInput = {
  charging: boolean;
  charge: number;
  channeling: boolean;
  fireTimer: number;
  fireInterval: number;
  /** v9s.17：整轮引导进度 0..1（按波次算）；缺省时退回 fireTimer 的单波进度 */
  channelProgress?: number;
  /** v9s.17：法杖波次齐射的剩余冷却（秒） */
  arcaneCooldown?: number;
  /** 法杖齐射的冷却总时长（秒） */
  arcaneCooldownMax?: number;
  /** 冲刺 / 闪现剩余冷却（秒） */
  dashCooldown: number;
  /** 该动作的冷却总时长（秒），用当前武器那一档 */
  dashCooldownMax: number;
};

/**
 * 玩家进度弧的唯一数据源（v9s.11）。
 * 优先级 = 操作意图的紧迫度：正在蓄力 > 正在引导 > 技能在冷却。
 * 冷却只在剩冷却时显示（≤1s 的一次反馈），不会变成常驻噪音。
 */
export function playerMeterSource(input: PlayerMeterInput): PlayerMeter {
  if (input.charging) {
    return { source: 'charge', ratio: Math.min(1, Math.max(0, input.charge)) };
  }
  if (input.channeling) {
    if (input.channelProgress !== undefined) {
      return { source: 'channel', ratio: Math.min(1, Math.max(0, input.channelProgress)) };
    }
    const iv = Math.max(1e-4, input.fireInterval);
    // fireTimer 是「距下一波还剩多少」，倒过来就是这一波的填充进度
    return { source: 'channel', ratio: 1 - Math.min(1, Math.max(0, input.fireTimer / iv)) };
  }
  const ac = input.arcaneCooldown ?? 0;
  const acMax = input.arcaneCooldownMax ?? 0;
  if (ac > 0 && acMax > 0) {
    return { source: 'cooldown', ratio: 1 - Math.min(1, Math.max(0, ac / acMax)) };
  }
  if (input.dashCooldown > 0 && input.dashCooldownMax > 0) {
    return {
      source: 'cooldown',
      ratio: 1 - Math.min(1, Math.max(0, input.dashCooldown / input.dashCooldownMax)),
    };
  }
  return { source: 'none', ratio: 0 };
}

export type LandingPreview = {
  active: boolean;
  x: number;
  z: number;
  radius: number;
};

/**
 * 冲锋落点预览：派生招起手（windup）阶段，在「起点 + 朝向 × 冲锋距离」画范围圈。
 * windup 期间玩家还没位移，所以当前位置就是起点，不需要额外记录起手点。
 */
export function linkLandingPreview(
  phase: string,
  x: number,
  z: number,
  facingYaw: number,
  travel: number,
  hitRadius: number,
): LandingPreview {
  if (phase !== 'windup' || travel <= 0.05) {
    return { active: false, x, z, radius: 0 };
  }
  return {
    active: true,
    x: x + Math.sin(facingYaw) * travel,
    z: z + Math.cos(facingYaw) * travel,
    radius: Math.max(0.3, hitRadius),
  };
}

/**
 * AoE 范围圈的「展开」包络（v9s.12）。
 *
 * 电圈不是凭空出现一个满半径圆，而是从放置点（角色中心）向外推开：
 * `age` 为已存在时长，`scale` 用 easeOutCubic 从 0 → 1，`alpha` 同步淡入。
 * 只影响表现层的 mesh 缩放，Core 的命中半径始终是配置值 —— 视觉展开不能改变判定。
 */
export function areaOpen(age: number, expandSec: number): { scale: number; alpha: number } {
  const d = Math.max(0.02, expandSec);
  const t = Math.min(1, Math.max(0, age / d));
  const ease = 1 - Math.pow(1 - t, 3);
  return { scale: 0.06 + 0.94 * ease, alpha: t };
}

/**
 * 环的贴地高度（v9s.12）：只跟随「落地时的脚下高度」，空中保持不变。
 * 这样角色跳起来环不会被一起抬到空中，走上台阶时又能跟着地面。
 */
export function ringGroundHeight(grounded: boolean, y: number, lastGroundY: number): number {
  return grounded ? y : lastGroundY;
}
