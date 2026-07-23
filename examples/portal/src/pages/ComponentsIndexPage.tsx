import { Badge, Card, CardContent, TableOfContentsLayout, TableOfContentsPanel } from "@swqt/ui";
import { Link } from "react-router-dom";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { catalog, demoPath, totalExportCount } from "../lib/catalog";

export function ComponentsIndexPage() {
  const tocItems = catalog.groups.map((group) => ({
    id: `group-${group.id}`,
    title: group.title,
    level: 2 as const
  }));

  return (
    <TableOfContentsLayout
      toc={
        <div data-testid="page-toc">
          <TableOfContentsPanel items={tocItems} heading="Groups" />
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        <PortalPageHeader
          title="Component catalog"
          description={
            <p>
              Browse {totalExportCount()} formal exports from <code>COMPONENT-CATALOG.md</code>. Each entry links to a
              portal demo that renders in the current theme context.
            </p>
          }
        />

        {catalog.groups.map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h3 id={`group-${group.id}`} className="scroll-mt-24 text-xl font-semibold">
                {group.title}
              </h3>
              <Badge variant="outline">{group.exports.length}</Badge>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {group.exports.map((entry) => (
                <li key={entry.name}>
                  <Link
                    className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    to={demoPath(group.id, entry.slug)}
                  >
                    <Card className="transition-colors hover:border-primary hover:bg-muted/30">
                      <CardContent className="space-y-1 py-3">
                        <p className="text-base font-semibold leading-tight">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </TableOfContentsLayout>
  );
}
