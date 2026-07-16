# @swui/ui — Agent instructions

**Read this file first** before adding or changing UI in any project that depends on `@swui/ui`.

## Package role

React 19 UI primitives (shadcn / Radix style) plus:

- `cn` utility
- date helpers for DatePicker (UTC store / local display)
- global `ThemeProvider` / `useTheme` / `ThemeControl` with system, light, and dark preferences
- `WideScreenGate` / `WideScreenPlaceholder` (820/821 compact gate)

Requires peer: `@swui/ui-tokens` CSS in the app, plus React / Radix / lucide peers listed in `package.json`.

## First hop (AI)

1. This file (`AGENTS.md`)
2. [`llms.txt`](./llms.txt)
3. [`docs/DESIGN-SUMMARY.md`](./docs/DESIGN-SUMMARY.md) — patterns, a11y, states
4. [`docs/COMPONENT-CATALOG.md`](./docs/COMPONENT-CATALOG.md) — what exists and when to use it
5. [`docs/DO-AND-DONT.md`](./docs/DO-AND-DONT.md)
6. [`docs/ADOPTION.md`](./docs/ADOPTION.md) — install, Tailwind scan, ThemeProvider
7. Sibling: `@swui/ui-tokens` AGENTS.md

## Hard rules

1. Prefer existing primitives from this package. Do not invent long-lived local variants with ad hoc colors, radius, focus rings, or state styling.
2. Use semantic tokens from `@swui/ui-tokens` (`bg-primary`, `text-muted-foreground`, …).
3. Icons: **lucide-react named imports only**. Icon-only controls need `aria-label`; decorative icons beside text use `aria-hidden="true"`.
4. Theme: use one global `ThemeProvider`; `ThemeControl` owns system/light/dark preference and consumers must not mount a competing local theme controller.
5. Toasts: use `Toaster` / `notify*` from this package only — no second Sonner wrapper.
6. Dense tables: `DataTable` (client) vs `ServerDataTable` (server cursor) — do not overload one with the other. Use `WideScreenGate` for non-adaptable dense tables (`<=820px` gate).
7. Do **not** expect product `AppShell` / `TopBar` / route IA in this package — those stay in each app.
8. Do not copy component source into the app; bump the package version instead.
9. There is **no** separate `@swui/ui-shell` package; import gate helpers from `@swui/ui`.

## Import patterns

```tsx
import { ThemeProvider, Button, Card, WideScreenGate } from "@swui/ui";
```

Deep imports also work: `@swui/ui/button`, `@swui/ui/theme`, `@swui/ui/utils`, `@swui/ui/wide-screen-gate`.
