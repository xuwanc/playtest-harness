import { step } from '../core';
import type { Intents, World } from '../core';

export type ClockDriver = {
  /**
   * 推进一帧，返回本帧实际执行的固定步数。按下沿事件只在第一个 step 生效。
   * onStep 每执行完一个固定步回调一次 —— 事件队列每步开头清空，
   * 掉帧补算多步时只有最后一步的事件留在 world.events 里，诊断记录需要逐步收集。
   */
  frame(frameSeconds: number, intents: Intents, timeScale: number, paused: boolean, onStep?: () => void): number;
  singleStep(intents: Intents): void;
  reset(): void;
  readonly accumulator: number;
};

/**
 * 固定步长累加器。
 * 放在适配层而不是 Core：累加器属于「驱动状态」，不参与状态快照与跨语言移植。
 */
export function createClock(world: World): ClockDriver {
  let acc = 0;

  return {
    frame(frameSeconds, intents, timeScale, paused, onStep) {
      if (paused || timeScale <= 0) {
        acc = 0;
        return 0;
      }
      // 切后台回来时限制单帧时间，避免一次性补算大量步
      acc += Math.min(frameSeconds, 0.1) * timeScale;
      const dt = world.config.fixedDt;
      const max = world.config.maxStepsPerFrame;
      let n = 0;
      while (acc >= dt && n < max) {
        // 按下沿事件只在第一个固定步生效；持续按住类（移动、冲刺、攻击 held）保留。
        const i: Intents = n === 0
          ? intents
          : {
              ...intents,
              jumpPressed: false,
              resetPressed: false,
              sprintPressed: false,
              attackPressed: false,
              attackReleased: false,
              skill2Pressed: false,
              weaponSlot: 0,
              dummyClickId: 0,
            };
        step(world, dt, i);
        if (onStep) onStep();
        acc -= dt;
        n++;
      }
      if (n >= max) acc = 0;
      return n;
    },
    singleStep(intents) {
      step(world, world.config.fixedDt, intents);
      acc = 0;
    },
    reset() {
      acc = 0;
    },
    get accumulator() {
      return acc;
    },
  };
}
