/**
 * v9s.25 · 姿态剪辑（PoseClip）—— 技能动作的**数据格式**。
 *
 * 为什么不是「把骨骼旋转烘焙成关键帧」：
 *  - 体素角色没有蒙皮，骨骼本身就是程序生成的；同一段动作要能套到大剑 / 短剑 / 双剑上，
 *    烘焙后的骨头角度换个武器长度就不对了；
 *  - 后续还要接四足 / 蜘蛛等不同骨架（见 rig 控制层设计），骨骼名与数量都会变。
 *
 * 所以这里存的是**语义通道**（躯干拧了多少、骨盆往哪偏、剑身离水平面多少度），
 * 由各骨架自己的 solver 翻译成骨骼输出。人类体素 rig 是一个 solver，
 * 将来的四足 rig 是另一个 solver，读的是同一份数据。
 *
 * 数据形状：
 * ```json
 * {
 *   "kind": "right-left",
 *   "lead": "R",
 *   "keys": [
 *     { "t": 0, "ease": "in", "pose": { "bodyYaw": 0.85, "bladePitch": 0.30, ... } },
 *     { "t": 1, "pose": { "bodyYaw": -0.95, "bladePitch": -0.05, ... } }
 *   ]
 * }
 * ```
 * - `t` 归一化 0..1，**不是**秒：起手 / 命中 / 收势的时间由技能 timing 决定，
 *   同一段动作可以配 0.35s 的快刀或 1.2s 的重劈；
 * - `ease` 描述「从本帧到下一帧」的缓动，缺省 linear（挥击要冲击力，默认不加缓动）；
 * - 通道缺省视为 0；某个通道只在部分帧出现时，用最近一帧的值补齐（作者少写不炸）。
 *
 * 纯函数、零依赖、无 THREE：可直接单测采样与校验，也能逐字节移植到 C#。
 */

export const POSE_CHANNELS = [
  /** 上身相对骨盆的扭转（+ = 转向角色右侧） */
  'bodyYaw',
  /** 上身前后倾（+ = 前压） */
  'bodyPitch',
  /** 上身侧倾（+ = 向角色左侧倒） */
  'bodyRoll',
  /** 骨盆左右（+ = 右） */
  'pelvisX',
  /** 骨盆前后（+ = 前） */
  'pelvisZ',
  /** 主手根关节俯仰（负 = 抬到身前 / 头顶） */
  'armPitch',
  /** 主手根关节偏航（正 = 向角色右侧） */
  'armYaw',
  /** 主手根关节滚转（正 = 手末端向角色右侧外张） */
  'armRoll',
  /** 肘（负 = 向前折） */
  'elbow',
  /**
   * 剑身仰角（rad，0 = 水平，正 = 剑尖朝上）。
   *
   * 这是整层的核心：作者只关心「剑应该是平的 / 朝上 / 朝下」，
   * 挂点相对手臂要转多少度由 rig 反解（`π/2 - 仰角 - 手臂链俯仰`）。
   * 旧版给的是「挂点相对前臂的角」，手臂一抬到 −80°，58° 挂点就变成剑尖竖直朝上 ——
   * 用户看到的「前两击剑尖都在头顶」就是这么来的。
   */
  'bladePitch',
  /**
   * 副手（主挥手之外的那只手）单独覆盖；缺省时由主手镜像推导。
   *
   * v9s.26：`lead=L` 时它指向右手 —— 双持段 2「左手挥、右手往右后方收」写的就是这组。
   * 「往同侧后方收」= pitch 正（后摆）+ yaw 指向自己那侧 + elbow 负（屈肘），
   * 与大剑的双手握持（副手由 IK 拉回柄上）不冲突。
   */
  'armLPitch',
  'armLYaw',
  'armLRoll',
  'elbowL',
  /**
   * v9s.26 · 整体转体（rad）：整个人绕世界 Y 轴带转，与 bodyYaw（腰椎扭转）叠加。
   *
   * 只拧腰椎到不了 135°：体素方块人拧过 ±0.9 rad 后头会甩到背后、副手也够不到柄。
   * 真实的大幅度横扫是「脚掌碾地 + 整个人带转」完成的，所以幅度拆成两层：
   *   bodyYaw  = 上身相对骨盆的拧（造型细节，±0.9 内）
   *   rootYaw  = 整个人绕重心的转（幅度主力，可到 ±1.2）
   * 两者相加才是剑尖真正扫过的世界角度。
   */
  'rootYaw',
  /**
   * v9s.26 · 副手武器挂点仰角（rad，0 = 水平）。语义同 bladePitch，但作用于**另一只手**。
   *
   * 双持「武器展开」时两把剑都要能被单独摆角度；剑盾「盾猛顶」时盾面要朝前
   * （盾不是刃，用同一套「挂点反解」把盾牌从竖直翻到正对前方）。
   * null（缺省）= 不接管，沿用武器默认挂点。
   */
  'bladePitchOff',
  /**
   * v9s.29 · 刃面滚转（rad，绕刀身长轴）。
   *
   * 为什么需要它：刀身在模型里是「薄在 X、宽在 Z」，挂点把刀身放平之后，
   * 宽面法线正好指向**挥击方向** —— 于是横扫时是拿刀身侧面在拍（用户反馈
   * 「现在刀都是以刀侧面在扫」）。绕长轴滚 90° 让刃口（模型 +Z 侧的亮边）
   * 朝向运动方向，才是「切」。
   *
   * 0 = 宽面朝侧面（待机 / 举刀时读得清轮廓），±1.2 ≈ 刃口朝挥击方向。
   * 正负跟着扫击方向走：向右扫取 +，向左扫取 −。不影响刀尖指向，只改刃口朝向。
   */
  'bladeTwist',
  /** v9s.29 · 副手刃面滚转（语义同 bladeTwist，双持的两把刀可以各自给角）。 */
  'bladeTwistOff',
  /**
   * v9s.29 · 刃身相对小臂的水平外撇（rad，+ = 刀尖偏向角色右侧）。
   *
   * 用户反馈「刀不要和小臂完全平行太直了」：只靠挂点俯仰时，刀身与小臂共线，
   * 读起来像「手臂加长了一截」。真实的握刀手腕是外撇的，刀和小臂约有 10~20° 夹角。
   * 这是一个**相对量**（不是世界朝向），所以不会影响 bladePitch 的语义。
   */
  'bladeYaw',
  /** v9s.29 · 副手刃身水平外撇（+ = 刀尖偏向角色右侧，双持时通常给与主手同号）。 */
  'bladeYawOff',
] as const;

