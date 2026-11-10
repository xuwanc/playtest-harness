#!/usr/bin/env node
// 文档规范守卫：README 行数 / 单文件 300 行 / 相对链接存在 / 旧路径引用。
// 只做机械检查，不判断内容质量 —— 内容规则见 docs/decisions/ADR-001-docs-layout.md。
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const errors = [];
const warns = [];

function lineCount(p) {
  return readFileSync(p, 'utf8').split('\n').length;
}

// 1. README ≤ 100 行
const readme = join(ROOT, 'README.md');
if (!existsSync(readme)) errors.push('README.md 不存在');
else {
  const n = lineCount(readme);
  if (n > 100) errors.push(`README.md ${n} 行（上限 100）—— 变更记录请写 docs/journal/`);
}

// 2. 收集 docs/**/*.md
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}
const docsDir = join(ROOT, 'docs');
const mdFiles = existsSync(docsDir) ? walk(docsDir) : [];

// 3. 单文件 ≤ 300 行
for (const f of mdFiles) {
  const n = lineCount(f);
  if (n > 300) errors.push(`${relative(ROOT, f)} ${n} 行（上限 300，请拆分并在 docs/INDEX.md 登记）`);
}

// 4. 相对链接存在 + 锚点文件存在
const linkRe = /\[[^\]]*\]\(([^)\s]+)\)/g;
const RETIRED = ['tech-map.md', 'animation-guidelines.md', 'sparring-fighters.md'];
for (const f of [readme, ...mdFiles]) {
  const txt = readFileSync(f, 'utf8');
  let m;
  while ((m = linkRe.exec(txt))) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    if (target.startsWith('tel:')) continue;
    const clean = target.split('#')[0];
    if (!clean) continue;
    const abs = resolve(dirname(f), clean);
    if (!existsSync(abs)) {
      errors.push(`${relative(ROOT, f)} → 链接目标不存在: ${target}`);
    }
    // 旧路径（仅当作为链接目标时才算错；journal 正文里的历史提及不算）
    for (const r of RETIRED) {
      if (clean.endsWith('/' + r) || clean === r) {
        errors.push(`${relative(ROOT, f)} → 链接指向已迁移的旧文档: ${target}（改指 docs/systems/ 或 docs/INDEX.md）`);
      }
    }
  }
}

// 4b. 反引号里引用的 tools/ scripts/ 路径必须真实存在。
// 链接检查只看 [](...)；文档表格大量用 `tools/xxx.py` 反引号，路径写错不触发任何检查
// （实测 INDEX / conventions 写 tools/sweep.py、risk-history 写 tools/sweep-sample.mjs，
//  实际文件是 tools/sweep_sample.py）。限定 tools/ 与 scripts/ 两类，避开 shots/ 等
// 有意不入库的截图路径。
const codePathRe = /`(?:tools|scripts)\/[A-Za-z0-9_./-]+\.(?:py|mjs|sh|js|ts|json)`/g;
for (const f of [readme, ...mdFiles]) {
  const txt = readFileSync(f, 'utf8');
  let m;
  while ((m = codePathRe.exec(txt))) {
    const p = m[0].slice(1, -1);
    if (!existsSync(join(ROOT, p))) {
      errors.push(`${relative(ROOT, f)} → 反引号引用的工具路径不存在: ${p}`);
    }
  }
}

// 5. INDEX 必须存在且登记了每个 systems 文档
const index = join(docsDir, 'INDEX.md');
if (!existsSync(index)) errors.push('docs/INDEX.md 不存在');
else {
  const idx = readFileSync(index, 'utf8');
  for (const f of mdFiles) {
    const rel = relative(docsDir, f).split('\\').join('/');
    if (rel === 'INDEX.md' || rel.startsWith('journal/') || rel === 'risk-review.md') continue;
    if (!idx.includes(rel)) warns.push(`docs/INDEX.md 未登记: ${rel}`);
  }
}

// 输出
for (const w of warns) console.warn('  [warn] ' + w);
if (errors.length) {
  console.error(`[docs] FAIL — ${errors.length} 项：`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`[docs] PASS — README ${lineCount(readme)} 行；${mdFiles.length} 份文档，单份均 ≤300 行；链接 / 工具路径全部可达。`);
