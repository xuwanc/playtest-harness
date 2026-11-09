/**
 * v9s.39 · 体素草块（表现层）。v9s.44：缓慢生长 + 枢轴顶点动画。
 *
 * 只做一件事：把 Core 的 `world.grass` 画出来。不写 Core、不自行判定「谁被压倒」，
 * 因此暂停 / 慢放 / 快照回放 / 换平台重写都成立。
 *
 * 性能取舍（对应 docs/systems/grass.md）：
 *  - **一个 InstancedMesh** 装全部草（每根 2 段 box：下段 + 上段），1 个 draw call；
 *    普通 Mesh 方案 2000+ draw call 会直接掉帧。
 *  - `instanceColor` 做色阶；材质 **不透明**（v9s.38 的教训：透明排序会盖掉刀光）、
 *    关 castShadow（几千个投影体不划算）、关视锥剔除（实例包围盒不准）。
 *  - **脏标记 + addUpdateRange 局部上传**：只有 bend / cut / grow 变化的实例才重算矩阵并
 *    上传，静止草场每帧 dirty = 0，CPU 与带宽都趋近于零。
 *  - 碎片走固定大小的对象池，不逐帧 new / dispose。
 */

import * as THREE from 'three';
import {
  DEFAULT_GRASS_WIND, GRASS_PIVOT_LOW, GRASS_PIVOT_UP,
  grassGrowth, windPhase, windShaderParams,
} from '../core';
import type { GrassState, GrassViewConfig, GrassWindConfig, World } from '../core';

/* ---------------- v9s.44 · 枢轴顶点动画（替代 v9s.41 的逐顶点 shear） ----------------
 * 旧（v9s.41）：在 begin_vertex 里对 box 顶点按 h² 加权做**位移** → 每节 box 被拉成
 *   斜平行四边形（shear），且两段共用同一位移场、没有明确「节」。
 * 新（v9s.44）：替换 project_vertex，在「instanceMatrix 缩放之后」的世界空间对每节 box
 *   绕自己的**底部枢轴**做**刚体旋转**：下段绕草根转 low 角，上段先继承下段旋转、
 *   再绕「下段转后顶端」额外转 up 角。
 *   - 旋转是刚体 → 每节 box 的 8 个顶点边长 / 夹角不变，保持完整立方体；
 *   - 两级枢轴 → 段间无缝衔接，顶端总弯折 ≈ atan(sway, L)，草一节一节地弯；
 *   - 公式与 Core.windPivotRotate / windPivotAngles 同源（常量由 Core 插值注入）。
 * 风仍全在 GPU：静态实例属性一次性上传，每帧只改 8 个 uniform，实例矩阵上传量 0。
 * shader 链路：替换 <common>（声明 attribute / uniform / rotAxis）、<project_vertex>
 * （世界空间两级枢轴旋转）、<color_fragment>（明暗浪带）。
 */
const WIND_VERT_HEAD = `#include <common>
attribute vec2 aWindPhase;
attribute vec3 aWindRoot;
attribute vec4 aWindGeom;
uniform float uWindTime;
uniform vec2 uWindDir;
uniform vec2 uWindOmega;
uniform vec2 uWindAmp;
uniform float uWindGust;
uniform float uWindShade;
uniform float uWindOn;
varying float vWindShade;
vec3 rotAxis(vec3 v, vec3 axis, float c, float s) {
  return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
}`;

