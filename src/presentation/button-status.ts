/**
 * v9s.x · 屏幕操作按钮的状态层（冷却 / 蓄力 / 引导 / 冲刺 / 电环 / 空中）。
 *
 * ## 边界
 * 纯表现层：只读 `World`，派生出每个按钮该显示什么，**不写 World、不改 Core、
 * 不参与快照 / 回放**。冷却秒数、蓄力比例这些「状态」全部来自 Core 已经算好的
 * 确定量（dash.cooldown / combat.charge / abilities.waveIndex ...），表现层不做
 * 任何计时、不读 Date.now / Math.random —— 暂停 / 慢放 / 回放看到的环都一致。
 *
 * ## 两部分
 *  - `deriveButtonStatuses(world)`：纯函数，无 DOM 依赖，可单测、确定性。
 *  - `createButtonStatusView()`：把派生状态写进按钮 DOM；只在值变化时写
 *    （diff 缓存），静止时零 DOM 写入，避免每帧 setAttribute 造成弱机 GC 抖动。
 *    `document` 访问全在函数体内部，模块顶层可在 Node 里安全 import。
 *
 * CSS 侧读 `--bs-deg`（进度环角度，带单位）与 `data-phase` / `data-badge`：
 * 角标用 `content: attr(data-badge)`，不新增 DOM 节点，父级 transform 也不受影响。
 */
import type { World } from '../core/types';

export type ButtonId = 'attack' | 'skill2' | 'sprint' | 'jump' | 'reset';

/**
 * 相位语义（CSS 据此配色 + 决定是否显示进度环）：
 *  - ready      空闲，不显示环 / 角标
 *  - cooldown   冷却中，环 = 剩余比例（从满收缩到 0），按钮变暗
 *  - charging   蓄力中（弓），环 = 蓄力比例（0→1）
 *  - channeling 引导 / 齐射中（法杖），环 = 波次进度
 *  - active     动作进行中（冲刺 / 闪现 / 电环 / 连击），环 = 动作进度
 *  - locked     当前不可用（离地不能再跳），按钮压暗
 */
export type ButtonPhase =
  | 'ready' | 'cooldown' | 'charging' | 'channeling' | 'active' | 'locked';

export type ButtonStatus = {
  id: ButtonId;
  phase: ButtonPhase;
  /** 0..1：环的填充比例（各相位含义见上） */
  ratio: number;
  /** 角标短文字；'' = 不显示 */
  badge: string;
  /** 无障碍朗读用的一句话，随相位更新 */
  hint: string;
};

export const BUTTON_IDS: readonly ButtonId[] = [
  'attack', 'skill2', 'sprint', 'jump', 'reset',
];

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
/** 剩余冷却 → 环比例；分母被调试面板改小也不会超过 1。 */
function cdRatio(remain: number, total: number): number {
  return clamp01(total > 1e-6 ? remain / total : (remain > 0 ? 1 : 0));
}
const secs = (v: number): string => `${v.toFixed(1)}s`;

function ready(id: ButtonId, label: string): ButtonStatus {
  return { id, phase: 'ready', ratio: 0, badge: '', hint: label };
}
function status(
  id: ButtonId, phase: ButtonPhase, ratio: number, badge: string, hint: string,
): ButtonStatus {
  return { id, phase, ratio: clamp01(ratio), badge, hint };
}

/**
 * 从 World 派生 5 个操作按钮的状态。优先级：进行态（蓄力 / 引导 / 动作）>
 * 冷却 > 可用态。同一按钮同一帧只会有一个相位，环不会叠。
 */
