# 给新加入的 Agent · 动手前先读这一页

> 拉下仓库后花 3 分钟读完本节再改代码。这里是**约定的入口**；
> 测试场景规则正本见 [`docs/systems/test-scene-policy.md`](docs/systems/test-scene-policy.md)，
> 分支 / 契约 / 提交见 [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md)。

## 一、三条铁律（测试场景 + 发布）

1. **只有一个测试场景：主测试场景 [`index.html`](index.html)**（组装入口 `src/app.ts`）。
   历史上存在过第二套独立演示页 `grass-demo.html` / `src/grass-demo.ts`，**已删除**。
   **不要再新建**独立测试场景、演示页、第二个 HTML 入口，也不要复制一份 Core / 表现层另写一套。

2. **新测试需求 = 新建一个地块文件，绝不写世界坐标**（v9s.43 起取代「手写 `scene.stations`」）：
   - 一地块一文件 `config/plots/<id>.json`，只写 `id/name/hint` 与相对布局意图；
   - `assemblePlots()`（`src/core/plot-assembly.ts`）按 id 字典序排序、自动分配不重叠槽位，
     **多个 agent 同时加同一位置也不会冲突**；
   - 工位传送读拼合后的 `spawnX/spawnZ`，面板自动多一行，不用改 `src/config.ts` / `app.ts`；
   - 地块可带 `testSpawn`，面板自动多一枚「生成 N 人」测试按钮，就地摆假人 / 陪练；
   - **不要再往 `config/game.json` 里加 `scene.stations` / `scene.grass.plots`**（已删除）；
   - 规则正本见 [`docs/systems/plot-assembly.md`](docs/systems/plot-assembly.md)。

3. **每次完成一次任务都要更新线上并贴链接**（方便快速验证）：
   - 跑 `npm run verify` → `npm run publish:preview`（`tools/publish-preview.mjs`）；
   - 脚本 build → 同步 `dist/` 到线上目录 → 校验资源 → 打印公网链接；
   - **把打印出的两条链接贴进任务回复**（主场景 / 根地址）；
   - 这是「线上静态预览同步」，**不是 GitHub push**；push / `--apply` 仍需用户明确通知。

> 为什么：多套场景让「看到的」≠「主线接入的」；手写绝对坐标 + 共改一个数组是多 agent
> 冲突的根源；只 commit 不同步线上，别人和用户没法快速验证。

## 二、开工标准流程（读通 / 写走 MCP 网关）

2026-11-09 实测：`github.com:443` **读**可用（`fetch` / `clone` / `ls-remote`），
但**写没有 git 凭证**——`git push` 会报 `could not read Username for 'https://github.com'`。
因此读操作用标准 git，**协同推送走已授权的 GitHub MCP 网关**：

```bash
git fetch origin
git checkout -b feat/<主题> origin/main     # 一定基于最新 main，保留共同祖先
# ...只改自己负责的文件...
git fetch origin                            # 提交前再看有无新推送
npm run verify
npm run publish:preview                      # 更新线上预览，把打印的链接贴进任务回复
git add -A && git commit -m "..."
python3.11 tools/push-branch.py              # 用户通知 push 后：推到同名功能分支（绝不动 main）
git fetch origin <分支> && git diff --stat HEAD origin/<分支>   # 必须为空（树一致）
git reset --hard origin/<分支>               # 本地与远端对齐（远端 commit 由 API 重建，SHA 不同但 tree 相同）
```

- `tools/push-branch.py`：走 MCP `create_branch` / `push_files` / `delete_file`，
  内容从磁盘读（可搬 800KB+ 构建产物），不依赖 token、不需要对话上下文。
  先 `--dry` 看计划。详见 [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) §1。
- `tools/gh-commit.mjs`（REST 网关）是**需要自备 token 的兜底**，且它只提交
  「工作区未提交的差异」，推不了本地已有的 commit 链 —— 协同推送优先用 `push-branch.py`。
- **不要** `git init` + 导入代码快照：那会生成与远端无共同祖先的历史，
  合并时几十个文件被误判成「双方新增」（本项目踩过，见 `docs/journal/`）。
- 每天 rebase 一次 `origin/main`，别攒几十个文件再合。
- **GitHub push / 网关 `--apply` 需用户明确通知**；当前约定下本地 commit 可以，push 不行。

## 三、共享热点文件：单一写入方

`config/game.json`、`src/core/{types,world,step,index,hits}.ts`、`src/app.ts`、
`src/presentation/three-scene.ts`、`docs/INDEX.md`、`docs/state/CURRENT.md`、
`package.json`、`dist/` —— 这些**由 integrator 独占或排队改**，各 agent 只新建自己的文件。
契约（类型 / 事件 / config schema / `World` 字段 / 模块顺序）由 integrator 一次性定完再并行。

`config/plots/*.json` **不是热点**：每个 agent 只新建自己的那一个文件（这正是动态拼合
消除冲突的目的），不要改别人的地块文件，也不要往 `config/game.json` 塞工位。

文件名带归属：`docs/journal/YYYY-MM-DD-NN-<主题>.md`，别用纯编号，避免 add/add 撞车。

## 四、合并冲突怎么解（本次实测的分类）

| 类型 | 文件 | 解法 |
|---|---|---|
| **生成物 · 必须重生成** | `tests/__snapshots__/determinism.test.ts.snap`、`dist/*` | 两边都改了 `World` 结构，合并后 golden 会是**第三个值**；选任何一边都永久漂移 → `npx vitest run tests/determinism.test.ts -u` + `npm run build` |
| **追加型 · 取并集** | `tools/smoke.py`、`three-scene.ts`、`.gitignore`、`README.md`、`docs/INDEX.md` | 两边新增都保留 |
| **单调 / 覆盖写 · integrator 定值** | `package.json`（版本）、`docs/state/CURRENT.md` | 取较大版本 / 按当前状态重写 |
| **同路径不同内容 add/add** | `docs/journal/*` | 远端占原路径，本地另存带主题的文件名 |
| **自动合并也要验语义** | `config/game.json`、`app.ts`、`types.ts`、`hits.ts` | git 说 auto-merge 不等于逻辑正确 → 跑 `tsc` + `verify` |

## 五、提交前必跑

```bash
npm run verify              # build → 全量单测 → Core 可移植边界 → docs:check → smoke
npm run verify:portable     # 改了 src/core/ 时必跑
npm run publish:preview     # 每次任务完成必跑：同步线上 + 打印公网链接
```

改了 `World` 结构 → golden hash 必变，用 `-u` 更新并在 journal 记一笔「契约变更」。
新增机制要在 [`docs/INDEX.md`](docs/INDEX.md) 登记（表里没有的东西没人找得到）。

## 六、去哪找

| 想找 | 位置 |
|---|---|
| 测试场景与扩展规则（正本） | [`docs/systems/test-scene-policy.md`](docs/systems/test-scene-policy.md) |
| 动态地块拼合 / 测试按钮 / 发布（正本） | [`docs/systems/plot-assembly.md`](docs/systems/plot-assembly.md) |
| 分支 / 契约 / 提交网关 | [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) |
| 文档地图（按症状查） | [`docs/INDEX.md`](docs/INDEX.md) |
| 现在做到哪、下一步 | [`docs/state/CURRENT.md`](docs/state/CURRENT.md) |
| 项目是什么、怎么跑 | [`README.md`](README.md) |
