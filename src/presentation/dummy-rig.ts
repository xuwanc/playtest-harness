import * as THREE from 'three';
import { wrapAngle } from '../core';
import type {
  ColorConfig, DummyMode, DummyState, DummyViewConfig, GaitViewConfig, HurtViewConfig,
  IKViewConfig, LeanViewConfig, VoxelConfig,
} from '../core';
import { solveGait } from './gait';
import { solveHurtPose } from './hurt-pose';
import { solveInertiaPose } from './inertia';
import { applyFootIK, captureIKBase, EMPTY_IK_DIAGNOSTICS } from './rig-ik';
import type { IKDiagnostics, IKLimb } from './rig-ik';

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export type DummyRig = {
  group: THREE.Group;
  /** 姿态完全由 Core 状态驱动，无本地时间累积（flash 除外，纯视觉衰减）。 */
  update(s: DummyState, frameDt: number): void;
  /** v8g：本帧足部 IK 锚定读数（与主角同构，不进 Core / 快照）。 */
  ik(): IKDiagnostics;
  dispose(): void;
};

const MODE_LABEL: Record<DummyMode, string> = {
  idle: 'IDLE',
  wander: 'WANDER',
  follow: 'FOLLOW',
  'keep-distance': 'KEEP DIST',
  attack: 'ATTACK',
};

