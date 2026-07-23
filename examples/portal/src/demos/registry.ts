import { catalog } from "../lib/catalog";
import { componentDemos, documentedExceptions, getComponentDemo } from "./content";

export { componentDemos, documentedExceptions, getComponentDemo };

export function listRegistryExportNames() {
  return catalog.groups.flatMap((group) => group.exports.map((entry) => entry.name));
}

export function assertDemoRegistryComplete() {
  const missing = listRegistryExportNames().filter((name) => !componentDemos[name] && !documentedExceptions.has(name));
  if (missing.length > 0) {
    throw new Error(`Missing portal demos for catalog exports: ${missing.join(", ")}`);
  }
}

assertDemoRegistryComplete();

export function getDemoCoverage() {
  const names = listRegistryExportNames();
  return {
    total: names.length,
    rendered: names.filter((name) => Boolean(componentDemos[name])).length,
    documentedExceptions: names.filter((name) => documentedExceptions.has(name)).length
  };
}
