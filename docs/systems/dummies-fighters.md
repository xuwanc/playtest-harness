# 假人与持械陪练

> 最后更新：2026-11-08（v9s.39）。
> 管什么：6 个普通假人的 5 种行为、3 个持械陪练（剑盾 / 双刀 / 大剑）的 `spar` 行为与**一轮连击**、点击轮转、牵引半径、复位。
> 代码：`src/core/dummies.ts`、`src/presentation/dummy-rig.ts`、`src/presentation/fighter-rig.ts`；参数 `config/game.json` → `core.dummies` + `view.dummies`。

## 场地上一共 9 个单位

| 组 | id | 数量 | 外观 | 行为来源 |
|---|---|---|---|---|
| 普通假人 | 1~6 | 6 | 橙 / 绿 / 紫 / 红（`view.dummies.colors`，循环取） | `DUMMY_MODES`：wander / follow / keep-distance / attack / idle |
| 持械陪练 | 7~9 | 3 | 红 / 金 / 紫（`view.dummies.fighterColors`） | `FIGHTER_MODES`：spar / wander / follow / keep-distance / attack / idle |

两组**共用同一条单位管线**：同一个 `DummyState`、同一套碰撞与分离、同一个点击拾取、同一套渲染插值。差别只有两个字段：

```ts
s.weapon: WeaponId | null   // 陪练为 'sword-shield' | 'dual-swords' | 'greatsword'
s.combat: CombatState | null // 陪练每帧由 syncFighterCombat() 填入；普通假人为 null
```

`three-scene.ts` 里的分叉只有一行：`const rig = s.weapon ? createFighterRig(...) : createDummyRig(...)`，两者收敛成同一个 `AnyDummyRig` 接口（`update(s, dt, time)` + `boneAtWorld()`），所以遍历更新的那句代码不用改。

## 普通假人的 5 种行为

| 行为 | 规则 | 典型用途 |
|---|---|---|
| `wander` | 以出生点为圆心、`wanderRadius`（3m）内随机取目标，约 2.2s 换一次；随机源是 `world` 里的种子随机 | 观察 AI 移动、步态、与场景碰撞 |
| `follow` | 朝玩家移动，进入 `followStopDistance`（1.2m）停住，不贴脸 | 跟随手感 / 寻路前置验证 |
| `keep-distance` | 目标 4m；太远靠近、太近后退，±0.6m 死区内绕着玩家侧移 | 走位 / 距离控制 / 风筝行为 |
| `attack` | 追到 `attackRange`（1.6m）内站定，每 1.6s 挥砍一次，`active` 帧出现红色攻击弧并触发玩家受击 | 攻击表现、事件、受击验收 |
| `idle` | 站住不动，只保留受击与分离 | 静止对照 / 混战里的「木桩」 |

- **点击切换**：轻点任意单位 → 在该单位可用的模式列表里循环（普通 5 种、陪练 6 种）；切换时头顶标签重绘并闪一下。
- **无伤害**：假人只写自己的状态、`dummy-attack` / `dummy-hit` 事件与 `world.dummyAttackCount`，**从不写 `character`**；玩家受击状态放在 `World.playerHurt`。
- **牵引半径**：`leashRadius` 限制单位离出生点多远（普通 2.4m / 陪练 7m），超了就回头，不会跟着玩家跑遍全场。
- **复位**：按钮 / `R` 把玩家、战斗状态、四个朝向角、目标、受击、命中计数、冲刺状态与全部 9 个单位送回配置初值；复位当帧不推进任何模块。

## 持械陪练：三个和主角一样的 AI

> 需求原话：「配三个和主角一样的持剑盾 / 双刀 / 大剑 AI 调试角色，但是攻击欲望放低，方便调试混战强度；点击测试角色后和假人一样，到处走 / 保持距离 / 待机 / 攻击。」

核心判断：**陪练不是「第二套实体」，而是「带武器的假人」**。假人已有的机制（点击轮转、威胁环、受击击退、渲染插值、分离、牵引）全部复用，只额外补两样：手里的武器、表现层的挥击姿势。

### 数据流

