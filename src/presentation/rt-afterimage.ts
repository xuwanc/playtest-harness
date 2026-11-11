/**
 * 兼容转发层（v9s.59）。
 *
 * RT 反馈残影已迁入可复用特效库 `./effects/`（`rt-afterimage.ts`）。
 * 本文件只保留旧 import 路径与 `createRtAfterimage` / `Afterimage` 导出，避免破坏
 * three-scene 与既有单测；新代码请直接从 `./effects` 引入。
 */
export { createRtAfterimage } from './effects/rt-afterimage';
export type { AfterimageEffect as Afterimage } from './effects/shared';
