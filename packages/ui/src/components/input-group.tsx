import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

/**
 * Input Group composition: groups Input with leading/trailing addons or buttons.
 * Documented composition pattern; not a single Radix primitive.
 */
export const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group"
      className={cn(
        "flex h-control-md w-full items-stretch overflow-hidden rounded-md border border-input bg-background shadow-sm has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring has-[:disabled]:opacity-60",
        className
      )}
      {...props}
    />
  )
);
InputGroup.displayName = "InputGroup";

export const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input-group-input"
      className={cn(
        "min-w-0 flex-1 h-full border-0 bg-transparent px-3 py-0 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed aria-invalid:text-destructive",
        className
      )}
      {...props}
    />
  )
);
InputGroupInput.displayName = "InputGroupInput";

export type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "inline-start" | "inline-end";
};

export const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex h-full shrink-0 items-center border-input bg-muted px-3 text-sm text-muted-foreground",
        align === "inline-start" ? "border-r" : "border-l",
        className
      )}
      {...props}
    />
  )
);
InputGroupAddon.displayName = "InputGroupAddon";

export type InputGroupButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "icon";
};

export const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, variant = "outline", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="input-group-button"
        className={cn(
          buttonVariants({ variant, size }),
          "h-auto shrink-0 rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupButton.displayName = "InputGroupButton";
