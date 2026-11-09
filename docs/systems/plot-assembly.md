# 动态地块拼合（v9s.49）

> **规则正本**。用户 2026-11-09 定的新约定：两边同时加同一个位置的地块不能冲突，
> 场景改成动态拼合；工位传送按拼合后的实际位置；地块带测试按钮就地生成假人 / 陪练；
> 每次 agent 完成任务都要更新线上并贴链接。3 分钟入口：[`../../AGENTS.md`](../../AGENTS.md)。
>
> v9s.49 起**底板也按地块拆开**：每块地自带一张 `span` 格的承重地板，进场景时整数格拼合。
> 设计稿与取舍见 [`../decisions/ADR-009-plot-slabs.md`](../decisions/ADR-009-plot-slabs.md)。

## 1. 为什么：旧做法必然冲突

旧做法是往 `config/game.json` 的 `scene.stations[]` 里追加一条、并手写一组**绝对坐标**：

- 两个 agent 同时改同一个数组 → git 冲突；
- 两个 agent 都想把地块放在「出生点旁边」→ 两块地叠在一起；
- 工位传送读的是各自手写的 `spawnX/spawnZ`，改了布局就得逐个改数字；
- 全场景只有**一块 32×32 的底板**，第 10 块测试地只能挤缝里（`sparring-demo` 北缘已出界 0.5m）。

多 agent 并行时这几点会反复发生。根本原因是**大家都往同一个文件写、还都得自己算坐标**。

## 2. 解法：一地块一文件 + 整数格拼合

| 层 | 文件 | 职责 |
|---|---|---|
| 声明 | `config/plots/<id>.json` | **一个地块一个文件，不写世界坐标**，只写占几格、相对偏移、自带物件 |
| 拼合 | `src/core/plot-assembly.ts` | 纯函数 `assemblePlots()`：排序 → 整数格 first-fit → 解算绝对坐标 + 地板 |
| 注入 | `src/core/plot-assembly.ts` | `applyPlotAssembly(core, scene, assembly)`：把结果灌进配置，**组装层与测试夹具共用** |
| 契约 | `src/core/types.ts` | `PlotDef` / `PlotLayout` / `AssembledPlot` / `SlabSpec` / `PlotAssembly` |

`config/game.json` 里**已清空** `scene.stations` / `scene.slabs` / `steps` / `doorways` /
`obstacles` / `dummies.spawn` —— 这些现在是运行时唯一来源，任何人都不该再往 `game.json` 里写坐标。

### 为什么不再冲突

1. 每个 agent **只新建自己的 `config/plots/<id>.json`**，不改别人的文件，也不改 `game.json`；
2. `assemblePlots()` 按 `id` **字典序**排序，拼合结果与文件加载顺序、agent 提交先后完全无关；
3. 槽位是**整数格**，不重叠是构造性的（占用表是 `Set`，不用浮点圆相交）；
4. 加一块地只往地图边缘长，**不挪旧板**（只有 `id` 排序在前才会让后面顺延，所以 id 发布后不改名）。

## 3. `PlotDef` 字段（`config/plots/<id>.json`）

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | 稳定唯一 id，决定拼合顺序。文件名即 id，如 `config/plots/sparring-demo.json` |
| `name` / `hint` | ✓ | 工位名 / 一句话「来这里测什么」 |
| `span` | — | 占几格 `[列, 行]`，1 格 = 5 m。默认 `[2,2]` = 10×10。见下表 |
| `pin` | — | `"origin"` 把这块钉在世界原点（**同一份配置只允许一块**，就是 `hub`） |
| `index` | — | 工位序号（1 起），省略则由拼合器接着最大 index 自动编号 |
| `shape` / `radius` / `color` | — | 地面盘外观；`radius` 只决定盘画多大，与占地无关 |
| `spawn` / `label` | — | 传送落点 / 标牌相对板中心的偏移 `{dx,dz}`；`label` 省略则贴板南沿内侧 |
| `grass` | — | 该地块自带的草块（格坐标相对中心）；`absolute:true` 表示绝对格坐标 |
| `steps` / `doorways` / `obstacles` | — | 自带地形，字段同 `StepSpec` 等，但坐标写成 `dx/dz` |
| `dummies` | — | 自带初始单位：`{dx,dz,mode?,fighter?,weapon?}`；`fighter:true` = 持械陪练 |
| `destructibles` | — | 自带可破坏物件（`dx/dz`，见 `destructible` 契约） |
| `testSpawn` | — | 测试按钮配方（见 §5） |
| `owner` | — | 归属说明，只用于文档与诊断 |

