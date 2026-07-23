# Project Skills

projectCompanionAnchor: [.cursor/skills/project-swqt-companion/SKILL.md](project-swqt-companion/SKILL.md)

## Validation handoff

| Surface | Gate |
|---|---|
| Project doctor | `sw doctor --project .` |
| Static contracts | `bun run sync-docs:check && bun run check:design-contract && bun run check:catalog-export` |
| Portal | `bun run --filter '@swqt/portal-example' typecheck && bun run --filter '@swqt/portal-example' test && bun run --filter '@swqt/portal-example' mcp:smoke` |
| Browser E2E | `bun run --filter '@swqt/ui-consumer-example' test:browser` and `REGISTRY_FIXTURE=1 bun run --filter '@swqt/portal-example' test:browser` |
| Packed consumers | `bun run verify:packed-consumer` |
| Production/HITL | `blocked-with-reason(deployment and human evidence must be observed outside-in)` |
