import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import {
  AnimProbe, auditFrame, diffInto, matrixMarkdown, PROBE_PROPS, readSnapshot,
} from '../src/presentation/anim-probe';
import type { LayerSpec, ProbeNodeSpec } from '../src/presentation/anim-probe';
import { ANIM_LAYERS } from '../src/presentation/anim-layers';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';

/**
 * v9s.74 · 动画层的「通道所有权」守卫。
 *
 * 背景：`voxel-rig.update()` 里二十多层的执行顺序只写在注释编号里（2.05 → 2.85 →
 * 3.55 → 4），归属靠口头约定。于是反复出现两类 bug：
 *
 *  1. **越权**：某层写了不属于它的通道。v9s.73 的 `applyCombatPose` 每帧把
 *     `upper.rotation.y` 归零，把剑盾的持械站姿（0.12 rad）吃成 0.03；
 *  2. **双覆盖**：两个 `override` 语义的层同时活跃，后者静默覆盖前者。
 *
 * 这两类问题的表现都是「数值不对但没报错」，只能靠截图 / 单点读数发现。这里把
 * 「层 → 允许写的通道」变成可测数据：探针在层边界采快照做差，帧尾比对声明表。
 *
 * 三条设计取舍：
 *  - **只监控躯干 / 骨盆 / 下盘 / 踝**。手臂按设计就是整层覆盖（YXZ 翻支不能走增量），
 *    多层写它是约定，纳入监控只会产生噪声；
 *  - **`derive` 不算冲突**。`splitSpine` / `distributeYaw` 必然改写上一层写的值，
 *    那是「重分配」而不是「抢所有权」；
 *  - **默认关闭**。关闭时每层只多一次空函数调用，不影响线上与确定性快照。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0,
  dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};
const HIT: HurtState = {
  lastAt: 0, type: 'light', timer: 0.3, duration: 0.4, dirX: 0, dirZ: 1, knockX: 0, knockZ: 0,
};

// ---------------------------------------------------------------- 纯函数

function fakeNode(): ProbeNodeSpec {
  return {
    id: 'n',
    node: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  };
}

describe('anim-probe：纯函数', () => {
  it('diff 只记真正变了的通道（写回同值不算「写」）', () => {
    const nodes = [fakeNode()];
    const a = new Float32Array(PROBE_PROPS.length);
    const b = new Float32Array(PROBE_PROPS.length);
    readSnapshot(nodes, a);
    b[0] = 0.25;                       // px 变了
    b[1] = 0;                          // py 写回 0
    const out = new Set<string>();
    diffInto(a, b, nodes, out);
    expect([...out]).toEqual(['n.px']);
  });

  it('越权：写了声明里没有的通道会被点名，未登记的层整层算越权', () => {
    const specs: LayerSpec[] = [{ id: 'A', writes: { 'n.px': 'add' } }];
    const observed = new Map<string, Set<string>>([
      ['A', new Set(['n.px', 'n.ry'])],
      ['幽灵层', new Set(['n.pz'])],
    ]);
    const r = auditFrame(specs, observed, ['A', '幽灵层']);
    expect(r.overreach).toEqual([
      { layer: 'A', channel: 'n.ry', kind: 'undeclared' },
      { layer: '幽灵层', channel: 'n.pz', kind: 'undeclared' },
    ]);
  });

  it('冲突：两个 override 同通道 → 冲突；add / derive / reset 不参与', () => {
    const specs: LayerSpec[] = [
      { id: 'A', writes: { 'n.rx': 'override', 'n.ry': 'add' } },
      { id: 'B', writes: { 'n.rx': 'override', 'n.ry': 'add' } },
      { id: 'S', writes: { 'n.rx': 'derive' } },
      { id: 'R', writes: { 'n.rx': 'reset' } },
    ];
    const observed = new Map<string, Set<string>>([
      ['A', new Set(['n.rx'])],
      ['B', new Set(['n.rx'])],
      ['S', new Set(['n.rx'])],
      ['R', new Set(['n.rx'])],
    ]);
    const r = auditFrame(specs, observed, ['A', 'B', 'S', 'R']);
    expect(r.conflicts).toEqual([{ channel: 'n.rx', layers: ['A', 'B'] }]);
    expect(r.overreach).toEqual([]);
  });

  it('采集器：mark 合并同一层的多段写入，换帧清空', () => {
    const node = fakeNode();
    const probe = new AnimProbe([node]);
    probe.beginFrame();
    node.node.position.x = 1;
    probe.mark('A');
    node.node.position.y = 2;
    probe.mark('A');
    probe.mark('B');
    const mat = probe.matrix();
    expect([...mat.get('A')!].sort()).toEqual(['n.px', 'n.py']);
    expect(mat.get('B')).toBeUndefined();
    probe.beginFrame();
    expect(probe.matrix().size).toBe(0);
  });

  it('矩阵导出的列数 = 受控通道数，符号与语义对应', () => {
    const nodes: ProbeNodeSpec[] = [
      { id: 'a', node: fakeNode().node },
      { id: 'b', node: fakeNode().node, props: ['ry'] },
    ];
    const md = matrixMarkdown(
      [{ id: 'L', writes: { 'a.px': 'add', 'b.ry': 'override', 'a.rx': 'derive' } }],
      nodes,
    );
    const [head, , row] = md.split('\n');
    expect(head.split('|').length - 2).toBe(8);      // 7 个受控通道 + 1 个层列
    expect(row).toContain('| + |');
    expect(row).toContain('| = |');
    expect(row).toContain('| ~ |');
  });
});

// ---------------------------------------------------------------- 集成

/** 六个场景：待机 / 行走转身 / 跳跃落地 / 三武器连打 / 受击 / 鱼人体态。 */
describe('anim-probe：六个场景下没有越权、没有冲突', () => {
  const violations: string[] = [];

  function build(
    extra: Record<string, unknown> = {},
    voxelExtra: Record<string, unknown> = {},
  ) {
    const w = makeWorld();
    const rig = createVoxelRig(
      { ...raw.view.voxel, ...voxelExtra },
      raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      { ...raw.view.animation, probe: { enabled: true }, ...extra },
      { ...raw.view.ik, enabled: true }, raw.view.links, raw.view.weaponWrist,
      raw.view.balance,
    );
    return { w, rig };
  }

  function tick(
    w: ReturnType<typeof makeWorld>,
    rig: ReturnType<typeof createVoxelRig>,
    n: number,
    it = intent({}),
    hurt: HurtState = NONE,
  ) {
    for (let i = 0; i < n; i++) {
      step(w, w.config.fixedDt, it);
      rig.update(w.character, w.combat, hurt, w.config.fixedDt, false, w.time);
      const rep = rig.animProbe();
      if (!rep) continue;
      for (const o of rep.overreach) {
        violations.push(`越权 ${o.layer} → ${o.channel}`);
      }
      for (const c of rep.conflicts) {
        violations.push(`冲突 ${c.channel} ← ${c.layers.join(' + ')}`);
      }
    }
  }

  it('跑完六场景，报告为空', () => {
    // 1) 待机
    {
      const { w, rig } = build();
      tick(w, rig, 40);
      // 先确认探针真的在跑（否则下面「没有违规」是假通过）
      const rep0 = rig.animProbe();
      expect(rep0).not.toBeNull();
      expect(rep0!.layers.length).toBeGreaterThanOrEqual(15);
      // 2) 行走 + 转向
      for (let i = 0; i < 60; i++) {
        step(w, w.config.fixedDt, intent({ moveZ: 1, moveX: Math.sin(i * 0.1) }));
        rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
        const rep = rig.animProbe()!;
        for (const o of rep.overreach) violations.push(`越权 ${o.layer} → ${o.channel}`);
        for (const c of rep.conflicts) violations.push(`冲突 ${c.channel} ← ${c.layers.join(' + ')}`);
      }
      // 3) 跳跃 + 落地
      tick(w, rig, 12, intent({ jumpPressed: true }));
      tick(w, rig, 50);
      // 4) 三武器连打
      for (const weapon of ['sword-shield', 'dual-swords', 'greatsword'] as const) {
        (w.combat as { weapon: string }).weapon = weapon;
        for (let i = 0; i < 90; i++) {
          step(w, w.config.fixedDt, intent({ attackPressed: i % 14 === 0, moveZ: 0.3 }));
          rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
          const rep = rig.animProbe()!;
          for (const o of rep.overreach) violations.push(`越权 ${o.layer} → ${o.channel}`);
          for (const c of rep.conflicts) violations.push(`冲突 ${c.channel} ← ${c.layers.join(' + ')}`);
        }
      }
      // 5) 受击
      tick(w, rig, 24, intent({}), HIT);
      rig.dispose();
    }
    // 6) 下半身跨步死路径（线上 lowerBodyWeight = 0，这里强制打开）
    {
      const { w, rig } = build({
        attack: { ...raw.view.animation.attack, lowerBodyWeight: 0.5 },
      });
      for (let i = 0; i < 90; i++) {
        step(w, w.config.fixedDt, intent({ attackPressed: i % 12 === 0 }));
        rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
        const rep = rig.animProbe()!;
        for (const o of rep.overreach) violations.push(`越权 ${o.layer} → ${o.channel}`);
        for (const c of rep.conflicts) violations.push(`冲突 ${c.channel} ← ${c.layers.join(' + ')}`);
      }
      rig.dispose();
    }
    // 7) 鱼人体态（posture / waist 只在这一支上跑）
    {
      const { w, rig } = build({}, {
        style: {
          murloc: true,
          posture: {
            pitch: 0.45, waist: 0.2, headLift: 0.8, headReach: 0.03, hipShare: 0.45,
          },
          breath: true, hunch: 0.1, kneeSink: 0.02,
        },
      });
      tick(w, rig, 40);
      tick(w, rig, 40, intent({ moveZ: 1 }));
      rig.dispose();
    }

    const uniq = [...new Set(violations)];
    expect(uniq).toEqual([]);
  });

  it('声明表覆盖所有受控通道名（防止写错节点前缀）', () => {
    // v9s.76 起多了前掌（ballL / ballR）：heel-toe roll 只写它们的 rx。
    const known = new Set(['root', 'pelvis', 'lower', 'upper', 'chest',
      'ankleL', 'ankleR', 'ballL', 'ballR']);
    const props = new Set(['px', 'py', 'pz', 'rx', 'ry', 'rz']);
    for (const layer of ANIM_LAYERS) {
      for (const ch of Object.keys(layer.writes)) {
        const [node, prop] = ch.split('.');
        expect(known.has(node), `${layer.id} 的 ${ch}：节点不在监控集`).toBe(true);
        expect(props.has(prop), `${layer.id} 的 ${ch}：属性名不合法`).toBe(true);
      }
    }
  });

  it('探针关闭时不产生报告（线上零负担）', () => {
    const w = makeWorld();
    const rig = createVoxelRig(
      raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
      raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
      raw.view.animation,
      { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
    );
    step(w, w.config.fixedDt, intent({}));
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    expect(rig.animProbe()).toBeNull();
    rig.dispose();
  });
});
