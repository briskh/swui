# Adopting `@swqt/ui-tokens`

## Install

```bash
bun add @swqt/ui-tokens
# or: npm install @swqt/ui-tokens
```

Published on the public npm registry (`https://registry.npmjs.org/`). Set `SWUI_NPM_REGISTRY` only for an org mirror.

## CSS entry

```css
@import "tailwindcss";
@import "@swqt/ui-tokens/tokens.css";
```

Import tokens **after** Tailwind (or ensure theme bridges apply). App-only base styles (body margin, etc.) stay in the consumer.

## With `@swqt/ui`

If you also use primitives, scan package sources so utilities inside components are generated:

```css
@import "tailwindcss";
@import "@swqt/ui-tokens/tokens.css";
@source "../node_modules/@swqt/ui/src";
```

Adjust `@source` paths for your layout (hoisted monorepo vs nested `node_modules`).

## Agent discovery

Before install, connect the read-only `swui` MCP at `https://agent.swqt.net/mcp/swui` and read:

- `swui://packages/ui-tokens/llms.txt`
- `swui://packages/ui-tokens/AGENTS.md`
- `swui://packages/ui-tokens/docs/ADOPTION.md`
- `swui://packages/ui-tokens/docs/TOKENS.md`

After install, prefer the same-version files under `node_modules/@swqt/ui-tokens/`.

## Do not

- Copy `tokens.css` into the app and diverge.
- Invent parallel `--color-*` tokens for the same semantics.
- Mount a competing `.dark` selector; use `@swqt/ui` `ThemeProvider` as the global theme authority.
