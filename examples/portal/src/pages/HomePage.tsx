import { Card, CardContent, CardHeader, CardTitle } from "@swui/ui";
import { Link } from "react-router-dom";
import { CONVENTION_PAGES } from "../lib/portal-content";

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-3xl font-semibold">Shared Web UI design system</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Canonical human entry for <code>@swui/ui</code> and <code>@swui/ui-tokens</code>. This portal mirrors package
          docs from the monorepo SSOT, exposes registry install guidance, and hosts the read-only <code>swui</code> MCP
          surface for pre-install agent discovery.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conventions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {CONVENTION_PAGES.map((page) => (
              <Link key={page.slug} className="text-primary underline underline-offset-4" to={`/conventions/${page.slug}`}>
                {page.title}
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Install and agents</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Link className="text-primary underline underline-offset-4" to="/packages">
              Package versions and install commands
            </Link>
            <Link className="text-primary underline underline-offset-4" to="/agent">
              MCP connection guide
            </Link>
            <Link className="text-primary underline underline-offset-4" to="/conventions/adoption">
              Adoption checklist
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
