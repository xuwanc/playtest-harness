# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-10 10:42。

## 一句话

v0.9.81：**死亡拆成两段 —— 断哪由最后一击定，怎么倒由物理算**。
① **断肢**：`decideSever(type, u, dx, dz, bodyYaw, weapon)` 是 Core 纯函数（无随机），
判据是「受击类型 × 命中高度 `u` × 攻击方向在身体左右哪一侧 × 大剑 +0.06 刃长」；
轻击只在手臂高度断（一刀掉头不合理），重击三档，击飞 / 击地再狠一档。
表现层把对应骨架节点 `clone` 出来扔进世界坐标做自由落体，原节点隐藏。
② **倒下是倒杆不是插值**：`θ'' = g·sinθ − d·θ'`，绕「垂直于来击方向」的水平轴转
（从侧面砍就往侧面倒），触地反弹、`|θ'| < restVel` 后 `settled`，物理彻底关掉。
③ **可破坏物三修**：仙人掌重做（6 段收腰 + 硬色分段 + 侧臂「水平 → 上扬 → 圆头」）、
「砍不到」（一条主干拆多条判定轴 + 去掉 `break` + 闸门晚一帧）、
「直接穿过去」（`dest-*` AABB 进 `world.boxes`，断一段路矮一段）；
工位合并成 9 件、散开到 ±2.15，不再挤在圆心。

