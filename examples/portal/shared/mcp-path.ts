/** Canonical HTTP mount for the swui MCP handler (local + proxied production). */
export const SWUI_MCP_HTTP_PATH = "/mcp/swui";

/** Public Agent gateway URL (Caddy on agent.swqt.net → portal MCP handler). */
export const SWUI_MCP_PUBLIC_URL = "https://agent.swqt.net/mcp/swui";

export function isSwuiMcpHttpPath(pathname: string) {
  return pathname === SWUI_MCP_HTTP_PATH;
}

export function localSwuiMcpUrl(host = "http://127.0.0.1:4176") {
  return `${host.replace(/\/$/, "")}${SWUI_MCP_HTTP_PATH}`;
}
