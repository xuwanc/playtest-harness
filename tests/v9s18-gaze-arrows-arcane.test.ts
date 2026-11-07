import { describe, expect, it } from 'vitest';
import { wrapAngle } from '../src/core';
import type { AppConfig } from '../src/core';
import { CONFIG, intent, makeWorld, run } from './helpers';

/**
 * v9s.18 · 接敌注视手感 + 弓箭命中归属 + 奥术飞弹散开
 *
 * 三条用户反馈的对应用例：
 *  1. 接敌时转头太快、缺俯仰、左右换目标身体不顺 → 限速 + 俯仰注视 + 注视时不播原地转身；
 *  2. 弓箭没打到人也会多人受击 → 弓箭伤害只由箭矢实体结算，一次放箭最多命中一个目标；
 *  3. 奥术先散开再收敛、错落、各自索敌、本体不自转 → Core 的待发队列 + 散开阶段。
 */

const DT = 1 / 60;
const DEG = Math.PI / 180;
const ARC = CONFIG.core.abilities.arcane;
const GAZE = CONFIG.core.gaze;

/** 把全部假人推到远处，再按坐标摆回指定假人（y 可选，用来模拟站高台）。 */
function placeOnly(
  w: ReturnType<typeof makeWorld>,
  specs: Array<[i: number, x: number, z: number, y?: number]>,
): void {
  for (const d of w.dummies) {
    d.position.x = 0;
    d.position.z = 100;
    d.position.y = 0;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  for (const [i, x, z, y = 0] of specs) {
    const d = w.dummies[i];
    d.position.x = x;
    d.position.y = y;
    d.position.z = z;
    d.mode = 'attack';
  }
}

const AIM_FRONT = intent({ aimActive: true, aimX: 0, aimZ: 1 });

describe('v9s.18 接敌注视：限速 + 俯仰', () => {
  it('左右切换主威胁：头部单帧转角不超过 maxHeadSpeedDeg', () => {
    const w = makeWorld();
    w.modules.dummies = false; // 冻结 AI，位置由测试控制（gaze 仍读位置）
    // 玩家 (0,0,8)，敌人先在左前方 -45°，再瞬移到右前方 +45°
    placeOnly(w, [[0, -3, 11]]);
    run(w, 90, AIM_FRONT); // 先让头 / 身收敛到左侧目标
    expect(w.gaze.active).toBe(true);
    expect(w.character.headYaw).toBeLessThan(-20 * DEG);

    const before = w.character.headYaw;
    placeOnly(w, [[0, 3, 11]]);
    run(w, 1, AIM_FRONT);
    const stepDeg = Math.abs(wrapAngle(w.character.headYaw - before)) / DEG;
    // 300°/s ÷ 60fps = 5°/帧；给一点浮点余量
    expect(stepDeg).toBeLessThanOrEqual(GAZE.maxHeadSpeedDeg * DT + 0.2);
    // 且确实是朝新目标的方向转，而不是原地不动
    expect(w.character.headYaw).toBeGreaterThan(before);
  });

  it('目标更高时抬头：headPitch > 0，bodyPitch 是同向的一小部分', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    // 敌人站在 1.2m 高的台阶上，正前方 2.5m
    placeOnly(w, [[0, 0, 10.5, 1.2]]);
    run(w, 90, AIM_FRONT);

    expect(w.gaze.active).toBe(true);
    expect(w.gaze.mainPitch).toBeGreaterThan(0.1);
    expect(w.character.headPitch).toBeGreaterThan(0.1);
    // 身体只是「略微」跟着俯仰：同向、明显更小
    expect(w.character.bodyPitch).toBeGreaterThan(0);
    expect(w.character.bodyPitch).toBeLessThan(w.character.headPitch * 0.6);
    // 限幅在 maxHeadPitchDeg 内
    expect(w.character.headPitch).toBeLessThanOrEqual(GAZE.maxHeadPitchDeg * DEG + 1e-6);
  });

  it('水平目标不抬头：headPitch / bodyPitch 回到 0', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, 0, 11, 0]]);
    run(w, 120, AIM_FRONT);
    expect(Math.abs(w.character.headPitch)).toBeLessThan(2 * DEG);
    expect(Math.abs(w.character.bodyPitch)).toBeLessThan(1 * DEG);
  });

  it('接敌时前方环视不播原地转身，绕到身后才触发', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, 2, 11]]); // 右前方 +34°，小于 gazeTriggerDeg
    run(w, 60, AIM_FRONT);
    expect(w.gaze.active).toBe(true);
    expect(w.turnInPlace.phase).toBe('idle');

    placeOnly(w, [[0, 0, 4]]); // 正后方（yaw = 180°）→ 超过 gazeTriggerDeg
    run(w, 30, AIM_FRONT);
    expect(w.turnInPlace.phase === 'active' || Math.abs(wrapAngle(w.character.bodyYaw - Math.PI)) < 40 * DEG)
      .toBe(true);
  });

  it('接敌身体转向也有限速：单帧不超过 maxBodySpeedDeg', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, 0, 4]]); // 正后方，需要转身
    run(w, 2, AIM_FRONT);
    expect(w.gaze.active).toBe(true);
    const before = w.character.bodyYaw;
    run(w, 1, AIM_FRONT);
    const stepDeg = Math.abs(wrapAngle(w.character.bodyYaw - before)) / DEG;
    expect(stepDeg).toBeLessThanOrEqual(GAZE.maxBodySpeedDeg * DT + 0.2);
  });
});

