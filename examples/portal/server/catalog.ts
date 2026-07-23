import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(scriptDir, "..");
const repoRoot = join(portalRoot, "../..");

export interface CatalogExport {
  name: string;
  slug: string;
  notes: string;
}

export interface CatalogGroup {
  id: string;
  title: string;
  exports: CatalogExport[];
}

export interface CatalogIndex {
  groups: CatalogGroup[];
}

export interface FlatCatalogExport extends CatalogExport {
  groupId: string;
  groupTitle: string;
}

export interface ComponentImportHint {
  packageName: "@swqt/ui";
  module: string;
  exportName: string;
  kind: "named" | "namespace" | "type";
  statement: string;
  note: string | null;
}

export interface ComponentDetails {
  name: string;
  group: string;
  groupId: string;
  slug: string;
  notes: string;
  demoPath: string;
  demoUrl: string;
  resourceUri: string;
  importHint: ComponentImportHint;
}

export const PORTAL_PUBLIC_URL = "https://ui.swqt.net";

export const CONSUMER_CONTRACT_REFS = [
  "swui://foundation/contract",
  "swui://packages/ui/docs/HTML-STANDARDS.md",
  "swui://packages/ui/AGENTS.md"
] as const;

export function portalReferenceUrls(demoPath?: string) {
  return {
    colors: `${PORTAL_PUBLIC_URL}/colors`,
    typography: `${PORTAL_PUBLIC_URL}/typography`,
    icons: `${PORTAL_PUBLIC_URL}/icons`,
    components: `${PORTAL_PUBLIC_URL}/components`,
    component: demoPath ? `${PORTAL_PUBLIC_URL}${demoPath}` : null
  };
}

export function readCatalogIndex(portalDir = portalRoot): CatalogIndex {
  const path = join(portalDir, ".generated/catalog-index.json");
  return JSON.parse(readFileSync(path, "utf8")) as CatalogIndex;
}

export function flattenCatalogExports(index: CatalogIndex): FlatCatalogExport[] {
  return index.groups.flatMap((group) =>
    group.exports.map((entry) => ({
      ...entry,
      groupId: group.id,
      groupTitle: group.title
    }))
  );
}

export function findCatalogEntry(index: CatalogIndex, name: string): FlatCatalogExport | null {
  return flattenCatalogExports(index).find((entry) => entry.name === name) ?? null;
}

export function demoUrlPath(groupId: string, exportSlug: string) {
  return `/components/${groupId}/${exportSlug}`;
}

export function componentResourceUri(name: string) {
  return `swui://components/${encodeURIComponent(name)}`;
}

export function componentImportHint(name: string): ComponentImportHint {
  if (name === "cn") {
    return {
      packageName: "@swqt/ui",
      module: "@swqt/ui/utils",
      exportName: "cn",
      kind: "named",
      statement: 'import { cn } from "@swqt/ui/utils";',
      note: null
    };
  }
  if (name === "DateHelpers") {
    return {
      packageName: "@swqt/ui",
      module: "@swqt/ui/date",
      exportName: "*",
      kind: "namespace",
      statement: 'import * as DateHelpers from "@swqt/ui/date";',
      note: "DateHelpers is a documented namespace for the date helper exports."
    };
  }
  if (name === "FormField") {
    return {
      packageName: "@swqt/ui",
      module: "@swqt/ui",
      exportName: "SimpleFormField",
      kind: "named",
      statement: 'import { SimpleFormField as FormField } from "@swqt/ui";',
      note: "The package root aliases the implementation export as SimpleFormField."
    };
  }
  if (name === "Theme") {
    return {
      packageName: "@swqt/ui",
      module: "@swqt/ui",
      exportName: "Theme",
      kind: "type",
      statement: 'import type { Theme } from "@swqt/ui";',
      note: "Theme is a TypeScript-only export."
    };
  }
  return {
    packageName: "@swqt/ui",
    module: "@swqt/ui",
    exportName: name,
    kind: "named",
    statement: `import { ${name} } from "@swqt/ui";`,
    note: null
  };
}

export function componentResourceBody(entry: FlatCatalogExport) {
  const demoPath = demoUrlPath(entry.groupId, entry.slug);
  return JSON.stringify(
    {
      name: entry.name,
      group: entry.groupTitle,
      groupId: entry.groupId,
      slug: entry.slug,
      notes: entry.notes,
      demoPath,
      demoUrl: `${PORTAL_PUBLIC_URL}${demoPath}`,
      resourceUri: componentResourceUri(entry.name),
      importHint: componentImportHint(entry.name),
      contractRefs: CONSUMER_CONTRACT_REFS,
      referenceSite: portalReferenceUrls(demoPath)
    },
    null,
    2
  );
}

export function searchCatalog(index: CatalogIndex, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [];
  }
  return flattenCatalogExports(index).filter((entry) => {
    const haystack = `${entry.name} ${entry.groupTitle} ${entry.notes}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function getComponentDetails(index: CatalogIndex, name: string): ComponentDetails | null {
  const entry = findCatalogEntry(index, name);
  if (!entry) {
    return null;
  }
  const demoPath = demoUrlPath(entry.groupId, entry.slug);
  return {
    name: entry.name,
    group: entry.groupTitle,
    groupId: entry.groupId,
    slug: entry.slug,
    notes: entry.notes,
    demoPath,
    demoUrl: `${PORTAL_PUBLIC_URL}${demoPath}`,
    resourceUri: componentResourceUri(entry.name),
    importHint: componentImportHint(entry.name)
  };
}

export { repoRoot, portalRoot };
