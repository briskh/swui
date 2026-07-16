# Design Contract Exceptions

`bun run check:design-contract` rejects raw control-size utilities and hexadecimal colors in `packages/ui/src`. The following narrow allowlist is intentional and must be reviewed when touched.

| Location | Value | Reason | Theme review |
| --- | --- | --- | --- |
| `components/avatar.tsx`, `components/empty.tsx` | `size-10` | Decorative/avatar visual block, not an interactive control. | Uses semantic backgrounds/foregrounds. |
| `components/wide-screen-gate.tsx` | `size-8` | Informational placeholder icon. | Uses `text-muted-foreground`. |
| `components/data-table.tsx` | `w-12` | Selection-column layout width, not control height. | No color dependency. |
| `components/chart.tsx` | `#fff`, `#ccc` | Recharts SVG attribute selectors used only to map upstream literal strokes to semantic tokens. | Selector output maps to `stroke-transparent` / `stroke-border`; `theme-chart` runs screenshot + axe across light/dark × compact/data-dense/lg/xl. |

## Chart exception visual-review record

2026-07-17 的受控视觉审查已检查 `light-lg/core-state-matrix.png` 与 `dark-lg/theme-chart.png`：禁用 Select 保持语义禁用样式，暗色图表的两条指标线可辨识且网格线映射为主题边框色。完整八个主题/视口基线同时由 Playwright 的 `theme-chart` 截图和 axe 检查覆盖；审查人：Codex agent（以仓库内基线为准）。

Do not add an exception for an interactive control. Use the documented tokenized control scale instead. New exceptions require a documented reason and browser/a11y review in the same change.
