# R-SWUI-003：swui MCP 与 SWS MCP 整合路径研究

- **文档编号**：R-SWUI-003
- **状态**：draft — 架构结论已锁定；任一整合路径均未实现
- **记录类型**：research evidence / 跨仓库 Feature 输入
- **日期**：2026-07-23
- **范围**：`swui` Agent 暴露面、`../sws` 本地 MCP 门面与中心 MCP、Host MCP 配置
- **前置研究**：[R-SWUI-002](R-SWUI-002-design-system-portal-mcp-registry-research.md)（门户、swui MCP 设计、npm registry 方案 A）
- **前置讨论**：2026-07-23 会话 — 能否将 swui MCP「挂在 SWS MCP 上」、由 SWS 做一次代理

## 1. 执行摘要

### 1.1. 问题

在 R-SWUI-002 规划独立 `swui://` MCP（如 `ui.swqt.net/mcp`）之后，进一步问：**能否不新增 Host 第二 MCP 槽位，而通过现有 SWS MCP 服务（`sw mcp` / `agent.swqt.net/mcp`）代理 swui 能力，使 Agent 仍只面对一个 MCP 入口？**

### 1.2. 结论

| 整合方式 | 可行性 | 结论 |
| --- | --- | --- |
| **中心 SWS MCP**（`agent.swqt.net/mcp`）代理 swui | **否** | 无 MCP-to-MCP 联邦；工具/资源编译期固定；Model A′ 硬切 |
| **本地 `sw mcp` 门面**扩展第二 upstream 代理 swui | **部分可行** | 需在 `sws` 开 Feature；符合 R-SWQT-0158「单一 stdio 门面」 |
| **Host 双 MCP 槽位**（`sw` + `swui`） | **是** | 零改 sws；R-SWUI-002 当前推荐 |
| **swui 文档编入 `sws://` 嵌入资产** | **部分** | 仅静态文档；无 registry/组件 tools；层边界错误 |

**总判**：**不能**把 swui 挂在**中心** SWS MCP 上做代理；若组织强需求「一个 Host 槽位」，应走 **本地 `sw mcp` 门面联邦**（sws 侧 Feature），而非中心聚合。

### 1.3. 推荐策略（分阶段）

1. **短期**：Host 配置 `sw` + `swui` 两个 MCP server；职责在 runbook 与 agent instructions 中写清。
2. **中期**（可选）：在 `sws` 实现 facade 双 upstream，合并 `tools/list` / `resources/list`，用户仍只配 `sw mcp`。
3. **禁止**：为 swui 单独增加「第二套 SWS 中心 HTTP MCP URL」；禁止在 `@swui/ui` npm 包内嵌 MCP server。

## 2. SWS MCP 架构事实（as-built）

### 2.1. 双层模型（Model A′）

```text
IDE / Agent
      │
      │  产品推荐：单个 stdio 槽位 →  sw mcp
      ▼
┌──────────────────────────────────────────┐
│  本地 sw mcp（sws/crates/swqt-cli）       │
│                                          │
│  LOCAL（拦截，无网络）：                    │
│    resources/list|read  → sws://* 嵌入   │
│    prompts/list|get     → 嵌入 prompts   │
│                                          │
│  PROXY（HTTP → 中心）：                     │
│    tools/list|call      → agent.swqt.net │
│    部分 resources/read  → 中心专用 URI    │
│                                          │
│  DECORATE：                               │
│    initialize / service_manifest          │
│    → capabilityProjection 元数据          │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  中心 SWS（sws/crates/sws）               │
│  Streamable HTTP @ agent.swqt.net/mcp    │
│  17 stateful tools（intake、payload 等）   │
│  中心 resources：bundle + tool help 等     │
│  方法论 sws://* → use-local-sw-assets 拒绝  │
└──────────────────────────────────────────┘
```

### 2.2. 代理方向

- **现有代理**：本地 facade → **中心**（单向）。
- **不存在**：中心 → swui、中心 → 任意第三方 MCP、中心 → 项目本地 stdio。

### 2.3. 能力与暴露面

| 面 | 本地 `sw mcp` | 中心 SWS |
| --- | --- | --- |
| 方法论资源 `sws://*` | 嵌入资产 SSOT | 硬切，拒绝 read |
| Agent prompts | 本地嵌入 | 空 / 硬切 |
| 状态型 tools | 代理 + 本地 role 投影 | 权威实现 + 鉴权 |
| `capabilityProjection` | 本地发射 | 无（投影在 client） |

