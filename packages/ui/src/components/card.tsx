import * as React from "react";
import { cn } from "../lib/utils";

const cardEdgeRowClass = "min-h-11 px-4";
/** Content band from title-only reference card (~85px incl. p-4); footer/actions sit outside this region. */
const cardContentClass = "min-h-[5.3125rem] p-4";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-md border border-border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col justify-center gap-1 border-b border-border py-2.5", cardEdgeRowClass, className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-base font-semibold leading-tight", className)} {...props} />
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cardContentClass, className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-2", cardEdgeRowClass, className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";
