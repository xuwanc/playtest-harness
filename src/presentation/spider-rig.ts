import * as THREE from 'three';
import type {
  CharacterState, ColorConfig, CombatState, HurtState, LinkState, TurnInPlaceState,
} from '../core';

/**
 * v9s.51 · 蜘蛛主角骨架（方案 A：固定相位表 + 每腿两骨闭式解）。
 *
 * 设计依据见 `docs/decisions/ADR-010-spider-locomotion.md`。这里只做三件事：
 *   1) 造型 —— 头胸甲 + 腹柄 + 腹部 + 全部腿根落在头胸甲侧缘；
 *   2) 步态 —— alternating tripod（同侧相邻腿异相），支撑脚世界坐标锁死；
 *   3) 解算 —— 每条腿 = 腿根 yaw + femur/tibia 两骨余弦定理闭式解 + 竖直跗节。
 *
 * 与 `voxel-rig` 的关系：**不复用它的任何动画数据**（它是逐帧程序化解算，没有片段），
 * 但复用同一条原则 —— 姿态完全由 Core 状态推导，表现层不持有独立的逻辑时钟。
 * 位置 / 朝向由外层的 `playerRoot` 承担，本 rig 只负责「腿怎么摆、身体怎么沉」。
 *
 * v9s.51 三项改动（用户手感反馈）：
 *   - **简化**：同色刚性件合并成单个 mesh。零件数 128 → 39，draw call 降 70%，
 *     外形一个像素没变（合并的本来就不相对运动）；
 *   - **步幅加大**：0.45 → 0.60 m，步频上限 7.5 → 6.2 Hz。同样速度下腿摆得更开、
 *     交换更少，脚滑从 20% 降到 0；
 *   - **身体惯性**：前后位移 / 俯仰 / 侧倾 / 腹部甩动全部走二阶临界阻尼弹簧，
 *     而不是跟帧 lerp —— 弹簧有速度项，减速时才会「冲过头再回来」。
 */

// ── 体型常量（米）──────────────────────────────────────────────────────────
/** 髋点全部落在头胸甲侧缘 —— 这是「不像蟑螂」的第一条，别挪到腹部上。 */
const HIP_X = 0.15;
const HIP_Y = -0.032;
const HIP_Z = [0.255, 0.175, 0.095, 0.025];
/** 静止落点（body 局部，y = 0 为地面）：后腿更长、更靠后。 */
// v9s.51：落点随腿长同比外扩 10%。只加长腿不动落点的话，腿会全弯在身体底下，
// 俯视时被背甲整块盖住 —— 上一版截图里 8 条腿就是这么「消失」的。
const FOOT_XZ: [number, number][] = [[0.471, 0.376], [0.530, 0.101], [0.486, -0.185], [0.350, -0.438]];
/**
 * 四对腿的节长：第 4 对最长（真实蜘蛛就是这样）。
 * v9s.51 整体 +8% 而落点不变 —— 腿变长、停止点不动，膝盖自然拱得更高，
 * 同时把「水平余量」撑大到 0.42 m，步幅上限才敢从 0.55 提到 0.70。
 */
const LEGLEN = [
  { L1: 0.410, L2: 0.346 },
  { L1: 0.432, L2: 0.367 },
  { L1: 0.454, L2: 0.389 },
  { L1: 0.497, L2: 0.432 },
];
/** 跗节：竖直落地的那一小段，给「钩爪踩地」的观感。 */
const TARSUS = 0.09;
/** 腿根到重心的大致半径，用于把角速度折算成等效线速度。 */
const SPIN_RADIUS = 0.42;
/** 腹部基准俯仰（负 = 尾部略垂）。 */
const ABD_BASE = 0.045;

const COL = {
  carapace: '#332c47',
  carapaceTop: '#453c60',
  carapaceEdge: '#4d4369',
  abdomen: '#4a3d62',
  leg: '#5d4f82',
  joint: '#8b7ab8',
  tarsus: '#463a63',
  dark: '#1a1626',
  mark: '#6b5a9e',
  eyeMain: '#e0395a',
  eyeSub: '#d4823c',
} as const;

/** 一个盒体：尺寸 + 平移 + 可选欧拉角。合并的最小单位。 */
type Part = readonly [
  w: number, h: number, d: number,
  x: number, y: number, z: number,
  rx?: number, ry?: number, rz?: number,
];

