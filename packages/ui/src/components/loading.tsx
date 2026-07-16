import * as React from "react";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { cn } from "../lib/utils";

export function InlineLoading({
  children = "Loading",
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)} {...props}>
      <Spinner className="size-4" />
      <span>{children}</span>
    </span>
  );
}

export function LoadingButtonContent({ children, className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} {...props}>
      <Spinner data-icon="inline-start" className="size-4" />
      <span>{children}</span>
    </span>
  );
}

export function SkeletonStack({
  className,
  rows = ["h-5 w-40", "h-10 w-full", "h-10 w-3/4"],
  ...props
}: React.ComponentProps<"div"> & { rows?: string[] }) {
  return (
    <div className={cn("grid gap-2", className)} aria-label="Loading skeleton example" {...props}>
      {rows.map((row, index) => (
        <Skeleton key={`${row}-${index}`} className={row} />
      ))}
    </div>
  );
}

export function StaleDataRefresh({
  label,
  detail,
  className,
  ...props
}: React.ComponentProps<"div"> & { label: string; detail: string }) {
  return (
    <div className={cn("flex items-start gap-3 rounded-md border bg-muted/30 p-3 text-sm", className)} {...props}>
      <Spinner className="mt-0.5 size-4" />
      <div className="grid gap-1">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{detail}</span>
      </div>
    </div>
  );
}

export function ProgressBlock({
  label,
  value,
  status,
  className,
  ...props
}: React.ComponentProps<"div"> & { label: string; value: number; status: string }) {
  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{status}</span>
      </div>
      <Progress value={value} aria-label={`${label} progress`} />
    </div>
  );
}

