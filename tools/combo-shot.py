#!/usr/bin/env python3
"""v9s.55 真实链路逐帧验收：待机 → 起手 → 蓄势 → 挥出 → 收招 → 回到待机。

不钉剪辑时间轴（swing-shot 才这么干），这里**暂停主循环后逐帧推进**：
软件渲染一张截图要 ~3s，实时抓帧必然错过动作；暂停 + `stepOnce` 才能精确停在某一帧。

    npm run build && python3 tools/combo-shot.py sword-shield
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'combo'
# 相对「按下攻击键」推进的帧数（60Hz）。剑盾一段 0.11 + 0.12 + 0.27 s
FRAMES = [
    (0, '01-entry'),
    (3, '02-windup'),
    (6, '03-windup-end'),
    (10, '04-swing'),
    (14, '05-hit'),
    (22, '06-recovery'),
    (36, '07-recovered'),
    (52, '08-idle'),
]


def main(weapon: str) -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1000, height=1000)
        C.open_game(page, srv.url)
        page.evaluate("""(w) => {
          const h = window.__harness;
          h.clipLab.release();
          const c = h.world.character;
          c.position.x = 0; c.position.z = -7.5; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0; c.bodyYaw = 0; c.facing = 0;
          h.world.combat.weapon = w;
          (h.world.dummies || []).forEach((d, i) => {
            d.position.x = 60 + i * 3; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
          });
          h.viewConfig.camera.pitchDeg = 26;
          h.viewConfig.camera.yawDeg = -20;
          h.viewConfig.camera.distance = 4.2;
          h.clipLab.zoom(1);
          h.view.snapCamera(c.position.x, c.position.y, c.position.z);
        }""", weapon)
        page.wait_for_timeout(900)

        page.screenshot(path=str(OUT / f'{weapon}_00-idle.png'))
        print('00-idle')

        # 暂停主循环 + 关掉自动渲染。
        # 关键：paused 只停 Core，主循环仍然每帧 `view.render` —— 而 render 会推进
        # 表现层的平滑量（combatPoseW 等）。截图在软件渲染下要 3s，期间被 update
        # 上百次，起手 / 收招的中间态早就收敛掉了。`clipLab.preview` 会把 clipHold
        # 置 true（主循环不再渲染），之后每帧由脚本自己 step + render 一次。
        page.evaluate("""(w) => {
          const h = window.__harness;
          h.debug.paused = true;
          h.clipLab.preview({ weapon: w, comboIndex: 1, progress: 0, warm: 1, t: 0 });
          // preview 会把战斗态临时置成 active（借它的「锁定 + 逐帧渲染」），恢复后
          // combatPoseW 还停在 1 附近 —— 必须再走 30 帧让它衰减干净，否则按下攻击前
          // 的第一帧是「蓄势姿态的残影」，会被误读成起手有跳变。
          for (let i = 0; i < 30; i++) { h.stepOnce(); h.view.render(h.world, 1 / 60); }
          h.stepOnce({ attackPressed: true });
        }""", weapon)
        page.wait_for_timeout(150)

        prev = 0
        for frame, name in FRAMES:
            page.evaluate("""(n) => {
              const h = window.__harness;
              for (let i = 0; i < n; i++) { h.stepOnce(); h.view.render(h.world, 1 / 60); }
              if (n === 0) h.view.render(h.world, 1 / 60);
            }""", frame - prev)
            prev = frame
            page.wait_for_timeout(120)
            page.screenshot(path=str(OUT / f'{weapon}_{name}.png'))
            info = page.evaluate("""() => {
              const h = window.__harness;
              const c = h.world.combat;
              return {
                phase: c.phase, seg: c.comboIndex,
                strike: +h.swingDebug().strike.toFixed(2),
                arm: +(h.view.heroGroup().getObjectByName('shoulderR')?.rotation.x ?? 0).toFixed(2),
                torso: +h.spineDebug().totalYaw.toFixed(2),
              };
            }""")
            print(f'{name:18s} {info}')

        page.evaluate("() => { window.__harness.debug.paused = false; }")
        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'sword-shield'))
