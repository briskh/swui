# R-SWUI-004：Storybook MCP 与 Playwright Fixture 路线对比及 Agent 工具映射草案

- **文档编号**：R-SWUI-004
- **状态**：draft — 路线对比与 P0 清单已锁定；Storybook 试点未启动
- **记录类型**：research evidence / 潜在 Feature 输入
- **日期**：2026-07-23
- **范围**：`@swui/ui` 组件 state 证据、Agent 查询面、story/fixture 技术选型
- **前置研究**：
  - [R-SWUI-001](R-SWUI-001-theme-consistency-governance-research.md) — 主题/尺寸治理与 Storybook 测试模型引用
  - [R-SWUI-002](R-SWUI-002-design-system-portal-mcp-registry-research.md) — 门户、swui MCP、registry 方案 A
  - [R-SWUI-003](R-SWUI-003-swui-mcp-sws-integration-research.md) — swui MCP 与 SWS MCP 整合路径
- **外部参考**：
  - [Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview)（Preview；React + Vite）
  - [Storybook MCP for React 博客](https://storybook.js.org/blog/storybook-mcp-for-react/)
  - [Chromatic Published Storybook MCP](https://www.chromatic.com/blog/introducing-published-storybook-mcp-servers/)
  - [shadcn MCP](https://ui.shadcn.com/docs/mcp)（Registry 型；**非**本库主路径）

## 1. 执行摘要

### 1.1. 问题

中心化 UI 资产 `@swui/ui` 需要：**核心组件 × 关键 state** 的自动化 a11y/截图证据，以及 **Agent 可查询** 的组件知识面。行业现成方案以 **Storybook MCP + Component Manifest** 为主；本仓库已有 **Playwright + `examples/ui-consumer` fixture**。应选哪条路线、能否组合、Agent 工具如何分工？

### 1.2. 结论

| 维度 | 结论 |
| --- | --- |
| **默认路线** | **Playwright fixture 为主** + **自建 swui MCP**（R-SWUI-002）+ **docs-site**（R-SWUI-002 §5.1 方案 B） |
| **Storybook MCP** | **P2 可选试点**，非 Day-1 依赖；价值在维护者「写 story → Agent 自测自修复」闭环 |
| **shadcn MCP** | **不适用**（npm 包模型 ≠ registry 拷贝模型） |
| **Chromatic** | 消费者少、已有 Playwright 时 **ROI 偏低**；远程 MCP 发布可作 P3 |
| **组合** | **可以**；fixture 负责集成/regression 证据，Storybook 负责单组件 state 实验室，swui MCP 负责发现/文档/registry |

### 1.3. 分阶段策略

```text
P0  swui MCP + docs-site + 扩 Playwright P0 state 矩阵（ui-consumer 或 docs-site）
P1  docs-site 全 catalog 浏览；Playwright P1 组件（DataTable、Dialog、Alert、Empty…）
P2  试点 examples/storybook + @storybook/addon-mcp（仅 P0 四组件）
P3  （按需）Chromatic 发布 Storybook MCP；评估是否替代部分 Playwright 截图
```

## 2. 背景：现有资产

### 2.1. Playwright 矩阵（as-built）

| 项 | 事实 |
| --- | --- |
| 位置 | `examples/ui-consumer/playwright.config.mjs` |
| 项目 | 8 projects：`light|dark` × `compact|data-dense|lg|xl` |
| 服务 | Vite `@ 4175` |
| 测试 | 主题同步、core-components 截图、a11y、state-matrix、chart、820/821 gate |
| 基线 | `examples/ui-consumer/__screenshots__/{projectName}/*.png` |

### 2.2. state-matrix 已覆盖（P0 子集）

| 组件 | 已测 state |
| --- | --- |
| Button | default、focus-visible、disabled、loading、selected、icon-only |
| Input | ready、focused、disabled、invalid+error、empty |
| Select | selected、disabled |
| ThemeControl | 跨 tab 主题偏好（独立测试） |
| Chart | 语义色两条 line + svg |
| Table + WideScreenGate | 820 隐藏 / 821 显示（data-dense project） |

### 2.3. Agent 文档（as-built）

| 资产 | 路径 | 发布 |
| --- | --- | --- |
| AGENTS.md | `packages/ui/AGENTS.md` | npm tarball |
| llms.txt | `packages/ui/llms.txt` | npm tarball |
| docs/* | `packages/ui/docs/*` | npm tarball + exports |
| 规划 swui MCP | R-SWUI-002 §7 | 未实现 |

## 3. 方案对比：Storybook MCP vs Playwright Fixture

### 3.1. 能力矩阵

| 能力 | Playwright Fixture | Storybook MCP |
| --- | --- | --- |
| **单组件单 state 展示** | 需手写 testId/页面区块 | Story 一等公民 |
| **截图回归** | ✅ `toHaveScreenshot` | ✅ story 截图 / Chromatic / Loki |
| **a11y（axe）** | ✅ `@axe-core/playwright` | ✅ `run-story-tests`（经 MCP） |
| **主题 × 视口矩阵** | ✅ 8 projects 已配置 | 需 story params / globals 配置 |
| **集成场景**（多组件同页） | ✅ 自然适合 | 非 Storybook 强项 |
| **820/821 data-dense gate** | ✅ 已有 boundary 测试 | 需单独 story + viewport |
| **packed tarball 消费验证** | ✅ `verify:packed-consumer` | 不覆盖 |
| **Agent 查 props/API** | ❌ 无 MCP | ✅ manifest + `get-documentation` |
| **Agent 写 story + 自修复** | ❌ | ✅ dev + testing toolsets |
| **Agent 发现/安装包** | ❌ | ❌（需 swui MCP + registry） |
| **工具链** | 已有（Vite + Playwright） | +Storybook 10.3+、addon-mcp |
| **成熟度** | 生产可用 | **Preview**（React+Vite） |
| **私有部署** | 自托管 | 本地或 Chromatic SaaS |

### 3.2. 成本矩阵（团队中心化资产）

| 成本项 | Playwright 扩展 | 上 Storybook MCP |
| --- | --- | --- |
| 初建 | 低（扩 fixture 页） | 中高（SB 配置 + stories + manifest） |
| 日常维护 | 中（fixture 与 catalog 同步） | 高（story + manifest + addon 升级） |
| CI 时间 | 已知基线 | +story 测试 / 或双轨截图 |
| 学习曲线 | 团队已熟悉 | Storybook + MCP 新概念 |
| Agent 配置 | swui MCP 一个槽位 | 可能 +storybook 槽位 |

### 3.3. 决策规则

| 若目标是… | 选 |
| --- | --- |
| 阻塞发布的 theme/state/regression 证据 | **Playwright fixture** |
| 人类浏览全 catalog + registry | **docs-site**（R-SWUI-002） |
| Agent 安装前查约定/版本 | **swui MCP** |
| 维护者用 Agent **生成并验证**新组件 stories | **Storybook MCP 试点** |
| 组织远程 MCP、无本地 Storybook | Chromatic 发布（P3） |

## 4. P0 / P1 组件 × State 覆盖清单

### 4.1. 优先级定义

| 级别 | 标准 |
| --- | --- |
| **P0** | 高频基础交互；已有或部分已有测试；Agent 误用代价高 |
| **P1** | 数据密集/overlay/feedback；与 theme、density、gate 强相关 |
| **P2** | 其余 catalog 组件 default + 1 代表 state |

### 4.2. P0 清单（必须证据）

| 组件 | 关键 state / variant | Playwright 现状 | Storybook 试点（若 P2） |
| --- | --- | --- | --- |
| **Button** | default、secondary、outline、disabled、loading、selected、icon-only、focus-visible | ✅ state-matrix | `Button/Default` … `Button/IconOnly` |
| **Input** | default、focused、disabled、invalid+error、empty | ✅ state-matrix | `Input/*` |
| **Select** | selected、disabled、empty placeholder | ✅ 部分 | `Select/*` |
| **ThemeControl** | system/light/dark、跨 tab 同步 | ✅ 独立测试 | `ThemeControl/Menu` |
| **ThemeProvider** | data-theme 随偏好/effective | ✅ 间接 | decorator 覆盖即可 |

**P0 Playwright 缺口（待补）**：

- Button：`destructive`、`ghost`、`link` variant 至少各 1 快照或断言
- Select：`empty placeholder` 态
- Textarea：与 Input 对称的 invalid/disabled（P0 扩展项）

### 4.3. P1 清单（下一迭代）

| 组件 | 关键 state / 场景 | 理由 |
| --- | --- | --- |
| **Alert** | default、destructive | 错误语义/a11y |
| **Empty** | zero-data、error、no-permission | 状态枚举在 catalog 已定义 |
| **Dialog** | open、focus trap | overlay 键盘 |
| **DataTable** | 列排序、选择 + **WideScreenGate** | 与 820 gate 绑定 |
| **WideScreenGate** | ≤820 placeholder、≥821 content | 已有 boundary；P1 可拆独立 fixture |
| **Chart** | 语义 token 色 | ✅ 已有 theme-chart |
| **Badge** | default、secondary | 低复杂度补覆盖 |

### 4.4. P2 清单（catalog 扫尾）

Accordion、Avatar、Breadcrumb、Calendar、Card、Checkbox、Combobox、Command、ContextMenu、DatePicker、DropdownMenu、Form、HoverCard、InputGroup、Pagination、Popover、Progress、RadioGroup、ScrollArea、Separator、Sheet、Sidebar、Skeleton、Slider、Spinner、Switch、Table、Tabs、Textarea、Toggle、ToggleGroup、Tooltip、ServerDataTable、PopoverSelect 等：**default 态 + 文档链接**；按需升为 P1。

### 4.5. 覆盖统计（当前 → P0 目标）

| 指标 | 当前 | P0 完成后目标 |
| --- | --- | --- |
| P0 组件数 | 4（Btn/In/Select/Theme） | 5（+ThemeControl 显式） |
| P0 state 断言 | ~15 | ~22 |
| 截图基线 / project | 3 类 × 8 projects | 4 类 × 8 projects |
| catalog P0 覆盖率 | ~80% state | ≥95% P0 state |

## 5. Agent 工具映射

### 5.1. 总览

```text
Agent 任务                    首选工具/面                    备选
─────────────────────────────────────────────────────────────────
安装前：用什么组件              swui MCP catalog               npm llms.txt
安装前：怎么接入 Tailwind       swui MCP adoption              docs/ADOPTION.md
安装前：版本与 peerDeps         swui MCP package.get           registry API
已安装：项目内规则              node_modules/.../AGENTS.md     swui MCP docs（可能更新）
维护者：查 props/variants       Storybook MCP get-documentation  读 TS 源码
维护者：写/改 story             Storybook MCP dev toolset      人工
维护者：验证 story              Storybook MCP run-story-tests  Playwright fixture
发布前：集成+ tarball 证据      Playwright + verify:packed      Storybook 不替代
workflow/intake                 sw mcp（SWS）                  —
```

### 5.2. swui MCP（规划 — R-SWUI-002 §7）

| Tool / Resource | Agent 用途 | SSOT |
| --- | --- | --- |
| `swui://docs/AGENTS.md` | 硬规则、import 模式 | `packages/ui/AGENTS.md` |
| `swui://docs/COMPONENT-CATALOG.md` | 组件 inventory | 同路径 |
| `swui://docs/ADOPTION.md` | 接入步骤 | 同路径 |
| `swui.catalog.search` | 关键词 → 组件/文档 | catalog + docs 索引 |
| `swui.component.get` | 单组件 exports、variants、Do/Don't | catalog 条目 + DESIGN-SUMMARY |
| `swui.adoption.get` | CSS/Tailwind/ThemeProvider 片段 | ADOPTION.md |
| `swui.package.get` | registry 版本、peerDeps | `npm.inet.swqt.net` |

**不提供**：写 story、跑浏览器测试（交给 Storybook MCP 或 CI）。

### 5.3. Storybook MCP（试点 — P2）

| Tool（Storybook 官方 toolset） | Agent 用途 | 对应 swui 场景 |
| --- | --- | --- |
| `list-all-documentation` | 列全部组件 index | 与 catalog 对齐校验 |
| `get-documentation` | props + 前 3 个 story 代码 | Button/Input/Select 试点 |
| `get-documentation-for-story` | 单 variant 详情 | destructive Button 等 |
| `get-storybook-story-instructions` | 写 story 规范 | 维护者新增组件时 |
| `preview-stories` | 返回 story URL / 嵌入预览 | PR review |
| `run-story-tests` | vitest + a11y 针对 story id | 替代部分手工 Playwright？试点对比 |

**Host 配置（开发态）**：

```json
{
  "mcpServers": {
    "sw": { "command": "sw", "args": ["mcp"] },
    "swui": { "url": "https://ui.swqt.net/mcp" },
    "swui-storybook": { "url": "http://localhost:6006/mcp" }
  }
}
```

与 [R-SWUI-003](R-SWUI-003-swui-mcp-sws-integration-research.md) 一致：`swui-storybook` **不**经 SWS 中心代理。

### 5.4. Playwright Fixture（现状 + 扩展）

| 机制 | Agent 用途 | 说明 |
| --- | --- | --- |
| 无原生 MCP | CI/人读结果 | Agent 不直接调 Playwright |
| `browser.spec.mjs` | 发布门禁 | 主题、state-matrix、chart、gate |
| fixture `data-testid` | 稳定选择器 | 可供未来 swui MCP 引用「验收页 URL」 |
| 截图 diff | 视觉 SSOT | 有意改 UI 需 review diff |

**可选扩展**：swui MCP tool `swui.quality.getMatrix` 返回「当前 CI 覆盖的 state 表 + 报告链接」— P1 以后。

### 5.5. npm 包内文档（已安装消费者）

| 面 | 何时优先 |
| --- | --- |
| `node_modules/@swui/ui/AGENTS.md` | **已安装**后一切 UI 改动 |
| `node_modules/@swui/ui/docs/*` | 与 lockfile 版本绑定的细节 |
| swui MCP | 安装前、查 latest、查 registry |

## 6. 组合架构（推荐）

```text
                    ┌─────────────────────────────────────┐
                    │  examples/docs-site (B)             │
                    │  人类浏览 + swui MCP HTTP           │
                    └─────────────────────────────────────┘
                           │                    │
              ┌────────────┘                    └────────────┐
              ▼                                              ▼
    examples/ui-consumer (A)                    examples/storybook (C, 可选)
    Playwright 集成/regression                  Storybook MCP 单组件实验室
              │                                              │
              └──────────────────┬───────────────────────────┘
                                 ▼
                    packages/ui/docs + AGENTS.md (SSOT)
                                 ▼
                    npm.inet.swqt.net (@swui/ui)
```

**禁止三重 demo**：同一 Button state 不同时维护 fixture 页 + docs 页 + story 三份；优先 **fixture 与 story 二选一**，docs-site 可 embed story iframe 或链到 Storybook。

## 7. Storybook 试点准入条件（P2 Gate）

在启动 `examples/storybook` 前，应满足：

| # | 条件 |
| --- | --- |
| 1 | R-SWUI-002 P0 交付：swui MCP resources + `swui.component.get` |
| 2 | P0 Playwright 清单 §4.2 缺口已补 |
| 3 | 明确 pilot 范围：**仅** Button、Input、Select、ThemeControl |
| 4 | 指定维护者 ≥1 人负责 Storybook 升级与 addon 兼容 |
| 5 | 试点成功标准（见 §7.1）预定义 |

### 7.1. 试点成功标准

| 指标 | 阈值 |
| --- | --- |
| Agent 通过 MCP 查 Button props | 与 TS 类型一致，无 hallucinated export |
| `run-story-tests` P0 stories | 全绿 |
| 与 Playwright state-matrix 重复度 | 记录重复 case 清单；试点结束决策是否合并 |
| CI 增量时间 | 相对基线 ≤ +40% 否则不推广 |
| Preview API 稳定性 | 无 blocking breaking 一个 minor 周期 |

### 7.2. 试点失败/暂停条件

- Storybook MCP Preview API  breaking 且无法 pin 版本
- 双轨截图维护成本 > 单人 0.5d/周
- Playwright 已满足 P0/P1，Storybook 无额外 a11y 发现

## 8. 与 shadcn MCP 的边界

| shadcn MCP | swui |
| --- | --- |
| `search_items_in_registries` | → `swui.catalog.search` |
| `get_add_command_for_items` | → `swui.package.installHint`（npm/bun，非 copy） |
| `view_items_in_registries`（源文件） | → 安装后读 package；MCP 只给 docs 摘要 |
| `components.json` | **无**；消费者用 package.json deps |

**不实现** shadcn registry JSON，除非未来单独 Feature 暴露「拷贝型」fallback（当前非目标）。

## 9. 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| Storybook + Playwright 双基线 | P0 重叠组件试点对比；收敛为单真源 |
| Storybook MCP Preview 变更 | pin 版本；试点隔离在 `examples/storybook` |
| Agent 槽位过多 | 生产消费者只配 `sw` + `swui`；storybook 仅 maintainer dev |
| fixture 与 catalog 漂移 | CI check：catalog 中 P0 组件必须在 fixture 有 testId |
| docs-site 与 MCP 漂移 | build 时从 `packages/ui/docs` 同步（R-SWUI-002） |

## 10. 建议 Feature 拆分

| Feature | 范围 | 依赖 |
| --- | --- | --- |
| F-swui-portal-mcp-p0 | docs-site MVP + swui MCP + registry 页 | R-SWUI-002 |
| F-swui-playwright-p0-gap | §4.2 缺口 + P0 统计门禁 | ui-consumer |
| F-swui-storybook-mcp-pilot | examples/storybook + addon-mcp + P0 四组件 | P0 gate §7 |
| F-swui-playwright-p1 | §4.3 P1 组件 fixture | P0 完成 |

## 11. 待决问题

1. P0 扩展 Playwright 时，fixture 留在 `ui-consumer` 还是迁到 `docs-site`？
2. Storybook 试点是否在首个 minor 即 pin `@storybook/*` exact 版本？
3. `swui.quality.getMatrix` 是否纳入 swui MCP P1？
4. Chromatic 是否已有组织账号/预预算（决定 P3）？

## 12. 证据索引

| 证据 | 路径 |
| --- | --- |
| Playwright 配置 | `examples/ui-consumer/playwright.config.mjs` |
| 浏览器测试 | `examples/ui-consumer/browser.spec.mjs` |
| state-matrix UI | `examples/ui-consumer/src/main.tsx` |
| 组件 catalog | `packages/ui/docs/COMPONENT-CATALOG.md` |
| Agent 规则 | `packages/ui/AGENTS.md` |
| 门户/MCP 研究 | [R-SWUI-002](R-SWUI-002-design-system-portal-mcp-registry-research.md) |
| SWS 整合 | [R-SWUI-003](R-SWUI-003-swui-mcp-sws-integration-research.md) |

---

*本草案由 2026-07-23 Agent+Story 技术调研整理。**默认：Playwright fixture + swui MCP + docs-site；Storybook MCP 为 P2 有条件试点。***
