import { describe, expect, it } from 'vitest';
import {
  BREAK_FALL_TARGET, createDestructibleStates, cutColumnHeights, cutPlane,
  destructiblesReset, destructiblesUpdate, forceBreak, snapshot, restoreWorld,
} from '../src/core';
import type { DestructibleSpec, World } from '../src/core';
import { intent, makeWorld } from './helpers';

const POLE: DestructibleSpec = {
  id: 'pole-a', kind: 'pole',
  x: 0, y: 0, z: 1,
  height: 2.4, radius: 0.11,
  tiltDeg: 20,
};

const JAR: DestructibleSpec = {
  id: 'jar-a', kind: 'jar',
  x: 0, y: 0, z: 1,
  height: 0.9, radius: 0.28,
  tiltDeg: 14,
  bands: [0.35, 0.62],
};

const cut = (hitY: number, dx: number, dy: number, dz: number, spec = POLE) => cutPlane(
  hitY, spec.y, spec.height, spec.radius, dx, dy, dz,
  { tiltDeg: spec.tiltDeg ?? 20, bands: spec.bands },
);

/** 让 currentMeleeShape 处于有效命中窗口的测试世界。 */
function armed(spec: DestructibleSpec = POLE): World {
  const w = makeWorld();
  w.destructibles = createDestructibleStates([spec]);
  // staff 没有 hitWindow / hitSweep 门，测试只关心「刀风有没有覆盖物件」这一层。
  w.combat.weapon = 'staff';
  w.combat.phase = 'active';
  w.combat.timings.active = 0.3;
  w.combat.phaseTimer = 0.15;
  w.combat.attackFacing = 0;
  w.character.position.x = 0;
  w.character.position.z = 0;
  w.config.hits.arcDeg = 180;
  return w;
}

describe('v9s.45 · cutPlane 断面数学', () => {
  it('断面高度只由命中点决定：低打低断、高打高断、两端夹紧', () => {
    const low = cut(0.4, 1, 0, 0);
    const mid = cut(1.2, 1, 0, 0);
    const high = cut(2.0, 1, 0, 0);
    expect(low.u).toBeCloseTo(0.4 / 2.4, 6);
    expect(mid.u).toBeCloseTo(0.5, 6);
    expect(high.u).toBeCloseTo(2.0 / 2.4, 6);
    expect(low.u).toBeLessThan(mid.u);
    expect(mid.u).toBeLessThan(high.u);
    // 不切在底座 / 顶端
    expect(cut(-5, 1, 0, 0).u).toBeCloseTo(0.08, 6);
    expect(cut(99, 1, 0, 0).u).toBeCloseTo(0.92, 6);
  });

  it('断面高度随命中点严格单调（连续 40 个采样）', () => {
    let prev = -1;
    for (let i = 0; i <= 40; i++) {
      const u = cut(0.2 + (i / 40) * 2.0, 1, 0, 0).u;
      expect(u).toBeGreaterThan(prev);
      prev = u;
    }
  });

  it('改变攻击方向不会改变断面高度（h 与 n 正交）', () => {
    const a = cut(1.2, 1, 0, 0);
    const b = cut(1.2, 0, -0.8, -1);
    const c = cut(1.2, -1, 0, 0);
    expect(b.u).toBeCloseTo(a.u, 10);
    expect(c.u).toBeCloseTo(a.u, 10);
  });

  it('水平挥击时法线仍以竖直为主：不会把杆纵向劈开', () => {
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const p = cut(1.2, dx, 0, dz);
      expect(p.ny).toBeGreaterThan(0.5);
      expect(Math.hypot(p.nx, p.ny, p.nz)).toBeCloseTo(1, 6);
    }
    // 若错误地令 n = d，水平挥击会得到 ny = 0；这里必须不是。
    expect(cut(1.2, 1, 0, 0).ny).not.toBeCloseTo(0, 3);
  });

  it('法线倾斜方向跟随攻击的水平投影（切口朝攻击方向）', () => {
    const east = cut(1.2, 1, 0, 0);
    const west = cut(1.2, -1, 0, 0);
    const south = cut(1.2, 0, 0, 1);
    expect(east.nx).toBeGreaterThan(0);
    expect(west.nx).toBeLessThan(0);
    expect(south.nx).toBeCloseTo(0, 6);
    expect(south.nz).toBeGreaterThan(0);
    // 相反方向攻击 → 法线恰好镜像
    expect(east.nx).toBeCloseTo(-west.nx, 6);
  });

  it('从高处往下打：断面高度不变，但切口明显更斜', () => {
    const flat = cut(1.2, 1, 0, 0);
    const down = cut(1.2, 1, -0.7, 0);
    expect(down.u).toBeCloseTo(flat.u, 10);
    expect(down.theta).toBeGreaterThan(flat.theta);
    expect(down.ny).toBeLessThan(flat.ny);
  });

  it('倾角有几何上限：每根母线截断高度都落在 [0, height]，cap 不被削破', () => {
    const p = cut(0.45, 1, -1, 0, JAR);
    const hs = cutColumnHeights(JAR.radius, 16, p.u, JAR.height, p.nx, p.ny, p.nz);
    expect(hs).toHaveLength(16);
    for (const h of hs) {
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(JAR.height);
    }
    // 斜切面确实不是水平的
    expect(Math.max(...hs) - Math.min(...hs)).toBeGreaterThan(0.01);
  });

  it('完好态（cutU=1, n=up）所有母线截断高度恰为 height', () => {
    const hs = cutColumnHeights(POLE.radius, 10, 1, POLE.height, 0, 1, 0);
    for (const h of hs) expect(h).toBeCloseTo(POLE.height, 10);
  });

  it('瓶罐命中高度吸附到最近的预设断裂带', () => {
    expect(cut(0.30, 1, 0, 0, JAR).u).toBeCloseTo(0.35, 6);
    expect(cut(0.55, 1, 0, 0, JAR).u).toBeCloseTo(0.62, 6);
    expect(cut(0.80, 1, 0, 0, JAR).u).toBeCloseTo(0.62, 6);
  });

  it('翻倒轴是单位向量、恒水平、且与攻击水平投影正交', () => {
    for (const [dx, dz] of [[1, 0], [0, 1], [0.6, 0.8]]) {
      const p = cut(1.2, dx, 0, dz);
      expect(p.ay).toBe(0);
      expect(Math.hypot(p.ax, p.ay, p.az)).toBeCloseTo(1, 6);
      expect(p.ax * dx + p.az * dz).toBeCloseTo(0, 6);
    }
  });

  it('纯函数确定性：同输入两次逐字节一致', () => {
    expect(cut(1.37, 0.6, -0.3, 0.8)).toEqual(cut(1.37, 0.6, -0.3, 0.8));
  });
});

