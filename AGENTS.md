# swui — Agent entry

**Read this first** when changing or consuming this repository.


<!-- SWS:agent-first-hop-index:begin -->
<!-- managed: do-not-edit; regenerate via sw repair --dimension host -->
## SWS Agent First Hop Index

Installed SWS plugin capability index for **Cursor and Codex hosts**. Read this block **before** MCP discovery (`list_resources` / `service_manifest`). Refresh managed host surfaces with `sw init --dir .` or `sw repair --dimension host --dir . --fix`.

`generatedAt`: `2026-07-16T06:02:45.545Z`

### Managed block — DO NOT EDIT

- **MUST NOT** edit anything between the `SWS:agent-first-hop-index` markers — humans, this Agent, Cursor/Codex, or any third-party agent reading `AGENTS.md`.
- **ONLY** refresh via `sw repair --dimension host --dir . --fix` (host `agents-md`). Hand-edits **WILL be overwritten**.
- To change index content: update generator/SSOT (`agent_first_hop` / `agent-first-hop-index.md`), then repair — do **not** patch this block in place.

### Installed `sw` client + in-repo assets (**MUST READ** — before MCP discovery)

> **Codex / AGENTS.md single-channel rule**: This host keeps one root agent file. **Do not** call `service_manifest`, `list_resources`, or guess SWS tools/skills until you have **Read** the P0 client first-hop entry listed below. Local `sw mcp` serves methodology `sws://*` assets; center MCP owns stateful tools.

**Client status**: `installed-binary` — `sw` is reachable on PATH; methodology assets are served by `sw mcp` / embedded SWS assets.

| Priority | Read / use this | Purpose |
|----------|-----------------|----------|
| P0 | `.agents/skills/sw/SKILL.md` | Generated host-local SW first-hop entry |
| P0 | `sw mcp` | Stdio MCP: local methodology assets/prompts plus center-only tool forwarding |
| P0 | local `sws://reference/mcp-runbook.md` | MCP runbook after `sw mcp` is connected |
| P1 | local `sws://routes` | Full route catalog table |
| P1 | local `sws://skills/index` | Full skill index served by `sw mcp` |

**Resolve / refresh client**: `sw version` · `sw update` · `sw repair --dimension host --dir . --fix`.

**Anti-pattern**: Treating a missing npm/package file tree as a missing `sw` install when the binary and MCP proxy are reachable.

### Host-loaded surfaces

The host has already loaded the root agent entry and its managed first-hop block. Cursor additionally loads its always-on rule; Codex discovers the host-local `sw` skill; MCP configuration is config-load only and does not replace these instructions.

### Required first actions

1. **Select `sw` and read its skill** — Read `.agents/skills/sw/SKILL.md` completely (**MUST**; see table above).
2. **Connect `sw mcp` and read the runbook** — Read local `sws://reference/mcp-runbook.md`.
3. **Form a provisional selection** — Read local `sws://routes`; choose provisional Primary and Companion candidates.
4. **Read selected context** — Read the selected `sws://skills/<name>` body and only the matching task-class slice exposed by .cursor/skills/project-swqt-companion/SKILL.md.
5. **Finalize and emit the routing receipt** — finalize Primary/Companions, emit the receipt, then begin substantive work.

**Forbidden before these actions**: broad MCP discovery, guessing tool or skill names, or using route-debug tools as navigation.

### Embedded catalog (mirror; SSOT = local `sw` assets + center task metadata)

Counts: **34** routes · **17** MCP tools · **0** prompts. Center `service_manifest.prompts` is empty under Model A′ hard-cut; Agent prompt bodies come from local `sw mcp`. Prefer Read `.agents/skills/sw/SKILL.md` and local `sws://routes` over treating this block as authoritative when drift is possible.

### Required Routing (summary)

1. D0/D1: read first-hop + taskClass catalog; D2: pick Primary + Companions from **Routing Catalog** below (decision source).
2. Route debug tools are explicit maintainer/debug side channels only; do not use them as default Agent navigation.
3. Read `sws://routes` + selected `SKILL.md`; if `primary===null` or `ambiguous`, read `sws://skills/router` §MCP Hybrid Routing.
4. Emit `SWS routing receipt` per `sws://reference/routing-receipt.md` with `Primary skill`, `Companion skills`, and `Axis coordinate`.
5. Project facts: project skill entry / `projectCompanionAnchor` only — not plugin layer.

