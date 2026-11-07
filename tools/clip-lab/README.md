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

# 全段验收：数值 + PASS/FAIL + 关键帧截图 + markdown 报告
python3 tools/clip-lab/clip_lab.py check

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
   12 帧后仍有几度残差（实测能差 40°）。工具用 `warm=45`。
4. **扫角要 unwrap**：`atan2` 结果在 ±180° 跳变，不 unwrap 会把 344° 的旋身算成 20°。
5. **linux 自动套 xvfb**：无可用 X 时 Chromium 的 WebGL 会静默失败（页面白屏、harness 不存在），
   工具自己 `exec xvfb-run`。

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
