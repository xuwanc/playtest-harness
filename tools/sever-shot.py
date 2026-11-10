#!/usr/bin/env python3
"""v9s.60 验收：断肢（按最后一击判定）+ 死亡倒杆物理。

拍法同 blood-shot / death-polish-shot：`paused` 停 Core、`holdRender(true)` 关主循环，
每帧由脚本自己 `stepOnce` + `view.render`，只停在想看的那几帧。

最后一击用 `__harness.hitTest(id, type, hitU)` 直接给 —— 断肢按「受击类型 × 部位」判定，
靠真人挥砍打到指定高度是碰运气，脚本必须能精确控制这一刀。

    npm run build && python3 tools/sever-shot.py
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'sever'


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1000, height=1000)
        C.open_game(page, srv.url)

        page.evaluate("""() => {
          const h = window.__harness;
          h.clipLab.release();
          const f = h.world.dummies.find((d) => d.weapon === 'greatsword')
                 ?? h.world.dummies.find((d) => d.weapon);
          if (!f) throw new Error('no fighter');
          window.__targetId = f.id;
          // 只留一个陪练在空地，其余全部挪到场外（普通假人是打不死的测试桩）
          h.world.dummies.forEach((d, i) => {
            if (d === f) {
              d.position.x = 0; d.position.z = -3.4; d.position.y = 0;
              d.homeX = 0; d.homeZ = -3.4;
            } else {
              d.position.x = 60 + i * 4; d.position.z = 60; d.position.y = 0;
              d.homeX = d.position.x; d.homeZ = d.position.z;
            }
            d.mode = 'idle';
          });
          // 玩家站到陪练正后方 2.4m（相机跟玩家、朝前看，陪练正好在画面中央）；
          // 玩家只有 1.2m 高，俯角 26° 时不会挡住后面的人
          const c = h.world.character;
          c.position.x = 1.4; c.position.z = -1.3; c.position.y = 0;
          c.velocity.x = 0; c.velocity.z = 0;
          c.facing = 0; c.bodyYaw = 0;
          h.world.combat.weapon = 'greatsword';
          // 草丛会挡住躺下的尸体：验收断肢不需要它
          const g = h.world.grass;
          if (g && g.patches) { g.patches.length = 0; g.count = 0; }
          // 稍偏一点俯视：能同时看到「人怎么倒」和「残肢往哪飞」
          h.viewConfig.camera.pitchDeg = 34;
          h.viewConfig.camera.yawDeg = 16;
          h.viewConfig.camera.distance = 6.6;
          h.clipLab.zoom(1);
          h.view.snapCamera(c.position.x, c.position.y, c.position.z);
          h.debug.paused = true;
          h.holdRender(true);
        }""")
        page.wait_for_timeout(600)

        def shot(name: str) -> None:
            page.screenshot(path=str(OUT / f'{name}.png'))

        def step(n: int = 1) -> None:
            # 每帧把陪练钉在 (0,-2.5)：AI 会自己走位，不钉住构图每张都不一样
            page.evaluate("""(n) => {
              const h = window.__harness;
              const f = h.world.dummies.find((x) => x.id === window.__targetId);
              for (let i = 0; i < n; i++) {
                if (f && !f.health.dead) {
                  f.position.x = 0; f.position.z = -3.4; f.position.y = 0;
                  f.velocity.x = 0; f.velocity.z = 0;
                  f.bodyYaw = 0; f.headYaw = 0; f.facing = 0;
                }
                h.stepOnce({});
                h.view.render(h.world, 1 / 60);
              }
            }""", n)

        def state() -> dict:
            return page.evaluate("""() => {
              const h = window.__harness;
              const f = h.world.dummies.find((x) => x.id === window.__targetId);
              const d = h.deathDebug(f.id);
              return {
                hp: +f.health.hp.toFixed(0),
                dead: f.health.dead,
                sever: f.health.sever,
                angleDeg: +(d.angle * 180 / Math.PI).toFixed(1),
                angVel: +d.angVel.toFixed(2),
                settled: d.settled,
                slide: +d.slide.toFixed(2),
                pieces: d.pieces,
                pieceY: d.pieceY === null ? null : +d.pieceY.toFixed(2),
                pos: [+f.position.x.toFixed(2), +f.position.z.toFixed(2)],
              };
            }""")

        def revive_fighter() -> None:
            """把目标复活成满血站立，准备下一种死法。"""
            page.evaluate("""() => {
              const h = window.__harness;
              const f = h.world.dummies.find((x) => x.id === window.__targetId);
              f.health.hp = f.health.maxHp;
              f.health.dead = false;
              f.health.deadT = 0;
              f.health.respawn = 0;
              f.health.revive = 0;
              f.health.sever = null;
              f.position.x = 0; f.position.z = -3.4; f.position.y = 0;
              f.mode = 'idle';
              // 一刀就死：连着砍 5 刀会叠 5 团血雾，把人和残肢全糊住
              f.health.hp = 1;
              h.world.hitMarks.length = 0;
            }""")

        def kill(kind: str, hit_u: float, frames: int = 1) -> None:
            """用指定受击类型 + 部位打死目标（每刀 26 伤 → 120 血 5 刀）。"""
            page.evaluate("""([kind, hitU]) => {
              const h = window.__harness;
              const f = h.world.dummies.find((x) => x.id === window.__targetId);
              for (let i = 0; i < 20 && !f.health.dead; i++) {
                h.hitTest(f.id, kind, hitU, 0, 1);
              }
            }""", [kind, hit_u])
            step(frames)

        # ---- 1) 断臂（重击打胸肩 u 0.62）+ 残肢飞出 ----
        revive_fighter()
        kill('heavy', 0.62)
        print('01 armR', state())
        step(3)
        shot('01-sever-arm-drop')
        step(70)
        print('02 armR settle', state())
        shot('02-sever-arm-settled')

        # ---- 2) 倒地中：物理还没到位的那几帧（角度 / 角速度都在变）----
        revive_fighter()
        step(2)
        kill('knock', 0.80, frames=8)
        print('03 falling', state())
        shot('03-falling')
        step(50)
        print('04 settled', state())
        shot('04-fallen-settled')

        # ---- 3) 断头（重击高位 u 0.84）----
        revive_fighter()
        step(30)
        kill('heavy', 0.84, frames=60)
        print('05 head', state())
        shot('05-sever-head')

        # ---- 4) 腰斩（击飞打腰 u 0.46）----
        revive_fighter()
        step(40)
        kill('knock', 0.46, frames=60)
        print('06 waist', state())
        shot('06-sever-waist')

        # ---- 5) 断腿（击地 hitU 0.26）----
        revive_fighter()
        step(40)
        kill('knock', 0.26, frames=60)
        print('07 leg', state())
        shot('07-sever-leg')

        if errors:
            print('PAGE ERRORS', errors[:3])
        browser.close()
    print(f'\nshots -> {OUT}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
