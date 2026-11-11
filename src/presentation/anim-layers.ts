/**
 * v9s.74 · 动画层的**声明表**：每一层允许写哪些通道、用哪种语义。
 *
 * 这张表不控制执行顺序（顺序仍是 `update()` 里的代码顺序），它控制的是**归属**：
 *
 * - 写了表里没有的通道 → `overreach`（越权）；
 * - 两个 `override` 层同帧写同一通道 → `conflicts`（静默覆盖）。
 *
 * 表的来源是探针实测（`tests/v9s74-channel-guard.test.ts` 会跑六个场景：
 * 待机 / 行走转身 / 跳跃落地 / 三武器连打 / 受击 / 鱼人体态），
 * 再由 `matrixMarkdown()` 导出成文档矩阵。**改代码就要改这张表**，不同步会红。
 *
 * 通道名 = `<节点>.<属性>`，节点集见 `voxel-rig.ts` 的 `probeNodes`：
 * `root / pelvis / lower / upper / chest / ankleL / ankleR`。
 * 手臂 / 肩 / 腕 / 剑身不在监控集 —— 它们按设计就是「整层覆盖」，
 * 多层写是约定不是 bug（v9s.73 的 YXZ 翻支解释了为什么不能改成增量）。
 *
 * 语义速查：
 * - `add`：`+=`，同通道允许多层叠加；
 * - `override`：整体替换（`=` 或「先归零再写」），同帧只允许一个；
 * - `reset`：每帧开头的统一归零，与所有 override 天然同通道，不参与冲突判定。
 */
import type { LayerSpec } from './anim-probe';

