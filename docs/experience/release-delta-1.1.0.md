# 1.1.0 release delta and freshness evidence

Release candidate `1.1.0` contains the repository changes made after npm `1.0.0` and the first production swui MCP deployment.

## Source delta since 1.0.0

| Source change | Consumer-visible result | Evidence |
|---|---|---|
| `6d9a637` Portal/foundation adoption | Complete `/colors` and `/typography` references, broader component adoption, calibrated semantic tokens | `check:design-contract`, Portal browser matrix |
| `be78477` HTML Living Standard migration | Native `<progress>`, form controls and one semantic table; HTML-first package contract and offline conformance gate | `check:html-standards`, Portal and consumer browser tests |
| `F-SWQT-0008` progressive disclosure | `/icons`, HTML MCP resource, mandatory `contractRefs`, absolute `referenceSite` URLs, source-vs-registry release status | MCP unit/smoke, docs sync, packed consumers |

## Freshness contract

`swui.package.get` reports registry truth and source truth separately:

- `resolvedVersion` and `latest` come from the registry response.
- `sourceVersion` comes from the source package manifest deployed with the MCP service.
- `sourcePublished` says whether that exact source version exists in registry metadata.
- `releaseStatus=source-ahead` means the service source is newer than the published package. It is not an installation promise.

## Evidence matrix

| Surface | Expected before publish/deploy | Authority |
|---|---|---|
| Local source | `1.1.0`, all current gates pass | repository manifests and tests |
| Packed artifact | `1.1.0`, nested and hoisted consumers pass, shipped docs byte-match SSOT | `verify:packed-consumer` |
| npm registry | **`1.1.0` published** (2026-07-24) | `registry.npmjs.org` / `swui.package.get` |
| Production MCP | `1.0.0` contract until separately authorized deploy | outside-in initialize/resources/tools calls |

Never infer npm or production freshness from a local test. After an authorized publish or deploy, repeat the exact outside-in checks and update the dated project companion fact.

## 2026-07-24 candidate verification

- Local static/type/build/unit/MCP gates: passed.
- Portal browser: 60/60 passed.
- Source consumer browser: 34 passed, 6 declared non-applicable viewport skips.
- Packed `1.1.0` nested and workspace-hoisted consumers: each 34 passed, 6 declared skips; package docs byte-match source SSOT.
- `npm publish --dry-run`: passed for both packages; tarball audit found 0 blocking findings and 4 reviewed public service URL warnings.
- npm outside-in after authorized publish: both packages are `1.1.0` (`latest`).
- Production MCP outside-in: `swui 1.0.0`, 10 resources, one template, four tools; old Button payload has no new contract fields.
- Production Portal outside-in: HTTP 200, but `/icons` and the strengthened `/agent` content are not deployed.
