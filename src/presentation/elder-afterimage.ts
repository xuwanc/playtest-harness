import * as THREE from 'three';
import type { AfterimageViewConfig } from '../core/types';

/**
 * 角色移动残影 · 克隆 ghost 池方案（v9s.56 / v9s.57 / v9s.58，纯表现层）。
 *
 * 做什么：移动时按节流间隔浅克隆一次 rig 顶层 group，冻结在生成时刻的世界位姿，
 * 整体换成半透明材质、按年龄淡出后回收到对象池。作用于 `cfg.bodyTypes`
 * （空 = 所有角色；v9s.56 在老头 `elder` 上验证，但设计上不绑定某个角色）。
 *
 * v9s.57 增强（纯表现，不碰 Core）：
 *  - `spacing`：相邻残影最小世界间距，把残影「拉一点距离」避免过密；
 *  - `fragment` / `fragmentExp` / `fragmentStart` / `fragmentSpin`：残影随年龄沿
 *    固定随机方向散开 + 各自自转，读感即「随时间流逝变碎裂无序化」。散开方向在
 *    生成时定死（确定性 PRNG），只随年龄放大，不会逐帧抖。
 *
 * v9s.58 性能修复（掉帧根因）：
 *  旧实现每次生成都 `target.clone(true)` 把整棵 rig 浅克隆一遍、再为每个 mesh
 *  `new MeshBasicMaterial`，过期又 dispose —— 体素角色几十上百个 mesh，移动时每
 *  0.09s 一次，产生海量短命对象 + GC 抖动 → 掉帧。
 *  新实现：每个对象池槽位**只在首次使用时克隆一次整棵 rig**，之后只把当前角色姿态
 *  回写进已克隆的树（复制局部 transform，零分配），并复用首次创建的私有材质；
 *  仅当角色 rig 整体被替换（换 bodyType）时才重新克隆。稳态下生成残影 = 0 分配。
 *
 * 为什么这么做（而不是后处理 / RT 反馈）：
 *  - 纯表现：不碰主渲染循环、不引入 EffectComposer / RenderTarget，降级风险小；
 *  - 只作用于目标角色：残影是「过去的角色」，克隆整棵树天然只影响它，不会糊全屏；
 *  - 与已有 `weapon-trail` 一个范式：`createX(cfg)` 返回 `{ container, update, reset, debug, dispose }`。
 *
 * 不读 World、不写 Core。
 */

export type Afterimage = {
  /** 所有残影挂在这个空 Group 下，调用方把它加进场景即可 */
  container: THREE.Group;
  update(dt: number, target: THREE.Object3D, root: THREE.Object3D, moving: boolean, bodyId: string): void;
  /** 立即清空所有残影（换角色 / 关闭时调用，避免旧残影滞留） */
  reset(): void;
  /** 诊断读数，供验收 / 调试面板 */
  debug(): { count: number; active: number; spawning: boolean };
  dispose(): void;
};

type Pair = {
  /** 活动角色侧的对应 mesh（局部 transform 每帧被读取） */
  live: THREE.Object3D;
  /** 克隆树里的对应 mesh（局部 transform 被改写为残影姿态） */
  clone: THREE.Object3D;
  /** 本次生成时定格的局部位置（碎裂偏移的基准，持久向量、每生成覆写） */
  basePos: THREE.Vector3;
  /** 本次生成时定格的局部朝向（自转的基准，持久向量、每生成覆写） */
  baseQuat: THREE.Quaternion;
  /** 该槽位固定的随机散开方向（确定性种子，生成间不变） */
  dir: THREE.Vector3;
  /** 该槽位固定的随机自转轴（确定性种子，生成间不变） */
  spin: THREE.Vector3;
};

type Ghost = {
  holder: THREE.Group;
  /** 克隆出来的整棵残影树（首次使用时构建，之后复用） */
  snap: THREE.Object3D | null;
  /** 本槽位私有的半透明材质（首次构建时创建，之后复用） */
  mats: THREE.MeshBasicMaterial[];
  /** 活动角色 / 克隆 mesh 的并行配对，用于回写变换与碎裂 */
  pairs: Pair[];
  age: number;
  active: boolean;
  /** 确定性种子，决定本槽位散开 / 自转方向 */
  seed: number;
  /** 本槽位克隆所基于的活动 rig 引用；变了就重建克隆（换 bodyType 兜底） */
  builtFor: THREE.Object3D | null;
};

/** mulberry32：小体积确定性 PRNG，避免依赖 Math.random 的不可复现 */
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randUnitVec(rnd: () => number, out: THREE.Vector3): THREE.Vector3 {
  const u = rnd() * 2 - 1;
  const theta = rnd() * Math.PI * 2;
  const s = Math.sqrt(Math.max(0, 1 - u * u));
  return out.set(s * Math.cos(theta), u, s * Math.sin(theta));
}

const _q = new THREE.Quaternion();
const _dir = new THREE.Vector3();
const _spin = new THREE.Vector3();

