# 可破坏物件：方盒造型 + 旗杆多段砍断 + 坛子碎裂（v9s.x 实现正本）

> 需求：旗杆 / 坛子被刀砍中时，**打到哪就从哪断**；站高处打从高处断、低处打低处断；
> **切口朝攻击方向倾斜**。两种物件都用**方盒**渲染，但破坏方式不同：
>  - 旗杆：按命中点横向砍断，断下的段成为一块掉落刚体，可**多次砍断**（每一次把当前站立段
>    顶端再砍下一截），剩余站立段递减，断面始终斜切朝攻击方向。
>  - 坛子：命中即**碎裂成多块**方碎块（确定性随机铺放），不再做斜切两段。
>
> 本文档是机制与契约的正本，代码在 `src/core/destructibles.ts`（数学 + 状态机）、
> `src/core/fragments.ts`（确定式刚体求解）、`src/presentation/destructible-layer.ts`（几何 + 相交）。

## 1. 两种物件，三个正交量

| 量 | 由什么决定 | 落在哪 |
|---|---|---|
| 断面高度 `h` | 命中点 `P.y` | `cutU = (P.y − baseY) / height` |
| 切面法线 `n` | 攻击方向 `d` | `n = normalize(up + dH·tanθ)` |
| 断后运动 | 掉落段 / 碎块 = 刚体 | 重力下坠 + 地面 / 刚体间碰撞 |

「高处打从高处断」**不需要任何高度分支**，它就是 `cutU` 的自然结果。
站位高低在 Core 里本来就有：`character.position.y`、支撑高度、step / obstacle 盒——
跳起来或站台阶打是真实可触发的，不需要新增地形系统。

> **不要令 `n = d`。** 水平挥击时 `d` 是水平的，会得到竖直切面 → 杆被「纵向劈开」
> 而不是「横向砍断」。`n` 必须恒以竖直为主（`ny > 0`），只把 `d` 的水平投影
> 当作倾斜倾向；从高处下劈时 `d` 的向下分量让 `θ` 变大，切口自然更斜、朝向攻击来向。

**方盒造型**：`radius` 现在是**横截面半边长**（正方形），不再是圆柱半径。
表现层用 `boxPieceGeometry` 拼出底面 + 四侧壁 + 斜切顶面，几何与圆柱时代完全解耦，
但「倒塌段 / 碎块仍为方盒」让刚体碰撞（OBB-SAT）天然成立且确定式可解。

## 2. 断面数学（`cutPlane`，Core 纯函数）

```
u      = clamp((hitY − baseY) / height, minU, maxU)      // 默认 0.08..0.92
dH     = normalize(d − up·dot(d, up))                     // 攻击方向的水平投影
pitch  = max(0, −d.y)                                     // dy < 0 = 往下劈
θ      = min(maxTilt, tiltDeg + pitch · pitchGain, geoMax)
n      = normalize(up + dH · tanθ)
axis   = normalize(cross(up, dH)) = (dH.z, 0, −dH.x)
```

`geoMax` 是**几何上限**，否则切面倾角过大会削到盒体端面、顶面不再是完整四边形：

```
geoMax = atan(0.9 · min(cutH, height − cutH) / radius)
```

`axis` 取正角度时掉落段朝攻击去向翻倒（可用 Rodrigues 旋转验证，与
`grass.ts` 的 `windPivotRotate` 同源）。全部返回 plain number，可直接进快照 / 跨语言重写。

### 方盒顶面截断高度（`cutBoxHeights`）

表现层要画的是一个**倾斜的四边形顶面**。四角顺序（xz 平面）：
`BL(-r,-r)、BR(r,-r)、TR(r,r)、TL(-r,r)`。角点 `Q = (ox, t, oz)` 落在切面
`dot(n, Q − C) = 0` 上（C 的轴心高度 = `cutU·height`）：

```
t_i = clamp(cutU·height − (nx·ox + nz·oz) / ny, 0, height)
```

每角有自己的截断高度 → 斜切顶面。完好态（`cutU = 1, n = up`）所有 `t_i = height`，
顶面即水平；**完好与断裂走同一套几何路径**，没有分支。

### 瓶罐的断裂带

