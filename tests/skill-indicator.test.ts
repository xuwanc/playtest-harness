import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  createSkillIndicatorView, describeSkillIndicators, INDICATOR_STYLE,
  indicatorBand, inferSkillRange, mapHitShape,
} from '../src/presentation/skill-indicator';
import type { SkillIndicatorSpec } from '../src/presentation/skill-indicator';
import { meleeCoverage } from '../src/core/hits';
import { makeWorld } from './helpers';

function byId(list: SkillIndicatorSpec[], id: string): SkillIndicatorSpec {
  const s = list.find((x) => x.id === id);
  if (!s) throw new Error(`缺少 ${id}：当前有 [${list.map((x) => x.id).join(', ')}]`);
  return s;
}

/** 把指示器推进到完全显示（dt 故意取大，几帧就稳定，不依赖真实时间） */
function settle(view: ReturnType<typeof createSkillIndicatorView>, w: ReturnType<typeof makeWorld>): void {
  for (let i = 0; i < 10; i++) view.update(w, undefined, 0.25);
}

const FALLBACK = { radius: 1.6, arcDeg: 65, width: 0.6 };

describe('v9s.x 技能脚底指示器：数据驱动的范围 / 瞄准方向', () => {
  it('mapHitShape：Core 的 4 种命中形状 → 3 种指示器形状', () => {
    expect(mapHitShape('circle')).toBe('circle');
    expect(mapHitShape('capsule')).toBe('capsule');
    expect(mapHitShape('sector')).toBe('sector');
    expect(mapHitShape('cone')).toBe('sector');
  });

  it('inferSkillRange：新增技能自带 shape/radius/arcDeg/width 即可自动适配，无需 kind 提示', () => {
    const r = inferSkillRange(
      { shape: 'capsule', radius: 5, arcDeg: 30, width: 0.8 } as Record<string, unknown>,
      'someNewKind', FALLBACK,
    );
    expect(r.shape).toBe('capsule');
    expect(r.radius).toBe(5);
    expect(r.arcDeg).toBe(30);
    expect(r.width).toBe(0.8);
  });

  it('inferSkillRange：引导齐射读 homingRange（不是飞弹 radius），张角 = 波内实际散布（无魔法余量）', () => {
    const r = inferSkillRange(
      {
        radius: 0.3, homingRange: 8, perWave: 3, spreadDeg: 8,
      } as Record<string, unknown>,
      'channelVolley', FALLBACK,
    );
    expect(r.shape).toBe('sector');
    expect(r.radius).toBe(8);
    // 旧版是 (perWave-1)*spread + 24 = 40°；现在严格取数据 = 16°
    expect(r.arcDeg).toBe(2 * 8);
  });

  it('inferSkillRange：电环读 radius → 整圆', () => {
    const r = inferSkillRange(
      { radius: 2.4, duration: 1.2 } as Record<string, unknown>,
      'groundRing', FALLBACK,
    );
    expect(r.shape).toBe('circle');
    expect(r.radius).toBe(2.4);
  });

  it('空闲态不画任何指示器', () => {
    expect(describeSkillIndicators(makeWorld())).toEqual([]);
  });

  it('弓蓄力：line，长度来自 hits.reach.bow，宽度 / 亮度随蓄力增长', () => {
    const w = makeWorld();
    w.combat.weapon = 'bow';
    w.combat.charging = true;
    w.combat.charge = 0.6;
    w.character.facing = 0.4;
    const s = byId(describeSkillIndicators(w), 'bow-charge');
    expect(s.shape).toBe('line');
    expect(s.radius).toBe(w.config.hits.reach.bow);
    expect(s.width).toBeCloseTo(0.35 + 0.6 * 0.45, 6);
    expect(s.yaw).toBeCloseTo(0.4, 6);
  });

  it('法杖引导：sector，半径来自技能 params.homingRange，朝向 = channelYaw', () => {
    const w = makeWorld();
    w.combat.weapon = 'staff';
    w.abilities.channeling = true;
    w.abilities.channelYaw = -0.8;
    const s = byId(describeSkillIndicators(w), 'skill:arcane');
    expect(s.shape).toBe('sector');
    expect(s.radius).toBe(w.config.abilities.arcane.homingRange);
    expect(s.yaw).toBeCloseTo(-0.8, 6);
  });

  it('技2 电环：circle，圆心在放置点、半径取运行态', () => {
    const w = makeWorld();
    w.combat.weapon = 'staff';
    w.abilities.rings.push({
      id: 7, x: 3, z: -2, radius: 2.4, life: 0.6, duration: 1.2, pulseTimer: 0,
    });
    const s = byId(describeSkillIndicators(w), 'ring:7');
    expect(s.shape).toBe('circle');
    expect(s.radius).toBe(2.4);
    expect(s.x).toBe(3);
    expect(s.z).toBe(-2);
    expect(s.intensity).toBeCloseTo(0.5, 6);
  });

  it('近战挥击：半径含目标半径余量，扇角 = 2×半角（hits.arcDeg 是半角，不是扇面全角）', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    w.combat.attackProgress = 0.5;
    w.combat.attackFacing = 0.3;
    const s = byId(describeSkillIndicators(w), 'melee');
    expect(s.shape).toBe('sector');
    // playerHits: `if (dist > reach + extra) continue`，extra = dummies.radius
    expect(s.radius).toBe(w.config.hits.reach.greatsword + w.config.dummies.radius);
    // playerHits: `(d·f)/|d| >= cos(arcDeg)` → 扇面全角是 arcDeg 的两倍
    expect(s.arcDeg).toBe(2 * w.config.hits.arcDeg);
    expect(s.startDeg).toBe(-w.config.hits.arcDeg);
    expect(s.endDeg).toBe(w.config.hits.arcDeg);
    expect(s.yaw).toBeCloseTo(0.3, 6); // 攻击锁定朝向
  });

  it('派生招：形状 / 半径 / 张角直接吃 links.moves[weapon].hit', () => {
    const w = makeWorld();
    w.combat.weapon = 'sword-shield';
    w.playerLink.phase = 'active';
    w.playerLink.facing = 0.7;
    const move = w.config.links.moves['sword-shield']!;
    const s = byId(describeSkillIndicators(w), 'link');
    expect(s.shape).toBe(mapHitShape(move.hit.shape));
    expect(s.radius).toBe(Math.max(move.hit.radius, move.distance));
    expect(s.arcDeg).toBe(move.hit.arcDeg);
    expect(s.yaw).toBeCloseTo(0.7, 6);
  });

  it('拖拽瞄准方向优先于所有锁定朝向', () => {
    const w = makeWorld();
    w.combat.weapon = 'staff';
    w.abilities.channeling = true;
    w.abilities.channelYaw = -0.8;
    const s = byId(describeSkillIndicators(w, { x: 1, z: 0 }), 'skill:arcane');
    expect(s.yaw).toBeCloseTo(Math.atan2(1, 0), 6);
  });

  it('数据驱动：热改 config 的 reach / arcDeg，指示器立刻跟着变（不写死数值）', () => {
    const w = makeWorld();
    w.combat.weapon = 'sword-shield';
    w.combat.phase = 'active';
    w.combat.attackProgress = 0.5;
    const before = byId(describeSkillIndicators(w), 'melee');
    w.config.hits.reach['sword-shield'] += 2;
    w.config.hits.arcDeg = 30; // 半角 30° → 全角 60°，扫掠门覆盖得住，不会被裁
    const after = byId(describeSkillIndicators(w), 'melee');
    expect(after.radius).toBeCloseTo(before.radius + 2, 6);
    expect(after.arcDeg).toBe(2 * 30);
    expect(after.startDeg).toBe(-30);
    expect(after.endDeg).toBe(30);
  });

  it('数据驱动：热改技能 params 的射程，技能指示器立刻跟着变', () => {
    const w = makeWorld();
    w.combat.weapon = 'staff';
    w.abilities.channeling = true;
    const before = byId(describeSkillIndicators(w), 'skill:arcane');
    const rt = w.skills.find((x) => x.cfg.kind === 'channelVolley')!;
    (rt.params as unknown as Record<string, unknown>).homingRange = before.radius + 4;
    const after = byId(describeSkillIndicators(w), 'skill:arcane');
    expect(after.radius).toBe(before.radius + 4);
  });
});

