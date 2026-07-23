#!/usr/bin/env node
/**
 * Pre-publish security audit for @swqt/ui and @swqt/ui-tokens tarballs.
 * Reports are desensitized — matched secret material is never printed verbatim.
 */
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, relative } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();

const PACKAGES = [
  { dir: "packages/ui-tokens", name: "@swqt/ui-tokens" },
  { dir: "packages/ui", name: "@swqt/ui" }
];

const FORBIDDEN_BASENAMES = new Set([
  ".env",
  ".npmrc",
  "credentials.json",
  "id_rsa",
  "id_ed25519"
]);

const FORBIDDEN_SUFFIXES = [".pem", ".key", ".p12", ".pfx"];

const BLOCKING_RULES = [
  { id: "npm-auth-token", re: /_authToken\s*=\s*[^\s\n#]+/gi, label: "npm _authToken assignment" },
  { id: "bearer-token", re: /Bearer\s+[A-Za-z0-9\-._~+/]{12,}=* */gi, label: "Bearer token" },
  { id: "github-pat", re: /ghp_[A-Za-z0-9]{20,}/g, label: "GitHub personal access token" },
  { id: "github-fine-pat", re: /github_pat_[A-Za-z0-9_]{20,}/g, label: "GitHub fine-grained PAT" },
  { id: "aws-access-key", re: /AKIA[0-9A-Z]{16}/g, label: "AWS access key id" },
  { id: "private-key-block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, label: "Private key block" },
  {
    id: "literal-secret-assignment",
    re: /(?:api[_-]?key|client[_-]?secret|password|secret|access[_-]?token)\s*[:=]\s*['"]?[A-Za-z0-9\-._~+/]{12,}['"]?/gi,
    label: "Literal secret assignment"
  },
  {
    id: "non-placeholder-mcp-token",
    re: /SW_MCP_TOKEN\s*[:=]\s*['"]?(?!\\?\$\{)[^'"\s\n#]{8,}/gi,
    label: "Non-placeholder SW_MCP_TOKEN value"
  }
];

const WARNING_RULES = [
  {
    id: "internal-registry-url",
    re: /https:\/\/npm\.inet\.swqt\.net[^\s"'`]*/g,
    label: "Internal npm registry URL in tarball text"
  },
  {
    id: "internal-agent-url",
    re: /https:\/\/agent\.swqt\.net[^\s"'`]*/g,
    label: "Internal agent MCP URL in tarball text"
  },
  {
    id: "email-address",
    re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    label: "Email address in tarball text"
  }
];

const LIFECYCLE_SCRIPTS = ["preinstall", "install", "postinstall", "prepublish", "prepare"];

function redactSnippet(text, maxLen = 120) {
  let out = text
    .replace(/_authToken\s*=\s*[^\s\n#]+/gi, "_authToken=[REDACTED]")
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/=]+/gi, "Bearer [REDACTED]")
    .replace(/ghp_[A-Za-z0-9]+/g, "ghp_[REDACTED]")
    .replace(/github_pat_[A-Za-z0-9_]+/g, "github_pat_[REDACTED]")
    .replace(/AKIA[0-9A-Z]{16}/g, "AKIA[REDACTED]")
    .replace(
      /((?:api[_-]?key|client[_-]?secret|password|secret|access[_-]?token)\s*[:=]\s*['"]?)[^'"\s\n#]+(['"]?)/gi,
      "$1[REDACTED]$2"
    )
    .replace(/SW_MCP_TOKEN\s*[:=]\s*['"]?[^'"\s\n#]+['"]?/gi, "SW_MCP_TOKEN=[REDACTED]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[EMAIL_REDACTED]")
    .replace(/\s+/g, " ")
    .trim();
  if (out.length > maxLen) {
    out = `${out.slice(0, maxLen - 1)}…`;
  }
  return out;
}

async function findTarball(packageDir) {
  const manifest = JSON.parse(await readFile(join(root, packageDir, "package.json"), "utf8"));
  const version = manifest.version;
  const candidates =
    packageDir.endsWith("ui-tokens")
      ? [`swqt-ui-tokens-${version}.tgz`]
      : [`swqt-ui-${version}.tgz`];
  for (const file of candidates) {
    const path = join(root, packageDir, file);
    try {
      await stat(path);
      return path;
    } catch {
      // try next
    }
  }
  throw new Error(`Tarball not found under ${packageDir}. Run bun run pack first.`);
}

async function extractTarball(tarballPath, dest) {
  await execFileAsync("tar", ["-xzf", tarballPath, "-C", dest]);
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function isForbiddenPath(relPath) {
  const base = basename(relPath);
  if (FORBIDDEN_BASENAMES.has(base)) return true;
  return FORBIDDEN_SUFFIXES.some((suffix) => base.endsWith(suffix));
}

function scanText(content, relPath, rules, severity) {
  const findings = [];
  const lines = content.split("\n");
  for (const rule of rules) {
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim()) continue;
      rule.re.lastIndex = 0;
      if (rule.re.test(line)) {
        findings.push({
          severity,
          ruleId: rule.id,
          label: rule.label,
          file: relPath,
          line: i + 1,
          snippet: redactSnippet(line)
        });
      }
    }
  }
  return findings;
}

async function auditPackage({ dir, name }) {
  const tarball = await findTarball(dir);
  const tempRoot = await mkdtemp(join(tmpdir(), "swqt-npm-audit-"));
  const extractRoot = join(tempRoot, "extract");
  const packageFindings = {
    name,
    tarball: relative(root, tarball),
    fileCount: 0,
    blocking: [],
    warnings: []
  };

  try {
    await mkdir(extractRoot, { recursive: true });
    await extractTarball(tarball, extractRoot);
    const files = await walkFiles(extractRoot);
    packageFindings.fileCount = files.length;

    for (const file of files) {
      const rel = relative(extractRoot, file).replace(/^package\//, "");
      if (isForbiddenPath(rel)) {
        packageFindings.blocking.push({
          severity: "blocking",
          ruleId: "forbidden-filename",
          label: "Forbidden filename in tarball",
          file: rel,
          line: 0,
          snippet: basename(rel)
        });
        continue;
      }

      const isText =
        rel.endsWith(".json") ||
        rel.endsWith(".md") ||
        rel.endsWith(".txt") ||
        rel.endsWith(".ts") ||
        rel.endsWith(".tsx") ||
        rel.endsWith(".css") ||
        rel.endsWith(".js") ||
        rel.endsWith(".mjs");
      if (!isText) continue;

      const content = await readFile(file, "utf8");
      packageFindings.blocking.push(...scanText(content, rel, BLOCKING_RULES, "blocking"));
      packageFindings.warnings.push(...scanText(content, rel, WARNING_RULES, "warning"));
    }

    const pkgCandidates = [
      join(extractRoot, "package", "package.json"),
      join(extractRoot, "package.json")
    ];
    let pkgRaw = null;
    for (const candidate of pkgCandidates) {
      try {
        pkgRaw = await readFile(candidate, "utf8");
        break;
      } catch {
        // try next
      }
    }
    if (!pkgRaw) {
      packageFindings.blocking.push({
        severity: "blocking",
        ruleId: "missing-package-json",
        label: "package.json missing or invalid in tarball",
        file: "package.json",
        line: 0,
        snippet: "(missing)"
      });
    } else {
      const pkg = JSON.parse(pkgRaw);
      for (const scriptName of LIFECYCLE_SCRIPTS) {
        if (pkg.scripts?.[scriptName]) {
          packageFindings.blocking.push({
            severity: "blocking",
            ruleId: "lifecycle-script",
            label: `Lifecycle script "${scriptName}" in published package.json`,
            file: "package.json",
            line: 0,
            snippet: redactSnippet(`${scriptName}: ${pkg.scripts[scriptName]}`)
          });
        }
      }
      if (pkg.publishConfig?.provenance === true) {
        packageFindings.warnings.push({
          severity: "warning",
          ruleId: "publish-config-provenance",
          label: "publishConfig.provenance in tarball (local publish may fail; CI-only)",
          file: "package.json",
          line: 0,
          snippet: "provenance: true"
        });
      }
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }

  return packageFindings;
}

function printReport(results) {
  console.log("# npm publish security audit (desensitized)\n");
  let blockingTotal = 0;
  let warningTotal = 0;

  for (const pkg of results) {
    console.log(`## ${pkg.name}`);
    console.log(`- tarball: \`${pkg.tarball}\``);
    console.log(`- files scanned: ${pkg.fileCount}`);
    console.log(`- blocking: ${pkg.blocking.length}`);
    console.log(`- warnings: ${pkg.warnings.length}\n`);

    if (pkg.blocking.length) {
      console.log("### Blocking");
      for (const item of pkg.blocking) {
        const loc = item.line > 0 ? `${item.file}:${item.line}` : item.file;
        console.log(`- [${item.ruleId}] ${item.label} @ ${loc}`);
        console.log(`  snippet: ${item.snippet}`);
      }
      console.log("");
      blockingTotal += pkg.blocking.length;
    }

    if (pkg.warnings.length) {
      console.log("### Warnings (review; secrets redacted)");
      for (const item of pkg.warnings) {
        const loc = item.line > 0 ? `${item.file}:${item.line}` : item.file;
        console.log(`- [${item.ruleId}] ${item.label} @ ${loc}`);
        console.log(`  snippet: ${item.snippet}`);
      }
      console.log("");
      warningTotal += pkg.warnings.length;
    }

    if (!pkg.blocking.length && !pkg.warnings.length) {
      console.log("_No issues found._\n");
    }
  }

  console.log("---");
  console.log(`Summary: ${blockingTotal} blocking, ${warningTotal} warnings`);
  console.log("Report is desensitized; re-run locally to inspect raw files if needed.");
}

async function main() {
  const results = [];
  for (const pkg of PACKAGES) {
    results.push(await auditPackage(pkg));
  }
  printReport(results);
  const blockingTotal = results.reduce((sum, pkg) => sum + pkg.blocking.length, 0);
  if (blockingTotal > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
