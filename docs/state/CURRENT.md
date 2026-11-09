# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09（协同推送后）。

## 一句话

用户明确通知后，已把 v9s.43 + v9s.44 全部改动**推送到远程功能分支**
`feat/integration-grass-wind`（基于 `main` `5a320f4`，**main 未被触碰**）。
远端树 `4843ea5b…` 与本地 HEAD **逐字节一致**（263 文件、`git diff` 为空）。
本地已 `reset --hard` 对齐远端、设置跟踪分支，分层 commit 留在备份分支。
线上静态预览仍是 v0.9.63（源码零变化；`publish:preview` 重新 build 仅使 `buildTime`
时间戳变化 → 产物 hash 变为 `main-B1_t5k_a.js`，已同步线上与远端分支，三者一致）。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.63`（本次纯协同流程，未 bump；dist 仅 buildTime 变 → 新 hash `main-B1_t5k_a.js`） |
| 当前分支 | `feat/integration-grass-wind` @ `9fb9e45`，跟踪 `origin/feat/integration-grass-wind` |
| 远程 `main` | `5a320f4`（**未变**，无远端写入 main） |
| 远程功能分支 | `feat/integration-grass-wind` @ `9fb9e45`（新增，3 个 API 重建 commit） |
| 本地分层历史备份 | `backup/local-v9s43-v9s44` @ `f8281ae`（`a596084`/`7e52761`/`733f21c`/`f8281ae`） |
| 线上静态预览 | `index.html` 与 `main.html` 都指向唯一主场景；root / main 均 200 |
| 推送通道 | `tools/push-branch.py`（GitHub MCP 网关；`git push` 在本沙箱无写凭证） |

## 本轮做了什么（[`../journal/2026-11-09-05-push-branch.md`](../journal/2026-11-09-05-push-branch.md)）

- 回答「协同是否要推分支」：**是**，但应推**独立功能分支**而非 main，
  供他人 `fetch` / review / 开 PR；不污染主线、多 agent 不互相覆盖。
- 实测澄清通道：`github.com:443` 只读可用，`git push` 缺凭证失败；
  `gh` 未登录、无 `GITHUB_TOKEN`、`gh-commit.mjs` 推不了本地 commit 链。
  改用已授权的 GitHub MCP 网关（`create_branch` / `push_files` / `delete_file`），
  一次写入 57 文件 / 1.55MB（含 835KB 构建产物）+ 删除 2 个旧 hash 产物。
- 固化 `tools/push-branch.py`（可复用协同推送，`--dry` 看计划）；
  修正 `AGENTS.md` / `README.md` / `multi-agent-workflow.md` / `docs/INDEX.md`
  里过时的「标准 git push 可用 / 未 push」描述。
- 推送后校验 tree 一致 → 本地 `reset --hard` 对齐 → 设置 upstream，
  避免「ahead/behind 假分叉」。

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error（对齐后工作区未变） |
| `npx vitest run` | 948 通过，golden `5562e496…` 未变 |
| `npm run verify:portable` / `docs:check` | PASS |
| `npm run smoke` / `npm run verify` | 33 项 / 全链通过 |
| 远端 tree 校验 | `git diff --stat HEAD origin/feat/integration-grass-wind` **为空** |
| 线上预览 | `npm run publish:preview` 同步，root / main 200 |

## 正在做 / 下一步

1. **等用户决定是否开 PR 合并到 `main`**（本次只推功能分支，未合并、未开 PR）。
   合并入口：`https://github.com/xuwanc/playtest-harness/compare/main...feat/integration-grass-wind`。
2. 别的 agent 拉下 git 先读 [`../../AGENTS.md`](../../AGENTS.md)：三条铁律 +
   「读用标准 git、协同推送走 `tools/push-branch.py`」。
3. 若想让再生更慢：优先调 Core `grassGrowth()` 曲线 / `GRASS_GROWTH_STAGGER`；
   改 `core.grass.regrowSec` 属配置变更，会让 golden 漂移（需 `-u` + 记契约变更）。
4. 默认布局最多放 5 个 auto 地块，超出会报 `diagnostics.unplaced`（由 integrator 调布局）。
5. 临时 PAT 曾明文出现，建议轮换。

## 已知未关闭的结构性风险

见 [`../risk-review.md`](../risk-review.md)。摘要：`transparent` 编译期属性、
`FX_ORDER` 无强制入口、`spar` 站位带顶墙、连击让单轮伤害事件 ×3、
`groundHeightAt` 只按中心点取高。
