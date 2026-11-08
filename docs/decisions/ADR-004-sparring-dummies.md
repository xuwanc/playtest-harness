# ADR-004 · 陪练是「带武器的假人」，不是第二套实体

- 状态：已采纳（v9s.38）
- 影响范围：`src/core/dummies.ts`、`src/core/hits.ts`、`src/presentation/fighter-rig.ts`、`config/game.json`

## 背景

需求：三个和主角同模型 / 同武器 / 同挥击的 AI（剑盾、双刀、大剑），攻击欲望放低，点击后能和假人一样在「到处走 / 保持距离 / 待机 / 攻击」之间轮转。

可选方案：

1. 新建 `FighterState` + 新的 AI 模块 + 新的渲染层；
2. 给现有 `DummyState` 加两个字段（`weapon`、`combat`），复用整条假人管线。

## 决策

选 2。凡是假人已有的机制 —— 点击轮转、脚下威胁环、受击击退、渲染插值、分离、牵引半径、复位 —— 全部复用，只补两样：手里的武器、表现层的挥击姿势。

关键胶水：`syncFighterCombat()` 每帧把假人的三段状态机（`attackPhase / attackTimer / attackProgress`）抄成一份 `CombatState`；`voxel-rig` 只认 `CombatState`，不关心是谁写的。于是「同模型、同挂点、同挥击剪辑」是**结构上保证**的，不是靠对齐参数。

## 后果

- 加第四个陪练只需改 `config/game.json` 两处（`core.dummies.fighters` + `view.dummies.fighterColors`），不改代码。
- **派生代价**：`createDummies` 数量变了，所有「假人数量 / id / 坐标」的旧用例会挂。处理方式是 `tests/helpers.ts` 冻结夹具写 `fighters: undefined`，单测不吃线上关卡坐标。
- **能力缺口**：陪练没有卡肉、没有连击（假人状态机只有单段三阶段）。要做必须给 `DummyState` 加连段字段 —— 见 `docs/state/CURRENT.md`。
- **测试陷阱**：不能 `w.dummies = [s]` 隔离单个陪练（`dummy-hit` 用 `id - 1` 取下标），要用 `isolate(w, keep)` 把其他单位挪走。
