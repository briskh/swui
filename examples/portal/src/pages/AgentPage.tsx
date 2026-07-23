import { Card, CardContent, CardHeader, CardTitle } from "@swqt/ui";
import { Link } from "react-router-dom";
import { PORTAL_MCP_EXAMPLE, SWUI_MCP_PUBLIC_URL } from "../lib/portal-content";

export function AgentPage() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-3xl font-semibold">Agent MCP</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Production MCP URL:{" "}
          <code data-testid="mcp-public-url">{SWUI_MCP_PUBLIC_URL}</code>. Use the dedicated{" "}
          <code>swui</code> MCP server for design-system discovery before install. Keep the existing{" "}
          <code>sw</code> MCP server for SWS methodology and workflow tools. After install, read version-locked docs from{" "}
          <code>node_modules/@swqt/ui/AGENTS.md</code>.
        </p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Recommended Cursor MCP config</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm" data-testid="mcp-config-example">
            <code>{PORTAL_MCP_EXAMPLE}</code>
          </pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Division of responsibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">swui</strong>: component catalog resources, adoption snippets, registry
            metadata, install hints.
          </p>
          <p>
            <strong className="text-foreground">sw</strong>: workflow, routing, intake, and project methodology tools.
          </p>
          <p>
            See also <Link to="/conventions/adoption">Adoption guide</Link> for package-local agent docs.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progressive discovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Read <code>swui://packages/ui/llms.txt</code> and <code>swui://packages/ui/AGENTS.md</code>.
            </li>
            <li>
              Read the token first hop at <code>swui://packages/ui-tokens/llms.txt</code>.
            </li>
            <li>
              Search with a non-empty query; the default limit is 10 and the maximum is 25.
            </li>
            <li>
              Read one exact <code>swui://components/{"{name}"}</code> resource.
            </li>
            <li>Resolve the exact package version before installing.</li>
          </ol>
          <p>
            The static resource list stays small; component details are available through one resource template. All
            four tools are read-only and return structured content plus equivalent JSON text.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
