import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  createArcMeter, createAreaRing, dummyWindupWarning, fadeTowards, linkLandingPreview,
  playerMeterSource,
} from '../src/presentation/ground-ring';

const DEG = Math.PI / 180;

describe('v9s.11 假人起手预警', () => {
  it('只在 windup 阶段亮起，出手 / 收势立即熄灭', () => {
    expect(dummyWindupWarning('idle', 0, 0.45).active).toBe(false);
    expect(dummyWindupWarning('active', 0.1, 0.45).active).toBe(false);
    expect(dummyWindupWarning('recovery', 0.1, 0.45).active).toBe(false);
    expect(dummyWindupWarning('windup', 0.1, 0.45).active).toBe(true);
  });

  it('填充比例随起手时间线性增长，满格即命中帧', () => {
    expect(dummyWindupWarning('windup', 0, 0.45).ratio).toBeCloseTo(0, 6);
    expect(dummyWindupWarning('windup', 0.225, 0.45).ratio).toBeCloseTo(0.5, 6);
    expect(dummyWindupWarning('windup', 0.45, 0.45).ratio).toBeCloseTo(1, 6);
    // 溢出（帧率抖动导致 timer 略超）夹紧，不会把弧推出范围
    expect(dummyWindupWarning('windup', 9, 0.45).ratio).toBe(1);
  });

  it('紧迫度单调递增，起手刚开始也不是 0（要读得出「有人要动手」）', () => {
    const a = dummyWindupWarning('windup', 0, 0.45).urgency;
    const b = dummyWindupWarning('windup', 0.3, 0.45).urgency;
    const c = dummyWindupWarning('windup', 0.45, 0.45).urgency;
    expect(a).toBeGreaterThan(0.2);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThanOrEqual(b);
    expect(c).toBeLessThanOrEqual(1);
  });

  it('windup 时长为 0 的配置不会产生 NaN', () => {
    const w = dummyWindupWarning('windup', 0.1, 0);
    expect(Number.isFinite(w.ratio)).toBe(true);
    expect(w.ratio).toBe(1);
  });
});

describe('v9s.11 玩家进度弧数据源', () => {
  const base = {
    charging: false, charge: 0,
    channeling: false, fireTimer: 0, fireInterval: 0.28,
    dashCooldown: 0, dashCooldownMax: 1.1,
  };

  it('无动作时不显示', () => {
    expect(playerMeterSource(base)).toEqual({ source: 'none', ratio: 0 });
  });

  it('蓄力：直接读 charge 0..1', () => {
    const m = playerMeterSource({ ...base, charging: true, charge: 0.62 });
    expect(m.source).toBe('charge');
    expect(m.ratio).toBeCloseTo(0.62, 6);
  });

  it('引导：fireTimer 倒过来 = 这一发的填充进度', () => {
    const start = playerMeterSource({ ...base, channeling: true, fireTimer: 0.28 });
    const mid = playerMeterSource({ ...base, channeling: true, fireTimer: 0.14 });
    const end = playerMeterSource({ ...base, channeling: true, fireTimer: 0 });
    expect(start.ratio).toBeCloseTo(0, 6);
    expect(mid.ratio).toBeCloseTo(0.5, 6);
    expect(end.ratio).toBeCloseTo(1, 6);
  });

  it('冲刺冷却：冷却越少填充越多，冷却结束回到 none', () => {
    const just = playerMeterSource({ ...base, dashCooldown: 1.1 });
    const half = playerMeterSource({ ...base, dashCooldown: 0.55 });
    const done = playerMeterSource({ ...base, dashCooldown: 0 });
    expect(just.source).toBe('cooldown');
    expect(just.ratio).toBeCloseTo(0, 6);
    expect(half.ratio).toBeCloseTo(0.5, 6);
    expect(done.source).toBe('none');
  });

  it('优先级：蓄力 > 引导 > 冷却（同一帧只表达一个意图）', () => {
    const all = playerMeterSource({
      ...base, charging: true, charge: 0.3,
      channeling: true, fireTimer: 0.1, dashCooldown: 0.4,
    });
    expect(all.source).toBe('charge');
    const noCharge = playerMeterSource({
      ...base, channeling: true, fireTimer: 0.1, dashCooldown: 0.4,
    });
    expect(noCharge.source).toBe('channel');
  });

  it('越界输入被夹紧（fireInterval 为 0 也不产生 NaN）', () => {
    const m = playerMeterSource({ ...base, channeling: true, fireTimer: 0.2, fireInterval: 0 });
    expect(Number.isFinite(m.ratio)).toBe(true);
    expect(m.ratio).toBeGreaterThanOrEqual(0);
    expect(m.ratio).toBeLessThanOrEqual(1);
  });
});

