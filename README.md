# 3D 玩法实验台 · Playtest Harness

用来**测试玩法与模块功能**的网页版 3D 实验台。核心目标是「核心逻辑可移植」：玩法规则放在纯 TypeScript、零依赖、不碰 DOM 与渲染库的 Core 里，Web 表现层只负责展示。

当前版本 **v0.9.58**。线上地址通过项目内部渠道获取（仓库不收录访问链接与凭据）。

## 快速开始

```bash
npm install
npm run dev          # http://localhost:5173（已绑定 0.0.0.0，手机连同一网络的 Network 地址）
npm run verify       # 发布前必跑：build → 全量单测 → 可移植 → smoke
```

## 操作（最小集）

| 输入 | 效果 |
|---|---|
| 空白处按住拖动 | 隐形摇杆移动（满推行程 56px，不绘制摇杆） |
| 轻点任意角色 | 循环切换该角色行为（普通假人 5 种 / 持械陪练 6 种） |
| `1`–`5` / 顶部武器条 | 剑盾 / 双剑 / 大剑 / 法杖 / 弓 |
| 攻击 / 技2 / 冲 / 跳 | 右下按钮簇；桌面 `J` / `K` / `Shift` / `Space` |
| `[` / `]` / `\` | 上一个 / 下一个测试工位 / 召回全部假人 |
| `R` | 复位（玩家、战斗、朝向、目标、受击、全部 9 个单位） |

完整按键、手势与死区见 [`docs/systems/input-controls.md`](docs/systems/input-controls.md)。

## 文档怎么读

**唯一入口是 [`docs/INDEX.md`](docs/INDEX.md)** —— 按症状查 → 文件 / 符号 / 文档 / 验收命令。不要通读 `three-scene.ts` 或 `voxel-rig.ts`。

| 想知道 | 去哪 |
|---|---|
| 有个现象要查（看不见 / 抖 / 卡 / 滑） | [`docs/INDEX.md` §2](docs/INDEX.md) |
| 某系统现在怎么工作 | [`docs/systems/`](docs/systems/overview.md) |
| 现在做到哪、下一步 | [`docs/state/CURRENT.md`](docs/state/CURRENT.md) |
| 为什么当初这么定 | [`docs/decisions/`](docs/decisions/) · [`docs/journal/`](docs/journal/) |
| 活跃风险 | [`docs/risk-review.md`](docs/risk-review.md) |
| 路径 / 命名规范 | [`docs/assets/conventions.md`](docs/assets/conventions.md) |

> 文档规则（强制）：README 只当地图（≤100 行），**不记变更日志**；「今天改了什么」进 `docs/journal/YYYY-MM-DD-NN.md`，「系统现状」进 `docs/systems/`，两者不混写。详见 [ADR-001](docs/decisions/ADR-001-docs-layout.md)。

## 目录

```
src/core/           可移植玩法逻辑（25 个文件，纯 TS，可 JSON 快照）
src/adapters/       输入 / 手势 / 时钟：DOM 事件 → Intents
src/presentation/   Three.js 渲染、体素骨架、HUD、调试面板、特效
src/app.ts          组装层（唯一同时认识 Core 与 Web 的地方）
config/game.json    全部可调数值（core.* 逻辑 / view.* 表现 / scene.* 关卡）
tests/              vitest：88 文件 / 876 例
tools/              smoke.py（16 项自检）、clip-lab（动作验证台）、截图脚本
docs/               INDEX 索引 + systems / state / decisions / journal / checklists / assets
```

依赖方向严格单向：`presentation → adapters → core`。换引擎只重写 `presentation`；迁 Unity / Godot 时 `core` 是可执行规格（对照 [`docs/systems/core-contract.md`](docs/systems/core-contract.md)）。

## 迭代约定

- 每批改动通过验收后**直接覆盖发布**，不再二次确认；小改动合并发布，大调整阶段性发布。
- 每批交付都给「框架风险 + 优化方向」，滚动记录在 [`docs/risk-review.md`](docs/risk-review.md)。
- 版本号改 `package.json`，构建后页面左下角徽标同步；发布产物只看 `dist/`。
