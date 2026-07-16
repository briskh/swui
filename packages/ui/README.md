# `@swui/ui`

Skywalker React UI primitives (shadcn/Radix based) plus global `ThemeProvider`, `ThemeControl`, and `WideScreenGate`.

## AI / agents

**Start here after install:** [`AGENTS.md`](./AGENTS.md) · [`llms.txt`](./llms.txt)

| Doc | Purpose |
|-----|---------|
| [docs/DESIGN-SUMMARY.md](./docs/DESIGN-SUMMARY.md) | Patterns, a11y, responsive |
| [docs/COMPONENT-CATALOG.md](./docs/COMPONENT-CATALOG.md) | Component inventory |
| [docs/DO-AND-DONT.md](./docs/DO-AND-DONT.md) | Hard do/don't |
| [docs/ADOPTION.md](./docs/ADOPTION.md) | Install, Tailwind, ThemeProvider |

These files ship inside the npm tarball (`node_modules/@swui/ui/`).

## Install

```bash
bun add @swui/ui @swui/ui-tokens
```

Declare peer dependencies listed in `package.json` (React 19, Radix packages, lucide, etc.).

## Tailwind v4

```css
@import "tailwindcss";
@import "@swui/ui-tokens/tokens.css";
@source "../node_modules/@swui/ui/src";
```

## Theme

Runtime contract supports global `system`, `light`, and `dark` preferences. Use `ThemeProvider` as the only theme authority.

```tsx
import { ThemeProvider, Button, WideScreenGate } from "@swui/ui";

export function App() {
  return (
    <ThemeProvider>
      <Button>Save</Button>
    </ThemeProvider>
  );
}
```