describe('v9s.11 光晕衰减缓动', () => {
  it('单帧不会跳满：dt 远小于 tau 时只走一小步', () => {
    const v = fadeTowards(0, 1, 1 / 60, 0.14);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(0.2);
  });

  it('tau 越大越慢（淡出比淡入慢 → 光收得自然）', () => {
    const fast = fadeTowards(1, 0, 1 / 60, 0.14);
    const slow = fadeTowards(1, 0, 1 / 60, 0.36);
    expect(slow).toBeGreaterThan(fast);
  });

  it('多次迭代收敛到目标；dt = 0 或 tau≈0 直接取目标', () => {
    let v = 0;
    for (let i = 0; i < 240; i++) v = fadeTowards(v, 1, 1 / 60, 0.14);
    expect(v).toBeCloseTo(1, 4);
    expect(fadeTowards(0.3, 1, 0, 0.14)).toBe(1);
    expect(fadeTowards(0.3, 1, 1 / 60, 0)).toBe(1);
  });
});

describe('v9s.11 进度弧（drawRange 填充）', () => {
  const make = (): ReturnType<typeof createArcMeter> => createArcMeter({
    radius: 0.6, thickness: 0.04, arcRad: 180 * DEG, edgeFade: 0.06,
    color: '#ffd166', y: 0.03,
  });
  const segCount = (m: ReturnType<typeof createArcMeter>): number =>
    m.mesh.geometry.drawRange.count;

  it('ratio 0 时一个三角形都不画；ratio 1 时画满整弧', () => {
    const m = make();
    const color = new THREE.Color('#ffffff');
    m.set(0, 1, color, 0);
    expect(segCount(m)).toBe(0);
    m.set(1, 1, color, 0);
    expect(segCount(m)).toBe(m.mesh.geometry.index!.count);
    m.dispose();
  });

  it('填充严格随 ratio 增长，且复用同一份几何（零重建）', () => {
    const m = make();
    const color = new THREE.Color('#ffffff');
    const geo = m.mesh.geometry;
    const counts: number[] = [];
    for (const r of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
      m.set(r, 1, color, 0);
      counts.push(segCount(m));
      expect(m.mesh.geometry).toBe(geo);
    }
    for (let i = 1; i < counts.length; i++) expect(counts[i]).toBeGreaterThan(counts[i - 1]);
    m.dispose();
  });

  it('ratio 很小时也至少露出 1 段（起点可见）', () => {
    const m = make();
    m.set(0.0015, 1, new THREE.Color('#ffffff'), 0);
    expect(segCount(m)).toBeGreaterThan(0);
    m.dispose();
  });

  it('透明度为 0 时整体隐藏，>0 时可见', () => {
    const m = make();
    const color = new THREE.Color('#ffffff');
    m.set(0.5, 0, color, 0);
    expect(m.mesh.visible).toBe(false);
    m.set(0.5, 0.8, color, 0);
    expect(m.mesh.visible).toBe(true);
    m.dispose();
  });
});

describe('v9s.11 冲锋落点预览', () => {
  it('只有 windup 且距离有效时才出现', () => {
    expect(linkLandingPreview('idle', 0, 0, 0, 3, 0.9).active).toBe(false);
    expect(linkLandingPreview('active', 0, 0, 0, 3, 0.9).active).toBe(false);
    expect(linkLandingPreview('windup', 0, 0, 0, 0, 0.9).active).toBe(false);
    expect(linkLandingPreview('windup', 0, 0, 0, 3, 0.9).active).toBe(true);
  });

  it('落点 = 起点 + 朝向 × 冲锋距离（朝向 yaw 的前方为 sin/cos）', () => {
    const p = linkLandingPreview('windup', 1, 2, 0, 3, 0.9);
    expect(p.x).toBeCloseTo(1, 6);
    expect(p.z).toBeCloseTo(5, 6);
    const right = linkLandingPreview('windup', 0, 0, Math.PI / 2, 2, 0.9);
    expect(right.x).toBeCloseTo(2, 6);
    expect(right.z).toBeCloseTo(0, 6);
  });

  it('判定半径兜底：配置缺失时不会退化成 0 面积', () => {
    expect(linkLandingPreview('windup', 0, 0, 0, 3, 0).radius).toBeGreaterThanOrEqual(0.3);
  });
});

describe('v9s.11 AoE 范围圈', () => {
  it('按真实半径缩放（几何归一化，换半径零重建）', () => {
    const ring = createAreaRing({ color: '#9ad0ff', y: 0.045 });
    const geo = ring.group.children[0];
    ring.set(1, 2, 0.045, 2.4, 0.5, 0);
    expect(geo.scale.x).toBeCloseTo(2.4, 6);
    expect(ring.group.position.x).toBeCloseTo(1, 6);
    expect(ring.group.position.z).toBeCloseTo(2, 6);
    expect(ring.group.visible).toBe(true);
    ring.dispose();
  });

  it('透明度 0 时隐藏，避免残留地面光斑', () => {
    const ring = createAreaRing({ color: '#9ad0ff', y: 0.045 });
    ring.set(0, 0, 0.045, 2.4, 0, 0);
    expect(ring.group.visible).toBe(false);
    ring.dispose();
  });
});
