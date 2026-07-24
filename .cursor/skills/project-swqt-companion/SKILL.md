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
- Local release candidate (2026-07-24): `@swqt/ui` / local swui MCP source are **1.2.0**; `@swqt/ui-tokens` remains **1.1.0**. DescriptionList detail-field exports are in source. Packed consumers for `1.2.0` nested and hoisted each **34 passed / 6 declared skips**.
- npm registry: awaiting authorized publish of `@swqt/ui@1.2.0`; prior latest was `@swqt/ui@1.1.0` / `@swqt/ui-tokens@1.1.0`.
- External production MCP/Portal: still on older deploy until separately authorized; npm freshness must not be inferred as production freshness.
- Schema discovery: `sw schema list` / `sw schema show`; full schemas are opt-in.
- Invocation path: local-cli; stateBoundary=local-project.
- Workflow reads use `stat --view next`, `graph`, `plan-read`, and `get-section`; writes are tool-first.
- Local methodology comes from `sw mcp` / `sws://*`; `SW_MCP_CACHE` is legacy/ignored.
