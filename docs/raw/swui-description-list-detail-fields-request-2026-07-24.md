# 需求：管理后台「列表瘦身 → 详情页」数据展示基元

日期：2026-07-24  
类型：对外原始需求正文（提交 `@swqt/ui` / swui 工单用；**非** eauth research SSOT）  
状态：草稿 — 可整段粘贴至 swui 需求单  

说明：本文件位于 `docs/raw/` 隔离域。治理化结论见 research R-SWQT-0042；**勿**从 research / design / workflow 链接本文件。

---

## 1. 背景与消费方

消费产品：**eauth** 管理台 / 账户门户（已全面采用 `@swqt/ui` + `@swqt/ui-tokens`，light-only）。

当前问题：Dense `ServerDataTable` 列表按「数据库全字段投影」渲染，多页达到 12–22 列，可读性差。产品目标态是：

- 列表只保留 4–6 个识别/状态列 + 右侧「详情」入口
- 全量字段在**独立详情路由**中美观展示（非再用一张表铺字段）
- 编辑继续用既有 `Dialog` / 产品层 FormDialog；列表不再承担全字段浏览器职责

`@swqt/ui` 已具备列表与壳能力（`ServerDataTable`、`WideScreenGate`、`Card`、`Badge`、`Chip`、`Button`、`Breadcrumb`、`Sheet`、`SourceCode`、`EmptyState`、`LoadingState`、`Accordion`/`Collapsible`）。**缺口在「详情页字段级数据展示」组合基元**——目前只能在各产品里手写 `dl`/grid，样式与无障碍会分叉。

请在 design system 层补齐下列控件，使多产品可统一复用。

## 2. 目标（要解决什么）

提供一套 **只读详情字段展示** 基元，用于：

1. 标签 + 值的响应式网格（替代「第二张全宽表格」）
2. 分区标题（概要 / 配置 / 元数据 / 时间线）
3. 常见值形态：纯文本、等宽 ID、Badge/Chip、多值列表、可复制值、嵌入 JSON/源码块
4. 与现有 token / 4px rhythm / HTML-first 契约一致

**非目标（请勿做进本包）：**

- 产品 `AppShell` / TopBar / 业务路由 IA
- 详情页整页业务壳（返回按钮文案、权限、API 拉取）——可只提供可选 layout 插槽，不绑 routeTree
- 改 `ServerDataTable` 列 API 或强制列表密度策略
- 可编辑表单控件（已有 Forms 家族）
- 第二套 toast / theme / 图标库

## 3. 建议导出面（命名可调整，语义需保留）

### 3.1 `DescriptionList`（或 `DetailFieldGrid`）— P0

语义化只读「标签–值」列表/网格。

**建议子导出：**

| Export | 职责 |
|--------|------|
| `DescriptionList` | 容器；控制列数/间距；默认渲染为语义结构（优先原生 `<dl>` + `<div>` 分组，或等价可访问结构；ARIA 仅补缺口） |
| `DescriptionTerm` / `DescriptionDetails` | 或统一 `DescriptionItem`（`label` + `children`） |
| `DescriptionSection` | 可选：带标题的分区（内部可用 `Card` 或纯 section，由 variant 决定） |

**布局 API（建议）：**

- `columns?: 1 | 2 | 3`（默认：窄屏 1，≥md 2；详情长表单场景需要 1）
- `density?: 'default' | 'compact'`（对齐现有 compact 控件语义）
- `className` 透传；样式只用语义 token，禁止魔法色

**`DescriptionItem` / 字段项 props（建议）：**

| Prop | 说明 |
|------|------|
| `label: ReactNode` | 字段名 |
| `children` / `value` | 字段值 |
| `hint?: ReactNode` | 可选帮助说明（次要文案） |
| `span?: 'full' \| number` | 跨列（JSON、长 URI 列表用 full） |
| `mono?: boolean` | 等宽（UUID、client_id、kid） |
| `truncate?: boolean` | 单行截断 + `title`/Tooltip 全文（默认 false；详情页优先换行） |
| `copyable?: boolean \| string` | 显示复制按钮；`string` 时复制该文本而非 children 文本 |
| `empty?: ReactNode` | 空值占位（如 em dash），与消费方 empty 文案可对齐 |

**值槽允许嵌入（组合，不新造平行系统）：**

- 文本 / 链接
- `Badge` / `Chip`
- 多值：建议支持 `values: string[]` 快捷渲染为 Chip 行，或 document 推荐 `children` 内放 Chip
- JSON / JWKS / 长源码：**嵌入现有 `SourceCode`**（见 3.3），不要再做第三套代码块

**无障碍：**

- 标签与值程序化关联（`<dl>`/`dt`/`dd` 或等价）
- 复制按钮有可访问名称（如 “Copy {label}”）；复制成功可用现有 toast 策略或静默 + `aria-live`（与包内 `SourceCode` copy 行为对齐）
- 键盘可达；焦点环用 token

**Demo 页必含场景：**

1. 2 列用户/客户端概要（文本 + Badge + mono UUID copyable）
2. full-span `SourceCode` JSON（审计 details）
3. 多值 scopes/grantTypes Chip 行
4. 空值 empty 占位
5. compact + 1 列窄布局

