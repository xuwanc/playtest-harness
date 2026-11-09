#!/usr/bin/env python3
"""v9s.56 命中飙血 + 陪练死亡 / 重生的逐帧验收。

三件事必须分开拍，因为它们的时间尺度差一个数量级：
  - 血珠在空中只有 ~0.2s（0.52s 寿命，但很快就落地）；
  - 倒地 0.42s，躺尸 ~2.7s；
  - 沉入地面 0.38s、升起 0.42s。

做法与 combo-shot 一致：`paused` 停 Core、`holdRender(true)` 关主循环渲染，
之后每帧由脚本自己 `stepOnce` + `view.render`，截图只停在想停的那几帧。

    npm run build && python3 tools/blood-shot.py
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'blood'


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1000, height=1000)
        C.open_game(page, srv.url)
        page.evaluate("""() => {
          const h = window.__harness;
          h.clipLab.release();
          // 指定紫衣大剑陪练：红衣陪练和血同色，血滴贴上去基本看不见
          const f = h.world.dummies.find((d) => d.weapon === 'greatsword') ?? h.world.dummies.find((d) => d.weapon);
          if (!f) throw new Error('no fighter');
          // 挪到空地：草块被割断的棕色碎片会混进血珠里，读不出哪是血
          f.position.x = 0; f.position.z = -2.5; f.position.y = 0;
          f.homeX = 0; f.homeZ = -2.5;
          f.mode = 'idle';   // 站桩挨打，构图稳定
          // 场景里有多个带武器的假人，后面的 step / state 必须认准同一个 ——
          // 否则会把玩家「贴」到被挪到 (60,60) 的另一个陪练身上，相机直接飞出场地
          window.__targetId = f.id;
          const c = h.world.character;
          c.position.x = f.position.x;
          c.position.z = f.position.z - 1.05;
          c.position.y = f.position.y;
          c.velocity.x = 0; c.velocity.z = 0;
          c.facing = 0; c.bodyYaw = 0;
          h.world.combat.weapon = 'sword-shield';
          // 只留目标陪练：另外两个会凑过来一起站在镜头里，血滴全被身体挡住
          h.world.dummies.forEach((d, i) => {
            if (d === f) return;
            d.position.x = 60 + i * 4; d.position.z = 60;
            d.homeX = d.position.x; d.homeZ = d.position.z;
            d.mode = 'idle';
          });
          // 侧后方 3/4 视角：既能看见剑，也能看见血溅出去的方向
          h.viewConfig.camera.pitchDeg = 19;
          h.viewConfig.camera.yawDeg = -42;
          h.viewConfig.camera.distance = 5.4;
          h.clipLab.zoom(1);
          h.view.snapCamera(c.position.x, c.position.y, c.position.z);
          h.debug.paused = true;
          h.holdRender(true);
        }""")
        page.wait_for_timeout(700)

        def shot(name: str) -> None:
            page.screenshot(path=str(OUT / f'{name}.png'))

        def step(n: int, patch: dict | None = None) -> None:
            # 每帧把玩家贴到目标正前方：陪练会走位 / 玩家攻击有前冲，不贴住就会打空，
            # 截图里只能看到两个人各走各的。
            page.evaluate("""([n, patch]) => {
              const h = window.__harness;
              const f = h.world.dummies.find((d) => d.id === window.__targetId);
              for (let i = 0; i < n; i++) {
                const c = h.world.character;
                if (f && !f.health.dead) {
                  c.position.x = f.position.x;
                  c.position.z = f.position.z - 1.05;
                  c.position.y = f.position.y;
                  c.facing = 0;
                  c.bodyYaw = 0;
                }
                h.stepOnce(i === 0 && patch ? patch : {});
                h.view.render(h.world, 1 / 60);
              }
            }""", [n, patch or {}])

        def state() -> dict:
            return page.evaluate("""() => {
              const h = window.__harness;
              const f = h.world.dummies.find((x) => x.id === window.__targetId);
              const d = h.deathDebug(f.id);
              return {
                hp: +f.health.hp.toFixed(1),
                dead: f.health.dead,
                respawn: +f.health.respawn.toFixed(2),
                revive: +f.health.revive.toFixed(2),
                kills: f.health.kills,
                blood: h.bloodDebug(),
                death: d ? {
                  fall: +d.fall.toFixed(2), sink: +d.sink.toFixed(2),
                  rise: +d.rise.toFixed(2), y: +d.y.toFixed(2),
                } : null,
              };
            }""")

        # ---- 1) 第一刀命中：血在空中 ----
        # 起手 0.11s + active 前段，大约 10 帧内落地；逐帧推进直到 hp 掉
        start = state()
        print('start', start)
        hp0 = start['hp']
        step(1, {'attackPressed': True})
        hit_frame = -1
        for i in range(40):
            step(1)
            st = state()
            if st['hp'] < hp0:
                hit_frame = i
                break
        print('hit at frame', hit_frame, state())
        shot('01-hit-0')
        step(3)
        shot('02-hit-3f')
        step(5)
        print('after 8f', state())
        shot('03-hit-8f')
        step(10)
        shot('04-hit-18f')
        print('after 18f', state())

        # ---- 2) 继续打到死（大剑 knock 36/刀 → 4 刀）----
        last_hp = state()['hp']
        for i in range(900):
            patch = {'attackPressed': True} if i % 30 == 0 else {}
            step(1, patch)
            st = state()
            if st['hp'] != last_hp:
                last_hp = st['hp']
                if st['dead']:
                    break

        dead0 = state()
        print('dead at', dead0)
        shot('05-death-0')
        step(12)
        print('death +12f', state())
        shot('06-fall-12f')
        step(16)
        print('death +28f', state())
        shot('07-fallen')

        # ---- 3) 沉入地面：respawn 剩不到 0.25s 时 ----
        for i in range(400):
            st = state()
            if st['respawn'] <= 0.24:
                break
            step(4)
        print('sinking', state())
        shot('08-sinking')

        # ---- 4) 重生：等 dead 变 false，再推几帧看「从地里升起来」----
        for i in range(120):
            if not state()['dead']:
                break
            step(2)
        step(6)
        rev = state()
        print('revived', rev)
        shot('09-rising')
        step(14)
        print('revived +20f', state())
        shot('10-standing')

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
