# swui

Organization-shared Web UI library: design tokens, React primitives, global light/dark themes, and agent/LLM first-hop docs. Project-wide experience guidance lives in [`docs/README.md`](docs/README.md).

## Packages

| Package | NPM name | Role |
|---------|----------|------|
| [`packages/ui-tokens`](packages/ui-tokens) | `@swqt/ui-tokens` | CSS tokens + Tailwind v4 `@theme` bridges |
| [`packages/ui`](packages/ui) | `@swqt/ui` | React primitives, theme provider, `WideScreenGate` |

## Agent / LLM first hop

After install, agents should read from `node_modules`:

1. `@swqt/ui/AGENTS.md` (and `@swqt/ui-tokens/AGENTS.md`)
2. `llms.txt`
3. Package `docs/*`

These files ship inside the published tarballs.

## Consumers

- Install from the public npm registry:

  ```bash
  bun add @swqt/ui @swqt/ui-tokens
  # or: npm install @swqt/ui @swqt/ui-tokens
  ```

- Local sibling checkout via `file:` / Bun workspace link (see consuming apps).
- Org mirror: set `SWUI_NPM_REGISTRY` (for example `https://npm.inet.swqt.net/`) when not using npmjs.org directly.

## Develop

```bash
bun install
bun run example:build
./scripts/publish.sh          # offline pack
./scripts/publish.sh --npm-dry-run  # dry-run against registry.npmjs.org (npm login required)
./scripts/publish.sh --apply  # local publish fallback (npm login + @swqt org access)
```

### CI publish (Trusted Publishing / OIDC)

Full checklist: [`docs/experience/npm-publish-sop.md`](docs/experience/npm-publish-sop.md)（含 **脱敏安全审计** `bun run check:npm-publish-audit`）。

Preferred path: GitHub Actions workflow [`.github/workflows/publish-npm.yml`](.github/workflows/publish-npm.yml) — no long-lived `NPM_TOKEN`.

1. On [npmjs.com](https://www.npmjs.com), open **`@swqt/ui-tokens`** and **`@swqt/ui`** → **Settings** → **Trusted Publisher** → **GitHub Actions**:
   - Organization/user: `briskh`
   - Repository: `swui`
   - Workflow filename: `publish-npm.yml`
2. Bump versions in both `packages/*/package.json`, merge to `main`.
3. Run **Actions → Publish npm packages → Run workflow** (dry run first), or publish a GitHub **Release** to trigger automatically.

First publish may need one manual `npm publish` per package if trusted publisher cannot be registered before the name exists.

## Example

[`examples/ui-consumer`](examples/ui-consumer) is a minimal second-app proof.
