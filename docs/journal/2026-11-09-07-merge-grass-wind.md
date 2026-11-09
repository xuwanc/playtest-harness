# 2026-11-09-07 · 合并草地/地块分支，协作规范升 v2

## 触发

> 「有另外一个 agent 在做其他周边表现逻辑，顺带整理了一份多 agent git 规范，已推送到分支，
> 你看看是否有补充和建议，什么时候合主干合适。」→ 评审后用户回：「按你的推荐来处理」。

## 1. 评审结论（合并前）

分支 `feat/integration-grass-wind` @ `fee5b8d`，基于 `main 5a320f4`，6 个提交 61 文件。
规范 `docs/systems/multi-agent-workflow.md`（173 行）骨架很实：冲突分类表、契约先行、
`config/plots/<id>.json` 一地块一文件都值得留。缺的是「谁定版本号」和「合并在哪棵树上验」。

合并预演（独立 worktree + `git merge --no-ff`）结论：**源码零冲突**，
7 处冲突全在元数据层 —— README / INDEX / CURRENT / package.json / dist / journal add-add。

## 2. 真合并：怎么解那 7 处

| 文件 | 类型 | 解法 |
|---|---|---|
| `package.json` | 内容（只有 version 一行） | 取较大 `0.9.66`，之后单独提交 bump 到 0.9.67 |
| `README.md` | 内容 | 目录块取并集；`tests/` 计数按合并后重算（99 文件 / 977 例 / smoke 41 项） |
| `docs/INDEX.md` | 内容 ×4 | 行取并集；`manual-acceptance` 取 108 步；journal 计数改成 32 份 |
| `docs/state/CURRENT.md` | 内容 ×4 | 合并提交先取主线版，下一个提交整体覆盖写（这文件本来就是覆盖写） |
| `docs/journal/2026-11-09-02.md` | add/add | 主线那份留原路径（v9s.41），分支那份改名 `-02-merge-remote.md` |
| `dist/*` | rename/delete + 内容 | **不手解**：`rm -rf dist && npm run build` 重生成 |

## 3. 验证（在合并结果上，不是分支上）

| 命令 | 结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 99 文件 / 977 例全绿（含 v9s.41~45 与草地/拼合） |
| `npm run smoke` | 41/41（分支 14 条 + 主线下盘 2 条都在跑） |
| `npm run docs:check` | PASS |
| `npm run build` | 通过，产物入口从 `index-*.js` 变 `main-*.js` |

## 4. 规范升 v2（同一轮提交）

- **新增 §0 版本号**：功能分支不占 `v9s.NN`，合并时 integrator `version` +1 并宣布号。
  原因写得很直白：两个 agent 同时用 v9s.43/44，合并后同号指两件事。
- **新增 §10 合并闸门**：6 步，第 3 步「`dist` 不手解」、第 4 步「在**合并结果**上 verify」、
  第 5 步「数字抄进 journal」、第 6 步「tag + 删分支 + 一条链接」。
- **§9 重写为单通道**：`publish-preview.mjs` 改成只调发布服务（`sites/publish.js`），
  打印唯一链接，`verified` 为假就非零退出。删掉「同步到 `/workspace/grass-preview`」那套。
- **§1 修自相矛盾**：原文一边说「push 没凭证」一边说「能 push 就优先 push」，
  改成「先 `git push --dry-run` 探一下，能写用 git、不能写走网关」。
- **`AGENTS.md` 去重**：删掉与规范 §6 重复的冲突表，改成四类一句话 + 链接（防漂移）。
- **代码护栏**：`tools/push-branch.py` 加
  `main`/`master`/`backup/*` 拒绝写入 + 源码未提交直接报错。

## 5. 踩到的坑

1. **`git fetch` 静默不拉分支**：`git fetch origin` 返回 0 却什么都没变，加 `GIT_TRACE=1` 才看到
   其实拉下来了 —— 是 `git maintenance run --auto` 之后的输出被吞；换显式 refspec 才确认。
2. **verify 会改 `dist/`**：build 带新的 buildTime，跑完 verify 再 commit 会把旧产物提交进去，
   工作区留着新产物 → `checkout` 被拒（要先 `git checkout -- dist/index.html`）。顺序应是
   **先 verify、再 `git add -A`、再 commit**。
3. **合并提交后又 build 一次**：产物 hash 又变了（`main-B3m0S9gt.js`），白留一个未跟踪文件。
4. **`package.json` 冲突只有 version 一行**，但 `esbuild` 会直接报 `Expected string in JSON but found "<<"`
   —— 提示信息完全不提 package.json，得自己找。

## 6. 下一步

- 7 个提交待 push（本沙箱无写凭证，需 PAT）。
- `config/game.json` 仍是唯一热点（2000+ 行），建议按模块拆 JSON 由 loader 合并。
- `dist/` 继续入库的前提是「只 rebuild、不手解」，规范 §10 已写死。
