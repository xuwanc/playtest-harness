import type { Box, GridMeta, PathRequest, PathResult, Pathfinder } from './types';

/**
 * 寻路模块契约 —— 本期只定义接口，不实现算法。
 *
 * 后续接入步骤（对应 README 的扩展点）：
 *  1. 实现 Pathfinder：基于 World.boxes + World.gridMeta 做 A* / NavMesh 查询。
 *  2. 新增 core/modules/pathfinding.ts，在 step() 中按 modules.pathfinding 开关调用。
 *  3. 输入层增加「点击地面 → PathRequest」，把结果转成逐帧 Intents 喂给 movement。
 *  4. 表现层用 Line 画出 nodes 便于验收；契约测试补一组 golden snapshot。
 *
 * 场景已按可寻路方式布局（台阶高度序列、宽门洞、窄缝、独立墙体），gridMeta 已随 World 输出。
 */
export const nullPathfinder: Pathfinder = (
  _request: PathRequest,
  _boxes: Box[],
  _grid: GridMeta,
): PathResult => ({ found: false, nodes: [], cost: 0 });

export function makePathRequest(
  startX: number,
  startZ: number,
  goalX: number,
  goalZ: number,
  radius: number,
  height: number,
  stepHeight: number,
): PathRequest {
  return {
    start: { x: startX, z: startZ },
    goal: { x: goalX, z: goalZ },
    radius,
    height,
    stepHeight,
  };
}
