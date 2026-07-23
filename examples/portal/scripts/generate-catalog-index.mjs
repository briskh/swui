#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseExportNames(exportCell) {
  if (/Chart\*/i.test(exportCell)) {
    return ["ChartContainer", "ChartTooltipContent", "ChartLegendContent"];
  }
  const names = [...exportCell.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim());
  if (names.length === 0) {
    const dateMatch = exportCell.match(/Date helpers/i);
    if (dateMatch) {
      return ["DateHelpers"];
    }
  }
  return names.filter((name) => !name.includes("*") && name.toLowerCase() !== "chart");
}

export function parseComponentCatalog(markdown) {
  const groups = [];
  let currentGroup = null;

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      const title = heading[1].trim();
      currentGroup = {
        id: slugify(title),
        title,
        exports: []
      };
      groups.push(currentGroup);
      continue;
    }

    if (!currentGroup) continue;
    const row = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
    if (!row) continue;
    const exportCell = row[1].trim();
    const notes = row[2].trim();
    if (exportCell === "Export" || exportCell.includes("---")) continue;

    const names = parseExportNames(exportCell);
    for (const name of names) {
      if (!name) continue;
      currentGroup.exports.push({
        name,
        slug: slugify(name),
        notes
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    groups
  };
}

export function generateCatalogIndex({ catalogPath, outPath }) {
  const markdown = readFileSync(catalogPath, "utf8");
  const index = parseComponentCatalog(markdown);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  return index;
}

export function findExport(index, groupSlug, exportSlug) {
  for (const group of index.groups) {
    if (group.id !== groupSlug) continue;
    return group.exports.find((entry) => entry.slug === exportSlug) ?? null;
  }
  return null;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const portalRoot = join(dirname(new URL(import.meta.url).pathname), "..");
  const repoRoot = join(portalRoot, "../..");
  const catalogPath = join(repoRoot, "packages/ui/docs/COMPONENT-CATALOG.md");
  const outPath = join(portalRoot, ".generated/catalog-index.json");
  const index = generateCatalogIndex({ catalogPath, outPath });
  const exportCount = index.groups.reduce((sum, group) => sum + group.exports.length, 0);
  console.log(`catalog-index: ${index.groups.length} groups, ${exportCount} exports -> ${outPath}`);
}
