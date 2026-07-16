# swui

Organization-shared Web UI library: design tokens, React primitives, global light/dark themes, and agent/LLM first-hop docs. Project-wide experience guidance lives in [`docs/README.md`](docs/README.md).

## Packages

| Package | NPM name | Role |
|---------|----------|------|
| [`packages/ui-tokens`](packages/ui-tokens) | `@swui/ui-tokens` | CSS tokens + Tailwind v4 `@theme` bridges |
| [`packages/ui`](packages/ui) | `@swui/ui` | React primitives, theme provider, `WideScreenGate` |

## Agent / LLM first hop

After install, agents should read from `node_modules`:

1. `@swui/ui/AGENTS.md` (and `@swui/ui-tokens/AGENTS.md`)
2. `llms.txt`
3. Package `docs/*`

These files ship inside the published tarballs.

## Consumers

- Install from the private registry (`SWUI_NPM_REGISTRY`, default `https://npm.inet.swqt.net/`), or
- Local sibling checkout via `file:` / Bun workspace link (see consuming apps).

## Develop

```bash
bun install
bun run example:build
./scripts/publish.sh          # offline pack
./scripts/publish.sh --apply  # real publish (auth required)
```

## Example

[`examples/ui-consumer`](examples/ui-consumer) is a minimal second-app proof.
