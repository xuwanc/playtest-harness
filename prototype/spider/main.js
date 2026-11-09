/**
 * 蜘蛛角色可行性原型（独立目录，不进 src，不参与构建）。
 *
 * 要回答一个问题：8 条腿能不能靠「解析式 IK + 多足步态发生器」跑起来，
 * 而不引入 FullBodyIK 这类迭代数值解算器。
 *
 * 结论写在 docs/decisions/ADR-010-spider-locomotion.md，这里只做可跑的证明：
 *   1) 每条腿 = 腿根 yaw + femur/tibia 两骨闭式解 + 竖直落地的跗节（tarsus）；
 *   2) 8 条腿按 alternating tripod 分两组，相位差半周期；
 *   3) 支撑相把脚的世界坐标**锁死**（不滑步），摆动相才更新落点；
 *   4) 身体高度/起伏只是 body.position.y，IK 每帧跟着重解，没有任何反馈回路。
 *
 * 造型要点（v2，第一版被评价「像蟑螂」）：
 *   蟑螂 = 单块扁方盒 + 8 条等长腿均匀挂在整条身体上 + 长触角。
 *   蜘蛛 = 头胸甲小、腹部大成球、**所有腿都从前段肩部长出**、有螯肢与短粗触肢、
 *          成组的 8 只眼、后腿比前腿长。这几条全部落到几何上，不靠贴图。
 */
import * as THREE from 'three';

const V3 = THREE.Vector3;
const UP = new V3(0, 1, 0);

// ── 体型参数（米）──────────────────────────────────────────────────────────
// 髋点：全部落在头胸甲侧缘（z ∈ [−0.06, 0.24]），这是「不像蟑螂」的第一条
const HIP_X = 0.15;
const HIP_Y = -0.032;
const HIP_Z = [0.255, 0.175, 0.095, 0.025];
// 静止落点（相对 body 中心，y=0 为地面）：后腿更长、更靠后
const FOOT_XZ = [[0.428, 0.342], [0.482, 0.092], [0.442, -0.168], [0.318, -0.398]];
// 四对腿的节长：第 4 对最长（真实蜘蛛就是这样）
const LEGLEN = [
  { L1: 0.38, L2: 0.32 },
  { L1: 0.40, L2: 0.34 },
  { L1: 0.42, L2: 0.36 },
  { L1: 0.46, L2: 0.40 },
];
const TARSUS = 0.09;          // 跗节：竖直落地的那一小段，给「钩爪踩地」的观感

/**
 * 两骨解析 IK（腿的竖直平面内，余弦定理闭式解）。
 *
 * 返回的三个角都是「THREE 关节角度」，调用方直接写：
 *   hip.rotation.y   = yaw        （把腿摆到目标方位）
 *   femur.rotation.x = femurPitch （骨沿 -Y 伸出，负角 = 骨往局部 +Z 偏）
 *   tibia.rotation.x = tibiaPitch （相对 femur）
 *
 * 膝盖朝向：解在「髋→目标」连线的上侧，所以股节先向外略上拱起、胫节再落下，
 * 这正是蜘蛛腿的侧面轮廓。换成下侧解会变成「膝盖朝地」的昆虫直腿。
 */
function solveLeg(tx, ty, tz, L1, L2) {
  const f = Math.hypot(tx, tz);        // 水平距离
  const d = -ty;                       // 向下为正
  const yaw = Math.atan2(tx, tz);
  let D = Math.hypot(f, d);
  const Dmax = (L1 + L2) * 0.999;
  const Dmin = Math.abs(L1 - L2) + 0.002;
  const clamped = D > Dmax || D < Dmin;
  D = Math.min(Math.max(D, Dmin), Dmax);

  const cosA = (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D);
  const alpha = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const psi = Math.atan2(f, d);        // 目标方向，相对「竖直向下」，正 = 向外
  const t1 = psi + alpha;              // 股节绝对角（膝盖上侧解）
  const kx = L1 * Math.sin(t1);
  const ky = L1 * Math.cos(t1);        // 膝盖的「向下」坐标，可为负（高于髋）
  const t2 = Math.atan2(f - kx, d - ky);

  return {
    yaw,
    femurPitch: -t1,
    tibiaPitch: -(t2 - t1),
    clamped,
    reach: Math.hypot(f, d) / (L1 + L2),
  };
}

