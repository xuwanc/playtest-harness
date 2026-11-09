# 文档索引（唯一入口）

> 先在这里找位置，再去读那一份。**不要通读 README，也不要通读 `three-scene.ts`（1283 行）或 `voxel-rig.ts`（2737 行）。**
> 维护约定：新增 / 改名 / 删除任何文档，必须同步本页；**新增一个机制 = 在 §2 或 §3 加一行**。表里没有的东西，就是没人会找到的东西。

## 1. 三条阅读路径

| 你的目的 | 走这条 |
|---|---|
| 第一次接手，想知道项目是什么 | `README.md` → 本页 §2 挑一份系统文档 |
| 有个现象要查（看不见 / 抖 / 卡 / 滑）/ 要改某块代码 | 本页 §2「按症状查」→ §3「按模块查」 |
| 想知道「现在做到哪、下一步做什么」 | [`state/CURRENT.md`](state/CURRENT.md) |
| 想知道「为什么当初这么定」 | [`decisions/`](decisions/) 或 [`journal/`](journal/) |

## 2. 按症状查

| 现象 / 关键词 | 先看哪里 | 符号 | 详细文档 | 验收 |
|---|---|---|---|---|
| 特效在某些地块上看不见 / 被地面盖掉 | `presentation/fx-layer.ts`、`presentation/three-scene.ts` | `FX_ORDER`、`setCollidersVisible` | [systems/presentation-fx.md](systems/presentation-fx.md) §1 | `npm run smoke`「地块走不透明通道」 |
| 贴地特效埋进台阶 / 高台里 | `core/collision.ts`、`three-scene.ts` | `groundHeightAt()`、`groundFxY()` | [systems/presentation-fx.md](systems/presentation-fx.md) §2 | `npm run smoke`「特效层级单调」+ 截图 `shots/v9s38/02,03,10` |
| 两种特效谁压谁不确定 / 新特效给几号 | `presentation/fx-layer.ts`（唯一来源） | `FX_ORDER`、`setFxOrder()` | 同上 §1.3 / §1.4 | `__harness.fxDebug().orders` |
| 玩家被打不退 / 想要默认击退 | `config/game.json` → `core.hits.noDamageToPlayer`、`core/hits.ts` | `applyHit` | [decisions/ADR-007](decisions/ADR-007-knockback-default.md) | `npm run smoke`「玩家受击击退默认打开」 |
| 要三个（或更多）会和玩家一样挥刀的 AI | `core/dummies.ts`、`presentation/fighter-rig.ts` | `createDummies`、`syncFighterCombat`、`createFighterRig` | [systems/dummies-fighters.md](systems/dummies-fighters.md) | `npm run smoke`「三个持械陪练」 |
| 陪练不挥刀 / 挥刀没姿势 / 贴着玩家不动 | 同上 + `desiredDirection` | `s.mode === 'spar'`、`standoff`、`attackIntervalFor` | 同上「攻击欲望放低」 | `tests/v9s38-fighters.test.ts` |
| 陪练站在原点 / 画面里只有一个 | `presentation/fighter-rig.ts` | `group.position.set(s.position…)` | 同上「踩过的坑」1 | 截图 `shots/v9s38/01` |
| 陪练只会单发一刀 / 想加连击 | `core/dummies.ts` | `attackComboLeft`、`comboTotalFor`、`inComboRound` | [systems/dummies-fighters.md](systems/dummies-fighters.md)「连击」 | `tests/v9s39-fighter-combo.test.ts` |
| 连击接不上第二段 | 同上 + `desiredDirection` | `COMBO_CHASE`、`comboGap`、`hits.reach` | 同上「连击」四条规则 | `npm run smoke`「陪练一轮打出多段连击」 |
| 陪练「保持距离」时疯狂碎步 / 磨脚 | `core/dummies.ts` | `strafeGate`、`SPAR_STRAFE`、`RADIAL_GAIN` | [systems/dummies-fighters.md](systems/dummies-fighters.md)「对峙时走走停停」 | `tests/v9s40-standoff-gait.test.ts`、`npm run smoke`「对峙时走走停停」 |
| 陪练挨打时腿抽风（步频翻倍） | `presentation/fighter-rig.ts` | `cs.velocity` 不叠 knock | 同上「踩过的坑」8 | `__harness.dummyRigDebug(id).gaitSpeed` |
| 手感面板想看相位 / 不知道哪只脚在踩地 | `presentation/motion-debug.ts` | `stanceOf`、`PHASE_MOVING_EPS`、`STANCE_LINE` | [systems/animation-notes-3.md](systems/animation-notes-3.md) §17 | `tests/v9s42-motion-phase.test.ts`、`npm run smoke`「手感面板：走路时相位曲线左右脚交替」 |
| 手感面板相位是一条平线 | `voxel-rig.gaitDebug().phase` | 别读 Core `gaitPhase`（攻击时冻住） | 同上 §17 坑 1 | `__harness.gaitDebug().phase` vs `world.character.gaitPhase` |
| 连击每一刀都迈同一条腿 / 换段时脚被拽回去 | `presentation/program-anim.ts`、`voxel-rig.ts` | `attackGaitDrive`、`attackPhaseBase`、`attackStepIndex` | [systems/animation.md](systems/animation.md) §1.4 | `tests/v9s41-attack-step-legs.test.ts`、`npm run smoke`「连击跨步左右换腿」 |
| 连击换段时身体往回弹一下 | `voxel-rig.ts` | `applyStep`、`stepZ/stepX/stepDip` | 同上 §1.4 末段 | `tests/v9s41-attack-step-legs.test.ts`「换段不推人」 |
| 截图放哪 / 能不能入库 | `shots/`（`.gitignore` 已挡） | — | [assets/conventions.md](assets/conventions.md) | `git status` 里不该出现 png |
| 刀光 / 斩击弧不出现 | `presentation/three-scene.ts` | `weapon-trail.ts`、`FX_ORDER.trail / slash` | [systems/presentation-fx.md](systems/presentation-fx.md) | `__harness.fxDebug()` |
| 调试面板某项不知道去哪了 | `presentation/debug-panel.ts` | 7 个 `top()` 一级分类 | 本页 §3.4 | 截图 `shots/v9s38/07,08` |
| 攻击卡肉时机 / 卡肉太长 | `core/hits.ts`、`config.combat.weapons.*.hitSweep` | `hitSweep`、`hitstop` 三段式 | [systems/animation-notes-3.md](systems/animation-notes-3.md) | `npm run sweep -- --check`、`npm run smoke` |
| 动作姿势不对 / 换段跳变 | `presentation/swing-pose.ts`、`config.view.animation.swing.clips` | `PoseClip`、`samplePoseClip`、`blendCombatPose` | [systems/animation.md](systems/animation.md) | `npm run clip:lab:check` |
| 慢放时一顿一顿 | `presentation/yaw-smooth.ts`、`app.ts` 的插值 | `view.renderInterp`、`interpAlpha` | [systems/animation-notes-2.md](systems/animation-notes-2.md) | `__harness.interpDebug()` |
| 朝向发抖 / 转身反向转圈 | `core/orientation.ts`、`core/turn-in-place.ts` | `wrapAngle`、`turnInPlace` | [systems/movement-facing.md](systems/movement-facing.md) | `__harness.yawDebug()` |
| 手机摇杆方向乱跳 | `src/adapters/input.ts` | `screenX/Y` 坐标源、摇杆平移吸收 | [systems/input-controls.md](systems/input-controls.md) | `__harness.telemetry()` |
| 线上页面周期性自动刷新 | 发布目录（`dist/`） | — | [systems/overview.md](systems/overview.md) | 发布后看 HTML 有无 `@vite/client` |

