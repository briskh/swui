# Adopting `@swui/ui-tokens`

## Install

```bash
bun add @swui/ui-tokens
# or: npm / pnpm against SWUI_NPM_REGISTRY (default https://npm.inet.swqt.net/)
```

## CSS entry

```css
@import "tailwindcss";
@import "@swui/ui-tokens/tokens.css";
```

Import tokens **after** Tailwind (or ensure theme bridges apply). App-only base styles (body margin, etc.) stay in the consumer.

## With `@swui/ui`

If you also use primitives, scan package sources so utilities inside components are generated:

```css
@import "tailwindcss";
@import "@swui/ui-tokens/tokens.css";
@source "../node_modules/@swui/ui/src";
```

Adjust `@source` paths for your layout (hoisted monorepo vs nested `node_modules`).

## Do not

- Copy `tokens.css` into the app and diverge.
- Invent parallel `--color-*` tokens for the same semantics.
- Mount a competing `.dark` selector; use `@swui/ui` `ThemeProvider` as the global theme authority.
