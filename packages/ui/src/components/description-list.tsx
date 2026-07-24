import * as React from "react";
import { cn } from "../lib/utils";
import { Chip } from "./chip";
import { CopyableText } from "./copyable-text";

type DescriptionListColumns = 1 | 2 | 3;

type DescriptionListContextValue = {
  columns: DescriptionListColumns | "responsive";
  compact: boolean;
};

const DescriptionListContext = React.createContext<DescriptionListContextValue>({
  columns: "responsive",
  compact: false
});

function labelToAccessibleName(label: React.ReactNode): string {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }
  return "value";
}

function isBlankChildren(children: React.ReactNode): boolean {
  return children === null || children === undefined || children === "";
}

export type DescriptionListProps = React.HTMLAttributes<HTMLDListElement> & {
  columns?: DescriptionListColumns;
  compact?: boolean;
};

const columnsClassName: Record<DescriptionListColumns | "responsive", string> = {
  responsive: "grid-cols-1 md:grid-cols-2",
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3"
};

/** Semantic read-only label/value grid for detail pages. */
export function DescriptionList({
  columns,
  compact = false,
  className,
  children,
  ...props
}: DescriptionListProps) {
  const resolvedColumns: DescriptionListColumns | "responsive" = columns ?? "responsive";

  return (
    <DescriptionListContext.Provider value={{ columns: resolvedColumns, compact }}>
      <dl
        className={cn(
          "grid",
          columnsClassName[resolvedColumns],
          compact ? "gap-x-4 gap-y-2" : "gap-x-6 gap-y-4",
          className
        )}
        {...props}
      >
        {children}
      </dl>
    </DescriptionListContext.Provider>
  );
}

export type DescriptionItemProps = {
  label: React.ReactNode;
  children?: React.ReactNode;
  hint?: React.ReactNode;
  span?: "full" | 2 | 3;
  mono?: boolean;
  truncate?: boolean;
  copyable?: boolean | string;
  empty?: React.ReactNode;
  values?: string[];
  className?: string;
};

function spanClassName(
  span: DescriptionItemProps["span"],
  columns: DescriptionListColumns | "responsive"
): string | undefined {
  if (!span) {
    return undefined;
  }
  if (span === "full") {
    if (columns === "responsive") {
      return "col-span-1 md:col-span-2";
    }
    return columns === 1 ? "col-span-1" : columns === 2 ? "col-span-2" : "col-span-3";
  }
  if (span === 2) {
    return columns === "responsive" ? "col-span-1 md:col-span-2" : "col-span-2";
  }
  return "col-span-3";
}

/** One label/value pair inside DescriptionList. */
export function DescriptionItem({
  label,
  children,
  hint,
  span,
  mono = false,
  truncate = false,
  copyable,
  empty = "—",
  values,
  className
}: DescriptionItemProps) {
  const { columns, compact } = React.useContext(DescriptionListContext);
  const accessibleLabel = labelToAccessibleName(label);

  const hasValues = Array.isArray(values) && values.length > 0;
  const useChildren = !isBlankChildren(children);
  const showEmpty = !useChildren && !hasValues;

  let valueContent: React.ReactNode;
  if (showEmpty) {
    valueContent = <span className="text-muted-foreground">{empty}</span>;
  } else if (useChildren) {
    valueContent = children;
  } else {
    valueContent = (
      <span className="flex flex-wrap gap-1.5">
        {values!.map((value) => (
          <Chip key={value}>{value}</Chip>
        ))}
      </span>
    );
  }

  const stringChild = typeof children === "string" ? children : undefined;
  const copyPayload = typeof copyable === "string" ? copyable : stringChild;
  const shouldCopy = Boolean(copyable) && typeof copyPayload === "string" && copyPayload.length > 0;

  if (shouldCopy) {
    const displayNode =
      useChildren && typeof children !== "string" ? (
        <span className={cn(mono && "font-mono", truncate && "block truncate")}>{children}</span>
      ) : truncate ? (
        <span className="block truncate" title={copyPayload}>
          {copyPayload}
        </span>
      ) : undefined;
    valueContent = (
      <CopyableText
        value={copyPayload}
        display={displayNode}
        mono={mono && !displayNode}
        copyLabel={`Copy ${accessibleLabel}`}
        copiedLabel={`Copied ${accessibleLabel}`}
      />
    );
  } else if (mono || truncate) {
    const title = truncate && typeof valueContent === "string" ? valueContent : undefined;
    valueContent = (
      <span className={cn(mono && "font-mono", truncate && "block truncate")} title={title}>
        {valueContent}
      </span>
    );
  }

  return (
    <div className={cn("min-w-0", spanClassName(span, columns), className)}>
      <dt className={cn("text-sm text-muted-foreground", compact ? "leading-5" : "leading-6")}>{label}</dt>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      <dd className={cn("min-w-0 text-sm text-foreground", compact ? "mt-0.5 leading-5" : "mt-1 leading-6")}>
        {valueContent}
      </dd>
    </div>
  );
}

export type DescriptionSectionProps = React.HTMLAttributes<HTMLElement> & {
  title: React.ReactNode;
  description?: React.ReactNode;
};

/** Titled partition for detail-page field groups. Compose with Card when a panel is needed. */
export function DescriptionSection({
  title,
  description,
  className,
  children,
  ...props
}: DescriptionSectionProps) {
  return (
    <section className={cn("grid gap-3", className)} {...props}>
      <header className="grid gap-1">
        <h3 className="text-base font-semibold leading-tight text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
