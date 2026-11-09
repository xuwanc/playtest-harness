import * as THREE from 'three';
import type {
  CharacterState, ColorConfig, CombatState, HurtState, LinkState, TurnInPlaceState,
} from '../core';

/**
 * v9s.50 · 蜘蛛主角骨架（方案 A：固定相位表 + 每腿两骨闭式解）。
 *
 * 设计依据见 `docs/decisions/ADR-010-spider-locomotion.md`。这里只做三件事：
 *   1) 造型 —— 头胸甲 + 腹柄 + 8 层腹部 + 全部腿根落在头胸甲侧缘；
 *   2) 步态 —— alternating tripod（同侧相邻腿异相），支撑脚世界坐标锁死；
 *   3) 解算 —— 每条腿 = 腿根 yaw + femur/tibia 两骨余弦定理闭式解 + 竖直跗节。
 *
 * 与 `voxel-rig` 的关系：**不复用它的任何动画数据**（它是逐帧程序化解算，没有片段），
 * 但复用同一条原则 —— 姿态完全由 Core 状态推导，表现层不持有独立的逻辑时钟。
 * 位置 / 朝向由外层的 `playerRoot` 承担，本 rig 只负责「腿怎么摆、身体怎么起伏」。
 *
 * 与原型 `prototype/spider/main.js` 的差异：
 *   - 相位来自 Core（`getGaitPhase` 回调），不用本地积分 —— 暂停 / 时间缩放 / 单步天然同步；
 *   - 材质按「颜色 + 自发光」缓存，几何按尺寸缓存（原型是每个零件一套，上百 draw call）；
 *   - 原地转身补「等效线速度」：Core 的位移相位在纯转身时不推进，脚会锁在世界被拧住。
 */

// ── 体型常量（米）──────────────────────────────────────────────────────────
/** 髋点全部落在头胸甲侧缘 —— 这是「不像蟑螂」的第一条，别挪到腹部上。 */
const HIP_X = 0.15;
const HIP_Y = -0.032;
const HIP_Z = [0.255, 0.175, 0.095, 0.025];
/** 静止落点（body 局部，y = 0 为地面）：后腿更长、更靠后。 */
const FOOT_XZ: [number, number][] = [[0.428, 0.342], [0.482, 0.092], [0.442, -0.168], [0.318, -0.398]];
/** 四对腿的节长：第 4 对最长（真实蜘蛛就是这样）。 */
const LEGLEN = [
  { L1: 0.38, L2: 0.32 },
  { L1: 0.40, L2: 0.34 },
  { L1: 0.42, L2: 0.36 },
  { L1: 0.46, L2: 0.40 },
];
/** 跗节：竖直落地的那一小段，给「钩爪踩地」的观感。 */
const TARSUS = 0.09;
/** 腿根到重心的大致半径，用于把角速度折算成等效线速度。 */
const SPIN_RADIUS = 0.42;

