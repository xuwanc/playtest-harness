"""voxel forge 截图：把一个 spec 从多个角度拍下来，并把零件统计打出来。

用法：
    python3 tools/voxel-forge/shot.py                       # 默认 example-biped
    python3 tools/voxel-forge/shot.py --spec specs/spider-body.json
    python3 tools/voxel-forge/shot.py --spec specs/x.json --out shots/forge/x --angles 0,45,90,180

角度含义：0° = 从 +Z 正前方看（角色正面朝你），180° = 正后方，90° = 右侧。
俯角默认 18°，接近游戏里第三人称的平视略俯。
"""
import argparse
import json
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

FORGE = ROOT / 'tools' / 'voxel-forge'


def free_port() -> int:
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', default='specs/example-biped.json')
    ap.add_argument('--out', default='')
    ap.add_argument('--angles', default='30,120,195,285')
    ap.add_argument('--pitch', type=float, default=18.0)
    ap.add_argument('--dist', type=float, default=0.0)
    ap.add_argument('--size', default='900x760')
    args = ap.parse_args()

    spec_path = (FORGE / args.spec).resolve()
    if not spec_path.exists():
        print(f'spec 不存在: {spec_path}')
        return 1
    stem = spec_path.stem
    out = Path(args.out) if args.out else ROOT / 'shots' / 'forge' / stem
    out = out if out.is_absolute() else ROOT / out
    out.mkdir(parents=True, exist_ok=True)

    w, h = (int(x) for x in args.size.lower().split('x'))
    rel = spec_path.relative_to(ROOT).as_posix()

    port = free_port()
    srv = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(port), '--directory', str(ROOT)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    url = f'http://127.0.0.1:{port}/tools/voxel-forge/forge.html?spec=/{rel}'
    try:
        for _ in range(80):
            try:
                with socket.create_connection(('127.0.0.1', port), timeout=0.2):
                    break
            except OSError:
                time.sleep(0.05)

        pw, browser, page, errors = C.launch(width=w, height=h)
        page.goto(url, wait_until='load', timeout=60000)
        page.wait_for_function('() => !!(window.__forge && window.__forge.ready)', timeout=60000)
        page.wait_for_timeout(350)

        stats = page.evaluate('() => window.__forge.stats()')
        print(f'spec   {stem}')
        print(f'parts  {stats["parts"]}  →  mesh {stats["meshes"]}   tris {stats["tris"]}')
        print(f'size   {stats["size"][0]:.2f} × {stats["size"][1]:.2f} × {stats["size"][2]:.2f} m'
              f'   center y {stats["center"][1]:.2f}')

        angles = [float(a) for a in args.angles.split(',') if a.strip()]
        for i, a in enumerate(angles, 1):
            page.evaluate(
                """({ yaw, pitch, dist }) => window.__forge.setCam({ yaw, pitch, dist })""",
                {'yaw': a, 'pitch': args.pitch, 'dist': args.dist if args.dist > 0 else None},
            )
            page.wait_for_timeout(120)
            name = f'{i:02d}-yaw{int(a):03d}.png'
            page.screenshot(path=str(out / name))
            print(f'  {name}')

        ts = page.evaluate('() => window.__forge.exportTs()')
        (out / f'{stem}.parts.ts').write_text(ts + '\n', encoding='utf-8')
        print(f'  {stem}.parts.ts   （可粘进 rig 的片段）')

        if errors:
            print('console errors:', errors[:3])
        C.shutdown(pw, browser)
        print(f'→ {out}')
        return 0
    finally:
        srv.terminate()


if __name__ == '__main__':
    raise SystemExit(main())
