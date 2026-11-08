import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { AppConfig, HurtState, PoseClip } from '../src/core';
import { samplePoseClip, step, validatePoseClip } from '../src/core';
import { createVoxelRig } from '../src/presentation/voxel-rig';
import { solveSwingPose } from '../src/presentation/swing-pose';
import { makeWorld, intent } from './helpers';

/**
 * v9s.25 · 动作数据化 + 三个真机问题的回归。
 *
 *  1) 「前两击剑尖都指着头顶」——挂点语义从「相对前臂的角度」改成「剑身仰角」，
 *     数据只写剑该朝哪，rig 按手臂链反解；本条用刃尖世界方向验收「横扫是平的」。
 *  2) 「技能索敌应该按右手拖拽方向，不是移动轮盘」——targeting 的参考朝向优先级。
 *  3) 「射击会往前顶一下」——弓的后坐力脉冲层与放箭前冲一起删掉。
 *  4) 剪辑格式本身：采样 / 缓动 / 校验，以及「加一套动作只改数据」。
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
const SWING = raw.view.animation.swing!;

function playerRig() {
  const w = makeWorld();
  const rig = createVoxelRig(
    raw.view.voxel, raw.view.colors, w.config.moveSpeed, raw.view.orientation,
    raw.view.gait, raw.view.weaponMount, raw.view.lean, raw.view.hurt,
    raw.view.animation, { ...raw.view.ik, enabled: false },
    raw.view.links, raw.view.weaponWrist,
  );
  return { w, rig };
}

type BladeSample = { seg: number; phase: string; progress: number; pitch: number; yaw: number };

/** 跑一段大剑连击，按段收集刃身的世界仰角 / 水平朝向。 */
function bladeSamples(frames = 260): BladeSample[] {
  const { w, rig } = playerRig();
  (w.combat as any).weapon = 'greatsword';
  const out: BladeSample[] = [];
  for (let i = 0; i < frames; i++) {
    step(w, w.config.fixedDt, i === 0 ? intent({ attackPressed: true }) : intent({ attackHeld: true }));
    (w.combat as any).weapon = 'greatsword';
    rig.update(w.character, w.combat, NONE, w.config.fixedDt, false, w.time);
    rig.group.updateMatrixWorld(true);
    const b = rig.weaponBlade();
    if (!b || w.combat.phase === 'idle') continue;
    const dx = b.tip.x - b.base.x;
    const dy = b.tip.y - b.base.y;
    const dz = b.tip.z - b.base.z;
    const len = Math.hypot(dx, dy, dz) || 1;
    out.push({
      seg: w.combat.comboIndex,
      phase: w.combat.phase,
      progress: w.combat.attackProgress,
      pitch: Math.asin(dy / len),
      yaw: Math.atan2(dx, dz),
    });
  }
  rig.dispose();
  return out;
}

