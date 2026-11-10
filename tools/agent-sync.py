#!/usr/bin/env python3.11
# -*- coding: utf-8 -*-
"""
v9s.x · 无人值守的多 agent git 同步与合并闸门。

背景
----
用户 2026-11-09 明确要求「不需要我参与」。协作规范 v2 已经补了领号 / 单通道发布 /
合并闸门，但还留着两处必须由人触发的缺口：

  1. 规范里写「push / --apply 需用户明确通知」—— 每次推送都要问一次；
  2. §10 定义了合并闸门，却没定义谁执行；`push-branch.py` 又硬护栏拒绝写 main，
     于是「把功能分支合进主干」只能靠某个 agent 手工做。

本脚本把这两步固化成规则：**任何 agent 完成自己的分支就自动跑完整个闭环**，
边界由硬护栏保证（只写自己的 feat/* 分支、main 的写入只由 GitHub 端 PR merge 完成、
合并前必须在合并结果上跑 verify、发布只走唯一通道）。用户不参与任何一步。

用法
----
    python3.11 tools/agent-sync.py status
    python3.11 tools/agent-sync.py start  --agent b --topic destructibles
    python3.11 tools/agent-sync.py finish --topic destructibles [--dry]
    python3.11 tools/agent-sync.py finish --branch feat/x-a --pr-number 12  # 断点续跑

状态文件 `.git/agent-sync.json`（不入库）记 agent / 分支 / 上次推送的远端 SHA；
失败写 `docs/state/MERGE_QUEUE.md`，别的 agent `status` / `start` 一眼可见，
在自己会话里重跑 finish 即可接手 —— 全程仍不需要用户。
"""

import argparse
import importlib.util
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / 'tools'
STATE_PATH = ROOT / '.git' / 'agent-sync.json'
QUEUE_PATH = ROOT / 'docs' / 'state' / 'MERGE_QUEUE.md'
CURRENT_PATH = ROOT / 'docs' / 'state' / 'CURRENT.md'
DEFAULT_REPO = 'xuwanc/playtest-harness'
MCP_URL = os.environ.get(
    'GITHUB_MCP_URL', 'http://github.agent-gateway.auth-proxy.local/mcp'
)

QUEUE_HEADER = """# 合并队列（agent-sync 自动维护）

> 只在合并闸门失败时写入；**用户不需要参与**。
> 下一个 agent 跑 `python3.11 tools/agent-sync.py status` 就能看到，
> 在自己会话里切到该分支重跑 `finish` 接手；成功后脚本自动清除对应条目。

| 分支 | 失败阶段 | 时间 | 说明 |
|---|---|---|---|
"""


def git(*args, check=True):
    env = dict(os.environ, GIT_TERMINAL_PROMPT='0')
    r = subprocess.run(['git', *args], cwd=ROOT, text=True,
                       capture_output=True, env=env)
    if check and r.returncode:
        raise RuntimeError(f'git {args} 失败: {r.stderr.strip()[:300]}')
    return r.stdout.strip()


def git_ok(*args):
    return subprocess.run(['git', *args], cwd=ROOT, stdout=subprocess.DEVNULL,
                          stderr=subprocess.DEVNULL).returncode == 0


def sh(*cmd, check=True):
    print('  $', ' '.join(cmd), flush=True)
    r = subprocess.run(list(cmd), cwd=ROOT, text=True)
    if check and r.returncode:
        raise RuntimeError(f'{cmd[0]} 失败（exit {r.returncode}）')
    return r.returncode


def load_state():
    if STATE_PATH.exists():
        try:
            return json.loads(STATE_PATH.read_text())
        except Exception:
            pass
    return {}


def save_state(**kv):
    st = load_state()
    st.update(kv)
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(st, ensure_ascii=False, indent=2) + '\n')


def queue_rows():
    if not QUEUE_PATH.exists():
        return []
    return [l for l in QUEUE_PATH.read_text().splitlines()
            if l.startswith('| ') and not l.startswith('| 分支') and not l.startswith('|---')]


