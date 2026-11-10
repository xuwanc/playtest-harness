#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
v9s.x · 协同推送脚本（GitHub MCP 网关通道）。

为什么需要它
------------
沙箱里 `github.com:443` **读**可用（fetch / clone / ls-remote），但**写**没有
git 凭证：`git push` 会报 `could not read Username for 'https://github.com'`。
`tools/gh-commit.mjs` 的 REST 网关又要求自备 token，且它提交的是「工作区未
提交的差异」，推不了本地已有的 commit 链。

本脚本走本会话已授权的 GitHub MCP 网关（`/root/.codebuddy/.mcp.json` 里的
`github` connector），直接发 MCP `tools/call`：
  - create_branch   不存在时基于 main 建功能分支（**绝不动 main**）
  - push_files      把变更文件一次性写成 1 个 commit（内容从磁盘读，可读 800KB+ 构建产物）
  - delete_file     清理已删除的文件

要点：内容是脚本从本地磁盘读的，不经过对话上下文，所以大文件 / 几十个文件都行；
推送后请 `git fetch` 并用 `git diff HEAD origin/<branch>` 校验树一致，
再 `git reset --hard origin/<branch>` 让本地与远端对齐（git commit SHA 会不同，
因为远端 commit 由 API 重建，但 tree 逐字节相同）。

每次推代码都顺带刷新固定页面（2026-11-10 用户约定）：**推送成功后**自动调用
`publish-pages.py`，把本地 `dist/` 推到 `preview` 分支，让 GitHub Pages 与刚推的
代码保持一致，不用再单独说「发个链接」。失败只告警、绝不阻断推送结果；
`--no-pages` 可显式关闭，`--dry` 不会触发发布。

两条护栏（2026-11-10 补）：
  - `preview` / `gh-pages` 与 main 一样是受保护分支，源码绝不能推上去（会毁掉 Pages）；
  - 基线回落到 `origin/main` 时，若 main 不是本地 HEAD 的祖先就拒绝推送 ——
    否则 `git diff origin/main HEAD` 会把对方这段时间**新增的文件**全部算成删除，
    推上去等于抹掉别人的工作（当天真实踩过一次，靠手工 merge 才避免）。

`--pages-wait N` 可选：发布后调 `check-online.py --wait N` 核验线上真的生效
（Pages 构建偶尔 abandoned / CDN 缓存 10 分钟，见 docs/risk-review.md §v9s.55）。
默认 0 = 不核验、不拖慢推送，完成提示里给出手动核验命令。

用法
----
    python3.11 tools/push-branch.py                       # 推当前分支，message 取最近一次本地 commit
    python3.11 tools/push-branch.py --branch feat/xxx -m "feat: ..."
    python3.11 tools/push-branch.py --repo owner/repo --dry

