# 1.2.0 release delta

Minor release of `@swqt/ui` adding read-only detail-field primitives for list → detail admin pages. `@swqt/ui-tokens` remains **1.1.0** (no token changes).

## Source delta since 1.1.0

| Change | Consumer-visible result |
|--------|-------------------------|
| `DescriptionList` / `DescriptionItem` / `DescriptionSection` | Semantic `dl`/`dt`/`dd` detail field grid (columns, compact, span, mono, copyable, empty, values→Chip) |
| `CopyableText` | Inline value + icon-compact copy (SourceCode-aligned; no toast) |
| Catalog + portal demos | Data-display demos for summary, JSON full-span, Chip row, empty, compact 1-col |
| Docs | ADOPTION / DESIGN-SUMMARY / AGENTS detail-page pattern: List=`ServerDataTable`, fields=`DescriptionList`, JSON=`SourceCode`, nav=`Breadcrumb` |

## Exports (new)

```ts
import {
  DescriptionList,
  DescriptionItem,
  DescriptionSection,
  CopyableText,
} from "@swqt/ui";
```

## Freshness contract

| Surface | Expected |
|---------|----------|
| Local / packed `@swqt/ui` | `1.2.0` |
| npm `@swqt/ui` | `1.2.0` (`latest`) after authorized publish |
| npm `@swqt/ui-tokens` | still `1.1.0` |
| Production Portal / MCP | unchanged until separately authorized deploy |

## Verification (2026-07-24)

**Pre-publish**

- `sync-docs` / `sync-docs:check` / `check:catalog-export` / `check:design-contract`: passed
- `pack` + `check:npm-publish-audit`: **0 blocking**, 4 reviewed public service URL warnings
- Portal unit tests: passed
- `example:build` + `portal:build`: passed
- `verify:packed-consumer`: nested and workspace-hoisted each **34 passed / 6 declared skips**; shipped docs byte-match SSOT

**Post-publish (outside-in)**

- GitHub Release [`v1.2.0`](https://github.com/briskh/swui/releases/tag/v1.2.0) → Actions `publish-npm.yml` succeeded (`+ @swqt/ui@1.2.0`, provenance published)
- Registry (after CDN lag): `npm view @swqt/ui version` → **1.2.0**; `@swqt/ui-tokens` → **1.1.0**
- Package: https://www.npmjs.com/package/@swqt/ui
