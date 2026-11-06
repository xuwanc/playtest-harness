import type { World } from './types';

/**
 * mulberry32 种子随机。状态存在 world.rngState 里，绝不使用外部随机源，
 * 因此同一串输入序列在 Web / Node / Unity / Godot 里都会得到同样的随机序列。
 * 独立成文件是为了避免 dummies 与 step 之间形成循环 import。
 */
export function nextRandom(world: World): number {
  world.rngState = (world.rngState + 0x6d2b79f5) >>> 0;
  let t = world.rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
