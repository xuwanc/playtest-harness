"""v9s.50 截图：蜘蛛主角的手感验收。

做三件事：
  1) `?hero=spider` 直接以蜘蛛开局，截静止 / 走 / 跑 / 转向 / 跳跃；
  2) 每一步读 `__harness.spiderDebug()`，把「腿够不够得到」量化出来；
  3) 顺带读 Core 的位移，确认换骨架没有影响移动逻辑（位置仍在推进、没卡住）。

用法：python3 tools/spider-hero-shot.py
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C

OUT = ROOT / 'shots' / 'spider-hero'
OUT.mkdir(parents=True, exist_ok=True)


def spawn_far(page):
    """把假人挪远：截图里只留主角，避免陪练挡住 8 条腿。"""
    page.evaluate("""() => {
      const w = window.__harness.world;
      for (const d of w.dummies) {
        d.mode = 'idle';
        d.position.x = 60; d.position.z = 60;
        d.homeX = 60; d.homeZ = 60;
      }
      // 把主角挪到 meter 地块（z 5..15）：hub 前侧有一片装饰草，会挡住 8 条腿
      w.character.position.x = 0; w.character.position.y = 0; w.character.position.z = 10;
      w.character.velocity.x = 0; w.character.velocity.y = 0; w.character.velocity.z = 0;
    }""")


def main() -> int:
    rows = []
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=1280, height=800)
        page.goto(f'{srv.url}?hero=spider', wait_until='load', timeout=60000)
        page.wait_for_function(
            '() => !!(window.__harness && window.__harness.spiderDebug)',
            timeout=60000,
        )
        page.wait_for_timeout(700)
        spawn_far(page)
        # 关草：hub 前侧有一片草（sparring-demo 的主草场已迁走，hub 保留装饰草），
        # 会挡住 8 条腿。G 键是正规开关，比直接改 config 安全。

        def snap(name, wait=0):
            if wait:
                page.wait_for_timeout(wait)
            page.screenshot(path=str(OUT / name))
            d = page.evaluate("""() => {
              const h = window.__harness;
              const c = h.world.character;
              return {
                sp: h.spiderDebug(),
                x: +c.position.x.toFixed(2), y: +c.position.y.toFixed(2), z: +c.position.z.toFixed(2),
                v: +Math.hypot(c.velocity.x, c.velocity.z).toFixed(2),
                body: h.bodyTypes().id,
              };
            }""")
            rows.append((name, d))
            print(f'{name:22s} body={d["body"]:8s} v={d["v"]:4.2f} pos=({d["x"]},{d["y"]},{d["z"]}) '
                  f'reach={d["sp"]["maxReach"]:.2f} clamp={d["sp"]["clamped"]} phase={d["sp"]["phase"]:.2f}')

        # 1) 静止：8 条腿对称张开、膝盖高于背线
        snap('01-idle.png', 400)

        # 2) 走：三角步态，任何时刻 4 脚着地（2 张不同相位，能数出抬腿）
        page.keyboard.down('d')
        snap('02-walk-a.png', 900)
        snap('03-walk-b.png', 160)
        page.keyboard.up('d')
        page.wait_for_timeout(300)

        # 3) 跑（冲刺）：步频上限，验「高速是否夹腿」
        page.keyboard.down('Shift')
        page.keyboard.down('d')
        snap('04-sprint.png', 1200)
        page.keyboard.up('d')
        page.keyboard.up('Shift')
        page.wait_for_timeout(300)

        # 4) 原地转向：脚要重新落位，不能靠身体硬拧
        page.keyboard.down('w')
        snap('05-turn.png', 900)
        page.keyboard.up('w')
        page.wait_for_timeout(400)

        # 5) 跳跃：腾空蜷腿，落地不穿地
        page.keyboard.press('Space')
        snap('06-jump.png', 220)
        page.wait_for_timeout(900)
        snap('07-land.png', 60)

        print('errors', errors[:3])
        C.shutdown(pw, browser)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
