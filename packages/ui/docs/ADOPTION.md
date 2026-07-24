# Adopting `@swqt/ui`

## Install

```bash
bun add @swqt/ui @swqt/ui-tokens
```

Install peer dependencies listed in this package's `package.json` (React 19, Radix packages, lucide, sonner, etc.).

Published on the public npm registry (`https://registry.npmjs.org/`). Override with `SWUI_NPM_REGISTRY` only when using an org mirror.

## CSS + Tailwind v4

```css
@import "tailwindcss";
@import "@swqt/ui-tokens/tokens.css";
@source "../node_modules/@swqt/ui/src";
```

Adjust `@source` for monorepo / hoisting.

## App shell sketch

```tsx
import { ThemeProvider, ThemeControl, Button, Toaster, WideScreenGate } from "@swqt/ui";

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

## Detail page pattern

For admin list → detail flows:

| Surface | Use |
|---------|-----|
| Dense list | `ServerDataTable` (+ `WideScreenGate` when non-adaptable) |
| Detail fields | `DescriptionList` / `DescriptionItem` / `DescriptionSection` |
| UUID / client_id / URLs | `CopyableText` or `DescriptionItem copyable` |
| JSON / JWKS / audit payload | `SourceCode` (full-span item; pretty-print in the caller) |
| Navigation | `Breadcrumb` / `BreadcrumbTrail` |

Keep product `PageHeader`, routes, permissions, and edit `Dialog`s in the app. Do not build a parallel detail-field grid in the consumer.

## AI docs inside the installed package

After install, agents should read from `node_modules/@swqt/ui/`:

- `AGENTS.md` (first hop)
- `llms.txt`
- `docs/HTML-STANDARDS.md` before writing markup
- the remaining `docs/*` as needed

Same pattern for `@swqt/ui-tokens`.

## Portal MCP (pre-install discovery)

Before installing the packages, agents may query the read-only **swui** MCP server.

| Entry | URL |
|-------|-----|
| **Production (canonical)** | `https://agent.swqt.net/mcp/swui` |
| **Local dev / preview** | `http://127.0.0.1:4176/mcp/swui` |

The shared agent gateway (`agent.swqt.net`) routes `/mcp/swui` to the portal MCP handler. Human browsing stays on the portal site (`ui.swqt.net` when deployed); agents use the URL above.

Use **swui** for component catalog resources, adoption snippets, and registry metadata. Keep the separate **sw** MCP server for SWS methodology and workflow tools. After install, prefer version-locked docs in `node_modules/@swqt/ui/AGENTS.md`.

MCP tools (read-only):

| Tool | Purpose |
|------|---------|
| `swui.package.get` | Registry metadata for `@swqt/ui` / `@swqt/ui-tokens` |
| `swui.package.installHint` | `.npmrc` template + npm/bun install commands |
| `swui.catalog.search` | Keyword search over `COMPONENT-CATALOG` exports |
| `swui.component.get` | Single export details + portal demo path |

Use progressive disclosure:

1. Read `swui://packages/ui/llms.txt` and `swui://packages/ui/AGENTS.md`.
2. Read the blocking `swui://foundation/contract` and `swui://packages/ui/docs/HTML-STANDARDS.md`.
3. Actively inspect `https://ui.swqt.net/colors`, `/typography`, `/icons`, and the exact component demo.
4. Call `swui.catalog.search` with a non-empty query (default limit 10, maximum 25).
5. Read one exact `swui://components/{name}` resource or call `swui.component.get`; follow its `contractRefs` and absolute `referenceSite` URLs.
6. Call `swui.package.get` with an exact `version` before installing, and compare `sourceVersion` with `releaseStatus`.

`resources/list` contains only the stable package-document first hop; components are exposed through the single URI template. Tool results include both `structuredContent` and equivalent JSON text.

The consumer contract is strict: exported `@swqt/ui` controls, semantic tokens, repository font stacks, Lucide named imports, and native HTML-first semantics only. Do not substitute copied controls, raw colors, external fonts, emoji, another icon library, or ad hoc SVG.

Example `.cursor/mcp.json` fragment:

```json
{
  "mcpServers": {
    "sw": {
      "command": "sw",
      "args": ["mcp"]
    },
    "swui": {
      "url": "https://agent.swqt.net/mcp/swui"
    }
  }
}
```

`sw` resolves its center endpoint and credentials from `~/.sw/config.json`; do not place `SW_MCP_*` URL or token keys in project Host configuration.

Private registry install still requires `_authToken` in `.npmrc`; public npmjs.org install does not. MCP does not mirror tarballs.
