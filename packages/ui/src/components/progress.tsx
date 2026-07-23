import * as React from "react";
import { cn } from "../lib/utils";

export const Progress = React.forwardRef<HTMLProgressElement, React.ComponentPropsWithoutRef<"progress">>(
  ({ className, max = 100, ...props }, ref) => (
    <progress
      ref={ref}
      max={max}
      className={cn(
        "h-2 w-full appearance-none overflow-hidden rounded-full bg-muted",
        "[&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-muted",
        "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:transition-[width]",
        "[&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary",
        className
      )}
      {...props}
    />
  )
);
Progress.displayName = "Progress";
