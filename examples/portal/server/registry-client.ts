import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildInstallHint as buildInstallHintFromShared,
  DEFAULT_NPM_REGISTRY,
  normalizeRegistryUrl
} from "../shared/registry-install";

const DEFAULT_REGISTRY = DEFAULT_NPM_REGISTRY;
const DEFAULT_TTL_MS = 15 * 60 * 1000;
const PACKAGES = ["@swqt/ui", "@swqt/ui-tokens"] as const;

export type SwuiPackageName = (typeof PACKAGES)[number];

export interface RegistryPackageMeta {
  name: string;
  "dist-tags": Record<string, string>;
  versions: Record<
    string,
    {
      version: string;
      peerDependencies?: Record<string, string>;
      dependencies?: Record<string, string>;
    }
  >;
}

export interface RegistryResponse {
  stale: boolean;
  cachedAt: string | null;
  live: boolean;
  source: "registry" | "cache" | "fixture" | "none";
  registry: string;
  data: RegistryPackageMeta | null;
  error?: string;
}

interface CacheEntry {
  cachedAt: number;
  data: RegistryPackageMeta;
}

const serverDir = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(serverDir, "..");
const fixtureRoot = join(portalRoot, "fixtures/registry");

/** @type {Map<string, CacheEntry>} */
const cache = new Map();

export function getDefaultRegistryUrl() {
  return process.env.SWUI_NPM_REGISTRY ?? DEFAULT_REGISTRY;
}

export function getTrackedPackages(): readonly SwuiPackageName[] {
  return PACKAGES;
}

export function encodePackageName(name: string) {
  if (name.startsWith("@")) {
    const slashIndex = name.indexOf("/");
    if (slashIndex === -1) {
      return name;
    }
    return `${name.slice(0, slashIndex)}%2f${name.slice(slashIndex + 1)}`;
  }
  return encodeURIComponent(name);
}

export function decodePackageParam(param: string) {
  return decodeURIComponent(param);
}

function fixturePath(encodedName: string) {
  return join(fixtureRoot, `${encodedName}.json`);
}

function loadFixture(encodedName: string): RegistryPackageMeta {
  return JSON.parse(readFileSync(fixturePath(encodedName), "utf8")) as RegistryPackageMeta;
}

async function fetchLive(encodedName: string, registryUrl: string): Promise<RegistryPackageMeta> {
  const base = registryUrl.endsWith("/") ? registryUrl : `${registryUrl}/`;
  const response = await fetch(`${base}${encodedName}`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`registry ${response.status} for ${encodedName}`);
  }
  return (await response.json()) as RegistryPackageMeta;
}

export async function getPackageMetadata(
  packageName: string,
  options: { registryUrl?: string; ttlMs?: number; now?: number; useFixture?: boolean } = {}
): Promise<RegistryResponse> {
  const registryUrl = options.registryUrl ?? getDefaultRegistryUrl();
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const now = options.now ?? Date.now();
  const useFixture = options.useFixture ?? process.env.REGISTRY_FIXTURE === "1";
  const encodedName = encodePackageName(packageName);
  const cacheKey = `${normalizeRegistryUrl(registryUrl)}|${encodedName}`;
  const cached = cache.get(cacheKey);

  if (cached && now - cached.cachedAt < ttlMs) {
    return {
      stale: false,
      cachedAt: new Date(cached.cachedAt).toISOString(),
      live: false,
      source: "cache",
      registry: registryUrl,
      data: cached.data
    };
  }

  try {
    const data = useFixture ? loadFixture(encodedName) : await fetchLive(encodedName, registryUrl);
    cache.set(cacheKey, { cachedAt: now, data });
    return {
      stale: false,
      cachedAt: new Date(now).toISOString(),
      live: !useFixture,
      source: useFixture ? "fixture" : "registry",
      registry: registryUrl,
      data
    };
  } catch (error) {
    if (cached) {
      return {
        stale: true,
        cachedAt: new Date(cached.cachedAt).toISOString(),
        live: false,
        source: "cache",
        registry: registryUrl,
        data: cached.data,
        error: error instanceof Error ? error.message : String(error)
      };
    }
    return {
      stale: true,
      cachedAt: null,
      live: false,
      source: "none",
      registry: registryUrl,
      data: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export function buildInstallHint(registryUrl = getDefaultRegistryUrl()) {
  return buildInstallHintFromShared(registryUrl);
}

export function summarizePackage(meta: RegistryPackageMeta | null, requestedVersion?: string) {
  if (!meta) {
    return null;
  }
  const latest = meta["dist-tags"]?.latest ?? null;
  const resolvedVersion = requestedVersion ?? latest;
  const versionMeta = resolvedVersion ? meta.versions?.[resolvedVersion] : undefined;
  if (!resolvedVersion || !versionMeta) {
    return null;
  }
  return {
    name: meta.name,
    latest,
    requestedVersion: requestedVersion ?? null,
    resolvedVersion,
    isLatest: resolvedVersion === latest,
    versions: Object.keys(meta.versions ?? {}).sort((a, b) => b.localeCompare(a, undefined, { numeric: true })),
    peerDependencies: versionMeta.peerDependencies ?? {},
    dependencies: versionMeta.dependencies ?? {}
  };
}

/** @internal */
export function __resetRegistryCacheForTests() {
  cache.clear();
}
