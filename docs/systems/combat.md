# 战斗 / 命中 / 受击

> 最后更新：2026-11-08（v9s.38）。
> 管什么：武器表、三连击与 settle、按住自动连击、目标辅助带来的前冲、命中判定、三种受击、击退、卡肉。
> 相关：动画时序见 [`animation.md`](animation.md)，特效层级见 [`presentation-fx.md`](presentation-fx.md)，参数在 `config/game.json` → `core.combat / core.hits / core.links`。

## 武器系统

| 武器 | 切换 | 攻击 | 三段前冲（m） | 移速倍率 | 命中 / 受击 |
|---|---|---|---|---|---|
| 剑 + 盾 | 1 / 剑盾 | 三连击：右上劈 → 左横斩 → 双手下劈 | 0.45 / 0.60 / 0.95 | 1.00 | 1.6m，段1/2 轻受击、段3 重受击 |
| 双持剑 | 2 / 双剑 | 三连击，节奏最快（前摇 0.07s） | 0.40 / 0.55 / 0.85 | 1.08 | 1.5m，轻 / 轻 / 重 |
| 双手剑 | 3 / 大剑 | 三连击，前摇/后摇最长、前冲最大 | 0.70 / 0.90 / 1.40 | 0.85 | 2.0m，**击退受击 + 0.75m 击退** |
| 法杖 | 4 / 法杖 | 「攻击」= 施法1（举杖前推 + 光球飞出），「技2」= 施法2（双手上举砸地 + 下蹲） | 0 / 0.25 | 0.95 | 2.6m，重受击 |
| 弓箭 | 5 / 弓 | 按住蓄力 → 松开射箭；蓄力不足则取消 | 0.12 | 1.00（蓄力中 ×0.55） | 9m，轻受击 |

**连击规则**：攻击分 `windup → active → recovery → settle → idle` 五段。只有 `active` 帧产生前向位移（`impulse`）；`recovery` 结束发 `attack-end` 并进入 **`settle` 收势停顿**（默认 0.16s），停顿期间 impulse 与自主速度都为 0，姿态定格，水平位移严格不变。停顿结束才回到 `idle`、开启 0.65s 连击窗口、消费缓冲输入。第 3 段之后回到第 1 段。

**按住自动连击**（`combat.autoCombo`，默认开）：`attackHeld` 为 true 时，每次回到 `idle` 就自动接续下一段，形成 `1→2→3→1→…` 的无限循环；松开即停，且按住状态**不进入缓冲队列**（不会松手后多打一段）。显式按下的 `attackPressed` 仍走缓冲队列，两种入口互不冲突。仅对剑类（comboCount > 0）生效，法杖 / 弓不受影响。

**攻击与移动解耦**：攻击 / 停顿期间 `movement` 直接接管水平速度 `v = 输入方向 × moveSpeed × attackMoveScale`（默认 **0 = 完全锁定**），不累积惯性；水平位移严格等于 `lunge`，**「移动中攻击」和「静止攻击」前冲距离完全一致**。

**武器握持姿态**：`makeSword` 沿局部 `+Y` 建剑，挂在手部节点下的 `weaponMount` 挂点上并施加基础旋转 —— 剑向前倾斜（剑盾/双剑 68°、大剑 58°）并左右外张（16°），剑身**斜向前下方伸出、与下垂手臂明显分离**，剑刃一侧有白色 `bladeEdge` 亮边明确刀锋朝外。角度在 `view.weaponMount`，调试面板可热改。

参数在 `config/game.json` → `core.combat` 与 `view.weaponMount`。

## 命中 / 受击动画 / 击退（v5）

`core/hits.ts` 是独立模块（`modules.hits` 可开关），只消费**显式事件队列**：`attack-active`（玩家攻击命中帧）与 `dummy-hit`（假人挥砍命中帧），不与 combat / dummies 互相调用。

- **玩家攻击命中**：以 `attackFacing` 为中心 ±`arcDeg`（65°）扇区、按武器 `reach` 判定，命中写 `hit` 事件、累加 `world.hitCount`、给假人写受击状态。
- **三种受击动画**：`light`（0.20s）/ `heavy`（0.32s）/ `knock`（0.42s）。映射：剑盾/双剑第 1、2 段 → light，第 3 段 → heavy；法杖 / 弓 → heavy；**大剑 → knock**。表现层按 `1 - timer/duration` 归一化进度用 `sin(πp)` 做后仰 + 侧倾 + 下蹲 + 全身红闪，三种幅度不同；受击期间假人进入**僵直**（不主动移动、不发起新攻击）。
- **大剑击退**：命中时把近身敌人沿「玩家→敌人」方向推到至少 `idealRange`（默认 1.35m），或推 `knockback`（0.75m）取较大值，使敌人**尽量留在攻击范围内、又不贴脸**。其它武器 `knockback = 0`，不重叠由分离模块保证。
- **假人攻击玩家**：`dummy-hit` 帧若玩家在 `dummyReach`（1.8m）内，写 `world.playerHurt`（light 受击）并发 `player-hurt`。**仍无伤害**：`playerHurt` 放在 `World` 顶层而非 `character`，`character` 一个字节都不改。

> 受击状态（`HurtState { type, timer, duration, dirX, dirZ }`）是 Core 计时的 plain 数据，随 World 一起快照 / 回放；表现层不累积本地时间，暂停与时间缩放下也与逻辑同步。

配置在 `core.hits`（`arcDeg / reach / hurtLight / hurtHeavy / hurtKnock / knockback / dummyReach`）与 `view.hurt`（闪色与三种后仰幅度），调试面板「命中 / 受击 / 击退」分组可热改。
