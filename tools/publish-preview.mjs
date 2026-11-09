#!/usr/bin/env node
/**
 * 发布闸门（唯一通道）：把 dist/ 整体发到线上，打印公网链接。
 *
 *   npm run build && npm run publish:preview
 *
 * 只做三件事：确认 dist/ 有产物 → 调沙箱发布服务 → 解析并校验返回。
 * 链接长期不变（同一站点覆盖更新），唯一权威记录在 docs/state/CURRENT.md。
 * 不要再另起一套「同步到某个目录 + 另一个域名」的通道（v9s.46 已收敛）。
 *
 * 环境变量：
 *   SITES_PUBLISH  发布脚本路径，默认 ~/.codebuddy/skills/sites/scripts/publish.js
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const PUBLISH =
  process.env.SITES_PUBLISH || join(homedir(), '.codebuddy/skills/sites/scripts/publish.js');

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('[publish] dist/index.html 不存在：先跑 npm run build');
  process.exit(1);
}
if (!existsSync(PUBLISH)) {
  console.error(`[publish] 找不到发布脚本：${PUBLISH}`);
  console.error('[publish] 设 SITES_PUBLISH=/path/to/publish.js，或本地用 npx serve dist 预览');
  process.exit(1);
}

const res = spawnSync(
  process.execPath,
  [PUBLISH, '--dir', DIST, '--language', 'static'],
  { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
);
if (res.stdout) process.stdout.write(res.stdout);
if (res.stderr) process.stderr.write(res.stderr);
if (res.status !== 0) {
  console.error(`[publish] 发布失败（exit ${res.status}）`);
  process.exit(res.status || 1);
}

const jsonLine = (res.stdout || '')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.startsWith('{'))
  .pop();
if (!jsonLine) {
  console.error('[publish] 没解析到发布结果（期望一行 JSON）');
  process.exit(2);
}

let out;
try {
  out = JSON.parse(jsonLine);
} catch {
  console.error('[publish] 发布结果不是合法 JSON');
  process.exit(2);
}
if (!out.verified) {
  console.error(`[publish] 发布未通过校验：${JSON.stringify(out).slice(0, 300)}`);
  process.exit(3);
}

console.log(`\n[publish] OK ${out.version ? `v${out.version} · ` : ''}${out.shareLink}`);
console.log('[publish] 把这条链接贴进任务回复；同时确认页面左下角徽标是本版。');
