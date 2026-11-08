import * as THREE from 'three';
import type { ViewConfig, World } from '../core';
import { FX_ORDER } from './fx-layer';

/**
 * 一次性贴地光环（冲刺尘环 / 派生招光环 / 大剑击地尘环）的统一池化。
 *
 * 从 `three-scene.ts` 抽出。抽之前这三段是**三份复制**：都是「定长池 + spawn 找空位 +
 * 每帧衰减 + 到期隐藏」，只有峰值透明度、缩放曲线与几何不同。
 * 这里把差异收进 `PoolSpec`，把「什么时候触发」收进 `update()`：
 * 触发一律读 Core 的**持久字段**（`dash.id` / `playerLink.id` / `combat.slamAttackId`），
 * 不读事件队列 —— step 每帧开头清空事件，低帧率一帧多步时只有最后一步的事件会留下。
 *
 * 层级：三者都属于「贴地」层（`FX_ORDER.groundFx`），击地尘环 +1 压在普通尘环之上。
 */

type Entry = {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  base: number;
  delay: number;
};

type PoolSpec = {
  count: number;
  geometry: THREE.BufferGeometry;
  color: string;
  blending?: THREE.Blending;
  renderOrder: number;
  duration: number;
  /** 峰值不透明度 */
  peak: number;
  /** opacity = peak × t^fadePow（t = 剩余寿命比） */
  fadePow: number;
  /** scale  = base × (scaleFrom + scaleSpan × (1 − t^growPow)) */
  scaleFrom: number;
  scaleSpan: number;
  growPow: number;
  /** 相对地面的抬高，避免与地面 z-fighting */
  yOffset: number;
  /** spawn 瞬间的不透明度（击地环先置 0，等 delay 结束再亮） */
  spawnOpacity: number;
};

type Pool = {
  entries: Entry[];
  spawn(x: number, z: number, fromY: number, scale: number, opts?: { color?: string; delay?: number }): void;
  update(dt: number): void;
  live(): Entry[];
  dispose(): void;
};

function makePool(
  scene: THREE.Scene,
  spec: PoolSpec,
  groundY: (x: number, z: number, fromY: number) => number,
): Pool {
  const entries: Entry[] = Array.from({ length: spec.count }, () => {
    const mat = new THREE.MeshBasicMaterial({
      color: spec.color,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      ...(spec.blending ? { blending: spec.blending } : {}),
    });
    const mesh = new THREE.Mesh(spec.geometry, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = spec.renderOrder;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, life: 0, base: 1, delay: 0 };
  });

  return {
    entries,
    spawn(x, z, fromY, scale, opts) {
      const r = entries.find((e) => e.life <= 0) ?? entries[0];
      if (opts?.color) r.mat.color.set(opts.color);
      r.mesh.position.set(x, groundY(x, z, fromY) + spec.yOffset, z);
      r.base = scale;
      r.mesh.scale.setScalar(scale * spec.scaleFrom);
      r.mesh.visible = true;
      r.mat.opacity = spec.spawnOpacity;
      r.life = spec.duration;
      r.delay = opts?.delay ?? 0;
    },
    update(dt) {
      for (const r of entries) {
        if (r.life <= 0) continue;
        if (r.delay > 0) {
          r.delay -= dt;
          continue;
        }
        r.life -= dt;
        const t = Math.max(0, r.life / Math.max(spec.duration, 1e-6));
        r.mesh.scale.setScalar(r.base * (spec.scaleFrom + spec.scaleSpan * (1 - Math.pow(t, spec.growPow))));
        r.mat.opacity = spec.peak * Math.pow(t, spec.fadePow);
        if (r.life <= 0) r.mesh.visible = false;
      }
    },
    live() {
      return entries.filter((r) => r.life > 0);
    },
    dispose() {
      for (const r of entries) r.mat.dispose();
    },
  };
}

export type BurstFx = {
  /** 每帧：先按 Core 的持久 id 补触发，再推进各自的生命周期 */
  update(w: World, dt: number, shake: (amount: number) => void): void;
  /** 大剑击地尘环读数（验收 / 调试面板） */
  slamDebug(): { spawns: number; lastId: number; live: { life: number; scale: number; opacity: number; visible: boolean }[] };
  /** 贴地层的基础序号，供 `fxDebug()` 校验排序链 */
  groundOrder(): number;
  /** 当前活跃的冲刺 / 派生招 / 击地层数 */
  activeDash(): number;
  /** 最近一次冲刺的种类（`none` / `roll` / `blink`），供 `renderDebug()` 读数 */
  dashKind(): string;
  dispose(): void;
};

