#!/usr/bin/env python3
"""v9s.77 测试截图机位：跟住角色的任意位置 / 角度，拍到对准的图。

背景：游戏相机是给玩家看的 —— 注视点写死在腰高、`yaw≠0` 时智能构图会把角色
横向推出画幅、每帧还叠震动。用它拍脚掌特写，四张图全是腰以上（v9s.76 的真实遭遇）。
本工具改用 `view.shotTake()`（`src/presentation/shot-cam.ts`），每帧接管相机。

用法：

    # 相对角色（脚底原点，朝向 = 角色朝向）：右侧 0.8m、抬高 0.12m，看脚踝
    python3 tools/shot.py --eye 0.8,0.12,0 --look 0,0.08,0 --fov 28 --out shots/foot.png

    # 跟随某根骨头：以左脚前掌为原点，站在它正侧方 0.45m
    python3 tools/shot.py --anchor node --node ballL --eye 0.45,0.04,0 --fov 24 --out shots/ball.png

    # 自动取景：把某节点塞满画面（不用手调距离）
    python3 tools/shot.py --fit footTipL --dir 1,0.15,0 --pad 1.3 --out shots/foot-fit.png

    # 世界坐标：只跟位置，不跟朝向
    python3 tools/shot.py --anchor hero --world --eye 0,1.6,3.2 --fov 35 --out shots/back.png

    # 连拍验证「跟随」：角色边走边拍，目标应始终落在画面同一处
    python3 tools/shot.py --anchor node --node chest --eye 0,0.1,1.2 --frames 4 \
        --walk 1.2 --out shots/follow.png

每条命令都会打印实际生效的读数（眼睛 / 注视点 / 距离 / 目标在画面里的占比）——
**截图必须和数字对得上**，否则又是「看着像、其实在画面外」。
"""
import argparse
import json
import sys


class ShotError(RuntimeError):
    """取景失败（节点不存在 / 没有几何）—— 截图工具最怕「安静地拍空」，所以直接抛。"""
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402


def vec(text: str) -> list[float]:
    parts = [p for p in text.replace(' ', '').split(',') if p]
    if len(parts) != 3:
        raise argparse.ArgumentTypeError(f'需要三个分量 x,y,z，收到 {text!r}')
    return [float(p) for p in parts]


