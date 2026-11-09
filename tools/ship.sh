#!/usr/bin/env bash
# 一条命令发布到「唯一固定链接」。
#
#   bash tools/ship.sh              # 构建 + 推送 main + 重建 preview（Pages 产物）
#   bash tools/ship.sh --no-build   # 复用现有 dist/
#
# 为什么需要它：线上地址有两个来源——
#   ① GitHub Pages（按仓库身份定址，https://<user>.github.io/<repo>/，永不变）← 对外只发这一条
#   ② 沙盒隧道（按 runtimeId 定址，a<md5>.app.workbuddy.host，每次重建都变）← 只给自己临时调试
# 以前每条链接都要手工搬运，根因是没有「一条命令把产物送到固定位置」。本脚本补上这一步。
#
# 凭证：优先用已配置的 gh/git 凭证；沙盒重建后凭证会丢，此时自动从
#       ~/.config/workbuddy/github.token 恢复（文件权限 600，不入库）。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REPO="${SHIP_REPO:-xuwanc/playtest-harness}"
BRANCH="preview"
BUILD=1
[ "${1:-}" = "--no-build" ] && BUILD=0

GITNET=(-c http.lowSpeedLimit=1000 -c http.lowSpeedTime=25)

ensure_auth() {
  if git "${GITNET[@]}" ls-remote --heads origin >/dev/null 2>&1; then return 0; fi
  local tok_file="$HOME/.config/workbuddy/github.token"
  if [ -f "$tok_file" ] && command -v gh >/dev/null 2>&1; then
    echo "[ship] 凭证已失效，从 $tok_file 恢复 gh 登录"
    gh auth login --with-token < "$tok_file" >/dev/null 2>&1 || true
    gh auth setup-git >/dev/null 2>&1 || true
  fi
}

retry_push() {
  local dir="$1" refspec="$2" i
  for i in 1 2 3 4 5 6; do
    echo "[ship] push $refspec（第 $i 次）"
    if ( cd "$dir" && timeout 75 git "${GITNET[@]}" push origin "$refspec" ) >/tmp/ship-push.log 2>&1; then
      return 0
    fi
    tail -2 /tmp/ship-push.log || true
    sleep 4
  done
  echo "[ship] 推送失败，日志：/tmp/ship-push.log" >&2
  return 1
}

ensure_auth

[ "$BUILD" = 1 ] && npm run build

# main：源码 + dist 一并入库，保证「git 里的 dist = 线上 dist」
if ! git diff --quiet -- dist || [ -n "$(git ls-files --others --exclude-standard -- dist)" ]; then
  git add dist
  git commit -q -m "chore(release): 构建产物 $(date '+%Y-%m-%d %H:%M')"
fi
retry_push "$ROOT" main

# preview：只放构建产物，Pages 从这里托管；每次整棵替换，不累积旧哈希文件
WT="$(mktemp -d)"
cleanup() { git worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"; }
trap cleanup EXIT

git fetch -q origin "$BRANCH" 2>/dev/null || true
git worktree add -f "$WT" origin/$BRANCH --detach >/dev/null 2>&1
(
  cd "$WT"
  git checkout -q -B "$BRANCH"
  git ls-files -z | xargs -0 -r git rm -q --cached
  git clean -qfd
  cp -r "$ROOT/dist/." .
  touch .nojekyll
  git add -A
  if git diff --cached --quiet; then
    echo "[ship] 产物无变化，跳过 preview 提交"
  else
    VER="$(node -p "require('$ROOT/package.json').version" 2>/dev/null || echo dev)"
    git -c user.name="$(git -C "$ROOT" config user.name || echo ship)" \
        -c user.email="$(git -C "$ROOT" config user.email || echo ship@local)" \
        commit -q -m "deploy: 静态预览 v$VER"
    retry_push "$WT" "$BRANCH:$BRANCH"
  fi
)

echo
echo "固定链接（永不变，对外只发这条）： https://${REPO%%/*}.github.io/${REPO##*/}/"

# 「推到 preview」不等于「线上已是新版」：Pages 构建偶尔 abandoned / failed，
# 而 CDN 会继续用旧 index.html（v9s.55 连挂两次，本地新版线上旧版只差一个 hash）。
# 这里最多等 2 分钟，只做提示，不改退出码 —— 发布本身已经成功，构建是 GitHub 的事。
if command -v python3 >/dev/null 2>&1; then
  python3 "$ROOT/tools/check-online.py" --wait 120 || echo "[ship] 线上还没生效，稍后用 python3 tools/check-online.py --wait 600 复查"
fi
