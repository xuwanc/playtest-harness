# ADR-003 · 特效层级用单调编号，不用关深度测试

- 状态：已采纳（v9s.38）
- 影响范围：`src/presentation/fx-layer.ts`、`src/presentation/three-scene.ts`、`src/core/collision.ts`

## 背景

用户反馈「特效在某些地块上看不见」。定位到两个独立根因：

1. 白盒地块是 `transparent: true`（哪怕 `opacity: 1`），进入透明列表后按「`renderOrder` → 到相机距离**由远到近**」排序；32m 地面盒的排序距离取包围球中心，角色站场边时地面会被排到刀光之后绘制，整片盖掉。
2. 贴地特效 `y` 写死，站上 0.2~1.2m 台阶时环埋进方块内部。

## 决策

- **地块走不透明通道**（`transparent: false, opacity: 1`）。只有在开「碰撞盒线框」调试时才临时切回透明，并同时改 `depthWrite` + `needsUpdate`（`transparent` 是编译期属性，不标脏会静默无效）。
- **特效 `renderOrder` 收口成一条带间隙的单调序列**，定义在 `fx-layer.ts` 的 `FX_ORDER`：贴地 10~39、身体 40+，光晕永远比本体先画（号更小）。
- **禁止再写裸数字**：只能写 `FX_ORDER.xxx`；要「高一点点」写 `FX_ORDER.xxx + 1`。
- **贴地高度查真实地形**：`core/collision.ts: groundHeightAt(boxes, x, z, refY, fallback, tol)`，从 `refY + 0.55` 往下找最高可站表面，墙（`maxY > refY + tol`）排除。表现层包成 `groundFxY()`。
- **不采用 `depthTest: false`**：那会把特效画到墙后面（站在门洞一侧能看到墙另一侧的刀光）。排序问题用排序解决，不是关掉遮挡。

## 后果

- 可测契约：`__harness.fxDebug()` 返回 `{ boxOpaque, boxCount, orders }`，`npm run smoke` 断言 `boxOpaque === true` 且 `ring < groundFx < trail < slash < projectile`。
- 新增贴地特效时，忘记用 `groundFxY()` 会「在某些台阶上看不见」—— 这是本 ADR 之后唯一的高频复发点，见 `docs/systems/presentation-fx.md` §1.4。
- `FX_ORDER` 只是约定，`renderOrder` 仍可被直接赋值；后续可加一条 grep 规则进 verify（见 `docs/state/CURRENT.md` 下一步）。
