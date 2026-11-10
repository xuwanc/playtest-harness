#!/usr/bin/env node
/**
 * 文档事实守卫（2026-11-10 新增）。
 *
 * 为什么需要：`check-docs.mjs` 只管「README ≤100 行 / 单文档 ≤300 行 / 链接可达 /
 * INDEX 登记」，全是**结构**检查。但 README / CURRENT / INDEX / verification 里还写死了
 * 「N 文件 / M 例」「N 项 smoke」「N 份文档」「vX.Y.Z」这类**事实**——每加一批用例就漂移，
 * 而 docs:check 仍然 PASS。本仓库实测四份文档同时给出 876 / 1101 / 1116 / 1205 四个用例数，
 * smoke 项数有 16 / 53 / 70 三个版本，没人发现。
 *
 * 做法：真值全部**现场采集**，脚本里不硬编码任何期望数字；
 * 再按「事实锚点」扫描文档，数字对不上就报错，`--fix` 直接回写真值。
 * 这样以后每次 `npm run verify` 都会拦住漂移，而不是靠人记得改文档。
 *
 *   node scripts/check-facts.mjs             # 只校验（退出码 1 = 有漂移）
 *   node scripts/check-facts.mjs --fix       # 回写真值后再校验
 *   node scripts/check-facts.mjs --json      # 输出真值 JSON（给报告 / CI 用）
 *
 * 零依赖：只用 node 内置模块 + 已有的 vitest（list 不执行用例，秒级）。
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const FIX = process.argv.includes('--fix');
const JSON_OUT = process.argv.includes('--json');

/* ---------------- 1. 现场采集真值（不硬编码） ---------------- */

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/** vitest list 只枚举用例、不执行；比 run 快得多，且数字与 CI 报告完全一致。 */
function vitestCounts() {
  const r = spawnSync('npx', ['vitest', 'list', '--json'], {
    cwd: ROOT, encoding: 'utf8', timeout: 180000, maxBuffer: 64 * 1024 * 1024,
  });
  const out = (r.stdout || '').trim();
  const s = out.indexOf('[');
  const e = out.lastIndexOf(']');
  if (s < 0 || e <= s) {
    throw new Error('无法解析 npx vitest list --json：' + (r.stderr || out).slice(0, 300));
  }
  const arr = JSON.parse(out.slice(s, e + 1));
  return { tests: arr.length, files: new Set(arr.map((x) => x.file)).size };
}

