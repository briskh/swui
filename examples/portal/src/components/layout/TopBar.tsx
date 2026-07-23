import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeControl,
  cn
} from "@swqt/ui";
import {
  isPortalNavSectionActive,
  overviewConventionItems,
  overviewSection,
  portalNavSections
} from "../../config/navigation";
import {
  PortalNavLink,
  topBarNavLinkActiveClassName,
  topBarNavLinkClassName,
  topBarNavLinkInactiveClassName
} from "../navigation/PortalNavLink";
import {
  shellChromeHeaderClassName,
  shellHorizontalInsetClassName,
  shellTopBarHeightClassName
} from "./layout-shell";
function OverviewTopBarItem({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const active = isPortalNavSectionActive(overviewSection, pathname);

  return (
    <div
      className={cn(
        topBarNavLinkClassName,
        "gap-0 px-0",
        active ? topBarNavLinkActiveClassName : topBarNavLinkInactiveClassName
      )}
    >
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className="inline-flex h-full items-center px-3"
      >
        Overview
      </NavLink>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-full shrink-0 items-center px-1.5 text-inherit transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            aria-label="Overview pages"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {overviewConventionItems.map((item) => (
            <DropdownMenuItem key={item.to} asChild>
              <Link to={item.to} onClick={onNavigate}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileDrawerNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="flex flex-col">
      {portalNavSections.map((section) => (
        <div key={section.id} className="border-t border-border first:border-t-0">
          <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.label}
          </div>
          <ul>
            {section.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className="flex min-h-10 items-center px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className={shellChromeHeaderClassName}>
        <div
          className={cn(
            "relative flex w-full items-center gap-3 max-[820px]:gap-2",
            shellTopBarHeightClassName,
            shellHorizontalInsetClassName,
            "max-[820px]:pr-3"
          )}
        >
          <Link
            to="/"
            className="mr-4 hidden shrink-0 rounded-sm font-serif text-xl font-semibold leading-none text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring min-[821px]:inline-flex"
            aria-label="SWUI home"
          >
            SWUI
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-stretch justify-end gap-0.5 min-[821px]:flex"
            aria-label="Primary"
          >
            {portalNavSections.map((section) =>
              section.id === "overview" ? (
                <OverviewTopBarItem key={section.id} />
              ) : (
                <PortalNavLink key={section.id} to={section.topBarTo} section={section}>
                  {section.label}
                </PortalNavLink>
              )
            )}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeControl />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-[821px]:hidden shrink-0"
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[1px] min-[821px]:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col border-l border-border bg-background shadow-lg transition-transform duration-200 ease-out min-[821px]:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "flex items-center justify-end border-b border-border px-4",
            shellTopBarHeightClassName
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MobileDrawerNav onNavigate={() => setMobileOpen(false)} />
        </div>
      </aside>
    </>
  );
}
