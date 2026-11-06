import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  hurtHitHeight, hurtIntensity, lerpProfile, solveHurtPose,
} from '../src/presentation/hurt-pose';
import type { AppConfig, HurtState, HurtViewConfig } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

function cfg(over: Partial<HurtViewConfig> = {}): HurtViewConfig {
  const c = JSON.parse(JSON.stringify(raw.view.hurt)) as HurtViewConfig;
  return Object.assign(c, over);
}

/** p = 1 - timer/duration = 0.5，落在脉冲回弹段（两端为 0，中段 > 0）。 */
function hurt(over: Partial<HurtState> = {}): HurtState {
  return {
    type: 'heavy', timer: 0.16, duration: 0.32,
    dirX: 0, dirZ: -1, knockX: 0, knockZ: 0,
    ...over,
  };
}

describe('v8f 受击分层纯函数：力度 / 部位 / 方向 / 重心', () => {
  it('hurtIntensity：none=0，light < heavy < knock，负值兜底为 0', () => {
    const c = cfg();
    expect(hurtIntensity(hurt({ type: 'none' }), c)).toBe(0);
    expect(hurtIntensity(hurt({ type: 'light' }), c)).toBe(c.leanLight);
    expect(hurtIntensity(hurt({ type: 'heavy' }), c)).toBe(c.leanHeavy);
    expect(hurtIntensity(hurt({ type: 'knock' }), c)).toBe(c.leanKnock);
    expect(c.leanLight).toBeLessThan(c.leanHeavy);
    expect(c.leanHeavy).toBeLessThan(c.leanKnock);
    const bad = cfg({ leanHeavy: -1 });
    expect(hurtIntensity(hurt({ type: 'heavy' }), bad)).toBe(0);
  });

  it('hurtHitHeight：按类型查表；force>=0 强制覆盖；越界 / 非法一律夹到 0..1', () => {
    const c = cfg();
    expect(hurtHitHeight(hurt({ type: 'light' }), c)).toBe(c.hitHeight.light);
    expect(hurtHitHeight(hurt({ type: 'heavy' }), c)).toBe(c.hitHeight.heavy);
    expect(hurtHitHeight(hurt({ type: 'knock' }), c)).toBe(c.hitHeight.knock);
    expect(hurtHitHeight(hurt(), cfg({ forceHitHeight: 0 }))).toBe(0);      // 强制打腹
    expect(hurtHitHeight(hurt(), cfg({ forceHitHeight: 1 }))).toBe(1);      // 强制打肩
    expect(hurtHitHeight(hurt(), cfg({ forceHitHeight: 5 }))).toBe(1);
    expect(hurtHitHeight(hurt(), cfg({ forceHitHeight: Number.NaN }))).toBe(c.hitHeight.heavy);
    expect(hurtHitHeight(hurt(), cfg({ forceHitHeight: -1, hitHeight: { light: 3, heavy: -2, knock: 0.5 } }))).toBe(0);
    expect(hurtHitHeight(hurt({ type: 'none' }), c)).toBe(0);
  });

  it('lerpProfile：0 = 纯腹部、1 = 纯肩部、0.5 = 逐字段中点', () => {
    const c = cfg();
    const a = c.abdomen;
    const b = c.shoulder;
    expect(lerpProfile(a, b, 0)).toEqual(a);
    expect(lerpProfile(a, b, 1)).toEqual(b);
    const mid = lerpProfile(a, b, 0.5);
    for (const k of Object.keys(a) as (keyof typeof a)[]) {
      expect(mid[k]).toBeCloseTo((a[k] + b[k]) / 2, 12);
    }
    // 超出范围也夹紧，不会外插出超大姿态
    expect(lerpProfile(a, b, 3)).toEqual(b);
    expect(lerpProfile(a, b, -2)).toEqual(a);
  });

  it('方向性：正面命中朝后倒（pitch<0）、背后朝前倒（pitch>0）、侧面侧倾', () => {
    const c = cfg();
    const front = solveHurtPose(hurt({ dirX: 0, dirZ: -1 }), 0, c);
    const back = solveHurtPose(hurt({ dirX: 0, dirZ: 1 }), 0, c);
    const right = solveHurtPose(hurt({ dirX: 1, dirZ: 0 }), 0, c);
    expect(front.localFwd).toBeCloseTo(-1, 12);
    expect(back.localFwd).toBeCloseTo(1, 12);
    expect(right.localRight).toBeCloseTo(1, 12);
    expect(front.upperPitch).toBeLessThan(0);
    expect(back.upperPitch).toBeGreaterThan(0);
    expect(right.upperRoll).toBeLessThan(0);
    // 身体朝向转 90° 时，同一世界方向应落在不同局部轴上
    const rotated = solveHurtPose(hurt({ dirX: 0, dirZ: -1 }), Math.PI / 2, c);
    expect(rotated.localFwd).toBeCloseTo(0, 12);
    expect(Math.abs(rotated.localRight)).toBeCloseTo(1, 12);
  });

  it('分层量齐备：上半身位移 / 重心 / 屁股后坐 / 下沉 / 屈膝 / 髋前倾 / 手臂全非零', () => {
    const p = solveHurtPose(hurt(), 0, cfg());
    expect(p.active).toBe(true);
    expect(p.legacy).toBe(false);
    expect(p.upperShift).toBeGreaterThan(0);
    expect(p.comShift).toBeGreaterThan(0);
    expect(p.pelvisBack).toBeGreaterThan(0);
    expect(p.drop).toBeGreaterThan(0);
    expect(p.knee).toBeGreaterThan(0);
    expect(p.hip).toBeGreaterThan(0);
    expect(p.flash).toBeGreaterThan(0);
    expect(Math.abs(p.upperPitch)).toBeGreaterThan(0);
  });

  it('核心诉求：整体重心偏离幅度 < 身体反应幅度，且两者都随力度线性增长', () => {
    const c = cfg();
    const seq = (['light', 'heavy', 'knock'] as const).map((t) =>
      solveHurtPose(hurt({ type: t }), 0, c));
    for (const p of seq) {
      expect(p.comShift).toBeLessThan(p.upperShift);
      expect(p.comShift / p.upperShift).toBeLessThan(0.5); // 明显更小，不是擦边
    }
    // 力度递增时，重心与身体反应都单调增大（同一部位 / 同一进度）
    expect(seq[0].comShift).toBeLessThan(seq[1].comShift);
    expect(seq[1].comShift).toBeLessThan(seq[2].comShift);
    expect(seq[0].upperShift).toBeLessThan(seq[1].upperShift);
    expect(seq[1].upperShift).toBeLessThan(seq[2].upperShift);
    expect(seq[0].knee).toBeLessThan(seq[2].knee);
  });

  it('打肩 vs 打腹：同一次受击换部位，肩部扭转/侧倾更大、腹部蜷缩/屈膝/下沉更多', () => {
    // 用斜向命中（带侧向分量）才能观察到 upperYaw / upperRoll 的部位差异
    const hit = hurt({ dirX: 0.6, dirZ: -0.8 });
    const belly = solveHurtPose(hit, 0, cfg({ forceHitHeight: 0 }));
    const shoulder = solveHurtPose(hit, 0, cfg({ forceHitHeight: 1 }));
    expect(belly.hitHeight).toBe(0);
    expect(shoulder.hitHeight).toBe(1);
    // 力度与进度完全一致，只有部位不同
    expect(belly.intensity).toBe(shoulder.intensity);
    expect(belly.pulse).toBe(shoulder.pulse);
    expect(shoulder.upperYaw).toBeGreaterThan(belly.upperYaw);       // 打肩扭转更明显
    expect(shoulder.upperShift).toBeGreaterThan(belly.upperShift);
    expect(belly.knee).toBeGreaterThan(shoulder.knee);               // 打腹屈膝更多
    expect(belly.drop).toBeGreaterThan(shoulder.drop);               // 打腹下沉更多
    expect(belly.pelvisBack).toBeGreaterThan(shoulder.pelvisBack);   // 打腹屁股后坐更多
    expect(belly.upperPitch).toBeGreaterThan(shoulder.upperPitch);   // fold 让躯干前屈
    expect(belly.arm).toBeGreaterThan(0);                            // 打腹手臂收拢
    expect(shoulder.arm).toBeLessThan(0);                             // 打肩手臂被甩开
  });

  it('脉冲：进度两端归零、中段连续无跳变、命中当帧不会单帧突跳到峰值', () => {
    const c = cfg();
    const samples: number[] = [];
    for (let i = 0; i <= 200; i++) {
      const p = i / 200;
      samples.push(solveHurtPose(hurt({ timer: (1 - p) * 0.32 }), 0, c).pulse);
    }
    expect(samples[0]).toBe(0);
    expect(samples[200]).toBe(0);
    expect(Math.max(...samples)).toBeGreaterThan(0.99);
    let maxJump = 0;
    for (let i = 1; i < samples.length; i++) {
      maxJump = Math.max(maxJump, Math.abs(samples[i] - samples[i - 1]));
    }
    expect(maxJump).toBeLessThan(0.05); // 200 步扫全程，单步变化有界（无瞬跳）
    // 峰值不在 p=0（命中当帧从 0 平滑起振），而是前 pulseRatio 快速到位。
    // p=0.005 时脉冲仅 0.049，对应姿态位移 < 0.01 m，不会单帧突跳到峰值。
    expect(samples[1]).toBeLessThan(0.06);
    expect(samples[2]).toBeGreaterThan(samples[1]);
    expect(samples[Math.round(c.pulseRatio * 200)]).toBeGreaterThan(0.99);
  });

  it('enabled=false：旧版对照只有整体倾斜 + 下沉 + 闪色，腿 / 骨盆 / 重心全 0', () => {
    const p = solveHurtPose(hurt(), 0, cfg({ enabled: false }));
    expect(p.legacy).toBe(true);
    expect(p.active).toBe(true);
    expect(p.upperPitch).toBeLessThan(0);   // 仍保留方向性后仰
    expect(p.drop).toBeGreaterThan(0);
    expect(p.flash).toBeGreaterThan(0);
    expect(p.upperShift).toBe(0);
    expect(p.comShift).toBe(0);
    expect(p.pelvisBack).toBe(0);
    expect(p.knee).toBe(0);
    expect(p.hip).toBe(0);
    expect(p.arm).toBe(0);
    expect(p.upperYaw).toBe(0);
  });

  it('非法 / 结束状态兜底：duration<=0、timer 非有限、type=none 一律全零且 active=false', () => {
    const c = cfg();
    for (const h of [
      hurt({ duration: 0 }),
      hurt({ duration: -1 }),
      hurt({ timer: Number.NaN }),
      hurt({ type: 'none' }),
    ]) {
      const p = solveHurtPose(h, 0, c);
      expect(p.active).toBe(false);
      expect(p.intensity === 0 || p.pulse === 0).toBe(true);
      expect(p.knee).toBe(0);
      expect(p.pelvisBack).toBe(0);
      expect(p.flash).toBe(0);
    }
  });

  it('确定性：同一输入重复解算逐字段一致；进度推进才有变化', () => {
    const c = cfg();
    const a = solveHurtPose(hurt(), 0.7, c);
    const b = solveHurtPose(hurt(), 0.7, c);
    expect(a).toEqual(b);
    const later = solveHurtPose(hurt({ timer: 0.08 }), 0.7, c);
    expect(later.pulse).not.toBe(a.pulse);
  });
});
