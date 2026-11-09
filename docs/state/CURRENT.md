# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 17:05。

## 一句话

v0.9.67：**草地 + 动态地块拼合分支已并入主线**（v9s.46）。草地缓慢生长、枢轴顶点风、
一地块一文件拼合、地块测试按钮全部进主干的同时，下盘转向那套（v9s.41~45）没有回退 ——
合并后 99 文件 / 977 例、smoke 41/41 全绿。同时把多 agent 协作规范升到 v2：
**版本号统一领、发布收敛成一条链接、合并闸门写死在「合并结果」上跑**。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.67`（内部代号 v9s.46） |
| 线上徽标 | `v0.9.67`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `npm run publish:preview`（唯一通道） |
| 线上链接 | <https://aef42c265bdddcf97.app.workbuddy.host/?sharecode=2FOZ6AI6QC> |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 99 文件 / 977 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 41/41 PASS |
| `npm run docs:check` | PASS |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。分支 `feat/integration-grass-wind` 已合入并推送，`origin/main` = 本地 `HEAD`，
  标签 `v0.9.67` 已推。远端功能分支暂留（供对照），确认后删除。
- 本地备份分支 `backup/pre-merge-1643`（合并前的 v9s.45）先留着，一周后可删。

## 下一步

1. **收敛历史**：确认无回滚需求后删 `origin/feat/integration-grass-wind`
   与本地 `backup/pre-merge-1643`。
2. **`dist/` 的策略**：当前有意入库供 Pages 部署，代价是每次 build 产生大 diff、
   合并必冲突。规范已写「不手解、只 rebuild」；若不再用 Pages，优先 `.gitignore` 掉。
3. **`config/game.json` 拆分**：2000+ 行、所有 agent 的唯一热点。可参考地块的做法，
   按模块拆 `config/gait.json` / `config/grass.json`，由 loader 合并 —— 从根上消除冲突。
4. 手感待调项：`view.gait.hipYawTrackRateDeg`（240）/ `hipYawBackRateDeg`（150）/ `dirFlipSec`（0.16）。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮新增两条：
- **双发布通道已收敛**，但历史链接（`aac01946…`）可能还有人收藏 —— 打开会是 0.9.63 的旧版本。
- **`push-branch.py` 之前没有 main 保护**，只靠注释约定；已加硬护栏（`main` / `master` / `backup/*` 拒绝写入）。
