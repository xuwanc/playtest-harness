#!/usr/bin/env node
/**
 * 可移植边界守卫。
 * 等价于 ESLint 的 no-restricted-imports 规则，但零依赖、不引入 lint 工具链，
 * 且额外检查「语言无关友好」纪律，能在 CI / Node 环境直接跑。
 *
 * 每次 npm run build 之外，务必跑一次 npm run verify:portable。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const coreDir = join(here, '..', 'src', 'core');

/** 去掉注释（保留字符串内容），避免注释里提到的禁用词造成误报。 */
function stripComments(src) {
  let out = '';
  let state = 'code';
  let quote = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (state === 'code') {
      if (c === '/' && n === '/') { state = 'line'; i += 2; continue; }
      if (c === '/' && n === '*') { state = 'block'; i += 2; continue; }
      if (c === '"' || c === "'") { state = 'string'; quote = c; out += c; i++; continue; }
      if (c === '`') { state = 'template'; out += c; i++; continue; }
      out += c; i++; continue;
    }
    if (state === 'line') {
      if (c === '\n') { state = 'code'; out += '\n'; }
      i++; continue;
    }
    if (state === 'block') {
      if (c === '*' && n === '/') { state = 'code'; i += 2; continue; }
      if (c === '\n') out += '\n';
      i++; continue;
    }
    if (state === 'string') {
      out += c;
      if (c === '\\') { out += n ?? ''; i += 2; continue; }
      if (c === quote) state = 'code';
      i++; continue;
    }
    if (state === 'template') {
      out += c;
      if (c === '\\') { out += n ?? ''; i += 2; continue; }
      if (c === '`') state = 'code';
      i++; continue;
    }
  }
  return out;
}

const rules = [
  { re: /\bfrom\s+['"](?:three|lil-gui|vite|vitest)['"]/, msg: '引入了渲染 / 构建依赖' },
  { re: /\bfrom\s+['"]\.\.\//, msg: '依赖了 Core 目录之外的源码（必须向下单向依赖）' },
  { re: /\bfrom\s+['"][^'"]*\.json['"]/, msg: '直接 import 配置文件（应由组装层注入）' },
  { re: /\b(?:window|document|navigator|localStorage|sessionStorage)\b/, msg: '使用了浏览器全局对象' },
  { re: /\bMath\.random\s*\(/, msg: '使用了不确定性随机源' },
  { re: /\b(?:Date\.now|performance\.now|requestAnimationFrame|setTimeout|setInterval)\b/, msg: '读取了外部时间源' },
  { re: /\b(?:class|enum)\s+\w+/, msg: '使用了 class / enum（不利于跨语言重写）' },
  { re: /\b(?:Symbol|Proxy|Reflect)\s*\(/, msg: '使用了 JS 特有元编程能力' },
];

const files = readdirSync(coreDir).filter((f) => f.endsWith('.ts'));
const violations = [];

for (const file of files) {
  const src = stripComments(readFileSync(join(coreDir, file), 'utf8'));
  for (const { re, msg } of rules) {
    const m = re.exec(src);
    if (m) {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(`${file}:${line}  ${msg}  →  ${m[0]}`);
    }
  }
}

console.log(`[boundary] 检查 src/core 的 ${files.length} 个文件…`);
if (violations.length > 0) {
  console.error('[boundary] FAIL：Core 违反可移植契约');
  for (const v of violations) console.error('  - ' + v);
  process.exit(1);
}
console.log('[boundary] ✓ 无 three / DOM / 外部时间 / class / 上层依赖');
console.log('[boundary] PASS：Core 满足「Web 复用 + Unity/Godot 对照重写」契约');