回转体带收腰 / 瓶口、可能非凸，实时 CSG 会翻车且破坏确定性。改为配置里预设
`bands: [0.35, 0.62]`，命中高度吸附到最近带，再按 `d` 旋转 cap。不过坛子的
**最终破坏是碎裂**（见 §3），`bands` 只在「刚好命中的位置」用于决定爆裂中心高度。

## 3. 两种破坏路径

### 旗杆：多次砍断（`severPole`）

每次命中把 `[cutU, standU]` 之间的一段切下，成为一块 `Fragment` 刚体：

- 段被赋予水平击飞（`POLE_KNOCK`）+ 上抛（`POLE_LIFT`）+ 绕翻倒轴角速度（`POLE_SPIN`）初值；
- 站立段顶端更新为新的斜切面：写 `standU = cutU`、`snx/sny/snz`；
- `broken += 1`（即已砍断次数）；
- 当 `standU ≤ MIN_STAND`（默认 0.08）时不再响应，留一小截底座。

可重复调用 → 一根旗杆被砍成若干掉落段 + 一小截底座，每一段都是独立刚体。

### 坛子：碎裂成多块（`shatterJar`）

命中即把整只罐子切成 N 块方碎块（确定性随机铺放），全部成为掉落刚体：

- 碎块数 `n = clamp(round(height · radius · 30), 6, 12)`，小罐少、大罐多；
- 在罐子立方体内按 `g×g×g` 网格铺放（`g = ceil(cbrt(n))`），每块尺寸在格子 0.72~0.94 倍间抖动；
- 抖动来源是 `nextRandom(world)`（mulberry32，推进 `world.rngState`）——
  **零 Math.random**，因此同输入同结果、可被快照回放；
- 碎块从爆裂中心（命中点）径向外扩（`JAR_KNOCK`）+ 上抛（`JAR_LIFT`），带随机自旋；
- 写 `broken = 1`、`standU = 0`、`fragments = frags`，此后不再响应二次命中。

### 数据契约（`DestructibleState` / `Fragment`）

| 字段 | 含义 |
|---|---|
| `broken` | 旗杆 = 已砍断次数；坛子 = 0/1（是否碎裂） |
| `standU` | 当前站立段顶端相对高度（1=完整，递减到 `MIN_STAND` 止） |
| `snx/sny/snz` | 站立段顶端斜切面法线（供表现层画剩余段顶面） |
| `cutU/theta/nx/ny/nz/ax/ay/az` | 最近一次断口（断面高度 / 倾角 / 法线 / 翻倒轴） |
| `fragments` | `Fragment[]`，每段 / 碎块一块 |

`Fragment`（= `RigidBody`）全为 plain number：中心 `x/y/z`、半边长 `hx/hy/hz`、朝向四元数
`qw/qx/qy/qz`、线速度 `vx/vy/vz`、角速度 `wx/wy/wz`、逆质量 `invMass`、逆转动惯量 `invInertia`、
恢复 / 摩擦系数、`rest`（1=休眠）、`restT`（连续低速时长）。

`World.destructibles` 是 `DestructibleState[]`，随 JSON 快照回放；golden hash 为 `e6028d21…`
（默认世界不放置物件，`destructibles: []`，故与历史 967 例零回归）。

## 4. 命中口径（重要决策）

表现层每帧取 `voxel.bladesWorld()` 的刀身线段，与物件轴线段做 **3D 最近距离**
（Ericson segment-segment），得到命中点 P；挥击方向取刀刃中点的帧间位移。

Core 的 `destructiblesUpdate` 用 `currentMeleeShape(world)` 作**时间闸门**：
只有本帧确实有刀风（active 段 / 击地圆）才接受命中，静止或陈旧刀刃位置不会误断。

> **刻意不再用 `inMeleeShape` 的 2D 扇形二次否决。** 实测发现横扫扫到侧面瓶罐时，
> 3D 相交已产生候选，但扇形只认正前方 → 被否决，物理上是倒退。
> 刀刃线段相交比扇形更精确，扇形继续服务假人命中；两者只共享「这一帧有没有挥刀」
> 这一个事实，不互相裁决。相关用例见 `tests/destructibles.test.ts` 的「横扫能打断侧面物件」。

**一帧延迟**：app 的 `step()` 先跑、`view.render()` 后跑，所以 `breakHits` 是上一帧
render 算出的。为此表现层在 active 段内按 id **累积**候选（不是每帧覆盖），
避免最后一帧扫到的物件因下一帧 shape 已 inactive 而整条丢掉；已断目标由 Core 的
`broken` / `standU` 标记去重。

