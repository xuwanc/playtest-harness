import { resetDummies, warpTo } from '../core';
import type { AssembledPlot, StationSpec, World } from '../core';
import type { SceneView } from './three-scene';
import { cycleStation, stationAt, stationById } from './lab-stations';

export type LabPanel = {
  /** 传送到工位（id 或 index）；返回是否传送成功 */
  goto(idOrIndex: string | number): boolean;
  /** 当前所在工位（按玩家位置实时判定） */
  current(): StationSpec | null;
  /** 每帧调用：玩家走进 / 走出工位时切换高亮与说明，只在变化时写 DOM */
  tick(): void;
  /** 召回全部假人（回 home、恢复初始行为、清攻击状态） */
  recall(): void;
  /** v9s.43：在指定地块就地生成测试单位（先传送到拼合后的落点），返回生成数量 */
  spawnAt(idOrIndex: string | number): number;
  /** v9s.43：清除所有由测试按钮生成的单位，返回移除数量 */
  clearSpawned(): number;
  element: HTMLElement | null;
};

type LabPanelOptions = {
  stations: StationSpec[];
  /** v9s.43：拼合后的地块列表；带 testSpawn 的会出现在「地块测试」分区 */
  plots?: AssembledPlot[];
  world: World;
  view: SceneView;
  /** 容器，默认 #lab-panel */
  container?: HTMLElement | null;
  /** 镜头缩放归 1（与调试面板同一个实现） */
  onResetZoom?: () => void;
  /** v9s.43：点击地块测试按钮时由组装层生成假人 / 陪练，返回生成数量 */
  onPlotTest?: (plot: AssembledPlot) => number;
  /** v9s.43：点击「清除测试单位」时由组装层清理，返回移除数量 */
  onClearTestUnits?: () => number;
};

/**
 * v9s.15 · 测试工位面板。
 *
 * 测试场的核心痛点是「换个功能要跑半个地图」，所以把每个工位做成一次点击：
 * 面板列出全部工位，点一下就 `warpTo` 过去并把相机瞬移（不跨场地滑行）。
 * 桌面端另给 `[` / `]` 循环切换、`\` 召回假人，手机端只有面板按钮。
 *
 * 传送是**调试操作**，与「复位」同级：清玩家侧瞬时状态（攻击 / 冲刺 / 受击 / 锁定），
 * 不动假人与世界时间，因此可以在一局里连续换场地测试。
 *
 * v9s.43：工位来自 `assemblePlots()` 的动态拼合结果，`spawnX/spawnZ` 已是拼合后的
 * 实际位置；每个带 `testSpawn` 的地块额外给一枚测试按钮，点了先传送到该地块、再就地
 * 生成假人 / 陪练，用完「清除测试单位」回到配置里的基线单位。
 */
