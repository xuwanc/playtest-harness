# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 19:20。

## 一句话

v0.9.69：测试场**底板按地块拆开** —— 每块地自带 `span × 5 m` 的承重地板，进场景按整数格
first-fit 拼成连续地面；台阶 / 门洞 / 障碍 / 初始假人 / 草块一并写进地块文件，
`worldBounds` 与寻路格网从拼合包围盒推导。第 10 块测试地只加一个 JSON，不改共享文件。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.69`（内部代号 v9s.48） |
| 线上徽标 | `v0.9.69`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `npm run publish:preview`（唯一通道） |
| 线上链接 | <https://aef42c265bdddcf97.app.workbuddy.host/?sharecode=2FOZ6AI6QC>（`publish:preview` 打印的 shareLink，徽标 `v0.9.69` 已验证） |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 100 文件 / 1007 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS（含「地板铺满包围盒、0.5m 采样无洞」） |
| `npm run docs:check` | PASS |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.48 已合入 main 并发布，线上徽标 `v0.9.69` 已核验（`plotDebug()` 读到 9 块地 /
  11 块板 / 2 块填充 / 9 个假人，`diagnostics` 为空）。
- ⚠️ 线上存在**两个域名**：本文这条 `aef42c26…` 是 v0.9.69；另一条
  `aac01946…`（上一轮并行 agent 的站点）停在 v0.9.68。以本文这条为准。

## 下一步

1. **`config/game.json` 拆分**：仍是 2000 行、所有 agent 的唯一热点。地块坐标已经迁出，
   剩下最该拆的是 `core.gait` / `core.combat` / `view.*`。
2. 手感待调项：`view.gait.hipYawTrackRateDeg`（240）/ `hipYawBackRateDeg`（150）/ `dirFlipSec`（0.16）。
3. 地块布局：当前 `hub` 在原点、地图向东北铺开。若要让 hub 居中，需给 `PlotDef` 加
   `at:{c,r}` 指定格（不影响确定性），或改用环形扫描。
4. 可破坏物件后续：二次断裂、瓶罐收腰轮廓、旗面挂上半截、碎片 / 音效。
5. 草：主草场已并入 `sparring-demo` 地块（`config/plots/sparring-demo.json` 的 `grass`），
   想再加草浪就再挂一块地。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮新增：
- **`hub` 钉在原点 → 地图只会往东北长**，西南侧永远是边界；这是「加地不挪旧板」的代价。
- **地块 id 改名 = 重排**：排在后面的地块会顺延，旧截图与旧坐标假设全部失效。
- **填充板不是地块**：`plotId === ''`，不画板框、不进工位面板，但它确实在碰撞盒里。
