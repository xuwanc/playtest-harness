# 验收：自动 / 量化 / 移植

> 正文写于 v9s.38（2026-11-08）；表格里的文件数 / 用例数 / smoke 项数于 2026-11-10
> 由 `npm run docs:facts:fix` 现场采集同步，**不要再手写**，`npm run verify` 会校验。
> 一条命令：`npm run verify`（build → 全量单测 → `verify:portable` → `smoke`，任一失败即停）。
> 手动步骤见 [`../checklists/manual-acceptance.md`](../checklists/manual-acceptance.md)。

## A. 自动验收（退出码必须为 0）

> **一条命令**：`npm run verify` —— 依次 `build` → 全量单测 → `verify:portable` → `smoke`，任一失败即停。分散跑时漏一条就少一层保障。

| 命令 | 验证什么 | 期望 |
|---|---|---|
| `npm run build` | TypeScript strict 全量类型检查 + Vite 生产构建 | `tsc --noEmit` 无 error，产出 `dist/` |
| `npm test` | 全量单测 | **128 文件 / 1312 例全绿** |
| `npm run test:affected` | 按 `git diff` 的 import 闭包只跑相关用例（v9s.33） | 输出命中数 / 总数，必要时自动退回全量 |
| `npm run verify:portable` | Core 在纯 Node 无头跑 600 步 + 边界守卫（**31 个文件**） | `[boundary] PASS` |
| `npm run smoke` | 真实浏览器跑 `dist/`：77 项画面层 + 契约断言 | **77/77**，退出码 0 |
| `npm run docs:check` | 文档规范：README 行数 / INDEX 链接 / 单文件 300 行 | 0 error |

覆盖范围（细节在各系统文档，不在这里堆用例名）：

| 域 | 代表行为 | 对应文档 |
|---|---|---|
| Core 契约 | 600 步确定性快照、复位、模块开关、World JSON 往返 | [`core-contract.md`](core-contract.md) |
| 移动 / 朝向 | 零滑步、停步收相、四角分离、±π 接缝、原地转身 | [`movement-facing.md`](movement-facing.md) |
| 战斗 / 命中 | 连击窗口、按住自动连击、三种受击、大剑击退、`noDamageToPlayer` A/B | [`combat.md`](combat.md) |
| 动画 / IK | 步态投影、攻击下盘权重、落地缓冲、受击分层、两骨 IK、挥击剪辑九段 | [`animation.md`](animation.md) |
| 假人 / 陪练 | 9 个单位装配、点击轮转、武器时序、陪练距离、玩家↔陪练互相命中 | [`dummies-fighters.md`](dummies-fighters.md) |
| 特效层级 | `groundHeightAt` 三例、`FX_ORDER` 单调 | [`presentation-fx.md`](presentation-fx.md) |
| 输入 / 相机 | 捏合缩放、手势判定、屏幕坐标、威胁构图 | [`input-controls.md`](input-controls.md) · [`camera-targeting.md`](camera-targeting.md) |

> 逻辑有意改动时用 `npx vitest run -u` 更新 `tests/__snapshots__/determinism.test.ts.snap`，**更新后再跑一次**确认不再漂移。这份快照是跨语言对照的黄金基线。

## C. 可量化检查项

