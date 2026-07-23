#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { generateCatalogIndex } from "./generate-catalog-index.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(scriptDir, "..");
const repoRoot = join(portalRoot, "../..");

export function getCopyPlan(portalDir = portalRoot, root = repoRoot) {
  const out = join(portalDir, ".generated");
  const ui = join(root, "packages/ui");
  const uiDocs = join(ui, "docs");
  const tokens = join(root, "packages/ui-tokens");
  const tokenDocs = join(tokens, "docs");
  return [
    { source: join(ui, "AGENTS.md"), dest: join(out, "AGENTS.md") },
    { source: join(ui, "llms.txt"), dest: join(out, "llms.txt") },
    ...readdirSync(uiDocs)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({
        source: join(uiDocs, name),
        dest: join(out, "docs", name)
      })),
    { source: join(tokens, "AGENTS.md"), dest: join(out, "tokens", "AGENTS.md") },
    { source: join(tokens, "llms.txt"), dest: join(out, "tokens", "llms.txt") },
    ...readdirSync(tokenDocs)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({
        source: join(tokenDocs, name),
        dest: join(out, "tokens", "docs", name)
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
    mkdirSync(join(out, "tokens", "docs"), { recursive: true });
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
  const copied = plan.map(({ source, dest }) => ({
    source: relative(repo, source),
    dest: relative(portalDir, dest)
  }));
  if (!dryRun) {
    generateCatalogIndex({
      catalogPath: join(repo, "packages/ui/docs/COMPONENT-CATALOG.md"),
      outPath: join(portalDir, ".generated/catalog-index.json")
    });
  }
  return copied;
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