export function deriveButtonStatuses(world: World): ButtonStatus[] {
  const c = world.combat;
  const ab = world.abilities;
  const dash = world.dash;
  const link = world.playerLink;
  const ch = world.character;
  const cfg = world.config;

  // ---- 攻击键：弓蓄力 / 法杖引导 / 引导后冷却 / 近战连击段 ----
  let attack: ButtonStatus;
  if (c.charging) {
    attack = status('attack', 'charging', c.charge,
      `${Math.round(clamp01(c.charge) * 100)}%`, '攻击：蓄力中');
  } else if (ab.channeling) {
    const waves = Math.max(1, cfg.abilities.arcane.waves);
    attack = status('attack', 'channeling', ab.waveIndex / waves,
      `${Math.min(ab.waveIndex, waves)}/${waves}`, '攻击：引导齐射中');
  } else if (ab.cooldown > 1e-3) {
    attack = status('attack', 'cooldown',
      cdRatio(ab.cooldown, cfg.abilities.arcane.cooldown),
      secs(ab.cooldown), `攻击：冷却 ${secs(ab.cooldown)}`);
  } else if (c.phase !== 'idle' && c.comboIndex >= 1) {
    // 近战连击段：用 attackProgress 画一圈动作进度，角标给段号
    attack = status('attack', 'active', c.attackProgress,
      `${c.comboIndex}/3`, `攻击：连击第 ${c.comboIndex} 段`);
  } else {
    attack = ready('attack', '攻击');
  }

  // ---- 技2：电环激活 / 派生招·冲刺共享冷却 ----
  let skill2: ButtonStatus;
  const ring = ab.rings.length > 0
    ? ab.rings.reduce((m, r) => (r.life > m.life ? r : m))
    : null;
  if (ring && ring.duration > 1e-6) {
    skill2 = status('skill2', 'active', ring.life / ring.duration,
      '环', '副技能：电环生效中');
  } else {
    const shared = Math.max(link.cooldown, dash.cooldown);
    if (shared > 1e-3) {
      skill2 = status('skill2', 'cooldown',
        cdRatio(shared, cfg.links.sharedCooldown),
        secs(shared), `副技能：冷却 ${secs(shared)}`);
    } else {
      skill2 = ready('skill2', '副技能');
    }
  }

  // ---- 冲：冲刺 / 闪现进行中，或冷却 ----
  let sprint: ButtonStatus;
  if (dash.phase === 'active') {
    const prog = dash.duration > 1e-6 ? 1 - dash.timer / dash.duration : 1;
    sprint = status('sprint', 'active', prog,
      dash.kind === 'blink' ? '闪' : '滚', '冲刺：位移进行中');
  } else if (dash.cooldown > 1e-3) {
    const total = dash.kind === 'blink'
      ? cfg.dash.blinkCooldown : cfg.dash.rollCooldown;
    sprint = status('sprint', 'cooldown', cdRatio(dash.cooldown, total),
      secs(dash.cooldown), `冲刺：冷却 ${secs(dash.cooldown)}`);
  } else {
    sprint = ready('sprint', '冲刺');
  }

  // ---- 跳：离地时锁定（不能再起跳）----
  const jump: ButtonStatus = !ch.grounded
    ? status('jump', 'locked', 0, '空中', '跳跃：离地中，暂不可跳')
    : ready('jump', '跳跃');

  // 复位是「重置整场」，无资源 / 计时状态，保持 ready。
  return [attack, skill2, sprint, jump, ready('reset', '复位')];
}

export type ButtonStatusView = {
  /** 每帧调用：算出状态并按需写 DOM；返回本帧派生结果，便于诊断 / 验收。 */
  update(world: World): ButtonStatus[];
};

/**
 * 创建 DOM 更新器。进度环角度直接写成带单位的 `--bs-deg`（不在 CSS 里做
 * `calc(var * 360deg)`），对老 webview（微信 X5）兼容性最稳。
 */
export function createButtonStatusView(doc: Document = document): ButtonStatusView {
  const els = new Map<ButtonId, HTMLElement>();
  for (const id of BUTTON_IDS) {
    const el = doc.getElementById(`btn-${id}`);
    if (el) els.set(id, el as HTMLElement);
  }
  // 上次写入的值，用于 diff；静止帧不碰 DOM。
  const last = new Map<ButtonId, { phase: string; deg: string; badge: string; hint: string }>();

  return {
    update(world: World): ButtonStatus[] {
      const list = deriveButtonStatuses(world);
      for (const s of list) {
        const el = els.get(s.id);
        if (!el) continue;
        const deg = `${(Math.round(s.ratio * 3600) / 10).toFixed(1)}deg`;
        const prev = last.get(s.id);
        if (prev && prev.phase === s.phase && prev.deg === deg
          && prev.badge === s.badge && prev.hint === s.hint) continue;
        el.dataset.phase = s.phase;
        el.dataset.badge = s.badge;
        el.style.setProperty('--bs-deg', deg);
        el.setAttribute('aria-label', s.hint);
        last.set(s.id, { phase: s.phase, deg, badge: s.badge, hint: s.hint });
      }
      return list;
    },
  };
}
