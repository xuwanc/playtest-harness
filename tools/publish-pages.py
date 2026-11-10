#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
v9s.x · 唯一线上链接（共享静态托管通道）。

为什么需要它
------------
`tools/publish-preview.mjs` 走的是「站点」skill 的 *实时隧道*：把**本沙盒正在跑的进程**
通过 auth-proxy 暴露成一个子域名 `a<md5(runtimeId)>.app.workbuddy.host`。站点名由沙盒
runtimeId 派生，所以**两个沙盒必然得到两条不同的隧道**，且沙盒休眠后隧道即断。
这正是「多 agent 各发各的、链接对不上」的根因——不是记错，是根本没有「按仓库共享」的站点。

本脚本改走 **GitHub Pages**：把 `dist/` 整体推到仓库的 `preview` 分支。分支里的文件由
GitHub 的静态托管服务，URL 完全由仓库身份决定（`https://<user>.github.io/<repo>/`），
**与任何沙盒无关**：哪个 agent 发、发几次，都是同一个站点、同一条链接，且沙盒休眠不影响。

前置（一次性，用户做）：仓库 Settings → Pages → Build from a branch → 选 `preview` / `/(root)`。
开启后本脚本产出的就是稳定统一链接；在此之前脚本仍会正常把 dist 推到 preview 分支（只是还没站点）。

用法
----
    python3.11 tools/publish-pages.py            # 部署 dist/ → preview 分支
    python3.11 tools/publish-pages.py --dry      # 只打印计划
    python3.11 tools/publish-pages.py --repo owner/repo

