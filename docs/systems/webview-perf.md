# 移动端「隔一段时间卡几秒」的排查与处置

> 最后更新：2026-11-10（v9s.62）。代码：`three-scene.ts`（`render` 质量档 / `gpuDebug`）、
> `app.ts`（`?diag=1` 角标）、`config/game.json` 的 `view.render`。
> 症状：**微信内置浏览器**（X5 / WKWebView）里玩几分钟，会周期性卡住几秒，桌面 Chrome 无感。

---

## 1. 先在桌面把「不是这些原因」钉死

用 `tools/clip-lab` 起 headless Chromium（swiftshader 软件渲染），让**真实主循环**跑 25 秒，
期间每 700ms 打一次假人、每 1.1s 砍一次可破坏物：

| 读数 | 结果 | 说明 |
|---|---|---|
| rAF 间隔 | p50 17ms / p99 82ms / max 84ms | 没有「几秒」级别，只有软件渲染的常规抖动 |
| `longtask`（>50ms） | 只有启动那 2 条（65ms） | 主线程没有被长任务阻塞过 |
| `gpuDebug().objects` | 1177 → 1177 | 场景对象不增长（断肢残块、碎片、血迹都在上限内回收） |
| `gpuDebug().geometries` | 302 → 302 | 没有几何泄漏 |
| `gpuDebug().textures` / `programs` | 9 / 14 | 没有材质或着色器反复新建 |

再手动跑 2400 个固定步 + 每步 `render`，对象数只在「有假人死亡」时 +42/+42（= 3 个假人各一块残肢），
重生后回到 1177 —— **断肢残块是干净的**。

结论：**不是 JS 泄漏、不是主线程死循环、不是对象越积越多**。
「几秒」这个量级只剩一条能解释：**WebGL 上下文丢失 → 恢复**。

## 2. 三条候选，按可能性排

| 候选 | 判据（真机上怎么确认） | 处置 |
|---|---|---|
| **GPU 内存 / 命令队列超限 → 丢上下文**（X5 常见） | `?diag=1` 的 `lost` **在涨**，且每次涨都对应一次卡顿 | 降质量档（见 §3）；丢两次后自动再降一档 |
| 页面 resize（地址栏收起 / 微信手势）→ `setSize` → 重建 render target | 卡顿与滚动 / 切换前后相关，`lost` 不动 | `resize()` 只在尺寸真变时调 `setSize`（待办） |
| 系统级 GC / 内存警告 | `heap` 阶跃后卡顿；`lost` 不动 | 降低每帧分配（已基本无每帧 new） |

两天前刚加过 `webglcontextlost` 防护（`a76833d`），说明这个问题那时就出现过 —— 但当时的处理只做了
「`preventDefault` + 跳过渲染」，**没有降低负载**，恢复后照原样跑，于是继续丢、继续卡。

## 3. 质量档：移动端默认降一档

`view.render`（`core/types.ts` 的 `RenderViewConfig`）：

```json
"render": {
  "antialias": true, "dprMax": 2, "shadow": true, "shadowMapSize": 2048,
  "mobile": { "antialias": false, "dprMax": 1.5, "shadow": true, "shadowMapSize": 1024 },
  "degradeOnContextLoss": true
}
```

- **判定** `isMobileWebView()`：UA 像移动端 **且** 主指针是 `coarse`。两条都要满足 ——
  只看 UA 会把桌面微信客户端也降档，只看 coarse 会把触屏笔记本算进来。
- **降档**：关 MSAA（移动端 MSAA 在部分 X5 机型上每帧多一次 resolve）、dpr ≤ 1.5、
  阴影贴图 2048 → 1024（面积降到 1/4）。
- **自动再降**：同一个会话里第二次丢上下文 → 关阴影 + dpr ≤ 1.25，并把 `ph.renderDegraded=1`
  写进 localStorage，下次进页面直接按降档起。执行体是 `applyQuality()`：
  改 `mapSize` 后必须 `shadow.map?.dispose(); map = null`，否则 Three 会沿用旧分辨率。

## 4. `?diag=1`：真机自己报数

桌面复现不了，只能让设备说。URL 加 `?diag=1`，右上角出现四行：

```
fps 33  最坏 100ms          ← 近 5s 的最大帧间隔（"最坏"跳到 2000+ 就是那几秒）
lost 0  tier 0              ← 丢上下文次数 / 是否已降档
geo 309  obj 1177  calls 236
tri 23.4k  heap 15MB
```

判读顺序：先看 `lost`。**在涨** → §2 第一条，质量档生效后应该不再涨；
**不涨但 `最坏` 依然很大** → 换看 `heap` 是否阶跃（GC）或 `calls` 是否暴涨（视野里对象过多）。

## 5. 已知限制

- **`resize` 没有去抖**：`window.resize` 每触发一次就 `setSize`，移动端地址栏动画会连发。
- **antialias 不能热改**：降档只降 dpr / 阴影；要关 MSAA 必须重建 renderer（未做）。
- **`tier` 只有 0/1**：没有「中档」，也没有按机型分级。
- **`heap` 只有 Chromium 有**：iOS WKWebView 读不到 `performance.memory`，显示 `-`。