describe('v9s.45 · 状态机与真机链路', () => {
  it('forceBreak 写状态并发一条 break 事件，y = 断面世界高度', () => {
    const w = armed();
    expect(forceBreak(w, 'pole-a', 1.8, 1, 0, 0)).toBe(true);
    const st = w.destructibles[0];
    expect(st.broken).toBe(1);
    expect(st.cutU).toBeCloseTo(1.8 / 2.4, 6);
    expect(st.ny).toBeGreaterThan(0.5);
    const ev = w.events.find((e) => e.type === 'break');
    expect(ev).toBeDefined();
    expect(ev!.y).toBeCloseTo(1.8, 6);
    expect(ev!.value).toBe(0);
  });

  it('已断物件不会重复断（一次干净断）', () => {
    const w = armed();
    expect(forceBreak(w, 'pole-a', 1.0, 1, 0, 0)).toBe(true);
    expect(forceBreak(w, 'pole-a', 2.0, -1, 0, 0)).toBe(false);
    expect(w.destructibles[0].cutU).toBeCloseTo(1.0 / 2.4, 6);
  });

  it('destructiblesReset 回到完好直立且不改其它世界状态', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 1.5, 1, 0, 0);
    destructiblesUpdate(w, 0.016, intent({}));
    const tick = w.tick;
    destructiblesReset(w);
    expect(w.destructibles[0].broken).toBe(0);
    expect(w.destructibles[0].cutU).toBe(1);
    expect(w.destructibles[0].fall).toBe(0);
    expect(w.tick).toBe(tick);
  });

  it('非 active 帧：即使有 breakHits 也不响应（闸门同源）', () => {
    const w = armed();
    w.combat.phase = 'idle';
    destructiblesUpdate(w, 0.016, intent({
      breakHits: [{ id: 'pole-a', x: 0, y: 1.2, z: 1, dx: 1, dy: 0, dz: 0 }],
    }));
    expect(w.destructibles[0].broken).toBe(0);
  });

  it('active 帧且刀风覆盖物件：breakHits 生效并留下断面读数', () => {
    const w = armed();
    destructiblesUpdate(w, 0.016, intent({
      breakHits: [{ id: 'pole-a', x: 0, y: 1.8, z: 1, dx: 1, dy: 0, dz: 0 }],
    }));
    expect(w.destructibles[0].broken).toBe(1);
    expect(w.destructibles[0].cutU).toBeCloseTo(0.75, 6);
  });

  it('横扫能打断侧面物件：3D 相交口径不被 2D 扇形否决', () => {
    const w = armed();
    // 物件在正侧方（+x），attackFacing=0 的扇形不覆盖它，但刀刃线段确实扫到了。
    w.destructibles[0].x = 1.2;
    w.destructibles[0].z = 0;
    destructiblesUpdate(w, 0.016, intent({
      breakHits: [{ id: 'pole-a', x: 1.2, y: 1.2, z: 0, dx: 1, dy: 0, dz: 0 }],
    }));
    expect(w.destructibles[0].broken).toBe(1);
    expect(w.destructibles[0].cutU).toBeCloseTo(0.5, 6);
  });

  it('翻倒角单调收敛到目标且不越过（固定步长确定性）', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 1.2, 1, 0, 0);
    let prev = -1;
    for (let i = 0; i < 200; i++) {
      destructiblesUpdate(w, 0.016, intent({}));
      const f = w.destructibles[0].fall;
      expect(f).toBeGreaterThan(prev);
      expect(f).toBeLessThan(BREAK_FALL_TARGET);
      prev = f;
    }
    expect(prev).toBeCloseTo(BREAK_FALL_TARGET, 3);
  });

  it('快照 / 恢复后继续推进与未中断一致（破坏状态随 World 回放）', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 1.6, 0, -0.6, 1);
    for (let i = 0; i < 20; i++) destructiblesUpdate(w, 0.016, intent({}));
    const twin = restoreWorld(snapshot(w));
    for (let i = 0; i < 20; i++) destructiblesUpdate(w, 0.016, intent({}));
    for (let i = 0; i < 20; i++) destructiblesUpdate(twin, 0.016, intent({}));
    expect(snapshot(twin)).toBe(snapshot(w));
  });

  it('不配置物件时状态为空数组，模块更新是纯 no-op', () => {
    const w = makeWorld();
    expect(w.destructibles).toEqual([]);
    const before = snapshot(w);
    destructiblesUpdate(w, 0.016, intent({ breakHits: [] }));
    expect(snapshot(w)).toBe(before);
  });
});
