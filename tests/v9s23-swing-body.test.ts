import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState } from '../src/core';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { blendSwingPose, segEase, solveSwingPose } from '../src/presentation/swing-pose';
import type { SwingPoseViewConfig } from '../src/core';
import { makeWorld, intent } from './helpers';

/**
 * v9s.23 · 「大剑三段各自一个方向」+「攻击时身体给更多幅度」+「肩膀（上臂根部）会动」。
 *
 * 覆盖三层：
 *  1) 纯函数：三段关键帧的方向（右→左 / 左→右 / 举顶下劈）、bodyScale 归零、段间插值；
 *  2) 骨架：真跑一次三连击，躯干三轴与肩部位移确实被写进节点，且 idle 时完整归位；
 *  3) 接缝：换段那一帧姿态不再单帧跳变（旧版 attackProgress 1→0 会「啪」地换姿势）。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;
const g = globalThis as any;
if (!g.document) {
  g.document = { createElement: () => ({ width: 0, height: 0, getContext: () => null }) };
}

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0, dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

const SWING: SwingPoseViewConfig = raw.view.animation.swing!;

function playerRig() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false },
  );
  return { w, rig };
}

/** 按住攻击跑 n 帧，逐帧采集 rig 读数。 */
function swordRun(n: number, weapon: 'greatsword' | 'sword-shield' | 'dual-swords' = 'greatsword') {
  const { w, rig } = playerRig();
  (w.combat as any).weapon = weapon;
  const frames: {
    i: number; seg: number; kind: string; yaw: number; pitch: number; roll: number;
    strike: number; upperY: number; upperX: number; upperZ: number;
    shoulderL: { x: number; y: number; z: number };
    shoulderR: { x: number; y: number; z: number };
    phase: string;
  }[] = [];
  for (let i = 0; i < n; i++) {
    // 每帧都写一遍武器：Core 的切换逻辑会按 intents.weaponSlot 覆盖，这里只是保持
    step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
    (w.combat as any).weapon = weapon;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    const d = rig.swingDebug();
    const upper = rig.group.getObjectByName('upper')!;
    frames.push({
      i, seg: d.seg, kind: d.kind, yaw: d.yaw, pitch: d.pitch, roll: d.roll,
      strike: d.strike,
      upperY: upper.rotation.y, upperX: upper.rotation.x, upperZ: upper.rotation.z,
      shoulderL: d.shoulderL, shoulderR: d.shoulderR,
      phase: w.combat.phase,
    });
  }
  return { w, rig, frames };
}

