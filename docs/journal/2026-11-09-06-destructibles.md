# 2026-11-09-06 · 可破坏物件：按命中位置斜切（v9s.x）

## 起点

用户先问「瓶罐 / 旗杆按打到的位置断开，站高处打从高处断、低处打低处断，
切口为攻击方向，是否可行」。结论是可行，且代码库已有大半地基（`grassCut` 状态机模板、
`windPivotRotate` Rodrigues 刚体旋转、分段 box 的 `instanceMatrix` 渲染、事件队列 + golden、
角色站位高度）；唯一硬缺口是**命中链路是纯 2D 的**（`HitSpec` 只有 `dirX/dirZ`，
`MeleeShape` 没有 y）。用户回「按推荐做」，于是按「命中输入走 3D 刀刃相交 +
几何走解析平面裁剪 + cap」落地，从 P0 的 Core 纯函数一直做到 P1 的可运行闭环。

## 做了什么

- 新建 `src/core/destructibles.ts`：`cutPlane`（断面高度 / 切面法线 / 翻倒轴 / 几何上限）、
  `cutColumnHeights`（斜切环的母线截断高度）、`createDestructibleStates`、
  `destructiblesUpdate`（确定性状态机 + `break` 事件）、`destructiblesReset`、
  `forceBreak`（调试入口）。Core 保持纯 TS、无 three / DOM / 外部时间 / class。
- 新建 `src/presentation/destructible-layer.ts`：解析生成上下两个闭合网格 + 斜切 cap
  （cap 法线 = `n`），上半截以切面中心为枢轴做刚体翻倒；3D segment-segment 最近距离
  算 `BreakHit`。
- 契约接入：`types.ts`（`BreakHit` / `PlotDestructibleDef` / `DestructibleSpec` /
  `DestructibleState`、`Intents.breakHits?`、`EventType 'break'`、
  `SceneConfig.destructibles?`、`ModuleFlags.destructibles`、`World.destructibles`）、
  `world.ts`（初始化 / 复位）、`step.ts`（挂在 `grassUpdate` 之后）、`index.ts`、
  `plot-assembly.ts`（相对偏移 → 绝对坐标，按地块 id 字典序展平）、`config.ts`、
  `tests/helpers.ts`、`three-scene.ts`（创建 / 更新 / `breakHits()` / `destructibleDebug()` / dispose）、
  `app.ts`（intents 注入 + `__harness` 的 `breakDebug` / `breakTest` / `resetBreaks`）。
- 新建地块 [`config/plots/x-destructibles.json`](../../config/plots/x-destructibles.json)：
  3 根旗杆 + 2 个瓶罐，只写相对偏移，不写世界坐标（遵守三条铁律）。
- 新建 `tests/destructibles.test.ts`（20 例）、`docs/systems/destructibles.md`（实现正本）、
  `docs/INDEX.md` 登记、`tools/smoke.py` 新增 7 项检查、版本 `0.9.63 → 0.9.64`。

## 契约变更（必须记的一笔）

`World` 新增 `destructibles: DestructibleState[]` 与 `modules.destructibles: boolean`，
因此 **golden hash 变了**：`5562e496…` → `e6028d21…`，已用
`npx vitest run tests/determinism.test.ts -u` 更新。
`Intents.breakHits` 刻意设为**可选**且 `EMPTY_INTENTS` 不带它，冻结夹具不配置物件 →
空数组，其余 967 例逐字节零变化（全量 968 例通过）。

## 踩过的坑

1. **2D 扇形否决了精确的 3D 相交**（最关键）。初版在 Core 里用 `inMeleeShape` 二次校验，
   浏览器逐帧采样发现：横扫时刀刃确实扫到了侧面的瓶罐（`active` 帧 `hits=1`），
   但 `attackFacing=0` 的扇形只认正前方，`broken` 恒为 0。
   改为**只用 `currentMeleeShape` 作时间闸门**（本帧有没有刀风），
   命中判定交给 3D 刀刃相交；扇形继续服务假人。改完真机挥刀立刻打断。
2. **一帧延迟**。`step()` 先跑、`view.render()` 后跑，`breakHits` 天然滞后一帧。
   表现层改成 active 段内按 id **累积**候选（不是每帧覆盖），避免最后一帧扫到的物件
   因下一帧 shape 已 inactive 而丢掉；Core 用 `broken` 去重。
3. **地块字典序抢槽**。新增 auto 地块若 id 排在 `sparring-demo` 前会抢走 slot 0，
   改动已有地块落点。用 `x-` 前缀（不带版本代号）排在其后；且 auto 地块 `spawn` 偏移必须保持 0
   （`smoke` 断言「落点 = 拼合中心」）。
4. **smoke 世界状态污染**。真机挥刀检查放在 39 项之后时失败：前面连击测试把假人挪到
   (60,60)、留了一个陪练贴身，还改过 `combat.weapon / phase`，玩家一直被打断。
   改为先 `clock.singleStep({ resetPressed: true })` 做完整世界复位再摆位挥刀。
5. `tests/destructibles.test.ts` 初版用了不存在的武器 id `sword`（实际是 `sword-shield`），
   导致 `reach` 取 0、`inMeleeShape` 恒 false。改用无 `hitWindow/hitSweep` 的 `staff`
   做闸门测试，只保留「刀风有没有生效」这一层。
6. 切面倾角必须加 `geoMax` 上限，否则大倾角会削到柱体端面、cap 不再是完整椭圆。

## 验证

| 命令 | 结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 968 通过（新增 20 例），golden `e6028d21…` |
| `npm run verify:portable` | PASS |
| `npm run docs:check` | PASS |
| `npm run smoke` | **40/40**，含「真机挥刀能打断」端到端 |
| `npm run verify` | 全链通过 |

浏览器逐帧实测（站位 `(-4.5, 12)` 面向 `+z` 挥一剑）：active 7 帧，
`t=0.183` 产出 1 条 3D 命中候选，`t=0.200` `broken=1`，无页面异常。

## 未做（留给后续）

一次干净断（不做二次断裂）、瓶罐仍是圆柱近似（无收腰 / 瓶口轮廓）、
旗面未挂到上半截、无碎片 / 音效 / 粒子（`break` 事件已就位）。
详见 [`../systems/destructibles.md`](../systems/destructibles.md) §9。
