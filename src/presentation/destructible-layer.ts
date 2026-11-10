/**
 * v9s.x · 可破坏物件（表现层）。
 *
 * 做两件事：
 *  1) 把 Core 的 `world.destructibles` 画成**方盒**：站立段是一个带斜切顶面的 box
 *     （断面由 cutBoxHeights 解析，法线 = sn，斜切方向由攻击方向决定）；坛子也是方盒。
 *  2) 把每个掉落片段 `Fragment` 画成独立方盒，按它的世界中心 (x,y,z) 与朝向四元数
 *     (qw,qx,qy,qz) 摆 mesh —— 物理全在 Core 的 stepRigid 里，这里只读。
 *
 * 刀刃线段 × 物件轴线段的 3D 最近距离负责命中（同真机口径），命中点 + 挥击方向
 * 经 Intents 进 Core，是否真的挥到仍由 hits.currentMeleeShape 裁决。
 *
 * 状态全在 Core，这里只读；暂停 / 慢放 / 快照回放天然成立。
 */

import * as THREE from 'three';
import { cutBoxHeights, MIN_STAND } from '../core';
import type { BreakHit, DestructibleState } from '../core';

/** 刀刃与物件的相交容差（米）。 */
const BLADE_THICKNESS = 0.14;
const EPS = 1e-6;

type V3 = { x: number; y: number; z: number };
export type BladeLike = { base: V3; tip: V3 };
export type BladePair = { right: BladeLike | null; left: BladeLike | null };

export type DestructibleDebug = {
  count: number;
  broken: number;
  drawCalls: number;
  /** 站立段渲染根节点世界坐标。 */
  positions: Array<{ id: string; x: number; y: number; z: number }>;
  /** 每个物件的掉落片段数。 */
  fragments: Record<string, number>;
  cuts: Array<{ id: string; cutU: number; theta: number; nx: number; ny: number; nz: number }>;
};

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 方盒几何（底面 y=0、轴心 x=z=0）。
 * 底面 + 四个侧壁用本体色（group 0），斜切顶面用切口色（group 1）。
 * 每个面用自己的 4 个顶点（不共享），保证盒棱清晰、法线正确。
 */
function boxPieceGeometry(
  half: number, top: [number, number, number, number],
): THREE.BufferGeometry {
  // 四角顺序：0=BL(-,-) 1=BR(+,-) 2=TR(+,+) 3=TL(-,+)
  const cxs = [-half, half, half, -half];
  const czs = [-half, -half, half, half];
  const pos: number[] = [];
  const tris = (
    a: [number, number, number], b: [number, number, number],
    c: [number, number, number], d: [number, number, number],
  ): void => {
    // 两个三角形 a-b-c, a-c-d（a/b/c/d 为一面的四角，逆时针朝外）
    pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    pos.push(a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2]);
  };
  // 底面（y=0，法线朝下：顺时针）
  const b = cxs.map((x, i) => [x, 0, czs[i]] as [number, number, number]);
  tris(b[0], b[3], b[2], b[1]);
  // 四个侧壁
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const bottom0: [number, number, number] = [cxs[i], 0, czs[i]];
    const bottom1: [number, number, number] = [cxs[j], 0, czs[j]];
    const top0: [number, number, number] = [cxs[i], top[i], czs[i]];
    const top1: [number, number, number] = [cxs[j], top[j], czs[j]];
    tris(bottom0, bottom1, top1, top0);
  }
  // 斜切顶面（切口色）
  const t = cxs.map((x, i) => [x, top[i], czs[i]] as [number, number, number]);
  tris(t[0], t[1], t[2], t[3]);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const verts = pos.length / 3; // 18 顶点：底 6 + 侧壁 24 + 顶 6
  void verts;
  // 分组：0=本体（底 + 侧壁 4×6=24 顶点），1=顶面（6 顶点）
  g.addGroup(0, 30, 0);     // 底 6 + 侧壁 24 = 30
  g.addGroup(30, 6, 1);     // 顶面 6
  g.computeVertexNormals();
  return g;
}