export function createAfterimage(cfg: AfterimageViewConfig): Afterimage {
  const container = new THREE.Group();
  container.name = 'afterimage-ghost';

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

  /** 取一个复用的槽：优先空闲的，否则回收最老（age 最大）的活动残影 */
  function acquire(): Ghost {
    let free = ghosts.find((g) => !g.active);
    if (free) return free;
    let oldest = ghosts[0];
    for (const g of ghosts) if (g.age > oldest.age) oldest = g;
    return oldest;
  }

  /** 清空一个槽的旧内容并释放其私有材质（重建前调用） */
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

  /** 把原材质替换成私有半透明副本（同原材质只建一份），并登记进本槽材质表 */
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
      const mat = new THREE.MeshBasicMaterial({
        color: base.clone(),
        transparent: true,
        opacity: cfg.baseOpacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      matMap.set(m, mat);
      g.mats.push(mat);
      return mat;
    };
    mesh.material = Array.isArray(src) ? src.map(make) : make(src);
  }

  /** 首次使用 / rig 被替换时：浅克隆整棵 rig 一次，建好配对与私有材质表 */
  function buildSnapshot(g: Ghost, target: THREE.Object3D): void {
    clearSlot(g);
    const snap = target.clone(true); // 共享几何体与原材质引用，仅复制变换；建一次、长期复用
    const matMap = new Map<THREE.Material, THREE.MeshBasicMaterial>();
    const tintColor = new THREE.Color(cfg.color);
    const rnd = mulberry32(g.seed);

    // 根若是 mesh，也要换私有材质（但不进 pairs：根的世界位姿单独处理）
    if ((snap as unknown as { isMesh?: boolean }).isMesh) {
      replaceMeshMaterial(snap as THREE.Mesh, matMap, tintColor, g);
    }

    const walk = (live: THREE.Object3D, clone: THREE.Object3D): void => {
      const lm = live as THREE.Mesh;
      const cm = clone as THREE.Mesh;
      if (lm.isMesh && cm.isMesh) {
        replaceMeshMaterial(cm, matMap, tintColor, g);
        g.pairs.push({
          live: lm,
          clone: cm,
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

  /** 把当前角色姿态回写进本槽已克隆的树（零分配：只复制 transform + 覆写基准向量） */
  function resync(g: Ghost, target: THREE.Object3D): void {
    const snap = g.snap!;
    target.updateWorldMatrix(true, true);
    snap.matrixAutoUpdate = false;
    snap.matrix.copy(target.matrixWorld); // 根固定为世界位姿：残影是冻结在生成时刻的整体外形
    snap.renderOrder = 1;                 // 角色默认 0，残影叠在角色之后
    for (const p of g.pairs) {
      const lm = p.live;
      const cm = p.clone;
      cm.position.copy(lm.position);
      cm.quaternion.copy(lm.quaternion);
      cm.scale.copy(lm.scale);
      // 本次生成定格的基准：碎裂偏移从此出发，避免沿用上一轮残留偏移
      p.basePos.copy(cm.position);
      p.baseQuat.copy(cm.quaternion);
    }
  }

  function spawn(target: THREE.Object3D): void {
    const g = acquire();
    if (g.builtFor !== target) buildSnapshot(g, target); // 仅首次 / rig 替换时深克隆
    resync(g, target);
    g.age = 0;
    g.active = true;
    g.holder.visible = true;
  }

  /** 推进所有活动残影的年龄并刷新 opacity / 碎裂；过期则回收 */
  function ageGhosts(dt: number): void {
    const life = Math.max(1e-3, cfg.life);
    const wantFrag = cfg.fragment > 0 || cfg.fragmentSpin > 0;
    const fragStart = Math.min(0.999, Math.max(0, cfg.fragmentStart));
    for (const g of ghosts) {
      if (!g.active || !g.snap) continue;
      g.age += dt;
      const t = g.age / life;
      if (t >= 1) {
        g.active = false;
        g.holder.visible = false;
        clearSlot(g);
        continue;
      }
      const k = Math.max(0, 1 - t) ** cfg.fadeExp;
      const op = cfg.baseOpacity * k;
      for (const m of g.mats) m.opacity = op;

      // 碎裂无序化：超过 fragmentStart 后，子部件沿固定方向散开 + 各自自转，
      // 幅度随年龄按 fragmentExp 增长（越老越碎）。
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

  return {
    container,
    update(dt, target, root, moving, bodyId) {
      if (!cfg.enabled) {
        for (const g of ghosts) {
          if (g.active) {
            g.active = false;
            g.holder.visible = false;
            clearSlot(g);
          }
        }
        return;
      }
      const step = Math.max(0, dt);
      ageGhosts(step);

      // 只给指定角色生残影（空数组 = 所有角色）
      const matched = cfg.bodyTypes.length === 0 || cfg.bodyTypes.includes(bodyId);
      const moved = Math.hypot(
        root.position.x - prevRoot.x,
        root.position.y - prevRoot.y,
        root.position.z - prevRoot.z,
      );
      spawning = false;
      if (matched && moving && moved >= cfg.minMove) {
        spawnTimer += step;
        distSinceSpawn += moved;
        // 时间 + 空间双门槛：既控制密度，又把相邻残影「拉一点距离」
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
      for (const g of ghosts) {
        g.active = false;
        g.holder.visible = false;
        clearSlot(g);
      }
      spawnTimer = 0;
      distSinceSpawn = 0;
    },
    debug() {
      let active = 0;
      for (const g of ghosts) if (g.active) active++;
      return { count: ghosts.length, active, spawning };
    },
    dispose() {
      for (const g of ghosts) clearSlot(g);
      container.clear();
    },
  };
}
