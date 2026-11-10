import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { applyHit } from '../src/core';
import type { AppConfig } from '../src/core';
import { makeLabWorld } from './helpers';
import { createDummyRig } from '../src/presentation/dummy-rig';

/**
 * v9s.63 · 鱼人（Murloc）造型。
 *
 * 造型本身没法用单测「看」出来，所以这里测的是**它不能破坏的东西**：
 *   1) 体型配置自洽（height = 腿 + 躯干 + 头，否则碰撞身高和视觉对不上）；
 *   2) 骨骼节点名与人类完全一致 —— 断肢（`SEVER_NODE`）与插箭（`boneAtWorld`）
 *      全靠名字查找，改名就静默失效；
 *   3) 造型确实换了（头部零件数），且**不传 variant 时逐件保持原样**；
 *   4) 配置透传：只有鱼人滩那几只有血量，别的工位仍是打不死的测试桩。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

function rig(variant: 'human' | 'murloc') {
  return createDummyRig(
    raw.view.voxel, raw.view.colors, '#e2a45c', 1, raw.view.dummies, 2.6,
    raw.view.gait, raw.view.hurt, raw.view.lean, raw.view.ik, variant,
  );
}

describe('v9s.63 鱼人', () => {
  it('体型配置自洽：height = 腿 + 躯干 + 头，且开了 murloc 造型', () => {
    const bt = raw.view.bodyTypes?.['murloc'];
    expect(bt).toBeDefined();
    const v = bt!.voxel!;
    expect(v.legLength + v.bodyHeight + v.headSize).toBeCloseTo(bt!.height, 6);
    expect(v.style?.murloc).toBe(true);
    // 头必须是三者里最大的一项 —— 这是「鱼人」的比例来源
    expect(v.headSize).toBeGreaterThan(v.bodyHeight);
    expect(v.headSize).toBeGreaterThan(v.legLength);
  });

  it('骨骼节点名与人类一致（断肢 / 插箭靠名字查找，改名就断）', () => {
    const r = rig('murloc');
    for (const n of ['pelvis', 'upper', 'headPivot', 'shoulderL', 'shoulderR', 'hipL', 'hipR']) {
      expect(r.group.getObjectByName(n), n).toBeDefined();
    }
    r.dispose();
  });

  it('造型确实换了；不传 variant 时头部仍是「头 + 两只眼」三件', () => {
    const human = rig('human');
    const murloc = rig('murloc');
    const hh = human.group.getObjectByName('headPivot')!;
    const mh = murloc.group.getObjectByName('headPivot')!;
    expect(hh.children.length).toBe(3);
    // 颅 + 下颌 + 嘴 + 4 颗牙 + 喉 + 2×3 眼件 + 冠 + 2 尖 + 2×3 鳃 ≈ 23
    expect(mh.children.length).toBeGreaterThan(18);
    human.dispose();
    murloc.dispose();
  });

  it('工位透传：只有鱼人带 variant / 血量，其余工位仍是打不死的测试桩', () => {
    const w = makeLabWorld();
    const fish = w.config.dummies.spawn.filter((s) => s.variant === 'murloc');
    expect(fish.length).toBe(3);
    expect(fish.every((s) => (s.health ?? 0) > 0)).toBe(true);

    const armed = w.dummies.filter((d) => !d.weapon && d.health.maxHp > 0);
    expect(armed.length).toBe(fish.length);
    // 没声明 variant 的一定是 human —— 缺省不能被鱼人污染
    for (const s of w.config.dummies.spawn) {
      if (s.variant === undefined) expect(s.health).toBeUndefined();
    }
  });

  it('鱼人能被打死并断头：重击打高位 → sever.part = head', () => {
    const w = makeLabWorld();
    const i = w.dummies.findIndex((d) => !d.weapon && d.health.maxHp > 0);
    expect(i).toBeGreaterThanOrEqual(0);
    const d = w.dummies[i];
    for (let k = 0; k < 20 && !d.health.dead; k++) {
      applyHit(w, { kind: 'dummy', index: i }, {
        type: 'heavy', duration: 0, dirX: 0, dirZ: 1, knockback: 0, hitU: 0.9,
      });
    }
    expect(d.health.dead).toBe(true);
    expect(d.health.sever?.part).toBe('head');
  });
});
