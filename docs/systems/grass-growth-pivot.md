# 缓慢生长 + 枢轴顶点动画（v9s.44）

> 实现正本。需求：① 草割断后「长回来」太突然 → 降低存在感、缓慢地一点点长高；
> ② 草受风力影响改成**枢轴顶点动画**，且**保持草的每节 box**。
> 分层 / 生成 / 性能模型见 [`grass.md`](grass.md)；状态：已实现、已验证、未推送。

## 1. 缓慢生长：Core 状态零改动

### 旧行为（问题）

`b.cut` 从 `regrowSec` 线性递减；`cut === 0` 那一帧，表现层把草从
「断茬：上段隐藏、下段 `stumpRatio`、断茬色」**瞬间**切回满高本色 —— 视觉上「啪」一下。

### 新行为

Core 新增纯函数 `grassGrowth(cut, regrowSec, phase)`（不写 world、不进快照）：

```
p    = clamp(1 - cut / regrowSec, 0, 1)        // 由 Core 状态派生，非帧时间累积
d    = phase · GRASS_GROWTH_STAGGER            // 0.18：逐根错峰上限
grow = smoothstep((p - d) / (1 - d))           // p²(3-2p)：慢启动、平缓到位
curH = stumpH + (height - stumpH) · grow       // 表现层连续插值当前总高
```

| 点 | 做法 |
|---|---|
| 逐根错峰 | `phase = blade.yaw / 2π`（**不新增 `rnd()`**，草分布逐字节不变），避免一片齐刷刷冒出来 |
| 两节分配 | `hLower = min(seg, curH)`、`hUpper = curH - seg`；矮草先长下段，长过一格后上段才出现并逐渐变高 |
| 颜色 | `stumpColor → 本色` 随 `grow` 淡回，不再突然变色 |
| 脏标记 | `grow` 纳入 `changed`：再生中的草每帧重算矩阵（稀疏，只有被割那批），静止草场仍 dirty = 0 |
| 端点 | `cut < 0` = 永久断茬 → 0；`cut = 0` = 完好 → 1；到点前已 ≈0.9997 → **无跳变** |

**确定性 / 零回归**：`grow` 只读 `cut`，不累积 `frameDt` → 暂停定格、慢放、快照回放全部成立
（浏览器实测 `timeScale = 0` 时 `sampleHeight` 与 `cut` 双双不变）。
**没有新增 World 字段、没有改任何进快照的配置数值**（`regrowSec` 保持 6，
观感由曲线而非时长提供）→ golden hash `5562e496…` 不变、既有 938 例零回归。

`GrassDebug` 新增三个读数：`growing`（正在生长的草根数）、`avgGrowth`、
`sampleHeight`（前 8 根草当前渲染高度 / 原高），可直接验收连续长高曲线。

## 2. 枢轴顶点动画：保持每节 box

| | v9s.41（旧） | v9s.44（新） |
|---|---|---|
| 注入点 | `<begin_vertex>` | `<project_vertex>`（缩放之后的世界空间） |
| 变换 | 每个顶点按 `h²` 加权**平移**（shear） | 每节 box 的 8 个顶点施加**同一个刚体旋转**（Rodrigues） |
| 形状 | 每节 box 被拉成斜平行四边形 | 每节 box 保持完整立方体，边长 / 夹角不变 |
| 弯曲 | 位移场连续、没有明确「节」 | 下段绕草根转 `LOW·θ`、上段绕下段顶端再转 `UP·θ`，**节间折线** |
| 公式源 | `windSample()` | `windPivotAngles()` / `windPivotEffLength()` / `windPivotRotate()` |

### 为什么必须换注入点

`MeshLambertMaterial` 的默认 `<project_vertex>` 是 `instanceMatrix * vec4(transformed, 1)`，
其中 `instanceMatrix` 含**非等比**缩放 `(width, segH, width)`。若在 `<begin_vertex>`
（单位 box 空间）旋转，旋转与非等比缩放不交换 → 仍会得到 shear。
因此改成替换 `<project_vertex>`：先取 `instanceMatrix * position`（缩放后的世界 /
物体空间坐标，grass group 无变换 ⇒ 就是世界坐标），再对每节 box 做刚体旋转，最后
`modelViewMatrix * mvPosition`。`vViewPosition` / `worldpos_vertex` 等后续 chunk
仍按原变量工作（已实测零控制台错误）。