export type PoseChannel = (typeof POSE_CHANNELS)[number];

/** 一段完整姿态（通道子集）。 */
export type PoseFrame = Partial<Record<PoseChannel, number>>;

export type PoseEase = 'linear' | 'in' | 'out' | 'inOut';

export type PoseKey = {
  /** 归一化时间 0..1 */
  t: number;
  /** 本帧 → 下一帧的缓动，缺省 linear */
  ease?: PoseEase;
  pose: PoseFrame;
};

/**
 * v9s.26 · 剪辑级「原地整圈旋转」。
 *
 * 为什么不写成 `rootYaw` 通道：通道按**挥击曲线** `swing = −1→+1→0` 采样，
 * 收势时会回摆，转到一半又倒回去；而「转一圈」需要按**攻击进度**单调推进到 2π，
 * 结束时 2π ≡ 0 正好回到原朝向，不留残余。所以它是剪辑级元数据，不是通道。
 *
 * 这也是「表现层带转 ≠ 判定范围」的边界：Core 的攻击扇形 / 索敌完全不看它，
 * 只改角色朝向的观感；要扩判定范围得另配 Core 参数。
 */
export type PoseSpin = {
  /** 转几圈：1 = 原地一整圈，−1 = 反向一整圈，0.5 = 半圈 */
  turns: number;
  /**
   * 在 attackProgress 达到多少时转满（0..1，缺省 1）。
   *
   * 连击的 `cancelWindow` 会在 recovery 过半就接下一段，实测段内 progress 最多只到
   * ~0.71 —— 若按线性进度转，永远转不满一圈就被打断。把 span 设成 0.6 可让转体
   * 在换段前完成，之后一直停在 2π ≡ 0（正对前方），收招与换段都不甩头。
   */
  span?: number;
  /** 沿 attackProgress/span 的缓动，缺省 linear（inOut 起停更柔和） */
  ease?: PoseEase;
};

export type PoseClip = {
  /** 语义类型，调试 / 验收读（right-left / left-right / overhead / spin / bash / 任意字符串） */
  kind?: string;
  /** 作者备注（不影响采样，方便以后几十种技能靠数据自查） */
  note?: string;
  /** 主挥手：R = 右手（默认），L = 左手（双剑第二段） */
  lead?: 'R' | 'L';
  /** v9s.26：整段动作的整体转体（按 attackProgress 单调，不参与 key 采样） */
  spin?: PoseSpin;
  keys: PoseKey[];
};

/** 采样结果：每个通道都有值（缺省 0），调用方不用再判空。 */
export type PoseSample = Record<PoseChannel, number>;

const EPS = 1e-9;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function clamp01(v: number): number {
  return clamp(Number.isFinite(v) ? v : 0, 0, 1);
}

function easeValue(kind: PoseEase, t: number): number {
  const k = clamp01(t);
  if (kind === 'in') return k * k;
  if (kind === 'out') return 1 - (1 - k) * (1 - k);
  if (kind === 'inOut') return k * k * (3 - 2 * k);
  return k;
}

function emptySample(): PoseSample {
  const out = {} as PoseSample;
  for (const c of POSE_CHANNELS) out[c] = 0;
  return out;
}

