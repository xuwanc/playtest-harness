import { describe, expect, it } from 'vitest';
import { createClock } from '../src/adapters/clock';
import { applyPose, blendPose, canInterpolate, capturePose } from '../src/adapters/pose-interp';
import type { PoseSnapshot } from '../src/adapters/pose-interp';
import { createYawSmoother, YAW_SNAP_RAD } from '../src/presentation/yaw-smooth';
import { intent, makeQuietWorld } from './helpers';

/**
 * v9s.35 · 朝向平滑 + 插值清单补齐。
 *
 * 用户反馈：「慢放时角色方向也一顿一顿」。位置在 v9s.34 已经插值，朝向为何还跳？
 *  - 角速度仍是阶梯：15Hz 的模拟被摊成 4 个线性小段，段边界上速度突跳；
 *    肩 / 手 / 武器挂在 0.4~0.8m 半径上，突跳被放大成肉眼可见的顿挫。
 *  - 另外翻滚 / 原地转身 / 派生招的进度根本没进快照，慢放时整圈旋转分 15 次跳。
 * 这些用例把两件事都钉成数字：低通的收敛行为，和快照覆盖了哪些连续量。
 */

const DEG = 180 / Math.PI;

describe('v9s.35 · 朝向低通', () => {
  it('tau=0 直通，不做任何平滑（A/B 关闭路径）', () => {
    const s = createYawSmoother();
    s.update(0, 1 / 60, 0);
    for (const target of [0.3, 0.9, -1.2, 2.4]) {
      expect(s.update(target, 1 / 60, 0)).toBeCloseTo(target, 10);
    }
  });

  it('首帧直接对齐，不从 0 度转出来', () => {
    const s = createYawSmoother();
    expect(s.ready).toBe(false);
    expect(s.update(2.2, 1 / 60, 35)).toBeCloseTo(2.2, 10);
    expect(s.ready).toBe(true);
  });

  it('台阶输入（15Hz 模拟 @ 60Hz 渲染）被抹成单调、无零增量的连续序列', () => {
    const s = createYawSmoother();
    const tau = 35;
    // 每 4 帧一个台阶：模拟 0.25× 时正是这个节奏
    const targets: number[] = [];
    // 第 0 帧就已经在动，否则前 4 帧目标恒等于初值，测出来是「没动」而不是「平滑」
    for (let i = 0; i < 40; i++) targets.push(((i >> 2) + 1) * (6 / DEG));
    // 从 0 起步、目标立刻抬起：模拟「刚开始转身」那一段
    s.reset(0);
    let prev = 0;
    const deltas: number[] = [];
    for (let i = 0; i < targets.length; i++) {
      const y = s.update(targets[i], 1 / 60, tau);
      deltas.push(Math.abs(y - prev));
      prev = y;
    }
    expect(deltas.every((d) => d > 1e-7)).toBe(true);          // 没有一帧完全不动
    expect(Math.max(...deltas)).toBeLessThanOrEqual(6 / DEG);  // 永远不快于输入台阶
    // 单调趋近、不超调：每个台阶结束后不应越过目标
    expect(prev).toBeLessThanOrEqual(targets[targets.length - 1] + 1e-9);
  });

  it('瞬移（单帧 120°）直接对齐，不「横着飘过去」', () => {
    const s = createYawSmoother();
    s.update(0, 1 / 60, 35);
    const jump = YAW_SNAP_RAD * 2;
    expect(s.update(jump, 1 / 60, 35)).toBeCloseTo(jump, 10);
  });

  it('收敛与帧率无关：60Hz 与 120Hz 跑 0.2s 后差距 < 1°', () => {
    const a = createYawSmoother();
    const b = createYawSmoother();
    a.update(0, 1 / 60, 35);
    b.update(0, 1 / 120, 35);
    for (let i = 0; i < 12; i++) a.update(Math.PI / 2, 1 / 60, 35);
    for (let i = 0; i < 24; i++) b.update(Math.PI / 2, 1 / 120, 35);
    expect(Math.abs(a.value - b.value) * DEG).toBeLessThan(1);
  });

  it('跨 ±π 走最短弧，不会倒转一整圈', () => {
    const s = createYawSmoother();
    s.reset(Math.PI - 0.05);
    const y = s.update(-Math.PI + 0.05, 1 / 60, 35);
    // 应该往 + 方向越过 π，而不是退回去 6.2 rad
    expect(Math.abs(y - Math.PI) < 0.1 || Math.abs(y + Math.PI) < 0.1).toBe(true);
  });
});