/** 单个掉落片段的视图：躯干（仙人掌分 3 段还原腰身）+ 断口薄片 + 随碎片翻滚的侧臂。 */
type FragView = {
  group: THREE.Group;
  trunk: THREE.Mesh[];
  cap: THREE.Mesh;
  parts: THREE.Mesh[];
};

type Piece = {
  id: string;
  root: THREE.Group;
  standing: THREE.Group;
  /** 旗杆 / 仙人掌躯干用的斜切方盒 mesh；坛子 / 按钮为 null。 */
  standingMesh: THREE.Mesh | null;
  /** 掉落片段组：直接挂在 object（原点）下，用世界坐标摆放，避免被 root 偏移叠加。 */
  fragGroup: THREE.Group;
  fragViews: FragView[];
  bodyMat: THREE.MeshLambertMaterial;
  capMat: THREE.MeshLambertMaterial;
  /** v9s.60：主干的暗色段（仙人掌分段用，别的物件不用） */
  key: string;
};

/** 3D 两线段最近点（Ericson, Real-Time Collision Detection §5.1.9）。 */
function closestSegSeg(p0: V3, p1: V3, q0: V3, q1: V3): { dist: number; cq: V3 } {
  const d1 = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
  const d2 = { x: q1.x - q0.x, y: q1.y - q0.y, z: q1.z - q0.z };
  const r = { x: p0.x - q0.x, y: p0.y - q0.y, z: p0.z - q0.z };
  const dot = (a: V3, b: V3): number => a.x * b.x + a.y * b.y + a.z * b.z;
  const a = dot(d1, d1);
  const e = dot(d2, d2);
  const f = dot(d2, r);
  let s = 0;
  let t = 0;
  if (a <= EPS && e <= EPS) {
    s = 0; t = 0;
  } else if (a <= EPS) {
    s = 0; t = clamp(f / e, 0, 1);
  } else {
    const c = dot(d1, r);
    if (e <= EPS) {
      t = 0; s = clamp(-c / a, 0, 1);
    } else {
      const b = dot(d1, d2);
      const denom = a * e - b * b;
      s = denom !== 0 ? clamp((b * f - c * e) / denom, 0, 1) : 0;
      t = (b * s + f) / e;
      if (t < 0) { t = 0; s = clamp(-c / a, 0, 1); }
      else if (t > 1) { t = 1; s = clamp((b - c) / a, 0, 1); }
    }
  }
  const cp = { x: p0.x + d1.x * s, y: p0.y + d1.y * s, z: p0.z + d1.z * s };
  const cq = { x: q0.x + d2.x * t, y: q0.y + d2.y * t, z: q0.z + d2.z * t };
  return { dist: Math.hypot(cp.x - cq.x, cp.y - cq.y, cp.z - cq.z), cq };
}

/** v9s.60 · 一条判定轴（线段 + 半径）。 */
type HitSeg = { a: V3; b: V3; r: number };

/**
 * v9s.60 · 物件的判定轴。
 *
 * 旧版只按「主干竖轴 + radius」判定，仙人掌的侧臂伸出主干 0.34m 却完全没有判定 ——
 * 玩家挥到胳膊上不掉东西，读作「砍不到」。现在侧臂有自己的水平段与上扬段，
 * 判的就是玩家眼睛看到的那几段形状。
 */
