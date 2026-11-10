import * as THREE from 'three';

/**
 * v9s.66 · 模型空间旋转。
 *
 * 问题：骨架里所有补偿都写成「局部欧拉角」，例如 `arm.root.rotation.x -= back`。
 * 这条式子只在**父节点没有偏航 / 侧倾**时才等于「把手臂在角色正面往回压」。
 * 一旦胸段被 `chestYaw` 转过 20°、骨盆又侧倾 8°，局部 X 轴已经不指向角色的左右，
 * 同一个 `-= back` 就变成「斜着往上掰」—— 鱼人那种扁宽躯干上读起来特别怪。
 *
 * 做法：把「想让它绕模型轴转多少」翻译成局部四元数增量：
 *
 *     q_node' = q_parentInModel⁻¹ · R · q_parentInModel · q_node
 *
 * 其中 `R` 是模型空间（骨架根节点局部）里的一次旋转。父节点没转时它精确退化成
 * `q_node' = R · q_node`，也就是旧的局部写法 —— 所以默认体型逐字节不变。
 *
 * 只改四元数、不改 `rotation.order`：THREE 的 Euler 会在下次读 `rotation` 时同步，
 * 后续仍可以继续用 `rotation.x += …` 叠加（本项目大量代码依赖这一点）。
 */

/** 模型空间的三个基轴（复用，避免每帧 new） */
export const AXIS_X = /* @__PURE__ */ new THREE.Vector3(1, 0, 0);
export const AXIS_Y = /* @__PURE__ */ new THREE.Vector3(0, 1, 0);
export const AXIS_Z = /* @__PURE__ */ new THREE.Vector3(0, 0, 1);

/**
 * 节点在**模型空间**的朝向（root 局部，不含 root 自己的朝向 / 位移）。
 *
 * 只乘四元数、不碰世界矩阵 —— 可以在写完某根骨头之后立刻调用，不需要
 * `updateWorldMatrix`，也不会把「上一帧的矩阵」算进来。`root` 不是祖先时
 * 一路乘到 null 为止（返回的仍是「相对最顶层祖先」的朝向）。
 */
export function quatInModel(node: THREE.Object3D, root: THREE.Object3D): THREE.Quaternion {
  const out = new THREE.Quaternion();
  let n: THREE.Object3D | null = node;
  while (n && n !== root) {
    out.premultiply(n.quaternion);
    n = n.parent;
  }
  return out;
}

/** 父节点在模型空间的朝向；父节点就是 root（或没有父）时返回单位四元数。 */
export function quatParentInModel(node: THREE.Object3D, root: THREE.Object3D): THREE.Quaternion {
  return node.parent ? quatInModel(node.parent, root) : new THREE.Quaternion();
}

/**
 * 把节点绕**模型空间**的 `axis` 转 `angle`（rad），并写回局部四元数。
 *
 * 父节点没有旋转时与 `node.rotation.<轴> += angle` 等价（这是既有调校不变的前提）。
 */
export function rotateInModelSpace(
  node: THREE.Object3D,
  root: THREE.Object3D,
  axis: THREE.Vector3,
  angle: number,
): void {
  if (!angle) return;
  const qp = quatParentInModel(node, root);
  const delta = new THREE.Quaternion().setFromAxisAngle(axis, angle);
  // q_node' = qp⁻¹ · R · qp · q_node
  node.quaternion.premultiply(qp.clone().invert().multiply(delta).multiply(qp));
}

/** `rotateInModelSpace` 的常用简写：绕模型 X 轴俯仰（+ = 按右手定则） */
export function pitchInModelSpace(
  node: THREE.Object3D, root: THREE.Object3D, angle: number,
): void {
  rotateInModelSpace(node, root, AXIS_X, angle);
}

/** 绕模型 Y 轴偏航（+ = 从上往下看逆时针） */
export function yawInModelSpace(
  node: THREE.Object3D, root: THREE.Object3D, angle: number,
): void {
  rotateInModelSpace(node, root, AXIS_Y, angle);
}

/**
 * 绕模型 Z 轴滚转（+ = 向角色左侧倒，与 `rotation.z` 正方向一致）。
 *
 * 补齐 X / Y / Z 三轴的对称 API。**惯性侧倾（lean）现在没用它**：`upper` 的父节点
 * 是 `pelvis`，而髋的偏航在兄弟节点 `lower` 上 —— 父链几乎不转，局部欧拉与模型空间
 * 逐位等价；反过来用它会破坏 `distributeYaw` 把 `rotation.y` 当「纯偏航」读的约定
 * （复合四元数分解出的 y 会带串扰）。留给将来真有「父链大角度旋转下要侧倾」的层。
 */
export function rollInModelSpace(
  node: THREE.Object3D, root: THREE.Object3D, angle: number,
): void {
  rotateInModelSpace(node, root, AXIS_Z, angle);
}

/**
 * 把节点的模型空间朝向锁到 `target`（`quatInModel` 的读数），按 `weight` 混入。
 *
 * 用途：足部 IK。两骨 IK 改的是髋 / 膝角，脚掌挂在踝上会跟着被拧 ——
 * 这条式子让「脚踝以下的朝向」保持 IK 之前的样子（`weight` 与 IK 权重同源，
 * 权重 0.5 时脚掌只被拧一半，不会在 IK 淡出过程中跳一下）。
 */
export function lockModelRotation(
  node: THREE.Object3D,
  root: THREE.Object3D,
  target: THREE.Quaternion,
  weight: number,
): void {
  const w = Math.max(0, Math.min(1, weight));
  if (w <= 0) return;
  const local = quatParentInModel(node, root).invert().multiply(target);
  if (w >= 1) {
    node.quaternion.copy(local);
    return;
  }
  node.quaternion.slerp(local, w);
}
