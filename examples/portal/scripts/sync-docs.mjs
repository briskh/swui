#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(scriptDir, "..");
const repoRoot = join(portalRoot, "../..");

export function getCopyPlan(portalDir = portalRoot, root = repoRoot) {
  const out = join(portalDir, ".generated");
  const ui = join(root, "packages/ui");
  const docs = join(ui, "docs");
  return [
    { source: join(ui, "AGENTS.md"), dest: join(out, "AGENTS.md") },
    { source: join(ui, "llms.txt"), dest: join(out, "llms.txt") },
    ...readdirSync(docs)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({
        source: join(docs, name),
        dest: join(out, "docs", name)
      }))
  ];
}

export function syncDocs({ portalDir = portalRoot, repo = repoRoot, dryRun = false } = {}) {
  const out = join(portalDir, ".generated");
  if (!dryRun && existsSync(out)) {
    rmSync(out, { recursive: true, force: true });
  }
  if (!dryRun) {
    mkdirSync(join(out, "docs"), { recursive: true });
  }
  const plan = getCopyPlan(portalDir, repo);
  for (const { source, dest } of plan) {
    if (!existsSync(source)) {
      throw new Error(`Missing SSOT source: ${source}`);
    }
    if (!dryRun) {
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(source, dest);
    }
  }
  return plan.map(({ source, dest }) => ({
    source: relative(repo, source),
    dest: relative(portalDir, dest)
  }));
}

export function checkDocsSync({ portalDir = portalRoot, repo = repoRoot } = {}) {
  const plan = getCopyPlan(portalDir, repo);
  const drift = [];
  for (const { source, dest } of plan) {
    if (!existsSync(dest)) {
      drift.push({ dest, reason: "missing generated file" });
      continue;
    }
    const sourceText = readFileSync(source, "utf8");
    const destText = readFileSync(dest, "utf8");
    if (sourceText !== destText) {
      drift.push({ dest, reason: "content differs from SSOT" });
    }
  }
  return drift;
}

function main() {
  const checkMode = process.argv.includes("--check");
  if (checkMode) {
    const drift = checkDocsSync();
    if (drift.length > 0) {
      console.error("sync-docs --check failed:");
      for (const item of drift) {
        console.error(`  ${item.dest}: ${item.reason}`);
      }
      process.exit(1);
    }
    console.log("sync-docs --check passed");
    return;
  }
  const copied = syncDocs();
  console.log(`sync-docs: copied ${copied.length} files to .generated/`);
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
