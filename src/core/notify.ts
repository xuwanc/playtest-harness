/**
 * v9s.31 · 关键帧事件（Animation Notify）—— 攻击时间轴上的**离散事件**。
 *
 * 为什么需要它：
 *  - 旧版判定只认「`attack-active` 事件那一帧」，也就是 active 段的第一帧扫一次扇形。
 *    敌人如果在这一帧之后才走进刀风里，就完全吃不到伤害；反过来，挥击的动作与判定
 *    只能靠阶段比例猜，改 timing 就会漂。
 *  - 音效 / 尘土 / 镜头震动这类「到点触发一次」的表现，原先只能靠 `attackProgress`
 *    做阈值比较，掉帧时要么漏、要么一帧内重复触发。
 *
 * 做法（与成熟引擎的 AnimNotify 同构）：
 *  - 数据是纯数值：`{ at: 'windup'|'active'|'recovery', u: 0..1, name, value? }`，
 *    挂在武器的 profile 上，跟着 attackProgress 走，不依赖帧率；
 *  - 消费端维护一个标量游标（cursor），每帧只扫描 `(cursor, after]` 这一段，
 *    因此单帧跨阶段、掉帧补算、卡肉冻结都不会漏发或重发；
 *  - 标量把三个阶段首尾相接（windup 0..1 → active 1..2 → recovery 2..3），
 *    阶段边界天然连续，不需要分别处理「进入 active 的第一帧」。
 *
 * 纯函数、零依赖：可直接单测，也能逐字节移植到 C#。
 */

export type AttackPhaseName = 'windup' | 'active' | 'recovery';

export type NotifyDef = {
  /** 落在哪个阶段 */
  at: AttackPhaseName;
  /** 阶段内归一化位置 0..1，缺省 0（阶段起点） */
  u?: number;
  /** 事件名（`blade-air` / `foot-step` / `hit-window` …），表现层据此分发 */
  name: string;
  /** 附带数值（音量 / 强度 / 段号），缺省 0 */
  value?: number;
};

export type NotifyFired = {
  name: string;
  value: number;
  at: AttackPhaseName;
  u: number;
};

const PHASE_INDEX: Record<AttackPhaseName, number> = {
  windup: 0,
  active: 1,
  recovery: 2,
};

const EPS = 1e-9;

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function isAttackPhaseName(v: string): v is AttackPhaseName {
  return v === 'windup' || v === 'active' || v === 'recovery';
}

/** 阶段内归一化位置 + 阶段名 → 连续标量 0..3（阶段首尾相接）。 */
export function phaseScalar(at: AttackPhaseName, u: number): number {
  return PHASE_INDEX[at] + clamp01(u);
}

/**
 * 扫描 `(cursor, after]` 区间内的通知。
 *
 * @param cursor 上一帧的标量；`< 0` 表示攻击刚开始（下一次扫描包含 0 时刻）。
 * @param after  本帧结束时的标量（由 `phaseScalar` 算出）。
 * @returns 按时间顺序排列的命中通知。
 *
 * 边界语义：左开右闭。同一标量上定义了多条通知会全部触发（作者自负）；
 * 若想「阶段末尾」触发，写 `u: 1` 即可 —— 它会在进入下一阶段的那一帧发出。
 */
export function collectNotifies(
  defs: readonly NotifyDef[] | undefined,
  cursor: number,
  after: number,
): NotifyFired[] {
  if (!defs || defs.length === 0) return [];
  if (!Number.isFinite(after) || after < 0) return [];
  const from = Number.isFinite(cursor) ? cursor : -1;
  const out: NotifyFired[] = [];
  for (const d of defs) {
    if (!d || !isAttackPhaseName(d.at)) continue;
    const u = clamp01(d.u ?? 0);
    const s = PHASE_INDEX[d.at] + u;
    // (from, after]；from < 0 时把 0 时刻也包含进来
    if (s > from + EPS && s <= after + EPS) {
      out.push({ name: d.name, value: Number.isFinite(d.value) ? (d.value as number) : 0, at: d.at, u });
    }
  }
  out.sort((a, b) => PHASE_INDEX[a.at] + a.u - (PHASE_INDEX[b.at] + b.u));
  return out;
}

/** 校验一组通知，返回错误描述（空数组 = 合法）。 */
export function validateNotifies(defs: readonly NotifyDef[] | undefined): string[] {
  if (!defs) return [];
  const errs: string[] = [];
  if (!Array.isArray(defs)) return ['notifies 不是数组'];
  const seen = new Set<string>();
  defs.forEach((d, i) => {
    if (!d || typeof d !== 'object') {
      errs.push(`notifies[${i}] 不是对象`);
      return;
    }
    if (!isAttackPhaseName(d.at as string)) errs.push(`notifies[${i}].at=${d.at} 非法`);
    if (typeof d.name !== 'string' || d.name.length === 0) errs.push(`notifies[${i}].name 缺失`);
    if (d.u !== undefined && (typeof d.u !== 'number' || !Number.isFinite(d.u) || d.u < 0 || d.u > 1)) {
      errs.push(`notifies[${i}].u=${d.u} 超出 0..1`);
    }
    if (d.value !== undefined && (typeof d.value !== 'number' || !Number.isFinite(d.value))) {
      errs.push(`notifies[${i}].value 不是有限数`);
    }
    const key = `${d.at}@${d.u ?? 0}:${d.name}`;
    if (seen.has(key)) errs.push(`notifies[${i}] 重复（${key}）`);
    seen.add(key);
  });
  return errs;
}