```
config/game.json  core.dummies.fighters
        │  { weapons, spawn, initialModes, moveSpeed, attackInterval,
        │    attackRangeScale, knockbackScale, leashRadius,
        │    comboCount (0=随武器), comboGap (0=用全局 settle) }
        ▼
core/dummies.ts  createDummies()          ← 追加在普通假人之后，id 连续（7 / 8 / 9）
        │  makeDummy(id, mode, x, z, weapon)  →  s.weapon / s.combat
        ▼
core/dummies.ts  dummiesUpdate()          ← 行为状态机（含 'spar'）
        │  attackTiming / attackRangeFor / attackIntervalFor 全按 s.weapon 取武器配置
        │  每帧末尾 syncFighterCombat(world, s, cfg)
        ▼
core/hits.ts     dummyHits()              ← 命中距离 / 击退取 cfg.reach[weapon]
        ▼
presentation/fighter-rig.ts  createFighterRig()   ← DummyState → CharacterState + CombatState
        ▼
presentation/voxel-rig.ts    rig.update()         ← 主角同款挥击 / 受击 / 步态 / IK
```

### 为什么能「和主角一样」

`voxel-rig` 的挥击姿势只认 `CombatState`（`weapon / phase / attackProgress / timings`），不关心这个状态是玩家输入写的还是 AI 写的。胶水层只要把假人的三段状态机抄成一份 `CombatState`：

```ts
// core/dummies.ts → syncFighterCombat()
c.phase = s.attackPhase;             // windup / active / recovery / idle
c.attackProgress = s.attackProgress; // 0..1（三段按 windup+active+recovery 归一）
c.timings = attackTiming(world, s, cfg);
c.weapon = s.weapon;
c.hitstop = 0;                       // AI 不做卡肉：卡肉要冻结时间轴，AI 侧没有这条路径
c.warp = 1;
```

于是**同一副体素身体、同一套武器挂点、同一套挥击剪辑**，只是数据来源不同。陪练的剑盾会举盾、双刀一高一低、大剑双手抬起 —— 那是 `view.animation.stance.<weapon>` 在起作用，不是给陪练另写的数据。

**刻意没做**：不做卡肉（玩家打中陪练时玩家自己会卡肉，陪练再卡一次就双倍顿帧）。

~~不做连击~~ → **v9s.39 已做**，见下一节。做法不是给 AI 开一条新状态机，而是在原来的
三段循环外再套一层「本轮还剩几段」的计数。

### 「攻击欲望放低」怎么实现

不是简单调大 `attackInterval`（那只会变成「偶尔冲上来猛砍一刀」），而是三件事叠加：

| 手段 | 参数 | 效果 |
|---|---|---|
| **站位带 standoff** | `attackRangeFor() × 1.7` | 冷却期停在 1.7 倍起手距离外，不贴脸 |
| **冷却期只走位** | `attackCooldown > 0` → 切向 strafe | 冷却中绕着你转，不推进 |
| **首击错开** | `attackInterval × (0.25 + 0.22 × i)` | 三个不同时挥刀，不会读成「被集火」 |

`desiredDirection()` 的 `spar` 分支（v9s.40）：

```ts
const range = attackRangeFor(world, s, cfg);   // cfg.reach[weapon] × attackRangeScale
const standoff = range * 1.7;

if (inComboRound(s)) {                          // v9s.39：一轮连击中间
  if (dist > range * 1.3)        { x = nx; z = nz; }              // 够不着 → 压上
  else if (dist < range * 0.55)  { x = -nx * 0.6; z = -nz * 0.6; } // 贴太近 → 让一点
}                                               // 其余情况站住（连击中间不退回 standoff）
else if (idle && cooldown <= 0 && dist > range) { x = nx; z = nz; } // 冷却好了 → 压上
else {
  const radial  = clamp((dist - standoff) / 0.5, -1, 1) * 0.9;      // 连续径向纠偏
  const tangent = strafeGate(t, id, period, duty) * 0.9;            // 门控横移（走/停）
  x = nx * radial - nz * tangent;
  z = nz * radial + nx * tangent;
}
```

调参入口：调试面板 →「假人 / 混战」→「持械陪练」，五个滑杆（移速 / 攻击间隔 / 起手距离 / 击退比例 / 牵引半径）+ 一个行为下拉。下拉读「第一个陪练当前的行为」，点单个陪练之后这里会跟着变。

### 对峙时走走停停，别一直磨脚（v9s.40）

用户反馈：**「陪练在和角色保持距离的时候会疯狂磨脚」**。实测（玩家钉住、只留剑盾陪练）
旧行为下陪练 100% 的帧都在动，速度 0.67~1.11 m/s、5 秒走 3 米 —— 就是原地碎步绕圈。
两条独立根因：