function hitSegments(st: DestructibleState): HitSeg[] {
  const out: HitSeg[] = [];
  const full = st.kind === 'pole' || st.kind === 'cactus' ? st.standU : 1;
  out.push({
    a: { x: st.x, y: st.y, z: st.z },
    b: { x: st.x, y: st.y + full * st.height, z: st.z },
    r: st.radius,
  });
  if (st.kind !== 'cactus') return out;
  for (const arm of st.arms) {
    if (arm.atU > st.standU + 1e-4) continue;   // 已随断块飞走的侧臂不再判定
    const baseY = st.y + arm.atU * st.height;
    const sx = st.x + arm.dx * st.radius;
    const sz = st.z + arm.dz * st.radius;
    const tx = st.x + arm.dx * (st.radius + arm.outLen);
    const tz = st.z + arm.dz * (st.radius + arm.outLen);
    out.push({ a: { x: sx, y: baseY, z: sz }, b: { x: tx, y: baseY, z: tz }, r: arm.rad });
    out.push({
      a: { x: tx, y: baseY, z: tz },
      b: { x: tx, y: baseY + arm.upLen, z: tz },
      r: arm.rad,
    });
  }
  return out;
}

export type DestructibleLayer = {
  object: THREE.Group;
  update(next: readonly DestructibleState[]): void;
  computeHits(next: readonly DestructibleState[], blades: BladePair): BreakHit[];
  debug(): DestructibleDebug;
  dispose(): void;
};

/**
 * 坛子的「罐子」造型：用一层层薄方盒堆叠出罐身轮廓
 * （瓶身粗 → 收肩 → 细颈 → 外翻唇口），全部方盒（与整体 box 风格一致），
 * 确定性、只读 st.radius / st.height。顶层一两片用切口色高亮成「唇口」。
 */
function buildJarTiers(
  st: DestructibleState, group: THREE.Group,
  bodyMat: THREE.Material, capMat: THREE.Material, unit: THREE.BufferGeometry,
): void {
  const R = st.radius;
  const H = st.height;
  const M = 14; // 堆叠层数
  // 罐子轮廓：t=0 底 → 1 顶，返回该高度处方盒横截面半边长
  const profile = (t: number): number => {
    if (t < 0.60) return R * 0.95;                                  // 罐身
    if (t < 0.78) {                                                 // 收肩
      const k = (t - 0.60) / 0.18;
      return R * (0.95 + (0.55 - 0.95) * k);
    }
    if (t < 0.92) return R * 0.52;                                  // 细颈
    const k = (t - 0.92) / 0.08;                                    // 外翻唇口
    return R * (0.52 + (0.70 - 0.52) * k);
  };
  const hSlab = H / M;
  for (let i = 0; i < M; i++) {
    const tc = (i + 0.5) / M;
    const w = profile(tc);
    const m = new THREE.Mesh(unit, i >= M - 2 ? capMat : bodyMat);
    m.scale.set(w * 2, hSlab, w * 2);
    m.position.set(0, (i + 0.5) * hSlab, 0);
    group.add(m);
  }
}

/**
 * 仙人掌：**一根直柱 + 两条 L 形侧臂**。
 *
 * v9s.61 简化。上一版为了「不像旗杆」加了 6 段收腰、明暗交替、每段错位旋转 ——
 * 结果是碎：亮暗条纹把它读成一摞小方块，错位让轮廓毛刺，侧臂三段折线像插上去的积木。
 *
 * 抓形只留三个特征：**直、粗、两臂**。
 *  - 主干 4 段，`w = R(0.90 + 0.12·sin(πt))` —— 中段略粗，肉眼是一条柱；
 *  - 统一本色，不交替（体积感交给光照，不交给条纹）；
 *  - 侧臂两段：伸出（粗）+ 上扬（细），末端一个小方头，转角不做过渡。
 *
 * 断面仍然只切最上一段（斜切口），破坏逻辑一行没动。
 */
