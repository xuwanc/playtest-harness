import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { wrapAngle, step, restoreWorld, snapshot } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { solveTurnStep, stopYawFade } from '../src/presentation/gait';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import { MECH_GAIT, RAW_CONFIG } from './mech-gait';
import type { GaitViewConfig, IKViewConfig, TurnInPlaceState } from '../src/core';

// 最小 DOM stub：createVoxelRig 不依赖 canvas，但保持与既有骨架用例一致
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

function makeRig(gait: GaitViewConfig = MECH_GAIT, ikCfg?: IKViewConfig): VoxelRig {
  return createVoxelRig(
    RAW_CONFIG.view.voxel, RAW_CONFIG.view.colors, RAW_CONFIG.core.moveSpeed,
    RAW_CONFIG.view.orientation, gait, RAW_CONFIG.view.weaponMount,
    RAW_CONFIG.view.lean, RAW_CONFIG.view.hurt, RAW_CONFIG.view.animation, ikCfg,
  );
}

const DEG = Math.PI / 180;
/** 背后目视方向：facing 初始 0（朝 +Z），-Z 即 180° */
const BEHIND = intent({ aimActive: true, aimX: 0, aimZ: -1 });

/* -------------------------------------------------------------------------- *
 * 1) 默认参数（v9s 定稿）
 * -------------------------------------------------------------------------- */
describe('v9s 默认参数', () => {
  it('胸随下盘旋转 0.6 / 上限 40°，停步偏差默认 inStop，转身踏步已启用', () => {
    const gait = RAW_CONFIG.view.gait;
    expect(gait.chestYawScale).toBe(0.6);
    expect(gait.chestYawMaxDeg).toBe(40);
    expect(gait.stopYawBlendMode).toBe('inStop');
    expect(gait.stopYawAfterSec).toBe(0.3);
    expect(gait.turnStepEnabled).toBe(true);
    expect(gait.turnStepPitch).toBe(0.5);
    expect(gait.turnStepKnee).toBe(0.35);
    expect(gait.turnStepDip).toBe(0.02);
  });

  it('Core 原地转身配置与模块开关写入默认配置 / World', () => {
    const tip = RAW_CONFIG.core.turnInPlace;
    expect(tip.enabled).toBe(true);
    expect(tip.triggerDeg).toBe(50);
    expect(tip.settleDeg).toBe(8);
    expect(tip.durationSec).toBe(0.45);
    expect(tip.idleSpeedRatio).toBe(0.05);
    expect(tip.inputDeadZone).toBe(0.12);
    expect(tip.lookRange).toBe(0);
    expect(tip.armSec).toBe(0.03);
    const w = makeWorld();
    expect(w.modules.turnInPlace).toBe(true);
    expect(w.turnInPlace.phase).toBe('idle');
    expect(w.turnInPlace.progress).toBe(0);
  });
});

/* -------------------------------------------------------------------------- *
 * 2) 停步偏差淡出系数（纯函数）
 * -------------------------------------------------------------------------- */
describe('v9s stopYawFade：两种消化窗口', () => {
  it('inStop：收相内从 1 平滑压到 0，单调递减', () => {
    expect(stopYawFade(0, 'inStop', true)).toBe(1);
    expect(stopYawFade(1, 'inStop', true)).toBe(0);
    expect(stopYawFade(0.5, 'inStop', true)).toBeCloseTo(0.5, 9);
    let prev = 1;
    for (let i = 1; i <= 20; i++) {
      const v = stopYawFade(i / 20, 'inStop', true);
      expect(v).toBeLessThanOrEqual(prev + 1e-9);
      prev = v;
    }
  });

  it('afterStop：收相期间保持 1，收相结束后按独立进度消化', () => {
    expect(stopYawFade(0, 'afterStop', true)).toBe(1);
    expect(stopYawFade(1, 'afterStop', true)).toBe(1);
    expect(stopYawFade(0, 'afterStop', false)).toBe(1);
    expect(stopYawFade(0.5, 'afterStop', false)).toBeCloseTo(0.5, 9);
    expect(stopYawFade(1, 'afterStop', false)).toBe(0);
  });

  it('inStop 收相结束后恒 0，且两端导数为 0（不抽动）', () => {
    expect(stopYawFade(0.7, 'inStop', false)).toBe(0);
    const h = 1e-4;
    const d0 = (stopYawFade(h, 'inStop', true) - stopYawFade(0, 'inStop', true)) / h;
    const d1 = (stopYawFade(1, 'inStop', true) - stopYawFade(1 - h, 'inStop', true)) / h;
    expect(Math.abs(d0)).toBeLessThan(0.01);
    expect(Math.abs(d1)).toBeLessThan(0.01);
  });
});

