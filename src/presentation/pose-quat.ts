import * as THREE from 'three';

/**
 * v9s.73 · 姿势增量（additive）—— 用四元数而不是「逐轴欧拉相加」。
 *
 * 问题：v9s.29 起的战斗姿态交叉淡出是**逐轴线性插值**（`mix(b.upperX, upper.rotation.x, w)`）。
 * 它便宜，但三处不成立：
 *   1. 两个姿态差 150° 时，逐轴 lerp 的中间帧不是「沿最短弧转过去」，而是走一条歪路
 *      （欧拉三元组各自直着走，合成出来既不保角速度、也不保朝向单调）；
 *   2. 大角度 + 多轴同转时会出现「先绕开再回来」的抖动（gimbal 附近的经典症状）；
 *   3. 它把「攻击姿势」当绝对量、靠权重去稀释，无法表达「这一层相对某个基准的偏转」。
 *
 * 做法：把姿势拆成「逐节点的局部四元数」，层与层之间做**增量**：
 *
 * ```text
 * delta_i = ref_i⁻¹ ⊗ pose_i                  // 相对基准的局部偏转（左乘：pose = delta ⊗ ref）
 * q_i     = base_i ⊗ slerp(identity, delta_i, w)
 * ```
 *
 * 三条性质：
 *   - `w = 1` 且 `base = ref` 时 `q = pose`（逐位回到「绝对姿态」的旧语义）；
 *   - `w = 0` 时 `q = base`（不写任何东西）；
 *   - `ref` 与 `base` 分离之后，基准换成「中立站姿」就能让**个性体态保留下来**
 *     （鱼人 60° 前倾时挥剑，动作叠在 60° 上，而不是被压回 0°）。
 *
 * 与 ozz-animation 的 additive 一致（`delta = reference⁻¹ · pose`，
 * 应用时 `base · nlerp(I, delta, w)`）；差别只在这里用 `slerp`（角速度更均匀，
 * 这点开销在每帧 7 个节点上无所谓），且**不碰 position** —— 位移没有四元数语义，
 * 仍走各自通道（见 `pose-layers.md` §7 第 1 条）。
 */

/** 姿势快照：`nodes` 顺序固定，`q` 每节点 4 个分量（xyzw 交错）。 */
export type PoseQuat = {
  nodes: THREE.Object3D[];
  q: Float32Array;
};

/** 复用临时量，避免每帧 new（3 个角色 × 60fps × 7 节点）。 */
const _qb = new THREE.Quaternion();
const _qd = new THREE.Quaternion();
const _qi = new THREE.Quaternion();
const _qr = new THREE.Quaternion();
const _qp = new THREE.Quaternion();
const _qe = new THREE.Euler();

export function createPoseQuat(nodes: THREE.Object3D[]): PoseQuat {
  const q = new Float32Array(nodes.length * 4);
  // 初值必须是单位四元数（全 0 不是合法旋转，`slerp` / `invert` 会直接失真）
  for (let i = 0; i < nodes.length; i++) q[i * 4 + 3] = 1;
  return { nodes, q };
}

/** 抓取当前局部四元数。传 `out` 可复用缓冲区（每帧调用时应当传）。 */
export function capturePoseQuat(nodes: THREE.Object3D[], out?: PoseQuat): PoseQuat {
  const pose = out && out.nodes === nodes ? out : createPoseQuat(nodes);
  const q = pose.q;
  for (let i = 0; i < nodes.length; i++) {
    const o = i * 4;
    const nq = nodes[i].quaternion;
    q[o] = nq.x;
    q[o + 1] = nq.y;
    q[o + 2] = nq.z;
    q[o + 3] = nq.w;
  }
  return pose;
}

/** 把快照写回骨骼（调试 / A-B 对照用；正常运行走 `composePoseQuat`）。 */
export function writePoseQuat(pose: PoseQuat): void {
  const { nodes, q } = pose;
  for (let i = 0; i < nodes.length; i++) {
    const o = i * 4;
    nodes[i].quaternion.set(q[o], q[o + 1], q[o + 2], q[o + 3]);
  }
}

