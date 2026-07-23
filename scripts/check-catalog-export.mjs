#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseComponentCatalog } from "../examples/portal/scripts/generate-catalog-index.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const portalRoot = join(repoRoot, "examples/portal");
const uiRoot = join(repoRoot, "packages/ui/src");

const PACKAGE_EXPORT_ALLOWLIST = new Set([
  "cn",
  "ThemeProvider",
  "ThemeControl",
  "useTheme",
  "THEME_STORAGE_KEY",
  "themeInitializationScript",
  "Theme",
  "ThemePreference",
  "SimpleFormField",
  "localCalendarDayToUtcIso",
  "formatUtcInstantForLocalDisplay",
  "DATE_RANGE_PRESET_LABELS",
  "getUtcRangeForPreset",
  "DateRangePreset",
  "UtcDateRange"
]);

const CATALOG_VIRTUAL_EXPORTS = new Set(["DateHelpers"]);

const CATALOG_PACKAGE_ALIASES = {
  FormField: "SimpleFormField"
};

const DOCUMENTED_EXCEPTIONS = new Set([
  "toastPolicy",
  "ThemeProvider",
  "useTheme",
  "Theme",
  "ChartTooltipContent",
  "ChartLegendContent"
]);

function readCatalogExports() {
  const catalogPath = join(portalRoot, ".generated/catalog-index.json");
  const markdownPath = join(repoRoot, "packages/ui/docs/COMPONENT-CATALOG.md");
  const exports =
    readFileSync(catalogPath, "utf8");
  try {
    return JSON.parse(exports).groups.flatMap((group) => group.exports.map((entry) => entry.name));
  } catch {
    return parseComponentCatalog(readFileSync(markdownPath, "utf8")).groups.flatMap((group) =>
      group.exports.map((entry) => entry.name)
    );
  }
}

function collectNamedExportsFromFile(filePath) {
  const source = readFileSync(filePath, "utf8");
  const names = new Set();
  for (const match of source.matchAll(/^export (?:const|function|type|class|enum)\s+([A-Za-z0-9_]+)/gm)) {
    names.add(match[1]);
  }
  for (const match of source.matchAll(/^export \{([^}]+)\}/gm)) {
    for (const part of match[1].split(",")) {
      const trimmed = part.trim();
      const alias = trimmed.match(/^([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?$/);
      if (alias) {
        names.add(alias[2] ?? alias[1]);
      }
    }
  }
  return names;
}

function collectPackageExports() {
  const names = new Set();
  const indexSource = readFileSync(join(uiRoot, "index.ts"), "utf8");
  for (const match of indexSource.matchAll(/^export \{([^}]+)\}\s+from\s+"([^"]+)"/gm)) {
    for (const part of match[1].split(",")) {
      const trimmed = part.trim();
      const alias = trimmed.match(/^([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?$/);
      if (alias) {
        names.add(alias[2] ?? alias[1]);
      }
    }
  }
  for (const match of indexSource.matchAll(/^export \* from "\.\/components\/([^"]+)"/gm)) {
    const file = join(uiRoot, "components", `${match[1]}.tsx`);
    for (const exportName of collectNamedExportsFromFile(file)) {
      names.add(exportName);
    }
  }
  for (const match of indexSource.matchAll(/^export \* from "\.\/lib\/([^"]+)"/gm)) {
    const file = join(uiRoot, "lib", `${match[1]}.ts`);
    for (const exportName of collectNamedExportsFromFile(file)) {
      names.add(exportName);
    }
  }
  for (const exportName of collectNamedExportsFromFile(join(uiRoot, "theme.tsx"))) {
    names.add(exportName);
  }
  return names;
}

function collectDemoExports() {
  const content = readFileSync(join(portalRoot, "src/demos/content.tsx"), "utf8");
  const names = new Set();
  for (const match of content.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\(\)\s=>/gm)) {
    names.add(match[1]);
  }
  return names;
}

function main() {
  const catalogExports = readCatalogExports();
  const packageExports = collectPackageExports();
  const demoExports = collectDemoExports();
  const failures = [];

  for (const name of catalogExports) {
    if (CATALOG_VIRTUAL_EXPORTS.has(name)) {
      continue;
    }
    if (!packageExports.has(name) && !packageExports.has(CATALOG_PACKAGE_ALIASES[name])) {
      failures.push(`catalog export "${name}" is missing from @swui/ui public exports`);
    }
    if (!demoExports.has(name) && !DOCUMENTED_EXCEPTIONS.has(name)) {
      failures.push(`catalog export "${name}" is missing from portal demo registry`);
    }
  }

  if (failures.length > 0) {
    console.error("check:catalog-export failed:");
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }

  console.log(
    `check:catalog-export passed (${catalogExports.length} catalog exports, ${packageExports.size} package exports, ${demoExports.size} demos)`
  );
}

main();
