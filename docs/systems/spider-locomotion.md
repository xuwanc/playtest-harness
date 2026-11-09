# 蜘蛛步态（spider locomotion）

> v9s.51 · 主角可切换的 8 腿骨架。决策依据见
> [`../decisions/ADR-010-spider-locomotion.md`](../decisions/ADR-010-spider-locomotion.md)，
> 本文只写**现在代码里是什么、为什么是这些数、改的时候会踩什么**。
>
> 代码：`src/presentation/spider-rig.ts`（约 560 行） ·
> 测试：`tests/v9s50-spider-rig.test.ts`（6 例） ·
> 截图：`tools/spider-hero-shot.py` → `shots/spider-hero/` ·
> 造型预览：`tools/voxel-forge/`（见 [`voxel-forge.md`](voxel-forge.md)）

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
└ body（position.y = 体高 0.35 … + 惯性：pitch / roll / leanZ）
  ├ carapace ─ 1 个 mesh（甲壳 4 层 + 腹柄 + 螯肢 4 + 触肢 4，顶点色）
  ├ eyes     ─ 1 个 mesh（8 只，Basic 材质，不参与光照）
  ├ abdomen  ─ 1 个 mesh（6 层 + 纺器，顶点色；rotation.x = 基准 + 甩动）
  └ hip[i] × 8（rotation.y = 腿方位角，髋点全部在头胸甲侧缘）
    ├ coxa  ─ 1 个 mesh
    └ femur（rotation.x）─ 1 个 mesh（3 段锥形）
      └ tibia（rotation.x）─ 1 个 mesh（膝鼓包 + 3 段锥形）
        └ tarsus（rotation.x，竖直落地）─ 1 个 mesh（踝 + 落地段 + 爪）
