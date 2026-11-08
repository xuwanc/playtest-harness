# clip-lab · 动作剪辑验证台

给「做 clip 的人 / AI」用的一条命令环境：**扫角度 → 定格截图 → 收集数据 → 自动判定**。

它不是为了做编辑器，而是把「这个动作到底做成什么样」变成可复现的数字和图片。

## 它解决的三个具体问题

| 问题 | 以前 | 现在 |
|---|---|---|
| 角度靠猜 | 盯斜俯视截图，水平剑看着像竖着 | 直接读刃身两端世界坐标，算真实仰角 / 扫角 |
| 定格靠碰运气 | 按住攻击，抓到的帧全看运气 | 指定 `武器 · 段 · 进度`，任意帧可复现 |
| 验收靠回忆 | 改完数据不知道幅度掉没掉 | 一条 `check` 跑完 9 段，出 PASS/FAIL 表 |

## 用法

```bash
# 先有产物
npm run build

# 全段验收：数值 + PASS/FAIL + markdown 报告（约 8~10s）
python3 tools/clip-lab/clip_lab.py check

# 要关键帧截图（软件渲染下每张约 3s，九段约 +45s）
python3 tools/clip-lab/clip_lab.py check --shots

# 单段扫描（不开截图更快）
python3 tools/clip-lab/clip_lab.py scan --weapon greatsword --seg 1 --steps 48

# 定点定格
python3 tools/clip-lab/clip_lab.py shot --weapon dual-swords --seg 3 --progress 0.625

# 自动挑起手 / 中段 / 最远 / spin 峰值 / 收招
python3 tools/clip-lab/clip_lab.py shot --weapon greatsword --seg 1 --keyframes

# 纯逻辑自检（不需要浏览器，可进 CI）
python3 tools/clip-lab/clip_lab.py selftest
```

也可用 npm 别名：`npm run clip:lab -- check`。

产物落在 `clip-lab/<命令>-<武器>-<段>-<时间>/`：

```
report.md      # 结论表 + 逐段明细，直接贴 PR / commit
report.json    # 原始逐帧数据，脚本可再消费
shots/*.png    # 关键帧，已叠加刃身线与读数
```

## 截图怎么读

- **红线 R** = 右手刃身延长线；**绿线 L** = 左手刃身（双持 / 剑盾）。
- 线旁文字是该刃身的 `pitch`（相对水平面仰角）与 `yaw`（世界水平朝向）。
- **蓝色虚线** = 角色朝向，判断「扫到身后」以它为准，不要靠投影直觉。
- 左上 HUD：`t` 进度、`strike` 挥出量、`rootYaw` 整体带转、`spin` 整圈、`swingYaw` 腰椎叠加。
- 相机被固定到 18° 低俯角。游戏默认 50° 斜俯视会把水平横扫投成斜线，那是**视角**，不是动作。

## 数据怎么读

| 字段 | 含义 |
|---|---|
| 扫角 | 刃尖水平朝向的最小→最大跨度，**已 unwrap**，可超过 180° |
| 刃身仰角 | 刃身相对水平面的真实夹角；横扫段应接近 0° |
| 整体带转 | `root.rotation.y` 的语义部分（不含 spin），大 = 人在转身而不只是拧腰 |
| spin | 剪辑级整圈旋转，360° = 转满一圈，`2π ≡ 0` 收招不残留 |
| 端点高度差 | 刃根与刃尖的 Y 差，接近 0 = 真的平扫 |

## 实现要点（改之前先看）

1. **定格不是另算一套姿态**：`__harness.clipLab.preview()` 把 `world.combat` 的
   `weapon / comboIndex / attackProgress` 改掉，然后跑真实 `view.render()`。
   读到的手臂链、挂点反解、刀光都是真机链路。
2. **必须锁画面**：preview 结束后主循环下一帧会把姿态刷回待机。
   `clipLab.preview()` 内部置 `clipHold`，主循环跳过 `view.render`；截图完再 `release()`。
