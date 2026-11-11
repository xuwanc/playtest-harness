# 本地任务跟踪 / 断点续跑台账

> **用途**：本地任务拆解、进度、断点与恢复指引的唯一落点。与远端发布状态**解耦**。
>
> 最后更新：2026-11-11 15:54（GMT+8）

---

## 0. 恢复 SOP（每次会话开始必读）

1. **第一步读本文件**：看「2. 当前断点」定位到具体文件与代码位置，确认「中断原因」，再看「5. 下一步」。
2. 跑 `npx tsc --noEmit` 确认没有残留半成品编译错误；`git status --short` 确认工作树改动与「6. 改动清单」一致。
3. 先确认「1. 环境约束」是否仍生效（**尤其推送冻结是否已被用户解除**），不要默认沿用上一次的发布权限。
4. 从「5. 下一步」第一条继续，**不要重做已完成项**；每完成一步立即回写「3. 任务拆解」的状态与时间戳。
5. 每次本地任务拆解，先在「3. 任务拆解」**追加条目**（编号 / 任务 / 文件 / 状态 / 验收）再动手。
6. 出现新中断：把旧断点挪进「7. 历史断点日志」，「2. 当前断点」只留最新一条；日志只追加不删。

---

## 1. 环境约束（每次会话先确认）

| 项 | 当前值 |
| --- | --- |
| 仓库路径 | `/workspace/playtest-harness` |
| 本地分支 / HEAD | `feat/afterimage-v9098` / `b14b4be` |
| 本地版本 | `0.9.99`（内部代号 v9s.61，**未发布**）；远端 main 已到 `0.9.100`，本轮须领号顺延 |
| 推送状态 | **已放行（仅本次）**：用户 15:54 明确「最后一次提交 github，注意别的 agent 提交别互相覆盖」。发布完成后立即恢复冻结 |
| **防覆盖约束（本轮最高优先级）** | 另一个 agent 已把 `origin/main` 推到 **`4f5f125`（v0.9.100）**，占用了 `v0.9.99` / `v0.9.100` 两个版本号，并新增了脚掌分段 / ShotCam / combo-rhythm 等大量文件。本轮**必须**基于该真实 main 做三方合并、保留对方全部新增、版本号顺延 `0.9.101`、`dist/` 基于合并结果重建。**禁止**直接 `push-branch.py` 推当前陈旧分支（`2727fce` 基线会把对方新增文件算成删除） |
| 放行前冻结原因（历史） | 上一轮另一个 agent 正在推本项目最后一次 GitHub 改动，避免分支 / `dist/` / PR 编号撞车 |
| 发布通道 | **这是最后一次推 GitHub，后续切到 Gitee** |
| Gitee 迁移待办 | 远端地址 / 凭证 / 分支策略 / 预览（Pages 等价物）待用户确认；`tools/push-branch.py`（走 MCP 网关 + GitHub REST）、`tools/check-online.py`、`docs/systems/verification.md`、`docs/systems/multi-agent-workflow.md` 中的 GitHub 假设需改造。**本轮不实施、不预改**。 |
| 本轮产出 | 全部留在**本机工作树**（`git status --short` 可见），不提交 |

> 判定口径：用户已于 15:54 明确放行**本次**「最后一次提交 github」。该放行**仅限本轮发布闭环**（任务 114~117），完成后立即恢复冻结。后续切到 Gitee 之前，任何写远端的操作都禁止。

---

## 2. 最近一次断点（**已恢复**；当前无未完成断点）

> 当前停靠点不是代码断点，而是「本地全部完成、未发布」，见 §5。下表保留上次中断的位置与原因，供追溯。

