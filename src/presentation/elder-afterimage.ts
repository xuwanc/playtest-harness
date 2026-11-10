import * as THREE from 'three';
import type { AfterimageViewConfig } from '../core/types';

/**
 * 角色移动残影 · 克隆 ghost 池方案（v9s.56 / v9s.57，纯表现层）。
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
  /**
   * 每帧调用。
   * @param dt       真实帧时长（秒），用于残影计时与淡出（暂停时传 0 即冻结）
   * @param target   角色顶层 group（含本帧姿态），残影克隆它
   * @param root     承载角色世界变换的祖先（一般为 playerRoot），用于算位移 + 刷新世界矩阵
   * @param moving   本帧是否「移动够了」（位移 ≥ minMove），只有移动才生成残影
   * @param bodyId   当前 bodyType id，与 cfg.bodyTypes 不匹配时不生成新残影
   */
  update(dt: number, target: THREE.Object3D, root: THREE.Object3D, moving: boolean, bodyId: string): void;
  /** 立即清空所有残影（换角色 / 关闭时调用，避免旧残影滞留） */
  reset(): void;
  /** 诊断读数，供验收 / 调试面板 */
  debug(): { count: number; active: number; spawning: boolean };
  dispose(): void;
};

type Ghost = {
  holder: THREE.Group;
  snap: THREE.Object3D | null;
  mats: THREE.MeshBasicMaterial[];
  age: number;
  active: boolean;
  /** 每个 ghost 一个确定性种子，保证散开方向每次生成稳定、不逐帧抖 */
  seed: number;
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
const _axis = new THREE.Vector3();

export function createAfterimage(cfg: AfterimageViewConfig): Afterimage {
  const container = new THREE.Group();
  container.name = 'afterimage-ghost';

  const cap = Math.max(1, Math.floor(cfg.maxGhosts));
  const ghosts: Ghost[] = [];
  for (let i = 0; i < cap; i++) {
    const holder = new THREE.Group();
    holder.visible = false;
    container.add(holder);
    ghosts.push({ holder, snap: null, mats: [], age: 0, active: false, seed: (i + 1) * 0x9e37 });
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

    const matMap = new Map<THREE.Material, THREE.MeshBasicMaterial>();
    const tintColor = new THREE.Color(cfg.color);
    const rnd = mulberry32(g.seed);
    const dir = new THREE.Vector3();
    const spinAxis = new THREE.Vector3();
    const wantFrag = cfg.fragment > 0 || cfg.fragmentSpin > 0;

    snap.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      // 把原材质替换成私有半透明副本（同原材质只建一份，统一 opacity）
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

      // 碎裂无序化元数据：记录原始局部变换 + 生成时定死的随机方向 / 自转轴
      mesh.userData._basePos = (mesh.position as THREE.Vector3).clone();
      mesh.userData._baseQuat = (mesh.quaternion as THREE.Quaternion).clone();
      if (wantFrag) {
        mesh.userData._dir = randUnitVec(rnd, dir).clone();
        mesh.userData._spinAxis = randUnitVec(rnd, spinAxis).clone();
      }
    });
    // 推进种子，下一次生成拿到不同的散开方向
    g.seed = (g.seed * 1664525 + 1013904223) >>> 0;

    g.holder.add(snap);
    g.snap = snap;
    g.holder.visible = true;
    g.age = 0;
    g.active = true;
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

      // 碎裂无序化：超过 fragmentStart 后，子部件沿固定方向散开 + 自转，
      // 幅度随年龄按 fragmentExp 增长（越老越碎）。
      if (wantFrag && t > fragStart) {
        const ft = Math.min(1, (t - fragStart) / (1 - fragStart));
        const sf = cfg.fragment * ft ** cfg.fragmentExp;
        const spin = cfg.fragmentSpin * ft ** cfg.fragmentExp;
        g.snap.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          const bp = mesh.userData._basePos as THREE.Vector3 | undefined;
          const bq = mesh.userData._baseQuat as THREE.Quaternion | undefined;
          const dir = mesh.userData._dir as THREE.Vector3 | undefined;
          const axis = mesh.userData._spinAxis as THREE.Vector3 | undefined;
          if (bp && dir) (mesh.position as THREE.Vector3).copy(bp).addScaledVector(dir, sf);
          if (bq && axis) {
            _q.setFromAxisAngle(axis, spin);
            (mesh.quaternion as THREE.Quaternion).copy(bq).multiply(_q);
          }
        });
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
