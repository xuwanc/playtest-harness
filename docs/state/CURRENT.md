# 当前状态

> **覆盖写**。只写「现在在哪、正在做什么、下一步」，历史留在 `docs/journal/`。
> 最后更新：2026-11-10 15:44。

## 一句话

v0.9.84：**鱼人（Murloc）不是新骨架，是同一套人形骨架换五处几何**。
① 造型：方颅钝吻 + 两颗凸出的黄眼 + 冠鳍 / 背鳍 / 肩鳍 + 蹼手蹼脚 + 短尾
（`presentation/murloc-parts.ts`，约 240 行造型、零动画）；
② 因为骨架名 / IK / 步态 / 挥击 / 断肢映射 / 倒杆物理**一行没改**，鱼人天生会跑、
会砍、断头时整颗鱼头掉下来、倒下会侧倒；
③ 两种出场：`?hero=murloc` 当主角（`B` 键循环体型），`y-murloc` 工位三只当杂兵
（血量 90，重击 5 刀砍死，`sever.part` 实测 `head`）。

上一版的仙人掌侧臂单一真源 / 旗杆桩高 / 移动端降档仍在。

## 版本与线上

| 项 | 值 |
|---|---|
| `package.json` 版本 | `0.9.84`（内部代号 v9s.63） |
| 线上徽标 | `v0.9.84`（构建时间随发布变化） |
| 发布方式 | `npm run ship`（构建 → 推 main → 重建 `preview` 产物；带凭证自恢复与推送重试） |
| 权威线上链接 | <https://xuwanc.github.io/playtest-harness/> —— 此链接固定不变 |
| 蜘蛛开局 | <https://xuwanc.github.io/playtest-harness/?hero=spider> |
| 老人开局 | <https://xuwanc.github.io/playtest-harness/?hero=elder> |
| 鱼人开局 | <https://xuwanc.github.io/playtest-harness/?hero=murloc> |
| 本轮线上核验 | `assets/main-t1aEvwxz.js` 本地 / 线上同一份（913382 B），徽标 `v0.9.84` 有 → PASS |
| 沙盒隧道 | 仅本地临时调试用，按 runtimeId 定址、每次重建都变，**不作为对外链接** |

## 验证基线（改完必须复跑）

| 命令 | 当前结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 112 文件 / 1121 例全绿 |
| `npm run verify:portable` | PASS（Core 边界未破） |
| `npm run smoke` | 53/53 PASS |
| `npm run docs:check` | PASS（98 份文档 ≤300 行，README 99 行） |
| `npm run clip:lab:check` | 9 段全 PASS |
| `npm run verify` | 一条命令串起 build → test → portable → docs → smoke |
| `python3 tools/check-online.py --wait 180` | 发布后核验线上 JS 与本地 `dist` 同一份 |
| `python3 tools/blood-shot.py` | 10 张：命中 3 帧 / 落地 / 倒下 / 沉没 / 升起 |
| `python3 tools/sever-shot.py` | 7 张：断臂 / 断头 / 腰斩 / 断腿 / 倒下中 / 躺平 |
| `python3 /tmp/murloc-kill.py` | 3 张：鱼人站位 / 断头特写 / 倒地侧视 |

## 正在做

- 无。v9s.63（v0.9.84）已合并发布。

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
5. **AABB 是方盒**：仙人掌是圆柱，斜着看盒子会「方一角」；要贴合得换圆柱 / 胶囊碰撞。
6. **血迹不分材质**：台阶侧面也会贴一块平的（`groundY` 取脚下支撑面）。
7. **尸体是「滑开」不是「顶住」**：圆形碰撞会沿切线滑过去；要推不动的阻力感，得再加一档 `crowdResistance`。
8. **转身期间站姿权重为 0**：转完再升回来，中间 0.15s「并腿」过渡。
9. **剑盾段间仍是连续承接**：换段跳变靠 `segBlend`（0.08s）掩；三段节奏同质，应做成逐段递减。
10. **移动端 `resize` 没去抖**：地址栏动画会连发 `setSize`，每次都重建 render target。
11. **`antialias` 不能热改**：降档只降 dpr / 阴影，要关 MSAA 得重建 renderer（未做）。
12. **`config/game.json` 拆分**：`core.gait` / `core.combat` / `view.*` 仍未拆。
13. **鱼人走的是人类步态**：没有「拖步 + 左右摆」，和方块人一致。
14. **鱼人杂兵没有手**：`dummy-rig` 的手臂末端本来就没有手掌，蹼掌只做在主角上。
15. **鱼人主角没有断肢**：断肢是假人系统的能力，主角只有受击 / 击退。
16. **尾巴是静止的**：挂在 `pelvis` 上跟着屁股走，没有独立摆动。

