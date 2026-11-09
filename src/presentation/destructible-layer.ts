/**
 * v9s.x · 可破坏物件（表现层）。
 *
 * 只做两件事：
 *  1) 把 Core 的 `world.destructibles` 画成**真实的斜切两段**：解析求每根母线与
 *     切面的交点，重建上下两个闭合网格 + 斜切盖面（cap 法线 = 切面法线 n）。
 *     不是水平切断、不是阶梯拼段、也不是 shader discard —— 断面就是攻击方向
 *     决定的那个倾斜平面。
 *  2) 用刀刃线段与物件轴线段做 3D 最近距离，把「命中点 P + 挥击方向 d」
 *     算成 BreakHit，交给组装层塞进 Intents。Core 仍用 currentMeleeShape 裁决
 *     「这一刀到底有没有挥到」，两边口径同源。
 *
 * 状态全在 Core，这里只读；暂停 / 慢放 / 快照回放天然成立。
 */

import * as THREE from 'three';
import { cutColumnHeights } from '../core';
import type { BreakHit, DestructibleState } from '../core';

/** 截面多边形边数：体素感 + 斜切椭圆足够平滑。 */
const SIDES = 10;
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
  /** 每个物件的渲染根节点世界坐标；用来断言「画在哪里」与 Core 状态一致。 */
  positions: Array<{ id: string; x: number; y: number; z: number }>;
  cuts: Array<{
    id: string;
    cutU: number;
    theta: number;
    nx: number; ny: number; nz: number;
    fall: number;
  }>;
};

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** 非索引三角形拼一段柱体（下环 → 上环 + 可选斜切盖面）。两个 group 分材质。 */
function pieceGeometry(
  radius: number, ringA: number[], ringB: number[], capAt: 'a' | 'b' | 'none',
): THREE.BufferGeometry {
  const n = ringA.length;
  const pos: number[] = [];
  const tri = (a: number[], b: number[], c: number[]): void => {
    pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  };
  const pt = (y: number, i: number): number[] => {
    const phi = (i / n) * Math.PI * 2;
    return [Math.cos(phi) * radius, y, Math.sin(phi) * radius];
  };
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const a0 = pt(ringA[i], i);
    const a1 = pt(ringA[j], j);
    const b0 = pt(ringB[i], i);
    const b1 = pt(ringB[j], j);
    tri(a0, a1, b1);
    tri(a0, b1, b0);
  }
  const sideVerts = n * 6;
  if (capAt !== 'none') {
    const ring = capAt === 'b' ? ringB : ringA;
    let cy = 0;
    for (let i = 0; i < n; i++) cy += ring[i];
    cy /= n;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      tri([0, cy, 0], pt(ring[i], i), pt(ring[j], j));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.addGroup(0, sideVerts, 0);
  if (capAt !== 'none') g.addGroup(sideVerts, n * 3, 1);
  g.computeVertexNormals();
  return g;
}

type Piece = {
  id: string;
  /** 整件的定位节点：局部几何（y 从 0 到 height）全靠它搬到世界坐标。 */
  root: THREE.Group;
  lower: THREE.Mesh;
  upperGroup: THREE.Group;
  upper: THREE.Mesh;
  bodyMat: THREE.MeshLambertMaterial;
  capMat: THREE.MeshLambertMaterial;
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
  return {
    dist: Math.hypot(cp.x - cq.x, cp.y - cq.y, cp.z - cq.z),
    cq,
  };
}

export type DestructibleLayer = {
  object: THREE.Group;
  update(next: readonly DestructibleState[]): void;
  computeHits(next: readonly DestructibleState[], blades: BladePair): BreakHit[];
  debug(): DestructibleDebug;
  dispose(): void;
};

