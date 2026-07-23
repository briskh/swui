import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type ServerDataTableSortDirection = "asc" | "desc";

export type ServerDataTableColumn<TData, TSortKey extends string = string> = {
  id: string;
  header: React.ReactNode;
  /** Filter control rendered below the sort label in the same header cell. */
  headerFilter?: React.ReactNode;
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
  sortable?: {
    key: TSortKey;
    label: string;
  };
  cell: (row: TData) => React.ReactNode;
};

export type ServerDataTableLoadMoreState = {
  hasMore: boolean;
  isLoading: boolean;
  label: string;
  loadingLabel: string;
  onLoadMore: () => void;
};

export type ServerDataTableProps<TData, TSortKey extends string = string> = {
  columns: ServerDataTableColumn<TData, TSortKey>[];
  rows: TData[];
  getRowId: (row: TData) => string;
  sortKey?: TSortKey;
  sortDirection?: ServerDataTableSortDirection;
  onSortChange?: (key: TSortKey, direction: ServerDataTableSortDirection) => void;
  searchControl?: React.ReactNode;
  filterControl?: React.ReactNode;
  summary?: React.ReactNode;
  emptyMessage: string;
  loadMore?: ServerDataTableLoadMoreState;
  bodyMaxHeightClassName?: string;
  /** When true, stretch the table card so its bottom border sits `viewportBottomInsetPx` above the viewport bottom. */
  fillViewport?: boolean;
  /** Distance from viewport bottom to table card bottom; default matches `h-control-lg` (40px). */
  viewportBottomInsetPx?: number;
  rowClassName?: string | ((row: TData) => string | undefined);
  scrollResetKey?: React.Key;
  className?: string;
};

function columnWidthStyle(width: string | undefined): React.CSSProperties | undefined {
  return width ? { width } : undefined;
}

/** Align integrated header filters with sort label text (`-ml-2 px-2` on `ServerDataTableSortHeader`). */
export const serverDataTableHeaderFilterAlignClassName = "-ml-2 w-[calc(100%+0.5rem)]";

/** Header filter typography: same size/tracking as sort labels, lighter weight. */
export const serverDataTableHeaderFilterTextClassName = "text-xs font-normal uppercase tracking-wide leading-tight";

/** Shared chrome for header filter triggers: no border/background shift between ALL and active states. */
export const serverDataTableHeaderFilterShellClassName =
  "border-transparent bg-transparent shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg]:opacity-70";

export function serverDataTableHeaderFilterTriggerClassName(active: boolean): string {
  return cn(
    serverDataTableHeaderFilterTextClassName,
    serverDataTableHeaderFilterShellClassName,
    "h-control-micro w-full gap-1 px-2 py-0 transition-colors [&_svg]:size-3",
    active ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-muted-foreground"
  );
}

export const serverDataTableHeaderFilterItemClassName = cn(serverDataTableHeaderFilterTextClassName, "py-1");

/** Default body cell padding for ServerDataTable rows. */
export const serverDataTableCellClassName = "px-2 py-1.5 align-middle";

/** Fixed body row height (56px / 3.5rem). Applied by default on every data row. */
export const serverDataTableRowClassName = "h-14";

/** Default number of body rows visible in the scroll viewport before scrolling. */
export const serverDataTableDefaultVisibleRowCount = 10;

/** Tailwind class for default viewport bottom inset (40px semantic large-control scale). */
export const serverDataTableViewportBottomInsetClassName = "h-control-lg";

/** Pixel distance from viewport bottom to table card bottom when `fillViewport` is enabled. */
export const serverDataTableViewportBottomInsetPx = 48;

/** Default scroll viewport height for ten ServerDataTable body rows at `h-14` each (used when `fillViewport` is false). */
export const serverDataTableDefaultBodyMaxHeightClassName = "max-h-[calc(10*(3.5rem+1px))]";

/** Bottom scroll/more indicator strip inside the table body viewport (`h-14` gradient band). */
export const serverDataTableMoreIndicatorClassName =
  "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-14 items-center justify-center bg-gradient-to-t from-card from-40% via-card/90 to-transparent px-4";

/** Vertical stack of chevrons; negative spacing overlaps icons into a compact cue. */
export const serverDataTableMoreIndicatorStackClassName = "flex flex-col items-center -space-y-2.5";

export const serverDataTableMoreIndicatorIconClassName = "shrink-0 text-primary";

function useServerDataTableViewportHeight(
  rootRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  bottomInsetPx: number,
  remeasureKey: React.Key | undefined
): number | undefined {
  const [viewportHeight, setViewportHeight] = React.useState<number | undefined>();

  React.useLayoutEffect(() => {
    if (!enabled) {
      setViewportHeight(undefined);
      return;
    }

    const update = () => {
      const element = rootRef.current;
      if (!element) {
        return;
      }
      const top = element.getBoundingClientRect().top;
      const next = Math.floor(window.innerHeight - top - bottomInsetPx);
      setViewportHeight(next > 0 ? next : undefined);
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    window.visualViewport?.addEventListener("resize", update);

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    let parent = rootRef.current?.parentElement;
    while (parent) {
      resizeObserver?.observe(parent);
      parent = parent.parentElement;
    }

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      window.visualViewport?.removeEventListener("resize", update);
      resizeObserver?.disconnect();
    };
  }, [bottomInsetPx, enabled, remeasureKey, rootRef]);

  return viewportHeight;
}

