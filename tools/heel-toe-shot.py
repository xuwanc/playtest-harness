#!/usr/bin/env python3
"""v9s.76 heel-toe roll 验收：脚跟着地 / 全掌 / 蹬离 三个相位的脚部特写。

用法：
    npm run build && python3 tools/heel-toe-shot.py

产物落在 shots/heel-toe/：
    01-heel-strike.png   支撑进度 s≈0.04（脚跟着地，脚尖上翘）
    02-flat.png          s≈0.35（全掌贴地，折角 0）
    03-push-off.png      s≈0.92（蹬离，脚尖下压 / 脚跟抬起）
    04-full-body.png     全身对照（确认折角没有把脚踝读成「断了一截」）

同时打印 `gaitDebug().ballL / ballR`，截图与数字必须对得上 ——
只看图容易把「腿在摆」误读成「脚掌在折」。
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'heel-toe'
OUT.mkdir(parents=True, exist_ok=True)


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(False, 900, 900)
        C.open_game(page, srv.url)
        page.evaluate("""() => {
          const h = window.__harness;
          h.clipLab.release();
          const c = h.world.character;
          c.position.x = -14.0; c.position.z = 9.5; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          (h.world.dummies || []).forEach((d, i) => {
            d.position.x = 60 + i * 3; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
          });
          // 冻结步进：`paused` 只停 Core 的 `step`，`render` 照常每帧调 rig.update ——
          // 于是「相位 + 速度」由我们钉死，画面稳定可截图。用按键走再抓相位是不行的：
          // Core 每帧推进相位，rAF 与 render 的先后顺序又不保证（实测钉 0.045π 拿到 0.43π）。
          h.debug.paused = true;
          window.__pin = (P) => {
            const c2 = h.world.character;
            c2.gaitPhase = P;
            c2.velocity.x = 0;
            c2.velocity.z = 3;
          };
        }""")
        page.wait_for_timeout(900)

        def cam(pitch: float, yaw: float, dist: float, wait: int = 450, dy: float = 0.45) -> None:
            page.evaluate("""(o) => {
              const h = window.__harness;
              const c = h.world.character;
              h.viewConfig.camera.pitchDeg = o.pitch;
              h.viewConfig.camera.yawDeg = o.yaw;
              h.viewConfig.camera.distance = o.dist;
              h.clipLab.zoom(1);
              c.facing = o.face; c.bodyYaw = o.face; c.headYaw = o.face;
              h.view.snapCamera(c.position.x, c.position.y + o.dy, c.position.z);
            }""", {"pitch": pitch, "yaw": yaw, "dist": dist, "face": 1.5708, "dy": dy})
            page.wait_for_timeout(wait)

        def gait() -> dict:
            return page.evaluate("() => window.__harness.gaitDebug()")

        def show(tag: str) -> None:
            g = gait()
            pos = page.evaluate("() => window.__harness.world.character.position.z")
            print(f"{tag:16s} ballL={g['ballL']:+.3f} rad ({g['ballL'] * 57.2958:+.1f}°)"
                  f"  ballR={g['ballR']:+.3f} rad ({g['ballR'] * 57.2958:+.1f}°)"
                  f"  speed={g['speed']:.2f}"
                  f"  脚最低点 L={g['footMinYL']:+.4f} R={g['footMinYR']:+.4f}"
                  f"  phase={g['phase']:+.2f} z={pos:.2f}")

        # 侧面近景，镜头略低于腰：脚掌折角在侧视里最清楚
        # 拍脚之前先把武器 / 盾藏掉：0.9m 的机位会直接怼进盾牌里（第一版拍到一片灰）
        page.evaluate("""() => {
          window.__harness.view.heroGroup().traverse((o) => {
            if (/shield|sword|blade|great/i.test(o.name || '')) o.visible = false;
          });
        }""")
        # 贴到脚边：目标点抬到脚面高度，侧面 90° 看折角
        cam(6, 90, 1.15, wait=400, dy=0.16)

        for name, s in (('01-heel-strike', 0.045), ('02-flat', 0.36), ('03-push-off', 0.92)):
            # s = p / π → p = s·π；左右腿相位差 π，另一条腿自动落在对侧
            page.evaluate("(p) => window.__pin(p)", s * 3.141592653589793)
            page.wait_for_timeout(420)
            page.screenshot(path=str(OUT / f'{name}.png'))
            show(name + f' (s={s})')

        page.evaluate("() => window.__pin(0.36 * Math.PI)")
        cam(8, 0, 3.6, wait=420, dy=0.9)
        page.screenshot(path=str(OUT / '04-full-body.png'))
        show('full-body')

        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
