# `@swui/ui-tokens`

Skywalker design tokens for organization-wide Web UI style.

## AI / agents

**Start here after install:** [`AGENTS.md`](./AGENTS.md) · [`llms.txt`](./llms.txt)

| Doc | Purpose |
|-----|---------|
| [docs/TOKENS.md](./docs/TOKENS.md) | Token tables + theme contract |
| [docs/ADOPTION.md](./docs/ADOPTION.md) | Install and CSS wiring |

These files ship inside the npm tarball (`node_modules/@swui/ui-tokens/`).

## Install

```bash
bun add @swui/ui-tokens
```

Private registry (default): `https://npm.inet.swqt.net/` — override with `SWUI_NPM_REGISTRY`.

## Usage

```css
@import "tailwindcss";
@import "@swui/ui-tokens/tokens.css";
```

When also using `@swui/ui`, scan that package for Tailwind (`@source`) — see ui package docs.
