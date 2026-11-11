/**
 * 普通假人的简化 rig：构建 + 逐帧驱动。
 *
 * 与 `voxel-rig.ts` 是**平行实现**，不是复制粘贴：两者调用同一批解算器
 * （gait / hurt-pose / inertia / rig-ik），差别只在骨架精度与「不需要武器 / 挥击」。
 * 注释里的「与主角同构」说的是**调用顺序一致**，不是代码拷贝。
 * 合并成一份需要给每个阶段加 `isDummy` 分支，反而更难读 —— 刻意保留两份。
 *
 * 带武器的陪练不走这里：它在 `fighter-rig.ts` 里复用主角的 `voxel-rig`（要同款挥击）。
 */
import * as THREE from 'three';
import { wrapAngle } from '../core';
import type {
  ColorConfig, DummyMode, DummyState, DummyVariant, DummyViewConfig, GaitViewConfig,
  HurtViewConfig, IKViewConfig, LeanViewConfig, VoxelConfig,
} from '../core';
import {
  buildMurlocBelly, buildMurlocDorsalFin, buildMurlocFoot, buildMurlocHead, buildMurlocHip,
  buildMurlocShoulderFin, buildMurlocTail, MURLOC_HEAD_SPIN, MURLOC_POSTURE,
} from './murloc-parts';
import {
  solveGait, solveStopGait, nextFeetTogetherPhase, strafeHipYaw, backStrafeKeep,
  backHipYawTarget,
  stopBlendGate, chestYawFromHip, solveStopInertia, bodyLocalDir, stopYawFade, slewDirSign, slewHipTarget, turnSpinGate,
  hipFlipWeight, hipTrackRate, slewGate,
} from './gait';
import type { GaitInput } from './gait';
import { solveHurtPose } from './hurt-pose';
import { solveInertiaPose } from './inertia';
import { applyFootIK, captureIKBase, EMPTY_IK_DIAGNOSTICS } from './rig-ik';
import { pitchInModelSpace } from './rig-space';
import type { IKDiagnostics, IKLimb } from './rig-ik';

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export type DummyRig = {
  group: THREE.Group;
  /** 姿态完全由 Core 状态驱动，无本地时间累积（flash 除外，纯视觉衰减）。
   *  v9s.45：`coreTime` 可选（Core 的 world.time）—— 转身闸门要用**游戏时间**角速度，
   *  慢放时才能与常速一致；不传时退化为按 frameDt 计算（单测路径）。 */
  update(s: DummyState, frameDt: number, coreTime?: number): void;
  /**
   * v9s.18 · 命中点落在哪一根肢体上。
   *
   * 把命中点投到骨架的若干段（躯干 / 头 / 两臂 / 两腿）上，取最近的一段，
   * 返回**该段所属节点**与段上的最近点。箭插住时直接挂到这个节点下，
   * 于是一条插在胳膊上的箭会跟着胳膊一起动，而不是浮在身体旁边。
   */
  boneAtWorld(x: number, y: number, z: number): { node: THREE.Object3D; point: THREE.Vector3 } | null;
  /** v8g：本帧足部 IK 锚定读数（与主角同构，不进 Core / 快照）。 */
  ik(): IKDiagnostics;
  dispose(): void;
};

/**
 * 简化版体素假人：3 头身、髋/膝与肩/肘关节、无蒙皮、无武器。
 * 与玩家共用同一套步态相位，靠配色 + 脚下威胁半环区分。
 * v9s.9：去掉头顶精灵标签 —— 点假人本身就切行为模式，标签既有纹理上传成本，
 * 又和脚下环表达重复信息；模式仍用一次短暂高亮反馈。
 */