const WIND_PROJECT = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
{
  // 两波叠加：主浪 + 更短更快的次浪（与 Core.windSample 同式）
  float s1 = sin(aWindPhase.x - uWindOmega.x * uWindTime);
  float s2 = sin(aWindPhase.y - uWindOmega.y * uWindTime);
  float sway = uWindGust * (uWindAmp.x * s1 + uWindAmp.y * s2) * uWindOn * aWindGeom.z;

  // 割断 / 缓慢生长抑制：instanceMatrix 的 Y 列长度 = 当前实际段高，除以设计段高即存活比例。
  // 断茬变矮 → 摆幅按比减弱；上段被隐藏(scale=0) → 完全不摆。无需额外上传。
  vec3 ay = instanceMatrix[1].xyz;
  float designSegH = mix(aWindGeom.x, aWindGeom.y, aWindGeom.w);
  float alive = clamp(length(ay) / max(designSegH, 1e-4), 0.0, 1.0);
  sway *= alive;

  // 草顶摆幅(米) → 倾角：有效力臂 LOW·hBase + hTip（折线弯折的等效力臂），
  // 与 Core.windPivotAngles / windPivotEffLength 同源，顶端实际位移 ≈ sway。
  float effL = ${GRASS_PIVOT_LOW.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${GRASS_PIVOT_LOW.toFixed(2)};
  float tUp  = theta * ${GRASS_PIVOT_UP.toFixed(2)};

  // 世界风向 → 水平旋转轴 (dirZ, 0, -dirX)：草朝风向倾倒；物体空间即世界空间
  vec3 axis = normalize(vec3(uWindDir.y, 0.0, -uWindDir.x));
  vec3 P0 = aWindRoot;                                   // 草根枢轴
  vec3 v = mvPosition.xyz;
  float cL = cos(tLow), sL = sin(tLow);
  vec3 vLow = P0 + rotAxis(v - P0, axis, cL, sL);      // 下段：绕草根刚体转 low

  if (aWindGeom.w > 0.5) {
    // 上段：先继承下段旋转，再绕「下段转后顶端」额外折 up → 与下段顶端无缝
    vec3 P1 = (instanceMatrix * vec4(0.0, -0.5, 0.0, 1.0)).xyz;   // 上段底 = 下段顶
    vec3 P1p = P0 + rotAxis(P1 - P0, axis, cL, sL);
    float cU = cos(tUp), sU = sin(tUp);
    vLow = P1p + rotAxis(vLow - P1p, axis, cU, sU);
  }
  mvPosition.xyz = vLow;

  // 明暗带：波峰亮、波谷暗，形成一条条推进的浪
  vWindShade = 1.0 - uWindShade * uWindOn * (0.5 + 0.5 * s1) * alive;
}
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`;

const WIND_FRAG_HEAD = `#include <common>
varying float vWindShade;`;

const WIND_FRAG_BODY = `#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;

type WindUniforms = {
  uWindTime: { value: number };
  uWindDir: { value: THREE.Vector2 };
  uWindOmega: { value: THREE.Vector2 };
  uWindAmp: { value: THREE.Vector2 };
  uWindGust: { value: number };
  uWindShade: { value: number };
  uWindOn: { value: number };
};

/** 建静态实例属性 + 给材质挂 uniform，返回可每帧改写的 uniform 引用。 */
function installGrassWind(
  mat: THREE.MeshLambertMaterial,
  geo: THREE.BoxGeometry,
  state: GrassState,
  view: GrassViewConfig,
  cfg: GrassWindConfig,
): WindUniforms {
  const count = Math.min(state.blades.length, Math.floor(Math.max(0, view.maxInstances) / 2));
  const total = count * 2;
  const phase = new Float32Array(total * 2);   // aWindPhase vec2：两波静态相位
  const root = new Float32Array(total * 3);    // aWindRoot  vec3：草根世界坐标（枢轴 P0）
  const geom = new Float32Array(total * 4);    // aWindGeom  vec4：下段设计高 / 上段设计高 / 高度增益 / 是否上段
  const seg = Math.max(0.01, view.segmentHeight);

  for (let i = 0; i < count; i++) {
    const b = state.blades[i];
    const hBase = Math.min(seg, b.height);
    const hTip = Math.max(0, b.height - hBase);
    // 相位抖动由已有的 yaw 派生：不新增 rnd() 调用，草的分布逐字节不变。
    const [p1, p2] = windPhase(cfg, b.x, b.z, b.yaw * cfg.jitter);
    const gain = Math.min(1.4, Math.max(0.6, b.height / (seg * 1.5)));
    for (let s = 0; s < 2; s++) {
      const idx = i * 2 + s;
      phase[idx * 2] = p1;
      phase[idx * 2 + 1] = p2;
      root[idx * 3] = b.x;
      root[idx * 3 + 1] = b.y;
      root[idx * 3 + 2] = b.z;
      geom[idx * 4] = hBase;       // 下段设计高
      geom[idx * 4 + 1] = hTip;    // 上段设计高
      geom[idx * 4 + 2] = gain;    // 高度增益
      geom[idx * 4 + 3] = s;       // 0 = 下段，1 = 上段
    }
  }
  geo.setAttribute('aWindPhase', new THREE.InstancedBufferAttribute(phase, 2));
  geo.setAttribute('aWindRoot', new THREE.InstancedBufferAttribute(root, 3));
  geo.setAttribute('aWindGeom', new THREE.InstancedBufferAttribute(geom, 4));

  const q = windShaderParams(cfg);
  const u: WindUniforms = {
    uWindTime: { value: 0 },
    uWindDir: { value: new THREE.Vector2(q.dirX, q.dirZ) },
    uWindOmega: { value: new THREE.Vector2(q.omega1, q.omega2) },
    uWindAmp: { value: new THREE.Vector2(q.amp1, q.amp2) },
    uWindGust: { value: 1 },
    uWindShade: { value: q.shadeAmount },
    uWindOn: { value: cfg.enabled ? 1 : 0 },
  };

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', WIND_VERT_HEAD)
      .replace('#include <project_vertex>', WIND_PROJECT);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', WIND_FRAG_HEAD)
      .replace('#include <color_fragment>', WIND_FRAG_BODY);
  };
  // 避免与其他 Lambert 材质共用编译缓存，导致 uniform 没被挂上。
  mat.customProgramCacheKey = () => 'grass-wind-pivot-v2';
  return u;
}

