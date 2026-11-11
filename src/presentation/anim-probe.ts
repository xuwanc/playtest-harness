/**
 * v9s.74 · 动画层「通道所有权」探针。
 *
 * 背景：`voxel-rig.update()` 里二十多层按注释编号顺序执行（2.05 → 2.85 → 3.55 → 4），
 * 每层用 `+=` / `=` 写同一批骨骼。顺序与归属只写在注释里，于是反复出现两类 bug：
 *
 * 1. **越权**：某层写了不属于它的通道（v9s.73 的 `applyCombatPose` 每帧把
 *    `upper.rotation.y` 归零，把持械站姿一起吃掉了）；
 * 2. **双覆盖**：两个 `override` 语义的层同时活跃，后一个静默覆盖前一个。
 *
 * 这两类问题靠截图 / 单点读数很难发现 —— 表现是「站姿只剩 0.03 rad」，而不是报错。
 * 这里把「层声明写哪些通道」变成可测的数据：
 *
 * ```text
 * 每层边界 mark(id) → 读快照 → 与上一层的快照做差 → 得到「这一层实际写了什么」
 * 帧尾 auditFrame() → 声明 vs 实测：越权（写了没声明）/ 冲突（两个 override 同通道）
 * ```
 *
 * **默认关闭**，关闭时 `probe` 为 null、`mark` 是一个空函数调用，开销只有一次判空。
 * 打开方式：`view.animation.probe.enabled = true`（或单测里直接传），
 * 之后 `rig.animProbe()` 返回最近一帧的报告。
 *
 * 只监控「会被多层叠加」的通道：躯干 / 骨盆 / 下盘 / 踝。手臂不在首批 ——
 * 手臂按设计就是「覆盖」语义（v9s.73 因 YXZ 翻支不能走四元数增量），
 * 多层覆盖是已知约定，不是 bug。
 */

/** 受控属性。position 用 `p*`，rotation 用 `r*`（都取局部量，读 Three 的 Vector3 / Euler）。 */
export type ProbeProp = 'px' | 'py' | 'pz' | 'rx' | 'ry' | 'rz';

export const PROBE_PROPS: readonly ProbeProp[] = ['px', 'py', 'pz', 'rx', 'ry', 'rz'];

/** 只依赖 `{x,y,z}` 结构，不 import three —— 便于纯函数单测。 */
export interface ProbeNodeLike {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export interface ProbeNodeSpec {
  /** 通道前缀，例如 `pelvis` → `pelvis.px` */
  id: string;
  node: ProbeNodeLike;
  /** 该节点受监控的属性；缺省全部 6 个 */
  props?: readonly ProbeProp[];
}

/**
 * 写入语义：
 * - `add`：叠加（`+=`），同通道可以有很多层；
 * - `override`：整体替换（`=` 或「先归零再写」），同帧只允许一个活跃；
 * - `derive`：**读上一层的结果再重新分配**（`splitSpine` / `distributeYaw`）。
 *   它必然覆盖别人的写入，但那正是它的职责 —— 不参与冲突判定，仍参与越权判定；
 * - `reset`：每帧开头的统一归零，不参与冲突判定（它天然与所有 override 同通道）。
 */
export type ChannelKind = 'add' | 'override' | 'derive' | 'reset';

export interface LayerSpec {
  /** 与代码里的注释编号一致，便于对照 */
  id: string;
  writes: Record<string, ChannelKind>;
}

export interface ProbeViolation {
  layer: string;
  channel: string;
  kind: ChannelKind | 'undeclared';
}

export interface ProbeReport {
  /** 自 begin 起累计的帧数 */
  frames: number;
  /** 最近一帧执行过的层（按 mark 顺序） */
  layers: string[];
  /** 越权：写了声明里没有的通道 */
  overreach: ProbeViolation[];
  /** 冲突：同一通道被两个及以上的 `override` 层写过 */
  conflicts: { channel: string; layers: string[] }[];
  /** 声明了但最近一帧没写（信息项，可能是条件分支没走到，不作断言） */
  unused: ProbeViolation[];
}

const EPS = 1e-6;

/**
 * 采集器：`beginFrame()` → 每层边界 `mark(id)` → `endFrame()`。
 *
 * `mark` 的做法是「读当前快照 − 上一段快照」，所以它抓的是**实际写入**，不是声明 ——
 * 层里写了又写回原值、或条件分支没走到，都不会被误记成写过。
 */
export class AnimProbe {
  private readonly nodes: readonly ProbeNodeSpec[];
  private prev: Float32Array;
  private cur: Float32Array;
  private observed = new Map<string, Set<string>>();
  private executed: string[] = [];
  private last: ProbeReport = { frames: 0, layers: [], overreach: [], conflicts: [], unused: [] };

  constructor(nodes: readonly ProbeNodeSpec[]) {
    this.nodes = nodes;
    this.prev = new Float32Array(nodes.length * PROBE_PROPS.length);
    this.cur = new Float32Array(nodes.length * PROBE_PROPS.length);
  }

  beginFrame(): void {
    this.observed.clear();
    this.executed.length = 0;
    readSnapshot(this.nodes, this.prev);
  }

  /** 层边界。允许同一层 mark 多次（分几段写的层合并成一条记录）。 */
  mark(id: string): void {
    readSnapshot(this.nodes, this.cur);
    const set = new Set<string>();
    diffInto(this.prev, this.cur, this.nodes, set);
    if (set.size) {
      const acc = this.observed.get(id);
      if (acc) for (const ch of set) acc.add(ch);
      else this.observed.set(id, set);
    }
    this.executed.push(id);
    const t = this.prev;
    this.prev = this.cur;
    this.cur = t;
  }

