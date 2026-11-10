import * as THREE from 'three';
import type { IKViewConfig } from '../core';
import { blendIKAngles, solveTwoBoneIK } from './ik';
import { lockModelRotation, quatParentInModel } from './rig-space';

/**
 * 足部 IK 锚定的 THREE 适配层（v8g）。
 *
 * 纯数学在 ik.ts（零 THREE），这里只做「世界锚点 ↔ 骨架节点」的搬运，玩家与假人共用：
 *
 *  1) 先把骨盆 / 下盘临时恢复到「基准变换」（步态层刚写完、还没被受击 / 落地 /
 *     攻击跨步 / 惯性层推走时的状态），此时腿的 FK 角度保持本帧最终值；
 *  2) 取两脚末端（footTip）的世界坐标作为锚点 —— 这就是「如果骨盆没被额外推走，
 *     脚应该踩在哪」；
 *  3) 恢复本帧真实变换，把锚点转回下盘局部坐标，用两骨 IK 反解髋 / 膝角并按权重写回。
 *
 * 于是「程序动画随便推骨盆，脚大体钉在原地」，且当额外变换为 0 时 IK 解恰好等于
 * 原 FK 角度（恒等，可单测）。悬浮 / 跳跃时整层跳过，脚随身体收起。
 *
 * 所有中间量都是临时矩阵运算，不写 World / Intents / 快照，不引入本地时间。
 */

export type IKLimb = {
  /** 根关节（hip），rotation.order 必须为 'ZYX' */
  root: THREE.Group;
  /** 中间关节（knee），只有 rotation.x */
  joint: THREE.Group;
  /** 末端标记（小腿末端），用于取世界锚点 */
  tip: THREE.Object3D;
  /**
   * v9s.66：踝关节（脚掌的父节点，挂在 knee 末端）。给出时 IK 会做「脚锁」：
   * 髋 / 膝被反解完之后，把踝的**模型空间**朝向拧回 IK 之前 —— 否则脚掌会跟着
   * 小腿一起被拧，读作「脚在地上打滑 / 掰脚腕」。缺省（老骨架）时退化为旧行为。
   */
  ankle?: THREE.Object3D;
  upperLen: number;
  lowerLen: number;
  bend: 1 | -1;
};

/** 步态层刚结束时的骨盆 / 下盘变换，作为「未被额外程序动画推移」的基准。 */
export type IKBase = {
  pelvisPos: THREE.Vector3;
  pelvisRotX: number;
  pelvisRotZ: number;
  lowerPos: THREE.Vector3;
  lowerRotZ: number;
};

export function captureIKBase(pelvis: THREE.Group, lower: THREE.Group): IKBase {
  return {
    pelvisPos: pelvis.position.clone(),
    pelvisRotX: pelvis.rotation.x,
    pelvisRotZ: pelvis.rotation.z,
    lowerPos: lower.position.clone(),
    lowerRotZ: lower.rotation.z,
  };
}

export type IKDiagnostics = {
  /** 本帧是否真的跑了 IK */
  active: boolean;
  /** 实际采用的权重 */
  weight: number;
  /** 目标超出臂展、被夹取的腿数 */
  clamped: number;
  /** IK 后脚位与锚点的最大偏差（m） */
  maxError: number;
};

export const EMPTY_IK_DIAGNOSTICS: IKDiagnostics = {
  active: false, weight: 0, clamped: 0, maxError: 0,
};

export type FootIKInput = {
  /** rig.group（或其任意祖先）：用于刷新整棵骨架的世界矩阵 */
  root: THREE.Object3D;
  pelvis: THREE.Group;
  lower: THREE.Group;
  limbs: IKLimb[];
  base: IKBase;
  cfg: IKViewConfig;
  /** 落地才钉脚；空中让腿随身体收起 */
  grounded: boolean;
  /** 攻击期间权重乘 attackScale，给跨步留余地 */
  attacking: boolean;
  /**
   * 脚下地面高度（世界 y）。锚点低于它时会被顶到地面上。
   *
   * 为什么需要：这套 IK 的契约是「把脚钉在**基准变换下的脚位**」，它不判断那个位置
   * 合不合理。而 FK 给出的脚位本身就可能在地面以下（落地缓冲压低骨盆、步态滞后、
   * 站在地块边缘时基准高度差一点），于是 IK 忠实地把脚钉在地里 —— 越钉越沉，
   * 读作「脚掌穿地」。这里只做下限兜底，正常帧锚点就贴地，结果与原来一致。
   */
  groundY?: number;
};