| 项 | 内容 |
| --- | --- |
| 中断时间 | 2026-11-11（上一会话，用户主动打断） |
| 中断位置 | `src/presentation/three-scene.ts` —— 给 `SceneView` 补浏览器实证读数时，**只改了接口类型**（`camera.lift`、`afterimageDebug()`），实现未补齐 |
| 中断原因 | 用户主动打断（`Interrupted by user`），**不是**代码缺陷、**不是**工具失败、**不是**网络问题 |
| 遗留后果 | `npx tsc --noEmit` 报 `TS2719`：`diagnostics()` 实现的显式返回类型缺 `lift`（接口已要求）；另接口处误删了原有的 `kickCount` 声明 |
| 本次恢复（已完成） | 补齐 4 处 + 1 处 harness 入口：<br>① `SceneView.diagnostics().camera` 补回 `kickCount: number`；<br>② `diagnostics()` 实现的显式返回类型注解加 `lift: number`；<br>③ `diagnostics()` 返回对象 `camera` 加 `lift: cam.liftLevel()`；<br>④ 新增 `afterimageDebug()` 实现（返回 `{ ghost: elderAfterimage.debug(), rt: rtAfterimage.debug() }`）；<br>⑤ `src/app.ts` 的 `__harness` 加 `afterimageDebug: () => view.afterimageDebug()` |
| 恢复验证 | `npx tsc --noEmit` 退出码 0，无错误输出 |

---

## 3. 任务拆解（本轮 v9s.61 / v0.9.99）

状态标记：`完成` / `进行` / `待做` / `冻结`。

| # | 任务 | 主要文件 | 状态 | 验收口径 |
| --- | --- | --- | --- | --- |
| 105 | 清理合并冲突、建立干净基线 | `docs/state/CURRENT.md` 等 | 完成 | `b14b4be`，`git ls-files -u` 为 0，工作树 clean |
| 106 | 需求 1：ghost 残影跟随当前动画 / 武器姿态 | `effects/ghost-afterimage.ts`、`tests/v9s56` | 完成 | 全树 `nodes` 每帧回写 `position/quaternion/scale/visible`（含中间 pivot `Group`）；`signatureOf()` 检测结构变化重建；单测覆盖 pivot 旋转 + 武器 `visible` 切换 |
| 107 | 需求 2：RT 正确显示模式 + 墙后不透视 | `effects/rt-afterimage.ts`、`effects/shared.ts`、`three-scene.ts`、`tests/v9s57` | 完成 | accum 只衰减覆盖度、rgb 保本色；compose 不再减当前帧、补线性→sRGB；`EffectContext.occluders` 射线门控 + `debug().occlusion`；`boxGroup` 墙体接入 |
| 108 | 需求 3：竖屏转台可见 + 主场景相机下移 + 转台正常大小 | `style.css`、`camera-rig.ts`、`three-scene.ts`、`wardrobe.ts`、`wardrobe-model.ts`、`app.ts`、`tests/v9s60`、`tests/v9s61` | 完成 | 竖屏舞台保底高度、侧栏可滚；`setLift()` 平滑 + `setWardrobeLift()` 桥接 open/close；`wardrobeFraming()` 回退正常大小居中 |
| 109 | 全量验证 + 文档 + 构建 + **发布** | 多文件 | **冻结**（验证/文档/构建已完成，发布按第 1 节暂停） | 见「4. 验证记录」 |
| 110 | 断点恢复：实证读数接线 | `three-scene.ts`、`app.ts` | 完成 | `tsc` 通过；`__harness.afterimageDebug()` / `diagnostics().camera.lift` 可读 |
| 111 | 浏览器实证：横竖屏 / RT / ghost 观感与读数 | `/tmp/probe_v9s61.py`、`/tmp/probe_rt_v9s61.py` | 完成 | 结论见「4. 验证记录」；ghost 姿态跟随由 v9s56 单测覆盖，浏览器侧未做逐帧对比 |
| 112 | 实证结论回写文档 + 同步任务清单 | 本文件、`docs/state/CURRENT.md`、`docs/INDEX.md` | 完成 | 台账已登记进 INDEX「三条阅读路径」与「文档清单」；CURRENT 头部加恢复指针 |
| 113 | 发布通道切换 Gitee（**需用户放行**） | 发布脚本 / 文档 | 冻结 | 见第 1 节迁移待办 |
| 114 | **最后一次 GitHub 发布：侦察远端 + 固化本地工作** | — | 进行 | fetch 到真实 main `4f5f125`；确认对方占用 0.9.99/0.9.100；把本地 26 个工作树改动 commit 固化，不丢任何改动 |
| 115 | 基于真实 main 三方合并，保留双方改动 | `config/game.json`、`src/core/types.ts`、`three-scene.ts`、文档、`dist/` | 待做 | 新建分支基于 `origin/main`，merge 我的分支；冲突手工解，**对方新增文件一个都不能删**；用 `git diff --name-status origin/main..HEAD` 验证无意外 `D` |
| 116 | 合并结果全量验证 + 交给闸门发布 | `tools/agent-sync.py` | 待做 | 合并结果上 tsc / vitest / build / docs:check / smoke 全过；工作区干净后跑 `finish`（领号 0.9.101 + 推分支 + PR 乐观锁合并 + Pages） |
| 117 | 线上核验 + 台账回写 + 恢复冻结 | `tools/check-online.py`、本文件 | 待做 | 线上 JS 与本地一致、徽标 `v0.9.101`；台账标记完成并写明「此后不再推 GitHub」 |