function useBodyScrollHasMoreBelow(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  rowsLength: number,
  hasServerMore: boolean,
  deps: React.DependencyList
): boolean {
  const [hasMoreBelow, setHasMoreBelow] = React.useState(
    () => rowsLength > serverDataTableDefaultVisibleRowCount || hasServerMore
  );

  React.useEffect(() => {
    if (hasServerMore) {
      setHasMoreBelow(true);
      return;
    }

    const element = scrollRef.current;
    if (!element) {
      setHasMoreBelow(rowsLength > serverDataTableDefaultVisibleRowCount);
      return;
    }

    const update = () => {
      setHasMoreBelow(element.scrollHeight - element.scrollTop - element.clientHeight > 4);
    };

    update();
    element.addEventListener("scroll", update, { passive: true });
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    resizeObserver?.observe(element);

    return () => {
      element.removeEventListener("scroll", update);
      resizeObserver?.disconnect();
    };
  }, [hasServerMore, rowsLength, scrollRef, ...deps]);

  return hasMoreBelow;
}

function ServerDataTableMoreIndicator({ isLoading }: { isLoading?: boolean }) {
  const pulseClass = isLoading ? "animate-pulse" : undefined;

  return (
    <div className={serverDataTableMoreIndicatorClassName} aria-hidden="true">
      <div className={serverDataTableMoreIndicatorStackClassName}>
        <ChevronDown className={cn(serverDataTableMoreIndicatorIconClassName, "size-4 opacity-35", pulseClass)} />
        <ChevronDown className={cn(serverDataTableMoreIndicatorIconClassName, "size-4 opacity-60", pulseClass)} />
        <ChevronDown className={cn(serverDataTableMoreIndicatorIconClassName, "size-5", pulseClass)} />
      </div>
    </div>
  );
}

function resolveRowClassName<TData>(row: TData, rowClassName: ServerDataTableProps<TData>["rowClassName"]): string | undefined {
  return typeof rowClassName === "function" ? rowClassName(row) : rowClassName;
}

