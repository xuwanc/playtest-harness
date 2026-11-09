#!/usr/bin/env python3
"""v9s.55 待机斜跨站姿验收：站立 / 停步瞬间 / 站定三态，正面 + 侧面。

用法：
    npm run build && python3 tools/stance-shot.py

产物落在 shots/stance/：
    01-idle-front.png   开局站定（正面：肩线是否一侧沉、脚是否错开）
    02-idle-side.png    开局站定（侧面：前后脚错开最清楚的角度）
    03-stop-mid.png     松手 0.30s（收相中：最后一步还没落定）
    04-stop-end.png     松手 1.10s（斜跨到位：前脚留前、重心压后腿）
    05-walk.png         还在走（对照：斜跨权重必须为 0）

同时打印 gaitDebug 的腿角 / 斜跨权重，直接和截图对照。
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'stance'
OUT.mkdir(parents=True, exist_ok=True)


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=900, height=900)
        C.open_game(page, srv.url)
        # open_game 会把画面钉在「大剑预览」姿态上，验收实时待机必须交还主循环
        page.evaluate("""() => {
          window.__harness.clipLab.release();
          const c = window.__harness.world.character;
          c.position.x = -14.0; c.position.z = 9.5; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          (window.__harness.world.dummies || []).forEach((d, i) => {
            d.position.x = 60 + i * 3; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
          });
        }""")
        page.wait_for_timeout(1200)

        def cam(pitch: float, yaw: float, dist: float = 3.4, face: float = 0.0, wait: int = 500) -> None:
            page.evaluate("""(o) => {
              const h = window.__harness;
              const c = h.world.character;
              h.viewConfig.camera.pitchDeg = o.pitch;
              h.viewConfig.camera.yawDeg = o.yaw;
              h.viewConfig.camera.distance = o.dist;
              h.clipLab.zoom(1);
              c.facing = o.face; c.bodyYaw = o.face; c.headYaw = o.face;
              h.view.snapCamera(c.position.x, c.position.y, c.position.z);
            }""", {"pitch": pitch, "yaw": yaw, "dist": dist, "face": face})
            page.wait_for_timeout(wait)

        def gait() -> dict:
            return page.evaluate("() => window.__harness.gaitDebug()")

        def show(tag: str) -> None:
            g = gait()
            print(f"{tag:14s} idleW={g.get('idleW'):.3f} frontLeft={g.get('idleFrontLeft')}"
                  f" hipL={g['legLPitch']:+.3f} hipR={g['legRPitch']:+.3f}"
                  f" sink={g.get('idleSink', 0):.4f} shift={g.get('idleShift', 0):+.4f}")

        # 1) 开局站定：正面
        cam(8, 0, face=0.0)
        page.screenshot(path=str(OUT / '01-idle-front.png'))
        show('idle-front')

        # 2) 侧面：前后脚错开最清楚
        cam(4, 0, face=1.5708)
        page.screenshot(path=str(OUT / '02-idle-side.png'))
        show('idle-side')

        # 3) 走一段再松手，看「停步 → 斜跨」是不是连续的
        cam(6, 0, dist=4.0, face=1.5708)
        page.click('canvas')
        page.keyboard.down('w')
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT / '05-walk.png'))
        show('walking')
        page.keyboard.up('w')
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / '03-stop-mid.png'))
        show('stop-0.30s')
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / '04-stop-end.png'))
        show('stop-1.10s')

        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
