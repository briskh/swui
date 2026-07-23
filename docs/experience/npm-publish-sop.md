# npm 公开发布 SOP（@swqt/ui · @swqt/ui-tokens）

面向 **registry.npmjs.org** 的版本发布标准流程。首发已完成；此后每次发版遵循本 SOP。

相关资产：

| 资产 | 路径 |
|------|------|
| 发布脚本 | `scripts/publish.sh` |
| **脱敏安全审计** | `scripts/audit-npm-publish.mjs` |
| CI 发布（OIDC） | `.github/workflows/publish-npm.yml` |
| 消费者验证 | `scripts/verify-packed-consumer.mjs` |

---

## 0. 角色与前提

- **Maintainer** 对 `@swqt` org 有 publish 权限。
- **Trusted Publishing** 已绑定：`briskh/swui` · workflow `publish-npm.yml`。
- **禁止** 在仓库或 CI 中存放长期 `NPM_TOKEN`（OIDC 为默认路径）。
- 本地应急发布仅作 fallback（Mac 指纹 / `npm login --auth-type=web`）。

---

## 1. 发版前：变更与版本

1. 在 `main` 上完成代码评审与合并。
2. **Semver bump**（两包版本策略保持一致或按依赖关系单独 bump）：
   - `packages/ui-tokens/package.json` → `version`
   - `packages/ui/package.json` → `version`
3. 更新 CHANGELOG 或 Release notes（GitHub Release 正文）。
4. 确认 `publishConfig.registry` 为 `https://registry.npmjs.org/`，`access` 为 `public`。
5. 确认 **未** 在 `publishConfig` 中启用 `provenance: true`（provenance 仅 CI `--provenance`）。

---

## 2. 脱敏安全审计（必做）

对 **即将发布的 tarball 内容** 做静态扫描；输出报告 **一律脱敏**（token / 邮箱 / 密钥片段替换为 `[REDACTED]`）。

```bash
bun run pack
bun run check:npm-publish-audit
```

### 审计范围

| 级别 | 检查项 |
|------|--------|
| **Blocking** | `_authToken`、Bearer/PAT、AWS key、私钥块、字面量 secret 赋值、非占位符 `SW_MCP_TOKEN`、`.env`/`.npmrc`/`.pem` 等禁止文件名、`preinstall`/`postinstall`/`prepare` 等 lifecycle 脚本 |
| **Warning** | 内网 URL（`npm.inet.swqt.net`、`agent.swqt.net`）、 tarball 内邮箱（文档信息暴露，需人工确认是否可接受） |

### 人工复核（审计通过仍建议快速目检）

- [ ] tarball 仅含 `files` 白名单（源码 + docs + AGENTS，无 portal/server/`.sw`）
- [ ] 文档中内网 URL 仅为 **注释/optional mirror** 说明
- [ ] 无真实凭证、无 `.env` 泄漏

**Blocking > 0 → 禁止发布**，修复后重新 `pack` + 审计。

---

## 3. 质量门禁

```bash
bun run sync-docs && bun run sync-docs:check
bun run check:catalog-export
bun run check:design-contract
bun run --filter '@swqt/portal-example' test
bun run example:build && bun run portal:build
bun run verify:packed-consumer
```

CI `quality.yml` 在 PR 上应已为绿。

---

## 4. 发布（首选 CI / OIDC）

### 4.1 Dry run

1. Push 含版本 bump 的 commit 到 `main`。
2. GitHub → **Actions** → **Publish npm packages** → **Run workflow**。
3. 勾选 **Dry run** → Run。
4. 确认日志：先 `@swqt/ui-tokens`，再 `@swqt/ui`；无报错。

### 4.2 正式发布

**方式 A — Workflow（推荐）**

- Actions → **Publish npm packages** → Run workflow（**不**勾 dry run）

**方式 B — GitHub Release**

- 创建 Release（tag 如 `v1.0.1`）→ 自动触发 `publish-npm.yml`

发布顺序固定：**ui-tokens → ui**（与 `publish.sh` / workflow 一致）。

### 4.3 本地 fallback（仅应急）

```bash
npm login --auth-type=web --registry https://registry.npmjs.org/
cd /path/to/swui
bun run pack
bun run check:npm-publish-audit
./scripts/publish.sh --apply   # 无 provenance；勿加 publishConfig.provenance
```

---

## 5. 发布后验证

```bash
npm view @swqt/ui-tokens version
npm view @swqt/ui version
npm view @swqt/ui peerDependencies --json
```

- [ ] https://www.npmjs.com/package/@swqt/ui-tokens
- [ ] https://www.npmjs.com/package/@swqt/ui
- [ ] Portal `/packages` live registry 显示新版本（非 stale）
- [ ] 干净目录安装 smoke：`npm install @swqt/ui @swqt/ui-tokens`

---

## 6. 回滚与下架

- **坏版本未广泛传播**：npm deprecate + 发 patch 修复版。
  ```bash
  npm deprecate @swqt/ui@1.0.x "reason; upgrade to 1.0.y"
  ```
- **严重安全问题**：deprecate + 文档公告；必要时联系 npm support 请求 unpublish（公开包窗口期有限，以 npm 政策为准）。

---

## 7. Checklist（可复制到 Release PR）

```
[ ] Semver bumped (ui-tokens + ui)
[ ] bun run pack
[ ] bun run check:npm-publish-audit — 0 blocking（报告已脱敏复核）
[ ] verify:packed-consumer 通过
[ ] PR quality CI 绿
[ ] Actions dry run 通过
[ ] 正式发布 / Release 已触发
[ ] npm view + 门户 /packages 验证
[ ] Trusted Publishing 仍指向 publish-npm.yml（无 token 泄漏）
```

---

## 8. 与私有 mirror 的关系

若组织仍同步到 `npm.inet.swqt.net`：

```bash
SWUI_NPM_REGISTRY=https://npm.inet.swqt.net/ SWUI_NPM_ACCESS=restricted \
  ./scripts/publish.sh --apply
```

**公开 npm 为 canonical**；mirror 为可选二次推送，亦须先完成 §2 脱敏审计。
