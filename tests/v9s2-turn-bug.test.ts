import { describe, expect, it } from 'vitest';
import { wrapAngle, turnInPlaceUpdate } from '../src/core';
import { makeWorld, intent } from './helpers';

const DT = 1 / 60;

/**
 * 隔离驱动 turnInPlaceUpdate（不经过 orientation），把 bodyYaw 与目视目标放在
 * ±π 接缝两侧，验证转身沿「最短弧」完成：累计旋转量（逐帧解卷）的方向 = 短弧方向，
 * 且幅度 << π（一次转身绝不走长弧 / 反向整圈）。
 *
 * 度量关键：用「逐帧 wrapAngle 差累加」得到真实累计转角，不能用 wrapAngle(bodyYaw-fromYaw)
 * 直接算（会被再次 wrap 压缩掉长弧）。一次 turnInPlace 转角必 <= π（还留 settleDeg 余角），
 * 因此 |累计转角| > π 即判定为「走长弧 / 反向转圈」的回归。
 */
function turnRotation(fromYaw: number, lookYaw: number): { total: number; finalYaw: number } {
  const w = makeWorld();
  w.character.bodyYaw = fromYaw;
  w.character.facing = fromYaw;
  const intents = intent({ aimActive: true, aimX: Math.sin(lookYaw), aimZ: Math.cos(lookYaw) });
  let prev = w.character.bodyYaw;
  let cum = 0;
  for (let i = 0; i < 120; i++) {
    turnInPlaceUpdate(w, DT, intents);
    cum += wrapAngle(w.character.bodyYaw - prev);
    prev = w.character.bodyYaw;
  }
  return { total: cum, finalYaw: w.character.bodyYaw };
}

describe('v9s.2 转身跨 ±π 接缝不得走长弧（反向转圈 bug 复现/修复）', () => {
  it('fromYaw≈+166°、look≈-45°：短弧 +149° 而非反向 -219°', () => {
    const from = 2.9;
    const look = -0.78;
    const short = wrapAngle(look - from); // +2.6 rad ≈ +149°
    const r = turnRotation(from, look);
    expect(Math.abs(r.total)).toBeLessThan(Math.PI); // 绝不走长弧（>π）
    expect(Math.sign(r.total)).toBe(Math.sign(short)); // 方向与短弧一致
    expect(Math.abs(r.total)).toBeGreaterThan(Math.abs(short) - 0.3); // 基本转满短弧（留 settle 余角）
  });

  it('对称：fromYaw≈-166°、look≈+45°', () => {
    const r = turnRotation(-2.9, 0.78);
    const short = wrapAngle(0.78 - -2.9);
    expect(Math.abs(r.total)).toBeLessThan(Math.PI);
    expect(Math.sign(r.total)).toBe(Math.sign(short));
  });

  it('跨接缝遍历：任意大夹角组合累计转角均 = 短弧方向且 << π', () => {
    for (let f = -3.0; f <= 3.0; f += 0.5) {
      for (let l = -3.0; l <= 3.0; l += 0.5) {
        const short = wrapAngle(l - f);
        if (Math.abs(short) < 1.0) continue; // 短弧 < triggerDeg(50°) 不触发转身，跳过
        const r = turnRotation(f, l);
        expect(Math.abs(r.total)).toBeLessThanOrEqual(Math.PI + 1e-6);
        expect(Math.sign(r.total)).toBe(Math.sign(short));
      }
    }
  });
});
