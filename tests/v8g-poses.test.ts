import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type {
  AppConfig, HurtState, HurtViewConfig, IKViewConfig, LeanViewConfig, ProgramAnimViewConfig,
} from '../src/core';

/**
 * v8g #2 / #3 / #4 验收：
 *  - 大剑重击时身体不再离开腿（骨盆跨步收敛 + 上半身位移限幅，IK 钉脚）
 *  - 肘关节朝身前折（修「反关节」）
 *  - 惯性倾斜带盆骨偏移 + 移动时略微下沉
 */
const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const IK_ON: IKViewConfig = { ...raw.view.ik, enabled: true, weight: 1 };
const IK_OFF: IKViewConfig = { ...IK_ON, enabled: false };
const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0, // -1e9 = 从未受击
};

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function playerRig(opts: {
  lean?: LeanViewConfig; hurt?: HurtViewConfig; anim?: ProgramAnimViewConfig; ik?: IKViewConfig;
} = {}): VoxelRig {
  const w = makeWorld();
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount,
    opts.lean ?? raw.view.lean, opts.hurt ?? raw.view.hurt,
    opts.anim ?? raw.view.animation, opts.ik ?? IK_OFF,
  );
}

function elbows(rig: { group: any }): THREE.Object3D[] {
  return ['shoulderL', 'shoulderR'].map((n) => {
    const s = rig.group.getObjectByName(n);
    const e = s && s.getObjectByName('elbow');
    if (!e) throw new Error(`骨架缺少 ${n}/elbow 命名节点`);
    return e;
  });
}

describe('v8g #3 肘关节朝身前折（不再是反关节）', () => {
  it('静止 / 移动 / 空中：所有肘角 < 0，且局部前臂末端指向 +Z（身前）', () => {
    const w = makeWorld();
    const rig = playerRig();
    const armLen = raw.view.voxel.armLength;
    const check = (tag: string): void => {
      for (const e of elbows(rig)) {
        expect(e.rotation.x as number, tag).toBeLessThan(0);
        e.updateMatrix();
        // elbow 局部矩阵（相对 shoulder）： forearm 末端 (0, -armLen/2, 0)
        const tip = new THREE.Vector3(0, -armLen / 2, 0).applyMatrix4(e.matrix);
        expect(tip.z, tag).toBeGreaterThan(0); // 前臂朝 +Z 折，不是往 -Z 反折
      }
    };
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    check('idle');
    const go = intent({ moveZ: 1 });
    for (let i = 0; i < 20; i++) {
      run(w, 1, go);
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    check('move');
    w.character.grounded = false;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    check('air');
  });

  it('弓蓄力 / 大剑挥击 / 法杖引导：肘依然朝前折', () => {
    const w = makeWorld();
    const rig = playerRig();
    // 弓蓄力
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 1, intent({ attackPressed: true, attackHeld: true }));
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    for (const e of elbows(rig)) expect((e.rotation.x as number)).toBeLessThan(0);

    // 大剑挥击
    const w2 = makeWorld();
    const rig2 = playerRig();
    run(w2, 1, intent({ weaponSlot: 3 }));
    run(w2, 1, intent({ attackPressed: true }));
    for (let i = 0; i < 30; i++) {
      run(w2, 1, intent());
      rig2.update(w2.character, w2.combat, NONE, w2.config.fixedDt, false, w2.time);
      for (const e of elbows(rig2)) expect((e.rotation.x as number)).toBeLessThan(0);
    }
  });

  it('假人肘关节同步修正（玩家 / 假人同构）', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const rig = createDummyRig(
      raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
      w.config.dummies.moveSpeed, raw.view.gait, raw.view.hurt, raw.view.lean, IK_OFF,
    );
    rig.update(s, w.config.fixedDt);
    for (const e of elbows(rig)) expect((e.rotation.x as number)).toBeLessThan(0);
    rig.dispose();
  });
});

