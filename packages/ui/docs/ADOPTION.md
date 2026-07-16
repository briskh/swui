# Adopting `@swui/ui`

## Install

```bash
bun add @swui/ui @swui/ui-tokens
```

Install peer dependencies listed in this package's `package.json` (React 19, Radix packages, lucide, sonner, etc.).

Private registry default: `https://npm.inet.swqt.net/` (`SWUI_NPM_REGISTRY`).

## CSS + Tailwind v4

```css
@import "tailwindcss";
@import "@swui/ui-tokens/tokens.css";
@source "../node_modules/@swui/ui/src";
```

Adjust `@source` for monorepo / hoisting.

## App shell sketch

```tsx
import { ThemeProvider, Button, Toaster, WideScreenGate } from "@swui/ui";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
```

## AI docs inside the installed package

After install, agents should read from `node_modules/@swui/ui/`:

- `AGENTS.md` (first hop)
- `llms.txt`
- `docs/*`

Same pattern for `@swui/ui-tokens`.
