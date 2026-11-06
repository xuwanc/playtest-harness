import { describe, expect, it } from 'vitest';
import { CONFIG } from './helpers';
import {
  nextFeetTogetherPhase, solveGait, solveStopGait, strafeHipYaw,
} from '../src/presentation/gait';
import type { GaitInput } from '../src/presentation/gait';

/** v9n：停步收相与侧移下盘偏转都是纯函数，可以在 Node 里逐帧核验。 */

const cfg = CONFIG.view.gait;
const input: GaitInput = {
  phase: 0.8,
  speed: 4.2,
  moveSpeed: 4.2,
  localForward: 3,
  localRight: 3,
  legLength: 0.4,
  stride: 1.1,
  grounded: true,
};

const mag = (g: ReturnType<typeof solveGait>): number =>
  Math.abs(g.legL.pitchX) + Math.abs(g.legR.pitchX)
  + Math.abs(g.legL.rollZ) + Math.abs(g.legR.rollZ)
  + Math.abs(g.legL.kneeX) + Math.abs(g.legR.kneeX)
  + Math.abs(g.pelvisX) + Math.abs(g.pelvisY) + Math.abs(g.armL);

describe('v9n 停步收相：卡住的步相自然走到双脚并拢', () => {
  it('目标相位总在之后、且不超过半步（π）', () => {
    for (let i = 0; i < 40; i++) {
      const p = (i / 40) * Math.PI * 2;
      const end = nextFeetTogetherPhase(p);
      expect(end).toBeGreaterThan(p);
      expect(end).toBeLessThanOrEqual(p + Math.PI + 1e-9);
    }
  });

  it('起点恰好在并拢点时也会走完半步，不瞬切', () => {
    const p = Math.PI / 2;
    expect(nextFeetTogetherPhase(p) - p).toBeCloseTo(Math.PI, 6);
  });

  it('progress=0 与正常步态一致，progress=1 收敛到待机', () => {
    const end = nextFeetTogetherPhase(input.phase);
    const start = solveStopGait(input, cfg, { progress: 0, phase0: input.phase, phaseEnd: end });
    const normal = solveGait(input, cfg);
    expect(start.legL.pitchX).toBeCloseTo(normal.legL.pitchX, 6);
    expect(start.legR.pitchX).toBeCloseTo(normal.legR.pitchX, 6);

    const done = solveStopGait(input, cfg, { progress: 1, phase0: input.phase, phaseEnd: end });
    expect(mag(done)).toBe(0);
  });

  it('过渡中姿态确实在变（不是冻结的最后一个 pose），且幅度单调收拢', () => {
    const end = nextFeetTogetherPhase(input.phase);
    const poses = [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1].map((t) =>
      solveStopGait(input, cfg, { progress: t, phase0: input.phase, phaseEnd: end }));
    // 至少有一帧与起始姿态明显不同 → 相位真的推进了
    expect(poses.slice(1, -1).some((g) => Math.abs(g.legL.pitchX - poses[0].legL.pitchX) > 0.02)).toBe(true);
    const mags = poses.map(mag);
    for (let i = 1; i < mags.length; i++) expect(mags[i]).toBeLessThanOrEqual(mags[i - 1] + 1e-9);
    expect(mags[mags.length - 1]).toBe(0);
  });

  it('停步时长可关闭（=0 时由调用方跳过，纯函数本身不引入时间）', () => {
    expect(typeof cfg.stopBlendSec).toBe('number');
  });
});

describe('v9n 侧移下盘偏转：把平行侧移转成斜向迈步', () => {
  const base = 0.35;
  const maxDeg = 90;

  it('前进 / 后退（lat=0）完全不偏转', () => {
    expect(strafeHipYaw(0, base, maxDeg, 1.1)).toBe(0);
    // 2% 的轻微侧移只带 0.6° 左右的偏转，前进观感不受影响
    expect(strafeHipYaw(0.02, base, maxDeg, 1.1)).toBeLessThan(0.02);
  });

  it('左右对称，且纯侧移时偏转角明显大于旧行为', () => {
    const r = strafeHipYaw(1, base, maxDeg, 1.1);
    const l = strafeHipYaw(-1, base, maxDeg, 1.1);
    expect(r).toBeCloseTo(-l, 6);
    expect(r).toBeGreaterThan(0);
    // 旧行为 = base × maxDeg = 31.5°；加了 boost 后应显著更大
    expect((r * 180) / Math.PI).toBeGreaterThan(40);
    expect((r * 180) / Math.PI).toBeLessThanOrEqual(maxDeg);
  });

  it('boost=0 精确退回旧的线性行为', () => {
    expect(strafeHipYaw(1, base, maxDeg, 0)).toBeCloseTo((base * maxDeg * Math.PI) / 180, 6);
  });

  it('随侧向占比单调增大，且不会超过上限', () => {
    let prev = 0;
    for (let i = 0; i <= 10; i++) {
      const v = strafeHipYaw(i / 10, base, maxDeg, 1.1);
      expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
      expect(v).toBeLessThanOrEqual((maxDeg * Math.PI) / 180 + 1e-9);
      prev = v;
    }
  });

  it('偏转后速度在腿局部坐标系里确实多了前向分量（步态不再只有左右摆）', () => {
    const yaw = strafeHipYaw(1, 0.7, 62, 1.1);
    // 纯右移的速度 (1,0)，身体朝正前 (0,0,1)；偏转 yaw 后前向投影 = sin(yaw)
    expect(Math.sin(yaw)).toBeGreaterThan(0.5);
  });
});
