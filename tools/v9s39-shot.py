#!/usr/bin/env python3
"""v9s.39 视觉验证：持械陪练的一轮连击（同一轮里的第 1 / 2 / 3 段刀路不同）。

抓拍方式：只留一个陪练、把它摆到玩家面前并搬好工位（否则牵引半径会把它拽走），
然后等「游戏时间」推进到对应段号 + active，再截图 —— 软件渲染下墙钟时间不可靠。
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C

OUT = ROOT / 'shots' / 'v9s39'
OUT.mkdir(exist_ok=True)


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1440, height=900)
        C.open_game(page, srv.url)
        page.wait_for_timeout(1000)
        page.evaluate("""() => {
          document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = 'none'; });
          const vb = document.getElementById('version-badge'); if (vb) vb.style.display = 'none';
          window.__harness.clipLab.release();
        }""")

        # 1) 全景混战：三个陪练都在 spar，各自一轮 3 段
        page.evaluate("""() => {
          const h = window.__harness, w = h.world, c = w.character;
          c.position.x = 0; c.position.z = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          h.view.snapCamera(0, 0, 0);
          h.viewConfig.camera.pitchDeg = 30;
          h.viewConfig.camera.yawDeg = -14;
          h.viewConfig.camera.distance = 8.5;
          h.clipLab.zoom(0.45);
          // 三个陪练围成三角并错开首刀，一帧里能同时看到不同段位
          const fs = w.dummies.filter((d) => d.weapon);
          fs.forEach((d, i) => {
            const a = -0.6 + i * 2.1;
            d.position.x = Math.sin(a) * 1.9;
            d.position.z = Math.cos(a) * 1.9;
            d.homeX = d.position.x; d.homeZ = d.position.z;
            d.mode = 'attack'; d.attackCooldown = i * 0.35;
          });
        }""")
        page.wait_for_timeout(1600)
        page.screenshot(path=str(OUT / '01-melee.png'))
        print('01', page.evaluate("""() => window.__harness.world.dummies.filter(d => d.weapon).map(d => ({
          w: d.weapon, mode: d.mode, seg: d.attackComboIndex, left: d.attackComboLeft,
          phase: d.attackPhase,
        }))"""))

        # 2) 单兵连击：剑盾摆到玩家正前方，逐段抓拍
        page.evaluate("""() => {
          const h = window.__harness, w = h.world, c = w.character;
          const s = w.dummies.find((d) => d.weapon === 'sword-shield');
          for (const d of w.dummies) {
            if (d.id === s.id) continue;
            d.mode = 'idle'; d.position.x = 60; d.position.z = 60;
          }
          w.combat.phase = 'idle'; w.combat.phaseTimer = 0;
          s.mode = 'attack'; s.attackCooldown = 0;
          s.position.x = c.position.x + 0.55;
          s.position.z = c.position.z + 1.25;
          s.homeX = s.position.x; s.homeZ = s.position.z;
          s.velocity.x = 0; s.velocity.z = 0;
          // 木桩玩家：连击的击退会把玩家推远，距离一超就断连
          window.__anchor = { x: c.position.x, z: c.position.z };
          window.__pin = setInterval(() => {
            const p = w.character.position;
            p.x = window.__anchor.x; p.z = window.__anchor.z;
            w.character.velocity.x = 0; w.character.velocity.z = 0;
            w.playerHurt.knockX = 0; w.playerHurt.knockZ = 0;
          }, 16);
          h.view.snapCamera(c.position.x, 0, c.position.z);
          h.viewConfig.camera.pitchDeg = 20;
          h.viewConfig.camera.yawDeg = -68;
          // zoom 最小 0.45（超了会被 clamp），想更近只能压相机基准距离
          h.viewConfig.camera.distance = 9;
          h.clipLab.zoom(0.45);
          // 放慢 10 倍：active 段只有 0.13s，软件渲染下截图本身就占 200ms 墙钟
          h.debug.timeScale = 0.05;
        }""")

        for seg in (1, 2, 3):
            page.wait_for_function(
                "() => {"
                "  const s = window.__harness.world.dummies.find(d => d.weapon === 'sword-shield');"
                "  return s.attackComboIndex === %d && s.attackPhase === 'active';"
                "}" % seg,
                timeout=180000,
            )
            page.screenshot(path=str(OUT / f'0{seg + 1}-combo-seg{seg}.png'))
            print(f'0{seg + 1} seg={seg}', page.evaluate("""() => {
              const s = window.__harness.world.dummies.find(d => d.weapon === 'sword-shield');
              return { phase: s.attackPhase, seg: s.attackComboIndex, left: s.attackComboLeft,
                       prog: +s.attackProgress.toFixed(2) };
            }"""))

        page.evaluate("() => { clearInterval(window.__pin); window.__harness.debug.timeScale = 1; }")
        print('errors', errors[:3])
        C.shutdown(pw, browser)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