/* -------------------------------------------------------------------------- *
 * 3) 原地转身踏步姿态（纯函数）
 * -------------------------------------------------------------------------- */
describe('v9s solveTurnStep', () => {
  it('两端值与导数均为 0，中段达到峰值', () => {
    expect(solveTurnStep(0, 1, MECH_GAIT).env).toBe(0);
    expect(solveTurnStep(1, 1, MECH_GAIT).env).toBe(0);
    expect(solveTurnStep(0.5, 1, MECH_GAIT).env).toBeCloseTo(1, 9);
    const h = 1e-4;
    expect(Math.abs(solveTurnStep(h, 1, MECH_GAIT).env)).toBeLessThan(1e-5);
  });

  it('转向方向决定领先腿：右转左腿幅度大，左转右腿幅度大', () => {
    const r = solveTurnStep(0.5, 1, MECH_GAIT);
    const l = solveTurnStep(0.5, -1, MECH_GAIT);
    expect(Math.abs(r.legL.pitchX)).toBeGreaterThan(Math.abs(r.legR.pitchX));
    expect(Math.abs(l.legR.pitchX)).toBeGreaterThan(Math.abs(l.legL.pitchX));
    expect(r.legL.rollZ).toBeGreaterThan(0);
    expect(l.legL.rollZ).toBeLessThan(0);
    expect(r.legL.kneeX).toBeGreaterThan(0);
    expect(r.pelvisY).toBeLessThan(0);
  });

  it('enabled=false 精确回到全零（纯插值转身 A/B）', () => {
    const off = { ...MECH_GAIT, turnStepEnabled: false };
    const p = solveTurnStep(0.5, 1, off);
    expect(p.env).toBe(0);
    expect(p.legL.pitchX).toBe(0);
    expect(p.legR.kneeX).toBe(0);
    expect(p.pelvisY).toBe(0);
  });
});

/* -------------------------------------------------------------------------- *
 * 4) Core 原地转身状态机
 * -------------------------------------------------------------------------- */
