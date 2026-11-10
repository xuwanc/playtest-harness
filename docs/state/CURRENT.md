# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-10 08:25。

## 一句话

v0.9.79：**死亡体感补完** —— ① 血不再固定喷在胸口：Core 只给**归一化部位** `u`
（轻击 0.60 / 击飞 0.40 / 击地 0.26，三连收招再降 0.14），表现层按 `u × 身高` 取点再
吸附到最近骨骼段，打头在头、打腿在腿；② **尸体是障碍**：玩家让开尸体、尸体不动，
碰撞圆心随倒向前移 0.55m（躺下的身体中心不在脚底）；③ 陪练**头顶血条**（DOM 覆盖层），
只画有血量的单位，死亡隐藏、重生重现。

上一版（v0.9.78）并入的可破坏迭代仍在：刚性碎片 / 仙人掌多段砍 / 挥砍闸门 /
微信 `webglcontextlost` 防护 / `zz-cactus-test` 工位。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.79`（内部代号 v9s.58） |
| 线上徽标 | `v0.9.79`（构建时间随发布变化） |
| 发布方式 | `npm run ship`（构建 → 推 main → 重建 `preview` 产物；带凭证自恢复与推送重试） |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— 此链接固定不变 |
| 蜘蛛开局 | <https://xuwanc.github.io/playtest-harness/?hero=spider> |
| 老人开局 | <https://xuwanc.github.io/playtest-harness/?hero=elder> |
| 沙盒隧道 | 仅本地临时调试用，按 runtimeId 定址、每次重建都变，**不作为对外链接** |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 109 文件 / 1109 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS |
| `npm run docs:check` | PASS（90 份文档 ≤300 行，README 99 行） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |
| `python3 tools/check-online.py --wait 180` | 发布后核验线上 JS 与本地 `dist` 同一份 |
| `python3 tools/blood-shot.py` | 10 张：命中 3 帧 / 落地 / 倒下 / 沉没 / 升起 |

## 正在做

- 无。v9s.58（v0.9.79）已合并发布。

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

1. **血迹不分材质**：台阶侧面也会贴一块平的（`groundY` 取脚下支撑面）。
2. **尸体是「滑开」不是「顶住」**：圆形碰撞会沿切线滑过去；要推不动的阻力感，得再加一档 `crowdResistance`。
3. **转身期间站姿权重为 0**（v9s.55 遗留）：转完再升回来，中间 0.15s「并腿」过渡。
4. **剑盾段间仍是连续承接**：换段跳变靠 `segBlend`（0.08s）掩。
5. **三段节奏同质**：三种武器九段配比完全一致，应做成逐段递减。
6. **`config/game.json` 拆分**：`core.gait` / `core.combat` / `view.*` 仍未拆。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮变化：

- **木桩喷血是个陷阱**：`maxHp = 0` 的单位必须跳过 `pushHitMark`（否则砍测试桩也出血）。
  但**不能**因此提前 `return` —— 那会把卡肉也一起跳过。判断要包在 `if` 里，不是守卫语句。
- **死亡要跳过的系统有七处**：命中结算 / 近战·击地·派生扫描 / AI / 索敌 / 注视 / 分离 / 脚下环。
  新增任何「按 dummies 遍历」的模块，都要问一句「尸体该不该算」。
- **`hitMarks` 进快照**：改记录结构或容量会让 `determinism` golden 漂移；
  确认是结构差异而不是行为差异的方法：把新字段剔除后重算 hash，应等于旧值。
- **血的颜色会和衣服撞**：红衣陪练 + 红血 = 看不见。验收换紫衣大剑陪练。
- **金快照（golden hash）本批变了两次**：一次是新字段，一次是「木桩不记命中」。这是预期内的。

上一轮遗留，仍有效：

- **斜跨会污染静态对照用例**：新增同类用例要用 `GAIT_NO_IDLE`。
- **剑身通道漏乘 `poseW` 就会闪**：新增任何剑身类通道都乘 `combatPoseW`。
- **`ship` 只推分支、不等 Pages 构建**：`ship.sh` 末尾用 `check-online.py` 兜（只提示）。
- **脚滑**：步幅 0.66 后冲刺（4.5 m/s）脚滑 12%，低速 0。
- **蜘蛛无武器**：`bladesWorld()` 返回 null，打不到可破坏物。
