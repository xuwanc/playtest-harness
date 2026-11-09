import * as THREE from 'three';
import type { BloodViewConfig, HitMark, ViewConfig, World } from '../core';
import { FX_ORDER } from './fx-layer';

/**
 * v9s.56 · 命中飙血。
 *
 * 三层一起才读得出血：
 *
 * | 层 | 干什么 | 为什么不能省 |
 * |---|---|---|
 * | 血珠 | 沿击打方向抛出去、受重力、落地 | 只有它给出「这一下从哪儿打到哪儿」的方向感 |
 * | 血雾 | 命中瞬间那团半透明 | 补足瞬时冲击；纯血珠像撒了一把红豆 |
 * | 地面血迹 | 留几秒，落地时生成 | 环境痕迹；没有它，打完一场地上干干净净，读作打空气 |
 *
 * 数据源是 Core 的 `world.hitMarks`（短环形，见 `core/health.ts`），**不读事件队列**：
 * `step` 每帧开头清空 events，低帧率一帧多步时只有最后一步的 `hit` 会留下，
 * 连击的血花就会一段一段地丢。按 `seq` 补触发是幂等的，卡顿后一次补几条也不会重复。
 *
 * 全部参数外置在 `config.view.blood`；`enabled: false` 时不建任何网格（零开销）。
 */

/** 血珠上限：11 滴 × 3 个陪练同时挨打，还留一倍余量给连击。 */
const DROP_CAP = 128;
const MIST_CAP = 10;
const STAIN_CAP = 32;

type Drop = {
  live: boolean;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number;
  max: number;
  size: number;
  spin: number;
};

type Fade = {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  max: number;
  /** 起始 / 峰值缩放 */
  from: number;
  to: number;
  opacity: number;
  /** 是否贴地（血迹）：只有贴地的才需要按地面高度定位 */
  flat: boolean;
};

