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
   - 脚本发布 `dist/` → 校验 `verified` → 打印**唯一**公网链接（不再有第二条）；
   - **把这条链接贴进任务回复**；
   - 这是「线上静态预览同步」，**不是 GitHub push**；代码推送与合并由
     `tools/agent-sync.py finish` 自动完成（用户已授权，见规范 §11）。

> 为什么：多套场景让「看到的」≠「主线接入的」；手写绝对坐标 + 共改一个数组是多 agent
> 冲突的根源；只 commit 不同步线上，别人和用户没法快速验证。

## 二、开工标准流程（读通 / 写走 MCP 网关）

读用标准 git；**能不能 push 先测**（`GIT_TERMINAL_PROMPT=0 git push --dry-run origin HEAD:refs/heads/__probe`；不加这个变量会挂住等输入）。
2026-11-09 本沙箱写没有凭证，此时走已授权的 GitHub MCP 网关（细节见规范 §1）：

```bash
git fetch origin
python3.11 tools/agent-sync.py start --agent <你的id> --topic <主题>   # 基于最新 main 建 feat/<主题>-<agent>
# ...只改自己负责的文件...
npm run verify
git add -A && git commit -m "..."
python3.11 tools/agent-sync.py finish        # 收尾闭环（详见规范 §11）：
#   fetch → 必要时 merge main 并按 §6 解冲突 → 领号 → build/golden → verify
#   → 推自己的分支 → 建 PR → GitHub 端自动 merge → 对齐 → publish:preview（唯一链接）
```

- `tools/push-branch.py`：走 MCP `create_branch` / `push_files` / `delete_file`，
  内容从磁盘读（可搬 800KB+ 构建产物），不依赖 token、不需要对话上下文。
  先 `--dry` 看计划。详见 [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) §1。
- `tools/gh-commit.mjs`（REST 网关）是**需要自备 token 的兜底**，且它只提交
  「工作区未提交的差异」，推不了本地已有的 commit 链 —— 协同推送优先用 `push-branch.py`。
- **不要** `git init` + 导入代码快照：那会生成与远端无共同祖先的历史，
  合并时几十个文件被误判成「双方新增」（本项目踩过，见 `docs/journal/`）。
- 每天 rebase 一次 `origin/main`，别攒几十个文件再合。
- **2026-11-09 用户已授权「不需要我参与」**：push / 合并不再逐次请示，
  统一由 `tools/agent-sync.py finish` 按硬护栏自动完成（规范 §11）。
  边界没变：只写自己的 `feat/*` 分支，main 的写入只由 GitHub 端 PR merge 完成，
  发布只走 `publish:preview` 唯一通道。

## 三、共享热点文件：单一写入方

`config/game.json`、`src/core/{types,world,step,index,hits}.ts`、`src/app.ts`、
`src/presentation/three-scene.ts`、`docs/INDEX.md`、`docs/state/CURRENT.md`、
`package.json`、`dist/` —— 这些**由 integrator 独占或排队改**，各 agent 只新建自己的文件。

**版本号是热点的热点**：功能分支**不占** `v9s.NN`（写 `v9s.x` 或留空），
合并时由闸门统一 `version` +1 并宣布号（规范 §0）。两个分支各写 v9s.44 的坑踩过一次。
**分支名带 agent 后缀** `feat/<topic>-<agent>`，两人别共用一个分支
（`push-branch.py` 已加「远端分支被别人推进就拒绝覆盖」的护栏）。
契约（类型 / 事件 / config schema / `World` 字段 / 模块顺序）由 integrator 一次性定完再并行。

`config/plots/*.json` **不是热点**：每个 agent 只新建自己的那一个文件（这正是动态拼合
消除冲突的目的），不要改别人的地块文件，也不要往 `config/game.json` 塞工位。

文件名带归属：`docs/journal/YYYY-MM-DD-NN-<主题>.md`，别用纯编号，避免 add/add 撞车。

## 四、合并冲突怎么解

按 **生成物重生成 / 追加取并集 / 单调取较大 / add-add 改名** 四类处理，
完整分类表与本次实测（含 `dist` 不许手解）见
[`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) §6 + §10。
一句话：**git 说 auto-merge 不等于逻辑正确**，解完必须在合并结果上跑 `tsc` + `verify`。

## 五、提交前必跑

```bash
npm run verify              # build → 全量单测 → Core 可移植边界 → docs:check → smoke
npm run verify:portable     # 改了 src/core/ 时必跑
python3.11 tools/agent-sync.py status     # 开工 / 收尾先看：main 有没有前进、合并队列有没有待办
python3.11 tools/agent-sync.py finish     # 收尾：自动验证 → 推送 → 合并 → 发布（含 publish:preview）
```

改了 `World` 结构 → golden hash 必变，用 `-u` 更新并在 journal 记一笔「契约变更」。
新增机制要在 [`docs/INDEX.md`](docs/INDEX.md) 登记（表里没有的东西没人找得到）。

## 六、去哪找

| 想找 | 位置 |
|---|---|
| 测试场景与扩展规则（正本） | [`docs/systems/test-scene-policy.md`](docs/systems/test-scene-policy.md) |
| 动态地块拼合 / 测试按钮 / 发布（正本） | [`docs/systems/plot-assembly.md`](docs/systems/plot-assembly.md) |
| 分支 / 契约 / 提交网关 / 无人值守执行层（§11） | [`docs/systems/multi-agent-workflow.md`](docs/systems/multi-agent-workflow.md) |
| 待接手的合并队列 | [`docs/state/MERGE_QUEUE.md`](docs/state/MERGE_QUEUE.md) |
| 文档地图（按症状查） | [`docs/INDEX.md`](docs/INDEX.md) |
| 现在做到哪、下一步 | [`docs/state/CURRENT.md`](docs/state/CURRENT.md) |
| 项目是什么、怎么跑 | [`README.md`](README.md) |
