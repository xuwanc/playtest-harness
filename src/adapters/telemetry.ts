import type { GameEvent, World } from '../core';
import type { ButtonGesture } from './button-gesture';
import type { InputFrame } from './input';

/**
 * v9f：发布端「飞行记录仪」。
 *
 * 为什么需要：真机（尤其手机）出问题时，让对方开 DevTools 抄日志不现实。
 * 这里在内存里滚一个环形缓冲，自动标记可疑片段，点左下角版本徽标 →「复制摘要」
 * 就能把最近 ~20 秒的输入 / 位移 / 状态机 / 异常贴回聊天。
 *
 * 纪律：
 *  - 纯内存，默认不上传（静态站没有后端，也不该偷偷外发）。
 *  - 不采集任何文本输入、不采集设备标识；UA 截断、屏幕尺寸只用于判断横竖屏与 DPR。
 *  - 固定容量环形缓冲，后台挂一小时也不涨内存。
 *  - 只读 World，从不写；不进快照、不影响 Core 的确定性与可移植性。
 *
 * 采样行用「定长数字数组」而不是对象：600 行 × 19 列约 55KB，
 * 对象形式要 3 倍体积，手机上复制/下载都更费劲。列名随 dump 一起导出。
 */

/** 状态位掩码。位值固定，跨版本追加不改旧位，方便对比历史记录。 */
export const FLAG_ATTACK = 1;
export const FLAG_DASH = 2;
export const FLAG_LINK = 4;
export const FLAG_AIR = 8;
export const FLAG_HURT = 16;
export const FLAG_AIM = 32;
export const FLAG_SPRINT = 64;
export const FLAG_CHANNEL = 128;

const FLAG_NAMES: [number, string][] = [
  [FLAG_ATTACK, 'atk'],
  [FLAG_DASH, 'dash'],
  [FLAG_LINK, 'link'],
  [FLAG_AIR, 'air'],
  [FLAG_HURT, 'hurt'],
  [FLAG_AIM, 'aim'],
  [FLAG_SPRINT, 'spr'],
  [FLAG_CHANNEL, 'chan'],
];

export function flagsToText(flags: number): string {
  if (flags === 0) return '-';
  const on = FLAG_NAMES.filter(([bit]) => (flags & bit) !== 0).map(([, name]) => name);
  return on.length > 0 ? on.join(',') : '-';
}

/** 采样行列定义（与 TelemetryRow 一一对应）。列只追加、不重排，旧 dump 仍可按位置读。 */
export const ROW_COLUMNS = [
  't', 'tick', 'dt', 'st', 'sy', 'rs', 'ry', 'held', 'src',
  'mx', 'mz', 'px', 'pz', 'vx', 'vz', 'yaw', 'body', 'fl', 'stride', 'inYaw',
] as const;
const COL_T = 0;
const COL_YAW = 15;
const COL_STRIDE = 18;
/**
 * v9h：输入方向直接落一列。之前摘要里的 `in` 是用 mx/mz 现算的，
 * 和判定用的 inYaw 不是同一条取值路径（前者含死区前后差异），
 * 出现过「摘要显示输入在变、判定却说 inΔ=0」的对不上。
 */
const COL_INYAW = 19;

export type TelemetryRow = (number | string)[];

export type TelemetryMeta = {
  version: string;
  buildTime: string;
  /** 页面打开时刻（本地时间字符串），用来对齐「我大概什么时候试的」 */
  startedAt: string;
  ua: string;
  screen: string;
  dpr: number;
  orientation: 'portrait' | 'landscape';
  cores: number;
};

export type AnomalyKind =
  /** 输入没变、朝向却单帧突变（正常只该出现在攻击锁向 / 受击 / 翻滚） */
  | 'dirJump'
  /** 拖拽瞄准刚松开，朝向立刻翻掉（v9d 修过的老问题，留作回归监控） */
  | 'aimDrop'
  /** 摇杆有明显输入但位移≈0（按钮穿透 / 输入被吞） */
  | 'moveFreeze'
  /** 手指按住摇杆、曾有大读数，却持续读到 0（摇杆被第二指冻结） */
  | 'stickLost'
  /** 单帧耗时尖峰（切后台、GC、首帧编译着色器） */
  | 'frameSpike';