function buildCactusStanding(
  st: DestructibleState, group: THREE.Group,
  bodyMat: THREE.Material, capMat: THREE.Material,
  unit: THREE.BufferGeometry,
): void {
  const R = st.radius;
  const H = st.height;
  const standH = Math.max(0.02, st.standU * H);
  const N = 4;
  const segH = standH / N;
  // 视觉半径略小于碰撞半径（碰撞盒按 R 建）：柱身太粗就读成「绿柱子」，不是仙人掌
  const VR = R * 0.82;
  // 只有被砍过才显示浅色斜切面；完整站立时顶端是同色的（仙人掌的顶是长出来的，不是切出来的）
  const cut = st.standU < 0.999;

  // 斜切顶面只作用于最后一段：cutBoxHeights 给的是整株高度，换成段内相对高度
  const top = cutBoxHeights(R, st.standU, H, st.snx, st.sny, st.snz);
  const baseOfLast = (N - 1) * segH;
  const relTop = top.map((h) => Math.max(0.002, Math.min(segH, h - baseOfLast))) as
    [number, number, number, number];

  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    // 中段略粗、两端略收：读起来是「柱状仙人掌」，不是一根均匀的杆
    const w = VR * (0.90 + 0.12 * Math.sin(Math.PI * t));
    if (i === N - 1) {
      const cap = new THREE.Mesh(
        boxPieceGeometry(w, relTop),
        cut ? [bodyMat, capMat] : [bodyMat, bodyMat],
      );
      cap.position.y = baseOfLast;
      group.add(cap);
    } else {
      const m = new THREE.Mesh(unit, bodyMat);
      m.scale.set(w * 2, segH * 1.02, w * 2);
      m.position.set(0, (i + 0.5) * segH, 0);
      group.add(m);
    }
  }

  // 顶端的圆头：一小块收窄的同色方块，把方柱顶「收圆」（没被砍过才有）
  if (!cut) {
    const topW = VR * 0.62;
    const crown = new THREE.Mesh(unit, bodyMat);
    crown.scale.set(topW * 2, Math.min(VR * 0.42, segH * 0.5), topW * 2);
    crown.position.set(0, standH + Math.min(VR * 0.42, segH * 0.5) * 0.5, 0);
    group.add(crown);
  }

  // 侧臂：伸出 → 上扬 → 方头。两段直角，不加过渡 —— 方块风格里直角反而干净。
  for (const a of st.arms) {
    if (a.atU > st.standU + 1e-4) continue;
    const baseY = a.atU * st.height;
    const alongX = Math.abs(a.dx) > 0.5;
    const thick = a.rad * 1.55;
    const outLen = alongX ? a.outLen : thick;
    const outDep = alongX ? thick : a.outLen;
    const cx = a.dx * (VR + a.outLen / 2);
    const cz = a.dz * (VR + a.outLen / 2);

    const out = new THREE.Mesh(unit, bodyMat);
    out.scale.set(outLen, thick, outDep);
    out.position.set(cx, baseY, cz);
    group.add(out);

    // 上扬段：从伸出段末端往上，略细（真实萨瓜罗的手臂就是这么折的）
    const up = new THREE.Mesh(unit, bodyMat);
    up.scale.set(a.rad * 1.3, a.upLen, a.rad * 1.3);
    up.position.set(
      a.dx * (VR + a.outLen * 0.9),
      baseY + a.upLen * 0.5,
      a.dz * (VR + a.outLen * 0.9),
    );
    group.add(up);

    // 方头：把上扬段顶端加宽一点，收住方角
    const tip = new THREE.Mesh(unit, bodyMat);
    tip.scale.set(a.rad * 1.15, a.rad * 1.15, a.rad * 1.15);
    tip.position.set(
      a.dx * (VR + a.outLen * 0.9),
      baseY + a.upLen,
      a.dz * (VR + a.outLen * 0.9),
    );
    group.add(tip);
  }
}

/** 触发按钮造型：立柱 + 红色圆帽，自身不被破坏。 */
function buildButtonStanding(
  st: DestructibleState, group: THREE.Group,
  bodyMat: THREE.Material, capMat: THREE.Material, unit: THREE.BufferGeometry,
): void {
  const postH = st.height * 0.55;
  const post = new THREE.Mesh(unit, bodyMat);
  post.scale.set(st.radius * 1.6, postH, st.radius * 1.6);
  post.position.set(0, postH / 2, 0);
  group.add(post);
  const cap = new THREE.Mesh(unit, capMat);
  const capR = st.radius * 2.2;
  cap.scale.set(capR * 2, st.height * 0.22, capR * 2);
  cap.position.set(0, postH + st.height * 0.11, 0);
  group.add(cap);
}

