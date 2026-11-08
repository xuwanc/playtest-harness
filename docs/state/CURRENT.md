# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-08 23:50。

## 一句话

v0.9.60 已发布：持械陪练**一次冷却好 = 打一整轮**（段数取武器的 `comboCount`，3 段，
段间嵌 0.16s 收势停顿），起手频率不变 —— 攻击欲望仍低，但一轮之内有连击的压迫感。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.60` |
| 线上徽标 | `v0.9.60`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `node /root/.codebuddy/skills/sites/scripts/publish.js --dir dist --language static`（覆盖更新，不换链接） |
| 线上链接 | 通过项目内部渠道获取（仓库不存凭据） |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 89 文件 / 887 例全绿 |
| `npm run verify:portable` | PASS（Core 25 文件边界未破） |
| `npm run smoke` | 17/17 PASS |
| `npm run docs:check` | PASS（README 63 行 / 47 份 / 链接全可达） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.39 连击已完成并发布（`docs/journal/2026-11-08-09.md`）。
- 连击的**行为等价性**有硬证据：600 步 dump 与 v0.9.59 逐字节对比，唯一差异是
  `DummyState` 新增的三个字段（普通假人 / 玩家 / 全局状态零漂移）。
- 普通假人**没有**连击：`comboTotalFor()` 对 `weapon === null` 恒返回 1，
  它们仍走 `dummy-rig` 的单次挥砍。

## 下一步（按投入产出排序）

1. **`spar` 站位带感知空间**（约 1 小时）。大剑 standoff 3.4m，而「地形 / 门洞」工位宽 2.4m，陪练会顶墙。做法：起手前查背后 0.8m 是否有墙，有就收缩 standoff。
2. **陪练按武器给不同攻击间隔**（约半天）。现在三个都是 3.4s，混战读起来节奏一样。目标：双刀 2.4s / 剑盾 3.2s / 大剑 4.2s。**注意**：现在一轮 3 刀，改间隔前先按 `attackInterval + 一轮时长` 算总占空比，别让占空比悄悄逼近 100%。
3. **`renderOrder` 收成编译期约束**（约半天）。现在 `FX_ORDER` 只是约定，裸数字仍可绕过；可以加 ESLint 规则或 `setFxOrder()` 唯一入口。
4. **调试面板「只看某一层」下拉**（约 2 小时）。肉眼确认谁压谁，比读 `fxDebug()` 快。
5. 陪练卡肉（打中时给**玩家**短卡肉，别给 AI —— 三个互相拖慢会变成慢动作）。

## 已知未关闭的结构性风险

见 [`../risk-review.md`](../risk-review.md) 的「当前活跃风险」。摘要：

- `transparent` 是编译期属性，改它不 `needsUpdate` 会静默无效；
- `FX_ORDER` 无强制入口，裸数字可绕过；
- `spar` 站位带在窄地形顶墙；
- 连击让单轮伤害事件 ×3，混战占空比需要按「轮」而不是「刀」评估；
- `groundHeightAt` 只按中心点取高，环跨台阶边缘会一半埋进去。
