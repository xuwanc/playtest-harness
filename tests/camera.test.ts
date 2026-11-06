import { describe, expect, it } from 'vitest';
import { restoreWorld, snapshot } from '../src/core';
import type { World } from '../src/core';
import { intent, makeWorld, place, run } from './helpers';

const IDLE = intent();

/**
 * 冻结假人 AI（camera 仍会读 dummies 数组），把玩家放原点、假人移到远处清除默认威胁。
 * 这样每个用例只需显式摆放想要的威胁，结果完全可控、确定性。
 */
function base(): World {
  const w = makeWorld();
  w.modules.dummies = false;
  place(w, 0, 0);
  for (const d of w.dummies) {
    d.position.x = 100;
    d.position.z = 100;
    d.mode = 'idle';
    d.attackPhase = 'idle';
  }
  return w;
}

/** 在指定位置摆一个攻击模式假人。 */
function threatAt(w: World, index: number, x: number, z: number): void {
  const d = w.dummies[index];
  d.position.x = x;
  d.position.z = z;
  d.mode = 'attack';
}

describe('智能相机：威胁权重 → 确定性构图意图', () => {
  it('周围无威胁：轻微推进、不平移、不俯仰', () => {
    const w = base();
    run(w, 1, IDLE);
    expect(w.camera.threat).toBe(0);
    expect(w.camera.threatCount).toBe(0);
    expect(w.camera.distanceScale).toBeCloseTo(1 - w.config.camera.pushIn, 6);
    expect(w.camera.offsetX).toBe(0);
    expect(w.camera.offsetZ).toBe(0);
    expect(w.camera.pitchDelta).toBe(0);
    expect(w.camera.centroidX).toBeCloseTo(w.character.position.x, 6);
  });

  it('单个近距离攻击假人：拉远、朝质心平移、抬高俯角', () => {
    const w = base();
    threatAt(w, 0, 1, 0);
    run(w, 1, IDLE);
    expect(w.camera.threat).toBeGreaterThan(0.2);
    expect(w.camera.threatCount).toBe(1);
    expect(w.camera.distanceScale).toBeGreaterThan(1);
    expect(w.camera.offsetX).toBeGreaterThan(0);
    expect(w.camera.offsetZ).toBe(0);
    expect(w.camera.pitchDelta).toBeGreaterThan(0);
    expect(w.camera.centroidX).toBeCloseTo(1, 3);
  });

  it('威胁随距离单调递减', () => {
    const near = base();
    threatAt(near, 0, 1, 0);
    run(near, 1, IDLE);
    const far = base();
    threatAt(far, 0, 7, 0);
    run(far, 1, IDLE);
    expect(near.camera.threat).toBeGreaterThan(far.camera.threat);
    expect(near.camera.distanceScale).toBeGreaterThan(far.camera.distanceScale);
  });

  it('威胁随数量单调递增', () => {
    const one = base();
    threatAt(one, 0, 1, 0);
    run(one, 1, IDLE);
    const four = base();
    for (let i = 0; i < four.dummies.length; i++) threatAt(four, i, 1, 0);
    run(four, 1, IDLE);
    expect(four.camera.threatCount).toBe(4);
    expect(four.camera.threat).toBeGreaterThan(one.camera.threat);
    expect(four.camera.distanceScale).toBeGreaterThan(one.camera.distanceScale);
    expect(four.camera.pitchDelta).toBeGreaterThan(one.camera.pitchDelta);
  });

  it('超出评估半径的假人不计入', () => {
    const w = base();
    threatAt(w, 0, w.config.camera.radius + 1, 0);
    run(w, 1, IDLE);
    expect(w.camera.threatCount).toBe(0);
    expect(w.camera.threat).toBe(0);
    expect(w.camera.distanceScale).toBeLessThan(1);
    expect(w.camera.offsetX).toBe(0);
  });

  it('构图平移受 maxOffset 限幅', () => {
    const w = base();
    for (let i = 0; i < w.dummies.length; i++) threatAt(w, i, 6, 0);
    w.config.camera.maxOffset = 0.2;
    run(w, 1, IDLE);
    expect(Math.hypot(w.camera.offsetX, w.camera.offsetZ)).toBeCloseTo(0.2, 3);
    expect(w.camera.offsetX).toBeGreaterThan(0);
  });

  it('关闭 camera 模块后输出中性意图', () => {
    const w = base();
    threatAt(w, 0, 1, 0);
    w.modules.camera = false;
    run(w, 1, IDLE);
    expect(w.camera.distanceScale).toBe(1);
    expect(w.camera.threat).toBe(0);
    expect(w.camera.threatCount).toBe(0);
    expect(w.camera.offsetX).toBe(0);
    expect(w.camera.pitchDelta).toBe(0);
  });

  it('相机意图随 World 一起快照 / 恢复，逐字节一致', () => {
    const w = base();
    threatAt(w, 0, 2, 1);
    threatAt(w, 1, -2, 1);
    run(w, 30, IDLE);
    const restored = restoreWorld(snapshot(w));
    expect(JSON.stringify(restored.camera)).toBe(JSON.stringify(w.camera));
  });

  it('假人挥砍 active 帧有额外威胁加权', () => {
    const calm = base();
    threatAt(calm, 0, 1, 0);
    calm.dummies[0].attackPhase = 'idle';
    run(calm, 1, IDLE);
    const swinging = base();
    threatAt(swinging, 0, 1, 0);
    swinging.dummies[0].attackPhase = 'active';
    run(swinging, 1, IDLE);
    expect(swinging.camera.threat).toBeGreaterThan(calm.camera.threat);
  });

  it('行为模式倍率生效：attack 比 idle 威胁更大', () => {
    const quiet = base();
    quiet.dummies[0].position.x = 1;
    quiet.dummies[0].mode = 'idle';
    run(quiet, 1, IDLE);
    const aggressive = base();
    threatAt(aggressive, 0, 1, 0);
    run(aggressive, 1, IDLE);
    expect(aggressive.camera.threat).toBeGreaterThan(quiet.camera.threat);
  });

  it('质心方向决定构图平移方向（左右对称）', () => {
    const right = base();
    threatAt(right, 0, 4, 0);
    run(right, 1, IDLE);
    const left = base();
    threatAt(left, 0, -4, 0);
    run(left, 1, IDLE);
    expect(right.camera.offsetX).toBeGreaterThan(0);
    expect(left.camera.offsetX).toBeLessThan(0);
    expect(right.camera.centroidX).toBeCloseTo(4, 3);
    expect(left.camera.centroidX).toBeCloseTo(-4, 3);
  });

  it('复位把相机意图恢复为中性', () => {
    const w = base();
    threatAt(w, 0, 1, 0);
    run(w, 1, IDLE);
    expect(w.camera.threat).toBeGreaterThan(0);
    run(w, 1, intent({ resetPressed: true }));
    expect(w.camera.threat).toBe(0);
    expect(w.camera.distanceScale).toBe(1);
    expect(w.camera.offsetX).toBe(0);
    expect(w.camera.pitchDelta).toBe(0);
  });

  it('配置热改即时生效：关掉推进与拉远后距离恒为基础值', () => {
    const w = base();
    for (let i = 0; i < w.dummies.length; i++) threatAt(w, i, 1, 0);
    w.config.camera.pushIn = 0;
    w.config.camera.maxPullback = 0;
    run(w, 1, IDLE);
    expect(w.camera.threat).toBeGreaterThan(0);
    expect(w.camera.distanceScale).toBeCloseTo(1, 6);
  });

  it('确定性：同输入序列逐字节一致', () => {
    const script = (w: World): void => {
      w.modules.dummies = false;
      place(w, 0, 0);
      for (const d of w.dummies) { d.position.x = 100; d.position.z = 100; d.mode = 'idle'; }
      threatAt(w, 0, 1.5, 0);
      threatAt(w, 1, -2, 1);
      run(w, 60, IDLE);
    };
    const a = makeWorld();
    const b = makeWorld();
    script(a);
    script(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