describe('v9s.23 三段方向（纯函数）', () => {
  it('段 1：躯干从右转扫到左转', () => {
    const wind = solveSwingPose('greatsword', 1, -1, SWING);
    const hit = solveSwingPose('greatsword', 1, 1, SWING);
    expect(wind.kind).toBe('right-left');
    expect(wind.yaw).toBeGreaterThan(0.5);
    expect(hit.yaw).toBeLessThan(-0.5);
    // 起手重心在右、命中重心在左
    expect(wind.pelvisX).toBeGreaterThan(0);
    expect(hit.pelvisX).toBeLessThan(0);
  });

  it('段 2：承接左侧起手，反向扫回右侧', () => {
    const wind = solveSwingPose('greatsword', 2, -1, SWING);
    const hit = solveSwingPose('greatsword', 2, 1, SWING);
    expect(wind.kind).toBe('left-right');
    expect(wind.yaw).toBeLessThan(-0.4);   // 起手就在左侧
    expect(hit.yaw).toBeGreaterThan(0.5);
    // 与段 1 正好相反
    const s1 = solveSwingPose('greatsword', 1, 1, SWING);
    expect(Math.sign(hit.yaw)).toBe(-Math.sign(s1.yaw));
  });

  it('段 3：举过头顶 → 往下劈', () => {
    const wind = solveSwingPose('greatsword', 3, -1, SWING);
    const hit = solveSwingPose('greatsword', 3, 1, SWING);
    expect(wind.kind).toBe('overhead');
    expect(wind.armR!.pitch).toBeLessThan(-1.7);  // 手臂抬到头顶前上
    // v9s.25：数据里给的是剑身仰角（世界语义），举顶时剑尖朝上而不是「挂点角 > 2」
    expect(wind.bladePitch).not.toBeNull();
    expect(wind.bladePitch!).toBeGreaterThan(0.8);
    expect(wind.pitch).toBeLessThan(-0.2);       // 躯干后仰
    expect(hit.armR!.pitch).toBeGreaterThan(-0.2); // 劈到身前下方
    expect(hit.pitch).toBeGreaterThan(0.4);      // 躯干前压
    // 下劈必须比另两段的前压更大
    expect(hit.pitch).toBeGreaterThan(solveSwingPose('greatsword', 1, 1, SWING).pitch);
  });

  it('bodyScale=0 时躯干 / 骨盆完全不动，手臂仍在挥（A/B 对照）', () => {
    const off = { ...SWING, bodyScale: 0 };
    const hit = solveSwingPose('greatsword', 1, 1, off);
    expect(Math.abs(hit.yaw)).toBeLessThan(1e-9);
    expect(Math.abs(hit.pitch)).toBeLessThan(1e-9);
    expect(Math.abs(hit.roll)).toBeLessThan(1e-9);
    expect(Math.abs(hit.pelvisZ)).toBeLessThan(1e-9);
    expect(Math.abs(hit.pelvisX)).toBeLessThan(1e-9);
    expect(hit.armR!.pitch).toBeLessThan(-1);
  });

  it('短剑幅度收敛但方向一致', () => {
    const gs = solveSwingPose('greatsword', 1, 1, SWING);
    const ss = solveSwingPose('sword-shield', 1, 1, SWING);
    expect(Math.sign(ss.yaw)).toBe(Math.sign(gs.yaw));
    expect(Math.abs(ss.yaw)).toBeLessThan(Math.abs(gs.yaw));
    expect(ss.armL).toBeNull(); // 剑盾左臂持盾，不由本层接管
  });

  it('双剑段 2 换左手主挥（左右交替）', () => {
    const a = solveSwingPose('dual-swords', 1, 1, SWING);
    const b = solveSwingPose('dual-swords', 2, 1, SWING);
    expect(a.armR).not.toBeNull();
    expect(b.armL).not.toBeNull();
  });

  it('段 3 起手：剑尖真的在头顶上方，剑身不穿过头部', () => {
    const { w, rig } = playerRig();
    (w.combat as any).weapon = 'greatsword';
    w.combat.comboIndex = 3;
    w.combat.phase = 'windup';
    w.combat.attackProgress = 0;
    // 多跑几帧让 attackBlend 从 0 淡入到 1（否则手臂还在步态摆臂姿态）
    for (let i = 0; i < 40; i++) {
      (w.combat as any).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    const b = rig.weaponBlade()!;
    const head = rig.group.getObjectByName('headPivot')!.getWorldPosition(new THREE.Vector3());
    expect(b).not.toBeNull();
    // 剑尖至少高过头顶 0.3m（角色总高 1.2，头顶约 0.8）
    expect(b.tip.y).toBeGreaterThan(head.y + 0.3);
    // 剑身中段不能落在头的包围盒里（头 0.4 立方）
    const mid = new THREE.Vector3(
      (b.base.x + b.tip.x) / 2, (b.base.y + b.tip.y) / 2, (b.base.z + b.tip.z) / 2,
    );
    const headLocal = head.clone();
    const inside = Math.abs(mid.x - headLocal.x) < 0.2
      && Math.abs(mid.z - headLocal.z) < 0.2;
    expect(inside).toBe(false);
    rig.dispose();
  });

  it('段间插值端点精确落在两端姿态上', () => {
    const a = solveSwingPose('greatsword', 1, 0.4, SWING);
    const b = solveSwingPose('greatsword', 2, -0.6, SWING);
    const f0 = blendSwingPose(a, b, 0);
    const f1 = blendSwingPose(a, b, 1);
    expect(f0.yaw).toBeCloseTo(a.yaw, 6);
    expect(f1.yaw).toBeCloseTo(b.yaw, 6);
    expect(f1.armR!.pitch).toBeCloseTo(b.armR!.pitch, 6);
    // 单调过渡
    const mid = blendSwingPose(a, b, segEase(0.5));
    expect(mid.yaw).toBeGreaterThan(Math.min(a.yaw, b.yaw) - 1e-9);
    expect(mid.yaw).toBeLessThan(Math.max(a.yaw, b.yaw) + 1e-9);
  });
});

describe('v9s.23 骨架落地：身体 / 肩部', () => {
  it('三连击里躯干真的拧起来，且三段方向都出现', () => {
    const { rig, frames } = swordRun(160);
    const kinds = new Set(frames.filter((f) => f.strike > 0).map((f) => f.kind));
    expect(kinds.has('right-left')).toBe(true);
    expect(kinds.has('left-right')).toBe(true);
    expect(kinds.has('overhead')).toBe(true);

    const live = frames.filter((f) => f.strike > 0.2);
    const ys = live.map((f) => f.upperY);
    expect(Math.max(...ys)).toBeGreaterThan(0.5);
    expect(Math.min(...ys)).toBeLessThan(-0.5);
    // 下劈段的大幅后仰 / 前压都落到 upper.rotation.x 上
    const xs = live.map((f) => f.upperX);
    expect(Math.min(...xs)).toBeLessThan(-0.2);
    expect(Math.max(...xs)).toBeGreaterThan(0.4);
    rig.dispose();
  });

  it('肩部（上臂根部）在挥击中被抬起 / 前送，idle 时精确回到基准', () => {
    const { rig, frames, w } = swordRun(160);
    const baseX = raw.view.voxel.bodyWidth / 2 + raw.view.voxel.limbThickness / 2;
    const baseY = raw.view.voxel.bodyHeight - 0.04;
    const live = frames.filter((f) => f.strike > 0.3);
    const maxY = Math.max(...live.map((f) => Math.max(f.shoulderL.y, f.shoulderR.y)));
    const maxZ = Math.max(...live.map((f) => Math.max(f.shoulderL.z, f.shoulderR.z)));
    expect(maxY).toBeGreaterThan(baseY + 0.01);   // 至少抬起 1cm
    expect(maxZ).toBeGreaterThan(0.01);           // 前送
    // 挥手过顶（段 3 蓄势）时抬得最高
    expect(maxY).toBeLessThan(baseY + SWING.shoulderLift + 1e-6);

    // 回到 idle：肩点必须精确复位，否则会在待机时留下「永远耸肩」
    (w.combat as any).weapon = 'greatsword';
    for (let i = 0; i < 90 && w.combat.phase !== 'idle'; i++) {
      step(w, w.config.fixedDt, intent());
      (w.combat as any).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    }
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    const d = rig.swingDebug();
    expect(d.shoulderR.x).toBeCloseTo(baseX, 6);
    expect(d.shoulderR.y).toBeCloseTo(baseY, 6);
    expect(d.shoulderR.z).toBeCloseTo(0, 6);
    expect(d.shoulderL.x).toBeCloseTo(-baseX, 6);
    rig.dispose();
  });

  it('换段那一帧姿态不跳变（旧版 attackProgress 1→0 会「啪」地换姿势）', () => {
    const { rig, frames } = swordRun(160);
    let worst = 0;
    let worstAt = -1;
    for (let i = 1; i < frames.length; i++) {
      const a = frames[i - 1];
      const b = frames[i];
      if (a.seg === b.seg) continue;         // 只看换段帧
      if (b.phase === 'idle' || a.phase === 'idle') continue;
      const d = Math.abs(b.upperY - a.upperY)
        + Math.abs(b.upperX - a.upperX) * 0.5;
      if (d > worst) { worst = d; worstAt = i; }
    }
    expect(worstAt).toBeGreaterThan(0);
    // 0.1s 过渡 + 60fps ≈ 每帧最多走 1/6 的路；实测远小于「整段姿态差」。
    expect(worst).toBeLessThan(0.35);
    rig.dispose();
  });

  it('大剑三段挥击时左手仍贴在柄轴上', () => {
    const { w, rig } = playerRig();
    (w.combat as any).weapon = 'greatsword';
    const mR = rig.group.getObjectByName('mountR')!;
    let worst = 0;
    let checked = 0;
    for (let i = 0; i < 160; i++) {
      step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
      (w.combat as any).weapon = 'greatsword';
      rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
      rig.group.updateWorldMatrix(true, true);
      if (w.combat.phase === 'idle') continue;
      // 起手前 3~4 帧是「左臂从体侧抬起来抓柄」的过渡（IK 权重随 attackBlend 淡入），
      // 不属于「握住之后松脱」，从第 8 帧起统计。
      if (i < 8) continue;
      const a = mR.getWorldPosition(new THREE.Vector3());
      const b = mR.localToWorld(new THREE.Vector3(0, -0.55, 0));
      const handL = rig.group.getObjectByName('handL')!.getWorldPosition(new THREE.Vector3());
      const ab = b.clone().sub(a);
      const t = Math.max(0, Math.min(1, handL.clone().sub(a).dot(ab) / ab.lengthSq()));
      const closest = a.clone().addScaledVector(ab, t);
      worst = Math.max(worst, handL.distanceTo(closest));
      checked += 1;
    }
    expect(checked).toBeGreaterThan(30);
    expect(worst).toBeLessThan(0.2);
    rig.dispose();
  });
});