// ── 场景 ─────────────────────────────────────────────────────────────────
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0a0b10');
scene.fog = new THREE.Fog('#0a0b10', 8, 19);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);

scene.add(new THREE.HemisphereLight('#a9bce8', '#191d26', 2.2));
// 主光偏暖，从右后方打，勾出背甲的边；辅光偏冷，从左前补暗部
const sun = new THREE.DirectionalLight('#ffe6c2', 1.55);
sun.position.set(3.0, 6.2, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -3; sun.shadow.camera.right = 3;
sun.shadow.camera.top = 3; sun.shadow.camera.bottom = -3;
sun.shadow.bias = -0.0012;
scene.add(sun);
scene.add(sun.target);

const rim = new THREE.DirectionalLight('#7d8fff', 0.7);
rim.position.set(-3.4, 1.6, -2.6);
scene.add(rim);

// 软接触阴影：硬投影之外再压一层暗斑，脚与地面的接触才「实」
const contactShadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.56, 40),
  new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.34, depthWrite: false }),
);
contactShadow.rotation.x = -Math.PI / 2;
contactShadow.position.y = 0.004;
scene.add(contactShadow);

const grid = new THREE.GridHelper(24, 24, 0x33405a, 0x1c2431);
grid.material.transparent = true;
grid.material.opacity = 0.6;
scene.add(grid);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshLambertMaterial({ color: '#151a23' }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.002;
floor.receiveShadow = true;
scene.add(floor);

// ── 体素零件 ─────────────────────────────────────────────────────────────
function box(w, h, d, color, opts = {}) {
  const mat = new THREE.MeshLambertMaterial({ color });
  if (opts.emissive) {
    mat.emissive = new THREE.Color(opts.emissiveColor || color);
    mat.emissiveIntensity = opts.emissive;
  }
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// 深紫黑甲壳 + 冷紫关节 + 一对红主眼。项目里的角色本来就偏紫，这里同一色系但压暗，
// 让「暗身体 + 亮关节」把八条腿的折线读出来。
const COL = {
  carapace: '#3b3352',
  carapaceTop: '#4a4066',
  abdomen: '#4d4067',
  abdomenTop: '#5d4e7c',
  mark: '#9b87cc',
  leg: '#3e3557',
  joint: '#5f5285',
  tarsus: '#2c2740',
  mouth: '#231e33',
  eyeMain: '#e0395a',
  eyeSub: '#b8712e',
  mouth: '#1a1626',
};

// ── 蜘蛛骨架 ─────────────────────────────────────────────────────────────
// 体素没法做曲面，圆润感靠「逐层收窄」堆出来：每一层比下一层窄一点、短一点，
// 侧面轮廓就从方块变成椭圆。头胸甲 4 层、腹部 5 层，是这套造型里最费工也最值钱的部分。
function buildSpider() {
  const group = new THREE.Group();          // 世界位置 + 朝向
  const body = new THREE.Group();           // 体高 / 起伏
  group.add(body);

  // ── 头胸甲（carapace）：小、前移，顶面收窄成一块「盾」 ──
  const carapace = new THREE.Group();
  carapace.position.set(0, 0, 0.15);
  body.add(carapace);

  const cara = [
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

  // ── 8 只眼：前排一对主眼 + 6 只错开的副眼（蜘蛛的标准布局）──
  const eyes = [
    [0.028, 0.098, 0.226, 0.022, COL.eyeMain, 0.50],
    [0.076, 0.095, 0.204, 0.017, COL.eyeSub, 0.30],
    [0.032, 0.098, 0.170, 0.014, COL.eyeSub, 0.22],
    [0.068, 0.094, 0.150, 0.013, COL.eyeSub, 0.20],
  ];
  for (const [x, y, z, sz, c, emit] of eyes) {
    for (const side of [-1, 1]) {
      const e = box(sz, sz, sz * 0.5, c, { emissive: emit });
      e.position.set(side * x, y, z);
      e.castShadow = false;
      carapace.add(e);
    }
  }

  // ── 螯肢（chelicerae）：口部一对向下的短钳，蜘蛛的招牌 ──
  for (const side of [-1, 1]) {
    const chel = box(0.050, 0.092, 0.050, COL.mouth);
    chel.position.set(side * 0.046, -0.062, 0.152);
    chel.rotation.x = 0.34;
    carapace.add(chel);
    const fang = box(0.020, 0.046, 0.020, '#0f0c18');
    fang.position.set(side * 0.046, -0.118, 0.132);
    fang.rotation.x = 0.95;
    carapace.add(fang);
  }

  // ── 触肢（pedipalps）：短、粗、两节 —— 与蟑螂的长触角正相反 ──
  for (const side of [-1, 1]) {
    const p1 = box(0.036, 0.095, 0.036, COL.leg);
    p1.position.set(side * 0.092, -0.030, 0.140);
    p1.rotation.set(0.62, 0, side * 0.16);
    carapace.add(p1);
    const p2 = box(0.028, 0.078, 0.028, COL.leg);
    p2.position.set(side * 0.112, -0.104, 0.192);
    p2.rotation.x = 0.10;
    carapace.add(p2);
  }

  // ── 腹柄（pedicel）：细腰，把两节身体分开 ──
  const pedicel = box(0.105, 0.075, 0.095, '#231e33');
  pedicel.position.set(0, 0.0, 0.0);
  body.add(pedicel);

  // ── 腹部（abdomen）：7 层逐层收窄，侧面读成椭圆而不是阶梯塔 ──
  const abdomen = new THREE.Group();
  abdomen.position.set(0, 0, -0.238);
  abdomen.rotation.x = 0.045;
  body.add(abdomen);

  // 每层 [宽, 高, 长, y, 颜色]，宽度按椭圆采样，顶层不收到 0 以免变成尖顶
  // 8 层细堆叠：中段每层只差 4~16 mm（台阶小于 4 px，读成曲面），
  // 两端差大（自然收口）。这是体素做圆形的标准做法，比「少层大台阶」干净得多。
  const ab = [
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

  // 背脊：贴在顶部两层上，跟着椭圆走，不做单根浮空长条
  // 背线：只留一条很窄的浅纹（狼蛛式的纵纹），宽了就变成「提手」
  const ridgeA = box(0.020, 0.006, 0.150, '#6b5a9e');
  ridgeA.position.set(0, 0.179, 0.004);
  abdomen.add(ridgeA);
  const ridgeB = box(0.016, 0.005, 0.082, '#6b5a9e');
  ridgeB.position.set(0, 0.147, 0.010);
  abdomen.add(ridgeB);

  // ── 8 条腿：髋点全部落在头胸甲侧缘（z ∈ [−0.06, 0.24]）──
  const legs = [];
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1;
    const k = i % 4;
    const { L1, L2 } = LEGLEN[k];

    const hip = new THREE.Group();
    hip.name = `hip-${i}`;
    hip.rotation.order = 'YXZ';             // 先 yaw 再 pitch，平面解才成立
    hip.position.set(side * HIP_X, HIP_Y, HIP_Z[k]);
    body.add(hip);

    // 基节：把腿根「安」在甲壳上，避免看起来是插进去的
    const coxa = box(0.084, 0.074, 0.084, COL.joint);
    coxa.position.x = side * 0.014;
    hip.add(coxa);
    // 肩板：向身体里插进 3 cm，腿根就不会「浮」在甲壳外面
    const shoulder = box(0.070, 0.062, 0.096, COL.carapaceTop);
    shoulder.position.set(side * -0.052, 0.012, 0);
    hip.add(shoulder);

    const femur = new THREE.Group();
    femur.rotation.order = 'YXZ';
    hip.add(femur);
    // 股节拆三段、逐段变细：体素做不出曲面，靠「锥度 + 关节鼓包」把直棍读成肢节
    const femSeg = [[0.070, 0.40, 0.20], [0.062, 0.34, 0.63], [0.052, 0.28, 0.88]];
    for (const [w, frac, at] of femSeg) {
      const seg = box(w, L1 * frac, w, COL.leg);
      seg.position.y = -L1 * at;
      femur.add(seg);
    }

    const tibia = new THREE.Group();
    tibia.rotation.order = 'YXZ';
    tibia.position.y = -L1;
    femur.add(tibia);
    // 膝节：鼓包比两端粗一档，是蜘蛛腿最容易读出来的折点
    const knee = box(0.072, 0.054, 0.072, COL.joint);
    tibia.add(knee);
    const tibSeg = [[0.052, 0.40, 0.22], [0.045, 0.34, 0.63], [0.036, 0.28, 0.88]];
    for (const [w, frac, at] of tibSeg) {
      const seg = box(w, L2 * frac, w, COL.leg);
      seg.position.y = -L2 * at;
      tibia.add(seg);
    }

    // 跗节：竖直落地的小段 + 末端爪块
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
      home: new V3(side * FOOT_XZ[k][0], 0, FOOT_XZ[k][1]),
      phaseOffset: grp * 0.5,
      foot: new V3(),
      from: new V3(),
      to: new V3(),
      swinging: false,
      ik: { clamped: false, reach: 0 },
    });
  }

  return { group, body, carapace, abdomen, legs };
}

const spider = buildSpider();
scene.add(spider.group);

// ── 参数 ─────────────────────────────────────────────────────────────────
const params = { speed: 1.4, stride: 0.42, lift: 0.09, height: 0.32, turn: 0, duty: 0.6 };
let phase = 0;
let time = 0;
const stats = { maxReach: 0, clamped: 0, speed: 0 };

const forward = new V3();

/** 脚在当前身体位姿下的「静止落点」（世界坐标）。 */
function homeWorld(leg, out) {
  out.copy(leg.home);
  out.applyAxisAngle(UP, spider.group.rotation.y);
  out.add(spider.group.position);
  return out;
}

function resetPose() {
  phase = 0;
  spider.group.position.set(0, 0, 0);
  spider.group.rotation.y = 0;            // 初始朝 +Z，正对相机（看到头胸甲与 8 只眼）
  spider.body.position.y = params.height;
  spider.group.updateMatrixWorld(true);
  for (const leg of spider.legs) {
    homeWorld(leg, leg.foot);
    leg.from.copy(leg.foot);
    leg.to.copy(leg.foot);
    leg.swinging = false;
  }
}

// ── 逐帧 ─────────────────────────────────────────────────────────────────
const tmpFoot = new V3();
const tmpLocal = new V3();

function tick(dt) {
  dt = Math.min(dt, 1 / 20);
  time += dt;

  // 1) 身体推进（原型里没有 Core，就地积分）
  const spd = params.speed;
  forward.set(0, 0, 1).applyAxisAngle(UP, spider.group.rotation.y);
  spider.group.position.addScaledVector(forward, spd * dt);
  spider.group.rotation.y += params.turn * dt;
  spider.body.position.y = params.height + Math.sin(time * 7.5) * 0.006 * Math.min(spd, 1);

  // 2) 步相推进：一个周期走 stride 米 → 相位速率 = 速度 / 步幅。
  //    原地转向同样要倒腾腿，否则脚锁在世界、身体在转，腿会被拧成麻花（实测 reach 冲到 1.4）。
  //    等效线速度 = 平动 + |角速度| × 腿根半径，这是多足 / 双足通用的做法。
  const spin = Math.abs(params.turn) * 0.42;
  const effSpeed = spd + spin;
  if (effSpeed > 0.02) phase = (phase + (effSpeed / params.stride) * dt) % 1;

  // 3) 每条腿：先定落脚点（世界），再解 IK
  let maxReach = 0, clamped = 0;
  spider.group.updateMatrixWorld(true);

  for (const leg of spider.legs) {
    const ph = (phase + leg.phaseOffset) % 1;

    if (ph < params.duty) {
      // 支撑相：脚的世界坐标不动 —— 这是「不滑步」的唯一来源
      if (leg.swinging) leg.swinging = false;
      // 站定时慢慢收回静止落点，避免停机后一直张着腿（对应真实项目的 solveStopGait）
      if (effSpeed < 0.02) {
        homeWorld(leg, tmpFoot);
        leg.foot.lerp(tmpFoot, Math.min(1, dt * 5));
        leg.foot.y = 0;
      }
    } else {
      const t = (ph - params.duty) / (1 - params.duty);
      if (!leg.swinging) {
        // 摆动开始：锁一次落点。前伸量按 duty 补偿，落地时脚正好在身体中线前后对称
        leg.swinging = true;
        leg.from.copy(leg.foot);
        homeWorld(leg, leg.to);
        leg.to.addScaledVector(forward, params.stride * (1 - params.duty * 0.5));
      }
      const e = t * t * (3 - 2 * t);
      leg.foot.lerpVectors(leg.from, leg.to, e);
      leg.foot.y = Math.sin(Math.PI * t) * params.lift;
    }

    // 世界 → body 局部 → 相对髋。目标点抬高一个跗节长度：
    // 两骨解到「踝」，踝到地面那 9 cm 由竖直的 tarsus 补上，脚端正好落在 foot 上。
    tmpLocal.copy(leg.foot);
    tmpLocal.y += TARSUS * 0.98;
    spider.body.worldToLocal(tmpLocal);
    tmpLocal.sub(leg.hip.position);

    const sol = solveLeg(tmpLocal.x, tmpLocal.y, tmpLocal.z, leg.L1, leg.L2);
    leg.hip.rotation.y = sol.yaw;
    leg.femur.rotation.x = sol.femurPitch;
    leg.tibia.rotation.x = sol.tibiaPitch;
    // 跗节绝对角归零 = 竖直落地，不跟着小腿一起斜
    leg.tarsus.rotation.x = -(sol.femurPitch + sol.tibiaPitch) - 0.10;

    leg.ik.clamped = sol.clamped;
    leg.ik.reach = sol.reach;
    maxReach = Math.max(maxReach, sol.reach);
    if (sol.clamped) clamped++;
  }
  spider.group.updateMatrixWorld(true);

  stats.maxReach = maxReach;
  stats.clamped = clamped;
  stats.speed = spd;

  // 4) 相机跟随 + 地面取整
  camera.position.set(
    spider.group.position.x + 1.02,
    spider.group.position.y + 1.74,
    spider.group.position.z + 1.44,
  );
  camera.lookAt(spider.group.position.x, spider.group.position.y + 0.14, spider.group.position.z);
  sun.target.position.copy(spider.group.position);
  sun.position.set(spider.group.position.x + 3.0, 6.2, spider.group.position.z + 2.4);
  grid.position.set(
    Math.round(spider.group.position.x),
    0,
    Math.round(spider.group.position.z),
  );
  contactShadow.position.set(spider.group.position.x, 0.004, spider.group.position.z + 0.02);
}

// ── UI ───────────────────────────────────────────────────────────────────
const ui = {
  speed: document.getElementById('speed'),
  stride: document.getElementById('stride'),
  lift: document.getElementById('lift'),
  height: document.getElementById('height'),
  turn: document.getElementById('turn'),
  duty: document.getElementById('duty'),
};
const out = {
  speed: document.getElementById('o-speed'),
  stride: document.getElementById('o-stride'),
  lift: document.getElementById('o-lift'),
  height: document.getElementById('o-height'),
  turn: document.getElementById('o-turn'),
  duty: document.getElementById('o-duty'),
};

function syncUI() {
  for (const k of Object.keys(ui)) {
    if (!ui[k]) continue;
    ui[k].value = String(params[k]);
    out[k].textContent = Number(params[k]).toFixed(2);
  }
  updateStats();
}

function updateStats() {
  const el = document.getElementById('stats');
  if (!el) return;
  el.textContent =
    `phase    ${phase.toFixed(3)}\n` +
    `maxReach ${(stats.maxReach * 100).toFixed(0)}%\n` +
    `clamped  ${stats.clamped} / 8 legs\n` +
    `stride   ${params.stride.toFixed(2)}m @ ${stats.speed.toFixed(2)}m/s`;
}

for (const k of Object.keys(ui)) {
  if (!ui[k]) continue;
  ui[k].addEventListener('input', () => {
    params[k] = parseFloat(ui[k].value);
    out[k].textContent = params[k].toFixed(2);
    updateStats();
  });
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ── 对外（截图脚本驱动用）─────────────────────────────────────────────────
window.__spider = {
  params,
  stats,
  reset() { resetPose(); syncUI(); },
  set(over) { Object.assign(params, over); syncUI(); },
  /** 不依赖 rAF 的确定性推进，截图前用它把步态跑到指定相位。 */
  advance(seconds, step = 1 / 60) {
    for (let t = 0; t < seconds; t += step) tick(step);
    renderer.render(scene, camera);
  },
  getPhase: () => phase,
  legs: () => spider.legs.map((l) => ({
    i: l.index, phase: (phase + l.phaseOffset) % 1,
    swinging: l.swinging, reach: l.ik.reach, clamped: l.ik.clamped,
    foot: [l.foot.x, l.foot.y, l.foot.z],
  })),
};

let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;
  tick(dt);
  renderer.render(scene, camera);
  updateStats();
  requestAnimationFrame(loop);
}

resetPose();
syncUI();
tick(0);
renderer.render(scene, camera);
requestAnimationFrame(loop);
window.__ready = true;
