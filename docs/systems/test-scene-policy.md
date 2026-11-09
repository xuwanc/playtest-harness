# 测试场景约定：单一主场景 + 动态拼合（v9s.46）

> **规则正本**。用户在 2026-11-09 定的三条规则，别的 agent 拉下 git 后按此执行。
> 3 分钟快速入口：[`../../AGENTS.md`](../../AGENTS.md)。
> 动态拼合的实现细节、`PlotDef` 字段表与拼合算法见 [`plot-assembly.md`](plot-assembly.md)。

## 规则 1：只保留主测试场景

- **唯一测试场景**：`index.html`（入口 `src/app.ts`，表现层 `src/presentation/three-scene.ts`）。
  `npm run dev` 打开它即可真人操控：摇杆移动、攻击、切换行为、传送工位、风开关。
- 历史上曾有第二套独立演示页 `grass-demo.html` + `src/grass-demo.ts`，**已删除**，
  构建改回单入口（`vite.config.ts`）。
- **禁止**：再新建独立测试场景 / 演示页 / 第二个 HTML 入口；复制 Core 或草层另写一套逻辑。
  一个功能只在一个场景里被验证，「看到的」必须等于「主线接入的」。

## 规则 2：新测试需求 = 新建一个地块文件，绝不写世界坐标

v9s.46 起，**取代**旧的「往 `config/game.json` 的 `scene.stations[]` 追加一条 + 手写绝对坐标」。

- 一地块一文件 `config/plots/<id>.json`，只写 `id/name/hint` 与相对布局意图；
- `config/game.json` 里**已删除** `scene.stations` 与 `scene.grass.plots`，不要再往回加；
- `assemblePlots()`（`src/core/plot-assembly.ts`）按 `id` 字典序排序、自动分配不重叠槽位，
  **两边同时想加同一个位置也各得其所、自动顺延**，从根上消除 git 冲突与地块叠放；
- **工位传送读拼合后的 `spawnX/spawnZ`**：面板自动多一行、点一下就传送到实际位置，
  不用改 `src/config.ts` / `app.ts` / `lab-panel.ts`，不用手写任何坐标；
- 地块带 `testSpawn` 时，面板自动多一枚「生成 N 人」测试按钮，先传送到该地块、再就地
  生成假人 / 持械陪练；「清除测试单位」回到配置基线；
- 新功能自带它需要的地块，和代码**同批提交**，别等别人补。

### 加一块地（3 步）

```bash
cat > config/plots/my-feature.json <<'JSON'
{
  "id": "my-feature",
  "name": "我的功能试炼场",
  "hint": "点生成按钮摆出陪练，测 XX 手感",
  "owner": "agent-A",
  "testSpawn": { "label": "生成 3 人", "dummies": 1, "fighters": 2 }
}
JSON
npm run verify
npm run publish:preview        # 更新线上 + 打印链接，贴进任务回复
```

只有改**布局网格 / 拼合算法本身**时才由 integrator 动 `DEFAULT_PLOT_LAYOUT`、
`src/config.ts`、`src/core/plot-assembly.ts`；单纯加地块永远不用改共享文件。

## 规则 3：每次任务完成更新线上并贴链接

- 跑 `npm run publish:preview`（`tools/publish-preview.mjs`）：把 `dist/` 整体发布上线
  → 校验 `verified` → 打印**唯一**公网链接；
- 链接长期不变，权威记录在 [`../state/CURRENT.md`](../state/CURRENT.md)；
- **把打印出的链接贴进任务回复**（手机可直接打开）；
- 这是发布，**不是 GitHub push**；push / `gh-commit.mjs --apply`
  仍需用户明确通知，见 [`multi-agent-workflow.md`](multi-agent-workflow.md)。

## 复现与验收

- 效果类改动给**可复现入口**：主场景按钮 / 快捷键 / `__harness.*` 调试读数，
  或 `tools/*-shot.py` 截图脚本（产物进 `shots/<批次>/`，整目录不入库）。
- 动态拼合：`__harness.plotDebug()`（地块数 / `placement` / `slot` / 拼合中心 / 传送落点 /
  `diagnostics` / `dummies` / `rendered` / `testUnits`）、`__harness.spawnAt(id)`、
  `__harness.clearSpawned()`、`__harness.lab.goto(id)`。
  `rendered` 应始终等于 `world.dummies.length`（表现层真的扩容了）。
- 风场 A/B：主场景顶部「风：开」按钮（`G` 键）切 `core.grass.wind.enabled`，
  `__harness.windDebug()` 区分 `configured`（配置）/ `rendered`（shader 实跑值）。
- 草与实例读数：`__harness.grassDebug()`（instances / drawCalls / dirty / bent / cut / debris）。
- 别只靠文字描述效果；也别为了做 A/B 再建一个页面。

## 反例（会被 review 打回）

| 做法 | 为什么不行 |
|---|---|
| 新建 `xxx-demo.html` + `src/xxx-demo.ts` | 第二套场景、第二构建入口、文档重复、合并撞车 |
| 往 `config/game.json` 的 `scene.stations` 追加一条 | 回到多 agent 共改一个数组的冲突根源 |
| 在新地块 JSON 里写 `x/z/spawnX/spawnZ` 绝对坐标 | 抢位置、叠放，拼合器白做 |
| 在演示页里复制一份 Core / 草层 | 逻辑分叉，「看到的」≠「主线接入的」 |
| 把测试地形写死在表现层 | 换工位 / 调数值要改代码，Core 快照不可复现 |
| 改完只 commit、不同步线上 | 别人 / 用户没法快速验证，违反规则 3 |
| 攒几十个文件再合并 | 共享热点文件全冲突；每天 rebase 一次 `origin/main` |

## 关联

- 上手入口：[`../../AGENTS.md`](../../AGENTS.md)
- 动态拼合实现正本：[`plot-assembly.md`](plot-assembly.md)
- 分支与冲突分类：[`multi-agent-workflow.md`](multi-agent-workflow.md)
- 草块实现：[`grass.md`](grass.md) · 决策修订：[`../decisions/ADR-008-grass.md`](../decisions/ADR-008-grass.md)
- 关卡地形 / 碰撞：`config/game.json` → `scene.*`（`ground` / `steps` / `doorways` / `obstacles` / `grid` / `grass`）
