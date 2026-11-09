/**
 * 蜘蛛角色可行性原型（独立目录，不进 src，不参与构建）。
 *
 * 要回答一个问题：8 条腿能不能靠「解析式 IK + 多足步态发生器」跑起来，
 * 而不引入 FullBodyIK 这类迭代数值解算器。
 *
 * 结论写在 docs/decisions/ADR-010-spider-locomotion.md，这里只做可跑的证明：
 *   1) 每条腿 = coxa(yaw) + femur/tibia 两骨解析 IK —— 余弦定理闭式解，零迭代；
 *   2) 8 条腿按 alternating tripod 分两组，相位差半周期；
 *   3) 支撑相把脚的世界坐标**锁死**（不滑步），摆动相才更新落点；
 *   4) 身体高度/起伏只是 body.position.y，IK 每帧跟着重解，没有任何反馈回路。
 */
import * as THREE from 'three';

const V3 = THREE.Vector3;
const UP = new V3(0, 1, 0);

// ── 体型参数（米）──────────────────────────────────────────────────────────
const BODY = { w: 0.38, h: 0.15, len: 0.62 };
const FEMUR = 0.38;
const TIBIA = 0.38;

/** 四对髋点（body 局部）：x 左右，y 向下为负，z 前后。 */
const HIP_Z = [0.26, 0.09, -0.09, -0.26];
/** 落脚点方位角（相对外侧 +X）：前腿朝前，后腿朝后，扇形展开。 */
const FOOT_DEG = [56, 18, -18, -56];
/** 静止时落脚点到髋的水平距离。 */
const FOOT_REACH = 0.40;

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
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0d10');
scene.fog = new THREE.Fog('#0b0d10', 9, 20);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);

