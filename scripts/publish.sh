#!/usr/bin/env bash
# Pack (and optionally publish) @swui/ui-tokens and @swui/ui.
# Default: local pack only (offline-safe dry evidence).
# Pass --npm-dry-run to also run `npm publish --dry-run` against the private registry.
# Pass --apply to publish for real (requires registry auth).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="${SWUI_NPM_REGISTRY:-https://npm.inet.swqt.net/}"
MODE="pack"
if [[ "${1:-}" == "--npm-dry-run" ]]; then
  MODE="npm-dry-run"
elif [[ "${1:-}" == "--apply" ]]; then
  MODE="apply"
fi

export PATH="${HOME}/.bun/bin:${PATH}"
cd "$ROOT"
bun install

PACKAGES=(packages/ui-tokens packages/ui)

for pkg in "${PACKAGES[@]}"; do
  echo "==> packing ${pkg}"
  (cd "$pkg" && rm -f ./*.tgz && bun pm pack)
done

if [[ "$MODE" == "pack" ]]; then
  echo "pack complete (offline). Artifacts: packages/*/*.tgz"
  echo "Next: ./scripts/publish.sh --npm-dry-run   # needs registry reachability"
  echo "Or:   ./scripts/publish.sh --apply         # real publish"
  exit 0
fi

if [[ "$MODE" == "npm-dry-run" ]]; then
  echo "==> npm publish --dry-run against ${REGISTRY}"
  for pkg in "${PACKAGES[@]}"; do
    (cd "$pkg" && npm publish --dry-run --registry "$REGISTRY")
  done
  echo "npm dry-run complete."
  exit 0
fi

echo "==> npm publish --apply against ${REGISTRY}"
for pkg in packages/ui-tokens packages/ui; do
  (cd "$pkg" && npm publish --registry "$REGISTRY" --access restricted)
done
echo "publish complete."