参考站：`https://ui.swqt.net/components/...` 正式 demo；颜色/字体/图标遵循 foundation contract。

### 3.2 `CopyableText`（或并入 DescriptionItem）— P0/P1

若不愿把 copy 绑死在 DescriptionItem 上，请单独导出轻量：

- `CopyableText`：`value: string`，可选 `mono`，icon-compact 复制按钮（lucide only）
- DescriptionItem 的 `copyable` 内部复用它

用途：详情页 UUID、client_id、invite URL、kid 等——列表侧常见 TruncatedValue，详情侧需要**完整可见 + 一键复制**。

### 3.3 `SourceCode` 协作约定 — P0（增强可选）

现有 `SourceCode` 已覆盖语法高亮 + copy，详情页 JSON/JWKS **直接复用**。

可选增强（非阻塞，有则更好）：

- `language="json"` 时 pretty-print 选项，或 document 由调用方 `JSON.stringify(obj, null, 2)`
- `maxHeight` + 内部滚动（大审计 details）
- 与 `DescriptionItem span="full"` 的间距 demo

### 3.4 `DetailHeader`（可选 P1，薄封装）

**不要**做产品 PageHeader。可选提供极薄组合：

- 标题 + 可选描述 + 右侧 `actions` 插槽 + 可选状态 `Badge`
- 或明确 document：「详情页标题用产品自有 PageHeader + Breadcrumb；字段区用 DescriptionList」

若提供，须声明：**无路由、无返回链接业务逻辑**。

### 3.5 明确不需要新增

| 控件 | 原因 |
|------|------|
| 新的 DataTable 变体展示详情字段 | 与目标相反 |
| JsonTree 专用查看器（首期） | `SourceCode` 足够；树形可后续另开 |
| RowDetailButton | 产品用 `Button` + router `Link` 即可 |
| Sheet 改造 | 已有；详情主路径是独立页，Sheet 仅可选 |

## 4. 视觉与契约硬约束

- 仅语义 token（`@swqt/ui-tokens`）；无长期魔法色
- 字体：仓库/包规定栈；无外部字体、无 emoji 图标
- 图标：`lucide-react` named import only
- 间距/圆角：4px rhythm
- HTML-first；ARIA 只补语义缺口（见 HTML-STANDARDS）
- light/dark token 角色齐全（即便消费方锁定 light-only，基元不得 light-only 分叉）
- 禁止把组件源码拷进消费仓库作为长期分叉

## 5. 验收标准（给 swui）

1. Catalog 登记 + 参考站 demo（上述 5 场景）
2. `import { DescriptionList, … } from '@swqt/ui'`（或最终导出的等价名）可用；peer 仍为 React 19
3. 单元/视觉契约：列数断点、copyable、empty、full-span、嵌入 Badge/SourceCode
4. ADOPTION / COMPONENT-CATALOG / AGENTS 有简短「Detail page pattern」指针：List=`ServerDataTable`，Detail fields=`DescriptionList`，JSON=`SourceCode`，导航=`Breadcrumb`
5. 版本：进入可被 eauth 依赖的 release（semver）；changelog 标明 export 名

## 6. 消费方对接预期（eauth）

eauth 实现列表→详情时将**假定**下列导出已存在且 API 稳定：

```ts
import {
  DescriptionList,
  DescriptionItem,      // 或 Term/Details 组合
  DescriptionSection,  // 若有
  CopyableText,        // 若独立导出
  SourceCode,
  Card,
  Badge,
  Chip,
  Breadcrumb,
  // …
} from '@swqt/ui';
```

产品层只保留：路由、`PageHeader`、权限、FormDialog、query keys；**不再自建平行 DetailFieldGrid API**。

## 7. 优先级建议

| 优先级 | 项 |
|--------|-----|
| P0 | `DescriptionList` + item（含 mono / copyable / empty / span / 嵌 Badge·Chip·SourceCode） |
| P0 | Catalog + demo + 文档 pattern 指针 |
| P1 | 独立 `CopyableText`；`SourceCode` maxHeight；可选 `DetailHeader` 插槽 |
| P2 | JSON tree、Sheet 详情模板 |

## 8. 参考场景（真实字段形态）

- **用户详情**：username、email、roles[]、disabled/locked Badge、UUID copyable、created/updated
- **OAuth Client**：name、client_id、redirect_uris[]、scopes[]、jwks（SourceCode）
- **Client Policy**：大量 boolean/枚举开关 + TTL + allowlist[] + metadata JSON
- **DCR 审批**：申请全文只读分区 + 页头 actions（批准/拒绝，actions 由产品提供）
- **Audit event**：event_type、actor、target、ip、occurred_at、details JSON（SourceCode full-span）

## 9. 溯源（消费方侧，不要求 swui 打开）

- eauth 列表→详情目标态研究：`docs/research/R-SWQT-0042-admin-table-column-reduction-and-detail-pages.md`
- eauth 列表壳：`DenseServerTable` = `WideScreenGate` + `ServerDataTable`
