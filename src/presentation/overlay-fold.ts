/**
 * v9r · 顶部一排胶囊：状态 / 手感 / 调试，互斥展开，默认全部收起。
 *
 * 之前是「左上 HUD / 说明两个胶囊 + 中间独立的手感胶囊 + 右侧独立的调试面板」
 * 三套定位各飘一处；现在统一收成 #panel-row 里的一排胶囊，展开的内容都落到
 * #panel-stack（同一时刻只显示一个），不挡角色、不抢操作区。
 *
 * 继承 v9c 的偏好：
 *   - 默认全部收起，只有胶囊可见；
 *   - 展开态不被每帧 HUD 刷新打断（刷新只换文本，不改折叠状态）；
 *   - v9s：**点画布 / 推摇杆 / 按攻击都不再自动收起**。用户需要在移动过程中持续盯
 *     「状态读数 / 手感曲线」观察数值变化，旧版一点画布就收回导致根本没法边跑边看。
 *     展开 / 收起只由胶囊点击与 V 快捷键控制；面板栈指针穿透，不挡操作区。
 *
 * 操作说明（旧 #hint）已移除：手机有屏幕按钮、按钮带 aria-label，完整按键表与
 * 版本说明在 README；那块默认收起、8s 自动收回的 9000 字 changelog 判定为不必要。
 */

export type PanelKey = 'lab' | 'hud' | 'motion' | 'debug';

export type PanelHooks = {
  /** 手感面板（motion-debug）：同步内部 enabled，决定是否绘制曲线 */
  motion?: { setEnabled(on: boolean): void; enabled(): boolean };
  /** 调试面板（lil-gui）：展开 / 收起 */
  debug?: { open(): void; close(): void };
};

export type OverlayFold = {
  /** 给 hud.update()：展开状态读数时输出完整版，否则一行摘要 */
  hudCompact(): boolean;
  /** app 创建完 motionDebug / debugPanel 后把控制钩子注册进来 */
  register(hooks: PanelHooks): void;
  /** 点胶囊：同一个再点一次收起，点别的直接切换（互斥） */
  toggle(key: PanelKey): void;
  closeAll(): void;
  isOpen(key: PanelKey): boolean;
};

const KEYS: PanelKey[] = ['lab', 'hud', 'motion', 'debug'];
const LABELS: Record<PanelKey, { short: string; full: string }> = {
  lab: { short: '工位', full: '测试工位' },
  hud: { short: '状态', full: '状态读数' },
  motion: { short: '手感', full: '手感调试面板' },
  debug: { short: '调试', full: '调试面板' },
};

/** 胶囊 id 与面板 id 并不总是同名（motion → motiondbg / debug → debug-panel），集中映射一次 */
const PANEL_IDS: Record<PanelKey, { toggle: string; panel: string }> = {
  lab: { toggle: 'lab-toggle', panel: 'lab-panel' },
  hud: { toggle: 'hud-toggle', panel: 'hud' },
  motion: { toggle: 'motiondbg-toggle', panel: 'motiondbg' },
  debug: { toggle: 'debug-toggle', panel: 'debug-panel' },
};

export function createPanelRow(hudEl: HTMLElement): OverlayFold {
  const toggles = Object.fromEntries(
    KEYS.map((k) => [k, document.getElementById(PANEL_IDS[k].toggle)]),
  ) as Record<PanelKey, HTMLElement | null>;
  const panels = Object.fromEntries(
    KEYS.map((k) => [k, document.getElementById(PANEL_IDS[k].panel)]),
  ) as Record<PanelKey, HTMLElement | null>;

  let hooks: PanelHooks = {};
  let openKey: PanelKey | null = null;

  function sync(): void {
    for (const key of KEYS) {
      const on = openKey === key;
      const t = toggles[key];
      const p = panels[key];
      if (t) {
        t.setAttribute('aria-expanded', String(on));
        t.textContent = `${LABELS[key].short} ${on ? '▾' : '▸'}`;
        t.setAttribute('aria-label', `${on ? '收起' : '展开'}${LABELS[key].full}`);
      }
      if (p) p.classList.toggle('is-open', on);
    }
    hudEl.classList.toggle('is-compact', openKey !== 'hud');
    // 外部模块的内部状态与胶囊行保持一致（每帧采样始终进行，这里只切绘制 / 显隐）
    hooks.motion?.setEnabled(openKey === 'motion');
    if (openKey === 'debug') hooks.debug?.open();
    else hooks.debug?.close();
  }

  function toggle(key: PanelKey): void {
    openKey = openKey === key ? null : key;
    sync();
  }

  function closeAll(): void {
    if (openKey === null) return;
    openKey = null;
    sync();
  }

  for (const key of KEYS) {
    toggles[key]?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(key);
    });
  }

  // 沿用旧方向盘的 V 快捷键：一键展开 / 收起手感面板
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'v' && !e.metaKey && !e.ctrlKey) toggle('motion');
  });

  // v9s：不再监听 window 的 pointerdown 做自动收起。状态 / 手感 / 调试三个面板
  // 一旦展开就保持展开，直到用户自己点胶囊（或按 V）收起 —— 移动、攻击、点画布
  // 都不会打断读数。胶囊自身仍用 pointerdown + stopPropagation 处理，互不干扰。
  sync();   // 默认全部收起

  return {
    hudCompact: () => openKey !== 'hud',
    register(next: PanelHooks): void {
      hooks = next;
      sync();
    },
    toggle,
    closeAll,
    isOpen: (key) => openKey === key,
  };
}
