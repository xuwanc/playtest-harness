# 一条固定链接：把「发布」从手工搬运变成一条命令

2026-11-09 · v0.9.72 收尾

## 用户的原话

> 另一个 agent 的修改似乎已经推到分支，但多个链接我操作比较麻烦，有没什么办法？

不是记性问题，是**定址方式**的问题。

## 根因

线上地址有两个来源，语义完全不同：

| 来源 | 地址形态 | 什么时候变 |
|---|---|---|
| 沙盒隧道（`publish:preview`） | `a<md5(runtimeId)>.app.workbuddy.host` | 沙盒重建、休眠、换 agent —— 全变 |
| GitHub Pages（`ship`） | `https://xuwanc.github.io/playtest-harness/` | 永不变（按仓库身份定址） |

以前对外发的是第一种。于是每轮对话都要重新「收集链接」，用户手里攒了一串互不相干的地址。

## 解法

1. **Pages 已开启**（`Settings → Pages` → `preview` / `/(root)`），线上首页实测 200；
2. `preview` 分支收敛为**纯构建产物**（`.nojekyll` + `index.html` + `assets/*`），不再混放源码；
   以前分支里同时存在 `index.html` 和 `dist/index.html` 两套入口，指向不同哈希，是第二个混乱源；
3. 新增 `npm run ship`（`tools/ship.sh`），一条命令完成以前四步手工活：

   ```bash
   npm run ship
   # build → 提交 dist → 推 main → 基于 origin/preview 整棵重建产物 → 推 preview
   # 结束时打印：https://xuwanc.github.io/playtest-harness/
   ```

   顺带接管三件老毛病：沙盒重建后凭证丢失（从 `~/.config/workbuddy/github.token` 恢复）、
   `git push` 到 github.com 偶发连接超时（6 次重试，实测 2 分钟内必通一次）、
   Vite 哈希改名导致 `assets/` 里旧文件堆积（整棵重建，不增量）。

## 约定变更

- 对外回复只贴 Pages 那条链接；隧道链接只用于自己在本沙盒里看；
- 发布仍只由合并闸门触发（feature agent 不发布），但入口从 `publish:pages` 换成 `ship`；
- `publish:pages` 保留（走 MCP 网关，无 token 时可用），`ship` 是首选。

## 踩到的两个坑

1. **preview 分支被另一个 agent 并行更新**：本地 `origin/preview` 引用过期到 `7ac74cf`（实际已是
   `9c3878a`），`--force-with-lease=preview:7ac74cf` 连续 8 次被判 `stale info`。教训：lease 值要
   现取，别用几小时前的 ref；`ship.sh` 里改成基于 `origin/preview` 建 worktree，天然拿到最新。
2. **Pages 构建队列会卡**：`5c11736` 的构建 `status: building` 挂 15 分钟不动，`POST /pages/builds`
   手动触发后立刻 `queued`。PAT 需要 `Pages: write` 才能这么做（fine-grained 要显式勾）。