## 3. 按模块查

### 3.1 Core（`src/core/`）

| 文件 | 职责 | 关键符号 |
|---|---|---|
| `world.ts` / `step.ts` | 组装 World、定步长驱动各模块、事件队列 | `createWorld`、`step`、`World.events` |
| `types.ts` | **所有类型与配置形状的唯一来源** | `DummyState`、`DummyMode`、`DummyFighterConfig`、`CombatState`、`FIGHTER_MODES` |
| `collision.ts` | 白盒碰撞、台阶、地形高度查询 | `resolveHorizontal`、`groundHeightAt` |
| `combat.ts` | 攻击状态机（windup/active/recovery）、连击、武器切换 | `combatUpdate`、`hitstop` |
| `hits.ts` | 命中结算总出口、击地、派生招扫掠、假人反打 | `applyHit`、`playerHits`、`playerGroundSlam`、`dummyHits` |
| `dummies.ts` | 假人 AI（含持械陪练）、挥砍三阶段 + 一轮连击、牵引 | `createDummies`、`desiredDirection`、`syncFighterCombat`、`comboTotalFor` |
| `separation.ts` | 角色间分离、挤人阻力 | `separationUpdate`、`crowdResistance` |
| `orientation.ts` / `gaze.ts` / `turn-in-place.ts` | 面朝向 / 两级注视 / 原地转身 | `orientationUpdate`、`gazeUpdate` |
| `abilities.ts` / `skills/*` / `arrows.ts` | 技能、投射物 | `abilitiesUpdate`、`channelVolley` |
| `notify.ts` / `pose-clip.ts` | 关键帧事件扫描 / 语义关键帧采样 | `notifyUpdate`、`samplePoseClip` |

