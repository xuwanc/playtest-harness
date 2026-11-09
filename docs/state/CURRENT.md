# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09。

## 一句话

在功能分支 `feat/integration-grass-wind`（基于 `origin/main` `5a320f4`）上完成
**v9s.44 草地观感两改**：割断后的再生从「瞬间弹满」改为 smoothstep + 逐根错峰的
**缓慢连续长回**；GPU 风从逐顶点 shear 改为**枢轴顶点动画**（每节 box 绕底部枢轴刚体旋转、
节间折线、保持完整立方体）。Core 不新增 World 字段、不改配置数值 → golden 快照不变、
既有 938 例零回归。全链验证 + 桌面 / 手机 / 公网实测通过，线上预览已同步。
**GitHub push 仍按约定等用户明确通知**。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.63`（本轮 +1，徽标可辨新旧） |
| 本地分支 | `feat/integration-grass-wind`（父 = `5a320f4`，有共同祖先） |
| 本地 commit | v9s.44 本轮 commit（**未 push**）；上一批 `7e52761` / `733f21c` |
| 远端 `main` | `5a320f4`（未变，本轮零远端写入） |
| 线上静态预览 | `/workspace/grass-preview/`：`index.html` 与 `main.html` **都指向唯一主场景** |
| 发布方式 | `npm run publish:preview` → `tools/publish-preview.mjs`（build → 同步 → 校验 → 打印链接） |
| 唯一测试场景 | `index.html`（单入口）：草块 + 风开关 + 8 工位 + 地块测试按钮 |

## 本轮做了什么（[`../journal/2026-11-09-04-grass-growth-pivot.md`](../journal/2026-11-09-04-grass-growth-pivot.md)）

- `src/core/grass.ts` 新增纯函数 `grassGrowth()` / `windPivotAngles()` /
  `windPivotEffLength()` / `windPivotRotate()` + 常量（GPU shader 的可移植参考实现）；
  **不新增 World 字段、不改既有函数体**；
- `src/presentation/grass-layer.ts` 重写风 shader：替换 `<project_vertex>`、新增
  `aWindRoot` / `aWindGeom`、两级枢轴刚体旋转；生长按 `grow` 连续插值两节高度与颜色，
  `grow` 纳入脏标记；`GrassDebug` 加 `growing` / `avgGrowth` / `sampleHeight` / `wind.mode`；
- 新增 `tests/grass-growth-pivot.test.ts`（10 例）、
  [`../systems/grass-growth-pivot.md`](../systems/grass-growth-pivot.md)（实现正本）；
  修订 `grass.md` / `docs/INDEX.md` / `tools/smoke.py`（31→33 项）；版本 0.9.63；
- **刻意回退**：`regrowSec` 曾调 8 导致 golden 漂移（config 进 snapshot），改回 6，
  观感由缓动曲线提供。

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | **948 通过**，golden `5562e496…` **未变** |
| `npm run verify:portable` | PASS（Core 28 文件边界未破） |
| `npm run docs:check` | PASS（README ≤100、链接可达、单份 ≤300 行） |
| `npm run smoke` / `npm run verify` | 33 项 / 全链通过 |
| 浏览器实测 | 桌面 + 手机 + 公网零错误；`sampleHeight` 0.2474→1.0000（56 个中间值、单调、最大单步 0.0342）、`cut` 归零前 0.9997、暂停定格、`wind.mode='pivot'` |

## 正在做 / 下一步

1. **等用户通知 push**；本轮本地 commit（不 push），线上预览已同步并贴链接（v0.9.63）。
2. 别的 agent 拉下 git 先读 [`../../AGENTS.md`](../../AGENTS.md)：三条铁律（单一主场景 /
   一地块一文件 / 收尾 `publish:preview` 贴链接）。
3. 若想让再生更慢：优先调 Core `grassGrowth()` 曲线 / `GRASS_GROWTH_STAGGER`；
   改 `core.grass.regrowSec` 属配置变更，会让 golden 漂移（需 `-u` + 记契约变更）。
4. 默认布局最多放 5 个 auto 地块，超出会报 `diagnostics.unplaced`（由 integrator 调布局）。
5. 临时 PAT 曾明文出现，建议轮换。

## 已知未关闭的结构性风险

见 [`../risk-review.md`](../risk-review.md)。摘要：`transparent` 编译期属性、
`FX_ORDER` 无强制入口、`spar` 站位带顶墙、连击让单轮伤害事件 ×3、
`groundHeightAt` 只按中心点取高。
