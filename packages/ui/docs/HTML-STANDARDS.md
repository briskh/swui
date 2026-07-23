# HTML-first authoring contract

Use the current [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/) as the HTML source of truth and [ARIA in HTML](https://www.w3.org/TR/html-aria/) for allowed ARIA use.

## Rule

Use a standard HTML element or attribute whenever it provides the required semantics and behavior:

- prefer `button`, `a`, `input`, `select`, `progress`, `table`, and headings over neutral elements with a matching `role`;
- rely on an element's implicit role instead of repeating it;
- add ARIA only when native HTML cannot express the required name, state, relationship, or composite-widget behavior;
- keep decorative icons out of the accessibility tree and do not hide adjacent screen-reader text through an ancestor;
- use valid content models and non-obsolete authoring features.

“Whenever possible” includes behavior and compatibility, not only tag shape. A native replacement must preserve the component's keyboard behavior, focus handling, controlled state, supported browsers, and public contract.

## Deliberate exceptions

Neutral containers remain correct when no stronger semantic section exists. Composite controls such as searchable comboboxes, menus, tabs, sliders, and dialogs may retain ARIA/Radix implementations when a native control cannot satisfy the same interaction contract. Document new exceptions near the component and cover their keyboard behavior.

## Verification

Run:

```bash
bun run check:html-standards
bun run check:design-contract
```

The source gate rejects the known regressions in exported primitives and runs the offline `html-validate` checker against authored documents. Portal browser tests feed representative rendered documents to the same offline checker and also cover rendered DOM, accessible names, keyboard behavior, and Axe. The research record for the 2026 audit is `docs/research/R-SWQT-0001-html-living-standard-audit.md` in the source repository.
