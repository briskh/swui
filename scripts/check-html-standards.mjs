import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HtmlValidate } from "html-validate";
import { htmlConformanceConfig } from "./html-validate-config.mjs";

const root = resolve(import.meta.dirname, "..");
const component = (name) => resolve(root, "packages/ui/src/components", name);

const checks = [
  {
    file: component("progress.tsx"),
    require: [/<progress\b/, /HTMLProgressElement/],
    forbid: [/ProgressPrimitive/, /role=["']progressbar["']/],
    reason: "Progress must use the native progress element."
  },
  {
    file: component("pagination.tsx"),
    require: [/<nav\b[^>]*aria-label=/s, /MoreHorizontal[^>]*aria-hidden=["']true["']/s],
    forbid: [/<nav\b[^>]*role=["']navigation["']/s, /<span\b[^>]*aria-hidden=["']true["'][^>]*>[\s\S]*More pages/],
    reason: "Pagination relies on nav's implicit role and keeps ellipsis text exposed."
  },
  {
    file: component("breadcrumb.tsx"),
    require: [/aria-current=["']page["']/],
    forbid: [/<span\b[^>]*role=["']link["']/s, /<span\b[^>]*aria-disabled=["']true["']/s],
    reason: "The current breadcrumb is text, not a disabled simulated link."
  },
  {
    file: component("typed-input.tsx"),
    require: [/type=["']search["']/],
    forbid: [/type=["']search["'][\s\S]{0,160}role=["']searchbox["']/],
    reason: "Search inputs already expose the searchbox role."
  },
  {
    file: component("table.tsx"),
    require: [/scope\s*=\s*["']col["']/],
    forbid: [],
    reason: "Column headers need a default scope."
  },
  {
    file: component("date-picker.tsx"),
    require: [/<fieldset\b/, /<legend\b/, /type=["']radio["']/],
    forbid: [/role=["']group["']/],
    reason: "Date presets must use a native radio group."
  },
  {
    file: component("popover-select.tsx"),
    require: [/<select\b/, /<option\b/],
    forbid: [/role=["']listbox["']/, /role=["']option["']/, /role=["']combobox["']/],
    reason: "Simple enum selection must use native select and option elements."
  },
  {
    file: component("server-data-table.tsx"),
    require: [/<TableHeader\b[\s\S]*<TableBody\b/],
    forbid: [/<\/table>[\s\S]{0,800}<table\b/],
    reason: "ServerDataTable headers and rows must share one native table."
  }
];

const failures = [];
const htmlValidator = new HtmlValidate(htmlConformanceConfig);

for (const check of checks) {
  const source = await readFile(check.file, "utf8");
  for (const pattern of check.require) {
    if (!pattern.test(source)) {
      failures.push(`${check.file}: missing ${pattern}. ${check.reason}`);
    }
  }
  for (const pattern of check.forbid) {
    if (pattern.test(source)) {
      failures.push(`${check.file}: forbidden ${pattern}. ${check.reason}`);
    }
  }
}

const authoringFiles = [
  resolve(root, "examples/portal/index.html"),
  resolve(root, "examples/ui-consumer/index.html")
];
const obsoleteAttribute = /\s(?:align|bgcolor|border|cellpadding|cellspacing|frameborder|marginheight|marginwidth)\s*=/i;

for (const file of authoringFiles) {
  const source = await readFile(file, "utf8");
  if (!/^<!doctype html>/i.test(source.trimStart())) {
    failures.push(`${file}: missing HTML doctype.`);
  }
  if (obsoleteAttribute.test(source)) {
    failures.push(`${file}: obsolete presentational HTML attribute found.`);
  }
  const report = await htmlValidator.validateString(source, file);
  for (const result of report.results) {
    for (const message of result.messages) {
      failures.push(`${file}:${message.line}:${message.column} ${message.ruleId}: ${message.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`HTML standards gate failed (${failures.length}):`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`HTML standards gate passed (${checks.length} component contracts, ${authoringFiles.length} documents).`);
