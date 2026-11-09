# 动作进出场：起手接待机、收招交还待机

> 最后更新：2026-11-10（v9s.55）。
> 管什么：一段攻击的**起手帧**从哪来、**收招帧**往哪去、淡入淡出多长、哪些通道会被漏掉。
> 代码：`presentation/voxel-rig.ts` 的 `posePhaseU` / `combatPoseW` / `applyCombatPose` /
> `applyBladeTarget`；数据：`config/game.json` → `view.animation.swing`（`poseIn` / `poseOut`）。
> 相关：连击骨架与节奏见 [`animation.md`](animation.md)；站定姿态见 [`idle-stance.md`](idle-stance.md)。

## 一、现象

> 「之前做的动画起始和结束 Pose 都没有很好，和待机都接不上」

表现为三段式：

1. **起手一帧抬手**：手臂从垂手直接跳到蓄势，观感是「啪一下」；
2. **收招停在半挥**：打完不回待机，剑停在「刚挥到一半」的角度，再慢慢糊回垂手；
3. **交还那一帧闪一下**：手臂已经回来了，剑身仰角 / 整体带转还在攻击姿态，
   权重归零那一帧一步跳回待机（剑盾实测单帧 **68.3°**）。

## 二、根因

### 2.1 采样点 `u` 由挥击曲线反推，收势会「倒退」

旧链路是 `swingCurve(progress) ∈ [−1, 1]` 再换算 `u = (swing + 1) / 2`。
收势时 `swing` 从 `+1` 掉到 `0`，于是 `u` 从 **1（挥出满）退回 0.5（挥到中途）**，
再从「半挥」淡出到待机 —— 而且 `settle` 会把这个半挥姿态定格 0.16s。

### 2.2 淡入淡出时长与动作无关

旧版固定「淡入 0.1s / 淡出 0.16s」，与 `windup` / `recovery` 没关系：

| 武器 | windup | 旧淡入 | 后果 |
|---|---|---|---|
| 剑盾 | 0.11s | 0.1s | 整个起手都在混合里，永远走不到蓄势帧 |
| 大剑 | 0.16s | 0.1s | 从垂手到高举 1.5 rad 压进 6 帧 |

### 2.3 交还条件看错了阶段

`applyCombatPose` 的早退条件原本是 `phase === 'idle' && w <= 0.001`。
`settle` 期间权重已经到 0、阶段却还不是 `idle`，于是「权重为 0 却继续写满挥出姿态」——
等 `settle` 结束那一帧整体归零，等于硬切（实测单帧 1.4 rad）。

## 三、修法

### 3.1 姿态按阶段取 `u`，不按曲线

```ts
posePhaseU(combat):
  elapsed = attackProgress × (windup + active + recovery)
  elapsed <= windup            → 0      // 蓄势帧
  active 前 70%                → 0 → 1  // 挥出
  之后（active 尾 / recovery） → 1      // 保持挥出满
```

挥出在 `active` 前 70% 完成，是为了让 `cancelWindow`（默认 progress 0.45）打开时剑已经到位；
否则连打时「才走到 64% 就被切段」（见 `animation.md` §1.2）。

> 用 `attackProgress × total` 反推 elapsed，**不用 `phaseTimer`**：clip-lab 与一部分夹具只写
> `attackProgress`，两套时钟会脱节。`windup + active + recovery = 0` 时回退旧的曲线刻度，
> 否则「progress 0.45 = 已挥出满」这类绝对刻度断言全部失准。

### 3.2 过渡交给 `combatPoseW`，时长跟阶段走

```ts
fadeTarget = (combatActive && phase !== 'recovery' && phase !== 'settle') ? 1 : 0
起手 fadeDur = clamp(max(poseIn,  windup × 0.75), 0.05, 0.30)
收招 fadeDur = clamp(max(poseOut, (recovery + settle × 0.5) × 0.85), 0.08, 0.42)
```

| 武器 | 起手 fading | 收招 fading | 说明 |
|---|---|---|---|
| 剑盾 | 0.100s | 0.298s | 前摇短，吃 `poseIn` 下限 |
| 双持 | 0.100s | 0.221s | 同上 |
| 大剑 | 0.120s | 0.374s | 前摇 0.16 × 0.75 = 0.12 |

起手只占 `windup` 的 75%：剩下 1/4 停在蓄势帧上，「抬手 → 定住 → 挥出」才有节奏。
淡入铺满整个 `windup` 的话，蓄势姿态刚到位就开始挥，等于没有蓄势。

