# 特效：渲染层级与贴地高度

> 最后更新：2026-11-08（v9s.38）。代码：`src/presentation/fx-layer.ts`（层级唯一来源）、`core/collision.ts`（`groundHeightAt`）、`three-scene.ts`（消费方）。
> 回答两个问题：**为什么特效会被地块盖掉**，以及**贴地特效该放在多高**。
> 这两件事是同一个用户反馈（「特效的渲染层级有问题，某些地块上看不见」）的两个独立根因，
> 必须分别修，调数值不能解决任何一个。

---

## 1. 为什么会被地块盖掉

### 1.1 根因：`transparent: true` 把整块地面推进了透明列表

白盒地块原来是 `transparent: true, opacity: 1`。这看起来「和不透明一样」，实际上完全不同：

| | 不透明通道 | 透明通道 |
|---|---|---|
| 排序依据 | `renderOrder`，同序按**由近到远**（有深度测试，画错顺序也不会盖） | `renderOrder`，同序按**由远到近**（后画的覆盖先画的，**不做遮挡判断**） |
| `depthWrite` | 默认开 | 默认关（本项目的贴地特效） |

Three.js 在所有不透明物体画完之后才画透明物体。地块一旦进透明列表，就变成
「和刀光抢先后顺序」的普通一员，而**它的排序距离取包围球中心**：

- 地面是一个 32m 的大盒，中心在场地的几何中心；
- 角色站到场边、相机在另一侧时，**地面中心可能比角色更靠近相机**；
- 于是地面被排到刀光 / 斩击弧**之后**绘制，`opacity = 1` 直接把它们整片盖掉。

这解释了用户的原话「**某些**地块上看不见」—— 取决于角色相对场地中心与相机的方位。
在场中央测试永远复现不出来。

### 1.2 修法：地块走不透明，只有线框调试时才透明

`three-scene.ts` → `setCollidersVisible`：

```ts
// three-scene.ts → setCollidersVisible(v)
for (const m of materials) {
  m.opacity = v ? 0.3 : 1;
  m.wireframe = v;
  // 不透明 ↔ 透明必须一起改，否则线框模式看不见墙后的东西；
  // transparent 变化需要重编译着色器（needsUpdate），只在切换时发生一次。
  m.transparent = v;
  m.depthWrite = !v;
  m.needsUpdate = true;
}
```

要点：`transparent` 是**材质编译期**的属性，改了不 `needsUpdate` 会静默无效
（表现为「开关线框之后地块变透明了，关掉却还是透明」）。

可测契约：`__harness.fxDebug().boxOpaque === true && boxCount > 0`，
已进 `npm run smoke`（「地块走不透明通道（透明地面会盖掉刀光）」）。

### 1.3 根因二：特效之间的 `renderOrder` 是各写各的

修完地块之后还有第二个问题：贴地特效之间的先后**基本靠运气**。

旧值（散落在 `three-scene.ts` 各处的魔数）：贴地冲击 `0`、范围圈 `2/3`、假人环 `5`、
玩家环 `6`、刀光 `6`、进度弧 `8`、预警弧 `9`。

- 相同 `renderOrder` 时只剩**距离排序**，而贴地环全在 `y ≈ 0.03` —— 距离几乎相等，
  谁压谁由浮点误差和相机角度决定；
- 刀光（身体高度）和玩家环（贴地）同一个号，换个俯角就换一种压法。

修法：建 `src/presentation/fx-layer.ts`，把层级做成**一条带间隙的单调序列**，
编号大的后画（压在编号小的上面），同层内部再靠距离排序。

```ts
export const FX_ORDER = {
  // —— 贴地层 10~39 ——
  labPlate: 10,          // 工位地面盘（最底）
  groundArea: 12,        // 范围圈填充（电环 / 冲锋落点）
  groundAreaEdge: 13,    // 范围圈边界
  ringHalo: 20,          // 选中光晕（比主环更宽更淡，先画）
  ring: 22,              // 脚下主环
  ringMeter: 24,         // 进度弧（环外侧）
  ringWarn: 26,          // 起手预警弧（"马上要打你"优先级最高）
  groundFx: 30,          // 一次性贴地冲击（击地尘环 / 冲刺光环 / 派生招光环）
  // —— 身体层 40+ ——
  trail: 40,             // 挥击刀光
  slash: 44,             // 斩击弧及其光晕（+1）
  projectileTrail: 46,   // 弹道拖尾
  projectile: 48,        // 弹道本体
  projectileGlow: 50,    // 弹道光晕（Sprite，最后画）
} as const;
```

### 1.4 加新特效时的规则（照做就不会再出这类问题）

