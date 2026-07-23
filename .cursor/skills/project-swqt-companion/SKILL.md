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
- External production identity and the human Agent SpotCheck remain `blocked-with-reason(deployment/HITL evidence required)` until directly observed.
- Last outside-in observation (2026-07-23): `ui.swqt.net` does not resolve and authenticated `/mcp/swui` still identifies as `sws` 0.1.144 with 0 `swui.*` tools/templates. Refresh after the Portal/DNS/Caddy rollout; do not treat this dated failure as a permanent topology fact.
- Schema discovery: `sw schema list` / `sw schema show`; full schemas are opt-in.
- Invocation path: local-cli; stateBoundary=local-project.
- Workflow reads use `stat --view next`, `graph`, `plan-read`, and `get-section`; writes are tool-first.
- Local methodology comes from `sw mcp` / `sws://*`; `SW_MCP_CACHE` is legacy/ignored.
