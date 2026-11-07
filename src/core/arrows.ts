import { supportHeight } from './collision';
import { dealHit } from './hits';
import type { ArrowState, EventType, World } from './types';

const EPS = 1e-6;
const DEG = Math.PI / 180;

function emit(world: World, type: EventType, value: number, at: { x: number; y: number; z: number }): void {
  world.events.push({ type, tick: world.tick, x: at.x, y: at.y, z: at.z, value });
}

/** 清空全部箭矢（复位 / 传送用）。 */
export function clearArrows(world: World): void {
  world.arrows.length = 0;
}

/**
 * 线段（上一帧 → 本帧）与假人圆柱求交，返回入射参数 t ∈ [0,1]；未命中返回 -1。
 *
 * 用线段而不是「本帧位置在圆内」：满蓄初速接近 20 m/s，60fps 下单帧位移 0.33m，
 * 已经和假人直径同量级 —— 逐点检测会直接穿过去（表现为「箭穿过敌人没反应」）。
 */
function segmentHitDummy(
  px: number, py: number, pz: number,
  nx: number, ny: number, nz: number,
  cx: number, cz: number, baseY: number, height: number, radius: number,
): number {
  const sx = nx - px;
  const sz = nz - pz;
  const len2 = sx * sx + sz * sz;
  let t = 0;
  if (len2 > EPS) {
    t = ((cx - px) * sx + (cz - pz) * sz) / len2;
    t = Math.max(0, Math.min(1, t));
  }
  const hx = px + sx * t;
  const hz = pz + sz * t;
  const dx = hx - cx;
  const dz = hz - cz;
  if (dx * dx + dz * dz > radius * radius) return -1;
  // 高度方向同步校验：箭从头顶飞过时不能算命中
  const hy = py + (ny - py) * t;
  if (hy < baseY - 0.1 || hy > baseY + height) return -1;
  return t;
}

/** 箭从「弓口」射出：蓄力只影响初速，仰角固定；重力交给每帧积分。 */
export function fireArrow(world: World, charge: number, yaw: number): ArrowState {
  const tr = world.config.combat.bow.trajectory;
  const c = Math.max(0, Math.min(1, charge));
  const speed = tr.speedMin + (tr.speedMax - tr.speedMin) * c;
  const pitch = Math.max(0, tr.launchPitchDeg) * DEG;
  const p = world.character.position;
  const dirX = Math.sin(yaw);
  const dirZ = Math.cos(yaw);
  const horizontal = Math.cos(pitch);
  const ar: ArrowState = {
    id: ++world.arrowSeq,
    x: p.x + dirX * 0.55,
    y: p.y + 0.95,
    z: p.z + dirZ * 0.55,
    vx: dirX * speed * horizontal,
    vy: speed * Math.sin(pitch),
    vz: dirZ * speed * horizontal,
    life: Math.max(0.1, tr.maxLife),
    stuck: false,
    stuckDummy: -1,
    offX: 0,
    offY: 0,
    offZ: 0,
    yaw,
    localYaw: 0,
    pitch: 0,
    rest: 0,
    hit: false,
  };
  world.arrows.push(ar);
  emit(world, 'arrow-shot', c, ar);
  return ar;
}

/**
 * 箭矢推进：重力积分 → 命中假人（线段求交）→ 落地判定 → 插住后驻留。
 *
 * 插住语义：命中的箭跟随**假人平移**（存世界偏移），但不跟随假人转身 ——
 * 假人原地转身不会把插在身上的箭「甩」一圈。
 */
