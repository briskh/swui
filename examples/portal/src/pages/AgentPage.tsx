import { Card, CardContent, CardHeader, CardTitle, SourceCode } from "@swqt/ui";
import { Link } from "react-router-dom";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { PORTAL_MCP_EXAMPLE, SWUI_MCP_PUBLIC_URL } from "../lib/portal-content";

export function AgentPage() {
  return (
    <div className="flex flex-col gap-6">
      <PortalPageHeader
        title="Agent MCP"
        description={
          <p>
            Production MCP URL: <code data-testid="mcp-public-url">{SWUI_MCP_PUBLIC_URL}</code>. Use the dedicated{" "}
            <code>swui</code> MCP server for design-system discovery before install. Keep the existing <code>sw</code>{" "}
            MCP server for SWS methodology and workflow tools. After install, read version-locked docs from{" "}
            <code>node_modules/@swqt/ui/AGENTS.md</code>.
          </p>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Recommended Cursor MCP config</CardTitle>
        </CardHeader>
        <CardContent>
          <div data-testid="mcp-config-example">
            <SourceCode language="json" value={PORTAL_MCP_EXAMPLE} />
          </div>
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
              Read the blocking <code>swui://foundation/contract</code> and{" "}
              <code>swui://packages/ui/docs/HTML-STANDARDS.md</code>.
            </li>
            <li>
              Actively consult <Link to="/colors">Colors</Link>, <Link to="/typography">Typography</Link>,{" "}
              <Link to="/icons">Icons</Link>, and the exact <Link to="/components">component demo</Link>.
            </li>
            <li>
              Search with a non-empty query; the default limit is 10 and the maximum is 25.
            </li>
            <li>
              Read one exact <code>swui://components/{"{name}"}</code> resource.
            </li>
            <li>
              Resolve the exact package version before installing and compare <code>sourceVersion</code> with{" "}
              <code>releaseStatus</code>.
            </li>
          </ol>
          <p>
            The static resource list stays small; component details are available through one resource template. All
            four tools are read-only and return structured content plus equivalent JSON text.
          </p>
          <p>
            Every catalog or component result includes mandatory <code>contractRefs</code> and absolute{" "}
            <code>referenceSite</code> URLs. Use exported <code>@swqt/ui</code> controls, semantic tokens, repository
            font stacks, Lucide named imports, and native HTML-first semantics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
