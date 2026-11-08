# 假人与持械陪练

> 最后更新：2026-11-08（v9s.38）。
> 管什么：6 个普通假人的 5 种行为、3 个持械陪练（剑盾 / 双刀 / 大剑）的 `spar` 行为、点击轮转、牵引半径、复位。
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
        │    attackRangeScale, knockbackScale, leashRadius }
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

**刻意没做**：不做卡肉（玩家打中陪练时玩家自己会卡肉，陪练再卡一次就双倍顿帧）；不做连击（假人状态机只有单段三阶段，要连击得给 `DummyState` 加连段字段，另一轮的事）。

### 「攻击欲望放低」怎么实现

不是简单调大 `attackInterval`（那只会变成「偶尔冲上来猛砍一刀」），而是三件事叠加：

| 手段 | 参数 | 效果 |
|---|---|---|
| **站位带 standoff** | `attackRangeFor() × 1.7` | 冷却期停在 1.7 倍起手距离外，不贴脸 |
| **冷却期只走位** | `attackCooldown > 0` → 切向 strafe | 冷却中绕着你转，不推进 |
| **首击错开** | `attackInterval × (0.25 + 0.22 × i)` | 三个不同时挥刀，不会读成「被集火」 |

`desiredDirection()` 的 `spar` 分支：

```ts
const range = attackRangeFor(world, s, cfg);   // cfg.reach[weapon] × attackRangeScale
const standoff = range * 1.7;
const wantsAttack = s.attackPhase === 'idle' && s.attackCooldown <= 0;

if (wantsAttack && dist > range)      { x = nx;  z = nz;  }   // 冷却好了 → 压上
else if (dist > standoff + 0.35)      { x = nx;  z = nz;  }   // 太远 → 靠近
else if (dist < standoff - 0.45)      { x = -nx; z = -nz; }   // 太近 → 退开
else                                  { x = -nz * strafe; z = nx * strafe; } // 刚好 → 绕
```

`±0.35 / ±0.45` 是**滞回带**：没有它，站到 standoff 边界上会一帧进一帧退地抖。

调参入口：调试面板 →「假人 / 混战」→「持械陪练」，五个滑杆（移速 / 攻击间隔 / 起手距离 / 击退比例 / 牵引半径）+ 一个行为下拉。下拉读「第一个陪练当前的行为」，点单个陪练之后这里会跟着变。

### 和主角的差异（有意为之）

| 项 | 主角 | 陪练 | 原因 |
|---|---|---|---|
| 挥击时序 | `config.combat.weapons[w]` | **同一份** | 只有同一份时序，「混战强度」才有可比性 |
| 起手距离 | `hits.reach[w]` | `× attackRangeScale`（0.9） | 略短，混战时不会隔着 2m 砍到 |
| 击退 | `hits.knockback[w]` | `× knockbackScale`（0.6） | 三个一起打时玩家不会被推得站不住 |
| 受击档位 | 轻 / 重 / 击飞 | 大剑映射 `knock` | 与 `dummyHits` 一致，位置感可信 |
| 卡肉 / 连击 | 有 | 无 | 见上 |
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
| 外观对称 | 截图 `shots38/09-fighters-closeup.png` | 三种武器挂点、配色可分辨 |
