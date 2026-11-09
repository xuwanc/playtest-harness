#!/usr/bin/env node
/**
 * v9s.43 · 线上预览发布闸门
 * ===================================================================
 * 用户约定（写进 AGENTS.md / README / test-scene-policy.md）：
 *   「每次 agent 完成一次任务都要更新一次线上，贴出链接 方便快速验证」
 * 把这句话固化成一个命令，别靠人记：
 *
 *     npm run publish:preview
 *
 * 做四件事：
 *   1. `npm run build`（tsc + vite build；`SKIP_BUILD=1` 可跳过，供 verify 之后复用）
 *   2. 把 `dist/` 同步到 `/workspace/grass-preview/`：清掉旧 hash 资源与历史独立演示页，
 *      写 `index.html` 与 `main.html`（都指向唯一的**主测试场景**）。
 *   3. 校验 HTML 里引用的 `./assets/*` 全部存在、公网 root / main 均 200。
 *   4. 打印可直接贴给用户的公网链接（含 sharecode）与本次版本 / 产物清单。
 *
 * 服务由 `/workspace/.cloudstudio` 提供（python3 http.server 3000，目录固定），
 * 本脚本只换文件、不换端口，因此公网链接长期不变，别的 agent 拉下 git 后照跑即可。
 *
 * 注意：这只同步**线上静态预览**，不是 GitHub push。
 * push / `gh-commit.mjs --apply` 仍需用户明确通知（见 multi-agent-workflow.md）。
 */
import { execFileSync } from 'node:child_process';
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const PREVIEW_DIR = process.env.PREVIEW_DIR || '/workspace/grass-preview';
const PUBLIC_BASE = (process.env.PUBLIC_BASE || 'https://aac01946d09c8d76e.app.workbuddy.host').replace(/\/$/, '');
const SHARECODE = process.env.SHARECODE || 'NMGIO3HVAK';
const SKIP_BUILD = process.env.SKIP_BUILD === '1';

function fail(msg) {
  console.error(`\n[publish] FAIL: ${msg}\n`);
  process.exit(1);
}

// ---- 1. build ----
if (SKIP_BUILD) {
  console.log('[publish] 1/4 跳过 build（SKIP_BUILD=1）');
} else {
  console.log('[publish] 1/4 npm run build …');
  try {
    execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' });
  } catch {
    fail('npm run build 失败，线上未改动');
  }
}
if (!existsSync(join(DIST, 'index.html'))) fail('dist/index.html 不存在');
const distAssets = join(DIST, 'assets');
if (!existsSync(distAssets)) fail('dist/assets/ 不存在');
const html = readFileSync(join(DIST, 'index.html'), 'utf8');

// ---- 2. 同步到线上目录 ----
console.log(`[publish] 2/4 同步 dist → ${PREVIEW_DIR}`);
mkdirSync(PREVIEW_DIR, { recursive: true });

// 先删历史遗留：旧双页演示页 / 旧主场景 / 所有旧 hash 资源。
// 只删本脚本负责的产物，不动目录里其它文件。
for (const name of ['index.html', 'main.html', 'grass-demo.html']) {
  rmSync(join(PREVIEW_DIR, name), { force: true });
}
const previewAssets = join(PREVIEW_DIR, 'assets');
if (existsSync(previewAssets)) rmSync(previewAssets, { recursive: true, force: true });
mkdirSync(previewAssets, { recursive: true });

const copied = [];
for (const name of readdirSync(distAssets)) {
  cpSync(join(distAssets, name), join(previewAssets, name));
  copied.push(`assets/${name}`);
}
// 单一主测试场景：根地址与 /main.html 都指向同一份最新主场景。
writeFileSync(join(PREVIEW_DIR, 'index.html'), html, 'utf8');
writeFileSync(join(PREVIEW_DIR, 'main.html'), html, 'utf8');

// ---- 3. 校验 ----
console.log('[publish] 3/4 校验资源引用与公网可达性 …');
const refs = [...html.matchAll(/(?:src|href)=["']\.?\/?(assets\/[^"'\s>]+)/g)].map((m) => m[1]);
if (refs.length === 0) fail('HTML 里没有找到 ./assets/* 引用，构建产物可能不对');
for (const ref of refs) {
  if (!existsSync(join(PREVIEW_DIR, ref))) fail(`HTML 引用了不存在的资源: ${ref}`);
}

function httpCode(url) {
  try {
    return execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '12', url],
      { encoding: 'utf8' }).trim();
  } catch {
    return '000';
  }
}
const rootUrl = `${PUBLIC_BASE}/?sharecode=${SHARECODE}`;
const mainUrl = `${PUBLIC_BASE}/main.html?sharecode=${SHARECODE}`;
const codes = { root: httpCode(rootUrl), main: httpCode(mainUrl) };
for (const [k, code] of Object.entries(codes)) {
  if (code !== '200') {
    console.warn(`[publish] WARN: 公网 ${k} 返回 ${code}（文件已同步；服务由 .cloudstudio 提供，稍后重试或检查服务）`);
  }
}

// ---- 4. 打印可粘贴的链接 ----
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
console.log('\n================ 线上预览已更新 ================');
console.log(`版本      : v${pkg.version}`);
console.log(`产物      : ${['index.html', 'main.html', ...copied].join(' / ')}`);
console.log(`资源引用  : ${refs.join(', ')}  ✓ 全部存在`);
console.log(`公网状态  : root=${codes.root}  main=${codes.main}`);
console.log('\n把下面两条链接贴给用户 / 写进任务回复（手机可直接打开）：');
console.log(`  主场景: ${mainUrl}`);
console.log(`  根地址: ${rootUrl}`);
console.log('================================================\n');
