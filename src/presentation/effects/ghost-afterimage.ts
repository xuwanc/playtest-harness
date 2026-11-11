import * as THREE from 'three';
import type { AfterimageViewConfig } from '../../core/types';
import { mulberry32, randUnitVec } from './shared';
import type { AfterimageEffect, AfterimageDebug } from './shared';

/**
 * 残影方案 A · 克隆 ghost 池（v9s.56 → v9s.61，纯表现层）。
 *
 * 移动时按节流间隔把 rig 顶层 group 的**当前姿态**回写进对象池里已克隆的树，
 * 冻结在生成时刻的世界位姿，按年龄淡出后回收。作用于 `cfg.bodyTypes`（空 = 所有角色）。
 *
 * v9s.61 关键修复（用户「拖影动画还是上一次持武器的动作」）：
 *  - 角色骨架动画几乎全靠**中间 pivot（THREE.Group）**的旋转驱动
 *    （headPivot / shoulder / elbow / wrist / hip / knee / spineJoints / weaponMount …），
 *    武器切换靠 `setWeapon` 改部件 `visible`。旧实现 `buildSnapshot` 只给 **isMesh 的叶子节点**
 *    建配对、resync 也只回写 mesh 的局部 transform → 所有中间 Group 的姿态永远停在首次
 *    `clone(true)` 那一刻；而 `builtFor === target`（顶层 group 引用稳定）又让它永不重建。
 *    结果：残影姿态永久冻结在第一次生成那一帧，看起来就是「上一次持武器的动作」。
 *  - 现在 `buildSnapshot` 建 `nodes`（全树所有节点，含 Group）用于每帧回写
 *    position / quaternion / scale / **visible**；`pairs` 只保留 mesh，专用于碎裂与材质去重。
 *    碎裂基准 basePos / baseQuat 取「回写后的当前姿态」而非克隆时旧值。
 *  - 加结构签名：rig 结构变化（增删节点，如换体型/换装备）时自动重建克隆树，避免配对错位。
 *
 * 观感（v9s.60）：默认 `lit` 受光柔和半透明，无 alphaHash 颗粒、不过亮；'hash' / 'blend' 供 A/B。
 * 性能（v9s.58 起）：每个槽位只在首次 / rig 替换 / 结构变化时深克隆一次，稳态生成 = 0 分配。
 * 纯表现，不读 World、不写 Core、不引入命中。
 */

type SyncNode = { live: THREE.Object3D; clone: THREE.Object3D };
type Pair = {
  clone: THREE.Object3D;
  basePos: THREE.Vector3;
  baseQuat: THREE.Quaternion;
  dir: THREE.Vector3;
  spin: THREE.Vector3;
};

type Ghost = {
  holder: THREE.Group;
  snap: THREE.Object3D | null;
  mats: THREE.Material[];
  /** 全树节点配对（含 Group/pivot）：每帧回写当前姿态与可见性 */
  nodes: SyncNode[];
  /** 仅 mesh 节点：碎裂与材质替换 */
  pairs: Pair[];
  age: number;
  active: boolean;
  seed: number;
  builtFor: THREE.Object3D | null;
  /** 结构签名：节点数 + mesh 数，变化即重建 */
  signature: string;
};

const _q = new THREE.Quaternion();
const _dir = new THREE.Vector3();
const _spin = new THREE.Vector3();
const _moveDir = new THREE.Vector3();

