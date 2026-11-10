# 文档索引（唯一入口）

> 先在这里找位置，再去读那一份。**不要通读 README，也不要通读 `three-scene.ts`（1283 行）或 `voxel-rig.ts`（2737 行）。**
> 维护约定：新增 / 改名 / 删除任何文档，必须同步本页；**新增一个机制 = 在 §2 或 §3 加一行**。表里没有的东西，就是没人会找到的东西。

## 1. 三条阅读路径

| 你的目的 | 走这条 |
|---|---|
| 新加入的 agent / 刚拉下 git | [`AGENTS.md`](../AGENTS.md)（3 分钟：三条铁律 + 流程）→ README |
| 第一次接手，想知道项目是什么 | `README.md` → 本页 §2 挑一份系统文档 |
| 有个现象要查（看不见 / 抖 / 卡 / 滑）/ 要改某块代码 | 本页 §2「按症状查」→ §3「按模块查」 |
| 想知道「现在做到哪、下一步做什么」 | [`state/CURRENT.md`](state/CURRENT.md) |
| 想知道「为什么当初这么定」 | [`decisions/`](decisions/) 或 [`journal/`](journal/) |

## 2. 按症状查

| 现象 / 关键词 | 先看哪里 | 符号 | 详细文档 | 验收 |
|---|---|---|---|---|
| 胡子只会前后摆 / 转身时不甩 / 静止慢慢偏 | `presentation/beard.ts`、`voxel-rig.ts` 的 5.5 段 | `solveBeard`、`aF`/`aR`、`deadzone`、`beardAvoidAt` | [systems/character-style.md](systems/character-style.md) §3.1–3.2 | `tests/v9s54-beard-motion.test.ts` |
| 造型部件像浮着 / 某块完全看不见 | `presentation/voxel-rig.ts` 的 `style` 段 | `hairCap`、`pivot.position.z`、`torsoD` | [systems/character-style.md](systems/character-style.md) §2.1 | `__harness.view.heroGroup()` 遍历 mesh 打印世界坐标 |
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
| 朝向切换（锁定 / 拖拽 / 攻击锁朝向）时下盘晃一下 | `presentation/gait.ts` | `turnSpinGate`、`slewGate`、`slewHipTarget`、`hipFlipWeight` | [systems/animation-notes-4.md](systems/animation-notes-4.md) §19 | `tests/v9s44-hip-yaw-track.test.ts` |
| **慢放**回看时下盘还抖一下 / 贴着墙时下盘乱拧 | `presentation/gait.ts`、`voxel-rig.ts` | `slewGate`、`hipTrackRate`、`gameDt`、`hipSpeedFade` | [systems/animation-notes-4.md](systems/animation-notes-4.md) §20 | `tests/v9s45-slowmo-hip.test.ts`、`npm run smoke`「慢放转身下盘不抖」 |
| 前进切后退（或左右换向）时腿抽一下 | `presentation/gait.ts` | `slewDirSign`、`dirDrive`、`GaitInput.dirF` | [systems/animation-notes-4.md](systems/animation-notes-4.md) §18 | `tests/v9s43-reverse-blend.test.ts`、`npm run smoke`「换向不抽腿」 |
| 站定两脚并拢、停下像把最后一步撤回去 / 想要斜跨站姿 | `presentation/gait.ts`、`voxel-rig.ts` 的 2.04 段 | `solveIdleStance`、`mixIdleStance`、`leadFootIsLeft`、`idleStanceTarget`、`idleSink/idleShift/idleHipYaw` | [systems/idle-stance.md](systems/idle-stance.md) | `tests/v9s55-idle-stance.test.ts`、`python3 tools/stance-shot.py` |
| 起手一帧抬手 / 收招停在半挥 / 打完回待机闪一下 | `voxel-rig.ts` 的 `posePhaseU`、`combatPoseW`、`applyBladeTarget` | `posePhaseU`、`combatPoseW`、`fadeTarget`、`poseW`、`bladePitch × w` | [systems/pose-entry.md](systems/pose-entry.md) | `tests/v9s55-pose-entry.test.ts`、`python3 tools/probe-entry.py` |
| 打中只有卡肉 / 没有血 / 想要飙血 | `presentation/blood-fx.ts`、`core/health.ts` 的 `pushHitMark` | `createBloodFx`、`HitMark`、`HIT_MARK_CAP`、`FX_ORDER.bloodDrop/Stain/Mist` | [systems/blood.md](systems/blood.md) | `tests/v9s56-damage-blood.test.ts`、`python3 tools/blood-shot.py` |
| 陪练打不死 / 打死了不消失 / 死了不刷新 | `core/health.ts`、`core/dummies.ts`、`three-scene.ts` 的 `applyDeathPose` | `damageDummy`、`killDummy`、`reviveDummy`、`updateHealth`、`REVIVE_GUARD` | [systems/damage-death.md](systems/damage-death.md) | `tests/v9s56-damage-blood.test.ts`、`__harness.deathDebug(id)` |
| 血总喷在胸口（打头打腿一个位置） / 能穿过尸体 / 陪练没血条 | `core/hits.ts` 的 `hitU`、`core/separation.ts` 的尸体分支、`presentation/healthbar-layer.ts` | `hits.hitHeight`、`dummies.corpse`、`BodySample`、`healthBarDebug` | [systems/damage-death.md](systems/damage-death.md) §6–8 | `tests/v9s57-death-polish.test.ts`、`python3 tools/death-polish-shot.py` |
| 脚掌穿地 / 脚在小腿中段 / 尾巴断节 / 头转得像锤子 | `rig-ik.ts` 的 `groundY`、`murloc-parts.ts` 的 `MURLOC_HEAD_SPIN`、`sentinel-parts.ts` 的 `ankleY` | `groundY`、`headYaw` 节点、`cc` | [systems/posture.md](systems/posture.md) | `tests/v9s65-rig-fix.test.ts` |
| 腿根转了腰没转 / 链上偏航「先减后增」/ 想改腰段停在哪 | `config/game.json` → `view.animation.spine.chainBlend`、`voxel-rig.ts` 3.01 段 | `chestYaw`、`chainBlend`、`distributeYaw()`、`splitSpine`、`torsoYaw()` | [systems/pose-layers.md](systems/pose-layers.md) §2 | `tests/v9s66-pose-space.test.ts`、`__harness.gaitDebug().chestYaw` |
| 躯干背面裂开楔形缝 / 能看穿到身体另一侧 / 胯部是个洞 | `presentation/murloc-parts.ts` → `buildMurlocHip`、`voxel-rig.ts` 3.05 段 | `hipMesh`、`hipShare`、`torsoPad` | [systems/pose-layers.md](systems/pose-layers.md) §3 | `python3 tools/spine-chain-shot.py` |
| 上臂回正后手朝斜前方支棱 / 补偿随父节点偏航而歪 | `presentation/rig-space.ts`、`voxel-rig.ts` 3.1 段 | `pitchInModelSpace`、`q_parentInModel⁻¹·R·q_parentInModel` | [systems/pose-layers.md](systems/pose-layers.md) §3 | `tests/v9s66-pose-space.test.ts` |
| 脚钉住了但脚掌在地面上慢慢转向 / 脚腕被掰 / IK 拧脚 | `rig-ik.ts` 的 `footRest`、`voxel-rig.ts` 的 `ankleL/R` | `lockModelRotation`、`IKLimb.ankle` | [systems/pose-layers.md](systems/pose-layers.md) §4 | `tests/v9s66-pose-space.test.ts` |
| 想给动作叠增量（攻击姿势 − 攻击基础姿势）/ 加 lean 层 | `presentation/rig-space.ts`、`voxel-rig.update()` 的 2.x→4 段 | `quatInModel`、`rotateInModelSpace`、`lockModelRotation` | [systems/pose-layers.md](systems/pose-layers.md) §5 | 设计稿（尚未实现增量层） |
| 想让角色整体驼背 / 屁股高头压低 / 加一个「体态」而不是做新动画 | `core/types.ts` 的 `CharacterPosture`、`voxel-rig.ts` 2.96 / 3.0 段、`dummy-rig.ts` | `style.posture`、`MURLOC_POSTURE`、`postureDebug()`、`POSTURE_MAX_TOTAL` | [systems/posture.md](systems/posture.md) | `tests/v9s64-posture-sentinel.test.ts`、`__harness.view.postureDebug()` |
| 想要一个机器人 / 单眼角色 | `presentation/sentinel-parts.ts`、`bodyTypes.sentinel` | `buildSentinelHead`、`buildSentinelTorso`、`bodyTypes.sentinel` | [systems/sentinel.md](systems/sentinel.md) | `?hero=sentinel`、`tests/v9s64-posture-sentinel.test.ts` |
| 想加一个「怪物」角色 / 鱼人怎么做 | `presentation/murloc-parts.ts`、`voxel-rig.ts` / `dummy-rig.ts` 的挂点、`DummySpawn.variant` | `buildMurlocHead`、`buildMurlocDorsalFin`、`DummyVariant`、`bodyTypes.murloc` | [systems/murloc.md](systems/murloc.md) §1–4 | `tests/v9s63-murloc.test.ts`、`?hero=murloc`、`y-murloc` 工位 |
| 死亡姿势全都一样 / 想按最后一击断手断头 / 倒下像插值 | `core/health.ts` 的 `decideSever`、`three-scene.ts` 的 `applySever` / `applyDeathPose` | `decideSever`、`sever`、`settled`、`SEVER_NODE`、`death.physics` | [systems/damage-death.md](systems/damage-death.md) §9–10 | `tests/v9s60-sever.test.ts`、`python3 tools/sever-shot.py` |
| 仙人掌砍不到 / 一刀只断一棵 / 从可破坏物里穿过去 / 可破坏物被一个红方块包住 / 工位挤在圆心 / **砍下来的根再砍又掉叉 / 掉下来的叉变大 / 旗杆砍完还有一整根** | `presentation/destructible-layer.ts`、`core/destructibles.ts`、`three-scene.ts` 的白盒段 | `hitSegments`、`DEST_BOX_PREFIX`、`syncDestructibleBoxes`、`meleeGatePrev`、`cactusArmBoxes`、`clipArmBox`、`CACTUS_VIS_RATIO` | [systems/destructibles.md](systems/destructibles.md) §9–12 | `tests/v9s60-cactus-collide.test.ts`、`tests/destructibles.test.ts`、`npm run smoke`「真机挥刀能打断」 |
| 微信里隔一段时间卡几秒 / 想知道移动端该降什么档 | `three-scene.ts` 的 `render` 质量档与 `webglcontextlost`、`app.ts` 的 `?diag=1` | `view.render`、`isMobileWebView`、`applyQuality`、`gpuDebug().lostCount / tier` | [systems/webview-perf.md](systems/webview-perf.md) | `<url>/?diag=1`、`__harness.gpuDebug()` |
| 剑盾挥剑不舒展 / 扫角只有 130° / 剑扫到身后看不见 | `config.view.animation.swing` 的 `ss.*` 与 `weaponScale` | `armYaw` 换向、`elbow` 行程、`armLPitch`/`elbowL`（盾臂） | [systems/pose-entry.md](systems/pose-entry.md) §三 | `npm run clip:lab:check`、`python3 tools/swing-shot.py` |
| 截图放哪 / 能不能入库 | `shots/`（`.gitignore` 已挡） | — | [assets/conventions.md](assets/conventions.md) | `git status` 里不该出现 png |
| 刀光 / 斩击弧不出现 | `presentation/three-scene.ts` | `weapon-trail.ts`、`FX_ORDER.trail / slash` | [systems/presentation-fx.md](systems/presentation-fx.md) | `__harness.fxDebug()` |
| 角色造型要加驼背 / 屈膝 / 发型 / 胡子 / 肩甲 | `core/types.ts` → `CharacterStyle`、`presentation/voxel-rig.ts`、`presentation/beard.ts` | `style.hunch`、`kneeSink`、`balding`、`beard`、`spaulder` | [systems/character-style.md](systems/character-style.md) | `tests/v9s52-elder-style.test.ts`、`tests/v9s53-elder-bulk.test.ts`、`python3 tools/elder-shot.py` |
| 胡子看不见了 | `presentation/voxel-rig.ts` 胡子挂点 z | 必须 `max(HS×0.5, 0.135)`（躯干半深 0.14） | 同上 §2 | 截图 `shots/elder/01-front.png` |
| 驼背体型头颈之间有缝 | `voxel-rig.ts` `hunch > 0` 的脖子块 | `headPivot` 下的 `0.46H` 方块 | 同上 §1 | `tests/v9s52-elder-style.test.ts`「盒子增量 10」 |
| 调试面板某项不知道去哪了 | `presentation/debug-panel.ts` | 7 个 `top()` 一级分类 | 本页 §3.4 | 截图 `shots/v9s38/07,08` |
| 攻击卡肉时机 / 卡肉太长 | `core/hits.ts`、`config.combat.weapons.*.hitSweep` | `hitSweep`、`hitstop` 三段式 | [systems/animation-notes-3.md](systems/animation-notes-3.md) | `npm run sweep -- --check`、`npm run smoke` |
| 动作姿势不对 / 换段跳变 | `presentation/swing-pose.ts`、`config.view.animation.swing.clips` | `PoseClip`、`samplePoseClip`、`blendCombatPose` | [systems/animation.md](systems/animation.md) | `npm run clip:lab:check` |
| 慢放时一顿一顿 | `presentation/yaw-smooth.ts`、`app.ts` 的插值 | `view.renderInterp`、`interpAlpha` | [systems/animation-notes-2.md](systems/animation-notes-2.md) | `__harness.interpDebug()` |
| 朝向发抖 / 转身反向转圈 | `core/orientation.ts`、`core/turn-in-place.ts` | `wrapAngle`、`turnInPlace` | [systems/movement-facing.md](systems/movement-facing.md) | `__harness.yawDebug()` |
| 手机摇杆方向乱跳 | `src/adapters/input.ts` | `screenX/Y` 坐标源、摇杆平移吸收 | [systems/input-controls.md](systems/input-controls.md) | `__harness.telemetry()` |
| 线上页面周期性自动刷新 | 发布目录（`dist/`） | — | [systems/overview.md](systems/overview.md) | 发布后看 HTML 有无 `@vite/client` |
| 草压不开 / 刀割不到草 / 草挡住角色 | `core/grass.ts`、`presentation/grass-layer.ts` | `grassUpdate`、`grassCut`、`currentMeleeShape` | [systems/grass.md](systems/grass.md) | `tests/grass.test.ts`、`__harness.grassDebug()` |
| 草不随风摆 / 浪带不明显 / 摆得太乱 | `core.grass.wind`、`presentation/grass-layer.ts` | `windPhase`、`windSample`、`windAdvance`、`installGrassWind` | [systems/grass.md](systems/grass.md) §12 | 主场景「风：开」/ `G` 键 A/B、`__harness.windDebug()` |
| 草割断后「长回来」太突然 / 想缓慢长高 | `core/grass.ts`、`presentation/grass-layer.ts` | `grassGrowth`、`GRASS_GROWTH_STAGGER`、`sampleHeight` | [systems/grass-growth-pivot.md](systems/grass-growth-pivot.md) §1 | `tests/grass-growth-pivot.test.ts`、`__harness.grassDebug().sampleHeight` |
| 风把草每节 box 拉歪 / 想要一节一节弯且保持方块 | 同上 | `windPivotAngles`、`windPivotEffLength`、`windPivotRotate`、`<project_vertex>` | 同上 §2 | `tests/grass-growth-pivot.test.ts`、`__harness.grassDebug().wind.mode` |
| 多个 agent 同时开发 / 怎么合并提交 | `tools/gh-commit.mjs`、冲突分类 | `--apply`、ref SHA 乐观锁 | [systems/multi-agent-workflow.md](systems/multi-agent-workflow.md) | `node tools/gh-commit.mjs`（dry-run） |
| 用户通知 push 后怎么推到功能分支（`git push` 无凭证） | `tools/push-branch.py`、GitHub MCP 网关 | `push_files` / `delete_file`、tree 一致校验 | 同上 §1 | `python3.11 tools/push-branch.py --dry` → 去掉 `--dry` |
| 测试场景该用哪个 / 新功能要加测试环境 | `config/plots/*.json`、`core/plot-assembly.ts` | 主场景 `index.html`、一地块一文件 | [systems/plot-assembly.md](systems/plot-assembly.md) | 只保留主场景、单入口 build |
| 底板装不下第 10 块测试地 / 地面有洞 / 走上去掉下去 | `core/plot-assembly.ts`、`core/scene.ts` | `span`、`s`、`slab`、`applyPlotAssembly` | [systems/plot-assembly.md](systems/plot-assembly.md) §4 | `plotDebug().slabs` + smoke「地板铺满包围盒」 |
| 两边同时加同一位置地块 / 不想写绝对坐标 | `core/plot-assembly.ts`、`src/config.ts` | `assemblePlots`、`PLOT_ASSEMBLY`、`plotDebug()` | [systems/plot-assembly.md](systems/plot-assembly.md) §2/§4 | `tests/plot-assembly.test.ts`、`__harness.plotDebug()` |
| 工位传送没跟着地块走 / 拼合后坐标不对 | `lab-panel.ts` 的 `goto()` | `StationSpec.spawnX/spawnZ` | 同上 §4 | `__harness.lab.goto(id)` + `plotDebug()` |
| 地块测试按钮生成 / 清除假人陪练 | `core/plot-spawn.ts`、`presentation/three-scene.ts` | `spawnPlotTestUnits`、`syncDummyCapacity`、`dummyRenderCount` | 同上 §5 | `tests/plot-spawn.test.ts`、`__harness.spawnAt()` |
| 每次任务完成怎么更新线上 / 贴链接 | `tools/publish-preview.mjs` | `publish:preview` | 同上 §6 | `npm run publish:preview` 打印唯一公网链接 |
| 想给主角换一副骨架 / 加多足角色 / 蜘蛛腿够不到 | `presentation/spider-rig.ts`、`view.bodyTypes[*].rig` | `createSpiderRig`、`solveLeg`、`CAP_HZ`、`strideUsed` | [systems/spider-locomotion.md](systems/spider-locomotion.md) §4 | `tests/v9s50-spider-rig.test.ts`、`__harness.spiderDebug()` |
| 蜘蛛走起来没重量感 / 身体太「飘」 | `presentation/spider-rig.ts` | `stepSpring`、`springs`、`inertia` | [systems/spider-locomotion.md](systems/spider-locomotion.md) §4.4 | `tests/v9s50-spider-rig.test.ts`「惯性」例 |
| 想快速试方盒子角色的造型 / 改一个盒子要 40 秒 | `tools/voxel-forge/` | `forge.html`、`shot.py`、`specs/*.json` | [systems/voxel-forge.md](systems/voxel-forge.md) §2 | `shot.py` 打印的 mesh / tris / size |
| 角色零件太多、draw call 偏高 | `presentation/spider-rig.ts` | `partMesh`、`mergeParts`、`BoxGeometry` 合并 | [systems/voxel-forge.md](systems/voxel-forge.md) §5 | `__harness.spiderDebug().meshes` |
| 蜘蛛走起来抽腿 / 冲刺时腿被拉直 / 原地转身腿拧成麻花 | `presentation/spider-rig.ts` | 步频封顶 + `slideStep`、`spinSpeed`、前伸量 `stride × duty` | 同上 §4.1~§4.3 | `__harness.spiderDebug().maxReach / clamped` |
| 想加装备 / 外观试衣间 / 角色动态站立 + 看向鼠标 + 拖动旋转 / 后续扩背包 | `presentation/wardrobe.ts`、`presentation/wardrobe-model.ts` | `resolveLook`、`dragYaw`、`idleSway`、`mergePalette`、`WARDROBE_SECTIONS` | [systems/wardrobe.md](systems/wardrobe.md) | `tests/wardrobe-model.test.ts`、`__harness.wardrobe() / wardrobeCtl`、`npm run smoke`「装备界面」7 项 |

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
| `grass.ts` | 体素草块：生成 / 压弯 / 恢复 / 割断 / **缓慢生长 / 枢轴风公式**（确定性、网格桶） | `createGrassState`、`grassUpdate`、`grassCut`、`grassReset`、`grassGrowth`、`windPivotAngles`、`windPivotEffLength`、`windPivotRotate` |
| `plot-assembly.ts` | **确定性地块拼合**：按 id 排序、整数格 first-fit、解算地板 / 工位 / 自带物件 | `assemblePlots`、`applyPlotAssembly`、`DEFAULT_PLOT_LAYOUT` |
| `plot-spawn.ts` | 地块测试按钮就地生成 / 清除假人陪练（运行时调试，不进 `step`） | `spawnPlotTestUnits`、`clearPlotTestUnits`、`plotTestUnitCount` |
| `hits.ts` 的刀风导出 | 本帧命中形状（草块等周边系统复用，不改 `playerHits`） | `currentMeleeShape`、`inMeleeShape`、`inSlamShape` |

