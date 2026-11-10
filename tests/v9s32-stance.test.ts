import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { torsoYawOf } from './rig-nodes';
import { makeWorld } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

function mkRig(): ReturnType<typeof createVoxelRig> {
  return createVoxelRig(
    raw.view.voxel, raw.view.colors, 4.5,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false }, raw.view.links, raw.view.weaponWrist,
  );
}

const WEAPONS = ['sword-shield', 'dual-swords', 'greatsword', 'staff', 'bow'] as const;

describe('v9s.32 持械待机姿态', () => {
  it('五把武器都有 stance 配置，且角度都是有限数', () => {
    const stance = raw.view.animation.stance ?? {};
    for (const w of WEAPONS) {
      const s = stance[w];
      expect(s, `缺少 ${w} 的 stance`).toBeTruthy();
      for (const side of ['armL', 'armR'] as const) {
        const a = s[side];
        if (!a) continue;
        for (const k of ['pitch', 'yaw', 'roll', 'elbow'] as const) {
          if (a[k] === undefined) continue;
          expect(Number.isFinite(a[k]), `${w}.${side}.${k}`).toBe(true);
        }
      }
      if (s.armSwing !== undefined) expect(s.armSwing).toBeGreaterThan(0);
    }
  });

  it('待机时把该武器的持械偏移写到手臂上（不是所有武器同一套站姿）', () => {
    const w = makeWorld();
    const rig = mkRig();
    const stance = raw.view.animation.stance!;

    for (const id of WEAPONS) {
      w.combat.weapon = id;
      w.combat.phase = 'idle';
      // 淡入需要几帧；直接跑 1 秒（60 帧）
      for (let i = 0; i < 60; i++) {
        rig.update(w.character, w.combat, w.playerHurt, 1 / 60);
      }
      const d = rig.stanceDebug();
      expect(d.weapon).toBe(id);
      expect(d.weight).toBeCloseTo(1, 5);
      expect(d.armR.pitch).toBeCloseTo(stance[id].armR?.pitch ?? 0, 5);
      expect(d.armL.pitch).toBeCloseTo(stance[id].armL?.pitch ?? 0, 5);
      // 手臂节点真的带上了偏移（不是只写在读数里）
      const armR = rig.group.getObjectByName('shoulderR')!;
      const armL = rig.group.getObjectByName('shoulderL')!;
      expect(armR.rotation.x).toBeCloseTo(stance[id].armR?.pitch ?? 0, 5);
      expect(armL.rotation.x).toBeCloseTo(stance[id].armL?.pitch ?? 0, 5);
    }
    rig.dispose();
  });

  it('换武器时姿态淡入，而不是单帧跳过去', () => {
    const w = makeWorld();
    const rig = mkRig();
    w.combat.weapon = 'sword-shield';
    for (let i = 0; i < 60; i++) rig.update(w.character, w.combat, w.playerHurt, 1 / 60);
    expect(rig.stanceDebug().weight).toBeCloseTo(1, 5);

    w.combat.weapon = 'greatsword';
    rig.update(w.character, w.combat, w.playerHurt, 1 / 60);
    const first = rig.stanceDebug().weight;
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(0.2);

    for (let i = 0; i < 30; i++) rig.update(w.character, w.combat, w.playerHurt, 1 / 60);
    expect(rig.stanceDebug().weight).toBeCloseTo(1, 5);
    rig.dispose();
  });

  it('双手重武器摆臂更小：大剑的 armSwing 明显低于双剑', () => {
    const stance = raw.view.animation.stance!;
    expect(stance.greatsword.armSwing!).toBeLessThan(stance['dual-swords'].armSwing!);
    expect(stance.greatsword.armSwing!).toBeLessThan(0.6);
  });

  // v9s.73：站姿扭转不再是「攻击时让位」，而是**基础姿势的一部分** ——
  // 攻击层往上面叠增量（`delta = 站姿⁻¹ ⊗ 攻击`），所以攻击帧的躯干 = 站姿 + 剪辑偏转。
  // 这条用例量的是「攻击帧的躯干不等于待机帧的躯干 + 站姿」，仍然成立。
  it('躯干扭转在攻击帧被剪辑接管（站姿进基准，不再整份叠加）', () => {
    const w = makeWorld();
    const rig = mkRig();
    w.combat.weapon = 'sword-shield';
    for (let i = 0; i < 60; i++) rig.update(w.character, w.combat, w.playerHurt, 1 / 60);
    // v9s.33 / v9s.72：躯干总偏航 = 整条脊柱链之和
    const idleYaw = torsoYawOf(rig);
    const stanceYaw = rig.stanceDebug().torsoYaw;
    expect(stanceYaw).toBeGreaterThan(0);
    expect(idleYaw).toBeGreaterThanOrEqual(stanceYaw - 1e-6);

    // 起手攻击并推进到挥击主体：躯干 yaw 由剪辑决定，不再保留完整持械偏移
    w.combat.phase = 'windup';
    w.combat.comboIndex = 1;
    w.combat.attackProgress = 0.5;
    for (let i = 0; i < 20; i++) rig.update(w.character, w.combat, w.playerHurt, 1 / 60);
    const attackYaw = torsoYawOf(rig);
    expect(Math.abs(attackYaw - (idleYaw + stanceYaw))).toBeGreaterThan(0.02);
    rig.dispose();
  });
});