| 根因 | 旧写法 | 为什么读作「磨脚」 |
|---|---|---|
| 横移永不归零 | 死区内每帧都返回切线方向 `sin(t × 0.55 + id) × 0.55` | 玩家不动，陪练也一刻不停；幅度只有 55% 移速 → 步幅小、步频高 |
| 开关式径向 | `dist > standoff + 0.35` / `dist < standoff − 0.45` 二选一，全速进 / 全速退 | 玩家在阈值附近微动（或自身被分离力推 2cm）→ 方向逐帧反转，速度在 0 附近反复拉锯，腿一直在迈 |

修法两件，都很小：

1. **径向改比例控制**：`radial = clamp((dist − standoff) / 0.5, −1, 1) × 0.9`。
   越过阈值时从 0 平滑长到满速，不存在「一帧进一帧退」。
2. **横移走时间门** `strafeGate()`：按 `strafePeriod / strafeDuty` 切成脉冲，
   **按 id 错相位**（`time + id × 2.37`）所以三个陪练不会同拍起步，两端 smoothstep，
   关门时方向给 0 → 速度指数衰减到 0 → 表现层走停步收相，自然站定。
   开门时幅度提到 0.9（≈1.9 m/s，接近它自己 2.1 的上限），走就走得像样，不碎。

| 参数（`core.dummies`） | 默认 | 含义 |
|---|---|---|
| `strafePeriod` | 5.2s | 一个「走 + 停」周期 |
| `strafeDuty` | 0.34 | 一个周期里横移占的比例（34% 走、66% 站） |

同一套门也用在普通假人的 `keep-distance`（玩家不动时它也不该绕圈）。

**附带修掉的一个双计**：`fighter-rig` 原先把 `hurt.knock` 并进了传给骨架的 `velocity`，
而 `voxel-rig` 内部又会按 `gaitCfg.knockGaitScale` 把击退并入**步态驱动** —— 陪练挨打时
步频被放大一倍，腿在原地飞快倒腾。现在 `cs.velocity` 只写自主速度，位置仍含击退位移。

实测（玩家钉住 4.7s，同一台软件渲染机）：

| 指标 | 改前 | 改后 |
|---|---|---|
| 平均速度 | 0.67 m/s | 0.42 m/s |
| 位移路径 | 3.08 m | 2.21 m |
| 停步收相帧 | 11 / 90 | 49 / 90 |
| 移动时均速 | 0.9 m/s（碎步） | 1.5 m/s（大步） |

### 连击：一次冷却好 = 打一整轮（v9s.39）

需求是「攻击欲望低」，但单发一刀在混战里读不出压迫感。所以把**两次起手的间隔**和
**一次起手的段数**拆成两个旋钮：

| 参数 | 管什么 | 默认 | 调大之后 |
|---|---|---|---|
| `fighters.attackInterval` | 多久来一轮 | 3.4s | 更懒（但每轮仍是 3 刀） |
| `fighters.comboCount` | 一轮几刀（0 = 随武器 `comboCount`） | 0 → 3 | 一轮更密 |
| `fighters.comboGap` | 段间缝隙（0 = 用全局 `combat.settle` = 0.16s） | 0 | 节奏更「一刀一顿」 |

**冷却在整轮起手时就记满**，所以连击只改变「一轮之内的密度」，起手频率与单发时一致
（`tests/v9s39-fighter-combo.test.ts` 有一条专门守这个：12s 内仍是 3~4 轮）。

```
起手 ── 第1段(0.46s) ── 缝隙(0.16s) ── 第2段 ── 缝隙 ── 第3段 ── idle ──(attackInterval 继续倒数)──▶ 下一轮
     ↑ comboIndex 1        ↑ phase=settle, progress=1        ↑ 归 0
```

`DummyState` 上只有三个字段：

```ts
s.attackComboIndex  // 1..N，本轮段号（0 = 不在连击中）；直接抄进 combat.comboIndex
s.attackComboLeft   // 本轮还剩几段；> 0 时 idle + comboGap>0 就是「缝隙中」
s.comboGap          // 缝隙剩余秒数
```

四条规则（都在 `dummies.ts`，读之前先看这几条，比读代码快）：

| 情形 | 行为 |
|---|---|
| 缝隙走完 + 目标还在 `range × 1.3` 内 | 接下一段，`attackComboLeft -= 1` |
| 目标被推出 `range × 1.3` | **断连**：剩余段作废、段号归 0、补 `attackInterval × 0.4` 冷却 |
| 受击（`hurt.timer > 0`） | **打断**：已挥出去的那一刀照常播完，但不接下一段 |
| 最后一段播完 | 段号归 0；若冷却已归零（`attackInterval` 调得比一轮还短）补最小停顿 |