/** 清空并据 kind 重建站立几何（pole/仙人掌断面变化、罐子碎裂、按钮恒定）。 */
function buildStanding(
  p: Piece, st: DestructibleState, unit: THREE.BufferGeometry,
): void {
  // 清空旧子节点（释放躯干几何，保留材质引用）
  for (let i = p.standing.children.length - 1; i >= 0; i--) {
    const c = p.standing.children[i];
    if (c instanceof THREE.Mesh && c.geometry !== unit) c.geometry.dispose();
    p.standing.remove(c);
  }
  p.standingMesh = null;
  if (st.kind === 'pole' || st.kind === 'cactus') {
    if (st.kind === 'pole') {
      p.standingMesh = new THREE.Mesh(
        boxPieceGeometry(st.radius, [st.height, st.height, st.height, st.height]),
        [p.bodyMat, p.capMat],
      );
      p.standing.add(p.standingMesh);
    } else {
      buildCactusStanding(st, p.standing, p.bodyMat, p.capMat, unit);
    }
  } else if (st.kind === 'jar') {
    if (st.broken === 0) buildJarTiers(st, p.standing, p.bodyMat, p.capMat, unit);
  } else if (st.kind === 'button') {
    buildButtonStanding(st, p.standing, p.bodyMat, p.capMat, unit);
  }
}

/** 站立几何的重建键：按钮恒定（只建一次），其余随状态变化。 */
function standingKey(st: DestructibleState): string {
  if (st.kind === 'button') return 'const';
  if (st.kind === 'jar') return `${st.broken}`;
  return `${st.standU}|${st.snx}|${st.sny}|${st.snz}`;
}

