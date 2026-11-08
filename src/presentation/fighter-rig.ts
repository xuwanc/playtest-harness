import * as THREE from 'three';
import type {
  BalanceViewConfig, CharacterState, ColorConfig, DummyState, GaitViewConfig, HurtViewConfig,
  IKViewConfig, LeanViewConfig, LinkViewConfig, OrientationViewConfig, ProgramAnimViewConfig,
  VoxelConfig, WeaponMountConfig, WeaponWristViewConfig,
} from '../core';
import { createVoxelRig } from './voxel-rig';

/**
 * v9s.38 · 持械陪练角色的表现层适配器。
 *
 * 需求是「三个和主角一样的持剑盾 / 双刀 / 大剑 AI」。做法不是另写一套骨架，而是
 * **直接复用主角的 `voxel-rig`**：同一副体素身体、同一套武器挂点、同一套挥击剪辑。
 * 差别只在数据来源 —— 主角的状态由输入 / 战斗模块写，陪练的状态由假人 AI 写。
 *
 * 这一层负责把 `DummyState` 翻译成 `voxel-rig` 需要的 `CharacterState` + `CombatState`：
 *  - 位置 / 朝向 / 速度 / 步相 / 步幅 → `CharacterState`（假人本来就有这些字段）
 *  - `s.combat`（Core 每帧同步的 phase / attackProgress / timings）→ 挥击姿势
 *  - `s.hurt` → 分层受击（与主角同一套解算器）
 *  - `s.link` → 派生招姿态（AI 不主动起手，但状态同构，传进去不会出错）
 *
 * 外层多套一个 `group` 承担位置 + 身体朝向：`voxel-rig` 自己的 root 会被挥击的
 * 「整体带转 / 整圈旋转」占用（`root.rotation.y = rootTurn`），两者叠加不能共用一个节点。
 */
/** 陪练步态读数：直接复用主角骨架的 gaitDebug 返回类型，避免两处字段漂移。 */
export type FighterGaitDebug = ReturnType<ReturnType<typeof createVoxelRig>['gaitDebug']>;

export type FighterRig = {
  group: THREE.Group;
  update(s: DummyState, frameDt: number, coreTime: number): void;
  /** 箭插在陪练身上时挂到最近的身体段（与 dummy-rig 同语义，粒度粗一点但够用）。 */
  boneAtWorld(x: number, y: number, z: number): { node: THREE.Object3D; point: THREE.Vector3 } | null;
  /** v9s.40：陪练的步态读数（与玩家同一套 gaitDebug），用于验收「对峙时腿是否在抖」。 */
  debug(): FighterGaitDebug;
  dispose(): void;
};

export type FighterRigConfig = {
  voxel: VoxelConfig;
  colors: ColorConfig;
  moveSpeed: number;
  orientation: OrientationViewConfig;
  gait: GaitViewConfig;
  mount: WeaponMountConfig;
  lean: LeanViewConfig;
  hurt: HurtViewConfig;
  animation: ProgramAnimViewConfig;
  ik?: IKViewConfig;
  links?: LinkViewConfig;
  wrist?: WeaponWristViewConfig;
  balance?: BalanceViewConfig;
};

export function createFighterRig(cfg: FighterRigConfig): FighterRig {
  const rig = createVoxelRig(
    cfg.voxel, cfg.colors, cfg.moveSpeed, cfg.orientation, cfg.gait, cfg.mount,
    cfg.lean, cfg.hurt, cfg.animation, cfg.ik, cfg.links, cfg.wrist, cfg.balance,
  );
  const group = new THREE.Group();
  group.add(rig.group);

  // 复用同一个对象：每帧只改字段，不分配（3 个陪练 × 60fps）
  const cs: CharacterState = {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    facing: 0,
    moveYaw: 0,
    bodyYaw: 0,
    headYaw: 0,
    headPitch: 0,
    bodyPitch: 0,
    grounded: true,
    sprinting: false,
    gaitPhase: 0,
    stride: 1,
    distance: 0,
    coyoteTime: 0,
    jumpBuffer: 0,
  };

  // 插箭用的身体段：头 / 胸 / 骨盆。名字由 voxel-rig 保证（不依赖 children 下标）。
  const attachNodes: THREE.Object3D[] = [];
  for (const name of ['headPivot', 'chest', 'torsoUpper', 'torso', 'pelvis']) {
    const n = rig.group.getObjectByName(name);
    if (n) attachNodes.push(n);
  }

  return {
    group,
    update(s, frameDt, coreTime): void {
      cs.position.x = s.position.x;
      cs.position.y = s.position.y;
      cs.position.z = s.position.z;
      // v9s.40：**不要把击退并进 velocity**。Core 的击退只加到 position，骨架会自己按
      // `hurt.knockX × gaitCfg.knockGaitScale` 并入步态驱动；这里再叠一次就是双计 ——
      // 陪练被击中时步频翻倍、腿在原地飞快倒腾（玩家读作「磨脚」），而且停步门控拿到的
      // 也不是「自主移动速度」。位置仍用 s.position（已含击退位移）。
      cs.velocity.x = s.velocity.x;
      cs.velocity.y = s.velocity.y;
      cs.velocity.z = s.velocity.z;
      cs.facing = s.facing;
      cs.moveYaw = Math.atan2(cs.velocity.x, cs.velocity.z);
      cs.bodyYaw = s.bodyYaw;
      cs.headYaw = s.headYaw;
      cs.gaitPhase = s.gaitPhase;
      cs.stride = s.stride;
      cs.distance = s.distance;
      // 陪练不跳、不冲刺：两者恒为 false / true，骨架的落地缓冲与冲刺姿态自然不触发
      cs.grounded = true;
      cs.sprinting = false;

      // 外层节点承担「世界位置 + 身体朝向」；voxel-rig 自己的 root 只负责挥击带转。
      group.position.set(s.position.x, s.position.y, s.position.z);
      group.rotation.y = s.bodyYaw;

      // combat 一定存在（由 dummies.ts 在创建时装配）；缺省时退回待机姿态
      if (s.combat) {
        rig.update(cs, s.combat, s.hurt, frameDt, false, coreTime, s.link);
      }
    },
    debug(): FighterGaitDebug {
      return rig.gaitDebug();
    },
    boneAtWorld(x, y, z): { node: THREE.Object3D; point: THREE.Vector3 } | null {
      if (attachNodes.length === 0) return null;
      const p = new THREE.Vector3(x, y, z);
      const tmp = new THREE.Vector3();
      let best: THREE.Object3D | null = null;
      let bestD = Number.POSITIVE_INFINITY;
      for (const n of attachNodes) {
        n.updateWorldMatrix(true, false);
        n.getWorldPosition(tmp);
        const d = tmp.distanceToSquared(p);
        if (d < bestD) { bestD = d; best = n; }
      }
      return best ? { node: best, point: p } : null;
    },
    dispose(): void {
      rig.dispose();
    },
  };
}
