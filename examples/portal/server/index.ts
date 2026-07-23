import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { handleMcpHttpRequest, handleRegistryApi } from "./handlers";
import { isSwuiMcpHttpPath } from "../shared/mcp-path";

const portalRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(portalRoot, "dist");
const port = Number(process.env.PORT ?? 4176);
const host = process.env.HOST ?? "127.0.0.1";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".woff2": "font/woff2"
};

function serveStatic(pathname: string) {
  const relative = pathname === "/" ? "/index.html" : pathname;
  const filePath = join(distRoot, relative);
  if (!filePath.startsWith(distRoot) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    const fallback = join(distRoot, "index.html");
    if (!existsSync(fallback)) {
      return new Response("Portal build missing. Run bun run build first.", { status: 503 });
    }
    return new Response(readFileSync(fallback), {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
  const ext = extname(filePath);
  return new Response(readFileSync(filePath), {
    headers: { "content-type": MIME[ext] ?? "application/octet-stream" }
  });
}

const server = Bun.serve({
  hostname: host,
  port,
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (isSwuiMcpHttpPath(url.pathname)) {
      return handleMcpHttpRequest(request);
    }
    const registryResponse = await handleRegistryApi(url.pathname);
    if (registryResponse) {
      return registryResponse;
    }
    return serveStatic(url.pathname);
  }
});

console.log(`portal server listening on http://${host}:${server.port} (production)`);
