import type { TelemetryRecorder } from '../adapters/telemetry';

/**
 * v9f：诊断抽屉。
 *
 * 交互只保留两种：点一下左下角版本徽标 → 「复制摘要」→ 粘到聊天。
 * 手机上不要求用户开控制台、不要求连数据线，也不自动外发任何东西。
 * 完整 JSON 只用于下载后本地留存 / 深挖。
 */

export type TelemetryPanel = {
  /** 由主循环低频调用（~4Hz），刷新徽标告警与抽屉里的计数 */
  tick(): void;
  isOpen(): boolean;
  close(): void;
};

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 落到 execCommand 兜底
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-2000px;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function download(name: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function createTelemetryPanel(
  recorder: TelemetryRecorder,
  badge: HTMLElement | null,
): TelemetryPanel {
  const sheet = document.createElement('div');
  sheet.id = 'diag';
  // data-ui-region：让输入层忽略抽屉内的 pointerdown，否则点遮罩关面板会顺带起摇杆
  sheet.setAttribute('data-ui-region', '');
  sheet.hidden = true;
  sheet.innerHTML = [
    '<div id="diag-mask"></div>',
    '<div id="diag-card">',
    '  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>',
    '  <div id="diag-status">—</div>',
    '  <div id="diag-row">',
    '    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>',
    '    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>',
    '    <button id="diag-clear" class="diag-btn" type="button">清空</button>',
    '    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',
    '  </div>',
    '  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>',
    '  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',
    '</div>',
  ].join('');
  document.body.appendChild(sheet);

  const $ = <T extends HTMLElement>(id: string): T => sheet.querySelector(`#${id}`) as T;
  const statusEl = $<HTMLDivElement>('diag-status');
  const textEl = $<HTMLTextAreaElement>('diag-text');
  const copyBtn = $<HTMLButtonElement>('diag-copy');
  const jsonBtn = $<HTMLButtonElement>('diag-json');
  const clearBtn = $<HTMLButtonElement>('diag-clear');
  const toggleBtn = $<HTMLButtonElement>('diag-toggle');
  const closeBtn = $<HTMLButtonElement>('diag-close');
  const mask = $<HTMLDivElement>('diag-mask');

  let open = false;
  let enabled = true;
  let flashTimer = 0;

  function refresh(): void {
    const s = recorder.status();
    statusEl.textContent = s.enabled
      ? `已记录 ${s.durationS.toFixed(1)}s · ${s.frames} 帧 · 事件 ${s.events} · 异常 ${s.anomalies}`
      : `已暂停 · 建议在复现问题前点「继续记录」`;
    toggleBtn.textContent = s.enabled ? '暂停记录' : '继续记录';
  }

  function setOpen(next: boolean): void {
    open = next;
    sheet.hidden = !next;
    if (next) refresh();
    else textEl.hidden = true;
  }

  function flash(msg: string): void {
    copyBtn.textContent = msg;
    window.clearTimeout(flashTimer);
    flashTimer = window.setTimeout(() => {
      copyBtn.textContent = '复制摘要';
    }, 1800);
  }

  badge?.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setOpen(!open);
  });
  closeBtn.addEventListener('click', () => setOpen(false));
  mask.addEventListener('click', () => setOpen(false));

  copyBtn.addEventListener('click', () => {
    const text = recorder.summary();
    void copyText(text).then((ok) => {
      if (ok) {
        flash('已复制 ✓');
        textEl.hidden = true;
      } else {
        // 老浏览器 / 非安全上下文：把文本摊开，让用户长按手动复制
        textEl.value = text;
        textEl.hidden = false;
        textEl.focus();
        textEl.select();
        flash('请长按全选复制');
      }
    });
  });

  jsonBtn.addEventListener('click', () => {
    const dump = recorder.dump();
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    download(`harness-${dump.meta.version}-${stamp}.json`, JSON.stringify(dump));
    flash('已导出');
  });

  clearBtn.addEventListener('click', () => {
    recorder.clear();
    textEl.hidden = true;
    refresh();
    flash('已清空');
  });

  toggleBtn.addEventListener('click', () => {
    enabled = !enabled;
    recorder.setEnabled(enabled);
    refresh();
  });

  return {
    tick(): void {
      const s = recorder.status();
      // 最近 8 秒有可疑片段 → 徽标变橙并带 ⚠，让用户知道「刚才那下被记下来了」
      badge?.classList.toggle('is-alert', s.alert);
      if (open) refresh();
    },
    isOpen: () => open,
    close: () => setOpen(false),
  };
}
