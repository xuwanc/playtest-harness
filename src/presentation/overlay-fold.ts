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
 *   - 一旦真正开始操作（点画布 / 推摇杆 / 按攻击），立刻收起「状态 / 手感」；
 *     「调试」保持展开，方便边跑边热调参数，由胶囊手动收起；
 *   - 点在胶囊行或展开面板内部不触发自动收起。
 *
 * 操作说明（旧 #hint）已移除：手机有屏幕按钮、按钮带 aria-label，完整按键表与
 * 版本说明在 README；那块默认收起、8s 自动收回的 9000 字 changelog 判定为不必要。
 */

export type PanelKey = 'hud' | 'motion' | 'debug';

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

const KEYS: PanelKey[] = ['hud', 'motion', 'debug'];
const LABELS: Record<PanelKey, { short: string; full: string }> = {
  hud: { short: '状态', full: '状态读数' },
  motion: { short: '手感', full: '手感调试面板' },
  debug: { short: '调试', full: '调试面板' },
};

export function createPanelRow(hudEl: HTMLElement): OverlayFold {
  const toggles = Object.fromEntries(
    KEYS.map((k) => [k, document.getElementById(`${k === 'motion' ? 'motiondbg' : k === 'debug' ? 'debug' : 'hud'}-toggle`)]),
  ) as Record<PanelKey, HTMLElement | null>;
  const panels = Object.fromEntries(
    KEYS.map((k) => [k, document.getElementById(k === 'motion' ? 'motiondbg' : k === 'debug' ? 'debug-panel' : 'hud')]),
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

  // 真正开始操作就收起（点胶囊 / 展开面板内部除外）。
  // 注意不要用 #panel-stack 整体判定 —— 它是指针穿透的，落在画布上的点击应当收起。
  function onAction(e: Event): void {
    const t = e.target;
    if (t instanceof Element && t.closest('#panel-row, #panel-stack')) return;
    // 调试面板常用来边跑边调，不自动收起；其余两个按 v9c 语义立即收回
    if (openKey === 'debug') return;
    closeAll();
  }
  window.addEventListener('pointerdown', onAction, { capture: true, passive: true });

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
