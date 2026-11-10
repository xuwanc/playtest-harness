import * as THREE from 'three';
import type { ViewConfig, World } from '../core';

/**
 * v9s.57 · 陪练头顶血条。
 *
 * 为什么用 DOM 而不是 Three 精灵：
 *  - 血条是纯 UI（固定像素宽、不受透视缩放、不受光照），用 3D 面片做反而要自己处理朝向 / 缩放 / 遮挡；
 *  - 场上只有 3 个陪练，每帧 3 次 `project` + 3 次 `translate3d`，开销可以忽略；
 *  - 主体 HUD（`hud.ts`）已经是 DOM，样式与层级沿用同一套。
 *
 * 只给**有血量的单位**画（`health.maxHp > 0`）：普通假人是打不死的测试桩，头顶挂一条满血条
 * 会让「这个能打 / 这个打不死」变得不可读。死亡期间隐藏，重生后按满血重新出现。
 *
 * 世界坐标 → 屏幕坐标每帧现算，所以血条会跟着角色走、跟着相机转；相机背后（`p.z > 1`）时隐藏。
 */

export type HealthBarLayer = {
  /** 每帧调用：对齐单位数量 + 投影定位 + 刷新血量宽度 */
  update(world: World, camera: THREE.PerspectiveCamera): void;
  debug(): { total: number; shown: number };
  dispose(): void;
};

const BAR_W = 46;
const BAR_H = 5;

export function createHealthBarLayer(container: HTMLElement, view: ViewConfig): HealthBarLayer {
  const cfg = view.healthBar;
  if (cfg && cfg.enabled === false) {
    return { update() {}, debug: () => ({ total: 0, shown: 0 }), dispose() {} };
  }
  const lift = cfg?.lift ?? 0.24;

  const root = document.createElement('div');
  root.className = 'healthbars';
  root.style.cssText =
    'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5;';
  container.appendChild(root);

  type Bar = {
    el: HTMLDivElement;
    fill: HTMLDivElement;
    shown: boolean;
    /** 上一帧的宽度百分比：只有变化时才写 style，避免每帧触发样式重算 */
    pct: number;
  };
  const bars: Bar[] = [];

  function makeBar(): Bar {
    const el = document.createElement('div');
    el.style.cssText =
      `position:absolute;left:0;top:0;width:${BAR_W}px;height:${BAR_H}px;` +
      'transform:translate3d(0,0,0);will-change:transform;display:none;' +
      'background:rgba(12,10,10,0.62);border:1px solid rgba(255,255,255,0.22);' +
      'border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,0.45);';
    const fill = document.createElement('div');
    fill.style.cssText =
      `width:100%;height:100%;background:linear-gradient(180deg,#e0453f,#a31717);` +
      'border-radius:1px;transition:width 0.08s linear;';
    el.appendChild(fill);
    root.appendChild(el);
    return { el, fill, shown: false, pct: -1 };
  }

  const v = new THREE.Vector3();

  return {
    update(world, camera): void {
      const rect = container.getBoundingClientRect();
      const n = world.dummies.length;
      while (bars.length < n) bars.push(makeBar());

      let shown = 0;
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i];
        const s = world.dummies[i];
        if (!s || !s.health || s.health.maxHp <= 0 || s.health.dead) {
          if (b.shown) { b.el.style.display = 'none'; b.shown = false; }
          continue;
        }
        // 条挂在头顶上方一点（身高按配置，不用骨骼 —— 只差几厘米，且频繁吸骨会抖）
        v.set(s.position.x, s.position.y + world.config.dummies.height + lift, s.position.z);
        v.project(camera);
        if (v.z > 1 || v.z < -1) {
          if (b.shown) { b.el.style.display = 'none'; b.shown = false; }
          continue;
        }
        const x = (v.x * 0.5 + 0.5) * rect.width;
        const y = (-v.y * 0.5 + 0.5) * rect.height;
        b.el.style.transform =
          `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-100%)`;
        if (!b.shown) { b.el.style.display = 'block'; b.shown = true; }
        const pct = Math.max(0, Math.min(100, (s.health.hp / s.health.maxHp) * 100));
        if (Math.abs(pct - b.pct) > 0.5) {
          b.fill.style.width = `${pct}%`;
          b.pct = pct;
        }
        shown += 1;
      }
      // 多出来的条（单位被删）不销毁，只隐藏 —— 地块按钮增删单位时会用到
      for (let i = n; i < bars.length; i++) {
        const b = bars[i];
        if (b.shown) { b.el.style.display = 'none'; b.shown = false; }
      }
      void shown;
    },

    debug() {
      return { total: bars.length, shown: bars.filter((b) => b.shown).length };
    },

    dispose(): void {
      root.remove();
      bars.length = 0;
    },
  };
}