- **为什么放宽到 1.3**：第一击命中会把玩家推开（大剑 0.45m），严格按 `reach` 判定的话，
  「打中过的对局」里第二段永远接不上 —— 正好是最需要连击感的时候。放宽只用于「要不要接」，
  真正结算命中仍走 `hits.reach`（打空就是打空）。
- **表现层不用改**：`syncFighterCombat()` 把缝隙期写成 `phase='settle'` + `progress=1`
  （而不是 idle），rig 的 `attacking = phase !== 'idle'` 自然保持收势姿势；
  `comboIndex` 换段则触发 `swing-pose` 的段切换，第 1/2/3 段刀路方向不同。
  写成 idle 的话，0.16s 里 rig 会把手放下再抬起 —— 读成「两刀之间发了个呆」。
- **命中档位按段**：大剑的 `knock` 只给最后一段（`hits.ts` 里 `attackComboLeft <= 0`），
  前两段是 `light`。三段全 knock 会把玩家打得一拖一拖，读起来不是连击是「卡住」。

### 和主角的差异（有意为之）

| 项 | 主角 | 陪练 | 原因 |
|---|---|---|---|
| 挥击时序 | `config.combat.weapons[w]` | **同一份** | 只有同一份时序，「混战强度」才有可比性 |
| 起手距离 | `hits.reach[w]` | `× attackRangeScale`（0.9） | 略短，混战时不会隔着 2m 砍到 |
| 击退 | `hits.knockback[w]` | `× knockbackScale`（0.6） | 三个一起打时玩家不会被推得站不住 |
| 受击档位 | 轻 / 重 / 击飞 | 大剑映射 `knock` | 与 `dummyHits` 一致，位置感可信 |
| 连击 | 有（3 段，段间 settle） | **有（v9s.39）**，段数取同一份 `comboCount` | 挥击剪辑按段号出不同刀路，混战才有可读性 |
| 卡肉 | 有 | 无 | 见上 |
| 移速 | `core.moveSpeed` 系列 | `fighters.moveSpeed`（2.1） | 比玩家慢，方便绕后测试 |
| 外观 | 蓝 | 红 / 金 / 紫 | 混战里必须一眼分得清哪个是自己 |

### 踩过的坑（改这块之前先读）

**1. 三个陪练全叠在原点，或全在玩家背后一点** —— `fighter-rig.ts` 里 `voxel-rig` 的 `rig.group` 自己会摆位（它以为自己是主角）。外层 `group` 必须**显式**写位置：

```ts
group.position.set(s.position.x, s.position.y, s.position.z);
group.rotation.y = s.bodyYaw;
rig.update(cs, s.combat, s.hurt, frameDt, false, coreTime, s.link);
```

漏了第一行 → 三个都画在原点，只有外层在动（或看起来完全不动）。

**2. 位置和朝向不能共用一个节点** —— `voxel-rig` 的 `root.rotation.y = p.rootYaw + p.spinYaw`，挥击的「整体带转 / 整圈旋转」占用 root。直接把 `s.bodyYaw` 写进 root，横扫时会**双重旋转**。所以位置 + 身体朝向给外层 `group`，root 只承担挥击带转。

**3. `s.combat` 的初始化不要依赖时序** —— 由 `createDummies` 用 `initialCombatState()` 初始化，不要指望「第一帧 dummiesUpdate 之后才有值」。

**4. 加 fighters 会打破旧用例** —— `createDummies` 多返回 3 个单位后，「数量 / id / 坐标」的旧用例全挂（21 例）。处理方式：`tests/helpers.ts` 的 `FIXTURE_CORE_PATCH.dummies` 写 `fighters: undefined`，单测继续吃冻结的 4 假人夹具。**不要让线上关卡坐标污染单测**。

**5. 想单独测某一个陪练，不要 `w.dummies = [s]`** —— `dummy-hit` 事件的 `e.value` 是 `s.id`，命中侧用 `w.dummies[e.value - 1]` 取回。数组换成长度 1 会让 id 与下标错位，直接命中到 `undefined`。正确做法是写 `isolate(w, keep)`：把其他单位挪到 40+ 米外，**数组长度与 id 都不动**。

**6. 测「正面命中」时会被扫掠门挡住** —— `weapons.*.hitSweep` 要求「本帧刃身扫过目标方位角」。单测里直接摆位置时角度可能不在扫掠区间内 → 命中不发生。做法是在该用例内 `delete w.config.combat.weapons.greatsword.hitSweep`（扫掠门本身由 v9s.36 专项覆盖）。

