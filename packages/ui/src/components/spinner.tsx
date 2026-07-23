import * as React from "react";
import { Loader2Icon } from "lucide-react";

import { cn } from "../lib/utils";

function Spinner({
  className,
  role,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}: React.ComponentProps<"svg">) {
  const isAnnounced = role != null || ariaLabel != null;

  return (
    <Loader2Icon
      role={role ?? (ariaLabel ? "status" : undefined)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (isAnnounced ? undefined : true)}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