describe('v9s.18 弓箭：一次放箭只结算一个目标', () => {
  /** 三个假人并排站在正前方 2m（中缝 1.2m），玩家朝 +Z 满蓄一箭。 */
  function fireIntoRow(w: ReturnType<typeof makeWorld>): void {
    w.modules.targeting = false;
    // 本组只验「一次放箭」的命中归属：关掉自动连射，避免按住 1s 打出第二支
    w.config.combat.bow.autoFire = false;
    for (const d of w.dummies) {
      d.mode = 'idle';
      d.position.x = 0;
      d.position.z = 100;
    }
    w.dummies[0].position.x = -1.2; w.dummies[0].position.z = 10;
    w.dummies[1].position.x = 0; w.dummies[1].position.z = 10;
    w.dummies[2].position.x = 1.2; w.dummies[2].position.z = 10;
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 60, intent({ attackPressed: true, attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));
    run(w, 1, intent({ attackHeld: false, attackReleased: true, aimActive: true, aimX: 0, aimZ: 1 }));
  }

  it('放箭当帧不结算任何伤害（旧版 9m 扇区会把一排人全打一遍）', () => {
    const w = makeWorld();
    fireIntoRow(w);
    expect(w.arrows.length).toBe(1);
    expect(w.hitCount).toBe(0);
    expect(w.dummies.every((d) => d.hurt.type === 'none')).toBe(true);
  });

  it('箭飞行命中后只结算正对的那一个假人', () => {
    const w = makeWorld();
    fireIntoRow(w);
    // 命中当帧就检查：受击只有 0.2s，跑完 40 帧早就衰减回 none 了
    for (let i = 0; i < 40 && w.hitCount === 0; i++) run(w, 1, intent({}));
    expect(w.hitCount).toBe(1);

    const stuck = w.arrows.find((a) => a.stuck && a.stuckDummy >= 0);
    expect(stuck).toBeTruthy();
    expect(stuck!.stuckDummy).toBe(1);
    const hurt = w.dummies.map((d) => d.hurt.type !== 'none');
    expect(hurt.filter(Boolean).length).toBe(1);
    expect(hurt[1]).toBe(true);
  });

  it('插在假人身上的箭跟着假人转身（局部偏移绕 Y 旋转）', () => {
    const w = makeWorld();
    fireIntoRow(w);
    run(w, 40, intent({}));
    const ar = w.arrows.find((a) => a.stuck && a.stuckDummy === 0 || a.stuck && a.stuckDummy === 1)!;
    expect(ar).toBeTruthy();
    const d = w.dummies[ar.stuckDummy];
    const beforeDx = ar.x - d.position.x;
    const beforeDz = ar.z - d.position.z;
    const beforeYaw = ar.yaw;

    w.modules.dummies = false; // 冻结 AI，避免身体朝向被 AI 拉回去
    d.bodyYaw += Math.PI / 2;
    run(w, 1, intent({}));

    expect(Math.abs(wrapAngle(ar.yaw - beforeYaw - Math.PI / 2))).toBeLessThan(1e-6);
    expect(ar.x - d.position.x).toBeCloseTo(beforeDz, 5);
    expect(ar.z - d.position.z).toBeCloseTo(-beforeDx, 5);
  });
});

