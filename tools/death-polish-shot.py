#!/usr/bin/env python3
"""v9s.57 三项验收：血跟骨骼 / 尸体挡路 / 头顶血条。

三项的时间尺度不同，分开拍：
  - 血：命中后 0–0.25s（看喷出的高度，不在同一帧对比就只能靠数字）；
  - 尸体：杀死后 0.6s（躺平）再让玩家往里撞；
  - 血条：静止站姿，离陪练 4–5m，能同时看见三条。

做法与 blood-shot 一致：`paused` 停 Core、`holdRender(true)` 关主循环渲染，
之后每帧由脚本自己 `stepOnce` + `view.render`，截图只停在想停的那几帧。

    npm run build && python3 tools/death-polish-shot.py
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'death-polish'


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1000, height=1000)
        C.open_game(page, srv.url)

        # ---- 布景：留一个紫衣大剑陪练站在空地，其余挪走 ----
        page.evaluate("""() => {
          const h = window.__harness;
          h.clipLab.release();
          const f = h.world.dummies.find((d) => d.weapon === 'greatsword')
                 ?? h.world.dummies.find((d) => d.weapon);
          if (!f) throw new Error('no fighter');
          f.position.x = 0; f.position.z = -2.5; f.position.y = 0;
          f.homeX = 0; f.homeZ = -2.5;
          f.mode = 'idle';
          window.__targetId = f.id;
          const c = h.world.character;
          c.position.x = f.position.x;
          c.position.z = f.position.z - 1.05;
          c.position.y = f.position.y;
          c.velocity.x = 0; c.velocity.z = 0;
          c.facing = 0; c.bodyYaw = 0;
          h.world.combat.weapon = 'sword-shield';
          // 普通假人是打不死的测试桩（maxHp 0），挪走免得挡住镜头；
          // 另外两个陪练留在场上，血条要能一次看到三条。
          const others = h.world.dummies.filter((d) => d !== f && d.weapon);
          const spots = [[-1.8, -2.2], [1.9, -2.0]];
          others.forEach((d, i) => {
            const p = spots[i % spots.length];
            d.position.x = p[0]; d.position.z = p[1]; d.position.y = 0;
            d.homeX = p[0]; d.homeZ = p[1];
            d.mode = 'idle';
          });
          h.world.dummies.forEach((d, i) => {
            if (d === f || d.weapon) return;
            d.position.x = 60 + i * 4; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
            d.mode = 'idle';
          });
          h.viewConfig.camera.pitchDeg = 16;
          h.viewConfig.camera.yawDeg = -38;
          h.viewConfig.camera.distance = 4.6;
          h.clipLab.zoom(1);
          h.view.snapCamera(c.position.x, c.position.y, c.position.z);
          h.debug.paused = true;
          h.holdRender(true);
        }""")
        page.wait_for_timeout(600)

        def shot(name: str) -> None:
            page.screenshot(path=str(OUT / f'{name}.png'))

        def step(n: int, patch: dict | None = None, stick: bool = True,
                 held: dict | None = None) -> None:
            # patch 只在第一帧（起手 / 点击类），held 每帧都给（按住方向键）
            page.evaluate("""([n, patch, stick, held]) => {
              const h = window.__harness;
              const f = h.world.dummies.find((d) => d.id === window.__targetId);
              for (let i = 0; i < n; i++) {
                const c = h.world.character;
                if (stick && f && !f.health.dead) {
                  c.position.x = f.position.x;
                  c.position.z = f.position.z - 1.05;
                  c.position.y = f.position.y;
                  c.facing = 0; c.bodyYaw = 0;
                }
                h.stepOnce(Object.assign({}, held || {}, i === 0 && patch ? patch : {}));
                h.view.render(h.world, 1 / 60);
              }
            }""", [n, patch or {}, stick, held or {}])

        def state() -> dict:
            return page.evaluate("""() => {
              const h = window.__harness;
              const f = h.world.dummies.find((x) => x.id === window.__targetId);
              const marks = h.world.hitMarks.slice(-4).map((m) => ({
                u: +m.u.toFixed(3), y: +m.y.toFixed(3), power: +m.power.toFixed(2),
              }));
              return {
                weapon: h.world.combat.weapon,
                hp: +f.health.hp.toFixed(1),
                dead: f.health.dead,
                marks,
                bars: h.healthBarDebug(),
                player: [ +h.world.character.position.x.toFixed(2),
                          +h.world.character.position.z.toFixed(2) ],
                corpse: [ +f.position.x.toFixed(2), +f.position.z.toFixed(2) ],
              };
            }""")

        # ---- 1) 血条：受伤前后各一张（站远一点，三条都在画面里）----
        page.evaluate("() => { const h = window.__harness; h.viewConfig.camera.distance = 6.4; h.view.snapCamera(0, 0, -2.0); }")
        step(2)
        print('bars idle', state()['bars'])
        shot('01-bars-full')

        # ---- 2) 剑盾轻击：血在胸口（u≈0.60）----
        page.evaluate("() => { const h = window.__harness; h.viewConfig.camera.distance = 4.6; const c = h.world.character; h.view.snapCamera(c.position.x, c.position.y, c.position.z); }")
        hp0 = state()['hp']
        step(1, {'attackPressed': True})
        for _ in range(40):
            step(1)
            if state()['hp'] < hp0:
                break
        st = state()
        print('sword-shield hit', st)
        shot('02-blood-light')
        step(2)
        shot('03-blood-light-2f')

        # ---- 3) 大剑击飞：血在腰腹（u≈0.35）----
        page.evaluate("""() => {
          const h = window.__harness;
          const f = h.world.dummies.find((d) => d.id === window.__targetId);
          f.health.hp = f.health.maxHp;
          h.world.hitMarks.length = 0;
          h.world.combat.weapon = 'greatsword';
          h.world.combat.phase = 'idle';
          h.world.combat.comboIndex = 0;
        }""")
        hp0 = state()['hp']
        step(1, {'attackPressed': True})
        for _ in range(50):
            step(1)
            if state()['hp'] < hp0:
                break
        st = state()
        print('greatsword hit', st)
        shot('04-blood-knock')
        step(2)
        shot('05-blood-knock-2f')

        # ---- 4) 尸体挡路：打死 → 躺平 → 玩家朝尸体走 ----
        for _ in range(900):
            patch = {'attackPressed': True} if _ % 30 == 0 else {}
            step(1, patch)
            if state()['dead']:
                break
        step(40)   # 躺平
        print('dead', state())
        shot('06-corpse')

        before = page.evaluate("""() => {
          const h = window.__harness;
          const f = h.world.dummies.find((d) => d.id === window.__targetId);
          // 玩家放到尸体脚前，朝尸体方向持续推
          const c = h.world.character;
          c.position.x = f.position.x;
          c.position.z = f.position.z + 2.4;
          c.facing = Math.PI;   // 面向 -z（朝尸体）
          c.bodyYaw = Math.PI;
          return { px: c.position.x, pz: c.position.z,
                   cx: f.position.x, cz: f.position.z };
        }""")
        # 按住前进键 110 帧（1.8s，足够从 2.4m 外走到尸体前）：没有尸体碰撞时会直接穿过
        step(110, stick=False, held={'moveZ': -1.0})
        after = state()
        print('push into corpse', before, '->', after['player'])
        shot('07-corpse-block')

        page.evaluate("() => { const h = window.__harness; h.holdRender(false); h.debug.paused = false; }")
        if errors:
            print('PAGE ERRORS:')
            for e in errors[:5]:
                print('  ', e)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