## 5. 掉落刚体物理（确定性，`stepRigid`）

所有掉落段 / 碎块由 `src/core/fragments.ts` 的 `stepRigid` 按固定步长推进，**零随机**、
全部 plain number、随 World 一起快照，因此暂停 / 慢放 / 倒带对碎块天然成立。

算法（顺序冲量法的轻量版）：

1. **积分动态体**：重力 + 欧拉位移 + 四元数刚体旋转；常数线性 / 角速度阻尼让残余滑动收敛。
2. **收集接触**：
   - 地面：盒子**每一个低于地面的角点**各生成一个向上接触。多于一个角点时，
     倾斜 / 翻倒的盒子会自然「坐」在棱或面上，而非单角悬停，从而真正落定。
   - 刚体间：两两 OBB 做 SAT（15 轴）求最小穿透轴，`n` 统一取「由 B 指向 A」的推出方向。
3. **顺序冲量求解（只改速度，迭代 `ITER=6` 次）**：法向冲量带恢复系数
   （慢速接触 `vn` 低于 `BOUNCE_VMIN` 不弹跳，只滑 / 停，消除落地抖动）+ 切向摩擦冲量。
4. **位置修正（每帧只做一次，Baumgarte 风格）**：按逆质量分配把穿透推回。
   关键纪律：**位置修正不在 `ITER` 次迭代里重复叠加**，否则会被反复弹起、永不落定。
5. **休眠**：连续 `SLEEP_SEC` 低速后速度归零、`rest=1`，只当碰撞体；显著法向冲量唤醒。

站立段由调用方以 `invMass=0` 的瞬时刚体并入求解，让掉落段与它发生碰撞（坛子碎裂后
无站立段，仅地面 + 碎块间碰撞）。

## 6. 表现层：方盒几何 + 碎块池

`createDestructibleLayer()`：

- 完好 / 剩余站立段用 `boxPieceGeometry(radius, cutBoxHeights(...))` 画底面 + 四侧壁（本体色）
  + 斜切顶面（切口色），`computeVertexNormals()` 让顶面法线自然等于 `n`。
- 掉落段 / 碎块用**共享几何 + 网格池**：逐帧 `position.set(f.x,f.y,f.z)` +
  `quaternion.set(f.qx,f.qy,f.qz,f.qw)` + `scale.set(hx*2,hy*2,hz*2)`，池子按
  `fragments.length` 伸缩，无逐帧分配。
- `computeHits` 跳过已碎裂的坛子、以及砍到只剩底座的旗杆；其余口径不变。

`debug()` 给 `count / broken / drawCalls / positions / fragments(每物件片段数) / cuts`，
`breakDebug()` 在 `__harness` 暴露，smoke 直接读数值验收，不看截图。

## 7. 地块配置（遵守三条铁律）

新测试需求 = **新建一个地块文件**，不写世界坐标：
[`config/plots/x-destructibles.json`](../../config/plots/x-destructibles.json)。
`PlotDef.destructibles[]` 只写相对偏移 `dx/dz`，`assemblePlots()` 解算成绝对坐标并
按地块 id 字典序展平，注入 `SceneConfig.destructibles`（与草块 / 工位同一条路径）。

文件名 `x-` 前缀（不带版本代号，由合并闸门统一领号）让它排在 `sparring-demo` 之后，**不抢已有 auto 槽位**
（历史 7 个 pinned 工位与 sparring-demo 的落点零回归）。auto 地块保持
`spawn` 偏移为 0（`smoke` 断言落点 = 拼合中心）。

场地里放 3 根旗杆（任意高度可多次砍断）+ 2 个坛子（命中即碎裂）。

## 8. 调试 / 验收接口

| `__harness` | 用途 |
|---|---|
| `breakDebug()` | 版本、物件数、已断数、每个断面 `cutU/theta/n/fragments`、表现层读数 |
| `breakTest(id, y, dx, dy, dz)` | 以给定命中点打断，走**同一个** `cutPlane`，精确验收高低 / 方向 |
| `resetBreaks()` | 所有物件回完好直立（不动玩家 / 战斗） |
| `breakHits()` | 本帧 3D 相交候选（表现层 → Intents 那一层） |

