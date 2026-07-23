import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva("grid gap-1 rounded-md border p-4 text-sm", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      success: "border-[color:var(--status-ready)]/30 bg-[color:var(--status-ready)]/10 text-[color:var(--status-ready)]",
      warning: "border-[color:var(--status-error)]/30 bg-[color:var(--status-error)]/10 text-[color:var(--status-error)]",
      destructive: "border-destructive/50 bg-destructive/10 text-destructive"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
  ({ className, variant, ...props }, ref) => <div ref={ref} className={cn(alertVariants({ variant, className }))} {...props} />
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn("font-semibold leading-none tracking-normal", className)} {...props} />
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm leading-5", className)} {...props} />
);
AlertDescription.displayName = "AlertDescription";
