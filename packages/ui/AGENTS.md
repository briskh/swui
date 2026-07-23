# @swqt/ui — Agent instructions

**Read this file first** before adding or changing UI in any project that depends on `@swqt/ui`.

## Package role

React 19 UI primitives (shadcn / Radix style) plus:

- `cn` utility
- date helpers for DatePicker (UTC store / local display)
- global `ThemeProvider` / `useTheme` / `ThemeControl` with system, light, and dark preferences
- `WideScreenGate` / `WideScreenPlaceholder` (820/821 compact gate)

Requires peer: `@swqt/ui-tokens` CSS in the app, plus React / Radix / lucide peers listed in `package.json`.

## First hop (AI)

1. This file (`AGENTS.md`)
2. [`llms.txt`](./llms.txt)
3. MCP `swui://foundation/contract` — blocking font, icon, color, control, HTML, and reference-site contract
4. [`docs/HTML-STANDARDS.md`](./docs/HTML-STANDARDS.md) — native elements, attributes, and justified exceptions
5. [`docs/DESIGN-SUMMARY.md`](./docs/DESIGN-SUMMARY.md) — patterns, a11y, states
6. [`docs/COMPONENT-CATALOG.md`](./docs/COMPONENT-CATALOG.md) — what exists and when to use it
7. [`docs/DO-AND-DONT.md`](./docs/DO-AND-DONT.md)
8. [`docs/ADOPTION.md`](./docs/ADOPTION.md) — install, Tailwind scan, ThemeProvider
9. Sibling: `@swqt/ui-tokens` AGENTS.md

Before implementing UI, actively consult `https://ui.swqt.net/colors`, `/typography`, `/icons`, and the exact `/components/...` demo. These are normative working references, not optional inspiration.

## Hard rules

1. Prefer existing primitives from this package. Do not copy source, create long-lived local forks, or simulate an available control with a neutral element.
2. Use semantic tokens from `@swqt/ui-tokens` (`bg-primary`, `text-muted-foreground`, …).
3. Icons: **lucide-react named imports only**. Icon-only controls need `aria-label`; decorative icons beside text use `aria-hidden="true"`.
4. Fonts/glyphs: use only the repository `font-sans`, `font-serif`, and `font-mono` stacks and documented scale/weights. No external/CDN fonts, arbitrary font families, emoji-as-icons, or private-use glyphs.
5. Theme: use one global `ThemeProvider`; `ThemeControl` owns system/light/dark preference and consumers must not mount a competing local theme controller.
6. Toasts: use `Toaster` / `notify*` from this package only — no second Sonner wrapper.
7. Dense tables: `DataTable` (client) vs `ServerDataTable` (server cursor) — do not overload one with the other. Use `WideScreenGate` for non-adaptable dense tables (`<=820px` gate).
8. Do **not** expect product `AppShell` / `TopBar` / route IA in this package — those stay in each app.
9. There is **no** separate `@swqt/ui-shell` package; import gate helpers from `@swqt/ui`.
10. HTML-first: use standard elements and attributes when they satisfy the full behavior contract; do not repeat implicit roles or simulate controls with neutral elements. See `docs/HTML-STANDARDS.md`.

## Import patterns

```tsx
import { ThemeProvider, Button, Card, WideScreenGate } from "@swqt/ui";
```

Deep imports also work: `@swqt/ui/button`, `@swqt/ui/theme`, `@swqt/ui/utils`, `@swqt/ui/wide-screen-gate`.