前置：本地已 commit（脚本推的是「本地 HEAD 相对基线」的差异），工作区最好干净。
"""

import argparse
import json
import os
import subprocess
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MCP_URL = os.environ.get(
    'GITHUB_MCP_URL', 'http://github.agent-gateway.auth-proxy.local/mcp'
)
DEFAULT_REPO = 'xuwanc/playtest-harness'
MAX_BATCH_BYTES = 220_000


def git(*args):
    return subprocess.check_output(['git'] + list(args), cwd=ROOT, text=True).strip()


def git_ok(*args):
    return subprocess.run(['git'] + list(args), cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0


class MCP:
    def __init__(self, url):
        self.url = url
        self.sid = None
        self.n = 1

    def rpc(self, method, params=None, notify=False, timeout=240):
        payload = {'jsonrpc': '2.0', 'method': method}
        if not notify:
            payload['id'] = self.n
            self.n += 1
        if params is not None:
            payload['params'] = params
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
        }
        if self.sid:
            headers['Mcp-Session-Id'] = self.sid
        req = urllib.request.Request(
            self.url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
            headers=headers, method='POST',
        )
        r = urllib.request.urlopen(req, timeout=timeout)
        sid = r.headers.get('Mcp-Session-Id')
        if sid:
            self.sid = sid
        body = r.read().decode('utf-8', 'replace')
        if notify:
            return None
        if 'data:' in body:
            for line in body.splitlines():
                if line.startswith('data:'):
                    try:
                        d = json.loads(line[5:].strip())
                        if d.get('id') == payload['id']:
                            return d
                    except Exception:
                        pass
        try:
            return json.loads(body)
        except Exception:
            return {'raw': body[:500]}

    def handshake(self):
        r = self.rpc('initialize', {
            'protocolVersion': '2024-11-05', 'capabilities': {},
            'clientInfo': {'name': 'push-branch', 'version': '1.0'},
        })
        if 'result' not in r:
            raise RuntimeError(f'MCP initialize 失败: {r}')
        self.rpc('notifications/initialized', {}, notify=True)
        return self.sid

    def call(self, name, args):
        d = self.rpc('tools/call', {'name': name, 'arguments': args})
        if d.get('error'):
            raise RuntimeError(f'{name} RPC 失败: {d["error"]}')
        res = d.get('result', {})
        if res.get('isError'):
            raise RuntimeError(
                f'{name} 工具报错: ' + json.dumps(res.get('content'), ensure_ascii=False)[:600]
            )
        text = ''.join(
            c.get('text', '') for c in res.get('content', []) if c.get('type') == 'text'
        )
        # 8000 而不是 800：agent-sync.py 复用本类解析 create_pull_request 的 PR 号，
        # 返回体里还带 url / head sha，截太短会丢字段。
        return text[:8000]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default=DEFAULT_REPO)
    ap.add_argument('--branch', default=None, help='默认当前分支名')
    ap.add_argument('--base', default=None,
                    help='差异基线；默认优先 origin/<branch>（增量），否则 origin/main（全量）')
    ap.add_argument('-m', '--message', default=None)
    ap.add_argument('--dry', action='store_true', help='只打印计划，不写远端')
    ap.add_argument('--no-pages', action='store_true',
                    help='推送后不刷新 GitHub Pages（默认每次推送都刷新 preview 分支）')
    ap.add_argument('--pages-wait', type=int, default=0,
                    help='发布后核验线上生效：传给 check-online.py --wait 的秒数；'
                         '0（默认）只推 preview 不核验，不拖慢推送')
    args = ap.parse_args()

    owner, repo = args.repo.split('/', 1)
    branch = args.branch or git('rev-parse', '--abbrev-ref', 'HEAD')
    message = args.message or git('log', '-1', '--format=%B')

    # 硬护栏：绝不写受保护分支；源文件未提交就先停下（推完要 reset --hard，会吞掉改动）
    # preview / gh-pages 是 Pages 的产物分支，把源码推上去会直接毁掉线上页面。
    PROTECTED = {'main', 'master', 'HEAD', 'preview', 'gh-pages'}
    if branch in PROTECTED or branch.startswith('backup/'):
        sys.exit(f'[push-branch] 拒绝写入受保护分支 "{branch}"：只允许推 feat/* / fix/* 等功能分支')
    dirty = [
        line for line in git('status', '--porcelain').splitlines()
        if len(line) > 3 and not line[3:].split(' -> ')[-1].startswith('dist/')
    ]
    if dirty:
        sys.exit(
            '[push-branch] 有未提交的源码改动，先 git add -A && git commit；\n  '
            + '\n  '.join(dirty[:8])
        )

    # 基线：远端已有同名分支 → 增量；没有 → 相对 origin/main 全量
    if args.base:
        base = args.base
    elif git_ok('rev-parse', '--verify', f'origin/{branch}'):
        base = f'origin/{branch}'
    else:
        base = 'origin/main'

    # 防撞车护栏（v9s.x 无人值守协同）：远端同名分支若已被别的 agent 推进，
    # 本地 HEAD 还没包含它就直接 push_files 会把对方的文件当成「删除」推上去。
    # 只有 origin/<branch> 是本地 HEAD 的祖先（或不存在）才允许写。
    if not args.base and git_ok('rev-parse', '--verify', f'origin/{branch}'):
        if not git_ok('merge-base', '--is-ancestor', f'origin/{branch}', 'HEAD'):
            sys.exit(
                f'[push-branch] 拒绝推送：远端 {branch} 有本地没有的提交（别的 agent 推过）。\n'
                '  先 git fetch origin && git merge --no-ff origin/<branch>，'
                '或换一个带 agent 后缀的分支名 feat/<topic>-<agent>。'
            )

    # 护栏：无论基线是 origin/main 还是显式 --base，都必须是本地 HEAD 的祖先。
    # 否则 git diff 会把「对方在这段时间新增的文件」算成 D，push_files/delete_file
    # 就会把它们从远端抹掉。2026-11-10 实测：对方前进 21 个提交、新增 13 个文件，
    # --dry 计划里全成了 D，靠人工 merge --no-ff 才避免。把这次判断固化成代码。
    if git_ok('rev-parse', '--verify', base):
        if not git_ok('merge-base', '--is-ancestor', base, 'HEAD'):
            sys.exit(
                f'[push-branch] 拒绝推送：基线 {base} 不是本地 HEAD 的祖先'
                '（本地落后或已与主干分叉）。\n'
                '  此时取差异会把别人新增的文件当成「删除」推上去。\n'
                '  先 git fetch origin && git merge --no-ff origin/main，'
                '按规范解完冲突并 npm run verify 后再推。'
            )

    diff = git('diff', '--name-status', '--no-renames', base, 'HEAD').splitlines()
    adds, mods, dels = [], [], []
    for line in diff:
        status, path = line.split('\t', 1)
        (adds if status == 'A' else dels if status == 'D' else mods).append(path)

    files = []
    for path in adds + mods:
        with open(os.path.join(ROOT, path), 'rb') as f:
            raw = f.read()
        try:
            content = raw.decode('utf-8')
        except UnicodeDecodeError:
            raise RuntimeError(f'非 UTF-8 文件，文本 API 无法搬运: {path}')
        files.append({'path': path, 'content': content})
    size = sum(len(f['content'].encode('utf-8')) for f in files)

    print(f'[push-branch] 仓库 {args.repo} · 分支 {branch} · 基线 {base}')
    print(f'[push-branch] 待写 {len(files)} 文件 (A={len(adds)} M={len(mods)}) '
          f'{size:,} 字节；删除 {len(dels)} 个')
    if not files and not dels:
        print('[push-branch] 无差异，无需推送。')
        return 0
    if args.dry:
        for f in files:
            print('  M/A', f['path'])
        for p in dels:
            print('  D  ', p)
        print('[push-branch] DRY-RUN，未写远端。')
        return 0

    mcp = MCP(MCP_URL)
    print('[push-branch] MCP 会话', mcp.handshake())

    # 分支不存在时基于 main 创建（绝不动 main）
    branches = mcp.call('list_branches', {'owner': owner, 'repo': repo})
    if f'"{branch}"' not in branches and branch not in branches:
        out = mcp.call('create_branch', {
            'owner': owner, 'repo': repo, 'branch': branch, 'from_branch': 'main',
        })
        print('[push-branch] 创建分支:', out[:160])

    def push(batch, msg):
        return mcp.call('push_files', {
            'owner': owner, 'repo': repo, 'branch': branch,
            'files': batch, 'message': msg,
        })

    t0 = time.time()
    try:
        out = push(files, message) if files else ''
        print(f'[push-branch] 全量写入 OK ({time.time() - t0:.1f}s):', out[:200])
    except Exception as e:
        print('[push-branch] 全量失败，改为分批:', str(e)[:200])
        batches, cur, tot = [], [], 0
        for f in files:
            b = len(f['content'].encode('utf-8'))
            if cur and tot + b > MAX_BATCH_BYTES:
                batches.append(cur)
                cur, tot = [], 0
            cur.append(f)
            tot += b
        if cur:
            batches.append(cur)
        for i, batch in enumerate(batches, 1):
            out = push(batch, f'{message}\n\n[part {i}/{len(batches)}]')
            print(f'  part {i}/{len(batches)} ({len(batch)} 文件):', out[:120])

    del_msg = 'chore: 清理已删除文件（协同推送同步删除）'
    for path in dels:
        try:
            mcp.call('delete_file', {
                'owner': owner, 'repo': repo, 'path': path,
                'branch': branch, 'message': del_msg,
            })
            print('[push-branch] 删除', path)
        except Exception as e:
            print('[push-branch] 删除失败(可能已不存在):', path, str(e)[:120])

    # ── 每次推送后刷新固定页面（GitHub Pages） ─────────────────────────────
    # 2026-11-10 用户约定：推代码 = 页面同步更新，不用再单独说「发个链接」。
    # 复用 publish-pages.py 的 MCP 网关通道把本地 dist/ 推到 preview 分支；
    # 失败只告警、绝不阻断推送结果（Pages 构建由 GitHub 侧完成）。
    if not args.no_pages:
        pages = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'publish-pages.py')
        try:
            r = subprocess.run(
                [sys.executable, pages], cwd=ROOT, text=True,
                capture_output=True, timeout=360,
            )
            if r.returncode == 0:
                for line in r.stdout.splitlines():
                    if '写入 OK' in line or '删除旧文件' in line:
                        print('[push-branch][pages]', line.strip())
                print('[push-branch][pages] 固定页面已更新: '
                      f'https://{owner}.github.io/{repo}/')
            else:
                print('[push-branch][pages] 页面更新失败（不阻断推送）:',
                      (r.stderr or r.stdout).strip()[:300])
        except Exception as e:
            print('[push-branch][pages] 页面更新异常（不阻断推送）:', str(e)[:200])

    # 发布后线上生效核验（可选）。ship.sh 末尾已有 check-online.py 兜底，
    # 但「推分支 → 自动 publish-pages」这条新链路之前没有；Pages 构建 abandoned
    # 或 CDN 缓存 10 分钟时，preview 已是新版而线上仍是旧包（risk-review §v9s.55）。
    # 默认不跑、不拖慢推送；--pages-wait N 显式开启，失败只提示不改退出码。
    if not args.no_pages and args.pages_wait > 0:
        online = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'check-online.py')
        try:
            v = subprocess.run(
                [sys.executable, online, '--wait', str(args.pages_wait), '--repo', args.repo],
                cwd=ROOT, text=True, capture_output=True,
                timeout=args.pages_wait + 180,
            )
            tail = (v.stdout or v.stderr).strip().splitlines()
            print('[push-branch][pages] 线上核验:',
                  (tail[-1] if tail else '（无输出）')[:200])
        except Exception as e:
            print('[push-branch][pages] 线上核验异常（不阻断推送）:', str(e)[:150])

    print('\n[push-branch] 完成。请执行：')
    print(f'  git fetch origin {branch}')
    print(f'  git diff --stat HEAD origin/{branch}     # 应为空（树一致）')
    print(f'  git reset --hard origin/{branch}         # 本地与远端对齐')
    if not args.no_pages:
        print('  python3 tools/check-online.py --wait 180   # 确认线上产物 == 本地 dist')
    print(f'  https://github.com/{args.repo}/tree/{branch}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
