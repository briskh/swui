# `@swqt/portal-example`

Design-system portal MVP for human browsing, registry install guidance, and read-only swui MCP.

## Run

From repo root:

```bash
bun install
bun run portal:dev
```

Open `http://127.0.0.1:4176`.

## Tests

```bash
bun run sync-docs:check
bun run check:design-contract
bun run check:catalog-export
bun run --filter '@swqt/portal-example' typecheck
bun run --filter '@swqt/portal-example' test
REGISTRY_FIXTURE=1 bun run --filter '@swqt/portal-example' test:browser
bun run --filter '@swqt/portal-example' mcp:smoke
bun run verify:packed-consumer
```

The swui handler accepts only `/mcp/swui`. `/mcp`, `/mcp/sws`, unknown `/mcp/*`, and child paths are not aliases.

MCP discovery starts with 10 package-document resources and one `swui://components/{name}` template. Catalog search requires a non-empty query, defaults to 10 results, caps at 25, and keeps the complete dual-form response within 16 KiB.

## Production preview

```bash
bun run portal:build
cd examples/portal && REGISTRY_FIXTURE=1 NODE_ENV=production bun run start
```

See [DEPLOY.md](./DEPLOY.md) for release runbook.
