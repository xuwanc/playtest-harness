import raw from '../config/game.json';
import type { AppConfig, CoreConfig, SceneConfig, ViewConfig } from './core';

/**
 * 唯一的配置文件入口。Core 不 import 本文件 —— 配置由组装层注入，
 * 因此把 Core 搬进 Unity / Godot / Node 时不需要携带任何 Web 配置。
 * 深拷贝是为了让调试面板可以在运行时安全地改写数值。
 */
function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const source = raw as unknown as AppConfig;

export const CORE_CONFIG: CoreConfig = copy(source.core);
export const SCENE_CONFIG: SceneConfig = copy(source.scene);
export const VIEW_CONFIG: ViewConfig = copy(source.view);
