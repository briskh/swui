# `@swqt/ui-tokens`

Skywalker design tokens for organization-wide Web UI style.

## AI / agents

**Start here after install:** [`AGENTS.md`](./AGENTS.md) · [`llms.txt`](./llms.txt)

| Doc | Purpose |
|-----|---------|
| [docs/TOKENS.md](./docs/TOKENS.md) | Token tables + theme contract |
| [docs/ADOPTION.md](./docs/ADOPTION.md) | Install and CSS wiring |

These files ship inside the npm tarball (`node_modules/@swqt/ui-tokens/`).

## Install

```bash
bun add @swqt/ui-tokens
```

Also available on [npmjs.org](https://www.npmjs.com/package/@swqt/ui-tokens) as `@swqt/ui-tokens`.

## Usage

```css
@import "tailwindcss";
@import "@swqt/ui-tokens/tokens.css";
```

When also using `@swqt/ui`, scan that package for Tailwind (`@source`) — see ui package docs.
