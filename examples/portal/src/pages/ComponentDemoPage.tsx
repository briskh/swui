import { Navigate, useParams } from "react-router-dom";
import { Alert, AlertDescription, Badge, BreadcrumbTrail, Card, CardContent } from "@swqt/ui";
import { documentedExceptions, getComponentDemo } from "../demos/registry";
import { findCatalogExport } from "../lib/catalog";
import { PortalPageHeader } from "../components/PortalPageHeader";

const BARE_DEMO_GROUPS = new Set(["data-display"]);

export function ComponentDemoPage() {
  const { groupSlug = "", exportSlug = "" } = useParams();
  const match = findCatalogExport(groupSlug, exportSlug);

  if (!match) {
    return <Navigate to="/components" replace />;
  }

  const Demo = getComponentDemo(match.export.name);
  const bareDemo = BARE_DEMO_GROUPS.has(match.group.id);

  return (
    <div className="flex flex-col gap-6">
      <BreadcrumbTrail
        items={[
          { label: "Components", href: "/components" },
          { label: match.group.title },
          { label: match.export.name, isCurrentPage: true }
        ]}
      />

      <PortalPageHeader title={match.export.name} description={<p>{match.export.notes}</p>}>
        {documentedExceptions.has(match.export.name) ? (
          <Badge variant="outline" className="mt-2">
            Documented exception demo
          </Badge>
        ) : null}
      </PortalPageHeader>

      {bareDemo ? (
        <section aria-label={`${match.export.name} demo`}>
          {Demo ? <Demo /> : null}
          {!Demo ? (
            <Alert variant="destructive">
              <AlertDescription>Demo not registered.</AlertDescription>
            </Alert>
          ) : null}
        </section>
      ) : (
        <section aria-label={`${match.export.name} demo`}>
          <Card>
            <CardContent className="p-6">
              {Demo ? (
                <Demo />
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>Demo not registered.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
