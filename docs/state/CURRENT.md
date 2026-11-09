# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-09 13:20。

## 一句话

v0.9.64 已发布：**换了摆腿方向的「融合」** —— 前进切后退不再一帧把腿位镜像过去
（实测单帧腿角跳 1.06~1.26 rad → 0.55，与正常跨步 0.53 持平）。做法是让方向符号在
`dirFlipSec = 0.16s` 内走过 0，摆幅随之收放；左右轴同构，玩家与假人共用。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.64` |
| 线上徽标 | `v0.9.64`（构建时间随发布变化） |
| 发布方式 | `npm run build` → `node /root/.codebuddy/skills/sites/scripts/publish.js --dir dist --language static`（覆盖更新，不换链接） |
| 线上链接 | 通过项目内部渠道获取（仓库不存凭据） |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 93 文件 / 911 例全绿 |
| `npm run verify:portable` | PASS（Core 25 文件边界未破） |
| `npm run smoke` | 25/25 PASS |
| `npm run docs:check` | PASS |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.43 已完成（`docs/journal/2026-11-09-04.md`）。
- 规则写在 [`../systems/animation.md`](../systems/animation.md) §1.6 与
  [`../systems/animation-notes-3.md`](../systems/animation-notes-3.md) §18：
  **摆幅按步幅定、与速度无关**，所以不能按速度淡出；只有「符号真的翻转」才需要淡；
  状态用**最终 drive**（含攻击等效驱动）推进，不用 realDrive。
- 读数接口：`__harness.gaitDebug()` 新增 `dirF` / `dirR`（−1..1，稳态恒为 ±1）；
  调试面板「程序化步态」新增「换向融合时长 (s)」滑杆，拉 0 = 旧行为 A/B。

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
6. 面板相位图例可以再明确一点（现在只有左边缘 L / R 小字，没有「L = 左脚踩地」的说明）。

## 已知未关闭的结构性风险

见 [`../risk-review.md`](../risk-review.md) 的「当前活跃风险」。摘要：

- `transparent` 是编译期属性，改它不 `needsUpdate` 会静默无效；
- `FX_ORDER` 无强制入口，裸数字可绕过；
- `spar` 站位带在窄地形顶墙（v9s.40 的连续径向缓解了「抽搐」，但空踩风险还在）；
- 连击让单轮伤害事件 ×3，混战占空比要按「轮」而不是「刀」评估；
- 收势淡出会把相位「扫回」真实步态（最多 π；静止收招看不出来，边走边收招 0.28 rad/帧）；
- 面板的「踩地」是**相位判据**不是脚的真实高度（极端姿态下可能不一致）；
- 换向融合有 0.16s 的「收腿窗」（已知取舍，`dirFlipSec` 可调，拉 0 回到硬符号）；
- `groundHeightAt` 只按中心点取高。
