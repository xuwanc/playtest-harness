# 造型工坊（voxel forge）

> v9s.51 · 写一份 JSON、立刻看到方盒子角色，满意后一键导出成能贴进 rig 的 TS 片段。
> 它**不做动画**（动作仍由各 rig 的 IK / 步态负责），只解决「造型迭代太慢」。
>
> 代码：`tools/voxel-forge/forge.html` + `forge.js`（约 380 行，纯浏览器 ES module） ·
> 截图：`python3 tools/voxel-forge/shot.py`

## 1. 为什么做这个

原来改一个盒子的尺寸要走 **改 TS → tsc → build → 开游戏 → 截图**，一轮约 40 秒。
而且第三人称相机固定 2.5D 俯角，**造型的很多问题在游戏截图里根本看不出来**——
v9s.51 就是这么发现两个老 bug 的：

| 问题 | 游戏里 | 工坊里 |
|---|---|---|
| 8 只眼飘在头前面 4~11 cm | 看着还行（视角掩盖了 z 偏移） | 侧面图一眼看出眼睛悬空 |
| 头胸甲与腹部同高、糊成一块 | 像一根长条盒子 | 侧视图两节等高，没有「腰」 |

工坊的价值不在画质，在于**视角自由**：任意 yaw / pitch / 距离，想从哪看就从哪看。

## 2. 怎么用

```bash
# 默认示例（体素小人，4 个角度）
python3 tools/voxel-forge/shot.py

# 指定 spec 与自己要的角度
python3 tools/voxel-forge/shot.py --spec specs/spider-body.json --angles 15,90,180 --pitch 14

# 浏览器里交互（拖拽旋转 / 滚轮缩放 / 右键平移）
python3 -m http.server 8080 --directory .
# → http://127.0.0.1:8080/tools/voxel-forge/forge.html?spec=/tools/voxel-forge/specs/spider-body.json
```

产物：

```
shots/forge/<spec 名>/
├── 01-yaw030.png …        每个角度一张
└── <spec 名>.parts.ts     可直接粘进 rig 的 TS 片段
```

`shot.py` 同时打印 `parts / mesh / tris / size / center` —— **合并后的 mesh 数**是
造型阶段就要盯的指标，不是等到上手机才发现 draw call 爆了。

## 3. spec 格式

全部单位米、角度度。`boxes` 的九元组与 `spider-rig.ts` 的 `Part` 完全一致：

```json
{
  "name": "spider-body",
  "scale": 1,
  "parts": [
    {
      "id": "carapace",
      "parent": "body",
      "at": [0, 0, 0.15],
      "rot": [0, 0, 0],
      "color": "#3c3358",
      "boxes": [[0.300, 0.036, 0.300, 0, -0.030, 0]]
    },
    {
      "id": "eyes",
      "parent": "carapace",
      "color": "#f0405e",
      "glow": true,
      "boxes": [[0.030, 0.030, 0.014, -0.034, 0.084, 0.110]]
    }
  ]
}
```

| 字段 | 说明 |
|---|---|
| `id` | 节点名，`parent` 用它引用；必须**先于子节点出现** |
| `parent` | 缺省挂到根；用于关节组（髋 / 膝 / 摆臂） |
| `at` / `rot` / `scale` | 该节点的局部变换（`rot` 是度，顺序 XYZ） |
| `color` | 该 part 全部盒体的**顶点色**（一个 part = 一个 mesh） |
| `glow` | `true` 用 `MeshBasicMaterial`（不参与光照，眼睛用） |
| `boxes` | `[w, h, d, x, y, z, rx?, ry?, rz?]`，先旋转再平移 |

**一个 part 的所有盒子共用一个颜色。** 这是刻意的：与 `spider-rig.ts` 的 `partMesh`
同一套约定，所以导出的片段可以直接用；想多色就拆成多个 part。

## 4. 和 rig 的关系

```
spec（草稿）──forge 预览──► 定稿 ──exportTs / 手抄──► *-rig.ts（成品）
```

工坊**不参与构建、不进 dist、不参与测试**。它产出的是「几何常量 + 颜色」，
动作、IK、步态仍然只在 rig 里。这条边界必须守住：把动作也塞进 spec，
就会长出第二套动画描述，两份必然不同步。

## 5. 踩过的坑

| 现象 | 原因 | 修法 |
|---|---|---|
| 整只角色发灰、暗三分之一 | `Color.setStyle()` 在 r152+ 已把 sRGB 转到工作空间，又补一次 `convertSRGBToLinear()` 等于转两遍 | 顶点色只 `setStyle`，不再转换 |
| 不同颜色的盒子没法合并 | 按材质分组只能整块同色，8 层腹部会糊成一个盒子 | 颜色写进 `color` attribute，一个 Lambert 材质吃全部顶点色 |
| 眼睛在预览里像贴纸 | 眼的 z 超出甲壳前立面 | 眼必须贴在**顶层甲壳半深**之内（本例 0.114） |

## 6. 什么时候别用它

- 验证**动作**（步态、挥击、受击）→ 开游戏，或 `tools/spider-hero-shot.py`；
- 验证**材质 / 光照**（本项目是纯色 Lambert，没有贴图）→ 没有这个需求；
- 角色已经定稿、只改一个数字 → 直接改 rig 更快。
