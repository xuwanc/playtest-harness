# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 22:25。

## 一句话

v0.9.72：**蜘蛛主角造型定稿** —— 简化到 35 个 mesh（原 128）、步幅 0.45 → 0.66 m、
身体加了二阶弹簧惯性（俯仰 / 侧倾 / 纵向滞后 / 腹部甩动）。
同批交付**造型工坊** `tools/voxel-forge/`：写 JSON → 3D 预览 → 导出 TS 片段。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.72`（内部代号 v9s.51） |
| 线上徽标 | `v0.9.72`（构建时间随发布变化） |
| 发布方式 | `npm run publish:preview`（隧道兜底）；Pages 仍未在仓库开启，见下 |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— **仍 404**，需在仓库 `Settings → Pages` → Build from a branch → 选 `preview` / `/(root)`（PAT 无 `Pages: write`） |
| 蜘蛛开局链接 | <https://aef42c265bdddcf97.app.workbuddy.host/?sharecode=2FOZ6AI6QC&hero=spider> |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 101 文件 / 1013 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS |
| `npm run docs:check` | PASS（79 份文档 ≤300 行，README 97 行） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.51（v0.9.72）已合入 main。

## 蜘蛛主角的几个关键数（改之前先读）

| 参数 | 值 | 为什么 |
|---|---|---|
| `view.bodyTypes.spider.moveSpeed` | 2.6 | 4.2 m/s 对 0.5 m 高的蜘蛛是 8.4 身高/秒，腿摆不过来 |
| `spider-rig` 的 `CAP_HZ` | 6.4 | 步频上限；2.6 m/s 时 4.2 Hz，冲刺才撞上限（脚滑 12%） |
| 步幅上限 | 0.66 m | 由第 4 对腿的水平余量 0.369 m 反算，98% 余量 |
| 腿长 / 落点 | 0.929 m / 0.504 m | **必须一起改**；只加长腿会让腿全弯在身下，俯视看不见 |
| mesh 数 | 35（身体 3 + 腿 8×4） | 同 group 内不相对运动的盒体按顶点色合并 |
| `bodyZoom` / 俯角 | 0.20 / 27° | 17 m → 3.4 m；50° 对 0.46 m 的爬行体是顶视 |

细节与四个坑见 [`../systems/spider-locomotion.md`](../systems/spider-locomotion.md)；
造型怎么快速迭代见 [`../systems/voxel-forge.md`](../systems/voxel-forge.md)。

## 下一步

1. **蜘蛛手感待用户实测**：跨距 1.6 m / 体长 0.89 m 偏「高脚」，若嫌腿长可把 `LEGLEN` 回退 4%。
2. `BodyTypeConfig` 还没有 `strideRatio` / `inertia` 覆盖，换体型只能改代码默认值。
3. 工坊的 `exportTs` 只生成 `partMesh` 调用，不生成节点层级（`hip.position` 那层仍手写）。
4. **`config/game.json` 拆分**：`core.gait` / `core.combat` / `view.*` 仍未拆。
5. 地块布局：`hub` 钉在原点、地图向东北长（`-Z` 方向 5 m 就到边界）。
6. 可破坏物件后续：二次断裂、瓶罐收腰轮廓、旗面挂上半截、碎片 / 音效。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮变化：

- **脚滑缓解**：步幅提到 0.66 后，冲刺（4.5 m/s）脚滑从 24% 降到 12%；低速仍为 0。
- **惯性可能过冲**：急停时身体前栽幅度按 `accLong × 0.016` 限幅到 0.10 rad（5.7°），
  碰撞击退那几帧的加速度已低通，但传送 / 翻滚后仍可能看到 1~2 帧倾斜。
- **无武器**：蜘蛛攻击判定照常（Core 不依赖刀刃），但没有刀光、`bladesWorld()` 返回 null，
  打不到可破坏物。
> **已修**：原来相位按 `velocity × dt` 推进，而 `dt` 被截断到 1/20，低帧率下脚会越落越远
> （线上实测 `reach 1.58 / clamp 4`）。改成按本帧实际位移推进 + 传送保护后，
> 20 fps 下峰值降到 `1.1 / 2`，60 fps 下为 0。
- **真机 clamp**：8~20 fps 的软件渲染下仍有瞬时 1~2 条腿 clamp；60 fps 下为 0，单测已锁。

上一轮（地块化）遗留，仍有效：

- **`hub` 钉在原点 → 地图只会往东北长**，西南侧永远是边界（「加地不挪旧板」的代价）。
- **地块 id 改名 = 重排**：排在后面的地块会顺延，旧截图与旧坐标假设全部失效。
- **填充板不是地块**：`plotId === ''`，不画板框、不进工位面板，但它在碰撞盒里。
- **GitHub Pages 需一次性手工开启**（仓库 Settings → Pages）；没开时 `publish:pages` 会报警。
