# Local validation fast paths

Project-layer guidance for **fast iteration** vs **pre-commit / CI** validation. Agents and humans should prefer the tier that matches the change surface.

## Tiers

| Tier | When | Typical duration | Commands |
| --- | --- | --- | --- |
| **Contract** | Docs/catalog/token edits; new `@swqt/ui` export | sub-second | `node scripts/check-catalog-export.mjs`, `node scripts/check-design-contract.mjs`, `bun run sync-docs:check` |
| **Typecheck** | TS/TSX changes in portal or ui-consumer | few seconds | `bun run --filter '@swqt/portal-example' typecheck` |
| **Targeted browser** | UI component or portal page touched | ~5–15 s | See [Playwright subsets](#playwright-subsets) |
| **Full browser** | Release, large portal/nav change, CI parity | ~10–60+ s | `REGISTRY_FIXTURE=1 bun run --filter '@swqt/portal-example' test:browser` and `bun run --filter '@swqt/ui-consumer-example' test:browser` |

**Do not** run the full portal browser matrix after every small UI tweak. Reserve it for merge-ready verification.

## Why full portal browser tests feel slow

`examples/portal/playwright.config.mjs`:

1. **Production build before tests** — `webServer` runs `bun run build && vite preview` unless an existing server on `:4176` is reused (`reuseExistingServer: !process.env.CI`).
2. **Light + dark projects** — each spec runs twice (~42 executions for the current suite).
3. **Axe WCAG scans** — foundation, convention, packages, agent, and components index pages call `@axe-core/playwright`; heavy pages (e.g. `/components` with full catalog) add seconds per run.
4. **Sequential execution** — `fullyParallel: false`.
5. **Slow cases** — packages registry UI and multi-route navigation tests often take multiple seconds each.

A hung or stale `:4176` process (dev `vite` vs preview build mismatch) can push a run toward **minutes**; stop conflicting servers before a full run.

## Playwright subsets

From repo root or `examples/portal`:

```bash
# Table of contents / convention markdown / components index
bun run --filter '@swqt/portal-example' test:browser --grep "toc|convention|components index"

# Data-display primitives (SourceCode, Tty, Card)
bun run --filter '@swqt/portal-example' test:browser --grep "source code|Card"

# Single demo smoke
bun run --filter '@swqt/portal-example' test:browser --grep "button demo"

# One project only (halves matrix time)
bun run --filter '@swqt/portal-example' test:browser --project light
```

Prefer **`--grep`** aligned to the files you changed; add **`--project light`** when dark parity is not in scope.

## Typecheck pitfalls

| Mistake | Fix |
| --- | --- |
| `bun run --filter '@swqt/ui' exec tsc --noEmit` | `@swqt/ui` has **no** `typecheck` script; use portal or ui-consumer |
| Assuming UI package typecheck | `bun run --filter '@swqt/portal-example' typecheck` (client + server TS) |
| Theme/dimensions matrix | `bun run --filter '@swqt/ui-consumer-example' test:browser` (separate Playwright config) |

## Recommended agent loop

After implementing a portal or `@swqt/ui` change:

1. **Contract** — if catalog/docs/exports moved: `bun run sync-docs` then `node scripts/check-catalog-export.mjs`.
2. **Typecheck** — `bun run --filter '@swqt/portal-example' typecheck` when TSX changed.
3. **Targeted browser** — `--grep` for the touched route or component name.
4. **Full browser** — only before handoff, or when CI/browser regressions are the explicit task.

Manual spot-check: `bun run portal:dev` → http://127.0.0.1:4176/ (HMR; not a substitute for preview-based Playwright).

## CI reference

Full gates live in `.github/workflows/quality.yml`. Local fast paths are **subsets**; CI remains authoritative for merge.

See also: [Portal and MCP delivery experience](portal-and-mcp.md), [Core theme/state quality matrix](quality-matrix.md).