export const ANIM_LAYERS: readonly LayerSpec[] = [
  {
    // 每帧复位：rotation 归零 + 骨盆回髋高。它是所有 override 层的「共同起点」。
    id: '1.0 reset',
    writes: {
      'root.ry': 'reset',
      'upper.px': 'reset', 'upper.pz': 'reset',
      'upper.rx': 'reset', 'upper.ry': 'reset', 'upper.rz': 'reset',
      'pelvis.px': 'reset', 'pelvis.py': 'reset', 'pelvis.pz': 'reset',
      'pelvis.rx': 'reset', 'pelvis.rz': 'reset',
      'lower.px': 'reset', 'lower.py': 'reset', 'lower.pz': 'reset',
      'chest.rx': 'reset', 'chest.ry': 'reset', 'chest.rz': 'reset',
    },
  },
  {
    // 步态：腿的摆动写进髋 / 膝，骨盆吃起伏与侧倾（左右重心转移）。
    id: '1.2 gait',
    writes: { 'pelvis.px': 'add', 'pelvis.py': 'add', 'pelvis.rz': 'add' },
  },
  {
    // 停步惯性 / 待机斜跨：身体被惯性带走，脚由 IK 拉回；下沉单独补回 lower。
    id: '1.3 stop',
    writes: {
      'pelvis.px': 'add', 'pelvis.py': 'add', 'pelvis.pz': 'add',
      'lower.px': 'add', 'lower.py': 'add',
    },
  },
  {
    // 移动惯性倾斜：盆骨前后倾 / 侧倾 + 重心平移 + 跑动下沉。
    id: '1.5 inertia',
    writes: {
      'pelvis.px': 'add', 'pelvis.py': 'add', 'pelvis.pz': 'add',
      'pelvis.rx': 'add', 'pelvis.rz': 'add',
      'lower.py': 'add',
    },
  },
  {
    // 体态的骨盆升降 / 后坐（posture.pelvisLift / Drop / Back）。
    id: '1.7 posture-pelvis',
    writes: { 'pelvis.py': 'add', 'pelvis.pz': 'add', 'lower.py': 'add' },
  },
  {
    // 持械待机姿态：按武器给上半身扭转与摆臂偏移。
    id: '1.1 stance',
    writes: { 'upper.rx': 'add', 'upper.ry': 'add' },
  },
  {
    // 攻击剪辑：躯干走四元数增量（v9s.73），骨盆位移与整圈旋转仍整体接管。
    id: '2.0 combat',
    writes: {
      'upper.rx': 'override', 'upper.ry': 'override', 'upper.rz': 'override',
      'pelvis.px': 'override', 'pelvis.py': 'override', 'pelvis.pz': 'override',
      'root.ry': 'override',
    },
  },
  {
    // 法杖引导：躯干拧向侧前方（`=` 而不是 `+=`，引导时与近战互斥）。
    id: '2.05 channel',
    writes: { 'upper.ry': 'override' },
  },
  {
    // 派生招（举盾前撞）：前倾 + 骨盆前送。
    id: '2.06 link',
    writes: { 'upper.rx': 'add', 'pelvis.pz': 'add' },
  },
  {
    // 受击分层：上半身倾斜 / 屈膝 / 后坐 / 肩部扭转。
    id: '2.5 hurt',
    writes: {
      'upper.rx': 'add', 'upper.ry': 'add', 'upper.rz': 'add',
      'upper.px': 'add', 'upper.pz': 'add',
      'pelvis.px': 'add', 'pelvis.py': 'add', 'pelvis.pz': 'add',
      'lower.py': 'add', 'lower.pz': 'add',
    },
  },
  {
    // 惯性倾斜（lean）：加速前倾 / 刹车后仰 / 绕圈侧倾，叠在攻击之上。
    id: '2.6 lean',
    writes: { 'upper.rx': 'add', 'upper.rz': 'add' },
  },
  {
    // 跳跃 / 落地缓冲：屈膝 + 重心下沉 + 上半身前倾。
    id: '2.7 land',
    writes: { 'upper.rx': 'add', 'pelvis.py': 'add', 'lower.py': 'add' },
  },
  {
    // 挥击跨步（lowerBodyWeight）：只在配置打开时跑，线上缺省 0（走等效步态）。
    id: '2.8 step',
    writes: { 'pelvis.px': 'add', 'pelvis.py': 'add', 'pelvis.rz': 'add' },
  },
  {
    // 肩部（上臂根部）位移：写 shoulder.position，不在监控集内。
    id: '2.85 shoulder',
    writes: {},
  },
  {
    // 自动重心修正：把骨盆往质心偏的那一侧挪回几毫米。
    id: '2.88 balance',
    writes: { 'pelvis.px': 'add' },
  },
  {
    // 四肢 squash & stretch：只写 scale 与骨长，不动旋转。
    id: '2.9 stretch',
    writes: {},
  },
  {
    // 朝向三段分离：下盘偏航（覆盖）、头部目标、身体俯仰（叠加）。
    id: '2.95 facing',
    writes: { 'lower.ry': 'override', 'upper.rx': 'add' },
  },
  {
    // 基础体态：躯干前倾。`keep` 让它在攻击期间只保留一半。
    id: '2.96 posture',
    writes: { 'upper.rx': 'add' },
  },
  {
    // splitSpine：把 upper 上的躯干总角按段数摊到 spine1 / chest。
    // 语义是 `derive`（重分配）而不是 `override`：它必然改写上一层写的 upper，
    // 但那正是它的职责 —— 和「两个层都想独占躯干」是两回事。
    id: '3.0 split',
    writes: {
      'upper.rx': 'derive', 'upper.ry': 'derive', 'upper.rz': 'derive',
      'chest.rx': 'derive', 'chest.ry': 'derive', 'chest.rz': 'derive',
    },
  },
  {
    // 偏航沿链单调：腰段锚在髋上，胸段补差（`+=`，总角不变）。
    id: '3.01 yaw',
    writes: { 'upper.ry': 'add', 'chest.ry': 'add' },
  },
  {
    // 弓腰：拆分之后单独折腰段（否则会被摊到胸段，读起来是「整根斜」）。
    id: '3.05 waist',
    writes: { 'upper.rx': 'add' },
  },
  {
    // 手臂回正：写上臂（模型空间共轭），不在监控集内。
    id: '3.1 armDrop',
    writes: {},
  },
  {
    // 腕部滞后 / 剑身仰角反解 / 副手握持：都写手臂与武器挂点。
    id: '3.4 wrist',
    writes: {},
  },
  {
    id: '3.55 blade',
    writes: {},
  },
  {
    id: '3.5 grip',
    writes: {},
  },
  {
    // 足部 IK：反解髋 / 膝，脚锁把踝的模型空间朝向拧回 IK 之前。
    id: '4 ik',
    writes: {
      'ankleL.rx': 'override', 'ankleL.ry': 'override', 'ankleL.rz': 'override',
      'ankleR.rx': 'override', 'ankleR.ry': 'override', 'ankleR.rz': 'override',
    },
  },
];