### 3.2 表现层（`src/presentation/`）

| 文件 | 职责 | 关键符号 |
|---|---|---|
| `three-scene.ts` | **唯一场景组装点**：装配 + 每帧渲染（白盒 / 角色 / 环 / 刀光 / 箭），不含特效生命周期 | `createSceneView`、`groundFxY`、`fxDebug` |
| `scene-burst-fx.ts` | 一次性贴地光环：冲刺尘环 / 派生招 / 击地冲击的池化与触发 | `createBurstFx`、`slamDebug` |
| `fx-layer.ts` | **特效层级唯一来源** | `FX_ORDER`、`setFxOrder` |
| `voxel-rig.ts` | 人形主角骨架装配 + 逐帧姿态解算（含**姿态进出场**：`posePhaseU` 定采样点、`combatPoseW` 定交叉淡出） | `createVoxelRig`、`rig.update`、`posePhaseU`、`combatPoseW`、`bladeWorld` |
| `health.ts` | **生命值 / 死亡 / 重生**（Core）：扣血、判死、复活保护、命中记录环形 | `damageDummy`、`killDummy`、`reviveDummy`、`updateHealth`、`pushHitMark` |
| `blood-fx.ts` | 命中飙血三层：血珠（InstancedMesh）/ 血雾 / 地面血迹 | `createBloodFx`、`spawnBurst`、`spawnStain`、`BodySample` |
| `healthbar-layer.ts` | 陪练头顶血条（DOM 覆盖层，只画有血量的单位） | `createHealthBarLayer`、`healthBarDebug` |
| `gait.ts` | **程序化步态解算（纯函数）**：相位推进 / 反向前后融合 / 停步惯性 / 转身闸门 / **待机斜跨站姿** | `solveGait`、`slewDirSign`、`solveStopInertia`、`solveIdleStance`、`leadFootIsLeft` |
| `spider-rig.ts` | **8 腿主角骨架**：两节身体 + 三角步态 + 每腿两骨闭式解（按 `bodyTypes.rig` 切换） | `createSpiderRig`、`solveLeg`、`debug()`、`legs()` |
| `beard.ts` / `voxel-rig.ts` 的 `style` 段 | **造型特征**：驼背 / 屈膝 / 地中海（一盒穿三面）/ 长白胡子（三节 × 前后左右两通道）/ 肩甲 / 呼吸 | `CharacterStyle`、`solveBeard`、`beardAvoidAt`、`createBeardState` |
| `rig-parts.ts` | 体素零件几何（剑 / 大剑 / 盾 / 杖 / 弓 / 箭），无状态 | `makeSword`、`makeBow`、`makeArrow` |
| `fighter-rig.ts` / `dummy-rig.ts` | 陪练适配（复用 `voxel-rig`）/ 普通假人轻量骨架 | `createFighterRig`、`createDummyRig` |
| `debug-panel.ts` | lil-gui 调试面板（7 个一级分类） | `createDebugPanel`、`DebugActions` |
| `weapon-trail.ts` / `ground-ring.ts` | 刀光 ribbon / 脚下环与进度弧 | `pulse()`、`groundRingRadius` |
| `lab-scene.ts` / `lab-stations.ts` / `lab-panel.ts` | 测试工位（来自拼合结果）+ 地块测试按钮 / 清除测试单位 | `stationAt`、`warpTo`、`spawnAt`、`clearSpawned` |
| `yaw-smooth.ts` / `swing-pose.ts` | 渲染根节点 yaw 低通 / 挥击姿态数据 | `smoothYaw`、`blendCombatPose` |
| `grass-layer.ts` | 草块 InstancedMesh + 脏标记局部上传 + 碎片对象池 + **缓慢生长连续插值** + **枢轴顶点风场**（替换 `<project_vertex>`） | `createGrassLayer`、`installGrassWind`、`grassDebug` |

