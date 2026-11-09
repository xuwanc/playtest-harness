#!/usr/bin/env python3
"""clip-lab：动作剪辑验证台（给 AI / 人看的同一份事实）

它解决三个反复踩到的问题：

1. **角度靠猜** —— 直接读刃身两端的世界坐标，算出真实仰角 / 扫角，
   不再靠肉眼在斜俯视截图里判断「这是横劈还是举着剑」。
2. **定格靠碰运气** —— 把 combat 的表现入参伪造到「某武器 · 某段 · 某进度」
   再跑真实 render()，任意进度可复现，读到的手臂链 / 挂点反解都是真机链路。
3. **验收靠回忆** —— 一条命令跑完所有段，输出 PASS/FAIL 与关键帧截图，
   报告里同时有数值和图片，可以贴进 commit / PR。

用法：
    python3 tools/clip-lab/clip_lab.py check
    python3 tools/clip-lab/clip_lab.py scan  --weapon greatsword --seg 1
    python3 tools/clip-lab/clip_lab.py shot  --weapon dual-swords --seg 3 --progress 0.5
    python3 tools/clip-lab/clip_lab.py shot  --weapon greatsword --seg 1 --keyframes

依赖：python3 + playwright（本沙箱已装）。会自己起一个静态服务器服务 dist/。
"""

from __future__ import annotations

import argparse
import json
import math
import os
import shutil
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
OUT_ROOT = ROOT / "clip-lab"

WEAPON_LABEL = {
    "greatsword": "大剑",
    "sword-shield": "剑盾",
    "dual-swords": "双持",
}

# 每段的验收规则。数值来自 v9s.26 校准后的实测，留了一点余量，
# 目的不是卡死数值，而是「改数据后幅度掉了会被发现」。
SEG_RULES: dict[tuple[str, int], dict] = {
    ("greatsword", 1): {"min_sweep": 150, "max_pitch": 25, "label": "横扫 右→左"},
    ("greatsword", 2): {"min_sweep": 150, "max_pitch": 25, "label": "横扫 左→右"},
    ("greatsword", 3): {"min_pitch_span": 70, "label": "举顶下劈"},
    ("dual-swords", 1): {"min_sweep": 150, "max_pitch": 25, "label": "横扫 右→左"},
    ("dual-swords", 2): {"min_sweep": 150, "max_pitch": 25, "label": "横扫 左→右"},
    ("dual-swords", 3): {"min_spin": 340, "min_sweep": 250, "max_pitch": 30, "label": "展开旋身"},
    ("sword-shield", 1): {"min_sweep": 120, "max_pitch": 25, "label": "横扫 右→左"},
    ("sword-shield", 2): {"min_sweep": 120, "max_pitch": 25, "label": "横扫 左→右"},
    ("sword-shield", 3): {"max_sweep": 70, "label": "盾猛顶（前顶，不是横扫）"},
}

WEAPON_SEGS = {
    "greatsword": [1, 2, 3],
    "sword-shield": [1, 2, 3],
    "dual-swords": [1, 2, 3],
}


# ---------------------------------------------------------------- 基础设施


def free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


class StaticServer:
    def __init__(self) -> None:
        self.proc: subprocess.Popen | None = None
        self.url = ""

    def __enter__(self) -> "StaticServer":
        if not (DIST / "index.html").exists():
            raise SystemExit("dist/index.html 不存在，先跑 `npm run build`")
        port = free_port()
        self.proc = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(port), "--directory", str(DIST)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        self.url = f"http://127.0.0.1:{port}/"
        for _ in range(60):
            try:
                with socket.create_connection(("127.0.0.1", port), timeout=0.2):
                    return self
            except OSError:
                time.sleep(0.05)
        raise SystemExit("静态服务器起不来")

    def __exit__(self, *exc) -> None:
        if self.proc:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                self.proc.kill()


PROBE_JS = """
(o) => {
  const h = window.__harness;
  const r = h.clipLab.preview(o);
  const b = r.blade;
  const s = h.swingDebug();
  const pair = h.bladesWorld ? h.bladesWorld() : { right: b, left: null };
  // v9s.28：双持段 2 的主手是左手，`weaponBlade()` 永远取右手 —— 扫角必须按主手取，
  // 否则量到的是副手的摆动（曾经把「副手几乎不动」误判成 184° 横扫）。
  const main = (s.lead === 'L' && pair.left) ? pair.left : b;
  let pitch = null, yaw = null, dh = null, len = null;
  if (main) {
    const dx = main.tip.x - main.base.x, dy = main.tip.y - main.base.y, dz = main.tip.z - main.base.z;
    len = Math.hypot(dx, dy, dz) || 1e-6;
    pitch = Math.asin(dy / len) * 180 / Math.PI;
    yaw = Math.atan2(dx, dz) * 180 / Math.PI;
    dh = main.tip.y - main.base.y;
  }
  const ang = (x) => {
    if (!x) return null;
    const dx = x.tip.x - x.base.x, dy = x.tip.y - x.base.y, dz = x.tip.z - x.base.z;
    const L = Math.hypot(dx, dy, dz) || 1e-6;
    return { pitch: Math.asin(dy / L) * 180 / Math.PI, yaw: Math.atan2(dx, dz) * 180 / Math.PI };
  };
  const aR = ang(pair.right);
  const aL = ang(pair.left);
  // v9s.29：主副手夹角要按「主手 vs 另一只手」算。旧版固定拿左手，lead=L 时
  // 主手就是左手 → 夹角恒为 0（seg2 被误报成「两把剑叠在一起」）。
  const off = s.lead === 'L' ? aR : aL;
  return {
    pitch, yaw, dh, len,
    leftPitch: aL ? aL.pitch : null,
    leftYaw: aL ? aL.yaw : null,
    rightPitch: aR ? aR.pitch : null,
    rightYaw: aR ? aR.yaw : null,
    offPitch: off ? off.pitch : null,
    offYaw: off ? off.yaw : null,
    seg: s.seg, kind: s.kind, strike: s.strike,
    bodyYaw: s.yaw * 180 / Math.PI,
    face: h.world.character.bodyYaw * 180 / Math.PI,
    rootYaw: s.rootYaw * 180 / Math.PI,
    spinYaw: s.spinYaw * 180 / Math.PI,
    rootTurn: s.rootTurn * 180 / Math.PI,
    lead: s.lead || 'R',
    base: main && main.base, tip: main && main.tip,
    pos: { x: h.world.character.position.x, y: h.world.character.position.y, z: h.world.character.position.z },
  };
}
"""


