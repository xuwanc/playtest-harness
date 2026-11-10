# 2026-11-11 · 脊柱链从两级台阶变成一条曲线（v9s.72 / v0.9.92）

## 起因

v9s.70 把偏航修成「沿链单调」之后，用户问的其实是下一层：`lower → torsoLower → torsoUpper`
在模型空间里应该是一条**连续的**脊柱，而现在只是「每级方块绕自己底边转」——
两级台阶，接缝全靠补块盖。

行业做法不是补块：Unreal 的 `Layered Blend per Bone` 用 `Blend Depth` 让权重**沿链衰减**，
弯折被摊成一条曲线。段数一旦 ≥3，每级折角降到 1/3，缝按 `sin` 缩小 —— 这才是根上的修法。

## 做了什么

- `presentation/spine-chain.ts`（纯函数，13 例单测）：
  - `spineWeights(n, waist, chest)`：俯仰 / 侧倾的权重，沿链从 waist 线性过渡到 chest 再归一化；
  - `spineYawCurve(n, chainBlend)`：偏航的累计曲线 `c(x) = x^p`，`p` 由 `c(1/2) = chainBlend` 反解；
  - `normalizeSegments`：夹到 [2, 4]。
- `SpineViewConfig` 新增 `segments` / `pivots`，缺省 3 段、`[0.42, 0.72]`。
- `voxel-rig` 的脊柱链改成循环生成：`upper → spine1 → … → chest`，几何按段切块
  （`torsoLower` / `torsoMid{i}` / `torsoUpper`，每级宽 +4mm、顶面加长一截藏进上一级）。
- `splitSpine` / `distributeYaw` / `torsoTotal` 全部走数组；`spineDebug` 增加 `segments` / `midYaw`。

两段时两个公式都退化成 v9s.70 的原式（权重 `waist/(waist+chest)`、曲线首项 = `chainBlend`），
所以既有调校逐位不变，`N = 3` 才真正生效。

## 踩的坑：链的起点是 0，不是髋

第一版把累计角的起点写成 `hip`：

```
local_i = C_i − C_{i−1},  C_{−1} = hip   ← 错
```

所有局部角之和 = `总角 − hip`，整条链平白少掉一个 hip（实测 0.2 rad）。三个症状同时出现：

1. 帧尾守卫 `leak` 从 0 变成 0.017；
2. 头部 compensate 掉一个 hip，`headYaw` 差 0.009（测试容差 1e-6）；
3. `chest-yaw` 的「胸与下盘同向」偶发**符号翻转** —— 因为总角被扣掉 hip 后接近 0。

根因：`upper` 的父节点是 `pelvis`（yaw 恒 0），**不是 `lower`**。髋与躯干是兄弟。
正确写法是 `C_{−1} = 0`：末级累计落回总角，**首级的世界角**才锚在髋上。

## 验收读数（鱼人站姿，世界俯仰 / 偏航）

| | 第一级 | 第二级 | 第三级 |
|---|---|---|---|
| v9s.70 | 0°（骨盆） | 16.6° | 37° |
| v9s.72 俯仰 | 29.0° | 42.7° | 54.2° |
| v9s.72 偏航 | 8.6° | 10.4° | 11.6°（→ 12.6° 胸） |

俯仰每级 12.7°，缝 `sin(12.7°) × torsoD/2` 约 3.2cm（原 8.8cm），再叠补块 → 看不见。

## 测试

- 新增 `tests/v9s72-spine-chain.test.ts`（13 例）：段数夹取、权重归一与单调、曲线末项 / 两段退化、
  关节数量与高度、几何总高不变、俯仰分配、偏航总角与两段一致、三段下 leak = 0、四段不崩。
- 改写的既有断言：`v9s33-spine`、`v9s66-pose-space`、`v9s23-swing-body`、`v9s32-stance`、
  `v9s52-elder-style` —— 全部从「upper + chest」改成「整条链求和」（`tests/rig-nodes.ts` 的
  `spineChain` / `torsoYawOf` / `torsoPitchOf`），段数再改也不用动测试。

## 领号插曲

开工时 `git fetch` 又是挂的（`github.com:443` 间歇超时），按旧快照领了 0.9.92 / v9s.71；
提交前发现另一个 agent 的 `feat/wardrobe-v9091` 已经以 **0.9.92** 合并（Wardrobe 底部抽屉 +
盾面朝向），于是把远端那棵树逐文件取回来手工合并，重领 **0.9.93 / v9s.72**，代号全量替换。
教训坐实：**闸门第一步的 fetch 不能跳**，断网时要先 `gh api` 看一眼远端 main 的版本。

## 还没做

- 假人（`dummy-rig`）仍是一段躯干，没有 `splitSpine`；码头杂兵读到的是「一整块 + 髋块」。
- `chainBlend` 仍是单曲线，不区分偏航来源（下盘带转 / 攻击旋身 / 站姿斜跨）。
- 分段数改成 4 时，腰段位置（曲线中点）不变，但第 1、2 级会重新分配，需要再看一眼。