```

**整只蜘蛛 35 个 mesh**（身体 3 + 腿 8×4）。同 group 内、「同色或按件写顶点色」的
刚性盒体全部合并 —— 合并的前提是它们**不相对运动**，所以外形一个像素没变。
v9s.50 是 128 个 mesh，合并后 draw call 降 73%。

**位置 / 朝向不在 rig 里**：`playerRoot`（外层）承担 `position + 平滑 yaw`，rig 只解腿。
这样 Core 的移动 / 碰撞 / 战斗一行不用改，「换骨架」真的只是换骨架。

## 3. 数据流：Core 字段 → 腿

| Core 字段 | 用途 | 备注 |
|---|---|---|
| `position` | 脚的世界高度基准（`groundY`） | 跳跃时整只蜘蛛抬起，脚跟着走 |
| `bodyYaw`（经 `playerRoot` 平滑） | 前进方向（`body.getWorldDirection`） | **不用** Core 的 `bodyYaw` 直算：两者差一个小角度，会让摆动腿落点歪 |
| `velocity` | 平动速度 → 相位推进；**差分出加速度** → 惯性弹簧 | 只取水平分量 |
| `stride` | 步幅基准（×0.62，再夹到 0.66 m） | Core 给的是 1 m（人形标定），蜘蛛腿只有 0.93 m |
| `grounded` | 腾空时蜷腿（落点收缩 22%） | |
| **`gaitPhase` 不用** | 相位在 rig 内部积 | 见 §4.1 |

> 为什么不用 Core 的 `gaitPhase`：它按 `frameDist / stride` 推进，蜘蛛的步幅是它的
> 三分之一，直接用会差 3 倍频；而 rig 内部还要叠加「转身等效线速度」这项，
> 混在一起会让两套语义互相污染。**表现层自己积分，Core 状态一个字节都不动。**

## 4. 五个必须记住的坑

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

### 4.4 惯性必须用二阶弹簧，不能用 lerp

身体的三处「沉」——前后俯仰、侧倾、纵向滞后——和腹部的甩动，都走同一套
**二阶临界阻尼弹簧**：

```ts
const a = omega * omega * (target - x) - 2 * omega * v;
v += a * dt;
x += v * dt;
```

和 `x = lerp(x, target, k)` 的差别只有一个 **`v`**：目标突变时它会**冲过头再回来**。
急停时身体先往前栽一下、再收回去，那一下就是「重量」；lerp 只有指数逼近，
看起来像橡皮筋慢慢拉过去 —— 这是这两者唯一的、也是决定性的区别。

| 量 | 驱动 | omega | 上限 |
|---|---|---|---|
| `pitch` | 纵向加速度 | 9.0 | ±0.10 rad |
| `roll` | 横向加速度 + `v × ω` 离心 | 8.0 | ±0.12 rad |
| `leanZ`（身体相对脚前后移） | 纵向加速度 | 7.0 | ±0.05 m |
| `abdomen`（腹部甩动） | 纵向加速度 | 5.0 | ±0.16 rad |

**加速度要先低通**（`1 − exp(−dt × 18)`）：Core 的 `velocity` 在碰撞、翻滚、传送那几帧
会跳变，不滤的话弹簧会被一帧的 400 m/s² 直接打飞。腹部取最低的 5.0 —— 比身体慢一拍、
幅度更大，这是多足最有生命感的一处。

> 顺序很重要：**先算惯性、把 body 的变换写进矩阵，再解腿**。反过来会让 IK 用上一帧的髋位置，
> 急停时能看到脚「慢半拍」地补位。

### 4.5 相位必须按**位移**推进，不能按 `velocity × dt`

`dt` 在 `update` 里被截断到 1/20（低帧率下弹簧才稳），而 Core 是按**真实**帧间隔积分的。
一旦真实帧间隔 > 50 ms，rig 推进的相位就比身体走的路程少 —— 脚越落越远，
没有上界。实测无头 Chromium（约 20 fps，偶尔掉到 8）在线上跑到 `reach 1.58 / clamp 4`
（1.58 = 脚离髋 1.47 m，而腿只有 0.93 m）。

改成读**本帧实际位移**：

```ts
const moved = Math.hypot(c.position.x - lastPX, c.position.z - lastPZ);
const planarSpeed = moved / dt;      // 不是 hypot(velocity.x, velocity.z)
```

这样无论多少 fps，相位与「身体走了多远」严格同源。
同一个修法顺带给「传送」加了保护：单帧位移 > 0.8 m 判定为传送（工位跳转 / 复位 / 调试），
本帧不推进相位、脚由站定分支 lerp 回静止落点 —— 否则传送会把相位在一帧里跳几十个周期。

但**光换数据源不够**：`dt` 截断之后，`速度 × dt` 本身就偏小，推进量还是不足。
所以推进量要按**帧**夹：

```ts
const maxAdvance = Math.min(CAP_HZ * dt, (1 - cfg.duty) / 1.5);  // 摆动相至少 1.5 帧
const advanceUsed = Math.min(effSpeed * dt, maxAdvance * strideUsed);
```

60 fps 下第一项生效（0.107 周期/帧，等效 6.4 Hz），行为与以前完全一致；
低帧率下第二项生效（0.30 周期/帧），欠下的位移由 `slideStep` 让支撑脚滑着补。

> **低帧率的硬边界**：8 fps 时 2.6 m/s 每帧走 0.33 m，而步幅只有 0.62 m —— 一帧就吃掉
> 半个周期。再怎么夹都做不到「摆动相 ≥ 2 帧」。这类设备上 `reach` 会到 1.0~1.4
> （腿被伸到接近极限），但不会崩：`solveLeg` 的 clamp 保证腿永远不超出腿长。
> 60 fps 下 `reach ≤ 0.91`、`clamp = 0`，单测锁的就是这个。

## 5. 参数表

| 参数 | 值 | 依据 |
|---|---|---|
| `height`（体高） | 0.35 | 再低膝盖拱不起来，再高腿伸不直 |
| `scale` | 1.3 | 主角存在感；世界体高 ≈ 0.46、跨距 ≈ 1.6 m |
| `lift`（抬脚） | 0.13 | 俯视视角下抬得高才看得出哪条腿在动 |
| `duty`（支撑占比） | 0.55 | > 0.5 才是三角步态（任何时刻 ≥ 4 脚着地） |
| `strideRatio` | 0.62 | `min(stride × 0.62, 0.66)` |
| `bob`（起伏） | 0.006 | 相对体高 1.7%，看不出但落地有「实」感 |
| `CAP_HZ` | 6.4 | 60 fps 下摆动相 ≥ 5 帧 |
| `inertia` | 1 | 惯性总开关，0 = 身体纹丝不动（A/B 对照用） |

**步幅上限 0.66 是算出来的**，不是调的：第 4 对腿静止落点距髋 0.504 m、腿长 0.929 m、
髋高 0.318 m → 水平余量 `√(0.929² − 0.318²) − 0.504 = 0.369 m`；前伸 `= 0.55 × stride`，
所以 `stride ≤ 0.67` 才不夹腿。取 0.66 把余量吃到 98% —— 这是几何硬边界。

> v9s.51 把步幅从 0.45 提到 0.66（+47%）、步频上限从 7.5 降到 6.4（−15%）。
> 同样移速下腿摆得更开、交换更少：2.6 m/s 从 5.8 Hz 降到 4.2 Hz，
> 冲刺（4.5 m/s）的脚滑从 24% 降到 12%。腿长同步 +8%、落点 +10%，
> 为的是「腿加长但弯度不变」—— 只加长不动落点，腿会全弯在身体底下，俯视时被背甲整块盖住。

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
