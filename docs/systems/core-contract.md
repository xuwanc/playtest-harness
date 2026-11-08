# Core 契约规格表（跨语言重写对照）

> 最后更新：2026-11-08（v9s.38）。
> 用途：把 `src/core` 重写到 Unity / Godot 时，按这张表逐项对齐；`tests/__snapshots__/determinism.test.ts.snap` 是黄金基线。

## Core 契约规格表（跨语言重写对照）

| 项 | 定义 |
|---|---|
| 状态容器 | `World { tick, time, rngState, config, boxes, gridMeta, character, combat, impulse, targeting, playerHurt, hitCount, dash, **camera**, dummies, dummyAttackCount, events, modules }` |
| 角色状态 | `position`（脚底中心）、`velocity`、`facing`（面朝向/目标）、`moveYaw`（移动方向）、`bodyYaw`（平滑身体）、`headYaw`（领先头部，相对身体限幅）、`grounded`、`sprinting`、`gaitPhase`、`distance`、`coyoteTime`、`jumpBuffer` |
| 战斗状态 | `CombatState { weapon, phase, comboIndex, phaseTimer, comboWindow, queued, charging, charge, castIndex, attackProgress, attackFacing, attackId, lastCharge, hitstop, **notifyCursor, hitIds**, timings }`；`phase` 含 `settle` |
| 目标状态 | `TargetState { targetId, targetYaw, targetDist, hasTarget }` |
| 受击状态 | `HurtState { type: none/light/heavy/knock, timer, duration, dirX, dirZ }`；玩家在 `World.playerHurt`，假人在 `DummyState.hurt` |
| **冲刺状态** | **`DashState { kind: none/roll/blink, phase: idle/active, timer, duration, cooldown, dirX, dirZ, fromX, fromZ, toX, toZ, id }`；`id` 每次触发递增，表现层据此触发一次性特效** |
| **相机意图** | **`CameraIntent { distanceScale, offsetX, offsetZ, pitchDelta, threat, threatCount, centroidX, centroidZ }`；Core 纯空间评估、无时间累积，表现层做指数平滑** |
| 假人状态 | `DummyState { id, mode, initialMode, homeX, homeZ, position, velocity, facing, gaitPhase, distance, targetX, targetZ, wanderTimer, attackCooldown, attackPhase, attackPhaseTimer, attackProgress, attackId, hurt, **weapon: WeaponId | null**, **combat: CombatState | null** }；后两个字段只在持械陪练上非空（v9s.38）` |
| 输入 | `Intents { moveX, moveZ, jumpPressed, sprintHeld, **sprintPressed**, resetPressed, attackPressed, attackHeld, attackReleased, skill2Pressed, weaponSlot, dummyClickId }`，世界空间；`dummyClickId` 由表现层射线拾取后填入 |
| 输出事件 | `landed / jumped / stepUp / blocked / reset / weapon-change / attack-start / attack-active / attack-end / combo-reset / cast / charge-start / charge-release / dummy-mode / dummy-attack / dummy-hit / hit / player-hurt / roll / blink / dash-ready / **hitstop / notify**`；`notify` 额外带 `name`（关键帧事件名），显式队列数组 |
| 状态转移 | `step(world, dt, intents)`：清 `impulse` → `resetPressed` 短路全局复位 → `targeting` → `combat` → **`dash`** → `movement` → `orientation` → `dummies` → `decayHurt` → `hits` → `separation` → **`camera`**；只读参数、只写 world |
| 碰撞数据 | `Box[]`，每个 `{ id, kind, minX/maxX, minY/maxY, minZ/maxZ }`；玩家与假人共用 |
| 攻击时长 | `AttackTimings { windup, active, recovery, settle, lunge }`；`attackProgress` 只覆盖动作本体（不含 settle），settle 期间定格 1 |
| 朝向 | `wrapAngle(a) = atan2(sin a, cos a)`；`approach(current, target, rate, dt) = current + wrapAngle(target-current) × (1 - e^(-rate·dt))`；头部再 clamp 到 `bodyYaw ± maxHeadTurnDeg` |
| 配置键 | 移动类：`moveSpeed, sprintMultiplier, acceleration, friction, gravity, jumpSpeed, stepHeight, characterRadius, characterHeight, coyoteTime, jumpBufferTime, strideLength, fallTolerance, spawn, worldBounds`；朝向类：`orientation.*`；战斗类：`combat.comboWindow / settle / attackMoveScale / autoCombo / weapons.*（含 **hitWindow / notifies / comboWindow 覆写**）/ staff.* / bow.*`；目标类：`targeting.*`；命中类：`hits.*`；分离类：`separation.*`；**冲刺类：`dash.rollDistance / rollDuration / rollCooldown / blinkDistance / blinkStep / blinkCooldown / blinkClearVelocity`**；**相机类：`camera.radius / nearDistance / modeWeight / attackBoost / saturation / pushIn / maxPullback / maxOffset / maxPitchDelta / framingBias`**；假人类：`dummies.*` |
| 模块开关 | `movement / pathfinding / combat / orientation / targeting / hits / separation / dash / **camera** / dummies` |
| 随机 | `nextRandom(world)`，mulberry32，状态存在 `world.rngState`；分离的重合方向用黄金角生成，不用随机 |
| 不变量 | 位置恒为有限数；玩家与假人都越不了 `worldBounds`；落地 `velocity.y = 0`；`impulse` 每帧由 combat / dash 重设且只在 `active` 非零；`settle` 期间水平位移变化 = 0；攻击期间位移严格 = lunge（attackMoveScale=0）；**翻滚期间位移严格由 impulse 决定、方向键不叠加，总位移收敛到 rollDistance**；**闪现落点不穿墙 / 不越界，且 `toX/toZ` 与本帧最终位置一致**；`attackId` 与假人 `attackId` 单调递增（复位不归零）；**假人从不修改 `character`**；**玩家与假人、假人与假人之间不重叠（separation 开启时）**；**`camera` 意图为纯空间评估、无时间累积，可随 World 一起快照；关闭 `camera` 模块输出中性意图**；**命中只写 `HurtState` / `hitCount` / 假人位移，从不写血量** |