/**
 * 在归一化时间 t 处采样一条剪辑。
 *
 * 段定位用「最后一个 t <= time 的帧」，因此 t 超出 0..1 会夹到两端，
 * 重复时间戳（作者手滑）也不会除零 —— 但仍然建议用 `validatePoseClip` 拦掉。
 */
export function samplePoseClip(clip: PoseClip, t: number): PoseSample {
  const out = emptySample();
  const keys = clip?.keys ?? [];
  if (keys.length === 0) return out;
  const time = clamp01(t);
  let i = 0;
  while (i < keys.length - 1 && time > keys[i + 1].t + EPS) i += 1;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const span = b.t - a.t;
  const raw = span > EPS ? (time - a.t) / span : 0;
  const u = easeValue(a.ease ?? 'linear', raw);
  for (const c of POSE_CHANNELS) {
    const va = a.pose[c] ?? b.pose[c] ?? 0;
    const vb = b.pose[c] ?? a.pose[c] ?? 0;
    out[c] = va + (vb - va) * u;
  }
  return out;
}

/**
 * v9s.26 · 采样整圈旋转，返回本帧应叠加的**世界 Y 轴角度**（rad）。
 *
 * @param progress 攻击进度 0..1（单调），与挥击曲线 swing 无关。
 * 返回 `turns · 2π · ease(progress)`：进度 1 时正好是整圈（2π ≡ 0），
 * 收招后 rootYaw 归零不会出现「转回去」的甩头。
 */
export function sampleSpin(clip: PoseClip | null | undefined, progress: number): number {
  const spin = clip?.spin;
  if (!spin || !Number.isFinite(spin.turns) || spin.turns === 0) return 0;
  const ease = spin.ease ?? 'linear';
  // span 把「转到满」的时刻提前到换段之前；超出后 clamp 到 1，角度停在 turns·2π ≡ 0。
  const span = Number.isFinite(spin.span) && (spin.span as number) > 0
    ? Math.min(1, spin.span as number) : 1;
  const u = easeValue(ease, progress / span);
  return spin.turns * Math.PI * 2 * u;
}

/**
 * 校验一条剪辑，返回错误描述（空数组 = 合法）。
 *
 * 放在 Core 侧的纯函数里，`portable.test.ts` 会把 game.json 里全部剪辑过一遍：
 * 加技能时写错时间戳 / 写成字符串 / 忘了 pose，测试直接报出来，而不是上线后动作诡异。
 */
export function validatePoseClip(clip: PoseClip): string[] {
  const errs: string[] = [];
  if (!clip || !Array.isArray(clip.keys) || clip.keys.length === 0) {
    return ['keys 为空'];
  }
  if (clip.spin) {
    if (typeof clip.spin.turns !== 'number' || !Number.isFinite(clip.spin.turns)) {
      errs.push('spin.turns 不是有限数');
    } else if (Math.abs(clip.spin.turns) > 4) {
      errs.push(`spin.turns=${clip.spin.turns} 过大（|turns| ≤ 4）`);
    }
    if (clip.spin.ease && !['linear', 'in', 'out', 'inOut'].includes(clip.spin.ease)) {
      errs.push(`spin.ease=${clip.spin.ease} 非法`);
    }
    if (clip.spin.span !== undefined
      && (typeof clip.spin.span !== 'number' || !Number.isFinite(clip.spin.span)
        || clip.spin.span <= 0 || clip.spin.span > 1)) {
      errs.push(`spin.span=${clip.spin.span} 超出 (0, 1]`);
    }
  }
  let prev = -Infinity;
  clip.keys.forEach((k, i) => {
    if (typeof k.t !== 'number' || !Number.isFinite(k.t)) errs.push(`keys[${i}].t 不是有限数`);
    else if (k.t < 0 || k.t > 1) errs.push(`keys[${i}].t=${k.t} 超出 0..1`);
    else if (k.t <= prev) errs.push(`keys[${i}].t=${k.t} 未严格递增`);
    if (k.t > prev) prev = k.t;
    if (!k.pose || typeof k.pose !== 'object') errs.push(`keys[${i}].pose 缺失`);
    else {
      for (const [name, v] of Object.entries(k.pose)) {
        if (!(POSE_CHANNELS as readonly string[]).includes(name)) {
          errs.push(`keys[${i}].pose.${name} 不是合法通道`);
        } else if (typeof v !== 'number' || !Number.isFinite(v)) {
          errs.push(`keys[${i}].pose.${name} 不是有限数`);
        }
      }
    }
    if (k.ease && !['linear', 'in', 'out', 'inOut'].includes(k.ease)) {
      errs.push(`keys[${i}].ease=${k.ease} 非法`);
    }
  });
  return errs;
}

/** 一条剪辑是否覆盖了某个通道（调试面板 / 验收用来判断数据是否真的在驱动）。 */
export function clipHasChannel(clip: PoseClip, channel: PoseChannel): boolean {
  return (clip?.keys ?? []).some((k) => typeof k.pose[channel] === 'number');
}