describe('v9s.x 细化：弓特判 / 内圈裁剪 / 扇角数据化 / 存在感', () => {
  it('弓释放（charging=false + phase=active）不再画近战扇形 —— 与 Core playerHits 同源', () => {
    const w = makeWorld();
    w.combat.weapon = 'bow';
    w.combat.charging = false;
    w.combat.phase = 'active';
    w.combat.attackProgress = 0.5;
    w.combat.attackFacing = 0;
    const list = describeSkillIndicators(w);
    expect(list.find((x) => x.id === 'melee')).toBeUndefined();
    expect(list.some((x) => x.shape === 'sector')).toBe(false);
    expect(list).toEqual([]);
  });

  it('近战武器释放仍然画扇形（弓特判没误伤正常挥击）', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.charging = false;
    w.combat.phase = 'active';
    w.combat.attackProgress = 0.5;
    expect(byId(describeSkillIndicators(w), 'melee').shape).toBe('sector');
  });

  it('内圈裁剪半径 = core.characterRadius + 小余量（角色碰撞范围内不糊填充）', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    const s = byId(describeSkillIndicators(w), 'melee');
    expect(s.innerRadius).toBeCloseTo(w.config.characterRadius + 0.02, 6);
    expect(s.innerRadius).toBeGreaterThan(0);
    expect(s.innerRadius).toBeLessThan(s.radius);
  });

  it('电环圆心在放置点，不按角色碰撞半径裁剪', () => {
    const w = makeWorld();
    w.abilities.rings.push({
      id: 9, x: 4, z: 1, radius: 2.4, life: 1, duration: 1, pulseTimer: 0,
    });
    expect(byId(describeSkillIndicators(w), 'ring:9').innerRadius).toBe(0);
  });

  it('数据驱动：热改 characterRadius，所有脚底指示器的内圈立刻跟着变', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    const before = byId(describeSkillIndicators(w), 'melee');
    w.config.characterRadius += 0.2;
    const after = byId(describeSkillIndicators(w), 'melee');
    expect(after.innerRadius).toBeCloseTo(before.innerRadius + 0.2, 6);
  });

  it('扇角严格来自技能数据：齐射 = (perWave-1)×spreadDeg，热改跟着变', () => {
    const w = makeWorld();
    w.combat.weapon = 'staff';
    w.abilities.channeling = true;
    const rt = w.skills.find((x) => x.cfg.kind === 'channelVolley')!;
    const p = rt.params as unknown as Record<string, unknown>;
    const before = byId(describeSkillIndicators(w), 'skill:arcane');
    expect(before.arcDeg).toBe(((p.perWave as number) - 1) * (p.spreadDeg as number));
    p.spreadDeg = 12;
    const after = byId(describeSkillIndicators(w), 'skill:arcane');
    expect(after.arcDeg).toBe(((p.perWave as number) - 1) * 12);
  });

  it('存在感下调：填充 / 轮廓 / 箭头都低于旧版（0.22 / 0.9 / 0.95），外弧亮边更淡', () => {
    expect(INDICATOR_STYLE.fill).toBeLessThan(0.22);
    expect(INDICATOR_STYLE.outline).toBeLessThan(0.9);
    expect(INDICATOR_STYLE.arrow).toBeLessThan(0.95);
    expect(INDICATOR_STYLE.rim).toBeLessThanOrEqual(0.5);
    expect(INDICATOR_STYLE.fill).toBeLessThan(INDICATOR_STYLE.outline);
  });
});

