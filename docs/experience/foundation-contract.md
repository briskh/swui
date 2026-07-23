# Foundation contract (colors + typography)

Hard constraint for **this repository** and for **agents consuming swui MCP**. Visual work MUST stay inside the Portal foundation pages:

- Colors: `/colors` (SSOT utilities in `examples/portal/src/lib/token-showcase.ts`, values in `packages/ui-tokens/src/tokens.css`)
- Typography: `/typography` (type scale + font stacks + weights in the same showcase module)

Gate: `bun run check:design-contract`

## Colors — allowed

Use semantic Tailwind utilities only (`text-*`, `bg-*`, `border-*`, `ring-*`, …) drawn from:

| Lane | Utilities |
|------|-----------|
| Foundations | `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `muted`, `muted-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `passkey`, `passkey-foreground`, `border`, `input`, `ring` |
| Product semantics | `status-ready`, `status-loading`, `status-error`, `metric-instrument`, `metric-asset` |
| Structural | `transparent`, `current`, `inherit` |

Opacity modifiers (`/10`, `/30`, `/60`, …) are allowed on the tokens above.

### Component lanes (still token-backed)

These are not separate Portal swatches but are allowed because they map to `--*` tokens in `tokens.css`:

- **Source code** — `var(--source-*)` syntax highlighting
- **TTY** — `var(--tty-*)` terminal canvas (fixed dark in every theme)

Do **not** introduce new `--*` color tokens or raw `#hex` / `oklch()` / `rgb()` in component source. Change `tokens.css`, refresh `/colors`, then consume via utilities or documented `var(--*)` lanes.

## Typography — allowed

| Category | Allowed classes |
|----------|-----------------|
| Font stacks | `font-sans`, `font-serif`, `font-mono` |
| Sizes | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl` |
| Weights | `font-normal`, `font-medium`, `font-semibold` |

Combine sizes and weights freely (e.g. `text-lg font-semibold` for dialog titles). Do not add `text-4xl+`, `font-bold`, ad hoc `text-[…]` sizes, or external webfont/CDN imports.

Documented micro-size exceptions live in [design-contract-exceptions.md](design-contract-exceptions.md) (monospace panels, calendar weekday labels).

## MCP / Agent rule

After reading `swui://packages/ui/AGENTS.md`, read **`swui://foundation/contract`** (this file). Treat violations as blocking — fix or extend the foundation pages + allowlist before shipping UI.

## Changing the contract

1. Update Portal `/colors` or `/typography` showcase (`token-showcase.ts`).
2. Update `scripts/lib/foundation-allowlist.mjs` to match.
3. Adjust `packages/ui-tokens/src/tokens.css` when new semantic colors are required.
4. Run `bun run check:design-contract` and Portal browser tests.
