import { CONVENTION_PAGES } from "../lib/portal-content";

export type PortalNavItem = {
  to: string;
  label: string;
  end?: boolean;
};

export type PortalNavSection = {
  id: string;
  label: string;
  sectionPath: string;
  pathPrefixes?: string[];
  topBarTo: string;
  items: PortalNavItem[];
};

export const overviewSection: PortalNavSection = {
  id: "overview",
  label: "Overview",
  sectionPath: "/",
  pathPrefixes: ["/conventions"],
  topBarTo: "/",
  items: [
    { to: "/", label: "Overview", end: true },
    ...CONVENTION_PAGES.map((page) => ({
      to: `/conventions/${page.slug}`,
      label: page.title
    }))
  ]
};

export const portalNavSections: PortalNavSection[] = [
  overviewSection,
  {
    id: "colors",
    label: "Colors",
    sectionPath: "/colors",
    topBarTo: "/colors",
    items: [{ to: "/colors", label: "Colors" }]
  },
  {
    id: "typography",
    label: "Typography",
    sectionPath: "/typography",
    topBarTo: "/typography",
    items: [{ to: "/typography", label: "Typography" }]
  },
  {
    id: "components",
    label: "Components",
    sectionPath: "/components",
    topBarTo: "/components",
    items: [{ to: "/components", label: "Components" }]
  },
  {
    id: "packages",
    label: "Packages",
    sectionPath: "/packages",
    topBarTo: "/packages",
    items: [{ to: "/packages", label: "Packages" }]
  },
  {
    id: "agent",
    label: "Agent",
    sectionPath: "/agent",
    topBarTo: "/agent",
    items: [{ to: "/agent", label: "Agent" }]
  }
];

export const topBarSections = portalNavSections;

export const overviewConventionItems = CONVENTION_PAGES.map((page) => ({
  to: `/conventions/${page.slug}`,
  label: page.title
}));

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function sectionMatchesPath(section: PortalNavSection, pathname: string) {
  const normalized = normalizePathname(pathname);
  if (normalized === section.sectionPath) {
    return true;
  }

  const prefixes = section.pathPrefixes ?? [section.sectionPath];
  return prefixes.some(
    (prefix) => prefix !== "/" && (normalized === prefix || normalized.startsWith(`${prefix}/`))
  );
}

export function isPortalNavSectionActive(section: PortalNavSection, pathname: string) {
  const normalized = normalizePathname(pathname);
  if (section.id === "overview") {
    return normalized === "/" || normalized.startsWith("/conventions/");
  }

  return sectionMatchesPath(section, normalized);
}
