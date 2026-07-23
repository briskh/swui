export const DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org/";

export function normalizeRegistryUrl(registryUrl: string) {
  return registryUrl.endsWith("/") ? registryUrl : `${registryUrl}/`;
}

export function isPublicNpmRegistry(registryUrl: string) {
  try {
    return new URL(normalizeRegistryUrl(registryUrl)).host === "registry.npmjs.org";
  } catch {
    return false;
  }
}

export function buildNpmrcTemplate(registryUrl: string) {
  const base = normalizeRegistryUrl(registryUrl);
  if (isPublicNpmRegistry(base)) {
    return [
      "# Public packages on npmjs.org — no .npmrc required.",
      "# Optional org mirror:",
      "# @swqt:registry=https://npm.inet.swqt.net/",
      "# //npm.inet.swqt.net/:_authToken=${NPM_TOKEN}"
    ].join("\n");
  }
  return `@swqt:registry=${base}\n//${new URL(base).host}/:_authToken=\${NPM_TOKEN}`;
}

export function buildInstallHint(registryUrl = DEFAULT_NPM_REGISTRY) {
  const base = normalizeRegistryUrl(registryUrl);
  return {
    registry: base,
    npmrc: buildNpmrcTemplate(base),
    commands: {
      bun: "bun add @swqt/ui @swqt/ui-tokens",
      npm: "npm install @swqt/ui @swqt/ui-tokens"
    }
  };
}
