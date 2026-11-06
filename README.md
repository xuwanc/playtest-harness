# 3D 玩法实验台 · Playtest Harness

一个用来**测试玩法与模块功能**的网页版 3D 实验台。核心目标是「核心逻辑可移植」：把玩法规则放在一个纯 TypeScript、零依赖、不碰 DOM 与渲染库的 Core 里，Web 表现层只做展示。

> **迭代流程约定（2026-11-06 起）**：每批改动完成并通过验收后 **直接发布到线上分享链接，不再二次确认**。
> **小代价小修改合并发布、大调整阶段性完成发布**；每版发布后提醒，可提前写下一轮调整意见。
> 线上地址（固定不变、覆盖式更新）：公开仓库不收录访问链接与凭据，请通过项目内部渠道获取。
> 转发时请**整条复制**，`?sharecode=...` 是访问凭据，截断会打不开。

**线上当前版本：v9n**（v6a / v6b / v6c 与 v7 全部 12 项需求均已发布；v7 分 **v7a 战斗手感核心层 / v7b 角色动画 / v7c 控制·特效·法杖重构** 三批完成，另含一次「移动步频抽动」回归修复；**v8 = 参考 Overgrowth 的程序化步态**，迭代侧向移动 / 后退脚步；**v8b = 修复引导飞弹时下盘跨朝向跳变 + 跨朝向非正前方时腿摆动方向歪**，投影基准与下盘朝向自洽；**v8c = 攻击下半身权重分层 + 跳跃 / 落地程序化蓄力缓冲（不改跳跃驱动）**；**v8d = 修正「攻击时下半身完全不动」：Core 锁速导致步态解算器恒返回 idle、攻击写腿又只覆盖大剑 / 第 3 段，两个权重拉满下盘依旧不动 —— 现补攻击等效步态驱动并把挥击跨步统一到所有武器所有段，两条权重路径各自都能让下盘动起来**；**v8e = 双指捏合 / 滚轮 / 快捷键拉远拉近相机（纯表现层，不进 Core，捏合时暂停移动摇杆，进出双指摇杆无缝接续）**；**v8f = 骨架重构为共享骨盆 + 上下半身分离（上半身绕腰、腿绕髋），受击改为上半身倾斜 / 微微下沉 / 腿屈膝 / 屁股后坐 / 重心小幅偏离，并按命中部位区分打肩与打腹**；**v8g = 补两骨 IK 足部锚定（玩家 / 假人共用，程序动画推走骨盆时脚仍钉在落点）、修大剑重击身体离开腿、修肘关节反折、惯性倾斜带盆骨偏移并在移动时略微下沉**；**v9a = 派生招 Phase 1：翻滚 / 闪现 / 长跑后接攻击的数据驱动招式表 + 剑盾索敌冲锋盾击（线段扫掠命中、共享 CD 不可连发），并把命中出口改成玩家 / 假人同构的 `applyHit`，「玩家不被击退」降格为一个测试开关**；**v9b = 竖屏操作簇：冲 / 跳与技2 / 攻击收拢为屏幕右侧居中的双列拇指簇（两列中心对齐），「复位」单独钉在右下角避免误触，横屏布局不变**；**v9c = 状态栏说明改为默认收起：HUD 只留一行摘要（tick / fps / 武器阶段 / 派生招窗口 / 命中数），「操作说明」只留一个小胶囊，点开才展开完整内容；状态每帧刷新不会把面板顶开，一旦真正开始操作立即自动收起，说明展开 8s 无操作也会收回；折叠容器整体指针穿透，展开的 HUD 不再吞掉左上角的摇杆点击**；**v9d = 输入层整合：按钮统一手势状态机（`press / drag / longPress / tap / doubleTap / release / cancel`，带位移、屏幕角度、按住时长、世界方向，`InputFrame.gestures` + `lastGesture` + `peekAim()` 供技能层直接消费）；所有按钮改指针捕获、滑出不再误松手；切后台 / 来电 / 系统手势打断时全量释放输入（弓不再卡蓄力、冲刺不再停不下来）；瞄准余辉从 1 帧改为 140ms 并按 pointerType 过滤合成 move，修掉法杖 / 弓松手瞬间朝向跳变；竖屏调试面板从右中移到左上、宽度收窄到 220px，与右侧操作簇完全分离**；**v9e = 三项操作反馈：① 左下角常驻半透明版本徽标（`v0.9.6 · 11-06 21:43`，版本号 + 构建时间，pointer-events:none 不吃摇杆）；② 移动输入改「摇杆独占」——双指捏合需两指相对移动 ≥18px 才确认，第二指（按按钮 / 手掌蹭屏）不再冻结或重置摇杆，`gesturestart` 一律阻止、按钮容器 `touch-action:none`；③ 步态改「零滑步支撑相」——支撑相脚线性后移（C¹ 衔接 Hermite 摆动相），脚前伸距离 = 步幅 × 0.25，`CharacterState.stride` 把物理步幅写进 Core，低速慢走不再往前蹭（4.8 m/s 以内实测滑移 < 1e-9 m/帧）**；**v9f = 发布端飞行记录仪：左下角版本徽标变成诊断入口，点开「复制摘要」即可把最近 20 秒的输入 / 位移 / 状态位 / 事件 + 自动标记的可疑片段（朝向跳变、拖拽松手掉向、摇杆有输入却不位移、摇杆被冻结、掉帧）贴回来；纯内存环形缓冲、只读 World、默认不上传**；**v9g = 用第一份真机摘要修两件事：① `dirJump` 判据从 moveYaw（有 0.1~0.2s 滞后）改为输入方向，10 次误报归零；② 小幅推杆（<35%）时朝向按幅度分三档——微颤不转身、轻推 22° 死区 + 70ms 平滑、大幅仍瞬时，修掉真机上 `55↔119` 来回抽**；**v9h = 用第二份真机摘要做两件事：① 面朝向加 1800°/s 转速上限（<30° 仍瞬时），141°/126° 这类锁定解除与重新指方向的整块翻转拆成 3~6 帧，攻击朝向不受影响；② `dirJump` 判据改为「朝向与输入方向的残差 + 残差是否在收敛」，跟着输入转的一律不算异常、单列为「输入转向 N 次」，采样表补 `inYaw` 列**；**v9i = 修「移动中点按技能2 方向变左上」：按钮辅助瞄准确认阈值 12px → 26px（缩回 16px 撤销），点按的十几像素抖动不再被当成拖拽，未确认拖拽的抬起也不留余辉；诊断判据同步排除 aim 期间与松手回位**；**v9k = 临时方向调试盘：屏幕下方一块小罗盘，同屏画「摇杆输入（青）/ 实际移动（黄）/ 目标方向=面朝向（品红）」，另附死区前原始摇杆（虚青）、拖拽瞄准（橙）、锁定目标（虚红）与死区圈；角度按屏幕方位读（正上=相机前方），入/移夹角 > 45° 整圈变黄。纯观测层，不进 Core，可整块删除**；**v9l = 用真机现象反推出「松手瞬间方向跳掉」的根因是坐标系平移（地址栏收放让同一根手指的 client 坐标整体平移 ≈ 一个摇杆半径），摇杆改为把这种跳变当平移吸收（原点同步平移、向量不变），并用「视口刚变过 / 屏幕坐标没动」两条证据判定；采样表新增指针 id、原点、手指位置、视口偏移四组读数与 stickJump / stickBad 两类异常，让「手指没动方向却变了」自己开口说话**；**v9m = 真机反馈「换了浏览器就好」，坐实是鸿蒙自带浏览器把 client 坐标平滑漂移（工具栏动画，每帧几像素，跳变阈值抓不到）；摇杆方向改用物理屏幕坐标 screenX/Y（对页面重排天然免疫），带可用性探测、全零保护、DPR 尺度自适应，失效则回退 client；摘要新增「摇杆坐标源」与「坐标漂移」计数**；**v9n = 真机摘要证明输入层零异常，方向问题改打「松手瞬间」路径（id 错配无条件释放 / 幽灵 move / 假起点 / 逐帧方向守门）；手感上加「停步收相」（步相推进到双脚并拢点并淡出摆幅，不再卡在最后一个 pose）与「侧移下盘偏转」（纯侧移转成斜向迈步，避开双腿平行拖行），玩家与假人同构，全部纯函数 + 配置化，前进/后退不受影响**）。

本期累计完成的范围：

| 模块 | 状态 |
|---|---|
| 碰撞白盒测试场景（5 级不同高度台阶、宽/窄门洞、独立障碍、地面网格） | 已完成 |
| 体素风 3 头身角色（髋/膝、肩/肘关节，无蒙皮，正弦步态程序化驱动） | 已完成 |
| 2.5D 斜俯视相机（固定俯角、不随角色旋转、指数平滑跟随） | 已完成 |
| 全屏隐形摇杆 + 跳跃 / 冲刺 / 复位按钮区 | 已完成 |
| 5 种武器与战斗模块（剑盾 / 双剑 / 大剑三连击、法杖双施法、弓箭蓄力） | 已完成 |
| 4 个测试假人（4 种 AI 行为、点击切换、复位归位、攻击无伤害） | 已完成 |
| 按钮区与摇杆 pointerId 硬隔离（技能按钮含间隙不干扰移动方向） | 已完成 |
| 武器握持姿态修正（剑斜向前伸出、刀锋朝外，不再贴手臂指向肩膀） | 已完成 |
| 三连击节奏（每段前移后 `settle` 停顿 + 攻击期间位移与移动解耦） | 已完成 |
| 程序化朝向（面朝向 / 身体朝向 / 移动方向分离，头先转、身体平滑） | 已完成 |
| 角色间碰撞分离（玩家 + 假人两两不重叠，玩家为不可推动的锚点） | 已完成 (v5) |
| 智能目标辅助（前方扇区软锁定、朝目标攻击、动态前冲保持理想距离） | 已完成 (v5) |
| 按住攻击键自动连击（三段循环，松开即停） | 已完成 (v5) |
| 命中 / 三种受击动画 / 大剑击退（敌我通用，仍无伤害） | 已完成 (v5) |
| 按钮布局（调试面板默认收起、竖屏技能纵向排右侧、摇杆行程缩小） | 已完成 (v5) |
| **v6a 表现层朝向修正**（斩击弧朝正前方、刀刃竖直、弓/箭向前 90°、启停/绕圈身体倾斜） | **已完成 (v6a)** |
| **v6b 冲刺分化**（物理武器翻滚 / 法杖闪现，含 Core 状态、落点保护、动画与光环特效） | **已完成 (v6b)** |
| **智能相机**（战神5 思路：按周围威胁权重自动推进 / 拉远 / 平移 / 俯仰构图） | **已完成 (v6c)** |
| **v7a 战斗手感核心层**：击退改连续速度冲量（带冲击力、非一帧闪现）；目标距离修正保留最小前冲；`settle` 停顿保留部分余速；连击可于 `recovery` 取消窗口提前接续 + 攻击跨步（左右交替）；弓蓄力释放以「松开按钮」为主不再卡蓄力 | **已完成 (v7a)** |
| **v7b 角色动画/手感**：受击按命中方向程序化后仰（前后左右适配，背后命中朝前倒）；大剑双手持握 + 移动拖地 + 双手攻击；高速时步幅加大、步频合理；怪物平滑转身 + 头身分离 + 方向性受击 | **已完成 (v7b)** |
| **v7c 控制 / 特效 / 法杖重构**：竖屏左下按钮移屏幕右侧、横屏右下；特效弧中心轴改回角色正前方（+ 纯函数单测）；攻击 / 技2 按钮拖拽辅助朝向（统一 `aim` 解析）；法杖攻击改「按住可移动引导奥术飞弹」、技2 改「原地电环（僵直 + 轻击退）」并抽出独立 `abilities` 模块 | **已完成 (v7c)** |
| **v8 程序化步态**：参考 Overgrowth，把移动速度投到身体局部，前进 / 侧移 / 后退自适应摆腿；脚落地锁定、侧向交叉步、骨盆重心转移与侧倾；玩家与怪物共用同一纯函数解算器，全部参数调试面板热调 | **已完成 (v8)** |
| **v8b 下盘偏航连续化 + 步态投影自洽**：修复引导飞弹时下盘跨 ±π 跳变（改连续侧向占比 + 限幅 + 平滑，无 wrapAngle）；gait 投影基准同步到下盘实际朝向，跨朝向非正前方时腿摆动方向不再被歪 | **已完成 (v8b)** |
| **v8c 攻击下半身权重分层 + 跳跃 / 落地缓冲**：攻击姿态对腿的写入收口成可调权重层；落地 / 起跳叠加屈膝下蹲 + 重心下沉脉冲，按 Core 时间计时，绝不写 `character.position / velocity`（**注：v8c 默认两层全关造成下盘彻底冻结，方向理解有误，已由 v8d 修正**） | **已完成 (v8c)** |
| **v8d 攻击下盘修复**：补「攻击等效步态驱动」绕过 Core 锁速（`solveGait` 不再恒返 idle），挥击跨步统一覆盖所有武器 / 所有连击段（连击左右脚交替）；`gaitWeight` 默认 1 / `lowerBodyWeight` 默认 0，两条路径各自可热调、都关才是静止基准 | **已完成 (v8d)** |
| **v8e 双指捏合缩放**：手势解算纯函数（取最后两根、张开拉远 / 捏合拉近、重合保护、单帧限幅无欠账）→ 输入层产出 `zoomScale` → 组装层累乘限幅 → 相机平滑乘进距离；滚轮 / `= -` 键等价输入；捏合时冻结摇杆、退出后单指无缝接续；UI 区域指针剔除 | **已完成 (v8e)** |
| **v8f 骨架层级重构 + 分层受击**：`root → pelvis(髋部) → [lower(腿), upper(上半身)]` 同构于玩家与假人，上半身倾斜天然绕腰、不再绕脚底掀翻整个人；受击按层拆成「上身大反应 / 骨盆小幅重心偏离 + 屁股后坐 + 下沉 / 两腿屈膝吸收 / 手臂」；命中部位（打腹 vs 打肩）与力度正交插值；Core 零改动，`enabled=false` 可 A/B 对照旧姿态 | **已完成 (v8f)** |
| **v8g 四项修复**：① 补通用两骨 IK（此前**没有 IK**，只有 FK + 解析摆腿），玩家 / 假人同构接入足部锚定；② 大剑重击「身体离开腿」= 上半身位移过大 + 跨步推得过远 → 位移限幅 + 幅度外置收敛 + IK 钉脚；③ 肘关节反折 → 所有肘角翻符号；④ 惯性倾斜只写上半身 → 盆骨带小比例倾角 / 重心平移，移动时略微下沉 | **已完成 (v8g)** |
| **v9a 派生招 Phase 1**：冲刺 / 翻滚 / 闪现 / 长跑后的数据驱动招式表 + 剑盾「索敌中距离冲锋盾击」（起手快照、不做背后索敌、超范围冲到极限即停、共享 CD 不可连发、线段扫掠命中且每目标只结算一次）；命中出口改为玩家 / 假人同构 `applyHit`，「不能击退 / 不伤害」降格为 `noDamageToPlayer` 测试开关。其余招式（突刺 / 旋风斩 / 冰环 / 落地招）配置已就位但 `enabled=false` | **已完成 (v9a Phase 1)**；Phase 2/3 待做 |
| **步频抽动回归修复**：`gaitPhase` 改增量累加（速度变化不再重缩放历史相位）、步幅增益温和化并外置为可调参数；`sprinting` 布尔阶跃改为连续速度映射 | **已完成 (v7c)** |
| 寻路 | **只定义契约与网格元数据，算法留待下期**（`World.modules.pathfinding` 暂未接线） |
| 程序化生成场景 | **留待下期**，当前由 `core/scene.ts` 一处函数生成，替换它即可 |
| 伤害 / 血量 | **不做**；命中只写受击动画、位移、事件与计数 |

---

## 快速开始

```bash
cd /workspace/playtest-harness
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`（手机连同一网络可用终端里显示的 Network 地址；工程已绑定 `0.0.0.0`）。想直接玩线上版，点顶部链接即可，无需安装任何东西。

## 操作说明

| 输入 | 效果 |
|---|---|
| 在**任意非按钮空白区域**按住并拖动 | 隐形摇杆移动，按下点为原点，拖得越远速度越大（**满推行程 56px**，可热调）。**屏幕上不绘制摇杆** |
| **轻点（不拖动）某个假人** | 循环切换该假人的行为：游走 → 跟随 → 保持距离 → 攻击 → 待机 → 游走 |
| `6` / `7` / `8` / `9` | 桌面便利键，分别切换 1 / 2 / 3 / 4 号假人 |
| 顶部武器条 / 数字键 `1`–`5` | 切换 剑盾 / 双剑 / 大剑 / 法杖 / 弓 |
| 「攻击」橙色大按钮 / `J` | 剑类触发三连击；**按住不放 = 自动连续三连击**；法杖 = 施法1；**弓箭按住蓄力、松开释放** |
| 「技2」紫色按钮 / `K` | 法杖施法2 |
| 「跳」/「冲」/「复位」 / `空格` / `Shift` / `R` | 跳跃 / **按一下冲刺 = 剑类翻滚、法杖闪现；按住仍是持续加速跑** / 玩家回出生点 + 全部假人回初始状态 + 目标 / 受击 / 命中 / 冲刺状态清零 |
| WASD 或方向键 | 桌面便利输入，与摇杆走同一套映射 |
| 右上调试面板 | **默认整体收起**（只留标题栏，点标题展开）；时间缩放、暂停、单步、复位、模块开关、全部可调参数 |

> **冲刺两条输入沿**：`sprintPressed`（按下沿）触发一次翻滚 / 闪现，`sprintHeld`（按住）保留原来的持续加速跑，两种手感互不干扰。低帧率一帧多步时按下沿只在第一个 step 生效，不会一次按键触发多次冲刺。
>
> **点击与拖动的区分**：在假人身上「按下后拖动」仍然是摇杆移动，**不会**切换模式；只有按下到抬起位移小于 8px 的轻点才算一次点击。
>
> **按钮区不干扰摇杆**：整个按钮容器（含按钮之间的间隙、padding）都标了 `data-ui-region`，在这些区域按下的 pointerId 会被记入隔离集合，它的 `down / move / up` 全程不参与摇杆与轻点判定。因此一根手指拖摇杆、另一根手指按技能按钮时，移动方向不会跳变。

### 横屏 / 竖屏布局

- **横屏**：HUD 在左上、提示紧随其下，武器条顶部居中，左下「冲/跳/复位」，右下「技2 / 攻击」，右上调试面板。
- **竖屏**：攻击与技2 **从上到下纵向排在屏幕右侧**（技2 在上、攻击大按钮在下，单手拇指可及）；武器条独占顶部；HUD 自动切换成 **7 行短版**并下移到武器条下方；收起的调试面板再放到 HUD 下方，三者互不遮挡。
- HUD 与提示共用同一个纵向容器（`#overlay-left`），提示永远紧贴 HUD 下方，**不再依赖绝对 `top` 定位**，因此任何字号/换行都不会再出现重叠。

左上角 HUD 横屏显示 `tick / pos / vel / grounded / sprint / facing / orient(face·body·head·move·head-body) / move / stick / aim / weapon / phase / combo / chan·bolts·rings / atk / **dash** / **camera** / target / charge / dummies / atkCount / hit / hurt / impulse / event`；竖屏为精简短版（保留 target / hit / hurt / dash / camera 等验收关键项）。

## 武器系统

| 武器 | 切换 | 攻击 | 三段前冲（m） | 移速倍率 | 命中 / 受击 |
|---|---|---|---|---|---|
| 剑 + 盾 | 1 / 剑盾 | 三连击：右上劈 → 左横斩 → 双手下劈 | 0.45 / 0.60 / 0.95 | 1.00 | 1.6m，段1/2 轻受击、段3 重受击 |
| 双持剑 | 2 / 双剑 | 三连击，节奏最快（前摇 0.07s） | 0.40 / 0.55 / 0.85 | 1.08 | 1.5m，轻 / 轻 / 重 |
| 双手剑 | 3 / 大剑 | 三连击，前摇/后摇最长、前冲最大 | 0.70 / 0.90 / 1.40 | 0.85 | 2.0m，**击退受击 + 0.75m 击退** |
| 法杖 | 4 / 法杖 | 「攻击」= 施法1（举杖前推 + 光球飞出），「技2」= 施法2（双手上举砸地 + 下蹲） | 0 / 0.25 | 0.95 | 2.6m，重受击 |
| 弓箭 | 5 / 弓 | 按住蓄力 → 松开射箭；蓄力不足则取消 | 0.12 | 1.00（蓄力中 ×0.55） | 9m，轻受击 |

**连击规则**：攻击分 `windup → active → recovery → settle → idle` 五段。只有 `active` 帧产生前向位移（`impulse`）；`recovery` 结束发 `attack-end` 并进入 **`settle` 收势停顿**（默认 0.16s），停顿期间 impulse 与自主速度都为 0，姿态定格，水平位移严格不变。停顿结束才回到 `idle`、开启 0.65s 连击窗口、消费缓冲输入。第 3 段之后回到第 1 段。

**按住自动连击**（`combat.autoCombo`，默认开）：`attackHeld` 为 true 时，每次回到 `idle` 就自动接续下一段，形成 `1→2→3→1→…` 的无限循环；松开即停，且按住状态**不进入缓冲队列**（不会松手后多打一段）。显式按下的 `attackPressed` 仍走缓冲队列，两种入口互不冲突。仅对剑类（comboCount > 0）生效，法杖 / 弓不受影响。

**攻击与移动解耦**：攻击 / 停顿期间 `movement` 直接接管水平速度 `v = 输入方向 × moveSpeed × attackMoveScale`（默认 **0 = 完全锁定**），不累积惯性；水平位移严格等于 `lunge`，**「移动中攻击」和「静止攻击」前冲距离完全一致**。