`forceBreak()` 与 `plot-spawn` 的 `spawnPlotTestUnits` 同属运行时调试操作：
不改 Intents、不进 step，但走同一数学，读数与真机链路逐字节一致。

## 9. 仙人掌（v9s.61 简化抓形）

造型改过两版。第一版是「方柱 + 两条直角横杆」，像旗杆刷了绿漆；第二版为了不像旗杆，
加了 6 段收腰、明暗交替、每段错位旋转 —— **过犹不及**：亮暗条纹把它读成一摞小方块，
错位让轮廓起毛刺，侧臂三段折线像插上去的积木。

现在只抓三个特征：**直、粗、两臂**。

| 部位 | 做法 | 为什么 |
|---|---|---|
| 主干 | 4 段，`w = 0.82R · (0.90 + 0.12·sin πt)` | 中段略粗就够读出「柱状」，再多段就碎 |
| 视觉半径 | `0.82R`（碰撞盒仍按 `R`） | 柱身按碰撞半径画太粗，读作绿柱子 |
| 颜色 | 统一本色，**不再交替** | 体积感交给光照，不交给条纹 |
| 顶端 | 没被砍过 → 同色圆头；砍过 → 浅色斜切面 | 仙人掌的顶是长出来的，不是切出来的 |
| 侧臂 | 细腕（0.34R）、短出（1.15R）、长上扬（2.1R）、末端方头 | 萨瓜罗的识别点是「细腕短出、明显上折」 |
| 断口 | 最上一段用 `boxPieceGeometry` 斜切 + `cutColor` | 破坏逻辑一行没动，只换造型 |

**断块也分段**：`Fragment` 只有 `hx/hy/hz`，掉下来会变成一块砖。表现层对
`kind === 'cactus'` 的碎片按 4 段渲染（宽度 0.95/1/0.99/0.93），顶部加一片
浅色断口薄片 —— 物理仍只算主盒，纯视觉还原。

**侧臂有自己的判定轴**：`hitSegments()` 给每条侧臂生成「水平段 + 上扬段」两条线段，
刀刃与它们求最近距离。旧版只按主干竖轴判定，砍到伸出的胳膊上什么都不掉，
玩家读作「砍不到」。

**一刀可以砍多件**：`computeHits` 不再 `break`（旧版一刀只处理第一个命中的物件），
横扫两株并排仙人掌就该两株一起断。同物件重复命中仍由 Core 的 `hitArmed` 去重。

**命中候选允许晚一帧**：表现层在 `render` 采样、`step` 下一帧消费。若挥砍正好在
这一步结束，`currentMeleeShape` 已关闭，这批候选会被整条丢掉 —— 这就是「明明砍到了
却没断」的主因。`world.meleeGatePrev` 记住上一帧是否在刀风窗口内，只放一个 tick。

## 10. 碰撞：物件是实体

旧版可破坏物**没有任何碰撞**，玩家能从仙人掌中间穿过去，砍完也没有「路通了」的反馈。

现在每个物件在 `world.boxes` 里有一块 `kind: 'obstacle'` 的 AABB（`dest-<id>`），
`destructiblesUpdate` 每帧把顶面同步到当前站立高度：

```
maxY = (standU <= MIN_STAND || 坛子已碎) ? minY : y + standU * height
```

顶面压回 `minY` 时 AABB 高度为 0，`resolveHorizontal` 的
`maxY <= pos.y + stepHeight` 直接跳过 —— 玩家自然走得过去，不需要从数组里删除盒子
（`boxes` 被移动 / 相机 / 贴地特效共享引用，替换数组会让它们读到旧引用）。

**碰撞盒不画白盒**（v9s.61）：白盒层遍历 `world.boxes` 建不透明方块，`dest-*` 也在里面；
而盒子宽度就是物件直径（罐子 0.56 / 仙人掌 0.64），画出来正好把造型整个包住 ——
现场读作「可破坏物是一个红棕色方块」，仙人掌怎么改造型都看不见。
现在 `three-scene` 建白盒时跳过 `DEST_BOX_PREFIX` 开头的盒子：碰撞照旧，不再有外壳。

**踩不上物件顶**：物件最低 1.85m，玩家跳 0.9m、stepHeight 0.45m，够不到，
所以不会被 `supportHeight` 当成台阶。

## 11. 工位（v9s.60 合并）

