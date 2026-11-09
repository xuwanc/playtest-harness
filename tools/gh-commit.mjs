#!/usr/bin/env node
/**
 * v9s.39 · 多 agent 的 REST 提交网关（只写远端，不依赖 git push）。
 *
 * 为什么需要它：沙箱里 `github.com:443` 不通，标准 `git clone/push` 走不了；
 * 但 `api.github.com` 可达。所以提交走 GitHub Git Data API：
 *
 *   GET  /git/ref/heads/<branch>      取当前 HEAD（乐观锁基线）
 *   GET  /git/commits/<baseSha>       取基线 tree
 *   POST /git/blobs                   每个变更文件一个 blob
 *   POST /git/trees  (base_tree)      基于基线 tree 叠加，天然只改自己那几个文件
 *   POST /git/commits                 生成提交
 *   PATCH /git/refs/heads/<branch>    带旧 SHA 推进引用（force:false）
 *
 * 并发安全：PATCH 用 force:false，若另一个 agent 已经推进了引用，服务端返回
 * 409/422 → 重新读取基线并重放整条链（最多 --retries 次）。这样多个 agent
 * 同时提交时不会互相覆盖，只会「后到的自动 rebase 到最新 tree 上」。
 *
 * 安全性：
 *  - **默认 --dry-run**：只打印将要提交的文件与基线，绝不写远端。
 *    真实写入必须显式加 --apply。
 *  - 令牌只从环境变量 GITHUB_TOKEN / GH_TOKEN_FILE 或 ~/.config/playtest-harness/gh-token
 *    读取（后者强制 600 权限），绝不写进仓库、命令行参数或日志。
 *  - .gitignore 已排除 .gh_pat* / gh-token*，但仍建议令牌放在仓库目录之外。
 *
 * 用法：
 *   node tools/gh-commit.mjs                       # dry-run：列出待提交文件与基线
 *   node tools/gh-commit.mjs --list               # 只列文件
 *   node tools/gh-commit.mjs --apply -m "feat: grass" --branch main
 *   node tools/gh-commit.mjs --apply -m "..." --path src/core/grass.ts --path tests/grass.test.ts
 *   GITHUB_TOKEN=xxx node tools/gh-commit.mjs --apply -m "..."
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const API = 'https://api.github.com';

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : fallback;
}
function flag(name) { return process.argv.includes(name); }

const OWNER_REPO = arg('--repo', 'xuwanc/playtest-harness');
const BRANCH = arg('--branch', 'main');
const MESSAGE = arg('-m', arg('--message', 'chore: agent commit (via REST gateway)'));
const RETRIES = Math.max(1, Math.min(10, Number(arg('--retries', '3'))));
const APPLY = flag('--apply');
const LIST_ONLY = flag('--list');
const explicitPaths = process.argv
  .filter((_, i) => i > 0 && process.argv[i - 1] === '--path')
  .map((p) => relative(ROOT, resolve(ROOT, p)).split('\\').join('/'));

function readToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN.trim();
  const candidates = [
    process.env.GH_TOKEN_FILE,
    join(homedir(), '.config', 'playtest-harness', 'gh-token'),
  ].filter(Boolean);
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const mode = statSync(p).mode & 0o077;
    if (mode !== 0) throw new Error(`令牌文件权限过宽：${p}（请 chmod 600）`);
    const t = readFileSync(p, 'utf8').trim();
    if (t) return t;
  }
  throw new Error(
    '未找到令牌：设置环境变量 GITHUB_TOKEN，或写入 ~/.config/playtest-harness/gh-token（chmod 600）。' +
    ' 不要把令牌放进仓库目录。',
  );
}

/** 用 git 索引拿「本工作区相对基线」的变更文件，自动遵守 .gitignore。 */
function changedFiles() {
  if (explicitPaths.length > 0) return explicitPaths;
  const out = execFileSync(
    'git',
    ['ls-files', '--modified', '--others', '--exclude-standard', '--deleted'],
    { cwd: ROOT, encoding: 'utf8' },
  );
  // --modified 与 --deleted 可能对同一路径重复输出，去重后再进 tree（重复 path 会被 API 拒）
  return [...new Set(out.split('\n').map((s) => s.trim()).filter(Boolean))];
}

