import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
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
import { isSwuiMcpHttpPath, SWUI_MCP_PUBLIC_URL } from "../shared/mcp-path";

export const DEFAULT_SEARCH_LIMIT = 10;
export const MAX_SEARCH_LIMIT = 25;
export const MAX_SEARCH_RESPONSE_BYTES = 16 * 1024;

export const MCP_INSTRUCTIONS = `swui MCP is the read-only discovery service for the @swqt/ui design system.

Public URL: ${SWUI_MCP_PUBLIC_URL}

Use this progressive-disclosure sequence:
1. Read swui://packages/ui/llms.txt and swui://packages/ui/AGENTS.md for the UI first hop.
2. Read swui://packages/ui-tokens/llms.txt and swui://packages/ui-tokens/AGENTS.md for token rules.
3. Search with swui.catalog.search using a non-empty query; default limit is 10 and maximum limit is 25.
4. Read one exact swui://components/{name} resource or call swui.component.get.
5. Resolve an exact package version with swui.package.get before installing.

Before install, use these resources and tools for catalog, adoption, and registry metadata.
After install, prefer node_modules/@swqt/ui/AGENTS.md and same-version package docs as version-locked truth.

Do not use swui MCP for SWS workflow/tools — those live on the separate "sw" MCP server.
Do not request tarball mirrors or source mutations through MCP.`;

const GENERATED_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../.generated");

export const RESOURCE_MAP = [
  {
    uri: "swui://packages/ui/AGENTS.md",
    file: "AGENTS.md",
    name: "ui-agent-first-hop",
    title: "@swqt/ui Agent first hop",
    description: "Package-local Agent rules and documentation routing"
  },
  {
    uri: "swui://packages/ui/llms.txt",
    file: "llms.txt",
    name: "ui-llms-index",
    title: "@swqt/ui LLM index",
    description: "Compact package documentation index for Agents"
  },
  {
    uri: "swui://packages/ui/docs/ADOPTION.md",
    file: "docs/ADOPTION.md",
    name: "ui-adoption",
    title: "@swqt/ui adoption guide",
    description: "Install and Tailwind adoption guide"
  },
  {
    uri: "swui://packages/ui/docs/DESIGN-SUMMARY.md",
    file: "docs/DESIGN-SUMMARY.md",
    name: "ui-design-summary",
    title: "@swqt/ui design summary",
    description: "Design-system principles and visual language"
  },
  {
    uri: "swui://packages/ui/docs/COMPONENT-CATALOG.md",
    file: "docs/COMPONENT-CATALOG.md",
    name: "ui-component-catalog",
    title: "@swqt/ui component catalog",
    description: "Component catalog and usage notes"
  },
  {
    uri: "swui://packages/ui/docs/DO-AND-DONT.md",
    file: "docs/DO-AND-DONT.md",
    name: "ui-do-and-dont",
    title: "@swqt/ui do and don't",
    description: "Implementation constraints and usage examples"
  },
  {
    uri: "swui://packages/ui-tokens/AGENTS.md",
    file: "tokens/AGENTS.md",
    name: "tokens-agent-first-hop",
    title: "@swqt/ui-tokens Agent first hop",
    description: "Token package Agent rules and documentation routing"
  },
  {
    uri: "swui://packages/ui-tokens/llms.txt",
    file: "tokens/llms.txt",
    name: "tokens-llms-index",
    title: "@swqt/ui-tokens LLM index",
    description: "Compact token package documentation index for Agents"
  },
  {
    uri: "swui://packages/ui-tokens/docs/ADOPTION.md",
    file: "tokens/docs/ADOPTION.md",
    name: "tokens-adoption",
    title: "@swqt/ui-tokens adoption guide",
    description: "Token installation and adoption guide"
  },
  {
    uri: "swui://packages/ui-tokens/docs/TOKENS.md",
    file: "tokens/docs/TOKENS.md",
    name: "tokens-reference",
    title: "@swqt/ui-tokens reference",
    description: "Semantic token reference"
  }
] as const;

const errorSchema = z
  .object({
    code: z.string(),
    message: z.string()
  })
  .nullable();

const importHintSchema = z.object({
  packageName: z.literal("@swqt/ui"),
  module: z.string(),
  exportName: z.string(),
  kind: z.enum(["named", "namespace", "type"]),
  statement: z.string(),
  note: z.string().nullable()
});

const componentSchema = z.object({
  name: z.string(),
  group: z.string(),
  groupId: z.string(),
  slug: z.string(),
  notes: z.string(),
  demoPath: z.string(),
  resourceUri: z.string(),
  importHint: importHintSchema
});

const registryFreshnessSchema = z.object({
  source: z.enum(["registry", "cache", "fixture", "none"]),
  stale: z.boolean(),
  cachedAt: z.string().nullable(),
  live: z.boolean(),
  registry: z.string(),
  error: z.string().nullable()
});

