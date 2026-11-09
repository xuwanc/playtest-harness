# 2026-11-09-02 · 合并远端新推送 + 收敛为单一主测试场景 + agent 上手规则

## 触发

用户先问「git 有新的推送，看看拉下来怎么解决冲突，以及应该怎么合理规划两边工作」，
上一轮给出隔离副本的演练结论；本轮用户拍板「按你推荐的」（基于 `origin/main` 新建分支落地），
并定了两条规则，要求「别的 agent 拉下 git 后也能第一时间明白该怎么做」：

1. 去掉自己的那个测试场景，只保留主测试场景；
2. 如测试场景不满足测试需求，跟随功能迭代增加地块和工位。

## 拉取与冲突

- 远端 `main` 到 `5a320f4`（v0.9.61），相对本地基线 `a0b285d` 多 5 个提交：
  `src/` 大文件拆分、陪练连击、对峙走走停停、截图收进 `shots/`、验收文档。
- 本地基线是 `codeload` + `git init` 的**独立快照**，与远端**无共同祖先**；
  直接 `git merge` 会走 unrelated-histories 产生大量假冲突。
  演练用 `git replace --graft` 临时接上祖先，真实落地改为
  **基于 `origin/main` 新建分支 + cherry-pick 本地改动**（历史可 push、有共同祖先）。
- 真实 cherry-pick 产生 **9 个冲突**（`.gitignore` 自动合并成功，比演练少 1 个），
  用隔离副本验证过的解法解决：生成物重生成 / 追加型取并集 / 单调值取远端 /
  journal 的 add/add 由远端占原路径、本地另存带主题文件。
- `determinism` golden 是**第三个值** `5562e496…`（两边都改了 `World` 结构），`-u` 重生成；
  `dist/` 重新 build。远端 9 个新增文件全部保留，`tsc` 0 error。
- 全链 `npm run verify` 通过；首次 smoke 的「踱步 ≥1.2 m/s」偶发 FAIL 用纯远端原版对照
  确认是阈值偏紧，非合并回归。

## 用户两条规则（本批落地）

1. **只保留主测试场景**：删 `grass-demo.html`、`src/grass-demo.ts` 及 `dist/` 演示产物；
   `vite.config.ts` 改回单入口；清理 README / INDEX / grass.md / ADR-008 / CURRENT /
   协作文档里的演示页引用。主场景 `index.html` 已具备草块 + 风开关（`G` 键）+ 工位，
   真人测试能力不减；A/B 对照改用主场景按钮与 `__harness.windDebug()`。
2. **加地块和工位扩展**：`config/game.json` 已有 `scene.grass.plots`（地块）与
   `scene.stations`（工位），规则正本 `docs/systems/test-scene-policy.md` 写明
   「加地块 / 加工位 / 复现验收 / 反例」，随功能迭代同批提交。
3. **让别的 agent 第一时间明白**：新增根目录 `AGENTS.md`（两条铁律 + 标准 git 流程 +
   共享热点文件 + 冲突分类 + 验证命令），README 顶部醒目区块指向它；
   协作文档去掉「`github.com` 不通 / 未提交 / 演示页是 E agent 文件」等过时结论，
   补上 2026-11-09 实测的冲突分类表。

## 验证

- 全链 `npm run verify`：build 单入口 / tsc 0 error / 单测全绿 / boundary / docs / smoke。
- 浏览器实测主场景（桌面 + 手机竖屏）：草块、风开关、工位正常，零页面错误。
- 演练在隔离副本进行，**真实工作区在合并前做了完整备份**（含 `.git`）。

## 状态与待办

- 本地功能分支已 commit；**未 push、未同步线上**（用户约定：需明确通知）。
- 待用户通知后：push 分支 / 同步线上；线上预览收敛为主场景单页。
- 轮换曾明文出现的临时 PAT。
