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

const resources = await client.listResources();
const resourceUris = resources.resources.map((resource) => resource.uri);
for (const uri of ["swui://docs/AGENTS.md", "swui://docs/ADOPTION.md", "swui://docs/COMPONENT-CATALOG.md"]) {
  if (!resourceUris.includes(uri)) {
    throw new Error(`missing resource ${uri}`);
  }
}

const tools = await client.listTools();
const toolNames = tools.tools.map((tool) => tool.name);
for (const name of ["swui.package.get", "swui.package.installHint", "swui.catalog.search", "swui.component.get"]) {
  if (!toolNames.includes(name)) {
    throw new Error(`missing tool ${name}`);
  }
}

const packageResult = await client.callTool({ name: "swui.package.get", arguments: { name: "@swui/ui" } });
const packageText = packageResult.content?.[0]?.type === "text" ? packageResult.content[0].text : "";
if (!packageText.includes('"latest": "1.0.0"')) {
  throw new Error("package.get did not return expected latest version");
}

const hintResult = await client.callTool({ name: "swui.package.installHint", arguments: {} });
const hintText = hintResult.content?.[0]?.type === "text" ? hintResult.content[0].text : "";
if (!hintText.includes("npm install @swui/ui")) {
  throw new Error("installHint missing npm install command");
}

const searchResult = await client.callTool({ name: "swui.catalog.search", arguments: { query: "Button" } });
const searchText = searchResult.content?.[0]?.type === "text" ? searchResult.content[0].text : "";
if (!searchText.includes('"name": "Button"')) {
  throw new Error("catalog.search did not return Button");
}

const componentResult = await client.callTool({ name: "swui.component.get", arguments: { name: "Button" } });
const componentText = componentResult.content?.[0]?.type === "text" ? componentResult.content[0].text : "";
if (!componentText.includes("/components/actions/button")) {
  throw new Error("component.get missing demo path");
}

const buttonResource = await client.readResource({ uri: "swui://components/Button" });
const buttonText = buttonResource.contents?.[0]?.text ?? "";
if (!buttonText.includes('"name": "Button"')) {
  throw new Error("component resource missing Button payload");
}

console.log("mcp-smoke passed");