export function createDestructibleLayer(
  initial: readonly DestructibleState[],
): DestructibleLayer {
  const object = new THREE.Group();
  object.name = 'destructibles';
  const pieces: Piece[] = [];
  let prevRight: V3 | null = null;
  let prevLeft: V3 | null = null;
  const unitBox = new THREE.BoxGeometry(1, 1, 1);

  for (const st of initial) {
    const bodyMat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(st.color), side: THREE.DoubleSide,
    });
    const capMat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(st.cutColor), side: THREE.DoubleSide,
    });
    const standing = new THREE.Group();
    standing.name = `standing-${st.id}`;
    const root = new THREE.Group();
    root.name = `piece-${st.id}`;
    root.position.set(st.x, st.y, st.z);
    root.add(standing);
    // 掉落片段组直接挂在 object（原点）下，用世界坐标摆放，避免被 root 偏移叠加导致飞出画面。
    const fragGroup = new THREE.Group();
    fragGroup.name = `frags-${st.id}`;
    object.add(root);
    object.add(fragGroup);
    const p: Piece = {
      id: st.id, root, standing, standingMesh: null, fragGroup,
      fragViews: [], bodyMat, capMat, key: '',
    };
    buildStanding(p, st, unitBox);
    p.key = standingKey(st);
    pieces.push(p);
  }

  function update(next: readonly DestructibleState[]): void {
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      let st: DestructibleState | undefined;
      for (let j = 0; j < next.length; j++) if (next[j].id === p.id) { st = next[j]; break; }
      if (!st) { p.root.visible = false; p.fragGroup.visible = false; continue; }
      p.fragGroup.visible = true;

      const key = standingKey(st);
      if (key !== p.key) {
        buildStanding(p, st, unitBox);
        p.key = key;
      }
      p.bodyMat.color.set(st.color);
      p.capMat.color.set(st.cutColor);
      p.root.position.set(st.x, st.y, st.z);
      // 坛子碎裂后不再画站立盒；其余（旗杆 / 仙人掌 / 按钮）始终保持（仙人掌是剩余桩体）
      p.standing.visible = !(st.kind === 'jar' && st.broken !== 0);

      // 掉落片段：按数组长度伸缩 FragView 池，逐帧只更新变换（躯干 + 侧臂子盒）
      const frags = st.fragments ?? [];
      const trunkSegs = st.kind === 'cactus' ? 4 : 1;
      while (p.fragViews.length < frags.length) {
        const group = new THREE.Group();
        group.name = `frag-${st.id}-${p.fragViews.length}`;
        // 4 段固定池：仙人掌断块靠分段还原「中段略粗」的柱身，
        // 单块方盒会让断下来的那截突然变成一块砖（原来就是这个问题）。
        const trunk = [
          new THREE.Mesh(unitBox, p.bodyMat),
          new THREE.Mesh(unitBox, p.bodyMat),
          new THREE.Mesh(unitBox, p.bodyMat),
          new THREE.Mesh(unitBox, p.bodyMat),
        ];
        for (const m of trunk) group.add(m);
        const cap = new THREE.Mesh(unitBox, p.capMat);
        group.add(cap);
        p.fragGroup.add(group);
        p.fragViews.push({ group, trunk, cap, parts: [] });
      }
      for (let k = 0; k < p.fragViews.length; k++) {
        const fv = p.fragViews[k];
        if (k >= frags.length) { fv.group.visible = false; continue; }
        const f = frags[k];
        fv.group.visible = true;
        fv.group.position.set(f.x, f.y, f.z);
        fv.group.quaternion.set(f.qx, f.qy, f.qz, f.qw);
        // 分段：宽度按「下 0.88 / 中 1.0 / 上 0.9」收腰，与站立段造型同源
        const W = [0.95, 1, 0.99, 0.93];
        const segH = (f.hy * 2) / trunkSegs;
        for (let s = 0; s < fv.trunk.length; s++) {
          const m = fv.trunk[s];
          if (s >= trunkSegs) { m.visible = false; continue; }
          m.visible = true;
          const k2 = trunkSegs === 1 ? 1 : W[s];
          m.scale.set(f.hx * 2 * k2, segH * 1.02, f.hz * 2 * k2);
          m.position.set(0, -f.hy + segH * (s + 0.5), 0);
        }
        // 断口薄片：砍下来的那一截顶端是浅色，和站立段的切面同色
        fv.cap.visible = true;
        fv.cap.scale.set(f.hx * 2 * 0.92, 0.022, f.hz * 2 * 0.92);
        fv.cap.position.set(0, f.hy - 0.011, 0);
        // 侧臂子盒（仙人掌断块带侧臂）
        const parts = f.parts ?? [];
        while (fv.parts.length < parts.length) {
          const m = new THREE.Mesh(unitBox, p.bodyMat);
          fv.group.add(m);
          fv.parts.push(m);
        }
        for (let pi = 0; pi < fv.parts.length; pi++) {
          const m = fv.parts[pi];
          if (pi >= parts.length) { m.visible = false; continue; }
          const pt = parts[pi];
          m.visible = true;
          m.position.set(pt.x, pt.y, pt.z);
          m.scale.set(pt.hx * 2, pt.hy * 2, pt.hz * 2);
        }
      }
    }
  }

  function computeHits(next: readonly DestructibleState[], blades: BladePair): BreakHit[] {
    const out: BreakHit[] = [];
    const tryBlade = (b: BladeLike | null, which: 'right' | 'left'): void => {
      if (!b) {
        if (which === 'right') prevRight = null; else prevLeft = null;
        return;
      }
      const mid: V3 = {
        x: (b.base.x + b.tip.x) / 2, y: (b.base.y + b.tip.y) / 2, z: (b.base.z + b.tip.z) / 2,
      };
      const prev = which === 'right' ? prevRight : prevLeft;
      if (which === 'right') prevRight = mid; else prevLeft = mid;
      if (!prev) return;

      let dx = b.tip.x - b.base.x;
      let dy = b.tip.y - b.base.y;
      let dz = b.tip.z - b.base.z;
      const vx = mid.x - prev.x, vy = mid.y - prev.y, vz = mid.z - prev.z;
      const len = Math.hypot(vx, vy, vz);
      // 刀身移动足够快时用「实际扫过的方向」：砍断口朝向才跟手（静止时退回刃身方向）
      if (len > 0.002) { dx = vx; dy = vy; dz = vz; }
      const dl = Math.hypot(dx, dy, dz);
      if (dl > EPS) { dx /= dl; dy /= dl; dz /= dl; } else { dx = 0; dy = 0; dz = 1; }

      for (let i = 0; i < next.length; i++) {
        const st = next[i];
        // 已碎裂的坛子 / 砍到只剩底座的旗杆·仙人掌不再作为命中目标；按钮恒可命中（触发用）
        if (st.kind === 'jar' && st.broken !== 0) continue;
        if ((st.kind === 'pole' || st.kind === 'cactus') && st.standU <= MIN_STAND) continue;

        // v9s.60：一个物件可以有**多条判定轴**（仙人掌的侧臂是伸出主干的，
        // 只按主干轴线判定会「明明砍到胳膊却不掉」）。取最近的一条。
        let best: { dist: number; cq: V3 } | null = null;
        let bestR = 0;
        const segs = hitSegments(st);
        for (const s of segs) {
          const r = closestSegSeg(b.base, b.tip, s.a, s.b);
          if (r.dist > s.r + BLADE_THICKNESS) continue;
          if (!best || r.dist - s.r < best.dist - bestR) { best = r; bestR = s.r; }
        }
        if (best) {
          // v9s.60：不再 `break` —— 一刀扫过两株并排的仙人掌，本来就该两株一起断。
          // 去重交给 Core 的 hitArmed（同一段挥砍对同一物件只破一次）。
          out.push({ id: st.id, x: best.cq.x, y: best.cq.y, z: best.cq.z, dx, dy, dz });
        }
      }
    };
    tryBlade(blades.right, 'right');
    tryBlade(blades.left, 'left');
    return out;
  }

  function debug(): DestructibleDebug {
    const cuts: DestructibleDebug['cuts'] = [];
    const positions: DestructibleDebug['positions'] = [];
    const fragments: Record<string, number> = {};
    let broken = 0;
    let drawCalls = 0;
    for (const p of pieces) {
      if (p.root.visible) {
        positions.push({
          id: p.id, x: p.root.position.x, y: p.root.position.y, z: p.root.position.z,
        });
        if (p.standing.visible) drawCalls += 1;
      }
      for (const fv of p.fragViews) {
        if (!fv.group.visible) continue;
        drawCalls += 1; // 躯干
        for (const m of fv.parts) if (m.visible) drawCalls += 1;
      }
    }
    for (const s of lastStates) {
      fragments[s.id] = (s.fragments ?? []).length;
      if (s.broken !== 0) {
        broken += 1;
        cuts.push({ id: s.id, cutU: s.cutU, theta: s.theta, nx: s.nx, ny: s.ny, nz: s.nz });
      }
    }
    return { count: pieces.length, broken, drawCalls, positions, fragments, cuts };
  }

  let lastStates: readonly DestructibleState[] = initial;
  const wrappedUpdate = (next: readonly DestructibleState[]): void => {
    lastStates = next;
    update(next);
  };

  function dispose(): void {
    for (const p of pieces) {
      p.standing.traverse((o) => {
        if (o instanceof THREE.Mesh && o.geometry !== unitBox) o.geometry.dispose();
      });
      for (const fv of p.fragViews) {
        fv.group.traverse((o) => {
          if (o instanceof THREE.Mesh && o.geometry !== unitBox) o.geometry.dispose();
        });
      }
      p.bodyMat.dispose();
      p.capMat.dispose();
    }
    unitBox.dispose();
    object.clear();
  }

  wrappedUpdate(initial);
  return { object, update: wrappedUpdate, computeHits, debug, dispose };
}