describe('v9s.x 细化：显示 / 退出淡入淡出', () => {
  function chargingBow(): ReturnType<typeof makeWorld> {
    const w = makeWorld();
    w.combat.weapon = 'bow';
    w.combat.charging = true;
    w.combat.charge = 0.6;
    return w;
  }

  it('出现时 alpha 从 0 逐帧升到 1（不再瞬间跳出来）', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = chargingBow();
    view.update(w, undefined, 0.25);
    const a1 = view.fadeDebug().find((x) => x.id === 'bow-charge');
    expect(a1).toBeDefined();
    expect(a1!.alpha).toBeGreaterThan(0);
    expect(a1!.alpha).toBeLessThan(1);
    settle(view, w);
    expect(view.fadeDebug().find((x) => x.id === 'bow-charge')!.alpha).toBe(1);
    expect(view.debug().some((x) => x.id === 'bow-charge')).toBe(true);
    view.dispose();
  });

  it('退出时 alpha 单调递减、归零后回收几何（不再瞬间消失）', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = chargingBow();
    settle(view, w);
    expect(view.fadeDebug().find((x) => x.id === 'bow-charge')!.alpha).toBe(1);

    w.combat.charging = false;
    w.combat.phase = 'idle';
    const seq: number[] = [];
    for (let i = 0; i < 8; i++) {
      view.update(w, undefined, 0.25);
      const f = view.fadeDebug().find((x) => x.id === 'bow-charge');
      seq.push(f ? f.alpha : 0);
    }
    expect(seq[0]).toBeGreaterThan(0);
    expect(seq[0]).toBeLessThan(1);
    for (let i = 1; i < seq.length; i++) expect(seq[i]).toBeLessThanOrEqual(seq[i - 1]);
    expect(seq[seq.length - 1]).toBe(0);
    expect(view.fadeDebug().some((x) => x.id === 'bow-charge')).toBe(false);
    expect(view.debug()).toEqual([]); // 描述里已经没有，但视觉仍在淡出
    view.dispose();
  });

  it('淡出途中重新出现：alpha 平滑回升（过渡可打断）', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = chargingBow();
    settle(view, w);
    w.combat.charging = false;
    w.combat.phase = 'idle';
    view.update(w, undefined, 0.25); // 淡出一点
    const low = view.fadeDebug().find((x) => x.id === 'bow-charge')!.alpha;
    expect(low).toBeLessThan(1);
    w.combat.charging = true;
    view.update(w, undefined, 0.25);
    const back = view.fadeDebug().find((x) => x.id === 'bow-charge')!.alpha;
    expect(back).toBeGreaterThan(low);
    view.dispose();
  });

  it('外弧亮边与箭头关掉深度测试（草层不透明写深度，否则半弧形会被整片吞掉）', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = chargingBow();
    view.update(w, undefined, 0.25);
    const noDepth: THREE.Mesh[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && (m.material as THREE.Material).depthTest === false) noDepth.push(m);
    });
    // 有面积的亮边 + 箭头都不吃深度，保证方向与「半弧形」在草丛里仍可辨
    expect(noDepth.length).toBeGreaterThanOrEqual(2);
    view.dispose();
  });

  it('热改配置重建几何时保留 alpha，不重新淡入闪一下', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = chargingBow();
    settle(view, w);
    w.config.characterRadius += 0.2;
    view.update(w, undefined, 0.25);
    expect(view.fadeDebug().find((x) => x.id === 'bow-charge')!.alpha).toBe(1);
    view.dispose();
  });
});

