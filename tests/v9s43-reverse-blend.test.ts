import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { solveGait, slewDirSign, dirDrive } from '../src/presentation/gait';
import type { GaitInput } from '../src/presentation/gait';
import { makeWorld, intent, run } from './helpers';
import { rigNodes } from './rig-nodes';
import type { AppConfig, Intents, World } from '../src/core';

const raw = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

const FIXED_DT = 1 / 60;

function makeRig(w: World, flipSec: number) {
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed,
    raw.view.orientation, { ...raw.view.gait, dirFlipSec: flipSec },
    raw.view.weaponMount, raw.view.lean, raw.view.hurt, raw.view.animation,
  );
  return { rig, n: rigNodes(rig) };
}

type Sample = { L: number; R: number; rl: number; rr: number; dirF: number; dirR: number; spd: number };

/**
 * 逐帧推进：先朝 `a` 走 `frames` 帧，再朝 `b` 走 `frames` 帧，记录腿姿态。
 * 返回「换向后」的逐帧样本（含换向前一帧，便于算第一帧跳变）。
 */
function trace(w: World, flipSec: number, a: Intents, b: Intents, frames = 50): Sample[] {
  const { rig, n } = makeRig(w, flipSec);
  const out: Sample[] = [];
  const rec = (): void => {
    const g = rig.gaitDebug();
    out.push({
      L: n.hipL.rotation.x, R: n.hipR.rotation.x,
      rl: n.hipL.rotation.z, rr: n.hipR.rotation.z,
      dirF: g.dirF, dirR: g.dirR,
      spd: Math.hypot(w.character.velocity.x, w.character.velocity.z),
    });
  };
  for (let i = 0; i < frames; i++) {
    run(w, 1, a);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    rec();
  }
  for (let i = 0; i < frames; i++) {
    run(w, 1, b);
    rig.update(w.character, w.combat, w.playerHurt, w.config.fixedDt, false, w.time);
    rec();
  }
  return out.slice(frames - 1);
}

/** 相邻样本的最大单帧跳变（`pick` 选要看的量） */
function maxJump(rows: Sample[], pick: (s: Sample) => number): number {
  let m = 0;
  for (let i = 1; i < rows.length; i++) m = Math.max(m, Math.abs(pick(rows[i]) - pick(rows[i - 1])));
  return m;
}