`zz-cactus-test` 合并进 `x-destructibles`，共 9 件：
旗杆 ×3（后排弧线）/ 罐子 ×2（中排）/ 仙人掌 ×2（两侧）/ 按钮 ×2（对应仙人掌）。

散开布置（`dx` 最大 ±2.15，地块 `radius 3.0`），不再挤在圆心。
`span` 保持 `[2, 2]` —— span 会影响 auto 布局的槽位分配，改大会把别的工位挤到
假人测试位置上（v9s.60 第一次尝试 `[3,3]` 时 smoke 的踱步 / 命中测试就是被这个撞挂的）。

## 12. 侧臂几何只有一份真源（v9s.62）

四条症状、两个根因，都不是「调参能救」的：

| 症状 | 根因 | 修法 |
|---|---|---|
| 砍下来的叉比长在上面的大一号 | 站立写 `full = outLen`，断块 `Fragment.parts` 写 `half = outLen`（画出来正好 2 倍） | `cactusArmBoxes()` 成为唯一真源，两边都读它 |
| 砍下来的**根**再砍一刀，又掉出一个叉 | `armParts` 判据是 `atU > cutU`，把上一次**已经随断块飞走**的臂再打包一次 | 判据改成 `cutU < atU ≤ prevStandU`（只打包本次切走的那一段） |
| 断口以上还长着一根完整的叉 | 站立只判 `atU <= standU`，不看臂的**顶端** | `clipArmBox()` 按 `[0, topY]` 竖直裁剪 |
| 旗杆砍完还剩一整根柱子 | 站立 mesh 高度**写死 `st.height`** | 改用 `cutBoxHeights(R, standU, H, sn)`，桩高与斜切面都跟着 `standU` |

核心是**一条侧臂被断口切成两半**要有唯一定义：下半留桩 = `clipArmBox(box, baseY, 0, topY)`，
上半随断块 = `clipArmBox(box, baseY, cutY, prevTopY)`。两边用同一个函数，接缝才严丝合缝；
各自写一套必然错位。`CACTUS_VIS_RATIO`（0.82）也收进 Core —— 以前表现层乘一次、
`armParts` 又按 1.0R 算，侧臂根部会凭空多出 0.06m 的缝。

回归断言在 `tests/destructibles.test.ts`：

| 断言 | 防的是 |
|---|---|
| 断块上每个侧臂盒与 `cactusArmBoxes` **逐个对上**（尺寸 + 世界位置） | 「掉下来样子变了」 |
| 多段砍断后，同类侧臂盒在「桩 + 各断块」上的高度区间**两两不重叠** | 「同一个叉出现两次」 |
| 「砍下来的根再砍」时，新断块 parts **不含已经飞走那一侧** | 「越砍越多叉」 |

## 13. 验证基线

| 命令 | 结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 1116 通过（含 destructibles 33 例 + 碰撞 5 例：断面数学 / 方盒顶角 / 多段砍断 / 侧臂守恒 / 坛子碎裂 / 刚体物理 / 玩家被挡 / 断完可通行） |
| `npm run verify:portable` | PASS（Core 无 three / DOM / 外部时间 / class） |
| `npm run docs:check` | PASS |
| `npm run smoke` | **53/53**，含「真机挥刀能打断」「打哪从哪断」「切口朝攻击方向」 |

smoke 新增：物件装配、打哪从哪断、切口方向镜像、瓶罐吸附、斜切渲染、真机挥刀打断、全段无页面异常。
真机段先做一次完整世界复位，避免前面连击测试的假人 / combat 状态污染。

## 10. 已知限制 / 后续

- **坛子只碎一次**：`broken=1` 后不再响应，未做「再补一刀再碎一轮」。
- **旗面未实现**：杆断后旗布要挂到掉落刚体上，顶点动画跟着刚体旋转走
  （可复用草的 shader 思路）。
- **无音效 / 粒子**：`break` 事件已就位（`value`=物件索引，`y`=断面世界高度），表现层可接。
- **侧臂碰撞缺位**：碰撞盒只覆盖主干 AABB，伸出去的侧臂可以穿过（玩家 1.2m 高，
  侧臂在 1.3m 以上，正常走路碰不到；跳起来才可能擦到）。
- **单点地面接触下倾斜盒最低角可能略插地（≤10cm）**：视觉可忽略，碰撞已把碎片散开。