### 3.3 其余

| 路径 | 说明 |
|---|---|
| `config/game.json` | 所有可调数值（`core.*` 逻辑 / `view.*` 表现 / `scene.*` 关卡；工位 / 草块区域已迁出） |
| `config/plots/*.json` | 一地块一文件（不写世界坐标；`span` 声明占几格，自带地形 / 摆设 / 假人 / 草块） |
| `src/app.ts` | 组装层 + `window.__harness`（所有 `*Debug()` 验收接口在这里暴露） |
| `tests/` | vitest；`tests/helpers.ts` 的 `FIXTURE_CORE_PATCH` 是**冻结夹具**，另用同一套拼合器注入线上配置 |
| `tools/smoke.py` | 线上自检（77 项）；`tools/clip-lab/` 动作验证台；`tools/sweep_sample.py` 扫掠采样；`tools/sever-shot.py` 断肢 / 倒地验收截图（7 张，走 `__harness.hitTest`） |
| `tools/publish-preview.mjs` | **每次任务完成的发布闸门**：build → 发布 `dist/` → 校验资源 → 打印公网链接 |

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
| `npm test` | vitest 全量（122 文件 / 1255 例） | 提交前 |
| `npm run test:affected` | 只跑 import 闭包受影响的用例 | 改单个模块时 |
| `npm run verify:portable` | Core 可移植性（不许 import three / DOM） | 动 `src/core/` 后 |
| `npm run smoke` | 起 `dist/`，跑 77 项画面层 + 契约自检 | 发布前 |
| `npm run verify` | build → test → portable → docs → smoke 全链 | **发布前必跑** |
| `npm run publish:preview` | 发布 `dist/` 到唯一线上地址 + 校验资源 + **打印公网链接** | **每次任务完成必跑**，把链接贴进回复 |
| `python3 tools/check-online.py --wait 180` | 线上产物是否就是本地 `dist/`（JS 文件名 / 大小 / 徽标版本） | **发布后**核验；`ship.sh` 末尾已自动跑一次 |
| `npm run docs:check` | README 行数 / INDEX 链接 / 单文件 300 行 | 改文档后 |
| `node tools/gh-commit.mjs` | REST 提交网关（**默认 dry-run**，`--apply` 才写远端，需自备 token） | 网络受限兜底 / 用户批准后 |
| `node tools/gh-commit.mjs --list` | 只列待提交文件（不联网） | 分工前 |
| `python3.11 tools/push-branch.py` | **协同推送**：走 GitHub MCP 网关推同名功能分支、不动 main（`--dry` 看计划） | **用户通知 push 后**；推完 fetch + diff + reset 对齐 |
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
grassDebug()  草块渲染读数（instances / draw calls / dirty / bent / cut / debris / growing / avgGrowth / sampleHeight / wind.mode=pivot）
plotDebug()   动态地块拼合（地块数 / placement / slot / 拼合中心 / 落点 / diagnostics /
              dummies / rendered / testUnits）；rendered 应 == world.dummies.length
