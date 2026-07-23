import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";

export const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav aria-label="Pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
);

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row flex-wrap items-center justify-center gap-1", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

export const PaginationLink = ({ className, isActive, size = "default", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      size === "icon" ? "size-control-md" : "h-control-md px-4",
      isActive ? "border border-input bg-background" : "hover:bg-muted hover:text-foreground",
      className
    )}
    {...props}
  />
);

export const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="size-4" aria-hidden="true" />
    Previous
  </PaginationLink>
);

export const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" className={cn("gap-1 pr-2.5", className)} {...props}>
    Next
    <ChevronRight className="size-4" aria-hidden="true" />
  </PaginationLink>
);

export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span className={cn("flex h-control-md items-center justify-center px-4", className)} {...props}>
    <MoreHorizontal className="size-4" aria-hidden="true" />
    <span className="sr-only">More pages</span>
  </span>
);

export const PaginationButton = ({ className, ...props }: ButtonProps) => <Button variant="ghost" className={className} {...props} />;