**关键**：文件里不出现任何世界坐标。位置、地板、边界全部由拼合器决定。

常用 `span`：

| span | 尺寸 | 典型用途 |
|---|---|---|
| `[1,1]` | 5×5 | 单个道具 / 单假人 |
| `[2,1]` | 10×5 | 一字排开的量具 |
| `[2,2]` | 10×10 | **默认**：圆盘工位、陪练场、可破坏物 |
| `[2,4]` | 10×20 | 冲刺跑道（`dash` 沿 z 要 19 m 直线） |

## 4. 拼合算法

`assemblePlots(defs, layout)`：

1. 去重（重复 `id` 记入 `diagnostics.duplicates`）+ 按 `id` 字典序排序；
2. `pin:'origin'` 的地块先占格 `(0,0)`（只认第一块，其余顺延成 auto）；
3. 其余按排序**行优先 first-fit** 扫描：从 `(0,0)` 起逐格试，`span` 覆盖的格子全空就占位；
   `columns × maxRows` 扫完仍放不下 → `diagnostics.unplaced`，继续下一块（不抛错）；
4. 整体平移，让 **pin 板中心落在世界原点** —— 出生点 `core.spawn` 就在 `hub` 板上；
5. 每块地生成一张 `SlabSpec`（顶面 `y=0`、厚 0.4、齐边），包围盒内的**空格自动补填充板**
   （`plotId: ''`，行内连续空格合并成一条），所以不管怎么摆脚下都是连续地面；
6. 自带物件（台阶 / 门洞 / 障碍 / 假人 / 草块 / 可破坏物）按「板中心 + 相对偏移」解算；
7. 结果按 `index` 排序返回，附 `diagnostics`（`duplicates` / `unplaced`）。

**边界不再手写**：`worldBounds` = 地板包围盒内缩 0.5 m，`gridMeta` 按 0.5 m 格对齐向外取整，
都由 `applyPlotAssembly` 推导。`scene.ground.size` 只作为兼容字段写入等价值（有 `slabs` 时不读）。

**工位传送**：`lab-panel.ts` 的 `goto()` 读 `StationSpec.spawnX/spawnZ`，来自拼合结果，
因此天然「跟着地块实际位置走」。新加一块地，面板里自动多一行、点一下就传送过去。

当前 9 块地的拼合结果（6 列 × 8 行，30×40 m）：

```
        c0        c1        c2        c3        c4        c5
 r6-r7  x-destr  │ 填充    │ 填充    │ 填充    │ 填充
 r4-r5  sparring │ terrain │ windup
 r2-r3  meter    │  dash   │ rings
 r0-r1  hub      │  dash   │ gait
```

第 10 块地（`span:[2,2]`）落在 `r8`，只往北长 10 m，旧板一格不动。

## 5. 地块测试按钮

`PlotTestSpawn` 配方：`dummies`（普通假人数）/ `modes` / `fighters`（持械陪练数）/
`weapons` / `ringRadius` / `startDeg` / `label`（按钮文案）。

- Core：`src/core/plot-spawn.ts` 的 `spawnPlotTestUnits(world, plot)` /
  `clearPlotTestUnits(world)` / `plotTestUnitCount(world)`。生成的单位带
  `spawnedByPlot` 标记，**基线单位没有**，所以 World 初始快照逐字节不变；
  固定角度环形排布，不用随机源。
- 这是**运行时调试操作**（与 `warpTo` / `resetDummies` 同级），不进 `Intents` / `step`，
  不影响确定性回放 / golden snapshot。
- 面板：`lab-panel.ts` 的「地块测试」分区，每个带 `testSpawn` 的地块一枚按钮。
  点了**先传送到该地块**（拼合后的落点），再就地生成；「清除测试单位」回到基线。