spawnAt(id)   在指定地块就地生成测试单位（先传送到拼合落点），返回数量
clearSpawned() 清除全部测试单位，返回数量
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
| [`systems/idle-stance.md`](systems/idle-stance.md) | 待机斜跨站姿：前脚锁定、三条「不写」、参数与门控 |
| [`systems/pose-entry.md`](systems/pose-entry.md) | 动作进出场：起手接待机、收招交还待机、剑身通道也要淡 |
| [`systems/damage-death.md`](systems/damage-death.md) | 伤害 / 血量 / 死亡 / 重生：三个旋钮、七处跳过、倒→沉→升、**断肢规则表 / 倒杆物理** |
| [`systems/blood.md`](systems/blood.md) | 命中飙血：三层、为什么不用事件队列、调参经验 |
| [`systems/animation-notes-1/2/3/4.md`](systems/animation-notes-1.md) | 按版本追加的动画落地细节（补充，非规范） |
| [`systems/movement-facing.md`](systems/movement-facing.md) | 移动 / 朝向四角 / 分离 / 边界 |
| [`systems/camera-targeting.md`](systems/camera-targeting.md) | 智能相机、软锁定、两级注视 |
| [`systems/presentation-fx.md`](systems/presentation-fx.md) | 特效层级与贴地高度 |
| [`systems/dummies-fighters.md`](systems/dummies-fighters.md) | 9 个假人 / 持械陪练机制 |
| [`systems/input-controls.md`](systems/input-controls.md) | 摇杆、按钮、手势、按键表 |
| [`systems/verification.md`](systems/verification.md) | 自动 / 量化 / 移植验收 |
| [`systems/known-limits.md`](systems/known-limits.md) | 已知限制（现状，不是待办） |
| [`systems/grass.md`](systems/grass.md) | 体素草块：压开 / 割断 / 实例化渲染 / 风吹麦浪 / 性能结论 |
| [`systems/grass-growth-pivot.md`](systems/grass-growth-pivot.md) | v9s.46 缓慢连续生长 + 枢轴顶点动画（每节 box 刚体旋转，实现正本） |
| [`systems/destructibles.md`](systems/destructibles.md) | 可破坏物件：按命中位置斜切、切口朝攻击方向、上半截刚体翻倒、**仙人掌分段 / 碰撞盒 / 多判定轴 / 侧臂几何单一真源（实现正本）** |
| [`systems/posture.md`](systems/posture.md) | 基础体态层：插入点、九个旋钮、三条硬边界（抬胯 / 屈膝 / 前倾预算）、补偿的坐标系 |
| [`systems/pose-layers.md`](systems/pose-layers.md) | 姿态分层：骨架里胸/腰/胯是谁、偏航沿链单调、楔形缺口与髋块、局部 vs 模型空间、脚锁、additive 目标形态（含行业出处） |
| [`systems/sentinel.md`](systems/sentinel.md) | 哨兵机：大块抓型 + 小块点缀、单眼为什么是一条灯带、两处弯路 |
| [`systems/murloc.md`](systems/murloc.md) | 鱼人造型：换几何不换骨架、四个辨识点、两种出场、单只假人血量（实现正本） |
| [`systems/webview-perf.md`](systems/webview-perf.md) | 移动端「隔一段时间卡几秒」：桌面排除法、上下文丢失、质量档与自动降档、`?diag=1` 读数 |
| [`systems/test-scene-policy.md`](systems/test-scene-policy.md) | 单一主测试场景 + 三条规则（规则正本） |
| [`systems/plot-assembly.md`](systems/plot-assembly.md) | 地块拼合：整数格底板 / 自带物件 / 工位传送 / 测试按钮（实现正本） |
| [`systems/voxel-forge.md`](systems/voxel-forge.md) | 造型工坊：JSON spec → 3D 预览 → 导出 TS 片段（只在本地用，不进 dist） |
| [`systems/multi-agent-workflow.md`](systems/multi-agent-workflow.md) | 多 agent 分支、版本号分配、契约先行、冲突分类、合并闸门、**无人值守执行层 §11** |
| [`checklists/manual-acceptance.md`](checklists/manual-acceptance.md) | 108 步手动验收 |
| [`state/CURRENT.md`](state/CURRENT.md) | 当前状态 + 下一步（覆盖写） |
| [`state/MERGE_QUEUE.md`](state/MERGE_QUEUE.md) | 合并闸门失败队列（agent-sync 自动维护，空表即无待办） |
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
| [`decisions/ADR-008`](decisions/ADR-008-grass.md) | 草块状态在 Core、几何在表现层、判定复用 hits |
| [`decisions/ADR-009`](decisions/ADR-009-plot-slabs.md) | 测试场地块化：模数 5m + 整数跨格拼底板（已实现，v9s.49） |
| [`decisions/ADR-010`](decisions/ADR-010-spider-locomotion.md) | 蜘蛛：复用的是解算器不是动画，不引入 FullBodyIK（已实施，v9s.51 造型/步幅/惯性定型） |
| [`journal/`](journal/) | 按日期的迭代记录（47 份，2026-11-05 起；`2026-11-10-11-rig-fix` 是 v9s.65 七条造型修正、`-10-posture-sentinel` 是 v9s.64 体态层；`-00` 是功能总表，`-02` 是 v9s.41 换腿、`-06` 是 v9s.45 慢放、`-08-plot-slabs` 是 v9s.49 底板、`2026-11-10-02` 是 v9s.55 站姿与进出场、`-03` 是 v9s.56 飙血与死亡重生；带 `<主题>` 后缀的按内容命名） |
