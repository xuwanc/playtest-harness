# 体素草块：压开 / 割断 / 风吹麦浪 / 缓慢生长（v9s.39 → v9s.44）

> 周边功能验证稿。**状态：已实现、已验证、未推送**（用户要求先看效果，提交时机另行通知）。
> v9s.41 新增 GPU 风场（第 12 节），兑现了下面「Phase 2：把摆动放进 vertex shader」的预留。
> **v9s.44**：再生改为「缓慢连续长回」、GPU 风改为**枢轴顶点动画**（每节 box 刚体旋转、
> 保持完整立方体），实现正本见 [grass-growth-pivot.md](grass-growth-pivot.md)。
> 决策背景见 [ADR-008](../decisions/ADR-008-grass.md)，多 agent 分工见
> [multi-agent-workflow.md](multi-agent-workflow.md)。

## 1. 需求与口径

| 项 | 口径 |
|---|---|
| 占地 | 一个 `GrassPatch` = **2×2 格**，`cellSize = 0.5` → 1m × 1m（不是 2×2 米） |
| 高度 | 1~2 格 = 0.5~1.0 m，连续随机，参次不齐 |
| 几何 | 每根草 = **2 段 BoxGeometry**（下段恒在、上段决定 1~2 格高），`THREE.InstancedMesh` |
| 压开 | 角色走近 → 草绕根部朝「角色→草」方向倾倒，离开后弹性恢复 |
| 割断 / 再生 | 攻击刀风扫过 → 上段消失、下段留 34% 断茬、抛出碎片；6s 内按 smoothstep + 逐根错峰**平滑长回**（v9s.44，不再瞬间弹满） |
| 体素风 | 不透明 `MeshLambertMaterial`、无贴图、`instanceColor` 色阶、关阴影 |
| 风吹麦浪 | v9s.41 双正弦 GPU 行波；**v9s.44 改枢轴顶点动画**：每节 box 绕底部枢轴刚体旋转、节间折线、保持完整立方体（第 12 节 + [实现正本](grass-growth-pivot.md)） |

## 2. 分层（ADR-002 单向依赖）

```
config/game.json
  core.grass     逻辑参数（压弯半径 / 速率 / 再生）  ─┐
  scene.grass    生成区域 / 密度 / 种子              ─┼→ createWorld → world.grass
  view.grass     观感参数（颜色 / 尺寸 / 实例上限）  ─┘        ↓
                                                          step() 每帧 grassUpdate
                                                               ↓
                              presentation/grass-layer.ts 只读 → InstancedMesh
```

- **Core**：`src/core/grass.ts`。纯数值、可 JSON 序列化、确定性。不 import `three`、不碰 DOM、
  不读 `Math.random` / 外部时间。由 `check-boundary.mjs` 强制。
- **表现层**：`src/presentation/grass-layer.ts`。只读 `world.grass`，只写 GPU 缓冲。
- **组装**：`src/presentation/three-scene.ts` 创建草层、每帧 `update(w, frameDt)`；
  `src/app.ts` 暴露 `__harness.grassDebug()`。
- **验证入口**：统一在**主测试场景 `index.html`**（独立演示页已删除，见 [`../../AGENTS.md`](../../AGENTS.md)）。
  `src/app.ts` 暴露 `__harness.grassDebug()` / `windDebug()`，顶部「风：开」按钮（`G` 键）做 A/B。

## 3. 数据结构（`src/core/types.ts`）