### 3.2 表现层（`src/presentation/`）

| 文件 | 职责 | 关键符号 |
|---|---|---|
| `three-scene.ts` | **唯一场景组装点**：装配 + 每帧渲染（白盒 / 角色 / 环 / 刀光 / 箭），不含特效生命周期 | `createSceneView`、`groundFxY`、`fxDebug` |
| `scene-burst-fx.ts` | 一次性贴地光环：冲刺尘环 / 派生招 / 击地冲击的池化与触发 | `createBurstFx`、`slamDebug` |
| `fx-layer.ts` | **特效层级唯一来源** | `FX_ORDER`、`setFxOrder` |
| `voxel-rig.ts` | 主角骨架装配 + 逐帧姿态解算 | `createVoxelRig`、`rig.update`、`bladeWorld` |
| `rig-parts.ts` | 体素零件几何（剑 / 大剑 / 盾 / 杖 / 弓 / 箭），无状态 | `makeSword`、`makeBow`、`makeArrow` |
| `fighter-rig.ts` / `dummy-rig.ts` | 陪练适配（复用 `voxel-rig`）/ 普通假人轻量骨架 | `createFighterRig`、`createDummyRig` |
| `debug-panel.ts` | lil-gui 调试面板（7 个一级分类） | `createDebugPanel`、`DebugActions` |
| `weapon-trail.ts` / `ground-ring.ts` | 刀光 ribbon / 脚下环与进度弧 | `pulse()`、`groundRingRadius` |
| `lab-scene.ts` / `lab-stations.ts` | 7 个测试工位 | `warpTo` 配套 |
| `yaw-smooth.ts` / `swing-pose.ts` | 渲染根节点 yaw 低通 / 挥击姿态数据 | `smoothYaw`、`blendCombatPose` |

### 3.3 其余

| 路径 | 说明 |
|---|---|
| `config/game.json` | 所有可调数值（`core.*` 逻辑 / `view.*` 表现 / `scene.*` 关卡） |
| `src/app.ts` | 组装层 + `window.__harness`（所有 `*Debug()` 验收接口在这里暴露） |
| `tests/` | vitest；`tests/helpers.ts` 的 `FIXTURE_CORE_PATCH` 是**冻结夹具** |
| `tools/smoke.py` | 线上自检（23 项）；`tools/clip-lab/` 动作验证台；`tools/sweep.py` 扫掠采样 |

### 3.4 调试面板分组

一级 7 类，找控件先按「你要调的是什么」定位：

| 一级 | 子分组 |
|---|---|
| 模拟 / 显示 | 模块开关 |
| 移动 / 输入 | 基础移动参数、摇杆 / 输入、冲刺 / 闪避、角色间分离 / 挤压阻力 |
| 动作 / 步态 | 程序化步态、停步 / 收相 / 惯性、足部 IK、惯性倾斜 / 盆骨、朝向 / 接敌注视 / 原地转身 |
| 战斗 / 命中 | 连击 / 武器时序、卡肉节奏、命中 / 受击 / 击退、受击分层、派生招、目标辅助 |
| 表现 / 特效 | 挥击幅度 / 刀光、夸张化 / 四肢伸缩、武器握持 / 腕部 |
| 假人 / 混战 | 普通假人 AI、**持械陪练（剑盾 / 双刀 / 大剑）+ 一轮连击** |
| 相机 | 基础、智能构图、缩放 |

## 4. 命令地图

| 命令 | 干什么 | 什么时候跑 |
|---|---|---|
| `npm run build` | `tsc --noEmit` + vite 打包到 `dist/` | 每次改完 |
| `npm test` | vitest 全量（88 文件 / 876 例） | 提交前 |
| `npm run test:affected` | 只跑 import 闭包受影响的用例 | 改单个模块时 |
| `npm run verify:portable` | Core 可移植性（不许 import three / DOM） | 动 `src/core/` 后 |
| `npm run smoke` | 起 `dist/`，跑 16 项画面层 + 契约自检 | 发布前 |
| `npm run verify` | build → test → portable → smoke 全链 | **发布前必跑** |
| `npm run docs:check` | README 行数 / INDEX 链接 / 单文件 300 行 | 改文档后 |
| `npm run clip:lab:check` | 九段挥击剪辑回归 | 动动画数据后 |
| `npm run sweep -- --check` | 扫掠角曲线与真实 `bladeWorld()` 的偏差 | 动挥击数据 / 卡肉后 |

`__harness` 上的验收接口：