scene.add(new THREE.HemisphereLight('#9fc6ff', '#1a2230', 1.15));
const sun = new THREE.DirectionalLight('#fff4e0', 1.9);
sun.position.set(3.2, 6.4, 2.6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -4; sun.shadow.camera.right = 4;
sun.shadow.camera.top = 4; sun.shadow.camera.bottom = -4;
scene.add(sun);
scene.add(sun.target);

// 地面：网格随身体取整平移，做出「无限地面」的错觉，也方便看脚有没有滑
const grid = new THREE.GridHelper(24, 24, 0x2b3648, 0x1a2230);
grid.material.transparent = true;
grid.material.opacity = 0.75;
scene.add(grid);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshLambertMaterial({ color: '#12161d' }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.002;
floor.receiveShadow = true;
scene.add(floor);

// ── 体素零件 ─────────────────────────────────────────────────────────────
function box(w, h, d, color, emissive) {
  const mat = new THREE.MeshLambertMaterial({ color });
  if (emissive) { mat.emissive = new THREE.Color(color); mat.emissiveIntensity = 0.6; }
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

const COL = {
  body: '#3b3050', shell: '#4d3f6b', head: '#6a5b8f',
  legL: '#2f8a76',        // 左腿染青、右腿灰蓝：只为截图时能一眼数清 8 条腿
  legR: '#3f4a5c',
  joint: '#4fe0b0',
};

// ── 蜘蛛骨架 ─────────────────────────────────────────────────────────────
function buildSpider() {
  const group = new THREE.Group();          // 世界位置 + 朝向
  const body = new THREE.Group();           // 体高 / 起伏
  group.add(body);

  const shell = box(BODY.w, BODY.h, BODY.len, COL.shell);
  shell.position.y = 0;
  body.add(shell);

  const head = box(BODY.w * 0.72, BODY.h * 0.78, 0.18, COL.head);
  head.position.set(0, 0.005, BODY.len / 2 + 0.05);
  body.add(head);

  // 两只眼（纯装饰，用来一眼看出朝向）
  for (const s of [-1, 1]) {
    const eye = box(0.045, 0.045, 0.03, '#ff6b8a', true);
    eye.position.set(s * 0.07, 0.045, BODY.len / 2 + 0.13);
    body.add(eye);
  }

  const legs = [];
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1;
    const k = i % 4;
    const hip = new THREE.Group();
    hip.name = `hip-${i}`;
    hip.rotation.order = 'YXZ';             // 先 yaw 再 pitch，平面解才成立
    hip.position.set(side * (BODY.w / 2 - 0.01), 0.015, HIP_Z[k]);
    body.add(hip);

    // 髋关节块：体素风格里用一块高亮小方块代替球
    const knob = box(0.072, 0.072, 0.072, COL.joint);
    hip.add(knob);

    const femur = new THREE.Group();
    femur.rotation.order = 'YXZ';
    hip.add(femur);
    const legColor = side < 0 ? COL.legL : COL.legR;
    const femurMesh = box(0.058, FEMUR, 0.058, legColor);
    femurMesh.position.y = -FEMUR / 2;
    femur.add(femurMesh);

    const tibia = new THREE.Group();
    tibia.rotation.order = 'YXZ';
    tibia.position.y = -FEMUR;
    femur.add(tibia);
    const tibiaMesh = box(0.046, TIBIA, 0.046, legColor);
    tibiaMesh.position.y = -TIBIA / 2;
    tibia.add(tibiaMesh);

    // 脚端小块，落地时看得见接触点
    const tip = box(0.056, 0.03, 0.056, COL.joint);
    tip.position.y = -TIBIA;
    tibia.add(tip);

    // 静止落脚点（body 局部）：从髋点朝「外侧 + 前后偏角」张开 FOOT_REACH
    const baseAng = THREE.MathUtils.degToRad(FOOT_DEG[k]);
    const home = new V3(
      hip.position.x + Math.cos(baseAng) * FOOT_REACH * side,
      0,
      hip.position.z + Math.sin(baseAng) * FOOT_REACH,
    );

    // 三角步态分组：同一侧相邻腿异相，异侧相邻腿同相 → 任何时刻 4 脚着地
    const grp = (i < 4 ? 0 : 1) ^ (i % 2);

    legs.push({
      index: i, side, k, hip, femur, tibia, home,
      phaseOffset: grp * 0.5,
      foot: new V3(),
      from: new V3(),
      to: new V3(),
      swinging: false,
      ik: { clamped: false, reach: 0 },
    });
  }

  return { group, body, legs };
}

const spider = buildSpider();
scene.add(spider.group);

// ── 参数 ─────────────────────────────────────────────────────────────────
const params = { speed: 1.4, stride: 0.42, lift: 0.09, height: 0.38, turn: 0, duty: 0.6 };
let phase = 0;
let time = 0;
const stats = { maxReach: 0, clamped: 0, speed: 0 };

const forward = new V3();

/** 脚在当前身体位姿下的「静止落点」（世界坐标）。 */
function homeWorld(leg, out) {
  out.set(leg.home.x, 0, leg.home.z);
  out.applyAxisAngle(UP, spider.group.rotation.y);
  out.add(spider.group.position);
  return out;
}

function resetPose() {
  phase = 0;
  spider.group.position.set(0, 0, 0);
  spider.group.rotation.y = Math.PI;      // 初始朝 -Z，正对相机
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

    // 世界 → body 局部 → 相对髋
    tmpLocal.copy(leg.foot);
    spider.body.worldToLocal(tmpLocal);
    tmpLocal.sub(leg.hip.position);

    const sol = solveLeg(tmpLocal.x, tmpLocal.y, tmpLocal.z, FEMUR, TIBIA);
    leg.hip.rotation.y = sol.yaw;
    leg.femur.rotation.x = sol.femurPitch;
    leg.tibia.rotation.x = sol.tibiaPitch;

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
    spider.group.position.x + 1.55,
    spider.group.position.y + 1.32,
    spider.group.position.z + 2.15,
  );
  camera.lookAt(spider.group.position.x, spider.group.position.y + 0.26, spider.group.position.z);
  sun.target.position.copy(spider.group.position);
  sun.position.set(spider.group.position.x + 3.2, 6.4, spider.group.position.z + 2.6);
  grid.position.set(
    Math.round(spider.group.position.x),
    0,
    Math.round(spider.group.position.z),
  );
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
    `maxReach ${(stats.maxReach * 100).toFixed(0)}%  (${FEMUR + TIBIA}m 臂展)\n` +
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