| 类型 | 内容 |
|---|---|
| `GrassSceneSpec` | 生成区域（格坐标）、`density`、`bladesPerPatch`、`avoidMargin`、`seed`、可选 `plots[]` |
| `GrassPlotSpec` | v9s.40 空地草块：矩形格区域 + `density`（默认 1 铺满）+ `clearMarginCells`（四周留空） |
| `GrassConfig` | `enabled` / `footprintCells` / 高度范围 / `bendRadius` / `maxBendRad` / `bendRate` / `recoverRate` / `stumpRatio` / `regrow` / `regrowSec` / `bucketCells` / `wind?` |
| `GrassWindConfig` | v9s.41 风场：`dirDeg` / `speed` / `amplitude` / `wavelength` / `secondWave` / `gust` / `jitter` / `shadeAmount` |
| `WindState` | v9s.41 运行时：`time`（固定步长）/ `gust`（阵风系数），进快照 |
| `GrassViewConfig` | `bladeWidth` / `segmentHeight` / `palette` / `stumpColor` / `maxInstances` / `debris` |
| `GrassBlade` | 根部坐标、朝向、高度、色阶、初始倾斜、`bend` / `bendX` / `bendZ` / `targetBend` / `recover` / `cut` / `cutAt` |
| `GrassPatch` | `cellX/cellZ` + blades 索引区间 `[bladeFrom, bladeTo)` |
| `GrassState` | `spec` / `cellSize` / `bucketCells` / `blades` / `patches` / `buckets` / `cutCount` / `lastCutAt` / `wind` |
| `MeleeShape` | 本帧刀风：命中窗口、reach、扇区半角、刃身扫掠门、击地圆 |

`World.grass` 与 `ModuleFlags.grass` 是新增的契约字段；`EventType` 新增 `'grass-cut'`。

## 4. 生成（`createGrassState`）

1. 按 `footprintCells` 步进扫过 `scene.grass` 的格区域，`density` 决定每个候选位是否铺草。
2. 每块用 `bladesPerPatch` 随机取 3~6 根，在 footprint 内均匀撒点。
3. **独立种子**的 mulberry32（`seeded(spec.seed)`），**不推进 `world.rngState`**：
   草是静态布景，若复用全局随机源会连带改变假人游走等既有行为。
4. 避让：用 `world.boxes` 中非 `ground` 白盒外扩 `avoidMargin` 做 AABB 剔除。
5. 贴地高度按**每根草中心**调 `groundHeightAt()`，避免跨台阶边缘一半埋进地里
   （ADR-005 / `risk-review.md` 记录的老问题）。
6. 网格桶：`bucketCells=4` 格 = 2m，`buckets['bx,bz']` 存 blade 索引。
7. **空地草块（v9s.40）**：`scene.grass.plots[]` 指定矩形格区域。常规遍历先跳过这些格
   （按 `clearMarginCells` 外扩一圈留空），随后 plot 内以 `density=1` 强制铺满，
   生成逻辑与常规草场完全同一份 `emitPatch`。常规遍历在跳过前**仍消耗同一次 `rnd()`**，
   因此非 plot 区域的既有草分布逐字节不变。

> 线上 `plots[0]` = 格 `[-4,4] × [0,6]`（世界 x −2~2m、z 0~3m），四周留空 2 格（1m）。
> 角色出生在 `(0,0)`、面朝 `+z`，摇杆往前一步就进草块：走过去压开、攻击键割断。
> 这块草与远处野草场之间有一圈空地，视觉上是「空地上独立的一块」，便于真人测试。

> 冻结测试夹具（`tests/helpers.ts` 的 `FIXTURE_SCENE`）没有 `scene.grass`
> → `createGrassState` 返回空草场，既有 876 例行为零影响。只有 `makeLabWorld()`
> 和线上配置有草。

## 5. 压开与恢复（`grassUpdate`）

放在 `step()` 的 `hits` 之后（顺序 11.5）：读本帧最终角色位置与战斗时间轴。

- 每个角色（玩家 + 假人 / 陪练）只查周围桶 → `candidatesNear()`，不遍历全草场。
- `targetBend = maxBendRad × (1 - dist/radius)²`，压弯方向 = 角色→草的单位向量。
- 固定步长积分：`bend += (target - bend) × (1 - e^(-rate·dt))`，
  压倒用 `bendRate`（18/s）、回弹用 `recoverRate`（3.2/s）——快压慢回，帧率无关。
- `modules.grass = false` 时整体冻结，便于 A/B 对照。

## 6. 割断（`grassCut`，复用 `hits.ts`）

不另起一套命中逻辑。`hits.ts` 新增两个纯查询导出：

