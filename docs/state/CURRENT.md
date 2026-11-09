# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 19:40。

## 一句话

v0.9.70：测试场**底板按地块拆开** —— 每块地自带 `span × 5 m` 的承重地板，进场景按整数格
first-fit 拼成连续地面；台阶 / 门洞 / 障碍 / 初始假人 / 草块一并写进地块文件，
`worldBounds` 与寻路格网从拼合包围盒推导。第 10 块测试地只加一个 JSON，不改共享文件。
同一批还合入了 **GitHub Pages 作为唯一权威发布通道**（沙盒无关，多 agent 只产生一条链接）。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.70`（内部代号 v9s.49） |
| 线上徽标 | `v0.9.70`（构建时间随发布变化） |
| 发布方式 | `npm run publish:pages`（目标唯一通道）；**Pages 尚未在仓库开启，暂用 `publish:preview` 隧道兜底** |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— **当前 404**，需在仓库 `Settings → Pages` → Build from a branch → 选 `preview` / `/(root)` 开启（PAT 无 `Pages: write`，脚本开不了） |
| 当前可打开（隧道兜底） | <https://aef42c265bdddcf97.app.workbuddy.host/?sharecode=2FOZ6AI6QC> — 徽标 `v0.9.70` 已核验 |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 100 文件 / 1007 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS（含「地板铺满包围盒、0.5m 采样 4661 点 0 洞」） |
| `npm run docs:check` | PASS（73 份文档 ≤300 行） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.49（v0.9.70）已合入 main。

## 下一步

1. **`config/game.json` 拆分**：地块坐标已迁出，剩下最该拆的是 `core.gait` / `core.combat` / `view.*`。
2. 手感待调项：`view.gait.hipYawTrackRateDeg`（240）/ `hipYawBackRateDeg`（150）/ `dirFlipSec`（0.16）。
3. 地块布局：`hub` 钉在原点、地图向东北长。要让 hub 居中需给 `PlotDef` 加 `at:{c,r}`，
   或改环形扫描 —— 会引入新规则，等实际需求。
4. 可破坏物件后续：二次断裂、瓶罐收腰轮廓、旗面挂上半截、碎片 / 音效。
5. 草：主草场已并入 `sparring-demo` 地块（`config/plots/sparring-demo.json` 的 `grass`）。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮新增：
- **`hub` 钉在原点 → 地图只会往东北长**，西南侧永远是边界（「加地不挪旧板」的代价）。
- **地块 id 改名 = 重排**：排在后面的地块会顺延，旧截图与旧坐标假设全部失效。
- **填充板不是地块**：`plotId === ''`，不画板框、不进工位面板，但它在碰撞盒里。
- **GitHub Pages 需一次性手工开启**（仓库 Settings → Pages）；没开时 `publish:pages` 会报警。