**武器握持姿态**：`makeSword` 沿局部 `+Y` 建剑，挂在手部节点下的 `weaponMount` 挂点上并施加基础旋转 —— 剑向前倾斜（剑盾/双剑 68°、大剑 58°）并左右外张（16°），剑身**斜向前下方伸出、与下垂手臂明显分离**，剑刃一侧有白色 `bladeEdge` 亮边明确刀锋朝外。角度在 `view.weaponMount`，调试面板可热改。

参数在 `config/game.json` → `core.combat` 与 `view.weaponMount`。

## 智能目标辅助（v5）

`core/targeting.ts` 是独立模块（`modules.targeting` 可开关）。每帧在**当前面朝向的前方扇区**内挑选优先目标：

- 参考朝向：有移动输入时取输入方向（转身意图即时生效），否则沿用上一帧 `facing`。
- 候选条件：水平距离 ≤ `range`（7m）且与目标方向夹角 ≤ `maxAngleDeg`（90°，半角）。**背后的敌人不会被强行锁定**，避免玩家背对敌群时攻击莫名扭头。
- 评分 `score = dist - frontBias × cos(夹角)`，越小越优先 → 更近且更正面的敌人胜出。
- 结果写在 `world.targeting { targetId, targetYaw, targetDist, hasTarget }`，表现层在目标脚下画一个**金色指示环**（带轻微呼吸），HUD 显示 `target #id @距离`。

由此带来三条行为：

| 行为 | 规则 |
|---|---|
| **朝目标方向攻击** | 起手时 `attackFacing = targetYaw`（优先于摇杆方向），锁定后挥击过程中不变；关闭 `targetAssist` 后退回「按摇杆/面朝向」的基础行为 |
| **动态前冲** | 有目标时 `lunge = clamp(targetDist - idealRange, 0, 基础lunge × maxLungeScale)`：目标远则最多放大 1.6 倍追近，目标已在理想距离（1.35m）内则**不再前冲**，避免怼到敌人身上。每击结束趋向与敌人保持理想间距 |
| **弓蓄力面向目标** | 按住弓蓄力期间 `orientation` 把 `facing` 覆盖为 `targetYaw`（压过摇杆方向），松手 / 换武器即恢复 |

配置在 `core.targeting`：`range / maxAngleDeg / frontBias / idealRange / maxLungeScale / targetAssist`，调试面板「目标辅助」分组可热改。

## 命中 / 受击动画 / 击退（v5）

`core/hits.ts` 是独立模块（`modules.hits` 可开关），只消费**显式事件队列**：`attack-active`（玩家攻击命中帧）与 `dummy-hit`（假人挥砍命中帧），不与 combat / dummies 互相调用。

- **玩家攻击命中**：以 `attackFacing` 为中心 ±`arcDeg`（65°）扇区、按武器 `reach` 判定，命中写 `hit` 事件、累加 `world.hitCount`、给假人写受击状态。
- **三种受击动画**：`light`（0.20s）/ `heavy`（0.32s）/ `knock`（0.42s）。映射：剑盾/双剑第 1、2 段 → light，第 3 段 → heavy；法杖 / 弓 → heavy；**大剑 → knock**。表现层按 `1 - timer/duration` 归一化进度用 `sin(πp)` 做后仰 + 侧倾 + 下蹲 + 全身红闪，三种幅度不同；受击期间假人进入**僵直**（不主动移动、不发起新攻击）。
- **大剑击退**：命中时把近身敌人沿「玩家→敌人」方向推到至少 `idealRange`（默认 1.35m），或推 `knockback`（0.75m）取较大值，使敌人**尽量留在攻击范围内、又不贴脸**。其它武器 `knockback = 0`，不重叠由分离模块保证。
- **假人攻击玩家**：`dummy-hit` 帧若玩家在 `dummyReach`（1.8m）内，写 `world.playerHurt`（light 受击）并发 `player-hurt`。**仍无伤害**：`playerHurt` 放在 `World` 顶层而非 `character`，`character` 一个字节都不改。

> 受击状态（`HurtState { type, timer, duration, dirX, dirZ }`）是 Core 计时的 plain 数据，随 World 一起快照 / 回放；表现层不累积本地时间，暂停与时间缩放下也与逻辑同步。

配置在 `core.hits`（`arcDeg / reach / hurtLight / hurtHeavy / hurtKnock / knockback / dummyReach`）与 `view.hurt`（闪色与三种后仰幅度），调试面板「命中 / 受击 / 击退」分组可热改。

## 角色间碰撞分离（v5）

`core/separation.ts`（`modules.separation` 可开关）：玩家 + 4 假人在 XZ 平面视为圆柱，两两做 `iterations`（3）轮分离，只推**假人**：

- **玩家是不可推动的锚点**（权重 0），全部重叠量由假人让开。这既消除重叠，又保住既有契约「假人从不修改 `character`」，也与「把敌人击退、保持距离」的方向一致。
- 假人 ↔ 假人各承担一半；完全重合时用**黄金角生成的确定性方向**（无随机源）把多个实体错开，避免挤成一堆。
- 每轮分离后对假人再做一次 `resolveHorizontal` 推出白盒、`clamp` 回世界边界，避免被挤进墙里或越界。
- 固定遍历顺序 → 完全确定性，可跨语言比对。

配置在 `core.separation`（`iterations / slop`）。

## 程序化朝向（面 / 身体 / 移动方向分离）

`core/orientation.ts` 是独立模块（`modules.orientation` 可开关），把原来单个 `facing` 拆成四条状态：

| 状态 | 含义 | 更新方式 |
|---|---|---|
| `facing` | **面朝向 / 目标方向**：攻击中锁定 `attackFacing`；弓蓄力时锁定目标；平时取摇杆意图方向；无输入保持 | 立即（锁定 / 意图） |
| `moveYaw` | **移动方向**：由实际速度得出 | 速度 > 0.15 时更新，可与身体朝向不同（侧移 / 后退） |
| `bodyYaw` | **身体朝向**：慢速指数平滑追随 `facing` | `bodyTurnRate = 7`，帧率无关，走最短弧 |
| `headYaw` | **头部朝向**：更快速率追随 `facing`，再相对身体限幅 | `headTurnRate = 20`，`maxHeadTurnDeg = 55` |

因此**头先于身体转向目标方向，身体做平滑跟随**。角度差用 `wrapAngle = atan2(sin a, cos a)` 归一化到 `(-π, π]` 走最短弧。表现层三段分离：`playerRoot.rotation.y = bodyYaw`、`lower.rotation.y = (moveYaw - bodyYaw) × legYawScale`、`headPivot.rotation.y = headYaw - bodyYaw - 攻击旋身`。参数在 `core.orientation` 与 `view.orientation`。

## v6a · 表现层朝向修正与惯性倾斜

三项纯表现层修正，**不进入 Core、不影响快照与确定性**：

- **斩击特效中心轴恒为角色正前方**：Torus 盘面法线（中心轴）保持局部 `+Z`、水平朝正前方。v6a 曾为「配合 2.5D 俯视」加 `-pitchDeg` 绕 X 倾斜，把轴拧成**斜前上方**；v7c #10 已撤销该倾斜，改由纯函数 `slashTiltX()` 决定（轴为纯 +Z 时恒为 0），`tests/fx-axis.test.ts` 直接断言轴方向防止回归。`slashPivot` 只管位置、`slashTilt` 只管朝向，避免位置被一起旋走。
- **刀刃竖直 / 弓箭朝前**：`makeSword` 把宽面从 XZ 改为 XY（刀刃竖直），白色 `bladeEdge` 亮边标出刀锋；`makeBow` 把弓面从 YZ 侧对镜头改为 XY 正对前方并加大 C 形弯曲；弓蓄力与箭矢按 `-(arm.root.rotation.x + arm.joint.rotation.x)` 做前向 90° 补偿，保持**水平朝正前方**。
- **惯性倾斜**：`voxel-rig` 按速度帧差求加速度、按 `bodyYaw` 帧差求转向角速度，投影出前后 / 侧向目标倾角，指数平滑后叠加到 `bob.rotation.x/z` —— 启动前倾、刹车后仰、绕圈侧倾，帧率无关；受击时自动衰减到 0.4 倍，不与受击动画打架。

`SceneView.diagnostics()` 暴露 `slashNormal / arrowForward / lean` 三个数值读数，供自动化验收：`slashNormal` 恒为绕 `bodyYaw` 旋转后的**水平前向**（`y=0`，朝 +Z 时 `[0, 0, 1]`；v7c #10 起不再是斜前上方）、`arrowForward≈[-0.218, 0, 0.976]`（水平朝前）、启停倾斜读数 `[0, 0.022, -0.143]`、绕圈 `side=-0.121`。

参数在 `view.lean`（`accelGain / turnGain / maxForwardDeg / maxSideDeg / smoothing`）。

## v6b · 冲刺分化：物理武器翻滚 / 法杖闪现

`core/dash.ts` 是独立模块（`modules.dash` 可开关）。输入拆成两条：

| 输入沿 | 行为 |
|---|---|
| `sprintPressed`（按下沿） | 触发**一次**翻滚 / 闪现（按当前武器分化） |
| `sprintHeld`（按住） | 保留原有持续加速跑，不破坏基础手感 |

触发条件：按下沿 + 冷却结束 + 不在攻击 / 蓄力 / 上一次翻滚未结束。方向取移动输入，无输入取 `character.facing`。

| 武器 | 动作 | Core 实现 |
|---|---|---|
| 剑盾 / 双剑 / 大剑 / 弓 | **翻滚** | `phase='active'` 持续 `rollDuration`；每帧把「剩余位移 / 剩余时间」换算成附加速度写入 `impulse`，由 `movement` 正常消费 → 台阶、碰撞、边界全部复用既有规则；总位移精确收敛到 `rollDistance` |
| 法杖 | **闪现** | 单帧沿方向以 `blinkStep` 逐段采样找**不重叠**的安全落点，直接改位置、清空水平速度、写 `from/to`；撞墙或世界边界立即停在最后安全点，**不会穿墙** |

**关键时序约定**：`dashUpdate` 插在 `combat` 之后、`movement` 之前；`active` 计时递减放在写 `impulse` **之后**，`phase` 只在下一帧开头才转 `idle` —— 因此翻滚每一帧（含收尾帧）都由 `impulse` 接管，方向键全程不叠加位移。闪现帧则由 `movement` 检查本帧 `blink` 事件，跳过常规水平积分，保证 `dash.toX/toZ` 与实际位置严格一致（复用显式事件队列做模块间通信，**不新增 World 字段**）。

**表现层**：`playerRoot` 承担位置与身体朝向，`rollPivot` 放在身体中心高度（0.9m）承担前滚 —— 绕脚底原点旋转会把头插进地面，绕躯干中心则全程留在地面之上；翻滚进度直接取 `dash.timer / duration`，不引入表现层本地计时。翻滚起点画淡蓝尘环，闪现在起点 + 落点各画一个紫色光环（落点更大），用 `dash.id` 变化触发（比事件队列更可靠：低帧率一帧多步时只有最后一步的事件会留下）。`diagnostics().dash` 暴露 `rollAngle / activeRings / lastKind` 三个读数。

参数在 `core.dash`（`rollDistance / rollDuration / rollCooldown / blinkDistance / blinkStep / blinkCooldown / blinkClearVelocity`）与 `view.dash`（`rollColor / blinkColor / fxDuration / ringRadius`），调试面板「冲刺 / 闪避」分组可热改。

## v6c · 智能相机（威胁权重驱动的情境构图）

`core/camera.ts` 是独立模块（`modules.camera` 可开关），在 `step` 的最后一步输出纯数据 `CameraIntent`，写进 `World.camera`，可快照、可跨语言对照；表现层只负责指数平滑，不参与逻辑。

参考战神5 的思路：**相机不是死跟玩家，而是按周围威胁动态构图**。

| 输入 | 计算 |
|---|---|
| 威胁评估 | 遍历 4 个假人，超出 `radius`（9m）不计入；近度 `proximity = clamp((radius - dist) / (radius - nearDistance), 0, 1)`，越近越大 |
| 威胁权重 | `weight = proximity × modeWeight[行为模式]`，挥砍 `active` 帧再加 `attackBoost × proximity`；求和后 `threat = sum / (sum + saturation)` 饱和归一化 |
| 推进 / 拉远 | `distanceScale = 1 - pushIn × (1 - threat) + maxPullback × threat`：无人时轻微推进（×0.88），威胁满时最多拉远（×1.38） |
| 构图平移 | 朝**威胁加权质心**平移画面中心：`offset = (质心 - 玩家) × framingBias × threat`，限幅 `maxOffset`；相机整体平移、视线方向不变，让玩家与敌群都落在画面内 |
| 俯仰变化 | `pitchDelta = maxPitchDelta × threat`，威胁多时略微更俯视，便于看清包围圈 |

表现层 `camera-rig.ts` 把 `CameraIntent` 用 `view.smartCamera.smoothing`（3.2）指数平滑后叠加到 2.5D 基础相机：有效距离 = `camera.distance × distanceScale`、有效俯角 = `camera.pitchDeg + pitchDelta`、焦点 = 玩家 + `(offsetX, 0, offsetZ)`。平滑状态留在表现层、不进 Core（与 `lean` 一致），因此暂停 / 时间缩放下也不会破坏确定性。关闭模块时 Core 输出中性意图，相机会平滑回到基础构图。

`SceneView.diagnostics().camera` 暴露 `threat / threatCount / distanceScale / offsetX / offsetZ / pitchDelta`（构图值取平滑后实际采用值），供数值化验收。浏览器实测：无威胁 `×0.881`，4 个近身攻击假人 `threat=0.653 / ×1.205 / off(1.03, 0) / pitch +4.57°`，玩家屏幕位置随之平移 48px。

参数在 `core.camera`（`radius / nearDistance / modeWeight / attackBoost / saturation / pushIn / maxPullback / maxOffset / maxPitchDelta / framingBias`）与 `view.smartCamera.smoothing`，调试面板「智能相机」分组可热改。

## v7a · 战斗手感核心层

针对玩家反馈的「击退一帧闪现、停顿完全不能动、连击要播完才能接、弓有时卡蓄力」四类手感问题，对 Core 做了一轮手感核心层改造。所有改动仍是纯数据、可快照、确定性的，未触碰可移植边界（Core 仍为 17 文件，`check:boundary` 通过）。

| 需求 | 改动 | 落点 |
|---|---|---|
| 击退连续后退 + 冲击力 | 命中不再瞬移位置，改为写入 `hurt.knockX/knockZ` 速度冲量；`decayHurt` 每帧指数衰减（`v(t)=v0·e^(-decay·t)`），总后退距离 ≈ `push`，表现为连续后退 | `core/hits.ts`、`core/dummies.ts`（积分时叠加 `knock`）、`core/movement.ts`（玩家受击叠加） |
| 目标距离修正保留最小前冲 | `lungeFor` 在目标贴脸时仍保留 `base × minLungeScale`，攻击始终有明显跨步，不被距离修正完全修没 | `core/combat.ts` |
| `settle` 停顿保留余速 | `settleMoveScale`（默认 0.32）：收势停顿期间保留一部分自主移速，不再完全锁死 | `core/movement.ts`、`config/game.json` |
| 连击可提前接续 + 跨步 | `recovery` 阶段过 `cancelWindow`（默认 0.45）即可提前接续下一段；`voxel-rig.applyStep` 在挥出时前向跨步 + 左右交替（combo 奇偶决定方向）+ 重心下沉 | `core/combat.ts`、`src/presentation/voxel-rig.ts` |
| 弓蓄力释放稳健化 | 释放判定以「按钮 / 手指抬起」（`!attackHeld`）为主、`attackReleased` 沿为辅，避免「抬按钮却卡在蓄力」 | `core/combat.ts` |

- **无伤害契约不变**：击退/受击只写 `hurt.knockX/knockZ` 与 `playerHurt` 动画状态，玩家 `character` 仅在被假人命中时写 `playerHurt`（仍不推位置/速度）；玩家命中假人才会把 `knock` 速度写给假人，形成连续后退。
- **跨语言对照**：`HurtState` 新增 `knockX/knockZ`（纯数值、可快照）；`CombatConfig` 新增 `settleMoveScale / cancelWindow / minLungeScale`；`HitsConfig` 新增 `knockbackDecay`（初速 `v0 = push × decay`，总后退 ≈ push）。黄金快照基线已随结构变更更新（`tests/__snapshots__`）。
- **回归修复（攻击跨步导致上半身飞出）**：`applyStep` 用 `+=` 往 `bob.position` 累加跨步，但 `update()` 每帧只重置了 `bob.rotation`，没重置 `bob.position.x/z`，导致攻击期间上半身逐帧飞出去。已在 `update()` 开头每帧归零 `bob.position.x/z`（让 `+=` 等价于从 0 重新叠加），并新增 `tests/voxel-rig.test.ts` 回归测试（连续攻击 60 帧断言水平位移始终有界，且撤掉修复即失败）。
- **验收**：`npm test` 全绿（126 项），`npm run verify:portable` 通过（17 个 Core 文件，无 three/DOM/外部时间/class 依赖），`npm run build` 通过。新增/调整用例覆盖「击退连续后退到位」「近身目标仍有最小前冲」「settle 有余速」「连击取消窗口提前接续」「弓蓄力中按冲刺被拦截」。

## v7b · 角色动画 / 手感

针对「背后受击动画不适配、大剑单手、高速步频过高、怪物转身生硬」四类动画/手感问题做了一轮程序化动画改造。Core 仍保持纯数据、可快照、确定性（新增 `DummyState.bodyYaw/headYaw`，黄金快照已更新）。

| 需求 | 改动 | 落点 |
|---|---|---|
| 受击按命中方向程序化后仰（#1） | 把 `HurtState.dirX/dirZ`（攻击者→受击者）转到身体局部坐标，身体朝「被推方向」倾倒：背后命中→朝前倒、正面命中→朝后倒、侧面命中→向侧倒；玩家与怪物共用同一套方向换算 | `src/presentation/voxel-rig.ts`（`applyHurt` 增加 `bodyYaw` 参数）、`src/presentation/dummy-rig.ts` |
| 大剑双手持 / 拖地 / 双手攻击（#5） | 大剑模型加长下段握柄；`applyMountPose` 让左手握柄沿剑身；`applyCombatPose` 新增大剑分支（双臂前伸收拢、左肩内收的双手持握 + 双手抡斩）；移动且非攻击时 `update` 平滑把剑身额外俯放，剑尖贴地「拖地」 | `src/presentation/voxel-rig.ts` |
| 高速时步幅加大、步频合理（#6） | 初版让 `strideScale` 随速度放大以压低步频；**该实现后暴露「低速抽动 / 高速频率降过头」，已在 v7c 重构为增量相位累加**（见下方 v7c 章节），本行仅记录演进 | `src/core/movement.ts`、`src/core/dummies.ts`、`src/presentation/voxel-rig.ts`、`src/presentation/dummy-rig.ts` |
| 怪物平滑转身 + 头身分离 + 方向性受击（#9） | `DummyState` 新增 `bodyYaw/headYaw`，`updateOne` 用指数平滑推进（身体慢、头快，镜像主角 orientation）；`dummy-rig` 用 `bodyYaw` 转 root、加 `headPivot` 做头身分离、`bob` 方向性受击 | `src/core/types.ts`、`src/core/dummies.ts`、`src/presentation/dummy-rig.ts` |

- **回归测试**：`tests/voxel-rig.test.ts` 新增「正面命中朝后倒 / 背后命中朝前倒」方向与「攻击跨步不飞出」用例；`tests/dummies.test.ts` 新增「怪物朝向单帧不瞬转、头快于身」用例。
- **验收**：`npm test` 全绿（129 项），`npm run verify:portable` 通过（Core 17 文件），`npm run build` 通过。

## v7c · 控制 / 特效 / 法杖重构 + 步频抽动修复

### 移动步频抽动修复（回归）

> 反馈：「移动时步频会抽动，低速时更明显；高速时频率降得有点多」。

**根因**：v7b 把步幅做成随速度动态变化，却仍用 `gaitPhase = 累积总里程 / 当前帧步幅 × 2π` 计算相位。速度一变（起步加速、松手、转向、冲刺切换），分母就变，**整段历史相位被重新缩放甚至倒退**，腿 / 手臂就会抽一下；低速时步幅在 1↔1.9 之间摆动、相对变化最大，所以最明显。另外步幅放大系数 0.9 过大，把高速步频压得太低；表现层 `amp` 还乘了 `sprinting` 布尔，按下冲刺瞬间有 20% 阶跃。

**修复**：

| 改动 | 说明 |
|---|---|
| 增量相位累加 | `gaitPhase = (gaitPhase + 当帧位移 / 当帧步幅 × 2π) % 2π`。速度变化只影响当帧增量，绝不重缩放历史相位 → 相位连续、单调不回退；取模避免长跑浮点精度下降（`sin/cos` 周期连续，跨 2π→0 无跳变） |
| 步幅增益温和化 + 外置 | `stride = strideLength × (1 + min(speed/moveSpeed, strideSpeedCap) × strideSpeedGain)`，默认 `strideSpeedGain=0.45 / strideSpeedCap=1.8`。高速步幅仍明显变大，但步频不再被压过头；调试面板「移动参数」可热改 |
| 表现层去阶跃 | `amp = min(1.35, speed/moveSpeed × 0.8)` 连续映射，去掉 `sprinting ? 1.2 : 1` |

`tests/gait.test.ts` 4 个用例直接把「抽动」量化为**相位不得倒退 / 单帧推进量有界**：验证过把 `movement.ts` 换回旧公式后，测试会在**冲刺起始帧**精确抓到 `相位倒退 -0.757 rad` 而失败，恢复后全绿。另断言高速 / 常速步频比落在 `1.05 ~ 1.66` 之间（既不降太多、也不线性飙升），以及 `gain=0` 时退化为固定步幅。

### 其余四项