### Routing Catalog

**Summary**: route catalog compressed for Layer B budget (~120 lines / ~10KB). Full route catalog table: local `sws://routes` after Read `.agents/skills/sw/SKILL.md`.

### MCP Task Shortcuts

| Task | Summary | Read first | Tools |
|------|---------|------------|-------|
| `bootstrap-init` | Initialize project with Layout v4 | sws://reference/mcp-runbook.md, sws://skills/boot, sws://reference/agent-first-hop-index.md | service_manifest |
| `workflow-read` | Read Tier-1 workflow JSON through local sw CLI | sws://reference/mcp-runbook.md, sws://reference/hir-qap.md, sws://reference/json-schema-version-policy.md, sws://schemas/workflow/feature-document.schema.json, sws://schemas/workflow/step-document.schema.json, sws://schemas/workflow/workflow-ledger.schema.json |  |
| `workflow-write` | Write Tier-1 workflow JSON through local sw CLI | sws://reference/mcp-runbook.md, sws://reference/hir-qap.md, sws://reference/json-schema-version-policy.md, sws://schemas/workflow/workflow-intent.schema.json, sws://schemas/workflow/section-items.schema.json, sws://schemas/workflow/feature-document.schema.json, sws://schemas/workflow/step-document.schema.json | sws.payload.prepare |
| `intake-issue-submit` | Submit intake issue (routing, tooling, workflow bypass, etc.) | sws://reference/intake-field-spec.md, sws://reference/json-schema-version-policy.md, sws://schemas/intake/submit-input.schema.json, sws://fixtures/intake/record-routing-issue-full.json | sws.payload.prepare, sws.intake.validate, sws.intake.submit |
| `intake-suggestion-submit` | Submit plugin-layer methodology suggestion | sws://reference/intake-field-spec.md, sws://schemas/intake/submit-input.schema.json, sws://fixtures/intake/record-suggestion-minimal.json | sws.payload.prepare, sws.intake.validate, sws.intake.submit |
| `intake-telemetry-read` | Read intake inbox and route-report telemetry (no submit) | sws://reference/intake-field-spec.md, sws://schemas/intake/list-response.schema.json | sws.intake.list, sws.intake.report, sws.intake.get |
| `routing` | Select Primary skill (catalog-first; route tools are explicit debug only) | sws://routes, sws://reference/routing-receipt.md, sws://reference/route-catalog-contract.md |  |
| `meta-routing` | Audit/re-test route coverage and catalog-L2 decisions; explicit debug tools are not Agent-default advertised | sws://reference/route-catalog-contract.md, sws://skills/route-coverage, sws://reference/routing-receipt.md |  |
| `exposure-audit` | Evaluate outside-in capability exposure / progressive disclosure | sws://reference/mcp-runbook.md, sws://reference/route-catalog-contract.md, sws://reference/disclosure-reliability-contract.md | service_manifest |

### MCP Capability Summary

**Counts**: **17** MCP tools · **0** prompts. Full tool names/schemas: Read `sws://reference/mcp-runbook.md` and `.agents/skills/sw/SKILL.md` first, then center `service_manifest` or local `sws://routes` — **do not** embed all tool names in Layer B. Agent prompt bodies: local `sw mcp` embed.

Context/cache: if `service_manifest.contextPrefetch` is present, read its bundle URI and attest digest/source; observe `cacheGeneration` there. Keep full JSON Schemas/resources as explicit opt-in reads.

**First read local asset resource**: `sws://reference/mcp-runbook.md`

### Local Asset Resource Namespaces

| Namespace | Purpose |
|-----------|----------|
| `sws://routes` | Route catalog table (routes.yaml) |
| `sws://skills/index` | Skill index JSON |
| `sws://skills/<name>` | Skill markdown |
| `sws://reference/*` | Cross-skill contracts (runbook, routing-receipt, bootstrap-template, …) |
| `sws://schemas/*` | JSON Schema (intake, workflow, hir-qap) |
| `sws://commands/*` | Command specs |
| `sws://hooks/*` | Hook event descriptions |

### Project Layer Pointers

- Project skill entry: .cursor/skills/README.md
- Default companion: .cursor/skills/project-swqt-companion/SKILL.md
- Validation handoff: .cursor/skills/README.md — Validation handoff table

### Layer Boundary

