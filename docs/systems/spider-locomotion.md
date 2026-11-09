# 蜘蛛步态（spider locomotion）

> v9s.50 · 主角可切换的 8 腿骨架。决策依据见
> [`../decisions/ADR-010-spider-locomotion.md`](../decisions/ADR-010-spider-locomotion.md)，
> 本文只写**现在代码里是什么、为什么是这些数、改的时候会踩什么**。
>
> 代码：`src/presentation/spider-rig.ts`（约 520 行） ·
> 测试：`tests/v9s50-spider-rig.test.ts`（5 例） ·
> 截图：`tools/spider-hero-shot.py` → `shots/spider-hero/`

## 1. 怎么切到蜘蛛

| 入口 | 用法 |
|---|---|
| URL | `?hero=spider` —— 开局即以蜘蛛进入（分享链接 / 自动化验收都走这条） |
| 键盘 | `B` 循环体型：`standard → tall → spider` |
| 顶部胶囊 | 「体型 蜘蛛」按钮，与 `B` 同一路径 |

配置在 `config/game.json` → `view.bodyTypes.spider`：

```json
{ "name": "蜘蛛", "rig": "spider", "height": 0.7, "radius": 0.42, "moveSpeed": 2.6 }
```

`rig: 'spider'` 是 `BodyTypeConfig` 新增的字段（缺省 `human`）。切体型时
`setBodyType` 会重建骨架、写 `world.config.characterHeight / characterRadius / moveSpeed`，
并把**翻滚枢轴高度**按骨架身高重算（人形 0.9 m，蜘蛛 0.26 m —— 否则翻滚会变成「被拎着抡」）。

## 2. 骨架层级

```
group（rig 根，scale = 1.3）
└ body（position.y = 体高 0.35，逐帧起伏）
  ├ carapace（头胸甲 4 层 + 8 只眼 + 螯肢 + 触肢）
  ├ pedicel（腹柄）
  ├ abdomen（腹部 8 层 + 纺器 + 背线）
  └ hip[i] × 8（rotation.y = 腿方位角，髋点全部在头胸甲侧缘）
    └ femur（rotation.x）
      └ tibia（rotation.x）
        └ tarsus（rotation.x，竖直落地）
          └ claw
```

**位置 / 朝向不在 rig 里**：`playerRoot`（外层）承担 `position + 平滑 yaw`，rig 只解腿。
这样 Core 的移动 / 碰撞 / 战斗一行不用改，「换骨架」真的只是换骨架。

## 3. 数据流：Core 字段 → 腿

| Core 字段 | 用途 | 备注 |
|---|---|---|
| `position` | 脚的世界高度基准（`groundY`） | 跳跃时整只蜘蛛抬起，脚跟着走 |
| `bodyYaw`（经 `playerRoot` 平滑） | 前进方向（`body.getWorldDirection`） | **不用** Core 的 `bodyYaw` 直算：两者差一个小角度，会让摆动腿落点歪 |
| `velocity` | 平动速度 → 相位推进 | 只取水平分量 |
| `stride` | 步幅基准（×0.34，再夹到 0.45 m） | Core 给的是 1 m（人形标定），蜘蛛腿只有 0.7 m |
| `grounded` | 腾空时蜷腿（落点收缩 22%） | |
| **`gaitPhase` 不用** | 相位在 rig 内部积 | 见 §4.1 |

> 为什么不用 Core 的 `gaitPhase`：它按 `frameDist / stride` 推进，蜘蛛的步幅是它的
> 三分之一，直接用会差 3 倍频；而 rig 内部还要叠加「转身等效线速度」这项，
> 混在一起会让两套语义互相污染。**表现层自己积分，Core 状态一个字节都不动。**

## 4. 三个必须记住的坑

### 4.1 步频必须封顶，超出转成「脚滑」

玩家的 `moveSpeed` 是 4.2 m/s，蜘蛛步幅几何上限 0.45 m → 纯公式是 **9.3 Hz**，
一帧（60 fps）推进 0.155 个周期、摆动相只有 2.6 帧，20 fps 下直接跳到 1 帧。
实测 `maxReach` 冲到 **2.9**（腿长的 2.9 倍，脚在两帧间瞬移半米）。

现在：

