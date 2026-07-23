# R-SWUI-002：设计系统门户、Agent MCP 与 npm Registry 集成研究

- **文档编号**：R-SWUI-002
- **状态**：implemented (MVP) — F-SWQT-0004 交付 portal + swui MCP + registry 方案 A；Phase 2 catalog 未含
- **记录类型**：research evidence / 潜在 Feature 输入
- **日期**：2026-07-23
- **范围**：`swui` 仓库、`@swui/ui-tokens`、`@swui/ui`、私有 npm registry、Agent 消费路径
- **前置讨论**：2026-07-23 会话 — 库来源、展示站可行性、MCP + npm 分发、registry 集成方案选型

## 1. 执行摘要

### 1.1. 结论

1. **来源**：本 UI 库主要源自 **skywalker** 项目的 Web UI 层；2026-07-16 抽离为独立仓库 `swui`，内部设计系统代号 **Skywalker**。组件基于 shadcn/ui + Radix 风格；npm 包为 `@swui/ui-tokens` 与 `@swui/ui`。
2. **现状缺口**：仓库已有 Markdown agent 文档、`examples/ui-consumer` 接入证明与 Playwright 质量矩阵，但**没有**面向人类与 Agent 的统一门户 / 全量组件展示站；`packages/ui/llms.txt` 明确将 *Components showcase host app* 列为 **Not in this package**。
3. **可行性**：在 **`examples/portal`** 内建独立门户，展示全部控件与约定；同域 **`/mcp`** 暴露 HTTP MCP 供 Agent 查询；npm 分发采用 **方案 A** — 以现有私有 registry `npm.inet.swqt.net` 为唯一包源，门户只读集成元数据与安装指引，**不自托管 tarball**。
4. **推荐路径**：统一入口（如 `ui.swqt.net`）= 人类展示 + MCP 查询 + registry 安装页；`@swui/ui` 包本身仍不包含产品壳层或 MCP 服务端代码。

### 1.2. 潜在 Feature 目标

1. 交付可浏览的设计系统门户：组件 catalog、主题/密度约定、Do/Don't、token 说明。
2. 暴露 swui 专用 MCP：resources 索引与结构化 tools，与 npm 包内 agent 文档同源。
3. 门户 `/packages` 集成私有 registry：版本列表、peer 依赖、`.npmrc` / install 命令；publish 仍走 `scripts/publish.sh`。
4. 建立 docs → 门户 → MCP → npm tarball 的单向 SSOT 同步，避免文档漂移。

### 1.3. 成功定义

- 人类可在浏览器中按 `COMPONENT-CATALOG.md` 分组浏览组件与约定，并切换 theme / density 上下文。
- Agent 可通过 MCP 在安装前查询 adoption、组件用途、版本与 peer 依赖；安装后仍以 `node_modules/@swui/ui/AGENTS.md` 为版本锁定真源。
- `npm install` / `bun add @swui/ui` 仅经 `npm.inet.swqt.net`（或组织配置的 `SWUI_NPM_REGISTRY`）；门户不提供替代 tarball 宿主。
- 发布流水线：`publish.sh --apply` → portal 重建 → registry 元数据与 MCP 版本缓存刷新。

## 2. 库来源与组织上下文

### 2.1. 来源项目

| 维度 | 事实 |
| --- | --- |
| 来源 | **skywalker** — Rust 本地优先 crypto-quant 运行时 / Web UI 工作区 |
| 抽离 | 初始提交 `dd14966`（2026-07-16）：*Extract tokens, React primitives, agent docs, and example consumer into a standalone shared UI repository* |
| 内部代号 | Skywalker design tokens / Skywalker React UI primitives |
| 主要消费者 | skywalker `apps/web`，经 `file:../../../swui/packages/*` 或私有 registry |
| 边界 SSOT | skywalker `docs/authority/ui/SSOT-029-web-ui-npm-package-boundary.md` |

### 2.2. 抽离时保留在产品侧的能力

以下能力**未**迁入 `swui`，且后续门户也不应吸收为库的一部分：

- 产品级 `AppShell` / `TopBar` / 路由 IA
- Runtime API 客户端与业务 feature
- skywalker `apps/web` 内的 components showcase 宿主（历史上更完整，未随抽离迁移）

### 2.3. 技术栈事实

- React 19  primitives；Tailwind v4；语义 token 来自 `@swui/ui-tokens`
- 私有 registry 默认：`https://npm.inet.swqt.net/`（`SWUI_NPM_REGISTRY` 可覆盖）
- 发布脚本：`scripts/publish.sh`（pack / `--npm-dry-run` / `--apply`）

## 3. 当前资产与缺口

### 3.1. 已具备