export type GrassDebug = {
  enabled: boolean;
  blades: number;
  patches: number;
  instances: number;
  /** 草 + 碎片两个 InstancedMesh，恒为 2（不随草数量增长） */
  drawCalls: number;
  /** 本帧重算并上传的实例数 */
  dirty: number;
  bent: number;
  cut: number;
  debris: number;
  /** v9s.44 · 当前正在缓慢生长（0 < grow < 1）的草根数 */
  growing: number;
  /** v9s.44 · 生长中草的平均进度 0..1（验收「连续长高」而非瞬间弹回） */
  avgGrowth: number;
  /** v9s.44 · 前 8 根草的当前渲染高度 / 原高（0..1）；割这批草即可读出连续长高曲线 */
  sampleHeight: number;
  /** v9s.41 · 风场读数（GPU 顶点位移，CPU 每帧零遍历）；mode 标识枢轴方案 */
  wind: { enabled: boolean; time: number; gust: number; mode: 'pivot' };
};

export type GrassLayer = {
  object: THREE.Group;
  update(world: World, frameDt: number): void;
  debug(): GrassDebug;
  dispose(): void;
};

type Debris = {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; total: number;
  size: number;
  spin: number;
};

/** 表现层专用的确定性随机（碎片飞散），与 Core 的 world.rngState 完全无关。 */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createGrassLayer(
  state: GrassState,
  view: GrassViewConfig,
  windCfg: GrassWindConfig = DEFAULT_GRASS_WIND,
): GrassLayer {
  const group = new THREE.Group();
  group.name = 'grass-layer';

  const blades = state.blades;
  const n = blades.length;
  const maxInstances = Math.max(0, Math.floor(view.maxInstances));
  // 每根草占 2 个实例（下段 / 上段），安全阀按实例总数计算。
  const count = Math.min(n, Math.floor(maxInstances / 2));
  const total = count * 2;
  const enabled = view.enabled && total > 0;

  const palette = view.palette.length > 0 ? view.palette : ['#4a8f57'];
  const colors = palette.map((c) => new THREE.Color(c));
  const stump = new THREE.Color(view.stumpColor);
  const debrisColor = new THREE.Color(view.debris.color);

  const box = new THREE.BoxGeometry(1, 1, 1);
  const bladeBox = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: false });
  // 风属性只挂在草的几何体上；碎片用另一份干净的 box，不受 shader 注入影响。
  const windUniforms = installGrassWind(mat, bladeBox, state, view, windCfg);
  const debrisMat = new THREE.MeshLambertMaterial({
    color: debrisColor, transparent: false,
  });

  let mesh: THREE.InstancedMesh | null = null;
  let colorAttr: THREE.InstancedBufferAttribute | null = null;
  let debrisMesh: THREE.InstancedMesh | null = null;
  const debrisPool: Debris[] = [];
  const rnd = seeded(0x9e3779b9 ^ count);

  const prevBend = new Float32Array(count);
  const prevCut = new Uint8Array(count);
  const prevGrow = new Float32Array(count);
  const first = new Uint8Array(count).fill(1);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const qBend = new THREE.Quaternion();
  const qLean = new THREE.Quaternion();
  const axis = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const root = new THREE.Vector3();
  const tmpColor = new THREE.Color();
  const baseColor = new THREE.Color();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

  let lastDirty = 0;
  let lastBent = 0;
  let lastCut = 0;
  let lastGrowing = 0;
  let lastAvgGrowth = 1;
  let lastSampleHeight = 1;
  const SAMPLE_N = 8;
  let lastWind = { enabled: windCfg.enabled, time: 0, gust: 1, mode: 'pivot' as const };

  /** 按色阶取颜色：palette 首尾之间线性插值。 */
  function toneColor(t: number, out: THREE.Color): THREE.Color {
    if (colors.length === 1) return out.copy(colors[0]);
    const f = Math.max(0, Math.min(colors.length - 1, t * (colors.length - 1)));
    const k = Math.min(colors.length - 2, Math.max(0, Math.floor(f)));
    return out.copy(colors[k]).lerp(colors[k + 1], Math.min(1, Math.max(0, f - k)));
  }

  if (enabled) {
    mesh = new THREE.InstancedMesh(bladeBox, mat, total);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.name = 'grass-blades';
    // 先触发 instanceColor 的惰性创建，之后就能按脏区间局部上传颜色。
    mesh.setColorAt(0, colors[0]);
    colorAttr = mesh.instanceColor;
    if (colorAttr) colorAttr.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < total; i++) mesh.setMatrixAt(i, hidden);
    group.add(mesh);

    const dmax = Math.max(1, Math.floor(view.debris.max));
    debrisMesh = new THREE.InstancedMesh(box, debrisMat, dmax);
    debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    debrisMesh.castShadow = false;
    debrisMesh.receiveShadow = false;
    debrisMesh.frustumCulled = false;
    debrisMesh.name = 'grass-debris';
    for (let i = 0; i < dmax; i++) debrisMesh.setMatrixAt(i, hidden);
    group.add(debrisMesh);
  }
  group.visible = enabled;

  function spawnDebris(bx: number, by: number, bz: number, dirX: number, dirZ: number, size: number): void {
    if (!debrisMesh) return;
    const dmax = debrisMesh.count;
    if (debrisPool.length >= dmax) return;
    const totalLife = view.debris.life;
    const push = 1.1 + rnd() * 1.5;
    debrisPool.push({
      x: bx, y: by, z: bz,
      vx: dirX * push + (rnd() - 0.5) * 1.2,
      vy: 1.9 + rnd() * 1.8,
      vz: dirZ * push + (rnd() - 0.5) * 1.2,
      life: totalLife, total: totalLife,
      size: size * (0.55 + rnd() * 0.45),
      spin: (rnd() - 0.5) * 9,
    });
  }

  function updateDebris(dt: number): void {
    if (!debrisMesh) return;
    const dmax = debrisMesh.count;
    const g = 12;
    for (let i = debrisPool.length - 1; i >= 0; i--) {
      const d = debrisPool[i];
      d.life -= dt;
      if (d.life <= 0) {
        debrisPool.splice(i, 1);
        continue;
      }
      d.vy -= g * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.z += d.vz * dt;
      if (d.y < 0.02) { d.y = 0.02; d.vy = -d.vy * 0.25; d.vx *= 0.6; d.vz *= 0.6; }
    }
    const fade = 0.0001;
    for (let i = 0; i < dmax; i++) {
      const d = debrisPool[i];
      if (!d) { debrisMesh.setMatrixAt(i, hidden); continue; }
      const k = Math.max(fade, d.life / d.total);
      pos.set(d.x, d.y, d.z);
      axis.set(0.4 + i * 0.13, 1, 0.2).normalize();
      q.setFromAxisAngle(axis, d.spin * (d.total - d.life));
      scale.set(d.size * k, d.size * 0.7 * k, d.size * k);
      m.compose(pos, q, scale);
      debrisMesh.setMatrixAt(i, m);
    }
    debrisMesh.instanceMatrix.needsUpdate = true;
  }

  return {
    object: group,

    update(world: World, frameDt: number): void {
      if (!enabled || !mesh) return;
      const g = world.grass;

      // v9s.41：风每帧只更新 uniform（8 个标量），不遍历实例、不触发矩阵上传。
      // 参数从 Core 的 windShaderParams 现算，调试面板改风向 / 波长也能实时生效。
      const wc = world.config.grass?.wind ?? DEFAULT_GRASS_WIND;
      const wq = windShaderParams(wc);
      const wt = g.wind?.time ?? 0;
      const wg = g.wind?.gust ?? 1;
      windUniforms.uWindTime.value = wt;
      windUniforms.uWindGust.value = wg;
      windUniforms.uWindDir.value.set(wq.dirX, wq.dirZ);
      windUniforms.uWindOmega.value.set(wq.omega1, wq.omega2);
      windUniforms.uWindAmp.value.set(wq.amp1, wq.amp2);
      windUniforms.uWindShade.value = wq.shadeAmount;
      windUniforms.uWindOn.value = wc.enabled ? 1 : 0;
      lastWind = { enabled: wc.enabled, time: wt, gust: wg, mode: 'pivot' };

      // 复位 / 换场景后草数组长度不会变（只重置状态），但仍做一次防御。
      const len = Math.min(count, g.blades.length);
      const dt = Math.min(0.05, Math.max(0, frameDt));
      const grassCfg = world.config.grass;
      const regrowSec = grassCfg?.regrowSec ?? 0;
      const stumpRatio = Math.min(1, Math.max(0.05, grassCfg?.stumpRatio ?? 0.34));
      const seg = view.segmentHeight;
      const TWO_PI = Math.PI * 2;

      mesh.instanceMatrix.clearUpdateRanges();
      if (colorAttr) colorAttr.clearUpdateRanges();
      let dirty = 0;
      let bent = 0;
      let cut = 0;
      let growing = 0;
      let growSum = 0;
      let sampleSum = 0;
      let sampleN = 0;

      for (let i = 0; i < len; i++) {
        const b = g.blades[i];
        const isCut = b.cut !== 0 ? 1 : 0;
        // v9s.44 缓慢生长：生长进度由 Core 的 cut 派生（smoothstep + 逐根错峰），
        // 不累积帧时间 → 暂停 / 慢放 / 快照回放都成立。逐根相位由既有 yaw 派生。
        const phase = b.yaw / TWO_PI;
        const grow = grassGrowth(b.cut, regrowSec, phase);
        const hBase = Math.min(seg, b.height);   // 设计下段高
        const stumpH = hBase * stumpRatio;
        const curH = stumpH + (b.height - stumpH) * grow;
        if (i < SAMPLE_N) { sampleSum += curH / Math.max(1e-6, b.height); sampleN += 1; }
        if (grow > 1e-3 && grow < 1 - 1e-3) { growing += 1; growSum += grow; }

        const changed = first[i] === 1
          || Math.abs(b.bend - prevBend[i]) > 1e-4
          || isCut !== prevCut[i]
          || Math.abs(grow - prevGrow[i]) > 1e-3;
        if (!changed) {
          if (b.bend > 0.02) bent += 1;
          if (isCut) cut += 1;
          continue;
        }

        // 新割断：从断裂高度抛出碎片（表现层只读状态比较，不依赖事件细节）。
        if (isCut && !prevCut[i] && first[i] !== 1) {
          spawnDebris(
            b.x, b.y + hBase * 0.75, b.z,
            b.bendX || 1, b.bendZ || 0,
            b.width * 1.5,
          );
          spawnDebris(
            b.x, b.y + hBase + (b.height - hBase) * 0.5, b.z,
            b.bendX || 1, b.bendZ || 0,
            b.width * 1.2,
          );
        }

        // 组合旋转：初始轻微倾斜 → 压弯（绕根部的水平轴）。两节共用 q（整根一起倒）。
        axis.set(Math.cos(b.yaw), 0, -Math.sin(b.yaw));
        qLean.setFromAxisAngle(axis, b.lean);
        axis.set(b.bendZ, 0, -b.bendX);
        qBend.setFromAxisAngle(axis, b.bend);
        q.copy(qBend).multiply(qLean);

        root.set(b.x, b.y, b.z);

        // v9s.44：按 grow 从「断茬高」连续长回「原高」，再按当前总高重新分配两节高度。
        // curH < seg 时只有下段在变高；curH ≥ seg 后上段才出现并逐渐长高 → 自然的缓慢长长。
        const hLower = Math.min(seg, curH);
        const hUpper = Math.max(0, curH - seg);

        // 下段
        pos.set(0, hLower * 0.5, 0).applyQuaternion(q).add(root);
        scale.set(b.width, hLower, b.width);
        m.compose(pos, q, scale);
        mesh.setMatrixAt(i * 2, m);

        // 上段：长到一格以上才出现；完好时即为设计的 hTip。割断 / 生长中按 grow 连续。
        if (hUpper < 1e-4) {
          mesh.setMatrixAt(i * 2 + 1, hidden);
        } else {
          pos.set(0, hLower + hUpper * 0.5, 0).applyQuaternion(q).add(root);
          scale.set(b.width * 0.84, hUpper, b.width * 0.84);
          m.compose(pos, q, scale);
          mesh.setMatrixAt(i * 2 + 1, m);
        }

        // 颜色：完好按色阶；割断 / 生长中从断茬色随 grow 淡回本色（不再突然变色）。
        toneColor(b.tone, baseColor);
        if (grow >= 1) tmpColor.copy(baseColor);
        else tmpColor.copy(stump).lerp(baseColor, grow);
        mesh.setColorAt(i * 2, tmpColor);
        mesh.setColorAt(i * 2 + 1, tmpColor);

        // 局部上传：Matrix4 = 16 floats ×2 实例；Color = 3 floats ×2 实例。
        mesh.instanceMatrix.addUpdateRange(i * 32, 32);
        if (colorAttr) colorAttr.addUpdateRange(i * 6, 6);

        prevBend[i] = b.bend;
        prevCut[i] = isCut;
        prevGrow[i] = grow;
        first[i] = 0;
        dirty += 1;
        if (b.bend > 0.02) bent += 1;
        if (isCut) cut += 1;
      }

      if (dirty > 0) {
        mesh.instanceMatrix.needsUpdate = true;
        if (colorAttr) colorAttr.needsUpdate = true;
      }
      updateDebris(dt);

      lastDirty = dirty;
      lastBent = bent;
      lastCut = cut;
      lastGrowing = growing;
      lastAvgGrowth = growing > 0 ? growSum / growing : 1;
      lastSampleHeight = sampleN > 0 ? sampleSum / sampleN : 1;
    },

    debug(): GrassDebug {
      return {
        enabled,
        blades: n,
        patches: state.patches.length,
        instances: total,
        drawCalls: enabled ? 2 : 0,
        dirty: lastDirty,
        bent: lastBent,
        cut: lastCut,
        debris: debrisPool.length,
        growing: lastGrowing,
        avgGrowth: lastAvgGrowth,
        sampleHeight: lastSampleHeight,
        wind: { ...lastWind },
      };
    },

    dispose(): void {
      box.dispose();
      bladeBox.dispose();
      mat.dispose();
      debrisMat.dispose();
      group.clear();
    },
  };
}