投影模式（`baseline` / `authenticated` / `degraded-center-unreachable`）见 SWS runbook §capabilityProjection。

### 2.4. 单一门面原则（R-SWQT-0158）

> IDE/Agent/项目只看见一个本地 `sw` 门面（stdio MCP + Shell CLI）。

- 项目 **不应** 再配第二套远端 HTTP MCP 作为 SWS 方法论入口。
- 此原则针对 **SWS 域**；swui 作为**独立域**是否合并进同一 stdio，是产品决策，见 §5 路径 B。

## 3. 需求重述

### 3.1. 动机

- Agent 使用 `@swui/ui` 前需查 catalog、adoption、registry 版本与 peer 依赖（R-SWUI-002 §7）。
- 组织已统一使用 `sw mcp` 作为 SWS 认知入口；希望 **减少 Host 上 MCP 配置碎片**。
- 疑问：swui MCP 能否「挂」在 SWS MCP 上，由 SWS **做一次代理**。

### 3.2. 非目标

- 不改变 SWS 中心 intake/workflow 职责划分（exposure-separation-contract）。
- 不把 swui MCP server 代码放入 `@swui/ui` tarball。
- 不用中心 SWS 托管 npm tarball（registry 仍方案 A，见 R-SWUI-002 §8）。

## 4. 「挂在 SWS MCP 上」的三种解读

| # | 解读 | 可行 | 说明 |
| --- | --- | --- | --- |
| 1 | **中心** `agent.swqt.net/mcp` 转发 `swui.*` tools/resources | 否 | 无 upstream MCP client；tools 编译期注册 |
| 2 | **本地** `sw mcp` 再代理 `ui.swqt.net/mcp` 或本地 swui stdio | 部分 | 需 sws Feature；保持 Host 单槽位 |
| 3 | Cursor **两个** `mcpServers`（`sw` + `swui`） | 是 | 不经过 SWS 代理；职责分离 |

## 5. 整合路径详述

### 5.1. 路径 A — Host 双 MCP 槽位（推荐 · 短期）

**配置示例**：

```json
{
  "mcpServers": {
    "sw": {
      "command": "sw",
      "args": ["mcp"]
    },
    "swui": {
      "url": "https://ui.swqt.net/mcp"
    }
  }
}
```

本地 monorepo 开发可将 `swui` 改为 stdio 命令指向 `examples/portal` 的 MCP 进程。

| 维度 | 评估 |
| --- | --- |
| 改动面 | swui 门户 MCP 实现即可；**零改 sws** |
| 与 R-SWQT-0158 | 不违反 SWS 单一门面（swui 非 SWS 域） |
| 与 R-SWUI-002 | 一致（§5.3、§7） |
| 缺点 | Host 两个 server；Agent 需知何时用哪个 |

**Agent 纪律**：

| 任务 | MCP |
| --- | --- |
| workflow、intake、routing、payload | `sw` → `sws.*` |
| 组件 catalog、adoption、registry 元数据 | `swui` → `swui.*` |
| 已安装 `@swui/ui` 后版本锁定规则 | `node_modules/@swui/ui/AGENTS.md` |

### 5.2. 路径 B — 本地 `sw mcp` 门面联邦（可选 · 中期）

在 **sws 仓库**扩展 `mcp_proxy`，使用户仍只配置一个 `sw mcp`：

```text
sw mcp（stdio，Host 唯一槽位）
  ├─ sws://*              本地嵌入（现状）
  ├─ sws.* tools          代理 → agent.swqt.net（现状）
  └─ swui://* / swui.*    新增 → ui.swqt.net/mcp 或本地 swui MCP
```

**概念实现要点**（sws Feature，非 swui 实现）：

| 组件 | 变更 |
| --- | --- |
| `crates/swqt-cli/src/mcp_proxy.rs` | 第二 upstream；按 tool/resource URI 前缀路由 |
| `capability_matrix.v1.json` | 增加 swui 工具投影与 role 规则 |
| `capability_projection.rs` | 合并 `tools/list` 披露 |
| `initialize.instructions` | 声明 `sws.*` vs `swui.*` 分工 |
| 中心 `crates/sws` | **无需变更** |

