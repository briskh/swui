import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const tempRoot = await mkdtemp(join(tmpdir(), "swui-packed-consumer-"));
const packRoot = join(tempRoot, "packs");
const bunBinary = process.env.SWUI_BUN_BINARY ?? "bun";

const publishedPackages = [
  { name: "@swqt/ui", source: join(root, "packages/ui"), tarballPrefix: "swqt-ui" },
  { name: "@swqt/ui-tokens", source: join(root, "packages/ui-tokens"), tarballPrefix: "swqt-ui-tokens" }
];

function run(command, args, cwd = root) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited with ${code}`)));
  });
}

async function packageTarball(packageEntry) {
  const manifest = JSON.parse(await readFile(join(packageEntry.source, "package.json"), "utf8"));
  return join(packRoot, `${packageEntry.tarballPrefix}-${manifest.version}.tgz`);
}

async function prepareConsumer(consumer, uiSourcePaths) {
  await mkdir(consumer, { recursive: true });
  await cp(join(root, "examples/ui-consumer"), consumer, { recursive: true, filter: (source) => !source.includes("node_modules") && !source.includes("dist") && !source.includes(".browser-artifacts") });
  const manifestPath = join(consumer, "package.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  manifest.dependencies["@swqt/ui"] = `file:${await packageTarball(publishedPackages[0])}`;
  manifest.dependencies["@swqt/ui-tokens"] = `file:${await packageTarball(publishedPackages[1])}`;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const stylesPath = join(consumer, "src/styles.css");
  await writeFile(stylesPath, (await readFile(stylesPath, "utf8")).replace("../../../packages/ui/src", uiSourcePaths.styles));
  const vitePath = join(consumer, "vite.config.ts");
  await writeFile(vitePath, (await readFile(vitePath, "utf8")).replace("../../packages/ui/src", uiSourcePaths.vite));
  const tsconfigPath = join(consumer, "tsconfig.json");
  await writeFile(tsconfigPath, (await readFile(tsconfigPath, "utf8")).replaceAll("../../packages/ui/src", uiSourcePaths.tsconfig));
}

async function publishedDocPaths(sourceRoot) {
  const docs = (await readdir(join(sourceRoot, "docs")))
    .filter((file) => file.endsWith(".md"))
    .map((file) => join("docs", file));
  return ["AGENTS.md", "llms.txt", ...docs];
}

async function verifyPublishedDocs(nodeModulesRoot) {
  for (const packageEntry of publishedPackages) {
    const installedRoot = join(nodeModulesRoot, ...packageEntry.name.split("/"));
    const sourceManifest = JSON.parse(await readFile(join(packageEntry.source, "package.json"), "utf8"));
    const installedManifest = JSON.parse(await readFile(join(installedRoot, "package.json"), "utf8"));
    if (installedManifest.name !== sourceManifest.name || installedManifest.version !== sourceManifest.version) {
      throw new Error(
        `${packageEntry.name}: installed tarball identity ${installedManifest.name}@${installedManifest.version} does not match source ${sourceManifest.name}@${sourceManifest.version}`
      );
    }
    for (const relativePath of await publishedDocPaths(packageEntry.source)) {
      const source = await readFile(join(packageEntry.source, relativePath));
      const installed = await readFile(join(installedRoot, relativePath));
      if (!source.equals(installed)) {
        throw new Error(`${packageEntry.name}: packed ${relativePath} is stale relative to package SSOT`);
      }
    }
  }
}

async function verifyConsumer(name, consumer, installRoot, linker) {
  await run(bunBinary, ["install", "--linker", linker], installRoot);
  await verifyPublishedDocs(join(installRoot, "node_modules"));
  await run(bunBinary, ["run", "typecheck"], consumer);
  await run(bunBinary, ["run", "build"], consumer);
  const assetDirectory = join(consumer, "dist/assets");
  const files = await readdir(assetDirectory);
  const css = await Promise.all(files.filter((file) => file.endsWith(".css")).map((file) => readFile(join(assetDirectory, file), "utf8")));
  const output = css.join("\n");
  if (!output.includes("h-control-md")) throw new Error(`${name}: consumer build did not emit UI component utilities; check @source.`);
  if (!output.includes("data-theme=dark")) throw new Error(`${name}: consumer build did not emit the dark-theme token selector.`);
  await run(bunBinary, ["x", "playwright", "test", "--config", "playwright.config.mjs"], consumer);
  console.log(`${name}: packed docs, consumer build, and browser runtime verification passed.`);
}

try {
  await mkdir(packRoot, { recursive: true });
  for (const packageEntry of publishedPackages.slice().reverse()) {
    await run(
      bunBinary,
      ["pm", "pack", "--destination", packRoot, "--quiet"],
      packageEntry.source
    );
  }

  const nestedConsumer = join(tempRoot, "nested", "app");
  await prepareConsumer(nestedConsumer, {
    styles: "../node_modules/@swqt/ui/src",
    vite: "node_modules/@swqt/ui/src",
    tsconfig: "./node_modules/@swqt/ui/src"
  });
  await verifyConsumer("nested layout", nestedConsumer, nestedConsumer, "isolated");

  const hoistedRoot = join(tempRoot, "hoisted");
  const hoistedConsumer = join(hoistedRoot, "apps", "app");
  await mkdir(hoistedRoot, { recursive: true });
  await writeFile(join(hoistedRoot, "package.json"), `${JSON.stringify({ private: true, workspaces: ["apps/*"] }, null, 2)}\n`);
  await prepareConsumer(hoistedConsumer, {
    styles: "../../../node_modules/@swqt/ui/src",
    vite: "../../node_modules/@swqt/ui/src",
    tsconfig: "../../node_modules/@swqt/ui/src"
  });
  await verifyConsumer("workspace-hoisted layout", hoistedConsumer, hoistedRoot, "hoisted");
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
