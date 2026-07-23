import { Link, Navigate, useParams } from "react-router-dom";
import { documentedExceptions, getComponentDemo } from "../demos/registry";
import { findCatalogExport } from "../lib/catalog";

export function ComponentDemoPage() {
  const { groupSlug = "", exportSlug = "" } = useParams();
  const match = findCatalogExport(groupSlug, exportSlug);

  if (!match) {
    return <Navigate to="/components" replace />;
  }

  const Demo = getComponentDemo(match.export.name);

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link className="hover:text-foreground" to="/components">
          Components
        </Link>
        <span className="px-2">/</span>
        <span>{match.group.title}</span>
        <span className="px-2">/</span>
        <span className="text-foreground">{match.export.name}</span>
      </nav>
      <section>
        <h2 className="text-3xl font-semibold">{match.export.name}</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">{match.export.notes}</p>
        {documentedExceptions.has(match.export.name) ? (
          <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Documented exception demo</p>
        ) : null}
      </section>
      <section aria-label={`${match.export.name} demo`} className="rounded-lg border border-border bg-card p-6">
        {Demo ? <Demo /> : <p className="text-sm text-destructive">Demo not registered.</p>}
      </section>
    </div>
  );
}