describe('v8g #4 惯性倾斜带盆骨偏移 + 移动略微下沉', () => {
  it('加速时盆骨与上身同向倾斜，但幅度明显小于上身（只带一点）', () => {
    const w = makeWorld();
    const rig = playerRig();
    const go = intent({ moveZ: 1 });
    let saw = false;
    for (let i = 0; i < 12; i++) {
      run(w, 1, go);
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const n = rigNodes(rig);
      const f = rig.lean().forward;
      if (f > 0.02) {
        saw = true;
        expect(n.pelvis.rotation.x as number).toBeGreaterThan(0);
        expect(n.upper.rotation.x as number).toBeGreaterThan(0);
        expect(Math.abs(n.pelvis.rotation.x as number))
          .toBeLessThan(Math.abs(n.upper.rotation.x as number) * 0.6);
        expect(Math.abs(n.pelvis.rotation.x as number)).toBeLessThan(0.1);
      }
    }
    expect(saw).toBe(true);
  });

  it('移动时盆骨略微下沉：与 moveCrouch=0 的对照逐帧低约一个 crouch，且平滑无跳变', () => {
    const w = makeWorld();
    const leanOn = clone(raw.view.lean);
    const leanOff = clone(raw.view.lean);
    leanOff.moveCrouch = 0;
    const a = playerRig({ lean: leanOn });
    const b = playerRig({ lean: leanOff });
    const go = intent({ moveZ: 1 });
    let prevDiff = 0;
    let maxJump = 0;
    let maxDiff = 0;
    for (let i = 0; i < 80; i++) {
      run(w, 1, go);
      a.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      b.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const diff = (rigNodes(b).pelvis.position.y as number)
        - (rigNodes(a).pelvis.position.y as number);
      maxDiff = Math.max(maxDiff, diff);
      maxJump = Math.max(maxJump, Math.abs(diff - prevDiff));
      prevDiff = diff;
    }
    expect(maxDiff).toBeGreaterThan(0.02);                       // 确实沉下去了
    expect(maxDiff).toBeLessThanOrEqual(raw.view.lean.moveCrouch + 1e-6);
    expect(maxJump).toBeLessThan(0.01);                          // 指数平滑，不抽动
  });

  it('静止时下沉自动回到 0，不残留', () => {
    const w = makeWorld();
    const a = playerRig({ lean: clone(raw.view.lean) });
    const b = playerRig({ lean: Object.assign(clone(raw.view.lean), { moveCrouch: 0 }) });
    const go = intent({ moveZ: 1 });
    for (let i = 0; i < 40; i++) {
      run(w, 1, go);
      a.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      b.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    const stop = intent();
    for (let i = 0; i < 90; i++) {
      run(w, 1, stop);
      a.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      b.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    expect(Math.abs((rigNodes(b).pelvis.position.y as number)
      - (rigNodes(a).pelvis.position.y as number))).toBeLessThan(0.002);
  });
});

describe('v8g #2 大剑重击时身体不再离开腿', () => {
  it('大剑连击：骨盆跨步位移有界（收敛后远小于旧版 0.17/0.14）', () => {
    const w = makeWorld();
    const rig = playerRig({ ik: IK_ON });
    run(w, 1, intent({ weaponSlot: 3 }));
    run(w, 1, intent({ attackPressed: true }));
    let maxZ = 0;
    let maxX = 0;
    let sawAttack = false;
    for (let i = 0; i < 120; i++) {
      run(w, 1, intent());
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      if (w.combat.phase !== 'idle') sawAttack = true;
      const p = rigNodes(rig).pelvis.position;
      maxZ = Math.max(maxZ, Math.abs(p.z as number));
      maxX = Math.max(maxX, Math.abs(p.x as number));
    }
    expect(sawAttack).toBe(true);
    expect(maxZ).toBeLessThan(0.13);
    expect(maxX).toBeLessThan(0.12);
  });

  it('A/B：heavyScale=1 且跨步幅度调回旧值时，骨盆位移明显更大', () => {
    const sample = (anim: ProgramAnimViewConfig): number => {
      const w = makeWorld();
      const rig = playerRig({ anim, ik: IK_OFF });
      run(w, 1, intent({ weaponSlot: 3 }));
      run(w, 1, intent({ attackPressed: true }));
      let maxZ = 0;
      for (let i = 0; i < 120; i++) {
        run(w, 1, intent());
        rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
        maxZ = Math.max(maxZ, Math.abs(rigNodes(rig).pelvis.position.z as number));
      }
      return maxZ;
    };
    const now = sample(clone(raw.view.animation));
    const legacy = sample(Object.assign(clone(raw.view.animation), {
      stride: Object.assign(clone(raw.view.animation.stride), {
        stepReach: 0.17, stepSideReach: 0.14, stepDipReach: 0.05, heavyScale: 1,
      }),
    }));
    expect(legacy).toBeGreaterThan(now * 1.5);
  });

  it('knock 受击（大剑击退）：上半身相对骨盆位移被限幅，躯干始终连着骨盆', () => {
    const h: HurtState = {
      lastAt: 0, type: 'knock', timer: 0.21, duration: 0.42,
      dirX: 0, dirZ: -1, knockX: 0, knockZ: 0,
    };
    const w = makeWorld();
    const rig = playerRig({ ik: IK_ON });
    rig.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
    const n = rigNodes(rig);
    const shift = Math.hypot(n.upper.position.x as number, n.upper.position.z as number);
    expect(shift).toBeLessThanOrEqual(raw.view.hurt.maxUpperShift + 1e-9);
    expect(shift).toBeGreaterThan(0.02);            // 反应仍在，不是直接砍成 0
    expect(rig.hurt().upperShift).toBeGreaterThan(shift); // 诊断量保留原始幅度
    expect(n.upper.position.y as number).toBe(0);  // 上半身不脱离骨盆高度
  });

  it('A/B：关掉位移限幅后，上半身被推出远超 0.1m（正是旧版「身体离开腿」）', () => {
    const h: HurtState = {
      lastAt: 0, type: 'knock', timer: 0.21, duration: 0.42,
      dirX: 0, dirZ: -1, knockX: 0, knockZ: 0,
    };
    const hu = Object.assign(clone(raw.view.hurt), {
      upperShiftScale: 1, maxUpperShift: Number.POSITIVE_INFINITY,
    });
    const w = makeWorld();
    const rig = playerRig({ hurt: hu, ik: IK_OFF });
    rig.update(w.character, w.combat, h, w.config.fixedDt, false, w.time);
    const n = rigNodes(rig);
    expect(Math.abs(n.upper.position.z as number)).toBeGreaterThan(0.2);
  });

  it('假人同构：knock 受击也限位，且 IK 让脚仍踩在地面附近', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    s.bodyYaw = 0;
    s.hurt = {
      lastAt: 0, type: 'knock', timer: 0.21, duration: 0.42,
      dirX: 0, dirZ: -1, knockX: 0, knockZ: 0,
    };
    const rig = createDummyRig(
      raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
      w.config.dummies.moveSpeed, raw.view.gait, raw.view.hurt, raw.view.lean, IK_ON,
    );
    rig.update(s, w.config.fixedDt);
    const n = rigNodes(rig);
    expect(Math.hypot(n.upper.position.x as number, n.upper.position.z as number))
      .toBeLessThanOrEqual(raw.view.hurt.maxUpperShift + 1e-9);
    expect(rig.ik().active).toBe(true);
    expect(rig.ik().maxError).toBeLessThan(0.02);
    rig.dispose();
  });
});