/**
 * 简化版体素假人：3 头身、髋/膝与肩/肘关节、无蒙皮、无武器。
 * 与玩家共用同一套步态相位，靠配色 + 头顶精灵标签区分。
 * 标签用 CanvasTexture 画短英文，避免跨环境中文字体缺失导致方块。
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

  const H = v.headSize;
  const legLen = v.legLength;
  const armLen = v.armLength;
  const t = v.limbThickness;
  const bodyH = v.bodyHeight;
  const bodyW = v.bodyWidth;

  const torso = mk(bodyW, bodyH, 0.28, tint);
  torso.position.y = bodyH / 2;                 // 相对骨盆
  upper.add(torso);

  // 头部独立枢轴：绕脖子旋转，实现「头先于身体转向目标」（与主角一致，v7b#9）
  const headPivot = new THREE.Group();
  headPivot.position.y = bodyH;                  // 相对骨盆（脖子在躯干顶）
  upper.add(headPivot);

  // 头也用该假人的专属色：2.5D 俯视角主要看到头顶，这样四个假人一眼可分辨
  const head = mk(H, H, H, tint);
  head.position.y = H / 2;
  headPivot.add(head);

  // 眼睛贴在 +Z 面，用来验收朝向
  for (const sx of [-1, 1]) {
    const eye = mk(0.06, 0.07, 0.02, colors.shoe);
    eye.position.set(sx * 0.09, H / 2 + 0.03, H / 2 + 0.011);
    headPivot.add(eye);
  }

  type Limb = { root: THREE.Group; joint: THREE.Group; tip?: THREE.Object3D };
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

    const upperSeg = mk(t, len / 2, t, colors.limb);
    upperSeg.position.y = -len / 4;
    jointRoot.add(upperSeg);

    const joint = new THREE.Group();
    joint.name = isArm ? 'elbow' : 'knee';
    joint.position.y = -len / 2;
    jointRoot.add(joint);

    const lowerSeg = mk(t, len / 2, t, colors.limb);
    lowerSeg.position.y = -len / 4;
    joint.add(lowerSeg);

    if (!isArm) {
      const shoe = mk(t * 1.15, 0.07, t * 1.7, colors.shoe);
      shoe.position.set(0, -len / 2 + 0.035, 0.045);
      joint.add(shoe);
      // 小腿末端锚点（不含鞋的视觉偏移），FK / IK 精确互逆
      const tip = new THREE.Object3D();
      tip.name = 'footTip';
      tip.position.y = -len / 2;
      joint.add(tip);
      return { root: jointRoot, joint, tip };
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

  // 头顶标签
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 72;
  const ctx = canvas.getContext('2d');
  const labelTex = new THREE.CanvasTexture(canvas);
  const labelMat = new THREE.SpriteMaterial({
    map: labelTex,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const label = new THREE.Sprite(labelMat);
  label.scale.set(1.85, 0.52, 1);
  label.position.y = 1.7 - legLen;                  // 相对骨盆
  label.renderOrder = 20;
  upper.add(label);

  function drawLabel(mode: DummyMode): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, 256, 72);
    ctx.fillStyle = view.labelBg;
    ctx.fillRect(0, 0, 256, 72);
    ctx.strokeStyle = tint;
    ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, 250, 66);
    ctx.fillStyle = tint;
    ctx.font = 'bold 29px ui-monospace, Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${id} ${MODE_LABEL[mode]}`, 128, 38);
    labelTex.needsUpdate = true;
  }

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

  return {
    group: root,
    update(s, frameDt): void {
      root.position.set(s.position.x, s.position.y, s.position.z);
      // 身体用平滑朝向（bodyYaw），头相对身体再补一个差值，实现头身分离（v7b#9）
      root.rotation.y = s.bodyYaw;
      headPivot.rotation.y = ((s.headYaw - s.bodyYaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

      // 模式变化：重绘标签 + 一次短暂高亮，给点击一个明确反馈
      if (s.mode !== lastMode) {
        lastMode = s.mode;
        drawLabel(s.mode);
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

      // 与玩家共用同一套程序化步态解算器（v8）：怪物侧移 / 后退时也有方向自适应
      // 的腿摆、交叉步与抬膝，承接 #9「怪物也要像主角一样的动画机制」。
      const speed = Math.hypot(s.velocity.x, s.velocity.z);
      const fwdX = Math.sin(s.bodyYaw);
      const fwdZ = Math.cos(s.bodyYaw);
      const rightX = Math.cos(s.bodyYaw);
      const rightZ = -Math.sin(s.bodyYaw);
      const gait = solveGait({
        phase: s.gaitPhase,
        speed,
        moveSpeed: referenceSpeed,
        localForward: s.velocity.x * fwdX + s.velocity.z * fwdZ,
        localRight: s.velocity.x * rightX + s.velocity.z * rightZ,
        legLength: v.legLength,
        stride: s.stride,
        grounded: true,
      }, gaitCfg);

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
      pelvis.rotation.z = gait.pelvisRoll;
      upper.rotation.z = gait.sideLean * (pose.intensity > 0 ? 0.4 : 1);

      // ---- v8g：IK 基准 + 惯性分层（与主角完全同构）----
      // 基准 = 步态刚写完、还没被受击 / 惯性层推走的骨盆 / 下盘；末尾 IK 把差值
      // 吸收进髋膝角，假人被打得后仰 / 后坐时脚仍踩在原地。
      const ikBase = captureIKBase(pelvis, lower);
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
        upper.rotation.x += leanF;
        upper.rotation.z += leanS;
        pelvis.rotation.x += inertia.pelvisPitch;
        pelvis.rotation.z += inertia.pelvisRoll;
        pelvis.position.x += inertia.pelvisX;
        pelvis.position.z += inertia.pelvisZ;
        pelvis.position.y -= inertia.crouch;
        const ikW = ikConfig.enabled ? clamp(ikConfig.weight, 0, 1) : 0;
        lower.position.y += inertia.crouch * (1 - ikW);
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

      // 4) v8g 足部 IK 锚定：与主角同一套解算器，放在所有姿态层之后。
      //    enabled=false / 未传配置时整层跳过，精确回到旧 FK 姿态。
      lastIK = applyFootIK({
        root, pelvis, lower,
        limbs: ikLimbs,
        base: ikBase,
        cfg: ikConfig,
        grounded: true,
        attacking: s.attackPhase !== 'idle',
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
      labelTex.dispose();
      labelMat.dispose();
    },
  };
}
