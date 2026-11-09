# 待机斜跨站姿：重心压在一条腿上

> 最后更新：2026-11-10（v9s.55）。
> 管什么：站定 / 收招时脚下怎么站、前脚是谁决定的、为什么不能在姿态层里搬骨盆、参数含义。
> 代码：`presentation/gait.ts` 的 `solveIdleStance` / `mixIdleStance` / `leadFootIsLeft` /
> `idleStanceTarget`，骨架侧在 `presentation/voxel-rig.ts` 的 `2.04` 段。
> 配置：`config/game.json` → `view.gait.idleStance`。

## 一、要解决的现象

旧版站定是「两脚并拢、全身归零」：走路停下后，腿在 `stopBlendSec` 里被收回并拢，
再站成一块正对前方的方块。三个读感问题：

1. **不像活人**：真人格斗站姿是一脚前一脚后、重心压在一条腿上（contrapposto）；
2. **停步像「抽脚」**：刚踩出去那只脚被硬生生收回来再并拢，等于把最后一步撤了；
3. **和攻击起手接不上**：起手第一帧要把并拢的腿重新分开，与待机是两个姿态。

## 二、三条「不写」

`solveIdleStance` 只输出**腿角 / `pelvisRoll` / `sideLean` / `hipYaw`**，并把 `sink`、
`shift` 单独返回。三条禁区，每一条都对应一次踩过的坑：

| 不写 | 原因 |
|---|---|
| `pelvisX` / `pelvisY` | 腿是 FK 挂在下盘上的，搬骨盆会**连脚一起搬** —— 要么穿地，要么整体滑步。重心转移必须走「骨架层的 IK 基准之后」那条路（与 `kneeSink`、停步惯性同一套机制） |
| 膝角 | 屈膝由 `sink`（骨盆下沉）+ 足部 IK 反解得出。同时写膝角等于给了两遍，脚会离地 |
| 手臂通道 | 站姿不接管手臂：垂手 / 持械角由 `stanceCfg`（`view.weaponStance`）与步态摆臂决定 |

`sink` / `shift` 在 `captureIKBase` **之后**生效：`pelvis.position.y -= idleSink`，
`ikW <= 0` 时再把下半身整体补回去（`lower.position.x -= idleShift`），腿才不会跟着平移。

## 三、前脚 = 最后踩出去的那只

不是随机、也不是固定的左脚。停步那一帧锁定：

```ts
stopT = 0; stopPhase0 = c.gaitPhase;
idleFrontLeft = leadFootIsLeft(c.gaitPhase, gaitCfg.plantLock);
```

`leadFootIsLeft` 与 `solveStopInertia` 的 `leadLeft` **共用同一条判据**
（`footOffset(phase, plantLock) > 0`）。这条一致性是硬要求：两处判据不同时，会出现
「惯性把左脚踩出去、斜跨却把右脚留在前面」—— 脚在原地打了个对调。

锁定只发生在**进入停步的那一帧**，之后整个站定期不变。所以站定后左右脚不会自己换。

## 四、权重：按速度门控，不是「停下就切」

```ts
idleStanceTarget(speed, cfg) = clamp((exitSpeed - speed) / (exitSpeed - enterSpeed), 0, 1)
rate = target > w ? smoothing : smoothing * 0.85   // 进慢退快
w += (target - w) * (1 - Math.exp(-rate * dt))
```

| 参数 | 默认 | 含义 |
|---|---|---|
| `enterSpeed` | 0.18 m/s | 低于它开始算「站定」 |
| `exitSpeed` | 0.55 m/s | 高于它完全交还步态 |
| `smoothing` | 7 | 一阶平滑速率（进入用它，退出乘 0.85） |
| `frontPitch` / `backPitch` | 0.16 / 0.14 rad | 前脚往前踩、后脚往后蹬的角度 |
| `frontKnee` | 0.03 rad | 前脚膝盖的额外屈曲（后腿靠 `sink` 沉） |
| `shift` / `sink` | 0.03 m / 0.012 m | 重心向承重腿侧移 / 骨盆下沉 |
| `pelvisRoll` / `torsoLean` | 0.05 / 0.06 rad | 骨盆向承重侧倾 / 上身反向压回 |
| `hipYaw` | 0.16 rad | 下半身斜对前方（**「斜跨」的读感来源**） |
| `sway` | 1 | 缓慢微摆倍率（周期 ≈ 5.5s，重心画一个 8mm × 6mm 的小椭圆） |

进慢退快是有意的：进入时是「重心沉下去」，太快像被拽；退出时玩家已经推杆要走，
晚一帧就变成「起步先顿一下」。

**互斥条件**：`c.grounded && !attacking && !knockActive && !turnActive`。
攻击 / 受击 / 原地转身本来就在动腿，叠一个站姿只会互相抵消。

## 五、`hipYaw` 才是「斜跨」

只加大前后脚角度时，正面看仍然是「正对前方的两脚前后站」，读不出斜跨。
`hipYaw` 只转**下半身**（`lower.rotation.y += idleHipYaw`），胸口仍朝目标 ——
这是格斗站姿（髋部侧对、上身正对），不是休闲站姿（整个人侧过去）。

调整顺序建议：先 `hipYaw` 定「斜多少」，再 `shift` / `pelvisRoll` 定「压多重」，
最后 `frontPitch` / `backPitch` 定「站多开」。反过来调会把前后脚越加越大去凑读感。

## 六、和 `mixLowerGait` 的区别

`mixIdleStance` 是全字段混合（**含 `sideLean`**）。不能复用 `mixLowerGait`：那个函数
刻意保留 `a` 的 `sideLean`（它服务于「攻击时只接管下盘」），拿它混站姿会出现
「腿站过去了、上身还正着」，看起来像两次独立的位移拼在一起。

## 七、验收

```bash
npx vitest run tests/v9s55-idle-stance.test.ts    # 纯函数 5 例 + 骨架集成 6 例
python3 tools/stance-shot.py                      # 正面 / 侧面 / 走 / 停步中 / 停定 + 读数
```

- 站定 90 帧 `idleW > 0.98`；走起来 120 帧归 0（`__harness.gaitDebug().idleW`）；
- 关闭开关（`idleStance.enabled = false`）时腿角全部精确为 0 —— 几何逐字节回到旧行为；
- `tools/stance-shot.py` 会打印 `idleW / idleFrontLeft / idleHipYaw / idleSink / idleShift`。

> **注意**：斜跨会污染那些「关掉后必须精确归零」的对照用例（hurt-rig / landing-buffer /
> attack-lower-body 等 11 个）。它们统一用 `tests/mech-gait.ts` 的 `GAIT_NO_IDLE` 关掉站姿，
> 否则测的就不是原来的契约了。

## 八、已知限制

1. **转向时不接管**：`turnActive` 期间站姿权重为 0，转身完成后再升回来，中间有 0.15s 的
   「并腿」过渡。要消掉得让站姿跟着转身进度插值（成本高，暂记）。
2. **只支持前后跨**：`frontKnee` 是单值，不能做「前脚内八 / 外八」。
3. **`sway` 周期写死 1.15 rad/s**（≈5.5s），不进配置。