## 已知风险

见 [`../risk-review.md`](../risk-review.md)。本轮变化：

- **「换造型」优先换几何，不要加骨架**：鱼人双足、髋膝踝肩肘腕、攻击前压都与人类同构，
  只换了头 / 背鳍 / 手 / 脚 / 尾五处几何，骨架名与骨骼层级一字未动 ——
  于是断肢（按节点名查找）、IK、步态、倒杆物理全部**白拿**。加新骨架只在
  「运动方式真的不同」时才值得（蜘蛛）。
- **单只假人的血量和「测试桩」是两件事**：`dummies.health` 是全局默认（0 = 打不死），
  `DummySpawn.health` 是单只覆盖。把全局改成 90 会让一堆测距离 / 测 AI 的工位失效；
  反过来只给鱼人配血量，鱼人才能被打死、才看得到断头。
- **smoke 的速度判据被过渡帧稀释**：`sp > 0.15` 把起步 / 收步也算成「移动」，
  均速从 1.5~1.9 掉到 0.8，看起来像「碎步」。阈值必须取「大步」的下限（0.6），
  且采样窗口 ≥ 一个横移周期（5.2s），否则窗口会随机落在停顿段、`moveRatio` 直接归零。
- **同一个造型写两份，必然漂移**：侧臂曾经「站立一套尺寸 / 断块一套尺寸」，
  断块那套还正好是 2 倍；`CACTUS_VIS_RATIO` 也是两边各乘一次（根部差 0.06m）。
  造型参数只允许有一份真源（`cactusArmBoxes`），表现层只负责画。
- **「谁跟着断块走」要用区间判据**：`atU > cutU` 看着合理，但第二次砍更低位置时，
  上一次已经飞走的臂仍然满足它 —— 必须写成 `cutU < atU ≤ prevStandU`。
- **站立几何的高度不能写死**：旗杆 mesh 一直用 `st.height`，`standU` 只影响碰撞和断块 ——
  于是「砍完还有一整根柱子」。凡是跟 `standU` 走的几何，顶面都要用 `cutBoxHeights(...)`。
- **移动端卡顿先看 `lost`**：桌面探针（对象数 / 几何数 / longtask 全平）排除了 JS 侧原因，
  剩下的「几秒」只能是 WebGL 上下文丢失 + 恢复重传。`?diag=1` 的 `lost` 在涨就是它。

上一轮（可破坏物去壳）仍有效：

- **测试站位不要压在物件上**：smoke 原来把玩家传送到「地块中心 −2.0」，正好和
  `pole-b`（`centerZ − 2.05`）重合 —— v9s.63 能靠「人和杆重叠」侥幸砍中；物件有了碰撞盒后
  玩家一落位就被推开 0.4m，这一刀就砍空。正确写法是「找到物件、站到它正北 1.0m」。
- **`dest-*` 碰撞盒不能进白盒渲染**：盒子宽度 = 物件直径，画出来就是一个红棕色方块
  把造型整个包住，现场读作「可破坏物是个方块」。
- **视觉半径 ≠ 碰撞半径**：仙人掌画 `0.82R`、撞 `1.0R`，每侧差 0.06m。
  改就得两边一起改（判定轴仍用 `R`）。

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
