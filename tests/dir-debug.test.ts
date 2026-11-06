import { describe, expect, it } from 'vitest';
import type { GroundBasis, InputFrame } from '../src/adapters/input';
import {
  angleGapDeg, faceDrift, readDirs, screenDeg, stickDeg, toScreenDir,
} from '../src/presentation/dir-debug';
import { makeWorld, intent } from './helpers';

/**
 * v9k 方向调试盘：验收「三个角到底代表什么、算得对不对」。
 * 屏幕角约定 0° = 正上（相机前方），90° = 右，180° = 下，-90° = 左。
 */

/** 相机基向量：right = +X，forward = +Z（最朴素的一组） */
const BASIS: GroundBasis = { rightX: 1, rightZ: 0, forwardX: 0, forwardZ: 1 };

/** 世界绕 Y 转 a 后的基向量：模拟相机偏航，用来验证「摇杆角与基向量无关」 */
function rotatedBasis(a: number): GroundBasis {
  return {
    rightX: Math.cos(a), rightZ: -Math.sin(a),
    forwardX: Math.sin(a), forwardZ: Math.cos(a),
  };
}

function frame(p: Partial<InputFrame> = {}): InputFrame {
  return {
    intents: intent(),
    stickX: 0, stickY: 0, stickRawX: 0, stickRawY: 0, stickHeld: false,
    stickId: null, stickOriginX: 0, stickOriginY: 0, stickPxX: 0, stickPxY: 0, stickBad: 0, stickVpTop: 0, stickVpAge: -1,
    aimDX: 0, aimDY: 0, source: 'idle', tap: null, zoomScale: 1,
    gestures: [], lastGesture: null,
    ...p,
  };
}

describe('方向调试盘：屏幕角映射（v9k）', () => {
  it('世界前 / 右 / 后 / 左 → 0° / 90° / 180° / -90°', () => {
    expect(screenDeg(0, 1, BASIS)).toBeCloseTo(0, 6);
    expect(screenDeg(1, 0, BASIS)).toBeCloseTo(90, 6);
    expect(screenDeg(0, -1, BASIS)).toBeCloseTo(180, 6);
    expect(screenDeg(-1, 0, BASIS)).toBeCloseTo(-90, 6);
  });

  it('投影向量长度保持为 1（正交基，不缩放箭头）', () => {
    for (const a of [0, 0.7, 2.1, -1.3]) {
      const b = rotatedBasis(a);
      const v = toScreenDir(Math.sin(a + 1.1), Math.cos(a + 1.1), b);
      expect(Math.hypot(v.x, v.y)).toBeCloseTo(1, 6);
    }
  });

  it('摇杆屏幕向量与「同一意图经基向量换算」得到同一个角（相机转多少度都不变）', () => {
    const sx = -0.62;
    const sy = 0.48;
    const fromStick = stickDeg(sx, sy);
    for (const a of [0, 0.4, 2.6, -1.9]) {
      const b = rotatedBasis(a);
      // 与 input.ts 同一换算：screen(x,y) → world(right·x + forward·-y)
      const mx = b.rightX * sx + b.forwardX * -sy;
      const mz = b.rightZ * sx + b.forwardZ * -sy;
      expect(screenDeg(mx, mz, b)).toBeCloseTo(fromStick, 6);
    }
  });

  it('摇杆四个正方向的角：上 0° / 右 90° / 下 180° / 左 -90°', () => {
    expect(stickDeg(0, -1)).toBeCloseTo(0, 6);
    expect(stickDeg(1, 0)).toBeCloseTo(90, 6);
    expect(stickDeg(0, 1)).toBeCloseTo(180, 6);
    expect(stickDeg(-1, 0)).toBeCloseTo(-90, 6);
    // 左下角 = 225°（用户报的方向），左上角 = -135°
    expect(((stickDeg(-0.7, 0.7) + 360) % 360)).toBeCloseTo(225, 6);
    expect(((stickDeg(-0.7, -0.7) + 360) % 360)).toBeCloseTo(315, 6);
  });

  it('夹角吃掉 360° 环绕，永远落在 0..180', () => {
    expect(angleGapDeg(350, 10)).toBeCloseTo(20, 6);
    expect(angleGapDeg(-90, 90)).toBeCloseTo(180, 6);
    expect(angleGapDeg(225, 135)).toBeCloseTo(90, 6);
    expect(angleGapDeg(0, 720.5)).toBeCloseTo(0.5, 6);
  });
});

describe('方向调试盘：一帧读数（v9k）', () => {
  it('推右并真的往右走 → 入/移一致，不告警', () => {
    const world = makeWorld();
    world.character.velocity.x = 5;
    world.character.velocity.z = 0;
    const s = readDirs(world, frame({ intents: intent({ moveX: 1, moveZ: 0 }) }), BASIS, 8);
    expect(s.inDeg).toBeCloseTo(90, 6);
    expect(s.moveDeg).toBeCloseTo(90, 6);
    expect(s.gapMove).toBeCloseTo(0, 6);
    expect(s.warnMove).toBe(false);
  });

  it('输入往右、位移却往左 → 夹角 180°、标黄告警（这正是要抓的 bug）', () => {
    const world = makeWorld();
    world.character.velocity.x = -5;
    world.character.velocity.z = 0;
    const s = readDirs(world, frame({ intents: intent({ moveX: 1, moveZ: 0 }) }), BASIS, 8);
    expect(s.gapMove).toBeCloseTo(180, 6);
    expect(s.warnMove).toBe(true);
  });

  it('摇杆被死区吃掉：意图为 0（无输入箭头）但原始读数仍在，能区分「没动」与「被吃掉」', () => {
    const world = makeWorld();
    const s = readDirs(world, frame({ stickRawX: 0.09, stickRawY: 0.03, stickHeld: true }), BASIS, 8);
    expect(s.inDeg).toBeNull();
    expect(s.rawDeg).not.toBeNull();
    expect(s.stickHeld).toBe(true);
    expect(s.warnMove).toBe(false);
  });

  it('慢走（速度 < 0.15）不出移动箭头，避免静止抖动乱指', () => {
    const world = makeWorld();
    world.character.velocity.x = 0.1;
    world.character.velocity.z = 0.05;
    const s = readDirs(world, frame({ intents: intent({ moveX: 0.2, moveZ: 0.2 }) }), BASIS, 8);
    expect(s.moveDeg).toBeNull();
    expect(s.gapMove).toBeNull();
  });

  it('拖拽瞄准期间面朝向偏离输入不算异常（本来就该偏），非瞄准时才算', () => {
    const world = makeWorld();
    world.character.facing = Math.PI / 2; // 面朝 +X（屏幕 90°）
    const base = frame({ intents: intent({ moveX: 0, moveZ: 1 }) }); // 输入往前（0°）
    const s1 = readDirs(world, { ...base, intents: intent({ moveX: 0, moveZ: 1, aimActive: true, aimX: 1, aimZ: 0 }) }, BASIS, 8);
    expect(s1.aimDeg).toBeCloseTo(90, 6);
    expect(faceDrift(s1, false)).toBe(false);
    const s2 = readDirs(world, base, BASIS, 8);
    expect(s2.gapFace).toBeCloseTo(90, 6);
    expect(faceDrift(s2, false)).toBe(true);
    expect(faceDrift(s2, true)).toBe(false); // 攻击中面朝向被锁定，属于预期
  });
});
