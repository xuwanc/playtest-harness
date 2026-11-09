# 可破坏物件：按命中位置斜切（v9s.x 实现正本）

> 需求：瓶罐 / 旗杆被刀砍中时，**打到哪就从哪断**；站高处打从高处断、低处打低处断；
> **切口朝攻击方向倾斜**。本文档是机制与契约的正本，代码在
> `src/core/destructibles.ts`（数学 + 状态机）、`src/presentation/destructible-layer.ts`（几何 + 相交）。

## 1. 先把需求拆成三个正交量

| 量 | 由什么决定 | 落在哪 |
|---|---|---|
| 断面高度 `h` | 命中点 `P.y` | `cutU = (P.y − baseY) / height` |
| 切面法线 `n` | 攻击方向 `d` | `n = normalize(up + dH·tanθ)` |
| 断后运动 | 上半截独立刚体 | 绕 `cross(up, dH)` 轴翻倒 |

「高处打从高处断」**不需要任何高度分支**，它就是 `cutU` 的自然结果。
站位高低在 Core 里本来就有：`character.position.y`、`movement.ts` 的支撑高度、
`scene.ts` 的 step / obstacle 盒——跳起来或站台阶打是真实可触发的，不需要新增地形系统。

> **不要令 `n = d`。** 水平挥击时 `d` 是水平的，会得到竖直切面 → 杆被「纵向劈开」
> 而不是「横向砍断」。`n` 必须恒以竖直为主（`ny > 0`），只把 `d` 的水平投影
> 当作倾斜倾向；从高处下劈时 `d` 的向下分量让 `θ` 变大，切口自然更斜、朝向攻击来向。

## 2. 断面数学（`cutPlane`，Core 纯函数）

```
u      = clamp((hitY − baseY) / height, minU, maxU)      // 默认 0.08..0.92
dH     = normalize(d − up·dot(d, up))                     // 攻击方向的水平投影
pitch  = max(0, −d.y)                                     // dy < 0 = 往下劈
θ      = min(maxTilt, tiltDeg + pitch · pitchGain, geoMax)
n      = normalize(up + dH · tanθ)
axis   = normalize(cross(up, dH)) = (dH.z, 0, −dH.x)
```

`geoMax` 是**几何上限**，否则切面倾角过大会削到柱体端面、cap 不再是完整椭圆：

```
geoMax = atan(0.9 · min(cutH, height − cutH) / radius)
```

`axis` 取正角度时上半截朝攻击去向翻倒（可用 Rodrigues 旋转验证，与
`grass.ts` 的 `windPivotRotate` 同源）。全部返回 plain number，可直接进快照 / 跨语言重写。

### 母线截断高度（`cutColumnHeights`）

表现层要画的是一个**倾斜的环**，不是水平环。母线 i 上一点
`Q(t) = (r·cosφ, t, r·sinφ)`，切面 `dot(n, Q − C) = 0`（C 的轴心高度 = `cutU·height`）：

```
t_i = cutH − (nx·r·cosφ_i + nz·r·sinφ_i) / ny
```

每根母线有自己的截断高度 → 上下两截共用一个斜切环，cap 法线自动等于 `n`。
完好态（`cutU = 1, n = up`）时所有 `t_i` 恰好等于 `height`，下半截即完整柱体，
上半截退化不显示——**完好与断裂走同一套几何路径**，没有分支。

### 瓶罐的断裂带

回转体带收腰 / 瓶口、可能非凸，实时 CSG 会翻车且破坏确定性。改为配置里预设
`bands: [0.35, 0.62]`，命中高度吸附到最近带，再按 `d` 旋转 cap。视觉上是干净的两截，
成本是 O(bands)。

## 3. 数据契约

| 位置 | 新增 |
|---|---|
| `Intents.breakHits?` | **可选**。表现层算出的 3D 相交结果；`EMPTY_INTENTS` 不带它，既有 948 例逐字节不变 |
| `BreakHit` | `{ id, x,y,z, dx,dy,dz }`：命中点（物件轴上离刀刃最近的点）+ 挥击方向 |
| `SceneConfig.destructibles?` | 由 `assemblePlots()` 从 `config/plots/*.json` 拼合注入的绝对坐标定义 |
| `World.destructibles` | `DestructibleState[]`，plain number / 数组，随 JSON 快照回放 |
| `ModuleFlags.destructibles` | 独立开关，关闭后不响应命中、翻倒冻结 |
| `EventType 'break'` | 一次性事件，`value` = 物件索引，`y` = 断面世界高度 |

`DestructibleState` 关键字段：`broken`(0/1)、`cutU`、`theta`、`nx/ny/nz`（切面法线）、
`ax/ay/az`（翻倒轴）、`fall`（当前翻倒角）、`brokenAt`。

**契约变更**：`World` 多了 `destructibles` 与 `modules.destructibles` 两个字段，
golden hash 从 `5562e496…` 变为 `e6028d21…`（已 `-u` 更新，见 journal）。
冻结夹具不配置物件 → 空数组，其余 967 例行为零变化。

## 4. 命中口径（重要决策）

表现层每帧取 `voxel.bladesWorld()` 的刀身线段，与物件轴线段做 **3D 最近距离**
（Ericson segment-segment），得到命中点 P；挥击方向取刀刃中点的帧间位移。