/* ---------------- v9s.x 口径统一 / 描边加宽 ---------------- */

describe('v9s.x 口径统一：显示范围与 Core 判定同源（大剑不再画小）', () => {
  it('扇区 = 前半球 ∩ 扫掠区间，半径 / 扇角全部取自 meleeCoverage', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    const cov = meleeCoverage(w);
    const s = byId(describeSkillIndicators(w), 'melee');
    expect(cov.melee).toBe(true);
    expect(s.radius).toBe(cov.radius);
    expect(s.arcDeg).toBeCloseTo(s.endDeg - s.startDeg, 6);
    // 大剑第一段横扫覆盖整个前半球 → 扇面就是 2×半角
    expect(s.arcDeg).toBe(2 * cov.halfArcDeg);
  });

  it('大剑第三击：扫掠门偏一侧 → 扇区非对称，起止角与 Core 判定区间一致', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    w.combat.comboIndex = 3;
    const cov = meleeCoverage(w);
    const s = byId(describeSkillIndicators(w), 'melee');
    expect(cov.sweep).not.toBeNull();
    expect(s.startDeg).toBe(Math.max(-cov.halfArcDeg, cov.sweep!.lo));
    expect(s.endDeg).toBe(Math.min(cov.halfArcDeg, cov.sweep!.hi));
    expect(s.startDeg).toBeGreaterThan(-cov.halfArcDeg); // 左侧被扫掠门削掉
    expect(s.arcDeg).toBeLessThan(2 * cov.halfArcDeg);
  });

  it('大剑击地圆：额外 circle，半径 = groundSlam.radius + 目标半径，圆心沿朝向前移', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    w.combat.attackFacing = 0.2;
    const cov = meleeCoverage(w);
    const slam = byId(describeSkillIndicators(w), 'slam');
    const gs = w.config.combat.weapons.greatsword!.groundSlam!;
    expect(slam.shape).toBe('circle');
    expect(slam.radius).toBe(gs.radius + w.config.dummies.radius);
    expect(slam.radius).toBe(cov.slam!.radius);
    expect(slam.x).toBeCloseTo(
      w.character.position.x + Math.sin(0.2) * cov.slam!.ahead, 6,
    );
    expect(slam.z).toBeCloseTo(
      w.character.position.z + Math.cos(0.2) * cov.slam!.ahead, 6,
    );
    expect(slam.innerRadius).toBe(0); // 圆心在落点，不按角色碰撞半径挖空
  });

  it('无击地配置的武器不画击地圆', () => {
    const w = makeWorld();
    w.combat.weapon = 'sword-shield';
    w.combat.phase = 'active';
    expect(describeSkillIndicators(w).find((x) => x.id === 'slam')).toBeUndefined();
  });

  it('弓释放：melee / slam 都不画（bow 特判来自 Core，不在表现层另立表）', () => {
    const w = makeWorld();
    w.combat.weapon = 'bow';
    w.combat.charging = false;
    w.combat.phase = 'active';
    w.combat.attackProgress = 0.5;
    expect(meleeCoverage(w).melee).toBe(false);
    expect(describeSkillIndicators(w)).toEqual([]);
  });

  it('热改 dummies.radius / groundSlam.radius，扇区与击地圆立刻跟随', () => {
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    const before = byId(describeSkillIndicators(w), 'melee');
    const slamBefore = byId(describeSkillIndicators(w), 'slam');
    w.config.dummies.radius += 0.4;
    w.config.combat.weapons.greatsword!.groundSlam!.radius += 1;
    const after = byId(describeSkillIndicators(w), 'melee');
    const slamAfter = byId(describeSkillIndicators(w), 'slam');
    expect(after.radius).toBeCloseTo(before.radius + 0.4, 6);
    expect(slamAfter.radius).toBeCloseTo(slamBefore.radius + 1.4, 6);
  });
});

