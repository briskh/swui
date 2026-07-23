# `@swui/portal-example`

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
bun run --filter '@swui/portal-example' test
REGISTRY_FIXTURE=1 bun run --filter '@swui/portal-example' test:browser
bun run --filter '@swui/portal-example' mcp:smoke
```

## Production preview

```bash
bun run portal:build
cd examples/portal && REGISTRY_FIXTURE=1 NODE_ENV=production bun run start
```

See [DEPLOY.md](./DEPLOY.md) for release runbook.
