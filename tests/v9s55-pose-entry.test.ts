import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { step } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import type { VoxelRig } from '../src/presentation/voxel-rig';
import { makeWorld, intent } from './helpers';
import type { AppConfig, HurtState } from '../src/core';

/**
 * v9s.55 · 动作起手 / 收招与待机的衔接。
 *
 * 用户原话：「之前做的动画起始和结束 Pose 都没有很好，和待机都接不上」。
 *
 * 两个具体成因（都已修）：
 *  1) 起手：淡入固定 0.1s，与 windup 无关。剑盾 windup 只有 0.09s、大剑要抬 1.5 rad，
 *     都塞进 6 帧 —— 「啪一下抬手」；
 *  2) 收招：姿态采样走 `swingCurve → (swing+1)/2`，收势时 swing 从 +1 掉到 0，
 *     等于把剪辑采样点从「挥出满」倒回 **u=0.5（挥到中途）**，再从这个半挥姿态
 *     淡出到待机；settle 还把它定格 0.16s。
 *
 * 现在的规则：
 *  · 起手 = 待机 → 蓄势帧（u=0）的交叉淡入，时长 = windup × 0.75；
 *  · 挥出 = active 前 70% 从 u=0 推到 u=1；
 *  · 收招 = 保持 u=1，由 combatPoseW 淡回待机，时长 = recovery + 半个 settle。
 */

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const NONE: HurtState = {
  lastAt: -1e9, type: 'none', timer: 0, duration: 0,
  dirX: 0, dirZ: 0, knockX: 0, knockZ: 0,
};

type Frame = {
  phase: string;
  strike: number;
  arm: number;
  torso: number;
  blending: boolean;
  /** 战斗姿态权重（0 = 已完全交还待机） */
  poseW: number;
  /** 刃身世界朝向（单位向量）；无武器时为 null */
  tip: [number, number, number] | null;
};

function run(weapon: string, frames = 150, attack = true): Frame[] {
  const w = makeWorld();
  const rig: VoxelRig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false },
  );
  (w.combat as unknown as { weapon: string }).weapon = weapon;
  const out: Frame[] = [];
  for (let i = 0; i < frames; i++) {
    step(w, w.config.fixedDt, attack && i === 4 ? intent({ attackPressed: true }) : intent({}));
    (w.combat as unknown as { weapon: string }).weapon = weapon;
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    rig.group.updateMatrixWorld(true);
    const d = rig.swingDebug();
    const bulk = rig.torsoTotal();
    const b = rig.bladesWorld();
    const lead = d.lead === 'L' ? b.left : b.right;
    let tip: [number, number, number] | null = null;
    if (lead) {
      const dx = lead.tip.x - lead.base.x;
      const dy = lead.tip.y - lead.base.y;
      const dz = lead.tip.z - lead.base.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      tip = [dx / len, dy / len, dz / len];
    }
    out.push({
      phase: w.combat.phase,
      strike: d.strike,
      arm: rig.group.getObjectByName('shoulderR')!.rotation.x as number,
      torso: bulk.yaw,
      blending: w.combat.phase !== 'idle' && (d.strike < 0.999 || d.strike > 0.001),
      poseW: d.poseW,
      tip,
    });
  }
  rig.dispose();
  return out;
}

/**
 * 相邻帧之间「剑尖朝向」转过的角度（rad）。
 *
 * 为什么要单独量剑身：手臂 / 躯干走的是 `blendCombatPose` 的交叉淡出，剑身仰角、
 * 外撇、滚转与整体带转却是直接写的绝对值 —— 权重归零那一帧它们会一步跳回待机基准
 * （修之前剑盾实测单帧 62°、带转 20°）。手臂连续不代表剑连续。
 */
const tipStep = (a: Frame, b: Frame): number => {
  if (!a.tip || !b.tip) return 0;
  const dot = Math.max(-1, Math.min(1,
    a.tip[0] * b.tip[0] + a.tip[1] * b.tip[1] + a.tip[2] * b.tip[2]));
  return (Math.acos(dot) * 180) / Math.PI;
};

