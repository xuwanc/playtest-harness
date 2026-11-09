# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 17:57。

## 一句话

v0.9.68：可破坏物件（按命中位置斜切、切口朝攻击方向）补齐了「完好态看不见」的
渲染定位 bug，并基于最新主干重放；同时把多 agent 协作补成**无人值守闭环** ——
`tools/agent-sync.py finish` 一次跑完同步 / 领号 / 验证 / 推送 / PR 自动合并 / 发布，
用户不再逐次参与。合并结果 100 文件 / 997 例、smoke 49/49 全绿。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.68`（内部代号 v9s.47；合并闸门领号后自动 +1） |
| 线上徽标 | `v0.9.68`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `npm run publish:preview`（唯一通道） |
| 线上链接 | <https://aef42c265bdddcf97.app.workbuddy.host/?sharecode=2FOZ6AI6QC> |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 100 文件 / 997 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 49/49 PASS（含「完好态画在地块坐标」+ 真机挥刀端到端） |
| `npm run docs:check` | PASS |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无阻塞项。功能分支 `feat/destructibles-cut` 基于 `origin/main b1f3370`，
  收尾走 `tools/agent-sync.py finish`（自动推送 + 自动并入 main + 同步线上）。
- 旧功能分支与本地备份仅作对照；合并队列见 [`MERGE_QUEUE.md`](MERGE_QUEUE.md)，
  空表即没有待接手的合并。

## 下一步

1. **`dist/` 的策略**：当前有意入库供 Pages 部署，代价是每次 build 产生大 diff、
   合并必冲突。规范已写「不手解、只 rebuild」；若不再用 Pages，优先 `.gitignore` 掉。
2. **`config/game.json` 拆分**：2000+ 行、所有 agent 的唯一热点。可参考地块的做法，
   按模块拆 `config/gait.json` / `config/grass.json`，由 loader 合并 —— 从根上消除冲突。
3. 手感待调项：`view.gait.hipYawTrackRateDeg`（240）/ `hipYawBackRateDeg`（150）/ `dirFlipSec`（0.16）。
4. 可破坏物件后续：二次断裂、瓶罐收腰轮廓、旗面挂上半截、碎片 / 音效。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮新增两条：
- **双发布通道已收敛**，但历史链接可能还有人收藏 —— 打开会是旧版本。
- **合并闸门依赖 GitHub MCP 网关的 PR 权限**；若 `merge_pull_request` 被拒，
  脚本会把分支 / PR 号写进合并队列，由下一个 agent 接手，不会静默丢改动。
