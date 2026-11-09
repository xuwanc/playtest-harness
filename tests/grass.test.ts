import { describe, expect, it } from 'vitest';
import {
  currentMeleeShape, DEFAULT_GRASS_WIND, grassCut, grassReset, grassUpdate,
  inMeleeShape, inSlamShape, restoreWorld, snapshot, step,
  windAdvance, windConfig, windPhase, windSample, windShaderParams,
} from '../src/core';
import type { GrassState, GrassWindConfig, WindState, World } from '../src/core';
import { CONFIG, intent, makeLabWorld, makeWorld, place } from './helpers';

/** 线上配置才有 scene.grass；冻结夹具刻意没有，用来验证「旧用例零影响」。 */
function grassWorld(): World {
  return makeLabWorld();
}

/** 把玩家放到第一根草的正中心，方便做确定性的压弯断言。 */
function atFirstBlade(w: World): { id: number; x: number; z: number } {
  const b = w.grass.blades[0];
  place(w, b.x, b.z);
  return { id: b.id, x: b.x, z: b.z };
}

function activeAttack(w: World, facing: number): void {
  const cb = w.combat;
  cb.weapon = 'sword-shield';
  cb.phase = 'active';
  cb.attackFacing = facing;
  cb.comboIndex = 1;
  cb.attackId = 7;
  cb.slamAttackId = 0;
  // u≈0.62：剑盾第 1 段的刃身扫掠门此时已扫过正前方（148°→-16°），
  // 大剑的 groundSlam.slamU=0.6 也刚好触发。用真实剪辑时机，不绕开扫掠门。
  cb.phaseTimer = 0.124;
  cb.timings = { windup: 0.12, active: 0.2, recovery: 0.2, settle: 0.1, lunge: 0.4 };
  cb.hitIds = [];
}

describe('v9s.39 体素草块 · 生成契约', () => {
  it('冻结夹具没有 scene.grass → 空草场，既有 876 例行为零影响', () => {
    const w = makeWorld();
    expect(w.grass.blades).toHaveLength(0);
    expect(w.grass.patches).toHaveLength(0);
    expect(Object.keys(w.grass.buckets)).toHaveLength(0);
    // 空草场下 step 也不产生任何草事件
    step(w, w.config.fixedDt, intent({ moveX: 0.4, moveZ: 1 }));
    expect(w.events.some((e) => e.type === 'grass-cut')).toBe(false);
  });

  it('线上配置生成确定性草场：同一 seed 两次生成逐字节一致', () => {
    const a = grassWorld().grass;
    const b = grassWorld().grass;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.blades.length).toBeGreaterThan(100);
    expect(a.patches.length).toBeGreaterThan(20);
  });

  it('生成不推进 world.rngState（草是静态布景，不干扰假人游走）', () => {
    const w = grassWorld();
    const before = w.rngState;
    const w2 = makeLabWorld();
    expect(w2.rngState).toBe(before);
  });

  it('2×2 格 footprint、1~2 格高、参次不齐（高度与朝向都有分布）', () => {
    const w = grassWorld();
    const g = w.grass;
    const cell = g.cellSize;
    const foot = w.config.grass.footprintCells;
    // v9s.47：主草场已改为地块自带（全局区域 min=max=0），格网奇偶不再有统一基准。
    // 改为校验「同一行内相邻 patch 间距 = footprint」，这才是 footprint 的真实语义。
    const byRow = new Map<number, number[]>();
    for (const p of g.patches) {
      const row = byRow.get(p.cellZ) ?? [];
      row.push(p.cellX);
      byRow.set(p.cellZ, row);
    }
    for (const xs of byRow.values()) {
      const sorted = [...xs].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i] - sorted[i - 1]).toBeGreaterThanOrEqual(foot);
        expect((sorted[i] - sorted[i - 1]) % foot).toBe(0);
      }
    }
    for (const b of g.blades) {
      expect(b.height).toBeGreaterThanOrEqual(cell - 1e-6);
      expect(b.height).toBeLessThanOrEqual(cell * 2 + 1e-6);
      expect(b.yaw).toBeGreaterThanOrEqual(0);
      expect(b.yaw).toBeLessThan(Math.PI * 2);
    }
    const heights = new Set(g.blades.map((b) => b.height.toFixed(4)));
    expect(heights.size).toBeGreaterThan(20);
  });

  it('草不生成在台阶 / 墙 / 障碍的避让盒里', () => {
    const w = grassWorld();
    const margin = w.grass.spec.avoidMargin;
    const solid = w.boxes.filter((b) => b.kind !== 'ground');
    for (const b of w.grass.blades) {
      for (const s of solid) {
        const inside = b.x >= s.minX - margin && b.x <= s.maxX + margin
          && b.z >= s.minZ - margin && b.z <= s.maxZ + margin;
        expect(inside).toBe(false);
      }
    }
  });

  it('GrassState 是纯 plain 数据，JSON 往返无损', () => {
    const w = grassWorld();
    step(w, w.config.fixedDt, intent({ moveZ: 1 }));
    const restored = restoreWorld(snapshot(w));
    expect(restored.grass).toEqual(w.grass);
  });

  it('网格桶覆盖了全部草根（局部查询不会漏草）', () => {
    const g: GrassState = grassWorld().grass;
    const ids = Object.values(g.buckets).flat();
    expect(ids).toHaveLength(g.blades.length);
    expect(new Set(ids).size).toBe(g.blades.length);
  });
});