describe('v9s Core turnInPlace：静止盯视触发、起步攻击立即中止', () => {
  it('目视方向在背后 → 超过阈值才触发，快照目标角并留余角', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    w.modules.gaze = false;   // 隔离威胁注视：本测试验证「身体转向瞄准方向」的转身机制本身
    // 前 1 帧仍在防抖窗口内（armSec=0.03 ≈ 2 帧）
    run(w, 1, BEHIND);
    expect(w.turnInPlace.phase).toBe('idle');
    run(w, 6, BEHIND);
    expect(w.turnInPlace.phase).toBe('active');
    const t = w.turnInPlace;
    expect(t.dir).toBe(1);
    expect(Math.abs(wrapAngle(t.targetYaw - (Math.PI - 8 * DEG)))).toBeLessThan(0.02);
    expect(t.progress).toBeGreaterThan(0);
    expect(t.progress).toBeLessThan(1);
  });

  it('转身按固定进度推进 bodyYaw，完成后回 idle 且不残留', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    w.modules.gaze = false;   // 隔离威胁注视：身体应转向瞄准方向（背后），而非威胁质心
    run(w, 9, BEHIND);
    expect(w.turnInPlace.phase).toBe('active');
    const mid = w.character.bodyYaw;
    expect(Math.abs(mid)).toBeGreaterThan(0.01);
    run(w, 40, BEHIND);   // 0.67s > durationSec 0.45
    expect(w.turnInPlace.phase).toBe('idle');
    expect(w.turnInPlace.progress).toBe(0);
    // 已经转到目标方向附近（余角 8° + 之后 approach 的少量追赶）
    expect(Math.abs(wrapAngle(w.character.bodyYaw - Math.PI))).toBeLessThan(20 * DEG);
  });

  it('小夹角不触发（仍走常规平滑插值），不会每帧抖动触发', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    const near = intent({ aimActive: true, aimX: 0.1, aimZ: 1 });
    run(w, 60, near);
    expect(w.turnInPlace.phase).toBe('idle');
    expect(w.turnInPlace.armTime).toBe(0);
  });

  it('起步 / 攻击 / 冲刺 / 跳跃任一发生立即中止，交还常规 approach', () => {
    for (const abort of [
      intent({ moveX: 0, moveZ: 1 }),
      intent({ attackPressed: true }),
      intent({ sprintPressed: true }),
      intent({ jumpPressed: true }),
      intent({ skill2Pressed: true }),
    ]) {
      const w = makeWorld();
      w.modules.dummies = false;
      run(w, 10, BEHIND);
      expect(w.turnInPlace.phase).toBe('active');
      step(w, w.config.fixedDt, abort);
      expect(w.turnInPlace.phase).toBe('idle');
      expect(w.turnInPlace.progress).toBe(0);
      expect(w.turnInPlace.armTime).toBe(0);
    }
  });

  it('模块开关 / 配置总闸关闭后状态冻结且不留残留', () => {
    for (const disable of [
      (w: ReturnType<typeof makeWorld>) => { w.modules.turnInPlace = false; },
      (w: ReturnType<typeof makeWorld>) => { w.config.turnInPlace.enabled = false; },
    ]) {
      const w = makeWorld();
      w.modules.dummies = false;
      run(w, 10, BEHIND);
      expect(w.turnInPlace.phase).toBe('active');
      disable(w);
      step(w, w.config.fixedDt, BEHIND);
      expect(w.turnInPlace.phase).toBe('idle');
      expect(w.turnInPlace.targetYaw).toBe(0);
      expect(w.character.bodyYaw).toBeLessThan(Math.PI); // 没有被继续推到目标角
    }
  });

  it('v9s.4：附近假人不再触发整身转身（普通注视只转头），身体保持不动', () => {
    const w = makeWorld();
    w.modules.dummies = false;         // 冻结 AI，位置仍保留
    w.modules.targeting = false;       // 无锁定
    const p = w.character.position;
    // 只留一个假人放在玩家左后方（约 -135°），其余移到范围外
    w.dummies.forEach((d, i) => {
      d.position.x = p.x + (i === 0 ? -2 : 100);
      d.position.z = p.z + (i === 0 ? -2 : 100);
    });
    run(w, 15, intent());
    // 旧逻辑会「由最近假人兜底」触发原地转身；v9s.4 起普通注视只转头，不拽身体
    expect(w.turnInPlace.phase).toBe('idle');
    expect(Math.abs(wrapAngle(w.character.bodyYaw))).toBeLessThan(2 * DEG);
  });

  it('转身状态随 World 快照 / 恢复无损，可回放', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    run(w, 12, BEHIND);
    const before = snapshot(w);
    const restored = restoreWorld(before);
    expect(restored.turnInPlace.phase).toBe('active');
    expect(snapshot(restored)).toBe(before);
    run(w, 30, BEHIND);
    run(restored, 30, BEHIND);
    expect(snapshot(restored)).toBe(snapshot(w));
  });

  it('转身期间不写 position / velocity（纯朝向机制，无位移）', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    const before = JSON.stringify(w.character.position);
    run(w, 30, BEHIND);
    expect(JSON.stringify(w.character.position)).toBe(before);
    expect(Math.hypot(w.character.velocity.x, w.character.velocity.z)).toBeLessThan(1e-6);
  });
});

/* -------------------------------------------------------------------------- *
 * 5) 骨架：停步偏差在收相内消化 + 停步惯性整体带动下半身
 * -------------------------------------------------------------------------- */
