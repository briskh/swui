import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva("inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium", {
  variants: {
    variant: {
      default: "border-border bg-muted text-muted-foreground",
      ready: "border-[color:var(--status-ready)]/30 bg-[color:var(--status-ready)]/10 text-[color:var(--status-ready)]",
      loading: "border-[color:var(--status-loading)]/30 bg-[color:var(--status-loading)]/10 text-[color:var(--status-loading)]",
      error: "border-destructive/30 bg-destructive/10 text-destructive",
      success: "border-[color:var(--status-ready)]/30 bg-[color:var(--status-ready)]/10 text-[color:var(--status-ready)]",
      warning: "border-[color:var(--status-error)]/30 bg-[color:var(--status-error)]/10 text-[color:var(--status-error)]",
      destructive: "border-destructive/30 bg-destructive/10 text-destructive",
      outline: "border-border bg-card text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { badgeVariants };

