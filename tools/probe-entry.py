#!/usr/bin/env python3
"""v9s.55 起手 / 收招逐帧探针：直接读骨架数值，不依赖截图观感。

    python3 tools/probe-entry.py sword-shield [greatsword dual-swords]

输出三列关键量（每帧）：shoulderR.rotation.x（主手抬臂）、刃身仰角（世界，deg）、
以及相邻帧的最大关节跳变。用来证明「按下攻击那一帧」与「打完回到待机」都没有硬切。
"""
import math
import sys
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

JS_PROBE = """() => {
  const h = window.__harness;
  const c = h.world.combat;
  const g = h.view.heroGroup();
  const deg = (r) => r * 180 / Math.PI;
  const bl = h.view.bladesWorld();
  let pitch = null;
  if (bl && bl.right) {
    const dx = bl.right.tip.x - bl.right.base.x;
    const dy = bl.right.tip.y - bl.right.base.y;
    const dz = bl.right.tip.z - bl.right.base.z;
    pitch = deg(Math.atan2(dy, Math.hypot(dx, dz)));
  }
  const j = (n) => {
    const o = g.getObjectByName(n);
    return o ? [O(o.rotation.x), O(o.rotation.y), O(o.rotation.z)] : [null, null, null];
  };
  function O(v) { return Math.round(v * 1000) / 1000; }
  return {
    phase: c.phase,
    u: +(h.swingDebug().strike ?? 0).toFixed(2),
    arm: O(g.getObjectByName('shoulderR')?.rotation.x ?? 0),
    elbow: O(g.getObjectByName('elbowR')?.rotation.x ?? 0),
    bladePitch: pitch === null ? null : Math.round(pitch * 10) / 10,
    torso: O(h.spineDebug().totalYaw),
    hipYaw: O(h.gaitDebug().hipYaw ?? 0),
    idleW: O(h.gaitDebug().idleW ?? 0),
    poseW: O(h.swingDebug().poseW ?? 0),
    tip: (() => {
      const b = h.view.bladesWorld();
      const lead = h.swingDebug().lead === 'L' ? b.left : b.right;
      if (!lead) return null;
      const dx = lead.tip.x - lead.base.x;
      const dy = lead.tip.y - lead.base.y;
      const dz = lead.tip.z - lead.base.z;
      const len = Math.hypot(dx, dy, dz) || 1;
      return [dx / len, dy / len, dz / len];
    })(),
  };
}"""


def run(page, label, press, out):
    page.evaluate("""(p) => {
      const h = window.__harness;
      if (p) h.stepOnce({ attackPressed: true });
      else h.stepOnce();
      h.view.render(h.world, 1 / 60);
    }""", press)
    info = page.evaluate(JS_PROBE)
    out.append((label, info))
    print(f"{label:14s} {info}")


def main(weapons):
    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(width=800, height=800)
        C.open_game(page, srv.url)
        for weapon in weapons:
            print(f'\n=== {weapon} ===')
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
              h.debug.paused = true;
              h.clipLab.preview({ weapon: w, comboIndex: 1, progress: 0, warm: 1, t: 0 });
              for (let i = 0; i < 40; i++) { h.stepOnce(); h.view.render(h.world, 1 / 60); }
            }""", weapon)
            out = []
            print('--- 待机 → 按下攻击 ---')
            for i in range(0, 10):
                run(page, 'idle' if i == 0 else f'entry{i:02d}', i == 0, out)
            # 打到结束 + 回到待机
            print('--- 收招 → 待机 ---')
            for i in range(0, 30):
                run(page, f'tail{i:02d}', False, out)
            # 相邻帧最大跳变（只看 arm / torso）
            mx = 0.0
            tip_steps = []
            for a, b in zip(out, out[1:]):
                for k in ('arm', 'torso', 'hipYaw'):
                    if a[1][k] is None or b[1][k] is None:
                        continue
                    mx = max(mx, abs(b[1][k] - a[1][k]))
                ta, tb = a[1]['tip'], b[1]['tip']
                if ta and tb:
                    dot = max(-1.0, min(1.0, sum(x * y for x, y in zip(ta, tb))))
                    tip_steps.append((a[0], b[0], math.degrees(math.acos(dot))))
            print(f'>> 相邻帧最大跳变（arm/torso/hipYaw）: {mx:.3f} rad')
            if tip_steps:
                worst = max(tip_steps, key=lambda t: t[2])
                print(f'>> 剑身单帧最大转角: {worst[2]:.1f}°  ({worst[0]} → {worst[1]})')
        if errors:
            print('PAGE ERRORS:', errors)
            return 1
        browser.close()
    return 0


if __name__ == '__main__':
    ws = sys.argv[1:] or ['sword-shield']
    sys.exit(main(ws))
