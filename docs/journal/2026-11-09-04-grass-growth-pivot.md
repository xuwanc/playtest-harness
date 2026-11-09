# 2026-11-09-04 · v9s.44 缓慢生长 / 枢轴顶点动画

> 用户需求（原话）：「1.草地生长降低存在感可以缓慢长长，现在太突然了
> 2.草地受风力影响改成枢轴顶点动画，保持草的每节box」。
> 前置批次：[`2026-11-09-03-dynamic-plots.md`](2026-11-09-03-dynamic-plots.md)。
> 实现正本：[`../systems/grass-growth-pivot.md`](../systems/grass-growth-pivot.md)。

## 1. 问题定位

- **①「太突然」**：`b.cut` 从 `regrowSec`(=6) 线性递减，表现层只在 `cut !== 0` 时画断茬
  （上段隐藏、下段 34%、断茬色），`cut` 一归零就**整根瞬间弹回满高本色**。
  痛点在「长回」那一帧的跳变，不在割断那一刀（割断有碎片反馈，是合理反馈）。
- **②「保持每节 box」**：v9s.41 的风在 `<begin_vertex>` 对单位 box 顶点按 `h²` 加权
  **位移（shear）**，box 被拉成斜平行四边形；且两段共用同一位移场、没有「节」。

## 2. 解法

| 需求 | 做法 |
|---|---|
| 缓慢生长 | Core 新增纯函数 `grassGrowth(cut, regrowSec, phase)`：`p = 1 - cut/r` → 逐根错峰（0.18，由 `yaw` 派生）→ smoothstep。表现层按 `grow` 连续插值 `curH`，重新分配下段 / 上段高度、颜色 `stump → 本色` 淡回；`grow` 纳入脏标记 |
| 枢轴顶点动画 | 风 shader 从 `<begin_vertex>` 改为替换 `<project_vertex>`：在缩放之后的世界空间对每节 box 绕底部枢轴做**刚体旋转**（Rodrigues），下段绕草根转 `LOW·θ`、上段继承后绕下段顶端再转 `UP·θ`，节间无缝、`LOW/UP = 0.4/0.6` |

- 角度 `θ = atan2(sway, LOW·hBase + hTip)`（**有效力臂**），顶端位移仍 ≈ `amplitude`，
  旧调参手感不回退；常量由 Core 插值注入 GLSL，CPU / GPU 不漂移。
- 新增静态实例属性 `aWindRoot`(vec3 草根 `P0`) / `aWindGeom`(vec4)；
  `alive = 当前段高 / 设计段高` 让**生长中矮草摆幅自动减弱**。
  `customProgramCacheKey` → `grass-wind-pivot-v2`。
- `GrassDebug` 加 `growing` / `avgGrowth` / `sampleHeight` 读数、`wind.mode = 'pivot'`。

## 3. 零回归的关键取舍

- **不新增 World 字段、不改任何进快照的配置数值**：`grow` 完全由既有 `cut` 派生，
  是纯函数、不累积 `frameDt` → 暂停 / 慢放 / 快照回放天然成立。
- 曾把 `regrowSec` 6→8 想让「缓慢」更明显，但 `world.config` 会进
  `snapshot = JSON.stringify(world)`，golden 立刻从 `5562e496…` 漂移 → **改回 6**，
  改由 smoothstep 曲线提供观感。结论：这类「进快照的数值」不动，观感交给表现层曲线。
- 表现层把 `hBase / curH` 计算提到 `changed` 判断之外，让 `sampleHeight` 每帧稳定可读
  （不受脏标记跳过影响）。

## 4. 验证

| 项 | 结果 |
|---|---|
| `npx tsc --noEmit` / `npm run build` | 0 error / ✓ |
| `npx vitest run` | **948 通过**（原 938 + 新增 `tests/grass-growth-pivot.test.ts` 10 例），golden `5562e496…` **未变** |
| `npm run verify:portable` | PASS（Core 28 文件边界未破，新增纯函数不 import three / DOM） |
| `npm run docs:check` / `npm run smoke` / `npm run verify` | 全绿（smoke 31→33 项） |
| 浏览器（桌面 / 手机 / 公网） | 零控制台错误；`wind.mode = 'pivot'`；割 60 根后 `sampleHeight` 0.2474→1.0000，**56 个不同中间值、单调、最大单步 0.0342**，`cut` 归零前已 0.9997（到点不弹）、暂停时 `sampleHeight` 与 `cut` 双双定格 |
| 单测 | 单位 box 8 顶点旋转后**两两距离不变**（刚体，box 不被 shear 拉歪）、两级枢轴节间无缝、顶端朝风向弯折 |

## 5. 下一步 / 注意

- 本轮本地 commit（不 push，按约定等用户明确通知）；线上预览按新规则
  `npm run publish:preview` 同步并贴链接。
- 若仍觉得「长回」偏快，调 `core.grass.regrowSec` 是**配置变更**（会让 golden 漂移，
  需 `-u` 更新并记契约变更）；更推荐先调 Core `grassGrowth()` 缓动形状 /
  `GRASS_GROWTH_STAGGER`，不动快照。
- 版本 `0.9.63`；截图 `/workspace/grass-growth-{base,mid,done}.png`。
