import { describe, expect, it } from 'vitest';
import {
  BREAK_FALL_TARGET, cactusArmBoxes, clipArmBox, createDestructibleStates,
  cutBoxHeights, cutPlane, destructiblesReset, destructiblesUpdate, forceBreak,
  snapshot, restoreWorld, obbCorners,
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

const CACTUS: DestructibleSpec = {
  id: 'cac-a', kind: 'cactus',
  x: 0, y: 0, z: 1,
  height: 2.0, radius: 0.20,
  seed: 7,
};

const cut = (hitY: number, dx: number, dy: number, dz: number, spec = POLE) => cutPlane(
  hitY, spec.y, spec.height, spec.radius, dx, dy, dz,
  { tiltDeg: spec.tiltDeg ?? 20, bands: spec.bands },
);

/** 让 currentMeleeShape 处于有效命中窗口的测试世界。 */
function armed(spec: DestructibleSpec = POLE): World {
  const w = makeWorld();
  w.destructibles = createDestructibleStates([spec]);
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
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const p = cut(1.2, dx, 0, dz);
      expect(p.ny).toBeGreaterThan(0.5);
      expect(Math.hypot(p.nx, p.ny, p.nz)).toBeCloseTo(1, 6);
    }
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
    expect(east.nx).toBeCloseTo(-west.nx, 6);
  });

  it('从高处往下打：断面高度不变，但切口明显更斜', () => {
    const flat = cut(1.2, 1, 0, 0);
    const down = cut(1.2, 1, -0.7, 0);
    expect(down.u).toBeCloseTo(flat.u, 10);
    expect(down.theta).toBeGreaterThan(flat.theta);
    expect(down.ny).toBeLessThan(flat.ny);
  });

  it('翻倒轴是单位向量、恒水平、且与攻击水平投影正交', () => {
    for (const [dx, dz] of [[1, 0], [0, 1], [0.6, 0.8]] as const) {
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

describe('v9s.x · 方盒断面几何', () => {
  it('完好态（standU=1, n=up）四角高度恰为 height', () => {
    const h = cutBoxHeights(POLE.radius, 1, POLE.height, 0, 1, 0);
    for (const x of h) expect(x).toBeCloseTo(POLE.height, 10);
  });

  it('斜切：四角高度不全相等，且都落在 [0, height]', () => {
    const p = cut(1.2, 1, -0.3, 0, POLE);
    const h = cutBoxHeights(POLE.radius, p.u, POLE.height, p.nx, p.ny, p.nz);
    expect(Math.max(...h) - Math.min(...h)).toBeGreaterThan(0.01);
    for (const x of h) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(POLE.height);
    }
  });

  it('断面高度随 standU 单调（连续采样）', () => {
    let prev = -1;
    for (let i = 1; i <= 40; i++) {
      const u = i / 41;
      const h = cutBoxHeights(POLE.radius, u, POLE.height, 0, 1, 0);
      const avg = (h[0] + h[1] + h[2] + h[3]) / 4;
      expect(avg).toBeGreaterThan(prev);
      prev = avg;
    }
  });
});

describe('v9s.x · 旗杆多段砍断', () => {
  it('forceBreak 写状态、发 break 事件、站立段降到断面高度', () => {
    const w = armed();
    expect(forceBreak(w, 'pole-a', 1.8, 1, 0, 0)).toBe(true);
    const st = w.destructibles[0];
    expect(st.broken).toBe(1);
    expect(st.standU).toBeCloseTo(1.8 / 2.4, 6);
    expect(st.fragments).toHaveLength(1);
    expect(st.sny).toBeGreaterThan(0.5);
    const ev = w.events.find((e) => e.type === 'break');
    expect(ev).toBeDefined();
    expect(ev!.y).toBeCloseTo(1.8, 6);
  });

  it('可连续多次砍断：每刀掉一段、站立段递减、片段累加', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 2.0, 1, 0, 0);   // 砍下顶端一小段，standU≈0.833
    forceBreak(w, 'pole-a', 1.2, 1, 0, 0);   // 再砍，standU≈0.5
    forceBreak(w, 'pole-a', 0.6, 1, 0, 0);   // 再砍，standU≈0.25
    const st = w.destructibles[0];
    expect(st.broken).toBe(3);
    expect(st.fragments).toHaveLength(3);
    expect(st.standU).toBeLessThan(0.3);
    expect(st.standU).toBeGreaterThanOrEqual(0.08);
  });

  it('砍到只剩底座后不再断（一次干净收尾）', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 0.1, 1, 0, 0);   // 砍到接近底座，standU≈MIN_STAND
    expect(forceBreak(w, 'pole-a', 2.0, -1, 0, 0)).toBe(false);
    expect(w.destructibles[0].fragments).toHaveLength(1);
  });

  it('destructiblesReset 回到完好直立、清空片段', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 1.5, 1, 0, 0);
    destructiblesUpdate(w, 0.016, intent({}));
    const tick = w.tick;
    destructiblesReset(w);
    const st = w.destructibles[0];
    expect(st.broken).toBe(0);
    expect(st.standU).toBe(1);
    expect(st.fragments).toHaveLength(0);
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

  it('active 帧且刀风覆盖物件：breakHits 生效并落下一段刚体', () => {
    const w = armed();
    destructiblesUpdate(w, 0.016, intent({
      breakHits: [{ id: 'pole-a', x: 0, y: 1.8, z: 1, dx: 1, dy: 0, dz: 0 }],
    }));
    expect(w.destructibles[0].broken).toBe(1);
    expect(w.destructibles[0].fragments).toHaveLength(1);
  });
});