| 资产 | 路径 / 机制 | 用途 |
| --- | --- | --- |
| Agent 首跳文档 | `packages/ui/AGENTS.md`、`packages/ui-tokens/AGENTS.md` | 安装后 agent 规则 |
| 快速索引 | `llms.txt`（各包） | Agent 目录 |
| 设计约定 | `docs/DESIGN-SUMMARY.md`、`DO-AND-DONT.md`、`COMPONENT-CATALOG.md`、`ADOPTION.md` | 随 npm tarball 发布 |
| 接入证明 | `examples/ui-consumer` | token 导入、Tailwind `@source`、部分状态矩阵 |
| 质量门禁 | Playwright 矩阵（light/dark × compact/data-dense/lg/xl）、`verify:packed-consumer` | 发布形态验收 |
| npm 发布 | `publish.sh`、`publishConfig.registry` | 私有 registry 推送 |

### 3.2. 缺口

| 缺口 | 说明 |
| --- | --- |
| 全量组件展示站 | `ui-consumer` 仅覆盖少量 primitive 与状态夹具，非完整 catalog |
| Agent 远程查询面 | 无 swui 专用 MCP；依赖安装后读 `node_modules` 或人工读 repo |
| 统一发现入口 | registry、文档、示例分散；无 `ui.swqt.net` 类门户 |
| registry UI | 无版本页、安装指引聚合页 |

### 3.3. 与 R-SWUI-001 的关系

R-SWUI-001 聚焦主题/尺寸/token 治理与验收闭环（已实现）。本研究聚焦**暴露面与分发面**：如何把已有契约让人类与 Agent 可发现、可安装。两者正交，可独立 Feature 推进。

## 4. 需求陈述

### 4.1. 人类需求

- 浏览所有导出组件、variants、使用场景与反模式。
- 查看 theme（system/light/dark）、data-dense / compact 约定及 `WideScreenGate`（820/821px）说明。
- 获取安装与 Tailwind 接入步骤；查看当前发布版本。

### 4.2. Agent 需求

- 安装前：查询组件 catalog、adoption 片段、peer 依赖、Do/Don't。
- 安装后：仍优先读已安装包内 `AGENTS.md`（版本锁定）。
- 结构化 tools 优于广撒网读文件。

### 4.3. 分发需求

- 组织内应用通过标准 npm 客户端安装 `@swui/ui`、`@swui/ui-tokens`。
- 不在门户重复托管 tarball；registry 保持 authoritative。

## 5. 方案比较

### 5.1. 展示站实现路径

| 选项 | 描述 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A | 扩展 `examples/ui-consumer` | 成本低，复用 Playwright | 测试夹具与文档站职责混杂 |
| B | 新增 `examples/portal`（Vite + 导航） | 职责清晰，可独立迭代 | 需新建应用 |
| C | Storybook | a11y/视觉回归成熟 | 额外工具链；R-SWUI-001 仅引用未落地 |

**推荐**：**B** — 新建 `examples/portal`；`ui-consumer` 继续专注 adoption 证明与浏览器矩阵。

### 5.2. npm 分发路径

| 选项 | 描述 | 结论 |
| --- | --- | --- |
| **A（推荐）** | 门户接现有私有 registry | registry 真源；门户读 API 展示版本与 install 命令 |
| B | 门户直链 `.tgz` | 适合离线下载；不能替代 `npm install` 元数据解析 |
| C | 门户自建 registry | 与现有 `publishConfig` 冲突，维护成本高 |

**已确认选型**：**方案 A**。

### 5.3. MCP 传输

| 模式 | 适用 |
| --- | --- |
| HTTP/SSE MCP | 远程 Cursor / 组织 Agent，挂载 `https://ui.swqt.net/mcp` |
| stdio MCP（可选） | 本地 monorepo 开发；读 `packages/*/docs` |

与组织级 `sw mcp`（方法论 / workflow）**职责分离**：swui MCP 仅服务设计系统知识，不承载 SWS workflow 工具。

## 6. 目标架构（方案 A）

```text
                    ┌─────────────────────────────────────┐
                    │  ui.swqt.net（统一门户，待建设）      │
                    ├─────────────────────────────────────┤
  人类浏览器 ────────►│  /              组件展示 + 约定文档   │
  Cursor Agent ────►│  /mcp           swui MCP 服务        │
  npm / bun ───────►│  /packages      registry 集成页       │
                    └─────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────────────┐
              ▼               ▼                       ▼
     packages/ui/docs   COMPONENT-CATALOG      npm.inet.swqt.net
     AGENTS.md / llms    tokens.css              (@swui/ui, @swui/ui-tokens)
     （构建时同步 → 站点 + MCP resources）
```

### 6.1. 层次边界

| 层 | 职责 | 不应承担 |
| --- | --- | --- |
| `@swui/ui` / `@swui/ui-tokens` | 运行时库 + 随包 agent 文档 | MCP server、registry、产品壳 |
| `examples/portal` | 展示、MCP、registry UI | 业务路由、Runtime API |
| `npm.inet.swqt.net` | publish、install、semver、tarball | 组件 demo、Markdown 渲染 |

