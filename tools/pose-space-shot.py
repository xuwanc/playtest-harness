#!/usr/bin/env python3
"""v9s.66 姿态补偿坐标系验收：鱼人待机 / 侧移（胸随下盘带转）/ 挥砍三态。

用法：
    npm run build && python3 tools/pose-space-shot.py

产物落在 shots/pose-space/：
    01-idle.png       待机：手臂是否落在身前（模型空间回正）
    02-strafe.png     侧移 1.2s：胸段有没有真的跟着下盘转（对照 hipYaw / chestYaw 读数）
    03-swing.png      挥砍中：前倾 55° + 旋身时手有没有斜着支棱

同时打印 chest / upper 的偏航分账，直接和截图对照。

注意：hipYaw 来自「速度方向与身体朝向的夹角」，无头浏览器里拖拽瞄准不一定生效，
读数为 0 时 `02-strafe` 只作**造型**对照（手臂 / 脚的形状），不能用来验分账 ——
分账的硬验收在 `tests/v9s66-pose-space.test.ts`。
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'pose-space'
OUT.mkdir(parents=True, exist_ok=True)


def main() -> int:
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=900, height=900)
        page.goto(f'{srv.url}?hero=murloc', wait_until='load', timeout=60000)
        page.wait_for_function(
            "() => !!(window.__harness && window.__harness.clipLab)", timeout=30000,
        )
        page.wait_for_timeout(600)
        page.evaluate("""() => {
          const h = window.__harness;
          document.querySelectorAll('[data-ui-region]').forEach((e) => { e.style.display = 'none'; });
          const vb = document.getElementById('version-badge');
          if (vb) vb.style.display = 'none';
          h.clipLab.release();
          const c = h.world.character;
          c.position.x = -14.0; c.position.z = 9.5; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          (h.world.dummies || []).forEach((d, i) => {
            d.position.x = 60 + i * 3; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
          });
        }""")
        page.wait_for_timeout(1200)

        def cam(pitch: float, yaw: float, dist: float = 2.6) -> None:
            page.evaluate("""(o) => {
              const h = window.__harness;
              const c = h.world.character;
              h.viewConfig.camera.pitchDeg = o.pitch;
              h.viewConfig.camera.yawDeg = o.yaw;
              h.viewConfig.camera.distance = o.dist;
              h.clipLab.zoom(1);
              h.view.snapCamera(c.position.x, c.position.y, c.position.z);
            }""", {"pitch": pitch, "yaw": yaw, "dist": dist})
            page.wait_for_timeout(450)

        def report(tag: str) -> None:
            d = page.evaluate("""() => {
              const g = window.__harness.gaitDebug();
              const cc = window.__harness.world.character;
              const root = window.__harness.view.heroGroup();
              const up = root.getObjectByName('upper');
              const ch = root.getObjectByName('chest');
              return { vx: cc.velocity.x, vz: cc.velocity.z, spd: g.speed,
                       hipYaw: g.hipYaw, chestYaw: g.chestYaw,
                       upperY: up.rotation.y, chestY: ch.rotation.y,
                       upperX: up.rotation.x, chestX: ch.rotation.x };
            }""")
            print(f"{tag:10s} v=({d['vx']:+.2f},{d['vz']:+.2f}) spd={d['spd']:+.2f}"
                  f"  hipYaw={d['hipYaw']:+.3f} chestYaw={d['chestYaw']:+.3f}"
                  f"  upperY={d['upperY']:+.3f} chestY={d['chestY']:+.3f}"
                  f"  upperX={d['upperX']:+.3f} chestX={d['chestX']:+.3f}")

        cam(30, 18)
        page.screenshot(path=str(OUT / '01-idle.png'))
        report('idle')

        # 侧移 + 拖拽瞄准（aimActive 时身体不跟着走，hipYaw 才会拉起来）
        page.mouse.move(450, 450)
        page.mouse.down()
        page.mouse.move(760, 300, steps=12)
        page.keyboard.down('d')
        page.wait_for_timeout(1400)
        page.screenshot(path=str(OUT / '02-strafe.png'))
        report('strafe')
        page.keyboard.up('d')
        page.mouse.up()
        page.wait_for_timeout(900)

        # 挥砍中：躯干前倾 55° + 旋身，检查手臂是否斜着支棱
        page.mouse.click(450, 450)
        page.wait_for_timeout(220)
        page.screenshot(path=str(OUT / '03-swing.png'))
        report('swing')
        page.wait_for_timeout(900)

        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
