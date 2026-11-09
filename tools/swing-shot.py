#!/usr/bin/env python3
"""挥击 / 待机特写：把假人挪走、相机压到 3~4m，按「武器 · 段 · 剪辑时间轴」定格截图。

clip-lab 的 shot 用固定 18° 俯角 + 全场视角，主角常被陪练挡住；验收「动作舒展度」
需要的是**主角特写**。这个脚本复用同一套 preview 接口，只换相机与布景。

用法：
    npm run build
    python3 tools/swing-shot.py sword-shield 1 0 0.35 0.7 1.0
    python3 tools/swing-shot.py greatsword 3 0 0.5 1.0 --tag overhead

产物落在 shots/swing/<武器>_seg<段>_t<t>.png，并打印每帧的 swingDebug 读数。
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'swing'


def main(argv: list[str]) -> int:
    if len(argv) < 4:
        print(__doc__)
        return 2
    weapon = argv[1]
    seg = int(argv[2])
    tag = ''
    if '--tag' in argv:
        i = argv.index('--tag')
        tag = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    ts = [float(x) for x in argv[3:] if not x.startswith('--')]
    OUT.mkdir(parents=True, exist_ok=True)

    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1000, height=1000)
        C.open_game(page, srv.url)
        page.evaluate("""() => {
          const h = window.__harness;
          h.clipLab.release();
          const c = h.world.character;
          c.position.x = -14.0; c.position.z = 9.5; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0; c.bodyYaw = 0; c.facing = 0;
          (h.world.dummies || []).forEach((d, i) => {
            d.position.x = 60 + i * 3; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
          });
          // 特写：3.6m、12° 俯角，正面偏右 30° 看，横扫的弧线才不会被透视压扁
          h.viewConfig.camera.pitchDeg = 12;
          h.viewConfig.camera.yawDeg = -28;
          h.viewConfig.camera.distance = 3.6;
          h.clipLab.zoom(1);
          h.view.snapCamera(c.position.x, c.position.y, c.position.z);
        }""")
        page.wait_for_timeout(700)

        for t in ts:
            d = page.evaluate("""(o) => {
              const h = window.__harness;
              const c = h.world.character;
              c.bodyYaw = 0; c.facing = 0; c.headYaw = 0;
              h.view.snapCamera(c.position.x, c.position.y, c.position.z);
              return h.clipLab.preview({
                weapon: o.w, comboIndex: o.seg, progress: o.t, t: o.t, warm: 26,
              });
            }""", {"w": weapon, "seg": seg, "t": t})
            name = f'{tag + "_" if tag else ""}{weapon}_seg{seg}_t{str(t).replace(".", "p")}.png'
            page.screenshot(path=str(OUT / name))
            print(f'{name:44s} strike={d["strike"]:.2f} yaw={d["yaw"]:+.2f} '
                  f'root={d["rootYaw"]:+.2f} pitch={d["pitch"]:+.2f}')

        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
