import { afterEach, afterAll, beforeAll, describe, expect, test } from "bun:test";
import { installHintPayload, packageGetPayload } from "../server/handlers.ts";
import { __resetRegistryCacheForTests } from "../server/registry-client.ts";
import { syncDocs } from "../scripts/sync-docs.mjs";

const originalFixture = process.env.REGISTRY_FIXTURE;

beforeAll(() => {
  syncDocs();
  process.env.REGISTRY_FIXTURE = "1";
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

describe("mcp tool payloads", () => {
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
});