export function createGhostAfterimage(cfg: AfterimageViewConfig): AfterimageEffect {
  const container = new THREE.Group();
  container.name = 'afterimage-ghost';

  // v9s.60：默认 lit（受光柔和）；hash = 颗粒抖动的旧方案，blend = 最初的双面半透明
  const mode = cfg.depthMode ?? 'lit';
  const useHash = mode === 'hash';
  const brightness = Math.min(1, Math.max(0, cfg.brightness ?? 0.7));
  const behindBias = cfg.behindBias ?? 0.05; // 沿运动反方向后推的米数

  const cap = Math.max(1, Math.floor(cfg.maxGhosts));
  const ghosts: Ghost[] = [];
  for (let i = 0; i < cap; i++) {
    const holder = new THREE.Group();
    holder.visible = false;
    container.add(holder);
    ghosts.push({
      holder, snap: null, mats: [], nodes: [], pairs: [],
      age: 0, active: false, seed: (i + 1) * 0x9e37, builtFor: null, signature: '',
    });
  }

  const prevRoot = new THREE.Vector3();
  let spawnTimer = 0;
  let distSinceSpawn = 0;
  let spawning = false;
  let lastDrawCalls = 0;

  function acquire(): Ghost {
    const free = ghosts.find((g) => !g.active);
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
    g.nodes = [];
    g.pairs = [];
    g.builtFor = null;
    g.signature = '';
  }

  /** 结构签名：只在生成时算（低频，0.09s 一次），用于检测 rig 增删节点 */
  function signatureOf(target: THREE.Object3D): string {
    let n = 0, mesh = 0;
    target.traverse((o) => { n++; if ((o as THREE.Mesh).isMesh) mesh++; });
    return `${n}:${mesh}`;
  }

  function replaceMeshMaterial(
    mesh: THREE.Mesh,
    matMap: Map<THREE.Material, THREE.Material>,
    tintColor: THREE.Color,
    g: Ghost,
  ): void {
    const src = mesh.material;
    const make = (m: THREE.Material): THREE.Material => {
      const cached = matMap.get(m);
      if (cached) return cached;
      const srcColor = (m as unknown as { color?: THREE.Color }).color;
      const base = (cfg.tint === 'keep' ? (srcColor ?? tintColor) : tintColor).clone();
      if (brightness < 1) base.multiplyScalar(brightness);

      let mat: THREE.MeshBasicMaterial | THREE.MeshLambertMaterial;
      if (mode === 'lit') {
        mat = new THREE.MeshLambertMaterial({
          color: base,
          opacity: cfg.baseOpacity,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          side: THREE.FrontSide,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        });
      } else {
        mat = new THREE.MeshBasicMaterial({
          color: base,
          opacity: cfg.baseOpacity,
          alphaHash: useHash,
          transparent: !useHash,
          depthWrite: useHash,
          depthTest: true,
          side: useHash ? THREE.FrontSide : THREE.DoubleSide,
        });
      }
      matMap.set(m, mat);
      g.mats.push(mat);
      return mat;
    };
    mesh.material = Array.isArray(src) ? src.map(make) : make(src);
  }

  function buildSnapshot(g: Ghost, target: THREE.Object3D, sig: string): void {
    clearSlot(g);
    const snap = target.clone(true); // 共享几何体 + 原材质引用；建一次、长期复用
    const matMap = new Map<THREE.Material, THREE.Material>();
    const tintColor = new THREE.Color(cfg.color);
    const rnd = mulberry32(g.seed);

    if ((snap as unknown as { isMesh?: boolean }).isMesh) {
      replaceMeshMaterial(snap as THREE.Mesh, matMap, tintColor, g);
    }

    // v9s.61：遍历**全树**，为所有节点（含 Group/pivot）建同步配对；mesh 额外建碎裂 pair。
    const walk = (live: THREE.Object3D, clone: THREE.Object3D): void => {
      g.nodes.push({ live, clone });
      const lm = live as THREE.Mesh;
      const cm = clone as THREE.Mesh;
      if (lm.isMesh && cm.isMesh) {
        replaceMeshMaterial(cm, matMap, tintColor, g);
        g.pairs.push({
          clone: cm,
          basePos: cm.position.clone(),
          baseQuat: cm.quaternion.clone(),
          dir: randUnitVec(rnd, _dir).clone(),
          spin: randUnitVec(rnd, _spin).clone(),
        });
      }
      // clone(true) 与 live 树 children 一一对应；数量不等时结构签名会先触发重建
      const n = Math.min(live.children.length, clone.children.length);
      for (let i = 0; i < n; i++) {
        const lc = live.children[i];
        const cc = clone.children[i];
        if (lc && cc) walk(lc, cc);
      }
    };
    for (let i = 0; i < Math.min(target.children.length, snap.children.length); i++) {
      const lc = target.children[i];
      const cc = snap.children[i];
      if (lc && cc) walk(lc, cc);
    }

    g.holder.add(snap);
    g.snap = snap;
    g.builtFor = target;
    g.signature = sig;
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

    // v9s.61：把**当前帧**整棵树（含所有 pivot Group）的局部姿态与可见性回写到克隆树。
    // 这是「残影跟随动画 / 武器动作」的关键：中间骨骼节点也同步，不再冻结在首次克隆。
    for (const nd of g.nodes) {
      const c = nd.clone;
      const l = nd.live;
      c.position.copy(l.position);
      c.quaternion.copy(l.quaternion);
      c.scale.copy(l.scale);
      c.visible = l.visible;
    }
    // 碎裂基准取「回写后的当前姿态」，而非克隆时的旧值
    for (const p of g.pairs) {
      p.basePos.copy(p.clone.position);
      p.baseQuat.copy(p.clone.quaternion);
    }
  }

  function spawn(target: THREE.Object3D): void {
    const g = acquire();
    const sig = signatureOf(target);
    // 仅首次 / rig 顶层引用替换 / 结构变化时深克隆
    if (g.builtFor !== target || g.signature !== sig) buildSnapshot(g, target, sig);
    resync(g, target);
    // 槽位复用：把上一轮淡出后的 opacity / 碎裂位移复位
    for (const m of g.mats) m.opacity = cfg.baseOpacity;
    for (const p of g.pairs) {
      p.clone.position.copy(p.basePos);
      p.clone.quaternion.copy(p.baseQuat);
    }
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