describe('v9s.18 奥术：错落 / 散开 / 各自索敌', () => {
  it('同一波错落出膛：不再同帧齐发', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 1, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));
    expect(w.abilities.projectiles.length).toBe(1); // 只出膛第一枚

    const need = Math.ceil(ARC.spawnDelay * (ARC.perWave - 1) / DT) + 1;
    run(w, need, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));
    expect(w.abilities.projectiles.length).toBeGreaterThanOrEqual(ARC.perWave);
  });

  it('先散开、再收敛：spreadTime 内保持发射角，之后才朝目标转', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    placeOnly(w, [[0, 0, 13]]); // 5m 外，留出「散开 → 收敛」的观察距离
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 1, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));

    const p0 = w.abilities.projectiles[0];
    const launch = Math.atan2(p0.dirX, p0.dirZ);
    // 散开阶段内：方向完全不变（还没开始制导）
    run(w, Math.floor(ARC.spreadTime / DT) - 2, intent({ attackHeld: true }));
    const p1 = w.abilities.projectiles[0];
    expect(Math.abs(wrapAngle(Math.atan2(p1.dirX, p1.dirZ) - launch))).toBeLessThan(1e-9);

    // 散开结束后：开始朝目标修正（角度误差变小）
    const errOf = (pr: typeof p1) => Math.abs(wrapAngle(
      Math.atan2(0 - pr.x, 13 - pr.z) - Math.atan2(pr.dirX, pr.dirZ),
    ));
    const before = errOf(p1);
    run(w, 12, intent({ attackHeld: true }));
    const p2 = w.abilities.projectiles[0];
    expect(errOf(p2)).toBeLessThan(before);
  });

  it('各自索敌：同一波的多枚飞弹会分头锁定不同目标', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    // 左右各一个，都在 homingConeDeg 内、距离相同
    placeOnly(w, [[0, -1.6, 10.5], [1, 1.6, 10.5]]);
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 1, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));
    run(w, 10, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));

    const shots = w.abilities.projectiles.slice(0, ARC.perWave);
    expect(shots.length).toBe(ARC.perWave);
    expect(shots[0].targetIndex).toBeGreaterThanOrEqual(0);
    expect(shots[1].targetIndex).toBeGreaterThanOrEqual(0);
    expect(shots[0].targetIndex).not.toBe(shots[1].targetIndex);
  });

  it('速度比 v9s.17 更慢，且同波内带浮动（错落）', () => {
    expect(ARC.speed).toBeLessThan(14);
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 1, intent({ weaponSlot: 4 }));
    run(w, 10, intent({ attackHeld: true, aimActive: true, aimX: 0, aimZ: 1 }));
    const speeds = w.abilities.projectiles.slice(0, ARC.perWave).map((p) => p.speed);
    expect(new Set(speeds.map((s) => s.toFixed(4))).size).toBeGreaterThan(1);
  });
});

describe('v9s.18 箭插骨骼：命中点落在哪根骨骼上', () => {
  async function makeRig() {
    const { readFileSync } = await import('node:fs');
    const THREE = await import('three');
    const { createDummyRig } = await import('../src/presentation/dummy-rig');
    const raw = JSON.parse(
      readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
    ) as AppConfig;
    const w = makeWorld();
    const s = w.dummies[0];
    const rig = createDummyRig(
      raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
      w.config.dummies.moveSpeed, raw.view.gait, raw.view.hurt,
    );
    rig.update(s, w.config.fixedDt);
    rig.group.updateMatrixWorld(true);
    return { THREE, rig, s, voxel: raw.view.voxel };
  }

  it('按高度选骨骼：头 / 胸 / 腿分别挂到不同节点', async () => {
    const { rig, s, voxel } = await makeRig();
    // boneAtWorld 吃世界坐标：假人在 (x,0,z)，探针要跟着偏移
    const X = s.position.x;
    const Z = s.position.z;
    const head = rig.boneAtWorld(X, voxel.legLength + voxel.bodyHeight + voxel.headSize * 0.5, Z)!;
    const chest = rig.boneAtWorld(X, voxel.legLength + voxel.bodyHeight * 0.6, Z + 0.14)!;
    const leg = rig.boneAtWorld(X + 0.12, voxel.legLength * 0.45, Z)!;

    expect(head.node.name).toBe('headPivot');
    expect(chest.node.name).toBe('upper');
    expect(['hipL', 'hipR', 'knee']).toContain(leg.node.name);
  });

  it('挂到骨骼上的物体跟骨骼一起动，且挂接瞬间世界位置不跳', async () => {
    const { THREE, rig, s, voxel } = await makeRig();
    const hit = rig.boneAtWorld(
      s.position.x, voxel.legLength + voxel.bodyHeight * 0.6, s.position.z + 0.14,
    )!;
    const obj = new THREE.Object3D();
    obj.position.set(0.04, voxel.legLength + voxel.bodyHeight * 0.6, 0.14);
    rig.group.add(obj);
    rig.group.updateMatrixWorld(true);
    const before = obj.getWorldPosition(new THREE.Vector3());

    hit.node.attach(obj);
    rig.group.updateMatrixWorld(true);
    const attached = obj.getWorldPosition(new THREE.Vector3());
    expect(attached.distanceTo(before)).toBeLessThan(1e-6);

    // 假装骨骼在摆（受击 / 转身），挂上去的物体必须跟着走
    hit.node.rotation.x += 0.5;
    rig.group.updateMatrixWorld(true);
    const swung = obj.getWorldPosition(new THREE.Vector3());
    expect(swung.distanceTo(attached)).toBeGreaterThan(0.02);
  });
});
