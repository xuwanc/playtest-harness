#!/usr/bin/env python3
"""v9s.38 视觉验证：陪练角色 / 地块上的特效层级。"""
import json, sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C

OUT = ROOT / 'shots' / 'v9s38'
OUT.mkdir(exist_ok=True)

with C.StaticServer() as srv:
    pw, browser, page, errors = C.launch(width=1440, height=900)
    C.open_game(page, srv.url)
    page.wait_for_timeout(1200)
    page.evaluate("""() => {
      document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = 'none'; });
      const vb = document.getElementById('version-badge'); if (vb) vb.style.display = 'none';
      // open_game 里 preview() 会把主循环画面钉住（clip-lab 的截图用），这里要交还主循环
      window.__harness.clipLab.release();
    }""")

    def teleport(x, z, y=0.0, pitch=40, yaw=0, zoom=1.3, wait=700):
        page.evaluate("""(o) => {
          const h = window.__harness;
          const c = h.world.character;
          c.position.x = o.x; c.position.z = o.z; c.position.y = o.y;
          c.velocity.x = 0; c.velocity.y = 0; c.velocity.z = 0;
          h.view.snapCamera(o.x, o.y, o.z);
          h.viewConfig.camera.pitchDeg = o.pitch;
          h.viewConfig.camera.yawDeg = o.yaw;
          h.clipLab.zoom(o.zoom);
        }""", {"x": x, "z": z, "y": y, "pitch": pitch, "yaw": yaw, "zoom": zoom})
        page.wait_for_timeout(wait)

    # 1) 默认混战站位：陪练应围在 2~3m 外踱步
    teleport(0, 0, 0, 40, 0, 1.15, 1200)
    page.screenshot(path=str(OUT / '01-fighters-default.png'))
    print('01', page.evaluate("""() => window.__harness.world.dummies.slice(6).map(d => ({
      id: d.id, w: d.weapon, mode: d.mode, cd: +d.attackCooldown.toFixed(2),
      dist: +Math.hypot(d.position.x - window.__harness.world.character.position.x,
                        d.position.z - window.__harness.world.character.position.z).toFixed(2),
    }))"""))

    # 2) 站上 1.2m 方块：电环 + 冲刺光环应压在方块顶面
    teleport(11.4, -9.8, 1.2, 28, 12, 0.8, 600)
    page.evaluate("""() => {
      const h = window.__harness, w = h.world;
      w.dash.id += 1; w.dash.kind = 'roll';
      w.dash.fromX = 11.4; w.dash.fromZ = -9.8; w.dash.toX = 11.4; w.dash.toZ = -9.8;
      w.abilities.rings.push({ x: 11.4, z: -9.8, radius: 1.6, life: 2.4, duration: 2.4 });
    }""")
    page.wait_for_timeout(150)
    page.screenshot(path=str(OUT / '02-fx-on-block.png'))
    print('02 y =', page.evaluate("() => window.__harness.world.character.position.y"))

    # 3) 平地对照
    teleport(8.5, -3.6, 0, 28, 12, 0.8, 500)
    page.evaluate("""() => {
      const h = window.__harness, w = h.world;
      w.dash.id += 1; w.dash.kind = 'roll';
      w.dash.fromX = 8.5; w.dash.fromZ = -3.6; w.dash.toX = 8.5; w.dash.toZ = -3.6;
      w.abilities.rings.push({ x: 8.5, z: -3.6, radius: 1.6, life: 2.4, duration: 2.4 });
    }""")
    page.wait_for_timeout(150)
    page.screenshot(path=str(OUT / '03-fx-on-ground.png'))

    # 4) 剑盾陪练出招
    page.evaluate("""() => {
      const h = window.__harness, w = h.world;
      w.character.position.x = 0; w.character.position.z = 0; w.character.position.y = 0;
      const f = w.dummies[6];
      f.position.x = 0; f.position.z = 1.5; f.mode = 'attack'; f.attackCooldown = 0;
      for (const d of w.dummies) if (d !== f && d.weapon) { d.position.x = 40; d.position.z = 40; d.mode = 'idle'; }
      h.view.snapCamera(0, 0, 0);
      h.viewConfig.camera.pitchDeg = 24; h.viewConfig.camera.yawDeg = -90;
      h.clipLab.zoom(0.62);
    }""")
    page.wait_for_timeout(320)
    page.screenshot(path=str(OUT / '04-fighter-swordshield.png'))

    # 5) 大剑陪练
    page.evaluate("""() => {
      const h = window.__harness, w = h.world;
      const f = w.dummies[8];
      w.dummies[6].position.x = 40; w.dummies[6].position.z = 40;
      f.position.x = 0; f.position.z = 1.7; f.mode = 'attack'; f.attackCooldown = 0;
      h.viewConfig.camera.yawDeg = -90;
    }""")
    page.wait_for_timeout(360)
    page.screenshot(path=str(OUT / '05-fighter-greatsword.png'))

    print('pageerrors:', errors[:5])
    C.shutdown(pw, browser)
