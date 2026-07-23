import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@swqt/ui";
import { TopBar } from "./components/layout/TopBar";
import { centeredPageClassName, shellMainClassName } from "./components/layout/layout-shell";

export function PortalLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <TopBar />
        <main className={shellMainClassName}>
          <div className={centeredPageClassName}>
            <Outlet />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
