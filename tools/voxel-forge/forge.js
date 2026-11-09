/**
 * voxel forge · 方盒子角色造型工坊
 *
 * 目的：写一份 JSON 描述「一堆盒子 + 层级 + 颜色」，立刻看到 3D 造型，
 * 满意后一键导出成可以粘进 `src/presentation/*-rig.ts` 的 TS 片段。
 * 它**不做动画**（动画仍由 rig 的 IK / 步态负责），只解决「造型迭代太慢」：
 * 原来改一个盒子的尺寸要改 TS → tsc → build → 开游戏 → 截图，一轮 40 秒。
 *
 * spec 结构（全部单位米 / 角度度）：
 *   {
 *     "name": "spider-body",
 *     "parts": [
 *       { "id": "carapace", "at": [0, 0.35, 0.15], "color": "#3c3358",
 *         "boxes": [[w, h, d, x, y, z, rx?, ry?, rz?], ...] },
 *       { "id": "hip-0", "parent": "carapace", "at": [-0.15, 0, 0.25],
 *         "rot": [0, -20, 0], "color": "#5d4f82", "boxes": [[...]] }
 *     ]
 *   }
 *
 * 约定：同一个 part 的所有盒子共用一个顶点色（合并成一个 mesh）——
 * 与 `spider-rig.ts` 的 `partMesh` 完全一致，所以导出的代码可以直接用。
 */

import * as THREE from 'three';

const q = new URLSearchParams(location.search);
const skip = (...ks) => ks.some((k) => q.has(k));
const hud = document.getElementById('hud');
const errBox = document.getElementById('err');

const fail = (msg) => {
  errBox.style.display = 'grid';
  errBox.textContent = `voxel forge\n\n${msg}`;
  throw new Error(msg);
};

// ── 渲染器 ──────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(q.get('bg') || '#12151c');

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.01, 200);

// 三盏灯：半球补环境、主光给方向、侧逆光勾轮廓（与游戏里的打光一致）
scene.add(new THREE.HemisphereLight('#a9bce8', '#191d26', 2.0));
const sun = new THREE.DirectionalLight('#ffe6c2', 1.5);
sun.position.set(2.4, 4.2, 3.0);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
const sc = sun.shadow.camera;
sc.left = -2.5; sc.right = 2.5; sc.top = 2.5; sc.bottom = -2.5; sc.near = 0.1; sc.far = 20;
scene.add(sun, sun.target);
const rim = new THREE.DirectionalLight('#7d8fff', 0.75);
rim.position.set(-3.2, 1.8, -2.6);
scene.add(rim);

// 地面 + 网格：给造型一个尺度参照，1 格 = 0.5 m
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshLambertMaterial({ color: '#151a23' }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const grid = new THREE.GridHelper(12, 24, 0x2f3a4e, 0x1a202b);
grid.position.y = 0.001;
scene.add(grid);

// 软接触阴影：硬投影之外再压一层暗斑，落地感立刻不一样
const contact = new THREE.Mesh(
  new THREE.CircleGeometry(0.6, 40),
  new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.3, depthWrite: false }),
);
contact.rotation.x = -Math.PI / 2;
contact.position.y = 0.004;
scene.add(contact);

// ── 几何：盒子合并（与 spider-rig 的 mergeParts 同一套做法）──────────────
function mergeBoxes(boxes, color) {
  const geos = boxes.map(([w, h, d, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0]) => {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rx) g.rotateX(rx);
    if (ry) g.rotateY(ry);
    if (rz) g.rotateZ(rz);
    g.translate(x, y, z);
    return g;
  });
  let vTotal = 0;
  let iTotal = 0;
  for (const g of geos) { vTotal += g.attributes.position.count; iTotal += g.index.count; }
  const pos = new Float32Array(vTotal * 3);
  const nor = new Float32Array(vTotal * 3);
  const col = new Float32Array(vTotal * 3);
  const idx = vTotal > 65535 ? new Uint32Array(iTotal) : new Uint16Array(iTotal);

  const c = new THREE.Color(color);
  let vo = 0;
  let io = 0;
  for (const g of geos) {
    const vc = g.attributes.position.count;
    pos.set(g.attributes.position.array, vo * 3);
    nor.set(g.attributes.normal.array, vo * 3);
    for (let v = 0; v < vc; v++) {
      col[(vo + v) * 3] = c.r;
      col[(vo + v) * 3 + 1] = c.g;
      col[(vo + v) * 3 + 2] = c.b;
    }
    const gi = g.index.array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
    vo += vc;
    io += gi.length;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingSphere();
  return out;
}

const vmat = new THREE.MeshLambertMaterial({ vertexColors: true });
const gmat = new THREE.MeshBasicMaterial({ vertexColors: true });

// ── 相机轨道 ────────────────────────────────────────────────────────────
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d);
const cam = {
  yaw: num('yaw', 34),
  pitch: num('pitch', 18),
  dist: num('dist', 0),
  target: new THREE.Vector3(0, 0.4, 0),
};

function applyCam() {
  const p = THREE.MathUtils.degToRad(cam.pitch);
  const y = THREE.MathUtils.degToRad(cam.yaw);
  camera.position.set(
    cam.target.x + Math.sin(y) * Math.cos(p) * cam.dist,
    cam.target.y + Math.sin(p) * cam.dist,
    cam.target.z + Math.cos(y) * Math.cos(p) * cam.dist,
  );
  camera.lookAt(cam.target);
}