describe('v9s.x · 坛子碎裂', () => {
  it('命中即碎裂成 6~12 块、站立段归零、确定性随机', () => {
    const w = armed(JAR);
    expect(forceBreak(w, 'jar-a', 0.5, 1, 0, 0)).toBe(true);
    const st = w.destructibles[0];
    expect(st.broken).toBe(1);
    expect(st.standU).toBe(0);
    expect(st.fragments.length).toBeGreaterThanOrEqual(6);
    expect(st.fragments.length).toBeLessThanOrEqual(12);
  });

  it('碎裂确定性：同输入两遍片段逐字节一致', () => {
    const a = armed(JAR);
    const b = armed(JAR);
    forceBreak(a, 'jar-a', 0.5, 1, 0, 0);
    forceBreak(b, 'jar-a', 0.5, 1, 0, 0);
    expect(JSON.stringify(a.destructibles)).toBe(JSON.stringify(b.destructibles));
  });

  it('已碎裂的坛子不再响应二次命中', () => {
    const w = armed(JAR);
    forceBreak(w, 'jar-a', 0.5, 1, 0, 0);
    expect(forceBreak(w, 'jar-a', 0.5, -1, 0, 0)).toBe(false);
  });

  it('碎块初速度全向上 + 径向外扩（无向下初速）', () => {
    const w = armed(JAR);
    forceBreak(w, 'jar-a', 0.5, 1, 0, 0);
    for (const f of w.destructibles[0].fragments) expect(f.vy).toBeGreaterThan(0);
  });
});

