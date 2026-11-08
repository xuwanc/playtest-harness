# 架构总览与目录

> 最后更新：2026-11-08（v9s.38）。
> 管什么：分层与依赖方向、目录职责、`step()` 的固定顺序、哪些文件改了要一起看。
> 一句话判据：**Core 不认识 Web；表现层不认识游戏规则。**

## 分层与目录

```
src/core/           ★ 可移植资产：纯 TS、零依赖、状态可 JSON 序列化（25 个文件，含 v9a 的 links.ts 派生招解算器与 v9s 的 gaze / turn-in-place / notify / pose-clip）
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
config/game.json    全部数值、场景、视图配置（core.links = v9a 派生招表与窗口 / 索敌 / 共享 CD / Phase2-3 占位招；core.hits.noDamageToPlayer = 对称机制测试开关；view.animation = v8c/v8d 程序动画 + v9s.23 挥击剪辑 + v9s.32 分武器持械姿态 + v9s.33 脊柱分段 / 攻击期移动接管；view.balance = v9s.33 平衡判定与骨盆侧移修正；core.hits.hitstopByWeapon = v9s.33 卡肉武器系数；view.zoom = v8e；view.hurt = v8f；view.ik / view.lean = v8g；view.links = v9a 特效与举盾姿态）
scripts/            可移植边界守卫
tests/              88 个文件 / 876 例：Core 玩法与契约（玩法 / 战斗 / 朝向 / 假人 / 确定性 /
                    可移植 / 目标 / 命中 / 分离 / 挤压阻力 / 冲刺 / 相机 / 派生招）、程序化步态与骨架
                    （步频 / 步态姿态 / 下盘偏航 / 停步收相 / 停步惯性 / 胸朝向与低速滑行 /
                    攻击步幅与相位 / 程序动画 / 攻击下半身 / 落地缓冲 / 受击分层 / 两骨 IK / 足部锚定）、
                    输入与诊断（捏合缩放 / 输入捏合集成 / 输入瞄准 / 屏幕坐标 / 手势 /
                    遥测 / 方向调试盘 / 特效轴）、v9q 默认参数 / 惯性方向 / 脚锚定 / 击退步态 /
                    速度采样；v9r 新增实际位移速度采样 / 衔接标记 / 骨盆下沉与脚锚定 / 默认参数等；
                    v9s.33 新增脊柱分段（总角守恒）/ 平衡量化（纯函数 + 骨架 A/B）/ 收势接管（落地 + 行程）/
                    卡肉分层（武器系数 × 受击类型）四组
                    （tests/rig-nodes.ts / tests/mech-gait.ts 为共享 helper，非测试文件）
```

依赖方向严格单向：`presentation → adapters → core`。模块之间只靠 `world` 状态与**显式事件队列**通信，不互相调用。换 Web 引擎只重写 `presentation`；迁 Unity/Godot 时 `core` 是可执行的规格说明书。

`step` 的固定顺序：`targeting → combat → dash → movement → orientation → dummies → decayHurt → hits → separation（含 v9p 挤压阻力）→ camera`（与假人相关的模块统一以 `modules.dummies` 为总闸，关闭后假人完全冻结）。
