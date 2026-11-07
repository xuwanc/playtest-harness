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
    ("dual-swords", 3): {"min_spin": 340, "min_sweep": 300, "max_pitch": 30, "label": "展开旋身"},
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
  let pitch = null, yaw = null, dh = null, len = null;
  if (b) {
    const dx = b.tip.x - b.base.x, dy = b.tip.y - b.base.y, dz = b.tip.z - b.base.z;
    len = Math.hypot(dx, dy, dz) || 1e-6;
    pitch = Math.asin(dy / len) * 180 / Math.PI;
    yaw = Math.atan2(dx, dz) * 180 / Math.PI;
    dh = b.tip.y - b.base.y;
  }
  const s = h.swingDebug();
  const pair = h.bladesWorld ? h.bladesWorld() : { right: b, left: null };
  const ang = (x) => {
    if (!x) return null;
    const dx = x.tip.x - x.base.x, dy = x.tip.y - x.base.y, dz = x.tip.z - x.base.z;
    const L = Math.hypot(dx, dy, dz) || 1e-6;
    return { pitch: Math.asin(dy / L) * 180 / Math.PI, yaw: Math.atan2(dx, dz) * 180 / Math.PI };
  };
  const aR = ang(pair.right);
  const aL = ang(pair.left);
  return {
    pitch, yaw, dh, len,
    leftPitch: aL ? aL.pitch : null,
    leftYaw: aL ? aL.yaw : null,
    seg: s.seg, kind: s.kind, strike: s.strike,
    bodyYaw: s.yaw * 180 / Math.PI,
    rootYaw: s.rootYaw * 180 / Math.PI,
    spinYaw: s.spinYaw * 180 / Math.PI,
    rootTurn: s.rootTurn * 180 / Math.PI,
    base: b && b.base, tip: b && b.tip,
    pos: { x: h.world.character.position.x, y: h.world.character.position.y, z: h.world.character.position.z },
  };
}
"""


def probe(page, weapon: str, seg: int, progress: float, warm: int = 6) -> dict:
    return page.evaluate(
        PROBE_JS,
        {"weapon": weapon, "comboIndex": seg, "progress": progress, "warm": warm},
    )


def unwrap(values: list[float]) -> list[float]:
    out = [values[0]]
    for v in values[1:]:
        prev = out[-1]
        d = (v - prev + 180.0) % 360.0 - 180.0
        out.append(prev + d)
    return out


def scan_seg(page, weapon: str, seg: int, steps: int) -> dict:
    rows = []
    for i in range(steps + 1):
        t = i / steps
        d = probe(page, weapon, seg, t, warm=12 if i == 0 else 4)
        d["t"] = round(t, 4)
        rows.append(d)

    yaws = [r["yaw"] for r in rows if r["yaw"] is not None]
    uy = unwrap(yaws) if yaws else []
    for r, u in zip([r for r in rows if r["yaw"] is not None], uy):
        r["yawU"] = u

    pitches = [r["pitch"] for r in rows if r["pitch"] is not None]
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
        "leftPitchMin": min(lefts) if lefts else None,
        "leftPitchMax": max(lefts) if lefts else None,
        "hasLeft": bool(lefts),
        "spinMax": max(spins) if spins else 0.0,
        "rootMin": min(roots) if roots else 0.0,
        "rootMax": max(roots) if roots else 0.0,
        "iFar": i_far,
        "iSpin": i_spin,
        "iPitch": i_pitch,
    }


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


def launch(headed: bool = False):
    from playwright.sync_api import sync_playwright

    pw = sync_playwright().start()
    browser = pw.chromium.launch(
        headless=not headed,
        executable_path=os.environ.get("CLIP_LAB_CHROMIUM") or None,
        args=[
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--enable-unsafe-swiftshader",
            "--use-gl=angle",
            "--use-angle=swiftshader",
        ],
    )
    page = browser.new_page(viewport={"width": 1280, "height": 800}, device_scale_factor=1)
    errors: list[str] = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append("console.error: " + m.text) if m.type == "error" else None)
    return pw, browser, page, errors


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
        worst = max(abs(scan["pitchMin"]), abs(scan["pitchMax"]))
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


def run_scans(page, weapons: list[str], segs_map: dict[str, list[int]], steps: int) -> list[dict]:
    scans = []
    for w in weapons:
        for seg in segs_map[w]:
            scans.append(scan_seg(page, w, seg, steps))
    return scans


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
        d = probe(page, w, seg, t, warm=45)
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
            scan = scan_seg(page, args.weapon, args.seg, args.steps)
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
            browser.close()
            pw.stop()


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
                d = probe(page, args.weapon, args.seg, args.progress, warm=45)
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
            browser.close()
            pw.stop()


def cmd_check(args) -> int:
    weapons = [w for w in WEAPON_SEGS if not args.weapon or w == args.weapon]
    with StaticServer() as srv:
        pw, browser, page, errors = launch(args.headed)
        try:
            open_game(page, srv.url)
            out_dir = OUT_ROOT / f"check-{time.strftime('%m%d-%H%M%S')}"
            out_dir.mkdir(parents=True, exist_ok=True)

            scans = []
            for w in weapons:
                for seg in WEAPON_SEGS[w]:
                    s = scan_seg(page, w, seg, args.steps)
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

            failed = [s for s in scans if not s["judge"][0]]
            print()
            print(f"{'全部通过' if not failed else f'{len(failed)} 段未过'}  报告 {md}")
            if errors:
                print(f"页面错误 {errors[:3]}")
            return 0 if not failed and not errors else 1
        finally:
            browser.close()
            pw.stop()


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
    p_check.add_argument("--shots", action="store_true", default=True)
    p_check.set_defaults(func=cmd_check)

    p_self = sub.add_parser("selftest", help="纯逻辑自检（不需要浏览器）")
    p_self.set_defaults(func=cmd_selftest)

    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
