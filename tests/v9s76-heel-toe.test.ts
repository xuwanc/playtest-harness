import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import { HEEL_TOE, heelToeAngle } from '../src/presentation/gait';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

/**
 * v9s.76 · heel-toe roll：脚掌绕前掌枢轴折一下。
 *
 * 改造前脚是刚性一块板：落地是「拍」、蹬地是「抬」，读不出重量 ——
 * `animation.md` 里「重量感」那条一直挂着这个。
 *
 * 曲线只有两段，都在端点收到 0：
 *   s ∈ [0, strikeU)  脚跟着地 → 脚尖上翘（负角，最大 −14°）
 *   s ∈ [strikeU, pushU]  全掌贴地（0）
 *   s ∈ (pushU, 1]   蹬离 → 脚尖下压 / 脚跟抬起（正角，最大 +26°）
 * 摆动期（s > 1）返回 0：脚在空中不该折。
 *
 * 三个必须守住的性质：
 *  1. **连续**：s 走一圈不出现折角（相邻采样差有上限）；
 *  2. **单调**：两段各自单调，接触点才会一路往前滚，不会来回蹭；
 *  3. **静止归零**：站着不动时 `gaitPhase` 是冻的，不乘权重会把某个相位的
 *     折角永久留在待机姿态上（脚一直翘着）。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0,
  dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

const DEG = Math.PI / 180;

describe('v9s.76 heelToeAngle：曲线', () => {
  it('三个关键位置：落点最大上翘 / 中段贴地 / 离地最大下压', () => {
    expect(heelToeAngle(0)).toBeCloseTo(-HEEL_TOE.strikeDeg * DEG, 6);
    expect(heelToeAngle(HEEL_TOE.strikeU)).toBeCloseTo(0, 9);
    // 中段整段都是 0（全掌贴地）
    for (const s of [0.2, 0.3, 0.4, 0.5]) expect(heelToeAngle(s)).toBe(0);
    expect(heelToeAngle(HEEL_TOE.pushU)).toBeCloseTo(0, 9);
    expect(heelToeAngle(1)).toBeCloseTo(HEEL_TOE.pushDeg * DEG, 6);
  });

  it('摆动期与非法输入一律 0（脚在空中不折）', () => {
    for (const s of [1.0001, 1.4, 1.999, -0.001, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(heelToeAngle(s)).toBe(0);
    }
  });

  it('连续：256 点扫过整个支撑期，相邻差不超过 0.6°', () => {
    const N = 256;
    let maxJump = 0;
    for (let i = 1; i <= N; i++) {
      const a = heelToeAngle((i - 1) / N);
      const b = heelToeAngle(i / N);
      maxJump = Math.max(maxJump, Math.abs(b - a));
    }
    // 最陡的是着地段端点（−14° 摊在 strikeU=0.18 上，dθ/ds ≈ 156°/单位 s），
    // 256 点采样 → 每步约 0.61°。阈值放到 0.8° 正好卡住它，仍能挡住
    // 「两段接反 / 端点没收到 0」这类真断裂（那样会跳到 14° 量级）。
    expect(maxJump / DEG).toBeLessThan(0.8);
  });

  it('单调：着地段从最小爬到 0，蹬离段从 0 爬到最大', () => {
    const strike: number[] = [];
    for (let i = 0; i <= 40; i++) strike.push(heelToeAngle((HEEL_TOE.strikeU * i) / 40));
    for (let i = 1; i < strike.length; i++) {
      expect(strike[i]).toBeGreaterThanOrEqual(strike[i - 1] - 1e-12);
    }
    expect(strike[0]).toBeLessThan(-1e-6);

    const push: number[] = [];
    const span = 1 - HEEL_TOE.pushU;
    for (let i = 0; i <= 40; i++) push.push(heelToeAngle(HEEL_TOE.pushU + (span * i) / 40));
    for (let i = 1; i < push.length; i++) {
      expect(push[i]).toBeGreaterThanOrEqual(push[i - 1] - 1e-12);
    }
    expect(push[push.length - 1]).toBeGreaterThan(1e-6);
  });
});

describe('v9s.76 heelToeAngle：接进骨架', () => {
  function build() {
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation,
      { ...raw.view.ik, enabled: true }, raw.view.links, raw.view.weaponWrist,
      raw.view.balance,
    );
    return { w, rig };
  }

  function tick(
    w: ReturnType<typeof makeWorld>,
    rig: ReturnType<typeof createVoxelRig>,
    n: number,
    it = intent({}),
    collect?: (b: { ballL: number; ballR: number; phase: number }) => void,
  ) {
    for (let i = 0; i < n; i++) {
      step(w, w.config.fixedDt, it);
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      if (collect) {
        const d = rig.gaitDebug();
        collect({ ballL: d.ballL, ballR: d.ballR, phase: d.phase });
      }
    }
  }

  it('走路时两脚都出现「上翘」和「下压」，且左右反相', () => {
    const { w, rig } = build();
    const rows: { ballL: number; ballR: number; phase: number }[] = [];
    tick(w, rig, 6, intent({}));
    tick(w, rig, 120, intent({ moveZ: 1 }), (r) => rows.push(r));

    const mins = rows.map((r) => Math.min(r.ballL, r.ballR));
    const maxs = rows.map((r) => Math.max(r.ballL, r.ballR));
    expect(Math.min(...mins)).toBeLessThan(-0.05);   // 有过明显上翘
    expect(Math.max(...maxs)).toBeGreaterThan(0.1);  // 有过明显下压

    // 两腿各自都在滚（各自都出现过上翘与下压）
    expect(rows.some((r) => r.ballL < -0.05)).toBe(true);
    expect(rows.some((r) => r.ballL > 0.1)).toBe(true);
    expect(rows.some((r) => r.ballR < -0.05)).toBe(true);
    expect(rows.some((r) => r.ballR > 0.1)).toBe(true);

    // 交替：摆动期一侧返回 0，所以「只有一条腿在折」的帧应占多数。
    // 左右相位差 π，两腿**不会同时**折 —— 这是「一只脚在地上滚、另一只在空中」
    // 的直接读数，比符号相乘可靠（0 × 任何数 = 0）。
    const exclusive = rows.filter(
      (r) => (Math.abs(r.ballL) > 1e-4) !== (Math.abs(r.ballR) > 1e-4),
    ).length;
    // 实测约 40%（另一半帧两腿都在「全掌贴地」的中段，折角为 0），下限取 25%。
    expect(exclusive).toBeGreaterThan(rows.length * 0.25);
  });

  it('静止时归零：不把某个相位的折角留在待机姿态上', () => {
    const { w, rig } = build();
    // 先走一段，让相位停在一个「非零折角」的位置
    tick(w, rig, 90, intent({ moveZ: 1 }));
    // 松手站住：速度衰减 → 权重归零
    tick(w, rig, 90, intent({}));
    const d = rig.gaitDebug();
    expect(Math.abs(d.ballL)).toBeLessThan(1e-3);
    expect(Math.abs(d.ballR)).toBeLessThan(1e-3);
  });

  it('攻击跨步期间也折（权重取 speed 与 attackBlend 的较大者）', () => {
    const { w, rig } = build();
    tick(w, rig, 10, intent({}));
    let sawNonZero = false;
    for (let i = 0; i < 60; i++) {
      const it = intent({ attackPressed: i === 0, attackHeld: true });
      step(w, w.config.fixedDt, it);
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      const d = rig.gaitDebug();
      if (Math.abs(d.ballL) > 1e-3 || Math.abs(d.ballR) > 1e-3) sawNonZero = true;
    }
    expect(sawNonZero).toBe(true);
  });
});