---

## 4. 验证记录（本轮已跑）

| 命令 | 结果 | 备注 |
| --- | --- | --- |
| `npx tsc --noEmit` | 通过 | 断点恢复后复跑，退出码 0 |
| `npx vitest run` | **1330 例全过** | 含新增 `tests/v9s61-camera-lift.test.ts` 与 v9s56 / v9s57 / v9s59 / v9s60 补充断言 |
| `npm run build` | 通过（复跑 2 次） | 最终 bundle `main-CH83XIWA.js` / `main-xLgSlHRu.css`；旧 `main-Bky9uo5C.js` / `main-C0H8ghwn.css` 在 git 中显示为删除 |
| `npm run verify:portable` | 通过 | Core 边界未破 |
| `node scripts/check-facts.mjs --fix` + `npm run docs:check` | 通过 | 版本 `0.9.99`、测试数已回写 |
| `npm run smoke` | 3 轮中每轮偶发失败项各不相同，复跑 **77/77 全过** | 无头软件渲染约 12fps 的时序抖动；失败项落在 core 步态 / 可破坏物 / 技能指示器，**均非本轮改动范围**，判断为偶发、与本轮无关 |
| `npx vitest run`（最终复跑） | **130 文件 / 1330 例全过** | 补完 harness 读数与台账后复跑，无回归 |
| `npm run docs:check`（加台账后） | PASS，111 份文档 | 新增台账触发「文档份数 110→111」，`check-facts --fix` 回写真值后通过 |
| 浏览器实证 `probe_v9s61.py`（横竖屏） | 通过 | 横屏 OPEN `240×256`；竖屏 480×900 OPEN `478×234`、800×1280 OPEN `798×240`（**修复前均为 `478×0` / `798×0`、canvas 高 1**）。`camera.lift`：CLOSED `0` → OPEN `0.994~0.996` → RE-CLOSED `0.0002~0.002`（平滑回位）。`framing.distance` 3.37~3.45（正常大小，旧版拉远到 4.0~4.7）。版本 `v0.9.99`、`errors []`。截图 `/tmp/v9s61_port_480x900_open.png` 人工复核：转台角色完整可见、大小正常，主场景角色在上半区未被抽屉遮挡 |
| 浏览器实证 `probe_rt_v9s61.py`（RT 非黑 + 遮挡） | 通过 | **非黑**：开/关差分 `on_vs_off_signed +8.34`，diff 区域 on 均值 RGB `[44.7,56.0,65.7]` vs off `[38.3,47.9,55.2]`，`pixels_gt8` 251960，过曝 1342px（0.13%）→ 有本色、不发黑、不过曝。**遮挡门控**：无遮挡 `occlusion=1 / active=1 / passes=3`；把场景遮挡 mesh 放大到角色位置后 `occlusion=0 / active=0 / passes=0 / pixels=0` → 整套停跑、不画透视拖影。`errors []` |

