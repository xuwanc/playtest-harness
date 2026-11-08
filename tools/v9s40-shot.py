#!/usr/bin/env python3
"""v9s.40 视觉验证：陪练在对峙距离上「走走停停」，不再原地碎步绕圈。

抓拍方式：只留一个剑盾陪练（红），玩家钉住但左右平移 1.4m —— 陪练要维持 standoff
只能切向踱步。相机每帧 snap 到陪练（相机默认跟随玩家，snap 一次会被拉回），
间隔 0.22s 连拍 8 帧，再按红色像素包围盒裁切放大拼成一张，便于看清腿。
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C

OUT = ROOT / 'shots' / 'v9s40'
OUT.mkdir(parents=True, exist_ok=True)


def red_box(im: Image.Image) -> tuple[int, int, int, int] | None:
    """红色（陪练剑盾）像素的包围盒。玩家是蓝的，天然分开。"""
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b = px[x, y]
            if r > 110 and g < 95 and b < 95 and r - g > 40:
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)
    if maxx <= minx:
        return None
    return minx, miny, maxx, maxy


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1100, height=760)
        C.open_game(page, srv.url)
        page.wait_for_timeout(700)
        page.evaluate("""() => {
          document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = 'none'; });
          const vb = document.getElementById('version-badge'); if (vb) vb.style.display = 'none';
          window.__harness.clipLab.release();
          const h = window.__harness, w = h.world, c = w.character;
          const s = w.dummies.find((d) => d.weapon === 'sword-shield');
          for (const d of w.dummies) {
            if (d.id === s.id) continue;
            d.mode = 'idle'; d.position.x = 60; d.position.z = 60; d.homeX = 60; d.homeZ = 60;
          }
          s.mode = 'spar'; s.attackCooldown = 9999;
          s.position.x = 0; s.position.z = -2.4; s.homeX = 0; s.homeZ = -2.4;
          s.velocity.x = 0; s.velocity.z = 0;
          window.__t0 = w.time;
          window.__pin = setInterval(() => {
            const t = w.time - window.__t0;
            c.position.x = Math.sin(t * 2.8) * 1.4;
            c.position.z = 0;
            c.velocity.x = 0; c.velocity.z = 0;
            w.playerHurt.knockX = 0; w.playerHurt.knockZ = 0;
          }, 8);
          const vc = h.viewConfig.camera;
          vc.pitchDeg = 10;
          vc.yawDeg = 92;
          vc.distance = 4.4;
        }""")
        page.wait_for_timeout(1200)

        frames = []
        for i in range(8):
            page.evaluate(
                "() => { const h = window.__harness;"
                " const s = h.world.dummies.find((d) => d.weapon === 'sword-shield');"
                " h.view.snapCamera(s.position.x, 0.95, s.position.z); }"
            )
            page.wait_for_timeout(150)
            f = OUT / f'_f{i}.png'
            page.screenshot(path=str(f))
            frames.append(f)

        crops = []
        for f in frames:
            im = Image.open(f).convert('RGB')
            box = red_box(im)
            if not box:
                continue
            pad = 62
            x0 = max(0, box[0] - pad)
            y0 = max(0, box[1] - pad)
            x1 = min(im.width, box[2] + pad)
            y1 = min(im.height, box[3] + pad)
            c = im.crop((x0, y0, x1, y1))
            th = 420
            crops.append(c.resize((max(1, int(c.width * th / c.height)), th), Image.LANCZOS))

        if crops:
            tw = max(c.width for c in crops)
            cols = min(4, len(crops))
            rows = (len(crops) + cols - 1) // cols
            sheet = Image.new('RGB', (tw * cols, 420 * rows), (8, 10, 14))
            for i, c in enumerate(crops):
                sheet.paste(c, ((i % cols) * tw + (tw - c.width) // 2, (i // cols) * 420))
            sheet.save(OUT / '02-standoff-walkstop.png')
            print('->', OUT / '02-standoff-walkstop.png')

        page.evaluate(
            "() => { document.querySelectorAll('[data-ui-region]').forEach((e) => e.style.display = '');"
            " const vb = document.getElementById('version-badge'); if (vb) vb.style.display = '';"
            " const h = window.__harness, c = h.world.character;"
            " h.viewConfig.camera.pitchDeg = 34; h.viewConfig.camera.distance = 9;"
            " h.view.snapCamera(c.position.x, 0, c.position.z); }"
        )
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT / '01-overview.png'))
        print('->', OUT / '01-overview.png', 'errors:', errors)
        browser.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
