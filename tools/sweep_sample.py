#!/usr/bin/env python3
"""v9s.37 · 扫掠判定数据自动采样。

`config/game.json` 里的 `hitSweep.pts` 是「刃尖相对角随 active 进度 u 的曲线」。
手写这条曲线必然和真实动画对不上（臂长、腕部滞后、副手握持都在里面），
所以这里反过来：**把画面逐进度摆一遍，读刃尖世界坐标，反算角度，写回配置**。

用法：

    python3 tools/sweep_sample.py --check              # 只采样 + 对比，不改文件
    python3 tools/sweep_sample.py --write              # 采样并写回 config/game.json
    python3 tools/sweep_sample.py --heights --weapon greatsword --combo 3
                                                       # 打印刃尖高度曲线（找砸地时刻）
    python3 tools/sweep_sample.py --check --step 0.2   # 更粗的采样

`--write` 只改 `pts` 的数值，保留 `tolDeg` / `byCombo` 结构与其它配置的排版；
每段还会顺带打印「最大偏差」，超过 `--tol`（默认 6°）会以非零退出码提醒 ——
这条曲线漂了，判定就会和人看到的刀重新错开。

已知限制：每段的 **u=0** 读不准（实测差 16°）。`preview` 直接跳到 active，没有 windup
的历史，段首姿态还带着「上一段 → 这一段」的过渡；而 u=0 是身后蓄势点、不产生命中，
所以保留原值即可。
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "config" / "game.json"
sys.path.insert(0, str(ROOT / "tools" / "clip-lab"))

import clip_lab as C  # noqa: E402


def load_config() -> dict:
    return json.loads(CONFIG.read_text(encoding="utf-8"))


def progress_of(cfg: dict, weapon: str, u: float) -> float:
    """active 内进度 u → 整体 attackProgress（Core 的定义：按阶段时长线性）。"""
    p = cfg["core"]["combat"]["weapons"][weapon]
    total = p["windup"] + p["active"] + p["recovery"]
    if total <= 0:
        return u
    return (p["windup"] + u * p["active"]) / total


def sample(page, weapon: str, combo: int, u: float, warm: int) -> dict:
    """在页面内摆到这个进度，读刃尖 / 刃根世界坐标与角色位置。"""
    return page.evaluate(
        """([weapon, combo, prog, warm]) => {
            const h = window.__harness;
            const out = h.clipLab.preview({ weapon, comboIndex: combo, progress: prog, warm });
            const c = h.world.character.position;
            const b = out.blade;
            return {
              tip: [b.tip.x - c.x, b.tip.y - c.y, b.tip.z - c.z],
              base: [b.base.x - c.x, b.base.y - c.y, b.base.z - c.z],
              // 渲染根节点的实际 yaw（含插值 / 低通）。真实主循环在采样间隙仍在跑，
              // 角色会被索敌转过去；刃尖是挂在根节点下的，所以相对角必须减掉它，
              // 否则测出来的曲线会随「采样时刻角色恰好转到哪」漂移。
              yaw: h.yawDebug().shown,
              clipT: out.clipT ?? null,
            };
        }""",
        [weapon, combo, progress_of(_CFG, weapon, u), warm],
    )


def angle_deg(tip: list[float], yaw: float = 0.0) -> float:
    """相对角：刃尖相对角色**实际朝向**的水平角（0 = 正前，+ = 右侧）。"""
    return _wrap(math.degrees(math.atan2(tip[0], tip[2])) - math.degrees(yaw))


def fmt_pts(pts: list[list[float]]) -> str:
    return ", ".join(f"[{u:g}, {a:.0f}]" for u, a in pts)


def main() -> int:
    ap = argparse.ArgumentParser(description="扫掠判定数据自动采样")
    ap.add_argument("--write", action="store_true", help="写回 config/game.json")
    ap.add_argument("--check", action="store_true", help="只对比（默认）")
    ap.add_argument("--heights", action="store_true", help="打印刃尖高度曲线（找砸地时刻）")
    ap.add_argument("--weapon", default="", help="只处理某把武器")
    ap.add_argument("--combo", type=int, default=0, help="只处理某一段（配合 --heights）")
    ap.add_argument("--step", type=float, default=0.1, help="u 采样步长（默认 0.1）")
    ap.add_argument("--max-u", type=float, default=0.8, help="采样到哪个 u（默认 0.8）")
    ap.add_argument("--warm", type=int, default=6, help="每个采样点预热帧数（默认 6）")
    ap.add_argument("--tol", type=float, default=6.0, help="偏差告警阈值（度）")
    ap.add_argument("--force", action="store_true", help="即使偏差没超阈值也写回")
    args = ap.parse_args()

    if not args.write:
        args.check = True

    global _CFG
    _CFG = load_config()
    weapons = _CFG["core"]["combat"]["weapons"]

    targets: list[tuple[str, int]] = []
    for w, prof in weapons.items():
        sweep = prof.get("hitSweep")
        if not sweep:
            continue
        if args.weapon and w != args.weapon:
            continue
        combos = sorted(int(k) for k in (sweep.get("byCombo") or {}))
        for combo in combos:
            if args.combo and combo != args.combo:
                continue
            targets.append((w, combo))

    if not targets:
        print("没有可采样的段（配置里没有 hitSweep）")
        return 1

    us = []
    u = 0.0
    while u <= args.max_u + 1e-9:
        us.append(round(u, 4))
        u += args.step

    rows: list[tuple[str, int, list[list[float]], list[list[float]]]] = []
    worst = 0.0
    worst_tag = ""

    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=520, height=360)
        try:
            C.open_game(page, srv.url)
            # 固定朝向 = 0：这样世界坐标的水平角就是相对角
            page.evaluate("() => window.__harness.clipLab.face(0)")
            page.wait_for_timeout(120)

            for weapon, combo in targets:
                old = (
                    weapons[weapon]["hitSweep"]["byCombo"][str(combo)].get("pts") or []
                )
                pts: list[list[float]] = []
                heights: list[list[float]] = []
                for i, uu in enumerate(us):
                    # 每段的第 0 点：上一段末尾的姿态离得最远，腕部 / 副手要更长时间收敛，
                    # 预热不够会读成过渡帧（实测差 16°）。其余点按 --warm 即可。
                    warm = max(args.warm, 36) if i == 0 else args.warm
                    r = sample(page, weapon, combo, uu, warm)
                    ang = angle_deg(r["tip"], r["yaw"])
                    pts.append([uu, ang])
                    heights.append([uu, r["tip"][1]])
                    if args.heights:
                        print(
                            f"  {weapon} c{combo} u={uu:.2f}  角={ang:7.1f}°  "
                            f"刃尖高={r['tip'][1]:+.3f}m  clipT={r['clipT']}"
                        )

                # 偏差：用旧曲线的插值值逐点对比
                if old:
                    for uu, ang in pts:
                        ref = _interp(old, uu)
                        d = abs(_wrap(ang - ref))
                        if d > worst:
                            worst, worst_tag = d, f"{weapon} c{combo} u={uu:g}"
                rows.append((weapon, combo, pts, heights))

            if errors:
                print("页面错误：", errors[:3])
        finally:
            C.shutdown(pw, browser)

    for weapon, combo, pts, heights in rows:
        print(f"\n{weapon} c{combo}")
        print(f"  新: {fmt_pts(pts)}")
        if heights:
            lowest = min(heights, key=lambda h: h[1])
            print(f"  刃尖最低点：u={lowest[0]:g}  y={lowest[1]:+.3f}m（砸地时刻参考）")
        old = weapons[weapon]["hitSweep"]["byCombo"][str(combo)].get("pts") or []
        if old:
            print(f"  旧: {fmt_pts(old)}")

    print(f"\n最大偏差：{worst:.1f}°（{worst_tag or '-'}），阈值 {args.tol:g}°")

    if args.write:
        if worst <= args.tol and not args.force:
            print(f"偏差 {worst:.1f}° ≤ 阈值 {args.tol:g}°，不写回（要强制用 --force）")
        else:
            for weapon, combo, pts, _h in rows:
                weapons[weapon]["hitSweep"]["byCombo"][str(combo)]["pts"] = [
                    [round(uu, 2) if uu % 0.2 else uu, round(ang)] for uu, ang in pts
                ]
            CONFIG.write_text(
                json.dumps(_CFG, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
            print(f"已写回 {CONFIG.relative_to(ROOT)}")

    if worst > args.tol:
        print(f"警告：曲线偏移超过 {args.tol:g}°，动画改过就必须重采（--write）")
        return 2
    return 0


def _interp(pts: list[list[float]], u: float) -> float:
    if not pts:
        return 0.0
    if u <= pts[0][0]:
        return pts[0][1]
    for i in range(1, len(pts)):
        u1, a1 = pts[i]
        if u <= u1:
            u0, a0 = pts[i - 1]
            k = (u - u0) / (u1 - u0) if u1 > u0 else 1.0
            return a0 + (a1 - a0) * k
    return pts[-1][1]


def _wrap(a: float) -> float:
    x = a
    while x > 180:
        x -= 360
    while x < -180:
        x += 360
    return x


if __name__ == "__main__":
    raise SystemExit(main())