describe('v9s.39 体素草块 · 压开 / 恢复', () => {
  it('角色站到草上 → 草被压弯；离开后按固定步长弹性恢复', () => {
    const w = grassWorld();
    w.modules.dummies = false;   // 只测玩家，排除假人干扰
    const { id } = atFirstBlade(w);

    for (let i = 0; i < 12; i += 1) grassUpdate(w, w.config.fixedDt);
    expect(w.grass.blades[id].bend).toBeGreaterThan(0.2);
    const pressed = w.grass.blades[id].bend;

    // 移出演影响半径
    place(w, 40, 40);
    for (let i = 0; i < 180; i += 1) grassUpdate(w, w.config.fixedDt);
    expect(w.grass.blades[id].bend).toBeLessThan(pressed);
    expect(w.grass.blades[id].bend).toBeLessThan(0.01);
  });

  it('压弯方向朝「角色 → 草」外侧（自然压开而不是吸过来）', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    const b = w.grass.blades[0];
    place(w, b.x - 0.25, b.z);
    for (let i = 0; i < 10; i += 1) grassUpdate(w, w.config.fixedDt);
    expect(b.bendX).toBeGreaterThan(0.5);
    expect(Math.abs(b.bendZ)).toBeLessThan(0.5);
  });

  it('只有周围桶里的草被触碰：远处草保持直立', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    const near = w.grass.blades[0];
    const far = w.grass.blades.find((b) => Math.hypot(b.x - near.x, b.z - near.z) > 6);
    expect(far).toBeDefined();
    place(w, near.x, near.z);
    for (let i = 0; i < 20; i += 1) grassUpdate(w, w.config.fixedDt);
    expect(near.bend).toBeGreaterThan(0);
    expect(far!.bend).toBe(0);
  });

  it('modules.grass=false 时草状态完全冻结', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    w.modules.grass = false;
    const { id } = atFirstBlade(w);
    for (let i = 0; i < 30; i += 1) grassUpdate(w, w.config.fixedDt);
    expect(w.grass.blades[id].bend).toBe(0);
    expect(w.grass.cutCount).toBe(0);
  });
});