1. **不许再写裸数字**。只能写 `FX_ORDER.xxx`；确实需要「比某层高一点点」时写 `FX_ORDER.xxx + 1`。
2. **先判断它属于哪一层**：
   - 贴在地面（环、圈、尘、印）→ 10~39，并且高度必须用 `groundFxY()`（见 §2）；
   - 在身体高度（刀光、斩击弧、弹道、火花）→ 40+。
3. **同一件东西的「光晕」永远画在本体之前**（号更小），否则光晕会糊住本体。
4. **不透明的东西不进这个表**（角色、场景、地块）。它们靠深度测试，不参与排序。
5. 加完跑 `npm run smoke`：`fxDebug().orders` 断言 `ring < groundFx < trail < slash < projectile`
   这条单调链。

### 1.5 为什么「特效都设 `depthTest: false`」不是答案

这是个常见偏方，但它会把特效画到**墙后面**去：站在门洞一侧能看到墙另一侧的刀光。
排序问题应该用**排序**解决，不是关掉遮挡。当前方案里刀光 / 斩击弧保留 `depthTest`，
只是靠「地块不透明 + 单调 renderOrder」把顺序钉死。

---

## 2. 贴地特效的高度：必须查真实地形

### 2.1 问题

贴地特效原来写死 `y = 0.03`（或 `角色 y + 0.03`）。站在 1.2m 方块顶上时：

- `y = 0.03` → 环在方块**内部**，被方块盖住（这是「看不见」的第二个来源）；
- `y = 角色 y + 0.03` → 环浮在方块顶面上方，但在**跳起 / 从台阶边缘释放**时会飘在空中。

### 2.2 修法：`groundHeightAt()`

`src/core/collision.ts`：

```ts
/**
 * 返回该 XZ 上「从 refY 往下看的最高实体表面」。
 * maxY > refY + tol 的盒子（墙 / 过梁）忽略 —— 它们不是可以站的地面。
 */
export function groundHeightAt(
  boxes: Box[], x: number, z: number,
  refY: number, fallback = 0, tol = 0.05,
): number
```

表现层包装成 `three-scene.ts` 的 `groundFxY(x, z, fromY)`：

```ts
const groundFxY = (x: number, z: number, fromY: number) =>
  groundHeightAt(boxes, x, z, fromY + 0.55, 0);
```

`fromY + 0.55` 是**查询基准**：从角色脚底往上抬 0.55m 再往下找表面。
这样站在 0.2 / 0.6 / 0.9 / 1.2m 台阶或高台上，环会落在**顶面**而不是埋进去；
墙（`maxY` 高于基准）被 `tol` 挡在查询之外，不会把环顶到墙头。

用它的地方（全部在 `three-scene.ts`）：落点预览圈、电环范围、冲刺环、派生招光环、击地尘环。

### 2.3 为什么放在 Core 而不是表现层

因为它是**空间查询**，与渲染无关：将来 Core 要做「落点是否可站立」「AoE 是否跨层」，
用的就是同一个函数。表现层只是**消费**它，不拥有地形知识（`boxes` 来自 `world.scene`）。

### 2.4 已知边界

- 只处理**轴对齐盒子**，斜屋面 / 曲面不支持（当前关卡没有）。
- 只看「查询点正上方」，不做半径内的最高点采样：环跨过台阶边缘时会**一半埋进去**。
  这是刻意的 —— 按中心点取高度，环面是平的；要贴合边缘得给环做顶点级采样，
  代价远高于收益（当前关卡里所有高台都够大）。
- 跳跃时如果脚下没有地面（悬空），`fallback = 0` 会落回地面高度 —— 贴地环本来就该在地上。

---

## 3. 验收

| 项 | 方法 | 期望 |
|---|---|---|
| 地块不透明 | `__harness.fxDebug()` | `boxOpaque: true, boxCount > 0` |
| 层级单调 | `fxDebug().orders` | `ring(22) < groundFx(30) < trail(40) < slash(44) < projectile(48)` |
| 高台上的环不埋 | 截图 `../../shots/v9s38/02-fx-on-block.png`、`10-swing-on-block.png` | 尘环压在 1.2m 方块顶面 |
| 平地对照 | 截图 `../../shots/v9s38/03-fx-on-ground.png` | 同一套特效高度一致 |
| 自检进 CI | `npm run smoke` | 16/16 PASS，含上述两条 |

单测：`tests/v9s38-fx-layer.test.ts`（5 例）—— `groundHeightAt` 三例（阶梯 / 墙被忽略 / 无盒回落）
+ `FX_ORDER` 单调、贴地层低于身体层两例。