export function createDummyRig(
  v: VoxelConfig,
  colors: ColorConfig,
  tint: string,
  id: number,
  view: DummyViewConfig,
  referenceSpeed: number,
  gaitCfg: GaitViewConfig,
  hurtCfg: HurtViewConfig,
  /** v8g：惯性分层 / 足部 IK 配置。省略时两者都关闭（旧姿态，供单测 A/B 对照），
   *  线上由 three-scene 传入 view.lean / view.ik 开启。 */
  leanCfg?: LeanViewConfig,
  ikCfg?: IKViewConfig,
  /** v9s.63：造型变体。`murloc` 只换头 / 脚 / 背鳍 / 尾，骨架与骨骼名不变 ——
   *  断肢映射（`SEVER_NODE` 按节点名查找）、步态、受击、倒地全部直接复用。 */
  variant: DummyVariant = 'human',
): DummyRig {
  const ikConfig: IKViewConfig = ikCfg ?? {
    enabled: false, weight: 0, attackScale: 1, maxCorrectionDeg: 70,
  };
  const root = new THREE.Group();
  // v8f：与主角同构的合理骨架 —— 共享骨盆（髋部）→ lower（腿）/ upper（上半身）。
  // 旧版腿直接挂在 bob 下，bob 一倾斜就把腿一起转，「脚底锚定」比主角还严重；
  // 现在上半身绕腰倾斜、腿绕髋带转，屁股后坐 / 下沉 / 重心由 pelvis 统一驱动。
  const pelvis = new THREE.Group();
  pelvis.name = 'pelvis';
  pelvis.position.y = v.legLength;
  root.add(pelvis);
  const lower = new THREE.Group();
  lower.name = 'lower';
  const upper = new THREE.Group();
  upper.name = 'upper';
  pelvis.add(lower);
  pelvis.add(upper);

  const mats: THREE.MeshLambertMaterial[] = [];
  const mk = (w: number, h: number, d: number, color: string): THREE.Mesh => {
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mats.push(mat);
    return mesh;
  };

  // v9s.63：鱼人不吃 tint（每个假人一种专属色），四条鱼人统一是青绿色 ——
  // 「鱼人是一群同种生物」，颜色区分交给别的手段。
  const murloc = variant === 'murloc';
  // v9s.64：基础体态（与主角同一个 `CharacterPosture`，语义完全一致）。
  // 假人没有脊柱拆分，所以 waist 直接并进 pitch —— 单块躯干上两者本来就不可分。
  const posture = v.style?.posture ?? (murloc ? MURLOC_POSTURE : undefined);
  const posturePitch = (posture?.pitch ?? 0) + (posture?.waist ?? 0);
  const headBaseY = v.bodyHeight;

  const mc: ColorConfig = murloc
    ? { ...colors, body: '#4f9c78', head: '#5fb692', limb: '#3d7f61', shoe: '#2b5d49' }
    : colors;
  // 四肢 / 鞋 / 眼 也要吃这套色，否则鱼人是一颗绿头接在「每个假人专属色」的蓝色身体上。
  const cc: ColorConfig = mc;

  const H = v.headSize;
  const legLen = v.legLength;
  const armLen = v.armLength;
  const t = v.limbThickness;
  const bodyH = v.bodyHeight;
  const bodyW = v.bodyWidth;

  const torso = mk(bodyW, bodyH, 0.28, murloc ? mc.body : tint);
  torso.position.y = bodyH / 2;                 // 相对骨盆
  upper.add(torso);

  // v9s.70：髋块（只鱼人有）。假人没有脊柱分段，`upper` 直接就吃满 55° 体态，
  // 骨盆与躯干之间那道楔形缝比主角更宽 —— 补一块跟着吃 45% 的块把背面堵上。
  const hipMesh = murloc ? buildMurlocHip(pelvis, H, bodyW, 0.28, mc) : null;

  // 头部独立枢轴：绕脖子旋转，实现「头先于身体转向目标」（与主角一致，v7b#9）
  const headPivot = new THREE.Group();
  headPivot.name = 'headPivot';                  // v9o：供测试按名查找
  headPivot.rotation.order = 'YXZ';   // v9s.18：与主角同构，先 yaw 再 pitch
  headPivot.position.y = bodyH;                  // 相对骨盆（脖子在躯干顶）
  upper.add(headPivot);

  // v9s.65：鱼人的 yaw 走内层节点（绕颅中心），pitch 留在 headPivot（绕脖子）。
  // 全部搬到颅中心的话，同样的抬头角会让脸直接扎到地上 —— 见 `voxel-rig` 同一处注释。
  const headYawNode = murloc ? new THREE.Group() : null;
  const headYawTarget: THREE.Object3D = headYawNode ?? headPivot;
  if (headYawNode) {
    headYawNode.name = 'headYaw';
    headYawNode.position.y = MURLOC_HEAD_SPIN * H;
    headPivot.add(headYawNode);
  }

  if (murloc) {
    buildMurlocHead(headYawTarget, H, mc);
    // 鱼人零件自带材质，不受击闪光的话头会是唯一不闪的部位 —— 明显。
    // 瞳孔（userData.glow）除外：染红就丢了「暗处发亮」这个唯一的非人信号。
    headYawTarget.traverse((o) => {
      const mat = (o as THREE.Mesh).material;
      if (mat instanceof THREE.MeshLambertMaterial && !mat.userData.glow) mats.push(mat);
    });
  } else {
    // 头也用该假人的专属色：2.5D 俯视角主要看到头顶，这样四个假人一眼可分辨
    const head = mk(H, H, H, tint);
    head.position.y = H / 2;
    headPivot.add(head);

    // 眼睛贴在 +Z 面，用来验收朝向
    for (const sx of [-1, 1]) {
      const eye = mk(0.06, 0.07, 0.02, cc.shoe);
      eye.position.set(sx * 0.09, H / 2 + 0.03, H / 2 + 0.011);
      headPivot.add(eye);
    }
  }

  // v9s.63 鱼人的背鳍 / 肩鳍 / 腹甲：挂 `upper`（dummy 没有脊柱分段，upper 就是躯干）
  if (murloc) {
    buildMurlocDorsalFin(upper, bodyH, 0.28, bodyH);
    buildMurlocShoulderFin(upper, bodyW, bodyH, bodyH);
    buildMurlocBelly(upper, bodyW, 0.28, bodyH, bodyH);
    buildMurlocTail(pelvis, H, 0.28);
  }

  type Limb = { root: THREE.Group; joint: THREE.Group; tip?: THREE.Object3D; ankle?: THREE.Group };
  const makeLimb = (sx: number, isArm: boolean): Limb => {
    const len = isArm ? armLen : legLen;
    const jointRoot = new THREE.Group();
    jointRoot.name = isArm
      ? (sx < 0 ? 'shoulderL' : 'shoulderR')
      : (sx < 0 ? 'hipL' : 'hipR');
    // v8g：腿的 IK 要求「Rz(roll)·Rx(pitch)」共面，THREE 默认 XYZ 是反的
    if (!isArm) jointRoot.rotation.order = 'ZYX';
    jointRoot.position.set(
      sx * (isArm ? bodyW / 2 + t / 2 : bodyW / 2 - t / 2),
      isArm ? bodyH - 0.04 : 0,                  // 相对骨盆
      0,
    );
    // 注意：局部 mesh 不能叫 upper / lower，否则会遮蔽骨架的 upper / lower 组（TDZ）。
    (isArm ? upper : lower).add(jointRoot);

    const upperSeg = mk(t, len / 2, t, cc.limb);
    upperSeg.position.y = -len / 4;
    jointRoot.add(upperSeg);

    const joint = new THREE.Group();
    // v9s.77：与主角骨架同名规则（膝带左右后缀），截图机位 / 验收脚手架按名取关节
    joint.name = isArm ? 'elbow' : (sx < 0 ? 'kneeL' : 'kneeR');
    joint.position.y = -len / 2;
    jointRoot.add(joint);

    const lowerSeg = mk(t, len / 2, t, cc.limb);
    lowerSeg.position.y = -len / 4;
    joint.add(lowerSeg);

    if (!isArm) {
      // v9s.66：与主角同构的踝关节 —— 足部 IK 反解髋 / 膝后把它的朝向拧回 IK 之前
      const ankle = new THREE.Group();
      ankle.name = sx < 0 ? 'ankleL' : 'ankleR';
      ankle.position.y = -len / 2;
      joint.add(ankle);

      if (murloc) {
        buildMurlocFoot(ankle, t, 0, mc);
      } else {
        const shoe = mk(t * 1.15, 0.07, t * 1.7, cc.shoe);
        shoe.position.set(0, 0.035, 0.045);
        ankle.add(shoe);
      }
      // 踝点锚点（不含鞋的视觉偏移），FK / IK 精确互逆
      const tip = new THREE.Object3D();
      tip.name = sx < 0 ? 'footTipL' : 'footTipR';
      ankle.add(tip);
      return { root: jointRoot, joint, tip, ankle };
    }
    return { root: jointRoot, joint };
  };

  const legL = makeLimb(-1, false);
  const legR = makeLimb(1, false);
  const armL = makeLimb(-1, true);
  const armR = makeLimb(1, true);

  // v8g：与主角完全同构的两骨 IK 腿描述（膝向后折）
  const ikLimbs: IKLimb[] = [legL, legR].map((leg) => ({
    root: leg.root,
    joint: leg.joint,
    tip: leg.tip!,
    ankle: leg.ankle,
    upperLen: legLen / 2,
    lowerLen: legLen / 2,
    bend: 1 as const,
  }));

  // 攻击弧：只在 active 帧出现，红色，与玩家的白色斩击弧区分
  const arcMat = new THREE.MeshBasicMaterial({
    color: view.attackArcColor,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.042, 6, 20, Math.PI * 1.1), arcMat);
  arc.position.set(0, 0.78 - legLen, 0.56);        // 相对骨盆
  upper.add(arc);

  // v9s.9：头顶标签已移除，模式区分交给脚下的威胁半环（见 ground-ring.ts）。

  const tintColor = new THREE.Color(tint);
  const hurtColor = new THREE.Color(hurtCfg.flashColor);
  const hurtGlowColor = new THREE.Color();
  let lastMode: DummyMode | null = null;
  let flash = 0;
  // v8g：惯性倾斜 / 移动下沉的平滑状态，以及本帧 IK 诊断（全部纯表现，不进 Core）
  let prevVx = 0;
  let prevVz = 0;
  let prevYaw = 0;
  let leanF = 0;
  let leanS = 0;
  let crouchSmooth = 0;
  let lastIK: IKDiagnostics = { ...EMPTY_IK_DIAGNOSTICS };

  // ---- v9n：停步收相状态（纯表现层，不进 Core / 快照）----
  let stopT = -1;
  let stopPhase0 = 0;
  let stopPhaseEnd = 0;
  let stopSpeed0 = 0;
  let stopStride0 = 0;
  let stopFwd = 0;
  let stopRight = 0;
  /** v9q：停步瞬间锁定的**世界**移动方向（单位向量），供惯性按骨盆局部轴投影 */
  let stopDirWX = 0;
  let stopDirWZ = 1;
  /** 下盘侧移偏转的平滑状态（与主角同构，避免单帧跳变） */
  let sideYaw = 0;
  /** v9s.44：下盘偏转**目标**（限速后的值），与 sideYaw 分开存 */
  let sideYawTarget = 0;
  /** v9s.44：上一帧 bodyYaw，用于算身体角速度（决定下盘目标要不要限速） */
  let prevHipBodyYaw = 0;
  /** v9s.45：转身闸门的一阶状态 / 上一帧 Core 时间（游戏时间角速度，慢放不半开） */
  let spinBlend = 0;
  let prevHipCoreTime = -1;
  /** v9o：上一帧速度，用于区分「减速停步」与「KEEP DIST 低速横移」（后者不该收相） */
  let prevSpeed = 0;
  // ---- v9s：停步下盘偏差消化窗口（与主角同构，全部纯表现层状态）----
  let stopYawPhase: 'none' | 'blend' | 'settled' = 'none';
  let stopYawDrain = 0;
  let lastInStop = false;
  let lastStopT = -1;
  let lastGateResume = false;
  let lastSpeed = 0;
  let lastPrevSpeed = 0;
  /** v9s.43：前后 / 左右摆腿的驱动符号（−1..1，线性）。与主角同构：
   *  KEEP DIST 从「退」切到「进」时硬翻符号会让整条腿位镜像（会抽一下），
   *  这里按 gaitCfg.dirFlipSec 逐帧走过 0，摆幅跟着收放。 */
  let dirDriveF = 1;
  let dirDriveR = 1;

  return {
    group: root,
    boneAtWorld(x: number, y: number, z: number): { node: THREE.Object3D; point: THREE.Vector3 } | null {
      // 段用「节点局部坐标」描述，节点动（转身 / 摆臂 / 抬腿）段就跟着动。
      const segs: Array<{
        node: THREE.Object3D; ax: number; ay: number; az: number; bx: number; by: number; bz: number;
      }> = [
        // 躯干：骨盆 → 脖子（挂在 upper 下，跟着弯腰 / 侧倾 / 旋身）
        { node: upper, ax: 0, ay: 0.05, az: 0, bx: 0, by: bodyH, bz: 0 },
        // 头：脖子 → 头顶
        { node: headPivot, ax: 0, ay: 0, az: 0, bx: 0, by: H, bz: 0 },
        // 两臂：肩 → 肘，肘 → 腕
        { node: armL.root, ax: 0, ay: 0, az: 0, bx: 0, by: -armLen / 2, bz: 0 },
        { node: armL.joint, ax: 0, ay: 0, az: 0, bx: 0, by: -armLen / 2, bz: 0 },
        { node: armR.root, ax: 0, ay: 0, az: 0, bx: 0, by: -armLen / 2, bz: 0 },
        { node: armR.joint, ax: 0, ay: 0, az: 0, bx: 0, by: -armLen / 2, bz: 0 },
        // 两腿：髋 → 膝，膝 → 踝
        { node: legL.root, ax: 0, ay: 0, az: 0, bx: 0, by: -legLen / 2, bz: 0 },
        { node: legL.joint, ax: 0, ay: 0, az: 0, bx: 0, by: -legLen / 2, bz: 0 },
        { node: legR.root, ax: 0, ay: 0, az: 0, bx: 0, by: -legLen / 2, bz: 0 },
        { node: legR.joint, ax: 0, ay: 0, az: 0, bx: 0, by: -legLen / 2, bz: 0 },
      ];
      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const p = new THREE.Vector3(x, y, z);
      const closest = new THREE.Vector3();
      let best: THREE.Object3D | null = null;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const s of segs) {
        s.node.updateWorldMatrix(true, false);
        a.set(s.ax, s.ay, s.az);
        b.set(s.bx, s.by, s.bz);
        s.node.localToWorld(a);
        s.node.localToWorld(b);
        const abx = b.x - a.x;
        const aby = b.y - a.y;
        const abz = b.z - a.z;
        const len2 = abx * abx + aby * aby + abz * abz;
        let t = len2 > 1e-8 ? ((p.x - a.x) * abx + (p.y - a.y) * aby + (p.z - a.z) * abz) / len2 : 0;
        t = Math.max(0, Math.min(1, t));
        const cx = a.x + abx * t;
        const cy = a.y + aby * t;
        const cz = a.z + abz * t;
        const d = (p.x - cx) ** 2 + (p.y - cy) ** 2 + (p.z - cz) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = s.node;
          closest.set(cx, cy, cz);
        }
      }
      return best ? { node: best, point: closest.clone() } : null;
    },
    update(s, frameDt, coreTime?): void {
      const gameDt = coreTime === undefined || prevHipCoreTime < 0
        ? frameDt
        : clamp(coreTime - prevHipCoreTime, 0, 0.1);
      if (coreTime !== undefined) prevHipCoreTime = coreTime;
      root.position.set(s.position.x, s.position.y, s.position.z);
      // 身体用平滑朝向（bodyYaw），头相对身体再补一个差值，实现头身分离（v7b#9）
      root.rotation.y = s.bodyYaw;
      headYawTarget.rotation.y = ((s.headYaw - s.bodyYaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

      // 模式变化：一次短暂高亮，给点击一个明确反馈
      if (s.mode !== lastMode) {
        lastMode = s.mode;
        flash = 1;
      }
      flash = Math.max(0, flash - frameDt * 2.2);

      // v8f：与主角共用同一套分层受击解算器，进度由 Core 的 hurt.timer / duration 驱动
      const h = s.hurt;
      const pose = solveHurtPose(h, s.bodyYaw, hurtCfg);
      const glow = pose.flash;
      hurtGlowColor.copy(hurtColor).multiplyScalar(glow);
      for (const m of mats) {
        m.emissive.copy(tintColor).multiplyScalar(flash * 0.5);
        if (glow > 0) m.emissive.add(hurtGlowColor);
      }

      // 每帧把骨盆 / 上下半身的局部偏移复位到髋部基准（所有叠加都是 += / -=）
      // v8g：盆骨前后倾角由惯性层写入，必须一并归零，否则逐帧累积
      pelvis.position.set(0, legLen, 0);
      pelvis.rotation.set(0, 0, 0);
      upper.position.set(0, 0, 0);
      upper.rotation.set(0, 0, 0);
      lower.position.set(0, 0, 0);
      lower.rotation.z = 0;
      // v9n：下盘侧移偏转在 gait 计算时写入（见下），此处先不复位以免被 IK 基准读到旧值

      // 与玩家共用同一套程序化步态解算器（v8）：怪物侧移 / 后退时也有方向自适应
      // 的腿摆、交叉步与抬膝，承接 #9「怪物也要像主角一样的动画机制」。
      const speed = Math.hypot(s.velocity.x, s.velocity.z);
      // v9q：与主角同构 —— 击退冲量（s.hurt.knockX/Z）在 Core 里直接加到 position，
      // 不进 velocity。把它按比例并入**步态驱动**，被推开时下盘才会迈出后撤步，
      // 而不是身体平移、腿钉在原地。latRatio / 停步门控 / 惯性倾斜仍只用原 speed。
      const knockScale = clamp(gaitCfg.knockGaitScale ?? 0, 0, 1);
      const knockX = s.hurt.knockX * knockScale;
      const knockZ = s.hurt.knockZ * knockScale;
      // 拉 0 时连「击退期间不收相」也一并关掉，精确回到旧行为
      const knockActive = knockScale > 0 && Math.hypot(s.hurt.knockX, s.hurt.knockZ) > 1e-3;
      const gaitVX = s.velocity.x + knockX;
      const gaitVZ = s.velocity.z + knockZ;
      const gaitSpeed = Math.hypot(gaitVX, gaitVZ);

      // ---- v9n · 侧移下盘偏转 ----
      // 「KEEP DIST / FOLLOW 时与玩家保持距离横移」是纯侧移：两腿只有左右摆、
      // 没有前后迈步，看起来像双脚平行拖着走。把下半身朝移动方向带转一点，
      // 步态投影就有了前向分量，腿自然变成斜向迈步；用平方增益保证前进/后退不受影响。
      const bodyRightX = Math.cos(s.bodyYaw);
      const bodyRightZ = -Math.sin(s.bodyYaw);
      const latRatio = speed > 1e-6
        ? clamp((s.velocity.x * bodyRightX + s.velocity.z * bodyRightZ) / speed, -1, 1)
        : 0;
      // v9s.14：侧后方走后退步时下盘朝移动反侧转（与主角同构）
      const bodyFwdRatio = speed > 1e-6
        ? clamp((s.velocity.x * Math.sin(s.bodyYaw) + s.velocity.z * Math.cos(s.bodyYaw)) / speed, -1, 1)
        : 1;
      const backKeep = backStrafeKeep(
        bodyFwdRatio, gaitCfg.backStrafeStartDeg, gaitCfg.backStrafeFullDeg,
      );
      // v9s：与主角同构的停步下盘偏差消化。latRatio 是方向比值，减速时侧移偏转不会
      // 自然归零，会一直保持到速度几乎为 0 才骤掉 —— 把偏差乘淡出系数消化进收相。
      if (stopYawPhase === 'settled' && lastGateResume
          && lastSpeed > lastPrevSpeed * 1.02 + 1e-4) {
        stopYawPhase = 'none';
      }
      let yawFade = 1;
      if (stopYawPhase === 'blend') {
        const prog = lastInStop ? lastStopT : stopYawDrain;
        yawFade = stopYawFade(prog, gaitCfg.stopYawBlendMode, lastInStop);
        if (!lastInStop) {
          stopYawDrain = Math.min(1, stopYawDrain + frameDt / Math.max(0.01, gaitCfg.stopYawAfterSec));
          const done = stopYawDrain >= 1
            || gaitCfg.stopYawBlendMode === 'inStop'
            || lastGateResume;
          if (done) {
            stopYawPhase = 'settled';
            yawFade = 0;
          }
        }
      } else if (stopYawPhase === 'settled') {
        // 与主角同构：静止归零，重新加速时按速度比例自然恢复侧移偏转
        yawFade = clamp(speed / Math.max(1e-6, gaitCfg.stopEnterRatio * referenceSpeed), 0, 1);
      }
      const strafeSide = strafeHipYaw(
        latRatio, gaitCfg.strafeHipScale, gaitCfg.strafeHipMaxDeg, gaitCfg.strafeHipBoost,
      );
      // v9s.44：与主角同构 —— 身体自己在转时停用「后退族」翻转，并给目标限速
      const bodyYawRate = gameDt > 1e-6
        ? wrapAngle(s.bodyYaw - prevHipBodyYaw) / gameDt
        : 0;
      prevHipBodyYaw = s.bodyYaw;
      // 一个开关管住整套对策：拉到 0 = 精确回到旧行为（A/B 用）
      const hipRate = (gaitCfg.hipYawTrackRateDeg ?? 0) * Math.PI / 180;
      const hipBackRate = (gaitCfg.hipYawBackRateDeg ?? 0) * Math.PI / 180;
      // v9s.45：与主角同构 —— 闸门用游戏时间 + 一阶状态，前 / 后相位各一档限速
      const dtw = gameDt > 1e-6 ? gameDt : frameDt;
      spinBlend = hipRate > 0 ? slewGate(spinBlend, turnSpinGate(bodyYawRate), dtw) : 0;
      const flip = hipFlipWeight(backKeep, spinBlend);
      // 与主角同构：方向比值在速度趋零时是噪声，按速度大小淡出偏转目标
      const hipSpeedFade = clamp(speed / 0.5, 0, 1);
      const rawTargetSide = backHipYawTarget(
        bodyFwdRatio, latRatio, strafeSide, flip,
      ) * yawFade * hipSpeedFade;
      const targetSide = slewHipTarget(
        sideYawTarget, rawTargetSide,
        hipTrackRate(hipRate, hipBackRate, flip), dtw, spinBlend,
      );
      sideYawTarget = targetSide;
      sideYaw += (targetSide - sideYaw) * (1 - Math.exp(-12 * Math.max(0, dtw)));
      lower.rotation.y = sideYaw;

      const gaitYaw = s.bodyYaw + sideYaw;
      const fwdX = Math.sin(gaitYaw);
      const fwdZ = Math.cos(gaitYaw);
      const rightX = Math.cos(gaitYaw);
      const rightZ = -Math.sin(gaitYaw);
      // v9q：投影用含击退冲量的等效速度（与主角同构）
      const localForward = gaitVX * fwdX + gaitVZ * fwdZ;
      const localRight = gaitVX * rightX + gaitVZ * rightZ;

      // ---- v9n · 停步收相（与主角同构）----
      const stopSec = Math.max(0, gaitCfg.stopBlendSec || 0);
      // 击退期间身体还在被推着走，不收相
      const stopOn = stopSec > 0 && !knockActive;
      // v9o：与主角同构的收相门控。KEEP DIST / FOLLOW 保持距离横移时速度长期停在
      // 低速区间，旧判据会把步态收成 idle、假人整体平移滑行；现在只在减速趋零时接管。
      const gate = stopBlendGate(
        speed, prevSpeed, referenceSpeed,
        gaitCfg.stopEnterRatio, gaitCfg.stopExitRatio,
      );
      if (!stopOn || gate.resume) {
        stopT = -1;
      } else if (stopT < 0 && gate.enter) {
        stopT = 0;
        stopPhase0 = s.gaitPhase;
        stopPhaseEnd = nextFeetTogetherPhase(s.gaitPhase);
        stopSpeed0 = speed;
        stopStride0 = Math.max(s.stride, 1e-6);
        stopFwd = localForward;   // gait 局部，给 solveStopGait 用
        stopRight = localRight;
        // v9q：惯性方向锁定为停步瞬间的**世界**移动方向，收相尾段速度趋零也不漂移
        const inv = 1 / Math.max(1e-6, speed);
        stopDirWX = s.velocity.x * inv;
        stopDirWZ = s.velocity.z * inv;
      }
      const oldPrevSpeed = prevSpeed;
      prevSpeed = speed;
      const inStop = stopOn && stopT >= 0;
      if (inStop) stopT = Math.min(1, stopT + frameDt / stopSec);
      // v9s：缓存收相状态供下一帧 sideYaw 淡出（与主角同构，一帧延迟无可见差）
      if (inStop && stopYawPhase !== 'blend') {
        stopYawPhase = 'blend';
        stopYawDrain = 0;
      }
      // 与主角同构：stopT 到 1 视作收相结束，afterStop 从此开始独立消化
      lastInStop = inStop && stopT < 1;
      lastStopT = stopT;
      lastGateResume = gate.resume;
      lastSpeed = speed;
      lastPrevSpeed = oldPrevSpeed;

      // ---- v9s.43 · 换向融合（与主角同构）----
      // 假人在 KEEP DIST / FOLLOW 里频繁「够近了退、拉开了进」，硬符号换向时
      // 整条腿位会一帧镜像过去 —— 站在近处的陪练最容易被看到抽腿。
      const flipSec = Math.max(0, gaitCfg.dirFlipSec ?? 0);
      if (flipSec > 0) {
        dirDriveF = slewDirSign(dirDriveF, localForward >= 0 ? 1 : -1, frameDt, flipSec);
        dirDriveR = slewDirSign(dirDriveR, localRight >= 0 ? 1 : -1, frameDt, flipSec);
      } else {
        dirDriveF = localForward >= 0 ? 1 : -1;
        dirDriveR = localRight >= 0 ? 1 : -1;
      }

      const gaitInput: GaitInput = inStop ? {
        phase: stopPhase0,
        speed: stopSpeed0,
        moveSpeed: referenceSpeed,
        localForward: stopFwd,
        localRight: stopRight,
        dirF: dirDriveF,
        dirR: dirDriveR,
        legLength: v.legLength,
        stride: stopStride0,
        grounded: true,
      } : {
        phase: s.gaitPhase,
        speed: gaitSpeed,   // v9q：含击退冲量，被推开时腿才跟着迈步
        moveSpeed: referenceSpeed,
        localForward,
        localRight,
        dirF: dirDriveF,
        dirR: dirDriveR,
        legLength: v.legLength,
        stride: s.stride,
        grounded: true,
      };
      const gait = inStop
        ? solveStopGait(gaitInput, gaitCfg, {
            progress: stopT, phase0: stopPhase0, phaseEnd: stopPhaseEnd,
          })
        : solveGait(gaitInput, gaitCfg);

      // ---- v9p 停步惯性（与主角同构）：最后一步踩出去 + 身体微前移，再收回待机 ----
      let stopBodyX = 0;
      let stopBodyZ = 0;
      let stopBodyDip = 0;
      let stopChest = 0;
      if (inStop) {
        // v9q：方向按骨盆(bodyYaw)局部轴投影，避免侧移停步时前移方向歪掉一个 sideYaw
        const bd = bodyLocalDir(s.bodyYaw, stopDirWX, stopDirWZ);
        const si = solveStopInertia(stopT, stopPhase0, bd.forward, bd.right, gaitCfg);
        if (si.leadLeft) {
          gait.legL.pitchX -= si.leadPitch;   // 负 = 脚向前踩出
          gait.legL.kneeX += si.leadKnee;
          gait.legR.pitchX += si.trailPitch;
        } else {
          gait.legR.pitchX -= si.leadPitch;
          gait.legR.kneeX += si.leadKnee;
          gait.legL.pitchX += si.trailPitch;
        }
        stopBodyZ = si.bodyShift * si.fwdN;
        stopBodyX = si.bodyShift * si.rightN;
        stopBodyDip = si.bodyDip;
        stopChest = si.chestPitch;
      }

      legL.root.rotation.x = gait.legL.pitchX;
      legR.root.rotation.x = gait.legR.pitchX;
      legL.root.rotation.z = gait.legL.rollZ;
      legR.root.rotation.z = gait.legR.rollZ;
      legL.joint.rotation.x = gait.legL.kneeX;
      legR.joint.rotation.x = gait.legR.kneeX;
      armL.root.rotation.x = gait.armL;
      armR.root.rotation.x = gait.armR;
      // v8g：肘朝身前折（负号），修「反关节」
      armL.joint.rotation.x = -0.18;
      armR.joint.rotation.x = -0.18;
      // 骨盆起伏 / 重心转移 / 侧倾统一驱动上下半身；程序化身体侧倾在受击时减半
      pelvis.position.x = gait.pelvisX;
      pelvis.position.y = legLen + gait.pelvisY;
      // v9q：惯性位移不写在这里（IK 基准之前），改到下方 captureIKBase 之后叠加
      pelvis.position.z = 0;
      pelvis.rotation.z = gait.pelvisRoll;
      upper.rotation.z = gait.sideLean * (pose.intensity > 0 ? 0.4 : 1);

      // ---- v8g：IK 基准 + 惯性分层（与主角完全同构）----
      // 基准 = 步态刚写完、还没被受击 / 惯性层推走的骨盆 / 下盘；末尾 IK 把差值
      // 吸收进髋膝角，假人被打得后仰 / 后坐时脚仍踩在原地。
      const ikBase = captureIKBase(pelvis, lower);
      // v9s：与主角同构的停步惯性 IK 重做。
      //  - 停步期间把 IK 权重临时提到 1：默认 0.9 会让下沉留下约 10% 残差（脚穿地）；
      //  - lower 不再反向补偿：它随 pelvis 一起被惯性带走，上下半身同步（修「分离」），
      //    脚由 applyFootIK 用上面捕获的「未位移未下沉」锚点精确拉回；
      //  - IK 关闭时退回等量反向补偿，脚不滑也不穿地（A/B 降级路径）。
      const ikCfg = inStop && ikConfig.enabled ? { ...ikConfig, weight: 1 } : ikConfig;
      const ikWStop = ikCfg.enabled && ikCfg.weight > 0 ? clamp(ikCfg.weight, 0, 1) : 0;
      // 垂直下沉单独补偿：hip 随骨盆变低后，原脚位锚点相对 hip 超出腿的臂展，
      // IK 解会被 clamped，脚仍会穿地。lower 等量抬回 = 不跟随下沉的 IK 辅助基准。
      pelvis.position.x += stopBodyX;
      pelvis.position.z += stopBodyZ;
      pelvis.position.y -= stopBodyDip;
      lower.position.y += stopBodyDip;
      if (ikWStop <= 0) {
        lower.position.x -= stopBodyX;
        lower.position.z -= stopBodyZ;
      }
      // v9s.64 基础体态 · 骨盆升降 / 后坐（必须在 captureIKBase 之后：
      //   锚点要取「还没被体态推走」的脚位，IK 才会把抬 / 沉反解成屈膝）。
      if (posture && ((posture.pelvisLift ?? 0) !== 0 || (posture.pelvisDrop ?? 0) !== 0
        || (posture.pelvisBack ?? 0) !== 0)) {
        const lift = (posture.pelvisLift ?? 0) - (posture.pelvisDrop ?? 0);
        pelvis.position.y += lift;
        pelvis.position.z -= posture.pelvisBack ?? 0;   // 正 = 后坐（-Z 是屁股方向）
        lower.position.y -= lift * (1 - ikWStop);
      }
      if (leanCfg) {
        const dt = Math.max(1 / 240, Math.min(frameDt, 0.1));
        const fx = Math.sin(s.bodyYaw);
        const fz = Math.cos(s.bodyYaw);
        const ax = clamp((s.velocity.x - prevVx) / dt, -60, 60);
        const az = clamp((s.velocity.z - prevVz) / dt, -60, 60);
        const along = ax * fx + az * fz;
        const turnRate = wrapAngle(s.bodyYaw - prevYaw) / dt;
        const maxF = (leanCfg.maxForwardDeg * Math.PI) / 180;
        const maxS = (leanCfg.maxSideDeg * Math.PI) / 180;
        const k = 1 - Math.exp(-Math.max(0, leanCfg.smoothing) * dt);
        leanF += (clamp(along * leanCfg.accelGain, -maxF, maxF) - leanF) * k;
        leanS += (clamp(-turnRate * speed * leanCfg.turnGain, -maxS, maxS) - leanS) * k;
        const crouchRate = Number.isFinite(leanCfg.crouchSmoothing) ? leanCfg.crouchSmoothing : 8;
        crouchSmooth += (clamp(speed / Math.max(referenceSpeed, 1e-6), 0, 1) - crouchSmooth)
          * (1 - Math.exp(-Math.max(0, crouchRate) * dt));
        const inertia = solveInertiaPose(
          { leanForward: leanF, leanSide: leanS, speedRatio: crouchSmooth }, leanCfg,
        );
        // 上身保留完整惯性倾斜；盆骨只带小比例 + 小幅重心平移 + 移动略微下沉
        // v9p：停步惯性让上身跟着微微前倾，随脉冲两端归零
        upper.rotation.x += leanF + stopChest;
        upper.rotation.z += leanS;
        pelvis.rotation.x += inertia.pelvisPitch;
        pelvis.rotation.z += inertia.pelvisRoll;
        pelvis.position.x += inertia.pelvisX;
        pelvis.position.z += inertia.pelvisZ;
        pelvis.position.y -= inertia.crouch;
        lower.position.y += inertia.crouch * (1 - ikWStop);
      }
      prevVx = s.velocity.x;
      prevVz = s.velocity.z;
      prevYaw = s.bodyYaw;

      // v8f 分层受击：上半身绕腰反应（幅度大）、骨盆后坐 + 小幅重心偏离 + 下沉、
      // 两腿屈膝吸收冲击。与主角逐项一致，仅少了 hipYaw（假人不做下盘带转）。
      upper.rotation.x += pose.upperPitch;
      upper.rotation.z += pose.upperRoll;
      upper.rotation.y += pose.upperYaw;
      // v8g：与主角同款位移限幅，避免大剑重击（knock）把假人上半身推离骨盆 / 腿
      const us = clamp(Number.isFinite(hurtCfg.upperShiftScale) ? hurtCfg.upperShiftScale : 1, 0, 1);
      const um = Number.isFinite(hurtCfg.maxUpperShift)
        ? Math.max(0, hurtCfg.maxUpperShift) : Number.POSITIVE_INFINITY;
      upper.position.x += clamp(pose.upperShiftX * us, -um, um);
      upper.position.z += clamp(pose.upperShiftZ * us, -um, um);
      pelvis.position.x += pose.comX;
      pelvis.position.z += pose.comZ - pose.pelvisBack;
      pelvis.position.y -= pose.drop;
      const ls = pose.legacy ? 0 : Math.max(0, Math.min(1, hurtCfg.lowerScale));
      lower.position.z += pose.pelvisBack * (1 - ls);
      lower.position.y += pose.drop * (1 - ls);
      legL.joint.rotation.x += pose.knee;
      legR.joint.rotation.x += pose.knee;
      legL.root.rotation.x -= pose.hip;
      legR.root.rotation.x -= pose.hip;
      armL.root.rotation.x += pose.arm;
      armR.root.rotation.x += pose.arm * 0.8;

      // v9s.64 基础体态 · 躯干与头。放在受击层之后、挥砍弧之前：
      //   ・受击是「叠在体态之上」的瞬时反应（老人被打也是弓着背挨），所以后写会覆盖前值 ——
      //     这里用 += 追加，两者自然共存；
      //   ・挥砍弧读的是手臂绝对角，体态写在前才不会让它少算一个基准俯仰。
      if (posture) {
        upper.rotation.x += posturePitch;
        headPivot.rotation.x -= posturePitch * (posture.headLift ?? 0);
        headPivot.position.z = posture.headReach ?? 0;
        headPivot.position.y = headBaseY - (posture.neckDrop ?? 0);
        // 手臂回正（与主角同一个旋钮）：假人没有脊柱分段，`upper.rotation.x` 就是
        // 手臂实际吃到的俯仰，所以这里直接用 posturePitch，不用像主角那样读胸段角。
        const armDrop = posture.armDrop ?? 0;
        if (armDrop > 0 && posturePitch > 0) {
          const back = posturePitch * armDrop;
          // v9s.66：在**模型空间**里往回压。局部 X 只在「躯干没偏航」时才指向角色左右，
          // 假人的胸随下盘带转之后局部 X 已经歪了，直接 -= 会变成斜着掰手臂。
          pitchInModelSpace(armL.root, root, -back);
          pitchInModelSpace(armR.root, root, -back);
        }
      }

      // v9s.70：髋块分担一部分躯干俯仰（与主角同一个旋钮）。放在体态块之外，
      // 受击 / 挥砍写进 `upper` 的俯仰也一起分掉 —— 否则挨打时髋块会僵在原地。
      if (hipMesh) {
        hipMesh.rotation.x = upper.rotation.x * clamp(posture?.hipShare ?? 0.45, 0, 1);
      }

      // 受击僵直时压过挥砍姿态：后仰 + 红闪优先，攻击弧隐藏
      if (s.attackPhase !== 'idle' && pose.intensity === 0) {
        const p = s.attackProgress;
        const swing = p < 0.34
          ? -1
          : p < 0.68
            ? -1 + ((p - 0.34) / 0.34) * 2
            : Math.max(0, 1 - (p - 0.68) / 0.32);
        const back = Math.max(0, -swing);
        const forth = Math.max(0, swing);
        armR.root.rotation.x = -1.7 * back + 1.25 * forth;
        armR.joint.rotation.x = -(0.25 + back * 0.45);
        upper.rotation.y = -0.28 * swing;
        arcMat.opacity = s.attackPhase === 'active' ? 0.85 : 0;
        if (s.attackPhase === 'active') arc.rotation.z = -1.1 + p * 3;
      } else {
        arcMat.opacity = 0;
      }

      // v9o：胸随下盘带转（比下盘少），与主角同构；头部反向补偿，仍朝 Core 的 headYaw。
      // 放在所有 upper 姿态写入之后、IK 之前（IK 只读 pelvis / lower，不受影响）。
      const chestYaw = chestYawFromHip(
        sideYaw, gaitCfg.chestYawScale, gaitCfg.chestYawMaxDeg,
      );
      upper.rotation.y += chestYaw;
      headYawTarget.rotation.y = ((s.headYaw - s.bodyYaw - chestYaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

      // 4) v8g 足部 IK 锚定：与主角同一套解算器，放在所有姿态层之后。
      //    enabled=false / 未传配置时整层跳过，精确回到旧 FK 姿态。
      lastIK = applyFootIK({
        root, pelvis, lower,
        limbs: ikLimbs,
        base: ikBase,
        cfg: ikCfg,
        grounded: true,
        attacking: s.attackPhase !== 'idle',
        groundY: s.position?.y,
      });
    },
    ik(): IKDiagnostics {
      return lastIK;
    },
    dispose(): void {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
    },
  };
}