def main() -> int:
    ap = argparse.ArgumentParser(description='测试截图机位（跟住角色任意位置 / 角度）')
    ap.add_argument('--out', required=True, help='输出图片路径')
    ap.add_argument('--anchor', choices=['hero', 'node', 'world'], default='hero')
    ap.add_argument('--node', default=None, help="anchor=node 时的节点名，如 footTipL / ballL / chest")
    ap.add_argument('--at', type=vec, default=None, help='anchor=world 时的锚点世界坐标')
    ap.add_argument('--eye', type=vec, default=None, help='相机相对锚点的偏移（米）')
    ap.add_argument('--look', type=vec, default=None, help='注视点相对锚点的偏移（米），默认锚点本身')
    ap.add_argument('--fov', type=float, default=None, help='垂直视角（度）。特写用 20~30')
    ap.add_argument('--roll', type=float, default=None, help='视线滚转（度）')
    ap.add_argument('--world', action='store_true', help='eye/look 按世界方向解释（只跟位置）')
    ap.add_argument('--fit', default=None, help='自动取景的节点名（填 hero = 整副骨架），替代 --eye')
    ap.add_argument('--dir', type=vec, default=[0, 0, 1], help='--fit 的观察方向（从目标指向相机）')
    ap.add_argument('--pad', type=float, default=1.25, help='--fit 的留白系数，1.25 = 四周各留 12.5%%')
    ap.add_argument('--size', default='900x900', help='视口尺寸，如 900x900')
    ap.add_argument('--paused', action='store_true', help='冻结 Core 的 step（渲染照常，可钉姿态）')
    ap.add_argument('--phase', type=float, default=None, help='钉住步态相位（0~2π，隐含 --paused）')
    ap.add_argument('--speed', type=float, default=None, help='钉住前向速度（m/s），配合 --phase')
    ap.add_argument('--face', type=float, default=None,
                    help='钉住角色朝向（度，0 = +Z）。机位是相对角色摆的，朝向不定就没法复现')
    ap.add_argument('--pos', default=None, help='钉住角色位置 x,z（不传则挪到空地 -14,9.5）')
    ap.add_argument('--hide-weapons', action='store_true', help='隐藏剑 / 盾（近景特写会怼进盾里）')
    ap.add_argument('--light', type=float, default=1.2,
                    help='截图补光强度（0 = 关）。场景是暗色调夜景，不补光特写就是一团黑')
    ap.add_argument('--xray', nargs='?', const='', default=None, metavar='NODE',
                    help='法线着色验收视图（折角 / 穿插 / 入地唯一看得清的办法）。'
                         '不带值时跟着取景目标，带值时指定节点')
    ap.add_argument('--frames', type=int, default=1, help='连拍张数（验证「跟随」时用）')
    ap.add_argument('--interval', type=int, default=260, help='连拍间隔（毫秒）')
    ap.add_argument('--walk', type=float, default=None, help='连拍时每帧前进的距离（米），验证跟随机位')
    ap.add_argument('--json', action='store_true', help='只打印 JSON 读数')
    args = ap.parse_args()

    out = Path(args.out)
    if not out.is_absolute():
        out = ROOT / out
    out.parent.mkdir(parents=True, exist_ok=True)
    w, h = (int(v) for v in args.size.lower().split('x'))

    if not args.fit and not args.eye:
        ap.error('要么给 --eye（相对偏移），要么给 --fit（自动取景）')

    spec: dict = {'anchor': args.anchor}
    if args.node:
        spec['node'] = args.node
    if args.at:
        spec['at'] = args.at
    if args.eye:
        spec['eye'] = args.eye
    if args.look:
        spec['look'] = args.look
    if args.fov:
        spec['fov'] = args.fov
    if args.roll:
        spec['roll'] = args.roll
    if args.world:
        spec['world'] = True
    if args.light:
        spec['light'] = args.light

    with C.StaticServer() as srv:
        pw, browser, page, errors = C.launch(False, w, h)
        try:
            C.open_game(page, srv.url)
            start = args.pos.split(',') if args.pos else ['-14.0', '9.5']
            page.evaluate("""(o) => {
              const h = window.__harness;
              h.clipLab.release();
              // 挪到空地：默认出生点附近有假人和物件，特写时会挡镜头
              const c = h.world.character;
              c.position.x = o.x; c.position.z = o.z; c.position.y = 0;
              c.velocity.x = 0; c.velocity.z = 0;
              if (o.face !== null) { c.facing = o.face; c.bodyYaw = o.face; }
              (h.world.dummies || []).forEach((d, i) => {
                d.position.x = 60 + i * 3; d.position.z = 60;
                d.homeX = d.position.x; d.homeZ = d.position.z;
              });
            }""", {'x': float(start[0]), 'z': float(start[1]),
                    'face': None if args.face is None else args.face * 3.141592653589793 / 180})

            if args.hide_weapons:
                page.evaluate("""() => {
                  window.__harness.view.heroGroup().traverse((o) => {
                    if (/shield|sword|blade|great|axe/i.test(o.name || '')) o.visible = false;
                  });
                }""")

            if args.xray is not None:
                xn = args.xray or (args.fit if args.fit and args.fit != 'hero' else args.node)
                n = page.evaluate(
                    "(node) => window.__harness.view.shotXray(node)", xn,
                )
                if not n:
                    raise ShotError(f'--xray {xn or "(整副骨架)"} 没有替换到任何 mesh')
                if not args.json:
                    print(f'[xray] 法线着色 {n} 个 mesh（技术验收视图，非游戏画面）')

            if args.paused or args.phase is not None:
                page.evaluate("""() => { window.__harness.debug.paused = true; }""")

            def pin() -> None:
                """钉住姿态 / 相位 / 速度 —— 静止画面才能稳定截图。"""
                if args.phase is None and args.speed is None and args.face is None:
                    return
                page.evaluate("""(o) => {
                  const h = window.__harness, c = h.world.character;
                  if (o.phase !== null) c.gaitPhase = o.phase;
                  if (o.speed !== null) c.velocity.z = o.speed;
                  // 朝向每帧重钉：索敌 / 攻击收招都会改 facing，机位是相对角色摆的，
                  // 朝向一变画面就换了角度（实测同一个 --eye 两次拍出不同侧脸）。
                  if (o.face !== null) { c.facing = o.face; c.bodyYaw = o.face; }
                }""", {'phase': args.phase, 'speed': args.speed,
                        'face': None if args.face is None else args.face * 3.141592653589793 / 180})

            def shoot(tag: str) -> dict:
                """按当前 spec 取景，截一张，返回读数 + 目标在画面里的占比。"""
                if args.fit:
                    # 自动取景：距离由包围球和 fov 反算，不用手调
                    info = page.evaluate(
                        """(a) => window.__harness.view.shotFit(a.node, a.dir, a.pad, a.fov)""",
                        {'node': None if args.fit == 'hero' else args.fit,
                         'dir': args.dir, 'pad': args.pad, 'fov': args.fov},
                    )
                else:
                    info = page.evaluate(
                        """(spec) => window.__harness.view.shotTake(spec)""", spec,
                    )
                if info is None:
                    what = f'--fit {args.fit}' if args.fit else f'--node {args.node}'
                    raise ShotError(f'{what} 取景返回 null：骨架里没有这个节点')
                # 等两帧：`shotTake` 立即改相机，但投影矩阵要等下一次 render 才用上
                page.wait_for_timeout(120)

                target = None
                if args.fit:
                    target = None if args.fit == 'hero' else args.fit
                elif args.anchor == 'node':
                    target = args.node
                box = page.evaluate("""(name) => {
                  const h = window.__harness;
                  const root = h.view.heroGroup();
                  const o = name ? root.getObjectByName(name) : root;
                  if (!o) return null;
                  // 纯锚点（footTipL）没有几何 —— 与 shotFit 同一套规则：向上退到
                  // 第一个有 mesh 的祖先，否则量出来是空盒，误报「目标不在画面内」。
                  let measure = o;
                  const hasMesh = (x) => {
                    let hit = false;
                    x.traverse((n) => { if (n.isMesh && n.geometry) hit = true; });
                    return hit;
                  };
                  let guard = 0;
                  while (!hasMesh(measure) && measure.parent && guard++ < 8) measure = measure.parent;
                  measure.updateWorldMatrix(true, true);
                  // 不引 THREE：从页面已经加载的模块里借不到，就手算包围盒 ——
                  // 遍历所有 Mesh 的几何包围盒顶点，转到世界坐标再投影。
                  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
                  measure.traverse((n) => {
                    if (!n.isMesh || !n.geometry) return;
                    const g = n.geometry;
                    if (!g.boundingBox) g.computeBoundingBox();
                    const bb = g.boundingBox;
                    const m = n.matrixWorld;
                    for (let i = 0; i < 8; i++) {
                      const v = [i & 1 ? bb.max.x : bb.min.x,
                                 i & 2 ? bb.max.y : bb.min.y,
                                 i & 4 ? bb.max.z : bb.min.z];
                      // 世界坐标 = matrixWorld * (x,y,z)
                      const e = m.elements;
                      const wx = e[0]*v[0] + e[4]*v[1] + e[8]*v[2] + e[12];
                      const wy = e[1]*v[0] + e[5]*v[1] + e[9]*v[2] + e[13];
                      const wz = e[2]*v[0] + e[6]*v[1] + e[10]*v[2] + e[14];
                      const p = h.view.projectPoint(wx, wy, wz);
                      x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x);
                      y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
                    }
                  });
                  if (!Number.isFinite(x0)) return null;
                  const W = window.innerWidth, H = window.innerHeight;
                  return {
                    x0: Math.round(x0), y0: Math.round(y0),
                    x1: Math.round(x1), y1: Math.round(y1),
                    w: Math.round(x1 - x0), h: Math.round(y1 - y0),
                    fillW: +((x1 - x0) / W).toFixed(3),
                    fillH: +((y1 - y0) / H).toFixed(3),
                    cx: +(((x0 + x1) / 2) / W).toFixed(3),
                    cy: +(((y0 + y1) / 2) / H).toFixed(3),
                    inside: x1 > 0 && y1 > 0 && x0 < W && y0 < H,
                  };
                }""", target)

                path = out if args.frames == 1 else out.with_name(f'{out.stem}-{tag}{out.suffix}')
                page.screenshot(path=str(path))
                return {'shot': info, 'box': box, 'file': str(path.relative_to(ROOT))}

            rows: list[dict] = []
            for i in range(max(args.frames, 1)):
                if args.walk and i > 0:
                    # 「跟随」验收：让角色沿朝向走一段，机位应跟住同一块骨头。
                    # 若机位其实没跟随，目标的画面坐标会明显漂移。
                    page.evaluate("""(d) => {
                      const h = window.__harness, c = h.world.character;
                      c.position.x += Math.sin(c.facing) * d;
                      c.position.z += Math.cos(c.facing) * d;
                    }""", args.walk)
                pin()
                page.wait_for_timeout(args.interval if i else 400)
                rows.append(shoot(f'{i + 1}'))

            if args.json:
                print(json.dumps(rows, ensure_ascii=False, indent=2))
            else:
                for i, r in enumerate(rows):
                    s = r['shot'] or {}
                    b = r['box'] or {}
                    eye = s.get('eye') or {}
                    look = s.get('look') or {}
                    print(f"--- {r['file']} ---")
                    measured = s.get('measured')
                    print(f"  anchor={s.get('anchor')} node={s.get('node')} found={s.get('found')}"
                          + (f" 实际测量={measured}" if measured else '')
                          + f"  fov={round(s.get('fov') or 0, 1)}  dist={round(s.get('dist') or 0, 3)}")
                    print(f"  eye=({eye.get('x', 0):+.3f}, {eye.get('y', 0):+.3f}, {eye.get('z', 0):+.3f})"
                          f"  look=({look.get('x', 0):+.3f}, {look.get('y', 0):+.3f}, {look.get('z', 0):+.3f})")
                    if b:
                        print(f"  bbox=({b['x0']},{b['y0']})-({b['x1']},{b['y1']})"
                              f"  占画幅 {b['fillW'] * 100:.0f}%×{b['fillH'] * 100:.0f}%"
                              f"  中心 ({b['cx']:.2f}, {b['cy']:.2f})"
                              f"  {'在画内' if b['inside'] else '**在画外**'}")
                    else:
                        print('  bbox=null（没找到目标节点）')

            if errors:
                print('\n[页面错误]', file=sys.stderr)
                for e in errors[:5]:
                    print(' ', e, file=sys.stderr)

            # 硬判据：目标必须真的在画内。截图工具的失败模式是「安静地拍空」，
            # 所以这里直接返回非 0，让自动化链路能发现。
            bad = [r for r in rows if not (r['box'] or {}).get('inside')]
            if bad:
                print(f'\n[失败] {len(bad)}/{len(rows)} 张的目标不在画面内', file=sys.stderr)
                return 1
            miss = [r for r in rows if (r['shot'] or {}).get('found') is False]
            if miss:
                print(f"\n[失败] 节点没找到：{miss[0]['shot'].get('node')}", file=sys.stderr)
                return 1
            return 0
        except ShotError as e:
            print(f'[失败] {e}', file=sys.stderr)
            return 1
        finally:
            browser.close()
            pw.stop()


if __name__ == '__main__':
    sys.exit(main())
