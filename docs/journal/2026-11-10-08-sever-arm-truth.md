# v9s.62 · 断下来的叉、砍不完的柱子、微信卡几秒

> 2026-11-10 · 版本 v0.9.83 · 代码 `core/destructibles.ts`、`presentation/destructible-layer.ts`、
> `three-scene.ts`、`app.ts`、`config/game.json` 的 `view.render`

## 一、三条 bug，两条同一个病因

用户报三件事：

1. 仙人掌打下来的**根再砍还会掉出叉**，而且掉下来上半段**叉的样子会变**；
2. 柱子砍完**还有一个柱子**；
3. 微信浏览器里**隔一段时间卡几秒**，两天前就有。

前两条是同一个病：**同一个造型写了两份**。

### 1.1 叉的尺寸：站立 1×，断块 2×

站立的侧臂写 `m.scale.set(outLen, thick, outDep)`（单位盒，`full = outLen`）；
断块 `Fragment.parts` 写 `hx: alongX ? a.outLen : a.rad`，而 `parts` 的语义是**半长**，
表现层再 `pt.hx * 2` —— 于是断块上的叉正好是站立的两倍。

现场不是「大一点点」，是**一眼能看出换了根叉**：砍下来那截上的手臂比长着的时候粗一截。

顺带还发现 `CACTUS_VIS_RATIO` 也是两边各乘一次：表现层用 `0.82R` 定位侧臂，
`armParts` 用 `1.0R`，根部凭空多出 `0.06R` 的缝。

**修法**：`cactusArmBoxes(arm, radius)` 成为唯一真源，返回 3 个盒（伸出 / 上扬 / 方头），
站立与 `armParts` 都读它。`CACTUS_VIS_RATIO` 收进 Core。

### 1.2 越砍越多叉：`atU > cutU` 这个判据是错的

`armParts` 原来的条件是「比断口高 → 跟着断块走」。第一次砍在 0.60 时，
0.68 那条臂满足条件，飞走；第二次砍剩下的根到 0.45 时，**0.68 仍然 > 0.45**，
于是它被打包第二次 —— 凭空多出一个叉，而且位置在断口以上。

正确判据是「**落在这一次切走的那一段里**」：`cutU < atU ≤ prevStandU`。
`prevStandU` 在 `severVertical` 改 `st.standU` 之前读到，传进去。

### 1.3 断口上方还立着半根叉

站立只在 `atU > standU` 时跳过整条臂，不看臂的**顶端**。
断口在 0.60、臂根在 0.52 时，站起来的那条上扬段（高 0.67）整条还画着，
顶端到 1.9 —— 视觉上「砍断了，但叉还完整地立在断口上」。

**修法**：`clipArmBox(box, baseY, loY, hiY)` 按世界高度区间竖直裁剪，两边共用：

```
下半（留桩）   = clipArmBox(box, baseY, 0,     topY)
上半（随断块） = clipArmBox(box, baseY, cutY,  prevTopY)
```

接缝才对得上；各自裁一套必然错位。

### 1.4 柱子砍完还有一根柱子

旗杆的站立 mesh 一直是：

```ts
new THREE.Mesh(boxPieceGeometry(st.radius, [st.height, st.height, st.height, st.height]), ...)
```

`standU` 只影响碰撞盒和断块，**顶面高度写死 `st.height`** —— 砍掉几段，桩还是整根，
断块还插在桩里。顺手它还从没画过斜切面（顶面永远平齐）。

**修法**：`cutBoxHeights(R, standU, H, sn)`，桩高与斜切面都跟着 `standU` 走。

### 1.5 回归断言

三个都在 `tests/destructibles.test.ts`：

- 断块上每个侧臂盒与 `cactusArmBoxes` **逐个对上**（尺寸 + 世界位置）；
- 多段砍断后，同类侧臂盒在「桩 + 各断块」上的高度区间**两两不重叠**；
- 「砍下来的根再砍」时，新断块 parts **不含已经飞走那一侧**。

中间踩过一次坑：第一版断言只比 `(hx, hy, hz)`，两条对称臂尺寸完全一样，
`find` 拿到的永远是第一条 —— 报出 0.32m 的假偏差。补上 `x` / `z` 比较才准。

## 二、微信卡几秒：桌面先证明「不是这些」

这个问题在桌面 Chrome 上完全无感，只能先排除。

用 `tools/clip-lab` 起 headless Chromium（swiftshader），让**真实主循环**跑 25 秒，
每 700ms 打一次假人、每 1.1s 砍一次可破坏物：

| 读数 | 结果 |
|---|---|
| rAF 间隔 | p50 17ms / p99 82ms / max 84ms |
| `longtask`（>50ms） | 只有启动那 2 条 65ms |
| `objects` | 1177 → 1177（断肢 +42 后重生回 1177） |
| `geometries` / `textures` / `programs` | 302 / 9 / 14 全程不变 |

再跑 2400 个固定步 + 每步 `render`，结论一样。

**所以不是 JS 泄漏、不是主线程死循环、不是对象越积越多。**
「几秒」这个量级只剩一条能解释：**WebGL 上下文丢失 → 恢复时重传全部几何 / 纹理**。

而两天前 `a76833d` 就加过 `webglcontextlost` 防护 —— 但当时只做了
「`preventDefault` + 跳过渲染」，**没有降低负载**。恢复后照原样跑，于是继续丢、继续卡。

### 2.1 处置：移动端默认降一档 + 丢两次再降 + 现场读数

`view.render` 新增质量档：

| 项 | 桌面 | 移动端 |
|---|---|---|
| `antialias` | on | **off**（部分 X5 机型每帧多一次 MSAA resolve） |
| `dprMax` | 2 | **1.5** |
| `shadowMapSize` | 2048 | **1024**（面积 1/4） |

判定 `isMobileWebView()` 要**两个条件都满足**：UA 像移动端 **且** `(pointer: coarse)`。
只看 UA 会把桌面微信客户端也降档；只看 coarse 会把触屏笔记本算进来。

同一个会话第二次丢上下文 → 关阴影 + dpr ≤ 1.25，并写 `ph.renderDegraded=1` 到 localStorage。
`applyQuality()` 改 `mapSize` 之后必须 `shadow.map?.dispose(); map = null`，
否则 Three 会沿用旧分辨率的 render target。

`?diag=1` 给真机自报数（默认不建节点）：

```
fps 33  最坏 100ms
lost 0  tier 0
geo 309  obj 1177  calls 236
tri 23.4k  heap 15MB
```

判读顺序：**先看 `lost`**。在涨 → 上下文丢失；不涨但 `最坏` 很大 → 看 `heap` 是否阶跃（GC）
或 `calls` 是否暴涨（视野里对象过多）。

## 三、验证

| 项 | 结果 |
|---|---|
| `tsc --noEmit` | 0 error |
| `vitest run` | 111 文件 / **1116 例全绿**（destructibles 32 → 33 例） |
| `smoke` | 53/53 |
| `docs:check` | PASS（95 份 ≤300 行） |
| 数据验收 | 第一刀 parts=5（含 x<0 那条）；第二刀 parts=2 **全为 x>0**；旗杆 `standU 1 → 0.375` |
| 质量档验收 | 桌面 `antialias=true / shadow=2048`；伪装 iPhone UA + 触摸后 `false / 1024` |

## 四、留给下一轮

- 移动端 `resize` 没去抖（地址栏动画会连发 `setSize`）；
- `antialias` 不能热改（要关 MSAA 得重建 renderer）；
- `tier` 只有 0/1，没有中档，也没有按机型分级。