- `currentMeleeShape(world)`：把 `playerHits` 用的命中窗口 `u`、武器 `reach`、
  扇区半角、`hitSweep` 刃身扫掠门、`groundSlam` 击地圆算成 `MeleeShape`。
- `inMeleeShape(shape, x, z, extra)` / `inSlamShape(...)`：点是否落在本帧刀风内。

**刻意不改 `playerHits` 主体**：876 例里有大量卡肉时机 / 扫掠门的精确断言，
周边功能不该动主干命中链路；一致性由 `tests/grass.test.ts` 的对照用例守护。

效果：刀真的扫过草的那一帧才割断（剑盾第 1 段 `u=0.4` 时刀还在右侧 148°→68°，
正前方的草是割不到的），因此一次挥击是「一片扇形被依次削开」而不是「瞬间全没」。

割断后：`cut = regrowSec`（或 `-1` 永久）、断茬朝外倒、发一条
`grass-cut` 事件（`value` = 本次根数）。已断的草不重复计数。

**v9s.44**：`cut` 递减的整段时间由 Core 的 `grassGrowth()` 派生连续生长进度
（smoothstep + 逐根错峰），表现层据此连续插值高度与颜色；`cut` 归零前已长到 ≈1，
不再「瞬间弹满」。Core **不新增 World 字段、不改配置数值** → golden 不变、暂停 / 回放成立。
详见 [grass-growth-pivot.md](grass-growth-pivot.md) §1。

## 7. 渲染（`grass-layer.ts`）

| 决策 | 原因 |
|---|---|
| 单个 `InstancedMesh` 装 2N 个实例 | 2000~4000 个普通 Mesh = 2000+ draw call，必掉帧；实例化后 **1 个 draw call** |
| `instanceColor` 色阶 | 高度 + 种子派生 `tone`，palette 5 档线性插值 |
| `transparent: false` | v9s.38 教训：透明排序会盖掉刀光 |
| `castShadow = false` | 几千个投影体不划算 |
| `frustumCulled = false` | 实例包围盒不准，避免整片草被误剔除 |
| `setFxOrder(obj, FX_ORDER.grass=8)` | 层级走唯一来源，不写裸数字 |
| **脏标记 + `addUpdateRange`** | 只有 `bend` / `cut` 变化的实例重算矩阵并上传；静止草场每帧 dirty = 0 |
| 碎片对象池 | 固定 `debris.max` 个实例，重力抛物线 + 落地反弹，不逐帧 new / dispose |
| **风放 GPU** | v9s.41：风是全局持续动画，若走 CPU 每帧全量重算会一直吃满带宽；改为 `onBeforeCompile` 注入顶点位移，CPU 每帧只改 8 个 uniform，实例矩阵上传量仍为 0 |

矩阵：下段与上段共用「绕根部水平轴旋转」的四元数（`qBend`）+ 初始轻微倾斜（`qLean`）。
**v9s.44**：按 `grow` 从断茬高连续插值出「当前总高」`curH`，再重新分配下段
（`min(seg, curH)`）/ 上段（`curH - seg`）——矮草先长下段，长过一格后上段才出现并逐渐变高；
颜色从 `stumpColor` 随 `grow` 淡回本色。生长中只有这批草 dirty（稀疏）。

## 8. 性能结论

按线上区域（24×20 格 → 120 个候选位、`density 0.72`）实测约 **390 根草 / 780 实例**：

| 项 | 数值 | 判断 |
|---|---|---|
| draw call | 2（草 + 碎片） | 恒定的，与草数量无关 |
| 实例缓冲 | 780 × 16 float ≈ 50 KB | 极轻 |
| 顶点数 | 780 × 24 ≈ 1.9 万 | 桌面 / 现代手机无压力 |
| 每帧全量 compose | 780 次 | 1ms 级，但没必要 |
| 脏标记后 | 通常 0~100 次 | 静止帧几乎零开销 |
| 带宽 | `addUpdateRange` 只传 dirty 区间 | 不整块上传 50 KB |

