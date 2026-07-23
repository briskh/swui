import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "packages/ui/src");
const tokenFile = join(root, "packages/ui-tokens/src/tokens.css");
const approvedExceptions = new Map([
  ["components/avatar.tsx", ["size-10"]],
  ["components/empty.tsx", ["size-10"]],
  ["components/wide-screen-gate.tsx", ["size-8"]],
  ["components/data-table.tsx", ["w-12"]],
  ["components/chart.tsx", ["#fff", "#ccc"]]
]);
const forbidden = /(?<![\w-])(?:h|w|size)-(?:7|8|9|10|12)(?![\w-])|#[\da-fA-F]{3,8}\b/g;
const tokenReference = /var\((--[\w-]+)\)/g;
const themeBypass = /\bdark:[\w-]/g;
const runtimeTokenPrefixes = ["--radix-"];
const requiredSemanticTokens = ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "destructive", "destructive-foreground", "passkey", "passkey-foreground", "border", "input", "ring", "status-ready", "status-loading", "status-error", "metric-instrument", "metric-asset"];
const contrastPairs = [["background", "foreground"], ["background", "muted-foreground"], ["background", "destructive"], ["background", "status-ready"], ["background", "status-error"], ["card", "card-foreground"], ["popover", "popover-foreground"], ["primary", "primary-foreground"], ["secondary", "secondary-foreground"], ["accent", "accent-foreground"], ["destructive", "destructive-foreground"], ["passkey", "passkey-foreground"]];

async function filesAt(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesAt(path) : entry.name.endsWith(".tsx") || entry.name.endsWith(".css") ? [path] : [];
  }));
  return nested.flat();
}

function resolveThemeToken(token, values, seen = new Set()) {
  if (seen.has(token)) return null;
  const value = values.get(`--${token}`)?.trim();
  if (!value) return null;
  const reference = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return reference ? resolveThemeToken(reference.slice(2), values, new Set([...seen, token])) : value;
}

function relativeLuminanceFromOklch(value) {
  const match = value.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+%?)?\)$/);
  if (!match) return null;
  const [, lightness, chroma, hue] = match.map(Number);
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return 0.2126 * Math.max(0, Math.min(1, red)) + 0.7152 * Math.max(0, Math.min(1, green)) + 0.0722 * Math.max(0, Math.min(1, blue));
}

const violations = [];
const tokenSource = await readFile(tokenFile, "utf8");
const tokenDefinitions = new Set([...tokenSource.matchAll(/(^|\n)\s*(--[\w-]+)\s*:/g)].map((match) => match[2]));
const tokenAliases = new Map([...tokenSource.matchAll(/(^|\n)\s*(--[\w-]+)\s*:\s*var\((--[\w-]+)\)/g)].map((match) => [match[2], match[3]]));
const themeBlocks = [["light", tokenSource.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? ""], ["dark", tokenSource.match(/\[data-theme="dark"\][\s\S]*?\{([\s\S]*?)\n\}/)?.[1] ?? ""]];

for (const [token, target] of tokenAliases) {
  const seen = new Set([token]);
  let current = target;
  while (tokenAliases.has(current)) {
    if (seen.has(current)) {
      violations.push(`tokens.css: circular token alias involving ${current}`);
      break;
    }
    seen.add(current);
    current = tokenAliases.get(current);
  }
  if (!tokenDefinitions.has(target)) violations.push(`tokens.css: undefined token alias ${target}`);
}

for (const [themeName, block] of themeBlocks) {
  const values = new Map([...block.matchAll(/(^|\n)\s*(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[2], match[3]]));
  const definitions = new Set([...values.keys()].map((token) => token.slice(2)));
  for (const token of requiredSemanticTokens) if (!definitions.has(token)) violations.push(`tokens.css: ${themeName} theme is missing --${token}`);
  for (const [background, foreground] of contrastPairs) {
    if (!definitions.has(background) || !definitions.has(foreground)) {
      violations.push(`tokens.css: ${themeName} theme is missing semantic contrast pair --${background}/--${foreground}`);
      continue;
    }
    const backgroundValue = resolveThemeToken(background, values);
    const foregroundValue = resolveThemeToken(foreground, values);
    const backgroundLuminance = backgroundValue && relativeLuminanceFromOklch(backgroundValue);
    const foregroundLuminance = foregroundValue && relativeLuminanceFromOklch(foregroundValue);
    if (backgroundLuminance === null || foregroundLuminance === null) {
      violations.push(`tokens.css: ${themeName} contrast pair --${background}/--${foreground} must resolve to oklch values`);
      continue;
    }
    const ratio = (Math.max(backgroundLuminance, foregroundLuminance) + 0.05) / (Math.min(backgroundLuminance, foregroundLuminance) + 0.05);
    if (ratio < 4.5) violations.push(`tokens.css: ${themeName} contrast pair --${background}/--${foreground} is ${ratio.toFixed(2)}:1, below WCAG AA 4.5:1`);
  }
}

for (const file of await filesAt(sourceRoot)) {
  const source = await readFile(file, "utf8");
  const projectPath = relative(sourceRoot, file);
  const localTokenDefinitions = new Set([...source.matchAll(/["'](--[\w-]+)["']\s*:/g)].map((match) => match[1]));
  for (const match of source.matchAll(forbidden)) {
    if (!approvedExceptions.get(projectPath)?.includes(match[0])) {
      violations.push(`${projectPath}:${match.index}: unapproved raw design value ${match[0]}`);
    }
  }
  for (const match of source.matchAll(tokenReference)) {
    const token = match[1];
    if (!tokenDefinitions.has(token) && !localTokenDefinitions.has(token) && !runtimeTokenPrefixes.some((prefix) => token.startsWith(prefix))) {
      violations.push(`${projectPath}:${match.index}: undefined token ${token}`);
    }
  }
  for (const match of source.matchAll(themeBypass)) {
    violations.push(`${projectPath}:${match.index}: bypasses the global theme selector with ${match[0]}`);
  }
}

if (violations.length) {
  console.error("Design-contract check failed:\n" + violations.join("\n"));
  process.exit(1);
}
