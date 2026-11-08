# ADR-006 · 固定步长 + 显式事件队列

- 状态：已采纳（v9a 起，长期有效）
- 影响范围：`src/core/step.ts`、所有 Core 模块

## 背景

玩法实验台需要「同一串输入 → 同一份状态」，才能做快照对比、跨语言重写与回归测试。常见做法是各模块自己 `addEventListener` / 回调互调，结果是顺序不确定、时间源不唯一。

## 决策

- 逻辑固定 **60Hz**（`dt = 1/60`），渲染用插值 `alpha` 补帧。
- 模块之间**不互相调用**：只读 `world`，只写 `world`，跨模块通信走 `world.events` 显式队列。
- 模块顺序固定：`targeting → combat → dash → movement → orientation → dummies → decayHurt → hits → separation → camera`。
- 时间只来自 `world.time`，随机只来自 `world.rngState`（mulberry32）；禁止 `Date.now()` / `Math.random()`。
- 表现层的一次性特效由**单调递增的 id**（`attackId` / `dash.id` / `slamAttackId`）驱动，而不是自己推断「刚才是不是发生了」。

## 后果

- `tests/determinism.test.ts` 的 600 步快照可以当黄金基线；表现层有无 rig 两条 World 轨迹逐字节一致。
- 想加新模块，必须决定它在 `step` 里的位置，并说明「读谁的、写谁的」。
- 事件是**数组**，不是回调：同一帧多个事件可被多处消费，顺序稳定。
- 表现层不许累积本地时间做逻辑判断（受击、卡肉、连击窗口都读 `world` 里的计时）。
