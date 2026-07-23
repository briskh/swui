#!/usr/bin/env bash
# Pack (and optionally publish) @swqt/ui-tokens and @swqt/ui.
# Default: local pack only (offline-safe dry evidence).
# Pass --npm-dry-run to also run `npm publish --dry-run` against the target registry.
# First local publish: ./scripts/publish.sh --apply (no provenance; CI adds --provenance via OIDC).
#
# Defaults target the public npm registry (registry.npmjs.org).
# Preferred CI path: .github/workflows/publish-npm.yml (npm Trusted Publishing / OIDC — no NPM_TOKEN).
# Override for a private mirror:
#   SWUI_NPM_REGISTRY=https://npm.inet.swqt.net/ SWUI_NPM_ACCESS=restricted ./scripts/publish.sh --apply
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="${SWUI_NPM_REGISTRY:-https://registry.npmjs.org/}"
ACCESS="${SWUI_NPM_ACCESS:-public}"
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
  echo "Next: bun run check:npm-publish-audit   # desensitized security audit"
  echo "Or:   ./scripts/publish.sh --npm-dry-run   # needs registry reachability + npm login"
  echo "Or:   ./scripts/publish.sh --apply         # real publish to ${REGISTRY}"
  exit 0
fi

if [[ "$MODE" == "npm-dry-run" ]] || [[ "$MODE" == "apply" ]]; then
  echo "==> npm publish security audit (desensitized)"
  bun run check:npm-publish-audit
fi

if [[ "$MODE" == "npm-dry-run" ]]; then
  echo "==> npm publish --dry-run against ${REGISTRY} (access=${ACCESS})"
  for pkg in "${PACKAGES[@]}"; do
    (cd "$pkg" && npm publish --dry-run --registry "$REGISTRY")
  done
  echo "npm dry-run complete."
  exit 0
fi

echo "==> npm publish --apply against ${REGISTRY} (access=${ACCESS})"
OTP_ARGS=()
if [[ -n "${NPM_OTP:-}" ]]; then
  OTP_ARGS=(--otp "$NPM_OTP")
fi
for pkg in packages/ui-tokens packages/ui; do
  (cd "$pkg" && npm publish --registry "$REGISTRY" --access "$ACCESS" "${OTP_ARGS[@]}")
done
echo "publish complete."