// 拖拽 / 滚轮 / 右键平移
let drag = null;
renderer.domElement.addEventListener('pointerdown', (e) => {
  drag = { x: e.clientX, y: e.clientY, btn: e.button };
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointerup', () => { drag = null; });
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  drag.x = e.clientX;
  drag.y = e.clientY;
  if (drag.btn === 2) {
    cam.target.x -= dx * cam.dist * 0.0016;
    cam.target.z -= dy * cam.dist * 0.0016;
  } else {
    cam.yaw -= dx * 0.32;
    cam.pitch = Math.max(-12, Math.min(86, cam.pitch + dy * 0.24));
  }
  applyCam();
});
renderer.domElement.addEventListener('wheel', (e) => {
  e.preventDefault();
  cam.dist = Math.max(0.3, Math.min(40, cam.dist * (1 + Math.sign(e.deltaY) * 0.09)));
  applyCam();
}, { passive: false });
renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

// ── 构建 ────────────────────────────────────────────────────────────────
let built = null;

function build(spec) {
  const root = new THREE.Group();
  root.name = spec.name || 'forge-root';
  if (spec.scale) root.scale.setScalar(spec.scale);
  scene.add(root);

  const byId = new Map();
  let meshes = 0;
  let tris = 0;

  for (const part of spec.parts || []) {
    const node = new THREE.Group();
    node.name = part.id || `part-${byId.size}`;
    if (part.at) node.position.fromArray(part.at);
    if (part.rot) node.rotation.set(...part.rot.map(THREE.MathUtils.degToRad));
    if (part.scale) node.scale.setScalar(part.scale);
    const parent = part.parent ? byId.get(part.parent) : root;
    if (!parent) fail(`part "${part.id}" 的 parent "${part.parent}" 不存在（必须先生成父节点）`);
    parent.add(node);
    byId.set(node.name, node);

    const boxes = part.boxes || [];
    if (!boxes.length) continue;
    const geo = mergeBoxes(boxes, part.color || '#8a8a96');
    const mesh = new THREE.Mesh(geo, part.glow ? gmat : vmat);
    mesh.castShadow = !part.glow;
    mesh.receiveShadow = !part.glow;
    node.add(mesh);
    meshes++;
    tris += (geo.index ? geo.index.count : geo.attributes.position.count) / 3;
  }

  root.updateMatrixWorld(true);
  const bbox = new THREE.Box3().setFromObject(root);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());

  // 没显式给距离就自动取景：对角线 × 1.5，保证整只都在画面里
  if (!cam.dist) {
    cam.dist = Math.max(0.6, size.length() * 1.5);
    cam.target.set(center.x, center.y * 0.92, center.z);
    applyCam();
  }
  contact.position.set(center.x, 0.004, center.z);
  contact.scale.setScalar(Math.max(0.4, Math.max(size.x, size.z) * 0.9));

  built = { spec, root, meshes, tris, bbox, size, center, byId };
  renderHud();
  return built;
}

function renderHud() {
  if (!built) {
    hud.innerHTML = '<b>voxel forge</b>\n<span class="k">loading…</span>';
    return;
  }
  const { spec, meshes, tris, size, center } = built;
  const boxes = (spec.parts || []).reduce((n, p) => n + (p.boxes || []).length, 0);
  hud.innerHTML = [
    `<b>${spec.name || '(unnamed)'}</b>`,
    `<span class="k">parts</span>   ${(spec.parts || []).length}`,
    `<span class="k">boxes</span>   ${boxes}  <span class="k">→ mesh</span> ${meshes}`,
    `<span class="k">tris</span>    ${tris}`,
    `<span class="k">size</span>    ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)} m`,
    `<span class="k">center</span>  y ${center.y.toFixed(2)}`,
    `<span class="k">cam</span>     ${cam.yaw.toFixed(0)}° / ${cam.pitch.toFixed(0)}° / ${cam.dist.toFixed(2)}m`,
  ].join('\n');
}

// ── 对外接口（给截图脚本用）────────────────────────────────────────────
window.__forge = {
  ready: false,
  stats: () => (built ? {
    name: built.spec.name, parts: (built.spec.parts || []).length,
    meshes: built.meshes, tris: built.tris,
    size: [+built.size.x.toFixed(3), +built.size.y.toFixed(3), +built.size.z.toFixed(3)],
    center: [+built.center.x.toFixed(3), +built.center.y.toFixed(3), +built.center.z.toFixed(3)],
  } : null),
  setCam: ({ yaw, pitch, dist, target }) => {
    if (yaw != null) cam.yaw = yaw;
    if (pitch != null) cam.pitch = pitch;
    if (dist != null) cam.dist = dist;
    if (target) cam.target.fromArray(target);
    applyCam();
    renderHud();
    renderer.render(scene, camera);
  },
  /** 导出成能直接贴进 rig 的 TS 片段。 */
  exportTs: () => {
    if (!built) return '';
    const out = [];
    for (const part of built.spec.parts || []) {
      const boxes = part.boxes || [];
      if (!boxes.length) continue;
      out.push(`  // ${part.id}${part.parent ? ` ← ${part.parent}` : ''}`);
      out.push(`  ${part.id}.add(partMesh([`);
      for (const b of boxes) {
        out.push(`    [${b.map((n) => Number(n).toFixed(3)).join(', ')}],`);
      }
      out.push(`  ], ${JSON.stringify(part.color || '#8a8a96')}));`);
    }
    return out.join('\n');
  },
};

// ── 主循环 ──────────────────────────────────────────────────────────────
function frame() {
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const specUrl = q.get('spec') || './specs/example-biped.json';
fetch(specUrl)
  .then((r) => {
    if (!r.ok) throw new Error(`${specUrl} → HTTP ${r.status}`);
    return r.json();
  })
  .then((spec) => {
    build(spec);
    applyCam();
    frame();
    window.__forge.ready = true;
  })
  .catch((e) => fail(`读取 spec 失败：${e.message}\n\nspec 路径：${specUrl}`));