Core 的 `destructiblesUpdate` 用 `currentMeleeShape(world)` 作**时间闸门**：
只有本帧确实有刀风（active 段 / 击地圆）才接受命中，静止或陈旧刀刃位置不会误断。

> **刻意不再用 `inMeleeShape` 的 2D 扇形二次否决。** 实测发现横扫扫到侧面瓶罐时，
> 3D 相交已产生候选，但扇形只认正前方 → 被否决，物理上是倒退。
> 刀刃线段相交比扇形更精确，扇形继续服务假人命中；两者只共享「这一帧有没有挥刀」
> 这一个事实，不互相裁决。相关用例见 `tests/destructibles.test.ts` 的
> 「横扫能打断侧面物件」。

**一帧延迟**：app 的 `step()` 先跑、`view.render()` 后跑，所以 `breakHits` 是上一帧
render 算出的。为此表现层在 active 段内按 id **累积**候选（不是每帧覆盖），
避免最后一帧扫到的物件因下一帧 shape 已 inactive 而整条丢掉；已断目标由 Core 的
`broken` 标记去重。

挂在 `step()` 的 `grassUpdate` 之后：与草块同节拍，读本帧最终角色位置与战斗时间轴。

## 5. 表现层：真实斜切两段

`createDestructibleLayer()` 为每个物件建 2 个 Mesh（下半截 / 上半截），每个几何带
2 个材质 group：本体色 + 切口色。几何由 `cutColumnHeights` 的斜切环解析生成，
`computeVertexNormals()` 让 cap 法线自然等于 `n`。

- 下半截以底面为原点，留在原地。
- 上半截是独立 `Group`，**枢轴 = 切面中心** `(x, y + cutU·height, z)`，
  按 `fall` 绕 `axis` 做 `setFromAxisAngle` 刚体旋转 → 从断口翻倒，不是整体位移。
- 断后 `fall` 用固定步长指数逼近 `BREAK_FALL_TARGET`（≈84°，不贴地穿模），
  暂停 / 慢放 / 快照回放都成立。

`debug()` 给 `count / broken / drawCalls / cuts`，`breakDebug()` 在 `__harness` 暴露，
smoke 直接读数值验收，不看截图。

## 6. 地块配置（遵守三条铁律）

新测试需求 = **新建一个地块文件**，不写世界坐标：
[`config/plots/x-destructibles.json`](../../config/plots/x-destructibles.json)。
`PlotDef.destructibles[]` 只写相对偏移 `dx/dz`，`assemblePlots()` 解算成绝对坐标并
按地块 id 字典序展平，注入 `SceneConfig.destructibles`（与草块 / 工位同一条路径）。

文件名 `x-` 前缀（不带版本代号，由合并闸门统一领号）让它排在 `sparring-demo` 之后，**不抢已有 auto 槽位**
（历史 7 个 pinned 工位与 sparring-demo 的落点零回归）。auto 地块保持
`spawn` 偏移为 0（`smoke` 断言落点 = 拼合中心）。

场地里放 3 根旗杆（任意高度可断）+ 2 个瓶罐（预设断裂带）。

## 7. 调试 / 验收接口

| `__harness` | 用途 |
|---|---|
| `breakDebug()` | 版本、物件数、已断数、每个断面 `cutU/theta/n/fall`、表现层读数 |
| `breakTest(id, y, dx, dy, dz)` | 以给定命中点打断，走**同一个** `cutPlane`，精确验收高低 / 方向 |
| `resetBreaks()` | 所有物件回完好直立（不动玩家 / 战斗） |
| `breakHits()` | 本帧 3D 相交候选（表现层 → Intents 那一层） |

`forceBreak()` 与 `plot-spawn` 的 `spawnPlotTestUnits` 同属运行时调试操作：
不改 Intents、不进 step，但走同一数学，读数与真机链路逐字节一致。

## 8. 验证基线

| 命令 | 结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 968 通过（新增 20 例），golden `e6028d21…` |
| `npm run verify:portable` | PASS（Core 无 three / DOM / 外部时间 / class） |
| `npm run docs:check` | PASS |
| `npm run smoke` | **40/40**，含「真机挥刀能打断」端到端 |

smoke 新增 7 项：物件装配、打哪从哪断、切口方向镜像、瓶罐吸附、斜切两段渲染、
真机挥刀打断、全段无页面异常。真机段先做一次完整世界复位，避免前面连击测试的
假人 / combat 状态污染。

## 9. 已知限制 / 后续

- **一次干净断**：物件断一次后不再响应，未做「再打一次再断一截」的段列表。
- **瓶罐是圆柱近似**：没有收腰 / 瓶口轮廓，靠 `bands` + 配色区分；要真实轮廓需
  给 `pieceGeometry` 加 profile 环（几何生成函数已支持任意 ring 高度数组）。
- **旗面未实现**：杆断后旗布要挂到上半截刚体上，顶点动画跟着刚体旋转走
  （可复用草的 shader 思路）。
- **无碎片 / 音效 / 粒子**：`break` 事件已就位，表现层可接。
- **同一帧一把刀只断一个物件**：`computeHits` 里 `break`，避免横扫让全场地物全断。
