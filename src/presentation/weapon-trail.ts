import * as THREE from 'three';

/**
 * 挥击拖尾（v9s.22，纯表现层）。
 *
 * 为什么需要它：方块人的挥击幅度再大，也是「一帧一个姿势」，玩家看到的是
 * 手臂/武器在几帧之间瞬移，而不是一条划过的轨迹。动画里让打击感成立的不是
 * 姿势本身，而是**轨迹** —— 2D 用 smear frame，3D 就是刀光 ribbon。
 *
 * 做法：每帧取武器的「刃根 / 刃尖」世界坐标，按最小步长采样，用三角形带
 * 连成一片，颜色按年龄衰减（加色混合下「变暗」等于「淡出」）。
 * 只有刃尖跑得够快时才记录，所以站着不动不会拖一条常亮的尾巴。
 *
 * 不读 World、不写 Core、不引入随机与本地时间（用传入的 dt 累加年龄）。
 */

export type TrailConfig = {
  enabled: boolean;
  /** 最多保留多少采样点（≈ 轨迹长度 / 帧） */
  maxSamples: number;
  /** 两个采样点之间的最小世界距离（m），避免静止时堆点 */
  minStep: number;
  /** 单个采样点的存活时长（秒），决定拖尾长度 */
  life: number;
  /** 触发拖尾的最低刃尖速度（m/s） */
  minSpeed: number;
  /** 基础颜色（十六进制字符串） */
  color: string;
  /** 整体亮度倍率（加色混合，越小越淡） */
  intensity: number;
  /** 刃尖一侧额外提亮（0 = 与刃根同色，1 = 尖端更亮） */
  tipBoost: number;
};

type Sample = {
  bx: number; by: number; bz: number;
  tx: number; ty: number; tz: number;
  age: number;
  /** 采样时的刃尖速度，用于让「慢挥」比「快挥」更暗 */
  speed: number;
};

export type WeaponTrail = {
  object: THREE.Mesh;
  /** 每帧调用：active = 本帧是否处于「划动」状态（攻击 / 冲刺等） */
  update(
    dt: number,
    blade: { base: { x: number; y: number; z: number }; tip: { x: number; y: number; z: number } } | null,
    active: boolean,
  ): void;
  /** 换武器 / 复位时清空，避免残留一段旧轨迹 */
  reset(): void;
  /** 诊断读数：当前采样点数量与是否可见（供验收 / 调试面板） */
  debug(): { count: number; visible: boolean; speed: number; moved: number; hasBlade: boolean; active: boolean };
  dispose(): void;
};

export function createWeaponTrail(cfg: TrailConfig): WeaponTrail {
  const max = Math.max(2, Math.floor(cfg.maxSamples));
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(max * 2 * 3);
  const col = new Float32Array(max * 2 * 3);
  const posAttr = new THREE.BufferAttribute(pos, 3);
  const colAttr = new THREE.BufferAttribute(col, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  colAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('color', colAttr);
  const index: number[] = [];
  for (let i = 0; i < max - 1; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    index.push(a, b, c, b, d, c);
  }
  geo.setIndex(index);
  geo.setDrawRange(0, 0);

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 6;
  mesh.visible = false;

  const baseColor = new THREE.Color(cfg.color);
  let samples: Sample[] = [];
  let prevTip: { x: number; y: number; z: number } | null = null;
  let lastSpeed = 0;
  let lastMoved = 0;
  let lastHasBlade = false;
  let lastActive = false;

  function rebuild(): void {
    const n = samples.length;
    if (n < 2 || !cfg.enabled) {
      mesh.visible = false;
      geo.setDrawRange(0, 0);
      return;
    }
    const life = Math.max(1e-3, cfg.life);
    for (let i = 0; i < n; i++) {
      const s = samples[i];
      const t = Math.max(0, 1 - s.age / life);
      // 两端收窄：最老的一段接近 0，最新的一段刚到 1，避免轨迹「啪」地出现/消失
      const fade = t * t;
      const speedGain = Math.min(1, s.speed / Math.max(1e-3, cfg.minSpeed * 2));
      const bright = cfg.intensity * fade * (0.55 + 0.45 * speedGain);
      const o = i * 6;
      pos[o] = s.bx; pos[o + 1] = s.by; pos[o + 2] = s.bz;
      pos[o + 3] = s.tx; pos[o + 4] = s.ty; pos[o + 5] = s.tz;
      const r = baseColor.r * bright;
      const g = baseColor.g * bright;
      const b2 = baseColor.b * bright;
      // 刃根一侧压暗：刀光的视觉重心在刀尖，整条带子等亮会变成一根「白棍」。
      const rb = r * 0.22;
      const gb = g * 0.22;
      const bb = b2 * 0.22;
      col[o] = rb; col[o + 1] = gb; col[o + 2] = bb;
      const tb = 1 + cfg.tipBoost;
      col[o + 3] = Math.min(1, r * tb);
      col[o + 4] = Math.min(1, g * tb);
      col[o + 5] = Math.min(1, b2 * tb);
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    geo.setDrawRange(0, (n - 1) * 6);
    mesh.visible = true;
  }

  return {
    object: mesh,
    update(dt, blade, active) {
      if (!cfg.enabled) {
        mesh.visible = false;
        return;
      }
      const step = Math.max(0, dt);
      for (const s of samples) s.age += step;
      while (samples.length > 0 && samples[0].age > cfg.life) samples.shift();

      if (blade) {
        const speed = prevTip
          ? Math.hypot(blade.tip.x - prevTip.x, blade.tip.y - prevTip.y, blade.tip.z - prevTip.z)
            / Math.max(1e-4, step)
          : 0;
        const last = samples[samples.length - 1];
        const moved = last
          ? Math.hypot(blade.tip.x - last.tx, blade.tip.y - last.ty, blade.tip.z - last.tz)
          : Infinity;
        // 门槛只看「挪了多远」，不看「多快」：暂停 / 单步调试时 frameDt 不可靠
        // （同一帧可能被渲染多次，速度算出来是 0），用位移判断才是稳定的。
        // 速度只用于亮度 —— 挥得越快轨迹越亮。
        if (active && moved >= cfg.minStep) {
          samples.push({
            bx: blade.base.x, by: blade.base.y, bz: blade.base.z,
            tx: blade.tip.x, ty: blade.tip.y, tz: blade.tip.z,
            age: 0,
            speed,
          });
          while (samples.length > max) samples.shift();
        }
        prevTip = { x: blade.tip.x, y: blade.tip.y, z: blade.tip.z };
        lastSpeed = speed;
        lastMoved = moved;
        lastHasBlade = true;
      } else {
        prevTip = null;
        lastHasBlade = false;
        lastSpeed = 0;
        lastMoved = 0;
      }
      lastActive = active;
      rebuild();
    },
    debug() {
      return {
        count: samples.length, visible: mesh.visible,
        speed: lastSpeed, moved: lastMoved, hasBlade: lastHasBlade, active: lastActive,
      };
    },
    reset() {
      samples = [];
      prevTip = null;
      mesh.visible = false;
      geo.setDrawRange(0, 0);
    },
    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
}