> 注意 1：`occlusion` 是 `lastOcclusion`，语义为**最近一次活跃帧**的可见度。角色静止 → 能量衰减到阈值后走「停跑」提前 return，读数保留上次值（探针里恢复遮挡物后仍读到 0 属此情况）；功能无影响，因为停跑时本来就不画拖影，再次移动会重算。
>
> 注意 2：ghost 残影「跟随当前动画 / 武器姿态」由 `tests/v9s56` 新增断言（改中间 pivot `Group.rotation`、切武器 `visible`）直接覆盖，浏览器侧**未做逐帧姿态对比**，如需补可做「elder 挥刀 + 连拍」实证。
>
> 注意 3：浏览器侧 FPS 约 12.6 是**软件渲染**读数，**不能**当作真实 GPU 性能结论；只用来确认观感与布局。

---

## 5. 当前停靠点：本地全部完成，主动停在「未发布」

本轮本地任务（105~112）**已全部完成并验证**；按第 1 节冻结要求**主动停止**，没有再往下走发布链路。

| | 内容 |
| --- | --- |
| 已完成 | 三条需求修复 + 断点恢复 + 全量验证（1330 单测 / tsc / build / docs:check / smoke / 浏览器横竖屏与 RT 实证）+ 台账与文档回写 |
| **刻意未做** | `git commit` / `git push` / 建 PR / merge / Pages 刷新 —— **一项都没做**；HEAD 仍是 `b14b4be`，改动全在工作树 |
| 停止原因 | 另一个 agent 正在推本项目最后一次 GitHub 改动，防止撞车；用户明确「暂不推送」 |

**下次会话从这里接**：

1. 先读 §0 恢复 SOP 与 §2 当前断点，并**重新确认第 1 节推送冻结是否已被用户解除**（不要默认沿用本轮结论）。
2. 若仍冻结 → 只做用户新交代的本地任务，继续不推送；每步回写「3. 任务拆解」。
3. 若已放行且已切 Gitee → 按第 1 节「Gitee 迁移待办」改造发布链路（脚本 / 文档里的 GitHub 假设清理），再决定如何交接本轮工作树改动。
4. 可选补课：ghost 逐帧姿态连拍实证（见「4. 验证记录」注意 2）。

---

## 6. 本轮工作树改动清单（未提交，`git status --short` 口径）

**核心实现**
- `src/presentation/effects/ghost-afterimage.ts`（全树姿态同步重写）
- `src/presentation/effects/rt-afterimage.ts`（shader 正确显示模式 + 遮挡门控重写）
- `src/presentation/effects/shared.ts`（`EffectContext.occluders` / `AfterimageDebug.occlusion`）
- `src/presentation/three-scene.ts`（`occluders` 接线、`setWardrobeLift`、`afterimageDebug`、`camera.lift` 读数）
- `src/presentation/camera-rig.ts`（`setLift()` / `liftLevel()` 平滑）
- `src/presentation/wardrobe.ts`（`onOpenChange`、取景回退）
- `src/presentation/wardrobe-model.ts`（`wardrobeFraming()` 正常大小）
- `src/app.ts`（`onOpenChange` 桥接 + harness 读数入口）
- `src/style.css`（竖屏舞台保底高度）

**测试**
- `tests/v9s56-elder-afterimage.test.ts`、`tests/v9s57-rt-afterimage.test.ts`、`tests/v9s60-wardrobe-framing.test.ts`（改写/补充）
- `tests/v9s61-camera-lift.test.ts`（新增）

**配置 / 文档 / 产物**
- `package.json`（`0.9.98` → `0.9.99`）
- `docs/state/CURRENT.md`、`docs/systems/wardrobe.md`、`docs/systems/verification.md`、`docs/systems/known-limits.md`、`docs/INDEX.md`、`README.md`
- `dist/index.html` + 新 bundle；旧 `dist/assets/main-Bky9uo5C.js`、`main-C0H8ghwn.css` 显示为删除

---

## 7. 历史断点日志（只追加，不删）

| 时间 | 中断位置 | 中断原因 | 处理结果 |
| --- | --- | --- | --- |
| 2026-11-11 14:31 | `src/presentation/three-scene.ts` 实证读数接线（接口改完、实现未补） | 用户主动打断 | 2026-11-11 14:39 本次会话补齐 4 处 + harness 入口，`tsc` 恢复通过；详见「2. 当前断点」 |