const readOnlyAnnotations = (title: string, openWorldHint: boolean) => ({
  title,
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint
});

function readGenerated(relativePath: string) {
  return readFileSync(join(GENERATED_ROOT, relativePath), "utf8");
}

function jsonToolResult(payload: Record<string, unknown>, isError = false) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2)
      }
    ],
    structuredContent: payload,
    ...(isError ? { isError: true } : {})
  };
}

function searchToolResultByteLength(payload: Record<string, unknown>) {
  return Buffer.byteLength(JSON.stringify(jsonToolResult(payload)), "utf8");
}

export function createSwuiMcpServer() {
  const server = new McpServer(
    {
      name: "swui",
      title: "Skywalker UI MCP",
      version: "1.0.0"
    },
    {
      instructions: MCP_INSTRUCTIONS
    }
  );

  for (const resource of RESOURCE_MAP) {
    server.registerResource(
      resource.name,
      resource.uri,
      {
        title: resource.title,
        description: resource.description,
        mimeType: "text/markdown"
      },
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
  const catalogEntries = flattenCatalogExports(catalogIndex);
  server.registerResource(
    "swui-component",
    new ResourceTemplate("swui://components/{name}", {
      list: undefined,
      complete: {
        name: (value) =>
          catalogEntries
            .map((entry) => entry.name)
            .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()))
            .slice(0, MAX_SEARCH_LIMIT)
      }
    }),
    {
      title: "Exact @swqt/ui component",
      description: "Read one exact catalog export by its case-sensitive name",
      mimeType: "application/json"
    },
    async (uri, variables) => {
      const variable = variables.name;
      const encodedName = Array.isArray(variable) ? variable[0] : variable;
      const name = decodeURIComponent(encodedName ?? "");
      const entry = catalogEntries.find((candidate) => candidate.name === name);
      if (!entry) {
        throw new Error(`Component "${name}" was not found in the catalog`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: componentResourceBody(entry)
          }
        ]
      };
    }
  );

  server.registerTool(
    "swui.catalog.search",
    {
      title: "Search the @swqt/ui catalog",
      description: "Search COMPONENT-CATALOG exports by keyword",
      inputSchema: {
        query: z.string().trim().min(1, "query must not be empty"),
        limit: z.number().int().min(1).max(MAX_SEARCH_LIMIT).default(DEFAULT_SEARCH_LIMIT)
      },
      outputSchema: {
        ok: z.boolean(),
        query: z.string(),
        limit: z.number().int(),
        maxLimit: z.number().int(),
        total: z.number().int(),
        count: z.number().int(),
        truncated: z.boolean(),
        results: z.array(componentSchema),
        error: errorSchema
      },
      annotations: readOnlyAnnotations("Search the @swqt/ui catalog", false)
    },
    async ({ query, limit }) => jsonToolResult(catalogSearchPayload(query, limit))
  );

  server.registerTool(
    "swui.component.get",
    {
      title: "Get one @swqt/ui component",
      description: "Return a single catalog export with notes and portal demo path",
      inputSchema: {
        name: z.string().trim().min(1)
      },
      outputSchema: {
        found: z.boolean(),
        name: z.string(),
        component: componentSchema.nullable(),
        error: errorSchema
      },
      annotations: readOnlyAnnotations("Get one @swqt/ui component", false)
    },
    async ({ name }) => {
      const payload = componentGetPayload(name);
      return jsonToolResult(payload, !payload.found);
    }
  );

  server.registerTool(
    "swui.package.get",
    {
      title: "Resolve an @swqt package version",
      description: "Read @swqt/ui or @swqt/ui-tokens registry metadata summary",
      inputSchema: {
        name: z.enum(["@swqt/ui", "@swqt/ui-tokens"]),
        version: z.string().trim().min(1).optional()
      },
      outputSchema: {
        found: z.boolean(),
        name: z.enum(["@swqt/ui", "@swqt/ui-tokens"]),
        requestedVersion: z.string().nullable(),
        resolvedVersion: z.string().nullable(),
        latest: z.string().nullable(),
        availableVersions: z.array(z.string()),
        package: z
          .object({
            name: z.string(),
            latest: z.string().nullable(),
            requestedVersion: z.string().nullable(),
            resolvedVersion: z.string(),
            isLatest: z.boolean(),
            versions: z.array(z.string()),
            peerDependencies: z.record(z.string(), z.string()),
            dependencies: z.record(z.string(), z.string())
          })
          .nullable(),
        meta: registryFreshnessSchema,
        error: errorSchema
      },
      annotations: readOnlyAnnotations("Resolve an @swqt package version", true)
    },
    async ({ name, version }) => {
      const payload = await packageGetPayload(name, version);
      return jsonToolResult(payload, !payload.found);
    }
  );

  server.registerTool(
    "swui.package.installHint",
    {
      title: "Get @swqt installation hints",
      description: "Return npm/bun install commands and .npmrc template for @swqt packages",
      inputSchema: {},
      outputSchema: {
        registry: z.string(),
        npmrc: z.string(),
        commands: z.object({
          bun: z.string(),
          npm: z.string()
        }),
        packages: z.array(
          z.object({
            name: z.enum(["@swqt/ui", "@swqt/ui-tokens"]),
            latest: z.string().nullable(),
            meta: registryFreshnessSchema
          })
        )
      },
      annotations: readOnlyAnnotations("Get @swqt installation hints", true)
    },
    async () => jsonToolResult(await installHintPayload())
  );

  return server;
}