| 需求 | 改动 | 落点 |
|---|---|---|
| 竖屏左下按钮移右侧 / 横屏右下（#7） | 响应式媒体查询：竖屏把左下角按钮组移到屏幕右侧，横屏保持右下 | `src/style.css` |
| 特效弧中心轴改回正前方（#10） | 撤销 v6a 为「配合 2.5D 俯视」加的 `-pitchDeg` 绕 X 倾斜 —— 它把轴拧成斜前上方。现由纯函数 `slashTiltX()` 决定（轴为纯 +Z 时恒为 0），`diagnostics().slashNormal` 可直接读出轴方向 | `src/presentation/fx-axis.ts`、`three-scene.ts`、`tests/fx-axis.test.ts` |
| 攻击 / 技2 拖拽辅助朝向（#11） | 新 Core 模块 `aim.ts` 统一解析「拖拽 > 锁定目标 > 摇杆 > 面朝向」，攻击起手、弓蓄力、法杖引导、翻滚 / 闪现共用一套优先级；输入层用 `setPointerCapture` 记录按钮拖拽向量，经相机地面基向量换算成世界方向 | `src/core/aim.ts`、`combat.ts`、`dash.ts`、`orientation.ts`、`src/adapters/input.ts`、`tests/aim.test.ts` |
| 法杖技能抽象重构（#12） | 两个技能从近战 `AttackPhase` 状态机里剥离：攻击键**按住可移动引导奥术飞弹**（按间隔发射、朝向每帧可被拖拽刷新），技2 **原地放电环**（存活期内按间隔对范围内假人结算僵直 + 轻微击退）。命中结算统一走 `hits.dealHit`，新增独立 `abilities` 模块与 `AbilityState / AbilityConfig`，全部数值外置、调试面板可热改；表现层用池化 mesh 同步飞弹 / 电环实体（自带半径与剩余寿命，无表现层计时状态） | `src/core/abilities.ts`、`types.ts`、`hits.ts`、`combat.ts`、`step.ts`、`world.ts`、`config/game.json`、`src/presentation/voxel-rig.ts`、`three-scene.ts` |

- **验收**：`npm test` 全绿（**142 项**，含 `gait / fx-axis / aim / voxel-rig` 新增用例），`npm run verify:portable` 通过（Core **19 个文件**，新增 `aim.ts` / `abilities.ts`），`npm run build` 通过；黄金快照已随结构变更更新。
- **无伤害契约不变**：假人攻击只写 `playerHurt` 动画状态；技能命中只作用于假人。

## v8 · 程序化步态（Overgrowth 式）

**背景**：v7c #11 让「移动时可以瞄准」成为常态（上半身朝目标、下半身朝移动方向），朝向分离后大量出现**侧移 / 后退**，旧步态的短板被放大——腿只绕 X 轴前后摆，侧移时仅把整个下半身转向移动方向（`legYawScale` 原为 0.7），没有真正的侧向脚步，脚会平移打滑，也没有交叉步与重心转移。

**做法**：抽出纯函数解算器 `src/presentation/gait.ts`（无 THREE、无本地时间、无随机、可单测），把速度投影到**身体局部坐标**，由 `|前后分量| / |左右分量|` 得到两轴权重，前进走前后轴、侧移走左右轴、斜向按权重混合。参考 Overgrowth 的三点，用「解析摆腿 + 重心」实现，不引入骨骼 IK 依赖：

| 机制 | 实现 |
|---|---|
| **脚落地锁定** | 支撑相用 `sin³(p)` 项把脚偏移往身后压，抵消髋部前移；摆动相快速回摆并抬膝。纯 `sin/cos` 曲线，**C∞ 连续**，杜绝 v7c 那次「步频抽动」类回归 |
| **侧向交叉步** | 移动方向那条腿为「领先腿」：摆动相额外跨过中线、步幅更大（`crossStep`），跟随腿小幅收回；两腿相位差 π |
| **重心转移** | 骨盆朝支撑脚侧移、随步相起伏与侧倾，上半身对侧摆臂 + 侧移侧倾；`legYawScale` 降到 **0.35**，让程序化脚步主导而非整体旋转下半身 |

- **玩家与怪物共用**：`voxel-rig.ts` 与 `dummy-rig.ts` 都消费 `solveGait()`（怪物复用腿摆 / 抬膝 / 起伏 / 侧倾，不重构其层级），承接 #9「怪物也要像主角一样的动画机制」。
- **可热调**：调试面板新增「程序化步态 (v8)」分组（摆幅 / 侧向步幅 / 交叉步 / 抬膝 / 脚落地锁定 / 重心侧移·起伏 / 侧倾 / 手臂），HUD 横屏显示 `strafe xx%`、竖屏 `stXx%`，直接读出当前移动方向相对身体的侧移权重与后退标记，方便验收「边瞄准边侧移」。
- **验收**：`npm test` 全绿（**152 项**，新增 `tests/gait-pose.test.ts` 9 例 + `voxel-rig.test.ts` 1 个真实骨架集成用例）；`npm run verify:portable` 通过（Core 仍为 **19 个文件**，新增模块在表现层，不污染可移植边界）；`npm run build` 通过。集成用例已做对照验证：临时把腿侧摆置零，测试立即失败（`expected 0 to be greater than 0.05`），恢复后通过——确认解算器确实接到了骨架而非摆设。
- **观感仍需真机验收**：沙箱无 WebGL，3D 画面只能靠代码 + 单测 + HUD 读数验收；侧移脚步的手感请在真实浏览器打开线上链接，用调试面板直接调 `crossStep / plantLock / sideWeight`。

## v8b · 下盘偏航连续化 + 步态投影自洽（引导飞弹 / 跨朝向回归修复）

**反馈**：① 引导飞弹时下盘「跨朝向跳变」；② 跨朝向非正前方时腿的摆动方向不对。

**根因**（两处同源，都是 v8 之前「靠整体转下盘实现侧移」的遗留机制，v8 换成程序化步态后未清除）：

| 问题 | 根因 |
|---|---|
| 下盘跳变 | `lower.rotation.y = wrapAngle(moveYaw - bodyYaw) × legYawScale`。引导时 `bodyYaw` 朝瞄准/飞弹方向、`moveYaw` 朝摇杆方向，两者常接近反向（后退 / 瞄准与移动不一致），差值逼近 ±π 时 `wrapAngle` 把 +π 突翻成 −π，下盘瞬间翻转约 `2 × 0.35 × π ≈ 2.2 rad` |
| 腿摆动方向歪 | 腿挂在 `lower` 下（已转 `legDelta`），但 `solveGait` 仍按 `bodyYaw` 投影速度 —— **投影基准 ≠ 腿坐标系**，非正前方时腿摆动方向被凭空偏了 `legDelta`。怪物骨架没有这层独立下盘转向，本来自洽，反证它是主角独有的冗余残留 |

**修复**（`voxel-rig.ts`）：

- **下盘偏航连续化**：改用「速度在身体局部的侧向占比」`latRatio = clamp(v·right / |v|, -1, 1)` 驱动 —— 前进/后退 ≈ 0（倒着走下盘不翻转）、纯侧移 ±1；再乘 `legYawScale` 限幅到 `hipYawMaxDeg`（默认 90°→实际 ≤31.5°），指数平滑 `hipYawSmoothing`。**全链路无 `atan2` / `wrapAngle`**，任何朝向都不可能跳变。
- **投影基准与下盘自洽**：`solveGait` 的速度投影从 `bodyYaw` 改为 `gaitYaw = bodyYaw + hipYaw`（= 下盘实际朝向）。于是腿世界摆动方向恒等于真实速度方向，与 hipYaw 取值无关；下盘带转与腿摆是**协同**而非重复叠加。
- 新增诊断 `VoxelRig.hipYaw() / gaitYaw()` 与 `SceneView.diagnostics().gait`，调试面板「朝向参数」分组新增 **下盘跟随移动强度 / 下盘带转上限 / 下盘带转平滑速率** 三个热调滑块。`view.orientation` 新增 `hipYawMaxDeg / hipYawSmoothing`（表现层配置，不进 Core / World 快照）。
- **验收**：新增 `tests/hip-yaw.test.ts` 4 例（引导+后退逐帧连续 / 朝向差扫整圈含 ±π 边界 / `gaitYaw == bodyYaw + hipYaw` 自洽 / 纯侧移仍以侧摆为主）。**对照验证**：临时换回旧 `wrapAngle` 公式 + `bodyYaw` 投影，测试精确抓到 `2.197 rad` 瞬跳与 `0.0997 rad` 基准偏差而失败，恢复后全绿。

## v8c · 攻击下半身权重分层（① 项后被 v8d 修正）+ 跳跃 / 落地蓄力缓冲

**反馈**：① 攻击时下半身完全不动，希望先把攻击动画的下半身权重过滤掉看效果；② 跳跃落地时增加一点「蓄力缓冲」叠加，不影响角色现有跳跃驱动，用程序动画处理。

**做法**：两项都只落在表现层，`Core` / `World` 一个字段都没改 —— 跳跃仍完全由 `movement.ts` 的 `jumpBuffer / coyoteTime / gravity` 驱动。

| 需求 | 实现 |
|---|---|
| **① 攻击动画过滤下半身权重** | 攻击姿态对腿的写入（大剑双手、三连击第 3 段）原本是 `legX.root.rotation.x = ...` 直接覆盖步态，现收口到 `setAttackLegPitch()`，按 `attackLegWeight` 与步态结果插值。新增 `AttackPoseViewConfig`：`lowerBodyWeight`（默认 **0** = 完全过滤）、`gaitWeight`（默认 **0** = 攻击期间步态平滑淡出到静止基准）、`blendRate`（进出攻击指数平滑，杜绝单帧跳变）。默认效果即「攻击时下盘稳住完全不动」；调试面板把两个权重拉到 1 就恢复旧行为，可即时对比 |
| **② 跳跃 / 落地蓄力缓冲** | 落地（`grounded` 上升沿）触发一段「快速下压 → 缓慢回弹 → 归零」的程序化脉冲：屈膝 + 髋前倾（让脚留在原地）、重心下沉 + 上半身前倾 + 手臂收拢，形成蓄力吸收冲击；起跳下降沿另有一段短促预备下蹲。脉冲强度按落地前垂直速度归一化（高处落更深，小跳也保留 `minScale`）。**只叠加关节与 `bob`/`lower` 位移，绝不写 `character.position / velocity`**；进度用 Core 的 `world.time` 计时，暂停 / 时间缩放 / 单步都与逻辑同步 |

- **纯函数层**：新增 `src/presentation/program-anim.ts`（`landingPulse / pulseValue / attackBlendStep / poseWeights / scaleGaitPose / landingImpactScale`），无 THREE、无本地时间、可单测；`config/game.json` → `view.animation` 数值全外置，调试面板新增「程序动画 (v8c)」分组（15 个热调项，含总开关）。
- **法杖引导不受影响**：引导刻意不算「攻击」，`attackBlend` 恒为 0、步态照常摆动 —— 保护 v8b 的「可移动引导」修复。
- **诊断**：`SceneView.diagnostics()` 新增 `attackBlend` 与 `landing { pulse, remaining, kind, impactVy }`；HUD 横屏显示 `atkBlend / land ...`、竖屏显示 `lw / land`。
- **验收（v8c 当时）**：`npm test` 全绿（**173 个用例 / 20 个文件**），新增 `tests/program-anim.test.ts` 8 例、`tests/attack-lower-body.test.ts` 4 例、`tests/landing-buffer.test.ts` 5 例。其中「有无 rig 两条 World 轨迹逐字节一致」直接证明缓冲不改跳跃驱动；`attack-lower-body` 用权重 0↔1 对照，确认默认下盘腿姿态恒为 0、拉满后挥击跨步重新生效。`npm run verify:portable` 通过（Core 仍 **19 个文件**），`npm run build` 通过。
- **看效果**：线上链接打开后，调试面板「程序动画 (v8c)」里把 `攻击动画下半身权重` / `攻击时步态权重` 从 0 拉到 1，即可在同一段攻击里对比「下盘完全不动」与「旧版腿随挥击跨步」；跳跃/落地缓冲可用 `启用跳跃/落地缓冲` 开关对照。

> ⚠️ **v8c 的 ① 项方向做反了**：当时把「过滤下半身权重」实现成默认两个权重都 0（下盘彻底冻结），且实际验证发现**两个权重拉满下盘依旧不动**。根因与修正在下面 v8d 章节。跳跃 / 落地缓冲（② 项）本身没有问题，v8d 未改动。

## v8d · 攻击下半身「完全不动」根因修复

**反馈**：「无论是攻击覆盖是否移动步态，下半身都没有动」—— 即调试面板里 `gaitWeight` / `lowerBodyWeight` 两个权重怎么调，攻击时下盘都纹丝不动。

**根因（两层，都不在权重本身）**：

| # | 根因 | 证据 |
|---|---|---|
| 1 | Core 攻击阶段把自主移速锁为 0（`attackMoveScale=0` → `v.x=v.z=0`，位移只由 `impulse` 前冲驱动）；而 `solveGait` 首行 `if (speed < EPS) return idle()` 直接返回全零姿态，非 `active` 段 `gaitPhase` 也因无位移冻结 | `gaitWeight=1` 时 `scaleGaitPose(idle, 1)` 仍是全零；`diagnostics().attackWeights.driveSpeed` 恒为 0 |
| 2 | 攻击写腿只散落在大剑全段与三连击第 3 段（`setAttackLegPitch(±0.24*forth, ...)`），默认剑盾前两段、双剑、弓、法杖完全不碰腿，且仅挥出瞬间非零、幅度约 14° | `lowerBodyWeight=1` 时默认武器第 1 段腿姿态恒 0 |

**做法**：全部落在表现层，`Core` / `World` 一个字段都没改，跳跃与移动驱动完全不动。

| 路径 | 实现 | 默认 |
|---|---|---|
| **步态接管** `gaitWeight` | 新增纯函数 `attackGaitDrive(real, progress, comboIndex, blend, cfg)`：按 `attackBlend` 把 gaitInput 的 `speed / phase / localForward / localRight` 平滑替换成由 `attackProgress` 派生的等效驱动（等效步速 `strideSpeed`、相位 `真实相位 + progress×TAU×cycles`、方向「前冲为主 + 连击奇偶左右交替侧跨」）。`cycles` 取整数保证两端与真实相位同相，进出攻击不跨相位跳变 | **1** |
| **挥击跨步** `lowerBodyWeight` | 删除零散的 `setAttackLegPitch`，改为所有武器 / 所有段统一叠加纯函数 `attackStridePose(progress, comboIndex, cfg)`：单段一次「蓄势后蹬 → 前踏跨出 → 收势回正」，`sin²(πp)` 包络两端值与导数均为 0、不残留；连击段奇偶决定左右脚交替领先。只写腿与骨盆，上半身跨步仍由 `applyStep` 负责 | **0** |

- **两个权重都关 = 静止基准**：`attackBlendStep` 增加端点吸附（`>0.999` 归 1 / `<0.001` 归 0），消除指数尾巴让 `gaitScale=1-b` 在攻击稳定态残留约 0.005 的比例；稳定态下盘精确静止，进出过渡帧允许 <0.12 rad 的有界平滑残留（否则会单帧跳变）。
- **弓蓄力 / 法杖引导不算攻击**：`combat.phase !== 'idle'` 才进分层；`charging` 时 phase 必为 idle，引导也不进近战状态机 —— 两者保持「可移动」的真实步态，保护 v8b 修复。
- **诊断**：`diagnostics().attackWeights` 暴露 `gaitScale / attackLegWeight / driveSpeed / stridePhase`；HUD 横屏显示 `gw … lw … spd …`、竖屏显示 `gw/lw`，可直接看出等效步速是否喂进解算器。
- **验收（v8d 当时）**：`npm test` 全绿（**187 个用例 / 20 个文件**），重写 `tests/attack-lower-body.test.ts` 10 例（默认下盘会动 / 两条权重各自生效 / 都关=稳定态静止 / 叠加更强 / 三种近战武器全覆盖 / 进出连续 / 引导与蓄力不受影响），`tests/program-anim.test.ts` 扩到 16 例（等效驱动绕过锁速、两端同相、左右交替、跨步两端归零与逐帧连续）。**对照验证**：临时把 `attackGaitDrive` 撤回成 `realDrive`（复现旧 bug），3 个用例精确抓到 `driveSpeed=0`、`maxX=0` 而失败，恢复后全绿。
- **看效果**：调试面板「**程序动画 (v8c/v8d)**」分组 —— `攻击时步态权重 gw`（默认 1）/ `挥击跨步权重 lw`（默认 0）各自 0↔1 对比；`攻击等效步速 / 前冲·侧跨占比 / 跨步腿前后摆 / 抬膝 / 侧摆 / 重心下沉` 等 8 项可热调。默认就是「过滤掉攻击写腿、下盘由等效步态持续摆动」，把 `gw` 拉 0、`lw` 拉 1 可看单次挥击跨步，两个都拉 0 回到静止基准。

## v8e · 双指捏合拉远 / 拉近相机

**需求**：「增加双指捏合拉远相机、拉近相机」。

**分层**：缩放是纯观感，全程不进 Core —— `World` / `Intents` / 快照一个字段都没加，确定性契约不变。

| 层 | 职责 | 文件 |
|---|---|---|
| 解算（纯函数） | 两指距离比例 → 本帧缩放比例；状态机显式传入 / 返回，零 DOM、零 THREE、零外部时间，可在纯 Node 单测完整手势序列 | `src/adapters/pinch.ts` |
| 输入适配 | 维护非 UI 活动指针集合、调用解算、产出 `InputFrame.zoomScale`；滚轮 / 键盘等价输入 | `src/adapters/input.ts` |
| 组装 | 把本帧比例累乘到 `userZoom` 并限幅，复位归 1，每帧 `view.setZoom()` | `src/app.ts` |
| 相机表现 | `zoomTarget → smart.zoom` 指数平滑，乘进相机距离 | `src/presentation/camera-rig.ts` |

- **方向**：两指张开（间距变大）= 倍率变大 = 相机拉远；捏合（间距变小）= 拉近。最终距离 = `camera.distance × smart.distanceScale × smart.zoom`，与智能构图正交叠加、互不干扰。
- **取最后两根指针**：`pinchPair` 用最后按下的两根，因此「单指摇杆 + 双指捏合」三指时摇杆那根不会被算进捏合距离；UI 区域（按钮 / HUD / 调试面板）按下的指针在输入层就被剔除，按技能按钮不会改镜头。
- **防误触 / 防跳变**：进入双指时立即冻结移动摇杆并清掉 tap（避免捏合时角色乱跑、松手误拾取假人）；退出双指时把剩下的单指接续为摇杆并重置原点，无需抬手重按、无方向跳变。两指重合时清空距离基准（不除零、不补算重合期间丢失的移动），恢复时从新基准起算；单帧比例按 `maxStepRatio` 限幅，`lastDist` 始终用真实距离，限幅不留欠账、手势往返精确回到原倍率。
- **桌面等价**：滚轮（向下拉远 / 向上拉近，`deltaMode` 行 / 页换算成像素）、`=` / `+` 拉远、`-` / `_` 拉近；UI 区域滚轮不拦截，调试面板仍可滚动。`touch-action:none` 与 viewport `user-scalable=no` 已禁用浏览器默认捏合缩放，自定义手势不会被抢；iOS Safari 另监听 `gesturestart` 兜底阻止系统辅助缩放（UI 区域放行，已在集成测试里验证）。
- **诊断 / 热调**：调试面板「**相机缩放 (v8e)**」分组（`min / max / smoothing / pinchGain / maxStepRatio / wheelStep / keyStep` + 「缩放归 1」）；HUD 横竖屏显示 `zoom ×1.xx`；`diagnostics().camera.zoom`、`window.__harness.getUserZoom()` 可读。
- **验收**：新增 `tests/pinch.test.ts` 14 例（取最后两根 / 张开拉远·捏合拉近 / 往返精确还原 / 进入退出连续 / 重合保护 / 单帧限幅无欠账 / gain / clampZoom / 滚轮 / 端到端倍率 / 配置自洽 / **camera-rig 集成：直接量相机到焦点距离精确翻倍、非法值兜底、指数平滑非瞬跳**）。**对照验证**：① 临时把 `pinchPair` 改回取前两根，2 例精确失败；② 临时把 `smart.zoom` 从 `computeOffset` 摘掉，2 例精确失败；恢复后全绿。另加 `tests/input-pinch.test.ts` 6 例：纯 Node 里用最小 DOM stub 派发假 PointerEvent，端到端验证「捏合真的产出 `InputFrame.zoomScale`、进出双指摇杆冻结 / 无缝接续、三指取最后两根、UI 区域指针剔除、滚轮 / 键盘等价、`dispose` 清理」。

## v8f · 骨架层级重构 + 分层受击反应

**需求**：「受击调整：不是现在更像是脚底锚定身体倾斜，改成上半身倾斜微微下沉、腿屈膝、身体倾向受击方向、屁股向后，整体重心根据受击力度偏离幅度小于身体反应，类似于打到肩和达到腹部的反应」；随后追加「骨骼结构往合理结构改，有问题修就可以了」。

**根因**：旧骨架里 `lower`（腿）与 `bob`（上半身）都直接挂在 `root`，原点都在**脚底**；`applyHurt` 只写 `bob.rotation.x/z` + 一点 `bob.position.y`，于是倾斜是「整个人绕脚底刚性倒」、腿完全不参与 —— 正是用户说的「脚底锚定身体倾斜」。假人更严重：腿直接挂在 `bob` 下，倾斜连腿一起转。

**骨架改为合理的人形层级**（`voxel-rig.ts` / `dummy-rig.ts` 同构，节点显式命名）：

```
root（世界位置 + bodyYaw；翻滚由 rollPivot 承担）
└── pelvis（髋部 y=legLen；重心 / 后坐 / 下沉 / 步态起伏，上下半身共享）
    ├── lower（绕髋带转 hipYaw；两腿 hip → knee → 鞋）
    └── upper（绕腰倾斜 / 侧倾 / 扭转；躯干 / 头 / 手臂 / 武器）
```