上一版的死亡体感仍在：血跟骨骼部位 / 尸体挡路 / 头顶血条。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.81`（内部代号 v9s.60） |
| 线上徽标 | `v0.9.81`（构建时间随发布变化） |
| 发布方式 | `npm run ship`（构建 → 推 main → 重建 `preview` 产物；带凭证自恢复与推送重试） |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— 此链接固定不变 |
| 蜘蛛开局 | <https://xuwanc.github.io/playtest-harness/?hero=spider> |
| 老人开局 | <https://xuwanc.github.io/playtest-harness/?hero=elder> |
| 沙盒隧道 | 仅本地临时调试用，按 runtimeId 定址、每次重建都变，**不作为对外链接** |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 111 文件 / 1115 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS |
| `npm run docs:check` | PASS（93 份文档 ≤300 行，README 99 行） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |
| `python3 tools/check-online.py --wait 180` | 发布后核验线上 JS 与本地 `dist` 同一份 |
| `python3 tools/blood-shot.py` | 10 张：命中 3 帧 / 落地 / 倒下 / 沉没 / 升起 |
| `python3 tools/sever-shot.py` | 7 张：断臂 / 断头 / 腰斩 / 断腿 / 倒下中 / 躺平 |

## 正在做

- 无。v9s.60（v0.9.81）已合并发布。

## 伤害 / 死亡的关键数（改之前先读）

| 参数 | 值 | 为什么 |
|---|---|---|
| `dummies.health` | `0` | **普通假人打不死**：它们是测试桩，死了会让工位失效 |
| `dummies.fighters.health` | `120` | 剑盾 9 刀、双刀 13 刀、大剑 4 刀 |
| `hits.damage` | light 12 / heavy 18 / knock 26 | 按**受击类型**查表，不按武器 —— 类型已按「武器 × 段数」定过档 |
| `hits.damageMul` | 剑盾 1.0 / 双刀 0.7 / 大剑 1.4 | 重量差从数字上读得出来 |
| `fighters.respawnSec` | 3.5s | 原地满血，不回 home |
| `REVIVE_GUARD` | 0.45s | 与起身 `riseSec` 同长；没有它，站在尸体上连打会秒掉刚刷出来的人 |
| `HIT_MARK_CAP` | 24 | 命中记录环形；进快照，所以 golden hash 变过一次 |
| 血珠 / 血雾 / 血迹 | 13 滴 0.46s / 1 团 0.15s / ~8 块 6.5s | 三层缺一层就读不出血 |

细节：[`../systems/damage-death.md`](../systems/damage-death.md)、[`../systems/blood.md`](../systems/blood.md)。

## 下一步

1. **残肢只是表演**：断块不进 `world.boxes`，会穿地穿人；要「踩到断头会滑」得给残块加低矮碰撞。
2. **腰斩高度写死**：`waist` 一律在 `u` 处断开，不看骨架的盆骨位置；驼背体型会偏。
3. **蜘蛛骨架没有断肢**：`SEVER_NODE` 只覆盖人形两条骨架，蜘蛛打死了仍是整只倒下。
4. **仙人掌侧臂没有碰撞**：AABB 只按主干 `radius` 建，贴着侧臂走过去能穿。
5. **血迹不分材质**：台阶侧面也会贴一块平的（`groundY` 取脚下支撑面）。
6. **尸体是「滑开」不是「顶住」**：圆形碰撞会沿切线滑过去；要推不动的阻力感，得再加一档 `crowdResistance`。
7. **转身期间站姿权重为 0**：转完再升回来，中间 0.15s「并腿」过渡。
8. **剑盾段间仍是连续承接**：换段跳变靠 `segBlend`（0.08s）掩；三段节奏同质，应做成逐段递减。
9. **`config/game.json` 拆分**：`core.gait` / `core.combat` / `view.*` 仍未拆。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮变化：

- **断肢判定不能有随机**：`decideSever` 进 determinism golden；写 `Math.random()`
  会让同一次击杀在不同次运行断不同处，快照直接炸。判据必须是纯函数。
- **`world.boxes` 是共享引用**：移动 / 相机 / 贴地特效都拿着同一个数组读。
  `destructiblesUpdate` 只能**原地改** `box.maxY`，`filter` 重建数组会让它们读到上一帧的旧对象。
- **残块要先 `updateMatrixWorld`**：`matrix.copy(node.matrixWorld)` 拿的是上一帧的矩阵，
  没更新就 `decompose`，残块会从原点飞出去（实测：飞出画面外）。
- **闸门晚一帧是刻意的**：`meleeGatePrev` 只放行一个 tick（表现层 `render` 采样、
  `step` 下一帧消费）。要动 `hitSweep` / 帧序，必须同时看这条。
- **地块 `span` 会挤占槽位**：`x-destructibles` 从 `[2,2]` 改 `[3,3]` 会把别的工位推到
  假人测试位置，smoke 的踱步 / 命中三项直接挂（本轮踩过一次）。

上一轮（死亡体感）仍有效：

- **木桩喷血是个陷阱**：`maxHp = 0` 的单位必须跳过 `pushHitMark`（否则砍测试桩也出血）。
  但**不能**因此提前 `return` —— 那会把卡肉也一起跳过。判断要包在 `if` 里，不是守卫语句。
- **死亡要跳过的系统有七处**：命中结算 / 近战·击地·派生扫描 / AI / 索敌 / 注视 / 分离 / 脚下环。
  新增任何「按 dummies 遍历」的模块，都要问一句「尸体该不该算」。
- **`hitMarks` 进快照**：改记录结构或容量会让 `determinism` golden 漂移；
  确认是结构差异而不是行为差异的方法：把新字段剔除后重算 hash，应等于旧值。
- **血的颜色会和衣服撞**：红衣陪练 + 红血 = 看不见。验收换紫衣大剑陪练。
- **金快照（golden hash）本批变了两次**：`health.sever` 与 `world.meleeGatePrev` 都是新字段。
  两次都用「剔除后重算 hash == 旧值」确认过是结构差异，再 `vitest -u`。

上一轮遗留，仍有效：

- **斜跨会污染静态对照用例**：新增同类用例要用 `GAIT_NO_IDLE`。
- **剑身通道漏乘 `poseW` 就会闪**：新增任何剑身类通道都乘 `combatPoseW`。
- **`ship` 只推分支、不等 Pages 构建**：`ship.sh` 末尾用 `check-online.py` 兜（只提示）。
- **脚滑**：步幅 0.66 后冲刺（4.5 m/s）脚滑 12%，低速 0。
- **蜘蛛无武器**：`bladesWorld()` 返回 null，打不到可破坏物。