```
fxDebug()     特效层级读数（boxOpaque / boxCount / orders）
slamDebug()   击地尘环（spawns / live[].opacity / scale）
swingDebug()  挥击姿态（段号 / 方向 / 躯干三轴）
gaitDebug()   步态（speed / chestYaw / stopStep / stopDip）
interpDebug() 渲染插值（alpha / applied）
yawDebug()    朝向平滑（target / shown）
telemetry()   最近 20 秒输入 / 位移 / 事件诊断
```

## 5. 检索技巧

1. **先 grep 配置名，不要 grep 中文**。`config/game.json` 的键名与代码字段一一对应：`groundSlam` / `fighters` / `noDamageToPlayer` / `hitSweep` 都能直接搜。
2. **`types.ts` 是形状的唯一来源**。想知道状态有哪些字段，搜 `export type DummyState` 比读 `dummies.ts` 快十倍。
3. **看不见的东西先查 `renderOrder` 与 `transparent`**，再查坐标 / 尺寸 ——「没画出来」和「画在别的东西底下」在屏幕上是同一个现象。
4. **贴地特效用 `groundFxY()`，不要写死 `y = 0.03`**。
5. **改 Core 默认值一定打破旧用例**。冻结夹具是故意的：线上关卡坐标变了不该让 800 多个用例跟着改。真要改契约，在用例内显式写回旧值 + 注释「本用例守的是旧契约」。
6. **发布只看 `dist/`**。`npm run build` 后 `dist/index.html` 里不应出现 `@vite/client`。

## 6. 文档清单

| 路径 | 一句话 |
|---|---|
| [`systems/overview.md`](systems/overview.md) | 分层、目录职责、`step()` 顺序 |
| [`systems/core-contract.md`](systems/core-contract.md) | 跨语言重写的逐项对照表 |
| [`systems/combat.md`](systems/combat.md) | 武器、连击、命中、受击、击退 |
| [`systems/animation.md`](systems/animation.md) | 连击骨架锚点 / 平衡 / 节奏 / 加动作清单（规范） |
| [`systems/animation-notes-1/2/3.md`](systems/animation-notes-1.md) | 按版本追加的动画落地细节（补充，非规范） |
| [`systems/movement-facing.md`](systems/movement-facing.md) | 移动 / 朝向四角 / 分离 / 边界 |
| [`systems/camera-targeting.md`](systems/camera-targeting.md) | 智能相机、软锁定、两级注视 |
| [`systems/presentation-fx.md`](systems/presentation-fx.md) | 特效层级与贴地高度 |
| [`systems/dummies-fighters.md`](systems/dummies-fighters.md) | 9 个假人 / 持械陪练机制 |
| [`systems/input-controls.md`](systems/input-controls.md) | 摇杆、按钮、手势、按键表 |
| [`systems/verification.md`](systems/verification.md) | 自动 / 量化 / 移植验收 |
| [`systems/known-limits.md`](systems/known-limits.md) | 已知限制（现状，不是待办） |
| [`checklists/manual-acceptance.md`](checklists/manual-acceptance.md) | 89 步手动验收 |
| [`state/CURRENT.md`](state/CURRENT.md) | 当前状态 + 下一步（覆盖写） |
| [`risk-review.md`](risk-review.md) | **当前**活跃风险 + 处置优先级 |
| [`risk-history.md`](risk-history.md) | 已关闭风险的归档（按版本） |
| [`assets/conventions.md`](assets/conventions.md) | 路径与命名规范 |
| [`decisions/ADR-001`](decisions/ADR-001-docs-layout.md) | 文档分层：README 只当地图 |
| [`decisions/ADR-002`](decisions/ADR-002-core-boundary.md) | Core 与表现层单向依赖 |
| [`decisions/ADR-003`](decisions/ADR-003-fx-order.md) | 特效层级用单调编号，不关深度测试 |
| [`decisions/ADR-004`](decisions/ADR-004-sparring-dummies.md) | 陪练 = 带武器的假人 |
| [`decisions/ADR-005`](decisions/ADR-005-ground-height.md) | 贴地高度查询放 Core |
| [`decisions/ADR-006`](decisions/ADR-006-fixed-step-events.md) | 固定步长 + 显式事件队列 |
| [`decisions/ADR-007`](decisions/ADR-007-knockback-default.md) | 默认配置反映真实手感 |
| [`journal/`](journal/) | 按日期的迭代记录（23 份，2026-11-05 起；`-00` 是功能总表，`-06` 是 v9s.38，`-07` 是文档重构，`-08` 是大文件职责梳理，`-09` 是陪练连击，`-10` 是连击换腿，`-11` 是相位可视化） |