export function catalogSearchPayload(query: string, limit = DEFAULT_SEARCH_LIMIT) {
  const index = readCatalogIndex(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const normalizedQuery = query.trim();
  const boundedLimit = Math.max(1, Math.min(MAX_SEARCH_LIMIT, Math.trunc(limit) || DEFAULT_SEARCH_LIMIT));
  if (!normalizedQuery) {
    return {
      ok: false,
      query: "",
      limit: boundedLimit,
      maxLimit: MAX_SEARCH_LIMIT,
      total: 0,
      count: 0,
      truncated: false,
      results: [],
      error: {
        code: "INVALID_QUERY",
        message: "query must not be empty"
      }
    };
  }
  const matches = searchCatalog(index, normalizedQuery).map((entry) => ({
    name: entry.name,
    group: entry.groupTitle,
    groupId: entry.groupId,
    slug: entry.slug,
    notes: entry.notes,
    demoPath: `/components/${entry.groupId}/${entry.slug}`,
    resourceUri: componentResourceUri(entry.name),
    importHint: getComponentDetails(index, entry.name)!.importHint
  }));
  const results = [];
  for (const result of matches.slice(0, boundedLimit)) {
    const candidate = {
      ok: true,
      query: normalizedQuery,
      limit: boundedLimit,
      maxLimit: MAX_SEARCH_LIMIT,
      total: matches.length,
      count: results.length + 1,
      truncated: matches.length > results.length + 1,
      results: [...results, result],
      error: null
    };
    if (searchToolResultByteLength(candidate) > MAX_SEARCH_RESPONSE_BYTES) {
      break;
    }
    results.push(result);
  }
  return {
    ok: true,
    query: normalizedQuery,
    limit: boundedLimit,
    maxLimit: MAX_SEARCH_LIMIT,
    total: matches.length,
    count: results.length,
    truncated: matches.length > results.length,
    results,
    error: null
  };
}

export function componentGetPayload(name: string) {
  const index = readCatalogIndex(join(dirname(fileURLToPath(import.meta.url)), ".."));
  const component = getComponentDetails(index, name);
  if (!component) {
    return {
      found: false,
      name,
      component: null,
      error: {
        code: "COMPONENT_NOT_FOUND",
        message: `Component "${name}" was not found in the catalog index`
      }
    };
  }
  return { found: true, name, component, error: null };
}

function registryFreshness(response: Awaited<ReturnType<typeof getPackageMetadata>>) {
  return {
    source: response.source,
    stale: response.stale,
    cachedAt: response.cachedAt,
    live: response.live,
    registry: response.registry,
    error: response.error ?? null
  };
}

export async function packageGetPayload(
  name: "@swqt/ui" | "@swqt/ui-tokens",
  version?: string
) {
  const response = await getPackageMetadata(name);
  const requestedVersion = version?.trim() || undefined;
  const summary = summarizePackage(response.data, requestedVersion);
  const latest = response.data?.["dist-tags"]?.latest ?? null;
  const availableVersions = Object.keys(response.data?.versions ?? {}).sort((a, b) =>
    b.localeCompare(a, undefined, { numeric: true })
  );
  let error = null;
  if (!response.data) {
    error = {
      code: "REGISTRY_UNAVAILABLE",
      message: response.error ?? `No registry metadata is available for ${name}`
    };
  } else if (requestedVersion && !summary) {
    error = {
      code: "VERSION_NOT_FOUND",
      message: `${name}@${requestedVersion} was not found`
    };
  } else if (!summary) {
    error = {
      code: "LATEST_VERSION_NOT_FOUND",
      message: `${name} has no resolvable latest version`
    };
  }
  return {
    found: summary !== null,
    name,
    requestedVersion: requestedVersion ?? null,
    resolvedVersion: summary?.resolvedVersion ?? null,
    latest,
    availableVersions,
    package: summary,
    meta: registryFreshness(response),
    error
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
      meta: registryFreshness(response)
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
      if (isSwuiMcpHttpPath(url.pathname)) {
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
