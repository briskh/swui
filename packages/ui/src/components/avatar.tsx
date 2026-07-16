import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square size-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="avatar-group" className={cn("flex -space-x-2", className)} {...props} />;
}

const avatarStatusVariants = cva("absolute bottom-0 right-0 block size-3 rounded-full border-2 border-background", {
  variants: {
    status: {
      ready: "bg-success",
      loading: "bg-warning",
      error: "bg-destructive",
      inactive: "bg-muted-foreground"
    }
  },
  defaultVariants: {
    status: "ready"
  }
});

export function AvatarStatus({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarStatusVariants>) {
  return <span data-slot="avatar-status" data-status={status ?? "ready"} className={cn(avatarStatusVariants({ status, className }))} {...props} />;
}

export function AvatarOverflow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-overflow"
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
