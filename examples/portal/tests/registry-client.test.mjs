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
  test("loads fixture metadata for @swui/ui", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    const response = await getPackageMetadata("@swui/ui", { now: 1_000 });
    expect(response.stale).toBe(false);
    expect(response.data?.["dist-tags"].latest).toBe("1.0.0");
    expect(summarizePackage(response.data)?.peerDependencies).toEqual({
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "@swui/ui-tokens": "^1.0.0"
    });
  });

  test("reuses cache within TTL", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    const first = await getPackageMetadata("@swui/ui-tokens", { now: 10_000 });
    const second = await getPackageMetadata("@swui/ui-tokens", { now: 10_000 + 60_000 });
    expect(first.cachedAt).toBe(second.cachedAt);
    expect(second.stale).toBe(false);
  });

  test("marks stale when live fetch fails and cache exists", async () => {
    process.env.REGISTRY_FIXTURE = "1";
    await getPackageMetadata("@swui/ui", { now: 100_000 });
    const stale = await getPackageMetadata("@swui/ui", {
      now: 100_000 + 16 * 60_000,
      useFixture: false,
      registryUrl: "https://invalid.example.test/",
      ttlMs: 0
    });
    expect(stale.stale).toBe(true);
    expect(stale.data?.name).toBe("@swui/ui");
    expect(stale.error).toBeTruthy();
  });

  test("buildInstallHint returns npmrc template without tarball links", () => {
    const hint = buildInstallHint("https://npm.inet.swqt.net/");
    expect(hint.npmrc).toContain("@swui:registry=https://npm.inet.swqt.net/");
    expect(hint.commands.bun).toContain("bun add");
    expect(JSON.stringify(hint)).not.toContain(".tgz");
  });

  test("encodePackageName matches registry path encoding", () => {
    expect(encodePackageName("@swui/ui")).toBe("@swui%2fui");
  });
});
