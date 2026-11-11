/**
 * 兼容转发层（v9s.59）。
 *
 * 克隆 ghost 池残影已迁入可复用特效库 `./effects/`（`ghost-afterimage.ts`）。
 * 本文件只保留旧 import 路径与 `createAfterimage` / `Afterimage` 导出，避免破坏
 * three-scene 与既有单测；新代码请直接从 `./effects` 引入。
 */
export { createGhostAfterimage as createAfterimage } from './effects/ghost-afterimage';
export type { AfterimageEffect as Afterimage } from './effects/shared';
