import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(scriptDir, "..");
const repoRoot = join(portalRoot, "../..");

export function readCatalogIndex(portalDir = portalRoot) {
  const path = join(portalDir, ".generated/catalog-index.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

export function flattenCatalogExports(index) {
  return index.groups.flatMap((group) =>
    group.exports.map((entry) => ({
      ...entry,
      groupId: group.id,
      groupTitle: group.title
    }))
  );
}

export function findCatalogEntry(index, name) {
  return flattenCatalogExports(index).find((entry) => entry.name === name) ?? null;
}

export function demoUrlPath(groupId, exportSlug) {
  return `/components/${groupId}/${exportSlug}`;
}

export function componentResourceUri(name) {
  return `swui://components/${name}`;
}

export function componentResourceBody(entry) {
  return JSON.stringify(
    {
      name: entry.name,
      group: entry.groupTitle,
      groupId: entry.groupId,
      slug: entry.slug,
      notes: entry.notes,
      demoPath: demoUrlPath(entry.groupId, entry.slug),
      import: `@swui/ui${entry.name === "cn" ? "/utils" : entry.name === "DateHelpers" ? "/date" : ""}`
    },
    null,
    2
  );
}

export function searchCatalog(index, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return flattenCatalogExports(index);
  }
  return flattenCatalogExports(index).filter((entry) => {
    const haystack = `${entry.name} ${entry.groupTitle} ${entry.notes}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function getComponentDetails(index, name) {
  const entry = findCatalogEntry(index, name);
  if (!entry) {
    return null;
  }
  return {
    name: entry.name,
    group: entry.groupTitle,
    groupId: entry.groupId,
    slug: entry.slug,
    notes: entry.notes,
    demoPath: demoUrlPath(entry.groupId, entry.slug),
    resourceUri: componentResourceUri(entry.name)
  };
}

export { repoRoot, portalRoot };
