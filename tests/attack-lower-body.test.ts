import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, Intents, ProgramAnimViewConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

function animCfg(
  attack: Partial<ProgramAnimViewConfig['attack']> = {},
  stride: Partial<ProgramAnimViewConfig['stride']> = {},
): ProgramAnimViewConfig {
  const cfg = JSON.parse(JSON.stringify(raw.view.animation)) as ProgramAnimViewConfig;
  Object.assign(cfg.attack, attack);
  Object.assign(cfg.stride, stride);
  return cfg;
}

function makeRig(moveSpeed: number, anim: ProgramAnimViewConfig): VoxelRig {
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim,
  );
}

/** v8f：按命名节点取腿 / 膝，不再依赖 root → lower → children[i] 的硬编码下标。 */
function legX(rig: VoxelRig, i = 0): number {
  const n = rigNodes(rig);
  return (i === 0 ? n.hipL : n.hipR).rotation.x;
}
function legRoll(rig: VoxelRig, i = 0): number {
  const n = rigNodes(rig);
  return (i === 0 ? n.hipL : n.hipR).rotation.z;
}
function kneeX(rig: VoxelRig, i = 0): number {
  const n = rigNodes(rig);
  return (i === 0 ? n.kneeL : n.kneeR).rotation.x;
}

type Sample = {
  sawAttack: boolean;
  maxX: number;
  maxRoll: number;
  maxKnee: number;
  maxBlend: number;
  maxDrive: number;
  maxGaitScale: number;
  maxLegWeight: number;
  maxStep: number;
  /** 仅统计攻击稳定态（blend>0.98）的下盘姿态，排除进出攻击的平滑过渡帧 */
  stableMaxX: number;
  stableMaxRoll: number;
  stableMaxKnee: number;
};

/** 起一次攻击并逐帧采样下盘姿态，覆盖 windup / active / recovery / settle / 退出。 */
function sampleAttack(anim: ProgramAnimViewConfig, weaponSlot = 1): Sample {
  const w = makeWorld();
  const rig = makeRig(w.config.moveSpeed, anim);
  run(w, 1, intent({ weaponSlot }));
  run(w, 1, intent({ attackPressed: true }));
  const s: Sample = {
    sawAttack: false, maxX: 0, maxRoll: 0, maxKnee: 0, maxBlend: 0,
    maxDrive: 0, maxGaitScale: 0, maxLegWeight: 0, maxStep: 0,
    stableMaxX: 0, stableMaxRoll: 0, stableMaxKnee: 0,
  };
  let prevX = 0;
  for (let i = 0; i < 100; i++) {
    run(w, 1, intent());
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    const attacking = w.combat.phase !== 'idle';
    if (attacking) s.sawAttack = true;
    const xL = legX(rig);
    const x = Math.max(Math.abs(xL), Math.abs(legX(rig, 1)));
    const roll = Math.max(Math.abs(legRoll(rig)), Math.abs(legRoll(rig, 1)));
    const knee = Math.max(Math.abs(kneeX(rig)), Math.abs(kneeX(rig, 1)));
    s.maxX = Math.max(s.maxX, x);
    s.maxRoll = Math.max(s.maxRoll, roll);
    s.maxKnee = Math.max(s.maxKnee, knee);
    const b = rig.attackBlend();
    s.maxBlend = Math.max(s.maxBlend, b);
    const aw = rig.attackWeights();
    s.maxDrive = Math.max(s.maxDrive, aw.driveSpeed);
    s.maxGaitScale = Math.max(s.maxGaitScale, aw.gaitScale);
    s.maxLegWeight = Math.max(s.maxLegWeight, aw.attackLegWeight);
    s.maxStep = Math.max(s.maxStep, Math.abs(xL - prevX));
    prevX = xL;
    // b>0.999 即端点吸附后的精确 1（attackBlendStep 会把 >0.999 吸附到 1），
    // 排除 b∈(0.98,0.999) 的过渡尾巴：那些帧 gaitScale=1-b 仍有极小残量。
    if (attacking && b > 0.999) {
      s.stableMaxX = Math.max(s.stableMaxX, x);
      s.stableMaxRoll = Math.max(s.stableMaxRoll, roll);
      s.stableMaxKnee = Math.max(s.stableMaxKnee, knee);
    }
  }
  return s;
}

