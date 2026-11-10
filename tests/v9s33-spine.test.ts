import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import type { AppConfig } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { makeQuietWorld, intent, run } from './helpers';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const g = globalThis as { document?: unknown };
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

function mkRig(spineOn: boolean): { rig: ReturnType<typeof createVoxelRig>; w: ReturnType<typeof makeQuietWorld> } {
  const w = makeQuietWorld();
  w.modules.targeting = false;
  const anim = JSON.parse(JSON.stringify(raw.view.animation)) as AppConfig['view']['animation'];
  anim.spine = { ...(anim.spine ?? { waist: 0.58, chest: 0.42, neck: 0.16, chestPivot: 0.42 }), enabled: spineOn };
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    anim, { ...raw.view.ik, enabled: false },
  );
  return { rig, w };
}

const aim = intent({ moveX: 0.7, moveZ: 1, aimActive: true, aimX: 1, aimZ: 0 });

describe('v9s.33 脊柱分段', () => {
  it('配置合法：腰胸权重为正、枢轴不落在两端', () => {
    const s = raw.view.animation.spine!;
    expect(s.enabled).toBe(true);
    expect(s.waist).toBeGreaterThan(0);
    expect(s.chest).toBeGreaterThan(0);
    expect(s.chestPivot).toBeGreaterThan(0.2);
    expect(s.chestPivot).toBeLessThan(0.8);
    expect(s.neck).toBeGreaterThanOrEqual(0);
    expect(s.neck).toBeLessThan(0.5);
  });

  it('总角按权重拆到腰 / 胸，世界朝向不变', () => {
    // 两套骨架同步推进同一个输入，逐帧对比「总角」：数据完全一样，只是分配点不同。
    const on = mkRig(true);
    const off = mkRig(false);
    run(on.w, 45, aim);
    run(off.w, 45, aim);
    for (let i = 0; i < 20; i++) {
      run(on.w, 1, aim);
      run(off.w, 1, aim);
      on.rig.update(on.w.character, on.w.combat, on.w.playerHurt, on.w.config.fixedDt, false);
      off.rig.update(off.w.character, off.w.combat, off.w.playerHurt, off.w.config.fixedDt, false);
      const upper = on.rig.group.getObjectByName('upper')!;
      const chest = on.rig.group.getObjectByName('chest')!;
      const total = upper.rotation.y + chest.rotation.y;
      // v9s.66：偏航不再整块按 42/58 摊 —— 「胸随下盘带转」那一份单独分账（默认胸 70%），
      // 否则 40° 下盘偏转时胸只转 10°，看起来「胸根本没动」而腿根转满。
      // 剩下不属于 chestYaw 的偏航（攻击旋身 / 站姿）仍走 spine.waist/chest。
      const cy = on.rig.gaitDebug().chestYaw;
      const share = raw.view.animation.spine!.yawChest ?? 0.7;
      expect(chest.rotation.y).toBeCloseTo((total - cy) * 0.42 + cy * share, 5);
      expect(upper.rotation.y).toBeCloseTo((total - cy) * 0.58 + cy * (1 - share), 5);
      // 总角与旧骨架（无拆分）逐帧一致 —— 分账只改「谁吃」，不改「吃多少」。
      const oldUpper = off.rig.group.getObjectByName('upper')!;
      expect(total).toBeCloseTo(oldUpper.rotation.y, 6);
      expect(upper.rotation.x + chest.rotation.x).toBeCloseTo(oldUpper.rotation.x, 6);
    }
    on.rig.dispose();
    off.rig.dispose();
  });

  it('头仍朝 Core 的 headYaw（胸段多转 42% 也不带走视线）', () => {
    const { rig, w } = mkRig(true);
    run(w, 45, aim);
    for (let i = 0; i < 25; i++) {
      run(w, 1, aim);
      rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
      const upper = rig.group.getObjectByName('upper')!;
      const chest = rig.group.getObjectByName('chest')!;
      const head = rig.group.getObjectByName('headPivot')!;
      const worldHead = w.character.bodyYaw + upper.rotation.y + chest.rotation.y + head.rotation.y;
      let d = worldHead - w.character.headYaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      expect(Math.abs(d)).toBeLessThan(1e-6);
    }
    rig.dispose();
  });

  it('颈段抵消一部分前倾：头比躯干更直立', () => {
    const { rig, w } = mkRig(true);
    // 直接给一个稳定的前倾意图，让惯性层把 upper.rotation.x 压下去
    const lean = intent({ moveZ: 1, aimActive: true, aimX: 0, aimZ: 1 });
    run(w, 30, lean);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false);
    for (let i = 0; i < 30; i++) { run(w, 1, lean); rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false); }
    const upper = rig.group.getObjectByName('upper')!;
    const chest = rig.group.getObjectByName('chest')!;
    const head = rig.group.getObjectByName('headPivot')!;
    const totalX = upper.rotation.x + chest.rotation.x;
    if (Math.abs(totalX) < 0.02) return; // 该帧没有前倾就不强求
    // 头局部俯仰 = -headPitch - totalX * neck（neck=0.16）
    const expected = -Math.min(0.7, Math.max(-0.7, w.character.headPitch ?? 0)) - totalX * 0.16;
    expect(head.rotation.x).toBeCloseTo(expected, 5);
    rig.dispose();
  });

  it('肩点世界高度与未分段时一致（弯折只改变朝向分布）', () => {
    const a = mkRig(true);
    const b = mkRig(false);
    run(a.w, 60, aim); run(b.w, 60, aim);
    a.rig.update(a.w.character, a.w.combat, a.w.playerHurt, a.w.config.fixedDt, false);
    b.rig.update(b.w.character, b.w.combat, b.w.playerHurt, b.w.config.fixedDt, false);
    a.rig.group.updateWorldMatrix(true, true);
    b.rig.group.updateWorldMatrix(true, true);
    const sa = a.rig.group.getObjectByName('shoulderR')!.getWorldPosition(new THREE.Vector3());
    const sb = b.rig.group.getObjectByName('shoulderR')!.getWorldPosition(new THREE.Vector3());
    // 纯 yaw 拆分不改变位置（只有 pitch/roll 才会），这里误差应 < 1cm
    expect(Math.hypot(sa.x - sb.x, sa.y - sb.y, sa.z - sb.z)).toBeLessThan(0.01);
    a.rig.dispose(); b.rig.dispose();
  });

  it('v9s.34：帧尾一致性守卫 —— 拆分后没人再写 `upper`，leak 恒为 0', () => {
    const { w, rig } = mkRig(true);
    const phases = [
      intent(),
      intent({ moveZ: 1 }),
      intent({ moveX: 1 }),
      intent({ attackHeld: true }),
    ];
    for (const it of phases) {
      for (let i = 0; i < 25; i++) {
        run(w, 1, it);
        rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
        // 残差只允许浮点噪声；一旦有人把 upper 当总角再写一次，会立刻变成 1e-2 量级
        expect(Math.abs(rig.spineDebug()!.leak)).toBeLessThan(1e-9);
      }
    }
    // 总角仍然等于「腰 + 胸」，且与拆分前记下的总角一致
    const d = rig.spineDebug()!;
    expect(d.totalYaw).toBeCloseTo(d.waistYaw + d.chestYaw, 12);
    expect(rig.torsoTotal().yaw).toBeCloseTo(d.totalYaw, 12);
    rig.dispose();
  });
});