describe('v9s.x · 仙人掌（固定造型 + 断块侧臂尺寸一致）', () => {
  it('侧臂固定 2 条，不再随机程序化生成', () => {
    const short = createDestructibleStates([{ ...CACTUS, height: 2.0 }])[0];
    expect(short.arms).toHaveLength(2);
    const tall = createDestructibleStates([{ ...CACTUS, height: 2.6 }])[0];
    expect(tall.arms).toHaveLength(2);
    // 同尺寸必得同造型（确定性）
    const again = createDestructibleStates([{ ...CACTUS, height: 2.0 }])[0];
    expect(again.arms).toEqual(short.arms);
  });

  it('断块上的侧臂与站立侧臂同源（同一个盒子，不会「掉下来样子变了」）', () => {
    const w = armed(CACTUS);
    const st = w.destructibles[0];
    // 砍在最低手臂之下，使整段（含全部手臂）作为一块断块掉出
    const lowArmU = Math.min(...st.arms.map((a) => a.atU));
    const hitY = (lowArmU - 0.05) * st.height;
    expect(forceBreak(w, 'cac-a', hitY, 1, 0, 0)).toBe(true);
    const frag = st.fragments[st.fragments.length - 1];
    expect(frag.parts).toBeDefined();

    // 每条手臂拆成 3 个盒（伸出 / 上扬 / 方头），断块上的必须与
    // `cactusArmBoxes` 逐个对上：尺寸相等、世界位置相等。
    expect(frag.parts!.length).toBe(st.arms.length * 3);
    for (const a of st.arms) {
      const baseY = st.y + a.atU * st.height;
      for (const box of cactusArmBoxes(a, st.radius)) {
        const want = { x: box.cx, y: baseY + box.cy, z: box.cz, hx: box.hx, hy: box.hy, hz: box.hz };
        const hit = frag.parts!.find((p) =>
          Math.abs(p.hx - want.hx) < 1e-6 && Math.abs(p.hy - want.hy) < 1e-6
          && Math.abs(p.hz - want.hz) < 1e-6
          && Math.abs(p.x - want.x) < 1e-6 && Math.abs(p.z - want.z) < 1e-6);
        expect(hit, `找不到与 ${JSON.stringify(want)} 对应的断块子盒`).toBeTruthy();
        // 断块子盒的 y 是相对断块中心：加回去应等于世界高度
        expect(frag.y + hit!.y).toBeCloseTo(want.y, 5);
        expect(hit!.x).toBeCloseTo(want.x, 5);
        expect(hit!.z).toBeCloseTo(want.z, 5);
      }
    }
  });

  it('砍下来的根再砍一刀，不会重复掉出上一次已飞走的叉（v9s.62）', () => {
    const w = armed(CACTUS);
    const st = w.destructibles[0];
    // 第一刀砍在 0.60：0.68 那条臂（dx = -1）整条随断块飞走，0.52 那条留桩
    forceBreak(w, 'cac-a', 0.60 * st.height, 1, 0, 0);
    const first = st.fragments[0];
    expect((first.parts ?? []).some((p) => p.x < 0)).toBe(true);

    // 第二刀再砍剩下的根：切走 [0.45, 0.60]，只含 0.52 那条臂的根部
    forceBreak(w, 'cac-a', 0.45 * st.height, 1, 0, 0);
    const second = st.fragments[1];
    expect(second).toBeTruthy();
    // 已经飞走的那条（x < 0）不该再被打包一次 —— 旧判据 `atU > cutU` 就会这么干
    expect((second.parts ?? []).every((p) => p.x > 0)).toBe(true);
  });

  it('多段砍断：同一条侧臂在各断块 / 桩上的高度区间互不重叠（不会越砍越多叉）', () => {
    const w = armed(CACTUS);
    const st = w.destructibles[0];
    // 每次只砍掉一小段，逼出「砍下来的根再砍」这条路径
    const us = [0.95, 0.72, 0.60, 0.40, 0.20];
    for (const u of us) forceBreak(w, 'cac-a', u * st.height, 1, 0, 0);
    expect(st.fragments.length).toBeGreaterThan(1);

    // 把所有断块里的侧臂盒还原成世界高度区间。同一条臂被拆成 3 个盒
    // （伸出 / 上扬 / 方头），**同类盒之间**才该互不重叠 —— 不同盒本来就在同一高度段。
    const groups = new Map<string, Array<{ lo: number; hi: number }>>();
    const keyOf = (x: number, hx: number, hz: number): string =>
      `${Math.sign(x)}|${hx.toFixed(5)}|${hz.toFixed(5)}`;
    for (const f of st.fragments) {
      for (const p of f.parts ?? []) {
        const k = keyOf(p.x, p.hx, p.hz);
        const list = groups.get(k) ?? [];
        list.push({ lo: f.y + p.y - p.hy, hi: f.y + p.y + p.hy });
        groups.set(k, list);
      }
    }
    for (const [k, list] of groups) {
      list.sort((a, b) => a.lo - b.lo);
      for (let i = 1; i < list.length; i++) {
        // 后一段的起点不得落到前一段内部 —— 重复打包就是这个症状
        expect(list[i].lo, `${k} 第 ${i} 段与上一段重叠`).toBeGreaterThanOrEqual(list[i - 1].hi - 1e-4);
      }
    }
    // 桩上残留的侧臂也不能和任何断块重叠
    const topY = st.y + st.standU * st.height;
    for (const a of st.arms) {
      const baseY = st.y + a.atU * st.height;
      for (const box of cactusArmBoxes(a, st.radius)) {
        const left = clipArmBox(box, baseY, 0, topY);
        if (!left) continue;
        const lo = baseY + left.cy - left.hy;
        const hi = baseY + left.cy + left.hy;
        for (const s of groups.get(keyOf(left.cx, left.hx, left.hz)) ?? []) {
          expect(hi).toBeLessThanOrEqual(s.lo + 1e-4);
        }
      }
    }
  });

  it('单次挥砍（多帧同高命中）只产生 1 个断块，不生成零高碎片（防「越砍越多 / 断枝浮空」）', () => {
    const w = armed(CACTUS);
    // 同高度命中持续 20 帧（等价于一次挥砍停在半空），模拟此前每帧都生成零高碎片的 bug
    for (let f = 0; f < 20; f++) {
      destructiblesUpdate(w, w.config.fixedDt, intent({
        breakHits: [{ id: 'cac-a', x: 0, y: 1.8, z: 1, dx: 1, dy: 0, dz: 0 }],
      }));
    }
    const st = w.destructibles[0];
    expect(st.fragments).toHaveLength(1);
    for (const f of st.fragments) expect(f.hy * 2).toBeGreaterThan(0.05); // 无零高碎片
    // 再让物理落定，断块应落到地面而非浮空
    for (let f = 0; f < 180; f++) destructiblesUpdate(w, w.config.fixedDt, intent({}));
    const cs = obbCorners(st.fragments[0] as any);
    expect(Math.min(...cs.map((c) => c.y))).toBeLessThan(0.05);
  });

  it('一次「从上往下扫」的挥砍只砍下 1 段（斩波闸门：刀刃持续接触同物件只破一次）', () => {
    const w = armed(CACTUS);
    // 模拟真实下劈：命中高度逐帧下降（等价于刀刃扫过整根仙人掌），共 12 帧。
    // 起点略低于顶端（1.8 < 2.0），避免刚好落在顶端被「零高碎片」闸门挡掉。
    for (let f = 0; f < 12; f++) {
      const y = 1.8 + (0.4 - 1.8) * (f / 11);
      destructiblesUpdate(w, w.config.fixedDt, intent({
        breakHits: [{ id: 'cac-a', x: 0, y, z: 1, dx: 1, dy: 0, dz: 0 }],
      }));
    }
    const st = w.destructibles[0];
    // 关键回归：此前会切成 12 片薄块（互相重叠、初始零速 → 像浮空断枝 / 互相穿透）
    expect(st.fragments).toHaveLength(1);
    // 每一片都是真实厚度的段，而非接近零高的薄片
    for (const fr of st.fragments) expect(fr.hy * 2).toBeGreaterThan(0.1);
    // 落定后不再浮空 / 穿透
    for (let f = 0; f < 200; f++) destructiblesUpdate(w, w.config.fixedDt, intent({}));
    const st2 = w.destructibles[0];
    for (const fr of st2.fragments) {
      const lo = Math.min(...obbCorners(fr as any).map((c) => c.y));
      expect(lo).toBeGreaterThanOrEqual(-0.05);
    }
  });

  it('挥砍闸门：刀刃离开物件后再砍可再次破坏（多段砍靠多次挥砍）', () => {
    const w = armed(CACTUS);
    // 第一次挥砍（高处一刀）
    destructiblesUpdate(w, w.config.fixedDt, intent({
      breakHits: [{ id: 'cac-a', x: 0, y: 1.8, z: 1, dx: 1, dy: 0, dz: 0 }],
    }));
    const after1 = w.destructibles[0].fragments.length;
    expect(after1).toBe(1);
    // 刀刃离开（无命中），解除武装
    destructiblesUpdate(w, w.config.fixedDt, intent({}));
    // 第二次挥砍（更低处一刀）应再砍下一段
    destructiblesUpdate(w, w.config.fixedDt, intent({
      breakHits: [{ id: 'cac-a', x: 0, y: 1.0, z: 1, dx: 1, dy: 0, dz: 0 }],
    }));
    expect(w.destructibles[0].fragments.length).toBe(2);
  });
});

