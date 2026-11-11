# 3D 玩法实验台 · Playtest Harness

用来**测试玩法与模块功能**的网页版 3D 实验台。核心目标是「核心逻辑可移植」：玩法规则放在纯 TypeScript、零依赖、不碰 DOM 与渲染库的 Core 里，Web 表现层只负责展示。

当前版本 **v0.9.97**。线上固定地址：<https://xuwanc.github.io/playtest-harness/>（由仓库身份定址，换沙盒、换 agent、发多少次都不变）。

> **新加入的 agent：先读 [`AGENTS.md`](AGENTS.md)。** 三条铁律——
> ① 只保留**主测试场景 `index.html`**（独立演示页已删除，不要再新建第二个场景 / 演示页）；
> ② 新测试需求 = **新建 `config/plots/<id>.json` 一个地块文件、不写世界坐标**，由 `assemblePlots()`
>    动态拼合（工位传送自动读拼合位置，地块可带测试按钮就地生成假人 / 陪练），
>    **不要再改 `config/game.json` 的 `scene.stations`**；
> ③ **每次任务完成跑 `npm run ship` 发布，把那条固定链接贴进回复**（链接不会变，不必重新收集）。
> 规则正本见 [`docs/systems/plot-assembly.md`](docs/systems/plot-assembly.md)、
> [`docs/systems/test-scene-policy.md`](docs/systems/test-scene-policy.md)。

## 快速开始

```bash
npm install
npm run dev          # http://localhost:5173（绑定 0.0.0.0，手机可用同网络的 Network 地址）
npm run verify       # 发布前必跑：build → 全量单测 → 可移植 → docs → smoke
npm run ship         # 每次任务完成必跑：构建 → 推 main → 重建 preview 产物，固定链接自动更新
```

**只有 `index.html` 一个测试场景**。草块（压开 / 割断 / 风吹麦浪）与顶部「风：开」开关都在主场景里，
`G` 键切换风做 A/B；读数用 `window.__harness.grassDebug()` / `windDebug()`。详见 [`docs/systems/grass.md`](docs/systems/grass.md)。

## 操作（最小集）

