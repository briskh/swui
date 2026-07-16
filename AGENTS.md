# swui — Agent entry

**Read this first** when changing or consuming this repository.

## What this repo is

Shared Web UI design system for organization apps (tokens + React primitives). Not a product shell: no AppShell, route IA, or business features.

## Packages

| Package | First hop inside the package |
|---------|------------------------------|
| `@swui/ui-tokens` | `packages/ui-tokens/AGENTS.md` → `llms.txt` → `docs/*` |
| `@swui/ui` | `packages/ui/AGENTS.md` → `llms.txt` → `docs/*` |

When consuming from another repo, prefer `node_modules/@swui/ui/AGENTS.md` after install — do not assume this git checkout exists.

## Hard rules

1. Keep product AppShell / TopBar / routes out of these packages.
2. Runtime theme contract is **light-only** unless a future release re-enables dual-theme in `@swui/ui`.
3. Prefer semantic tokens; do not fork a second token file in consumers.
4. Ship agent docs (`AGENTS.md`, `llms.txt`, `docs/*`) with every package publish.
