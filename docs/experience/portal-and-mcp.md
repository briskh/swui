# Portal and MCP delivery experience

Features: **F-SWQT-0004** (MVP) + **F-SWQT-0005** (Phase 2 catalog) — design-system portal + swui MCP (R-SWUI-002 §11.1–§11.2).

## What shipped

### F-SWQT-0004 MVP

- `examples/portal` — Vite/React human portal with Overview, convention pages, `/packages`, and `/agent`.
- `scripts/sync-docs.mjs` — one-way SSOT sync from `packages/ui/docs`, `AGENTS.md`, and `llms.txt` into `.generated/`.
- `server/handlers.ts` — shared `/api/registry/*` and `/mcp` handlers (preview/dev via Vite middleware; production via `server/index.ts`).
- Registry integration — read-only metadata, 15min TTL cache, stale fallback, `REGISTRY_FIXTURE=1` for CI.
- swui MCP — resources (`AGENTS.md`, `ADOPTION.md`, `COMPONENT-CATALOG.md`) and tools (`swui.package.get`, `swui.package.installHint`).
- `packages/ui/docs/ADOPTION.md` — Portal MCP section + dual-slot `.cursor/mcp.json` example.

### F-SWQT-0005 Phase 2

- `/components` — grouped catalog index + per-export demo pages sourced from `COMPONENT-CATALOG.md`.
- `.generated/catalog-index.json` — structured catalog index generated during `sync-docs`.
- MCP extensions — `swui.catalog.search`, `swui.component.get`, and `swui://components/{name}` resources.
- CI — `check:catalog-export` validates catalog ↔ package exports ↔ portal demo registry.
- Playwright — `/components` index + representative demo walkthrough (Button, Dialog, FormField).

## Commands

From repo root:

```bash
bun run sync-docs
bun run sync-docs:check
bun run check:catalog-export
bun run portal:dev
bun run portal:build
bun run --filter '@swui/portal-example' test
bun run --filter '@swui/portal-example' test:browser
bun run --filter '@swui/portal-example' mcp:smoke
```

Production serve (after build):

```bash
cd examples/portal
REGISTRY_FIXTURE=1 NODE_ENV=production bun run start
```

Deploy runbook: [examples/portal/DEPLOY.md](../examples/portal/DEPLOY.md).

## Validation evidence

- Unit: sync-docs, catalog-index parser, registry-client, MCP tool payloads (package + catalog search/get).
- Browser: 26 Playwright cases across light/dark covering routes, theme toggle, packages UI, agent MCP docs, registry API, MCP initialize, and `/components` catalog demos.
- CI: `.github/workflows/quality.yml` includes portal build, sync-docs check, catalog-export check, unit tests, and browser matrix.
- Production DNS/deploy: `blocked-with-reason(infra)` until `ui.swqt.net` ingress is provisioned; local/preview smoke satisfies acceptance.

## Boundaries preserved

- No MCP/registry code inside `@swui/ui` packages.
- No AppShell/product routes in portal.
- Playwright regression matrix remains in `examples/ui-consumer`.
- Host keeps separate `sw` and `swui` MCP slots (no sws facade in this Feature).
