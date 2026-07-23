# Portal deploy runbook

Production target: `https://ui.swqt.net` (static SPA + same-origin `/mcp` and `/api/registry`).

## Release sequence

1. Merge portal changes to the release branch.
2. Tag and publish npm packages when needed:

   ```bash
   ./scripts/publish.sh --apply
   ```

3. Build the portal artifact:

   ```bash
   bun install --frozen-lockfile
   bun run sync-docs
   bun run --filter '@swui/portal-example' build
   ```

4. Deploy `examples/portal/dist` as static assets and run `examples/portal/server/index.ts` (Bun) behind ingress:
   - `/` → static SPA
   - `/mcp` → MCP handler
   - `/api/registry/*` → registry metadata API

5. Smoke after deploy:

   ```bash
   REGISTRY_FIXTURE=0 curl -fsS https://ui.swqt.net/api/registry/@swui%2fui
   bun run --filter '@swui/portal-example' mcp:smoke
   ```

## Local verification

```bash
bun run sync-docs
bun run --filter '@swui/portal-example' test
REGISTRY_FIXTURE=1 bun run --filter '@swui/portal-example' test:browser
```

## External dependency

If production ingress is not yet available, record `blocked-with-reason(infra)` and keep local/staging smoke as the acceptance evidence for MCP and portal build gates.