3. **必须给足收敛帧**：腕部滞后是指数平滑，直接从 t=0 跳到 t=0.5，
   12 帧后仍有几度残差（实测能差 40°）。工具用 `warm=45`（combo）/ `--warm0 --warm-n`（scan、check）。
4. **扫角要 unwrap**：`atan2` 结果在 ±180° 跳变，不 unwrap 会把 344° 的旋身算成 20°。
5. **linux 自动套 xvfb**：无可用 X 时 Chromium 的 WebGL 会静默失败（页面白屏、harness 不存在），
   工具自己 `exec xvfb-run`。

## 性能（v9s.34 重写，4m30s → 8.2s）

九段全量原来要 4 分半，拆开看**干活只有 8 秒**，其余全是浪费：

| 环节 | 旧 | 新 | 怎么改的 |
|---|---|---|---|
| 采样 | 400+ 次 `page.evaluate`，每帧再跑 4 帧预热 | **1 次** evaluate 跑完整批 | `BATCH_JS` 把「段 × 步」循环放进页面里；预热只在段首做 |
| 预热 | 每帧 4 次 render（约 60~70ms/帧） | 段首 12 + 其余 2 | 连续推进 t 时平滑量本来就在收敛态；实测与 4 的差 <0.9° |
| 收工 | `browser.close()` 卡 **30s** 超时 | `pkill` 按 UA 标记精确杀 + `pw.stop()` 守护线程 | 软件渲染下渲染器不放行，优雅关闭是纯等待 |
| 截图 | `check` 默认开（每张约 3s） | 默认关，`--shots` 才出 | 它是唯一真正需要人眼的一环，不该拖慢数值回归 |

耗时现在直接打印在报告里（`扫描 / 启动 / 加载 / 截图 / 总`），
`CLIP_LAB_TIMING=1` 再加打印清理与进程退出耗时 —— 下次变慢能一眼看出是哪一段。

## 诊断口径（v9s.34 修正）

`combo` 的「锚点衔接」原来只报**刃身**跳变，于是九段里六段都是 ⚠️/❌（最大 139°），
看上去像六处连击断裂。查下来是口径问题：

- 段首姿态按 `strike` 曲线淡入，`t=0` 时 `strike ≈ 0`，剑必然回到接近中位；
- 段末是满幅。两者相减天然一百多度，**跟数据对不对没关系**。

现在同时报**身体跳变**（上段末 `bodyYaw` vs 下段起 `bodyYaw`）。实测大剑 10° / 0°、
剑盾 0°、双持 0° —— 躯干是连续转过去的，连击结构没问题；
刃身那条大数字只是 0.08s 淡入过程中的位移量。

阈值也校准到报告自己的说法：`>70°` 提醒、`>130°` 才算「会看成闪一下」。

## 已知局限（刻意没做）

- **只测稳态姿态**：preview 固定一个进度反复渲染，腕部会收敛到稳态；
  真机连击里腕部是滞后值。看「剪辑本身的角度」这是对的，看「手感」不准。
- **不参与命中判定**：`hits.arcDeg` 在 Core 里，工具不读也不改。
  表现层扫 240° ≠ 判定扫 240°，这两个数字刻意解耦。
- **不做编辑器**：不能在工具里拖关键帧。数据仍在 `config/game.json`，
  工具只负责「改完以后事实是什么」。
- **段间过渡不采样**：`segBlend` 的换段过渡属于连击节奏，不在单段剪辑范围内。

## 加一种武器 / 一段

改两处即可：

```python
WEAPON_SEGS = {"new-weapon": [1, 2, 3]}
SEG_RULES[("new-weapon", 1)] = {"min_sweep": 120, "max_pitch": 25, "label": "横扫"}
```

`clips / combo` 从 `__harness.viewConfig` 读，配置里加了新剪辑不用改工具。
