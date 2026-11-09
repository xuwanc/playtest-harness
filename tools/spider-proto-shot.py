"""蜘蛛原型截图（一次性验证脚本，不属于发布链路）。

起一个指向仓库根的静态服务器（要能取到 /node_modules/three 与 /prototype），
用 __spider.advance() 确定性推进步态，避免靠 rAF 等时间导致相位不可复现。
"""
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path('/workspace/playtest-harness')
sys.path.insert(0, str(ROOT / 'tools' / 'clip-lab'))
import clip_lab as C  # noqa: E402

OUT = ROOT / 'shots' / 'spider-proto'
OUT.mkdir(parents=True, exist_ok=True)


def free_port() -> int:
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def main() -> int:
    port = free_port()
    srv = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(port), '--directory', str(ROOT)],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    url = f'http://127.0.0.1:{port}/prototype/spider/index.html'
    try:
        for _ in range(80):
            try:
                with socket.create_connection(('127.0.0.1', port), timeout=0.2):
                    break
            except OSError:
                time.sleep(0.05)

        pw, browser, page, errors = C.launch(width=1280, height=820)
        page.goto(url, wait_until='load', timeout=60000)
        page.wait_for_function('() => !!window.__ready', timeout=60000)
        page.wait_for_timeout(300)

        # 面板放进画面里，但要先量一下是否遮挡：原型是左侧 236px，1280 宽够用
        def shot(name: str, setup: str, settle: str, extra_wait: int = 0) -> None:
            page.evaluate(setup)
            page.evaluate(settle)
            if extra_wait:
                page.wait_for_timeout(extra_wait)
            page.screenshot(path=str(OUT / name))
            info = page.evaluate('() => ({phase: window.__spider.getPhase(), stats: window.__spider.stats, legs: window.__spider.legs()})')
            print(f'[shot] {name}  phase={info["phase"]:.3f} '
                  f'maxReach={info["stats"]["maxReach"]:.2f} clamped={info["stats"]["clamped"]}')

        # 1) 静止：看默认站姿（膝盖是否拱起、8 腿是否对称）
        shot('01-idle.png',
             "() => { window.__spider.set({speed: 0, turn: 0}); window.__spider.reset(); }",
             "() => window.__spider.advance(0.8)")

        # 2) 常速直行：抓住摆动相中段（此时应有 4 腿离地）
        shot('02-walk.png',
             "() => { window.__spider.reset(); window.__spider.set({speed: 1.4, turn: 0, stride: 0.42}); }",
             "() => { window.__spider.advance(2.6); window.__spider.advance(0.22); }")

        # 3) 高速：验证支撑脚在最大伸展时是否被 clamp（stride 0.78 会 clamp 2 条腿，见 ADR §10）
        shot('03-fast.png',
             "() => { window.__spider.reset(); window.__spider.set({speed: 3.0, turn: 0, stride: 0.62}); }",
             "() => window.__spider.advance(3.2)")

        # 4) 原地转向：脚要重新落位，不能靠身体硬拧。
        #    转角控制在 ~40°：再大相机（固定世界偏移）就变成侧面了，看不出腿的同侧/异侧关系
        shot('04-turn.png',
             "() => { window.__spider.reset(); window.__spider.set({speed: 0.25, turn: 0.7, stride: 0.36}); }",
             "() => window.__spider.advance(1.0)")

        # 5) 低体高 + 大抬腿：看膝盖是否会撞地、IK 是否 clamped
        shot('05-low.png',
             "() => { window.__spider.reset(); window.__spider.set({speed: 1.2, stride: 0.40, height: 0.22, lift: 0.16, turn: 0}); }",
             "() => window.__spider.advance(2.2)")

        if errors:
            print('[page errors]', errors[:5])
        browser.close()
        pw.stop()
    finally:
        srv.terminate()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
