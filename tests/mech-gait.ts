import { readFileSync } from 'node:fs';
import type { AppConfig, GaitViewConfig } from '../src/core';

/** 线上配置的原始读数（不做任何覆盖），供「默认参数是否被误改」的断言使用。 */
export const RAW_CONFIG = JSON.parse(
  readFileSync(new URL('../config/game.json', import.meta.url), 'utf8'),
) as AppConfig;

/**
 * 机制回归用的固定步态配置（v9n~v9p 时代的默认值）。
 *
 * 线上默认参数由用户逐轮真机调优，可能把某些幅度直接拉到 0（v9q 里
 * chestYawMaxDeg=0 关掉胸偏转、stopStepPitch/TrailPitch=0 关掉踩出与后蹬）。
 * 但「机制本身是否存在、比例是否正确」必须用一份显式非零配置验证，
 * 不能随调优后的默认值一起漂移。所有骨架集成测试统一用这份配置。
 */
export const MECH_GAIT: GaitViewConfig = {
  ...RAW_CONFIG.view.gait,
  stopBlendSec: 0.3,
  stopEnterRatio: 0.08,
  stopExitRatio: 0.18,
  chestYawScale: 0.45,
  chestYawMaxDeg: 32,
  stopStepPitch: 0.26,
  stopTrailPitch: 0.09,
  stopStepKnee: 0.14,
  stopBodyShift: 0.075,
  stopBodyDip: 0.05,
  stopChestPitch: 0.1,
  stopPeakRatio: 0.34,
  knockGaitScale: 1,
};

/** v9q 用户敲定的 11 项默认参数 + v9r 新增的骨盆下沉量，防止后续误改。 */
export const DEFAULT_GAIT_EXPECT = {
  stopBlendSec: 0.56,
  stopEnterRatio: 0.17,
  stopExitRatio: 0.39,
  chestYawScale: 0.35,
  chestYawMaxDeg: 0,
  stopStepPitch: 0,
  stopTrailPitch: 0,
  stopStepKnee: 0.2,
  stopBodyShift: 0.07,
  stopBodyDip: 0.03,
  stopChestPitch: 0.01,
  stopPeakRatio: 0.48,
} as const;
