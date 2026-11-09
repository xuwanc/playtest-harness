"""v9s.42 截图：手感面板的相位区（走 / 攻击）。只截面板本身，不做整屏。"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C

OUT = ROOT / 'shots' / 'v9s42'
OUT.mkdir(parents=True, exist_ok=True)


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1280, height=800)
        page.goto(srv.url, wait_until='load', timeout=60000)
        page.wait_for_function('() => !!(window.__harness && window.__harness.motionDebug)', timeout=60000)
        page.wait_for_timeout(600)
        page.evaluate("""() => {
          const h = window.__harness, w = h.world;
          h.clipLab.release();
          // 清场：只留玩家，避免陪练的位移混进速度曲线
          for (const d of w.dummies) {
            d.mode = 'idle'; d.position.x = 60; d.position.z = 60;
            d.homeX = 60; d.homeZ = 60;
          }
          // 面板显隐归 #panel-row 的折叠状态管（.panel.is-open），不是 is-off；
          // 走胶囊的 pointerdown 才是唯一正规入口，直接改 class 会被下一帧 sync 覆盖。
          document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = ''; });
          const pill = document.getElementById('motiondbg-toggle');
          pill.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        }""")

        # 1) 直线跑：sin 曲线 + 左右踩地分色
        page.keyboard.down('w')
        page.wait_for_timeout(2600)
        page.query_selector('#motiondbg').screenshot(path=str(OUT / '01-phase-run.png'))
        read_run = page.evaluate("() => window.__harness.motionDebug.last()")
        page.keyboard.up('w')

        # 2) 连击：相位由 attackGaitDrive 推进（Core gaitPhase 跟不上）
        page.wait_for_timeout(500)
        page.keyboard.down('j')
        page.wait_for_timeout(150)
        for _ in range(24):
            page.keyboard.up('j')
            page.wait_for_timeout(90)
            page.keyboard.down('j')
            page.wait_for_timeout(90)
        page.query_selector('#motiondbg').screenshot(path=str(OUT / '02-phase-attack.png'))
        read_atk = page.evaluate("() => window.__harness.motionDebug.last()")
        page.keyboard.up('j')

        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT / '03-overview.png'))
        print('run', read_run)
        print('attack', read_atk)
        print('errors', errors[:3])
        C.shutdown(pw, browser)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
