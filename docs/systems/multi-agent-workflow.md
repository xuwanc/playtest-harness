# 多 agent 协作：分支、契约与冲突（v9s.46）

> 本文是给后续多个 agent 同时开发用的**操作约定**，不是提交记录。
> 3 分钟入口：[`../../AGENTS.md`](../../AGENTS.md)（拉下 git 先读它）；
> 测试场景规则正本：[`test-scene-policy.md`](test-scene-policy.md)。

## 0. 版本号：功能分支不占号，合并时统一领

`package.json` 的 `version`（线上徽标）与内部代号 `v9s.NN` 是**同一条序列**，只能有一处发号。

| 阶段 | 谁定 | 规则 |
|---|---|---|
| 开功能分支 | 不用管 | 分支名 `feat/<主题>`；commit 里可以写「待定号」，**不要**写 `v9s.NN` |
| 合并进 main | integrator | `version` +1，宣布 `v9s.NN`；同一次提交更新 `CURRENT.md` 的徽标 |
| 合并之后 | — | 删分支；tag `v<version>` 打在 merge commit 上 |

**为什么要写这条**：2026-11-09 两个 agent 各自把工作命名为 `v9s.43` / `v9s.44`
（一边是下盘转向，一边是草地 + 地块拼合），合并后两个 `v9s.44` 指向完全不同的东西，
journal 也各有一份 `2026-11-09-02.md`（add/add 冲突），只能事后补解释。

**分支里的写法**：主题用 `feat(grass): …` / `fix(gait): …`，body 写
`Release-Note: 待定（合并时领号）`；非要写号就写 `v9s.x`。

## 1. 通道：读用标准 git，写走 GitHub MCP 网关

**先测再选通道**（结论随环境变，别照抄）：

```bash
git ls-remote --heads origin >/dev/null && echo 读 OK
GIT_TERMINAL_PROMPT=0 git push --dry-run origin HEAD:refs/heads/__probe 2>&1 | tail -1
# 能写 → "Everything up-to-date"；不能写 → 立刻报 could not read Username（不加 GIT_TERMINAL_PROMPT=0 会挂住等输入）
```

2026-11-09 实测：`github.com:443` **读**可用（`fetch` / `clone` / `ls-remote`），
但 `git push` **没有写凭证**（`could not read Username for 'https://github.com'`），
`gh` 未登录、环境里也没有 `GITHUB_TOKEN`。此时写操作走已授权的 **GitHub MCP 网关**
（`~/.codebuddy/.mcp.json` 的 `github` connector），固化脚本 `tools/push-branch.py`：

```bash
python3.11 tools/push-branch.py --dry         # 先看计划
python3.11 tools/push-branch.py               # 推同名功能分支（不存在则基于 main 建，绝不动 main）
git fetch origin <分支>
git diff --stat HEAD origin/<分支>            # 必须为空 → tree 逐字节一致
git reset --hard origin/<分支>                # 本地与远端对齐
```

| 通道 | 读 | 写 | 备注 |
|---|---|---|---|
| 标准 git | ✅ `fetch` / `ls-remote` | ❌ `push` 无凭证 | 拉分支、看远端状态用它 |
| `tools/push-branch.py`（MCP 网关） | — | ✅ | **协同推送首选**；内容从磁盘读，可搬大文件，不需要 token |
| `tools/gh-commit.mjs`（REST 网关） | — | ✅ 需自备 token | 兜底；且只提交「工作区未提交的差异」，推不了本地 commit 链 |

> **重要**：MCP 网关推上去的 commit 是 API 重建的，SHA 与本地不同，但 **tree 一致**。
> 所以推完必须 `fetch` + `git diff --stat`（应为空）+ `reset --hard` 对齐，
> 否则本地会显示「ahead N / behind M」的假分叉。推送前把本地分层 commit
> `git branch backup/<名字> <SHA>` 留个备份，可随时找回。
> 2026-11-09 首次实战：`feat/integration-grass-wind` 主干树 `4843ea5b…` 与本地完全一致。

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
- 通道优先级：标准 `git push` 能写就用它（历史线性、SHA 稳定）；不能写才走网关（commit 由 API 重建，需 `diff` + `reset --hard` 对齐）。

