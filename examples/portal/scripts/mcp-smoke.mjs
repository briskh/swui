#!/usr/bin/env bun
import { syncDocs } from "./sync-docs.mjs";
import { createSwuiMcpServer } from "../server/handlers.ts";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

syncDocs();
process.env.REGISTRY_FIXTURE = "1";

const server = createSwuiMcpServer();
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await server.connect(serverTransport);

const client = await import("@modelcontextprotocol/sdk/client/index.js").then(({ Client }) => {
  const instance = new Client({ name: "smoke", version: "0.0.0" });
  return instance;
});
await client.connect(clientTransport);
if (
  client.getServerVersion()?.name !== "swui" ||
  client.getServerVersion()?.version !== "1.2.0" ||
  !client.getInstructions()?.includes("swui://packages/ui/llms.txt")
) {
  throw new Error("initialize response is missing the swui identity or first-hop instructions");
}

const resources = await client.listResources();
const resourceUris = resources.resources.map((resource) => resource.uri);
for (const uri of [
  "swui://packages/ui/AGENTS.md",
  "swui://packages/ui/llms.txt",
  "swui://packages/ui/docs/ADOPTION.md",
  "swui://packages/ui/docs/DESIGN-SUMMARY.md",
  "swui://packages/ui/docs/COMPONENT-CATALOG.md",
  "swui://packages/ui/docs/DO-AND-DONT.md",
  "swui://packages/ui/docs/HTML-STANDARDS.md",
  "swui://packages/ui-tokens/AGENTS.md",
  "swui://packages/ui-tokens/llms.txt",
  "swui://packages/ui-tokens/docs/ADOPTION.md",
  "swui://packages/ui-tokens/docs/TOKENS.md"
]) {
  if (!resourceUris.includes(uri)) {
    throw new Error(`missing resource ${uri}`);
  }
  const resource = await client.readResource({ uri });
  if (!resource.contents?.[0]?.text) {
    throw new Error(`empty or unreadable resource ${uri}`);
  }
}
if (resources.resources.length > 12 || Buffer.byteLength(JSON.stringify(resources), "utf8") > 12 * 1024) {
  throw new Error("static resource disclosure exceeds its count or byte budget");
}

const templates = await client.listResourceTemplates();
if (
  templates.resourceTemplates.length !== 1 ||
  templates.resourceTemplates[0].uriTemplate !== "swui://components/{name}"
) {
  throw new Error("component resource template contract is missing");
}

const tools = await client.listTools();
const toolNames = tools.tools.map((tool) => tool.name);
for (const name of ["swui.package.get", "swui.package.installHint", "swui.catalog.search", "swui.component.get"]) {
  if (!toolNames.includes(name)) {
    throw new Error(`missing tool ${name}`);
  }
}
for (const tool of tools.tools) {
  if (!tool.title || !tool.inputSchema || !tool.outputSchema || tool.annotations?.readOnlyHint !== true) {
    throw new Error(`tool ${tool.name} is missing contract metadata`);
  }
}

const packageResult = await client.callTool({
  name: "swui.package.get",
  arguments: { name: "@swqt/ui", version: "1.0.0" }
});
const packageText = packageResult.content?.[0]?.type === "text" ? packageResult.content[0].text : "";
if (
  !packageText.includes('"resolvedVersion": "1.0.0"') ||
  !packageText.includes('"sourceVersion": "1.2.0"') ||
  !packageText.includes('"releaseStatus": "source-ahead"') ||
  !packageResult.structuredContent
) {
  throw new Error("package.get did not resolve the expected exact version");
}

const hintResult = await client.callTool({ name: "swui.package.installHint", arguments: {} });
const hintText = hintResult.content?.[0]?.type === "text" ? hintResult.content[0].text : "";
if (!hintText.includes("npm install @swqt/ui")) {
  throw new Error("installHint missing npm install command");
}

const searchResult = await client.callTool({ name: "swui.catalog.search", arguments: { query: "Button" } });
const searchText = searchResult.content?.[0]?.type === "text" ? searchResult.content[0].text : "";
if (
  !searchText.includes('"name": "Button"') ||
  !searchText.includes('"contractRefs"') ||
  !searchText.includes("https://ui.swqt.net/components/actions/button") ||
  !searchResult.structuredContent ||
  Buffer.byteLength(JSON.stringify(searchResult), "utf8") > 16 * 1024
) {
  throw new Error("catalog.search did not return Button");
}

const componentResult = await client.callTool({ name: "swui.component.get", arguments: { name: "Button" } });
const componentText = componentResult.content?.[0]?.type === "text" ? componentResult.content[0].text : "";
if (
  !componentText.includes("https://ui.swqt.net/components/actions/button") ||
  !componentText.includes("swui://packages/ui/docs/HTML-STANDARDS.md")
) {
  throw new Error("component.get missing absolute demo URL or contract references");
}

const buttonResource = await client.readResource({ uri: "swui://components/Button" });
const buttonText = buttonResource.contents?.[0]?.text ?? "";
if (
  !buttonText.includes('"name": "Button"') ||
  !buttonText.includes('"contractRefs"') ||
  !buttonText.includes("https://ui.swqt.net/icons")
) {
  throw new Error("component resource missing Button payload");
}

console.log("mcp-smoke passed");