- 表现层：`three-scene.ts` 的 `syncDummyCapacity()` 每帧按 `world.dummies.length`
  动态扩容 / 缩容。`view.dummyRenderCount()` 应与 `world.dummies.length` 严格相等。

验收读数（浏览器控制台 / 自动化）：

```
__harness.plotDebug()      // count / diagnostics / bounds / slabs[] / plots[]（含 cell·span·slab）
                           // dummies / rendered / testUnits
__harness.spawnAt(id)      // 在指定地块就地生成，返回数量
__harness.clearSpawned()   // 清除全部测试单位，返回数量
__harness.lab.goto(id)     // 传送（读拼合后 spawnX/spawnZ）
```

`plotDebug().slabs[]` 里 `plotId === ''` 的是填充板 —— smoke 的「铺满包围盒、无缝无洞」
就是拿它和真实地板一起做 0.5 m 采样验证的。

## 6. 每次任务完成更新线上并贴链接

`npm run build && npm run publish:preview` → `tools/publish-preview.mjs` 只做三件事：

1. 确认 `dist/index.html` 存在（没有就提示先 build）；
2. 调沙箱发布服务把 `dist/` 整体替换上线（同一站点覆盖，链接不变）；
3. 解析 `shareLink` / `verified`，未通过校验就非零退出，通过则打印**唯一**链接。

链接只认 [`../state/CURRENT.md`](../state/CURRENT.md) 里那一条（v9s.46 起收敛，
不再有第二条 `main.html` 域名）。这是发布，**不是 GitHub push**；
push / `gh-commit.mjs --apply` 仍需用户明确通知，见 [`multi-agent-workflow.md`](multi-agent-workflow.md)。

## 7. 新 agent 加一块地（3 步）

```bash
# 1) 只新建自己的文件，不写世界坐标
cat > config/plots/my-feature.json <<'JSON'
{
  "id": "my-feature",
  "name": "我的功能试炼场",
  "hint": "点生成按钮摆出陪练，测 XX 手感",
  "span": [2, 2],
  "owner": "agent-A / v9s.49",
  "testSpawn": { "label": "生成 3 人", "dummies": 1, "fighters": 2 }
}
JSON
# 2) 全链验证（会跑拼合单测 + smoke 的地板采样）
npm run verify
# 3) 更新线上并把打印出来的链接贴进任务回复
npm run publish:preview
```

不要改 `config/game.json`、不要改 `src/config.ts`、不要手写 `x/z/spawnX/spawnZ`、
不要新建第二个 HTML 场景。新增地块会自动出现在工位面板里，地板也会自动铺出来。

## 8. 反例

| 做法 | 为什么不行 |
|---|---|
| 往 `config/game.json` 的 `scene.stations` 追加一条 | 回到多 agent 冲突的根源 |
| 在新地块文件里写 `x/z/spawnX/spawnZ` 绝对坐标 | 抢位置、叠放，拼合器白做 |
| 把 `span` 写成 `[2.5, 2]` | 格子必须整数；小数会被 `Math.round`，落位与预期不符 |
| 改已发布地块的 `id` | 等于重排，所有排在它后面的地块都会挪位 |
| 复制一份 `three-scene.ts` 给新地块渲染 | 逻辑分叉，「看到的」≠「主线接入的」 |
| 改完只 commit 不同步线上 | 别人 / 用户没法快速验证，违反新规则 |
| 用 `push` 代替 `publish:preview` | 两者不是一回事；push 需用户明确通知 |

## 关联

- 上手入口：[`../../AGENTS.md`](../../AGENTS.md)
- 测试场景规则：[`test-scene-policy.md`](test-scene-policy.md)
- 设计取舍：[`../decisions/ADR-009-plot-slabs.md`](../decisions/ADR-009-plot-slabs.md)
- 分支 / 提交 / 冲突分类：[`multi-agent-workflow.md`](multi-agent-workflow.md)
- 单测：`tests/plot-assembly.test.ts`、`tests/plot-spawn.test.ts`
- 发布脚本：`tools/publish-preview.mjs`
