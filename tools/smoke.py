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

// v9s.36：命中时机采样 —— 只记「命中的那一帧，攻击进度走到了多少」。
// 旧版判定从 active 第 0 帧开始，命中时 progress ≈ 0.217（刃身还在身后蓄势）；
// 扫掠门之后必须等到刃身挥到身前（progress ≥ 0.3）。
window.__hit = { on: false, rows: [] };
window.__hitStart = () => {
  const h = window.__harness;
  window.__hit.rows = [];
  window.__hit.on = true;
  const tick = () => {
    if (!window.__hit.on) return;
    const w = h.world;
    window.__hit.rows.push({ prog: w.combat.attackProgress, hits: w.hitCount,
                             stop: w.combat.hitstop, phase: w.combat.phase });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
window.__hitStop = () => { window.__hit.on = false; return window.__hit.rows; };
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
                # v9s.38：判据从「零增量帧总数」改成「**最长连续**零增量帧」。
                # 孤立的 1~2 帧重复是采样抖动（页内 rAF 与渲染节拍偶发重合；
                # 软件渲染下 24 帧样本里实测出现过连续 2 帧），0.25× 慢放下 2 帧 = 8ms，
                # 肉眼无感。真正的卡顿（v9s.34 那个 bug）是 35+/60 的**连续**重复帧。
                run = best = 0
                for d in dels:
                    run = run + 1 if d < 1e-6 else 0
                    best = max(best, run)
                check("慢放转身无「画面不动」卡顿（最长连续 ≤ 2 帧）", best <= 2,
                      f"最长连续 {best} 帧 / 共 {zero} 帧（{len(dels)} 帧样本）")

                # ---- v9s.36：卡肉必须发生在「刀挥到人」之后 ----
                page.evaluate("() => { window.__harness.debug.timeScale = 1; }")
                page.evaluate("""() => {
                  const h = window.__harness, w = h.world, c = w.character, d = w.dummies[0];
                  c.position.x = d.position.x - 1.0 * Math.sin(c.bodyYaw);
                  c.position.z = d.position.z - 1.0 * Math.cos(c.bodyYaw);
                  c.facing = Math.atan2(d.position.x - c.position.x, d.position.z - c.position.z);
                  c.bodyYaw = c.facing;
                }""")
                page.wait_for_timeout(250)
                before = page.evaluate("() => window.__harness.world.hitCount")
                page.evaluate("window.__hitStart()")
                page.keyboard.press("j")
                page.wait_for_timeout(700)
                hit_rows = page.evaluate("window.__hitStop()")
                hit_prog = None
                prev_hits = before
                for r in hit_rows:
                    if r["hits"] > prev_hits:
                        hit_prog = r["prog"]
                        break
                    prev_hits = r["hits"]
                if hit_prog is None:
                    check("攻击能命中（近身一剑）", False, f"hitCount 未增加（{before}）")
                else:
                    check("攻击能命中（近身一剑）", True)
                    # 旧行为 = 0.217（active 第一帧）；扫掠门后应到 0.3+
                    check("卡肉发生在刃身挥出之后（progress ≥ 0.30）", hit_prog >= 0.30,
                          f"命中时 progress={hit_prog:.3f}")

                # ---- v9s.37：击地尘环确实生成（判定 → 表现这一段通了） ----
                ring = page.evaluate("""() => {
                  const h = window.__harness;
                  const before = h.slamDebug().spawns;
                  h.world.combat.weapon = 'greatsword';
                  h.world.combat.slamAttackId += 1;
                  h.view.render(h.world, 1 / 60);
                  const d = h.slamDebug();
                  const live = d.live[0] ?? null;
                  return { ok: d.spawns > before && !!live && live.opacity > 0.3 && live.scale > 0.5,
                           spawns: d.spawns, scale: live ? live.scale : 0, op: live ? live.opacity : 0 };
                }""")
                check("击地尘环生成（半径 / 透明度正常）", ring["ok"],
                      f"spawns={ring['spawns']} scale={ring['scale']:.2f} opacity={ring['op']:.2f}")


                # ---- v9s.38：特效层级（地块不透明 + 贴地层排在身体层之前） ----
                fx = page.evaluate("() => window.__harness.fxDebug()")
                o = fx["orders"]
                check("地块走不透明通道（透明地面会盖掉刀光）", fx["boxOpaque"] and fx["boxCount"] > 0,
                      f"boxOpaque={fx['boxOpaque']} count={fx['boxCount']}")
                check("特效层级单调：贴地环 < 贴地冲击 < 刀光 < 斩击弧 < 弹道",
                      o["ring"] < o["groundFx"] < o["trail"] < o["slash"] < o["projectile"],
                      f"ring={o['ring']} groundFx={o['groundFx']} trail={o['trail']} "
                      f"slash={o['slash']} proj={o['projectile']}")

                # ---- v9s.38：三个持械陪练在场，且保持距离而不是贴脸 ----
                crowd = page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world;"
                    "  const f = w.dummies.filter((d) => d.weapon);"
                    "  const p = w.character.position;"
                    "  return { n: f.length,"
                    "    weapons: f.map((d) => d.weapon),"
                    "    minDist: Math.min(...f.map((d) => Math.hypot(d.position.x - p.x, d.position.z - p.z))),"
                    "    knockDefault: !w.config.hits.noDamageToPlayer };"
                    "}"
                )
                check("三个持械陪练（剑盾 / 双刀 / 大剑）",
                      crowd["n"] == 3 and set(crowd["weapons"]) == {"sword-shield", "dual-swords", "greatsword"},
                      str(crowd["weapons"]))
                check("陪练与玩家保持距离（> 1.2m，不贴脸）", crowd["minDist"] > 1.2,
                      f"最近 {crowd['minDist']:.2f}m")
                check("玩家受击击退默认打开", crowd["knockDefault"], "")

                # ---- v9s.39：陪练一轮打出多段连击（不是单发） ----
                # 把大剑陪练摆到玩家面前并清掉冷却，然后真机等一轮：段号会走过 1→2→3，
                # attackId 每段 +1（起手 / 接续段都会自增，是「这一轮打了几刀」的直接读数）。
                page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world;"
                    "  const s = w.dummies[w.config.dummies.count + 2];"
                    # 前面几条断言让玩家挥着大剑（击地那条直接改了 combat.weapon），
                    # 不清掉的话摆位瞬间就会砍中陪练 → 受击打断连击，测的就不是连击了。
                    "  w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.comboIndex = 0;"
                    # 只留这一个陪练：另外两个也在 spar，会把玩家围着推，
                    # 距离一拉开连击必然断在第 1 段 —— 那是「混战里被打断」，不是机制没生效。
                    "  for (const d of w.dummies) {"
                    "    if (d.id === s.id) continue;"
                    "    d.mode = 'idle'; d.position.x = 60; d.position.z = 60;"
                    "  }"
                    "  s.mode = 'attack'; s.attackCooldown = 0;"
                    "  s.position.x = w.character.position.x;"
                    "  s.position.z = w.character.position.z + 1.6;"
                    # 工位跟着搬：否则它离 home 十几米，牵引半径会一路把它拽回工位，
                    # 边打边退 → 距离拉开 → 自己把连击打断（这条断言就不是在测连击了）。
                    "  s.homeX = s.position.x; s.homeZ = s.position.z;"
                    "  s.velocity.x = 0; s.velocity.z = 0;"
                    "  const cp = w.character.position;"
                    "  window.__comboAnchor = { x: cp.x, z: cp.z };"
                    "  window.__comboProbe = { id: s.id, startId: s.attackId, maxSeg: 0, minD: 99, maxHurt: 0,"
                    "    t0: w.time };"
                    "  window.__comboTimer = setInterval(() => {"
                    "    const P = window.__comboProbe;"
                    "    P.maxSeg = Math.max(P.maxSeg, s.attackComboIndex);"
                    # 木桩玩家：连击的击退会把玩家越推越远，距离一超就断连 ——
                    # 这条断言只问「陪练自己能不能连段」，所以把玩家钉住，别让变量互相干扰。
                    "    cp.x = window.__comboAnchor.x; cp.z = window.__comboAnchor.z;"
                    "    w.character.velocity.x = 0; w.character.velocity.z = 0;"
                    "    w.playerHurt.knockX = 0; w.playerHurt.knockZ = 0;"
                    "    P.minD = Math.min(P.minD, Math.hypot(cp.x - s.position.x, cp.z - s.position.z));"
                    "    P.maxHurt = Math.max(P.maxHurt, s.hurt.timer);"
                    "  }, 16);"
                    "}"
                )
                # 等的是**游戏时间**不是墙钟：软件渲染下每秒只推进约 0.2s 游戏时间，
                # 用 wait_for_timeout 会误判成「连击没接上」（实测 4s 墙钟只走了 0.87s 游戏时间）。
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__comboProbe.t0 + 3.0",
                    timeout=90000,
                )
                combo = page.evaluate(
                    "() => {"
                    "  clearInterval(window.__comboTimer);"
                    "  const w = window.__harness.world;"
                    "  const p = window.__comboProbe;"
                    "  const s = w.dummies.find((d) => d.id === p.id);"
                    "  return { segs: s.attackId - p.startId, maxSeg: p.maxSeg,"
                    "    left: s.attackComboLeft, gap: +s.comboGap.toFixed(3),"
                    "    minD: +p.minD.toFixed(2), maxHurt: +p.maxHurt.toFixed(2),"
                    "    weapon: s.weapon, mode: s.mode };"
                    "}"
                )
                check("陪练一轮打出多段连击（≥3 刀，段号到 3）",
                      combo["segs"] >= 3 and combo["maxSeg"] >= 3, str(combo))

                print("\n采样", len(rows), "帧 @0.25×  朝向滞后峰值",
                      f"{max(gaps):.1f}°" if gaps else "-", " 零增量帧", f"{zero}/{len(dels)}",
                      " 命中 progress", f"{hit_prog:.3f}" if hit_prog is not None else "-")
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
