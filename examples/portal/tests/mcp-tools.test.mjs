import { afterEach, afterAll, beforeAll, describe, expect, test } from "bun:test";
import { catalogSearchPayload, componentGetPayload, installHintPayload, packageGetPayload } from "../server/handlers.ts";
import { __resetRegistryCacheForTests } from "../server/registry-client.ts";
import { syncDocs } from "../scripts/sync-docs.mjs";

const originalFixture = process.env.REGISTRY_FIXTURE;

describe("mcp tool payloads", () => {
  beforeAll(() => {
    syncDocs();
    process.env.REGISTRY_FIXTURE = "1";
  });

  test("package.get returns summary and meta", async () => {
    const payload = await packageGetPayload("@swui/ui");
    expect(payload.package?.latest).toBe("1.0.0");
    expect(payload.meta.stale).toBe(false);
  });

  test("installHint returns commands and tracked packages", async () => {
    const payload = await installHintPayload();
    expect(payload.commands.npm).toContain("npm install");
    expect(payload.packages).toHaveLength(2);
    expect(payload.npmrc).toContain("@swui:registry=");
  });

  test("catalog.search returns Button matches", () => {
    const payload = catalogSearchPayload("Button");
    expect(payload.count).toBeGreaterThan(0);
    expect(payload.results.some((entry) => entry.name === "Button")).toBe(true);
  });

  test("component.get returns export details", () => {
    const payload = componentGetPayload("Button");
    expect(payload.found).toBe(true);
    expect(payload.component.demoPath).toBe("/components/actions/button");
    expect(payload.component.resourceUri).toBe("swui://components/Button");
  });
});

afterEach(() => {
  __resetRegistryCacheForTests();
});

afterAll(() => {
  if (originalFixture === undefined) {
    delete process.env.REGISTRY_FIXTURE;
  } else {
    process.env.REGISTRY_FIXTURE = originalFixture;
  }
});
