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
import { ThemeProvider, ThemeControl, Button, Toaster, WideScreenGate } from "@swui/ui";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeControl />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
```

`ThemeProvider` supports `system`, `light`, and `dark` preferences. For applications that render their document head, place `themeInitializationScript` inline before the application bundle to prevent an initial color flash.

## AI docs inside the installed package

After install, agents should read from `node_modules/@swui/ui/`:

- `AGENTS.md` (first hop)
- `llms.txt`
- `docs/*`

Same pattern for `@swui/ui-tokens`.