- 上半身 `rotation` 天然绕腰，**不需要任何位移补偿 hack**；`upper.position.y` 恒 0，下沉由骨盆统一驱动，上下半身不脱节。
- 所有子节点 y 改成「相对骨盆」，净视觉位置与旧版完全一致（测试直接量躯干世界高度仍精确为 `legLen + bodyH/2`）；`three-scene.ts` 的翻滚枢轴一行没改。
- 顺带修：`makeArm` / `makeLimb` 里局部 `upper` / `lower` mesh 与骨架组同名会造成 TDZ 遮蔽 → 改名 `upperArm` / `upperSeg` / `lowerSeg`；4 个既有测试硬编码 `children[0]/[1]` 全部改为 `tests/rig-nodes.ts` 按名查找（结构再演进只改一处）。

**分层受击**（新增 `src/presentation/hurt-pose.ts` 纯函数 `solveHurtPose`）：

| 层 | 写在哪 | 反应 |
|---|---|---|
| 上半身 | `upper.rotation.x/z/y` + `upper.position.x/z` | 绕腰朝受击方向倾斜 / 侧倾 / 肩部扭转，相对骨盆偏移幅度**大** |
| 骨盆 | `pelvis.position.x/y/z` | 屁股向后（局部 -Z）、整体下沉、沿受击方向**小幅**重心偏离 |
| 下盘 | `legX.joint / root.rotation.x` | 两腿屈膝 + 髋前倾吸收冲击，脚大体留原地 |
| 手臂 | `armX.root.rotation.x` | 打腹收拢护住 / 打肩被甩开 |

- **重心 < 身体反应**：`comShift`（默认 0.06）远小于 `abdomen / shoulder.shift`（0.26 / 0.34），两者都随力度线性增长；测试量化断言 `comShift < upperShift` 且比值 < 0.5。
- **命中部位与力度正交**：力度取 `leanLight / leanHeavy / leanKnock`，部位由 `hitHeight{light:0.2, heavy:0.6, knock:0.9}`（0 = 腹 / 1 = 肩）在 `abdomen` / `shoulder` 两套 10 参数姿态间插值。打腹含胸蜷缩（`fold`）、下沉 / 屈膝 / 后坐多、手臂收拢；打肩侧倾与扭转多、下沉屈膝少、手臂被甩开。`forceHitHeight` 可强制 0 / 1 直接对比。
- **脉冲**：复用落地缓冲的分段 C¹ 曲线（前 `pulseRatio` 快速到位、之后缓慢回正，两端值与导数均为 0），命中当帧不会单帧突跳到峰值，收尾不抽动；全部由 Core 的 `hurt.timer / duration` 派生，暂停 / 时间缩放 / 单步同步。
- **Core 零改动**：`HurtState` / `World` / 快照一个字段没加，部位与力度都是纯表现层配置；`view.hurt` 扩展为 `enabled` + `hitHeight` + `forceHitHeight` + `comShift` / `lowerScale` + 两套 `HurtPoseProfile`。`diagnostics().hurt`、HUD 横竖屏读数、调试面板「**受击分层 (v8f)**」（`enabled` 关掉即回到旧版整体倾斜做 A/B 对照；两套姿态逐项热调）。
- **验收**：新增 `tests/hurt-pose.test.ts` 11 例、`tests/hurt-rig.test.ts` 15 例（骨架层级 / 躯干世界高度 / 上半身随骨盆联动 / 腿屈膝 / 屁股后坐 / 重心<身体 / 方向性 / 部位差异 / 力度 / `enabled=false` 对照 / 不改 Core / 暂停冻结 / 假人同构）。**对照验证**：① 临时强制走旧版路径（分层未接线），9 例精确失败；② 临时把 `upper` 挂回 `root`（旧骨架），3 例精确失败（含「上半身随骨盆联动」）；恢复后全绿。既有 207 个用例（v8e 当时的全部用例）在骨架重构后全部保持通过。

## v8g · 两骨 IK / 大剑重击脱节 / 肘反折 / 惯性盆骨

**需求**：「①测试假人受角色是否加上了 IK？如果没有请加上，很多程序性动画要用到；②大剑重击时，身体会离开腿，太夸张了；③肘关节的朝向反了；④惯性身体倾斜，现在只有上半身倾斜了，盆骨应该也带一点偏移且在移动时应该略微下沉」。

### ① IK：结论是「此前没有」，现已补上通用基础设施

`gait.ts` 开头就写着「用解析摆腿 + 重心**而非骨骼 IK**」—— 全部关节都是直接写角度的 FK，脚落地锁定只是 `sin³` 曲线近似。骨盆一旦被受击 / 落地 / 攻击跨步 / 惯性层推走，脚只能跟着飘，程序动画之间无法共享「末端钉住」的约束。

| 新增 | 职责 |
|---|---|
| `src/presentation/ik.ts` | 纯函数（零 THREE / 零时间）：`solveTwoBoneIK`（余弦定理两骨反解，支持膝后折 `bend=+1` / 肘前折 `bend=-1`）、`forwardKinematics`、`blendIKAngles`（权重 + 单帧限幅）；可达范围钳制、退化输入不产 NaN |
| `src/presentation/rig-ik.ts` | THREE 适配层：`captureIKBase` / `applyFootIK`，把「脚的落点」变成世界锚点，反解髋 / 膝角吸收骨盆额外位移；返回 `active / weight / clamped / maxError` 诊断 |
| 骨架 | 腿末端加 `footTip` 空节点（小腿末端，不含鞋偏移）；腿根 `rotation.order='ZYX'`，保证 `R=Rz(roll)·Rx(pitch)` 两骨共面（THREE 默认 XYZ 是反的，roll≠0 时余弦定理无解析解） |

**锚点算法**（`applyFootIK`）：先把骨盆 / 下盘临时恢复到「步态层刚写完、尚未被上层程序动画推走」的基准，此时腿保持本帧最终 FK 角度，取两脚世界坐标作锚点；恢复真实变换后把锚点转回下盘局部，逐腿 IK 反解并按权重写回。**额外变换为 0 时 IK 解恰好等于原 FK 角度（恒等，可单测）**，所以这一层只吸收「骨盆被推走」的差值，不覆盖步态 / 跨步 / 屈膝本身；空中（`grounded=false`）整层跳过，脚随身体收起。

`view.ik`：`enabled=true / weight=0.9 / attackScale=0.65 / maxCorrectionDeg=70`。玩家与假人**完全同构**接入，省略配置参数则默认关闭（单测 A/B 对照）；调试面板「**足部 IK (v8g)**」可热调 / 一键关掉回到旧 FK。HUD 横竖屏显示 `ik on w0.90 e0.00 clamped 0`，`diagnostics().ik` 可程序化读数。

### ② 大剑重击「身体离开腿」

**根因**：`hurt.view` 的 `abdomen/shoulder.shift`（0.26 / 0.34）在 `knock`（大剑击退）峰值把整个上半身相对骨盆平移约 **0.28m**，躯干下沿直接离开骨盆；同时 `applyStep` 硬编码骨盆前移 0.17m / 侧移 0.14m / 下沉 0.05m，重击时把骨盆推得更远，脚却没有约束（无 IK）跟着飘。

- 上半身位移：诊断量 `pose.upperShift` **保持原值**（`comShift/upperShift` 比例语义不变），只在写节点时 `× upperShiftScale(0.45)` + 单轴 `clamp(maxUpperShift=0.1m)`；身体反应仍以绕腰倾斜为主，躯干始终连在骨盆上。玩家 / 假人同步。
- 跨步幅度外置到 `view.animation.stride`：`stepReach=0.12 / stepSideReach=0.09 / stepDipReach=0.035`，大剑再乘 `heavyScale=0.7`（旋身角同步收敛）。
- IK 把脚钉在落点：骨盆前移变成「脚落地 + 身体跟进」，不再出现腿与身体分家。

### ③ 肘关节朝向

骨架里手臂沿局部 `-Y` 伸出，`rotation.x` 为**正**会把前臂折向 `-Z`（身后）= 反关节；人体屈肘应朝 `+Z`（身前）。玩家 / 假人的**全部肘角**（静止、步态、空中、弓蓄力、大剑双手、剑类三连击、法杖引导、假人挥砍）统一翻符号；顺手修 `armR.joint` 旧版误用 `gait.armL` 取值。弓 / 箭的「向前 90°」补偿原本就取 `-(root+j)` 总角，翻转后自动保持正确。

### ④ 惯性倾斜带盆骨 + 移动下沉

新增 `src/presentation/inertia.ts` 纯函数 `solveInertiaPose`，把同一份已平滑的 `leanForward / leanSide / speedRatio` 拆到盆骨：

| 量 | 默认 | 作用 |
|---|---|---|
| `pelvisTiltGain` | 0.35 | 盆骨倾角 = 上身倾角 × 0.35（腿只带一点点，不掀翻整个人） |
| `pelvisShift` | 0.018 | 盆骨沿倾斜方向小幅重心平移（m/rad） |
| `moveCrouch` | 0.035 | 移动时身体略微下沉，按平滑速度比例线性取用 |
| `crouchSmoothing` | 8 | 下沉量指数平滑（1/s），帧率无关、启停不抽动 |

IK 开启时下沉由腿屈膝吸收（脚钉地）；关闭时把下沉量补偿回 `lower.position.y`，脚不穿地。假人用同一套公式 + 速度差分，保持「怪物也要像主角一样的动画机制」。

### 契约与验收

- **Core 零改动**：`types.ts` 只扩纯类型（`IKViewConfig` / `LeanViewConfig` / `HurtViewConfig` / `AttackStrideViewConfig` 字段），`src/core` 仍 **19 文件**、`verify:portable` PASS；IK / 惯性状态全在表现层，不写 `World / Intents / 快照`。
- 新增 `tests/ik.test.ts` 11 例（FK 与真实 `ZYX` 骨架逐项一致、FK→IK 往返恒等、超臂展 / 过近 / NaN、权重限幅）、`tests/ik-rig.test.ts` 8 例（假人 / 主角脚钉地 vs 关闭时漂移、`enabled=false` 精确回旧姿态、空中跳过、移动时步态不被冻结、不改 Core）、`tests/v8g-poses.test.ts` 11 例（肘符号 + 局部前臂朝 +Z、盆骨倾角 < 上身、下沉 A/B 与平滑、大剑跨步有界、knock 位移限幅与 A/B、假人同构）。
- 全量：`npx tsc --noEmit`、`npx vitest run`（**27 文件 / 263 例全绿**）、`npm run build`、`npm run verify:portable` 全通过；既有 233 例无一回归。
- **浏览器实测**：`xvfb-run` + headful Chromium 下 WebGL 2.0 可用（纯 headless 仍无 context），实测 4 个场景无 JS / WebGL 报错；HUD 显示 `ik on w0.90 e0.00 clamped 0`（静止 / 移动）、攻击时 `w0.59`（`attackScale` 生效）、受击 `hurt light 上身0.08 重心0.02`，脚贴地、无部件飞出。截图 `preview-v8g-zoom-*.png`。

## v9a · 派生招（Phase 1：机制骨架 + 剑盾冲锋盾击）

> 需求：翻滚 / 冲刺后按攻击，按武器触发派生招；跳跃落地前按攻击触发落地招。
> 本轮**只做 Phase 1 手感验证**：完整机制骨架 + 数据驱动招式表 + 剑盾「索敌中距离冲锋盾击」，其余招式配置已就位但 `enabled=false`。
> **假人与主角同构**：命中统一走 `hits.applyHit(HitTarget)`；「不能击退、不造成伤害」只是 `core.hits.noDamageToPlayer` 这个测试开关，不是代码里写死的机制差异。

### 8 条拍板的落地情况

| # | 拍板 | 落地 |
|---|---|---|
| 1 | 冲刺变招包含翻滚 / 闪现 / 长跑；长跑与闪现后留更长窗口 | `links.windows = { roll 0.3, blink 0.55, sprint 0.5 }`；长跑松手沿开窗口，`triggerWhileSprinting=true` 时长跑途中也能直接触发 |
| 2 | 空中按攻击立即起手、落地命中 | `links.landing.maxAirTime` 与落地招表（`greatsword=shockwave`、`dual-swords=cross-slam`、`sword-shield=shield-slam`）已入配置，**Phase 3 实现** |
| 3 | 屏蔽引导 | 窗口内 `attackPressed` 由派生通道优先消费（`consumedAttack`），`abilities` 与 `combat` 都读它；Phase 2 打开 `staff.enabled` 后法杖冰环即自动屏蔽引导 |
| 4 | 双刀落地交叉下劈 | `landing.moves['dual-swords'].kind = 'cross-slam'`（锥形范围，Phase 3 启用） |
| 5 | 不做背后索敌；无目标退回、超范围冲到极限中断 | `search.maxAngleDeg=85` 只取前方；起手快照目标 id / 朝向 / 距离，`travel = clamp(dist - stopDistance, 0, move.distance)` 全程不变，不重选、不追击 |
| 6 | 浮空不超过一个身高、时长按物理、浮空期间可被攻击 | `landing.moves.greatsword.hit.liftHeight = 0.9`（< `characterHeight=1.2`），Phase 3 按 `v0 = sqrt(2·g·h)` 反算初速；浮空不改变水平命中判定（仍可被攻击） |
| 7 | 共享 CD、不可连发 | 触发时把 `dash.cooldown` 至少抬到 `sharedCooldown=0.85`（与冲刺共用冷却槽），`link.cooldown` 同步；每个 `windowId` 只消费一次 |
| 8 | 弓还没想好 | `moves` 不配置 `bow`，弓完全不消费派生输入，保持原蓄力行为 |

### 机制骨架（Core，纯 TS / 零依赖 / 确定性）

`step` 顺序新增第 2 步 `links`（在 `combat` 之前做输入仲裁、在 `dash / movement` 之前写 `impulse` 保证当帧消费）：

```
1 targeting → 2 links → 3 combat → 4 dash → 5 movement → 6 orientation → 7 dummies
           → 8 decayHurt + decayLinks → 9 abilities → 10 hits（含 scanLinkHits）→ 11 separation → 12 camera
```

- **窗口**：`dash` 在翻滚结束 / 闪现完成时调 `openLinkWindow` 写状态；长跑沿由 `links` 自己检测。刻意**不依赖事件队列**（`step` 每帧开头清空），这也是 Phase 3「落地触发」预留的接口。
- **状态机**：`windup → active → recovery → idle`，独立于 `combat.phase`（保持 `idle` 才能与引导 / 普通连击正交）；`active` 写 `impulse = sin/cos(facing) × (剩余位移 / 剩余 active 时间)`，总位移收敛到 `travel`，碰撞 / 台阶 / 边界全部复用 `movement`。
- **命中扫掠**：`hits.scanLinkHits` 用 `link.fromX/fromZ`（movement 前）→ 当前位置（movement 后）的线段做 capsule 判定，一帧冲几米也不漏目标；`hitIds` 去重保证每个目标只结算一次；形状 `sector / capsule / circle / cone` 可配置，效果统一走 `applyHit`。
- **对称命中出口**：`applyHit(world, {kind:'player'|'dummy', index}, spec)`。玩家分支默认只写 `playerHurt` 动画（`noDamageToPlayer=true`）；关闭开关后按与假人完全相同的 `v0 = knockback × decay` 施加击退。`playerLink` 与每个 `DummyState.link` 是同一个 `LinkState` 结构。

### 参数（全部在 `config/game.json`，调试面板「派生招 (v9a)」可热调）

| 分组 | 关键值 |
|---|---|
| `core.links` | `enabled=true`；`windows {roll 0.3 / blink 0.55 / sprint 0.5}s`；`sharedCooldown 0.85s`；`triggerWhileSprinting true` |
| `core.links.search` | `range 6.5m`、`maxAngleDeg 85°`、`stopDistance 1.25m`、`noTargetFallback true` |
| `moves.sword-shield`（唯一启用） | `kind=shield-charge`、`distance 3.4m`、`windup 0.08 / active 0.22 / recovery 0.26s`、`hit: capsule radius 1.25 / width 0.85 / heavy / knockback 0.7m / stun 0.34s` |
| 未启用占位 | `dual-swords=thrust`、`greatsword=whirlwind`（circle + `pulseInterval 0.16`）、`staff=frost-ring`（`freeze 1.2s`）；`landing.*` 三招（含 `liftHeight 0.9`）|
| `core.hits` | `noDamageToPlayer=true`（测试限制）、`dummyKnockback 0.18m`（开关关闭后生效） |
| `view.links` | `chargeColor #7fd4ff`、`ringRadius 1.25`、`fxDuration 0.42`、`leanDeg 16`、`shieldPitchDeg 42`、`pelvisReach 0.12` |

### 验收

- 新增 `tests/links.test.ts` **28 例**：三种窗口与时长、窗口过期回退、输入仲裁（普通连击 / 法杖引导不抢）、共享 CD 与不可连发、正前方 / 背后 / 超范围索敌、起手快照不漂移、位移收敛与边界、扫掠不漏判、命中去重、不做背后命中、对称开关 A/B、假人 link 同构与 JSON 往返、复位、`enabled/modules` 双开关 A/B、含派生招序列确定性、落地招未启用无副作用。
- 全量：`npx tsc --noEmit`、`npx vitest run`（**28 文件 / 291 例全绿**）、`npm run verify:portable`（Core **20 文件**，`links.ts` 只 import 同层）、`npm run build` 全通过；golden snapshot 按流程 `-u` 更新（新增 `playerLink` / `dummies[].link` / `core.links` 导致结构变化）。既有 263 例无一回归。
- **浏览器实测**（`xvfb-run` + headful Chromium / WebGL 2.0）：Shift 翻滚 → HUD `win 0.27s` → 按 J → `link shield-charge active prog 0.27 ... travel 1.05/3.40m cd 0.68s`、`weapon 剑盾 phase idle`（普通连击未被抢）、`impulse (0, 15.69)`（冲锋生效）、蓝色起手光环；切法杖按住 J 仍 `chan Y bolts 2`（未启用招式不抢引导）；无 JS / WebGL 报错。截图 `preview-v9a-*.png`。

### Phase 2 / 3 待办（本次未做，避免稀释手感验证）

1. **Phase 2**：把 `dual-swords / greatsword / staff` 的 `enabled` 打开并实现突刺扫掠、旋风斩多脉冲 + 角色旋身一圈、冰环 `freeze` 状态与冰冻视觉（窗口内即自动屏蔽引导）。
2. **Phase 3**：`landing` 落地招（空中起手 → 落地命中）、`liftHeight` 垂直物理（假人脱离贴地假设、上限一个身高、可被打断 / 可被攻击）、剑盾落地盾震与双刀交叉下劈；同步 `separation` / 命中在浮空期间的语义。
3. **弓**：派生招待定，当前不配置即完全不影响原蓄力。

---

## v9n · 停步收相、侧移迈步，以及方向问题的最后一次修复

### 方向问题：换到「松手瞬间」这条路径

v9m 真机摘要回来了，关键读数是：

```
异常 0（dir 0 / aim 0 / freeze 0 / stick 0 / stickJump 0 / 坏指针 0 / 坐标漂移 0）
摇杆坐标源 屏幕 screenX/Y（2419 帧）
UA ... OpenHarmony 7.0 ...
```

屏幕坐标全程生效、两套坐标之间**一次漂移都没有**、逐帧自洽性检查全绿 —— 说明方向跳变**不在输入层的坐标计算里**。前两版（v9l 跳变阈值、v9m 屏幕坐标）都修错了地方，这一版不再碰坐标体系，只封「松手瞬间」尚未覆盖的四条路径：

1. **id 错配兜底**：部分 WebView 给 `pointerup` 的 `pointerId` 与 `pointerdown` 不一致，旧逻辑只按 id 匹配清摇杆 → 松手后 `stickId` 残留、方向一直挂在旧向量上，直到下一次按下才被重建（真机「松手一瞬间方向变了、再按又回到 45°」）。现在**所有非 UI 指都抬起时无条件释放摇杆**。
2. **幽灵 move**：松手后 150ms 内同 id 的补发 `pointermove` 一律丢弃（新按下会解除窗口）。
3. **假起点**：`(0,0)` 的 `pointerdown` 不再建摇杆原点（v9j 对瞄准做过的防御扩展到摇杆 down）。
4. **逐帧方向守门**：方向突变必须由真实手指位移支撑 —— 转过 θ 却没走出对应的弧长就保持上一帧方向。遥测是 30Hz 抽样，**松手那一两帧的尖峰可能整个漏采**（这正是摘要「异常 0」却仍看到跳变的原因），守门放在事件层逐帧跑。

> 按约定：这版之后若仍复现，就清除 v9l/v9m/v9n 在输入层的全部修理，方向问题不再追。遥测诊断与调试盘是纯观测层，保留。

### 手感 ①：停步不再卡在最后一个 pose

Core 的 `gaitPhase` 只在有位移时推进（`frameDist / stride`）。松手后速度指数衰减、位移趋零 → **相位冻结**；而 `solveGait` 只要 `speed >= EPS` 就仍按这个冻结相位输出姿态，于是角色卡在最后一个跨步 pose 一小段时间，然后突然弹回待机。

新增纯函数 `solveStopGait` / `nextFeetTogetherPhase`：在减速尾段接管相位与幅度，用 smoothstep 把相位推进到**下一个双脚并拢点**（`π/2 + kπ`，两腿相差 π，此时左右脚同时回到髋正下方），同时把 `speed` 与 `stride` 同系数淡到 0 —— 两脚各走完最后半步、抬膝与重心同步消退，收拢到待机。玩家与假人同构。

### 手感 ②：纯侧移不再「双腿平行拖行」

「与假人保持距离横移」是纯侧移：`wS≈1 / wF≈0`，两腿 `pitchX≈0`、只有左右摆，看起来像两脚平行滑动甚至互相穿过。