Embedded plugin skills = Primary methodology. Project companion = paths, commands, MCP config, validation. Do not write project Feature/Step state into the embedded plugin methodology layer.

### Root Entry shell (Zone H) — size gate

Zone H after the managed end marker is project-owned and editable; keep it within configured `zoneHMaxBytes` (default 4 KiB ceiling, not a target).
Keep every MUST section and move long guidance to the companion / a linked `sws://reference/*`. `sw doctor --project .` reports status; an approved CLI footer may remind on excess.
MUST NOT hand-edit Zone M; refresh it only with `sw repair --dimension host --dir . --fix`.

<!-- SWS:agent-first-hop-index:end -->

### Root Entry shell — project-owned (editable)

- The managed Zone M block above this shell, between the `SWS:agent-first-hop-index` markers, **MUST NOT** be hand-edited; refresh only with `sw repair --dimension host --dir . --force`.
- From this heading to EOF is project-owned Zone H. Maintainers and explicitly confirmed Agents MAY edit it.
- Keep every MUST section below. MAY add short project sections; all count toward `zoneHMaxBytes` (default 4 KiB ceiling, not a target).
- `sw repair` does not overwrite Zone H. Move long guidance to the project companion or a linked reference.

## Required Routing

Use the installed **SWS plugin** routing catalog. Read the selected `SKILL.md` before substantive work.
0. **L0 hard intercept**: a single-token instruction match → read `sws://reference/l0-routing-hard-intercept.v1.md` plus its `readFirst[]` / `toolReference`; receipt `Routing override: instruction`. Do not link concrete Tier-1 instruction JSON.
1. **Catalog-first**: read `sws://routes`, select by taskClass, then read `sws://skills/<primary>`. `sws.route.diagnose` is an optional machine hint, never the final routing decision.
2. **D2**: choose semantic Primary + Companions; on genuine ambiguity use router Hybrid / HIR-QAP.
3. Before the first substantive response emit `SWS routing receipt` per `sws://reference/routing-receipt.md`, with `Primary skill`, `Companion skills`, `Axis coordinate`, and `Machine hint: none` when no hint exists.
4. Project facts come only from the project companion / `projectCompanionAnchor`; never write Viewer/Step state into installed plugin assets.

## Parallel Execution

Run independent streams in parallel when the host supports sub-agents or multitask; read `sws://skills/orchestration`.

## Project Companion

- Project skill entry: `.cursor/skills/README.md`
- Default companion: `.cursor/skills/project-swqt-companion/SKILL.md`
- Validation handoff / gates: `.cursor/skills/README.md` — Validation handoff table

## Layer Boundary

The installed SWS plugin layer owns methodology. The project layer companion owns paths, commands, gates, MCP configuration, and local facts. Do not assume a project-local plugin asset tree in a business repository.

## Host convergence

`sw init --dir .` · `sw doctor --project .` · `sw repair --dimension host --dir . --force`; contract: `sws://reference/agent-first-hop-index.md`.

## Validation

Run `sw doctor --project .` and the declared validation handoff before completion, or honor its explicit `skipped-with-reason(...)` / `blocked-with-reason(...)` value.

## JSON Schema

Read `sws://reference/json-schema-version-policy.md`; discover with `sw schema list`, then use `sw schema show --command <id> --kind <input|output>` only when needed.

## Workflow + Invocation

- **Read tool-first**: start with `sw workflow stat --view next --root .`; use graph, plan-read, then point get-section through the companion. Do not batch-read Feature/Step trees. Research Markdown may be read directly.
- **Write tool-first**: apply compiled mutations with `sw workflow intent apply --file <file> --root .`; use the companion for schema-backed section, link, patch, and promote faces. On failure follow `tool-fallback` + `workflowPathBypass`.
- Invocation path, MCP input errors, intake routing, and tool hints belong in the project companion; do not duplicate their manuals here.

## What this repo is

Shared Web UI design system (tokens + React primitives). Not a product shell.

| Package | First hop |
|---------|-----------|
| `@swqt/ui-tokens` | `packages/ui-tokens/AGENTS.md` |
| `@swqt/ui` | `packages/ui/AGENTS.md` |

Prefer `node_modules/@swqt/ui/AGENTS.md` after install. Hard rules: no AppShell/TopBar/routes; one global ThemeProvider owns system/light/dark theme selection; semantic tokens; ship agent docs with publish.
