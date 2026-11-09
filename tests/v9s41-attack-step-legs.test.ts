import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, World } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const TAU = Math.PI * 2;
/** 折叠到 (-π, π]：跨段只比「差了多少」，不关心转到第几圈 */
const wrap = (a: number): number => ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;

function makeRig(w: World): { rig: VoxelRig; n: ReturnType<typeof rigNodes> } {
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation,
  );
  return { rig, n: rigNodes(rig) };
}

type SegRec = {
  /** 该段跨步的起始相位（`attackWeights().strideBase`） */
  base: number;
  /** 段内腿角差 (hipL − hipR) 的极值：>0 = 右腿在前 */
  dMin: number;
  dMax: number;
  /** 换到这一段的那一帧：腿角 / 骨盆前后位移的单帧跳变 */
  legJump: number;
  zJump: number;
  /** 采到的帧数（末段可能被采样窗口截断，判幅度时要跳过） */
  n: number;
};

type Probe = { segs: Map<number, SegRec>; attacks: Map<number, SegRec> };

/**
 * 起手一次攻击后逐帧推进；`presses` 决定某帧是否再按攻击键（连段 / 隔一会儿再打）。
 *
 * 核心读数 `strideBase` = 本段跨步的起始相位。v9s.41 之前每段都从「起手那一帧锁定的
 * 基准」出发、再往返回零，所以每段起始相位完全相同，腿的动作也完全重合（用户反馈
 * 「再接跨步攻击没有换腿」）。现在每段 = 迈一步（+π），并从上一段停下的相位接着走。
 */
function sample(presses: (w: World, i: number) => boolean, frames: number): Probe {
  const w = makeWorld();
  const { rig, n } = makeRig(w);
  run(w, 1, intent({ weaponSlot: 1 }));
  run(w, 1, intent({ attackPressed: true }));
  const probe: Probe = { segs: new Map(), attacks: new Map() };
  let prevSeg = 0;
  let prevAttack = 0;
  let prevL = n.hipL.rotation.x;
  let prevZ = n.pelvis.position.z;
  for (let i = 0; i < frames; i++) {
    run(w, 1, intent({ attackPressed: presses(w, i) }));
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    const c = w.combat;
    const aw = rig.attackWeights();
    const d = n.hipL.rotation.x - n.hipR.rotation.x;
    const z = n.pelvis.position.z;
    const jumpLeg = Math.abs(n.hipL.rotation.x - prevL);
    const jumpZ = Math.abs(z - prevZ);
    if (c.phase !== 'idle') {
      const newSeg = c.comboIndex !== prevSeg;
      const newAtk = c.attackId !== prevAttack;
      if (newSeg || newAtk) {
        probe.segs.set(c.comboIndex, {
          base: aw.strideBase, dMin: d, dMax: d, legJump: jumpLeg, zJump: jumpZ, n: 1,
        });
        probe.attacks.set(c.attackId, {
          base: aw.strideBase, dMin: d, dMax: d, legJump: jumpLeg, zJump: jumpZ, n: 1,
        });
        prevSeg = c.comboIndex;
        prevAttack = c.attackId;
      } else {
        const seg = probe.segs.get(c.comboIndex)!;
        seg.dMin = Math.min(seg.dMin, d);
        seg.dMax = Math.max(seg.dMax, d);
        seg.n += 1;
        const atk = probe.attacks.get(c.attackId)!;
        atk.dMin = Math.min(atk.dMin, d);
        atk.dMax = Math.max(atk.dMax, d);
      }
    } else {
      prevSeg = 0;
      prevAttack = 0;
    }
    prevL = n.hipL.rotation.x;
    prevZ = z;
  }
  return probe;
}

const mash = (w: World): boolean => w.combat.phase === 'recovery' && w.combat.phaseTimer > 0.05;

describe('v9s.41 连击跨步换腿', () => {
  it('三段连击：每段起始相位比上一段多走 ≈π（一步），不再回到同一基准', () => {
    const { segs } = sample(mash, 220);
    const s1 = segs.get(1)!;
    const s2 = segs.get(2)!;
    const s3 = segs.get(3)!;
    const adv1 = wrap(s2.base - s1.base);
    const adv2 = wrap(s3.base - s2.base);
    // 一段 = 迈一步：半圈左右（取消窗口会切掉一点，所以给 [0.4π, 1.2π]）
    // v9s.55：剑盾 active 从 0.13 缩到 0.12、recovery 拉长到 0.27，取消窗口切掉的
    // 相位多一点（实测 1.36 rad ≈ 0.43π），仍是一步的量级。
    expect(Math.abs(adv1), `第 1→2 段推进 ${adv1.toFixed(2)}`).toBeGreaterThan(Math.PI * 0.4);
    expect(Math.abs(adv1)).toBeLessThan(Math.PI * 1.2);
    expect(Math.abs(adv2), `第 2→3 段推进 ${adv2.toFixed(2)}`).toBeGreaterThan(Math.PI * 0.4);
    expect(Math.abs(adv2)).toBeLessThan(Math.PI * 1.2);
  });

  it('腿真的迈开了：每段腿角差扫过 > 1.0 rad（不是僵着不动）', () => {
    const { segs } = sample(mash, 220);
    for (const [k, s] of segs) {
      if (s.n < 5) continue; // 末段被采样窗口截断
      expect(s.dMax - s.dMin, `第 ${k} 段摆幅`).toBeGreaterThan(1.0);
    }
  });

  it('站姿换了：第 2 / 3 段的腿角极值方向与第 1 段不同', () => {
    const { segs } = sample(mash, 220);
    // 三段里至少要有一段是「另一条腿在前」的极值（旧版三段同号）
    const front = (s: SegRec): number => (Math.abs(s.dMax) >= Math.abs(s.dMin) ? s.dMax : s.dMin);
    const signs = [1, 2, 3].map((k) => Math.sign(front(segs.get(k)!)));
    expect(signs.some((v) => v > 0)).toBe(true);
    expect(signs.some((v) => v < 0)).toBe(true);
  });

  it('间隔再打一刀：第二次起手也往前走一步（不回到待机时的冻结相位）', () => {
    // 第一刀约 0.85s（≈51 帧）打完；第 70 帧再起手，中间站着不动
    const { attacks } = sample((w, i) => i === 70, 160);
    const ids = [...attacks.keys()].sort((a, b) => a - b);
    expect(ids.length).toBeGreaterThanOrEqual(2);
    const adv = wrap(attacks.get(ids[1])!.base - attacks.get(ids[0])!.base);
    expect(Math.abs(adv), `两次起手相位差 ${adv.toFixed(2)}`).toBeGreaterThan(Math.PI * 0.5);
    expect(Math.abs(adv)).toBeLessThan(Math.PI * 1.2);
  });

  it('换段不拽腿：换段那一帧腿角跳变 < 0.05 rad（旧版实测 0.82）', () => {
    const { segs } = sample(mash, 220);
    expect(segs.size).toBeGreaterThanOrEqual(3);
    for (const [k, s] of segs) {
      if (k === 1) continue; // 第 1 段是「从待机进入攻击」，本来就该有起手过渡
      expect(s.legJump, `第 ${k} 段起手`).toBeLessThan(0.05);
    }
  });

  it('换段不推人：换段那一帧骨盆前后位移 < 3.5cm（旧版 8.7cm）', () => {
    const { segs } = sample(mash, 220);
    for (const [k, s] of segs) {
      if (k === 1) continue;
      expect(s.zJump, `第 ${k} 段起手`).toBeLessThan(0.035);
    }
  });
});