新增纯函数 `strafeHipYaw`：用**连续侧向占比的平方**做增益，把下盘朝移动方向多带转一点（`legYawScale 0.35 → 侧移时 0.56`，约 50°），速度在腿局部坐标系里就有了前向分量，步态自然变成斜向迈步。增益在前进/后退（`lat≈0`）时为 0，没有 `atan2` / `wrapAngle`，任何朝向都不会跳变；假人用独立参数（`strafeHipScale / strafeHipMaxDeg`），玩家沿用 `orientation` 配置。

### 配置（`view.gait`，调试面板可热改）

| 字段 | 值 | 含义 |
|---|---|---|
| `stopBlendSec` | 0.30 | 停步收相时长（0 = 关闭，回旧行为） |
| `strafeHipBoost` | 0.6 | 纯侧移下盘偏转增益（0 = 精确退回旧线性行为） |
| `strafeHipScale` | 0.70 | 假人下盘偏转基准比例 |
| `strafeHipMaxDeg` | 62 | 假人下盘偏转上限 |

### 验收

- 新增 `tests/gait-stop.test.ts`（10 例）：并拢相位总在之后且不超过半步、起点已并拢时走满半步、progress=0 与正常步态一致 / =1 收敛到待机、过渡中姿态确实在变且幅度单调收拢、侧移偏转左右对称 / 前向零偏转 / boost=0 精确退回旧行为 / 单调不超上限。
- 更新 `tests/hip-yaw.test.ts`、`tests/voxel-rig.test.ts` 的侧移断言：从「前后摆应明显小于侧摆」改为「侧摆与前后迈步同时存在」（这正是本次目的），其余不累积 / 投影自洽不变式保持。
- 全量 **34 文件 / 382 例全绿**；`tsc`、`verify:portable`、`build` 通过。
- 浏览器实测（390×844）：松手后 `stopT` 从 -1 → 0.39 → 0.72 → 1.00，`|legLPitch|` 同步从 0.44 → 0.49 → 0.05 → 0（相位真的在走、最终收拢到待机）；纯侧移 `hipYaw 37.4°`（旧 31.5°）且 `legLPitch 0.65`（前后迈步出现）；正前跑 `hipYaw 0.0°`（前进不受影响）。
- 新增 `__harness.gaitDebug()`：`stopT / hipYaw / 双腿 pitch·roll`，方便随时在控制台核对手感。

---

## v9m · 鸿蒙浏览器「松手瞬间方向跳掉」：改用物理屏幕坐标

**报告**：摇杆推左下 45°，按技能没问题，松手一瞬间方向被改变，再按一次又回到 45°；幅度像「垂直加/减了一个摇杆半径的向量」。
**关键线索**：换浏览器就好了 —— 鸿蒙自带浏览器坏、微信内置浏览器（XWeb）正常。

### 结论

不是算法错，是**那套 `clientX/clientY` 在漂**。

鸿蒙自带浏览器的工具栏收起/展开是一个**平滑动画**：动画期间，同一根物理位置上报的 `clientY` 每帧挪几像素，累计几十像素 —— 量级正好等于一个摇杆满推行程（56px）。摇杆方向是「手指 − 原点」，平移只落在一端，于是向量凭空多/少一个固定向量；重新按下时原点也落在新坐标系里，两者一起平移 → 又回到 45°。

v9l 的修法（「单帧跳变超过 28px 就当平移吸收」）对这类**渐进式**漂移完全无效：每帧只动 6px，永远够不到阈值。这次真机反馈「bug 依然存在」正是这个原因。

### 修法：方向改用物理屏幕坐标

`PointerEvent` 继承 `MouseEvent`，带 `screenX/screenY` —— 相对**物理屏幕**，页面重排、工具栏收放、地址栏动画都影响不到它。

```ts
// 按下时同时记两套原点
originX/Y   = clientX/clientY      // 兜底
originSX/SY = screenX/screenY      // 主用

// 移动时
dx = (screenX - originSX) / screenScale   // screenScale：有些浏览器 screen 用物理像素
dy = (screenY - originSY) / screenScale
```

三道保险，保证「换了浏览器也不会反而变差」：

1. **屏幕坐标可用性探测**：真实移动时 `screen` 必须跟着动；若连续两帧「client 动了 > 12px 而 screen 纹丝不动」，判定该浏览器的 screen 是假数据，本根手指立刻回退 client。
2. **全零不算「没动」**：`screenX/Y = (0,0)` 视为「不支持」，不能拿它当「物理屏幕没动」的证据，否则会把正常滑动误判成坐标系平移、把摇杆冻死。
3. **尺度自适应**：部分浏览器 screen 是物理像素（DPR 倍），用「两套坐标同向时的长度比」做 EMA 校准，摇杆满推行程才不会缩水。

回退到 client 时仍保留 v9l 的平移吸收。

### 诊断：让浏览器自己交代

采样表再追加 6 列：`osx/osy`（屏幕原点）、`fsx/fsy`（屏幕手指）、`scr`（本帧是否用屏幕坐标）、`scl`（尺度比）。新增异常 `stickDrift`：

```
· stickDrift @t2.25 tick135 client 相对屏幕漂移 +60px（方向未受影响，已按屏幕坐标校正） client(70,710) screen(80,747)
```

摘要里多一行，直接回答「下次还坏该往哪儿查」：

```
摇杆坐标源 屏幕 screenX/Y（19 帧）
```

如果这行显示的是「client（该浏览器未提供可用屏幕坐标）」，说明该浏览器连 `screenX/Y` 都不可信，需要换方案（touch 事件交叉校验）。

### 验收

- 新增 `tests/input-screen.test.ts`（7 例）：client 平滑漂移 ±60px 方向纹丝不动、两套坐标同步时正常跟随、screen 恒零回退 client、screen 是假数据两帧内回退、DPR 2 尺度自适应、松手全清、重按回到 45°。
- 全量 **33 文件 / 369 例全绿**；`tsc`、`verify:portable`、`build` 通过。
- 浏览器实测（390×844，Chromium + swiftshader）：真实触摸左下 `225°` 且 `screenOk=true`；注入「client 每帧 +6px、screen 不动」共 60px → 方向仍是 `225°`；屏幕坐标同步移动 → `225° → 239°` 正常跟随；松手 `held=false`、输入归零；重按回 `225°`。
- 真实多指回归：慢推左下 225°、快速甩右 92°、绕圈 24 步 `bad=0`（无误吸收）。

---

## v9l · 「松手瞬间方向跳掉」：坐标系平移 + 摇杆自洽性判定

**报告**：摇杆推左下 45°，按技能没问题，**松手的一瞬间输入方向被改变**，再按一次又回到 45°；测出来「有时候是垂直方向加了一个圆半径的向量，有时候减了一个半径向量」。

### 结论

不是摇杆算法算错，是**坐标系整体平移**：手机浏览器地址栏收起 / 展开（以及转屏、键盘）时，同一个物理位置上报的 `clientX/clientY` 会整体平移几十像素 —— 量级刚好等于一个摇杆半径（满推行程 56px）。

摇杆用「当前手指 − 原点」算方向，平移只落在其中一端，于是向量凭空多出/少掉一个固定向量：

```
按下   原点 O(120,600)   手指 P(60,660)   d = (−60,+60)   → 225°（左下）
平移后 原点不变          手指 P(60,716)   d = (−60,+116)  → 202°（被拉向正下）
```

按下瞬间原点也落在新坐标系里，所以**重新按一次就恢复正常** —— 与真机现象逐条对得上。平移大多是竖直方向，所以看起来是「垂直加/减了一个半径向量」，方向不定取决于平移是收还是放。

### 修法：把「坐标跳变」当成坐标系平移吸收掉

单帧里手指「跑」出物理上不可能的距离时，不做「丢弃」（会把摇杆冻死），而是把**原点跟着平移同样的量**，于是 `d = 手指 − 原点` 保持原值 —— 方向一点都不跳，后续事件回到同一坐标系后照常工作：

```ts
const px = ptX - stickPxX, py = ptY - stickPxY;      // 本帧坐标增量
if (coordsShifted) { originX += px; originY += py; } // 原点同步平移 = 向量不变
```

判定「是不是平移」用两条独立证据，都不依赖拍脑袋的速度阈值：

1. **视口刚变过**：`window.resize` / `orientationchange` / `visualViewport` 的 `resize|scroll` 之后 200ms 内的跳变；
2. **物理屏幕没动**：`screenX/screenY`（固定物理点，不受浏览器 UI 影响）几乎不动、`client` 坐标却跑了几十像素。

同时保留 v9j 那条防御并复用到摇杆：`(0,0)` 幻影 move 直接丢弃（部分 WebView 在松手/切手势时会补发）。

### 诊断：让「手指没动方向却变了」自己报警

采样表新增 6 列（只追加不重排）：`pid` 指针 id、`ox/oy` 原点、`fx/fy` 手指位置、`bad` 拦截计数、`vvt` 视口偏移。新增两类异常：

- `stickJump`：手指位移远小于「转过这么多度本应走的弧长」（弧长 = 半径 × 转角）→ 打印
  `Δ45° 手指只动6px(弧长应66px) o(120,600)→(120,600) 原点位移0px p(60,716) raw(-60,116) id7 vvt0`
  —— 一眼分辨是**手指真动了**还是**原点被挪了**；
- `stickBad`：幻影 / 平移吸收真的发生了，报「拦截几条」。

摘要里摇杆类异常会额外打印 `o` / `p` 两行轨迹。

### 另一处加固

`isUiTarget` 之外再按坐标确认一次（`document.elementFromPoint`）：少数 WebView / 指针捕获场景里 `e.target` 会被重定向成 canvas，导致「按在按钮上的手指」被当成摇杆起点。

### 验收

- 全量 **32 文件 / 362 例全绿**；`tsc`、`verify:portable`、`build` 通过。
- 浏览器注入验证（同一根手指的合成 PointerEvent）：坐标系下移 56px 而屏幕坐标不动 → 输入保持 `225°`、`bad` 由 0 → 1；连续偏移不再漂移；两套坐标同步位移 → 正常跟随（225° → 207°）；`(0,0)` 幻影被丢弃且方向不变。
- 真实多指触摸回归：慢推左下 `225°`、快速甩右 `92°`、绕圈 24 步全程 `bad=0`（没有误吸收）。

---

## v9k · 临时方向调试盘（输入 / 移动 / 目标同屏）

真机问题一直靠「文字摘要 + 事后推理」，看日志能算出角度，但**当场看不见**。这一版加一块临时面板，把三个方向画成同一张图，出问题抬头就能对：

| 颜色 | 含义 | 来源 |
|---|---|---|
| 青（细实线） | 摇杆输入方向 | `intents.moveX / moveZ`（死区之后） |
| 黄（粗实线，长度 = 速度） | 角色**实际移动**方向 | `character.velocity`（< 0.15 m/s 不出箭头） |
| 品红（圈外三角 + 淡虚线） | **目标方向** = 面朝向 `facing` | `character.facing` |
| 青（细虚线） | 死区之前的原始摇杆 | `stickRawX / stickRawY` |
| 橙（虚线） | 拖拽辅助瞄准方向 | `intents.aimX / aimZ` |
| 红（细虚线） | 锁定目标方向 | `targeting.targetYaw` |
| 灰虚圈 | 摇杆死区半径 | `view.joystick.deadZone` |

### 读法（关键约定）

角度一律**按屏幕方位**换算（正上 = 相机前方，顺时针为正，右 90°、下 180°、左 270°）。所以：

- 手指推**左下** → 青箭头必然指向左下（225°），与手指位置完全一致；
- 若黄箭头不跟着青箭头走，说明「输入 → 位移」这段偏了；
- 若品红三角离开青箭头（且没在瞄准 / 攻击），说明面朝向被别的东西改写了（锁定、攻击锁定残余、瞄准余辉）。

读数两行：`入 225 移 225 面 225` / `Δ入→移 0°  Δ入→面 0°  v4.2  锁#3 7.4m`。

**告警**：`Δ入→移 > 45°`（且真的在跑）或 `Δ入→面 > 50°`（且不在瞄准 / 攻击中）时，整圈边框转黄、第二行变黄 —— 这就是 v9i 那类「推左下却走左上」的现场特征。

### 实现

- 新增 `src/presentation/dir-debug.ts`：纯观测层，**只读** `World` / `InputFrame` / 相机地面基向量，不写任何状态，不进 Core、不进快照、不上传。
- 画布 118px，`devicePixelRatio` 放大；青黄两支叠画（黄粗在下、青细在上），方向一致时呈「青色芯 + 琥珀边」，一眼能看出三点重合。
- 位置：竖屏 / 桌面在屏幕下方居中（避开角色与两簇按钮）；横屏矮屏（`max-height: 460px`）移到左下空带并缩到 96px，避免压住角色与版本徽标。
- 位置固定、指针穿透；只有标题胶囊 `方向 ⌄` 可点（带 `data-ui-button`，按下不会启动摇杆），收起状态记在 `localStorage.harness.dirDebug`，键盘 `V` 也能切。
- 自动化可读：`__harness.dirAngles()`（完整一帧读数）、`__harness.dirDebug`（开关 / 上一帧），DOM 上还有 `#dirdbg[data-in|data-mv|data-fc|data-warn]`。
- 整块可删：去掉 `src/presentation/dir-debug.ts`、`app.ts` 里的 `createDirDebug` 一段、`style.css` 的 `#dirdbg*`，再删测试文件即可。

### 验收

- 新增 `tests/dir-debug.test.ts`（10 例）：四个正方向的屏幕角、任意相机偏航下「摇杆角 = 意图角」、夹角吃 360° 环绕、输入/位移同向不告警、反向 180° 告警、死区吃掉输入时只有原始箭头、慢走不出箭头、瞄准期间面朝向偏离不算异常。
- 全量 **32 文件 / 359 例全绿**；`tsc`、`verify:portable`、`build` 通过。
- 浏览器实测（390×844 / 844×390 / 1280×720）：左下推杆 `入 225 移 225 面 225`，键盘 `A+S` 同样 225°；松手后移动箭头消失；拖拽瞄准 45° 时橙虚线 + 品红三角同向、读数出现「拖拽瞄准」；注入一帧反向位移后 `data-warn=1`、读数 `Δ入→移 135°`；点胶囊拖拽不会启动摇杆。

---

## v9j · 核对「摇杆向量与瞄准向量是否被合并」

v9i 发布后提出一个更根本的怀疑：会不会是「摇杆的拖拽向量」和「摇杆原点到右侧按钮」被合成了一条向量。

**结论：没有合并，但怀疑方向是对的 —— 这两条向量在方向上几乎重合，只靠角度分辨不出来。**

### 实测

```
A 摇杆左下              v = (-2.97, 2.97)   moveYaw = -45°   facing = -45°    aim inactive
B 按住技能2 拖 (40,-32)  v = (-2.97, 2.97)   moveYaw = -45°   facing = 128.7°  aim = (40,-32) len 51

屏幕角度对照（0° = 右，90° = 下）：
  相对按钮按下点   -38.7°   len  51   ← peekAim 实际使用
  相对摇杆原点     -39.0°   len 526
  相对摇杆起点     -37.8°   len 442
```

- 角度三者几乎一样，因为摇杆与按钮恰在同一条斜线上；**长度才能区分：51px ≠ 526px**，所以基准是按钮按下点。
- 拖拽前后速度向量一字未变、`moveYaw` 始终 -45°，说明**位移方向没变，变的是面朝向**（角色面朝左上侧着走）。

代码侧也确认是两套独立状态：摇杆 `originX/Y + rawDX/rawDY`，瞄准 `aimStartX/Y + aimDX/aimDY`，只有各自的事件处理写入，没有任何交叉读取。

### 但顺着这个怀疑查出一个真隐患

若 `pointerdown` 给出 `(0,0)`（部分 WebView / 合成事件会这样），`aimStart` 就成了屏幕原点，之后任意移动都会变成「屏幕左上角 → 手指」的几百 px 向量 —— 看起来**确实像两条向量被合并了**。

修法：按下时若坐标为 `(0,0)`（按钮不可能在左上角），标记基准无效；第一个真实 `pointermove` 用它自己的坐标重取基准，本帧位移记 0。

### 诊断增强

`InputFrame` 新增 `aimDX / aimDY`（相对按钮按下点的原始屏幕向量），异常行直接打印：

```
· dirJump 69° res69° yaw -101→-169.9 in -100.7° mvΔ0° aim(10,-8) fl=aim→aim
```

`aim(10,-8)` 一眼能看出「这是十几像素的抖动」还是「这是几百像素的错基准」。

### 验收

- 新增 `tests/input-aim.test.ts` 第 6 例：`(0,0)` 坏基准下首个 move 只取基准、位移为 0，再拖 40px 才产生方向。
- 全量 **31 文件 / 349 例全绿**；`tsc`、`build` 通过。
- 线上实测：坏基准后 `aim dx=0`、`active=false`；再拖 40px → `dx=40`、`active=true`。v9i 的 10 项与 v9f 的 20 项回归全 PASS。

---

## v9i · 第三份真机摘要：点按被当成拖拽瞄准

**现象**：按住摇杆向左下移动，点按技能2，移动方向变成左上；松手一会儿才回到摇杆方向。

**日志里的铁证**：

```
· dirJump @t314.55 69° res69° yaw -101→-169.9 in -100.7° fl=aim→aim
· g:drag skill2 345ms d13px -78°      ← 屏幕上 -78° 就是左上
```

`d13px` 是关键：点按技能2 时拇指自然位移了 13px，而辅助瞄准的确认阈值是 **12px**，于是这次点按被判定成「拖拽瞄准」，方向取的是抖动方向（屏幕 -78°），优先级高于移动输入（`resolveFacingYaw`：拖拽 > 锁定 > 移动），朝向就被带走了。松手后还有 140ms 的余辉（v9d 为弓 / 法杖加的），所以「松开一会儿才回位」。

### 修法：两档阈值 + 确认标记

| 量 | 旧 | 新 |
|---|---|---|
| 进入瞄准 | 12px | **26px** |
| 撤销瞄准 | — | **16px**（迟滞，避免阈值附近闪） |
| 手势 drag 判定 | 12px | 20px（点按不再被记成 drag） |
| 未确认拖拽的松手 | 留 140ms 余辉 | **立即清零**，不留余辉 |

新增 `aimArmed`：只有位移真正达到 26px 才置位；没置位就抬起，抖动向量直接丢弃。这样连「松手后 140ms 内朝向仍被锁在抖动方向」也一并消失。

### 为什么不是「技能2 干脆不参与瞄准」

拖拽按钮指定方向是 v7c 的既定能力（翻滚方向、法杖电环落点）。问题不在「能不能瞄准」，而在「点按被误判成瞄准」。26px 在 457px 宽屏上约 5.7%，按钮直径约 64px，有意拖出去仍然很容易触发。

### 顺带修正诊断判据

- `dirJump` 原先没排除 aim：玩家拖拽瞄准把朝向改到指定方向，会被报成异常。现在 aim 期间（本帧）屏蔽。
- `aimDrop` 原先只要「aim 消失 + 朝向跳 > 22°」就报，但松手后回到摇杆方向是**正确行为**。加条件：只在**无移动输入**时判（v9d 那个「站着松手面朝正下方」才是 bug）。

### 验收

- 新增 `tests/input-aim.test.ts` **5 例**：摇杆左下 + 点按抖动 13px 不产生 aim 且不改移动输入、40px 拖拽生效、拖出再缩回撤销、确认拖拽后松手保留余辉（v9d 回归）、两个按钮的抖动都不产生 aim。
- `tests/telemetry.test.ts` 新增 2 例：瞄准期间改朝向不报 dirJump、有输入时松手回位不报 aimDrop。
- 全量 **31 文件 / 348 例全绿**；`tsc`、`verify:portable`（Core 20 文件）、`build` 通过。
- 浏览器实测（线上 v0.9.10）：摇杆推左下（v=-2.97,2.97）+ 点按技能2 抖动 13px → `aim=false`，朝向 `-45° → -45°`；松手 500ms 后仍 `-45°`；拖出 64px → `aim=true`、朝向变到 128.7°（有意生效）；松手 140ms 内回到 -45°；整段 `异常 0（dir 0 / aim 0）`。

---

## v9h · 第二份真机摘要：转向转速上限 + 判据换成「残差」

第二份摘要（v0.9.8，33.3s / 2931 帧）先给结论：**战斗链路没问题** —— 攻击 24 次命中 19、受击 7、翻滚 2、跳 11，没有 `moveFreeze` / `stickLost`，`dirJump` 从 10 降到 5。

### 一、那 5 条 dirJump，全都能被输入解释

把每条的最后朝向和同帧输入方向摆在一起看，5 条全部落在 3° 以内：

| t | 跳变 | 输入方向 | 结论 |
|---|---|---|---|
| 6.82 | 102° | 5° → 朝向 5.2° | 空中拨杆，朝向跟着输入 |
| 11.43 | 141° | -60° → 朝向 -60.4° | 攻击锁定（80.9°）解除后归位 |
| 19.90 | 126° | 162° → 朝向 161.5° | 空中拨杆 |
| 22.75 | 126° | -168° → 朝向 -168.2° | 摇杆中途松手 5 帧后重新指方向 |
| 30.57 | 65° | 55° → 朝向 55° | 双击跳连打时拇指漂移 |

也就是说：**朝向没有一次是「去了玩家没要求的地方」**，判据本身还在误报。上一版换成输入方向只是修了一半 —— 它量的是「这一帧输入有没有变」，而不是「朝向和输入对不对得上」。锁定解除和「松手再指」这两类，输入确实没变，于是照样中招。

### 二、真问题：大角单帧整块翻转

141°、126° 这些跳变本身是正确行为（锁定解除后要回到输入方向），但**一帧抹完 120°+ 不对**：