describe('v9s.x 描边：有面积窄带，宽度不再随射程变粗', () => {
  it('indicatorBand 比最初 1px 版更宽，且按射程自适应、上限受控', () => {
    expect(INDICATOR_STYLE.bandMin).toBeGreaterThan(0.06);
    // 旧断言 bandMax > 0.18 在整体降半后已不成立；上限现在压到与近战同宽
    expect(INDICATOR_STYLE.bandMax).toBeLessThanOrEqual(0.09);
    expect(INDICATOR_STYLE.bandRatio).toBeGreaterThan(0.035);
    expect(indicatorBand(2.3)).toBeGreaterThan(Math.max(0.06, Math.min(0.18, 2.3 * 0.035)));
    expect(indicatorBand(9)).toBeLessThanOrEqual(INDICATOR_STYLE.bandMax);
    expect(indicatorBand(0.3)).toBeGreaterThanOrEqual(INDICATOR_STYLE.bandMin);
    expect(indicatorBand(5)).toBeGreaterThan(indicatorBand(2));
  });

  it('大射程（弓 9m / 法杖 8m）描边不再比近战粗 —— 修复「法杖和弓还是宽的」', () => {
    const melee = indicatorBand(2.3); // 近战 2.3m 的带宽，用户已确认合适
    // 真实配置：hits.reach.bow = 9、abilities.arcane.homingRange = 8
    for (const r of [8, 9, 14]) {
      expect(indicatorBand(r)).toBeLessThanOrEqual(melee * 1.2);
    }
    expect(indicatorBand(9)).toBeLessThan(0.18); // 旧版撞 0.18 上限偏粗，现已收敛
  });

  it('轮廓改为 Mesh 窄带，场景里不再有 1px 的 LineSegments', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    view.update(w, undefined, 0.25);
    const lines: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if ((o as THREE.LineSegments).isLineSegments) lines.push(o);
    });
    expect(lines.length).toBe(0);
    view.dispose();
  });

  it('非对称扇区时箭头指向扇面中心角，而不是固定 +Z', () => {
    const scene = new THREE.Scene();
    const view = createSkillIndicatorView(scene);
    const w = makeWorld();
    w.combat.weapon = 'greatsword';
    w.combat.phase = 'active';
    w.combat.comboIndex = 3;
    view.update(w, undefined, 0.25);
    const s = byId(view.debug(), 'melee');
    const rotated: THREE.Mesh[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && Math.abs(o.rotation.y) > 1e-6) rotated.push(m);
    });
    expect(rotated.length).toBeGreaterThan(0);
    expect(rotated[0].rotation.y).toBeCloseTo(
      ((s.startDeg + s.endDeg) / 2) * Math.PI / 180, 6,
    );
    view.dispose();
  });
});
