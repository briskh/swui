import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

export type InlineNoticeProps = {
  children: React.ReactNode;
  className?: string;
};

export function InlineNotice({ children, className }: InlineNoticeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium text-[color:var(--status-ready)]", className)}>
      <Check className="size-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}