- 头先于身体到位（`headTurnRate 20`），会被限幅在「身体 ±55°」上，于是三帧内甩到限幅边界再被身体拽回来，看着像抽帧；
- 真机上这种帧恰好又容易掉帧，观感更差。

**修法**：给面朝向一个转速上限，全部在 `core.orientation` 热调。

| 参数 | 默认 | 作用 |
|---|---|---|
| `facingTurnRate` | 1800°/s | 单帧最多 30°（60fps）/ 20°（88fps） |
| `facingSnapDeg` | 30° | 夹角小于它直接对齐，小修正零延迟 |

对应到实际转角：**30° 以内瞬时，90° 约 3 帧（50ms），180° 掉头约 6 帧（100ms）**。

不影响手感的三条保证：

1. 攻击朝向走的是 `resolveFacingYaw`（拖拽 > 锁定目标 > 移动输入），**完全没经过这个限速**，起手方向依旧当帧生效；
2. 小于 30° 的微调仍然瞬时对齐，走位修正没有延迟感；
3. 身体 / 头部仍是原来那套两级追随，只是喂进去的面朝向不再有尖峰。

### 三、诊断判据改成「残差 + 收敛」

```
旧：|Δyaw| > 50° 且 |Δ输入方向| < 15°      → 锁定解除、松手再指 都会误报
新：|Δyaw| > 50° 且 |yaw - 输入方向| > 12° 且 残差没有在缩小
```

- 残差 = 朝向与当前输入方向的夹角。跟着输入转 → 残差 0 → 正常。
- 加了转速上限后，大角掉头必然有几帧残差 20~150°，所以再补一条**「残差在缩小」就放过** —— 朝向正在往输入方向追，不是跑偏。
- 被放过的大角转向不再静默：计入新的 `输入转向 N 次（最大 M°）`，出现在摘要异常行末尾。这样「这次跳了但正常」和「这次跳了所以是 bug」都看得见。

另外两处口径修正：

- 采样表新增 **`inYaw` 列**（第 20 列）。之前摘要里的 `in` 是用 `mx/mz` 现算的，和判定用的 `inYaw` 不是同一条取值路径，出现过「摘要显示输入在变、判定却说 `inΔ=0`」的对不上。
- 摘要的 `异常 N` 改为**按计数**而不是按缓冲条数。掉帧条目有 6 条上限，之前会写出「异常 3（spike 29）」这种自相矛盾的行，现在拆成 `异常 3（dir/aim/freeze/stick）· 掉帧尖峰 29`。

### 验收

- `tests/orientation.test.ts` 19 例（新增：90° 4 帧内到位且单帧不超限速、小角瞬时对齐、攻击锁定解除跨帧归位、掉头 6 帧完成且身体滞后）。
- `tests/telemetry.test.ts` 19 例（新增：限速转身途中不算异常并记入「输入转向」；拨杆转身走真实 `step` 不再误报）。
- 全量 **30 文件 / 341 例全绿**；`tsc`、`verify:portable`（Core 20 文件）、`build` 通过。
- 浏览器实测（线上 v0.9.9）8 项：每**模拟步**转角最大 30.0°（不是每渲染帧 —— 100ms 掉帧会补算 6 步，按渲染帧量必然超）、180° 掉头跨 6 步、摘要出现「输入转向 2 次（最大 120°）」且 `dir 0`、`inYaw` 列与 `yaw` 一致、无 JS 报错；v9f 那 20 项回归同样全 PASS。

---

## v9g · 真机日志驱动的两项修复（朝向抗抖 + 诊断判据纠错）

第一份真机摘要（v0.9.7，28.9s / 2454 帧）暴露了两件事，都修在这一版。

### 一、`dirJump` 大半是误报：判据用错了量

原判据：`|Δfacing| > 50°` 且 `|ΔmoveYaw| < 18°` 且不在动作中。

`moveYaw` 由**实际速度**反推（`atan2(v.x, v.z)`），而速度受加速度限制，转向要 0.1~0.2s 才转过去。所以玩家快速拨杆转身时，`facing` 已经瞬移，`moveYaw` 还停在旧方向 —— 判据把「正常转身」读成了「朝向跳变」。

真机 10 次里有 8 次的 `moveΔ` 落在 13~17°，正是这个滞后区间的指纹。

**修法**：改用**输入方向**（`intents.moveX/moveZ` 的 `atan2`）作参照，阈值 15°；无输入时按「输入未变」处理。摘要里同时打印 `inΔ` 与 `mvΔ`，一眼能分清是玩家转的还是角色自己跳的。

```
· dirJump @t14.23 tick854 75° inΔ3° mvΔ17° yaw 57.2→131.9 fl=air→air
  yaw 57.3 57.2 57.2 57.2 57.2 57.2 131.9
  in  . . . . . . .            ← 输入方向序列（'.' = 无输入）
```

### 二、剩下的是真问题：小幅推杆时朝向对像素过敏

真机摇杆半径 56px、死区 8%。一根 7px 半径的手指绕圈，`atan2` 就能扫满 360°；拇指在原点附近微颤 3~5px，方向就在两个角度之间来回跳。v9e 之后 `facing` 是**瞬时跟随**输入方向的，于是角色原地来回抽（日志里 `55 ↔ 119` 交替那几条）。

**修法**：按推杆幅度分三档，全部可在 `core.orientation` 热调。

| 幅度 | 行为 | 参数 |
|---|---|---|
| < 18%（≈10px） | 视为拇指微颤，**完全不改面朝向** | `facingMinMagnitude` |
| 18% ~ 35% | 与当前朝向夹角 < 22° 不动；超过则按 14/s 指数趋近（≈70ms 到位），不是瞬移 | `facingDeadbandDeg` / `facingSmoothRate` |
| ≥ 35% | **瞬时跟随**，转身手感与之前完全一致 | — |

刻意保住「大幅推杆零延迟」：这条路径没有加任何平滑，快速转身、掉头、连续变向都不受影响。

代价：持续轻推同一方向时，朝向会停在死区内（最多偏 22°），身体略微侧倾 —— 视觉上反而更像侧步。

### 三、诊断数据本身的增强

- 摘要新增 `当前武器` 与 `法杖 引导N 飞弹N 电环N · 弓蓄力N` 一行 —— 之前那份日志里「攻击 0 次」无法判断是没按、还是按在法杖 / 弓上（这两种武器不产生 `attack-start`）。
- 手势统计改成 `按下 51（单击 27 / 双击 20 / 拖拽 4 / 长按 0 / 打断 0 / 拖放 4）`，避免 `press 51 / release 4` 看起来像丢了 47 次抬起。
- 异常上下文多打印一行 `in`（输入方向），用来区分「输入在跳」与「朝向自己跳」。

### 验收

- `tests/orientation.test.ts` 新增 5 例：轻推不瞬移且收敛到死区内、大幅推杆瞬时、微颤零响应、反复反向转角受限。
- `tests/telemetry.test.ts` 新增 2 例：玩家拨杆转身不误报、输入没变仍照常报。
- 全量 **30 文件 / 338 例全绿**；`tsc`、`verify:portable`、`build` 通过。
- 浏览器实测（线上 v0.9.8）：拇指 ±5px 随机抖 50 次，`facing` 逐帧变化 **0.000 rad**（修复前 62°）；大幅推杆 90° 仍瞬时到位。

---

## v9f · 发布端飞行记录仪（诊断数据采集）

**问题**：真机（尤其手机）出问题时，「打开控制台抄日志」这一步就把反馈堵死了 —— 复现一次、记不住、说不清。

**做法**：发布端内置一个纯内存环形记录仪，默认一直录、不打扰、不上传；出问题时点左下角版本徽标 →「复制摘要」，一整段文本直接粘回来即可定位。

### 采集什么

| 层 | 内容 | 用途 |
|---|---|---|
| 采样行（30Hz / 600 行 ≈ 20s） | t / tick / 帧耗时 / 摇杆原始值与生效值 / 指针是否按住 / 输入源 / move 意图 / 位置 / 速度 / 面向 + 身体朝向 / 状态位掩码 / 步幅 | 复盘「那一刻」到底发生了什么 |
| 事件 | `attack-start` `hit` `player-hurt` `link-*` `roll` `blink` `jumped` `reset` `blocked`，以及 `longPress / doubleTap / drag / cancel` 手势 | 把帧序列和「我按了什么」对上 |
| 统计 | 平均 fps / 最大帧耗时 / 尖峰数 / 摇杆活跃占比 / 手势计数 / 各类动作计数 | 一眼看整体是否正常 |
| 异常 | 见下表，自动把可疑片段圈出来 | 免去逐帧翻数据 |

**不采集**：任何文本输入、账号、设备 ID、URL 参数。UA 截断 90 字符，屏幕尺寸只用于判断横竖屏与 DPR。

### 自动标记的异常

| kind | 判定 | 对应问题 |
|---|---|---|
| `dirJump` | 单帧朝向变化 > 50°，同时 `moveYaw` 变化 < 18°，且不在攻击 / 翻滚 / 派生 / 受击中 | 松手掉向、朝向跳变 |
| `aimDrop` | 上一帧还在拖拽瞄准，本帧 aim 消失且朝向变化 > 22° | v9d 修过的法杖 / 弓松手掉向 |
| `moveFreeze` | 摇杆幅值 > 0.35 但速度 < 0.08 m/s 持续 > 220ms，且不在动作 / 受击 / 撞墙状态 | 按钮穿透、输入被吞 |
| `stickLost` | 指针按住摇杆、曾有大读数，却持续读到 0 超过 300ms | 第二指冻结摇杆（v9e 修过） |
| `frameSpike` | 单帧 > 50ms（首 0.6s 不计，最多留 6 条） | 掉帧 / GC / 着色器编译 |

每条异常带触发前后各 3~4 帧的采样（`ctx`）与一行可读 `detail`，摘要里会把 yaw 序列直接摊开。

### 怎么用

- **手机 / 线上**：点左下角 `v0.9.7 · … · 诊断` →「复制摘要」→ 粘到聊天。摘要 < 8KB，纯文本可直接读。
- **要看完整数据**：同面板「下载完整记录」得到 `harness-*.json`（schema `harness-telemetry/1`，`columns` 给列定义，`samples` 是定长数组，比对象形式省 2/3 体积）。
- **控制台 / 自动化**：`__harness.telemetry.summary()` / `.dump()` / `.status()`。

### 设计取舍

- **不做自动上传**。静态站没有后端，任何「偷偷上报」都要依赖第三方端点，既不可靠也不该默认发生。要接的话把 `dump()` 挂到 `navigator.sendBeacon` 即可，接口已经独立。
- **不上报也能定位**：摘要里已有「哪一帧、什么状态、前后怎么变」，比原始日志好读。
- 只读 World，不进快照、不写任何 Core 状态；`verify:portable` 仍是 20 文件 PASS。
- 开销：30Hz 落盘 + 每帧几次比较；600 行数组约 55KB，挂机一小时也不增长。
- 掉帧（`frameSpike`）限量 6 条：低端机长时间跑会把玩法异常挤出缓冲。

### 验收

- 新增 `tests/telemetry.test.ts` **16 例**：抽稀与容量封顶、行列对齐、事件 / 统计累积、摘要结构、`clear` 归零、dirJump 命中与「攻击锁向不误判」、aimDrop、moveFreeze 与「攻击中站立不误判」、stickLost、尖峰与 `suspend` 抑制、状态位文本、暂停记录后仍统计帧数、同类异常节流、默认参数、时钟多步回调。
- 全量 **30 文件 / 331 例全绿**；`tsc --noEmit`、`verify:portable`、`build` 均通过。
- **浏览器实测**（`xvfb-run` + headful Chromium）：18 项 —— 徽标文案、`__harness.telemetry` 可用、点徽标开抽屉、状态行、注入朝向跳变后徽标 `is-alert`、摘要含 dirJump / fl / UA、摘要 < 8KB、复制按钮反馈、dump schema 与行列对齐、可关闭、徽标外拖拽仍能移动、点徽标不产生位移、步数统计、尖峰限量、摇杆活跃占比、无 JS 报错。

---

## 测试假人

场地放 **4 个体素假人**，配色各不相同（橙 / 绿 / 紫 / 红），头顶有编号 + 行为标签。初始从左到右分别对应四种行为：

| # | 行为 | 规则 | 典型用途 |
|---|---|---|---|
| 1 | 小范围随意走动 | 以出生点为圆心、半径 3m 内随机取目标，约 2.2s 换一次；随机源是 `world` 里的种子随机 | 观察 AI 移动、步态、与场景碰撞 |
| 2 | 跟随玩家 | 朝玩家移动，进入 1.2m 停距后停住，不贴脸 | 跟随手感 / 后续寻路前置验证 |
| 3 | 跟随并与玩家保持一定距离 | 目标 4m；太远靠近、太近后退，±0.6m 死区内绕着玩家侧移 | 走位 / 距离控制 / 风筝行为 |
| 4 | 跟随并攻击玩家（**无伤害**） | 追到 1.6m 内站定，每 1.6s 挥砍一次，`active` 帧出现红色攻击弧并触发玩家受击动画 | 攻击表现、事件、无伤害验收 |

- **点击切换**：轻点任意假人 → 该假人在 5 种状态间循环；切换时头顶标签重绘并闪一下。
- **无伤害**：假人只写自己的状态、`dummy-attack` / `dummy-hit` 事件与 `world.dummyAttackCount`，**从不写玩家任何状态**；玩家受击动画状态放在 `World.playerHurt`。
- **共用碰撞**：假人与玩家用同一套 AABB 白盒解算，且彼此 / 与玩家之间由 `separation` 保证不重叠。
- **复位**：按钮 / `R` 一次性把玩家、战斗状态、四个朝向角、目标、受击、命中计数、冲刺状态、4 个假人全部送回配置里的初始值。复位当帧不推进任何模块。
- **调试钩子**：浏览器控制台可用 `window.__harness.world` 读实时状态、`window.__harness.view.projectToScreen(x,y,z)` 投影世界坐标、`window.__harness.view.diagnostics()` 读表现层数值、`window.__harness.viewConfig` 热改表现层参数、`window.__harness.input.sample()` 读当前 Intents 与摇杆值。

参数在 `config/game.json` → `core.dummies`，配色与标签底色在 `view.dummies`。

---

# 验收方式

分四层：**自动验收 → 手动验收脚本 → 可量化检查项 → 移植验收**。

## A. 自动验收（3 条命令，退出码必须为 0）

| 命令 | 验证什么 | 期望 |
|---|---|---|
| `npm run build` | TypeScript strict 全量类型检查 + Vite 生产构建 | `tsc --noEmit` 无错误，产出 `dist/` |
| `npm test` | 29 个测试文件：玩法 / 战斗 / 朝向 / 假人 / 确定性 / 可移植 / 目标 / 命中 / 分离 / 冲刺 / 相机 + **步频 / 程序化步态 / 下盘偏航 / 特效轴 / 拖拽朝向 / 体素回归 / 程序动画纯函数 / 攻击等效驱动 + 挥击跨步 / 攻击下半身权重 / 落地缓冲 / 双指捏合纯函数 + 相机缩放集成 / 输入层捏合集成 / 受击分层纯函数 + 骨架层级集成 / 两骨 IK 纯函数 + 骨架足部锚定 / 肘朝向 + 惯性盆骨 + 大剑重击边界 / 派生招窗口·索敌·扫掠命中·对称开关·A/B·确定性** | 全部 `PASS`，共 **315 个用例** |
| `npm run verify:portable` | Core 在纯 Node 无头跑 600 步 + 可移植边界守卫（Core **20 个文件**） | 输出 `[boundary] PASS` |

`npm test` 覆盖的关键行为（除前述全部历史项外）：**目标软锁定只选前方扇区、背对敌群不扭头、攻击朝向贴合目标、动态前冲随理想距离热改、近身目标不前冲也不重叠、弓蓄力面向目标、按住自动连击 1→2→3→1、关闭 autoCombo 后按住不起手、松开即停；命中扇区与武器距离、三种受击类型、大剑击退到理想距离且玩家位置不变、受击僵直、受击计时衰减、假人命中玩家但 character 逐字节不变、关闭 hits 无命中；玩家与假人 / 假人之间不重叠、完全重合不被弹到边界、关闭 separation 允许重叠、分离不进白盒；翻滚按武器分化 / 翻滚位移收敛 / 方向键不叠加 / 闪现单帧完成 / 闪现不穿墙 / 闪现受边界约束 / 冷却与 dash-ready / 翻滚中禁止攻击 / 攻击中禁止翻滚 / 蓄力中禁止翻滚 / 无输入朝面朝向 / 关闭 dash 完全不触发 / 复位清空 / 五种武器除法杖外全翻滚 / 长序列确定性；v8c：落地缓冲曲线两端归零且 C¹ 连续、引导不误伤步态、有无 rig 两条 World 轨迹逐字节一致、落地脉冲随 Core 时间暂停冻结；v8d：攻击等效驱动绕过 Core 锁速（对照撤回后 driveSpeed=0 被精确抓到）、两条权重各自驱动下盘、都关时攻击稳定态静止、剑盾/双剑/大剑全武器覆盖、连击左右脚交替、跨步两端归零且逐帧连续、弓蓄力可移动不受分层影响；v8e：捏合取最后两根（摇杆不被误算）、张开拉远 / 捏合拉近且往返精确还原、两指重合清空基准无跳变、单帧限幅不留欠账、滚轮上下互为倒数、clampZoom 非法比例不污染、setZoom(2) 后相机到焦点距离精确翻倍、缩放指数平滑非瞬跳、输入层 DOM stub 端到端验证 zoomScale 与摇杆 / tap / UI 隔离；v8f：骨架层级 root→pelvis→[lower,upper] 且躯干世界高度不变、上半身随骨盆联动下沉、腿屈膝 / 屁股后坐 / 重心偏离全非零、comShift<upperShift 且比值<0.5、打肩 vs 打腹逐项差异、方向性后仰 / 前倾 / 侧倾、力度单调、enabled=false 旧姿态对照、受击不回写 Core、暂停冻结、假人同构；v9a：翻滚 / 闪现 / 长跑三来源窗口与时长（长跑 / 闪现更长）、窗口过期精确退回普通连击、未配置招式的武器不抢输入（法杖仍可引导）、一个窗口只触发一次且共享 CD 阻止连发、正前方锁定 / 背后不索敌 / 无目标冲到极限中断、起手快照不随目标瞬移漂移、active 位移收敛且不越界、一帧大位移线段扫掠不漏判、每目标只结算一次、背后敌人不受击、`noDamageToPlayer` 开关 A/B（关闭后玩家按同一公式被击退）、假人 `link` 与主角同构且 World 可 JSON 往返、复位与模块开关冻结、含派生招序列确定性、落地招未启用无副作用**。

> 逻辑有意改动时用 `npx vitest run -u` 更新 `tests/__snapshots__/determinism.test.ts.snap` 并人工确认原因。v9a 因 `World` 新增 `playerLink`、`DummyState.link`、`CoreConfig.links`、`HitsConfig.noDamageToPlayer/dummyKnockback`、`ModuleFlags.links` 与 4 个新 `EventType`，基线已按流程更新（字段名刻意避开 `window` 等浏览器全局词，否则边界守卫会误判）。这份快照是**跨语言对照的黄金基线**。

## B. 手动验收脚本

按顺序做，每一步记录「通过 / 失败」。建议开着 HUD（调试面板按需展开）。

