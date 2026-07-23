---
name: project-swqt-companion
description: Project facts and validation handoff for this repository.
---

# Project Companion

## Validation handoff

- Project E2E: `bun run --filter '@swqt/ui-consumer-example' test:browser` and `REGISTRY_FIXTURE=1 bun run --filter '@swqt/portal-example' test:browser`.
- CI: `.github/workflows/quality.yml` runs frozen install, docs sync/check, catalog/design contracts, package and Portal typechecks/builds/tests/browser gates, MCP smoke, and packed-consumer verification.
- MCP contract: `bun run --filter '@swqt/portal-example' test` plus `bun run --filter '@swqt/portal-example' mcp:smoke`.
- Package freshness: `bun run verify:packed-consumer` compares installed tarball Agent/docs bytes with `packages/*` SSOT and validates nested and hoisted consumers.
- Host/bootstrap: `sw doctor --project .`; project MCP slots must contain stdio `sw mcp` plus the independent `swui` URL and no `SW_MCP_*` / `SW_SWS_*` env keys.
- Public path: only `https://agent.swqt.net/mcp/swui` is the swui MCP endpoint; `/mcp` and `/mcp/sws` belong to SWS.
- External production identity: `/mcp/swui` **observed swui 1.0.0** (anonymous 200) as of 2026-07-23 post-deploy; `resources/list`=10, `templates/list`=1, `tools/list`=4 `swui.*`. Eight-prompt Agent walkthrough **8/8 pass, 0 misroutes** — **human SpotCheck sign-off still required** before Feature closure.
- Last outside-in observation (2026-07-23 post-deploy): anonymous `https://agent.swqt.net/mcp/swui` → **swui** with bounded contract; `ui.swqt.net` **still does not resolve** on public DNS from the audit host (gateway upstream may be private); anonymous `/mcp` and `/mcp/sws` → **401** (SWS identity not re-verified without bearer). Full `SWUI_MCP_SMOKE=1 check-mcp-path-smoke.sh` still stops at authenticated SWS paths.
- Schema discovery: `sw schema list` / `sw schema show`; full schemas are opt-in.
- Invocation path: local-cli; stateBoundary=local-project.
- Workflow reads use `stat --view next`, `graph`, `plan-read`, and `get-section`; writes are tool-first.
- Local methodology comes from `sw mcp` / `sws://*`; `SW_MCP_CACHE` is legacy/ignored.
