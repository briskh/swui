import * as React from "react";
import { scrollToSection } from "../lib/scroll-to-section";
import { cn } from "../lib/utils";
import { useScrollSpy } from "../lib/use-scroll-spy";

export type TableOfContentsItem = {
  id: string;
  title: string;
  level?: 2 | 3;
};

export type TableOfContentsProps = {
  items: TableOfContentsItem[];
  activeId?: string | null;
  className?: string;
  heading?: string;
  scrollRoot?: Element | null;
  scrollOffset?: number;
  onItemClick?: (id: string) => void;
};

export function TableOfContents({
  items,
  activeId,
  className,
  heading = "On this page",
  scrollRoot = null,
  scrollOffset = 96,
  onItemClick
}: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    if (onItemClick) {
      onItemClick(id);
      return;
    }
    scrollToSection(id, { root: scrollRoot, offset: scrollOffset });
  };

  return (
    <nav aria-label={heading} className={cn("text-sm", className)}>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{heading}</p>
      <ul className="grid gap-1.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className={cn(item.level === 3 && "pl-3")}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block rounded-sm py-0.5 leading-snug transition-colors hover:text-foreground",
                  isActive ? "font-medium text-primary" : "text-muted-foreground"
                )}
                onClick={(event) => handleClick(event, item.id)}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type TableOfContentsLayoutProps = {
  toc: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function TableOfContentsLayout({ toc, children, className, contentClassName }: TableOfContentsLayoutProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] xl:grid-cols-[12rem_minmax(0,1fr)]", className)}>
      <aside className="hidden lg:block">
        <div className="sticky top-24">{toc}</div>
      </aside>
      <div className={cn("min-w-0", contentClassName)}>{children}</div>
    </div>
  );
}

export type TableOfContentsPanelProps = Omit<TableOfContentsProps, "activeId"> & {
  observe?: boolean;
};

/** Convenience panel: optional built-in scrollspy over `items` ids. */
export function TableOfContentsPanel({ items, observe = true, scrollRoot = null, scrollOffset = 96, ...props }: TableOfContentsPanelProps) {
  const ids = React.useMemo(() => items.map((item) => item.id), [items]);
  const activeId = useScrollSpy({
    ids,
    root: scrollRoot,
    offset: scrollOffset,
    enabled: observe && items.length > 0
  });

  return (
    <TableOfContents
      {...props}
      items={items}
      activeId={activeId}
      scrollRoot={scrollRoot}
      scrollOffset={scrollOffset}
    />
  );
}

export { useScrollSpy } from "../lib/use-scroll-spy";
export { slugifyHeading } from "../lib/slugify-heading";
export { scrollToSection } from "../lib/scroll-to-section";