describe('v9s.25 剪辑数据', () => {
  it('配置里每条剪辑都合法，且 combo 引用的 id 都存在', () => {
    const clips = SWING.clips ?? {};
    const ids = Object.keys(clips);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(validatePoseClip(clips[id] as PoseClip), `剪辑 ${id}`).toEqual([]);
    }
    for (const [weapon, list] of Object.entries(SWING.combo ?? {})) {
      for (const ref of list) {
        const id = typeof ref === 'string' ? ref : ref.clip;
        expect(clips[id], `${weapon} 引用了不存在的剪辑 ${id}`).toBeTruthy();
      }
    }
  });

  it('采样：两端精确命中关键帧，中间线性；ease 只改变到达速度', () => {
    const clip: PoseClip = {
      keys: [
        { t: 0, ease: 'in', pose: { bodyYaw: 0, bladePitch: 0.3 } },
        { t: 1, pose: { bodyYaw: 2, bladePitch: -0.1 } },
      ],
    };
    expect(samplePoseClip(clip, 0).bodyYaw).toBeCloseTo(0, 6);
    expect(samplePoseClip(clip, 1).bodyYaw).toBeCloseTo(2, 6);
    // ease=in：中点只走了 25%
    expect(samplePoseClip(clip, 0.5).bodyYaw).toBeCloseTo(0.5, 6);
    expect(samplePoseClip(clip, 0.5).bladePitch).toBeCloseTo(0.3 - 0.4 * 0.25, 6);
    // 缺省通道补 0，不炸
    expect(samplePoseClip(clip, 0.5).pelvisX).toBe(0);
    // 超出范围夹到两端
    expect(samplePoseClip(clip, -3).bodyYaw).toBeCloseTo(0, 6);
    expect(samplePoseClip(clip, 9).bodyYaw).toBeCloseTo(2, 6);
  });

  it('丢弃非法数据（时间不递增 / 未知通道 / 非数字）', () => {
    expect(validatePoseClip({ keys: [] }).length).toBeGreaterThan(0);
    expect(validatePoseClip({ keys: [{ t: 0.5, pose: {} }, { t: 0.4, pose: {} }] })).toContain(
      'keys[1].t=0.4 未严格递增',
    );
    expect(validatePoseClip({ keys: [{ t: 0, pose: { bodyYwa: 1 } as any }] })[0]).toContain('不是合法通道');
    expect(validatePoseClip({ keys: [{ t: 0, pose: { bodyYaw: Number.NaN } }] })[0]).toContain('不是有限数');
  });

  it('换武器只是换数据引用：短剑复用同一剪辑但幅度收敛，剑身仰角不被缩放', () => {
    const gs = solveSwingPose('greatsword', 1, 1, SWING);
    const ss = solveSwingPose('sword-shield', 1, 1, SWING);
    expect(Math.abs(ss.yaw)).toBeLessThan(Math.abs(gs.yaw));
    // 仰角是语义目标，不跟着 bodyScale / weaponScale 变
    expect(ss.bladePitch).toBeCloseTo(gs.bladePitch!, 6);
  });
});

describe('v9s.25 剑身仰角（前两击不再是「举着剑站着」）', () => {
  const samples = bladeSamples();

  it('段 1 / 段 2：剑身基本水平，且水平方向真的扫过一大段', () => {
    for (const seg of [1, 2]) {
      const part = samples.filter((s) => s.seg === seg);
      expect(part.length).toBeGreaterThan(8);
      // 全程仰角不超过 ±25°（旧版是 44~58°，剑尖在头顶）
      const maxUp = Math.max(...part.map((s) => s.pitch));
      const minDown = Math.min(...part.map((s) => s.pitch));
      expect(maxUp).toBeLessThan(0.45);
      expect(minDown).toBeGreaterThan(-0.3);
      // 水平朝向扫过 > 60°
      const yaws = part.map((s) => s.yaw);
      const span = Math.max(...yaws) - Math.min(...yaws);
      expect(span).toBeGreaterThan((60 * Math.PI) / 180);
    }
  });

  it('段 3：起手剑尖朝上（> 55°），命中后朝下（< −8°）', () => {
    const part = samples.filter((s) => s.seg === 3);
    const wind = part.filter((s) => s.progress < 0.2);
    expect(wind.length).toBeGreaterThan(2);
    expect(Math.max(...wind.map((s) => s.pitch))).toBeGreaterThan((55 * Math.PI) / 180);
    // 下劈的末段（命中之后）必须明显朝下
    const end = part.filter((s) => s.phase === 'recovery' || s.progress > 0.55);
    expect(Math.min(...end.map((s) => s.pitch))).toBeLessThan((-8 * Math.PI) / 180);
  });

  it('仰角与幅度解耦：bodyScale 拉 0 只停身体，剑仍保持数据给的仰角', () => {
    const off = { ...SWING, bodyScale: 0 };
    const hit = solveSwingPose('greatsword', 1, 1, off);
    expect(Math.abs(hit.yaw)).toBeLessThan(1e-9);
    expect(hit.bladePitch).toBeCloseTo(solveSwingPose('greatsword', 1, 1, SWING).bladePitch!, 6);
  });
});