| # | 操作 | 预期现象 | 判定 |
|---|---|---|---|
| 1 | 启动页面 | 5 级台阶、2 个门洞、独立墙、网格、体素角色、HUD、顶部 5 个武器按钮、左下 3 个按钮、右下「技2 / 攻击」、4 个假人 + 标签；无摇杆图形；**右上调试面板只有一个窄标题栏（默认收起）** | 要素齐全 |
| 2 | 左上空白处按住并向上拖 | 角色朝场景深处走，HUD `stick` 变化，腿部交替摆动 | 摇杆生效 |
| 3 | 松开手指 / 鼠标 | 角色平滑减速停下 | 输入归零 |
| 4 | 边走边画圈改变拖动方向 | 相机不旋转，只平移跟随；`body` 平滑滞后于 `face`，`head` 更靠近 `face` | 2.5D 跟随 + 朝向分离 |
| 5 | 走向最左两级矮台阶（0.25 / 0.40） | 免跳自动登顶，`stepUp 0.25` / `0.40` | 自动爬台阶 |
| 6 | 直接走向中间 0.60 台阶 | 被挡住，`pos.y` 保持 0，`blocked` | 阈值判定 |
| 7 | 对 0.60 / 0.90 / 1.20 台阶边前进边按「跳」 | 能登上台阶，`pos.y` 变为对应高度 | 跳跃 + 落地 |
| 8 | 对准 x≈-3 的宽门洞直走 | 顺畅穿过，无 `blocked` | 门洞通行 |
| 9 | 对准 x≈4 的窄缝直走 | 被挡住（缝宽 0.5 < 角色直径 0.6） | 碰撞半径 |
| 10 | 平地按「跳」 | `jumped` → `landed`，`pos.y` 归 0 | 跳跃状态机 |
| 11 | 按住「冲」并拖动 | 位移明显变快，步态幅度提升 | 冲刺（按住加速跑） |
| 12 | 按「复位」 | 回出生点，`combo` / `charge` / 四角 / `target` / `hit` / `hurt` / `dash` 清零，4 个假人归位 | 复位 |
| 13 | 调试面板把「自动爬台阶阈值」改到 0.7 | 原本要跳的 0.60 台阶现在可直接走上 | 配置热生效 |
| 14 | 改俯角/距离/平滑；勾「碰撞盒线框」；「暂停 + 单步」 | 视角实时变化；白盒变线框；单步 `tick` 每次只 +1 | 调试能力 |
| 15 | 手机触屏重复第 2、10 步 | 摇杆与按钮同时响应，无页面滚动/缩放 | 多指输入 |
| 16 | 点顶部「大剑」或按 `3` | 按钮高亮、HUD `weapon 大剑`、调试面板下拉同步、角色换上大剑 | 武器切换三处同步 |
| 17 | 连点「攻击」三次，间隔约 0.5s | `combo 1/3 → 2/3 → 3/3`；三段轨迹不同、白色斩击弧；每次前移后有停顿 | 三连击 + 节奏 |
| 18 | 攻击过程中快速连点 | 输入被缓冲，当前段停顿结束后自动接下一段 | 连击缓冲队列 |
| 19 | 切「双剑」(2)、「剑盾」(1) 各跑一轮连击 | 双剑节奏更快；剑盾左手出现盾；剑斜向前伸出 | 三种剑差异化 |
| 20 | 切「法杖」(4)，分别按「攻击」与「技2」 | 施法1 举杖前推 + 青色光球；施法2 双手上举砸地 + 下蹲 | 法杖双施法 |
| 21 | 切「弓」(5)，**按住**「攻击」约 1s 后松开 | 拉弓、弓弦后拉、蓄力条增长且移速变慢；松开箭矢飞出；轻点即松不发射 | 弓箭蓄力 |
| 22 | 展开「战斗参数」改「段间停顿」「攻击时移动比例」「连击窗口」 | 停顿变长/变短立即可感 | 战斗参数热改 |
| 23 | 按住摇杆持续移动，**同时**用另一根手指按「技2」「攻击」并来回滑动 | `stick` / `move` 数值不变、方向不跳变 | 按钮不干扰移动 |
| 24 | 单指按在两个按钮之间的缝隙里再拖动 | 不启动摇杆（`stick (0,0)`），也不误点假人 | UI 间隙隔离 |
| 25 | 站在原地连点三次「攻击」，盯 HUD `pos` 与 `phase` | 三段各前冲一次，每次 `settle` 期间 `pos` 完全不动 | 连击停顿节奏 |
| 26 | 先按住摇杆跑起来，**保持按住**再点「攻击」 | 攻击期间前冲距离与静止攻击基本一致 | 攻击与移动解耦 |
| 27 | 侧向移动时突然反向 | `face` 立即变、`body` 滞后、`head` 介于两者、`move` 由速度决定 | 三向分离 |
| 28 | 把「身体平滑速率」调到 1 与 30 各转一次向 | 1 = 极慢，30 = 几乎瞬转 | 朝向参数热改 |
| 29 | 观察 4 个假人数秒 | 1 号小范围走、2 号贴近停住、3 号保持约 4m 绕行、4 号追上挥砍 | 四种 AI |
| 30 | 轻点 1 号假人 5 次 | `FOLLOW → KEEP DIST → ATTACK → IDLE → WANDER` | 五态循环 |
| 31 | 在 2 号假人身上按下并拖动 100px | 角色移动，但 2 号标签不变 | tap / 拖动区分 |
| 32 | 静置约 5 秒，盯 4 号假人与 HUD | 4 号周期挥臂 + 红色攻击弧；`atkCount` 涨，而 `pos / vel` 不变 | 攻击表现 + 无伤害 |
| 33 | 按「复位」 | 玩家回 `(0,0,8)`；4 个假人回初始位置与模式；`atkCount` / `hit` 归 0 | 全局复位 |
| 34 | 关闭 `orientation` 模块再移动 | 四个朝向角保持不变 | 模块可插拔 |
| **35** | 把浏览器窗口切成竖屏（或手机竖持） | 攻击与技2 **纵向排在右侧**（技2 上、攻击下）；武器条独占顶部、HUD 变 7 行短版且在其下方、调试面板只剩窄标题栏；**HUD / 提示 / 武器条 / 面板互不重叠、不溢出屏幕** | **竖屏布局** |
| **36** | 空白处按住向上拖约 56px | HUD `stick` 已达 `(0,-1)` 满推，不需要拖到 96px；调试面板「摇杆满推行程」可热改 | **摇杆行程缩小** |
| **37** | 刷新页面看右上角 | 调试面板默认收起，点标题才展开；展开后所有参数分组都在 | **面板默认收起** |
| **38** | 推摇杆朝敌群方向走，再按「攻击」 | HUD `target #n @x.xm` 亮起、目标脚下出现**金色指示环**、角色朝该目标挥砍；背对敌群时 `target 无`、攻击不扭头 | **智能目标辅助** |
| **39** | 站在敌人正前方**按住**「攻击」不放 2~3 秒 | 无需再点，`combo` 自动 `1→2→3→1→2→3…` 循环；松手后当前段结束即停 | **按住自动连击** |
| **40** | 主动走向一个假人并顶住 | 假人被挤开，**始终不与玩家 / 其它假人重叠**；HUD `pos` 不因假人推动而跳动 | **角色间碰撞** |
| **41** | 切「大剑」，贴近 1 号假人挥砍 | 假人明显**向后退开**到约 1.35m、后仰幅度最大、红闪；`hit` 计数增加 | **大剑击退 + knock 受击** |
| **42** | 用剑盾第 1 段 / 第 3 段、法杖分别命中假人 | 第 1 段后仰小（light）、第 3 段与法杖后仰明显更大（heavy）；静置约 5 秒看 4 号假人打玩家，玩家也会后仰闪色，但 `pos / vel` 完全不变 | **三种受击动画 + 无伤害** |
| **43** | 切「弓」并把假人放在身前，**按住**攻击键蓄力，同时把摇杆推向侧面 | 角色仍**面向目标**（金色环所指方向），不跟随摇杆转身；松手箭矢飞出 | **弓蓄力面向目标** |
| **44** | 在模块分组依次关掉 `targeting` / `hits` / `separation` 各观察数秒 | 关 targeting → 攻击不再自动朝敌；关 hits → 命中与受击动画消失；关 separation → 假人可重叠；重新打开即恢复 | **三个模块可插拔** |
| **45** | 站在敌人前方按「攻击」，盯白色斩击弧 | 是**竖立、朝正前方**挥出的一道弧，不是脚边的圈、也不是朝正上方的碗；弓箭 / 刀刃宽面竖直 | **v6a 特效 / 武器朝向** |
| **46** | 启动、急停、绕圈各观察角色 | 启动前倾、刹车后仰、绕圈侧倾，指数平滑无突变；受击时倾斜被压低 | **v6a 惯性倾斜** |
| **47** | 切「剑盾」，**按一下** `Shift` /「冲」 | HUD `dash kind roll phase active`；角色**前滚一整圈**、起点出现淡蓝尘环、`pos` 前进约 3.2m；翻滚中按住方向键也不改变位移 | **v6b 翻滚** |
| **48** | 翻滚中立刻再按一次 `Shift` | 冷却中 `dash.id` 不变，不会连滚；冷却结束 HUD 出现 `dash-ready` | **v6b 冲刺冷却** |
| **49** | 切「法杖」，**按一下** `Shift` | HUD `dash kind blink phase idle`；角色**瞬移约 5m**，起点 + 落点各一个紫色光环，`dash.to` 与 `pos` 完全一致 | **v6b 闪现** |
| **50** | 站到障碍墙前朝墙按 `Shift`（法杖） | 落点停在墙前，**不穿到墙后**；朝世界边缘闪现也不越界 | **v6b 落点保护** |
| **51** | 关闭 `dash` 模块再按 `Shift` | 完全不触发翻滚 / 闪现，按住仍只是普通加速跑 | **v6b 模块可插拔** |
| **52** | 展开「冲刺 / 闪避」分组改「翻滚距离 / 闪现距离 / 冷却 / 特效时长」 | 位移、冷却、光环存活时间立即可感 | **v6b 参数热改** |
| **53** | 启动后走远、让 4 个假人都离开身边（或点成「待机」并拉远距离） | HUD `camera threat 0% dist×0.88`；画面明显更贴近玩家，角色变大、视野变窄 | **v6c 无威胁推进** |
| **54** | 走到 4 个假人中间让它们围过来 | `threat` 上升、`dist×` 变 >1、`pitch` 略增；画面自动拉远，敌群被纳入构图 | **v6c 威胁拉远 + 俯仰** |
| **55** | 把假人都引到玩家同一侧 | 画面中心朝敌群平移，玩家偏离画面正中；HUD `off` 读数方向与敌群一致 | **v6c 构图平移** |
| **56** | 展开「智能相机」改「最大拉远比例 / 最大构图平移 / 构图平滑速率」 | 拉远幅度、平移幅度、镜头跟随速度立即可感 | **v6c 参数热改** |
| **57** | 关闭 `camera` 模块 | 相机平滑回到固定 2.5D 构图，`dist×1.00`、`off(0,0)`、`pitch+0°` | **v6c 模块可插拔** |
| **58** | 默认配置直接按「攻击」，盯角色下半身 | 攻击全程下盘**持续摆动**（腿交替迈步、随挥击节奏推进）；HUD `gw 1.00  lw 0.00  spd 2.40`、`atkBlend` 升到 ≈1 | **v8d 攻击等效步态驱动（默认）** |
| **59** | 调试面板「程序动画 (v8c/v8d)」把 `攻击时步态权重 gw` 拉 0、`挥击跨步权重 lw` 拉 1 再攻击 | 下盘改为单次挥击跨步，连击 1→2→3 左右脚交替领先；`diagnostics().attackWeights.attackLegWeight≈1` | **v8d 挥击跨步路径** |
| **60** | `gw` / `lw` 都拉 0 再攻击 | 攻击稳定态下盘完全静止；进出攻击的几帧有 <0.12 rad 平滑残留、无单帧跳变 | **v8d 静止基准 + 平滑过渡** |
| **61** | 切「剑盾 / 双剑 / 大剑」各打一段，再看 `gw=1/lw=1` 叠加 | 三种武器第 1 段下盘都会动（旧版只有大剑与第 3 段写腿）；两权重都开幅度大于任一单层 | **v8d 全武器覆盖 + 可叠加** |
| **62** | 按「跳」，落地瞬间观察 HUD 与角色 | 落地后约 0.06s 内明显下蹲（屈膝 + 前倾），约 0.34s 回正；HUD `land land 0.xx t0.xx vy-8.xx`；`pos / vel` 与关闭缓冲时完全一致 | **v8c 落地蓄力缓冲 + 不改驱动** |
| **63** | 关闭「启用跳跃/落地缓冲」再跳一次 | 落地无下蹲、`land none/0.00`；跳跃轨迹不变 | **v8c 缓冲可插拔** |
| **64** | 切「弓」按住蓄力并侧移，或切「法杖」按住引导侧移 | `atkBlend≈0`，下盘仍是真实侧移步态（交叉步 / 重心转移），不被攻击分层冻结 | **v8d 蓄力 / 引导不受影响** |
| **65** | 双指在空白区张开 / 捏合 | 镜头连续拉远 / 拉近，HUD `zoom ×1.xx` 跟随；角色不因捏合乱跑，松手不会误点假人 | **v8e 双指捏合** |
| **66** | 捏合后抬起一指、剩余手指继续滑动 | 摇杆无缝接续（无方向跳变、无需抬手重按）；再放第二指重新进入捏合，倍率不跳 | **v8e 进出连续性** |
| **67** | 桌面滚轮向下 / 向上滚，或按 `=` / `-` | 同样拉远 / 拉近；调试面板内滚轮只滚面板、不改镜头 | **v8e 滚轮 / 键盘 + UI 排除** |
| **68** | 调试面板「相机缩放 (v8e)」把 `min/max` 收紧、点「缩放归 1」 | 倍率立即被夹在新范围内并平滑回 1；HUD 与 `diagnostics().camera.zoom` 同步 | **v8e 热调 / 复位** |
| **69** | 让假人打中玩家 / 玩家打中假人，盯角色 | 受击瞬间上半身朝受击方向倾斜并微微下沉、两腿屈膝、屁股后坐；**不再是整个人绕脚底倒**；HUD `hurt heavy 部位h0.60 脉冲p0.xx 上身0.xx 重心0.xx 后坐0.xx 屈膝0.xx` | **v8f 分层受击** |
| **70** | 调试面板「受击分层 (v8f)」关掉「启用分层受击」再受击 | 回到旧版「脚底锚定整体倾斜」：腿不动、屁股不后坐、`diagnostics().hurt.legacy=true`，可即时 A/B 对比 | **v8f 旧姿态对照** |
| **71** | 「强制部位」设 0 再设 1，各受击一次 | 0 = 打腹（含胸蜷缩、屈膝 / 下沉 / 后坐多、手臂收拢）；1 = 打肩（侧倾扭转多、下沉屈膝少、手臂甩开） | **v8f 打肩 vs 打腹** |
| **72** | 分别用轻击 / 重击 / 大剑击退命中 | 力度越大，屈膝 / 后坐 / 上身位移越大；但 `重心` 读数始终明显小于 `上身` | **v8f 力度 + 重心约束** |
| **73** | 受击时看 HUD / 控制台 `pos / vel`，与关闭分层时对比 | `character.position / velocity` 完全不变（长期无伤害契约）；`diagnostics().hurt` 与所有姿态读数可复现 | **v8f 不改 Core** |
| **74** | 让假人打中玩家 / 玩家打中假人，盯脚 | 受击后坐 / 下沉时脚仍踩在原地，身体靠屈膝吸收；HUD `ik on w0.90 e0.00 clamped 0` | **v8g 足部 IK** |
| **75** | 调试面板「足部 IK (v8g)」关掉「启用 IK 足部锚定」再受击 / 移动 | 回到旧 FK：骨盆被推走时脚明显跟着飘、下沉时脚穿地；`ik off` | **v8g IK 旧姿态对照** |
| **76** | 切「大剑」(3) 按住攻击连击，盯躯干与腿的连接 | 跨步收敛、双手抡剑时躯干始终连在骨盆上、脚贴地；不再有「身体离开腿」 | **v8g 大剑重击** |
| **77** | 静止 / 移动 / 弓蓄力 / 大剑挥击，盯手肘；再按住 W 起步 | 肘一律朝身前折（不是反关节）；起步时盆骨跟着带一点倾角、跑动中身体略微下沉；调试面板「惯性倾斜 / 盆骨 (v8g)」可热调 | **v8g 肘 + 惯性盆骨** |
| **78** | 剑盾：Shift 翻滚结束后立刻按 J | HUD `link shield-charge active ... travel x/3.40m`、角色举盾前撞并向前冲、脚下蓝色光环；`weapon 剑盾 phase idle` 说明普通连击没被抢 | **v9a 翻滚派生** |
| **79** | 翻滚后等 0.5s 再按 J | `link - idle win 0.00s`，精确退回普通三连击（窗口已过期） | **v9a 窗口** |
| **80** | 调试面板「派生招 (v9a)」热调 `windows.*` / `distance` / `stopDistance` / 击退，或关掉总开关 | 数值即时生效；关掉总开关后窗口内按 J 回到旧连击，可 A/B 对照 | **v9a 可配置性 / A/B** |
| **81** | 窗口内连按 J，或触发后立刻再按 Shift | `link.id` 不增长、HUD `cd` 非零、不能再翻滚（共享 CD 不可连发） | **v9a CD** |
| **82** | 把假人放到正前方 / 背后各触发一次；再关掉「测试限制: 玩家不被击退」让假人打中玩家 | 正前方冲到 `stopDistance` 附近并命中；背后 / 超范围只冲到 `distance` 极限；关闭开关后玩家按同一公式被击退（机制同构） | **v9a 索敌 / 对称** |
| **83** | 手机竖屏打开，看右侧按钮分布；再横过来对照 | 冲 / 跳（左列）与技2 / 攻击（右列）合成一个**垂直居中**的双列拇指簇（390×844 下两列中心都在 y=422、间距 10px）；复位单独在右下角、不与簇重叠；左下角整块留给隐形摇杆；横屏仍是右下角一行 | **v9b 竖屏操作簇** |
| **84** | 竖屏进入后不做任何操作，看左上角；再点「状态」「操作说明」；然后直接拖摇杆 / 按攻击 | 默认只有一个一行摘要（`t… fps … 武器阶段 … lk … hit …`）和两个小胶囊，说明完全收起；点开后 HUD 变 7 行、说明限高可滚；一开始操作两者**立刻收起**；在 HUD/说明覆盖的左上方区域直接拖动也能起摇杆（容器指针穿透） | **v9c 状态栏收起** |
| **85** | 竖屏看调试面板位置；点开面板；再按攻击 / 技能 | 面板在**左上 HUD 下方**（390 宽下右缘 226px），与右侧操作簇（x≥242）完全不重叠；展开后仍不压按钮；横屏保持右上 | **v9d 面板位置** |
| **86** | 法杖按住攻击向右上拖、松手；弓蓄力向右上拖、松手；再把浏览器切到后台 2s 回来 | 松手后角色朝向**保持拖拽方向**（HUD 展开看 `aim` 与 `attackFacing` 不变），不会跳回正前方；切后台回来不会卡在蓄力 / 冲刺按住；HUD 最后一行 `gesture` 能看到 `tap / doubleTap / longPress / drag / release` | **v9d 手势 / 松手** |
| **87** | 看左下角 | 常驻一个半透明小标签 `v0.9.6 · MM-DD HH:mm`（版本号 + 构建时间）；它不吃点击，压在上面拖摇杆照样能走 | **v9e 版本徽标** |
| **88** | 左手按住摇杆持续向右走，右手拇指去按攻击 / 技2 / 冲 / 跳（可多个按钮同时按）；再让小指 / 掌根蹭一下屏幕 | 摇杆方向**完全不跳变、不停**（HUD 展开第 3 行 `stick(x,y) pointer` 数值稳定）；刷屏不会触发缩放（第二指相对移动 <18px 不确认捏合） | **v9e 摇杆独占** |
| **89** | 极慢推杆（约 1 m/s）走 10 秒，盯双脚；再满推杆常速走；最后按住 Shift 冲刺 | 慢走时脚是「抬起来放下」而不是在地上往前滑；`HUD 展开`第 3 行 `str` 显示当前步幅（约 1.1m），走一个周期正好前进约一个步幅；冲刺段因腿已到可达极限会有轻微蹬地拖步（已知限制） | **v9e 零滑步** |

## C. 可量化检查项

