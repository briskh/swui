import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findExport, parseComponentCatalog, slugify } from "../scripts/generate-catalog-index.mjs";
import { syncDocs } from "../scripts/sync-docs.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const catalogPath = join(repoRoot, "packages/ui/docs/COMPONENT-CATALOG.md");

describe("catalog index generator", () => {
  test("parses groups, slugs, and multi-export rows", () => {
    const index = parseComponentCatalog(readFileSync(catalogPath, "utf8"));
    expect(index.groups.length).toBeGreaterThanOrEqual(8);
    expect(findExport(index, "actions", "button")?.name).toBe("Button");
    expect(slugify("Theme & utils")).toBe("theme-utils");
    const exportCount = index.groups.reduce((sum, group) => sum + group.exports.length, 0);
    expect(exportCount).toBeGreaterThanOrEqual(70);
  });

  test("sync-docs writes catalog-index.json", () => {
    syncDocs();
    const generated = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../.generated/catalog-index.json"), "utf8"));
    expect(generated.groups.some((group) => group.id === "feedback")).toBe(true);
    expect(generated.groups.find((group) => group.id === "charts")?.exports.map((entry) => entry.name)).toEqual([
      "ChartContainer",
      "ChartTooltipContent",
      "ChartLegendContent"
    ]);
  });
});