/**
 * 把第 `i` 个节点的欧拉三元组写进快照。
 *
 * 必须用节点自己的 `rotation.order` 合成 —— 攻击姿势是用 `rotation.x = …` 一位一位
 * 写的，合成顺序就是这个 order；用默认 XYZ 会在 `ZYX` 节点上算出另一个朝向。
 */
export function setPoseNodeEuler(pose: PoseQuat, i: number, x: number, y: number, z: number): void {
  const node = pose.nodes[i];
  _qe.set(x, y, z, node.rotation.order);
  _qb.setFromEuler(_qe);
  const o = i * 4;
  pose.q[o] = _qb.x;
  pose.q[o + 1] = _qb.y;
  pose.q[o + 2] = _qb.z;
  pose.q[o + 3] = _qb.w;
}

/** 把第 `i` 个节点重置成单位四元数。 */
export function setPoseNodeIdentity(pose: PoseQuat, i: number): void {
  const o = i * 4;
  pose.q[o] = 0;
  pose.q[o + 1] = 0;
  pose.q[o + 2] = 0;
  pose.q[o + 3] = 1;
}

/**
 * 增量：`ref⁻¹ ⊗ pose`（逐节点、局部空间）。
 *
 * 方向不能反：局部空间里「把 ref 转到 pose」的增量必须**左乘**（`pose = delta ⊗ ref`），
 * 于是 `base ⊗ delta = base ⊗ ref⁻¹ ⊗ pose`，`base = ref` 时精确回到 `pose`。
 * 写成 `pose ⊗ ref⁻¹` 会得到 `ref ⊗ pose ⊗ ref⁻¹` —— 那是共轭（绕 ref 转过的轴），
 * 不是同一个朝向（v9s.73 第一版就是这么错的，w=1 时肩膀偏 15°）。
 */
export function deltaPoseQuat(ref: PoseQuat, pose: PoseQuat, out?: Float32Array): Float32Array {
  const n = Math.min(ref.nodes.length, pose.nodes.length);
  const dst = out && out.length >= n * 4 ? out : new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    _qr.set(ref.q[o], ref.q[o + 1], ref.q[o + 2], ref.q[o + 3]).invert();
    _qp.set(pose.q[o], pose.q[o + 1], pose.q[o + 2], pose.q[o + 3]);
    _qd.copy(_qr).multiply(_qp);
    dst[o] = _qd.x;
    dst[o + 1] = _qd.y;
    dst[o + 2] = _qd.z;
    dst[o + 3] = _qd.w;
  }
  return dst;
}

/**
 * 合成：`q_i = base_i ⊗ slerp(identity, delta_i, w)`，写回 `base.nodes`。
 *
 * `w <= 0` 时写回 base（等价于「这一层没参与」）；`w >= 1` 时是纯矩阵乘，
 * 不走 slerp —— 保证「满权重 = 旧绝对姿态」逐位成立。
 */
export function composePoseQuat(base: PoseQuat, delta: Float32Array, w: number): void {
  const k = w <= 0 ? 0 : w >= 1 ? 1 : w;
  const { nodes, q } = base;
  const n = Math.min(nodes.length, delta.length >> 2);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    _qb.set(q[o], q[o + 1], q[o + 2], q[o + 3]);
    _qd.set(delta[o], delta[o + 1], delta[o + 2], delta[o + 3]);
    if (k >= 1) {
      _qb.multiply(_qd);
    } else {
      // 从单位四元数插到 delta：权重作用在「偏转量」上，而不是在两端姿态之间
      _qi.identity().slerp(_qd, k);
      _qb.multiply(_qi);
    }
    _qb.normalize();
    nodes[i].quaternion.copy(_qb);
  }
}

/** 增量里最大的单节点转角（rad）。验收用：「这一层到底转了多少」。 */
export function poseDeltaAngle(delta: Float32Array): number {
  let max = 0;
  for (let o = 0; o + 3 < delta.length; o += 4) {
    // |w| 比 1 大时 acos 会出 NaN（浮点误差），先夹一次
    const w = Math.min(1, Math.abs(delta[o + 3]));
    const a = 2 * Math.acos(w);
    if (a > max) max = a;
  }
  return max;
}