export type TelemetryAnomaly = {
  kind: AnomalyKind;
  t: number;
  tick: number;
  /** 持续时长（ms）；瞬时事件为 0 */
  ms: number;
  detail: string;
  ctx: TelemetryRow[];
};

export type TelemetryStats = {
  frames: number;
  wallMs: number;
  simS: number;
  fps: number;
  dtMax: number;
  spikes: number;
  steps: number;
  stickActiveMs: number;
  gestures: Record<string, number>;
  attacks: number;
  hits: number;
  hurts: number;
  links: number;
  linkHits: number;
  rolls: number;
  blinks: number;
  /** 大角转向里「玩家自己要求」的次数：判据解释得掉的那部分，不算异常，只做可见性 */
  inTurns: number;
  inTurnMax: number;
  /** 法杖引导起手（「攻击 0」时靠这些字段区分「没按」和「按了但不是近战」） */
  channels: number;
  bolts: number;
  rings: number;
  bowCharges: number;
  jumps: number;
  resets: number;
  dirJumps: number;
  aimDrops: number;
  freezes: number;
  stickLosts: number;
};

export type TelemetryDump = {
  schema: 'harness-telemetry/1';
  meta: TelemetryMeta;
  stats: TelemetryStats;
  columns: readonly string[];
  samples: TelemetryRow[];
  events: { t: number; tick: number; k: string; d: string }[];
  anomalies: TelemetryAnomaly[];
};

export type RecorderOptions = {
  meta: TelemetryMeta;
  /** 落盘频率（Hz）。逐帧检测，抽稀存储；30Hz 时 600 行≈20 秒 */
  sampleHz?: number;
  sampleCapacity?: number;
  eventCapacity?: number;
  anomalyCapacity?: number;
  dirJumpDeg?: number;
  aimDropDeg?: number;
  freezeMs?: number;
  freezeSpeed?: number;
  stickLostMs?: number;
  spikeMs?: number;
};

export const DEFAULT_RECORDER_OPTIONS = {
  sampleHz: 30,
  sampleCapacity: 600,
  eventCapacity: 160,
  anomalyCapacity: 24,
  dirJumpDeg: 50,
  aimDropDeg: 22,
  freezeMs: 220,
  freezeSpeed: 0.08,
  stickLostMs: 300,
  spikeMs: 50,
};

export type RecorderStatus = {
  durationS: number;
  frames: number;
  events: number;
  anomalies: number;
  /** 最近 8 秒内出现过高优先级异常 → 徽标高亮 */
  alert: boolean;
  enabled: boolean;
};

export type TelemetryRecorder = {
  sample(world: World, frame: InputFrame, dtMs: number, steps?: number): void;
  event(e: GameEvent, t: number): void;
  gesture(g: ButtonGesture): void;
  /** 切前台/后台：suspend(ms) 内的帧不参与异常判定，避免误报 */
  suspend(ms: number): void;
  setEnabled(on: boolean): void;
  clear(): void;
  status(): RecorderStatus;
  dump(): TelemetryDump;
  summary(): string;
};

const r3 = (n: number): number => (Number.isFinite(n) ? Math.round(n * 1000) / 1000 : 0);
const deg1 = (rad: number): number => Math.round(((rad * 180) / Math.PI) * 10) / 10;
const TAU = Math.PI * 2;

function wrapPi(a: number): number {
  let x = a % TAU;
  if (x > Math.PI) x -= TAU;
  if (x < -Math.PI) x += TAU;
  return x;
}

function buildFlags(world: World, frame: InputFrame): number {
  let f = 0;
  if (world.combat.phase !== 'idle') f |= FLAG_ATTACK;
  if (world.dash.phase !== 'idle') f |= FLAG_DASH;
  if (world.playerLink.phase !== 'idle') f |= FLAG_LINK;
  if (!world.character.grounded) f |= FLAG_AIR;
  if (world.playerHurt.type !== 'none') f |= FLAG_HURT;
  if (frame.intents.aimActive) f |= FLAG_AIM;
  if (world.character.sprinting) f |= FLAG_SPRINT;
  if (world.abilities.channeling) f |= FLAG_CHANNEL;
  return f;
}