## 7. MCP 设计草案

### 7.1. Resources（只读，构建时索引）

```text
swui://docs/AGENTS.md
swui://docs/COMPONENT-CATALOG.md
swui://docs/DESIGN-SUMMARY.md
swui://docs/DO-AND-DONT.md
swui://docs/ADOPTION.md
swui://components/{name}          # 按 catalog 条目生成
swui://tokens/semantic            # 摘要，真源仍为 tokens.css
```

### 7.2. Tools（结构化查询）

| Tool | 输入 | 输出 |
| --- | --- | --- |
| `swui.catalog.search` | keyword | 匹配的组件 / 文档段落 |
| `swui.component.get` | name | exports、variants、使用说明 |
| `swui.adoption.get` | — | Tailwind / ThemeProvider 接入片段 |
| `swui.package.list` | — | `@swui/ui`、`@swui/ui-tokens` 摘要 |
| `swui.package.get` | name, version? | peerDependencies、exports 摘要 |
| `swui.package.installHint` | — | bun/npm 命令 + `.npmrc` 模板 |

### 7.3. Agent 使用纪律（建议写入 MCP initialize instructions）

1. **未安装包**：使用门户 MCP 查最新约定与版本。
2. **已安装包**：优先 `node_modules/@swui/ui/AGENTS.md` 及同版本 `docs/*`。
3. MCP 只读；不通过 MCP 修改组件源码或代写产品 AppShell。

## 8. Registry 集成（方案 A 细则）

### 8.1. 门户只读 API

- 包元数据：`GET https://npm.inet.swqt.net/@swui%2fui`（及 `@swui/ui-tokens`）
- 展示：`dist-tags.latest`、版本列表、各版本 `peerDependencies`
- tarball：`dist.tarball` 链接**指向 registry**，门户不缓存二进制

### 8.2. 消费方配置模板

```ini
@swui:registry=https://npm.inet.swqt.net/
//npm.inet.swqt.net/:_authToken=${NPM_TOKEN}
```

门户安装页提供 copy-paste；鉴权由 registry 强制执行。

### 8.3. 发布流水线

```text
git tag
  → ./scripts/publish.sh --apply          # 推送到 npm.inet.swqt.net
  → CI 重建 portal                        # 刷新 /packages 与 MCP 版本缓存
  → （可选）sw doctor / verify:packed-consumer  # 既有门禁不变
```

`publish.sh` 与 `verify:packed-consumer` **无需为门户而改写**；portal 是 publish 之后的只读消费者。

## 9. 门户内容结构（建议）

### 9.1. 人类站点信息架构

| 区块 | 内容 |
| --- | --- |
| Overview | 库定位、与 skywalker 关系、安装入口 |
| Components | 按 COMPONENT-CATALOG 分组 demo |
| Theme & density | ThemeControl、compact / data-dense、820/821 gate |
| Tokens | 语义 token 表（值 SSOT：`packages/ui-tokens/src/tokens.css`） |
| Conventions | DESIGN-SUMMARY、DO-AND-DONT |
| Packages | registry 版本、install、peer 列表 |
| Agent | MCP 连接说明、与 `AGENTS.md` 的分工 |

### 9.2. 建议仓库落点

```text
examples/portal/
  src/                      # 展示站 UI（Vite + React）
  server/mcp/               # MCP HTTP handler
  server/registry-client.ts # npm registry 只读客户端
  scripts/sync-docs.mjs     # 从 packages/*/docs 同步 SSOT
```

## 10. 鉴权与安全

| 访问者 | 门户 HTML / MCP docs / MCP tools | registry install / tarball |
| --- | --- | --- |
| 任意（内网 DNS 可达） | **公开只读** — catalog、约定、MCP resources、`swui.package.*` 元数据 | 需 `_authToken`；匿名 **403** |
| 维护者 CI | 同左 | deploy 不注入 token；metadata **匿名可读**（已确认） |

门户不得绕过 registry 鉴权提供匿名 tarball 镜像；`/packages` **不**提供 tarball 下载按钮，仅 install 命令与 `.npmrc` 模板。

## 11. MVP 与分阶段交付

### 11.1. MVP（第一阶段）

1. `examples/portal` 骨架：Overview + 基于 `sync-docs.mjs` 同步的约定页（禁止手改 `.generated/`）。
2. `/packages`：匿名读 registry metadata，展示版本、peer、install 命令（无 tarball 下载 UI）。
3. MCP resources：`AGENTS.md`、`ADOPTION.md`、`COMPONENT-CATALOG.md`。
4. MCP tools：`swui.package.get`、`swui.package.installHint`（含 stale 缓存标记）。
5. CI：`portal:build` + `sync-docs --check`；tag 发布后 deploy 刷新 portal 与 MCP 索引。
6. Host：双 MCP 槽位（`sw` + `swui`）；**不**同步启动 sws facade 联邦 Feature。

