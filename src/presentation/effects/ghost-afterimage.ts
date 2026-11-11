import * as THREE from 'three';
import type { AfterimageViewConfig } from '../../core/types';
import { mulberry32, randUnitVec } from './shared';
import type { AfterimageEffect, AfterimageDebug } from './shared';

/**
 * 残影方案 A · 克隆 ghost 池（v9s.56 → v9s.59，纯表现层）。
 *
 * 移动时按节流间隔把 rig 顶层 group 的**当前姿态**回写进对象池里已克隆的树，
 * 冻结在生成时刻的世界位姿，按年龄淡出后回收。作用于 `cfg.bodyTypes`（空 = 所有角色）。
 *
 * v9s.59 关键改进（对应用户「头被残影交叉面干涉 / 画在角色背后」）：
 *  - 旧实现用 `transparent + depthWrite:false + DoubleSide` 半透明混合。多部件体素 rig
 *    里每个 box 的正反面、多个 ghost 之间、ghost 与角色本体之间全部靠「距离排序」叠，
 *    头部（很多小 mesh 挤在一起）必然出现面片交叉、Z 闪烁、糊成一团。
 *  - 改用 **`alphaHash`（hashed / 随机透明）**：材质进不透明队列、`depthWrite:true`、
 *    `depthTest:true`、`FrontSide`。片元按屏幕哈希抖动决定保留，不做混合 → 天然没有
 *    透明排序与自相交问题，且和角色本体按深度正确遮挡（残影在后面就被挡住）。
 *    这是比「调 renderOrder」更治本的办法。每帧改 `opacity` 依旧驱动抖动密度淡出。
 *  - `behindBias`：生成时把整张快照沿**运动反方向**推一小段，避免刚生成那一帧和角色
 *    本体完全共面，读感即「残影留在角色背后」。方向在生成时固化，不逐帧抖、不需相机。
 *  - `depthMode:'blend'` 可切回旧半透明混合，便于 A/B 对比。
 *
 * 性能（v9s.58 已做，v9s.59 延续）：每个槽位只在首次 / rig 替换时深克隆一次，
 * 稳态生成 = 0 分配；材质按源材质去重复用；碎裂只在 `t>fragmentStart` 后遍历。
 * 纯表现，不读 World、不写 Core、不引入命中。
 */

type Pair = {
  live: THREE.Object3D;
  clone: THREE.Object3D;
  basePos: THREE.Vector3;
  baseQuat: THREE.Quaternion;
  dir: THREE.Vector3;
  spin: THREE.Vector3;
};

type Ghost = {
  holder: THREE.Group;
  snap: THREE.Object3D | null;
  mats: THREE.MeshBasicMaterial[];
  pairs: Pair[];
  age: number;
  active: boolean;
  seed: number;
  builtFor: THREE.Object3D | null;
};

const _q = new THREE.Quaternion();
const _dir = new THREE.Vector3();
const _spin = new THREE.Vector3();
const _moveDir = new THREE.Vector3();

