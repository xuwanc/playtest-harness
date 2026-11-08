# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-08 19:40。

## 一句话

v0.9.59 已发布：功能同上（特效层级 / 面板重排 / 3 个持械陪练 / 击退默认开）；本版把文档按「地图 / 系统 / 状态 / 决策 / 归档」重新分层，README 从 4220 行收到 62 行。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.59` |
| 线上徽标 | `v0.9.59`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `node /root/.codebuddy/skills/sites/scripts/publish.js --dir dist --language static`（覆盖更新，不换链接） |
| 线上链接 | 通过项目内部渠道获取（仓库不存凭据） |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 88 文件 / 876 例全绿 |
| `npm run verify:portable` | PASS（Core 25 文件边界未破） |
| `npm run smoke` | 16/16 PASS |
| `npm run docs:check` | PASS（README 63 行 / 45 份 / 链接全可达） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。文档重构已完成：`docs:check` 已接入 `npm run verify`（README 行数 / INDEX 链接 / 单文件 300 行 / 旧路径引用）。
- 本轮无代码行为改动（只改了 4 处注释里的文档路径），`dist` 逻辑不变。

## 下一步（按投入产出排序）

1. **`spar` 站位带感知空间**（约 1 小时）。大剑 standoff 3.4m，而「地形 / 门洞」工位宽 2.4m，陪练会顶墙。做法：起手前查背后 0.8m 是否有墙，有就收缩 standoff。
2. **陪练按武器给不同攻击间隔**（约半天）。现在三个都是 3.4s，混战读起来节奏一样。目标：双刀 2.4s / 剑盾 3.2s / 大剑 4.2s。
3. **`renderOrder` 收成编译期约束**（约半天）。现在 `FX_ORDER` 只是约定，裸数字仍可绕过；可以加 ESLint 规则或 `setFxOrder()` 唯一入口。
4. **调试面板「只看某一层」下拉**（约 2 小时）。肉眼确认谁压谁，比读 `fxDebug()` 快。
5. 陪练卡肉 / 连击（需给 `DummyState` 加连段字段，属于一批独立改动）。

## 已知未关闭的结构性风险

见 [`../risk-review.md`](../risk-review.md) 的「当前活跃风险」。摘要：

- `transparent` 是编译期属性，改它不 `needsUpdate` 会静默无效；
- `FX_ORDER` 无强制入口，裸数字可绕过；
- `spar` 站位带在窄地形顶墙；
- 陪练缺卡肉 / 连击，混战压迫感会被低估；
- `groundHeightAt` 只按中心点取高，环跨台阶边缘会一半埋进去。