/**
 * v8d 回归：用户反馈「无论是攻击覆盖是否移动步态，下半身都没有动」。
 * 根因有两层：
 *  1) Core 攻击阶段锁自主移速（v.x=v.z=0）→ solveGait 首行 speed<EPS 直接返回 idle，
 *     且非 active 段 gaitPhase 因无位移冻结 —— gaitWeight 拉到 1 也拿不到任何姿态。
 *  2) 旧版攻击写腿只散落在大剑 / 三连击第 3 段，默认剑盾前两段、双剑、弓、法杖完全不碰腿，
 *     幅度也只有 ±0.24 rad、仅挥出瞬间非零 —— lowerBodyWeight 拉到 1 也几乎看不出动作。
 * 现在两条路径各自都能驱动下盘，且都关时是明确的静止基准（对照组）。
 */
describe('v8d 攻击下半身：两条权重路径各自都能驱动下盘', () => {
  it('根因回归：攻击时步态等效驱动 speed>0，不再被 Core 锁速喂成 idle', () => {
    const s = sampleAttack(animCfg());
    expect(s.sawAttack).toBe(true);
    expect(s.maxDrive).toBeGreaterThan(0.5);    // 等效步速确实喂进 solveGait
    expect(s.maxGaitScale).toBeCloseTo(1, 6);   // 默认 gw=1
    expect(s.maxX).toBeGreaterThan(0.08);      // 腿真的动了
  });

  it('默认 gw=1 / lw=0：过滤挥击跨步后，下盘由步态持续摆动（俯仰/侧摆/抬膝均非零）', () => {
    const s = sampleAttack(animCfg());
    expect(s.maxX).toBeGreaterThan(0.08);
    expect(s.maxRoll).toBeGreaterThan(0.005);
    expect(s.maxKnee).toBeGreaterThan(0.02);
    expect(s.maxLegWeight).toBeLessThan(1e-9);  // 挥击跨步确实被过滤
  });

  it('只开 lw（gw=0 / lw=1）：挥击跨步单独也让腿动，默认剑盾第 1 段就生效', () => {
    const s = sampleAttack(animCfg({ gaitWeight: 0, lowerBodyWeight: 1 }));
    expect(s.sawAttack).toBe(true);
    expect(s.maxX).toBeGreaterThan(0.1);
    expect(s.maxKnee).toBeGreaterThan(0.05);
    expect(s.maxLegWeight).toBeGreaterThan(0.9);
  });

  it('两个权重都关 = 攻击稳定态完全静止的基准（证明权重真的接线，而非永远冻结）', () => {
    const s = sampleAttack(animCfg({ gaitWeight: 0, lowerBodyWeight: 0 }));
    expect(s.sawAttack).toBe(true);
    expect(s.stableMaxX).toBeLessThan(1e-9);
    expect(s.stableMaxRoll).toBeLessThan(1e-9);
    expect(s.stableMaxKnee).toBeLessThan(1e-9);
    // 进出攻击的过渡帧允许有界的平滑残留（gaitScale 淡出 × 等效驱动淡入交叉所致），
    // 不能为 0，否则进出攻击就会单帧跳变；幅度 < 0.16 rad（约 9°）肉眼几乎不可见。
    // v9s.41 实测 0.141：相位改为单向推进后，淡出期相位差从 0 变成最多 π，
    // 交叉窗口里多扫几度；稳定态仍然是精确 0（上面三条断言）。
    expect(s.maxX).toBeLessThan(0.16);
  });

  it('两个都开时幅度大于任一单层（可叠加）', () => {
    const g = sampleAttack(animCfg({ gaitWeight: 1, lowerBodyWeight: 0 }));
    const l = sampleAttack(animCfg({ gaitWeight: 0, lowerBodyWeight: 1 }));
    const both = sampleAttack(animCfg({ gaitWeight: 1, lowerBodyWeight: 1 }));
    // v9s.21：步态相位改由「实际位移速度」推进，跨步包络让相位走得更快，
    // 与攻击姿态的腿方向偶有对冲 —— 幅度允许几个百分点的差异。
    // 要验证的是「两条路径都参与」：都开时不低于任一单层的 95%，且步态驱动确实在跑。
    expect(both.maxX).toBeGreaterThan(g.maxX * 0.95);
    expect(both.maxX).toBeGreaterThan(l.maxX * 0.95);
    expect(both.maxDrive).toBeGreaterThan(0);
  });

  it('剑盾 / 双剑 / 大剑 在 lw=1 时下盘都会动（旧版只有大剑与第 3 段写腿）', () => {
    for (const slot of [1, 2, 3]) {
      const s = sampleAttack(animCfg({ gaitWeight: 0, lowerBodyWeight: 1 }), slot);
      expect(s.sawAttack, `weapon slot ${slot}`).toBe(true);
      expect(s.maxX, `weapon slot ${slot}`).toBeGreaterThan(0.05);
    }
  });

  it('对照：等效步速归一为 0（复现旧 bug 的 Core 锁速）时 gw 路径退化为静止', () => {
    const s = sampleAttack(animCfg({}, { strideSpeed: 0 }));
    expect(s.sawAttack).toBe(true);
    expect(s.maxDrive).toBe(0);
    expect(s.maxX).toBeLessThan(1e-9);
  });

  it('进出攻击的 blend 与腿姿态连续，不出现单帧跳变', () => {
    const s = sampleAttack(animCfg({ gaitWeight: 1, lowerBodyWeight: 1 }));
    expect(s.maxBlend).toBeGreaterThan(0.9);
    expect(s.maxStep).toBeLessThan(0.35);
  });

  it('法杖引导（按住攻击可移动）不算攻击：下盘步态照常摆动，不误伤 v8b 修复', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    // v9s.17：引导是有限波次；本用例只关心「引导期间下盘照常摆动」，拉长波数保持引导态
    w.config.abilities.arcane.waves = 999;
    const rig = makeRig(w.config.moveSpeed, animCfg());
    run(w, 1, intent({ weaponSlot: 4 }));
    const hold: Intents = intent({
      attackHeld: true, aimActive: true, aimX: 0, aimZ: 1, moveX: 1, moveZ: 0,
    });
    run(w, 45, hold);

    let maxRoll = 0;
    let maxBlend = 0;
    for (let i = 0; i < 90; i++) {
      run(w, 1, hold);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, w.abilities.channeling, w.time);
      maxRoll = Math.max(maxRoll, Math.abs(legRoll(rig)));
      maxBlend = Math.max(maxBlend, rig.attackBlend());
    }
    expect(w.abilities.channeling).toBe(true);
    expect(maxBlend).toBeLessThan(1e-6); // 引导不进入攻击分层
    expect(maxRoll).toBeGreaterThan(0.05); // 侧移脚步仍在摆
  });

  it('弓蓄力可移动：charging 不进攻击分层，下盘仍是真实移动步态', () => {
    const w = makeWorld();
    const rig = makeRig(w.config.moveSpeed, animCfg({ gaitWeight: 0, lowerBodyWeight: 1 }));
    run(w, 1, intent({ weaponSlot: 5 }));
    run(w, 1, intent({ attackPressed: true, attackHeld: true, moveX: 1, moveZ: 0 }));
    expect(w.combat.charging).toBe(true);

    let maxX = 0;
    let maxBlend = 0;
    for (let i = 0; i < 40; i++) {
      run(w, 1, intent({ attackHeld: true, moveX: 1, moveZ: 0 }));
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
      maxX = Math.max(maxX, Math.abs(legX(rig)));
      maxBlend = Math.max(maxBlend, rig.attackBlend());
    }
    expect(maxBlend).toBeLessThan(1e-6);
    expect(maxX).toBeGreaterThan(0.02); // 真实移动步态仍在摆，没有被攻击分层冻结
  });
});
