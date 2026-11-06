import type { CameraIntent, World } from './types';

const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** 中性构图意图：距离不变、无平移、无俯仰变化。 */
export function initialCameraIntent(): CameraIntent {
  return {
    distanceScale: 1,
    offsetX: 0,
    offsetZ: 0,
    pitchDelta: 0,
    threat: 0,
    threatCount: 0,
    centroidX: 0,
    centroidZ: 0,
  };
}

export function resetCameraIntent(world: World): void {
  const ci = world.camera;
  const n = initialCameraIntent();
  ci.distanceScale = n.distanceScale;
  ci.offsetX = n.offsetX;
  ci.offsetZ = n.offsetZ;
  ci.pitchDelta = n.pitchDelta;
  ci.threat = n.threat;
  ci.threatCount = n.threatCount;
  ci.centroidX = world.character.position.x;
  ci.centroidZ = world.character.position.z;
}

/**
 * 智能相机意图（Core 侧）：只读玩家与假人位置，写 world.camera，不发事件、不写其它状态。
 * 纯空间评估、无时间累积 → 完全确定性、可快照、可跨语言对照；指数平滑交给表现层。
 *
 * 威胁权重 = 近度(proximity) × 行为模式倍率（+ 挥砍 active 帧的额外加权），按半径裁剪后求和；
 * threat = sum / (sum + saturation) 做饱和归一化。
 * 构图：无威胁时轻微推进、威胁越多越拉远；画面中心朝威胁加权质心平移（限幅）；
 *      俯角随威胁略增，便于看清包围圈。
 */
export function cameraUpdate(world: World): void {
  const ci = world.camera;
  const cfg = world.config.camera;
  const p = world.character.position;
  let sum = 0;
  let cx = 0;
  let cz = 0;
  let count = 0;

  for (const d of world.dummies) {
    const dx = d.position.x - p.x;
    const dz = d.position.z - p.z;
    const dist = Math.hypot(dx, dz);
    if (dist > cfg.radius) continue;
    const prox = clamp((cfg.radius - dist) / Math.max(EPS, cfg.radius - cfg.nearDistance), 0, 1);
    let weight = prox * (cfg.modeWeight[d.mode] ?? 0.5);
    if (d.attackPhase === 'active') weight += cfg.attackBoost * prox;
    sum += weight;
    cx += d.position.x * weight;
    cz += d.position.z * weight;
    count += 1;
  }

  const threat = sum <= 0 ? 0 : clamp(sum / (sum + Math.max(EPS, cfg.saturation)), 0, 1);
  ci.threat = threat;
  ci.threatCount = count;

  if (sum <= 0) {
    ci.centroidX = p.x;
    ci.centroidZ = p.z;
    ci.offsetX = 0;
    ci.offsetZ = 0;
  } else {
    const gx = cx / sum;
    const gz = cz / sum;
    ci.centroidX = gx;
    ci.centroidZ = gz;
    let ox = (gx - p.x) * cfg.framingBias * threat;
    let oz = (gz - p.z) * cfg.framingBias * threat;
    const len = Math.hypot(ox, oz);
    if (len > cfg.maxOffset) {
      ox = (ox / len) * cfg.maxOffset;
      oz = (oz / len) * cfg.maxOffset;
    }
    ci.offsetX = ox;
    ci.offsetZ = oz;
  }

  ci.distanceScale = 1 - cfg.pushIn * (1 - threat) + cfg.maxPullback * threat;
  ci.pitchDelta = cfg.maxPitchDelta * threat;
}