## 2. 三条铁律（测试场景 + 发布，正本见 [`test-scene-policy.md`](test-scene-policy.md) / [`plot-assembly.md`](plot-assembly.md)）

1. **只保留主测试场景 `index.html`**：独立演示页 `grass-demo.html` / `src/grass-demo.ts` 已删除，
   构建单入口。不要新建第二个场景 / 演示页，也不要复制一份 Core / 表现层另写一套。
2. **新测试需求 = 新建 `config/plots/<id>.json` 一个地块文件、不写世界坐标**：
   `assemblePlots()` 按 id 字典序排序、自动分配不重叠槽位，工位传送读拼合后的 `spawnX/spawnZ`。
   `config/game.json` 的 `scene.stations` / `scene.grass.plots` **已删除**，不要再往回加。
   这样多个 agent 同时加同一个位置也不会 git 冲突、也不会叠放；地块可带 `testSpawn`
   自动生成测试按钮（就地摆假人 / 陪练）。任一 agent 都遵守，别人拉下 git 就能直接复现。
3. **每次完成一次任务都要更新线上并贴链接**：`npm run publish:preview` 发布 `dist/`
   并打印**唯一**公网链接（见 §9），把链接贴进任务回复。这是发布，**不是 GitHub push**。

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
| **各自新建 · 不会冲突** | `config/plots/<id>.json` | 一地块一文件、无世界坐标，拼合器按 id 排序；两边同时加也不叠放 → 全部保留（v9s.46 起的新规则） |
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

## 9. 发布闸门：一条通道、一个链接（v9s.46）

**与 GitHub push 解耦**：用户要求「每次 agent 完成一次任务都要更新一次线上，贴出链接」，
指的是**线上静态预览**，不是往 `origin` 推代码。

```bash
npm run verify            # build → 全量单测 → 可移植边界 → docs → smoke
npm run publish:preview   # tools/publish-preview.mjs
```

`tools/publish-preview.mjs` 只做三件事：

1. 调发布服务（`sites/scripts/publish.js --dir dist`），把 `dist/` 整体替换上线；
2. 解析返回的 `shareLink` / `verified`，未 verified 就非零退出；
3. 打印**唯一**公网链接。

链接只认 [`../state/CURRENT.md`](../state/CURRENT.md) 里那一条；换域名要同时改 CURRENT 与本文。
2026-11-09 曾并行两套通道（`/workspace/grass-preview` + `aac01946…` 与 `dist` + `aef42c…`），
用户手机打开两个链接看到两个版本（0.9.63 / 0.9.66）—— 已收敛为一套。

push / `--apply` 仍按 §1 / §7，需用户明确通知。

## 10. 合并闸门：合的是「合并结果」，不是分支

顺序固定，缺一步都不算完成：

| # | 动作 | 判定 |
|---|---|---|
| 1 | `git fetch`，确认 main 没有再动 | 分支基于最新 main |
| 2 | `git merge --no-ff`（或 rebase 后 ff） | 冲突按 §6 分类解 |
| 3 | `dist/`：`rm -rf dist && npm run build` | **不许手解**构建产物 |
| 4 | 在**合并结果**上跑 `npm run verify` | tsc 0 / 测试全绿 / smoke 全过 / docs:check PASS |
| 5 | 文件数 / 用例数 / smoke 项数抄进 journal | 留痕，下次对比 |
| 6 | tag `v<version>`、删功能分支、发一条链接 | 主干可整体 revert 这次 merge |

**为什么 `--no-ff`**：分支里常混着「搬构建产物」这类噪声提交（本次 5 个提交里约 1.3 万行
增删只是同一个 `dist` 产物在来回搬），rebase 会把同一处冲突解 N 遍；保留 merge commit
之后出问题可以 `git revert -m 1 <merge>` 整体回滚。

**合并后必查三件事**：`config/game.json` 的 key 集合（自动合并也要比对）、
`tests/__snapshots__/determinism.test.ts.snap` 是否需 `-u`（只有契约变了才需要）、
构建产物入口名是否换了（v9s.46 从 `index-*.js` 改成 `main-*.js`，旧缓存会 404）。
