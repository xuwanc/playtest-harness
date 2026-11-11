# 动画层注册表：谁允许写哪根骨头

> v9s.74 起生效。代码：`presentation/anim-probe.ts`（采集 + 审计）、
> `presentation/anim-layers.ts`（声明表）、`tests/v9s74-channel-guard.test.ts`。
> 分层原则见 [`pose-layers.md`](pose-layers.md)，动作节奏见 [`animation.md`](animation.md)。

## 1. 为什么要有这张表

`voxel-rig.update()` 是一条第 2500 行到第 3500 行的流水线，二十多层按注释编号执行：

```text
2.05 引导 → 2.5 受击 → 2.6 惯性 → 2.7 落地 → 2.8 跨步 → 2.85 肩 →
2.88 重心 → 2.9 squash → 2.95 朝向 → 2.96 体态 → 3.0 拆分 → 3.1 回正 → 4 足 IK
```

编号就是执行顺序，但「这一层准不准写 `upper.rotation.x`」只存在于注释和记忆里。
历史上真实踩过的两类：

| 类型 | 实例 | 表现 |
|---|---|---|
| **越权** | v9s.73 `applyCombatPose` 每帧把 `upper.rotation.y` 归零 | 剑盾持械站姿 0.12 → 0.03 rad，没有报错，只是「侧身站没了」 |
| **双覆盖** | 两个 `=` 语义的层同帧活跃 | 后者静默吃掉前者，调参时「改 A 没反应」 |

这两类都不会崩、不会红，只能靠截图或单点读数发现。所以把归属变成**可测数据**：

```text
每层边界 mark(id) → 读快照 → 与上一段做差 → 这一层实际写了什么
帧尾 auditFrame() → 声明 vs 实测 → 越权（写了没声明）/ 冲突（两个 override 同通道）
```

## 2. 三个概念

| 概念 | 含义 | 代码 |
|---|---|---|
| **层** | 一次成块的姿态写入，边界由 `mark('<id>')` 标出 | `voxel-rig.ts` 里的 `mark(...)` |
| **通道** | `<节点>.<属性>`，节点只有 7 个：`root / pelvis / lower / upper / chest / ankleL / ankleR` | `anim-probe.ts` 的 `ProbeNodeSpec` |
| **语义** | `add`（叠加）/ `override`（独占）/ `derive`（重分配）/ `reset`（归零） | `ChannelKind` |

**为什么只有这 7 个节点**：手臂 / 肩 / 腕 / 剑身按设计就是「整层覆盖」——
v9s.73 已经证明手臂不能走四元数增量（`shoulder` 是 `YXZ`，抬臂 −1.9 rad 时
四元数→欧拉翻支，举顶仰角 89°→78°）。多层写手臂是约定，纳入监控只会产生噪声。
监控的是**真正在分层叠加**的地方：躯干、骨盆、下盘、踝。

**为什么 `derive` 不算冲突**：`splitSpine` 与 `distributeYaw` 必然改写上一层写的
`upper.rotation` —— 那是「把总角重新摊到骨链上」，不是「抢所有权」。
同理 `reset` 与所有 `override` 天然同通道，也不参与冲突。

## 3. 注册表（实测导出）

语义列：`+` 叠加、`=` 独占、`~` 重分配、`0` 归零。