| 输入 | 效果 |
|---|---|
| 空白处按住拖动 | 隐形摇杆移动（满推行程 56px，不绘制摇杆） |
| 轻点任意角色 | 循环切换该角色行为（普通假人 5 种 / 持械陪练 6 种） |
| `1`–`5` / 顶部武器条 | 剑盾 / 双剑 / 大剑 / 法杖 / 弓 |
| 攻击 / 技2 / 冲 / 跳 | 右下按钮簇；桌面 `J` / `K` / `Shift` / `Space` |
| `[` / `]` / `\` | 上一个 / 下一个测试工位 / 召回全部假人 |
| 顶部「体型 …」/ `B` | 循环体型：标准 → 瘦高 → **蜘蛛**（`?hero=spider` 直接以蜘蛛开局） |
| 顶部「风：开」/ `G` | 切换风吹麦浪（A/B 对照，默认开） |
| `R` | 复位（玩家、战斗、朝向、目标、受击、全部 9 个单位） |

完整按键、手势与死区见 [`docs/systems/input-controls.md`](docs/systems/input-controls.md)。

## 文档怎么读

**唯一入口是 [`docs/INDEX.md`](docs/INDEX.md)** —— 按症状查 → 文件 / 符号 / 文档 / 验收命令。不要通读 `three-scene.ts` 或 `voxel-rig.ts`。

| 想知道 | 去哪 |
|---|---|
| **新加入的 agent / 拉下 git 后第一步** | [`AGENTS.md`](AGENTS.md)（3 分钟：三条铁律 + 流程） |
| **测试场景规则 / 怎么加地块与工位** | [`docs/systems/plot-assembly.md`](docs/systems/plot-assembly.md)（动态拼合正本）· [`docs/systems/test-scene-policy.md`](docs/systems/test-scene-policy.md) |
| **动画：站姿 / 起手收招 / 连击节奏** | [`docs/systems/idle-stance.md`](docs/systems/idle-stance.md) · [`docs/systems/pose-entry.md`](docs/systems/pose-entry.md) · [`docs/systems/animation.md`](docs/systems/animation.md) |
| **陪练能被打死 / 命中飙血 / 自动刷新** | [`docs/systems/damage-death.md`](docs/systems/damage-death.md) · [`docs/systems/blood.md`](docs/systems/blood.md) |
| **蜘蛛主角 / 加另一副骨架** | [`docs/systems/spider-locomotion.md`](docs/systems/spider-locomotion.md) · [`docs/decisions/ADR-010`](docs/decisions/ADR-010-spider-locomotion.md) |
| **快速试方盒子角色的造型** | [`docs/systems/voxel-forge.md`](docs/systems/voxel-forge.md)（写 JSON → 3D 预览 → 导出 TS） |
| 有个现象要查（看不见 / 抖 / 卡 / 滑） | [`docs/INDEX.md` §2](docs/INDEX.md) |
| 某系统现在怎么工作 | [`docs/systems/`](docs/systems/overview.md) |
| 现在做到哪、下一步 | [`docs/state/CURRENT.md`](docs/state/CURRENT.md) |
| 为什么当初这么定 | [`docs/decisions/`](docs/decisions/) · [`docs/journal/`](docs/journal/) |
| 体素草块（压开 / 割断 / 麦浪）怎么工作 | [`docs/systems/grass.md`](docs/systems/grass.md) |
| 多个 agent 同时开发 / 怎么合并提交 | [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) |
| 活跃风险 | [`docs/risk-review.md`](docs/risk-review.md) |
| 路径 / 命名规范 | [`docs/assets/conventions.md`](docs/assets/conventions.md) |

> 文档规则（强制）：README 只当地图（≤100 行），**不记变更日志**；「今天改了什么」进 `docs/journal/YYYY-MM-DD-NN-<主题>.md`，「系统现状」进 `docs/systems/`，两者不混写。详见 [ADR-001](docs/decisions/ADR-001-docs-layout.md)。

## 目录

```
AGENTS.md           新 agent 上手：三条铁律 + 标准 git 流程 + 冲突分类
src/core/           可移植玩法逻辑（纯 TS，可 JSON 快照）
src/adapters/       输入 / 手势 / 时钟：DOM 事件 → Intents
src/presentation/   Three.js 渲染、体素骨架、HUD、调试面板、特效
src/app.ts          组装层（唯一同时认识 Core 与 Web 的地方）
config/game.json    可调数值（core.* 逻辑 / view.* 表现 / scene.* 关卡；工位已迁出）
config/plots/*.json 一地块一文件（不写世界坐标，assemblePlots 动态拼合）
index.html          唯一主测试场景（单入口）
tests/              vitest：128 文件 / 1312 例
tools/              smoke.py（77 项自检）、clip-lab（动作验证台）、ship.sh（一条命令发布）、voxel-forge（造型工坊）
shots/              截图（唯一存放处，整目录不入库；见 docs/assets/conventions.md）
docs/               INDEX 索引 + systems / state / decisions / journal / checklists / assets
```

依赖方向严格单向：`presentation → adapters → core`。换引擎只重写 `presentation`；迁 Unity / Godot 时 `core` 是可执行规格（对照 [`docs/systems/core-contract.md`](docs/systems/core-contract.md)）。

## 迭代约定

- 每批改动通过验收后**直接覆盖发布**，不再二次确认；小改动合并发布，大调整阶段性发布。
- **测试场景只保留主场景**：新需求在主场景新建地块文件（`config/plots/*.json`），由动态拼合
  自动分配位置与工位，不新建演示页、不手写绝对坐标（见 `AGENTS.md`）。
- **每次任务完成都要更新线上并贴链接**：`npm run ship` 一条命令完成「构建 → 推 main → 重建 `preview`
  分支产物」，线上固定地址 <https://xuwanc.github.io/playtest-harness/> 随之更新，**链接永远是同一条**。
  沙盒隧道（`*.app.workbuddy.host`）只用于本地临时调试，不作为对外链接。
- **协同推送**：沙箱重建后 git 凭证会丢，`ship.sh` 会自动从 `~/.config/workbuddy/github.token` 恢复；
  多 agent 场景下各自推**同名功能分支**、经合并闸门并 main，再由闸门跑一次 `npm run ship` 发布。详见
  [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) §1。
- 每批交付都给「框架风险 + 优化方向」，滚动记录在 [`docs/risk-review.md`](docs/risk-review.md)。
- 版本号由 integrator 统一改 `package.json`；发布产物只看 `dist/`（`npm run build` 单入口）。
- GitHub push / REST 网关 `--apply` **需用户明确通知**；本地功能分支 commit 不受此限。