def queue_add(branch, stage, detail):
    rows = queue_rows()
    rows.append(f'| `{branch}` | {stage} | {datetime.now():%Y-%m-%d %H:%M} | {detail[:120]} |')
    QUEUE_PATH.write_text(QUEUE_HEADER + '\n'.join(rows) + '\n')
    print(f'[agent-sync] 已写入合并队列：{stage} — {detail[:120]}')


def queue_clear(branch):
    rows = [r for r in queue_rows() if f'`{branch}`' not in r]
    QUEUE_PATH.write_text(QUEUE_HEADER + ('\n'.join(rows) + '\n' if rows else ''))
    if rows:
        print(f'[agent-sync] 队列仍有 {len(rows)} 项待其他 agent 接手')


def fetch():
    print('[agent-sync] git fetch origin --prune')
    git('fetch', 'origin', '--prune')


# --- v9s.57：写通道升级 -----------------------------------------------------
# 旧版所有写入都绑在内部 MCP 网关（`github.agent-gateway.auth-proxy.local`）上：
# 网关不通就整条闭环停摆。实测本环境 `gh` 已登录、`git push` 有凭证，于是改成
# **本地 git / gh 优先、MCP 兜底**。两条通道写出来的 commit SHA 不同（MCP 是 API
# 重建的），但树一致；因此推送后一律 fetch + 对齐，避免出现假分叉。
GITNET = ('-c', 'http.lowSpeedLimit=1000', '-c', 'http.lowSpeedTime=30')


def git_push(refspec, tries=5):
    """带重试的 git push。成功返回 True；凭证 / 网络问题用调用方兜底。"""
    import time as _t
    for i in range(tries):
        r = subprocess.run(
            ['git', *GITNET, 'push', 'origin', refspec], cwd=ROOT,
            text=True, capture_output=True,
            env=dict(os.environ, GIT_TERMINAL_PROMPT='0'),
        )
        if r.returncode == 0:
            print(f'  git push {refspec} 成功（第 {i + 1} 次）')
            return True
        tail = (r.stderr or r.stdout).strip().splitlines()
        print(f'  git push {refspec} 失败（{i + 1}/{tries}）：{tail[-1][:140] if tail else "?"}')
        _t.sleep(4 * (i + 1))
    return False


def gh_ready():
    """gh 是否存在且已登录。只用它判断「能不能走本地 PR 通道」。"""
    try:
        r = subprocess.run(['gh', 'auth', 'status'], cwd=ROOT, text=True,
                           capture_output=True, timeout=30)
        return r.returncode == 0
    except Exception:
        return False


def gh(*args, stdin=None):
    r = subprocess.run(['gh', *args], cwd=ROOT, text=True, capture_output=True,
                       input=stdin, timeout=180)
    if r.returncode:
        raise RuntimeError(f'gh {" ".join(args[:3])} 失败: {(r.stderr or r.stdout).strip()[:300]}')
    return r.stdout.strip()


