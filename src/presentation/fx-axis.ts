/**
 * 特效弧（斩击圆环）中心轴 —— 纯数学、零依赖，方便单元测试直接断言「轴朝哪」。
 *
 * 契约（v7c #10）：圆环盘面法线（中心轴）恒为角色局部 +Z，即「角色正前方、水平」。
 * 相机俯仰只影响「怎么拍」，不影响特效轴朝向。v6a 曾为配合 2.5D 俯视把轴绕 X
 * 拧了 -pitchDeg，结果轴变成斜前上方、特效不再朝正前方，这里把该倾斜归零。
 *
 * 本文件不放进 core/：轴是「表现层几何约定」，但它被抽成纯函数，
 * 使 three-scene 的倾斜量与单元测试共享同一份定义，改一处即两处同步。
 */

export type Axis3 = { x: number; y: number; z: number };

/** 特效弧中心轴在角色局部空间：恒为 +Z（水平、正前方），与相机俯仰无关。 */
export function slashAxisLocal(cameraPitchDeg: number): Axis3 {
  void cameraPitchDeg; // 相机俯仰不参与轴方向
  return { x: 0, y: 0, z: 1 };
}

/**
 * 表现层据此设置圆环节点绕 X 的倾斜弧度。
 * 轴为纯 +Z 时倾斜恒为 0；与 slashAxisLocal 的 y 分量保持一致（y=0 ⇒ asin(0)=0）。
 */
export function slashTiltX(cameraPitchDeg: number): number {
  return Math.asin(slashAxisLocal(cameraPitchDeg).y);
}

/** 把局部轴绕世界 Y 旋转 yaw，得到世界方向（与 fxAnchor.rotation.y 一致）。 */
export function rotateAxisY(axis: Axis3, yaw: number): Axis3 {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return {
    x: axis.x * c + axis.z * s,
    y: axis.y,
    z: -axis.x * s + axis.z * c,
  };
}