/** smoke.py 的每个 `check(...)` 是一项自检；排除 `def check(...)` 定义本身。 */
function smokeCount() {
  const src = readFileSync(join(ROOT, 'tools', 'smoke.py'), 'utf8');
  return src.split('\n').filter(
    (line) => /^\s*check\s*\(/.test(line) && !/\bdef\s+check\b/.test(line),
  ).length;
}

function walkMd(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMd(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** 与 check-docs.mjs 保持同一口径：split('\n').length（wc -l 会少算末行无换行的情况）。 */
function readmeLines() {
  return readFileSync(join(ROOT, 'README.md'), 'utf8').split('\n').length;
}

const vt = vitestCounts();
const facts = {
  version: pkg.version,
  tests: vt.tests,
  files: vt.files,
  smoke: smokeCount(),
  docs: walkMd(join(ROOT, 'docs')).length,
  readmeLines: readmeLines(),
  coreFiles: readdirSync(join(ROOT, 'src', 'core')).filter((f) => f.endsWith('.ts')).length,
};

if (JSON_OUT) {
  console.log(JSON.stringify(facts, null, 2));
  process.exit(0);
}

/* ---------------- 2. 事实锚点 ----------------
 * 每条规则限定文件，避免扫到正文里的历史数字（例如 workflow.md 里的 v0.9.76）。
 * re 必须带 g；build() 生成替换串；got()/want() 给出捕获值与真值用于比对。
 */
const RULES = [
  {
    name: '用例数 / 文件数',
    files: ['README.md', 'docs/state/CURRENT.md', 'docs/INDEX.md', 'docs/systems/verification.md'],
    re: /(\d+)\s*文件\s*\/\s*(\d+)\s*例/g,
    build: (f) => `${f.files} 文件 / ${f.tests} 例`,
    got: (m) => [Number(m[1]), Number(m[2])],
    want: (f) => [f.files, f.tests],
  },
  {
    name: '用例数（个用例）',
    files: ['docs/systems/known-limits.md', 'docs/systems/verification.md'],
    re: /(\d+)\s*个用例/g,
    build: (f) => `${f.tests} 个用例`,
    got: (m) => [Number(m[1])],
    want: (f) => [f.tests],
  },
  {
    name: 'smoke 自检项数（项自检 / 项画面层）',
    files: ['README.md', 'docs/INDEX.md', 'docs/systems/verification.md'],
    re: /(\d+)\s*项(?:自检|画面层)/g,
    build: (f, m) => `${f.smoke} 项${m[0].includes('自检') ? '自检' : '画面层'}`,
    got: (m) => [Number(m[1])],
    want: (f) => [f.smoke],
  },
  {
    // INDEX 的工具表里写成「线上自检（53 项）」，数字在括号里，与上一条顺序相反。
    name: 'smoke 自检项数（自检（N 项））',
    files: ['docs/INDEX.md', 'README.md', 'docs/state/CURRENT.md'],
    re: /自检（(\d+)\s*项）/g,
    build: (f) => `自检（${f.smoke} 项）`,
    got: (m) => [Number(m[1])],
    want: (f) => [f.smoke],
  },
  {
    // 精确锚点：只匹配「N/N PASS」与「**N/N**」这两种汇总写法。
    // 早期用宽松的 N/N 正则误伤了「手动第 23/24 步」「progress=0/1」这类非汇总数字。
    name: 'smoke 通过数（CURRENT）',
    files: ['docs/state/CURRENT.md'],
    re: /(\d+)\s*\/\s*(\d+)\s*PASS/g,
    build: (f) => `${f.smoke}/${f.smoke} PASS`,
    got: (m) => [Number(m[1]), Number(m[2])],
    want: (f) => [f.smoke, f.smoke],
  },
  {
    name: 'smoke 通过数（verification）',
    files: ['docs/systems/verification.md'],
    re: /\*\*(\d+)\s*\/\s*(\d+)\*\*/g,
    build: (f) => `**${f.smoke}/${f.smoke}**`,
    got: (m) => [Number(m[1]), Number(m[2])],
    want: (f) => [f.smoke, f.smoke],
  },
  {
    name: '文档份数',
    files: ['docs/state/CURRENT.md'],
    re: /(\d+)\s*份文档/g,
    build: (f) => `${f.docs} 份文档`,
    got: (m) => [Number(m[1])],
    want: (f) => [f.docs],
  },
  {
    name: 'README 行数',
    files: ['docs/state/CURRENT.md'],
    re: /README\s*(\d+)\s*行/g,
    build: (f) => `README ${f.readmeLines} 行`,
    got: (m) => [Number(m[1])],
    want: (f) => [f.readmeLines],
  },
  {
    name: 'Core 顶层文件数',
    files: ['docs/systems/verification.md'],
    re: /(\d+)\s*个文件/g,
    build: (f) => `${f.coreFiles} 个文件`,
    got: (m) => [Number(m[1])],
    want: (f) => [f.coreFiles],
  },
  {
    name: '当前版本（README 首行）',
    files: ['README.md'],
    re: /当前版本\s*\*\*v(\d+\.\d+\.\d+)\*\*/g,
    build: (f) => `当前版本 **v${f.version}**`,
    got: (m) => [m[1]],
    want: (f) => [f.version],
  },
  {
    name: 'package.json 版本（CURRENT 表格）',
    files: ['docs/state/CURRENT.md'],
    re: /`package\.json` 版本 \| `(\d+\.\d+\.\d+)`/g,
    build: (f) => `\`package.json\` 版本 | \`${f.version}\``,
    got: (m) => [m[1]],
    want: (f) => [f.version],
  },
];

const eq = (a, b) => a.length === b.length && a.every((v, i) => String(v) === String(b[i]));
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

const drifts = [];
let anchors = 0;
let fixed = 0;

for (const rule of RULES) {
  for (const rel of rule.files) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    const original = readFileSync(abs, 'utf8');
    let text = original;
    let m;
    const re = new RegExp(rule.re.source, rule.re.flags);
    while ((m = re.exec(text))) {
      anchors++;
      const got = rule.got(m);
      const want = rule.want(facts);
      if (eq(got, want)) continue;
      const loc = `${rel}:${lineOf(text, m.index)}`;
      drifts.push(`  ${loc}  ${rule.name}：写了 ${got.join('/')}，真值 ${want.join('/')}`);
      if (FIX) {
        const repl = rule.build(facts, m);
        // 逐条替换，避免一次 replace 影响后续 match 的 index
        text = text.slice(0, m.index) + repl + text.slice(m.index + m[0].length);
        re.lastIndex = m.index + repl.length;
        fixed++;
      }
    }
    if (FIX && text !== original) writeFileSync(abs, text, 'utf8');
  }
}

/* ---------------- 3. 输出 ---------------- */
const summary = `版本 ${facts.version}；${facts.tests} 例 / ${facts.files} 文件；`
  + `smoke ${facts.smoke}；docs ${facts.docs}；README ${facts.readmeLines} 行；`
  + `Core ${facts.coreFiles} 文件；${anchors} 处锚点`;

if (FIX) {
  console.log(`[facts] 已回写 ${fixed} 处 → ${summary}`);
  if (fixed && drifts.length > fixed) {
    // 理论上不会发生；留一条防御
    console.warn('[facts] 注意：仍有未能自动替换的漂移');
  }
} else if (drifts.length) {
  console.error(`[facts] FAIL — ${drifts.length} 处文档数字与真值不符（真值：${summary}）：`);
  for (const d of drifts) console.error(d);
  console.error('  修法：node scripts/check-facts.mjs --fix（或 npm run docs:facts:fix）');
  process.exit(1);
} else {
  console.log(`[facts] PASS — ${summary}，全部一致`);
}