describe('v9s.43 · 换向融合（前 → 后、左 → 右 不抽腿）', () => {
  /**
   * 根因：前后摆幅 = `dirF × wF × 步幅/4 × off(p)`，dirF 是硬符号（`localForward >= 0 ? 1 : -1`），
   * 速度穿过 0 时整条腿位一帧镜像。实测线上（注视锁定、原地倒走）单帧腿角跳 1.06 rad，
   * 不锁定朝向（角色一边转圈一边滑）时 1.26 rad —— 正常跨步单帧只有 0.53。
   */
  it('驱动符号按秒推进：+1 → −1 恰好花 dirFlipSec，且每帧步长恒定', () => {
    const sec = 0.16;
    let v = 1;
    const seq = [v];
    const perFrame: number[] = [];
    for (let i = 0; i < 12; i++) {
      const prev = v;
      v = slewDirSign(v, -1, FIXED_DT, sec);
      perFrame.push(Math.abs(v - prev));
      seq.push(v);
    }
    // 0.16s / (1/60) = 9.6 帧 → 第 10 帧到达 −1
    expect(seq[10]).toBe(-1);
    expect(seq[9]).toBeGreaterThan(-1);
    // 匀速推进：除最后一帧（截断）外每帧步长相同 = 2 × dt / sec
    const step = (2 * FIXED_DT) / sec;
    for (const d of perFrame.slice(0, 9)) expect(d).toBeCloseTo(step, 9);
    // 单调、不过冲
    for (let i = 1; i < seq.length; i++) expect(seq[i]).toBeLessThanOrEqual(seq[i - 1]);
    expect(Math.min(...seq)).toBe(-1);
    // 速率上限换算：单帧最多推进 2 × dt / sec
    expect(Math.max(...perFrame)).toBeLessThanOrEqual(step + 1e-9);
  });

  it('sec = 0 等价于旧行为（直接翻符号），dt = 0 不推进', () => {
    expect(slewDirSign(1, -1, FIXED_DT, 0)).toBe(-1);
    expect(slewDirSign(-0.3, 1, 0, 0.16)).toBe(-0.3);
    expect(slewDirSign(1, -1, 1, 0.16)).toBe(-1);
  });

  it('形状映射：0 → 0、±1 → ±1、中点 0.5、奇对称（两端速度为 0）', () => {
    expect(dirDrive(0)).toBe(0);
    expect(dirDrive(1)).toBe(1);
    expect(dirDrive(-1)).toBe(-1);
    expect(dirDrive(0.5)).toBeCloseTo(0.5, 12);
    expect(dirDrive(-0.5)).toBeCloseTo(-0.5, 12);
    // 端点导数为 0：靠近 0 时衰减得比线性更快（远离 1 时更慢）
    expect(dirDrive(0.1)).toBeLessThan(0.1);
    expect(dirDrive(0.9)).toBeGreaterThan(0.9);
  });

  it('solveGait：同一相位下前后符号硬翻 = 腿位镜像（这就是「抽一下」的来源）', () => {
    const cfg = raw.view.gait;
    // phase = 0：支撑相脚在最前（off = 1），摆幅取满，便于用几何式核对
    const base: GaitInput = {
      phase: 0, speed: 4.2, moveSpeed: 4.2, localForward: 4.2, localRight: 0,
      legLength: 0.85, stride: 1, grounded: true,
    };
    const fwd = solveGait(base, cfg);
    const back = solveGait({ ...base, localForward: -4.2 }, cfg);
    // 前后摆幅 = asin(reach / legLen)，reach = stride × reachRatio
    const reach = 1 * cfg.reachRatio;
    const expectJump = 2 * Math.asin(reach / 0.85);
    expect(Math.abs(fwd.legL.pitchX - back.legL.pitchX)).toBeCloseTo(expectJump, 6);
    // 硬翻远大于正常跨步的单帧变化（≈0.5 rad）—— 这一条就是旧 bug 的量化
    expect(Math.abs(fwd.legL.pitchX - back.legL.pitchX)).toBeGreaterThan(0.5);

    // 融合到中途（dirF = 0）：两个方向给出**完全相同**的姿态，腿并拢、不镜像
    const fwdMid = solveGait({ ...base, dirF: 0 }, cfg);
    const backMid = solveGait({ ...base, localForward: -4.2, dirF: 0 }, cfg);
    expect(fwdMid.legL.pitchX).toBeCloseTo(0, 12);
    expect(backMid.legL.pitchX).toBeCloseTo(0, 12);
    expect(fwdMid.legL.pitchX).toBe(backMid.legL.pitchX);
    // 半途（dirF = 0.5）摆幅正好一半
    const half = solveGait({ ...base, dirF: 0.5 }, cfg);
    expect(Math.abs(half.legL.pitchX)).toBeLessThan(Math.abs(fwd.legL.pitchX) * 0.7);
    expect(Math.abs(half.legL.pitchX)).toBeGreaterThan(Math.abs(fwd.legL.pitchX) * 0.3);
  });

  it('走路时前后换向：单帧腿角跳变不超过正常跨步（旧行为 1.0 rad+）', () => {
    const fwd = intent({ moveZ: -1 });
    const back = intent({ moveZ: 1 });
    const patched = maxJump(trace(makeWorld(), raw.view.gait.dirFlipSec, fwd, back), (s) => s.L - s.R);
    const legacy = maxJump(trace(makeWorld(), 0, fwd, back), (s) => s.L - s.R);
    // 旧路径确实会「抽」：单帧 1 rad 级别（60°+）
    expect(legacy).toBeGreaterThan(0.9);
    // 融合后不超过正常跨步的单帧量级（实测 0.53~0.55）
    expect(patched).toBeLessThan(0.62);
    // 但不能把腿「焊死」：换向之后仍在迈步，摆幅要达到满量级
    const after = trace(makeWorld(), raw.view.gait.dirFlipSec, fwd, back).slice(20);
    const span = Math.max(...after.map((s) => s.L)) - Math.min(...after.map((s) => s.L));
    expect(span).toBeGreaterThan(0.3);
  });

  it('侧移左右换向：横摆同样是「镜像 → 淡出」（dirR 走同一条路）', () => {
    const cfg = raw.view.gait;
    // 纯侧移：phase = 0（off = 1）+ 领先后退/跟随腿的侧摆，取最满的一侧
    const base: GaitInput = {
      phase: 0, speed: 4.2, moveSpeed: 4.2, localForward: 0, localRight: 4.2,
      legLength: 0.85, stride: 1, grounded: true,
    };
    const right = solveGait(base, cfg);
    const left = solveGait({ ...base, localRight: -4.2 }, cfg);
    // 同一条腿在左右两个方向上的姿态：原本是「一帧镜像」，实测差 0.5 rad
    const mirrorJump = Math.abs(right.legR.rollZ - left.legR.rollZ);
    expect(mirrorJump).toBeGreaterThan(0.4);
    // 融合到中途：两侧摆腿都回到 0（腿并拢），不会一帧跳到对侧
    const midR = solveGait({ ...base, dirR: 0 }, cfg);
    const midL = solveGait({ ...base, localRight: -4.2, dirR: 0 }, cfg);
    expect(Math.abs(midR.legR.rollZ)).toBeLessThan(1e-9);
    expect(Math.abs(midL.legR.rollZ)).toBeLessThan(1e-9);
    // 交叉步 / 侧倾同源，也必须同步归零（否则腿并了、骨盆还在甩）
    expect(Math.abs(midR.pelvisRoll)).toBeLessThan(1e-9);
    expect(Math.abs(midR.sideLean)).toBeLessThan(1e-9);
  });

  it('换向途中驱动量逐帧推进、方向真的翻过来（不是把符号冻住）', () => {
    // v9s.44：把 bodyYaw 钉住 —— 有注视时身体会被拖着转，「前后」的基准自己也在动，
    // 量的就不再是符号推进。钉住的这版是纯「原地倒走」：θ 从 0 扫到 180°。
    const w = makeWorld();
    const { rig } = makeRig(w, raw.view.gait.dirFlipSec);
    const row = (): { dirF: number } => ({ dirF: rig.gaitDebug().dirF });
    const rows: { dirF: number }[] = [];
    const step = (dir: number): void => {
      run(w, 1, intent({ moveZ: dir }));
      w.character.bodyYaw = Math.PI;   // 前向 = −Z（与 moveZ: −1 一致），钉住不被注视带走
      rig.update(w.character, w.combat, w.playerHurt, FIXED_DT, false, w.time);
      rows.push(row());
    };
    for (let i = 0; i < 40; i++) step(-1);
    const mark = rows.length - 1;
    for (let i = 0; i < 60; i++) step(1);
    const after = rows.slice(mark);
    // 换向前是「前」、换向后翻到「后」
    expect(after[0].dirF).toBe(1);
    expect(after[after.length - 1].dirF).toBe(-1);
    // 中间确实经过了 0 附近的过渡带（至少 3 个中间值）
    const mid = after.filter((r) => r.dirF > -0.9 && r.dirF < 0.9);
    expect(mid.length).toBeGreaterThanOrEqual(3);
    // 每帧推进不超过速率上限，绝不出现「一帧从 +1 跳到 −1」
    const limit = (2 * FIXED_DT) / raw.view.gait.dirFlipSec + 1e-9;
    for (let i = 1; i < rows.length; i++) {
      expect(Math.abs(rows[i].dirF - rows[i - 1].dirF)).toBeLessThanOrEqual(limit);
    }
  });
});
