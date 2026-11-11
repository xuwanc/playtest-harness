# 装备 / 外观展示界面（Wardrobe）

> 维护于 v0.9.90（v9s.69：匹配当前角色 + 3D 装备 + 合成台；v9s.70：底部抽屉改版 + 盾面朝向修正）。
> 用例数 / smoke 项数等数字由 `node scripts/check-facts.mjs --fix` 现场采集同步，不要手改。

## 1. 它是什么 / 边界

一个**纯表现层**的独立 3D 角色展示浮层，玩家向功能（不是调试面板）：

- 入口是右侧垂直居中的竖排「装备」浮标 `#wardrobe-toggle`（`data-ui-button` + `data-ui-region`）。
  刻意**不塞进顶部调试胶囊行**：那排 7 个胶囊在横屏已与居中 `#weapon-bar` 重叠，
  再加一个会被武器条拦截点击；浮标 `z-index:22`、右侧垂直居中，横竖屏都不与
  操作簇 / 性能条 / 武器条相撞。
- 打开 = 一张**底部抽屉**（从屏幕下方弹出，占下半屏，刻意不挡右侧按钮：
  入口浮标在右中、性能条在右上、武器条在顶部，都不在覆盖的下半区）：左侧更窄的 3D 转台
  （`#wardrobe-stage`，角色**按正常大小、居中**显示），右侧 3×4 合成魔方；
  武器 chips 与「合成 / 清空」按钮统一收进底部一排 `.wardrobe-actions`。
  打开时**主场景相机**沿屏幕下方平移（`view.setWardrobeLift(true)`），让场景里的角色上移到
  不被抽屉遮挡的上半区；这是场景相机，不是转台相机（用户 v9s.61 明确纠正）。
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

## 4. 匹配当前角色 / 3D 装备 / 合成台

- **匹配当前选的角色**：展示用的 `voxel` 尺寸与 `colors` 配色来自 `getCharacterConfig()`
  （app.ts 实时读 `view.bodyTypes()` + `VIEW_CONFIG.bodyTypes[id]`）。切体型（B 键 / 体型胶囊）后
  打开、或已在看时，渲染循环里 `syncCharacter()` 检测到 id 变化就重建 rig —— 不再永远钉死标准体型。
- **装备放进 3D 视窗**：武器本就由角色持握；防具 / 背包 / 饰品现在以 3D 网格挂在
  `rig.group` 上（`buildEquipmentMesh` 按体型 voxel 比例定位头盔 / 胸甲 / 护腿 / 饰品 / 背包），
  随角色一起转、随体型自动重适配，取代原先侧栏的占位虚线格。
- **盾面朝向修正**：待机时剑盾的盾原本被左臂抬姿带成「正面朝上」，现在把 `weaponMount.shieldPitchDeg`
  从 8° 调到 70°，使盾面恒朝身前（略上扬的防御姿态），且对整个剑盾待机 / 挥击姿态都成立
  （该角是左臂挂点的常驻俯仰补偿，与攻击姿态叠加）。
- **合成台（3×4 魔方）**：侧栏一个 12 格（3 列 ×4 行）材料盘，点格循环放材料；
  `合成装备` 按 `WARDROBE_RECIPES` 配方（`matchRecipe` / `consumeForRecipe` 纯函数）
  合成并**直接落进 3D 视窗**（已装备槽位实时高亮）；`清空` 重置魔方。配方与材料定义
  都在 `wardrobe-model.ts`，纯数据，单测覆盖。

## 5. 验收接口

- `__harness.wardrobe()`：`open / rendered / frames / turntableYaw / sway /
  headYaw / headPitch / lookTarget / dragging / weapon / characterId / equipped /
  craftCells / matchedRecipe / sections / slots / contextLost`，纯状态读数，不依赖渲染帧。
- `__harness.wardrobeCtl`：`open / close / toggle / setLook / dragBy / setDragging /
  setWeapon / setCraftCell / cycleCraftCell / craftSynthesize / craftClear`，供自动化直接驱动，不必真的操作指针。
- `tests/wardrobe-model.test.ts`：覆盖视线映射 / 限幅 / NaN 夹取、拖动符号与多圈规范、
  指数平滑帧率无关、分区结构、合成（材料计数 / 配方匹配 / 消耗）。
- `npm run smoke`：浏览器自检含「惰性上下文、武器+合成台齐全、3×4 魔方 12 格、动态站立
  frames 增长、视线跟随、拖动旋转、3 铁合成头盔进 3D 视窗、关闭停渲染 + 重开复用」。

## 6. v9s.61：转台正常大小 + 主场景相机 lift + 竖屏可见

- **「相机下移」的对象被纠正**：v9s.60 误把它理解成转台相机，于是把转台「整体下移 +
  拉远」到容纳 1.8× 身高、角色挤在上半区。用户明确说下移的是**主场景相机**，目的是
  底部抽屉别挡住**场景里**的角色；转台角色应恢复**正常大小、居中**。
- `wardrobe-model.ts` 的纯函数 `wardrobeFraming(height, width, aspect, fov, footY)` 回到
  接近 v9s.69 的基准：垂直可见高度留 1.5× 身高（角色约占舞台 2/3）、`lookY = footY +
  0.5·height`（居中）、相机只留轻微俯视；仍按实测包围盒适配三种体型 + aspect 补偿窄舞台。
  切体型 / 换装备 / 舞台尺寸变化都会重算，`measureRig()` 量 AABB 前先归零转台角。
- **主场景相机 lift**：`camera-rig.ts` 的 `setLift(open)` 指数平滑一个 0..1 量，按「当前
  距离下的垂直可见高度 × 0.22」沿**相机局部 −Y（屏幕下方）**平移相机、`lookAt` 之后
  只改位置不改视线方向 → 世界内容整体上移。链路：`wardrobe.ts` 的 `onOpenChange` →
  `app.ts` → `view.setWardrobeLift(open)` → `cam.setLift`。`snap()` 传送时直接套目标值。
- **竖屏布局**：旧 portrait 规则 `.wardrobe-stage{flex:1 1 52%;min-height:0}` 被 12 格
  `aspect-ratio:1/1` 的魔方挤成 0 高（实测 canvas `478×1`、角色不显示）。现在舞台给
  `height: clamp(140px, 26vh, 240px)` 保底、侧栏 `flex:1 1 auto; overflow-y:auto` 可滚动、
  魔方改 6 列 × 32px 小方格 —— 横竖屏都能看到转台角色。
- 尺寸稳健性保留：`ResizeObserver` 观察 `#wardrobe-stage` + 打开时 rAF 补一次 `resize()`。
- 验收：`__harness.wardrobe().framing` 暴露 `{ distance, lookY, cameraY, visibleHeight }`；
  `tests/v9s60-wardrobe-framing.test.ts` 覆盖正常大小 / 居中 / 体型自适应 / aspect 补偿 /
  退化输入，`tests/v9s61-camera-lift.test.ts` 覆盖相机纯平移 / 角色投影上移 / 关闭回位。