`poseIn / poseOut <= 0` 仍表示**关闭过渡**（A/B 对照用 1e-3 的硬切），显式 0 不会被
`Math.max` 吃掉 —— 读原值走 `Number.isFinite`，不要 `??` / `||`。

### 3.3 早退只看权重

```ts
if (combatPoseW <= 0.001) { 清空 swing 状态; return; }
```

去掉 `phase === 'idle'`：「姿态」和「阶段」是两条时间轴，交还只看权重。

### 3.4 剑身三个通道 + 整体带转也要按权重缩放（最隐蔽的一处）

手臂 / 躯干 / 骨盆走 `blendCombatPose(w)` 的交叉淡出，但**剑身仰角 `bladePitch`、副手
`bladePitchOff`、刃面滚转 `bladeTwist` / `bladeYaw`、以及 `rootYaw` 是直接写绝对值的**。
权重掉到 0.05 时它们还是满值，`w` 归零那一帧一步跳回待机：

| 武器 | 修前单帧剑身转角 | 修后 |
|---|---|---|
| 剑盾 | **68.3°** | 3.0° |
| 大剑 | 30.6° | 3.5° |
| 双持 | 62.6° | 4.5° |

做法是「基准 + 差值 × `w`」：`e = base + (clip + drag − base) × w`；基准为 0 的通道
（外撇 / 滚转）直接乘 `w`；盾没有「世界仰角」语义，改成混合**输出端**角度
（`outBase − (eo + offChain) × w`），`w = 0` 时与旧行为逐字节相同。
`rootYaw` 乘 `w`，`spinYaw` **不乘** —— 它是整圈，末帧 `2π ≡ 0`，缩放会让角色倒着转回来。

> 判据只能是「交还那一帧相对邻帧的突跳」，不能是「整段最大单帧转角」：挥出段本身就有
> 60~70°/帧（200° 扫角压在 3~4 帧里），最大值永远落在 active 中段。修前修后的差别只在
> `poseW` 归零那一帧 —— 68.3° vs 3.0°。

## 四、实测（`tools/combo-shot.py`，剑盾段 1，60Hz 逐帧）

| 帧 | 阶段 | 状态 | 主手 `arm` | 躯干 `torso` |
|---|---|---|---|---|
| 0 | windup | 起手 | −0.17 | 0.21 |
| 3 | windup | 抬臂 | −0.72 | 0.51 |
| 6 | windup | 蓄势定格 | −0.95 | 0.55 |
| 10 | active | 挥出 | −1.36 | −0.19 |
| 14 | recovery | 命中保持 | −1.31 | −0.54 |
| 22 | recovery | 收招 | −0.84 | −0.32 |
| 36 | settle | 已回位 | −0.23 | 0.12 |
| 52 | idle | 待机 | −0.12 | 0.12 |

每一段都是单调的，没有一帧跳变；起手第 0 帧与待机差 0.05 rad（= 5% 权重），
收招最后一帧与「不打这一击」的基线差 < 0.05 rad。

读数用 `__harness.swingDebug().poseW` 判断「这一帧是不是还在过渡」——
`poseW < 1` 的帧量出来的刃身角度是混合值，测稳态幅度要先按它筛帧。

## 五、踩过的坑

1. **`paused` 不等于定格**：`debug.paused` 只停 Core，主循环仍然每帧 `view.render`，
   而 render 会推进 `combatPoseW` 等平滑量。软件渲染一张 3s，中间态早被收敛掉了。
   逐帧截图必须 `clipLab.preview()` 置 `clipHold`（主循环不再渲染）+ 手动 `stepOnce()` + `render()`。
2. **`preview()` 会把战斗态临时置成 `active`**：截图前要再走 30 帧让 `combatPoseW` 衰减干净，
   否则「按下攻击前的第一帧」是蓄势姿态的残影，看起来像起手有跳变。
3. **别拿截图判断剑是否水平**：斜俯视下「指向远方的水平剑」在画面上是朝下的
   （`animation.md` §4.3）。角度一律用 `bladesWorld()` / clip-lab 量。

## 六、加一段新动作的检查清单

- [ ] 起手帧 `u=0` 的姿态要**接近**该武器的待机持械角（不是「举到最高再挥」）
- [ ] 收招帧 `u=1` 的姿态要能顺着 `recovery` 走回待机，不能要求反向大幅位移
- [ ] `windup ≥ 0.06s`：低于这个值淡入吃 `poseIn` 下限，蓄势帧只剩 1~2 帧
- [ ] 新增的「剑身类」通道必须乘 `combatPoseW`（否则交还那一帧闪）
- [ ] 验收：`npx vitest run tests/v9s55-pose-entry.test.ts`（三把武器 × 5 例）
