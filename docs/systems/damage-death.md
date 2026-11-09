# 伤害 / 血量 / 死亡 / 重生

> 一句话：**普通假人是打不死的测试桩，陪练是会死也会自己刷回来的对手。**
> 这条线只服务「陪练」，不去改测试桩的语义 —— 否则量距离、测 AI 行为的工位会一个接一个失效。

相关：`core/health.ts`（状态与时序）、`core/hits.ts`（结算唯一出口）、`core/dummies.ts`（AI 冻结）、
`presentation/three-scene.ts` 的 `applyDeathPose`（倒地 / 沉入 / 升起）。

---

## 一、三个旋钮

| 配置 | 含义 | 线上值 |
|---|---|---|
| `core.dummies.health` | **普通假人**血量。`0` = 不参与死亡（旧行为） | `0` |
| `core.dummies.fighters.health` | **陪练**血量。缺省沿用上一条 | `120` |
| `core.dummies.respawnSec` / `fighters.respawnSec` | 死亡后多久刷回来（秒） | `3` / `3.5` |
| `core.hits.damage` | 按受击类型分档的伤害：`light / heavy / knock` | `12 / 18 / 26` |
| `core.hits.damageMul` | 分武器倍率，乘在上表上 | 剑盾 1.0 / 双刀 0.7 / 大剑 1.4 |

**为什么按「受击类型」而不是按武器**：受击类型已经按「武器 × 连段段数」定档过
（大剑 = `knock`、第三段 = `heavy`、其余 = `light`）。伤害跟着同一档走，就不会出现
「同一段动作在两处各判一次档、调到不一致」的经典问题。

按现在的数：陪练 120 血 → 剑盾 9 刀、双刀 13 刀、大剑 4 刀。

---

## 二、结算链路：只有一个出口

`hits.applyHit()` 是近战、击地、派生招、弓箭、飞弹、电环**共同的**命中出口。
伤害只在这里算一次：

```ts
const dmg = hitDamage(world, spec);          // 受击类型查表 × 武器倍率
const fatal = damageDummy(world, s, dmg);    // 扣血 → 归零就 killDummy
```

四条链路各自算一次伤害必然漂移，最典型的事故是「箭能把人射死、近战不能」。
`HitSpec.damage` 留了显式覆盖口，但线上没有用到 —— **一个旋钮比六个旋钮好调**。

`maxHp = 0` 的单位（木桩）走同一条链路，只是 `damageDummy` 直接返回 `false`：
受击动画、卡肉、命中计数照旧，只是永远不死。

---

## 三、死亡做了什么

`killDummy()` 只做四件事：

1. `hp = 0`、`dead = true`、`deadT = 0`、`respawn = respawnSec`、`kills += 1`；
2. **清空挥到一半的刀**（`attackPhase = idle`、连击段数归零、冷却清零）——
   尸体不该继续出手，也不该在重生时「接着播后半段」；
3. 清掉受击与击退残留（否则尸体会带着后仰姿势 + 击退速度躺下）；
4. 发 `dummy-death` 事件（value = id）。

死亡之后，**所有读假人的系统都要跳过它**，否则会出现一连串「打尸体有反馈」的怪事：

| 系统 | 不跳过的后果 | 处置 |
|---|---|---|
| `hits.applyHit` | 打尸体也计数 / 卡肉 / 喷血；连击挂在死人身上 | `if (s.health.dead) return` |
| `playerHits` / 击地 / 派生招扫描 | 浪费 `hitIds`，旁边活着的人被打不到 | `continue` |
| `dummies.updateOne` | 尸体会走位 / 出刀 / 吃击退 | 直接 return（速度清零） |
| `targeting` | 打完一刀自动朝向会一直对着尸体转身 | 跳过 |
| `gaze` | 尸体被算成威胁，玩家「接敌」不退出 | 跳过 |
| `separation` | 玩家走过会把尸体一路蹭走 | 跳过 |
| `three-scene` 脚下环 / 光晕 / 预警弧 | 尸体脚下一圈「危险」提示 | 隐藏 |

---

## 四、重生

`updateHealth()` 在 `dummiesUpdate` **开头**跑（先于 AI）：这一帧刚复活的人要能立刻被 AI 接管，
而不是原地站一帧。

```
dead: deadT += dt; respawn -= dt;  respawn <= 0 → reviveDummy()
alive: revive = max(0, revive - dt)
```

`reviveDummy()`：满血、`dead = false`、`revive = REVIVE_GUARD (0.45s)`、发 `dummy-revive`。

**原地重生**，不瞬移回 `home`。训练场的陪练死在哪儿就在哪儿站起来 ——
回 home 会让「刚打死的那个」瞬移到远处，玩家读作「换了一个人」，
而且原地重生时上一刀的血迹还在，读起来是「同一个人又站起来了」。

**复活保护**：`revive > 0` 期间 `damageDummy` 直接返回。站在尸体上连打的玩家，
下一刀正好落在重生那一帧时会把刚刷出来的人秒掉，等于没刷新。

> 保护 0.45s 与表现层的「从地里升起」（`riseSec` 0.42s）同长：起身过程中挨打是无效的。

---

## 五、表现：倒 → 沉 → 升

体素材质不透明，改透明度要逐材质开 `transparent` 并重排渲染顺序（v9s.38 好不容易修掉的坑）。
所以尸体不做淡出，而是**躺下 → 被地面吞掉 → 从地里升起来**：

| 阶段 | 数据 | 表现 |
|---|---|---|
| 倒下 | `deadT ∈ [0, fallSec]` | `group.rotation.x = -fallDeg × smooth(t)`（绕脚底向后倒 84°） |
| 躺尸 | `respawn > sinkSec` | 保持倒地 |
| 沉入 | `respawn ∈ [0, sinkSec]` | `group.position.y -= sinkDepth × smooth(1 - respawn/sinkSec)` |
| 升起 | `revive ∈ [0, riseSec]` | 上面的反向播放 |

三个阶段首尾相接（沉完的那一刻正是 `revive` 开始），所以整条曲线没有跳帧。

要点：**这是表现层叠加在骨架上的整机变换**，不写进 rig。两条骨架（简化假人 / 持械陪练）
共用 `applyDeathPose`，只有一份实现。`group.rotation.order = 'YXZ'` 让 yaw 先应用，
X 轴才是身体局部的前后轴 —— 否则角色会朝侧面倒。

---

## 六、验收

| 看什么 | 怎么量 |
|---|---|
| 陪练会不会死 | `__harness.dummyHealth()` → `dead / hp / kills` |
| 死得对不对（3 刀还是 9 刀） | 同上 `hp` 逐刀下降幅度 |
| 有没有真的躺下 | `__harness.deathDebug(id)` → `fall / sink / rise / y` |
| 会不会自己刷回来 | `dummyHealth().respawn` 倒数 → `dead: false` |
| 木桩是否仍打不死 | `tests/v9s56-damage-blood.test.ts`「木桩砍多少下都不死」 |
| 整体观感 | `python3 tools/blood-shot.py`（9 张：命中 / 落地 / 倒下 / 沉没 / 升起） |