  endFrame(specs: readonly LayerSpec[]): ProbeReport {
    const { overreach, conflicts, unused } = auditFrame(specs, this.observed, this.executed);
    this.last = {
      frames: this.last.frames + 1,
      layers: [...this.executed],
      overreach,
      conflicts,
      unused,
    };
    return this.last;
  }

  report(): ProbeReport {
    return this.last;
  }

  /** 调试用：本帧「层 → 实际写过的通道」原始记录。 */
  matrix(): Map<string, Set<string>> {
    return new Map([...this.observed].map(([k, v]) => [k, new Set(v)]));
  }
}

export function channelKey(nodeId: string, prop: ProbeProp): string {
  return `${nodeId}.${prop}`;
}

/** 读一份快照：索引按 `nodeIdx * 6 + propIdx`，未监控的属性填 0 并在 diff 时跳过。 */
export function readSnapshot(nodes: readonly ProbeNodeSpec[], out: Float32Array): void {
  for (let i = 0; i < nodes.length; i++) {
    const { node, props } = nodes[i];
    const base = i * PROBE_PROPS.length;
    for (let p = 0; p < PROBE_PROPS.length; p++) {
      const prop = PROBE_PROPS[p];
      if (props && !props.includes(prop)) {
        out[base + p] = 0;
        continue;
      }
      const v = prop[0] === 'p'
        ? (prop === 'px' ? node.position.x : prop === 'py' ? node.position.y : node.position.z)
        : (prop === 'rx' ? node.rotation.x : prop === 'ry' ? node.rotation.y : node.rotation.z);
      out[base + p] = v;
    }
  }
}

/**
 * 对比两份快照，把「变了」的通道写进 `out`。
 *
 * 阈值 1e-6：层与层之间常会写同一个值（例如归零后又被写回 0），差值为 0 不算「写过」——
 * 否则每一层都会「写」所有它碰过的通道，声明表就没法收窄了。
 */
export function diffInto(
  prev: Float32Array,
  cur: Float32Array,
  nodes: readonly ProbeNodeSpec[],
  out: Set<string>,
): void {
  for (let i = 0; i < nodes.length; i++) {
    const base = i * PROBE_PROPS.length;
    for (let p = 0; p < PROBE_PROPS.length; p++) {
      const a = prev[base + p];
      const b = cur[base + p];
      if (Math.abs(a - b) <= EPS) continue;
      out.add(channelKey(nodes[i].id, PROBE_PROPS[p]));
    }
  }
}

/**
 * 帧尾审计（纯函数）。
 *
 * @param specs 层声明表（顺序无关）
 * @param observed 本帧每层实际写过的通道
 * @param executed 本帧实际执行过的层（`mark` 过的），用于把「没跑过的条件层」排除在 unused 外
 */
export function auditFrame(
  specs: readonly LayerSpec[],
  observed: ReadonlyMap<string, ReadonlySet<string>>,
  executed: readonly string[],
): Pick<ProbeReport, 'overreach' | 'conflicts' | 'unused'> {
  const byId = new Map(specs.map((s) => [s.id, s]));
  const overreach: ProbeViolation[] = [];
  const unused: ProbeViolation[] = [];
  /** channel → 写过它的 override 层 */
  const overrides = new Map<string, string[]>();

  for (const layer of executed) {
    const spec = byId.get(layer);
    const wrote = observed.get(layer);
    if (!wrote) continue;
    if (!spec) {
      // 没登记的层一律算越权（防止「加了层忘了写声明」静默通过）
      for (const ch of wrote) overreach.push({ layer, channel: ch, kind: 'undeclared' });
      continue;
    }
    for (const ch of wrote) {
      const kind = spec.writes[ch];
      if (!kind) {
        overreach.push({ layer, channel: ch, kind: 'undeclared' });
      } else if (kind === 'override') {
        const arr = overrides.get(ch);
        if (arr) arr.push(layer);
        else overrides.set(ch, [layer]);
      }
    }
    for (const [ch, kind] of Object.entries(spec.writes)) {
      if (kind !== 'add') continue;
      if (!wrote.has(ch)) unused.push({ layer, channel: ch, kind: 'add' });
    }
  }

  const conflicts: { channel: string; layers: string[] }[] = [];
  for (const [ch, layers] of overrides) {
    if (layers.length > 1) conflicts.push({ channel: ch, layers });
  }

  return { overreach, conflicts, unused };
}

/** 把「层 × 通道」矩阵导成 markdown，贴文档用（由探针实测生成，不会与代码漂移）。 */
export function matrixMarkdown(
  specs: readonly LayerSpec[],
  nodes: readonly ProbeNodeSpec[],
): string {
  const channels: string[] = [];
  for (const n of nodes) {
    for (const p of PROBE_PROPS) {
      if (n.props && !n.props.includes(p)) continue;
      channels.push(channelKey(n.id, p));
    }
  }
  const head = `| 层 | ${channels.join(' | ')} |`;
  const sep = `|---|${channels.map(() => '---').join('|')}|`;
  const rows = specs.map((s) => {
    const cells = channels.map((ch) => {
      const k = s.writes[ch];
      return k === 'add' ? '+' : k === 'override' ? '=' : k === 'derive' ? '~'
        : k === 'reset' ? '0' : '';
    });
    return `| \`${s.id}\` | ${cells.join(' | ')} |`;
  });
  return [head, sep, ...rows].join('\n');
}
