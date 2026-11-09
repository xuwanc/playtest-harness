# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 21:20。

## 一句话

v0.9.71：**主角可以切换成蜘蛛** —— 8 腿解析步态骨架作为第三副骨架接入，走已有的
`bodyTypes` 通道（`rig: 'spider'`），位置 / 朝向仍由 `playerRoot` 承担，
**Core 的移动 / 碰撞 / 战斗一行没改**。`?hero=spider` 直接开局，`B` 键或顶部胶囊循环切换。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.71`（内部代号 v9s.50） |
| 线上徽标 | `v0.9.71`（构建时间随发布变化） |
| 发布方式 | `npm run publish:preview`（隧道兜底）；Pages 仍未在仓库开启，见下 |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— **仍 404**，需在仓库 `Settings → Pages` → Build from a branch → 选 `preview` / `/(root)`（PAT 无 `Pages: write`） |
| 蜘蛛开局链接 | 隧道地址 + `?hero=spider`（本批发布后贴在交付消息里） |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 101 文件 / 1013 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS |
| `npm run docs:check` | PASS（76 份文档 ≤300 行） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.50（v0.9.71）已合入 main。

## 蜘蛛主角的几个关键数（改之前先读）

| 参数 | 值 | 为什么 |
|---|---|---|
| `view.bodyTypes.spider.moveSpeed` | 2.6 | 4.2 m/s 对 0.5 m 高的蜘蛛是 8.4 身高/秒，腿摆不过来 |
| `spider-rig` 的 `CAP_HZ` | 7.5 | 步频上限；超出转成脚滑（冲刺时约 20%） |
| 步幅上限 | 0.45 m | 由第 4 对腿的水平余量 0.355 m 反算 |
| `bodyZoom` | 0.24 | 17 m → 4.1 m，否则蜘蛛在画面里不到 40 px |
| 相机俯角 | 50° → 32° | 1.2 m 人形的角度对 0.46 m 的爬行体是顶视 |

细节与三个坑见 [`../systems/spider-locomotion.md`](../systems/spider-locomotion.md)。

## 下一步

1. **蜘蛛手感待用户实测**：移速 2.6 / 抬脚 0.13 / duty 0.55 都是先验值，等真机反馈再调。
2. 若「俯视看不清腿」被判定为难接受：把蜘蛛做小（0.8×）当地面杂兵，比继续降相机角度更匹配现有视角。
3. **`config/game.json` 拆分**：`core.gait` / `core.combat` / `view.*` 仍未拆。
4. 地块布局：`hub` 钉在原点、地图向东北长（`-Z` 方向 5 m 就到边界）。
5. 可破坏物件后续：二次断裂、瓶罐收腰轮廓、旗面挂上半截、碎片 / 音效。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮新增：

- **脚滑**：冲刺（4.5 m/s）时约 20% 的支撑脚跟着身体滑，而不是严格锁世界坐标。
  这是步频封顶的代价，换来「不抽腿 / 不拉直」；低速时滑步为 0。
- **相机**：32° 俯角下膝拱剪影读不出来，只有腿的水平分布可辨（已靠配色提亮补偿）。
- **无武器**：蜘蛛攻击判定照常（Core 不依赖刀刃），但没有刀光、`bladesWorld()` 返回 null，
  打不到可破坏物。

上一轮（地块化）遗留，仍有效：

- **`hub` 钉在原点 → 地图只会往东北长**，西南侧永远是边界（「加地不挪旧板」的代价）。
- **地块 id 改名 = 重排**：排在后面的地块会顺延，旧截图与旧坐标假设全部失效。
- **填充板不是地块**：`plotId === ''`，不画板框、不进工位面板，但它在碰撞盒里。
- **GitHub Pages 需一次性手工开启**（仓库 Settings → Pages）；没开时 `publish:pages` 会报警。
