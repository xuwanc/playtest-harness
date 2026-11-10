/**
 * v9s.72 · 脊柱链的分配数学（纯函数，不依赖 three，方便单测）。
 *
 * 背景：v9s.33 把躯干拆成「腰 / 胸」两段之后，弯折一直只有两级台阶 ——
 * 每一级都是「整块方块绕自己底边转」，两级的接头处背面必然掀开一个楔形缝
 * （v9s.70 只能靠补块去盖）。行业做法（UE 的 `Layered Blend per Bone`）不是补块，
 * 而是让旋转**沿骨链逐级衰减**：`Blend Depth` 让父骨吃一半、子骨吃满，弯折就被摊成
 * 一条曲线。段数一旦 ≥3，每级折角降到 1/3，缝自然收进容差里。
 *
 * 这里只回答两个问题：
 *   1. 俯仰 / 侧倾：总角怎么摊到 N 个关节上（`spineWeights`）
 *   2. 偏航：每级关节的**累计**朝向应该停在哪（`spineYawCurve`）
 *
 * 两条不变量：
 *   - 权重和为 1（总角一分不改，胸的世界朝向 = 总角）
 *   - 累计曲线从 0 单调升到 1（任何一级都不许「转回去」，见 v9s.70 的教训）
 */

/** 段数上限：再多也只是把同一根方块切得更碎，几何上不值得 */
export const MAX_SPINE_SEGMENTS = 4;

/**
 * 段数归一：夹到 [2, MAX]，非法值退回 2。
 *
 * 1 段 = 不分段（`spine.enabled = false` 走的另一条路），这里不接受。
 */
export function normalizeSegments(raw: number | undefined): number {
  if (raw == null || !Number.isFinite(raw)) return 2;
  return Math.min(MAX_SPINE_SEGMENTS, Math.max(2, Math.round(raw)));
}

/**
 * 俯仰 / 侧倾的权重：沿链从 `waist` 线性过渡到 `chest`，再归一化。
 *
 * 为什么不直接均分：腰比胸吃得多是调了很多轮的（0.58 / 0.42，弯腰时折点偏下），
 * 三段必须保持这个倾向 —— 采样同一条直线就是最省事的做法，
 * 而且 N=2 时结果与旧版**逐位相同**（`waist/(waist+chest)`），既有调校不用重调。
 *
 * 例：waist 0.58 / chest 0.42、3 段 → [0.387, 0.333, 0.280]
 */
export function spineWeights(segments: number, waist: number, chest: number): number[] {
  const n = Math.max(1, Math.floor(segments));
  if (n === 1) return [1];
  const w0 = Math.max(0, waist);
  const w1 = Math.max(0, chest);
  const raw: number[] = [];
  for (let i = 0; i < n; i++) raw.push(w0 + ((w1 - w0) * i) / (n - 1));
  const sum = raw.reduce((a, b) => a + b, 0);
  // 两个权重都是 0 属于配置错误：退回均分，至少别让整根躯干僵硬不动
  if (!(sum > 1e-6)) return new Array(n).fill(1 / n);
  return raw.map((v) => v / sum);
}

/**
 * 偏航的**累计**曲线：第 i 级关节的朝向 = 髋 +（总角 − 髋）× out[i]。
 *
 * 用幂曲线 `c(x) = x^p`，取 `p` 让 `c(1/2) = chainBlend`：
 *   - N = 2 时 `c(1/2)` 就是腰段，与 v9s.70 的 `腰 = 髋 + (总角−髋) × chainBlend`
 *     **逐位相同**，两段的调校不用动；
 *   - N = 3 时腰停在 0.42、下胸停在 0.72（chainBlend 0.58 下），每级增量
 *     0.42 / 0.30 / 0.28 —— 单调递减，正是「下盘带转时腰先跟、胸后跟」。
 *
 * 指数 p 由 chainBlend 反解，而不是另开一个「taper」旋钮：多一个旋钮就多一个
 * 「两段和三段看起来不一样」的来源，能少一个是一个。
 */
export function spineYawCurve(segments: number, chainBlend: number): number[] {
  const n = Math.max(1, Math.floor(segments));
  if (n === 1) return [1];
  // 0.1~0.9：太小等于「腰先不转、最后一节猛转」，太大等于「腰一口气转到底」
  const b = Math.min(0.9, Math.max(0.1, chainBlend));
  const p = Math.log(b) / Math.log(0.5);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(i === n - 1 ? 1 : Math.pow((i + 1) / n, p));
  return out;
}
