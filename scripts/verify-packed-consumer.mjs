import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const tempRoot = await mkdtemp(join(tmpdir(), "swui-packed-consumer-"));

function run(command, args, cwd = root) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited with ${code}`)));
  });
}

async function prepareConsumer(consumer, uiSourcePaths) {
  await mkdir(consumer, { recursive: true });
  await cp(join(root, "examples/ui-consumer"), consumer, { recursive: true, filter: (source) => !source.includes("node_modules") && !source.includes("dist") && !source.includes(".browser-artifacts") });
  const manifestPath = join(consumer, "package.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const uiVersion = JSON.parse(await readFile(join(root, "packages/ui/package.json"), "utf8")).version;
  const tokenVersion = JSON.parse(await readFile(join(root, "packages/ui-tokens/package.json"), "utf8")).version;
  manifest.dependencies["@swui/ui"] = `file:${join(root, `packages/ui/swui-ui-${uiVersion}.tgz`)}`;
  manifest.dependencies["@swui/ui-tokens"] = `file:${join(root, `packages/ui-tokens/swui-ui-tokens-${tokenVersion}.tgz`)}`;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const stylesPath = join(consumer, "src/styles.css");
  await writeFile(stylesPath, (await readFile(stylesPath, "utf8")).replace("../../../packages/ui/src", uiSourcePaths.styles));
  const vitePath = join(consumer, "vite.config.ts");
  await writeFile(vitePath, (await readFile(vitePath, "utf8")).replace("../../packages/ui/src", uiSourcePaths.vite));
  const tsconfigPath = join(consumer, "tsconfig.json");
  await writeFile(tsconfigPath, (await readFile(tsconfigPath, "utf8")).replaceAll("../../packages/ui/src", uiSourcePaths.tsconfig));
}

async function verifyConsumer(name, consumer, installRoot, linker) {
  await run("bun", ["install", "--linker", linker], installRoot);
  await run("bun", ["run", "typecheck"], consumer);
  await run("bun", ["run", "build"], consumer);
  const assetDirectory = join(consumer, "dist/assets");
  const files = await readdir(assetDirectory);
  const css = await Promise.all(files.filter((file) => file.endsWith(".css")).map((file) => readFile(join(assetDirectory, file), "utf8")));
  const output = css.join("\n");
  if (!output.includes("h-control-md")) throw new Error(`${name}: consumer build did not emit UI component utilities; check @source.`);
  if (!output.includes("data-theme=dark")) throw new Error(`${name}: consumer build did not emit the dark-theme token selector.`);
  await run("bunx", ["playwright", "test", "--config", "playwright.config.mjs"], consumer);
  console.log(`${name}: packed consumer build and browser runtime verification passed.`);
}

try {
  await run("bun", ["run", "pack"]);

  const nestedConsumer = join(tempRoot, "nested", "app");
  await prepareConsumer(nestedConsumer, {
    styles: "../node_modules/@swui/ui/src",
    vite: "node_modules/@swui/ui/src",
    tsconfig: "./node_modules/@swui/ui/src"
  });
  await verifyConsumer("nested layout", nestedConsumer, nestedConsumer, "isolated");

  const hoistedRoot = join(tempRoot, "hoisted");
  const hoistedConsumer = join(hoistedRoot, "apps", "app");
  await mkdir(hoistedRoot, { recursive: true });
  await writeFile(join(hoistedRoot, "package.json"), `${JSON.stringify({ private: true, workspaces: ["apps/*"] }, null, 2)}\n`);
  await prepareConsumer(hoistedConsumer, {
    styles: "../../../node_modules/@swui/ui/src",
    vite: "../../node_modules/@swui/ui/src",
    tsconfig: "../../node_modules/@swui/ui/src"
  });
  await verifyConsumer("workspace-hoisted layout", hoistedConsumer, hoistedRoot, "hoisted");
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
