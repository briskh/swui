# @swqt/ui-tokens — Agent instructions

**Read this file first** when installing or changing Skywalker design tokens in any consuming project.

## What this package is

CSS design tokens for organization-wide organization Web UI style:

- Semantic CSS custom properties (`--primary`, `--background`, …)
- Tailwind CSS v4 `@theme inline` bridges
- `@custom-variant dark` (`.dark` class)

It does **not** include React components. For primitives (including `WideScreenGate`) use `@swqt/ui`.

## First hop (AI)

1. This file (`AGENTS.md`)
2. [`llms.txt`](./llms.txt) — compact index
3. [`docs/TOKENS.md`](./docs/TOKENS.md) — token tables and theme contract
4. [`docs/ADOPTION.md`](./docs/ADOPTION.md) — install and Tailwind wiring
5. MCP `swui://foundation/contract` and `swui://packages/ui/docs/HTML-STANDARDS.md`

Before building UI from tokens, actively consult `https://ui.swqt.net/colors`, `/typography`, `/icons`, and the exact `/components/...` demo.

## Hard rules

- Prefer semantic tokens (`bg-primary`, `text-muted-foreground`) over hard-coded chroma.
- Do **not** fork a second token file in the consumer; bump this package instead.
- Runtime theme contract supports light and dark values. Consumers select the effective theme through `@swqt/ui` `ThemeProvider`; do not fork token files or mount competing theme selectors.
- Token **values** in `src/tokens.css` are authoritative for published packages. Keep consumer docs aligned with that file.
- Tokens do not authorize consumer-local controls or arbitrary visuals: use `@swqt/ui` primitives, repository font stacks, and `lucide-react` named icon imports.
- Do not use external/CDN fonts, emoji-as-icons, another icon library, ad hoc SVG, raw colors, copied component source, or neutral elements that simulate native controls.
- Read the HTML-first contract before authoring markup; ARIA supplements semantic gaps and does not replace native HTML.

## Registry

Published on the public npm registry: `https://registry.npmjs.org/`. Override with `SWUI_NPM_REGISTRY` when consuming from an org mirror (for example `https://npm.inet.swqt.net/`).
