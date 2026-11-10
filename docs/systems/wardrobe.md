# 装备 / 外观展示界面（Wardrobe）

> 新增于 2026-11-10（v0.9.85 之后的工作区提交，未领号）。
> 用例数 / smoke 项数等数字由 `node scripts/check-facts.mjs --fix` 现场采集同步，不要手改。

## 1. 它是什么 / 边界

一个**纯表现层**的独立 3D 角色展示浮层，玩家向功能（不是调试面板）：

- 入口是右侧垂直居中的竖排「装备」浮标 `#wardrobe-toggle`（`data-ui-button` + `data-ui-region`）。
  刻意**不塞进顶部调试胶囊行**：那排 7 个胶囊在横屏已与居中 `#weapon-bar` 重叠，
  再加一个会被武器条拦截点击；浮标 `z-index:22`、右侧垂直居中，横竖屏都不与
  操作簇 / 性能条 / 武器条相撞。
- 打开 = 一张居中卡片：左侧 3D 转台（`#wardrobe-stage`），右侧数据驱动的外观分区。
- **不写 `World`、不进主循环 / 确定性快照 / 回放**：它自己持有一份恒待机的伪
  `CharacterState / CombatState / HurtState / LinkState / TurnInPlaceState`，
  用 `createVoxelRig` 造一个与主场景逐字节同构造的角色喂给它。主场景在跑什么
  与展示界面完全无关，`npm run verify:portable` 的 Core 边界一行没破。

## 2. 三条交互与实现

| 交互 | 规则（纯函数，见 `presentation/wardrobe-model.ts`） | 渲染侧 |
|---|---|---|
| 点开 → 角色动态站立 | `idleSway(t)` 缓慢微摆；展示用 `voxel.style.breath = true` 打开静止呼吸 | 独立 rAF 只在打开时跑，`frames` 递增可验收 |
| 点击 / 悬停 → 看向鼠标 | `resolveLook(nx, ny)` 把归一化指针坐标转成 `headYaw / headPitch / bodyPitch` | 每帧 `blendTowards` 指数平滑后写进伪状态，`voxel-rig` 的 `headPivot` 生效 |
| 左右拖动 → 绕 Y 轴旋转 | `dragYaw(cur, dx)` 累加水平位移、`wrapPi` 规范到 (-π, π] | 写在**外层 pivot** 的 `rotation.y`，与 rig 内部的挥击带转 `root.rotation.y`（待机恒 0）不冲突 |

视线是**相对身体**的偏转，转台是**相对世界**的旋转，两者刻意解耦：转台用来
360° 看装备正背面，视线是叠加其上的小幅注视。指针移出预览区视线缓缓回正。

## 3. 第二个 WebGL 上下文

- **惰性创建**：第一次 `open()` 才 `new THREE.WebGLRenderer`，默认收起时
  `rendered=false / frames=0`，不占 GPU；关闭即 `cancelAnimationFrame` 停渲染，
  再次打开复用同一上下文（不重建）。
- `webglcontextlost/restored` 处理照抄主场景：丢失时 `preventDefault()` 并跳过渲染，
  恢复后刷新尺寸 —— 微信 X5 / iOS WKWebView 会周期性丢上下文，详见
  [webview-perf.md](webview-perf.md)。
- 为啥不复用主 renderer：主相机跟着角色满场跑、还有草 / 可破坏物 / 特效；
  展示界面要干净转台，且不该为了一个界面改动主渲染路径。

## 4. 数据驱动的扩展位（后续接背包）

`WARDROBE_SECTIONS` 一张表生成整个右侧栏，`kind` 决定渲染分支：

- `weapon`：真实可点，写 `CombatState.weapon` → `rig.update` 每帧 `setWeapon` 换装。
- `dye`：真实可点，`mergePalette(base, id)` 返回**新** ColorConfig（绝不污染主场景
  `VIEW_CONFIG.colors`），重建 rig 换色。未知 id 回落、不改状态。
- `placeholder`：**显式占位**（虚线格 + 「预留 / 后续扩展」标签），防具与背包共
  10 格，不假装能装备。要接真背包：给表加一项 `kind`（如 `bag`），在
  `wardrobe.ts` 的侧栏渲染分支里接数据源，界面骨架不用动。

## 5. 验收接口

- `__harness.wardrobe()`：`open / rendered / frames / turntableYaw / sway /
  headYaw / headPitch / lookTarget / dragging / weapon / palette / sections /
  slots / contextLost`，纯状态读数，不依赖渲染帧。
- `__harness.wardrobeCtl`：`open / close / toggle / setLook / dragBy /
  setWeapon / setPalette / setDragging`，供自动化直接驱动，不必真的操作指针。
- `tests/wardrobe-model.test.ts`：15 例覆盖视线映射 / 限幅 / NaN 夹取、拖动符号
  与多圈规范、指数平滑帧率无关、配色不污染、分区结构。
- `npm run smoke`：7 项浏览器自检（惰性上下文、分区齐全、动态站立 frames 增长、
  视线跟随、拖动旋转、换装换色、关闭停渲染 + 重开复用）。
