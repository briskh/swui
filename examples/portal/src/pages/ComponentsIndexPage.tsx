import { Link } from "react-router-dom";
import { catalog, demoPath, totalExportCount } from "../lib/catalog";

export function ComponentsIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-3xl font-semibold">Component catalog</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Browse {totalExportCount()} formal exports from <code>COMPONENT-CATALOG.md</code>. Each entry links to a portal
          demo that renders in the current theme context.
        </p>
      </section>
      {catalog.groups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <h3 id={`group-${group.id}`} className="text-xl font-semibold">
            {group.title}
          </h3>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {group.exports.map((entry) => (
              <li key={entry.name}>
                <Link
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary hover:bg-muted/30"
                  to={demoPath(group.id, entry.slug)}
                >
                  <span className="font-medium text-foreground">{entry.name}</span>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.notes}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
