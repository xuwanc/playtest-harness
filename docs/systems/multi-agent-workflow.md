# 多 agent 协作：分支、契约与冲突（v9s.42）

> 本文是给后续多个 agent 同时开发用的**操作约定**，不是提交记录。
> 3 分钟入口：[`../../AGENTS.md`](../../AGENTS.md)（拉下 git 先读它）；
> 测试场景规则正本：[`test-scene-policy.md`](test-scene-policy.md)。

## 1. 通道：标准 git（网络已恢复）

`github.com:443` 于 2026-11-09 实测连通，`git fetch` / `clone` / `push` / `ls-remote` 均可用。
**优先标准 git**；`tools/gh-commit.mjs`（REST / Git Data API 提交网关）降为网络受限时的兜底。

早期工作区是 `codeload` 归档 + `git init` 的**独立快照**，与远端无共同祖先，
直接 `git merge` 会走 unrelated-histories，把几十个文件误判成「双方新增」。
`git replace --graft` 只能本地临时重连，**不能随 push 传播** ——
正确做法是**基于 `origin/main` 新建功能分支**，把本地改动 cherry-pick / rebase 上去。

```bash
git fetch origin
git checkout -b feat/<主题> origin/main       # 一定基于最新 main，保留共同祖先
# ...只改自己负责的文件...
git fetch origin && npm run verify            # 提交前再看有无新推送
git add -A && git commit -m "..."
```

- 每天 rebase 一次 `origin/main`，别攒几十个文件再合。
- **GitHub push / 网关 `--apply` 需用户明确通知**；本地功能分支 commit 不受此限。

## 2. 三条铁律（测试场景 + 发布，正本见 [`test-scene-policy.md`](test-scene-policy.md) / [`plot-assembly.md`](plot-assembly.md)）

1. **只保留主测试场景 `index.html`**：独立演示页 `grass-demo.html` / `src/grass-demo.ts` 已删除，
   构建单入口。不要新建第二个场景 / 演示页，也不要复制一份 Core / 表现层另写一套。
2. **新测试需求 = 新建 `config/plots/<id>.json` 一个地块文件、不写世界坐标**：
   `assemblePlots()` 按 id 字典序排序、自动分配不重叠槽位，工位传送读拼合后的 `spawnX/spawnZ`。
   `config/game.json` 的 `scene.stations` / `scene.grass.plots` **已删除**，不要再往回加。
   这样多个 agent 同时加同一个位置也不会 git 冲突、也不会叠放；地块可带 `testSpawn`
   自动生成测试按钮（就地摆假人 / 陪练）。任一 agent 都遵守，别人拉下 git 就能直接复现。
3. **每次完成一次任务都要更新线上并贴链接**：`npm run publish:preview` 同步静态预览
   并打印公网链接，把两条链接贴进任务回复。这是预览同步，**不是 GitHub push**。

## 3. 令牌（安全红线，仅 REST 兜底时需要）

| 项 | 约定 |
|---|---|
| 来源 | 环境变量 `GITHUB_TOKEN`，或 `GH_TOKEN_FILE`，或 `~/.config/playtest-harness/gh-token` |
| 权限 | 文件强制 `chmod 600`，脚本会检查并拒绝权限过宽的令牌文件 |
| 绝不入库 | `.gitignore` 已排除 `.gh_pat*` / `gh-token*`；令牌文件放仓库目录**之外** |
| 绝不进日志 | 脚本不打印令牌，也不把令牌作为命令行参数 |
| 最小权限 | 每个 agent 独立 fine-grained PAT，仅 `Contents: read & write` + 指定仓库 |
| 轮换 | 临时 PAT 曾明文出现在对话里，**建议轮换** |

> 历史结论：`permissions.push = true` 只是账号角色映射，不代表连接器令牌真能写
> （实测连接器 3 次写操作全部 `403 Resource not accessible by integration`）。

## 4. 共享热点文件：单一写入方

| 热点文件 | 为什么不能并行写 |
|---|---|
| `config/game.json` | 全部数值集中一处（2000+ 行） |
| `src/core/types.ts` / `world.ts` / `step.ts` / `index.ts` / `hits.ts` | 类型、World 初始化、模块顺序、出口 |
| `src/app.ts` / `src/presentation/three-scene.ts` | 组装层与渲染总入口 |
| `docs/INDEX.md` / `docs/state/CURRENT.md` / `package.json` / `dist/` | 文档地图、状态、版本号、构建产物 |

**契约先行**：由 integrator 一次性改完所有共享文件（类型、事件、config schema、
`World` 字段、模块顺序），之后各 agent 只**新建**自己的文件并行开发：

| Agent | 只新建的文件 |
|---|---|
| A · Core | `src/core/<功能>.ts` |
| B · 表现层 | `src/presentation/<功能>-layer.ts` |
| C · 测试 | `tests/<功能>.test.ts` |
| D · 文档 | `docs/systems/<功能>.md`、`docs/decisions/ADR-XXX.md` |

合并顺序：**core → tests → render → 集成 → 文档**，每次合并跑一次 `npm run verify`。
效果验证在主场景新建 `config/plots/<id>.json` 地块，由拼合器自动配工位，**不再单建演示页、
不再共改 `config/game.json`**。地块文件是各 agent 的独立新增文件，天然不会冲突。
文件名带归属：`docs/journal/YYYY-MM-DD-NN-<主题>.md`，别用纯编号，避免 add/add 撞车。

