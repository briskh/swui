import catalogIndex from "../../.generated/catalog-index.json";

export type CatalogExport = {
  name: string;
  slug: string;
  notes: string;
};

export type CatalogGroup = {
  id: string;
  title: string;
  exports: CatalogExport[];
};

export type CatalogIndex = {
  generatedAt: string;
  groups: CatalogGroup[];
};

export const catalog = catalogIndex as CatalogIndex;

export function findCatalogExport(groupSlug: string, exportSlug: string) {
  const group = catalog.groups.find((entry) => entry.id === groupSlug);
  if (!group) return null;
  const exportEntry = group.exports.find((entry) => entry.slug === exportSlug);
  if (!exportEntry) return null;
  return { group, export: exportEntry };
}

export function demoPath(groupSlug: string, exportSlug: string) {
  return `/components/${groupSlug}/${exportSlug}`;
}

export function totalExportCount() {
  return catalog.groups.reduce((sum, group) => sum + group.exports.length, 0);
}
