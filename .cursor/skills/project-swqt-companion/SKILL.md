---
name: project-swqt-companion
description: Project facts and validation handoff for this repository.
---

# Project Companion

## Validation handoff

- **Fast paths (local iteration):** [docs/experience/local-validation-fast-paths.md](../../docs/experience/local-validation-fast-paths.md) — contract/typecheck/targeted Playwright `--grep` before full browser matrix.
- Project E2E: `bun run --filter '@swqt/ui-consumer-example' test:browser` and `REGISTRY_FIXTURE=1 bun run --filter '@swqt/portal-example' test:browser`.
- CI: `.github/workflows/quality.yml` runs frozen install, docs sync/check, catalog/design contracts, package and Portal typechecks/builds/tests/browser gates, MCP smoke, and packed-consumer verification.
- MCP contract: `bun run --filter '@swqt/portal-example' test` plus `bun run --filter '@swqt/portal-example' mcp:smoke`.
- Package freshness: `bun run verify:packed-consumer` compares installed tarball Agent/docs bytes with `packages/*` SSOT and validates nested and hoisted consumers.
- Host/bootstrap: `sw doctor --project .`; project MCP slots must contain stdio `sw mcp` plus the independent `swui` URL and no `SW_MCP_*` / `SW_SWS_*` env keys.
- Public path: only `https://agent.swqt.net/mcp/swui` is the swui MCP endpoint; `/mcp` and `/mcp/sws` belong to SWS.
- Local release candidate (2026-07-24): both packages and local swui MCP are **1.1.0**; `resources/list`=12, `templates/list`=1, `tools/list`=4. Component discovery returns mandatory `contractRefs`, absolute `referenceSite` URLs, and registry/source freshness fields. Portal includes `/icons`. Full local Portal browser matrix **60/60 passed**; consumer **34 passed / 6 declared skips**; packed nested and hoisted layouts each **34 passed / 6 declared skips**.
- npm registry (2026-07-24 post-publish): `@swqt/ui` and `@swqt/ui-tokens` are both **1.1.0** (`dist-tag latest`).
- External production MCP/Portal observed 2026-07-24: anonymous `https://agent.swqt.net/mcp/swui` remains **swui 1.0.0**, `resources/list`=10, `templates/list`=1, `tools/list`=4; Button payload has no `demoUrl`, `contractRefs`, or `referenceSite`. `https://ui.swqt.net` returns HTTP 200, but `/icons` has no Icons heading and `/agent` has no foundation-contract entry. Portal/MCP deploy is still pending; npm freshness must not be inferred as production freshness.
- Schema discovery: `sw schema list` / `sw schema show`; full schemas are opt-in.
- Invocation path: local-cli; stateBoundary=local-project.
- Workflow reads use `stat --view next`, `graph`, `plan-read`, and `get-section`; writes are tool-first.
- Local methodology comes from `sw mcp` / `sws://*`; `SW_MCP_CACHE` is legacy/ignored.
