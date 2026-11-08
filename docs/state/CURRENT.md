# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 03:40。

## 一句话

v0.9.61 已发布：陪练在对峙距离上改成**走走停停**（时间门控踱步 + 连续径向纠偏），
不再原地碎步绕圈；截图统一收进 `shots/` 且整个目录不入库。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.61` |
| 线上徽标 | `v0.9.61`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `node /root/.codebuddy/skills/sites/scripts/publish.js --dir dist --language static`（覆盖更新，不换链接） |
| 线上链接 | 通过项目内部渠道获取（仓库不存凭据） |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 90 文件 / 893 例全绿 |
| `npm run verify:portable` | PASS（Core 25 文件边界未破） |
| `npm run smoke` | 19/19 PASS |
| `npm run docs:check` | PASS |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.40 已完成（`docs/journal/2026-11-09-01.md`）。
- **截图策略变了**：所有截图进 `shots/<批次>/`，整个 `shots/` 在 `.gitignore` 里；
  41 张历史 `preview-*.png` 已 `git rm --cached`。要看图请在本机跑 `tools/*-shot.py`。
- 陪练骨架多了 `__harness.dummyRigDebug(id)`（腿角 / stopT / gaitSpeed），
  与玩家的 `gaitDebug()` 同构。

## 下一步（按投入产出排序）

1. **`spar` 站位带感知空间**（约 1 小时）。大剑 standoff 3.4m，而「地形 / 门洞」工位宽 2.4m，
   陪练会顶墙（顶墙时径向持续朝外、被边界清掉 → 仍有空踩风险）。做法：起手前查背后 0.8m
   是否有墙，有就收缩 standoff。
2. **陪练按武器给不同攻击间隔**（约半天）。现在三个都是 3.4s，混战读起来节奏一样。
   目标：双刀 2.4s / 剑盾 3.2s / 大剑 4.2s。**注意**：一轮 3 刀，改间隔前先按
   `attackInterval + 一轮时长` 算总占空比。
3. **`renderOrder` 收成编译期约束**（约半天）。`FX_ORDER` 目前只是约定。
4. 陪练卡肉（只给**玩家受击**短卡肉，别给 AI —— 三个互相拖慢会变成慢动作）。
5. `groundHeightAt` 只按中心点取高，环跨台阶边缘会一半埋进去（低优先）。

## 已知未关闭的结构性风险

见 [`../risk-review.md`](../risk-review.md) 的「当前活跃风险」。摘要：

- `transparent` 是编译期属性，改它不 `needsUpdate` 会静默无效；
- `FX_ORDER` 无强制入口，裸数字可绕过；
- `spar` 站位带在窄地形顶墙（v9s.40 的连续径向缓解了「抽搐」，但空踩风险还在）；
- 连击让单轮伤害事件 ×3，混战占空比要按「轮」而不是「刀」评估；
- `groundHeightAt` 只按中心点取高。
