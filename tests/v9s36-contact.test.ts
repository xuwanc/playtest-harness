import { describe, expect, it } from 'vitest';
import { step } from '../src/core';
import type { WeaponId, World } from '../src/core';
import { intent, makeWorld } from './helpers';

/**
 * v9s.36 · 刃身扫掠门（命中时机对齐「刀真的到人」）。
 *
 * 旧版从 active 第 0 帧就判定：那一刻 `swingCurve` 还是 -1（刃身在身后蓄势），
 * 扇形 + reach 却已经满足 → 命中并触发卡肉，画面定格在**刀还没挥出去**的姿态。
 * 现在要求「本帧刃身扫过的角度区间」覆盖目标方位角才结算。
 *
 * 这组用例锁三件事：
 *  1. 命中帧的 u 不再贴着 0（刀已经挥到身前）；
 *  2. 命中帧的刃尖角与目标方位角之差 ≤ 容差（刀真的对着目标）；
 *  3. 删掉配置就精确回到旧行为（A/B 与回滚）。
 */

type Probe = {
  /** 第一次命中时的 active 内进度（未命中 = -1） */
  u: number;
  /** 第一次命中时的 attackProgress */
  prog: number;
  /** 整段打了几次 */
  hits: number;
};

const RAD = 180 / Math.PI;

/** 命中帧的刃尖相对角（用配置里的 pts 线性插值，与 Core 同一套数据） */
function sweepAngleAt(w: World, weapon: WeaponId, combo: number, u: number): number {
  const pts = w.config.combat.weapons[weapon].hitSweep?.byCombo?.[String(combo)]?.pts;
  if (!pts || pts.length === 0) return NaN;
  if (u <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [u1, a1] = pts[i];
    if (u <= u1) {
      const [u0, a0] = pts[i - 1];
      const k = u1 > u0 ? (u - u0) / (u1 - u0) : 1;
      return a0 + (a1 - a0) * k;
    }
  }
  return pts[pts.length - 1][1];
}

function wrapDeg(a: number): number {
  let x = a;
  while (x > 180) x -= 360;
  while (x < -180) x += 360;
  return x;
}

/**
 * 站在原地点攻击一个「钉住不动」的假人。
 * @param angleDeg 目标相对攻击朝向的方位角（0 = 正前方）
 */
function probe(opts: {
  weapon: WeaponId;
  combo?: number;
  angleDeg?: number;
  dist?: number;
  sweep?: boolean;
}): Probe {
  const { weapon, combo = 1, angleDeg = 0, dist = 1.0, sweep = true } = opts;
  const w = makeWorld();
  w.modules.targeting = false;
  const p = w.config.combat.weapons[weapon];
  p.lunge = [0, 0, 0];
  p.comboCount = Math.max(3, p.comboCount);
  if (!sweep) delete p.hitSweep;

  w.combat.weapon = weapon;
  // 其它假人挪走，只留 0 号
  for (let i = 1; i < w.dummies.length; i++) {
    w.dummies[i].mode = 'idle';
    w.dummies[i].position.x = 40 + i;
    w.dummies[i].position.z = 40;
  }
  const s = w.dummies[0];
  s.mode = 'idle';
  s.velocity.x = 0;
  s.velocity.z = 0;

  // 起手一帧先让 Core 定 attackFacing
  step(w, w.config.fixedDt, intent({ attackPressed: true }));
  const facing = w.combat.attackFacing;
  const a = angleDeg / RAD;
  s.position.x = w.character.position.x + dist * Math.sin(facing + a);
  s.position.z = w.character.position.z + dist * Math.cos(facing + a);

  // 需要第 2/3 段时：直接改 comboIndex（等状态机走到对应段太慢，这里只验判定）
  w.combat.comboIndex = combo;

  let u = -1;
  let prog = -1;
  const hits0 = w.hitCount;
  for (let i = 0; i < 40; i++) {
    // 钉住目标：不让击退 / 分离把距离改掉
    s.position.x = w.character.position.x + dist * Math.sin(facing + a);
    s.position.z = w.character.position.z + dist * Math.cos(facing + a);
    s.hurt.knockX = 0;
    s.hurt.knockZ = 0;
    step(w, w.config.fixedDt, intent());
    if (w.combat.phase === 'active') {
      const dur = w.combat.timings.active;
      if (u < 0 && w.hitCount > hits0) {
        u = dur > 0 ? w.combat.phaseTimer / dur : 1;
        prog = w.combat.attackProgress;
      }
    }
  }
  return { u, prog, hits: w.hitCount - hits0 };
}

