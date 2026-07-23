import { Button, Card, CardContent, CardHeader, CardTitle } from "@swqt/ui";
import { Link } from "react-router-dom";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { CONVENTION_PAGES } from "../lib/portal-content";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <PortalPageHeader
        title="Shared Web UI design system"
        description={
          <p>
            Canonical human entry for <code>@swqt/ui</code> and <code>@swqt/ui-tokens</code>. This portal mirrors package
            docs from the monorepo SSOT, exposes registry install guidance, and hosts the read-only <code>swui</code> MCP
            surface for pre-install agent discovery.
          </p>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conventions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2 text-sm">
            {CONVENTION_PAGES.map((page) => (
              <Button key={page.slug} variant="link" className="h-auto p-0" asChild>
                <Link to={`/conventions/${page.slug}`}>{page.title}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Foundation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2 text-sm">
            <Button variant="link" className="h-auto p-0" asChild>
              <Link to="/colors">Colors</Link>
            </Button>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link to="/typography">Typography</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2 text-sm">
            <Button variant="link" className="h-auto p-0" asChild>
              <Link to="/components">Browse the full component catalog</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Install and agents</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2 text-sm">
            <Button variant="link" className="h-auto p-0" asChild>
              <Link to="/packages">Package versions and install commands</Link>
            </Button>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link to="/agent">MCP connection guide</Link>
            </Button>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link to="/conventions/adoption">Adoption checklist</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