### 11.2. 第二阶段

1. 全量组件 demo 页（对齐 catalog）。
2. MCP：`swui.catalog.search`、`swui.component.get`。
3. CI：publish 后自动刷新 portal 与 MCP 索引。

### 11.3. 第三阶段（可选）

1. Storybook 或等价 visual/a11y 基线（呼应 R-SWUI-001 §4.1 Storybook 引用）；路线对比见 [R-SWUI-004](R-SWUI-004-storybook-mcp-vs-playwright-fixture-draft.md)。
2. 与 skywalker `apps/web` showcase 路由的能力对齐评估（是否废弃重复面）。

## 12. 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| 门户文档与 npm 包内 docs 漂移 | 构建时从 `packages/*/docs` 单源生成；禁止手改 portal 内副本 |
| MCP 与 `sw mcp` 混淆 | 命名空间 `swui://`；文档明确分工 |
| registry 不可达时 portal 版本页空白 | 降级展示上次缓存 + 明确 stale 标记 |
| 门户吸收产品壳职责 | 遵守 AGENTS.md：无 AppShell/TopBar/业务路由 |
| 私有包误公开 | registry 鉴权 + MCP 不镜像 tarball |

## 13. 落地前决策（已确认）

2026-07-23 架构讨论 + 同日决策收口。Feature 建议编号 **F-SWQT-0004**。

| 议题 | 决策 |
| --- | --- |
| 正式域名 | **`ui.swqt.net`**（与 `agent.swqt.net` 对称） |
| 部署形态 | 静态门户（Vite build）+ 同域 **`/mcp`** Node handler；ingress 反代，MVP 不拆独立 MCP 域名 |
| 仓库落点 | **`examples/portal/`**（不用 `apps/portal`） |
| 公开策略 | 门户 HTML、MCP resources/tools **公开只读**；install / tarball 仍走 registry 鉴权 |
| registry metadata | **`npm.inet.swqt.net` 允许匿名读 metadata**（已确认）；portal **无需** `NPM_READ_TOKEN` |
| registry 缓存 | 服务端 TTL **15min**；不可达时 stale 缓存 + 显式 `stale` / `cachedAt` |
| Host MCP | **路径 A — 双槽位**（`sw` + `swui` → `https://ui.swqt.net/mcp`）；**先不同步开** sws 路径 B facade Feature |
| npm 分发 | **方案 A**（已定） |
| 展示 vs 测试 | portal = 人类 catalog demo；**Playwright 矩阵留 `ui-consumer`**（见 R-SWUI-004） |
| stdio MCP | MVP **不做**；P1 可选本地 `mcp:stdio` |
| skywalker showcase | **渐进 deprecate**（portal MVP 后加 canonical 链接；全量 catalog 后再评估下线） |

### 13.1. 残余待决（不阻塞 MVP）

1. skywalker showcase 下线时间表（依赖 portal Phase 2 全量 demo）。
2. 若未来组织 **强制单 MCP 槽位**，再开 sws 路径 B；预埋：upstream HTTP、swui 独立 Bearer、不扩 `capabilityProjection`（见 [R-SWUI-003](R-SWUI-003-swui-mcp-sws-integration-research.md)）。

## 14. 本地证据索引

| 证据 | 路径 |
| --- | --- |
| 抽离提交 | git `dd14966` — *Initial import of swui design system packages* |
| 包边界（skywalker 侧） | `../skywalker/docs/authority/ui/SSOT-029-web-ui-npm-package-boundary.md` |
| 不在包内清单 | `packages/ui/llms.txt` — *Components showcase host app* |
| ui-consumer 定位 | `examples/ui-consumer/README.md` |
| 发布脚本 | `scripts/publish.sh` |
| registry 默认 | `SWUI_NPM_REGISTRY` → `https://npm.inet.swqt.net/` |
| 主题治理前置研究 | `docs/research/R-SWUI-001-theme-consistency-governance-research.md` |

## 15. 建议下一步

1. 开 Feature **F-SWQT-0004**：*设计系统门户与 Agent MCP*（workflow：`.sw/workflow/feature/F-SWQT-0004-设计系统门户与-agent-mcp.json`）。
2. 实现 MVP §11.1，registry 集成严格遵循方案 A；决策见 §13。
3. 在 `docs/research/README.md` 与本研究保持索引同步；交付后在 project docs 增加 experience 条目（可选）。

---

*本研究由 2026-07-23 架构讨论整理。npm **方案 A**、§13 落地前决策、registry metadata 匿名可读、Host **双槽位（暂不开 sws facade）** 均已确认。*