/** 窗口内逐帧剑身转角（deg）。 */
const tipSteps = (list: Frame[], from: number, to: number): number[] => {
  const out: number[] = [];
  for (let i = Math.max(1, from); i < Math.min(list.length, to); i++) {
    out.push(tipStep(list[i - 1], list[i]));
  }
  return out;
};

const maxFrameStep = (list: Frame[], from: number, to: number): number => {
  let m = 0;
  for (let i = Math.max(1, from); i < Math.min(list.length, to); i++) {
    m = Math.max(m, Math.abs(list[i].arm - list[i - 1].arm));
  }
  return m;
};

describe('v9s.55 起手 / 收招与待机衔接', () => {
  for (const weapon of ['sword-shield', 'greatsword', 'dual-swords']) {
    it(`${weapon}：起手不跳帧（单帧 < 0.25 rad）`, () => {
      const f = run(weapon);
      const enter = f.findIndex((x) => x.phase !== 'idle');
      expect(enter).toBeGreaterThan(0);
      // 起手前后各 3 帧窗口：淡入把 1.5 rad 的手臂位移摊到 windup 里
      expect(maxFrameStep(f, enter - 1, enter + 4)).toBeLessThan(0.25);
    });

    it(`${weapon}：收招不跳帧（单帧 < 0.25 rad）`, () => {
      const f = run(weapon);
      const enter = f.findIndex((x) => x.phase !== 'idle');
      const exit = f.findIndex((x, i) => i > enter && x.phase === 'idle');
      expect(exit).toBeGreaterThan(enter);
      expect(maxFrameStep(f, exit - 3, exit + 2)).toBeLessThan(0.25);
    });

    it(`${weapon}：蓄势段停在 u=0、收招段保持 u=1（不再倒回半挥）`, () => {
      const f = run(weapon);
      const windup = f.filter((x) => x.phase === 'windup');
      expect(windup.length).toBeGreaterThan(2);
      expect(Math.min(...windup.map((x) => x.strike))).toBeLessThan(0.02);
      // recovery 的前 3 帧：此时战斗姿态还在（权重未归零），采样点应停在挥出满。
      // 收招后段 combatPoseW→0，姿态层已经交还待机，strike 会清 0 —— 那是交还，不是倒退。
      const tail = f.filter((x) => x.phase === 'recovery').slice(0, 3);
      expect(tail.length).toBeGreaterThan(0);
      expect(Math.min(...tail.map((x) => x.strike))).toBeGreaterThan(0.9);
    });

    it(`${weapon}：剑身跟着一起淡，不在权重归零那帧跳回待机`, () => {
      const f = run(weapon);
      const enter = f.findIndex((x) => x.phase !== 'idle');
      // 交还那一帧 = 权重第一次归零。旧代码在这一帧把剑身仰角一步跳回待机基准，
      // 实测剑盾 68.3°、前后邻帧 4.3° / 0°。
      const zero = f.findIndex((x, i) => i > enter && x.poseW === 0 && f[i - 1].poseW > 0);
      expect(zero).toBeGreaterThan(enter + 4);
      const hand = tipStep(f[zero - 1], f[zero]);
      const near = Math.max(
        tipStep(f[zero - 2], f[zero - 1]),
        tipStep(f[zero], f[zero + 1]),
        tipStep(f[zero + 1], f[zero + 2]),
      );
      expect(hand).toBeLessThan(near * 1.5 + 3);
      // 起手第一帧：从待机持械角出发，本来就该是整段里最轻的一步
      expect(tipStep(f[enter - 1], f[enter])).toBeLessThan(12);
    });

    it(`${weapon}：打完之后回到待机（手臂与躯干回位）`, () => {
      const f = run(weapon);
      const last = f[f.length - 1];
      expect(last.phase).toBe('idle');
      const idle = run(weapon, 60, false);
      expect(Math.abs(last.arm - idle[idle.length - 1].arm)).toBeLessThan(0.05);
      expect(Math.abs(last.torso - idle[idle.length - 1].torso)).toBeLessThan(0.05);
    });
  }
});
