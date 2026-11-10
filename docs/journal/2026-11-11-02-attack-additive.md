# 2026-11-11-02 · 攻击层改成四元数增量（v9s.73）

> 用户：「改攻击层方式吧」—— 即 `pose-layers.md` §6.2 的第 2、3 步。
> 一句话结果：**躯干从「欧拉逐轴覆盖」变成「四元数增量」，手臂保持覆盖（有硬理由），
> 老调校 1278 例全绿，满权重与旧值逐位一致。**

## 1. 为什么要改

旧链路是 `blendCombatPose(w)`：把基础姿势与攻击姿势的**欧拉分量逐轴 lerp**。

```
upper.rotation.x = mix(base.x, attack.x, w)
```

三个天花板（§6 早有记录）：

1. 两个姿态差 150° 时，逐轴直着走出来的中间帧不沿最短弧 —— 观感是「先绕开再回来」；
2. 多轴同转时欧拉分量各自走，合成出来的角速度不匀，gimbal 附近会抖；
3. 只能表达「在 A 和 B 之间插值」，表达不了「这一层相对某个基准偏转了多少」——
   于是基础里多出来的东西（体型、站姿、将来的骨架差异）只能被权重稀释掉一半。

## 2. 做法

新增 `presentation/pose-quat.ts`，四个纯函数：

| 函数 | 式子 |
|---|---|
| `capturePoseQuat` | 逐节点抓局部四元数（`Float32Array`，xyzw 交错） |
| `deltaPoseQuat` | `ref⁻¹ ⊗ pose` |
| `composePoseQuat` | `base ⊗ slerp(I, delta, w)`，写回骨骼 |
| `poseDeltaAngle` | 最大单节点转角（验收用） |

`voxel-rig` 里：

- `captureBasePose()` 在抓欧拉快照的同时抓 `basePose`；
- 新增 `buildAttackReference(stance, stanceWeight)`：把持械站姿解成 `refPose`；
- `blendCombatPose(w)`：躯干走四元数合成，手臂 / 骨盆 / 位移保留逐轴插值；
- 调用条件从 `0 < w < 1` 改成 `w > 0`（满权重也要合成，否则基础层被整层覆盖）。

## 3. 三个坑（都踩了）

### 3.1 乘反了：`pose ⊗ ref⁻¹` 不是增量

第一版写 `delta = pose ⊗ ref⁻¹`，w=1 时得到的是 `ref ⊗ pose ⊗ ref⁻¹`（共轭），
肩膀偏 15°。正确写法是 `ref⁻¹ ⊗ pose`：局部空间里 `pose = delta ⊗ ref`。

写了一个最小用例（两个 `Object3D`、base=ref、w=1）才发现 —— **数学错误必须先用
纯函数钉住，否则会在骨架里被十几层姿态掩盖成「看起来差不多」**。

### 3.2 基准里混进了「步态摆臂」

一开始把手臂基准也取成持械站姿（`stance.armR.pitch = −0.12`），w=1 时肩角从 −0.95
变成 −1.14。原因是基础姿势里还有步态的 −0.19 rad 自然垂臂 —— 基准不含它，
它就被当成「基础多出来的东西」保留下来。

结论：**手臂的基准 = 当前基础姿势**（等价于覆盖）；只有躯干的基准才是站姿。

### 3.3 四元数→欧拉会翻支：举顶仰角 89° → 78°

`shoulder.rotation.order = 'YXZ'`。抬臂到 −1.9 rad 时四元数有两个等价欧拉解，
Three 挑到 `(x=−1.24, y=2.86, z=−3.01)`。朝向一模一样，但下游全按 `rotation.x`
读抬臂角 —— 剑身仰角反解、肩部 IK、举顶内收全错。

修法不是「让欧拉连续」（`rotation` 是 quaternion 的派生，写回去必然被重分解），
而是**把手臂排除在四元数路径之外**：`POSE_NODES` 只放 `[upper]`。
躯干的俯仰 / 偏航都在 ±1 rad 内，不会翻。

## 4. 顺手修的：`applyCombatPose` 吃掉站姿

攻击层的 y 是绝对量，所以 `applyCombatPose` 开头 `upper.rotation.y = 0`。
非攻击帧没有 blend 把站姿加回来 —— 剑盾的 0.12 rad 侧身站姿被清零，
`torsoYawOf` 从 0.12 掉到 0.03，`chest-yaw` 的两条用例直接红。

修法：归零前存 `baseUpperY`，在 `combatPoseW <= 0.001` 的返回分支里恢复。

## 5. 验收

| 项 | 结果 |
|---|---|
| `npx tsc --noEmit` | 0 error |
| `npx vitest run` | 127 文件 / 1278 例全绿（新增 9 例） |
| 唯一改动测试 | `v9s32` 的用例标题（语义从「让位」变「进基准」），断言未动 |
| 满权重等价性 | 剑盾 / 大剑的肩关节四元数与旧版逐位相同（`v9s73` 第 2 条 + 手工核对） |

## 6. 还没做

- 体态（2.96 段）仍在 capture **之后**写，所以 base 不含体态 —— 攻击时它仍是
  「叠在混合结果上」而不是「被攻击增量叠」。要真正实现「个性 Pose + 增量」，
  得把体态移到 capture 之前，同时把 `keep` 改成显式配置并复查 `POSTURE_MAX_TOTAL`。
- `lean` 已经是「攻击之后叠加」（顺序即解耦），但缺一个「攻击时惯性压多少」的旋钮。
- `chainBlend` 仍不分来源（`pose-layers.md` §7 第 5 条）。
