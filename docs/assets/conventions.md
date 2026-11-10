# 路径与命名规范

> 最后更新：2026-11-08。新建文件前先看这张表；表里没有的，先问「它属于哪一类」再决定放哪。

## 代码

| 路径 | 放什么 | 禁止 |
|---|---|---|
| `src/core/` | 纯 TS 玩法逻辑，可 JSON 序列化 | 引入 `three` / `lil-gui` / DOM / `Date.now()` / `Math.random()` / `class` / `enum` |
| `src/adapters/` | DOM 事件 → `Intents`、时间源 | 写游戏规则 |
| `src/presentation/` | Three.js 渲染、HUD、调试面板、纯函数表现层 | 改 Core 状态（只能读 + 通过事件触发一次性特效） |
| `src/app.ts` | 唯一同时认识 Core 与 Web 的组装层 | 放具体规则或渲染细节 |
| `config/game.json` | 全部数值、场景、视图参数 | 写代码 / 注释（JSON 不支持） |

## 文档

| 路径 | 放什么 | 命名 |
|---|---|---|
| `README.md` | 入口地图（≤100 行） | 固定名 |
| `docs/INDEX.md` | 全部文档索引 + 检索表 | 固定名 |
| `docs/journal/` | 按日期的迭代记录 | `YYYY-MM-DD-NN.md`（同一天多份时 NN 递增） |
| `docs/systems/` | 系统现状（接口 / 数据流 / 契约） | `<系统>.md`，全小写中划线 |
| `docs/state/CURRENT.md` | 当前状态 + 下一步（覆盖写） | 固定名 |
| `docs/decisions/` | 技术决策 | `ADR-NNN-<短名>.md`，NNN 三位递增 |
| `docs/checklists/` | 人工验收清单 | `<用途>.md` |
| `docs/risk-review.md` | 活跃风险 + 历史关闭记录 | 固定名 |

## 截图与验证产物

**所有截图只有一个家：`shots/`。** 根目录不再放任何图片（`/*.png` 已在 `.gitignore` 里挡住），
`shots/` 整个目录也**不入库** —— 截图是本地证据，仓库只留生成它的脚本。

| 路径 | 放什么 | 命名 |
|---|---|---|
| `shots/<批次>/` | 本轮验收截图（`v9s38/`、`v9s39/`…） | `NN-<主题>.png`，NN 从 01 递增 |
| `shots/legacy/` | 仓库根搬过来的历史 `preview-*.png`（只读留档） | 原名不动 |
| `shots/diag/` | 诊断过程的连拍 / 拼图 / 裁剪 | 随意，用完可删 |
| `/tmp/*.py` | 一次性截图 / 探针脚本 | **不需要提交**；要留的写进 `tools/` |

> v9s.40 起：`git rm --cached` 移除了 41 张历史 `preview-*.png`（此前一直被跟踪）。
> 需要看图请在本机跑 `tools/*-shot.py` 重新生成，不要往仓库里塞图。

## 工具

| 路径 | 用途 |
|---|---|
| `tools/smoke.py` | 真实浏览器跑 `dist/`，17 项断言 |
| `tools/clip-lab/` | 动作剪辑验证台（定格 / 扫角度 / 自动判定） |
| `tools/v9s38-shot.py` | v9s.38 的 5 张验收截图脚本（特效层级 / 陪练） |
| `tools/v9s39-shot.py` | v9s.39：混战全景 + 同一轮连击的第 1/2/3 段 |
| `tools/sweep_sample.py` | 刃身扫掠采样，写回 `config.hitSweep.pts` |
| `scripts/check-boundary.mjs` | Core 可移植边界守卫 |
| `scripts/check-docs.mjs` | 文档规范守卫（README 行数 / INDEX 链接 / 单文件 300 行） |

## 命名约定

- Core 状态字段用**名词**（`position / velocity / facing`），事件用**过去式**（`landed / jumped / hit`）。
- 布尔配置一律正向（`enabled` / `autoCombo`），不要 `noXxx`；面板上需要反向语义时用代理 getter/setter。
- 表现层一次性特效由单调 id 驱动（`attackId / dash.id / slamAttackId`），不要用「上一帧是否在 active」推断。
- 测试文件按版本或主题命名：`v9s38-fighters.test.ts` / `gait-pose.test.ts`，不要 `test1.ts`。