export function createDestructibleLayer(
  initial: readonly DestructibleState[],
): DestructibleLayer {
  const object = new THREE.Group();
  object.name = 'destructibles';
  const pieces: Piece[] = [];
  let prevRight: V3 | null = null;
  let prevLeft: V3 | null = null;

  for (const st of initial) {
    const bodyMat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(st.color), side: THREE.DoubleSide,
    });
    const capMat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(st.cutColor), side: THREE.DoubleSide,
    });
    const lower = new THREE.Mesh(new THREE.BufferGeometry(), [bodyMat, capMat]);
    const upper = new THREE.Mesh(new THREE.BufferGeometry(), [bodyMat, capMat]);
    lower.name = `lower-${st.id}`;
    upper.name = `upper-${st.id}`;
    const upperGroup = new THREE.Group();
    upperGroup.add(upper);
    const root = new THREE.Group();
    root.name = `piece-${st.id}`;
    // 完好态也必须看得见：几何是局部坐标（底面 y=0、轴心 x=z=0），
    // 靠 root 把整件搬到 Core 给的绝对位置；漏了这一步所有物件会叠在世界原点。
    root.position.set(st.x, st.y, st.z);
    root.add(lower, upperGroup);
    object.add(root);
    pieces.push({ id: st.id, root, lower, upperGroup, upper, bodyMat, capMat, key: '' });
  }

  const rebuild = (p: Piece, st: DestructibleState): void => {
    const cutH = st.cutU * st.height;
    const heights = cutColumnHeights(
      st.radius, SIDES, st.cutU, st.height, st.nx, st.ny, st.nz,
    );
    const zeros = new Array<number>(SIDES).fill(0);
    const tops = new Array<number>(SIDES).fill(st.height);
    const lowerG = pieceGeometry(st.radius, zeros, heights, 'b');
    const upperG = pieceGeometry(
      st.radius,
      heights.map((h) => h - cutH),
      tops.map((h) => h - cutH),
      'a',
    );
    p.lower.geometry.dispose();
    p.upper.geometry.dispose();
    p.lower.geometry = lowerG;
    p.upper.geometry = upperG;
  };

  const axis = new THREE.Vector3();

  function update(next: readonly DestructibleState[]): void {
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      let st: DestructibleState | undefined;
      for (let j = 0; j < next.length; j++) {
        if (next[j].id === p.id) { st = next[j]; break; }
      }
      if (!st) { p.upperGroup.visible = false; continue; }

      const key = `${st.broken}|${st.cutU}|${st.theta}|${st.nx}|${st.ny}|${st.nz}`;
      if (key !== p.key) {
        rebuild(p, st);
        p.key = key;
      }
      p.bodyMat.color.set(st.color);
      p.capMat.color.set(st.cutColor);
      // root 承担绝对定位；下半截是 local 坐标，上半截只再抬一个「切面中心」的局部偏移。
      // 两截共用同一个 root，断后不会一截在世界原点、另一截飞到物件坐标。
      p.root.position.set(st.x, st.y, st.z);
      p.upperGroup.visible = st.broken !== 0;
      p.upperGroup.position.set(0, st.cutU * st.height, 0);
      axis.set(st.ax, st.ay, st.az);
      p.upperGroup.quaternion.setFromAxisAngle(axis, st.fall);
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
        x: (b.base.x + b.tip.x) / 2,
        y: (b.base.y + b.tip.y) / 2,
        z: (b.base.z + b.tip.z) / 2,
      };
      const prev = which === 'right' ? prevRight : prevLeft;
      if (which === 'right') prevRight = mid; else prevLeft = mid;
      if (!prev) return;

      // 挥击方向 = 刀刃中点的帧间位移；静止时退回刀身轴线。
      let dx = b.tip.x - b.base.x;
      let dy = b.tip.y - b.base.y;
      let dz = b.tip.z - b.base.z;
      const vx = mid.x - prev.x;
      const vy = mid.y - prev.y;
      const vz = mid.z - prev.z;
      const len = Math.hypot(vx, vy, vz);
      if (len > 0.002) { dx = vx; dy = vy; dz = vz; }
      const dl = Math.hypot(dx, dy, dz);
      if (dl > EPS) { dx /= dl; dy /= dl; dz /= dl; }
      else { dx = 0; dy = 0; dz = 1; }

      const q0: V3 = { x: 0, y: 0, z: 0 };
      const q1: V3 = { x: 0, y: 0, z: 0 };
      for (let i = 0; i < next.length; i++) {
        const st = next[i];
        if (st.broken !== 0) continue;
        q0.x = st.x; q0.y = st.y; q0.z = st.z;
        q1.x = st.x; q1.y = st.y + st.height; q1.z = st.z;
        const r = closestSegSeg(b.base, b.tip, q0, q1);
        if (r.dist > st.radius + BLADE_THICKNESS) continue;
        out.push({
          id: st.id,
          x: r.cq.x, y: r.cq.y, z: r.cq.z,
          dx, dy, dz,
        });
        break; // 一把刀一帧只打断一个物件，避免一次横扫全场地物全断
      }
    };
    tryBlade(blades.right, 'right');
    tryBlade(blades.left, 'left');
    return out;
  }

  function debug(): DestructibleDebug {
    let drawCalls = 0;
    const cuts: DestructibleDebug['cuts'] = [];
    const positions: DestructibleDebug['positions'] = [];
    let broken = 0;
    for (const p of pieces) {
      if (p.lower.visible) drawCalls += 1;
      if (p.upperGroup.visible) drawCalls += 1;
      positions.push({
        id: p.id,
        x: p.root.position.x, y: p.root.position.y, z: p.root.position.z,
      });
    }
    // 断裂读数从 Core 状态取（表现层不另存一份），由 update 的 lastStates 提供。
    for (const s of lastStates) {
      if (s.broken !== 0) {
        broken += 1;
        cuts.push({
          id: s.id, cutU: s.cutU, theta: s.theta,
          nx: s.nx, ny: s.ny, nz: s.nz, fall: s.fall,
        });
      }
    }
    return { count: pieces.length, broken, drawCalls, positions, cuts };
  }

  let lastStates: readonly DestructibleState[] = initial;
  const wrappedUpdate = (next: readonly DestructibleState[]): void => {
    lastStates = next;
    update(next);
  };

  function dispose(): void {
    for (const p of pieces) {
      p.lower.geometry.dispose();
      p.upper.geometry.dispose();
      p.bodyMat.dispose();
      p.capMat.dispose();
    }
    object.clear();
  }

  wrappedUpdate(initial);
  return { object, update: wrappedUpdate, computeHits, debug, dispose };
}