export function ServerDataTable<TData, TSortKey extends string = string>({
  columns,
  rows,
  getRowId,
  sortKey,
  sortDirection = "asc",
  onSortChange,
  searchControl,
  filterControl,
  summary,
  emptyMessage,
  loadMore,
  bodyMaxHeightClassName = serverDataTableDefaultBodyMaxHeightClassName,
  fillViewport = true,
  viewportBottomInsetPx = serverDataTableViewportBottomInsetPx,
  rowClassName,
  scrollResetKey,
  className
}: ServerDataTableProps<TData, TSortKey>) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const viewportHeight = useServerDataTableViewportHeight(rootRef, fillViewport, viewportBottomInsetPx, scrollResetKey);
  const useViewportBodyHeight = fillViewport && viewportHeight != null;
  const hasScrollableRowsBelow = useBodyScrollHasMoreBelow(scrollRef, rows.length, Boolean(loadMore?.hasMore), [
    loadMore?.isLoading
  ]);
  const showMoreIndicator = hasScrollableRowsBelow;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [scrollResetKey, sortKey, sortDirection]);

  React.useEffect(() => {
    if (!loadMore?.hasMore || loadMore.isLoading || typeof IntersectionObserver === "undefined") {
      return;
    }
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore.onLoadMore();
        }
      },
      { root: scrollRef.current, rootMargin: "160px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const integratedHeaderFilters = columns.some((column) => column.headerFilter != null);
  const showToolbarRow = Boolean(searchControl || filterControl || summary);
  const showSummaryInToolbar = Boolean(summary && (searchControl || filterControl || !integratedHeaderFilters));
  const showSummaryOverlay = Boolean(summary && integratedHeaderFilters && !searchControl && !filterControl);

  return (
    <div ref={rootRef} className={cn("grid min-w-0 gap-2", className)}>
      <Card
        className={cn("relative min-w-0 overflow-hidden", useViewportBodyHeight && "flex min-h-0 flex-col")}
        style={useViewportBodyHeight ? { height: viewportHeight, maxHeight: viewportHeight } : undefined}
      >
        <CardContent
          className={cn(
            "relative min-w-0 pb-0 pl-4 pr-1",
            useViewportBodyHeight && "flex min-h-0 flex-1 flex-col overflow-hidden",
            filterControl
              ? "pt-24"
              : searchControl || showSummaryInToolbar
                ? "pt-16"
                : showSummaryOverlay
                  ? "pt-10"
                  : integratedHeaderFilters
                    ? "pt-4"
                    : "pt-4"
          )}
        >
          {showToolbarRow ? (
            <div className="absolute left-4 right-5 top-4 grid min-w-0 gap-2">
              <div className="flex min-w-0 items-center gap-6">
                {searchControl ? <div className="flex min-w-0 flex-wrap items-center gap-2">{searchControl}</div> : null}
                {showSummaryInToolbar ? (
                  <p
                    className="ml-auto min-w-fit shrink-0 truncate text-right text-sm text-muted-foreground"
                    aria-live="polite"
                    title={typeof summary === "string" ? summary : undefined}
                  >
                    {summary}
                  </p>
                ) : null}
              </div>
              {filterControl ? (
                <div className="flex min-w-0 flex-wrap items-center gap-2">{filterControl}</div>
              ) : null}
            </div>
          ) : null}
          {showSummaryOverlay ? (
            <p
              className="absolute right-5 top-3 min-w-fit shrink-0 truncate text-right text-sm text-muted-foreground"
              aria-live="polite"
              title={typeof summary === "string" ? summary : undefined}
            >
              {summary}
            </p>
          ) : null}
          <div className={cn("relative min-w-0", useViewportBodyHeight && "min-h-0 flex-1")}>
            <div
              ref={scrollRef}
              className={cn(
                "min-w-0 overflow-auto scrollbar-gutter-stable",
                useViewportBodyHeight ? "h-full min-h-0" : bodyMaxHeightClassName
              )}
            >
              <div className="pr-4">
                <table className="w-full caption-bottom border-collapse text-sm table-fixed">
                  <ServerDataTableColGroup columns={columns} />
                  <TableHeader className="sticky top-0 z-10 bg-card [&_th]:bg-card">
                    <TableRow>
                      {columns.map((column) => (
                        <ServerDataTableHeaderCell
                          key={column.id}
                          column={column}
                          sortKey={sortKey}
                          sortDirection={sortDirection}
                          onSortChange={onSortChange}
                        />
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length > 0 ? (
                      rows.map((row) => (
                        <TableRow key={getRowId(row)} className={cn(serverDataTableRowClassName, resolveRowClassName(row, rowClassName))}>
                          {columns.map((column) => (
                            <TableCell key={column.id} className={cn(serverDataTableCellClassName, column.cellClassName)}>
                              {column.cell(row)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className={cn(serverDataTableCellClassName, "h-20 text-center text-muted-foreground")}>
                          {emptyMessage}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
                {loadMore?.hasMore ? (
                  <>
                    <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden="true" />
                    <span className="sr-only">{loadMore.isLoading ? loadMore.loadingLabel : loadMore.label}</span>
                  </>
                ) : null}
              </div>
            </div>
            {showMoreIndicator && rows.length > 0 ? <ServerDataTableMoreIndicator isLoading={loadMore?.isLoading} /> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServerDataTableHeaderCell<TData, TSortKey extends string>({
  column,
  sortKey,
  sortDirection,
  onSortChange
}: {
  column: ServerDataTableColumn<TData, TSortKey>;
  sortKey?: TSortKey;
  sortDirection: ServerDataTableSortDirection;
  onSortChange?: (key: TSortKey, direction: ServerDataTableSortDirection) => void;
}) {
  const sortable = column.sortable;

  return (
    <TableHead className={cn("align-top px-2 pb-1.5 pt-2", column.headerClassName)}>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="min-h-7">
          {sortable && onSortChange ? (
            <ServerDataTableSortHeader
              label={sortable.label}
              active={sortKey === sortable.key}
              direction={sortDirection}
              onToggle={() => {
                const nextDirection = sortKey === sortable.key && sortDirection === "asc" ? "desc" : "asc";
                onSortChange(sortable.key, nextDirection);
              }}
            />
          ) : (
            column.header
          )}
        </div>
        {column.headerFilter ? (
          <div className={cn("min-w-0", serverDataTableHeaderFilterAlignClassName)}>{column.headerFilter}</div>
        ) : null}
      </div>
    </TableHead>
  );
}

function ServerDataTableColGroup<TData, TSortKey extends string>({ columns }: { columns: ServerDataTableColumn<TData, TSortKey>[] }) {
  return (
    <colgroup>
      {columns.map((column) => (
        <col key={column.id} style={columnWidthStyle(column.width)} />
      ))}
    </colgroup>
  );
}

function ServerDataTableSortHeader({
  label,
  active,
  direction,
  onToggle
}: {
  label: string;
  active: boolean;
  direction: ServerDataTableSortDirection;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-2 gap-1 font-semibold uppercase tracking-wide text-muted-foreground"
      onClick={onToggle}
      aria-label={`Sort by ${label}${active ? (direction === "asc" ? ", ascending" : ", descending") : ""}`}
    >
      {label}
      {active ? (
        direction === "asc" ? (
          <ArrowUp className="size-4" aria-hidden="true" />
        ) : (
          <ArrowDown className="size-4" aria-hidden="true" />
        )
      ) : (
        <ArrowUpDown className="size-4 opacity-50" aria-hidden="true" />
      )}
    </Button>
  );
}
