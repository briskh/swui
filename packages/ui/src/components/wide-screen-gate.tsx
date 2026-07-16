import { Monitor } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function WideScreenPlaceholder({
  title = "Wider screen required",
  description = "This view needs a desktop or tablet in landscape. Switch to a PC or widen the browser window to continue.",
  className
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid min-h-40 place-items-center rounded-md border border-dashed bg-muted/20 p-6 text-center",
        className
      )}
      role="status"
    >
      <div className="grid max-w-md gap-3">
        <Monitor className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function WideScreenGate({
  children,
  title,
  description,
  className
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="hidden min-data-dense:block">{children}</div>
      <WideScreenPlaceholder title={title} description={description} className="hidden max-data-dense:block" />
    </div>
  );
}
