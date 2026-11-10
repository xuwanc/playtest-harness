#!/usr/bin/env python3
"""脊柱链连续性诊断：侧视 / 后 3/4 视角 + 三段骨骼的世界朝向读数。

用法：
    npm run build && python3 tools/spine-chain-shot.py

产物落在 shots/spine-chain/：
    01-side.png       正侧：各级之间有没有楔形缺口、骨盆处是不是空的
    02-back.png       后 3/4：弓背时背面接缝
    03-top.png        俯视 38°（游戏默认视角）：可读性
    04/05-front34     前 3/4 两个方向：髋块的体积有没有吞掉大腿
    06-dummy.png      码头杂兵：假人骨架也补了髋块（同一套体态）
    07-swing.png      挥砍中：髋块是否跟着少转（不该「骨盆往前甩」）
    08/09-human      默认主角（人类体型）：三段链在直立体型上会不会露缝

同时打印三段骨骼的**世界朝向**（模型空间 Y 轴的俯仰 / 偏航），用于判断
「朝向是不是单调连续」—— 不连续的表现是 40° → 7° → 24° 这种回落。
"""
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'spine-chain'
OUT.mkdir(parents=True, exist_ok=True)

READ = """() => {
  const h = window.__harness;
  const root = h.view.heroGroup();
  // 不依赖 window.THREE：从已存在的对象上借构造器
  const V3 = root.position.constructor;
  const Q = root.quaternion.constructor;
  // v9s.72：段数可配，沿链走一遍（upper → spine1… → chest）
  const names = ['pelvis', 'lower', 'upper'];
  {
    let n = root.getObjectByName('upper');
    for (let i = 0; n && i < 6; i++) {
      const next = (n.children || []).find((c) => c.name === 'chest' || /^spine\d+$/.test(c.name || ''));
      if (!next) break;
      names.push(next.name);
      n = next;
    }
  }
  const out = {};
  for (const n of names) {
    const o = root.getObjectByName(n);
    if (!o) { out[n] = null; continue; }
    const q = o.getWorldQuaternion(new Q());
    const up = new V3(0, 1, 0).applyQuaternion(q);
    const fw = new V3(0, 0, 1).applyQuaternion(q);
    out[n] = {
      pitchDeg: Math.asin(-fw.y) * 180 / Math.PI,
      yawDeg: Math.atan2(fw.x, fw.z) * 180 / Math.PI,
      upY: up.y,
    };
  }
  const tl = root.getObjectByName('torsoLower');
  const tu = root.getObjectByName('torsoUpper');
  const p = new V3();
  const wp = (o) => { o.getWorldPosition(p); return [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3)]; };
  out._torso = {
    lowerWorld: tl ? wp(tl) : null,
    upperWorld: tu ? wp(tu) : null,
    lowerSize: tl ? [tl.geometry.parameters.width, tl.geometry.parameters.height, tl.geometry.parameters.depth] : null,
    upperSize: tu ? [tu.geometry.parameters.width, tu.geometry.parameters.height, tu.geometry.parameters.depth] : null,
    pelvisWorld: wp(root.getObjectByName('pelvis')),
  };
  out._dbg = (() => { try { return h.view.postureDebug ? h.view.postureDebug() : null; } catch (e) { return String(e); } })();
  return out;
}"""


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

        def cam(pitch: float, yaw: float, dist: float = 3.0) -> None:
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
            d = page.evaluate(READ)
            chain = [k for k in d.keys() if k in ('upper', 'chest') or k.startswith('spine')]
            def _ord(k: str) -> int:
                if k == 'upper':
                    return 0
                if k == 'chest':
                    return 99
                return int(k[5:]) + 1
            chain.sort(key=_ord)
            for n in ['lower'] + chain:
                r = d.get(n)
                if r:
                    print(f"  {n:7s} pitchWorld={r['pitchDeg']:+6.1f}°  yawWorld={r['yawDeg']:+6.1f}°")
            t = d.get('_torso') or {}
            print(f"  torsoLower {t.get('lowerWorld')} size={t.get('lowerSize')}")
            print(f"  torsoUpper {t.get('upperWorld')} size={t.get('upperSize')}")
            print(f"  pelvis     {t.get('pelvisWorld')}")
            print(f"  posture    {d.get('_dbg')}")
            print()

        cam(8, 90)
        page.screenshot(path=str(OUT / '01-side.png'))
        print('[01-side]')
        report('side')

        cam(14, 200)
        page.screenshot(path=str(OUT / '02-back.png'))
        print('[02-back]')

        cam(38, 10)
        page.screenshot(path=str(OUT / '03-top.png'))
        print('[03-top]')

        cam(26, 40)
        page.screenshot(path=str(OUT / '04-front34.png'))
        print('[04-front34]')

        cam(26, 320)
        page.screenshot(path=str(OUT / '05-front34b.png'))
        print('[05-front34b]')

        # 攻击中：前倾预算被挥砍吃掉一半，髋块跟着少转 —— 看会不会「骨盆往前甩」
        page.evaluate("""() => {
          const c = window.__harness.world.character;
          c.position.x = -14.0; c.position.z = 9.5; c.velocity.x = 0; c.velocity.z = 0;
          window.__harness.view.snapCamera(c.position.x, c.position.y, c.position.z);
        }""")
        page.wait_for_timeout(700)
        cam(12, 90)
        page.mouse.click(450, 450)
        page.wait_for_timeout(230)
        page.screenshot(path=str(OUT / '07-swing.png'))
        print('[07-swing]')
        page.wait_for_timeout(900)

        # 码头三只杂兵也用同一套体态：把镜头挪到假人跟前，确认髋块也补上了
        page.evaluate("""() => {
          const c = window.__harness.world.character;
          c.position.x = 60.0; c.position.z = 62.4; c.velocity.x = 0; c.velocity.z = 0;
          window.__harness.view.snapCamera(c.position.x, c.position.y, c.position.z);
        }""")
        page.wait_for_timeout(700)
        cam(24, 8, 4.2)
        page.screenshot(path=str(OUT / '06-dummy.png'))
        print('[06-dummy]')

        # 人类体型（无体态层）：三段链在直立体型上会不会露出接缝。
        # 默认识别不到的体型没有补块，全靠每级折角小 —— 这是「三段」最容易翻车的一组。
        page.goto(f'{srv.url}', wait_until='load', timeout=60000)
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
        }""")
        page.wait_for_timeout(900)
        cam(6, 90)
        page.screenshot(path=str(OUT / '08-human-side.png'))
        print('[08-human-side]')
        report('human-idle')
        page.mouse.click(450, 450)
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / '09-human-swing.png'))
        print('[09-human-swing]')
        report('human-swing')

        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        print('ok ->', OUT)
        browser.close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
