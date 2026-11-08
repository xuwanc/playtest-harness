import type * as THREE from 'three';

/**
 * v9s.38 · 特效层叠顺序的**唯一来源**。
 *
 * 问题（用户反馈「特效的渲染层级有问题，某些地块上看不见」）有两个根因：
 *
 * 1. **白盒地块是透明材质**（`transparent: true, opacity: 1`）。Three.js 会把所有
 *    透明物体放进同一个列表，按 `renderOrder` → 到相机距离**由远到近**排序。整块地面是
 *    一个 32m 的大盒，它的排序距离取包围球中心；当角色站到场边、相机又在另一侧时，
 *    地面中心可能比角色更靠近相机 —— 于是地面被排到刀光 / 斩击弧**之后**绘制，
 *    `opacity = 1` 直接把它们整片盖掉。这解释了为什么「只有某些地块上看不见」：
 *    取决于角色相对场地中心与相机的方位。修法是把地块改成不透明（见 three-scene
 *    `setCollidersVisible`：只有开线框调试时才临时切回透明）。
 *
 * 2. **特效之间的 renderOrder 是各写各的**（贴地冲击 0、范围圈 2/3、假人环 5、
 *    玩家环 6、刀光 6、进度弧 8、预警弧 9）。相同 renderOrder 时只剩距离排序，
 *    而贴地环都在 y≈0.03 —— 互相之间谁压谁基本靠运气。这里改成一条**带间隙的
 *    单调序列**：编号大的后画（压在编号小的上面），同一层内部再靠距离排序。
 *
 * 约定：贴地的东西在 10~39，身体高度上的东西在 40+；不透明的角色 / 场景不参与排序。
 */
export const FX_ORDER = {
  /** 工位地面盘（最底，任何贴地特效都应压住它） */
  labPlate: 10,
  /** 范围圈填充（电环 / 冲锋落点） */
  groundArea: 12,
  /** 范围圈边界 */
  groundAreaEdge: 13,
  /** 选中光晕（比主环更宽更淡，先画） */
  ringHalo: 20,
  /** 脚下主环 */
  ring: 22,
  /** 进度弧（环外侧） */
  ringMeter: 24,
  /** 起手预警弧（要压住主环，因为「马上要打你」优先级最高） */
  ringWarn: 26,
  /** 一次性贴地冲击（击地尘环 / 冲刺光环 / 派生招光环） */
  groundFx: 30,
  /** 挥击刀光（身体高度，画在贴地特效之上） */
  trail: 40,
  /** 斩击弧及其光晕 */
  slash: 44,
  /** 弹道拖尾 */
  projectileTrail: 46,
  /** 弹道本体 */
  projectile: 48,
  /** 弹道光晕（恒面向镜头的 Sprite，最后画） */
  projectileGlow: 50,
} as const;

/** 把一棵子树里所有 Mesh / Sprite / Line 的 renderOrder 统一到某一层（含自身）。 */
export function setFxOrder(obj: THREE.Object3D, order: number): void {
  obj.renderOrder = order;
  obj.traverse((o) => { o.renderOrder = order; });
}
