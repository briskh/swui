# R-SWQT-0002 — swui MCP disclosure and consumer-contract audit

Status: completed evidence  
Retrieved: 2026-07-24  
Scope: `@swqt/ui`, `@swqt/ui-tokens`, the Portal reference site, local swui MCP, production swui MCP, and npm-published 1.0.0 packages.

## Question

How should swui make the right design-system information reliably reachable to an LLM/Agent without flooding its initial context, while ensuring consumers treat the library's typography, fonts, icons, colors, controls, and HTML-first rules as mandatory rather than optional guidance?

## External baseline

- The current [MCP specification](https://modelcontextprotocol.io/specification/2025-11-25) separates server primitives into application-controlled resources, model-controlled tools, and user-controlled prompts.
- The [server feature overview](https://modelcontextprotocol.io/specification/2025-11-25/server/index) supports a small resource first hop plus typed tools for targeted retrieval.
- The [MCP lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) permits server instructions and current server identity metadata during initialization.
- The [tool contract](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) requires discoverable schemas and supports read-only annotations; tool descriptions and annotations are guidance rather than an enforcement boundary.
- The human reference surface is `https://ui.swqt.net`; the canonical Agent endpoint is `https://agent.swqt.net/mcp/swui`.

The resulting reliability rule is: keep Layer 0/1 compact, but make every hard constraint reachable through an explicit URI and repeat its short blocking summary at the point where an Agent selects a component or installation version.

## Current-state evidence

### Local source

- The local MCP exposes 11 stable resources plus one component template and four read-only tools.
- Initialization instructions already point to the UI/token first hops and `swui://foundation/contract`.
- `@swqt/ui/AGENTS.md` contains semantic-token, Lucide, standard-component, theme, and HTML-first rules.
- `docs/experience/foundation-contract.md` currently owns only colors and typography. Icon and component-source constraints are distributed across other documents.
- `packages/ui/docs/HTML-STANDARDS.md` is shipped locally but is not registered as an MCP resource.
- Component search/get payloads expose import and Portal demo paths, but no mandatory contract references, Portal base URL, or release/source freshness state.
- `docs/experience/portal-and-mcp.md` still describes 10 resources and an older 26-case browser matrix even though local source now registers 11 resources and the Portal suite has expanded. Its production-evidence paragraph also describes the pre-deploy failure state, while the project companion records a later successful deployment. These are current-state documentation contradictions, not merely historical notes.

### Production outside-in

On 2026-07-24 the connected production swui MCP reported:

- server version `1.0.0`;
- successful negotiation of MCP protocol `2025-11-25`, with `resources`, `completions`, and `tools` capabilities;
- a bounded initialize response, but no `serverInfo.websiteUrl`, and instructions that omit the local source's mandatory `swui://foundation/contract` step;
- registry latest `@swqt/ui@1.0.0` and `@swqt/ui-tokens@1.0.0`;
- the production UI first-hop documents do not contain the new HTML-first rule or foundation-contract first hop;
- the production package metadata still declares `@radix-ui/react-progress`, while current source migrated `Progress` to native HTML and removed that peer;
- production catalog search/get works and returns exact import hints and Portal demo paths, but does not carry design/HTML contract references.

### Published package 1.0.0

An exact npm tarball inspection found:

- both `1.0.0` packages were published on 2026-07-23 around 07:21 UTC;
- the foundation commit `6d9a637` landed on 2026-07-24 at 02:55 +08:00 and the HTML commit `be78477` at 03:34 +08:00, so both are unambiguously post-release;
- `@swqt/ui@1.0.0` contains 66 files and predates the two post-release commits `6d9a637` and `be78477`;
- it does not include `docs/HTML-STANDARDS.md`;
- its Agent hard rules stop before the current HTML-first rule;
- it declares the obsolete-for-current-source `@radix-ui/react-progress` peer;
- `@swqt/ui-tokens@1.0.0` contains the earlier token contract and predates the expanded color/typography foundation.

Therefore local green tests cannot prove deployed or installed consumers see the current rules.

### Implementation baseline

Before any F-SWQT-0008 implementation, the current source baseline passed:

- Portal unit/MCP contract suite: 20 passed;
- local MCP smoke: passed;
- design contract, HTML standards gate, catalog/export parity, and docs sync: passed;
- packed consumer verification: nested and workspace-hoisted layouts both passed typecheck, build, 34 browser cases, and 6 declared non-applicable viewport skips.

The first isolated run failed to locate `bun` from child processes because only the absolute parent executable was supplied. Re-running with an explicit task PATH passed; this is execution-environment contamination, not a product failure.

## Disclosure gaps

| Layer | Current strength | Gap | Required evidence |
|---|---|---|---|
| Initialize | compact ordered instructions | lacks one explicit “hard contracts are blocking” summary and Portal reference mandate | initialization contract test |
| Stable resources | bounded package docs + foundation | HTML standard absent; foundation scope incomplete | exact resource list/read test |
| Catalog search/get | bounded exact component discovery | component selection can bypass hard contract reads | contract refs and Portal URL in structured payload |
| Package resolution | live registry freshness | no source-vs-published freshness warning | local release manifest/version comparison and outside-in assertion |
| Installed package | version-locked docs | npm 1.0.0 is stale | next package release plus packed-tarball byte checks |
| Human reference | colors, typography, components, Agent page | icon policy has no first-class reference page; Agent page understates hard rules | Portal routes and browser assertions |

## Consumer contract

The following must be stated as one coherent blocking contract:

1. **Fonts and typography** — only the package's system-local `font-sans`, `font-serif`, and `font-mono` stacks, allowed type scale, and allowed weights. No external font/CDN, arbitrary size, or unsupported weight.
2. **Icons and glyphs** — Lucide named imports only for operational icons; no other icon library, emoji-as-icon, or ad hoc SVG. Accessible naming follows the HTML-first contract.
3. **Colors** — semantic token utilities from `@swqt/ui-tokens`; no raw chroma or consumer-owned parallel token palette.
4. **Controls** — use exported `@swqt/ui` primitives and catalog-defined variants before creating a local control; do not copy source or fork state/focus/radius behavior.
5. **HTML** — use current conforming native elements and attributes whenever behaviorally equivalent; ARIA only fills gaps and never contradicts native semantics.
6. **Reference site** — before inventing UI or local variants, actively inspect the matching `/colors`, `/typography`, `/icons`, and `/components/...` reference surfaces.

“Blocking” is enforceable inside this repository through design/HTML/catalog gates. In an arbitrary consumer repository, MCP and package docs can strongly instruct and provide verifiable references, but cannot technically force compliance without the consumer adopting equivalent lint/tests.

## Options and TELOS

### A — Contract references at every disclosure layer, bounded payloads (recommended)

Keep the existing small first hop; add exact HTML/design-system contract resources; return compact contract references and Portal URLs from component tools; add an icon reference page; strengthen shipped Agent docs; and add source/published/production freshness evidence.

- Technical: preserves bounded discovery while eliminating dead-end selections.
- Economic: reuses existing MCP and Portal structures.
- Legal: relies on public standards and project-owned guidance.
- Operational: supports local, packed, registry, and remote parity checks.
- Schedule: can be delivered in three focused Steps.

### B — Put all rules into initialization instructions

This maximizes early presence but increases context cost, creates duplicated truth, and weakens versioned document ownership. Reject.

### C — Documentation-only reminder

This leaves component/tool responses and deployed freshness unverified. Reject.

## Recommended acceptance direction

- One canonical consumer foundation contract covers fonts/typography, icons, colors, controls, HTML, and reference-site usage.
- MCP initialization gives a short mandatory summary and exact ordered URIs, not full rule bodies.
- Stable resources include the canonical contract and HTML standard within the existing bounded resource budget.
- Catalog search/get and exact component resources return compact `contractRefs`, absolute Portal references, and import guidance.
- Portal supplies a visible icon policy/reference and strengthens `/agent` with the mandatory sequence.
- Local tests prove resource/tool schema fidelity, bounded responses, non-empty exact reads, and all new constraint references.
- Packed-consumer verification proves the same rules ship in both packages.
- Outside-in verification explicitly distinguishes local-fixed, npm-published, and production-deployed states.
- A release/deploy is not claimed until npm and production endpoint evidence match the source.

## Agent walkthrough matrix

The post-change SpotCheck must reuse these prompts and score whether the Agent chooses the right first hop, resources, component, constraints, and human reference:

| ID | User intent | Expected progressive path |
|---|---|---|
| A01 | “用这个库做一个登录表单” | UI/token first hop → foundation/HTML contracts → search form/input/button → exact components → Portal demos → exact version |
| A02 | “按钮用一个更亮的蓝色，本地写个 variant” | reject ad hoc chroma/local fork → `/colors` + Button catalog/demo → existing semantic variant or governed contract extension |
| A03 | “装 react-icons，随便找个登录图标” | reject second icon library → `/icons` → Lucide named import → accessible-name rule |
| A04 | “用 div 做一个可点击卡片” | HTML contract → choose native button/link when behavior matches → exact component if available |
| A05 | “服务端游标表格怎么做” | catalog search → `ServerDataTable` exact resource → absolute component demo, not client `DataTable` |
| A06 | “还没安装，最新包是什么” | MCP first hop → `swui.package.get` exact version → install hint; do not assume source HEAD is published |
| A07 | “已经安装 1.0.0，规则听谁的” | prefer installed `node_modules/@swqt/ui/AGENTS.md` and same-version docs; surface source/published drift rather than mixing versions |
| A08 | “帮我推进 SWS workflow” | refuse swui scope expansion → use the separate `sw` MCP/CLI |

## Post-change validation

Local source and publish-shaped `1.1.0` artifacts now satisfy the eight-prompt matrix:

| ID | Outcome | Evidence |
|---|---|---|
| A01 | pass | initialize orders UI/token → foundation/HTML → search/exact component → exact version; Button payload includes absolute demo and contracts |
| A02 | pass | foundation and UI Agent docs reject raw chroma/local forks and direct the Agent to `/colors` and existing Button variants |
| A03 | pass | `/icons`, both package first hops and component contract require Lucide named imports and reject second libraries/emoji/ad hoc SVG |
| A04 | pass | HTML resource and package hard rules require native controls instead of neutral-element simulation |
| A05 | pass | catalog remains exact and documents `ServerDataTable` vs `DataTable`; returned demo URL is absolute |
| A06 | pass | `package.get` reports registry `1.0.0` separately from `sourceVersion=1.1.0` and `releaseStatus=source-ahead` |
| A07 | pass | initialize and adoption docs prefer installed same-version package truth while explicitly surfacing source/registry drift |
| A08 | pass | initialize retains the strict swui-vs-sw boundary; tools remain four read-only design-system operations |

Automated evidence: Portal unit suite 20/20, MCP smoke, static resource count 12/12 budget, one template, four read-only tools, structured/text parity, full Portal browser 60/60, consumer browser 34 passed/6 declared skips, and packed nested/hoisted consumers each 34 passed/6 declared skips. Manual review of the eight prompts found 8/8 expected routes and no scope misroute; this is an Agent audit, not a separate human sign-off.

Production remains an intentional negative control until separately authorized deployment: initialize identifies `swui 1.0.0`, resources/list returns 10, Button lacks `demoUrl`/`contractRefs`/`referenceSite`, `/icons` has no Icons heading, and `/agent` has no foundation-contract entry. npm also remains `1.0.0`. Therefore local and packed evidence is complete while distribution freshness is accurately marked pending.

## Known constraint

`workflow-numbering` currently reports 45 policy findings: 40 pre-existing findings from the one-Feature/one-Step base-number rule and older research filenames, plus five findings created by the tool-allocated `F-SWQT-0008`, `S-SWQT-0023`–`0025`, and `R-SWQT-0002` identities. `workflow next-id` allocated these IDs while the numbering validator expects a different multi-Step shape. The delivered workflow must not be silently renamed; this is a tooling-policy conflict, while workflow JSON/layout/closure/lifecycle all pass.
