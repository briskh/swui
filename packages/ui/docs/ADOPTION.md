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

## Portal MCP (pre-install discovery)

Before installing the packages, agents may query the read-only **swui** MCP server hosted by the design-system portal (`https://ui.swqt.net/mcp` in production; local portal dev/preview exposes the same `/mcp` route).

Use **swui** for component catalog resources, adoption snippets, and registry metadata. Keep the separate **sw** MCP server for SWS methodology and workflow tools. After install, prefer version-locked docs in `node_modules/@swui/ui/AGENTS.md`.

MCP tools (read-only):

| Tool | Purpose |
|------|---------|
| `swui.package.get` | Registry metadata for `@swui/ui` / `@swui/ui-tokens` |
| `swui.package.installHint` | `.npmrc` template + npm/bun install commands |
| `swui.catalog.search` | Keyword search over `COMPONENT-CATALOG` exports |
| `swui.component.get` | Single export details + portal demo path |

Resources include `swui://docs/*` plus `swui://components/{ExportName}` entries aligned with the portal catalog.

Example `.cursor/mcp.json` fragment:

```json
{
  "mcpServers": {
    "sw": {
      "command": "sw",
      "args": ["mcp"],
      "env": {
        "SW_MCP_URL": "https://agent.swqt.net/mcp",
        "SW_MCP_TOKEN": "${SW_MCP_TOKEN}"
      }
    },
    "swui": {
      "url": "https://ui.swqt.net/mcp"
    }
  }
}
```

Private registry install still requires `_authToken` in `.npmrc`; MCP does not mirror tarballs.