| 项目 | 目标值 | 测量方式 |
|---|---|---|
| 逻辑步长 | 恒定 60 Hz（0.01667s） | HUD `steps`；`npm test` |
| 桌面帧率 | ≥ 55 FPS（真实 GPU；软件渲染 / Xvfb 约 15~30 FPS 不作判定依据） | HUD `fps` |
| **摇杆满推行程 / 死区** | **56 px / 0.08** | `view.joystick`；浏览器实测 56px 时 `stick = (0,-1)` |
| 点击判定阈值 | 位移 < 8px 才算 tap | `adapters/input.ts`；手动第 31 步 |
| 按钮区隔离 | UI 容器含间隙 `stick` 恒 `(0,0)`、不产生 tap | `data-ui-region` + `uiPointers`；手动第 23/24 步 |
| 自动爬台阶阈值 | 0.45 | `core.stepHeight` |
| **支撑脚滑移（零滑步）** | ≤ 1e-6 m/帧（0.6–4.8 m/s） | `tests/gait-pose.test.ts` 逐帧采样「脚世界坐标」；冲刺段放宽到 <30mm/帧 |
| **脚前伸 / 步幅比** | 0.25（= 步幅/4，解析零滑步条件） | `view.gait.reachRatio`；调试面板「脚前伸 / 步幅比」 |
| **捏合确认阈值** | 18 px | `adapters/input.ts` `PINCH_ARM_PX`；手动第 88 步 |
| 角色半径 / 身高 | 0.30 / 1.20 | `core.characterRadius / characterHeight` |
| 宽 / 窄门洞 | 2.4m 可通 / 0.5m 不可通 | `scene.doorways` |
| 连击窗口 / 段间停顿 | 0.65 s / 0.16 s（settle 期间位移变化 = 0） | `core.combat.*`；`npm test` |
| 攻击时移动比例 | 0（位移严格 = lunge） | `core.combat.attackMoveScale` |
| **按住自动连击** | **开启后 2.3s（软件渲染）≥ 3 次起手，序列 1→2→3→1** | `core.combat.autoCombo`；浏览器实测 |
| **目标辅助** | **范围 7m / 前方扇区 ±90° / 理想距离 1.35m / 前冲最大 ×1.6** | `core.targeting.*`；浏览器实测 `attackFacing == targetYaw` |
| **命中扇区 / 武器距离** | **±65°；剑盾 1.6 / 双剑 1.5 / 大剑 2.0 / 法杖 2.6 / 弓 9 m** | `core.hits.*`；`npm test` |
| **受击时长** | **light 0.20 / heavy 0.32 / knock 0.42 s** | `core.hits.hurt*` |
| **大剑击退** | **0.75 m，命中后敌人距离 ≥ 1.35 m** | `core.hits.knockback.greatsword`；浏览器实测 0.7 → 1.48m |
| **角色最小间距** | **玩家↔假人 ≥ 0.60 m，假人↔假人 ≥ 0.60 m；玩家位置永不被改** | `core.separation`；浏览器实测 `[0.601, 0.602, 0.861, 0.902]` |
| **分离迭代 / slop** | **3 轮 / 0.002 m** | `core.separation.*` |
| **v6a 特效 / 武器朝向** | **`slashNormal=[0,0.766,0.643]`；`arrowForward.y≈0`；启停倾斜符号相反；绕圈 `side≈-0.121`** | `SceneView.diagnostics()`；浏览器实测 |
| **翻滚位移 / 时长 / 冷却** | **3.2 m（实测 3.200m）/ 0.36 s / 0.7 s** | `core.dash.*`；`npm test` + 浏览器实测 |
| **翻滚动画** | **前滚 360°（`rollAngle` 峰值 ≈ 6.28 rad），绕身体中心不插地** | `diagnostics().dash.rollAngle` |
| **闪现位移 / 落点一致性** | **5 m 上限（实测 5.000m），撞墙停在墙前；`toX/toZ == position.x/z`** | `core/dash.ts`；`npm test` + 浏览器实测 |
| **冲刺特效** | **翻滚 1 个尘环 / 闪现 2 个光环** | `diagnostics().dash.activeRings / lastKind` |
| **智能相机：无威胁推进** | **`distanceScale = 0.88`（实测 0.881）、threat=0、off=0、pitch=0** | `core.camera.pushIn`；`diagnostics().camera` |
| **智能相机：威胁拉远 / 平移 / 俯仰** | **4 个近身攻击假人 → threat=0.653、×1.205、off(1.03, 0)、pitch +4.57°** | `core.camera.*`；浏览器实测，玩家屏幕 Δx=-48px |
| **智能相机：平滑 / 可插拔** | **smoothing 3.2；关闭模块后 dist 回到 ×1.00（实测 1.0005）** | `view.smartCamera.smoothing`；浏览器实测 |
| 假人攻击伤害 | 恒为 0（`character` 逐字节不变） | HUD `atkCount` 增长而 `pos/vel` 不变；`npm test` |
| 确定性 | 同输入 600 步快照逐字节一致 | `npm test`；golden snapshot |
| **v8c/v8d 攻击下半身权重** | **`gaitWeight=1` / `lowerBodyWeight=0` / `blendRate=14`；攻击稳定态 `attackBlend=1`、`driveSpeed=2.40`、`gaitScale=1`、腿俯仰峰值 >0.08 rad；两个权重都关时稳定态腿姿态精确为 0** | `view.animation.attack`；`diagnostics().attackWeights`；`tests/attack-lower-body.test.ts` |
| **v8d 挥击跨步** | **`strideSpeed=2.4` / `forwardBias=0.72` / `cycles=1` / `stepPitch=0.55` / `stepKnee=0.5`；`attackStridePose` 在 progress=0/1 恒为 0，连击奇偶领先腿左右互换，逐帧变化 <0.02 rad** | `view.animation.stride`；`tests/program-anim.test.ts` |
| **v8c 落地蓄力缓冲** | **时长 0.34s / 下压段 0.18 / 重心下沉 0.13m / 屈膝 0.62rad / 最小强度 0.45；结束后 `landing.pulse=0` 且姿态无残留** | `view.animation.landing`；`diagnostics().landing`；`tests/landing-buffer.test.ts` |
| **v8e 相机缩放** | **`min=0.45 / max=2.4 / smoothing=12 / pinchGain=1 / maxStepRatio=1.25 / wheelStep=1.12 / keyStep=1.12`；`setZoom(2)` 后相机到焦点距离精确 ×2（±0.0001）、`smart().zoom=2`；两指从 100px 张到 225px 再捏回，倍率精确回 1** | `view.zoom`；`diagnostics().camera.zoom`；`tests/pinch.test.ts` / `tests/input-pinch.test.ts` |
| **v8f 分层受击** | **`enabled=true / forceHitHeight=-1 / pulseRatio=0.16 / comShift=0.06 / lowerScale=0.45`；`comShift < upperShift` 且比值 <0.5（light / heavy / knock 全成立）；`hitHeight{light:0.2, heavy:0.6, knock:0.9}`；`abdomen.knee=0.9 > shoulder.knee=0.42`；躯干世界高度仍精确 `legLen+bodyH/2`；`upper.position.y` 恒 0** | `view.hurt`；`diagnostics().hurt`；`tests/hurt-pose.test.ts` / `tests/hurt-rig.test.ts` |
| **v8g 两骨 IK** | **`enabled=true / weight=0.9 / attackScale=0.65 / maxCorrectionDeg=70`；FK→IK 往返角度误差 <1e-5 rad（含 roll≠0 与膝/肘两种弯曲方向）；额外骨盆位移为 0 时 IK 解 = 原 FK 角度；受击钉地残差 `maxError < 0.02m`，关闭 IK 时偏差 >0.02m；空中 `active=false`；移动时髋角摆幅 ≥ 关闭时的 0.6 倍** | `view.ik`；`diagnostics().ik`；`tests/ik.test.ts` / `tests/ik-rig.test.ts` |
| **v8g 大剑 / 肘 / 惯性** | **`upperShiftScale=0.45 / maxUpperShift=0.1m`（knock 位移 ≤0.1m，A/B 关闭后 >0.2m）；`stepReach=0.12 / stepSideReach=0.09 / stepDipReach=0.035 / heavyScale=0.7`（大剑骨盆 z <0.13m）；全部肘角 <0 且局部前臂末端 z>0；`pelvisTiltGain=0.35 / pelvisShift=0.018 / moveCrouch=0.035`，盆骨倾角 < 上身的 0.6 倍、下沉 A/B 差值 ≈0.035m 且帧间跳变 <0.01m** | `view.hurt / view.animation.stride / view.lean`；`tests/v8g-poses.test.ts` |
| **v9a 派生招窗口 / 共享 CD** | `windows {roll 0.3 / blink 0.55 / sprint 0.5}s`、`sharedCooldown 0.85s`；一个窗口只触发一次，触发后 `dash.cooldown ≥ 0.85s − dt`，CD 内不能再翻滚 | `core.links.*`；`tests/links.test.ts`；HUD `link ...` |
| **v9a 索敌 / 冲锋 / 命中** | `travel = clamp(dist − stopDistance, 0, distance)` 起手快照后全程不变；active 位移收敛误差 <0.05m、不越 ±13.5；线段扫掠命中路径中点（一帧 3m 不漏），每目标只结算一次；不做背后索敌 / 背后命中 | `core.links / core.hits`；`tests/links.test.ts` |
| **v9a 对称机制** | `noDamageToPlayer=true` 时假人打玩家 `playerHurt.knockX/Z` 恒 0；关闭后 `|knockZ| = knockback × decay`（与假人同公式）；玩家与每个假人的 `LinkState` 结构完全一致、可 JSON 往返 | `core.hits`；`tests/links.test.ts` |
| 世界边界 | ±13.5，玩家与假人都不越界、无 NaN | `npm test` |

## D. 移植验收（P3：证明「核心真的可移植」）

1. `npm run verify:portable` 通过 → Core 在**无 DOM、无 WebGL、无 Vite** 的纯 Node 里跑完 600 步。
2. `scripts/check-boundary.mjs` 通过 → Core 目录（**20 个文件**，v9a 新增 `links.ts`）内不存在 `three` / `lil-gui` / DOM 全局 / `Math.random` / 外部时间源 / `class` / `enum` / 上层相对依赖。
3. 对照下方《Core 契约规格表》，在 Unity / Godot 里逐函数重写；把同一串 `Intents` 序列喂进去，比对状态哈希与 `tests/__snapshots__` 的黄金基线。
4. `config/game.json` 的 `core`（含 `orientation / combat / targeting / hits / separation / dash / dummies`）段可直接导成 ScriptableObject / Resource，数值 100% 复用。

---

## 分层与目录

```
src/core/           ★ 可移植资产：纯 TS、零依赖、状态可 JSON 序列化（20 个文件；v9a 新增 links.ts 派生招解算器）
  types.ts          全部数据契约（武器/战斗/目标/命中/受击/分离/冲刺/假人/朝向，语言无关友好）
  random.ts         种子随机 mulberry32，状态在 world.rngState
  scene.ts          场景白盒生成（唯一入口，日后换程序化生成只改这里）
  collision.ts      AABB 碰撞 / 支撑高度 / 推出解算
  combat.ts         武器切换 / 三连击(含 settle 停顿与自动连击) / 双施法 / 蓄力，写 world.impulse
  dash.ts           ★ 冲刺分化：翻滚写 impulse / 闪现逐段采样找安全落点 / 冷却与事件
  camera.ts         ★ 威胁权重 → 确定性构图意图（推进/拉远/平移/俯仰），纯数据
  targeting.ts      ★ 前方扇区软锁定、目标评分、动态前冲距离
  hits.ts           ★ 命中判定 / 三种受击状态 / 击退 / 受击计时衰减
  separation.ts     ★ 玩家与假人圆柱分离，只推假人
  dummies.ts        假人四种 AI + 点击轮转 + 挥砍命中事件 + 受击僵直
  movement.ts       移动、跳跃、冲刺、自动爬台阶、消费 impulse、动作期间锁定自主移动、闪现帧跳过水平积分
  orientation.ts    面朝向 / 身体 / 头 / 移动方向四角分离，wrapAngle 最短弧
  world.ts          创建 / 快照 / 恢复 / 克隆 / 全局复位
  step.ts           固定步长状态转移（reset 短路 → 10 个模块按固定顺序）
  pathfinding.ts    寻路契约 + 占位实现
src/adapters/       输入（隐形摇杆 / 按钮 / 键盘 / 轻点 tap / UI pointerId 隔离）、时间
src/presentation/   Three.js 渲染、体素角色（武器挂点 + 头/身/腿三段 + 惯性倾斜 + 受击动画 + 翻滚枢轴
                    + 攻击下半身权重过滤 + 跳跃/落地蓄力缓冲）、程序动画纯函数 program-anim.ts、
                    程序化步态 gait.ts、特效轴纯函数 fx-axis.ts、分层受击纯函数 hurt-pose.ts（共享骨盆骨架）、
                    两骨 IK 纯函数 ik.ts + 足部锚定 rig-ik.ts、惯性分层纯函数 inertia.ts、
                    假人模型/标签/射线拾取、
                    目标指示环、冲刺光环特效、智能相机（威胁构图平滑）、
                    HUD（横竖屏双版）、调试面板（默认收起）、diagnostics() 数值读数
src/app.ts          组装层（唯一同时认识 Core 与 Web 的地方）
config/game.json    全部数值、场景、视图配置（core.links = v9a 派生招表与窗口 / 索敌 / 共享 CD / Phase2-3 占位招；core.hits.noDamageToPlayer = 对称机制测试开关；view.animation = v8c/v8d 程序动画；view.zoom = v8e；view.hurt = v8f；view.ik / view.lean = v8g；view.links = v9a 特效与举盾姿态）
scripts/            可移植边界守卫
tests/              28 个文件 / 291 例：玩法 12 / 战斗 22 / 朝向 12 / 假人 13 / 确定性 4 / 可移植 5 /
                    目标 12 / 命中 12 / 分离 7 / 冲刺 15 / 相机 14 + 步频 4 / 步态姿态 9 /
                    下盘偏航 4 / 特效轴 2 / 拖拽朝向 6 / 体素回归 3 / 程序动画 16 / 攻击下半身 10 /
                    落地缓冲 5 / 捏合缩放 14 / 输入捏合集成 6 / 受击分层纯函数 11 / 受击分层集成 15 /
                    两骨 IK 纯函数 11 / 足部锚定集成 8 / 肘+惯性盆骨+大剑边界 11 /
                    派生招窗口·索敌·扫掠·对称·A/B·确定性 28
                    （tests/rig-nodes.ts 为按名查找骨架节点的共享 helper，非测试文件）
```

依赖方向严格单向：`presentation → adapters → core`。模块之间只靠 `world` 状态与**显式事件队列**通信，不互相调用。换 Web 引擎只重写 `presentation`；迁 Unity/Godot 时 `core` 是可执行的规格说明书。

`step` 的固定顺序：`targeting → combat → dash → movement → orientation → dummies → decayHurt → hits → separation → camera`（与假人相关的模块统一以 `modules.dummies` 为总闸，关闭后假人完全冻结）。

## Core 契约规格表（跨语言重写对照）

| 项 | 定义 |
|---|---|
| 状态容器 | `World { tick, time, rngState, config, boxes, gridMeta, character, combat, impulse, targeting, playerHurt, hitCount, dash, **camera**, dummies, dummyAttackCount, events, modules }` |
| 角色状态 | `position`（脚底中心）、`velocity`、`facing`（面朝向/目标）、`moveYaw`（移动方向）、`bodyYaw`（平滑身体）、`headYaw`（领先头部，相对身体限幅）、`grounded`、`sprinting`、`gaitPhase`、`distance`、`coyoteTime`、`jumpBuffer` |
| 战斗状态 | `CombatState { weapon, phase, comboIndex, phaseTimer, comboWindow, queued, charging, charge, castIndex, attackProgress, attackFacing, attackId, lastCharge, timings }`；`phase` 含 `settle` |
| 目标状态 | `TargetState { targetId, targetYaw, targetDist, hasTarget }` |
| 受击状态 | `HurtState { type: none/light/heavy/knock, timer, duration, dirX, dirZ }`；玩家在 `World.playerHurt`，假人在 `DummyState.hurt` |
| **冲刺状态** | **`DashState { kind: none/roll/blink, phase: idle/active, timer, duration, cooldown, dirX, dirZ, fromX, fromZ, toX, toZ, id }`；`id` 每次触发递增，表现层据此触发一次性特效** |
| **相机意图** | **`CameraIntent { distanceScale, offsetX, offsetZ, pitchDelta, threat, threatCount, centroidX, centroidZ }`；Core 纯空间评估、无时间累积，表现层做指数平滑** |
| 假人状态 | `DummyState { id, mode, initialMode, homeX, homeZ, position, velocity, facing, gaitPhase, distance, targetX, targetZ, wanderTimer, attackCooldown, attackPhase, attackPhaseTimer, attackProgress, attackId, hurt }` |
| 输入 | `Intents { moveX, moveZ, jumpPressed, sprintHeld, **sprintPressed**, resetPressed, attackPressed, attackHeld, attackReleased, skill2Pressed, weaponSlot, dummyClickId }`，世界空间；`dummyClickId` 由表现层射线拾取后填入 |
| 输出事件 | `landed / jumped / stepUp / blocked / reset / weapon-change / attack-start / attack-active / attack-end / combo-reset / cast / charge-start / charge-release / dummy-mode / dummy-attack / dummy-hit / hit / player-hurt / **roll / blink / dash-ready**`，显式队列数组 |
| 状态转移 | `step(world, dt, intents)`：清 `impulse` → `resetPressed` 短路全局复位 → `targeting` → `combat` → **`dash`** → `movement` → `orientation` → `dummies` → `decayHurt` → `hits` → `separation` → **`camera`**；只读参数、只写 world |
| 碰撞数据 | `Box[]`，每个 `{ id, kind, minX/maxX, minY/maxY, minZ/maxZ }`；玩家与假人共用 |
| 攻击时长 | `AttackTimings { windup, active, recovery, settle, lunge }`；`attackProgress` 只覆盖动作本体（不含 settle），settle 期间定格 1 |
| 朝向 | `wrapAngle(a) = atan2(sin a, cos a)`；`approach(current, target, rate, dt) = current + wrapAngle(target-current) × (1 - e^(-rate·dt))`；头部再 clamp 到 `bodyYaw ± maxHeadTurnDeg` |
| 配置键 | 移动类：`moveSpeed, sprintMultiplier, acceleration, friction, gravity, jumpSpeed, stepHeight, characterRadius, characterHeight, coyoteTime, jumpBufferTime, strideLength, fallTolerance, spawn, worldBounds`；朝向类：`orientation.*`；战斗类：`combat.comboWindow / settle / attackMoveScale / autoCombo / weapons.* / staff.* / bow.*`；目标类：`targeting.*`；命中类：`hits.*`；分离类：`separation.*`；**冲刺类：`dash.rollDistance / rollDuration / rollCooldown / blinkDistance / blinkStep / blinkCooldown / blinkClearVelocity`**；**相机类：`camera.radius / nearDistance / modeWeight / attackBoost / saturation / pushIn / maxPullback / maxOffset / maxPitchDelta / framingBias`**；假人类：`dummies.*` |
| 模块开关 | `movement / pathfinding / combat / orientation / targeting / hits / separation / dash / **camera** / dummies` |
| 随机 | `nextRandom(world)`，mulberry32，状态存在 `world.rngState`；分离的重合方向用黄金角生成，不用随机 |
| 不变量 | 位置恒为有限数；玩家与假人都越不了 `worldBounds`；落地 `velocity.y = 0`；`impulse` 每帧由 combat / dash 重设且只在 `active` 非零；`settle` 期间水平位移变化 = 0；攻击期间位移严格 = lunge（attackMoveScale=0）；**翻滚期间位移严格由 impulse 决定、方向键不叠加，总位移收敛到 rollDistance**；**闪现落点不穿墙 / 不越界，且 `toX/toZ` 与本帧最终位置一致**；`attackId` 与假人 `attackId` 单调递增（复位不归零）；**假人从不修改 `character`**；**玩家与假人、假人与假人之间不重叠（separation 开启时）**；**`camera` 意图为纯空间评估、无时间累积，可随 World 一起快照；关闭 `camera` 模块输出中性意图**；**命中只写 `HurtState` / `hitCount` / 假人位移，从不写血量** |

## 已知限制 / 下期扩展点

- **v7 全部 12 项需求已发布**（v7a / v7b / v7c 三批），另修复了一次「移动步频抽动」回归；当前无待发布的 v7 项。
- **v9e 冲刺段仍有拖步**：腿长 0.4m，7.35 m/s 冲刺一个周期要走 1.79m，几何上前伸需要 0.45m > 腿长，必然被可达半径钳制；表现为高速时脚轻微蹬地（约 20% 体速），常速与慢走为严格零滑步。要彻底消除只能提高冲刺步频（会变成碎步）或加长腿。
- **捏合需要「有意手势」**：两指相对移动 <18px 不缩放（换来的是按按钮 / 掌根蹭屏不再搅动镜头与摇杆）；想恢复「一碰就缩放」把 `PINCH_ARM_PX` 调 0。
- **技能实体视觉较朴素**：奥术飞弹 / 电环目前是池化的基础几何体（小球 / 贴地圆环），未做粒子、拖尾或屏幕后处理；要升级只需替换 `three-scene.ts` 里的 mesh，Core 的 `ProjectileState / ShockRingState` 已自带半径与剩余寿命。
- **技能无碰撞遮挡**：飞弹只与假人做圆形相交判定，不检测场景白盒 / 电环之间叠加；要扩展只需在 `abilities.ts` 里增加命中源。
- **浏览器渲染的环境差异**：**纯 headless** Chromium 在这个沙箱里拿不到 WebGL 上下文（`THREE.WebGLRenderer: A WebGL context could not be created`），但 `xvfb-run -a` + **headful** Chromium（`--use-angle=gl --ignore-gpu-blocklist`）实测 WebGL 2.0 可用，v8g 已用它完成 4 个场景截图 + HUD 读数验收（见 `preview-v8g-zoom-*.png`），v9a 用它实测「翻滚 → 窗口 0.27s → 按 J → `link shield-charge active`」与法杖引导不受抢（见 `preview-v9a-*.png`）。自动验收靠 **315 个用例** + 构建 + 可移植契约，观感仍需真机确认：v8 的侧移 / 后退脚步、v8b 的引导飞弹下盘连续性、v8d 的攻击两条下盘路径（等效步态 vs 挥击跨步）、v8c 的跳跃落地缓冲、v8e 的双指捏合方向与进出时摇杆衔接、v8f 的受击分层观感（上半身倾斜 / 屈膝深浅 / 屁股后坐 / 打肩 vs 打腹），以及 **v8g 的 IK 钉地力度是否过硬、大剑重击跨步是否够味、肘朝向、盆骨惯性与移动下沉幅度**。**v9a 尤其需要真机确认**：三种窗口时长是否够用（长跑 / 闪现更容易接上）、冲锋距离 3.4m 与 `stopDistance 1.25m` 是否合手感、盾击举盾前撞幅度与蓝色光环是否合眼缘、共享 CD 0.85s 是否过长；调试面板「派生招 (v9a)」可逐项热调并一键关掉对照旧连击。可用调试面板「程序化步态」「朝向参数」「程序动画 (v8c/v8d)」「相机缩放 (v8e)」「受击分层 (v8f)」「足部 IK (v8g)」「惯性倾斜 / 盆骨 (v8g)」「派生招 (v9a)」分组热调，或在控制台读 `diagnostics().gait / attackWeights / attackBlend / landing / camera.zoom / hurt / ik / link`。
- **智能相机的威胁源只有假人**：当前按 `dummies` 的位置 / 行为模式 / 挥砍状态评估，未接入场景障碍、投射物或未来的伤害系统；要扩展只需在 `cameraUpdate` 里增加威胁源。
- **构图平滑留在表现层**：Core 只输出确定性目标值，平滑状态不进 `World`（与 `lean` 一致），因此跨语言比对以 `World.camera` 为准，而非屏幕上的瞬时镜头。
- **翻滚方向未分化**：前滚动画固定绕身体局部 X 轴一圈，方向取移动输入 / 面朝向；暂未做侧滚、方向自适应翻滚姿态。
- **闪现只做水平落点保护**：逐段采样只检查 XZ 重叠，`y` 不变，因此不会主动闪上台阶或避开高低差。
- **无伤害与血量系统**：`attack-active` / `hit` / `player-hurt` 事件与三种受击动画已就位，可直接接伤害盒。
- **玩家是不可推动的锚点**：分离只推假人，因此玩家能「挤开」人群而不是被挡住；这是为保持「假人不修改 character」与「击退作用于敌人」的有意取舍。若需要玩家也被挡，把 `separation` 的玩家权重做成配置即可。
- **墙角极端挤压**：分离后再推出白盒，若假人被夹在墙与玩家之间可能出现极小残留重叠；开阔地与常规走位不重叠。
- **目标辅助只锁前方扇区**：背后敌人不会强制扭头；`maxAngleDeg` 可热调（上限 180°）。
- **复位后 AI 立即继续运行**：复位当帧不推进模块、速度归零，之后从静止重新起步。
- **寻路未实现**：契约、网格元数据、模块开关已就位。
- **场景是手工描述**：`buildBoxes()` 是唯一生成入口。
- 调试面板改 `characterHeight` 只影响碰撞，体素外观尺寸固定（来自 `view.voxel`）。
- `attackMoveScale` 默认 0（攻击锁移动），调到 >0 时攻击期间为匀速无惯性移动。
- 尚未做移动端性能压测与 WebGL 兼容性兜底；本期定位是桌面/手机浏览器里的玩法实验台。