/** 确定性伪随机：同一 `seq` 的回放 / 截图逐像素一致，方便 A/B 对比。 */
function rnd(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export type BloodFx = {
  /** 每帧：先按 `hitMarks.seq` 补触发，再推进三层各自的生命周期 */
  update(w: World, dt: number): void;
  /** 读数（验收 / 调试面板）：本局喷发次数 / 活跃血珠 / 活跃血迹 / 已播到的 seq */
  debug(): { bursts: number; drops: number; stains: number; lastSeq: number };
  dispose(): void;
};

const EMPTY: BloodViewConfig = {
  enabled: false, color: '#b01919', darkColor: '#6f0f0f',
  drops: 10, dropLife: 0.5, dropSize: 0.055,
  spraySpeed: 2.6, sprayLift: 2.1, spread: 0.5, gravity: 11,
  mistLife: 0.17, mistRadius: 0.34, mistOpacity: 0.5,
  stainCount: 16, stainLife: 6, stainRadius: 0.24, stainOpacity: 0.45,
};

function bloodConfig(v: ViewConfig): BloodViewConfig {
  const b = v.blood;
  if (!b || b.enabled === false) return EMPTY;
  const num = (x: number | undefined, d: number, lo: number, hi: number): number =>
    typeof x === 'number' && Number.isFinite(x) ? clamp(x, lo, hi) : d;
  return {
    enabled: true,
    color: b.color ?? EMPTY.color,
    darkColor: b.darkColor ?? EMPTY.darkColor,
    drops: Math.round(num(b.drops, EMPTY.drops, 0, 40)),
    dropLife: num(b.dropLife, EMPTY.dropLife, 0.05, 3),
    dropSize: num(b.dropSize, EMPTY.dropSize, 0.01, 0.3),
    spraySpeed: num(b.spraySpeed, EMPTY.spraySpeed, 0, 12),
    sprayLift: num(b.sprayLift, EMPTY.sprayLift, 0, 12),
    spread: num(b.spread, EMPTY.spread, 0, 3),
    gravity: num(b.gravity, EMPTY.gravity, 0, 40),
    mistLife: num(b.mistLife, EMPTY.mistLife, 0.03, 2),
    mistRadius: num(b.mistRadius, EMPTY.mistRadius, 0.05, 2),
    mistOpacity: num(b.mistOpacity, EMPTY.mistOpacity, 0, 1),
    stainCount: Math.round(num(b.stainCount, EMPTY.stainCount, 0, 64)),
    stainLife: num(b.stainLife, EMPTY.stainLife, 0.2, 60),
    stainRadius: num(b.stainRadius, EMPTY.stainRadius, 0.05, 2),
    stainOpacity: num(b.stainOpacity, EMPTY.stainOpacity, 0, 1),
  };
}

export function createBloodFx(
  scene: THREE.Scene,
  view: ViewConfig,
  groundY: (x: number, z: number, fromY: number) => number,
): BloodFx {
  const cfg = bloodConfig(view);
  let bursts = 0;
  let lastSeq = 0;

  const group = new THREE.Group();
  group.name = 'bloodFx';
  scene.add(group);

  // ---- 血珠：InstancedMesh（一次 draw call）。未激活的实例缩放到 0 ----
  const dropGeo = new THREE.BoxGeometry(1, 1, 1);
  const dropMat = new THREE.MeshBasicMaterial({ color: cfg.color });
  const dropMesh = new THREE.InstancedMesh(dropGeo, dropMat, DROP_CAP);
  dropMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dropMesh.frustumCulled = false;
  dropMesh.renderOrder = FX_ORDER.bloodDrop;
  dropMesh.count = DROP_CAP;
  group.add(dropMesh);
  const dropDummy = new THREE.Object3D();
  const drops: Drop[] = Array.from({ length: DROP_CAP }, () => ({
    live: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0,
    life: 0, max: 1, size: 0.05, spin: 0,
  }));
  // 初始全部缩到 0，避免第一帧在原点冒出一团
  for (let i = 0; i < DROP_CAP; i++) {
    dropDummy.position.set(0, -999, 0);
    dropDummy.scale.setScalar(0);
    dropDummy.updateMatrix();
    dropMesh.setMatrixAt(i, dropDummy.matrix);
  }
  dropMesh.instanceMatrix.needsUpdate = true;

  // ---- 血雾：低模二十面体（体素风格里比球体更像「一团」）----
  const mistGeo = new THREE.IcosahedronGeometry(1, 0);
  const mists: Fade[] = Array.from({ length: MIST_CAP }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.color, transparent: true, opacity: 0, depthWrite: false,
    });
    const mesh = new THREE.Mesh(mistGeo, mat);
    mesh.visible = false;
    mesh.renderOrder = FX_ORDER.bloodMist;
    group.add(mesh);
    return { mesh, mat, life: 0, max: 1, from: 1, to: 1, opacity: 0, flat: false };
  });

  // ---- 地面血迹：扁圆片，各自独立材质（逐块透明度不同）----
  const stainGeo = new THREE.CircleGeometry(1, 12);
  const stains: Fade[] = Array.from({ length: Math.max(0, cfg.stainCount) }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.darkColor, transparent: true, opacity: 0, depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(stainGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    mesh.renderOrder = FX_ORDER.bloodStain;
    group.add(mesh);
    return { mesh, mat, life: 0, max: 1, from: 1, to: 1, opacity: 0, flat: true };
  });

  let stainCursor = 0;

  function spawnStain(x: number, z: number, y: number, scale: number, seed: number): void {
    if (stains.length === 0) return;
    // 环形轮转：旧的自然被覆盖（地面血迹本来就不需要精确生命周期）
    const s = stains[stainCursor % stains.length];
    stainCursor += 1;
    const r = cfg.stainRadius * (0.7 + rnd(seed) * 0.7) * scale;
    s.mesh.position.set(x + (rnd(seed + 1) - 0.5) * 0.16, y + 0.012, z + (rnd(seed + 2) - 0.5) * 0.16);
    s.mesh.rotation.z = rnd(seed + 3) * Math.PI * 2;
    // 稍微压扁：正圆太「盖章」，拉成椭圆更像溅上去的
    s.mesh.scale.set(r * (1 + rnd(seed + 4) * 0.5), r * (0.7 + rnd(seed + 5) * 0.5), 1);
    s.mesh.visible = true;
    s.life = cfg.stainLife;
    s.max = cfg.stainLife;
    s.opacity = cfg.stainOpacity;
    s.mat.opacity = cfg.stainOpacity;
  }

  function spawnBurst(m: HitMark): void {
    bursts += 1;
    const power = clamp(m.power, 0.2, 1.6);
    // 方向：击打方向 + 一点向上的抛射；横向散布是为了「一片」而不是「一条线」
    const dirX = m.dx === 0 && m.dz === 0 ? 0 : m.dx;
    const dirZ = m.dx === 0 && m.dz === 0 ? 1 : m.dz;
    const n = Math.round(cfg.drops * clamp(0.6 + power * 0.6, 0.5, 1.8));
    for (let k = 0; k < n; k++) {
      const d = drops.find((x) => !x.live);
      if (!d) break;
      const seed = m.seq * 71 + k * 13 + 1;
      const side = (rnd(seed) - 0.5) * 2;
      const up = 0.55 + rnd(seed + 1) * 0.8;
      const fwd = 0.6 + rnd(seed + 2) * 0.8;
      const speed = cfg.spraySpeed * (0.55 + power * 0.55);
      d.live = true;
      d.x = m.x + (rnd(seed + 3) - 0.5) * 0.12;
      d.y = m.y + (rnd(seed + 4) - 0.5) * 0.14;
      d.z = m.z + (rnd(seed + 5) - 0.5) * 0.12;
      d.vx = (dirX * fwd - dirZ * side * cfg.spread) * speed;
      d.vz = (dirZ * fwd + dirX * side * cfg.spread) * speed;
      d.vy = cfg.sprayLift * up * (0.6 + power * 0.5);
      d.max = cfg.dropLife * (0.7 + rnd(seed + 6) * 0.6);
      d.life = d.max;
      d.size = cfg.dropSize * (0.7 + rnd(seed + 7) * 0.8) * (0.85 + power * 0.35);
      d.spin = rnd(seed + 8) * Math.PI;
    }

    // 血雾：一团，往击打方向偏一点点，读作「从这里炸开」
    const mist = mists.find((x) => x.life <= 0);
    if (mist) {
      mist.mesh.position.set(
        m.x + dirX * 0.12,
        m.y + 0.02,
        m.z + dirZ * 0.12,
      );
      mist.mesh.rotation.set(rnd(m.seq) * 3, rnd(m.seq + 1) * 3, rnd(m.seq + 2) * 3);
      mist.mesh.visible = true;
      mist.life = cfg.mistLife;
      mist.max = cfg.mistLife;
      mist.from = cfg.mistRadius * (0.55 + power * 0.4);
      mist.to = cfg.mistRadius * (1.5 + power * 0.9);
      mist.opacity = cfg.mistOpacity * clamp(0.6 + power * 0.5, 0.5, 1.4);
      mist.mat.opacity = mist.opacity;
    }
  }

  return {
    update(w, dt): void {
      if (!cfg.enabled) return;
      // 1) 补触发：seq 只增不减，所以「比上次大」的就是新的
      if (w.hitMarkSeq > lastSeq) {
        for (let i = 0; i < w.hitMarks.length; i++) {
          const m = w.hitMarks[i];
          if (m.seq > lastSeq) spawnBurst(m);
        }
        lastSeq = w.hitMarkSeq;
      }

      // 2) 血珠：重力积分 + 落地转血迹
      const dts = Math.max(0, Math.min(dt, 0.05));
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (!d.live) {
          dropDummy.position.set(0, -999, 0);
          dropDummy.scale.setScalar(0);
        } else {
          d.vy -= cfg.gravity * dts;
          d.x += d.vx * dts;
          d.y += d.vy * dts;
          d.z += d.vz * dts;
          d.life -= dts;
          const gy = groundY(d.x, d.z, d.y + 0.3);
          if (Number.isFinite(gy) && d.y <= gy + 0.01) {
            d.live = false;
            // 落地：约一半的滴留痕。每滴都留会把 18 块池两刀就刷满，
            // 地面变成一大片暗红，反而看不出「这一刀溅到哪儿」。
            if (rnd(i * 31 + 7) < 0.52) {
              spawnStain(d.x, d.z, gy, 0.75 + d.size * 5, (i + 1) * 17 + d.size * 1000);
            }
          } else if (d.life <= 0) {
            d.live = false;
          }
          if (d.live) {
            const t = clamp(d.life / Math.max(d.max, 1e-4), 0, 1);
            dropDummy.position.set(d.x, d.y, d.z);
            dropDummy.rotation.set(d.spin, d.spin * 0.7, 0);
            // 竖着拉长：高速飞出的血滴在体素里也该是「一道」，不是「一颗方糖」。
            // 速度越快拉得越长，落定后自然回到方块。
            const sp = Math.hypot(d.vx, d.vy, d.vz);
            const k = d.size * (0.45 + 0.55 * Math.pow(t, 0.4));
            dropDummy.scale.set(k * 0.75, k * (1 + Math.min(2.2, sp * 0.28)), k * 0.75);
          } else {
            dropDummy.position.set(0, -999, 0);
            dropDummy.scale.setScalar(0);
          }
        }
        dropDummy.updateMatrix();
        dropMesh.setMatrixAt(i, dropDummy.matrix);
      }
      dropMesh.instanceMatrix.needsUpdate = true;

      // 3) 血雾：放大 + 淡出
      for (const m of mists) {
        if (m.life <= 0) continue;
        m.life -= dts;
        const t = clamp(m.life / Math.max(m.max, 1e-4), 0, 1);
        const k = 1 - t;
        m.mesh.scale.setScalar(m.from + (m.to - m.from) * Math.sqrt(k));
        m.mat.opacity = m.opacity * Math.pow(t, 0.7);
        if (m.life <= 0) m.mesh.visible = false;
      }

      // 4) 地面血迹：先浓后淡（前 40% 保持，之后线性）
      for (const s of stains) {
        if (s.life <= 0) continue;
        s.life -= dts;
        const t = clamp(s.life / Math.max(s.max, 1e-4), 0, 1);
        s.mat.opacity = s.opacity * clamp((t - 0.15) / 0.85, 0, 1);
        if (s.life <= 0) s.mesh.visible = false;
      }
    },

    debug() {
      return {
        bursts,
        drops: drops.filter((d) => d.live).length,
        stains: stains.filter((s) => s.life > 0).length,
        lastSeq,
      };
    },

    dispose(): void {
      dropGeo.dispose();
      dropMat.dispose();
      mistGeo.dispose();
      stainGeo.dispose();
      for (const m of mists) m.mat.dispose();
      for (const s of stains) s.mat.dispose();
      scene.remove(group);
    },
  };
}