export function createLabPanel({
  stations, plots = [], world, view, container, onResetZoom,
  onPlotTest, onClearTestUnits,
}: LabPanelOptions): LabPanel {
  const el = container ?? document.getElementById('lab-panel');
  let activeId: string | null = null;
  let hintEl: HTMLElement | null = null;
  const rows = new Map<string, HTMLButtonElement>();

  // 入场提示条：走进 / 传送到某工位时在屏幕下方浮出一条「这里测什么」，5s 后自动消失。
  // 放在 DOM 而不是 3D 标牌：不挡视线、字号可读、手机上也清楚。
  const toast = document.createElement('div');
  toast.id = 'lab-toast';
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  let toastTimer = 0;

  function showToast(st: StationSpec): void {
    toast.textContent = `${st.index} · ${st.name} — ${st.hint}`;
    toast.style.borderColor = st.color;
    toast.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-on'), 5000);
  }

  function current(): StationSpec | null {
    return stationAt(stations, world.character.position.x, world.character.position.z);
  }

  function paint(): void {
    const cur = current();
    const curId = cur?.id ?? null;
    if (curId === activeId) return;
    const left = activeId !== null;
    activeId = curId;
    for (const [id, row] of rows) row.classList.toggle('is-active', id === curId);
    if (hintEl) {
      hintEl.textContent = cur
        ? `${cur.index} · ${cur.hint}`
        : '不在任何工位内：点上面的名字传送，或直接走过去';
      hintEl.style.color = cur ? 'rgba(206, 226, 244, 0.9)' : 'rgba(150, 172, 192, 0.62)';
    }
    if (cur) showToast(cur);
    else if (left) toast.classList.remove('is-on');
  }

  function goto(idOrIndex: string | number): boolean {
    const target = typeof idOrIndex === 'number'
      ? stations.find((s) => s.index === idOrIndex) ?? null
      : stationById(stations, idOrIndex);
    if (!target) return false;
    warpTo(world, target.spawnX, target.spawnZ);
    // 世界相机意图的质心一并瞬移：否则智能构图会从上一个工位平滑拉过来
    world.camera.centroidX = target.spawnX;
    world.camera.centroidZ = target.spawnZ;
    view.snapCamera(target.spawnX, world.character.position.y, target.spawnZ);
    paint();
    return true;
  }

  function recall(): void {
    resetDummies(world);
  }

  /** 点测试按钮：先传送到拼合后的落点（让「当前地块」名副其实），再就地生成单位。 */
  function testPlot(plot: AssembledPlot): number {
    goto(plot.id);
    return onPlotTest ? onPlotTest(plot) : 0;
  }

  function clearSpawned(): number {
    return onClearTestUnits ? onClearTestUnits() : 0;
  }

  function spawnAt(idOrIndex: string | number): number {
    const plot = typeof idOrIndex === 'number'
      ? plots.find((p) => p.index === idOrIndex)
      : plots.find((p) => p.id === idOrIndex);
    return plot && plot.testSpawn ? testPlot(plot) : 0;
  }

  const testPlots = plots.filter((p) => p.testSpawn);
  const testCount = (p: AssembledPlot): number =>
    (p.testSpawn?.dummies ?? 0) + (p.testSpawn?.fighters ?? 0);

  // ---- DOM ----
  if (el) {
    el.textContent = '';
    const head = document.createElement('div');
    head.className = 'lab-head';
    head.textContent = '测试工位';
    const tip = document.createElement('span');
    tip.className = 'lab-tip';
    tip.textContent = '[ / ] 切换';
    head.appendChild(tip);
    el.appendChild(head);

    for (const st of [...stations].sort((a, b) => a.index - b.index)) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'lab-row';
      row.dataset.station = st.id;
      row.dataset.uiButton = '';
      row.style.setProperty('--lab-color', st.color);
      row.setAttribute('aria-label', `传送到工位 ${st.index}：${st.name}`);
      const idx = document.createElement('span');
      idx.className = 'lab-idx';
      idx.textContent = String(st.index);
      const name = document.createElement('span');
      name.className = 'lab-name';
      name.textContent = st.name;
      row.append(idx, name);
      row.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        goto(st.id);
      });
      el.appendChild(row);
      rows.set(st.id, row);
    }

    hintEl = document.createElement('div');
    hintEl.className = 'lab-hint';
    el.appendChild(hintEl);

    // v9s.43 · 地块测试按钮：一地块一行，点一下就地生成假人 / 陪练。
    // 用 div 而不是 button 作行容器，避免 button 嵌套 button 的非法 HTML。
    if (testPlots.length > 0) {
      const testHead = document.createElement('div');
      testHead.className = 'lab-head lab-subhead';
      testHead.textContent = '地块测试';
      const testTip = document.createElement('span');
      testTip.className = 'lab-tip';
      testTip.textContent = '就地生成';
      testHead.appendChild(testTip);
      el.appendChild(testHead);

      for (const p of testPlots) {
        const row = document.createElement('div');
        row.className = 'lab-row lab-test-row';
        row.dataset.plot = p.id;
        const name = document.createElement('span');
        name.className = 'lab-name';
        name.textContent = p.name;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lab-btn lab-test';
        btn.dataset.uiButton = '';
        btn.dataset.plotTest = p.id;
        btn.textContent = p.testSpawn?.label ?? `生成 ${testCount(p)} 人`;
        btn.setAttribute('aria-label', `在${p.name}就地生成 ${testCount(p)} 个测试单位`);
        btn.addEventListener('pointerdown', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          testPlot(p);
        });
        row.append(name, btn);
        el.appendChild(row);
      }
    }

    const foot = document.createElement('div');
    foot.className = 'lab-foot';
    const recallBtn = document.createElement('button');
    recallBtn.type = 'button';
    recallBtn.className = 'lab-btn';
    recallBtn.dataset.uiButton = '';
    recallBtn.textContent = '召回假人';
    recallBtn.setAttribute('aria-label', '召回全部假人回到各自工位');
    recallBtn.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      recall();
    });
    foot.appendChild(recallBtn);
    if (testPlots.length > 0) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'lab-btn';
      clearBtn.dataset.uiButton = '';
      clearBtn.dataset.clearTestUnits = '';
      clearBtn.textContent = '清除测试单位';
      clearBtn.setAttribute('aria-label', '清除所有由地块测试按钮生成的假人与陪练');
      clearBtn.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        clearSpawned();
      });
      foot.appendChild(clearBtn);
    }
    if (onResetZoom) {
      const zoomBtn = document.createElement('button');
      zoomBtn.type = 'button';
      zoomBtn.className = 'lab-btn';
      zoomBtn.dataset.uiButton = '';
      zoomBtn.textContent = '镜头归位';
      zoomBtn.setAttribute('aria-label', '把镜头缩放恢复到默认');
      zoomBtn.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        onResetZoom();
      });
      foot.appendChild(zoomBtn);
    }
    el.appendChild(foot);
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '[') {
      const next = cycleStation(stations, current()?.id ?? activeId, -1);
      if (next) goto(next.id);
    } else if (e.key === ']') {
      const next = cycleStation(stations, current()?.id ?? activeId, 1);
      if (next) goto(next.id);
    } else if (e.key === '\\') {
      recall();
    }
  });

  paint();

  return { goto, current, tick: paint, recall, spawnAt, clearSpawned, element: el };
}
