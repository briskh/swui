# Do and don't (`@swqt/ui`)

## Do

- Import primitives from `@swqt/ui` (or documented deep paths), including `WideScreenGate`.
- Import `@swqt/ui-tokens/tokens.css` once at the app CSS entry.
- Wrap the app (or subtree) in `ThemeProvider`.
- Use lucide named imports; label icon-only controls.
- Reuse `Empty` / `Alert` / loading compositions for standard states.
- Use `ServerDataTable` for Runtime/server-backed lists; `DataTable` for in-memory tables.
- Gate non-adaptable dense tables with `WideScreenGate`.
- Bump package versions across apps after library changes.
- Use only colors from Portal `/colors` and typography from `/typography` (see `docs/experience/foundation-contract.md`); run `bun run check:design-contract`.

## Don't

- Introduce colors outside the foundation contract (no raw hex/rgb/oklch in components, no ad hoc Tailwind chroma such as `text-blue-500`).
- Introduce typography outside the foundation contract (no `text-4xl`, `font-bold`, arbitrary `text-[…]`, or CDN/webfont imports).

- Copy `src/components/*` into the consumer app as a long-lived fork.
- Add `react-icons`, Heroicons, Iconify, emoji-as-icons, or ad hoc operational SVGs.
- Create a second Sonner / toast host with local duration/stack policy.
- Use Radix `Select` for ServerDataTable header filters (use `PopoverSelect` / header Combobox patterns).
- Put product TopBar / AppShell / route `staticData` IA into this package.
- Reintroduce a separate `@swqt/ui-shell` package without updating SSOT-029.
- Mount `.dark` manually in applications; ThemeProvider owns the global selector.
- Rely on `cn("hidden", condition && "block")` for `data-dense` visibility (class merge risk).
- Treat `Sidebar` showcase as the production left nav for a new product (compose your own shell).
- Ship auth/account/session identity UI through these primitives as if it were included (it is not).