def probe(page, weapon: str, seg: int, progress: float, warm: int = 6,
          clip_t: float | None = None) -> dict:
    """采一帧。

    clip_t 给了就钉住剪辑时间轴（v9s.28 的 __harness.clipLab.preview t 参数），
    progress 只用来驱动 spin 这类按攻击进度推进的量。不给则沿用旧的
    progress → swingCurve → 剪辑 t 的真实映射。
    """
    opts = {"weapon": weapon, "comboIndex": seg, "progress": progress, "warm": warm}
    if clip_t is not None:
        opts["t"] = clip_t
    return page.evaluate(PROBE_JS, opts)


# v9s.34：一次 evaluate 扫完所有段。
#
# 旧实现每采一帧都要来回一次 Python↔JS，且每帧都跑 warm 次 render 让姿态混合收敛 ——
# 软件渲染（swiftshader）下一帧约 60~70ms，48 步 × 4 预热 × 9 段 = 1700+ 帧，
# 这就是九段全量要 4 分半的主因。批量后：IPC 从 400+ 次降到 1 次，
# 预热只在每段首帧做（后续 t 是连续推进的，平滑量本来就在收敛态）。
BATCH_JS = "(jobs) => {\n  const probe = " + PROBE_JS + ";\n" + """
  const out = [];
  for (const j of jobs) {
    const rows = [];
    for (let i = 0; i <= j.steps; i++) {
      const t = i / j.steps;
      const d = probe({ weapon: j.weapon, comboIndex: j.seg, progress: t,
                        warm: i === 0 ? j.warm0 : j.warmN, t });
      d.t = Math.round(t * 1e4) / 1e4;
      rows.push(d);
    }
    out.push({ weapon: j.weapon, seg: j.seg, rows });
  }
  return out;
}"""


def unwrap(values: list[float]) -> list[float]:
    out = [values[0]]
    for v in values[1:]:
        prev = out[-1]
        d = (v - prev + 180.0) % 360.0 - 180.0
        out.append(prev + d)
    return out


def rows_scan(page, weapon: str, seg: int, steps: int,
              warm0: int = 12, warm_n: int = 4) -> list[dict]:
    """单段逐帧采样（保留给调试；批量路径走 scan_many）。"""
    rows = []
    for i in range(steps + 1):
        t = i / steps
        d = probe(page, weapon, seg, t, warm=warm0 if i == 0 else warm_n, clip_t=t)
        d["t"] = round(t, 4)
        rows.append(d)
    return rows


def scan_many(page, jobs: list[dict]) -> list[dict]:
    """批量扫：一次 evaluate 跑完所有段，返回已分析好的 scan 列表。"""
    raw = page.evaluate(BATCH_JS, {"jobs": jobs}) if False else page.evaluate(BATCH_JS, jobs)
    return [analyze(r["rows"], r["weapon"], r["seg"]) for r in raw]


def analyze(rows: list[dict], weapon: str, seg: int) -> dict:
    """把逐帧原始读数算成扫角 / 仰角 / 分离角 / 关键帧下标（纯 Python，可单测）。"""
    # v9s.28：双持「两把剑是否真的张开」= 两条刃身在水平面内相对**角色朝向**的夹角。
    # 只看各自 yaw 不够 —— 两把剑可以一起指左前方，那也是「没展开」。
    def rel(y, f):
        return (y - f + 540.0) % 360.0 - 180.0

    seps = []
    for r in rows:
        if r.get("yaw") is None or r.get("leftYaw") is None:
            seps.append(None)
            continue
        rr = rel(r["yaw"], r["face"])
        ll = rel(r["leftYaw"], r["face"])
        seps.append(abs((rr - ll + 540.0) % 360.0 - 180.0))
    for r, sp in zip(rows, seps):
        r["sep"] = sp

    yaws = [r["yaw"] for r in rows if r["yaw"] is not None]
    uy = unwrap(yaws) if yaws else []
    for r, u in zip([r for r in rows if r["yaw"] is not None], uy):
        r["yawU"] = u

    pitches = [r["pitch"] for r in rows if r["pitch"] is not None]
    # v9s.55：「平扫」判据只看挥出段（t 0.15~0.95）。
    # 起手蓄势允许把剑举起来（单手剑的蓄势本来就在肩上方、剑尖朝上 40°+），
    # 拿起点帧去卡「刃身基本水平」等于禁止所有反手起手。收招帧（t=1）也不在内：
    # 挥出满帧的剑身由命中姿态决定，不是「站着举剑」。
    band = [r["pitch"] for r in rows
            if r["pitch"] is not None and 0.15 <= r.get("t", 0) <= 0.95]
    lefts = [r["leftPitch"] for r in rows if r["leftPitch"] is not None]
    spins = [abs(r["spinYaw"]) for r in rows]
    roots = [r["rootYaw"] for r in rows]
    sweep = (max(uy) - min(uy)) if uy else 0.0

    i_far = None
    if uy:
        # 只在「挥出去」的区间里挑最远点：两端是起手 / 收招，拿它们会漏掉真正的高光帧
        n = len(uy)
        a, b = int(n * 0.12), max(int(n * 0.12) + 1, int(n * 0.95))
        i_far = max(range(a, b), key=lambda k: abs(uy[k]))
    i_spin = max(range(len(rows)), key=lambda k: abs(rows[k]["spinYaw"])) if rows else 0
    i_pitch = max(range(len(rows)), key=lambda k: abs(rows[k]["pitch"] or 0)) if rows else 0

    return {
        "weapon": weapon,
        "seg": seg,
        "kind": rows[0]["kind"] if rows else "",
        "rows": rows,
        "sweep": sweep,
        "yawMin": min(uy) if uy else 0.0,
        "yawMax": max(uy) if uy else 0.0,
        "pitchMin": min(pitches) if pitches else 0.0,
        "pitchMax": max(pitches) if pitches else 0.0,
        "pitchSpan": (max(pitches) - min(pitches)) if pitches else 0.0,
        "pitchMinBand": min(band) if band else 0.0,
        "pitchMaxBand": max(band) if band else 0.0,
        "leftPitchMin": min(lefts) if lefts else None,
        "leftPitchMax": max(lefts) if lefts else None,
        "hasLeft": bool(lefts),
        # v9s.28：双剑水平分离角（相对角色朝向），只有双持 / 剑盾这种双手各有武器时才有意义
        "sepMax": max([s for s in seps if s is not None], default=None),
        "sepMin": min([s for s in seps if s is not None], default=None),
        "spinMax": max(spins) if spins else 0.0,
        "rootMin": min(roots) if roots else 0.0,
        "rootMax": max(roots) if roots else 0.0,
        "iFar": i_far,
        "iSpin": i_spin,
        "iPitch": i_pitch,
    }


def scan_seg(page, weapon: str, seg: int, steps: int,
             warm0: int = 12, warm_n: int = 4) -> dict:
    return analyze(rows_scan(page, weapon, seg, steps, warm0, warm_n), weapon, seg)


# ---------------------------------------------------------------- 截图标注

