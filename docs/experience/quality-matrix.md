# Core Quality Matrix

This matrix is the coverage baseline for the theme and dimensions contract. The browser suite runs every applicable row in `light` and `dark` at `compact`, `data-dense`, `lg`, and `xl` viewports.

| Surface | Covered states | Evidence | Explicit exception |
| --- | --- | --- | --- |
| Button | default, hover, focus-visible, disabled, loading, selected | DOM/ARIA assertions, real pointer hover, screenshot, axe | The full-page screenshot remains deliberately pointer-neutral; the browser test performs the actual hover interaction. |
| Icon button | default, focus-visible, accessible name | DOM/ARIA assertions, screenshot, axe | No loading variant is exposed by this primitive. |
| Input | default, focus-visible, disabled, error, empty | DOM/ARIA assertions, screenshot, axe | Loading and selected do not apply to a text input. |
| Select | selected, disabled | DOM/ARIA assertions, screenshot, axe | Menu-open state is covered by ThemeControl’s real dropdown interaction. |
| ThemeControl | system, light, dark preference; cross-tab synchronization | Playwright interaction and `data-theme` assertions | No separate compact control fixture; it uses the same public component variant. |
| Chart exception mapping | light/dark semantic metric lines and upstream literal-selector mapping | screenshot, axe, chart DOM assertion | `#fff` and `#ccc` remain limited to documented Recharts SVG selector compatibility. |
| Dense data table | hidden at 820px; shown at 821px | boundary Playwright test and axe | Only `data-dense` projects exercise the exact boundary; other viewports deliberately skip it. |

The current browser command contains five tests across eight projects. The dense boundary test has six intentional scope skips, yielding 34 executed successful tests in the full local matrix.

Run with:

```bash
bun run --filter '@swui/ui-consumer-example' test:browser
bun run verify:packed-consumer
```
