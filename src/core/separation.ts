import { resolveHorizontal } from './collision';
import type { CrowdResistanceConfig, Vec3, World } from './types';

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
  /** 尸体圆心（算出来的临时点；不复用尸体 position，避免把 Core 状态写脏）。 */
  const corpseAt: Vec3 = { x: 0, y: 0, z: 0 };

  for (let iter = 0; iter < iterations; iter++) {
    // 假人 ↔ 假人：各承担一半；重合时按 (i,j) 生成不同的确定性方向，避免挤成一堆
    for (let i = 0; i < dummies.length; i++) {
      // v9s.56：尸体不参与分离（否则玩家从旁边走过会把倒下的陪练一路蹭走）
      if (dummies[i].health.dead) continue;
      for (let j = i + 1; j < dummies.length; j++) {
        if (dummies[j].health.dead) continue;
        const ang = (i * 3 + j) * GOLDEN_ANGLE;
        separatePair(
          dummies[i].position, dummies[j].position, dr, dr, 0.5, 0.5, slop,
          Math.cos(ang), Math.sin(ang),
        );
      }
    }
    // 玩家 ↔ 假人：玩家权重 0，全部由假人让开
    for (let k = 0; k < dummies.length; k++) {
      if (dummies[k].health.dead) continue;
      const ang = (k + 1) * GOLDEN_ANGLE;
      separatePair(
        p, dummies[k].position, pr, dr, 0, 1, slop,
        Math.cos(ang), Math.sin(ang),
      );
    }

    // v9s.57：玩家 ↔ 尸体 —— 权重**反过来**（玩家让开、尸体不动）。
    // 尸体是静态障碍：躺下的身体中心不在脚底，而在倒向（-facing）前方约一个躯干处，
    // 所以碰撞圆要跟着位移；只用站立半径会让人从胸口那一段穿过去。
    const corpse = world.config.dummies.corpse;
    if (corpse && corpse.enabled !== false) {
      const cr = Math.max(0.05, corpse.radius ?? 0.62);
      const off = Math.max(0, corpse.offset ?? 0.55);
      for (let k = 0; k < dummies.length; k++) {
        const s = dummies[k];
        if (!s.health.dead) continue;
        const ang = (k + 1) * GOLDEN_ANGLE;
        // 复用同一个临时对象：only 读，separatePair 的 wb=0 不会写它
        corpseAt.x = s.position.x - Math.sin(s.facing) * off;
        corpseAt.z = s.position.z - Math.cos(s.facing) * off;
        separatePair(
          p, corpseAt, pr, cr, 1, 0, slop,
          Math.cos(ang), Math.sin(ang),
        );
      }
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
  // v9s.57：玩家也可能被尸体顶进墙里（尸体贴着墙倒），同样解算 + 夹紧。
  // 只在真有尸体时跑，避免给没有死亡的场景加无谓开销。
  if (corpseBlocks(dummies)) {
    resolveHorizontal(world.boxes, p, pr, world.config.characterHeight, stepH);
    p.x = clamp(p.x, b.minX, b.maxX);
    p.z = clamp(p.z, b.minZ, b.maxZ);
  }
}

/** 是否有尸体（决定要不要给玩家做一次额外解算）。 */
function corpseBlocks(dummies: readonly { readonly health: { readonly dead: boolean } }[]): boolean {
  for (const d of dummies) if (d.health.dead) return true;
  return false;
}

/* -------------------------------------------------------------------------- *
 * v9p · 主动挤人的阻力：推着走不再畅通无阻
 * -------------------------------------------------------------------------- *
 * 旧版「玩家 ↔ 假人」分离把玩家当不可推动的锚点（wa=0 / wb=1），假人全量让开。
 * 玩家只要按住摇杆朝假人走，就能以满速把假人一路推着走，毫无「撞到人」的阻滞感。
 *
 * 这里不修改任何 position（保住「假人从不修改 character」与逐字节确定性契约），
 * 只按「主动朝对方推进」的程度衰减施压方的**水平速度**：
 *   - 主动 = 速度方向指向对方（v̂·n > approachDot）；背对远离 / 侧向擦过完全不减速。
 *   - 强度 = 贴近程度（距 minD 越近越强）× 正对程度，多个假人取最强的一个，不连乘。
 * 速度被衰减后，下一帧 accel 会重新把它拉回目标速度，于是稳态是「缓慢顶着走」；
 * 每帧产生的新重叠也随之变小，假人被推开得明显更慢 —— 就是「推不动」的手感。
 * 全部纯函数、只写 velocity、minScale=1 时精确回到旧行为。
 * 对应 C# 形态：static float CrowdResistance(...)
 */

/** 求施压方的水平速度保留系数（floor..1），纯函数、无副作用。 */
export function crowdResistance(
  px: number, pz: number, vx: number, vz: number, pr: number,
  dummies: readonly { readonly position: Vec3 }[], dr: number,
  cfg: CrowdResistanceConfig,
): number {
  const sp = Math.hypot(vx, vz);
  const band = Math.max(0, cfg.contactBand);
  const floor = clamp(cfg.minScale, 0, 1);
  if (sp < EPS || band <= 0 || floor >= 1) return 1;
  const minD = pr + dr;
  const dotMin = clamp(cfg.approachDot, 0, 0.99);
  let resist = 0;
  for (const d of dummies) {
    const dx = d.position.x - px;
    const dz = d.position.z - pz;
    const dist = Math.hypot(dx, dz);
    if (dist >= minD + band) continue;
    // 完全重合时方向不可判定，按最强正面挤压处理（同帧分离会立即把它推开）
    if (dist < EPS) { resist = 1; continue; }
    const approach = (vx * dx + vz * dz) / (sp * dist);
    if (approach <= dotMin) continue;
    const closeness = clamp(1 - (dist - minD) / band, 0, 1);
    const facing = clamp((approach - dotMin) / (1 - dotMin), 0, 1);
    resist = Math.max(resist, closeness * facing);
  }
  return 1 - (1 - floor) * clamp(resist, 0, 1);
}

/** 应用到玩家速度：只写 velocity.x/z，绝不改 position，也不碰假人。 */
export function crowdResistanceUpdate(world: World): void {
  const cfg = world.config.separation.crowd;
  if (!cfg) return;
  const c = world.character;
  const k = crowdResistance(
    c.position.x, c.position.z, c.velocity.x, c.velocity.z,
    world.config.characterRadius, world.dummies, world.config.dummies.radius, cfg,
  );
  if (k >= 1) return;
  c.velocity.x *= k;
  c.velocity.z *= k;
}