**风险不在 GPU，在 CPU 与带宽**：不用实例化、或每帧全量遍历 / 全量上传，
在移动端就会成为瓶颈。安全阈值建议 `maxInstances ≤ 6000`、每帧 dirty < 200。

v9s.41 的风**没有增加这两项成本**：每顶点多 2 次 `sin` + 几次点积
（1578 实例 × 24 顶点 ≈ 3.8 万顶点），静态实例属性一次性约 38 KB；
CPU 每帧仍是零实例遍历、零矩阵上传，draw call 恒为 2。这正是把持续动画
放进 vertex shader 而不是 CPU 的原因。

主场景 `window.__harness.grassDebug()` 实时给出 `instances / drawCalls / dirty / bent / cut / debris`，
`windDebug()` 区分 `configured`（配置）/ `rendered`（shader 实跑值），可以直接对照这些数字。

## 9. 配置速查

| 想调什么 | 改哪里 |
|---|---|
| 草铺多少、铺在哪 | `scene.grass`：区域 / `density` / `bladesPerPatch` / `seed` |
| 压得多狠、回得多快 | `core.grass`：`bendRadius` / `maxBendRad` / `bendRate` / `recoverRate` |
| 断茬高度、要不要长回 | `core.grass`：`stumpRatio` / `regrow` / `regrowSec` |
| 颜色、粗细、实例上限、碎片 | `view.grass` |
| 风向、波速、摆幅、浪宽、阵风、色带 | `core.grass.wind`（第 12 节） |
| 整层关掉做 A/B | `view.grass.enabled = false` 或 `modules.grass = false` |
| 只关风做 A/B | 主场景「风：开」按钮 / `G` 键，或 `core.grass.wind.enabled = false` |

## 10. 验收

```bash
npx vitest run tests/grass.test.ts      # 27 例：生成 / 压开 / 割断 / 再生 / 刀风同源 / 风场行波
npm run verify:portable                 # Core 边界守卫（grass.ts 不含 three/DOM）
npm run docs:check                      # 文档规范
npm run verify                         # 全链（build + 单测 + 边界 + docs + smoke）
```

浏览器读数（主场景）：`window.__harness.grassDebug()` / `windDebug()`；
风 A/B 用顶部「风：开」按钮或 `G` 键，不需要第二个页面。

## 11. 已知限制 / 下一步

- `groundHeightAt()` 按中心点取高，草跨台阶边缘仍可能有轻微穿插；生成时已避开台阶，
  但若要「草长在台阶上」需要改为按每个 box 段查高。
- 压弯只作用于玩家 / 假人；投射物、冲刺残影暂不压草。
- 割断是「切断上段」，没有物理飞散的刚体模拟；碎片是纯表现的对象池。
- 草不参与碰撞 / 寻路（有意设计），因此不能被角色推着走、也不挡视线。
- 风在 shader 里做，但**压弯仍在 CPU**（稀疏、脏标记）；若将来压弯也变成全局动画，
  可照第 12 节把 `bend` 做成 `InstancedBufferAttribute`。
- 尚未做按相机距离的 LOD / 分区卸载；草总量由 `maxInstances` 兜底。
- 风只作用于草，不影响树木 / 旗帜 / 粒子；需要统一风场时把 `windSample()`
  提升为独立系统即可（公式已在 Core，无平台依赖）。

## 12. 风场 / 麦浪（v9s.41）

需求：让整片草**持续、连贯地被风吹动**，形成一条条推进的浪，且不牺牲第 7 / 8 节的
脏标记性能模型。

### 为什么不用 CPU 逐帧更新

风是**全局持续动画**——若像压弯那样在 CPU 逐实例重算矩阵，1578 个实例每帧都要
compose + 上传约 100 KB，移动端会一直吃满带宽（正是第 8 节点名的风险）。
所以风走 **GPU 顶点着色器**：CPU 每帧只改 8 个 uniform，实例矩阵上传量仍为 0。

### 技术构成

