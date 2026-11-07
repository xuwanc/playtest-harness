/**
 * v9s.16 · 箭矢飞行的纯函数（零 three / 零 DOM，可被 Node 直接测）。
 *
 * 为什么单独抽出来：v9s.15 之前的箭是 `fxAnchor` 的子节点（位置写在父节点局部坐标里），
 * 而 `fxAnchor` 的朝向在释放动作结束时会从 `attackFacing` 切回 `bodyYaw` —— 蓄力不足的
 * 慢箭还在空中时会被父节点「拽偏」。改成世界坐标独立飞行后，「起点 / 方向 / 淡出」全部
 * 只依赖起手瞬间的快照，契约简单到可以用纯函数断言。
 *
 * 约定：yaw 与 Core 一致（0 = +Z，顺时针为正，x = sin、z = cos）。
 */

export type ShotPoint = { x: number; y: number; z: number };

/**
 * 起手瞬间的发射点：从角色脚下位置沿锁定朝向前推 `forward` 米，抬高 `height` 米。
 * `forward` 取弓身长度级别（≈0.6m），避免箭从体素身体里长出来。
 */
export function shotOrigin(
  x: number, y: number, z: number, yaw: number, forward: number, height: number,
): ShotPoint {
  return {
    x: x + Math.sin(yaw) * forward,
    y: y + height,
    z: z + Math.cos(yaw) * forward,
  };
}

/** 沿起手朝向飞出 `dist` 米后的世界位置（不做重力 / 不做弧线）。 */
export function shotPoint(origin: ShotPoint, yaw: number, dist: number): ShotPoint {
  return {
    x: origin.x + Math.sin(yaw) * dist,
    y: origin.y,
    z: origin.z + Math.cos(yaw) * dist,
  };
}

/**
 * 末端淡出：距离终点 `fadeLen` 米内从 1 线性收到 0，超出射程直接 0。
 * 目的是「淡出而不是啪一下消失」，同时给表现层一个统一的可见性判据（<= 0 即隐藏）。
 */
export function shotFade(dist: number, maxDist: number, fadeLen: number): number {
  if (dist < 0) return 1;
  const start = maxDist - Math.max(1e-6, fadeLen);
  if (dist <= start) return 1;
  if (dist >= maxDist) return 0;
  return (maxDist - dist) / (maxDist - start);
}