| 维度 | 评估 |
| --- | --- |
| 优点 | Host 单槽位；用户体验统一 |
| 成本 | 跨仓库 Feature；E2E、暴露面守卫、降级模式 |
| 风险 | 与 exposure-separation 混淆若命名/文档不清 |
| 降级 | 中心不可达 vs swui 不可达需分轨 `projectionMode` 或等价信号 |

**建议 Feature 归属**：`sws`（F-SWQT-xxxx · sw mcp facade swui upstream），swui 侧仅交付 HTTP MCP 服务端与契约文档。

### 5.3. 路径 C — swui 文档编入 `sws://`（不推荐）

将 `AGENTS.md`、`COMPONENT-CATALOG.md` 等复制到 `sws/assets/` → `sws://reference/swui/*`。

| 维度 | 评估 |
| --- | --- |
| 优点 | 仅改 sws 资产；Agent 只连 `sw mcp` 可读文档 |
| 缺点 | 与 npm 包 docs 双源易漂移；无 `swui.package.get`；registry 只读 API 无法覆盖 |
| 层边界 | swui 知识沉入 SWS 插件层，违反 swui/sws 分层 |
| 结论 | 仅作临时过渡，**不作正式方案** |

### 5.4. 路径 D — 中心 SWS 代理 swui（不可行）

**阻断因素**：

1. **无联邦实现**：`crates/sws/src/server.rs` 无第三方 MCP upstream。
2. **工具注册模型**：`TOOL_NAMES` + Rust `#[tool_router]` + manifest fixture + CI 暴露守卫；非运行时插件。
3. **中心 resource 白名单**：仅 bundle + tool help；`swui://` 无法注册。
4. **Model A′ 硬切**：方法论不在中心；swui 设计系统亦非中心状态域。
5. **职责分离**：exposure-separation-contract 将 MCP 定为认知/控制面；swui 是设计系统 SSOT，域不同。

**结论**：除非新开架构级 Feature 明确「中心 MCP 联邦」，否则 **不应规划此路径**。

## 6. swui MCP 契约（与 SWS 的关系）

无论路径 A 或 B，**swui MCP 服务端**职责不变（摘自 R-SWUI-002 §7，与 SWS 正交）：

### 6.1. Resources

```text
swui://docs/AGENTS.md
swui://docs/COMPONENT-CATALOG.md
swui://docs/DESIGN-SUMMARY.md
swui://docs/DO-AND-DONT.md
swui://docs/ADOPTION.md
swui://components/{name}
swui://tokens/semantic
```

### 6.2. Tools

| Tool | 用途 |
| --- | --- |
| `swui.catalog.search` | 关键词查组件/文档 |
| `swui.component.get` | 组件 exports、variants |
| `swui.adoption.get` | Tailwind / ThemeProvider 片段 |
| `swui.package.list` | 包列表 |
| `swui.package.get` | registry 元数据、peerDeps |
| `swui.package.installHint` | install 命令 + `.npmrc` |

### 6.3. 命名空间纪律

- **`sws://*` / `sws.*`**：SWS 方法论与组织认知工具；**仅** local `sw mcp` + 中心代理。
- **`swui://*` / `swui.*`**：设计系统；**不**进入 SWS 中心 tool 表，除非走路径 B 由 facade 转发（仍非中心原生 tool）。

## 7. 方案比较矩阵

|  criterion | 路径 A 双槽位 | 路径 B facade 联邦 | 路径 C sws 嵌入 | 路径 D 中心代理 |
| --- | --- | --- | --- | --- |
| Host MCP 数量 | 2 | 1 | 1 | 1 |
| sws 代码改动 | 无 | 大 | 中（资产） | 极大 |
| swui 门户 MCP | 需要 | 需要 | 不需要 | 需要 |
| registry 集成 | swui MCP | swui MCP | 否 | swui MCP |
| 文档 SSOT | swui 包 | swui 包 | **双源风险** | swui 包 |
| 与 R-0158 | 兼容 | 兼容（扩展门面） | 兼容 | **冲突** |
| 实现优先级 | **P0** | P1 | 不推荐 | 禁止 |

## 8. 鉴权与降级

### 8.1. 路径 A

- `sw`：现有 OIDC / token → 中心鉴权。
- `swui`：独立策略（内网 Bearer 或只读公开 docs + registry 元数据缓存）。

### 8.2. 路径 B

