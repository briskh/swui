# Color lanes (OKLCH)

Dark-mode palette for `@swqt/ui-tokens`. Values in `packages/ui-tokens/src/tokens.css`.

## Dark theme concept — modern cool-neutral + warm brand

Abandons monochrome CRT phosphor. Dark surfaces use a **cool slate hue (~265°)** with **elevation = lighter layers** (Material / shadcn pattern). Copy is high-contrast neutral white-gray. **Primary** keeps the warm olive-gold brand from light mode (H≈68°). **Passkey** aliases **status-ready** (green product lane).

Light mode is unchanged: warm paper + olive primary.

## Lanes (dark)

| Lane | Role |
|------|------|
| **Surface** | Cool slate grays — background → popover elevation ladder |
| **Copy** | Neutral foreground steps (foreground / secondary / muted) |
| **Brand** | Warm primary + accent highlights |
| **Product** | Passkey (= status-ready), status green/red, metric tints |

## Surface elevation

Higher L = more elevated (no shadow dependency).

| Step | Token | oklch |
|-----:|-------|-------|
| 0 | `--background` | `0.14 0.012 265` |
| 1 | `--muted` | `0.18 0.012 265` |
| 2 | `--card` | `0.19 0.013 265` |
| 3 | `--popover` | `0.21 0.014 265` |
| 4 | `--secondary` | `0.23 0.014 265` |
| — | `--input` | `0.26 0.015 265` |
| — | `--border` | `0.28 0.016 265` |

## Copy steps

| Token | oklch |
|-------|-------|
| `--foreground` | `0.93 0.01 265` |
| `--secondary-foreground` | `0.78 0.015 265` |
| `--muted-foreground` | `0.62 0.018 265` |

## Brand + accent

| Token | oklch |
|-------|-------|
| `--primary` | `0.76 0.11 68` |
| `--primary-foreground` | `0.18 0.04 68` |
| `--accent` | `0.22 0.025 72` |
| `--accent-foreground` | `0.88 0.08 72` |

## Product semantics

| Token | oklch | Notes |
|-------|-------|-------|
| `--status-ready` | `0.72 0.14 155` | Healthy; passkey alias source |
| `--passkey` | `var(--status-ready)` | WebAuthn CTA |
| `--passkey-foreground` | `0.14 0.04 155` | On passkey |
| `--status-error` | `0.68 0.16 25` | Error text/icons on surfaces |
| `--destructive` | `0.62 0.17 25` | Destructive button fill |
| `--destructive-foreground` | `0.14 0.02 25` | On destructive button |

`--status-error` is lighter than `--destructive` so error copy meets AA on `--background`; destructive button uses dark label on saturated fill.

## Aliases

```css
--ring: var(--primary);
--status-loading: var(--primary);
--metric-instrument: var(--primary);
--card-foreground: var(--foreground);
--popover-foreground: var(--foreground);
```

## Validation

- `bun run check:design-contract`
- Portal `/colors` in dark
- `bun run --filter '@swqt/ui-consumer-example' test:browser`

## Tuning

- **Surfaces too flat** → widen L gaps between elevation steps (+0.02–0.03)
- **Primary too loud** → lower `--primary` C (0.11 → 0.09) or L (0.76 → 0.72)
- **Borders invisible** → raise `--border` L or C slightly
- **Muted text weak** → raise `--muted-foreground` L (0.62 → 0.65)