export function applyFootIK(input: FootIKInput): IKDiagnostics {
  const { root, pelvis, lower, limbs, base, cfg } = input;
  if (!cfg.enabled || cfg.weight <= 0 || !input.grounded || limbs.length === 0) {
    return { ...EMPTY_IK_DIAGNOSTICS };
  }

  // 1) 记下本帧真实变换，临时恢复基准（只动会被上层程序动画改写的位置 / 倾角）
  const current = {
    pelvisPos: pelvis.position.clone(),
    pelvisRotX: pelvis.rotation.x,
    pelvisRotZ: pelvis.rotation.z,
    lowerPos: lower.position.clone(),
    lowerRotZ: lower.rotation.z,
  };
  pelvis.position.copy(base.pelvisPos);
  pelvis.rotation.x = base.pelvisRotX;
  pelvis.rotation.z = base.pelvisRotZ;
  lower.position.copy(base.lowerPos);
  lower.rotation.z = base.lowerRotZ;

  // 2) 基准变换下取两脚锚点（腿 FK 角度保持本帧最终值，跨步 / 屈膝 / 抬膝都保留）
  root.updateWorldMatrix(true, true);
  const anchors = limbs.map((limb) => limb.tip.getWorldPosition(new THREE.Vector3()));
  // 地板兜底：锚点只有**低于**地面时才被顶上来。抬脚 / 迈步帧锚点在地面之上，
  // 这行不会动它 —— 所以「脚抬起」与「脚贴地」的原有语义都不变。
  const groundY = input.groundY;
  if (groundY !== undefined && Number.isFinite(groundY)) {
    for (const a of anchors) {
      if (a.y < groundY) a.y = groundY;
    }
  }

  // 3) 恢复真实变换
  pelvis.position.copy(current.pelvisPos);
  pelvis.rotation.x = current.pelvisRotX;
  pelvis.rotation.z = current.pelvisRotZ;
  lower.position.copy(current.lowerPos);
  lower.rotation.z = current.lowerRotZ;
  root.updateWorldMatrix(true, true);
  lower.updateWorldMatrix(true, false);

  const weight = Math.max(0, Math.min(1, cfg.weight))
    * (input.attacking ? Math.max(0, Math.min(1, cfg.attackScale)) : 1);
  const maxCorrection = (Math.max(0, cfg.maxCorrectionDeg) * Math.PI) / 180;
  let clamped = 0;

  // 脚锁的参考朝向：此刻髋 / 膝还是本帧的 FK 值。**只取踝的父链**，不含踝自己的局部旋转 ——
  // 否则上一帧写进去的补偿会被当成「基准」，逐帧累加，脚腕会一直往里拧。
  // 契约：踝节点的局部旋转归 IK 独占，其它层不要写它。
  const footRest = limbs.map((limb) => (limb.ankle ? quatParentInModel(limb.ankle, root) : null));

  for (let i = 0; i < limbs.length; i++) {
    const limb = limbs[i];
    // 锚点转到下盘局部；再减去 hip 的固定局部位置 → 相对 hip 原点（未旋转）的目标向量
    const local = lower.worldToLocal(anchors[i].clone());
    const target = {
      x: local.x - limb.root.position.x,
      y: local.y - limb.root.position.y,
      z: local.z - limb.root.position.z,
    };
    const sol = solveTwoBoneIK(target, limb.upperLen, limb.lowerLen, limb.bend);
    if (sol.clamped) clamped += 1;
    const angles = blendIKAngles(
      {
        rootPitch: limb.root.rotation.x,
        rootRoll: limb.root.rotation.z,
        jointPitch: limb.joint.rotation.x,
      },
      sol,
      weight,
      maxCorrection,
    );
    limb.root.rotation.x = angles.rootPitch;
    limb.root.rotation.z = angles.rootRoll;
    limb.joint.rotation.x = angles.jointPitch;
    // 脚锁放在最后：髋 / 膝的新角度已经在链上，此刻算出来的局部四元数才把「被拧掉的那部分」抵消掉。
    if (footRest[i] && limb.ankle) {
      lockModelRotation(limb.ankle, root, footRest[i]!, weight);
    }
  }

  // 4) 诊断：钉地后脚位与锚点的残差（权重 1 且目标可达时应趋近 0）
  root.updateWorldMatrix(true, true);
  let maxError = 0;
  for (let i = 0; i < limbs.length; i++) {
    const p = limbs[i].tip.getWorldPosition(new THREE.Vector3());
    maxError = Math.max(maxError, p.distanceTo(anchors[i]));
  }
  return { active: true, weight, clamped, maxError };
}