describe('v9s 骨架：停步偏差消化与惯性 IK', () => {
  /** 用纯侧移制造 hipYaw，松手后逐帧记录收相进度 / 淡出系数 / hipYaw */
  function stopTrace(gait: GaitViewConfig) {
    const w = makeWorld();
    w.modules.targeting = false;
    w.modules.turnInPlace = false;
    const rig = makeRig(gait, RAW_CONFIG.view.ik);
    run(w, 90, intent({ moveX: 1, moveZ: 0 }));
    const trace: Array<{ t: number; fade: number; hip: number }> = [];
    for (let i = 0; i < 100; i++) {
      run(w, 1, intent({}));
      rig.group.rotation.y = w.character.bodyYaw;
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const d = rig.gaitDebug();
      if (d.stopT >= 0) trace.push({ t: d.stopT, fade: d.stopYawFade, hip: d.hipYaw });
    }
    return { trace, rig };
  }

  it('inStop：收相内淡出系数从 1 降到 0，收相结束 hipYaw 已归零（不再有后续插值）', () => {
    const { trace } = stopTrace({ ...MECH_GAIT, stopYawBlendMode: 'inStop' });
    expect(trace.length).toBeGreaterThan(10);
    expect(trace[0].fade).toBeGreaterThan(0.8);
    expect(trace[trace.length - 1].fade).toBeLessThan(0.02);
    // 收相末尾 hipYaw 应已接近 0 —— 修掉「停步完成后明显插值到目标方向」
    expect(Math.abs(trace[trace.length - 1].hip)).toBeLessThan(0.02);
  });

  it('afterStop：收相期间保持偏转，收相结束后才消化（急停顿感）', () => {
    const { trace } = stopTrace({ ...MECH_GAIT, stopYawBlendMode: 'afterStop', stopYawAfterSec: 0.3 });
    expect(trace.length).toBeGreaterThan(10);
    // 收相前 80% 系数仍接近 1
    const early = trace.filter((x) => x.t < 0.8);
    expect(early.length).toBeGreaterThan(3);
    expect(Math.min(...early.map((x) => x.fade))).toBeGreaterThan(0.9);
  });

  it('停步惯性：下半身跟着骨盆一起走（lower 不再水平反向补偿），脚由 IK 钉回原位', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    w.modules.turnInPlace = false;
    const on = makeRig(MECH_GAIT, RAW_CONFIG.view.ik);
    const off = makeRig({ ...MECH_GAIT, stopBodyShift: 0 }, RAW_CONFIG.view.ik);
    run(w, 45, intent({ moveX: 0, moveZ: 1 }));

    let sawShift = false;
    let maxLowerXZ = 0;
    let maxFootGap = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, intent({}));
      const c = w.character;
      on.group.rotation.y = c.bodyYaw;
      off.group.rotation.y = c.bodyYaw;
      on.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      off.update(c, w.combat, w.playerHurt, w.config.fixedDt, false);
      if (on.gaitDebug().stopShift > MECH_GAIT.stopBodyShift * 0.4) {
        sawShift = true;
        const n = rigNodes(on);
        // IK 开启时 lower 不做水平反向补偿 → 上下半身一起被惯性带走
        maxLowerXZ = Math.max(maxLowerXZ, Math.abs(n.lower.position.x), Math.abs(n.lower.position.z));
        for (const side of ['L', 'R'] as const) {
          const name = side === 'L' ? 'hipL' : 'hipR';
          const tipOn = on.group.getObjectByName(name)!.getObjectByName('footTip' + side)!
            .getWorldPosition(new THREE.Vector3());
          const tipOff = off.group.getObjectByName(name)!.getObjectByName('footTip' + side)!
            .getWorldPosition(new THREE.Vector3());
          maxFootGap = Math.max(maxFootGap, Math.hypot(tipOn.x - tipOff.x, tipOn.z - tipOff.z));
        }
      }
    }
    expect(sawShift).toBe(true);
    // lower 的水平偏移应为 0（不再反向补偿），而 pelvis 已带着整体前移
    expect(maxLowerXZ).toBeLessThan(1e-6);
    // 脚仍被 IK 钉回原位，与「关闭惯性前移」的对照组几乎重合
    expect(maxFootGap).toBeLessThan(MECH_GAIT.stopBodyShift * 0.35);
  });

  it('原地转身踏步：turnInPlace.active 时腿姿态非零，envelope 两端归零', () => {
    const w = makeWorld();
    const rig = makeRig(MECH_GAIT, RAW_CONFIG.view.ik);
    const turn = (progress: number): TurnInPlaceState => ({
      phase: 'active', fromYaw: 0, targetYaw: 2, dir: 1, progress, armTime: 0,
    });
    const sample = (p: number) => {
      rig.group.rotation.y = w.character.bodyYaw;
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false,
        undefined, undefined, turn(p));
      return rig.gaitDebug();
    };
    expect(sample(0).turnStep).toBe(0);
    expect(sample(1).turnStep).toBe(0);
    expect(sample(0.5).turnStep).toBeGreaterThan(0.9);
    // 静止时 solveGait 本返回 idle，踏步层让腿真的动起来
    expect(Math.abs(sample(0.5).legLPitch)).toBeGreaterThan(0.1);
  });
});

