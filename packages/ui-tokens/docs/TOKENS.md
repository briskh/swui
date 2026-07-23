# Token set (`@swqt/ui-tokens`)

Calibrated 2026-07-16; **eauth chroma alignment** pass 2026-07-23 (`../eauth/ui/src/index.css` as reference for passkey + minor drift). Values match `src/tokens.css`.

## Theme contract

| Axis | Contract |
|------|----------|
| Runtime (organization apps) | `@swqt/ui` ThemeProvider resolves global `system`, `light`, or `dark` preference; do not mount a competing selector. |
| CSS | `:root` (light) and `.dark` (reserved) both defined. |
| Authority | Published `src/tokens.css` is the value SSOT for consumers. |

Light mode: warm olive/brown primary on warm paper. Dark (reserved): high-chroma gold primary on cool charcoal.

## Foundations

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | `oklch(0.985 0.008 92)` | `oklch(0.16 0.008 260)` | Page background |
| `--foreground` | `oklch(0.24 0.044 65)` | `oklch(0.96 0.008 95)` | Primary text |
| `--card` | `oklch(0.997 0.004 92)` | `oklch(0.20 0.01 260)` | Raised surfaces |
| `--card-foreground` | `oklch(0.24 0.044 65)` | `oklch(0.96 0.008 95)` | Text on cards |
| `--popover` | `oklch(0.997 0.004 92)` | `oklch(0.20 0.01 260)` | Overlay surfaces |
| `--popover-foreground` | `oklch(0.24 0.044 65)` | `oklch(0.96 0.008 95)` | Text on overlays |
| `--muted` | `oklch(0.955 0.01 92)` | `oklch(0.28 0.012 260)` | Quiet surfaces |
| `--muted-foreground` | `oklch(0.50 0.03 70)` | `oklch(0.72 0.012 260)` | Secondary text |
| `--primary` | `oklch(0.24 0.05 65)` | `oklch(0.80 0.22 92)` | Primary actions |
| `--primary-foreground` | `oklch(0.99 0.012 95)` | `oklch(0.16 0.05 92)` | On primary |
| `--secondary` | `oklch(0.935 0.012 92)` | `oklch(0.26 0.015 260)` | Secondary |
| `--secondary-foreground` | `oklch(0.28 0.04 65)` | `oklch(0.93 0.01 95)` | On secondary |
| `--accent` | `oklch(0.955 0.01 92)` | `oklch(0.94 0.14 95)` | Highlights |
| `--accent-foreground` | `oklch(0.24 0.05 65)` | `oklch(0.50 0.03 70)` | On accent |
| `--destructive` | `oklch(0.575 0.17 32)` | `oklch(0.68 0.16 32)` | Errors |
| `--destructive-foreground` | `oklch(0.99 0.006 32)` | `oklch(0.14 0.02 32)` | On destructive |
| `--border` | `oklch(0.865 0.02 80)` | `oklch(0.36 0.015 260)` | Borders |
| `--input` | `oklch(0.865 0.02 80)` | `oklch(0.38 0.018 260)` | Inputs |
| `--ring` | `oklch(0.24 0.05 65)` | `oklch(0.80 0.22 92)` | Focus ring |
| `--radius` | `8px` | `8px` | Panel radius base |

## Product semantics

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--status-ready` | `oklch(0.48 0.125 150)` | `oklch(0.72 0.13 150)` | Healthy |
| `--status-loading` | `oklch(0.24 0.05 65)` | `oklch(0.80 0.22 92)` | In-flight |
| `--status-error` | `oklch(0.575 0.17 32)` | `oklch(0.72 0.15 32)` | Failed |
| `--passkey` | `oklch(0.42 0.10 210)` | `oklch(0.72 0.12 210)` | WebAuthn / passkey primary CTA (teal; distinct from warm primary) |
| `--passkey-foreground` | `oklch(0.99 0.01 210)` | `oklch(0.16 0.04 210)` | Text on passkey CTA |
| `--metric-instrument` | `oklch(0.24 0.05 65)` | `oklch(0.80 0.22 92)` | Instrument emphasis |
| `--metric-asset` | `oklch(0.50 0.03 70)` | `oklch(0.72 0.20 72)` | Asset emphasis |

Use `@swqt/ui` `Button variant="passkey"` for passkey step-up and WebAuthn CTAs; do not reuse `primary` for those flows.

### eauth reference drift (intentional)

| Token | eauth (`ui/src/index.css`) | swui | Reason |
|-------|---------------------------|------|--------|
| light `--destructive` / `--status-error` | `0.58` | `0.575` | Keeps `check:design-contract` WCAG AA on `--background` |
| dark `--accent-foreground` | `0.58 0.20 90` | `0.50 0.03 70` | eauth value fails AA on `--accent` surface; swui keeps readable accent text |

Passkey chroma and `Button variant="passkey"` match eauth exactly.

## Control scale

| Tailwind utility | Value | Intended use |
|---|---:|---|
| `h-control-micro` / `size-control-micro` | 24px | Dense table header filters |
| `h-control-xs` / `size-control-xs` | 28px | Calendar navigation controls |
| `h-control-compact` / `size-control-compact` | 32px | Compact controls and tabs |
| `h-control-sm` / `size-control-sm` | 36px | Menus and small controls |
| `h-control-md` / `size-control-md` | 40px | Default controls |
| `h-control-lg` / `size-control-lg` | 48px | Large controls and viewport inset |

## Typography

Font stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
