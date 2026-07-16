# Do and don't (`@swui/ui`)

## Do

- Import primitives from `@swui/ui` (or documented deep paths), including `WideScreenGate`.
- Import `@swui/ui-tokens/tokens.css` once at the app CSS entry.
- Wrap the app (or subtree) in `ThemeProvider`.
- Use lucide named imports; label icon-only controls.
- Reuse `Empty` / `Alert` / loading compositions for standard states.
- Use `ServerDataTable` for Runtime/server-backed lists; `DataTable` for in-memory tables.
- Gate non-adaptable dense tables with `WideScreenGate`.
- Bump package versions across apps after library changes.

## Don't

- Copy `src/components/*` into the consumer app as a long-lived fork.
- Add `react-icons`, Heroicons, Iconify, emoji-as-icons, or ad hoc operational SVGs.
- Create a second Sonner / toast host with local duration/stack policy.
- Use Radix `Select` for ServerDataTable header filters (use `PopoverSelect` / header Combobox patterns).
- Put product TopBar / AppShell / route `staticData` IA into this package.
- Reintroduce a separate `@swui/ui-shell` package without updating SSOT-029.
- Enable `.dark` in Skywalker product apps while the contract is light-only.
- Rely on `cn("hidden", condition && "block")` for 820/821 visibility (class merge risk).
- Treat `Sidebar` showcase as the production left nav for a new product (compose your own shell).
- Ship auth/account/session identity UI through these primitives as if it were included (it is not).
