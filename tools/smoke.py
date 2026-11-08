#!/usr/bin/env python3
"""发布自检（release smoke）：把「线上跑的这一份 dist」按真实浏览器路径过一遍。

为什么单独一支：
- `npm test` 跑的是 Core / 表现层单测，碰不到「打包后能不能起、WebGL 有没有上下文、
  主循环有没有在跑、插值 / 朝向平滑有没有接上」这类**集成问题** ——
  v9s.35 就踩过一次：dist 起不来，页面停在空 #app，单测全绿却什么都看不见。
- clip-lab 的 `check` 是动画幅度验收，会锁画面、摆机位，不适合当发布闸门。

用法：
    python3 tools/smoke.py            # 自检当前 dist/
    python3 tools/smoke.py --headed   # 有头跑，肉眼复核
    npm run smoke

判定全部为「画面层事实」：读 harness 暴露的读数，不猜、不看截图。
"""
from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "clip-lab"))
import clip_lab as C  # noqa: E402

SAMPLER = """
window.__smoke = { on: false, rows: [] };
window.__smokeStart = () => {
  const h = window.__harness;
  window.__smoke.rows = [];
  window.__smoke.on = true;
  const tick = () => {
    if (!window.__smoke.on) return;
    const p = h.renderPose();
    const y = h.yawDebug();
    const i = h.interpDebug();
    window.__smoke.rows.push({
      x: p.x, z: p.z, yaw: p.bodyYaw,
      wx: h.world.character.position.x, wz: h.world.character.position.z,
      target: y.target, shown: y.shown, tau: y.tauMs,
      a: i.alpha, ap: i.applied, skip: i.skip,
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
window.__smokeStop = () => { window.__smoke.on = false; return window.__smoke.rows; };
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--headed", action="store_true")
    args = ap.parse_args()

    checks: list[tuple[str, bool, str]] = []

    def check(name: str, ok: bool, detail: str = "") -> None:
        checks.append((name, ok, detail))

    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(headed=args.headed, width=960, height=600)
        try:
            page.goto(srv.url, wait_until="load", timeout=60000)
            try:
                page.wait_for_function(
                    "() => !!(window.__harness && window.__harness.renderPose && window.__harness.yawDebug)",
                    timeout=30000,
                )
                ready = True
            except Exception:
                ready = False
            check("harness 就绪（包能起、WebGL 有上下文）", ready, str(errors[:2]))

            if ready:
                # clip-lab 的夹具会锁画面，这里显式解锁 —— 否则读到的全是定格帧
                page.evaluate("() => { if (window.__harness.clipLab) window.__harness.clipLab.release(); }")
                page.evaluate(SAMPLER)
                page.evaluate("() => { window.__harness.debug.timeScale = 0.25; }")
                page.wait_for_timeout(300)
                page.evaluate("window.__smokeStart()")
                page.keyboard.down("w")
                page.keyboard.down("d")
                page.wait_for_timeout(2000)
                page.keyboard.up("w")
                page.keyboard.up("d")
                rows = page.evaluate("window.__smokeStop()")

                check("无页面异常", not errors, str(errors[:2]))

                alphas = {round(r["a"], 2) for r in rows}
                check("插值在跑（alpha 有变化）", len(alphas) >= 3, f"alpha 取值 {sorted(alphas)[:6]}")

                lag = [math.hypot(r["x"] - r["wx"], r["z"] - r["wz"]) for r in rows]
                check("画面位置跟随 Core（滞后 < 0.4m）", max(lag) < 0.4, f"最大滞后 {max(lag):.3f}m")

                # 朝向：真正画出来的 yaw 必须在追 target，而不是卡住
                gaps = [abs(math.degrees(r["target"] - r["shown"])) for r in rows]
                shown_set = {round(r["shown"], 4) for r in rows}
                check("朝向平滑在跑（shown 持续变化）", len(shown_set) > len(rows) * 0.5, f"{len(shown_set)}/{len(rows)} 帧不同")
                check("朝向滞后 < 25°（≈半帧）", max(gaps) < 25, f"最大 {max(gaps):.1f}°")
                check("朝向平滑已启用（tau > 0）", (rows[0]["tau"] if rows else 0) > 0, f"tau={rows[0]['tau'] if rows else 0}ms")

                yaws = [r["yaw"] for r in rows[1:]]
                dels = [abs(yaws[i] - yaws[i - 1]) for i in range(1, len(yaws))]
                zero = sum(1 for d in dels if d < 1e-6)
                check("慢放转身无「画面不动」帧", zero <= max(1, len(dels) * 0.02), f"{zero}/{len(dels)} 帧不动")

                print("\n采样", len(rows), "帧 @0.25×  朝向滞后峰值",
                      f"{max(gaps):.1f}°" if gaps else "-", " 零增量帧", f"{zero}/{len(dels)}")
        finally:
            C.shutdown(pw, browser)

    print()
    bad = 0
    for name, ok, detail in checks:
        print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f"   [{detail}]" if detail and not ok else ""))
        bad += 0 if ok else 1
    print(f"\n{len(checks) - bad}/{len(checks)} 通过")
    return 0 if bad == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
