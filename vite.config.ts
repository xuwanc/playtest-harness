import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

/**
 * 构建期注入版本信息（v9e）：包版本来自 package.json，构建时间按北京时间格式化。
 * 左下角徽标显示这两个值 —— 线上只有一份 dist，改完必须重新 build + 发布才会变。
 */
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

const buildTime = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date()).replace(/\//g, '-');

/**
 * 端口优先取发布环境注入的 `PORT`（v9s.31）。
 * 发布脚本以 `PORT=3000 npm run dev` 启动并探测该端口；写死 5173 会让探测失败，
 * 只能退回「静态目录」发布，丢掉 dev server 的相对路径与热更新语义。
 */
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  // 相对路径资源：发布到任意子路径 / 反代下都能正确加载
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(`v${pkg.version}`),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  server: { host: '0.0.0.0', port, strictPort: true, allowedHosts: true },
  preview: { host: '0.0.0.0', port, strictPort: true, allowedHosts: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
