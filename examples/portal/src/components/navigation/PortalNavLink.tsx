import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "@swqt/ui";
import { isPortalNavSectionActive, type PortalNavSection } from "../../config/navigation";

export const topBarNavLinkClassName =
  "relative -mb-px inline-flex h-12 items-center border-b-2 px-3 text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

export const topBarNavLinkActiveClassName = "z-10 border-b-primary font-semibold text-foreground";

export const topBarNavLinkInactiveClassName =
  "border-b-transparent font-medium text-muted-foreground hover:text-foreground";

type PortalNavLinkProps = {
  to: string;
  children: ReactNode;
  end?: boolean;
  className?: string;
  section?: PortalNavSection;
  onNavigate?: () => void;
};

export function PortalNavLink({
  to,
  children,
  end = false,
  className,
  section,
  onNavigate
}: PortalNavLinkProps) {
  const { pathname } = useLocation();

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive: navLinkActive }) => {
        const active = section ? isPortalNavSectionActive(section, pathname) : navLinkActive;
        return cn(
          topBarNavLinkClassName,
          active ? topBarNavLinkActiveClassName : topBarNavLinkInactiveClassName,
          className
        );
      }}
    >
      {children}
    </NavLink>
  );
}
