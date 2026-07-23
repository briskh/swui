# R-SWQT-0001 — HTML Living Standard audit

Status: completed  
Retrieved: 2026-07-24  
Scope: `@swqt/ui` public React components, Portal, consumer fixture, and future conformance gates.

## Question

How should swui enforce the rule “use current standard HTML elements and attributes wherever they can express the required behavior”, without weakening component behavior or silently breaking the public library API?

## Standards baseline

The normative HTML baseline is the continuously updated [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/). There is no separate “HTML 6” release to target. The audit also uses:

- [HTML elements](https://html.spec.whatwg.org/multipage/indices.html#elements-3) and [attributes](https://html.spec.whatwg.org/multipage/indices.html#attributes-3) indices for element/attribute validity and content models.
- [HTML obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html) for forbidden and warning-producing authoring features.
- [ARIA in HTML](https://www.w3.org/TR/html-aria/) for allowed ARIA on HTML elements. It says authors must not conflict with native semantics and does not recommend roles or states that merely repeat implicit HTML semantics.
- The standard definitions of [`progress`](https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element), [`fieldset`](https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element), [`select`](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element), [`table`](https://html.spec.whatwg.org/multipage/tables.html#the-table-element), and [`nav`](https://html.spec.whatwg.org/multipage/sections.html#the-nav-element).

Freshness: the sources above are living/current surfaces retrieved on 2026-07-24. Refresh when WHATWG or ARIA in HTML changes the relevant element/attribute authoring rules, when the supported-browser policy changes, or before a future major component release.

## Executable interpretation

1. Use an intrinsic HTML element when it fully expresses the meaning and interaction: `button`, `a`, `input`, `select`, `progress`, `fieldset`/`legend`, `table`/`thead`/`tbody`/`th`, `nav`, `main`, `aside`, `section`, and text-level elements.
2. Use native attributes for native state (`disabled`, `checked`, `required`, `open`, `value`, `max`, `scope`, and input attributes) rather than parallel ARIA claims.
3. Do not repeat implicit roles (`nav role=navigation`, `input type=search role=searchbox`) and do not manufacture links or controls on neutral elements when a native element is viable.
4. Keep ARIA/custom primitives when HTML has no behaviorally equivalent element or when the native element cannot meet the public component contract. Examples include searchable comboboxes, menus, tabs, tooltips, switches, and controlled focus/overlay primitives. These require complete keyboard, focus, state, and naming tests.
5. `div` and `span` remain correct when the content has no stronger semantic meaning. The rule is semantic correctness, not mechanically replacing every neutral container.
6. Conformance is checked at three layers: source policy checks, rendered HTML conformance, and accessibility/interaction tests. Axe alone is insufficient because it does not enforce all HTML content-model or obsolete-feature rules.

## Repository audit

Inventory evidence:

- `packages/ui/src/index.ts` exports 54 component modules; the completed catalog gate reports 88 catalog exports and 309 package exports.
- Both application documents have a doctype, `html[lang]`, UTF-8 charset, viewport metadata, and no obsolete authoring attributes.
- Existing browser suites run Axe WCAG checks, but there is no HTML-conformance or semantic-source gate.

Confirmed improvement candidates:

| Surface | Current markup | Standards-first target | Priority |
|---|---|---|---|
| `Progress` | Radix `div[role=progressbar]` | Native `progress[value][max]`, preserving styling and the common public API | P0 |
| `Pagination` | `nav role=navigation` | Native `nav` without the redundant role | P0 |
| `SearchInput` | `input type=search role=searchbox` | Native `input type=search`; its implicit role is sufficient | P0 |
| `BreadcrumbPage` | `span role=link aria-disabled=true` | Non-interactive current-page text with `aria-current=page`, or placeholder `a` only when link semantics are intentionally required | P0 |
| pagination ellipsis | parent `aria-hidden=true` also contains screen-reader copy | Hide only the decorative icon; expose “More pages” | P0 |
| `Spinner` consumers | every SVG announces “Loading”, including beside visible loading text | Decorative by default; announce only when the caller supplies an accessible name/status context | P0 |
| `TableHead` | native `th` without a default `scope` | Default `scope=col`, allow consumers to override `scope=row` | P0 |
| `ServerDataTable` | header and body rendered as two unrelated tables | One semantic table with associated header/body cells; use CSS sticky layout rather than splitting the table model | P0 |
| `DateRangePresetPicker` | buttons in `div role=group`, selected value not exposed | Native radio inputs inside `fieldset`/`legend`, visually styled as buttons | P1 |
| `PopoverSelect` | custom button/listbox/option widget for a non-searchable value list | Native `select` when the component contract needs only single selection; otherwise document the reason custom behavior remains | P1 |
| `SkeletonStack` | neutral `div` named with `aria-label` | Named/busy semantic region or explicit status pattern with tested announcement behavior | P1 |
| standards governance | docs mention accessibility but not the HTML-first rule | Package guidance, catalog notes, source checks, rendered conformance check, and regression tests | P0 |

Retain custom implementations unless a separate compatibility design proves equivalence:

- Searchable `Combobox`/command palette.
- Menus, tabs, tooltips, hover cards, sliders, switches, and focus-managed modal overlays backed by Radix.
- Styling-only `div`/`span` containers with no stronger semantic meaning.

## Options and TELOS

### A — Standards-first, compatibility-preserving migration (recommended)

Replace confirmed exact equivalents, remove redundant/conflicting ARIA, repair the table model, add a conformance gate, and retain complex custom widgets with documented justification.

- Technical: high standards gain without discarding mature focus/keyboard behavior.
- Economic: bounded implementation and review cost; durable automated prevention.
- Legal: standards and accessibility conformance reduce compliance risk; no copied specification text.
- Operational: can land in reviewable slices and preserve most component call sites.
- Schedule: feasible in one Feature with focused Steps.

### B — Replace all custom primitives with the newest native platform features

Adopt native dialog/popover/customizable-select and other new surfaces everywhere.

- Technical: maximizes native HTML, but native parity and React/library APIs are incomplete for several widgets.
- Economic: high rewrite and regression cost.
- Legal: same standards benefit, with higher compatibility exposure.
- Operational: browser/version differences and focus behavior require a new support matrix.
- Schedule: unsuitable as a single repository-wide maintenance pass.

### C — Documentation and lint rules only

Document the principle and reject newly introduced violations, but leave current exported markup unchanged.

- Technical: prevents some new debt but does not satisfy the requested improvement.
- Economic: cheapest short term.
- Legal/operational: existing semantics and table association risks remain.
- Schedule: fast but incomplete.

Conclusion: `Proceed` with option A under `migrate-forward`. Any TypeScript prop/ref incompatibility that cannot be avoided must be isolated, documented, and treated as a versioned API decision rather than slipped into a minor refactor.

## Acceptance direction

- Every confirmed P0 occurrence is changed or has a source-linked, behavior-specific exception.
- No obsolete HTML features are present in authored source or rendered fixtures.
- Standard elements/attributes replace redundant ARIA when behaviorally equivalent.
- Complex widgets retain or improve keyboard/focus/name behavior and have a recorded native-non-equivalence reason.
- Rendered representative pages pass an HTML conformance checker and existing Axe/browser tests.
- A repository check prevents regression in redundant roles, fake neutral-element controls, and split-table/header association patterns.
- Public docs state the HTML-first rule and explain the exception test.

## Known baseline constraints

- `sw validation run --scope workflow-numbering` already reports 33 legacy numbering findings; this audit did not create them. It still allocates `F-SWQT-0007` and `S-SWQT-0019`.
- The initial consumer typecheck exposed nine pre-existing literal-type inference errors in `source-highlight.tsx`. Two local variables now carry explicit `string` annotations, preserving runtime behavior and restoring the full typecheck gate.

## Completed outcome

The recommended compatibility-preserving migration is complete:

- `Progress` now renders native `progress`; pagination, breadcrumb, search, spinner, loading, and table primitives no longer add redundant or misleading semantics.
- `DateRangePresetPicker` now uses native radio inputs in `fieldset`/`legend`; `PopoverSelect` now uses native `select`/`option`, while the searchable `Combobox` remains custom because it has no behaviorally equivalent basic HTML control.
- `ServerDataTable` now renders one table containing its associated header and body, with a sticky native `thead`.
- Both authored HTML documents use a canonical doctype and void-element syntax.
- Package guidance records the HTML-first rule, the native-equivalence exception test, and component-specific usage.
- `html-validate` 11.5.6 is pinned as a development dependency. `bun run check:html-standards` checks eight source contracts and both authored documents through its programmatic API, avoiding a CLI incompatibility with the repository's current Node runtime.
- Portal browser coverage validates the migrated interactions, the single-table model, accessibility in light/dark themes, and representative rendered documents with the same offline conformance engine.

Final evidence: source/document conformance passed; design-contract, catalog/export, Portal and consumer typechecks, unit tests, builds, MCP smoke, complete browser suites, and packed-consumer verification all passed. The packed-consumer matrix passed in both nested and workspace-hoisted dependency layouts; its six skips per layout are the project's declared non-applicable cases, not failures.

The remote validator.nu research probe found no structural HTML errors in representative output. Its remaining observations came from generated CSS parsing and the conventional `style[type="text/css"]` emitted by a dependency, so the committed gate intentionally focuses on standards conformance rather than style-policy heuristics.