**7. 自动化里测连击，最容易误判成「机制没生效」** —— 三件事都会让连击断在第 1 段，
而现象完全一样（`segs=1`、`left=0`）：

- 玩家被自己的击退推远（每段 0.45m，三段落差就能超出 `range × 1.3`）→ 把玩家钉成木桩；
- 陪练被摆到离 `home` 十几米的地方 → 牵引半径一路把它拽回工位，边打边退 → **工位要跟着搬**；
- 用墙钟等待（`wait_for_timeout`）→ 软件渲染下 4s 墙钟只推进约 0.87s 游戏时间
  → 改成 `wait_for_function(world.time > t0 + 3.0)`。

`tools/smoke.py` 的「陪练一轮打出多段连击」这三条都踩过，现在是钉玩家 + 搬工位 + 等游戏时间的写法。

**8. 击退不要既进 velocity 又进 knock** —— `voxel-rig` 会把 `hurt.knockX × knockGaitScale`
并入步态驱动；`fighter-rig` 若再把 knock 加进 `cs.velocity`，陪练挨打时步频直接翻倍（v9s.40 修的）。
判据：被打的瞬间 `gaitDebug().gaitSpeed` 不应超过 `|velocity| + |knock|` 的上限。

**9. 「保持距离」的观感问题不一定是动画，多半是走位策略** —— v9s.40 前的死区逻辑每帧都给
切线方向，玩家不动它也在绕圈（0.7~1.1 m/s 碎步）。先在 Core 里量「移动帧占比 / 移动时均速」
再动表现层，否则会去调步幅参数白忙。

### 加第四个陪练要改哪

1. `config/game.json` → `core.dummies.fighters`：`weapons` 加武器（如 `'staff'`）、`spawn` 加坐标、`initialModes` 加一项；
2. `config/game.json` → `view.dummies.fighterColors`：加一套配色（**必须**，否则默认色和玩家撞）；
3. **不用改代码** —— id 自动连续，`three-scene.ts` 按 `s.weapon` 选 rig，`hud.ts` 的 `MODE_LABELS` 已有 `spar: '陪练'`。

若加的是**新武器**（不在 `WEAPON_ORDER` 里），还要在 `core/types.ts` 的 `WEAPON_ORDER`、`config.combat.weapons`、`view.animation.stance`、`hits.reach / knockback` 各加一项。

## 验收

| 项 | 方法 | 期望 |
|---|---|---|
| 数量与 id | `__harness.world.dummies` | 9 个，id 1..9，后 3 个 `weapon != null` |
| 陪练会压上但不贴脸 | `npm run smoke`「陪练与玩家保持距离」 | 三个距离均 > 1.2m，且 < 6m |
| 点击轮转 | 点陪练 | 在 6 种模式间循环，HUD 显示「陪练」 |
| 玩家打得到陪练 | `tests/v9s38-fighters.test.ts` | `hit` 事件、`hitCount` 增长 |
| 陪练打得到玩家 | 同上（`noDamageToPlayer = false`） | `playerHurt` 写入 + 玩家被击退 |
| 外观对称 | 截图 `shots/v9s38/09-fighters-closeup.png` | 三种武器挂点、配色可分辨 |
| 一轮是 3 刀 | `tests/v9s39-fighter-combo.test.ts` | 段号 1→2→3，3 次 `dummy-attack` / 3 次 `dummy-hit` |
| 段间有停顿 | 同上 | 缝隙期 `combat.phase === 'settle'`、`progress === 1` |
| 起手频率不变 | 同上 | 12s 内 3~4 轮（不是 3 倍） |
| 连击能被拆掉 | 同上 | 受击 / 目标跑远 → 剩余段作废、段号归 0 |
| 真机打得出来 | `npm run smoke`「陪练一轮打出多段连击」 | `segs ≥ 3` 且段号到 3 |
| 三段刀路不同 | 截图 `shots/v9s39/02~04-combo-seg{1,2,3}.png` | 剑盾：右下 → 左上 → 横胸 |
| 对峙走走停停 | `tests/v9s40-standoff-gait.test.ts` / `npm run smoke`「对峙时走走停停」 | 移动帧 ≤ 60%，且 > 5% |
| 踱步是大步 | 同上「踱步是大步」 | 移动帧均速 ≥ 1.2 m/s |
| 站定不滑 | `tests/v9s40-standoff-gait.test.ts` | 站定帧帧均位移 < 3mm |
