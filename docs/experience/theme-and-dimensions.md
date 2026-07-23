# Theme And Dimensions Delivery Experience

## Global Theme Contract

- Use one `ThemeProvider` for the application. It exposes a `system | light | dark` preference and resolves an effective light or dark theme.
- Explicit light/dark preferences are stored under `swui-theme-preference`; selecting system removes that override.
- Apply `themeInitializationScript` in the document head before the application bundle when the host can render a head, then mount `ThemeProvider` for reactive synchronization.
- Do not add a local `.dark` class or a second provider. Cross-tab synchronization uses the browser `storage` event.
- Dark palette lanes and elevation steps: [color-lanes.md](color-lanes.md).
- Typography: default UI uses `font-sans`; long-form reading may use `font-serif`; code and IDs use `font-mono` (system-local stacks, no CDN). See `packages/ui-tokens/docs/TOKENS.md` § Typography.

## Dimensions And Responsive Behavior

- Use 4px-based spacing and the semantic aliases in `@swqt/ui-tokens`; core control heights are `compact=28`, `sm=30`, `md=32`, and `lg=40` pixels. `micro=24` and `xs=28` preserve documented dense-table and calendar geometry; they are not general primary-action sizes.
- Use the named global breakpoints from the token package. `data-dense` is not a page breakpoint: it is solely the threshold for information-dense controls.
- Tailwind `max-*` variants are exclusive. To implement the intended `<=820px` compact behavior, use `max-data-dense` with `data-dense=821px`, not `max-[820px]`.

## Consumer Validation

- A consumer CSS entry must import Tailwind, import `@swqt/ui-tokens/tokens.css`, then use an accurate `@source` path for UI source. The example lives at `examples/ui-consumer/src/styles.css`; its monorepo path is `../../../packages/ui/src`.
- Verify the emitted CSS contains component utilities. A successful build alone can hide a wrong `@source` path.
- Run `bun run --filter '@swqt/ui-consumer-example' typecheck`, `bun run example:build`, and `bun run --filter '@swqt/ui-consumer-example' test:browser` with Bun on `PATH`. The browser command executes light/dark × compact/data-dense/lg/xl, includes accessibility checks, and maintains one screenshot baseline per project.
- Run `bun run check:design-contract` to reject unapproved raw control dimensions and colors, missing/cyclic token references, theme-selector bypasses, and declared semantic foreground/background pairs below WCAG AA 4.5:1. Its intentionally small exception register is [design-contract-exceptions.md](design-contract-exceptions.md).
- Run `bun run verify:packed-consumer` before release. It packs both 1.0.0 packages and verifies two isolated consumers: a nested installation and a workspace-hoisted installation. Each is type-checked, built, checks its emitted CSS for component utilities and the dark-theme selector, then runs the Playwright browser matrix against the installed tarball. This proves component rendering and theme switching from publish-shaped layouts, not only workspace source.

The repository CI workflow (`.github/workflows/quality.yml`) runs the same type-check, static design contract, example build, browser matrix, and dual-layout packed-consumer checks on pushes and pull requests.

## Browser Acceptance

- Browser tests use Playwright and its managed Chromium because the host Chromium binary can terminate with `SIGTRAP` in this environment.
- Check effective theme, menu interaction, persisted preference, system reset, cross-tab synchronization, compact visibility, WCAG 2.2 AA rules, and screenshot baselines. Use visibility assertions, not DOM counts, because hidden responsive branches remain mounted.
- `test:browser` compares the checked-in project-specific screenshots; use `test:browser:update` only after reviewing an intentional visual change.
- The [core quality matrix](quality-matrix.md) names covered state rows, deliberately inapplicable states, and the exact-boundary skip rationale. Update it with any new core primitive or approved exception.
