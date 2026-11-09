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
/**
 * v9s.55：关掉「待机斜跨站姿」的线上配置。
 *
 * 待机不再是「两脚并拢、全身归零」，而是斜跨（一脚前一脚后 + 重心压后腿）。
 * 那些用来证明「某层关掉后下盘精确归零」的 A/B 对照必须把斜跨一起关掉，
 * 否则测的就不是机制本身、而是「机制 + 站姿」。斜跨自身的行为由
 * `v9s55-idle-stance.test.ts` 单独覆盖。
 */
export const GAIT_NO_IDLE: GaitViewConfig = {
  ...RAW_CONFIG.view.gait,
  idleStance: { ...RAW_CONFIG.view.gait.idleStance, enabled: false },
};

export const MECH_GAIT: GaitViewConfig = {
  ...RAW_CONFIG.view.gait,
  idleStance: { ...RAW_CONFIG.view.gait.idleStance, enabled: false },
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

/**
 * v9q 用户敲定的 11 项默认参数 + v9r 骨盆下沉 + v9s 停步偏差 / 原地转身，防止误改。
 * v9s 把胸随下盘偏转比例与上限从 0.35 / 0（关闭）调整到 0.6 / 40（启用）。
 * stopYawBlendMode 是字符串枚举，单独在测试里断言，不放进这张数值表。
 */
export const DEFAULT_GAIT_EXPECT = {
  stopBlendSec: 0.56,
  stopEnterRatio: 0.17,
  stopExitRatio: 0.39,
  chestYawScale: 0.6,
  chestYawMaxDeg: 40,
  stopStepPitch: 0,
  stopTrailPitch: 0,
  stopStepKnee: 0.2,
  stopBodyShift: 0.07,
  stopBodyDip: 0.03,
  stopChestPitch: 0.01,
  stopPeakRatio: 0.48,
  stopYawAfterSec: 0.3,
  turnStepPitch: 0.5,
  turnStepKnee: 0.35,
  turnStepDip: 0.02,
} as const;
