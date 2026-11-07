import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { createDummyRig } from '../src/presentation/dummy-rig';
import { stopBlendGate, chestYawFromHip } from '../src/presentation/gait';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeQuietWorld, makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import { MECH_GAIT } from './mech-gait';
import type { AppConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

// 最小 DOM stub：createDummyRig 用 CanvasTexture 画标签，getContext 为 null 时直接跳过
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

function makeRig(moveSpeed: number): VoxelRig {
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, moveSpeed,
    raw.view.orientation, MECH_GAIT, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation,
  );
}

function angleDelta(a: number, b: number): number {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

const legMag = (d: ReturnType<VoxelRig['gaitDebug']>): number =>
  Math.abs(d.legLPitch) + Math.abs(d.legLRoll)
  + Math.abs(d.legRPitch) + Math.abs(d.legRRoll);

/* -------------------------------------------------------------------------- *
 * 纯函数门控：v9n 只看速度区间，会把「低速巡航」误判成停步
 * -------------------------------------------------------------------------- */
describe('v9o 停步收相门控：只认减速趋零，不认低速巡航', () => {
  const ref = 4.2;
  const enter = MECH_GAIT.stopEnterRatio;   // 0.08 → 0.336 m/s
  const exit = MECH_GAIT.stopExitRatio;     // 0.18 → 0.756 m/s

  it('稳定低速巡航：不进入收相，且速度高于退出阈值时直接复位', () => {
    const gate = stopBlendGate(1.2, 1.2, ref, enter, exit);
    expect(gate.enter).toBe(false);
    expect(gate.resume).toBe(true);
  });

  it('稳定超低速巡航（速度已落在进入区间）：靠「没有减速趋势」挡住并复位收相', () => {
    // 这是 v9n 的翻车点：0.25 m/s < 50% 移速，旧逻辑会走完收相并输出 idle
    const gate = stopBlendGate(0.25, 0.25, ref, enter, exit);
    expect(gate.enter).toBe(false);
    // 已经稳定在低速 = 玩家还在走，任何残留的收相都要立刻撤销
    expect(gate.resume).toBe(true);
  });

  it('高速切轻推：中途减速会短暂满足 enter，但速度稳定后必须撤销收相', () => {
    // 线上实测的第二个坑：从 1.05 m/s 减到 0.25 m/s 的过程中会启动收相，
    // 若在进入后不再判定，收相走完就永远停在 idle（腿静止、身体继续平移）。
    expect(stopBlendGate(0.30, 0.38, ref, enter, exit).enter).toBe(true); // 减速段：确实会启动
    expect(stopBlendGate(0.30, 0.38, ref, enter, exit).resume).toBe(false);
    expect(stopBlendGate(0.25, 0.25, ref, enter, exit).resume).toBe(true); // 稳定段：撤销
  });

  it('松手减速末端（几乎不动）仍保持收相，不会被误当成稳定巡航', () => {
    expect(stopBlendGate(0.02, 0.02, ref, enter, exit).resume).toBe(false);
    expect(stopBlendGate(0, 0, ref, enter, exit).resume).toBe(false);
  });

  it('松手减速（每帧约 -20%）进入收相；重新加速立即退出', () => {
    expect(stopBlendGate(0.25, 0.32, ref, enter, exit).enter).toBe(true);
    expect(stopBlendGate(0.30, 0.25, ref, enter, exit).resume).toBe(true);
  });

  it('高速减速不进入（还没慢下来），完全静止也不需要收相', () => {
    expect(stopBlendGate(2.0, 2.5, ref, enter, exit).enter).toBe(false);
    expect(stopBlendGate(0, 0, ref, enter, exit).enter).toBe(false);
  });

  it('阈值随参考移速缩放（假人移速更低也成立）', () => {
    const slow = 2.6;
    expect(stopBlendGate(0.20, 0.25, slow, enter, exit).enter).toBe(true);
    expect(stopBlendGate(0.30, 0.30, slow, enter, exit).enter).toBe(false);
  });
});

describe('v9o 胸偏转纯函数：比例、符号与限幅', () => {
  it('按配置比例跟随且左右对称', () => {
    expect(chestYawFromHip(0.6, 0.45, 32)).toBeCloseTo(0.27, 6);
    expect(chestYawFromHip(-0.6, 0.45, 32)).toBeCloseTo(-0.27, 6);
  });

  it('比例 0 = 关闭；过大 hipYaw 被上限钳住', () => {
    expect(chestYawFromHip(0.6, 0, 32)).toBe(0);
    expect(chestYawFromHip(3, 0.45, 32)).toBeCloseTo((32 * Math.PI) / 180, 6);
    expect(chestYawFromHip(-3, 0.45, 32)).toBeCloseTo(-(32 * Math.PI) / 180, 6);
  });

  it('正前跑（下盘不偏）时胸也不偏', () => {
    expect(chestYawFromHip(0, 0.45, 32)).toBe(0);
  });
});

/* -------------------------------------------------------------------------- *
 * 主角集成：低速滑行是否真的消失、停步收相是否还保留
 * -------------------------------------------------------------------------- */
describe('v9o 主角：低速巡航不再「身体走、腿不动」', () => {
  it('轻推摇杆稳定低速移动：收相全程不接管，双腿持续摆动', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const hold = intent({ moveX: 0.25, moveZ: 0 });
    run(w, 120, hold);   // 先让速度稳定在低速

    let maxLeg = 0;
    let speedSeen = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, hold);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = rig.gaitDebug();
      expect(d.stopT).toBeLessThan(0);   // 收相绝不能在低速巡航时启动
      maxLeg = Math.max(maxLeg, legMag(d));
      speedSeen = d.speed;
    }
    // 确实处在「低速」区间（否则等于没测到这个场景）
    expect(speedSeen).toBeGreaterThan(0.3);
    expect(speedSeen).toBeLessThan(w.config.moveSpeed * 0.5);
    // 步态没有被关掉：腿一直在按相位摆动
    expect(maxLeg).toBeGreaterThan(0.05);
  });

  it('最刁钻的超低速巡航：速度已低于进入阈值，仍不会收相', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const hold = intent({ moveX: 0.06, moveZ: 0 });
    run(w, 180, hold);

    let maxLeg = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, hold);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = rig.gaitDebug();
      expect(d.stopT).toBeLessThan(0);
      maxLeg = Math.max(maxLeg, legMag(d));
    }
    expect(rig.gaitDebug().speed).toBeLessThan(w.config.moveSpeed * MECH_GAIT.stopEnterRatio * 1.5);
    expect(maxLeg).toBeGreaterThan(0.05);
  });

  it('高速跑 → 轻推摇杆切超低速巡航：中途启动的收相会被撤销，不会一直滑', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    run(w, 90, intent({ moveX: 0, moveZ: 1 }));    // 先全速跑
    const hold = intent({ moveX: 0.06, moveZ: 0 }); // 切到超低速巡航

    let maxLeg = 0;
    for (let i = 0; i < 120; i++) {
      run(w, 1, hold);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      if (i > 40) {   // 减速段已过、速度稳定在低速
        const d = rig.gaitDebug();
        expect(d.stopT).toBeLessThan(0);
        maxLeg = Math.max(maxLeg, legMag(d));
      }
    }
    expect(maxLeg).toBeGreaterThan(0.05);
  });

  it('松手减速停步：v9n 的「收相到双脚并拢」依然生效', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    run(w, 90, intent({ moveX: 0, moveZ: 1 }));   // 先全速跑起来

    const release = intent({});
    for (let i = 0; i < 90; i++) {
      run(w, 1, release);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
    }
    const d = rig.gaitDebug();
    expect(d.stopT).toBeGreaterThan(0.9);   // 收相确实跑完
    expect(legMag(d)).toBe(0);             // 收敛到待机，不再卡在最后一个跨步 pose
  });
});

