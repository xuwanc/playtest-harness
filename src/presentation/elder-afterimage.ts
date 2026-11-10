import * as THREE from 'three';
import type { AfterimageViewConfig } from '../core/types';

/**
 * 角色移动残影（v9s.56，纯表现层）。
 *
 * 做什么：老头（默认 bodyType=`elder`）移动时，按节流间隔浅克隆一次 rig 顶层 group，
 * 冻结在生成时刻的世界位姿，整体换成半透明材质、按年龄淡出后回收到对象池。
 *
 * 为什么这么做（而不是后处理 / RT 反馈）：
 *  - 纯表现：不碰主渲染循环、不引入 EffectComposer / RenderTarget，降级风险小；
 *  - 只作用于目标角色：残影是「过去的老头」，克隆整棵树天然只影响它，不会把全屏糊掉；
 *  - 与已有 `weapon-trail` 一个范式：`createX(cfg)` 返回 `{ container, update, reset, debug, dispose }`。
 *
 * 不读 World、不写 Core、不引入随机与本地时间（用传入的 dt 累加年龄）。
 */
export type Afterimage = {
  /** 所有残影挂在这个空 Group 下，调用方把它加进场景即可 */
  container: THREE.Group;
  /**
   * 每帧调用。
   * @param dt       真实帧时长（秒），用于残影计时与淡出（暂停时传 0 即冻结）
   * @param target   角色顶层 group（含本帧姿态），残影克隆它
   * @param root     承载角色世界变换的祖先（一般为 playerRoot），用于算位移 + 刷新世界矩阵
   * @param moving   本帧是否「移动够了」（位移 ≥ minMove），只有移动才生成残影
   * @param bodyId   当前 bodyType id，与 cfg.bodyType 不匹配时不生成新残影
   */
  update(dt: number, target: THREE.Object3D, root: THREE.Object3D, moving: boolean, bodyId: string): void;
  /** 立即清空所有残影（换角色 / 关闭时调用，避免旧残影滞留） */
  reset(): void;
  /** 诊断读数，供验收 / 调试面板 */
  debug(): { count: number; active: number; spawning: boolean };
  dispose(): void;
};

type Ghost = {
  /** 容器（scene 子树），直接加到 `container` 下 */
  holder: THREE.Group;
  /** 克隆出来的快照（冻结的世界矩阵），null 表示空闲槽 */
  snap: THREE.Object3D | null;
  /** 该 ghost 私有半透明材质（按原材质去重），统一控制 opacity */
  mats: THREE.MeshBasicMaterial[];
  age: number;
  active: boolean;
};

export function createAfterimage(cfg: AfterimageViewConfig): Afterimage {
  const container = new THREE.Group();
  container.name = 'elder-afterimage';

  const cap = Math.max(1, Math.floor(cfg.maxGhosts));
  const ghosts: Ghost[] = [];
  for (let i = 0; i < cap; i++) {
    const holder = new THREE.Group();
    holder.visible = false;
    container.add(holder);
    ghosts.push({ holder, snap: null, mats: [], age: 0, active: false });
  }

  const prevRoot = new THREE.Vector3();
  let spawnTimer = 0;
  let spawning = false;

  /** 取一个复用的槽：优先空闲的，否则回收最老（age 最大）的活动残影 */
  function acquire(): Ghost {
    let free = ghosts.find((g) => !g.active);
    if (free) return free;
    let oldest = ghosts[0];
    for (const g of ghosts) if (g.age > oldest.age) oldest = g;
    return oldest;
  }

  /** 清空一个槽的旧内容并释放其私有材质 */
  function clearSlot(g: Ghost): void {
    if (g.snap) {
      g.holder.remove(g.snap);
      g.snap = null;
    }
    for (const m of g.mats) m.dispose();
    g.mats = [];
  }

  function spawn(target: THREE.Object3D): void {
    const g = acquire();
    clearSlot(g);
    // 浅克隆：共享几何体与各部件原材质引用，只复制变换 —— 体素 rig 几十上百个 mesh 也很轻。
    const snap = target.clone(true);
    // 取本帧世界矩阵：调用方已把 playerRoot 位置 / 朝向、rig 局部姿态写好，
    // 这里向上刷新整条父链 + 自身 + 子节点，保证 matrixWorld 是最新的。
    target.updateWorldMatrix(true, true);
    snap.matrixAutoUpdate = false;
    snap.matrix.copy(target.matrixWorld);
    snap.renderOrder = 1; // 角色默认 0，残影叠在角色之后

    // 把原材质替换成私有半透明副本（同原材质只建一份，统一 opacity）
    const matMap = new Map<THREE.Material, THREE.MeshBasicMaterial>();
    const tintColor = new THREE.Color(cfg.color);
    snap.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
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
    });

    g.holder.add(snap);
    g.snap = snap;
    g.holder.visible = true;
    g.age = 0;
    g.active = true;
  }

  /** 推进所有活动残影的年龄并刷新 opacity；过期则回收 */
  function ageGhosts(dt: number): void {
    const life = Math.max(1e-3, cfg.life);
    for (const g of ghosts) {
      if (!g.active) continue;
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
    }
  }

  return {
    container,
    update(dt, target, root, moving, bodyId) {
      if (!cfg.enabled) {
        // 关闭时直接清空，避免残留
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

      // 只给指定角色生残影（缺省空串则所有角色都生）
      const matched = !cfg.bodyType || cfg.bodyType === bodyId;
      const moved = Math.hypot(
        root.position.x - prevRoot.x,
        root.position.y - prevRoot.y,
        root.position.z - prevRoot.z,
      );
      spawning = false;
      if (matched && moving && moved >= cfg.minMove) {
        spawnTimer += step;
        if (spawnTimer >= cfg.spawnInterval) {
          spawnTimer = 0;
          spawn(target);
          spawning = true;
        }
      } else {
        spawnTimer = 0;
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