describe('v9s.35 · 插值清单', () => {
  it('翻滚进度 / 转身进度 / 派生招进度 / 速度都走插值', () => {
    const w = makeQuietWorld();
    w.dash.timer = 0.4;
    w.turnInPlace.progress = 0.2;
    w.playerLink.progress = 0.6;
    w.character.velocity = { x: 2, y: 0, z: -4 };
    const a = capturePose(w);

    w.dash.timer = 0.2;
    w.turnInPlace.progress = 0.6;
    w.playerLink.progress = 0.8;
    w.character.velocity = { x: 4, y: 0, z: -2 };
    const b = capturePose(w);

    expect(canInterpolate(a, b)).toBe(true);
    const o = blendPose(a, b, 0.5);
    expect(o.dash.timer).toBeCloseTo(0.3, 10);
    expect(o.turn.progress).toBeCloseTo(0.4, 10);
    expect(o.link.progress).toBeCloseTo(0.7, 10);
    expect(o.character.velocity?.x).toBeCloseTo(3, 10);
    expect(o.character.velocity?.z).toBeCloseTo(-3, 10);
  });

  it('applyPose 只替换连续量，且不修改原 World', () => {
    const w = makeQuietWorld();
    w.dash.timer = 0.4;
    w.turnInPlace.phase = 'active';
    const before = { dash: { ...w.dash }, turn: { ...w.turnInPlace } };
    const a = capturePose(w);
    w.dash.timer = 0.2;
    const b = capturePose(w);
    const posed = applyPose(w, blendPose(a, b, 0.5));

    expect(posed.dash.timer).toBeCloseTo(0.3, 10);
    expect(posed.dash.phase).toBe(w.dash.phase);
    expect(posed.turnInPlace.phase).toBe('active');
    // 原对象不被写坏（渲染替身是只读视图）
    expect(w.dash.timer).toBe(0.2);
    expect(w.turnInPlace).toEqual(before.turn);
    expect(posed).not.toBe(w);
    expect(posed.character).not.toBe(w.character);
  });

  it('翻滚 / 转身 / 派生招切换阶段时 snap（跨阶段插值会把两段姿势抹平）', () => {
    const w = makeQuietWorld();
    const base = capturePose(w);

    w.dash.phase = 'active';
    expect(canInterpolate(base, capturePose(w))).toBe(false);
    w.dash.phase = 'idle';

    w.turnInPlace.phase = 'active';
    expect(canInterpolate(base, capturePose(w))).toBe(false);
    w.turnInPlace.phase = 'idle';

    w.playerLink.phase = 'active';
    expect(canInterpolate(base, capturePose(w))).toBe(false);
  });
});

describe('v9s.35 · 慢放整链（Core → 插值 → 朝向低通）', () => {
  const run = (interp: boolean, smooth: boolean) => {
    const world = makeQuietWorld();
    const clock = createClock(world);
    const sm = createYawSmoother();
    let poseCur: PoseSnapshot = capturePose(world);
    let posePrev: PoseSnapshot | null = null;
    const fwd = intent({ moveX: 0, moveZ: 1 });
    const diag = intent({ moveX: 1, moveZ: 1 });
    const still = intent();

    const tick = (i: ReturnType<typeof intent>) => {
      clock.frame(1 / 60, i, 0.25, false, () => {
        posePrev = poseCur;
        poseCur = capturePose(world);
      });
      const a = clock.alpha;
      const w = interp && posePrev && canInterpolate(posePrev, poseCur) && a < 0.999
        ? applyPose(world, blendPose(posePrev, poseCur, a))
        : world;
      return sm.update(w.character.bodyYaw, 1 / 60, smooth ? 35 : 0);
    };

    for (let i = 0; i < 60; i++) tick(fwd);              // 预热：先直走起来
    const out: number[] = [];
    for (let i = 0; i < 240; i++) out.push(tick(diag));  // 斜向 → 转 45°
    const turn = out.slice();
    let last = out[out.length - 1];
    for (let i = 0; i < 120; i++) last = tick(still);    // 松手：让低通收敛到位
    // 「画面不动」只在转身段统计 —— 松手后本来就不该转
    const d = turn.slice(1).map((y, i) => Math.abs(y - turn[i]));
    return {
      zero: d.filter((v) => v < 1e-6).length,
      max: Math.max(...d),
      end: last,
    };
  };

  it('三层对比：不插值 180/240 帧画面不动，插值后 0 帧', () => {
    const base = run(false, false);
    const onlyInterp = run(true, false);
    const both = run(true, true);

    expect(base.zero).toBeGreaterThan(150);   // 「4 帧里 3 帧同一姿态」= 用户看到的一顿一顿
    expect(onlyInterp.zero).toBe(0);          // v9s.34 已经解决的问题
    expect(both.zero).toBe(0);
    // 三种显示方式最终停在同一个朝向：低通 / 插值只改「怎么到」，不改「到哪」
    expect(Math.abs(both.end - base.end) * DEG).toBeLessThan(0.1);
    expect(Math.abs(onlyInterp.end - base.end) * DEG).toBeLessThan(0.1);
    // 单帧最大转角：插值把它压到 0.25× 下肉眼看不出台阶的量级
    expect(onlyInterp.max * DEG).toBeLessThan(1.5);
  });
});

describe('v9s.35 · 低通的阶跃响应（它到底改变了什么）', () => {
  it('一帧 6° 的台阶被拆成 3 帧走完，单帧不超过台阶的 60%', () => {
    const s = createYawSmoother();
    s.reset(0);
    const stepRad = 6 / DEG;
    const out: number[] = [];
    for (let i = 0; i < 12; i++) out.push(s.update(stepRad, 1 / 60, 35));
    const d = out.map((y, i) => Math.abs(y - (i === 0 ? 0 : out[i - 1])));
    expect(Math.max(...d) * DEG).toBeLessThan(stepRad * DEG * 0.6);  // 没有一帧把 6° 全吃掉
    expect(Math.abs(out[out.length - 1] - stepRad) * DEG).toBeLessThan(0.05); // 最终still到位
  });
});
