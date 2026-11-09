import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import type { CharacterState, CombatState, HurtState } from '../src/core';
import { createSpiderRig } from '../src/presentation/spider-rig';

/**
 * v9s.50 · 蜘蛛主角骨架的契约测试。
 *
 * 只断言「几何上必须成立」的事，不锁具体角度：
 *   - 8 条腿的落点左右镜像对称（静止）
 *   - 支撑相的脚在世界坐标里纹丝不动（不滑步的唯一来源）
 *   - 转身时相位照样推进（否则脚被锁在世界、身体在转，腿会被拧到够不到）
 *   - 步频封顶：高速下相位推进速率不超过上限（超出部分转成脚滑，不转成抽腿）
 *   - 同一输入序列跑两遍，落点逐字节一致（确定性）
 */

const mkCharacter = (over: Partial<CharacterState> = {}): CharacterState => ({
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  facing: 0,
  moveYaw: 0,
  bodyYaw: 0,
  headYaw: 0,
  headPitch: 0,
  bodyPitch: 0,
  grounded: true,
  sprinting: false,
  gaitPhase: 0,
  stride: 1,
  distance: 0,
  coyoteTime: 0,
  jumpBuffer: 0,
  ...over,
});

const COMBAT = {
  weapon: 'sword-shield', phase: 'idle', attackProgress: 0, comboIndex: 0,
} as unknown as CombatState;

const HURT = { type: 'none' } as unknown as HurtState;

/** 骨架挂在 playerRoot 下：位置 / 朝向由该 root 承担，与 three-scene 完全一致。 */
function rig() {
  const root = new THREE.Group();
  const r = createSpiderRig(
    {} as never,
    { height: 0.35, scale: 1.3 },
  );
  root.add(r.group);
  const step = (c: CharacterState, dt = 1 / 60) => {
    root.position.set(c.position.x, c.position.y, c.position.z);
    root.rotation.y = c.bodyYaw;
    r.update(c, COMBAT, HURT, dt);
  };
  return { root, r, step };
}