/**
 * 把一组合体合并成单个 BufferGeometry。
 *
 * 为什么不引 `BufferGeometryUtils`：这里只需要 position / normal / index，
 * 手写 40 行就能覆盖，还能省掉一个 examples 依赖进 bundle。
 * 合并的前提是这些盒体**同色且不相对运动** —— 同 group 下的刚性段，合并后
 * 外观与分开渲染逐像素一致，只是 draw call 少一截。
 */
function mergeParts(parts: readonly Part[], colors: readonly string[]): THREE.BufferGeometry {
  const geos = parts.map(([w, h, d, x, y, z, rx = 0, ry = 0, rz = 0]) => {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rx !== 0) g.rotateX(rx);
    if (ry !== 0) g.rotateY(ry);
    if (rz !== 0) g.rotateZ(rz);
    g.translate(x, y, z);
    return g;
  });

  let vTotal = 0;
  let iTotal = 0;
  for (const g of geos) {
    vTotal += g.attributes.position.count;
    iTotal += g.index!.count;
  }
  const pos = new Float32Array(vTotal * 3);
  const nor = new Float32Array(vTotal * 3);
  const col = new Float32Array(vTotal * 3);
  const idx = vTotal > 65535 ? new Uint32Array(iTotal) : new Uint16Array(iTotal);

  const c = new THREE.Color();
  let vo = 0;
  let io = 0;
  geos.forEach((g, gi2) => {
    const vc = g.attributes.position.count;
    pos.set(g.attributes.position.array as Float32Array, vo * 3);
    nor.set(g.attributes.normal.array as Float32Array, vo * 3);
    // 注意：`setStyle` 在 r152+ 已按 ColorManagement 把 sRGB 转到工作空间（线性），
    // 再补一次 `convertSRGBToLinear()` 会转两遍，整只蜘蛛暗三分之一 —— 别加。
    c.setStyle(colors[gi2]);
    for (let v = 0; v < vc; v++) {
      col[(vo + v) * 3] = c.r;
      col[(vo + v) * 3 + 1] = c.g;
      col[(vo + v) * 3 + 2] = c.b;
    }
    const gi = g.index!.array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
    vo += vc;
    io += gi.length;
    g.dispose();
  });

  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingSphere();
  return out;
}

/** 两骨解析 IK：髋→踝的竖直平面内余弦定理，膝盖取上侧解（蜘蛛的折腿轮廓）。 */
function solveLeg(tx: number, ty: number, tz: number, L1: number, L2: number) {
  const f = Math.hypot(tx, tz);        // 水平距离
  const d = -ty;                       // 向下为正
  const yaw = Math.atan2(tx, tz);
  const Dmax = (L1 + L2) * 0.999;
  const Dmin = Math.abs(L1 - L2) + 0.002;
  const raw = Math.hypot(f, d);
  const clamped = raw > Dmax || raw < Dmin;
  const D = Math.min(Math.max(raw, Dmin), Dmax);

  const cosA = (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D);
  const alpha = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const psi = Math.atan2(f, d);        // 目标方向，相对「竖直向下」，正 = 向外
  const t1 = psi + alpha;              // 股节绝对角（膝盖上侧）
  const kx = L1 * Math.sin(t1);
  const ky = L1 * Math.cos(t1);
  const t2 = Math.atan2(f - kx, d - ky);

  return {
    yaw,
    femurPitch: -t1,
    tibiaPitch: -(t2 - t1),
    clamped,
    reach: raw / (L1 + L2),
  };
}

export type SpiderRigOptions = {
  /** 体高（body 中心离地），默认 0.32。压低会把膝盖拱到背线以上。 */
  height?: number;
  /** 摆动相抬脚高度，默认 0.13（俯视视角下抬得高才看得出哪条腿在动）。 */
  lift?: number;
  /** 支撑相占比，默认 0.55（>0.5 才是三角步态，任何时刻至少 4 脚着地）。 */
  duty?: number;
  /** 步幅 = Core 步幅 × 该系数，再由几何余量（0.66 m）夹住。默认 0.62。 */
  strideRatio?: number;
  /** 身体起伏幅度（米），默认 0.006。 */
  bob?: number;
  /**
   * 整体视觉缩放。骨架内部所有长度都是「局部米」，乘上这个系数才是世界尺寸。
   * 用 `group.scale` 而不是逐个改常量：`localToWorld` / `worldToLocal` 都带 scale，
   * 脚的世界坐标与髋的局部坐标仍然自洽，IK 不需要任何改动。
   */
  scale?: number;
  /** 惯性强度总开关，0 = 身体纹丝不动（用于 A/B 对照截图）。默认 1。 */
  inertia?: number;
};

