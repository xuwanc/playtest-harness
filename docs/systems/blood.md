# 命中飙血

> 一句话：**血珠给方向、血雾给冲击、地面血迹给痕迹。** 缺一个都读不出「这一刀砍实了」。

实现：`presentation/blood-fx.ts`；数据源：`core/health.ts` 的 `pushHitMark`；参数：`config.view.blood`。

---

## 一、三层各管什么

| 层 | 几何 | 生命周期 | 少了会怎样 |
|---|---|---|---|
| 血珠 | 拉长的立方体（`InstancedMesh`，128 个容量） | 0.46s，受重力、落地即转血迹 | 只有一团红雾，读不出「从哪儿打到哪儿」 |
| 血雾 | 低模二十面体（10 个池） | 0.15s，放大 + 淡出 | 纯血珠像撒了一把红豆，缺少瞬时冲击 |
| 地面血迹 | 扁圆片（18 个池，各自材质） | 6.5s，前 15% 保持后线性淡出 | 打完一场地上干干净净，读作打空气 |

**血珠用 InstancedMesh**：一次命中 13 滴 × 3 个陪练同时挨打，独立 Mesh 就是 39 个 draw call。
实例矩阵里未激活的缩放到 0（不是 `visible = false`，InstancedMesh 没有逐实例可见性）。

**血迹用独立 Mesh**：它需要逐块透明度，InstancedMesh 做不到（除非自写 shader）。
18 个 draw call 可以接受，而且它们都在地面同一层。

---

## 二、数据源：`world.hitMarks`，不是事件队列

`applyHit` 每次命中往 `hitMarks` 塞一条（短环形，`HIT_MARK_CAP = 24`），
表现层按 `seq` 补触发。**为什么不读 `events`**：

```
step() 每帧开头 events.length = 0
```

低帧率下 `maxStepsPerFrame = 5`，一帧可能跑 5 步，只有最后一步的事件活到渲染那一帧。
连击的血花就会一段一段地丢 —— 而「漏血花」比漏其他事件明显得多（玩家会以为没打中）。

`seq` 只增不减、**复位也不归零**：表现层记 `lastSeq`，比它大的才是新的。
归零会让复位后的第一下血花被当成「已经播过」。

> 代价：`hitMarks` 会进快照（`snapshot` 就是 `JSON.stringify(world)`），
> `determinism` 的 golden hash 因此变了一次。这是刻意的 —— 宁可多 24 条记录进快照，
> 也不要「表现层在某些帧率下漏血」。

---

## 三、参数（`config.view.blood`）

| 参数 | 作用 | 线上值 |
|---|---|---|
| `drops / dropLife / dropSize` | 每次命中几滴 / 存活 / 边长 | 13 / 0.46 / 0.07 |
| `spraySpeed / sprayLift / spread` | 沿击打方向的初速 / 上抛 / 横向散布 | 2.1 / 2.0 / 0.7 |
| `gravity` | 血珠重力 | 12 |
| `mistLife / mistRadius / mistOpacity` | 血雾寿命 / 半径 / 不透明度 | 0.15 / 0.22 / 0.38 |
| `stainCount / stainLife / stainRadius / stainOpacity` | 血迹池 / 寿命 / 半径 / 不透明度 | 18 / 6.5 / 0.2 / 0.5 |

**命中点高度**由 Core 给（`dummies.height × 0.52`，击退类 0.46）——
从脚底喷血是最常见的「一眼假」，所以这个值写在 `hits.ts` 而不是表现层自己猜。

---

## 四、三条调参经验

1. **血雾半径别超过 0.3**。0.42 时实测是一块一米宽的半透明红布，把角色整个盖住；
   玩家读到的不是「血雾」，是「画面脏了」。
2. **血珠别飞太远**。`spraySpeed` 2.7 时血珠能飞出 1.5m，落在角色三米外，
   看起来像「地上有几颗红方块」，而不是「从伤口喷出来的」。
3. **木桩不喷血**。`maxHp = 0` 的单位不记 `hitMark` —— 被砍的木桩流血反而读错。
   卡肉 / 命中计数 / 受击动画照旧。

---

## 五、性能与层级

- 常量：1 个 `InstancedMesh`（血珠）+ 10 个雾 + 18 个血迹 = **29 个 draw call 上限**，
  稳态（没有命中）时血珠实例全部缩放 0、雾和血迹 `visible = false`。
- 层级写进 `FX_ORDER`：`bloodStain = 32`（贴地，压在冲击环之上）、
  `bloodDrop = 42`（身体高度，压住刀光）、`bloodMist = 43`（最上，半透明）。
- 血珠按**真实帧时长**推进，不跟卡肉走。卡肉冻结的是角色姿态，血已经溅出去了 ——
  跟着冻反而读作「时间停了」。

---

## 六、验收

| 看什么 | 怎么量 |
|---|---|
| 有没有喷 | `__harness.bloodDebug()` → `bursts / drops / stains` |
| 喷得对不对 | `tools/blood-shot.py` 的 `02-hit-3f`、`04-hit-18f`（血珠在空中的两帧） |
| 地面留没留痕 | 同脚本 `07-fallen`（尸体周围应该有暗红斑） |
| 会不会重复播 / 漏播 | `bloodDebug().lastSeq` 应等于 `world.hitMarkSeq` |
