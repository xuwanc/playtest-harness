import { defineConfig } from 'vitest/config';

export default defineConfig({
  // 相对路径资源：发布到任意子路径 / 反代下都能正确加载
  base: './',
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
