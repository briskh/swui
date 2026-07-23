import { afterEach, afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
  MAX_SEARCH_RESPONSE_BYTES,
  RESOURCE_MAP,
  catalogSearchPayload,
  componentGetPayload,
  createSwuiMcpServer,
  installHintPayload,
  packageGetPayload
} from "../server/handlers.ts";
import { __resetRegistryCacheForTests } from "../server/registry-client.ts";
import { syncDocs } from "../scripts/sync-docs.mjs";
import { isSwuiMcpHttpPath } from "../shared/mcp-path.ts";

const originalFixture = process.env.REGISTRY_FIXTURE;
let client;
let server;

describe("mcp tool payloads", () => {
  beforeAll(async () => {
    syncDocs();
    process.env.REGISTRY_FIXTURE = "1";
    server = createSwuiMcpServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    client = new Client({ name: "contract-test", version: "0.0.0" });
    await client.connect(clientTransport);
  });

  test("package.get resolves latest and exact versions", async () => {
    const payload = await packageGetPayload("@swqt/ui", "0.9.0");
    expect(payload.package?.latest).toBe("1.0.0");
    expect(payload.requestedVersion).toBe("0.9.0");
    expect(payload.resolvedVersion).toBe("0.9.0");
    expect(payload.package?.isLatest).toBe(false);
    expect(payload.meta.stale).toBe(false);
    expect(payload.meta.source).toBe("fixture");
    expect(payload.sourceVersion).toBe("1.1.0");
    expect(payload.sourcePublished).toBe(false);
    expect(payload.releaseStatus).toBe("source-ahead");

    const missing = await packageGetPayload("@swqt/ui", "9.9.9");
    expect(missing.found).toBe(false);
    expect(missing.resolvedVersion).toBeNull();
    expect(missing.error?.code).toBe("VERSION_NOT_FOUND");
  });

  test("installHint returns commands and tracked packages", async () => {
    const payload = await installHintPayload();
    expect(payload.commands.npm).toContain("npm install");
    expect(payload.packages).toHaveLength(2);
    expect(payload.npmrc).toContain("npmjs.org");
  });

  test("catalog.search is bounded and rejects empty queries", () => {
    const payload = catalogSearchPayload("Button");
    expect(payload.count).toBeGreaterThan(0);
    expect(payload.results.some((entry) => entry.name === "Button")).toBe(true);
    expect(payload.contractRefs).toContain("swui://foundation/contract");
    expect(payload.contractRefs).toContain("swui://packages/ui/docs/HTML-STANDARDS.md");
    expect(payload.referenceSite.icons).toBe("https://ui.swqt.net/icons");
    expect(payload.results.find((entry) => entry.name === "Button").demoUrl).toBe(
      "https://ui.swqt.net/components/actions/button"
    );

    const broad = catalogSearchPayload("e");
    expect(broad.limit).toBe(DEFAULT_SEARCH_LIMIT);
    expect(broad.count).toBeLessThanOrEqual(DEFAULT_SEARCH_LIMIT);
    expect(
      Buffer.byteLength(
        JSON.stringify({
          content: [{ type: "text", text: JSON.stringify(broad, null, 2) }],
          structuredContent: broad
        }),
        "utf8"
      )
    ).toBeLessThanOrEqual(MAX_SEARCH_RESPONSE_BYTES);

    const clamped = catalogSearchPayload("e", 1_000);
    expect(clamped.limit).toBe(MAX_SEARCH_LIMIT);
    expect(clamped.count).toBeLessThanOrEqual(MAX_SEARCH_LIMIT);
    expect(clamped.truncated).toBe(true);
    expect(
      Buffer.byteLength(
        JSON.stringify({
          content: [{ type: "text", text: JSON.stringify(clamped, null, 2) }],
          structuredContent: clamped
        }),
        "utf8"
      )
    ).toBeLessThanOrEqual(MAX_SEARCH_RESPONSE_BYTES);

    const empty = catalogSearchPayload("   ");
    expect(empty.ok).toBe(false);
    expect(empty.error?.code).toBe("INVALID_QUERY");
  });

  test("component.get returns exact import guidance, including aliases and virtual exports", () => {
    const payload = componentGetPayload("Button");
    expect(payload.found).toBe(true);
    expect(payload.component.demoPath).toBe("/components/actions/button");
    expect(payload.component.demoUrl).toBe("https://ui.swqt.net/components/actions/button");
    expect(payload.component.resourceUri).toBe("swui://components/Button");
    expect(payload.component.importHint.statement).toBe('import { Button } from "@swqt/ui";');
    expect(payload.contractRefs).toEqual([
      "swui://foundation/contract",
      "swui://packages/ui/docs/HTML-STANDARDS.md",
      "swui://packages/ui/AGENTS.md"
    ]);
    expect(payload.referenceSite.component).toBe("https://ui.swqt.net/components/actions/button");

    expect(componentGetPayload("FormField").component.importHint.exportName).toBe("SimpleFormField");
    expect(componentGetPayload("DateHelpers").component.importHint.module).toBe("@swqt/ui/date");
    expect(componentGetPayload("cn").component.importHint.module).toBe("@swqt/ui/utils");
    expect(componentGetPayload("Theme").component.importHint.statement).toBe(
      'import type { Theme } from "@swqt/ui";'
    );

    const missing = componentGetPayload("MissingComponent");
    expect(missing.found).toBe(false);
    expect(missing.component).toBeNull();
    expect(missing.error.code).toBe("COMPONENT_NOT_FOUND");
  });

  test("exposes a small static first hop and one component resource template", async () => {
    expect(client.getServerVersion()?.name).toBe("swui");
    expect(client.getServerVersion()?.version).toBe("1.1.0");
    expect(client.getInstructions()).toContain("swui://packages/ui/llms.txt");
    expect(client.getInstructions()).toContain("swui://packages/ui/docs/HTML-STANDARDS.md");
    expect(client.getInstructions()).toContain("https://ui.swqt.net/icons");
    expect(client.getInstructions()).toContain("contractRefs");
    expect(client.getInstructions()).toContain("swui.catalog.search");
    expect(client.getInstructions()).toContain('separate "sw" MCP server');

    const resources = await client.listResources();
    expect(resources.resources).toHaveLength(RESOURCE_MAP.length);
    expect(resources.resources.length).toBeLessThanOrEqual(12);
    expect(Buffer.byteLength(JSON.stringify(resources), "utf8")).toBeLessThanOrEqual(12 * 1024);
    expect(resources.resources.map((resource) => resource.uri)).toContain(
      "swui://packages/ui-tokens/docs/TOKENS.md"
    );
    expect(resources.resources.map((resource) => resource.uri)).toContain(
      "swui://packages/ui/docs/HTML-STANDARDS.md"
    );
    expect(resources.resources.some((resource) => resource.uri.startsWith("swui://components/"))).toBe(false);
    for (const resource of resources.resources) {
      const read = await client.readResource({ uri: resource.uri });
      expect(read.contents[0].text.length).toBeGreaterThan(0);
    }

    const templates = await client.listResourceTemplates();
    expect(templates.resourceTemplates).toHaveLength(1);
    expect(templates.resourceTemplates[0].uriTemplate).toBe("swui://components/{name}");

    const button = await client.readResource({ uri: "swui://components/Button" });
    const buttonPayload = JSON.parse(button.contents[0].text);
    expect(buttonPayload.importHint.statement).toBe(
      'import { Button } from "@swqt/ui";'
    );
    expect(buttonPayload.demoUrl).toBe("https://ui.swqt.net/components/actions/button");
    expect(buttonPayload.contractRefs).toContain("swui://foundation/contract");
  });

  test("all tools disclose arguments, output schemas, titles, and read-only annotations", async () => {
    const tools = await client.listTools();
    expect(tools.tools).toHaveLength(4);
    for (const tool of tools.tools) {
      expect(tool.title).toBeTruthy();
      expect(tool.inputSchema?.type).toBe("object");
      expect(tool.outputSchema?.type).toBe("object");
      expect(tool.annotations?.title).toBeTruthy();
      expect(tool.annotations?.readOnlyHint).toBe(true);
      expect(tool.annotations?.destructiveHint).toBe(false);
      expect(tool.annotations?.idempotentHint).toBe(true);
    }
  });

  test("all tool calls return matching structuredContent and JSON text", async () => {
    const calls = [
      { name: "swui.catalog.search", arguments: { query: "Button", limit: 2 } },
      { name: "swui.component.get", arguments: { name: "Button" } },
      { name: "swui.package.get", arguments: { name: "@swqt/ui", version: "1.0.0" } },
      { name: "swui.package.installHint", arguments: {} }
    ];
    for (const request of calls) {
      const result = await client.callTool(request);
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toBeTruthy();
      expect(JSON.parse(result.content[0].text)).toEqual(result.structuredContent);
    }

    const invalid = await client.callTool({
      name: "swui.catalog.search",
      arguments: { query: "" }
    });
    expect(invalid.isError).toBe(true);

    const missingVersion = await client.callTool({
      name: "swui.package.get",
      arguments: { name: "@swqt/ui", version: "9.9.9" }
    });
    expect(missingVersion.isError).toBe(true);
    expect(missingVersion.structuredContent.error.code).toBe("VERSION_NOT_FOUND");
    expect(JSON.parse(missingVersion.content[0].text)).toEqual(missingVersion.structuredContent);
  });

  test("only the canonical /mcp/swui path reaches the MCP handler", () => {
    expect(isSwuiMcpHttpPath("/mcp/swui")).toBe(true);
    expect(isSwuiMcpHttpPath("/mcp")).toBe(false);
    expect(isSwuiMcpHttpPath("/mcp/sws")).toBe(false);
    expect(isSwuiMcpHttpPath("/mcp/swui/extra")).toBe(false);
  });
});

afterEach(() => {
  __resetRegistryCacheForTests();
});

afterAll(async () => {
  await client?.close();
  await server?.close();
  if (originalFixture === undefined) {
    delete process.env.REGISTRY_FIXTURE;
  } else {
    process.env.REGISTRY_FIXTURE = originalFixture;
  }
});