export type SpiderRig = {
  group: THREE.Group;
  /**
   * 与 `VoxelRig.update` 同签名，多余参数忽略 —— 这样 `three-scene` 的调用点
   * 不需要为两套骨架分叉。位置 / 朝向由外层 root 承担，本方法只解腿。
   */
  update(
    c: CharacterState, combat: CombatState, hurt: HurtState, frameDt: number,
    channeling?: boolean, coreTime?: number, link?: LinkState, turn?: TurnInPlaceState,
  ): void;
  /**
   * 每条腿的落点快照（世界坐标 / 是否在摆动 / 伸展比）。
   * 供验收「支撑相脚不滑」「8 腿对称」「转身时脚重新落位」—— 单测只读这个，
   * 不需要去遍历 Object3D 层级猜哪块是脚。
   */
  legs(): { x: number; y: number; z: number; swinging: boolean; reach: number }[];
  /** 步态 / 惯性读数，供验收与手感面板。 */
  debug(): {
    maxReach: number; clamped: number; phase: number;
    strideUsed: number; gaitSpeed: number; effSpeed: number; slide: number; dt: number;
    pitch: number; roll: number; leanZ: number; abdomen: number;
    meshes: number; triangles: number;
  };
  dispose(): void;
};

type Leg = {
  index: number;
  side: number;
  k: number;
  hip: THREE.Group;
  femur: THREE.Group;
  tibia: THREE.Group;
  tarsus: THREE.Group;
  L1: number;
  L2: number;
  home: THREE.Vector3;
  phaseOffset: number;
  foot: THREE.Vector3;
  from: THREE.Vector3;
  to: THREE.Vector3;
  swinging: boolean;
  clamped: boolean;
  reach: number;
};