describe('v9s.39 体素草块 · 割断 / 再生', () => {
  it('active 段的刀风扇形会割断草，并发一条 grass-cut 事件', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    activeAttack(w, 0);
    // 把玩家挪到草地中间，正前方（+z）有草
    const center = w.grass.blades[Math.floor(w.grass.blades.length / 2)];
    place(w, center.x, center.z - 0.4);
    w.combat.attackFacing = 0;
    const before = w.grass.cutCount;
    const cut = grassCut(w);
    expect(cut).toBeGreaterThan(0);
    expect(w.grass.cutCount).toBeGreaterThan(before);
    expect(w.events.filter((e) => e.type === 'grass-cut')).toHaveLength(1);
    expect(w.events.find((e) => e.type === 'grass-cut')!.value).toBe(cut);
  });

  it('刀风之外 / 非 active 帧不会割草；背对草地不割、转身面向草地才割', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    const minZ = Math.min(...w.grass.blades.map((b) => b.z));
    const b0 = w.grass.blades.find((b) => b.z < minZ + 0.8)!;
    // 站在最南那根草的正南 0.8m：正前方有草、身后（更南）保证没有草
    place(w, b0.x, b0.z - 0.8);

    w.combat.phase = 'idle';
    expect(grassCut(w)).toBe(0);

    activeAttack(w, Math.PI);   // 面朝 -z = 背对草地
    expect(grassCut(w)).toBe(0);

    w.combat.attackFacing = 0;  // 转身面向草地
    expect(grassCut(w)).toBeGreaterThan(0);
  });

  it('已割断的草不会被重复计数；regrow 到时后自动长回', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    activeAttack(w, 0);
    const center = w.grass.blades[Math.floor(w.grass.blades.length / 2)];
    place(w, center.x, center.z - 0.4);
    const first = grassCut(w);
    expect(first).toBeGreaterThan(0);
    const second = grassCut(w);
    expect(second).toBe(0);

    // 退出攻击态：否则每帧的刀风会把刚长回来的草立刻再割一遍。
    w.combat.phase = 'idle';
    const cfg = w.config.grass;
    for (let i = 0; i < Math.ceil(cfg.regrowSec / w.config.fixedDt) + 4; i += 1) {
      grassUpdate(w, w.config.fixedDt);
    }
    expect(w.grass.blades.filter((b) => b.cut !== 0)).toHaveLength(0);
  });

  it('grassReset 让所有草回到完好直立，且清空计数', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    activeAttack(w, 0);
    const center = w.grass.blades[Math.floor(w.grass.blades.length / 2)];
    place(w, center.x, center.z - 0.4);
    grassCut(w);
    expect(w.grass.cutCount).toBeGreaterThan(0);
    grassReset(w);
    expect(w.grass.cutCount).toBe(0);
    expect(w.grass.blades.every((b) => b.cut === 0 && b.bend === 0)).toBe(true);
  });
});

describe('v9s.39 刀风形状复用（与 playerHits 同源）', () => {
  it('shape 的 reach / 扇区半角直接取自 hits 配置，正前命中、背后与超距不命中', () => {
    const w = makeWorld();
    activeAttack(w, 0);
    const shape = currentMeleeShape(w);
    expect(shape.active).toBe(true);
    expect(shape.reach).toBe(w.config.hits.reach['sword-shield']);
    expect(shape.cosArc).toBeCloseTo(Math.cos(w.config.hits.arcDeg * Math.PI / 180), 8);
    expect(inMeleeShape(shape, 0, shape.z + 1, 0)).toBe(true);
    expect(inMeleeShape(shape, 0, shape.z - 1, 0)).toBe(false);
    expect(inMeleeShape(shape, 0, shape.z + shape.reach + 0.5, 0)).toBe(false);
    expect(inSlamShape(shape, 0, shape.z, 0)).toBe(false);
  });

  it('同一个目标：既被 inMeleeShape 覆盖，也真的在 step 里吃到命中', () => {
    const w = makeWorld();
    w.modules.gaze = false;
    w.modules.turnInPlace = false;
    w.modules.links = false;
    const d = w.dummies[0];
    d.position.x = 0;
    d.position.z = 5;
    d.position.y = 0;
    place(w, 0, 4);
    activeAttack(w, 0);

    const shape = currentMeleeShape(w);
    expect(inMeleeShape(shape, d.position.x, d.position.z, w.config.dummies.radius)).toBe(true);

    const before = w.hitCount;
    step(w, w.config.fixedDt, intent({}));
    expect(w.hitCount).toBeGreaterThan(before);
  });

  it('弓的「攻击」没有刀风；击地圆只在触发帧出现', () => {
    const w = makeWorld();
    activeAttack(w, 0);
    w.combat.weapon = 'bow';
    expect(currentMeleeShape(w).active).toBe(false);

    w.combat.weapon = 'greatsword';
    const shape = currentMeleeShape(w);
    expect(shape.slamRadius).toBe(0);
    w.combat.slamAttackId = w.combat.attackId;
    const withSlam = currentMeleeShape(w);
    expect(withSlam.slamRadius).toBeGreaterThan(0);
    expect(inSlamShape(withSlam, withSlam.slamX, withSlam.slamZ, 0)).toBe(true);
  });
});

