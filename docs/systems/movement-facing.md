# 移动 / 朝向 / 碰撞

> 最后更新：2026-11-08（v9s.38）。
> 管什么：位移与跳跃、自动爬台阶、边界处理、角色间分离、面 / 身体 / 头 / 移动方向四角分离。
> 相关：步态与动画见 [`animation.md`](animation.md)。

## 角色间碰撞分离（v5）

`core/separation.ts`（`modules.separation` 可开关）：玩家 + 4 假人在 XZ 平面视为圆柱，两两做 `iterations`（3）轮分离，只推**假人**：

- **玩家是不可推动的锚点**（权重 0），全部重叠量由假人让开。这既消除重叠，又保住既有契约「假人从不修改 `character`」，也与「把敌人击退、保持距离」的方向一致。
- 假人 ↔ 假人各承担一半；完全重合时用**黄金角生成的确定性方向**（无随机源）把多个实体错开，避免挤成一堆。
- 每轮分离后对假人再做一次 `resolveHorizontal` 推出白盒、`clamp` 回世界边界，避免被挤进墙里或越界。
- 固定遍历顺序 → 完全确定性，可跨语言比对。

配置在 `core.separation`（`iterations / slop`）。

## 程序化朝向（面 / 身体 / 移动方向分离）

`core/orientation.ts` 是独立模块（`modules.orientation` 可开关），把原来单个 `facing` 拆成四条状态：

| 状态 | 含义 | 更新方式 |
|---|---|---|
| `facing` | **面朝向 / 目标方向**：攻击中锁定 `attackFacing`；弓蓄力时锁定目标；平时取摇杆意图方向；无输入保持 | 立即（锁定 / 意图） |
| `moveYaw` | **移动方向**：由实际速度得出 | 速度 > 0.15 时更新，可与身体朝向不同（侧移 / 后退） |
| `bodyYaw` | **身体朝向**：慢速指数平滑追随 `facing` | `bodyTurnRate = 7`，帧率无关，走最短弧 |
| `headYaw` | **头部朝向**：更快速率追随 `facing`，再相对身体限幅 | `headTurnRate = 20`，`maxHeadTurnDeg = 55` |

因此**头先于身体转向目标方向，身体做平滑跟随**。角度差用 `wrapAngle = atan2(sin a, cos a)` 归一化到 `(-π, π]` 走最短弧。表现层三段分离：`playerRoot.rotation.y = bodyYaw`、`lower.rotation.y = (moveYaw - bodyYaw) × legYawScale`、`headPivot.rotation.y = headYaw - bodyYaw - 攻击旋身`。参数在 `core.orientation` 与 `view.orientation`。