const COL = {
  carapace: '#332c47',
  carapaceTop: '#4a4066',
  abdomen: '#453a5c',
  mark: '#6b5a9e',
  leg: '#5d4f82',
  joint: '#8b7ab8',
  tarsus: '#463a63',
  mouth: '#1a1626',
  eyeMain: '#e0395a',
  eyeSub: '#b8712e',
} as const;

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
  /** 支撑相占比，默认 0.6（>0.5 才是三角步态，任何时刻至少 4 脚着地）。 */
  duty?: number;
  /** 步幅 = Core 步幅 × 该系数，再由几何余量（0.42m）夹住。默认 0.34。 */
  strideRatio?: number;
  /** 身体起伏幅度（米），默认 0.006。 */
  bob?: number;
  /**
   * 整体视觉缩放。骨架内部所有长度都是「局部米」，乘上这个系数才是世界尺寸。
   * 用 `group.scale` 而不是逐个改常量：`localToWorld` / `worldToLocal` 都带 scale，
   * 脚的世界坐标与髋的局部坐标仍然自洽，IK 不需要任何改动。
   */
  scale?: number;
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
  /** 步态读数：最大伸展比 / 被夹住的腿数 / 当前相位，供验收与手感面板。 */
  debug(): {
    maxReach: number; clamped: number; phase: number;
    strideUsed: number; gaitSpeed: number; effSpeed: number; slide: number; dt: number;
    probe: { bx: number; bz: number; f0x: number; f0z: number; d0: number };
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
    strideRatio: opts.strideRatio ?? 0.34,
    bob: opts.bob ?? 0.006,
    scale: opts.scale ?? 1,
  };

  // ---- 材质 / 几何缓存：整车 100+ 个零件，共享材质后只剩 10 来个 draw call 批次 ----
  const matCache = new Map<string, THREE.MeshLambertMaterial>();
  const geoCache = new Map<string, THREE.BoxGeometry>();
  const mat = (color: string, emissive = 0): THREE.MeshLambertMaterial => {
    const key = `${color}|${emissive}`;
    let m = matCache.get(key);
    if (!m) {
      m = new THREE.MeshLambertMaterial({ color });
      if (emissive > 0) {
        m.emissive = new THREE.Color(color);
        m.emissiveIntensity = emissive;
      }
      matCache.set(key, m);
    }
    return m;
  };
  const geo = (w: number, h: number, d: number): THREE.BoxGeometry => {
    const key = `${w.toFixed(3)},${h.toFixed(3)},${d.toFixed(3)}`;
    let g = geoCache.get(key);
    if (!g) {
      g = new THREE.BoxGeometry(w, h, d);
      geoCache.set(key, g);
    }
    return g;
  };
  const box = (w: number, h: number, d: number, color: string, emissive = 0): THREE.Mesh => {
    const m = new THREE.Mesh(geo(w, h, d), mat(color, emissive));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const group = new THREE.Group();
  group.name = 'spider-root';
  group.scale.setScalar(cfg.scale);
  const body = new THREE.Group();
  body.name = 'spider-body';
  body.position.y = cfg.height;
  group.add(body);

  // ---- 头胸甲：4 层逐层收窄，顶面收成一块「盾」----
  const carapace = new THREE.Group();
  carapace.name = 'carapace';
  carapace.position.set(0, 0, 0.15);
  body.add(carapace);

  const cara: [number, number, number, number, string][] = [
    [0.300, 0.036, 0.300, -0.030, '#382f4e'],
    [0.292, 0.042, 0.292, 0.008, '#403758'],
    [0.268, 0.038, 0.268, 0.046, '#473d61'],
    [0.228, 0.030, 0.228, 0.078, '#4e4369'],
  ];
  for (const [w, h, d, y, c] of cara) {
    const m = box(w, h, d, c);
    m.position.y = y;
    carapace.add(m);
  }

  // ---- 8 只眼：两排，前排一对主眼 ----
  const eyes: [number, number, number, number, string, number][] = [
    [0.030, 0.098, 0.226, 0.026, COL.eyeMain, 0.95],
    [0.076, 0.095, 0.204, 0.017, COL.eyeSub, 0.3],
    [0.032, 0.098, 0.170, 0.014, COL.eyeSub, 0.22],
    [0.068, 0.094, 0.150, 0.013, COL.eyeSub, 0.2],
  ];
  for (const [x, y, z, sz, c, emit] of eyes) {
    for (const side of [-1, 1]) {
      const e = box(sz, sz, sz * 0.5, c, emit);
      e.position.set(side * x, y, z);
      e.castShadow = false;
      carapace.add(e);
    }
  }

  // ---- 螯肢（带尖牙）+ 触肢（短粗两节）----
  for (const side of [-1, 1]) {
    const chel = box(0.050, 0.092, 0.050, COL.mouth);
    chel.position.set(side * 0.046, -0.062, 0.152);
    chel.rotation.x = 0.34;
    carapace.add(chel);
    const fang = box(0.020, 0.046, 0.020, '#0f0c18');
    fang.position.set(side * 0.046, -0.118, 0.132);
    fang.rotation.x = 0.95;
    carapace.add(fang);

    const p1 = box(0.036, 0.095, 0.036, COL.leg);
    p1.position.set(side * 0.092, -0.030, 0.140);
    p1.rotation.set(0.62, 0, side * 0.16);
    carapace.add(p1);
    const p2 = box(0.028, 0.078, 0.028, COL.leg);
    p2.position.set(side * 0.112, -0.104, 0.192);
    p2.rotation.x = 0.10;
    carapace.add(p2);
  }

  // ---- 腹柄：细腰，把两节身体分开 ----
  const pedicel = box(0.105, 0.075, 0.095, '#231e33');
  body.add(pedicel);

  // ---- 腹部：8 层细堆叠，同色，靠几何台阶 + 单向光读出体积 ----
  const abdomen = new THREE.Group();
  abdomen.name = 'abdomen';
  abdomen.position.set(0, 0, -0.238);
  abdomen.rotation.x = 0.045;
  body.add(abdomen);

  const ab: [number, number, number, number, string][] = [
    [0.290, 0.030, 0.350, -0.078, '#4a3d62'],
    [0.330, 0.034, 0.404, -0.046, '#4c3f64'],
    [0.356, 0.036, 0.436, -0.011, '#4e4166'],
    [0.370, 0.038, 0.454, 0.026, '#50426b'],
    [0.374, 0.038, 0.458, 0.064, '#51436c'],
    [0.358, 0.036, 0.436, 0.101, '#53456e'],
    [0.324, 0.032, 0.392, 0.135, '#554771'],
    [0.270, 0.026, 0.324, 0.164, '#574974'],
  ];
  for (const [w, h, d, y, c] of ab) {
    const m = box(w, h, d, c);
    m.position.y = y;
    abdomen.add(m);
  }
  const spinneret = box(0.070, 0.038, 0.042, '#231e33');
  spinneret.position.set(0, -0.070, -0.238);
  abdomen.add(spinneret);
  // 背线：只留一条很窄的浅纹，宽了就变「提手」
  const ridgeA = box(0.020, 0.006, 0.150, COL.mark);
  ridgeA.position.set(0, 0.179, 0.004);
  abdomen.add(ridgeA);
  const ridgeB = box(0.016, 0.005, 0.082, COL.mark);
  ridgeB.position.set(0, 0.147, 0.010);
  abdomen.add(ridgeB);

  // ---- 8 条腿 ----
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

    const coxa = box(0.084, 0.074, 0.084, COL.joint);
    coxa.position.x = side * 0.014;
    hip.add(coxa);
    // 肩板：向身体里插 5 cm，腿根就不会「浮」在甲壳外面
    const shoulder = box(0.070, 0.062, 0.096, COL.carapaceTop);
    shoulder.position.set(side * -0.052, 0.012, 0);
    hip.add(shoulder);

    const femur = new THREE.Group();
    femur.rotation.order = 'YXZ';
    hip.add(femur);
    // 三段锥形：体素做不出曲面，靠「锥度 + 关节鼓包」把直棍读成肢节
    const femSeg: [number, number, number][] = [[0.070, 0.40, 0.20], [0.062, 0.34, 0.63], [0.052, 0.28, 0.88]];
    for (const [w, frac, at] of femSeg) {
      const seg = box(w, L1 * frac, w, COL.leg);
      seg.position.y = -L1 * at;
      femur.add(seg);
    }

    const tibia = new THREE.Group();
    tibia.rotation.order = 'YXZ';
    tibia.position.y = -L1;
    femur.add(tibia);
    const knee = box(0.072, 0.054, 0.072, COL.joint);
    tibia.add(knee);
    const tibSeg: [number, number, number][] = [[0.052, 0.40, 0.22], [0.045, 0.34, 0.63], [0.036, 0.28, 0.88]];
    for (const [w, frac, at] of tibSeg) {
      const seg = box(w, L2 * frac, w, COL.leg);
      seg.position.y = -L2 * at;
      tibia.add(seg);
    }

    const tarsus = new THREE.Group();
    tarsus.position.y = -L2;
    tibia.add(tarsus);
    const ankle = box(0.046, 0.042, 0.046, COL.joint);
    tarsus.add(ankle);
    const tarsusMesh = box(0.030, TARSUS, 0.030, COL.tarsus);
    tarsusMesh.position.y = -TARSUS / 2;
    tarsus.add(tarsusMesh);
    const claw = box(0.042, 0.018, 0.042, '#15121f');
    claw.position.y = -TARSUS;
    tarsus.add(claw);

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

  // ---- 逐帧状态 ----
  const tmpFoot = new THREE.Vector3();
  const tmpLocal = new THREE.Vector3();
  const forward = new THREE.Vector3();
  let phase = 0;
  let lastYaw = 0;
  let airT = 0;
  let bobT = 0;
  let stats = {
    maxReach: 0, clamped: 0, phase: 0, strideUsed: 0, gaitSpeed: 0, effSpeed: 0, slide: 0, dt: 0,
    probe: { bx: 0, bz: 0, f0x: 0, f0z: 0, d0: 0 },
  };
  let primed = false;

  /** 脚在当前位姿下的「静止落点」（世界坐标）。 */
  const homeWorld = (leg: Leg, out: THREE.Vector3, groundY: number, shrink: number): THREE.Vector3 => {
    out.set(leg.home.x * shrink, 0, leg.home.z * shrink);
    group.localToWorld(out);
    out.y = groundY;
    return out;
  };

  const update: SpiderRig['update'] = (c, _combat, _hurt, frameDt) => {
    const dt = Math.min(Math.max(frameDt, 0), 1 / 20);
    if (dt <= 0) return;

    // 父级（playerRoot）本帧已设好位置 / 朝向：先刷矩阵，否则 localToWorld 用上一帧的
    group.updateWorldMatrix(true, false);
    group.updateMatrixWorld(true);

    // 前进方向取 body 的世界 +Z（含 root 的平滑朝向），不是 Core 的 bodyYaw —
    // 两者差一个小角度，用错会让摆动腿的落点轻微歪向一侧。
    body.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-8) forward.set(0, 0, 1);
    forward.normalize();

    // ---- 1) 步相 ----
    // 平动相位来自 Core 的位移（frameDist / stride）；纯转身时位移是 0，必须自己补
    // |Δyaw| × 半径 的等效线速度，否则脚锁在世界、身体在转，腿会被拧到够不到（实测 reach 1.43）。
    const yaw = Math.atan2(forward.x, forward.z);
    let dYaw = yaw - lastYaw;
    while (dYaw > Math.PI) dYaw -= Math.PI * 2;
    while (dYaw < -Math.PI) dYaw += Math.PI * 2;
    lastYaw = yaw;

    const planarSpeed = Math.hypot(c.velocity.x, c.velocity.z);
    const spinSpeed = Math.abs(dYaw) / dt * SPIN_RADIUS;
    // 步幅由**几何余量**夹住，不是拍脑袋的比例：
    //   最远的那对腿（第 4 对）静止落点距髋 0.455m，腿长 0.86m，髋高 0.288m
    //   → 水平余量 = √(0.86² − 0.288²) − 0.455 = 0.355m
    //   前伸量 = stride × (1 − duty/2) = 0.7 × stride，所以 stride ≤ 0.50 才不夹腿。
    // 取 0.42 留 15% 余量给「身体倾斜 / 转身时落点偏移」。
    // 超出部分不去拉伸腿，而是转成步频（`effSpeed / strideUsed` 自然变高）。
    const reachCap = 0.45;
    // 转身时落点还要随身体旋转偏移，同样的步幅会更吃力 → 按角速度打折
    const spinDamp = Math.max(0.6, 1 / (1 + spinSpeed * 1.1));
    const strideUsed = Math.min(c.stride * cfg.strideRatio, reachCap) * spinDamp;
    const effSpeed = planarSpeed + spinSpeed;

    /**
     * v9s.50 · 步频封顶 + 用「脚滑」消化超出部分。
     *
     * 玩家的 `moveSpeed` 是 4.2 m/s，而蜘蛛步幅的几何上限只有 0.45m：
     * 若严格按 `速度 / 步幅` 推进相位，就是 **9.3 Hz**（一帧 0.16 个周期），
     * 摆动相只占 2 帧 —— 脚在两帧里瞬移半米，IK 目标点跳变，实测 reach 冲到 2.9
     * （腿长的 2.9 倍，完全是数值爆炸，不是「够不到」）。
     *
     * 所以给步频封顶 7.5 Hz（摆动相 ≥3 帧，插值仍然平滑），
     * 超出的线速度不再进相位，而是让**支撑脚跟着身体滑** ——
     * 高速时约 20% 的脚滑，肉眼几乎看不出（8 条腿同时在动，注意力在整体节奏上），
     * 换来的是「不夹腿、不抖、不瞬移」。这是多足高速移动的标准取舍。
     */
    const CAP_HZ = 7.5;
    const gaitSpeed = Math.min(effSpeed, CAP_HZ * strideUsed);
    if (effSpeed > 0.02) {
      phase = (phase + (gaitSpeed / Math.max(strideUsed, 0.15)) * dt) % 1;
    }
    const slideStep = Math.max(0, effSpeed - gaitSpeed) * dt;

    // ---- 2) 离地 / 落地：脚跟着身体走，落地再锁回地面 ----
    const groundY = c.position.y;
    const airTarget = c.grounded ? 0 : 1;
    airT += (airTarget - airT) * Math.min(1, dt * 9);
    const shrink = 1 - 0.22 * airT;      // 腾空蜷腿

    let maxReach = 0;
    let clampedCount = 0;
    if (!primed) {
      primed = true;
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
          // 摆动开始：锁一次落点。前伸量按 duty 补偿，落地时脚正好在身体中线前后对称
          leg.swinging = true;
          leg.from.copy(leg.foot);
          homeWorld(leg, leg.to, groundY, shrink);
          // 前伸量 = 支撑相内身体将要前进的距离（stride × duty）。
          // 两者相等，脚才会在「摆动结束」与「下一轮支撑结束」之间回到同一个相对位置，
          // 不会一个周期漂一点、几十个周期后腿被拖到身后。
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

    // ---- 3) 身体起伏：只抬 body，IK 每帧跟着重解，没有反馈回路 ----
    bobT += dt * 7.5 * Math.min(1, effSpeed / 1.4);
    body.position.y = cfg.height + Math.sin(bobT) * cfg.bob * Math.min(effSpeed, 1.4) - airT * 0.02;

    const bp = body.getWorldPosition(tmpFoot);
    stats = {
      maxReach, clamped: clampedCount, phase,
      strideUsed, gaitSpeed, effSpeed, slide: slideStep / Math.max(dt, 1e-6), dt,
      probe: {
        bx: +bp.x.toFixed(2), bz: +bp.z.toFixed(2),
        f0x: +legs[0].foot.x.toFixed(2), f0z: +legs[0].foot.z.toFixed(2),
        d0: +legs[0].foot.distanceTo(bp).toFixed(2),
      },
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
      geoCache.forEach((g) => g.dispose());
      matCache.forEach((m) => m.dispose());
      geoCache.clear();
      matCache.clear();
      group.clear();
    },
  };
}
