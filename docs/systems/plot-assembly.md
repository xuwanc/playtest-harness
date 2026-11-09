# 动态地块拼合（v9s.46）

> **规则正本**。用户 2026-11-09 定的新约定：两边同时加同一个位置的地块不能冲突，
> 场景改成动态拼合；工位传送按拼合后的实际位置；地块带测试按钮就地生成假人 / 陪练；
> 每次 agent 完成任务都要更新线上并贴链接。3 分钟入口：[`../../AGENTS.md`](../../AGENTS.md)。

## 1. 为什么：旧做法必然冲突

旧做法是往 `config/game.json` 的 `scene.stations[]` 里追加一条、并手写一组**绝对坐标**：

- 两个 agent 同时改同一个数组 → git 冲突；
- 两个 agent 都想把地块放在「出生点旁边」→ 两块地叠在一起；
- 工位传送读的是各自手写的 `spawnX/spawnZ`，改了布局就得逐个改数字。

多 agent 并行时这三点会反复发生。根本原因是**大家都往同一个文件写、还都得自己算坐标**。

## 2. 解法：一地块一文件 + Core 确定性拼合

| 层 | 文件 | 职责 |
|---|---|---|
| 声明 | `config/plots/<id>.json` | **一个地块一个文件，不写世界坐标**，只写相对布局意图 |
| 拼合 | `src/core/plot-assembly.ts` | 纯函数 `assemblePlots()`：排序 → 分配不重叠槽位 → 解算绝对坐标 |
| 契约 | `src/core/types.ts` | `PlotDef` / `PlotLayout` / `AssembledPlot` / `PlotAssembly` |
| 注入 | `src/config.ts` | `import.meta.glob` 加载全部地块文件，调用拼合器，把结果注入 `SCENE_CONFIG` |
| 测试夹具 | `tests/helpers.ts` | 用 Node fs 读同一批文件 + 同一个拼合器，保证测试与线上一致 |

`config/game.json` 里**已删除** `scene.stations` 与 `scene.grass.plots` —— 这两处现在是运行时
唯一来源，任何人都不该再往 `game.json` 里加工位或草块区域。

### 为什么不再冲突

1. 每个 agent **只新建自己的 `config/plots/<id>.json`**，不改别人的文件，也不改 `game.json`；
2. `assemblePlots()` 按 `id` **字典序**排序，拼合结果与文件加载顺序、agent 提交先后完全无关；
3. `auto` 地块依次从网格里挑**第一个不与任何已占用圆重叠**的槽位，两边都想要「同一个位置」
   也各得其所、自动顺延，永不叠放。

## 3. `PlotDef` 字段（`config/plots/<id>.json`）

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | 稳定唯一 id，决定拼合顺序。文件名即 id，如 `config/plots/sparring-demo.json` |
| `name` / `hint` | ✓ | 工位名 / 一句话「来这里测什么」 |
| `index` | — | 工位序号（1 起），省略则由拼合器接着最大 index 自动编号 |
| `shape` / `radius` / `color` | — | 地面盘外观，省略用 `PlotLayout` 默认值 |
| `anchor` | — | **仅历史固定工位**：显式世界中心 `{x,z}`。新地块一律省略 |
| `spawn` / `label` | — | 传送落点 / 标牌相对地块中心的偏移 `{dx,dz}` |
| `grass` | — | 该地块自带的草块区域（格坐标相对中心）；`absolute:true` 表示绝对格坐标 |
| `testSpawn` | — | 测试按钮配方（见 §5） |
| `owner` | — | 归属说明，只用于文档与诊断 |

**关键**：除了 `anchor`（历史兼容），文件里不出现任何世界坐标。
新地块的位置完全由拼合器决定 —— 这正是消除冲突的根本。

## 4. 拼合算法与工位传送

`assemblePlots(defs, layout)`：

1. 去重（重复 `id` 记入 `diagnostics.duplicates`）+ 按 `id` 字典序排序；
2. `pinned`（带 `anchor` 的历史工位）先占位，中心就是 `anchor`，**历史布局逐字节不变**；
3. 其余 `auto` 地块按排序依次找第一个不重叠槽位：
   `x = originX + col*stepX`、`z = originZ + row*stepZ`；
   超出 `layout.bounds` 的槽位直接跳过（宁可报 `unplaced`，也不把地块塞到地图外）；
4. 把「拼合后的中心 + 相对偏移」解算成 `StationSpec` 与 `GrassPlotSpec` 的绝对坐标；
5. 结果按 `index` 排序返回，附带 `diagnostics`（`duplicates` / `relocated` / `unplaced`）。

默认布局 `DEFAULT_PLOT_LAYOUT` 从正北干净空带 `(0,14)` 起向西 / 向南铺开，
经 `config/game.json` 的 `worldBounds` / 碰撞盒 / 草场范围校验：前 5 块自动地块的
传送落点都在边界内、不嵌碰撞盒、不抢 `(2,6)` 空处。要调布局只改 `src/config.ts` 的
`PLOT_LAYOUT`（或覆盖 `DEFAULT_PLOT_LAYOUT`），不要回头写死坐标。

**工位传送**：`lab-panel.ts` 的 `goto()` 读的是 `StationSpec.spawnX/spawnZ`，而它来自拼合结果，
因此天然「跟着地块实际拼合位置走」。新加一个地块，面板里自动多一行、点一下就传送过去，
不需要任何额外接线。

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
  动态扩容 / 缩容 `dummyRigs` / 环 / 光晕 / 预警弧 / 缓动量，并刷新射线拾取的
  `userData.dummyId`。`view.dummyRenderCount()` 应与 `world.dummies.length` 严格相等。

验收读数（浏览器控制台 / 自动化）：

```
__harness.plotDebug()      // 地块数 / 每个 id·placement·slot·center·spawn / diagnostics /
                           // dummies / rendered / testUnits
__harness.spawnAt(id)      // 在指定地块就地生成，返回数量
__harness.clearSpawned()   // 清除全部测试单位，返回数量
__harness.lab.goto(id)     // 传送（读拼合后 spawnX/spawnZ）
```

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
  "owner": "agent-A / v9s.46",
  "testSpawn": { "label": "生成 3 人", "dummies": 1, "fighters": 2 }
}
JSON
# 2) 全链验证
npm run verify
# 3) 更新线上并把打印出来的链接贴进任务回复
npm run publish:preview
```

不要改 `config/game.json`、不要改 `src/config.ts`、不要手写 `x/z/spawnX/spawnZ`、
不要新建第二个 HTML 场景。新增地块会自动出现在工位面板里。

## 8. 反例

| 做法 | 为什么不行 |
|---|---|
| 往 `config/game.json` 的 `scene.stations` 追加一条 | 回到多 agent 冲突的根源 |
| 在新地块文件里写 `x/z/spawnX/spawnZ` 绝对坐标 | 抢位置、叠放，拼合器白做 |
| 复制一份 `three-scene.ts` 给新地块渲染 | 逻辑分叉，「看到的」≠「主线接入的」 |
| 改完只 commit 不同步线上 | 别人 / 用户没法快速验证，违反新规则 |
| 用 `push` 代替 `publish:preview` | 两者不是一回事；push 需用户明确通知 |

## 关联

- 上手入口：[`../../AGENTS.md`](../../AGENTS.md)
- 测试场景规则：[`test-scene-policy.md`](test-scene-policy.md)
- 分支 / 提交 / 冲突分类：[`multi-agent-workflow.md`](multi-agent-workflow.md)
- 单测：`tests/plot-assembly.test.ts`、`tests/plot-spawn.test.ts`
- 发布脚本：`tools/publish-preview.mjs`
