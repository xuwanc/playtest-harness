import { supportHeight } from './collision';
import { dealHit } from './hits';
import type { ArrowState, EventType, World } from './types';

const EPS = 1e-6;
const DEG = Math.PI / 180;

/** 角度归一化（与 orientation.wrapAngle 同口径，本地实现避免模块环依赖）。 */
function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

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

/**
 * v9s.19 · 出弓时选一个「软目标」：
 * 锁定目标优先（targetAssist 打开时），否则在 yaw 的 homingConeDeg 锥形内取最近。
 * 只影响抬弓补偿与轻微修正，不改变箭从哪出、朝哪去。
 */
function pickArrowTarget(world: World, yaw: number): number {
  const tr = world.config.combat.bow.trajectory;
  const range = Math.max(0, tr.homingRange);
  if (range <= EPS) return -1;
  const p = world.character.position;
  const cone = Math.max(0, tr.homingConeDeg) * DEG;
  const lock = world.config.targeting.targetAssist && world.modules.targeting
    ? world.targeting
    : null;
  const lockedId = lock && lock.hasTarget ? lock.targetId : 0;
  let best = -1;
  let bestD = range + EPS;
  for (const s of world.dummies) {
    if (!world.modules.dummies) break;
    const dx = s.position.x - p.x;
    const dz = s.position.z - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-3 || d > range) continue;
    if (s.id === lockedId) return s.id;
    if (Math.abs(wrapAngle(Math.atan2(dx, dz) - yaw)) > cone) continue;
    if (d < bestD) {
      best = s.id;
      bestD = d;
    }
  }
  return best;
}

/**
 * 出弓的「软瞄准」：目标在 homingConeDeg 锥形内时，把发射角压到目标方向
 * （最多压 cone 度），再由 solveAim 解竖直初速。
 *
 * 这一步是「打得中」的关键：只靠飞行中的限速转向，16 m/s 的箭转弯半径有 10m+，
 * 8m 外偏 20° 根本拉不回来；出弓先对准，追踪只负责修正目标横移。
 */
function aimYawFor(world: World, yaw: number, targetId: number): number {
  if (targetId <= 0) return yaw;
  const s = world.dummies.find((d) => d.id === targetId);
  if (!s) return yaw;
  const p = world.character.position;
  const want = Math.atan2(s.position.x - p.x, s.position.z - p.z);
  const cone = Math.max(0, world.config.combat.bow.trajectory.homingConeDeg) * DEG;
  return yaw + clamp(wrapAngle(want - yaw), -cone, cone);
}

/** 按目标位置解竖直初速：让箭在水平距离 d 处正好落到瞄准点高度。 */
function solveAim(
  world: World, sx: number, sy: number, sz: number, targetId: number, speed: number,
): { vy: number; horizontal: number } {
  const tr = world.config.combat.bow.trajectory;
  const base = { vy: speed * Math.sin(Math.max(0, tr.launchPitchDeg) * DEG), horizontal: 0 };
  base.horizontal = speed * Math.cos(Math.max(0, tr.launchPitchDeg) * DEG);
  if (targetId <= 0) return base;

  const s = world.dummies.find((d) => d.id === targetId);
  if (!s) return base;
  const horiz = Math.hypot(s.position.x - sx, s.position.z - sz);
  if (horiz < 0.4) return base;
  // 用「固定飞行时间」近似：箭的水平速度按总速度走，竖直分量单独解，
  // 这样目标越远抬得越高，近距离也不会因为仰角固定而从头皮上飞过去。
  const t = horiz / Math.max(EPS, speed);
  const aimY = s.position.y + world.config.dummies.height * clamp(tr.aimHeightRatio, 0, 1);
  const gravity = Math.max(0, tr.gravity);
  const needVy = (aimY - sy + 0.5 * gravity * t * t) / t;
  const vy = clamp(needVy, -speed * 0.45, speed * 0.92);
  return { vy, horizontal: Math.sqrt(Math.max(0, speed * speed - vy * vy)) };
}

/** 箭从「弓口」射出：蓄力只影响初速；有软目标时竖直初速按目标距离解出。 */
export function fireArrow(world: World, charge: number, yaw: number): ArrowState {
  const tr = world.config.combat.bow.trajectory;
  const c = Math.max(0, Math.min(1, charge));
  const speed = tr.speedMin + (tr.speedMax - tr.speedMin) * c;
  const p = world.character.position;
  const targetId = pickArrowTarget(world, yaw);
  const dirYaw = aimYawFor(world, yaw, targetId);
  const dirX = Math.sin(dirYaw);
  const dirZ = Math.cos(dirYaw);
  const startX = p.x + Math.sin(yaw) * 0.55;
  const startZ = p.z + Math.cos(yaw) * 0.55;
  const startY = p.y + 0.95;
  const aim = solveAim(world, startX, startY, startZ, targetId, speed);
  const ar: ArrowState = {
    id: ++world.arrowSeq,
    x: startX,
    y: startY,
    z: startZ,
    vx: dirX * aim.horizontal,
    vy: aim.vy,
    vz: dirZ * aim.horizontal,
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
    targetId,
    homing: Math.max(0, tr.homingTime),
    turnRate: Math.max(0, tr.turnRateDeg) * DEG,
  };
  world.arrows.push(ar);
  emit(world, 'arrow-shot', c, ar);
  return ar;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
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

    // v9s.19 · 轻度自动追踪：只在前 homingTime 秒内生效。
    //  水平：按 turnRate 限速把速度方向拧向目标（拐弯半径 = 速度 / 角速度，够小才不绕圈）；
    //  竖直：按剩余距离重解「要命中胸口需要多大 vy」，再以 verticalTurnRate 限速逼近。
    // 目标中途倒下就放弃修正，箭按现有弹道继续飞 —— 不做二次索敌。
    if (ar.homing > 0) {
      ar.homing = Math.max(0, ar.homing - dt);
      if (ar.targetId > 0 && ar.turnRate > 0) {
        const s = world.dummies.find((d) => d.id === ar.targetId);
        if (!s) {
          ar.targetId = 0;
        } else {
          const hs = Math.hypot(ar.vx, ar.vz);
          if (hs > EPS) {
            const want = Math.atan2(s.position.x - ar.x, s.position.z - ar.z);
            const cur = Math.atan2(ar.vx, ar.vz);
            const maxTurn = ar.turnRate * dt;
            const yaw = cur + clamp(wrapAngle(want - cur), -maxTurn, maxTurn);
            ar.vx = Math.sin(yaw) * hs;
            ar.vz = Math.cos(yaw) * hs;

            const d = Math.hypot(s.position.x - ar.x, s.position.z - ar.z);
            if (d > 0.3) {
              const t = d / hs;
              const aimY = s.position.y
                + dummyH * clamp(tr.aimHeightRatio, 0, 1);
              const needVy = (aimY - ar.y + 0.5 * gravity * t * t) / t;
              const maxDv = Math.max(0, tr.verticalTurnRate) * dt;
              ar.vy += clamp(needVy - ar.vy, -maxDv, maxDv);
            }
          }
        }
      }
    }

    // 飞行中每帧刷新朝向：表现层只读这两个角，箭尖才会真的指着速度方向
    ar.yaw = Math.atan2(ar.vx, ar.vz);
    ar.pitch = -Math.atan2(ar.vy, Math.hypot(ar.vx, ar.vz));

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
