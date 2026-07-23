# Portal deploy runbook

Infra / edge SSOT (gw · CF · Caddy · Tailnet): op repo  
`docs/research/swui-portal-gw-operating-notes.md` (2026-07-23 as-built).

## Public URLs

| Surface | URL |
|---------|-----|
| Human portal (SPA) | `https://ui.swqt.net` |
| **swui MCP (canonical)** | **`https://agent.swqt.net/mcp/swui`** |
| Registry API (portal origin) | `https://ui.swqt.net/api/registry/*` |

Agents configure a **second** MCP slot: `swui` → `https://agent.swqt.net/mcp/swui`  
(alongside stdio `sw` / SWS). Do not merge into `SW_MCP_URL`.

## Topology (as-built · gw)

```
Cursor / Agent
    │  swui.url = https://agent.swqt.net/mcp/swui
    ▼
agent.swqt.net
    │  public CF → gw Caddy → 127.0.0.1:4176
    │  Tailnet MagicDNS → dev Caddy → 100.64.0.1:4176
    ▼
swui-portal.service on gw (/opt/swui-portal)
    │  /mcp/swui → handleMcpHttpRequest()
    │  / → SPA dist · /api/registry/* → registry client
```

Human site: CF `ui.swqt.net` → gw Caddy → same `:4176`.

Gateway sources (sws): `debian/caddy/agent.swqt.net.caddy` (local upstream `127.0.0.1:4176`),  
`debian/caddy/ui.swqt.net.caddy`, `debian/caddy/agent.swqt.net.local.caddy` (Tailnet → gw `:4176`).

Local/dev mount path is identical: `http://127.0.0.1:4176/mcp/swui`.  
Portal must not handle `/mcp`, `/mcp/sws`, unknown `/mcp/*`, or `/mcp/swui/*`.

## Release sequence (production on gw)

1. Merge portal changes; publish npm packages when needed (`./scripts/publish.sh --apply`).
2. On **dev** (build host), with `~/.bun/bin` on `PATH`:

   ```bash
   bun install --frozen-lockfile
   bun run sync-docs
   bun run --filter '@swqt/portal-example' build
   ```

3. Stage a **slim** runtime tree (not the whole monorepo):
   - `dist/`, `server/`, `shared/`, `.generated/`, `fixtures/`
   - `package.json` with only `@modelcontextprotocol/sdk` + `zod`
   - `bun install --production` inside the stage (~25–30Mi)

4. Sync stage → `gw:/opt/swui-portal` (if `dev` cannot SSH to `gw`, tar via operator laptop), then:

   ```bash
   sudo systemctl restart swui-portal
   ```

5. Smoke:

   ```bash
   curl -fsS -o /dev/null -w '%{http_code}\n' https://ui.swqt.net/
   curl -fsS https://ui.swqt.net/api/registry/@swqt%2fui
   curl -fsS -X POST https://agent.swqt.net/mcp/swui \
     -H 'content-type: application/json' \
     -H 'accept: application/json, text/event-stream' \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'
   # expect serverInfo.name == "swui"
   ```

   Optional (from sws): `SWUI_MCP_SMOKE=1 ./scripts/check-mcp-path-smoke.sh https://agent.swqt.net`  
   Note: script hits `/mcp` first; SWS may return **401** without a token — that is not a swui failure.

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

## Agent + human SpotCheck

After outside-in smoke, run a fresh Agent session per prompt (human reviewer records first-hop / misroute).  
Prompt about SWS workflow must refuse to treat `swui` as the SWS management surface.

## Status

**Deployed 2026-07-23** on `gw`: CF `ui`, LE SAN, `swui-portal.service`, public + Tailnet `/mcp/swui` path split verified (`serverInfo.name=swui`, registry live).
