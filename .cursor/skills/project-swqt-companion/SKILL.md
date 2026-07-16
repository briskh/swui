---
name: project-swqt-companion
description: Project facts and validation handoff for this repository.
---

# Project Companion

## Validation handoff

- Project-specific E2E: skipped-with-reason(project fact not provided during init)
- CI: skipped-with-reason(project fact not provided during init)
- Schema discovery: `sw schema list` / `sw schema show`; full schemas are opt-in.
- Invocation path: local-cli; stateBoundary=local-project.
- Workflow reads use `stat --view next`, `graph`, `plan-read`, and `get-section`; writes are tool-first.
- Local methodology comes from `sw mcp` / `sws://*`; `SW_MCP_CACHE` is legacy/ignored.
