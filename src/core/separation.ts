import { resolveHorizontal } from './collision';
import type { Vec3, World } from './types';

const EPS = 1e-6;
/** 黄金角：给「完全重合」的实体分配确定性且互相错开的分离方向，无需任何随机源。 */
const GOLDEN_ANGLE = 2.399963229728653;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 把两个圆柱体在 XZ 平面推开，权重 wa / wb 决定各自承担多少重叠量。
 * 玩家权重传 0：玩家是不可推动的锚点，全部由假人让开 ——
 * 既消除重叠，又保持「假人从不修改 character」与「击退作用于敌人」的既有契约。
 *
 * 完全重合（d < EPS）时不能再用 d 做除数（会把单位向量放大上百万倍），
 * 改用调用方传入的确定性单位方向 fallback，重叠量直接取 minD。
 */
function separatePair(
  a: Vec3,
  b: Vec3,
  ra: number,
  rb: number,
  wa: number,
  wb: number,
  slop: number,
  fallbackX: number,
  fallbackZ: number,
): void {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const d = Math.hypot(dx, dz);
  const minD = ra + rb;
  if (d >= minD) return;

  let nx: number;
  let nz: number;
  let overlap: number;
  if (d < EPS) {
    nx = fallbackX;
    nz = fallbackZ;
    overlap = minD;
  } else {
    nx = dx / d;
    nz = dz / d;
    overlap = minD - d;
  }
  const push = overlap + slop;
  a.x -= nx * push * wa;
  a.z -= nz * push * wa;
  b.x += nx * push * wb;
  b.z += nz * push * wb;
}

/**
 * 角色间分离：玩家 + 4 假人两两不重叠。
 *
 * 固定顺序（按假人数组下标、迭代次数固定）→ 完全确定性，可跨语言比对。
 * 分离后再对每个假人做一次白盒解算与边界夹紧，避免被推进墙里或越界。
 * 只推假人：玩家位置一个字节都不改。
 * 对应 C# 形态：static void SeparationUpdate(World w)
 */
export function separationUpdate(world: World): void {
  const cfg = world.config.separation;
  const dummies = world.dummies;
  const p = world.character.position;
  const pr = world.config.characterRadius;
  const dr = world.config.dummies.radius;
  const iterations = Math.max(1, Math.floor(cfg.iterations));
  const slop = Math.max(0, cfg.slop);

  for (let iter = 0; iter < iterations; iter++) {
    // 假人 ↔ 假人：各承担一半；重合时按 (i,j) 生成不同的确定性方向，避免挤成一堆
    for (let i = 0; i < dummies.length; i++) {
      for (let j = i + 1; j < dummies.length; j++) {
        const ang = (i * 3 + j) * GOLDEN_ANGLE;
        separatePair(
          dummies[i].position, dummies[j].position, dr, dr, 0.5, 0.5, slop,
          Math.cos(ang), Math.sin(ang),
        );
      }
    }
    // 玩家 ↔ 假人：玩家权重 0，全部由假人让开
    for (let k = 0; k < dummies.length; k++) {
      const ang = (k + 1) * GOLDEN_ANGLE;
      separatePair(
        p, dummies[k].position, pr, dr, 0, 1, slop,
        Math.cos(ang), Math.sin(ang),
      );
    }
  }

  // 分离可能把假人推进白盒 / 推出边界，统一再解算一次
  const stepH = world.config.stepHeight;
  const b = world.config.worldBounds;
  for (const s of dummies) {
    resolveHorizontal(world.boxes, s.position, dr, world.config.dummies.height, stepH);
    s.position.x = clamp(s.position.x, b.minX, b.maxX);
    s.position.z = clamp(s.position.z, b.minZ, b.maxZ);
  }
}
