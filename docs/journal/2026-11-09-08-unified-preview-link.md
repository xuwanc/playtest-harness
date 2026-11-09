# 2026-11-09（其八）· 统一线上链接：根因与解法

## 1. 用户指出的真问题

> 不是他发错了链接，而是你们都在各自沙盒里发布，自然没有统一的链接。
> agent 互相之间没法用同一个网站服务器发布。

之前以为「记错链接」，实测核对 `sites/scripts/lib.js` 后发现是**架构必然**：

- 站点 skill 的 `publish.js` 把**本沙盒正在跑的进程**经 `auth-proxy` 暴露成
  子域名 `a<md5(runtimeId)>.app.workbuddy.host` 的**实时隧道**；
- `appName = a<md5(runtimeId)>` 完全由**沙盒 runtimeId** 派生，状态文件
  `~/.workbuddy-sandbox-publish/state.json` 每个沙盒各一份；
- 因此两个 agent 在**两个沙盒**各自发布 → 必然两条互不相关的隧道；沙盒休眠隧道即断。
- **两个 agent 之间没有任何共享的 Web 服务器**，也拼不出一个。

`aac01946…` / `aef42c…` 的差异正是这个：两条隧道、两个沙盒，不是谁抄错域名。

## 2. 协作拓扑（顺带说明）

- 两个 agent = **两个独立沙盒**，彼此**不共享文件系统、不共享服务器**；
- 唯一的共享实物是 **GitHub 仓库**（经 GitHub MCP 网关读写）；
- MCP 网关是**沙盒内**的本地 HTTP 代理（`github.agent-gateway.auth-proxy.local`），
  自动注入用户 OAuth 令牌并转发到 `api.github.com`；每个沙盒各有一个实例，
  但都打到同一个 GitHub 仓库；
- agent 之间从不直接对话，只通过 **分支命名 + 合并队列 + 文档（CURRENT / MERGE_QUEUE）** 协调。

## 3. 解法

**唯一权威链接 = GitHub Pages**：把 `dist/` 当静态资源部署到仓库 `preview` 分支，
URL 由仓库身份决定（`https://xuwanc.github.io/playtest-harness/`），**与沙盒无关**：
哪个 agent 发、发几次都是同一站点、同一链接；沙盒休眠不影响；多 agent 并发也只产生一条链接。

落地：

- `tools/publish-pages.py`：复用 `push-branch.py` 的 GitHub MCP 通道，把 `dist/`
  推到 `preview` 分支（带 `.nojekyll` + 增量删旧清单）；
- `npm run publish:pages`；`agent-sync.py finish` 先跑它，失败仅告警不阻断；
- `publish:preview` 隧道降为**默认关闭**的兜底，仅 `WORKBUDDY_TUNNEL_FALLBACK=1` 临时开；
- 单发布者治理钉死：**只有合并闸门发布，feature agent 绝不发布**（这正是之前出两条链接的直接原因）；
- 文档：`AGENTS.md` / `multi-agent-workflow.md` §9 重写，讲清根因与 Pages 解法。

## 4. 唯一一次性前置（用户做）

仓库 `Settings → Pages → Build from a branch` 选 `preview` / `/(root)`，约 1 分钟生效。
开启前 `publish:pages` 仍会把 `dist/` 正常推到 `preview` 分支，只是还没站点。

## 5. 验证

- `tools/publish-pages.py --dry`：收集 4 文件（index.html / css / js / .nojekyll）共 ~866KB，逻辑通过；
- 导入修复（`push-branch.py` 带连字符不能 import，改 `importlib` 动态加载）；
- `tsc` / `docs:check` 待提交后由 `verify` 复核。