describe('v9s.x · 掉落刚体物理（确定式）', () => {
  it('杆段掉落后最终休眠且停在地面之上（无 NaN）', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 1.8, 1, 0, 0);
    for (let i = 0; i < 400; i++) destructiblesUpdate(w, 0.016, intent({}));
    const f = w.destructibles[0].fragments[0];
    expect(Number.isFinite(f.x) && Number.isFinite(f.y) && Number.isFinite(f.z)).toBe(true);
    expect(f.rest).toBe(1);
    // 实际最低角点 ≈ 地面（未穿地）：敲落的段平躺落地，中心 y 远低于半高属正常，
    // 故以「最低 OBB 角点」判定而非 f.y - f.hy 这类轴对齐近似。
    const lowest = Math.min(...obbCorners(f as any).map((c: any) => c.y));
    expect(lowest).toBeGreaterThanOrEqual(-0.05);
  });

  it('碎块全部落定休眠（确定性积分稳定）', () => {
    const w = armed(JAR);
    forceBreak(w, 'jar-a', 0.5, 1, 0, 0);
    for (let i = 0; i < 600; i++) destructiblesUpdate(w, 0.016, intent({}));
    for (const f of w.destructibles[0].fragments) {
      expect(Number.isFinite(f.x) && Number.isFinite(f.y) && Number.isFinite(f.z)).toBe(true);
      expect(f.rest).toBe(1);
      // 实际最低角点 ≈ 地面（未穿地）：多块碎块散开后平躺/侧立落地均正常
      const lowest = Math.min(...obbCorners(f as any).map((c: any) => c.y));
      expect(lowest).toBeGreaterThanOrEqual(-0.05);
    }
  });

  it('快照 / 恢复后继续推进与未中断一致（物理随 World 回放）', () => {
    const w = armed();
    forceBreak(w, 'pole-a', 1.6, 0, -0.6, 1);
    for (let i = 0; i < 20; i++) destructiblesUpdate(w, 0.016, intent({}));
    const twin = restoreWorld(snapshot(w));
    for (let i = 0; i < 20; i++) destructiblesUpdate(w, 0.016, intent({}));
    for (let i = 0; i < 20; i++) destructiblesUpdate(twin, 0.016, intent({}));
    expect(snapshot(twin)).toBe(snapshot(w));
  });

  it('多块碎块落定后散开（未塌缩成同一点，碰撞把碎片推开）', () => {
    const w = armed(JAR);
    forceBreak(w, 'jar-a', 0.5, 1, 0, 0);
    for (let i = 0; i < 600; i++) destructiblesUpdate(w, 0.016, intent({}));
    const fs = w.destructibles[0].fragments;
    let maxSpread = 0;
    for (let i = 0; i < fs.length; i++) {
      for (let j = i + 1; j < fs.length; j++) {
        const d = Math.hypot(fs[i].x - fs[j].x, fs[i].y - fs[j].y, fs[i].z - fs[j].z);
        expect(d).toBeGreaterThan(0.02); // 不应几乎完全重叠
        if (d > maxSpread) maxSpread = d;
      }
    }
    // 向外飞散的碎块应铺开一定范围（碰撞 + 初速度共同结果）
    expect(maxSpread).toBeGreaterThan(0.3);
  });
});

describe('v9s.x · 兼容性常量', () => {
  it('BREAK_FALL_TARGET 仍导出且为有限数', () => {
    expect(Number.isFinite(BREAK_FALL_TARGET)).toBe(true);
  });
});