/* -------------------------------------------------------------------------- *
 * 主角集成：胸随下盘带转、头仍朝目标
 * -------------------------------------------------------------------------- */
describe('v9o 主角：胸随下盘适当偏转，头仍朝目标', () => {
  it('纯侧移时胸与下盘同向偏转，但幅度更小、符合配置比例', () => {
    // v9s.13：要的是「朝向分离 + 纯侧移」，威胁注视会把身体转向假人（移动变成侧后方 →
    // 按新规则改走后退步、hipYaw 归零），所以隔离注视。
    const w = makeQuietWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const aim = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 45, aim);

    let saw = false;
    for (let i = 0; i < 90; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const n = rigNodes(rig);
      const low = n.lower.rotation.y as number;
      const up = n.upper.rotation.y as number;
      if (Math.abs(low) > 0.05) {
        saw = true;
        expect(Math.sign(up)).toBe(Math.sign(low));          // 同向，不是反着拧
        expect(Math.abs(up)).toBeLessThan(Math.abs(low));    // 胸转得比腿少
        expect(Math.abs(up)).toBeGreaterThan(0.05);          // 确实转了，不是 0
        expect(rig.gaitDebug().chestYaw).toBeCloseTo(up, 6); // 诊断读数与实际一致
      }
    }
    expect(saw).toBe(true);
  });

  it('比例精确等于 chestYawScale，且被上限钳住时也不越界', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const aim = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 60, aim);
    for (let i = 0; i < 60; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = rig.gaitDebug();
      const max = (MECH_GAIT.chestYawMaxDeg * Math.PI) / 180;
      expect(Math.abs(d.chestYaw)).toBeLessThanOrEqual(max + 1e-9);
      if (Math.abs(d.hipYaw * MECH_GAIT.chestYawScale) < max) {
        expect(d.chestYaw).toBeCloseTo(d.hipYaw * MECH_GAIT.chestYawScale, 6);
      }
    }
  });

  it('正前跑（下盘不偏）时胸也不偏', () => {
    const w = makeQuietWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const fwd = intent({ moveX: 0, moveZ: 1 });
    run(w, 60, fwd);
    for (let i = 0; i < 60; i++) {
      run(w, 1, fwd);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      expect(Math.abs(rig.gaitDebug().chestYaw)).toBeLessThan(0.01);
    }
  });

  it('胸偏转后头部枢轴补偿：头仍朝 Core 的 headYaw', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    const rig = makeRig(w.config.moveSpeed);
    const aim = intent({ moveX: 1, moveZ: 0, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 45, aim);
    const head = rig.group.getObjectByName('headPivot');
    expect(head).toBeDefined();

    let saw = false;
    for (let i = 0; i < 90; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const n = rigNodes(rig);
      if (Math.abs(n.upper.rotation.y as number) > 0.05) saw = true;
      // root=bodyYaw（由 three-scene 设置）+ upper + headPivot 应等于目标 headYaw
      const worldHead = w.character.bodyYaw
        + (n.upper.rotation.y as number) + (head!.rotation.y as number);
      expect(Math.abs(angleDelta(worldHead, w.character.headYaw))).toBeLessThan(1e-6);
    }
    expect(saw).toBe(true);
  });
});