### 两级枢轴（节间无缝）

```
P0 = 草根；P1 = 下段顶(= 上段底)
θ  = atan2(sway, LOW·hBase + hTip)             // 有效力臂，让顶端位移 ≈ amplitude
axis = normalize(dirZ, 0, -dirX)               // 世界风向的水平转轴
P1' = P0 + R(axis, LOW·θ) · (P1 - P0)          // 下段顶端转后位置
下段顶点 v → P0 + R(axis, LOW·θ) · (v - P0)
上段顶点 v → v1 = P0 + R(axis, LOW·θ) · (v - P0)         // 先继承下段
             → P1' + R(axis, UP·θ) · (v1 - P1')           // 再绕 P1' 额外折
```

上段底 `v = P1` 继承后恰为 `P1'`，再绕 `P1'` 转时 `rel = 0` ⇒ 不动，
因此**上段底恒等于下段顶**，两段永不开裂。`LOW / UP = 0.4 / 0.6`，常量由 Core
插值注入 GLSL，CPU / GPU 不漂移。

### 静态属性与 uniform

| 属性 | 内容 |
|---|---|
| `aWindPhase` vec2 | 两波静态相位（沿用 `windPhase()`） |
| `aWindRoot` vec3 | 草根世界坐标 `P0 = (b.x, b.y, b.z)` |
| `aWindGeom` vec4 | 下段设计高 / 上段设计高 / 高度增益 / 是否上段(0,1) |

每帧仍只改 8 个 uniform（`uWindTime / uWindDir / uWindOmega / uWindAmp /
uWindGust / uWindShade / uWindOn`）。`alive = 当前段高 / 设计段高`
（取 `instanceMatrix[1]` 列长）：割断抑制、**缓慢生长中矮草摆幅自动减弱**，零额外上传。
`customProgramCacheKey` 升为 `grass-wind-pivot-v2`。

**性能不变**：CPU 每帧零实例遍历、零矩阵上传（风部分）、draw call 恒为 2；
顶点多 1 次 `atan` + 4 次 `cos/sin`（≈3.8 万顶点，桌面 / 手机无压力）。

## 3. 验证

```bash
npx vitest run tests/grass-growth-pivot.test.ts   # 10 例
npm run verify                                    # 全链（smoke 33 项）
```

单测锁住：生长端点 / 单调 / 慢启动 / 逐根错峰 / 端点连续；
枢轴**旋转保距**（单位 box 8 顶点两两距离不变 ⇒ 每节 box 不被 shear 拉歪）、
两级枢轴节间无缝、顶端朝风向弯折且位移与 `amplitude` 同量级。

浏览器实测（主场景 + 公网）：`grassDebug().wind.mode === 'pivot'`；割 60 根草后
`sampleHeight` 从 `0.2474` **单调连续**升到 `1.0000`（56 个不同中间值、最大单步 0.0342、
`cut` 归零前已 0.9997），`growing` 峰值 60、生长期 `dirty > 0` 逐帧，
`timeScale = 0` 时 `sampleHeight` 与 `cut` 双双定格，桌面 / 手机 / 公网零控制台错误。
截图：`/workspace/grass-growth-{base,mid,done}.png`。

## 4. 配置速查

| 想调什么 | 改哪里 |
|---|---|
| 生长多慢 | `core.grass.regrowSec`（当前 6s）；缓动形状在 Core `grassGrowth()` |
| 错峰强弱 | Core `GRASS_GROWTH_STAGGER`（0.18） |
| 折线弯折比例 | Core `GRASS_PIVOT_LOW / UP`（0.4 / 0.6） |
| 风摆幅 / 风向 / 浪宽 | `core.grass.wind.*`（同 v9s.41，`amplitude` 仍是草顶摆幅米数） |
| 关风 A/B | 主场景「风：开」按钮 / `G` 键 |
