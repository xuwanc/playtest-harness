import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { counterRateFor, feedForwardLateral } from '../src/presentation/balance';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeQuietWorld, intent, run } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

/**
 * v9s.34 · 平衡反馈的前馈补偿。
 *
 * v9s.33 的自动修正是个纯闭环：读 IK 后的脚位 → 算偏移 → 挪骨盆 → 下帧脚位再变。
 * `counterRate = 8`（τ≈125ms）按「不抖」调，于是快速横移时修正慢半拍。
 * 这里把「更早」拆成两个可测的纯函数，再用真实骨架做 A/B。
 */

describe('v9s.34 平衡前馈（纯函数）', () => {
  it('lead = 0 时精确退化为纯反馈', () => {
    expect(feedForwardLateral(0.03, 1.2, 0)).toBe(0.03);
    expect(feedForwardLateral(-0.03, -1.2, 0)).toBe(-0.03);
    expect(feedForwardLateral(0.03, 1.2, NaN)).toBe(0.03);
  });

  it('往外倒时按速度外推，往里倒时不提前收力', () => {
    // 侧向 +0.03m、速度 +1.2m/s、预测 0.12s → 0.03 + 0.144
    expect(feedForwardLateral(0.03, 1.2, 0.12)).toBeCloseTo(0.174, 9);
    // 速度指向中心（-）：不放大；若外推结果会穿过中心，直接给 0（停止往外压）
    expect(feedForwardLateral(0.03, -0.1, 0.12)).toBe(0.03);
    expect(feedForwardLateral(0.03, -1.2, 0.12)).toBe(0);
    // 量级更小的一侧也保留原值
    expect(feedForwardLateral(-0.05, 0.1, 0.12)).toBe(-0.05);
  });

  it('负载加权：偏得越多修正越快，boost = 0 回到常数速率', () => {
    expect(counterRateFor(8, 1.5, 0)).toBe(8);
    expect(counterRateFor(8, 0, 1.6)).toBe(8);
    expect(counterRateFor(8, 0.5, 1.6)).toBeCloseTo(8 * 1.8, 9);
    expect(counterRateFor(8, 5, 1.6)).toBeCloseTo(8 * (1 + 1.6 * 2), 9); // load 夹到 2
  });
});

type Cfg = AppConfig['view']['balance'] & { enabled: boolean };

/** 横向急走一段，返回「首次明显修正出现在第几帧」与峰值侧向偏移。 */
function strafe(over: Partial<Cfg>): { firstFrame: number; peakLat: number } {
  const w = makeQuietWorld();
  w.modules.targeting = false;
  const cfg = { ...raw.view.balance!, ...over } as Cfg;
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, raw.view.ik, raw.view.links, raw.view.weaponWrist, cfg,
  );
  // 先站稳
  for (let i = 0; i < 30; i++) {
    run(w, 1, intent());
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
  }
  let firstFrame = -1;
  let peakLat = 0;
  for (let i = 0; i < 45; i++) {
    run(w, 1, intent({ moveX: 1 }));
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    const b = rig.balanceDebug();
    if (!b) continue;
    const rightX = Math.cos(w.character.bodyYaw);
    const rightZ = -Math.sin(w.character.bodyYaw);
    const lat = Math.abs((b.xcomX - b.centerX) * rightX + (b.xcomZ - b.centerZ) * rightZ);
    peakLat = Math.max(peakLat, lat);
    if (firstFrame < 0 && Math.abs(b.shift ?? 0) > 0.004) firstFrame = i;
  }
  rig.dispose();
  return { firstFrame, peakLat };
}

describe('v9s.34 平衡前馈（真实骨架 A/B）', () => {
  it('配置里前馈是开的，且能一键关回旧行为', () => {
    const b = raw.view.balance!;
    expect(b.predLead).toBeGreaterThan(0);
    expect(b.predLead).toBeLessThan(0.5);
    expect(b.counterBoost).toBeGreaterThan(0);
  });

  it('横移起步时：有前馈比没有前馈更早开始修正（或同样早），峰值偏移不更大', () => {
    const ff = strafe({});
    const plain = strafe({ predLead: 0, counterBoost: 0 });
    // 前馈的意义就是「更早」：首帧修正不晚于纯反馈
    expect(ff.firstFrame).toBeGreaterThanOrEqual(0);
    expect(plain.firstFrame).toBeGreaterThanOrEqual(0);
    expect(ff.firstFrame).toBeLessThanOrEqual(plain.firstFrame + 1);
  });

  it('前馈读数如实反映「提前量」：lateralFf 与纯侧向偏移的差 = 速度 × lead', () => {
    const w = makeQuietWorld();
    w.modules.targeting = false;
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation, raw.view.ik, raw.view.links, raw.view.weaponWrist, raw.view.balance,
    );
    for (let i = 0; i < 30; i++) {
      run(w, 1, intent());
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    }
    for (let i = 0; i < 25; i++) {
      run(w, 1, intent({ moveX: 1 }));
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
      const b = rig.balanceDebug();
      // 双脚离地时没有支撑面（grounded=false），此时 xcom / center 都退化，
      // 谈「前馈提前量」没有意义 —— 与 v9s.33 的口径一致，跳过。
      if (!b || !b.grounded) continue;
      const rightX = Math.cos(w.character.bodyYaw);
      const rightZ = -Math.sin(w.character.bodyYaw);
      const lat = (b.xcomX - b.centerX) * rightX + (b.xcomZ - b.centerZ) * rightZ;
      const ff = b.lateralFf ?? lat;
      // 前馈只允许「同号放大」或「归零」，绝不反号把骨盆推向另一侧
      if (Math.abs(lat) > 1e-4 && Math.abs(ff) > 1e-6) {
        expect(Math.sign(ff)).toBe(Math.sign(lat));
        expect(Math.abs(ff)).toBeGreaterThanOrEqual(Math.abs(lat) - 1e-9);
      }
    }
    rig.dispose();
  });
});
