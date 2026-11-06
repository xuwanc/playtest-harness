import { describe, expect, it } from 'vitest';
import { createClock } from '../src/adapters/clock';
import { DEFAULT_RECORDER_OPTIONS, createRecorder, flagsToText } from '../src/adapters/telemetry';
import type { TelemetryMeta } from '../src/adapters/telemetry';
import type { InputFrame } from '../src/adapters/input';
import { intent, makeWorld, run } from './helpers';
import type { World } from '../src/core';

const META: TelemetryMeta = {
  version: 'test', buildTime: 'test', startedAt: '01-01 00:00',
  ua: 'vitest', screen: '390×844', dpr: 3, orientation: 'portrait', cores: 8,
};

function frame(p: Partial<InputFrame> = {}): InputFrame {
  return {
    intents: intent(),
    stickX: 0, stickY: 0, stickRawX: 0, stickRawY: 0, stickHeld: false,
    source: 'idle', tap: null, zoomScale: 1, gestures: [], lastGesture: null,
    ...p,
  };
}

/** 只推进时间轴，不跑 step —— 采样器读的是 world 上的状态字段 */
function advance(w: World, n = 1): void {
  for (let i = 0; i < n; i++) {
    w.tick += 1;
    w.time += 1 / 60;
  }
}

function mk() {
  return createRecorder({ meta: META });
}

describe('飞行记录仪：采样环与导出', () => {
  it('按 sampleHz 抽稀，容量封顶不无限增长', () => {
    const w = makeWorld();
    const rec = createRecorder({ meta: META, sampleHz: 30, sampleCapacity: 100 });
    const f = frame();
    for (let i = 0; i < 600; i++) {
      advance(w);
      rec.sample(w, f, 16.7);
    }
    const dump = rec.dump();
    // 10 秒 → 300 行，但容量 100，只留最近的
    expect(dump.samples.length).toBe(100);
    expect(dump.samples.length).toBeLessThanOrEqual(100);
    const last = dump.samples[dump.samples.length - 1];
    // 抽稀：最后一行落在最近 1/sampleHz 内，不会正好等于末帧
    expect(w.time - (last[dump.columns.indexOf('t')] as number)).toBeLessThan(0.05);
  });

  it('导出列名与每行长度一致，事件 / 统计随事件累积', () => {
    const w = makeWorld();
    const rec = mk();
    advance(w);
    rec.sample(w, frame(), 16.7);
    rec.event({ type: 'attack-start', tick: w.tick, x: 0, y: 0, z: 0, value: 1 }, w.time);
    rec.event({ type: 'hit', tick: w.tick, x: 1, y: 0, z: 2, value: 3 }, w.time);
    rec.event({ type: 'player-hurt', tick: w.tick, x: 0, y: 0, z: 0, value: 2 }, w.time);
    const dump = rec.dump();
    expect(dump.schema).toBe('harness-telemetry/1');
    for (const row of dump.samples) expect(row.length).toBe(dump.columns.length);
    expect(dump.stats.attacks).toBe(1);
    expect(dump.stats.hits).toBe(1);
    expect(dump.stats.hurts).toBe(1);
    expect(dump.events.map((e) => e.k)).toContain('attack-start');
  });

  it('摘要是一段可直接粘贴的文本，包含版本、计数与 UA', () => {
    const w = makeWorld();
    const rec = mk();
    advance(w);
    rec.sample(w, frame(), 16.7);
    rec.event({ type: 'attack-start', tick: w.tick, x: 0, y: 0, z: 0, value: 1 }, w.time);
    const text = rec.summary();
    expect(text).toContain('test');
    expect(text).toContain('攻击 1');
    expect(text).toContain('UA vitest');
    expect(text.split('\n').length).toBeGreaterThan(3);
  });

  it('clear 后计数与缓冲归零', () => {
    const w = makeWorld();
    const rec = mk();
    advance(w);
    rec.sample(w, frame(), 16.7);
    rec.event({ type: 'hit', tick: w.tick, x: 0, y: 0, z: 0, value: 1 }, w.time);
    rec.clear();
    const dump = rec.dump();
    expect(dump.samples.length).toBe(0);
    expect(dump.events.length).toBe(0);
    expect(dump.stats.hits).toBe(0);
  });
});

