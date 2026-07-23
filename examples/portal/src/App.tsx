import { NavLink, Outlet } from "react-router-dom";
import { ThemeControl, ThemeProvider } from "@swui/ui";
import { CONVENTION_PAGES } from "./lib/portal-content";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "font-medium text-primary underline underline-offset-4" : "text-muted-foreground hover:text-foreground";

export function PortalLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Skywalker design system</p>
              <h1 className="text-xl font-semibold">Portal</h1>
            </div>
            <ThemeControl />
          </div>
          <nav aria-label="Primary" className="mx-auto flex max-w-5xl flex-wrap gap-4 px-6 pb-4 text-sm">
            <NavLink to="/" end className={linkClass}>
              Overview
            </NavLink>
            {CONVENTION_PAGES.map((page) => (
              <NavLink key={page.slug} to={`/conventions/${page.slug}`} className={linkClass}>
                {page.title}
              </NavLink>
            ))}
            <NavLink to="/packages" className={linkClass}>
              Packages
            </NavLink>
            <NavLink to="/agent" className={linkClass}>
              Agent
            </NavLink>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