async function api(token, method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'playtest-harness-rest-gateway',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = data && data.message ? data.message : text.slice(0, 200);
    const err = new Error(`${method} ${path} → HTTP ${res.status}: ${msg}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const [OWNER, REPO] = OWNER_REPO.split('/');
if (!OWNER || !REPO) throw new Error(`--repo 格式应为 owner/repo，收到 ${OWNER_REPO}`);
const base = `/repos/${OWNER}/${REPO}`;

const files = changedFiles();
if (files.length === 0) {
  console.log('[gateway] 工作区无变更，无需提交。');
  process.exit(0);
}

console.log(`[gateway] 仓库 ${OWNER_REPO} · 分支 ${BRANCH}`);
console.log(`[gateway] 待提交 ${files.length} 个文件：`);
for (const f of files) console.log(`  - ${f}`);
if (LIST_ONLY) process.exit(0);

const token = readToken();
const who = await api(token, 'GET', '/user');
console.log(`[gateway] 认证身份：${who.login}`);

// 先校验仓库写权限（只读探测，不产生任何痕迹）
const repo = await api(token, 'GET', base);
const perms = repo.permissions ?? {};
console.log(`[gateway] 权限声明：push=${perms.push} admin=${perms.admin}（以实际写入为准）`);

if (!APPLY) {
  const ref = await api(token, 'GET', `${base}/git/ref/heads/${encodeURIComponent(BRANCH)}`);
  console.log(`[gateway] 当前 HEAD：${ref.object.sha}`);
  console.log('[gateway] DRY-RUN（默认）：以上为计划内容，未写入任何远端数据。');
  console.log('[gateway] 确定要提交时执行：node tools/gh-commit.mjs --apply -m "..."');
  process.exit(0);
}

/** 一次完整提交尝试；失败（并发冲突）时由外层重放。 */
async function attempt(token, files, message) {
  const ref = await api(token, 'GET', `${base}/git/ref/heads/${encodeURIComponent(BRANCH)}`);
  const baseSha = ref.object.sha;
  const baseCommit = await api(token, 'GET', `${base}/git/commits/${baseSha}`);
  const baseTree = baseCommit.tree.sha;

  const tree = [];
  for (const f of files) {
    const abs = resolve(ROOT, f);
    if (!existsSync(abs)) {
      // 删除文件：GitHub tree 用 sha:null 表达
      tree.push({ path: f, mode: '100644', type: 'blob', sha: null });
      continue;
    }
    const content = readFileSync(abs);
    const blob = await api(token, 'POST', `${base}/git/blobs`, {
      content: content.toString('base64'),
      encoding: 'base64',
    });
    tree.push({ path: f, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newTree = await api(token, 'POST', `${base}/git/trees`, {
    base_tree: baseTree,
    tree,
  });
  const commit = await api(token, 'POST', `${base}/git/commits`, {
    message,
    tree: newTree.sha,
    parents: [baseSha],
  });
  // force:false = 乐观锁：引用若已被别人推进，这里会失败并触发重放。
  const updated = await api(token, 'PATCH', `${base}/git/refs/heads/${encodeURIComponent(BRANCH)}`, {
    sha: commit.sha,
    force: false,
  });
  return { baseSha, commit: commit.sha, ref: updated.object.sha };
}

for (let i = 1; i <= RETRIES; i += 1) {
  try {
    console.log(`[gateway] 提交尝试 ${i}/${RETRIES}…`);
    const r = await attempt(token, files, MESSAGE);
    console.log(`[gateway] ✓ 成功：${r.baseSha.slice(0, 8)} → ${r.commit.slice(0, 8)}`);
    console.log(`[gateway] 引用 ${BRANCH} 已推进到 ${r.ref}`);
    console.log(`[gateway] https://github.com/${OWNER_REPO}/commit/${r.commit}`);
    process.exit(0);
  } catch (err) {
    const conflict = err.status === 409 || err.status === 422;
    console.error(`[gateway] 尝试 ${i} 失败：${err.message}`);
    if (!conflict || i === RETRIES) {
      console.error('[gateway] 放弃。远端未留下半成品提交（commit / tree 对象不挂引用不会出现在历史里）。');
      process.exit(1);
    }
    console.log('[gateway] 检测到并发推进，重新读取基线并重放…');
  }
}
