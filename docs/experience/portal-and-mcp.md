# Portal and MCP delivery experience

Features: **F-SWQT-0004** (MVP) + **F-SWQT-0005** (Phase 2 catalog) + **F-SWQT-0006** (progressive-disclosure contract) — design-system portal + swui MCP.

## What shipped

### F-SWQT-0004 MVP

- `examples/portal` — Vite/React human portal with Overview, convention pages, `/packages`, and `/agent`.
- `scripts/sync-docs.mjs` — one-way SSOT sync from `packages/ui/docs`, `AGENTS.md`, and `llms.txt` into `.generated/`.
- `server/handlers.ts` — shared `/api/registry/*` and `/mcp/swui` handlers (preview/dev via Vite middleware; production via `server/index.ts`). Public URL: `https://agent.swqt.net/mcp/swui` via agent gateway.
- Registry integration — read-only metadata, 15min TTL cache, stale fallback, `REGISTRY_FIXTURE=1` for CI.
- swui MCP — resources (`AGENTS.md`, `ADOPTION.md`, `COMPONENT-CATALOG.md`) and tools (`swui.package.get`, `swui.package.installHint`).
- `packages/ui/docs/ADOPTION.md` — Portal MCP section + dual-slot `.cursor/mcp.json` example.

### F-SWQT-0005 Phase 2

- `/components` — grouped catalog index + per-export demo pages sourced from `COMPONENT-CATALOG.md`.
- `.generated/catalog-index.json` — structured catalog index generated during `sync-docs`.
- MCP extensions — `swui.catalog.search`, `swui.component.get`, and `swui://components/{name}` resources.
- CI — `check:catalog-export` validates catalog ↔ package exports ↔ portal demo registry.
- Playwright — `/components` index + representative demo walkthrough (Button, Dialog, FormField).

### F-SWQT-0006 progressive disclosure

- Canonical public endpoint: `https://agent.swqt.net/mcp/swui`; the Portal accepts only the exact `/mcp/swui` path.
- `resources/list`: 10 stable UI/token document entries; `resources/templates/list`: one `swui://components/{name}` template.
- `swui.catalog.search`: non-empty query, default limit 10, maximum 25, truthful `total/count/truncated`, and complete response budget of 16 KiB.
- All four tools expose titles, input/output schemas and read-only annotations, and return matching `structuredContent` plus JSON text.
- `swui.package.get` resolves exact versions and reports structured not-found plus registry source/freshness.
- Project Host files keep stdio `sw mcp` free of URL/token env keys and register `swui` as an independent HTTP slot.
- Installed tarball docs are byte-compared with `packages/*` SSOT by `verify:packed-consumer`.

## Commands

From repo root:

```bash
bun run sync-docs
bun run sync-docs:check
bun run check:catalog-export
bun run check:design-contract
bun run portal:dev
bun run portal:build
bun run --filter '@swqt/portal-example' typecheck
bun run --filter '@swqt/portal-example' test
bun run --filter '@swqt/portal-example' test:browser
bun run --filter '@swqt/portal-example' mcp:smoke
bun run verify:packed-consumer
sw doctor --project .
```

Production serve (after build):

```bash
cd examples/portal
REGISTRY_FIXTURE=1 NODE_ENV=production bun run start
```

Deploy runbook: [examples/portal/DEPLOY.md](../examples/portal/DEPLOY.md).

## Local iteration

Prefer [local validation fast paths](local-validation-fast-paths.md) during feature work: contract checks and `--grep` Playwright subsets before the full light/dark browser matrix. Full `test:browser` matches CI but includes a production build, axe scans, and ~2× project execution.

## Validation evidence

- Unit: sync-docs, catalog-index parser, registry-client, MCP tool payloads (package + catalog search/get).
- Browser: 26 Playwright cases across light/dark covering routes, theme toggle, packages UI, agent MCP docs, registry API, MCP initialize, and `/components` catalog demos.
- CI: `.github/workflows/quality.yml` includes portal build, sync-docs check, catalog-export check, unit tests, and browser matrix.
- Production identity and human Agent evidence: `blocked-with-reason(deployment/HITL evidence must be observed outside-in)`. On 2026-07-23, `ui.swqt.net` did not resolve and authenticated `/mcp/swui` still returned `sws` 0.1.144 (17 SWS tools, 0 `swui.*`, 0 templates); local/preview gates do not substitute for a post-deploy retest.

## Boundaries preserved

- No MCP/registry code inside `@swqt/ui` packages.
- No AppShell/product routes in portal.
- Playwright regression matrix remains in `examples/ui-consumer`.
- Host keeps separate `sw` and `swui` MCP slots (no sws facade in this Feature).
