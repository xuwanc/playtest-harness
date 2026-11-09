#!/usr/bin/env python3
"""线上核验：GitHub Pages 上的产物是否就是本地 `dist/` 这一版。

    python3 tools/check-online.py [--wait 180]

为什么需要：`npm run ship` 只负责把 `dist/` 推到 `preview` 分支，**它不等 Pages 构建**。
Pages 的构建偶尔会 `abandoned` / `failed`（2026-11-10 连挂两次），而 CDN 还会继续用旧
`index.html` 提供服务 —— 于是「本地是新版、线上是旧版」，只差一个 hash 文件名（v9s.55）。

判据只有三条，全走 HTTP，不需要浏览器：
  1. 线上 `index.html` 引用的 JS 文件名 == 本地 `dist/index.html` 里的那个；
  2. 那个 JS 在线上真的能取到（200，且大小与本地一致）；
  3. 徽标里的版本号 == `package.json` 的版本。

退出码 0 = 一致；1 = 不一致（附「再等一会儿 / 重新触发构建」的提示）。
"""
import argparse
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://xuwanc.github.io/playtest-harness/'
JS_RE = re.compile(r'assets/main-[A-Za-z0-9_\-]+\.js')
VER_RE = re.compile(r'v(\d+\.\d+\.\d+)')


def fetch(url: str, timeout: float = 25) -> bytes:
    # 加随机参数绕开 CDN 对 index.html 的 10 分钟缓存
    sep = '&' if '?' in url else '?'
    req = urllib.request.Request(f'{url}{sep}cb={int(time.time() * 1000)}',
                                 headers={'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def local_asset() -> str:
    html = (ROOT / 'dist' / 'index.html').read_text(encoding='utf-8')
    m = JS_RE.search(html)
    if not m:
        raise SystemExit('本地 dist/index.html 里没有 assets/main-*.js —— 先 npm run build')
    return m.group(0)


def probe():
    asset = local_asset()
    online_html = fetch(BASE).decode('utf-8', 'replace')
    m = JS_RE.search(online_html)
    online_asset = m.group(0) if m else '(none)'
    version = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['version']
    ok_asset = online_asset == asset
    size_local = (ROOT / 'dist' / asset).stat().st_size
    size_online = None
    if ok_asset:
        req = urllib.request.Request(BASE + online_asset, method='HEAD')
        with urllib.request.urlopen(req, timeout=25) as r:
            size_online = int(r.headers.get('Content-Length') or 0)
    # 徽标是构建期注入的，只出现在 JS 里；用字符串扫描代替跑浏览器
    js = fetch(BASE + online_asset).decode('utf-8', 'replace') if ok_asset else ''
    badge = f'v{version}' in js
    return {
        'asset_local': asset, 'asset_online': online_asset,
        'size_local': size_local, 'size_online': size_online,
        'version': version, 'badge_ok': badge,
        'ok': ok_asset and (size_online in (None, size_local)) and badge,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--wait', type=int, default=0, help='最多等多少秒（每 15s 重试一次）')
    args = ap.parse_args()
    deadline = time.time() + max(0, args.wait)
    while True:
        r = probe()
        print(f"本地 {r['asset_local']}  ←→  线上 {r['asset_online']}"
              f"  大小 {r['size_local']} / {r['size_online']}  徽标 v{r['version']}: "
              f"{'有' if r['badge_ok'] else '无'}")
        if r['ok']:
            print('PASS 线上产物与本地 dist 一致')
            return 0
        if time.time() >= deadline:
            break
        print('  还没生效，15s 后重试……（Pages 构建中 / CDN 缓存）')
        time.sleep(15)
    print('FAIL 线上仍是旧产物。常见原因：Pages 构建 abandoned / failed。')
    print('  用 token 重新触发：curl -X POST -H "Authorization: Bearer $TOK" '
          'https://api.github.com/repos/xuwanc/playtest-harness/pages/builds')
    return 1


if __name__ == '__main__':
    sys.exit(main())
