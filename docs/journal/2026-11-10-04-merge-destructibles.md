# 2026-11-10 · 并入可破坏迭代（跨 agent 分支）+ 分支管理自动化

## 一、远端到底有什么

`git fetch` 后有 4 条 `feat/*`、1 条 `fix/*`，逐个算 ahead/behind：

| 分支 | ahead | behind | 结论 |
|---|---|---|---|
| `feat/destructibles-cut` | 0 | 31 | 早已并入，只是没删 |
| `feat/integration-grass-wind` | 0 | 42 | 同上 |
| `fix/sync-hardening-link` | 0 | 29 | 同上 |
| `feat/unified-preview-link` | 2 | 4 | **唯一有未合并内容的** |

那 2 个提交是 `a76833d`（仙人掌单刀只破一段 + 微信 contextlost 防护）和
`3288afb`（把前者合到 v0.9.76 上的 merge commit）。其余分支全是历史残留，
不删只是为了留证。

另有一个 **PR #4 挂着 `CONFLICTING`**，是对方 agent 的合并闸门跑到一半留下的：
分支基于 `v0.9.76`，而 main 已经到 `v0.9.77`（飙血 / 死亡那批），
`dist/index.html` 的 hash 引用对不上。

## 二、怎么合的

不是 `git merge` 一按了事。顺序是：

1. 基于最新 `origin/main` 建 `merge/destructibles-v0976`，`merge --no-ff` 对方分支。
2. **冲突只有 `dist/index.html` 一个**，源码（`types.ts` / `three-scene.ts` / `app.ts`）
   全部自动合并 —— 因为两边改的是不同区域。
3. `dist/*` 一律不手解：取主干版 + `npm run build` 重生成。
4. 在**合并结果**上跑 `tsc` / 全量测试 / smoke / docs。

## 三、自动合并也要验语义（这次真的踩到了）

`tsc` 0 error、1092 例全绿，但 smoke 挂了 3 项：

| 失败项 | 真实原因 |
|---|---|
| 「可破坏物件 5 件」 | 新地块 `zz-cactus-test` 加了 4 件，总数 9 |
| 「完好态画在地块坐标」 | 断言写死 `len(pos) == 5` |
| 「瓶罐吸附断裂带」 | **语义变了**：jar 从「斜切两段 + bands 吸附」改成「碎块爆裂」，`cutU` 恒为 0 |

前两项是数量写死，改成「装配数 == Core 数 == 渲染数」即可；
第三项是产品语义变更，断言换成「碎 6–12 块、站立段归零」。

> 教训：`git` 说 auto-merge 成功，只代表**文本**不冲突。
> 一个分支改了行为而没改另一边的断言，合并后就是绿的编译 + 红的 smoke。

## 四、数据

| 项 | 值 |
|---|---|
| 合并前 main | `e59795c`（v0.9.77） |
| 合并后 | v0.9.78 / v9s.57 |
| 测试 | 108 文件 / 1092 例 |
| smoke | 53/53 |
| 新增地块 | `config/plots/zz-cactus-test.json`（4 件） |

## 五、分支管理自动化（用户要求「不用我参与」）

原则：**功能开发一律 `feat/*`，main 只由闸门写入**。
`tools/agent-sync.py` 已有闭环，但写通道绑在内部 MCP 网关上；
本环境 `gh` 已登录，于是补了一条「本地 git / gh 优先、MCP 兜底」的通道：

```bash
npm run feat:start -- <主题>    # 基于最新 origin/main 建 feat/<主题>-<agent>
npm run feat:finish             # merge main → 领号 → build → verify → push → PR merge → 发布
npm run feat:status             # 当前分支 / 落后多少 / 队列
```

硬护栏不变：只允许在 `feat/*` / `fix/*` 上收尾；源码没提交就停；
远端同名分支有本地没有的提交就拒绝覆盖。
