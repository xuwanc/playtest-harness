# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-10 02:20。

## 一句话

v0.9.76：**动画三件事一次做完** —— ① 待机换成**斜跨站姿**（前脚 = 最后踩出去的那只，
停步直接接斜跨、不再把脚收回来）；② 每段攻击的**起手 / 收招**按阶段取采样点、淡入淡出与
`windup`/`recovery` 等长，剑身三通道与整体带转也进了交叉淡出（交还那一帧 68.3° → 3.0°）；
③ 剑盾不再复用大剑剪辑，改单手剑自己的打法，扫角 **131° → 200.5°**。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.76`（内部代号 v9s.55） |
| 线上徽标 | `v0.9.76`（构建时间随发布变化） |
| 发布方式 | `npm run ship`（构建 → 推 main → 重建 `preview` 产物；带凭证自恢复与推送重试） |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— **已开启且 200**（Pages: branch `preview` / `(root)`），此链接固定不变 |
| 蜘蛛开局 | <https://xuwanc.github.io/playtest-harness/?hero=spider> |
| 老人开局 | <https://xuwanc.github.io/playtest-harness/?hero=elder> |
| 沙盒隧道 | 仅本地临时调试用，按 runtimeId 定址、每次重建都变，**不作为对外链接** |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 107 文件 / 1065 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS |
| `npm run docs:check` | PASS（87 份文档 ≤300 行，README 98 行） |
| `npm run clip:lab:check` | 9 段全 PASS（剑盾 200.5° / 182.6°） |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |

## 正在做

- 无。v9s.55（v0.9.76）待合入 main。

## 站姿与进出场的关键数（改之前先读）

| 参数 | 值 | 为什么 |
|---|---|---|
| `view.gait.idleStance.hipYaw` | 0.16 rad | **「斜跨」的读感来源**：只转下半身、胸口仍朝目标；调到 0 就退回「两脚前后站」 |
| `frontPitch` / `backPitch` | 0.16 / 0.14 rad | 前后脚开度；再大就成弓步 |
| `shift` / `sink` | 0.03 m / 0.012 m | 重心侧移与下沉，**必须在 `captureIKBase` 之后叠** |
| `enterSpeed` / `exitSpeed` | 0.18 / 0.55 m/s | 速度门控；中间线性过渡，`smoothing 7` 一阶平滑 |
| 起手 fading | `max(0.1, windup × 0.75)` | 蓄势帧要留 1/4 windup 定格 |
| 收招 fading | `max(0.16, (recovery + settle/2) × 0.85)` | 剑盾 0.298s、大剑 0.374s |
| `swingDebug().poseW` | 0..1 | `poseW < 1` 的帧量出来的刃身角度是混合值，测稳态要先筛帧 |
| 剑盾 `weaponScale` | 1.0 | 0.78 是把双手武器角度硬缩，会「没舒展开」 |

细节：[`../systems/idle-stance.md`](../systems/idle-stance.md)、
[`../systems/pose-entry.md`](../systems/pose-entry.md)。

## 下一步

1. **转身期间站姿权重为 0**：转完再升回来，中间有 0.15s「并腿」过渡；要消掉得让站姿
   跟着转身进度插值。
2. **剑盾段间仍是连续承接**：换段跳变靠 `segBlend`（0.08s）掩，要压到 70° 以内需改共享锚点。
3. **三段节奏同质**：三种武器九段配比完全一致（`animation.md` §3.1），应做成逐段递减。
4. **陪练没接进出场验收**：`probe-entry.py` 只读主角，`fighter-rig` 复用同一骨架但没测。
5. **`config/game.json` 拆分**：`core.gait` / `core.combat` / `view.*` 仍未拆。
6. 可破坏物件后续：二次断裂、瓶罐收腰轮廓、旗面挂上半截、碎片 / 音效。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮变化：

- **斜跨会污染静态对照用例**：受击 / 落地 / 攻击下盘等 11 个用例必须用 `GAIT_NO_IDLE`
  关掉站姿，否则「关闭后精确归零」的断言全部失效（已处理，但新增同类用例要记得）。
- **剑身通道漏乘 `poseW` 就会闪**：以后新增任何「剑身类」通道（仰角 / 外撇 / 滚转 / 带转）
  都必须乘 `combatPoseW`，否则交还那一帧硬切。
- **`poseIn/poseOut` 的 0 有语义**：显式配 0 = 关掉过渡（A/B 对照），读原值必须
  `Number.isFinite`，用 `??` / `||` 会被默认值吃掉。
- **低帧率下淡入变短**：`fadeDur` 按秒算、`combatPoseW` 按帧推进，20 fps 时 0.1s 只有 2 帧，
  起手会比 60 fps 更「脆」。这是固定步长的固有权衡，未做补偿。

上一轮（造型 / 蜘蛛）遗留，仍有效：

- **脚滑**：步幅 0.66 后冲刺（4.5 m/s）脚滑 12%，低速 0。
- **蜘蛛无武器**：`bladesWorld()` 返回 null，打不到可破坏物。
- **`hub` 钉在原点 → 地图只会往东北长**，西南侧永远是边界。
- **地块 id 改名 = 重排**：排在后面的地块会顺延，旧截图与旧坐标假设全部失效。
