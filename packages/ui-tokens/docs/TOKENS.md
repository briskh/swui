# Token set (`@swqt/ui-tokens`)

Calibrated 2026-07-16; **eauth chroma alignment** pass 2026-07-23; **color lanes** pass 2026-07-24 (`docs/experience/color-lanes.md`). Values match `src/tokens.css`.

## Theme contract

| Axis | Contract |
|------|----------|
| Runtime (organization apps) | `@swqt/ui` ThemeProvider resolves global `system`, `light`, or `dark` preference; do not mount a competing selector. |
| CSS | `:root` (light) and `.dark` (reserved) both defined. |
| Authority | Published `src/tokens.css` is the value SSOT for consumers. |

Light mode: warm olive/brown primary on warm paper. Dark: **modern cool-neutral surfaces + warm brand accent** — see [color-lanes.md](../../docs/experience/color-lanes.md).

## Foundations

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | `oklch(0.965 0.008 92)` | `oklch(0.14 0.012 265)` | Page background |
| `--foreground` | `oklch(0.24 0.044 55)` | `oklch(0.93 0.01 265)` | Primary text |
| `--card` | `oklch(0.997 0.004 92)` | `oklch(0.19 0.013 265)` | Raised surfaces |
| `--card-foreground` | `oklch(0.24 0.044 55)` | `oklch(0.93 0.01 265)` | Text on cards |
| `--popover` | `oklch(0.997 0.004 92)` | `oklch(0.21 0.014 265)` | Overlay surfaces |
| `--popover-foreground` | `oklch(0.24 0.044 55)` | `oklch(0.93 0.01 265)` | Text on overlays |
| `--muted` | `oklch(0.955 0.01 92)` | `oklch(0.18 0.012 265)` | Quiet surfaces |
| `--muted-foreground` | `oklch(0.50 0.03 70)` | `oklch(0.62 0.018 265)` | Secondary text |
| `--primary` | `oklch(0.24 0.05 55)` | `oklch(0.76 0.11 68)` | Primary actions |
| `--primary-foreground` | `oklch(0.99 0.012 95)` | `oklch(0.18 0.04 68)` | On primary |
| `--secondary` | `oklch(0.935 0.012 92)` | `oklch(0.23 0.014 265)` | Secondary |
| `--secondary-foreground` | `oklch(0.28 0.04 55)` | `oklch(0.78 0.015 265)` | On secondary |
| `--accent` | `oklch(0.955 0.01 92)` | `oklch(0.22 0.025 72)` | Highlights |
| `--accent-foreground` | `oklch(0.24 0.05 55)` | `oklch(0.88 0.08 72)` | On accent |
| `--destructive` | `oklch(0.56 0.17 32)` | `oklch(0.62 0.17 25)` | Destructive button fill |
| `--destructive-foreground` | `oklch(0.99 0.006 32)` | `oklch(0.14 0.02 25)` | On destructive |
| `--border` | `oklch(0.915 0.012 92)` | `oklch(0.28 0.016 265)` | Borders |
| `--input` | `oklch(0.915 0.012 92)` | `oklch(0.26 0.015 265)` | Inputs |
| `--ring` | `oklch(0.24 0.05 55)` | `oklch(0.76 0.11 68)` | Focus ring |
| `--radius` | `8px` | `8px` | Panel radius base |

## Product semantics

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--status-ready` | `oklch(0.48 0.125 150)` | `oklch(0.72 0.14 155)` | Healthy |
| `--status-loading` | `oklch(0.24 0.05 55)` | `oklch(0.76 0.11 68)` | In-flight |
| `--status-error` | `oklch(0.56 0.17 32)` | `oklch(0.68 0.16 25)` | Failed (surface text/icons) |
| `--passkey` | `var(--status-ready)` | `var(--status-ready)` | WebAuthn CTA (= status-ready) |
| `--passkey-foreground` | `oklch(0.99 0.01 150)` | `oklch(0.14 0.04 155)` | Text on passkey |
| `--metric-instrument` | `oklch(0.24 0.05 55)` | `oklch(0.76 0.11 68)` | Instrument emphasis |
| `--metric-asset` | `oklch(0.50 0.03 70)` | `oklch(0.72 0.04 70)` | Asset emphasis |

Use `@swqt/ui` `Button variant="passkey"` for passkey step-up and WebAuthn CTAs; do not reuse `primary` for those flows.

### eauth reference drift (intentional)

| Token | eauth (`ui/src/index.css`) | swui | Reason |
|-------|---------------------------|------|--------|
| light `--destructive` / `--status-error` | `0.58` | `0.56` | AA on darker `--background` |
| dark `--accent-foreground` | `0.58 0.20 90` | `0.88 0.08 72` | Warm accent on elevated surface |
| dark `--status-error` vs `--destructive` | same token | split | Error copy AA on background; button fill separate |

Passkey aliases `--status-ready` in both themes; `--passkey-foreground` is the on-button contrast pair.

## Control scale

| Tailwind utility | Value | Intended use |
|---|---:|---|
| `h-control-micro` / `size-control-micro` | 24px | Dense table header filters |
| `h-control-xs` / `size-control-xs` | 28px | Calendar navigation controls |
| `h-control-compact` / `size-control-compact` | 28px | Compact controls and tabs |
| `h-control-sm` / `size-control-sm` | 30px | Menus and small controls |
| `h-control-md` / `size-control-md` | 32px | Default controls |
| `h-control-lg` / `size-control-lg` | 40px | Large controls and viewport inset |

## Typography

| Token / utility | Stack | Notes |
|-----------------|-------|-------|
| `--font-sans` / `font-sans` | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Default UI copy |
| `--font-serif` / `font-serif` | `ui-serif, "Songti SC", "SimSun", "Noto Serif CJK SC", "New York", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, Cambria, "Times New Roman", Times, serif` | Reading / editorial; **system-local only** (no CDN, no `@font-face` in package) |
| `--font-mono` / `font-mono` | `ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Noto Sans Mono CJK SC", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | Code, IDs, tokens; **system-local only** |

Use `font-serif` for long-form reading blocks, policy text, or headings where a serif voice is desired. Use `font-mono` for code, identifiers, and fixed-width data. Keep controls and dense UI on `font-sans`.

### TTY (`Tty`)

Fixed dark terminal canvas (`--tty-*` tokens) in both light and dark themes. Use `TtyLine` for one command/output row; `Tty` for sessions and logs. Copy strips `$` / `#` prompts from command lines via `stripShellPrompts`.

### Source code (`SourceCode`)

Syntax lanes on `--source-*` tokens (`--source-background` aliases `--card`). Pass `language` (`tsx`, `ts`, `js`, `json`, `css`, `bash`, …) for label + highlighting.