/* -------------------------------------------------------------------------- *
 * 假人集成：与主角同构（KEEP DIST 横移是低速滑行最明显的场景）
 * -------------------------------------------------------------------------- */
describe('v9o 假人：低速横移不收相、胸随下盘带转', () => {
  function dummyRig(w: ReturnType<typeof makeWorld>) {
    const s = w.dummies[0];
    return createDummyRig(
      raw.view.voxel, raw.view.colors, '#88aa88', s.id, raw.view.dummies,
      w.config.dummies.moveSpeed, MECH_GAIT, raw.view.hurt, raw.view.lean,
    );
  }

  it('稳定低速横移：腿持续摆动（不被收相关成 idle）', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const rig = dummyRig(w);
    // 手动构造「KEEP DIST 式」纯侧移：速度低且稳定，步相按位移推进
    let maxLeg = 0;
    for (let i = 0; i < 90; i++) {
      s.velocity.x = 0.25; s.velocity.z = 0;
      s.bodyYaw = 0; s.headYaw = 0;
      s.stride = 1.0;
      s.gaitPhase = (i * 0.06) % (Math.PI * 2);
      rig.update(s, w.config.fixedDt);
      const n = rigNodes(rig);
      maxLeg = Math.max(maxLeg, Math.abs(n.hipL.rotation.x as number));
      // 胸与下盘同向、且比下盘小
      const low = n.lower.rotation.y as number;
      const up = n.upper.rotation.y as number;
      expect(Math.sign(up)).toBe(Math.sign(low));
      expect(Math.abs(up)).toBeLessThanOrEqual(Math.abs(low) + 1e-9);
    }
    expect(maxLeg).toBeGreaterThan(0.05);
  });

  it('下盘偏转时胸确实转了，头仍朝 headYaw', () => {
    const w = makeWorld();
    const s = w.dummies[0];
    const rig = dummyRig(w);
    const head = rig.group.getObjectByName('headPivot');
    expect(head).toBeDefined();
    for (let i = 0; i < 90; i++) {
      s.velocity.x = 1.8; s.velocity.z = 0;
      s.bodyYaw = 0; s.headYaw = 0.2;
      s.stride = 1.0;
      s.gaitPhase = (i * 0.12) % (Math.PI * 2);
      rig.update(s, w.config.fixedDt);
      const n = rigNodes(rig);
      if (Math.abs(n.lower.rotation.y as number) > 0.05) {
        expect(Math.abs(n.upper.rotation.y as number)).toBeGreaterThan(0.02);
      }
      const worldHead = (n.upper.rotation.y as number) + (head!.rotation.y as number);
      expect(Math.abs(angleDelta(worldHead, s.headYaw - s.bodyYaw))).toBeLessThan(1e-6);
    }
  });
});
