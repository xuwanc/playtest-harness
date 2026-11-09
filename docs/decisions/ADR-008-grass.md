# ADR-008 · 体素草块：状态在 Core、几何在表现层、判定复用 hits

- 状态：**已接受**（v9s.39），实现落地，未推送
- 相关：[ADR-002](ADR-002-core-boundary.md)（Core 单向依赖）、
  [ADR-003](ADR-003-fx-order.md)（层级编号）、[ADR-005](ADR-005-ground-height.md)（贴地高度）、
  [ADR-006](ADR-006-fixed-step-events.md)（固定步长 + 事件队列）
- 系统文档：[`systems/grass.md`](../systems/grass.md)

## 背景

用户要验证一个周边功能：2×2 占地、参次不齐、1~2 格高、用 box 做的体素草，
角色走过去能被自然压开，攻击能割断；同时关心技术选型与性能压力。
项目已有纯 TS Core + Three.js 表现层、格网碰撞、完整的攻击 / 命中链路。

## 决策

### 1. 草不进 `World.boxes`

照 `scene.stations` 的先例：草是**场景元数据 + 世界状态**，不是碰撞体。
`createGrassState(core, scene, boxes, grid)` 在 `createWorld` 里生成一次，
之后 `world.grass` 自包含（含 `spec` 快照），不依赖 `scene`。

理由：草要被「穿过去」，若进碰撞盒玩家就走不动；且改布局不该牵动物理。
代价：草不能被角色推着走、不参与寻路——这是有意接受的。

### 2. 生成用独立种子，不碰 `world.rngState`

`nextRandom(world)` 是全局确定性随机源，假人游走、箭矢散布都依赖它的序列位置。
若草生成复用它，加一片草就会让所有既有行为偏移（golden snapshot 之外还有行为回归）。
因此 `grass.ts` 用局部 `seeded(spec.seed)` 的同算法 PRNG，只影响草。

### 3. 状态全部放 `World.grass`，表现层只读

`GrassBlade` 存根部坐标、高度、色阶、`bend` / `bendX` / `bendZ` / `cut` 等全是
plain number；`buckets` 是 `Record<string, number[]>`。可 JSON 快照、可回放、
Unity / Godot 可对照重写。表现层不写 Core，只把状态映射成实例矩阵。

### 4. 割断复用 `hits.ts`，不另起一套判定

新增纯查询 `currentMeleeShape()` / `inMeleeShape()` / `inSlamShape()`，
把 `playerHits` 的命中窗口、武器 reach、扇区半角、`hitSweep` 扫掠门、
`groundSlam` 击地圆算成 `MeleeShape` 给草块用。

**刻意不改 `playerHits` 主体**：876 例里有大量卡肉时机 / 扫掠门的精确断言，
周边功能动主干命中链路风险过高；口径一致性改由对照单测守护。

副作用（正面）：刀真的扫过草的那一帧才割断，一次挥击是「扇形依次被削开」，
而不是「按键瞬间整片消失」。

### 5. `InstancedMesh` + 脏标记 + `addUpdateRange`

一个 InstancedMesh 装 2N 个实例（每根草下段 + 上段），1 个 draw call。
只有 `bend` / `cut` 变化的实例才 `compose` 矩阵并按区间局部上传
（Matrix4 = 16 float ×2 实例、Color = 3 float ×2 实例）。
静止草场 CPU 与带宽都趋近于零。

否决方案：每根草一个 `Mesh`（2000+ draw call，必掉帧）；每帧全量遍历 +
整块上传（移动端 1~3ms 且带宽浪费）；透明材质（v9s.38 已证明会盖掉刀光）。

### 6. 2×2 的口径 = 2×2 **格**（1m × 1m）

不是 2×2 米。按 `cellSize = 0.5` 换算，一个 footprint 覆盖 4 个格子单元。
这个口径直接影响候选位数量与观感密度，先定死再谈其它。

### 7. 历史决策：曾建独立演示页（已撤销）

主场景有 7 个工位、9 个单位、智能相机和一堆 HUD，草块效果会被淹没。
当时新增第二入口 `grass-demo.html`，但**逻辑不另写一套**：仍用 Core 的
`createWorld` / `step` 与同一份 `grass-layer.ts`，只换布景与简化角色。

> **2026-11-09 修订（用户规则，见 [`../../AGENTS.md`](../../AGENTS.md)）**：
> 独立演示页**已删除**，构建改回单入口，只保留主测试场景 `index.html`。
> 草块与风场统一在主场景验证：地块走 `scene.grass.plots`、测试点走 `scene.stations`，
> A/B 用「风：开」按钮（`G` 键）。理由：多套场景导致构建多入口、文档重复、
> 合并时同路径撞车，且「看到的」容易与「主线接入的」分叉。

## 后果

- `World` 新增 `grass` 字段、`ModuleFlags` 新增 `grass`、`EventType` 新增 `'grass-cut'`，
  因此 `determinism.test.ts` 的 golden hash 必然变化 —— 属契约变更，需 `-u` 更新并在 journal 记录。
- `config/game.json` 新增 `core.grass` / `scene.grass` / `view.grass` 三段；
  冻结测试夹具没有 `scene.grass`，故 876 例旧行为零影响。
- 新增 `FX_ORDER.grass = 8`（草是不透明实体，分组不关深度测试）。
- 性能：约 390 根草 / 780 实例 / 2 draw call，GPU 无压力；风险只在「不用实例化」或
  「每帧全量遍历 + 全量上传」。安全阈值 `maxInstances ≤ 6000`、每帧 dirty < 200。

## 未采纳 / 留待 Phase 2

- 物理引擎（不需要，压弯是确定性积分）；
- vertex shader 里做 bend 偏移（当前 CPU 矩阵足够，且更易调试）；
- 草参与碰撞 / 寻路（与「走过去压开」的目标冲突）；
- 按相机距离 LOD / 分区卸载（当前规模用不上）。
