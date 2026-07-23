# Portal and MCP delivery experience

Features: **F-SWQT-0004** (MVP) + **F-SWQT-0005** (Phase 2 catalog) + **F-SWQT-0006** (progressive disclosure) + **F-SWQT-0008** (consumer contract and release freshness) — design-system portal + swui MCP.

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

### F-SWQT-0008 consumer contract and release freshness

- `resources/list`: 12 stable UI/token/contract entries, including `swui://foundation/contract` and `swui://packages/ui/docs/HTML-STANDARDS.md`; one component resource template remains the L2 disclosure path.
- `catalog.search`, `component.get`, and exact component resources return compact mandatory `contractRefs` plus absolute `referenceSite` URLs.
- `/icons` is the visible Lucide named-import and accessibility policy reference. `/agent` requires active consultation of `/colors`, `/typography`, `/icons`, and exact component demos.
- `swui.package.get` distinguishes registry versions from deployed source via `sourceVersion`, `sourcePublished`, and `releaseStatus`.
- The `1.1.0` candidate delta and four-surface evidence rules are recorded in [release-delta-1.1.0.md](release-delta-1.1.0.md).

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
- Browser: 60/60 Playwright cases pass across light/dark routes, theme toggle, foundation and icon references, packages UI, agent MCP docs, registry API, MCP initialize, HTML conformance, and `/components` catalog demos.
- CI: `.github/workflows/quality.yml` includes portal build, sync-docs check, catalog-export check, unit tests, and browser matrix.
- Production identity observed outside-in on 2026-07-24: anonymous `https://agent.swqt.net/mcp/swui` identifies `swui` `1.0.0` with 10 resources and old Button payloads; npm packages remain `1.0.0`. `https://ui.swqt.net` returns the deployed Portal, but `/icons` has no Icons heading and `/agent` has no foundation-contract entry. This remains intentionally distinct from the local `1.1.0` candidate until a separately authorized publish/deploy. Local/preview gates do not substitute for a post-deploy retest.

## Boundaries preserved

- No MCP/registry code inside `@swqt/ui` packages.
- No AppShell/product routes in portal.
- Playwright regression matrix remains in `examples/ui-consumer`.
- Host keeps separate `sw` and `swui` MCP slots (no sws facade in this Feature).