export function createBurstFx(
  scene: THREE.Scene,
  view: ViewConfig,
  world: World,
  groundY: (x: number, z: number, fromY: number) => number,
): BurstFx {
  const dashFx = view.dash;
  const dashSpec: PoolSpec = {
    count: 6,
    geometry: new THREE.RingGeometry(dashFx.ringRadius - 0.06, dashFx.ringRadius, 28),
    color: '#ffffff',
    renderOrder: FX_ORDER.groundFx,
    duration: dashFx.fxDuration,
    peak: 0.9,
    fadePow: 1,
    scaleFrom: 0.6,
    scaleSpan: 1.2,
    growPow: 1,
    yOffset: 0.04,
    spawnOpacity: 0.9,
  };
  const dash = makePool(scene, dashSpec, groundY);

  const linkFx = view.links;
  const linkSpec: PoolSpec = {
    count: 5,
    geometry: new THREE.RingGeometry(linkFx.ringRadius - 0.07, linkFx.ringRadius, 28),
    color: linkFx.chargeColor,
    renderOrder: FX_ORDER.groundFx,
    duration: linkFx.fxDuration,
    peak: 0.85,
    fadePow: 1,
    scaleFrom: 0.55,
    scaleSpan: 1.1,
    growPow: 1,
    yOffset: 0.05,
    spawnOpacity: 0.85,
  };
  const link = makePool(scene, linkSpec, groundY);

  // 击地尘环：环带做厚（22% 半径宽）+ 加色混合 —— 太细会和脚下「八向指示环」糊在一起，
  // 玩家要能一眼看出「这是砸出来的，不是 UI」。
  const slamFx = view.groundSlam;
  const slamSpec: PoolSpec = {
    count: 4,
    geometry: new THREE.RingGeometry(0.78, 1, 56),
    color: slamFx.color,
    blending: THREE.AdditiveBlending,
    renderOrder: FX_ORDER.groundFx + 1,
    duration: slamFx.duration,
    peak: 0.85,
    // 先快后慢：前 30% 冲出大半半径，之后缓下来收尾，读作「冲击」而不是「匀速放大」
    fadePow: 1.3,
    scaleFrom: 0.35,
    scaleSpan: 0.65,
    growPow: 1.8,
    yOffset: 0.035,
    spawnOpacity: 0,
  };
  const slam = makePool(scene, slamSpec, groundY);

  let lastDashId = world.dash.id;
  let lastDashKind = 'none';
  let lastLinkId = world.playerLink.id;
  let lastLinkHits = world.playerLink.hitIds.length;
  let lastSlamId = world.combat.slamAttackId;
  let slamSpawns = 0;

  return {
    update(w, dt, shake) {
      const c = w.character;

      // 冲刺 / 闪避：翻滚在起点放一圈；闪现在起点 + 落点各放一圈（落点更大更亮）
      if (w.dash.id !== lastDashId) {
        lastDashId = w.dash.id;
        const d = w.dash;
        lastDashKind = d.kind;
        if (d.kind === 'blink') {
          dash.spawn(d.fromX, d.fromZ, c.position.y, 0.9, { color: dashFx.blinkColor });
          dash.spawn(d.toX, d.toZ, c.position.y, 1.35, { color: dashFx.blinkColor });
        } else {
          dash.spawn(d.fromX, d.fromZ, c.position.y, 1.1, { color: dashFx.rollColor });
        }
      }
      dash.update(dt);

      // 大剑第三击落地：尘环半径取 Core 的判定半径 —— 圈边就是真实判定边界，玩家能「看着圈躲」
      if (w.combat.slamAttackId !== lastSlamId) {
        lastSlamId = w.combat.slamAttackId;
        slamSpawns += 1;
        if (slamFx.enabled) {
          const gs = w.config.combat.weapons[w.combat.weapon]?.groundSlam;
          const rad = Math.max(0.6, gs?.radius ?? 2.2);
          slam.spawn(c.position.x, c.position.z, c.position.y, rad, { delay: 0 });
          slam.spawn(c.position.x, c.position.z, c.position.y, rad * slamFx.outerScale, { delay: slamFx.delay });
          shake(slamFx.shake);
        }
      }
      slam.update(dt);

      // 派生招：起手 / 命中各一圈
      const lk = w.playerLink;
      if (lk.id !== lastLinkId) {
        lastLinkId = lk.id;
        lastLinkHits = lk.hitIds.length;
        link.spawn(c.position.x, c.position.z, c.position.y, 1.0);
      }
      if (lk.hitIds.length > lastLinkHits) {
        lastLinkHits = lk.hitIds.length;
        link.spawn(c.position.x, c.position.z, c.position.y, 1.35);
      } else if (lk.hitIds.length < lastLinkHits) {
        lastLinkHits = lk.hitIds.length;
      }
      link.update(dt);
    },

    slamDebug() {
      return {
        spawns: slamSpawns,
        lastId: lastSlamId,
        live: slam.live().map((r) => ({
          life: r.life, scale: r.mesh.scale.x, opacity: r.mat.opacity, visible: r.mesh.visible,
        })),
      };
    },

    groundOrder() {
      return slam.entries[0]?.mesh.renderOrder ?? FX_ORDER.groundFx + 1;
    },

    activeDash() {
      return dash.live().length;
    },

    dashKind() {
      return lastDashKind;
    },

    dispose() {
      dash.dispose();
      link.dispose();
      slam.dispose();
      for (const g of [dashSpec.geometry, linkSpec.geometry, slamSpec.geometry]) g.dispose();
    },
  };
}
