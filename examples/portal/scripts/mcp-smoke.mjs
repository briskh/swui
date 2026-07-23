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
for (const name of ["swui.package.get", "swui.package.installHint"]) {
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

console.log("mcp-smoke passed");
