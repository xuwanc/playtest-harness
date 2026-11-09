#!/usr/bin/env python3
"""v9s.41 视觉验证：连击跨步换腿 —— 第 1/2/3 段「跨步落定」那一刻的侧面站姿。

怎么抓：攻击键（j）按 90ms 连点，页面内用 4ms 轮询在 `comboIndex == k &&
attackProgress >= 0.42` 时把 debug.paused 置 true（软件渲染下墙钟时间不可靠，
等到再截图早就划过去了），截完再放开。
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C

OUT = ROOT / 'shots' / 'v9s41'
OUT.mkdir(parents=True, exist_ok=True)


def crop(im: Image.Image, box: tuple[int, int, int, int], pad: int = 30) -> Image.Image:
    w, h = im.size
    x0, y0, x1, y1 = box
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(w, x1 + pad)
    y1 = min(h, y1 + pad)
    return im.crop((x0, y0, x1, y1))


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1100, height=760)
        C.open_game(page, srv.url)
        page.wait_for_timeout(900)
        page.evaluate("""() => {
          document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = 'none'; });
          const vb = document.getElementById('version-badge'); if (vb) vb.style.display = 'none';
          window.__harness.clipLab.release();
          const h = window.__harness, w = h.world, c = w.character;
          // 清场：只留玩家，免得陪练挤进画面
          for (const d of w.dummies) { d.mode = 'idle'; d.position.x = 60; d.position.z = 60; d.homeX = 60; d.homeZ = 60; }
          w.combat.phase = 'idle'; w.combat.phaseTimer = 0; w.combat.comboIndex = 0;
          w.combat.comboWindow = 0;
          c.position.x = 0; c.position.y = 0; c.position.z = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          c.bodyYaw = 0;
          const vc = h.viewConfig.camera;
          vc.pitchDeg = 8;
          vc.yawDeg = 300;
          vc.distance = 6.2;
          vc.followSpeed = 1;
          h.view.snapCamera(0, 0.9, 0);

          // 4ms 轮询：到点立刻冻结（否则截图时动作早已划过）
          window.__pauseAt = (idx, pmin) => new Promise((res) => {
            const t0 = w.time;
            const id = setInterval(() => {
              const k = w.combat;
              if (k.comboIndex === idx && k.attackProgress >= pmin && k.phase !== 'idle') {
                clearInterval(id);
                h.debug.paused = true;
                res({ idx, p: k.attackProgress, phase: k.phase, t: +(w.time - t0).toFixed(3),
                  yaw: +c.bodyYaw.toFixed(2), face: +k.attackFacing.toFixed(2),
                  shown: +h.yawDebug().shown.toFixed(2), cam: h.viewConfig.camera.yawDeg });
              } else if (w.time - t0 > 6) {
                clearInterval(id);
                h.debug.paused = true;
                res({ idx: -1, p: k.attackProgress, phase: k.phase, t: -1 });
              }
            }, 4);
          });
          // 攻击会朝相机方向转身（facingFor），Core 每步都会改写 bodyYaw。
          // 与其钉角色，不如让相机跟着角色的朝向转：相对视角恒定，左右腿才可比。
          window.__pin = setInterval(() => {
            h.viewConfig.camera.yawDeg = 300 - (c.bodyYaw * 180) / Math.PI;
            c.velocity.x = 0; c.velocity.z = 0;
            c.position.x = 0; c.position.z = 0;
          }, 8);
          window.__mash = () => {
            const j = (type) => window.dispatchEvent(new KeyboardEvent(type, { key: 'j', code: 'KeyJ', bubbles: true }));
            window.__mashTimer = setInterval(() => { j('keydown'); j('keyup'); }, 90);
          };
        }""")

        page.evaluate("() => window.__mash()")
        shots = []
        for idx in (1, 2, 3):
            page.evaluate("() => { window.__harness.debug.paused = false; }")
            info = page.evaluate(f"() => window.__pauseAt({idx}, 0.42)")
            page.wait_for_timeout(120)
            f = OUT / f'_seg{idx}.png'
            page.screenshot(path=str(f))
            print("seg", idx, info)
            shots.append((idx, f))

        page.evaluate("""() => { clearInterval(window.__mashTimer); clearInterval(window.__pin); window.__harness.debug.paused = false; }""")

        # 拼图：三段并排（裁掉大片空地，只留角色）
        ims = []
        for idx, f in shots:
            im = Image.open(f).convert('RGB')
            w, h = im.size
            # 角色在画面中心偏下：直接取中间 44% 宽、78% 高的窗口
            box = (int(w * 0.20), int(h * 0.05), int(w * 0.80), int(h * 0.95))
            c = crop(im, box, 0)
            th = 720
            c = c.resize((int(c.width * th / c.height), th), Image.LANCZOS)
            ims.append((idx, c))
        tw = max(c.width for _, c in ims)
        sheet = Image.new('RGB', (tw * len(ims), 720), (10, 11, 16))
        for i, (_, c) in enumerate(ims):
            sheet.paste(c, (i * tw + (tw - c.width) // 2, 0))
        sheet.save(OUT / '01-combo-legs.png')
        print('->', OUT / '01-combo-legs.png')

        # 全景
        page.evaluate("""() => {
          const h = window.__harness;
          h.viewConfig.camera.pitchDeg = 28;
          h.viewConfig.camera.yawDeg = 40;
          h.viewConfig.camera.distance = 7.5;
          h.view.snapCamera(0, 0, 0);
        }""")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT / '02-overview.png'))
        for _, f in shots:
            f.unlink(missing_ok=True)

        print('errors', errors[:3])
        browser.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
