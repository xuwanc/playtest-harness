#!/usr/bin/env node
/**
 * v9s.33 · 按改动范围挑选测试；v9s.34 改用 esbuild 真实模块图。
 *
 * 全量 800+ 例跑一次要几十秒，而大多数改动只碰到一两个模块。这里从 test 文件的
 * import 图反推「谁依赖了被改的文件」，只跑这些；配置 / 夹具 / 核心类型这类
 * 全影响面文件仍然退回全量。
 *
 * 用法：
 *   node scripts/test-affected.mjs            # 按 git 工作区（相对 HEAD）挑并运行
 *   node scripts/test-affected.mjs --list     # 只列不跑
 *   node scripts/test-affected.mjs --base HEAD~1
 *   node scripts/test-affected.mjs --all      # 全量
 *   node scripts/test-affected.mjs -- <file>  # 显式指定变更文件（CI / 手动）
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const listOnly = args.includes('--list');
const runAll = args.includes('--all');
const baseIdx = args.indexOf('--base');
const base = baseIdx >= 0 ? args[baseIdx + 1] : 'HEAD';
const explicit = args.includes('--') ? args.slice(args.indexOf('--') + 1) : [];

function sh(cmd, cmdArgs) {
  try {
    return execFileSync(cmd, cmdArgs, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function changedFiles() {
  if (explicit.length) return explicit;
  const tracked = sh('git', ['diff', '--name-only', '--diff-filter=ACMR', base]);
  const untracked = sh('git', ['ls-files', '--others', '--exclude-standard']);
  const staged = sh('git', ['diff', '--name-only', '--cached', '--diff-filter=ACMR']);
  return [...new Set(
    `${tracked}\n${untracked}\n${staged}`.split('\n').map((s) => s.trim()).filter(Boolean),
  )];
}

const SRC_EXT = /\.(ts|tsx|js|mjs|json)$/;

/** 解析相对 import（含目录 → index.ts），只认项目内路径。 */
function resolveImport(from, spec) {
  if (!spec.startsWith('.')) return null;
  const p = normalize(join(dirname(from), spec));
  const tries = [p, `${p}.ts`, `${p}.tsx`, `${p}.js`, join(p, 'index.ts')];
  for (const t of tries) {
    if (existsSync(t) && statSync(t).isFile()) return t;
  }
  return null;
}

function importsOf(file) {
  const src = readFileSync(file, 'utf8');
  const out = [];
  const re = /(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1] ?? m[2];
    if (!spec) continue;
    const r = resolveImport(file, spec);
    if (r) out.push(r);
  }
  return out;
}

/**
 * v9s.34 · 用 esbuild 的 metafile 建**真实**模块图。
 *
 * 旧版用正则扫 `from '...'`：漏 `export * from`、漏 tsconfig 路径别名、漏
 * 「测试通过 `__harness` 接口隐式依赖实现」这类非 import 依赖，而且目录 → index.ts
 * 的解析是手写的。esbuild 本来就是 vite 的依赖，直接借它的解析器最省事。
 *
 * 返回 `Map<file, Set<dep>>`（绝对路径）；esbuild 不可用时返回 null，调用方回退正则。
 */
async function buildEsbuildGraph(entries) {
  let esbuild;
  try {
    esbuild = await import('esbuild');
  } catch {
    return null;
  }
  try {
    const r = await esbuild.build({
      entryPoints: entries,
      bundle: true,
      write: false,
      // 多入口时必须给 outdir（不会真的写盘，只是满足 esbuild 的参数校验）
      outdir: join(root, '.cache/test-affected'),
      metafile: true,
      format: 'esm',
      platform: 'node',
      target: 'node18',
      logLevel: 'silent',
      // 第三方包不解析（vitest / three / node 内置），只关心项目内文件
      packages: 'external',
      loader: { '.json': 'json' },
    });
    const graph = new Map();
    for (const [file, info] of Object.entries(r.metafile.inputs)) {
      const abs = resolve(root, file);
      const deps = new Set();
      for (const imp of info.imports ?? []) {
        if (imp.external) continue;
        deps.add(resolve(root, imp.path));
      }
      graph.set(abs, deps);
    }
    return graph;
  } catch {
    return null;
  }
}