ENSURE_OVERLAY_JS = """
() => {
  let cv = document.getElementById('__cliplab_overlay');
  if (!cv) {
    cv = document.createElement('canvas');
    cv.id = '__cliplab_overlay';
    cv.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647';
    document.body.appendChild(cv);
  }
  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.floor(innerWidth * dpr);
  cv.height = Math.floor(innerHeight * dpr);
  cv.style.width = innerWidth + 'px';
  cv.style.height = innerHeight + 'px';
  return { w: innerWidth, h: innerHeight, dpr };
}
"""

DRAW_JS = """
(o) => {
  const h = window.__harness;
  const cv = document.getElementById('__cliplab_overlay');
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  const s = h.swingDebug();
  const font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';

  const pair = h.bladesWorld ? h.bladesWorld() : { right: h.bladeWorld ? h.bladeWorld() : null, left: null };
  const drawBlade = (bl, color, tag) => {
    if (!bl) return null;
    const p0 = h.projectPoint(bl.base.x, bl.base.y, bl.base.z);
    const p1 = h.projectPoint(bl.tip.x, bl.tip.y, bl.tip.z);
    const ex = p1.x - p0.x, ey = p1.y - p0.y;
    const L = Math.hypot(ex, ey) || 1;
    const p2 = { x: p1.x + ex / L * 55, y: p1.y + ey / L * 55 };

    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

    for (const [p, c] of [[p0, '#ffd60a'], [p1, color]]) {
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    const dx = bl.tip.x - bl.base.x, dy = bl.tip.y - bl.base.y, dz = bl.tip.z - bl.base.z;
    const len = Math.hypot(dx, dy, dz) || 1e-6;
    const pitch = Math.asin(dy / len) * 180 / Math.PI;
    const yaw = Math.atan2(dx, dz) * 180 / Math.PI;
    const label = `${tag}  pitch ${pitch >= 0 ? '+' : ''}${pitch.toFixed(1)}°   yaw ${yaw >= 0 ? '+' : ''}${yaw.toFixed(0)}°`;
    ctx.font = font;
    const tw = ctx.measureText(label).width;
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2 + (tag === 'L' ? 14 : -30);
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(mx + 10, my, tw + 14, 22);
    ctx.fillStyle = color;
    ctx.fillText(label, mx + 17, my + 16);
    return { pitch, yaw };
  };
  drawBlade(pair.right, '#ff3b30', 'R');
  drawBlade(pair.left, '#34c759', 'L');

  // 角色脚下的朝向箭头：判断「扫到身后」时以它为准
  const c = h.world.character.position;
  const yaw0 = h.world.character.bodyYaw;
  const a0 = h.projectPoint(c.x, c.y + 0.06, c.z);
  const a1 = h.projectPoint(c.x + Math.sin(yaw0) * 1.3, c.y + 0.06, c.z + Math.cos(yaw0) * 1.3);
  ctx.strokeStyle = 'rgba(90,200,250,0.9)';
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 6]);
  ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(a1.x, a1.y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#5ac8fa';
  ctx.font = '600 12px ui-monospace, monospace';
  ctx.fillText('facing', a1.x + 6, a1.y - 4);

  // 左上角 HUD
  const lines = [
    `${o.weapon} · seg ${o.seg} · ${o.kind}`,
    `t ${o.t.toFixed(3)}   strike ${o.strike.toFixed(2)}`,
    `rootYaw ${s.rootYaw >= 0 ? '+' : ''}${(s.rootYaw * 180 / Math.PI).toFixed(1)}°   spin ${(s.spinYaw * 180 / Math.PI).toFixed(1)}°`,
    `swingYaw ${(s.yaw * 180 / Math.PI).toFixed(1)}°   torsoPitch ${(s.pitch * 180 / Math.PI).toFixed(1)}°`,    o.extra || '',
  ].filter(Boolean);

  ctx.font = font;
  let wmax = 0;
  for (const l of lines) wmax = Math.max(wmax, ctx.measureText(l).width);
  ctx.fillStyle = 'rgba(0,0,0,0.68)';
  ctx.fillRect(16, 16, wmax + 26, lines.length * 21 + 16);
  ctx.fillStyle = '#fff';
  lines.forEach((l, i) => ctx.fillText(l, 29, 40 + i * 21));

  return true;
}
"""


def draw_overlay(page, weapon: str, seg: int, t: float, extra: str = "") -> None:
    page.evaluate(ENSURE_OVERLAY_JS)
    page.evaluate(
        DRAW_JS,
        {
            "weapon": weapon,
            "seg": seg,
            "t": t,
            "kind": page.evaluate("() => window.__harness.clipLab.clips() && (window.__harness.swingDebug().kind || '')"),
            "strike": page.evaluate("() => window.__harness.swingDebug().strike"),
            "extra": extra,
        },
    )


def hide_overlay(page) -> None:
    page.evaluate(
        "() => { const cv = document.getElementById('__cliplab_overlay'); if (cv) cv.remove(); }"
    )


# ---------------------------------------------------------------- 页面启动


# v9s.34：给每次启动打一个唯一 user-data-dir，收工时按它精确杀进程（见 shutdown）
_LAUNCH_MARKERS: list[str] = []


def launch(headed: bool = False, width: int = 1280, height: int = 800):
    from playwright.sync_api import sync_playwright

    # v9s.35：**必须先摘掉 DISPLAY**。
    # 沙箱里 DISPLAY=:0 是给桌面/截图工具留的，但无头 chromium 看到它会尝试走
    # X11 的 EGL（GLX）路径，报 `eglInitialize SwANGLE failed: EGL_NOT_INITIALIZED`，
    # 随后 THREE 拿不到 WebGL 上下文、整个页面停在空 #app 上 —— 现象是
    # 「页面没准备好（harness: False）」，看着像构建坏了，其实是显卡后端选错。
    # 无头 + swiftshader 时没有 DISPLAY 才会走真正的软件光栅。
    if not headed:
        os.environ.pop("DISPLAY", None)

    pw = sync_playwright().start()
    # 不能直接传 --user-data-dir（Playwright 会拒绝），用一个独一无二的 UA 当进程标记：
    # 它会原样出现在 chromium 的命令行里，pkill -f 可以精确匹配到这一次启动的进程。
    marker = f"cliplab-{os.getpid()}-{len(_LAUNCH_MARKERS)}"
    _LAUNCH_MARKERS.append(marker)
    browser = pw.chromium.launch(
        headless=not headed,
        executable_path=os.environ.get("CLIP_LAB_CHROMIUM") or None,
        args=[
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--enable-unsafe-swiftshader",
            "--use-gl=angle",
            "--use-angle=swiftshader",
            f"--user-agent={marker}",
        ],
    )
    page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
    errors: list[str] = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append("console.error: " + m.text) if m.type == "error" else None)
    return pw, browser, page, errors


