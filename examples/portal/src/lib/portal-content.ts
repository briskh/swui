export const CONVENTION_PAGES = [
  { slug: "design-summary", title: "Design summary", file: "DESIGN-SUMMARY.md" },
  { slug: "do-and-dont", title: "Do and don't", file: "DO-AND-DONT.md" },
  { slug: "adoption", title: "Adoption", file: "ADOPTION.md" }
] as const;

export type ConventionSlug = (typeof CONVENTION_PAGES)[number]["slug"];

const docModules = import.meta.glob("../../.generated/docs/*.md", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>;

export function getConventionMarkdown(slug: ConventionSlug) {
  const page = CONVENTION_PAGES.find((entry) => entry.slug === slug);
  if (!page) {
    return null;
  }
  const key = `../../.generated/docs/${page.file}`;
  return docModules[key] ?? null;
}

export { SWUI_MCP_PUBLIC_URL, localSwuiMcpUrl } from "../../shared/mcp-path";

export const PORTAL_MCP_EXAMPLE = `{
  "mcpServers": {
    "sw": {
      "command": "sw",
      "args": ["mcp"]
    },
    "swui": {
      "url": "https://agent.swqt.net/mcp/swui"
    }
  }
}`;