| 层 | 做法 |
|---|---|
| Core（公式唯一来源） | `windPhase()` 静态相位、`windShaderParams()` 两波频率/幅度、`windSample()` CPU 参考实现、`windAdvance()` 固定步长推进 `time` 与阵风 |
| 静态实例属性 | `aWindPhase`(vec2)：`k·(位置·风向) + 抖动`；`aWindData`(vec4)：段底/段顶相对高度、设计段高、高度增益。**创建时上传一次** |
| 每帧 uniform | `uWindTime / uWindDir / uWindOmega / uWindAmp / uWindGust / uWindShade / uWindOn` |
| 顶点位移 | **v9s.44 已替换**：旧为逐顶点 `h²` 加权 shear（box 被拉成斜平行四边形）；现为 `<project_vertex>` 世界空间**两级枢轴刚体旋转**（每节 box 保持完整立方体），见 [grass-growth-pivot.md](grass-growth-pivot.md) §2 |
| 割断抑制 | `alive = 当前段高 / 设计段高`，断茬变矮自动减弱摆幅，上段 `scale=0` 自动不摆——零额外上传 |
| 明暗浪带 | fragment：`diffuseColor.rgb *= 1 − shade·(0.5+0.5·s₁)`，波峰亮、波谷暗，形成斜向带 |
| 注入方式 | `MeshLambertMaterial.onBeforeCompile` 替换 `<common>` / `<begin_vertex>` / `<color_fragment>`；`customProgramCacheKey` 隔离编译缓存 |

### 公式

```
dir = (cos(dirDeg), sin(dirDeg))
p   = x·dir.x + z·dir.z                 // 沿风向的投影坐标
k₁  = 2π / wavelength,      ω₁ = k₁·speed
k₂  = 2π / secondWave.wavelength, ω₂ = k₂·speed·speedScale
phase = [k₁p + jitter, k₂p + 1.7·jitter]
sway  = gust · (amplitude·sin(phase₁ − ω₁t) + amp₂·sin(phase₂ − ω₂t))
θ     = atan2(sway, LOW·hBase + hTip)                 // v9s.44：有效力臂换算倾角
下段绕草根转 LOW·θ，上段绕下段顶端再转 UP·θ          // 节间无缝、每节 box 刚体
```

`p` 沿风向线性增长 ⇒ 相邻草依次错相、垂直风向同相，于是**一浪一浪推过去**；
时间推进 Δ 等价于空间回退 `speed·Δ`（`tests/grass.test.ts` 有精确断言）。
`jitter` 由已有的 `blade.yaw` 派生（**不新增 `rnd()`**，草的分布逐字节不变），
取值要小（线上 0.16）才能保持浪带整齐——调到 0.9 会打散成「各自乱倒」。
次浪（更短更快）与阵风（低频强度调制）用来避免机械的单频同步感。

### 与既有机制的关系

- 风与压弯**叠加而不冲突**：压弯改 CPU 的 `instanceMatrix`（稀疏、脏标记），
  风改顶点（每帧、GPU）；倒伏的草照样被风推着摆。
- `wind.enabled=false` / `modules.grass=false` 时 `wind.time` 停止推进，浪定格；
  `grassReset()` 把时间归零，重播不会接着上次的浪。
- 状态仍是 plain data：`GrassState.wind = { time, gust }` 进快照、可 JSON 往返；
  Unity / Godot 照 `windSample()` 复算即可，不依赖 WebGL。

### 调参与 A/B

`config/game.json → core.grass.wind`：`dirDeg` 风向、`speed` 波速、`amplitude` 摆幅、
`wavelength` 浪宽、`secondWave` 打破机械感、`gust` 阵风周期/深度、
`jitter` 相位抖动、`shadeAmount` 色带强度。
演示页的「风：开」按钮 / `W` 键 / `?wind=0` 可实时对照；`?view=3` 是迎风低机位，
最容易读出一条条推进的浪带。

> **v9s.44**：风的顶点变换已改为枢轴刚体旋转、再生已改为缓慢连续长回，
> 实现正本（公式 / 单测 / 浏览器读数）见 [`grass-growth-pivot.md`](grass-growth-pivot.md)。
