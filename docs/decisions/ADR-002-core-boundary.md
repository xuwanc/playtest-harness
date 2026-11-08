# ADR-002 · Core 与表现层单向依赖

- 状态：已采纳（v9a 起，v9s.38 复核）
- 影响范围：`src/core/**`、`src/adapters/**`、`src/presentation/**`、`src/app.ts`

## 背景

实验台要能证明「玩法逻辑可以搬到 Unity / Godot」。如果 Core 里混进 Three.js、DOM、`Date.now()` 或 `Math.random()`，所谓「可移植」就只是口号。

## 决策

- 依赖方向严格单向：`presentation → adapters → core`；`app.ts` 是唯一同时认识两边的文件。
- Core 只暴露**纯数据**：`World` 可 `JSON.stringify` 往返；状态转移是 `step(world, dt, intents)`，没有类、没有 `enum`、没有外部时间源。
- 模块之间不互相调用，只靠 `world` 状态与**显式事件队列**通信。
- `step` 的模块顺序固定（`targeting → combat → dash → movement → orientation → dummies → decayHurt → hits → separation → camera`），顺序本身就是契约。
- 边界由 `scripts/check-boundary.mjs` 强制：Core 目录内出现 `three` / `lil-gui` / DOM 全局 / `Math.random` / `class` / `enum` 即失败。

## 后果

- 跨语言重写时，对照 `docs/systems/core-contract.md` 逐项实现，用 `tests/__snapshots__/determinism.test.ts.snap` 当黄金基线。
- 表现层想「顺便改一点规则」时会别扭 —— 这是设计目标，不是缺陷。规则改动必须落回 Core + 配置。
- `verify:portable` 在纯 Node 跑 600 步，是这条决策的持续证据（Core 当前 25 个文件）。
