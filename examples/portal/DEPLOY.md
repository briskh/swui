# Portal deploy runbook

## Public URLs

| Surface | URL |
|---------|-----|
| Human portal (SPA) | `https://ui.swqt.net` |
| **swui MCP (canonical)** | **`https://agent.swqt.net/mcp/swui`** |
| Registry API (portal origin) | `https://ui.swqt.net/api/registry/*` |

Agents should configure **`swui`** → `https://agent.swqt.net/mcp/swui` (same host family as SWS `sw` MCP).

## Topology

```
Cursor / Agent
    │  swui.url = https://agent.swqt.net/mcp/swui
    ▼
agent.swqt.net (Caddy gateway)
    │  /mcp/swui → reverse proxy (path preserved)
    ▼
ui.swqt.net portal Bun server
    │  /mcp/swui → handleMcpHttpRequest()
    ▼
examples/portal/server/handlers.ts (swui MCP)
```

Gateway config reference: `sws/debian/caddy/agent.swqt.net.caddy` (upstream `https://ui.swqt.net`, `Host: ui.swqt.net`).

Local dev exposes the same exact mount path: `http://127.0.0.1:4176/mcp/swui`. The Portal must not handle `/mcp`, `/mcp/sws`, unknown `/mcp/*`, or `/mcp/swui/*`.

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
   bun run --filter '@swqt/portal-example' build
   ```

4. Deploy `examples/portal/dist` as static assets and run `examples/portal/server/index.ts` (Bun) behind ingress:
   - `/` → static SPA
   - `/mcp/swui` → MCP handler (canonical)
   - `/api/registry/*` → registry metadata API

5. Smoke after deploy:

   ```bash
   REGISTRY_FIXTURE=0 curl -fsS https://ui.swqt.net/api/registry/@swqt%2fui
   curl -fsS -X POST https://agent.swqt.net/mcp/swui \
     -H 'content-type: application/json' \
     -H 'accept: application/json, text/event-stream' \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'
   bun run --filter '@swqt/portal-example' mcp:smoke
   ```

## Local verification

```bash
bun run sync-docs
bun run sync-docs:check
bun run check:design-contract
bun run check:catalog-export
bun run --filter '@swqt/portal-example' typecheck
bun run --filter '@swqt/portal-example' test
bun run --filter '@swqt/portal-example' mcp:smoke
REGISTRY_FIXTURE=1 bun run --filter '@swqt/portal-example' test:browser
bun run verify:packed-consumer
sw doctor --project .
```

Before a production reload, validate the sibling gateway source without deploying it:

```bash
caddy validate --adapter caddyfile --config ../sws/debian/caddy/agent.swqt.net.caddy
```

After an authorized deploy, run `SWUI_MCP_SMOKE=1 ../sws/scripts/check-mcp-path-smoke.sh https://agent.swqt.net` and confirm that `/mcp` and `/mcp/sws` identify SWS while `/mcp/swui` identifies swui.

## Agent + human SpotCheck

After the outside-in smoke passes, start a fresh Agent session for each prompt. The human reviewer records the resources/tools read in order, whether the Agent over-read, whether it entered the wrong MCP service, any correction, and the final answer:

1. “What is this MCP, and what should I read first before installing `@swqt/ui`?”
2. “Find `Button`; give me its exact import, demo path, resolved package version, and install command.”
3. “How do I import the catalog item `FormField`?”
4. “How do I import and use the `DateHelpers` catalog namespace?”
5. “Where is the `cn` utility exported from?”
6. “How do I import the `Theme` type, and which component owns global theme selection?”
7. “Adopt `@swqt/ui-tokens` in a Tailwind v4 app without creating a competing dark-theme selector.”
8. “Use this connection to inspect or mutate an SWS workflow.”

For each run, capture:

- first hop (`llms.txt` / `AGENTS.md`) correct or incorrect;
- search query and exact resource/tool used;
- resources read that were not needed;
- `swui` ↔ `sw` misroute, if any;
- correction count and final-answer correctness;
- reviewer name and UTC timestamp.

The gate requires 8/8 correct first hops, 0 service misroutes, and human approval of all final answers. Prompt 8 must refuse to treat `swui` as the SWS management surface and direct the task to the separate `sw` MCP. Machine protocol tests do not replace this evidence.

## External dependency

Current outside-in blocker (observed 2026-07-23): `ui.swqt.net` does not resolve, and authenticated `https://agent.swqt.net/mcp/swui` still identifies as `sws` 0.1.144. The reviewed Portal build and sibling Caddy source have not yet formed a production chain.

Keep `blocked-with-reason(deployment/HITL evidence required)` until the deployment owner provisions the Portal DNS/runtime, applies and reloads the exact gateway route, confirms the anonymous read-only policy, and the smoke plus human SpotCheck both pass. Local/staging success remains local evidence only.
