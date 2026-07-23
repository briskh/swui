import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const chipVariants = cva("inline-flex items-center rounded px-2 py-1 font-mono text-xs", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      outline: "border border-border bg-card text-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export type ChipProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>;

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(chipVariants({ variant, className }))} {...props} />
));

Chip.displayName = "Chip";

export { chipVariants };