describe('v9s.40 空地上的独立测试草块', () => {
  const plotOf = (w: World) => {
    const p = w.grass.spec.plots?.[0];
    if (!p) throw new Error('线上配置应包含 scene.grass.plots[0]');
    return p;
  };

  it('强制铺满、四周挖出一圈空地、与主草场格网对齐', () => {
    const w = grassWorld();
    const g = w.grass;
    const p = plotOf(w);
    const cell = g.cellSize;
    const x0 = p.minCellX * cell;
    const x1 = p.maxCellX * cell;
    const z0 = p.minCellZ * cell;
    const z1 = p.maxCellZ * cell;

    const inPlot = (b: { x: number; z: number }): boolean =>
      b.x >= x0 - 1e-6 && b.x <= x1 + 1e-6 && b.z >= z0 - 1e-6 && b.z <= z1 + 1e-6;

    // 12 个 patch（4×3）铺满，草根数量远超单块随机草场
    const plotPatches = g.patches.filter(
      (q) => q.cellX >= p.minCellX && q.cellX < p.maxCellX
        && q.cellZ >= p.minCellZ && q.cellZ < p.maxCellZ,
    );
    expect(plotPatches).toHaveLength(12);
    expect(g.blades.filter(inPlot).length).toBeGreaterThanOrEqual(24);

    // 留空圈内（plot 之外）不应有常规草场的草
    const m = (p.clearMarginCells ?? 0) * cell;
    const ring = g.blades.filter(
      (b) => !inPlot(b)
        && b.x > x0 - m && b.x < x1 + m
        && b.z > z0 - m && b.z < z1 + m,
    );
    expect(ring).toHaveLength(0);

    // 主草场仍在，且 plot 格坐标与常规格网同奇偶
    expect(g.blades.length).toBeGreaterThan(g.blades.filter(inPlot).length);
    for (const q of plotPatches) {
      expect(Math.abs((q.cellX - g.spec.minCellX) % 2)).toBe(0);
      expect(Math.abs((q.cellZ - g.spec.minCellZ) % 2)).toBe(0);
    }
  });

  it('这块草可以走过去压开、挥刀割断（真人测试路径）', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    const p = plotOf(w);
    const cell = w.grass.cellSize;
    const cx = ((p.minCellX + p.maxCellX) / 2) * cell;
    const cz = ((p.minCellZ + p.maxCellZ) / 2) * cell;
    place(w, cx, cz - 0.6);

    step(w, w.config.fixedDt, intent({}));
    expect(w.grass.blades.filter((b) => b.bend > 0).length).toBeGreaterThan(0);

    activeAttack(w, 0);
    w.combat.phaseTimer = 0.124;
    expect(grassCut(w)).toBeGreaterThan(0);
    expect(w.grass.cutCount).toBeGreaterThan(0);
    expect(w.events.some((e) => e.type === 'grass-cut')).toBe(true);
  });
});

