import { describe, expect, it } from 'vitest';
import type { ShockRingState, World } from '../src/core/types';
import {
  BUTTON_IDS, createButtonStatusView, deriveButtonStatuses,
} from '../src/presentation/button-status';
import type { ButtonId, ButtonStatus } from '../src/presentation/button-status';
import { makeWorld } from './helpers';

function byId(list: ButtonStatus[], id: ButtonId): ButtonStatus {
  const s = list.find((x) => x.id === id);
  if (!s) throw new Error(`missing status: ${id}`);
  return s;
}

function shockRing(life: number, duration = 1): ShockRingState {
  return { id: 1, x: 0, z: 0, radius: 1, life, duration, pulseTimer: 0 };
}

/**
 * 显式铺一套「全空闲」基线，避免测试依赖 makeWorld() 的默认值 /
 * 线上配置改动。每条用例只动自己关心的那几个字段。
 */
function idleWorld(): World {
  const w = makeWorld();
  w.combat.charging = false;
  w.combat.charge = 0;
  w.combat.phase = 'idle';
  w.combat.comboIndex = 0;
  w.combat.attackProgress = 0;
  w.abilities.channeling = false;
  w.abilities.waveIndex = 0;
  w.abilities.cooldown = 0;
  w.abilities.rings = [];
  w.dash.phase = 'idle';
  w.dash.cooldown = 0;
  w.playerLink.cooldown = 0;
  w.character.grounded = true;
  return w;
}

/**
 * 最小 fake DOM：记录所有 style / attr 写入，用来验证「静止帧零 DOM 写入」。
 * 传进去后 cast 成 Document —— 表现层只在函数体内用 getElementById，
 * 不碰 document 全局，因此 Node 环境也能安全构造。
 */
function fakeDoc() {
  const writes: string[] = [];
  const els = new Map<string, {
    dataset: Record<string, string>;
    props: Record<string, string>;
    attrs: Record<string, string>;
  }>();
  for (const id of BUTTON_IDS) {
    els.set(`btn-${id}`, { dataset: {}, props: {}, attrs: {} });
  }
  const doc = {
    getElementById(id: string) {
      const rec = els.get(id);
      if (!rec) return null;
      return {
        dataset: rec.dataset,
        style: {
          setProperty(k: string, v: string) {
            rec.props[k] = v;
            writes.push(`${id}|${k}=${v}`);
          },
        },
        setAttribute(k: string, v: string) {
          rec.attrs[k] = v;
          writes.push(`${id}|${k}=${v}`);
        },
      };
    },
  };
  return { doc, els, writes };
}

