# Consumer foundation contract

Hard constraint for **this repository** and for **agents consuming swui MCP**. A UI change is not implementation-ready until it has actively consulted the relevant Portal references:

- Colors: `/colors` (SSOT utilities in `examples/portal/src/lib/token-showcase.ts`, values in `packages/ui-tokens/src/tokens.css`)
- Typography: `/typography` (type scale + font stacks + weights in the same showcase module)
- Icons: `/icons` (Lucide policy, sizing, accessible labeling, and named-import examples)
- Controls: `/components` and the exact `/components/<group>/<component>` demo

Public reference base: `https://ui.swqt.net`. Gates: `bun run check:design-contract` and `bun run check:html-standards`.

## Non-negotiable consumer rules

1. **Fonts and glyphs:** use only `font-sans`, `font-serif`, and `font-mono`, with the sizes and weights below. Do not add external/CDN fonts, arbitrary font families, emoji as interface glyphs, or private-use characters.
2. **Icons:** use `lucide-react` named imports only. Do not add another icon library, paste icon SVG paths, draw ad hoc SVG icons, or substitute emoji. Icon-only controls require an accessible name; decorative icons use `aria-hidden="true"`.
3. **Colors:** use the semantic token utilities below. Do not introduce raw color literals in component source or invent consumer-local design tokens.
4. **Controls:** use exported `@swqt/ui` primitives and documented variants. Do not copy component source, create a long-lived local fork, or simulate an available control with a neutral element.
5. **HTML:** read `swui://packages/ui/docs/HTML-STANDARDS.md`; use native elements and attributes when they satisfy the behavior contract, and add ARIA only for real semantic gaps.
6. **Reference site:** inspect `/colors`, `/typography`, `/icons`, and the exact component demo before implementation. The Portal is an active design reference, not optional promotional material.

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

## Icons and glyphs — allowed

Use named imports from `lucide-react`, for example:

```tsx
import { Search } from "lucide-react";
```

- Icons beside visible text are decorative and use `aria-hidden="true"`.
- Icon-only `Button` controls require an `aria-label`.
- Prefer the package component's documented icon size. Use semantic foreground utilities; do not give icons raw colors.
- Product or brand marks that cannot be represented by Lucide require a separately reviewed asset contract. They are not permission to paste arbitrary SVG into component code.

## Controls and HTML — allowed

- Search `@swqt/ui` first and use the exact component demo at `https://ui.swqt.net/components`.
- Import controls from `@swqt/ui`; never copy their source into a consuming app.
- Prefer native `<button>`, `<a>`, `<input>`, `<select>`, `<progress>`, `<table>`, and other standard elements where their semantics and behavior are sufficient.
- Do not attach redundant implicit roles or simulate buttons/links with `<div>` or `<span>`.
- Composite widgets may use Radix-backed package primitives when native HTML cannot satisfy the full interaction contract. Record the reason; do not invent a new local widget.

## MCP / Agent rule

After reading `swui://packages/ui/AGENTS.md`, read **`swui://foundation/contract`** (this file) and **`swui://packages/ui/docs/HTML-STANDARDS.md`**. Treat violations as blocking. Component MCP responses return these entries in `contractRefs` and absolute Portal pages in `referenceSite`.

## Changing the contract

1. Update the relevant Portal `/colors`, `/typography`, `/icons`, or `/components` reference.
2. Update `scripts/lib/foundation-allowlist.mjs` to match.
3. Adjust `packages/ui-tokens/src/tokens.css` when new semantic colors are required.
4. Run `bun run check:design-contract` and Portal browser tests.