```ts
const CAP_HZ = 7.5;
const gaitSpeed = Math.min(effSpeed, CAP_HZ * strideUsed);   // 进相位
const slideStep = Math.max(0, effSpeed - gaitSpeed) * dt;     // 进脚滑
// 支撑相：leg.foot.addScaledVector(forward, slideStep)
```

代价是 4.5 m/s 冲刺时约 **20% 脚滑**。8 条腿同时在动，注意力在整体节奏上，
比「抽腿 / 拉直」可接受得多 —— 这是多足高速移动的标准取舍。

### 4.2 转身必须给相位加「等效线速度」

纯原地转身时 `velocity` 是 0，位移相位不推进，但脚锁在世界、身体在转 → 腿被拧到够不到。
（原型实测 `reach 1.43` / 2 条腿 clamp。）

```ts
const spinSpeed = Math.abs(dYaw) / dt * SPIN_RADIUS;   // 0.42 m = 腿根到重心
const effSpeed = planarSpeed + spinSpeed;
```

同时按角速度给步幅打折（`spinDamp`）：转身时落点还要随身体旋转偏移，同样步幅会更吃力。

> 双足其实也有这个问题（`turn-in-place.ts` 那套「一步 = 半圈」就是在处理），
> 只是两条腿容错高、不容易被看见。

### 4.3 摆动前伸量 = `stride × duty`，不是拍脑袋的比例

支撑相身体前进 `stride × duty`，脚相对身体就落后同样的量。摆动时前伸量必须**等于**这个值，
脚才会在一轮结束后回到同一个相对位置。写小了会一个周期漂一点，几十个周期后腿被拖到身后
（实测跑 9 m 后 `d0 = 1.2 m`，直接触发 clamp）。写大了则向前漂。

## 5. 参数表

| 参数 | 值 | 依据 |
|---|---|---|
| `height`（体高） | 0.35 | 再低膝盖拱不起来，再高腿伸不直 |
| `scale` | 1.3 | 主角存在感；世界体高 ≈ 0.46、跨距 ≈ 1.25 m |
| `lift`（抬脚） | 0.13 | 俯视视角下抬得高才看得出哪条腿在动 |
| `duty`（支撑占比） | 0.55 | > 0.5 才是三角步态（任何时刻 ≥ 4 脚着地） |
| `strideRatio` | 0.34 | `min(stride × 0.34, 0.45)` |
| `bob`（起伏） | 0.006 | 相对体高 1.7%，看不出但落地有「实」感 |
| `CAP_HZ` | 7.5 | 60 fps 下摆动相 4 帧 |

**步幅上限 0.45 是算出来的**，不是调的：第 4 对腿静止落点距髋 0.455 m、腿长 0.86 m、
髋高 0.29 m → 水平余量 `√(0.86² − 0.29²) − 0.455 = 0.355 m`；前伸 `= 0.55 × stride`，
所以 `stride ≤ 0.64` 才不夹腿。取 0.45 留 30% 余量给身体倾斜与转身偏移。

## 6. 已知限制

| 限制 | 原因 | 影响 |
|---|---|---|
| 相机俯角只能从 50° 降到 32° | `view.camera` 是全局配置，人形需要 50° | 32° 下看 0.46 m 高的爬行体仍偏俯视，膝拱不明显；再低就看不清地形 |
| 无武器、无挥击姿态 | 蜘蛛没有手 | 攻击判定照常（Core 不依赖刀刃），只是看不到刀光；`bladesWorld()` 返回两侧 null，不会误伤可破坏物 |
| 20 fps 下摆动相只剩 1 帧 | 软件渲染 | 冲刺时偶发 1~2 条腿 clamp；60 fps 下为 0 |
| 受击没有分层姿态 | 蜘蛛的「上/下半身」概念不成立 | 只有 Core 的击退位移，没有躯干后仰 |

## 7. 加第二只多足角色时

现在**不要**抽 `LegChain` / 通用相位组发生器（ADR §5 方案 C）。触发条件：

1. 出现第二种腿数（4 足 / 6 足 / 蜈蚣），或
2. 需要「腿在不同地形高度独立落脚」（方案 B 的射线版）

只有到那时才把 `solveLeg` + 相位组 + 落点策略抽成参数化模块；现在抽是给一种用法造两套抽象。
