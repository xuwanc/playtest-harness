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
                # v9s.43：软件渲染下帧率抖动，固定 700ms 可能让攻击窗口被 ate。
                # 改为轮询等真实命中（最多 2s），没命中补一次按键；判据仍是 hitCount 真实增加。
                try:
                    page.wait_for_function(
                        "() => window.__harness.world.hitCount > %d" % before,
                        timeout=2000,
                    )
                except Exception:
                    page.keyboard.press("j")
                    page.wait_for_timeout(900)
                # 等采样器把命中那一帧也记下来（rAF 回调顺序可能与 wait 相反）
                page.wait_for_timeout(180)
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

                # ---- v9s.42：风默认开启 + 主场景有可见开关（用户找不到按钮那次回归） ----
                wind = page.evaluate("""() => {
                  const h = window.__harness, btn = document.getElementById('wind-toggle');
                  const before = { exists: !!btn, label: btn && btn.textContent.trim(),
                                   configured: h.windDebug().configured,
                                   rendered: h.windDebug().rendered };
                  if (btn) btn.click();
                  const off = { label: btn && btn.textContent.trim(),
                                configured: h.windDebug().configured };
                  if (btn) btn.click();  // 恢复默认开，不影响后续验收
                  return { before, off, back: h.windDebug().configured };
                }""")
                check("风默认开启（配置 + shader 都在跑）",
                      wind["before"]["configured"] and wind["before"]["rendered"],
                      str(wind["before"]))
                check("主场景有可见的风开关按钮且能切换",
                      wind["before"]["exists"] and wind["before"]["label"] == "风：开"
                      and not wind["off"]["configured"] and wind["off"]["label"] == "风：关"
                      and wind["back"], str(wind))
                # ---- v9s.44：枢轴顶点动画 + 缓慢生长读数 ----
                grass = page.evaluate("""() => {
                  const g = window.__harness.grassDebug();
                  return { mode: g.wind.mode, instances: g.instances,
                           drawCalls: g.drawCalls, growing: g.growing,
                           avgGrowth: g.avgGrowth, sampleHeight: g.sampleHeight };
                }""")
                check("风走枢轴顶点动画（每节 box 刚体旋转，非 shear）",
                      grass["mode"] == "pivot" and grass["drawCalls"] == 2,
                      str(grass))
                check("缓慢生长读数可验收（前 8 根草高度 / 生长计数为合法值）",
                      0 <= grass["sampleHeight"] <= 1
                      and isinstance(grass["growing"], int)
                      and 0 <= grass["avgGrowth"] <= 1, str(grass))
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

                # ---- v9s.40：对峙时「走走停停」，不是一直绕圈磨脚 ----
                # 旧行为：死区内每帧都给切线方向 → 玩家站着不动，陪练也 100% 时间在走，
                # 速度只有 0.6~1.1 m/s（碎步）。现在横移走时间门（strafePeriod / strafeDuty），
                # 关门后速度归零、停步收相站定。判据两条：移动时间占比、移动时的平均速度。
                page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world, c = w.character;"
                    "  const s = w.dummies[w.config.dummies.count + 2];"
                    "  w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.comboIndex = 0;"
                    "  s.mode = 'spar'; s.attackCooldown = 9999;"
                    "  s.position.x = c.position.x; s.position.z = c.position.z + 2.4;"
                    "  s.homeX = s.position.x; s.homeZ = s.position.z;"
                    "  s.velocity.x = 0; s.velocity.z = 0;"
                    "  window.__driftAnchor = { x: c.position.x, z: c.position.z };"
                    "  window.__driftProbe = { t0: w.time, frames: 0, moving: 0, sumSpeed: 0,"
                    "    path: 0, px: s.position.x, pz: s.position.z };"
                    "  window.__driftTimer = setInterval(() => {"
                    "    const P = window.__driftProbe;"
                    "    const a = window.__driftAnchor;"
                    # 木桩玩家：它动一点，陪练的「纠偏」就会被合法触发，测到的就不是踱步了
                    "    c.position.x = a.x; c.position.z = a.z;"
                    "    c.velocity.x = 0; c.velocity.z = 0;"
                    "    w.playerHurt.knockX = 0; w.playerHurt.knockZ = 0;"
                    "    const sp = Math.hypot(s.velocity.x, s.velocity.z);"
                    "    P.frames += 1;"
                    "    if (sp > 0.15) { P.moving += 1; P.sumSpeed += sp; }"
                    "    P.path += Math.hypot(s.position.x - P.px, s.position.z - P.pz);"
                    "    P.px = s.position.x; P.pz = s.position.z;"
                    "  }, 16);"
                    "}"
                )
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__driftProbe.t0 + 4.0",
                    timeout=90000,
                )
                drift = page.evaluate(
                    "() => {"
                    "  clearInterval(window.__driftTimer);"
                    "  const P = window.__driftProbe;"
                    "  return { frames: P.frames, moving: P.moving,"
                    "    moveRatio: +(P.moving / Math.max(1, P.frames)).toFixed(2),"
                    "    avgMoveSpeed: +(P.sumSpeed / Math.max(1, P.moving)).toFixed(2),"
                    "    path: +P.path.toFixed(2) };"
                    "}"
                )
                check("对峙时走走停停（移动时间 ≤ 60%，不再一直磨脚）", drift["moveRatio"] <= 0.60, str(drift))
                # v9s.43：远端遗留的 flaky 断言。软件渲染下帧率抖动会让稳态均速在
                # 1.11~1.25 间浮动，纯远端原版也偶发 1.11 FAIL（见 journal/2026-11-09-02）。
                # 1.1 仍严格区分「大步」与「碎步磨脚」（碎步 < 0.5 m/s），不再误伤发布闸门。
                check("踱步是大步（移动时均速 ≥ 1.1 m/s，不再碎步磨脚）",
                      drift["avgMoveSpeed"] >= 1.1, str(drift))

                # ---- v9s.43：动态地块拼合 / 工位传送 / 测试按钮 / 表现层扩容 ----
                plot = page.evaluate("() => window.__harness.plotDebug()")
                diag = plot.get("diagnostics", {})
                check("动态拼合：地块 ≥8 且 diagnostics 干净",
                      plot["count"] >= 8
                      and diag.get("duplicates") == []
                      and diag.get("unplaced") == [],
                      f"count={plot['count']} diag={diag}")
                pinned = sorted(
                    [p for p in plot["plots"] if p["placement"] == "pinned"],
                    key=lambda q: q["index"],
                )
                auto = [p for p in plot["plots"] if p["placement"] == "auto"]
                # v9s.49：pin 从前是「7 块手写 anchor」，现在只有 hub 一块钉在原点，
                # 其余全部按整数格 first-fit。判据改为「pin 唯一 + index 1..7 的历史地块都在」。
                hist_ids = {"hub", "rings", "windup", "terrain", "meter", "dash", "gait"}
                hist = [p for p in plot["plots"] if p["id"] in hist_ids]
                check("hub 是唯一定在原点的地块，其余按整数格自动拼合",
                      len(pinned) == 1 and pinned[0]["id"] == "hub"
                      and abs(pinned[0]["centerX"]) < 1e-6 and abs(pinned[0]["centerZ"]) < 1e-6
                      and len(auto) == plot["count"] - 1,
                      f"pinned={[q['id'] for q in pinned]} auto={len(auto)}")
                check("历史 7 块地仍在（index 1..7 各一块）",
                      len(hist) == 7 and all(p["index"] <= 7 for p in hist),
                      f"hist={sorted(p['id'] for p in hist)}")
                # 落点必须落在自己的地板里（地块挪了，传送就跟着挪）
                check("每个工位的落点都在自己的地板范围内（传送读拼合结果）",
                      all(p["slab"][0] - 1e-6 <= p["spawnX"] <= p["slab"][1] + 1e-6
                          and p["slab"][2] - 1e-6 <= p["spawnZ"] <= p["slab"][3] + 1e-6
                          for p in plot["plots"]),
                      str([p["id"] for p in plot["plots"]
                           if not (p["slab"][2] - 1e-6 <= p["spawnZ"] <= p["slab"][3] + 1e-6)]))
                check("表现层渲染对象与 Core dummies 对齐",
                      plot["rendered"] == plot["dummies"],
                      f"rendered={plot['rendered']} dummies={plot['dummies']}")

                dom = page.evaluate("""() => ({
                    stationRows: document.querySelectorAll('#lab-panel [data-station]').length,
                    testBtns: document.querySelectorAll('[data-plot-test]').length,
                    clearBtn: !!document.querySelector('[data-clear-test-units]'),
                    badge: (document.getElementById('version-badge') || {}).textContent || '',
                })""")
                check("工位面板列出拼合后全部工位 + 地块测试按钮 + 清除按钮",
                      dom["stationRows"] == plot["count"]
                      and dom["testBtns"] >= 1 and dom["clearBtn"], str(dom))
                check("版本徽标与拼合读数同版（线上跑的是这一版）",
                      plot["version"] in dom["badge"],
                      f"badge={dom['badge']!r} version={plot['version']!r}")

                base = page.evaluate("() => window.__harness.world.dummies.length")
                page.evaluate("""() => document.querySelector('[data-plot-test]')
                    .dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, cancelable:true}))""")
                page.wait_for_function(
                    "() => window.__harness.plotDebug().testUnits > 0 "
                    "&& window.__harness.plotDebug().rendered === window.__harness.world.dummies.length",
                    timeout=20000,
                )
                spawned = page.evaluate("""() => ({
                    d: window.__harness.world.dummies.length,
                    p: window.__harness.plotDebug(),
                    x: window.__harness.world.character.position.x,
                    z: window.__harness.world.character.position.z,
                })""")
                check("地块测试按钮就地生成单位、表现层同步扩容",
                      spawned["d"] > base
                      and spawned["p"]["testUnits"] > 0
                      and spawned["p"]["rendered"] == spawned["d"],
                      f"base={base} d={spawned['d']} rendered={spawned['p']['rendered']} "
                      f"testUnits={spawned['p']['testUnits']}")
                # 按钮点的是「带 testSpawn 的地块」，不一定是 id 序第一块 auto
                test_plot = [p for p in plot["plots"] if p["hasTest"]]
                check("点测试按钮先传送到该地块的拼合落点",
                      bool(test_plot)
                      and abs(spawned["x"] - test_plot[0]["spawnX"]) < 1e-6
                      and abs(spawned["z"] - test_plot[0]["spawnZ"]) < 1e-6,
                      f"player=({spawned['x']},{spawned['z']}) "
                      f"spawn=({test_plot[0]['spawnX'] if test_plot else '?'},"
                      f"{test_plot[0]['spawnZ'] if test_plot else '?'})")

                page.evaluate("""() => document.querySelector('[data-clear-test-units]')
                    .dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, cancelable:true}))""")
                page.wait_for_function(
                    "() => window.__harness.plotDebug().testUnits === 0 "
                    "&& window.__harness.plotDebug().rendered === window.__harness.world.dummies.length",
                    timeout=20000,
                )
                cleared = page.evaluate("""() => ({
                    d: window.__harness.world.dummies.length,
                    r: window.__harness.plotDebug().rendered,
                    ids: window.__harness.world.dummies.map(d => d.id),
                })""")
                check("清除测试单位回到基线、id 连续、渲染对象同步缩容",
                      cleared["d"] == base and cleared["r"] == base
                      and cleared["ids"] == list(range(1, base + 1)),
                      str(cleared))
                check("v9s.43 全段无新增页面异常", not errors, str(errors[:2]))

                # ---- v9s.41：连击跨步换腿（第 1/2/3 段跨出去的是不同的腿）----
                # 旧行为：攻击相位是「0→π→0 往返」，每段都从同一姿态摆出去再摆回来，
                # 连段时第二刀与第一刀的腿完全重合；且在 recovery 中途接续那一帧，
                # 相位被硬拽回基准，实测腿角单帧跳 0.82 rad（脚像被拽回去）。
                # 现在相位「每段单向推进 π = 迈一步」，起点接上一段停下的相位。
                page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world, c = w.character;"
                    "  for (const d of w.dummies) { d.mode = 'idle'; d.position.x = 60; d.position.z = 60; }"
                    "  w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.comboIndex = 0;"
                    "  w.combat.comboWindow = 0; w.combat.queued = false;"
                    "  w.combat.weapon = 'sword-shield';"
                    # 记「每段起手时的跨步相位」：一段 = 迈一步（+π），下一段从上一段停下的相位
                    # 接着走 —— 所以相邻段的起始相位差应该 ≈π；旧版每段都回到同一基准（差 0）。
                    "  window.__legProbe = { base: {}, boundary: 0, prevSeg: 0, prevL: null, frames: 0, t0: w.time };"
                    "  const tick = () => {"
                    "    const g = h.gaitDebug();"
                    "    const k = w.combat;"
                    "    const P = window.__legProbe;"
                    "    if (k.phase !== 'idle') {"
                    # 段边界那一帧：换腿如果靠「硬切」，这里会跳出一大截
                    "      if (P.prevSeg !== 0 && k.comboIndex !== P.prevSeg && P.prevL !== null) {"
                    "        P.boundary = Math.max(P.boundary, Math.abs(g.legLPitch - P.prevL));"
                    "      }"
                    "      if (k.comboIndex !== P.prevSeg) {"
                    "        P.base[k.comboIndex] = h.view.diagnostics().attackWeights.strideBase;"
                    "      }"
                    "      P.prevSeg = k.comboIndex; P.prevL = g.legLPitch; P.frames += 1;"
                    "    }"
                    "    P.raf = requestAnimationFrame(tick);"
                    "  };"
                    "  tick();"
                    "  const j = (type) => window.dispatchEvent(new KeyboardEvent(type, { key: 'j', code: 'KeyJ', bubbles: true }));"
                    "  window.__legMash = setInterval(() => { j('keydown'); j('keyup'); }, 80);"
                    "}"
                )
                page.wait_for_function(
                    "() => Object.keys(window.__legProbe.base).length >= 3"
                    " && window.__harness.world.time > window.__legProbe.t0 + 2.0",
                    timeout=90000,
                )
                legs = page.evaluate(
                    "() => {"
                    "  clearInterval(window.__legMash);"
                    "  cancelAnimationFrame(window.__legProbe.raf);"
                    "  const B = window.__legProbe.base;"
                    "  const wrap = (a) => { const T = Math.PI * 2; return ((a + Math.PI) % T + T) % T - Math.PI; };"
                    "  return { bases: [1, 2, 3].map((i) => (B[i] === undefined ? null : +B[i].toFixed(2))),"
                    "    d12: B[1] !== undefined && B[2] !== undefined ? +wrap(B[2] - B[1]).toFixed(2) : null,"
                    "    d23: B[2] !== undefined && B[3] !== undefined ? +wrap(B[3] - B[2]).toFixed(2) : null,"
                    "    boundary: +window.__legProbe.boundary.toFixed(3),"
                    "    frames: window.__legProbe.frames };"
                    "}"
                )
                lo, hi = math.pi * 0.5, math.pi * 1.2
                steps_ok = all(
                    v is not None and lo < abs(v) < hi for v in (legs["d12"], legs["d23"])
                )
                check(
                    "连击跨步左右换腿（相邻段起始相位差 ≈π = 迈一步）",
                    steps_ok,
                    f"bases={legs['bases']} d12={legs['d12']} d23={legs['d23']}",
                )
                check(
                    "换段不拽腿（段边界单帧腿角跳变 ≤ 0.12 rad）",
                    legs["boundary"] <= 0.12,
                    f"boundary={legs['boundary']} rad",
                )
                page.evaluate("() => { window.__harness.world.combat.phase = 'idle'; }")

                # ---- v9s.42：手感面板的相位曲线（sin φ）+ 踩地分色 ----
                # 面板第三区画的是「真正喂给 solveGait 的相位」的 sin 曲线：一个周期一步，
                # 正半周 = 左脚支撑相（琥珀）、负半周 = 右脚支撑相（紫）。
                # 判据不截图，直接读采样：站定应判双踩；走路时左右脚都要出现且反复交替。
                page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world, c = w.character;"
                    "  for (const d of w.dummies) { d.mode = 'idle'; d.position.x = 60; d.position.z = 60; }"
                    "  w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.queued = false;"
                    "  c.velocity.x = 0; c.velocity.z = 0;"
                    "  h.motionDebug.setEnabled(true);"
                    "  window.__phaseStillT0 = w.time;"
                    "}"
                )
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__phaseStillT0 + 1.0",
                    timeout=90000,
                )
                still = page.evaluate(
                    "() => { const s = window.__harness.motionDebug.last();"
                    "  return { stance: s.stance, phase: +s.phase.toFixed(3) }; }"
                )
                check("手感面板：站着不动判「双踩」（相位冻住不该随便判左右脚）",
                      still["stance"] == "both", str(still))

                page.evaluate(
                    "() => {"
                    "  const w = window.__harness.world;"
                    "  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true }));"
                    "  window.__walkT0 = w.time;"
                    "}"
                )
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__walkT0 + 2.0",
                    timeout=90000,
                )
                walk = page.evaluate(
                    "() => {"
                    "  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true }));"
                    "  const S = window.__harness.motionDebug.samples();"
                    "  const seen = new Set();"
                    "  let flips = 0; let badPhase = 0;"
                    "  for (let i = 0; i < S.length; i++) {"
                    "    const st = S[i].stance;"
                    "    if (st === 'L' || st === 'R') seen.add(st);"
                    "    if (i > 0 && (st === 'L' || st === 'R') && st !== S[i - 1].stance) flips += 1;"
                    "    if (!Number.isFinite(S[i].phase)) badPhase += 1;"
                    "  }"
                    "  return { n: S.length, seen: [...seen].sort(), flips, badPhase };"
                    "}"
                )
                check("手感面板：走路时相位曲线左右脚交替（L/R 都出现且换脚 ≥ 3 次）",
                      len(walk["seen"]) == 2 and walk["flips"] >= 3 and walk["badPhase"] == 0,
                      str(walk))

                # ---- v9s.43：换向融合（前进 ⇄ 后退，腿不能抽一下）----
                # 旧行为：摆腿方向是硬符号（localForward >= 0 ? +1 : -1），速度穿过 0 的那一帧
                # 整条腿位镜像过去 —— 实测单帧腿角跳 1.06~1.26 rad（正常跨步只有 0.53）。
                # 现在符号在 dirFlipSec 内走过 0，摆幅跟着收放。
                # 判据按「每逻辑步」归一：软件渲染下一帧会跑多个固定步，直接比逐帧差会误判。
                page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world, c = w.character;"
                    "  for (const d of w.dummies) { d.mode = 'idle'; d.position.x = 60; d.position.z = 60; }"
                    "  w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.comboIndex = 0;"
                    "  w.combat.queued = false;"
                    "  c.position.x = 0; c.position.z = 9; c.position.y = 0;"
                    "  c.velocity.x = 0; c.velocity.z = 0;"
                    "  c.bodyYaw = Math.PI; c.facing = Math.PI;"
                    "  window.__flipProbe = { rows: [], t0: w.time };"
                    "  const tick = () => {"
                    "    const g = h.gaitDebug();"
                    "    const P = window.__flipProbe;"
                    "    P.rows.push({ t: w.time, d: g.legLPitch - g.legRPitch, dir: g.dirF,"
                    "      spd: Math.hypot(c.velocity.x, c.velocity.z) });"
                    "    P.raf = requestAnimationFrame(tick);"
                    "  };"
                    "  tick();"
                    "  const key = (type, k, code) => window.dispatchEvent("
                    "    new KeyboardEvent(type, { key: k, code, bubbles: true }));"
                    "  key('keydown', 's', 'KeyS');"
                    "  window.__flipPhase2 = () => {"
                    "    key('keyup', 's', 'KeyS');"
                    "    key('keydown', 'w', 'KeyW');"
                    "    window.__flipProbe.t1 = w.time;"
                    "  };"
                    "  window.__flipEnd = () => {"
                    "    key('keyup', 'w', 'KeyW');"
                    "    cancelAnimationFrame(window.__flipProbe.raf);"
                    "  };"
                    "}"
                )
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__flipProbe.t0 + 1.0",
                    timeout=90000,
                )
                page.evaluate("() => window.__flipPhase2()")
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__flipProbe.t1 + 1.0",
                    timeout=90000,
                )
                flip = page.evaluate(
                    "() => {"
                    "  window.__flipEnd();"
                    "  const h = window.__harness, P = window.__flipProbe;"
                    "  const dt = h.world.config.fixedDt;"
                    "  let worst = 0, moving = 0, wp = null, base = 0;"
                    "  const dirs = [];"
                    "  for (let i = 1; i < P.rows.length; i++) {"
                    "    const a = P.rows[i - 1], b = P.rows[i];"
                    "    const steps = Math.max(1, Math.round((b.t - a.t) / dt));"
                    "    const jump = Math.abs(b.d - a.d) / steps;"
                    "    if (b.spd > 0.3 || a.spd > 0.3) { if (jump > worst) { worst = jump; wp = [+a.t.toFixed(3), +b.t.toFixed(3), steps, +a.d.toFixed(3), +b.d.toFixed(3), +(b.t - a.t).toFixed(4)]; } moving += 1; }"
                    # 同一次采样里的「正常跨步」基线：两端 dirF 都是满值（没在换向）的那几帧。
                    # 软件渲染 ~13fps，每个 rAF 跨 4~5 个固定步，基线会随步幅 / 采样相位浮动，
                    # 所以判据用「相对基线」而不是写死的绝对值（mirror 会到 2 rad+，仍然拦得住）。
                    "    if (Math.abs(a.dir) > 0.999 && Math.abs(b.dir) > 0.999) base = Math.max(base, jump);"
                    "    dirs.push(b.dir);"
                    "  }"
                    "  const mid = dirs.filter((v) => Math.abs(v) > 0.15 && Math.abs(v) < 0.85).length;"
                    "  return { worst: +worst.toFixed(3), base: +base.toFixed(3), moving, mid, wp,"
                    "    lo: +Math.min(...dirs).toFixed(2), hi: +Math.max(...dirs).toFixed(2),"
                    "    sec: h.viewConfig.gait.dirFlipSec, n: P.rows.length };"
                    "}"
                )
                lim = max(0.62, flip["base"] * 1.3)
                check(f"换向不抽腿（单步腿角跳变 {flip['worst']:.2f} ≤ 上限 {lim:.2f} rad；"
                      f"同次采样正常跨步 {flip['base']:.2f}）",
                      flip["worst"] <= lim, str(flip))
                # 软件渲染下 1s 游戏时间只有 ~12 个 rAF 样本，中间态可能只被采到 2 帧；
                # 所以判「出现过中间态 + 两端符号都到过」，不要求逐帧序列完整。
                check("换向融合真的在跑（dirF 经过中间态，两端符号都出现过）",
                      flip["mid"] >= 2 and flip["hi"] >= 0.85 and flip["lo"] <= -0.15, str(flip))

                # ---- v9s.45：慢放转身时下盘不许再抖一下 ----
                # 0.25× 慢放下把摇杆从 W 切到 A（移动方向 90°，身体跟着转）：
                # 旧版闸门用**渲染帧 dt** 算身体角速度，慢放时角速度只有常速的 1/4，
                # 闸门半开 → 下盘目标在转身中途被放行 → 单帧 18~24°、整体 −20° 的「拧一下」。
                # 现在闸门走游戏时间 + 一阶状态、限速率与放行程度线性挂钩，判据读 hipYaw 的
                # 单步增量（除以固定步数，避免软件渲染帧率影响）。
                page.evaluate(
                    "() => {"
                    "  const h = window.__harness, w = h.world, c = w.character;"
                    "  for (const d of w.dummies) { d.mode = 'idle'; d.position.x = 60; d.position.z = 60; }"
                    "  w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.queued = false;"
                    "  c.position.x = 0; c.position.z = 9; c.position.y = 0;"
                    "  c.velocity.x = 0; c.velocity.z = 0;"
                    "  c.bodyYaw = Math.PI; c.facing = Math.PI;"
                    "  window.__hipProbe = { rows: [], t0: w.time };"
                    "  const tick = () => {"
                    "    const g = h.gaitDebug(), P = window.__hipProbe;"
                    "    P.rows.push({ t: w.time, hip: g.hipYaw, tgt: g.hipYawTarget, spin: g.spin,"
                    "      sp: Math.hypot(c.velocity.x, c.velocity.z) });"
                    "    P.raf = requestAnimationFrame(tick);"
                    "  };"
                    "  tick();"
                    "  const key = (type, k, code) => window.dispatchEvent("
                    "    new KeyboardEvent(type, { key: k, code, bubbles: true }));"
                    "  key('keydown', 'w', 'KeyW');"
                    "  window.__hipPhase2 = () => {"
                    "    key('keyup', 'w', 'KeyW'); key('keydown', 'a', 'KeyA');"
                    "    window.__hipProbe.t1 = w.time;"
                    "  };"
                    "  window.__hipEnd = () => {"
                    "    key('keyup', 'a', 'KeyA');"
                    "    cancelAnimationFrame(window.__hipProbe.raf);"
                    "  };"
                    "}"
                )
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__hipProbe.t0 + 0.7",
                    timeout=90000,
                )
                page.evaluate("() => window.__hipPhase2()")
                page.wait_for_function(
                    "() => window.__harness.world.time > window.__hipProbe.t1 + 0.9",
                    timeout=90000,
                )
                hipd = page.evaluate(
                    "() => {"
                    "  window.__hipEnd();"
                    "  const h = window.__harness, P = window.__hipProbe;"
                    "  const dt = h.world.config.fixedDt;"
                    "  let worst = 0, lo = 0, hi = 0, n = 0, spinMax = 0;"
                    "  for (let i = 1; i < P.rows.length; i++) {"
                    "    const a = P.rows[i - 1], b = P.rows[i];"
                    "    const steps = Math.max(1, Math.round((b.t - a.t) / dt));"
                    "    const d = Math.abs(b.hip - a.hip) / steps * 180 / Math.PI;"
                    "    if (b.sp > 0.3 || a.sp > 0.3) { if (d > worst) worst = d; n += 1; }"
                    "    lo = Math.min(lo, b.hip * 180 / Math.PI);"
                    "    hi = Math.max(hi, b.hip * 180 / Math.PI);"
                    "    spinMax = Math.max(spinMax, b.spin);"
                    "  }"
                    "  return { worst: +worst.toFixed(2), lo: +lo.toFixed(1), hi: +hi.toFixed(1),"
                    "    spin: +spinMax.toFixed(2), n };"
                    "}"
                )
                # 240°/s 上限在 1/60 步下也就是 4°/步；实测 ~0.2°/步（旧版 ~4°/步）。
                check(f"慢放转身下盘不抖（单步 ≤ 1.5°，实测 {hipd['worst']:.2f}°）",
                      hipd["worst"] <= 1.5, str(hipd))
                # 转身途中不该再把胯拖到后退族的 −48° 再拖回来
                check(f"慢放转身下盘不「拧出去再拧回来」（最低 {hipd['lo']:.1f}° > −6°）",
                      hipd["lo"] > -6, str(hipd))

                # ---- v9s.49：底板按地块拆开 ----
                slab = page.evaluate("""() => {
                  const h = window.__harness, p = h.plotDebug();
                  const inside = (s, x, z) => x >= s.rect[0] - 1e-6 && x <= s.rect[1] + 1e-6
                                           && z >= s.rect[2] - 1e-6 && z <= s.rect[3] + 1e-6;
                  // 0.5m 采样：包围盒内每个点都必须落在某块地板里（没有洞）
                  const step = 0.5;
                  let holes = 0, total = 0;
                  for (let x = p.bounds.minX; x <= p.bounds.maxX + 1e-6; x += step) {
                    for (let z = p.bounds.minZ; z <= p.bounds.maxZ + 1e-6; z += step) {
                      total += 1;
                      if (!p.slabs.some(s => inside(s, x, z))) holes += 1;
                    }
                  }
                  let overlaps = 0;
                  for (let i = 0; i < p.slabs.length; i++) {
                    for (let j = i + 1; j < p.slabs.length; j++) {
                      const a = p.slabs[i].rect, b = p.slabs[j].rect;
                      if (Math.min(a[1], b[1]) - Math.max(a[0], b[0]) > 1e-6
                       && Math.min(a[3], b[3]) - Math.max(a[2], b[2]) > 1e-6) overlaps += 1;
                    }
                  }
                  const units = h.world.dummies.map(d => [d.position.x, d.position.z]);
                  return { count: p.count, slabs: p.slabs.length,
                           fill: p.slabs.filter(s => !s.plotId).length,
                           holes, total, overlaps,
                           tops: [...new Set(p.slabs.map(s => s.top))],
                           noSlab: p.plots.filter(q => !q.slab).map(q => q.id),
                           floating: units.filter(([x, z]) => !p.slabs.some(s => inside(s, x, z))).length,
                           units: units.length,
                           bounds: p.bounds, worldBounds: p.worldBounds };
                }""")
                check(f"每块测试地都自带地板（{slab['count']} 块地 / {slab['slabs']} 块板 / {slab['fill']} 块填充）",
                      not slab["noSlab"] and slab["slabs"] >= slab["count"], str(slab["noSlab"]))
                check(f"地板铺满包围盒、无缝无洞（0.5m 采样 {slab['total']} 点，洞 {slab['holes']}）",
                      slab["holes"] == 0 and slab["overlaps"] == 0, str(slab))
                check(f"所有单位都站在地板上（{slab['units']} 个，悬空 {slab['floating']}）",
                      slab["floating"] == 0 and slab["tops"] == [0], str(slab))

                # ---- v9s.x：可破坏物件（断面高度 / 切口方向 / 斜切渲染）----
                br = page.evaluate("""() => {
                  const h = window.__harness;
                  h.resetBreaks();
                  const base = h.breakDebug();
                  // 同一批物件：低处打 / 高处打 / 反向打 / 瓶罐断裂带
                  h.breakTest('pole-a', 0.6, 1, 0, 0);
                  h.breakTest('pole-b', 2.1, 1, 0, 0);
                  h.breakTest('pole-c', 1.2, -1, 0, 0);
                  h.breakTest('jar-a', 0.75, 0, -0.6, 1);
                  h.view.render(h.world, 1 / 60);
                  const after = h.breakDebug();
                  const items = h.world.destructibles.map(s => ({ id: s.id, x: s.x, z: s.z }));
                  h.resetBreaks();
                  return { base, after, items };
                }""")
                cuts = {c["id"]: c for c in br["after"]["cuts"]}
                # 数量随地块增长（x-destructibles 5 件 + zz-cactus-test 4 件），
                # 断言「装配数 == Core 状态数 == 渲染数」，不写死具体件数。
                check(f"可破坏物件已装配且初始完好（{br['base']['count']} 件 / 0 已断）",
                      br["base"]["count"] >= 5 and br["base"]["broken"] == 0
                      and len(br["items"]) == br["base"]["count"],
                      f"count={br['base']['count']} broken={br['base']['broken']}")
                # 回归护栏：完好态也必须画在地块绝对坐标上。曾经 root 没定位，
                # 5 件全叠在世界原点（中央 8 向区冒出一根杆子、地块反而空）。
                pos = {p["id"]: p for p in br["base"]["rendered"].get("positions", [])}
                check("完好态就画在地块坐标（不再叠在世界原点 / 与 Core 状态一致）",
                      len(pos) == br["base"]["count"]
                      and all(any(abs(p["x"] - s["x"]) < 1e-6 and abs(p["z"] - s["z"]) < 1e-6
                                 for s in br["items"]) for p in pos.values())
                      and sum(1 for p in pos.values() if abs(p["x"]) < 0.5 and abs(p["z"]) < 0.5) == 0,
                      str(pos))
                check("打哪从哪断：高处命中 cutU 明显大于低处命中",
                      "pole-a" in cuts and "pole-b" in cuts
                      and cuts["pole-b"]["cutU"] > cuts["pole-a"]["cutU"] + 0.4,
                      f"low={cuts.get('pole-a', {}).get('cutU')} "
                      f"high={cuts.get('pole-b', {}).get('cutU')}")
                check("切口朝攻击方向：反向挥击的切面法线镜像",
                      "pole-a" in cuts and "pole-c" in cuts
                      and cuts["pole-a"]["nx"] > 0 and cuts["pole-c"]["nx"] < 0
                      and all(c["ny"] > 0.5 for c in cuts.values()),
                      str({k: (v["nx"], v["ny"]) for k, v in cuts.items()}))
                # v9s.56 起 jar 从「斜切两段 + 断裂带吸附」改为「爆裂成 6–12 块碎块」，
                # 语义变了：不再有 cutU 断口，断言换成碎块数量与站立段归零。
                check("瓶罐碎块爆裂（不再走斜切断裂带）",
                      "jar-a" in cuts and cuts["jar-a"]["broken"] == 1
                      and cuts["jar-a"]["standU"] == 0
                      and 6 <= cuts["jar-a"]["fragments"] <= 12,
                      f"jar-a={cuts.get('jar-a', {})}")
                rendered = br["after"]["rendered"]
                check("斜切两段真的画出来了（表现层与 Core 断裂数一致）",
                      rendered["broken"] == 4 and rendered["drawCalls"] >= 9,
                      str(rendered))

                # 真机链路：站到物件前挥一刀，验证「刀刃 3D 相交 → Intents → Core → 斜切渲染」。
                # 关掉自动索敌，避免 attackFacing 被场上的假人带偏（只影响这一刀）。
                page.evaluate("""() => {
                  const h = window.__harness;
                  const p = h.plotDebug().plots.find(q => q.id === 'x-destructibles');
                  // 前面的连击 / 击地测试把假人挪到 (60,60) 并留了一个陪练贴身，
                  // 还改过 combat.weapon / phase。先做一次完整世界复位回到基线，
                  // 否则玩家一直被陪练打断，测的就不是「挥刀砍物件」了。
                  const I = {
                    moveX: 0, moveZ: 0, jumpPressed: false, sprintHeld: false,
                    sprintPressed: false, resetPressed: true, attackPressed: false,
                    attackHeld: false, attackReleased: false, skill2Pressed: false,
                    weaponSlot: 0, dummyClickId: 0, aimX: 0, aimZ: 0, aimActive: false,
                  };
                  h.clock.singleStep(I);
                  h.debug.timeScale = 1;
                  // 站到「中间那根旗杆」正北 1.0m，明确朝向它挥刀。
                  // 旧写法用地块中心 -2.0，正好与 pole-b（z = centerZ-2.05）重合 ——
                  // v9s.60 能过是靠「人和杆重叠」侥幸命中；v9s.61 杆有了碰撞盒，
                  // 玩家一落位就被推开 0.4m，这一刀就砍空了。
                  const st = h.world.destructibles.find(s => s.id === 'pole-b') || { x: p.centerX, z: p.centerZ };
                  h.world.character.position.x = st.x;
                  h.world.character.position.y = 0;
                  h.world.character.position.z = st.z + 1.0;
                  h.world.character.bodyYaw = 0;
                  h.world.character.facing = 0;
                  h.world.combat.phase = 'idle';
                  h.world.combat.phaseTimer = 0;
                  h.world.combat.comboIndex = 0;
                  h.world.combat.hitIds.length = 0;
                  h.world.combat.weapon = 'sword-shield';
                  h.world.modules.targeting = false;
                  h.resetBreaks();
                }""")
                # 挥刀偶发不中：软件渲染下按键可能落在两帧之间（实测 4 次里 1 次）。
                # 最多试 3 次，每次等一刀完整出手 + 收势。
                live_ok = False
                for _ in range(3):
                    page.keyboard.press("j")
                    try:
                        page.wait_for_function(
                            "() => window.__harness.breakDebug().broken > 0", timeout=6000,
                        )
                        live_ok = True
                        break
                    except Exception:
                        page.wait_for_timeout(600)
                live = page.evaluate("""() => {
                  const h = window.__harness;
                  const d = h.breakDebug();
                  h.world.modules.targeting = true;
                  h.debug.timeScale = 0.25;
                  return { broken: d.broken, cuts: d.cuts.filter(c => c.broken) };
                }""")
                check("真机挥刀能打断（3D 刀刃相交 → Intents → Core → 斜切渲染）",
                      live_ok and live["broken"] > 0,
                      f"broken={live['broken']} cuts={live['cuts']}")
                # 按钮状态层端到端：单测只覆盖 derive，这里验收 app.ts 的每帧接线
                # 真的把派生状态写进了真实按钮 DOM（data-phase / data-badge / --bs-deg）。
                bs = page.evaluate("""() => {
                  const h = window.__harness, s = h.world;
                  s.combat.charging = true;
                  s.combat.charge = 0.6;
                  const list = h.buttonStatus();
                  const el = document.getElementById('btn-attack');
                  return {
                    derived: list.find(x => x.id === 'attack'),
                    phase: el.dataset.phase,
                    badge: el.dataset.badge,
                    deg: el.style.getPropertyValue('--bs-deg'),
                    aria: el.getAttribute('aria-label'),
                  };
                }""")
                check("按钮状态接到真实 DOM（蓄力 60% 角标 + 216.0deg 进度环）",
                      bs["derived"]["phase"] == "charging"
                      and bs["phase"] == "charging"
                      and bs["badge"] == "60%"
                      and bs["deg"] == "216.0deg"
                      and "蓄力" in bs["aria"],
                      str(bs))
                bs2 = page.evaluate("""() => {
                  const h = window.__harness, s = h.world;
                  s.combat.charging = false; s.combat.charge = 0;
                  s.combat.phase = 'idle'; s.combat.comboIndex = 0;
                  s.combat.attackProgress = 0;
                  s.abilities.channeling = false; s.abilities.cooldown = 0;
                  s.abilities.rings.length = 0;
                  s.dash.phase = 'idle'; s.dash.cooldown = 0;
                  s.playerLink.cooldown = 0;
                  s.character.grounded = false;
                  h.buttonStatus();
                  const j = document.getElementById('btn-jump');
                  const a = document.getElementById('btn-attack');
                  const out = { jumpPhase: j.dataset.phase, jumpBadge: j.dataset.badge,
                                atkPhase: a.dataset.phase, atkBadge: a.dataset.badge };
                  s.character.grounded = true;
                  h.buttonStatus();
                  return out;
                }""")
                check("按钮状态相位切换（空中锁定 / 复位回 ready）",
                      bs2["jumpPhase"] == "locked" and bs2["jumpBadge"] == "空中"
                      and bs2["atkPhase"] == "ready" and bs2["atkBadge"] == "",
                      str(bs2))

                # 竖屏布局：临时切成手机竖屏，量操作簇中心是否落在约 4/5 高度、贴右侧。
                # 之后立刻恢复 960×600，不影响后续读数 / 采样。
                page.set_viewport_size({"width": 420, "height": 840})
                page.wait_for_timeout(200)
                lay = page.evaluate("""() => {
                  const p = document.getElementById('pad-right');
                  const r = p.getBoundingClientRect();
                  const perf = document.getElementById('perf-meter').getBoundingClientRect();
                  const row = document.getElementById('panel-row').getBoundingClientRect();
                  return {
                    center: r.top + r.height / 2, rightGap: innerWidth - r.right,
                    vh: innerHeight,
                    overlap: !(perf.left >= row.right || perf.right <= row.left
                               || perf.top >= row.bottom || perf.bottom <= row.top),
                    perfTop: perf.top, rowBottom: row.bottom,
                  };
                }""")
                check("竖屏操作簇落在右下约 4/5 高度（中心 ≈ 0.8×视口高）",
                      abs(lay["center"] - 0.8 * lay["vh"]) < lay["vh"] * 0.08
                      and 0 <= lay["rightGap"] < 40,
                      str(lay))
                check("竖屏常驻性能条不与顶部胶囊行重叠",
                      not lay["overlap"], str(lay))
                page.set_viewport_size({"width": 960, "height": 600})
                page.wait_for_timeout(200)

                # ---- v9s.x ① 震屏：低频 trauma² 模型 + 按冲击类型分档 ----
                shk = page.evaluate("""() => {
                  const d = window.__harness.shakeDebug(), P = d.presets;
                  return {
                    kind: d.kind, freq: d.preset.freq, power: d.preset.power,
                    decay: d.preset.decay,
                    lightFreq: P.light.freq, slamFreq: P.slam.freq,
                    lightDecay: P.light.decay, slamDecay: P.slam.decay,
                    lightAmp: P.light.amplitude, heavyAmp: P.heavy.amplitude,
                  };
                }""")
                check("震屏改为低频 trauma² 模型（不再 ~11~19Hz 高频碎抖）",
                      shk["power"] == 2 and 1 <= shk["freq"] <= 8 and shk["decay"] > 0,
                      str(shk))
                check("震屏按冲击类型分档（轻击短促 / 重击大幅长余震）",
                      shk["slamFreq"] < shk["lightFreq"]
                      and shk["slamDecay"] < shk["lightDecay"]
                      and shk["heavyAmp"] > shk["lightAmp"],
                      str(shk))

                # ---- v9s.x ② 常驻性能条：读数 + 人为制造慢帧能否判掉帧 ----
                perf0 = page.evaluate("""() => {
                  const el = document.getElementById('perf-meter');
                  const d = window.__harness.perfDebug();
                  return {
                    exists: !!el, spark: !!el && !!el.querySelector('canvas.perf-spark'),
                    text: el ? el.textContent : '',
                    fps: d.fps, level: d.level, hist: d.history.length, spikes: d.spikes,
                  };
                }""")
                check("帧率信息常驻可读（FPS / 帧时 / 慢帧 / sparkline）",
                      perf0["exists"] and perf0["spark"]
                      and "fps" in perf0["text"] and "慢帧" in perf0["text"]
                      and perf0["fps"] > 0 and perf0["hist"] > 0
                      and perf0["level"] in ("ok", "warn", "bad"),
                      str(perf0))
                # 阻塞主线程 70ms → 下一帧必然是慢帧，验证「能看到是否掉帧」
                page.evaluate("""() => {
                  const t0 = performance.now();
                  while (performance.now() - t0 < 70) {}
                }""")
                page.wait_for_timeout(350)
                perf1 = page.evaluate("""() => {
                  const d = window.__harness.perfDebug();
                  const el = document.getElementById('perf-meter');
                  return { slow: d.slowFrames, spikes: d.spikes, max: d.maxMs,
                           level: d.level, worst: d.worstMs, dataLevel: el.dataset.level };
                }""")
                check("人为制造慢帧时性能条能判定掉帧（尖峰 / 慢帧 / 预警）",
                      perf1["spikes"] > perf0["spikes"] or perf1["slow"] >= 1,
                      str(perf1))

                # ---- v9s.x ③ 技能指示器：数据驱动自动适配 ----
                ind = page.evaluate("""() => {
                  const h = window.__harness, w = h.world;
                  // 前面真机挥刀留下的战斗 / 引导状态先归零，保证 idle 判定干净
                  w.combat.phase = 'idle';
                  w.combat.charging = false;
                  w.combat.comboIndex = 0;
                  w.abilities.channeling = false;
                  w.abilities.rings.length = 0;
                  w.playerLink.phase = 'idle';
                  const idle = h.skillIndicatorDescribe();
                  const oldWeapon = w.combat.weapon;
                  w.combat.weapon = 'bow';
                  w.combat.charging = true;
                  w.combat.charge = 0.7;
                  w.character.facing = 0.5;
                  const s = h.skillIndicatorDescribe().find(x => x.id === 'bow-charge');
                  const reach0 = w.config.hits.reach.bow;
                  // 热改配置里的射程 → 描述应立刻跟着变（不写死数值）
                  w.config.hits.reach.bow = reach0 + 3;
                  const s2 = h.skillIndicatorDescribe().find(x => x.id === 'bow-charge');
                  const s3 = h.skillIndicatorDescribe(1, 0).find(x => x.id === 'bow-charge');
                  w.config.hits.reach.bow = reach0;
                  w.combat.charging = false;
                  // 法杖引导：形状 / 半径从技能 params 自动推断
                  w.combat.weapon = 'staff';
                  w.abilities.channeling = true;
                  w.abilities.channelYaw = -0.6;
                  const v = h.skillIndicatorDescribe().find(x => x.id === 'skill:arcane');
                  const homing = w.config.abilities.arcane.homingRange;
                  w.abilities.channeling = false;
                  w.combat.weapon = oldWeapon;
                  return {
                    idle: idle.length,
                    shape: s && s.shape, radius: s && s.radius, yaw: s && s.yaw, reach0,
                    radius2: s2 && s2.radius, yaw3: s3 && s3.yaw,
                    volleyShape: v && v.shape, volleyRadius: v && v.radius,
                    volleyYaw: v && v.yaw, homing,
                  };
                }""")
                check("技能指示器：蓄力线 / 引导扇形的范围与朝向全部来自数据",
                      ind["idle"] == 0
                      and ind["shape"] == "line"
                      and abs(ind["radius"] - ind["reach0"]) < 1e-6
                      and abs(ind["yaw"] - 0.5) < 1e-6
                      and abs(ind["radius2"] - (ind["reach0"] + 3)) < 1e-6
                      and abs(ind["yaw3"] - math.pi / 2) < 1e-6
                      and ind["volleyShape"] == "sector"
                      and abs(ind["volleyRadius"] - ind["homing"]) < 1e-6
                      and abs(ind["volleyYaw"] + 0.6) < 1e-6,
                      str(ind))

                # 渲染层接线：塞一个持久电环，等一帧后 debug 应出现对应范围
                page.evaluate("""() => {
                  window.__harness.world.abilities.rings.push({
                    id: 991, x: 2.5, z: -1.5, radius: 2.4,
                    life: 3.0, duration: 3.0, pulseTimer: 1.0,
                  });
                }""")
                page.wait_for_timeout(200)
                rind = page.evaluate("""() => {
                  const list = window.__harness.skillIndicatorDebug();
                  const s = list.find(x => x.id === 'ring:991');
                  window.__harness.world.abilities.rings.length = 0;
                  return { count: list.length, ids: list.map(x => x.id),
                           shape: s && s.shape, radius: s && s.radius,
                           x: s && s.x, z: s && s.z };
                }""")
                check("技能指示器已接进渲染帧（电环范围画在放置点）",
                      rind["shape"] == "circle"
                      and abs(rind["radius"] - 2.4) < 1e-6
                      and abs(rind["x"] - 2.5) < 1e-6
                      and abs(rind["z"] + 1.5) < 1e-6,
                      str(rind))

                # ---- v9s.x ④ 界面划分：工位分功能组 / 状态分语义区 / 胶囊分两组 ----
                ui = page.evaluate("""() => {
                  const panel = document.getElementById('lab-panel');
                  const groups = [...panel.querySelectorAll('.lab-group')].map(g => ({
                    id: g.dataset.group,
                    count: g.querySelectorAll('[data-station]').length,
                    label: (g.querySelector('.lab-group-label') || {}).textContent || '',
                  }));
                  const rows = panel.querySelectorAll('[data-station]').length;
                  return {
                    groups, rows, sum: groups.reduce((n, g) => n + g.count, 0),
                    view: document.querySelectorAll('#panel-row [data-pill-group="view"]').length,
                    sw: document.querySelectorAll('#panel-row [data-pill-group="switch"]').length,
                    sep: !!document.querySelector('#panel-row .pill-sep'),
                  };
                }""")
                check("工位面板按功能分组，全部工位都在组内、一个没丢",
                      len(ui["groups"]) >= 3 and ui["sum"] == ui["rows"]
                      and ui["rows"] >= 10
                      and all(g["label"] for g in ui["groups"]),
                      str(ui))
                check("顶部胶囊按「面板 / 开关」划分（4 查看 + 2 开关 + 分隔线）",
                      ui["view"] == 4 and ui["sw"] == 2 and ui["sep"], str(ui))

                # 展开「状态」面板，验收分区渲染 + diff 缓存（标题帧帧不重写）
                page.evaluate("""() => {
                  const t = document.getElementById('hud-toggle');
                  if (t.getAttribute('aria-expanded') !== 'true') {
                    t.dispatchEvent(new PointerEvent('pointerdown',
                      { bubbles: true, cancelable: true }));
                  }
                }""")
                page.wait_for_timeout(260)
                hud = page.evaluate("""() => {
                  const el = document.getElementById('hud');
                  const vis = (list) => list.filter(x => x.style.display !== 'none');
                  const heads = vis([...el.querySelectorAll('.hud-head')]);
                  const lines = vis([...el.querySelectorAll('.hud-line')]);
                  window.__hudHeads = heads;
                  window.__hudHeadWrites = 0;
                  window.__hudObs = new MutationObserver(recs => {
                    for (const r of recs) {
                      const pn = r.target && r.target.parentElement;
                      if (pn && pn.classList.contains('hud-head')) window.__hudHeadWrites++;
                    }
                  });
                  window.__hudObs.observe(el, { subtree: true, childList: true,
                                                characterData: true });
                  return {
                    titles: heads.map(x => x.textContent),
                    lineCount: lines.length,
                    compact: el.classList.contains('is-compact'),
                    firstLine: lines.length ? lines[0].textContent : '',
                  };
                }""")
                check("状态读数分成 6 个语义区（横屏 15 行读数不丢）",
                      len(hud["titles"]) == 6
                      and hud["titles"][0] == "运行 / 角色"
                      and hud["titles"][-1] == "调试 / 事件"
                      and hud["lineCount"] == 15
                      and not hud["compact"]
                      and "tick" in hud["firstLine"],
                      str(hud))
                page.wait_for_timeout(420)
                stab = page.evaluate("""() => {
                  const heads = [...document.querySelectorAll('#hud .hud-head')]
                    .filter(x => x.style.display !== 'none');
                  window.__hudObs.disconnect();
                  return {
                    same: heads.length === window.__hudHeads.length
                          && heads.every((h, i) => h === window.__hudHeads[i]),
                    headWrites: window.__hudHeadWrites,
                    writes: window.__harness.hudDebug().writes,
                  };
                }""")
                check("状态分区用 diff 缓存：标题不重写、节点不重建（不拖帧率）",
                      stab["same"] and stab["headWrites"] == 0, str(stab))
                # 收起状态面板，恢复默认折叠态，不影响后续段
                page.evaluate("""() => {
                  const t = document.getElementById('hud-toggle');
                  if (t.getAttribute('aria-expanded') === 'true') {
                    t.dispatchEvent(new PointerEvent('pointerdown',
                      { bubbles: true, cancelable: true }));
                  }
                }""")

                # ---- v9s.x ⑤ 指示器细化：弓特判 / 内圈裁剪 / 扇角数据化 ----
                ind2 = page.evaluate("""() => {
                  const h = window.__harness, w = h.world;
                  const oldWeapon = w.combat.weapon;
                  w.combat.phase = 'idle'; w.combat.charging = false;
                  w.abilities.channeling = false; w.abilities.rings.length = 0;
                  w.playerLink.phase = 'idle';

                  // ① 弓释放：charging=false + phase=active，不该有任何近战扇形
                  w.combat.weapon = 'bow'; w.combat.charging = false;
                  w.combat.phase = 'active'; w.combat.attackProgress = 0.5;
                  const bowRel = h.skillIndicatorDescribe();
                  const bowSectors = bowRel.filter(x => x.shape === 'sector').length;

                  // ② 近战：范围与 Core 判定同源（半角翻倍 / 含目标半径 / 击地圆）
                  const oldCombo = w.combat.comboIndex;
                  w.combat.weapon = 'greatsword'; w.combat.phase = 'active';
                  w.combat.comboIndex = 1;   // 固定第一段，扫掠覆盖整个前半球
                  const melee = h.skillIndicatorDescribe().find(x => x.id === 'melee');
                  const slam = h.skillIndicatorDescribe().find(x => x.id === 'slam');
                  const cr = w.config.characterRadius, arc0 = w.config.hits.arcDeg;
                  const expectR = w.config.hits.reach.greatsword + w.config.dummies.radius;
                  const expectSlamR = w.config.combat.weapons.greatsword.groundSlam.radius
                                    + w.config.dummies.radius;
                  w.config.characterRadius = cr + 0.15;
                  const melee2 = h.skillIndicatorDescribe().find(x => x.id === 'melee');
                  w.config.characterRadius = cr;
                  w.combat.comboIndex = oldCombo;

                  // ③ 齐射扇角严格来自 params（无 +24° 魔法余量）
                  w.combat.weapon = 'staff'; w.combat.phase = 'idle';
                  w.abilities.channeling = true;
                  const volley = h.skillIndicatorDescribe().find(x => x.id === 'skill:arcane');
                  const rt = w.skills.find(x => x.cfg.kind === 'channelVolley');
                  const expectArc = (rt.params.perWave - 1) * rt.params.spreadDeg;
                  w.abilities.channeling = false;
                  w.combat.weapon = oldWeapon;
                  return {
                    bowSectors, bowLen: bowRel.length,
                    meleeInner: melee && melee.innerRadius, cr,
                    meleeInner2: melee2 && melee2.innerRadius,
                    meleeArc: melee && melee.arcDeg, arc0,
                    meleeRadius: melee && melee.radius, expectR,
                    slamRadius: slam && slam.radius, expectSlamR,
                    volleyArc: volley && volley.arcDeg, expectArc,
                  };
                }""")
                check("指示器范围与 Core 判定同源：弓无扇形 / 半角翻倍 / 含目标半径 / 击地圆 / 内圈裁剪",
                      ind2["bowSectors"] == 0
                      and abs(ind2["meleeInner"] - (ind2["cr"] + 0.02)) < 1e-6
                      and abs(ind2["meleeInner2"] - (ind2["cr"] + 0.15 + 0.02)) < 1e-6
                      and abs(ind2["meleeArc"] - 2 * ind2["arc0"]) < 1e-6
                      and abs(ind2["meleeRadius"] - ind2["expectR"]) < 1e-6
                      and abs(ind2["slamRadius"] - ind2["expectSlamR"]) < 1e-6
                      and abs(ind2["volleyArc"] - ind2["expectArc"]) < 1e-6,
                      str(ind2))

                # ---- v9s.x ⑤ 显示 / 退出过渡：真实渲染帧采样 alpha 序列 ----
                fade = page.evaluate("""async () => {
                  const h = window.__harness, w = h.world;
                  h.debug.paused = true;            // 冻住 Core，手动状态不被 step 清掉
                  w.combat.weapon = 'staff';
                  w.combat.phase = 'idle';
                  w.abilities.channeling = false;
                  w.abilities.rings.length = 0;
                  await new Promise(r => setTimeout(r, 400));   // 等残留指示器淡出
                  const sample = () => {
                    const f = h.skillIndicatorFade().find(x => x.id === 'skill:arcane');
                    return f ? f.alpha : 0;
                  };
                  const collect = async (n) => {
                    const seq = [];
                    await new Promise(res => {
                      let i = 0;
                      const tick = () => {
                        seq.push(sample());
                        if (++i < n) requestAnimationFrame(tick); else res();
                      };
                      requestAnimationFrame(tick);
                    });
                    return seq;
                  };
                  // 出现 → 淡入
                  w.abilities.channeling = true; w.abilities.channelYaw = 0.3;
                  const rise = await collect(16);
                  // 退出 → 淡出
                  w.abilities.channeling = false;
                  const fall = await collect(20);
                  const live = h.skillIndicatorDebug().some(x => x.id === 'skill:arcane')
                    || h.skillIndicatorFade().some(x => x.id === 'skill:arcane');
                  h.debug.paused = false;
                  return { rise, fall, live };
                }""")
                midRise = [a for a in fade["rise"] if 0 < a < 0.999]
                midFall = [a for a in fade["fall"] if 0 < a < 0.999]
                check("指示器显示/退出有淡入淡出过渡（不是瞬间跳变）",
                      len(midRise) >= 1 and max(fade["rise"]) >= 0.5
                      and len(midFall) >= 1
                      and fade["fall"][0] > fade["fall"][-1]
                      and fade["fall"][-1] < 0.5,
                      str({"rise": fade["rise"][:6], "fall": fade["fall"][:6],
                           "midRise": len(midRise), "midFall": len(midFall)}))
                # 用 rAF 轮询而不是固定等待：软件渲染帧率不稳，固定 1s 可能不够，
                # 固定时长会让「回收」断言偶发 flaky（verify 里出现过一次 69/70）。
                gone = page.evaluate("""async () => {
                  const nearlyGone = () => {
                    const f = window.__harness.skillIndicatorFade()
                      .find(x => x.id === 'skill:arcane');
                    return !f || f.alpha < 0.02;
                  };
                  for (let i = 0; i < 60; i++) {
                    if (nearlyGone()) return true;
                    await new Promise(r => requestAnimationFrame(r));
                  }
                  return nearlyGone();
                }""")
                check("淡出结束后回收指示器几何（不残留、不无限累积）", gone, str(gone))

                check("v9s.x 全段无新增页面异常", not errors, str(errors[:2]))

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