describe('v9s.36 · 刃身扫掠门', () => {
  it('剑盾第一段：命中发生在挥到身前（u ≥ 0.35），不是起手第一帧', () => {
    const r = probe({ weapon: 'sword-shield', combo: 1 });
    expect(r.hits).toBe(1);
    expect(r.u).toBeGreaterThanOrEqual(0.35);
    // 旧版是 u ≈ 0.08（active 第 1 帧）
    expect(r.u).toBeLessThan(0.8);
  });

  it('命中帧刃尖角与目标方位角之差在容差内（刀真的对着人）', () => {
    for (const weapon of ['sword-shield', 'dual-swords', 'greatsword'] as WeaponId[]) {
      for (const combo of [1, 2]) {
        const r = probe({ weapon, combo, angleDeg: 0 });
        expect(r.hits, `${weapon} c${combo} 应命中`).toBe(1);
        // 判据不是「命中那一刻角度恰好在 0°」——60Hz 一帧就扫过 ~20°，
        // 而是「本帧扫过的区间真的包含目标方位」，这才是门的定义。
        const cfg = makeCfgWorld(weapon);
        const a0 = sweepAngleAt(cfg, weapon, combo, 0);
        const a1 = sweepAngleAt(cfg, weapon, combo, r.u);
        const lo = Math.min(a0, a1);
        const hi = Math.max(a0, a1);
        expect(lo <= 0 && 0 <= hi, `${weapon} c${combo} 区间 [${lo.toFixed(1)}, ${hi.toFixed(1)}]`).toBe(true);
      }
    }
  });

  it('删掉 hitSweep = 回到旧行为（第一帧就判）', () => {
    const r = probe({ weapon: 'sword-shield', combo: 1, sweep: false });
    expect(r.hits).toBe(1);
    expect(r.u).toBeLessThan(0.2);
  });

  it('侧面目标比正前方更早吃到刀（刃尖先扫到侧面）', () => {
    const front = probe({ weapon: 'sword-shield', combo: 1, angleDeg: 0 });
    const side = probe({ weapon: 'sword-shield', combo: 1, angleDeg: 50 });
    expect(front.hits).toBe(1);
    expect(side.hits).toBe(1);
    // 第一段从 +148° 扫到 -78°：50° 比 0° 先经过
    expect(side.u).toBeLessThan(front.u - 0.02);
  });

  it('突刺段（剑盾第三段）在 stabU 之前不结算', () => {
    const r = probe({ weapon: 'sword-shield', combo: 3, angleDeg: 40 });
    expect(r.hits).toBe(1);
    expect(r.u).toBeGreaterThanOrEqual(0.42);
  });

  it('正后方的目标仍然打不到（扇形 + 扫掠双重拦截）', () => {
    const r = probe({ weapon: 'sword-shield', combo: 1, angleDeg: 180 });
    expect(r.hits).toBe(0);
  });

  it('大剑第二段（反手）在 u ≈ 0.2 就到位，不会被门拖到很晚', () => {
    const r = probe({ weapon: 'greatsword', combo: 2, angleDeg: 0 });
    expect(r.hits).toBe(1);
    expect(r.u).toBeGreaterThanOrEqual(0.1);
    expect(r.u).toBeLessThan(0.45);
  });
});

/** 只为了读配置表（不影响判定），避免在断言里再构造一遍世界 */
function makeCfgWorld(weapon: WeaponId): World {
  const w = makeWorld();
  w.combat.weapon = weapon;
  return w;
}
