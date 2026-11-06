/**
 * v9c：状态读数 / 操作说明的折叠控制（纯表现层，不碰 Core）。
 *
 * 之前 HUD 是 7–13 行常驻文本、说明是一整段长文案，手机竖屏会长期压住左上角，
 * 挡角色也挡视线。这里改成：
 *   - 默认收起：HUD 只显示一行摘要，「操作说明」只留一个小胶囊；
 *   - 点胶囊展开，展开态不被每帧的状态刷新打断（刷新只换文本，不动折叠状态）；
 *   - 一旦真正开始操作（点画布 / 按攻击跳跃等），立刻自动收起；
 *   - 说明展开后 8s 无操作也会自己收回，避免忘了关。
 *
 * 折叠按钮本身带 data-ui-button，input.ts 会把它判为 UI 目标，不会当成摇杆起点。
 */

/** 说明展开后无操作自动收起的时长（毫秒） */
const HINT_AUTO_FOLD_MS = 8000;

export type OverlayFold = {
  /** 给 hud.update() 用：true = 只输出一行摘要 */
  hudCompact(): boolean;
};

export function createOverlayFold(hudEl: HTMLElement, hintEl: HTMLElement | null): OverlayFold {
  const hudToggle = document.getElementById('hud-toggle');
  const hintToggle = document.getElementById('hint-toggle');

  let hudOpen = false;
  let hintOpen = false;
  let hintTimer = 0;

  function sync(): void {
    hudEl.classList.toggle('is-compact', !hudOpen);
    hudToggle?.setAttribute('aria-expanded', String(hudOpen));
    if (hudToggle) {
      hudToggle.textContent = hudOpen ? '状态 ▾' : '状态 ▸';
      hudToggle.setAttribute('aria-label', hudOpen ? '收起状态读数' : '展开状态读数');
    }

    if (hintEl) hintEl.hidden = !hintOpen;
    hintToggle?.setAttribute('aria-expanded', String(hintOpen));
    if (hintToggle) {
      hintToggle.textContent = hintOpen ? '操作说明 ▾' : '操作说明 ▸';
      hintToggle.setAttribute('aria-label', hintOpen ? '收起操作说明' : '展开操作说明');
    }
  }

  function foldHint(): void {
    if (!hintOpen) return;
    hintOpen = false;
    window.clearTimeout(hintTimer);
    hintTimer = 0;
    sync();
  }

  function foldHud(): void {
    if (!hudOpen) return;
    hudOpen = false;
    sync();
  }

  function toggleHud(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    hudOpen = !hudOpen;
    sync();
  }

  function toggleHint(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    hintOpen = !hintOpen;
    window.clearTimeout(hintTimer);
    hintTimer = 0;
    if (hintOpen) hintTimer = window.setTimeout(foldHint, HINT_AUTO_FOLD_MS);
    sync();
  }

  hudToggle?.addEventListener('pointerdown', toggleHud);
  hintToggle?.addEventListener('pointerdown', toggleHint);

  // 真正开始操作就收起（点折叠胶囊 / 展开的说明正文除外）：
  // 摇杆、攻击、跳跃、换武器、点假人都会落到这里。
  // 注意不要用 #overlay-left 判定 —— HUD 区域是指针穿透的，落在画布上的点击应当收起。
  function onAction(e: Event): void {
    const t = e.target;
    if (t instanceof Element && t.closest('#fold-row, #hint')) return;
    foldHint();
    foldHud();
  }
  window.addEventListener('pointerdown', onAction, { capture: true, passive: true });

  sync();

  return {
    hudCompact: () => !hudOpen,
  };
}
