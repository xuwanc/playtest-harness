# 2026-11-09-07 · 完好态渲染定位修复 + 无人值守 git 协同

用户两条反馈：①「砍到之前看不到物体，中央 8 相区有一个杆子」；
②「另外一个 agent 已经把你上次提交合并到主干，碰到的问题做了补充，
看看如何在不需要我参与的情况下合理安排 git 管理」。

## 1. 中央 8 向区那根杆子从哪来

`createDestructibleLayer()` 为每个物件建了 `root` 组，局部几何按「底面 y=0、
轴心 x=z=0」生成，但**从未给 root 写世界坐标**。拼合器算出的绝对坐标
（`(-4.5, 14)` 附近）只存在于 `world.destructibles` 里，渲染层完全没用。
于是 5 件（3 杆 + 2 罐）全叠在世界原点 —— 原点正是「中央 8 向」罗盘区，
看起来就是「中央有一根杆子」，而真正的地块空无一物。

第二个同源错误：`upperGroup.position` 用了**绝对坐标**，但它又是 root 的子节点。
断后上半截会飞到物件坐标、下半截留在原点，两截分家。

修复（`src/presentation/destructible-layer.ts`）：

- `root.position.set(st.x, st.y, st.z)`，创建和每帧 update 都写；
- `upperGroup.position.set(0, st.cutU * st.height, 0)` 改成**局部**切面偏移；
- `DestructibleDebug.positions` 暴露渲染根节点坐标，smoke 新增断言
  「画在哪里 = Core 状态」+「没有任何物件叠在原点」。

浏览器实测：修复前中央罗盘中心一根棕杆穿过玩家；修复后中央干净，
传送到地块能看到 3 根棕杆 + 蓝 / 红罐，断后两截在同一位置。
完好态本来就画了完整柱体（`cutU=1, n=up`），问题**纯粹是位置**，不是没生成几何。

## 2. 主干已前进，本地功能分支没进去

核实远端：`origin/main` 已到 `b1f3370`（v0.9.67），但
`src/core/destructibles.ts` 在 main 上不存在 —— 另一个 agent 合并的是
**更早推送的草地 / 地块分支**（`fee5b8d`），我上一轮的可破坏物件提交
`5b0d5d5` 一直在本地没推。它同时补了协作规范 v2：§0 领号、§9 单通道发布、
§10 合并闸门、`push-branch.py` 的 main 护栏、`publish-preview.mjs` 收敛。

按新规范重放：

- 新建 `feat/destructibles-cut` 基于 `origin/main`，`merge --no-ff` 本地两个提交；
- 5 处冲突按 §6 解：`dist/index.html` / golden / `CURRENT.md` / `package.json`
  取主干侧并重生成，`docs/INDEX.md` 与 `tools/smoke.py` 取并集；
- 去掉撞号：功能代号 `v9s.45 → v9s.x`（另一个 agent 的 v9s.45 是慢放修复），
  地块 id `v9s45-destructibles → x-destructibles`。`x-` 仍排在
  `sparring-demo` 之后，**两个 auto 地块的槽位没变**，golden 未漂移；
- 合并结果 100 文件 / 997 例全绿、smoke 49/49。

## 3. 为什么之前「必须用户参与」，以及怎么补上

v2 规范还留着两个由人触发的缺口：

1. 三处写着「push / `--apply` 需用户明确通知」—— 每次推送都要问一次；
2. §10 定义了合并闸门，却没定义谁执行；`push-branch.py` 又硬护栏拒绝写 main，
   于是「功能分支并入主干」只能靠某个 agent 手工做。

补齐（`tools/agent-sync.py` + 规范 §11 + `AGENTS.md`）：

| 缺口 | 补法 |
|---|---|
| 逐次批准 | 一次性授权写进 AGENTS.md：谁 `finish` 谁当 integrator，规则代替请示 |
| 分支撞车 | 分支名带 agent 后缀；`push-branch.py` 加「远端同名分支被别人推进就拒绝覆盖」 |
| 合并无人执行 | `create_pull_request` + `merge_pull_request(merge, expectedHeadSha)`；main 的写入只由 GitHub 端完成，天然带冲突检测 / 乐观锁 / 可整体 revert |
| 版本号协商 | 闸门读 `origin/main:package.json` 再 +1、内部代号从 CURRENT.md 单独 +1，天然单调，两个 agent 不需要说话 |
| 共享工作区互踩 | 收尾只 `git branch -f main origin/main` 更新引用，**不切工作区** |
| 失败静默 | 写 `docs/state/MERGE_QUEUE.md`，`status` 可见，`--pr-number` 断点续跑；接手也是 agent，不是用户 |

硬护栏没放松：只写 `feat/*` / `fix/*`、合并前必须在合并结果上跑 `npm run verify`、
发布永远只有 `publish:preview` 一条通道一条链接。

## 4. 验证

- `tsc` 0 error；100 文件 / 997 例；golden `e6028d21…`（契约变更后重生成）；
- `npm run smoke` 49/49（新增「完好态画在地块坐标」一项）；
- 浏览器三张截图：中央无杆 / 地块 3 杆 2 罐完好可见 / 断后两截同位置；
- `npm run docs:check` PASS。