describe('v9s.50 蜘蛛骨架', () => {
  it('8 条腿、左右镜像对称，静止时脚都落在同一个地面高度', () => {
    const { r, step } = rig();
    const c = mkCharacter();
    for (let i = 0; i < 20; i++) step(c);

    const legs = r.legs();
    expect(legs.length).toBe(8);
    const ys = legs.map((l) => l.y);
    for (const y of ys) expect(Math.abs(y)).toBeLessThan(1e-6);

    // 左 4 条 x < 0，右 4 条 x > 0，且按索引成对镜像（i 与 i+4 同 k）
    for (let i = 0; i < 8; i++) {
      expect(Math.sign(legs[i].x)).toBe(i < 4 ? -1 : 1);
      expect(legs[i].x).toBeCloseTo(-legs[(i + 4) % 8].x, 6);
      expect(legs[i].z).toBeCloseTo(legs[(i + 4) % 8].z, 6);
    }
  });

  it('支撑相的脚在世界坐标里不动（不滑步）', () => {
    const { r, step } = rig();
    // 朝 +Z 走，速度取常速
    const c = mkCharacter({ velocity: { x: 0, y: 0, z: 1.6 }, bodyYaw: 0 });
    for (let i = 0; i < 30; i++) step(c);

    // 找一条正处于支撑相的腿，记录它连续若干帧的落点
    let watched = -1;
    let last = { x: 0, z: 0 };
    let still = 0;
    for (let f = 0; f < 40; f++) {
      c.position.z += 1.6 / 60;
      step(c);
      const legs = r.legs();
      if (watched < 0) {
        const idx = legs.findIndex((l) => !l.swinging);
        if (idx >= 0) {
          watched = idx;
          last = { x: legs[idx].x, z: legs[idx].z };
        }
        continue;
      }
      const cur = legs[watched];
      if (cur.swinging) {
        // 这条腿摆动了一次，换一条继续看
        const idx = legs.findIndex((l) => !l.swinging && l !== cur);
        watched = idx >= 0 ? idx : watched;
        last = { x: legs[watched].x, z: legs[watched].z };
        continue;
      }
      // 支撑相：位移只能是 slide（0 或极小的脚滑补偿），不能是「跟着身体走」
      const moved = Math.hypot(cur.x - last.x, cur.z - last.z);
      expect(moved).toBeLessThan(0.02);      // 一帧身体走 0.027m，滑步远小于它
      last = { x: cur.x, z: cur.z };
      still++;
    }
    expect(still).toBeGreaterThan(5);
  });

  it('原地转身：即使位移为 0，相位也推进（脚会重新落位）', () => {
    const { r, step } = rig();
    // 只转不走
    let yaw = 0;
    const c = mkCharacter({ velocity: { x: 0, y: 0, z: 0 } });
    const before = r.debug().phase;
    for (let i = 0; i < 30; i++) {
      yaw += 0.03;                         // 1.8 rad/s
      c.bodyYaw = yaw;
      step(c);
    }
    const after = r.debug().phase;
    expect(after).not.toBeCloseTo(before, 4);
    // 转身不该把腿拧到够不到
    expect(r.debug().clamped).toBeLessThanOrEqual(2);
  });

  it('步频封顶：相位推进速率不超过 6.4 周期/秒，超出转成脚滑', () => {
    const { r, step } = rig();
    const c = mkCharacter({ velocity: { x: 0, y: 0, z: 4.5 }, bodyYaw: 0 });
    for (let i = 0; i < 20; i++) step(c);       // 进入稳态

    let cycles = 0;
    let prev = r.debug().phase;
    const dt = 1 / 60;
    for (let i = 0; i < 60; i++) {
      c.position.z += 4.5 * dt;
      step(c, dt);
      const p = r.debug().phase;
      let d = p - prev;
      if (d < -0.5) d += 1;                     // 跨 1 → 0
      cycles += d;
      prev = p;
    }
    const hz = cycles / (60 * dt);
    // CAP_HZ = 6.4；帧离散化会给一点点误差，容差放到 6.5
    expect(hz).toBeLessThanOrEqual(6.5);
    expect(hz).toBeGreaterThan(4.5);             // 也真的在走，不是卡死
  });

  it('惯性：加速时身体后仰、急停时前栽，且是弹簧不是 lerp（会过冲）', () => {
    const { r, step } = rig();
    const c = mkCharacter();
    const dt = 1 / 60;

    // 原地起步：0 → 2.6 m/s，用 Core 的加速度上限（20 m/s²）爬升
    for (let i = 0; i < 20; i++) {
      c.velocity.z = Math.min(2.6, c.velocity.z + 20 * dt);
      c.position.z += c.velocity.z * dt;
      step(c, dt);
    }
    const accel = r.debug();
    expect(accel.pitch).toBeLessThan(-0.005);      // rotation.x 负 = 抬头
    expect(accel.leanZ).toBeLessThan(-0.002);      // 身体相对脚被压在后面

    // 急停：一帧内速度归零，弹簧会先冲过头再回位
    c.velocity.z = 0;
    let peak = 0;
    for (let i = 0; i < 45; i++) {
      step(c, dt);
      peak = Math.max(peak, r.debug().pitch);
    }
    expect(peak).toBeGreaterThan(0.004);           // 前栽（低头）
    // 0.75s 后要收敛到峰值的 20% 以内 —— 说明是收敛的弹簧，不是一直歪着
    expect(Math.abs(r.debug().pitch)).toBeLessThan(peak * 0.2);
  });

  it('确定性：同一输入序列跑两遍，落点逐字节一致', () => {
    const run = () => {
      const { r, step } = rig();
      const c = mkCharacter({ velocity: { x: 0.7, y: 0, z: 1.4 } });
      for (let i = 0; i < 90; i++) {
        c.bodyYaw = i * 0.01;
        c.position.x += 0.7 / 60;
        c.position.z += 1.4 / 60;
        step(c);
      }
      return r.legs();
    };
    const a = run();
    const b = run();
    for (let i = 0; i < 8; i++) {
      expect(a[i].x).toBe(b[i].x);
      expect(a[i].y).toBe(b[i].y);
      expect(a[i].z).toBe(b[i].z);
    }
  });
});