实现：复用 push-branch.py 的 GitHub MCP 网关通道（已授权的 github connector）。
"""

import argparse
import importlib.util
import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')

# push-branch.py 文件名带连字符，不能当模块 import；用 importlib 动态加载复用其 MCP 通道。
_spec = importlib.util.spec_from_file_location('push_branch', os.path.join(TOOLS, 'push-branch.py'))
_pb = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_pb)
MCP, MCP_URL, DEFAULT_REPO = _pb.MCP, _pb.MCP_URL, _pb.DEFAULT_REPO

DIST = os.path.join(ROOT, 'dist')
PREVIEW_BRANCH = 'preview'
MANIFEST = '.preview-files.txt'  # preview 分支根目录的发布清单（记录用；删旧改为列目录）


def collect_dist():
    files = []
    for cur, _dirs, names in os.walk(DIST):
        for n in names:
            full = os.path.join(cur, n)
            rel = os.path.relpath(full, DIST).replace(os.sep, '/')
            with open(full, 'rb') as f:
                raw = f.read()
            try:
                content = raw.decode('utf-8')
            except UnicodeDecodeError:
                raise RuntimeError(f'非 UTF-8 文件，文本 API 无法搬运: {rel}')
            files.append({'path': rel, 'content': content})
    # Pages 默认会跑 Jekyll，遇到 _ 前缀目录会忽略；Vite 产物一般没有，但加 .nojekyll 最稳。
    if not any(f['path'] == '.nojekyll' for f in files):
        files.append({'path': '.nojekyll', 'content': ''})
    return files


def list_preview_files(mcp, owner, repo, branch):
    """列出分支上所有文件路径（get_file_contents 的**目录**模式返回 JSON 数组）。

    不能用它读单个文本文件：该 MCP 工具对文件返回的是「successfully downloaded
    text file (SHA: ...)」状态串而非内容，旧版靠 .preview-files.txt 清单做增量
    清理因此永远拿到空集合，旧哈希产物一直堆积。改成列目录后，即使历史分支
    根本没写过清单，也能自愈清理干净。
    """
    out = []
    todo = ['']
    seen = set()
    while todo:
        d = todo.pop()
        if d in seen:
            continue
        seen.add(d)
        try:
            items = json.loads(mcp.call('get_file_contents', {
                'owner': owner, 'repo': repo, 'path': d, 'ref': branch,
            }))
        except Exception as e:
            # 列目录失败宁可跳过清理，也不能静默：否则旧产物会无声堆积
            print(f'[publish-pages] 列目录失败（跳过清理）: {d!r} {str(e)[:120]}')
            continue
        for it in items:
            p = it.get('path') or ''
            if it.get('type') == 'dir':
                todo.append(p)
            elif it.get('type') == 'file':
                out.append(p)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default=DEFAULT_REPO)
    ap.add_argument('--branch', default=PREVIEW_BRANCH)
    ap.add_argument('--dry', action='store_true')
    args = ap.parse_args()

    # 护栏：本脚本会「先列目录删旧、再整批写 dist」，一旦目标分支传错成 main /
    # feat/*，等于把源码分支清成只有构建产物。--branch 只为自定义 Pages 分支留的口子，
    # 绝不能指向源码分支（2026-11-10 补）。
    if args.branch in {'main', 'master', 'HEAD'} or args.branch.startswith(('feat/', 'fix/', 'backup/')):
        sys.exit(f'[publish-pages] 拒绝写入源码分支 "{args.branch}"：'
                 'Pages 产物只能发到 preview / gh-pages 之类的产物分支')

    if not os.path.isdir(DIST) or not os.path.exists(os.path.join(DIST, 'index.html')):
        sys.exit('[publish-pages] dist/index.html 不存在：先 npm run build')

    owner, repo = args.repo.split('/', 1)
    files = collect_dist()
    paths = {f['path'] for f in files}
    size = sum(len(f['content'].encode('utf-8')) for f in files)

    print(f'[publish-pages] 仓库 {args.repo} · 分支 {args.branch} · 预览站点 '
          f'https://{owner}.github.io/{repo}/')
    print(f'[publish-pages] 待发布 {len(files)} 文件，{size:,} 字节')
    if args.dry:
        for f in files[:20]:
            print('  ', f['path'])
        print('[publish-pages] DRY-RUN，未写远端。')
        return 0

    mcp = MCP(MCP_URL)
    print('[publish-pages] MCP 会话', mcp.handshake())

    # 分支不存在时基于 main 创建（Pages 需要在该分支开启，这里只负责填充内容）
    branches = mcp.call('list_branches', {'owner': owner, 'repo': repo})
    if f'"{args.branch}"' not in branches and args.branch not in branches:
        out = mcp.call('create_branch', {
            'owner': owner, 'repo': repo, 'branch': args.branch, 'from_branch': 'main',
        })
        print('[publish-pages] 创建分支:', out[:160])

    # 删旧：分支上现有文件里、本次产物没有的，删掉（哈希重命名后不留孤儿）。
    # 直接列目录，不再依赖可能缺失 / 读不出内容的 .preview-files.txt 清单。
    old = set(list_preview_files(mcp, owner, repo, args.branch))
    stale = sorted(old - paths - {MANIFEST})
    for p in stale:
        try:
            mcp.call('delete_file', {
                'owner': owner, 'repo': repo, 'path': p,
                'branch': args.branch,
                'message': 'chore(preview): 清理已删除的构建产物',
            })
            print('[publish-pages] 删除旧文件', p)
        except Exception as e:
            print('[publish-pages] 删除失败(可能已不存在):', p, str(e)[:100])

    # 写入本次全部文件 + 更新清单
    batch = files + [{'path': MANIFEST, 'content': '\n'.join(sorted(paths)) + '\n'}]
    t0 = time.time()
    out = mcp.call('push_files', {
        'owner': owner, 'repo': repo, 'branch': args.branch,
        'files': batch, 'message': 'deploy: 静态预览（dist）',
    })
    print(f'[publish-pages] 写入 OK ({time.time() - t0:.1f}s):', out[:200])

    print('\n[publish-pages] 完成。若已开启 Pages，稳定统一链接为：')
    print(f'  https://{owner}.github.io/{repo}/          （index.html）')
    print('若尚未开启 Pages：仓库 Settings → Pages → Build from a branch → '
          f'选 `{args.branch}` / `/(root)`，约 1 分钟生效。')
    return 0


if __name__ == '__main__':
    sys.exit(main())