export function updateArrows(world: World, dt: number): void {
  const arr = world.arrows;
  if (arr.length === 0) return;
  const tr = world.config.combat.bow.trajectory;
  const dummyR = world.config.dummies.radius;
  const dummyH = world.config.dummies.height;
  const canHit = world.modules.hits && world.modules.dummies;
  const gravity = Math.max(0, tr.gravity);

  const next: ArrowState[] = [];
  for (const ar of arr) {
    if (ar.stuck) {
      ar.rest -= dt;
      if (ar.rest <= 0) continue;
      if (ar.stuckDummy >= 0) {
        const s = world.dummies[ar.stuckDummy];
        if (s) {
          // v9s.18：偏移存的是**假人身体局部坐标**（相对 bodyYaw），
          // 于是假人原地转身时箭会跟着一起转 —— 箭确实钉在那根「骨骼」上，
          // 而不是钉在世界坐标里被身体转走。
          const cos = Math.cos(s.bodyYaw);
          const sin = Math.sin(s.bodyYaw);
          ar.x = s.position.x + ar.offX * cos + ar.offZ * sin;
          ar.y = s.position.y + ar.offY;
          ar.z = s.position.z - ar.offX * sin + ar.offZ * cos;
          ar.yaw = s.bodyYaw + ar.localYaw;
        }
      }
      next.push(ar);
      continue;
    }

    ar.life -= dt;
    if (ar.life <= 0) continue;

    const px = ar.x;
    const py = ar.y;
    const pz = ar.z;
    ar.vy -= gravity * dt;
    const nx = px + ar.vx * dt;
    const ny = py + ar.vy * dt;
    const nz = pz + ar.vz * dt;

    // 1) 命中假人：取最早相交的那个
    let hitIndex = -1;
    let hitT = 2;
    if (canHit) {
      for (let i = 0; i < world.dummies.length; i++) {
        const s = world.dummies[i];
        const t = segmentHitDummy(
          px, py, pz, nx, ny, nz,
          s.position.x, s.position.z, s.position.y, dummyH, dummyR + tr.radius,
        );
        if (t >= 0 && t < hitT) {
          hitT = t;
          hitIndex = i;
        }
      }
    }

    if (hitIndex >= 0) {
      const s = world.dummies[hitIndex];
      ar.x = px + (nx - px) * hitT;
      ar.y = py + (ny - py) * hitT;
      ar.z = pz + (nz - pz) * hitT;
      ar.stuck = true;
      ar.stuckDummy = hitIndex;
      const cos = Math.cos(s.bodyYaw);
      const sin = Math.sin(s.bodyYaw);
      const wx = ar.x - s.position.x;
      const wz = ar.z - s.position.z;
      ar.offX = wx * cos - wz * sin;
      ar.offZ = wx * sin + wz * cos;
      ar.offY = ar.y - s.position.y;
      const impactYaw = Math.atan2(ar.vx, ar.vz);
      ar.localYaw = impactYaw - s.bodyYaw;
      ar.yaw = impactYaw;
      ar.pitch = Math.atan2(-ar.vy, Math.hypot(ar.vx, ar.vz));
      // v9s.18：命中的是「哪一根」由表现层按插点高度选骨骼（dummy-rig.boneAtWorld），
      // Core 只保证插点（offX/offY/offZ）在身体局部空间里是稳定的。
      ar.rest = Math.max(0.2, tr.stickSec);
      ar.hit = true;
      const len = Math.hypot(ar.vx, ar.vz);
      dealHit(world, hitIndex, {
        type: 'light',
        duration: 0.22,
        dirX: len > EPS ? ar.vx / len : 0,
        dirZ: len > EPS ? ar.vz / len : 1,
        knockback: 0.14,
      });
      emit(world, 'arrow-land', s.id, ar);
      next.push(ar);
      continue;
    }

    // 2) 落地：只用「脚下支撑面」判断，箭飞过台阶上方时不会被提前截住
    const sup = supportHeight(world.boxes, nx, nz, ny + 0.4, 0.04, 0, 6);
    const groundY = Number.isFinite(sup) ? sup : 0;
    if (ny <= groundY + 0.02 && ar.vy < 0) {
      ar.x = nx;
      ar.y = groundY + Math.max(0, tr.groundStickLift);
      ar.z = nz;
      ar.stuck = true;
      ar.stuckDummy = -1;
      ar.yaw = Math.atan2(ar.vx, ar.vz);
      const impact = Math.atan2(-ar.vy, Math.max(EPS, Math.hypot(ar.vx, ar.vz)));
      // 平射落地时入射角很浅，箭会躺在地上；给一个最小仰角让「插住」成立
      ar.pitch = Math.max(impact, Math.max(0, tr.stickMinPitchDeg) * DEG);
      ar.rest = Math.max(0.2, tr.stickSec);
      emit(world, 'arrow-land', -1, ar);
      next.push(ar);
      continue;
    }

    ar.x = nx;
    ar.y = ny;
    ar.z = nz;
    next.push(ar);
  }
  world.arrows = next;
}