- facade 需分别处理：中心 401/403（现有 `center-authz-denied`）与 swui upstream 失败。
- 建议：swui upstream 不可达时，`swui.*` 从投影隐藏或返回明确 blocked reason；**不影响** `sws.*` 代理。

### 8.3. 共同约束

- swui MCP **不**镜像 npm tarball；install 鉴权仍由 `npm.inet.swqt.net` 负责（R-SWUI-002 §8）。

## 9. 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| Agent 混淆 sws vs swui | MCP instructions + runbook 分工表；tool 前缀硬编码 |
| 路径 B 扩大 sw mcp 复杂度 | 独立 Feature、契约测试、分 upstream 熔断 |
| 路径 C 文档漂移 | 禁止正式采用；若短期使用则 build 同步脚本 |
| 中心误扩域 | 代码 review + exposure 守卫拒绝 swui tool 进 `TOOL_NAMES` |
| 双槽位配置遗漏 | swui 项目 companion / ADOPTION 文档给出 `.cursor/mcp.json` 片段 |

## 10. 待决问题

1. 组织是否 **强制** Host 单 MCP 槽位 → 决定是否启动路径 B Feature。
2. 路径 B 的 swui upstream：HTTP（`ui.swqt.net`）还是 bundled stdio 子进程。
3. swui MCP 鉴权是否与 SWS OIDC 共用 issuer（便利）还是独立（隔离）。
4. 路径 B 的 `capabilityProjection` 是否扩展为 per-upstream 子模式，或仅文档约定。

## 11. 建议下一步

### 11.1. swui 仓库

1. 按 R-SWUI-002 MVP 实现 `examples/portal` + HTTP MCP（路径 A 的 `swui` 槽位）。
2. 在 `docs/` 或 companion 提供推荐 `.cursor/mcp.json` 片段（`sw` + `swui`）。
3. 本研究与 R-SWUI-002 交叉引用保持同步。

### 11.2. sws 仓库（仅当确认路径 B）

1. 新开 Feature：local `sw mcp` swui upstream federation。
2. 输入：本研究 + R-SWQT-0158（单一门面）+ exposure-separation-contract。
3. 验收：合并 `tools/list`；swui 不可达降级；sws E2E 与 capability projection 回归。

### 11.3. 明确不做

- 中心 SWS 增加 swui proxy（路径 D）。
- `@swui/ui` 包内 MCP server。

## 12. 证据索引

### 12.1. sws 仓库

| 证据 | 路径 |
| --- | --- |
| 本地 MCP 代理 | `../sws/crates/swqt-cli/src/mcp_proxy.rs` |
| 能力投影 | `../sws/crates/swqt-cli/src/capability_projection.rs` |
| 能力矩阵 SSOT | `../sws/crates/swqt-cli/src/capability_matrix.v1.json` |
| 中心 MCP 服务 | `../sws/crates/sws/src/server.rs` |
| 工具/manifest SSOT | `../sws/crates/sws/src/manifest.rs` |
| MCP runbook | `../sws/assets/reference/mcp-runbook.md` |
| 暴露面分离契约 | `../sws/assets/reference/exposure-separation-contract.v1.md` |
| 门面目标态研究 | `../sws/docs/research/R-SWQT-0158-local-sw-mcp-facade-and-center-proxy-target-state.md` |
| Host MCP 模板 | `../sws/resources/cursor/mcp.json` |

### 12.2. swui 仓库

| 证据 | 路径 |
| --- | --- |
| 门户与 swui MCP 设计 | [R-SWUI-002](R-SWUI-002-design-system-portal-mcp-registry-research.md) |
| 不在包内清单 | `packages/ui/llms.txt` |
| 当前 Host MCP（仅 sw） | `.cursor/mcp.json` |

## 13. 与 R-SWUI-002 的关系

| R-SWUI-002 章节 | 本研究补充 |
| --- | --- |
| §5.3 MCP 传输 | 明确与 SWS 职责分离；补充路径 B 单槽位选项 |
| §6 目标架构 | 中心不参与 swui；可选 facade 合并 |
| §7 MCP 设计 | 契约不变；挂载方式由本研究 §5 决定 |
| §11 MVP | MVP 仍可按路径 A 交付；路径 B 为 sws 后续 Feature |

---

*本研究由 2026-07-23 MCP 整合讨论整理。**中心 SWS 代理 swui：否**；**推荐短期路径 A（双槽位）**；**单槽位需求走路径 B（本地 facade 联邦，sws Feature）**。*
