#!/usr/bin/env python3
"""v9s.52 造型验收：驼背老人（?hero=elder）的四视角 + 走路胡子摆动。"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'elder'
OUT.mkdir(parents=True, exist_ok=True)


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=900, height=900)
        C.open_game(page, srv.url + '?hero=elder')
        # open_game 会把画面钉在「大剑预览」姿态上，验收实时造型必须交还主循环。
        page.evaluate("""() => {
          window.__harness.clipLab.release();
          const c = window.__harness.world.character;
          c.position.x = -14.0; c.position.z = 9.5; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          // 把陪练挪走：特写镜头里它们会挡在相机和主角之间
          (window.__harness.world.dummies || []).forEach((d, i) => {
            d.position.x = 60 + i * 3; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
          });
        }""")
        page.wait_for_timeout(600)

        def cam(pitch: float, yaw: float, dist: float = 3.2, face: float = 0.0, wait: int = 900) -> None:
            page.evaluate("""(o) => {
              const h = window.__harness;
              const c = h.world.character;
              h.viewConfig.camera.pitchDeg = o.pitch;
              h.viewConfig.camera.yawDeg = o.yaw;
              h.viewConfig.camera.distance = o.dist;   // 基础距离 17m 是玩法视角，特写要压到 3m
              h.clipLab.zoom(1);
              // 角色静止时朝向由 Core 保持；直接写 facing/bodyYaw 让它面向相机，
              // 否则不同 yaw 拍到的都是同一个侧影。
              c.facing = o.face; c.bodyYaw = o.face; c.headYaw = o.face;
              h.view.snapCamera(c.position.x, c.position.y, c.position.z);
            }""", {"pitch": pitch, "yaw": yaw, "dist": dist, "face": face})
            page.wait_for_timeout(wait)

        print('body =', page.evaluate("() => window.__harness.view.bodyTypes()"))

        # 1) 正面：小头 / 地中海 / 白胡子
        cam(10, 0, face=0.0)
        page.screenshot(path=str(OUT / '01-front.png'))

        # 2) 侧面：驼背 + 屈膝最容易读出的角度
        cam(4, 0, face=1.5708)
        page.screenshot(path=str(OUT / '02-side.png'))

        # 3) 背面：顶后一圈头发 + 两鬓，露出中间秃顶
        cam(14, 0, face=3.1416)
        page.screenshot(path=str(OUT / '03-back.png'))

        # 4) 走路中段：胡子向后甩
        cam(8, 0, face=0.7854)
        page.click('canvas')
        page.keyboard.down('w')
        page.wait_for_timeout(900)
        page.screenshot(path=str(OUT / '04-walk.png'))
        page.keyboard.up('w')
        print('walk speed =', page.evaluate(
            "() => +Math.hypot(window.__harness.world.character.velocity.x,"
            " window.__harness.world.character.velocity.z).toFixed(2)"))

        print('errors =', errors)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