| 项目 | 目标值 | 测量方式 |
|---|---|---|
| 逻辑步长 | 恒定 60 Hz（0.01667s） | HUD `steps`；`npm test` |
| 桌面帧率 | ≥ 55 FPS（真实 GPU；软件渲染 / Xvfb 约 15~30 FPS 不作判定依据） | HUD `fps` |
| **摇杆满推行程 / 死区** | **56 px / 0.08** | `view.joystick`；浏览器实测 56px 时 `stick = (0,-1)` |
| 点击判定阈值 | 位移 < 8px 才算 tap | `adapters/input.ts`；手动第 31 步 |
| 按钮区隔离 | UI 容器含间隙 `stick` 恒 `(0,0)`、不产生 tap | `data-ui-region` + `uiPointers`；手动第 23/24 步 |
| 自动爬台阶阈值 | 0.45 | `core.stepHeight` |
| **支撑脚滑移（零滑步）** | ≤ 1e-6 m/帧（0.6–4.8 m/s） | `tests/gait-pose.test.ts` 逐帧采样「脚世界坐标」；冲刺段放宽到 <30mm/帧 |
| **脚前伸 / 步幅比** | 0.25（= 步幅/4，解析零滑步条件） | `view.gait.reachRatio`；调试面板「脚前伸 / 步幅比」 |
| **捏合确认阈值** | 18 px | `adapters/input.ts` `PINCH_ARM_PX`；手动第 88 步 |
| 角色半径 / 身高 | 0.30 / 1.20 | `core.characterRadius / characterHeight` |
| 宽 / 窄门洞 | 2.4m 可通 / 0.5m 不可通 | `scene.doorways` |
| 连击窗口 / 段间停顿 | 0.65 s / 0.16 s（settle 期间位移变化 = 0） | `core.combat.*`；`npm test` |
| 攻击时移动比例 | 0（位移严格 = lunge） | `core.combat.attackMoveScale` |
| **按住自动连击** | **开启后 2.3s（软件渲染）≥ 3 次起手，序列 1→2→3→1** | `core.combat.autoCombo`；浏览器实测 |
| **目标辅助** | **范围 7m / 前方扇区 ±90° / 理想距离 1.35m / 前冲最大 ×1.6** | `core.targeting.*`；浏览器实测 `attackFacing == targetYaw` |
| **命中扇区 / 武器距离** | **±65°；剑盾 1.6 / 双剑 1.5 / 大剑 2.0 / 法杖 2.6 / 弓 9 m** | `core.hits.*`；`npm test` |
| **受击时长** | **light 0.20 / heavy 0.32 / knock 0.42 s** | `core.hits.hurt*` |
| **大剑击退** | **0.75 m，命中后敌人距离 ≥ 1.35 m** | `core.hits.knockback.greatsword`；浏览器实测 0.7 → 1.48m |
| **角色最小间距** | **玩家↔假人 ≥ 0.60 m，假人↔假人 ≥ 0.60 m；玩家位置永不被改** | `core.separation`；浏览器实测 `[0.601, 0.602, 0.861, 0.902]` |
| **分离迭代 / slop** | **3 轮 / 0.002 m** | `core.separation.*` |
| **v6a 特效 / 武器朝向** | **`slashNormal=[0,0.766,0.643]`；`arrowForward.y≈0`；启停倾斜符号相反；绕圈 `side≈-0.121`** | `SceneView.diagnostics()`；浏览器实测 |
| **翻滚位移 / 时长 / 冷却** | **3.2 m（实测 3.200m）/ 0.36 s / 0.7 s** | `core.dash.*`；`npm test` + 浏览器实测 |
| **翻滚动画** | **前滚 360°（`rollAngle` 峰值 ≈ 6.28 rad），绕身体中心不插地** | `diagnostics().dash.rollAngle` |
| **闪现位移 / 落点一致性** | **5 m 上限（实测 5.000m），撞墙停在墙前；`toX/toZ == position.x/z`** | `core/dash.ts`；`npm test` + 浏览器实测 |
| **冲刺特效** | **翻滚 1 个尘环 / 闪现 2 个光环** | `diagnostics().dash.activeRings / lastKind` |
| **智能相机：无威胁推进** | **`distanceScale = 0.88`（实测 0.881）、threat=0、off=0、pitch=0** | `core.camera.pushIn`；`diagnostics().camera` |
| **智能相机：威胁拉远 / 平移 / 俯仰** | **4 个近身攻击假人 → threat=0.653、×1.205、off(1.03, 0)、pitch +4.57°** | `core.camera.*`；浏览器实测，玩家屏幕 Δx=-48px |
| **智能相机：平滑 / 可插拔** | **smoothing 3.2；关闭模块后 dist 回到 ×1.00（实测 1.0005）** | `view.smartCamera.smoothing`；浏览器实测 |
| 假人攻击伤害 | 恒为 0（`character` 逐字节不变） | HUD `atkCount` 增长而 `pos/vel` 不变；`npm test` |
| 确定性 | 同输入 600 步快照逐字节一致 | `npm test`；golden snapshot |
| **v8c/v8d 攻击下半身权重** | **`gaitWeight=1` / `lowerBodyWeight=0` / `blendRate=14`；攻击稳定态 `attackBlend=1`、`driveSpeed=2.40`、`gaitScale=1`、腿俯仰峰值 >0.08 rad；两个权重都关时稳定态腿姿态精确为 0** | `view.animation.attack`；`diagnostics().attackWeights`；`tests/attack-lower-body.test.ts` |
| **v8d 挥击跨步** | **`strideSpeed=2.4` / `forwardBias=0.72` / `cycles=1` / `stepPitch=0.55` / `stepKnee=0.5`；`attackStridePose` 在 progress=0/1 恒为 0，连击奇偶领先腿左右互换，逐帧变化 <0.02 rad** | `view.animation.stride`；`tests/program-anim.test.ts` |
| **v9s.32 持械姿态 / 空挥反馈** | **五把武器各有 `stance`；待机 `stanceDebug().weight→1`，右臂 pitch 等于配置值；换武器首帧权重 <0.2、30 帧后为 1；大剑 `armSwing 0.45 < 双剑 1.0`；空挥 `camera.shake=0` 且 `trail.pulse>0`，命中 `shake>0`** | `view.animation.stance`；`view.weaponTrail.pulseDecay`；`__harness.stanceDebug / trailDebug`；`tests/v9s32-stance.test.ts / v9s32-trail-pulse.test.ts` |
| **v8c 落地蓄力缓冲** | **时长 0.34s / 下压段 0.18 / 重心下沉 0.13m / 屈膝 0.62rad / 最小强度 0.45；结束后 `landing.pulse=0` 且姿态无残留** | `view.animation.landing`；`diagnostics().landing`；`tests/landing-buffer.test.ts` |
| **v8e 相机缩放** | **`min=0.45 / max=2.4 / smoothing=12 / pinchGain=1 / maxStepRatio=1.25 / wheelStep=1.12 / keyStep=1.12`；`setZoom(2)` 后相机到焦点距离精确 ×2（±0.0001）、`smart().zoom=2`；两指从 100px 张到 225px 再捏回，倍率精确回 1** | `view.zoom`；`diagnostics().camera.zoom`；`tests/pinch.test.ts` / `tests/input-pinch.test.ts` |
| **v8f 分层受击** | **`enabled=true / forceHitHeight=-1 / pulseRatio=0.16 / comShift=0.06 / lowerScale=0.45`；`comShift < upperShift` 且比值 <0.5（light / heavy / knock 全成立）；`hitHeight{light:0.2, heavy:0.6, knock:0.9}`；`abdomen.knee=0.9 > shoulder.knee=0.42`；躯干世界高度仍精确 `legLen+bodyH/2`；`upper.position.y` 恒 0** | `view.hurt`；`diagnostics().hurt`；`tests/hurt-pose.test.ts` / `tests/hurt-rig.test.ts` |
| **v8g 两骨 IK** | **`enabled=true / weight=0.9 / attackScale=0.65 / maxCorrectionDeg=70`；FK→IK 往返角度误差 <1e-5 rad（含 roll≠0 与膝/肘两种弯曲方向）；额外骨盆位移为 0 时 IK 解 = 原 FK 角度；受击钉地残差 `maxError < 0.02m`，关闭 IK 时偏差 >0.02m；空中 `active=false`；移动时髋角摆幅 ≥ 关闭时的 0.6 倍** | `view.ik`；`diagnostics().ik`；`tests/ik.test.ts` / `tests/ik-rig.test.ts` |
| **v8g 大剑 / 肘 / 惯性** | **`upperShiftScale=0.45 / maxUpperShift=0.1m`（knock 位移 ≤0.1m，A/B 关闭后 >0.2m）；`stepReach=0.12 / stepSideReach=0.09 / stepDipReach=0.035 / heavyScale=0.7`（大剑骨盆 z <0.13m）；全部肘角 <0 且局部前臂末端 z>0；`pelvisTiltGain=0.35 / pelvisShift=0.018 / moveCrouch=0.035`，盆骨倾角 < 上身的 0.6 倍、下沉 A/B 差值 ≈0.035m 且帧间跳变 <0.01m** | `view.hurt / view.animation.stride / view.lean`；`tests/v8g-poses.test.ts` |
| **v9a 派生招窗口 / 共享 CD** | `windows {roll 0.3 / blink 0.55 / sprint 0.5}s`、`sharedCooldown 0.85s`；一个窗口只触发一次，触发后 `dash.cooldown ≥ 0.85s − dt`，CD 内不能再翻滚 | `core.links.*`；`tests/links.test.ts`；HUD `link ...` |
| **v9a 索敌 / 冲锋 / 命中** | `travel = clamp(dist − stopDistance, 0, distance)` 起手快照后全程不变；active 位移收敛误差 <0.05m、不越 ±13.5；线段扫掠命中路径中点（一帧 3m 不漏），每目标只结算一次；不做背后索敌 / 背后命中 | `core.links / core.hits`；`tests/links.test.ts` |
| **v9a 对称机制** | `noDamageToPlayer=true` 时假人打玩家 `playerHurt.knockX/Z` 恒 0；关闭后 `|knockZ| = knockback × decay`（与假人同公式）；玩家与每个假人的 `LinkState` 结构完全一致、可 JSON 往返 | `core.hits`；`tests/links.test.ts` |
| 世界边界 | ±13.5，玩家与假人都不越界、无 NaN | `npm test` |

## D. 移植验收（P3：证明「核心真的可移植」）

1. `npm run verify:portable` 通过 → Core 在**无 DOM、无 WebGL、无 Vite** 的纯 Node 里跑完 600 步。
2. `scripts/check-boundary.mjs` 通过 → Core 目录（**31 个文件**，v9a 新增 `links.ts`）内不存在 `three` / `lil-gui` / DOM 全局 / `Math.random` / 外部时间源 / `class` / `enum` / 上层相对依赖。
3. 对照下方《Core 契约规格表》，在 Unity / Godot 里逐函数重写；把同一串 `Intents` 序列喂进去，比对状态哈希与 `tests/__snapshots__` 的黄金基线。
4. `config/game.json` 的 `core`（含 `orientation / combat / targeting / hits / separation / dash / dummies`）段可直接导成 ScriptableObject / Resource，数值 100% 复用。

---