def shutdown(pw, browser, budget: float = 3.0) -> None:
    """v9s.34：收工不再等 Playwright 的优雅关闭。

    软件渲染（swiftshader）下 `browser.close()` / `pw.stop()` 都会卡在一个 **30s** 的超时上
    等渲染器放手 —— 实测九段全量 38s 里 30s 花在这里，真正干活只有 8s。
    现在按启动时打的 `--user-data-dir` 标记精确杀掉浏览器进程（毫秒级），
    再把 `pw.stop()` 丢到守护线程里收尾；杀不掉也不会阻塞退出。
    """
    import signal
    import subprocess
    import threading

    for marker in list(_LAUNCH_MARKERS):
        try:
            subprocess.run(["pkill", "-9", "-f", marker], check=False,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass
    _LAUNCH_MARKERS.clear()

    def _stop() -> None:
        try:
            pw.stop()
        except Exception:
            pass

    th = threading.Thread(target=_stop, daemon=True)
    th.start()
    th.join(budget)
    # 注意：这里**不要**再调 browser.close() —— 浏览器已被杀掉后它会永久阻塞，
    # 之前就因此把 8s 的检查拖成 5 分钟。
    del browser, signal


def open_game(page, url: str) -> None:
    page.goto(url, wait_until="load", timeout=60000)
    try:
        page.wait_for_function(
            "() => !!(window.__harness && window.__harness.clipLab && window.__harness.projectPoint)",
            timeout=30000,
        )
    except Exception:
        state = page.evaluate(
            "() => ({ harness: !!window.__harness, clipLab: !!(window.__harness && window.__harness.clipLab),"
            " proj: !!(window.__harness && window.__harness.projectPoint), canvas: !!document.querySelector('canvas') })"
        )
        raise SystemExit(f"页面没准备好（{state}），先 npm run build 再试")
    page.wait_for_timeout(600)
    # 固定朝向 + 推近 + 隐藏 UI：截图只留角色与标注，不同轮次可直接叠图比较。
    # 相机压到 18° 低俯角 —— 游戏默认 50° 斜俯视会把水平横扫投影成斜线，
    # 工具里必须能「水平就是水平」，否则又回到靠肉眼猜。
    page.evaluate(
        """() => {
          const h = window.__harness;
          document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = 'none'; });
          const vb = document.getElementById('version-badge');
          if (vb) vb.style.display = 'none';
          if (h.viewConfig && h.viewConfig.camera) {
            h.viewConfig.camera.pitchDeg = 18;
            h.viewConfig.camera.yawDeg = 28;
          }
          h.clipLab.face(Math.PI * 0.5);
          h.clipLab.zoom(0.55);
          h.clipLab.preview({ weapon: 'greatsword', comboIndex: 1, progress: 0, warm: 60 });
        }"""
    )


def combo_name(page, weapon: str, seg: int) -> str:
    try:
        return page.evaluate(
            """(o) => {
              const s = window.__harness.viewConfig.animation.swing;
              const ref = s && s.combo && s.combo[o.weapon] ? s.combo[o.weapon][o.seg - 1] : null;
              if (!ref) return '';
              return typeof ref === 'string' ? ref : (ref.clip || '');
            }""",
            {"weapon": weapon, "seg": seg},
        )
    except Exception:
        return ""


# ---------------------------------------------------------------- 规则判定


def judge(scan: dict) -> tuple[bool, list[str]]:
    rule = SEG_RULES.get((scan["weapon"], scan["seg"]), {})
    notes: list[str] = []
    ok = True

    if "min_sweep" in rule:
        if scan["sweep"] < rule["min_sweep"]:
            ok = False
            notes.append(f"扫角 {scan['sweep']:.0f}° < {rule['min_sweep']}°")
    if "max_sweep" in rule:
        if scan["sweep"] > rule["max_sweep"]:
            ok = False
            notes.append(f"扫角 {scan['sweep']:.0f}° > {rule['max_sweep']}°（本该是前顶）")
    if "max_pitch" in rule:
        worst = max(abs(scan.get("pitchMinBand", scan["pitchMin"])),
                    abs(scan.get("pitchMaxBand", scan["pitchMax"])))
        if worst > rule["max_pitch"]:
            ok = False
            notes.append(f"刃身仰角 {worst:.0f}° > {rule['max_pitch']}°（不是平扫）")
    if "min_pitch_span" in rule:
        if scan["pitchSpan"] < rule["min_pitch_span"]:
            ok = False
            notes.append(f"仰角跨度 {scan['pitchSpan']:.0f}° < {rule['min_pitch_span']}°")
    if "min_spin" in rule:
        if scan["spinMax"] < rule["min_spin"]:
            ok = False
            notes.append(f"整圈 {scan['spinMax']:.0f}° < {rule['min_spin']}°")

    if not notes:
        notes.append("符合预期")
    return ok, notes


# ---------------------------------------------------------------- 输出


def fmt(v: float, nd: int = 0) -> str:
    return f"{v:+.{nd}f}"


def write_report(out_dir: Path, payload: dict) -> Path:
    md = []
    md.append("# clip-lab 报告\n")
    md.append(f"- 生成：{payload['time']}")
    md.append(f"- 版本：`{payload['version']}`")
    md.append(f"- 页面：{payload['url']}")
    md.append(f"- 采样：每段 {payload['steps']} 步（progress 0→1）\n")

    md.append("## 结论\n")
    md.append("| 武器 | 段 | 剪辑 | 类型 | 扫角 | 刃身仰角 R / L | 整体带转 | spin | 结论 |")
    md.append("|---|---|---|---|---|---|---|---|---|")
    for s in payload["scans"]:
        rule = SEG_RULES.get((s["weapon"], s["seg"]), {})
        ok, notes = s["judge"]
        left = (
            f"{s['leftPitchMin']:+.0f}° ~ {s['leftPitchMax']:+.0f}°"
            if s.get("hasLeft") else "—"
        )
        md.append(
            f"| {WEAPON_LABEL.get(s['weapon'], s['weapon'])} | {s['seg']} | `{s['clip']}` | "
            f"{rule.get('label', s['kind'])} | **{s['sweep']:.0f}°** | "
            f"R {s['pitchMin']:+.0f}° ~ {s['pitchMax']:+.0f}°<br>L {left} | "
            f"{s['rootMin']:+.0f}° ~ {s['rootMax']:+.0f}° | {s['spinMax']:.0f}° | "
            f"{'✅ PASS' if ok else '❌ FAIL'} |"
        )
    md.append("")

    bad = [s for s in payload["scans"] if not s["judge"][0]]
    if bad:
        md.append("### 失败原因\n")
        for s in bad:
            md.append(f"- **{s['weapon']} seg{s['seg']}**：{'；'.join(s['judge'][1])}")
        md.append("")

    if payload.get("errors"):
        md.append("### 页面错误\n")
        for e in payload["errors"][:10]:
            md.append(f"- `{e}`")
        md.append("")

    md.append("## 逐段明细\n")
    for s in payload["scans"]:
        md.append(f"### {s['weapon']} · seg {s['seg']} · `{s['clip']}`\n")
        md.append(f"- 扫角 **{s['sweep']:.1f}°**（{s['yawMin']:+.0f}° → {s['yawMax']:+.0f}°，已 unwrap）")
        md.append(f"- 刃身仰角 R {s['pitchMin']:+.1f}° ~ {s['pitchMax']:+.1f}°"
                  + (f"；L {s['leftPitchMin']:+.1f}° ~ {s['leftPitchMax']:+.1f}°" if s.get("hasLeft") else ""))
        md.append(f"- 整体带转 {s['rootMin']:+.1f}° ~ {s['rootMax']:+.1f}°；spin 峰值 {s['spinMax']:.1f}°")
        md.append(f"- 端点高度差 {max(abs(r['dh']) for r in s['rows'] if r['dh'] is not None):.3f} m（越接近 0 越水平）")
        if s.get("shots"):
            md.append("- 关键帧：")
            for p, cap in s["shots"]:
                md.append(f"  - `{p}` — {cap}")
        md.append("")

    md.append("## 怎么读这些数\n")
    md.append("- `扫角`：刃尖水平朝向从最小值到最大值的总跨度，**已 unwrap**，可超过 180°。")
    md.append("- `仰角`：刃身相对水平面的真实夹角，由刃根 / 刃尖世界坐标算，不受相机角度影响。")
    md.append("- `整体带转`：`root.rotation.y` 里的语义部分（不含 spin），大 = 整个人在转身而不只是拧腰。")
    md.append("- `spin`：剪辑级整圈旋转，`360°` 表示转了整圈（`2π ≡ 0`，收招不残留）。")
    md.append("- 截图上的红线 = 刃身真实延长线；虚线 = 角色朝向。**用它们判断前后，不要靠投影直觉。**")
    md.append("")

    path = out_dir / "report.md"
    path.write_text("\n".join(md), encoding="utf-8")
    return path


def version_of() -> str:
    try:
        return json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
    except Exception:
        return "?"


def run_scans(page, weapons: list[str], segs_map: dict[str, list[int]], steps: int,
              warm0: int = 12, warm_n: int = 2) -> list[dict]:
    """批量扫多段：一次 evaluate 跑完，IPC 从「每帧一次」降到「每批一次」。"""
    jobs = [{"weapon": w, "seg": seg, "steps": steps, "warm0": warm0, "warmN": warm_n}
            for w in weapons for seg in segs_map[w]]
    return scan_many(page, jobs)


def attach_shots(page, out_dir: Path, scan: dict, keyframes: bool) -> list[tuple[str, str]]:
    """给一段扫过的结果挑关键帧截图。返回 [(相对路径, 说明)]"""
    shots: list[tuple[str, str]] = []
    seg, w = scan["seg"], scan["weapon"]
    shots_dir = out_dir / "shots"
    shots_dir.mkdir(parents=True, exist_ok=True)

    # 固定抓「起手 / 中段 / 收招」，再补该段真正的极值帧（最远扫角、spin 峰值、仰角极值）。
    # 固定中段是刻意的：只有端点的话，看不到剪接中段到底有没有做到位。
    picks: list[tuple[float, str]] = [
        (0.0, "t=0 起手"),
        (0.5, "t=0.5 中段"),
        (1.0, "t=1 收招"),
    ]
    if scan["iFar"] is not None:
        far = scan["rows"][scan["iFar"]]
        picks.append((far["t"], f"扫到最远（yaw {far['yawU']:+.0f}°）"))
    if scan["kind"] == "spin":
        sp = scan["rows"][scan["iSpin"]]
        picks.append((sp["t"], f"spin {sp['spinYaw']:.0f}°"))
    if scan["pitchSpan"] >= 40:
        pp = scan["rows"][scan["iPitch"]]
        picks.append((pp["t"], f"仰角极值 {pp['pitch']:+.0f}°"))

    picked: dict[float, str] = {}
    for t, cap in picks:
        key = round(t, 3)
        if key not in picked:
            picked[key] = cap

    seen = set()
    for t, cap in sorted(picked.items()):
        key = round(t, 3)
        if key in seen:
            continue
        seen.add(key)
        # v9s.28：截图必须和 scan 采样同一帧语义（钉剪辑 t），否则扫出来 250°、
        # 截到的却是 swingCurve 映射到的另一帧。
        d = probe(page, w, seg, t, warm=45, clip_t=t)
        extra = f"sweep {scan['sweep']:.0f}°   range {scan['yawMin']:+.0f}° → {scan['yawMax']:+.0f}°"
        draw_overlay(page, w, seg, t, extra)
        name = f"{w}_seg{seg}_t{key:.2f}.png".replace(".", "_", 0)
        name = f"{w}_seg{seg}_t{str(key).replace('.', 'p')}.png"
        path = shots_dir / name
        page.screenshot(path=str(path))
        shots.append((str(path.relative_to(out_dir)), cap))
    hide_overlay(page)
    return shots


# ---------------------------------------------------------------- 命令


def cmd_scan(args) -> int:
    with StaticServer() as srv:
        pw, browser, page, errors = launch(args.headed)
        try:
            open_game(page, srv.url)
            scan = run_scans(page, [args.weapon], {args.weapon: [args.seg]},
                             args.steps, args.warm0, args.warm_n)[0]
            scan["clip"] = combo_name(page, args.weapon, args.seg)
            ok, notes = judge(scan)
            scan["judge"] = (ok, notes)

            out_dir = OUT_ROOT / f"scan-{args.weapon}-seg{args.seg}-{time.strftime('%m%d-%H%M%S')}"
            out_dir.mkdir(parents=True, exist_ok=True)
            if args.shots:
                scan["shots"] = attach_shots(page, out_dir, scan, True)
            else:
                scan["shots"] = []

            payload = {
                "time": time.strftime("%Y-%m-%d %H:%M:%S"),
                "version": version_of(),
                "url": srv.url,
                "steps": args.steps,
                "scans": [scan],
                "errors": errors,
            }
            (out_dir / "report.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
            write_report(out_dir, payload)

            print(f"{args.weapon} seg{args.seg}  {scan['clip']}")
            print(f"  扫角 {scan['sweep']:.1f}°  仰角 {scan['pitchMin']:+.1f}~{scan['pitchMax']:+.1f}°  "
                  f"带转 {scan['rootMin']:+.1f}~{scan['rootMax']:+.1f}°  spin {scan['spinMax']:.1f}°")
            print(f"  {'PASS' if ok else 'FAIL'}: {'；'.join(notes)}")
            print(f"  报告 {out_dir / 'report.md'}")
            if errors:
                print(f"  页面错误 {errors[:3]}")
            return 0 if ok else 1
        finally:
            _tc = time.time()
            shutdown(pw, browser)
            if os.environ.get("CLIP_LAB_TIMING"):
                print(f"  （清理 {time.time() - _tc:.1f}s）")


def cmd_shot(args) -> int:
    with StaticServer() as srv:
        pw, browser, page, errors = launch(args.headed)
        try:
            open_game(page, srv.url)
            out_dir = OUT_ROOT / f"shot-{args.weapon}-seg{args.seg}-{time.strftime('%m%d-%H%M%S')}"
            out_dir.mkdir(parents=True, exist_ok=True)

            if args.keyframes:
                scan = scan_seg(page, args.weapon, args.seg, args.steps)
                scan["clip"] = combo_name(page, args.weapon, args.seg)
                scan["judge"] = judge(scan)
                shots = attach_shots(page, out_dir, scan, True)
            else:
                d = probe(page, args.weapon, args.seg, args.progress, warm=45, clip_t=args.progress)
                extra = f"pitch {d['pitch']:+.1f}°   yaw {d['yaw']:+.0f}°"
                draw_overlay(page, args.weapon, args.seg, args.progress, extra)
                p = out_dir / f"{args.weapon}_seg{args.seg}_t{str(args.progress).replace('.', 'p')}.png"
                page.screenshot(path=str(p))
                shots = [(str(p.relative_to(out_dir)), f"t={args.progress}")]
                hide_overlay(page)

            print(f"截图 {out_dir}")
            for p, cap in shots:
                print(f"  {p}  {cap}")
            if errors:
                print(f"页面错误 {errors[:3]}")
            return 0
        finally:
            shutdown(pw, browser)


def cmd_check(args) -> int:
    weapons = [w for w in WEAPON_SEGS if not args.weapon or w == args.weapon]
    t_start = time.time()
    t_launch = t_open = 0.0
    with StaticServer() as srv:
        t0 = time.time()
        pw, browser, page, errors = launch(args.headed)
        t_launch = time.time() - t0
        try:
            t0 = time.time()
            open_game(page, srv.url)
            t_open = time.time() - t0
            out_dir = OUT_ROOT / f"check-{time.strftime('%m%d-%H%M%S')}"
            out_dir.mkdir(parents=True, exist_ok=True)

            scans = []
            # v9s.34：先一次 evaluate 批量扫完，再逐段判定 / 截图（判定要保持顺序）
            _t0 = time.time()
            _batch = {(x["weapon"], x["seg"]): x
                      for x in run_scans(page, weapons, WEAPON_SEGS, args.steps,
                                         args.warm0, args.warm_n)}
            _scan_s = time.time() - _t0
            for w in weapons:
                for seg in WEAPON_SEGS[w]:
                    s = _batch[(w, seg)]
                    s["clip"] = combo_name(page, w, seg)
                    ok, notes = judge(s)
                    s["judge"] = (ok, notes)
                    s["shots"] = attach_shots(page, out_dir, s, True) if args.shots else []
                    scans.append(s)
                    print(f"  {w} seg{seg} 扫角 {s['sweep']:6.1f}°  "
                          f"仰角 {s['pitchMin']:+5.1f}~{s['pitchMax']:+5.1f}°  "
                          f"spin {s['spinMax']:5.1f}°  {'PASS' if ok else 'FAIL'}")

            payload = {
                "time": time.strftime("%Y-%m-%d %H:%M:%S"),
                "version": version_of(),
                "url": srv.url,
                "steps": args.steps,
                "scans": scans,
                "errors": errors,
            }
            (out_dir / "report.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
            md = write_report(out_dir, payload)

            # v9s.34：耗时拆开打印 —— 优化前这里是「一个总数」，看不出瓶颈在扫描还是截图
            print(f"  （{len(scans)} 段 × {args.steps} 步：扫描 {_scan_s:.1f}s / "
                  f"启动 {t_launch:.1f}s / 加载 {t_open:.1f}s / 截图 "
                  f"{'开' if args.shots else '关'} / 预热 {args.warm0}+{args.warm_n}）")
            print(f"  （总 {time.time() - t_start:.1f}s，含清理）")
            failed = [s for s in scans if not s["judge"][0]]
            print()
            print(f"{'全部通过' if not failed else f'{len(failed)} 段未过'}  报告 {md}")
            if errors:
                print(f"页面错误 {errors[:3]}")
            return 0 if not failed and not errors else 1
        finally:
            _tc = time.time()
            shutdown(pw, browser)
            if os.environ.get("CLIP_LAB_TIMING"):
                print(f"  （清理 {time.time() - _tc:.1f}s）")


def cmd_combo(args) -> int:
    """v9s.28：连击结构检查（锚点衔接 / 节奏配比 / 主副手平衡）。

    这三项对应「动作好看不好看」里最容易被忽略、又最适合量化检查的部分：
      1. **锚点衔接**：上一段收势姿态与下一段起手姿态的差。差太大，换段那一下
         只能靠 `segBlend`（默认 0.08s）硬掩，观感是「闪一下」。
      2. **节奏配比**：前摇 / 挥击 / 保持 / 收势各占多少。全都一样长的三连，
         读起来就是「同一个动作点三下」。
      3. **主副手平衡**：双持时主手挥出、副手必须往另一侧（或同侧后方）分开，
         否则两把剑叠在一起，既不舒展也不平衡。
    """
    cfg_path = Path(__file__).resolve().parents[2] / "config" / "game.json"
    game = json.loads(cfg_path.read_text(encoding="utf-8"))
    weapons_cfg = game["core"]["combat"]["weapons"]

    weapons = [args.weapon] if args.weapon else list(WEAPON_SEGS)
    with StaticServer() as srv:
        pw, browser, page, errors = launch(args.headed)
        try:
            open_game(page, srv.url)
            out_dir = OUT_ROOT / f"combo-{time.strftime('%m%d-%H%M%S')}"
            out_dir.mkdir(parents=True, exist_ok=True)

            def rel(y: float, f: float) -> float:
                return (y - f + 540.0) % 360.0 - 180.0

            rows: list[dict] = []
            for w in weapons:
                segs = WEAPON_SEGS[w]
                ends = []
                mids = []
                for seg in segs:
                    d0 = probe(page, w, seg, 0.0, warm=45, clip_t=0.0)
                    # 段末不能取 t=1：连击在 cancelWindow（默认 progress 0.45）之后就允许
                    # 接下一段，那时剪辑 t 才走到 0.64 左右。这里按**真实映射**采样，
                    # 拿到的才是「玩家连打时真正会看到的那一帧」。
                    d1 = probe(page, w, seg, 0.45, warm=45)
                    dm = probe(page, w, seg, 0.5, warm=45, clip_t=0.5)
                    ends.append((d0, d1))
                    mids.append(dm)

                for i, seg in enumerate(segs):
                    d0, d1 = ends[i]
                    nxt = ends[i + 1][0] if i + 1 < len(segs) else None
                    link = None
                    body_link = None
                    if nxt:
                        y1 = rel(d1["yaw"], d1["face"])
                        y2 = rel(nxt["yaw"], nxt["face"])
                        link = abs((y1 - y2 + 540.0) % 360.0 - 180.0)
                        # v9s.34：把「身体朝向」和「刃身朝向」拆开看。
                        # 身体的连续性才是玩家读到的「动作接上了没有」；刃身那条天然很大，
                        # 因为段首的 strike 曲线 ≈ 0，姿态按 strike 淡入，剑必然回到接近中位。
                        body_link = abs((d1["face"] - nxt["face"] + 540.0) % 360.0 - 180.0)
                    dm = mids[i]
                    sep = None
                    if dm.get("yaw") is not None and dm.get("offYaw") is not None:
                        sep = abs((rel(dm["yaw"], dm["face"]) - rel(dm["offYaw"], dm["face"]) + 540.0) % 360.0 - 180.0)
                    rows.append({
                        "weapon": w, "seg": seg, "link": link, "bodyLink": body_link, "sep": sep,
                        "clip": combo_name(page, w, seg),
                        "endYaw": rel(d1["yaw"], d1["face"]) if d1.get("yaw") is not None else None,
                        "startYaw": rel(d0["yaw"], d0["face"]) if d0.get("yaw") is not None else None,
                    })

            # ---- 节奏：windup / active / recovery + swingCurve 的固定分段 ----
            rhythm = []
            for w in weapons:
                wc = weapons_cfg.get(w, {})
                wind, act, rec = wc.get("windup", 0), wc.get("active", 0), wc.get("recovery", 0)
                total = wind + act + rec
                if total <= 0:
                    rhythm.append({"weapon": w, "ok": None})
                    continue
                rhythm.append({
                    "weapon": w,
                    "windup": wind / total * 100,
                    "active": act / total * 100,
                    "recovery": rec / total * 100,
                    "total": total,
                    # 推荐：前摇 18~38%、挥击 15~32%、收势 40~60%。
                    # 收势太短会「刹不住」，太长读起来拖沓；挥击占比过大则没有爆发。
                    "ok": (18 <= wind / total * 100 <= 38
                           and 15 <= act / total * 100 <= 32
                           and 40 <= rec / total * 100 <= 60),
                })

            # 阈值只是「提醒线」不是「门禁线」：段首的幅度由 attackBlend 淡入，
            # 天然比段末的满幅姿态更接近中位，所以相邻段首末必然有几十度的差。
            # 这里给的是「靠 0.08s 的 segBlend 能不能掩住」的经验值。
            LINK_WARN, LINK_FAIL = 70.0, 130.0
            SEP_MIN = 45.0
            bad = 0
            md = ["# 连击结构检查", ""]
            md.append(f"- 生成：{time.strftime('%Y-%m-%d %H:%M:%S')}")
            md.append(f"- 版本：`{version_of()}`")
            md.append("")
            md.append("## 1. 锚点衔接（上段收势 → 下段起手）")
            md.append("")
            md.append("| 武器 | 段 | 剪辑 | 上段末刃身 | 刃身跳变 | 身体跳变 | 结论 |")
            md.append("|---|---|---|---|---|---|---|")
            for r in rows:
                if r["link"] is None:
                    continue
                ok = r["link"] <= LINK_WARN
                if r["link"] > LINK_FAIL:
                    bad += 1
                bl = r.get("bodyLink")
                bl_txt = f"{bl:.0f}°" if bl is not None else "—"
                tag = "✅" if ok else ("❌ >130°" if r["link"] > LINK_FAIL else "⚠️ >70°")
                md.append(
                    f"| {WEAPON_LABEL.get(r['weapon'], r['weapon'])} | {r['seg']} | `{r['clip']}` | "
                    f"{r['endYaw']:+.0f}° | **{r['link']:.0f}°** | {bl_txt} | {tag} |"
                )
            md.append("")
            md.append("> **刃身跳变** = 上段「最早可取消时刻」的刃身朝向 vs 下段起手朝向，"
                      "≤70° 时 `segBlend`（默认 0.08s）够用；**>130° 会看成闪一下**。"
                      "这条天然偏大：段首姿态按 `strike` 曲线淡入（t=0 时 ≈0），剑必然回到接近中位，"
                      "而段末是满幅 —— 所以它衡量的其实是「淡入过程中的位移量」，不是数据错误。")
            md.append(">")
            md.append("> **身体跳变** 才是「动作有没有接上」的直接读数："
                      "上段末 `bodyYaw` vs 下段起 `bodyYaw`。三连击若在十级以内，"
                      "说明躯干是连续转过去的，刃身那条大数字只是淡入造成的视觉过渡。")
            md.append(">")
            md.append("> 想让刃身那条也变小：把段首姿态往「上一段收势方向」写，"
                      "或缩短 `cancelWindow` 之后的收势（让可取消时剑还没收那么远）。")
            md.append("")

            md.append("## 2. 节奏配比（前摇 / 挥击 / 收势）")
            md.append("")
            md.append("| 武器 | 前摇 | 挥击 | 收势 | 总时长 | 结论 |")
            md.append("|---|---|---|---|---|---|")
            for r in rhythm:
                if r.get("ok") is None:
                    continue
                md.append(
                    f"| {WEAPON_LABEL.get(r['weapon'], r['weapon'])} | {r['windup']:.0f}% | "
                    f"{r['active']:.0f}% | {r['recovery']:.0f}% | {r['total']:.2f}s | "
                    f"{'✅' if r['ok'] else '⚠️ 偏离 18~38 / 15~32 / 40~60'} |"
                )
            md.append("")
            md.append("> 三连击如果每段配比完全一样，读起来是「同一个动作点三下」。"
                      "常见做法：第一击快、第二击更快（承接动量）、第三击重（前摇更长、收势更长）。")
            md.append("")

            md.append("## 3. 主副手平衡（中段刃身夹角）")
            md.append("")
            md.append("| 武器 | 段 | 主/副手夹角 | 结论 |")
            md.append("|---|---|---|---|")
            for r in rows:
                if r["sep"] is None:
                    md.append(f"| {WEAPON_LABEL.get(r['weapon'], r['weapon'])} | {r['seg']} | —（单手或双手同柄） | — |")
                    continue
                need = SEP_MIN if r["weapon"] == "dual-swords" else 0.0
                md.append(
                    f"| {WEAPON_LABEL.get(r['weapon'], r['weapon'])} | {r['seg']} | "
                    f"**{r['sep']:.0f}°** | {'✅' if r['sep'] >= need else '⚠️ 两把剑叠在一起'} |"
                )
            md.append("")
            md.append("> 双持要求 ≥45°：主手挥出时副手必须分开，否则两把剑视觉上重合。")
            md.append("")

            if errors:
                md.append("## 页面错误")
                md.append("")
                for e in errors[:5]:
                    md.append(f"- `{e}`")

            path = out_dir / "report.md"
            path.write_text("\n".join(md), encoding="utf-8")
            (out_dir / "report.json").write_text(
                json.dumps({"rows": rows, "rhythm": rhythm, "errors": errors},
                           ensure_ascii=False, indent=2), encoding="utf-8")

            for r in rows:
                if r["link"] is None:
                    continue
                print(f"  {r['weapon']:14s} seg{r['seg']} 衔接跳变 {r['link']:5.1f}°"
                      + (f"   主副手 {r['sep']:5.1f}°" if r["sep"] is not None else ""))
            print()
            print(f"报告 {path}")
            # 连击衔接是艺术判断，工具只给数值不做拦截；只有页面报错才非零退出。
            return 0 if not errors else 1
        finally:
            shutdown(pw, browser)


def cmd_selftest(args) -> int:
    """不需要浏览器的纯逻辑自检，可进 CI。"""
    checks: list[tuple[str, bool]] = []

    def eq(name: str, got, want) -> None:
        checks.append((name, got == want))

    eq("unwrap 跨 180°", unwrap([170.0, -170.0]), [170.0, 190.0])
    eq("unwrap 往返", unwrap([-10.0, 10.0, -10.0]), [-10.0, 10.0, -10.0])
    eq("unwrap 单调", unwrap([0.0, 90.0, 180.0, 270.0]), [0.0, 90.0, 180.0, 270.0])

    ok, _ = judge({"weapon": "greatsword", "seg": 1, "sweep": 200, "pitchMin": -2, "pitchMax": 8,
                   "pitchSpan": 10, "spinMax": 0})
    eq("横扫达标 PASS", ok, True)

    ok2, notes2 = judge({"weapon": "greatsword", "seg": 1, "sweep": 90, "pitchMin": -2, "pitchMax": 8,
                         "pitchSpan": 10, "spinMax": 0})
    eq("横扫不足 FAIL", ok2, False)
    checks.append(("失败带原因", bool(notes2) and "扫角" in notes2[0]))

    ok3, _ = judge({"weapon": "sword-shield", "seg": 3, "sweep": 120, "pitchMin": 0, "pitchMax": 8,
                    "pitchSpan": 8, "spinMax": 0})
    eq("盾顶扫角过大 FAIL", ok3, False)

    ok4, _ = judge({"weapon": "dual-swords", "seg": 3, "sweep": 340, "pitchMin": -5, "pitchMax": 5,
                    "pitchSpan": 10, "spinMax": 360})
    eq("旋身达标 PASS", ok4, True)

    eq("扫角规则表覆盖所有段", set(SEG_RULES) == {(w, s) for w, ss in WEAPON_SEGS.items() for s in ss}, True)

    for name, good in checks:
        print(f"  {'ok ' if good else 'FAIL'}  {name}")
    failed = [n for n, g in checks if not g]
    print(f"{len(checks) - len(failed)}/{len(checks)} 通过")
    return 0 if not failed else 1


def main() -> int:
    import atexit
    if os.environ.get("CLIP_LAB_TIMING"):
        _t0 = time.time()
        atexit.register(lambda: print(f"  （进程退出 {time.time() - _t0:.1f}s）"))
    # Linux 上没有可用 X 时，Chromium 的 WebGL 会静默起不来（页面白屏、harness 不存在）。
    # 这里自动套一层 xvfb-run，调用方不用记这个坑。
    if (
        sys.platform.startswith("linux")
        and os.environ.get("CLIP_LAB_XVFB") != "1"
        and "--headed" not in sys.argv
        and "selftest" not in sys.argv
        and shutil.which("xvfb-run")
    ):
        os.environ["CLIP_LAB_XVFB"] = "1"
        os.execvp("xvfb-run", ["xvfb-run", "-a", sys.executable, *sys.argv])

    ap = argparse.ArgumentParser(description="clip-lab：动作剪辑验证台")
    ap.add_argument("--headed", action="store_true", help="显示浏览器窗口（默认 headless）")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_scan = sub.add_parser("scan", help="扫一段的逐帧角度")
    p_scan.add_argument("--weapon", required=True, choices=list(WEAPON_LABEL))
    p_scan.add_argument("--seg", type=int, required=True, choices=[1, 2, 3])
    p_scan.add_argument("--steps", type=int, default=48)
    p_scan.add_argument("--warm0", type=int, default=12, help="每段首帧预热渲染次数")
    p_scan.add_argument("--warm-n", type=int, default=2, dest="warm_n",
                        help="后续帧预热次数（默认 2；实测与 4 的差 <1°，但快 1.3 倍）")
    p_scan.add_argument("--shots", action="store_true", help="同时出关键帧截图")
    p_scan.set_defaults(func=cmd_scan)

    p_shot = sub.add_parser("shot", help="定格截图")
    p_shot.add_argument("--weapon", required=True, choices=list(WEAPON_LABEL))
    p_shot.add_argument("--seg", type=int, required=True, choices=[1, 2, 3])
    p_shot.add_argument("--progress", type=float, default=0.5)
    p_shot.add_argument("--keyframes", action="store_true", help="自动挑起手/最远/spin/收招")
    p_shot.add_argument("--steps", type=int, default=48)
    p_shot.set_defaults(func=cmd_shot)

    p_check = sub.add_parser("check", help="跑全部段的验收规则")
    p_check.add_argument("--weapon", choices=list(WEAPON_LABEL))
    p_check.add_argument("--steps", type=int, default=48)
    p_check.add_argument("--warm0", type=int, default=12, help="每段首帧预热渲染次数")
    p_check.add_argument("--warm-n", type=int, default=2, dest="warm_n",
                         help="后续帧预热次数（默认 2；实测与 4 的差 <1°，但快 1.3 倍）")
    p_check.add_argument("--shots", action="store_true", default=False,
                         help="同时出关键帧截图（软件渲染下每张约 3s，默认关）")
    p_check.set_defaults(func=cmd_check)

    p_combo = sub.add_parser("combo", help="连击结构检查（锚点衔接 / 节奏 / 平衡）")
    p_combo.add_argument("--weapon", choices=list(WEAPON_LABEL))
    p_combo.set_defaults(func=cmd_combo)

    p_self = sub.add_parser("selftest", help="纯逻辑自检（不需要浏览器）")
    p_self.set_defaults(func=cmd_selftest)

    args = ap.parse_args()
    code = args.func(args)
    # v9s.34：守护线程 / 已杀掉的浏览器可能拖着解释器不退出，这里直接硬退（报告已落盘）
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(code)


if __name__ == "__main__":
    raise SystemExit(main())