export function createGhostAfterimage(cfg: AfterimageViewConfig): AfterimageEffect {
  const container = new THREE.Group();
  container.name = 'afterimage-ghost';

  const depthMode = cfg.depthMode ?? 'hash'; // 'hash'（默认，治本）| 'blend'（旧混合）
  const behindBias = cfg.behindBias ?? 0.05; // 沿运动反方向后推的米数
  const useHash = depthMode === 'hash';

  const cap = Math.max(1, Math.floor(cfg.maxGhosts));
  const ghosts: Ghost[] = [];
  for (let i = 0; i < cap; i++) {
    const holder = new THREE.Group();
    holder.visible = false;
    container.add(holder);
    ghosts.push({
      holder, snap: null, mats: [], pairs: [],
      age: 0, active: false, seed: (i + 1) * 0x9e37, builtFor: null,
    });
  }

  const prevRoot = new THREE.Vector3();
  let spawnTimer = 0;
  let distSinceSpawn = 0;
  let spawning = false;
  let lastDrawCalls = 0;

  function acquire(): Ghost {
    let free = ghosts.find((g) => !g.active);
    if (free) return free;
    let oldest = ghosts[0];
    for (const g of ghosts) if (g.age > oldest.age) oldest = g;
    return oldest;
  }

  function clearSlot(g: Ghost): void {
    if (g.snap) {
      g.holder.remove(g.snap);
      g.snap = null;
    }
    for (const m of g.mats) m.dispose();
    g.mats = [];
    g.pairs = [];
    g.builtFor = null;
  }

  function replaceMeshMaterial(
    mesh: THREE.Mesh, matMap: Map<THREE.Material, THREE.MeshBasicMaterial>,
    tintColor: THREE.Color, g: Ghost,
  ): void {
    const src = mesh.material;
    const make = (m: THREE.Material): THREE.MeshBasicMaterial => {
      const cached = matMap.get(m);
      if (cached) return cached;
      const base = cfg.tint === 'keep'
        ? (m as unknown as { color?: THREE.Color }).color ?? tintColor
        : tintColor;
      // v9s.59：hash 模式进不透明队列 + 写深度，消除半透明交叉面干涉；
      // blend 模式保留旧的半透明混合作为回退。
      const mat = new THREE.MeshBasicMaterial({
        color: base.clone(),
        opacity: cfg.baseOpacity,
        alphaHash: useHash,
        transparent: !useHash,
        depthWrite: useHash,
        depthTest: true,
        side: useHash ? THREE.FrontSide : THREE.DoubleSide,
      });
      matMap.set(m, mat);
      g.mats.push(mat);
      return mat;
    };
    mesh.material = Array.isArray(src) ? src.map(make) : make(src);
  }

  function buildSnapshot(g: Ghost, target: THREE.Object3D): void {
    clearSlot(g);
    const snap = target.clone(true); // 共享几何体与原材质引用；建一次、长期复用
    const matMap = new Map<THREE.Material, THREE.MeshBasicMaterial>();
    const tintColor = new THREE.Color(cfg.color);
    const rnd = mulberry32(g.seed);

    if ((snap as unknown as { isMesh?: boolean }).isMesh) {
      replaceMeshMaterial(snap as THREE.Mesh, matMap, tintColor, g);
    }

    const walk = (live: THREE.Object3D, clone: THREE.Object3D): void => {
      const lm = live as THREE.Mesh;
      const cm = clone as THREE.Mesh;
      if (lm.isMesh && cm.isMesh) {
        replaceMeshMaterial(cm, matMap, tintColor, g);
        g.pairs.push({
          live: lm, clone: cm,
          basePos: cm.position.clone(),
          baseQuat: cm.quaternion.clone(),
          dir: randUnitVec(rnd, _dir).clone(),
          spin: randUnitVec(rnd, _spin).clone(),
        });
      }
      for (let i = 0; i < live.children.length; i++) {
        const lc = live.children[i];
        const cc = clone.children[i];
        if (lc && cc) walk(lc, cc);
      }
    };
    for (let i = 0; i < target.children.length; i++) {
      const lc = target.children[i];
      const cc = snap.children[i];
      if (lc && cc) walk(lc, cc);
    }

    g.holder.add(snap);
    g.snap = snap;
    g.builtFor = target;
  }

  function resync(g: Ghost, target: THREE.Object3D): void {
    const snap = g.snap!;
    target.updateWorldMatrix(true, true);
    snap.matrixAutoUpdate = false;
    snap.matrix.copy(target.matrixWorld);
    // 沿运动反方向后推，避免与角色本体共面 → 残影留在「背后」
    if (behindBias > 0 && _moveDir.lengthSq() > 0) {
      const e = snap.matrix.elements;
      e[12] -= _moveDir.x * behindBias;
      e[13] -= _moveDir.y * behindBias;
      e[14] -= _moveDir.z * behindBias;
    }
    snap.renderOrder = 1;
    for (const p of g.pairs) {
      const lm = p.live;
      const cm = p.clone;
      cm.position.copy(lm.position);
      cm.quaternion.copy(lm.quaternion);
      cm.scale.copy(lm.scale);
      p.basePos.copy(cm.position);
      p.baseQuat.copy(cm.quaternion);
    }
  }

  function spawn(target: THREE.Object3D): void {
    const g = acquire();
    if (g.builtFor !== target) buildSnapshot(g, target); // 仅首次 / rig 替换时深克隆
    resync(g, target);
    // 槽位复用：把上一轮淡出后的 opacity 复位，保证生成瞬间即满亮度
    for (const m of g.mats) m.opacity = cfg.baseOpacity;
    g.age = 0;
    g.active = true;
    g.holder.visible = true;
  }

  function ageGhosts(dt: number): void {
    const life = Math.max(1e-3, cfg.life);
    const wantFrag = cfg.fragment > 0 || cfg.fragmentSpin > 0;
    const fragStart = Math.min(0.999, Math.max(0, cfg.fragmentStart));
    for (const g of ghosts) {
      if (!g.active || !g.snap) continue;
      g.age += dt;
      const t = g.age / life;
      if (t >= 1) {
        // 过期只隐藏、保留克隆树与私有材质：下次生成直接 resync 复用，稳态 0 分配。
        // 只有 rig 替换（换 bodyType）/ reset / dispose 才真正 clearSlot。
        g.active = false;
        g.holder.visible = false;
        continue;
      }
      const op = cfg.baseOpacity * (Math.max(0, 1 - t) ** cfg.fadeExp);
      for (const m of g.mats) m.opacity = op;
      if (wantFrag && t > fragStart) {
        const ft = Math.min(1, (t - fragStart) / (1 - fragStart));
        const sf = cfg.fragment * ft ** cfg.fragmentExp;
        const spin = cfg.fragmentSpin * ft ** cfg.fragmentExp;
        for (const p of g.pairs) {
          (p.clone.position as THREE.Vector3).copy(p.basePos).addScaledVector(p.dir, sf);
          _q.setFromAxisAngle(p.spin, spin);
          (p.clone.quaternion as THREE.Quaternion).copy(p.baseQuat).multiply(_q);
        }
      }
    }
  }

  function debug(): AfterimageDebug {
    let active = 0;
    let drawCalls = 0;
    for (const g of ghosts) {
      if (g.active) { active++; drawCalls += g.pairs.length + 1; }
    }
    lastDrawCalls = drawCalls;
    return { count: ghosts.length, active, spawning, passes: 0, pixels: 0, drawCalls };
  }

  return {
    container,
    update(dt, target, root, moving, bodyId) {
      if (!cfg.enabled) {
        for (const g of ghosts) {
          if (g.active) { g.active = false; g.holder.visible = false; clearSlot(g); }
        }
        lastDrawCalls = 0;
        return;
      }
      const step = Math.max(0, dt);
      ageGhosts(step);

      const dx = root.position.x - prevRoot.x;
      const dy = root.position.y - prevRoot.y;
      const dz = root.position.z - prevRoot.z;
      const moved = Math.hypot(dx, dy, dz);
      if (moved > 1e-6) _moveDir.set(dx / moved, dy / moved, dz / moved);
      else _moveDir.set(0, 0, 0);

      const matched = cfg.bodyTypes.length === 0 || cfg.bodyTypes.includes(bodyId);
      spawning = false;
      if (matched && moving && moved >= cfg.minMove) {
        spawnTimer += step;
        distSinceSpawn += moved;
        if (spawnTimer >= cfg.spawnInterval && distSinceSpawn >= cfg.spacing) {
          spawnTimer = 0;
          distSinceSpawn = 0;
          spawn(target);
          spawning = true;
        }
      } else {
        spawnTimer = 0;
        distSinceSpawn = 0;
      }
      prevRoot.copy(root.position);
    },
    reset() {
      for (const g of ghosts) { g.active = false; g.holder.visible = false; clearSlot(g); }
      spawnTimer = 0; distSinceSpawn = 0; lastDrawCalls = 0;
    },
    debug,
    dispose() {
      for (const g of ghosts) clearSlot(g);
      container.clear();
      void lastDrawCalls;
    },
  };
}
