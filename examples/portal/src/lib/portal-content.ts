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

export const PORTAL_MCP_EXAMPLE = `{
  "mcpServers": {
    "sw": {
      "command": "sw",
      "args": ["mcp"],
      "env": {
        "SW_MCP_URL": "https://agent.swqt.net/mcp",
        "SW_MCP_TOKEN": "\${SW_MCP_TOKEN}"
      }
    },
    "swui": {
      "url": "https://ui.swqt.net/mcp"
    }
  }
}`;