describe('v9s.41 风场 / 麦浪', () => {
  /** 每例拿一份独立副本，避免改配置串味。 */
  const cfg = (): GrassWindConfig => {
    const w = CONFIG.core.grass.wind as GrassWindConfig;
    return {
      ...w,
      secondWave: { ...w.secondWave },
      gust: { ...w.gust },
    };
  };

  it('未配置风场 → 中性值；冻结夹具 World 也带 wind 字段且时间归零', () => {
    expect(windConfig({} as never).enabled).toBe(false);
    expect(DEFAULT_GRASS_WIND.enabled).toBe(false);
    const w = makeWorld();                       // 冻结夹具：没有 scene.grass
    expect(w.grass.blades.length).toBe(0);
    expect(w.grass.wind).toEqual({
      time: 0,
      gust: 1 - (CONFIG.core.grass.wind as GrassWindConfig).gust.depth,
    });
  });

  it('windPhase 沿风向线性错相、垂直风向同相 → 整齐的浪带', () => {
    const c = cfg();
    const rad = c.dirDeg * Math.PI / 180;
    const dx = Math.cos(rad);
    const dz = Math.sin(rad);
    const [a1] = windPhase(c, 0, 0, 0);
    const [b1] = windPhase(c, dx * c.wavelength, dz * c.wavelength, 0);
    expect(b1 - a1).toBeCloseTo(2 * Math.PI, 6);       // 走过一个波长 = 一整周期
    const [v1] = windPhase(c, -dz * 5, dx * 5, 0);      // 垂直风向移动：相位不变
    expect(v1 - a1).toBeCloseTo(0, 6);
    const [j1] = windPhase(c, 0, 0, 0.7);
    expect(j1 - a1).toBeCloseTo(0.7, 6);                 // 抖动只是常量偏移
  });

  it('windSample 是行波：时间推进 Δ ≡ 空间沿风向回退 speed·Δ', () => {
    const c = cfg();
    c.secondWave.amplitude = 0;                          // 只留主波，精确验证传播关系
    const rad = c.dirDeg * Math.PI / 180;
    const p = 6.3;                                      // 沿风向的投影坐标
    const [ph1, ph2] = windPhase(c, p * Math.cos(rad), p * Math.sin(rad), 0);
    const w0: WindState = { time: 0.7, gust: 1 };
    const w1: WindState = { time: 0.7 + 0.35, gust: 1 };
    const back = p - c.speed * 0.35;
    const [bh1, bh2] = windPhase(c, back * Math.cos(rad), back * Math.sin(rad), 0);
    expect(windSample(w1, c, ph1, ph2).sway).toBeCloseTo(windSample(w0, c, bh1, bh2).sway, 6);
    expect(windSample(w1, c, ph1, ph2).shade).toBeCloseTo(windSample(w0, c, bh1, bh2).shade, 6);

    // 同一时刻，沿风向隔 1/4 波长的两点摆幅明显不同（不是整片同步摆动）
    const p2 = p + c.wavelength / 4;
    const [ch1, ch2] = windPhase(c, p2 * Math.cos(rad), p2 * Math.sin(rad), 0);
    expect(Math.abs(windSample(w0, c, ph1, ph2).sway - windSample(w0, c, ch1, ch2).sway))
      .toBeGreaterThan(0.05);
  });

  it('windShaderParams 与 windSample 同源（GPU 与 CPU 参考实现不漂移）', () => {
    const c = cfg();
    const q = windShaderParams(c);
    const w: WindState = { time: 2.3, gust: 0.8 };
    const [p1, p2] = windPhase(c, 3.1, -2.4, 0.42);
    const s1 = Math.sin(p1 - q.omega1 * w.time);
    const s2 = Math.sin(p2 - q.omega2 * w.time);
    expect(windSample(w, c, p1, p2).sway)
      .toBeCloseTo(w.gust * (q.amp1 * s1 + q.amp2 * s2), 10);
    expect(windSample(w, c, p1, p2).shade)
      .toBeCloseTo(1 - q.shadeAmount * (0.5 + 0.5 * s1), 10);
    expect(windSample(w, c, p1, p2).shade).toBeGreaterThanOrEqual(1 - q.shadeAmount);
  });

  it('windAdvance 固定步长、确定性、阵风有界；关风后时间冻结', () => {
    const c = cfg();
    const a: WindState = { time: 0, gust: 1 };
    const b: WindState = { time: 0, gust: 1 };
    for (let i = 0; i < 240; i++) {
      windAdvance(a, c, c.gust.periodSec / 240);
      windAdvance(b, c, c.gust.periodSec / 240);
    }
    expect(a).toEqual(b);
    expect(a.time).toBeCloseTo(c.gust.periodSec, 6);
    expect(a.gust).toBeGreaterThanOrEqual(1 - c.gust.depth - 1e-9);
    expect(a.gust).toBeLessThanOrEqual(1 + 1e-9);
    const t = a.time;
    windAdvance(a, { ...c, enabled: false }, 1);
    expect(a.time).toBe(t);
  });

  it('step 每帧推进风时间；grassReset 归零（重播不接着上次的浪）', () => {
    const w = grassWorld();
    w.modules.dummies = false;
    const dt = w.config.fixedDt;
    for (let i = 0; i < 60; i++) step(w, dt, intent({}));
    expect(w.grass.wind.time).toBeGreaterThan(0);
    expect(w.grass.wind.time).toBeCloseTo(w.time, 6);
    grassReset(w);
    expect(w.grass.wind.time).toBe(0);
  });

  it('modules.grass=false 或 wind.enabled=false 时风状态冻结', () => {
    const w = grassWorld();
    const dt = w.config.fixedDt;
    w.modules.grass = false;
    for (let i = 0; i < 10; i++) step(w, dt, intent({}));
    expect(w.grass.wind.time).toBe(0);

    w.modules.grass = true;
    (w.config.grass.wind as GrassWindConfig).enabled = false;
    for (let i = 0; i < 10; i++) step(w, dt, intent({}));
    expect(w.grass.wind.time).toBe(0);
  });
});