describe('v9s.x 操作按钮状态层（冷却 / 蓄力 / 引导 / 冲刺 / 电环 / 空中）', () => {
  it('初始：5 个按钮齐全，全部 ready、无环无角标', () => {
    const list = deriveButtonStatuses(idleWorld());
    expect(list.map((s) => s.id)).toEqual([...BUTTON_IDS]);
    for (const s of list) {
      expect(s.phase).toBe('ready');
      expect(s.badge).toBe('');
      expect(s.ratio).toBe(0);
    }
  });

  it('蓄力（弓）：百分比角标 + 进度环，且进行态优先于冷却', () => {
    const w = idleWorld();
    w.combat.charging = true;
    w.combat.charge = 0.6;
    w.abilities.cooldown = 0.8; // 故意同时给冷却
    const s = byId(deriveButtonStatuses(w), 'attack');
    expect(s.phase).toBe('charging');
    expect(s.badge).toBe('60%');
    expect(s.ratio).toBeCloseTo(0.6, 6);
    expect(s.hint).toContain('蓄力');
  });

  it('引导齐射（法杖）：显示 已发波数/总波数，按 config.waves 归一化', () => {
    const w = idleWorld();
    w.abilities.channeling = true;
    w.abilities.waveIndex = 2;
    const waves = w.config.abilities.arcane.waves;
    const s = byId(deriveButtonStatuses(w), 'attack');
    expect(s.phase).toBe('channeling');
    expect(s.badge).toBe(`2/${waves}`);
    expect(s.ratio).toBeCloseTo(2 / waves, 6);
  });

  it('引导冷却：显示剩余秒数，环按 config 冷却总长归一化', () => {
    const w = idleWorld();
    w.abilities.cooldown = 0.5;
    const total = w.config.abilities.arcane.cooldown;
    const s = byId(deriveButtonStatuses(w), 'attack');
    expect(s.phase).toBe('cooldown');
    expect(s.badge).toBe('0.5s');
    expect(s.ratio).toBeCloseTo(0.5 / total, 6);
  });

  it('近战连击段：段号角标 + attackProgress 动作进度', () => {
    const w = idleWorld();
    w.combat.phase = 'active';
    w.combat.comboIndex = 2;
    w.combat.attackProgress = 0.4;
    const s = byId(deriveButtonStatuses(w), 'attack');
    expect(s.phase).toBe('active');
    expect(s.badge).toBe('2/3');
    expect(s.ratio).toBeCloseTo(0.4, 6);
  });

  it('技2 电环生效中：active 且角标「环」，按 life/duration 归一化', () => {
    const w = idleWorld();
    w.abilities.rings = [shockRing(0.5, 1)];
    const s = byId(deriveButtonStatuses(w), 'skill2');
    expect(s.phase).toBe('active');
    expect(s.badge).toBe('环');
    expect(s.ratio).toBeCloseTo(0.5, 6);
  });

  it('技2 共享冷却：取 link 与 dash 冷却的较大值', () => {
    const w = idleWorld();
    w.playerLink.cooldown = 0.2;
    w.dash.cooldown = 0.4;
    const s = byId(deriveButtonStatuses(w), 'skill2');
    expect(s.phase).toBe('cooldown');
    expect(s.badge).toBe('0.4s');
    expect(s.ratio).toBeCloseTo(0.4 / w.config.links.sharedCooldown, 6);
  });

  it('冲刺进行中：闪现角标 + 归一化动作进度', () => {
    const w = idleWorld();
    w.dash.phase = 'active';
    w.dash.kind = 'blink';
    w.dash.timer = 0.1;
    w.dash.duration = 0.3;
    const s = byId(deriveButtonStatuses(w), 'sprint');
    expect(s.phase).toBe('active');
    expect(s.badge).toBe('闪');
    expect(s.ratio).toBeCloseTo(1 - 0.1 / 0.3, 6);
  });

  it('冲刺冷却：按对应 kind 的总冷却归一化', () => {
    const w = idleWorld();
    w.dash.kind = 'roll';
    w.dash.cooldown = 0.3;
    const s = byId(deriveButtonStatuses(w), 'sprint');
    expect(s.phase).toBe('cooldown');
    expect(s.badge).toBe('0.3s');
    expect(s.ratio).toBeCloseTo(0.3 / w.config.dash.rollCooldown, 6);
    // skill2 也吃到同一份 dash 冷却（共享语义）
    expect(byId(deriveButtonStatuses(w), 'skill2').badge).toBe('0.3s');
  });

  it('跳跃：离地锁定，角标「空中」', () => {
    const w = idleWorld();
    w.character.grounded = false;
    const s = byId(deriveButtonStatuses(w), 'jump');
    expect(s.phase).toBe('locked');
    expect(s.badge).toBe('空中');
  });

  it('复位恒为 ready（重置整场，无资源 / 计时状态）', () => {
    const w = idleWorld();
    w.combat.charging = true;
    w.dash.phase = 'active';
    const s = byId(deriveButtonStatuses(w), 'reset');
    expect(s.phase).toBe('ready');
    expect(s.badge).toBe('');
  });

  it('比例一律 clamp 到 0..1（超界 charge / 冷却总长被改小都不炸环）', () => {
    const w = idleWorld();
    w.combat.charging = true;
    w.combat.charge = 3;
    expect(byId(deriveButtonStatuses(w), 'attack').ratio).toBe(1);
    const w2 = idleWorld();
    w2.abilities.cooldown = 10;
    expect(byId(deriveButtonStatuses(w2), 'attack').ratio).toBe(1);
  });

  it('纯函数：只读 World，调用前后快照逐字节一致，且两次结果相同', () => {
    const w = idleWorld();
    w.combat.charging = true;
    w.combat.charge = 0.42;
    const before = JSON.stringify(w);
    const a = deriveButtonStatuses(w);
    const b = deriveButtonStatuses(w);
    expect(a).toEqual(b);
    expect(JSON.stringify(w)).toBe(before);
  });

  it('DOM 更新器：写 data-phase / data-badge / --bs-deg / aria-label，静止帧零写入', () => {
    const { doc, els, writes } = fakeDoc();
    const view = createButtonStatusView(doc as unknown as Document);
    const w = idleWorld();

    const list = view.update(w);
    expect(list).toHaveLength(BUTTON_IDS.length);
    // 每按钮 2 次写入：--bs-deg + aria-label（data-* 走 dataset，不计入）
    expect(writes.length).toBe(BUTTON_IDS.length * 2);
    expect(els.get('btn-attack')!.dataset.phase).toBe('ready');
    expect(els.get('btn-attack')!.props['--bs-deg']).toBe('0.0deg');

    const n = writes.length;
    view.update(w);
    expect(writes.length).toBe(n); // diff 命中：静止帧完全不碰 DOM

    w.combat.charging = true;
    w.combat.charge = 0.6;
    view.update(w);
    expect(writes.length).toBeGreaterThan(n);
    const atk = els.get('btn-attack')!;
    expect(atk.dataset.phase).toBe('charging');
    expect(atk.dataset.badge).toBe('60%');
    expect(atk.props['--bs-deg']).toBe('216.0deg');
    expect(atk.attrs['aria-label']).toContain('蓄力');
  });
});