| 层 | 语义 | 通道 |
|---|---|---|
| `1.0 reset` | 0 | `upper.px/pz/rx/ry/rz`、`pelvis.px/py/pz/rx/rz`、`lower.px/py/pz`、`chest.rx/ry/rz`、`root.ry` |
| `1.2 gait` | + | `pelvis.px/py/rz` |
| `1.3 stop` | + | `pelvis.px/py/pz`、`lower.px/py` |
| `1.5 inertia` | + | `pelvis.px/py/pz/rx/rz`、`lower.py` |
| `1.7 posture-pelvis` | + | `pelvis.py/pz`、`lower.py` |
| `1.1 stance` | + | `upper.rx/ry` |
| `2.0 combat` | = | `upper.rx/ry/rz`、`pelvis.px/py/pz`、`root.ry` |
| `2.05 channel` | = | `upper.ry` |
| `2.06 link` | + | `upper.rx`、`pelvis.pz` |
| `2.5 hurt` | + | `upper.rx/ry/rz/px/pz`、`pelvis.px/py/pz`、`lower.py/pz` |
| `2.6 lean` | + | `upper.rx/rz` |
| `2.7 land` | + | `upper.rx`、`pelvis.py`、`lower.py` |
| `2.8 step` | + | `pelvis.px/py/rz` |
| `2.85 shoulder` | — | （写 `shoulder.position`，不在监控集） |
| `2.88 balance` | + | `pelvis.px` |
| `2.9 stretch` | — | （只写 scale / 骨长） |
| `2.95 facing` | = / + | `lower.ry`（=）、`upper.rx`（+） |
| `2.96 posture` | + | `upper.rx` |
| `3.0 split` | ~ | `upper.rx/ry/rz`、`chest.rx/ry/rz` |
| `3.01 yaw` | + | `upper.ry`、`chest.ry` |
| `3.05 waist` | + | `upper.rx` |
| `3.1 armDrop` | — | （手臂，不在监控集） |
| `3.4 / 3.55 / 3.5` | — | （腕 / 剑身 / 副手握持，都不在监控集） |
| `4 ik` | = | `ankleL.rx/ry/rz`、`ankleR.rx/ry/rz` |

读表要注意两件事：

1. **`2.0 combat` 是 `override`，`2.6 lean` 是 `add`** —— 攻击层接管躯干，`lean`
   叠在它上面（v9s.73 的顺序解耦）。所以「`lean` 有没有生效」不该去看 `combat`。
2. **`3.0 split` 与 `2.0 combat` 同通道但不是冲突**：前者读后者的结果再分配。
   如果哪天真出现「两个 `=` 层抢 `upper.rx`」，测试会点名两个层。

## 4. 怎么用

**线上 / 真机**：不会自动开（默认关闭）。需要时在 `config/game.json` 的
`view.animation` 里加 `"probe": { "enabled": true }`，然后控制台：

```js
__harness.view.animProbe()
// { frames, layers: [...], overreach: [], conflicts: [], unused: [...] }
```

`unused` 是**信息项**：声明了 `add` 但最近一帧没写（条件层没走到，例如不攻击时的
`2.8 step`）。不要拿它当断言。

**关掉时**：每层边界只多一次 `noop()` 调用（`mark` 是一个闭包，不做判空分支），
不进快照、不进 Core、不影响确定性。

**测试**：`tests/v9s74-channel-guard.test.ts` 跑六个场景（待机 / 行走转身 /
跳跃落地 / 三武器连打 / 受击 / 鱼人体态）+ 下半身跨步死路径，断言
`overreach` 与 `conflicts` 都为空。有效性自检：临时删掉声明表里的
`2.95 facing → upper.rx`，测试立刻报
`越权 2.95 facing → upper.rx` —— 守卫是带牙的，不是装饰。

## 5. 加一层 / 改一层时的检查清单

1. 在代码里 `mark('<编号> <名字>')`，编号沿用现有体系（`2.95` 这种小数位就是留给插队的）；
2. 在 `anim-layers.ts` 登记 `writes`，**只写你真正改的量**（写回原值不算写，别多报）；
3. 语义选对：会用 `=` 或「先归零再写」的选 `override`；`+=` 选 `add`；
   读上一层结果重新分配的选 `derive`；
4. 跑一次 `npx vitest run tests/v9s74-channel-guard.test.ts`，把六个场景都走到；
5. 如果新增的是**条件层**（只在某种状态下跑），在测试里补一个能触发它的场景，
   否则声明写错了也发现不了 —— 这是这张表唯一的盲区。

## 6. 已知边界

1. **只监控 7 个节点**。手臂 / 肩 / 腕 / 剑身不查，理由见 §2。
2. **稳态重复写同值抓不到**。`diff` 判据是「值变了」，某层每帧写同一个数
   （例如站姿恒定 0.12）第二帧起就不算写。所以 `unused` 会随帧累积，
   只能当信息项。要根治得拦截 `position.x` 的 setter（Three 内部读写太密，代价不值）。
3. **冲突判据是「同帧都写」**，不分析数据依赖。`1.5 inertia` 写 `pelvis.py`（add）
   之后 `2.0 combat` 覆盖它——这是设计（攻击接管骨盆），不是冲突，因为语义不同。
4. **表与代码不同步只能靠测试发现**。线上不跑探针，就没有运行时保护 ——
   这是有意的：确定性优先，诊断按需开。
