import type { Box, Vec3 } from './types';

const EPS = 1e-6;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * 在 (x,z) 处查找可站立的支撑高度。
 * 只考虑顶面不高于 refY + stepHeight 的盒子（不能从下方被吸上去），
 * 且不低于 refY - below（防止超出合理下落范围）。
 * 返回 -Infinity 表示该处无支撑。
 */
export function supportHeight(
  boxes: Box[],
  x: number,
  z: number,
  refY: number,
  radius: number,
  stepHeight: number,
  below: number,
): number {
  const r = radius * 0.85;
  let best = Number.NEGATIVE_INFINITY;

  for (const b of boxes) {
    if (b.maxY > refY + stepHeight + EPS) continue;
    if (b.maxY < refY - below - EPS) continue;
    if (x + r < b.minX || x - r > b.maxX) continue;
    if (z + r < b.minZ || z - r > b.maxZ) continue;
    if (b.maxY > best) best = b.maxY;
  }
  return best;
}

/**
 * 水平碰撞解算：把角色圆柱（用 XZ 圆近似）从重叠的白盒中推出。
 * 顶面低于 脚高 + stepHeight 的盒子视为可踩台阶，跳过不挡；
 * 底面高于 头顶 的盒子（过梁）视为头顶空间，跳过不挡。
 * 返回本帧是否发生了阻挡。
 */
export function resolveHorizontal(
  boxes: Box[],
  pos: Vec3,
  radius: number,
  height: number,
  stepHeight: number,
): boolean {
  let blocked = false;
  const headY = pos.y + height;

  // 两轮迭代，处理墙角处的连续推出
  for (let pass = 0; pass < 2; pass++) {
    for (const b of boxes) {
      if (b.maxY <= pos.y + stepHeight + EPS) continue;
      if (b.minY >= headY - EPS) continue;

      const cx = clamp(pos.x, b.minX, b.maxX);
      const cz = clamp(pos.z, b.minZ, b.maxZ);
      const dx = pos.x - cx;
      const dz = pos.z - cz;
      const d2 = dx * dx + dz * dz;

      if (d2 >= radius * radius) continue;

      blocked = true;
      if (d2 > EPS * EPS) {
        const d = Math.sqrt(d2);
        const push = (radius - d) / d;
        pos.x += dx * push;
        pos.z += dz * push;
      } else {
        // 圆心落在盒内：沿最浅的一侧推出
        const left = pos.x - b.minX;
        const right = b.maxX - pos.x;
        const back = pos.z - b.minZ;
        const front = b.maxZ - pos.z;
        const m = Math.min(left, right, back, front);
        if (m === left) pos.x = b.minX - radius;
        else if (m === right) pos.x = b.maxX + radius;
        else if (m === back) pos.z = b.minZ - radius;
        else pos.z = b.maxZ + radius;
      }
    }
  }
  return blocked;
}

/**
 * 解算后是否仍与任何阻挡盒重叠。
 * 用于识别「被两侧同时夹住」的情况：此时两个方向相反的推出向量互相抵消，
 * 角色会错误地穿过比自身直径更窄的缝隙（例如窄门洞），必须回退本帧水平位移。
 */
export function overlapsAny(
  boxes: Box[],
  pos: Vec3,
  radius: number,
  height: number,
  stepHeight: number,
): boolean {
  const headY = pos.y + height;
  for (const b of boxes) {
    if (b.maxY <= pos.y + stepHeight + EPS) continue;
    if (b.minY >= headY - EPS) continue;
    const cx = clamp(pos.x, b.minX, b.maxX);
    const cz = clamp(pos.z, b.minZ, b.maxZ);
    const dx = pos.x - cx;
    const dz = pos.z - cz;
    if (dx * dx + dz * dz < radius * radius - EPS) return true;
  }
  return false;
}