describe('v9s.25 索敌参考朝向', () => {
  function twoDummies() {
    const w = makeWorld();
    w.dummies.forEach((d, i) => {
      d.mode = 'idle';
      // 玩家出生在 (0, 8)，前进方向是 −Z（+Z 是身后）
      if (i === 0) { d.position.x = 0; d.position.z = 3; }      // 正前方
      else if (i === 1) { d.position.x = 5; d.position.z = 8; } // 正右方
      else { d.position.x = 18; d.position.z = 18; }
    });
    return w;
  }

  it('无拖拽：按移动轮盘方向索敌（旧行为不变）', () => {
    const w = twoDummies();
    step(w, w.config.fixedDt, intent({ moveZ: -1 }));
    expect(w.targeting.hasTarget).toBe(true);
    expect(w.targeting.targetId).toBe(1); // 正前方那个
  });

  it('右手拖拽时：按拖拽方向索敌，即使左摇杆指向前方', () => {
    const w = twoDummies();
    step(w, w.config.fixedDt, intent({
      moveZ: -1, aimX: 1, aimZ: 0, aimActive: true,
    }));
    expect(w.targeting.hasTarget).toBe(true);
    expect(w.targeting.targetId).toBe(2); // 右侧那个（aim 方向）
    // 拖拽方向与移动方向夹角 > 60°，确认不是碰巧都选中
    expect(Math.abs(w.targeting.targetYaw - 0)).toBeGreaterThan(1);
  });

  it('拖拽松开后立刻回到按移动 / 面朝向索敌', () => {
    const w = twoDummies();
    step(w, w.config.fixedDt, intent({ moveZ: -1, aimX: 1, aimZ: 0, aimActive: true }));
    expect(w.targeting.targetId).toBe(2);
    step(w, w.config.fixedDt, intent({ moveZ: -1 }));
    expect(w.targeting.targetId).toBe(1);
  });
});

describe('v9s.25 弓箭不再前顶', () => {
  it('原地连射：角色位置不前进，攻击中也不写位移', () => {
    const w = makeWorld();
    w.modules.targeting = false;
    // v9s.38：玩家受击击退默认打开 —— 本用例量的是「弓箭本身不带位移」，
    // 关掉受击击退，避免 attack 模式的假人走过来把玩家推离原点污染读数。
    w.config.hits.noDamageToPlayer = true;
    w.config.combat.bow.maxChargeTime = 0.1;
    step(w, w.config.fixedDt, intent({ weaponSlot: 5 }));
    // 先站稳
    for (let i = 0; i < 30; i++) step(w, w.config.fixedDt, intent());
    const x0 = w.character.position.x;
    const z0 = w.character.position.z;
    let shots = 0;
    let prev = w.arrows.length;
    for (let i = 0; i < 180; i++) {
      step(w, w.config.fixedDt, intent({ attackHeld: true }));
      if (w.arrows.length > prev) shots += 1;
      prev = w.arrows.length;
      expect(Math.abs(w.impulse.z)).toBeLessThan(1e-9);
    }
    expect(shots).toBeGreaterThan(2);
    expect(Math.hypot(w.character.position.x - x0, w.character.position.z - z0)).toBeLessThan(0.02);
  });

  it('配置里已经没有后坐力字段，放箭动作本身也不再带 lunge', () => {
    const bow = raw.core.combat.bow as unknown as {
      recoilSpeed?: number; recoilDecay?: number; release: { lunge?: number };
    };
    expect(bow.recoilSpeed).toBeUndefined();
    expect(bow.recoilDecay).toBeUndefined();
    expect(bow.release.lunge ?? 0).toBe(0);
  });
});
