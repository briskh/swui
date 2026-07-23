import { afterEach, describe, expect, test } from "bun:test";
import {
  __resetRegistryCacheForTests,
  buildInstallHint,
  encodePackageName,
  getPackageMetadata,
  summarizePackage
} from "../server/registry-client.ts";

const originalFixture = process.env.REGISTRY_FIXTURE;

afterEach(() => {
  __resetRegistryCacheForTests();
  if (originalFixture === undefined) {
    delete process.env.REGISTRY_FIXTURE;
  } else {
    process.env.REGISTRY_FIXTURE = originalFixture;
  }
});

describe("registry-client", () => {
  test("loads fixture metadata for @swqt/ui", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    const response = await getPackageMetadata("@swqt/ui", { now: 1_000 });
    expect(response.stale).toBe(false);
    expect(response.source).toBe("fixture");
    expect(response.data?.["dist-tags"].latest).toBe("1.0.0");
    expect(summarizePackage(response.data)?.peerDependencies).toEqual({
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "@swqt/ui-tokens": "^1.0.0"
    });
    expect(summarizePackage(response.data, "0.9.0")?.resolvedVersion).toBe("0.9.0");
    expect(summarizePackage(response.data, "9.9.9")).toBeNull();
  });

  test("reuses cache within TTL", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    const first = await getPackageMetadata("@swqt/ui-tokens", { now: 10_000 });
    const second = await getPackageMetadata("@swqt/ui-tokens", { now: 10_000 + 60_000 });
    expect(first.cachedAt).toBe(second.cachedAt);
    expect(second.stale).toBe(false);
    expect(second.source).toBe("cache");
  });

  test("marks stale when live fetch fails and cache exists", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    const registryUrl = "https://invalid.example.test/";
    await getPackageMetadata("@swqt/ui", { now: 100_000, registryUrl });
    const stale = await getPackageMetadata("@swqt/ui", {
      now: 100_000 + 16 * 60_000,
      useFixture: false,
      registryUrl,
      ttlMs: 0
    });
    expect(stale.stale).toBe(true);
    expect(stale.source).toBe("cache");
    expect(stale.data?.name).toBe("@swqt/ui");
    expect(stale.error).toBeTruthy();
  });

  test("isolates cache entries by registry URL", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    await getPackageMetadata("@swqt/ui", {
      now: 100_000,
      registryUrl: "https://registry-a.example.test/"
    });
    const otherRegistry = await getPackageMetadata("@swqt/ui", {
      now: 100_100,
      useFixture: false,
      registryUrl: "https://registry-b.invalid.example.test/"
    });
    expect(otherRegistry.data).toBeNull();
    expect(otherRegistry.source).toBe("none");
  });

  test("buildInstallHint returns public npmrc by default", () => {
    const hint = buildInstallHint();
    expect(hint.registry).toBe("https://registry.npmjs.org/");
    expect(hint.npmrc).toContain("no .npmrc required");
    expect(hint.commands.bun).toContain("bun add");
    expect(JSON.stringify(hint)).not.toContain(".tgz");
  });

  test("buildInstallHint returns private npmrc template for org mirror", () => {
    const hint = buildInstallHint("https://npm.inet.swqt.net/");
    expect(hint.npmrc).toContain("@swqt:registry=https://npm.inet.swqt.net/");
  });

  test("encodePackageName matches registry path encoding", () => {
    expect(encodePackageName("@swqt/ui")).toBe("@swqt%2fui");
  });
});