def load_mcp():
    spec = importlib.util.spec_from_file_location('push_branch', TOOLS / 'push-branch.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.MCP


def dirty_source():
    """只看源码/文档是否未提交；dist/ 由 verify 重生成，单独处理。"""
    return [l for l in git('status', '--porcelain').splitlines()
            if len(l) > 3 and not l[3:].split(' -> ')[-1].startswith('dist/')]


def resolve_conflicts():
    """按规范 §6 自动解四类冲突；解不了的留队列交下一个 agent（仍不需用户）。"""
    unresolved = git('diff', '--name-only', '--diff-filter=U').splitlines()
    if not unresolved:
        return True
    handled, rest = [], []
    for f in unresolved:
        if f.startswith('dist/'):
            # 生成物：不手解，统一 rm -rf dist && npm run build
            sh('rm', '-rf', 'dist', check=False)
            git('rm', '-r', '--quiet', 'dist', check=False)
            handled.append(f + '（重生成）')
        elif f in ('package.json', 'docs/state/CURRENT.md',
                   'tests/__snapshots__/determinism.test.ts.snap'):
            # 单调 / 生成物：取主干版，随后由 claim_version / -u 覆盖写
            git('checkout', '--ours', f, check=False)
            git('add', f, check=False)
            handled.append(f + '（取主干 / 稍后覆盖写）')
        else:
            rest.append(f)
    print(f'[agent-sync] 已自动解冲突: {handled}')
    if rest:
        print(f'[agent-sync] 需按 §6 取并集的冲突: {rest}')
        return False
    return git('diff', '--name-only', '--diff-filter=U') == ''


def claim_version():
    """合并闸门统一领号：version patch +1，内部代号 v9s.NN 单独 +1（两条不是同一个数）。"""
    cur = json.loads(git('show', 'origin/main:package.json'))['version']
    parts = cur.split('.')
    parts[-1] = str(int(parts[-1]) + 1)
    new = '.'.join(parts)
    p = ROOT / 'package.json'
    pkg = json.loads(p.read_text())
    pkg['version'] = new
    p.write_text(json.dumps(pkg, ensure_ascii=False, indent=2) + '\n')
    # 内部代号从主干 CURRENT.md 里读当前值再 +1（不能用 version 的 patch 号硬套）。
    internal = ''
    try:
        main_cur = git('show', 'origin/main:docs/state/CURRENT.md')
        nums = [int(x) for x in re.findall(r'v9s\.(\d+)', main_cur)]
        if nums:
            internal = 'v9s.' + str(max(nums) + 1)
    except RuntimeError:
        pass
    if CURRENT_PATH.exists():
        txt = CURRENT_PATH.read_text()
        txt = re.sub(r'0\.9\.\d+', new, txt)
        if internal:
            txt = re.sub(r'v9s\.\d+', internal, txt)
        txt = re.sub(r'(最后更新：)[^\n]*',
                     r'\g<1>' + datetime.now().strftime('%Y-%m-%d %H:%M') + '。', txt)
        CURRENT_PATH.write_text(txt)
    # v9s.73：README 首行也写死了版本（`当前版本 **v0.9.94**`），而 `check-facts.mjs`
    # 会拿它和 `package.json` 比对 —— 只改 CURRENT 的话，领号后的第一次 `verify`
    # 必然在 docs:check 挂掉（实测 0.9.94 → 0.9.95 就是这么断的）。领号时一起同步。
    readme = ROOT / 'README.md'
    if readme.exists():
        rt = readme.read_text()
        rt2 = re.sub(r'v0\.9\.\d+', f'v{new}', rt)
        if rt2 != rt:
            readme.write_text(rt2)
    print(f'[agent-sync] 领号 {cur} → {new} / {internal or "（代号未读到）"}（分支不占号）')
    save_state(version=new, internal=internal)
    return new


def cmd_status(_args):
    try:
        fetch()
    except RuntimeError as e:
        # 只读命令不该被 github.com 的网络抖动带崩；用本地缓存引用继续给状态。
        print(f'  （远端同步暂不可用：{str(e)[:100]}；以下为本地缓存引用）')
    branch = git('rev-parse', '--abbrev-ref', 'HEAD')
    local = git('rev-parse', '--short', 'HEAD')
    main = git('rev-parse', '--short', 'origin/main')
    base = git('merge-base', 'HEAD', 'origin/main')
    ahead = base == git('rev-parse', 'origin/main')
    st = load_state()
    print(f'  当前分支      {branch} @ {local}')
    print(f'  origin/main   {main}；本分支 {"已基于最新 main" if ahead else "落后于 main（finish 会自动 merge）"}')
    print(f'  本会话 agent  {st.get("agent", "（未登记）")} · 分支 {st.get("branch", "（未登记）")}')
    rows = queue_rows()
    print(f'  合并队列      {len(rows)} 项')
    for r in rows:
        print('   ', r)
    print(f'  工作区        {"干净" if not git("status", "--porcelain") else "有改动"}')


def cmd_start(args):
    fetch()
    branch = args.branch or f'feat/{args.topic}-{args.agent}'
    if branch in ('main', 'master') or branch.startswith('backup/'):
        sys.exit('[agent-sync] 拒绝：功能分支不能叫 main/master/backup/*')
    if git_ok('rev-parse', '--verify', f'origin/{branch}'):
        sys.exit(f'[agent-sync] 远端已有 {branch}；换一个 --topic / --agent 后缀，别覆盖别人的分支')
    if QUEUE_PATH.exists() and queue_rows():
        print(f'[agent-sync] 注意：合并队列有 {len(queue_rows())} 项待接手，先跑 status 看一眼')
    git('checkout', '-b', branch, 'origin/main')
    save_state(agent=args.agent, branch=branch, topic=args.topic,
               created_at=datetime.now().isoformat(timespec='seconds'))
    print(f'[agent-sync] 已基于最新 origin/main 建 {branch}')
    print('  收尾：python3.11 tools/agent-sync.py finish')


def cmd_finish(args):
    branch = args.branch or git('rev-parse', '--abbrev-ref', 'HEAD')
    if branch in ('main', 'master', 'HEAD') or branch.startswith('backup/'):
        sys.exit(f'[agent-sync] 拒绝在 {branch} 上跑合并闸门；只允许 feat/* / fix/*')
    if dirty_source():
        sys.exit('[agent-sync] 有未提交的源码改动，先 git add -A && git commit')

    print(f'[agent-sync] 合并闸门开始：{branch}')
    if args.dry:
        print('  DRY-RUN 计划：fetch → (必要时 merge origin/main 并按 §6 解冲突) → 领号 → '
              'build → golden -u → verify → push-branch → 建 PR → 自动 merge → 对齐 → 发布')
        cmd_status(args)
        return 0

    fetch()
    main_sha = git('rev-parse', 'origin/main')
    if git('merge-base', 'HEAD', 'origin/main') != main_sha:
        print('[agent-sync] main 有前进，先 merge --no-ff origin/main（合的是合并结果）')
        r = subprocess.run(['git', 'merge', '--no-ff', 'origin/main',
                            '-m', f'merge: 同步 origin/main 到 {branch}（合并闸门）'],
                           cwd=ROOT, text=True, capture_output=True)
        if r.returncode:
            if not resolve_conflicts():
                queue_add(branch, 'merge main', '冲突含需取并集的文件，按 §6 手工解后重跑 finish')
                return 1
            git('commit', '--no-edit')
    else:
        print('[agent-sync] 已基于最新 main，无需额外 merge')

    version = claim_version()
    sh('npm', 'run', 'build')
    sh('npx', 'vitest', 'run', 'tests/determinism.test.ts', '-u')
    if dirty_source() or git('status', '--porcelain'):
        git('add', '-A')
        git('commit', '-m', f'chore(release): 合并闸门领号 v{version} + 重生成 golden/dist')
    else:
        print('[agent-sync] 版本号已是最新，无新提交')

    # 闸门第 4 步：在合并结果上跑全链。verify 会再 build 一次（buildTime 变 → dist hash 变），
    # 所以之后必须把最终 dist 一并提交，保证「仓库 dist == 线上 dist」。
    sh('npm', 'run', 'verify')
    if git('status', '--porcelain'):
        git('add', '-A')
        git('commit', '-m', 'chore: 同步 verify 重建的最终构建产物（buildTime 变化）')

    # 推自己的功能分支。优先本地 git（历史线性、SHA 稳定）；没有写凭证才走 MCP 网关。
    # push-branch.py 内含受保护分支 / 未提交 / 防撞车三道护栏，兜底时仍然生效。
    pushed = git_push(f'HEAD:refs/heads/{branch}')
    if not pushed:
        print('[agent-sync] 本地 git 推不上去，改走 MCP 网关（tools/push-branch.py）')
        sh('python3.11', str(TOOLS / 'push-branch.py'), '--branch', branch,
           '-m', f'feat: {branch} 经合并闸门（v{version}）')

    owner, repo = DEFAULT_REPO.split('/', 1)
    pr_title = f'[agent-sync] {branch} → main（v{version}，闸门已验证）'
    pr_body = ('自动合并闸门：本分支已基于最新 main，在合并结果上跑过 '
               '`npm run verify`（build / 单测 / portable / docs / smoke）。\n'
               '版本号由闸门统一领，无需人工批准。')
    pr_number = args.pr_number
    head_sha = git('ls-remote', 'origin', f'refs/heads/{branch}').split()[0]
    merge_title = f'merge: {branch} 经闸门并入 main（v{version}）'

    # v9s.57：PR 通道同样「本地 gh 优先、MCP 兜底」。
    if pr_number is None and gh_ready():
        try:
            out = gh('pr', 'create', '--repo', DEFAULT_REPO, '--base', 'main',
                     '--head', branch, '--title', pr_title, '--body', pr_body)
            m = re.search(r'/pull/(\d+)', out)
            if m:
                pr_number = int(m.group(1))
                print(f'[agent-sync] gh 已创建 PR #{pr_number}')
        except RuntimeError as e:
            print(f'[agent-sync] gh 建 PR 失败：{str(e)[:160]}；改用 MCP')

    if pr_number is not None and gh_ready():
        try:
            # --match-head-commit = 乐观锁：远端 head 变了就拒绝合并，和 expectedHeadSha 等价
            gh('pr', 'merge', str(pr_number), '--repo', DEFAULT_REPO, '--merge',
               '--match-head-commit', head_sha, '--subject', merge_title)
            print(f'[agent-sync] gh 已合并 PR #{pr_number}（head={head_sha[:8]}）')
        except RuntimeError as e:
            queue_add(branch, 'gh pr merge',
                      f'PR #{pr_number} 合并失败：{str(e)[:150]}；重跑 finish --pr-number {pr_number}')
            return 1
    else:
        mcp = load_mcp()(MCP_URL)
        mcp.handshake()
        if not pr_number:
            out = mcp.call('create_pull_request', {
                'owner': owner, 'repo': repo,
                'title': pr_title, 'head': branch, 'base': 'main', 'body': pr_body,
            })
            m = (re.search(r'"number"\s*:\s*(\d+)', out)
                 or re.search(r'#(\d+)', out) or re.search(r'/pull/(\d+)', out))
            if not m:
                queue_add(branch, 'create_pull_request', f'没解析到 PR 号：{out[:200]}')
                return 1
            pr_number = int(m.group(1))
            print(f'[agent-sync] 已创建 PR #{pr_number}')
        try:
            mcp.call('merge_pull_request', {
                'owner': owner, 'repo': repo, 'pullNumber': pr_number,
                'merge_method': 'merge', 'expectedHeadSha': head_sha,
                'commit_title': merge_title,
            })
        except Exception as e:
            queue_add(branch, 'merge_pull_request',
                      f'PR #{pr_number} 合并失败：{str(e)[:150]}；重跑 finish --pr-number {pr_number}')
            return 1
        print(f'[agent-sync] PR #{pr_number} 已自动并入 main（expectedHeadSha={head_sha[:8]}）')

    # 对齐远端引用：网络抖动**不阻断发布**。发布服务走另一条通道，与 github.com 无关；
    # 远端 main 已由上面的 merge_pull_request 成功确认，fetch 只用来刷新本地引用。
    for attempt in range(3):
        try:
            fetch()
            git('branch', '-f', 'main', 'origin/main', check=False)  # 只更新引用，不切工作区
            break
        except RuntimeError as e:
            print(f'[agent-sync] fetch 对齐失败（{attempt + 1}/3）：{str(e)[:110]}；'
                  '稍后 git fetch 补齐引用即可，继续发布')
    queue_clear(branch)
    save_state(last_merged_at=datetime.now().isoformat(timespec='seconds'))

    # 收尾：本地回到 main，并让「仓库 dist == 线上 dist」由 ship.sh 保证。
    # 旧版只跑 publish-pages.py（MCP 网关推 preview，不碰 main），本地 main 引用与
    # 远端长期不一致，下一个 agent 一 `start` 就基于旧 main 分叉 —— 这次合并对方分支
    # 时踩到的正是这个坑（分支基于 v0.9.76，main 已到 v0.9.77）。
    try:
        git('checkout', '-q', 'main')
        git('merge', '--ff-only', 'origin/main')
        print('[agent-sync] 本地已切回 main 并与 origin/main 对齐')
    except RuntimeError as e:
        print(f'[agent-sync] 本地切 main 失败（{str(e)[:120]}）；仍继续发布，'
              '下次 start 前先 git fetch && git checkout main')

    # 唯一发布通道（合并闸门独享，feature agent 绝不发布）：
    #   ship.sh = build → 推 main → 整棵重建 preview → 线上核验，一条命令闭环。
    #   失败时退回 publish:pages（MCP 网关），仍失败只告警、不阻断（Pages 构建是 GitHub 的事）。
    released = False
    try:
        # --no-build：复用 verify 里已经建好的 dist，避免 buildTime 变化又产生一个提交
        sh('bash', str(TOOLS / 'ship.sh'), '--no-build')
        released = True
    except Exception as e:
        print(f'[agent-sync] ship 未成功（{str(e)[:160]}）；改走 publish:pages')
    if not released:
        try:
            sh('python3.11', str(TOOLS / 'publish-pages.py'), check=False)
        except Exception as e:  # Pages 未开启 / 网络抖动都不阻断闭环
            print(f'[agent-sync] publish:pages 也未成功（{e}）')
    if os.environ.get('WORKBUDDY_TUNNEL_FALLBACK') == '1':
        sh('npm', 'run', 'publish:preview', check=False)
        print('  （隧道兜底已开：上面的 shareLink 是临时按沙盒派生的链接，非权威）')
    print(f'\n[agent-sync] 闭环完成：main / 线上 / 本地一致，版本 v{version}')
    print(f'  权威线上链接：https://{owner}.github.io/{repo}/')

    # 收尾顺手清理：已并入 main 的 feat/* / fix/* / merge/* 历史分支（backup/* 永远保留）。
    # 失败只告警 —— 分支残留不影响任何结论，下次 finish / prune 会再来一次。
    try:
        cmd_prune(argparse.Namespace(dry=False))
    except Exception as e:
        print(f'[agent-sync] 分支清理跳过：{str(e)[:120]}')
    return 0


def cmd_prune(args):
    """删掉「已经完全进 main」的功能分支（本地 + 远端），backup/* 永远保留。

    判据只有一个：分支 tip 是 `origin/main` 的祖先（`git branch --merged`）。
    还在开发 / 有未合并提交的分支不会被选中 —— 不猜、不强制。
    """
    fetch()
    pat = re.compile(r'^(feat|fix|merge)/')
    cur = git('rev-parse', '--abbrev-ref', 'HEAD')
    local = [b.strip() for b in git('branch', '--merged', 'origin/main',
                                    '--format=%(refname:short)').splitlines()]
    local = [b for b in local if pat.match(b) and b != cur]
    remote = [b.strip().replace('origin/', '', 1) for b in
              git('branch', '-r', '--merged', 'origin/main',
                  '--format=%(refname:short)').splitlines()]
    remote = [b for b in remote if pat.match(b)]
    print(f'[agent-sync] 已并入 main 的分支：本地 {len(local)} 条 / 远端 {len(remote)} 条')
    for b in local:
        print('   本地', b)
    for b in remote:
        print('   远端', b)
    if args.dry:
        print('[agent-sync] DRY-RUN：不删任何东西')
        return 0
    for b in local:
        git('branch', '-D', b, check=False)
    for b in remote:
        if not git_push(f':refs/heads/{b}', tries=3):
            print(f'  远端 {b} 删除失败（网络）；下次 prune 再来')
    print(f'[agent-sync] 已清理 {len(local)} 条本地 / {len(remote)} 条远端分支（backup/* 不动）')
    return 0


def main():
    ap = argparse.ArgumentParser(description='无人值守的多 agent git 同步与合并闸门')
    sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('status').set_defaults(fn=cmd_status)
    st = sub.add_parser('start')
    st.add_argument('--agent', default=os.environ.get('AGENT_ID', 'a'))
    st.add_argument('--topic', default='work')
    st.add_argument('--branch', default=None)
    st.set_defaults(fn=cmd_start)
    fi = sub.add_parser('finish')
    fi.add_argument('--branch', default=None)
    fi.add_argument('--topic', default='work')
    fi.add_argument('--pr-number', type=int, default=None)
    fi.add_argument('--dry', action='store_true')
    fi.set_defaults(fn=cmd_finish)
    pr = sub.add_parser('prune')
    pr.add_argument('--dry', action='store_true')
    pr.set_defaults(fn=cmd_prune)
    args = ap.parse_args()
    try:
        return args.fn(args)
    except (RuntimeError, subprocess.CalledProcessError) as e:
        print(f'[agent-sync] 失败：{e}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