/* -------------------------------------------------------------------------- *
 * v9s.1 · 转身驱动权移交：修 dirJump（无输入单帧 170° 跳变）与「转身卡一下」
 * -------------------------------------------------------------------------- */
describe('v9s.1 转身驱动权移交：修 dirJump 与卡顿', () => {
  it('非拖拽（锁定背后目标）：激活帧 facing 不瞬跳到 targetYaw（修遥测 dirJump），激活期跟随 bodyYaw 平滑旋转并收敛', () => {
    const w = makeWorld();
    // v9s.4：无自动兜底后，用「锁定背后目标」构造非拖拽目视方向。
    // targeting 受 modules.dummies 总闸控制，故保留假人模块（设为 idle 避免攻击打断转身）。
    w.config.targeting.maxAngleDeg = 180;
    const p = w.character.position;
    // 背后放一个假人（朝向初始 +Z，假人在 -Z = 180°）
    w.dummies.forEach((d) => { d.position.x = p.x; d.position.z = p.z - 3; d.mode = 'idle'; });
    // 跑到激活
    for (let i = 0; i < 30 && w.turnInPlace.phase !== 'active'; i++) run(w, 1, intent());
    expect(w.turnInPlace.phase).toBe('active');
    let prevF = w.character.facing;
    let prevB = w.character.bodyYaw;
    let maxJump = 0;
    for (let i = 0; i < 50; i++) {
      run(w, 1, intent());
      const df = Math.abs(wrapAngle(w.character.facing - prevF));
      if (df > maxJump) maxJump = df;
      prevF = w.character.facing;
      prevB = w.character.bodyYaw;
    }
    // 单帧跳变远小于 50°，旧逻辑会在激活帧把 facing 从旧值瞬跳到 targetYaw（170°+）
    expect(maxJump).toBeLessThan(50 * DEG);
    // 非拖拽：facing 全程跟随 bodyYaw（不再写死 targetYaw）
    expect(Math.abs(wrapAngle(w.character.facing - w.character.bodyYaw))).toBeLessThan(2 * DEG);
    // 完成回到 idle，facing≈bodyYaw≈targetYaw（留余角，无回拉）
    expect(w.turnInPlace.phase).toBe('idle');
    expect(Math.abs(wrapAngle(w.character.facing - w.character.bodyYaw))).toBeLessThan(5 * DEG);
  });

  it('拖拽：激活前 orientation 跳过 approach，bodyYaw 不被预旋（修「转身卡一下」）', () => {
    const w = makeWorld();
    w.modules.dummies = false;
    // 关掉注视：本用例只验「拖拽分支」的驱动权移交（注视优先级更高，会盖住拖拽）
    w.modules.gaze = false;
    const start = w.character.bodyYaw;
    // 拖拽瞄准指向背后 (-Z)：facing 会被瞬间拉向 ~π，但 bodyYaw 不该提前甩过去
    run(w, 1, intent({ aimActive: true, aimX: 0, aimZ: -1 }));
    expect(w.turnInPlace.phase).toBe('idle'); // arm 防抖首帧尚未激活
    expect(Math.abs(wrapAngle(w.character.facing - start))).toBeGreaterThan(15 * DEG); // facing 已转向目视方向
    expect(Math.abs(wrapAngle(w.character.bodyYaw - start))).toBeLessThan(3 * DEG);   // bodyYaw 未预旋（approach 被跳过）
    // 继续：转身被触发并平滑进行
    for (let i = 0; i < 20 && w.turnInPlace.phase !== 'active'; i++) {
      run(w, 1, intent({ aimActive: true, aimX: 0, aimZ: -1 }));
    }
    expect(w.turnInPlace.phase).toBe('active');
  });
});
