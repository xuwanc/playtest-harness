# 相机与目标辅助

> 最后更新：2026-11-08（v9s.38）。
> 管什么：智能相机（威胁权重 → 推近 / 拉远 / 平移 / 俯仰）、前方扇区软锁定、两级注视（威胁 / 重要目标）。
> 相关：朝向四角分离见 [`movement-facing.md`](movement-facing.md)。

## 智能目标辅助（v5）

`core/targeting.ts` 是独立模块（`modules.targeting` 可开关）。每帧在**当前面朝向的前方扇区**内挑选优先目标：

- 参考朝向：有移动输入时取输入方向（转身意图即时生效），否则沿用上一帧 `facing`。
- 候选条件：水平距离 ≤ `range`（7m）且与目标方向夹角 ≤ `maxAngleDeg`（90°，半角）。**背后的敌人不会被强行锁定**，避免玩家背对敌群时攻击莫名扭头。
- 评分 `score = dist - frontBias × cos(夹角)`，越小越优先 → 更近且更正面的敌人胜出。
- 结果写在 `world.targeting { targetId, targetYaw, targetDist, hasTarget }`，表现层在目标脚下画一个**金色指示环**（带轻微呼吸），HUD 显示 `target #id @距离`。

由此带来三条行为：

| 行为 | 规则 |
|---|---|
| **朝目标方向攻击** | 起手时 `attackFacing = targetYaw`（优先于摇杆方向），锁定后挥击过程中不变；关闭 `targetAssist` 后退回「按摇杆/面朝向」的基础行为 |
| **动态前冲** | 有目标时 `lunge = clamp(targetDist - idealRange, 0, 基础lunge × maxLungeScale)`：目标远则最多放大 1.6 倍追近，目标已在理想距离（1.35m）内则**不再前冲**，避免怼到敌人身上。每击结束趋向与敌人保持理想间距 |
| **弓蓄力面向目标** | 按住弓蓄力期间 `orientation` 把 `facing` 覆盖为 `targetYaw`（压过摇杆方向），松手 / 换武器即恢复 |

配置在 `core.targeting`：`range / maxAngleDeg / frontBias / idealRange / maxLungeScale / targetAssist`，调试面板「目标辅助」分组可热改。