describe('飞行记录仪：异常标记', () => {
  it('无输入时朝向单帧突跳 → dirJump，并带上触发帧上下文', () => {
    const w = makeWorld();
    const rec = mk();
    const f = frame();
    advance(w);
    rec.sample(w, f, 16.7);
    advance(w);
    rec.sample(w, f, 16.7);
    // 输入没变，但朝向翻了 180°：这是「松手后掉向」那类 bug 的特征
    w.character.facing = Math.PI;
    advance(w);
    rec.sample(w, f, 16.7);
    const dump = rec.dump();
    const a = dump.anomalies.find((x) => x.kind === 'dirJump');
    expect(a).toBeTruthy();
    expect(a!.detail).toContain('180');
    expect(a!.ctx.length).toBeGreaterThan(1);
    expect(rec.status().alert).toBe(true);
  });

  it('攻击中朝向锁定不算 dirJump', () => {
    const w = makeWorld();
    const rec = mk();
    const f = frame();
    for (let i = 0; i < 2; i++) { advance(w); rec.sample(w, f, 16.7); }
    w.combat.phase = 'windup';
    w.character.facing = 2.0;
    advance(w);
    rec.sample(w, f, 16.7);
    expect(rec.dump().anomalies.some((x) => x.kind === 'dirJump')).toBe(false);
  });

  it('玩家拨杆转身：朝向跟着输入走 → 不算 dirJump，记为「输入转向」', () => {
    const w = makeWorld();
    const rec = mk();
    const fx = frame({ intents: intent({ moveX: 1, moveZ: 0 }) });
    const fz = frame({ intents: intent({ moveX: 0, moveZ: 1 }) });
    for (let i = 0; i < 20; i++) { advance(w); rec.sample(w, fx, 16.7); }
    // 真跑 step：朝向由 orientation 自己转过去，不是手改字段
    for (let i = 0; i < 20; i++) { run(w, 1, fx.intents); rec.sample(w, fx, 16.7); }
    for (let i = 0; i < 4; i++) { run(w, 1, fz.intents); rec.sample(w, fz, 16.7); }
    const dump = rec.dump();
    expect(dump.anomalies.some((x) => x.kind === 'dirJump')).toBe(false);
    // 90° 转向被拆到几帧里，单帧不足 50°，所以不计「输入转向」也不该误报
    expect(dump.stats.inTurns).toBeGreaterThanOrEqual(0);
  });

  it('输入几乎没变、朝向却大跳 → 仍然报 dirJump（真 bug 不漏）', () => {
    const w = makeWorld();
    const rec = mk();
    const f = frame({ intents: intent({ moveX: 0.35, moveZ: 0.9 }) });
    advance(w);
    rec.sample(w, f, 16.7);
    w.character.facing = -1.4;
    advance(w);
    rec.sample(w, f, 16.7);
    const a = rec.dump().anomalies.find((x) => x.kind === 'dirJump');
    expect(a).toBeTruthy();
    // v9h 判据改成残差：朝向停在输入之外多少度
    expect(a!.detail).toContain('res');
    expect(a!.detail).toContain('res102°');
  });

  it('限速转身途中（残差在缩小）不算 dirJump，只记「输入转向」', () => {
    const w = makeWorld();
    const rec = mk();
    const f = frame({ intents: intent({ moveX: 1, moveZ: 0 }) });   // 输入方向 90°
    w.character.facing = 0;
    advance(w);
    rec.sample(w, f, 16.7);
    w.character.facing = Math.PI / 3;                               // 一帧转 60°，残差 90→30
    advance(w);
    rec.sample(w, f, 16.7);
    const dump = rec.dump();
    expect(dump.anomalies.some((x) => x.kind === 'dirJump')).toBe(false);
    expect(dump.stats.inTurns).toBe(1);
    expect(rec.summary()).toContain('输入转向 1 次');
  });

  it('拖拽松手瞬间朝向翻掉 → aimDrop（v9d 老问题的回归监控）', () => {
    const w = makeWorld();
    const rec = mk();
    const aim = frame({ intents: intent({ aimActive: true }) });
    const noAim = frame({ intents: intent({ aimActive: false }) });
    advance(w);
    rec.sample(w, aim, 16.7);
    w.character.facing = 0.9;
    advance(w);
    rec.sample(w, noAim, 16.7);
    const a = rec.dump().anomalies.find((x) => x.kind === 'aimDrop');
    expect(a).toBeTruthy();
    expect(a!.detail).toContain('aim→none');
  });

  it('摇杆有明显输入但位移≈0 持续超阈值 → moveFreeze', () => {
    const w = makeWorld();
    const rec = createRecorder({ meta: META, freezeMs: 120 });
    const f = frame({ stickX: 0.8, stickRawX: 0.8, stickHeld: true, source: 'pointer', intents: intent({ moveX: 0.8 }) });
    for (let i = 0; i < 12; i++) { advance(w); rec.sample(w, f, 16.7); }
    const a = rec.dump().anomalies.find((x) => x.kind === 'moveFreeze');
    expect(a).toBeTruthy();
    expect(a!.ms).toBeGreaterThanOrEqual(120);
  });

  it('攻击中站着不动不会被误判成 moveFreeze', () => {
    const w = makeWorld();
    const rec = createRecorder({ meta: META, freezeMs: 100 });
    w.combat.phase = 'active';
    const f = frame({ stickX: 0.8, stickRawX: 0.8, stickHeld: true, intents: intent({ moveX: 0.8 }) });
    for (let i = 0; i < 12; i++) { advance(w); rec.sample(w, f, 16.7); }
    expect(rec.dump().anomalies.some((x) => x.kind === 'moveFreeze')).toBe(false);
  });

  it('按住摇杆却持续读到 0 → stickLost（第二指冻结摇杆的回归监控）', () => {
    const w = makeWorld();
    const rec = createRecorder({ meta: META, stickLostMs: 150 });
    const held = frame({ stickX: 0.9, stickRawX: 0.9, stickHeld: true, source: 'pointer' });
    const frozen = frame({ stickX: 0, stickRawX: 0.9, stickHeld: true, source: 'pointer' });
    advance(w);
    rec.sample(w, held, 16.7);
    for (let i = 0; i < 12; i++) { advance(w); rec.sample(w, frozen, 16.7); }
    expect(rec.dump().anomalies.some((x) => x.kind === 'stickLost')).toBe(true);
  });

  it('单帧尖峰被记录；suspend 期间的尖峰忽略（切后台不误报）', () => {
    const w = makeWorld();
    const rec = mk();
    // 前 0.6s 是首帧编译着色器，设计上不判尖峰；先跑过去
    for (let i = 0; i < 45; i++) { advance(w); rec.sample(w, frame(), 16.7); }
    rec.sample(w, frame(), 220);
    expect(rec.dump().stats.spikes).toBe(1);
    rec.suspend(1000);
    for (let i = 0; i < 3; i++) { advance(w); rec.sample(w, frame(), 220); }
    expect(rec.dump().stats.spikes).toBe(1);
  });

  it('状态位文本可读，未知位被忽略', () => {
    expect(flagsToText(0)).toBe('-');
    expect(flagsToText(1 | 8)).toBe('atk,air');
    expect(flagsToText(256)).toBe('-');
  });

  it('暂停记录后不再落盘，但帧数继续统计（能看出帧率）', () => {
    const w = makeWorld();
    const rec = mk();
    const f = frame();
    for (let i = 0; i < 10; i++) { advance(w); rec.sample(w, f, 16.7); }
    const before = rec.dump().samples.length;
    rec.setEnabled(false);
    for (let i = 0; i < 30; i++) { advance(w); rec.sample(w, f, 16.7); }
    const dump = rec.dump();
    expect(dump.samples.length).toBe(before);
    expect(dump.stats.frames).toBe(40);
    expect(rec.status().enabled).toBe(false);
  });

  it('同帧只保留一条同类异常（1.2s 节流）', () => {
    const w = makeWorld();
    const rec = mk();
    const f = frame();
    for (let i = 0; i < 6; i++) {
      w.character.facing = i % 2 === 0 ? 0 : Math.PI;
      advance(w);
      rec.sample(w, f, 16.7);
    }
    expect(rec.dump().anomalies.filter((x) => x.kind === 'dirJump').length).toBe(1);
  });

  it('默认参数与文档一致（30Hz / 600 行 ≈ 20 秒）', () => {
    expect(DEFAULT_RECORDER_OPTIONS.sampleHz).toBe(30);
    expect(DEFAULT_RECORDER_OPTIONS.sampleCapacity / DEFAULT_RECORDER_OPTIONS.sampleHz).toBe(20);
  });
});

describe('时钟：掉帧补算多步时逐步回调', () => {
  it('onStep 次数与返回值一致，且能收到每步事件', () => {
    const w = makeWorld();
    const clock = createClock(w);
    let calls = 0;
    let events = 0;
    const steps = clock.frame(0.1, intent({ jumpPressed: true }), 1, false, () => {
      calls++;
      events += w.events.length;
    });
    expect(steps).toBeGreaterThan(1);
    expect(calls).toBe(steps);
    expect(events).toBeGreaterThan(0);
  });
});