export function createSpiderRig(
  _colors: ColorConfig,
  opts: SpiderRigOptions = {},
): SpiderRig {
  const cfg = {
    height: opts.height ?? 0.32,
    lift: opts.lift ?? 0.13,
    duty: opts.duty ?? 0.55,
    strideRatio: opts.strideRatio ?? 0.62,
    bob: opts.bob ?? 0.006,
    scale: opts.scale ?? 1,
    inertia: opts.inertia ?? 1,
  };

  // ---- 材质：只要两套。颜色全部写进顶点色，所以整只蜘蛛共享 2 个材质 ----
  const owned: { dispose(): void }[] = [];
  const vmat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const gmat = new THREE.MeshBasicMaterial({ vertexColors: true });   // 眼：不参与光照，永远亮
  owned.push(vmat, gmat);

  /**
   * 一组合体 → 一个 mesh。颜色逐件写进顶点色，所以**不同颜色也能合进同一个 mesh**，
   * 这是「零件从 128 降到 35、同时保留腹部渐变」的关键：
   * 分色合并的旧写法只能整块同色，8 层腹部就糊成一个盒子。
   */
  const partMesh = (parts: readonly Part[], colors: string | readonly string[], glow = false): THREE.Mesh => {
    const list = typeof colors === 'string' ? parts.map(() => colors) : colors;
    const g = mergeParts(parts, list);
    owned.push(g);
    const m = new THREE.Mesh(g, glow ? gmat : vmat);
    m.castShadow = !glow;
    m.receiveShadow = !glow;
    return m;
  };

  const group = new THREE.Group();
  group.name = 'spider-root';
  group.scale.setScalar(cfg.scale);
  const body = new THREE.Group();
  body.name = 'spider-body';
  body.position.y = cfg.height;
  group.add(body);

  // ---- 头胸部：甲壳 4 层 + 腹柄 + 螯肢 + 牙 + 触肢 → 1 个 mesh ----
  const carapace = new THREE.Group();
  carapace.name = 'carapace';
  carapace.position.set(0, 0, 0.15);
  body.add(carapace);

  const caraParts: Part[] = [
    // 甲壳：逐层收窄，顶面收成一块「盾」。同色，靠法线读出体积
    [0.300, 0.036, 0.300, 0, -0.030, 0],
    [0.292, 0.042, 0.292, 0, 0.008, 0],
    [0.268, 0.038, 0.268, 0, 0.046, 0],
    [0.228, 0.030, 0.228, 0, 0.078, 0],
    // 腹柄（细腰）：carapace 有 z +0.15 偏移，这里补回 -0.17 落在两节之间的缝里
    [0.130, 0.105, 0.115, 0, 0.030, -0.175],
  ];
  const caraColors: string[] = [
    COL.carapace, COL.carapaceTop, COL.carapaceEdge, COL.carapaceTop, '#231e33',
  ];
  for (const side of [-1, 1]) {
    // 螯肢：口部一对向下的短钳，带尖牙 —— 蜘蛛的招牌。
    // 起点必须**咬进甲壳底面**（甲壳底 y −0.048），否则就是两块浮在头前面的方块。
    caraParts.push([0.058, 0.084, 0.056, side * 0.044, -0.046, 0.126, 0.28]);
    caraColors.push(COL.dark);
    caraParts.push([0.022, 0.042, 0.022, side * 0.044, -0.098, 0.108, 0.95]);
    caraColors.push('#0f0c18');
    // 触肢：短、粗、两节，起点塞进甲壳侧下方 —— 与蟑螂的长触角正相反
    caraParts.push([0.038, 0.086, 0.038, side * 0.086, -0.012, 0.108, 0.72, 0, side * 0.14]);
    caraColors.push(COL.leg);
    caraParts.push([0.030, 0.070, 0.030, side * 0.108, -0.074, 0.158, 0.06]);
    caraColors.push(COL.leg);
  }
  carapace.add(partMesh(caraParts, caraColors));

  // ---- 8 只眼：1 个 mesh，前排一对主眼更亮更大 ----
  const eyeParts: Part[] = [];
  const eyeColors: string[] = [];
  // 眼必须**贴在甲壳前立面上**（顶层甲壳半深 0.114）。原来放到 0.15~0.226，
  // 8 只眼整组飘在头前面 4~11 cm —— 游戏视角下看着还行，造型工坊里一眼就看出来了。
  const eyes: [number, number, number, number, string][] = [
    [0.034, 0.084, 0.110, 0.030, COL.eyeMain],
    [0.074, 0.076, 0.102, 0.021, COL.eyeSub],
    [0.040, 0.066, 0.108, 0.018, COL.eyeSub],
    [0.068, 0.058, 0.098, 0.016, COL.eyeSub],
  ];
  for (const [x, y, z, sz, c] of eyes) {
    for (const side of [-1, 1]) {
      eyeParts.push([sz, sz, sz * 0.5, side * x, y, z]);
      eyeColors.push(c);
    }
  }
  carapace.add(partMesh(eyeParts, eyeColors, true));

  // ---- 腹部：6 层逐层收窄 + 纺器 + 背线 → 1 个 mesh，颜色按层渐变 ----
  const abdomen = new THREE.Group();
  abdomen.name = 'abdomen';
  abdomen.position.set(0, 0.055, -0.268);
  abdomen.rotation.x = ABD_BASE;
  body.add(abdomen);

  const abParts: Part[] = [
    [0.292, 0.044, 0.352, 0, -0.072, 0],
    [0.340, 0.050, 0.416, 0, -0.028, 0],
    [0.370, 0.054, 0.456, 0, 0.023, 0],
    [0.372, 0.054, 0.454, 0, 0.075, 0],
    [0.344, 0.048, 0.416, 0, 0.124, 0],
    [0.284, 0.038, 0.338, 0, 0.166, 0],
    // 纺器（尾部深色小块）
    [0.070, 0.038, 0.042, 0, -0.070, -0.238],
  ];
  const abColors = [
    '#3f3556', '#453a5e', '#4a3d63', '#4d4067', '#50426b', '#53456f', '#231e33',
  ];
  abdomen.add(partMesh(abParts, abColors));

  // ---- 8 条腿：每条 4 个 mesh（基节 / 股节 / 胫节 / 跗节）----
  const legs: Leg[] = [];
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1;
    const k = i % 4;
    const { L1, L2 } = LEGLEN[k];

    const hip = new THREE.Group();
    hip.name = `hip-${i}`;
    hip.rotation.order = 'YXZ';           // 先 yaw 再 pitch，平面解才成立
    hip.position.set(side * HIP_X, HIP_Y, HIP_Z[k]);
    body.add(hip);

    // 基节：把腿根「安」在甲壳上。左右腿几何完全相同（不按 side 偏移），
    // 这样才能共用同一份合并后的几何。
    hip.add(partMesh([[0.088, 0.078, 0.100, 0, 0.006, 0]], COL.leg));

    const femur = new THREE.Group();
    femur.rotation.order = 'YXZ';
    hip.add(femur);
    // 股节：三段由粗到细，合并成一个 mesh —— 锥度是「读成肢节」而不是「读成支架」的关键
    femur.add(partMesh([
      [0.064, L1 * 0.46, 0.064, 0, -L1 * 0.23, 0],
      [0.052, L1 * 0.42, 0.052, 0, -L1 * 0.68, 0],
      [0.042, L1 * 0.14, 0.042, 0, -L1 * 0.95, 0],
    ], COL.leg));

    const tibia = new THREE.Group();
    tibia.rotation.order = 'YXZ';
    tibia.position.y = -L1;
    femur.add(tibia);
    // 胫节：膝节鼓包比两端粗一档 —— 蜘蛛腿最容易读出来的折点
    tibia.add(partMesh([
      [0.072, 0.050, 0.072, 0, 0.004, 0],
      [0.054, L2 * 0.44, 0.054, 0, -L2 * 0.26, 0],
      [0.043, L2 * 0.40, 0.043, 0, -L2 * 0.68, 0],
      [0.034, L2 * 0.16, 0.034, 0, -L2 * 0.95, 0],
    ], COL.leg));

    const tarsus = new THREE.Group();
    tarsus.position.y = -L2;
    tibia.add(tarsus);
    // 跗节：踝鼓包 + 竖直落地段 + 外扩的爪
    tarsus.add(partMesh([
      [0.044, 0.042, 0.044, 0, 0, 0],
      [0.030, TARSUS * 0.86, 0.030, 0, -TARSUS * 0.5, 0],
      [0.044, 0.018, 0.044, 0, -TARSUS, 0],
    ], COL.tarsus));

    // 三角步态分组：同侧相邻腿异相，异侧相邻腿同相 → 任何时刻 4 脚着地
    const grp = (i < 4 ? 0 : 1) ^ (i % 2);

    legs.push({
      index: i, side, k, hip, femur, tibia, tarsus, L1, L2,
      home: new THREE.Vector3(side * FOOT_XZ[k][0], 0, FOOT_XZ[k][1]),
      phaseOffset: grp * 0.5,
      foot: new THREE.Vector3(),
      from: new THREE.Vector3(),
      to: new THREE.Vector3(),
      swinging: false,
      clamped: false,
      reach: 0,
    });
  }

  // ---- 统计（一次性）：合并省了多少 ----
  let meshes = 0;
  let triangles = 0;
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    meshes++;
    const g = m.geometry as THREE.BufferGeometry;
    triangles += (g.index ? g.index.count : g.attributes.position.count) / 3;
  });

  // ---- 逐帧状态 ----
  const tmpFoot = new THREE.Vector3();
  const tmpLocal = new THREE.Vector3();
  const forward = new THREE.Vector3();
  let phase = 0;
  let lastYaw = 0;
  let airT = 0;
  let bobT = 0;
  let primed = false;

  let prevVx = 0;
  let prevVz = 0;
  let lastPX = 0;
  let lastPZ = 0;
  /** 低通后的体轴加速度（前 / 右）。 */
  let accLong = 0;
  let accSide = 0;
  /**
   * 二阶临界阻尼弹簧：`x` 是当前量，`v` 是速度。
   * 和 `lerp` 的区别就在这个 `v` —— 目标突变时它会**冲过头再回来**，
   * 这是「惯性感」的全部来源；单纯 lerp 只有指数逼近，看着像橡皮筋。
   */
  type Spring = { x: number; v: number };
  const springs = {
    pitch: { x: 0, v: 0 },     // 前后俯仰（抬头 / 低头）
    roll: { x: 0, v: 0 },      // 侧倾
    lean: { x: 0, v: 0 },      // 身体相对脚的纵向滞后
    abdom: { x: 0, v: 0 },     // 腹部甩动（比身体更慢、更大）
  };
  const stepSpring = (s: Spring, target: number, omega: number, dt: number): number => {
    const a = omega * omega * (target - s.x) - 2 * omega * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
    return s.x;
  };
  const clamp = (v: number, m: number): number => (v < -m ? -m : v > m ? m : v);

  let stats = {
    maxReach: 0, clamped: 0, phase: 0, strideUsed: 0, gaitSpeed: 0, effSpeed: 0, slide: 0, dt: 0,
    pitch: 0, roll: 0, leanZ: 0, abdomen: 0, meshes, triangles,
  };

  /** 脚在当前位姿下的「静止落点」（世界坐标）。 */
  const homeWorld = (leg: Leg, out: THREE.Vector3, groundY: number, shrink: number): THREE.Vector3 => {
    out.set(leg.home.x * shrink, 0, leg.home.z * shrink);
    group.localToWorld(out);          // 用 group 而不是 body：身体倾斜时落点仍在地面
    out.y = groundY;
    return out;
  };

  const update: SpiderRig['update'] = (c, _combat, _hurt, frameDt) => {
    const dt = Math.min(Math.max(frameDt, 0), 1 / 20);
    if (dt <= 0) return;

    // 父级（playerRoot）本帧已设好位置 / 朝向：先刷矩阵，否则 localToWorld 用上一帧的
    group.updateWorldMatrix(true, false);

    // 前进方向取 body 的世界 +Z（含 root 的平滑朝向），不是 Core 的 bodyYaw —
    // 两者差一个小角度，用错会让摆动腿的落点轻微歪向一侧。
    body.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-8) forward.set(0, 0, 1);
    forward.normalize();
    const rightX = forward.z;
    const rightZ = -forward.x;

    // ---- 1) 步相 ----
    // 平动相位来自 Core 的位移；纯转身时位移是 0，必须自己补
    // |Δyaw| × 半径 的等效线速度，否则脚锁在世界、身体在转，腿会被拧到够不到（实测 reach 1.43）。
    const yaw = Math.atan2(forward.x, forward.z);
    let dYaw = yaw - lastYaw;
    while (dYaw > Math.PI) dYaw -= Math.PI * 2;
    while (dYaw < -Math.PI) dYaw += Math.PI * 2;
    lastYaw = yaw;
    const yawRate = dYaw / dt;

    /**
     * v9s.51 修：平动速度用**本帧实际位移**算，不用 `velocity`。
     *
     * `dt` 上面被截断到 1/20（低帧率下弹簧才稳），而 Core 是按真实帧间隔积分的。
     * 一旦真实帧间隔 > 50 ms，rig 推进的相位就比身体走的路程少 —— 脚越落越远，
     * 实测无头 Chromium（约 20 fps，偶尔掉到 8）在线上跑到 `reach 1.58 / clamp 4`。
     * 换成位移之后，无论多少 fps，相位与「身体走了多远」严格同源。
     */
    const moved = Math.hypot(c.position.x - lastPX, c.position.z - lastPZ);
    lastPX = c.position.x;
    lastPZ = c.position.z;
    // 传送（工位跳转 / 复位 / 调试）会有一次几十米的位移。当成走路看待的话，
    // 相位会在一帧里跳几十个周期、8 条腿全部 clamp —— 识别成传送，本帧不推进相位，
    // 脚由下面「站定收脚」那条分支 lerp 回静止落点。
    const teleport = moved > 0.8;
    if (teleport) {
      phase = 0;
      for (const leg of legs) leg.swinging = false;
    }
    const planarSpeed = teleport ? 0 : moved / dt;
    const spinSpeed = Math.abs(yawRate) * SPIN_RADIUS;
    // 步幅由**几何余量**夹住，不是拍脑袋的比例：
    //   最远的那对腿（第 4 对）静止落点距髋 0.504m，腿长 0.929m，髋高 0.318m
    //   → 水平余量 = √(0.929² − 0.318²) − 0.504 = 0.369m
    //   前伸量 = stride × duty = 0.55 × stride，所以 stride ≤ 0.67 才不夹腿。
    // 取 0.66 把余量吃到 98% —— 再多 1% 就开始夹腿了，这是硬边界不是调参项。
    const reachCap = 0.66;
    // 转身时落点还要随身体旋转偏移，同样的步幅会更吃力 → 按角速度打折
    const spinDamp = Math.max(0.62, 1 / (1 + spinSpeed * 1.1));
    const strideUsed = Math.min(c.stride * cfg.strideRatio, reachCap) * spinDamp;
    const effSpeed = planarSpeed + spinSpeed;

    /**
     * 步频封顶 + 用「脚滑」消化超出部分。
     *
     * 步幅 0.70 m、移速 2.6 m/s 时是 3.7 Hz，离上限很远，脚滑为 0；
     * 只有冲刺（4.5 m/s）才撞到 6.4 Hz —— 此时若继续提频，一帧要走掉
     * 0.10 个周期以上，摆动相不足 4 帧，脚会在两帧里瞬移，IK 目标点跳变，
     * 实测 reach 冲到 2.9（腿长的 2.9 倍，是数值爆炸不是「够不到」）。
     * 所以超出的线速度不再进相位，改让**支撑脚跟着身体滑**：多足高速移动的
     * 标准取舍，8 条腿同时在动，注意力在整体节奏上，看不出打滑。
     */
    const CAP_HZ = 6.4;
    /**
     * 推进量按**帧**夹住，不按秒。原因是 `dt` 上面已被截断到 1/20：
     * 8 fps 的真实帧间隔是 0.125s，若照「每帧推进 0.125s 的位移对应相位」走，
     * 一帧就是 0.52 个周期 —— 摆动相（0.45 周期）连一帧都占不到，脚在两帧之间
     * 瞬移半米，IK 目标点直接跳出腿长（线上实测 reach 1.48 / 腿长 0.93）。
     * 所以取两个上限的较小者：
     *   - `CAP_HZ × dt`：常规步频上限（60 fps 下 0.107，等效 6.4 Hz）
     *   - `(1 − duty) / 1.5`：摆动相至少 1.5 帧（0.30）
     * 低帧率下被后者夹住，欠下的位移由 `slideStep` 让支撑脚滑着补 ——
     * 8 fps 本来就看不清，打滑比抽腿好。
     */
    const maxAdvance = Math.min(CAP_HZ * dt, (1 - cfg.duty) / 1.5);
    const advanceWant = effSpeed * dt;
    const advanceUsed = Math.min(advanceWant, maxAdvance * strideUsed);
    if (effSpeed > 0.02) {
      phase = (phase + advanceUsed / Math.max(strideUsed, 0.15)) % 1;
    }
    const slideStep = advanceWant - advanceUsed;

    // ---- 2) 惯性：加速度 → 二阶弹簧 ----
    const axRaw = (c.velocity.x - prevVx) / dt;
    const azRaw = (c.velocity.z - prevVz) / dt;
    prevVx = c.velocity.x;
    prevVz = c.velocity.z;
    const kA = 1 - Math.exp(-dt * 18);        // 低通：单帧噪声不进弹簧
    accLong += ((axRaw * forward.x + azRaw * forward.z) - accLong) * kA;
    accSide += ((axRaw * rightX + azRaw * rightZ) - accSide) * kA;

    const g = cfg.inertia;
    // 加速 → 身体后仰（pitch 负）；减速 → 前栽。整体被 lean 拖在后面。
    const pitchT = clamp(-accLong * 0.016, 0.10) * g;
    // 横向加速度 + 转弯离心 → 向外倾
    const rollT = clamp(accSide * 0.014 - planarSpeed * yawRate * 0.020, 0.12) * g;
    // 身体相对脚的纵向滞后：加速时压到后面，减速时冲到前面
    const leanT = clamp(-accLong * 0.010, 0.05) * g;
    // 腹部比身体慢一拍、幅度更大 —— 「肚子甩」是多足最有生命感的一处
    const abT = clamp(-accLong * 0.030, 0.16) * g;

    stepSpring(springs.pitch, pitchT, 9.0, dt);
    stepSpring(springs.roll, rollT, 8.0, dt);
    stepSpring(springs.lean, leanT, 7.0, dt);
    stepSpring(springs.abdom, abT, 5.0, dt);

    // 离地：脚跟着身体走，落地再锁回地面
    const groundY = c.position.y;
    const airTarget = c.grounded ? 0 : 1;
    airT += (airTarget - airT) * Math.min(1, dt * 9);
    const shrink = 1 - 0.22 * airT;      // 腾空蜷腿

    // 身体变换先落到矩阵上，后面的 IK 才用得到本帧的髋位置
    bobT += dt * 6.6 * Math.min(1, effSpeed / 1.4);
    body.position.y = cfg.height + Math.sin(bobT) * cfg.bob * Math.min(effSpeed, 1.4) - airT * 0.02;
    body.position.z = springs.lean.x;
    body.rotation.x = springs.pitch.x;
    body.rotation.z = springs.roll.x;
    abdomen.rotation.x = ABD_BASE + springs.abdom.x;
    body.updateMatrixWorld(true);

    let maxReach = 0;
    let clampedCount = 0;
    if (!primed) {
      primed = true;
      lastPX = c.position.x;
      lastPZ = c.position.z;
      for (const leg of legs) {
        homeWorld(leg, leg.foot, groundY, shrink);
        leg.from.copy(leg.foot);
        leg.to.copy(leg.foot);
        leg.swinging = false;
      }
    }

    for (const leg of legs) {
      const ph = (phase + leg.phaseOffset) % 1;

      if (ph < cfg.duty) {
        // 支撑相：脚的世界坐标不动 —— 这是「不滑步」的唯一来源。
        // 唯一的例外是上面 `slideStep`（步频封顶后剩下来的位移），按帧均摊给每条支撑腿。
        leg.swinging = false;
        if (slideStep > 0) leg.foot.addScaledVector(forward, slideStep);
        // 站定时慢慢收回静止落点，避免停机后一直张着腿
        if (effSpeed < 0.02) {
          homeWorld(leg, tmpFoot, groundY, shrink);
          leg.foot.lerp(tmpFoot, Math.min(1, dt * 5));
        } else if (airT > 0.01) {
          // 腾空：脚跟着身体收缩，不留在原地「被拉长」
          homeWorld(leg, tmpFoot, groundY, shrink);
          leg.foot.lerp(tmpFoot, Math.min(1, dt * 6));
        }
      } else {
        const t = (ph - cfg.duty) / (1 - cfg.duty);
        if (!leg.swinging) {
          // 摆动开始：锁一次落点。前伸量 = 支撑相内身体将要前进的距离（stride × duty），
          // 两者相等，脚才会在「摆动结束」与「下一轮支撑结束」之间回到同一个相对位置，
          // 不会一个周期漂一点、几十个周期后腿被拖到身后。
          leg.swinging = true;
          leg.from.copy(leg.foot);
          homeWorld(leg, leg.to, groundY, shrink);
          leg.to.addScaledVector(forward, strideUsed * cfg.duty);
        }
        const e = t * t * (3 - 2 * t);
        leg.foot.lerpVectors(leg.from, leg.to, e);
        leg.foot.y = groundY + Math.sin(Math.PI * t) * cfg.lift;
      }

      // 世界 → body 局部 → 相对髋。目标点抬高一个跗节：两骨解到「踝」，
      // 踝到地面那 9 cm 由竖直的 tarsus 补上，脚端正好落在 foot 上。
      tmpLocal.copy(leg.foot);
      tmpLocal.y += TARSUS * 0.98;
      body.worldToLocal(tmpLocal);
      tmpLocal.sub(leg.hip.position);

      const sol = solveLeg(tmpLocal.x, tmpLocal.y, tmpLocal.z, leg.L1, leg.L2);
      leg.hip.rotation.y = sol.yaw;
      leg.femur.rotation.x = sol.femurPitch;
      leg.tibia.rotation.x = sol.tibiaPitch;
      // 跗节绝对角归零 = 竖直落地，不跟着小腿一起斜
      leg.tarsus.rotation.x = -(sol.femurPitch + sol.tibiaPitch) - 0.10;

      leg.clamped = sol.clamped;
      leg.reach = sol.reach;
      if (sol.reach > maxReach) maxReach = sol.reach;
      if (sol.clamped) clampedCount++;
    }

    stats = {
      maxReach, clamped: clampedCount, phase,
      strideUsed, gaitSpeed: advanceUsed / Math.max(dt, 1e-6), effSpeed,
      slide: slideStep / Math.max(dt, 1e-6), dt,
      pitch: springs.pitch.x, roll: springs.roll.x,
      leanZ: springs.lean.x, abdomen: springs.abdom.x,
      meshes, triangles,
    };
  };

  return {
    group,
    update,
    legs: () => legs.map((l) => ({
      x: l.foot.x, y: l.foot.y, z: l.foot.z, swinging: l.swinging, reach: l.reach,
    })),
    debug: () => stats,
    dispose(): void {
      // 几何 + 两套材质都在 owned 里，一次清干净
      owned.forEach((o) => o.dispose());
      owned.length = 0;
      group.clear();
    },
  };
}