## 5. 并发提交：乐观锁（REST 兜底通道）

`PATCH /git/refs/heads/<branch>` 带 `force: false`：提交前取 `baseSha` →
`base_tree = baseCommit.tree.sha` 叠自己的文件 → 引用若已被别人推进（409/422），
重读基线、整条链重放，最多 `--retries 3`。

所以多 agent 同时提交不会互相覆盖，只会「后到的自动 rebase 到最新 tree 上」。
**但同一文件的并发写仍是后写覆盖先写** —— 这正是 §4 要求排队的原因。

## 6. 冲突怎么解（2026-11-09 实测的分类）

| 类型 | 文件 | 解法 |
|---|---|---|
| **各自新建 · 不会冲突** | `config/plots/<id>.json` | 一地块一文件、无世界坐标，拼合器按 id 排序；两边同时加也不叠放 → 全部保留（v9s.43 起的新规则） |
| **生成物 · 必须重生成** | `tests/__snapshots__/determinism.test.ts.snap`、`dist/*` | 两边都改了 `World` 结构，合并后 golden 会是**第三个值**（本次 `5562e496…`），选任何一边都永久漂移 → `npx vitest run tests/determinism.test.ts -u` + `npm run build` |
| **追加型 · 取并集** | `tools/smoke.py`、`three-scene.ts`、`.gitignore`、`README.md`、`docs/INDEX.md` | 两边新增都保留 |
| **单调 / 覆盖写 · integrator 定值** | `package.json`（版本）、`docs/state/CURRENT.md` | 取较大版本 / 按当前状态重写 |
| **同路径不同内容 add/add** | `docs/journal/*` | 远端占原路径，本地另存带主题的文件名 |
| **自动合并也要验语义** | `config/game.json`、`app.ts`、`types.ts`、`hits.ts` | git 说 auto-merge 不等于逻辑正确 → 用三方 key 集合比对 + `tsc` + `verify` |

本次真实落地：基于 `origin/main` 建分支后 cherry-pick 本地改动，9 个冲突按上表解决
（`.gitignore` 自动合并成功，比演练少 1 个）；远端 9 个新增文件全部保留，`tsc` 0 error。

## 7. 提交网关用法（`--apply` 需用户明确通知）

```bash
node tools/gh-commit.mjs                 # 只读：看会提交哪些文件、远端基线是什么
node tools/gh-commit.mjs --list         # 只列文件，不联网
# 用户通知「可以提交」后：
GITHUB_TOKEN=xxx node tools/gh-commit.mjs --apply -m "feat(grass): ..."
GITHUB_TOKEN=xxx node tools/gh-commit.mjs --apply -m "..." \
  --path src/core/grass.ts --path tests/grass.test.ts
```

- **默认 `--dry-run`**：只打印计划，绝不写远端；真实写入必须显式 `--apply`。
- 变更文件自动遵守 `.gitignore`（`node_modules/`、令牌、截图都不会被提）。
- 标准 git 可用时优先 `git push`，网关只在网络受限时使用。

## 8. 给下一个 agent 的检查清单

1. 拉下 git 先读 [`../../AGENTS.md`](../../AGENTS.md)（三条铁律 + 流程）。
2. `git fetch origin`，基于最新 `origin/main` 建功能分支；提交前再 fetch 一次。
3. 只改自己负责的新文件；共享热点文件在合并窗口里排队，别并发写。
4. **只保留主测试场景**：新测试需求新建 `config/plots/<id>.json` 地块文件，不写世界坐标、
   不改 `config/game.json`、不新建演示页（[`plot-assembly.md`](plot-assembly.md)）。
5. 提交前 `npm run verify` 全绿；改了 `src/core/` 额外 `npm run verify:portable`。
6. 改了 `World` 结构 → golden hash 必变，`-u` 更新并在 journal 记一笔「契约变更」。
7. 新增机制在 `docs/INDEX.md` 登记（§2 / §3 / §6），单份文档 ≤300 行。
8. 效果类改动给可复现入口（主场景按钮 / 快捷键 / `__harness.*` / 截图脚本），别只靠文字。
9. **任务收尾跑 `npm run publish:preview` 并把公网链接贴进回复**（见 §9）。

## 9. 每次任务完成的发布闸门（v9s.43）

**与 GitHub push 解耦**：用户要求「每次 agent 完成一次任务都要更新一次线上，贴出链接」，
指的是**线上静态预览**，不是往 `origin` 推代码。

```bash
npm run verify            # build → 全量单测 → 可移植边界 → docs → smoke
npm run publish:preview   # tools/publish-preview.mjs
```

脚本做四件事：

1. `npm run build`（`SKIP_BUILD=1` 可跳过，供 verify 之后复用）；
2. 同步 `dist/` 到 `/workspace/grass-preview/`：清旧 hash、删历史独立演示页，
   `index.html` / `main.html` 都指向唯一主场景；
3. 校验 HTML 的 `./assets/*` 引用存在、公网 root / main 均 200；
4. 打印可直接粘贴的公网链接（含 sharecode）。

服务由 `/workspace/.cloudstudio` 提供（端口 / 目录固定），脚本只换文件不换端口，
链接长期不变。**把打印出的两条链接贴进任务回复**，用户 / 别的 agent 手机即可验证。
push / `--apply` 仍按 §1 / §7，需用户明确通知。