/** 收集一个入口文件闭包内的所有项目文件（优先真实模块图，缺失时用正则兜底）。 */
function closure(entry, graph) {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    if (!SRC_EXT.test(f)) continue;
    const deps = graph?.get(f);
    if (deps) {
      for (const dep of deps) stack.push(dep);
      continue;
    }
    for (const dep of importsOf(f)) stack.push(dep);
  }
  return seen;
}

const testsDir = join(root, 'tests');
const testFiles = readdirSync(testsDir)
  .filter((f) => f.endsWith('.test.ts'))
  .map((f) => join(testsDir, f));

// --graph：对比「正则解析」与「esbuild 真实模块图」，把漏检的依赖打出来（自检用）
if (args.includes('--graph')) {
  const graph = await buildEsbuildGraph(testFiles);
  if (!graph) {
    console.log('[test:affected] esbuild 不可用，无法对比');
    process.exit(1);
  }
  let diffs = 0;
  for (const t of testFiles) {
    const real = closure(t, graph);
    const naive = closure(t, null);
    const missed = [...real].filter((f) => !naive.has(f));
    if (missed.length) {
      diffs++;
      console.log(`  ! ${t.replace(`${root}/`, '')} 正则漏掉 ${missed.length} 个依赖`);
      for (const m of missed.slice(0, 3)) console.log(`      - ${m.replace(`${root}/`, '')}`);
    }
  }
  console.log(`[test:affected] 图自检完成：${testFiles.length} 个测试文件，${diffs} 个存在漏检`);
  process.exit(0);
}

const changed = changedFiles().map((f) => resolve(root, f));
const changedSet = new Set(changed);

if (runAll || changed.length === 0) {
  const files = testFiles.map((f) => f.replace(`${root}/`, ''));
  if (changed.length === 0) {
    console.log('[test:affected] 工作区没有改动 → 全量');
  }
  run(files);
  process.exit(0);
}

// 改动「全影响面」文件 → 全量
const GLOBAL = [
  join(root, 'config/game.json'),
  join(root, 'tests/helpers.ts'),
  join(root, 'tests/rig-nodes.ts'),
  join(root, 'tests/fixtures.ts'),
];
const hitGlobal = changed.some((f) => GLOBAL.includes(f));
if (hitGlobal) {
  console.log('[test:affected] 命中全局夹具 / 配置 → 全量');
  run(testFiles.map((f) => f.replace(`${root}/`, '')));
  process.exit(0);
}

const graph = await buildEsbuildGraph(testFiles);
if (!graph) {
  console.log('[test:affected] esbuild 模块图不可用 → 回退正则解析（可能漏依赖）');
} else {
  console.log(`[test:affected] 模块图：esbuild（${graph.size} 个文件）`);
}
const deps = new Map(testFiles.map((f) => [f, closure(f, graph)]));
const picked = new Set();
for (const t of testFiles) {
  if (changedSet.has(t)) { picked.add(t); continue; }
  const set = deps.get(t);
  if (changed.some((c) => set.has(c))) picked.add(t);
}

// Core 改动额外带上可移植性用例（它专门守边界 / 快照）
if (changed.some((f) => f.includes('/src/core/'))) {
  const portable = join(testsDir, 'portable.test.ts');
  if (existsSync(portable)) picked.add(portable);
}

if (picked.size === 0) {
  console.log('[test:affected] 没有测试依赖这些改动（可能只动了文档 / 样式）。');
  console.log('  改动：', changed.map((f) => f.replace(`${root}/`, '')).join(', '));
  process.exit(0);
}

// 选中的超过 65% 就不如全量（启动开销摊薄）
if (picked.size / testFiles.length > 0.65) {
  console.log(`[test:affected] 命中 ${picked.size}/${testFiles.length} → 直接全量`);
  run(testFiles.map((f) => f.replace(`${root}/`, '')));
  process.exit(0);
}

const files = [...picked].sort().map((f) => f.replace(`${root}/`, ''));
console.log(`[test:affected] 改动 ${changed.length} 个文件 → 选中 ${files.length}/${testFiles.length} 个测试文件`);
for (const f of changed) console.log('  ~', f.replace(`${root}/`, ''));
run(files);

function run(files) {
  console.log('[test:affected] 运行：', files.join(' '));
  if (listOnly) return;
  const r = spawnSync('npx', ['vitest', 'run', ...files], { cwd: root, stdio: 'inherit' });
  process.exit(r.status ?? 1);
}