function describeEvent(e: GameEvent): string {
  const pos = `(${e.x.toFixed(1)},${e.z.toFixed(1)})`;
  switch (e.type) {
    case 'attack-start':
      return `slot${e.value}`;
    case 'hit':
    case 'link-hit':
    case 'player-hurt':
    case 'dummy-hit':
      return `dummy${e.value} ${pos}`;
    case 'link-start':
    case 'link-active':
    case 'link-end':
      return `link${e.value} ${pos}`;
    case 'weapon-change':
      return `slot${e.value}`;
    case 'dummy-mode':
      return `dummy${e.value}`;
    case 'blocked':
      return pos;
    case 'landed':
    case 'jumped':
      return pos;
    default:
      return e.value !== 0 ? `v${e.value}` : '';
  }
}

export type ResolvedRecorderOptions = typeof DEFAULT_RECORDER_OPTIONS;

export function createRecorder(options: RecorderOptions): TelemetryRecorder {
  // 逐项兜底而不是对象展开：展开会把可选字段的类型带成 number | undefined
  const opt: ResolvedRecorderOptions = {
    sampleHz: options.sampleHz ?? DEFAULT_RECORDER_OPTIONS.sampleHz,
    sampleCapacity: options.sampleCapacity ?? DEFAULT_RECORDER_OPTIONS.sampleCapacity,
    eventCapacity: options.eventCapacity ?? DEFAULT_RECORDER_OPTIONS.eventCapacity,
    anomalyCapacity: options.anomalyCapacity ?? DEFAULT_RECORDER_OPTIONS.anomalyCapacity,
    dirJumpDeg: options.dirJumpDeg ?? DEFAULT_RECORDER_OPTIONS.dirJumpDeg,
    aimDropDeg: options.aimDropDeg ?? DEFAULT_RECORDER_OPTIONS.aimDropDeg,
    freezeMs: options.freezeMs ?? DEFAULT_RECORDER_OPTIONS.freezeMs,
    freezeSpeed: options.freezeSpeed ?? DEFAULT_RECORDER_OPTIONS.freezeSpeed,
    stickLostMs: options.stickLostMs ?? DEFAULT_RECORDER_OPTIONS.stickLostMs,
    spikeMs: options.spikeMs ?? DEFAULT_RECORDER_OPTIONS.spikeMs,
  };
  const meta = options.meta;

  const rows: TelemetryRow[] = [];
  const events: { t: number; tick: number; k: string; d: string }[] = [];
  const anomalies: TelemetryAnomaly[] = [];

  const stats: TelemetryStats = {
    frames: 0, wallMs: 0, simS: 0, fps: 0, dtMax: 0, spikes: 0, steps: 0,
    stickActiveMs: 0, gestures: {},
    attacks: 0, hits: 0, hurts: 0, links: 0, linkHits: 0,
    rolls: 0, blinks: 0, jumps: 0, resets: 0,
    channels: 0, bolts: 0, rings: 0, bowCharges: 0,
    inTurns: 0, inTurnMax: 0,
    dirJumps: 0, aimDrops: 0, freezes: 0, stickLosts: 0,
  };

  let enabled = true;
  let t0 = -1;
  let lastRowT = -1e9;
  let prevYaw: number | null = null;
  let prevMoveYaw = 0;
  let prevFlags = 0;
  /** 最近一帧的武器：回答「攻击 0 次」到底是没按，还是按在法杖 / 弓上 */
  let lastWeapon = '';
  let freezeStart = -1;
  let freezeQuietUntil = -1;
  let stickLostStart = -1;
  let stickPeak = 0;
  let lastBlockedT = -1e9;
  let suspendUntil = -1;
  let lastAnomalyAt: Record<string, number> = {};
  /** 最近一次 sample 的模拟时间 / tick：手势事件不经过 step，用它们对齐时间轴 */
  let curT = 0;
  let curTick = 0;

  function pushRow(row: TelemetryRow, force: boolean): void {
    const gap = 1 / opt.sampleHz;
    const t = row[COL_T] as number;
    if (!force && t - lastRowT < gap - 1e-6) return;
    if (rows.length >= opt.sampleCapacity) rows.shift();
    rows.push(row);
    lastRowT = t;
  }

  function pushAnomaly(
    kind: AnomalyKind, t: number, tick: number, ms: number, detail: string, row?: TelemetryRow,
  ): void {
    // 同类异常 1.2s 内只留一条，避免一次抖动刷满缓冲
    const last = lastAnomalyAt[kind] ?? -1e9;
    if (t - last < 1.2) return;
    lastAnomalyAt[kind] = t;
    // 掉帧是最常见的一类，限 6 条：否则低端机长时间运行会把玩法异常全挤出缓冲
    if (kind === 'frameSpike') {
      let spikes = 0;
      for (const a of anomalies) if (a.kind === 'frameSpike') spikes++;
      if (spikes >= 6) return;
    }
    if (anomalies.length >= opt.anomalyCapacity) anomalies.shift();
    // 上下文取最近几行；触发帧若因抽稀还没落盘，补在末尾（引用比较，不会重复）
    let ctx = rows.slice(-7);
    if (row && (ctx.length === 0 || ctx[ctx.length - 1] !== row)) ctx = [...ctx.slice(-6), row];
    anomalies.push({ kind, t: r3(t), tick, ms: Math.round(ms), detail, ctx });
    if (kind === 'dirJump') stats.dirJumps++;
    else if (kind === 'aimDrop') stats.aimDrops++;
    else if (kind === 'moveFreeze') stats.freezes++;
    else if (kind === 'stickLost') stats.stickLosts++;
  }

  function pushEvent(k: string, d: string, t: number, tick: number): void {
    if (events.length >= opt.eventCapacity) events.shift();
    events.push({ t: r3(t), tick, k, d });
  }

  function countEvent(e: GameEvent): void {
    switch (e.type) {
      case 'attack-start': stats.attacks++; break;
      case 'hit': stats.hits++; break;
      case 'player-hurt': stats.hurts++; break;
      case 'link-start': stats.links++; break;
      case 'link-hit': stats.linkHits++; break;
      case 'roll': stats.rolls++; break;
      case 'blink': stats.blinks++; break;
      case 'channel-start': stats.channels++; break;
      case 'projectile-fire': stats.bolts++; break;
      case 'ring-place': stats.rings++; break;
      case 'charge-start': stats.bowCharges++; break;
      case 'jumped': stats.jumps++; break;
      case 'reset': stats.resets++; break;
      case 'blocked': lastBlockedT = e.tick; break;
      default: break;
    }
  }

  function summary(): string {
    const s = stats;
    const dur = s.wallMs / 1000;
    const g = s.gestures;
    const gsum = (kind: string) => Object.entries(g)
      .filter(([k]) => k.endsWith(`.${kind}`))
      .reduce((a, [, v]) => a + v, 0);
    const lines: string[] = [];
    lines.push(`# ${meta.version} · ${meta.startedAt} · ${meta.screen}@${meta.dpr} ${meta.orientation === 'portrait' ? '竖' : '横'} · ${meta.cores}核`);
    lines.push(`运行 ${dur.toFixed(1)}s / ${s.frames} 帧 · ${s.fps.toFixed(1)}fps · 最大 ${s.dtMax.toFixed(0)}ms · 尖峰 ${s.spikes} · 步 ${s.steps}`);
    lines.push(`摇杆活跃 ${dur > 0 ? Math.round((s.stickActiveMs / 1000 / dur) * 100) : 0}% · 手势 按下 ${gsum('press')}（单击 ${gsum('tap')} / 双击 ${gsum('doubleTap')} / 拖拽 ${gsum('drag')} / 长按 ${gsum('longPress')} / 打断 ${gsum('cancel')} / 拖放 ${gsum('release')}）`);
    lines.push(`攻击 ${s.attacks}(中${s.hits}) · 受击 ${s.hurts} · 派生 ${s.links}(中${s.linkHits}) · 翻滚 ${s.rolls} 闪现 ${s.blinks} · 跳 ${s.jumps} · 复位 ${s.resets}`);
    lines.push(`法杖 引导${s.channels} 飞弹${s.bolts} 电环${s.rings} · 弓蓄力${s.bowCharges} · 当前武器 ${lastWeapon || '-'}`);
    // 数量用「计数」而不是「缓冲条数」：掉帧条目有 6 条上限，用缓冲长度会写出
    // 「异常 3（spike 29）」这种自相矛盾的行。
    lines.push(`异常 ${s.dirJumps + s.aimDrops + s.freezes + s.stickLosts}`
      + `（dir ${s.dirJumps} / aim ${s.aimDrops} / freeze ${s.freezes} / stick ${s.stickLosts}）`
      + ` · 掉帧尖峰 ${s.spikes}`
      + (s.inTurns > 0 ? ` · 输入转向 ${s.inTurns} 次（最大 ${s.inTurnMax.toFixed(0)}°）` : ''));
    if (anomalies.length > 0) {
      for (const a of anomalies.slice(-6)) {
        lines.push(`· ${a.kind} @t${a.t.toFixed(2)} tick${a.tick} ${a.ms > 0 ? `${a.ms}ms ` : ''}${a.detail}`);
        const yaws = a.ctx.map((r) => String(r[COL_YAW])).join(' ');
        const ins = a.ctx.map((r) => (r[COL_INYAW] === '' || r[COL_INYAW] == null ? '.' : String(r[COL_INYAW]))).join(' ');
        lines.push(`  yaw ${yaws}`);
        lines.push(`  in  ${ins}`);
      }
    }
    if (events.length > 0) {
      lines.push('最近事件：');
      for (const e of events.slice(-12)) lines.push(`  ${e.t.toFixed(2)} ${e.k} ${e.d}`.trimEnd());
    }
    lines.push(`UA ${meta.ua}`);
    return lines.join('\n');
  }

  return {
    sample(world: World, frame: InputFrame, dtMs: number, steps = 0): void {
      stats.frames++;
      stats.steps += steps;
      stats.wallMs += dtMs;
      if (dtMs > stats.dtMax) stats.dtMax = dtMs;
      stats.fps = stats.wallMs > 0 ? (stats.frames * 1000) / stats.wallMs : 0;
      stats.simS = world.time;

      const t = world.time;
      if (t0 < 0) t0 = t;
      curT = t;
      curTick = world.tick;
      if (!enabled) return;

      const c = world.character;
      const mag = Math.hypot(frame.stickX, frame.stickY);
      const speed = Math.hypot(c.velocity.x, c.velocity.z);
      lastWeapon = world.combat.weapon;
      const flags = buildFlags(world, frame);
      const yaw = c.facing;
      const inLen = Math.hypot(frame.intents.moveX, frame.intents.moveZ);
      const inYaw = inLen > 0.05 ? Math.atan2(frame.intents.moveX, frame.intents.moveZ) : null;

      if (mag > 0.2) stats.stickActiveMs += dtMs;

      const row: TelemetryRow = [
        r3(t), world.tick, Math.round(dtMs * 10) / 10,
        r3(frame.stickX), r3(frame.stickY),
        r3(frame.stickRawX), r3(frame.stickRawY),
        frame.stickHeld ? 1 : 0, frame.source.slice(0, 8),
        r3(frame.intents.moveX), r3(frame.intents.moveZ),
        r3(c.position.x), r3(c.position.z),
        r3(c.velocity.x), r3(c.velocity.z),
        deg1(yaw), deg1(c.bodyYaw), flags, r3(c.stride),
        inYaw === null ? '' : deg1(inYaw),
      ];
      pushRow(row, false);

      const quiet = t * 1000 < suspendUntil;

      // 1) 单帧耗时尖峰
      // 首 0.6s 是着色器编译 / 首帧布局，固定会有大尖峰，判了只是噪音
      if (dtMs > opt.spikeMs && !quiet && t - t0 > 0.6) {
        stats.spikes++;
        pushAnomaly('frameSpike', t, world.tick, dtMs, `dt ${dtMs.toFixed(0)}ms fl=${flagsToText(flags)}`, row);
      }

      // 2) 朝向：先判「玩家要求的转向」，剩下的才算 bug
      //
      // v9h 换了判据。前两版都在比「朝向跳了多少 vs 输入变多少」，问题是这样量的是
      // 「这一帧输入动没动」，而不是「朝向有没有去玩家没要求的地方」：
      //   · 攻击锁定解除时朝向要回到输入方向 —— 输入没变，却被判成跳变（真机 141° 那条）
      //   · 摇杆中途松手 5 帧再指到反方向 —— 输入从「无」变「有」，同样被误伤
      // 现在改成看**残差**：朝向与当前输入方向的夹角。朝向跟着输入走 → 残差 0 → 正常；
      // 朝向停在输入之外 > 25° → 才是真异常。
      if (prevYaw !== null && !quiet) {
        const deltaDeg = Math.abs(deg1(wrapPi(yaw - prevYaw)));
        const moveDelta = Math.abs(deg1(wrapPi(c.moveYaw - prevMoveYaw)));
        // aim 只看「本帧」：拖拽瞄准期间朝向往哪走都是玩家指定的，屏蔽；
        // 松手那一帧 aim 已消失，仍要检查「是否回到输入方向」，所以不屏蔽。
        const busyF = ((prevFlags | flags) & (FLAG_ATTACK | FLAG_DASH | FLAG_LINK | FLAG_HURT))
          | (flags & FLAG_AIM);
        const residual = inYaw === null ? null : Math.abs(deg1(wrapPi(yaw - inYaw)));
        // 还在往输入方向转（残差在缩小）就说明朝向没跑偏，只是转速有限 —— v9h 加了
        // 1800°/s 上限后，大角掉头必然有若干帧残差 20~150°，不能算异常。
        const prevResidual = inYaw === null || prevYaw === null
          ? null
          : Math.abs(deg1(wrapPi(prevYaw - inYaw)));
        const converging = residual !== null && prevResidual !== null && residual < prevResidual - 0.5;
        // v9i：拖拽瞄准是玩家显式指定方向，aim 期间朝向跟它走是设计行为；
        // 松手后朝向回到摇杆方向同理。只有「松手瞬间没有移动输入、朝向却掉了」才是
        // v9d 那个 bug（法杖 / 弓松手面朝正下方），所以 aimDrop 只在无输入时判。
        const dropAim = (prevFlags & FLAG_AIM) !== 0 && (flags & FLAG_AIM) === 0 && inYaw === null;
        const explained = residual !== null && (residual <= 12 || converging);
        if (deltaDeg > opt.aimDropDeg && dropAim) {
          pushAnomaly('aimDrop', t, world.tick, 0,
            `${deltaDeg.toFixed(0)}° @aim→none stick(${frame.stickX.toFixed(2)},${frame.stickY.toFixed(2)})`
            + ` aim(${frame.aimDX.toFixed(0)},${frame.aimDY.toFixed(0)}) fl=${flagsToText(flags)}`, row);
        } else if (deltaDeg > opt.dirJumpDeg && busyF === 0 && !dropAim) {
          if (explained) {
            // 玩家自己拨的杆（含锁定解除后归位、松手后重新指方向）：不计异常，但要可见
            stats.inTurns++;
            if (deltaDeg > stats.inTurnMax) stats.inTurnMax = deltaDeg;
          } else {
            pushAnomaly('dirJump', t, world.tick, 0,
              `${deltaDeg.toFixed(0)}° res${residual === null ? ' 无输入' : `${residual.toFixed(0)}°`} yaw ${deg1(prevYaw)}→${deg1(yaw)} in ${inYaw === null ? '.' : deg1(inYaw)}° mvΔ${moveDelta.toFixed(0)}°`
              + ` aim(${frame.aimDX.toFixed(0)},${frame.aimDY.toFixed(0)}) fl=${flagsToText(prevFlags)}→${flagsToText(flags)}`, row);
          }
        }
      }

      // 3) 摇杆有输入但位移≈0（按钮穿透 / 输入被吞）；撞墙不算
      const busy = (flags & (FLAG_ATTACK | FLAG_DASH | FLAG_LINK | FLAG_HURT)) !== 0;
      const recentlyBlocked = world.tick - lastBlockedT < 30;
      if (mag > 0.35 && speed < opt.freezeSpeed && !busy && !recentlyBlocked) {
        if (freezeStart < 0) freezeStart = t;
        if (t - freezeStart >= opt.freezeMs / 1000 && t >= freezeQuietUntil) {
          pushAnomaly('moveFreeze', t, world.tick, (t - freezeStart) * 1000,
            `stick(${frame.stickX.toFixed(2)},${frame.stickY.toFixed(2)}) v${speed.toFixed(2)} ${frame.source} fl=${flagsToText(flags)}`, row);
          freezeQuietUntil = t + 1.5;
          freezeStart = -1;
        }
      } else {
        freezeStart = -1;
      }

      // 4) 摇杆被冻结：按住 + 曾有大读数 + 持续读到 0
      if (frame.stickHeld) {
        if (mag > stickPeak) stickPeak = mag;
        if (stickPeak > 0.35 && mag < 0.06) {
          if (stickLostStart < 0) stickLostStart = t;
          if (t - stickLostStart >= opt.stickLostMs / 1000) {
            pushAnomaly('stickLost', t, world.tick, (t - stickLostStart) * 1000,
              `raw(${frame.stickRawX.toFixed(2)},${frame.stickRawY.toFixed(2)}) peak ${stickPeak.toFixed(2)} fl=${flagsToText(flags)}`, row);
            stickLostStart = -1;
            stickPeak = 0;
          }
        } else {
          stickLostStart = -1;
        }
      } else {
        stickPeak = 0;
        stickLostStart = -1;
      }

      prevYaw = yaw;
      prevMoveYaw = c.moveYaw;
      prevFlags = flags;
    },

    event(e: GameEvent, t: number): void {
      const d = describeEvent(e);
      countEvent(e);
      if (!enabled) return;
      // 只留「玩家动作」与「结果」类事件；dash-ready / combo-reset 太吵
      if (e.type === 'dash-ready' || e.type === 'combo-reset' || e.type === 'stepUp') return;
      pushEvent(e.type, d, t, e.tick);
    },

    gesture(g: ButtonGesture): void {
      const key = `${g.button}.${g.kind}`;
      stats.gestures[key] = (stats.gestures[key] ?? 0) + 1;
      if (!enabled) return;
      // press / tap / release 只计数；带方向或时长的值得留一条
      if (g.kind === 'longPress' || g.kind === 'doubleTap' || g.kind === 'drag' || g.kind === 'cancel') {
        pushEvent(`g:${g.kind}`, `${g.button} ${g.heldMs.toFixed(0)}ms d${g.distance.toFixed(0)}px ${g.angleDeg.toFixed(0)}°`, curT, curTick);
      }
    },

    suspend(ms: number): void {
      // 用模拟时间轴换算，和 sample 里的 t 同源（Date.now 与 world.time 不同步）
      suspendUntil = curT * 1000 + ms;
      freezeStart = -1;
      stickLostStart = -1;
    },

    setEnabled(on: boolean): void {
      enabled = on;
      if (!on) {
        prevYaw = null;
        freezeStart = -1;
        stickLostStart = -1;
      }
    },

    clear(): void {
      rows.length = 0;
      events.length = 0;
      anomalies.length = 0;
      lastAnomalyAt = {};
      lastRowT = -1e9;
      prevYaw = null;
      prevFlags = 0;
      freezeStart = -1;
      stickLostStart = -1;
      stickPeak = 0;
      stats.frames = 0;
      stats.wallMs = 0;
      stats.dtMax = 0;
      stats.spikes = 0;
      stats.stickActiveMs = 0;
      stats.attacks = 0;
      stats.hits = 0;
      stats.hurts = 0;
      stats.links = 0;
      stats.linkHits = 0;
      stats.rolls = 0;
      stats.blinks = 0;
      stats.channels = 0;
      stats.bolts = 0;
      stats.rings = 0;
      stats.bowCharges = 0;
      stats.jumps = 0;
      stats.resets = 0;
      stats.dirJumps = 0;
      stats.aimDrops = 0;
      stats.inTurns = 0;
      stats.inTurnMax = 0;
      stats.freezes = 0;
      stats.stickLosts = 0;
      for (const k of Object.keys(stats.gestures)) delete stats.gestures[k];
    },

    status(): RecorderStatus {
      const now = stats.simS;
      const alert = anomalies.some((a) => now - a.t < 8 && (a.kind === 'dirJump' || a.kind === 'aimDrop' || a.kind === 'moveFreeze' || a.kind === 'stickLost'));
      return {
        durationS: stats.wallMs / 1000,
        frames: stats.frames,
        events: events.length,
        anomalies: anomalies.length,
        alert,
        enabled,
      };
    },

    dump(): TelemetryDump {
      return {
        schema: 'harness-telemetry/1',
        meta,
        stats: { ...stats, gestures: { ...stats.gestures } },
        columns: ROW_COLUMNS,
        samples: rows.slice(),
        events: events.slice(),
        anomalies: anomalies.slice(),
      };
    },

    summary,
  };
}
