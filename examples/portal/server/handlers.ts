import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import {
  buildInstallHint,
  decodePackageParam,
  getPackageMetadata,
  getTrackedPackages,
  summarizePackage
} from "./registry-client";
import {
  componentResourceBody,
  componentResourceUri,
  flattenCatalogExports,
  getComponentDetails,
  readCatalogIndex,
  searchCatalog
} from "./catalog";

const MCP_INSTRUCTIONS = `swui MCP serves Skywalker design-system discovery only.

Before install: use swui resources/tools for catalog, adoption, and registry metadata.
After install: prefer node_modules/@swui/ui/AGENTS.md and same-version docs/* as version-locked truth.

Do not use swui MCP for SWS workflow/tools — those live on the separate "sw" MCP server.
Do not request tarball mirrors or source mutations through MCP.`;

const GENERATED_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../.generated");

const RESOURCE_MAP = [
  { uri: "swui://docs/AGENTS.md", file: "AGENTS.md", name: "AGENTS.md", description: "Package agent first-hop rules" },
  {
    uri: "swui://docs/ADOPTION.md",
    file: "docs/ADOPTION.md",
    name: "ADOPTION.md",
    description: "Install and Tailwind adoption guide"
  },
  {
    uri: "swui://docs/COMPONENT-CATALOG.md",
    file: "docs/COMPONENT-CATALOG.md",
    name: "COMPONENT-CATALOG.md",
    description: "Component catalog and usage notes"
  }
] as const;

function readGenerated(relativePath: string) {
  return readFileSync(join(GENERATED_ROOT, relativePath), "utf8");
}

export function createSwuiMcpServer() {
  const server = new McpServer(
    {
      name: "swui",
      title: "Skywalker UI MCP",
      version: "0.1.0"
    },
    {
      instructions: MCP_INSTRUCTIONS
    }
  );

  for (const resource of RESOURCE_MAP) {
    server.registerResource(
      resource.name,
      resource.uri,
      { description: resource.description, mimeType: "text/markdown" },
      async () => ({
        contents: [
          {
            uri: resource.uri,
            mimeType: "text/markdown",
            text: readGenerated(resource.file)
          }
        ]
      })
    );
  }

  const catalogIndex = readCatalogIndex(join(dirname(fileURLToPath(import.meta.url)), ".."));
  for (const entry of flattenCatalogExports(catalogIndex)) {
    const uri = componentResourceUri(entry.name);
    server.registerResource(
      entry.name,
      uri,
      {
        description: `${entry.groupTitle} · ${entry.notes}`,
        mimeType: "application/json"
      },
      async () => ({
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: componentResourceBody(entry)
          }
        ]
      })
    );
  }

  server.registerTool(
    "swui.catalog.search",
    {
      description: "Search COMPONENT-CATALOG exports by keyword",
      inputSchema: {
        query: z.string()
      }
    },
    async ({ query }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(catalogSearchPayload(query), null, 2)
        }
      ]
    })
  );

  server.registerTool(
    "swui.component.get",
    {
      description: "Return a single catalog export with notes and portal demo path",
      inputSchema: {
        name: z.string()
      }
    },
    async ({ name }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(componentGetPayload(name), null, 2)
        }
      ]
    })
  );

  server.registerTool(
    "swui.package.get",
    {
      description: "Read @swui/ui or @swui/ui-tokens registry metadata summary",
      inputSchema: {
        name: z.enum(["@swui/ui", "@swui/ui-tokens"]),
        version: z.string().optional()
      }
    },
    async ({ name }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(await packageGetPayload(name), null, 2)
        }
      ]
    })
  );

  server.registerTool(
    "swui.package.installHint",
    {
      description: "Return npm/bun install commands and .npmrc template for @swui packages",
      inputSchema: {}
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(await installHintPayload(), null, 2)
        }
      ]
    })
  );

  return server;
}

export function catalogSearchPayload(query: string) {
  const index = readCatalogIndex(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const results = searchCatalog(index, query).map((entry) => ({
    name: entry.name,
    group: entry.groupTitle,
    groupId: entry.groupId,
    slug: entry.slug,
    notes: entry.notes,
    demoPath: `/components/${entry.groupId}/${entry.slug}`,
    resourceUri: componentResourceUri(entry.name)
  }));
  return { query, count: results.length, results };
}

export function componentGetPayload(name: string) {
  const index = readCatalogIndex(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const component = getComponentDetails(index, name);
  if (!component) {
    return { found: false, name, error: "Component not found in catalog index" };
  }
  return { found: true, component };
}

export async function packageGetPayload(name: "@swui/ui" | "@swui/ui-tokens") {
  const response = await getPackageMetadata(name);
  return {
    meta: {
      stale: response.stale,
      cachedAt: response.cachedAt,
      live: response.live,
      registry: response.registry,
      error: response.error ?? null
    },
    package: summarizePackage(response.data)
  };
}

export async function installHintPayload() {
  const hint = buildInstallHint();
  const packages = [];
  for (const name of getTrackedPackages()) {
    const response = await getPackageMetadata(name);
    packages.push({
      name,
      latest: summarizePackage(response.data)?.latest ?? null,
      meta: {
        stale: response.stale,
        cachedAt: response.cachedAt
      }
    });
  }
  return { ...hint, packages };
}

export async function handleMcpHttpRequest(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });
  const server = createSwuiMcpServer();
  await server.connect(transport);
  return transport.handleRequest(request);
}

export async function handleRegistryApi(pathname: string): Promise<Response | null> {
  const prefix = "/api/registry/";
  if (!pathname.startsWith(prefix)) {
    return null;
  }
  const encoded = pathname.slice(prefix.length);
  if (!encoded) {
    return jsonResponse({ error: "missing package name" }, { status: 400 });
  }
  const packageName = decodePackageParam(encoded);
  const payload = await getPackageMetadata(packageName);
  return jsonResponse(payload, { status: payload.data ? 200 : 503 });
}

export function jsonResponse(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers ?? {})
    }
  });
}

async function readRequestBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/** Connect-style middleware for Vite dev server. */
export function createPortalMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    try {
      if (url.pathname === "/mcp" || url.pathname.startsWith("/mcp/")) {
        const body = await readRequestBody(req);
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (value !== undefined) {
            headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          }
        }
        const response = await handleMcpHttpRequest(
          new Request(`http://localhost${url.pathname}${url.search}`, {
            method: req.method,
            headers,
            body: body && body.length > 0 ? new Uint8Array(body) : undefined
          })
        );
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
        return;
      }
      const registryResponse = await handleRegistryApi(url.pathname);
      if (registryResponse) {
        res.statusCode = registryResponse.status;
        registryResponse.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await registryResponse.arrayBuffer()));
        return;
      }
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end(error instanceof Error ? error.message : String(error));
      return;
    }
    next();
  };
}
