import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { checkDocsSync, getCopyPlan, syncDocs } from "../scripts/sync-docs.mjs";

describe("sync-docs", () => {
  let tempRoot = "";

  afterEach(() => {
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
      tempRoot = "";
    }
  });

  test("copies UI and token docs into .generated", () => {
    tempRoot = mkdtempSync(join(tmpdir(), "portal-sync-"));
    const portalDir = join(tempRoot, "portal");
    mkdirSync(portalDir, { recursive: true });
    const repoRoot = join(import.meta.dir, "../../..");
    const copied = syncDocs({ portalDir, repo: repoRoot });
    expect(copied.length).toBeGreaterThan(4);
    expect(readFileSync(join(portalDir, ".generated/docs/ADOPTION.md"), "utf8")).toContain("Portal MCP");
    expect(readFileSync(join(portalDir, ".generated/AGENTS.md"), "utf8")).toContain("@swqt/ui");
    expect(readFileSync(join(portalDir, ".generated/tokens/docs/TOKENS.md"), "utf8")).toContain(
      "@swqt/ui-tokens"
    );
    expect(readFileSync(join(portalDir, ".generated/tokens/AGENTS.md"), "utf8")).toContain(
      "@swqt/ui-tokens"
    );
    expect(
      JSON.parse(readFileSync(join(portalDir, ".generated/release-versions.json"), "utf8"))
    ).toEqual({
      "@swqt/ui": "1.1.0",
      "@swqt/ui-tokens": "1.1.0"
    });
  });

  test("--check detects drift without writing", () => {
    tempRoot = mkdtempSync(join(tmpdir(), "portal-check-"));
    const portalDir = join(tempRoot, "portal");
    mkdirSync(portalDir, { recursive: true });
    const repoRoot = join(import.meta.dir, "../../..");
    syncDocs({ portalDir, repo: repoRoot });
    writeFileSync(join(portalDir, ".generated/AGENTS.md"), "stale content\n", "utf8");
    const drift = checkDocsSync({ portalDir, repo: repoRoot });
    expect(drift.length).toBe(1);
  });

  test("copy plan includes all convention docs", () => {
    const repoRoot = join(import.meta.dir, "../../..");
    const plan = getCopyPlan(join(import.meta.dir, ".."), repoRoot);
    const dests = plan.map((entry) => entry.dest);
    expect(dests.some((dest) => dest.endsWith("docs/DESIGN-SUMMARY.md"))).toBe(true);
    expect(dests.some((dest) => dest.endsWith("docs/DO-AND-DONT.md"))).toBe(true);
    expect(dests.some((dest) => dest.endsWith("docs/COMPONENT-CATALOG.md"))).toBe(true);
    expect(dests.some((dest) => dest.endsWith("tokens/docs/TOKENS.md"))).toBe(true);
    expect(dests.some((dest) => dest.endsWith("tokens/llms.txt"))).toBe(true);
  });
});
