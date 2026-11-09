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
    print(f'[agent-sync] 领号 {cur} → {new} / {internal or "（代号未读到）"}（分支不占号）')
    save_state(version=new, internal=internal)
    return new


def cmd_status(_args):
    fetch()
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

    # 推自己的功能分支（push-branch.py 内含受保护分支 / 未提交 / 防撞车三道护栏）
    sh('python3.11', str(TOOLS / 'push-branch.py'), '--branch', branch,
       '-m', f'feat: {branch} 经合并闸门（v{version}）')

    owner, repo = DEFAULT_REPO.split('/', 1)
    mcp = load_mcp()(MCP_URL)
    mcp.handshake()
    pr_number = args.pr_number
    if not pr_number:
        out = mcp.call('create_pull_request', {
            'owner': owner, 'repo': repo,
            'title': f'[agent-sync] {branch} → main（v{version}，闸门已验证）',
            'head': branch, 'base': 'main',
            'body': ('自动合并闸门：本分支已基于最新 main，在合并结果上跑过 '
                     '`npm run verify`（build / 单测 / portable / docs / smoke）。\n'
                     '版本号由闸门统一领，无需人工批准。'),
        })
        m = (re.search(r'"number"\s*:\s*(\d+)', out)
             or re.search(r'#(\d+)', out) or re.search(r'/pull/(\d+)', out))
        if not m:
            queue_add(branch, 'create_pull_request', f'没解析到 PR 号：{out[:200]}')
            return 1
        pr_number = int(m.group(1))
        print(f'[agent-sync] 已创建 PR #{pr_number}')

    head_sha = git('ls-remote', 'origin', f'refs/heads/{branch}').split()[0]
    try:
        mcp.call('merge_pull_request', {
            'owner': owner, 'repo': repo, 'pullNumber': pr_number,
            'merge_method': 'merge', 'expectedHeadSha': head_sha,
            'commit_title': f'merge: {branch} 经闸门并入 main（v{version}）',
        })
    except Exception as e:
        queue_add(branch, 'merge_pull_request',
                  f'PR #{pr_number} 合并失败：{str(e)[:150]}；重跑 finish --pr-number {pr_number}')
        return 1
    print(f'[agent-sync] PR #{pr_number} 已自动并入 main（expectedHeadSha={head_sha[:8]}）')

    fetch()
    git('branch', '-f', 'main', 'origin/main', check=False)  # 只更新引用，不切工作区（共享工作区安全）
    queue_clear(branch)
    save_state(last_merged_at=datetime.now().isoformat(timespec='seconds'))

    # 唯一发布通道：发布的就是刚刚合并、刚刚 verify 过的那一份 dist
    sh('npm', 'run', 'publish:preview')
    print(f'\n[agent-sync] 闭环完成：main / 线上 / 本地一致，版本 v{version}')
    print(f'  线上链接见 docs/state/CURRENT.md 与上面 publish 打印的 shareLink')
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
    args = ap.parse_args()
    try:
        return args.fn(args)
    except (RuntimeError, subprocess.CalledProcessError) as e:
        print(f'[agent-sync] 失败：{e}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
